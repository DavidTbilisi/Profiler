<template>
  <div class="skill-dependency-map bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">🗺️ Skill Dependency Map</h2>
      <div class="flex gap-2">
        <button
          @click="toggleEditMode"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            isEditMode 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ isEditMode ? '✅ Done Editing' : '✏️ Edit Dependencies' }}
        </button>
        <button
          @click="resetZoom"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          🔍 Reset Zoom
        </button>
      </div>
    </div>

    <!-- Legend -->
    <div class="mb-4 p-3 bg-gray-50 rounded-lg">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Legend:</h3>
      <div class="flex flex-wrap gap-4 text-xs">
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Available (can learn)</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>Blocked (prerequisites not met)</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Learned (proficiency ≥ 5)</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
          <span>Not started</span>
        </div>
      </div>
      
      <!-- Demo Data Button -->
      <div class="ml-4 flex gap-2">
        <button
          @click="loadDemoData"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Load Demo Data
        </button>
        <button
          @click="checkStorage"
          class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Check Storage
        </button>
      </div>
    </div>

    <!-- SVG Container -->
    <div class="relative border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
      <svg
        ref="svgContainer"
        :width="svgWidth"
        :height="svgHeight"
        class="cursor-move"
        @mousedown="startPan"
        @mousemove="pan"
        @mouseup="endPan"
        @wheel="zoom"
      >
        <!-- Transform group for zoom/pan -->
        <g :transform="`translate(${panX}, ${panY}) scale(${zoomLevel})`">
          <!-- Dependency lines -->
          <g class="dependencies">
            <line
              v-for="dep in visibleDependencies"
              :key="`${dep.fromSkillId}-${dep.toSkillId}`"
              :x1="getSkillPosition(dep.fromSkillId).x + nodeRadius"
              :y1="getSkillPosition(dep.fromSkillId).y + nodeRadius"
              :x2="getSkillPosition(dep.toSkillId).x + nodeRadius"
              :y2="getSkillPosition(dep.toSkillId).y + nodeRadius"
              stroke="#6b7280"
              stroke-width="2"
              marker-end="url(#arrowhead)"
              class="transition-all duration-200"
            />
          </g>

          <!-- Skill nodes -->
          <g class="skills">
            <g
              v-for="skill in positionedSkills"
              :key="skill.id"
              :transform="`translate(${skill.x}, ${skill.y})`"
              class="skill-node cursor-pointer"
              @click="selectSkill(skill)"
            >
              <!-- Node circle -->
              <circle
                :r="nodeRadius"
                :fill="getSkillColor(skill)"
                :stroke="selectedSkill?.id === skill.id ? '#3b82f6' : '#374151'"
                :stroke-width="selectedSkill?.id === skill.id ? 3 : 1"
                class="drop-shadow-sm transition-all duration-200"
              />
              
              <!-- Proficiency indicator -->
              <circle
                :r="nodeRadius * 0.7"
                fill="none"
                :stroke="getSkillColor(skill)"
                stroke-width="2"
                :stroke-dasharray="`${(skill.proficiency / 10) * (2 * Math.PI * nodeRadius * 0.7)} ${2 * Math.PI * nodeRadius * 0.7}`"
                stroke-linecap="round"
                class="opacity-60"
              />
              
              <!-- Skill name -->
              <text
                :x="nodeRadius"
                :y="nodeRadius + 25"
                text-anchor="middle"
                class="text-xs font-medium fill-gray-700 pointer-events-none"
              >
                {{ truncateText(skill.name, 12) }}
              </text>
              
              <!-- Proficiency level -->
              <text
                :x="nodeRadius"
                :y="nodeRadius + 5"
                text-anchor="middle"
                class="text-xs font-bold fill-white pointer-events-none"
              >
                {{ skill.proficiency }}
              </text>
              
              <!-- Category icon -->
              <text
                :x="nodeRadius"
                :y="nodeRadius - 5"
                text-anchor="middle"
                class="text-sm pointer-events-none"
              >
                {{ getCategoryIcon(skill.category) }}
              </text>
            </g>
          </g>
        </g>

        <!-- Arrow marker definition -->
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6b7280"
            />
          </marker>
        </defs>
      </svg>

      <!-- Loading overlay -->
      <div v-if="isCalculatingLayout" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin text-2xl mb-2">⚙️</div>
          <p class="text-gray-600">Calculating optimal layout...</p>
        </div>
      </div>
    </div>

    <!-- Selected skill details -->
    <div v-if="selectedSkill" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 class="text-lg font-semibold text-blue-800 mb-2">
        {{ getCategoryIcon(selectedSkill.category) }} {{ selectedSkill.name }}
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="font-medium text-gray-700 mb-2">📋 Details</h4>
          <p class="text-sm text-gray-600 mb-1">
            <strong>Category:</strong> {{ selectedSkill.category }}
          </p>
          <p class="text-sm text-gray-600 mb-1">
            <strong>Proficiency:</strong> {{ selectedSkill.proficiency }}/10 ({{ getProficiencyText(selectedSkill.proficiency) }})
          </p>
          <p v-if="selectedSkill.description" class="text-sm text-gray-600">
            <strong>Description:</strong> {{ selectedSkill.description }}
          </p>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-700 mb-2">🔗 Dependencies</h4>
          <div class="mb-3">
            <p class="text-sm font-medium text-gray-600 mb-1">Prerequisites:</p>
            <div v-if="getPrerequisites(selectedSkill.id).length > 0" class="space-y-1">
              <div
                v-for="prereq in getPrerequisites(selectedSkill.id)"
                :key="prereq.id"
                class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded flex justify-between items-center"
              >
                <span>{{ prereq.name }} ({{ prereq.proficiency }}/10)</span>
                <button
                  v-if="isEditMode"
                  @click="removeDependency(prereq.id, selectedSkill.id)"
                  class="text-red-500 hover:text-red-700 ml-2"
                  title="Remove dependency"
                >
                  ❌
                </button>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500 italic">No prerequisites</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Unlocks:</p>
            <div v-if="getUnlockedSkills(selectedSkill.id).length > 0" class="space-y-1">
              <div
                v-for="unlocked in getUnlockedSkills(selectedSkill.id)"
                :key="unlocked.id"
                class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex justify-between items-center"
              >
                <span>{{ unlocked.name }}</span>
                <button
                  v-if="isEditMode"
                  @click="removeDependency(selectedSkill.id, unlocked.id)"
                  class="text-red-500 hover:text-red-700 ml-2"
                  title="Remove dependency"
                >
                  ❌
                </button>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500 italic">Doesn't unlock any skills</p>
          </div>
        </div>
      </div>

      <!-- Edit mode: Add dependencies -->
      <div v-if="isEditMode" class="mt-4 pt-4 border-t border-blue-200">
        <h4 class="font-medium text-blue-700 mb-3">Add Dependencies</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Add Prerequisite (skill that must be learned first):
            </label>
            <select
              v-model="newPrerequisite"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a skill...</option>
              <option
                v-for="skill in availablePrerequisites"
                :key="skill.id"
                :value="skill.id"
              >
                {{ skill.name }} ({{ skill.proficiency }}/10)
              </option>
            </select>
            <button
              @click="addPrerequisite"
              :disabled="!newPrerequisite"
              class="mt-2 px-3 py-1 bg-orange-500 text-white rounded disabled:bg-gray-300"
            >
              Add Prerequisite
            </button>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Add Unlocked Skill (skill this enables):
            </label>
            <select
              v-model="newUnlockedSkill"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a skill...</option>
              <option
                v-for="skill in availableUnlockedSkills"
                :key="skill.id"
                :value="skill.id"
              >
                {{ skill.name }} ({{ skill.proficiency }}/10)
              </option>
            </select>
            <button
              @click="addUnlockedSkill"
              :disabled="!newUnlockedSkill"
              class="mt-2 px-3 py-1 bg-green-500 text-white rounded disabled:bg-gray-300"
            >
              Add Unlocked Skill
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Learning path section -->
    <div v-if="selectedSkill && learningPath.length > 1" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 class="text-lg font-semibold text-green-800 mb-3">🎯 Optimal Learning Path</h3>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(skill, index) in learningPath"
          :key="skill.id"
          class="flex items-center"
        >
          <div class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {{ index + 1 }}. {{ skill.name }}
          </div>
          <div v-if="index < learningPath.length - 1" class="mx-2 text-green-600">→</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'
import { getCategoryIcon } from '@/constants/skillCategories'
import type { Skill } from '@/stores/useProfileStore'

const store = useProfileStore()

// Component state
const isEditMode = ref(false)
const selectedSkill = ref<Skill | null>(null)
const isCalculatingLayout = ref(false)
const svgContainer = ref<SVGElement>()

// SVG dimensions and interaction
const svgWidth = ref(1000)
const svgHeight = ref(600)
const nodeRadius = 25
const panX = ref(0)
const panY = ref(0)
const zoomLevel = ref(1)
const isPanning = ref(false)
const lastPanPoint = ref({ x: 0, y: 0 })

// Dependency editing
const newPrerequisite = ref('')
const newUnlockedSkill = ref('')

// Computed properties
const visibleDependencies = computed(() => store.skillDependencies)

const positionedSkills = ref<Array<Skill & { x: number; y: number }>>([])

const availablePrerequisites = computed(() => {
  if (!selectedSkill.value) return []
  return store.skills.filter(skill => 
    skill.id !== selectedSkill.value!.id &&
    !getPrerequisites(selectedSkill.value!.id).some(p => p.id === skill.id) &&
    !store.wouldCreateCircularDependency(skill.id, selectedSkill.value!.id)
  )
})

const availableUnlockedSkills = computed(() => {
  if (!selectedSkill.value) return []
  return store.skills.filter(skill => 
    skill.id !== selectedSkill.value!.id &&
    !getUnlockedSkills(selectedSkill.value!.id).some(u => u.id === skill.id) &&
    !store.wouldCreateCircularDependency(selectedSkill.value!.id, skill.id)
  )
})

const learningPath = computed(() => {
  if (!selectedSkill.value) return []
  return store.getSkillLearningPath(selectedSkill.value.id)
})

// Methods
function toggleEditMode() {
  isEditMode.value = !isEditMode.value
  if (!isEditMode.value) {
    selectedSkill.value = null
  }
}

function selectSkill(skill: Skill) {
  selectedSkill.value = skill
}

function getSkillColor(skill: Skill): string {
  const prerequisites = getPrerequisites(skill.id)
  const isBlocked = prerequisites.some(prereq => prereq.proficiency < 5)
  
  if (skill.proficiency >= 8) return '#10b981' // Green - Expert/Advanced
  if (skill.proficiency >= 5) return '#3b82f6' // Blue - Learned
  if (isBlocked) return '#ef4444' // Red - Blocked
  if (skill.proficiency > 0) return '#f59e0b' // Yellow - In progress
  return '#6b7280' // Gray - Not started
}

function getPrerequisites(skillId: string): Skill[] {
  return store.skillDependencies
    .filter(dep => dep.toSkillId === skillId)
    .map(dep => store.skills.find(s => s.id === dep.fromSkillId))
    .filter(Boolean) as Skill[]
}

function getUnlockedSkills(skillId: string): Skill[] {
  return store.skillDependencies
    .filter(dep => dep.fromSkillId === skillId)
    .map(dep => store.skills.find(s => s.id === dep.toSkillId))
    .filter(Boolean) as Skill[]
}

function getProficiencyText(level: number): string {
  if (level <= 2) return 'Beginner'
  if (level <= 4) return 'Novice'
  if (level <= 6) return 'Intermediate'
  if (level <= 8) return 'Advanced'
  return 'Expert'
}

function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

function getSkillPosition(skillId: string): { x: number; y: number } {
  const skill = positionedSkills.value.find(s => s.id === skillId)
  return skill ? { x: skill.x, y: skill.y } : { x: 0, y: 0 }
}

function addPrerequisite() {
  if (newPrerequisite.value && selectedSkill.value) {
    try {
      store.addSkillDependency(newPrerequisite.value, selectedSkill.value.id)
      newPrerequisite.value = ''
    } catch (error) {
      alert('Cannot add dependency: ' + (error as Error).message)
    }
  }
}

function addUnlockedSkill() {
  if (newUnlockedSkill.value && selectedSkill.value) {
    try {
      store.addSkillDependency(selectedSkill.value.id, newUnlockedSkill.value)
      newUnlockedSkill.value = ''
    } catch (error) {
      alert('Cannot add dependency: ' + (error as Error).message)
    }
  }
}

function removeDependency(fromSkillId: string, toSkillId: string) {
  store.removeSkillDependency(fromSkillId, toSkillId)
}

function loadDemoData() {
  if (confirm('This will replace all existing skills and dependencies with demo data. Continue?')) {
    store.addDemoSkillData()
    // Recalculate layout after data changes
    setTimeout(() => {
      calculateLayout()
    }, 100)
  }
}

function checkStorage() {
  try {
    const data = localStorage.getItem('life-tracker-data')
    if (data) {
      const parsed = JSON.parse(data)
      const deps = parsed.skillDependencies || []
      const skills = parsed.skills || []
      const aspirationalSkills = parsed.aspirationalSkills || []
      
      alert(`Storage Check Results:
📊 Skills: ${skills.length}
🎯 Aspirational Skills: ${aspirationalSkills.length}
🔗 Dependencies: ${deps.length}

Current State:
📊 Store Skills: ${store.skills.length}
🎯 Store Aspirational: ${store.aspirationalSkills.length}
🔗 Store Dependencies: ${store.skillDependencies.length}

${deps.length > 0 ? '✅ Dependencies are being saved!' : '⚠️ No dependencies in storage'}`)
    } else {
      alert('❌ No data found in localStorage')
    }
  } catch (error) {
    alert('❌ Error checking storage: ' + error)
  }
}

// Layout calculation
function calculateLayout() {
  isCalculatingLayout.value = true
  
  nextTick(() => {
    const skills = store.skills
    const dependencies = store.skillDependencies
    
    // Simple force-directed layout algorithm
    const nodes = skills.map(skill => ({
      ...skill,
      x: Math.random() * (svgWidth.value - 100) + 50,
      y: Math.random() * (svgHeight.value - 100) + 50,
      vx: 0,
      vy: 0
    }))
    
    // Simulation parameters
    const iterations = 100
    const k = Math.sqrt((svgWidth.value * svgHeight.value) / skills.length)
    
    for (let i = 0; i < iterations; i++) {
      // Reset forces
      nodes.forEach(node => {
        node.vx = 0
        node.vy = 0
      })
      
      // Repulsive forces between all nodes
      for (let j = 0; j < nodes.length; j++) {
        for (let k = j + 1; k < nodes.length; k++) {
          const dx = nodes[k].x - nodes[j].x
          const dy = nodes[k].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1
          const force = (k * k) / distance
          
          nodes[j].vx -= (dx / distance) * force
          nodes[j].vy -= (dy / distance) * force
          nodes[k].vx += (dx / distance) * force
          nodes[k].vy += (dy / distance) * force
        }
      }
      
      // Attractive forces for connected nodes
      dependencies.forEach(dep => {
        const fromNode = nodes.find(n => n.id === dep.fromSkillId)
        const toNode = nodes.find(n => n.id === dep.toSkillId)
        
        if (fromNode && toNode) {
          const dx = toNode.x - fromNode.x
          const dy = toNode.y - fromNode.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1
          const force = (distance * distance) / k
          
          fromNode.vx += (dx / distance) * force * 0.1
          fromNode.vy += (dy / distance) * force * 0.1
          toNode.vx -= (dx / distance) * force * 0.1
          toNode.vy -= (dy / distance) * force * 0.1
        }
      })
      
      // Apply forces and constraints
      nodes.forEach(node => {
        node.x += node.vx * 0.1
        node.y += node.vy * 0.1
        
        // Keep nodes within bounds
        node.x = Math.max(nodeRadius + 10, Math.min(svgWidth.value - nodeRadius - 10, node.x))
        node.y = Math.max(nodeRadius + 30, Math.min(svgHeight.value - nodeRadius - 30, node.y))
      })
    }
    
    positionedSkills.value = nodes
    isCalculatingLayout.value = false
  })
}

// Pan and zoom functionality
function startPan(event: MouseEvent) {
  isPanning.value = true
  lastPanPoint.value = { x: event.clientX, y: event.clientY }
}

function pan(event: MouseEvent) {
  if (!isPanning.value) return
  
  const dx = event.clientX - lastPanPoint.value.x
  const dy = event.clientY - lastPanPoint.value.y
  
  panX.value += dx
  panY.value += dy
  
  lastPanPoint.value = { x: event.clientX, y: event.clientY }
}

function endPan() {
  isPanning.value = false
}

function zoom(event: WheelEvent) {
  event.preventDefault()
  const delta = event.deltaY > 0 ? 0.9 : 1.1
  zoomLevel.value = Math.max(0.1, Math.min(3, zoomLevel.value * delta))
}

function resetZoom() {
  panX.value = 0
  panY.value = 0
  zoomLevel.value = 1
}

// Lifecycle
onMounted(() => {
  calculateLayout()
})
</script>

<style scoped>
.skill-dependency-map {
  user-select: none;
}

svg {
  background: linear-gradient(45deg, #f9fafb 25%, transparent 25%),
              linear-gradient(-45deg, #f9fafb 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #f9fafb 75%),
              linear-gradient(-45deg, transparent 75%, #f9fafb 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

/* Skill node hover effects */
.skill-node:hover circle {
  filter: brightness(1.1);
  stroke-width: 2;
  stroke: #3b82f6;
}

.skill-node:hover text {
  fill: #1f2937;
  font-weight: 600;
}

/* Smooth transitions for hover effects */
.skill-node circle,
.skill-node text {
  transition: all 0.2s ease-in-out;
}

/* Dependencies hover effect */
.dependencies line:hover {
  stroke: #3b82f6 !important;
  stroke-width: 3;
}
</style>

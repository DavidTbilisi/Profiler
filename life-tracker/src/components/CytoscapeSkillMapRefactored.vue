<template>
  <div class="skill-dependency-map bg-white rounded-lg shadow-md p-6">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">🗺️ Enhanced Skill Dependency Map</h2>
      
      <SkillMapToolbar
        v-model:selectedLayout="selectedLayout"
        v-model:selectedTheme="selectedTheme"
        @fit-to-view="fitToView"
        @export-image="exportImage"
      />
    </div>

    <!-- Edit mode instructions -->
    <div v-if="isEditMode" class="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
      <p class="text-sm text-orange-800">
        <strong>🎯 Edit Mode Active:</strong> Right-click skills to add/remove dependencies • Drag to reposition • Double-click to edit skill details
      </p>
    </div>

    <!-- Legend -->
    <SkillMapLegend />

    <!-- Search and Filter Controls -->
    <SkillMapFilters
      v-model:searchQuery="searchQuery"
      v-model:filterCategory="filterCategory"
      v-model:filterStatus="filterStatus"
      :availableCategories="availableCategories"
      @filter="handleFilter"
    />

    <!-- Demo Data Controls -->
    <div class="mb-4">
      <div class="flex">
        <div class="flex flex-wrap gap-2">
          <!-- Demo Data Dropdown -->
          <div class="relative inline-block">
            <button
              @click.stop="toggleDemoOptions"
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              Load Demo Data
              <span class="text-xs">{{ showDemoOptions ? '▲' : '▼' }}</span>
            </button>
            
            <div
              v-if="showDemoOptions"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-48"
              @click.stop
            >
              <button
                v-for="demo in demoOptions"
                :key="demo.count"
                @click="loadDemoData(demo.count)"
                class="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 border-b border-gray-100 transition-colors"
                :title="demo.description"
              >
                <div class="font-medium" :class="demo.colorClass">{{ demo.label }}</div>
                <div class="text-xs text-gray-600">{{ demo.subtitle }}</div>
              </button>
            </div>
          </div>

          <!-- Skill Pool Dropdown -->
          <div class="relative inline-block">
            <button
              @click.stop="toggleSkillPoolOptions"
              class="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
            >
              📚 Skill Pool
              <span class="text-xs">{{ showSkillPoolOptions ? '▲' : '▼' }}</span>
            </button>
            
            <div
              v-if="showSkillPoolOptions"
              class="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-56"
              @click.stop
            >
              <button
                @click="createNewSkill"
                class="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 border-b border-gray-100 transition-colors"
                title="Create a new skill manually with custom details"
              >
                <div class="font-medium text-blue-700">➕ Create New Skill</div>
                <div class="text-xs text-gray-600">Add custom skill manually</div>
              </button>
              
              <button
                @click="fetchFromLinkedIn"
                class="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 border-b border-gray-100 transition-colors"
                title="Fetch popular skills from LinkedIn Skills database"
              >
                <div class="font-medium text-blue-700">💼 LinkedIn Skills</div>
                <div class="text-xs text-gray-600">Popular professional skills</div>
              </button>
              
              <button
                @click="fetchFromGitHub"
                class="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 border-b border-gray-100 transition-colors"
                title="Fetch trending technologies from GitHub"
              >
                <div class="font-medium text-green-700">🐙 GitHub Trending</div>
                <div class="text-xs text-gray-600">Trending tech & languages</div>
              </button>
              
              <button
                @click="fetchFromJobMarket"
                class="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 border-b border-gray-100 transition-colors"
                title="Fetch in-demand skills from job market data"
              >
                <div class="font-medium text-orange-700">📈 Job Market</div>
                <div class="text-xs text-gray-600">In-demand skills</div>
              </button>
              
              <button
                @click="importFromFile"
                class="w-full px-3 py-2 text-left text-sm hover:bg-purple-50 transition-colors"
                title="Import skills from JSON or CSV file"
              >
                <div class="font-medium text-gray-700">📁 Import File</div>
                <div class="text-xs text-gray-600">JSON, CSV, or Excel</div>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <button @click="clearAllData" class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
            Clear All
          </button>
          <button @click="showLearningPath" class="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            📈 Learning Path
          </button>
          <button @click="highlightCriticalPath" class="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
            ⚡ Critical Path
          </button>
        </div>
        
        <div class="flex-1">
          <div class="flex justify-end gap-2">
            <button
              @click="toggleEditMode"
              :class="[
                'px-3 py-1 text-sm rounded transition-colors',
                isEditMode
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              ]"
            >
              <span v-if="isEditMode">✅ Done Editing</span>
              <span v-else>✏️ Edit</span>
            </button>

            <button
              @click="toggleMinimap"
              class="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              {{ showMinimap ? 'Hide Minimap' : 'Show Minimap' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cytoscape Container with Minimap -->
    <div class="relative border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div
        ref="cytoscapeContainer"
        class="w-full h-96 md:h-[700px] relative"
        :style="containerStyle"
      ></div>
      
      <!-- Minimap -->
      <SkillMapMinimap
        :showMinimap="showMinimap"
        :mainCy="cy"
        ref="minimapRef"
      />
      
      <!-- Zoom Controls -->
      <SkillMapZoomControls
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @reset-zoom="resetZoom"
      />
      
      <!-- Loading Animation -->
      <div v-if="isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
        <div class="text-center">
          <div class="animate-spin text-4xl mb-4">⚙️</div>
          <p class="text-gray-600 font-medium">Optimizing layout...</p>
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
            <strong>Proficiency:</strong> {{ selectedSkill.proficiency }}/10
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
                <span>{{ getCategoryIcon(prereq.category) }} {{ prereq.name }}</span>
                <span class="text-orange-600 font-medium">{{ 'proficiency' in prereq ? prereq.proficiency + '/10' : 'Aspirational' }}</span>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500 italic">No prerequisites required</p>
          </div>
          
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">Unlocks:</p>
            <div v-if="getUnlockedSkills(selectedSkill.id).length > 0" class="space-y-1">
              <div
                v-for="unlocked in getUnlockedSkills(selectedSkill.id)"
                :key="unlocked.id"
                class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex justify-between items-center"
              >
                <span>{{ getCategoryIcon(unlocked.category) }} {{ unlocked.name }}</span>
                <span class="text-green-600 font-medium">{{ 'proficiency' in unlocked ? unlocked.proficiency + '/10' : 'Aspirational' }}</span>
              </div>
            </div>
            <p v-else class="text-xs text-gray-500 italic">Doesn't unlock any skills</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import cytoscape, { type EventObject } from 'cytoscape'
// @ts-expect-error - cytoscape-dagre has no types
import dagre from 'cytoscape-dagre'

// Import our new modular components and composables
import SkillMapLegend from './SkillMapLegend.vue'
import SkillMapFilters from './SkillMapFilters.vue'
import SkillMapToolbar from './SkillMapToolbar.vue'
import SkillMapZoomControls from './SkillMapZoomControls.vue'
import SkillMapMinimap from './SkillMapMinimap.vue'

import { useCytoscape } from '../composables/useCytoscape'
import { useMinimap } from '../composables/useMinimap'
import { useSkillsManagement } from '../composables/useSkillsManagement'
import { useEditMode } from '../composables/useEditMode'

// Register dagre plugin
cytoscape.use(dagre)

// Component refs
const cytoscapeContainer = ref<HTMLElement>()
const minimapRef = ref<InstanceType<typeof SkillMapMinimap>>()

// Initialize composables
const {
  cy,
  isLoading,
  selectedLayout,
  selectedTheme,
  containerStyle,
  initializeCytoscape,
  fitToView,
  exportImage,
  zoomIn,
  zoomOut,
  resetZoom
} = useCytoscape()

const {
  showMinimap,
  toggleMinimap
} = useMinimap()

const {
  selectedSkill,
  searchQuery,
  filterCategory,
  filterStatus,
  availableCategories,
  showLearningPath,
  highlightCriticalPath,
  filterSkills,
  getCategoryIcon,
  getPrerequisites,
  getUnlockedSkills,
  clearAllData,
  loadDemoData,
  handleNodeClick
} = useSkillsManagement()

const {
  isEditMode,
  toggleEditMode
} = useEditMode()

// Demo options
const showDemoOptions = ref(false)
const showSkillPoolOptions = ref(false)

const demoOptions = [
  {
    count: 10,
    label: '🟢 Starter (10 skills + deps)',
    subtitle: 'Essential skills with learning paths',
    description: '10 essential skills with 6 learning dependencies - perfect for beginners',
    colorClass: 'text-green-700'
  },
  {
    count: 20,
    label: '🟡 Intermediate (20 skills + deps)',
    subtitle: 'Modern frameworks with prerequisites',
    description: '20 skills with 16 dependencies - intermediate developer path',
    colorClass: 'text-yellow-600'
  },
  {
    count: 30,
    label: '🟠 Advanced (30 skills)',
    subtitle: 'Professional with backend expertise',
    description: '30 skills with 26 dependencies - professional developer map',
    colorClass: 'text-orange-600'
  },
  {
    count: 35,
    label: '🔴 Senior (35 skills)',
    subtitle: 'Senior with emerging technologies',
    description: '35 skills for senior developers with emerging technologies',
    colorClass: 'text-red-600'
  },
  {
    count: 40,
    label: '🟣 Expert (40 skills)',
    subtitle: 'Expert with cutting-edge tech',
    description: '40 skills for expert-level with cutting-edge technologies',
    colorClass: 'text-purple-600'
  },
  {
    count: 45,
    label: '⚫ Master (45 skills)',
    subtitle: 'Master with AI/ML & security',
    description: '45 skills for master-level with AI/ML and security expertise',
    colorClass: 'text-black'
  }
]

// Methods
const toggleDemoOptions = () => {
  showDemoOptions.value = !showDemoOptions.value
  showSkillPoolOptions.value = false
}

const toggleSkillPoolOptions = () => {
  showSkillPoolOptions.value = !showSkillPoolOptions.value
  showDemoOptions.value = false
}

const handleFilter = () => {
  if (cy.value) {
    filterSkills(cy.value)
  }
}

// Skill pool methods
const createNewSkill = () => {
  console.log('Creating new skill...')
  // Implementation would open a modal for creating new skills
}

const fetchFromLinkedIn = () => {
  console.log('Fetching from LinkedIn...')
  // Implementation would fetch skills from LinkedIn API
}

const fetchFromGitHub = () => {
  console.log('Fetching from GitHub...')
  // Implementation would fetch trending technologies
}

const fetchFromJobMarket = () => {
  console.log('Fetching from job market...')
  // Implementation would fetch in-demand skills
}

const importFromFile = () => {
  console.log('Importing from file...')
  // Implementation would open file dialog
}

// Lifecycle
onMounted(async () => {
  await nextTick()
  
  if (cytoscapeContainer.value) {
    // Initialize with empty data - the demo data will be loaded separately
    await initializeCytoscape(cytoscapeContainer.value, [], [], [], [])
    
    // Set up node click handler
    if (cy.value) {
      cy.value.on('tap', 'node', (event: EventObject) => {
        handleNodeClick(event)
      })
    }
  }
})

onUnmounted(() => {
  if (cy.value) {
    cy.value.destroy()
  }
})

// Close dropdowns when clicking outside
const handleClickOutside = () => {
  showDemoOptions.value = false
  showSkillPoolOptions.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.minimap-container {
  background: rgba(249, 250, 251, 0.95);
  backdrop-filter: blur(8px);
  border: 2px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.minimap-container:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.25);
}

/* Animation for loading */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

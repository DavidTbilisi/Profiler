<template>
  <div class="skill-dependency-map bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">🗺️ Enhanced Skill Dependency Map</h2>
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
        <select
          v-model="selectedLayout"
          @change="changeLayout"
          class="px-3 py-2 border border-gray-300 rounded-md bg-white"
        >
          <option value="breadthfirst">📊 Hierarchical</option>
          <option value="cose">⚡ Force Directed</option>
          <option value="circle">⭕ Circular</option>
          <option value="grid">⚏ Grid</option>
          <option value="concentric">🎪 Concentric</option>
        </select>
        <button
          @click="fitToView"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Fit to View
        </button>
        <button
          @click="exportImage"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Export PNG
        </button>
      </div>
    </div>

    <!-- Edit mode instructions -->
    <div v-if="isEditMode" class="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
      <p class="text-sm text-orange-800">
        <strong>🎯 Edit Mode Active:</strong> Right-click skills to add/remove dependencies • Drag to reposition • Double-click to edit skill details
      </p>
    </div>

    <!-- Legend -->
    <div class="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Legend:</h3>
      <div class="flex flex-wrap gap-4 text-xs">
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-700"></div>
          <span>Learned Skills</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-green-500 rounded-full border-2 border-green-700"></div>
          <span>Available to Learn</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-red-500 rounded-full border-2 border-red-700"></div>
          <span>Blocked (missing prerequisites)</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-4 h-4 bg-gray-400 rounded-full border-2 border-gray-600"></div>
          <span>Aspirational Skills</span>
        </div>
      </div>
    </div>

    <!-- Demo Data Controls -->
    <div class="mb-4 flex gap-2">
      <button
        @click="loadDemoData"
        class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Load Demo Data
      </button>
      <button
        @click="clearAllData"
        class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Clear All
      </button>
    </div>

    <!-- Cytoscape Container -->
    <div class="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div
        ref="cytoscapeContainer"
        class="w-full h-96 md:h-[600px]"
        style="background: linear-gradient(45deg, #f9fafb 25%, transparent 25%), linear-gradient(-45deg, #f9fafb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f9fafb 75%), linear-gradient(-45deg, transparent 75%, #f9fafb 75%); background-size: 20px 20px;"
      ></div>
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
          <div class="text-sm text-gray-600">
            <p><strong>Prerequisites:</strong> {{ getPrerequisiteCount(selectedSkill.id) }}</p>
            <p><strong>Unlocks:</strong> {{ getUnlockedCount(selectedSkill.id) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'
import { getCategoryIcon } from '@/constants/skillCategories'
import type { Skill } from '@/stores/useProfileStore'
import cytoscape from 'cytoscape'

const store = useProfileStore()

// Component state
const isEditMode = ref(false)
const selectedSkill = ref<Skill | null>(null)
const selectedLayout = ref('breadthfirst')
const cytoscapeContainer = ref<HTMLElement>()

// Cytoscape instance
let cy: any = null

// Cytoscape configuration
const cytoscapeConfig = {
  container: null as HTMLElement | null,
  
  style: [
    // Node styles
    {
      selector: 'node',
      style: {
        'width': '60px',
        'height': '60px',
        'background-color': 'data(color)',
        'border-width': '3px',
        'border-color': 'data(borderColor)',
        'label': 'data(label)',
        'text-valign': 'center',
        'text-halign': 'center',
        'color': '#ffffff',
        'font-size': '10px',
        'font-weight': 'bold',
        'text-outline-width': '2px',
        'text-outline-color': '#000000',
        'text-outline-opacity': 0.3,
        'overlay-padding': '6px',
        'z-index': '10'
      }
    },
    
    // Selected node style
    {
      selector: 'node:selected',
      style: {
        'border-width': '4px',
        'border-color': '#3b82f6',
        'background-color': 'data(selectedColor)'
      }
    },
    
    // Hover effect
    {
      selector: 'node:active',
      style: {
        'overlay-opacity': '0.2',
        'overlay-color': '#3b82f6'
      }
    },
    
    // Edge styles
    {
      selector: 'edge',
      style: {
        'width': '3px',
        'line-color': '#6b7280',
        'target-arrow-color': '#6b7280',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'arrow-scale': 1.2
      }
    },
    
    // Selected edge style
    {
      selector: 'edge:selected',
      style: {
        'line-color': '#3b82f6',
        'target-arrow-color': '#3b82f6',
        'width': '4px'
      }
    },
    
    // Category-specific styles
    {
      selector: 'node[category = "Web Development"]',
      style: {
        'shape': 'round-rectangle'
      }
    },
    {
      selector: 'node[category = "Programming"]',
      style: {
        'shape': 'diamond'
      }
    },
    {
      selector: 'node[category = "Backend Development"]',
      style: {
        'shape': 'hexagon'
      }
    }
  ],
  
  layout: {
    name: 'breadthfirst',
    directed: true,
    roots: [],
    padding: 30,
    spacingFactor: 1.5,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
  }
}

// Helper functions
function getSkillColor(skill: Skill): string {
  const isLearned = skill.proficiency >= 5
  const isAvailable = store.availableSkills.some(s => s.id === skill.id)
  
  if (isLearned) return '#3b82f6' // Blue - learned
  if (isAvailable) return '#10b981' // Green - available
  return '#ef4444' // Red - blocked
}

function getSkillBorderColor(skill: Skill): string {
  const isLearned = skill.proficiency >= 5
  if (isLearned) return '#1d4ed8'
  return '#374151'
}

function getSelectedColor(skill: Skill): string {
  const baseColor = getSkillColor(skill)
  // Lighter version for selection
  const colorMap: Record<string, string> = {
    '#3b82f6': '#60a5fa',
    '#10b981': '#34d399',
    '#ef4444': '#f87171'
  }
  return colorMap[baseColor] || baseColor
}

function getCytoscapeElements() {
  const allSkills = [...store.skills, ...store.aspirationalSkills]
  
  // Create nodes
  const nodes = allSkills.map(skill => ({
    data: {
      id: skill.id,
      label: skill.name,
      category: skill.category,
      proficiency: 'proficiency' in skill ? skill.proficiency : 0,
      color: getSkillColor(skill as Skill),
      borderColor: getSkillBorderColor(skill as Skill),
      selectedColor: getSelectedColor(skill as Skill),
      isAspirational: !('proficiency' in skill)
    }
  }))
  
  // Create edges
  const edges = store.skillDependencies.map(dep => ({
    data: {
      id: `${dep.fromSkillId}-${dep.toSkillId}`,
      source: dep.fromSkillId,
      target: dep.toSkillId,
      description: dep.description || ''
    }
  }))
  
  return [...nodes, ...edges]
}

// Component methods
function initializeCytoscape() {
  if (!cytoscapeContainer.value) return
  
  const config = {
    ...cytoscapeConfig,
    container: cytoscapeContainer.value,
    elements: getCytoscapeElements()
  }
  
  // @ts-ignore - Bypassing Cytoscape TypeScript issues
  cy = cytoscape(config)
  
  // Event listeners
  cy.on('tap', 'node', (event: any) => {
    const node = event.target
    const skillId = node.data('id')
    const skill = [...store.skills, ...store.aspirationalSkills].find(s => s.id === skillId)
    selectedSkill.value = skill as Skill || null
  })
  
  cy.on('tap', (event: any) => {
    if (event.target === cy) {
      selectedSkill.value = null
      cy?.elements().unselect()
    }
  })
  
  // Right-click context menu for edit mode
  cy.on('cxttap', 'node', (event: any) => {
    if (!isEditMode.value) return
    
    const node = event.target
    const skillId = node.data('id')
    showContextMenu(skillId, event.renderedPosition || event.position)
  })
  
  // Enable dragging when in edit mode
  cy.on('grab', 'node', () => {
    if (!isEditMode.value) {
      cy?.autoungrabify(true)
    } else {
      cy?.autoungrabify(false)
    }
  })
}

function updateCytoscapeData() {
  if (!cy) return
  
  const elements = getCytoscapeElements()
  cy.elements().remove()
  cy.add(elements)
  
  const layoutOptions = {
    name: selectedLayout.value,
    padding: 30,
    spacingFactor: 1.5,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true
  }
  
  cy.layout(layoutOptions).run()
}

function changeLayout() {
  if (!cy) return
  
  const layoutOptions = {
    name: selectedLayout.value,
    padding: 30,
    spacingFactor: 1.5,
    avoidOverlap: true,
    nodeDimensionsIncludeLabels: true,
    animate: true,
    animationDuration: 1000
  }
  
  cy.layout(layoutOptions).run()
}

function toggleEditMode() {
  isEditMode.value = !isEditMode.value
  
  if (cy) {
    if (isEditMode.value) {
      cy.autoungrabify(false) // Enable dragging
    } else {
      cy.autoungrabify(true) // Disable dragging
    }
  }
}

function fitToView() {
  if (cy) {
    cy.fit(undefined, 50) // 50px padding
  }
}

function exportImage() {
  if (cy) {
    const png = cy.png({
      output: 'blob',
      bg: 'white',
      full: true,
      scale: 2
    })
    
    // Create download link
    const link = document.createElement('a')
    link.href = URL.createObjectURL(png)
    link.download = 'skill-dependency-map.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

function showContextMenu(skillId: string, position: { x: number; y: number }) {
  // Simple context menu for now - could be enhanced with a proper menu component
  const actions = ['Add Prerequisite', 'Add Dependent', 'Edit Skill', 'Remove Dependencies']
  const choice = prompt(`Actions for skill:\n${actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}\n\nEnter choice (1-4):`)
  
  if (choice) {
    const choiceNum = parseInt(choice)
    switch (choiceNum) {
      case 1:
        addPrerequisitePrompt(skillId)
        break
      case 2:
        addDependentPrompt(skillId)
        break
      case 3:
        editSkillPrompt(skillId)
        break
      case 4:
        removeDependenciesPrompt(skillId)
        break
    }
  }
}

function addPrerequisitePrompt(skillId: string) {
  const availableSkills = store.skills.filter(s => 
    s.id !== skillId && 
    !store.wouldCreateCircularDependency(s.id, skillId)
  )
  
  if (availableSkills.length === 0) {
    alert('No available skills to add as prerequisites')
    return
  }
  
  const skillList = availableSkills.map((s, i) => `${i + 1}. ${s.name}`).join('\n')
  const choice = prompt(`Select prerequisite:\n${skillList}\n\nEnter number:`)
  
  if (choice) {
    const index = parseInt(choice) - 1
    if (index >= 0 && index < availableSkills.length) {
      try {
        store.addSkillDependency(availableSkills[index].id, skillId)
        updateCytoscapeData()
      } catch (error) {
        alert('Error: ' + (error as Error).message)
      }
    }
  }
}

function addDependentPrompt(skillId: string) {
  const availableSkills = [...store.skills, ...store.aspirationalSkills].filter(s => 
    s.id !== skillId && 
    !store.wouldCreateCircularDependency(skillId, s.id)
  )
  
  if (availableSkills.length === 0) {
    alert('No available skills to add as dependents')
    return
  }
  
  const skillList = availableSkills.map((s, i) => `${i + 1}. ${s.name}`).join('\n')
  const choice = prompt(`Select skill that depends on this:\n${skillList}\n\nEnter number:`)
  
  if (choice) {
    const index = parseInt(choice) - 1
    if (index >= 0 && index < availableSkills.length) {
      try {
        store.addSkillDependency(skillId, availableSkills[index].id)
        updateCytoscapeData()
      } catch (error) {
        alert('Error: ' + (error as Error).message)
      }
    }
  }
}

function editSkillPrompt(skillId: string) {
  alert('Skill editing would open a detailed form - this is a placeholder')
}

function removeDependenciesPrompt(skillId: string) {
  const dependencies = store.skillDependencies.filter(
    dep => dep.fromSkillId === skillId || dep.toSkillId === skillId
  )
  
  if (dependencies.length === 0) {
    alert('No dependencies to remove')
    return
  }
  
  const depList = dependencies.map((dep, i) => {
    const fromSkill = store.skills.find(s => s.id === dep.fromSkillId)?.name || dep.fromSkillId
    const toSkill = [...store.skills, ...store.aspirationalSkills].find(s => s.id === dep.toSkillId)?.name || dep.toSkillId
    return `${i + 1}. ${fromSkill} → ${toSkill}`
  }).join('\n')
  
  const choice = prompt(`Select dependency to remove:\n${depList}\n\nEnter number:`)
  
  if (choice) {
    const index = parseInt(choice) - 1
    if (index >= 0 && index < dependencies.length) {
      const dep = dependencies[index]
      store.removeSkillDependency(dep.fromSkillId, dep.toSkillId)
      updateCytoscapeData()
    }
  }
}

function loadDemoData() {
  if (confirm('This will replace all existing skills and dependencies with demo data. Continue?')) {
    store.addDemoSkillData()
    updateCytoscapeData()
  }
}

function clearAllData() {
  if (confirm('This will remove all skills and dependencies. This cannot be undone. Continue?')) {
    store.skills = []
    store.aspirationalSkills = []
    store.skillDependencies = []
    store.saveToLocalStorage()
    updateCytoscapeData()
    selectedSkill.value = null
  }
}

function getPrerequisiteCount(skillId: string): number {
  return store.skillDependencies.filter(dep => dep.toSkillId === skillId).length
}

function getUnlockedCount(skillId: string): number {
  return store.skillDependencies.filter(dep => dep.fromSkillId === skillId).length
}

// Lifecycle
onMounted(() => {
  nextTick(() => {
    initializeCytoscape()
  })
})

onUnmounted(() => {
  if (cy) {
    cy.destroy()
    cy = null
  }
})

// Watch for data changes
// We could add watchers here to auto-update the graph when store data changes
</script>

<style scoped>
.skill-dependency-map {
  user-select: none;
}

/* Cytoscape container ensures proper sizing */
.cytoscape-container {
  width: 100%;
  height: 100%;
}
</style>

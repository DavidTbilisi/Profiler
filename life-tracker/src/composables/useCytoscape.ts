import { ref, computed, watch } from 'vue'
import cytoscape from 'cytoscape'
// @ts-expect-error - No types available for cytoscape-dagre
import dagre from 'cytoscape-dagre'
import type { Skill, AspirationalSkill } from '@/stores/useProfileStore'

// Register the dagre layout extension
cytoscape.use(dagre)

export interface CytoscapeTheme {
  nodeColors: {
    learned: string
    available: string
    blocked: string
    aspirational: string
  }
  edgeColor: string
  backgroundColor: string
}

export const themes: Record<string, CytoscapeTheme> = {
  default: {
    nodeColors: { learned: '#3b82f6', available: '#10b981', blocked: '#ef4444', aspirational: '#6b7280' },
    edgeColor: '#6b7280',
    backgroundColor: '#ffffff'
  },
  dark: {
    nodeColors: { learned: '#60a5fa', available: '#34d399', blocked: '#f87171', aspirational: '#9ca3af' },
    edgeColor: '#9ca3af',
    backgroundColor: '#111827'
  },
  neon: {
    nodeColors: { learned: '#00ffff', available: '#00ff00', blocked: '#ff0080', aspirational: '#ffff00' },
    edgeColor: '#ffffff',
    backgroundColor: '#0a0a0a'
  },
  pastel: {
    nodeColors: { learned: '#c4b5fd', available: '#86efac', blocked: '#fbbf24', aspirational: '#f9a8d4' },
    edgeColor: '#d1d5db',
    backgroundColor: '#fefefe'
  },
  professional: {
    nodeColors: { learned: '#1e293b', available: '#475569', blocked: '#7f1d1d', aspirational: '#64748b' },
    edgeColor: '#64748b',
    backgroundColor: '#f8fafc'
  },
  ocean: {
    nodeColors: { learned: '#0ea5e9', available: '#06b6d4', blocked: '#0891b2', aspirational: '#0284c7' },
    edgeColor: '#0369a1',
    backgroundColor: '#f0f9ff'
  },
  sunset: {
    nodeColors: { learned: '#f97316', available: '#eab308', blocked: '#dc2626', aspirational: '#a855f7' },
    edgeColor: '#ea580c',
    backgroundColor: '#fffbeb'
  },
  forest: {
    nodeColors: { learned: '#16a34a', available: '#65a30d', blocked: '#ca8a04', aspirational: '#059669' },
    edgeColor: '#166534',
    backgroundColor: '#f0fdf4'
  }
}

export function useCytoscape() {
  const cy = ref<any>(null)
  const isLoading = ref(false)
  const selectedLayout = ref('dagre')
  const selectedTheme = ref('default')
  
  // Store current data for theme updates
  const currentSkillsData = ref<{
    skills: Skill[]
    aspirationalSkills: AspirationalSkill[]
    dependencies: any[]
    availableSkills: Skill[]
  } | null>(null)

  const containerStyle = computed(() => ({
    backgroundColor: themes[selectedTheme.value].backgroundColor
  }))

  const cytoscapeConfig = {
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
      }
    ],
    layout: {
      name: 'cose',
      directed: true,
      roots: [],
      padding: 30,
      spacingFactor: 1.5,
      avoidOverlap: true,
      nodeDimensionsIncludeLabels: true
    }
  }

  function getSkillColor(skill: Skill, availableSkills: Skill[]): string {
    const currentTheme = themes[selectedTheme.value]
    const isLearned = skill.proficiency >= 5
    const isAvailable = availableSkills.some(s => s.id === skill.id)
    const isAspirational = !('proficiency' in skill)
    
    if (isAspirational) return currentTheme.nodeColors.aspirational
    if (isLearned) return currentTheme.nodeColors.learned
    if (isAvailable) return currentTheme.nodeColors.available
    return currentTheme.nodeColors.blocked
  }

  function getSkillBorderColor(skill: Skill): string {
    const currentTheme = themes[selectedTheme.value]
    const isLearned = skill.proficiency >= 5
    const isAspirational = !('proficiency' in skill)
    
    // Use darker versions of the node colors for borders
    if (isAspirational) {
      return darkenColor(currentTheme.nodeColors.aspirational)
    } else if (isLearned) {
      return darkenColor(currentTheme.nodeColors.learned)
    }
    return currentTheme.edgeColor
  }

  // Helper function to darken a color for borders
  function darkenColor(color: string): string {
    // Convert hex to RGB, darken by 20%, then back to hex
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const darkenedR = Math.floor(r * 0.7)
    const darkenedG = Math.floor(g * 0.7)
    const darkenedB = Math.floor(b * 0.7)
    
    return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`
  }

  function getSelectedColor(skill: Skill, availableSkills: Skill[]): string {
    const baseColor = getSkillColor(skill, availableSkills)
    // Make selected nodes slightly brighter
    return lightenColor(baseColor)
  }

  // Helper function to lighten a color for selection
  function lightenColor(color: string): string {
    // Convert hex to RGB, lighten by 20%, then back to hex
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    const lightenedR = Math.min(255, Math.floor(r * 1.3))
    const lightenedG = Math.min(255, Math.floor(g * 1.3))
    const lightenedB = Math.min(255, Math.floor(b * 1.3))
    
    return `#${lightenedR.toString(16).padStart(2, '0')}${lightenedG.toString(16).padStart(2, '0')}${lightenedB.toString(16).padStart(2, '0')}`
  }

  function createCytoscapeElements(
    skills: Skill[], 
    aspirationalSkills: AspirationalSkill[], 
    dependencies: any[],
    availableSkills: Skill[]
  ) {
    const allSkills = [...skills, ...aspirationalSkills]
    
    // Create nodes
    const nodes = allSkills.map(skill => ({
      data: {
        id: skill.id,
        label: skill.name,
        category: skill.category,
        proficiency: 'proficiency' in skill ? skill.proficiency : 0,
        color: getSkillColor(skill as Skill, availableSkills),
        borderColor: getSkillBorderColor(skill as Skill),
        selectedColor: getSelectedColor(skill as Skill, availableSkills),
        isAspirational: !('proficiency' in skill)
      }
    }))
    
    // Create edges
    const edges = dependencies.map(dep => ({
      data: {
        id: `${dep.fromSkillId}-${dep.toSkillId}`,
        source: dep.fromSkillId,
        target: dep.toSkillId,
        description: dep.description || ''
      }
    }))
    
    return [...nodes, ...edges]
  }

  function initializeCytoscape(
    container: HTMLElement,
    skills: Skill[],
    aspirationalSkills: AspirationalSkill[],
    dependencies: any[],
    availableSkills: Skill[]
  ) {
    console.log('🚀 Initializing Cytoscape...')
    
    if (!container) return false

    // Clean up existing instance
    if (cy.value) {
      try {
        cy.value.destroy()
      } catch (error) {
        console.warn('⚠️ Error destroying existing Cytoscape instance:', error)
      }
      cy.value = null
    }
    
    const elements = createCytoscapeElements(skills, aspirationalSkills, dependencies, availableSkills)
    
    const config = {
      ...cytoscapeConfig,
      container,
      elements
    }
    
    try {
      // @ts-expect-error - Bypassing Cytoscape TypeScript issues
      cy.value = cytoscape(config)
      console.log('✅ Cytoscape instance created successfully')
      return true
    } catch (error) {
      console.error('❌ Error creating Cytoscape instance:', error)
      return false
    }
  }

  function updateData(
    skills: Skill[],
    aspirationalSkills: AspirationalSkill[],
    dependencies: any[],
    availableSkills: Skill[]
  ) {
    if (!cy.value) return false

    // Store current data for theme updates
    currentSkillsData.value = {
      skills,
      aspirationalSkills,
      dependencies,
      availableSkills
    }

    isLoading.value = true
    
    setTimeout(() => {
      if (!cy.value) {
        isLoading.value = false
        return
      }

      const elements = createCytoscapeElements(skills, aspirationalSkills, dependencies, availableSkills)
      
      try {
        cy.value.elements().remove()
        cy.value.add(elements)
        
        const layoutOptions = {
          name: selectedLayout.value,
          padding: 30,
          spacingFactor: 1.5,
          avoidOverlap: true,
          nodeDimensionsIncludeLabels: true,
          animate: true,
          animationDuration: 800
        }
        
        const layout = cy.value.layout(layoutOptions)
        layout.run()
        
        layout.on('layoutstop', () => {
          console.log('✅ Layout completed')
          isLoading.value = false
        })
        
        return true
      } catch (error) {
        console.error('❌ Error updating data:', error)
        isLoading.value = false
        return false
      }
    }, 100)
    
    return true
  }

  function changeLayout(layoutName: string) {
    if (!cy.value) return false
    
    selectedLayout.value = layoutName
    
    try {
      const layoutOptions = {
        name: layoutName,
        padding: 30,
        spacingFactor: 1.5,
        avoidOverlap: true,
        nodeDimensionsIncludeLabels: true,
        animate: true,
        animationDuration: 1000
      }
      
      cy.value.layout(layoutOptions).run()
      return true
    } catch (error) {
      console.error('❌ Error changing layout:', error)
      return false
    }
  }

  function fitToView() {
    if (cy.value) {
      try {
        cy.value.fit(undefined, 50)
        return true
      } catch (error) {
        console.error('❌ Error fitting to view:', error)
        return false
      }
    }
    return false
  }

  function exportImage() {
    if (!cy.value) return false
    
    try {
      const png = cy.value.png({
        output: 'blob',
        bg: 'white',
        full: true,
        scale: 2
      })
      
      const link = document.createElement('a')
      link.href = URL.createObjectURL(png)
      link.download = 'skill-dependency-map.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return true
    } catch (error) {
      console.error('❌ Error exporting image:', error)
      return false
    }
  }

  function applyTheme() {
    if (!cy.value || !currentSkillsData.value) return
    
    const currentTheme = themes[selectedTheme.value]
    const { availableSkills } = currentSkillsData.value
    
    // Update all nodes with new theme colors
    cy.value.nodes().forEach((node: any) => {
      const skill = node.data()
      const newColor = getSkillColor(skill, availableSkills)
      
      node.style({
        'background-color': newColor,
        'border-color': getSkillBorderColor(skill)
      })
    })
    
    // Update edges
    cy.value.edges().style({
      'line-color': currentTheme.edgeColor,
      'target-arrow-color': currentTheme.edgeColor
    })
  }

  function zoomIn() {
    if (cy.value) {
      cy.value.zoom(cy.value.zoom() * 1.2)
      cy.value.center()
    }
  }

  function zoomOut() {
    if (cy.value) {
      cy.value.zoom(cy.value.zoom() * 0.8)
      cy.value.center()
    }
  }

  function resetZoom() {
    if (cy.value) {
      cy.value.fit()
      cy.value.center()
    }
  }

  function destroy() {
    if (cy.value) {
      try {
        cy.value.removeAllListeners()
        cy.value.destroy()
        console.log('✅ Cytoscape instance destroyed')
      } catch (error) {
        console.warn('⚠️ Error destroying Cytoscape instance:', error)
      } finally {
        cy.value = null
      }
    }
  }

  // Watch for layout changes and apply them automatically
  watch(selectedLayout, (newLayout) => {
    if (cy.value && newLayout) {
      changeLayout(newLayout)
    }
  })

  // Watch for theme changes and apply them automatically
  watch(selectedTheme, (newTheme) => {
    if (cy.value && newTheme) {
      applyTheme()
    }
  })

  return {
    cy,
    isLoading,
    selectedLayout,
    selectedTheme,
    containerStyle,
    initializeCytoscape,
    updateData,
    changeLayout,
    applyTheme,
    fitToView,
    exportImage,
    zoomIn,
    zoomOut,
    resetZoom,
    destroy
  }
}

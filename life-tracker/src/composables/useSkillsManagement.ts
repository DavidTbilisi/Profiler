import { ref, computed } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'
import type { Skill, AspirationalSkill } from '@/stores/useProfileStore'

export function useSkillsManagement() {
  const store = useProfileStore()
  
  // Search and filter state
  const searchQuery = ref('')
  const filterCategory = ref('')
  const filterStatus = ref('')
  const selectedSkill = ref<Skill | AspirationalSkill | null>(null)

  // Computed properties
  const availableCategories = computed<string[]>(() => {
    const categories = new Set<string>()
    store.skills.forEach(skill => categories.add(skill.category))
    store.aspirationalSkills.forEach(skill => categories.add(skill.category))
    return Array.from(categories).sort()
  })

  function getPrerequisites(skillId: string) {
    return store.skillDependencies
      .filter(dep => dep.toSkillId === skillId)
      .map(dep => [...store.skills, ...store.aspirationalSkills].find(s => s.id === dep.fromSkillId))
      .filter((skill): skill is Skill | AspirationalSkill => Boolean(skill))
  }

  function getUnlockedSkills(skillId: string) {
    return store.skillDependencies
      .filter(dep => dep.fromSkillId === skillId)
      .map(dep => [...store.skills, ...store.aspirationalSkills].find(s => s.id === dep.toSkillId))
      .filter((skill): skill is Skill | AspirationalSkill => Boolean(skill))
  }

  function filterSkills(cy: any) {
    if (!cy) return
    
    const nodes = cy.nodes()
    nodes.forEach((node: any) => {
      const skill = [...store.skills, ...store.aspirationalSkills].find(s => s.id === node.data('id'))
      if (!skill) return
      
      let visible = true
      
      // Search filter
      if (searchQuery.value) {
        visible = visible && skill.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      }
      
      // Category filter
      if (filterCategory.value) {
        visible = visible && skill.category === filterCategory.value
      }
      
      // Status filter
      if (filterStatus.value) {
        const isLearned = 'proficiency' in skill && skill.proficiency >= 5
        const isAvailable = store.availableSkills.some(s => s.id === skill.id)
        const isAspirational = !('proficiency' in skill)
        
        switch (filterStatus.value) {
          case 'learned':
            visible = visible && isLearned
            break
          case 'available':
            visible = visible && isAvailable && !isLearned
            break
          case 'blocked':
            visible = visible && !isAvailable && !isAspirational
            break
          case 'aspirational':
            visible = visible && isAspirational
            break
        }
      }
      
      if (visible) {
        node.show()
      } else {
        node.hide()
      }
    })
    
    // Hide edges connected to hidden nodes
    cy.edges().forEach((edge: any) => {
      const source = edge.source()
      const target = edge.target()
      if (source.visible() && target.visible()) {
        edge.show()
      } else {
        edge.hide()
      }
    })
  }

  function showLearningPath(cy: any) {
    if (!cy) {
      console.warn('⚠️ Cytoscape instance not available')
      return
    }
    
    if (!selectedSkill.value) {
      alert('Please select a skill first to show its learning path')
      return
    }
    
    console.log('🎯 Showing learning path for:', selectedSkill.value.name)
    
    try {
      const path = store.getSkillLearningPath(selectedSkill.value.id)
      console.log('📈 Learning path:', path.map(s => s.name))
      
      if (path.length === 0) {
        alert('No learning path found for this skill')
        return
      }
      
      // Reset all styles
      cy.elements().removeClass('highlighted path-node path-edge')
      
      // Highlight path nodes
      path.forEach((skill, index) => {
        const node = cy.getElementById(skill.id)
        if (node.length > 0) {
          node.addClass('path-node')
          node.style({
            'border-width': '5px',
            'border-color': '#fbbf24',
            'background-color': '#fef3c7'
          })
          console.log(`✅ Highlighted path node: ${skill.name}`)
        } else {
          console.warn(`⚠️ Node not found for skill: ${skill.name} (${skill.id})`)
        }
      })
      
      // Highlight path edges
      for (let i = 0; i < path.length - 1; i++) {
        const edge = cy.edges(`[source="${path[i].id}"][target="${path[i + 1].id}"]`)
        if (edge.length > 0) {
          edge.addClass('path-edge')
          edge.style({
            'line-color': '#fbbf24',
            'target-arrow-color': '#fbbf24',
            'width': '5px'
          })
          console.log(`✅ Highlighted path edge: ${path[i].name} → ${path[i + 1].name}`)
        }
      }
      
      // Fit to path
      const pathElements = cy.elements('.path-node, .path-edge')
      if (pathElements.length > 0) {
        cy.fit(pathElements, 100)
        console.log('✅ Learning path visualization complete')
      }
    } catch (error) {
      console.error('❌ Error showing learning path:', error)
      alert('Error showing learning path. Check console for details.')
    }
  }

  function highlightCriticalPath(cy: any) {
    if (!cy) {
      console.warn('⚠️ Cytoscape instance not available')
      return
    }
    
    console.log('⚡ Highlighting critical path...')
    
    try {
      const skillDependencyCounts = new Map<string, number>()
      
      // Count how many other skills depend on each skill
      store.skillDependencies.forEach((dep: any) => {
        skillDependencyCounts.set(dep.fromSkillId, (skillDependencyCounts.get(dep.fromSkillId) || 0) + 1)
      })
      
      console.log('📊 Dependency counts:', Array.from(skillDependencyCounts.entries()))
      
      const criticalSkills = Array.from(skillDependencyCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([skillId]) => skillId)
      
      console.log('🔥 Critical skills:', criticalSkills)
      
      // Reset styles
      cy.elements().removeClass('critical path-node path-edge')
      
      // Highlight critical skills
      criticalSkills.forEach(skillId => {
        const node = cy.getElementById(skillId)
        if (node.length > 0) {
          node.addClass('critical')
          node.style({
            'border-color': '#dc2626',
            'border-width': '4px',
            'background-color': '#fee2e2'
          })
          console.log(`✅ Highlighted critical skill: ${skillId}`)
        } else {
          console.warn(`⚠️ Critical skill node not found: ${skillId}`)
        }
      })
      
      if (criticalSkills.length === 0) {
        alert('No critical path found. Make sure there are skill dependencies defined.')
      } else {
        // Fit to critical skills
        const criticalElements = cy.elements('.critical')
        if (criticalElements.length > 0) {
          cy.fit(criticalElements, 100)
        }
        console.log('✅ Critical path visualization complete')
      }
    } catch (error) {
      console.error('❌ Error highlighting critical path:', error)
      alert('Error highlighting critical path. Check console for details.')
    }
  }

  function clearAllData() {
    if (confirm('This will remove all skills and dependencies. This cannot be undone. Continue?')) {
      store.skills = []
      store.aspirationalSkills = []
      store.skillDependencies = []
      store.saveToLocalStorage()
      selectedSkill.value = null
      return true
    }
    return false
  }

  // Event handlers
  function handleNodeClick(event: any, cy?: any) {
    let skill
    
    // Handle both event object and direct skill id
    if (typeof event === 'object' && event.target) {
      // Cytoscape event object
      skill = event.target.data()
    } else if (typeof event === 'string') {
      // Direct skill ID
      skill = { id: event }
    } else {
      // Direct node object
      skill = event.data ? event.data() : event
    }
    
    if (skill?.id) {
      selectedSkill.value = [...store.skills, ...store.aspirationalSkills].find(s => s.id === skill.id) || null
      console.log('🎯 Selected skill:', skill.name || skill.id)
    }
  }

  // Add skills property
  const skills = computed(() => store.skills)

  function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Programming': '💻',
      'Framework': '🏗️',
      'Database': '🗄️',
      'Tool': '🔧',
      'Language': '🌐',
      'Cloud': '☁️',
      'DevOps': '⚙️',
      'Design': '🎨',
      'Testing': '🧪',
      'Security': '🔒',
      'AI/ML': '🤖',
      'Mobile': '📱',
      'Web': '🌐',
      'Data': '📊'
    }
    return icons[category] || '📝'
  }

  function loadDemoData(count: number) {
    // This would call the store method to load demo data
    console.log(`Loading demo data with ${count} skills...`)
    // For now, just log - the actual implementation would be in the store
  }

  function handleBackgroundClick(cy: any) {
    selectedSkill.value = null
    cy?.elements().unselect()
  }

  return {
    // State
    searchQuery,
    filterCategory,
    filterStatus,
    selectedSkill,
    skills,
    
    // Computed
    availableCategories,
    
    // Methods
    getPrerequisites,
    getUnlockedSkills,
    getCategoryIcon,
    filterSkills,
    showLearningPath,
    highlightCriticalPath,
    clearAllData,
    loadDemoData,
    handleNodeClick,
    handleBackgroundClick
  }
}

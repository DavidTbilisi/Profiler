import { ref } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'

export function useEditMode() {
  const store = useProfileStore()
  const isEditMode = ref(false)

  function toggleEditMode(cy: any) {
    isEditMode.value = !isEditMode.value
    
    if (cy) {
      try {
        if (isEditMode.value) {
          cy.autoungrabify(false) // Enable dragging
        } else {
          cy.autoungrabify(true) // Disable dragging
        }
      } catch (error) {
        console.error('❌ Error toggling edit mode:', error)
      }
    }
  }

  function showContextMenu(skillId: string, position: { x: number; y: number }) {
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
      return null
    }
    
    const skillList = availableSkills.map((s, i) => `${i + 1}. ${s.name}`).join('\n')
    const choice = prompt(`Select prerequisite:\n${skillList}\n\nEnter number:`)
    
    if (choice) {
      const index = parseInt(choice) - 1
      if (index >= 0 && index < availableSkills.length) {
        try {
          store.addSkillDependency(availableSkills[index].id, skillId)
          return availableSkills[index]
        } catch (error) {
          alert('Error: ' + (error as Error).message)
        }
      }
    }
    return null
  }

  function addDependentPrompt(skillId: string) {
    const availableSkills = [...store.skills, ...store.aspirationalSkills].filter(s => 
      s.id !== skillId && 
      !store.wouldCreateCircularDependency(skillId, s.id)
    )
    
    if (availableSkills.length === 0) {
      alert('No available skills to add as dependents')
      return null
    }
    
    const skillList = availableSkills.map((s, i) => `${i + 1}. ${s.name}`).join('\n')
    const choice = prompt(`Select skill that depends on this:\n${skillList}\n\nEnter number:`)
    
    if (choice) {
      const index = parseInt(choice) - 1
      if (index >= 0 && index < availableSkills.length) {
        try {
          store.addSkillDependency(skillId, availableSkills[index].id)
          return availableSkills[index]
        } catch (error) {
          alert('Error: ' + (error as Error).message)
        }
      }
    }
    return null
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
      return null
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
        return dep
      }
    }
    return null
  }

  function setupEditHandlers(cy: any) {
    if (!cy) return

    // Right-click context menu
    cy.on('cxttap', 'node', (event: any) => {
      if (!isEditMode.value) return
      
      const node = event.target
      const skillId = node.data('id')
      showContextMenu(skillId, event.renderedPosition || event.position)
    })
    
    // Enable/disable dragging based on edit mode
    cy.on('grab', 'node', () => {
      if (!isEditMode.value) {
        cy?.autoungrabify(true)
      } else {
        cy?.autoungrabify(false)
      }
    })
  }

  return {
    isEditMode,
    toggleEditMode,
    showContextMenu,
    addPrerequisitePrompt,
    addDependentPrompt,
    editSkillPrompt,
    removeDependenciesPrompt,
    setupEditHandlers
  }
}

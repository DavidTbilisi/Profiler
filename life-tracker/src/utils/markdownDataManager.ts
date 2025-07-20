import { useProfileStore } from '@/stores/useProfileStore'
import type { Task, MoodEntry, KnowledgeEntry, JournalEntry, Skill, AspirationalSkill, UserProfile } from '@/stores/useProfileStore'

export class MarkdownDataManager {
  
  /**
   * Export all profile data to a comprehensive markdown file
   */
  static exportToMarkdown(): string {
    const store = useProfileStore()
    const currentDate = new Date().toISOString().split('T')[0]
    
    let markdown = `# Life Tracker Export\n\n`
    markdown += `**Export Date:** ${currentDate}\n\n`
    markdown += `---\n\n`

    // User Profile
    if (store.userProfile.firstName || store.userProfile.lastName || store.userProfile.birthTimestamp) {
      markdown += `## 👤 User Profile\n\n`
      if (store.userProfile.firstName || store.userProfile.lastName) {
        markdown += `**Name:** ${store.userProfile.firstName || ''} ${store.userProfile.lastName || ''}\n`
      }
      if (store.userProfile.birthTimestamp) {
        markdown += `**Birth Timestamp:** ${store.userProfile.birthTimestamp}\n`
      }
      markdown += `\n---\n\n`
    }

    // Skills
    if (store.skills.length > 0) {
      markdown += `## 🎯 Current Skills\n\n`
      
      const skillsByCategory = this.groupSkillsByCategory(store.skills)
      
      for (const [category, skills] of Object.entries(skillsByCategory)) {
        markdown += `### ${category}\n\n`
        skills.forEach(skill => {
          markdown += `- **${skill.name}** (${skill.proficiency}/10)\n`
          if (skill.description) {
            markdown += `  - *Description:* ${skill.description}\n`
          }
          if (skill.learningGoals) {
            markdown += `  - *Goals:* ${skill.learningGoals}\n`
          }
          markdown += `  - *Added:* ${this.formatDate(skill.createdAt)}\n`
          if (skill.updatedAt !== skill.createdAt) {
            markdown += `  - *Updated:* ${this.formatDate(skill.updatedAt)}\n`
          }
          markdown += `\n`
        })
      }
      markdown += `---\n\n`
    }

    // Aspirational Skills
    if (store.aspirationalSkills.length > 0) {
      markdown += `## 📚 Skills I Want to Learn\n\n`
      
      const priorityOrder = ['High', 'Medium', 'Low'] as const
      
      priorityOrder.forEach(priority => {
        const skillsInPriority = store.aspirationalSkills.filter(skill => skill.priority === priority)
        if (skillsInPriority.length > 0) {
          markdown += `### ${this.getPriorityIcon(priority)} ${priority} Priority\n\n`
          skillsInPriority.forEach(skill => {
            markdown += `- **${skill.name}** (${skill.category})\n`
            if (skill.reason) {
              markdown += `  - *Why:* ${skill.reason}\n`
            }
            if (skill.targetProficiency) {
              markdown += `  - *Target Level:* ${skill.targetProficiency}/10\n`
            }
            if (skill.targetDate) {
              markdown += `  - *Target Date:* ${this.formatDate(skill.targetDate)}\n`
            }
            if (skill.resources) {
              markdown += `  - *Resources:* ${skill.resources}\n`
            }
            markdown += `  - *Added:* ${this.formatDate(skill.createdAt)}\n`
            markdown += `\n`
          })
        }
      })
      markdown += `---\n\n`
    }

    // Tasks
    if (store.tasks.length > 0) {
      markdown += `## ✅ Tasks\n\n`
      
      const tasksByDate = this.groupTasksByDate(store.tasks)
      
      for (const [date, tasks] of Object.entries(tasksByDate)) {
        markdown += `### ${this.formatDate(date)}\n\n`
        tasks.forEach(task => {
          const checkbox = task.completed ? '[x]' : '[ ]'
          markdown += `- ${checkbox} ${task.text}\n`
        })
        markdown += `\n`
      }
      markdown += `---\n\n`
    }

    // Journal Entries
    if (Object.keys(store.journal).length > 0) {
      markdown += `## 📔 Journal Entries\n\n`
      
      const sortedEntries = Object.entries(store.journal)
        .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      
      sortedEntries.forEach(([date, entry]) => {
        markdown += `### ${this.formatDate(date)}\n\n`
        markdown += `${entry.content}\n\n`
        markdown += `---\n\n`
      })
    }

    // Mood Entries
    if (store.moods.length > 0) {
      markdown += `## 😊 Mood Tracking\n\n`
      
      const sortedMoods = [...store.moods]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      markdown += `| Date | Mood | Note |\n`
      markdown += `|------|------|------|\n`
      
      sortedMoods.forEach(mood => {
        const note = mood.note ? mood.note.replace(/\|/g, '\\|') : ''
        markdown += `| ${this.formatDate(mood.date)} | ${mood.mood}/10 ${this.getMoodEmoji(mood.mood)} | ${note} |\n`
      })
      markdown += `\n---\n\n`
    }

    // Knowledge Base
    if (store.knowledge.length > 0) {
      markdown += `## 🧠 Knowledge Base\n\n`
      
      const sortedKnowledge = [...store.knowledge]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      
      sortedKnowledge.forEach(entry => {
        markdown += `### ${entry.title}\n\n`
        markdown += `${entry.content}\n\n`
        markdown += `*Created:* ${this.formatDate(entry.createdAt)}\n`
        if (entry.updatedAt !== entry.createdAt) {
          markdown += `*Updated:* ${this.formatDate(entry.updatedAt)}\n`
        }
        markdown += `\n---\n\n`
      })
    }

    // Statistics
    markdown += `## 📊 Statistics\n\n`
    markdown += `- **Total Tasks:** ${store.tasks.length}\n`
    markdown += `- **Completed Tasks:** ${store.tasks.filter(t => t.completed).length}\n`
    markdown += `- **Journal Entries:** ${Object.keys(store.journal).length}\n`
    markdown += `- **Mood Entries:** ${store.moods.length}\n`
    markdown += `- **Knowledge Entries:** ${store.knowledge.length}\n`
    markdown += `- **Current Skills:** ${store.skills.length}\n`
    markdown += `- **Learning Goals:** ${store.aspirationalSkills.length}\n`
    
    if (store.skills.length > 0) {
      const avgSkill = store.skills.reduce((sum, s) => sum + s.proficiency, 0) / store.skills.length
      markdown += `- **Average Skill Level:** ${avgSkill.toFixed(1)}/10\n`
    }
    
    if (store.moods.length > 0) {
      const avgMood = store.moods.reduce((sum, m) => sum + m.mood, 0) / store.moods.length
      markdown += `- **Average Mood:** ${avgMood.toFixed(1)}/10\n`
    }

    markdown += `\n---\n\n`
    markdown += `*Exported from Life Tracker on ${new Date().toLocaleString()}*\n`

    return markdown
  }

  /**
   * Download the markdown file
   */
  static downloadMarkdown(): void {
    const markdown = this.exportToMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `life-tracker-export-${currentDate}.md`
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Save individual sections as separate markdown files
   */
  static downloadSectionMarkdown(section: 'skills' | 'journal' | 'tasks' | 'moods' | 'knowledge'): void {
    const store = useProfileStore()
    let markdown = ''
    let filename = ''
    const currentDate = new Date().toISOString().split('T')[0]

    switch (section) {
      case 'skills':
        markdown = this.exportSkillsMarkdown()
        filename = `skills-${currentDate}.md`
        break
      case 'journal':
        markdown = this.exportJournalMarkdown()
        filename = `journal-${currentDate}.md`
        break
      case 'tasks':
        markdown = this.exportTasksMarkdown()
        filename = `tasks-${currentDate}.md`
        break
      case 'moods':
        markdown = this.exportMoodsMarkdown()
        filename = `moods-${currentDate}.md`
        break
      case 'knowledge':
        markdown = this.exportKnowledgeMarkdown()
        filename = `knowledge-${currentDate}.md`
        break
    }

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Helper methods for individual sections
  private static exportSkillsMarkdown(): string {
    const store = useProfileStore()
    let markdown = `# Skills Portfolio\n\n`
    
    if (store.skills.length > 0) {
      markdown += `## Current Skills\n\n`
      const skillsByCategory = this.groupSkillsByCategory(store.skills)
      
      for (const [category, skills] of Object.entries(skillsByCategory)) {
        markdown += `### ${category}\n\n`
        skills.forEach(skill => {
          markdown += `- **${skill.name}** (${skill.proficiency}/10)\n`
          if (skill.description) markdown += `  - ${skill.description}\n`
          if (skill.learningGoals) markdown += `  - Goals: ${skill.learningGoals}\n`
          markdown += `\n`
        })
      }
    }

    if (store.aspirationalSkills.length > 0) {
      markdown += `## Learning Goals\n\n`
      const priorityOrder = ['High', 'Medium', 'Low'] as const
      
      priorityOrder.forEach(priority => {
        const skills = store.aspirationalSkills.filter(s => s.priority === priority)
        if (skills.length > 0) {
          markdown += `### ${priority} Priority\n\n`
          skills.forEach(skill => {
            markdown += `- **${skill.name}**\n`
            if (skill.reason) markdown += `  - Why: ${skill.reason}\n`
            if (skill.targetDate) markdown += `  - Target: ${skill.targetDate}\n`
            markdown += `\n`
          })
        }
      })
    }

    return markdown
  }

  private static exportJournalMarkdown(): string {
    const store = useProfileStore()
    let markdown = `# Journal Entries\n\n`
    
    const sortedEntries = Object.entries(store.journal)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    
    sortedEntries.forEach(([date, entry]) => {
      markdown += `## ${this.formatDate(date)}\n\n`
      markdown += `${entry.content}\n\n`
      markdown += `---\n\n`
    })

    return markdown
  }

  private static exportTasksMarkdown(): string {
    const store = useProfileStore()
    let markdown = `# Tasks\n\n`
    
    const tasksByDate = this.groupTasksByDate(store.tasks)
    
    for (const [date, tasks] of Object.entries(tasksByDate)) {
      markdown += `## ${this.formatDate(date)}\n\n`
      tasks.forEach(task => {
        const checkbox = task.completed ? '[x]' : '[ ]'
        markdown += `- ${checkbox} ${task.text}\n`
      })
      markdown += `\n`
    }

    return markdown
  }

  private static exportMoodsMarkdown(): string {
    const store = useProfileStore()
    let markdown = `# Mood Tracking\n\n`
    
    markdown += `| Date | Mood | Note |\n`
    markdown += `|------|------|------|\n`
    
    const sortedMoods = [...store.moods]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    sortedMoods.forEach(mood => {
      const note = mood.note ? mood.note.replace(/\|/g, '\\|') : ''
      markdown += `| ${this.formatDate(mood.date)} | ${mood.mood}/10 | ${note} |\n`
    })

    return markdown
  }

  private static exportKnowledgeMarkdown(): string {
    const store = useProfileStore()
    let markdown = `# Knowledge Base\n\n`
    
    const sortedKnowledge = [...store.knowledge]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    
    sortedKnowledge.forEach(entry => {
      markdown += `## ${entry.title}\n\n`
      markdown += `${entry.content}\n\n`
      markdown += `---\n\n`
    })

    return markdown
  }

  // Utility methods
  private static groupSkillsByCategory(skills: Skill[]): Record<string, Skill[]> {
    return skills.reduce((groups, skill) => {
      const category = skill.category || 'Other'
      if (!groups[category]) groups[category] = []
      groups[category].push(skill)
      return groups
    }, {} as Record<string, Skill[]>)
  }

  private static groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
    return tasks.reduce((groups, task) => {
      if (!groups[task.date]) groups[task.date] = []
      groups[task.date].push(task)
      return groups
    }, {} as Record<string, Task[]>)
  }

  private static formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  private static getMoodEmoji(mood: number): string {
    if (mood <= 2) return '😢'
    if (mood <= 4) return '😕'
    if (mood <= 6) return '😐'
    if (mood <= 8) return '🙂'
    return '😊'
  }

  private static getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      'High': '🔥',
      'Medium': '⭐',
      'Low': '💡'
    }
    return icons[priority] || '⭐'
  }
}

import { useProfileStore } from '@/stores/useProfileStore'

export interface ImportResult {
  success: boolean
  message: string
  imported: {
    tasks: number
    moods: number
    journal: number
    skills: number
    aspirationalSkills: number
    knowledge: number
    profile: boolean
  }
}

export class MarkdownImporter {
  private getStore() {
    return useProfileStore()
  }

  async importFromMarkdown(markdownContent: string): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      message: '',
      imported: {
        tasks: 0,
        moods: 0,
        journal: 0,
        skills: 0,
        aspirationalSkills: 0,
        knowledge: 0,
        profile: false
      }
    }

    try {
      // Parse different sections of the markdown
      const sections = this.parseMarkdownSections(markdownContent)
      
      // Import each section
      if (sections.profile) {
        this.importProfile(sections.profile)
        result.imported.profile = true
      }

      if (sections.tasks) {
        result.imported.tasks = this.importTasks(sections.tasks)
      }

      if (sections.moods) {
        result.imported.moods = this.importMoods(sections.moods)
      }

      if (sections.journal) {
        result.imported.journal = this.importJournal(sections.journal)
      }

      if (sections.skills) {
        result.imported.skills = this.importSkills(sections.skills)
      }

      if (sections.aspirationalSkills) {
        result.imported.aspirationalSkills = this.importAspirationalSkills(sections.aspirationalSkills)
      }

      if (sections.knowledge) {
        result.imported.knowledge = this.importKnowledge(sections.knowledge)
      }

      result.success = true
      result.message = 'Data imported successfully!'
      
    } catch (error) {
      result.success = false
      result.message = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    return result
  }

  private parseMarkdownSections(content: string) {
    const sections: Record<string, string> = {}
    
    // Split content by main headers (## headers)
    const headerRegex = /^## (.+)$/gm
    const parts = content.split(headerRegex)
    
    for (let i = 1; i < parts.length; i += 2) {
      const sectionName = parts[i].toLowerCase().trim()
      const sectionContent = parts[i + 1]?.trim() || ''
      
      // Map section names to our data types based on export format
      if (sectionName.includes('👤 user profile') || sectionName.includes('user profile')) {
        sections.profile = sectionContent
      } else if (sectionName.includes('✅ tasks') || sectionName.includes('tasks')) {
        sections.tasks = sectionContent
      } else if (sectionName.includes('😊 mood tracking') || sectionName.includes('mood')) {
        sections.moods = sectionContent
      } else if (sectionName.includes('📔 journal entries') || sectionName.includes('journal')) {
        sections.journal = sectionContent
      } else if (sectionName.includes('🎯 current skills') || (sectionName.includes('skill') && !sectionName.includes('want to learn'))) {
        sections.skills = sectionContent
      } else if (sectionName.includes('📚 skills i want to learn') || sectionName.includes('aspirational') || sectionName.includes('want to learn')) {
        sections.aspirationalSkills = sectionContent
      } else if (sectionName.includes('🧠 knowledge base') || sectionName.includes('knowledge')) {
        sections.knowledge = sectionContent
      }
    }

    return sections
  }

  private importProfile(content: string): void {
    // Parse profile information from markdown in export format
    const lines = content.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Parse name (format: **Name:** John Doe)
      if (trimmed.match(/^\*\*name\*\*:\s*(.+)/i)) {
        const fullName = trimmed.replace(/^\*\*name\*\*:\s*/i, '').trim()
        const nameParts = fullName.split(' ')
        if (nameParts.length >= 1) {
          this.getStore().updateUserProfile({ firstName: nameParts[0] })
        }
        if (nameParts.length >= 2) {
          this.getStore().updateUserProfile({ lastName: nameParts.slice(1).join(' ') })
        }
      }
      
      // Parse birth timestamp (format: **Birth Timestamp:** 631152000000)
      if (trimmed.match(/^\*\*birth\s*timestamp\*\*:\s*(.+)/i)) {
        const birthStr = trimmed.replace(/^\*\*birth\s*timestamp\*\*:\s*/i, '').trim()
        this.getStore().updateUserProfile({ birthTimestamp: birthStr })
      }
    }
  }

  private importTasks(content: string): number {
    let importedCount = 0
    
    // Split by date headers (### Date format)
    const dateHeaderRegex = /^### (.+)$/gm
    const parts = content.split(dateHeaderRegex)
    
    for (let i = 1; i < parts.length; i += 2) {
      const dateStr = parts[i].trim()
      const tasksContent = parts[i + 1]?.trim() || ''
      
      const lines = tasksContent.split('\n').filter(line => line.trim())
      
      for (const line of lines) {
        const trimmed = line.trim()
        
        // Parse task items (- [ ] or - [x] format from export)
        const taskMatch = trimmed.match(/^-\s*\[([x\s])\]\s*(.+)/i)
        if (taskMatch) {
          const completed = taskMatch[1].toLowerCase() === 'x'
          const text = taskMatch[2].trim()
          
          this.getStore().addTask(text)
          if (completed) {
            // Find the task we just added and mark it as completed
            const task = this.getStore().tasks.find((t: any) => t.text === text)
            if (task) {
              this.getStore().toggleTask(task.id)
            }
          }
          importedCount++
        }
      }
    }
    
    return importedCount
  }

  private importMoods(content: string): number {
    let importedCount = 0
    const lines = content.split('\n').filter(line => line.trim())
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Parse mood table format from export (| Date | Mood | Note |)
      const tableMatch = trimmed.match(/\|\s*(.+?)\s*\|\s*(\d+)\/10\s*[^\|]*\|\s*(.*?)\s*\|/)
      if (tableMatch) {
        const mood = parseInt(tableMatch[2])
        const note = tableMatch[3].trim()
        
        if (mood >= 1 && mood <= 10) {
          this.getStore().addMoodEntry(mood, note || undefined)
          importedCount++
        }
      }
    }
    
    return importedCount
  }

  private importJournal(content: string): number {
    let importedCount = 0
    
    // Split by date headers (### Date format)
    const dateHeaderRegex = /^### (.+)$/gm
    const parts = content.split(dateHeaderRegex)
    
    for (let i = 1; i < parts.length; i += 2) {
      const dateStr = parts[i].trim()
      const entryContent = parts[i + 1]?.trim()
      
      if (dateStr && entryContent) {
        // Try to parse the date string, handle various formats
        let date: string
        
        // If it's already in YYYY-MM-DD format
        if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
          date = dateStr
        } else {
          // Try to parse other date formats and convert to YYYY-MM-DD
          const parsedDate = new Date(dateStr)
          if (!isNaN(parsedDate.getTime())) {
            date = parsedDate.toISOString().split('T')[0]
          } else {
            // If we can't parse the date, use today
            date = new Date().toISOString().split('T')[0]
          }
        }
        
        // Remove any trailing separators
        const cleanContent = entryContent.replace(/---\s*$/, '').trim()
        
        this.getStore().saveJournalEntry(date, cleanContent)
        importedCount++
      }
    }
    
    return importedCount
  }

  private importSkills(content: string): number {
    let importedCount = 0
    
    // Split by category headers (### Category format)
    const categoryHeaderRegex = /^### (.+)$/gm
    const parts = content.split(categoryHeaderRegex)
    
    for (let i = 1; i < parts.length; i += 2) {
      const category = parts[i].trim()
      const skillsContent = parts[i + 1]?.trim() || ''
      
      const lines = skillsContent.split('\n').filter(line => line.trim())
      
      for (const line of lines) {
        const trimmed = line.trim()
        
        // Parse skill entries in export format (- **Name** (level/10))
        const skillMatch = trimmed.match(/^-\s*\*\*(.+?)\*\*\s*\((\d+)\/10\)/i)
        if (skillMatch) {
          const name = skillMatch[1].trim()
          const proficiency = parseInt(skillMatch[2])
          
          if (proficiency >= 1 && proficiency <= 10) {
            this.getStore().addSkill(name, category, proficiency)
            importedCount++
          }
        }
      }
    }
    
    return importedCount
  }

  private importAspirationalSkills(content: string): number {
    let importedCount = 0
    
    // Split by priority headers (### Priority format)
    const priorityHeaderRegex = /^### (.+priority)$/gmi
    const parts = content.split(priorityHeaderRegex)
    
    for (let i = 1; i < parts.length; i += 2) {
      const priorityHeader = parts[i].trim()
      const skillsContent = parts[i + 1]?.trim() || ''
      
      // Extract priority from header (e.g., "🔥 High Priority" -> "High")
      let priority: 'Low' | 'Medium' | 'High' = 'Medium'
      if (priorityHeader.toLowerCase().includes('high')) priority = 'High'
      else if (priorityHeader.toLowerCase().includes('low')) priority = 'Low'
      else if (priorityHeader.toLowerCase().includes('medium')) priority = 'Medium'
      
      const lines = skillsContent.split('\n').filter(line => line.trim())
      
      for (const line of lines) {
        const trimmed = line.trim()
        
        // Parse aspirational skill entries in export format (- **Name** (Category))
        const skillMatch = trimmed.match(/^-\s*\*\*(.+?)\*\*\s*\((.+?)\)/i)
        if (skillMatch) {
          const name = skillMatch[1].trim()
          const category = skillMatch[2].trim()
          
          if (name) {
            this.getStore().addAspirationalSkill(name, category, priority)
            importedCount++
          }
        }
      }
    }
    
    return importedCount
  }

  private importKnowledge(content: string): number {
    let importedCount = 0
    
    // Split by knowledge entry headers (### Title format)
    const entryHeaderRegex = /^### (.+)$/gm
    const parts = content.split(entryHeaderRegex)
    
    for (let i = 1; i < parts.length; i += 2) {
      const title = parts[i]?.trim()
      const entryContent = parts[i + 1]?.trim()
      
      if (title && entryContent) {
        // Remove metadata lines (*Created:*, *Updated:*) and separators
        const cleanContent = entryContent
          .replace(/\*Created:.*$/gm, '')
          .replace(/\*Updated:.*$/gm, '')
          .replace(/---\s*$/gm, '')
          .trim()
        
        if (cleanContent) {
          this.getStore().addKnowledgeEntry(title, cleanContent)
          importedCount++
        }
      }
    }
    
    return importedCount
  }
}

export const markdownImporter = new MarkdownImporter()

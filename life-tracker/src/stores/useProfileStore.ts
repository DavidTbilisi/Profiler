import { defineStore } from 'pinia'
import { JsonStorage, type LifeTrackerData } from '@/utils/jsonStorage'

export interface Task {
  id: string
  text: string
  completed: boolean
  date: string
}

export interface MoodEntry {
  date: string
  mood: number
  note?: string
}

export interface KnowledgeEntry {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface JournalEntry {
  date: string
  content: string
}

export interface UserProfile {
  firstName?: string
  lastName?: string
  birthTimestamp?: string
  createdAt?: string
}

export interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  description?: string
  learningGoals?: string
  createdAt: string
  updatedAt: string
  // Dependency system
  prerequisites?: string[] // Array of skill IDs that are required before this skill
  unlocks?: string[] // Array of skill IDs that this skill unlocks
  dependencyLevel?: number // Calculated depth in dependency tree
}

export interface SkillDependency {
  fromSkillId: string
  toSkillId: string
  requiredProficiency?: number // Minimum proficiency level required
  description?: string // Why this dependency exists
}

export interface AspirationalSkill {
  id: string
  name: string
  category: string
  priority: 'Low' | 'Medium' | 'High'
  reason?: string
  targetProficiency?: number
  targetDate?: string
  resources?: string
  createdAt: string
  updatedAt: string
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    tasks: [] as Task[],
    journal: {} as Record<string, JournalEntry>,
    moods: [] as MoodEntry[],
    knowledge: [] as KnowledgeEntry[],
    skills: [] as Skill[],
    aspirationalSkills: [] as AspirationalSkill[],
    skillDependencies: [] as SkillDependency[],
    userProfile: {
      firstName: '',
      lastName: '',
      birthTimestamp: '',
      createdAt: new Date().toISOString()
    } as UserProfile,
    stats: {
      totalTasks: 0,
      completedTasks: 0,
      averageMood: 0,
      journalEntries: 0,
      knowledgeEntries: 0,
      totalSkills: 0,
      aspirationalSkills: 0
    }
  }),
  
  getters: {
    todaysTasks: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.tasks.filter(task => task.date === today)
    },
    
    completionRate: (state) => {
      const total = state.tasks.length
      if (total === 0) return 0
      const completed = state.tasks.filter(task => task.completed).length
      return Math.round((completed / total) * 100)
    },
    
    recentMoods: (state) => {
      return state.moods
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7)
    },

    // Skill dependency getters
    skillsWithDependencies: (state) => {
      return state.skills.map(skill => {
        const prerequisites = state.skillDependencies
          .filter(dep => dep.toSkillId === skill.id)
          .map(dep => state.skills.find(s => s.id === dep.fromSkillId))
          .filter(Boolean)
        
        const unlocks = state.skillDependencies
          .filter(dep => dep.fromSkillId === skill.id)
          .map(dep => state.skills.find(s => s.id === dep.toSkillId))
          .filter(Boolean)
        
        return {
          ...skill,
          prerequisiteSkills: prerequisites,
          unlockedSkills: unlocks
        }
      })
    },

    dependencyTree: (state) => {
      const dependencies = state.skillDependencies
      const skills = state.skills
      
      // Calculate skill levels in dependency tree
      const skillLevels = new Map<string, number>()
      const visited = new Set<string>()
      
      function calculateLevel(skillId: string): number {
        if (visited.has(skillId)) return skillLevels.get(skillId) || 0
        visited.add(skillId)
        
        const deps = dependencies.filter(d => d.toSkillId === skillId)
        if (deps.length === 0) {
          skillLevels.set(skillId, 0)
          return 0
        }
        
        const maxPrereqLevel = Math.max(...deps.map(d => calculateLevel(d.fromSkillId)))
        const level = maxPrereqLevel + 1
        skillLevels.set(skillId, level)
        return level
      }
      
      skills.forEach(skill => calculateLevel(skill.id))
      
      return {
        levels: skillLevels,
        dependencies: dependencies
      }
    },

    availableSkills: (state) => {
      // Skills that can be learned (prerequisites met)
      return state.skills.filter(skill => {
        const prerequisites = state.skillDependencies
          .filter(dep => dep.toSkillId === skill.id)
        
        return prerequisites.every(dep => {
          const prereqSkill = state.skills.find(s => s.id === dep.fromSkillId)
          return prereqSkill && prereqSkill.proficiency >= (dep.requiredProficiency || 1)
        })
      })
    },

    blockedSkills: (state) => {
      // Skills that cannot be learned yet (prerequisites not met)
      return state.skills.filter(skill => {
        const prerequisites = state.skillDependencies
          .filter(dep => dep.toSkillId === skill.id)
        
        return prerequisites.some(dep => {
          const prereqSkill = state.skills.find(s => s.id === dep.fromSkillId)
          return !prereqSkill || prereqSkill.proficiency < (dep.requiredProficiency || 1)
        })
      })
    }
  },
  
  actions: {
    // Task management
    addTask(text: string) {
      const task: Task = {
        id: Date.now().toString(),
        text,
        completed: false,
        date: new Date().toISOString().split('T')[0]
      }
      this.tasks.push(task)
      this.saveToLocalStorage()
    },
    
    toggleTask(id: string) {
      const task = this.tasks.find(t => t.id === id)
      if (task) {
        task.completed = !task.completed
        this.saveToLocalStorage()
      }
    },
    
    removeTask(id: string) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      this.saveToLocalStorage()
    },
    
    // Journal management
    saveJournalEntry(date: string, content: string) {
      this.journal[date] = { date, content }
      this.saveToLocalStorage()
    },
    
    // Mood tracking
    addMoodEntry(mood: number, note?: string) {
      const date = new Date().toISOString().split('T')[0]
      const existingIndex = this.moods.findIndex(m => m.date === date)
      
      const entry: MoodEntry = { date, mood, note }
      
      if (existingIndex >= 0) {
        this.moods[existingIndex] = entry
      } else {
        this.moods.push(entry)
      }
      this.saveToLocalStorage()
    },
    
    // Knowledge base
    addKnowledgeEntry(title: string, content: string) {
      const entry: KnowledgeEntry = {
        id: Date.now().toString(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      this.knowledge.push(entry)
      this.saveToLocalStorage()
    },
    
    updateKnowledgeEntry(id: string, title: string, content: string) {
      const entry = this.knowledge.find(k => k.id === id)
      if (entry) {
        entry.title = title
        entry.content = content
        entry.updatedAt = new Date().toISOString()
        this.saveToLocalStorage()
      }
    },

    removeKnowledgeEntry(id: string) {
      this.knowledge = this.knowledge.filter(k => k.id !== id)
      this.saveToLocalStorage()
    },

    // Skills management
    addSkill(name: string, category: string, proficiency: number, description?: string, learningGoals?: string) {
      const skill: Skill = {
        id: Date.now().toString(),
        name,
        category,
        proficiency,
        description,
        learningGoals,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      this.skills.push(skill)
      this.saveToLocalStorage()
    },

    updateSkill(id: string, name: string, category: string, proficiency: number, description?: string, learningGoals?: string) {
      const skill = this.skills.find(s => s.id === id)
      if (skill) {
        skill.name = name
        skill.category = category
        skill.proficiency = proficiency
        skill.description = description
        skill.learningGoals = learningGoals
        skill.updatedAt = new Date().toISOString()
        this.saveToLocalStorage()
      }
    },

    removeSkill(id: string) {
      // Also remove any dependencies involving this skill
      this.skillDependencies = this.skillDependencies.filter(
        dep => dep.fromSkillId !== id && dep.toSkillId !== id
      )
      this.skills = this.skills.filter(s => s.id !== id)
      this.saveToLocalStorage()
    },

    // Skill Dependencies management
    addSkillDependency(fromSkillId: string, toSkillId: string, requiredProficiency?: number, description?: string) {
      // Prevent circular dependencies
      if (this.wouldCreateCircularDependency(fromSkillId, toSkillId)) {
        throw new Error('Cannot create circular dependency')
      }
      
      // Check if dependency already exists
      const existingDep = this.skillDependencies.find(
        dep => dep.fromSkillId === fromSkillId && dep.toSkillId === toSkillId
      )
      
      if (!existingDep) {
        const dependency: SkillDependency = {
          fromSkillId,
          toSkillId,
          requiredProficiency,
          description
        }
        this.skillDependencies.push(dependency)
        this.saveToLocalStorage()
      }
    },

    removeSkillDependency(fromSkillId: string, toSkillId: string) {
      this.skillDependencies = this.skillDependencies.filter(
        dep => !(dep.fromSkillId === fromSkillId && dep.toSkillId === toSkillId)
      )
      this.saveToLocalStorage()
    },

    updateSkillDependency(fromSkillId: string, toSkillId: string, requiredProficiency?: number, description?: string) {
      const dependency = this.skillDependencies.find(
        dep => dep.fromSkillId === fromSkillId && dep.toSkillId === toSkillId
      )
      
      if (dependency) {
        dependency.requiredProficiency = requiredProficiency
        dependency.description = description
        this.saveToLocalStorage()
      }
    },

    wouldCreateCircularDependency(fromSkillId: string, toSkillId: string): boolean {
      // Check if adding this dependency would create a circular reference
      const visited = new Set<string>()
      
      function checkPath(currentId: string, targetId: string, dependencies: SkillDependency[]): boolean {
        if (currentId === targetId) return true
        if (visited.has(currentId)) return false
        
        visited.add(currentId)
        
        const nextDeps = dependencies.filter(dep => dep.fromSkillId === currentId)
        return nextDeps.some(dep => checkPath(dep.toSkillId, targetId, dependencies))
      }
      
      return checkPath(toSkillId, fromSkillId, this.skillDependencies)
    },

    getSkillLearningPath(skillId: string): Skill[] {
      // Get the optimal learning path to acquire a skill
      const visited = new Set<string>()
      const path: Skill[] = []
      
      const buildPath = (currentSkillId: string) => {
        if (visited.has(currentSkillId)) return
        visited.add(currentSkillId)
        
        const prerequisites = this.skillDependencies
          .filter(dep => dep.toSkillId === currentSkillId)
          .map(dep => dep.fromSkillId)
        
        prerequisites.forEach(prereqId => buildPath(prereqId))
        
        const skill = this.skills.find(s => s.id === currentSkillId)
        if (skill) path.push(skill)
      }
      
      buildPath(skillId)
      return path
    },

    // Aspirational Skills management
    addAspirationalSkill(name: string, category: string, priority: 'Low' | 'Medium' | 'High', reason?: string, targetProficiency?: number, targetDate?: string, resources?: string) {
      const aspirationalSkill: AspirationalSkill = {
        id: Date.now().toString(),
        name,
        category,
        priority,
        reason,
        targetProficiency,
        targetDate,
        resources,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      this.aspirationalSkills.push(aspirationalSkill)
      this.saveToLocalStorage()
    },

    updateAspirationalSkill(id: string, name: string, category: string, priority: 'Low' | 'Medium' | 'High', reason?: string, targetProficiency?: number, targetDate?: string, resources?: string) {
      const aspirationalSkill = this.aspirationalSkills.find(s => s.id === id)
      if (aspirationalSkill) {
        aspirationalSkill.name = name
        aspirationalSkill.category = category
        aspirationalSkill.priority = priority
        aspirationalSkill.reason = reason
        aspirationalSkill.targetProficiency = targetProficiency
        aspirationalSkill.targetDate = targetDate
        aspirationalSkill.resources = resources
        aspirationalSkill.updatedAt = new Date().toISOString()
        this.saveToLocalStorage()
      }
    },

    removeAspirationalSkill(id: string) {
      this.aspirationalSkills = this.aspirationalSkills.filter(s => s.id !== id)
      this.saveToLocalStorage()
    },

    convertAspirationalToSkill(aspirationalSkillId: string, initialProficiency: number = 1) {
      const aspirationalSkill = this.aspirationalSkills.find(s => s.id === aspirationalSkillId)
      if (aspirationalSkill) {
        // Add as a regular skill
        this.addSkill(
          aspirationalSkill.name,
          aspirationalSkill.category,
          initialProficiency,
          `Started learning: ${aspirationalSkill.reason || ''}`,
          aspirationalSkill.reason
        )
        // Remove from aspirational skills
        this.removeAspirationalSkill(aspirationalSkillId)
      }
    },

    // Storage management
    saveToLocalStorage() {
      try {
        console.log('💾 Saving data to localStorage...', {
          skills: this.skills.length,
          aspirationalSkills: this.aspirationalSkills.length,
          skillDependencies: this.skillDependencies.length
        })
        JsonStorage.saveData(this.$state)
        console.log('✅ Data saved successfully')
      } catch (error) {
        console.error('❌ Failed to save to localStorage:', error)
      }
    },
    
    loadFromLocalStorage() {
      try {
        console.log('🔄 Loading data from localStorage...')
        const data = JsonStorage.loadData()
        if (data) {
          console.log('✅ Data found in localStorage:', {
            skills: data.skills?.length || 0,
            aspirationalSkills: data.aspirationalSkills?.length || 0,
            skillDependencies: data.skillDependencies?.length || 0
          })
          
          // Data migration: ensure proficiency values are numbers
          if (data.skills) {
            data.skills = data.skills.map((skill: any) => ({
              ...skill,
              proficiency: Number(skill.proficiency) || 5
            }))
          }
          
          // Update state with loaded data
          this.tasks = data.tasks || []
          this.journal = data.journal || {}
          this.moods = data.moods || []
          this.knowledge = data.knowledge || []
          this.skills = data.skills || []
          this.aspirationalSkills = data.aspirationalSkills || []
          this.skillDependencies = data.skillDependencies || []
          this.userProfile = data.userProfile || this.userProfile
          this.stats = data.stats || this.stats
          this.updateStats()
          
          console.log('✅ State updated with loaded data')
        } else {
          console.log('ℹ️ No data found in localStorage')
        }
      } catch (error) {
        console.error('❌ Failed to load from localStorage:', error)
      }
    },
    
    updateStats() {
      this.stats.totalTasks = this.tasks.length
      this.stats.completedTasks = this.tasks.filter(t => t.completed).length
      this.stats.averageMood = this.moods.length > 0 
        ? Math.round(this.moods.reduce((sum, m) => sum + m.mood, 0) / this.moods.length * 10) / 10
        : 0
      this.stats.journalEntries = Object.keys(this.journal).length
      this.stats.knowledgeEntries = this.knowledge.length
      this.stats.totalSkills = this.skills.length
      this.stats.aspirationalSkills = this.aspirationalSkills.length
    },

        // Demo data helper
    addDemoSkillData() {
      // Clear existing data
      this.skills = []
      this.aspirationalSkills = []
      this.skillDependencies = []
      
      const now = new Date().toISOString()
      
      // Add demo skills
      this.skills.push(
        { id: '1', name: 'HTML', category: 'Web Development', proficiency: 7, createdAt: now, updatedAt: now },
        { id: '2', name: 'CSS', category: 'Web Development', proficiency: 7, createdAt: now, updatedAt: now },
        { id: '3', name: 'JavaScript', category: 'Programming', proficiency: 8, createdAt: now, updatedAt: now }
      )

      this.aspirationalSkills.push(
        { id: '4', name: 'Vue.js', category: 'Web Development', priority: 'High' as const, targetProficiency: 8, targetDate: '2024-12-01', createdAt: now, updatedAt: now },
        { id: '5', name: 'React', category: 'Web Development', priority: 'Medium' as const, targetProficiency: 7, targetDate: '2024-11-01', createdAt: now, updatedAt: now },
        { id: '6', name: 'Node.js', category: 'Backend Development', priority: 'High' as const, targetProficiency: 8, targetDate: '2024-10-01', createdAt: now, updatedAt: now }
      )

      // Add dependencies
      this.skillDependencies.push(
        { fromSkillId: '1', toSkillId: '2', description: 'HTML basics needed for CSS' }, // HTML -> CSS
        { fromSkillId: '2', toSkillId: '4', description: 'CSS styling needed for Vue components' }, // CSS -> Vue.js
        { fromSkillId: '3', toSkillId: '4', description: 'JavaScript fundamentals required for Vue' }, // JavaScript -> Vue.js
        { fromSkillId: '3', toSkillId: '5', description: 'JavaScript needed for React development' }, // JavaScript -> React
        { fromSkillId: '3', toSkillId: '6', description: 'JavaScript is the foundation of Node.js' }  // JavaScript -> Node.js
      )
      
      // Save to localStorage
      this.saveToLocalStorage()
    },
    createDemoDependencies() {
      if (this.skillDependencies.length > 0) return // Don't create if already exist
      
      // Find skills by name patterns for common programming progression
      const findSkill = (pattern: string) => 
        this.skills.find(s => s.name.toLowerCase().includes(pattern.toLowerCase()))
      
      const htmlSkill = findSkill('html')
      const cssSkill = findSkill('css') 
      const jsSkill = findSkill('javascript')
      const reactSkill = findSkill('react')
      const nodeSkill = findSkill('node')
      const pythonSkill = findSkill('python')
      const sqlSkill = findSkill('sql')
      
      // Create logical dependencies
      if (htmlSkill && cssSkill) {
        this.addSkillDependency(htmlSkill.id, cssSkill.id, 3, 'CSS requires basic HTML knowledge')
      }
      
      if (cssSkill && jsSkill) {
        this.addSkillDependency(cssSkill.id, jsSkill.id, 4, 'JavaScript often manipulates CSS')
      }
      
      if (jsSkill && reactSkill) {
        this.addSkillDependency(jsSkill.id, reactSkill.id, 6, 'React requires solid JavaScript fundamentals')
      }
      
      if (jsSkill && nodeSkill) {
        this.addSkillDependency(jsSkill.id, nodeSkill.id, 5, 'Node.js is JavaScript on the server')
      }
      
      if (pythonSkill && sqlSkill) {
        this.addSkillDependency(pythonSkill.id, sqlSkill.id, 4, 'Database skills complement Python development')
      }
    },
    
    // User profile management
    setBirthTimestamp(timestamp: string) {
      this.userProfile.birthTimestamp = timestamp
      this.saveToLocalStorage()
    },
    
    clearBirthTimestamp() {
      this.userProfile.birthTimestamp = ''
      this.saveToLocalStorage()
    },
    
    updateUserProfile(profile: Partial<UserProfile>) {
      Object.assign(this.userProfile, profile)
      this.saveToLocalStorage()
    },

    // JSON Export/Import methods
    exportToJsonFile(filename?: string) {
      JsonStorage.exportToFile(this.$state, filename)
    },

    async importFromJsonFile(file: File): Promise<{ success: boolean; message: string }> {
      try {
        const data = await JsonStorage.importFromFile(file)
        
        // Update state with imported data
        this.tasks = data.tasks || []
        this.journal = data.journal || {}
        this.moods = data.moods || []
        this.knowledge = data.knowledge || []
        this.skills = data.skills || []
        this.aspirationalSkills = data.aspirationalSkills || []
        this.userProfile = { ...this.userProfile, ...data.userProfile }
        
        // Save to localStorage
        this.saveToLocalStorage()
        this.updateStats()
        
        return {
          success: true,
          message: `Successfully imported data from ${file.name}`
        }
      } catch (error) {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Failed to import data'
        }
      }
    },

    clearAllData() {
      // Reset state to initial values
      this.tasks = []
      this.journal = {}
      this.moods = []
      this.knowledge = []
      this.skills = []
      this.aspirationalSkills = []
      this.userProfile = {
        firstName: '',
        lastName: '',
        birthTimestamp: '',
        createdAt: new Date().toISOString()
      }
      this.stats = {
        totalTasks: 0,
        completedTasks: 0,
        averageMood: 0,
        journalEntries: 0,
        knowledgeEntries: 0,
        totalSkills: 0,
        aspirationalSkills: 0
      }
      
      // Clear localStorage
      JsonStorage.clearData()
    }
  }
})

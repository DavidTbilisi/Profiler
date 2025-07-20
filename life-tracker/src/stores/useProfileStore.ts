import { defineStore } from 'pinia'

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
}

export const useProfileStore = defineStore('profile', {
  state: () => ({
    tasks: [] as Task[],
    journal: {} as Record<string, JournalEntry>,
    moods: [] as MoodEntry[],
    knowledge: [] as KnowledgeEntry[],
    skills: [] as Skill[],
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
      totalSkills: 0
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
      this.skills = this.skills.filter(s => s.id !== id)
      this.saveToLocalStorage()
    },    // Storage management
    saveToLocalStorage() {
      try {
        localStorage.setItem('profileData', JSON.stringify(this.$state))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    },
    
    loadFromLocalStorage() {
      try {
        const data = localStorage.getItem('profileData')
        if (data) {
          const parsed = JSON.parse(data)
          Object.assign(this, parsed)
          this.updateStats()
        }
      } catch (error) {
        console.error('Failed to load from localStorage:', error)
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
    }
  }
})

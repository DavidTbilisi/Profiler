export interface LifeTrackerData {
  tasks: any[]
  journal: Record<string, any>
  moods: any[]
  knowledge: any[]
  skills: any[]
  aspirationalSkills: any[]
  skillDependencies: any[]
  userProfile: any
  stats: any
  exportedAt: string
  version: string
}

export class JsonStorage {
  private static readonly STORAGE_KEY = 'life-tracker-data'
  private static readonly VERSION = '1.0.0'

  static saveData(data: Partial<LifeTrackerData>): void {
    try {
      const completeData: LifeTrackerData = {
        tasks: data.tasks || [],
        journal: data.journal || {},
        moods: data.moods || [],
        knowledge: data.knowledge || [],
        skills: data.skills || [],
        aspirationalSkills: data.aspirationalSkills || [],
        skillDependencies: data.skillDependencies || [],
        userProfile: data.userProfile || {},
        stats: data.stats || {},
        exportedAt: new Date().toISOString(),
        version: this.VERSION
      }

      const jsonString = JSON.stringify(completeData, null, 2)
      localStorage.setItem(this.STORAGE_KEY, jsonString)
    } catch (error) {
      console.error('Failed to save data to localStorage:', error)
      throw new Error('Failed to save data')
    }
  }

  static loadData(): LifeTrackerData | null {
    try {
      const jsonString = localStorage.getItem(this.STORAGE_KEY)
      if (!jsonString) return null

      const data = JSON.parse(jsonString) as LifeTrackerData
      
      // Validate data structure
      if (!this.validateDataStructure(data)) {
        console.warn('Invalid data structure found in localStorage')
        return null
      }

      return data
    } catch (error) {
      console.error('Failed to load data from localStorage:', error)
      return null
    }
  }

  static exportToFile(data: Partial<LifeTrackerData>, filename?: string): void {
    const completeData: LifeTrackerData = {
      tasks: data.tasks || [],
      journal: data.journal || {},
      moods: data.moods || [],
      knowledge: data.knowledge || [],
      skills: data.skills || [],
      aspirationalSkills: data.aspirationalSkills || [],
      skillDependencies: data.skillDependencies || [],
      userProfile: data.userProfile || {},
      stats: data.stats || {},
      exportedAt: new Date().toISOString(),
      version: this.VERSION
    }

    const jsonString = JSON.stringify(completeData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `life-tracker-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static async importFromFile(file: File): Promise<LifeTrackerData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string
          const data = JSON.parse(jsonString) as LifeTrackerData
          
          if (!this.validateDataStructure(data)) {
            reject(new Error('Invalid data structure in imported file'))
            return
          }

          resolve(data)
        } catch (error) {
          reject(new Error('Failed to parse JSON file'))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsText(file)
    })
  }

  private static validateDataStructure(data: any): data is LifeTrackerData {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.tasks) &&
      typeof data.journal === 'object' &&
      Array.isArray(data.moods) &&
      Array.isArray(data.knowledge) &&
      Array.isArray(data.skills) &&
      Array.isArray(data.aspirationalSkills) &&
      typeof data.userProfile === 'object' &&
      typeof data.exportedAt === 'string' &&
      typeof data.version === 'string'
    )
  }

  static clearData(): void {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static hasData(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null
  }
}

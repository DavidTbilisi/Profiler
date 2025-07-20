/**
 * Local Storage utility functions for the Life Tracker app
 */

export interface StorageData {
  tasks: any[]
  journal: Record<string, any>
  moods: any[]
  knowledge: any[]
  stats: any
}

const STORAGE_KEY = 'profileData'

/**
 * Save data to localStorage
 */
export function saveToStorage(data: StorageData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
    return false
  }
}

/**
 * Load data from localStorage
 */
export function loadFromStorage(): StorageData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Failed to load from localStorage:', error)
    return null
  }
}

/**
 * Clear all data from localStorage
 */
export function clearStorage(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
    return false
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Get storage usage information
 */
export function getStorageInfo() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    const sizeInBytes = data ? new Blob([data]).size : 0
    const sizeInKB = Math.round(sizeInBytes / 1024 * 100) / 100
    
    return {
      sizeInBytes,
      sizeInKB,
      hasData: !!data
    }
  } catch {
    return {
      sizeInBytes: 0,
      sizeInKB: 0,
      hasData: false
    }
  }
}

<template>
  <div class="space-y-6">
    <!-- JSON Export Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">JSON Data Export</h2>
          <p class="text-gray-600 mt-1">Export your life tracker data as JSON files for backup or transfer</p>
        </div>
        <div class="text-4xl">📁</div>
      </div>

      <div class="space-y-4">
        <!-- Complete JSON Export -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">📋 Complete JSON Export</h3>
          <p class="text-gray-600 mb-4">
            Export all your data in a single comprehensive JSON file including all tasks, journal entries, moods, skills, and knowledge base.
          </p>
          <button
            @click="exportComplete"
            class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            📥 Download Complete JSON Export
          </button>
        </div>

        <!-- Section-Specific JSON Exports -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">📂 Export by Section</h3>
          <p class="text-gray-600 mb-4">
            Export individual sections as separate JSON files for focused data management.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              @click="exportSection('skills')"
              :disabled="store.skills.length === 0 && store.aspirationalSkills.length === 0"
              class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              🎯 Skills ({{ store.skills.length + store.aspirationalSkills.length }})
            </button>

            <button
              @click="exportSection('journal')"
              :disabled="Object.keys(store.journal).length === 0"
              class="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              📔 Journal ({{ Object.keys(store.journal).length }})
            </button>

            <button
              @click="exportSection('tasks')"
              :disabled="store.tasks.length === 0"
              class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              ✅ Tasks ({{ store.tasks.length }})
            </button>

            <button
              @click="exportSection('moods')"
              :disabled="store.moods.length === 0"
              class="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              😊 Moods ({{ store.moods.length }})
            </button>

            <button
              @click="exportSection('knowledge')"
              :disabled="store.knowledge.length === 0"
              class="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              🧠 Knowledge ({{ store.knowledge.length }})
            </button>

            <button
              @click="exportSection('profile')"
              class="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors"
            >
              👤 Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- JSON Import Section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">JSON Data Import</h2>
          <p class="text-gray-600 mt-1">Import life tracker data from JSON files</p>
        </div>
        <div class="text-4xl">📂</div>
      </div>

      <div class="space-y-4">
        <!-- File Upload Area -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            ref="fileInput"
            type="file"
            accept=".json"
            @change="handleFileUpload"
            class="hidden"
          />
          
          <div class="space-y-4">
            <div class="text-6xl">📄</div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Import JSON Data</h3>
              <p class="text-gray-600">Click to select a JSON file or drag and drop</p>
            </div>
            <button
              @click="() => fileInput?.click()"
              class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Choose JSON File
            </button>
          </div>
        </div>

        <!-- Import Options -->
        <div class="border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">⚙️ Import Options</h3>
          <div class="space-y-3">
            <label class="flex items-center space-x-2">
              <input
                v-model="importOptions.mergeData"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-gray-700">Merge with existing data (instead of replacing)</span>
            </label>
            <label class="flex items-center space-x-2">
              <input
                v-model="importOptions.createBackup"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-gray-700">Create backup before importing</span>
            </label>
          </div>
        </div>

        <!-- Import Result -->
        <div v-if="importResult" class="border rounded-lg p-4" :class="{
          'border-green-200 bg-green-50': importResult.success,
          'border-red-200 bg-red-50': !importResult.success
        }">
          <div class="flex items-center space-x-2">
            <span v-if="importResult.success" class="text-green-600">✅</span>
            <span v-else class="text-red-600">❌</span>
            <span class="font-medium" :class="{
              'text-green-800': importResult.success,
              'text-red-800': !importResult.success
            }">
              {{ importResult.message }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Data Management</h2>
          <p class="text-gray-600 mt-1">Manage your stored data</p>
        </div>
        <div class="text-4xl">🗃️</div>
      </div>

      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Data Statistics -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">📊 Data Overview</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Tasks:</span>
                <span class="font-medium">{{ store.tasks.length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Journal Entries:</span>
                <span class="font-medium">{{ Object.keys(store.journal).length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Mood Entries:</span>
                <span class="font-medium">{{ store.moods.length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Skills:</span>
                <span class="font-medium">{{ store.skills.length }}</span>
              </div>
              <div class="flex justify-between">
                <span>Knowledge Entries:</span>
                <span class="font-medium">{{ store.knowledge.length }}</span>
              </div>
            </div>
          </div>

          <!-- Clear Data -->
          <div class="border border-red-200 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-red-800 mb-3">⚠️ Clear All Data</h3>
            <p class="text-red-600 text-sm mb-3">
              This will permanently delete all your data. This action cannot be undone.
            </p>
            <button
              @click="confirmClearData"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'
import { JsonStorage } from '@/utils/jsonStorage'

const store = useProfileStore()
const fileInput = ref()
const importResult = ref<{ success: boolean; message: string } | null>(null)
const importOptions = ref({
  mergeData: false,
  createBackup: true
})

const exportComplete = () => {
  store.exportToJsonFile()
}

const exportSection = (section: string) => {
  const data: any = { exportedAt: new Date().toISOString(), version: '1.0.0' }
  
  switch (section) {
    case 'skills':
      data.skills = store.skills
      data.aspirationalSkills = store.aspirationalSkills
      break
    case 'journal':
      data.journal = store.journal
      break
    case 'tasks':
      data.tasks = store.tasks
      break
    case 'moods':
      data.moods = store.moods
      break
    case 'knowledge':
      data.knowledge = store.knowledge
      break
    case 'profile':
      data.userProfile = store.userProfile
      break
  }
  
  JsonStorage.exportToFile(data, `life-tracker-${section}-${new Date().toISOString().split('T')[0]}.json`)
}

const handleFileUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  importResult.value = null

  try {
    if (importOptions.value.createBackup) {
      // Create backup before importing
      store.exportToJsonFile(`backup-before-import-${new Date().toISOString().split('T')[0]}.json`)
    }

    const result = await store.importFromJsonFile(file)
    importResult.value = result

    // Clear the file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    importResult.value = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to import file'
    }
  }
}

const confirmClearData = () => {
  if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
    if (confirm('This will permanently delete ALL your tasks, journal entries, skills, and other data. Are you absolutely sure?')) {
      store.clearAllData()
      importResult.value = {
        success: true,
        message: 'All data has been cleared successfully.'
      }
    }
  }
}
</script>

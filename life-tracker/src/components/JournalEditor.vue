<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Journal</h2>
    
    <!-- Date selector -->
    <div class="mb-4">
      <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
        Select Date
      </label>
      <input
        id="date"
        v-model="selectedDate"
        type="date"
        class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <!-- Journal content -->
    <div class="mb-4">
      <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
        How was your day?
      </label>
      <textarea
        id="content"
        v-model="journalContent"
        placeholder="Write about your day, thoughts, experiences..."
        rows="8"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      ></textarea>
    </div>
    
    <!-- Save button -->
    <div class="flex justify-between items-center">
      <button
        @click="saveEntry"
        class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Save Entry
      </button>
      <span v-if="lastSaved" class="text-sm text-gray-500">
        Last saved: {{ formatTime(lastSaved) }}
      </span>
    </div>
    
    <!-- Auto-save indicator -->
    <div v-if="isAutoSaving" class="mt-2 text-sm text-blue-500">
      Auto-saving...
    </div>
    
    <!-- Recent entries -->
    <div v-if="recentEntries.length > 0" class="mt-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Recent Entries</h3>
      <div class="space-y-2">
        <div
          v-for="entry in recentEntries"
          :key="entry.date"
          class="p-3 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
          @click="loadEntry(entry.date)"
        >
          <div class="flex justify-between items-center">
            <span class="font-medium">{{ formatDate(entry.date) }}</span>
            <span class="text-sm text-gray-500">
              {{ entry.content.substring(0, 50) }}{{ entry.content.length > 50 ? '...' : '' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'

const store = useProfileStore()
const selectedDate = ref(new Date().toISOString().split('T')[0])
const journalContent = ref('')
const lastSaved = ref<Date | null>(null)
const isAutoSaving = ref(false)

const recentEntries = computed(() => {
  return Object.values(store.journal)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
})

// Load entry for selected date
watch(selectedDate, (newDate) => {
  const entry = store.journal[newDate]
  journalContent.value = entry ? entry.content : ''
})

// Auto-save functionality
watch(journalContent, () => {
  if (journalContent.value.trim()) {
    isAutoSaving.value = true
    setTimeout(() => {
      saveEntry()
      isAutoSaving.value = false
    }, 1000) // Auto-save after 1 second of no typing
  }
})

function saveEntry() {
  if (journalContent.value.trim()) {
    store.saveJournalEntry(selectedDate.value, journalContent.value)
    lastSaved.value = new Date()
  }
}

function loadEntry(date: string) {
  selectedDate.value = date
  const entry = store.journal[date]
  journalContent.value = entry ? entry.content : ''
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

onMounted(() => {
  // Load today's entry if it exists
  const entry = store.journal[selectedDate.value]
  if (entry) {
    journalContent.value = entry.content
  }
})
</script>

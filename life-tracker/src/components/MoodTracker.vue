<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Mood Tracker</h2>
    
    <!-- Current mood input -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-3">
        How are you feeling today?
      </label>
      
      <!-- Mood slider -->
      <div class="mb-4">
        <input
          v-model="currentMood"
          type="range"
          min="1"
          max="10"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mood-slider"
        />
        <div class="flex justify-between text-sm text-gray-500 mt-1">
          <span>😢 Very Bad</span>
          <span>😐 Neutral</span>
          <span>😊 Amazing</span>
        </div>
      </div>
      
      <!-- Current mood display -->
      <div class="text-center mb-4">
        <div class="text-4xl mb-2">{{ getMoodEmoji(currentMood) }}</div>
        <div class="text-lg font-semibold text-gray-700">
          {{ getMoodText(currentMood) }} ({{ currentMood }}/10)
        </div>
      </div>
      
      <!-- Optional note -->
      <div class="mb-4">
        <label for="moodNote" class="block text-sm font-medium text-gray-700 mb-2">
          Add a note (optional)
        </label>
        <textarea
          id="moodNote"
          v-model="moodNote"
          placeholder="What's affecting your mood today?"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>
      
      <!-- Save button -->
      <button
        @click="saveMood"
        class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save Today's Mood
      </button>
    </div>
    
    <!-- Today's mood if already recorded -->
    <div v-if="todaysMood" class="mb-6 p-4 bg-blue-50 rounded-md">
      <h3 class="font-semibold text-blue-800 mb-2">Today's Recorded Mood</h3>
      <div class="flex items-center gap-3">
        <span class="text-2xl">{{ getMoodEmoji(todaysMood.mood) }}</span>
        <div>
          <div class="font-medium">{{ getMoodText(todaysMood.mood) }} ({{ todaysMood.mood }}/10)</div>
          <div v-if="todaysMood.note" class="text-sm text-gray-600">{{ todaysMood.note }}</div>
        </div>
      </div>
    </div>
    
    <!-- Mood history -->
    <div v-if="recentMoods.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">Recent Mood History</h3>
      
      <!-- Average mood -->
      <div class="mb-4 p-3 bg-gray-50 rounded-md">
        <div class="text-sm text-gray-600">7-day average</div>
        <div class="text-lg font-semibold">{{ averageMood }}/10</div>
      </div>
      
      <!-- Mood chart -->
      <div class="space-y-2">
        <div
          v-for="mood in recentMoods"
          :key="mood.date"
          class="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
        >
          <span class="text-lg">{{ getMoodEmoji(mood.mood) }}</span>
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium">{{ formatDate(mood.date) }}</span>
              <span class="text-sm text-gray-600">{{ mood.mood }}/10</span>
            </div>
            <div v-if="mood.note" class="text-xs text-gray-500 mt-1">{{ mood.note }}</div>
          </div>
          <!-- Mood bar -->
          <div class="w-24 bg-gray-200 rounded-full h-2">
            <div
              class="h-2 rounded-full transition-all duration-300"
              :class="getMoodColor(mood.mood)"
              :style="{ width: `${(mood.mood / 10) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'

const store = useProfileStore()
const currentMood = ref(5)
const moodNote = ref('')

const recentMoods = computed(() => store.recentMoods)

const todaysMood = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return store.moods.find(mood => mood.date === today)
})

const averageMood = computed(() => {
  if (recentMoods.value.length === 0) return 0
  const sum = recentMoods.value.reduce((acc, mood) => acc + mood.mood, 0)
  return Math.round((sum / recentMoods.value.length) * 10) / 10
})

function getMoodEmoji(mood: number): string {
  if (mood <= 2) return '😢'
  if (mood <= 4) return '😕'
  if (mood <= 6) return '😐'
  if (mood <= 8) return '🙂'
  return '😊'
}

function getMoodText(mood: number): string {
  if (mood <= 2) return 'Very Bad'
  if (mood <= 4) return 'Bad'
  if (mood <= 6) return 'Neutral'
  if (mood <= 8) return 'Good'
  return 'Amazing'
}

function getMoodColor(mood: number): string {
  if (mood <= 3) return 'bg-red-500'
  if (mood <= 5) return 'bg-yellow-500'
  if (mood <= 7) return 'bg-blue-500'
  return 'bg-green-500'
}

function saveMood() {
  store.addMoodEntry(currentMood.value, moodNote.value.trim() || undefined)
  moodNote.value = ''
  // Reset to neutral after saving
  currentMood.value = 5
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

onMounted(() => {
  // Set current mood to today's mood if already recorded
  if (todaysMood.value) {
    currentMood.value = todaysMood.value.mood
    moodNote.value = todaysMood.value.note || ''
  }
})
</script>

<style scoped>
.mood-slider::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.mood-slider::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style>

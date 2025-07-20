<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Life Statistics</h2>
    
    <!-- Quick stats grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Total Tasks -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-blue-600">Total Tasks</p>
            <p class="text-2xl font-bold text-blue-900">{{ stats.totalTasks }}</p>
          </div>
          <div class="text-blue-500 text-2xl">📝</div>
        </div>
      </div>
      
      <!-- Completion Rate -->
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-green-600">Completion Rate</p>
            <p class="text-2xl font-bold text-green-900">{{ completionRate }}%</p>
          </div>
          <div class="text-green-500 text-2xl">✅</div>
        </div>
      </div>
      
      <!-- Average Mood -->
      <div class="bg-yellow-50 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-yellow-600">Average Mood</p>
            <p class="text-2xl font-bold text-yellow-900">{{ stats.averageMood }}/10</p>
          </div>
          <div class="text-yellow-500 text-2xl">😊</div>
        </div>
      </div>
      
      <!-- Journal Entries -->
      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-purple-600">Journal Entries</p>
            <p class="text-2xl font-bold text-purple-900">{{ stats.journalEntries }}</p>
          </div>
          <div class="text-purple-500 text-2xl">📔</div>
        </div>
      </div>
    </div>
    
    <!-- Activity overview -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div class="space-y-3">
        <!-- Today's progress -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <span class="font-medium">Today's Tasks Progress</span>
            <span class="text-sm text-gray-600">{{ todaysCompleted }}/{{ todaysTotal }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${todaysProgress}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Current streak -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <div class="flex justify-between items-center">
            <span class="font-medium">Current Productive Streak</span>
            <span class="text-lg font-bold text-orange-600">{{ currentStreak }} days</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mood trend -->
    <div v-if="moodTrend.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Mood Trend (Last 7 Days)</h3>
      <div class="flex items-end justify-between h-32 bg-gray-50 p-4 rounded-lg">
        <div
          v-for="(mood, index) in moodTrend"
          :key="index"
          class="flex flex-col items-center"
        >
          <div
            class="w-8 bg-blue-500 rounded-t transition-all duration-300"
            :style="{ height: `${(mood.mood / 10) * 80}px` }"
          ></div>
          <span class="text-xs text-gray-600 mt-1">{{ formatDay(mood.date) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Goals and insights -->
    <div>
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Insights & Goals</h3>
      <div class="space-y-3">
        <div class="p-3 bg-blue-50 rounded-lg">
          <p class="text-sm text-blue-800">
            💡 You've completed {{ stats.completedTasks }} tasks so far. 
            {{ getMotivationalMessage() }}
          </p>
        </div>
        
        <div class="p-3 bg-green-50 rounded-lg">
          <p class="text-sm text-green-800">
            🎯 Goal: Maintain a mood above 6/10 and complete daily tasks consistently.
          </p>
        </div>
        
        <div v-if="stats.averageMood > 0" class="p-3 bg-yellow-50 rounded-lg">
          <p class="text-sm text-yellow-800">
            📈 Your average mood is {{ stats.averageMood }}/10. 
            {{ getMoodAdvice() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'

const store = useProfileStore()

const stats = computed(() => {
  store.updateStats()
  return store.stats
})

const completionRate = computed(() => store.completionRate)

const todaysTotal = computed(() => store.todaysTasks.length)
const todaysCompleted = computed(() => 
  store.todaysTasks.filter(task => task.completed).length
)
const todaysProgress = computed(() => {
  if (todaysTotal.value === 0) return 0
  return Math.round((todaysCompleted.value / todaysTotal.value) * 100)
})

const currentStreak = computed(() => {
  // Calculate consecutive days with at least one completed task
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayTasks = store.tasks.filter(task => task.date === dateStr)
    const hasCompletedTask = dayTasks.some(task => task.completed)
    
    if (hasCompletedTask) {
      streak++
    } else {
      break
    }
  }
  
  return streak
})

const moodTrend = computed(() => {
  return store.recentMoods.slice(0, 7).reverse()
})

function formatDay(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function getMotivationalMessage(): string {
  if (stats.value.completedTasks === 0) {
    return "Start by completing your first task today!"
  } else if (stats.value.completedTasks < 5) {
    return "Great start! Keep building that momentum."
  } else if (stats.value.completedTasks < 20) {
    return "You're making good progress! Stay consistent."
  } else {
    return "Impressive dedication! You're building great habits."
  }
}

function getMoodAdvice(): string {
  if (stats.value.averageMood >= 8) {
    return "Excellent! You're maintaining a very positive mindset."
  } else if (stats.value.averageMood >= 6) {
    return "Good balance! Look for small ways to boost your mood further."
  } else if (stats.value.averageMood >= 4) {
    return "Consider what activities or habits might improve your daily mood."
  } else {
    return "Focus on self-care and activities that bring you joy."
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Life Tracker Dashboard</h1>
        <p class="text-gray-600">{{ getCurrentGreeting() }} Let's make today productive!</p>
      </header>
      
      <!-- Quick stats -->
            <!-- Summary cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <!-- Today's Tasks -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Today's Tasks</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ todaysCompleted }}/{{ todaysTotal }}
              </p>
            </div>
            <div class="text-blue-500 text-3xl">📝</div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${todaysProgress}%` }"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- Today's Mood -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Today's Mood</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ todaysMood ? `${todaysMood.mood}/10` : 'Not set' }}
              </p>
            </div>
            <div class="text-3xl">
              {{ todaysMood ? getMoodEmoji(todaysMood.mood) : '😐' }}
            </div>
          </div>
        </div>
        
        <!-- Journal Status -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Journal Entry</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ todaysJournal ? 'Written' : 'Pending' }}
              </p>
            </div>
            <div class="text-3xl">
              {{ todaysJournal ? '📔' : '📝' }}
            </div>
          </div>
        </div>
               <!-- Skills Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Skills Portfolio</p>
              <p class="text-2xl font-bold text-gray-900">{{ store.skills.length }} Skills</p>
            </div>
            <div class="text-green-500 text-3xl">🎯</div>
          </div>
          <div v-if="store.skills.length > 0" class="mt-2 flex items-center justify-between">
            <p class="text-xs text-gray-500">
              {{ averageSkillLevel.toFixed(1) }}/10
            </p>
            <div class="flex items-center gap-1">
              <span class="text-sm">{{ getSkillLevelEmoji(averageSkillLevel) }}</span>
              <span :class="['text-xs font-medium', getSkillLevelColor(averageSkillLevel)]">
                {{ getSkillLevelText(averageSkillLevel) }}
              </span>
            </div>
          </div>
          <div v-else class="mt-2">
            <p class="text-xs text-gray-500">No skills tracked yet</p>
          </div>
        </div>


        <!-- Age Info or Knowledge Entries -->
        <div v-if="store.userProfile.birthTimestamp" class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Your Age</p>
              <p class="text-2xl font-bold text-gray-900">{{ calculateAge() }}</p>
            </div>
            <div class="text-purple-500 text-3xl">🎂</div>
          </div>
          <div class="mt-2">
            <p class="text-xs text-gray-500">{{ calculateDaysLived() }} days lived</p>
          </div>
        </div>
        
        <!-- Total Knowledge (fallback if no birth timestamp) -->
        <div v-else class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Knowledge Entries</p>
              <p class="text-2xl font-bold text-gray-900">{{ store.knowledge.length }}</p>
            </div>
            <div class="text-purple-500 text-3xl">📚</div>
          </div>
        </div>
        
 
      </div>
      
      <!-- Main content grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Skills Radar Chart -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-800">Skills Overview</h2>
            <router-link
              to="/skills"
              class="text-blue-500 hover:text-blue-700 text-sm"
            >
              View Details →
            </router-link>
          </div>
          <SkillsRadarChart />
          <div v-if="store.skills.length > 0" class="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div class="font-semibold text-gray-800">{{ store.skills.length }}</div>
              <div class="text-gray-600 text-xs">Total Skills</div>
            </div>
            <div>
              <div class="font-semibold text-gray-800 flex items-center justify-center gap-1">
                <span>{{ averageSkillLevel.toFixed(1) }}/10</span>
                <span class="text-sm">{{ getSkillLevelEmoji(averageSkillLevel) }}</span>
              </div>
              <div :class="['text-xs font-medium', getSkillLevelColor(averageSkillLevel)]">
                {{ getSkillLevelText(averageSkillLevel) }}
              </div>
            </div>
            <div>
              <div class="font-semibold text-gray-800">{{ expertSkillsCount }}</div>
              <div class="text-gray-600 text-xs">Expert Level</div>
            </div>
          </div>
        </div>

        <!-- Today's tasks overview -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">Quick Tasks</h2>
          <div v-if="todaysTasks.length > 0" class="space-y-2">
            <div
              v-for="task in todaysTasks.slice(0, 5)"
              :key="task.id"
              class="flex items-center gap-3 p-2 bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                :checked="task.completed"
                @change="store.toggleTask(task.id)"
                class="w-4 h-4 text-blue-600 rounded"
              />
              <span
                :class="[
                  'flex-1',
                  task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                ]"
              >
                {{ task.text }}
              </span>
            </div>
            <router-link
              to="/tasks"
              class="block text-center text-blue-500 hover:text-blue-700 text-sm mt-4"
            >
              View all tasks →
            </router-link>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <p class="mb-4">No tasks for today</p>
            <router-link
              to="/tasks"
              class="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Tasks
            </router-link>
          </div>
        </div>
        
        <!-- Quick mood and journal -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Mood and Journal side by side -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mood quick entry -->
            <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">How are you feeling?</h2>
            <div v-if="!todaysMood" class="text-center">
              <p class="text-gray-600 mb-4">Track your mood for today</p>
              <router-link
                to="/mood"
                class="inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Set Today's Mood
              </router-link>
            </div>
            <div v-else class="text-center">
              <div class="text-4xl mb-2">{{ getMoodEmoji(todaysMood.mood) }}</div>
              <p class="text-lg font-semibold">{{ getMoodText(todaysMood.mood) }}</p>
              <p class="text-gray-600">{{ todaysMood.mood }}/10</p>
              <router-link
                to="/mood"
                class="text-blue-500 hover:text-blue-700 text-sm"
              >
                Update mood →
              </router-link>
            </div>
          </div>
          
          <!-- Journal quick entry -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Today's Journal</h2>
            <div v-if="!todaysJournal" class="text-center">
              <p class="text-gray-600 mb-4">Write about your day</p>
              <router-link
                to="/journal"
                class="inline-block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Write Entry
              </router-link>
            </div>
            <div v-else>
              <p class="text-gray-600 mb-3 line-clamp-3">
                {{ todaysJournal.content.substring(0, 150) }}
                {{ todaysJournal.content.length > 150 ? '...' : '' }}
              </p>
              <router-link
                to="/journal"
                class="text-blue-500 hover:text-blue-700 text-sm"
              >
                Continue writing →
              </router-link>
            </div>
          </div>
          </div>
        </div>
      </div>
      
      <!-- Recent activity -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
        <div class="space-y-4">
          <!-- Recent completed tasks -->
          <div v-if="recentCompletedTasks.length > 0">
            <h3 class="font-semibold text-gray-700 mb-2">Recently Completed Tasks</h3>
            <div class="space-y-2">
              <div
                v-for="task in recentCompletedTasks.slice(0, 3)"
                :key="task.id"
                class="flex items-center gap-3 p-2 bg-green-50 rounded"
              >
                <span class="text-green-600">✅</span>
                <span class="text-gray-800">{{ task.text }}</span>
                <span class="text-xs text-gray-500">{{ formatTaskDate(task.date) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Recent mood entries -->
          <div v-if="store.moods.length > 0">
            <h3 class="font-semibold text-gray-700 mb-2">Mood History</h3>
            <div class="flex gap-2">
              <div
                v-for="mood in store.recentMoods.slice(0, 7)"
                :key="mood.date"
                class="flex flex-col items-center p-2 bg-gray-50 rounded"
              >
                <span class="text-lg">{{ getMoodEmoji(mood.mood) }}</span>
                <span class="text-xs text-gray-600">{{ formatMoodDate(mood.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'
import SkillsRadarChart from '@/components/SkillsRadarChart.vue'

const store = useProfileStore()

const todaysTasks = computed(() => store.todaysTasks)
const todaysTotal = computed(() => todaysTasks.value.length)
const todaysCompleted = computed(() => 
  todaysTasks.value.filter(task => task.completed).length
)
const todaysProgress = computed(() => {
  if (todaysTotal.value === 0) return 0
  return Math.round((todaysCompleted.value / todaysTotal.value) * 100)
})

const todaysMood = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return store.moods.find(mood => mood.date === today)
})

const todaysJournal = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return store.journal[today]
})

const recentCompletedTasks = computed(() => {
  return store.tasks
    .filter(task => task.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const averageSkillLevel = computed(() => {
  if (store.skills.length === 0) return 0
  const sum = store.skills.reduce((total, skill) => total + skill.proficiency, 0)
  return sum / store.skills.length
})

const expertSkillsCount = computed(() => {
  return store.skills.filter(skill => skill.proficiency >= 8).length
})

function getCurrentGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning!'
  if (hour < 17) return 'Good afternoon!'
  return 'Good evening!'
}

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

function getSkillLevelText(level: number): string {
  if (level === 0) return 'No Skills'
  if (level <= 2) return 'Beginner'
  if (level <= 4) return 'Novice'
  if (level <= 6) return 'Intermediate'
  if (level <= 8) return 'Advanced'
  return 'Expert'
}

function getSkillLevelEmoji(level: number): string {
  if (level === 0) return '🌱'
  if (level <= 2) return '🌱'
  if (level <= 4) return '🌿'
  if (level <= 6) return '🌳'
  if (level <= 8) return '🎯'
  return '🏆'
}

function getSkillLevelColor(level: number): string {
  if (level === 0) return 'text-gray-500'
  if (level <= 2) return 'text-red-500'
  if (level <= 4) return 'text-yellow-500'
  if (level <= 6) return 'text-blue-500'
  if (level <= 8) return 'text-green-500'
  return 'text-purple-500'
}

function formatTaskDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}

function formatMoodDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function calculateAge(): string {
  if (!store.userProfile.birthTimestamp) return 'N/A'
  
  const birth = new Date(store.userProfile.birthTimestamp)
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  
  const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000))
  const months = Math.floor((diffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000))
  
  return `${years}y ${months}m`
}

function calculateDaysLived(): number {
  if (!store.userProfile.birthTimestamp) return 0
  
  const birth = new Date(store.userProfile.birthTimestamp)
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  
  return Math.floor(diffMs / (24 * 60 * 60 * 1000))
}
</script>

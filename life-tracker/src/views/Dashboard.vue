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
              <p class="text-sm font-medium text-gray-600">Skill Points</p>
              <p 
                class="text-2xl font-bold text-gray-900 cursor-help" 
                :title="`Formula: ${currentSkillPoints} current points + ${totalSkillPoints - currentSkillPoints} aspirational points = ${totalSkillPoints} total points`"
              >
                {{ totalSkillPoints }}
              </p>
            </div>
            <div class="text-green-500 text-3xl">🎯</div>
          </div>
          <div class="mt-2 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">Skills Count:</span>
              <span class="font-medium text-green-600">{{ store.skills.length + store.aspirationalSkills.length }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">Current Points:</span>
              <span class="font-medium text-green-600">{{ currentSkillPoints }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">Max Possible:</span>
              <span 
                class="font-medium text-blue-600 cursor-help" 
                :title="`Formula: (${store.skills.length} current + ${store.aspirationalSkills.length} aspirational) × 10 = ${maxPossiblePoints} points`"
              >
                {{ maxPossiblePoints }}
              </span>
            </div>
            <div v-if="store.skills.length > 0" class="flex items-center justify-between text-xs pt-1 border-t">
              <span class="text-gray-500">Avg Level:</span>
              <div class="flex items-center gap-1">
                <span class="font-medium">{{ averageSkillLevel.toFixed(1) }}/10</span>
                <span class="text-sm">{{ getSkillLevelEmoji(averageSkillLevel) }}</span>
              </div>
            </div>
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
      
      <!-- Skills Overview - Full Width -->
      <div class="mb-8 bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-800">Skills Overview</h2>
          <router-link
            to="/skills"
            class="text-blue-500 hover:text-blue-700 text-sm"
          >
            View Details →
          </router-link>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <!-- Radar Chart -->
          <div class="flex justify-center">
            <div class="w-full max-w-md">
              <SkillsRadarChart />
            </div>
          </div>
          <!-- Stats -->
          <div class="space-y-4">
            <div v-if="store.skills.length > 0" class="grid grid-cols-3 gap-4 text-center">
              <div class="p-4 bg-blue-50 rounded-lg">
                <div class="font-semibold text-2xl text-blue-600">{{ store.skills.length }}</div>
                <div class="text-blue-800 text-sm">Total Skills</div>
              </div>
              <div class="p-4 bg-green-50 rounded-lg">
                <div class="font-semibold text-2xl text-green-600 flex items-center justify-center gap-2">
                  <span>{{ averageSkillLevel.toFixed(1) }}/10</span>
                  <span class="text-lg">{{ getSkillLevelEmoji(averageSkillLevel) }}</span>
                </div>
                <div :class="['text-sm font-medium', getSkillLevelColor(averageSkillLevel)]">
                  {{ getSkillLevelText(averageSkillLevel) }}
                </div>
              </div>
              <div class="p-4 bg-purple-50 rounded-lg">
                <div class="font-semibold text-2xl text-purple-600">{{ expertSkillsCount }}</div>
                <div class="text-purple-800 text-sm">Expert Level</div>
              </div>
            </div>
            <div v-if="store.aspirationalSkills.length > 0" class="mt-4 p-4 bg-yellow-50 rounded-lg text-center">
              <div class="font-semibold text-xl text-yellow-600">{{ store.aspirationalSkills.length }}</div>
              <div class="text-yellow-800 text-sm">Learning Goals</div>
              <router-link
                to="/skills"
                class="text-yellow-600 hover:text-yellow-800 text-xs mt-1 block"
              >
                View learning roadmap →
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <!-- Tasks Button -->
        <router-link
          to="/tasks"
          class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow group"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-800">Quick Tasks</h3>
              <p class="text-sm text-gray-600">{{ todaysCompleted }}/{{ todaysTotal }} completed</p>
            </div>
            <div class="text-blue-500 text-2xl group-hover:scale-110 transition-transform">📝</div>
          </div>
        </router-link>

        <!-- Mood Button -->
        <router-link
          to="/mood"
          class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow group"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-800">Mood Tracker</h3>
              <p class="text-sm text-gray-600">
                {{ todaysMood ? `${getMoodText(todaysMood.mood)} (${todaysMood.mood}/10)` : 'Not set today' }}
              </p>
            </div>
            <div class="text-2xl group-hover:scale-110 transition-transform">
              {{ todaysMood ? getMoodEmoji(todaysMood.mood) : '😐' }}
            </div>
          </div>
        </router-link>

        <!-- Journal Button -->
        <router-link
          to="/journal"
          class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow group"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-800">Today's Journal</h3>
              <p class="text-sm text-gray-600">
                {{ todaysJournal ? 'Entry written' : 'Write your thoughts' }}
              </p>
            </div>
            <div class="text-purple-500 text-2xl group-hover:scale-110 transition-transform">
              {{ todaysJournal ? '📔' : '📝' }}
            </div>
          </div>
        </router-link>

        <!-- Import Data Button -->
        <button
          @click="showImporter = !showImporter"
          class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow group text-left"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-gray-800">Import Data</h3>
              <p class="text-sm text-gray-600">
                {{ showImporter ? 'Hide importer' : 'From Markdown' }}
              </p>
            </div>
            <div class="text-green-500 text-2xl group-hover:scale-110 transition-transform">📥</div>
          </div>
        </button>
      </div>

      <!-- Markdown Importer (Collapsible) -->
      <div v-if="showImporter" class="mb-8">
        <MarkdownImporter />
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
import { computed, ref } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'
import SkillsRadarChart from '@/components/SkillsRadarChart.vue'
import MarkdownImporter from '@/components/MarkdownImporter.vue'

const store = useProfileStore()
const showImporter = ref(false)

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
  const sum = store.skills.reduce((total, skill) => total + Number(skill.proficiency), 0)
  return sum / store.skills.length
})

const expertSkillsCount = computed(() => {
  return store.skills.filter(skill => Number(skill.proficiency) >= 8).length
})

// Skill points calculations
const currentSkillPoints = computed(() => {
  return store.skills.reduce((total, skill) => total + Number(skill.proficiency), 0)
})

const totalSkillPoints = computed(() => {
  const currentPoints = store.skills.reduce((total, skill) => total + Number(skill.proficiency), 0)
  // Aspirational skills are counted as potential points (assume target proficiency of 7 if not specified)
  const aspirationalPoints = store.aspirationalSkills.reduce((total, skill) => {
    return total + (Number(skill.targetProficiency) || 7)
  }, 0)
  return currentPoints + aspirationalPoints
})

const maxPossiblePoints = computed(() => {
  return (store.skills.length + store.aspirationalSkills.length) * 10
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

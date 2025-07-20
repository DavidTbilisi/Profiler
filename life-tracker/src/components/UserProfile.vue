<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>
    
    <!-- Birth Timestamp Section -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">Birth Information</h3>
      
      <!-- Birth Date and Time Input -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">
            Birth Date
          </label>
          <input
            id="birthDate"
            v-model="birthDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="birthTime" class="block text-sm font-medium text-gray-700 mb-2">
            Birth Time
          </label>
          <input
            id="birthTime"
            v-model="birthTime"
            type="time"
            step="1"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <!-- Timezone Selection -->
      <div class="mb-4">
        <label for="timezone" class="block text-sm font-medium text-gray-700 mb-2">
          Birth Timezone
        </label>
        <select
          id="timezone"
          v-model="birthTimezone"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Timezone</option>
          <option v-for="tz in commonTimezones" :key="tz.value" :value="tz.value">
            {{ tz.label }}
          </option>
        </select>
      </div>
      
      <!-- Manual Timestamp Input (Alternative) -->
      <div class="mb-4">
        <label for="manualTimestamp" class="block text-sm font-medium text-gray-700 mb-2">
          Or Enter Exact Timestamp (ISO 8601 format)
        </label>
        <input
          id="manualTimestamp"
          v-model="manualTimestamp"
          type="text"
          placeholder="1990-01-15T14:30:00.000Z"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-gray-500 mt-1">
          Format: YYYY-MM-DDTHH:mm:ss.sssZ or use the date/time inputs above
        </p>
      </div>
      
      <!-- Save Button -->
      <div class="flex gap-2">
        <button
          @click="saveBirthInfo"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Birth Information
        </button>
        <button
          v-if="store.userProfile.birthTimestamp"
          @click="clearBirthInfo"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Clear
        </button>
      </div>
    </div>
    
    <!-- Current Birth Information Display -->
    <div v-if="store.userProfile.birthTimestamp" class="mb-6 p-4 bg-blue-50 rounded-lg">
      <h4 class="font-semibold text-blue-800 mb-2">Current Birth Information</h4>
      <div class="space-y-1 text-sm text-blue-700">
        <p><strong>Birth Timestamp:</strong> {{ store.userProfile.birthTimestamp }}</p>
        <p><strong>Formatted:</strong> {{ formatBirthTimestamp(store.userProfile.birthTimestamp) }}</p>
        <p><strong>Age:</strong> {{ calculateAge() }}</p>
        <p><strong>Days Lived:</strong> {{ calculateDaysLived() }} days</p>
        <p><strong>Hours Lived:</strong> {{ calculateHoursLived().toLocaleString() }} hours</p>
      </div>
    </div>
    
    <!-- Additional Profile Information -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            id="firstName"
            v-model="store.userProfile.firstName"
            type="text"
            placeholder="Your first name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @blur="store.saveToLocalStorage"
          />
        </div>
        
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            id="lastName"
            v-model="store.userProfile.lastName"
            type="text"
            placeholder="Your last name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @blur="store.saveToLocalStorage"
          />
        </div>
      </div>
    </div>
    
    <!-- Life Milestones -->
    <div v-if="store.userProfile.birthTimestamp" class="mt-8">
      <h3 class="text-lg font-semibold text-gray-700 mb-4">Life Milestones</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="milestone in lifeMilestones"
          :key="milestone.age"
          class="p-3 bg-gray-50 rounded-lg"
          :class="{
            'bg-green-50 border border-green-200': milestone.passed,
            'bg-yellow-50 border border-yellow-200': milestone.upcoming
          }"
        >
          <div class="font-medium">{{ milestone.name }}</div>
          <div class="text-sm text-gray-600">Age {{ milestone.age }}</div>
          <div class="text-xs text-gray-500">
            {{ milestone.passed ? 'Completed' : milestone.upcoming ? 'Upcoming' : formatDate(milestone.date) }}
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

const birthDate = ref('')
const birthTime = ref('')
const birthTimezone = ref('')
const manualTimestamp = ref('')

const commonTimezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
]

const lifeMilestones = computed(() => {
  if (!store.userProfile.birthTimestamp) return []
  
  const birthDate = new Date(store.userProfile.birthTimestamp)
  const now = new Date()
  const milestones = [
    { name: '1st Birthday', age: 1 },
    { name: '5th Birthday', age: 5 },
    { name: '10th Birthday', age: 10 },
    { name: 'Sweet 16', age: 16 },
    { name: '18th Birthday (Legal Adult)', age: 18 },
    { name: '21st Birthday', age: 21 },
    { name: '25th Birthday', age: 25 },
    { name: '30th Birthday', age: 30 },
    { name: '40th Birthday', age: 40 },
    { name: '50th Birthday', age: 50 },
    { name: '65th Birthday (Retirement)', age: 65 },
    { name: '75th Birthday', age: 75 },
    { name: '100th Birthday (Centenarian)', age: 100 }
  ]
  
  return milestones.map(milestone => {
    const milestoneDate = new Date(birthDate)
    milestoneDate.setFullYear(birthDate.getFullYear() + milestone.age)
    
    const currentAge = calculateAgeInYears()
    const passed = currentAge >= milestone.age
    const upcoming = !passed && currentAge >= milestone.age - 1
    
    return {
      ...milestone,
      date: milestoneDate,
      passed,
      upcoming
    }
  })
})

function saveBirthInfo() {
  let timestamp: string
  
  if (manualTimestamp.value.trim()) {
    // Use manual timestamp if provided
    try {
      const date = new Date(manualTimestamp.value)
      if (isNaN(date.getTime())) {
        alert('Invalid timestamp format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)')
        return
      }
      timestamp = date.toISOString()
    } catch (error) {
      alert('Invalid timestamp format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)')
      return
    }
  } else if (birthDate.value && birthTime.value) {
    // Construct timestamp from date and time inputs
    const dateTimeString = `${birthDate.value}T${birthTime.value}`
    
    if (birthTimezone.value) {
      // Create date with timezone
      try {
        const date = new Date(dateTimeString)
        timestamp = date.toISOString()
      } catch (error) {
        alert('Invalid date or time format')
        return
      }
    } else {
      // Assume local timezone
      const date = new Date(dateTimeString)
      timestamp = date.toISOString()
    }
  } else {
    alert('Please provide either a birth date and time, or a manual timestamp')
    return
  }
  
  store.setBirthTimestamp(timestamp)
  
  // Clear inputs after saving
  birthDate.value = ''
  birthTime.value = ''
  birthTimezone.value = ''
  manualTimestamp.value = ''
}

function clearBirthInfo() {
  if (confirm('Are you sure you want to clear your birth information?')) {
    store.clearBirthTimestamp()
  }
}

function formatBirthTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  })
}

function calculateAge(): string {
  if (!store.userProfile.birthTimestamp) return 'N/A'
  
  const birth = new Date(store.userProfile.birthTimestamp)
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  
  const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000))
  const months = Math.floor((diffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000))
  const days = Math.floor((diffMs % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000))
  
  return `${years} years, ${months} months, ${days} days`
}

function calculateAgeInYears(): number {
  if (!store.userProfile.birthTimestamp) return 0
  
  const birth = new Date(store.userProfile.birthTimestamp)
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  
  return Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000))
}

function calculateDaysLived(): number {
  if (!store.userProfile.birthTimestamp) return 0
  
  const birth = new Date(store.userProfile.birthTimestamp)
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  
  return Math.floor(diffMs / (24 * 60 * 60 * 1000))
}

function calculateHoursLived(): number {
  if (!store.userProfile.birthTimestamp) return 0
  
  const birth = new Date(store.userProfile.birthTimestamp)
  const now = new Date()
  const diffMs = now.getTime() - birth.getTime()
  
  return Math.floor(diffMs / (60 * 60 * 1000))
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  // Auto-detect current timezone
  if (!birthTimezone.value) {
    birthTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone
  }
})
</script>

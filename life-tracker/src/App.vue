<template>
  <div>
    <!-- Navigation -->
    <nav class="bg-gray-800 shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <h1 class="text-white text-xl font-bold">Life Tracker</h1>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex space-x-8">
            <RouterLink 
              to="/" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'dashboard' }"
            >
              Dashboard
            </RouterLink>
            <RouterLink 
              to="/tasks" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'tasks' }"
            >
              Tasks
            </RouterLink>
            <RouterLink 
              to="/journal" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'journal' }"
            >
              Journal
            </RouterLink>
            <RouterLink 
              to="/mood" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'mood' }"
            >
              Mood
            </RouterLink>
            <RouterLink 
              to="/stats" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'stats' }"
            >
              Stats
            </RouterLink>
            <RouterLink 
              to="/knowledge" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'knowledge' }"
            >
              Knowledge
            </RouterLink>
            <RouterLink 
              to="/skills" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'skills' }"
            >
              Skills
            </RouterLink>
            <RouterLink 
              to="/skill-map" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'skill-map' }"
            >
              Skill Map
            </RouterLink>
            <RouterLink 
              to="/data" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'data' }"
            >
              Data
            </RouterLink>
            <RouterLink 
              to="/profile" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="{ 'text-white bg-gray-900': $route.name === 'profile' }"
            >
              Profile
            </RouterLink>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <RouterLink 
              to="/" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Dashboard
            </RouterLink>
            <RouterLink 
              to="/tasks" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Tasks
            </RouterLink>
            <RouterLink 
              to="/journal" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Journal
            </RouterLink>
            <RouterLink 
              to="/mood" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Mood
            </RouterLink>
            <RouterLink 
              to="/stats" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Stats
            </RouterLink>
            <RouterLink 
              to="/knowledge" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Knowledge
            </RouterLink>
            <RouterLink 
              to="/skills" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Skills
            </RouterLink>
            <RouterLink 
              to="/skill-map" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Skill Map
            </RouterLink>
            <RouterLink 
              to="/data" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Data
            </RouterLink>
            <RouterLink 
              to="/profile" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              Profile
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'

const mobileMenuOpen = ref(false)
const store = useProfileStore()

// Load data from localStorage when app starts
onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

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
          <div class="hidden md:flex space-x-6">
            <!-- Core Features -->
            <div class="relative group">
              <button class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                📊 Core
                <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-1">
                  <RouterLink 
                    to="/" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'dashboard' }"
                  >
                    🏠 Dashboard
                  </RouterLink>
                  <RouterLink 
                    to="/tasks" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'tasks' }"
                  >
                    ✅ Tasks
                  </RouterLink>
                  <RouterLink 
                    to="/journal" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'journal' }"
                  >
                    📝 Journal
                  </RouterLink>
                  <RouterLink 
                    to="/mood" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'mood' }"
                  >
                    😊 Mood
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Learning & Skills -->
            <div class="relative group">
              <button class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                🎓 Learning
                <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-1">
                  <RouterLink 
                    to="/knowledge" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'knowledge' }"
                  >
                    📚 Knowledge
                  </RouterLink>
                  <RouterLink 
                    to="/skills" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'skills' }"
                  >
                    🛠️ Skills
                  </RouterLink>
                  <div class="border-t border-gray-100 my-1"></div>
                  <RouterLink 
                    to="/skill-map" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'skill-map' }"
                  >
                    🗺️ Skill Map
                  </RouterLink>
                  <RouterLink 
                    to="/skill-map-enhanced" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'skill-map-enhanced' }"
                  >
                    🚀 Enhanced Map
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Analytics -->
            <div class="relative group">
              <button class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors">
                📈 Analytics
                <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-1">
                  <RouterLink 
                    to="/stats" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'stats' }"
                  >
                    📊 Statistics
                  </RouterLink>
                  <RouterLink 
                    to="/data" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    :class="{ 'bg-gray-100 text-gray-900': $route.name === 'data' }"
                  >
                    💾 Data Management
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Profile/Settings -->
            <RouterLink 
              to="/profile" 
              class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              :class="{ 'text-white bg-gray-900': $route.name === 'profile' }"
            >
              ⚙️ Profile
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
            <!-- Core Section -->
            <div class="text-gray-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Core</div>
            <RouterLink 
              to="/" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              🏠 Dashboard
            </RouterLink>
            <RouterLink 
              to="/tasks" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              ✅ Tasks
            </RouterLink>
            <RouterLink 
              to="/journal" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              📝 Journal
            </RouterLink>
            <RouterLink 
              to="/mood" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              😊 Mood
            </RouterLink>
            
            <!-- Learning Section -->
            <div class="text-gray-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider mt-4">Learning</div>
            <RouterLink 
              to="/knowledge" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              📚 Knowledge
            </RouterLink>
            <RouterLink 
              to="/skills" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              🛠️ Skills
            </RouterLink>
            <RouterLink 
              to="/skill-map" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              🗺️ Skill Map
            </RouterLink>
            <RouterLink 
              to="/skill-map-enhanced" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              🚀 Enhanced Map
            </RouterLink>
            
            <!-- Analytics Section -->
            <div class="text-gray-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider mt-4">Analytics</div>
            <RouterLink 
              to="/stats" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              � Statistics
            </RouterLink>
            <RouterLink 
              to="/data" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              💾 Data Management
            </RouterLink>
            
            <!-- Profile Section -->
            <div class="text-gray-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider mt-4">Settings</div>
            <RouterLink 
              to="/profile" 
              class="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              @click="mobileMenuOpen = false"
            >
              ⚙️ Profile
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

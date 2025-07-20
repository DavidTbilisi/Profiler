<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Daily Tasks</h2>
    
    <!-- Add new task -->
    <div class="mb-4">
      <div class="flex gap-2">
        <input
          v-model="newTask"
          @keyup.enter="addTask"
          placeholder="Add a new task..."
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="addTask"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </div>
    </div>
    
    <!-- Task list -->
    <div class="space-y-2">
      <div
        v-for="task in todaysTasks"
        :key="task.id"
        class="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
      >
        <input
          type="checkbox"
          :checked="task.completed"
          @change="toggleTask(task.id)"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span
          :class="[
            'flex-1',
            task.completed ? 'line-through text-gray-500' : 'text-gray-800'
          ]"
        >
          {{ task.text }}
        </span>
        <button
          @click="removeTask(task.id)"
          class="text-red-500 hover:text-red-700 focus:outline-none"
        >
          ❌
        </button>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="todaysTasks.length === 0" class="text-center py-8 text-gray-500">
      No tasks for today. Add one above!
    </div>
    
    <!-- Progress -->
    <div v-if="todaysTasks.length > 0" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex justify-between text-sm text-gray-600 mb-2">
        <span>Progress</span>
        <span>{{ completedCount }}/{{ todaysTasks.length }} tasks completed</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-blue-500 h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'

const store = useProfileStore()
const newTask = ref('')

const todaysTasks = computed(() => store.todaysTasks)

const completedCount = computed(() => 
  todaysTasks.value.filter(task => task.completed).length
)

const progressPercentage = computed(() => {
  if (todaysTasks.value.length === 0) return 0
  return Math.round((completedCount.value / todaysTasks.value.length) * 100)
})

function addTask() {
  if (newTask.value.trim()) {
    store.addTask(newTask.value.trim())
    newTask.value = ''
  }
}

function toggleTask(id: string) {
  store.toggleTask(id)
}

function removeTask(id: string) {
  store.removeTask(id)
}
</script>

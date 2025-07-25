<template>
  <div class="mb-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          @input="$emit('filter')"
          type="text"
          placeholder="🔍 Search skills..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <select
          v-model="filterCategory"
          @change="$emit('filter')"
          class="px-3 py-2 border border-gray-300 rounded-md bg-white flex-1 sm:flex-none min-w-0"
        >
          <option value="">All Categories</option>
          <option v-for="category in availableCategories" :key="category" :value="category">
            {{ getCategoryIcon(category) }} {{ category }}
          </option>
        </select>
        <select
          v-model="filterStatus"
          @change="$emit('filter')"
          class="px-3 py-2 border border-gray-300 rounded-md bg-white flex-1 sm:flex-none min-w-0"
        >
          <option value="">All Skills</option>
          <option value="learned">✅ Learned</option>
          <option value="available">🟢 Available</option>
          <option value="blocked">🔒 Blocked</option>
          <option value="aspirational">⭐ Aspirational</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getCategoryIcon } from '@/constants/skillCategories'

interface Props {
  searchQuery: string
  filterCategory: string
  filterStatus: string
  availableCategories: string[]
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'update:filterCategory', value: string): void
  (e: 'update:filterStatus', value: string): void
  (e: 'filter'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Two-way binding with v-model
const searchQuery = computed({
  get: () => props.searchQuery,
  set: (value: string) => emit('update:searchQuery', value)
})

const filterCategory = computed({
  get: () => props.filterCategory,
  set: (value: string) => emit('update:filterCategory', value)
})

const filterStatus = computed({
  get: () => props.filterStatus,
  set: (value: string) => emit('update:filterStatus', value)
})
</script>

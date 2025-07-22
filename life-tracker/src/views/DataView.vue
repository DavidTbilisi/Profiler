<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Data Management</h1>
        <p class="mt-2 text-gray-600">Export, import, backup, and manage your Life Tracker data</p>
      </div>
      
      <!-- Tab Navigation -->
      <div class="mb-6">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'json'"
            :class="[
              'whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'json'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            📄 JSON Data
          </button>
          <button
            @click="activeTab = 'markdown'"
            :class="[
              'whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'markdown'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            📝 Markdown Export
          </button>
          <button
            @click="activeTab = 'import'"
            :class="[
              'whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            📂 Import Data
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'json'">
        <JsonDataManager />
      </div>

      <div v-if="activeTab === 'markdown'">
        <DataExport />
      </div>

      <div v-if="activeTab === 'import'">
        <MarkdownImporter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JsonDataManager from '@/components/JsonDataManager.vue'
import DataExport from '@/components/DataExport.vue'
import MarkdownImporter from '@/components/MarkdownImporter.vue'

const activeTab = ref('json')
</script>

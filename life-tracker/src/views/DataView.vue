<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Data Management</h1>
        <p class="mt-2 text-gray-600">Export, backup, and manage your Life Tracker data</p>
      </div>
      
      <DataExport />
    </div>
  </div>
</template>

<script setup lang="ts">
import DataExport from '@/components/DataExport.vue'
</script>

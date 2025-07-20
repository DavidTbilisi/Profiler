<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Skills Portfolio</h1>
        <p class="mt-2 text-gray-600">Track your skills, measure your proficiency, and set learning goals</p>
      </div>
      
      <SkillsManager />
    </div>
  </div>
</template>

<script setup lang="ts">
import SkillsManager from '@/components/SkillsManager.vue'
</script>

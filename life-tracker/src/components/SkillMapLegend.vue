<template>
  <div class="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
    <h3 class="text-sm font-semibold text-gray-700 mb-2">Legend:</h3>
    <div class="flex flex-wrap gap-4 text-xs">
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-700"></div>
        <span>Learned Skills</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-green-500 rounded-full border-2 border-green-700"></div>
        <span>Available to Learn</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-red-500 rounded-full border-2 border-red-700"></div>
        <span>Blocked (missing prerequisites)</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-4 h-4 bg-gray-400 rounded-full border-2 border-gray-600"></div>
        <span>Aspirational Skills</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed - pure display component
</script>

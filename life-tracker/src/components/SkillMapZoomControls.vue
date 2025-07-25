<template>
  <div class="absolute bottom-4 right-4 flex flex-col gap-2 z-40">
    <button
      @click="$emit('zoom-in')"
      class="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 shadow-md"
    >
      ➕
    </button>
    <button
      @click="$emit('zoom-out')"
      class="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 shadow-md"
    >
      ➖
    </button>
    <button
      @click="$emit('reset-zoom')"
      class="w-10 h-10 bg-white/90 backdrop-blur-sm border border-gray-300 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center text-gray-700 shadow-md"
    >
      🎯
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'zoom-in'): void
  (e: 'zoom-out'): void
  (e: 'reset-zoom'): void
}

defineEmits<Emits>()
</script>

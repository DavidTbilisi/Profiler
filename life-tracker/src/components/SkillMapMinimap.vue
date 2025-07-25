<template>
  <div
    v-if="showMinimap"
    class="absolute top-4 right-4 w-48 h-32 minimap-container z-50"
    title="Click to navigate • Shows current viewport"
    style="position: absolute; top: 1rem; right: 1rem;"
  >
    <div ref="minimapContainer" class="w-full h-full rounded-lg overflow-hidden relative">
      <!-- Viewport indicator overlay -->
      <div
        ref="viewportIndicator"
        class="absolute border-2 border-blue-500 border-dashed pointer-events-none opacity-80 z-10"
        style="display: none; transition: all 0.1s ease-out; background-color: rgba(59, 130, 246, 0.1);"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useMinimap } from '@/composables/useMinimap'

interface Props {
  showMinimap: boolean
  mainCy: any
}

const props = defineProps<Props>()

const {
  minimapContainer,
  viewportIndicator,
  initializeMinimap,
  updateMinimap,
  setupViewportSync,
  destroyMinimap
} = useMinimap()

// Watch for changes in main cytoscape instance
watch(() => props.mainCy, (newCy: any, oldCy: any) => {
  if (newCy && props.showMinimap) {
    initializeMinimap(newCy)
    setupViewportSync(newCy)
  }
})

// Watch for minimap visibility changes
watch(() => props.showMinimap, (show: boolean) => {
  if (show && props.mainCy) {
    setTimeout(() => {
      initializeMinimap(props.mainCy)
      setupViewportSync(props.mainCy)
    }, 100)
  } else {
    destroyMinimap()
  }
})

onMounted(() => {
  if (props.showMinimap && props.mainCy) {
    setTimeout(() => {
      initializeMinimap(props.mainCy)
      setupViewportSync(props.mainCy)
    }, 300)
  }
})

onUnmounted(() => {
  destroyMinimap()
})

// Expose methods for parent component
defineExpose({
  updateMinimap: () => updateMinimap(props.mainCy),
  setupViewportSync: () => setupViewportSync(props.mainCy)
})
</script>

<style scoped>
/* Minimap specific styles */
.minimap-container {
  position: relative;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.minimap-container:hover {
  border-color: #3b82f6;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2);
}
</style>

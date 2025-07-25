<template>
  <div class="flex flex-row flex-wrap items-center gap-2 mb-3 justify-between">
    <div class="flex gap-2">
      <button
        @click="$emit('fit-to-view')"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Fit to View
      </button>
      <button
        @click="$emit('export-image')"
        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Export PNG
      </button>
    </div>
    <div class="flex gap-4">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">Layout:</label>
        <select
          :value="selectedLayout"
          @change="$emit('update:selectedLayout', ($event.target as HTMLSelectElement).value)"
          class="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
        >
          <option value="cose">⚡ Force Directed</option>
          <option value="breadthfirst">📊 Hierarchical</option>
          <option value="circle">⭕ Circular</option>
          <option value="grid">⚏ Grid</option>
          <option value="concentric">🎪 Concentric</option>
          <option value="dagre">🌊 Dagre</option>
        </select>
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium text-gray-700">Theme:</label>
        <select
          :value="selectedTheme"
          @change="$emit('update:selectedTheme', ($event.target as HTMLSelectElement).value)"
          class="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
        >
          <option value="default">🎨 Default</option>
          <option value="dark">🌙 Dark</option>
          <option value="neon">✨ Neon</option>
          <option value="pastel">🌸 Pastel</option>
          <option value="professional">💼 Professional</option>
          <option value="ocean">🌊 Ocean</option>
          <option value="sunset">🌅 Sunset</option>
          <option value="forest">🌲 Forest</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  selectedLayout: string
  selectedTheme: string
}

interface Emits {
  (e: 'update:selectedLayout', value: string): void
  (e: 'update:selectedTheme', value: string): void
  (e: 'fit-to-view'): void
  (e: 'export-image'): void
}

defineProps<Props>()
defineEmits<Emits>()
</script>

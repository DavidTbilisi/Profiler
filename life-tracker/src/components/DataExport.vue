<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Data Export</h2>
        <p class="text-gray-600 mt-1">Export your life tracker data to markdown files for backup or sharing</p>
      </div>
      <div class="text-4xl">📁</div>
    </div>

    <!-- Export Options -->
    <div class="space-y-6">
      <!-- Complete Export -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">📋 Complete Export</h3>
        <p class="text-gray-600 mb-4">
          Export all your data in a single comprehensive markdown file including skills, tasks, journal entries, moods, and knowledge base.
        </p>
        <button
          @click="exportComplete"
          class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          📥 Download Complete Export
        </button>
      </div>

      <!-- Section-Specific Exports -->
      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">📂 Export by Section</h3>
        <p class="text-gray-600 mb-4">
          Export individual sections as separate markdown files for focused documentation.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <button
            @click="exportSection('skills')"
            :disabled="store.skills.length === 0 && store.aspirationalSkills.length === 0"
            class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            🎯 Skills ({{ store.skills.length + store.aspirationalSkills.length }})
          </button>

          <button
            @click="exportSection('journal')"
            :disabled="Object.keys(store.journal).length === 0"
            class="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            📔 Journal ({{ Object.keys(store.journal).length }})
          </button>

          <button
            @click="exportSection('tasks')"
            :disabled="store.tasks.length === 0"
            class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            ✅ Tasks ({{ store.tasks.length }})
          </button>

          <button
            @click="exportSection('moods')"
            :disabled="store.moods.length === 0"
            class="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            😊 Moods ({{ store.moods.length }})
          </button>

          <button
            @click="exportSection('knowledge')"
            :disabled="store.knowledge.length === 0"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            🧠 Knowledge ({{ store.knowledge.length }})
          </button>
        </div>
      </div>

      <!-- Export Preview -->
      <div v-if="previewContent" class="border border-gray-200 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold text-gray-800">📖 Export Preview</h3>
          <button
            @click="previewContent = ''"
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div class="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
          <pre class="text-sm text-gray-700 whitespace-pre-wrap">{{ previewContent }}</pre>
        </div>
        <div class="mt-3 flex gap-2">
          <button
            @click="copyToClipboard"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            📋 Copy to Clipboard
          </button>
        </div>
      </div>

      <!-- Info Section -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-blue-800 mb-2">💡 About Markdown Exports</h3>
        <div class="text-blue-700 space-y-2 text-sm">
          <p>• <strong>Portable:</strong> Markdown files can be opened in any text editor</p>
          <p>• <strong>Readable:</strong> Human-friendly format that's easy to read and edit</p>
          <p>• <strong>Version Control:</strong> Works great with Git for tracking changes over time</p>
          <p>• <strong>Compatible:</strong> Can be converted to HTML, PDF, or other formats</p>
          <p>• <strong>Future-proof:</strong> Plain text format that will always be accessible</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="flex gap-3 pt-4 border-t border-gray-200">
        <button
          @click="generatePreview"
          class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          👁️ Preview Complete Export
        </button>
        
        <button
          @click="showExportTip = !showExportTip"
          class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
        >
          💡 Export Tips
        </button>
      </div>

      <!-- Export Tips -->
      <div v-if="showExportTip" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-orange-800 mb-2">📚 Export Tips</h3>
        <div class="text-orange-700 space-y-2 text-sm">
          <p>• <strong>Regular Backups:</strong> Export monthly to keep backups of your progress</p>
          <p>• <strong>Share Progress:</strong> Share specific sections (like skills) with mentors or friends</p>
          <p>• <strong>Archive Goals:</strong> Export learning goals to track your growth over time</p>
          <p>• <strong>Documentation:</strong> Use journal exports for personal documentation</p>
          <p>• <strong>Analysis:</strong> Import into other tools for deeper analysis of your data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProfileStore } from '@/stores/useProfileStore'
import { MarkdownDataManager } from '@/utils/markdownDataManager'

const store = useProfileStore()
const previewContent = ref('')
const showExportTip = ref(false)

function exportComplete() {
  MarkdownDataManager.downloadMarkdown()
}

function exportSection(section: 'skills' | 'journal' | 'tasks' | 'moods' | 'knowledge') {
  MarkdownDataManager.downloadSectionMarkdown(section)
}

function generatePreview() {
  previewContent.value = MarkdownDataManager.exportToMarkdown()
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(previewContent.value)
    // You could add a toast notification here
    alert('Copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    alert('Failed to copy to clipboard. Please try again.')
  }
}
</script>

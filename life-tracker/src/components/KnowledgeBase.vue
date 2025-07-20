<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Knowledge Base</h2>
      <button
        @click="startNewEntry"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        + New Entry
      </button>
    </div>
    
    <!-- Search -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        placeholder="Search your knowledge base..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <!-- Editor -->
    <div v-if="isEditing" class="mb-6 p-4 border border-gray-300 rounded-lg">
      <div class="mb-4">
        <input
          v-model="editingEntry.title"
          placeholder="Entry title..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
        />
      </div>
      <div class="mb-4">
        <textarea
          v-model="editingEntry.content"
          placeholder="Write your knowledge entry here..."
          rows="8"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>
      <div class="flex gap-2">
        <button
          @click="saveEntry"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Save
        </button>
        <button
          @click="cancelEdit"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
    
    <!-- Knowledge entries -->
    <div class="space-y-4">
      <div
        v-for="entry in filteredEntries"
        :key="entry.id"
        class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="text-lg font-semibold text-gray-800">{{ entry.title }}</h3>
          <div class="flex gap-2">
            <button
              @click="editEntry(entry)"
              class="text-blue-500 hover:text-blue-700 focus:outline-none"
              title="Edit"
            >
              ✏️
            </button>
            <button
              @click="deleteEntry(entry.id)"
              class="text-red-500 hover:text-red-700 focus:outline-none"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
        
        <div class="text-gray-600 mb-3 whitespace-pre-wrap">
          {{ entry.content }}
        </div>
        
        <div class="flex justify-between text-xs text-gray-500">
          <span>Created: {{ formatDate(entry.createdAt) }}</span>
          <span v-if="entry.updatedAt !== entry.createdAt">
            Updated: {{ formatDate(entry.updatedAt) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="filteredEntries.length === 0 && !isEditing" class="text-center py-12">
      <div class="text-4xl mb-4">📚</div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">
        {{ searchQuery ? 'No entries found' : 'Your knowledge base is empty' }}
      </h3>
      <p class="text-gray-500 mb-4">
        {{ searchQuery 
          ? 'Try adjusting your search terms' 
          : 'Start building your personal knowledge base by creating your first entry'
        }}
      </p>
      <button
        v-if="!searchQuery"
        @click="startNewEntry"
        class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create First Entry
      </button>
    </div>
    
    <!-- Stats -->
    <div v-if="store.knowledge.length > 0" class="mt-8 pt-6 border-t border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div>
          <div class="text-2xl font-bold text-blue-600">{{ store.knowledge.length }}</div>
          <div class="text-sm text-gray-600">Total Entries</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-green-600">{{ totalWords }}</div>
          <div class="text-sm text-gray-600">Total Words</div>
        </div>
        <div>
          <div class="text-2xl font-bold text-purple-600">{{ avgWordsPerEntry }}</div>
          <div class="text-sm text-gray-600">Avg Words/Entry</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfileStore, type KnowledgeEntry } from '@/stores/useProfileStore'

const store = useProfileStore()
const searchQuery = ref('')
const isEditing = ref(false)
const editingEntry = ref<Partial<KnowledgeEntry>>({
  title: '',
  content: ''
})

const filteredEntries = computed(() => {
  if (!searchQuery.value) {
    return store.knowledge.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }
  
  const query = searchQuery.value.toLowerCase()
  return store.knowledge.filter(entry =>
    entry.title.toLowerCase().includes(query) ||
    entry.content.toLowerCase().includes(query)
  ).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
})

const totalWords = computed(() => {
  return store.knowledge.reduce((total, entry) => {
    return total + entry.content.split(/\s+/).filter(word => word.length > 0).length
  }, 0)
})

const avgWordsPerEntry = computed(() => {
  if (store.knowledge.length === 0) return 0
  return Math.round(totalWords.value / store.knowledge.length)
})

function startNewEntry() {
  editingEntry.value = {
    title: '',
    content: ''
  }
  isEditing.value = true
}

function editEntry(entry: KnowledgeEntry) {
  editingEntry.value = { ...entry }
  isEditing.value = true
}

function saveEntry() {
  if (!editingEntry.value.title?.trim() || !editingEntry.value.content?.trim()) {
    return
  }
  
  if (editingEntry.value.id) {
    // Update existing entry
    store.updateKnowledgeEntry(
      editingEntry.value.id,
      editingEntry.value.title.trim(),
      editingEntry.value.content.trim()
    )
  } else {
    // Create new entry
    store.addKnowledgeEntry(
      editingEntry.value.title.trim(),
      editingEntry.value.content.trim()
    )
  }
  
  cancelEdit()
}

function cancelEdit() {
  isEditing.value = false
  editingEntry.value = {
    title: '',
    content: ''
  }
}

function deleteEntry(id: string) {
  if (confirm('Are you sure you want to delete this entry?')) {
    store.removeKnowledgeEntry(id)
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

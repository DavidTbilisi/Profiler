<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Import Data from Markdown</h2>
    
    <!-- File Upload -->
    <div class="mb-6">
      <label for="markdown-file" class="block text-sm font-medium text-gray-700 mb-2">
        Upload Markdown File
      </label>
      <input
        id="markdown-file"
        type="file"
        accept=".md,.txt"
        @change="handleFileUpload"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <p class="text-xs text-gray-500 mt-1">
        Select a markdown file to import tasks, moods, journal entries, skills, and more
      </p>
    </div>

    <!-- Text Area -->
    <div class="mb-6">
      <label for="markdown-text" class="block text-sm font-medium text-gray-700 mb-2">
        Or Paste Markdown Content
      </label>
      <textarea
        id="markdown-text"
        v-model="markdownContent"
        rows="8"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Paste your markdown content here..."
      ></textarea>
    </div>

    <!-- Import Button -->
    <div class="flex items-center gap-4 mb-4">
      <button
        @click="importData"
        :disabled="!markdownContent.trim() || isImporting"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span v-if="isImporting" class="animate-spin">⚪</span>
        {{ isImporting ? 'Importing...' : 'Import Data' }}
      </button>
      
      <button
        @click="showExample = !showExample"
        class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        {{ showExample ? 'Hide' : 'Show' }} Example Format
      </button>
    </div>

    <!-- Results -->
    <div v-if="importResult" class="mb-4 p-4 rounded" :class="[
      importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
    ]">
      <div class="flex items-center gap-2 mb-2">
        <span v-if="importResult.success" class="text-green-600">✅</span>
        <span v-else class="text-red-600">❌</span>
        <span :class="[importResult.success ? 'text-green-800' : 'text-red-800']" class="font-medium">
          {{ importResult.message }}
        </span>
      </div>
      
      <div v-if="importResult.success" class="text-sm text-green-700">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div v-if="importResult.imported.tasks">
            📝 {{ importResult.imported.tasks }} tasks
          </div>
          <div v-if="importResult.imported.moods">
            😊 {{ importResult.imported.moods }} moods
          </div>
          <div v-if="importResult.imported.journal">
            📔 {{ importResult.imported.journal }} journal entries
          </div>
          <div v-if="importResult.imported.skills">
            🎯 {{ importResult.imported.skills }} skills
          </div>
          <div v-if="importResult.imported.aspirationalSkills">
            🌟 {{ importResult.imported.aspirationalSkills }} learning goals
          </div>
          <div v-if="importResult.imported.knowledge">
            📚 {{ importResult.imported.knowledge }} knowledge entries
          </div>
          <div v-if="importResult.imported.profile">
            👤 Profile updated
          </div>
        </div>
      </div>
    </div>

    <!-- Example Format -->
    <div v-if="showExample" class="bg-gray-50 rounded-lg p-4 text-sm">
      <h3 class="font-semibold text-gray-800 mb-2">Example Markdown Format:</h3>
      <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ exampleFormat }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { markdownImporter, type ImportResult } from '@/utils/markdownImporter'

const markdownContent = ref('')
const isImporting = ref(false)
const importResult = ref<ImportResult | null>(null)
const showExample = ref(false)

const exampleFormat = `# Life Tracker Export

**Export Date:** 2025-07-20

---

## 👤 User Profile

**Name:** John Doe
**Birth Timestamp:** 631152000000

---

## 🎯 Current Skills

### Programming
- **JavaScript** (8/10)
  - *Description:* Proficient in modern ES6+ features
  - *Goals:* Learn advanced patterns
  - *Added:* 2025-01-15

- **TypeScript** (7/10)
  - *Added:* 2025-01-10

### Frontend
- **Vue.js** (6/10)
  - *Added:* 2025-01-05

---

## 📚 Skills I Want to Learn

### 🔥 High Priority
- **React** (Frontend)
  - *Why:* Industry demand
  - *Target Level:* 8/10
  - *Added:* 2025-01-20

### ⚡ Medium Priority  
- **GraphQL** (Backend)
  - *Added:* 2025-01-18

---

## ✅ Tasks

### July 20, 2025
- [x] Complete project documentation
- [ ] Review code changes
- [ ] Schedule team meeting

### July 19, 2025
- [x] Fix bug in user authentication
- [x] Update README file

---

## 📔 Journal Entries

### July 20, 2025
Had a productive day working on the new features. The team collaboration was excellent and we made significant progress on the authentication system.

---

### July 19, 2025
Feeling a bit overwhelmed with deadlines, but making good progress. The code review process is helping catch issues early.

---

## 😊 Mood Tracking

| Date | Mood | Note |
|------|------|------|
| July 20, 2025 | 8/10 😊 | Great day at work |
| July 19, 2025 | 6/10 😐 | Busy but productive |
| July 18, 2025 | 9/10 😊 | Excellent team meeting |

---

## 🧠 Knowledge Base

### API Design Patterns
REST APIs should follow consistent naming conventions and use appropriate HTTP methods for different operations.

*Created:* July 15, 2025

---

### Team Management Tips
Regular one-on-ones help maintain team morale and catch issues early. Focus on both professional development and personal well-being.

*Created:* July 10, 2025
*Updated:* July 18, 2025

---`

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    try {
      const text = await file.text()
      markdownContent.value = text
    } catch (error) {
      console.error('Error reading file:', error)
      importResult.value = {
        success: false,
        message: 'Error reading file',
        imported: {
          tasks: 0,
          moods: 0,
          journal: 0,
          skills: 0,
          aspirationalSkills: 0,
          knowledge: 0,
          profile: false
        }
      }
    }
  }
}

async function importData() {
  if (!markdownContent.value.trim()) return
  
  isImporting.value = true
  importResult.value = null
  
  try {
    const result = await markdownImporter.importFromMarkdown(markdownContent.value)
    importResult.value = result
    
    if (result.success) {
      // Clear the content after successful import
      markdownContent.value = ''
    }
  } catch (error) {
    importResult.value = {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      imported: {
        tasks: 0,
        moods: 0,
        journal: 0,
        skills: 0,
        aspirationalSkills: 0,
        knowledge: 0,
        profile: false
      }
    }
  } finally {
    isImporting.value = false
  }
}
</script>

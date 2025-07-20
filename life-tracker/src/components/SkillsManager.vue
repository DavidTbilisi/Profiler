<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Skills & Competencies</h2>
      <button
        @click="startNewSkill"
        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        + Add Skill
      </button>
    </div>
    
    <!-- Search and Filter -->
    <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <input
          v-model="searchQuery"
          placeholder="Search skills..."
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <select
          v-model="filterCategory"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option v-for="category in skillCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- Skill Editor -->
    <div v-if="isEditing" class="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
      <h3 class="text-lg font-semibold mb-4">{{ editingSkill.id ? 'Edit Skill' : 'Add New Skill' }}</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label for="skillName" class="block text-sm font-medium text-gray-700 mb-2">
            Skill Name
          </label>
          <input
            id="skillName"
            v-model="editingSkill.name"
            placeholder="e.g., Python Programming, Public Speaking"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="skillCategory" class="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="skillCategory"
            v-model="editingSkill.category"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option v-for="category in skillCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="mb-4">
        <label for="skillDescription" class="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="skillDescription"
          v-model="editingSkill.description"
          placeholder="Describe your experience with this skill..."
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>
      
      <!-- Proficiency Level -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-3">
          Proficiency Level: {{ getProficiencyText(editingSkill.proficiency || 5) }}
        </label>
        <input
          v-model="editingSkill.proficiency"
          type="range"
          min="1"
          max="10"
          class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 - Beginner</span>
          <span>5 - Intermediate</span>
          <span>10 - Expert</span>
        </div>
      </div>
      
      <!-- Learning Goals -->
      <div class="mb-4">
        <label for="learningGoals" class="block text-sm font-medium text-gray-700 mb-2">
          Learning Goals (Optional)
        </label>
        <textarea
          id="learningGoals"
          v-model="editingSkill.learningGoals"
          placeholder="What do you want to achieve with this skill?"
          rows="2"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          @click="saveSkill"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {{ editingSkill.id ? 'Update' : 'Add' }} Skill
        </button>
        <button
          @click="cancelEdit"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
    
    <!-- Skills Display -->
    <div class="space-y-4">
      <!-- Skills by Category -->
      <div v-for="category in displayCategories" :key="category" class="mb-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <span class="text-xl mr-2">{{ getCategoryIcon(category) }}</span>
          {{ category }}
          <span class="ml-2 text-sm text-gray-500">({{ getSkillsInCategory(category).length }})</span>
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="skill in getSkillsInCategory(category)"
            :key="skill.id"
            class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            <!-- Skill Header -->
            <div class="flex justify-between items-start mb-3">
              <h4 class="font-semibold text-gray-800">{{ skill.name }}</h4>
              <div class="flex gap-1">
                <button
                  @click="editSkill(skill)"
                  class="text-blue-500 hover:text-blue-700 focus:outline-none"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  @click="deleteSkill(skill.id)"
                  class="text-red-500 hover:text-red-700 focus:outline-none"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <!-- Proficiency Bar -->
            <div class="mb-3">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>{{ getProficiencyText(skill.proficiency) }}</span>
                <span>{{ skill.proficiency }}/10</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all duration-300"
                  :class="getProficiencyColor(skill.proficiency)"
                  :style="{ width: `${(skill.proficiency / 10) * 100}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Description -->
            <div v-if="skill.description" class="mb-3">
              <p class="text-sm text-gray-600">{{ skill.description }}</p>
            </div>
            
            <!-- Learning Goals -->
            <div v-if="skill.learningGoals" class="mb-3">
              <p class="text-xs text-gray-500">
                <strong>Goals:</strong> {{ skill.learningGoals }}
              </p>
            </div>
            
            <!-- Timestamps -->
            <div class="text-xs text-gray-400">
              <p>Added: {{ formatDate(skill.createdAt) }}</p>
              <p v-if="skill.updatedAt !== skill.createdAt">
                Updated: {{ formatDate(skill.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-if="filteredSkills.length === 0 && !isEditing" class="text-center py-12">
      <div class="text-4xl mb-4">🎯</div>
      <h3 class="text-lg font-semibold text-gray-600 mb-2">
        {{ searchQuery || filterCategory ? 'No skills found' : 'No skills added yet' }}
      </h3>
      <p class="text-gray-500 mb-4">
        {{ searchQuery || filterCategory 
          ? 'Try adjusting your search or filter' 
          : 'Start building your skill portfolio by adding your first skill'
        }}
      </p>
      <button
        v-if="!searchQuery && !filterCategory"
        @click="startNewSkill"
        class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Your First Skill
      </button>
    </div>
    
    <!-- Skills Summary -->
    <div v-if="store.skills.length > 0" class="mt-8 pt-6 border-t border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Skills Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
        <div class="p-3 bg-blue-50 rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ store.skills.length }}</div>
          <div class="text-sm text-blue-800">Total Skills</div>
        </div>
        <div class="p-3 bg-green-50 rounded-lg">
          <div class="text-2xl font-bold text-green-600">{{ expertSkills }}</div>
          <div class="text-sm text-green-800">Expert Level</div>
        </div>
        <div class="p-3 bg-yellow-50 rounded-lg">
          <div class="text-2xl font-bold text-yellow-600">{{ averageProficiency.toFixed(1) }}</div>
          <div class="text-sm text-yellow-800">Avg. Proficiency</div>
        </div>
        <div class="p-3 bg-purple-50 rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ skillCategories.length }}</div>
          <div class="text-sm text-purple-800">Categories</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfileStore, type Skill } from '@/stores/useProfileStore'

const store = useProfileStore()
const searchQuery = ref('')
const filterCategory = ref('')
const isEditing = ref(false)
const editingSkill = ref<Partial<Skill>>({
  name: '',
  category: '',
  description: '',
  proficiency: 5,
  learningGoals: ''
})

const skillCategories = [
  'Programming & Development',
  'Design & Creative',
  'Data & Analytics',
  'Marketing & Sales',
  'Communication',
  'Leadership & Management',
  'Languages',
  'Technical Skills',
  'Soft Skills',
  'Finance & Business',
  'Other'
]

const filteredSkills = computed(() => {
  let skills = store.skills
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    skills = skills.filter(skill =>
      skill.name.toLowerCase().includes(query) ||
      skill.category.toLowerCase().includes(query) ||
      skill.description?.toLowerCase().includes(query)
    )
  }
  
  if (filterCategory.value) {
    skills = skills.filter(skill => skill.category === filterCategory.value)
  }
  
  return skills.sort((a, b) => b.proficiency - a.proficiency)
})

const displayCategories = computed(() => {
  const categories = new Set(filteredSkills.value.map(skill => skill.category))
  return Array.from(categories).sort()
})

const expertSkills = computed(() => {
  return store.skills.filter(skill => skill.proficiency >= 8).length
})

const averageProficiency = computed(() => {
  if (store.skills.length === 0) return 0
  const sum = store.skills.reduce((total, skill) => total + skill.proficiency, 0)
  return sum / store.skills.length
})

function getSkillsInCategory(category: string) {
  return filteredSkills.value.filter(skill => skill.category === category)
}

function startNewSkill() {
  editingSkill.value = {
    name: '',
    category: '',
    description: '',
    proficiency: 5,
    learningGoals: ''
  }
  isEditing.value = true
}

function editSkill(skill: Skill) {
  editingSkill.value = { ...skill }
  isEditing.value = true
}

function saveSkill() {
  if (!editingSkill.value.name?.trim() || !editingSkill.value.category) {
    alert('Please provide a skill name and category')
    return
  }
  
  if (editingSkill.value.id) {
    // Update existing skill
    store.updateSkill(
      editingSkill.value.id,
      editingSkill.value.name.trim(),
      editingSkill.value.category,
      editingSkill.value.proficiency || 5,
      editingSkill.value.description?.trim(),
      editingSkill.value.learningGoals?.trim()
    )
  } else {
    // Create new skill
    store.addSkill(
      editingSkill.value.name.trim(),
      editingSkill.value.category,
      editingSkill.value.proficiency || 5,
      editingSkill.value.description?.trim(),
      editingSkill.value.learningGoals?.trim()
    )
  }
  
  cancelEdit()
}

function cancelEdit() {
  isEditing.value = false
  editingSkill.value = {
    name: '',
    category: '',
    description: '',
    proficiency: 5,
    learningGoals: ''
  }
}

function deleteSkill(id: string) {
  if (confirm('Are you sure you want to delete this skill?')) {
    store.removeSkill(id)
  }
}

function getProficiencyText(level: number): string {
  if (level <= 2) return 'Beginner'
  if (level <= 4) return 'Novice'
  if (level <= 6) return 'Intermediate'
  if (level <= 8) return 'Advanced'
  return 'Expert'
}

function getProficiencyColor(level: number): string {
  if (level <= 3) return 'bg-red-500'
  if (level <= 5) return 'bg-yellow-500'
  if (level <= 7) return 'bg-blue-500'
  return 'bg-green-500'
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Programming & Development': '💻',
    'Design & Creative': '🎨',
    'Data & Analytics': '📊',
    'Marketing & Sales': '📈',
    'Communication': '💬',
    'Leadership & Management': '👥',
    'Languages': '🌍',
    'Technical Skills': '🔧',
    'Soft Skills': '🤝',
    'Finance & Business': '💼',
    'Other': '🎯'
  }
  return icons[category] || '🎯'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

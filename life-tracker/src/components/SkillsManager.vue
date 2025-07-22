<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Skills Portfolio</h2>
      <div class="flex gap-2">
        <button
          @click="activeTab = 'current'"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            activeTab === 'current' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Current Skills
        </button>
        <button
          @click="activeTab = 'aspirational'"
          :class="[
            'px-4 py-2 rounded-md font-medium transition-colors',
            activeTab === 'aspirational' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          Want to Learn
        </button>
      </div>
    </div>

    <!-- Overall Skills Summary -->
    <div v-if="store.skills.length > 0 || store.aspirationalSkills.length > 0" class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-800 mb-3">📊 Skills Points Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
        <div class="p-3 bg-white rounded-lg shadow-sm border">
          <div 
            class="text-3xl font-bold text-indigo-600 cursor-help" 
            :title="`Formula: ${currentSkillPoints} current points + ${aspirationalSkillPoints} aspirational points = ${totalSkillPoints} total points`"
          >
            {{ totalSkillPoints }}
          </div>
          <div class="text-sm text-indigo-800 font-medium">Total Points</div>
          <div class="text-xs text-gray-500 mt-1">Current + Goals</div>
        </div>
        <div class="p-3 bg-white rounded-lg shadow-sm border">
          <div 
            class="text-2xl font-bold text-blue-600 cursor-help" 
            :title="`Sum of proficiency levels: ${store.skills.map(s => s.name + ' (' + s.proficiency + '/10)').join(', ') || 'No current skills'}`"
          >
            {{ currentSkillPoints }}
          </div>
          <div class="text-sm text-blue-800">Current Points</div>
          <div class="text-xs text-gray-500 mt-1">{{ store.skills.length }} skills</div>
        </div>
        <div class="p-3 bg-white rounded-lg shadow-sm border">
          <div 
            class="text-2xl font-bold text-purple-600 cursor-help" 
            :title="`Sum of target proficiency levels: ${store.aspirationalSkills.map(s => s.name + ' (target ' + (s.targetProficiency || 7) + '/10)').join(', ') || 'No aspirational skills'}`"
          >
            {{ aspirationalSkillPoints }}
          </div>
          <div class="text-sm text-purple-800">Goal Points</div>
          <div class="text-xs text-gray-500 mt-1">{{ store.aspirationalSkills.length }} goals</div>
        </div>
        <div v-if="store.skills.length > 0" class="p-3 bg-white rounded-lg shadow-sm border">
          <div class="text-2xl font-bold text-green-600">{{ averageProficiency.toFixed(1) }}</div>
          <div class="text-sm text-green-800">Avg. Level</div>
          <div class="text-xs text-gray-500 mt-1">Per skill</div>
        </div>
        <div v-else class="p-3 bg-white rounded-lg shadow-sm border">
          <div class="text-2xl font-bold text-gray-400">--</div>
          <div class="text-sm text-gray-500">Avg. Level</div>
          <div class="text-xs text-gray-500 mt-1">No skills yet</div>
        </div>
        <div class="p-3 bg-white rounded-lg shadow-sm border">
          <div 
            class="text-2xl font-bold text-orange-600 cursor-help" 
            :title="`Formula: (${store.skills.length} current + ${store.aspirationalSkills.length} aspirational) × 10 = ${maxPossiblePoints} points`"
          >
            {{ maxPossiblePoints }}
          </div>
          <div class="text-sm text-orange-800">Max Possible</div>
          <div class="text-xs text-gray-500 mt-1">{{ Math.round((totalSkillPoints / maxPossiblePoints) * 100) }}% achieved</div>
        </div>
      </div>
    </div>

    <!-- Current Skills Tab -->
    <div v-if="activeTab === 'current'">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-700">Current Skills & Competencies</h3>
        <button
          @click="startNewSkill"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Add Skill
        </button>
      </div>

      <!-- Info Box -->
      <div class="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Use the 🎯 button to convert current skills to learning goals, or ✏️ to edit, or 🗑️ to delete.
        </p>
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
                  @click="convertToAspirational(skill)"
                  class="text-purple-500 hover:text-purple-700 focus:outline-none"
                  title="Convert to Learning Goal"
                >
                  🎯
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

    <!-- Aspirational Skills Tab -->
    <div v-if="activeTab === 'aspirational'">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-700">Skills You Want to Learn</h3>
        <button
          @click="startNewAspirationalSkill"
          class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          + Add Learning Goal
        </button>
      </div>

      <!-- Info Box -->
      <div class="mb-6 p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p class="text-sm text-purple-800">
          💡 <strong>Tip:</strong> Use the ✅ button to convert learning goals to current skills when you've achieved them, or ✏️ to edit, or 🗑️ to delete.
        </p>
      </div>

      <!-- Aspirational Skill Editor -->
      <div v-if="isEditingAspirational" class="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
        <h3 class="text-lg font-semibold mb-4">{{ editingAspirationalSkill.id ? 'Edit Learning Goal' : 'Add New Learning Goal' }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="aspirationalSkillName" class="block text-sm font-medium text-gray-700 mb-2">
              Skill Name
            </label>
            <input
              id="aspirationalSkillName"
              v-model="editingAspirationalSkill.name"
              placeholder="e.g., Machine Learning, Spanish"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label for="aspirationalSkillCategory" class="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="aspirationalSkillCategory"
              v-model="editingAspirationalSkill.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Category</option>
              <option v-for="category in skillCategories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              id="priority"
              v-model="editingAspirationalSkill.priority"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Low">Low - Someday maybe</option>
              <option value="Medium">Medium - This year</option>
              <option value="High">High - Next few months</option>
            </select>
          </div>

          <div>
            <label for="targetProficiency" class="block text-sm font-medium text-gray-700 mb-2">
              Target Level (Optional)
            </label>
            <select
              id="targetProficiency"
              v-model="editingAspirationalSkill.targetProficiency"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Not specified</option>
              <option value="3">Basic (3/10)</option>
              <option value="5">Intermediate (5/10)</option>
              <option value="7">Advanced (7/10)</option>
              <option value="9">Expert (9/10)</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label for="targetDate" class="block text-sm font-medium text-gray-700 mb-2">
            Target Date (Optional)
          </label>
          <input
            id="targetDate"
            v-model="editingAspirationalSkill.targetDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div class="mb-4">
          <label for="reason" class="block text-sm font-medium text-gray-700 mb-2">
            Why do you want to learn this?
          </label>
          <textarea
            id="reason"
            v-model="editingAspirationalSkill.reason"
            placeholder="What motivates you to learn this skill?"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          ></textarea>
        </div>

        <div class="mb-4">
          <label for="resources" class="block text-sm font-medium text-gray-700 mb-2">
            Learning Resources (Optional)
          </label>
          <textarea
            id="resources"
            v-model="editingAspirationalSkill.resources"
            placeholder="Books, courses, websites, mentors..."
            rows="2"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          ></textarea>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            @click="saveAspirationalSkill"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {{ editingAspirationalSkill.id ? 'Update' : 'Add' }} Goal
          </button>
          <button
            @click="cancelAspirationalEdit"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Aspirational Skills Display -->
      <div class="space-y-4">
        <!-- Skills by Priority -->
        <div v-for="priority in ['High', 'Medium', 'Low']" :key="priority" class="mb-8">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <span class="text-xl mr-2">{{ getPriorityIcon(priority) }}</span>
            {{ priority }} Priority
            <span class="ml-2 text-sm text-gray-500">({{ getAspirationalSkillsByPriority(priority).length }})</span>
          </h3>
          
          <div v-if="getAspirationalSkillsByPriority(priority).length === 0" class="text-gray-500 italic">
            No {{ priority.toLowerCase() }} priority learning goals yet
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="skill in getAspirationalSkillsByPriority(priority)"
              :key="skill.id"
              class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
            >
              <!-- Skill Header -->
              <div class="flex justify-between items-start mb-3">
                <h4 class="font-semibold text-gray-800">{{ skill.name }}</h4>
                <div class="flex gap-1">
                  <button
                    @click="editAspirationalSkill(skill)"
                    class="text-purple-500 hover:text-purple-700 focus:outline-none"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    @click="convertToCurrent(skill)"
                    class="text-green-500 hover:text-green-700 focus:outline-none"
                    title="Convert to Current Skill"
                  >
                    ✅
                  </button>
                  <button
                    @click="deleteAspirationalSkill(skill.id)"
                    class="text-red-500 hover:text-red-700 focus:outline-none"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <!-- Category -->
              <div class="mb-2">
                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {{ skill.category }}
                </span>
              </div>
              
              <!-- Target Info -->
              <div v-if="skill.targetProficiency || skill.targetDate" class="mb-3 text-sm text-gray-600">
                <div v-if="skill.targetProficiency">
                  🎯 Target: {{ skill.targetProficiency }}/10
                </div>
                <div v-if="skill.targetDate">
                  📅 By: {{ formatDate(skill.targetDate) }}
                </div>
              </div>
              
              <!-- Reason -->
              <div v-if="skill.reason" class="mb-3">
                <p class="text-sm text-gray-600">{{ skill.reason }}</p>
              </div>
              
              <!-- Resources -->
              <div v-if="skill.resources" class="mb-3">
                <p class="text-xs text-gray-500">
                  <strong>Resources:</strong> {{ skill.resources }}
                </p>
              </div>
              
              <!-- Actions -->
              <div class="flex gap-2 mt-4">
                <button
                  @click="convertToSkill(skill.id)"
                  class="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 focus:outline-none"
                >
                  🚀 Start Learning
                </button>
              </div>
              
              <!-- Timestamps -->
              <div class="text-xs text-gray-400 mt-3">
                <p>Added: {{ formatDate(skill.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="store.aspirationalSkills.length === 0 && !isEditingAspirational" class="text-center py-12">
        <div class="text-4xl mb-4">🎯</div>
        <h3 class="text-lg font-semibold text-gray-600 mb-2">No learning goals yet</h3>
        <p class="text-gray-500 mb-4">
          Add skills you want to learn to create your learning roadmap
        </p>
        <button
          @click="startNewAspirationalSkill"
          class="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Add Your First Learning Goal
        </button>
      </div>

      <!-- Aspirational Skills Summary -->
      <div v-if="store.aspirationalSkills.length > 0" class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Learning Goals Summary</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div class="p-3 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ store.aspirationalSkills.length }}</div>
            <div class="text-sm text-purple-800">Learning Goals</div>
          </div>
          <div class="p-3 bg-red-50 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ highPriorityCount }}</div>
            <div class="text-sm text-red-800">High Priority</div>
          </div>
          <div class="p-3 bg-yellow-50 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ upcomingDeadlines }}</div>
            <div class="text-sm text-yellow-800">Due Soon</div>
          </div>
          <div class="p-3 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ withResourcesCount }}</div>
            <div class="text-sm text-green-800">Have Resources</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProfileStore, type Skill, type AspirationalSkill } from '@/stores/useProfileStore'

const store = useProfileStore()
const activeTab = ref<'current' | 'aspirational'>('current')
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

const isEditingAspirational = ref(false)
const editingAspirationalSkill = ref<Partial<AspirationalSkill>>({
  name: '',
  category: '',
  priority: 'Medium',
  reason: '',
  targetProficiency: 8,
  targetDate: '',
  resources: ''
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
  return store.skills.filter(skill => Number(skill.proficiency) >= 8).length
})

const averageProficiency = computed(() => {
  if (store.skills.length === 0) return 0
  const sum = store.skills.reduce((total, skill) => total + Number(skill.proficiency), 0)
  return sum / store.skills.length
})

const highPriorityCount = computed(() => {
  return store.aspirationalSkills.filter(skill => skill.priority === 'High').length
})

const upcomingDeadlines = computed(() => {
  const now = new Date()
  const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  return store.aspirationalSkills.filter(skill => 
    skill.targetDate && new Date(skill.targetDate) <= nextMonth && new Date(skill.targetDate) >= now
  ).length
})

const withResourcesCount = computed(() => {
  return store.aspirationalSkills.filter(skill => skill.resources && skill.resources.trim().length > 0).length
})

// Skill points calculations
const currentSkillPoints = computed(() => {
  return store.skills.reduce((total, skill) => total + Number(skill.proficiency), 0)
})

const aspirationalSkillPoints = computed(() => {
  return store.aspirationalSkills.reduce((total, skill) => {
    return total + (Number(skill.targetProficiency) || 7)
  }, 0)
})

const totalSkillPoints = computed(() => {
  return currentSkillPoints.value + aspirationalSkillPoints.value
})

const maxPossiblePoints = computed(() => {
  return (store.skills.length + store.aspirationalSkills.length) * 10
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
      Number(editingSkill.value.proficiency) || 5,
      editingSkill.value.description?.trim(),
      editingSkill.value.learningGoals?.trim()
    )
  } else {
    // Create new skill
    store.addSkill(
      editingSkill.value.name.trim(),
      editingSkill.value.category,
      Number(editingSkill.value.proficiency) || 5,
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

// Aspirational Skills functions
function startNewAspirationalSkill() {
  editingAspirationalSkill.value = {
    name: '',
    category: '',
    priority: 'Medium',
    reason: '',
    targetProficiency: 8,
    targetDate: '',
    resources: ''
  }
  isEditingAspirational.value = true
}

function editAspirationalSkill(skill: AspirationalSkill) {
  editingAspirationalSkill.value = { ...skill }
  isEditingAspirational.value = true
}

function saveAspirationalSkill() {
  if (!editingAspirationalSkill.value.name?.trim() || !editingAspirationalSkill.value.category) {
    alert('Please provide a skill name and category')
    return
  }
  
  if (editingAspirationalSkill.value.id) {
    // Update existing aspirational skill
    store.updateAspirationalSkill(
      editingAspirationalSkill.value.id,
      editingAspirationalSkill.value.name.trim(),
      editingAspirationalSkill.value.category,
      editingAspirationalSkill.value.priority || 'Medium',
      editingAspirationalSkill.value.reason?.trim(),
      editingAspirationalSkill.value.targetProficiency,
      editingAspirationalSkill.value.targetDate,
      editingAspirationalSkill.value.resources?.trim()
    )
  } else {
    // Create new aspirational skill
    store.addAspirationalSkill(
      editingAspirationalSkill.value.name.trim(),
      editingAspirationalSkill.value.category,
      editingAspirationalSkill.value.priority || 'Medium',
      editingAspirationalSkill.value.reason?.trim(),
      editingAspirationalSkill.value.targetProficiency,
      editingAspirationalSkill.value.targetDate,
      editingAspirationalSkill.value.resources?.trim()
    )
  }
  
  cancelAspirationalEdit()
}

function cancelAspirationalEdit() {
  isEditingAspirational.value = false
  editingAspirationalSkill.value = {
    name: '',
    category: '',
    priority: 'Medium',
    reason: '',
    targetProficiency: 8,
    targetDate: '',
    resources: ''
  }
}

function deleteAspirationalSkill(id: string) {
  if (confirm('Are you sure you want to delete this learning goal?')) {
    store.removeAspirationalSkill(id)
  }
}

function convertToSkill(aspirationalSkillId: string) {
  if (confirm('Start learning this skill? This will move it to your current skills.')) {
    store.convertAspirationalToSkill(aspirationalSkillId, 1)
  }
}

function getAspirationalSkillsByPriority(priority: string) {
  return store.aspirationalSkills.filter(skill => skill.priority === priority)
}

function getPriorityIcon(priority: string): string {
  const icons: Record<string, string> = {
    'High': '🔥',
    'Medium': '⭐',
    'Low': '💡'
  }
  return icons[priority] || '⭐'
}

function deleteSkill(id: string) {
  if (confirm('Are you sure you want to delete this skill?')) {
    store.removeSkill(id)
  }
}

function convertToAspirational(skill: any) {
  if (confirm(`Convert "${skill.name}" to a learning goal? This will remove it from your current skills and add it to your aspirational skills.`)) {
    // Create aspirational skill based on current skill
    const aspirationalSkill = {
      name: skill.name,
      category: skill.category,
      priority: 'Medium' as const,
      reason: `Continue developing from current level ${skill.proficiency}/10`,
      targetProficiency: Math.min(skill.proficiency + 2, 10), // Target 2 levels higher, max 10
      targetDate: '',
      resources: skill.learningGoals || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Add to aspirational skills
    store.addAspirationalSkill(
      aspirationalSkill.name,
      aspirationalSkill.category,
      aspirationalSkill.priority,
      aspirationalSkill.reason,
      aspirationalSkill.targetProficiency,
      aspirationalSkill.targetDate,
      aspirationalSkill.resources
    )
    
    // Remove from current skills
    store.removeSkill(skill.id)
  }
}

function convertToCurrent(skill: any) {
  if (confirm(`Convert "${skill.name}" to a current skill? You'll need to set your proficiency level.`)) {
    // Default proficiency based on target or a reasonable starting point
    const defaultProficiency = Math.max(1, Math.min(skill.targetProficiency - 2, 5)) || 3
    
    // Create current skill based on aspirational skill
    store.addSkill(
      skill.name,
      skill.category,
      defaultProficiency,
      skill.reason || `Converted from learning goal`,
      skill.resources || ''
    )
    
    // Remove from aspirational skills
    store.removeAspirationalSkill(skill.id)
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

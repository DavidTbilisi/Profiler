<template>
  <div class="skills-radar-chart">
    <div v-if="hasSkills" class="w-full h-full">
      <Radar
        :data="chartData"
        :options="chartOptions"
        class="max-w-full max-h-full"
      />
    </div>
    <div v-else class="flex flex-col items-center justify-center h-64 text-gray-500">
      <div class="text-4xl mb-4">🎯</div>
      <p class="text-center">No skills data available</p>
      <router-link
        to="/skills"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Add Skills
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Radar } from 'vue-chartjs'
import { useProfileStore } from '@/stores/useProfileStore'
import { SKILL_CATEGORIES } from '@/constants/skillCategories'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const store = useProfileStore()

const hasSkills = computed(() => store.skills.length > 0)

function getProficiencyText(level: number): string {
  if (level === 0) return 'No Skills'
  if (level <= 2) return 'Beginner'
  if (level <= 4) return 'Novice'
  if (level <= 6) return 'Intermediate'
  if (level <= 8) return 'Advanced'
  return 'Expert'
}

const chartData = computed(() => {
  if (!hasSkills.value) return { labels: [], datasets: [] }

  // Calculate average proficiency for each category
  const categoryAverages = SKILL_CATEGORIES.map(category => {
    const categorySkills = store.skills.filter(skill => skill.category === category)
    if (categorySkills.length === 0) return 0
    
    const sum = categorySkills.reduce((total, skill) => total + Number(skill.proficiency), 0)
    return sum / categorySkills.length
  })

  // Filter out categories with no skills and their corresponding averages
  const activeCategories: string[] = []
  const activeAverages: number[] = []
  
  SKILL_CATEGORIES.forEach((category, index) => {
    if (categoryAverages[index] > 0) {
      activeCategories.push(category)
      activeAverages.push(categoryAverages[index])
    }
  })

  // If we have fewer than 3 categories, add some padding for better visualization
  while (activeCategories.length < 3 && activeCategories.length < SKILL_CATEGORIES.length) {
    const nextCategory = SKILL_CATEGORIES.find(cat => !activeCategories.includes(cat))
    if (nextCategory) {
      activeCategories.push(nextCategory)
      activeAverages.push(0)
    } else {
      break
    }
  }

  return {
    labels: activeCategories.map(category => {
      // Shorten long category names for better display
      return category.replace(' & ', ' &\n').replace('Leadership & Management', 'Leadership &\nManagement')
    }),
    datasets: [
      {
        label: 'Skill Proficiency',
        data: activeAverages,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      callbacks: {
        label: function(context: any) {
          const value = context.parsed.r
          const levelText = getProficiencyText(value)
          return `${levelText} (${value.toFixed(1)}/10)`
        }
      }
    }
  },
  scales: {
    r: {
      beginAtZero: true,
      min: 0,
      max: 10,
      ticks: {
        stepSize: 2,
        color: 'rgba(107, 114, 128, 0.6)',
        font: {
          size: 11
        },
        callback: function(value: any) {
          return value
        }
      },
      grid: {
        color: 'rgba(107, 114, 128, 0.2)'
      },
      angleLines: {
        color: 'rgba(107, 114, 128, 0.2)'
      },
      pointLabels: {
        color: 'rgba(55, 65, 81, 1)',
        font: {
          size: 11,
          weight: 'bold' as const
        },
        padding: 15
      }
    }
  },
  elements: {
    line: {
      tension: 0.3
    }
  }
} as any))
</script>

<style scoped>
.skills-radar-chart {
  position: relative;
  width: 100%;
  height: 300px;
}
</style>

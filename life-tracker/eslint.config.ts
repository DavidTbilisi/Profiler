import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  
  {
    rules: {
      // Allow any types for now (can be tightened later)
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Allow unused variables (common during development)
      '@typescript-eslint/no-unused-vars': 'warn',
      
      // Allow single-word component names for views
      'vue/multi-word-component-names': 'off',
      
      // Allow side effects in computed properties (for reactive data)
      'vue/no-side-effects-in-computed-properties': 'warn',
    }
  }
)

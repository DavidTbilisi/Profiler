/**
 * Skill Categories
 * 
 * Centralized list of skill categories used throughout the application.
 * This ensures consistency across components and makes it easy to maintain.
 */

export const SKILL_CATEGORIES = [
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
] as const

export type SkillCategory = typeof SKILL_CATEGORIES[number]

/**
 * Category Icons
 * 
 * Icons associated with each skill category for visual representation.
 */
export const CATEGORY_ICONS: Record<SkillCategory, string> = {
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

/**
 * Get the icon for a given skill category
 */
export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category as SkillCategory] || '🎯'
}

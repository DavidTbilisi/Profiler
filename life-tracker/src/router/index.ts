import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Tasks from '../views/Tasks.vue'
import Journal from '../views/Journal.vue'
import Mood from '../views/Mood.vue'
import Stats from '../views/Stats.vue'
import Knowledge from '../views/Knowledge.vue'
import Profile from '../views/Profile.vue'
import Skills from '../views/SkillsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
    },
    {
      path: '/journal',
      name: 'journal',
      component: Journal,
    },
    {
      path: '/mood',
      name: 'mood',
      component: Mood,
    },
    {
      path: '/stats',
      name: 'stats',
      component: Stats,
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: Knowledge,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
    },
    {
      path: '/skills',
      name: 'skills',
      component: Skills,
    },
  ],
})

export default router

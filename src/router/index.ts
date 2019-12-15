import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'levels',
    component: () => import(/* webpackChunkName: "levels" */ '../views/Levels.vue')
  },
  {
    path: '/labyrinth',
    name: 'labyrinth',
    component: () => import(/* webpackChunkName: "labyrinth" */ '../views/Labyrinth.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

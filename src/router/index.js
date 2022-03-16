import Vue from 'vue'
import VueRouter from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Question from '@/views/question/Question.vue'
import Introduce from '@/views/introduce/Introduce.vue'
import NotFound from '@/components/NotFound.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }, {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        component: Introduce,
      },
      {
        path: '/questions',
        component: Question,
      }
    ]
  },
  
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router

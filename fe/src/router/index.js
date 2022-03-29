import Vue from 'vue'
import VueRouter from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Question from '@/views/question/Question.vue'
import Introduce from '@/views/introduce/Introduce.vue'
import NotFound from '@/components/NotFound.vue'
import Login from '@/views/Login.vue'
import SignUp from '@/views/SignUp.vue'

// midlewares

Vue.use(VueRouter)
import checkAuth from '@/middleware/auth.js';

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
        beforeEnter: checkAuth,
        component: Introduce,
      },
      {
        path: '/questions',
        component: Question,
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router

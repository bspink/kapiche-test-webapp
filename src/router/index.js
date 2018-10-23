import Vue from 'vue'
import Router from 'vue-router'
import LoginForm from '@/components/LoginForm'
import NPSChart from '@/components/NPSChart'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginForm
    },
    {
      path: '/',
      name: 'nps',
      component: NPSChart
    }
  ]
})

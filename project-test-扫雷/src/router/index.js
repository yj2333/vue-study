import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'//@就是指src目录

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {//配置一个路由
      path: '/', 
      name: 'index',
      component: Index
    },
  ]
})

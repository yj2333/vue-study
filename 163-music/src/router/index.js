import Vue from 'vue'
import Router from 'vue-router'
import recommendationIndex from '@/views/recommendation/'
import songIndex from '@/views/song/'
import searchIndex from '@/views/search/'
import hotIndex from '@/views/hot/'
import playlistIndex from '@/views/playlist/'
import artistIndex from '@/views/artist/'
import ablumIndex from '@/views/album/'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'recommendation Index',
      component: recommendationIndex
    },
    {
      path: '/song/:id',
      name: 'play song',
      component: songIndex
    },
    {
      path: '/search',
      name: 'search Index',
      component: searchIndex
    },
    {
      path: '/hot',
      name: 'hot Index',
      component: hotIndex
    },
    {
      path: '/playlist/:id',
      name: 'playlist Index',
      component: playlistIndex
    },
    {
      path: '/artist/:id',
      name: 'artist Index',
      component: artistIndex
    },
    {
      path: '/album/:id',
      name: 'album Index',
      component: ablumIndex
    },
  ]
})

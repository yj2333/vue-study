// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import store from './store'

import 'lib-flexible'//移动自适应插件,将移动端设置分为10等分，10rem即为100%的可视宽度

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import '@/assets/font-awesome/css/font-awesome.min.css';
import '@/assets/css/reset.scss';//初始化

Vue.use(MintUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

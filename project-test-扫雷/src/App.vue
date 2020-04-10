<template>
  <div class="app" @contextmenu.prevent>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){//储存数据
    return {

    };
  },
  methods: {//储存方法

  },
  components: {//注册组建

  },
}
</script>

<style lang="scss">
@import './assets/font-awesome/css/font-awesome.min.css';
*{ margin: 0; padding: 0;}
html,body,.app,.el-container{ height: 100%;}
</style>

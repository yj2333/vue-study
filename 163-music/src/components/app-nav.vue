<template>
  <div>
    <div class="nav-placeholder"></div>
    <div class="nav">
      <router-link :class="{ active: activeIndex == index }" v-for="(item, index) in navData" :key="item.name" :to="item.to">{{ item.name }}</router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //父传子参数使用
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  created() {
    //console.log(this.$route.path, 998)
  },
  data() {
    return {
      navData: [
        { name: '推荐音乐', to: '/' },
        { name: '热歌榜', to: '/hot' },
        { name: '搜索', to: '/search' }
      ]
    }
  }
  /*watch: {
    ['$route']: {
      handler(newval, oldval) {
        console.log(newval)
      },
      immediate: true
    }
  }*/
}
</script>

<style lang="scss" scoped>
.nav-placeholder {
  height: 81px;
}
.nav {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  border-top: 1px solid #d43c33; /*no*/
  border-bottom: 1px solid #cccccc; /*no*/
  box-sizing: border-box;
  height: 81px;
  font-size: 28px; /*px*/
  a {
    display: flex;
    align-items: center;
    padding: 0 10px;
    border-bottom: 4px solid transparent;
    transform: translate(0, 1px); /*no*/
    margin: 0 60px;
    &.active {
      color: #dd001b;
      border-bottom-color: #dd001b;
    }
  }
}
</style>

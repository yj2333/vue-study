<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
    <app-player></app-player>
  </div>
</template>

<script>
import appPlayer from '@/components/app-player';

export default {
  name: 'App',
  components: {
    appPlayer,
  }
}
</script>

<style lang="scss">
.newSong-list {
  li {
    padding-left: 20px;
    & > a {
      display: flex;
      justify-content: space-between;
      border-bottom: #e2e2e3 1px solid; /*no*/
    }
    .text {
      padding: 13px 0;
      width: 450px;
      overflow: hidden;
    }
    .name {
      font-size: 26px; /*px*/
      line-height: 48px; /*px*/
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .singer {
      float: left;
      font-size: 24px; /*px*/
      line-height: 36px; /*px*/
      color: #888888;
    }
    .singer_album{
      font-size: 24px; /*px*/
      line-height: 36px; /*px*/
      color: #888888;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .fa-play-circle-o {
      display: flex;
      align-items: center;
      font-size: 44px; /*px*/
      color: #aaaaaa;
      margin-right: 20px;
    }
  }
}
</style>

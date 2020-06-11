<template>
  <div>
    <app-nav></app-nav>
    <app-title>推荐歌单</app-title>
    <ul class="imgText-list">
      <li v-for="item in imgTextData" :key="item.id">
        <router-link :to="'/playlist/'+item.id">
          <div class="img">
            <img :src="item.picUrl" alt="">
            <span><i class="fa fa-headphones"></i>{{ (item.playCount/10000).toFixed(1) + '万' }}</span>
          </div>
          <div class="text">
            {{ item.name }}
          </div>
        </router-link>
      </li>
    </ul>
    <app-title>最新音乐</app-title>
    <ul class="newSong-list">
      <li v-for="item in newSongData" :key="item.id">
        <router-link :to="'/song/'+item.id">
          <div class="text">
            <div class="name">{{ item.name }} <span v-if="item.song.alias != ''" class="alias">({{ item.song.alias[0] }})</span> </div>
            <div class="singer"><div style="float:left;">{{songArtists(item)}} </div>- {{ item.song.album.name }}</div>
          </div>
          <i class="fa fa-play-circle-o"></i>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import appNav from '@/components/app-nav'
import appTitle from '@/components/app-title'
import { getPersonalized, getPersonalizedNewsong } from '@/api/recommendation'

export default {
  created(){
    this.getPersonalized();
    this.getPersonalizedNewsong();
  },
  data(){
    return {
      imgTextData: [],//推荐歌单的数据
      newSongData: [],//新音乐数据
    };
  },
  methods: {
    getPersonalized(){
      getPersonalized({
        params: {
          limit: 6
        }
      }).then(res =>{
        var data = res.data;
        if(data.code == 200){//成功
          this.imgTextData = data.result;
        }
      });
    },
    getPersonalizedNewsong(){
      getPersonalizedNewsong({}).then(res =>{
        var data = res.data;
        if(data.code == 200){//成功
          this.newSongData = data.result;
        }
      })
    },
    songArtists(item){
      if(item.song.artists.length > 1 && item.song.artists.length < 5){
        var h = JSON.parse(JSON.stringify(item.song.artists));
        //console.log(h)
        var songArtists = '';
        for(var i = 0;i <= h.length-1;i++){
          //console.log(i)
          //console.log(h[i])
          songArtists = i != h.length-1 ? songArtists + h[i].name + '/' : songArtists + h[i].name;
          //console.log(songArtists)
        }
        return songArtists;
      }
      if(item.song.artists.length > 5){
        var h = JSON.parse(JSON.stringify(item.song.artists));
        //console.log(h)
        var songArtists = '';
        for(var i = 0;i <= 4;i++){
          //console.log(i)
          //console.log(h[i])
          songArtists = i != 4 ? songArtists + h[i].name + '/' : songArtists + h[i].name;
          //console.log(songArtists)
        }
        return songArtists;
      }
      else{
        return item.song.artists[0].name;
      }
    }
  },
  components: {
    appNav,
    appTitle,
  }
}
</script>

<style lang="scss" scoped>
.imgText-list{
  display: flex;
  flex-flow: wrap;
  li{
    width: 33.33%;
    a{
      display: block;
    }
  }
  .img{
    position: relative;
    width: 245px;
    height: 245px;
    overflow: hidden;
    img{ width: 100%;}
    span{
      position: absolute;
      right: 12px;
      top: 10px;
      color: #fff;
      font-size: 22px;/*px*/
    }
    .fa-headphones{
      margin-right: 6px;
    }
  }
  .text{
    margin: 12px 12px 32px;
    font-size: 28px;/*px*/
    line-height: 34px; /*px*/
    height: 68px;/*px*/
    //多行省略号
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
.newSong-list{
  li{
    padding-left: 20px;
    &>a{
      display: flex;
      justify-content: space-between;
      border-bottom: #e2e2e3 1px solid;/*no*/
    }
    .text{
      float: left;
      padding: 13px 0;
      width: 480px;
      overflow: hidden;
    }
    .name{
      font-size: 26px;/*px*/
      line-height: 48px;/*px*/
      .alias{
        color:#888888;
      }
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .singer{
      font-size: 24px;/*px*/
      line-height: 36px;/*px*/
      color:#888888;
      width: 200%;
    }
    .fa-play-circle-o{
      display: flex;
      align-items: center;
      font-size: 44px;/*px*/
      color: #aaaaaa;
      margin-right: 20px;
    }
  }
}
</style>

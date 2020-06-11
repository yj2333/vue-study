<template>
  <div class="player" v-show="isShowPlayer" @click="F()">
    <div class="player-icon" @click="isShowControl = true"><i class="fa fa-music" :style="{ 'animation-play-state': isPlay ? 'running' : 'paused' }"></i></div>
    <div class="palyer-control" v-show="isShowControl">
      <i class="fa fa-close" @click="isShowControl = false"></i>
      <div class="songName">{{this.songStore.name}}</div>
      <div class="palyer-audio">
        <div class="palyer-audio-button">
          <i class="fa fa-step-backward" @click="playSong(-1)"></i>
          <audio ref="audioNode" :src="url" controls="controls" class="song-audio" autoplay="true"></audio>
          <i class="fa fa-step-forward" @click="playSong(1)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { getSongUrl, getSongDetail, getSongLyric } from '@/api/song';

export default {
  mounted(){
    this.$refs.audioNode.onpause = () =>{
      this.songStore.isPlay = false;
      this.$store.commit('updateSong', this.songStore);
    };
    this.$refs.audioNode.onplay = () =>{
      this.songStore.isPlay = true;
      this.$store.commit('updateSong', this.songStore);
    };
    this.$refs.audioNode.ontimeupdate = ()=>{
      //console.log(this.$refs.audioNode.currentTime, this.$refs.audioNode.duration)
      //this.lyric[this.actvieIndex].time//当前歌词开始的时间点
      //this.$refs.audioNode.currentTime//当前歌播放的时间点
      var currentTime = this.$refs.audioNode.currentTime;
      for(var index = 0; index < this.lyric.length; index++){
        var item = this.lyric[index];
        if(currentTime < item.time){
          this.songStore.activeIndex = index == 0 ? 0 : index - 1;
          break;
        }
      }
      //console.log(this.songStore.activeIndex)
      this.$store.commit('updateSong', this.songStore);
    };
  },
  data(){
    return {
      isShowControl: false,//是否显示播放器控制台
      song: {
        id: null,
        isPlay: true,//是否在播放
        name: '',//歌名
        url: null,
        picUrl: '',//图片
        pic_str: '',
        lyric: [],//{ time: 0, content: '歌词' }
        activeIndex: 0,//歌词激活位置
      },
    };
  },
  methods: {
    F(){
      //console.log(this.songList,this.songStore.id,88)
    },
    async playSong(numSIgn){//numSIgn：-1表示前一首歌，1表示下一首歌
      var activeIndex = this.songList.indexOf(this.songStore.id);//当前歌id的为索引位置
      var lastIndex = this.songList.length - 1;
      var nextIndex;
      if(activeIndex == -1){
        Toast('出错!');
        return;
      }
      if(numSIgn == -1){
        nextIndex = activeIndex == 0 ? lastIndex : activeIndex - 1;
      }
      else if(numSIgn == 1){
        nextIndex = activeIndex == lastIndex ? 0 : activeIndex + 1;
      }
      if(nextIndex == activeIndex){
        Toast('没有更多了!');
        return;
      }
      var nextId = this.songList[nextIndex];//得到下一首歌的id
      var path = this.$route.path;
      var reg = /^\/song\/\d+$/;
      //console.log(activeIndex,nextIndex,this.songList)
      if(reg.test(path)){
        this.$router.replace(`/song/${nextId}`);
      }
      else{
        this.song.id = nextId;
        await this.getSongDetail();
        await this.getSongLyric();
        await this.getSongUrl();
        this.$store.commit('updateSong', this.song);
      }
    },
    getSongUrl(){//歌url接口
      return new Promise((resolve,reject) =>{
        var id = this.song.id;
        getSongUrl({ 
          params: {
            id
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var song = data.data[0];
            if(song){
              if(this.url != song.url){//对同一首歌进入不做重新播放处理
                this.song.url = song.url;
              }
            }
          }
          resolve(true);
        });
      });
    },
    getSongDetail(){//歌详情接口
      return new Promise((resolve,reject) =>{
        var ids = this.song.id;
        getSongDetail({ 
          params: {
            ids
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var songData = data.songs[0];
            if(songData){
              var al = songData.al;
              this.song.name = al.name;
              this.song.picUrl = al.picUrl;
              this.song.pic_str = al.pic_str;
            }
          }
          resolve(true);
        });
      });
    },
    getSongLyric(){
      return new Promise((resolve,reject) =>{
        var id = this.song.id;
        getSongLyric({ 
          params: {
            id
          }
        }).then(res =>{
          var data = res.data;
          if(data.code == 200){
            var lyric = data.lrc.lyric
            if(lyric){
              var lyricArr = lyric.split(/\n/);
              var newLyricArr = lyricArr.map(item => {
                var arrItem = item.split(']');
                var arrTime = arrItem[0].slice(1).split(':');
                var time = arrTime[0]*60+Number(arrTime[1]);
                var content = arrItem[1];
                return { 
                  time, 
                  content 
                };
              });
              this.song.lyric = newLyricArr;
              //console.log(newLyricArr)
            }
          }
          resolve(true);
        });
      });
    },
  },
  computed: {
    songStore(){//得到当前歌的数据
      //console.log(this.$store.getters.song,99);
      return this.$store.getters.song;
    },
    url(){//歌的url
      return this.songStore.url;
    },
    actvieIndex(){
      return this.songStore.actvieIndex;
    },
    lyric(){
      return this.songStore.lyric;
    },
    isPlay(){
      return this.songStore.isPlay;
    },
    isShowPlayer(){//是否显示播放器
      return this.url != '' && this.url != null
    },
    songList(){//得到歌曲的列表
      return this.$store.getters.songList;
    }, 
  },
  watch: {
    isPlay(newval,oldval){
      if(newval){
        this.$refs.audioNode.play();
      }
      else{
        this.$refs.audioNode.pause();
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes circle
{
  from { transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}
.player{
  .player-icon{
    position: fixed;
    right: 0;
    top: 50%;
    transform: translate(0, -50%);
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 82px;
    height: 86px;
    background: #fff;
    border-radius: 43px 0 0 43px;
    box-shadow: 1px 1px 16px 0px #bbb0b0;
    .fa-music{
      animation: circle 2s linear infinite;
    }
  }
  .palyer-control{
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    background: #fff;
    .songName{
      width: 400px;
      margin: 0 auto;
      text-align: center;
      font-size: 46px;
    }
    .fa-close{
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 48px;/*px*/
    }
  }
  .palyer-audio{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
  }
  .palyer-audio-button{
    display: flex;
    width: 100%;
    font-size: 42px;/*px*/;
    &>.fa{
      margin: 10px;
      display: flex;
      align-items:center;
    }
    .song-audio{
      width: 100%;
    }
  }
}
</style>

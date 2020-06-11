<template>
  <div
    class="song"
    @click="songFun"
    :style="{ backgroundImage: 'url(http://music.163.com/api/img/blur/'+song.pic_str+')' }"
  >
    <div class="song-wrap">

      <div class="clearfix" >
        <div class="song-player" ref="songPlayerNode">
          <i class="pointer" :style="{ transform: song.isPlay ? 'rotate(20deg)' : 'rotate(0deg)' }"></i>
          <i class="img-bg" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }"></i>
          <div class="img" :style="{ 'animation-play-state': song.isPlay ? 'running' : 'paused' }">
            <img :src="song.picUrl" alt />
          </div>
          <i class="status" v-show="!song.isPlay"></i>
        </div>
        <div class="lyric" style="height:189px;">
          <div class="lyric-wrap">
            <ul class="lyric-list" :style="{ 'transition-duration': transitionDurationTime, transform: 'translate(0, '+ -activeIndex*(80/75) +'rem)'}">
              <li :class="{ active: index == activeIndex }" v-for="(item,index) in song.lyric" :key="index">{{ item.content }}</li>
            </ul>
          </div>
        </div>

        <div class="share">分享给微信好友</div>

        <div class="simi">
          <div class="simiSong-title">喜欢这首歌的人也听</div><div class="listen" @click="pushSongs" href="javascript:;"><i class="fa fa-play-circle-o"></i>一键收听</div>
          <ul class="simiSong-list">
            <li v-for="item in simiSongData" :key="item.index" class="clearfix">
              <router-link :to="'/song/'+item.id">
                <img :src="item.album.picUrl">
                <div class="text">
                  <div class="name">{{ item.name }}</div>
                  <div class="singer"><div style="float:left;">{{songArtists(item)}} </div>- {{ item.album.name }}</div>
                </div>
                <i class="fa fa-play-circle-o"></i>
              </router-link>
            </li>
          </ul>
        </div>

        <div class="comment">
          <div class="comment-title">精彩评论</div>
          <ul class="comment-list">
            <li v-for="item in commentMusic" :key="item.index" class="clearfix">
              <img :src="item.user.avatarUrl">
              <div class="comment-user">
                <div class="clearfix">
                  <div class="comment-text">
                      <div class="comment-name">{{ item.user.nickname }}</div>
                      <div class="comment-time">{{parseDate(item.time)}}</div>
                  </div>
                  <div class="comment-liked">{{item.likedCount}}
                    <i class="fa fa-thumbs-o-up" aria-hidden="true" :v-show="item.liked == true"></i>
                    <!-- <i class="fa fa-thumbs-up" aria-hidden="true" :v-show="item.liked == false"></i> -->
                  </div>
                </div>
                <div class="comment-content">
                  <span>{{item.content}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui';
import { getSongUrl, getSongDetail, getSongLyric, getSimiSong, getCommentMusic} from "@/api/song";

export default {
  created() {
    this.init();
  },
  mounted() {
    var dpr = document.documentElement.getAttribute("data-dpr");
    var windowResize = () => {
      this.screen.height = window.screen.height * dpr;
      this.screen.lyricHeight =
        this.screen.height -
        this.$refs.songPlayerNode.clientHeight -
        this.$refs.songPlayerNode.offsetTop; //得到可视高度
      //console.log(this.screen.height, this.screen.lyricHeight)
    };
    window.onresize = windowResize;
    windowResize();
  },
  data() {
    return {
      song: {
        isPlay: true, //是否在播放
        name: "", //歌名
        url: null,
        picUrl: "", //图片
        pic_str: "",
        lyric: [], //{ time: 0, content: '歌词' }
        activeIndex: 0 //歌词激活位置
      },
      screen: {
        height: null, //屏幕的高度,以px作为单位返回的值
        lyricHeight: null //歌词可以占据的高度,以px作为单位返回的值
      },
      transitionDurationTime: 0,//过渡的动画时间
      simiSongData: [],
      commentMusic:[],
    };
  },
  methods: {
    async init(){
      //此三个接口，同步执行，目的是为了得到一首歌的完整信息
      await this.getSongDetail();
      await this.getSongLyric();
      this.getSongUrl();
      this.getSimiSong();
      this.getCommentMusic();
      this.song.id = Number(this.$route.params.id);
    },
    songFun() {
      this.song.isPlay = !this.song.isPlay;
      this.$store.commit("updateSong", this.song);
      this.$store.commit('updateSongList',this.song.id);
    },
    getSongUrl() {//歌url接口
      var id = this.$route.params.id;
      getSongUrl({
        params: {
          id
        }
      }).then(res => {
        var data = res.data;
        if (data.code == 200) {
          var song = data.data[0];
          if (song) {
            if (this.url != song.url) {
              //对同一首歌进入不做重新播放处理
              this.song.url = song.url;
              this.songFun();
            }
          }
        }
      });
    },
    getSongDetail() {//歌曲详情接口
      return new Promise((resolve, reject) => {
        var ids = this.$route.params.id;
        getSongDetail({
          params: {
            ids
          }
        }).then(res => {
          var data = res.data;
          if (data.code == 200) {
            var songData = data.songs[0];
            if (songData) {
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
    getSongLyric() {//获取歌词
      return new Promise((resolve, reject) => {
        var id = this.$route.params.id;
        getSongLyric({
          params: {
            id
          }
        }).then(res => {
          var data = res.data;
          if (data.code == 200) {
            var lyric = data.lrc.lyric;
            if (lyric) {
              var lyricArr = lyric.split(/\n/);
              var newLyricArr = lyricArr.map(item => {
                var arrItem = item.split("]");
                var arrTime = arrItem[0].slice(1).split(":");
                var time = arrTime[0] * 60 + Number(arrTime[1]);
                var content = arrItem[1];
                return {
                  time,
                  content
                };
              });
              this.song.lyric = newLyricArr;
              //console.log(newLyricArr);
            }
          }
          resolve(true);
        });
      });
    },
    pushSongs(){//一键收听，将歌的id加入播放器列表
      var payload = this.simiSongData.map(itme => itme.id);//等价this.simiSongData.map(itme =>{ return itme.id;});
      Toast('收听成功！');
      this.$store.commit('updateSongList',payload);
    },
    getSimiSong() {//相似歌曲
      var id = this.$route.params.id;
      getSimiSong({
        params: {
          id
        }
      }).then(res => {
        var data = res.data;
        if(data.code == 200){//成功
          //console.log(data.songs)
          this.simiSongData = data.songs;
        }
          //id, name,artists.name,album.name,album.picUrl
      });
    },
    getCommentMusic() {//精彩评论
      var id = this.$route.params.id;
      getCommentMusic({
        params: {
          id
        }
      }).then(res => {
        var data = res.data;
        if (data.code == 200) {
          //console.log(data.hotComments)
          this.commentMusic = data.hotComments;
          //liked(是否点赞),likedCount(点赞数),user.nickname(用户昵称),user.avatarUrl(用户头像),time(评论时间)
        }
      });
    },
    transitionDuration() {//得到过渡时间
      var activeLyric = this.song.lyric[this.activeIndex]; //当前歌词
      var nextLyric = this.song.lyric[this.activeIndex + 1]; //下一句歌词
      if (nextLyric) {
        this.transitionDurationTime = nextLyric.time - activeLyric.time + "s";
      } else {
        this.transitionDurationTime = 0;
      }
      //console.log(this.transitionDurationTime);
    },
    parseDate(time){//时间换算
      var curDate = new Date();
      curDate.setTime(time);
      var year = curDate.getFullYear();
      var month = curDate.getMonth() + 1;
      month = month < 10 ? '0'+month: month;
      var date = curDate.getDate();
      date = date < 10 ? '0'+date: date;
      return year+'年'+month+'月'+date + '日';
    },
    songArtists(item){
      if(item.artists.length > 1 && item.artists.length <= 2){
        var h = JSON.parse(JSON.stringify(item.artists));
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
      if(item.artists.length > 2){
        var h = JSON.parse(JSON.stringify(item.artists));
        //console.log(h)
        var songArtists = '';
        for(var i = 0;i <= 2;i++){
          //console.log(i)
          //console.log(h[i])
          songArtists = i != 2 ? songArtists + h[i].name + '/' : songArtists + h[i].name;
          //console.log(songArtists)
        }
          songArtists = songArtists + '...';
        return songArtists;
      }
      else{
        return item.artists[0].name;
      }
    },
  },
  computed: {
    songStore() {
      //得到歌的数据
      return this.$store.getters.song;
    },
    activeIndex() {
      return this.songStore.activeIndex;
    },
    url() {
      return this.songStore.url;
    },
    isPlay() {
      return this.songStore.isPlay;
    }
  },
  watch: {
    isPlay(newval) {
      this.song.isPlay = newval;
    },
    activeIndex(newval) {
      this.transitionDuration();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
@keyframes circle {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.song {
  background: #484848 no-repeat center 0 / auto 100%;
}
.song-wrap {
  background: rgba(0, 0, 0, 0.5);
  overflow-x: hidden;
  .lyric {
    box-sizing: border-box;
    padding: 46px 0;
    display: flex;
  }
  .lyric-wrap {
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
    font-size: 34px; /*px*/
    overflow: hidden;
    margin: 0 auto;
    .lyric-list {
      transition-property: transform;
    }
    li {
      min-height: 80px;
      line-height: 80px;
    }
    .active {
      color: rgba(255, 255, 255, 1);
    }
  }
}
.song-player {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 585px;
  height: 585px;
  margin: 175px auto 0;
  .pointer {
    position: absolute;
    left: 50%;
    top: -185px;
    z-index: 8;
    width: 207px;
    height: 315px;
    background: url("~@/assets/img/needle.png") no-repeat center 0 / 168px 244px;
    transition: transform 0.5s;
    transform-origin: 80px 0;
  }
  .img-bg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background: url("~@/assets/img/disc.png") no-repeat 0 0 / 100% 100%;
    animation: circle 5s linear infinite;
  }
  .img {
    position: relative;
    z-index: 5;
    width: 370px;
    height: 370px;
    border-radius: 50%;
    overflow: hidden;
    background: #000;
    animation: circle 5s linear infinite;
  }
  .status {
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -50px 0 0 -50px;
    width: 100px;
    height: 100px;
    background: url("~@/assets/img/play-icon.png") no-repeat 0 0 / 100% 100%;
    z-index: 9;
  }
}
.share{
  width: 332px;
  height: 73px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px; /*px*/
  color: #fff;
  border: #fff solid 1px;
  border-radius: 999rem;
}
.simi{
  padding-left: 30px;
  padding-top: 75px;
  padding-right: 30px;
  .simiSong-title{
    float: left;
    font-size: 39px;
    line-height: 54px;
    color: #fff;
  }
  .listen{
    display: flex;
    float: right;
    justify-content: center;
    align-items: center;
    width: 173px;
    height: 53px;
    color: #fff;
    border: #fff solid 1px;
    border-radius: 999rem;
    &>i{
      padding-right: 10px;
    }
  }
  .simiSong-list{
    padding-top: 55px;
    li{
      padding-left: 20px;
      margin-top: 38px;
      img{
        float: left;
        width: 83px;
        height: 83px;
        padding: 13px 0;
      }
      .text{
        float: left;
        padding: 13px 0;
        padding-left: 21px;
        width: 414px;
        overflow: hidden;
      }
      .name{
        font-size: 26px;/*px*/
        line-height: 48px;/*px*/
        color:#fff;
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
        float: right;
        margin-top: 32px;
        font-size: 44px;/*px*/
        color: #aaaaaa;
        margin-right: 20px;
      }
    }
  }
}
.comment{
  padding: 75px 30px 20px;
  .comment-title{
    float: left;
    font-size: 39px;
    line-height: 54px;
    color: #fff;
  }
  .comment-list{
    padding-top: 55px;
    li{
      padding-left: 20px;
      margin-top: 38px;
      img{
        float: left;
        width: 64px;
        height: 64px;
        padding: 13px 0;
        border-radius: 50%;
      }
      .comment-user{
        border-bottom: solid 1px #98938f;
        margin-left: 82px;
        .comment-text{
          float: left;
          .comment-name{
            color: #b6b0b0;
            font-size: 26px;/*px*/
            line-height: 48px;/*px*/
          }
          .comment-time{
            color: #98938f;
            font-size: 24px;/*px*/
            line-height: 36px;/*px*/
          }
        }
        .comment-liked{
          float: right;
          padding: 26px 0;
          color: #98938f;
        }
      }
      .comment-content{
        color: #fff;
        padding: 14px 68px 20px 0;
      }
    }
  }
}
</style>

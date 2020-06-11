<template>
  <div class="artist">
    <div class="header">
      <img :src="artistData.img1v1Url" alt />
      <div class="text">
        <div class="name">{{ artistData.name }}</div>
      </div>
    </div>
    <div class="intro">
      <div class="title">歌手简介</div>
      <p :class="isShowAllIntro != true ? 'text' : ''">{{ artistData.briefDesc }}</p>
      <div class="control" v-if="!isShowAllIntro" @click=" isShowAllIntro = true">
        完整歌手介绍
        <i class="fa fa-angle-down"></i>
      </div>
      <div class="control" v-else @click=" isShowAllIntro = false">
        收起
        <i class="fa fa-angle-up"></i>
      </div>
    </div>
    <div class="bg"></div>
    <div class="hotSongs">
      <div class="title">热门单曲</div>
      <ul class="hotSong-list">
        <li v-for="(item,index) in artistHotSongsData" :key="item.id">
          <div
            class="rank"
            :style="{ color:'#999999'}"
          >{{(index + 1) < 10 ? `0${index + 1}` : index + 1}}</div>
          <router-link :to="'/song/'+ item.id">
            <div class="content">
              <div class="text">
                <div class="name">{{ item.name }}</div>
                <div
                  class="singer"
                >{{ item.ar[0] != null ?item.ar[0].name : ''}} {{artistAlbumData.ar[1] != null ? '/' + ' ' + artistAlbumData.ar[1].name : ''}} - {{item.al.name}}</div>
              </div>
            </div>
            <i class="fa fa-play-circle-o"></i>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="bg"></div>
    <div class="album">
      <router-link :to="'/album/'+ artistAlbumData.al.id">
        <div class="title">最新音乐</div>
        <div class="detail">
          <img :src="artistAlbumData.al != null ? artistAlbumData.al.picUrl : ''" alt />
          <div class="content">
            <div class="name">{{ artistAlbumData.al != null ? artistAlbumData.al.name : ''}}</div>
            <div
              class="singer"
            >{{artistAlbumData.ar[0] != null ? artistAlbumData.ar[0].name : ''}} {{artistAlbumData.ar[1] != null ? artistAlbumData.ar[1].name : ''}}</div>
            <div class="num">{{artistAlbumData.no}}首</div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { getArtist, getArtistAlbum, getArtistFans } from "@/api/artist";
export default {
  created() {
    this.getArtist();
    this.getArtistAlbum();
  },
  data() {
    return {
      artistData: {}, //歌手信息
      artistHotSongsData: [], //歌手的热门单曲
      artistAlbumData: { ar: [], al: {} }, //歌手专辑
      isShowAllIntro: false //是否显示完整歌手介绍
    };
  },
  methods: {
    getArtist() {
      let id = this.$route.params.id;
      getArtist({
        params: {
          id
        }
      }).then(res => {
        let data = res.data;
        if (data.code == 200) {
          this.artistData = data.artist;
          this.artistHotSongsData = data.hotSongs.filter(
            (item, index) => index < 5
          );
        }
      });
    },
    getArtistAlbum() {
      let id = this.$route.params.id;
      getArtistAlbum({
        params: {
          id
        }
      }).then(res => {
        console.log(res.data);
        let data = res.data;
        if (data.code == 200) {
          this.artistAlbumData = data.hotSongs[0];
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  height: 610px;
  overflow: hidden;
  border-bottom: 1px solid #cacacb; /*no*/
  .text {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.2);
    .name {
      position: absolute;
      font-size: 38px; /*px*/
      color: #fff;
      left: 33px;
      top: 297px;
    }
  }
}
.title {
  font-size: 34px; /*px*/
  color: #333333;
  font-weight: bold;
}
.intro {
  padding: 40px 30px 0 30px;
  p {
    font-size: 28px;
    color: #666666;
    margin-top: 48px;
  }
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  .control {
    display: flex;
    justify-content: center;
    margin: 40px 0;
    font-size: 32px; /*px*/
  }
}
.bg {
  height: 15px;
  background: #fcfcfd;
}
.hotSongs {
  padding: 40px 30px 0;
  .hotSong-list {
    li {
      display: flex;
      align-items: center;
      .rank {
        font-size: 24px; /*px*/
      }
      & > a {
        display: flex;
        justify-content: space-between;
        margin: 13px 0 0 22px;
        width: 670px;
      }
      .content {
        display: flex;
        align-items: center;
        .name {
          font-size: 26px; /*px*/
          line-height: 48px;
        }
        .singer {
          font-size: 24px; /*px*/
          line-height: 36px;
          color: #888888;
          padding-bottom: 13px;
        }
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
}
.album {
  padding: 40px 0 0 30px;
  .detail {
    display: flex;
    img {
      padding-top: 38px;
      width: 162px;
      height: 162px;
    }
    .content {
      padding-left: 50px;
      .name {
        padding-top: 38px;
        font-size: 30px; /*px*/
        color: #333333;
      }
      .num,
      .singer {
        font-size: 26px; /*px*/
        color: #888888;
        padding-top: 14px;
      }
      .num {
        padding-top: 24px;
      }
    }
  }
}
.fa {
  margin-left: 2px;
}
</style>

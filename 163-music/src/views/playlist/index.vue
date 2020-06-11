<template>
  <div class="play-list">
    <div
      class="header"
      :style="`background:url(${playListData.coverImgUrl != null  ? playListData.coverImgUrl : ''})`"
    >
      <div class="black">
        <div class="title">{{playListData.name}}</div>
        <div class="intro" v-if="!isShowAllIntro">
          简介：{{playListData.description}}
          <i
            class="fa fa-angle-right"
            @click="isShowAllIntro = !isShowAllIntro"
          ></i>
        </div>
        <div class="introAll" v-else>
          简介：{{playListData.description}}
          <i
            class="fa fa-angle-left"
            @click="isShowAllIntro = !isShowAllIntro"
          ></i>
        </div>
      </div>
    </div>
    <div class="play-list">
      <div class="title">歌曲列表</div>
      <div class="Allsong">
        <ul class="Allsong-list">
          <li v-for="(item,index) in playListData.tracks" :key="item.id">
            <div class="rank">{{index + 1}}</div>
            <router-link :to="'/song/'+item.id">
              <div class="content">
                <div class="text">
                  <div class="name">{{ item.name }}</div>
                  <div
                    class="singer"
                  >{{ item.ar[0] != null ?item.ar[0].name : ''}} - {{item.al.name}}</div>
                </div>
              </div>
              <i class="fa fa-play-circle-o"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="wonderful-comment">
      <div class="comment-title">精彩评论</div>
      <ul class="comment-list">
        <li v-for="(item,index) in hotCommentsData" :key="item.commentId">
          <div class="main-user">
            <div class="user">
              <img :src="item.user.avatarUrl" alt />
              <div class="text">
                <div class="name">{{item.user.nickname}}</div>
                <div class="time">{{parseDate(item.time)}}</div>
              </div>
            </div>
            <div class="liked">
              <div class="count">{{item.likedCount}}</div>
              <i class="fa fa-thumbs-o-up"></i>
            </div>
          </div>
          <div class="main-content">{{ item.content}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getPlayList, getPlayListComment } from "@/api/playList";
export default {
  created() {
    this.getPlayList();
    this.getPlayListComment();
  },
  data() {
    return {
      playListData: [],
      hotCommentsData: [],
      isShowAllIntro: false
    };
  },
  methods: {
    parseDate(time) {
      //时间换算
      var curDate = new Date();
      curDate.setTime(time);
      var year = curDate.getFullYear();
      var month = curDate.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var date = curDate.getDate();
      date = date < 10 ? "0" + date : date;
      return year + "年" + month + "月" + date + "日";
    },
    getPlayList() {
      let id = this.$route.params.id;
      getPlayList({
        params: {
          id
        }
      }).then(res => {
        console.log(res.data);
        let data = res.data;
        if (data.code == 200) {
          this.playListData = data.playlist;
        }
      });
    },
    getPlayListComment() {
      let id = this.$route.params.id;
      getPlayListComment({
        params: {
          id
        }
      }).then(res => {
        console.log(res.data);
        let data = res.data;
        if (data.code == 200) {
          this.hotCommentsData = data.hotComments;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.play-list {
  .header {
    height: 420px;
    .black{
      height: 420px;
      background:rgba(0, 0, 0, 0.5);
      overflow:hidden;
      .title {
      padding: 81px 0 0 42px;
      font-size: 34px; /*px*/
      color: #fff;
      width: 650px;
      height: 110px;
      line-height: 55px;
    }
    .intro {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      font-size: 27px; /*px*/
      color: #fff;
      margin-top: 36px;
      padding-left: 42px;
      width: 420px;
      height: 96px;
      line-height: 48px;
      padding-right: 300px;
      .fa-angle-right {
        position: absolute;
        font-size: 24px; /*px*/
        color: #fff;
        right: 50px;
        top: 40px;
      }
    }
    .introAll {
      position: relative;
      font-size: 27px; /*px*/
      color: #fff;
      line-height: 38px;
      margin: 36px 0 33px 30px;
      padding-right: 30px;
      width: 650px;
      display: -webkit-box;
      /* -webkit-box-orient: vertical; */
      /*! autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
      overflow: hidden;
      .fa-angle-left {
        position: absolute;
        font-size: 24px; /*px*/
        color: #fff;
        right: 0px;
        bottom: 40px;
      }
    }
    }
    
  }
  .play-list {
    .title {
      height: 46px;
      background: #eeeff0;
      font-size: 24px; /*px*/
      padding-left: 20px;
      color: #666666;
      line-height: 46px;
    }
    .Allsong {
      .Allsong-list {
        li {
          display: flex;
          padding-left: 20px;
          align-items: center;
          .rank {
            font-size: 24px; /*px*/
            color: #999;
          }
          a {
            width: 670px;
            display: flex;
            justify-content: space-between;
            border-bottom: #e2e2e3 1px solid; /*no*/
            margin: 13px 0 0 22px;
          }
          .content {
            display: flex;
            align-items: center;
            .name {
              font-size: 26px; /*px*/
              line-height: 48px; /*px*/
            }
            .singer {
              font-size: 24px; /*px*/
              line-height: 36px; /*px*/
              color: #888888;
              padding-bottom: 13px;
            }
          }

          .fa-play-circle-o {
            display: flex;
            align-items: center;
            font-size: 44px; /*px*/
            color: #aaaaaa;
            padding-right: 20px;
          }
        }
      }
    }
  }
  .wonderful-comment {
    .comment-title {
      height: 46px;
      background: #eeeff0;
      font-size: 24px; /*px*/
      padding-left: 20px;
      color: #666666;
      line-height: 46px;
    }
    .comment-list {
      padding-left: 20px;
      li {
        margin-right: 30px;
        .main-user {
          padding-top: 15px;
          display: flex;
          justify-content: space-between;
          height: 70px;
          .user {
            display: flex;
            img {
              width: 65px;
              height: 65px;
              border-radius: 50% 50%;
            }
            .text {
              padding-left: 20px;
              .name {
                color: #736f6e;
                font-size: 24px; /*px*/
                line-height: 36px;
              }
              .time {
                color: #868080;
                font-size: 18px; /*px*/
                line-height: 28px;
              }
            }
          }
          .liked {
            display: flex;
            .count {
              margin-right: 8px;
            }
          }
        }
        .main-content {
          margin: 20px 0 0 112px;
          color: #333333;
          padding-bottom: 30px;
          border-bottom: 1px solid #5f554c; /*no*/
          font-size: 26px; /*px*/
        }
      }
    }
  }
}
</style>

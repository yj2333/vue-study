<template>
  <div class="album">
    
    <div class="album-header" :style="`background-image: url(${albumDetailData.picUrl})`">
      <div class="black">
        <div class="content">
          <div class="type">专辑</div>
          <img :src="albumDetailData.picUrl" alt />
          <div class="text">
            <div class="title">{{albumDetailData.name}}</div>
            <div class="artist">
              歌手：
              <span>{{albumDetailData.artists != null ? albumDetailData.artists[0].name : ''}}</span>
            </div>
            <div class="date">{{publishTime}}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="album-intro" v-if="!isShowAllIntro">
      简介：{{albumDetailData.description}}
      <i
        class="fa fa-angle-down"
        @click="isShowAllIntro = !isShowAllIntro"
      ></i>
    </div>
    <div class="album-introAll" v-else>
      简介：{{albumDetailData.description}}
      <i
        class="fa fa-angle-up"
        @click="isShowAllIntro = !isShowAllIntro"
      ></i>
    </div>

    <div class="song-list">
      <div class="title">歌曲列表</div>
      <div class="Allsong">
        <ul class="Allsong-list">
          <li v-for="(item,index) in albumSongsData" :key="item.id">
            <div class="rank">{{index + 1}}</div>
            <router-link :to="'/song/'+item.id">
              <div class="content">
                <div class="text">
                  <div class="name">{{ item.name }}</div>
                  <div
                    class="singer"
                  >{{ item.ar[0] != null ?item.ar[0].name : ''}} {{ item.ar[1] != null ?'/' + ' ' + item.ar[1].name : ''}} - {{item.al.name}}</div>
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
        <li v-for="(item,index) in albumHotCommentData" :key="item.commentId">
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
    <mt-loadmore :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
      <div class="new-comment">
        <div class="comment-title">最新评论</div>

        <ul class="comment-list">
          <li v-for="(item,index) in albumNewCommentData" :key="item.commentId">
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
      <div class="AllComments" v-if="!isShowAllComments" @click="getNextPage">查看全部{{totalNum}}条评论 ></div>
    </mt-loadmore>
  </div>
</template>

<script>
import { getAlbum, getAlbumComment } from "@/api/album";
export default {
  created() {
    this.getAlbum();
    this.getAlbumComment();
  },
  data() {
    return {
      albumSongsData: [], //专辑歌曲数据
      albumDetailData: [], //专辑详情
      albumHotCommentData: [], //专辑热门评论
      albumNewCommentData: [], //专辑最新评论
      totalNum: 0, //评论总数
      publishTime: "", //专辑发布时间
      pageNum: 0, //当前评论页数
      isShowAllIntro: false, //是否显示简介的所有内容
      allLoaded: true, //第一次默认不下拉刷新
      isShowAllComments: false //是否显示所有评论
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
    getNextPage() {
      this.pageNum++;
      this.getAlbumComment(this.pageNum * 30);
      this.isShowAllComments = true;
      if (this.totalNum < this.pageNum * 30) {
        return;
      }
      this.allLoaded = false;
    },
    getAlbum() {
      //获取专辑
      let id = this.$route.params.id;
      getAlbum({
        params: {
          id
        }
      }).then(res => {
        console.log(res.data);
        let data = res.data;
        if (data.code == 200) {
          this.albumSongsData = data.songs;
          this.albumDetailData = data.album;
          this.getDate();
        }
      });
    },
    getAlbumComment(offset = 0) {
      //获取评论
      let id = this.$route.params.id;
      getAlbumComment({
        params: {
          id,
          offset
        }
      }).then(res => {
        console.log(res.data);
        let data = res.data;
        if (data.code == 200) {
          if (offset == 0) {
            //只获取一次
            this.albumHotCommentData = data.hotComments;
            this.totalNum = data.total;
          }
          this.albumNewCommentData = this.albumNewCommentData.concat(
            data.comments
          );
        }
      });
    },
    getDate() {
      //处理时间
      let date = new Date();
      date.setTime(this.albumDetailData.publishTime);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getDate();
      day = day < 10 ? "0" + day : day;
      this.publishTime = `发行时间：${year}-${month}-${day}`;
    },
    loadBottom() {
      this.pageNum++;
      console.log(this.pageNum);
      this.getAlbumComment(this.pageNum * 20);
      console.log(this.totalNum);
      if (this.totalNum < this.pageNum * 30) {
        this.allLoaded = true; // 若数据已全部获取完毕
      }
      this.$refs.loadmore.onBottomLoaded();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.album {
  background: #f8f8f8;
  .album-header {
    display: flex;
    position: relative;
    height: 372px;
    .black{
      height: 372px;
      width: 100%;
      background:rgba(0, 0, 0, 0.5);
      overflow:hidden;
      .content{
        padding: 60px 0 0 30px;
        .type {
          position: absolute;
          width: 68px;
          height: 34px;
          border-radius: 0 17px 17px 0;
          background: #c23b3b;
          font-size: 18px; /*px*/
          color: #ffffff;
          top: 80px;
          text-align: center;
          line-height: 34px;
        }
        img {
          width: 252px;
          height: 252px;
        }
        .text {
          float: right;
          padding-right: 52px;
          .title {
            font-size: 34px; /*px*/
            color: #fff;
            height: 92px;
            line-height: 92px;
          }
          .artist {
            font-size: 26px; /*px*/
            color: #b4a49c;
            margin-top: 26px;
            span {
              color: #fff;
            }
          }
          .date {
            margin-top: 22px;
            font-size: 24px; /*px*/
            color: #b4a49c;
          }
        }
      }
    }
  }
  .album-intro {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    font-size: 27px; /*px*/
    color: #66667c;
    line-height: 38px;
    height: 114px;
    margin: 20px 0 33px 30px;
    padding-right: 150px;
    width: 500px;
    .fa-angle-down {
      position: absolute;
      font-size: 24px; /*px*/
      color: #bbbbbb;
      right: 0px;
      top: 90px;
    }
  }
  .album-introAll {
    position: relative;
    font-size: 27px; /*px*/
    color: #66667c;
    line-height: 38px;
    margin: 20px 0 33px 30px;
    padding-right: 30px;
    width: 600px;
    .fa-angle-up {
      position: absolute;
      font-size: 24px; /*px*/
      color: #bbbbbb;
      right: 0px;
      bottom: 0px;
    }
  }

  .song-list {
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
  .new-comment,
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
  .AllComments {
    height: 102px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999999;
    font-size: 26px;
  }
}
</style>

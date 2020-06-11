<template>
  <div>
    <app-nav :activeIndex="2"></app-nav>

    <mt-search class="search" v-model="value" placeholder="搜索歌曲、歌手、专辑" cancel-text="x">

      <div class="search-list">
        <h3 class="title">最佳匹配</h3>
        <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmoreNode">
          <ul class="newSong-list">

            <li><!-- 最佳匹配歌手-->
              <router-link :to="`/artist/${searchArtistData.id}`">
                <div class="artist">
                  <img class="artist-img" :src="searchArtistData.picUrl" alt="" />
                  <div class="artist-name">歌手：{{ keywordsHighLight(searchArtistData.name) }}</div>
                  <i class="fa fa-angle-right"></i>
                </div>
              </router-link>
            </li>

            <li><!-- 最佳匹配专辑-->
              <router-link :to="`/album/${searchAlbumData.id}`">
                <div class="album">
                  <img class="album-img" :src="searchAlbumData.blurPicUrl" alt="" />
                  <div class="album-name">
                    <div class="album-realy-name">
                      专辑：<span>{{ keywordsHighLight(searchAlbumData.name) }}</span>
                    </div>
                    <div class="album-artist-name" v-if="searchAlbumData.artist != null">{{ keywordsHighLight(searchAlbumData.artist.name) }}</div>
                  </div>
                  <i class="fa fa-angle-right"></i>
                </div>
              </router-link>
            </li>

            <li v-for="(item, index) in searchSongData" :key="index"><!-- 最佳匹配歌曲-->
              <router-link :to="'/song/' + item.id">
                <div class="text">
                  <div class="name">{{ keywordsHighLight(item.name) }}</div>
                  <div class="singer">{{ keywordsHighLight(item.artists[0] != null ? item.artists[0].name : '') }}</div> <div style="float:left;">-</div> <div class="singer_album">{{ keywordsHighLight(item.album.name) }}</div>
                </div>
                <i class="fa fa-play-circle-o"></i>
              </router-link>
            </li>

          </ul>
        </mt-loadmore>
      </div>
    </mt-search>

    <div class="search-keywords">
      <h3 class="title">热门搜索</h3>
      <ul class="list">
        <li v-for="(item, index) in searchHotTags" :key="index" @click="searchHotClick(item.first)">
          {{ item.first }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import appNav from '@/components/app-nav'
import { getSeachHot, getSeach } from '@/api/search'
//click|mousedown ->  touchstart
//mousemove       ->  touchmove
//mouseup         ->  touchend

export default {
  data() {
    return {
      value: '', //搜索关键字
      searchHotTags: [], //热门搜索标签
      searchSongData: [], //搜索的歌对象集合
      searchAlbumData: {}, //搜索的专辑对象
      searchArtistData: {}, //搜索的歌手对象
      allLoaded: false, //是否数据全部加载完毕
      total: 0, //总歌数量
      pageNum: 0 //当前第几页
    }
  },
  created() {
    this.getSeachHot();
  },
  methods: {
    keywordsHighLight(e) {
      var keywords = this.value;
      if(keywords == e){
        // var id = e.getAttribute('id');
        // var eve = document.getElementsByClassName('id');
        return e;
        //eve.style.color = '#507daf';
      }
      else{
        return e;
      }
    },
    getSeachHot() {
      getSeachHot({}).then((res) => {
        let { data } = res //let data = res.data;
        //console.log(data, 88)
        if (data.code == 200) {
          this.searchHotTags = data.result.hots
        }
      })
    },
    getSeach(keywords, type = 1, offset = 0) {
      //1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
      getSeach({
        params: {
          keywords,
          type,
          offset
        }
      }).then((res) => {
        let { data } = res //let data = res.data;
        //console.log(data, 88)
        if (data.code == 200) {
          if (type == 1) {
            //单歌
            if (offset == 0) {
              this.searchSongData = data.result.songs
            } else {
              this.searchSongData = this.searchSongData.concat(data.result.songs)
            }
            this.total = data.result.songCount;
          } else if (type == 100) {
            //歌手
            if (data.result.artists && data.result.artists.length > 0) {
              this.searchArtistData = data.result.artists[0]
            } else {
              this.searchArtistData = []
            }
          } else if (type == 10) {
            //专辑
            if (data.result.albums && data.result.albums.length > 0) {
              this.searchAlbumData = data.result.albums[0]
            } else {
              this.searchAlbumData = []
            }
          }
        }
      })
    },
    searchHotClick(value) {
      this.value = value;
      //console.log(value, 123)
    },
    loadTop() {
      console.log(111)
      this.getSeach(this.value, 1, 0) //单歌
      this.getSeach(this.value, 100, 0) //歌手
      this.getSeach(this.value, 10, 0) //专辑
                                                                            //这里写你代码，获取最新数据
      this.$refs.loadmoreNode.onTopLoaded()
    },
    loadBottom() {
      console.log(222)
      this.pageNum++
      this.getSeach(this.value, 1, this.pageNum * 30) //单歌
                                                                                //这里写你代码，加载更多数据
      if (this.total < this.pageNum * 30) {
        this.allLoaded = true // 若数据已全部获取完毕
      }
      this.$nextTick(() => {
        this.$refs.loadmoreNode.onBottomLoaded()
      })
    }
  },
  watch: {
    value(newval) {
      if (newval == '') return
      this.getSeach(newval, 1) //单歌
      this.getSeach(newval, 100) //歌手
      this.getSeach(newval, 10) //专辑
    },
  },
  components: {
    appNav
  }
}
</script>

<style lang="scss" scoped>
/deep/.search {
  height: auto;
  .mint-searchbar-inner,
  .mint-searchbar-core {
    background: #ebecec;
  }
  .mint-searchbar {
    display: flex;
    height: 60px;
    padding: 0;
    padding: 30px 20px 29px;
    box-sizing: content-box;
    background: #fff;
    border-bottom: 1px solid #e2e2e3;
  }
  .mint-searchbar-inner {
    height: 100%;
    padding: 0;
    border-radius: 30px;
    overflow: hidden;
  }
  .mintui-search {
    font-size: 26px; /*px*/
    margin: 0 18px;
  }
  .mint-search-list {
    padding-top: 222px;
    margin-bottom: 10px;
  }
  .mint-searchbar-cancel {
    position: absolute;
    right: 30px;
    top: 46px;
    display: flex;
    justify-content: center;
    color: #ebeceb;
    font-size: 14px; /*px*/
    font-weight: bold;
    width: 28px;
    height: 28px;
    background: #bcbdbd;
    border-radius: 50%;
    margin-right: 15px;
    line-height: 28px;
  }
  input[type='search']::-webkit-search-cancel-button {
    -webkit-appearance: none;
  }
}
.search-keywords {
  .title {
    font-size: 26px; /*px*/
    padding: 29px 0 5px 20px;
    color: #666;
    font-weight: normal;
  }
  .list {
    display: flex;
    flex-flow: wrap;
    padding: 0 20px;
    li {
      display: flex;
      align-items: center;
      height: 62px;
      border-radius: 32px;
      padding: 0 30px;
      font-size: 26px;
      color: #333;
      border: 1px solid #d3d4da; /*no*/
      margin-top: 16px;
      margin-right: 16px;
    }
  }
}
.search-list {
  background: #fff;
  .title {
    font-size: 22px; /*px*/
    color: #666;
    padding-left: 20px;
    font-weight: normal;
  }
}
.album,
.artist {
  display: flex;
  padding: 16px 0;
  width: 100%;
  .fa-angle-right {
    display: flex;
    align-items: center;
    color: #9b9b9b;
    font-size: 38px; /*px*/
    margin-right: 32px;
  }
}
.album-img,
.artist-img {
  width: 100px;
  height: 100px;
  margin-right: 34px;
}
.album-name,
.artist-name {
  margin-right: auto;
}
.artist-name {
  display: flex;
  align-items: center;
  font-size: 42px;
}
.album-realy-name {
  line-height: 56px;
  color: #333;
  font-size: 32px;
  
}
.album-artist-name {
  line-height: 34px;
  font-size: 22px; /*px*/
  color: #999;
}
</style>

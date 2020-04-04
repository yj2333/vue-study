<template>
  <div class="list_right">
      <div class="list_tit"><span><i>◆</i></span>您现在所在的位置：<router-link to="/">首页</router-link>&gt;产品列表</div>
        <div class="deatil">
          <h2>{{ detailData.title }}</h2>
            <span class="deatil_span">发布于：{{ parseDate(detailData.createDate) }}</span>
            <div style="margin-bottom: 30px;" v-html="detailData.content"></div>
        </div>
    </div>
</template>

<script>
import { parseDate } from '@/utils/date';
import { getProductDetail } from '@/api/product';

export default {
  data () {
    return {
      detailData: {},
    }
  },
  created(){
    this.getProductDetail();
  },
  methods: {
    parseDate,
    getProductDetail(){
      var _this = this;
      var id = _this.$route.params.id;//获取路径上的id值
      //console.log(id, _this.$route,998);
      getProductDetail({
        params: {
          id
        }
      }).then(function(res){
        var data = res.data.data;
        _this.detailData = data;
      }).catch(function(err){
        console.log(err);
      });
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

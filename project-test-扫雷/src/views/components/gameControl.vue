<template>
  <div class="control">
    <div class="item">时间：<el-input v-model="timetext" disabled></el-input></div>
    <div class="item">雷量：<el-input v-model="bombNum.bombCount" disabled></el-input></div>
    <el-button type="primary" @click="isShowDialog = true;">新建游戏</el-button>
    <el-tag type="danger" color="#F5A9BC" style="margin:4px 0 0 10px;">所有雷被标记才能获得胜利</el-tag>

    <el-dialog
      title="新建游戏"
      :visible.sync="isShowDialog"
      :close-on-click-modal="false">
      <el-form :model="formData">
        <el-form-item label="宽度">
          <el-input v-model.number="formData.width"></el-input>
        </el-form-item>
        <el-form-item label="高度">
          <el-input v-model.number="formData.height"></el-input>
        </el-form-item>
        <el-form-item label="雷数量">
          <el-input v-model.number="formData.bombCount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>


export default {
  props:{
    bombNum:{
      type:Object,
      default(){
        return {
          bombCount:0,
        }
      }
    }
  },
  data(){//储存数据
    return {
      isShowDialog: false,
      time: 0,
      timetext:'0',
      formData:{
        width: 10,
        height: 10,
        bombCount: 10,
      },
    };
  },
  methods: {//储存方法
    submit(){
      var data = JSON.parse(JSON.stringify(this.formData));//JSON.stringify将对象转为字符串;JSON.parse将字符串转为对象
      this.$emit('startGame',data);//通过$emit实现子传父
      this.isShowDialog = false;
      var _this = this;
      function Time_count(){
        _this.time = _this.time + 1;
        _this.timetext = _this.time.toString() + '秒';
        if(_this.time >= 60){
          _this.timetext = Math.floor(_this.time/60) + '分' + _this.time % 60;
        }
      }
      setInterval(Time_count,1000);
      this.bombNum.bombCount = 10;
    },
  },
  components: {//注册组建

  },
}
</script>

<style lang="scss" scoped>
.control{
  display: flex;
  justify-content: center;
  .item{
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin-right: 10px;
  }
}
/deep/{
  .el-input.is-disabled .el-input__inner{
    width: 100px;
  }
}
</style>

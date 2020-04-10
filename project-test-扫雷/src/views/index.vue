<template>
  <el-container>
    <el-header>
      <game-control @startGame="clickStartGame" :bombNum="bombNum"></game-control>
    </el-header>
    <el-main>
      <game-main :gameData="gameDataFromIndex" @bombCount="bombCount"></game-main>
    </el-main>
  </el-container>
</template>

<script>
import gameControl from '@/views/components/gameControl';
import gameMain from '@/views/components/gameMain';
export default {
  name: 'App',
  data(){//储存数据
    return {
      gameDataFromIndex: {},
      bombNum: {
        bombCount: 0
      },
    };
  },
  methods: {//储存方法
    clickStartGame(params){
      console.log(params,123);
      this.gameDataFromIndex = params;
    },
    bombCount(params){
      this.bombNum = params;
    }
  },
  components: {//注册组建
    gameControl,
    gameMain,
  },
}
</script>

<style lang="scss">
.el-header{
  display: flex;
  background: #ccc;
  align-items: center;
  justify-content: center;
}
</style>

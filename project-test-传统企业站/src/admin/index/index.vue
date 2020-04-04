<template>
  <div>
    这是后台页面首页
    <router-link to="/"><el-button type="primary">前台管理</el-button></router-link><br><br>
    <router-link to="/admin/index/us"><el-button type="primary">About Us</el-button></router-link><br><br>
    <p>首页的News和Products直接连接到数据库的id前几个</p>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

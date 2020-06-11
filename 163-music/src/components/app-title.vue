<template>
  <div class="title">
    <slot></slot>
  </div>
</template>

<script>


export default {

}
</script>

<style lang="scss" scoped>
.title{
  display: flex;
  align-items: center;
  height: 108px;
  font-size: 32px; /*px*/
  &:before{
    content: '';
    width: 4px;
    height: 31px;
    background: #d33a31;
    margin-right: 14px;
  }
}
</style>

<!--Created by fjl on 2018/10/16-->
<!--解锁中等待页面-->
<template>
  <div class="unlocking_screen">
    <h1>unlocking...</h1>
    <h4>please waiting {{countDown}}</h4>
  </div>
</template>

<script>
export default {
  name: 'unlocking-screen',
  data () {
    return {
      countDown: 2
    }
  }
}
</script>

<style lang="less" scoped>
  .unlocking_screen{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>

<!--Created by fjl on 2018/12/26-->
<!--ofo-关闭程序的按钮-->
<template>
  <img
    src="../../../../assets/images/ofo/home/close_ofo.png"
    class="ofo-close-button"
    @click="closeWebView"
  />
</template>

<script>
export default {
  methods: {
    // 离开当前webview
    closeWebView () {
      window.GseWallet.closeWebView()
    }
  }
}
</script>

<style lang="less" scoped>
  .ofo-close-button{
    position: fixed;
    right: 16px;
    top: 31px;
    width: 53px;
    height: 37px;
    z-index: 101;
  }
</style>

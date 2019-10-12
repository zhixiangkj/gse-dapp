<!--Created by fjl on 2018/11/4-->
<!--ofo-导航头-->
<template>
  <div :class="{ofo_nav_header: true, fixed: fixed}">
    <div class="status_bar"></div>
    <div class="nav">
      <ofo-back-button />
      <div class="title">
        {{typeof title === 'string' ? title : ($route.meta.title || '')}}
      </div>
    </div>
  </div>
</template>

<script>
import OfoBackButton from './OfoBackButton'
export default {
  props: {
    title: String,
    fixed: {
      type: Boolean,
      default: true
    }
  },
  components: {
    OfoBackButton
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scoped>
  .ofo_nav_header{
    width: 100%;
    height: 75px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    &.fixed{
      position: fixed;
      left: 0;
      top: 0;
      z-index: 99;
    }
    .status_bar{
      flex: 1;
    }
    .nav{
      flex: 0 58px;
      height: 58px;
      display: flex;
      justify-content: center;
      align-items: center;
      .title{
        font-size:21px;
        font-family:SFProText-Medium;
        font-weight:500;
      }
    }

  }
</style>

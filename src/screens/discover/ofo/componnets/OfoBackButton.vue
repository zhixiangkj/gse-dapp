<!--Created by fjl on 2018/11/4-->
<!--ofo-返回按钮-->
<template>
  <div @click="back"
    class="ofo_back_button">
    <img
      v-if="colorStyle === BACK_STYLE_DEFAULT"
      class="icon_back"
      src="../../../../assets/images/ofo/common/icons_back@2x.png"/>
    <img
      v-else
      class="icon_back"
      src="../../../../assets/images/ofo/common/icons_back_white@2x.png"
    />
  </div>
</template>
<script>
export const BACK_STYLE_DEFAULT = 'default' // 默认（黑色）
export const BACK_STYLE_LIGHT = 'light' // 白色
export default {
  props: {
    colorStyle: {
      type: String,
      default: BACK_STYLE_DEFAULT
    }
  },
  data () {
    return {
      BACK_STYLE_DEFAULT,
      BACK_STYLE_LIGHT
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
  .ofo_back_button{
    position: fixed;
    left: 4px;
    top: 23px;
    width: 58px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon_back {
      width: 23px;
      height: 21px;
    }
  }
</style>

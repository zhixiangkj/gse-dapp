<!--Created by fjl on 2018/10/31-->
<!--ofo-错误信息提示-->
<template>
  <div
    v-show="message"
    class="ofo_error_msg">{{message}}</div>
</template>

<script>
export default {
  props: {
    message: String | Number | undefined
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../assets/styles/vars";
  .ofo_error_msg{
    margin: 25px 0;
    color:@error-color;
    font-size: 15px;
    line-height: 18px;
  }
</style>

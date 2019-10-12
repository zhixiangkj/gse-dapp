<!--Created by fjl on 2018/10/31-->
<!--ofo-带下划线的输入框组件-->
<template>
  <div
    class="ofo_underline_input"
  >
    <input
      :style="inputStyle"
      class="input"
      ref="input"
      :type="type"
      :maxlength="maxlength"
      :placeholder="placeholder"
      v-model="myValue"/>
    <div class="separator_line"></div>
    <div
      v-show="myValue"
      class="clear_button"
      @click="clearText"
      @mousedown.prevent=""
    >
      <img
        class="clear_button_icon"
        src="../../../../assets/images/ofo/common/icons_clear@2x.png"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: String,
    maxlength: Number,
    type: String,
    value: String | Number | undefined,
    inputStyle: Object
  },
  data () {
    return {
      input: null,
      myValue: this.value
    }
  },
  watch: {
    value (v) {
      this.myValue = v
    },
    myValue (v) {
      this.$emit('input', v)
    }
  },
  methods: {
    clearText () {
      this.myValue = ''
    }
  },
  mounted () {
    this.input = this.$refs.input
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../assets/styles/vars";
  @import "../../../../assets/styles/mixins";
  .ofo_underline_input{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: stretch;
    .input{
      .placeholderColor();
      flex: 1;
      height: 46px;
      font-size:17px;
      font-family:SFProText-Semibold;
      font-weight:600;
      &:focus{
        & + .separator_line{
          background-color: @black-color;
          height: 2px;
        }
        & ~ .clear_button{
          display: flex;
        }
      }
    }
    .clear_button{
      flex: 0 23px;
      height: 23px;
      justify-content: center;
      align-items: center;
      display: none;
      .clear_button_icon{
        width: 16px;
        height: 16px;
      }
    }
    .separator_line{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: @separator-color;
    }
  }
</style>

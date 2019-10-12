<!--Created by fjl on 2018/10/29-->
<!--ofo-车牌号输入框-->
<template>
  <div
    @click="click"
    class="ofo_car_num_input">
    <input
      ref="input"
      v-model="myValue"
      type="number"
      oninput="
      if (value.length > length) {
        value = value.slice(0, length)
      }"
    />
    <ul class="digits">
      <li
        :key="item"
        v-for="item in length"
        :class="{digit: true, activated: isActivated(item)}"
      >{{myValue.length >= item ? myValues[item - 1] : ''}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    value: String | Number | undefined,
    length: {
      type: Number,
      default: 4
    }
  },
  data () {
    return {
      myValue: ''
    }
  },
  computed: {
    myValues () {
      return this.myValue.split('')
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
    click () {
      this.$refs.input.focus()
    },
    isActivated (item) {
      const str = this.myValue || ''
      if (str.length === item - 1) {
        return true
      }
      if (str.length === this.length && item === this.length) {
        return true
      }
      return false
    }
  },
  mounted () {
    this.$refs.input.focus()
  },
  created () {
    window.length = this.length
    this.myValue = this.value
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../assets/styles/vars";
  @import "../../../../assets/styles/mixins";
  .ofo_car_num_input{
    position: relative;
    input{
      position: absolute;
      width: 100%;
      height: 0;
      opacity: 0;
      left: -1000px;
    }
    .digits{
      display: flex;
      width: auto;
      .digit{
        font-size:21px;
        font-family:SFProText-Semibold;
        font-weight:600;
        height: 43px;
        width: 41px;
        line-height: 43px;
        text-align: center;
        margin-right: 9px;
        border-bottom: 1px solid @separator-color;
        &:nth-last-child(1){
          margin-right: 0;
        }
        &.activated{
          border-bottom: 2px solid @black-color;
        }
      }
    }
  }
</style>

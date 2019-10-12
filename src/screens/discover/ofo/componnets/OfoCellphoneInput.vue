<!--Created by fjl on 2018/10/28-->
<!--ofo-手机号输入框-->
<template>
  <div class="cellphone_input">
    <div @click="$router.push({name: 'SelectCountryScreen'})"
      class="select_country_button">
      <img
        class="national_flag"
        :src="src">
      <img
        class="down-arrow"
        src="../../../../assets/images/ofo/login/down-arrow@2x.png">
    </div>
    <span class="ccc">+{{country && country.ccc}}</span>
    <input
      ref="input"
      type="number"
      class="input"
      oninput="if (value.length > 11) value = value.slice(0, 11)"
      :placeholder="placeholder"
      v-model="myValue"/>
    <div class="separator_line"></div>
    <div
      v-show="myValue"
      class="clear_button"
      @click="clearText"
      @mousedown.prevent
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
    value: String,
    placeholder: String,
    country: Object
  },
  data () {
    return {
      myValue: ''
    }
  },
  computed: {
    src () {
      const code = this.country ? this.country.countryCode : ''
      return `../../../../../static/img/ofo/countryList/${code}.imageset/${code}@3x.png`
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
    this.$refs.input.focus()
  },
  created () {
    this.myValue = this.value
    $eventBus.$on('selectedCountry', (item) => {
      this.$emit('onCountrySelect', item)
    })
  }
}
</script>

<style lang="less" scoped>
  @import "../../../../assets/styles/mixins";
  .cellphone_input{
    position: relative;
    padding-bottom: 12px;
    display: flex;
    align-items: center;
    .select_country_button{
      display: flex;
      flex: 0;
      align-items: center;
      .national_flag{
        width: 29px;
        height: 21px;
      }
      .down-arrow{
        flex: 0 23px;
        height: 23px;
        margin-left: 2px;
        opacity: 0.4;
      }
    }
    .ccc{
      flex: 0 48px;
      text-align: right;
      font-size:17px;
      font-family:SFProText-Semibold;
      font-weight:600;
      line-height:21px;
    }
    .input{
      .placeholderColor();
      margin-left: 10px;
      margin-top: -2px;
      height: 23px;
      flex: 1;
      font-size:17px;
      font-family:SFProText-Semibold;
      font-weight:600;
      color:rgba(32,32,32,1);
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
      height: 23px;
      width: 23px;
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

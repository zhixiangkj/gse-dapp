<!--Created by fjl on 2018/10/25-->
<!--手机号录入页面-->
<template>
  <div class="login_cellphone_screen">
    <header class="back_image_container">
      <img
        class="back_image"
        src="../../../assets/images/ofo/login/login-back@2x.png" alt=""
      >
      <ofo-back-button
        color-style="light"
      />
      <div class="back_image_eyes">
        <div class="back_image_eye"></div>
        <div class="back_image_eye"></div>
      </div>
    </header>
    <main ref="main" class="content">
      <div class="tab_bar">
        <div
          @click="isLogin=false"
          :class="{tab_bar_item: true, activate: !isLogin}">
          Sign up
        </div>
        <div
          @click="isLogin=true"
          :class="{tab_bar_item: true, activate: isLogin}">
          Log in
        </div>
      </div>
      <div class="title">
        Enter your {{isLogin ? '' : 'Email address and '}}mobile number
      </div>
      <ofo-underline-input
        class="email_input"
        v-if="!isLogin"
        type="email"
        v-model="email"
        placeholder="Please enter email address"
      />
      <ofo-cellphone-input
        v-model="tel"
        :country="curCountry"
        @onCountrySelect="onCountrySelect"
        placeholder="Enter mobile number"
        class="cellphone_input"/>
      <ofo-error-msg :message="errorMsg"/>
      <div class="alert">
        By continuing, I confirm that I have read and agree to the
        <a>ofo Policy.</a>
      </div>
    </main>
    <x-button
      class="next_button"
      :disabled="tel.length === 0 || (!isLogin && email.length === 0)"
      type="primary"
      ref="next_btn"
      @click.native="finishCellphoneEnter">Next</x-button>
  </div>
</template>

<script>
import countryList from '../../../assets/js/countryList'
import OfoCellphoneInput from './componnets/OfoCellphoneInput'
import OfoUnderlineInput from './componnets/OfoUnderlineInput'
import OfoErrorMsg from './componnets/OfoErrorMsg'
import {XInput, XImg} from 'vux'
export default {
  components: {
    XInput,
    XImg,
    OfoCellphoneInput,
    OfoUnderlineInput,
    OfoErrorMsg
  },
  name: 'login-cellphone-screen',
  data () {
    return {
      email: '',
      tel: '',
      curCountry: null,
      errorMsg: '',
      isLogin: !this.$route.params.isSignUp
    }
  },
  watch: {
    isLogin () {
      this.errorMsg = ''
    }
  },
  computed: {
    src () {
      const {countryCode} = this.curCountry || {}
      return `../../../../static/img/ofo/countryList/${countryCode}.imageset/${countryCode}@3x.png`
    }
  },
  methods: {
    // 选择国家
    onCountrySelect (country) {
      this.curCountry = country
    },
    async getVerifyCode () {
      const {ccc, countryCode} = this.curCountry
      const {tel} = this
      const params = {
        tel,
        ccc,
        countryCode,
        type: this.isLogin ? 1 : 0 // 获取验证码, 1: 登录， 0: 注册
      }
      if (!this.isLogin) params.email = this.email
      try {
        this.$loading.show()
        this.errorMsg = ''
        const {OK, message} = await $API.ofo.getVerifyCode(params)
        this.$loading.hide()
        if (OK) {
          // 根据状态跳转登录后的页面
          const {query} = this.$route
          const {tel} = this
          const {ccc, countryCode} = this.curCountry
          const {email} = params
          this.$router.push({
            name: 'VerifyCodeScreen',
            params: {tel, ccc, countryCode, email},
            query})
        } else {
          this.errorMsg = message
        }
      } catch (e) {
        this.$loading.hide()
        this.$toast.text(e)
      }
    },
    // 完成手机号录入
    async finishCellphoneEnter () {
      // 获取验证码
      this.getVerifyCode()
    }
  },
  created () {
    const lans = navigator.language.split('-')
    if (lans.length > 1) {
      const countryCode = lans[1]
      this.curCountry = countryList[0]
      for (let i = 0; i < countryList.length; i++) {
        const item = countryList[i]
        if (item.countryCode === countryCode) {
          this.curCountry = item
          break
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../assets/styles/vars";
  @import "../../../assets/styles/mixins";
  .login_cellphone_screen{
    height: 100%;
    display: flex;
    flex-direction: column;
    .back_image_container{
      flex: 0 0 202px;
      height: 202px;
      position: relative;
      .back_image{
        width: 100%
      }
      .back_arrow{
        width: 23px;
        height: 23px;
        display: inline-block;
        position: absolute;
        top: 25px;
        left: 20px;
        z-index: 100;
      }
      .back_image_eyes{
        position: absolute;
        left: 38px;
        top: 76px;
        width: 116px;
        display: flex;
        justify-content: space-between;
        .back_image_eye{
          width: 24px;
          height: 24px;
          background-color: @black-color;
          border-radius: 12px;
        }
      }
    }
    .content{
      position: relative;
      padding: @default-padding;
      border-radius: 16px;
      flex: 1;
      min-height: 300px;
      background-color: #fff;
      .tab_bar{
        position: absolute;
        top: -58px;
        margin-left: -10px;
        .tab_bar_item{
          display: inline-block;
          color: fade(@black-color, 60%);
          padding: 10px;
          font-size:22px;
          font-weight: 400;
          &:nth-child(1){
            margin-right: 15px;
          }
          &.activate{
            color: @black-color;
            position: relative;
            font-family:SFProText-Bold;
            font-weight:bold;
          }
          &.activate:after{
            position: absolute;
            left: 0;
            right: 0;
            bottom: -13px;
            margin: auto;
            content: '';
            width: 0;
            width: 0;
            height: 0;
            border: 10px solid transparent;
            border-bottom-color: #fff;
          }
        }
      }
      .title{
        font-size:19px;
        font-family:SFProText-Light;
        font-weight:300;
        line-height:23px;
        color: @black-color;
      }
      .email_input{
        margin-top: 11px;
      }
      .cellphone_input{
        margin-top: 24px;
      }
      .alert{
        position: absolute;
        left: 0;
        padding: 0 @default-padding;
        bottom: @default-button-height + 24px;
        font-size:14px;
        color:#666;
        line-height:16px;
        a{
          font-family: SFProText-Semibold;
          font-weight: 500;
          color: #3D78FF;
        }
      }
    }
    .next_button{
      position: absolute;
      // top: 100%;
      // margin-top: -@default-button-height;
      bottom: 0;
      left: 0;
    }
  }
</style>

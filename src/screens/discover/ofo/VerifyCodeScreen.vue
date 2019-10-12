<!--Created by fjl on 2018/10/25-->
<!--验证码录入界面-->
<template>
  <div class="verify_code_screen">
    <ofo-back-button />
    <img class="back_image" src="../../../assets/images/ofo/login/login-back@2x.png" />
    <div class="main">
      <div class="title">
        Enter the verification code sent to you at
        <span class="cellphone">{{params.tel || ''}}</span>
      </div>
      <ofo-car-num-input
        v-model="code"
        :length="codeLength"
      />
      <div
        v-show="remain"
        class="summary">
        Send again in {{remain}}s
      </div>
      <div
        v-show="!remain">
        <div
          class="send_again"
          @click="sendAgain">
          Send again
        </div>
        <div class="check_alert">请检查电话是否错误</div>
      </div>
      <ofo-error-msg :message="errorMsg"/>
      <x-button
        class="go_button"
        type="primary"
        :disabled="code.length !== codeLength"
        @click.native="onGoClick">Go</x-button>
    </div>
  </div>
</template>

<script>
import XInput from 'vux/src/components/x-input/index'
import OfoCarNumInput from './componnets/OfoCarNumInput'
import OfoErrorMsg from './componnets/OfoErrorMsg'
import CountDown from '../../../utils/CountDown'
const COUNT_DOWN_TIME = 60 // 倒计时时间,单位秒
export default {
  name: 'login-verify-code-screen',
  components: {XInput, OfoCarNumInput, OfoErrorMsg},
  data () {
    return {
      code: '',
      codeLength: 4,
      params: {},
      remain: COUNT_DOWN_TIME, // 剩余时间
      isLogin: !this.$route.params.email,
      countDown: null,
      errorMsg: ''
    }
  },
  methods: {
    onGoClick () {
      if (this.isLogin) this.login()
      else this.register()
    },
    // 用户登录
    async login () {
      const {code, params} = this
      try {
        this.$loading.show()
        const {OK, message} = await this.$store.dispatch('login', {...params, code})
        this.$loading.hide()
        if (OK) {
          // 根据状态跳转登录后的页面
          const {to} = this.$route.query
          $app.goAndReplace({name: to || 'HomeScreen'}, -1)
        } else {
          this.errorMsg = message
        }
      } catch (e) {
        this.$loading.hide()
        this.$toast.text(e)
      }
    },
    // 注册
    async register () {
      const {code, params} = this
      try {
        this.$loading.show()
        const {OK, message} = await $API.ofo.register({...params, code})
        this.$loading.hide()
        if (OK) {
          this.$store.commit('setIsDeviceRegister', true)
          this.$router.go(-1)
          this.$toast.text('Registration is successful, please login')
        } else {
          this.errorMsg = message
        }
      } catch (e) {
        this.$loading.hide()
        this.$toast.text(e)
      }
    },
    // 重发验证码
    async sendAgain () {
      // 重新获取验证码
      try {
        this.$loading.show()
        this.errorMsg = ''
        const {OK, message} = await $API.ofo.getVerifyCode({...this.params, type: this.isLogin ? 1 : 0})
        this.$loading.hide()
        if (OK) {
          // 重置倒计时
          this.remain = COUNT_DOWN_TIME
          this.countDown.totalTime = this.remain
          this.countDown.start()
        } else {
          this.errorMsg = message
        }
      } catch (e) {
        this.$loading.hide()
        this.$toast.text(e)
      }
    }
  },
  mounted () {
    this.countDown = new CountDown(this.remain, (remain) => {
      remain = Math.round(remain)
      this.remain = remain < 0 ? 0 : remain
    })
    this.countDown.start()
  },
  created () {
    this.params = this.$route.params
  }
}
</script>

<style lang="less" scoped>
  .verify_code_screen{
    height: 100%;
    display: flex;
    .back_image{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      margin: auto;
      transform: translateY(-77%);
      z-index: -1;
    }
    .main{
      flex: 1;
      margin-top: 76px;
      background-color: #fff;
      border-radius: 16px;
      min-height: 200px;
      padding: @default-padding;
      position: relative;
      .title{
        font-size:19px;
        font-family:SFProText-Light;
        font-weight:300;
        line-height:23px;
        margin-bottom: 4px;
        .cellphone {
          font-family: SFProText-Semibold;
          font-weight: 500;
        }
      }
      .summary{
        opacity: 0.4;
        margin-top: 22px;
      }
      .send_again{
        display: inline-block;
        font-size:17px;
        margin: 22px 0 18px;
        font-family:SFProText-Semibold;
        font-weight:600;
        color:rgba(61,120,255,1);
        line-height:20px;
      }
      .check_alert{
        font-size:14px;
        color:fade(@black-color, 40%);
        line-height:20px;
      }
      .go_button{
        position: fixed;
        top: 100%;
        left: 0;
        font-family:SFProText-Semibold;
        font-weight:600;
        margin-top: -@default-button-height;
      }
    }
  }
</style>

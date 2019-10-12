<!--Created by fjl on 2018/10/16-->
<!--ofo编号手动录入页面-->
<template>
  <div class="typing_screen">
    <ofo-nav-header :fixed="true"/>
    <header class="typing_header">
      <div class="manual_operation">
        <div class="icon_box">
          <img
            src="../../../assets/images/ofo/scanning/fill-car-num-black@2x.png"
            class="icon" />
        </div>
        <div class="title">Bike Number</div>
      </div>
      <div class="light_on" @click="turnLight">
        <div v-if="this.$store.state.isLightOn">
          <div class="icon_box lightOn_background">
            <img
              src="../../../assets/images/ofo/scanning/light-up-02.png"
              class="icon" />
          </div>
          <div class="title">
            Turn Off
          </div>
        </div>
        <div v-else>
          <div class="icon_box">
            <img
              src="../../../assets/images/ofo/scanning/light-up@2x.png"
              class="icon" />
          </div>
          <div class="title">
            Turn On
          </div>
        </div>
      </div>
    </header>
    <main class="typing_main">
      <div class="ofo_num_input_container">
        <div
          v-show="carno.length === 0"
          class="ofo_num_input_placeholder">Enter The Bike Number</div>
        <input
          :class="{ofo_num_input: true, error: errorMsg && errorMsg.length > 0}"
          ref="ofoNumInput"
          v-model="carno"
          type="number"
          oninput="if (value.length > 8) {value = value.slice(0, 8)}"
          :show-clear="false" />
      </div>
      <div
        v-show="errorMsg"
        class="alert_msg">{{errorMsg}}</div>
    </main>
    <x-button
      class="get_code_button"
      type="primary"
      @click.native="getUnlockCode"
      :disabled="carno.length < 6"
    >GET THE LOCK CODE</x-button>
  </div>
</template>

<script>
import {XInput} from 'vux'
import {ofoUnlock} from './utils'
export default {
  name: 'typing-screen',
  components: {
    XInput
  },
  data () {
    return {
      carno: '',
      errorMsg: ''
    }
  },
  methods: {
    // 获取ofo车辆的解锁码
    getUnlockCode () {
      const {carno} = this
      // 关闭提示信息
      this.errorMsg = ''
      ofoUnlock(carno).then().catch((e) => {
        this.errorMsg = e.message
      })
    },
    turnLight () {
      const lampState = this.$store.state.isLightOn
      this.$store.dispatch('controlLight', lampState)
    }
  },
  mounted () {
    this.$refs.ofoNumInput.focus()
  },
  activated () {
  },
  deactivated () {
    this.$store.dispatch('controlLight', true)
  },
  destroyed () {
  }

}
</script>

<style lang="less" scoped>
  @import "../../../assets/styles/vars";
  @import "../../../assets/styles/mixins";
  .typing_screen{
    height: 100%;
    display: flex;
    flex-direction: column;
    background-image: url("../../../assets/images/ofo/typing/typing_background@2x.png");
    background-size: 100%;
    background-repeat: no-repeat;
    margin-top: 75px;
    .typing_header{
      flex: 0 135px;
      min-height: 135px;
      display: flex;
      justify-content: space-around;
      .manual_operation, .light_on{
        padding-top: 24px;
        text-align: center;
        color: white;
        .icon_box{
          height: 59px;
          width: 59px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
          border-radius: 29.5px;
          margin-bottom: 12px;
          background-color:rgba(255,255,255,0.4);
           background-color: @primay-color;
        }
        .title{
          font-size:14px;
          font-family:SFProText-Semibold;
          font-weight:600;
          color:rgba(255,255,255,1);
          line-height:16px;
        }
      }
      .manual_operation{
        .icon{
          height: 23px;
          width: 23px;
        }
      }
      .light_on{
        .icon_box{
          background:fade(#fff, 40%);
          .icon{
            height: 23px;
            width: 13px;
          }
        }
        .lightOn_background{
          background:rgba(0,0,0,0.4);
        }
        .title{
          color:fade(#fff, 80%);
        }
      }
      .manual_operation{
        position: relative;
        &::after{
          content: '';
          position: absolute;
          bottom: -0.5px;
          left: 0;
          right: 0;
          margin: auto;
          display: block;
          border: 10px solid transparent;
          border-bottom-color: #fff;
          height: 0px;
          width: 0px;
        }
      }
    }
    .typing_main{
      flex: 1;
      background-color: #fff;
      border-radius: 16px;
      min-height: 210px;
      padding-top: 58px;
      .ofo_num_input_container{
        position: relative;
        font-family:SFProText-Regular;
        width: 315px;
        margin: auto;
        .ofo_num_input{
          width: 100%;
          // height: 71px;
          line-height: 30px;
          background:fade(@primay-color, 5%);
          border: 2px solid @primay-color;
          border-radius: 12px;
          letter-spacing: 10px;
          font-weight: 600;
          font-size: 40px;
          text-align: center;
          vertical-align: center;
          padding: 15px 0;
          text-shadow: none;
          appearance: none;
          &.error{
            background:fade(@error-color, 5%);
            border: 2px solid @error-color;
          }
        }
        .ofo_num_input_placeholder{
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          height: 22px;
          line-height: 22px;
          height: 0px;
          transform: translateY(-9.5px);
          overflow: visible;
          text-align: center;
          font-size:19px;
          color: rgba(32, 32, 32, 0.4);
        }
      }
      .alert_msg{
        margin: 8px 30px;
        color:rgba(241,76,100,1);
        font-size: 15px;
        line-height: 18px;
      }
    }
    .get_code_button{
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
  }
</style>

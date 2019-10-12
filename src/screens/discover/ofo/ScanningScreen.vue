<template>
  <div class="cordova_example_screen">
    <ofo-back-button
      color-style="light"
    />
    <div class="gse_scan_line_container">
      <div class="square sq01"></div>
      <div class="square sq02"></div>
      <div class="square sq03"></div>
      <div class="square sq04"></div>
      <img src="../../../assets/images/ofo/scanning/scanning-line@2x.png"/>
    </div>
    <div class="topMak"></div>
    <div class="bottomMak"></div>
    <div class="scanning_footer">
      <div class="manual_operation">
        <div @click="$router.push({name: 'TypingScreen'})"
          class="icon_box">
          <img
            class="icon"
            src="../../../assets/images/ofo/scanning/fill-car-num@2x.png"
          />
        </div>
        <div class="title">Bike Number</div>
      </div>
      <div class="light_on" @click="turnLight">
        <div v-if="this.$store.state.isLightOn">
          <div class="icon_box lightOn_background">
            <img
              class="icon"
              src="../../../assets/images/ofo/scanning/light-up-02.png"
            />
          </div>
          <div class="title">Turn Off</div>
        </div>
        <div v-else>
          <div class="icon_box">
            <img
              class="icon"
              src="../../../assets/images/ofo/scanning/light-up@2x.png"
            />
          </div>
          <div class="title">Turn On</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {REG_EXP_DIGIT_ONLY} from '../../../utils/regExp'
import {ofoUnlock} from './utils'
// 节流函数: 防止函数高频调用
export const throttle = (func, time = 300) => {
  let canRun = true
  return (data) => {
    if (!canRun) return
    func(data)
    canRun = false
    setTimeout(function () {
      canRun = true
    }, time)
  }
}
export default {
  name: 'newScanning-screen',
  data () {
    return {
      canRun: true,
      isScanning: false,
      isLocating: false,
      watchID: null,
      qrcodeStr: null,
      paths: []
    }
  },
  created () {
  },
  mounted () {
    this.useScanner()
    this.stopTouch()
  },
  methods: {
    // 扫码
    useScanner () {
      const displayContents = (err, text) => {
        console.log(err, text)
        if (err) {
          // an error occurred, or the scan was canceled (error code `6`)
          window.QRScanner.scan(displayContents)
        } else {
          // The scan completed, display the contents of the QR code:
          this.qrcodeStr = text
          if (this.qrcodeStr) {
            console.log('有号码')
            this.useCodeNum()
          }
        }
      }
      window.QRScanner.scan(displayContents)
      // Make the webview transparent so the video preview is visible behind it.
      window.QRScanner.show((result) => {
        console.log('result', result)
      })
    },
    cancelScanner () {
      window.QRScanner.cancelScan((status) => {
        console.log(status)
      })
    },
    destroyScanner () {
      window.QRScanner.destroy((status) => {
        console.log(status)
      })
    },
    async useCodeNum () {
      //  获取车牌号
      var arr = this.qrcodeStr.split('/')
      console.log('codeArr:', arr)
      var carno = arr[arr.length - 1]
      const cl = carno.length
      if (!carno.match(REG_EXP_DIGIT_ONLY) || cl < 6 || cl > 8) { // 车牌号不满足ofo的规则
        this.$toast.text('License plate number does not exist')
        setTimeout(() => {
          this.useScanner()
        }, 2000)
        return
      }
      ofoUnlock(carno).then().catch((e) => {
        this.$toast.text(e.message)
      }).finally(() => {
        this.useScanner()
      })
    },
    turnLight () {
      const lampState = this.$store.state.isLightOn
      this.$store.dispatch('controlLight', lampState)
    },
    back () {
      this.$router.go(-1)
    },
    mo (e) {
      e.preventDefault()
      e.stopPropagation()
    },
    stopTouch () {
      document.body.addEventListener('touchmove', this.mo, { passive: false })
    },
    moveTouch () {
      document.body.removeEventListener('touchmove', this.mo, { passive: false })
    }
  },
  activated () {
    this.stopTouch()
    this.useScanner()
  },
  deactivated () {
    this.moveTouch()
    this.destroyScanner()
    this.$store.dispatch('controlLight', true)
  },
  destroyed () {
  }
}
</script>

<style lang="less" scoped>
  h1, h2, h3, h4, h5, h6{
    margin: 0;
  }
  .ofo_back_button{
    position: fixed;
    left: 4px;
    top: 23px;
    width: 58px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 300;
    .icon_back {
      width: 23px;
      height: 23px;
    }
  }
  @border-color: #FFE300;
  @border-width: 5px;
  .cordova_example_screen {
    .tempBtn{
      text-align: center;
      margin-top: 100px;
      position: relative;
      z-index: 200;
    }
    .result{
      margin-top: 20px;
      background-color: #eee;
      padding: 10px 0;
    }
    .topMak{
      width: 100vw;
      height: 30%;
      position: absolute;
      top:0;
      left: 0;
      background: #000;
      opacity: 0.8;
    }
    .gse_qrcode_overlay{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      background-color: transparent;
    }
    .bottomMak{
      width: 100vw;
      height: 30%;
      position: absolute;
      bottom:0;
      left: 0;
      background: #000;
      opacity: 0.8;
    }
    .gse_scan_line_container{
        @keyframes loop {
        form {
          top: 0;
        }
        to {
          top: 185px;
        }
      }
      width: 200px;
      height: 200px;
      background: transparent;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -100px;
      margin-left: -100px;
      z-index: 200;
      overflow: hidden;
      .square{
        width:30px;
        height:30px;
        position: absolute;
        border-style: solid;
        border-color: @border-color;
        border-width: 0;
      }
      .sq01{
        top: 0px;
        left: 0px;
        border-top-width: @border-width;
        border-left-width: @border-width;
      }
      .sq02{
        top: 0px;
        right: 0px;
        border-top-width: @border-width;
        border-right-width: @border-width;
      }
      .sq03{
        left: 0px;
        bottom: 0px;
        border-left-width: @border-width;
        border-bottom-width: @border-width;
      }
      .sq04{
        right: 0px;
        bottom: 0px;
        border-right-width: @border-width;
        border-bottom-width: @border-width;
      }
      img{
        position: absolute;
        height: 12px;
        width: 98%;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: loop 2s ease-in-out infinite;
      }
    }
    .scanning_footer{
      position: absolute;
      z-index: 100;
      bottom:44px;
      left: 0;
      right: 0;
      width: 80%;
      margin: auto;
      display: flex;
      justify-content: space-around;
      .manual_operation, .light_on{
        text-align: center;
        color: white;
        flex: 1;
        .icon_box{
          margin: auto;
          height: 59px;
          width: 59px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 29.5px;
          margin-bottom: 12px;
          background:rgba(255,255,255,0.4);
        }
        .lightOn_background{
          background:rgba(0,0,0,0.4);
        }
        .title{
          font-size: 14px;
          font-weight: 400;
          font-family: SFProText-Regular;
        }
      }
      .manual_operation{
        .icon{
          width: 23px;
          height: 23px;
        }
      }
      .light_on{
        .icon{
          width: 17px;
          height: 30px;
        }
      }
    }
  }
</style>

<!--Created by fjl on 2018/10/16-->
<!--骑行中的页面-->
<template>
  <div class="riding_screen">
    <ofo-close-button />
    <header class="header">
      <div class="container">
        <div v-if="!isShowUnlockCode" class="title">
          Push the lever of the lock to end the trip.
        </div>
        <template v-else>
          <div class="title color-before-title">
            Safety Policy
          </div>
          <div class="summary">
            For your safety and the safety of others, please be reminded to ride safely and in accordance with applicable cycling and traffic laws and regulations.
          </div>
        </template>
      </div>
    </header>
    <main class="map_container">
      <ofo-google-map
        class="map"
        ref="map"
        :type="ofoMapType"
        @mapCreated="isMapCreated=true">
      </ofo-google-map>
      <div
        @click="$refs.map.reLocate()"
        class="location"
        v-show="isMapCreated"
      >
        <img
          class="icon"
          src="../../../assets/images/ofo/riding/location@2x.png" />
      </div>
    </main>
    <footer class="footer">
      <div v-if="!isShowUnlockCode"
        class="container">
        <div class="title_container">
          <img
            class="icon"
            src="../../../assets/images/ofo/riding/riding@2x.png" />
          <div class="title">
            Riding Time
          </div>
        </div>
        <div class="riding_time">
        <span class="hour">
          {{ridingTime.H > 99 ? '99+': (ridingTime.H + '').padStart(2, 0)}}
        </span>
          <span class="minute_and_seconds">
          :{{(ridingTime.M + '').padStart(2, 0)}}:{{(ridingTime.S + '').padStart(2, 0)}}
        </span>
        </div>
        <div class="ask">
          Current costs&nbsp;<div class="money">{{currency}}{{costs}}</div>
        </div>
      </div>
      <div v-else
           class="container unlocked_code">
        <div class="title">Code for Bike No.{{carno}}
        </div>
        <div class="code">
          <div
            class="code_char"
            v-for="(item, index) in pwd.split('')"
            :key="index.toString()"
          >
            <div>{{item}}</div>
          </div>
        </div>
        <div class="ask">
          Don’ t know how to unlock?
        </div>
      </div>
      <div class="buttons">
        <div>
          <x-button class="button">REPIR NEEDED</x-button>
        </div>
        <div>
          <x-button
            @click.native="showPopup=true"
            class="button"
          >TRIP COMPLETED</x-button>
        </div>
      </div>
    </footer>
    <popup
      v-model="showPopup"
      :hide-on-blur="false"
    >
      <div class="end_popup">
        <img
          src="../../../assets/images/ofo/riding/end_background@2x.png"
          class="end_background"
        />
        <div class="content">
          <div class="title">Enjoying ofo?</div>
          <div class="summary">Make sure the lock is closed before ending your trip.</div>
          <div class="buttons">
            <div>
              <x-button
                class="button cancel"
                @click.native="showPopup=false">Cancel</x-button>
            </div>
            <div>
              <x-button
                @click.native="endTrip"
                class="button confirmed"
                type="primary">Confirmed</x-button>
            </div>
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import OfoGoogleMap, {ofoMapType} from './componnets/OfoGoogleMap'
import OfoCloseButton from './componnets/OfoCloseButton'
import {Popup} from 'vux'
import {endTrip} from './utils'
export default {
  name: 'riding-screen',
  components: {OfoGoogleMap, Popup, OfoCloseButton},
  data () {
    return {
      ridingTime: {
        H: 0,
        M: 0,
        S: 0
      },
      showPopup: false,
      isMapCreated: false,
      ofoMapType: ofoMapType.RIDING_ROUTE,
      // 定时器
      timer: null
    }
  },
  computed: {
    // 货币符号
    currency () {
      const {unFinishedOrder} = this.$store.getters
      if (unFinishedOrder && unFinishedOrder.currency) {
        return unFinishedOrder.currency.replace('S', '')
      }
      return '￥'
    },
    // 花费
    costs () {
      const {unFinishedOrder} = this.$store.getters
      if (unFinishedOrder && unFinishedOrder.price) {
        return unFinishedOrder.price
      }
      return 0
    },
    // 是否显示解锁码
    isShowUnlockCode () {
      const {H, M} = this.ridingTime
      return (M === 0 && H === 0)
    },
    // 车牌号
    carno () {
      const {unFinishedOrder} = this.$store.getters
      return unFinishedOrder ? unFinishedOrder.carno : ''
    },
    // 密码
    pwd () {
      const {unFinishedOrder} = this.$store.getters
      return unFinishedOrder ? unFinishedOrder.pwd : ''
    }
  },
  methods: {
    // 结束骑行
    async endTrip () {
      const {map} = this.$refs
      try {
        await endTrip(map.waypoints)
        // 导航到订单支付页面
        this.$toast.text('End trip successfully')
        this.$router.push({name: 'OrderScreen'})
      } catch (e) {
        console.error(e)
      }
    },
    // 获取骑行时间
    getRidingTime (unFinishedOrder) {
      if (!unFinishedOrder) return
      const {orderTimeLen = 0, lock: {datetime}} = unFinishedOrder
      // 计算骑行时间
      const ridingTime = new Date().getTime() - datetime + orderTimeLen * 1000
      const ss = Math.round(ridingTime / 1000)
      const s = ss % 60
      const mm = parseInt(ss / 60)
      const m = mm % 60
      const hh = parseInt(mm / 60)
      // const h = hh % 24
      // const dd = parseInt(hh / 24)
      this.ridingTime.H = hh
      this.ridingTime.M = m
      this.ridingTime.S = s
    },
    // 定时请求未完成订单
    async timingUnfinishedRequest () {
      let time = 0 // 定时器记时，不大于refreshTime
      this.timer = setInterval(async () => {
        const {unFinishedOrder} = this.$store.getters
        if (unFinishedOrder) {
          this.getRidingTime(unFinishedOrder)
          // 计算骑行时间
          const {refreshTime} = unFinishedOrder
          // 每隔refreshTime秒获取一下未完成订单
          time = time % refreshTime
          if (time === 0) {
            this.$store.dispatch('asyncGetUnFinishedOrderNo')
          }
          time++
        }
      }, 1000)
    }
  },
  created () {
    const {unFinishedOrder} = this.$store.getters
    if (unFinishedOrder) this.getRidingTime(unFinishedOrder)
    this.timingUnfinishedRequest()
    $eventBus.$on('orderPaid', () => {
      $app.setRootRoute({name: 'HomeScreen'})
    })
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
</script>

<style lang="less" scoped>
  @import "../../../assets/styles/vars";
  .riding_screen{
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    .header{
      flex: 0;
      position: relative;
      .container{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        min-height: 84px;
        background-color: #fff!important;
        border-radius:0px 0px 16px 16px;
        box-shadow:0px 1px 23px 0px rgba(0,0,0,0.1);
        padding: 31px 16px 12px;
        z-index: 2;
        height: auto;
        .title{
          line-height: @primay-color + 3px;
          font-family:SFProText-Semibold;
          font-weight:600;
          position: relative;
        }
        .color-before-title{
          &:before{
            content: '';
            position: absolute;
            left: -16px;
            top: 3px;
            width:4px;
            height:12px;
            background:rgba(255,227,0,1);
            border-radius:0px 3px 3px 0px;
          }
        }
        .summary{
          margin-top: 6px;
          font-size:15px;
          line-height:18px;
          color: fade(@black-color, 60%);
        }
      }
    }
    .map_container {
      flex: 1;
      position: relative;
      .map{
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        margin: auto;
      }
      .location{
        position: absolute;
        right: 10px;
        bottom: 10px;
        width: 49px;
        height: 49px;
        background: #fff;
        box-shadow:0px 2px 16px 0px rgba(0,0,0,0.1);
        border-radius:12px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2;
        .icon{
          width: 23px;
          height: 23px;
          opacity: 0.55;
        }
      }
    }
    .footer{
      flex: 0 270px;
      position: relative;
      background-color: transparent;
      .container{
        position: absolute;
        bottom: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background-color: #fff;
        border-radius:16px 16px 0px 0px;
        box-shadow:0px -1px 23px 0px rgba(0,0,0,0.1);
        .title_container{
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 23px 0;
          .icon{
            width: 23px;
            height: 23px;
            margin-right: 10px;
          }
        }
        .title{
          text-align: center;
          font-size:19px;
          font-family:SFProText-Semibold;
          font-weight:600;
          line-height:23px;
        }
        .riding_time{
          display: flex;
          justify-content: center;
          align-items: center;
          font-size:67px;
          height: 67px;
          margin: 27px 0 20px;
          font-weight: 500;
          font-family:DINMittelschriftStd;
          .hour{
            color: @separator-color;
          }
        }
        .ask{
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          margin-bottom: 21px;
          font-size:15px;
          line-height:18px;
          color: fade(@black-color, 60%);
          .money{
            color: @black-color;
            font-size:19px;
          }
        }
        &.unlocked_code{
          .title{
            margin: 23px 0;
          }
          .code{
            display: flex;
            margin: 0 26px;
            justify-content: space-between;
            .code_char{
              font-size:56px;
              font-family:DINMittelschriftStd;
              font-weight: 600;
              height: 71px;
              width: 71px;
              line-height: 71px;
              text-align: center;
              border-radius: 10px;
              background-color: @primay-color;
            }
          }
          .ask{
            margin: 21px 0;
          }
        }
      }
      .buttons{
        position: absolute;
        left: 0;
        bottom: 18px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 26px;
        .button{
          flex: 1;
          font-size:14px;
          font-family:SFProText-Semibold;
          font-weight:600;
          color:rgba(32,32,32,1);
          height: 53px;
          line-height: 53px;
          width: 157px;
          border-radius:12px;
          border:1px solid @separator-color;
        }
      }
    }
    .end_popup{
      height: 286px;
      display: flex;
      flex-direction: column;
      .end_background{
        flex: 0 90px;
        width: 100%;
        margin: 0;
      }
      .content{
        overflow: hidden;
        flex: 1;
        background-color: #fff;
        padding: 24px;
        .title{
          font-size:21px;
          font-family:SFProText-Semibold;
          font-weight:600;
        }
        .summary{
          color: fade(@black-color, 60%);
          line-height:20px;
          margin: 12px 0 24px;
        }
        .buttons{
          display: flex;
          align-items: center;
          justify-content: space-between;
          div{
            flex: 1;
            &:nth-child(1) {
              margin-right: 13px;
            }
          }
          .button{
            border-radius: 12px;
            height: 53px;
            &.cancel{
              line-height: 51px;
            }
          }
        }
      }
    }
  }
</style>

<!--Created by fjl on 2018/12/29-->
<!--订单页面-->
<template>
  <div class="order_screen">
    <ofo-nav-header :fixed="false"/>
    <ofo-trip-cost-view class="ofo-trip-cost" :order="order"/>
    <div class="order">
      <div>
        订单编号：{{order.orderno}}
      </div>
      <div>
        车牌号：{{order.carno}}
      </div>
      <div>
        骑行时间：{{rideTime}}
      </div>
    </div>
    <x-button
      class="pay_button"
      type="primary"
      @click.native="handlePayButtonClick"
      >Pay</x-button>
  </div>
</template>

<script>
import OfoTripCostView from './views/OfoTripCostView'
import {payOrder} from './utils'
export default {
  components: {OfoTripCostView},
  data () {
    return {

    }
  },
  computed: {
    // 订单
    order () {
      return this.$store.getters.unFinishedOrder || {}
    },
    // 骑行时间
    rideTime () {
      if (this.order && this.order.t) {
        // 计算骑行时间
        const ss = this.order.t
        const s = ss % 60
        const mm = parseInt(ss / 60)
        const m = mm % 60
        const hh = parseInt(mm / 60)
        const time = `${String(hh).padStart(2, 0)}:${String(m).padStart(2, 0)}:${String(s).padStart(2, 0)}`
        return time
      }
      return '00:00:00'
    }
  },
  methods: {
    // 点击"Pay"按钮
    async handlePayButtonClick () {
      const {unFinishedOrder} = this.$store.getters
      if (unFinishedOrder) {
        const params = {
          amount: unFinishedOrder.price // 付款金额 （必选）
          // country: 'US', // 国家 （可选， 默认US）
          // currency: 'usd' // 货币 （可选，默认usd:美元）
        }
        window.GseWallet.pay(params, async (result) => {
          const {code, message, data} = result
          switch (code) {
            case 0 : // 支付成功
              this.handlePaySuccess(unFinishedOrder)
              break
            case 1 : // 支付取消

              break
            case 2 : // 支付失败

              break
          }
          console.log(message)
          console.log(data)
        }, (err) => {
          console.log(err)
        })
      }
    },
    // 处理付款成功
    async handlePaySuccess (unFinishedOrder) {
      try {
        await payOrder(unFinishedOrder.orderno)
        this.$toast.text('Order payment successful')
        this.$store.commit('setUnFinishedOrder', null)
        // 广播"订单支付完成"
        $eventBus.$emit('orderPaid')
        $app.$router.back()
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .order_screen{
    flex: 1;
    background-color: #eee;
    position: relative;
    .pay_button{
      position: absolute;
      bottom: 0;
    }
    .order{
      padding: 24px;
      div{
        margin-bottom: 10px;
      }
    }
    .ofo-trip-cost{
      position: absolute;
      bottom: 50px;
      width: 100%;
    }
  }
</style>

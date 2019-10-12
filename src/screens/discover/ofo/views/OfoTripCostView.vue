<!--Created by fjl on 2019/1/2-->
<template>
  <div class="ofo_trip_cost_view">
    <div class="trip_cost">
      <div class="title">
        The Trip Cost
      </div>
      <div class="cost">
        {{currency}}{{price}}
      </div>
    </div>
    <div class="unlock_fee">
      <div class="title">
        Unlock Fee
      </div>
      <div class="cost">
        {{currency}}{{unlockPrice}}
      </div>
    </div>
    <div class="ride_time_fee">
      <div class="title">
        Ride Time Fee {{`(${rideTime})`}}
      </div>
      <div class="cost">
        {{currency}}{{rideTimePrice}}
      </div>
    </div>
    <div class="coupon">
      <div class="title">
        Coupon
      </div>
      <div class="cost">
        -{{currency}}{{coupon}}
      </div>
    </div>
    <div class="penalty">
      <div class="title">
        Penalty
      </div>
      <div class="cost">
        +{{currency}}{{penaltyPrice}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    // 骑行时间
    rideTime () {
      if (this.order && this.order.t) {
        // 计算骑行时间
        const ss = this.order.t
        const mm = parseInt(ss / 60)
        const m = mm % 60
        const hh = parseInt(mm / 60)
        if (!hh && !m) {
          return '1 min'
        }
        if (!hh) {
          return `${m} min`
        }
        return `${hh} hour and ${m} min`
      }
      return '0 min'
    },
    // 货币符号
    currency () {
      if (this.order && this.order.currency) {
        return this.order.currency.replace('S', '')
      }
      return '￥'
    },
    // 价格
    price () {
      if (this.order && this.order.price) {
        return this.order.price
      }
      return 0
    },
    // 开锁费
    unlockPrice () {
      if (this.order && this.order.unlockPrice) {
        return this.order.unlockPrice
      }
      return 0
    },
    // 骑行费
    rideTimePrice () {
      if (this.order && this.order.rideTimePrice) {
        return this.order.rideTimePrice
      }
      return 0
    },
    // 赠券
    coupon () {
      if (this.order && this.order.coupon) {
        return this.order.coupon
      }
      return 0
    },
    // 罚金
    penaltyPrice () {
      if (this.order && this.order.penaltyPrice) {
        return this.order.penaltyPrice
      }
      return 0
    }
  },
  created () {
    console.log(this.order)
  }
}
</script>

<style lang="less" scoped>
  .ofo_trip_cost_view{
    border-radius: 16px;
    padding: 30px 24px;
    background-color: #fff;
    >div{
      display: flex;
      justify-content: space-between;
      font-size:15px;
      margin-bottom: 28px;
    }
    .trip_cost{
      font-size: 19px;
      margin-bottom: 40px;
      .title{
        font-weight:600;
      }
      .cost{
        color:rgba(61,120,255,1);
      }
    }
    .unlock_fee{
      color:rgba(32,32,32,0.6);
      .cost{
        font-weight: 600;
      }
    }
    .ride_time_fee{
      color:rgba(32,32,32,0.6);
      .cost{
        font-weight: 600
      ;
      }
    }
    .coupon{
      color:rgba(61,120,255,1);
      .cost{
      }
    }
    .penalty{
      color:rgba(241,76,100,1);
      .cost{

      }
      margin-bottom: 0;
    }
  }
</style>

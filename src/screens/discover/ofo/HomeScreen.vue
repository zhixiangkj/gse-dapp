<!--
Created by fjl on 2018/10/16
ofo入口页面
-->
<template>
  <div class="home_screen">
    <div @click="clickPerson" class="ofo_logo_container">
      <img
        src="../../../assets/images/ofo/home/portrait@2x.png"
        class="ofo_logo"
      />
      <div v-if="!$store.getters.token" class="ofo_login_status">
        {{$store.getters.isDeviceRegister ? 'Please log in' : 'Not logged in'}}
      </div>
      <div class="ofo_login_status" v-else>
        Has logged
      </div>
    </div>
    <ofo-close-button />
    <!--ofo单车的位置地图-->
    <div class="ofo_location_map">
      <ofo-google-map
        class="map"
        ref="map"
        :type="ofoMapType"
      ></ofo-google-map>
    </div>
    <!--ofo用户开锁面板-->
    <footer class="footer">
      <div class="ofo_operation_panel">
        <div class="ofo_operation_buttons">
          <!--重定位-->
          <img
            src="../../../assets/images/ofo/home/location@2x.png"
            class="ofo_operation_locate"
            @click="clickRelocate"
          />
          <!--解锁-->
          <img
            src="../../../assets/images/ofo/home/unlock@2x.png"
            class="ofo_operation_unlock"
            @click="$router.push({name: 'ScanningScreen'})"
          />
          <!--报修-->
          <img
            @click="handleRepairButtonClick"
            src="../../../assets/images/ofo/home/repairs@2x.png"
            class="ofo_operation_setting" />
        </div>
        <img
          src="../../../assets/images/ofo/home/share-your@2x.png"
          class="ofo_bottom_pic"
        />
      </div>
    </footer>
  </div>
</template>

<script>
import OfoGoogleMap, {ofoMapType} from './componnets/OfoGoogleMap'
import OfoCloseButton from './componnets/OfoCloseButton'
export default {
  name: 'home-screen',
  components: {OfoGoogleMap, OfoCloseButton},
  data () {
    return {
      ofoMapType: ofoMapType.NEARBY_CAR
    }
  },
  created () {
    this.$store.dispatch('asyncGetUnFinishedOrderNo')
  },
  methods: {
    clickPerson () {
      if (!this.$store.getters.token) {
        this.$router.push({name: 'CellphoneScreen'})
      } else {
        this.$router.push({name: 'PersonInfoScreen'})
      }
    },
    clickRelocate () {
      this.$refs.map.reLocate()
    },
    // "报修"按钮点击
    handleRepairButtonClick () {
      const {unFinishedOrder} = this.$store.getters
      window.GseWallet.saveOfoOrder(unFinishedOrder, (success) => {
        console.log(success)
      }, (error) => {
        console.error(error)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .home_screen{
    flex: 1;
    display: flex;
    flex-direction: column;
    .ofo_logo_container{
      position: fixed;
      left: 16px;
      top: 31px;
      z-index: 100;
      display: flex;
      align-items: center;
      .ofo_logo{
        width: 37px;
        height: 37px;
      }
      .ofo_login_status{
        margin-left: 6px;
        color: @error-color;
        font-size: @primay-font-size
      }
    }
    .ofo_location_map{
      flex: 1;
      .map{
        height: 100%;
      }
    }
    .footer{
      flex: 0 180px;
      position: relative;
      .ofo_operation_panel{
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        padding: 31px 26px;
        background-color: #fff;
        border-radius:16px;
        .ofo_operation_buttons{
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          .ofo_operation_locate{
            width: 23px;
            height: 23px;
          }
          .ofo_operation_unlock{
            width: 95px;
            height: 72px;
          }
          .ofo_operation_setting{
            height: 23px;
            width: 23px;
          }
        }
        .ofo_bottom_pic{
          position: absolute;
          bottom: 0;
          height: 56px;
          left: 10px;
          right: 10px;
          margin: auto;
        }
      }
    }
  }
</style>

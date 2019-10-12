<!--Created by fjl on 2018/10/19-->
<template>
  <div class="gse_qrcode_scanner">
    <video
      autoplay
      ref="gse_qrcode_video"
    >
    </video>
    <canvas
      class="gse_qrcode_overlay"
      ref="gse_qrcode_overlay"
    ></canvas>
    <div
      class="gse_scan_line_container"
      ref="gse_scan_line_container">
      <img v-show="showScanLine" src="../../assets/images/ofo/scanning/scanning-line@2x.png"/>
    </div>
    <canvas
      v-show="false"
      class="gse_qrcode_canvas"
      ref="gse_qrcode_canvas"
    ></canvas>
  </div>
</template>

<script>
import GseQrcode from './gseQrcode'
export default {
  name: 'gse-qrcode-scanner',
  props: {
    options: {
      type: Object
    }
  },
  data () {
    return {
      gseQrcode: null,
      showScanLine: false
    }
  },
  mounted () {
    const {
      gse_qrcode_canvas: canvas,
      gse_qrcode_video: video,
      gse_qrcode_overlay: overlay,
      gse_scan_line_container: scanLineContainer
    } = this.$refs
    // 初始化扫码对象
    this.gseQrcode = new GseQrcode(video, canvas, overlay, scanLineContainer, this.options)
    // 获取到二维码，并解码
    this.gseQrcode.decode = (data) => {
      this.showScanLine = false
      this.$emit('decode', data)
    }
    // 开启扫码的回调
    this.gseQrcode.startScanCallback = () => {
      this.showScanLine = true
    }
    // 装载扫码组件
    this.gseQrcode.load().catch(console.error)
  },
  beforeDestroy () {
    this.gseQrcode.stopScan()
  }
}
</script>
<style lang="less" scoped>
  .gse_qrcode_scanner{
    @keyframes loop {
      form {
        top: 0;
      }
      to {
        top: 100%;
      }
    }
    height: 95%;
    overflow: hidden;
    .gse_scan_line_container{
      overflow: hidden;
      img{
        position: absolute;
        height: 12px;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: loop 3s ease-in-out infinite;
      }
    }
    .gse_qrcode_canvas{
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      margin: auto;
      background-color: #eee;
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
  }
</style>

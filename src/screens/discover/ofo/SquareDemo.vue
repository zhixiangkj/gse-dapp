
<template>
  <div class="cordova_example_screen">
    <canvas
      class="gse_qrcode_overlay"
      ref="gse_qrcode_overlay"
    ></canvas>
    <div
      class="gse_scan_line_container"
      ref="gse_scan_line_container">
      <img v-show="showScanLine" src="../../../assets/images/ofo/scanning/scanning-line@2x.png"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'square',
  data () {
    return {
      qrCodeWidth: '',
      qrCodeHeight: '',
      outerLineColor: '#FFE300',
      scanW: '',
      scanH: '',
      outerLineL: 30,
      outerLineW: 0,
      innerLineColor: '#FFE300',
      borderColor: '#FFE300',
      borderW: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      showScanLine: true,

      videoWidth: '',
      videoHeight: '',
      gseGrCodeWidth: ''
    }
  },
  mounted () {
    this.qrCodeWidth = document.documentElement.clientWidth
    this.qrCodeHeight = document.documentElement.clientHeight
    this.scanW = this.qrCodeWidth / 1.6
    this.scanH = this.scanW
    console.log('refs:', this.$refs.gse_qrcode_overlay)
    console.log('gse_scan_line_container:', this.$refs.gse_scan_line_container)
    this.drawOverlay()

    this.videoWidth = document.documentElement.clientWidth
    this.videoHeight = document.documentElement.clientHeight
    this.gseGrCodeWidth = document.documentElement.clientWidth
    // this.startScan()
  },
  watch: {
  },
  methods: {
    // canvas 绘制覆盖物
    drawOverlay () {
      const that = this
      const drawOuterLine = () => {
        // debugger
        context.save()
        context.fillStyle = that.outerLineColor
        for (let i = 0; i < 4; i++) {
          context.save()
          context.translate(Math.floor(that.qrCodeWidth / 2), Math.floor(that.qrCodeHeight / 2))
          context.rotate(Math.PI / 2 * i)
          const x = Math.floor(that.scanW / 2 - that.outerLineL + that.outerLineW)
          const y = Math.floor(that.scanH / 2 - that.outerLineL + that.outerLineW)
          context.fillRect(x, y, that.outerLineL, that.outerLineL)
          context.restore()
        }
        context.restore()
      }
      const drawInnerLine = () => {
        context.save()
        context.fillStyle = that.innerLineColor
        context.fillRect(
          Math.floor(that.qrCodeWidth / 2 - that.scanW / 2),
          Math.floor(that.qrCodeHeight / 2 - that.scanW / 2),
          Math.floor(that.scanW),
          Math.floor(that.scanH)
        )
        const x2 = Math.floor(that.scanW / 2)
        const x1 = Math.floor(x2 - that.innerLineW)
        const x0 = Math.floor(x2 - that.innerLineL)
        const y2 = Math.floor(that.scanH / 2)
        const y1 = Math.floor(y2 - that.innerLineW)
        const y0 = Math.floor(y2 - that.innerLineL)
        context.translate(Math.floor(that.qrCodeWidth / 2), Math.floor(that.qrCodeHeight / 2))
        context.beginPath()
        context.moveTo(x0, y2)
        context.lineTo(x0, y1)
        context.lineTo(x1, y1)
        context.lineTo(x1, y0)
        context.lineTo(x2, y0)
        context.lineTo(x2, -y0)
        context.lineTo(x1, -y0)
        context.lineTo(x1, -y1)
        context.lineTo(x0, -y1)
        context.lineTo(x0, -y2)
        context.lineTo(-x0, -y2)
        context.lineTo(-x0, -y1)
        context.lineTo(-x1, -y1)
        context.lineTo(-x1, -y0)
        context.lineTo(-x2, -y0)
        context.lineTo(-x2, y0)
        context.lineTo(-x1, y0)
        context.lineTo(-x1, y1)
        context.lineTo(-x0, y1)
        context.lineTo(-x0, y2)
        context.closePath()
        context.clip()
        context.clearRect(Math.floor(-that.scanW / 2), Math.floor(-that.scanH / 2), Math.floor(that.scanW), Math.floor(that.scanH))
        context.restore()
      }
      const context = this.$refs.gse_qrcode_overlay.getContext('2d')
      // debugger
      context.save()
      context.fillStyle = this.backgroundColor
      context.fillRect(0, 0, this.qrCodeWidth, this.qrCodeHeight)
      context.strokeStyle = this.borderColor
      context.lineWidth = 2 * this.borderW
      context.strokeRect(this.qrCodeWidth / 2 - this.scanW / 2, this.qrCodeHeight / 2 - this.scanW / 2, this.scanW, this.scanH)
      context.restore()
      drawOuterLine()
      drawInnerLine()
    },
    // 开始扫描
    startScan () {
      const _this = this
      console.log('reftest:', _this.$refs.gse_scan_line_container)
      // const context = this.canvas.getContext('2d')
      // const cropW = _this.videoWidth * this.scanW / this.gseGrCodeWidth
      // const cropH = _this.videoWidth * this.scanH / this.gseGrCodeWidth
      // this.timer = setInterval(() => {
      //   context.drawImage(_this.$refs.gse_scan_line_container,
      //     (_this.videoWidth - cropW) / 2, (_this.videoHeight - cropH) / 2, cropW, cropH,
      //     0, 0, _this.scanW, _this.scanH)
      // }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
  h1, h2, h3, h4, h5, h6{
    margin: 0;
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
    .gse_scan_line_container{
        @keyframes loop {
        form {
          top: 0;
        }
        to {
          top: 255px;
        }
      }
      width: 267px;
      height: 267px;
      background: green;
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
</style>

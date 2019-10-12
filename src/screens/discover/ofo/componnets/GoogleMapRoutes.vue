<!--Created by qfz on 2018/11/16-->
<!--谷歌地图-绘制路线-->
<template>
  <div id="maproutes" class="google_map_routes">
  </div>
</template>

<script>
const OverlayView = window.google ? window.google.maps.OverlayView : Object
export class MapRoutes extends OverlayView {
  constructor (map, paths) {
    super()
    this.paths = paths
    this.map = map
    let div = document.createElement('div')
    div.classList.add('routes-map-flag')
    div.style.border = '0px solid red'
    div.style.position = 'absolute'
    div.style.left = '0px'
    div.style.top = '0px'
    this.anchor = div
    this.setFit()
    this.stopEventPropagation()
  }
  onAdd () {
    let panes = this.getPanes()
    panes.overlayLayer.appendChild(this.anchor)
  }
  onRemove () {
    if (this.anchor.parentNode) {
      this.anchor.parentNode.removeChild(this.anchor)
    }
  }
  setFit () {
    if (!google) {
      return
    }
    let bounds = new google.maps.LatLngBounds()
    this.paths.forEach(item => {
      bounds.extend(new google.maps.LatLng(item[0], item[1]))
    })
    this.map.fitBounds(bounds)
  }
  draw () {
    if (!google) {
      return
    }
    let div = this.anchor
    let bounds = this.map.getBounds()
    let overlayProjection = this.getProjection()
    let sw = overlayProjection.fromLatLngToDivPixel(bounds.getSouthWest())
    let ne = overlayProjection.fromLatLngToDivPixel(bounds.getNorthEast())
    this.sw = sw
    this.ne = ne
    div.style.left = sw.x + 'px'
    div.style.top = ne.y + 'px'
    div.style.width = (ne.x - sw.x) + 'px'
    div.style.height = (sw.y - ne.y) + 'px'
    let arr = this.paths
    arr = arr.map(item => {
      let divArr = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(item[0], item[1]))
      return `${divArr.x - this.sw.x},${divArr.y - this.ne.y}`
    })
    let inner = `<svg width="100%" height="100%">
        <defs>
          <linearGradient id="orange_red" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3D78FF;
            stop-opacity:1"/>
            <stop offset="100%" style="stop-color:#3D78FF;
          stop-opacity:1"/>
          </linearGradient>
        </defs>
        <g>
        <polyline points="${arr.join(' ')}" class="polyline-style" ></polyline>
        </g>
      </svg>`
    div.innerHTML = inner
  }
  stopEventPropagation () {
    var anchor = this.anchor
    anchor.style.cursor = 'auto';
    ['click', 'dblclick', 'contextmenu', 'wheel', 'mousedown', 'touchstart',
      'pointerdown']
      .forEach((event) => {
        anchor.addEventListener(event, (e) => {
          e.stopPropagation()
        })
      })
  }
}
export default {
  name: 'google_map_routes',
  props: {
    position: Object
  },
  data () {
    return {
      routes: null
    }
  }
}
</script>

<style lang="less">
  .locat-with-direct {
    position: relative;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
  }

  .polyline-style{
    fill:none;
    stroke-width:5;
    stroke-linejoin:round;
    stroke-linecap:round;
    stroke:url(#orange_red);
    stroke-opacity:1;
  }
</style>

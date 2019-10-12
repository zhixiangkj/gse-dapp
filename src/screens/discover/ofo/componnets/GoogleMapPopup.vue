<!--Created by fjl on 2018/11/12-->
<!--谷歌地图-自定义信息提示窗口-->
<template>
  <div id="content" class="google_map_popup">
  </div>
</template>

<script>
const OverlayView = window.google ? window.google.maps.OverlayView : Object
export class Popup extends OverlayView {
  constructor (content, position, text) {
    super()
    this.position = position
    this.content = content
    this.content.innerHTML = text || ''
    content.classList.add('popup-bubble-content')
    var pixelOffset = document.createElement('div')
    pixelOffset.classList.add('popup-bubble-anchor')
    pixelOffset.appendChild(content)
    this.anchor = document.createElement('div')
    this.anchor.classList.add('popup-tip-anchor')
    this.anchor.appendChild(pixelOffset)
    // Optionally stop clicks, etc., from bubbling up to the map.
    this.stopEventPropagation()
  }
  setText (str) {
    this.content.innerHTML = str
  }
  setPosition (position) {
    this.position = position
    this.draw()
  }
  onAdd () {
    this.getPanes().floatPane.appendChild(this.anchor)
  }
  onRemove () {
    if (this.anchor.parentElement) {
      this.anchor.parentElement.removeChild(this.anchor)
    }
  }
  draw () {
    var divPosition = this.getProjection().fromLatLngToDivPixel(this.position)
    // Hide the popup when it is far out of view.
    var display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none'
    if (display === 'block') {
      this.anchor.style.left = divPosition.x + 'px'
      this.anchor.style.top = divPosition.y + 'px'
    }
    if (this.anchor.style.display !== display) {
      this.anchor.style.display = display
    }
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
  name: 'google_map_popup',
  props: {
    position: Object,
    content: String
  },
  data () {
    return {
      popup: null
    }
  }
}
</script>

<style lang="less">
  .popup-tip-anchor {
    height: 0;
    position: absolute;
    /* The max width of the info window. */
    width: 200px;
  }
  /* The bubble is anchored above the tip. */
  .popup-bubble-anchor {
    position: absolute;
    width: 100%;
    bottom: /* TIP_HEIGHT= */ 20px;
    left: 0;
  }
  /* Draw the tip. */
  .popup-bubble-anchor::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    /* Center the tip horizontally. */
    transform: translate(-50%, 0);
    /* The tip is a https://css-tricks.com/snippets/css/css-triangle/ */
    width: 0;
    height: 0;
    /* The tip is 8px high, and 12px wide. */
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: /* TIP_HEIGHT= */ 8px solid white;
  }
  /* The popup bubble itself. */
  .popup-bubble-content {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -100%);
    /* Style the info window. */
    background-color: white;
    padding: 5px;
    border-radius: 5px;
    font-family: sans-serif;
    overflow-y: auto;
    max-height: 60px;
    box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.3);
  }
  .google_map_popup{
    border-radius: 25px;
    font-size: 10px;
    padding:5px 20px;
    line-height: 16px;
    color: #202020;
    max-width: 300px;
    /* The location pointed to by the popup tip. */
  }
  .orange-text{
    font-size: 14px;
    color: orangered;
  }
</style>

/**
 * Created by fjl on 2018/10/17
 */
export default {
  keepAliveInclude: [],
  // 令牌
  _token: '',
  set token (v) {
    if (this._token !== v) {
      this._token = v
      localStorage.setItem('token', v || '')
      $app.$store.dispatch('asyncGetUnFinishedOrderNo').catch(console.error)
    }
  },
  get token () {
    if (!this._token) {
      this._token = localStorage.getItem('token') || ''
    }
    return this._token
  },
  // 用户当前位置
  _coordinate: null,
  set coordinate (value) { // value是个位置对象: {lat: xx, lng: xx}
    if (this._coordinate !== value) {
      this._coordinate = value
      localStorage.setItem('coordinate', JSON.stringify(value || {}))
    }
  },
  get coordinate () {
    if (!this._coordinate) {
      const str = localStorage.getItem('coordinate')
      if (str) {
        this._coordinate = JSON.parse(str)
      }
    }
    return this._coordinate
  },
  // 用户未结束订单的订单
  _unFinishedOrder: null,
  set unFinishedOrder (v) {
    if (this._unFinishedOrder !== v) {
      this._unFinishedOrder = v
      localStorage.setItem('unFinishedOrder', JSON.stringify(v || ''))
    }
  },
  get unFinishedOrder () {
    if (!this._unFinishedOrder) {
      this._unFinishedOrder = JSON.parse(localStorage.getItem('unFinishedOrder')) || null
    }
    return this._unFinishedOrder
  },
  // 该设备是否已经注册
  _isDeviceRegister: false,
  set isDeviceRegister (v) {
    if (this._isDeviceRegister !== v) {
      this._isDeviceRegister = v
      localStorage.setItem('isDeviceRegister', JSON.stringify(v ? '1' : ''))
    }
  },
  get isDeviceRegister () {
    if (!this._isDeviceRegister) {
      this._isDeviceRegister = !!localStorage.getItem('isDeviceRegister')
    }
    return this._isDeviceRegister
  },
  // 灯的状态
  isLightOn: false
}

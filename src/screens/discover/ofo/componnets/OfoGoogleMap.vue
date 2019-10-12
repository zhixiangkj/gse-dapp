<!--Created by fjl on 2018/10/17-->
<!--ofo-google地图组件-->
<template>
  <div class="nearby_ofo_map">
    <div class="google_map" ref="map"></div>
    <google-map-popup ref="popup"/>
    <google-map-routes ref="maproutes" />
    <img v-show="isMapCreated && type === 1 && nailShow" class="center_mask" src="../../../../assets/images/ofo/home/nail@2x.png"/>
  </div>
</template>
<script>
import GoogleMapPopup, {Popup} from './GoogleMapPopup'
import GoogleMapRoutes, {MapRoutes} from './GoogleMapRoutes'
import {ofoCoordinateFromPosition} from '../utils'
export const ofoMapType = {
  NEARBY_CAR: 1, // 附近车辆
  RIDING_ROUTE: 2, // 骑行路线
  CUR_LOCATION: 3 // 当前位置
}
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
  components: {
    GoogleMapPopup, GoogleMapRoutes
  },
  props: {
    type: ''
  },
  data () {
    return {
      // 定位出错信息
      locErrorMsg: null,
      map: null, // google地图实例
      marker: null, // 用户位置的标注
      nearbyofoCars: [], // 周边ofo位置数据
      // infowindow: null, // 位置信息展示视图
      isMapCreated: false,
      // ofo车辆标注
      markers: [],
      // 用户是否正在拖拽地图
      draging: false,
      geocoder: null,
      curMarker: null,
      travelMode: 'WALKING',
      directionsServicen: null,
      directionsDisplay: null,
      nailShow: true,
      geoLoc: null,
      nailLoc: null,
      waypoints: [
        // {lat: 39.982404, lng: 116.311052}, {lat: 39.982461, lng: 116.311642}, {lat: 39.982535, lng: 116.312704}, {lat: 39.982543, lng: 116.314582},
        // {lat: 39.982625, lng: 116.316419}, {lat: 39.981994, lng: 116.316414}, {lat: 39.981961, lng: 116.315416}, {lat: 39.981988, lng: 116.315172},
        // {lat: 39.982502, lng: 116.315116}, {lat: 39.982444, lng: 116.313853}, {lat: 39.982181, lng: 116.313826}, {lat: 39.981443, lng: 116.313531},
        // {lat: 39.980981, lng: 116.313075}, {lat: 39.980490, lng: 116.312152}, {lat: 39.980176, lng: 116.311020}, {lat: 39.978914, lng: 116.311055}
      ], // 测试数据：坐标前边是纬度 后边是经度
      watchID: null
    }
  },
  methods: {
    // 定位
    findMe () {
      return new Promise(async (resolve, reject) => {
        try {
          const coordinate = await this.$store.dispatch('asyncGetCoordinate')
          // const coordinate = {lng: 103.85000, lat: 1.28000}
          // 设置地图位置中心
          if (!this.map) {
            this.map = this.createMap(coordinate)
            this.mapListener()
          } else {
            this.map.setCenter(coordinate)
            this.clearMap()
          }
          this.geoLoc = coordinate
          if (this.type !== ofoMapType.RIDING_ROUTE) {
            // 渲染位置标注
            if (!this.marker) this.marker = this.createMarker()
            this.marker.setPosition(coordinate)
          } else {
            this.startLocation()
          }
          // 渲染位置信息
          // if (!this.infowindow) this.infowindow = this.createInfowindow()
          try {
            // 经纬度解码为位置信息
            // const {formatted_address: formattedAddress} = await this.geocode(coordinate)
            // this.infowindow.setContent(formattedAddress)
            // this.infowindow.open(this.map, this.marker)
          } catch (e) {
            console.error(e)
          }
          resolve(coordinate)
        } catch (err) {
          switch (err.code) {
            case err.TIMEOUT:
              this.locErrorMsg = 'Connection timeout. Please refresh the page and try again'
              break
            case err.PERMISSION_DENIED:
              this.locErrorMsg = 'You have denied the location sharing service, the query has been cancelled'
              break
            case err.POSITION_UNAVAILABLE:
              this.locErrorMsg = 'Sorry, location service is currently unavailable'
              break
            default:
              this.locErrorMsg = "Sorry, please accept your browser's permission request"
          }
          console.error(err)
          reject(err)
        }
      })
    },
    // 获取周边车辆数据
    async getNearCars () {
      if (!google) {
        return
      }
      if (this.type !== ofoMapType.NEARBY_CAR) {
        return
      }
      try {
        const {data: {cars = []}} = await $API.ofo.nearbyofoCar()
        if (this.nearbyofoCars.length) {
          this.nearbyofoCars.forEach((marker) => {
            marker.setMap(null)
          })
        }
        this.nearbyofoCars = cars.map(({lat, lng}) => {
          let marker = new google.maps.Marker({
            position: {lat: lat + 0.01 * Math.random() - 0.005, lng: lng + 0.01 * Math.random() - 0.005},
            map: this.map,
            icon: {
              url: '../../../../../static/img/ofo/nearcar@2x.png',
              scaledSize: new google.maps.Size(30, 32),
              anchor: new google.maps.Point(15, 16)
            },
            zIndex: 20,
            title: 'ofo'
          })
          marker.addListener('click', async () => {
            marker.setAnimation(google.maps.Animation.DROP)
            if (this.curMarker && this.curMarker !== marker) {
              this.curMarker.setAnimation()
            }
            this.curMarker = marker
            if (this.nailShow) {
              this.nailShow = false
              this.createNail()
            }
            try {
              const from = {lat: this.nailLoc.lat(), lng: this.nailLoc.lng()}
              const markerPosition = marker.getPosition()
              const to = {lat: markerPosition.lat(), lng: markerPosition.lng()}
              const result = await this.calcRoute(this.travelMode, [from, to])
              const {distance, duration} = result.routes[0].legs[0]
              let text =
                `步行 <span class="orange-text">${duration.text}</span><br />
              距离 ${distance.text}`
              // text = text.replace(/ /g, '')
              if (!this.popup) {
                this.initPopup(marker.getPosition(), text)
              } else {
                if (!this.popup.getMap()) {
                  this.popup.setMap(this.map)
                }
                this.popup.setPosition(marker.getPosition())
                this.popup.setText(text)
              }
            } catch (e) { console.error(e) }
          })
          return marker
        })
      } catch (e) {
        console.error(e)
      }
    },
    // 经纬度解码为位置信息
    geocode (location) {
      return new Promise((resolve, reject) => {
        if (!google) {
          reject(new Error('google api js load fail'))
        }
        const geocoder = new google.maps.Geocoder()
        geocoder.geocode({location}, (results, status) => {
          if (status === 'OK' && results.length > 0) {
            const address = results[0]
            resolve(address)
          } else {
            const err = {
              code: 601,
              message: 'Longitude and latitude decoding failed',
              data: {
                status,
                result: results
              }
            }
            reject(err)
          }
        })
      })
    },
    // 重新定位
    async reLocate () {
      try {
        await this.findMe()
        // 获取周边车辆数据
        this.getNearCars()
      } catch (e) {
        console.error(e)
      }
    },
    // 创建google地图实例
    createMap (center) {
      if (!google) {
        return
      }
      this.directionsService = new google.maps.DirectionsService()
      this.directionsDisplay = new google.maps.DirectionsRenderer()
      this.geocoder = new google.maps.Geocoder()
      const mapOptions = {
        disableDefaultUI: true,
        clickableIcons: false,
        zoom: 16,
        center,
        maxZoom: 18,
        minZoom: 14
      }
      const map = new google.maps.Map(this.$refs.map, mapOptions)
      this.directionsDisplay.setOptions({
        markerOptions: {icon: {url: '<span></span>'}},
        map: this.map,
        polylineOptions: {
          strokeColor: '#3D78FF',
          strokeWeight: 5
        }
      })
      this.isMapCreated = true
      this.$emit('mapCreated')
      return map
    },
    // 创建用户位置的标注实例
    createMarker () {
      if (!google) {
        return
      }
      var image = {
        url: '../../../../../static/img/ofo/location-mark@2x.png',
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(50, 50),
        scaledSize: new google.maps.Size(100, 100)
      }
      return new google.maps.Marker({
        icon: image,
        zIndex: 10,
        map: this.map
      })
    },
    // 创建定位图钉
    createNail () {
      if (!google) {
        return
      }
      let image = {
        url: '../../../../../static/img/ofo/nail@2x.png',
        origin: new google.maps.Point(0, 0),
        scaledSize: new google.maps.Size(22, 38)
      }
      let center = this.map.getCenter()
      this.nailLoc = center
      let marker = new google.maps.Marker({
        icon: image,
        zIndex: 10,
        map: this.map,
        position: center
      })
      marker.addListener('click', () => {
        this.map.setCenter(this.geoLoc)
        this.clearMap()
      })
      this.nailMarker = marker
      return marker
    },
    initMap () {
      this.showMarkers()
    },
    initPopup (position, content) {
      this.popup = new Popup(this.$refs.popup.$el, position, content)
      this.popup.setMap(this.map)
    },
    calcRoute (mode, allPoint) {
      if (!google) {
        return
      }
      if (!allPoint || allPoint.length === 0) {
        return
      }
      const from = allPoint[0]
      const to = allPoint[allPoint.length - 1]
      const waypoints = allPoint.filter((item, index) => {
        return index > 0 && index < allPoint.length
      }).map(loc => {
        return {location: `${loc.lat}, ${loc.lng}`, stopover: false}
      })
      const request = {
        origin: from,
        destination: to,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode[mode],
        waypoints
      }
      return new Promise((resolve, reject) => {
        this.directionsService.route(request, (response, status) => {
          if (status === 'OK') {
            resolve(response)
            this.directionsDisplay.setMap(this.map)
            // 处理返回的结果数据，使之不显示中间点的图标
            response.routes[0].legs[0].via_waypoint = []
            response.routes[0].legs[0].via_waypoints = []
            this.directionsDisplay.setDirections(response)
          } else {
            reject(status)
          }
        })
      })
    },
    clearMap () {
      if (this.directionsDisplay) this.directionsDisplay.setMap(null)
      if (this.popup) this.popup.setMap(null)
      if (this.curMarker) this.curMarker.setAnimation()
      if (!this.nailShow) this.nailShow = true
      if (this.nailMarker) this.nailMarker.setMap(null)
    },
    // 添加 map 的相关事件
    mapListener () {
      this.map.addListener('dragend', () => {
        if (this.nailShow) {
          this.getNearCars()
        }
      })
    },
    strToLatLng (str) {
      if (!google) {
        return
      }
      let arr = str.split(',')
      let lat = arr[0].trim()
      let lng = arr[1].trim()
      return new google.maps.LatLng(lat, lng)
    },
    // 绘制起止点marker
    createStartMarker (position) {
      if (!google) {
        return
      }
      if (typeof position === 'string') {
        position = this.strToLatLng(position)
      }
      const image = '../../../../../static/img/ofo/startMarker@2x.png'
      const marker = new google.maps.Marker({
        position,
        map: this.map,
        icon: {
          url: image,
          scaledSize: new google.maps.Size(30, 30),
          anchor: new google.maps.Point(15, 15)
        }
      })
      return marker
    },
    createEndMarker (position) {
      if (!google) {
        return
      }
      if (typeof position === 'string') {
        position = this.strToLatLng(position)
      }
      const image = '../../../../../static/img/ofo/endMarker@2x.png'
      const marker = new google.maps.Marker({
        position,
        map: this.map,
        icon: {
          url: image,
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        }
      })
      return marker
    },
    // 根据提供的定位数组选择 绘制路径的方式
    chooseDrawType (waypoints) {
      let length = waypoints.length
      if (length) {
        if (length === 1) {
          this.createStartMarker(waypoints[0])
          // this.map.setCenter(this.strToLatLng(waypoints[0]))
        } else if (length >= 2) {
          let startPosition = waypoints[0]
          let endPosition = waypoints[length - 1]
          this.createStartMarker(startPosition)
          this.createEndMarker(endPosition)
          // this.map.setCenter(this.strToLatLng(endPosition))
          if (length < 16) { // 坐标数量较少，需要google规划路线
            this.calcRoute(this.travelMode, waypoints)
          } else {
            this.calcRouteByPoint(waypoints)
          }
        }
      }
    },
    // 使用 定位坐标绘制路径
    calcRouteByPoint (waypoints) {
      waypoints = waypoints.map(item => {
        return [item.lat, item.lng]
      })
      this.initMapRoutes(waypoints)
    },
    initMapRoutes (paths) {
      this.mapRoutes = new MapRoutes(this.map, paths)
      this.mapRoutes.setMap(this.map)
    },
    // 开始定位
    startLocation () {
      const options = {}
      const onSuccess = (positiosn) => {
        const coordinate = ofoCoordinateFromPosition(positiosn)
        this.waypoints.push(coordinate)
        this.chooseDrawType(this.waypoints)
      }
      const onError = (err) => {
        if (err.code === 1) {
          alert(err.message || 'App has no location permissions')
        } else {
          alert(err.message)
        }
      }
      this.watchID = navigator.geolocation.watchPosition(throttle(onSuccess, 500), throttle(onError, 500), options)
    },
    // 结束定位
    endLocation () {
      if (this.watchID) navigator.geolocation.clearWatch(this.watchID)
    },
    // 监听cordova是否准备完毕
    watchCordovaReady () {
      this.reLocate()
      window.cordova.plugins.backgroundMode.enable()
      window.cordova.plugins.backgroundMode.on('deactivate', () => {
        window.GseWallet.isLocationAuthorized(null, () => { // 定位授权
          if (!this.map) { // 没有位置信息时，地图不会渲染
            this.findMe()
          }
        })
      })
    }
  },
  async mounted () {
    if (!navigator.userAgent.match('GSE_Wallet')) {
      this.reLocate()
    }
  },
  created () {
    document.addEventListener('deviceready', this.watchCordovaReady, false)
  },
  beforeDestroy () {
    document.removeEventListener('deviceready', this.watchCordovaReady, false)
    window.cordova.plugins.backgroundMode.disable()
  }
}
</script>

<style lang="less" scoped>
  .nearby_ofo_map{
    width: 100%;
    background-color: #eee;
    position: relative;
    .google_map{
      position: absolute;
      left: 0;
      top: -100px;
      bottom: -100px;
      margin: auto;
      width: 100%;
    }
    .center_mask{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 22px;
      height: 38px;
      transform: translateY(-19px);
      margin: auto;
      z-index: 100;
    }
  }
</style>

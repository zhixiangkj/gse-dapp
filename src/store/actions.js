/**
 * Created by fjl on 2018/10/17
 */
import {ofoCoordinateFromPosition} from '../screens/discover/ofo/utils'
export default {
  // 用户登录
  login ({commit}, params) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $API.ofo.login(params)
        resolve(data)
        const {OK, data: {token}} = data
        if (OK) {
          commit('setToken', token)
        }
      } catch (e) {
        reject(e)
      }
    })
  },
  // 获取用户位置
  asyncGetCoordinate ({commit}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = {
          code: 602,
          message: 'Your browser does not support geolocation'
        }
        reject(err)
        return
      }
      var options = { enableHighAccuracy: true, maximumAge: 0 }
      navigator.geolocation.getCurrentPosition(
        (position) => { // 定位成功
          // 时间戳（毫秒）
          const coordinate = ofoCoordinateFromPosition(position)
          // todo 先将位置写死（新加坡），后续务必修改
          coordinate.lng = 103.85000
          coordinate.lat = 1.28000
          commit('setCoordinate', coordinate)
          resolve(coordinate)
        },
        (err) => { // 定位失败
          reject(err)
        },
        options)
    })
  },
  asyncGetUnFinishedOrderNo ({commit}) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await $API.ofo.getUnfinished()
        let {code, message, data: order} = data
        if (!order || JSON.stringify(order) === '{}') order = null
        if (order) {
          order.code = code
          order.message = message
          if (typeof order.price === 'string') order.price = parseFloat(order.price)
        }
        commit('setUnFinishedOrder', order)
        if (code === 40003) { // 订单未完成
          $app.setRootRoute({name: 'RidingScreen'})
        } else if ($app.$router.history.current.name === 'RidingScreen') {
          $app.$router.push({name: 'HomeScreen'})
        }
        resolve(order)
      } catch (e) {
        reject(e)
      }
    })
  },

  /**
   * 控制开关灯的方法
   * @param {boolean} param
   */
  controlLight ({commit}, param) {
    if (typeof param !== 'boolean') {
      return false
    }

    if (param) {
      // 关灯
      window.QRScanner.disableLight((err) => {
        if (!err) {
          commit('setisLightOn', false)
        }
      })
    } else {
      // 开灯
      window.QRScanner.enableLight((err) => {
        if (!err) {
          commit('setisLightOn', true)
        }
      })
    }
  }

}

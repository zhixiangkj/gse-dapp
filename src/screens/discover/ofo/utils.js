/**
 * Created by fjl on 2018/12/24
 */
// 从定位数据中获取ofo坐标（ofo坐标格式：{lat: 精度, lng: 纬度, altitude: 海拔, timeStamp: 时间戳, speed: 速度, accuracy: 精度}）
const ofoCoordinateFromPosition = (position) => {
  const {timestamp: timeStamp} = position
  // 经度，纬度，海拔，速度，精度
  const {latitude, longitude, altitude, speed, accuracy} = position.coords
  const lat = parseFloat(latitude)
  const lng = parseFloat(longitude)
  return {lat, lng, altitude, timeStamp, speed, accuracy}
}

// ofo开始解锁
const ofoUnlock = (carno) => {
  // 请求单车密码
  return new Promise(async (resolve, reject) => {
    // 开锁等待中
    try {
      $app.$loading.show()
      const {OK, code, message} = await $API.ofo.getUnlockCode({carno})
      if (OK) {
        const unFinishedOrder = await $app.$store.dispatch('asyncGetUnFinishedOrderNo')
        const params = {...unFinishedOrder}
        if (unFinishedOrder.code === 40003) {
          params.status = 0
        } else if (unFinishedOrder.code === 40010) {
          params.status = 1
        }
        // 保持订单到GSE钱包app上
        window.GseWallet.saveOfoOrder(params, console.log, console.error)
        $app.setRootRoute({name: 'RidingScreen'})
        resolve()
      } else {
        reject(new Error(message))
        switch (code) {
          case 30005: // 骑行中或者有未支付的订单
            {
              // 处理未解决订单
              const handleOrder = (unFinishedOrder) => {
                console.log(11)
                console.log(unFinishedOrder)
                if (unFinishedOrder.code === 40003) { // 订单未完成
                  console.log(22)
                  $app.setRootRoute({name: 'RidingScreen'})
                } else if (unFinishedOrder.code === 40010) { // 订单完成，但未支付
                  console.log(33)
                  $app.$router.push({name: 'OrderScreen'})
                }
                console.log(44)
                console.log(unFinishedOrder.code)
              }
              // 获取订单
              let {unFinishedOrder} = $app.$store.getters
              if (!unFinishedOrder) {
                try {
                  unFinishedOrder = await $app.$store.dispatch('asyncGetUnFinishedOrderNo')
                } catch (e) {
                  console.error(e)
                }
              }
              if (unFinishedOrder) handleOrder(unFinishedOrder)
            }
            break
          // case 30009: // 车辆停靠在非法区域
          //   break
          // case 30004: // 没有此车辆
          //   break
          // case 40078: // 骑行结束
          //   break
          // case 40003: // 未结单
          //   break
          // case 50000: // 非法区域
          //   break
          // case 50001: // 服务器响应
          //   break
          // default: // 结单不成功
        }
      }
      $app.$loading.hide()
    } catch (e) {
      $app.$loading.hide()
      if (e.code === 802 || e.code === 801) {
        $app.$router.push({name: 'CellphoneScreen'})
      }
      $app.$toast.text(e)
      reject(e)
    }
  })
}
// 结束骑行 (path: 骑行路径)
const endTrip = async (path) => {
  const {unFinishedOrder, coordinate} = $app.$store.getters
  if (!path) {
    const {lat, lng, altitude, timeStamp, speed, accuracy} = coordinate
    path = [[lat || 0, lng || 0, altitude || 0, timeStamp || 0, speed || 0, accuracy || 0]]
  } else {
    path = path.map(({lat, lng, altitude, timeStamp, speed, accuracy}) => {
      return [lat || 0, lng || 0, altitude || 0, timeStamp || 0, speed || 0, accuracy || 0]
    })
  }
  path = JSON.stringify(path)
  const orderno = unFinishedOrder ? unFinishedOrder.orderno : 0
  const params = {
    path, // 骑行路径
    orderno, // 订单号
    applePayWork: 0, // 是否支持apple pay
    endType: 0, // 结束骑行 0:手动，1:自动
    endNoPay: 1 // 是否不支付订单，1:不支付
  }
  return new Promise(async (resolve, reject) => {
    try {
      $app.$loading.show()
      const {OK, message} = await $API.ofo.endAndPay(params)
      $app.$loading.hide()
      if (OK) {
        const unFinishedOrder = await $app.$store.dispatch('asyncGetUnFinishedOrderNo')
        resolve(unFinishedOrder)
        const params = {...unFinishedOrder}
        if (unFinishedOrder.code === 40003) {
          params.status = 0
        } else if (unFinishedOrder.code === 40010) {
          params.status = 1
        }
        window.GseWallet.saveOfoOrder(params, console.log, console.error)
      } else {
        $app.$toast.text(message)
        reject(new Error(message))
      }
    } catch (e) {
      reject(new Error(e))
      $app.$loading.hide()
    }
  })
}
// 支付订单 （orderno: 订单编号）
const payOrder = async (orderno) => {
  const params = {
    orderno,
    is3DCard: 0,
    paymentId: '3915308694506490'
  }
  return new Promise(async (resolve, reject) => {
    try {
      $app.$loading.show()
      const {OK, data, message} = await $API.ofo.pay(params)
      $app.$loading.hide()
      if (OK) {
        // 更新订单状态，status: 2表示已经支付
        window.GseWallet.saveOfoOrder({orderno, status: 2}, console.log, console.error)
        resolve(data)
      } else {
        $app.$toast.text(message)
        reject(new Error(message))
      }
    } catch (e) {
      $app.$loading.hide()
      reject(e)
    }
  })
}

export {ofoCoordinateFromPosition, ofoUnlock, payOrder, endTrip}

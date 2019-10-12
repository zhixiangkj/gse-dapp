/**
 * Created by fjl on 2018/10/17
 */

export default {
  keepAliveInclude: state => {
    return state.keepAliveInclude
  },
  token: state => {
    return state.token
  },
  coordinate: state => {
    return state.coordinate
  },
  unFinishedOrder: state => {
    return state.unFinishedOrder
  },
  isDeviceRegister: state => {
    return state.isDeviceRegister
  }
}

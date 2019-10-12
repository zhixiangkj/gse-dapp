/**
 * Created by fjl on 2018/10/17
 */
import axios from 'axios'
const qs = require('qs')
// 设置超时时间
// axios.defaults.timeout = 15000 // 15秒
// 测试
// axios.defaults.baseURL = 'https://ofoapi-qa.ofo.com'
// 灰度
axios.defaults.baseURL = 'https://ofoapi-preproduct.ofo.com'
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
axios.defaults.transformRequest = [(data) => { return qs.stringify(data) }]

let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = axios.CancelToken
let removePending = (config) => {
  for (let p in pending) {
    if (pending[p].u === config.url + '&' + config.method) { // 当前请求在数组中存在时执行函数体
      pending[p].f() // 执行取消操作
      pending.splice(p, 1) // 把这条记录从数组中移除
    }
  }
}
// 添加请求拦截器
axios.interceptors.request.use(config => {
  removePending(config) // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new CancelToken((c) => { // 这里的ajax标识我是用请求地址&请求方式拼接的字符串,当然你可以选择其他的一些方式
    pending.push({ u: config.url + '&' + config.method, f: c })
  })
  return config
}, error => {
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(response => {
  removePending(response.config) // 在一个ajax响应后再执行一下取消操作,把已经完成的请求从pending中移除
  return response
}, error => {
  return Promise.reject(error)
})
// axios 响应拦截
axios.interceptors.response.use(function (response) {
  const {errorCode: code, msg: message, values: data} = response.data
  const OK = code === 200
  if (code === 10003) { // token过期,或者其他设备登录
    $app.$store.commit('setToken', '')
    navigator.notification.confirm(
      'You have logged in on another device. Do you want to log in again?',
      (buttonIndex) => {
        if (buttonIndex === 2) {
          $app.$router.push({name: 'CellphoneScreen'})
        }
      },
      'Alert',
      ['Cancel', 'OK']
    )
  }
  return {code, message, data, OK}
  // 处理响应数据
}, function (error) {
  // 处理响应失败
  return Promise.reject(error)
})

export default axios

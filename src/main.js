/**
 * Created by fjl on 2018/10/15
 */
import Vue from 'vue'
import App from './App.vue'
import 'lib-flexible'
import {ToastPlugin} from 'vux'
import router from './router'
import store from './store'
import i18n from './utils/i18n'
import gsePlugin from './gsePlugin'
import API from './api'

Vue.config.productionTip = false
Vue.use(ToastPlugin)
Vue.use(gsePlugin)
window.$API = API
window.$eventBus = new Vue()
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

// 非开发环境屏蔽输出
if (process.env.NODE_ENV !== 'development') {
  console.log = () => {}
  // console.error = () => {}
}

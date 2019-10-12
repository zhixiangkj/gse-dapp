/**
 * Created by fjl on 2018/10/24
 * 创建一个toast对象，toast依赖于vux中的ToastPlugin
 */
let timer = null
export default {
  show: () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      $app.loading = true
    }, 300)
  },
  hide: () => {
    if (timer) {
      clearTimeout(timer)
    }
    $app.loading = false
  }
}

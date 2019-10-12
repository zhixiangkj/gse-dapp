/**
 * Created by fjl on 2018/10/24
 * 创建一个toast对象，toast依赖于vux中的ToastPlugin
 */
import {REG_EXP_FULL_WIDTH_CHARACTERS} from '../../utils/regExp'
import { toastFontSize, defaultPadding } from '../../assets/styles/vars'
// 修改vux中的属性和方法
export default (Vue) => {
  const vueInstance = new Vue()
  // 重写toast的text方法
  const {toast} = vueInstance.$vux
  toast.text = (text) => {
    if (typeof text !== 'string') text = text.message || text.toString()
    const {length} = text.replace(REG_EXP_FULL_WIDTH_CHARACTERS, '**')
    let toastW = (length + 3) * toastFontSize / 2
    if (toastW > window.screen.width) toastW = window.screen.width - 2 * defaultPadding
    toast.show({
      text,
      type: 'text',
      position: 'bottom',
      width: toastW + 'px'
    })
  }
  return toast
}

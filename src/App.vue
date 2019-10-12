<template>
  <div id="app">
    <keep-alive :include="$store.getters.keepAliveInclude">
      <router-view class="child-view"/>
    </keep-alive>
    <div
      class="loading_mask"
      v-show="loading">
      <div class="loading_gif_container">
        <img
          class="loading_gif"
          src="./assets/images/ofo/common/load.gif"/>
      </div>
    </div>
    <div
      v-show="switching"
      class="switching-mask"
    >
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      loading: false,
      switching: false
    }
  },
  watch: {
    $route (to, from) {
      this.updateRouteStack(to, from)
    }
  },
  methods: {
    // 初始化路由栈信息
    initRouteStack () {
      const rt = this.$router
      rt.stack = []
      const {state} = window.history
      rt.state = 'push'
      rt.current = 0
      rt.stack.push(state ? state.key : history.length)
      this.$router.replace = (route) => {
        this.$router.isReplace = true
        this.$router.history.replace(route)
      }
    },
    // 更新路由栈信息
    updateRouteStack (to, from) {
      const rt = this.$router
      const {state} = window.history
      if (state) {
        const newIndex = rt.stack.indexOf(state.key)
        if (newIndex < 0) {
          if (rt.isReplace) {
            rt.state = 'replace'
            rt.stack = [state.key]
          } else {
            rt.state = 'push'
            rt.current++
            rt.stack.push(state.key)
          }
        } else {
          const goStep = newIndex - rt.current // 前进或者后退的次数
          if (goStep === 0) {
            if (to.name === from.name || to.path === from.path) {
              // 此情况不存在，可以忽略（vue-route// 相同路由不会刷新或跳转，路由也不会变化）
              rt.state = 'refresh'
            } else {
              rt.state = 'replace'
            }
          } else {
            rt.current = rt.current + goStep
            if (goStep < 0) {
              rt.state = 'back'
              rt.stack = rt.stack.slice(0, rt.current + 1)
            } else {
              // 此情况H5 app不会存在，应为app不会有'前进'按钮
              rt.state = 'forward'
            }
          }
        }
      } else {
        rt.state = 'back'
        rt.current = 0
        rt.stack = [rt.stack[0]]
      }
      if (rt.isReplace) rt.isReplace = false
    },
    // 设置app的根路由
    setRootRoute (route) {
      // 当前路由和目标路由一致时，不必跳转
      if (typeof route === 'string' && $app.$route.path === route) return
      if (typeof route === 'object' &&
        (route.name === $app.$route.name || route.path === $app.$route.path)) {
        return
      }
      const rt = this.$router
      if (rt.current) {
        this.$router.go(-rt.current)
      }
      setTimeout(() => {
        this.$router.replace(route)
        setTimeout(() => {
          this.switching = false
        }, 250)
      }, 50)
    },
    // 回到之前或之后的路由后，并替换该路由
    goAndReplace (route, goNum) { // goNum 为前进或后退的次数，不存在时：替换当前路由
      // 当前路由和目标路由一致时，不必跳转
      if (typeof route === 'string' && $app.$route.path === route) return
      if (typeof route === 'object' &&
        (route.name === $app.$route.name || route.path === $app.$route.path)) {
        return
      }
      this.switching = true
      if (goNum) {
        this.$router.go(goNum)
        setTimeout(() => {
          this.$router.replace(route)
          setTimeout(() => {
            this.switching = false
          }, 250)
        }, 50)
      } else {
        this.$router.replace(route)
      }
    }
  },
  async created () {
    window.$app = this
    // 初始化路由栈信息
    this.initRouteStack()
    try {
      // 获取用户的地址位置
      this.$store.dispatch('asyncGetCoordinate')
    } catch (e) {
      this.$toast.text(e)
    }
  }
}
</script>

<style lang="less">
  @import "./assets/styles/public.less";
  #app{
    position: relative;
    .loading_mask{
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 1000000;
      .loading_gif_container{
        width: 60px;
        height: 60px;
        display: flex;
        border-radius: 5px;
        justify-content: center;
        align-items: center;
        /*background-color: #fff;*/
        /*box-shadow: 0 0 1px 2px #999;*/
        .loading_gif{
          width: 41px;
          height: 39px;
        }
      }
    }
    .switching-mask{
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background: #fff;
      z-index: 100;
    }
  }
</style>

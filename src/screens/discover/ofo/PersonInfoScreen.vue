<!--Created by fjl on 2018/12/26-->
<template>
  <div class="person-info-screen">
    <ofo-nav-header />
    <x-button
      class="logout-button"
      @click.native="logout"
      type="primary">
      Log out
    </x-button>
    <h3 class="login_status_message">You have logged in!</h3>
   <!-- <div v-transfer-dom>
      <confirm
        v-model="showLogoutConfirm"
        title="Alert"
        @on-confirm="onConfirmLogout"
      >
        <p style="text-align:center;">{{ 'Are you sure to logout?'}}</p>
      </confirm>
    </div>-->
  </div>
</template>

<script>
import {Confirm, TransferDomDirective as TransferDom} from 'vux'
export default {
  components: {
    Confirm
  },
  data () {
    return {
      showLogoutConfirm: false
    }
  },
  directives: {
    TransferDom
  },
  methods: {
    onConfirmLogout () {
      this.$store.commit('setToken', null)
      this.$toast.text('You have logged out successfully!')
      setTimeout(() => {
        this.$router.back()
      }, 1500)
    },
    logout () {
      // this.showLogoutConfirm = true
      navigator.notification.confirm(
        'Are you sure to logout?',
        (buttonIndex) => {
          if (buttonIndex === 2) {
            this.onConfirmLogout()
          }
        },
        'Alert',
        ['Cancel', 'OK']
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .person-info-screen{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 75px;
    position: relative;
    background-color: #eee;
    .login_status_message{
      margin-top: -40px;
    }
    .logout-button{
      position: absolute;
      bottom: 0;
    }
  }
</style>

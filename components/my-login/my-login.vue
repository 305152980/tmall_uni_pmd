<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
    <text class="tips-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 获取用户的基本信息。
      getUserInfo() {
        uni.getUserProfile({
          desc: '用于完善个人资料',
          success: (res) => {
            this.updateUserInfo(res.userInfo)
            this.getToken(res)
          },
          fail: (err) => { uni.$showMsg('您取消了登录授权！') }
        })
      },
      // 获取登录的 token 信息。
      async getToken(info) {
        // 获取 code 对应的值。
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // 登录接口有问题了。
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        // 把 token 保存到 vuex 中。
        // this.updateToken(loginResult.message.token)
        this.updateToken('1234567890')
        this.navigateBack()
      },
      // 返回前面的跳转页。
      navigateBack() {
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #F8F8F8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    // &::after {
    //   content: ' ';
    //   display: block;
    //   width: 100%;
    //   height: 80rpx;
    //   background-color: white;
    //   position: absolute;
    //   bottom: 0;
    //   left: 0;
    //   border-radius: 100%;
    //   transform: translateY(50%);
    // }

    .btn-login {
      width: 90%;
      border-radius: 200rpx;
      margin: 30rpx 0;
      background-color: #C00000;
    }

    .tips-text {
      font-size: 24rpx;
      color: gray;
    }
  }
</style>

/* eslint-disable no-undef */
import wepy from 'wepy'

export default class userMixin extends wepy.mixin {
  isFunction(item) {
    return typeof item === 'function'
  }

  // set Code
  async $setCode() {
    const res = await wepy.login()
    if (res.code) {
      wepy.setStorageSync('code', res.code)
    }
  }

  // get code
  async $getCode() {
    let code = wepy.getStorageSync('code')
    if (!code) {
      await this.$setCode()
    }
    code = wepy.getStorageSync('code')
    return code
  }

  /**
   * 获取微信用户信息
   * @returns {Promise.<*>}
   */
  async $getUser() {
    let user = wepy.getStorageSync('user')
    // 不重复获取用户信息
    if (!user || !user.nickName) {
      const res = await wepy.getUserInfo()
      if (res.userInfo) {
        user = res.userInfo
        wepy.setStorageSync('user', res.userInfo)
      }
    }
    return user
  }
}

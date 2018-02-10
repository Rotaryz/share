import wepy from 'wepy'
import Tips from './tips'

// HTTP工具类
export default class http {
  static async request(method, url, data, loading = true) {
    const param = {
      url: url,
      method: method,
      data: data
    }
    param.header = Object.assign({}, {'X-Requested-With': 'XMLHttpRequest'})
    if (loading) {
      Tips.loading()
    }
    const res = await wepy.request(param)
    if (this.isSuccess(res)) {
      const result = res.data
      return result
    } else {
      throw this.requestException(res)
    }
  }

  static async upload(url, name, loading = true) {
    const resImage = await wepy.chooseImage()
    const param = {
      url: url,
      filePath: resImage.tempFilePaths[0],
      name: name
    }
    if (loading) {
      Tips.loading()
    }
    const res = await wepy.uploadFile(param)
    const resData = JSON.parse(res.data)
    if (res.statusCode === 200 && resData.error === 0) {
      return resData
    } else {
      throw this.requestException(resData)
    }
  }

  /**
   * 判断请求是否成功
   */
  static isSuccess(res) {
    const wxCode = res.statusCode
    // 微信请求错误
    if (wxCode === 200 || wxCode === 201 || wxCode === 422) {
      return true
    }
    return false
  }

  /**
   * 异常
   */
  static requestException(res) {
    const error = {}
    error.statusCode = res.statusCode
    const wxData = res.data
    if (wxData) {
      error.error = wxData.error
      error.message = wxData.message
      error.serverData = wxData
    } else {
      Tips.loaded()
    }
    return error
  }

  static get(url, data, loading = true) {
    return this.request('GET', url, data, loading)
  }

  static put(url, data, loading = true) {
    return this.request('PUT', url, data, loading)
  }

  static post(url, data, loading = true) {
    return this.request('POST', url, data, loading)
  }

  static patch(url, data, loading = true) {
    return this.request('PATCH', url, data, loading)
  }

  static delete(url, data, loading = true) {
    return this.request('DELETE', url, data, loading)
  }
}

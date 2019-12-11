// http 辅助工具类
import axios from 'axios'
import config from '@/config'
import Cookies from 'js-cookie'
/**
 * 网络请求
 * @param url
 * @param data
 * @param cur
 * @returns {Promise<any>}
 */

let ajaxurl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

function http (_self, url, data, cur) {
  return new Promise((resolve, reject) => {
    axios.post(ajaxurl + url, {
      ...initPostData(data)
    }).then(res => {
      switch (res.data.code) {
        /* 成功 */
        case '0':
          resolve(res)
          break
          // case '500':
          //   localStorage.clear()
          //   Cookies.remove('jxyex-token')
          //   _self.$Message.warning('登录已过期，请重新登录')
          //   if (process.env.NODE_ENV == 'production') {
          //     window.location.href = '/macc/index.html#/login'
          //   } else {
          //     window.location.href = '/'
          //   }
          //   break
        default:
          _self.$Message.warning(res.data.msg)
          reject(res.data)
          break
      }
    })
  })
}

function post (_self, url, data, cur) {
  return new Promise((resolve, reject) => {
    axios.post(ajaxurl + url, {
      ...initPostData(data)
    }).then(res => {
      switch (res.data.message.code) {
        case 0:
          resolve(res.data)
          break
        case 10086:
          break
        default:
          _self.$Message.warning(res.data.msg)
          reject(res.data)
          break
      }
    })
  })
}

/**
 * 去除空参数
 * @param obj
 */
function initPostData (obj) {
  let postData = {}
  if (undefined === obj) {
    return postData
  }
  Object.keys(obj).forEach(item => {
    if (obj[item] !== '' || obj[item] === 0) {
      postData[item] = obj[item]
    }
  })
  return postData
}

export default {
  initPostData,
  http,
  post
}

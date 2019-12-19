import Axios from 'axios'
import qs from 'qs'
import config from '@/config'
import Cookies from 'js-cookie'
import {
  getToken
} from '@/libs/util'
Axios.defaults.timeout = 10000 // 响应时间
Axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro // 配置接口地址

// 添加一个请求拦截器
Axios.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers.common['admintoken'] = getToken()
    }
    if (config.url.indexOf('/admin/') > -1 || config.url.indexOf('/api/') > -1) {
      config.headers.MTOKEN = getToken()
    }
    if (config.method === 'post') {
      let _data = config.data
      for (var key in _data) {
        if (_data[key] == '') {
          delete _data[key]
        }
      }
      config.data = qs.stringify(config.data)
    }
    /* if (config.url.indexOf('/admin/user/login') > -1) {
      config.headers.uuid = sessionStorage.uuid
    } */
    return config
  },
  error => {
    _.toast('错误的传参', 'fail')
    return Promise.reject(error)
  }
)

// 响应拦截器
Axios.interceptors.response.use(
  function (response) {
    if (response.data.code == '401') {
      localStorage.clear()
      Cookies.remove('jxyex-token')
      alert('登录已过期，请重新登录')
      if (process.env.NODE_ENV == 'production') {
        window.location.href = '/manager/index.html#/login'
      } else {
        window.location.href = '/'
      }
    } else {
      return response
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default Axios

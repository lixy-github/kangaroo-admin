import Axios from '@/libs/axios.js'
import config from '@/config'
export const imgLoadUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// 登录
export const login = (data) => {
  return Axios.request({
    method: 'post',
    url: '/web/adminLogin',
    data: data
  })
}

// 菜单列表
export const menuList = () => {
  return Axios.request({
    method: 'post',
    url: '/admin/authmenu/list.htm',
    data: {}
  })
}

// 首页数据
export const indexCount = (data) => {
  return Axios.request({
    url: '/admin/charge/indexCount',
    data: data,
    method: 'post'
  })
}

// 优惠券列表
export const couponList = (data) => {
  return Axios.request({
    url: '/admin/coupon/list',
    data: data,
    method: 'post'
  })
}

// 添加优惠券
export const couponAdd = (data) => {
  return Axios.request({
    url: '/admin/coupon/add',
    data: data,
    method: 'post'
  })
}
// 获取注册协议
export const registerAgreementread = (data) => {
  return Axios.request({
    url: '/admin/contentBanner/registerAgreement/read',
    data: data,
    method: 'post'
  })
}
// 修改注册协议
export const registerAgreementupdate = (data) => {
  return Axios.request({
    url: '/admin/contentBanner/registerAgreement/update',
    data: data,
    method: 'post'
  })
}

/* 商品 */

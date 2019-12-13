// 优惠券管理
import Axios from '@/libs/axios.js'

// 优惠券列表
export const couponList = (data) => {
  return Axios.request({
    url: '/admin/coupon/list',
    data: data,
    method: 'post'
  })
}

// 优惠券开始/结束
export const couponswitch = (data) => {
  return Axios.request({
    url: '/admin/coupon/switch',
    data: data,
    method: 'post'
  })
}

// 优惠券领取详情
export const coupongotList = (data) => {
  return Axios.request({
    url: '/admin/coupon/got/list',
    data: data,
    method: 'post'
  })
}

// 优惠券添加
export const couponadd = (data) => {
  return Axios.request({
    url: '/admin/coupon/add',
    data: data,
    method: 'post'
  })
}

// 订单管理
import Axios from '@/libs/axios.js'

// 获取订单列表
export const orderlist = (data) => {
  return Axios.request({
    url: '/admin/order/list',
    data: data,
    method: 'post'
  })
}

// 获取物流列表
export const logistics = (data) => {
  return Axios.request({
    method: 'get',
    url: '/admin/logistics/logistics',
    params: data
  })
}

// 发货
export const orderSend = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/order/send',
    params: data
  })
}

// 查看物流
export const logisticsFirmTrack = (data) => {
  return Axios.request({
    method: 'get',
    url: '/web/logistics/logisticsFirmTrack',
    params: data
  })
}

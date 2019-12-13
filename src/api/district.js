// 区域管理
import Axios from '@/libs/axios.js'

// 上架商品列表
export const goodsfindListByPage = (data) => {
  return Axios.request({
    url: '/admin/rushpay/goods/findListByPage',
    data: data,
    method: 'post'
  })
}

// 时段列表
export const templatefindList = (data) => {
  return Axios.request({
    url: '/admin/rushpay/time/template/findList',
    data: data,
    method: 'post'
  })
}

// 添加时段
export const templateadd = (data) => {
  return Axios.request({
    url: '/admin/rushpay/time/template/add',
    data: data,
    method: 'post'
  })
}

// 修改时段
export const templatemodify = (data) => {
  return Axios.request({
    url: '/admin/rushpay/time/template/modify',
    data: data,
    method: 'post'
  })
}

// 删除时段
export const templateremove = (data) => {
  return Axios.request({
    url: '/admin/rushpay/time/template/remove',
    data: data,
    method: 'post'
  })
}

// 商品分类
export const classfindList = (data) => {
  return Axios.request({
    url: '/admin/goods/class/findList',
    data: data,
    method: 'post'
  })
}

// 下架商品
export const goodsremove = (data) => {
  return Axios.request({
    url: '/admin/rushpay/goods/remove',
    data: data,
    method: 'post'
  })
}

// 添加上架商品
export const goodsadd = (data) => {
  return Axios.request({
    url: '/admin/rushpay/goods/add',
    data: data,
    method: 'post'
  })
}

// 编辑上架商品
export const goodsmodify = (data) => {
  return Axios.request({
    url: '/admin/rushpay/goods/modify',
    data: data,
    method: 'post'
  })
}

// 商品库列表
export const goodsfindList = (data) => {
  return Axios.request({
    url: '/admin/goods/findList',
    data: data,
    method: 'post'
  })
}

// 商品库管理
import Axios from '@/libs/axios.js'

// 商品库列表
export const goodsfindList = (data) => {
  return Axios.request({
    url: '/admin/goods/findList',
    data: data,
    method: 'post'
  })
}

// 商品库删除
export const goodsremove = (data) => {
  return Axios.request({
    url: '/admin/goods/remove',
    data: data,
    method: 'post'
  })
}

// 商品库修改
export const goodsmodify = (data) => {
  return Axios.request({
    url: '/admin/goods/modify',
    data: data,
    method: 'post'
  })
}

// 商品库修改
export const goodsadd = (data) => {
  return Axios.request({
    url: '/admin/goods/add',
    data: data,
    method: 'post'
  })
}

// 商品分类添加
export const goodsclassadd = (data) => {
  return Axios.request({
    url: '/admin/goods/class/add',
    data: data,
    method: 'post'
  })
}

// 商品分类编辑
export const goodsclassmodify = (data) => {
  return Axios.request({
    url: '/admin/goods/class/modify',
    data: data,
    method: 'post'
  })
}

// 商品分类删除
export const goodsclassremove = (data) => {
  return Axios.request({
    url: '/admin/goods/class/remove',
    data: data,
    method: 'post'
  })
}

// 供应链
export const goodsGetList = (data) => {
  return Axios.request({
    url: '/admin/goods/getList',
    data: data,
    method: 'post'
  })
}

// 供应链
export const goodsDetail = (data) => {
  return Axios.request({
    url: '/admin/goods/detail',
    data: data,
    method: 'post'
  })
}

import Axios from '@/libs/axios.js'
// 内容管理

// 获取轮播列表
export const contentBannerlist = (data) => {
  return Axios.request({
    url: '/admin/contentBanner/list',
    data: data,
    method: 'post'
  })
}

// 添加轮播
export const contentBanneradd = (data) => {
  return Axios.request({
    url: '/admin/contentBanner/add',
    data: data,
    method: 'post'
  })
}

// 删除轮播
export const contentBannerdelete = (data) => {
  return Axios.request({
    url: '/admin/contentBanner/delete',
    data: data,
    method: 'post'
  })
}

// 获取上架商品(无分页)
export const goodsfindList = (data) => {
  return Axios.request({
    url: '/admin/rushpay/goods/findList',
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

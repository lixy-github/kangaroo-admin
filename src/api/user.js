// 会员管理
import Axios from '@/libs/axios.js'

// 获取用户列表
export const userlist = (data) => {
  return Axios.request({
    url: '/admin/user/list',
    data: data,
    method: 'post'
  })
}

// 获取用户详情
export const userinfo = (data) => {
  return Axios.request({
    url: '/admin/user/info',
    data: data,
    method: 'post'
  })
}

// 获取代理等级
export const agentLevelList = (data) => {
  return Axios.request({
    url: '/admin/user/agentLevel/list',
    data: data,
    method: 'post'
  })
}

// 设置代理等级
export const agentLevelupdate = (data) => {
  return Axios.request({
    url: '/admin/user/agentLevel/update',
    data: data,
    method: 'post'
  })
}

// 设置风控
export const controlupdate = (data) => {
  return Axios.request({
    url: '/admin/user/control/update',
    data: data,
    method: 'post'
  })
}

// 获取用户等级
export const userLevelList = (data) => {
  return Axios.request({
    url: '/admin/user/userLevel/list',
    data: data,
    method: 'post'
  })
}

// 删除用户等级
export const userLeveldelete = (data) => {
  return Axios.request({
    url: '/admin/user/userLevel/delete',
    data: data,
    method: 'post'
  })
}

// 添加用户等级
export const userLeveladd = (data) => {
  return Axios.request({
    url: '/admin/user/userLevel/add',
    data: data,
    method: 'post'
  })
}

// 编辑用户等级
export const userLevelupdate = (data) => {
  return Axios.request({
    url: '/admin/user/userLevel/update',
    data: data,
    method: 'post'
  })
}

// 用户收货地址
export const useraddrList = (data) => {
  return Axios.request({
    url: '/admin/user/addr/list',
    data: data,
    method: 'post'
  })
}

// 查看会员的所有深度下级
export const allChildren = (data) => {
  return Axios.request({
    url: '/admin/user/allChildren',
    data: data,
    method: 'post'
  })
}

// 用户最近12个月的销量统计
export const userSalesAccount = (data) => {
  return Axios.request({
    url: '/admin/user/userSalesAccount',
    params: data,
    method: 'get'
  })
}

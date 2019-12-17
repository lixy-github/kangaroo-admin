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
    url: '/admin/order/userAdminIndexSales',
    params: data,
    method: 'get'
  })
}

// 首页数据
export const adminIndex = (data) => {
  return Axios.request({
    url: '/admin/order/userAdminIndex',
    params: data,
    method: 'get'
  })
}

// 新增角色
export const addRole = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authrole/add.htm',
    data: data
  })
}

// 新增用户
export const addUser = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authuser/add.htm',
    data: data
  })
}

// 修改用户
export const modifyUser = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authuser/update.htm',
    data: data
  })
}

// 删除用户
export const deleteUser = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authuser/delete.htm',
    data: data
  })
}

// 用户列表
export const userList = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authuser/list.htm',
    data: data
  })
}

// 用户详情
export const userDetailes = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authuser/read.htm',
    data: data
  })
}

// 角色列表
export const roleList = () => {
  return Axios.request({
    method: 'post',
    url: '/admin/authrole/list.htm',
    data: {}
  })
}

// 角色详情
export const roleDetails = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authrole/read.htm',
    data: data
  })
}

// 修改角色
export const modifyRole = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authrole/update.htm',
    data: data
  })
}
// 删除角色
export const deleteRole = (data) => {
  return Axios.request({
    method: 'post',
    url: '/admin/authrole/delete.htm',
    data: data
  })
}

import Axios from '@/libs/axios.js'

// 登录
export const login = (data) => {
    return Axios.request({
        method: "post",
        url: '/admin/user/login',
        data: data
    })
}

// 菜单列表
export const menuList = () => {
    return Axios.request({
        method: "post",
        url: "/admin/authmenu/list.htm",
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
};

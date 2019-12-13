// 财务管理
import Axios from '@/libs/axios.js'

// 获取订单列表
export const recordfindList = (data) => {
  return Axios.request({
    url: '/admin/account/record/findList',
    data: data,
    method: 'post'
  })
}

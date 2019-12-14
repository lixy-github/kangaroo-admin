// 系统配置
import Axios from '@/libs/axios.js'

// 获取
export const sysfindList = (data) => {
  return Axios.request({
    url: '/admin/config/sys/findList',
    data: data,
    method: 'post'
  })
}

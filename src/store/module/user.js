import {
  setToken,
  getToken
} from '@/libs/util'
import Cookies from 'js-cookie'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
      Cookies.set('access', JSON.stringify(access), {
        expires: 7
      })
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, {
      msg_id,
      content
    }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, {
      from,
      to,
      msg_id
    }) {
      const index = state[from].findIndex(_ => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({
      commit
    }, data) {
      return new Promise((resolve, reject) => {
        let arr = []
        data.forEach(val => {
          arr.push(val.menuName)
          if (val.children && val.children.length) {
            val.children.forEach(cd => {
              arr.push(cd.menuName)
            })
          }
        })
        arr = [...new Set([...arr])]
        commit('setAccess', arr)
        commit('setHasGetInfo', true)
        Cookies.set('userId', data.id)
        resolve()
      })
    },
    // 退出登录
    handleLogOut ({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setAccess', [])
        Cookies.remove('token')
        Cookies.remove('jxyex-token')
        Cookies.remove('access')
        Cookies.remove('userId')
        Cookies.remove('jxyex-username')
        Cookies.remove('orderStatus')
        localStorage.tagNaveList = []
        resolve()
      })
    }
  }
}

<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <span class="ivu-badge avatar-name" v-if="username">{{ username }}</span>
      <Badge v-else>
        <Avatar style="background-color: #87d068" icon="ios-person" />
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import Cookies from "js-cookie"
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      username: ""
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    handleClick (name) {
      this.logout();
    }
  },
  mounted() {
    this.username = Cookies.get("jxyex-username");
  }
}
</script>
<style lang="less" scoped>
.avatar-name {
  display: inline-block;
  max-width: 90px;
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>

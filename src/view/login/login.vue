<style lang="less">
  @import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">

          <Form ref="form" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
            <FormItem prop="mobile">
              <Input v-model="form.mobile" placeholder="请输入用户名">
              <span slot="prepend">
                  <Icon :size="16" type="ios-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="form.password" placeholder="请输入密码">
              <span slot="prepend">
                  <Icon :size="14" type="md-lock"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="code" class="code-img">
              <Input v-model="form.code" placeholder="请输入验证码" />
              <img :src="imgLoadUrl + '/web/getAdminVCode?code=' + codeNum" @click="codeNum = Math.random()*10">
            </FormItem>
              <FormItem>
                <Button @click="handleSubmit" type="primary" long :loading="loading">登录</Button>
              </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/api'
import { setToken } from '@/libs/util'
import { mapMutations, mapActions } from 'vuex'
import config from '@/config'
import Cookies from 'js-cookie'
import secret from '@/libs/secret'

export default {
  data () {
    return {
      form: {
        mobile: '',
        password: '',
        code: ''
      },
      codeNum: 0,
      rules: {
        mobile: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    imgLoadUrl () {
      return process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          var key1 = 'b8182714d7765c6fa9437ca8e120af39'
          var key2 = '8e0ae4bab00a5005a887ca8f8155bcfc'
          var secretCode = key2 + this.form.code + key1
          sessionStorage.uuid = secretCode
          login({
            mobile: this.form.mobile,
            password: this.$public.fiveMd5(this.form.password, this),
            // pswd: secret.encrypt(this.form.password),
            code: this.form.code
          }).then(res => {
            if (res.data.code == '0') {
              this.$Message.success('登录成功')
              setToken(res.data.data.token)
              this.handleLogin(res.data.data.menuList)
              Cookies.set('jxyex-username', this.form.mobile, { expires: 7 })
              this.$router.push({
                name: 'home'
              })
            } else {
              this.$Message.warning(res.data.msg)
            }
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        } else {

        }
      })
    }
  }
}
</script>
<style lang="less">
  .code-img {
    .ivu-input-wrapper {
      width: 110px;
      margin-right: 10px;
    }
    img {
      vertical-align: middle;
      cursor: pointer;
    }
  }
</style>

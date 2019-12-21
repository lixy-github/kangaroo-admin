<template>
  <div class="role">
    <h3>修改角色</h3>
    <Form ref="formItem" :model="formItem" :rules="rules" :label-width="90" inline>
      <FormItem label="角色名称:" prop="roleName">
        <Input placeholder="请输入角色名称" v-model="formItem.roleName" />
      </FormItem>
        <FormItem label="角色描述:" prop="roleDesc">
          <Input placeholder="请输入角色描述" v-model="formItem.roleDesc" />
      </FormItem>
          <FormItem label="权限分配" class="checkAll"></FormItem>
          <div v-for="(item,index) in types" :key="index">
            <Checkbox class="bg border_d4 border_d2" :indeterminate="!item.checkAll" @click.prevent.native="handleCheckAll(index)" :value="item.checkAll">{{item.menuName}}</Checkbox>
            <div v-for="(items,indexs) in item.children" :key="indexs" style="padding-left:20px;">
              <Checkbox class="border_d2" v-model="items.checked" @on-change="checkAllGroupChange(index)">{{items.menuName}}</Checkbox>
            </div>
          </div>
          <FormItem>
            <Button type="primary" :loading="loading" @click="save">保存</Button>
          </FormItem>
    </Form>
  </div>
</template>

<script>
import { roleDetails, modifyRole } from '@/api/api'
export default {
  data () {
    const validateRoleName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色名称'))
      } else {
        callback()
      }
    }
    const validateRoleDesc = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入角色描述'))
      } else {
        callback()
      }
    }

    return {
      formItem: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { validator: validateRoleName, trigger: 'change' }
        ],
        roleDesc: [
          { validator: validateRoleDesc, trigger: 'change' }
        ]
      },
      checkAll: false,
      types: [], // 权限列表
      checkeds: [], // 选中的权限
      submitflag: true,
      loading: false
    }
  },
  methods: {
    checkAllGroupChange (index) {
      var state = false
      if (this.types[index].children && this.types[index].children.length) {
        state = this.types[index].children.every((val, index) => {
          return val.checked == true
        })
      }

      this.types[index].checkAll = state
    },
    handleCheckAll (index) {
      if (this.types[index].checkAll) {
        if (this.types[index].children && this.types[index].children.length) {
          this.types[index].children.map(val => {
            return (val.checked = false)
          })
        }
      } else {
        if (this.types[index].children && this.types[index].children.length) {
          this.types[index].children.map(val => {
            return (val.checked = true)
          })
        }
      }
      this.types[index].checkAll = !this.types[index].checkAll
    },
    // 获取权限数
    getData () {
      roleDetails({ id: this.$route.query.id }).then(res => {
        if (res.data.code = '0') {
          this.formItem = res.data.data.authRole
          res.data.data.menuList.forEach(val => {
            if (val.selected == 'selected') {
              val.checkAll = true
            } else {
              val.checkAll = false
            }
            if (val.children && val.children.length) {
              val.children.forEach(cld => {
                if (cld.selected == 'selected') {
                  cld.checked = true
                } else {
                  cld.checked = false
                }
              })

              val.checkAll = val.children.every(ee => {
                return ee.checked == true
              })
            }
          })

          this.types = res.data.data.menuList
        }
      })
    },
    // 保存
    save () {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          var dat = []

          this.types.forEach(val => {
            if (val.checkAll) {
              dat.push(val.id)
            }

            if (val.children && val.children.length) {
              val.children.forEach(cld => {
                if (cld.checked == true) {
                  dat.push(val.id)
                  dat.push(cld.id)
                }
              })
            }
          })

          dat = [...new Set(dat)].join(',')

          if (dat.length == 0) {
            this.$Message.warning('权限分配不能为空')
            return false
          }
          let _data = {
            id: this.$route.query.id,
            roleName: this.formItem.roleName,
            roleDesc: this.formItem.roleDesc,
            menuIds: dat
          }
          this.loading = true
          modifyRole(_data).then(res => {
            if (res.data.code = '0') {
              this.$Message.success('修改成功')
              this.$router.push('/power/role')
            } else {
              this.$Message.error(res.data.msg)
            }
            this.loading = false
          }).catch(err => {
            this.loading = false
          })
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
  .border_d2 {
    width: 77%;
    line-height: 60px;
    margin-left: 100px;
    padding: 0;
  }
  .role h3 {
    height: 40px;
    line-height: 40px;
    background: rgba(244, 244, 244, 1);
    border: 1px solid rgba(187, 187, 187, 1);
    padding-left: 23px;
  }
  .role form {
    border: 1px solid rgba(187, 187, 187, 1);
    padding-top: 20px;
    margin-bottom: 20px;
  }
  .role .ivu-form-item {
    margin-bottom: 0;
  }
  .role .checkAll {
    display: block;
    margin-bottom: 0;
  }
  .role .checkAll .ivu-form-item-label {
    font-size: 15px;
    font-weight: bold;
  }
  .role .bg_white .ivu-form-item-label {
    background-color: #fff;
  }
</style>

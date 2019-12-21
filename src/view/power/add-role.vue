<template>
  <div class="role">
    <h3>新增角色</h3>
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
import { menuList, addRole } from '@/api/api'
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
      loading: false,
      indeterminate: true,
      checkAll: false,
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
      types: [] // 权限列表
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
            roleName: this.formItem.roleName,
            roleDesc: this.formItem.roleDesc,
            menuIds: dat
          }
          this.loading = true
          addRole(_data).then(response => {
            if (response.data.code == '0') {
              this.$Message.success('添加成功')
              this.$router.push('/power/role')
            } else {
              this.$Message.error(response.data.msg)
            }
            this.loading = true
          }).catch(err => {
            this.loading = false
          })
        }
      })
    },
    // 查看菜单列表树
    getData () {
      menuList().then(res => {
        if (res.data.code == '0') {
          res.data.data.forEach(val => {
            val.checkAll = false
            if (val.children && val.children.length) {
              val.children.forEach(cld => {
                cld.checked = false
              })
            }
          })
          this.types = res.data.data
        }
      }).catch(err => { })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
  .border_d3 {
    background: white;
    display: flex;
    padding: 2px 80px;
    .ivu-checkbox-group {
      width: 20%;
    }
  }
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
    width: 100%;
    margin: 10px 0 0 20px;
  }
  .role .checkAll .ivu-form-item-label {
    font-size: 15px;
    font-weight: bold;
  }
  .role .bg_white .ivu-form-item-label {
    background-color: #fff;
  }
</style>

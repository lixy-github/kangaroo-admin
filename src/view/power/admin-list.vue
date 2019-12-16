<template>
  <div>
    <div style="margin-bottom:20px;">
      <Button type="primary" @click="add">新增</Button>
    </div>

    <Table stripe :columns="columns" :data="tableData"></Table>

    <Modal v-model="modalAdd" title="新增" :loading="loadingAdd" :mask-closable="false" @on-ok="okAdd">
      <Form ref="formAdd" :model="formAdd" :rules="rules" :label-width="80">
        <FormItem label="手机号" prop="mobile">
          <Input v-model="formAdd.mobile" placeholder="请输入手机号" />
                    </FormItem>
          <FormItem label="昵称" prop="nickName">
            <Input v-model="formAdd.nickName" placeholder="请输入昵称" />
                    </FormItem>
            <FormItem label="密码" prop="password">
              <Input v-model="formAdd.password" placeholder="请输入密码" />
                    </FormItem>
              <FormItem label="角色" prop="roleId">
                <Select v-model="formAdd.roleId">
                  <Option v-for="(item, index) in roles" :key="index" :value="item.id">{{ item.roleName }}</Option>
                </Select>
              </FormItem>
      </Form>
    </Modal>

    <!-- 修改 -->
    <Modal v-model="modalEdit" title="修改" :loading="loadingEdit" :mask-closable="false" @on-ok="okEdit">
      <Form ref="formEdit" :model="formEdit" :rules="rules" :label-width="80">
        <FormItem label="手机号" prop="mobile">
          <Input v-model="formEdit.mobile" placeholder="请输入手机号" />
                    </FormItem>
          <FormItem label="昵称" prop="nickName">
            <Input v-model="formEdit.nickName" placeholder="请输入昵称" />
                    </FormItem>
            <FormItem label="密码" prop="password">
              <Input v-model="formEdit.password" placeholder="请输入密码" />
                    </FormItem>
              <FormItem label="角色" prop="roleId">
                <Select v-model="formEdit.roleId">
                  <Option v-for="(item, index) in roles" :key="index" :value="item.id">{{ item.roleName }}</Option>
                </Select>
              </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { addUser, modifyUser, deleteUser, userList, userDetailes, roleList } from '@/api/api'
export default {
  data () {
    const validateMobile = (rule, value, callback) => {
      if (!this.$public.phone(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!this.$public.pwds(value)) {
        callback(new Error('密码格式为8-20位数字加字母'))
      } else {
        callback()
      }
    }

    return {
      columns: [
        {
          title: '手机号',
          key: 'mobile'
        },
        {
          title: '昵称',
          key: 'nickName'
        },
        {
          title: '所属角色',
          key: 'roleName'
        },
        {
          title: '时间',
          key: 'updateDate'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small',
                  type: 'success',
                  disabled: params.row.mobile == 'admin'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.edit(params.row.id)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  size: 'small',
                  type: 'error'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.remove(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: [],
      modalAdd: false,
      modalEdit: false,
      loadingAdd: true,
      loadingEdit: true,
      formAdd: {
        mobile: '',
        nickName: '',
        password: '',
        roleId: ''
      },
      formEdit: {
        mobile: '',
        nickName: '',
        password: ''
      },
      rules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { validator: validateMobile, trigger: 'change' }
        ],
        nickName: [
          { required: true, message: '昵称不能为空', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空' },
          { validator: validatePassword, trigger: 'change' }
        ],
        roleId: [
          { required: true, type: 'number', message: '角色不能为空', trigger: 'change' }
        ]
      },
      roles: []
    }
  },
  methods: {
    // 新增
    add () {
      this.$refs.formAdd.resetFields()
      this.modalAdd = true
    },
    okAdd () {
      this.loadingAdd = false
      this.$nextTick(() => {
        this.loadingAdd = true
      })

      this.$refs.formAdd.validate(valid => {
        if (valid) {
          let _data = {
            mobile: this.formAdd.mobile,
            nickName: this.formAdd.nickName,
            password: this.$public.fiveMd5(this.formAdd.password, this),
            roleId: this.formAdd.roleId
          }
          // this.formAdd.password = this.$public.fiveMd5(this.formAdd.password, this)
          addUser(_data).then(res => {
            if (res.data.code == '0') {
              this.$Message.success('新增成功')
              this.showTable()
            } else {
              this.$Message.warning(res.data.msg)
            }
            this.modalAdd = false
          }).catch(err => {
            this.modalAdd = false
          })
        }
      })
    },
    // 修改
    edit (id) {
      this.formEdit.id = id
      this.$refs.formEdit.resetFields()
      this.modalEdit = true
      userDetailes({ id: id }).then(res => {
        if (res.data.code == '0') {
          this.formEdit = res.data.data.authUser
          this.formEdit.password = ''
          this.formEdit.roleId = res.data.data.roleId
        }
      })
    },
    okEdit () {
      this.loadingEdit = false
      this.$nextTick(() => {
        this.loadingEdit = true
      })

      this.$refs.formEdit.validate(valid => {
        if (valid) {
          let _data = {
            id: this.formEdit.id,
            mobile: this.formEdit.mobile,
            nickName: this.formEdit.nickName,
            password: this.$public.fiveMd5(this.formEdit.password, this),
            roleId: this.formEdit.roleId
          }
          modifyUser(_data).then(res => {
            if (res.data.code == '0') {
              this.$Message.success('修改成功')
              this.modalEdit = false
              this.showTable()
            } else {
              this.$Message.warning(res.data.msg)
            }
          }).catch(err => {
            this.modalEdit = false
          })
        }
      })
    },
    // 删除
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '您确定要删除该项吗？',
        onOk: () => {
          deleteUser({ id: id }).then(res => {
            if (res.data.code == '0') {
              this.$Message.success('操作成功')
              this.showTable()
            } else {
              this.$Message.warning(res.data.msg)
            }
          }).catch(err => { })
        },
        onCancel: () => {
          this.$Message.info('已取消操作')
        }
      })
    },
    // 用户列表
    showTable () {
      userList().then(res => {
        if (res.data.code == '0') {
          this.tableData = res.data.data
        } else {
          this.tableData = []
          this.$Message.warning(res.data.msg)
        }
      }).catch(err => { })
    },
    // 角色列表
    roleLists () {
      roleList().then(res => {
        if (res.data.code == '0') {
          this.roles = res.data.data
        } else {
          this.$Message.warning(res.data.msg)
        }
      }).catch(err => { })
    }
  },
  mounted () {
    this.showTable()
    this.roleLists()
  }
}
</script>

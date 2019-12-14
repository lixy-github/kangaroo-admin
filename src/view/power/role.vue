<template>
  <div>
    <Button type="primary" @click="addRole" style="margin-bottom:20px;">新增</Button>

    <Table stripe :columns="columns" :data="tableData"></Table>
  </div>
</template>
<script>
import {
  roleList,
  deleteRole
} from '@/api/api'
export default {
  data () {
    return {
      columns: [
        {
          title: '角色名称',
          key: 'roleName'
        },
        {
          title: '描述',
          key: 'roleDesc'
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  size: 'small',
                  type: 'primary'
                },
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.edit(params.row.id)
                  }
                }
              }, '编辑'),
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
      tableData: []
    }
  },
  methods: {
    // 新增
    addRole () {
      this.$router.push({
        name: 'add-role'
      })
    },
    // 编辑
    edit (id) {
      this.$router.push({
        path: '/edit-role-href/edit-role',
        query: { id: id }
      })
    },
    // 删除
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '您确定要删除该项吗？',
        onOk: () => {
          deleteRole({ id: id }).then(res => {
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
    // 列表
    showTable () {
      roleList().then(res => {
        if (res.data.code == '0') {
          this.tableData = res.data.data
        } else {
          this.tableData = []
          this.$Message.warning(res.data.msg)
        }
      }).catch(err => { })
    }
  },
  mounted () {
    this.showTable()
  }
}
</script>

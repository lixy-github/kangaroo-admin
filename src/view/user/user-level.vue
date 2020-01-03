<template>
  <div>
    <Row style="padding-bottom: 20px;">
      <Col span="1" offset="1" style="width: 200px">
      <Button type="primary" @click="addBtn('formValidate')" style="margin-right:20px;">添加用户等级</Button>
      </Col>
    </Row>
    <!-- 表格 -->
    <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe width="800">
    </Table>
    <!-- 分页 -->
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="pageData.total" :current="pageData.pageIndex" @on-change="changePage" :page-size="pageData.pageSize"></Page>
      </div>
    </div>
    <!-- 代理级别 -->
    <Modal v-model="modal" :title="title">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="等级：" prop="level">
          <Input v-model="formValidate.level" placeholder="请输入等级" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
        </FormItem>
        <FormItem label="等级经验值：" prop="levelValue">
          <Input v-model="formValidate.levelValue" placeholder="请输入等级经验值" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modal = false">取消</Button>
        <Button type="primary" size="large" @click="handleSubmit('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { userLevelList, userLeveldelete, userLeveladd, userLevelupdate } from '@/api/user'
  export default {
    name: 'discountCoupon',
    data() {
      return {
        modal: false,
        formValidate: {
          level: '',
          levelValue: ''
        },
        ruleValidate: {
          level: [
            { required: true, message: '请输入等级', trigger: 'blur' },
            { pattern: /^\+?[0-9]\d*$/, message: '请输入整数', trigger: 'blur' }
          ],
          levelValue: [
            { required: true, message: '请输入等级经验值', trigger: 'blur' },
            { pattern: /^\+?[0-9]\d*$/, message: '请输入整数', trigger: 'blur' }
          ]
        },
        rowId: '',
        tableData: [],
        tableColumns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '经验值',
            align: 'center',
            key: 'levelValue',
            minWidth: 100
          },
          {
            title: '等级',
            align: 'center',
            key: 'level',
            minWidth: 80
          },
          // {
          //   title: '操作',
          //   align: 'center',
          //   minWidth: 150,
          //   render: (h, params) => {
          //     const row = params.row
          //     const status = row.status
          //     const text = ''
          //     return h('div', [
          //       h('Button', {
          //         props: {
          //           type: 'primary',
          //           size: 'small'
          //         },
          //         style: {
          //           marginRight: '5px'
          //         },
          //         on: {
          //           click: () => {
          //             this.edit(row)
          //           }
          //         }
          //       }, '编辑'),
          //       h('Button', {
          //         props: {
          //           type: 'error',
          //           size: 'small'
          //         },
          //         style: {
          //           marginRight: '5px'
          //         },
          //         on: {
          //           click: () => {
          //             this.delete(row)
          //           }
          //         }
          //       }, '删除')
          //     ])
          //   }
          // }
        ],
        pageData: {
          total: 0, // 总共多少数据
          pages: 0, // 总页数
          pageIndex: 1, // 当前页
          pageSize: 15 // 每页数据条数
        },
        title: ''
      }
    },
    methods: {
      // 获取
      getData() {
        this.agentLevelList = []
        let _data = {
          pageIndex: this.pageData.pageIndex,
          pageSize: this.pageData.pageSize
        }
        userLevelList(_data).then(res => {
          if(res.data.code == '0') {
            this.tableData = res.data.data.dataList
            this.pageData.total = res.data.data.total
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      // 切换页码
      changePage(current) {
        this.pageData.pageIndex = current
        this.tableData = this.getData()
      },
      // 新增
      addBtn(name) {
        this.modal = true
        this.title = '添加用户等级'
        this.$refs[name].resetFields()
        // this.formValidate.level = ''
        // this.formValidate.levelValue = ''
      },
      // 删除等级
      delete(row) {
        this.$Modal.confirm({
          title: '提示',
          content: `确定要删除此等级吗？`,
          onOk: () => {
            userLeveldelete({
              id: row.id
            }).then(res => {
              if(res.data.code == '0') {
                this.$Message.success('删除成功')
                this.getData()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          },
          onCancel: () => {
            this.$Message.info('已取消')
          }
        })
      },
      // 编辑
      edit(row) {
        this.rowId = row.id
        this.modal = true
        this.title = '编辑用户等级'
        this.formValidate.level = row.level
        this.formValidate.levelValue = row.levelValue
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if(valid) {
            if(this.title == '添加用户等级') {
              userLeveladd({
                level: this.formValidate.level,
                levelValue: this.formValidate.levelValue
              }).then(res => {
                if(res.data.code == '0') {
                  this.modal = false
                  this.$Message.success('添加成功')
                  this.getData()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
            } else {
              userLevelupdate({
                id: this.rowId,
                level: this.formValidate.level,
                levelValue: this.formValidate.levelValue
              }).then(res => {
                if(res.data.code == '0') {
                  this.modal = false
                  this.$Message.success('修改成功')
                  this.getData()
                } else {
                  this.$Message.error(res.data.msg)
                }
              })
            }
          }
        })
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>
<style lang="less">
</style>

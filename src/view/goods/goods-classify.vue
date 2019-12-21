<template>
  <div>
    <!-- <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> -->
    <Form :label-width="80">
      <Row style="padding-bottom: 20px;">
        <!-- <Col span="3" style="width:300px">
        <FormItem label="分类名称">
          <Input v-model="name" placeholder="分类名称查询"/>
        </FormItem>
          </Col> -->
        <Col span="1" offset="1" style="width: 200px">
        <!-- <Button type="primary" @click="onSearch" style="margin-right:20px;">搜索</Button> -->
        <Button type="primary" @click="addBtn">添加商品分类</Button>
        </Col>
      </Row>
    </Form>
    <!-- 表格 -->
    <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe width="800">
    </Table>
    <!-- 编辑 -->
    <Modal v-model="modal" :title="title">
      <Form :model="formItem" :label-width="80">
        <FormItem label="分类名称：">
          <Input v-model="formItem.name" placeholder="请输入商品分类名称"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { classfindList } from '@/api/district'
import { goodsclassmodify, goodsclassadd, goodsclassremove } from '@/api/goods'
export default {
  name: 'goodsClassify',
  data () {
    return {
      modal: false,
      title: '',
      name: '',
      rowId: '',
      formItem: {
        name: ''
      },
      tableData: [],
      tableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '分类名称',
          align: 'center',
          key: 'name',
          minWidth: 150
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.delete(row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    // 获取
    getData () {
      classfindList().then(res => {
        if (res.data.code == '0') {
          this.tableData = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 搜索
    onSearch () {
      this.getData()
    },
    // 编辑
    edit (row, status) {
      this.modal = true
      this.title = '修改商品分类'
      this.rowId = row.id
      this.formItem.name = row.name
    },
    addBtn () {
      this.modal = true
      this.title = '添加商品分类'
      this.formItem.name = ''
    },
    // 修改/添加
    ok () {
      if (this.formItem.name == '') {
        this.$Message.info('请输入商品分类名称')
        return
      }
      if (this.title == '添加商品分类') {
        goodsclassadd({
          name: this.formItem.name
        }).then(res => {
          if (res.data.code == '0') {
            this.modal = false
            this.$Message.success('添加成功')
            this.getData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      } else {
        goodsclassmodify({
          id: this.rowId,
          name: this.formItem.name
        }).then(res => {
          if (res.data.code == '0') {
            this.modal = false
            this.$Message.success('修改成功')
            this.getData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      }
    },
    // 删除
    delete (id) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除此商品分类吗？`,
        onOk: () => {
          goodsclassremove({
            id: id
          }).then(res => {
            if (res.data.code == '0') {
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
    cancel () {
      this.modal = false
      this.$Message.info('已取消')
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less" scoped>
  .title {
    height: 42px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background: #ebebeb;
    color: #333333;
    text-align: left;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 20px;
    > i {
      cursor: pointer;
      line-height: 24px !important;
      color: #444444;
    }
  }
</style>

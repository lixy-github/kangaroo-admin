<template>
  <div>
    <!-- <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> -->
    <Form :label-width="50">
      <Row style="padding-bottom: 20px;">
        <Col span="3" style="width:200px">
        <FormItem label="区域">
          <Select v-model="scope">
            <Option value="">全部</Option>
            <Option value="RUSH">抢购区</Option>
            <Option value="BATCH">批发区</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="1" offset="1" style="width: 200px">
        <Button type="primary" @click="onSearch" style="margin-right:20px;">搜索</Button>
        <Button type="primary" @click="addBtn">添加区域时段</Button>
        </Col>
      </Row>
    </Form>
    <!-- 表格 -->
    <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe width="800">
    </Table>
    <!-- 编辑 -->
    <Modal v-model="modal" :title="title">
      <Form :model="formItem" :label-width="80">
        <FormItem label="时间：">
          <TimePicker v-model="formItem.time" format="HH:mm" placeholder="时:分"></TimePicker>
        </FormItem>
        <FormItem label="区域：" v-if="title == '添加区域时段'">
          <RadioGroup v-model="formItem.scope">
            <Radio label="RUSH">抢购区</Radio>
            <Radio label="BATCH">批发区</Radio>
          </RadioGroup>
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
import { templatefindList, templateadd, templatemodify, templateremove } from '@/api/district'
export default {
  name: 'goodsClassify',
  data () {
    return {
      scope: '',
      modal: false,
      title: '',
      name: '',
      rowId: '',
      formItem: {
        time: '',
        scope: 'RUSH'
      },
      hours: '',
      min: '',
      tableData: [],
      tableColumns: [
        {
          title: 'id',
          key: 'id',
          width: 60,
          align: 'center'
        },
        {
          title: '小时：分钟',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('div', {}, params.row.hours + ':' + params.row.min)
          }
        },
        {
          title: '隶属区域',
          align: 'center',
          key: 'scope',
          minWidth: 150,
          render: (h, params) => {
            return h('div', {}, params.row.scope == 'RUSH' ? '抢购区' : '批发区')
          }
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
      templatefindList({
        scope: this.scope// RUSH,//抢购  BATCH,//批发
      }).then(res => {
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
      this.title = '修改区域时段'
      this.rowId = row.id
      this.formItem = {
        time: row.hours.toString() + ':' + row.min.toString(),
        scope: row.scope
      }
      this.hours = row.hours.toString()
      this.min = row.min.toString()
    },
    addBtn () {
      this.modal = true
      this.title = '添加区域时段'
      this.formItem = {
        time: '',
        scope: 'RUSH'
      }
      this.hours = ''
      this.min = ''
    },
    // 修改/添加
    ok () {
      if (this.formItem.time == '') {
        this.$Message.info('请选择时间')
        return
      }
      if (this.title == '添加区域时段') {
        templateadd({
          hours: this.formItem.time.split(':')[0],
          min: this.formItem.time.split(':')[1],
          scope: this.formItem.scope
        }).then(res => {
          if (res.data.code == '0') {
            this.modal = false
            this.$Message.success('添加成功')
            this.getData()
          } else {
            this.modal = false
            this.$Message.error(res.data.msg)
          }
        })
      } else {
        templatemodify({
          id: this.rowId,
          hours: this.formItem.time.split(':')[0],
          min: this.formItem.time.split(':')[1],
          scope: this.formItem.scope
        }).then(res => {
          if (res.data.code == '0') {
            this.modal = false
            this.$Message.success('修改成功')
            this.getData()
          } else {
            this.modal = false
            this.$Message.error(res.data.msg)
          }
        })
      }
    },
    // 删除
    delete (id) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除此区域时段吗？`,
        onOk: () => {
          templateremove({
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
<style lang="less">
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

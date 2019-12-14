<template>
  <div>
    <!-- 表格 -->
    <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe>
    </Table>
    <!-- 分页 -->
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="pageData.total" :current="pageData.pageIndex" @on-change="changePage" :page-size="pageData.pageSize"></Page>
      </div>
    </div>
    <!-- 编辑 -->
    <Modal v-model="modal" title="编辑">
      <Form :model="formItem" :label-width="80">
        <FormItem label="Value：">
          <Input v-model="formItem.configVal" placeholder="请输入配置值"></Input>
        </FormItem>
        <FormItem label="描述：">
          <Input v-model="formItem.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入描述"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modal = false">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { sysfindList, sysmodify } from '@/api/config'
export default {
  name: 'discountCoupon',
  data () {
    return {
      formItem: {
        id: '',
        configKey: '',
        configVal: '',
        remark: ''
      },
      detailsIsShow: false,
      title: '',
      tableData: [],
      tableColumns: [
        {
          title: '#',
          type: 'index',
          align: 'center',
          minWidth: 50
        },
        {
          title: 'Value',
          align: 'center',
          minWidth: 150,
          key: 'configVal'
        },
        {
          title: '描述',
          align: 'center',
          minWidth: 150,
          key: 'remark'
        },
        {
          title: '操作',
          align: 'center',
          key: 'type',
          minWidth: 80,
          render: (h, p) => {
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
                    this.edit(p.row)
                  }
                }
              }, '编辑')
            ])
          }
        }
      ],
      pageData: {
        total: 0, // 总共多少数据
        pages: 0, // 总页数
        pageIndex: 1, // 当前页
        pageSize: 15 // 每页数据条数
      },
      modal: false
    }
  },
  methods: {
    // 获取
    getData () {
      let _data = {
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        configKey: 'USER_PROPORTION,CITY_PROPORTION,PROVINCE_PROPORTION'
      }
      sysfindList(_data).then(res => {
        if (res.data.data.code == '0') {
          this.tableData = res.data.data.data.dataList
          this.pageData.total = res.data.data.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 搜索
    onSearch () {
      this.pageData.pageIndex = 1
      this.getData()
    },
    // 切换页码
    changePage (current) {
      this.pageData.pageIndex = current
      this.tableData = this.getData()
    },
    edit (row) {
      this.modal = true
      this.formItem = {
        id: row.id,
        configKey: row.configKey,
        configVal: row.configVal,
        remark: row.remark
      }
    },
    ok () {
      sysmodify(this.formItem).then(res => {
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
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">
</style>

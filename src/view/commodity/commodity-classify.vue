<template>
  <div>
    <!-- <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> -->
    <Form :label-width="80">
      <Row style="padding-bottom: 20px;">
        <Col span="3" style="width:300px">
        <FormItem label="分类名称">
          <Input v-model="name" placeholder="分类名称查询"/>
        </FormItem>
          </Col>
          <Col span="1" offset="1" style="width: 200px">
          <Button type="primary" @click="onSearch" style="margin-right:20px;">搜索</Button>
          <Button type="primary" @click="addBtn" style="margin-right:20px;">添加商品分类</Button>
          </Col>
      </Row>
    </Form>
    <!-- 表格 -->
    <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe width="800">
    </Table>
    <!-- 分页 -->
    <div style="margin: 10px;overflow: hidden;width:800px;">
      <div style="float: right;">
        <Page :total="pageData.total" :current="pageData.pageIndex" @on-change="changePage" :page-size="pageData.pageSize"></Page>
      </div>
    </div>
    <!-- 编辑 -->
    <Modal v-model="modal" title="Common Modal dialog box title" @on-ok="ok" @on-cancel="cancel">
      <p>Content of dialog</p>
      <p>Content of dialog</p>
      <p>Content of dialog</p>
    </Modal>
  </div>
</template>
<script>
import _request from '@/utils/request'
import { couponList } from '@/api/api'
import config from '@/config'
export default {
  name: 'discountCoupon',
  data () {
    return {
      modal: false,
      name: '',
      rowId: '',
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
                    this.edit(row.id)
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
      }
    }
  },
  computed: {
    imgLoadUrl () {
      return process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
    }
  },
  methods: {
    // 获取
    getData () {
      let _data = {
        name: this.name,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize
      }
      _request.http(this, '/admin/goods/class/findList', _data).then(res => {
        this.tableData = res.data.data.dataList
        this.pageData.total = res.data.data.total
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
      this.tableData = this.mockTableData()
    },
    // 开始/结束
    edit (id, status) {
      this.modal = true
    },
    addBtn () {
      this.$router.push('coupon-add')
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
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

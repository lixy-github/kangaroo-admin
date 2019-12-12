<template>
  <div>
    <!-- <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> -->
    <Form :model="formItem" :label-width="80">
      <Row style="padding-bottom: 20px;">
        <Col span="3" style="width: 250px">
        <FormItem label="有效期类型">
          <Select v-model="formItem.type">
            <Option value="">全部</Option>
            <Option value="COUNT">倒计时</Option>
            <Option value="TERM">时间段</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="3" style="width: 300px">
        <FormItem label="日期">
          <DatePicker type="daterange" v-model="formItem.time" split-panels placeholder="选择日期" style="width: 200px" format="yyyy-MM-dd" @on-change="formItem.time=$event"></DatePicker>
        </FormItem>
        </Col>
        <Col span="1" offset="1" style="width: 200px">
        <Button type="primary" @click="onSearch" style="margin-right:20px;">搜索</Button>
        </Col>
      </Row>
    </Form>
    <!-- 表格 -->
    <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe>
    </Table>
    <!-- 分页 -->
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="pageData.total" :current="pageData.pageIndex" @on-change="changePage" :page-size="pageData.pageSize"></Page>
      </div>
    </div>
  </div>
</template>
<script>
import _request from '@/utils/request'
import { couponList } from '@/api/api'
import config from '@/config'
export default {
  name: 'discountCoupon',
  data () {
    var transStatus = (val) => {
      var obj = {
        'WAITING': '未开始',
        'OPEN': '进行中',
        'CLOSE': '结束'
      }
      return obj[val]
    }
    return {
      formItem: {
        time: '',
        type: ''
      },
      detailsIsShow: false,
      title: '',
      rowId: '',
      tableData: [],
      tableColumns: [
        {
          title: 'id',
          align: 'center',
          key: 'id',
          minWidth: 50
        },
        {
          title: '开始时间',
          align: 'center',
          minWidth: 150,
          render: (h, p) => {
            return h('div', {}, p.row.startDate ? p.row.startDate : '--')
          }
        },
        {
          title: '结束时间',
          align: 'center',
          minWidth: 150,
          render: (h, p) => {
            return h('div', {}, p.row.endDate ? p.row.endDate : '--')
          }
        },
        {
          title: '优惠券名称',
          align: 'center',
          key: 'name',
          minWidth: 100
        },
        {
          title: '面值',
          align: 'center',
          key: 'price',
          minWidth: 80
        },
        {
          title: '描述',
          align: 'center',
          minWidth: 100,
          render: (h, p) => {
            return h('div', {}, p.row.detail ? p.row.detail : '--')
          }
        },
        {
          title: '发放量',
          align: 'center',
          key: 'number',
          minWidth: 80
        },
        {
          title: '领取数量',
          align: 'center',
          key: 'alreadyNumber',
          minWidth: 100
        },
        {
          title: '开始/结束',
          align: 'center',
          key: 'status',
          minWidth: 120,
          render: (h, p) => {
            return h('div', {}, transStatus(p.row.status))
          }
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            const status = row.status
            const text = ''
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  // display: status == 'CLOSE' ? 'none' : 'block',
                  float: 'left'
                },
                on: {
                  click: () => {
                    this.edit(row.id, status)
                  }
                }
              }, status == 'OPEN' ? '结束' : '开始')
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
  methods: {
    // 获取
    getData () {
      let startDate = this.formItem.time[0]
      let endDate = this.formItem.time[1]
      let _data = {
        startDate: startDate ? startDate + ' 00:00:00' : '',
        endDate: endDate ? endDate + ' 23:59:59' : '',
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        type: this.formItem.type// 类型
      }
      _request.http(this, '/admin/coupon/list', _data).then(res => {
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
      this.$Modal.confirm({
        title: '提示',
        content: `确定要${status == 'OPEN' ? '结束' : '开始'}此优惠券吗？`,
        onOk: () => {
          _request.http(this, '/admin/coupon/switch', {
            id: id,
            status: status == 'OPEN' ? 'CLOSE' : 'OPEN'
          }).then(res => {
            this.$Message.success('操作成功')
            this.getData()
          })
        },
        onCancel: () => {
          this.$Message.info('已取消')
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

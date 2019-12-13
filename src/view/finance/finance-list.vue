<template>
  <div>
    <Form :model="formItem" :label-width="80">
      <Row style="padding-bottom: 20px;">
        <Col span="3" style="width: 250px">
        <FormItem label="手机号">
          <Input v-model="formItem.userPhone" placeholder="手机号查询"></Input>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="订单状态">
          <Select v-model="formItem.orderStatus">
            <Option value="">全部</Option>
            <Option value="UNPAID">未支付</Option>
            <Option value="CLOSED">已关闭</Option>
            <Option value="ALREADY_PAID">已支付</Option>
            <Option value="WAIT_SHIP">待发货</Option>
            <Option value="SMALL_CONSIGNMENT">小排序寄售</Option>
            <Option value="BIG_CONSIGNMENT">大排序寄售</Option>
            <Option value="SUCCESS_CONSIGNMENT">寄售成功</Option>
            <Option value="ALREADY_SHIP">已发货</Option>
            <Option value="ALREADY_RECEIPT">已收货</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="订单类型">
          <Select v-model="formItem.orderType">
            <Option value="">全部</Option>
            <Option value="ORDINARY">普通订单</Option>
            <Option value="REDEMPTION">换购订单</Option>
            <Option value="CONSIGNMENT">寄售订单</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="订单单号">
          <Input v-model="formItem.orderNo" placeholder="订单单号查询"></Input>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="收货人姓名">
          <Input v-model="formItem.name" placeholder="收货人姓名查询"></Input>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="收货人电话">
          <Input v-model="formItem.phone" placeholder="收货人电话查询"></Input>
        </FormItem>
        </Col>
        <Col span="3" style="width: 300px">
        <FormItem label="创建时间">
          <DatePicker type="daterange" v-model="formItem.time" split-panels placeholder="选择日期" format="yyyy-MM-dd" @on-change="formItem.time=$event"></DatePicker>
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
import { orderlist } from '@/api/order'
export default {
  name: 'discountCoupon',
  data () {
    /* 状态 */
    var transStatus = (val) => {
      var obj = {
        'UNPAID': '未支付',
        'CLOSED': '已关闭',
        'ALREADY_PAID': '已支付',
        'WAIT_SHIP': '待发货',
        'SMALL_CONSIGNMENT': '小排序寄售',
        'BIG_CONSIGNMENT': '大排序寄售',
        'SUCCESS_CONSIGNMENT': '寄售成功',
        'ALREADY_SHIP': '已发货',
        'ALREADY_RECEIPT': '已收货'
      }
      return obj[val]
    }
    /* 类型 */
    var transType = (val) => {
      var obj = {
        'ORDINARY': '普通订单',
        'REDEMPTION': '换购订单',
        'CONSIGNMENT': '寄售订单'
      }
      return obj[val]
    }
    return {
      formItem: {
        time: '',
        goodsName: '',
        name: '',
        orderNo: '',
        orderStatus: '',
        orderType: '',
        phone: '',
        userPhone: ''
      },
      detailsIsShow: false,
      title: '',
      rowId: '',
      tableData: [],
      tableColumns: [
        {
          title: '收货人姓名',
          align: 'center',
          minWidth: 150,
          key: 'name'
        },
        {
          title: '收货人电话',
          align: 'center',
          minWidth: 150,
          key: 'phone'
        },
        {
          title: '订单单号',
          align: 'center',
          minWidth: 150,
          key: 'orderNo'
        },
        {
          title: '订单状态',
          align: 'center',
          key: 'orderStatus',
          minWidth: 100,
          render: (h, p) => {
            return h('div', {}, transStatus(p.row.orderStatus))
          }
        },
        {
          title: '订单类型',
          align: 'center',
          key: 'orderType',
          minWidth: 80,
          render: (h, p) => {
            return h('div', {}, transType(p.row.orderType))
          }
        },
        {
          title: '购买数量',
          align: 'center',
          key: 'buyCount',
          minWidth: 80
        },
        {
          title: '封面图',
          align: 'center',
          key: 'price',
          minWidth: 80,
          render: (h, p) => {
            return h('img', {
              attrs: {
                src: p.row.imageUsable,
                style: 'height:40px;margin-top:5px;'
              }
            }, p.index + (this.pageData.curPage - 1) * this.pageData.pageSize + 1)
          }
        },
        {
          title: '创建时间',
          align: 'center',
          minWidth: 150,
          key: 'createDate'
        },
        {
          title: '操作',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            const row = params.row
            const text = ''
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: row.orderStatus == 'WAIT_SHIP' ? 'block' : 'none'
                },
                on: {
                  click: () => {
                    this.edit(row.id, status)
                  }
                }
              }, '发货')
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
        goodsName: this.formItem.goodsName, // 商品名称
        name: this.formItem.name, // 收货人姓名
        orderNo: this.formItem.orderNo, // 订单单号
        orderStatus: this.formItem.orderStatus, // 订单状态
        orderType: this.formItem.orderType, // 订单类型
        phone: this.formItem.phone, // 收货人电话
        userPhone: this.formItem.userPhone// 手机号
      }
      orderlist(_data).then(res => {
        if (res.data.code == '0') {
          this.tableData = res.data.data.dataList
          this.pageData.total = res.data.data.total
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
    // 开始/结束
    edit (id, status) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要${status == 'OPEN' ? '结束' : '开始'}此优惠券吗？`,
        onOk: () => {
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

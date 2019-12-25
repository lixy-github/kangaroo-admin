<template>
  <div>
    <Form :model="formItem" :label-width="80">
      <Row style="padding-bottom: 20px;">
        <Col span="3" style="width: 250px">
        <FormItem label="用户Id">
          <Input v-model="formItem.userId" placeholder="用户Id查询"></Input>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="类型">
          <Select v-model="formItem.type">
            <Option value="">全部</Option>
            <Option value="RECHARGE">充值</Option>
            <Option value="WITHDRAW">提现</Option>
            <Option value="CONSIGNMENT">寄售</Option>
            <Option value="BUY">人民币购买</Option>
            <Option value="REBATE">返佣</Option>
            <Option value="ORDERTIMECOUNT">订单取消</Option>
            <Option value="BUY_COUNPN">消费券购买</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="金额类型">
          <Select v-model="formItem.moneyType">
            <Option value="">全部</Option>
            <Option value="MONEY">人民币</Option>
            <Option value="CONSUMPTION">消费券</Option>
            <!-- <Option value="DISCOUNT">优惠券</Option> -->
          </Select>
        </FormItem>
        </Col>
        <Col span="1" offset="1" style="width: 200px">
        <Button type="primary" @click="onSearch" style="margin-right:20px;">搜索</Button>
        <!-- <Export :ajax="recordfindList" :params="exParmas" :map="{data:'data.data.dataList',count:'data.data.total'}" fileName="资产明细" :filter="exFilter" :columns="tableColumns"></Export> -->
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
import Export from '@/components/export/export.vue'
import { recordfindList } from '@/api/finance'
export default {
  name: 'discountCoupon',
  components: {
    Export
  },
  data () {
    var transmoneyType = (val) => {
      var obj = {
        'MONEY': '人民币',
        'CONSUMPTION': '消费券'
        // 'DISCOUNT': '优惠券'
      }
      return obj[val]
    }
    /* 类型 */
    var transType = (val) => {
      var obj = {
        'RECHARGE': '充值',
        'WITHDRAW': '提现',
        'CONSIGNMENT': '寄售',
        'BUY': '人民币购买',
        'REBATE': '返佣',
        'ORDERTIMECOUNT': '订单取消',
        'BUY_COUNPN': '消费券购买'
      }
      return obj[val]
    }
    return {
      formItem: {
        time: '',
        userId: '',
        type: '',
        moneyType: ''
      },
      recordfindList,
      exParmas: {},
      exFilter: {
        moneyType: transmoneyType,
        type: transType
      },
      detailsIsShow: false,
      title: '',
      rowId: '',
      tableData: [],
      tableColumns: [
        {
          title: '用户Id',
          align: 'center',
          minWidth: 50,
          key: 'userId'
        },
        {
          title: '操作金额',
          align: 'center',
          minWidth: 150,
          key: 'money',
          render: (h, p) => {
            return h('div', {
              style: {
                // color: p.row.money > 0 ? 'green' : 'red'
              }
            }, p.row.moneyType == 'MONEY' ? p.row.money / 100 : p.row.money)
          }
        },
        {
          title: '变动前金额',
          align: 'center',
          minWidth: 150,
          key: 'beforeMoney',
          render: (h, p) => {
            return h('div', {}, p.row.moneyType == 'MONEY' ? p.row.beforeMoney / 100 : p.row.beforeMoney)
          }
        },
        {
          title: '变动后金额',
          align: 'center',
          key: 'afterMoney',
          minWidth: 100,
          render: (h, p) => {
            return h('div', {}, p.row.moneyType == 'MONEY' ? p.row.afterMoney / 100 : p.row.afterMoney)
          }
        },
        {
          title: '金额类型',
          align: 'center',
          key: 'moneyType',
          minWidth: 80,
          render: (h, p) => {
            return h('div', {}, transmoneyType(p.row.moneyType))
          }
        },
        {
          title: '类型',
          align: 'center',
          key: 'type',
          minWidth: 80,
          render: (h, p) => {
            return h('div', {}, transType(p.row.type))
          }
        },
        {
          title: '时间',
          align: 'center',
          key: 'createDate',
          minWidth: 150
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
      // let startDate = this.formItem.time[0]
      // let endDate = this.formItem.time[1]
      let _data = {
        // startDate: startDate ? startDate + ' 00:00:00' : '',
        // endDate: endDate ? endDate + ' 23:59:59' : '',
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        userId: this.formItem.userId,
        type: this.formItem.type,
        moneyType: this.formItem.moneyType
      }
      this.exParmas = _data
      recordfindList(_data).then(res => {
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
    }
  },
  created () {
    this.getData()
  }
}
</script>
<style lang="less">
</style>

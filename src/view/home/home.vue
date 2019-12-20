<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="20" :md="20" :lg="20" style="height: 80px;padding-bottom: 20px;">
        <h2 style="margin-bottom:25px;float:left;">待办事项：</h2>
        <Badge :count="sumBuyCount" style="margin-right:50px;">
          <Button @click="orderBtn">用户当天寄售商品总量</Button>
        </Badge>
        <Badge :count="orderNum">
          <Button @click="orderListBtn">待发货订单数</Button>
          <!-- <Button @click="ceshi">测试</Button> -->
        </Badge>
      </i-col>
    </Row>
    <Row :gutter="20" type="flex" justify="space-between">
      <i-col :xs="14" :md="14" :lg="7" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 200px;padding-bottom: 80px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="16" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 400px; " :value="barDatati" text="销售额趋势" />
        </Card>
      </i-col>
      <i-col :md="8" :lg="8" style="margin-bottom: 20px;">
        <Tabs @getdata="getdata" :salesList="salesList"></Tabs>
      </i-col>
    </Row>
  </div>
</template>
<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import { indexCount, adminIndex, hello } from '@/api/api'
import Tabs from './common/tabs'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Tabs
  },
  data () {
    return {
      salesList: [],
      blockData: {
        sumMoney: 0,
        countUser: 0,
        countOrder: 0
      },
      orderNum: 0,
      sumBuyCount: 0,
      barDatati: {

      }
    }
  },
  computed: {
    inforCardData () {
      return [
        {
          title: '日支付额',
          icon: 'logo-usd',
          count: this.blockData.sumMoney,
          color: '#19be6b'
        },
        {
          title: '日新增会员量',
          icon: 'md-person-add',
          count: this.blockData.countUser,
          color: '#ff9900'
        },
        {
          title: '日下单数',
          icon: 'md-cart',
          count: this.blockData.countOrder,
          color: '#ed4014'
        }
      ]
    }
  },
  methods: {
    getdata (type) {
      indexCount({
        countType: type
      }).then(res => {
        if (res.data.code == '0') {
          this.barDatati = res.data.data.monthMap
          this.salesList = res.data.data.salesList
        } else {
          this.$Message.error('获取数据失败')
        }
      }).catch(function (error) {
      })
      adminIndex().then(res => {
        if (res.data.code == '0') {
          let _data = res.data.data
          this.blockData = {
            sumMoney: _data.sumMoney,
            countUser: _data.countUser,
            countOrder: _data.countOrder
          }
          this.orderNum = _data.orderNum
          this.sumBuyCount = _data.sumBuyCount
        } else {
          this.$Message.error('获取数据失败')
        }
      }).catch(function (error) {
      })
    },
    orderListBtn () {
      this.$router.push({
        name: 'order-list',
        query: {
          status: 'WAIT_SHIP'
        }
      })
    },
    ceshi () {
      hello('{}').then(res => {
      }).catch(function (error) {
      })
    },
    orderBtn () {
      this.$router.push({
        name: 'order-list',
        query: {
          type: 'CONSIGNMENT'
        }
      })
    }
  },
  created () {
    this.getdata('day')
  }
}
</script>
<style lang="less">
  .count-style {
    font-size: 28px;
  }
</style>

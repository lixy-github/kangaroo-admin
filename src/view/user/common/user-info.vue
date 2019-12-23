<template>
  <div>
    <!-- 用户详情 -->
    <ty-right-model :isShow="true" @changeModelStatus="HandlClose(false)">
      <div slot="list">
        <!-- 弹框标题 -->
        <div class="modelTitle">
          <span>用户详情</span>
          <Icon type="md-close" @click="HandlClose(false)" />
        </div>
        <div class="content">
          <h2><span>{{userData.nickName+'账户现有资金：'}}</span>
            <span style="font-weight: bold;font-size: 15px;">{{userData.account+'元'}}</span>
            <span>，消费券余额：</span>
            <span style="font-weight: bold;font-size: 15px;">{{userData.coupon+'元'}}</span></h2>
          <hr>
          <h2 style="margin-bottom:0px;">近12个月的寄售成功详情：</h2>
          <div v-if="shopList.length">
            <h5>(仅展示寄售成功月份和当月寄售成功总数)</h5>
            <table border="0" cellpadding="0" cellspacing="0" v-if="shopList.length>0">
              <tbody>
                <tr>
                  <th v-for="(item,index) in shopList" v-if="index<6">{{item.groupString}}月</th>
                </tr>
                <tr>
                  <td v-for="(item,index) in shopList" v-if="index<6">{{item.salesNum}}</td>
                </tr>
              </tbody>
            </table>
            <table border="0" cellpadding="0" cellspacing="0" v-if="shopList.length>6">
              <tbody>
                <tr>
                  <th v-for="(item,index) in shopList" v-if="index>6">{{item.groupString}}月</th>
                </tr>
                <tr>
                  <td v-for="(item,index) in shopList" v-if="index>6">{{item.salesNum}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else style="margin:20px 0;">暂无寄售成功信息</div>
          <hr>
          <h2>所有下级：</h2>

          <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="pageData.total" :current="pageData.pageIndex" @on-change="changePage" :page-size="pageData.pageSize"></Page>
            </div>
          </div>
        </div>
      </div>
    </ty-right-model>
  </div>
</template>
<script>
import { userinfo, allChildren, userSalesAccount } from '@/api/user'
export default {
  name: 'discountCoupon',
  props: {
    rowData: {
      type: Object,
      default: {}
    }
  },
  data () {
    var transControlRt = (val) => {
      var obj = {
        '0': '必不中',
        '-1': '普通',
        '100': '必中'
      }
      return obj[val]
    }
    return {
      userData: {
        nickName: '',
        account: '',
        coupon: ''
      },
      tableData: [],
      tableColumns: [
        {
          title: '手机号',
          align: 'center',
          key: 'phone',
          minWidth: 110
        },
        {
          title: '昵称',
          align: 'center',
          key: 'nickName',
          minWidth: 100,
          render: (h, p) => {
            return h('div', {}, p.row.nickName ? p.row.nickName : '--')
          }
        },
        {
          title: '调货',
          align: 'center',
          key: 'controlRt',
          minWidth: 80,
          render: (h, p) => {
            return h('div', {}, transControlRt(p.row.controlRt))
          }
        },
        {
          title: '经验值',
          align: 'center',
          key: 'exp',
          minWidth: 80
        }
      ],
      pageData: {
        total: 0, // 总共多少数据
        pages: 0, // 总页数
        pageIndex: 1, // 当前页
        pageSize: 15 // 每页数据条数
      },
      shopList: [],
      list: [{ num: 1 }, { num: 2 }]
    }
  },
  methods: {
    getData () {
      allChildren({
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        type: this.rowData.id
      }).then(res => {
        if (res.data.code == '0') {
          this.tableData = res.data.data.dataList
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 查看领取详情
    view () {
      userinfo({ id: this.rowData.id }).then(res => {
        if (res.data.code == '0') {
          this.userData = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
      userSalesAccount({
        userId: this.rowData.id
      }).then(res => {
        if (res.data.code == '0') {
          this.shopList = res.data.data
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    HandlClose (flag) {
      this.$emit('closeRight', false)
    },
    changePage (current) {
      this.pageData.pageIndex = current
      this.tableData = this.getData()
    }
  },
  mounted () {
    this.view()
    this.getData()
  }
}
</script>
<style lang="less" scoped>
  .modelTitle {
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
  .content {
    padding-left: 10px;
    box-sizing: border-box;
    hr {
      border: 1px dashed #dcdee2;
      margin-bottom: 20px;
    }
    h2 {
      font-size: 15px;
      color: #333333;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      margin: 20px 0;
      border: 1px solid #dcdee2;
      border-bottom: none;
      th {
        background: #f8f8f9;
      }
      td,
      th {
        border-bottom: 1px solid #dcdee2;
        text-align: center;
      }
      tr {
        height: 30px;
        line-height: 30px;
      }
    }
  }
</style>

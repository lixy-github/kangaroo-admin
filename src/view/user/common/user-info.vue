<template>
  <div>
    <!-- 用户详情 -->
    <ty-right-model :isShow="true" @changeModelStatus="HandlClose(false)" :width="'850px'">
      <div slot="list">
        <!-- 弹框标题 -->
        <div class="modelTitle">
          <span>用户详情</span>
          <Icon type="md-close" @click="HandlClose(false)" />
        </div>
        <div class="content">
          <h2><span v-html="userData.nickName+'账户现有资金：'"></span>
            <span style="font-weight: bold;font-size: 15px;">{{account+'元'}}</span>
            <span>，消费券余额：</span>
            <span style="font-weight: bold;font-size: 15px;">{{userData.coupon+'元'}}</span></h2>
          <hr>
          <!-- <h2 style="margin-bottom:0px;">近12个月的寄售成功详情：</h2>
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
          <hr> -->
          <h2>下两级用户：</h2>
          <Button type="primary" style="margin-bottom:20px" @click="selectTh">批量设置调货</Button>
          <Table :columns="twoTableColumns" :data="twoTableData" size="small" ref="selection" @on-selection-change="handleSelectRow()" stripe>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="twoPageData.total" :current="twoPageData.pageIndex" @on-change="twoChangePage" :page-size="twoPageData.pageSize"></Page>
            </div>
          </div>

          <!-- 调货 -->
          <Modal v-model="riskModal" title="批量设置调货">
            <Form :label-width="80">
              <FormItem label="调货：">
                <Select v-model="controlRtVal" style="width:200px">
                  <Option value="-1">普通</Option>
                  <Option value="0">降低成功率</Option>
                  <Option value="100">提升成功率</Option>
                </Select>
              </FormItem>
            </Form>
            <div slot="footer">
              <Button type="text" size="large" @click="riskModal = false">取消</Button>
              <Button type="primary" size="large" @click="riskOk">确定</Button>
            </div>
          </Modal>
          <hr>
          <h2>所有下级：</h2>

          <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="pageData.total" :current="pageData.pageIndex" @on-change="changePage" :page-size="pageData.pageSize"></Page>
            </div>
          </div>
          <!-- <hr>
          <h2>银行卡列表：</h2>
          <Table :columns="tableColumns" :data="tableData" size="small" ref="table" stripe>
          </Table>
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="pageData.total" :current="pageData.pageIndex" @on-change="changePage" :page-size="pageData.pageSize"></Page>
            </div>
          </div> -->
        </div>
      </div>
    </ty-right-model>
  </div>
</template>
<script>
  import { userinfo, allChildren, userSalesAccount, twoList, batchUpdateControl } from '@/api/user'
  export default {
    name: 'discountCoupon',
    props: {
      rowData: {
        type: Object,
        default: {}
      }
    },
    data() {
      var transControlRt = (val) => {
        var obj = {
          '0': '低成功率',
          '-1': '普通',
          '100': '高成功率'
        }
        return obj[val]
      }
      return {
        riskModal: false,
        controlRtVal: '',
        account: '',
        checkedId: [],
        userData: {
          nickName: '',
          account: '',
          coupon: ''
        },
        twoTableColumns: [
          {
            type: 'selection',
            minWidth: 50,
            align: 'center'
          },
          {
            title: 'Id',
            align: 'center',
            key: 'id',
            minWidth: 60
          },
          {
            title: '直接上级Id',
            align: 'center',
            key: 'parentId',
            minWidth: 95
          },
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
            minWidth: 120,
            render: (h, p) => {
              return h('div', {
                domProps: {
                  innerHTML: p.row.nickName
                }
              })
            }
          },
          {
            title: '调货',
            align: 'center',
            key: 'controlRt',
            minWidth: 100,
            render: (h, p) => {
              return h('div', {}, transControlRt(p.row.controlRt))
            }
          },
          {
            title: '经验值',
            align: 'center',
            key: 'exp',
            minWidth: 80
          },
          {
            title: '下级人数',
            align: 'center',
            key: 'inviteCount',
            minWidth: 100
          },
          {
            title: '直推人数',
            align: 'center',
            key: 'directCount',
            minWidth: 100
          }
        ],
        twoTableData: [],
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
            minWidth: 200,
            render: (h, p) => {
              return h('div', {
                domProps: {
                  innerHTML: p.row.nickName
                }
              })
            }
          },
          {
            title: '调货',
            align: 'center',
            key: 'controlRt',
            minWidth: 100,
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
          pageSize: 10 // 每页数据条数
        },
        twoPageData: {
          total: 0, // 总共多少数据
          pages: 0, // 总页数
          pageIndex: 1, // 当前页
          pageSize: 10 // 每页数据条数
        },
        shopList: [],
        list: [{ num: 1 }, { num: 2 }]
      }
    },
    methods: {
      getData() {
        allChildren({
          pageIndex: this.pageData.pageIndex,
          pageSize: this.pageData.pageSize,
          type: this.rowData.id
        }).then(res => {
          if(res.data.code == '0') {
            this.tableData = res.data.data.dataList
            this.pageData.total = res.data.data.total
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      // 二级
      getDataTwo() {
        twoList({
          pageIndex: this.twoPageData.pageIndex,
          pageSize: this.twoPageData.pageSize,
          type: this.rowData.id
        }).then(res => {
          if(res.data.code == '0') {
            if(res.data.data.dataList != null) {
              this.twoTableData = res.data.data.dataList
            } else {
              this.twoTableData = []
            }
            this.twoPageData.total = res.data.data.total
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      // 二级多选
      handleSelectRow(selection, index) {
        let data = this.$refs.selection.getSelection()
        this.checkedId = data.map(item => { return item.id })
      },
      // 批量设置风控(弹框展示)
      selectTh() {
        if(this.checkedId.length == 0) {
          this.$Message.info('请先在下面表格中选中需设置调货的用户')
        } else {
          this.riskModal = true
        }
      },
      // 批量设置风控
      riskOk() {
        if(this.controlRtVal == '') {
          this.$Message.info('请选择调货')
          return
        }
        batchUpdateControl({
          id: this.rowId,
          controlRt: this.controlRtVal,
          idList: this.checkedId.join(',')
        }).then(res => {
          if(res.data.code == '0') {
            this.riskModal = false
            this.$Message.success('操作成功')
            this.getDataTwo()
          } else {
            this.riskModal = false
            this.$Message.error(res.data.msg)
          }
        })
      },
      // 查看领取详情
      view() {
        userinfo({ id: this.rowData.id }).then(res => {
          if(res.data.code == '0') {
            this.userData = res.data.data
            this.account = Math.round(res.data.data.account / 100)
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        userSalesAccount({
          userId: this.rowData.id
        }).then(res => {
          if(res.data.code == '0') {
            this.shopList = res.data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      HandlClose(flag) {
        this.$emit('closeRight', false)
      },
      changePage(current) {
        this.pageData.pageIndex = current
        this.tableData = this.getData()
      },
      twoChangePage(current) {
        this.twoPageData.pageIndex = current
        this.twoTableData = this.getDataTwo()
      }
    },
    mounted() {
      this.view()
      this.getData()
      this.getDataTwo()
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

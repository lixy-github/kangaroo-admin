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
        <Button type="primary" @click="addBtn" style="margin-right:20px;">添加优惠券</Button>
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

    <!-- 领取详情 -->
    <ty-right-model :isShow="detailsIsShow" @changeModelStatus="HandlClose(false)">
      <div slot="list">
        <!-- 弹框标题 -->
        <div class="modelTitle">
          <span>{{title+'领取详情'}}</span>
          <Icon type="md-close" @click="HandlClose(false)" />
        </div>
        <div class="content">
          <Table :columns="detailTableColumns" :data="detailTableData" size="small" ref="table" stripe>
          </Table>
          <!-- 分页 -->
          <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
              <Page :total="detailPageData.total" :current="detailPageData.pageIndex" @on-change="detailChangePage" :page-size="detailPageData.pageSize"></Page>
            </div>
          </div>
        </div>
      </div>
    </ty-right-model>
  </div>
</template>
<script>
import { couponList, couponswitch, coupongotList } from '@/api/discountCoupon'
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
          title: '未使用图片',
          align: 'center',
          minWidth: 120,
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
          title: '已失效图片',
          align: 'center',
          minWidth: 120,
          render: (h, p) => {
            return h('img', {
              attrs: {
                src: p.row.imageDisable,
                style: 'height:40px;margin-top:5px;'
              }
            }, p.index + (this.pageData.curPage - 1) * this.pageData.pageSize + 1)
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
              }, status == 'OPEN' ? '结束' : '开始'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'

                },
                style: {
                  marginRight: '5px',
                  display: status == 'WAITING' ? 'none' : 'block'
                },
                on: {
                  click: () => {
                    this.viewDetails(row)
                  }
                }
              }, '领取详情')
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
      /* 领取详情 */
      detailTableData: [],
      detailTableColumns: [
        {
          title: 'id',
          align: 'center',
          key: 'id',
          minWidth: 50
        },
        {
          title: '电话',
          align: 'center',
          key: 'phone',
          minWidth: 100
        },
        {
          title: '领取时间',
          align: 'center',
          key: 'createDate',
          minWidth: 100
        },
        {
          title: '是否使用',
          align: 'center',
          minWidth: 100,
          render: (h, p) => {
            return h('div', {}, p.row.used == 'Y' ? '已使用' : '未使用')
          }
        }
      ],
      detailPageData: {
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
      couponList(_data).then(res => {
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
      this.tableData = this.mockTableData()
    },
    // 开始/结束
    edit (id, status) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要${status == 'OPEN' ? '结束' : '开始'}此优惠券吗？`,
        onOk: () => {
          couponswitch({
            id: id,
            status: status == 'OPEN' ? 'CLOSE' : 'OPEN'
          }).then(res => {
            if (res.data.code == '0') {
              this.$Message.success('操作成功')
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
    /* 查看领取详情 */
    viewDetails (row) {
      this.HandlClose(true)
      this.title = row.name
      this.rowId = row.id
      this.getDetailsData()
    },
    // 领取详情列表
    getDetailsData () {
      coupongotList({
        pageIndex: this.detailPageData.pageIndex,
        pageSize: this.detailPageData.pageSize,
        id: this.rowId
      }).then(res => {
        if (res.data.code == '0') {
          this.detailTableData = res.data.data.dataList
          this.detailPageData.total = res.data.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 详情切换页码
    detailChangePage (current) {
      this.detailPageData.pageIndex = current
      this.detailTableData = this.getDetailsData()
    },
    HandlClose (flag) {
      this.detailsIsShow = flag
    },
    addBtn () {
      this.$router.push('coupon-add')
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less">
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
</style>

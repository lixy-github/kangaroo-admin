<template>
  <div>
    <!-- <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> -->
    <Form :model="formItem" :label-width="80">
      <Row style="padding-bottom: 20px;">
        <!-- <Col span="3" style="width: 250px">
        <FormItem label="商品分类：" prop="name">
          <Select v-model="formItem.classId">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="3" style="width: 300px">
        <FormItem label="商品名称">
          <Input v-model="formItem.name" placeholder="商品名称查询"></Input>
        </FormItem>
        </Col> -->
        <Col span="1" offset="1" style="width: 200px">
        <!-- <Button type="primary" @click="onSearch" style="margin-right:20px;">搜索</Button> -->
        <Button type="primary" @click="addBtn" style="margin-right:20px;">添加上架商品</Button>
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
import config from '@/config'
export default {
  name: 'discountCoupon',
  data () {
    var transScope = (val) => {
      var obj = {
        'RUSH': '抢购区',
        'BATCH': '批发区',
        'RUSH_FIRST': '消费区'
      }
      return obj[val]
    }
    return {
      formItem: {
        classId: '',
        name: ''
      },
      cityList: [],
      title: '',
      rowId: '',
      tableData: [],
      tableColumns: [
        {
          title: '商品名称',
          align: 'center',
          key: 'name',
          minWidth: 100
        },
        {
          title: '商品价格',
          align: 'center',
          key: 'price',
          minWidth: 100
        },
        {
          title: '消费券价格',
          align: 'center',
          key: 'consumerPrice',
          minWidth: 100
        },
        {
          title: '库存',
          align: 'center',
          key: 'stock',
          minWidth: 100
        },
        {
          title: '可抢数量',
          align: 'center',
          key: 'num',
          minWidth: 100
        },
        {
          title: '已抢数量',
          align: 'center',
          key: 'alreadyNum',
          minWidth: 100
        },
        {
          title: '赠券',
          align: 'center',
          key: 'coupon',
          minWidth: 100
        },
        {
          title: '邮费',
          align: 'center',
          key: 'postage',
          minWidth: 100
        },
        {
          title: '最大可抢数量',
          align: 'center',
          key: 'maxBuyNo',
          minWidth: 100
        },
        {
          title: '每天可抢数量',
          align: 'center',
          key: 'maxBuyNoDay',
          minWidth: 100
        },
        {
          title: '每月可抢数量',
          align: 'center',
          key: 'maxBuyNoMonth',
          minWidth: 100
        },
        {
          title: '时间段',
          align: 'center',
          key: 'className',
          minWidth: 100
        },
        {
          title: '区域',
          align: 'center',
          minWidth: 100,
          render: (h, p) => {
            return h('div', {}, transScope(p.row.scope))
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
    // 获取商品列表
    getData () {
      let _data = {
        scope: '',
        timeid: '',
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize

      }
      _request.http(this, '/admin/rushpay/goods/findList', _data).then(res => {
        this.tableData = res.data.data
        // this.pageData.total = res.data.data.total
      })
    },
    // 获取商品分类
    getClass () {
      this.cityList = [{ 'value': '', 'label': '全部' }]
      _request.http(this, '/admin/goods/class/findList').then(res => {
        res.data.data.forEach(element => {
          this.cityList.push({ 'value': element.id, 'label': element.name })
        })
      })
    },
    // 删除商品
    delete (id) {
      /* this.$Modal.confirm({
          title: '提示',
          content: `确定要删除此商品吗？`,
          onOk: () => {
            _request.http(this, '/admin/goods/remove', {
              id: id
            }).then(res => {
              this.$Message.success('删除成功')
              this.getData()
            })
          },
          onCancel: () => {
            this.$Message.info('已取消')
          }
        }) */
    },
    // 编辑
    edit (row) {
      /* this.$router.push({
          name: 'goods-edit',
          params: { content: JSON.stringify(row) }
        }) */
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
    addBtn () {
      // this.$router.push('putaway-edit')
    }
  },
  mounted () {
    this.getData()
    this.getClass()
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
  .content {
    padding: 0 10px;
    box-sizing: border-box;
    ul {
      border: 1px solid #ebebeb;
    }
    li {
      font-size: 15px;
      width: 100%;
      // padding: 10px 0;
      // box-sizing: border-box;
      // margin-bottom: 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ebebeb;
      border-right: 1px solid #ebebeb;
      span {
        display: inline-block;
        // height: 20px;
        // line-height: 20px;
        // background: #ebebeb;
        padding: 10px 4px;
        &:nth-child(2) {
          color: #333333;
          font-weight: bold;
          display: flex;
          flex-wrap: nowrap;
          width: 100px;
          text-align: right;
          margin-right: 10px;
        }
        &:nth-child(3) {
          background: none;
        }
      }
      .imgListBox {
        display: flex;
        flex-wrap: wrap;
      }
      img {
        height: 100px;
        margin: 10px 10px 10px 0;
      }
    }
  }
</style>

<template>
  <div>
    <!-- <DatePicker type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker> -->
    <Form :model="formItem" :label-width="80">
      <Row style="padding-bottom: 20px;">
        <Col span="3" style="width: 250px">
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
        </Col>
        <Col span="3" style="width: 300px">
        <FormItem label="商品Id">
          <Input v-model="formItem.id" placeholder="商品Id查询"></Input>
        </FormItem>
        </Col>
        <Col span="1" offset="1" style="width: 200px">
        <Button type="primary" @click="onSearch" style="margin-right:20px;">搜索</Button>
        <Button type="primary" @click="addBtn" style="margin-right:20px;">添加商品</Button>
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

    <!-- 商品详情 -->
    <ty-right-model :isShow="detailsIsShow" @changeModelStatus="HandlClose(false)">
      <div slot="list">
        <!-- 弹框标题 -->
        <div class="modelTitle">
          <span>{{title+'详情'}}</span>
          <Icon type="md-close" @click="HandlClose(false)" />
        </div>
        <div class="content">
          <ul>
            <li>
              <span class="border"></span>
              <span class="lable">商品名称：</span>
              <span>{{rowDetails.name}}</span>
            </li>
            <li>
              <span class="border"></span>
              <span class="lable">商品分类：</span>
              <span>{{rowDetails.className}}</span>
            </li>
            <li>
              <span class="border"></span>
              <span class="lable">商品属性：</span>
              <span>{{rowDetails.feilds}}</span>
            </li>
            <li>
              <span class="border"></span>
              <span class="lable">售货服务：</span>
              <span>{{rowDetails.afterService}}</span>
            </li>
            <li>
              <span class="border"></span>
              <span class="lable">轮播图：</span>
              <div class="imgListBox">
                <img :src="item.url" alt="" v-for="item in imgList">
              </div>

            </li>
            <li>
              <span class="border"></span>
              <span class="lable">商品封面图：</span>
              <img :src="rowDetails.coverImg" alt="">
            </li>
            <li>
              <span class="border"></span>
              <span class="lable">商品描述：</span>
              <div v-html="rowDetails.description" style="width:80%"></div>
            </li>

          </ul>
        </div>
      </div>
    </ty-right-model>
  </div>
</template>
<script>
import { imgLoadUrl } from '@/api/api'
import { goodsfindList, goodsremove } from '@/api/goods'
import { classfindList } from '@/api/district'
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
      imgLoadUrl,
      formItem: {
        classId: '',
        name: '',
        id: ''
      },
      cityList: [],
      detailsIsShow: false,
      title: '',
      rowId: '',
      tableData: [],
      tableColumns: [
        {
          title: '商品Id',
          align: 'center',
          key: 'id',
          minWidth: 60
        },
        {
          title: '商品名称',
          align: 'center',
          key: 'name',
          minWidth: 100
        },
        {
          title: '商品分类',
          align: 'center',
          key: 'className',
          minWidth: 100
        },
        {
          title: '封面图',
          align: 'center',
          key: 'image',
          minWidth: 120,
          render: (h, p) => {
            return h('img', {
              attrs: {
                src: p.row.coverImg,
                // src: this.imgLoadUrl + p.row.image,
                style: 'height:40px;margin-top:5px;'
              }
            }, p.index + (this.pageData.curPage - 1) * this.pageData.pageSize + 1)
          }
        },
        {
          title: '商品属性',
          align: 'center',
          key: 'feilds',
          minWidth: 150
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
              }, '删除'), h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'

                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.viewDetails(row)
                  }
                }
              }, '查看详情')
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
      rowDetails: [],
      imgList: []
    }
  },
  methods: {
    // 获取商品列表
    getData () {
      let _data = {
        classId: this.formItem.classId,
        name: this.formItem.name,
        id: this.formItem.id,
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize
      }
      goodsfindList(_data).then(res => {
        if (res.data.code == '0') {
          this.tableData = res.data.data.dataList
          this.pageData.total = res.data.data.total
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 获取商品分类
    getClass () {
      this.cityList = [{ 'value': '', 'label': '全部' }]
      classfindList().then(res => {
        if (res.data.code == '0') {
          res.data.data.forEach(element => {
            this.cityList.push({ 'value': element.id, 'label': element.name })
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 删除商品
    delete (id) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除此商品吗？`,
        onOk: () => {
          goodsremove({
            id: id
          }).then(res => {
            if (res.data.code == '0') {
              this.$Message.success('删除成功')
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
    // 编辑
    edit (row) {
      this.$router.push({
        name: 'goods-edit',
        params: { content: JSON.stringify(row) }
      })
    },
    // 查看详情
    viewDetails (row) {
      this.HandlClose(true)
      this.title = row.name
      this.rowDetails = row
      this.imgList = JSON.parse(row.images)
      // this.getDetailsData()
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
    HandlClose (flag) {
      this.detailsIsShow = flag
    },
    addBtn () {
      this.$router.push('goods-edit')
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
      /* .border {
                                                                              display: inline-block;
                                                                              width: 10px;
                                                                              height: 10px;
                                                                              background: #2d8cf0;
                                                                              border-radius: 50%;
                                                                              margin-right: 20px;
                                                                            } */
    }
  }
</style>

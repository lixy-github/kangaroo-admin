<template>
  <div>
    <Form :model="formItem" :label-width="40">
      <Row style="padding-bottom: 20px;">
        <Col span="3" style="width: 200px">
        <FormItem label="区域">
          <Select v-model="formItem.scope">
            <Option value="">全部</Option>
            <Option value="RUSH">甄选区</Option>
            <Option value="BATCH">批发区</Option>
            <!-- <Option value="ALLDAY">消费区</Option> -->
          </Select>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px;margin-left:20px;">
        <FormItem label="日期">
          <DatePicker type="daterange" v-model="formItem.time" split-panels placeholder="选择日期" format="yyyy-MM-dd" @on-change="formItem.time=$event"></DatePicker>
        </FormItem>
        </Col>
        <Col span="1" offset="1" style="width: 200px">
        <Button type="primary" @click="onSearch" style="margin-right:20px;">搜索</Button>
        <Button type="primary" @click="addBtn('formValidate')" style="margin-right:20px;">添加轮播图</Button>
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
    <!-- 编辑轮播图 -->
    <Modal v-model="modal" :title="title">
      <Form :label-width="100" :model="formValidate" ref="formValidate" :rules="ruleValidate">
        <FormItem label="商品区域：" prop="scope">
          <Select v-model="formValidate.scope" style="width:300px" @on-change="scopeChange">
            <Option value="RUSH">甄选区</Option>
            <Option value="BATCH">批发区</Option>
            <!-- <Option value="ALLDAY">消费区</Option> -->
          </Select>
        </FormItem>
        <FormItem label="商品：" prop="name">
          <Select v-model="formValidate.name" style="width:300px" :disabled="!formValidate.scope">
            <Option v-for="item in goodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="图片：" prop="url">
          <img style="height: 100px" v-if="formValidate.url" :src="formValidate.url" alt />
          <Upload :show-upload-list='false' :on-remove="coverImgonRemove" :before-upload="beforeUpload" ref="upload" :on-success="onSuccess" :action="imgLoadUrl+'/web/commonfile/upload.htm'">
            <Button icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modal = false">取消</Button>
        <Button type="primary" size="large" @click="ok('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { imgLoadUrl } from '@/api/api'
import { contentBannerlist, goodsfindList, contentBannerdelete, contentBanneradd } from '@/api/content'

export default {
  name: 'discountCoupon',
  data () {
    var transScope = (val) => {
      var obj = {
        'RUSH': '甄选区',
        'BATCH': '批发区'
        // 'ALLDAY': '消费区'
      }
      return obj[val]
    }
    return {
      imgLoadUrl,
      modal: false,
      goodsList: [],
      formItem: {
        scope: '',
        time: ''
      },
      formValidate: {
        scope: '',
        name: '',
        url: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        scope: [
          { required: true, message: '请选择商品区域', trigger: 'change' }
        ],
        url: [
          { required: true, type: 'string', message: '请上传轮播图', trigger: 'change' }
        ]
      },
      rowId: '',
      tableData: [],
      tableColumns: [
        {
          type: 'id',
          key: 'id',
          width: 60,
          align: 'center'
        },
        {
          title: '商品',
          align: 'center',
          key: 'name',
          minWidth: 200
        },
        {
          title: '图片',
          align: 'center',
          minWidth: 80,
          render: (h, p) => {
            return h('img', {
              attrs: {
                src: p.row.url,
                style: 'height:40px;margin-top:5px;'
              }
            }, p.index + (this.pageData.curPage - 1) * this.pageData.pageSize + 1)
          }
        },
        {
          title: '所属区域',
          align: 'center',
          key: 'level',
          minWidth: 80,
          render: (h, p) => {
            return h('div', {}, transScope(p.row.scope))
          }
        },
        {
          title: '添加时间',
          align: 'center',
          key: 'createDate',
          minWidth: 200
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
              /* h('Button', {
                                props: {
                                  type: 'primary',
                                  size: 'small'
                                },
                                style: {
                                  marginRight: '5px',
                                },
                                on: {
                                  click: () => {
                                    this.edit(row)
                                  }
                                }
                              }, '编辑'), */
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
                    this.delete(row)
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
      },
      title: ''
    }
  },
  methods: {
    // 获取
    getData () {
      let startDate = this.formItem.time[0]
      let endDate = this.formItem.time[1]
      let _data = {
        pageIndex: this.pageData.pageIndex,
        pageSize: this.pageData.pageSize,
        endDate: endDate ? endDate + ' 23:59:59' : '',
        startDate: startDate ? startDate + ' 00:00:00' : '',
        scope: this.formItem.scope
      }
      contentBannerlist(_data).then(res => {
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
    getGoodsList (scope) {
      this.goodsList = []
      goodsfindList({
        scope: scope
      }).then(res => {
        if (res.data.code == '0') {
          res.data.data.forEach(element => {
            this.goodsList.push({ 'value': element.rushid.toString(), 'label': element.name })
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 新增
    addBtn (name) {
      this.modal = true
      this.title = '添加轮播图'
      this.$refs[name].resetFields()
    },
    // 删除轮播
    delete (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定要删除此轮播图吗？`,
        onOk: () => {
          contentBannerdelete({ id: row.id }).then(res => {
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
      this.rowId = row.id
      this.modal = true
      this.title = '编辑用户等级'
      this.formValidate.level = row.level
      this.formValidate.levelValue = row.levelValue
    },
    ok (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.title == '添加轮播图') {
            contentBanneradd({
              name: this.formValidate.name,
              scope: this.formValidate.scope,
              url: this.formValidate.url
            }).then(res => {
              if (res.data.code == '0') {
                this.modal = false
                this.$Message.success('添加成功')
                this.getData()
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          }
        }
      })
    },
    // 图上传
    coverImgonRemove () {
      this.formValidate.url = ''
    },
    onSuccess (r, file, list) {
      this.formValidate.url = r.data.url
    },
    beforeUpload () {
      if (this.$refs.upload.fileList.length > 0) {
        this.$refs.upload.fileList.splice(0, 1)
      }
    },
    scopeChange (val) {
      this.getGoodsList(val)
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less" scoped>
</style>

<template>
  <div>
    <Form :model="formItem" :label-width="80">
      <Row style="padding-bottom: 20px;">
        <Col span="3" style="width: 250px">
        <FormItem label="id">
          <Input v-model=" formItem.id" placeholder="用户id查询"></Input>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="手机号">
          <Input v-model="formItem.phone" placeholder="用户手机号查询"></Input>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="代理类型">
          <Select v-model="formItem.agentLevel" clearable>
            <Option v-for="item in agentLevelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="调货">
          <Select v-model="formItem.controlRt" clearable>
            <Option value="-1">普通</Option>
            <Option value="0">降低成功率</Option>
            <Option value="100">提升成功率</Option>
          </Select>
        </FormItem>
        </Col>
        <Col span="3" style="width: 250px">
        <FormItem label="上级Id">
          <Input v-model="formItem.parentId" placeholder="上级Id"></Input>
        </FormItem>
        </Col>
        <Col span="3" style="width: 300px">
        <FormItem label="日期">
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
    <!-- 代理级别 -->
    <Modal v-model="modal" title="设置代理级别">
      <Form :label-width="80" :model="formValidate">
        <FormItem label="级别：">
          <Select v-model="formValidate.agentLevel" style="width:200px">
            <Option v-for="item in agentLevelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="返利比：" prop="profitProportion">
          <Input v-model="formValidate.profitProportion" placeholder="请输入1—100整数" style="width: 200px" :disabled="formValidate.agentLevel == 'ORDINARY'">
          <span slot="append">%</span>
          </Input>
        </FormItem>

      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="modal = false">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
    <!-- 调货 -->
    <Modal v-model="riskModal" title="设置调货">
      <Form :label-width="80">
        <FormItem label="调货：">
          <Select v-model="controlRt" style="width:200px">
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
    <!-- 用户详情 -->
    <UserInfo v-if="moneyModal" :rowData="rowData" @closeRight="closeRight"></UserInfo>
  </div>
</template>
<script>
  import { userlist, agentLevelList, userinfo, agentLevelupdate, controlupdate } from '@/api/user'
  import UserInfo from './common/user-info'
  export default {
    name: 'discountCoupon',
    components: {
      UserInfo
    },
    data() {
      var transLevel = (val) => {
        var obj = {
          'PROVINCE': '省级代理',
          'CITY': '市级代理',
          'ORDINARY': '普通用户'
        }
        return obj[val]
      }
      var transControlRt = (val) => {
        var obj = {
          '0': '降低成功率',
          '-1': '普通',
          '100': '提升成功率'
        }
        return obj[val]
      }
      return {
        formItem: {
          id: '',
          time: '',
          agentLevel: '',
          controlRt: '',
          nickName: '',
          parentId: '',
          phone: ''
        },
        formValidate: {
          agentLevel: '',
          profitProportion: '',
        },
        controlRt: '',
        agentLevelList: [],
        modal: false,
        moneyModal: false,
        riskModal: false,
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
            title: '上级Id',
            align: 'center',
            key: 'parentId',
            minWidth: 80,
            render: (h, p) => {
              return h('div', {}, p.row.parentId ? p.row.parentId : '--')
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
          },
          {
            title: '代理级别',
            align: 'center',
            minWidth: 90,
            render: (h, p) => {
              return h('div', {}, transLevel(p.row.agentLevel))
            }
          },
          {
            title: '返利比',
            align: 'center',
            minWidth: 90,
            render: (h, p) => {
              return h('div', {}, p.row.profitProportion ? p.row.profitProportion + '%' : '--')
            }
          },
          {
            title: '注册日期',
            align: 'center',
            key: 'createDate',
            minWidth: 150
          },
          {
            title: '操作',
            align: 'center',
            minWidth: 220,
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
                      this.editAgentLevel(row)
                    }
                  }
                }, '代理级别'),
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
                      this.editRisk(row)
                    }
                  }
                }, '设置调货'),
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
                      this.view(row)
                    }
                  }
                }, '详情')
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
        rowData: {}
      }
    },
    methods: {
      // 获取
      getData() {
        let startDate = this.formItem.time[0]
        let endDate = this.formItem.time[1]
        let _data = {
          pageIndex: this.pageData.pageIndex,
          pageSize: this.pageData.pageSize,
          agentLevel: this.formItem.agentLevel, // 代理类型
          controlRt: this.formItem.controlRt, // 调货筛选
          endDate: endDate ? endDate + ' 23:59:59' : '',
          startDate: startDate ? startDate + ' 00:00:00' : '',
          id: this.formItem.id, // id
          nickName: this.formItem.nickName, // 昵称
          parentId: this.formItem.parentId, // 上级Id
          phone: this.formItem.phone// 手机号
        }
        // userlist
        userlist(_data).then(res => {
          if(res.data.code == '0') {
            this.tableData = res.data.data.dataList
            this.pageData.total = res.data.data.total
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      // 获取代理等级
      getagentLevel() {
        agentLevelList().then(res => {
          if(res.data.code == '0') {
            let list = res.data.data
            for(let key in list) {
              this.agentLevelList.push({ 'value': key, 'label': list[key] })
            }
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      // 搜索
      onSearch() {
        this.pageData.pageIndex = 1
        this.getData()
      },
      // 切换页码
      changePage(current) {
        this.pageData.pageIndex = current
        this.tableData = this.getData()
      },
      // 查看领取详情
      view(row) {
        this.moneyModal = true
        this.rowData = row
      },
      // 设置代理级别
      editAgentLevel(row) {
        this.rowId = row.id
        this.modal = true
        this.formValidate.agentLevel = row.agentLevel;
        this.formValidate.profitProportion = row.profitProportion ? row.profitProportion : '0';
      },
      ok() {
        if(this.formValidate.agentLevel != 'ORDINARY') {
          if(this.formValidate.profitProportion != '') {
            let reg = /^(1|([1-9]\d{0,1})|100)$/;
            if(!reg.test(this.formValidate.profitProportion)) {
              this.$Message.info('请输入1-100的整数');
              return;
            }
          } else {
            this.$Message.info('请输入返利比');
            return;
          }
        }
        agentLevelupdate({
          id: this.rowId,
          agentLevel: this.formValidate.agentLevel,
          profitProportion: this.formValidate.agentLevel == 'ORDINARY' ? '0' : this.formValidate.profitProportion,
        }).then(res => {
          if(res.data.code == '0') {
            this.modal = false
            this.$Message.success('操作成功')
            this.getData()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      // 设置调货
      editRisk(row) {
        this.rowId = row.id
        this.riskModal = true
        this.controlRt = row.controlRt.toString()
      },
      riskOk() {
        if(this.controlRt == '') {
          this.$Message.info('请选择调货')
          return
        }
        controlupdate({
          id: this.rowId,
          controlRt: this.controlRt
        }).then(res => {
          if(res.data.code == '0') {
            this.riskModal = false
            this.$Message.success('操作成功')
            this.getData()
          } else {
            this.riskModal = false
            this.$Message.error(res.data.msg)
          }
        })
      },
      closeRight(flag) {
        this.moneyModal = flag
      }
    },
    created() {
      this.getData()
      this.getagentLevel()
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
    h2 {
      font-size: 15px;
      color: #333333;
      margin-bottom: 20px;
    }
    table {
      width: 90%;
      margin: 0 auto;
      border: 1px solid #c4c4c4;
      border-right: none;
      border-bottom: none;
      td,
      th {
        border-right: 1px solid #c4c4c4;
        border-bottom: 1px solid #c4c4c4;
      }
      tr {
        height: 30px;
        line-height: 30px;
      }
    }
  }
</style>

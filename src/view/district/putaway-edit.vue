<template>
  <div class="addMillForm">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
      <FormItem label="上架商品：" prop="goodsId" v-if="!scoperead">
        <Cascader :data="goodsList" :load-data="loadData" style="width:300px" v-model="formValidate.goodsId" filterable></Cascader>
        <!-- <Select v-model="formValidate.goodsId" filterable :disabled="scoperead">
          <Option v-for="item in goodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
      </FormItem>
      <FormItem label="上架商品：" v-if="scoperead">
        <Input v-model="goodsName" style="width:300px"  :disabled="scoperead">
        </Input>
      </FormItem>
      <FormItem label="商品区域：" prop="scope">
        <Select v-model="formValidate.scope" style="width:300px" @on-change="scopeChange" :disabled="scoperead">
          <Option v-for="item in scopeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品价格：" prop="price">
        <Input v-model="formValidate.price" placeholder="请输入商品价格" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" @on-blur="priceBlur">
        <span slot="append">元</span>
        </Input>
      </FormItem>
      <FormItem label="用券数：" prop="consumerPrice">
        <Input v-model="formValidate.consumerPrice" placeholder="请输入可用券数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" :disabled="formValidate.scope == 'RUSH' || formValidate.scope == 'RUSH_FIRST'" @on-blur="consumerBlur">
        </Input>
        <span>&nbsp;&nbsp;用券比{{useCouponsNum}}%</span>
      </FormItem>
      <FormItem label="赠券数：" prop="coupon">
        <Input v-model="formValidate.coupon" placeholder="请输入赠券" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" :disabled="formValidate.scope == 'BATCH' || formValidate.scope == 'ALLDAY' || formValidate.scope == 'BATCH_FIRST'" @on-blur="couponBlur"></Input>
        <span>&nbsp;&nbsp;赠券比{{couponsNum}}%</span>
      </FormItem>
      <FormItem label="库存：" prop="stock">
        <Input v-model="formValidate.stock" placeholder="请输入库存" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="可抢数量：" prop="num">
        <Input v-model="formValidate.num" placeholder="请输入可抢数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="已抢数量：" prop="alreadyNum">
        <Input v-model="formValidate.alreadyNum" placeholder="请输入已抢数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" :disabled="true"></Input>
      </FormItem>
      <!-- <FormItem label="邮费：">
        <Input v-model="formValidate.postage" placeholder="请输入邮费" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem> -->
      <FormItem label="限购：">
        <Input v-model="formValidate.maxBuyNo" placeholder="请输入限购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="最多可抢/天：">
        <Input v-model="formValidate.maxBuyNoDay" placeholder="请输入每天可抢购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="最多可抢/月：">
        <Input v-model="formValidate.maxBuyNoMonth" placeholder="请输入每月可抢购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="时间段：">
        <Select v-model="formValidate.timeid" style="width:300px" :disabled="formValidate.scope != 'BATCH' && formValidate.scope != 'RUSH'">
          <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
        <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { goodsmodify, goodsadd, templatefindList, goodsfindList, classfindList } from '@/api/district'
import wangEditor from '@/components/wangEditor/wangEditor'
import constants from '@/utils/constants'
export default {
  components: {
    wangEditor
  },
  data () {
    return {
      goodsName: '',
      useCouponsNum: '0',
      couponsNum: '0',
      scoperead: false,
      scopeList: constants.scopeData,
      goodsList: [],
      timeList: [],
      formValidate: {
        consumerPrice: '',
        coupon: '',
        goodsId: [],
        maxBuyNo: '',
        maxBuyNoDay: '',
        maxBuyNoMonth: '',
        num: '',
        alreadyNum: '0',
        postage: '0',
        price: '',
        scope: '',
        stock: '',
        timeid: ''
      },
      ruleValidate: {
        goodsId: [
          { required: true, type: 'array', message: '请选择商品', trigger: 'change' }
        ],
        scope: [
          { required: true, message: '请选择商品区域', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
          // { pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, message: '价格不能小于0', trigger: 'blur' }
        ],
        consumerPrice: [
          { required: true, message: '请输入可用券数量', trigger: 'blur' },
          { pattern: /^([0-9]*)$/, message: '只能输入整数', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入商品可抢数量', trigger: 'blur' },
          { pattern: /^([0-9]*)$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        alreadyNum: [
          { required: true, message: '请输入商品已抢数量', trigger: 'blur' }
          // { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        coupon: [
          { required: true, message: '请输入赠券', trigger: 'blur' },
          { pattern: /^([0-9]*)$/, message: '只能输入整数', trigger: 'blur' }
        ],
        /* postage: [
                              { required: true, message: '请输入邮费', trigger: 'blur' }
                            ], */
        maxBuyNo: [
          { required: true, message: '请输入限购数量', trigger: 'blur' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        maxBuyNoDay: [
          { required: true, message: '请输入每天可抢购数量', trigger: 'blur' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        maxBuyNoMonth: [
          { required: true, message: '请输入每月可抢购数量', trigger: 'blur' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        timeid: [
          { required: true, message: '请选择时间段', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 区域选择清空对应字段
    scopeChange (val) {
      switch (val) {
        // 抢购
        case 'RUSH':
          this.formValidate.consumerPrice = '0'
          this.useCouponsNum = '0'
          this.getTimeList('RUSH')
          break
          // 批发
        case 'BATCH':
          this.formValidate.coupon = '0'
          this.couponsNum = '0'
          this.getTimeList('BATCH')
          break
          // 全天消费
        case 'ALLDAY':
          this.formValidate.coupon = '0'
          this.formValidate.timeid = null
          break
          // 抢购优享
        case 'RUSH_FIRST':
          this.formValidate.consumerPrice = '0'
          this.useCouponsNum = '0'
          this.formValidate.timeid = null
          break
          // 批发优享
        case 'BATCH_FIRST':
          this.formValidate.coupon = '0'
          this.couponsNum = '0'
          this.formValidate.timeid = null
          break
      }
    },
    // 新增/修改
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.$route.params.content) {
            // 修改
            let _data = {
              id: this.formValidate.id,
              consumerPrice: this.formValidate.consumerPrice,
              coupon: this.formValidate.coupon,
              goodsId: this.formValidate.goodsId,
              maxBuyNo: this.formValidate.maxBuyNo,
              maxBuyNoDay: this.formValidate.maxBuyNoDay,
              maxBuyNoMonth: this.formValidate.maxBuyNoMonth,
              num: this.formValidate.num,
              alreadyNum: this.formValidate.alreadyNum,
              postage: '0',
              price: (this.formValidate.price * 100).toString(), // 商品价格单位：分
              scope: this.formValidate.scope,
              stock: this.formValidate.stock,
              timeid: this.formValidate.timeid
            }
            goodsmodify(_data).then(res => {
              if (res.data.code == '0') {
                this.$Message.success('修改成功')
                this.$router.push({
                  name: 'goods-putaway'
                })
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          } else {
            // 添加
            let _data = {
              consumerPrice: this.formValidate.consumerPrice,
              coupon: this.formValidate.coupon,
              goodsId: this.formValidate.goodsId[1],
              maxBuyNo: this.formValidate.maxBuyNo,
              maxBuyNoDay: this.formValidate.maxBuyNoDay,
              maxBuyNoMonth: this.formValidate.maxBuyNoMonth,
              num: this.formValidate.num,
              alreadyNum: this.formValidate.alreadyNum,
              postage: '0',
              price: (this.formValidate.price * 100).toString(), // 商品价格单位：分
              scope: this.formValidate.scope,
              stock: this.formValidate.stock,
              timeid: this.formValidate.timeid
            }
            goodsadd(_data).then(res => {
              if (res.data.code == '0') {
                this.$Message.success('添加成功')
                this.$router.push('goods-putaway')
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          }
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    loadData (item, callback) {
      item.loading = true
      let _data = {
        pageIndex: 1,
        pageSize: 2000,
        classId: item.value
      }
      goodsfindList(_data).then(res => {
        if (res.data.code == '0') {
          if (res.data.data.dataList.length != 0) {
            res.data.data.dataList.forEach(element => {
              item.children.push({ 'value': element.id.toString(), 'label': element.name })
              item.loading = false
              callback()
            })
          } else {
            item.children.push({ 'value': '', 'label': '' })
            item.loading = false
            callback()
          }
        } else {
          item.loading = false
          callback()
          this.$Message.error(res.data.msg)
        }
      })
    },
    getGoodsList () {
      /* this.goodsList = []
                      let _data = {
                        pageIndex: 1,
                        pageSize: 2000
                      }
                      goodsfindList().then(res => {
                        if (res.data.code == '0') {
                          res.data.data.dataList.forEach(element => {
                            this.goodsList.push({ 'value': element.id.toString(), 'label': element.name })
                          })
                        } else {
                          this.$Message.error(res.data.msg)
                        }
                      }) */
      classfindList().then(res => {
        if (res.data.code == '0') {
          res.data.data.forEach(element => {
            this.goodsList.push({ 'value': element.id, 'label': element.name, 'children': [], loading: false })
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
      if (this.$route.params.content) {
        this.scoperead = true
        let data = JSON.parse(this.$route.params.content)
        console.log(data)
        this.getTimeList(data.scope.toString())
        this.formValidate = {
          id: data.rushid,
          consumerPrice: data.consumerPrice != null ? data.consumerPrice.toString() : '',
          coupon: data.coupon != null ? data.coupon.toString() : '',
          goodsId: data.goodsid != null ? data.goodsid.toString() : '',
          maxBuyNo: data.maxBuyNo != null ? data.maxBuyNo.toString() : '',
          maxBuyNoDay: data.maxBuyNoDay != null ? data.maxBuyNoDay.toString() : '',
          maxBuyNoMonth: data.maxBuyNoMonth != null ? data.maxBuyNoMonth.toString() : '',
          num: data.num != null ? data.num.toString() : '',
          alreadyNum: data.alreadyNum != null ? data.alreadyNum.toString() : '',
          postage: data.postage != null ? data.postage.toString() : '',
          price: data.price != null ? (data.price / 100).toString() : '',
          scope: data.scope != null ? data.scope.toString() : '',
          stock: data.stock != null ? data.stock.toString() : '',
          timeid: data.timeid != null ? data.timeid.toString() : null
        }
        this.goodsName = data.name
        console.log(this.formValidate.timeid)
      } else {
        this.scoperead = false
        this.formValidate = {
          consumerPrice: '',
          coupon: '',
          goodsId: [],
          maxBuyNo: '',
          maxBuyNoDay: '',
          maxBuyNoMonth: '',
          num: '',
          postage: '0',
          price: '',
          scope: '',
          stock: '',
          timeid: '',
          alreadyNum: '0'
        }
      }
    },
    getTimeList (scope) {
      this.timeList = []
      templatefindList({
        scope: scope// RUSH,//抢购  BATCH,//批发
      }).then(res => {
        if (res.data.code == '0') {
          res.data.data.forEach(element => {
            this.timeList.push({ 'value': element.id.toString(), 'label': element.hours + ':' + element.min })
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 商品价格
    priceBlur () {
      if (this.formValidate.consumerPrice && this.formValidate.coupon) {
        this.consumerBlur()
        this.couponBlur()
      } else if (this.formValidate.coupon) {
        this.couponBlur()
      } else if (this.formValidate.consumerPrice) {
        this.consumerBlur()
      }
    },
    // 用券百分比
    consumerBlur () {
      if (this.formValidate.price && this.formValidate.price > 0) {
        this.useCouponsNum = Math.round((this.formValidate.consumerPrice / this.formValidate.price) * 100)
      } else {
        this.useCouponsNum = '0'
      }
    },
    // 赠券百分比
    couponBlur () {
      if (this.formValidate.price && this.formValidate.price > 0) {
        this.couponsNum = Math.round((this.formValidate.coupon / this.formValidate.price) * 100)
      } else {
        this.couponsNum = '0'
      }
    }
  },
  mounted () {
    this.getGoodsList()
  },
  created () {
  }
}
</script>
<style scoped>
  .addMillForm {
    width: 800px;
    margin: 0 auto;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }

  .demo-upload-list {
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    margin-right: 4px;
  }
  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }
  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>

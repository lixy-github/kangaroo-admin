<template>
  <div class="addMillForm">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
      <FormItem label="商品：" prop="goodsId">
        <Select v-model="formValidate.goodsId" style="width:300px" filterable>
          <Option v-for="item in goodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品区域：" prop="scope">
        <Select v-model="formValidate.scope" style="width:300px" @on-change="scopeChange" :disabled="scoperead">
          <Option v-for="item in scopeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品价格：" prop="price">
        <Input v-model="formValidate.price" placeholder="请输入商品价格" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="消费券价格：" prop="consumerPrice">
        <Input v-model="formValidate.consumerPrice" placeholder="请输入消费券价格" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" :disabled="formValidate.scope == 'RUSH' || formValidate.scope == 'RUSH_FIRST'"></Input>
      </FormItem>
      <FormItem label="库存：" prop="stock">
        <Input v-model="formValidate.stock" placeholder="请输入库存" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="可抢数量：" prop="num">
        <Input v-model="formValidate.num" placeholder="请输入可抢数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="已抢数量：" prop="alreadyNum">
        <Input v-model="formValidate.alreadyNum" placeholder="请输入已抢数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="赠券：" prop="coupon">
        <Input v-model="formValidate.coupon" placeholder="请输入赠券" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" :disabled="formValidate.scope == 'BATCH' || formValidate.scope == 'ALLDAY' || formValidate.scope == 'BATCH_FIRST'"></Input>
      </FormItem>
      <FormItem label="邮费：" prop="postage">
        <Input v-model="formValidate.postage" placeholder="请输入邮费" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="最大可抢购数量：" prop="maxBuyNo">
        <Input v-model="formValidate.maxBuyNo" placeholder="请输入最大可抢购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="每天可抢购数量：" prop="maxBuyNoDay">
        <Input v-model="formValidate.maxBuyNoDay" placeholder="请输入每天可抢购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="每月可抢购数量：" prop="maxBuyNoMonth">
        <Input v-model="formValidate.maxBuyNoMonth" placeholder="请输入每月可抢购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <!--  prop="timeid" -->
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
import { imgLoadUrl } from '@/api/api'
import { goodsmodify, goodsadd, templatefindList, goodsfindList } from '@/api/district'
import wangEditor from '@/components/wangEditor/wangEditor'
import constants from '@/utils/constants'
export default {
  components: {
    wangEditor
  },
  data () {
    return {
      scoperead: false,
      scopeList: constants.scopeData,
      goodsList: [],
      timeList: [],
      /*  */
      imgLoadUrl,
      imageUrl: '',
      hasImage: false,
      showImageUrl: '',
      // imageUrlList: [],
      /* **************** */
      formValidate: {
        consumerPrice: '',
        coupon: '',
        goodsId: '',
        maxBuyNo: '',
        maxBuyNoDay: '',
        maxBuyNoMonth: '',
        num: '',
        alreadyNum: '',
        postage: '',
        price: '',
        scope: '',
        stock: '',
        timeid: ''
      },
      ruleValidate: {
        goodsId: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        scope: [
          { required: true, message: '请选择商品区域', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, message: '价格不能小于0', trigger: 'blur' }
        ],
        consumerPrice: [
          { required: true, message: '请输入消费券价格', trigger: 'blur' }
          // { pattern: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, message: '价格不能小于0', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入商品可抢数量', trigger: 'blur' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        alreadyNum: [
          { required: true, message: '请输入商品已抢数量', trigger: 'blur' }
          // { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        coupon: [
          { required: true, message: '请输入赠券', trigger: 'blur' }
          // { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        postage: [
          { required: true, message: '请输入邮费', trigger: 'blur' }
        ],
        maxBuyNo: [
          { required: true, message: '请输入最大可抢购数量', trigger: 'blur' },
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
      },
      cityList: [],
      msgCN: ''
    }
  },
  methods: {
    // 区域选择清空对应字段
    scopeChange (val) {
      switch (val) {
        // 抢购
        case 'RUSH':
          this.formValidate.consumerPrice = '0'
          this.getTimeList('RUSH')
          break
          // 批发
        case 'BATCH':
          this.formValidate.coupon = '0'
          this.getTimeList('RUSH')
          break
          // 全天消费
        case 'ALLDAY':
          this.formValidate.coupon = '0'
          this.formValidate.timeid = null
          break
          // 抢购优享
        case 'RUSH_FIRST':
          this.formValidate.consumerPrice = '0'
          this.formValidate.timeid = null
          break
          // 批发优享
        case 'BATCH_FIRST':
          this.formValidate.coupon = '0'
          this.formValidate.timeid = null
          break
      }
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小限制',
        desc: '文件 ' + file.name + '太大,不能超过 2M.'
      })
    },
    upload () {
      this.loadingStatus = true
      setTimeout(() => {
        this.file = null
        this.loadingStatus = false
        this.$Message.success('Success')
      }, 1500)
    },
    handleRemove () {
      this.imageUrl = ''
      this.hasImage = false
    },
    handleRemoveList (index) {
      // 删除
      this.formValidate.images.splice(index, 1)
    },

    handleSuccessList (res, file) {
      let image = { url: res.data.url }
      this.formValidate.images.push(image)
    },
    handleSuccess (res, file) {
      this.imageUrl = res.data
      this.hasImage = true
    },
    /* ***************** */
    // 封面图上传
    coverImgonRemove () {
      this.formValidate.coverImg = ''
    },
    onSuccess (r, file, list) {
      this.formValidate.coverImg = r.data.url
    },
    beforeUpload () {
      if (this.$refs.upload.fileList.length > 0) {
        this.$refs.upload.fileList.splice(0, 1)
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
              postage: this.formValidate.postage,
              price: this.formValidate.price * 100, // 商品价格单位：分
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
              goodsId: this.formValidate.goodsId,
              maxBuyNo: this.formValidate.maxBuyNo,
              maxBuyNoDay: this.formValidate.maxBuyNoDay,
              maxBuyNoMonth: this.formValidate.maxBuyNoMonth,
              num: this.formValidate.num,
              alreadyNum: this.formValidate.alreadyNum,
              postage: this.formValidate.postage,
              price: this.formValidate.price * 100, // 商品价格单位：分
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
    getGoodsList () {
      this.goodsList = []
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
      })
      if (this.$route.params.content) {
        this.scoperead = true
        let data = JSON.parse(this.$route.params.content)
        this.formValidate = {
          id: data.rushid,
          consumerPrice: data.consumerPrice.toString(),
          coupon: data.coupon.toString(),
          goodsId: data.goodsid.toString(),
          maxBuyNo: data.maxBuyNo.toString(),
          maxBuyNoDay: data.maxBuyNoDay.toString(),
          maxBuyNoMonth: data.maxBuyNoMonth.toString(),
          num: data.num.toString(),
          alreadyNum: data.alreadyNum.toString(),
          postage: data.postage.toString(),
          price: (data.price / 100).toString(),
          scope: data.scope.toString(),
          stock: data.stock.toString(),
          timeid: data.timeid ? data.timeid.toString() : null
        }
        this.getTimeList(data.scope.toString())
      } else {
        this.scoperead = false
        this.formValidate = {
          consumerPrice: '',
          coupon: '',
          goodsId: '',
          maxBuyNo: '',
          maxBuyNoDay: '',
          maxBuyNoMonth: '',
          num: '',
          postage: '',
          price: '',
          scope: '',
          stock: '',
          timeid: '',
          alreadyNum: ''
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

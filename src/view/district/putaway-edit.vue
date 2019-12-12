<template>
  <div class="addMillForm">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130">
      <FormItem label="商品：" prop="name">
        <Select v-model="formValidate.goodsId" style="width:300px">
          <Option v-for="item in goodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品区域：" prop="name">
        <Select v-model="formValidate.scope" style="width:300px">
          <Option value="RUSH">抢购区</Option>
          <Option value="BATCH">批发区</Option>
          <Option value="RUSH_FIRST">消费区</Option>
        </Select>
      </FormItem>
      <FormItem label="商品价格：" prop="name">
        <Input v-model="formValidate.price" placeholder="请输入商品价格" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="消费券价格：" prop="name">
        <Input v-model="formValidate.consumerPrice" placeholder="请输入消费券价格" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="库存：" prop="name">
        <Input v-model="formValidate.stock" placeholder="请输入库存" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="可抢数量：" prop="name">
        <Input v-model="formValidate.num" placeholder="请输入可抢数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <!-- <FormItem label="已抢数量：" prop="name">
        <Input v-model="formValidate.alreadyNum" placeholder="请输入已抢数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem> -->
      <FormItem label="赠券：" prop="name">
        <Input v-model="formValidate.coupon" placeholder="请输入赠券" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="邮费：" prop="name">
        <Input v-model="formValidate.postage" placeholder="请输入邮费" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="最大可抢购数量：" prop="name">
        <Input v-model="formValidate.maxBuyNo" placeholder="请输入最大可抢购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="每天可抢购数量：" prop="name">
        <Input v-model="formValidate.maxBuyNoDay" placeholder="请输入每天可抢购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="每月可抢购数量：" prop="name">
        <Input v-model="formValidate.maxBuyNoMonth" placeholder="请输入每月可抢购数量" style="width:300px" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"></Input>
      </FormItem>
      <FormItem label="时间段：" prop="name">
        <Select v-model="formValidate.timeid" style="width:300px">
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
import _request from '@/utils/request'
import config from '@/config'
import { imgLoadUrl } from '@/api/api'
import wangEditor from '@/components/wangEditor/wangEditor'
export default {
  components: {
    wangEditor
  },
  data () {
    return {
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
        postage: '',
        price: '',
        scope: '',
        stock: '',
        timeid: ''
      },
      ruleValidate: {
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束日期', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入矿机名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入矿机型号', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '请输入矿机型号', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入矿机型号', trigger: 'blur' }
        ]
        /* power: [
                      { required: true, message: '请输入算力', trigger: 'blur' },
                      { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
                    ],
                    leaseNum: [
                      { required: true, message: '请输入租赁天数', trigger: 'blur' },
                      { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
                    ],
                    monthRate: [
                      { required: true, message: '请输入利率', trigger: 'blur' }
                    ],
                    shelf: [
                      { required: true, type: 'string', message: '请选择状态', trigger: 'change' }
                    ],
                    img: [
                      { required: true, type: 'string', message: '请上传矿机封面图', trigger: 'change' }
                    ], */
      },
      cityList: [],
      msgCN: ''
    }
  },
  methods: {
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
      console.log(res)
      this.imageUrl = res.data
      this.hasImage = true
      console.log(file)
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
      if (this.$route.params.content) {
        // 修改
        _request.http(this, '/admin/rushpay/goods/modify', this.formValidate).then(res => {
          this.$Message.success('修改成功')
          this.$router.push({
            name: 'goods-putaway'
          })
        })
      } else {
        //   // 添加
        let _data = {
          consumerPrice: this.formValidate.consumerPrice,
          coupon: this.formValidate.coupon,
          goodsId: this.formValidate.goodsId,
          maxBuyNo: this.formValidate.maxBuyNo,
          maxBuyNoDay: this.formValidate.maxBuyNoDay,
          maxBuyNoMonth: this.formValidate.maxBuyNoMonth,
          num: this.formValidate.num,
          postage: this.formValidate.postage,
          price: this.formValidate.price,
          scope: this.formValidate.scope,
          stock: this.formValidate.stock,
          timeid: this.formValidate.timeid
        }
        _request.http(this, '/admin/rushpay/goods/add', _data).then(res => {
          this.$Message.success('添加成功')
          this.$router.push('goods-putaway')
        })
      }

      /* this.$refs[name].validate((valid) => {
                if(valid) {
                }
              }) */
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    getGoodsList () {
      this.goodsList = []
      this.timeList = []
      let _data = {
        pageIndex: 1,
        pageSize: 2000
      }
      _request.http(this, '/admin/goods/findList', _data).then(res => {
        res.data.data.dataList.forEach(element => {
          this.goodsList.push({ 'value': element.id, 'label': element.name })
        })
      })
      _request.http(this, '/admin/rushpay/time/template/findList').then(res => {
        res.data.data.forEach(element => {
          this.timeList.push({ 'value': element.id, 'label': element.hours + ':' + element.min })
        })
      })
      if (this.$route.params.content) {
        let data = JSON.parse(this.$route.params.content)
        this.formValidate = {
          id: data.rushid,
          consumerPrice: data.consumerPrice,
          coupon: data.coupon,
          goodsId: data.goodsid,
          maxBuyNo: data.maxBuyNo,
          maxBuyNoDay: data.maxBuyNoDay,
          maxBuyNoMonth: data.maxBuyNoMonth,
          num: data.num,
          postage: data.postage,
          price: data.price,
          scope: data.scope,
          stock: data.stock,
          timeid: data.timeid
        }
      } else {
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
          timeid: ''
        }
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

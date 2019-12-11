<template>
  <div class="addMillForm">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">

      <!-- <FormItem label="矿机封面图：" prop="img">
        <img style="height: 50px" v-if="formValidate.img" :src="host+formValidate.img" alt />
        <Upload :show-upload-list='false' :on-remove="onRemove" :before-upload="beforeUpload" ref="upload" :on-success="onSuccess" :action="sdbaseUrl+'/app/upload/file'">
          <Button icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
      </FormItem>
      <FormItem label="矿机名称：" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入矿机名称"></Input>
      </FormItem>
      <FormItem label="矿机型号：" prop="model">
        <Input v-model="formValidate.model" placeholder="请输入矿机型号"></Input>
      </FormItem>
      <FormItem label="租赁天数：" prop="leaseNum">
        <Input v-model="formValidate.leaseNum" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入租赁天数"></Input>
      </FormItem>
      <FormItem label="算力：" prop="power">
        <Input v-model="formValidate.power" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入算力">
        <span style="color: #666;font-weight: bold" slot="append">TH / S</span>
        </Input>
      </FormItem>
      <FormItem label="利率：" prop="monthRate">
        <Input v-model="formValidate.monthRate" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入利率"></Input>
      </FormItem>
      <FormItem label="状态：" prop="shelf">
        <RadioGroup v-model="formValidate.shelf">
          <Radio label="1">上架</Radio>
          <Radio label="0">下架</Radio>
        </RadioGroup>
      </FormItem> -->
      <FormItem label="有效期类型：" prop="shelf">
        <RadioGroup v-model="formValidate.type">
          <Radio label="COUNT">倒计时</Radio>
          <Radio label="TERM">时间段</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="开始日期：">
        <Row>
          <Col span="11">
          <FormItem prop="startDate">
            <DatePicker type="date" placeholder="年-月-日" v-model="formValidate.startDate" :disabled="formValidate.type == 'COUNT'" format="yyyy-MM-dd " @on-change="formValidate.startDate=$event"></DatePicker>
          </FormItem>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
          <FormItem prop="startTime">
            <TimePicker type="time" placeholder="时-分-秒" v-model="formValidate.startTime" :disabled="formValidate.type == 'COUNT'"></TimePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="结束日期：">
        <Row>
          <Col span="11">
          <FormItem prop="endDate">
            <DatePicker type="date" placeholder="年-月-日" v-model="formValidate.endDate" format="yyyy-MM-dd " @on-change="formValidate.endDate=$event"></DatePicker>
          </FormItem>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
          <FormItem prop="endTime">
            <TimePicker type="time" placeholder="时-分-秒" v-model="formValidate.endTime"></TimePicker>
          </FormItem>
          </Col>
        </Row>
      </FormItem>
      <FormItem label="优惠券名称：" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入优惠券名称"></Input>
      </FormItem>
      <FormItem label="优惠券面值：" prop="price">
        <Input v-model="formValidate.price" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入优惠券面值"></Input>
      </FormItem>
      <FormItem label="优惠券描述：" prop="detail">
        <Input v-model="formValidate.detail" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入优惠券描述"></Input>
      </FormItem>
      <FormItem label="发放量：" prop="number">
        <Input v-model="formValidate.number" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入优惠券发放量"></Input>
      </FormItem>
      <FormItem label="优惠券可用图片：" prop="imageUsable">
        <img style="height: 50px" v-if="formValidate.imageUsable" :src="formValidate.imageUsable" alt />
        <Upload :show-upload-list='false' :before-upload="beforeUpload" ref="upload" :on-success="onSuccess" :action="imgLoadUrl+'/web/commonfile/upload.htm'">
          <Button icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
      </FormItem>
      <FormItem label="优惠券失效图片：" prop="imageDisable">
        <img style="height: 50px" v-if="formValidate.imageDisable" :src="formValidate.imageDisable" alt />
        <Upload :show-upload-list='false' :before-upload="beforeUpload" ref="upload" :on-success="DisonSuccess" :action="imgLoadUrl+'/web/commonfile/upload.htm'">
          <Button icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
      </FormItem>
      <FormItem label="开始/结束：" prop="status">
        <RadioGroup v-model="formValidate.status">
          <Radio label="OPEN">开始</Radio>
          <Radio label="CLOSE">结束</Radio>
        </RadioGroup>
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
import { imgLoadUrl } from '@/api/api'
export default {
  data () {
    return {
      imgLoadUrl,
      formValidate: {
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        name: '',
        price: '',
        detail: '',
        number: '',
        type: 'TERM',
        status: 'OPEN',
        imageUsable: '', // */
        imageDisable: ''// */

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
        ],
        imageUsable: [
          { required: true, type: 'string', message: '请上传矿机封面图', trigger: 'change' }
        ],
        imageDisable: [
          { required: true, type: 'string', message: '请上传矿机封面图', trigger: 'change' }
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
              imageUsable: [
                { required: true, type: 'string', message: '请上传矿机封面图', trigger: 'change' }
              ], */
      }
    }
  },
  methods: {
    // 图片上传
    /* onRemove() {
        this.formValidate.img = ''
      }, */
    onSuccess (r, file, list) {
      this.formValidate.imageUsable = r.data.url
    },
    /* 失效图片 */
    DisonSuccess (r, file, list) {
      this.formValidate.imageDisable = r.data.url
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
          let _data = {
            detail: this.formValidate.detail,
            endDate: this.formValidate.endDate + this.formValidate.endTime,
            startDate: this.formValidate.type == 'COUNT' ? '' : this.formValidate.startDate + this.formValidate.startTime,
            name: this.formValidate.name,
            number: this.formValidate.number,
            price: this.formValidate.price,
            type: this.formValidate.type,
            status: this.formValidate.status,
            imageUsable: this.formValidate.imageUsable,
            imageDisable: this.formValidate.imageDisable
          }
          _request.http(this, '/admin/coupon/add', _data).then(res => {
            this.$Message.success('添加成功')
            this.$router.push('coupon-list')
          })
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    }
  },
  created: function () {
  }
}
</script>
<style scoped>
  .addMillForm {
    width: 500px;
    margin: 0 auto;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>

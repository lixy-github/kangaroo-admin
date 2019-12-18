<template>
  <div class="addMillForm">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
      <FormItem label="有效期类型：">
        <RadioGroup v-model="formValidate.type">
          <Radio label="COUNT">倒计时</Radio>
          <Radio label="TERM">时间段</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="开始日期：">
        <Row>
          <Col span="11">
          <FormItem>
            <DatePicker type="date" placeholder="年-月-日" v-model="formValidate.startDate" :disabled="formValidate.type == 'COUNT'" format="yyyy-MM-dd " @on-change="formValidate.startDate=$event"></DatePicker>
          </FormItem>
          </Col>
          <Col span="2" style="text-align: center">-</Col>
          <Col span="11">
          <FormItem>
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
        <Input v-model="formValidate.price" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入优惠券面值">
        <span slot="append">元</span>
        </Input>
      </FormItem>
      <FormItem label="优惠券描述：" prop="detail">
        <Input v-model="formValidate.detail" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入优惠券描述"></Input>
      </FormItem>
      <FormItem label="发放量：" prop="number">
        <Input v-model="formValidate.number" type="number" @mousewheel.native.prevent onKeypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))" placeholder="请输入优惠券发放量">
        <span slot="append">张</span>
        </Input>
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
import { imgLoadUrl } from '@/api/api'
import { couponadd } from '@/api/discountCoupon'
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
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入优惠券面值', trigger: 'blur' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        detail: [
          { required: true, message: '请输入优惠券描述', trigger: 'blur' }
        ],
        number: [
          { required: true, message: '请输入优惠券发放量', trigger: 'blur' },
          { pattern: /^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' }
        ],
        imageUsable: [
          { required: true, type: 'string', message: '请上传优惠券可用图片', trigger: 'change' }
        ],
        imageDisable: [
          { required: true, type: 'string', message: '请上传优惠券失效图片', trigger: 'change' }
        ]
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
          if (this.formValidate.type != 'COUNT') {
            /* 不等于倒计时验证开始时间 */
            if (this.formValidate.startDate == '' || this.formValidate.startTime == '') {
              this.$Message.info('请选择开始日期')
              return
            }
          }
          let _data = {
            detail: this.formValidate.detail,
            endDate: this.formValidate.endDate + this.formValidate.endTime,
            startDate: this.formValidate.type == 'COUNT' ? '' : this.formValidate.startDate + this.formValidate.startTime,
            name: this.formValidate.name,
            number: this.formValidate.number,
            price: this.formValidate.price * 100, // 单位：分
            type: this.formValidate.type,
            status: this.formValidate.status,
            imageUsable: this.formValidate.imageUsable,
            imageDisable: this.formValidate.imageDisable
          }
          couponadd(_data).then(res => {
            if (res.data.code == '0') {
              this.$Message.success('添加成功')
              this.$router.push('coupon-list')
            } else {
              this.$Message.error(res.data.msg)
            }
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

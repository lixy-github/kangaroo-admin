<template>
  <div class="addMillForm">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem label="商品名称：" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入优惠券名称" style="width:300px"></Input>
      </FormItem>
      <FormItem label="商品分类：" prop="name">
        <Select v-model="formValidate.classId" style="width:300px">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="轮播图：" prop="img">
        <div class="demo-upload-list" v-for="(item,index) in formValidate.images" :key="index">
          <img :src="item.url"/>
          <div class="demo-upload-list-cover">
            <Icon type="ios-trash-outline" @click.native="handleRemoveList(index)"></Icon>
          </div>
        </div>

        <Upload :show-upload-list="false" :on-exceeded-size="handleMaxSize" :on-success="handleSuccessList" :format="['jpg','jpeg','png']" :max-size="2048" multiple type="drag" :action="imgLoadUrl+'/web/commonfile/upload.htm'" style="display: inline-block;width:58px;">
          <div style="width: 58px;height:58px;line-height: 58px;">
            <Icon type="ios-camera" size="20"></Icon>
          </div>
        </Upload>
      </FormItem>
      <FormItem label="封面图：" prop="img">
        <img style="height: 100px" v-if="formValidate.coverImg" :src="formValidate.coverImg" alt />
        <Upload :show-upload-list='false' :on-remove="coverImgonRemove" :before-upload="beforeUpload" ref="upload" :on-success="onSuccess" :action="imgLoadUrl+'/web/commonfile/upload.htm'">
          <Button icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
      </FormItem>
      <FormItem label="商品属性：" prop="name">
        <Input v-model="formValidate.feilds" placeholder="请输入优惠券名称" style="width:300px"></Input>
      </FormItem>
      <FormItem label="售货服务：" prop="name">
        <Input v-model="formValidate.afterService" placeholder="请输入优惠券名称" style="width:300px"></Input>
      </FormItem>
      <FormItem label="商品描述：" prop="name">
        <wang-editor v-model="formValidate.description"></wang-editor>
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
      imgLoadUrl,
      imageUrl: '',
      hasImage: false,
      showImageUrl: '',
      // imageUrlList: [],
      /* **************** */
      formValidate: {
        name: '',
        classId: '',
        images: [],
        coverImg: '',
        feilds: '',
        afterService: '',
        description: ''

        /* price: '',
            detail: '',
            number: '',
            type: 'TERM',
            status: 'OPEN',
            img: '', */

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
        let _data = {
          id: this.formValidate.id,
          afterService: this.formValidate.afterService,
          classId: this.formValidate.classId,
          coverImg: this.formValidate.coverImg,
          description: this.formValidate.description,
          feilds: this.formValidate.feilds,
          images: JSON.stringify(this.formValidate.images),
          name: this.formValidate.name
        }
        _request.http(this, '/admin/goods/modify', _data).then(res => {
          this.$Message.success('修改成功')
          this.$router.push({
            name: 'goods-list'
          })
        })
      } else {
        // 添加
        let _data = {
          afterService: this.formValidate.afterService,
          classId: this.formValidate.classId,
          coverImg: this.formValidate.coverImg,
          description: this.formValidate.description,
          feilds: this.formValidate.feilds,
          images: JSON.stringify(this.formValidate.images),
          name: this.formValidate.name
        }
        _request.http(this, '/admin/goods/add', _data).then(res => {
          this.$Message.success('添加成功')
          this.$router.push('goods-list')
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
    getClass () {
      this.cityList = []
      _request.http(this, '/admin/goods/class/findList').then(res => {
        res.data.data.forEach(element => {
          this.cityList.push({ 'value': element.id, 'label': element.name })
        })
      })
      if (this.$route.params.content) {
        let data = JSON.parse(this.$route.params.content)
        this.formValidate = {
          id: data.id,
          name: data.name,
          classId: data.classId,
          images: JSON.parse(data.images),
          coverImg: data.coverImg,
          feilds: data.feilds,
          afterService: data.afterService,
          description: data.description
        }
      } else {
        this.formValidate = {
          name: '',
          classId: '',
          images: [],
          coverImg: '',
          feilds: '',
          afterService: '',
          description: ''
        }
      }
    }
  },
  mounted () {
    this.getClass()
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

<template>
  <div class="addMillForm">
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
      <FormItem label="商品类型：">
        <RadioGroup v-model="formValidate.type" @on-change="typeChange">
          <Radio label="LOCAL" :disabled="isEdut">自有商品</Radio>
          <Radio label="DMGOODS" :disabled="isEdut">供应链商品</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="上架商品：">
        <Cascader :data="goodsList" :load-data="loadData" style="width:500px" v-model="goodsDetail" filterable :disabled="formValidate.type == 'LOCAL' || isEdut"></Cascader>
      </FormItem>
      <!-- <FormItem label="商品：">
        <Select v-model="formValidate.dmGoodsId" style="width:300px" filterable :disabled="formValidate.type == 'LOCAL'" @on-change="goodsChange">
          <Option v-for="item in goodsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品规格：">
        <Select v-model="formValidate.dmSpecId" style="width:300px" filterable :disabled="formValidate.type == 'LOCAL'">
          <Option v-for="item in specList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem> -->
      <FormItem label="商品名称：" prop="name">
        <Input v-model="formValidate.name" placeholder="请输入商品名称" style="width:300px"></Input>
      </FormItem>
      <FormItem label="商品分类：" prop="classId">
        <Select v-model="formValidate.classId" style="width:300px" filterable>
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="轮播图：" prop="images">
        <div class="demo-upload-list" v-for="(item,index) in formValidate.images" :key="index" style="width:60px">
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
      <FormItem label="封面图：" prop="coverImg">
        <img style="height: 100px" v-if="formValidate.coverImg" :src="formValidate.coverImg" alt />
        <Upload :show-upload-list='false' :on-remove="coverImgonRemove" :before-upload="beforeUpload" ref="upload" :on-success="onSuccess" :action="imgLoadUrl+'/web/commonfile/upload.htm'">
          <Button icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
      </FormItem>
      <FormItem label="商品属性：" prop="feilds">
        <Input v-model="formValidate.feilds" type="textarea" :autosize="true" placeholder="请输入商品属性" style="width:300px"></Input>
      </FormItem>
      <FormItem label="售货服务：" prop="afterService">
        <Input v-model="formValidate.afterService" placeholder="请输入售货服务" style="width:300px"></Input>
      </FormItem>
      <FormItem label="商品描述：" prop="description">
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
import { imgLoadUrl } from '@/api/api'
import { goodsmodify, goodsadd, goodsGetList, goodsDetail } from '@/api/goods'
import { classfindList } from '@/api/district'
import wangEditor from '@/components/wangEditor/wangEditor'
export default {
  components: {
    wangEditor
  },
  data () {
    return {
      isEdut: false,
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
        description: '',
        type: 'LOCAL',
        dmSpecId: '',
        dmGoodsId: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        classId: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        images: [
          { required: true, type: 'array', message: '请上传轮播图', trigger: 'change' }
        ],
        coverImg: [
          { required: true, type: 'string', message: '请上传封面图', trigger: 'change' }
        ],
        feilds: [
          { required: true, message: '请输入商品属性', trigger: 'blur' }
        ],
        afterService: [
          { required: true, message: '请输入售货服务', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入商品描述', trigger: 'change' }
        ]
      },
      cityList: [],
      msgCN: '',
      goodsList: [],
      specList: [],
      loading: false,
      goodsDetail: []
    }
  },
  methods: {
    typeChange (val) {
      if (val == 'LOCAL') {
        this.goodsDetail = []
      }
    },
    loadData (item, callback) {
      item.loading = true
      goodsDetail({
        id: item.value
      }).then(res => {
        if (res.data.code == '0') {
          if (res.data.data.spec.length != 0) {
            res.data.data.spec.forEach(element => {
              item.children.push({ 'value': element.spec_id.toString(), 'label': element.spec_1 ? element.spec_1 : '规格一' })
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
              afterService: this.formValidate.afterService,
              classId: this.formValidate.classId,
              coverImg: this.formValidate.coverImg,
              description: this.formValidate.description,
              feilds: this.formValidate.feilds,
              images: JSON.stringify(this.formValidate.images),
              name: this.formValidate.name,
              type: this.formValidate.type,
              dmSpecId: this.goodsDetail[1],
              dmGoodsId: this.goodsDetail[0]
            }
            goodsmodify(_data).then(res => {
              if (res.data.code == '0') {
                this.$Message.success('修改成功')
                this.$router.push({
                  name: 'goods-list'
                })
              } else {
                this.$Message.error(res.data.msg)
              }
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
              name: this.formValidate.name,
              type: this.formValidate.type,
              dmSpecId: this.formValidate.type == 'LOCAL' ? '' : this.goodsDetail[1],
              dmGoodsId: this.formValidate.type == 'LOCAL' ? '' : this.goodsDetail[0]
            }
            goodsadd(_data).then(res => {
              if (res.data.code == '0') {
                this.$Message.success('添加成功')
                this.$router.push('goods-list')
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
    getClass () {
      this.cityList = []
      this.goodsList = []
      classfindList().then(res => {
        if (res.data.code == '0') {
          res.data.data.forEach(element => {
            this.cityList.push({ 'value': element.id.toString(), 'label': element.name })
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
      goodsGetList().then(res => {
        if (res.data.code == '0') {
          res.data.data.forEach(element => {
            this.goodsList.push({ 'value': element.goods_id.toString(), 'label': element.goods_name, 'children': [], loading: false })
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
      if (this.$route.params.content) {
        let data = JSON.parse(this.$route.params.content)
        this.isEdut = true
        this.formValidate = {
          id: data.id,
          name: data.name,
          classId: data.classId.toString(),
          images: JSON.parse(data.images),
          coverImg: data.coverImg,
          feilds: data.feilds,
          afterService: data.afterService,
          description: data.description,
          type: data.type == 'NULL' ? 'LOCAL' : data.type,
          dmSpecId: data.dmSpecId.toString(),
          dmGoodsId: data.dmGoodsId.toString()
        }
        this.goodsDetail = [data.dmSpecId, data.dmGoodsId]
      } else {
        this.isEdut = false
        this.formValidate = {
          name: '',
          classId: '',
          images: [],
          coverImg: '',
          feilds: '',
          afterService: '',
          description: '',
          type: 'LOCAL',
          dmSpecId: '',
          dmGoodsId: ''
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

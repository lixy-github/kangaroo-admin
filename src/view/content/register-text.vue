<template>
  <div>
    <Row style="width:80%;margin:0 auto;">
      <wang-editor v-model="formItem.content"></wang-editor>
    </Row>
    <Row style="width:80%;margin:20px auto;">
      <Button type="primary" @click="handleSubmit" style="float:right;">保存</Button>
    </Row>
  </div>
</template>
<script>
import _request from '@/utils/request'
import wangEditor from '@/components/wangEditor/wangEditor'
export default {
  name: 'discountCoupon',
  components: {
    wangEditor
  },
  data () {
    return {
      formItem: {
        content: ''
      }
    }
  },
  methods: {
    // 获取
    getData () {
      _request.http(this, '/admin/contentBanner/registerAgreement/read').then(res => {
        this.formItem.content = res.data.data.configVal
      })
    },
    // 保存
    handleSubmit () {
      _request.http(this, '/admin/contentBanner/registerAgreement/update', this.formItem).then(res => {
        this.$Message.success('操作成功')
        this.getData()
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="less" scoped>
  /deep/.text {
    height: 500px;
    min-height: 500px;
  }
  /deep/.w-e-text {
    min-height: 500px;
  }
</style>

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
import wangEditor from '@/components/wangEditor/wangEditor'
import { registerAgreementread, registerAgreementupdate } from '@/api/content'
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
      registerAgreementread().then(res => {
        if (res.data.code == '0') {
          this.formItem.content = res.data.data.configVal
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 保存
    handleSubmit () {
      registerAgreementupdate({ content: this.formItem.content }).then(res => {
        if (res.data.code == '0') {
          this.$Message.success('操作成功')
          this.getData()
        } else {
          this.$Message.error(res.data.msg)
        }
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

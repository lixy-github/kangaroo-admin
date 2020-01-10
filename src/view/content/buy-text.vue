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
import { sysfindList, sysmodify } from '@/api/config'
export default {
  name: 'discountCoupon',
  components: {
    wangEditor
  },
  data () {
    return {
      formItem: {
        content: ''
      },
      rowData: []
    }
  },
  methods: {
    // 获取
    getData () {
      let _data = {
        configKey: 'CONTENT_TRADE_AGREEMENT'
      }
      sysfindList(_data).then(res => {
        if (res.data.code == '0') {
          res.data.data.forEach(val => {
            if (val.configKey == 'CONTENT_TRADE_AGREEMENT') {
              this.formItem.content = val.configVal
              this.rowData = val
            }
          })
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 保存
    handleSubmit () {
      let _data = {
        id: this.rowData.id,
        configKey: this.rowData.configKey,
        configVal: this.formItem.content,
        remark: this.rowData.remark
      }
      sysmodify(_data).then(res => {
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

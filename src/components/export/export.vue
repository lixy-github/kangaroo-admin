<!-- 分次请求接口并合成数据导出excel 例如：总共10w条数据，设置每次只请求1000条， 分100次请求服务器 防止一次请求10w条导致服务器爆炸  -->
<template>
  <div style="display: inline-block">
    <Button :disabled="disabled" type="warning" @click="modal=true">
      导出
    </Button>

    <Modal ref="modal" :loading="loading" v-model="modal" title="导出到EXCEL" @on-ok="out" @on-cancel="cancel">
      <p v-if="sending">请求数据中...</p>
      <p v-else>确认导出该查询条件下的所有数据？</p>
      <div style="width: 100%">
        <Progress v-if="sending" :percent="~~(sendCount / count * 100)"></Progress>
      </div>
    </Modal>
  </div>
</template>

<script>
import { export_array_to_excel } from '@/libs/excel'
export default {
  props: {
    fileName: {
      type: String,
      default: '列表'
    },
    ajax: Function, // 请求方法
    params: Object, // 携带参数
    filter: Object, // 需要处理的字段{'key': fn} fn处理函数，返回处理后的值
    // 映射ajax返回有关数据的位置
    map: {
      type: Object,
      default: () => {
        return {
          data: 'data.data.list.list',
          count: 'data.data.list.total'
        }
      }
    },
    columns: Array // tabel的colums
  },
  data () {
    return {
      size: 500, // 每次请求多少条
      modal: false,
      loading: true,
      isStop: false, // 被终止
      sending: false, // 接口请求中
      disabled: false, // 按钮禁用
      count: '', // 总共需要请求多少次
      sendCount: 0, // 已经发送的次数
      ajaxData: [], // 表格数据
      dataPlace: this.map.data,
      countPlace: this.map.count
    }
  },

  components: {},

  computed: {
    // 构造excel标题
    excelTitle () {
      var arr = this.columns.map((item) => {
        return item.title
      })
      arr.forEach((item, index) => {
        if (item == '操作' || item == '审核' || item == undefined) arr.splice(index, 1)
      })
      return arr
    },
    // key
    excelKey () {
      var arr = this.columns.map((item) => {
        return item.key
      })
      arr.forEach((item, index) => {
        if (item == undefined) arr.splice(index, 1)
      })
      return arr
    },
    // 所需数据
    excelData () {
      var arr = this.ajaxData.map(item => {
        var obj = {}
        for (var i in item) {
          for (var _i = 0; _i < this.excelKey.length; _i++) {
            if (i == this.excelKey[_i]) {
              obj[i] = item[this.excelKey[_i]]
            }
          }
        }

        return this.filterData(obj)
      })
      return arr
    }
  },

  methods: {
    // 过滤需要处理的字段
    filterData (obj) {
      if (this.filter) {
        for (var i in this.filter) {
          if (obj.hasOwnProperty(i)) {
            obj[i] = this.filter[i].call(null, obj[i])
          }
        }
        return obj
      }
      return obj
    },
    cancel () {
      this.modal = false
      this.ajaxData = []
      this.isStop = true
      this.sending = false
      this.sendCount = 0
    },
    // 处理参数
    transParams () {
      console.log(this.params)
      this.params.pageSize = this.size
      // 删除无效key
      for (var i in this.params) {
        if (this.params[i] == '') {
          delete this.params[i]
        }
        if (i == 'timeArea') {
          delete this.params[i]
        }
      }
    },
    // 点击函数
    out () {
      var _this = this
      this.sending = true
      this.isStop = false
      this.loading = true
      // 处理参数
      this.transParams()
      var sendData = JSON.parse(JSON.stringify(this.params))
      sendData.pageNumber = this.sendCount + 1
      this.ajax(sendData).then((r) => {
        console.log(r)
        if (r.data.code == '0') {
          var data = eval('r.' + this.dataPlace)
          this.ajaxData = this.ajaxData.concat(data)
          // 总数 = 总条数/每次请求条数   ~~向下取整
          var count = eval(`(r.${this.countPlace} / _this.size)`)
          this.count = count < 1 ? 1 : Math.ceil(count)
          this.sendCount = 1
          this.loop()
        } else {
          this.isStop = true
          alert('导出失败')
          this.$router.go(0)
        }
      }).catch(r => {
        alert('导出失败')
        this.$router.go(0)
      })
    },
    loop () {
      if (this.isStop) return
      if (this.sendCount > this.count || this.sendCount == this.count) {
        // 完成
        this.create()
        return
      }
      var sendData = JSON.parse(JSON.stringify(this.params))
      sendData.pageNumber = this.sendCount + 1
      this.ajax(sendData).then((r) => {
        if (r.data.code == '0') {
          this.sendCount++ //
          var data = eval('r.' + this.dataPlace)
          this.ajaxData = this.ajaxData.concat(data)
          this.loop()
        } else {
          this.isStop = true
          alert('导出失败')
          this.$router.go(0)
        }
      }).catch(r => {
        alert('导出失败')
        this.$router.go(0)
      })
    },
    // 创建excel
    create () {
      const params = {
        title: this.excelTitle,
        key: this.excelKey,
        data: this.excelData,
        autoWidth: true,
        filename: this.fileName
      }
      export_array_to_excel(params)

      this.cancel()
    }
  }
}

</script>
<style>
</style>

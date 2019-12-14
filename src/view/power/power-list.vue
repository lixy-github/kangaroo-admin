<template>
  <div>
    <Table :columns="columns" :data="tableData" stripe></Table>
    <Page :current="page.current" :total="page.total" @on-change="changePage" class-name="custom-page" />
  </div>
</template>

<script>
import { powerList } from '@/api/api'
export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          type: 'index'
        },
        {
          title: '名称',
          key: 'powerName'
        },
        {
          title: '地址',
          key: 'powerUrl'
        }
      ],
      tableData: [],
      page: {
        current: 1,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    // 列表
    showTable () {
      powerList().then(res => {
        if (res.data.code == '0') {
          this.tableData = res.data.data.dataList
          this.page.current = res.data.data.pageIndex
          this.page.total = res.data.data.total
        } else {
          this.$Message.warning(res.data.msg)
          this.tableData = []
          this.page.current = 1
          this.page.total = 0
        }
      }).catch(err => { })
    },
    // 分页
    changePage (num) {
      this.page.current = num
      this.showTable()
    }
  },
  mounted () {
    this.showTable()
  }
}
</script>

<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
// import { indexCount } from "@/api/api";
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    getdata (type) {
      indexCount({
        countType: type
      }).then(res => {
        if (res.data.code == '0') {
          // console.log(res.data.data.monthMap)
          this.barDatati = res.data.data.monthMap
          this.salesList = res.data.data.salesList
        } else {
          this.$Message.error('获取数据失败')
        }
      }).catch(function (error) {
      })
    },
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    this.$nextTick(() => {
      on(window, 'resize', this.resize)
    })
  },
  watch: {
    value () {
      let xAxisData = []
      for (let i in Object.keys(this.value)) {
        xAxisData.push(Object.keys(this.value)[i] + '月')
      }
      // let xAxisData = Object.keys(this.value)
      let seriesData = Object.values(this.value)
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          show: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            rotate: 12,
            fontSize: 10
          }
        },
        series: [{
          data: seriesData,
          type: 'bar'
        }]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>

<template>
  <Row :gutter="20">
    <Col span="26" class="demo-tabs-style1" style="background: #fff;padding:16px;">
    <Tabs type="card" :animated="false" @on-click="tabClick">
      <TabPane :label="item.label" v-for="(item,index) in tabData" :key="index">
        <h3>{{item.label}}销量排名</h3>
        <!-- 展示10条 -->
        <ul class="tabUl">
          <li v-for="(item,index) in salesList" :key="index" v-if="index < listLength">
            <span class="num">{{index + 1}}</span>
            <span>{{item.goodsName}}</span>
            <span>{{item.countBuyCount}}件</span>
          </li>
          <li class="lookMore" @click="lookMoreBtn" v-if="lookMore">查看更多</li>
          <li class="lookMore" v-else>暂无更多</li>
        </ul>
        <!-- <ul class="tabUl" v-else>
          <li v-for="(item,index) in salesList" :key="index">
            <span class="num">{{index + 1}}</span>
            <span>{{item.goodsName}}</span>
            <span>{{item.countBuyCount}}件</span>
          </li>
        </ul> -->

      </TabPane>
    </Tabs>
    </Col>
  </Row>
</template>
<script>
import { indexCount } from '@/api/api'
export default {
  props: {
    salesList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      countType: 'day',
      tabData: [
        { label: '今日' },
        { label: '本月' },
        { label: '全年' }
      ],
      listLength: 10,
      lookMore: true
    }
  },
  methods: {
    tabClick (val) {
      switch (val) {
        case 0:
          this.countType = 'day'
          break
        case 1:
          this.countType = 'month'
          break
        case 2:
          this.countType = 'year'
          break
      }
      this.$emit('getdata', this.countType)
      this.lookMore = true
      this.listLength = 10
    },
    lookMoreBtn () {
      if (this.salesList.length > 10) {
        this.listLength = this.salesList.length
      } else {
        this.listLength = 10
      }
      this.lookMore = !this.lookMore
    }
    /* getdata() {
        let _this = this;
        indexCount().then(function(response) {
          if(response.data.code == 200) {
          } else {
            _this.$Message.error("获取数据失败");
          }
        }).catch(function(error) {
          console.log(error);
        });
      } */
  },
  watch: {
    /* salesList() {
        // listIsShow
        if(this.salesList.length > 10) {

        }
        console.log(this.salesList.length)
      } */
  }
}
</script>
<style lang="less" scoped>
  /deep/.demo-tabs-style1 .ivu-tabs-content {
    height: 350px;
    overflow-y: scroll;
  }
  .tabUl {
    width: 100%;
    padding: 20px 20px 0 0;
    box-sizing: border-box;
    li {
      display: flex;
      margin-bottom: 10px;
      justify-content: space-between;
      color: #222;
      :nth-child(2) {
        flex: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      :nth-child(3) {
        flex: 1;
      }
      .num {
        display: inline-block;
        color: rgb(237, 64, 20);
        font-size: 16px;
        text-align: center;
        flex: 1;
      }
    }
    .lookMore {
      justify-content: space-around;
      cursor: pointer;
      color: #2d8cf0;
    }
  }
</style>

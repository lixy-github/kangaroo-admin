<template>
  <div>
    <transition name="bounce">
      <div class="addChannelList" v-if="isShow" :style="{width:width?width:'580px'}">
        <slot name="list"></slot>
      </div>
    </transition>
    <div class="model" v-if="isShow" @click="$emit('changeModelStatus', false)"></div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: {
      default: false,
      type: Boolean
    },
    width: {
      default: '580px',
      type: String
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
  .addChannelList {
    position: fixed;
    right: 0;
    top: 0;
    height: 100%;
    width: 580px;
    background: #fff;
    z-index: 11;
    overflow-y: auto;
  }
  .addChannelList::-webkit-scrollbar {
    display: none;
  }
  .model {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    top: 0;
    left: 0;
    z-index: 10;
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 50px;
  }
</style>

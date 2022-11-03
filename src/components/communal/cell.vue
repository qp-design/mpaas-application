<template>
  <div class="com-cell" @click="clicked">
    <span class="title">{{title}}</span>
    <span class="right">
      <span v-if="value" class="value" :style="{color: valueColor}">{{value}}</span>
      <slot></slot>
      <i class="icon-font icon-gengduo" v-if="isLink"></i>
    </span>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    value: String,
    isLink: {
      type: Boolean,
      default: true
    },
    valueColor: {
      type: String,
      default: '#666'
    }
  },
  methods: {
    clicked() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="less" scoped>
.com-cell {
  height: 88rpx;
  line-height: 88rpx;
  background-color: #fff;
  padding: 0 30rpx;
  margin: 20rpx 0;
  .title {
    font-size: 28rpx;
    color: #333;
    float: left;
  }
  .right {
    float: right;
    i {
      float: right;
      color: #c8c8c8;
      font-weight: lighter;
      font-size: 24rpx;
      padding: 0;
      margin: 0;
    }
    .value {
      color: #666;
      font-size: 26rpx;
      float: left;
      margin-right: 10rpx;
    }
  }
}
</style>

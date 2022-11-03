<template>
  <view class="com-data-line" v-show="lastPageLine">{{text}}</view>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '---你已经翻到了我的底线了~:)---'
    },
    lastPageLine:{
      type: Boolean,
      default:true
    }
  }
}
</script>

<style lang="less" scoped>
.com-data-line {
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  width: 100%;
  color: #999;
  font-size: 24rpx;
  background: #fff;
}
</style>

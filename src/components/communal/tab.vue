<template>
  <ul class="com-tab">
    <li v-for="(item, index) in tablist" :key="index" :class="currentTab === index ? 'active' : ''" @click="handleToggle(index)">
      <span :style="currentTab === index ? {borderColor:theme} : ''">
        {{item.name}}
        <a class="message" v-if="item.message"></a>
      </span>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    tablist: {
      type: Array
    },
    currentTab: Number,
    theme: String
  },
  methods: {
    handleToggle(index) {
      this.$emit('change-tab', index)
    }
  }
}
</script>
<style lang="less" scoped>
.com-tab {
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  height: 88rpx;
  line-height: 80rpx;
  display: flex;
  justify-content: space-between;
  align-content: center;
  border-bottom: 1rpx solid #eee;
  font-size: 28rpx;
  background: #fff;
  z-index: 999;
  color: #010101;
  font-family: PingFang-SC-Medium;
  li {
    flex: 1;
    text-align: center;
    position: relative;
    span {
      width: 80%;
      margin: 0 auto;
      text-align: center;
      font-family: PingFang-SC-Bold;
      border-bottom: 6rpx solid #fff;
      display: inline-block;
      .message {
        display: block;
        width: 20rpx;
        height: 20rpx;
        background-color: #f43531;
        border-radius: 50%;
        float: right;
        margin-top: 14rpx;
      }
    }
  }
  li.active {
    span {
      font-weight: bold;
    }
  }
}
</style>

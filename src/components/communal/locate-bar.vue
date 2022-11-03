<template>
  <ul class="com-locate-bar">
    <li v-if="locateChars.length"><i class="ali-icon-sousuo"></i></li>
    <li v-for="(item, index) in locateChars" :key="index" @click="confirm(item)" :id="item.char">
      {{item.char}}
      <span class="water-dot" v-if="item.show">
        <a>{{item.char}}</a>
      </span>
    </li>
  </ul>
</template>

<script>
/**
 * 右侧的快速定位栏
 * 包裹此控件的父节点必须使用position: relative;
 * 必须传入查询的字符
 * 如let locateChars = ['a', 'b']
 * 调用
 * <FastLocateBar :chars="locateChars" @click="locateChar"></FastLocateBar>
 * locateChar(char) {
 * 需要设置scroll-view 的scroll-into-view属性
 * }
 */
export default {
  props: {
    chars: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      locateChars: []
    }
  },
  watch: {
    chars() {
      this.initData()
    }
  },
  onLoad() {
    this.initData()
  },
  methods: {
    initData() {
      this.locateChars = []
      if (this.chars && this.chars.length) {
        this.chars.map(char => {
          this.locateChars.push({
            char,
            show: false
          })
        })
      }
    },
    confirm(item) {
      item.show = true
      const timer = setTimeout(() => {
        clearTimeout(timer)
        item.show = false
      }, 300)
      this.$emit('click', item.char)
    }
  }
}
</script>

<style lang="less" scoped>
.com-locate-bar {
  position: fixed;
  right: 6rpx;
  color: #000;
  padding: 12rpx 8rpx;
  text-align: center;
  font-size: 22rpx;
  background-color: #a8a8a8;
  border-radius: 10rpx;
  bottom: 120rpx;
  li {
    position: relative;
    text-align: center;
    i {
      margin: 0;
      padding: 0;
      font-size: 18rpx;
    }
    .water-dot {
      position: absolute;
      left: -60rpx;
      top: -24rpx;
      display: inline-block;
      height: 37px;
      width: 24px;
      transform: rotate(-90deg);
      -ms-transform: rotate(-90deg);
      -moz-transform: rotate(-90deg);
      -webkit-transform: rotate(-90deg);
      -o-transform: rotate(-90deg);
      a {
        transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        display: block;
        text-align: center;
        padding-left: 10px;
        opacity: 1;
        color: #fff;
      }
    }
    .water-dot::before,
    .water-dot::after {
      content: '';
      position: absolute;
      display: inline-block;
    }
    .water-dot::before {
      left: 0;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-image: repeating-radial-gradient(
        0 0 at 50% 20px,
        transparent 0,
        transparent 0,
        #b2b2b2 20px,
        #b2b2b2 117%
      );
    }
    .water-dot::after {
      bottom: 0;
      left: 50%;
      border: 17px solid #b2b2b2;
      border-bottom-width: 0;
      border-right-width: 10px;
      border-left-width: 10px;
      transform: translate(-48%, 0);
      border-bottom-color: transparent;
      border-right-color: transparent;
      border-left-color: transparent;
    }
  }
}
</style>

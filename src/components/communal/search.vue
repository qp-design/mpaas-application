<template>
  <div class="com-search" :style="{'background-color': outColor}">
    <div class="simple-search-box" :style="{'background-color': innerColor}">
      <i class="ali-icon-sousuo"></i>
      <input
        v-model="searchText"
        :placeholder="placeholder"
        :disabled="_readonly"
        @click="loadSearchPage"
        @confirm="confirm"
        :confirm-type="confirmType"
        :focus="autofocus"/>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
/**
 * 简单的搜索栏，需要传入背景颜色、文本框颜色、placeholder、@confirm事Î件
 * 具体参数见props
 */
export default {
  props: {
    placeholder: String,
    confirmType: {
      type: String,
      default: 'search'
    },
    outColor: {
      type: String,
      default: '#F5F5F5'
    },
    innerColor: {
      type: String,
      default: '#fff'
    },
    value: String,
    _readonly: {
      type: Boolean,
      default: true
    },
    autofocus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchText: this.value,
      historyData: []
    }
  },
  onShow() {
    let searchText = global.searchText
    if (searchText) {
      global.searchText = undefined
      this.searchText = searchText
      this.confirm(null, false)
    }
  },
  onUnLoad() {
    this.searchText = ''
  },
  methods: {
    loadSearchPage() {
      if (this._readonly) {
        this.$routers.push('communal/search-with-history', {placeholder: this.placeholder})
      }
    },
    clearSearch() {
      if (!this._readonly) {
        this.searchText = ''
        this.$emit('input', this.searchText)
        this.$emit('confirm', '')
      }
    },
    confirm(e, _readonly = this._readonly) {
      if (!_readonly) {
        this.$emit('input', this.searchText)
        this.$emit('confirm', this.searchText)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.com-search {
  background-color: #f5f5f5;
  padding: 20rpx 30rpx;
  .simple-search-box {
    height: 60rpx;
    line-height: 60rpx;
    background-color: #fff;
    border-radius: 8rpx;
    & > i,
    & > input {
      float: left;
    }
    input {
      font-size: 24rpx;
      margin-top: 10rpx;
      width: calc(100% - 95rpx);
      color: #333;
    }
    i {
      color: #c0c0c0;
    }
    i:first-of-type {
      padding: 0;
      margin: 0;
      font-size: 24rpx;
      color: #c0c0c0;
      margin-right: 10rpx;
      margin-left: 15rpx;
    }
  }
}
</style>

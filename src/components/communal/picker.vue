<template>
  <div class="com-picker">
    <picker v-if="mode === 'selector'" mode="selector" @change="handleRegionChange" :value="selected" :range="option">
      <view class="picker">
        请选择{{option[selected] || ''}}
      </view>
    </picker>
    <picker v-else mode="date" @change="handleDateChange" :value="date" :start="start" :end="end">
      <view class="picker">
        {{date}}
      </view>
    </picker>
  </div>
</template>
<script>
export default {
  props: {
    index: Number,
    mode: String,
    selected: String,
    start: String,
    end: String,
    option: {
      type: Array,
      default: []
    },
    date: {
      type: String,
      default: ''
    }
  },
  mounted() {
    console.log(this.mode,this.selected,this.option)
  },
  methods: {
    handleRegionChange(e) {
      const index = this.index
      const value = e.target.value
      this.selected = value
      this.$emit('change-option', index, value)
    },
    handleDateChange(e) {
      const index = this.index
      const value = e.target.value
      this.date = value
      this.$emit('change-option', index, value)
    }
  }
}
</script>
<style lang="less" scoped>
.com-picker {
  .picker {
    text-align: right;
    color: #666;
    font-size: 28rpx;
    padding-right: 10rpx;
  }
}
</style>

<template>
  <div class="com-modal" :style="{display: show ? 'flex' : 'none'}">
    <div class="dgfn-mask" @click.stop="close"></div>
    <div class="dialog">
      <i class="ali-icon-guanbi2" @click.stop="close"></i>
      <div class="title">{{title}}</div>
      <div class="content" @click.stop="custormerFunc">
        <slot name="content"></slot>
      </div>
      <div class="btn-box">
        <div class="cancel" v-if="showCancel" :style="{color: cancelColor}" @click.stop="cancel">{{cancelText}}</div>
        <div class="confirm" :style="{color: confirmColor, width: (showCancel ? '49%' : '100%')}" @click.stop="confirm">{{confirmText}}</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '提示'
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    cancelColor: {
      type: String,
      default: '#333'
    },
    confirmText: {
      type: String,
      default: '取消'
    },
    confirmColor: {
      type: String,
      default: '#4E7BFC'
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    show() {
      return this.value
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel', this.cancel)
    },
    confirm() {
      this.$emit('confirm', this.confirm)
    },
    close() {
      this.$emit('input', false)
    },
    custormerFunc() {
      this.$emit('custormerFunc')
    }
  }
}
</script>
<style lang="less" scoped>
.com-modal {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .dialog {
    min-width: 500rpx;
    max-width: 700rpx;
    min-height: 150rpx;
    max-height: 600rpx;
    background-color: #fff;
    border-radius: 14rpx;
    z-index: 101;
    position: relative;
    i {
      position: absolute;
      right: 22rpx;
      top: 22rpx;
      color: #b0b0b0;
    }
    .title {
      font-size: 30rpx;
      padding: 20rpx;
    }
    .content {
      padding: 40rpx 83rpx;
      border-bottom: solid 1px #eee;
      font-size: 30rpx;
      color: #333;
      line-height: 50rpx;
    }
    .btn-box {
      box-sizing: content-box;
      height: 88rpx;
      div {
        height: 88rpx;
        line-height: 88rpx;
        width: 49%;
        float: left;
        border: none;
        outline: none;
        font-size: 32rpx;
        text-align: center;
        &:first-of-type {
          border-right: solid 1rpx #eee;
        }
        &:last-of-type {
          border: none;
        }
        &.cancel {
          color: #666;
        }
        &.confirm {
          color: #4e7bfc;
        }
      }
    }
  }
}
</style>

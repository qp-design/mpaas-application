<template>
  <div class="com-no-data">
    <img :src="img"/>
    <p>{{message}}</p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '啥也没查到~ :-('
    },
    img: {
      type: String,
      default: this.$domain + 'dgfn-img/no-data.png'
    }
  }
}
</script>

<style lang="less" scoped>
.com-no-data {
  margin: 50px auto;
  width: 320rpx;
  img {
    max-width: 100%;
  }
  p {
    text-align: center;
    color: #999;
    font-size: 28rpx;
  }
}
</style>

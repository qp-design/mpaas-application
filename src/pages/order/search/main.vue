<template>
  <div class="search">
    <div class="search-top">
      <div class="search-top-input">
        <i class="iconfont">&#xe613;</i>
        <view class="section">
          <input placeholder="商品名称" type='text' placeholder-style="color:#999" confirm-type="search" @confirm="onSubmit($event)" auto-focus v-model="inputValue"/>
        </view>
      </div> 
      <div class="search-top-btn" @click="()=>{$routers.back(1,{stay: 500})}">取消</div>
    </div>
  </div>
</template>
<script>
import http from '@/api/http.js'
import {$storage,$routers} from '@/utils/prototype/vue.js'
export default {
  data() {
    return {
      inputValue:''
    }
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: $storage.get('proappEnvName')
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#'+this.baseColor
    })
  },
  onShow(){
  	// #ifdef H5
  	this.$routers.refreshH5();
  	// #endif
  },
  mounted() {
    this.inputValue=''
  },
  methods:{
    onSubmit(e){
      this.inputValue = e.target.value
      let query = {
        goodsName:this.inputValue
      }
		this.$routers.push('order/searchResult', {goodsName: JSON.stringify(query)})
    }
  }
}
</script>


<style lang="less" scoped>
@import '@/common/css/common.less';
  .search{
    width: 100%;
    height: 100%;
    background: @white-color;
    &-top{
      padding:20rpx 20rpx 10rpx 30rpx;
      display: flex;
      justify-content: space-between;
      // height: 68rpx;
      align-items: center;
      border-bottom: 1rpx solid #ececec;
      &-back{
        a{
          width: 36rpx;
          height: 68rpx;
          display: inline-block;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      &-input{
        position: relative;
        width: calc(100% - 64rpx);
        i{
          width: 36rpx;
          height: 68rpx;
          line-height: 68rpx;
          display: inline-block;
          position: absolute;
          left: 0rpx;
          top: 0;
          color: @color-999;
        }
        input{
          display: 1;
          height: 68rpx;
          font-size: @middle-title;
          padding-left: 60rpx;
          
        }
        input::-webkit-input-placeholder{
          color: @color-999;
        }
      }
      &-btn{
        width: 88rpx;
        height: 68rpx;
        line-height: 68rpx;
        text-align: center;
        font-size: 28rpx;
      }
    }
  }
</style>


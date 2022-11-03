<template>
    <div class="integralRule">
      <commonHeader 
      :title="title"
      :leftIcon="leftIcon"
      :rightIcon="rightIcon"
      />
      <div class="integralRule-con">
        <p>1，单笔订单积分最高抵扣订单金额56%。</p>
        <p>2，每5积分可抵扣1元。</p>
        <p>3，每实际支付50元可获得1积分，订单完成时存入积分账户。</p>
      </div>
      
    </div>
    
</template>

<script>
import {$storage,$routers} from '@/utils/prototype/vue.js'
import commonHeader from '@/components/communal/commonHeader';
export default {
  data() {
    return {
      title:'积分规则',
      leftIcon:true,
      rightIcon:false,
    }
  },
  components:{
    commonHeader
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
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
@import '../../../common/css/common.less';
.integralRule{
  width: 100%;
  height: 100%;
  background: @white-color;
  &-con{
    padding:140rpx 30rpx 0;
    p{
      line-height: 55rpx;
      font-size: @middle-title;
      color: @color-333;
    }
  }
}
</style>





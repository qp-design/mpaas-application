<template>
  <view class="myPoints">
    <view class="top">
      <view>优点</view>
      <view>{{list.faccountAmount}}</view>
    </view>
    <view class="content" v-for="(item,index) in detailList" :key="index">
      <view class="content-num">流水号：{{item.paymentOrderMemo}}</view>
      <view class="conten-item">
        <view>类型</view>
        <view v-if="item.orderDc==1">消费支出</view>
        <view v-if="item.orderDc==2">转入</view>
        <view v-if="item.orderDc==1">-{{item.orderAmount}}</view>
        <view v-if="item.orderDc==2">{{item.orderAmount>=0?'+'+item.orderAmount:item.orderAmount}}</view>
      </view>
      <view>{{timesSeconds(item.gmtModified)}}</view>
    </view>
    <!-- 		<view class="content">
			<view class="content-num">流水号：123456789</view>
			<view class="conten-item">
				<view>类型</view>
				<view>消费支出</view>
				<view>-149</view>
			</view>
			<view>2020-08-20 18:23:23</view>
		</view> -->
  </view>
</template>

<script>
  import http from '@/api/http.js';
  import {
    $storage,
    $routers,
    $message
  } from '@/utils/prototype/vue.js';
  import {
    getMyPoints,
    getMyPointsDetail
  } from '@/api/interface.js';
  export default {
    data() {
      return {
        list: '',
        faccountOuterNo: '',
        detailList: '',
        faccountingDate: '',
        isShow: false
      }
    },
	onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
		this.getMybalance()
	},
    methods: {
      timesSeconds(timestamp) {
        if (!timestamp) {
          return;
        }
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const Y = date.getFullYear() + "-";
        const M =
          (date.getMonth() + 1 < 10 ?
            "0" + (date.getMonth() + 1) :
            date.getMonth() + 1) + "-";
        const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var h = null;
        var m = null;
        var s = null;
        if (date.getHours()) {
          h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        } else {
          h = "00";
        }
        if (date.getMinutes()) {
          m =
            date.getMinutes() < 10 ?
            ":" + "0" + date.getMinutes() :
            ":" + date.getMinutes();
        } else {
          m = ":00";
        }
        if (date.getSeconds()) {
          s =
            date.getSeconds() < 10 ?
            ":" + "0" + date.getSeconds() :
            ":" + date.getSeconds();
        } else {
          s = ":00";
        }
        return Y + M + D + "\xa0\xa0\xa0" + h + m + s;
      },
      getMybalance() {
        let params = {
          channelCode: 'channelCode'
        }
        http.get(getMyPoints, params).then(res => {
          this.list = res.dataObj;
          this.faccountOuterNo = res.dataObj.faccountOuterNo;
          console.log(this.faccountOuterNo, 'geyfffgtrfrtfr')
          let param = {
            faccountOuterNo: this.faccountOuterNo,
            rows: 10,
            page: 1
          };
          http.get(getMyPointsDetail, param).then(res => {
            let arr = []
            if (res && res.rows.length > 0) {
              this.detailList = res.rows

            }

          })
        })
      },
      // getDetail(){
      // 	let params={
      // 		faccountOuterNo:this.faccountOuterNo
      // 	}
      // 	http.get(getMyPointsDetail,params).then(res =>{
      // 		console.log(res,'1234678')
      // 	})
      // }
    },
    mounted() {
      
      // this.getDetail()
    }
  }
</script>

<style lang="less" scoped>
  .myPoints {
    background-color: #f5f5f5;
    width: 100%;

    .top {
      height: 300rpx;
      width: 100%;
      background-color: #EB2B27;
      padding: 24rpx;
      color: #FFFFFF;

      view:nth-child(1) {
        height: 72rpx;
        line-height: 72rpx;
        width: 100%;
      }

      view:nth-child(2) {
        margin: 40rpx 0rpx 0rpx;
        height: 72rpx;
        line-height: 72rpx;
        width: 100%;
        font-size: 64rpx;
      }
    }

    .content {
      height: 280rpx;
      width: 100%;
      background-color: #FFFFFF;
      margin: 0rpx 0rpx 20rpx 0rpx;
      padding-left: 20rpx;

      .content-num {
        height: 72rpx;
        line-height: 72rpx;
        width: 100%;
        border-bottom: 1rpx solid #f5f5f5;
        letter-spacing: 2rpx;
      }

      .conten-item {
        display: flex;
        justify-content: space-between;
        height: 150rpx;
        width: 100%;
        border-bottom: 1rpx solid #f5f5f5;
        align-items: center;
        font-size: 24rpx;
        color: #666666;

        view:nth-child(1) {
          height: 100rpx;
          width: 100rpx;
          line-height: 100rpx;
        }

        view:nth-child(2) {
          height: 200rpx;
          width: 200rpx;
          line-height: 200rpx;
          // margin-right: 300rpx;
        }

        view:nth-child(3) {
          text-align: right;
          height: 200rpx;
          line-height: 200rpx;
          color: #EB2B27;
          letter-spacing: 2rpx;
          font-weight: bold;
        }
      }

      view:nth-child(3) {
        height: 56rpx;
        line-height: 56rpx;
        width: 100%;
        letter-spacing: 2rpx;
        text-align: right;
        padding: 0rpx 20rpx 0rpx 0rpx;
      }
    }
  }
</style>

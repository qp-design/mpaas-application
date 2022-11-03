<template>
	<view class="notice">
		<view class="header">
			{{noticeMessage && noticeMessage.noticeTitle}}
		</view>
		<view class="time">
			发布时间：{{noticeMessage && timesSeconds (noticeMessage.gmtCreate,0)}}
		</view>
		<view class="content">
			{{noticeMessage && noticeMessage.noticeContext}}
		</view>
		<view class="imgs">
			<image :src="noticeMessage.noticePicurl | urlFilter" mode=""></image>
		</view>
	</view>
</template>

<script>
	import {noticeDetail } from "@/api/newApi.js";
	import {timesSeconds} from '@/utils/formate.js'
	import {checkImgUrl} from '@/utils/checkImg.js'
	import http from '@/api/http.js';
	export default {
		
		data(){
			return {
				checkImgUrl,
				timesSeconds,
				noticeMessage:'',
				time:''
			}
		},
		onLoad(id){
			console.log(id.id)
			let noticeId = id.id
			http.get(noticeDetail.noticeDetail,{noticeId}).then(res=>{
				this.noticeMessage = res
				this.time = res.gmtCreate
			})
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		}
	}
</script>

<style scoped lang="less">
	.notice{
		.header{
			font-size: 34rpx;
			color: #333333;
			padding: 36rpx 49rpx;
			font-weight: 700;
		}
		.time{
			font-size: 24rpx;
			color: #999999;
			padding-left: 49rpx;
		}
		.content{
			color: #666666;
			font-size: 24rpx;
		    padding: 63rpx 48rpx;
			text-align: left;
			line-height: 40rpx;
		}
		.imgs{
			padding: 0  48rpx;
			image{
				width: 654rpx;
			}
			
			
		}
	}
</style>

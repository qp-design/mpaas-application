<template>
	<view class="getCouponDetail">
		<view class="top">
			<image :src="giftUrl"></image>
			<view>
				<span v-if="giftName.giftSendName">{{giftName.giftSendName}}</span>
				<span>{{list.giftName}}</span>
			</view>
			<view style="margin-right: 20rpx;">X{{giftName.giftUserNum}}</view>
		</view>
		<view class="center">已兑换商品</view>
		<view class="footer" >
			<view class="footer-nav" style="font-weight: bold;">
				<view>商品名称</view>
				<view>数量</view>
				<view>礼包商品价格</view>
			</view>
			<view class="footer-nav" v-for="(item,index) in listDetail" :key="index">
				<view>{{item.goodsName}}</view>
				<view>{{item.giftUserrelNum}}</view>
				<view>{{item.pricesetBaseprice}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
	import { getMyCouponDetail } from '@/api/interface.js';
	export default{
		// #ifndef H5
		props:["giftUserCode"],
		// #endif
		data(){
			return{
				list:'',
				giftUrl:'',
				giftWebremark:'',
				listDetail:'',
				giftName:'',
				giftUserCode:''
			}
		},
		// #ifdef H5
		onLoad(options) {
			this.giftUserCode = options.giftUserCode
		},
		onShow(){
			this.$routers.refreshH5();
		},
		// #endif
		methods:{
			MyCouponDetail(){
				let params={
					giftUserCode:this.giftUserCode
				}
				http.post (getMyCouponDetail,params).then(res =>{
					this.list=res
					this.giftName=res.gtGiftUserDomain;
					this.giftUrl=this.$domain+res.giftUrl
					this.listDetail=res.gtGiftUserrelDomainList
				})
			}
		},
		mounted() {
			this.MyCouponDetail()
		}
	}
</script>

<style lang="less" scoped>
	.getCouponDetail{
		background-color: #f5f5f5;
		width:100%;
		.top{
			display: flex;
			height:200rpx;
			width:100%;
			background-color: #FFFFFF;
			border:1rpx solid #f5f5f5;
			align-items: center;
			justify-content: space-between;
			image{
				height:156rpx;
				width:156rpx;
				margin-left: 20rpx;
			}
			view:nth-child(2){
				height:200rpx;
				width:400rpx;
				line-height: 100rpx;
				
				span{
					width:400rpx;
					display: block;
					overflow: hidden;
					text-overflow: ellipsis;
					
					white-space: nowrap;
				}
			}
			view:nth-child(3){
				text-align: center;
				height: 200rpx;
				line-height: 200rpx;
				// margin-left: 100rpx;
				
			}
		}
		.center{
			height:80rpx;
			width:100%;
			line-height: 80rpx;
			margin-left: 20rpx;
			background-color: #f5f5f5;
			font-size: 26rpx;
			color: #000000;
		}
		.footer{
			background-color: #FFFFFF;
			padding: 0rpx 10rpx 10rpx 10rpx ;
			width: 100%;
			.footer-nav{
				height:82rpx;
				line-height: 82rpx;
				display: flex;
				justify-content:space-between;
				border-bottom:1px solid #f5f5f5;
				color: #000000;
				font-size: 26rpx;
				view:nth-child(1){
				height:82rpx;
				line-height: 82rpx;	
				width:33%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				text-align: center;
				}
				view:nth-child(2){
				height:82rpx;
				line-height: 82rpx;	
				width:33%;
				text-align: center;
				}
				view:nth-child(3){
				height:82rpx;
				line-height: 82rpx;	
				width:33%;
				text-align: center;
				}
			}
		}
	}
</style>

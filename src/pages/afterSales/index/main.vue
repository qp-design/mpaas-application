<template>
	<view class="afterService u-skeleton">
		<!-- #ifndef H5 -->
		<nav-bar title="售后服务" :background="{ backgroundColor: `#ffffff` }" :delta="delta" class="navBars" ></nav-bar>
		<!-- #endif -->
		<view class="afterService--search u-skeleton-rect">
			<view class="afterService--search--input">
				<view>
					<text class="iconfont icon-sousuo u-skeleton-rect"></text>
				</view>
				<input class="u-skeleton-fillet" type="text" placeholder="服务订单" v-model="keyword"  @confirm="search"/>
			</view>
		</view>
		
		<!-- #ifndef H5 -->
		<view class="afterService--list" v-if="serviceGoodsList.length > 0">
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="afterService--list" v-show="serviceGoodsList.length > 0">
		<!-- #endif -->
			<view class="afterService--list--item" v-for="(item,index) in serviceGoodsList" :key="index">
				
				<view class="afterService--list--item--top">
					<view class="afterService--list--item--top--left u-skeleton-rect">服务单号：{{item.refundCode}}</view>
					
					<view class="afterService--list--item--top--right" v-if="item.refundType==='JDB02'">
						<image class="u-skeleton-circle" src="../../../static/teaImg/tuihuo.png" ></image>
						<view class="u-skeleton-rect">退货</view>
					</view>
					
					<view class="afterService--list--item--top--right" v-else-if="item.refundType==='JDB04'">
						<image class="u-skeleton-circle" src="../../../static/teaImg/weixiu.png" ></image>
						<view class="u-skeleton-rect">维修</view>
					</view>
					
					<view class="afterService--list--item--top--right" v-else-if="item.refundType==='JDB03'">
						<image class="u-skeleton-circle" src="../../../static/teaImg/huanhuo.png" ></image>
						<view class="u-skeleton-rect">换货</view>
					</view>
					<view class="afterService--list--item--top--right" v-else-if="item.refundType==='B03'">
						<image class="u-skeleton-circle" src="../../../static/teaImg/tuihuo.png" ></image>
						<view class="u-skeleton-rect">订单已取消</view>
					</view>
					<view class="afterService--list--item--top--right" v-else-if="item.refundType==='B01' || item.refundType==='JDB01'">
						<image class="u-skeleton-circle" src="../../../static/teaImg/jintuikuan.png" ></image>
						<view class="u-skeleton-rect">仅退款</view>
					</view>
					
					<view class="afterService--list--item--top--right" v-else>
						<image class="u-skeleton-circle" src="../../../static/teaImg/tuihuotuikuan.png" ></image>
						<view class="u-skeleton-rect">退货退款</view>
					</view>
				</view>
				
				<view class="afterService--list--item--center" v-for="(items,index) in item.ocRefundGoodsList" :key="index">
					<view class="afterService--list--item--center--left" >
						<image  class="u-skeleton-rect" :src="items.dataPic | urlFilter" mode=""></image>
					</view>
					<view class="afterService--list--item--center--right">
						<view class="afterService--list--item--center--right--top u-skeleton-rect">{{items.goodsName}}</view>
						<view class="afterService--list--item--center--right--bottom u-skeleton-rect">申请数量：{{items.refundGoodsNum}}</view>
					</view>
				</view>
				
				<view class="afterService--list--item--bottom u-skeleton-rect" v-if="item.dataState==0" @click="goDetail(item)">
					<view class="afterService--list--item--bottom--left">待审核</view>
					<view class="afterService--list--item--bottom--center">处理中 申请成功，等待系统审核</view>
					<view class="afterService--list--item--bottom--right">
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				
				<view class="afterService--list--item--bottom u-skeleton-rect" v-else-if="item.dataState==1" @click="goDetail(item)">
					<view class="afterService--list--item--bottom--left">审核通过</view>
					<view class="afterService--list--item--bottom--center">处理中 系统审核通过</view>
					<view class="afterService--list--item--bottom--right">
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				
				<view class="afterService--list--item--bottom u-skeleton-rect" v-else-if="item.dataState==2" @click="goDetail(item)">
					<view class="afterService--list--item--bottom--left">待买家收货</view>
					<view class="afterService--list--item--bottom--center">处理中 等待卖家收货</view>
					<view class="afterService--list--item--bottom--right">
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				
				<view class="afterService--list--item--bottom u-skeleton-rect" v-else-if="item.dataState==3" @click="goDetail(item)">
					<view class="afterService--list--item--bottom--left">待退款</view>
					<view class="afterService--list--item--bottom--center">处理中 等待商家退款</view>
					<view class="afterService--list--item--bottom--right">
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				
				<view class="afterService--list--item--bottom u-skeleton-rect" v-else-if="item.dataState==4" @click="goDetail(item)">
					<view class="afterService--list--item--bottom--left">系统处理中</view>
					<view class="afterService--list--item--bottom--center">处理中 系统处理中</view>
					<view class="afterService--list--item--bottom--right">
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				
				<view class="afterService--list--item--bottom u-skeleton-rect" v-else-if="item.dataState==6" @click="goDetail(item)">
					<view class="afterService--list--item--bottom--left">商家拒接收货</view>
					<view class="afterService--list--item--bottom--center">完成 商家已拒绝</view>
					<view class="afterService--list--item--bottom--right">
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				
				<view class="afterService--list--item--bottom u-skeleton-rect" v-else-if="item.dataState==8" @click="goDetail(item)">
					<view class="afterService--list--item--bottom--left">完成</view>
					<view class="afterService--list--item--bottom--center">服务已完成，感谢您对我们的支持</view>
					<view class="afterService--list--item--bottom--right">
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				
				<view class="afterService--list--item--bottom u-skeleton-rect" v-else @click="goDetail(item)">
					<view class="afterService--list--item--bottom--left">撤销申请</view>
					<view class="afterService--list--item--bottom--center">已撤销 用户撤销申请</view>
					<view class="afterService--list--item--bottom--right">
						<text class="iconfont icon-xiangyou"></text>
					</view>
				</view>
				
			</view>
			
		</view>
	
		<!-- #ifndef H5 -->
		<view class="afterService--error" v-else>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="afterService--error" v-show="serviceGoodsList.length === 0">
		<!-- #endif -->
			<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/JD/ZQ/search.png" mode="" style="width:370rpx; height: 300rpx; margin-top: 30%;"></image></image></view>
		<u-skeleton :loading="loading" v-show="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import { afterService } from '@/api/newApi.js';
	import url from '@/api/configCheck.js'
	import navBar from '../navBar.vue'
	export default {
		components:{
			navBar
		},
		data() {
			return {
				loading: true,
				//售后商品列表
				serviceGoodsList : [],
				
				//搜索关键字
				keyword:'',
				delta:0 ,//从哪个页面跳转过来，1退款 0个人中心
				page: 1, //分页
				rows: 10,
				total: 0,
			};
		},
		created(){
			http.post(afterService.serviceList,{page:this.page,rows:this.rows}).then(res => {
				// this.serviceGoodsList = res.list
				if(res && res.rows){
					this.loading=false
					if (this.page === 1 && res.rows.length === 0) {
						this.serviceGoodsList = [];
					} else {
					let list = res.rows;
					if (this.page === 1) {
						this.serviceGoodsList = list;
					} else {
						this.serviceGoodsList = [...this.serviceGoodsList, ...list];
					}
				}
				}
				this.total = res.total;
			});
		},
		onLoad(e) {
			this.delta=e.delta;
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		onReachBottom() {
			// 到这底部在这里需要做什么事情
			this.loadMore();
		},
		// #ifdef H5
		onBackPress(options) {
			window.history.back()
			return true
		},
		// #endif
		methods:{
			loadMore() {
				let num = Math.ceil(this.total / 10);
				this.page++;
				if (this.page <= num) {
					this.getlist();
				}
			},
			//搜索结果
			search(){
				http.post(afterService.serviceDetail , {refundCode:this.keyword}).then(res => {
					this.serviceGoodsList = res.list
				});
			},
			
			//跳详情
			goDetail(item){
				let code = item.refundCode
				this.$routers.push('afterSales/detail', {refundCode: code})
			}
		},
		
		
	}
</script>

<style lang="less" scoped>
	.afterService{
		// background-color: #F5F5F5;
		// background-color: #fff;
		
		&--search{
			width: 100%;
			height: 112rpx;
			background-color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0 0 24rpx 24rpx;
			margin-bottom: 24rpx;
			
			&--input{
				position: relative;
				view{
					position: absolute;
					top: 12rpx;
					left: 36rpx;
				}
				
				input{
					width: 702rpx;
					height: 64rpx;
					padding-left: 86rpx;
					box-sizing: border-box;
					border-radius: 32rpx;
					background-color: #F5F5F5;
				}
			}
		}
		
		&--error{
			text-align: center;
		}
		&--list{
			background-color: #F5F5F5;
			&--item{
				width: 100%;
				height: 350rpx;
				background-color: #fff;
				border-radius: 24rpx;
				margin-bottom: 24rpx;
				padding: 0 24rpx;
				
				&--top{
					width: 100%;
					height: 76rpx;
					border-bottom: 2rpx solid #F1F1F1;
					// background-color: yellow;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 24rpx;
					
					&--left{
						font-size: 28rpx;
						color: #999;
					}
					
					&--right{
						display: flex;
						
						image{
							width: 32rpx;
							height: 32rpx;
						}
						
						view{
							font-size: 24rpx;
							color: #333;
							margin-left: 8rpx;
						}
					}
				}
				
				&--center{
					width: 100%;
					height: 120rpx;
					// background-color: pink;
					display: flex;
					margin-bottom: 24rpx;
					
					&--left{
						width: 120rpx;
						height: 120rpx;
						// background-color: rgba(0,0,0,.5);
						margin-right: 24rpx;
						
						image{
							width: 120rpx;
							height: 120rpx;
						}
					}
					
					&--right{
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						
						&--top{
							font-size: 28rpx;
							color: #333;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2; /* 自定义的行数 */
							overflow: hidden;
						}
						
						&--bottom{
							font-size: 24rpx;
							color: #A5A5A5;
						}
					}
				}
				
				&--bottom{
					width: 100%;
					height: 80rpx;
					border-radius: 8rpx;
					background-color: #F5F5F5;
					display: flex;
					align-items: center;
					
					&--left{
						// width: 102rpx;
						padding: 0 24rpx;
					}
					
					&--center{
						flex: 1;
					}
					
					&--right{
						width: 56rpx;
					}
				}
			}
		}
	}
</style>

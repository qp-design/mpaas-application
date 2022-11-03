<template>
	<view class="main">
		<view class="fimg" v-if="article.doclistInfopicpathe">
			<image :src="article.doclistInfopicpathe | urlFilter" mode="" style="width: 100%; height: 100%;"></image>
		</view>
		
		<view class="zbt" v-if="article.doclistTitle">
			{{article.doclistTitle}}
		</view>
		
		<!-- <view class="fbt" v-if="article.doclistTitle1">
			{{article.doclistTitle1}}
		</view> -->
		
		<view class="auth" v-if="article.doclistTitle4New">
			作者：{{article.doclistTitle4New}}
		</view>
		
		<u-parse :html="dbObj.doclistInfocon"></u-parse>
		
		<view class="goodsShow" v-if="dbObj.goodsList !=  ''">
			<view class="title">
				推荐商品
			</view>
			<view class="goodsMain">
				<view class="item" v-for="(item,index) in dbObj.goodsList" :key="index" @click="goDetail(item)">
					<image :src="item.dataPic | urlFilter" mode="" style="width: 340rpx;height: 340rpx;"></image>
					<view class="iname">
						{{item.goodsName}}
					</view>
					<view class="iprice">
						<view class="new">
							<span >￥</span>
							<span>{{ toFix(item.pricesetNprice, 2, 1) || 0 }}</span>
							<span>{{ toFix(item.pricesetNprice, 2, 2) || 0 }}</span>
						</view>
						<view class="old">
							<span>￥</span>
							<span>{{ toFix(item.pricesetMakeprice, 2, 1) || 0 }}</span>
							<span>{{ toFix(item.pricesetMakeprice, 2, 2) || 0 }}</span>
						</view>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { article } from '@/api/interface.js';
import { $storage, $routers } from '@/utils/prototype/vue.js';

	import {
		checkImgUrl
	} from '@/utils/checkImg.js'
export default {
	data(){
		return {
			checkImgUrl,
			baseColor: '',
			article:{},
			img:this.$imgDomain,
			main:'',
			dbObj:{}
		}
	},
	onLoad(options) {
		http.get(article.articleDetail,{doclistId:options.doclistId}).then((res)=>{
			this.article=res
			this.dbObj = JSON.parse(res.doclistContent)
			console.log(this.dbObj,'6+6++6+')
			if( this.dbObj.doclistInfocon.indexOf('<img src="') != -1){
				this.dbObj.doclistInfocon = this.dbObj.doclistInfocon.split('<img src="').join('<img src="'+$domain)
			}
		})
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods:{
		toFix(num1, num2, num3) {
			if (num1 == undefined || num1 == null) {
				return num1;
			} else {
				if (num3 == 1) {
					return this.toSub(num1.toFixed(num2), 1);
				} else if (num3 == 2) {
					return this.toSub(num1.toFixed(num2), 2);
				} else {
					return num1.toFixed(num2);
				}
			}
		},
		toSub(str, num) {
			let res = (str + '').split('.');
			if (num == 1) {
				return res[0];
			}
			if (num == 2) {
				return '.' + res[1];
			}
		},
		
		goDetail(item){
			this.$routers.push('detail', {skuNo: item.skuCode})
		}
	}
}
</script>

<style lang="less" scoped>
*{
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}	

.main{
	width: 100%;
	padding: 12rpx 25rpx 0;
	
	.fimg{
		width: 700rpx;
		height: 400rpx;
		margin-bottom: 36rpx;
	}
	
	.zbt{
		width: 100%;
		font-size: 36rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 600;
		color: #262626;
		margin-bottom: 10rpx;
	}
	
	.fbt{
		width: 100%;
		font-size: 28rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		margin-bottom: 10rpx;
	}
	
	.auth{
		width: 100%;
		font-size: 22rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #999999;
		margin-bottom: 36rpx;
	}
	
	.goodsShow{
		width: 100%;
		margin-top: 64rpx;
		.title{
			font-size: 28rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 600;
			color: #262626;
			margin-bottom: 20rpx;
		}
		
		.goodsMain{
			width: 100%;
			// height: 1000rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			
			.item{
				width: 340rpx;
				margin-bottom: 30rpx;
				
				.iname{
					width: 340rpx;
					height: 64rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #333333;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					margin: 6rpx 0;
				}
				
				.iprice{
					display: flex;
					
					.new{
						display: flex;
						font-size: 26rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #EB2B27;
						margin-right: 14rpx;
					}
					
					.old{
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #8C8C8C;
						text-decoration: line-through;
						position: relative;
						top: 5rpx;
					}
				}
				
			}
		}
	}
}
</style>

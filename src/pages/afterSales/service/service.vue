<template>
	<view>
		<view class="afterSales-header">
			<view class="service-tag">
				本次售后服务由
				<text v-if="params.goodsType == '40'">京东</text>
				<text v-else>商家</text>
				提供
			</view>
			<view class="sales-message">
				<image class="sales-image" :src="checkImgUrl(params.dataPic)"></image>
				<view class="sales-desc">
					<view class="sales-title">{{ params.goodsName }}</view>
					<view class="sales-import">
						<view class="sales-price" v-html="'单价：' + thinMoney(params.pricesetNprice)"></view>
						<view class="sales-num">购买数量：{{ params.goodsNum }}</view>
						<view class="sales-num" v-if="params.goodsLogmoney">邮费：{{ params.goodsLogmoney}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="service-tags">
			<view v-if="params.goodsType == '40' && params.dataState != 2">
				<view class="service-tag-item" v-for="(item, index) in list1" :key="index" @click="jumpJd(item)">
					<view class="service-tag-left">
						<view class="service-tag-icon"><image :src="item.icon" mode="widthFix"></image></view>
						<view :class="['service-tag-name' , item.show==true ? 'active' : '']">{{ item.name }}</view>
					</view>
					<view class="service-tag-right">
						<view>{{ item.text }}</view>
						<view class="iconfont icon-xiangyou"></view>
					</view>
				</view>
			</view>
			<view v-else>
				<view class="service-tag-item" v-for="(item, index) in list2" :key="index" @click="jumpCommon(item)">
					<view class="service-tag-left">
						<view class="service-tag-icon"><image :src="item.icon" mode="widthFix"></image></view>
						<view class="service-tag-name">{{ item.name }}</view>
					</view>
					<view class="service-tag-right">
						<view>{{ item.text }}</view>
						<view class="iconfont icon-xiangyou"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { $storage,  } from '@/utils/prototype/vue.js';
import { afterService } from '@/api/newApi.js';
import { checkImgUrl } from '@/utils/checkImg.js';
export default {
	data() {
		//标品和京东两套售后流程 ！！！！！！！！！！！！！！
		return {
			checkImgUrl,
			list1: [
				{ name: '退货', text: '退回收到的商品', icon: '../../../static/teaImg/tuihuo.png', refundType: 'JDB02', show: false },
				{ name: '换货', text: '更换收到的商品', icon: '../../../static/teaImg/huanhuo.png', refundType: 'JDB03', show: false },
				{ name: '维修', text: '维修收到的商品', icon: '../../../static/teaImg/weixiu.png', refundType: 'JDB04', show: false }
			],
			params: {},
			//支持的售后类型
			typeList: [],
			list2: [],
			goodsLogmoney:$storage.get("goodsLogmoney")||0
		};
	},
	onLoad(option) {
		// #ifdef H5
		if(option.params){
			this.params = JSON.parse(this.$percent2percent25(option.params))
		}else {
			let paramss = JSON.parse(this.$storage.sessionGet('params'))
			this.params = paramss
		}
		// #endif
		// #ifndef H5
		this.params = JSON.parse(decodeURIComponent(option.params));
		console.log(this.params, 'this.params++=');
		// #endif
		
		if(this.params.goodsType=='40' && this.params.dataState == 2){
			this.list2 = [{ name: '仅退款', text: '仅退回付款金额，无需退货', icon: '../../../static/teaImg/jintuikuan.png', refundType: 'JDB01' }]
			return
		}
		
		if (this.params.dataState == 2&&this.params.goodsType!='40') {
			this.list2 = [{ name: '仅退款', text: '仅退回付款金额，无需退货', icon: '../../../static/teaImg/jintuikuan.png', refundType: 'B01' }];
		} else {
			this.list2 = [
				{ name: '仅退款', text: '仅退回付款金额，无需退货', icon: '../../../static/teaImg/jintuikuan.png', refundType: 'B01' },
				{ name: '退货退款', text: '退回收到的商品', icon: '../../../static/teaImg/tuihuotuikuan.png', refundType: 'B02' }
			];
		}

		const typeParam = {
			thirdApplyId: this.params.contractBillcode,
			orderId: this.params.orderId,
			skuIds: this.params.skuIds,
			memberCode: this.params.memberCode,
			tenantCode: this.params.tenantCode,
			channelCode: 'jdvop'
		};
		if (this.params.goodsType == '40') {
			http.post(afterService.queryVopRefundAtt, typeParam).then(res => {
				this.typeList = JSON.parse(res.dataObj).jingdong_vop_afs_getGoodsAttributes_responce.openRpcResult.result[0].customerExpect;
				this.typeList.forEach(item => {
					if (item == 10) {
						this.list1[0].show = true;
					} else if (item == 20) {
						this.list1[1].show = true;
					} else if (item == 30) {
						this.list1[2].show = true;
					}
				});
			});
		}
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods: {
		jumpJd(item) {
			console.log('itemitemitem',item)
			if (item.show) {
				this.$routers.push('/pages/afterSales/salesBack/salesBack', {params: JSON.stringify({ ...this.params, refundType: item.refundType })})
			}
		},
		jumpCommon(e) {
			console.log('eeeeeeee',e)
			
			if (e.refundType == 'B01') {
				this.$routers.push('/pages/afterSales/refundOnly/index', {detail: encodeURIComponent(JSON.stringify(this.params))})
			}else if(e.refundType == 'JDB01'){
				this.$routers.push('/pages/afterSales/refundOnlyJD/index', {detail: JSON.stringify(this.params)})
			}else {
				console.log('this.params',this.params)
				console.log('要传过去的',{detail: JSON.stringify(this.params)})
				this.$routers.push('/pages/afterSales/refundGoods/index', {detail: encodeURIComponent(JSON.stringify(this.params))})
			}
		}
	}
};
</script>

<style lang="less">
page {
	font-family: PingFangSC-Regular, PingFang SC;
	height: 100vh;
	background: #f7f7f7;
}

.afterSales-header {
	width: 100%;
	background: white;
	overflow: hidden;
	border-radius: 0px 0px 24rpx 24rpx;
	margin-bottom: 24rpx;
	.service-tag {
		width: 252rpx;
		height: 36rpx;
		border-radius: 18rpx;
		color: #a5a5a5;
		font-size: 20rpx;
		text-align: center;
		line-height: 36rpx;
		background: #f4f4f4;
		margin: 12rpx auto;
		text {
			color: #db2330;
		}
	}
	.sales-message {
		box-sizing: border-box;
		width: 100%;
		padding: 24rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;

		.sales-image {
			width: 120rpx;
			height: 120rpx;
			background: #f5f5f5;
			border-radius: 6rpx;
		}
		.sales-desc {
			flex: 1;
			box-sizing: border-box;
			padding-left: 24rpx;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			.sales-title {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.sales-import {
				display: flex;
				justify-content: flex-start;
				.sales-num {
					margin-left: 32rpx;
				}
			}
		}
	}
}
.service-tags {
	width: 100%;
	box-sizing: border-box;
	border-radius: 24rpx;
	padding: 0rpx 24rpx;
	background: white;

	.service-tag-item {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 40rpx 0rpx;
		border-bottom: 2rpx solid #f1f1f1;
		.service-tag-left {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			.service-tag-icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
				image {
					width: 100%;
				}
			}

			.active {
				color: #000 !important;
			}

			.service-tag-name {
				color: #c0c0c0;
				font-size: 28rpx;
				font-weight: 500;
			}
		}
		.service-tag-right {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			font-size: 24rpx;
			view {
				color: #999999;
				&:first-child {
					margin-right: 10rpx;
				}
				&:last-child {
					font-size: 24rpx !important;
				}
			}
		}
		&:last-child {
			border-bottom: none;
		}
	}
}
</style>

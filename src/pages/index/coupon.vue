<template>
	<view class="coupon">
		<view v-if="couponList.length > 0">
			<view class="couponList"  v-for="(item, index) in couponList" :key="index">
				<view class="couponItem">
					<view class="itemTop">
						<image src="../../static/couponHui.png" mode="" v-if="item.availabledate == -1"></image>
						<image src="../../static/couponImg.png" mode="" v-else></image>
			
						<view class="getCoupon-content">
							<view class="content">
								<view class="contentLeft">
									<view class="top">
										￥
										<span>{{ item.discAmount }}</span>
									</view>
									<view class="bottom">满{{ item.discStart }}可用</view>
								</view>
								<view class="contentCenter">
									<view class="top">{{ item.promotionName }}</view>
									<view class="bottom">
										<view class="">领取时间：{{ timesSeconds(item.receiveStart) }}~{{ timesSeconds(item.receiveEnd) }}</view>
										<view class="">使用时间：{{ timesSeconds(item.promotionBegintime) }}~{{ timesSeconds(item.promotionEndtime) }}</view>
									</view>
								</view>
								<view class="contentRight">
									<view class="getNow1" v-if="item.availabledate == -1">立即领取</view>
									<view class="getNow" v-else @click="nowCoupon(item)">立即领取</view>
								</view>
							</view>
						</view>
					</view>
					<view class="itemBottom" v-if="item.rangeType == 0">使用范围：全场通用</view>
					<view class="itemBottom" v-if="item.rangeType == 1">使用范围：指定店铺</view>
					<view class="itemBottom" v-if="item.rangeType == 2">使用范围：指定品牌</view>
					<view class="itemBottom" v-if="item.rangeType == 3">使用范围：指定类型</view>
					<view class="itemBottom" v-if="item.rangeType == 4">使用范围：指定分类</view>
					<view class="itemBottom1" v-if="item.rangeType == 5">使用范围： {{ item.name }}</view>
				</view>
			</view>
		</view>
		
	
		<!-- 缺省 -->
		<view class="noCoupon" v-else>
			<view>
				<image src="../../static/couponNo.png" mode=""></image>
			</view>
			
			<view>暂无优惠券</view>
		</view>
	</view>

</template>

<script>
import http from '@/api/http.js';
import { coupon } from '@/api/newApi.js';
import { $message } from '@/utils/prototype/vue.js';
import { timesSeconds } from '@/utils/formate.js';
export default {
	data() {
		return {
			timesSeconds,
			couponList: '',
			rangeTypeName: ''
		};
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted() {
		this.getCoupon();
		// this.rangeType(item);
	},
	methods: {
		//获取优惠券
		getCoupon() {
			http.get(coupon.queryCouponListBySkuCode).then(res => {
				if (res) {
					this.couponList = res;
					let couponList1 = [];
					let couponList2 = [];
					let timestamp = new Date().getTime();
					this.couponList.forEach(item => {
						if (timestamp > item.receiveEnd) {
							item.availabledate = -1;
							console.log(item, 'items');
						}
					});
					this.couponList.forEach(items => {
						if (items.availabledate == -1) {
							couponList2.push(items);
							console.log(items, 'item2');
						} else {
							couponList1.push(items);
							console.log(items, 'items1');
						}
					});
					this.couponList = couponList1.concat(couponList2);
					let msg = '';
					this.couponList.forEach(el => {
						msg = '';
						el.pmPromotionRangeList.map(items => {
							msg += items.pprlOpname + ' ';
						});
						el.name = msg;
					});
					console.log(this.couponList, 'this.couponList');
				}
			});
		},
		//领取优惠券
		nowCoupon(item) {
			http.get(coupon.saveUsercoupon, { couponAmount: 1, promotionCode: item.promotionCode }).then(res => {
				if (res) {
					if (res.success) {
						$message.alert(res.msg);
						this.getCoupon();
					} else {
						$message.alert(res.msg);
					}
				}
			});
		}
		// rangeType(item) {
		// 	item.pmPromotionRangeList.map(i => {
		// 		this.rangeTypeName = i.pprlOpname;
		// 	});
		// }
	}
};
</script>

<style lang="less" scoped>
.coupon {
	padding: 0 25rpx 30rpx;
	.couponList {
		width: 750rpx;
		padding-top: 30rpx;
		.couponItem {
			width: 700rpx;
			position: relative;
			box-shadow: 0px 10rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 14rpx;
			.itemTop {
				width: 700rpx;
				height: 176rpx;
				image {
					width: 700rpx;
					height: 176rpx;
				}
				.getCoupon-content {
					position: absolute;
					width: 700rpx;
					height: 176rpx;
					top: 0;
					left: 0;
					.content {
						display: flex;
						width: 700rpx;
						position: relative;
						.contentLeft {
							width: 200rpx;

							padding: 20rpx 0 10rpx 35rpx;
							color: #fff;
							.top {
								text-align: center;
								height: 100rpx;
								span {
									font-size: 64rpx;
								}
							}
							.bottom {
								width: 200rpx;
								display: flex;
								font-size: 24rpx;
								justify-content: center;
							}
						}
						.contentCenter {
							color: #fff;
							padding: 40rpx 40rpx 10rpx;
							.top {
								width: 350rpx;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								font-size: 36rpx;
								padding-bottom: 11rpx;
							}
							.bottom {
								font-size: 20rpx;
								view {
									padding-bottom: 10rpx;
								}
							}
						}
						.contentRight {
							position: absolute;
							top: 25rpx;
							right: 39rpx;
							.getNow {
								width: 50rpx;
								height: 120rpx;
								background: #ffffff;
								border-radius: 25rpx;
								padding: 12rpx 13rpx;
								line-height: 24rpx;
								background: #ffffff;
								color: #eb2b27;
								font-size: 24rpx;
							}
							.getNow1 {
								width: 50rpx;
								height: 120rpx;
								background: #ffffff;
								border-radius: 25rpx;
								padding: 12rpx 13rpx;
								line-height: 24rpx;
								background: #ffffff;
								font-size: 24rpx;
								color: #d8d8d8;
							}
						}
					}
				}
			}
			.itemBottom {
				padding: 10rpx 55rpx;
				width: 700rpx;
				display: flex;
				color: #000;
				font-size: 24rpx;
				line-height: 40rpx;
				align-items: center;
				// word-wrap: break-word;
				word-break: break-all;
			}
			.itemBottom1 {
				padding: 10rpx 55rpx;
				width: 700rpx;
				display: flex;
				color: #000;
				font-size: 24rpx;
				line-height: 40rpx;
				align-items: center;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				// word-wrap: break-word;
				word-break: break-all;
			}
		}
	}
	.noCoupon {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		image {
			width: 400rpx;
			height: 400rpx;
		}
	}
}
</style>

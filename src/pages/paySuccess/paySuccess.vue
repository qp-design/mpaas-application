<template>
	<view class="paySuccess" :style="{ 'padding-top': carPadding }">
		<!-- 内容区 -->
		<view class="successContent">
			<view class="successTitle">
				<image src="../../static/img/paySuccess.png"></image>
				<view>{{ pageState == 0 ? '您已成功支付' : '您已成功下单' }}</view>
			</view>
			<view class="successButton">
				<view @click="goIndex()">继续逛逛</view>
				<view @click="goDetail()">查看订单</view>
			</view>
			<!-- 商品推送 -->
			<view class="sales-push" v-if="carStatus != 'nologin'">
				<view class="sales-push-title">
					<view class="push-left-icon">
						<view></view>
						<view></view>
					</view>
					<view class="sales-push-content">为您推荐</view>
					<view class="push-right-icon">
						<view></view>
						<view></view>
					</view>
				</view>
				<commidityList :recomList="recomList" :status="status"></commidityList>
			</view>
		</view>
	</view>
</template>

<script>
import commidityList from '@/components/commidityList.vue';
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { bigdata, index } from '@/api/newApi.js';
import { syncContractPayState } from '@/api/interface.js';
export default {
	components: {
		commidityList
	},
	data() {
		return {
			recomList: [],
			status: 'nomore',
			pageState: 0,
			contractBillcode: 'v',
			flag:true,
			carStatus:''
		};
	},
	created() {
		http.get(bigdata.index).then(res => {
			this.recomList = [...this.recomList, ...res.list];
		});
		http.get(bigdata.index).then(res => {
			this.recomList = [...this.recomList, ...res.list];
		});
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	onLoad(options) {
		wx.setNavigationBarTitle({
			title: '支付成功'
		});
		this.pageState = options.pageState;
		this.contractBillcode = options.contractBillcode;
		console.log(options.contractBillcode, 'options');
	},
	onUnload() {
		if(this.flag){
			this.$routers.switchTab('index')
		}
	},
	mounted() {
		this.positionCalc();
		
		http.get(index.floors, { tginfoMenuCode: 'recommendation' }).then(res => {
			res.list.map((item, index) => {
				if (item.htmltagCode == 'payrec') {
					this.recomList = [...this.recomList,...item.cmsContlistReDomainList];
				}
			});
		});
		// #ifdef H5
		let that = this;
		if(!this.contractBillcode){	
			that.contractBillcode = that.$storage.get("orderId");
		}
			http.post(syncContractPayState, {
				contractBillcode: that.contractBillcode
			}).then(res => {
				if (res.success) {
					// 支付成功  
					$storage.set('payContractBillcode', that.contractBillcode);
					that.pageState = 0;
				} else {
					that.$message.alert('支付失败！');
				}
			})
		// #endif
	},
	methods: {
		goIndex() {
			this.$routers.switchTab('index')
		},
		goDetail() {
			this.flag=false;
			// #ifndef H5
			this.$routers.reOpen('order/infor', {id: this.contractBillcode,jumpUrl: 'morePages'})
			// #endif
			// #ifdef H5
			this.$routers.push('order/infor', {id: this.contractBillcode,jumpUrl: 'morePages'})
			// #endif
		}
	}
};
</script>

<style lang="scss">
.car-header {
	position: fixed;
	top: 0rpx;
	width: 100%;
	z-index: 999;
	background: white;
	.backButton {
		position: absolute;
		left: 20rpx;
		bottom: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
	}
	.centerText {
		width: 100%;
		text-align: center;
		font-size: 34rpx;
		font-weight: 500;
	}
}
.paySuccess {
	/* #ifndef H5 */
	height: 100%;
	/* #endif */
	/* #ifdef H5 */
	height: 100vh;
	/* #endif */
	background: #f7f7f7;
	.successContent {
		.successTitle {
			display: flex;
			justify-content: center;
			align-items: center;
			/* #ifndef H5 */
			margin-top: 95rpx;
			/* #endif */
			/* #ifdef H5 */
			padding-top: 195rpx;
			/* #endif */
			margin-bottom: 60rpx;
			overflow: hidden;
			image {
				width: 50rpx;
				height: 58rpx;
				margin-right: 15rpx;
			}
			view {
				font-size: 28rpx;
				color: #333333;
				height: 50rpx;
				line-height: 50rpx;
			}
		}
		.successButton {
			display: flex;
			justify-content: center;
			padding-bottom: 80rpx;
			view {
				width: 208rpx;
				height: 74rpx;
				line-height: 74rpx;
				text-align: center;
				font-size: 26rpx;
				font-weight: 500;
				border-radius: 37rpx;
				&:first-child {
					background: $theme;
					color: #ffffff;
					margin-right: 24rpx;
				}
				&:last-child {
					box-sizing: border-box;
					border: 1px solid $theme;
					color: $theme;
				}
			}
		}
	}
	// 商品推送
	.sales-push {
		.sales-push-title {
			display: flex;
			justify-content: center;
			padding: 40rpx 0rpx 20rpx;
			.push-left-icon {
				display: flex;
				align-items: center;
				& > view:first-child {
					width: 6rpx;
					height: 16rpx;
					background: #cd1c0e;
					border-radius: 4rpx;
					margin-right: 6rpx;
				}
				& > view:last-child {
					width: 6rpx;
					height: 28rpx;
					background: #cd1c0e;
					border-radius: 4rpx;
				}
			}
			.sales-push-content {
				font-size: 32rpx;
				padding: 0rpx 12rpx;
				font-weight: bold;
			}
			.push-right-icon {
				display: flex;
				align-items: center;
				& > view:first-child {
					width: 6rpx;
					height: 28rpx;
					background: #cd1c0e;
					border-radius: 4rpx;
					margin-right: 6rpx;
				}
				& > view:last-child {
					width: 6rpx;
					height: 16rpx;
					background: #cd1c0e;
					border-radius: 4rpx;
				}
			}
		}
		background: #f7f7f7;
	}
}
</style>

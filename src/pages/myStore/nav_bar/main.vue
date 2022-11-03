<template>
	<view class="nav-bar">
		<!-- 导航栏 -->
		<view class="list">
			<view class="item" v-for="(item, index) in navList" :key="index" @click="switchPage(item, index)">
				<i :class="'iconfont ' + item.icon" :style="{ color: current == index ? baseColor : '' }"></i>
				<text :style="{ color: current == index ? baseColor : '' }">{{ item.title }}</text>
			</view>
		</view>

		<u-popup v-model="isShowService" mode="center" border-radius="14" closeable="true">
			<view class="customerPopup">
				<view class="title">联系客服</view>
				<image :src="storeInfo.shopdeWeixinUrl | urlFilter" mode="widthFix" v-if="storeInfo.shopdeWeixinUrl"></image>
				<view class="tip" v-if="storeInfo.shopdeWeixinUrl">截图添加客服微信</view>
				<view class="hotline" @click="makePhone(storeInfo.shopdeLink)" v-else-if="storeInfo.shopdeLink">
					客服热线：
					<text>{{ storeInfo.shopdeLink }}</text>
				</view>
				<view class="hotline" v-else>暂无联系方式</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { queryShopdeByMerchant } from '@/api/interface.js';
import { domain } from '@/api/configCheck.js'
export default {
	props: ['current', 'propStoreInfo'],
	data() {
		return {
			navList: [
				{
					title: '店铺首页',
					icon: 'icon-dianpu-copy',
					url: '/pages/myStore/index/main'
				},
				{
					title: '全部商品',
					icon: 'icon-tuiguangshangpin',
					url: '/pages/myStore/commodity/main'
				},
				{
					title: '商品分类',
					icon: 'icon-fenlei',
					url: '/pages/myStore/classes/main'
				},
				{
					title: '联系客服',
					icon: 'icon-kefu1',
					url: ''
				}
			],
			// 客服联系方式
			isShowService: false,
			// 店铺信息
			storeInfo: {},
			// 图片前缀
			domain,
			// 店铺code
			memberCode: ''
		};
	},
	watch: {
		propStoreInfo(newValue, oldValue) {
			if (this.current == 0) {
				this.storeInfo = newValue;
			}
		}
	},
	created() {
		this.memberCode = uni.getStorageSync('memberCode');
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods: {
		// 播发电话
		makePhone(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
			});
		},
		switchPage(item, index) {
			if (index == this.current) {
				return;
			}
			if (index == 3) {
				this.isShowService = true;

				if (this.current == 0) {
					return;
				}
				// 获取联系方式
				// 查询店铺信息
				http.get(queryShopdeByMerchant, { memberCode: this.memberCode }).then(res => {
					if (res && res.rows) {
						this.storeInfo = res.rows[0];
					}
				});
			} else {
				uni.redirectTo({
					url: `${item.url}?memberCode=${this.memberCode}`
				});
			}
		}
	},
	onLoad() {}
};
</script>

<style lang="less" scoped>
.nav-bar {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	z-index: 100;
	background-color: #ffffff;
	.list {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 18rpx;
		color: #202020;
		padding: 0 40rpx;
		box-sizing: border-box;
		.item {
			display: flex;
			align-items: center;
			flex-direction: column;
			i {
				font-size: 50rpx;
			}
			text {
				position: relative;
				top: -7rpx;
			}
		}
	}
	.customerPopup {
		width: 480rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		.title {
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #333333;
			line-height: 44rpx;
			margin-top: 32rpx;
			margin-bottom: 38rpx;
		}
		image {
			width: 242rpx;
			height: 242rpx;
		}
		.tip {
			font-size: 24rpx;
			color: #999999;
			margin-top: 24rpx;
			margin-bottom: 32rpx;
		}
		.hotline {
			font-size: 24rpx;
			color: #999999;
			margin-bottom: 40rpx;
			text {
				color: #648ce7;
			}
		}
	}
}
</style>

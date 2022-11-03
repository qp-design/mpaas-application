<template>
	<view class="store">
		<!-- 头部 -->
		<view class="store-header" :style="{ height }">
			<view class="store-header-img"></view>
			<image :src="imgDomain + storeInfo.shopdeUrl" class="backImg" mode="aspectFill"></image>
			<view :style="{ marginTop: paddingTop }" class="box">
				<view class="store-header-title" :style="{ height: capsule }"><i class="iconfont" @click="goBack">&#xe62d;</i></view>
				<view class="store-header-info">
					<image :src="imgDomain + storeInfo.shopdeLogo" mode=""></image>
					<view class="intro">
						<view class="name">{{ storeInfo.shopdeName }}</view>
						<view :style="{background: baseColor}" class="tip" v-if="storeInfo.shopdeScope">{{ storeInfo.shopdeScope }}</view>
					</view>
					<view class="other">
						<view class="collect collected" v-if="isCollected" @click="cancelCollect">
							<i class="iconfont">&#xe610;</i>
							<text>已收藏</text>
						</view>
						<view class="collect" v-else @click="saveCollect">
							<i class="iconfont">&#xe66c;</i>
							<text>收藏</text>
						</view>
						<!-- <text class="num">18万人已收藏</text> -->
					</view>
				</view>
				<view class="store-header-search">
					<i class="iconfont">&#xe613;</i>
					<input type="text" v-model="goodsName" placeholder-style="color:#ffffff" confirm-type="search" placeholder="搜索本店商品" @confirm="saveHistory" />
				</view>
				
				
			</view>
		</view>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { queryShopdeByMerchant, checkCollectExit, saveCollect, deleteCollectByCode, querySkuFromSc } from '@/api/interface.js';
import { domain } from '@/api/configCheck.js'
export default {
	// page:是否是可搜索页面    propPage:是否是首页   propstoreInfo:头部数据 （在首页传过来）
	props: ['page', 'propPage', 'propStoreInfo'],
	data() {
		return {
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
			paddingTop: '20rpx',
			height: 0,
			capsule: 0,
			// 店铺信息
			storeInfo: '',
			// 图片前缀
			imgDomain: domain,
			// 是否收藏了店铺
			isCollected: false,
			// 店铺的id
			memberCode: '',
			// 搜索条件
			goodsName: '',
			// 搜索结果数据
			items: [],
			// 已收藏的code
			collectedCode: ''
		};
	},
	components: {},
	created() {
		// 获取胶囊按钮的信息
		var data = wx.getMenuButtonBoundingClientRect();
		this.paddingTop = data.top + 'px'; //上边界
		this.height = (data.top + data.height) * 2 + 318 + 'rpx'; // 搜索高度
		this.capsule = data.height + 'px'; // 胶囊高度
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted() {
		this.memberCode = uni.getStorageSync('memberCode');
		this.commonMounted();
	},
	watch: {
		propStoreInfo(newValue, oldValue) {
			if (this.propPage == 1) {
				this.storeInfo = newValue;
			}
		}
	},
	methods: {
		saveHistory(e) {
			//页面跳转
			this.$routers.push('goodsList',{searchParam: this.goodsName})
		},
		commonMounted() {
			if (!this.propPage == 1) {
				// 获取本地存储的memberCode
				http.get(queryShopdeByMerchant, { memberCode: this.memberCode }).then(res => {
					if (res && res.rows) {
						this.storeInfo = res.rows[0];
					}
				});
			}

			// 检测是否收藏了商品
			http.post(checkCollectExit, { collectType: 1, collectOpcode: this.memberCode }).then(res => {
				if (res && res.dataObj) {
					this.isCollected = true;

					// 并将res.dataObj保存下来
					this.collectedCode = res.dataObj;
				}
			});
		},
		// 取消收藏
		cancelCollect() {
			// uni.showModal({
			// 	title: '提示',
			// 	content: '确定取消收藏该店铺?',
			// 	success: function(res) {
			// 		if (res.confirm) {
			http.post(deleteCollectByCode, { collectCode: this.collectedCode, collectType: 1 }).then(res => {
				if (res.success) {
					this.$message.alert('已取消')
					this.isCollected = false;
				}
			});
			// 		}
			// 	}
			// });
		},
		// 收藏
		saveCollect() {
			http.post(saveCollect, {
				collectOpcode: this.memberCode,
				collectOpcont:this.storeInfo.shopdeName,
				collectOppic:this.storeInfo.shopdeLogo,
				collectType: 1
			}).then(res => {
				if (res.success) {
					this.$message.alert('收藏成功')
					this.isCollected = true;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
image {
	background-image: url(../../../static/common/dontHav.png);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}
.store {
	&-header {
		position: relative;
		// padding: 0 0 30rpx;
		// background-color: blue;
		overflow: hidden;
		&-img {
			position: absolute;
			width: 100%;
			height: 100%;
			background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
		}
		.backImg {
			width: 100%;
			font-size: 0rpx;
		}
		.box {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
		}
		&-title {
			width: 100%;
			font-size: 34rpx;
			font-weight: 400;
			color: #ffffff;
			font-weight: 700;
			margin-left: 44rpx;
			opacity: 0.8;
			margin-bottom: 44rpx;
		}
		&-info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 26rpx;
			box-sizing: border-box;
			image {
				width: 100rpx;
				height: 100rpx;
				background: #ffffff;
				border-radius: 12rpx;
			}
			.intro {
				margin: 0 auto 0 16rpx;
				.name {
					font-size: 32rpx;
					font-weight: 400;
					color: #ffffff;
					line-height: 44rpx;
				}
				.tip {
					width: fit-content;
					border-radius: 8rpx;
					font-size: 20rpx;
					font-weight: 400;
					color: #ffffff;
					padding: 6rpx 12rpx;
					margin-top: 10rpx;
				}
			}
			.other {
				.collect {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 123rpx;
					height: 48rpx;
					border-radius: 24rpx;
					margin-bottom: 8rpx;
					font-size: 20rpx;
					color: #ffffff;
					i {
						font-size: 26rpx;
						position: relative;
						top: 0rpx;
						left: -4rpx;
					}
				}
				.collected {
					border: 1px solid #cccccc;
					box-sizing: border-box;
					background-color: #ffffff;
					color: #cccccc;
					i {
						color: CCCCCC;
					}
				}
				.num {
					font-size: 20rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;
					opacity: 0.7;
				}
			}
		}
		&-search {
			width: 702rpx;
			height: 64rpx;
			background: rgba(244, 244, 244, 0.6);
			border-radius: 32rpx;
			font-size: 24rpx;
			font-weight: 400;
			color: #ffffff;
			line-height: 34rpx;
			display: flex;
			align-items: center;
			margin: 30rpx auto 0;
			i {
				margin-left: 40rpx;
				margin-right: 16rpx;
			}
		}
	}
}
</style>
<style lang="scss">
  .collect{
    background: $theme;
  }
</style>
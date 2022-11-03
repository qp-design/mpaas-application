<template>
	<view class="home">
		<!-- 店铺头部 -->
		<store-header :propStoreInfo="storeInfo" :propPage="1"></store-header>

		<!-- 内容 -->
		<view class="home-container">
			<swiper class="banner" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="item in banner">
					<image :src="item"></image>
				</swiper-item>
			</swiper>
			<view class="floorPicture">
				<image v-for="item in floorPicture" :src="item"></image>
			</view>
		</view>

		<!-- 导航栏 -->
		<nav-bar :current="0" :propStoreInfo="storeInfo"></nav-bar>
	</view>
</template>

<script>
	// 引入组件
	import {
		navBar
	} from '../nav_bar/main';
	import {
		storeHeader
	} from '../store_header/main.vue';
	import commidityList from '@/components/commidityList.vue';

	import http from '@/api/http.js';
	import {
		queryShopdeByMerchant,
		querySkuFromSc
	} from '@/api/interface.js';
	import {
		domain
	} from '@/api/configCheck.js'
	export default {
		data() {
			return {
				// 初始值
				memberCode: '',
				storeInfo: {},
				// 轮播图
				autoplay: true,
				interval: 2000,
				duration: 500,
				banner: ["../../../static/common/dontHav.png", "../../../static/common/queImg.png"],
				// 楼层图
				floorPicture: ["../../../static/common/dontHav.png", "../../../static/common/queImg.png"]
			};
		},
		components: {
			navBar,
			storeHeader,
			commidityList
		},
		created() {},
		onLoad(options) {
			uni.setStorageSync('memberCode', options.memberCode);
			this.memberCode = options.memberCode;
			this.commonMounted();
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		// #ifdef H5
		onBackPress(options) {
			window.history.back()
			return true
		},
		// #endif
		methods: {
			commonMounted() {
				// 查询店铺信息
				http.get(queryShopdeByMerchant, {
					memberCode: this.memberCode
				}).then(res => {
					if (res && res.rows) {
						this.storeInfo = res.rows[0];
					}
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	image {
		background-color: red;
	}

	.home {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f4f4f4;

		&-container {
			margin-top: -44rpx;
			z-index: 1;

			.banner {
				height: 440rpx;

				swiper-item {
					display: flex;
					justify-content: center;

					image {
						width: 700rpx;
						height: 440rpx;
						margin-left: auto;
						margin-right: auto;
					}
				}
			}

			.floorPicture {
				width: 700rpx;
				margin-top: 24rpx;
				margin-left: auto;
				margin-right: auto;

				image {
					width: 700rpx;
				}

			}
		}
	}
</style>

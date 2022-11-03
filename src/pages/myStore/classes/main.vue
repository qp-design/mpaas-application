<template>
	<view class="myStore">
		<store-header></store-header>
		<!-- 分类列表 -->
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation :lower-threshold="0" class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view
					v-for="(item, index) in classList"
					:key="index"
					class="u-tab-item"
					:class="[current == index ? 'u-tab-item-active' : '']"
					:data-current="index"
					@tap.stop="swichMenu(index)"
				>
					<text class="u-line-1">{{ item.classtreeName }}</text>
				</view>
			</scroll-view>
			<block v-for="(item, index) in classList" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current == index">
					<view class="top-area-bannner">
						<image :src="domain+item.classtreeLogo" mode="aspectFill" @error="nofindImg">></image>
					</view>
					<view class="page-view">
						<view class="class-item" v-for="(item1, index1) in item.childList" :key="index1">
							<view class="item-title">
								<text>{{ item1.classtreeName }}</text>
							</view>
							<view class="item-container">
								<view class="thumb-box" v-for="(item2, index2) in item1.childList" :key="index2">
									<image class="item-menu-image" :src="domain+item2.classtreeLogo" mode="aspectFill"></image>
									<view class="item-menu-name">{{ item2.classtreeName }}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>

		<!-- 导航栏 -->
		<nav-bar :current="2"></nav-bar>
	</view>
</template>

<script>
// 引入组件
import { navBar } from '../nav_bar/main';
import { storeHeader } from '../store_header/main.vue';
import http from '@/api/http.js';
import { queryShopRsGoodsClassPageByMemberCode } from '@/api/interface.js';
export default {
	data() {
		return {
			// tabbar: classifyData,
			scrollTop: 0, //tab标题的滚动条位置
			current: 0, // 预设当前项的值
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
			paddingTop: '20rpx',
			height: 0,
			capsule: 0,
			classList: [],
			domain:this.$domain,  // 图片前缀
			memberCode:''
		};
	},
	components: {
		navBar,
		storeHeader
	},
	computed: {},
	created() {
		// 获取胶囊按钮的信息
		var data = wx.getMenuButtonBoundingClientRect();
		this.paddingTop = data.top + 'px'; //上边界
		this.height = (data.top + data.height) * 2 + 270 + 'rpx'; // 搜索高度
		this.capsule = data.height + 'px'; // 胶囊高度
		
		this.memberCode=uni.getStorageSync('memberCode');
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods: {
		// 页面的初始化
		commonMounted() {
			http.get(queryShopRsGoodsClassPageByMemberCode, { memberCode: this.memberCode }).then(res => {
				if (res) {
					this.classList = res;
				}
			}) 
		},
		// 点击左边的栏目切换
		async swichMenu(index) {
			if (index == this.current) return;
			this.current = index;
			// 如果为0，意味着尚未初始化
			if (this.menuHeight == 0 || this.menuItemHeight == 0) {
				await this.getElRect('menu-scroll-view', 'menuHeight');
				await this.getElRect('u-tab-item', 'menuItemHeight');
			}
			// 将菜单菜单活动item垂直居中
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		// 获取一个目标元素的高度
		getElRect(elClass, dataVal) {
			new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.' + elClass)
					.fields({ size: true }, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					})
					.exec();
			});
		}
	},
	onLoad() {
		this.commonMounted();
	}
};
</script>

<style lang="scss" scoped>
image {
	background-image: url(../../../static/common/dontHav.png);
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
}
.myStore {
	display: flex;
	flex-direction: column;
	height: 100vh;
	&-header {
		position: relative;
		// padding: 0 0 30rpx;
		// background-color: blue;
		overflow: hidden;
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
					width: 64rpx;
					height: 36rpx;
					background: $theme;
					border-radius: 8rpx;
					font-size: 20rpx;
					font-weight: 400;
					color: #ffffff;
					text-align: center;
					line-height: 36rpx;
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
					background: $theme;
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

// 分类的样式

.u-menu-wrap {
	position: relative;
	z-index: 2;
	height: 100%;
	flex: 1;
	display: flex;
	overflow: hidden;
	background: #f5f5f5;
	box-sizing: border-box;
	padding-top: 13rpx;
	border-radius: 24rpx 24rpx 0px 0px;
	margin-top: -72rpx;
	margin-bottom: 100rpx;
}

.u-tab-view {
	width: 240rpx;
	// height: 100%;
}

.u-tab-item {
	height: 100rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
}

.u-tab-item-active {
	position: relative;
	color: #000;
	font-size: 30rpx;
	font-weight: 600;
	background: #fff;
	border-radius: 32rpx 0rpx 0rpx 32rpx;

	.u-line-1 {
		font-size: 32rpx;
	}
}

// .u-tab-item-active::before {
// 	content: "";
// 	position: absolute;
// 	border-left: 4px solid $u-type-primary;
// 	height: 32rpx;
// 	left: 0;
// 	top: 39rpx;
// }

.right-box {
	background-color: white;
	border-radius: 0rpx 32rpx 0rpx 0rpx;
	overflow: hidden;
}

.page-view {
	// padding: 16rpx;
}

.class-item {
	// margin-bottom: 30rpx;
	background-color: #fff;
	padding: 16rpx;
	// border-radius: 8rpx;
}

.item-title {
	font-size: 28rpx;
	color: #000000;
	font-weight: bold;
	margin-left: 20rpx;
}

.item-menu-name {
	font-weight: normal;
	font-size: 24rpx;
	color: #6e6e6e;
	margin-top: 10rpx;
}

.item-container {
	display: flex;
	flex-wrap: wrap;
}

.thumb-box {
	width: 33.333333%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 20rpx;
}

.item-menu-image {
	width: 130rpx;
	height: 130rpx;
}

.u-line-1 {
	font-size: 28rpx;
}

.top-area-bannner {
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx;
	height: 200rpx;
	overflow: hidden;
	image{
		width: 100%;
		height: 100%;
	}
}
</style>

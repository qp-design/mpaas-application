<template>
	<view class="commodity">
		<!-- 店铺头部 -->
		<store-header :page="1" @items="getMsgFormHeader"></store-header>
		<!-- 列表页 -->
		<view class="commodity-container">
			<view class="commodity-container-nav">
				<view class="nav-item" v-for="(item, index) in navList" :key="index" @click="titleClick(index)">
					<view class="title">
						{{ item }}
						<div v-show="index === 2">
							<div class="iconPosition">
								<i class="iconfont top"
									:style="{ color: iconColor && iconColor !== null ? baseColor : '' }">&#xe78f;</i>
								<i class="iconfont bottom"
									:style="{ color: !iconColor && iconColor !== null ? baseColor : '' }">&#xe791;</i>
							</div>
						</div>
					</view>
					<view class="line" v-if="current === index"></view>
				</view>
				<view @click="toScreen" style="display: flex; height: 55rpx;">筛选
					<i class="iconfont screen">&#xe60b;</i>
				</view>
			</view>
			<view class="commodity-container-list">
				<commidityList :recomList="items" :state="1"></commidityList>
			</view>
		</view>
		<!-- 筛选弹窗 -->
		<mPopup v-model="isShowScreen" :paddingTop="topDistance + 'px'" :scrollTopBox="scrollTopBox" mode="right"
			width="640" @scroll="scroll">
			<view class="screenPopup" @scroll="scrollPage">
				<view v-if="isShowAll">
					<!-- 分类 -->
					<view class="condition address classify" @click="getAllClass">
						<view class="title">分类</view>
						<view class="name">全部分类</view>
						<i class="iconfont">&#xe61d;</i>
					</view>

					<!-- 价格区间 -->
					<view class="condition">
						<view class="title">价格</view>
						<view class="section">
							<input type="number" v-model="params.minPrice" placeholder="最低价" />
							<view class="line"></view>
							<input type="text" v-model="params.maxPrice" placeholder="最高价" />
						</view>
					</view>

					<!-- 其他 -->
					<view class="condition">
						<view class="title">品牌</view>
						<view class="condition-item">
							<view class="item" :class="item.isChecked ? 'activeItem' : ''"
								v-for="(item, index) in brandList" :key="item.brandCode"
								@click="selectBrandList(item.brandCode)">
								{{ item.brandName }}
							</view>
							<view class="item all" @click="openAllGoods()" v-if="brand.length>8">
								查看全部
								<i class="iconfont">&#xe61d;</i>
							</view>
						</view>
					</view>

					<!-- 底部的 按钮 -->
					<view class="footer">
						<view class="reset" @click="resetScreen()">重置</view>
						<view class="confirm" @click="confirmScreen()">确认</view>
					</view>
				</view>
			</view>
		</mPopup>
		<!-- 导航栏 -->
		<nav-bar :current="1" class="nav-bar"></nav-bar>
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
	import mPopup from './u-popup.vue';
	import commidityList from '@/components/commidityList.vue';
	import {
		search,
		queryBrandPageForC,
		queryRtagPage,
	} from '@/api/interface.js';
	import http from '@/api/http.js';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	var pinyin = require('pinyin');
	export default {
		data() {
			return {
				navList: ['综合', '销量', '价格', '上新'],
				current: 0,
				// 价格排序的颜色
				iconColor: null,
				params: {
					memberCode: ''
				},
				page: 1,
				items: [],
				total: 0,
				// 筛选弹窗 start
				isShowScreen: false,
				isShowAll: true,
				topDistance: 0,
				scrollTopBox: 10,
				// 筛选弹窗 end
				show: false
			};
		},
		components: {
			navBar,
			storeHeader,
			commidityList,
			mPopup
		},
		computed: {},
		watch:{
			// #ifdef H5
			isShowScreen(newValue, oldValue) {
				if (!newValue) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			}
			// #endif
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		created() {
			this.params.memberCode = uni.getStorageSync('memberCode');
			
		},
		methods: {
			// 头部传值
			getMsgFormHeader(data) {
				this.params.goodsName = data;
				this.commonMounted();
			},
			//  获取搜索结果
			commonMounted() {
				this.lastPageLine = false;
				http.get(search, this.params).then(res => {
					if (res && res.rows) {
						this.items = res.rows;
						this.total = res.total;
					}
				});
			},
			test() {
				this.items = []
			},
			// 点击标题的时候
			titleClick(index) {
				this.current = index;

				// 获取接口数据
				this.params.page = 1;
				this.page = 1;
				switch (index) {
					case 0:
						this.params.sortField = '';
						this.commonMounted();
						break;
					case 1:
						this.params.sortField = 'goodsSalesvolume';
						this.commonMounted();
						break;
					case 2:
						if (this.iconColor === true) {
							this.iconColor = false;
							this.params.order = 'desc';
						} else {
							this.iconColor = true;
							this.params.order = 'asc';
						}
						this.params.sortField = 'pricesetNprice';
						this.commonMounted();
						break;
					default:
						break;
				}
				if (index !== 2) {
					this.iconColor = null;
				}
				if (index === 3) {
					this.screenShow = true;
				}
			},
			// 滑动到底部执行的事件
			loadMore() {
				let num = Math.ceil(this.total / 10);
				this.page++;
				let params = Object.assign(this.params, {
					page: this.page
				});
				if (params.page <= num) {
					http.get(search, params).then(res => {
						let list = res.rows;
						list.map(v => {
							if (!RegExp(/http/).test(v.dataPic)) {
								v.dataPic = this.$domain + v.dataPic;
							}
						});

						this.items = [...this.items, ...list];
					});
				} else {
					this.lastPageLine = true;
				}
			},
			// 点击筛选按钮
			toScreen() {
				this.isShowScreen = true;
				this.isShowAll = true
				console.log(this.isShowScreen, 'isShowScreen')
			},

			// 筛选弹窗 start

			// 监听滚动
			scroll(val) {
				this.scrollTop = val;
			},
			// 获取全部分类
			getAllClass() {
				// 并获取全部分类列表
				this.$routers.switchTab('classes')
			},
			// 选择品牌
			selectBrandList(brandCode) {

				this.brandList = this.brandList.map(val => {
					if (val.brandCode == brandCode) {
						val.isChecked = !val.isChecked;
					}
					return val;
				});
				// 并且将this.params.brandCode  转换一下
				this.params.brandCode = this.brandList
					.filter(val => val.isChecked)
					.map(v => v.brandCode)
					.join();
			},
			// 打开全部商品
			openAllGoods() {
				// this.isShowAll = false;
				// this.isShowAllElse = true
				http.post(queryBrandPageForC, {
					brandCode: this.brandStr
				}).then(res => {
					this.brandList = res.rows
				});
			},
			// 重置筛选条件
			resetScreen() {
				Object.assign(this.params, {
					minPrice: '',
					maxPrice: '',
					brandCode: ''
				});
				// 将this.brandList的ischecked置为空
				this.brandList.forEach(val => {
					if (val.isChecked) {
						val.isChecked = false;
					}
				});
			},
			// 确认查询
			confirmScreen() {
				this.commonMounted();
				this.isShowScreen = false;
			},
			// 筛选弹窗 end
		},
		onLoad() {
			this.commonMounted();
		},



	};
</script>

<style lang="scss" scoped>
	.commodity {
		display: flex;
		flex-direction: column;
		height: 100vh;

		&-container {
			position: relative;
			// z-index: 10;
			border-radius: 24rpx 24rpx 0px 0px;
			background-color: #f4f4f4;
			margin-top: -72rpx;

			&-nav {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 98rpx;
				background-color: #ffffff;
				padding: 0 35rpx;
				box-sizing: border-box;
				border-radius: 24rpx;

				.nav-item {
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: center;
					font-size: 26rpx;
					font-weight: 400;
					color: #1e1e1e;
					height: 40rpx;

					.title {
						display: flex;
						align-items: center;
						height: 24rpx;
						line-height: 24rpx;
						-webkit-tap-highlight-color: rgba(0, 0, 0, 0);

						.ic-list {
							font-size: 40rpx;
							font-weight: 400;
						}

						.screen {
							font-weight: 700;
						}
					}

					.line {
						position: absolute;
						width: 27rpx;
						height: 6rpx;
						background: $theme;
						border-radius: 50%;
						bottom: 0rpx;
					}

					.iconPosition {
						display: flex;
						flex-direction: column;
						justify-content: center;
						margin-top: -8rpx;

						.top {
							top: 9rpx;
						}

						.bottom {
							top: -4rpx;
						}
					}

					.iconfont {
						font-size: 16rpx;
						margin-left: 10rpx;
						position: relative;
						top: 1px;
						left: -3px;
					}
				}
			}

			&-list {
				height: 1000rpx;
				overflow-y: scroll;
			}
		}

		.nav-bar {
			flex-shrink: 0;
		}





	}

	// 筛选弹窗 start
	// 筛选弹框
	.screenPopup {
		padding-top: 25%;
		z-index: 10;
		width: 100%;
		// height: 100%;
		background-color: #f4f4f4;

		.condition {
			padding: 24rpx 0 0 24rpx;
			background-color: #ffffff;
			margin-bottom: 24rpx;
			border-radius: 24rpx;
			box-sizing: border-box;
			padding-bottom: 24rpx;

			.section {
				display: flex;
				align-items: center;
				justify-content: space-between;

				// margin-bottom: 24rpx;
				input {
					width: 276rpx;
					height: 56rpx;
					background: #f7f7f7;
					border-radius: 28rpx;
					text-align: center;
				}

				.line {
					width: 16rpx;
					height: 2rpx;
					background: #999999;
				}
			}

			.title {
				font-size: 24rpx;
				font-weight: 700;
				color: #000000;
				margin-bottom: 24rpx;
			}

			&-item {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				width: 100%;

				.item {
					width: 181rpx;
					height: 56rpx;
					background: #f7f7f7;
					border-radius: 28rpx;
					font-size: 23rpx;
					color: #333333;
					text-align: center;
					line-height: 52rpx;
					// margin-bottom: 24rpx;
					margin-right: 24rpx;
					margin-bottom: 24rpx;
					box-sizing: border-box;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					padding: 0 16rpx;
					border: 2rpx solid #f7f7f7;
				}

				.all {
					border: 2rpx solid #999999;

					i {
						display: inline;
						font-size: 14rpx;
						margin-left: 7rpx;
						font-weight: 700;
						position: relative;
						top: -2rpx;
					}
				}

				.activeItem {
					background: rgba(255, 0, 18, 0.05);
					border: 2rpx solid #ff0012;
					color: $theme;
				}
			}
		}

		.address {
			display: flex;
			align-items: center;

			justify-content: space-between;
			padding: 24rpx;

			.title {
				margin-bottom: 0;
			}

			.name {
				margin: 0 28rpx 0 auto;
				font-size: 20rpx;
				font-weight: 400;
				color: $theme;
			}

			i {
				font-size: 18rpx;
			}
		}

		.classify {
			margin-top: 10rpx;

			.name {
				color: #999999;
			}
		}

		.footer {
			display: flex;
			justify-content: center;
			align-items: center;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 98rpx;
			background: #ffffff;
			box-shadow: 0rpx -4rpx 16rpx 2rpx rgba(0, 0, 0, 0.05);

			.reset {
				width: 284rpx;
				height: 80rpx;
				border-radius: 40rpx;
				border: 2rpx solid #333333;
				text-align: center;
				line-height: 80rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #333333;
				letter-spacing: 1rpx;
			}

			.confirm {
				width: 284rpx;
				height: 80rpx;
				background: $theme;
				border-radius: 40rpx;
				text-align: center;
				line-height: 80rpx;
				margin-left: 24rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #ffffff;
				letter-spacing: 1rpx;
			}

			.indexNav {
				height: 100%;
			}

			// .outside {
			// 	position: relative;
			// 	.footerSearch {
			// 		position: absolute;
			// 	}
			// }
		}
	}

	// 筛选弹窗 end
</style>

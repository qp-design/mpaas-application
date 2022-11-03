<template>
	<div class="goods-list">
		<!-- 头部 -->

		<navBar inputPlaceholder="输入商品名称搜索商品" @getNavBarHeight="getNavBarHeight"></navBar>
		<view class="header" v-show="params.bizType">

			<view class="header-other" v-bind:style="{ top: topDistance + 'px' }">
				<div class="nav">
					<ul class="nav-left">
						<li v-for="(titles, titIndex) in titleList" :key="titIndex" @click="titleClick(titIndex)">
							<view class="ttitle" :style="{ fontWeight: current === titIndex ? '500' : '' }">
								{{ titles }}
								<div v-show="titIndex === 2">
									<div class="iconPosition">
										<i class="iconfont top" :style="{ color: iconColor && iconColor !== null ? baseColor : '' }">&#xe78f;</i>
										<i class="iconfont bottom" :style="{ color: !iconColor && iconColor !== null ? baseColor : '' }">&#xe791;</i>
									</div>
								</div>
								<i class="iconfont screen" v-show="titIndex === 3" :style="{ color: current === titIndex ? baseColor : '' }">&#xe60b;</i>
							</view>
							<view class="line" v-if="current === titIndex"></view>
						</li>
						<li>
							<view class="ttitle" @click="toScreen">
								筛选
								<i class="iconfont">&#xe60b;</i>
							</view>
						</li>
					</ul>
				</div>
			</view>
		</view>
		<!-- 筛选弹窗 -->
		<mPopup v-model="isShowScreen" :paddingTop="topDistance + 'px'" :scrollTopBox="scrollTopBox" mode="right" width="640"
		 @scroll="scroll">
			<view class="screenPopup" @scroll="scrollPage">
				<view v-if="isShowAll">
					<!-- 配送地址 -->
					<!-- <view class="condition address">
						<view class="title">配送至</view>
						<view class="name">上海徐汇区城区H88越虹广场B座8楼千匠网络</view>
						<i class="iconfont">&#xe62d;</i>
					</view> -->
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
							<view class="item" :class="item.isChecked ? 'activeItem' : ''" v-for="(item, index) in brandList" :key="item.brandCode"
							 @click="selectBrandList(item.brandCode)">
								{{ item.brandName }}
							</view>
							<view class="item all" @click="openAllGoods" v-if="brand.length>8">
								查看全部
								<i class="iconfont">&#xe61d;</i>
							</view>
						</view>
					</view>

					<!-- 底部的 按钮 -->
					<view class="footer">
						<view class="reset" @click="resetScreen">重置</view>
						<view class="confirm" @click="confirmScreen">确认</view>
					</view>
				</view>
				<!-- 另一个弹框 -->
				<!-- <scroll-view v-if="isShowAllElse" class="outside">
					<view class="condition">
						<view class="title">品牌</view>
						<view class="condition-item">
							<view class="item" :class="item.isChecked ? 'activeItem' : ''" v-for="(item, index) in brand" :key="item.brandCode"
							 @click="selectBrand(item.brandCode)">
								{{ item.brandName }}
							</view>
						</view>
					</view>
					<view class="footer footerSearch">
						<view class="cancel reset" @click="cancelSelect">取消</view>
						<view class="confirm" @click="confirmScreen">确定</view>
					</view>
				</scroll-view> -->
			</view>
		</mPopup>
		<!-- 列表 -->
		<div :class="['list',params.bizType ? 'active' : '']">
			<!-- <div class="shide">shide</div> -->
			<!-- 			<ul v-if="isShowCom">
				<li v-for="(item, index) in items" :key="index">
					<image :src="item.dataPic || userImgurl" mode="aspectFill" @click="goodsDetail(item.skuCode)"></image>
					<div class="list-box">
						<h3 class="title">{{ item.goodsName }}</h3>
						<p class="price">
							<text>¥</text>
							{{ Math.floor(item.pricesetNprice) }}.
							<text>{{ item.pricesetNprice | decimalPoint }}</text>
						</p>
						<div class="jd">京东自营</div>
					</div>
				</li>
				<u-loadmore :status="lastPageLine" style="margin: 0 auto;" />
			</ul> -->

			<commidityList :recomList="items" :status="lastPageLine" :state="1" v-if="isShowCom"></commidityList>

		</div>
		<view class="result" v-if="items.length == 0&& NoResult">
			<view class="box">
				<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/JD/ZQ/search.png" mode="" style="width: 100%; height: 300rpx;"></image>
				<view class="text">
					暂无商品
				</view>
			</view>
		</view>
		<!-- 列表2 -->
	</div>
</template>
<script>
	import http from '@/api/http.js';
	import {
		search,
		queryBrandPageForC,
		queryRtagPage
	} from '@/api/interface.js';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import commidityList from '@/components/commidityList.vue';
	import navBar from '@/components/navBar.vue';
	import mPopup from './u-popup.vue';
	import mIndexList from './u-index-list.vue';
	var pinyin = require('pinyin');
	export default {
		data() {
			return {
				titleList: ['综合推荐', '销量', '价格'],
				current: 0,
				// 查詢列表传参
				params: {
					brandCode: '',
					minPrice: '',
					maxPrice: '',
					rtagCode: ''
				},
				rows: 10,
				topDistance: '',
				page: 1,
				// 价格排序的颜色
				iconColor: null,
				// 列表数据
				items: [],
				// 数据的总条数
				total: 0,
				// 头部的样式
				styleBtn: {},
				// 动态组件
				isShowCom: false,
				// 是否还有
				lastPageLine: 'loadmore',
				// 是否展示筛选
				isShowScreen: false,
				// 品牌列表
				brandList: [],
				brand: [],
				// 选择的品牌
				currentBrand: 0,
				// 标签列表
				tagList: [],
				indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
					'V', 'W', 'X', 'Y', 'Z'
				],
				scrollTop: 0,
				scrollTopBox: 10,
				// 所有品牌
				allBrand: {},
				// 是否展示全部商品
				isShowAll: true,
				isShowAllElse: false,
				NoResult: false,
				//品牌列表
				brandArr:[],
				brandStr:''
			};
		},
		components: {
			commidityList,
			mPopup,
			mIndexList,
			navBar
		},
		// #ifdef H5
		onBackPress(options) {
			window.history.back()
			return true
		},
		// #endif
		// 页面加载  初始化数据
		onLoad(options) {
			setTimeout(()=>{
				if ($storage.get("goodsList")) {
					this.items = $storage.get("goodsList")
					$storage.remove("goodsList")
					this.isShowCom = true
					if (this.items.length == 0) {
						this.NoResult = true
						this.isShowCom = false
					}
				} else {
					this.params = options;
					this.params.bizType = "goods"  
					this.params.hjFlag = true
					// this.params.goodsType = '00'
					// this.params.jDFlag = true
					this.params.area = $storage.get("addressValue") ? $storage.get("addressValue") : "北京朝阳区八里庄街道"
					this.commonMounted();
				}		
			},800)
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		// 滑动到底部的时候
		onReachBottom() {
			// 到这底部在这里需要做什么事情
			this.loadMore();
		},
		filters: {
			// 过滤价格的小数点后两位
			decimalPoint(v) {
				let num = String(v).split('.');
				if (num.length > 1) {
					return num[1];
				} else {
					return '00';
				}
			}
		},
		methods: {
			getNavBarHeight(h) {
				this.topDistance = h;
			},
			toSearch(value) {
				if (!value) {

					return;
				}
				let query = {
					goodsName: value
				};

			},
			// 取消选择
			cancelSelect() {

				this.isShowAll = false
				this.isShowAllElse = false;
				this.isShowScreen = false
			},
			// 确定选择
			confirmSelect() {},
			// 获取全部分类
			getAllClass() {
				// 并获取全部分类列表
				uni.switchTab({
					url:'/pages/classes/main'
				})
			},
			getSelect(index) {
				this.scrollTopBox = index + this.scrollTop;
			},
			// 监听滚动
			scroll(val) {
				this.scrollTop = val;
			},
			// 打开全部商品
			openAllGoods() {
				// this.isShowAll = false;
				// this.isShowAllElse = true
				http.post(queryBrandPageForC, {
					brandCode:this.brandStr
				}).then(res => {
					this.brandList = res.rows
				});
			},
			// 标签的选择
			// selectTag(item) {
			// 	if (this.params.rtagCode == item.rtagCode) {
			// 		rthis.params.rtagCode = '';
			// 	}
			// 	this.params.rtagCode = item.rtagCode;
			// 	this.commonMounted();
			// },
			// 跳转商品详情
			goodsDetail(skuCode) {
				this.$routers.push('detail', {skuNo: skuCode})
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
				this.isShowAllElse = false;
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
			selectBrand(brandCode) {
				this.brand = this.brand.map(val => {
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
			// 获取筛选品牌列表
			getScreenList() {
				// 调用接口
				http.post(queryBrandPageForC, {
					// page: this.page,
					// rows: this.rows,
					brandCode:this.brandStr
				}).then(res => {
					if (res && res.rows) {
						res.rows.forEach(val => {
							val.isChecked = false;
						});
						this.brand = res.rows;
						if (this.brand.length > 8) {
							this.brandList = this.brand.slice(0, 8)
						}else{
							this.brandList = this.brand
						}
						let character = res.rows.map(val => {
							return {
								oldName: val.brandName,
								cName: pinyin(val.brandName, {
										style: pinyin.STYLE_NORMAL
									})
									.join('')
									.toLocaleUpperCase(),
								isChecked: false,
								brandCode: val.brandCode
							};
						});
						character.forEach(val => {
							if (this.allBrand[val.cName[0]]) {
								this.allBrand[val.cName[0]].push(val);
							} else {
								this.allBrand[val.cName[0]] = [val];
							}
						});
					}
				});
			},
			// 筛选
			toScreen() {
				this.isShowScreen = true;
				this.isShowAll = true
			},
			//  获取搜索结果
			commonMounted() {
				
				this.params.page = this.page
				this.params.rows = 20
				this.params.searchType="match_phrase" 
				
				this.lastPageLine = 'loading';
				http.get(search, this.params).then(res => {
					if (res && res.rows && res.rows.length > 0) {
						
						this.items = res.rows.filter(itemk=> itemk.goodsType != '24'&&itemk.goodsType != '26'   );
						
						this.brandArr = Array.from(
							new Set(this.items.map(k =>{
								return k.brandCode
							}))
						)
						this.brandStr = this.brandArr.toString()
						
						this.getScreenList();
						
						
						
						this.isShowCom = true
						this.items.map(v => {
							if (!RegExp(/http/).test(v.dataPic)) {
								v.dataPic = this.$domain + v.dataPic;
							}
						});
						this.total = res.total;
						if (this.items.length == this.total) {
							this.lastPageLine = 'nomore';
						} else {
							this.lastPageLine = 'loadmore';
						}
					} else {
						this.NoResult = true
					}
				});
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
				this.lastPageLine = 'loading';
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
						this.lastPageLine = 'loadmore';
					});
				} else {
					this.lastPageLine = 'nomore';
				}
			}
		}
	};
</script>

<style lang="scss" scoped>
	.result {
		display: flex;
		justify-content: center;
		margin-top: 50%;

		.box {
			width: 370rpx;
			height: 276rpx;

			.text {
				text-align: center;

				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;
				line-height: 34rpx;
			}
		}
	}

	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}

	// 筛选弹框
	.screenPopup {
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

	.shide {
		width: 100%;
		height: 1000rpx;
		background-color: yellow;
	}

	// 隐藏滚动条
	::-webkit-scrollbar {
		width: 0;
		height: 0;
		color: transparent;
	}

	.goods-list {
		// background-color: #f7f7f7;
		min-height: 100%;

		.header {
			position: absolute;
			top: 0;
			width: 100%;
			background-color: #ffffff;
			border-bottom: 1px solid rgba(157, 157, 157, 0.1);

			&-box {
				position: fixed;
				top: 0;
				z-index: 99999;
				width: 100%;
				background-color: #ffffff;
			}

			&-top {
				display: flex;
				justify-content: space-between;
				box-sizing: border-box;
				align-items: center;
				padding-bottom: 12rpx;
			}

			&-other {
				position: fixed;
				width: 100%;

				z-index: 100;
			}

			i {
				font-weight: 700;
				margin-left: 17rpx;
			}

			&-search {
				display: flex;
				width: 100%;
				height: 64rpx;
				background: #f6f6f6;
				border-radius: 32rpx;
				align-items: center;
				margin: 0 12rpx 0 18rpx;

				i {
					font-size: 28rpx;
					color: #939393;
					margin-left: 20rpx;
				}

				text {
					font-size: 24rpx;
					font-weight: 400;
					color: #939393;
					line-height: 36rpx;
					margin-left: 12rpx;
				}
			}

			.screen-mold {
				position: relative;
				width: 100%;
				height: 80rpx;
				padding: 15rpx 30rpx 0;
				box-sizing: border-box;
				margin-bottom: 20rpx;
				background-color: #ffffff;

				.labels {
					overflow: scroll;
					white-space: nowrap;
					width: 100%;
					height: 56rpx;
					padding-right: 140rpx;
					box-sizing: border-box;

					&-tip {
						display: inline-block;
						width: 156rpx;
						height: 56rpx;
						background: #f7f7f7;
						border-radius: 28rpx;
						font-size: 24rpx;
						font-weight: 400;
						color: #1e1e1e;
						line-height: 56rpx;
						text-align: center;
						margin-right: 32rpx;
					}

					&-tip-active {
						border: 1px solid $theme;
						color: $theme;
						box-sizing: border-box;
					}
				}

				.screen {
					position: absolute;
					top: 0;
					right: 0;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 140rpx;
					height: 80rpx;
					background: #ffffff;
					text-align: center;
					line-height: 80rpx;

					.iconfont {
						font-weight: 700;
						font-size: 22rpx;
						top: 2rpx;
						left: -7rpx;
						position: relative;
					}
				}
			}
		}

		.nav {
			padding: 36rpx 60rpx 18rpx;
			box-sizing: border-box;
			background-color: #ffffff;

			&-left {
				display: flex;
				align-items: center;
				justify-content: space-between;

				li {
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: center;
					font-size: 26rpx;
					font-family: PingFang SC;
					font-weight: 400;
					color: #1e1e1e;
					height: 40rpx;

					.ttitle {
						display: flex;
						align-items: center;
						height: 24rpx;
						line-height: 24rpx;
						-webkit-tap-highlight-color: rgba(0, 0, 0, 0);

						.ic-list {
							font-size: 40rpx;
							font-weight: 400;
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
		}

		// 列表
		.active {
			margin-top: 94rpx;
		}

		.list {
			background-color: #ffffff;

			ul {
				li {
					display: flex;
					margin: 0 24rpx;
					padding: 24rpx 0;
					box-sizing: border-box;
					border-top: 2rpx solid #f1f1f1;

					image {
						width: 221rpx;
						height: 221rpx;
						// background: red;
						border-radius: 10rpx;
						margin-right: 24rpx;
						flex-shrink: 0;
					}
				}
			}

			&-box {
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				h3 {
					font-size: 28rpx;
					font-weight: 400;
					color: #1e1e1e;
					line-height: 42rpx;
					margin-top: 24rpx;
				}

				.price {
					font-size: 36rpx;
					font-family: Helvetica;
					color: #1e1e1e;
					line-height: 28rpx;

					text {
						font-size: 28rpx;
					}
				}

				.jd {
					width: 88rpx;
					height: 24rpx;
					background: $theme;
					border-radius: 8rpx;
					font-size: 18rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #ffffff;
					line-height: 24rpx;
					text-align: center;
				}
			}
		}

		.com-data-line {
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			width: 100%;
			color: #999;
			font-size: 24rpx;
			background: #fff;
		}
	}
</style>

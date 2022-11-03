<template>
	<div class="collectionGoods">
		
		<div class="collectionGoods-menu">
			<ul>
				<li v-for="(tit, titIndex) in titles" :key="titIndex" @click="storeListTitle(titIndex)">
					<a :class="current == titIndex ? 'active' : ''" :style="{ color: current == index ? baseColor : '' }">
						{{ tit }}
						<span :style="{ background: baseColor }"></span>
					</a>
				</li>
			</ul>
			<view class="collectionGoods-edit" v-if="items.length > 0">
				<div class="collectionGoods-edit" @click="edited" v-if="delStatus">编辑</div>
				<div class="collectionGoods-edit" @click="finished" v-else>完成</div>
			</view>
		</div>
		<div class="collectionGoods-con" v-if="items.length > 0">
			<u-swipe-action
				class="list"
				v-for="(item, index) in items"
				:key="index"
				:options="swipeActionOptions"
				:index="index"
				:show="item.swipeActionShow"
				@click="swipeActionClick"
				@open="swipeActionOpen"
				btn-width="150"
			>
				<div class="item">
					<div class="tit" @click="titCheckBox(item, index)" :style="{ marginRight: isChecked ? '25rpx;' : '0px' }">
						<i class="iconfont" v-show="isChecked" :style="{ color: baseColor }">{{ item.checked === 0 ? '&#xe672;' : '&#xe671;' }}</i>
					</div>
					<div class="userImg">
						<img :src="item.collectOppic || userImgurl" @click="toGoodsDetail(item)" />
						<span v-if="item.dataState === 2">已下架</span>
						<span v-if="item.dataState === 3">已失效</span>
						<span v-if="item.dataState === 1">库存不足</span>
					</div>
					<div v-if="collectType === 0">
						<p :style="{ color: item.dataState !== 0 ? '#ccc' : '' }">{{ item.collectOpcont }}</p>
						<h3 :style="{ color: item.dataState !== 0 ? '#ccc' : baseColor }"><view v-html="money(item.collectOpnum)" :style="{color: baseColor}"></view></h3>
					</div>
					<div v-else>
						<p :style="{ color: item.dataState !== 0 ? '#ccc' : '', marginBottom: 0 }">{{ item.collectOpcont }}</p>
					</div>
				</div>
				<!-- <div class="goodsDel" @click="goodsDel(item)" :style="{ background: baseColor }">取消收藏</div> -->
			</u-swipe-action>
		</div>
		<div class="collectionGoods-nulls" v-else><img :src="collectType === 0 ? nullImg : nullShopImg" /></div>
		<div v-show="!delStatus">
			<div class="collectionGoods-count">
				<div @click="countCheckBox">
					<i class="iconfont" :style="{ color: allChecked ? baseColor : '#c3c3c3' }">{{ allChecked ? '&#xe671;' : '&#xe672;' }}</i>
					全选
				</div>
				<div><div class="del-btn" :style="{ background: baseColor }" @click="delCartShopping">删除</div></div>
			</div>
		</div>
		<lastPageLine :lastPageLine="lastPageLine" />
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { collection } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import vueTabBar from '@/components/communal/vueTabBar';
import lastPageLine from '@/components/communal/last-page-line';
export default {
	data() {
		return {
			delStatus: true,
			isChecked: false,
			tChecked: true,
			allChecked: false,
			touchIndex: -1, //初始状态的index
			clientX1: '', //滑动开始位置
			clientX2: '',
			del: 0, //内容初始的right距离
			btnWidth: 160, //删除按钮宽度
			comLeft: 0,

			current: 0,
			titles: ['商品','店铺'], //, '店铺'
			total: 0,
			page: 1,
			rows: 10,
			items: [],
			lastPageLine: false,
			collectType: 0,
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noCollection.png',
			nullShopImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noShop.png',
			swipeActionOptions: [
				{
					text: '取消收藏',
					style: {
						backgroundColor: '#f53415'
					}
				}
			]
		};
	},
	components: {
		lastPageLine
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || uni.getStorageSync('unitPrice');
		},
	},
	mounted() {
	},
	onLoad(options) {
		if (options.json) {
			uni.setStorageSync('goodsListAfterRouter', 'home')
		}
	},
	onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
		this.commonMounted(this.collectType);
	},

	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadMore();
	},
	methods: {
		commonMounted(index) {
			// collectType: 0 商品 1 店铺
			http.post(collection.queryCollectPage, {
				page: this.page,
				rows: this.rows,
				collectType: this.collectType
			}).then(res => {
				if (res.rows) {
					let list = JSON.parse(JSON.stringify(res.rows));
					list.map(v => {
						if (!RegExp(/http/).test(v.collectOppic)) {
							v.collectOppic = this.$domain + v.collectOppic;
						}
						v.checked = 0;
						v.swipeActionShow = false;
					});
					this.items = list;
					this.total = res.total;
					if (this.items.length === 0) {
						this.lastPageLine = false;
					}
				}
			});
		},
		storeListTitle(titIndex) {
			this.current = titIndex;
			this.collectType = titIndex;
			this.page = 1;
			this.lastPageLine = false;
			this.commonMounted(this.collectType);
		},
		replaceBack() {
			// if ($storage.get('goodsListAfterRouter')) {
			// 	$routers.replace('web', {
			// 		defaultUrl: this.$businessDomain + '/paas/shop/' + this.$state.homeUrl
			// 	});
				
			// 	$storage.set('goodsListAfterRouter', '');
			// } else {
			// 	$routers.replace('mine');
			// 	// $routers.replace('o2o_mine');
			// }
			this.$routers.back()
		},

		swipeActionOpen(index) {
			this.items[index].swipeActionShow = true;
			this.items.map((val, idx) => {
				if (index != idx) this.items[idx].swipeActionShow = false;
			});
		},

		swipeActionClick(propsIndex, optsIndex) {
			let item = this.items[propsIndex];
			http.post(collection.deleteCollectByCode, {
				collectCode: item.collectCode,
				collectType: item.collectType
			}).then(res => {
				if (res && res.success) {
					this.$message.alert('取消收藏成功')
					this.commonMounted(this.collectType);
				}
			});
		},
		edited() {
			this.delStatus = false;
			this.isChecked = true;
			this.items.map(v => {
				v.checked = 0;
			});
		},
		finished() {
			this.delStatus = true;
			this.isChecked = false;
		},
		titCheckBox(item, index) {
			if (item.checked == 0) {
				this.items[index].checked = 1;
			} else {
				this.items[index].checked = 0;
			}
			if (this.items.filter(v => v.checked === 1).length === this.items.length) {
				this.allChecked = true;
			} else {
				this.allChecked = false;
			}

			if (this.tChecked == true) {
				this.tChecked = false;
			} else {
				this.tChecked = true;
			}
		},
		countCheckBox() {
			if (this.allChecked) {
				this.items.map(v => {
					v.checked = 0;
				});
				this.allChecked = false;
			} else {
				this.items.map(v => {
					v.checked = 1;
				});
				this.allChecked = true;
			}
		},
		goodsDel(item) {
			http.post(collection.deleteCollectByCode, {
				collectCode: item.collectCode,
				collectType: item.collectType
			}).then(res => {
				if (res && res.success) {
					this.$message.alert('取消收藏成功')
					this.commonMounted(this.collectType);
				}
			});
		},
		delCartShopping() {
			let str = this.items.filter(v => v.checked === 1);
			let collectStr = [];
			str.map(val => {
				collectStr.push(val.collectCode);
			});
			if (collectStr.length == 0) {
				this.$message.alert('请至少选择一个')
			}
			http.post(collection.deleteCollectByCodeStr, {
				collectCodeStr: collectStr.join(',')
			}).then(res => {
				if (res.success) {
					this.delStatus = true;
					this.isChecked = false;
					this.commonMounted(this.collectType);
				}
			});
		},
		toGoodsDetail(item) {
			this.$routers.push('detail', {skuNo: item.collectOpcode})
			// if (this.current == 1) {
			// 	// $storage.set('skuMemberCode', {
			// 	// 	memberCode: item.collectOpcode
			// 	// });
			// 	// $routers.push('shop_modules/index', {
			// 	// 	memberCode: item.collectOpcode
			// 	// });
			// } else {
			// 	$routers.push('web', {
			// 		defaultUrl: this.$businessDomain + '/paas/shop/' + $storage.get('hrefs') + item.collectOpcode + '.html',
			// 		path: 'collectionshop'
			// 		// menuJspath: v.menuJspath
			// 	});

			// 	// this.$state.nav.map(v => {
			// 	// 	if (v.menuAction == 'collectionShop') {
			// 	// 		$routers.push('web', {
			// 	// 			defaultUrl: this.$businessDomain + '/paas/shop/' + $storage.get('hrefs') + item.collectOpcode + '.html',
			// 	// 			path: 'collectionshop',
			// 	// 			menuJspath: v.menuJspath
			// 	// 		});
			// 	// 	}
			// 	// });
			// }
		},
		loadMore() {
			let num = Math.ceil(this.total / 10);
			this.page++;
			if (this.page <= num) {
				http.post(collection.queryCollectPage, {
					page: this.page,
					rows: this.rows,
					collectType: this.collectType
				}).then(res => {
					let list = res.rows;
					list.map(v => {
						if (!RegExp(/http/).test(v.collectOppic)) {
							v.collectOppic = this.$domain + v.collectOppic;
						}
					});

					this.items = [...this.items, ...list];
				});
			} else {
				this.lastPageLine = true;
			}
		},
		// 金额过滤
		money(val) {
			console.log(val)
			var val = val+"";
			if (val.indexOf('.') == -1) {
				return "<b style='font-size:1.1em'>￥" + val + "<b style='font-size:0.8em'>.00</b></b>";
			} else if (val.substr(val.indexOf('.')).length == 2) {
				return "<b style='font-size:1.1em'>￥" + val.substr(0, val.indexOf('.')) + "<b style='font-size:0.8em'>" + val.substr(val.indexOf('.')) + '0</b></b>';
			} else {
				return "<b style='font-size:1.1em'>￥" + val.substr(0, val.indexOf('.')) + "<b style='font-size:0.8em'>" + val.substr(val.indexOf('.')) + '</b></b>';
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '../../../common/css/common.less';
.collectionGoods {
	width: 100%;
	height: 100%;
	&-edit {
		position: fixed;
		z-index: 9999;
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
		right: 30rpx;
		top: 0;
		font-size: @big-title;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		background: #fff;
	}
	&-left {
		position: fixed;
		z-index: 9999;
		height: 90rpx;
		width: 70rpx;
		line-height: 90rpx;
		text-align: left;
		left: 30rpx;
		top: 0;
	}
	&-con {
		height: 100%;
		padding: 130rpx 30rpx 0;
		.list {
			padding: 30rpx 0;
			.item {
				padding: 30rpx 0;
				width: 690rpx;
				border-bottom: 1rpx solid #f6f6f8;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				background: @white-color;
				.tit {
					margin-right: 25rpx;
					i {
						padding-right: 15rpx;
					}
				}
				.userImg {
					position: relative;
					width: 185rpx;
					height: 185rpx;
					margin-right: 30rpx;
					img {
						width: 185rpx;
						height: 185rpx;
					}
					span {
						width: 185rpx;
						height: 44rpx;
						background: #b3b3b3;
						color: @white-color;
						font-size: 22rpx;
						text-align: center;
						line-height: 44rpx;
						position: absolute;
						bottom: 0;
						left: 0;
					}
				}
				p {
					font-size: @big-title;
					color: @color-333;
					margin-bottom: 96rpx;
				}
				h3 {
					font-size: @middle-title;
				}
			}
		}
	}
	&-count {
		display: flex;
		width: calc(100% - 30rpx);
		width: 100%;
		position: fixed;
		z-index: 9999;
		padding-left: 15rpx;
		bottom: 0;
		left: 0;
		align-items: center;
		justify-content: space-between;
		height: 96rpx;
		font-size: @middle-title;
		color: @color-666;
		background: #fff;
		border-top: 1rpx solid #eee;
		div:first-child {
			display: flex;
			align-items: center;
		}
		div:last-child {
			display: flex;
			align-items: center;
		}
		i {
			padding: 0 15rpx;
			//margin-right: 15rpx;
		}
		.del-btn {
			width: 246rpx;
			height: 96rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			color: @white-color;
			font-size: 32rpx;
			background: #b79f77;
		}
	}
	&-edit{
		width: 90rpx;
		color: red;
	}
	&-menu {
		display: flex;
		padding: 0 30rpx;
		border-bottom: 20rpx solid #fafafa;
		position: fixed;
		top: 0rpx;
		left: 0;
		width: 100%;
		z-index: 999;
		background: #fff;
		ul {
			flex: 1;
			display: flex;
			justify-content: space-around;
			padding-right: 30rpx;
			li {
				height: 96rpx;
				a {
					width: 100%;
					height: 100%;
					line-height: 96rpx;
					display: inline-block;
					position: relative;
					font-size: 28rpx;
					color: @color-333;
					text-align: center;
				}
				.active {
					// color: #bfa676;
					span {
						position: absolute;
						height: 5rpx;
						width: 100%;
						// background: #bfa676;
						bottom: 0;
						left: 0;
					}
				}
			}
		}
	}
	&-nulls {
		height: calc(100% - 202rpx);
		text-align: center;
		img {
			width: 403rpx;
			height: 299rpx;
			margin: 280rpx auto 0;
		}
	}
}
</style>

<style lang="scss">
  v-deep .u-swipe-del{
  	background-color: $theme;
  }
</style>

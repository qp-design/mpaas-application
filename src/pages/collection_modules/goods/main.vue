<template>
	<div class="collectionGoods">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<template v-if="items.length > 0">
			<div class="collectionGoods-edit" @click="edited" v-if="delStatus">编辑</div>
			<div class="collectionGoods-edit" @click="finished" v-else>完成</div>
		</template>

		<div class="collectionGoods-con" v-if="items.length > 0">
			<uni-swipe-action>
				<uni-swipe-action-item :options="swipeActionOptions" v-for="(item, index) in items" :key="index" @click="goodsDel(item)">
					<!-- <a :style="{ left: touchIndex == index ? comLeft + 'rpx' : '0rpx' }" @touchstart="touchS" @touchmove="touchM"> -->
					<div class="cont">
						<div class="tit" @click="titCheckBox(item, index)" :style="{ marginRight: isChecked ? '25rpx;' : '0px' }">
							<i class="iconfont" v-show="isChecked" :style="{ color: baseColor }">{{ item.checked === 0 ? '&#xe672;' : '&#xe671;' }}</i>
						</div>
						<div class="userImg">
							<img :src="item.collectOppic || userImgurl" @click="toGoodsDetail(item)" />
							<span v-show="item.dataState === 2">已下架</span>
							<span v-show="item.dataState === 3">已失效</span>
							<span v-show="item.dataState === 1">库存不足</span>
						</div>
						<div>
							<p :style="{ color: item.dataState !== 0 ? '#ccc' : '' }">{{ item.collectOpcont }}</p>
							<h3 :style="{ color: item.dataState !== 0 ? '#ccc' : 'baseColor' }">{{ unitPrice.obpay }}{{ item.collectOpnum }}{{ unitPrice.mapay }}</h3>
						</div>
					</div>
				</uni-swipe-action-item>
				<!-- <div class="goodsDel" @click="goodsDel(item)" :style="{ background: baseColor }">取消收藏</div> -->
			</uni-swipe-action>
		</div>
		<div class="collectionGoods-nulls" v-else><img :src="nullImg" /></div>
		<lastPageLine :lastPageLine="lastPageLine" />
		<div v-show="!delStatus">
			<div class="collectionGoods-count">
				<div @click="countCheckBox">
					<i class="iconfont" :style="{ color: baseColor }">{{ allChecked ? '&#xe671;' : '&#xe672;' }}</i>
					全选
				</div>
				<div><span :style="{ background: baseColor }" @click="delCartShopping">删除</span></div>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { collection } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import vueTabBar from '@/components/communal/vueTabBar';
import lastPageLine from '@/components/communal/last-page-line';
import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue';
import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue';
export default {
	data() {
		return {
			title: '我的收藏',
			leftIcon: true,
			rightIcon: false,
			baseColor: '',
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

			total: 0,
			page: 1,
			rows: 10,
			items: [],
			lastPageLine: false,
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noCollection.png',
			swipeActionOptions: [
				{
					text: '删除',
					style: {
						backgroundColor: `#${this.$state.baseColor}`
					}
				}
			]
		};
	},
	components: {
		commonHeader,
		lastPageLine,
		uniSwipeAction,
		uniSwipeActionItem
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || $storage.get('unitPrice');
		}
	},
	onLoad(options) {
		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
		Object.assign(this, this.$options.data());
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted() {
		this.baseColor = '#' + this.$state.baseColor;
		this.commonMounted();
	},
	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadMore();
	},
	methods: {
		commonMounted() {
			http.post(collection.queryCollectPage, {
				page: 1,
				rows: 10,
				collectType: '0'
			}).then(res => {
				let list = JSON.parse(JSON.stringify(res.rows));

				list.map(v => {
					if (!RegExp(/http/).test(v.collectOppic)) {
						v.collectOppic = this.$domain + v.collectOppic;
					}
					v.checked = 0;
				});
				this.items = list;
				if (this.items.length === 0) {
					this.lastPageLine = false;
				}
			});
		},
		finished() {
			this.delStatus = true;
			this.isChecked = false;
		},
		edited() {
			this.delStatus = false;
			this.isChecked = true;
			this.items.map(v => {
				v.checked = 0;
			});
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
			console.log(item)
			http.post(collection.deleteCollectByCode, {
				collectCode: item.collectCode,
				collectType: item.collectType
			}).then(res => {
				if (res && res.success) {
					$message.alert('取消收藏成功！');
					this.commonMounted();
					this.touchIndex = -1;
				}
			});
		},
		delCartShopping() {
			let str = this.items.filter(v => v.checked === 1);
			console.log(str);
			if (str.length == 0) {
				$message.alert('请勾选您要删除的商品');
				return;
			}
			let collectStr = [];
			str.map(val => {
				collectStr.push(val.collectCode);
			});
			//console.log(collectStr);
			http.post(collection.deleteCollectByCodeStr, {
				collectCodeStr: collectStr.join(',')
			}).then(res => {
				if (res.success) {
					this.delStatus = true;
					this.isChecked = false;
					this.commonMounted();
				}
			});
		},
		toGoodsDetail(item) {
			this.$state.moreToolList.map(v => {
				if (v.menuAction == 'collectionGoods') {
					$routers.replace('web', {
						defaultUrl: this.$businessDomain + '/paas/shop/' + $storage.get('hrefs') + item.collectOpcode + '.html',
						path: 'collectionGoods',
						menuJspath: v.menuJspath
					});
				}
			});
		},
		loadMore() {
			let num = Math.ceil(this.total / 10);
			this.page++;
			if (this.page <= num) {
				http.post(collection.queryCollectPage, {
					page: this.page,
					rows: this.rows
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
		
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';



.collectionGoods {
	width: 100%;
	&-edit {
		position: fixed;
		z-index: 9999;
		height: 90rpx;
		width: 70rpx;
		line-height: 90rpx;
		text-align: right;
		right: 30rpx;
		top: 0;
		font-size: @big-title;
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
		padding: 90rpx 0 0;
		.cont {
			padding: 30rpx 0;
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			background: @white-color;
			.tit {
				margin-left: 25rpx;
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
				color: #d66377;
			}
		}
		.toslide {
			left: -160rpx;
		}
	}
	&-count {
		display: flex;
		// width: calc(100% - 30rpx);
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
		}
		span {
			display: inline-block;
			width: 246rpx;
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
			color: @white-color;
			font-size: 32rpx;
			background: #b79f77;
		}
	}
	&-nulls {
		height: calc(100% - 202rpx);
		text-align: center;
		img {
			width: 407rpx;
			height: 310rpx;
			margin: 280rpx auto 0;
		}
	}
}
</style>

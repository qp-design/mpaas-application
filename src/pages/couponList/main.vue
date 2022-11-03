<template>
	<div class="couponList">
		<!-- <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" /> -->
		<div class="couponList-tit">
			<div v-for="(tit, index) in titList" :key="index" @click="titClick(index)" :style="{ color: current == index ? baseColor : '' }">
				{{ tit.tit }}
				<i v-show="tit.num !== 0">({{ tit.num }})</i>
				<span v-show="current == index" :style="{ background: baseColor }"></span>
			</div>
		</div>
		<div class="couponList-con" v-if="items.length > 0">
			<ul>
				<li v-for="(item, itemIndex) in items" :key="itemIndex">
					<div>
						<h1 v-if="item.pbCode == '0003'" :style="{ color: baseColor }">
							￥
							<i>{{ item.discAmount }}</i>
						</h1>
						<h1 v-if="item.pbCode == '0004'" :style="{ color: baseColor }">
							减
							<i>{{ item.discAmount }}</i>
						</h1>
						<h1 v-if="item.pbCode == '0005'" :style="{ color: baseColor }">
							<i>{{ item.discAmount }}</i>
							折
						</h1>
						<h3>{{ item.promotionName }}</h3>
					</div>
					<div>
						<h2 v-if="item.dataState == 0 && item.pbCode == '0004'">满{{ item.discStart }}减{{ item.discAmount }}</h2>
						<h2 v-else></h2>
						<h4>{{ item.couponStart }}至{{ item.couponEnd }}</h4>
					</div>
				</li>
			</ul>
		</div>
		<div class="couponList-nulls" v-else><img :src="nullImg" /></div>
		<lastPageLine :lastPageLine="lastPageLine" />
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers } from '@/utils/prototype/vue.js';
import { coupon } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import vueTabBar from '@/components/communal/vueTabBar';
import { formatDate } from '@/utils/prototype/date.js';
import lastPageLine from '@/components/communal/last-page-line';
export default {
	data() {
		return {
			title: '优惠券',
			leftIcon: true,
			rightIcon: false,
			current: 0,
			total: 0,
			page: 1,
			rows: 10,
			titList: [{ tit: '未使用', num: 0 }, { tit: '已使用', num: 0 }, { tit: '已过期', num: 0 }],
			items: [],
			dataState: 0,
			lastPageLine: false,
			userImgurl: require('@/static/img/mine/default_header.png'),
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/no_coupon.png'
		};
	},
	components: {
		commonHeader,
		lastPageLine
	},
	onLoad(options) {
		wx.setNavigationBarTitle({
			title: this.title
		});
		// wx.setNavigationBarColor({
		// 	frontColor: '#ffffff', // 必写项
		// 	backgroundColor: '#' + this.baseColor
		// });
	},
	mounted() {},
	onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
		http.post(coupon.queryUsercouponNember).then(res => {
			if (res && res.dataMap) {
				this.titList[0].num = res.dataMap.notused;
				this.titList[1].num = res.dataMap.alreadyused;
				this.titList[2].num = res.dataMap.expired;
				this.commonMounted();
			}
		});
	},
	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadMore();
	},
	methods: {
		commonMounted() {
			http.post(coupon.couponList, { page: this.page, rows: this.rows, pbCode:'0003', dataState: this.dataState }).then(res => {
				if (res && res.rows) {
					this.items = res.rows;
					this.items.map(v => {
						v.couponStart = formatDate(v.couponStart);
						v.couponEnd = formatDate(v.couponEnd);
					});
				}
				if (this.items.length === 0) {
					this.lastPageLine = false;
				}
			});
		},
		titClick(index) {
			console.log(index,555555555)
			this.items = [];
			this.current = index;
			this.dataState = index;
			if(index == 2){
				this.dataState = "2,-1"
			}
			this.page = 1;
			this.rows = 10;
			this.commonMounted();
		},
		loadMore() {
			let num = Math.ceil(this.total / 10);
			this.page++;
			if (this.page <= num) {
				http.post(coupon.couponList, { page: this.page, rows: this.rows, dataState: this.dataState }).then(res => {
					let list = res.rows;
					list.map(v => {
						v.couponStart = formatDate(v.couponStart);
						v.couponEnd = formatDate(v.couponEnd);
					});

					this.items = [...this.items, ...list];
				});
			} else {
				this.lastPageLine = true;
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';
.couponList {
	width: 100%;
	height: 100%;
	background: @white-color;
	&-tit {
		margin-top: 0;
		height: 92rpx;
		display: flex;
		border-bottom: 20rpx solid #fafafa;
		div {
			justify-content: center;
			position: relative;
			// height: 92rpx;
			line-height: 92rpx;
			flex: 1;
			display: flex;
			align-items: center;
			span {
				height: 3rpx;
				width: 100%;
				background: #bfa676;
				position: absolute;
				bottom: 0;
				left: 0;
			}
		}
	}
	&-con {
		padding: 15rpx 30rpx 0;
		ul {
			li {
				padding: 38rpx 33rpx 30rpx;
				border-radius: 5rpx;
				box-shadow: 0rpx 0rpx 30rpx #eee;
				margin: 30rpx 0 20rpx;
				div {
					display: flex;
					align-items: center;
					h1 {
						color: #d66377;
						font-size: 22rpx;
						margin-right: 50rpx;
						width: 136rpx;
						text-align: center;
						display: flex;
						align-items: center;
						justify-content: center;
						i {
							font-size: 50rpx;
						}
					}
					h2 {
						font-size: 22rpx;
						color: @color-999;
						width: 136rpx;
						text-align: center;
						margin-right: 50rpx;
					}
					h3 {
						font-size: @top-title;
						color: @color-333;
					}
					h4 {
						font-size: 20rpx;
						color: @color-999;
					}
				}
			}
		}
	}
	&-nulls {
		/* #ifndef H5 */
		height: calc(100% - 202rpx);
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 202rpx);
		display: flex;
		justify-content: center;
		align-items: center;
		/* #endif */
		text-align: center;
		img {
			width: 395rpx;
			height: 330rpx;
			/* #ifndef H5 */
			margin: 280rpx auto 0;
			/* #endif */
		}
	}
}
</style>

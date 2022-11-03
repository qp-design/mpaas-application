<template>
	<div class="orderList">
		<commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" />
		<div class="orderList-info" v-if="orderList.length > 0">
			<ol>
				<li v-for="(order, index) in orderList" :key="index">
					<a>
						<div class="order-status">
							<div>订单编号：{{ order.contractBillcode }}</div>
						</div>
						<div class="order-msg" @click="orderDetail(order)">
							<img :src="order.dataPic || userImgurl" />
							<div>
								<div>
									<p class="currentP">{{ order.goodsName }}</p>
									<h6>{{ order.skuName }}</h6>
								</div>
								<div style="text-align:right;">
									<p style="width:160rpx;" v-html="thinMoney(order.pricesetNprice)"></p>
									<h6>x{{ order.goodsNum }}</h6>
								</div>
							</div>
						</div>

						<div class="order-btn">
							<div>
								实付:
								<i :style="{ color: baseColor }" v-html="thinMoney(order.contractGoodsMoney)"></i>
							</div>
						</div>
					</a>
				</li>
			</ol>
		</div>
		<div class="orderList-nulls" v-else><img :src="nullImg" /></div>
		<lastPageLine :lastPageLine="lastPageLine" />
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { myOrder, refund, addShoppingGoodsBySpec } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import lastPageLine from '@/components/communal/last-page-line';
export default {
	data() {
		return {
			title: '我的搜索',
			leftIcon: true,
			rightIcon: false,
			orderList: [], //订单列表
			current: 0,
			page: 1, //分页
			total: 0, //列表数据总数
			rows: 10,
			lastPageLine: false, //底部提示
			userImgurl: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/img_default.jpg',
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noOrder.png',
			goodsName:""
		};
	},
	computed: {
		unitPrice() {
			// mapay 主单位（后面）  mbpay 主单位（前面）  obpay 辅单位（前面）   oapay 辅单位（后面）
			return this.$state.unitPrice || $storage.get('unitPrice');
		}
	},
	components: {
		commonHeader,
		lastPageLine
	},
	onLoad(e) {
		this.goodsName = JSON.parse(e.goodsName).goodsName 
		wx.setNavigationBarTitle({
			title: $storage.get('proappEnvName')
		});
		wx.setNavigationBarColor({
			frontColor: '#ffffff', // 必写项
			backgroundColor: '#' + this.$state.baseColor
		});
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadMore();
	},
	mounted() {
		this.orderList = [];
		this.page = 1;
		this.commonMounted();
	},
	methods: {
		commonMounted() {
			let params = {
				page: this.page,
				rows: this.rows,
				goodsName: this.goodsName
			};
			http.post(myOrder.queryContractGoodsPage, params).then(res => {
				if (res && res.rows) {
					let list = res.rows;
					list.map(val => {
						if (!RegExp(/http/).test(val.dataPic)) {
							val.dataPic = this.$domain + val.dataPic;
						}
					});
					this.orderList = [...this.orderList, ...list];
					this.total = res.total;
				}
			});
		},
		orderDetail(order) {
			let params = {
				contractBillcode: order.contractBillcode,
				expressType: '',
				expressNo: ''
			};
			this.$state.orderMenu.map(v => {
				if (v.menuAction == 'orderInfor') {
					$routers.push(v.menuJspath, params);
				}
			});
		},
		loadMore() {
			let num = Math.ceil(this.total / 10);
			this.page++;
			if (this.page <= num) {
				this.commonMounted();
			} else {
				this.lastPageLine = true;
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';
.orderList {
	width: 100%;
	&-info {
		margin-top: 90rpx;
		ol {
			li {
				border-bottom: 20rpx solid #fafafa;
				padding: @padding-30;
				background: @white-color;
				&:first-child {
					border-top: 20rpx solid #fafafa;
				}
				&:last-child {
					border-bottom: 0;
				}
				a {
					.order-status {
						height: 79rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						border-bottom: 1rpx solid #f6f6f8;
						> div {
							font-size: @big-title;
						}
					}
					.order-msg {
						padding: 15rpx 0 48rpx 0;
						border-bottom: 1rpx solid #f6f6f8;
						display: flex;
						justify-content: space-between;
						img {
							width: 130rpx;
							height: 130rpx;
							margin-right: @margin-right;
						}
						> div {
							display: flex;
							justify-content: space-between;
							p {
								font-size: @big-title;
								color: @color-333;
								margin: 12rpx 0 25rpx 0;
							}
							.currentP {
								width: 380rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
							h6 {
								font-size: 24rpx;
								color: @color-999;
							}
						}
					}
					.order-btn {
						height: 88rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						div:first-child {
							display: flex;
							align-items: center;
							i {
								margin-left: 10rpx;
							}
						}
						span {
							display: inline-block;
							border: 1rpx solid #d4d4d4;
							line-height: 46rpx;
							border-radius: 26rpx;
							padding: 0 20rpx;
							font-size: 22rpx;
							color: @color-666;
							margin-right: @margin-right;
							&:last-child {
								margin-right: 0;
							}
						}
					}
				}
			}
		}
	}
	&-nulls {
		height: calc(100% - 202rpx);
		text-align: center;
		img {
			width: 424rpx;
			height: 311rpx;
			margin: 280rpx auto 0;
		}
	}
}
</style>

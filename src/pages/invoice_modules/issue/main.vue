<template>
	<div class="orderList">
		<div class="orderList-info">
			<ol v-if="orderList.length > 0">
				<li v-for="(order, index) in orderList" :key="index">
					<view class="orderList">
						<div class="order-status">
							<div>订单编号：{{ order.contractBillcode }}</div>
						</div>
						<div class="order-msg" v-for="(goods, goodsIndex) in order.goodsList" :key="goodsIndex">
							<img :src="goods.dataPic | urlFilter" />
							<div>
								<div>
									<p class="currentP">{{ goods.goodsName }}</p>
									<h6>{{ goods.skuName }}</h6>
								</div>
								<div style="text-align:right;">
									<p style="width:160rpx;">￥{{ goods.pricesetNprice }}</p>
									<h6>x{{ goods.goodsNum }}</h6>
								</div>
							</div>
						</div>

						<div class="order-btn">
							<div>
								开票金额:
								<i :style="{ color: baseColor }">¥{{ order.dataBmoney }}</i>
							</div>
							<div><span :style="{ color: baseColor, borderColor: baseColor }" @click.stop="toInvoiceTit(order, index)"  v-if='init_dateT(order.gmtModified)'>开具发票</span></div>
						</div>
					</view>
				</li>
			</ol>
			<div class="noimg" v-if="orderList.length == 0 && requestStatic">
				<img :src="nullImg" />
				<p>暂无交易记录</p>
			</div>
		</div>
		<lastPageLine :lastPageLine="lastPageLine" />
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { invoice } from '@/api/interface.js';
import lastPageLine from '@/components/communal/last-page-line';
export default {
	data() {
		return {
			title: '交易记录',
			leftIcon: true,
			rightIcon: false,
			orderList: [], //订单列表
			current: 0,
			page: 1, //分页
			total: 0, //列表数据总数
			rows: 10,
			lastPageLine: false, //底部提示
			userImgurl: require('@/static/img/mine/default_header.png'),
			requestStatic: false,
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noGoods.png'
		};
	},
	components: {
		lastPageLine
	},
	onLoad() {},
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
		this.lastPageLine = false;
		this.commonMounted();
	},
	methods: {
		init_dateT(val) {
			return new Date(val).getTime() + 30 * 24 * 60 * 60 * 1000 > new Date().getTime();
		},
		commonMounted() {
			let data = this.$root.$mp.query;
			let params = {
				page: this.page,
				rows: this.rows,
				childFlag: true,		//订单商品
				settleFlag: true,
				//       goodsName: data.goodsName,
				// dataState:"4"
				contractTypepro: '0',
				notContractType: '08'
			};
			http.post(invoice.invoicelist, params).then(res => {
				if (res && res.rows) {
					console.log(res.rows,'res.rows')
					let list = res.rows;
					list.map(item => {
						if(item.ocContractSettlList){
							item.ocContractSettlList.forEach(items => {
								if(items.contractSettlBlance === 'CAS'){
									item.dataBmoney = items.contractSettlPmoney
								}
							})
						}
					})
					this.orderList = [...this.orderList, ...list];
					this.requestStatic = true;
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
			//$routers.push('orderDetail/orderDetail',params)
		},
		toInvoiceTit(order, index) {
			let params = {
				code: order.contractBbillcode,
				money: order.dataBmoney,
				invlistOptype: 'OcContract'
			};
			this.$routers.push('invoice_modules/issue/issueAdd', {params: JSON.stringify(params) })
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
<style lang="less">
page {
	background: #ffffff;
}
</style>
<style lang="less" scoped>
@import '@/common/css/common.less';
.noimg {
	margin-top: 46%;
	img {
		display: block;
		width: 359rpx;
		height: 276rpx;
		margin: 0 auto;
	}
	p {
		margin-top: 40rpx;
		height: 72rpx;
		line-height: 72rpx;
		text-align: center;
		color: #999999;
		font-size: 24rpx;
	}
}
.orderList {
	width: 100%;
	&-info {
		ol {
			li {
				border-bottom: 20rpx solid #fafafa;
				padding: @padding-30;
				background: @white-color;
				&:first-child {
					border-top: 20rpx solid #fafafa;
				}
				.orderList {
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
}
</style>

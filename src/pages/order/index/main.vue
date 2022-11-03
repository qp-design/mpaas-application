<template>
	<div class="orderList u-skeleton">
		<div class="orderList-tit">
			<ul>
				<li v-for="(item, index) in items" :key="index" @click="orderTitle(item, index)">
					<a :class="[current === index ? 'active' : '', 'u-skeleton-rect']" :style="{ color: current == index ? baseColor : '' }">
						{{ item }}
						<span :style="{ background: baseColor }"></span>
					</a>
				</li>
			</ul>
		</div>
		<!-- #ifndef H5 -->
		<div class="orderList-info u-skeleton-rect" v-if="orderList.length > 0">
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<div class="orderList-info u-skeleton-rect" v-show="orderList.length > 0">
		<!-- #endif -->
			<view>
				<li v-for="(order, index) in orderList" :key="index">
					<view>
						<div class="order-status u-skeleton-rect">
							<div class='u-skeleton-rect'>订单编号：{{ order.contractBillcode }}</div>
							<div class="u-skeleton-rect" v-if="order.dataState == -1">已取消</div>
							<div class="u-skeleton-rect" v-else-if="order.dataState == 1">待付款</div>
							<div class="u-skeleton-rect" v-else-if="order.dataState == 2 || order.dataState == 8">待发货</div>
							<div class="u-skeleton-rect" v-else-if="order.dataState == 3">待收货</div>
							<div class="u-skeleton-rect" v-else-if="order.dataState == 4">已收货</div>
							<div class="u-skeleton-rect" v-else-if="order.dataState == 5">交易成功</div>
						</div>
						<div class="order-msg u-skeleton-rect" v-for="(goods, goodsIndex) in order.goodsList" :key="goodsIndex" @click="orderDetail(order)">
							<img class="u-skeleton-rect" :src="checkImgUrl(goods.dataPic)" />
							<div class="order_gifts" v-if="goods.contractGoodsGtype == '1'">赠品</div>
							<div>
								<div>
									<p class="currentP u-skeleton-rect">{{ goods.goodsName }}</p>
									<p class="currentP1 u-skeleton-rect">{{ goods.goodsProperty?goods.goodsProperty:'' }}</p>
									<h6 class="u-skeleton-rect">
										<text>{{ goods.skuName }}</text>
										<text style="padding-left: 32rpx;">{{ goods.skuNo }}</text>
									</h6>
								</div>
								<div style="text-align:right;">
									<p class="u-skeleton-rect" style="width:160rpx;" v-html="thinMoney(goods.pricesetNprice)"></p>
									<h6 class="u-skeleton-rect">x{{ goods.goodsNum }}</h6>
								</div>
							</div>
						</div>

						<div class="order-time u-skeleton-rect" v-if="order.dataState == 1">
							<div class="timeText u-skeleton-rect">剩余支付时间为:</div>
							<u-count-down
								class="u-skeleton-rect"
								:timestamp="getFinishTime(order)"
								bg-color="#ffffff"
								:show-days="false"
								separator="zh"
								separator-color="#f00"
								color="#f00"
								@end="endTime(order)"
								font-size="24"
							></u-count-down>
						</div>

						<div class="order-btn u-skeleton-rect u-skeleton-rect">
							<div class="left u-skeleton-rect">
								实付:
								<i :style="{ color: baseColor }" v-html="thinMoney(order.dataBmoney)"></i>
							</div>
							<div class="right u-skeleton-rect" v-if="order.dataState == 1">
								<div class="btn u-skeleton-rect" @click="cancelOrder(order)">取消订单</div>
								<div class="btn u-skeleton-rect" v-if="order.timeShow" @click="pay(order)" :style="{ borderColor: baseColor, color: baseColor }">立即支付</div>
								<div class="btn u-skeleton-rect" v-else>立即支付</div>
							</div>
							<div class="right  u-skeleton-rect" v-else-if="order.dataState == 2">
								<!-- <span @click="refundMoney(order)">申请退款</span> -->
								<!-- <span @click="addShoppingGoods(order)">再次购买</span> -->
							</div>
							<div class="right  u-skeleton-rect" v-else-if="order.dataState == 3">
								<div class="btn u-skeleton-rect" @click="queryExpressInfo(order)">查看物流</div>
								<div class="btn u-skeleton-rect" @click="confirmReceive(order)" :style="{ borderColor: baseColor, color: baseColor }">确认收货</div>
							</div>
							<div class="right  u-skeleton-rect" v-else-if="order.dataState == 4">
								<div v-if="order.contractAppraise == 1"><!-- <span>已评价</span> --></div>
								<div class="btn u-skeleton-rect" v-else @click="evaluate(order.goodsList)" :style="{ borderColor: baseColor, color: baseColor }">去评价</div>
							</div>
						</div>
					</view>
				</li>
			</view>
		</div>
		<!-- #ifndef H5 -->
		<div class="orderList-nulls" v-else>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<div class="orderList-nulls" v-show="orderList.length===0">
		<!-- #endif -->
			<img :src="nullImg" />
		</div>
		<lastPageLine :lastPageLine="lastPageLine" v-show="orderList.length > 0"/>
		<u-skeleton :loading="loading" v-show="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { myOrder, refund, addShoppingGoods, addShoppingGoodsBySpec } from '@/api/interface.js';
import lastPageLine from '@/components/communal/last-page-line';
import { checkImgUrl } from '@/utils/checkImg.js';
export default {
	data() {
		return {
			loading: true,
			checkImgUrl,
			items: ['全部', '待付款', '待发货', '已发货', '已收货'],
			orderList: [], //订单列表
			current: 0,
			page: 1, //分页
			total: 0, //列表数据总数
			rows: 10,
			dataState: 1, //table切换接口标示
			lastPageLine: false, //底部提示
			timeShow: true,
			nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noOrder.png'
		};
	},
	components: {
		lastPageLine
	},
	onLoad(e) {
		console.log(e,this.timeShow, '89898989898');
		let params = {
			page: 1,
			rows: 10,
			childFlag: true
		};
		if (e.dataState != 'undefined') {
			if (e.dataState == 0) {
				delete params.dataState;
			} else {
				this.dataState = e.dataState;
				params.dataState = this.dataState;
			}
			// if (e.dataState == 4) {
			// 	params.dataStateBuy = 1;
			// 	params.contractAppraise = 0;
			// } else {
			// 	delete params.dataStateBuy;
			// 	delete params.contractAppraise;
			// }
			this.current = Number(e.dataState);
		}
	},

	onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
		this.commonMounted(this.current);
		// this.change(order)
	},
	onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadMore();
	},
	watch: {
		current(val) {
			this.lastPageLine = false;
			this.orderList = [];
		}
	},
	methods: {
		commonMounted(current) {
			let params = {
				page: this.page,
				rows: this.rows,
				childFlag: true,
				contractType: '00,40,26,08'
			};

			if (current !== 0) {
				params.dataState = this.dataState;
			} else {
				delete params.dataState;
			}
			// if (current == 4) {
			// 	params.dataStateBuy = 1;
			// 	params.contractAppraise = 0;
			// } else {
			// 	delete params.dataStateBuy;
			// 	delete params.contractAppraise;
			// }
			http.get(myOrder.queryContractPage, params).then(res => {
				this.loading = false
				if (res && res.rows) {
					if (this.page === 1 && res.rows.length === 0) {
						this.orderList = [];
					} else {
						let list = res.rows;
						if (this.page === 1) {
							this.orderList = list;
							this.orderList.forEach(item=>{
								item.timeShow=true
							})
						} else {
							this.orderList = [...this.orderList, ...list];
							this.orderList.forEach(item=>{
								item.timeShow=true
							})
						}
						// this.orderList = this.orderList.filter(item => ['00','40','26','08'].includes(item.contractType) )
					}
					
					this.total = res.total;
				}
			});
		},
		getFinishTime(order) {
			if (new Date(order.contractPaydate).getTime() < new Date().getTime()) {
				order.timeShow = false;
			}
			// console.log((Number(new Date(order.contractPaydate).getTime()) - Number(new Date().getTime())) / 1000,"(Number(new Date(order.contractPaydate).getTime()) - Number(new Date().getTime())) / 1000")
			return (Number(new Date(order.contractPaydate).getTime()) - Number(new Date().getTime())) / 1000;
		},
		// change(order) {

		// 	// console.log(new Date(order.contractPaydate).getTime(),new Date().getTime(),"new Date().getTime()")
		// },
		endTime(order) {
			const that = this;
			console.log("倒计时结束")
			// console.log(new Date(order.contractPaydate).getTime(),"new Date(order.contractPaydate).getTime()")
			http.post(myOrder.cancelContractC, { contractId: order.contractId }).then(res => {
				if (res.success) {
					that.commonMounted(that.current);
				}
			});
		},
		orderTitle(item, index) {
			this.current = index;

			this.dataState = index;

			this.page = 1;
			this.rows = 10;
			this.commonMounted(index);
		},
		pay(order) {
			this.$routers.push('/pages/payMethods/payMethods', {contractBillcode: order.contractBillcode})
		},
		evaluate(order) {
			this.$state.set('order', order);
			this.$routers.push('evaluate_modules/index', {contractBillcode: order[0].contractBillcode})
		},

		queryExpressInfo(order) {
			this.$routers.push('order/logistic', {id: order.contractBillcode})
		},
		confirmReceive(order) {
			let that = this;
			// #ifdef H5
			let dom1 = document.querySelectorAll('.uni-mask');
			for (var i = 0; i < dom1.length; i++) {
				dom1[i].style.display = '';
				dom1[i].style.pointerEvents = 'none';
			}
			// #endif
			uni.showModal({
				//title: '提示',
				content: '确认收货',
				success(res) {
					if (res.confirm) {
						$message.hide()
						http.post(myOrder.confirmReceive, {
							contractBillcode: order.contractBillcode
						})
							.then(res => {
								if (res && res.success) {
									$message.success('确认收货成功');
								}else{
									$message.alert(res.msg);
								}
								
							})
							.then(() => {
								setTimeout(()=>{
									that.page = 1;
									that.commonMounted(that.current);
								},1500)
							});
					} else if (res.cancel) {
						$message.hide()
					}
				}
			});
		},
		cancelOrder(order) {
			let that = this;
			wx.showModal({
				//title: '提示',
				content: '取消订单',
				success(res) {
					http.post(myOrder.cancelContractC, { contractId: order.contractId }).then(res => {
						if (res.success) {
							that.commonMounted(that.current);
						}
					});
				}
			});
		},
		addShoppingGoods(order) {
			//该方法暂时不用
			let goodsCode = [];
			let specStr = [];
			order.goodsList.map(val => {
				goodsCode.push(val.goodsCode);
				specStr.push(val.skuName);
			});
			let params = {
				goodsCode: goodsCode.join(','),
				specStr: JSON.stringify(specStr)
			};
			http.post(addShoppingGoodsBySpec, params).then(res => {
				http.post(addShoppingGoods, { skuId: res.dataObj.skuId, goodsNum: 1 }).then(res => {
					if (res.success) {
						$routers.push('shopcart');
					}
				});
			});
		},
		orderDetail(order) {
			this.$routers.push('order/infor', {id: order.contractBillcode})
		},
		toSearch() {
			this.$routers.push('order/search')
		},
		loadMore() {
			let num = Math.ceil(this.total / 10);
			this.page++;
			if (this.page <= num) {
				this.commonMounted(this.current);
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

	&-save {
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
	&-tit {
		width: 100%;
		position: fixed;
		top:0;
		z-index: 999;
		background-color: #ffffff;
		ul {
			display: flex;
			justify-content: space-between;
			padding: @padding-30;
			height: 90rpx;
			li {
				height: 90rpx;
				a {
					width: 100%;
					height: 100%;
					line-height: 90rpx;
					display: inline-block;
					position: relative;
					font-size: 28rpx;
					color: @color-333;
				}
				.active {
					// color: #bfa676;
					span {
						position: absolute;
						height: 3rpx;
						width: 100%;
						// background: #bfa676;
						bottom: 0;
						left: 0;
					}
				}
			}
		}
	}
	&-info {
		margin-top: 100rpx;
		view {
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
				view {
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
						padding: 15rpx 0 15rpx 0;
						border-bottom: 1rpx solid #f6f6f8;
						display: flex;
						justify-content: space-between;
						position: relative;
						.order_gifts{
							padding-left: 34rpx;
							position: absolute;
							left: 0;
							bottom: 16rpx;
							width: 130rpx;
							height: 40rpx;
							text-align: center;
							background: rgba(0, 0, 0, 0.3);
							text-align: center;
							font-weight: 500;
							line-height: 40rpx;
							color: #ffffff;
							font-size: 30rpx;
							font-family: PingFangSC-Medium, PingFang SC;
							p{
								
							}
						}
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
								font-size: 28rpx;
								font-weight: 500;
								color: #394259;
								
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
							}
							.currentP1 {
								width: 380rpx;
								font-size: 22rpx;
								color: #888E9B;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								overflow: hidden;
								
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
						.left {
							display: flex;
							align-items: center;
							i {
								margin-left: 10rpx;
							}
						}
						.right {
							display: flex;
							align-items: center;
							.btn {
								display: flex;
								border: 1rpx solid #d4d4d4;
								// line-height: 46rpx;
								align-items: center;
								justify-content: center;
								border-radius: 26rpx;
								padding: 10rpx 20rpx;
								font-size: 22rpx;
								color: @color-666;
								margin-right: @margin-right;
								&:last-child {
									margin-right: 0;
								}
							}
						}
					}

					.order-time {
						display: flex;
						justify-content: flex-end;
						padding: 15rpx 0 0;
					}
				}
			}
		}
	}
	&-nulls {
		/* #ifndef H5 */
		height: calc(100% - 202rpx);
		text-align: center;
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 202rpx);
		display: flex;
		justify-content: center;
		align-items: center;
		/* #endif */
		img {
			width: 424rpx;
			height: 311rpx;
			/* #ifndef H5 */
			margin: 220rpx auto 0;
			/* #endif */
		}
	}
}
</style>

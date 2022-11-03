<template>
	<div class="orderList">
		<div class="orderList-tit">
			<ul>
				<li v-for="(item, index) in items" :key="index" @click="orderTitle(item, index)">
					<a :class="current === index ? 'active' : ''" :style="{ color: current == index ? baseColor : '' }">
						{{ item }}
						<span :style="{ background: baseColor }"></span>
					</a>
				</li>
			</ul>
		</div>
		<div>
			<!-- #ifndef H5 -->
			<view v-if="orderList.length>0">
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view v-show="orderList.length>0">
			<!-- #endif -->
				<li v-for="(order, index) in orderList" :key="index">
					<view class="main">
						<view class="item">
							<view class="title">
								<view class="left">{{formatDate(order.gmtCreate)}}</view>
								<view class="right">
									<view v-if="order.dataState==-1">已取消</view>
									<view v-else-if="order.dataState==1">待付款</view>
									<view v-else-if="order.dataState==2">待发货</view>
									<view v-else-if="order.dataState==3">待收货</view>
									<view v-else-if="order.dataState==4">完成</view>
									<view v-else-if="order.dataState==30">待成团</view>
								</view>
							</view>
							<view class="show" v-for="(goods, goodsIndex) in order.goodsList" :key="goodsIndex" @click="orderDetail(order)">
								<view class="left">
									<img :src="checkImgUrl(goods.dataPic)" />
								</view>
								<view class="right">
									<view class="one">{{goods.goodsName}}</view>
									<view class="two">{{goods.skuName}}</view>
									<view class="three">
										<view class="price">¥{{goods.pricesetNprice}}</view>
										<view class="num">×{{ goods.goodsNum }}</view>
									</view>
								</view>
							</view>
							<!-- <view class="bottom" v-if="order.dataState==1">
								<div class="btn" @click="cancelOrder(order)">取消订单</div>
								<view class="btn" @click="pay(order)">立即支付</view>
							</view> -->
							<div class="order-time" v-if="order.dataState == 1">
								<div class="timeText">剩余支付时间为:</div>
								<u-count-down
									:timestamp="getFinishTime(order)"
									bg-color="#ffffff"
									:show-days="false"
									separator="zh"
									separator-color="#f00"
									color="#f00"
									@end="cancelOrder(order)"
									font-size="24"
								></u-count-down>
							</div>
							
							<div class="order-btn">
								<div class="left">
									实付:
									<i :style="{ color: baseColor }" v-html="thinMoney(order.dataBmoney)"></i>
								</div>
								<div class="right" v-if="order.dataState == 1">
									<div class="btn" @click="cancelOrder(order)">取消订单</div>
									<div class="btn" @click="pay(order)" :style="{ borderColor: baseColor, color: baseColor }">立即支付</div>
								</div>
								<div class="right" v-else-if="order.dataState == 2">
									<!-- <span @click="refundMoney(order)">申请退款</span> -->
									<!-- <span @click="addShoppingGoods(order)">再次购买</span> -->
								</div>
								<div class="right" v-else-if="order.dataState == 3">
									<div class="btn" @click="queryExpressInfo(order)">查看物流</div>
									<div class="btn" @click="confirmReceive(order)" :style="{ borderColor: baseColor, color: baseColor }">确认收货</div>
								</div>
								<div class="right" v-else-if="order.dataState == 4">
									<div v-if="order.contractAppraise == 1"><!-- <span>已评价</span> --></div>
									<div class="btn" v-else @click="evaluate(order.goodsList)" :style="{ borderColor: baseColor, color: baseColor }">去评价</div>
								</div>
							</div>
						</view>
					</view>
				</li>
			</view>
		</div>
		<!-- #ifndef H5 -->
		<div class="orderList-nulls" v-if="orderList.length==0">
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<div class="orderList-nulls" v-show="orderList.length==0">
		<!-- #endif -->
			<img :src="nullImg" /></div>

		<!-- 	<view class="item">
				<view class="title">
					<view class="left">2021.05.14 18:38:00</view>
					<view class="right">待成团</view>
				</view>
				<view class="show">
					<view class="left"></view>
					<view class="right">
						<view class="one">系列透明款防风沙居家旅行</view>
						<view class="two">SF301AF系列，【标准套装】</view>
						<view class="three">
							<view class="price">¥996</view>
							<view class="num">×6</view>
						</view>
					</view>
				</view>
				<view class="bottom" v-if="false">
					<view class="btn">立即支付</view>
				</view>
			</view> -->
		</view>
	</div>
</template>

<script>
	import {
		formatDate
	} from "@/utils/prototype/date.js";
	import http from '@/api/http.js';
	import {
		myOrder
	} from '@/api/interface.js';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import lastPageLine from '@/components/communal/last-page-line';
	import {
		checkImgUrl
	} from '@/utils/checkImg.js';

	export default {
		data() {
			return {
				formatDate,
				checkImgUrl,
				items: ['全部', '待付款', '待成团', '已成团', '已失败'],
				orderList: [], //订单列表
				current: 0,
				page: 1, //分页
				total: 0, //列表数据总数
				rows: 10,
				dataState: 1, //table切换接口标示
				lastPageLine: false, //底部提示
				nullImg: this.$imgDomain + '/paas/shop-master/c-static/images/wxminiImg/noOrder.png'
			};
		},
		onLoad(e) {
			// console.log('88888888888888888')
			// if (e.dataState != 'undefined') {
			// 	this.current = Number(e.dataState);
			// }

			console.log(e, '89898989898')
			let params = {
				page: 1,
				rows: 10,
				childFlag: true,
			};
			if (e.dataState != 'undefined') {

				if (e.dataState == 0) {
					delete params.dataState;
				} else if (e.dataState == 1) {
					this.dataState = e.dataState;
					params.dataState = this.dataState;
				} else if (e.dataState == 2) {
					this.dataState = 30;
					params.dataState = 30;
				} else if (e.dataState == 3) {
					this.dataState = 2;
					params.dataState = 2;
				} else if (e.dataState == 4) {
					this.dataState = -1;
					params.dataState = -1;
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
		},


		components: {
			gmtCreate() {
				return formatDate(this.order.gmtCreate);
			}
		},
		methods: {
			evaluate(order) {
				this.$state.set('order', order);
				this.$routers.push('evaluate_modules/index', {contractBillcode: order[0].contractBillcode})
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
			queryExpressInfo(items) {
				this.$routers.push('order/logistic', {id: items.contractBillcode})
			},
			getFinishTime(order) {
				return (Number(new Date(order.contractPaydate).getTime()) - Number(new Date().getTime())) / 1000;
			},
			cancelOrder(order) {
				let that = this;
				wx.showModal({
					//title: '提示',
					content: '取消订单',
					success(res) {
						http.post(myOrder.cancelContractC, {
							contractId: order.contractId
						}).then(res => {
							if (res.success) {
								that.commonMounted(that.current);
							}
						});
					}
				});
			},
			orderDetail(order) {
				this.$routers.push('order/infor', {id: order.contractBillcode})
			},
			pay(order) {
				this.$routers.push('/pages/payMethods/payMethods', {contractBillcode: order.contractBillcode})
			},
			commonMounted(current) {
				let params = {
					page: this.page,
					rows: this.rows,
					childFlag: true
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
				http.get(myOrder.getgoodsinfo, params).then(res => {
					console.log(res, '666666666666666666')
					if (res && res.rows) {
						if (this.page === 1 && res.rows.length === 0) {
							this.orderList = [];
						} else {
							let list = res.rows;
							if (this.page === 1) {
								this.orderList = list;
								res.gmtCreate = formatDate(res.gmtCreate);
								console.log(this.orderList, '7777777777777777777')
							} else {
								this.orderList = [...this.orderList, ...list];
							}
						}
						this.total = res.total;
					}
				});
			},

			orderTitle(item, index) {
				if (index == 2) {
					this.current = index;

					this.dataState = 30;
				} else if (index == 3) {
					this.current = index;

					this.dataState = 2;
				} else if (index == 4) {
					this.current = index;

					this.dataState = -1;
				} else {
					this.current = index;

					this.dataState = index;
				}


				this.page = 1;
				this.rows = 10;
				this.commonMounted(index);
			},
			// orderTitle(item, index) {
			// 	console.log(item,index)
			// 	this.current = index;
			// 	this.dataState = index;
			// },
		}
	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

	.orderList {
		width: 100%;
		height: 100%;
		background: #F7F7F7;

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
			background: #fff;
			margin-bottom: 24rpx;

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

		.main {
			width: 100%;
			background: #F7F7F7;

			.item {
				background-color: #fff;
				padding: 24rpx;
				margin-bottom: 24rpx;

				.title {
					display: flex;
					justify-content: space-between;
					margin-bottom: 30rpx;

					.left {
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #000000;
					}

					.right {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #EB2B27;
					}
				}

				.show {
					width: 100%;
					height: 160rpx;
					display: flex;
					margin-bottom: 20rpx;

					.left {
						width: 160rpx;
						height: 160rpx;
						margin-right: 24rpx;
						background-color: rgba(0, 0, 0, .3);

						img {
							width: 160rpx;
							height: 160rpx;
							margin-right: @margin-right;
						}
					}

					.right {
						flex: 1;
						width: 74%;
						height: 160rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						.one {
							font-size: 24rpx;
							font-family: Helvetica;
							color: #000000;
							// overflow: hidden;
							// text-overflow: ellipsis;
							// white-space: nowrap;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.two {
							font-size: 20rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #595959;
						}

						.three {
							display: flex;
							justify-content: space-between;

							.price {
								font-size: 28rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #EB2B27;
							}

							.num {
								font-size: 24rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #B4B4B4;
							}
						}
					}
				}

				.bottom {
					width: 100%;
					border-top: 2rpx solid #F1F1F1;
					padding-top: 20rpx;
					display: flex;
					justify-content: flex-end;

					.btn {
						width: 144rpx;
						height: 48rpx;
						border-radius: 24rpx;
						border: 2rpx solid #EB2B27;
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #EB2B27;
						line-height: 48rpx;
						text-align: center;
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
			padding-top: 88rpx;
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
	.order-time {
		display: flex;
		justify-content: flex-end;
		padding: 15rpx 0 0;
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
</style>

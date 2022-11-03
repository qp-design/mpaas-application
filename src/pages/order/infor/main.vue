<template>
	<div class="orderDetail u-skeleton">
		<div class="orderDetail-box">
			<div class="orderDetail-box-tit" :style="{ background: baseColor }">
				<div class="orderDetail-box-tit-l u-skeleton-rect" v-if="items.dataState == 1">
					<i class="iconfont">&#xe675;</i>
					等待付款
				</div>
				<div class="orderDetail-box-tit-l u-skeleton-rect" v-if="items.dataState == 2 || items.dataState == 8">
					<i class="iconfont">&#xe675;</i>
					等待发货
				</div>
				<div class="orderDetail-box-tit-l u-skeleton-rect" v-if="items.dataState == 3">
					<i class="iconfont">&#xe675;</i>
					等待收货
				</div>
				<div class="orderDetail-box-tit-l u-skeleton-rect" v-if="items.dataState == 4">
					<i class="iconfont">&#xe675;</i>
					<span v-if="items.contractAppraise == '1'">交易成功</span>
					<span v-else>等待评价</span>
				</div>
				<div class="orderDetail-box-tit-l u-skeleton-rect" v-if="items.dataState == 5">
					<i class="iconfont">&#xe675;</i>
					交易成功
				</div>
				<div class="orderDetail-box-tit-l u-skeleton-rect" v-if="items.dataState == -1">
					<i class="iconfont">&#xe675;</i>
					订单已取消
				</div>
				<div class="orderDetail-box-tit-l u-skeleton-rect" v-if="items.dataState == 30">
					<i class="iconfont">&#xe675;</i>
					订单待成团
				</div>
				<div class="orderDetail-box-tit-r u-skeleton-rect" v-if="items.dataState == 3 || items.dataState == 4">{{ items.packageList[0].expressName || '京东快递' }}</div>
				<div class="orderDetail-box-tit-r u-skeleton-rect" v-if="items.dataState == 1">
					<u-count-down :timestamp="getFinishTime(items)" bg-color="#EB2B27" :show-days="false" separator="zh" separator-color="#fff" color="#fff"></u-count-down>
				</div>
			</div>
		</div>
		<div v-show="items.dataState == 3 || items.dataState == 4" @click="goLogistics(items)">
			<div class="orderDetail-logistics" v-if="traces.length !== 0">
				<div class="orderDetail-logistics-l u-skeleton-rect">
					<div class="orderDetail-logistics-l-icon"><i class="iconfont">&#xe735;</i></div>
					<div>
						<p>{{ traces[0].sendgoodsLogMsg }}</p>
						<h6>{{ traces[0].remark }}</h6>
					</div>
				</div>
				<div><i class="iconfont">&#xe61d;</i></div>
			</div>
			<div class="orderDetail-logistics" v-else-if="tracesList.length !== 0">
				<div class="orderDetail-logistics-l u-skeleton-rect">
					<div class="orderDetail-logistics-l-icon"><i class="iconfont">&#xe735;</i></div>
					<div>
						<p>{{ tracesList[0].context }}</p>
						<h6>{{ tracesList[0].time }}</h6>
					</div>
				</div>
				<div><i class="iconfont">&#xe61d;</i></div>
			</div>
			<div class="orderDetail-logistics" v-else>
				<div class="orderDetail-logistics-l u-skeleton-rect">
					<div class="orderDetail-logistics-l-icon"><i class="iconfont" :style="{ background: baseColor }">&#xe735;</i></div>
					<div>暂无物流信息</div>
				</div>
			</div>
		</div>
		<div class="orderDetail-address">
			<div><i class="iconfont u-skeleton-circle">&#xe68c;</i></div>
			<div>
				<p class="u-skeleton-rect">
					<span style="margin-right: 10rpx;">{{ $$placeholder(items.goodsReceiptMem,loading,10) }}</span>
					<span>{{ $$placeholder(items.goodsReceiptPhone,loading,10) }}</span>
				</p>
				<h6 class="u-skeleton-rect">{{ $$placeholder(items.goodsReceiptArrdess,loading,10) }}</h6>
			</div>
		</div>
		<div class="orderDetail-goods">
			<ul>
				<li v-for="(goods, index) in items.goodsList" :key="index" @click="goDetail(goods)">
					<div class="top">
						<view class='orderDetailimg'>
							<img  class="u-skeleton-rect" :src="checkImgUrl(goods.dataPic)" />
							<div class="order_gifts" v-if="goods.contractGoodsGtype == '1'">赠品</div>
						</view>
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
								<p class="u-skeleton-rect" style="width:140rpx;" v-html="thinMoney(goods.pricesetNprice)"></p>
								<h6 class="u-skeleton-rect">x{{ goods.goodsNum }}</h6>
							</div>
						</div>
					</div>
					<div class="goods-btn u-skeleton-rect" v-if="items.contractType!='08'">
						<div
							v-if="goods.contractGoodsGtype!='1'&&items.dataState == '2' && items.dataState != '27' && goods.contractGoodsRefnum != goods.goodsNum && (goods.refundFlag == 0 || (goods.refundFlag == 1 && goods.contractGoodsRefnum < goods.goodsCamount) )"
							@click.stop="refundMoney(goods, items)"
							:style="{ color: baseColor, borderColor: baseColor }"
						>
							{{items.contractType!='40'?'退款':'售后'}}
						</div>
						<div
							v-if="goods.contractGoodsGtype!='1'&&(items.dataState == '3' || items.dataState == '4') && goods.refundFlag == 0 && items.contractTypepro != 10"
							@click.stop="afterService(goods, items)"
							:style="{ color: baseColor, borderColor: baseColor }"
						>
							售后
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="orderDetail-info">
			<p class="u-skeleton-rect">订单编号：{{ $$placeholder(items.contractBillcode,loading,20) }}</p>
			<p class="u-skeleton-rect">下单时间：{{ $$placeholder(gmtCreate,loading,10) }}</p>
			<p class="u-skeleton-rect">支付方式：在线支付</p>
			<p class="u-skeleton-rect">备注：{{ $$placeholder(items.contractRemark || '',loading,20) }}</p>
			<!-- <p>支付时间：2018-10-9  00:10:20</p> -->
			<!-- <p>配送方式：圆通快递</p> -->
			<!-- <p>发票类型：不开发票</p> -->
		</div>
		<div class="orderDetail-price">
			<p class="u-skeleton-rect">
				商品总额
				<span class="u-skeleton-rect" v-html="thinMoney(items.dataBmoney)"></span>
			</p>
			<p class="u-skeleton-rect">
				运费
				<span class="u-skeleton-rect" v-html="thinMoney(items.goodsLogmoney)"></span>
			</p>
		</div>
		<div class="orderDetail-count u-skeleton-rect">
			实付款：
			<span class="u-skeleton-rect" :style="{ color: baseColor }" v-html="thinMoney(items.dataBmoney)"></span>
		</div>
		<div :style="{ display: items.dataState == 2 || items.dataState == -1 || items.dataState == 4 ? 'none' : 'block' }">
			<div class="orderDetail-footer">
				<div v-if="items.dataState == 1">
					<div class="orderDetail-footer-btn u-skeleton-rect" @click="cancelOrder(items)">取消订单</div>
					<div class="orderDetail-footer-btn u-skeleton-rect" :style="{ borderColor: baseColor, color: baseColor }" @click="pay(items)">立即支付</div>
				</div>
				<div v-else-if="items.dataState == 2">
					<!-- <span>申请退款</span> -->
					<!-- <span>再次购买</span> -->
				</div>
				<div v-else-if="items.dataState == 3">
					<div class="orderDetail-footer-btn u-skeleton-rect" @click="goLogistics(items)">查看物流</div>
					<div class="orderDetail-footer-btn u-skeleton-rect" @click="confirmReceive(items)" :style="{ borderColor: baseColor, color: baseColor }">确认收货</div>
				</div>
				<div v-else-if="items.dataState == 4">
					<div v-if="items.contractAppraise == 1">
						<!-- <span>申请售后</span> -->
						<!-- <span>再次购买</span> -->
						<!-- <span>去评价</span> -->
					</div>
					<div v-else>
						<!-- <span>申请售后</span> -->
						<!-- <div orderDetail-footer-btn :style="{ borderColor: baseColor, color: baseColor }" @click="evaluate(items.goodsList)">去评价</div> -->
					</div>
				</div>
			</div>
		</div>
		<u-skeleton :loading="loading" v-show="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { formatDate } from '@/utils/prototype/date.js';
import { checkImgUrl } from '@/utils/checkImg.js';
import { getContractByCode, refund, myOrder, getJdRefundComponent } from '@/api/interface.js';
import Vue from 'vue';
export default {
	data() {
		return {
			
			checkImgUrl,
			title: '订单详情',
			leftIcon: true,
			rightIcon: false,
			items: {},
			traces: [],
			tracesList: [],
			unitPrice: {},
			refundApply: '', //申请售后路径
			contractBillcode: '',
			jumpUrl:'',//morePages是从支付完成，查看订单详情进来的
			loading: true
		};
	},
	onLoad(options) {
		this.contractBillcode = options.id;
		this.jumpUrl=options.jumpUrl || '';
		http.get(getContractByCode, {
			contractBillcode: this.contractBillcode
		}).then(res => {
			this.loading = false;
			if (res) {
				this.items = res;
				this.getExpress();
			}
		});
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	onUnload() {
		if(this.jumpUrl=='morePages'){
			this.$routers.reOpen('order/index', {dataState: this.items.dataState})
		}
	},
	computed: {
		gmtCreate() {
			return formatDate(this.items.gmtCreate);
		}
	},
	methods: {
		goDetail(item){
			if(item.goodsType=="26"){
				this.$message.alert('秒杀商品，请到首页购买')
			}else{
			this.$routers.push('detail', {skuNo: item.skuCode})
			}
		},
		getFinishTime(order) {
			return (Number(new Date(order.contractPaydate).getTime()) - Number(new Date().getTime())) / 1000;
		},
		goLogistics(items) {
			this.$routers.push('order/logistic', {id: items.contractBillcode})
		},
		getExpress() {
			this.unitPrice = this.$state.unitPrice || $storage.get('unitPrice');
			this.$state.orderMenu.map(v => {
				if (v.menuAction == 'refundApply') {
					this.refundApply = v.menuJspath;
				}
			});

			let prop = {
				contractBillcode: this.items.contractBillcode,
				channelCode: 'jdvop',
				contractNbillcode: this.items.contractNbillcode,
				memberCode: this.items.memberCode,
				tenantCode: this.items.tenantCode
			};
			if (this.items.dataState == 3 || this.items.dataState == 4) {
				if (this.items.contractType == 40) {
					http.post(refund.getJDExpressPageForProp, prop).then(res => {
						this.traces = JSON.parse(res.dataObj).reverse();
						// this.tracesList = res.dataObj;
					});
				} else {
					if(this.items.packageList){
						let params = {
							expressType: this.items.packageList[0].expressCode,
							expressNo: this.items.packageList[0].packageBillno
						};
						http.get(refund.getExpressPageForProp, params).then(res => {
							if (res && res.dataObj) {
								let dataObj = JSON.parse(res.dataObj);
								console.log(dataObj, 8888);
								this.tracesList = dataObj.data;
								// this.wlStateInfor = this.wlState[dataObj.state];
							}
						});
					}
				}
			}
		},
		cancelOrder(items) {
			let that = this;
			wx.showModal({
				content: '取消订单',
				success(res) {
					if (res.confirm) {
						http.post(myOrder.cancelContractC, {
							contractId: items.contractId
						})
							.then(res => {
								if (res.success) {
									$message.alert('取消成功!');
								}
							})
							.then(res => {
								Vue.set(that.items, 'dataState', -1);
							});
					} else if (res.cancel) {
					}
				}
			});
		},
		confirmReceive(items) {
			let that = this;
			uni.showModal({
				content: '是否确认收货？',
				success: function(res) {
					if (res.confirm) {
						that.confirmHttp(items).then(res => {
							console.log(res,'确认收货成功!')
							$routers.refresh()
						})
					}
				}
			});
		},
		confirmHttp(items){
			let that = this;
			return new Promise(function (resolve, reject){
				http.post(myOrder.confirmReceive, {
					contractBillcode: items.contractBillcode
				}).then(res => {
						if (res && res.success) {
							$message.alert('确认收货成功!');
						}else{
							$message.alert(res.msg);
						}
						that.$set(that.items, 'dataState', 4);
						resolve(true);
					})
			})
			
		},
		goJdVop(goods){
			http.post(getJdRefundComponent,{
				skuId:goods.skuNo,
				jdOrderId: this.items.contractNbillcode,
				component:1, 
				channelCode: 'jdvop'
				}).then(res => {
				if(res.isSuccess){
					const params = encodeURIComponent(res.result);
					this.$routers.push('/pages/webView/webView', {url: params})
				}else{
					console.log(res,'res')
					this.$message.alert(res.msg)
				}
				
			})
		},
		afterService(goods, items) {
			if(this.items.contractType==='40'){
				this.goJdVop(goods)
			}else{
				const param = {
					dataPic: goods.dataPic,
					goodsName: goods.goodsName,
					contractGoodsCode: goods.contractGoodsCode,
					skuName: goods.skuName,
					pricesetNprice: goods.pricesetNprice,
					goodsNum: goods.goodsNum,
					goodsType: goods.goodsType,
					contractBillcode: this.items.contractBillcode,
					dataState: items.dataState,
					goodsCamount: goods.goodsCamount,
					contractGoodsMoney: goods.contractGoodsMoney,
					orderId: this.items.contractNbillcode,
					skuIds: this.items.goodsList[0].skuNo,
					memberCode: this.items.memberCode,
					tenantCode: this.items.tenantCode
				};
				const params = encodeURIComponent(JSON.stringify(param));
				this.$routers.push('/pages/afterSales/service/service', {params: params})
			}
		},
		refundMoney(goods, items) {
			if(this.items.contractType==='40'){
				this.goJdVop(goods)
			}else{
				if (items.contractTypepro == '10') {
					$message.alert('0元单不能退款');
					return false
				}
				goods.dataState = items.dataState;
				if(goods.dataState == 2){
					const length = this.items.goodsList.filter(i => {
						return i.refundFlag == 0&&i.contractGoodsGtype!='1'
					}).length
					// 最后一件
					let goodsLogmoney = length == 1 ? this.items.goodsLogmoney : 0;
					goods.goodsLogmoney = goodsLogmoney
					
				}else{
					goods.goodsLogmoney = 0
				}
				const params = encodeURIComponent(JSON.stringify(goods));
				// #ifdef H5
				this.$storage.sessionSet('params',JSON.stringify(goods))
				// #endif
				this.$routers.push('/pages/afterSales/service/service', {params: params})
			}
		},
		pay(items) {
			this.$routers.push('/pages/payMethods/payMethods', {contractBillcode: items.contractBillcode})
		},
		evaluate(items) {
			this.$state.set('order', items);
			this.$state.orderMenu.map(v => {
				if (v.menuAction == 'evaluate') {
					$routers.push(v.menuJspath);
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';

.orderDetail {
	width: 100%;
	background: @white-color;
	overflow-y: scroll;
	padding-bottom: 100rpx;

	&-box {
		&-tit {
			height: 138rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: @white-color;
			background: #b79f78;
			padding: @padding-30;

			&-l {
				font-size: 32rpx;
				display: flex;
				align-items: center;

				i {
					margin-right: 15rpx;
				}
			}

			&-r {
				font-size: 28rpx;
			}
		}
	}

	&-logistics {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 39rpx 30rpx 31rpx 30rpx;
		border-bottom: 1rpx solid #f6f6f8;

		&-l {
			display: flex;
			align-items: center;

			&-icon {
				margin-right: 27rpx;

				i {
					width: 44rpx;
					height: 44rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					background: #b79f77;
					color: @white-color;
				}
			}

			p {
				font-size: @top-title;
				color: #b79f77;
				// margin-bottom: 40rpx;
				width: 580rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			h6 {
				color: @color-999;
				font-size: @middle-title;
			}
		}
	}

	&-address {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 59rpx 30rpx 30rpx 30rpx;

		i {
			width: 44rpx;
			height: 44rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			background: @color-333;
			color: @white-color;
		}

		p {
			margin-left: 32rpx;
			font-size: @top-title;
			color: @color-333;
		}

		h6 {
			margin-left: 32rpx;
			color: @color-666;
			font-size: @middle-title;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}

	&-goods {
		border-top: 20rpx solid #fafafa;
		border-bottom: 20rpx solid #fafafa;

		ul {
			li {
				padding: 48rpx 30rpx 24rpx 30rpx;
				border-bottom: 1rpx solid #f6f6f8;
				position: relative;
				.orderDetailimg{
					position: relative;
					.order_gifts {
						position: absolute;
						left: 0;
						bottom: 0;
						width: 150rpx;
						height: 40rpx;
						text-align: center;
						background: rgba(0, 0, 0, 0.3);
						line-height: 40rpx;
						font-size: 30rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #ffffff;
					}
				}
				.top {
					display: flex;
					justify-content: space-between;

					img {
						width: 150rpx;
						height: 150rpx;
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

				&:last-child {
					border-bottom: 0;
				}

				.goods-btn {
					height: 50rpx;
					text-align: right;

					div {
						display: inline-block;
						height: 48rpx;
						line-height: 48rpx;
						color: #bfa676;
						font-size: 22rpx;
						border: 1rpx solid #bfa676;
						border-radius: 26rpx;
						padding: 0 20rpx;
					}
				}
			}
		}
	}

	&-info {
		padding: 20rpx 30rpx;
		border-bottom: 20rpx solid #f6f6f8;

		p {
			line-height: 64rpx;
			color: @color-333;
			font-size: @big-title;
		}
	}

	&-price {
		margin: 0 30rpx;
		padding: @padding-tb;
		display: flex;
		justify-content: space-between;

		p {
			line-height: 46rpx;
			font-size: @middle-title;
			color: @color-333;

			span {
				float: right;
				color: @color-666;
			}
		}
	}

	&-count {
		// float: right;
		color: @color-333;
		font-size: @middle-title;
		height: 86rpx;
		line-height: 86rpx;
		padding-right: 30rpx;
		padding-bottom: 150rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		span {
			color: #d66377;
			font-size: 36rpx;
		}
	}

	&-footer {
		height: 98rpx;
		width: calc(100% - 60rpx);
		/* #ifndef H5 */
		width: 100%;
		/* #endif */
		border-top: 1rpx solid #f6f6f8;
		padding: @padding-30;
		position: fixed;
		background: @white-color;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		div{
			display: flex;
		}
		.orderDetail-footer-btn {
			display: flex;
			height: 48rpx;
			// line-height: 48rpx;
			justify-content: center;
			align-items: center;
			color: @color-666;
			font-size: 22rpx;
			border: 1rpx solid #d4d4d4;
			border-radius: 26rpx;
			padding: 10rpx 20rpx;
			margin-right: 20rpx;

			&:last-child {
				margin-right: 0;
			}
		}
	}
}
</style>

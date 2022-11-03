<template>
	<view class="pay-method">
		<!-- 头部 -->
		<view class="pay-header">
			<view class="pay-header-success">
				<view class="pay-header-success-tip">
					<text class="iconfont icon-chenggong1"></text>
					<text>订单提交成功</text>
				</view>
				<view class="pay-header-success-info">
					<view v-if="contractBbillcode">订单号：{{ contractBbillcode }}</view>
					<view v-else>订单号：{{ contractBillcode }}</view>
					<view v-if="payMessage.dataBmoney">总金额：¥{{ payMessage.dataBmoney || keepDecimals }}</view>
				</view>
			</view>
		</view>

		<view class="pay-methods">
			<view class="payWay-method">
				<view class="method-item">
					<image :src="payType1.fchannelBankImgurl" mode="widthFix"></image>
					<text class="name">{{ payType1.fchannelName }}</text>
					<u-checkbox shape="circle" v-model="payTypecheck" :disabled="payTypedisbled"></u-checkbox>
				</view>
				<view v-if="payType1.ptfchannelAmt != '0'" style="display: flex;padding: 0 30rpx 30rpx 30rpx;">
					<text style="flex: 1;">优点：{{ payType1.faccountAmount || 0 }}</text>
					<text>本单抵扣：{{ accountNeedPayMoney || 0 }}</text>
				</view>
			</view>
			
		</view>
		<view class="pay-methods">
			<u-radio-group v-model="weixin" class="payWay-method">
				<view v-for="(item, index) in payChannelList" :key="index" @click="bindChoose(item.fchannelCode)">
						<!-- {{item}} -->
						<view class="method-item" v-if="item.dicActorCode == 'BANK'">
							<image :src="item.fchannelBankImgurl" mode="widthFix"></image>
							<text class="name">{{ item.fchannelName }}</text>
							<u-radio shape="circle" :name="item.fchannelCode" :disabled="wechatdisble"></u-radio>
						</view>
				</view>
			</u-radio-group>
		</view>
		<!-- 立即支付 -->
		<view class="pay-immediately">
			<text class="all">总计：</text>
			<text class="price" v-if="payMessage.dataBmoney">￥{{ payMessage.dataBmoney | keepDecimals }}</text>
			<view class="pay-btn btn" @click="paySubmit">立即支付</view>
		</view>
		<!-- #ifdef H5 -->
		<view id="v_html"></view>
		<!-- #endif -->
	</view>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import {
	syncContractState, // 查询订单是否创建成功
	saveOrderToPay, //设置支付方式
	paymentCommit, //获取立即支付数据
	syncContractPayState,
	syncContractBatchState,
	syncContractBatchPayState,
	saveOrderToBatchPay
} from '@/api/interface.js';
export default {
	data() {
		return {
			weixin: '',
			current: '',
			payMessage: {}, //订单数据
			payChannelList: [], //支付方式列表
			payJsons: {}, //选中的支付方式
			ptradeSeqno: '', // 编号
			contractBlance: '', //
			payType1: {},
			canChooseThird: false, //能否选择第三方支付 true不能支付   false可以支付
			accountNeedPayMoney: 0, // 余额支付多少
			needPayMoney: 0, // 第三方需要支付
			disabled: false,
			payTypecheck: false,
			payTypedisbled: false,
			wechatcheck: false,
			wechatdisble: false,
			contractBbillcode: '',
			contractBillcode: '',
			contMoney: '' //本单金额
		};
	},
	onLoad(options) {
		this.contractBillcode = options.contractBillcode;
		this.contractBbillcode = options.contractBbillcode || '';
		this.isTeam = options.isTeam;
		this.init(this.contractBbillcode);
		console.log(this.contractBbillcode, this.contractBillcode, options, '传参');
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods: {
		// 初始化
		init(contractBbillcode) {
			// 查看是否创建订单成功
			http.post(
				contractBbillcode ? syncContractBatchState : syncContractState,
				contractBbillcode
					? {
							contractBbillcode: contractBbillcode
					  }
					: {
							contractBillcode: this.contractBillcode
					  }
			).then(res => {
				if (res.success && res.dataObj != null) {
					if (res.dataObj.dataBmoney == 0) {
						return that.$routers.push('/pages/paySuccess/paySuccess', {pageState: 0,contractBillcode: that.contractBillcode})
					}
					this.payMessage = res.dataObj;
					if(this.contractBbillcode){
						this.contractBillcode=res.dataObj.contractBillcode
					}
					// 设置支付方式
					this.setPayChannelList();
				} else {
					if (this.isTeam) {
						$message.alert('团购人数已达到上限!');
					} else {
						if (res.msg) {
							this.$message.alert(res.msg);
						} else {
							this.$message.alert('下单失败');
						}
					}
				}
			});
		},
		// 设置支付方式，必须在syncContractState接口之后
		setPayChannelList() {
			http.post(
				this.contractBbillcode ? saveOrderToBatchPay : saveOrderToPay,
				this.contractBbillcode
					? {
							contractBbillcode: this.contractBbillcode
					  }
					: {
							contractBillcode: this.contractBillcode
					  }
			).then(res => {
				// 保存支付方式数据
				this.contMoney = res.contMoney;
				this.payChannelList = res.payChannelList;
				this.ptradeSeqno = res.ptradeSeqno;
				this.contractBlance = res.contractBlance;
				this.payJsons = res.payChannelList[1];
				this.current = res.payChannelList[1].fchannelCode;
				res.payChannelList &&
					res.payChannelList.forEach(el => {
						if (el.dicActorCode != 'BANK') {
							this.payType1 = el;

							if (this.faccountAmount == 0) {
								this.disabled = true;
								this.canChooseThird = false;
							} else {
								this.disabled = false;
								// this.canChooseThird = "true";
							}
							//订单金额小于账户余额
							if (this.payMessage.dataBmoney <= Number(el.faccountAmount)) {
								//走
								this.accountNeedPayMoney = this.payMessage.dataBmoney || 0;
								this.canChooseThird = true;
							} else {
								// 订单金额大于账户余额
								this.canChooseThird = false;
								this.accountNeedPayMoney = el.faccountAmount;
								this.needPayMoney = this.payMessage.dataBmoney - Number(el.faccountAmount);
								if (this.accountNeedPayMoney == 0) {
									this.disabled = true;
								}
							}
						}
					});
				// Object.assign(this.payJsons, {
				// 	faccountIdType: 'ACCOUNT',
				// 	orderAmount: this.payMessage.dataBmoney
				// });
			});
		},

		bindChoose(e) {
			this.current = e;
			console.log('eeeeeeee选择了',e);
			this.check = true;
			this.wechatcheck = true;
			this.payJsons = this.payChannelList.filter(i => i.fchannelCode == e)[0];
			Object.assign(this.payJsons, {
				faccountIdType: 'ACCOUNT',
				orderAmount: this.payMessage.dataBmoney
			});
		},
		// 立即支付
		paySubmit() {
			let payList = [];

			if (this.payTypecheck && !this.wechatcheck) {
				payList.push({
					faccountIdType: 'ACCOUNT',
					fchannelCode: this.payType1.fchannelCode,
					orderAmount: this.accountNeedPayMoney.toFixed(2),
					faccountId: this.payType1.faccountOuterNo
				});
			}
			if (this.wechatcheck && this.payTypecheck) {
				payList.push({
					faccountIdType: 'ACCOUNT',
					fchannelCode: this.payType1.fchannelCode,
					orderAmount: this.accountNeedPayMoney.toFixed(2),
					faccountId: this.payType1.faccountOuterNo
				});
				payList.push({
					faccountIdType: this.payJsons.faccountIdType,
					fchannelCode: this.payJsons.fchannelCode,
					orderAmount: this.needPayMoney.toFixed(2),
					faccountId: this.payJsons.faccountId
				});
			}
			if (!this.payTypecheck && this.wechatcheck) {
				payList.push({
					faccountIdType: this.payJsons.faccountIdType,
					fchannelCode: this.payJsons.fchannelCode,
					orderAmount: this.payMessage.dataBmoney.toFixed(2),
					faccountId: this.payJsons.faccountId
				});
			}
			// this.payJsons.faccountId = this.payJsons.faccountOuterNo
			// 判断是否满足支付时间

			// debugger
			if (this.payTypecheck && !this.wechatcheck) {
				if (this.payType1.faccountAmount == 0) {
					$message.alert('您的账户余额为零');
					return;
				}
				if (this.payType1.faccountAmount < this.payMessage.dataBmoney) {
					$message.alert('您的账户余额不足');
					return;
				}
				// #ifdef MP-WEIXIN||H5
				// this.pwdShow = true;
				$routers.push('pay/payPassword', {
					ptradeSeqno: this.ptradeSeqno,
					payCommitStr: JSON.stringify(this.payType1),
					contractBlance: this.contractBlance,
					contractBillcode: this.contractBillcode,
					contractBbillcode: this.contractBbillcode,
					money: this.payMessage.dataBmoney
				});
				// #endif
				// // #ifdef MP-ALIPAY || MP-TOUTIAO
				// $routers.push('pay/payPassword', {
				// 	ptradeSeqno: this.ptradeSeqno,
				// 	payCommitStr: JSON.stringify([this.payType1]),
				// 	contractBlance: this.contractBlance
				// });
				// // #endif
			}
			// 微信支付
			else if (this.wechatcheck) {
				console.log(payList, 66);

				// return
				let payparams = JSON.stringify(payList);
				http.post(paymentCommit, {
					ptradeSeqno: this.ptradeSeqno,
					payCommitStr: payparams,
					contractBlance: this.contractBlance
				}).then(res => {
					// #ifndef H5
					if (res && res.success) {
						let data = res.dataObj.requestData;
						let that = this;
						wx.requestPayment({
							timeStamp: data.timeStamp,
							nonceStr: data.nonceStr,
							package: data.package,
							signType: data.signType,
							paySign: data.paySign,
							success: function(res) {
								if (that.contractBillcode) {
									http.post(syncContractPayState, {
										contractBillcode: that.contractBillcode
									})
										.then(res => {
											if (res.success) {
												// 支付成功
												$storage.set('payContractBillcode', that.contractBillcode);
												that.$routers.push('/pages/paySuccess/paySuccess', {pageState: 0,contractBillcode: that.contractBillcode})
											} else {
												// uni.navigateTo()
											}
										})
										.catch(err => {
											$message.alert('支付失败！');
										});
								} else {
									http.post(syncContractBatchPayState, {
										contractBbillcode: that.contractBbillcode
									})
										.then(res => {
											if (res.success) {
												// 支付成功
												$storage.set('contractBbillcode', that.contractBbillcode);
												that.$routers.push('/pages/paySuccess/paySuccess', {pageState: 0,contractBbillcode: that.contractBbillcode,contractBillcode: that.contractBillcode})
											} else {
												// uni.navigateTo()
											}
										})
										.catch(err => {
											$message.alert('支付失败！');
										});
								}
							},
							fail: function(res) {
								$message.alert('支付失败！');
								//$routers.replace('pay/payFail')
							},
							complete: function(res) {}
						});
					}
					// #endif
					// #ifdef H5
					this.$storage.set("orderId", this.contractBillcode);
					console.log(res.dataObj,'res.dataObj==============')
					if (this.payJsons.fchannelCode === "alipaywap") {
						let v_html = document.getElementById("v_html");
						v_html.innerHTML = "<div>" + res.dataObj.htmlStr + "</div>";
						document.forms[0].submit() //重要，这个才是点击跳页面的核心
					} else {
						let v_html = document.getElementById("v_html");
						v_html.innerHTML = "<div>" + res.dataObj.htmlStr + "</div>";
						document.getElementById("paaspaysubmit").submit();
					}
					// #endif
				});
			} else {
				$message.alert('请选择支付方式！');
			}
		},
		// 货到付款
		waitSubmit() {}
	},
	watch: {
		payTypecheck(val) {
			if (val == true && this.canChooseThird == true) {
				this.wechatdisble = true;
			} else {
				this.wechatdisble = false;
			}
		},
		wechatcheck(val) {
			if (val == true && this.canChooseThird == true) {
				this.payTypedisbled = true;
			} else {
				this.payTypedisbled = false;
			}
		}
	}
};
</script>
<style lang="scss" scoped>
	#v_html {
		display: none;
	}
.pay-method {
	height: 100%;
	background-color: #f7f7f7;
}

.pay-header {
	width: 100%;
	padding: 0 24rpx;
	background: #ffffff;
	border-radius: 0px 0px 24rpx 24rpx;
	margin-bottom: 24rpx;

	&-success {
		&-tip {
			display: flex;
			height: 120rpx;
			align-items: center;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 700;
			color: $theme;
			border-bottom: 2rpx solid #f1f1f1;

			.iconfont {
				position: relative;
				top: 2rpx;
				font-size: 34rpx;
				font-weight: 700;
				margin-right: 16rpx;
			}
		}

		&-info {
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			height: 176rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
		}
	}
}

.pay-methods {
	width: 100%;
	background-color: #ffffff;
	padding: 46rpx 24rpx;
	border-radius: 24rpx;
	.payWay-method{
		display: flex;
		flex-direction: column;
		.method-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 52rpx;

			&:last-child {
				margin-bottom: 0;
			}

			image {
				width: 42rpx;
				height: 42rpx;
				margin-left: 4rpx;
				margin: 18rpx;
			}

			.name {
				margin-right: auto;
			}
		}
	}
}

.pay-immediately {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 24rpx;
	font-size: 32rpx;
	font-weight: 600;
	background-color: #ffffff;
	color: #000000;

	.all {
		margin-right: 10rpx;
	}

	.price {
		color: $theme;
		margin-right: auto;
	}

	.btn {
		width: 296rpx;
		height: 80rpx;
		background: #07c160;
		border-radius: 40rpx;
		font-size: 32rpx;
		font-weight: 600;
		color: #ffffff;
		line-height: 80rpx;
		letter-spacing: 1rpx;
		text-align: center;
	}

	.wait-btn {
		background-color: $theme;
	}
}
</style>

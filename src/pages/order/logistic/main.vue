<template>
	<div class="logistics">
		<div class="logistics-box">
			<view v-if="orderDetail.contractType=='40'">
				<div class="logistics-box-tit" v-if='orderDetail.goodsList'>
					<div class="logistics-box-tit-img">
						<img :src="checkImgUrl(orderDetail.goodsList[0].dataPic)" />
						<span>共{{ orderDetail.goodsList.length }}件商品</span>
					</div>
			
					<div class="logistics-box-tit-text">
						<!-- <p>物流状态：{{ wlStateInfor }}</p> -->
						<p>快递公司：{{ logisticList[0].expressName }}</p>
						<p>快递单号：{{ logisticList[0].expressCode }}</p>
						<p>快递凭证：<img class="contractEcurl" v-if="orderDetail.contractEcurl" :src="checkImgUrl(orderDetail.contractEcurl)"/></p>
					</div>
				</div>
			</view>
			<view v-else>
				<div class="logistics-box-tit" v-if='orderDetail.goodsList'>
					<div class="logistics-box-tit-img">
						<img :src="checkImgUrl(orderDetail.goodsList[0].dataPic)" />
						<span>共{{ orderDetail.goodsList.length }}件商品</span>
					</div>

					<div class="logistics-box-tit-text">
						<p>物流状态：{{ wlStateInfor }}</p>
						<p>快递公司：{{ orderDetail.packageList[0].expressName }}</p>
						<p>快递单号：{{ orderDetail.packageList[0].packageBillno }}</p>
						<p>快递凭证：<img class="contractEcurl" v-if="orderDetail.contractEcurl" :src="checkImgUrl(orderDetail.contractEcurl)"/></p>
					</div>
				</div>
			</view>
			<view class="timeLine" v-if="logisticList.length">
				<u-time-line>
					<u-time-line-item v-for="(item, index) in logisticList" :key="index">
						<!-- 此处没有自定义左边的内容，会默认显示一个点 -->
						<template v-slot:content>
							<view v-if="orderDetail.contractType=='40'">
								<view class="u-order-desc" :style="index == 0 ? 'color:#000000;' : ''">{{ item.AcceptStation }}</view>
								<view class="u-order-time" :style="index == 0 ? 'color:#000000;' : ''">{{ item.AcceptTime }}</view>
							</view>
							<view v-else>
								<view class="u-order-desc" :style="index == 0 ? 'color:#000000;' : ''">{{ item.context }}</view>
								<view class="u-order-time" :style="index == 0 ? 'color:#000000;' : ''">{{ item.ftime }}</view>
							</view>
						</template>
					</u-time-line-item>
				</u-time-line>
			</view>
			<div class="logistics-box-con" style="text-align:center" v-else>暂无物流信息</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { checkImgUrl } from '@/utils/checkImg.js';
import { getContractByCode, refund } from '@/api/interface.js';
export default {
	data() {
		return {
			checkImgUrl,
			wlStateInfor: '',
			orderDetail: {},
			logisticList: [],
			// wlState: ['暂无物流信息', '已收件', '在途中', '已签收', '问题件']
			wlState: ['在途', '揽收', '疑难', '签收', '退签','派件','退回','转单','待清关','已清关','清关异常','收件人拒签']
		};
	},
	onLoad(options) {
		http.get(getContractByCode, { contractBillcode: options.id }).then(res => {
			if (res) {
				this.orderDetail = res;
				if (this.orderDetail.contractType == 40) {
					this.getJdLogisticDetail()
				} else {
					this.getLogisticDetail();
				}
			}
		});
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods: {
		getJdLogisticDetail(){
			let params = {
				contractBillcode: this.orderDetail.contractBillcode,
				contractNbillcode: this.orderDetail.contractNbillcode,
				memberCode: this.orderDetail.memberCode,
				tenantCode: this.orderDetail.tenantCode,
				channelCode: 'jdvop',		
			}
			http.post(refund.getJDExpressPageForProp, params).then(res => {
				if (res && res.dataObj) {
					let dataObj = JSON.parse(res.dataObj);
					console.log(dataObj,'----------------')
					dataObj.map(item=>{
						item.AcceptStation =  item.sendgoodsLogMsg
						item.AcceptTime  = item.remark
					})
					this.logisticList = dataObj.reverse();
					console.log(this.logisticList,'-++++')
				}
			})
			
		},
		//普通商品物流
		getLogisticDetail() {
			let params = {
				expressType: this.orderDetail.packageList[0].expressCode,
				expressNo: this.orderDetail.packageList[0].packageBillno
			};
			http.get(refund.getExpressPageForProp, params).then(res => {
				if (res && res.dataObj) {
					let dataObj = JSON.parse(res.dataObj);
						this.logisticList = dataObj.data;
						this.wlStateInfor = this.wlState[dataObj.state];
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.timeLine {
	background-color: #ffffff;
	padding: 20rpx 40rpx;
	u-time-line-item {
		margin: 73rpx;
	}
	.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
	}

	.u-order-title {
		padding-bottom: 10rpx;
		color: #333333;
		font-weight: bold;
		font-size: 26rpx;
	}

	.u-order-desc {
		padding-bottom: 4rpx;
		color: rgb(150, 150, 150);
		font-size: 22rpx;
		margin-bottom: 6rpx;
	}

	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 22rpx;
	}
}
@import '@/common/css/common.less';
.logistics {
	&-box {
		// margin-top: 90rpx;
		background: @white-color;
		padding-top: 10rpx;
		&-tit {
			display: flex;
			align-items: center;
			padding: 42rpx 30rpx 40rpx 30rpx;
			border-bottom: 20rpx solid #fafafa;
			
			&-text {
				p {
					font-size: @big-title;
					&:nth-child(2) {
						padding: 10rpx 0;
					}
					&:nth-child(4) {
						display: flex;
					}
					.contractEcurl {
						width: 288rpx;
						height: 160rpx;
					}
				}
			}
			&-img {
				width: 130rpx;
				height: 130rpx;
				position: relative;
				margin-right: 25rpx;
				img {
					width: 100%;
					height: 100%;
				}
				span {
					display: inline-block;
					width: 130rpx;
					height: 28rpx;
					font-size: 20rpx;
					text-align: center;
					line-height: 28rpx;
					color: @white-color;
					background: rgba(0, 0, 0, 0.3);
					position: absolute;
					left: 0;
					bottom: 0;
				}
			}
		}
	}
}
</style>

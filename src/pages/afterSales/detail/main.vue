<template>
	<view class="detail u-skeleton">
		<view class="detail--state">
			<view class="detail--state--left u-skeleton-rect">
				<image src="../../../static/teaImg/cuowu.png" v-if="goodsDetail.dataState === 6"></image>
				<image src="../../../static/teaImg/tongguo.png" v-else></image>
			</view>
			<view class="detail--state--center u-skeleton-rect">
				<view class="detail--state--center--top u-skeleton-rect" v-if="goodsDetail.dataState === 0">处理中 申请成功,等待系统审核</view>
				<view class="detail--state--center--top u-skeleton-rect" v-else-if="goodsDetail.dataState === 1">处理中 系统审核通过</view>
				<view class="detail--state--center--top u-skeleton-rect"
					v-else-if="goodsDetail.dataState === 1&&this.deepGoodsDetail.goodsType=='40'">处理中 请等待京东审核</view>
				<view class="detail--state--center--top u-skeleton-rect"
					v-else-if="goodsDetail.dataState === 14&&this.deepGoodsDetail.goodsType=='40'">处理中 京东确认收货</view>
				<view class="detail--state--center--top u-skeleton-rect" v-else-if="goodsDetail.dataState === 2">处理中 等待卖家收货</view>
				<view class="detail--state--center--top u-skeleton-rect" v-else-if="goodsDetail.dataState === 3">处理中 等待商家退款</view>
				<view class="detail--state--center--top u-skeleton-rect" v-else-if="goodsDetail.dataState === 4">处理中 系统处理中</view>
				<view class="detail--state--center--top u-skeleton-rect"
					v-else-if="goodsDetail.dataState === 15&&this.deepGoodsDetail.goodsType=='40'">处理中 京东处理中</view>
				<view class="detail--state--center--top u-skeleton-rect" v-else-if="goodsDetail.dataState === 6">完成 商家已拒绝</view>
				<view class="detail--state--center--top u-skeleton-rect"
					v-else-if="goodsDetail.dataState === -2&&this.deepGoodsDetail.goodsType=='40'">完成 京东已拒绝</view>
				<view class="detail--state--center--top u-skeleton-rect" v-else-if="goodsDetail.dataState === 8">完成 服务已完成,感谢您对我们的支持
				</view>
				<view class="detail--state--center--top u-skeleton-rect" v-else>已撤销 用户撤销申请</view>
				<view class="detail--state--center--bottom u-skeleton-rect">{{ goodsDetail.gmtModified | timeFilter }}</view>
			</view>
			<view class="detail--state--right u-skeleton-rect" v-if="goodsDetail.dataState==0"><button type="default"
					@click="openRevoke">撤销申请</button></view>

			<view>
				<u-modal v-model="revokeShow" :content="revokeContent" :mask-close-able="true"
					:show-cancel-button="true" @confirm="revoke"></u-modal>
			</view>
		</view>

		<!-- #ifndef H5 -->
		<view class="detail--error" v-if="goodsDetail.dataState == 6">
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="detail--error" v-show="goodsDetail.dataState == 6">
		<!-- #endif -->
			<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/shenheshibai.png"></image>
		</view>

		<!-- #ifndef H5 -->
		<view class="detail--explain" v-else>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="detail--exp2lain" v-show="goodsDetail.dataState != '6'">
		<!-- #endif -->
			<view class="detail--explain--title u-skeleton-rect">退款信息</view>
			<view class="detail--explain--show">
				<view class="detail--explain--show--left u-skeleton-rect">
					<image :src="deepGoodsDetail.dataPic | urlFilter"></image>
				</view>
				<view class="detail--explain--show--right">
					<view class="detail--explain--show--right--top u-skeleton-rect">{{ $$placeholder(deepGoodsDetail.goodsName,loading,20) }}</view>
					<view class="detail--explain--show--right--bottom u-skeleton-rect">{{ $$placeholder(deepGoodsDetail.skuName,loading,10) }}</view>
				</view>
			</view>
			<view class="detail--explain--reason u-skeleton-rect">退款原因：{{ $$placeholder(goodsDetail.refundEx,loading,10) }}</view>
			<view class="detail--explain--money u-skeleton-rect">退款金额：¥{{ $$placeholder(goodsDetail.refundMoney,loading,5) }}</view>
			<view class="detail--explain--num u-skeleton-rect">退款数量：{{ $$placeholder(deepGoodsDetail.refundGoodsNum,loading,5) }}</view>
			<view class="detail--explain--time u-skeleton-rect">申请时间：{{ goodsDetail.gmtCreate | timeFilter }}</view>
			<view class="detail--explain--code u-skeleton-rect">退款编号：{{ $$placeholder(goodsDetail.refundCode,loading,20) }}</view>
			<view class="detail--explain--code u-skeleton-rect">申请原因：{{ $$placeholder(goodsDetail.refundMeo,loading,10) }}</view>

			<!-- #ifndef H5 -->
			<view class="detail--explain--back" v-if="!(goodsDetail.refundType == 'B01' || goodsDetail.refundType == 'JDB01')">
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="detail--explain--back" v-show="!(goodsDetail.refundType == 'B01' || goodsDetail.refundType == 'JDB01')">
			<!-- #endif -->
				<view class="detail--explain--back--top u-skeleton-rect">取件方式: 上门取件</view>
				<view class="detail--explain--back--bottom u-skeleton-rect">
					<view class="detail--explain--back--bottom--one u-skeleton-rect">取件信息: {{ $$placeholder(goodsDetail.goodsReceiptMem,loading,10) }}
						{{ $$placeholder(goodsDetail.goodsReceiptPhone,loading,10) }}
					</view>
					<view class="detail--explain--back--bottom--two u-skeleton-rect">{{ $$placeholder(goodsDetail.goodsReceiptArrdess,loading,10)}}</view>
					<view class="detail--explain--back--bottom--three u-skeleton-rect">
						<image @click="previewImage(item, ocRefundFileList)"
							class="detail--explain--back--bottom--three--img u-skeleton-rect" style="width: 120rpx; height: 120rpx;"
							:src="item" v-for="(item,index) in ocRefundFileList" :key='index'></image>
					</view>
				</view>
			</view>
		</view>
		<view class="store_message u-skeleton-rect" v-if="goodsDetail.refundType=='B02'&&goodsDetail.dataState>0">
			<view class="title u-skeleton-rect">商家信息</view>
			<view class="store_item u-skeleton-rect">
				<view class="item_left u-skeleton-rect">联系人</view>
				<view class="item_right u-skeleton-rect">{{$$placeholder(goodsDetail.goodsReceiptMem,loading,15)}}</view>
			</view>
			<view class="store_item u-skeleton-rect">
				<view class="item_left u-skeleton-rect">手机号</view>
				<view class="item_right u-skeleton-rect">{{$$placeholder(goodsDetail.goodsReceiptPhone,loading,20)}}</view>
			</view>
			<view class="store_item u-skeleton-rect">
				<view class="item_left u-skeleton-rect">商家地址</view>
				<view class="item_right u-skeleton-rect">{{$$placeholder(goodsDetail.goodsReceiptArrdess,loading,20)}}</view>
			</view>
		</view>
		<view class="store_message u-skeleton-rect" v-if="goodsDetail.refundType=='B02'&&goodsDetail.dataState==1">
			<view class="store_top u-skeleton-rect">
				<view class="store_title u-skeleton-rect">填写快递信息</view>
				<view class="submit_button u-skeleton-rect" @click="saveLogistic()">提交</view>
			</view>

			<picker :range="logisticList" @change="changeLogistic"  @cancel="cancelLogistic">
				<view class="store_item u-skeleton-rect">
					<view class="item_left u-skeleton-rect">快递公司</view>
					<view class="item_right u-skeleton-rect" v-if="current!==null">{{logisticList[current]}}</view>
					<view class="item_right u-skeleton-rect" v-else>请选择快递公司</view>
					<view class="iconfont icon-gengduo1 u-skeleton-rect"></view>
				</view>
			</picker>
			<view class="store_item u-skeleton-rect">
				<view class="item_left u-skeleton-rect">快递单号</view>
				<input class="item_right u-skeleton-rect" placeholder="输入快递单号" placeholder-style="color:#A5A5A5;font-size: 24rpx;"
					v-model="packageNo" />
			</view>
		</view>
		<u-skeleton :loading="loading" v-show="loading" :animation="true" bgColor="#FFF"></u-skeleton>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {
		refund
	} from '@/api/interface.js';
	import {
		afterService
	} from '@/api/newApi.js';
	import {
		$message,
	} from '@/utils/prototype/vue.js';
	import {
		timestampToTime
	} from '@/utils/formate.js';
	import url from '@/api/configCheck.js'
	import moment from 'moment';

	export default {
		data() {
			return {
				// 服务单号
				refundCode: '',
				loading: true,
				//退单详情
				goodsDetail: {},

				//深入数据
				deepGoodsDetail: {},
				ocRefundFileList: [],
				backShow: true,

				//撤销申请的模态框
				revokeShow: false,

				//模态框信息
				revokeContent: '您确定要撤销申请吗?',
				logisticList: [],
				current: '',
				packageNo: '',
				isGo: false
			};
		},

		onLoad(e) {
			this.refundCode = e.refundCode;
			this.getLogisticList()
			this.getRefundDetail()
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		methods: {
			previewImage(e, es) {
				uni.previewImage({
					urls: es, //需要预览的图片http链接列表，注意是数组
					current: e, // 当前显示图片的http链接，默认是第一个
				})
			},
			disNone(){
				// #ifdef H5
				let dom1 = document.querySelectorAll('.uni-picker-content');
				for (var i = 0; i < dom1.length; i++) {
					dom1[0].style.display = 'none'
				}
				// #endif
			},
			getRefundDetail() {
				http.post(afterService.serviceDetail, {
					refundCode: this.refundCode
				}).then(res => {
					this.loading = false
					this.goodsDetail = res;
					this.deepGoodsDetail = res.ocRefundGoodsList[0];
					this.ocRefundFileList = res.ocRefundFileList.map(item => {
						return item.refundFileUrl
					})
					console.log(this.ocRefundFileList, 'this.ocRefundFileList')
				});
			},
			saveLogistic() {

				if (this.current==null || this.packageNo == '') {
					$message.alert("请填写物流信息")
					return;
				}
				if (this.isGo) {
					$message.alert("请勿重复提交！")
					return;
				}
				this.isGo = true
				let params = {
					refundCode: this.goodsDetail.refundCode,
					packageName: this.logisticList[this.current],
					packageBillno: this.packageNo
				}


				http.post(refund.sendGoods, params).then(res => {

					if (!res.success) {
						this.$message.alert(res.msg)
						this.isGo = false
						return
					}
					if (res.success) {
						this.$message.alert('操作成功')
						this.getRefundDetail()
						this.isGo = false
					}
					// #ifdef H5
					this.$routers.refresh()
					// #endif
				});
			},
			changeLogistic(e) {
				this.current = e.detail.value
				this.disNone()
			},
			cancelLogistic() {
				this.disNone()
			},
			//获取物流公司
			getLogisticList() {
				http.post(refund.queryExpressPageForProp).then(res => {
					this.logisticList = res.rows.map(item => item.expressName)
				});

			},
			//撤销申请弹框
			openRevoke() {
				this.revokeShow = true;
			},

			//撤销申请
			revoke() {
				http.post(afterService.revokeApply, {
					refundCode: this.refundCode,
					goodsCode: this.deepGoodsDetail.goodsCode
				}).then(res => {
					console.log(res);
				});
			}
		},

		filters: {
			//时间格式处理
			timeFilter(val, str = 'YYYY-MM-DD hh:mm:ss') {
				// moment(val).format(str)
				return timestampToTime(val);
			}
		}
	};
</script>

<style lang="scss" scoped>
	.store_message {
		margin-top: 24rpx;
		padding: 24rpx;
		background-color: #fff;

		border-radius: 12px;

		.title {
			padding-bottom: 24rpx;
			font-weight: bold;
			font-size: 28rpx;
			color: #000;
			border-bottom: 2rpx solid#F1F1F1;
		}

		.store_top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2rpx solid#F1F1F1;
			padding-bottom: 24rpx;

			.store_title {
				font-weight: bold;
				font-size: 28rpx;
				color: #000;
			}

			.submit_button {
				width: 96rpx;
				height: 40rpx;
				text-align: center;
				line-height: 40rpx;
				background: $theme;
				border-radius: 24rpx;
				color: #fff;
				font-size: 24rpx;
			}
		}

		.store_item {
			line-height: 72rpx;
			display: flex;
			border-bottom: 2rpx solid#F1F1F1;

			.item_left {
				/* #ifndef H5 */
				width: 100rpx;
				/* #endif */
				/* #ifdef H5 */
				width: 130rpx;
				/* #endif */
				color: #333;
				font-size: 24rpx;
			}

			.item_right {
				color: #a5a5a5;
				font-size: 24rpx;
				margin-left: 24rpx;
				flex: 1;
			}

			input {
				height: 72rpx;
				line-height: 72rpx;
			}
		}
	}

	.detail {
		background-color: #f5f5f5;
		/* #ifndef H5 */
		padding-bottom: 40rpx;
		/* #endif */
		/* #ifdef H5 */
		height: 100vh;
		/* #endif */

		&--title {
			width: 100%;
			height: 176rpx;
			background-color: #fff;
			position: relative;
			padding-top: 108rpx;
			text-align: center;

			text {
				color: #000;
				font-size: 32rpx;
				position: absolute;
				top: 111rpx;
				left: 34rpx;
			}

			view {
				font-size: 34rpx;
				color: #000;
			}
		}

		&--state {
			width: 100%;
			height: 160rpx;
			padding: 0 24rpx;
			background-color: #fff;
			border-radius: 0 0 24rpx 24rpx;
			display: flex;
			margin-bottom: 24rpx;

			&--left {
				width: 48rpx;
				margin-right: 16rpx;
				padding-top: 18rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}
			}

			&--center {
				flex: 1;
				height: 160rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;

				&--top {
					font-size: 32rpx;
					color: #333;
				}

				&--bottom {
					font-size: 28rpx;
					color: #333;
				}
			}

			&--right {
				width: 144rpx;
				height: 160rpx;
				padding-bottom: 24rpx;
				display: flex;
				align-items: flex-end;

				button {
					width: 144rpx;
					height: 48rpx;
					border-radius: 24rpx;
					font-size: 24rpx;
					color: #333;
					background-color: #fff;
					border: 2rpx solid #f1f1f1;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}

		&--explain {
			width: 100%;
			border-radius: 24rpx;
			background-color: #fff;
			padding: 0 24rpx;

			&--title {
				padding: 24rpx 0;
				font-size: 28rpx;
				color: #333;
				border-bottom: 2rpx solid #f1f1f1;
				margin-bottom: 24rpx;
			}

			&--show {
				display: flex;
				margin-bottom: 24rpx;

				&--left {
					width: 120rpx;
					height: 120rpx;
					margin-right: 24rpx;

					image {
						width: 120rpx;
						height: 120rpx;
					}
				}

				&--right {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					&--top {
						font-size: 28rpx;
						color: #333;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						/* 自定义的行数 */
						overflow: hidden;
					}

					&--bottom {
						font-size: 24rpx;
						color: #a5a5a5;
					}
				}
			}

			&--reason,
			&--money,
			&--num,
			&--time,
			&--code {
				font-size: 24rpx;
				color: #333;
				padding-bottom: 24rpx;
			}

			&--back {
				padding: 24rpx 0;
				border-top: 2rpx solid #f1f1f1;

				&--top {
					font-size: 24rpx;
					color: #333;
					margin-bottom: 24rpx;
				}

				&--bottom {
					&--one {
						font-size: 24rpx;
						color: #333;
						margin-bottom: 8rpx;
					}

					&--two {
						font-size: 24rpx;
						color: #a5a5a5;
						padding-left: 108rpx;
					}

					&--three {
						display: flex;
						flex-wrap: wrap;
						margin-left: 15vw;
						&--img {
							padding: 5rpx;
							border-radius: 10rpx;
						}
					}
				}
			}
		}

		&--error {
			image {
				margin: 100rpx 55rpx;
			}
		}
	}
</style>

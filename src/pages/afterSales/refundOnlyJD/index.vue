<template>
	<view class="sales-back">
		<!-- 申请商品 -->
		<view class="back-goods">
			<view class="service-tag">
				本次售后服务由
				<text>商家</text>
				提供
			</view>
			<view class="sales-message">
				<image class="sales-image" :src="checkImgUrl(goodDetail.dataPic)"></image>
				<view class="sales-desc">
					<view class="sales-title">{{ goodDetail.goodsName }}</view>
					<view class="sales-import">
						<view class="sales-price">单价：¥{{ goodDetail.pricesetNprice }}</view>
						<view class="sales-num">购买数量：{{ goodDetail.goodsNum }}</view>
					</view>
				</view>
			</view>
			<view class="back-goods-num">
				<text class="title">申请数量</text>
				<view class="step"><u-number-box :min="1" :max="goodDetail.goodsNum" :size="24" v-model="refundPolicy.refundGoodsNum"></u-number-box></view>
			</view>
		</view>

		<!-- 申请原因 -->
		<view class="back-results">
			<view class="back-results-top" @click="reasonsApplicationShow = true">
				<text class="title">申请原因</text>
				<text class="select">{{ refundPolicy.refundEx || '选择申请原因' }}</text>
			</view>
			<view class="back-results-middle">
				<u-input
					class="text-box"
					v-model="refundPolicy.refundMeo"
					:clearable="false"
					type="textarea"
					placeholder="请描述申请售后服务的具体原因。"
					height="172"
					maxlength="500"
				/>
				<view class="total-length">{{ refundPolicy.refundMeo.length }}/500</view>
			</view>
			<view class="back-results-bottom">
				<view class="upload-box">
					<view class="img-item" v-for="item in upImg" :key="item">
						<image :src="item" mode=""></image>
						<view class="close" @click="delImg(item)"><i class="iconfont">&#xe609;</i></view>
					</view>
					<view class="img-item last-item" v-if="upImg.length < 9" @click="chooseImage">
						<i class="iconfont">&#xe620;</i>
						<text>{{ upImg.length }}/9</text>
						<text class="most">(最多9张)</text>
					</view>
					<view class="img-item"></view>
					<view class="img-item"></view>
				</view>
				<view class="tip">为了更好的解决问题，请务必上传有效凭证。</view>
			</view>
		</view>

		<!-- 退款方式 -->
		<view class="back-method">
			<text class="title">退款方式</text>
			<view class="select">原支付返还</view>
		</view>

		<!-- 提交按钮 -->
		<view class="submit"><view @click="submitAfterSales">提交</view></view>

		<!-- 申请原因弹出框 -->
		<view class="detail--reasonsApplication">
			<u-popup v-model="reasonsApplicationShow" mode="bottom" width="100%" height="40%" border-radius="24" closeable="true">
				<view class="detail--reasonsApplication--main">
					<view class="detail--reasonsApplication--main--position">申请原因</view>
					<u-radio-group wrap="true" active-color="red" v-model="refundPolicy.refundEx">
						<view class="method" v-for="item in refundCauseList" :key="item.flagSettingId"  @click="refundPolicy.refundEx=item.flagSettingInfo;reasonsApplicationShow=false">
							<text class="name">{{ item.flagSettingInfo }}</text>
							<u-radio label-size="28" :name="item.flagSettingInfo" class="radioSelect"></u-radio>
						</view>
					</u-radio-group>
				</view>
			</u-popup>
		</view>

	</view>
</template>

<script>
import http from '@/api/http.js';
import { checkImgUrl } from '@/utils/checkImg.js';
import { uploadGoodsFile, refund, addressList } from '../../../api/interface.js';
import { domain } from '@/api/configCheck.js'
export default {
	data() {
		return {
			checkImgUrl,
			upImg: [], // 图片凭证
			goodDetail: {}, // 商品详情
			reasonsApplicationShow: false, // 申请原因弹窗

			refundCauseList: [], // 退货原因列表
			// 退货说明
			refundPolicy: {
				contractGoodsCode: '', // 商品id
				goodsCamount: '', // 商品数量

				refundGoodsNum: '', // 退款商品的数量
				// refundGoodsAmt: '', // 退款金额
				contractBillcode: '', // 订单号
				refundMoney: '', // 退款金额
				refundEx: '', // 退款理由
				refundMeo: '', // 退款描述
				refundFileUrl: '', // 退款图片
				refundType: '' // 退款类型
			}
		};
	},
	onLoad(options) {
		this.goodDetail = JSON.parse(options.detail);
		console.log(this.goodDetail,'xianging')
		this.getRefCause();
		// 商品id
		this.refundPolicy.contractGoodsCode = this.goodDetail.goodsCode;
		// 退款商品数量
		this.refundPolicy.refundGoodsNum = this.goodDetail.goodsNum;
		// 商品数量
		this.refundPolicy.goodsCamount = this.goodDetail.goodsNum;
		// 订单号
		this.refundPolicy.contractBillcode = this.goodDetail.contractBillcode;
		// 退款金额
		this.refundPolicy.refundMoney = this.goodDetail.goodsNum * this.goodDetail.pricesetNprice;
		// 退款类型
		this.refundPolicy.refundType = this.goodDetail.refundType;
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	watch: {
		// 提交的图片地址
		upImg(newValue) {
			this.refundPolicy.refundFileUrl = newValue.join(',');
		},
		// 监听退款商品的数量  判断退款的钱数
		'refundPolicy.refundGoodsNum': {
			handler(newValue) {
				this.refundPolicy.refundMoney = this.goodDetail.goodsNum * this.goodDetail.pricesetNprice;
			}
		}
	},

	methods: {
		// 选择图片
		chooseImage(e) {
			var that = this;
			uni.chooseImage({
				count: 9 - this.upImg.length, //一次最多可以选择的图片张数
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success(res) {
					res.tempFilePaths.forEach((val, i) => {
						that.upLoad(val); //上传操作
					});
				},
				fail: function() {
					that.$message.alert('上传失败')
				}
			});
		},
		// 上传图片
		upLoad(imgFilePaths) {
			var that = this;
			//上传文件
			uni.uploadFile({
				url: domain + uploadGoodsFile,
				filePath: imgFilePaths,
				name: 'file',
				// #ifndef H5
				header: {
					'Content-Type': 'multipart/form-data',
					cookie: uni.getStorageSync('miniToken') + '=' + uni.getStorageSync('sessionid'),
					'saas-Agent': getApp().globalData.saasAgent
				},
				// #endif
				success(res) {
					// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
					let file = JSON.parse(res.data).fileUrl;
					if (!RegExp(/http/).test(file)) {
						file = that.$imgDomain + file;
					}
					that.upImg.push(file);
				},
				fail(res) {
					console.log('上传失败');
				}
			});
		},
		// 删除图片
		delImg(item) {
			this.upImg = this.upImg.filter(el => el !== item);
		},
		// 获取退货原因
		getRefCause() {
			http.post(refund.queryRefCause).then(res => {
				if (res && !res.success) {
					this.refundCauseList = res;
				}
			});
		},
		// 提交售后
		submitAfterSales() {
			if(!this.refundPolicy.refundEx){
				this.$message.alert('请选择申请原因')
				return
			}
			let query = {
				contractBillcode:this.goodDetail.contractBillcode,
				refundMoney:this.goodDetail.contractGoodsMoney,
				refundMeo:this.refundPolicy.refundMeo,
				refundEx:this.refundPolicy.refundEx,
				ocRefundFileDomainList:[],
				refundType:'JDB01'
			}
			let arr = []
			arr.push({
				
				// 商品contractGoodsCode
				contractGoodsCode: this.goodDetail.contractGoodsCode,
				// 购买数量
				goodsCamount: this.goodDetail.goodsCamount,
				// 退款数量
				refundGoodsNum: this.refundPolicy.refundGoodsNum,
				// 退款金额
				refundGoodsAmt: this.refundPolicy.refundGoodsNum == this.goodDetail.goodsCamount ? this.goodDetail.contractGoodsMoney : (this.goodDetail.contractGoodsPrice * this.refundPolicy.refundGoodsNum).toFixed(2),
			})
			 
			  query.ocRefundGoodsBeanList = arr
			
			http.post(refund.saveRefund, {params:JSON.stringify(query)}).then(res => {
				if(res.success){
					this.$message.alert('申请成功')
					setTimeout(()=>{
						this.$routers.back()
					},800)
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.sales-back {
	min-height: 100%;
	background-color: #f7f7f7;
	margin-bottom: 200rpx;
}
.title {
	font-size: 28rpx;
	font-weight: 500;
	color: #000000;
}
.select {
	font-size: 24rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #999999;
	margin: 0 24rpx 0 auto;
}
.back-goods {
	padding: 0 24rpx;
	border-radius: 0px 0px 24rpx 24rpx;
	background-color: #ffffff;
	margin-bottom: 24rpx;
	.service-tag {
		width: 252rpx;
		height: 36rpx;
		border-radius: 18rpx;
		color: #a5a5a5;
		font-size: 20rpx;
		text-align: center;
		line-height: 36rpx;
		background: #f4f4f4;
		margin: 12rpx auto;
		text {
			color: #db2330;
		}
	}
	.sales-message {
		box-sizing: border-box;
		width: 100%;
		padding: 24rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;

		.sales-image {
			width: 120rpx;
			height: 120rpx;
			background: #f5f5f5;
			border-radius: 6rpx;
		}
		.sales-desc {
			flex: 1;
			box-sizing: border-box;
			padding-left: 24rpx;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			.sales-title {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			.sales-import {
				display: flex;
				justify-content: flex-start;
				.sales-num {
					margin-left: 32rpx;
				}
			}
		}
	}
	&-num {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		.step {
			v-deep input {
				width: 80rpx;
				height: 40rpx !important;
				background: #f6f6f6 !important;
				border-radius: 10rpx !important;
			}
			v-deep view {
				background-color: #ffffff !important;
				font-weight: 700 !important;
			}
		}
	}
}

.back-results {
	background: #ffffff;
	border-radius: 24rpx;
	padding: 0 24rpx;
	margin-bottom: 24rpx;
	&-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		border-bottom: 2rpx solid #f1f1f1;
	}
	&-middle {
		position: relative;
		padding: 24rpx 0;
		.text-box {
			border-radius: 12rpx;
			v-deep textarea {
				padding: 24rpx !important;
				font-size: 20rpx !important;
				background: #f7f7f7 !important;
				border-radius: 12rpx !important;
			}
		}
		.total-length {
			position: absolute;
			bottom: 30rpx;
			right: 24rpx;
			font-size: 24rpx;
			font-weight: bold;
			color: #999999;
		}
	}
	&-bottom {
		.upload-box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.img-item {
				position: relative;
				width: 158rpx;
				height: 158rpx;
				background: #f7f7f7;
				border-radius: 12rpx;
				overflow: hidden;
				margin-bottom: 24rpx;
				image {
					width: 100%;
					height: 100%;
				}
				&:nth-last-child(-n + 2) {
					height: 0;
					padding: 0;
					margin: 0;
				}
				&:nth-last-child(-n + 6) {
					margin-bottom: 0;
				}
				.close {
					position: absolute;
					right: 0;
					top: 0;
					width: 32rpx;
					height: 32rpx;
					background: rgba(0, 0, 0, 0.2);
					border-radius: 0px 12rpx 0px 12rpx;
					.iconfont {
						font-size: 15rpx;
						color: #fff;
						text-align: center;
						line-height: 32rpx;
					}
				}
			}
			.last-item {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				font-size: 24rpx;
				font-weight: bold;
				color: #999999;
				line-height: 30rpx;
				.iconfont {
					font-size: 70rpx;
					line-height: 70rpx;
				}
				.most {
					font-size: 20rpx;
				}
			}
		}
		.tip {
			height: 68rpx;
			line-height: 68rpx;
			font-size: 20rpx;
			color: $theme;
		}
	}
}
.back-method {
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 82rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
}

.back-pick {
	padding: 0 24rpx;
	border-radius: 24rpx;
	background-color: #ffffff;
	margin-bottom: 24rpx;
	&-top,
	&-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
	}
	&-top {
		border-bottom: 2rpx solid #f1f1f1;
	}
	&-bottom {
		border-top: 2rpx solid #f1f1f1;
	}
	&-middle {
		padding: 24rpx 0;
		.title {
			margin-bottom: 16rpx;
		}
		.address {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.info {
			font-size: 24rpx;
			color: #333333;
		}
		.other {
			margin-bottom: 11rpx;
		}
		.name {
			margin-right: 11rpx;
		}
		i {
			font-size: 20rpx;
			font-weight: 700;
		}
	}
}

.back-receiving {
	padding: 0 24rpx;
	border-radius: 24rpx;
	background-color: #ffffff;
	margin-bottom: 24rpx;
	&-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 88rpx;
		border-bottom: 2rpx solid #f1f1f1;
	}
	&-address {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 24rpx 0;
		.info {
			font-size: 24rpx;
			color: #333333;
		}
		.other {
			margin-bottom: 11rpx;
		}
		.name {
			margin-right: 11rpx;
		}
	}
	i {
		font-size: 20rpx;
		font-weight: 700;
	}
}

// 提交
.submit {
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100rpx;
	background-color: #ffffff;
	z-index: 99;
	view {
		width: 702rpx;
		height: 80rpx;
		background: $theme;
		border-radius: 40rpx;
		font-size: 24rpx;
		font-weight: 600;
		color: #ffffff;
		text-align: center;
		line-height: 80rpx;
	}
}

// 弹窗公共样式
.method {
	width: 100%;
	height: 108rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-bottom: 1rpx solid #f1f1f1;
	&:last-child {
		border-bottom: 0;
	}
	.name {
		margin-right: auto;
	}
	.radioSelect {
		position: relative;
		left: 30rpx;
	}
}

// 申请原因弹框
.detail--reasonsApplication {
	&--main {
		width: 100%;
		padding: 24rpx 24rpx 0;
		&--position {
			font-size: 32rpx;
			color: #000;
			text-align: center;
			margin-bottom: 20rpx;
		}
	}
}

// 地址弹出框
.detail--addressPopup {
	&--main {
		width: 100%;
		padding: 24rpx 24rpx 0;
		border-bottom: 1rpx solid #f1f1f1;

		&--position {
			font-size: 32rpx;
			color: #000;
			text-align: center;
		}
	}

	&--shop {
		width: 100%;
		background-color: #fff;
		padding: 8rpx 24rpx 0;
		display: flex;
		justify-content: space-between;
		position: absolute;
		bottom: 10rpx;
		&--aside {
			width: 100%;
			height: 80rpx;
			border-radius: 40rpx;
			font-size: 24rpx;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: $theme;
		}

		&--shopping {
			background-color: #f8a732;
		}
	}
}
</style>

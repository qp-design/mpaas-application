<template>
	<view class="sales-back">
		<!-- 申请商品 -->
		<view class="back-goods">
			<view class="service-tag">
				本次售后服务由
				<text>京东</text>
				提供
			</view>
			<view class="sales-message">
				<image class="sales-image" :src="goodDetail.dataPic | urlFilter"></image>
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

		<!-- 取件方式 -->
		<view class="back-pick" v-if="saleType != '退款'">
			<view class="back-pick-top" @click="pickMethodShow = true">
				<text class="title">取件方式</text>
				<text class="select">上门取件</text>
			</view>
			<view class="back-pick-middle">
				<view class="title">取件地址</view>
				<view class="address" @click="pickAddressShow = true">
					<view class="info" v-if="JSON.stringify(pickAddress) == '{}'">暂无地址</view>
					<view class="info" v-else>
						<view class="other">
							<text class="name">{{ pickAddress.addressMember }}</text>
							<text>{{ pickAddress.addressPhone }}</text>
						</view>
						<view>{{ pickAddress.provinceName }}{{ pickAddress.cityName }}{{ pickAddress.areaName }}{{ pickAddress.addressDetail }}</view>
					</view>
					<i class="iconfont">&#xe61d;</i>
				</view>
			</view>
		</view>
		
		<!-- 收货地址 -->
		<view class="back-receiving" v-if="saleType != '退款'">
			<view class="back-receiving-top">
				<text class="title">收货地址</text>
				<text class="select">与取件地址保持一致</text>
				<u-switch :size="30" v-model="receiving" :active-color="$theme"></u-switch>
			</view>
			<view class="back-receiving-address" v-if="!receiving" @click="receivingAddressShow = true">
				<view class="info">
					<view class="info" v-if="JSON.stringify(receivingAddress) == '{}'">暂无地址</view>
					<view class="other" v-else>
						<text class="name">{{ receivingAddress.addressMember }}</text>
						<text>{{ receivingAddress.addressPhone }}</text>
					</view>
					<view>{{ receivingAddress.provinceName }}{{ receivingAddress.cityName }}{{ receivingAddress.areaName }}{{ receivingAddress.addressDetail }}</view>
				</view>
				<i class="iconfont">&#xe61d;</i>
			</view>
		</view>
		
		<!-- 返件方式 -->
		<view class="back-pick" v-if="saleType != '退款'">
			<view class="back-pick-top" @click="ReturnShow = true">
				<text class="title">返件方式</text>
				<text class="select" v-if="returnWareType == 10">自营配送</text>
				<text class="select" v-else>第三方配送</text>
			</view>
			<view class="back-pick-middle">
				<view class="title">返件地址</view>
				<view class="address" @click="returnWareShow = true">
					<view class="info" v-if="JSON.stringify(returnWare) == '{}'">暂无地址</view>
					<view class="info" v-else>
						<view class="other">
							<text class="name">{{ returnWare.addressMember }}</text>
							<text>{{ returnWare.addressPhone }}</text>
						</view>
						<view>{{ returnWare.provinceName }}{{ returnWare.cityName }}{{ returnWare.areaName }}{{ returnWare.addressDetail }}</view>
					</view>
					<i class="iconfont">&#xe61d;</i>
				</view>
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

		<!-- 取件方式弹出框 -->
		<view class="detail--reasonsApplication">
			<u-popup v-model="pickMethodShow" mode="bottom" width="100%" height="40%" border-radius="24" closeable="true">
				<view class="detail--reasonsApplication--main">
					<view class="detail--reasonsApplication--main--position">取件方式</view>
					<u-radio-group wrap="true" active-color="red" v-model="refundPolicy.refundEx">
						<view class="method">
							<text class="name">取件方式</text>
							<u-radio label-size="28" name="0" class="radioSelect"></u-radio>
						</view>
					</u-radio-group>
				</view>
			</u-popup>
		</view>
		
		<!-- 反件方式弹出框 -->
		<view class="detail--reasonsApplication">
			<u-popup v-model="ReturnShow" mode="bottom" width="100%" height="40%" border-radius="24" closeable="true">
				<view class="detail--reasonsApplication--main">
					<view class="detail--reasonsApplication--main--position">返件方式</view>
					<u-radio-group wrap="true" active-color="red" v-model="returnWareType">
						<view class="method">
							<text class="name">自营配送</text>
							<u-radio label-size="28" name="10" class="radioSelect"></u-radio>
						</view>
						<view class="method">
							<text class="name">第三方配送</text>
							<u-radio label-size="28" name="20" class="radioSelect"></u-radio>
						</view>
					</u-radio-group>
				</view>
			</u-popup>
		</view>
		
		<!-- 取货地址 -->
		<view class="detail--addressPopup">
			<u-popup v-model="pickAddressShow" mode="bottom" width="100%" height="996rpx" border-radius="24" closeable="true">
				<view class="detail--addressPopup--position">配送至</view>
				<scroll-view scroll-y class="detail--addressPopup--main">
					<u-radio-group wrap="true" active-color="red" v-model="pickAddressId">
						<u-radio label-size="28" v-for="item in pickAddressList" :key="item.addressId" :name="item.addressId" class="radioSelect">
							{{ item.provinceName }}{{ item.cityName }}{{ item.areaName }}{{ item.addressDetail }}
						</u-radio>
					</u-radio-group>
				</scroll-view>

				<view class="detail--addressPopup--shop"><view class="detail--addressPopup--shop--aside" @click="jumpToAddress">选择其他地址</view></view>
			</u-popup>
		</view>
		
		<!-- 返件地址 -->
		<view class="detail--addressPopup">
			<u-popup v-model="returnWareShow" mode="bottom" width="100%" height="996rpx" border-radius="24" closeable="true">
				<view class="detail--addressPopup--position">配送至</view>
				<scroll-view scroll-y class="detail--addressPopup--main">
					<u-radio-group wrap="true" active-color="red" v-model="returnWareId">
						<u-radio label-size="28" v-for="item in pickAddressList" :key="item.addressId" :name="item.addressId" class="radioSelect">
							{{ item.provinceName }}{{ item.cityName }}{{ item.areaName }}{{ item.addressDetail }}
						</u-radio>
					</u-radio-group>
				</scroll-view>
		
				<view class="detail--addressPopup--shop"><view class="detail--addressPopup--shop--aside" @click="jumpToAddress">选择其他地址</view></view>
			</u-popup>
		</view>
		
		<!-- 收货地址 -->
		<view class="detail--addressPopup">
			<u-popup v-model="receivingAddressShow" mode="bottom" width="100%" height="966rpx" border-radius="24" closeable="true">
				<view class="detail--addressPopup--position">配送至</view>
				<scroll-view scroll-y class="detail--addressPopup--main">
					<u-radio-group wrap="true" active-color="red" v-model="receivingAddressId">
						<u-radio label-size="28" v-for="item in pickAddressList" :key="item.addressId" :name="item.addressId" class="radioSelect">
							{{ item.provinceName }}{{ item.cityName }}{{ item.areaName }}{{ item.addressDetail }}
						</u-radio>
					</u-radio-group>
				</scroll-view>

				<view class="detail--addressPopup--shop"><view class="detail--addressPopup--shop--aside" @click="jumpToAddress">选择其他地址</view></view>
			</u-popup>
		</view>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { uploadGoodsFile, refund, addressList, getContractByCode } from '../../../api/interface.js';
import { domain } from '@/api/configCheck.js'
export default {
	data() {
		return {
			returnWareId:'',
			ReturnShow:false,//返件弹框
			saleType: '',
			upImg: [], // 图片凭证
			goodDetail: {}, // 商品详情

			reasonsApplicationShow: false, // 申请原因弹窗
			pickMethodShow: false, //取件方式弹框
			pickAddressShow: false, // 取件地址弹窗
			receivingAddressShow: false, // 收货地址弹窗

			receiving: true, // 是否与取件地址一致
			pickAddressId: '', // 取件地址id
			receivingAddressId: '', //收货地址id

			refundCauseList: [], // 退货原因列表
			pickAddressList: [], // 取件地址列表
			returnWareType:10,
			returnWareShow:false,
			
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
		this.saleType = options.saleType;
		this.goodDetail = JSON.parse(options.params);

		// 商品id
		this.refundPolicy.contractGoodsCode = this.goodDetail.contractGoodsCode;
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

		let title = '';
		if (this.goodDetail.refundType == `JDB02`) {
			title = `退货`;
		} else if (this.goodDetail.refundType == `JDB03`) {
			title = `换货`;
		} else if (this.goodDetail.refundType == `JDB04`) {
			title = `维修`;
		}
		// 设置标题
		uni.setNavigationBarTitle({
			title
		});
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
		// 监听取件地址是否与取件地址一致
		receiving(newValue) {
			if (newValue) {
				this.receivingAddressId = this.pickAddressId;
			}
		},
		// 监听退款商品的数量  判断退款的钱数
		'refundPolicy.refundGoodsNum': {
			handler(newValue) {
				this.refundPolicy.refundMoney = this.goodDetail.goodsNum * this.goodDetail.pricesetNprice;
			}
		}
	},
	computed: {
		// 取件地址
		pickAddress() {
			return this.pickAddressList.find(el => el.addressId == this.pickAddressId) || {};
		},
		receivingAddress() {
			return this.pickAddressList.find(el => el.addressId == this.receivingAddressId) || {};
		},
		returnWare() {
			return this.pickAddressList.find(el => el.addressId == this.returnWareId) || {};
		}
	},
	created() {
		// 获取原因
		this.getRefCause();
		// 获取地址
		this.getPickAddress();
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
		// 获取地址列表
		getPickAddress() {
			http.post(addressList).then(res => {
				if (res && !res.success) {
					this.pickAddressList = res;

					// 默认选择第一个
					this.pickAddressId = res[0].addressId;
					this.receivingAddressId = res[0].addressId;
					this.returnWareId = res[0].addressId;
				}
			});
		},
		// 提交售后
		submitAfterSales() {
			if (this.refundPolicy.refundMeo == '' || this.refundPolicy.refundEx == '') {
				return this.$message.alert('请完善退款描述');
			}
			let params = {
				ocRefundGoodsBeanList: [
					{
						contractGoodsCode: this.refundPolicy.contractGoodsCode,
						goodsCamount: this.refundPolicy.goodsCamount,
						refundGoodsNum: this.refundPolicy.refundGoodsNum,
						refundGoodsAmt: this.refundPolicy.refundMoney
					}
				],
				contractBillcode: this.refundPolicy.contractBillcode,
				refundMoney: this.refundPolicy.refundMoney,
				refundEx: this.refundPolicy.refundEx,
				refundMeo: this.refundPolicy.refundMeo,
				ocRefundFileDomainList: this.refundFileUrl ? [this.refundFileUrl] : [],
				refundType: this.refundPolicy.refundType,
				refundMem: this.pickAddress.addressMember, //联系人姓名
				refundPhone: this.pickAddress.addressPhone, //联系人电话
				refundArrdess: this.pickAddress.provinceName + this.pickAddress.cityName + this.pickAddress.areaName + this.pickAddress.addressDetail, //取件地址
				contractPumode: '0', //取件方式
				refundPumode: '4',
				refundReceiptArrdess: this.returnWare.provinceName + this.returnWare.cityName + this.returnWare.areaName + this.returnWare.addressDetail, //返件地址
				refundReceiptPhone: this.pickAddress.addressPhone,
				refundClass:this.returnWareType,
				
			};
			//  let params = {
			//           ocRefundGoodsBeanList: [{
			//             contractGoodsCode: this.goodDetail.contractGoodsCode,
			//             goodsCamount: this.goodDetail.goodsCamount,
			//             refundGoodsNum: this.refundNum,
			//             refundGoodsAmt: this.refundNum * this.goodDetail.contractGoodsMoney
			//           }],
			//           contractBillcode: this.goodDetail.contractBillcode,
			//           refundMoney: this.refundNum * this.goodDetail.contractGoodsMoney,
			//           refundEx: this.refause,
			//           refundMeo: this.refauseDescription,
			//           ocRefundFileDomainList: [],
			//           refundType: this.goodDetail.refundType,
			//           refundMem:this.address.addressMember,//联系人姓名
			//           refundPhone:this.address.addressPhone,//联系人电话
			//           refundArrdess:this.address.provinceName+this.address.cityName+this.address.areaName+this.address.addressDetail,//取件地址
			//           contractPumode:this.contractPumode,//取件方式
			//           refundPumode:this.refundPumode,//返件方式
			//           refundReceiptArrdess:this.refundReceiptArrdess,//返件人地址
			//           refundReceiptPhone:this.addressReturn.addressPhone,//返件人手机号
			//         };
		
			http.get(refund.saveRefund, {
				params: JSON.stringify(params)
			}).then(res => {
				this.$message.alert('操作成功')
				setTimeout(() => {
					this.$routers.push('order/index')
				}, 500);
			});
		},
		// 跳到地址页面
		jumpToAddress() {
			this.$routers.push('/pages/address/list')
		}
	}
};
</script>

<style lang="scss" scoped>
v-deep .u-radio {
	// height: 108rpx;
	padding: 20rpx 0;
	line-height: 108rpx;
	border-bottom: 1rpx solid #f1f1f1;

	.u-radio__label.u-radio__label {
		color: #333;
	}
}

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
	&--position {
		padding: 12rpx 0;
		font-size: 32rpx;
		color: #000;
		text-align: center;
	}

	&--main {
		width: 100%;
		height: 734rpx;
		padding: 0 24rpx;
		border-bottom: 1rpx solid #f1f1f1;
	}

	&--shop {
		width: 100%;
		height: 166rpx;
		background-color: #fff;
		padding: 8rpx 24rpx 0;
		display: flex;
		justify-content: space-between;

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
	}
}
</style>

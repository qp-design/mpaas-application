<!-- 订单评价 -->
<template>
	<view>
		<view class="evaluation">
			<view class="evaluation-box" v-for="(item,index) in res.goodsList" :key='index'>
				<view class="goods-info">
					<view class="img">
						<img mode="aspectFill" :src="checkImgUrl(item.dataPic)" alt="">
					</view>
					<view class="right">
						<view class="title">
							{{item.goodsName}}
						</view>
						<view class="price">
							￥{{item.pricesetNprice}}
						</view>
					</view>
				</view>
				<view class="star-list">
					<view style="margin-right: 30rpx;">商品评价</view>
					<view class="p_list">
						<view :class="subListForm[index].evaluateNum==index1?'active_item':'tab_item'" v-for="(item1,index1) in evaluateList"
							:key='index1' @click="changeIndex(index1,index)">{{item1}}</view>
					</view>
				</view>
				<div class="evaluateList-text-img">
					<!-- <h4>上传凭证</h4> -->
					<div class="evaluateList-text-img-box">
						<dl class="show-apply-img">
							<dd v-for="(item2,index2) in subListForm[index].upImg" :key="index2">
								<div class="dd-img">
									<i class="iconfont" @click="delImg(index2,index)"
										style='position: absolute;top: -15rpx;right: -15rpx;z-index: 22;'>&#xe600;</i>
									<img :src="item2" />
								</div>
							</dd>
							<dd v-if='subListForm[index].upImg.length<3'>
								<form action class="apply-up-img">
									<div class="weui-uploader__input-box">
										<div class="weui-uploader__input" @click="chooseImage(index)">
											<i class="iconfont">&#xe620;</i>
											<p>添加图片</p>
										</div>
									</div>
								</form>
							</dd>
						</dl>
					</div>
				</div>
				<view class="textarea">
					<textarea v-model="subListForm[index].evaluation" placeholder-style="color:#CCCCCC;font-weight:400"
						placeholder="宝贝满足您的期待吗？说说您的使用心得，分享给想买的 他们吧!"></textarea>
				</view>
			</view>
			<view class="btn" @click="save">
				确定
			</view>
		</view>
	</view>
</template>

<script>
	import {
		queryUseTemplate,
		getContractByCode,
		saveEvaluateGoods
	} from '@/api/interface.js'
	import {
		$storage,
		$routers
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	import {
		checkImgUrl
	} from '@/utils/checkImg.js'
	export default {
		data() {
			return {
				checkImgUrl,
				starData: '',
				options: '',
				orderDetail: '',
				res: "",
				evaluateList: ['好评', '中评', '差评'],
				evaluateName: '',
				subListForm:[]
			}
		},
		onLoad(options) {
			wx.setNavigationBarTitle({
				title: '发布评价'
			});
			console.log(uni.getStorageSync('userInfo').avatarUrl, '头像')
			http.post(queryUseTemplate, {
				applyTarget: 'goods'
			}).then(res => {
				this.starData = res
				for (let i in this.starData) {
					this.starData[i].current = null
				}
			})
			this.options = options
			let code = {
				contractBillcode: options.contractBillcode
			};
			http.get(getContractByCode, code).then(res => {
				if (res) {
					// this.res = res
					// res.goodsList = res.goodsList.filter((x)=>{return x.contractGoodsGtype != '1'})
					// res.goodsList.forEach((item,i) => {
					// 	this.subListForm[i] = {
					// 		evaluateNum:0,
					// 		upImg: [],
					// 		evaluation:''
					// 	}
					// })
					this.res = res
					this.res.goodsList.forEach((item,i) => {
						/* if(item.contractGoodsGtype==1){
							this.zpgoods[i] = item
							console.log(this.zpgoods)
						} 20220415 sheep  */ 
						this.subListForm[i] = {
							evaluateNum:0,
							upImg: [],
							evaluation:''
						}
					})
					this.res.goodsList = this.res.goodsList.filter(item => item.contractGoodsGtype!=1 && item.refundFlag != 1) //过滤掉赠品
					this.orderDetail = res.packageList[0].contractGoodsList.filter((e) => {
						return e.contractGoodsGtype == 0 && e.goodsPro == '12' //旅拍
					})[0]
				}
			})
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		methods: {
			changeIndex(val,i) {
				this.subListForm[i].evaluateNum=val
				this.$set(this.subListForm,i,this.subListForm[i])
			},
			delImg(index,i) {
				this.subListForm[i].upImg.splice(index, 1)
			},
			chooseImage(i) {
				let that = this
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						// this.$message.loading('正在上传..')
						uni.uploadFile({
							url: that.$domain +
								'/web/rs/goodsFile/uploadGoodsFile.json', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							// #ifndef H5
							header: {
								"Content-Type": "multipart/form-data",
								"cookie": wx.getStorageSync('miniToken') + '=' + wx.getStorageSync(
									'sessionid'),
								"saas-Agent": "qj-wemini"
							},
							// #endif
							formData: {
								'imgIndex': 0
							},
							success: (res) => {
							// this.$message.hide()
								that.subListForm[i].upImg.push(checkImgUrl(JSON.parse(res.data).fileUrl))
								that.$set(that.subListForm,i,that.subListForm[i])
							}
						});
					}
				});
			},

			bindStar(index, index2) {
				this.starData[index].current = index2 + 1
				this.$forceUpdate()
			},
			save() {
				console.log('6+6+6+6+6+6',this.subListForm)
				let paramList = [];
				let imgList = [];
				this.res.goodsList.forEach((item,i) => {
					imgList[i] = {img:''}
					this.subListForm[i].upImg.forEach((item, key) => {
						imgList[i].img += item + ","
					})
					
					paramList[i] = {
						contractGoodsCode: item.auctionCode,
						contractBillcode: item.contractBillcode,
						packageCode: item.packageCode,
						skuCode: item.skuCode,
						evaluateScopeList: [{
							"templateValuesId": 221,
							"templateValuesCode": "shangpzhiliang001",
							"appmanageIcode": null,
							"channelCode": null,
							"channelName": null,
							"tenantCode": "2020070700000001",
							"templateCode": "POHshangpzhiliang",
							"templateValuesScope": 20,
							"templateValuesDel": false,
							"templateValuesDefault": false,
							"templateValuesSort": 0,
							"gmtCreate": 1524542634000,
							"gmtModified": 1524542634000,
							"memo": null,
							"dataState": 0
						}, {
							"templateValuesId": 222,
							"templateValuesCode": "shangpzhiliang002",
							"appmanageIcode": null,
							"channelCode": null,
							"channelName": null,
							"tenantCode": "2020070700000001",
							"templateCode": "POHshangpzhiliang",
							"templateValuesScope": 20,
							"templateValuesDel": false,
							"templateValuesDefault": false,
							"templateValuesSort": 0,
							"gmtCreate": 1524551271000,
							"gmtModified": 1524551271000,
							"memo": null,
							"dataState": 0
						}, {
							"templateValuesId": 223,
							"templateValuesCode": "shangpzhiliang003",
							"appmanageIcode": null,
							"channelCode": null,
							"channelName": null,
							"tenantCode": "2020070700000001",
							"templateCode": "POHshangpzhiliang",
							"templateValuesScope": 20,
							"templateValuesDel": false,
							"templateValuesDefault": false,
							"templateValuesSort": 0,
							"gmtCreate": 1524551271000,
							"gmtModified": 1524551271000,
							"memo": null,
							"dataState": 0
						}],
						
						goodsCode: item.goodsCode,
						skuName: item.skuName,
						goodsName: item.goodsName,
						spuCode: item.auctionCode,
						evaluateGoodsContent: this.subListForm[i].evaluation,
						evaluateAddImg1: this.subListForm[i].evaluateNum,
						dataPic: item.dataPic,
						evaluateGoodsImgs: imgList[i].img,
						userImgurl: uni.getStorageSync('userInfo').avatarUrl,
						memberCcode: this.res['memberCcode'],
						memberCname: this.res['memberCname']
					}
				})
				http.post(saveEvaluateGoods, {
					paramStr: JSON.stringify(paramList)
				}).then(res => {
					if (res.success) {
						this.$message.alert('操作成功')
						this.$routers.switchTab('mine')

					} else {
						this.$message.alert(res.msg || '操作成功')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.p_list {
		display: flex;
		align-items: center;

		view {
			width: 88rpx;
			height: 40rpx;
			font-size: 24rpx;
			text-align: center;
			border-radius: 20rpx;
			margin-right: 26rpx;
		}

		.active_item {
			line-height: 38rpx;
			color: #fff;
			background: #FFA043;
			box-shadow: 1px 1px 10px 0px rgba(51, 51, 51, 0.15);
		}

		.tab_item {
			line-height: 36rpx;
			background: #FFFFFF;
			border: 1px solid #FFA043;
			color: #FFA043;

		}
	}

	.show-apply-img {
		padding: 20rpx 0;
		overflow: hidden;
		zoom: 1;

		dd {
			position: relative;
			width: 154rpx;
			height: 154rpx;
			float: left;
			margin: 0 10rpx 30rpx;

			&:first-child {
				margin: 0 10rpx 30rpx 0;
			}

			&:nth-child(4) {
				margin: 0 0 30rpx 10;
			}

			.dd-img {
				width: 150rpx;
				height: 150rpx;
				position: relative;

				.icon-delete {
					position: absolute;
					right: -15rpx;
					top: -15rpx;
					z-index: 2;
				}

				img {
					width: 150rpx;
					height: 150rpx;
				}
			}
		}

		form {
			width: 150rpx;
			height: 150rpx;
			background: #fff;
			border: 1px dashed #d2d2d2;
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;

			i {
				font-size: 57rpx;
				color: #d2d2d2;
			}

			p {
				color: #d2d2d2;
				font-size: 20rpx;
			}

			input[type="file"] {
				width: 150rpx;
				height: 150rpx;
				position: absolute;
				opacity: 0;
				top: 0;
				left: 0;
				z-index: 2;
			}
		}
	}

	.evaluation {
		padding: 0 30upx;

		&-box {

			.star-list {
				padding: 42upx 0;
				font-size: 28upx;
				display: flex;
				align-items: center;

				.item {
					display: flex;
					margin-bottom: 36upx;

					.icon {
						background: url(../../../static/img/helpCenter/star-l-2.png) no-repeat center center/contain;
						width: 34upx;
						height: 33upx;
						margin-left: 22upx;

						&.active {
							background: url(../../../static/img/helpCenter/star-l.png) no-repeat center center/contain;
						}
					}
				}
			}

			.textarea {
				display: flex;

				textarea {
					flex: 1;
					padding: 20upx;
					box-sizing: content-box;
					height: 360upx;
					font-size: 26upx;
					border: 1px solid rgba(197, 197, 197, 1);
					border-radius: 10upx;
				}
			}

			.goods-info {
				display: flex;
				padding: 30upx;
				border-bottom: 1upx solid #EDEDED;
				margin: 0 -30upx;

				.img {
					width: 130upx;
					height: 130upx;
					border-radius: 10upx;
					background: #eee;

					img {
						width: 130upx;
						height: 130upx;
						border-radius: 10upx;
					}
				}

				.right {
					flex: 1;
					padding-left: 25upx;

					.title {
						font-size: 28upx;
						margin-top: 5upx;
					}

					.price {

						font-size: 28upx;
						margin: 10upx 0;
					}

					.desc {
						font-size: 20upx;
						color: #999999;
					}

				}

			}

		}

		.btn {
			margin-top: 60upx;
			height: 80upx;
			background: $theme;
			border-radius: 40upx;
			font-size: 32upx;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
		}


	}
</style>

<template>
	<view>
		<view class="content">
			<view class="top" v-if="goodsRemark">
				<image :src="goodsRemark" mode="" class="img" style="border-radius: 10rpx;"></image>

			</view>
			<view class="title">
				<view class="tit-l">
					<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/libao.png" mode="" class="img" ></image>
				</view>
				<view class="tit_notice" @click="showCustomBtnTxt()">
					兑换须知
				</view>
				<view class="tit_cent">
					<view class="tit_top">
						<view class="tit_caption">
							{{giftList.giftName}}
						</view>
						
					</view>
					<view class="tit_explain">
						<view class="explain_l">剩余可领取<font>{{list.userRelNum>0?list.userRelNum:0}}</font>{{list.giftChange=='0'?'元':'件'}}</view>
						<view>领取方式：
							<span>{{list.giftCtype=='0'?"一次":"多次"}}</span>
							<span>{{list.giftChange=='0'?"按金额兑换":"按数量兑换"}}</span>
						</view>
					</view>
					<view class="tit_data">截止日期：{{list?giftUserEnd:''}}</view>
				</view>
			</view>
			<view class="getCoupon-content">
				<view v-for="(item,index) in giftCoupon" :key="index" class="goods">
					<p>
						<u-checkbox id="checkd" active-color="#CD1C0E" style="transform:scale(0.7) " v-model="item.ischecked" @change="singelCheck(item,index)" />
					</p>
					<p>
						<image :src="item.dataPic" mode="" @click="getDetail(item)" :prop="skuCode"></image>
					</p>
					<p style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">{{item.goodsName}}</p>
					<view class="goods_foot">
						<p style="font-size: 32rpx;font-weight: 400;color: #000000;line-height: 45rpx;">{{item.pricesetBaseprice}}元</p>
						<view class="goods_add">
							<span @click="reduce(index)" class="goods_reduce"></span>
							<span class="goods_num">{{item.giftNum}}</span>
							<span @click="add(index)" class="goods_add"></span>
						</view>
					</view>
				</view>
			</view>
			<u-popup v-model="isshowCustomBtnTxt" mode="center"  width="90%">
				<view style="
					height:80rpx;
					line-height: 80rpx;
					color:#333333;
					text-align: center;
					font-size: 32rpx;
					width: 100%;
					font-weight: bold;">兑换须知</view>
				<scroll-view enable-back-to-top v-if="giftInfo" scroll-y style="
					height:250rpx;
					line-height: 80rpx;
					color:#999999;
					text-align: center;
					font-size: 32rpx; 
					overflow: auto;
					width: 100%;">{{giftInfo}}</scroll-view>
				<view v-else style="
						height:80rpx;
						line-height: 80rpx;
						color:#999999;
						text-align: center;
						font-size: 32rpx; 
						width: 100%;">暂无兑换需知</view>
				<view style="
					height:80rpx; 
					line-height: 80rpx;
					border-top:1rpx solid #999999;
					color:#EB2B27; 
					text-align: center;
					font-size: 32rpx; 
					width: 100%;"
				 @click="isshowCustomBtnTxt=false">确定</view>
			</u-popup>
		</view>
		<view class="goods_footer">
			<view class="footer_left">
				已选：<view style="color: #F53415;">{{num}}</view>件
			</view>
			<view class="footer_cent" v-if="list.giftChange=='0'">
				总计：<view style="color: #F53415;">{{price.toFixed(2)}}</view>元
			</view>
			<view class="footer_sub" @click="receiveGift">
				确认领取
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatDate
	} from '@/utils/prototype/date.js';
	import http from '@/api/http.js';
	import {
		$storage,
		$router,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		getMyCoupon,
		queryGiftRelPage
	} from '@/api/interface.js';
	export default {
		
		data() {
			return {
				giftUserCode: '',
				lastPageLine: false,
				list: [],
				giftUserEnd: '',
				giftCoupon: [],
				giftInfo: '',
				goodsRemark: '',
				giftList: [],
				isshowCustomBtnTxt: false,
				isindex: 0,
				totalPrice: 0,
				total: 0,
				price: 0,
				num: 0,
				page: 1,
				rows: 10,
				totals: 0,
				giftCode:''
			}
		},
		onLoad(e) {
			this.giftUserCode=e.giftUserCode
			this.myCoupon()
			this.price= 0,
			this.num= 0
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		onReachBottom() {
			// 到这底部在这里需要做什么事情
			this.loadMore();
		},
		methods: {
			loadMore() {
				let num = Math.ceil(this.totals / 10);
				this.page++;
				if (this.page <= num) {
					this.getList(this.giftCode,this.rows,this.page)
				}
			},
			getList(giftCode,rows,page){
				http.post(queryGiftRelPage, {giftCode, rows, page}).then(res => {
					if (res && res.rows) {
						if (this.page === 1 && res.rows.length === 0) {
							this.giftCoupon = [];
						} else {
							let list = res.rows;
							list.map(item => {
								this.$set(item, 'ischecked', false) //勾选状态，默认false
								if (!RegExp(/http/).test(item.dataPic)) {
								  item.dataPic = this.$domain + item.dataPic
								} else {
								  item.dataPic =  item.dataPic
								}
								this.$forceUpdate()
								item.giftNum = 1 //默认数量为0
							
							})
							if (this.page === 1) {
								this.giftCoupon = list;
							} else {
								this.giftCoupon = [...this.giftCoupon, ...list];
							}
							
						}
						
						this.totals = res.total;
					}
				})
			},
			getDetail(item) {
				let parems={
					skuNo:item.skuCode, //商品的
					giftUserCode:this.giftUserCode,//用户的
					pricesetBaseprice:item.pricesetBaseprice,//商品价格
					userRelNum:this.list.userRelNum,//用户剩余金额|数量
					giftChange:this.list.giftChange,//0是金额，1是数量
					giftNum:item.giftNum //已加入的数量
				}
				this.$routers.push('/pages/detail/giftmain', {parems: JSON.stringify(parems)})
			},
			showCustomBtnTxt() {
				this.isshowCustomBtnTxt = true
			},
			//勾选
			singelCheck(item, index) {
				console.log(item, '--------------')
				if (item.ischecked) {
					item.ischecked = false;
					this.giftCoupon[index].giftNum = 1
					this.num -= this.giftCoupon[index].giftNum
					this.price -= this.giftCoupon[index].giftNum * this.giftCoupon[index].pricesetBaseprice
					return
				}
				this.isindex = index
				this.giftCouponType = item
				let price = 0

				if (this.list.giftChange == '0') {
					//按金额
					for (let i = 0; i < this.giftCoupon.length; i++) {
						if (this.giftCoupon[i].ischecked || this.giftCoupon[i].skuCode == item.skucode) {
							price += this.giftCoupon[i].pricesetBaseprice * this.giftCoupon[i].giftNum
						}

					}
					let remindPrice = this.list.userRelNum - price //判断兑换商品是否大于总金额
					if (remindPrice >= item.pricesetBaseprice) {
						item.ischecked = !item.ischecked
						if (item.ischecked) {
							item.giftNum = 1
							this.totalPrice += Number(item.pricesetBaseprice) * item.giftNum;
							console.log(this.totalPrice, '123')
						} else {
							this.totalPrice -= item.pricesetBaseprice * item.giftNum
							console.log(this.totalPrice, '12345')
						}

					} else {
						$message.alert('余额不足')
						setTimeout(() => {
							this.$set(this.giftCoupon[index], 'ischecked', false)
							// this.$forceUpdate()
							this.checkPrice()
						}, 10)


						console.log(this.giftCoupon[index].ischecked)
						// console.log(this.giftCoupon[index].ischecked)

						// this.$forceUpdate()
					}
				} else {
					//按数量

					//只能领取一次

					// if (this.list.giftCtype == '0') {
					// 	item.ischecked = !item.ischecked
					// } else {
					item.ischecked = true
					this.checkNum()
					let num = this.list.userRelNum;
					console.log(this.sum, num, 33333)
					if ((this.sum ) <= num) {
						// item.ischecked = item.ischecked ? false : true;
					} else {

						// this.$set(this.giftCoupon[index], 'ischecked', false)
						this.$nextTick(function() {
							$message.alert('数量不足')
							item.ischecked = false
							this.checkNum()
						})


					}


					// }


				}
				this.checkNum()
				this.checkPrice()
				console.log(item.ischecked, this.giftCoupon[index].ischecked, 555)


			},
			checkPrice() {
				this.total = 0
				for (let i = 0; i < this.giftCoupon.length; i++) {
					if (this.giftCoupon[i].ischecked) {
						this.total += this.giftCoupon[i].pricesetBaseprice * this.giftCoupon[i].giftNum;
						this.price = this.total
					}

				}
			},
			checkNum(item) {
				this.sum = 0
				for (let i = 0; i < this.giftCoupon.length; i++) {

					if (this.giftCoupon[i].ischecked) {
						
						this.sum += Number(this.giftCoupon[i].giftNum)
						this.num = this.sum

					} else {

					}

				}
			},

			add(index) {
				//按金额
				this.isindex = index
				this.checkNum()
				if (!this.giftCoupon[this.isindex].ischecked) {
					$message.alert('请选择商品')
					return
				}
				if (this.list.giftChange == '0') {
					console.log(this.total, this.list.userRelNum, this.giftCoupon[this.isindex].giftNum, 3)
					if (this.total > this.list.userRelNum) {
						$message.alert('余额不足')
					} else {
						this.giftCoupon[this.isindex].giftNum += 1
						this.checkPrice();
						this.checkNum()
						if (this.total > this.list.userRelNum) {
							$message.alert('余额不足')
							this.giftCoupon[this.isindex].giftNum -= 1
							this.checkPrice();
							this.checkNum()
						}
					}
					this.$forceUpdate()

				} else {
					//按数量
					console.log(this.isindex,33333)
					let num = Number(this.giftCoupon[this.isindex].giftNum) + 1;
					if ((this.sum + 1) > this.list.userRelNum) {
						$message.alert('数量不足')
					} else {
						this.$set(this.giftCoupon[this.isindex], 'giftNum', num)
						this.checkNum()
						// this.giftCoupon[this.isindex].giftNum = num
						// this.$forceUpdate()
					}
					
					console.log(this.giftCoupon,555555)
				}

			},
			reduce(index) {
				this.isindex = index
				if (!this.giftCoupon[this.isindex].ischecked) {
					$message.alert('请选择商品')
					return
				}
				if (this.giftCoupon[this.isindex].giftNum == 0) {
					$message.alert('兑换数量不能小于零')

				} else {
					if(this.giftCoupon[this.isindex].giftNum>1){
						this.giftCoupon[this.isindex].giftNum -= 1
						this.checkPrice();
						this.checkNum()
					}else{
						$message.alert('商品数量不能为0！')
					}
					

				}
				this.$forceUpdate()
			},
			receiveGift() {
				let obj = []
				for (let i = 0; i < this.giftCoupon.length; i++) {
					console.log(this.giftCoupon[i].ischecked, 222)
					if (this.giftCoupon[i].ischecked) {
						obj.push({
							skuCode: this.giftCoupon[i].skuCode,
							goodsContract: this.giftUserCode,
							goodsName: this.giftCoupon[i].goodsName,
							goodsNum: this.giftCoupon[i].giftNum,
							selected: this.giftCoupon[i].ischecked,
							shoppingType: "08"
						})
					}
				}
				if (obj.length == 0) {
					$message.alert('请选择商品')
					return
				} else {
					//以前的
					// let params = {
					// 	goodsBeanStr: JSON.stringify(obj)
					// }
					// console.log(params,'23232323232323')
					// this.goodsBeanStr = params
					// console.log(this.goodsBeanStr, '1456890')
					// $storage.set('CHANGE', 'change');
					// $router.push('order/accounts', params)

					//新的
					this.$routers.push('/pages/settleAccounts/settleAccounts', {goodsBeanStr: JSON.stringify(obj), pageState: 2, disCoupon:true})
				}
			},
			myCoupon() {
				const _this = this
				let params = {
					giftUserCode: this.giftUserCode
				}
				http.get(getMyCoupon, params).then(res => {
					if (res && res.length != 0) {
						this.giftList = res
						this.list = res.gtGiftUserDomain
						this.giftUserEnd = formatDate(res.gtGiftUserDomain.giftUserEnd)
						this.giftInfo = res.giftInfo
						this.giftCode = res.giftCode
						this.getList(this.giftCode,this.rows,this.page)
						res.giftWebremark &&
							res.giftWebremark.replace(/<img [^>]*src=['"]([^'"]+)[^/><]*>/gi, function(match, capture) {

								if (capture.indexOf('http') > -1) {
									_this.goodsRemark = capture
								} else {
									_this.goodsRemark = (_this.$domain + capture)
								}

							});
						console.log(_this.goodsRemark)
						res.gtGiftRelDomainList.map((v) => {
							if (!RegExp(/http/).test(v.dataPic)) {
								_this.$set(v, 'dataPic', _this.$domain + v.dataPic);
							}
						});
					}
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 23rpx 30rpx;

		.top {
			height: 295rpx;
			width: 100%;
		}
	}

	.img {
		width: 100%;
		height: 100%;
	}

	.title {
		width: 100%;
		// height: 172rpx;
		background: #DF402A;
		border-radius: 20rpx;
		margin-top: 24rpx;
		display: flex;
		// align-items: center;
		padding: 25rpx 20rpx 20rpx 26rpx;
		position: relative;
		.tit-l {
			width: 120rpx;
			height: 120rpx;
			flex: none;
			position: absolute;
			top: 50%;
			transform: translate(0, -50%);
			// margin-bottom: 20rpx;
		}
		.tit_notice {
			width: 36rpx;
			// height: 100rpx;
			background: rgba(255, 79, 54, 0.6);
			border-radius: 10rpx 0px 0px 10rpx;
			border: 1rpx solid rgba(255, 255, 255, 0.3);
			text-align: center;
			font-size: 18rpx;
			position: absolute;
			right: 0;
			top: 50%;
			color: #FFFFFF;
			padding: 10rpx 0;
			transform: translate(0, -50%);
		}
		.tit_cent {
			// width: 452rpx;
			height: 100%;
			padding: 0 33rpx 0 146rpx;
		
			.tit_top {
				display: flex;
				justify-content: space-between;

				.tit_caption {
					width: 100%;
					// height: 45rpx;
					font-size: 28rpx;
					font-weight: 600;
					color: #FFFFFF;
					line-height: 40rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;

				}

				
			}

			.tit_explain {
				display: flex;
				font-size: 20rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 28rpx;
				padding: 8rpx 0;
				.explain_l {
					margin-right: 36rpx;
				}
			}

			.tit_data {
				// width: 302px;
				height: 28rpx;
				font-size: 20rpx;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 28rpx;
			}
		}

	}

	.getCoupon-content {
		margin-top: 36rpx;
		display: flex;
		justify-content: space-between;
		width: 100%;

		margin-bottom: 100%;
		flex-wrap: wrap;

		.goods {
			height: 444rpx;
			width: 333rpx;
			background: #FFFFFF;
			box-shadow: 0px 10rpx 20rpx 0px rgba(0, 0, 0, 0.1);
			border-radius: 6rpx;
			margin-bottom: 32rpx;
			padding: 18rpx;

			p:nth-child(1) {
				height: 44rpx;
				width: 100%
			}

			p:nth-child(2) {
				text-align: center;
				width: 100%;
				// height: 240rpx;
				// margin: 10rpx 0rpx 20rpx 0rpx;

				image {
					height: 278rpx;
					width: 278rpx;
				}
			}

			p:nth-child(3) {
				// padding-left: 10rpx;
				text-align: left;
				width: 100%;
				line-height: 24rpx;
				height: 37rpx;
				// margin: 10rpx 0rpx 0rpx 0rpx;
				font-size: 26rpx;
				// margin-top: 13rpx;

				color: #000000;
			}

			p:nth-child(4) {
				padding-left: 10rpx;
				text-align: left;
				width: 100%;
				line-height: 42rpx;
				height: 42rpx;
				margin: 5rpx 0rpx 0rpx 0rpx;
				font-size: 24rpx;
				color: #EB2B27;
			}

			.goods_foot {
				display: flex;

				.goods_add {
					display: flex;

					.goods_reduce {
						width: 34rpx;
						height: 34rpx;
						border-radius: 22rpx;
						border: 1rpx solid #F53415;
						position: relative;
					}

					.goods_reduce:after {
						content: '';
						display: block;
						width: 19rpx;
						height: 4rpx;
						background: #F53415;
						position: absolute;
						top: 45%;
						left: 20%;

					}

					.goods_num {
						margin: 0 20rpx;
					}

					.goods_add {
						width: 36rpx;
						height: 36rpx;
						background: #F53415;
						border-radius: 22rpx;
						position: relative;
					}

					.goods_add:after {
						content: '';
						display: block;
						width: 19rpx;
						height: 4rpx;
						background: #fff;
						position: absolute;
						top: 45%;
						left: 20%;
					}

					.goods_add::before {
						content: '';
						display: block;
						width: 19rpx;
						height: 4rpx;
						background: #fff;
						position: absolute;
						top: 45%;
						left: 20%;
						transform: rotate(90deg);
					}
				}
			}

			p:nth-child(5) {
				padding-left: 10rpx;
				width: 100%;
				height: 42rpx;
				margin: 5rpx 0rpx 0rpx 0rpx;
				font-size: 24rpx;
				display: flex;

				span:nth-child(2) {
					display: block;
					height: 30rpx;
					width: 30rpx;
					border: 1rpx solid #EB2B27;
					border-radius: 30rpx;
					line-height: 25rpx;
					background-color: #EB2B27;
					text-align: center;
					margin-left: 15rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					font-weight: bold;
					text-align: center;
				}
			}
		}
	}

	.goods_footer {
		width: 100%;
		height: 120rpx;
		background: #FFFFFF;
		box-shadow: 2px -4px 10px 0px rgba(0, 0, 0, 0.1);
		position: fixed;
		bottom: 0;
		display: flex;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #666666;
		line-height: 120rpx;
		padding-left: 35rpx;

		.footer_left {
			display: flex;
			margin-right: 25rpx;
		}

		.footer_cent {
			display: flex;
		}

		.footer_sub {
			position: absolute;
			right: 0;
			bottom: 0;
			width: 250rpx;
			height: 120rpx;
			background: #F53415;
			border-radius: 30rpx 0px 0px 0px;
			font-size: 30rpx;
			font-weight: 600;
			color: #FFFFFF;
			line-height: 120rpx;
			text-align: center;
		}
	}
</style>

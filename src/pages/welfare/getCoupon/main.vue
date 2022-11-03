<template>
	<view class="getCoupon">
		<view class="getCoupon-top">
			<view class="left">
				<view>{{list.giftName}}</view>
				<view>剩余可领取<font>{{list.userRelNum>0?list.userRelNum:0}}</font>{{list.giftChange=='0'?'元':'件'}}</view>
				<view>领取方式:
					<span>{{list.giftCtype=='0'?"一次":"多次"}}</span>
					<span>{{list.giftChange=='0'?"按金额兑换":"按数量兑换"}}</span>
				</view>
				<view>截止日期：{{list?giftUserEnd:''}}</view>
			</view>
			<view class="right">
				<view @click="showCustomBtnTxt()" class="rigth-content">
					<span>兑换</span>
					<span>须知</span>
				</view>
				<u-popup v-model="isshowCustomBtnTxt" mode="center" height="240rpx" width="90%">
					<view style="
						height:80rpx;
						line-height: 80rpx;
						color:#333333;
						text-align: center;
						font-size: 32rpx;
						width: 100%;
						font-weight: bold;">兑换须知</view>
					<view v-if="giftInfo!=null" style="
						height:80rpx;
						line-height: 80rpx;
						color:#999999;
						text-align: center;
						font-size: 32rpx; 
						width: 100%;">{{giftInfo}}</view>
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
		</view>
		<view class="getCoupon-content">
			<view v-for="(item,index) in giftCoupon" :key="index">
				<p>
					<u-checkbox id="checkd" active-color="#CD1C0E" style="transform:scale(0.7) " v-model="item.ischecked" @change="singelCheck(item,index)" />
					
				</p>

				<p>
					<image :src="item.dataPic" mode="" @click="getDetail(item)" :prop="skuCode"></image>
				</p>
				<p style="    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;">{{item.goodsName}}</p>
				<p>{{item.pricesetBaseprice}}元</p>

				<p><span>数量</span>
					<span @click="showBox(index,item.ischecked)">+</span>

				</p>
			</view>
			<u-popup v-model="show" mode="bottom">
				<view class="count" style="width: 100%;height:300rpx;">
					<view>
						<view class="number">数量:</view>
						<view>
							<span @click="reduce">-</span>
							<span>{{giftCoupon[isindex].giftNum}}</span>
							<span @click="add">+</span>
						</view>
					</view>

					<view>规格:{{giftCouponType.skuName}}</view>
					<view @click="showClick()">确定</view>
				</view>
			</u-popup>
		</view>
		<view class="getCoupon-footer" @click="receiveGift" :prop="goodsBeanStr">
			确认领取
		</view>
		<lastPageLine :lastPageLine="lastPageLine" />
	</view>
</template>

<script>
	import {
		formatDate
	} from '@/utils/prototype/date.js';
	import http from '@/api/http.js';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		getMyCoupon,
	} from '@/api/interface.js';
	import lastPageLine from '@/components/communal/last-page-line';
	export default {
		props: ["giftUserCode"],
		data() {
			return {
				skuCode: '',
				giftUserrelNum: 0,
				show: false,
				value: 0,
				isshowCustomBtnTxt: false,
				list: '',
				gmtModified: '',
				giftUrl: '',
				lastPageLine: false,
				// dataPic:'',
				giftCoupon: '',
				giftUserEnd: '',
				selectedAll: [],
				selected: 1,
				selectDataList: [],
				giftUserrelNum: 0,
				selectedSumNum: 0,
				remainingNum: 0,
				giftUserNmu: '',
				value: 0,
				totalPrice: 0,
				isAdd: false, //控制数量加减次数
				giftInfo: '',
				isischecked: '',
				isindex: null,
				giftCouponType: '', //表示点击的是哪条数据
				goodsBeanStr: '',
				price: '',
				total: 0,
				sum: 0,
				wantList: [], //勾选商品

			}
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
			this.myCoupon()
		},
		mounted() {

		},
		components: {
			lastPageLine
		},
		methods: {
			showClick() {

				if (this.total > this.list.userRelNum && this.list.giftChange == '0') {
					$message.alert('最多可领取' + this.list.userRelNum + '商品');
					this.isAdd = true
					this.show = true
					// this.giftCoupon[this.isindex].giftNum -=1
				} else if (this.num > this.list.userRelNum) {
					$message.alert('最多可领取' + this.list.userRelNum + '商品');
					this.isAdd = true
					this.show = true
				} else {
					this.show = false;
				}

			},
			checkPrice() {
				this.total = 0
				for (let i = 0; i < this.giftCoupon.length; i++) {
					if (this.giftCoupon[i].ischecked) {
						this.total += this.giftCoupon[i].pricesetBaseprice * this.giftCoupon[i].giftNum
					}

				}
			},
			checkNum(item) {
				this.sum = 0
				for (let i = 0; i < this.giftCoupon.length; i++) {

					if (this.giftCoupon[i].ischecked) {
						console.log(this.giftCoupon[i].goodsName)
						this.sum += Number(this.giftCoupon[i].giftNum)
					}

				}
			},
			showCustomBtnTxt() {
				this.isshowCustomBtnTxt = true
			},
			reduce() {
				if (this.giftCoupon[this.isindex].giftNum == 0) {
					$message.alert('兑换数量不能小于零')

				} else {
					this.giftCoupon[this.isindex].giftNum -= 1
					this.checkPrice();
					this.checkNum()

				}
				this.$forceUpdate()
			},

			showBox(index, type) {
				if (type) {
					this.isindex = index
					if (this.list.userRelNum > 0) {
						this.show = true
						this.isAdd = false
					} else {
						$message.alert('数量不足')
						return
					}

				} else {
					$message.alert('请选择商品')
					return
				}

			},
			add() {
				//按金额
				if (this.list.giftChange == '0') {
					console.log(this.total, this.list.userRelNum, this.giftCoupon[this.isindex].giftNum, 3)
					if (this.total > this.list.userRelNum) {
						$message.alert('余额不足')
					} else {

						this.giftCoupon[this.isindex].giftNum += 1
						this.checkPrice();
						if (this.total > this.list.userRelNum) {
							$message.alert('余额不足')
							this.giftCoupon[this.isindex].giftNum -= 1
							this.checkPrice();
						}
					}
					this.$forceUpdate()

				} else {
					//按数量
					this.checkNum()
					let num = Number(this.giftCoupon[this.isindex].giftNum) + 1;
					if ((this.sum + 1) > this.list.userRelNum) {
						$message.alert('数量不足')
					} else {
						this.$set(this.giftCoupon[this.isindex], 'giftNum', num)
						// this.giftCoupon[this.isindex].giftNum = num
					}
					this.$forceUpdate()
				}

			},
			getDetail(item) {
				let params = {
					skuCode: item.skuCode
				}
				$routers.push('my/giftBag/giftDetail', params)
			},

			myCoupon() {
				let params = {
					giftUserCode: this.giftUserCode
				}
				http.get(getMyCoupon, params).then(res => {
					if (res && res.length != 0) {
						this.list = res.gtGiftUserDomain
						this.giftUserEnd = formatDate(res.gtGiftUserDomain.giftUserEnd)
						this.giftCoupon = res.gtGiftRelDomainList
						this.giftInfo = res.giftInfo
						this.giftCoupon.map(item => {
							this.$set(item, 'ischecked', false) //勾选状态，默认false
							this.$forceUpdate()
							item.giftNum = 1 //默认数量为0

						})
						res.gtGiftRelDomainList.map((v) => {
							if (!RegExp(/http/).test(v.dataPic)) {
								this.$set(v, 'dataPic', this.$domain + v.dataPic);
							}
						});
					}
				})
			},

			//勾选
			singelCheck(item, index) {
				console.log(item, '--------------')
				
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
							this.totalPrice += item.pricesetBaseprice * item.giftNum;
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
					if (item.ischecked) {
						item.ischecked = false
					} else {
						this.checkNum()
						let num = this.list.userRelNum;
						console.log(this.sum, num, 33333)
						if ((this.sum + 1) <= num) {
							item.ischecked = item.ischecked ? false : true;
						} else {
							
							// this.$set(this.giftCoupon[index], 'ischecked', false)
							this.$nextTick(function(){
								$message.alert('数量不足')
								item.ischecked = false
							})

							
						}
					}

					// }


				}
				
				console.log(item.ischecked, this.giftCoupon[index].ischecked, 555)


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
					// $routers.push('order/accounts', params)

					//新的

					that.$routers.push('/pages/settleAccounts/settleAccounts', {goodsBeanStr: JSON.stringify(obj),pageState: 2})
					// uni.showToast({
					//   title: '礼包领取成功',
					//   icon: 'success',
					//   duration: 1000
					// })
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.getCoupon {
		width: 100%;
		background-color: #f5f5f5;

		.getCoupon-top {
			background-color: #FFFFFF;
			display: flex !important;
			justify-content: space-between;
			height: 280rpx;
			width: 100%;
			padding: 15rpx 0rpx 0rpx 0rpx;
			border-top: 1rpx solid #f5f5f5;

			.left {
				margin-top: 20rpx;
				height: 100%;
				width: 300rpx;
				margin-left: 10rpx;
				line-height: 40rpx;

				view:nth-child(1) {
					font-size: 26rpx;
					padding: 8rpx 0rpx 8rpx 0rpx;
					color: #000000;
					font-weight: bold;
				}

				view:nth-child(2) {
					font-size: 26rpx;
					padding: 8rpx 0rpx 8rpx 0rpx;
					color: #000000;
					font-weight: bold;

					font {
						color: #EB2B27;
					}
				}


				view:nth-child(3) {
					font-size: 21rpx;
					padding: 8rpx 0rpx 8rpx 0rpx;
					color: #666666;

					span {
						letter-spacing: 2rpx;
					}

					span:nth-child(2) {
						margin-left: 10rpx;
					}
				}

				view:nth-child(4) {
					font-size: 21rpx;
					padding: 8rpx 0rpx 8rpx 0rpx;
					color: #666666;
				}
			}

			.right {
				height: 100%;
				width: 200rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				// padding: 12rpx 20rpx 0rpx 0rpx;
				.rigth-content {
					height: 120rpx;
					width: 120rpx;
					border-radius: 60rpx;
					text-align: center;
					line-height: 80rpx;
					// line-height: 120rpx;
					border: 2rpx solid #EB2B27;

					span {
						display: block;
						height: 40rpx;
						font-size: 20rpx;
						color: #EB2B27;
					}

				}
			}
		}

		.getCoupon-content {
			// margin-top: 15rpx;
			display: flex;
			justify-content: space-between;
			width: 100%;
			padding: 2%;
			margin-bottom: 100%;
			flex-wrap: wrap;

			view {
				height: 510rpx;
				width: 48%;
				background-color: #FFFFFF;
				margin-bottom: 10rpx;

				p:nth-child(1) {
					height: 50rpx;
					width: 100%
				}

				p:nth-child(2) {
					text-align: center;
					width: 100%;
					height: 240rpx;
					margin: 10rpx 0rpx 20rpx 0rpx;

					image {
						height: 240rpx;
						width: 250rpx;
					}
				}

				p:nth-child(3) {
					padding-left: 10rpx;
					text-align: left;
					width: 100%;
					line-height: 30rpx;
					height: 60rpx;
					margin: 10rpx 0rpx 0rpx 0rpx;
					font-size: 24rpx;

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

		.getCoupon-footer {
			height: 90rpx;
			width: 100%;
			font-size: 26;
			font-weight: bold;
			letter-spacing: 2rpx;
			color: #ffffff;
			background-color: #EB2B27;
			line-height: 90rpx;
			text-align: center;
			position: fixed;
			bottom: 0rpx;
		}

		.count {
			view:nth-child(1) {
				display: flex;
				justify-content: center;
				height: 80rpx;
				line-height: 80rpx;
				width: 100%;
				text-align: center;

				.number {
					height: 80rpx;
					width: 60rpx;
				}

				view:nth-child(2) {
					height: 40rpx;
					width: 160rpx;
					border: 1rpx solid #999999;
					border-radius: 4rpx;
					line-height: 40rpx;
					text-align: center;
					margin: 20rpx 0rpx 0rpx 5rpx;
					display: flex;
					font-size: 24rpx;

					span:nth-child(1) {
						height: 100%;
						line-height: 40rpx;
						text-align: center;
						width: 50rpx;
						border-right: 1rpx solid #999999;
						display: block;
					}

					span:nth-child(2) {
						height: 100%;
						line-height: 40rpx;
						text-align: center;
						width: 50rpx;
						border-right: 1rpx solid #999999;
						display: block;
					}

					span:nth-child(3) {
						height: 100%;
						line-height: 40rpx;
						text-align: center;
						width: 50rpx;
						display: block;
					}
				}
			}

			view:nth-child(2) {
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				font-size: 24rpx;
				width: 100%;
			}

			view:nth-child(3) {
				background-color: #EB2B27;
				height: 50rpx;
				width: 120rpx;
				line-height: 50rpx;
				color: #FFFFFF;
				text-align: center;
				margin: 0 auto;
				letter-spacing: 2rpx;
			}

		}
	}
</style>

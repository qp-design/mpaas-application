<template>
	<view class="index">
		<view class="bgColor">
			
		</view>
		<view class="main" v-if="seckillGoodsList.length>0">
			<li v-for="(order, index) in seckillGoodsList" :key="index">

				<view class="item" v-for="(goods, goodsIndex) in order.rsSkuReDomainList" :key="goodsIndex" @click="toDetail(goods,order.promotionCode,order.promotionFrequency)">
					<view class="left">
						<img :src="checkImgUrl(goods.dataPic)" />
					</view>
					<view class="right">
						<view class="rtop">
							{{goods.goodsName}}
						</view>
						<view class="rbottom">
							<view class="rleft">
								<view class="price">
									<view class="now">¥{{goods.pricesetNprice}}</view>
									<view class="old">¥{{goods.pricesetMakeprice}}</view>
								</view>
								<view class="time" v-if="order.dataState == 1">
									<view class="text">距结束</view>
									<u-count-down :timestamp="(order.gmtModified)" color="#fff" separator-color="#000" font-size="24" @end="this.commonMounted()"
									 bg-color="#000"></u-count-down>
								</view>
								<view class="time" v-else>
									<view class="text">距开始</view>
									<u-count-down :timestamp="(order.gmtCreate)" color="#fff" separator-color="#000" font-size="24" @end="this.commonMounted()"
									 bg-color="#000"></u-count-down>
								</view>
							</view>
							<view class="rright">
								<view class="peopleNum">{{order.PeopleNum}}人已参团</view>
								<view class="join" v-if="order.dataState == 1">去参团</view>
								<view class="join"  v-else>待开始</view>
							</view>
						</view>
					</view>

				</view>
			</li>

		</view>
		<div class="noimg" v-else>
			<img :src="nullImg | urlFilter" />
			<p>暂无团购...</p>
		</div>
	</view>
</template>

<script>
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	import {
		checkImgUrl
	} from '@/utils/checkImg.js';
	import {
		myOrder,
		search
	} from '@/api/interface.js';
	import {
		bigdata,
		findByGinfoCode
	} from '@/api/newApi.js';
	import {
		formatDate
	} from "@/utils/prototype/date.js";
	export default {
		data() {
			return {
				nullImg: '/paas/shop-master/c-static/images/wxminiImg/noGoods.png',
				promotionCode: '',
				groupGoodsSkuCode: '',
				historyList: [],
				PeopleNum: '0',
				nowdate: '',
				checkImgUrl,
				formatDate,
				promotionCode: '',
				seckillGoodsList: [],
				page: 1, //分页
				total: 0, //列表数据总数
				rows: 10,
			}
		},
		onLoad() {
			this.getTime()

		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
			this.commonMounted();
			// this.queryPeopleNum()
		},
		methods: {
			getTime() {
				this.nowdate = Date.parse(new Date())/1000 
			},
			toDetail(goods, codes,promotionFrequency) {
				let params = {
					goodsType: 24,
					ginfoCode: codes,
					// area: $storage.get("addressValue") ? $storage.get("addressValue") : "北京朝阳区八里庄街道",
					bizType: "goods",
					hjFlag: true,
				}
				http.get(findByGinfoCode, params).then(res => {
					if (res && res.list.length) {
						this.groupGoodsSkuCode = res.list[0].skuCode
						let code = {
							skuCode: this.groupGoodsSkuCode,
							promotionCode: codes
						}
						$storage.set('PeopleNum',)
						this.$routers.push('/pages/detail/seckilmain', {skuCode: this.groupGoodsSkuCode, promotionCode: codes, promotionFrequency})
					}
					
				});
			},
	
			commonMounted() {
				let params = {
					pbCode: '0008'
				}
				http.get(bigdata.seckill, params).then(async res => {
					if (res && res.rows) {
						if (this.page === 1 && res.rows.length === 0) {
							this.seckillGoodsList = [];
						} else {
						
							let List = res.rows.map(async item => {
								let time = (item.promotionBegintime - Date.parse(new Date())) / 1000;
								let endtime = (item.promotionEndtime - Date.parse(new Date())) / 1000;
								if (time > 0) {
									item.gmtCreate = time;
								
								} else {
									item.gmtCreate = 0
								}
								if (endtime > 0) {
									item.gmtModified = endtime;
								
								} else {
									item.gmtModified = 0
								}
								
								if(item.promotionState == 0){
									let data = {
										contractType :24,
										goodsPmbillno: item.promotionCode,
										dataState:30,
										rows:30
									};
									/* let code = await http.get(myOrder.queryContractPageBuiMat, data).then(res => {
										// if (res && res.rows) {
											return res.rows.length
										// }
									}); */
									// this.$set()
									this.$set(item, "PeopleNum", item.couponOnceNump)
								}
								
								
							})
							console.log(List,55555)
							this.seckillGoodsList = await res.rows.filter((item)=>{return item.promotionState == 0});
							console.log(this.seckillGoodsList)
						}

					}

					this.total = res.total;
				});

			},
		}
	}
</script>
<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="less" scoped>
	.noimg {
		margin-top: 280rpx;
		width: 100%;
		height: 100vh;
		border-right-color: #ccc;
		img {
			display: block;
			width: 359rpx;
			height: 276rpx;
			margin: 0 auto;
		}
	
		p {
			margin-top: 40rpx;
			height: 72rpx;
			line-height: 72rpx;
			text-align: center;
			color: #999999;
			font-size: 24rpx;
		}
	}
	.index {
		width: 100%;
		background-color: #f5f5f5;
		position: relative;
		.bgColor{
			position: absolute;
			width: 100%;
			height: 150rpx;
			background: #EB2B27;
			border-radius: 0 0 50% 50%;
		}
		.bg {
			position: absolute;
			width: 100%;
			height: 100rpx;
			top: 0;
			left: 0;

			.bg1 {
				width: 100%;
				height: 50rpx;
				background-color: #EB2B27;
			}

			.bg2 {
				width: 100%;
				height: 50rpx;
				border-radius: 100%;
				background-color: #EB2B27;
				position: relative;
				top: -25rpx;
			}
		}


		.main {
			position: absolute;
			left: 2.5%;
			top: 20rpx;
			margin: 0 auto;
			width: 710rpx;
			padding: 0 20rpx;
			background-color: #fff;
			border-radius: 16rpx;

			.item {
				width: 100%;
				height: 272rpx;
				padding: 36rpx 0;
				display: flex;
				border-bottom: 2rpx solid #f5f5f5;

				.left {
					width: 200rpx;
					height: 200rpx;
					background-color: rgba(0, 0, 0, .3);
					margin-right: 20rpx;

					img {
						width: 200rpx;
						height: 200rpx;
					}
				}

				.right {
					flex: 1;
					height: 200rpx;

					.rtop {
						width: 100%;
						height: 76rpx;
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #262626;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						margin-bottom: 30rpx;
					}

					.rbottom {
						display: flex;
						justify-content: space-between;

						.rleft {
							height: 88rpx;

							.price {
								display: flex;
								margin-bottom: 15rpx;

								.now {
									font-size: 28rpx;
									font-family: PingFangSC-Medium, PingFang SC;
									font-weight: 500;
									color: #EB2B27;
									margin-right: 10rpx;
								}

								.old {
									font-size: 24rpx;
									text-decoration: line-through;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #999999;
									position: relative;
									bottom: -2rpx;
								}
							}

							.time {
								display: flex;

								.text {
									font-size: 24rpx;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #262626;
									margin-right: 10rpx;
								}
							}
						}

						.rright {

							.peopleNum {
								width: 128rpx;
								height: 44rpx;
								font-size: 20rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #EB2B27;
								text-align: center;
								line-height: 44rpx;
								border-radius: 8rpx 8rpx 0 0;
								border: 2rpx solid;
								border-image: linear-gradient(94deg, rgba(255, 136, 71, 1), rgba(253, 54, 49, 1)) 1 1;
							}

							.join {
								width: 128rpx;
								height: 44rpx;
								font-size: 20rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #FFFFFF;
								text-align: center;
								line-height: 44rpx;
								background: linear-gradient(90deg, #FF914A 0%, #FD3230 100%);
								border-radius: 0 0 8rpx 8rpx;
							}
						}
					}
				}
			}
		}
	}
</style>

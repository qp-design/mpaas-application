<template>
	<view class="secKill">
		<!-- 	<view class="secKill--tit">
			<view class="title">
				<view style="font-size: 36rpx;font-family: YouSheBiaoTiHei;color:#262626;">限时</view>
				<view style="font-size: 36rpx;font-family: YouSheBiaoTiHei;color:#EB2B27;">秒杀</view>
				<view style="font-size: 22rpx;font-family: PingFangSC-Regular, PingFang SC;color:#8C8C8C;font-weight: 400; margin-left: 10rpx;">限时限量先到先得</view>
			</view>
			<view class="more" @click="jumpToSearch(goods.cmsContlistReDomainList)">
				<view class="">更多</view>
				<view class="img"><image src="../../static/car/arrow.png" mode="" style="width: 100%;height: 100%"></image></view>
			</view>
		</view> -->

		<view class="secKill--item" v-for="(item,index) in secGoodList" :key=index>
			<view v-if="!item.gmtCreate&&item.inventory !=0" style="width: 84rpx;height: 40rpx;background: #eb2b27;border-radius: 2rpx;font-size: 24rpx;font-weight: 500;color: #ffffff;text-align: center;line-height: 40rpx;margin: 24rpx 0 11rpx 15rpx;">
				抢购中
			</view>

			<view style="display: flex; margin: 24rpx 0 11rpx 15rpx;" v-else-if="item.gmtCreate">
				<view style="width: 84rpx;height: 40rpx;background: #ff9d0d;border-radius: 2rpx;font-size: 24rpx;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #ffffff;text-align: center;line-height: 40rpx;">
					距开抢
				</view>
				<view style="height: 40rpx;border: 2rpx solid #ff9d0d;text-align: center;padding: 0 10rpx;line-height: 34rpx;">
					<u-count-down :timestamp="item.gmtCreate" color="#FF9D0D" separator-color="#FF9D0D" font-size="24" bg-color="#ffffff"></u-count-down>
				</view>
			</view>

			<view v-if="!item.gmtCreate&&item.inventory ==0" style="margin: 24rpx 0 11rpx 15rpx;width: 84rpx;height: 40rpx;background: #b0b0b0;border-radius: 2rpx;font-size: 24rpx;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #ffffff;text-align: center;line-height: 40rpx;">
				已抢空
			</view>

			<view class="goodsDetail" v-for="(good,indexG) in item.rsSkuReDomainList" :key="indexG">
				<view class="bigimg">
					<image :src="good.dataPic | urlFilter" mode="" style="width: 100%;height: 100%;"></image>
				</view>

				<view class="params">
					<view class="goodsName">
						{{good.goodsName}}
					</view>
					<view class="stock">
						<u-line-progress active-color="#EB2B27" inactive-color="#FCE7E8" :percent="item.diff" height="10" :show-percent="false"></u-line-progress>
						<view style="display: flex;">
							<view style="width: 20rpx; height: 22rpx;">
								<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/11561618390393_.pic_hd.jpg" mode="" style="width: 100%; height: 100%;"></image>
							</view>
							<view style="font-size: 22rpx;color: #595959;margin-left: 8rpx;">剩{{item.inventory ||0}}件</view>
						</view>
					</view>
					<view class="price">
						<view style="display: flex;">
							<view style="font-size: 28rpx;font-family: PingFangSC-Regular, PingFang SC;font-weight: 800;color: #EB2B27; margin-right: 16rpx;">¥{{ (good.pricesetNprice.toFixed(2)) || 0 }}</view>
							<view style="font-size: 22rpx;font-family: PingFangSC-Regular, PingFang SC;font-weight: 400;color: #8C8C8C;text-decoration: line-through;line-height: 40rpx;">¥{{ (good.pricesetMakeprice) || 0 }}</view>
						</view>

						<view v-if="!item.gmtCreate&&item.inventory !=0" @click="gosecGoodsDetail(good.skuCodeNew,item.gmtModified,item.promotionCode,item.promotionFrequency ,item.inventory)"
						 style="width: 128rpx;height: 48rpx;background: #eb2b27;border-radius: 24rpx;font-size: 24rpx;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #ffffff;text-align: center;line-height: 48rpx;">
							立即抢购
						</view>

						<view v-else-if="item.gmtCreate" style="width: 128rpx;height: 48rpx;background: linear-gradient(90deg, #ff9d0d 0%, #eb2b27 100%);border-radius: 24rpx;font-size: 24rpx;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #ffffff;text-align: center;line-height: 48rpx;">
							即将开抢
						</view>

						<view v-if="!item.gmtCreate&&item.inventory ==0" style="width: 128rpx;height: 48rpx;background: rgba(235, 43, 39, 0.35);border-radius: 24rpx;font-size: 24rpx;font-family: PingFangSC-Medium, PingFang SC;font-weight: 500;color: #ffffff;text-align: center;line-height: 48rpx;">
							立即抢购
						</view>
					</view>
				</view>
			</view>
		</view>



	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		index,
		detail,
		findByGinfoCode
	} from '@/api/newApi.js';
	export default {
		data() {
			return {
				secGoodList: []
			};
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
			this.getSecGoodList()
		},
		mounted() {
			
		},
		methods: {
			async gosecGoodsDetail(code, time, promotionCode,promotionFrequency, inventory) {
				console.log('传下来的',code, time, promotionCode,promotionFrequency, inventory)
				console.log('inventory',inventory)
				console.log('code',code)
				// this.$message.alert('当前商品!');
				if(!inventory)  return;
				this.searchGoods(code, time, promotionCode,promotionFrequency, inventory);
				

			},
			getSecGoodList() {
				http.post(index.queryPromotionPageForC, {
					pbCode: '0007',
					dataStateStr: '1,4'
				}).then(async res => {
					if (res.list.length) {
						res.list.forEach(item => {
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
							item.rsSkuReDomainList && item.rsSkuReDomainList.forEach(item1 => {
								item1["skuCodeNew"] = item1.skuCode
								this.$set(item, 'inventory', item1.goodsSupplynum)
								const cha = ((item1.goodsAhnum - item1.goodsSupplynum)/item1.goodsAhnum) *100
								// const cha = ((item1.goodsSupplynum - item.inventory) / item1.goodsSupplynum) * 100
								this.$set(item, 'diff', cha > 0 ? cha : 0)
							})
							// item.rsSkuReDomainList.forEach(async (good) => {
							// 	let a = await this.searchGoods(item.promotionCode);
							// 	console.log('aaaaa',a)
							// 	if (a && a.length) {
							// 		a.slice(0, 1).forEach(async sku => {
							// 			let skucode = sku.rsSkuDomainList && sku.rsSkuDomainList[0].skuCode
							// 			good["skuCodeNew"] = skucode
							// 		/* 	await http.get(index.getSkuInfoByCode, {
							// 				skuCode: skucode
							// 			}).then(async rex => { */
							// 				this.$set(item, 'inventory', good.goodsSupplynum)

							// 				const cha = ((good.goodsSupplynum - item.inventory) / good.goodsSupplynum) * 100
							// 				this.$set(item, 'diff', cha)

							// 			/* }) */
							// 		})

							// 	} else {
							// 		this.$set(item, 'inventory', good.goodsSupplynum)
							// 		// const cha= ((good.goodsSupplynum-item.inventory)/good.goodsSupplynum)*100
							// 		this.$set(item, 'diff', 0)
							// 	}
							// })
						})
						this.secGoodList = await res.list
					}
				})
			},
			async searchGoods(code, time, promotionCode,promotionFrequency, inventory) {
				let data = {
					goodsType: 26,
					ginfoCode : promotionCode,
					vendibilityFlag: true,
					childFlag:true,
					bizType: "goods",
					hjFlag: true,
					area: $storage.get("addressValue") ? $storage.get("addressValue") : "北京朝阳区八里庄街道"
				}
				http.post(findByGinfoCode, data).then(res => {
					if (res && res.list && res.list.length) {
						if (code) {
							this.$routers.push('detail', {skuNo: code,time,promotionCode,promotionFrequency})
						}
						return;
					}
					$message.alert(res.msg)
				})
			},
		}
	};
</script>

<style lang="less" scoped>
	.secKill {
		margin: 0 auto;
		width: 700rpx;
		// height: 906rpx;
		background: #ffffff;
		box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
		border-radius: 14rpx;
		border: 4rpx solid #f6f6f6;
		padding: 0 20rpx;
		margin-top: 18rpx;

		.secKill--tit {
			width: 100%;
			// height: 76rpx;
			border-bottom: 4rpx solid #f6f6f6;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				display: flex;
				align-items: center;
				padding: 15rpx 0;
			}

			.more {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #595959;
				display: flex;

				.img {
					margin-left: 6rpx;
					width: 11rpx;
					height: 18rpx;
				}
			}
		}

		.secKill--item {
			width: 100%;
			height: 300rpx;
			border-bottom: 4rpx solid #f6f6f6;

			.goodsDetail {
				width: 100%;
				height: 200rpx;
				display: flex;
				padding-left: 15rpx;

				.bigimg {
					width: 200rpx;
					height: 200rpx;
					background-color: rgba(0, 0, 0, 0.3);
				}

				.params {
					padding-left: 30rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;

					.goodsName {
						width: 400rpx;
						font-size: 26rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #262626;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.stock {
						display: flex;
						justify-content: space-between;
						align-items: center;

						v-deepu-line-progress {
							width: 218rpx;
							display: flex;
							align-items: center;
						}
					}

					.price {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
				}
			}
		}
	}
</style>

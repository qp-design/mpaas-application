<template>
	<view class="content">
		<view class="header-img" v-if="promotionImg"><image :src="checkImgUrl(promotionImg)" mode=""></image></view>
		<view class="promotion-content">
			<view class="content-title" v-if="contentTitle">{{ contentTitle }}</view>
			<view class="content-time" v-if="promotionBegintime">活动时间：{{ timesSeconds(promotionBegintime) }}-{{ timesSeconds(promotionEndtime) }}</view>
			<view class="content-rules" v-if="contentRules">活动规则：{{ contentRules.substring(0,contentRules.lastIndexOf(',')) }}</view>
			<view class="content-count">活动购买次数：{{ contentBuyCount | buyCount}}</view>
		</view>
		<view class="promotion-goods" v-if="goodsList.length>0">
			<view class="promotion-title">促销相关商品</view>
			<view class="goods-list" >
				<view class="goods-item" v-for="(item, index) in goodsList" :key="index" @click="goDetail(item.skuCode)">
					<view class="goods-img"><image :src="checkImgUrl(item.dataPic)" mode=""></image></view>
					<view class="goods-name">{{ item.goodsName }}</view>
					<!-- <view class="goods-stock">库存：{{ item.goodsSupplynum }}</view> -->
					<view class="goods-price">
						<view class="price">{{ item.pricesetNprice.toFixed(2) }}元</view>
						<view class="icon" @click.stop="goCar(item.skuId)"><i class="iconfont icon-jia2"></i></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { getPromotionByCode, index } from '@/api/newApi.js';
import { addShoppingGoods } from '@/api/interface.js';
import { checkImgUrl } from '@/utils/checkImg.js';
import { timesSeconds } from '@/utils/formate.js';
export default {
	data() {
		return {
			promotionCode: '',
			promotionImg: '',
			checkImgUrl,
			timesSeconds,
			contentTitle: '',
			promotionBegintime: '',
			promotionEndtime: '',
			contentRules: '',
			contentBuyCount:'',
			goodsList: [],
			// skuCode: [],
			skuNo: [],
			page: 1,
			rows: 20,
			total: 0
		};
	},
	onLoad(e) {
		this.promotionCode = e.promotionCode;
		console.log(e, '活动Code');
		this.getPromotion();
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	onReachBottom() {
		let num = Math.ceil(this.total / this.rows);
		this.page++;
		if (this.page <= num) {
			this.searchGoods();
		}
	},
	filters:{
		buyCount(num){
			return num!=0&&num?num+'次':'无限次'
		}
	},
	methods: {
		getPromotion() {
			http.get(getPromotionByCode, { promotionCode: this.promotionCode }).then(res => {
				if (res) {
					this.promotionImg = res.promotionUrl;
					this.contentTitle = res.promotionName;
					this.promotionEndtime = res.promotionEndtime;
					this.promotionBegintime = res.promotionBegintime;
					this.contentBuyCount=res.promotionFrequency;
					console.log(res.promotionFrequency,"-----------------------------------")
					// this.contentRules = res.pmPromotionDiscountList[0].discName;
					res.pmPromotionDiscountList.forEach((item)=>{
						if(item.discName){
							this.contentRules+=item.discName+','
						}else{
							this.contentRules='';
						}
					})

					if (res.rangeType == 0) {
						this.searchGoods()
					} else if (res.rangeType == '5') {
						if (res.pmPromotionRangeList && res.pmPromotionRangeList.length > 0) {
							res.pmPromotionRangeList.map(item => {
								this.skuNo.push(item.rangeCode);
							});
							this.skuNo = this.skuNo.join();
							this.searchGoods();
							console.log(this.skuNo, 'this.skuNo');
						}
					}
				}
			});
		},
		searchGoods() {
			let params = {
				page: this.page,
				rows: this.rows,
				// skuCode: this.skuCode,
				skuNo: this.skuNo,
				childFlag:true,
				// dataOpbillstate: 1,
				goodsType:"00,40"
			};
			http.get(index.seckillGood, params).then(res => {
				if (res && res.list.length > 0) {
					this.goodsList = [...this.goodsList, ...res.rows];
					this.total = res.total;
				}
			});
		},
		goDetail(skuCode) {
			if (skuCode) {
				this.$routers.push('detail', {skuNo: skuCode})
			}
		},
		goCar(skuId) {
			if (skuId) {
				http.get(addShoppingGoods, { skuId, goodsNum: 1, channelCode: 'busBBC' }).then(res=>{
					if(res.success){
						this.$message.alert(res.msg)
					}
				})
			}
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	background-color: #f7f7f7;
	padding: 25rpx;
	height: 100%;
	.header-img {
		image {
			width: 700rpx;
		}
	}
	.promotion-content {
		width: 700rpx;
		padding: 39rpx;
		border-radius: 10rpx;
		background-color: #fff;
		.content-title {
			font-size: 30rpx;
			font-weight: bold;
			line-height: 42rpx;
			color: #fa4f4f;
		}
		.content-time {
			margin: 20rpx 0;
			font-size: 24rpx;
		}
		.content-rules {
			font-size: 24rpx;
		}
		.content-count{
			margin-top: 20rpx;
		}
	}
	.promotion-goods {
		padding: 49rpx 0;
		.promotion-title {
			font-size: 30rpx;
			font-weight: 600;
		}
		.goods-list {
			padding: 20rpx;
			display: flex;
			flex-wrap: wrap;

			.goods-item {
				background-color: #fff;
				margin-top: 20rpx;
				.goods-img {
					width: 320rpx;
					image {
						width: 320rpx;
						height: 320rpx;
					}
				}
				.goods-name {
					padding: 20rpx;
					height: 90rpx;
					width: 300rpx;
					line-height: 36rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					word-break: break-all;
					font-size: 28rpx;
				}
				.goods-stock {
					font-size: 24rpx;
					font-weight: 400;
					color: #666666;
					padding-left: 20rpx;
				}
				.goods-price {
					padding: 20rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.price {
						color: #eb2b27;
						font-size: 30rpx;
					}
					.icon {
						width: 40rpx;
						height: 40rpx;
						border-radius: 20rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						background-color: #eb2b27;
					}
					.iconfont {
						font-size: 32rpx;
						color: #ffffff;
					}
				}
			}
			.goods-item:nth-child(2n + 1) {
				margin-right: 20rpx;
			}
		}
	}
}
</style>

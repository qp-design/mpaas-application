<template>
	<view class="shop">
		<view class="shop_list" v-if="shopList.length>0">
			<view class="shop_item" v-for="item in shopList" :key="item.shopdeId">
				<view class="shop_item_info">
					<view class="logo">
						<image v-if="item.shopdeLogo" :src="checkImgUrl(item.shopdeLogo)"></image>
					</view>
					<view class="shopName">
						{{item.shopdeName}}
					</view>
					<view class="btn" @click="goShop(item.memberCode)">进店</view>
				</view>
				<view class="shop_item_goods" v-if="item.goodsList">
					<view class="shop_item_goods_item" v-for="(t_item,t_index) in item.goodsList" :key="t_item.goodsId" :class="t_index==0?'ltb':(t_index==1?'mlr':'rtb')">
						<view class="img">
							<image v-if="t_item.dataPic" :src="checkImgUrl(t_item.dataPic)" mode="widthFix"></image>
						</view>
						<view class="money">￥{{t_item.pricesetNprice || 0}}</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="status" style="margin: 0 auto;" />
		</view>
		<view class="noList" v-else>
			未找到相关店铺~
		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {checkImgUrl} from '@/utils/checkImg.js';
	import {queryShopdePage} from '@/api/interface.js';
	export default{
		props:['shopdeName','page','rows'],
		data(){
			return{
				checkImgUrl,
				shopList:[],
				status:'loading'
			}
		},
		mounted() {
			this.getShopList();
		},
		watch:{
			page:{
				deep:true,
				handler(newVal,oldVal){
					this.getShopList();
				}
			},
			
		},
		methods:{
			getShopList(){
				let params={
					page:this.page,
					rows:this.rows,
					shopdeName:this.shopdeName
				}
				http.get(queryShopdePage,params).then(res=>{
					if(res.total==this.rows){
						this.status='loadmore';
					}
					if(res.total<this.rows){
						this.status='nomore';
					}
					if(res.list){
						this.shopList.push(...res.list);
					}
				})
			},
			goShop(memberCode){
				this.$routers.push('myStore/index', {
					memberCode
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.shop_list{
		margin: 60rpx 24rpx 0;
		.shop_item{
			padding: 24rpx;
			background: #F7F7F7;
			margin-bottom: 24rpx;
			&_info{
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;
				.logo{
					width: 80rpx;
					height: 80rpx;
					image{
						width: 80rpx;
						height: 80rpx;
						border-radius: 40rpx;
						overflow: hidden;
					}
				}
				.shopName{
					flex: 1;
					margin: 0 20rpx;
					font-size: 28rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				.btn{
					width: 96rpx;
					height: 48rpx;
					color: #fff;
					line-height: 48rpx;
					text-align: center;
					background: #D7000F;
					border-radius: 24rpx;
				}
			}
			&_goods{
				display: flex;
				&_item{
					position: relative;
					.img{
						width: 212rpx;
						height: 220rpx;
						image{
							width: 212rpx;
							height: 220rpx;
							overflow: hidden;
						}
					}
					.money{
						position: absolute;
						right: 10rpx;
						bottom: 10rpx;
						padding: 4rpx 12rpx;
						color: #fff;
						background: rgba(0, 0, 0, .4);
						border-radius: 20rpx;
					}
				}
			}
			.ltb{
				.img{
					border-top-left-radius: 10rpx;
					border-bottom-left-radius: 10rpx;
				}
			}
			.rtb{
				.img{
					border-top-right-radius: 10rpx;
					border-bottom-right-radius: 10rpx;
				}
			}
			.mlr{
				margin: 0 8rpx;
			}
		}
	}
	.noList{
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
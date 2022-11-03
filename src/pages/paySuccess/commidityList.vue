<template>
	<!-- 商品推荐列表 -->
	<view>
		<view class="bigBox">
			<view class="recommend">
				<view class="recommend-item" v-for="(item, index) in left" :key="index">
					<u-lazy-load class="recom-image" :image="item.contlistPicurl | urlFilter"></u-lazy-load>
					<view class="recom-content">
						<view class="recom-title">{{item.contlistName}}</view>
						<view class="recom-price">{{item.contlistPrice | money}}</view>
						<view class="recom-store-name"><view>阳光采销自营</view></view>
					</view>
				</view>
			</view>
			<view class="recommend">
				<view class="recommend-item" v-for="(item, index) in right" :key="index">
					<u-lazy-load class="recom-image" :image="item.contlistPicurl | urlFilter"></u-lazy-load>
					<view class="recom-content">
						<view class="recom-title">{{item.contlistName}}</view>
						<view class="recom-price">{{item.contlistPrice | money}}</view>
						<view class="recom-store-name"><view>阳光采销自营</view></view>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" style="margin: 0 auto;" />
	</view>
</template>

<script>
import url from '@/api/configCheck.js'
export default {
	props:{
		recomList:Array,
		status:String,
	},
	data() {
		return {
			left:[],
			right:[],
			middle:0
		};
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted(){
		this.left = this.recomList.filter((item,index)=>{
			return index%2 == 0
		})
		this.right = this.recomList.filter((item,index)=>{
			return index%2 != 0
		})
	},
	watch:{
		recomList:{
			deep:true,
			handler(val){
				this.left = val.filter((item,index)=>{
					return index%2 == 0
				})
				this.right = val.filter((item,index)=>{
					return index%2 != 0
				})
			}
		}
	},
	filters: {
		money(val) {
			return '¥' + val; 
		},
		urlFilter(val) {
			return url.domain + val;
		}
	},
};
</script>

<style lang="scss" scoped>
// 底部商品推荐
.bigBox{
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 20rpx 30rpx;
}
.recommend {
	width: 330rpx;
	box-sizing: border-box;
	.recommend-item {
		width: 330rpx;
		margin-bottom: 30rpx;
		border-radius: 8rpx;
		overflow: hidden;
		.recom-content {
			width: 100%;
			box-sizing: border-box;
			background: white;
			padding: 15rpx;
			.recom-title {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; /* 自定义的行数 */
				overflow: hidden;
				font-size: 28rpx;
				height: 80rpx;
			}
			.recom-tag {
				padding: 10rpx 0rpx;
				box-sizing: border-box;
				view {
					background: #f6f6f6;
					display: inline-block;
					height: 30rpx;
					line-height: 30rpx;
					padding: 0px 10px;
					border-radius: 15rpx;
					font-size: 18rpx;
					margin-right: 15rpx;
				}
			}
			.recom-price {
				font-size: 28rpx;
			}
			.recom-store-name {
				view {
					display: inline-block;
					border-radius: 4rpx;
					font-size: 18rpx;
					color: white;
					background-color: $theme;
					padding: 4rpx;
				}
			}
		}
	}
}
</style>

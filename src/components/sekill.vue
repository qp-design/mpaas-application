<template>
	<view class="sells-sekill" >
		<!-- 秒杀头部 -->
		<view class="sekill-header">
			<view>
				<view class="sells-header-image"><image :src="checkImgUrl(sekill.conttitlePicurl) | urlFilter" style="width: 100%;" mode="widthFix"></image></view>
				<view class="sells-header-asides">{{ sekill.conttitleName }}</view>
			</view>
			<view>
				<view class="count-down-title">本场距结束</view>
				<u-count-down :timestamp="timestamp" :bg-color="baseColor" :separator-color="baseColor" :show-days="true" color="white" font-size="24"></u-count-down>
			</view>
		</view>
		<!-- 秒杀商品内容区 -->
		<view class="sekill-content">
			<scroll-view class="sekill-sells" scroll-x :show-scrollbar="true" @scroll="scrollViewChange">
				<view class="sells-item" v-for="(item, index) in sekill.cmsContlistReDomainList" :key="index"  @click="salesClick(item)">
					<view class="sells-item-image"><image :src="item.contlistPicurl | urlFilter" style="width: 100%;height:100%;"></image></view>
					<view class="sells-item-title">{{ item.contlistName }}</view>
					<view class="sells-item-price">
						<view class="sells-item-price-now" v-if="item.contlistPriceNow" v-html="money(item.contlistPriceNow)"></view>
						<view class="sells-item-price-old" v-if="item.contlistPrice2Now" v-html="money(item.contlistPrice2Now)"></view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 秒杀商品底部导航条 -->
		<movable-area class="sekill-scrollBar"><movable-view class="sekill-scrollBar-item" :x="x" direction="all"></movable-view></movable-area>
	</view>
</template>

<script>
import url from '@/api/configCheck.js'
import { checkImgUrl } from '@/utils/checkImg.js';
export default {
	props: {
		sekill: Object,
		timestamp: Number
	},
	data() {
		return {
			checkImgUrl,
			x: 0,
			step: 50,
			list: [1, 2, 3, 4, 5, 6, 7, 8],
			timer:null
		};
	},
	mounted() {
		this.step = ((this.list.length - 3) * 120) / 44;
		console.log(url);
	},
	methods: {
		scrollViewChange(e) {
			if(this.timer){
				clearTimeout(this.timer);
			}
			this.timer = setTimeout(()=>{
				this.x = e.detail.scrollLeft / this.step;
				console.log(this.x)
			},100)
		},
		salesClick(e){
			this.$routers.push('detail',{skuNo: e.contlistOpcode})
		}
	},
	filters: {
		money(val) {
			return '¥' + val;
		}
	},
	

	
};
</script>

<style lang="less">
// 影藏scroll-view滚动条
::-webkit-scrollbar {
	display: none;
	width: 0 !important;
	height: 0 !important;
	-webkit-appearance: none;
	background: transparent;
}
.sells-sekill {
	width: 100%;
	padding: 15rpx;
	background: white;
	border-radius: 8rpx;
	box-sizing: border-box;
	// 秒杀头部
	.sekill-header {
		display: flex;
		justify-content: space-between;
		height: 32rpx;
		& > view {
			display: flex;
			&:first-child {
				justify-content: flex-start;
			}
			&:last-child {
				justify-content: flex-end;
			}
			& > view:first-child {
				margin-right: 10rpx;
			}
			.sells-header-image {
				width: 126rpx;
				height: 27rpx;
			}
			.sells-header-asides {
				color: gray;
				font-size: 20rpx;
				line-height: 40rpx;
			}
			.count-down-title {
				font-weight: bold;
				color: black;
			}
		}
	}
	// 秒杀商品区
	.sekill-content {
		width: 100%;
		box-sizing: border-box;
		padding-top: 15rpx;
		.sekill-sells {
			width: 100%;
			height: 100%;
			white-space: nowrap;
			.sells-item {
				display: inline-block;
				width: 200rpx;
				margin-right: 20rpx;
				.sells-item-image {
					width: 200rpx;
					height: 200rpx;
					background: gray;
					border-radius: 8rpx;
				}
				.sells-item-title {
					width: 200rpx;
					padding: 10rpx 0px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					font-weight: bold;
				}
				.sells-item-price {
					display: flex;
					justify-content: flex-start;
					font-weight: bold;
					.sells-item-price-now {
						color: #d91825;
						font-size: 28rpx;
					} 
					.sells-item-price-old {
						color: gray;
						margin-left: 10rpx;
						font-size: 22rpx;
						text-decoration: line-through;
						line-height: 45rpx;
					}
				}
			}
		}
	}

	// 秒杀商品底部导航条
	.sekill-scrollBar {
		width: 25%;
		margin: 0 auto;
		height: 10rpx;
		background: #ccc;
		border-radius: 5rpx;
		.sekill-scrollBar-item {
			width: 50%;
			height: 10rpx;
			background: #d91825;
			border-radius: 5rpx;
		}
	}
}
</style>

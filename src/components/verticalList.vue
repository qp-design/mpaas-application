
<style lang="scss" scoped>
	.list {
		& {
			margin-top: 120rpx;
		}
		&-item {
			display: flex;
			align-items: center;
			
			margin: 12rpx 0;
			background-color: #f0f2f5;
			
			&-left {
				width: 160rpx;
				height: 160rpx;
				margin: 32rpx;
			}
			&-right {
				margin: 32rpx 32rpx 32rpx 24rpx;
				width: 422rpx;
				height: 250rpx;
				
				display: inherit;
				flex-direction: column;
				justify-content: space-between;
				&-title {
					&-main {
						font-size: 28rpx;
						color: #262626;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					&-sub {
						margin-top: 24rpx;
						
						font-size: 24rpx;
						color: #999999;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
				}
				
				&-price {
					
					&-selling {
						font-size: 28rpx;
						font-weight: 500;
						color: #EB2B27;
					}
					
					&-market {
						margin-left: 24rpx;
						font-size: 24rpx;
						color: #999999;
						text-decoration: line-through;
					}
				}
				
			}
		}
		
	}
</style>
<template>
	<!-- 商品列表/搜索列表 -->
	<view>
		<view class="list">
			<view class="list-item" v-for="(el, i) in recomList" :key="el.goodsCode"  @click="jumoToDetail(el)">
				<view class="list-item-left">
					<u-lazy-load :image="checkImgUrl(el.contlistPicurl || el.dataPic) || urlFilter" img-mode="aspectFit" :height="170"></u-lazy-load>
				</view>
				<view class="list-item-right">
					<view class="list-item-right-title">
						<text class="list-item-right-title-main" v-text="item.contlistName || el.goodsName"></text>
						<text class="list-item-right-title-sub" v-text="el.goodsProperty || ''"></text>
					</view>
					
					<view class="list-item-right-price">
						<text class="list-item-right-price-selling" v-text="'¥'+(item.contlistPrice || el.pricesetNprice)"></text>
						<text class="list-item-right-price-market" v-show="item.pricesetMakeprice > 0&&item.pricesetMakeshow!='0'&&item.goodsType!=40" v-text="'¥'+el.pricesetMakeprice"></text>
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" style="margin: 0 auto;" />
	</view>
</template>

<script>
	import url from '@/api/configCheck.js'
	import {
		checkImgUrl
	} from '@/utils/checkImg.js';
	import vopLabel from './vop-label.vue'
	export default {
		name: 'vertical_list',
		components: {
			vopLabel
		},
		props: {
			recomList: Array,
			status: String,
		},
		data() {
			return {
				checkImgUrl,
			};
		},
		methods: {
			jumoToDetail(e) {
				if (e.contlistPicurl3) {
					this.$routers.push('detail', {
						skuNo: e.contlistPicurl3
					})
				} else {
					this.$routers.push('detail', {
						skuNo: e.skuCode
					})
				}
			}
		},
		mounted() {
			console.log(this.recomList, 'recomList')
		},
		watch: {
			// #ifdef H5
			status(n, o) {
				if (n === 'nomore') {
					let dom = document.querySelectorAll('.u-loadmore-icon-wrap');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			}
			// #endif
		},
		filters: {
			money(val) {
				return '¥' + val;
			},
			urlFilter(val) {
				return url.domain + val;
			}
		}
	};
</script>


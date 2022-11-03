<template>
	<view class="">
		<u-navbar id="navBar" back-icon-color="#000" :title="title" title-color="#000" :background="background"></u-navbar>
		<view class="content">
			<view class="banner" v-if="bannerImg"><image :src="checkImgUrl(bannerImg)" mode=""></image></view>
			<view class="classify">
				<view class="classList">
					<view class="list-item" v-for="(item, index) in classList" @click="goClass(item)">
						<view class="top"><image :src="checkImgUrl(item.contlistPicurl)" mode=""></image></view>
						<view class="bottom">{{ item.contlistName }}</view>
					</view>
				</view>
			</view>
			<view class="goods" v-if="commodityList">
				<view  v-for="(itemlist, index) in commodityList" :key="index">
					<view class="list-name" v-if="itemlist.cmsContlistReDomainList">{{ itemlist.conttitleName }}</view>
					<view class="goodsList">
						<view class="list-item" v-for="(item, index1) in itemlist.cmsContlistReDomainList" :key="index1" @click="toDetail(item)">
							<view class="item-img"><image :src="item.contlistCon?checkImgUrl( item.contlistCon):checkImgUrl( item.contlistPicurl)" mode=""></image></view>
							<view class="item-name">{{ item.contlistName }}</view>
							<view class="item-price">
								<view class="top">￥{{ item.contlistPrice }}</view>
								<view class="bottom" v-if="item.contlistConNow==1">￥{{ item.contlistPicurl1 }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { checkImgUrl } from '@/utils/checkImg.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { index, recom, bigdata } from '@/api/newApi.js';
export default {
	data() {
		return {
			checkImgUrl,
			goodsList: [],
			topList: [],
			bannerImg: '',
			bannerList: {},
			classList: {},
			commodityList: {},
			title: '',
			code: '',
			background: {
				backgroundColor: '#eb2b27'
			}
		};
	},
	onLoad(e) {
		this.title = e.title;
		this.code = e.code;
	},
	// #ifdef H5
	onBackPress(options) {
		window.history.back()
		return true
	},
	// #endif
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted() {
		// this.positionCalc()
		// 前端楼层数据
		http.get(index.floors, {
			tginfoMenuCode: this.code
		}).then(res => {
			if (res && res.list.length > 0) {
				this.goodsList = res.list.filter(item => item.dataState == 2);
			}
			this.bannerList = this.goodsList[0].cmsContlistReDomainList.filter(item => item.dataState == 2 && item.conttitleType == 'jpg');
			if (this.bannerList.length > 0) {
				this.bannerImg = this.bannerList[0].contlistPicurl;
			}
			this.classList = this.goodsList[1].cmsContlistReDomainList.filter(item => item.dataState == 2 && item.conttitleType == 'classify');
			this.commodityList = this.goodsList.splice(2,this.goodsList.length)
			this.commodityList.forEach((item, i) => {
				this.commodityList[i].cmsContlistReDomainList = item.cmsContlistReDomainList.filter(item => item.dataState == 2 && item.conttitleType == 'goods');
			})
		});
	},
	methods: {
		goClass(item) {
			this.$routers.push('goodsList', {classtreeCode: item.contlistOpcode})
		},
		toDetail(item) {
			this.$routers.push('detail', {skuNo: item.contlistPicurl3Now})
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	padding: 25rpx;
	.banner {
		width: 700rpx;
		height: 300rpx;
		border-radius: 20rpx;
		overflow: hidden;
		image {
			width: 700rpx;
			height: 300rpx;
		}
	}
	.classify {
		padding: 56rpx 12rpx 0;
		.classList {
			display: flex;

			flex-wrap: wrap;
			.list-item {
				padding: 0 15rpx;
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-bottom: 52rpx;
				.top {
					width: 96rpx;
					height: 96rpx;
					margin-bottom: 10rpx;
					border: 1rpx solid rgba(255, 255, 255, 0.75);
					image {
						border-radius: 25rpx;
						width: 96rpx;
						height: 96rpx;
					}
				}
				.bottom {
					color: #595959;
					font-size: 22rpx;
					font-weight: 500;
				}
			}
		}
	}
	.goods {
		.list-name {
			padding-bottom: 30rpx;
			font-weight: 500;
			color: #262626;
			font-size: 36rpx;
		}
		.goodsList {
			display: flex;
			flex-wrap: wrap;
			.list-item:nth-child(2n) {
				padding-right: 0rpx;
			}
			.list-item {
				display: flex;
				flex-direction: column;
				padding-right: 20rpx;
				padding-bottom: 30rpx;
				.item-img {
					width: 340rpx;
					height: 340rpx;
					margin-bottom: 12rpx;
					image {
						width: 340rpx;
						height: 340rpx;
					}
				}
				.item-name {
					width: 340rpx;
					height: 68rpx;
					padding-bottom: 4rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					color: #333333;
					font-size: 24rpx;
				}
				.item-price {
					display: flex;
					align-items: center;
					.top {
						font-weight: 500;
						color: #eb2b27;
						font-size: 26rpx;
						padding-right: 14rpx;
					}
					.bottom {
						padding-top: 4rpx;
						font-size: 22rpx;
						font-weight: 400;
						color: #8c8c8c;
						text-decoration: line-through;
					}
				}
			}
		}
	}
}
</style>

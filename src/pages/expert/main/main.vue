<template>
	<view class="">
		<u-navbar id="navBar" back-icon-color="#000" :title="title" title-color="#000" :background="background"></u-navbar>

		<view class="content">
			<view class="ImgList" v-for="(item, index) in goodsList">
				<view class="img-item" v-if="item.conttitlePicurl" @click="goItem(item)">
					<view class="imgName">{{ item.conttitleName }}</view>
					<image :src="checkImgUrl(item.conttitlePicurl)" mode=""></image>
				</view>
				<view class="img-item" v-else @click="goItem(item)">
					<view class="imgName">{{ item.conttitleName }}</view>
					<image src="../../../static/common/queImg.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { index, recom, bigdata } from '@/api/newApi.js';
import { checkImgUrl } from '@/utils/checkImg.js';
export default {
	data() {
		return {
			checkImgUrl,
			goodsList: [],
			topList: [],
			title: '',
			code: '',
			background: {
				backgroundColor: '#eb2b27'
			}
		};
	},
	onLoad(e) {
		// this.positionCalc()
		// 前端楼层数据
		this.title = e.title;
		this.code = e.code;
		http.get(index.floors, {
			tginfoMenuCode: this.code
		}).then(res => {
			this.goodsList = res.list.filter(item => item.dataState == 2);
			console.log(this.goodsList, 'this.goodsList');
		});
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	// #ifdef H5
	onBackPress(options) {
		window.history.back()
		return true
	},
	// #endif
	methods: {
		goItem(item) {
			console.log(item, 'item');
			wx.setStorageSync('conttitleName', item.conttitleName);
			let flag = '';
			flag = item.cmsContlistReDomainList.every(i => i.conttitleType == 'goods');
			if (flag) {
				const goods = item.cmsContlistReDomainList.filter(i => {
					if (i.dataState == 2) {
						return i.conttitleType == 'goods';
					}
				});
				$storage.set('goodsList', goods);
				$routers.push('goodsList');
			} else {
				this.$routers.push('/pages/expert/main/list', {cmsContlistReDomainList: JSON.stringify(item.cmsContlistReDomainList)})
			}
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	padding: 0rpx 25rpx 24rpx;
}
.ImgList {
	padding-top: 24rpx;
	.img-item {
		width: 700rpx;
		height: 360rpx;
		position: relative;
		border-radius: 20rpx;
		overflow: hidden;
		.imgName {
			position: absolute;
			top: 0;
			left: 0;
			white-space: nowrap;
			padding: 10rpx 20rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			height: 60rpx;
			background: #000000;
			box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.5);
			border-radius: 8rpx 0rpx 24rpx 0rpx;
			opacity: 0.6;
			text-align: center;
			color: #fff;
			font-size: 28rpx;
		}
		image {
			width: 100%;
			height: 100%;
		}
	}
}
</style>

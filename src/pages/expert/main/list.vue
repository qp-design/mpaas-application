<template>
	<view class="">	
		<u-navbar  id="navBar" back-icon-color="#000" :title="headerName" title-color="#000" :background="background" >	
		</u-navbar>
		<view class="content">
			<view class="content-list" v-for="(item, index) in cmsContlistReDomainList">
				<view class="content-img" v-if="item.contlistTypeNow == 0"><image :src="checkImgUrl(item.contlistPicurl)" mode="widthFix"></image></view>
				<view class="content-viedo" v-else>
					<view class="left"><video :src="checkImgUrl(item.contlistPicurl)" controls></video></view>
  
					<view class="right">{{ item.contlistName }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { checkImgUrl } from '@/utils/checkImg.js';
export default {
	data() {
		return {
			checkImgUrl,
			headerName: '',
			cmsContlistReDomainList: '',	
			background:{
				backgroundColor: '#eb2b27',
			}
			
		};
	},
	onLoad(e) {
		this.headerName = wx.getStorageSync('conttitleName');
		wx.removeStorageSync('conttitleName');
		this.cmsContlistReDomainList = JSON.parse(e.cmsContlistReDomainList).filter(item => item.conttitleType == 'jpg' && item.dataState == 2);
		console.log(this.cmsContlistReDomainList, 'chuacnan');
		
		const query = uni.createSelectorQuery().in(this);
		query
			.select('#navBar')
			.boundingClientRect(data => {
				this.$emit('getNavBarHeight', data.height);
			})
			.exec();
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	// #ifdef H5
	onBackPress(options) {
		this.$routers.back()
		return true
	},
	// #endif
	methods: {
		goBack() {
			this.$routers.back()
		},
		
	}
};
</script>

<style lang="less" scoped>

.content {
	padding: 0 25rpx 24rpx;
	.content-list {
		padding-top: 24rpx;
		.content-img {
			width: 700rpx;
			image {
				width: 100%;
			}
		}
		.content-viedo {
			display: flex;
			.left {
				width: 355rpx;
				height: 200rpx;
				margin-right: 20rpx;
				video {
					width: 355rpx;
					height: 200rpx;
				}
			
			}
			.right{
				font-size: 30rpx;
				font-weight: 500;
				color: #333333;
				overflow:hidden; 
				height: 80rpx;
				text-overflow:ellipsis;
				display:-webkit-box; 
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2; 
			}
		}
	}
}
.box{
	width: 750rpx;
	padding-top: 50rpx;
	video{
		width: 750rpx;
	}
}
</style>

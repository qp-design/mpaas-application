<template>
	<view class="codes">
		<u-navbar background="" :border-bottom="false" back-icon-color="#fff"></u-navbar>
		<view class="codes_main">
			<view class="avatar">
				<image :src="info.avatarUrl" mode=""></image>
			</view>
			<view class="title">{{info.nickName}}的推广码</view>
			<view class="erweima">
				<image :src="miniQRCode" mode="widthFix"></image>
			</view>
			<view class="btn" @click="downloadPoster()"> 
				<text class="iconfont icon-xiazai"></text>
				保存到相册
			</view>
		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {getWxMiniQRCode} from '@/api/interface.js'
	import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
	export default{
		data(){
			return{
				info:"", //微信授权信息
				miniQRCode:""
			}
		},
		onLoad() {
			this.info=wx.getStorageSync("userInfo");
			this.getPic();
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
		methods:{
			//获取小程序码
			getPic(){
				let userInfoCode=$storage.get("loginInfor").userInfoCode || "";
				http.get(getWxMiniQRCode,{page: 'pages/index/main',width: 240,auto_color: true,mode:0,scene:userInfoCode}).then(res=>{
					if (res.success && res.dataObj.dataObj) {
						this.miniQRCode = 'data:image/png;base64,' + res.dataObj.dataObj.toString('base64');
					}
				})
			},
			//保存到相册
			downloadPoster() {
				var aa = wx.getFileSystemManager();
				let _this = this
				aa.writeFile({
					filePath:wx.env.USER_DATA_PATH+'/test.png',
					data: this.miniQRCode.slice(22),
					encoding:'base64',
					success: res => {
						wx.saveImageToPhotosAlbum({
							filePath: wx.env.USER_DATA_PATH + '/test.png',
							success: function (res) {
								_this.$message.alert("保存成功")
							},
							fail: function (err) {
								_this.$message.alert("保存失败")
							}
						})
					},fail: err => {
						_this.$message.alert("保存失败")
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.codes{
		width: 100%;
		height: 100%;
		background-image: url(https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/mengban%402x.png);
		background-size: cover;
		display: flex;
		align-items: center;
		justify-content: center;
		.codes_main{
			width: 600rpx;
			height: 956rpx;
			padding: 0 60rpx;
			background: #FFEAEA;
			border-radius: 20rpx;
			.avatar{
				width: 144rpx;
				height: 144rpx;
				margin: -72rpx auto 32rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 50%;
					border: 4rpx solid #D8D8D8;
				}
			}
			.title{
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #1C253A;
				text-align: center;
				line-height: 44rpx;
			}
			.erweima{
				width: 480rpx;
				height: 480rpx;
				margin: 72rpx auto;
				background: #FFFFFF;
				border-radius: 20rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.btn{
				width: 460rpx;
				height: 112rpx;
				line-height: 112rpx;
				color: #fff;
				font-size: 32rpx;
				text-align: center;
				background: linear-gradient(134deg, #FF5F6A 0%, #ED4444 100%);
				box-shadow: 0px 12rpx 20rpx 0px rgba(237, 68, 68, 0.3);
				border-radius: 56rpx;
				.icon-xiazai{
					margin-right: 10rpx;
				}
			}
		}
	}
</style>

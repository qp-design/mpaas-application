<template>
	<view class="auth-box">
		<!-- <view class="loginTop" :style="{'padding-top':paddingTop,background: baseColor}" >
			<view class="backIndex" :style="{'width':logoHeight,'height':logoHeight}" @click="goLogin">
				<image src="../../static/mainTabbar/index.png"></image>
			</view>
		</view> -->
		<view class="img-container"><image :src="imgUrl | urlFilter" alt /></view>
		<view class="auth-prompt">
			<view>申请获得以下权限</view>
			<view>获取微信绑定的手机号</view>
		</view>
		<view class="auth-btn">
			<button :style="{background: baseColor}" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权获取微信绑定手机号</button>
		</view>
	</view>
</template>

<script>
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import http from '@/api/http.js';
import {  user } from '@/api/newApi.js';
export default {
	data() {
		return {
			imgUrl: '/paas/shop-master/c-static/images/wx/au.png',
			
			// 顶部布局的一些高度
			paddingTop:"100rpx",
			logoHeight: "50rpx",
			bigPadding: "250rpx",
		};
	},
	onLoad(options) {
		console.log(options)
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted() {
			// 微信小程序获取菜单按钮（右上角胶囊按钮）位置信息 (单位px)
			var data = wx.getMenuButtonBoundingClientRect();
			this.paddingTop = data.top*2+"rpx";
			this.logoHeight = data.height*2+"rpx";
			this.bigPadding = (data.top+data.height+45)*2+'rpx';
			console.log('菜单按键宽度：',data.width)
			console.log('菜单按键高度：',data.height)
			console.log('菜单按键上边界坐标：',data.top)
			console.log('菜单按键右边界坐标：',data.right)
			console.log('菜单按键下边界坐标：',data.bottom)
			console.log('菜单按键左边界坐标：',data.left)
	},
	methods: {
		goLogin(){
			uni.reLaunch({
				url:"/pages/index/main"
			})
		},
		//登录后绑定用户手机号
		getPhoneNumber: function(e) {
			var that = this;
			console.log(e.detail.errMsg ,5555);
			if (e.detail.errMsg == 'getPhoneNumber:ok') {
				var msg = {
					encryptedData:e.detail.encryptedData,
					iv:e.detail.iv,
					code:$storage.get('code'),
					userOpenid:$storage.get('userOpenid'),
					// register: 1 ,
					memberDiscode:$storage.get('memberDiscode') || ""
					//跳过注册校验
				}
				console.log(msg,5555)
				// return
				wx.login({
					success(lo) {
						msg.code = lo.code;
						http.get(user.bindPhone,{...msg}).then(res=>{
							if(res.dataObj?.register == "false"){
								let loginInfor = JSON.parse(res.dataObj.userInfo);
								$storage.set('loginInfor', loginInfor);
								$storage.set('userId', loginInfor.userId);
								$storage.set('sessionid', loginInfor.ticketTokenid);
								$storage.set('Refresh', true);
								let miniToken = $storage.get('miniToken');
								let cookie = loginInfor.ticketTokenid;
								let miniCookie = miniToken + '=' + cookie + '; Domain=' + that.$domain.substring(8) + '; Path=/';
								$storage.set('miniUserName', miniCookie);
								uni.navigateBack({
									delta:-1
								})
							}else{
								uni.showModal({
									title: '提示',
									content: '您还不是该小程序用户，暂不能注册!',
									showCancel:false,
									confirmText:"返回首页",
									success(res) {
										uni.reLaunch({
											url:"/pages/index/main"
										})
									}
								})
								
								
							}
							
						})
						// uni.navigateBack({
						// 	delta:-1
						// })
					}
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
 @import '@/common/css/common.less';
.auth-box {
	background: #fff;
	position: fixed;
	height: 100%;
	width: 100%;
	.loginTop{
		width: 100%;
		box-sizing: border-box;
		padding-left: 20rpx;
		padding-bottom: 15rpx;
		.backIndex{
			border-radius: 50%;
			border: 2rpx solid #CD7E71;
			box-sizing: border-box;
			padding: 10rpx;
			background: #9C000B;
			transform: translateY(5rpx);
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.img-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}
	
	.auth-prompt {
		text-align: center;

		view {
			&:first-child {
				font-size: 32rpx;
				color: #333;
			}

			&:last-child {
				font-size: 26rpx;
				color: #999;
				margin-top: 6rpx;
			}
		}
	}
	
	.auth-btn {
		margin-top: 60rpx;

		button {
			font-size: 32rpx;
			width: 90%;
			height: 80rpx;
			margin: 20rpx 5%;
			border-radius: 90rpx;
			&::after {
				border: none;
			}

			&:last-child {
				color: #999;
			}

			&:first-child {
				color: #fff;
			}
		}
	}
}
</style>

<template>
	<view class="auth-box">
		<view class="img-container"><image :src="imgUrl" alt /></view>
		<view class="auth-prompt">
			<view>申请获得以下权限</view>
			<view>获取您的公开信息(昵称，头像等)</view>
		</view>
		<view class="auth-btn">
			<!-- <button :style="{ background: baseColor }" bindtap="getUserProfile">授权微信用户信息</button> -->
			<button v-if="canIUseGetUserProfile" :style="{ background: baseColor }" @click="getUserProfile">授权微信用户信息</button>
			<button v-else :style="{background: baseColor}" @getuserinfo="bindGetUserInfo" open-type="getUserInfo">授权微信用户信息</button>
			<!-- <button :style="{background: baseColor}" @getuserinfo="bindGetUserInfo" open-type="getUserInfo">授权微信用户信息</button> -->
			<button @click="cancel" type="default">取消</button>
		</view>
	</view>
</template>

<script>
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import http from '@/api/http.js';
import { addressList } from '@/api/interface.js';
import { user } from '@/api/newApi.js';

export default {
	data() {
		return {
			imgUrl: this.$domain + '/paas/shop-master/c-static/images/wx/au.png',

			// 顶部布局的一些高度
			paddingTop: '100rpx',
			logoHeight: '50rpx',
			bigPadding: '250rpx',
			addressList: [],
			addressValue: '',
			canIUseGetUserProfile: false,
		};
	},
	onLoad(options) {
		console.log(options);
		if(wx.getUserProfile){
			this.canIUseGetUserProfile = true
		}
	},
	mounted() {
		// 微信小程序获取菜单按钮（右上角胶囊按钮）位置信息 (单位px)
		var data = wx.getMenuButtonBoundingClientRect();
		this.paddingTop = data.top * 2 + 'rpx';
		this.logoHeight = data.height * 2 + 'rpx';
		this.bigPadding = (data.top + data.height + 45) * 2 + 'rpx';
		console.log('菜单按键宽度：', data.width);
		console.log('菜单按键高度：', data.height);
		console.log('菜单按键上边界坐标：', data.top);
		console.log('菜单按键右边界坐标：', data.right);
		console.log('菜单按键下边界坐标：', data.bottom);
		console.log('菜单按键左边界坐标：', data.left);
	},
	
	methods: {
		goLogin() {
			uni.reLaunch({
				url: '/pages/index/main'
			});
		},

		getUserProfile() {
			wx.getUserProfile({
				desc: '获取用户个人信息',
				success: (res) => {
					let that = this;
					if(res.userInfo){
						wx.login({
							success(lo){
								if (lo.code) {
									$storage.set('code', lo.code);
									$storage.set('userInfo', res.userInfo);
									that.loginRequest(lo.code, res.userInfo);
								} else {
									$message.alert('登录失败');
									console.log('登录失败！' + res.errMsg);
								}
							}
						})
					}
				}
			});
		},
		

		// 微信小程序授权登录逻辑
		bindGetUserInfo: function(e) {
			let that = this;
			console.log(e,"登录信息")
			if (e.target.userInfo) {
				let userInfo = e.target.userInfo;
				wx.login({
					success(lo) {
						if (lo.code) {
							$storage.set('code', lo.code);
							that.loginRequest(lo.code, userInfo);
						} else {
							$message.alert('登录失败');
							console.log('登录失败！' + res.errMsg);
						}
					}
				});
			} else {
				$message.alert(e.detail.errMsg);
				console.log('用户按了取消授权');
			}
		},
		// 服务端登录接口，前端将code传过去
		loginRequest(code, userInfo) {
			http.get(user.login, {
				js_code: code
			}).then(res => {
				console.log(res);
				if(!res.success){
					$message.alert(res.msg);
					return
				}
				$storage.set('userInfo', userInfo);
				$storage.set('userOpenid', res.dataObj.userOpenid);
				
				if (res.dataObj.register == 'true') {
					uni.redirectTo({
						url: '/pages/bindlogin/main'
					});
				} else {
					
					uni.navigateBack({
						delta:-1
					})
					let loginInfor = JSON.parse(res.dataObj.userInfo);
					$storage.set('loginInfor', loginInfor);
					$storage.set('userId', loginInfor.userId);
					$storage.set('sessionid', loginInfor.ticketTokenid);
					$storage.set('Refresh', true);
					let miniToken = $storage.get('miniToken');
					let cookie = loginInfor.ticketTokenid;
					let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$domain.substring(8) + '; Path=/';
					$storage.set('miniUserName', miniCookie);
					http.get(addressList).then(res => {
						if(res.length>0){
							this.addressList = res.map(item => {
								if (item.roadName) {
									return {
										name: item.provinceName + item.cityName  + item.areaName  + item.roadName  + item.addressDetail,
										...item
									};
								} else {
									return {
										name: item.provinceName  + item.cityName + item.areaName  + item.addressDetail,
										...item
									};
								}
							});
							this.addressValue = this.addressList[0].name;
							$storage.set('addressValue',this.addressValue)

						}

					});
				}

			});
		},
		// 取消授权，返回上一层或者首页
		cancel() {
			if (getCurrentPages().length > 1) {
				uni.navigateBack({
					delta: -1
				});
			} else {
				uni.reLaunch({
					url: '/pages/index/main'
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

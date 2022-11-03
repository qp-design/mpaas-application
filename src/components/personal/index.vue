<template>
	<header class="headers" :style="{ background: baseColor }">
		<div class="headers-message">
			<p>
				<i class="iconfont" @click="goCustomService">&#xe69d;</i>
				<span></span>
			</p>
		</div>
		<div class="headers-box">
			<div class="headers-box-img">
				<img :src="message.avatarUrl || message.avatar || userImgurl" @click="toPersonal" />
				<h3 v-if="message.nickName">
					{{ message.nickName }}
					<span>
						<i class="iconfont">&#xe771;</i>
						{{userLevel}}
					</span>
				</h3>
				<!-- #ifdef MP-WEIXIN -->
				<button open-type="getUserInfo" @getuserinfo="bindGetUserInfo" v-else>登录/注册</button>
				<!-- #endif -->
				<!-- #ifdef MP-TOUTIAO -->
				<button @click="userAuth" v-else>登录/注册</button>
				<!-- #endif -->
				<!-- #ifdef MP-ALIPAY -->
				<button open-type="getAuthorize" @getAuthorize="onGetAuthorize" @error="onAuthError" scope="userInfo" v-else>登录/注册</button>
				<!-- #endif -->
				
			</div>
		</div>
		<div class="headers-sum">
			<div v-for="(item, index) in nav" :key="index" @click="navClick(item)">
				<p>{{ item.menuName }}</p>
			</div>
		</div>
	</header>
</template>
<script>
	import getUserInfo from '@/components/communal/getUserInfo';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	import {
		getProappinfo,
		loginIn,
		getTopPerMenuListFPc,
		thirdLogin,
		loginMicroMessenger,
		loginMiniProgram,
		warrantyLogin,
		getPersonal
	} from '@/api/interface.js';
	export default {
		props: ['baseColor', 'message', 'isShow', 'nav', 'webmail'],
		data() {
			return {
				userImgurl: require('../../static/img/mine/default_header.png'),
				userLevel: 0
			};
		},

		mounted() {
			if ($storage.get('miniUserName') && $storage.get('userId')) {
				http.get(getPersonal, {
					userId: $storage.get('userId')
				}).then(res => {
					this.userLevel = res.userinfoLevel;
				})
			}
		},

		methods: {

			// 微信小程序授权登录逻辑
			bindGetUserInfo: function(e) {
				$message.loading();
				let that = this;
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
					console.log('用户按了取消授权');
				}
			},


			// 服务端登录接口，前端将code传过去
			loginRequest(code, userInfo) {
				http.get(warrantyLogin, {
					js_code: code
				}).then(res => {
					console.log(res);
					$storage.set('userInfo', userInfo);
					$storage.set('userOpenid', res.dataObj.userOpenid);
					this.$emit('isShowFalse', false);
					this.$emit('updateUserInfo');
					if (res.dataObj.register == 'true') {
						$routers.push('my/bindPhone');
					} else {
						let loginInfor = JSON.parse(res.dataObj.userInfo);
						$storage.set('loginInfor', loginInfor);
						$storage.set('userId', loginInfor.userId);
						$storage.set('sessionid', loginInfor.ticketTokenid);
						let miniToken = $storage.get('miniToken');
						let cookie = loginInfor.ticketTokenid;
						let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$domain.substring(8) + '; Path=/';
						$storage.set('miniUserName', miniCookie);

						this.setLoginAfterRouter();
					}
				});
			},

			setLoginAfterRouter() {
				http.get(getPersonal, {
					userId: $storage.get('userId')
				}).then(res => {
					this.userLevel = res.userinfoLevel;
				})
				http.get(getTopPerMenuListFPc).then(res => {
					if (res) {
						$storage.set('getTopPerMenuList', res.menuList);
						$storage.set('footerMenu', res.menuList.filter(v => v.menuShow === 0));
						$message.hide();
					}
				});
			},
			
			/**
			 * 支付宝授权获取用户信息
			 */
			onGetAuthorize(){
				$message.loading();
				my.getOpenUserInfo({
					fail: res => {},
					success: res => {
						let userInfo = JSON.parse(res.response).response; // 以下方的报文格式解析两层 response
						console.log(userInfo);
						my.getAuthCode({
							scopes:'auth_user',
							success: (res) => {
								if(res.authCode){
									this.loginRequest(res.authCode, userInfo);
								}
							}
						})
					}
				});
			},
			
			/**
			 * 
			 */
			onAuthError(){
				$message.alert('用户拒绝授权')
			},

			/**
			 * 获取服务提供商
			 * @param {Object} callback
			 */
			getProvider(callback) {
				uni.getProvider({
					service: 'oauth',
					success(res) {
						callback(res.provider[0]);
					}
				});
			},

			userAuth() {
				$message.loading();
				this.getProvider(provider => {
					let _this = this;
					uni.login({
						provider: provider,
						scopes: 'auth_user',
						success(res) {
							console.log(res);
							let code = res.code
							uni.getUserInfo({
								provider: provider,
								lang: 'zh_CN',
								success(res) {
									_this.loginRequest(code, res.userInfo);
									console.log(res);
								}
							});
						}
					});
				});
			},

			cancelUserInfo() {},
			
			toPersonal() {
				$storage.get('getTopPerMenuList').map(v => {
					if (v.menuAction == 'user') {
						v.children[0].children.map(val => {
							if (val.menuAction == 'personal') {
								$routers.push(val.menuJspath);
							}
						});
					}
				});
			},
			navClick(item) {
				console.log(item);
				$routers.push(item.menuJspath);
			},

			goCustomService() {
				$routers.push(this.webmail);
			}
		}
	};
</script>
<style lang="less">
	@import '../../common/css/common.less';

	.headers {
		height: 516rpx;
		width: 100%;
		background: #b79f77;
		padding-bottom: 36rpx;

		&-message {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding: 35rpx 30rpx 30rpx 0;

			i {
				color: #212121;
			}

			p {
				position: relative;
				margin-right: 38rpx;

				span {
					position: absolute;
					display: inline-block;
					width: 10rpx;
					height: 10rpx;
					border-radius: 50%;
					background: #c21b39;
					top: 5rpx;
					right: 4rpx;
				}
			}
		}

		&-box {
			margin-bottom: 91rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			&-img {
				text-align: center;
				position: relative;

				img {
					width: 160rpx;
					height: 160rpx;
					margin-bottom: 20rpx;
					border-radius: 50%;
					position: absolute;
					left: 50%;
					margin-left: -80rpx;
					top: 0;
				}

				button {
					font-size: @top-title;
					color: @white-color;
					height: 256rpx;
					margin: 0;
					padding-top: 180rpx;
					outline: none;
					background: transparent;
				}

				button::after {
					border: none;
				}

				h3 {
					font-size: @top-title;
					color: @white-color;
					display: flex;
					align-items: center;
					height: 76rpx;
					padding-top: 180rpx;

					span {
						font-size: @middle-title;
						padding: 2rpx 16rpx 0 10rpx;
						background: #7e7158;
						display: flex;
						align-items: center;
						border-radius: 26rpx;
						margin-left: 10rpx;

						i {
							margin-right: -9rpx;
							margin-top: -5rpx;
						}
					}
				}
			}
		}

		&-sum {
			margin: 0 30rpx;
			display: flex;

			div {
				flex: 1;
				text-align: center;
				color: @white-color;
				border-right: 1rpx solid #c7baa1;
				font-size: @middle-title;

				&:last-child {
					border-right: 0;
				}
			}
		}
	}
</style>

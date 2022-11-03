<template>
	<view class="auth-box">
		<view class="auth-box-top">
			<image v-if="tginfoLogo" :src="tginfoLogo | urlFilter" mode=""></image>
			<image v-else src="@/static/rcyx-log.png" mode=""></image>
		</view>
		<view class="auth-box-center">
			<view class="auth-box-center-item">
				<u-icon class="auth-box-center-itemicon" size="25"
					name="https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/%E8%B4%A6%E5%8F%B7%403x.png"></u-icon>
				<input class="uni-input" cursor-spacing="10" v-model="form.mobile" :placeholder='defaultLogin.placeholder1' />
			</view>
			<view class="auth-box-center-item">
				<u-icon class="auth-box-center-itemicon" size="25"
					name="https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/%E5%AF%86%E7%A0%81%403x.png"></u-icon>
				<input class="uni-input" cursor-spacing="10" v-model="form.password" type='password' :placeholder='defaultLogin.placeholder2' password-icon
					v-show='defaultLogin.show' />
				<input v-model="form.password" cursor-spacing="10" class="yzm uni-input" type='text' :placeholder='defaultLogin.placeholder2'
					v-show="defaultLogin.login==='快捷登录'" />
				<button v-show="defaultLogin.login==='快捷登录'" type="default" size="mini" class="auth-box-center-item-btn"
					@tap="getCode">{{tips}}</button>
			</view>


			<u-button :custom-style="customStyle" shape="circle" @click="submit">登录</u-button>
		</view>
		<view class="auth-box-bottom">
			<text class="auth-box-bottom-checklogin">
				<text class="auth-box-bottom-checklogin-item"
					@click="checkLogin(logins[0].login,0)">{{logins[0].login}}</text>
				<text class="auth-box-bottom-checklogin-item">|</text>
				<text class="auth-box-bottom-checklogin-item"
					@click="checkLogin(logins[1].login,1)">{{logins[1].login}}</text>
			</text>
			<text class="auth-box-bottom-forgotPwd" v-text="'忘记密码'" v-show="defaultLogin.login==='账号登录'" @click="goRestPwd"></text>
		</view>
		<view class="auth-box-tail">
			<label class="auth-box-tail-label" @click="checkedXy">
				<radio class="auth-box-tail-label-radio" :value="checkedval" :checked="checkedxy"></radio>
				<text class="auth-box-tail-label-text">我已阅读并同意</text>
				<text class="auth-box-tail-label-text1" @click.stop="goxy">《会员注册协议》</text>
			</label>
		</view>
		<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange">
		</u-verification-code>
	</view>
</template>

<script>
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import http from '@/api/http.js';
	import {
		loginIn,
		addressList,
		changePhone,
		couponLogin,
		getTginfoPic
	} from '@/api/interface.js'

	export default {
		data() {
			return {
				checkedxy: false,
				checkedval: '0',
				defaultLogin: {
					login: '账号登录',
					placeholder1: '请输入手机号',
					placeholder2: '请输入密码',
					show: true
				},
				logins: [{
						login: '快捷登录',
						placeholder1: '请输入手机号',
						placeholder2: '请输入验证码',
						show: false
					},
					{
						login: '卡号登录',
						placeholder1: '请输入卡号',
						placeholder2: '请输入卡密',
						show: true
					},
				],
				form: {
					mobile: '',
					password: '',
				},
				customStyle: {
					background: '#9c1d28',
					color: '#ffffff',
					width: '544rpx',
					height: '68rpx',
					// margin: 'auto',
					marginTop: '68rpx',
				},
				tips: '',
				seconds: 60,
				tginfoLogo: '',
			};
		},
		onLoad(options) {
			http.get(getTginfoPic).then(res => {
				if(res){
					this.tginfoLogo = res.tginfoLogo
				}
			})
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		mounted() {},
		methods: {
			goRestPwd() {
				this.$routers.push('/pages/login/main-h5-resetPwd')
			},
			goxy() {
				console.log('xy')
			},
			checkedXy() {
				this.checkedxy = !this.checkedxy
				this.checkedxy ? this.checkedval = '1' : this.checkedval = '0'
			},
			checkLogin(val, i) {
				switch (val) {
					case '快捷登录':
						let container = this.defaultLogin;
						this.defaultLogin = this.logins[i]
						this.logins[i] = container
						break;
					case '卡号登录':
						let container1 = this.defaultLogin;
						this.defaultLogin = this.logins[i]
						this.logins[i] = container1
						break;
					case '账号登录':
						let container2 = this.defaultLogin;
						this.defaultLogin = this.logins[i]
						this.logins[i] = container2
						break;
					default:
						break;
				}
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (!(/^1[3456789]\d{9}$/.test(this.form.mobile))) {
					this.$message.alert('请输入正确的手机号！');
					return;
				}
				if (this.$refs.uCode.canGetCode) {
					this.$message.loading('正在获取验证码');
					http.post(changePhone.sendPhone, {
						userPhone: this.form.mobile
					}).then(res => {
						if (res.success) {
							// 这里此提示会被this.start()方法中的提示覆盖
							this.$message.hide();
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						} else {
							this.$message.alert(res.msg);
						}
					})
				}

			},
			end() {},
			start() {},
			submit() {
				let _this = this;
				if (_this.checkedval === '1') {
					switch (_this.defaultLogin.login) {
						case '快捷登录':
							//参数 userPhone=手机号   code验证码
							if (!(/^1[3456789]\d{9}$/.test(_this.form.mobile))) {
								_this.$message.alert('请输入正确的手机号！');
								return;
							} else if (!_this.form.password) {
								_this.$message.alert('请输入验证码！');
								return;
							}
							let param = {
								userPhone: this.form.mobile,
								code: this.form.password
							}
							http.post(changePhone.loginVerificationCode, param).then(res => {
								if (res.success) {
									let loginInfor = res.dataObj;
									$storage.set('loginInfor', loginInfor);
									$storage.set('userId', loginInfor.userId);
									$storage.set('sessionid', loginInfor.ticketTokenid);
									http.get(addressList).then(res => {
										if (res.length > 0) {
											_this.addressList = res.map(item => {
												if (item.roadName) {
													return {
														name: item.provinceName + item.cityName +
															item
															.areaName + item.roadName + item
															.addressDetail,
														...item
													};
												} else {
													return {
														name: item.provinceName + item.cityName +
															item
															.areaName + item.addressDetail,
														...item
													};
												}
											});
											_this.addressValue = _this.addressList[0].name;
											$storage.set('addressValue', _this.addressValue)

										}

									});
									_this.$routers.back()
								} else {
									_this.$message.alert(res.msg);
								}
							})
							break;
						case '卡号登录':
							if (!this.form.mobile) {
								this.$message.alert('卡号不能为空')
								return;
							}
							if (!this.form.password) {
								this.$message.alert('卡密不能为空')
								return;
							}
							let params1 = {
								cardNumber: this.form.mobile,
								cardPassword: this.form.password
							}
							http.post(couponLogin, params1).then(res => {
								if (res.success) {
									let loginInfor =  JSON.parse(res.dataObj.userInfo);;
									$storage.set('loginInfor', loginInfor);
									$storage.set('userId', loginInfor.userId);
									$storage.set('sessionid', loginInfor.ticketTokenid);
									http.get(addressList).then(res => {
										if (res.length > 0) {
											_this.addressList = res.map(item => {
												if (item.roadName) {
													return {
														name: item.provinceName + item.cityName +
															item
															.areaName + item.roadName + item
															.addressDetail,
														...item
													};
												} else {
													return {
														name: item.provinceName + item.cityName +
															item
															.areaName + item.addressDetail,
														...item
													};
												}
											});
											_this.addressValue = _this.addressList[0].name;
											$storage.set('addressValue', _this.addressValue)

										}

									});
									_this.$routers.back()
								} else {
									_this.$message.alert(res.msg);
								}

							})
							break;
						case '账号登录':
							if (!(/^1[3456789]\d{9}$/.test(_this.form.mobile))) {
								_this.$message.alert('请输入正确的手机号！');
								return;
							} else if (!_this.form.password) {
								_this.$message.alert('请输入密码！');
								return;
							} else {
								let params = {
									loginName: _this.form.mobile,
									passwd: _this.form.password
								}
								http.post(loginIn, params).then(res => {
									if (res.success) {
										let loginInfor = res.dataObj;
										$storage.set('loginInfor', loginInfor);
										$storage.set('userId', loginInfor.userId);
										$storage.set('sessionid', loginInfor.ticketTokenid);
										http.get(addressList).then(res => {
											if (res.length > 0) {
												_this.addressList = res.map(item => {
													if (item.roadName) {
														return {
															name: item.provinceName + item
																.cityName +
																item
																.areaName + item.roadName + item
																.addressDetail,
															...item
														};
													} else {
														return {
															name: item.provinceName + item
																.cityName +
																item
																.areaName + item.addressDetail,
															...item
														};
													}
												});
												_this.addressValue = _this.addressList[0].name;
												$storage.set('addressValue', _this.addressValue)

											}

										});
										_this.$routers.back()
									} else {
										_this.$message.alert(res.msg);
									}
								})
							}
							break;
						default:
							break;
					}
				} else {
					_this.$message.alert('请勾选《会员注册协议》');
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

	.auth-box {
		&-top {
			width: 100%;
			height: 33vh;
			display: flex;
			justify-content: center;
			align-items: center;
			image {
				width: 312rpx;
				height: 262rpx;
			}
		}

		&-center {
			padding: 0 66rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-item {
				width: 544rpx;
				display: flex;
				justify-content: center;

				.uni-input-placeholder {
					color: #c1bdbe;
				}

				input {
					font-size: 24rpx;
					padding-left: 20rpx;
					height: 44rpx;
					width: 508rpx;
					border-bottom: 1px solid #ECECEC;
				}

				&-btn {
					min-width: 180rpx;
					height: 44rpx;
					line-height: 44rpx;
					font-size: 10rpx;
					text-align: center;
					background: #9c1d28;
					color: #ffffff;
					border-radius: 180rpx;
				}
			}

			&-item:nth-child(2) {
				margin-top: 60rpx;
			}
		}

		&-bottom {
			width: 100%;
			display: flex;
			justify-content: space-between;
			margin-top: 45rpx;
			padding: 0 115rpx;

			&-checklogin {
				&-item:nth-child(2) {
					// border: 1px solid #f0f2f5;
					margin: 6rpx 12rpx;
					color: #D8D8D8;
				}
			}
		}

		&-tail {
			width: 100%;
			position: fixed;
			bottom: 0;
			margin-bottom: 30rpx;
			display: flex;
			justify-content: center;

			&-label {
				display: flex;
				align-items: center;

				&-radio {
					transform: scale(0.6)
				}

				&-text {
					font-size: 20rpx;
				}

				&-text1 {
					font-size: 20rpx;
					color: #558fb0;
				}
			}
		}
	}
</style>

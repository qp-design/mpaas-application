<template>
	<view class="auth-box">
		<view class="auth-box-center">
			<view class="auth-box-center-item">
				<u-icon class="auth-box-center-itemicon" size="25"
					name="https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/%E8%B4%A6%E5%8F%B7%403x.png"></u-icon>
				<input  class="uni-input" cursor-spacing="10" v-model="form.mobile" :placeholder='defaultLogin.placeholder1' />
			</view>
			<view class="auth-box-center-item">
				<u-icon class="auth-box-center-itemicon" size="25"
					name="https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/%E5%AF%86%E7%A0%81%403x.png"></u-icon>
				<input  class="uni-input" cursor-spacing="10" v-model="form.code" type='text' :placeholder='defaultLogin.placeholder2' />
				<button type="default" size="mini" class="auth-box-center-item-btn"
					@tap="getCode">{{tips}}</button>
			</view>
			<view class="auth-box-center-item">
				<u-icon class="auth-box-center-itemicon" size="25"
					name="https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/%E5%AF%86%E7%A0%81%403x.png"></u-icon>
				<input  class="uni-input" cursor-spacing="10" v-model="form.password" type='password' :placeholder='defaultLogin.placeholder3' password-icon />
			</view>

			<u-button :custom-style="customStyle" shape="circle" @click="submit">提交</u-button>
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
		changePhone,
		updateUmuserPw
	} from '@/api/interface.js'

	export default {
		data() {
			return {
				checkedxy: false,
				checkedval: '0',
				defaultLogin: {
					login: '忘记密码',
					placeholder1: '请输入手机号',
					placeholder2: '请输入验证码',
					placeholder3: '请输入新密码',
				},
				form: {
					mobile: '',
					code: '',
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
			};
		},
		onLoad(options) {},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		mounted() {},
		methods: {
			goRestPwd() {
				console.log('goRestPwd')
			},
			goxy() {
				console.log('xy')
			},
			checkedXy() {
				this.checkedxy = !this.checkedxy
				this.checkedxy ? this.checkedval = '1' : this.checkedval = '0'
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
				if (!(/^1[3456789]\d{9}$/.test(this.form.mobile))) {
					this.$message.alert('请输入正确的手机号！');
					return;
				}else if (!this.form.code) {
					this.$message.alert('验证码不能为空！');
					return;
				}else if (!this.form.password) {
					this.$message.alert('新密码不能为空！');
					return;
				}else{
					let params = {
						userPhone: this.form.mobile,
						code: this.form.code,
						userPwsswd: this.form.password
					}
					http.post(updateUmuserPw,params).then( res => {
						if(res.success){
							this.$message.alert(res.msg);
							this.$routers.back();
						}else {
							this.$message.alert(res.msg);
						}
					})
				}
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '@/common/css/common.less';

	.auth-box {

		&-center {
			padding: 0 66rpx;
			padding-top: 200rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

			&-item {
				margin-top: 60rpx;
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

			/* &-item:nth-child(1,3) {
				margin-top: 60rpx;
			} */
		}
	}
</style>

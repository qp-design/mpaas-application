<template>
	<div class="paySet">
		<div class="header">
			<div class="content">
				<!--<h3>设置积分支付密码</h3>-->
				<div class="line t-box" v-if="isHavePw">
					<span class="t-box-flex1">旧密码</span>
					<div class="child"><input type="number" :password="true" maxlength="6" placeholder="请输入旧密码" v-model="oldPwd" /></div>
				</div>
				<!--<div class="line t-box code">
					<span class="t-box-flex1">验证码</span>
					<div class="child t-box-flex1 "><input type="text" placeholder="请输入验证码"  v-model="code"/> </div>
					<p class="getCode">{{codeVal}}</p>
        </div>-->
				<div class="line t-box">
					<span class="t-box-flex1">新密码</span>
					<div class="child"><input type="number" :password="true" maxlength="6" placeholder="请输入新密码" v-model="pwd" /></div>
				</div>
				<div class="line t-box">
					<span class="t-box-flex1">确认新密码</span>
					<div class="child"><input type="number" :password="true" maxlength="6" placeholder="请输入新密码" v-model="pwdConfirm" /></div>
				</div>
			</div>
			<view class="tip">
				<p class="thisTip">密码必须是6位数字</p>
				<view class="forget" @click="goReset">
					忘记密码
				</view>
			</view>
			
			<!-- <article class="bg-white set-newPhone5">
        <div class="change">

          <ul>
            <li>
              <div class="auto border-b pad-bt">
                <router-link class="t-box" style="display: flex;">
                  <p class="t-box-flex1 f-s26">
                    新手机号码

                  </p>
                  <input type="text" v-model="phones" placeholder="请输入手机号码" class="changePhone" style="flex: 1;">
                </router-link>
              </div>
            </li>
            <li>
              <div class="auto border-b pad-bt">
                <div class="t-box" style="display: flex;">
                  <p class="t-box-flex1 f-s26" style="flex: 1;">

                    <input type="text" class="inputs changeCode" v-model="num" placeholder="请输入验证码" style="flex: 1;">

                  </p>
                  <span class="code c-theme border-theme" @click="codes">{{code}}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </article> -->
			<!--<p class="forgetPwd" v-if="isHavePw" @click="pay">忘记支付密码?</p>-->
			<div class="bottom"><p class="confirm" @click="confirm">确定</p></div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { changePwd, CheckPaywd, changePhone } from '@/api/interface';
export default {
	data() {
		return {
			//codeVal: "获取验证码",
			//code:"",
			oldPwd: '',
			pwd: '',
			pwdConfirm: '',
			isHavePw: false,
			time: 60,
			num: '',
			pass: true,
			code: '获取验证码',
			phones: ''
		};
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted() {
		http.get(CheckPaywd).then(res => {
			this.isHavePw = res;
		});
	},
	methods: {
		//忘记密码
		goReset(){
			this.$routers.push('/pages/mine/resetPwd/resetPwd')
		},
		phoneValidation(phone) {
			var rePhone = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if (phone == '') {
				this.$message.alert('手机号不能为空')
				return false;
			} else if (rePhone.test(phone)) {
				return true;
			} else {
				this.$message.alert('请输入正确的手机号')
				return false;
			}
		},
		codes() {
			if (this.phoneValidation(this.phones)) {
				if (this.pass) {
					http.post(changePhone.sendPhone, {
						userPhone: this.phones
					})
						// this.$fetch(changePhone.sendPhone, {
						//   userPhone: this.phones
						// })
						.then(res => {
							if (res.success) {
								this.$message.alert(res.msg)
								let time = 60;
								const set = setInterval(() => {
									this.code = '剩余' + time-- + '秒';
									this.pass = false;
									if (time < 0) {
										clearInterval(set);
										this.pass = true;
										this.code = '获取验证码';
									}
								}, 1000);
							}
						});
				} else {
					this.$message.alert('请稍后点击获取')
				}
			}
		},
		confirm() {
			let regp = /^[a-zA-Z0-9]{6,12}$/;
			let val = /^\d{6}$/;
			if (this.isHavePw && this.oldPwd == '') {
				this.$message.alert('请输入旧密码')
				return;
			}
			if (this.pwd == '') {
				this.$message.alert('请输入密码')
				return;
			} else if (!val.test(this.pwd)) {
				this.$message.alert('请输入6位数字密码')
				return;
			}
			if (this.pwdConfirm == '') {
				this.$message.alert('确认密码不能为空')
				return;
			} else if (!val.test(this.pwdConfirm)) {
				this.$message.alert('请输入6位确认密码')
				return;
			}
			if (this.pwd == this.pwdConfirm) {
				let data = {
					oldUserPaywd: this.oldPwd,
					userPaywd: this.pwd
				};
				http.get(changePwd, data)
					// this.$fetchGet(changePwd, data)
					.then(res => {
						console.log(res);
						if (res.success) {
							this.$message.alert(res.msg)
							this.$routers.back()
						} else {
							this.$message.alert(res.msg)
						}
					});
			} else {
				this.$message.alert('两次密码输入不一致')
			}
		},
		pay() {
			this.$routers.push({
				name: 'payPwd'
			});
		}
		//			sendPhone() {
		//				if(this.time == 60) {
		//					let data={
		//						userPhone: this.phone
		//					}
		//					this.$fetchGet(changePhone.sendPhone).then(res => {
		//						if(res.success) {
		//							this.$message({
		//								message: res.msg,
		//								type: 'success'
		//							});
		//							var times = setInterval(() => {
		//								if(this.time < 1) {
		//									this.codeVal = "获取验证码"
		//									clearInterval(times)
		//									this.time = 60;
		//								} else {
		//									this.time--;
		//									this.codeVal = "重新发送" + this.time + "秒";
		//								}
		//							}, 1000)
		//						}
		//					})
		//				}
		//			}
	}
};
</script>

<style lang="less" scoped>
.paySet {
	width: 100%;
	height: 100%;
	background-color: #fff;

	.forgetPwd {
		margin: 40rpx 20rpx;
		color: #40affe;
	}
	.tip{
		display: flex;
		margin: 40rpx 30rpx;
		justify-content: center;
		.forget{
			flex: 1;
			text-align: right;
			color: #EB2B27;
		}
	}
	.thisTip {
	width: 200rpx;
		color: #999;
		font-size: 20rpx;
	}

	// background-color: #f2f2f2;
	.content {
		background-color: #ffffff;
		padding: 0 30rpx;

		h3 {
			font-weight: 700;
			height: 80rpx;
			line-height: 80rpx;
			font-size: 26rpx;
			color: #333333;
		}

		.line {
			height: 110rpx;
			line-height: 110rpx;
			border-bottom: 0.5rpx solid #f6f6f8;
			display: flex;
			justify-content: center;

			span {
				// display: block;
				/*width: 130rpx;*/
			}

			.child {
				flex: 1;

				input {
					height: 110rpx;
					/*width: 400rpx;*/
					/*height: 100%;*/
					width: 100%;
					
					text-align: right;
					// align-items: center;
				}

				input::-webkit-input-placeholder {
					color: #ccc;
					font-size: 26rpx;
				}

				input::-moz-placeholder {
					/* Mozilla Firefox 19+ */
					color: #ccc;
					font-size: 26rpx;
				}

				input:-moz-placeholder {
					/* Mozilla Firefox 4 to 18 */
					color: #ccc;
					font-size: 26rpx;
				}

				input:-ms-input-placeholder {
					/* Internet Explorer 10-11 */
					color: #ccc;
					font-size: 26rpx;
				}
			}
		}

		.code {
			width: 470rpx;
			position: relative;

			.getCode {
				position: absolute;
				right: -240rpx;
				width: 212rpx;
				height: 73rpx;
				background-color: #6c7f95;
				text-align: center;
				line-height: 73rpx;
				bottom: 0;
				color: #ffffff;
				border-radius: 5rpx;
			}
		}

		.none {
			border: none;
		}
	}

	.bottom {
		margin-top: 105rpx;

		.confirm {
			display: block;

			height: 80rpx;
			width: 90%;
			text-align: center;
			color: #ffffff;
			line-height: 78rpx;
			font-size: 32rpx;
			margin: 0 auto;
			border-radius: 200rpx;
			background: #eb2b27;
		}
	}
}

.set-newPhone5 {
	.auto {
		margin: 0 30rpx;
	}

	.pad-bt {
		padding: 40rpx 0;

		a {
			height: 40rpx;

			h3 {
				position: relative;
				top: 10rpx;
			}
		}
	}

	.changePhone {
		text-align: right;
	}

	.heights {
		font-size: 20rpx;
		color: #666666;
	}

	.icon-shanchu3 {
		font-size: 36rpx;
	}

	.code {
		color: #eb2b27;
		padding: 15rpx 20rpx;
		text-align: center;
		border: 1rpx solid #eb2b27;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 50rpx;
		// color: #b79f77;
	}

	.set-loginOut {
		margin: 90rpx 40rpx;

		button {
			height: 84rpx;
			width: 590rpx;
			font-size: 30rpx;
			// background-color: #f80003;
			color: #ffffff;
			border-radius: 5rpx;
		}
	}

	.inputs {
		width: 45%;
	}

	::-webkit-input-placeholder {
		color: #cccccc;
		font-size: 26rpx;
	}

	:-moz-placeholder {
		color: #cccccc;
		font-size: 26rpx;
	}

	::-moz-placeholder {
		color: #cccccc;
		font-size: 26rpx;
	}

	:-ms-input-placeholder {
		color: #cccccc;
		font-size: 26rpx;
	}
}
</style>

<template>
	<view>
		<view class="bindPhone">
			<view class="phone">
				{{userPhone}}
			</view>
			<view class="text">
				已绑定的手机号码
			</view>
		</view>
		<view class="phoneCode">
			<input type="text" value="" v-model="code" placeholder="请输入验证码"/>
			<view class="btn" v-if="timeFlag" @click="getCode">
				获取验证码
			</view>
			<view class="btn1" v-else >
				{{timeSecond}}
			</view>
		</view>
		<view class="next" @click="goNext">
			下一步
		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {getUserservice,sendPhone,checkVerificationMa} from "@/api/newApi.js"
	export default {
		data() {
			return {
				userId:"",
				userPhone:"",
				code:"",
				timeFlag:true,
				timeSecond:60,
				userinfoPhone:""
			}
		},
		onLoad(){
			this.userId=uni.getStorageSync('userId');
			http.get(getUserservice,{userId:this.userId}).then(res=>{
				if(res){
					this.userPhone= res.userPhone
					this.userinfoPhone = res.userinfoPhone
				}
				console.log(res,"res")
			})
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		methods: {
			getCode(){
				http.get(sendPhone,{userPhone:this.userinfoPhone,channelCode:"channelCode"}).then(res=>{
					if(res.success){
						this.timeFlag=false
						var timeId=setInterval(()=>{
							if(this.timeSecond>0){
								this.timeSecond--
							}
							else{
								clearInterval(timeId)
								this.timeFlag=true
								this.timeSecond=60
							}
						},1000)
					}
				})
			},
			goNext(){
				http.get(checkVerificationMa,{userPhone:this.userinfoPhone,channelCode:"channelCode",code:this.code}).then(res=>{
					if(res.success){
						this.$routers.push('/pages/mine/resetPwd/newPassword')
					}
					else{
						this.$message.alert('验证码错误，请重新输入');
					}
				})
			}
		}
	}
</script>

<style lang="less">
.bindPhone{
	margin-top: 199rpx;
	margin-left: 65rpx;
	.phone{
		color: #000;
		font-size: 64rpx;
		font-weight: 500;
		margin-bottom: 10rpx;
	}
	.text{
		color: rgba(0, 0, 0, 0.3);
		font-size: 32rpx;
	}
}
.phoneCode{
	margin: 300rpx 65rpx 0;
	display: flex;
	height: 100rpx;
	align-items: center;
	justify-content: space-between;
	border-bottom: 2rpx solid #CCCCCC;
	input{
		font-size: 28rpx;
	}
	.btn{
		color: #EB2B27;
		font-size: 28rpx;
	}
	.btn1{
		width: 100rpx;
		display: flex;
		justify-content: center;
		color: #bbbbbb;
		font-size: 38rpx;
	}
}
.next{
	position: fixed;
	bottom: 100rpx;
	left: 65rpx;
	width: 620rpx;
	height: 80rpx;
	border-radius: 40rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #EB2B27 ;
	color: #fff;
}
</style>

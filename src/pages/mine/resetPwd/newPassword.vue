<template>
	<view class="newPassword">
		<view class="newPwd">
			<view class="text">新密码</view>
			<input type="number" :password="true" maxlength="6" placeholder="请输入新密码" v-model="pwd" />
		</view>
		<view class="newPwd">
			<view class="text">确认新密码</view>
			<input type="number" :password="true" maxlength="6" placeholder="请输入新密码" v-model="pwdConfirm" />
		</view>
		<view class="thisTip">密码必须是6位数字</view>
		<view class="btn" @click="confirm">提交</view>
	</view>
</template>

<script>
import http from '@/api/http.js';
import { updateUserPaywd } from '@/api/newApi.js';
export default {
	data() {
		return {
			pwdConfirm: '',
			pwd: ''
		};
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods: {
		confirm(){
			let regp = /^[a-zA-Z0-9]{6,12}$/;
			let val = /^\d{6}$/;
			if(this.pwd==""){
				this.$message.alert('请输入密码')
				return 
			}
			else if(!val.test(this.pwd)){
				this.$message.alert('请输入6位数字密码')
				return 
			}
			if(this.pwdConfirm==""){
				this.$message.alert('请输入确认密码')
				return 
			}
			else if (!val.test(this.pwdConfirm)) {
				this.$message.alert('请输入6位确认密码')
				return;
			}
			if (this.pwd == this.pwdConfirm){
				http.get(updateUserPaywd,{userPaywd:this.pwd,channelCode:"channelCode"}).then(res=>{
					if(res.success){
						this.$message.alert(res.msg)
						setTimeout(()=>{
							this.$routers.switchTab('mine')
						},1000)
						
							
					}
				})
			}
			else{
				this.$message.alert('两次密码输入不一致')
			}
		}
	}
};
</script>

<style lang="less">
.newPassword {
	padding: 65rpx;
	.newPwd {
		height: 138rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid #e5e5e5;
		.text {
			color: #000;
			font-size: 28rpx;
		}
		input {
			text-align: right;
		}
	}
	.thisTip {
		padding-top: 24rpx;
		color: rgba(0, 0, 0, 0.3);
		font-size: 24rpx;
	}
	.btn {
		position: fixed;
		bottom: 100rpx;
		left: 65rpx;
		width: 620rpx;
		height: 80rpx;
		border-radius: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #eb2b27;
		color: #fff;
	}
}
</style>

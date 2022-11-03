<template>
	<view class="paySuccess">
		<!-- 内容区 -->
		<view class="successContent">
			<view class="successTitle">登录成功</view>
			<view class="successButton" @click="goIndex()" :style="{background:baseColor}">回到首页</view>
		</view>
	</view>
</template>

<script>
import commidityList from '@/components/commidityList.vue';
import {
	$storage,
	$message,
	$routers
} from '@/utils/prototype/vue.js'
export default {
	components: {
		commidityList
	},
	data() {
		return {
			
		};
	},
	created() {
	},
	onLoad(e){
		var loginData = JSON.parse(e.loginData);
		$storage.set('loginInfor', loginData);
		$storage.set('userId', loginData.userId);
		$storage.set('sessionid', loginData.ticketTokenid);
		
		let miniToken = $storage.get('miniToken');
		let cookie = loginData.ticketTokenid;
		let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$domain.substring(8) + '; Path=/';
		$storage.set('miniUserName', miniCookie);
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods: {
		goIndex() {
			uni.switchTab({
				url: '/pages/index/main'
			});
		}
	}
};
</script>

<style lang="less">
.car-header {
	position: fixed;
	top: 0rpx;
	width: 100%;
	z-index: 999;
	color: white;
	.backButton {
		position: absolute;
		left: 20rpx;
		bottom: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
	}
	.centerText {
		width: 100%;
		text-align: center;
		font-size: 34rpx;
		font-weight: 500;
	}
}
.paySuccess {
	.successContent {
		.successTitle {
			margin: 300rpx auto 50rpx;
			text-align: center;
			font-size: 48rpx;
			font-weight: bold;
			color: #333;
		}
		.successButton {
			width: 208rpx;
			height: 74rpx;
			line-height: 74rpx;
			text-align: center;
			font-size: 26rpx;
			font-weight: 500;
			border-radius: 37rpx;
			color: white;
			margin: 0 auto;
		}
	}
}
</style>

<template>
	<view class="user-headerB">
		<view class="user-info">
			<image class="header-img" :src="headerImg" mode="aspectFit" @click="goPersonal"></image>
			<view class="user-info-right">
				<view class="user-name">{{ userName }}</view>
				<view class="user-level" v-bind:style='{color: baseColor}'>{{ userLevel }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'header-b',
	props: ['userName', 'headerImg', 'userLevel', 'baseColor'],
	data() {
		return {};
	},
	methods: {
		back() {
			this.$routers.back();
		},
		goPersonal() {
			this.$routers.push('user_modules/personal/index');
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@/common/css/common.less';
.user-headerB {
	height: 290rpx;
	background: url('@{base-img-domain}/wxminiImg/user_bg.jpg') no-repeat;
	background-size: cover;

	.user-info {
		display: flex;
		margin: @margin-lr;
		position: relative;
		top: 105rpx;

		.header-img {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			overflow: hidden;
		}
		.user-info-right {
			padding-left: 20rpx;
			.user-level{
				font-size: 28rpx;
				padding-top: 10rpx;
			}
			.user-name {
				color: @white-color;
				font-size: 28rpx;
				padding-bottom: 10rpx;
			}
		}
	}
}
</style>

<template>
	<view class="common-header" :class="{ 'have-border': borderBottom }">
		<view
			class="left-icon"
			v-show="leftIcon"
			@click="
				() => {
					$routers.back()
				}
			"
		>
			<view class="iconfont">&#xe62d;</view>
		</view>
		<view class="title">{{ title }}</view>
		<view class="right-icon" v-show="rightIcon"><slot name="right"></slot></view>
	</view>
</template>

<script>
export default {
	props: {
		title: {
			type: String,
			default: ''
		},
		leftIcon: {
			type: Boolean,
			default: false
		},
		rightIcon: {
			type: Boolean,
			default: false
		},
		borderBottom: {
			type: Boolean,
			default: true
		}
	}
};
</script>

<style lang="less" scoped>
.common-header {
	position: fixed;
	top: 37rpx;
	left: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 90rpx;
	padding: 0 30rpx;
	font-size: 30rpx;
	background: #fff;
	width: 100%;
	&.have-border {
		border-bottom: 1rpx solid #eaeaea;
	}
	.title {
		width: 356rpx;
		text-align: center;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
	.left-icon {
		position: absolute;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		top: 0;
		left: 30rpx;
		width: 60rpx;
	}
	.right-icon {
		position: absolute;
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
		top: 0;
		right: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>

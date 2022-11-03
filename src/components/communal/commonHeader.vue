<template>
	<div class="commonHeader" :style="{ marginTop: navBarHeight + 'px' }" :class="{ 'have-border': borderBottom }">
		<div
			class="commonHeader-leftIcon"
			v-show="leftIcon"
			@click="
				() => {
					$routers.back(1, { stay: 500 });
				}
			"
		>
			<i class="iconfont">&#xe62d;</i>
		</div>
		<div class="commonHeader-title">{{ title }}</div>
		<div class="commonHeader-rightIcon" v-show="rightIcon"><slot name="right"></slot></div>
	</div>
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
		navBarHeight: {
			type: String,
			default: ''
		},
		borderBottom: {
			type: Boolean,
			default: true
		}
	}
};
</script>

<style lang="less" scoped>
.commonHeader {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 90rpx;
	width: calc(100% - 60rpx);
	padding: 0 30rpx;
	font-size: 30rpx;
	background: #fff;
	width: 100%;
	&.have-border {
		border-bottom: 1rpx solid #eaeaea;
	}
	&-title {
		width: 356rpx;
		text-align: center;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
	}
	&-leftIcon {
		position: absolute;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		top: 0;
		left: 30rpx;
		width: 60rpx;
	}
	&-rightIcon {
		position: absolute;
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
		top: 0;
		right: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		// width:60rpx;
	}
}
</style>

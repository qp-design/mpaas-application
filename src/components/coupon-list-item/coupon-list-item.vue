<template>
	<div class="coupon-item-wrap">
		<div :key="index" class="coupon-item" v-for="(item, index) in list">
			<div class="con">
				<div class="info">
					<p class="title">{{ item.promotionName }}</p>
					<!-- 优惠说明 discName -->
					<p class="rule" v-if="item.discName">{{ item.discName }}</p>
					<div class="more">
						<p v-if="item.dataState == 0 && item.pbCode === '0004'">{{ item.condConstraint }}</p>
						<p>有效期：{{ item.promotionBegintime }} ~ {{ item.promotionEndtime }}</p>
					</div>
				</div>
			</div>
			<div class="action">
				<p @click="submit(item, index)">领取</p>
				<p class="some-title">
					剩余
					<span class="some">{{ item.couponOnceNums || 0 }}张</span>
				</p>
				<div class="diamond-ul"><span :key="idx" v-for="(round, idx) in 14"></span></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'coupon-list-item',
	props: ['list'],
	data() {
		return {};
	},
	methods: {
		submit(data, index) {
			this.$emit('getCoupon', data, index);
		},
		toDetil(item) {}
	}
};
</script>

<style scoped lang="less">
.coupon-item-wrap {
	padding: 0 21rpx;
	.coupon-item {
		display: -webkit-box;
		width: 709rpx;
		height: 223rpx;
		background-color: #ffffff;
		border: solid 1rpx #ededed;
		margin-top: 26rpx;
	}
	.action {
		width: 155rpx;
		height: 221rpx;
		background-color: #ff655c;
		padding-top: 8rpx;
		box-sizing: border-box;
		position: relative;
		font-size: 22rpx;
		line-height: 26rpx;
		letter-spacing: 2rpx;
		color: #ffffff;
		text-align: center;
		p {
			padding: 10rpx 0;
			margin: 18rpx auto;
			border: white 1rpx solid;
			width: 80%;
			border-radius: 30rpx;

			.some {
				display: block;
			}
		}
		.some-title {
			border: 0;
			margin-top: 0;
			padding: 0;
		}
	}
	.diamond-ul {
		position: absolute;
		left: -5rpx;
		top: 0;
		span {
			width: 11rpx;
			height: 11rpx;
			display: block;
			background: #fff;
			border-radius: 50%;
			margin-top: 4.5px;
		}
	}
	.con {
		-webkit-box-flex: 1;
		width: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0rpx 0rpx 30rpx #eee;
		.title {
			font-size: 36rpx;
			line-height: 40rpx;
			color: #ff655c;
			font-weight: 700;
		}
		.info {
			.rule {
				font-size: 30rpx;
				font-weight: 700;
				color: #333333;
				line-height: 40rpx;
				margin-bottom: 15px;
				margin: 20px 0;
				color: #666;
			}
			.more {
				font-size: 30rpx;
				line-height: 32rpx;
				margin-top: 20rpx;
				p {
					color: #666666;
				}
			}
		}
	}
}
</style>

<template>
	<view class="order">
		<view class="state">
			<view class="left">
				<text class="iconfont">&#xe675;</text>
				<view>待成团</view>
			</view>
			<view class="right">注:未拼团成功金额自动反还</view>
		</view>

		<view class="info">
			<view class="message">
				<view class="username">琏茶</view>
				<view class="userphone">13699999999</view>
			</view>
			<view class="address">广州市天河区珠江新城华穗路6号</view>
		</view>

		<view class="goodsInfo">
			<view class="title">商品信息</view>
			<view class="main">
				<view class="item">
					<view class="left"></view>
					<view class="right">
						<view class="gname">3M护目镜 SF300系列透明款防风沙居家旅</view>
						<view class="gspec">
							<view class="specName">SF301AF系列，【标准套装】</view>
							<view class="specNum">×2</view>
						</view>
						<view class="gprice">
							<view class="now">¥9.99</view>
							<view class="old">¥99.99</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="pay">
			<view class="payMoney">
				<view class="left">商品金额</view>
				<view class="right">¥399</view>
			</view>
			<view class="payMethod">
				<view class="left">支付方式</view>
				<view class="right">线上支付</view>
			</view>
		</view>

		<view class="logis">
			<view class="wlMethod">
				<view class="left">配送方式</view>
				<view class="right">普通快递</view>
			</view>
			<view class="wlMoney">
				<view class="left">邮费</view>
				<view class="right">包邮</view>
			</view>
			<view class="wlLeave">
				<view class="left">留言</view>
				<view class="right">无</view>
			</view>
		</view>

		<view class="detail">
			<view class="orderNum">
				<view class="left">订单编号</view>
				<view class="right">2021070474812738</view>
			</view>
			<view class="placeTime">
				<view class="left">下单时间</view>
				<view class="right">2021-04-01 00:10:32</view>
			</view>
			<view class="payMoney">
				<view class="left">支付方式</view>
				<view class="right">在线支付</view>
			</view>
			<view class="payTime">
				<view class="left">支付时间</view>
				<view class="right">2021-04-01 00:10:32</view>
			</view>
		</view>

		<view class="payBtn">
			<view class="show">
				<view class="left">
					<text>总计:</text>
					<text>¥998.00</text>
				</view>
				<view class="right">立即支付</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
};
</script>

<style lang="less" scoped>
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
.order {
	width: 100%;
	background-color: #f5f5f5;
	padding-bottom: 186rpx;

	.state {
		width: 100%;
		height: 96rpx;
		background: #eb2b27;
		padding: 0 36rpx;
		border-radius: 0 0 24rpx 24rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24rpx;

		.left {
			display: flex;
			align-items: center;
			text {
				color: #fff;
			}
			view {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #ffffff;
			}
		}

		.right {
			font-size: 20rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #ffffff;
		}
	}

	.info {
		width: 100%;
		height: 164rpx;
		background-color: #fff;
		border-radius: 24rpx;
		margin-bottom: 24rpx;
		padding: 36rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.message {
			display: flex;
			align-items: center;

			.username {
				font-size: 28rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #262626;
				margin-right: 36rpx;
			}

			.userphone {
				font-size: 28rpx;
				font-family: Helvetica;
				color: #262626;
			}
		}
	}

	.goodsInfo {
		width: 100%;
		border-radius: 24rpx;
		background-color: #fff;
		margin-bottom: 24rpx;
		padding: 40rpx 24rpx 0;

		.title {
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #000000;
			margin-bottom: 12rpx;
		}

		.main {
			width: 100%;

			.item {
				width: 100%;
				height: 208rpx;
				padding: 24rpx 0;
				display: flex;

				.left {
					width: 160rpx;
					height: 160rpx;
					background-color: rgba(0, 0, 0, 0.3);
					margin-right: 24rpx;
				}

				.right {
					flex: 1;
					height: 160rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.gname {
						font-size: 24rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #000000;
					}

					.gspec {
						display: flex;
						justify-content: space-between;
						.specName {
							font-size: 20rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #595959;
						}
						.specNum {
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #b4b4b4;
						}
					}

					.gprice {
						display: flex;
						.now {
							font-size: 28rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #eb2b27;
							margin-right: 24rpx;
						}

						.old {
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #999999;
							text-decoration: line-through;
							position: relative;
							bottom: -2rpx;
						}
					}
				}
			}
		}
	}

	.pay {
		width: 100%;
		height: 176rpx;
		background-color: #fff;
		margin-bottom: 24rpx;
		border-radius: 24rpx;
		padding: 40rpx 24rpx;

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.payMoney {
			display: flex;
			justify-content: space-between;
			.left {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
			.right {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
		}

		.payMethod {
			display: flex;
			justify-content: space-between;
			.left {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
			.right {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
		}
	}

	.logis {
		width: 100%;
		height: 212rpx;
		background-color: #fff;
		border-radius: 24rpx;
		margin-bottom: 24rpx;
		padding: 40rpx 24rpx;

		.wlMethod {
			display: flex;
			justify-content: space-between;
			.left {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
			.right {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
			}
		}
		.wlMoney {
			display: flex;
			justify-content: space-between;
			margin-bottom: 30rpx;
			.left {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999;
			}
			.right {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999;
			}
		}
		.wlLeave {
			display: flex;
			justify-content: space-between;
			.left {
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333;
			}
			.right {
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #999;
			}
		}
	}

	.detail {
		width: 100%;
		height: 312rpx;
		border-radius: 24rpx;
		background-color: #fff;
		margin-bottom: 24rpx;
		padding: 40rpx 24rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.orderNum {
			display: flex;
			justify-content: space-between;
		}
		.placeTime {
			display: flex;
			justify-content: space-between;
		}
		.payMoney {
			display: flex;
			justify-content: space-between;
		}
		.payTime {
			display: flex;
			justify-content: space-between;
		}
	}

	.payBtn {
		width: 100%;
		height: 166rpx;
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		padding-top: 10rpx;

		.show {
			width: 100%;
			height: 80rpx;
			padding: 0 24rpx;

			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				display: flex;
				align-items: center;
				text:first-child{
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #000000;
					margin-right: 15rpx;
				}
				text:last-child{
					
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #EB2B27;
				}
			}
			.right {
				width: 296rpx;
				height: 80rpx;
				background: #eb2b27;
				border-radius: 40rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 32rpx;
				font-family: PingFangSC-Semibold, PingFang SC;
				font-weight: 600;
				color: #ffffff;
			}
		}
	}
}
</style>

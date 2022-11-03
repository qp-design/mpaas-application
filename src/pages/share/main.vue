<template>
	<view class="share">
		<u-navbar background="" :border-bottom="false" title="分享推广" title-color="#fff" back-icon-color="#fff"></u-navbar>
		<view class="share_bg">
			<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/share_bg.png" mode="widthFix"></image>
		</view>
		<view class="all block1">
			<view class="rules" @click="isShowRules=true">
				<view class="img">
					<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/%E7%9F%A9%E5%BD%A2%402x.png" mode="widthFix"></image>
				</view>
				<text>规则</text>
			</view>
			<button class="shareFriend" open-type="share"> 立即邀请微信好友 </button>
			<view class="face" @click="jump('codes/main')">
				面对面邀请
				<u-icon name="arrow-right" color="#888E9B" size="28"></u-icon>
			</view>
		</view>
		<view class="all block2">
			<view class="title"> 参与步骤 </view>
			<view class="row">
				<view><text class="iconfont icon-tuiguang-send"></text> 发送好友、群聊 </view>
				<view><text class="iconfont icon-three-right"></text></view>
				<view><text class="iconfont icon-tuiguang-register"></text> 新用户注册下单 </view>
			</view>
			<view class="rightIcon">
				<text class="iconfont icon-three-down"></text>
			</view>
			<view class="row">
				<view><text class="iconfont icon-tuiguang-money"></text> 14天后佣金到账 </view>
				<view><text class="iconfont icon-three-left"></text></view>
				<view><text class="iconfont icon-tuiguang-confirm"></text> 新用户确认收货 </view>
			</view>
		</view>
		<view class="all block3">
			<view class="title"> 分享规则 </view>
			<view class="p"> 分享商城：用户在“我的”-“邀请有礼”点击“立即邀请微信好友”，选择您想邀请的好友即可或点击“面对面邀请”显示商城二维码，可下载到本地相册，好友扫码进入商城。</view>
			<view class="p"> 分享返佣商品：打开返佣产品，点击右上角分享给您想邀请的好友。</view>
			<view class="p"> 本功能只针对分享您‘未注册’的好友才可返佣给您，一旦您的好友通过您的分享注册后，将永久绑定，日后您的好友购买任何返佣商品都会按照返佣比例返佣给您。已注册好友通过您分享的二维码或链接进入商城品不进行绑定，未绑定成功的好友购买返佣商品无法返佣给您。</view>
		</view>
		<view class="all block4">
			<view class="title"> 分享记录 </view>
			<view class="shareBtn" @click="jump('record/main')"> 查看分享记录 </view>
		</view>
		<view class="black" v-if="isShowRules" @click="isShowRules=false">
			<view class="popup">
				<view class="content">
					<view class="rulesTitle">规则</view>
					<view class="text">
						<view> 分享规则</view>
						<view> 分享商城：用户在“我的”-“邀请有礼”点击“立即邀请微信好友”，选择您想邀请的好友即可或点击“面对面邀请”显示商城二维码，可下载到本地相册，好友扫码进入商城。</view>
						<view> 分享返佣商品：打开返佣产品，点击右上角分享给您想邀请的好友。</view>
						<view> 本功能只针对分享您‘未注册’的好友才可返佣给您，一旦您的好友通过您的分享注册后，将永久绑定，日后您的好友购买任何返佣商品都会按照返佣比例返佣给您。已注册好友通过您分享的二维码或链接进入商城品不进行绑定，未绑定成功的好友购买返佣商品无法返佣给您。</view>
						<view> 返佣规则</view>
						<view> 您分享的好友下单分佣产品后，您可在分享记录里查看订单分佣状态及分佣金额。订单支付成功后佣金为待入账状态，订单确认收货14天内售后成功佣金为作废状态，订单确认收货14天后佣金为入账状态。交易成功的订单佣金在解冻后直接进入您的基本户中，您可以用来购买商城所有商品。</view>
						<view> 返佣逻辑</view>
						<view> a)用户自主进入小程序购买返佣商品不返佣</view>
						<view> b)已注册用户A通过用户B分享链接、二维码进入小程序下单购买返佣商品不返佣</view>
						<view> c)未注册用户A通过用户B分享链接、二维码进入小程序注册下单购买返佣商品，返佣给用户B，以后用户A购买返佣商品，也将返佣给用户B</view>
						<view> d)用户购买团购，秒杀商品不返佣；使用优惠券或参加满减/折/赠的订单根据实付金额计算返佣金额</view>
						<view> e)用户A注册购买通过用户B分享的用户C的返佣商品返佣给用户C</view>
						<view> f)新用户买了2个返佣商品后发生其中一个返佣商品退款，那么返佣金额=未退款返佣金额*返佣比例，以下为其他情景订单举例公式：</view>
						<view> 订单1：A返佣商品x数量+B不返佣商品x数量= A返佣商品x数量x返佣比例</view>
						<view> 订单2：A返佣商品x数量+B返佣商品x数量=A返佣商品x数量x返佣比例+ B返佣商品x数量x返佣比例</view>
						<view> 订单3: A返佣商品x数量+营销活动=（A返佣商品x数量-营销活动优惠金额）x返佣比例;此营销活动仅指优惠券、满减/折/赠</view>
						<view> 订单4: A返佣商品x数量+ B不返佣商品x数量+营销活动=（A返佣商品x数量-营销活动优惠金额）x返佣比例;此营销活动仅指优惠券、满减/折/赠</view>
					</view>
				</view>
				<view class="btn" @click="isShowRules=false">
					<text class="iconfont icon-guanbi"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
	export default{
		data(){
			return{
				isShowRules:false
			}
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		// #ifdef H5
		onBackPress(options) {
			window.history.back()
			return true
		},
		// #endif
		onShareAppMessage(e){
			let memberDiscode=$storage.get("loginInfor").userInfoCode || "";
			if(e.from=="button"){
				return{
					title:'千匠星云',
					path:"/pages/index/main?memberDiscode="+memberDiscode,
					success: function (res) {
						this.$message.alert("转发成功")
					},
					fail: function (res) {
						this.$message.alert("转发失败")
					}
				}
			}
		},
		methods:{
			jump(url){
				that.$routers.push(url)
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/assets/font/icon.css';
	.share{
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		// height: 100%;
		background: #F6F7F9;
		.share_bg{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			image{
				width: 100%;
			}
		}
		.all{
			width: 686rpx;
			margin-bottom: 32rpx;
			padding: 40rpx;
			background: #FFFFFF;
			border-radius: 20rpx;
			.title{
				margin-bottom: 48rpx;
				font-size: 32rpx;
				text-align: center;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #1C253A;
			}
		}
		.block1{
			float: right;
			z-index: 1;
			height: 820rpx;
			background-image: url(https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/84081639964850_.pic.jpg);
			background-size: cover;
			.rules{
				position: relative;
				.img{
					width: 200rpx;
					height: 100rpx;
					position: absolute;
					top: 0rpx;
					right: -75rpx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				text{
					position: absolute;
					top: 26rpx;
					right: -7rpx;
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #F26868;
				}
			}
			.shareFriend{
				width: 460rpx;
				height: 112rpx;
				margin: 90% auto 0;
				line-height: 112rpx;
				color: #fff;
				text-align: center;
				border-radius: 56rpx;
				background: linear-gradient(134deg, #FF5F6A 0%, #ED4444 100%);
				box-shadow: 0px 12rpx 20rpx 0px rgba(237, 68, 68, 0.3);
			}
			.face{
				margin: 32rpx auto;
				text-align: center;
				color: #888E9B;
			}
		}
		.block2{
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #394259;
			.row{
				display: flex;
				justify-content: space-between;
				align-items: center;
				.iconfont{
					margin-right: 15rpx;
				}
			}
			.rightIcon{
				display: flex;
				justify-content: flex-end;
				align-items: center;
				.iconfont{
					width: 240rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
				}
			}
			.icon-three-right,.icon-three-down,.icon-three-left{
				color: #FF5F6A;
			}
		}
		.block3{
			.p{
				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #888E9B;
				line-height: 48rpx;
			}
		}
		.block4{
			.shareBtn{
				width: 460rpx;
				height: 112rpx;
				margin: 72rpx auto 0;
				line-height: 112rpx;
				color: #ED4444;
				text-align: center;
				border-radius: 56rpx;
				border: 1px solid #ED4444;
			}
		}
		.black{
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 10;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(0,0,0,0.5);
			.popup{
				width: 600rpx;
				.content{
					padding: 60rpx 40rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					height: 800rpx;
					font-weight: 400;
					color: #888E9B;
					background: #fff;
					border-radius: 20rpx;
					.rulesTitle{
						font-size: 32rpx;
						text-align: center;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #1C253A;
					}
					.text{
						height: 620rpx;
						margin-top: 32rpx;
						line-height: 50rpx;
						overflow-y: scroll;
					}
				}
				.btn{
					width: 96rpx;
					height: 96rpx;
					text-align: center;
					line-height: 96rpx;
					margin: 32rpx auto;
					border: 1px solid #fff;
					border-radius: 50%;
					.iconfont{
						color: #fff;
					}
				}
			}
		}
	}
</style>

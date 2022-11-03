<style lang="scss" scoped>
	.lv {

		& {
			background-color: #F9FAFB;
			height: 100%;
		}

		&--memberinfo {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			z-index: 1;

			background-color: #FFFFFF;
			box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.06);
			border-radius: 12rpx;
			margin: 32rpx;
			padding: 32rpx;

			&--top {
				display: flex;
				justify-content: space-between;
				align-items: center;

				&--left {
					display: flex;

					&--avatar {
						justify-content: space-between;

						&--img {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
						}
					}

					&--box {
						margin-left: 32rpx;

						&--username {
							font-size: 18px;
							font-family: PingFangSC-Medium, PingFang SC;
							font-weight: 500;
							color: #1C253A;
						}

						&--membershiplevels {
							width: 80rpx;
							height: 32rpx;
							border-radius: 16rpx;
							background-image: linear-gradient(to right, #F8DF96, #EDBC5D);
							color: #FFF;
							font-family: DIN Alternate Bold;
							font-size: 24rpx;
							text-align: center;
							margin-top: 18rpx;
						}
					}

				}

				&--right {
					display: flex;
					justify-content: space-between;
					flex-direction: column;

					&--top {
						display: flex;
						justify-content: center;

						&--viewthedetails {
							height: 36rpx;
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #888E9B;
							line-height: 36rpx;
						}
					}

					&--bottom {
						margin-top: 38rpx;
						display: flex;
						flex-direction: row-reverse;
					}

				}
			}


			&--bottom {
				display: flex;
				flex-direction: column;
				margin-top: 34rpx;

				&--slider {
					width: 620rpx;
					height: 8rpx;
					border-radius: 4rpx;
					background: #EEF0F3;
					position: relative;

					&--progress {
						height: 8rpx;
						background: linear-gradient(154deg, #F8DF96 0%, #EDBC5D 100%);
						position: absolute;
					}

					&--circles {
						width: 20rpx;
						height: 20rpx;
						background: linear-gradient(154deg, #F8DF96 0%, #EDBC5D 100%);
						box-shadow: 0 0 12rpx 0 rgba(0, 0, 0, 0.1);
						border-radius: 50%;
						border: 4rpx solid #FFFFFF;
						position: absolute;
						top: 50%;
						transform: translateX(-50%);
						transform: translateY(-50%);
					}
				}

				&--experience {
					position: relative;

					display: flex;
					justify-content: space-between;
					margin-top: 12rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #394259;

					&--minValue {}

					&--currentValue {
						position: absolute;
						transform: translateX(-50%);
						font-size: 24rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						font-weight: 500;
						color: #1C253A;
					}

					&--maxValue {}
				}


			}

		}

		&--privilegeinfo {
			margin: 32rpx;
			background: #FFFFFF;
			border-radius: 6px;

			&--title {
				font-size: 32rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #1C253A;
				padding: 32rpx;
			}

			&--box {
				display: flex;
				flex-wrap: wrap;

				&--content {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					width: 230rpx;
					// padding-top: 40rpx;
					padding-bottom: 40rpx;
					
					&--icon {
						    width: 120rpx;
						    height: 120rpx;
						&--img {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
						}
					}

					&--text {
						margin-top: 8rpx;
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #394259;
					}
				}

			}
		}
	}
</style>
<template>
	<view class="lv">
		<view class="lv--background"></view>
		<view class="lv--memberinfo">
			<view class="lv--memberinfo--top">
				<view class="lv--memberinfo--top--left">
					<view class="lv--memberinfo--top--left--avatar">
						<image class="lv--memberinfo--top--left--avatar--img"
							:src="userInfo.avatarUrl||'../../static/img/mine/default_header.png'"></image>
					</view>
					<view class="lv--memberinfo--top--left--box">
						<view class="lv--memberinfo--top--left--box--username">
							{{ userInfo.nickName||'***' }}
						</view>
						<view class="lv--memberinfo--top--left--box--membershiplevels" v-if="membershiplevels">
							{{ membershiplevels }}
						</view>
					</view>
				</view>
				<view class="lv--memberinfo--top--right">
					<view class="lv--memberinfo--top--right--top" @tap="goWert">
						<view class="lv--memberinfo--top--right--top--viewthedetails">
							查看明细
						</view>
						<u-icon name="arrow-right" color="#888E9B" size="16"></u-icon>
					</view>
					<view class="lv--memberinfo--top--right--bottom" @tap="goRegeln">
						<u-icon name="question-circle" color="#888E9B" size="34"></u-icon>
					</view>
				</view>
			</view>
			<view class="lv--memberinfo--bottom">
				<view class="lv--memberinfo--bottom--slider">
					<view class="lv--memberinfo--bottom--slider--progress" :style="{ width: experienceWidth + 'rpx'}">
					</view>
					<view class="lv--memberinfo--bottom--slider--circles" :style="{ left: experienceWidth + 'rpx'}">
					</view>
				</view>
				<view class="lv--memberinfo--bottom--experience">
					<view v-if="currentValue" class="lv--memberinfo--bottom--experience--minValue">
						{{ minValue }}
					</view>
					<view class="lv--memberinfo--bottom--experience--currentValue"
						:style="{left: experienceWidth + 'rpx'}">
						{{ currentValue }}
					</view>
					<view v-if="isMax" class="lv--memberinfo--bottom--experience--maxValue">
						{{ maxValue }}
					</view>
				</view>
			</view>
		</view>

		<view class="lv--privilegeinfo" v-if="privilegeinfo.length">
			<view class="lv--privilegeinfo--title">等级特权</view>
			<view class="lv--privilegeinfo--box">
				<view class="lv--privilegeinfo--box--content" v-for="item in privilegeinfo" @tap="showPopup(item)">
					<view class="lv--privilegeinfo--box--content--icon">
						<u-lazy-load class="lv--privilegeinfo--box--content--icon--img" 
						:image="item.icon | urlFilter" border-radius="100"></u-lazy-load>
					</view>
					<view class="lv--privilegeinfo--box--content--text">
						{{ item.text }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {
		mamber
	} from '@/api/newApi.js'

	export default {
		data() {
			return {
				userInfo: {},
				username: "用户昵称",
				// 会员等级
				membershiplevels: "",
				minValue: 0,
				currentValue: 0,
				maxValue: 0,
				privilegeinfo: []
			}
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo');
			this.getUlLevel()
			this.queryUserrightsPage()
		},
		methods: {
			async getUlLevel() {
				const ulv = await http.get(mamber.getUlLevelUpointsByUser);
				this.minValue = ulv.levelListStart
				this.maxValue = ulv.levelListEnd
				this.currentValue = ulv.levelNum
				this.membershiplevels = ulv.levelListName
			},
			async queryUserrightsPage() {
				const rights = await http.get(mamber.queryUserrightsPage, {
					dataState: 0
				});
				rights.list.forEach((el, i) => {
					this.$set(this.privilegeinfo,i,{
						icon: el.userrightsUrl ?? '',
						text: el.userrightsName ?? '',
						content: el.userrightsRemark ?? '',
					})
				})
			},
			goWert() {
				this.$routers.push('/pages/member/wertErleben')
			},
			goRegeln() {
				this.$routers.push('/pages/member/regeln')
			},
			showPopup(el) {
				let _this = this;
				uni.showModal({
					title: el.text ?? '权益名称',
					content: el.content ?? `权益规则`,
					confirmColor: this.baseColor,
					showCancel: false,
					success(res) {
						console.log(res)
					}
				});
			}
		},
		computed: {
			experienceWidth: function() {
				if(this.currentValue <= this.maxValue) {
					return 620 / this.maxValue * this.currentValue
				}else {
					return 620 / this.maxValue * this.maxValue
				}
			},
			isMax() {
				if(this.currentValue <= this.maxValue) {
					return true
				}else {
					return false
				}
			}
		}

	}
</script>

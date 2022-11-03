<template>
	<view class="gift-content">
		<view class="search-box">
			<view class="search-input">
				<u-search placeholder="请输入礼包名称" :clearabled="true" v-model="keyword" @custom="goSearch()"></u-search>
			</view>
		</view>
		<div class="gift-type">
			<div>
				<div v-for="(tit,index) in titList" :key="index" @click="titClick(index)" :style="{ color: current == index ? baseColor : '' }">
					{{ tit.tit }}
					<i v-show="tit.num !== 0">({{ tit.num }})</i>
					<span v-show="current == index" :style="{ background: baseColor }"></span>
				</div>
			</div>
		</div>
		<!-- #ifndef H5 -->
		<div class="gift-msg" v-if="list.length > 0">
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<div class="gift-msg" v-show="list.length > 0">
		<!-- #endif -->
			<div class="gift-detail" v-for="(item,index) in list" :key="index">
				<view>
					<span>有效期:&nbsp;&nbsp;{{timesSeconds(item.giftUserStart)}} - {{timesSeconds(item.giftUserEnd)}}</span>
					<span class="right" v-if="item.dataState===0 && item.validState===0">待领取</span>
					<span class="right" v-else-if="item.dataState===1 && item.validState===0">已领取</span>
					<span class="right" v-else-if="item.dataState===2 && item.validState===0">部分领取</span>
					<span class="right" v-else-if="item.validState===1">已过期</span>
				</view>
				<view>
					<image :src="item.giftUrl"></image>
					<view>{{item.giftName}}</view>
					<view class="gift-detail-num">X1</view>
				</view>
				<view class="click-ticket">
					<span @click="getCoupon(item)" v-if="item.dataState===0 && item.validState===0 || item.dataState===2 && item.validState===0"
					 :prop="giftUserCode">点击领取</span>
					<span @click="getCouponDetail(item)" v-else="item.dataState===1 && item.validState===0||item.validState===0 "
					 :prop="giftUserCode">查看详情</span>
				</view>
			</div>
		</div>

		<!-- #ifndef H5 -->
		<view class="gift-error" v-else>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="gift-error" v-show="list.length === 0">
		<!-- #endif -->
			<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/JD/ZQ/search.png" mode="" style="width: 370rpx; height: 300rpx; margin-top: 30%;"></image>
		</view>

		<div class="address-add" @click='goCardColl'>卡券验证</div>

		<lastPageLine :lastPageLine="lastPageLine" style="background-color: #F5F5F5;" v-show="list.length > 0" />
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		getGiftBag
	} from '@/api/interface.js';
	import lastPageLine from '@/components/communal/last-page-line';
	export default {
		data() {
			return {
				isShow: false,
				current: 0,
				baseColor: 'red',
				page: 1, //分页
				total: 0, //列表数据总数
				rows: 10,
				dataState: 1, //table切换接口标示
				keyword: '',
				list: '',
				giftUserCode: '',
				giftUrl: '',
				giftName:'',
				lastPageLine: false,
				titList: [{
						tit: '全部',
						num: 0
					},
					{
						tit: '待领取',
						num: 0
					},
					{
						tit: '已领取',
						num: 0
					}, {
						tit: '部分领取',
						num: 0,
					}, {
						tit: '已过期',
						num: 0,
					}

				]
			}
		},
		onReachBottom() {
			// 到这底部在这里需要做什么事情
			this.loadMore();
		},
		onLoad() {
			this.commonMounted(this.current);
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		watch: {
			current(val) {
				this.lastPageLine = false;
				this.list = [];
			}
		},
		methods: {
			loadMore() {
				let num = Math.ceil(this.total / 10);
				this.page++;
				if (this.page <= num) {
					
					this.commonMounted(this.current);
				} else {
					this.lastPageLine = true;
				}
			},
			commonMounted(tit) {
				
				let params = {
					page: this.page,
					rows: this.rows
				}
				if (tit == 1) {
					params.dataState = 0,
						params.validState = 0
				} else if (tit == 2) {
					params.dataState = 1,
						params.validState = 0
				} else if (tit == 3) {
					params.dataState = 2,
						params.validState = 0
				} else if (tit == 4) {

					params.validState = 1
				}
				 if (this.keyword) {

					params.giftName = this.keyword
				}
				
				http.post(getGiftBag, params).then(res => {
					if (res && res.rows) {
						if ( res.rows.length === 0) {
							this.list = [];
						} else {
							let lists = res.rows
							// console.log(lists,'efufururghrughruhurhr')
							if (res.rows && res.rows.length > 0) {
								res.rows.map((v) => {
									if (!RegExp(/http/).test(v.giftUrl)) {
										this.$set(v, 'giftUrl', this.$domain + v.giftUrl);
									}
								});
								// res.rows.forEach((item,i) =>{
								// 	this.giftUrl=this.$domain+res.rows[i].giftUrl
								// })
							}
							if (this.page === 1) {
								this.list = lists;
								console.log(lists, 'efufururghrughruhurhr')
							} else {
								this.list = [...this.list, ...lists]
							}
						}

					}else{
						this.list = [];
					}
					this.total = res.total

				});
			},
			/**
			 * tabs切换
			 * @param {Object} index
			 */
			titClick(tit) {
				this.list = []
				console.log(tit, '11111111111')
				this.current = tit
				let params = {
					page: 1,
					rows: 10,
				}
				if (tit == 1) {
					params.dataState = 0,
						params.validState = 0
				} else if (tit == 2) {
					params.dataState = 1,
						params.validState = 0
				} else if (tit == 3) {
					params.dataState = 2,
						params.validState = 0
				} else if (tit == 4) {

					params.validState = 1
				}
				this.page =1
				console.log(params)
				this.commonMounted(this.current);
			},
			goSearch(item) {
				console.log(this.keyword, '123457890')
				// this.giftName = this.keyword
				// let params = {
				// 	giftName: this.keyword,
				// 	// channelCode: channelCode
				// }
				// http.get(getGiftBag, params).then(res => {
				// 	this.list = res.row

				// })
				this.commonMounted(this.current);
				
			},
			getCoupon(item) {
				this.giftUserCode = item.giftUserCode
				let params = {
					giftUserCode: item.giftUserCode
				}
			this.$routers.push('/pages/welfare/getCoupon/index', {giftUserCode: item.giftUserCode})
			},
			getCouponDetail(item) {
				this.giftUserCode = item.giftUserCode
				let params = {
					giftUserCode: item.giftUserCode
				}
				$routers.push('welfare/getCouponDetail', params)
			},
			timesSeconds(timestamp) {
				if (!timestamp) {
					return;
				}
				var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
				const Y = date.getFullYear() + "-";
				const M =
					(date.getMonth() + 1 < 10 ?
						"0" + (date.getMonth() + 1) :
						date.getMonth() + 1) + "-";
				const D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				return Y + M + D
			},

			//跳转卡卷验证页面
			goCardColl() {
				this.$routers.push('cardColl')
			}

		},
		mounted() {
			this.baseColor = '#' + this.$state.baseColor;
		},
		components: {
			lastPageLine
		},
		watch: {
			current(val) {
				this.lastPageLine = false;
			}
		}
	}
</script>

<style lang="less" scoped>
	.gift-content {
		// background-color: #fff;
		// background-color: #F5F5F5;
		width: 100%;

		.search-box {
			z-index: 1000;
			position: fixed;
			top: 0rpx;
			background-color: #EB2B27;
			height: 100rpx;
			width: 100%;
			line-height: 100rpx;

			.search-input {
				width: 90%;
				height: 100%;
				line-height: 100rpx;
				margin-left: 5%;
			}
		}

		.gift-type {
			width: 100%;
			background-color: #FFFFFF;
			// margin-top:80rpx;
			position: fixed;
			top: 100rpx;
			z-index: 1000;

			.gift-tit {
				height: 92rpx;
				display: flex;
				width: 100%;
				z-index: 999;
				color: #444444;
			}

			div {
				justify-content: center;
				position: relative;
				// height: 92rpx;
				line-height: 92rpx;
				flex: 1;
				display: flex;
				align-items: center;

				span {
					height: 4rpx;
					width: 80%;
					background-color: #EB2B27;
					position: absolute;
					bottom: 0;
					// left: 30%;
				}
			}
		}

		.gift-msg {
			background-color: #F5F5F5;
			/* #ifndef H5 */
			margin-top: 210rpx;
			padding-bottom: 100%;
			/* #endif */
			/* #ifdef H5 */
			margin-top: 130rpx;
			padding-bottom: 60vh;
			/* #endif */
			.gift-detail {
				margin-top: 15rpx;

				height: 390rpx;
				width: 100%;
				background-color: #FFFFFF;
				// margin: 0rpx 0rpx 15rpx 0rpx;
				font-size: 28rpx;
				color: #000000;

				view:nth-child(1) {
					height: 80rpx;
					width: 100%;
					line-height: 80rpx;
					border-bottom: 1rpx solid #f5f5f5;
					display: flex;
					justify-content: space-between;

					span:first-child {
						margin-left: 15rpx;
					}

					.right {
						margin-right: 15rpx;
					}

				}

				view:nth-child(2) {
					height: 200rpx;
					width: 100%;
					display: flex;
					align-items: center;
					border-bottom: 1rpx solid #f5f5f5;
					padding-left: 16rpx;
					image {
						// margin: 15rpx;
						height: 168rpx;
						width: 168rpx;
						// margin-left: 16rpx;
						// padding: 10rpx 10rpx 10rpx 10rpx;
					}

					view:nth-child(2) {
						height: 100%;
						width: 50%;
						margin-left: 40rpx;

					}

					.gift-detail-num {
						height: 100%;
						width: 10%;
						margin-left: 80rpx;
						text-align: center;
						line-height: 200rpx;

					}
				}

				.click-ticket {
					height: 100rpx;
					width: 100%;
					// border: 1rpx solid gray;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					span {
						display: block;
						width: 170rpx;
						height: 56rpx;
						line-height: 56rpx;
						font-size: 24rpx;
						color: #EB2B27;
						border: 1rpx solid #EB2B27;
						text-align: center;
						// position: relative;
						// left: 75%;
						margin-right: 15rpx;
					}

				}

			}
		}

		.gift-error {
			/* #ifdef H5 */
			height: calc(100vh - 202rpx);
			display: flex;
			justify-content: center;
			align-items: center;
			/* #endif */
			/* #ifndef H5 */
			margin-top: 200rpx;
			text-align: center;
			/* #endif */
		}

		.address-add {
			background-color: #EB2B27;
			width: 700rpx;
			position: fixed;
			z-index: 1;
			text-align: center;
			font-size: 24rpx;
			color: white;
			border-radius: 40rpx;
			line-height: 80rpx;
			border: none;
			left: 25rpx;
			bottom: 25rpx;
		}
	}
</style>

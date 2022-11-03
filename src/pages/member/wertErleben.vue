<style lang="less" scoped>
	.wertErleben {
		& {
			width: 100%;
			height: 100%;
			background: #F9FAFB;
			padding-top: 18rpx;
		}

		&--item {
			& {
				padding: 0 40rpx;
				background-color: #ffffff;
			}

			&--top {

				& {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 32rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #1C253A;
					padding-top: 32rpx;
				}

				&--left {}

				&--right {}
			}

			&--bottom {
				& {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #888E9B;
					padding-top: 18rpx;
					padding-bottom: 32rpx;
				}
			}
			&--solid {
				& {
					background-color: #EAEAEA;
					position: relative;
					height: 1rpx;
					transform: scaleY(0.5);
				}
			}
		}
		
		.result {
			display: flex;
			justify-content: center;
			margin-top: 50%;
		
			.box {
				width: 370rpx;
				height: 276rpx;
		
				.text {
					text-align: center;
		
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #999999;
					line-height: 34rpx;
				}
			}
		}
	}
</style>

<template>
	<view class="wertErleben">
		<view class="wertErleben--item" v-for="(el,i) in list">
			<view class="wertErleben--item--top">
				<view class="wertErleben--item--top--left">{{el.levelRuleApi | levelRuleApiFilters}}</view>
				<view class="wertErleben--item--top--right">+{{el.levelListNum}}</view>
			</view>
			<view class="wertErleben--item--bottom">{{el.gmtCreate | timsFilters}}</view>
			<view class="wertErleben--item--solid"></view>
		</view>
		<view class="result" v-if="list.length === 0">
			<view class="box">
				<image :src="nullImg" mode="" style="width: 100%; height: 300rpx;"></image>
				<view class="text">
					暂无数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mamber
	} from '@/api/newApi.js'
	import http from '@/api/http.js';
	import { formatDate } from '@/utils/prototype/date.js';
	export default {
		data() {
			return {
				list: [],
				nullImg: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/shixiao%402x.png'
			}
		},
		onLoad() {
			this.getwertErleben()
		},
		methods: {
			async getwertErleben() {
				const res = await http.get(mamber.queryUlLevelUllistPageByUser);

				this.list = res.list
			}
		},
		filters: {
			levelRuleApiFilters(val) {
				switch (val) {
					case 'OcContract':
						return '交易获得成长值'
						break;
					case 'UmUserinfo-insert':
						return '注册获得成长值'
						break;
					case 'FirstOcContract':
						return '首次下单获取成长值'
						break;
					case 'ResEvaluate':
						return '评价获取成长值'
						break;
					case 'Share':
						return '分享商品获取成长值'
						break;
					case 'BindingWX':
						return '绑定微信获取成长值'
						break;
					case 'FirstCollection':
						return '首次收藏商品获取成长值'
						break;
					default:
						break;
				}
			},
			timsFilters (val) {
				return formatDate(val);
			}
		}
	}
</script>

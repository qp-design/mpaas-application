<style lang="less" scoped>
	@import '@/common/css/common.less';
	
	.auth-box {
		padding: 30rpx ;
		.u-content{
			v-deep h1 {
				font-size: 36rpx; 
				font-weight: bolder; 
			}
			v-deep h2 { 
				font-size: 34rpx; 
				font-weight: bolder; 
			}
			v-deep h3 { 
				font-size: 28rpx; 
				font-weight: bolder; 
			}
			v-deep h4, h5, h6 { 
				font-size: 100%; 
			}
			
			&-title {
				font-size: 36rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #1C253A;
				margin-bottom: 48rpx;
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
	<view class="auth-box">
		<view class="u-content" v-if="agreementHtml">
			<view class="u-content-title">{{title}}</view>
			<u-parse :html="agreementHtml"></u-parse>
		</view>
		<view class="result" v-else>
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
	export default {
		data() {
			return {
				agreementHtml:'',
				title: '',
				nullImg: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/shixiao%402x.png'
			}
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		onLoad(option) {
			this.queryNoticePageRule()
		},
		methods: {
			async queryNoticePageRule() {
				const res = await http.get(mamber.queryNoticePageRule, {orderStr:'NOTICE_SORT',dataState:1,page:1,rows:1});
				console.log(this.$domain, 1231231)
				let that = this;
				this.agreementHtml = res?.list[0]?.noticeContext;
				this.agreementHtml =
					this.agreementHtml &&
					this.agreementHtml.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
						if (capture.indexOf('http') > -1) {
							return '<img style="width:100%"  src="' + capture + '"/>';
						} else {
							return '<img style="width:100%"  src="' + (that.$domain + capture) + '"/>';
						}
					});
				this.title = res?.list[0]?.noticeTitle;
			}
		}
	}
</script>

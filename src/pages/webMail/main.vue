<template>
	<div class="webmail">
		<div class="webmail-con">
			<ul v-if="items.length > 0">
				<li v-for="(item, listIndex) in items" :key="listIndex" @click="goDetail(item)">
					<h1>{{ item.gmtCreate }}</h1>
					<div class="webmail-box">
						<h2>{{ item.pushmsgExp.paramMap.title }}</h2>
						<p>{{ item.pushmsgExp.paramMap.content }}</p>
					</div>
				</li>
			</ul>
			<div class="noimg" v-if="items.length == 0 && !requestStatic">
				<img :src="nullImg | urlFilter" />
				<p>暂无消息...</p>
			</div>
		</div>
		<lastPageLine :lastPageLine="lastPageLine" />
	</div>
</template>

<script>
	import http from '@/api/http.js';
	import {
		$storage,
		$routers
	} from '@/utils/prototype/vue.js';
	import {
		getImsgPushmsg
	} from '@/api/interface.js';
	import commonHeader from '@/components/communal/commonHeader';
	import {
		formatDate
	} from '@/utils/prototype/date.js';
	import lastPageLine from '@/components/communal/last-page-line';
	export default {
		data() {
			return {
				title: '我的消息',
				leftIcon: false,
				rightIcon: false,
				total: 0,
				page: 1,
				rows: 10,
				items: [],
				lastPageLine: false,
				requestStatic: false,
				nullImg: '/paas/shop-master/c-static/images/wxminiImg/noGoods.png'
			};
		},
		components: {
			commonHeader,
			lastPageLine
		},
		onLoad(options) {
			if (options && options.json) {
				$storage.set('webmail', options.json);
				//$routers.replace('web',{defaultUrl:this.$domain+'/paas/shop/00000001/wemini/index/index/index.html'})
			}
		},
		mounted() {
		},
		onReachBottom() {
			// 到这底部在这里需要做什么事情
			this.loadMore();
		},
		onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
			this.commonMounted();
		},
		methods: {
			goDetail(item) {
				that.$routers.push('webMail/mailDetail', {msgId: item.pushmsgId})
			},
			commonMounted() {
				http.post(getImsgPushmsg, {
					page: this.page,
					rows: this.rows
				}).then(res => {
					if (res.rows && res.rows.length > 0) {
						this.items = res.rows;
						this.requestStatic = true;
						this.items.forEach((v, i) => {
							v.pushmsgExp = JSON.parse(v.pushmsgExp);
							v.pushmsgExp.paramMap = JSON.parse(v.pushmsgExp.paramMap);
							v.gmtCreate = formatDate(v.gmtCreate);
						});
						this.total = res.total;
					}
				});
			},
			goBack() {
				// if ($storage.get("webmail")) {
				//   $storage.set("webmail", "");
				//   // $routers.replace("web", {
				//   //   defaultUrl: this.$businessDomain + "/paas/shop/" + this.$state.homeUrl
				//   // });
				// } else {
				//   $storage.set("webmail", "");
				//   // $routers.replace('mine')
				//   $routers.back();
				// }
				$storage.set('webmail', '');
				$routers.back();
			},
			loadMore() {
				let num = Math.ceil(this.total / 10);
				this.page++;
				if (this.page <= num) {
					http.post(getImsgPushmsg, {
						page: this.page,
						rows: this.rows
					}).then(res => {
						let list = res.rows;
						list.forEach((v, i) => {
							v.pushmsgExp = JSON.parse(v.pushmsgExp);
							v.pushmsgExp.paramMap = JSON.parse(v.pushmsgExp.paramMap);
							v.gmtCreate = formatDate(v.gmtCreate);
						});

						this.items = [...this.items, ...list];
						this.requestStatic = true;
					});
				} else {
					this.lastPageLine = true;
				}
			}
		}
	};
</script>
<style lang="less" scoped>
	@import '@/common/css/common.less';

	.noimg {
		margin-top: 280rpx;

		img {
			display: block;
			width: 359rpx;
			height: 276rpx;
			margin: 0 auto;
		}

		p {
			margin-top: 40rpx;
			height: 72rpx;
			line-height: 72rpx;
			text-align: center;
			color: #999999;
			font-size: 24rpx;
		}
	}

	.webmail {
		width: 100%;
		height: 100%;
		background: #fafafa;

		&-left {
			position: fixed;
			z-index: 9999;
			height: 90rpx;
			width: 70rpx;
			line-height: 90rpx;
			text-align: left;
			left: 30rpx;
			top: 0;
		}

		&-con {
			margin: 0 30rpx 0;

			ul {
				li {
					h1 {
						height: 94rpx;
						line-height: 94rpx;
						text-align: center;
						font-size: 22rpx;
						color: @color-999;
					}

					.webmail-box {
						padding: 30rpx 24rpx;
						background: @white-color;
						border-radius: 4rpx;

						h2 {
							font-size: @top-title;
							color: #212121;
							margin-bottom: 20rpx;
						}

						p {
							color: @color-999;
							font-size: @big-title;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: nowrap;
							width: 640rpx;
						}
					}
				}
			}
		}
	}
</style>

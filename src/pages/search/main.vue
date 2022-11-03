<template>
	<view class="search">
		<navBar inputPlaceholder="搜索您喜欢的商品" @search='saveHistory' :isSearch='true'></navBar>
		<!-- <navBar inputPlaceholder="丝芙兰" :isSearch="true" v-model="keyword" ></navBar> -->
		<view class="search--main">

			<view class="search--main--hot">
				<view class="search--main--hot--title">
					<image src="../../static/teaImg/hot.png"></image>
					<view>热门搜索</view>
				</view>
				<view class="search--main--hot--box">
					<view class="search--main--hot--box--item" v-for="(item,index) in hotList " :key="index"
						@click="record(item)">{{item}}</view>
				</view>
			</view>

			<view class="search--main--histoty">
				<view class="search--main--history--title">
					<image src="../../static/teaImg/history.png"></image>
					<view>历史搜索</view>
					<text class="iconfont icon-lajitong" @click="delHistory"></text>
				</view>
				<view class="search--main--history--box">
					<view class="search--main--history--box--item" v-for="(item,index) in historyList" :key="index"
						@click="record(item)"> {{item}}</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {
		search,
		index
	} from '@/api/newApi.js';
	import {
		$storage
	} from '@/utils/prototype/vue.js';
	import navBar from '@/components/navBar.vue'
	export default {
		components: {
			navBar,
		},
		created() {
			http.get(index.floors, {
				menuOpcode: "recommendation"
			}).then(res => {
				if (res && res.list.length > 0) {
					this.list = res.list.filter(item => item.htmltagCode == "word")
					if (this.list[0].cmsContlistReDomainList) {
						this.list[0].cmsContlistReDomainList.map(item => {
							if (item.dataState == 2) {
								this.hotList.push(item.contlistName)
							}
						})
					}

				}
			});

			let record = $storage.get('historyList')

			if (record) {
				//页面渲染之前 先从本地拿取历史记录
				let historyList = JSON.parse($storage.get('historyList'))
				//判断是否有值
				if (historyList) {
					this.historyList = historyList
				}
			}

		},

		data() {
			return {
				//搜索关键字
				keyword: '',
				//热门搜索
				hotList: [],
				list: {},
				//历史搜索
				historyList: []
			}
		},
		onShow() {
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
		methods: {
			saveHistory(e) {
				//先将搜索栏清空
				if (e.trim() === '') return
				//将搜索记录储存到历史记录
				this.historyList.unshift(e)
				//在保存之前 先去重
				this.historyList = [...new Set(this.historyList)]
				//本地加载
				$storage.set('historyList', JSON.stringify(this.historyList))
				//页面跳转
				this.$routers.push('goodsList',{searchParam: e})
			},
			//点击跳转搜索 并保存历史记录
			//删除历史记录
			delHistory() {
				this.historyList = []
				$storage.remove('historyList')
			},

			//点击记录也可以搜索
			record(item) {
				this.keyword = item
				this.saveHistory(this.keyword)
			},

		},


	}
</script>

<style lang="less" scoped>
	.search {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100%;
		overflow: hidden;

		&--header {
			width: 100%;
			height: 176rpx;
			padding-top: 100rpx;

			&--column {
				width: 540rpx;
				height: 64rpx;
				display: flex;

				&--back {
					width: 88rpx;
					height: 64rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					text {
						font-size: 40rpx;
					}
				}

				input {
					flex: 1;
					height: 64rpx;
					border-radius: 32rpx;
					background-color: #F4F4F4;
					padding-left: 32rpx;
				}
			}
		}

		&--main {
			width: 100%;
			flex: 1;
			background-color: #eee;
			padding: 48rpx 32rpx 0;

			&--hot,
			&--history {
				width: 100%;

				// height: 300rpx;
				// background-color: pink;

				&--title {
					display: flex;
					align-items: center;
					font-weight: 700;

					image {
						width: 32rpx;
						height: 32rpx;
					}

					text {
						font-size: 40rpx;
					}

					view {
						margin-left: 10rpx;
						font-size: 36rpx;
						color: #333;
						margin-right: 450rpx;
					}
				}

				&--box {
					width: 100%;
					padding-top: 24rpx;
					display: flex;
					flex-wrap: wrap;

					&--item {
						height: 56rpx;
						// line-height: 56rpx;
						padding: 8rpx 24rpx;
						border-radius: 28rpx;
						margin-right: 24rpx;
						margin-bottom: 24rpx;
						text-align: center;
						// display: flex;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						// justify-content: center;
						// align-items: center;
						font-size: 28rpx;
						color: #333;
						background-color: #F7F7F7;
					}
				}
			}
		}
	}
</style>

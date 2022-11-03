<template>
	<u-navbar id="navBar" :is-back="false" :border-bottom="borderBottom" :background="background">
		<view class="slot-wrap">
			<view class="iconfont icon-fanhui back" v-if="isBack" @click="back"></view>
			<!-- <image class="app-logo" v-if="isLogo" :src="logo" mode="aspectFit"></image> -->
			<view class="search-frame" v-bind:style="{ marginLeft: searchFrameOffsetLeft + 'rpx' }">
				<view class="iconfont icon-sousuo1 search"></view>
				<text class="input-container" v-if="!isSearch" @click="goSearch">{{ inputPlaceholder }}</text>
				<input class="input-container" v-else type="text" :placeholder="inputPlaceholder" v-model="searchValue" confirm-type="search" @confirm="onSearch" />
				<view class="iconfont icon-guanbi1 clear" v-if="isClear" @click="clear"></view>
			</view>
		</view>
	</u-navbar>
</template>

<script>
export default {
	props: {
		isBack: {
			type: Boolean,
			default: true
		},
		borderBottom: {
			type: Boolean,
			default: false
		},
		isClear: {
			type: Boolean,
			default: false
		},
		isSearch: {
			type: Boolean,
			default: false
		},
		searchRouter: {
			type: String,
			default: ''
		},
		inputPlaceholder: {
			type: String,
			default: '搜索你想要的'
		},
		background: {
			type: Object,
			default:()=> {
				return {backgroundColor: `#ffffff`}
			}
		},
		isLogo: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		// 如果有返回键，搜索框设置32rpx的margin-left值，否则不设置
		searchFrameOffsetLeft() {
			return this.isBack || this.isLogo ? '32' : '0';
		}
		// logo(){
		// 	let logo = this.$qj.storage.get('logo')
		// 	return RegExp(/http/).test(logo) ? logo : `${this.$qj.imgDomain}${logo}`
		// }
	},
	data() {
		return {
			searchValue: '',
			showBack:true
		};
	},
	mounted() {
		// 获取节点信息
		const query = uni.createSelectorQuery().in(this);
		query
			.select('#navBar')
			.boundingClientRect(data => {
				this.$emit('getNavBarHeight', data.height);
			})
			.exec();
	},
	methods: {
		back() {
			this.$routers.back()
		},

		goSearch() {
			this.$routers.push('search')
		},
		clear() {
			this.searchValue = '';
		},
		onSearch(e) {
			this.$emit('search', e.detail.value.trim());
		}
	}
};
</script>

<style lang="less" scoped>
.slot-wrap {
	display: flex;
	align-items: center;
	flex: 1;
	padding: 0 30rpx;
	/* .app-logo {
		width: 54rpx;
		height: 54rpx;
		border-radius: 100%;
	} */
	.iconfont {
		color: #333333;
		&.back {
			font-size: 36rpx;
		}
		&.search {
			color: #666666;
			font-size: 28rpx;
		}
		&.clear {
			color: #cccccc;
			padding: 8rpx;
			font-size: 28rpx;
		}
	}
	.search-frame {
		margin-left: 32rpx;
		flex: 1;
		display: flex;
		align-items: center;
		height: 55rpx;
		width: 50rpx;
		background: rgba(241, 241, 241, 1);
		border: 1rpx solid rgba(224, 224, 224, 1);
		border-radius: 28rpx;
		padding: 0 15rpx;
		.input-container {
			flex: 1;
			color: #666666;
			font-size: 24rpx;
			padding-left: 15rpx;
		}
	}
}
</style>

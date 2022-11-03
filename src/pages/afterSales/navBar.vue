<template>
	<u-navbar id="navBar" :is-back="false" :border-bottom="borderBottom" :background="background">
		<view class="slot-wrap">
			<view class="iconfont icon-fanhui back" v-if="isBack" @click="back"></view>
			<!-- <image class="app-logo" v-if="isLogo" :src="logo" mode="aspectFit"></image> -->
			<view class="title">
				{{title}}
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
			default: {
				backgroundColor: `#EB2B27`
			}
		},
		isLogo: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: ""
		},
		delta:{
			type: String,
			default: ""
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
			if(this.delta=="0"){
				this.$routers.back()
			}else{
				// #ifndef H5
				this.$routers.back(5)
				// #endif
				// #ifdef H5
				this.$routers.switchTab('index')
				// #endif
			}
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
	.app-logo {
		width: 54rpx;
		height: 54rpx;
		border-radius: 100%;
	}
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
	.title {
		text-align: center;
		color: black;
	}
}
</style>

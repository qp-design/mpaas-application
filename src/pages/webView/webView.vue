<template>
	<view class="">
		 <web-view :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ''
			}
		},
		onLoad(e) {
			 // 获取传递过来的链接
			this.url = decodeURIComponent(e.url)
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		}
	}
</script>

<style>
</style>

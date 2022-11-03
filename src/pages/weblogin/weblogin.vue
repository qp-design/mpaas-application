<template>
	<view>
		<web-view src='https://wx-mro.smm.cn/paas/shop-master/#/auth'></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loginUrl:"/paas/shop-master/#/auth"
			}
		},
		methods: {
		},
		onLoad(){
			
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
	}
</script>

<style>

</style>

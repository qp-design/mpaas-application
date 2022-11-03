<template>
	<text class="label" v-if="(goodsType==='40')">
		<!-- {{goodsType}} -->
		<text class="label-item">京东优选</text>
	</text>
</template>

<script>
	export default {
		name:"vop-label",
		data() {
			return {
				
			};
		},
		props:{
			goodsType:{
				type:String,
				default:''
			}
		}
	}
</script>

<style lang="scss">
	.label{
		margin-right: 10rpx;
		&-item{
			background-color: #c82a29;
			color: #FFFFFF;
			
			font-size: 22rpx;
			border-radius: 20rpx;
			padding: 3rpx 20rpx;
		}
	}
</style>

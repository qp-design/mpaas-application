<template>
	<view class="numberBox">
		<view :class="['reduce',count==1?'disabled':'']" @click="reduceClick">—</view>
		<view class="inputBox">
			<input type="text" maxlength="3" v-model="count" @blur="inputIt"/>
		</view>
		<view class="add" @click="addClick">+</view>
	</view>
</template>

<script>
	export default {
		props:{
			msg:String
		},
		data(){
			return {
				count:1,
				message:{}
			}
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		watch:{
			msg(val){
				this.message = JSON.parse(val)
				console.log(this.message,'this.message----watch')
				this.count = this.message.goodsCamount;
			}
		},
		mounted(){
			this.count = JSON.parse(this.msg).goodsCamount;
			this.message = JSON.parse(this.msg);
		},
		methods:{
			addClick(){
				this.$emit("add",this.msg)
			},
			reduceClick(){
				this.$emit("reduce",this.msg)
			},
			inputIt(){
				if(this.count==""){
					return
				}else if(this.message.goodsMinnum&&this.count<this.message.goodsMinnum){
					this.count = this.message.goodsMinnum;
					this.$message.alert('起拍不可少于'+this.count+'件')
				}else if(this.count<1){
					this.count = 1;
					this.$message.alert('起拍不可少于1件')
				}
				if (this.count > this.message.goodsSupplynum) {
					this.count = this.message.goodsSupplynum
					this.$message.alert('最多可拍'+this.count+'件')
				}
				this.message.goodsCamount = this.count
				
				setTimeout(()=>{
					this.$emit("inputChange",JSON.stringify(this.message))
				},800)
			}
		}
	}
</script>

<style scoped lang="less">
	.numberBox{
		width: 152rpx;
		height: 40rpx;
		line-height: 40rpx;
		display: flex;
		justify-content: space-between;
		font-size: 24rpx;
		.reduce{
			width: 36rpx;
			font-size: 20rpx;
			font-weight: bold;
			text-align: left;
			transform: scaleY(1.4);
		}
		.add{
			width: 36rpx;
			font-size: 30rpx;
			font-weight: bold;
			text-align: right;
		}
		.inputBox{
			width: 80rpx;
			background: #F6F6F6;
			border-radius: 10rpx;
			input{
				display: block;
				width: 100%;
				height: 100%;
				text-align: center;
			
			}
		}
		.disabled{
			color: #ccc;
		}
	}
</style>

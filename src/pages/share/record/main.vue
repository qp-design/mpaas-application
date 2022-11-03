<template>
	<view class="record">
		<view class="record_list" v-if="recordList.length>0" v-for="(item,index) in recordList">
			<view class="record_item">
				<view class="record_item_left">
					<view>订单编号：{{item.shsettlOplistOp}}</view>
					<view class="state" :style="{color:bgColor[item.dataState+1],borderColor:bgColor[item.dataState+1]}">{{item.dataState | state}}</view>
				</view>
				<view class="record_item_right" :style="{'color':item.dataState==-1?'#C3C6CD':'#FF5F66'}"> ￥{{item.shsettlListAmt}} </view>
			</view>
		</view>
		<view class="noList" v-if="recordList.length==0">
			<view class="noimg">
				<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/liushuiquesheng2%403x.png" mode=""></image>
			</view>
			<text>暂无分享记录，快去分享吧～</text>
		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {myQueryShsettlListPage} from '@/api/interface.js'
	export default{
		data(){
			return{
				back:"",
				color:"",
				recordList:[],
				bgColor:['#C3C6CD','#5E9BF7','#39DB85']
			}
		},
		onLoad() {
			this.getRecordList();
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		filters:{
			state(status){
				let text=""
				switch (status) {
				    case -1:
				        text = "作废";
				        break;
				    case 0:
				        text = "冻结中";
				        break;
				    case 1:
				        text = "入账成功";
				        break;
				}
				return text
			}
		},
		methods:{
			getRecordList(){
				http.get(myQueryShsettlListPage).then(res=>{
					if(res.list.length>0){
						this.recordList=res.list;
						this.recordList.forEach((item)=>item.shsettlListAmt=item.shsettlListAmt.toFixed(2))
					}
				})
			}
		}
	}
</script>

<style>
	page{
		background: #F6F7F9;
	}
</style>
<style lang="scss" scoped>
	.record{
		margin: 0 32rpx;
		.record_list{
			.record_item{
				padding: 32rpx;
				margin-top: 32rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: #fff;
				border-radius: 20rpx;
				.record_item_left{
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					line-height: 40rpx;
					color: #394259;
					.state{
						display: inline;
						padding: 0 10rpx;
						font-size: 20rpx;
						color: #39DB85;
						border: 1px solid #39DB85;
						border-radius: 8rpx;
					}
				}
				.record_item_right{
					font-size: 48rpx;
					font-family: DINAlternate-Bold, DINAlternate;
					font-weight: bold;
					color: #FF5F66;
					line-height: 36rpx;
				}
			}
		}
		.noList{
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			height: 100vh;
			color: #999;
			.noimg{
				width: 400rpx;
				height: 400rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>

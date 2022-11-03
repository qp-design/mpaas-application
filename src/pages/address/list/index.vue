<template>
	<div class="address">
		<!-- 头部 -->
		<!-- <view class="car-header" :style="{ 'padding-top': paddingTop, 'padding-bottom': '30rpx' }">
			<view class="backButton iconfont icon-fanhui" @click="goBack"></view>
			<view class="centerText" :style="{ height: logoHeight, 'line-height': logoHeight }">用户地址</view>
		</view> -->
		<div class="address-ul" v-if="items.length > 0">
			<ul>
				<li class="address-ul-li" v-for="(item, index) in items" :key="index" @click="changeAddress(item)">
					<div class="address-ul-li-info">
						<div class="address-ul-li-info-con">
							<h3>
								<div style="text-align:center">{{ item.addressMember }}</div>
								<div v-show="item.addressDefault == '1'" :style="{ background: baseColor }">默认</div>
							</h3>
							<div>
								<span>{{ item.addressPhone }}</span>
								<div class="address-detail">
									<div><block v-if="item.provinceName">{{ item.provinceName }} </block><block v-if="item.cityName">{{ item.cityName }} </block><block v-if="item.areaName">{{ item.areaName }} </block><block v-if="item.roadName">{{item.roadName}}</block></div>
									<div>{{ item.addressDetail }}</div>
								</div>
							</div> 
						</div>
						<div class="address-ul-li-info-icon">
							<i class="iconfont" @click.stop="editAddress(item)">&#xe62e;</i>
							<i class="iconfont" @click.stop="removeAddress(item)">&#xe66d;</i>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="address-nulls" v-else><img :src="nullImg | urlFilter" /></div>
		<div class="address-add" :style="{ backgroundColor: baseColor }" @click="addAddressClick">新增</div>
	</div>
</template>

<script>
import { addressList, deleteAddress, updateAddress } from '@/api/interface.js';
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
export default {
	props:{
		propGetJson:{
			type:Number,
			default:0
		}
	},
	data() {
		return {
			items: [],
			nullImg: '/paas/shop-master/c-static/images/wxminiImg/noAddress.png',
			fromm:"",
			key:false
		};
	},
	onLoad(e){
		this.fromm = e.from
	},
	mounted() {
		this.positionCalc()
	},
	onShow(){
		// #ifdef H5
		$routers.refreshH5();
		let pages = $storage.get('olUrl')
		let beforePage = pages[pages.length-1]
		if(beforePage.olUrl == "pages/settleAccounts/settleAccounts"){
			this.key = true
		}
		// #endif
		// #ifndef H5
		var pages = getCurrentPages();//当前页
		var beforePage = pages[pages.length - 2];//上个页面
		if(beforePage.is == "pages/settleAccounts/settleAccounts"){
			this.key = true
		}
		// #endif
		this.commonMounted()
	},
	methods: {
		commonMounted() {
			http.get(addressList).then(res=>{
				this.items = res;
			})
		},
		removeAddress(item) {
			console.log(item)
			let that = this;
			uni.showModal({
				//title: '提示',
				content: '删除地址',
				success(res) {
					if (res.confirm) {
						// console.log('用户点击确定')
						let params = { addressId: item.addressId };
						http.get(deleteAddress,params).then(res=>{
							if (res && res.success) {
								that.commonMounted();
							}
						})
					} else if (res.cancel) {
						// console.log('用户点击取消')
					}
				}
			});
		},
		changeAddress(str) {
			// console.log(11111111)
			// if(str.addressDefault == "1"){
			// 	return
			// }
			// let params = {
			// 	addressMember: str.addressMember,
			// 	addressPhone: str.addressPhone,
			// 	provinceCode: str.provinceCode,
			// 	provinceName: str.provinceName,
			// 	cityCode: str.cityCode,
			// 	cityName: str.cityName,
			// 	areaCode: str.areaCode,
			// 	areaName: str.areaName,
			// 	roadName: str.roadName,
			// 	roadCode: str.roadCode,
			// 	addressDefault: 1,
			// 	addressDetail: str.addressDetail,
			// 	addressId: str.addressId,
			// 	addressCode: str.addressCode,
			// 	dataState: 0
			// }
			if(this.key){
				$storage.set("address",str)
				$routers.back()
			}
				
			// http.get(updateAddress,params).then(res=>{
			// 	if (res && res.success) {
			// 		this.commonMounted();
			// 	}
			// 	if(this.fromm == "car"){
					
			// 	}
			// })
				
			},
		addAddressClick() {
			$routers.push('/pages/address/add/index')
		},
		editAddress(item) {
			$routers.push('/pages/address/edit/index', {addressId: item.addressId})
		},
	}
};
</script>

<style lang="less" scoped>
@import '../../../common/css/common.less';
.car-header {
	position: fixed;
	top: 0rpx;
	width: 100%;
	z-index: 999;
	background: white;
	.backButton{
		position: absolute;
		left: 20rpx;
		bottom: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
	}
	.centerText{
		width: 100%;
		text-align: center;
		font-size: 34rpx;
		font-weight: 500;
	}
}
.address {
	position: relative;
	width: 100%;
	&-add {
		box-sizing: content-box;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 99999;
		border-left: #fff solid 25rpx;
		border-bottom: #fff solid 25rpx;
		border-right: #fff solid 25rpx;
		line-height: 90rpx;
		text-align: center;
		width: 700rpx;
		font-size: @big-title;
		color: #fff;
	}
	&-ul {
		margin-bottom: 115rpx;
		&-li {
			border-bottom: 1rpx solid #f6f6f8;
			padding: 33rpx 0 30rpx 0;
			&-info {
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				box-sizing: border-box;
				padding: 0rpx 25rpx;
				&-con {
					display: flex;
					h3 {
						margin-right: 39rpx;
						div {
							&:first-child {
								margin-bottom: 20rpx;
							}
							&:last-child {
								color: @white-color;
								border-radius: 18rpx;
								height: 36rpx;
								line-height: 36rpx;
								padding: 0 10rpx;
								font-size: 20rpx;
								text-align: center;
								background: #b3a07c;
							}
						}
					}
					span {
						margin-bottom: 20rpx;
						display: inline-block;
					}
					.address-detail {
						font-size: @middle-title;
						color: @color-666;
						div {
							&:last-child {
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								width: 400rpx;
							}
						}
					}
				}
				&-icon {
					display: flex;
					align-items: center;
					i {
						&:last-child {
							margin: 0 10rpx 0 25rpx;
						}
					}
				}
			}
		}
	}
	&-nulls {
		height: calc(100% - 202rpx);
		text-align: center;
		img {
			width: 438rpx;
			height: 280rpx;
			margin: 280rpx auto 0;
		}
	}
}
.address-add{
	text-align: center;
	font-size: 24rpx;
	color: white;
	border-radius: 40rpx;
	line-height: 80rpx;
	border: none;
	left: 25rpx;
	bottom: 25rpx;
}
</style>

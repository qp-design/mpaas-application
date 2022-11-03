<template>
	<!-- 商品推荐列表 -->
	<view>
		<view class="bigBox">
			<view class="recommend">
				<view class="recommend-item" v-for="(item, index) in left" :key="index" @click="jumoToDetail(item)">
					<u-lazy-load class="recom-image" :image="checkImgUrl(item.contlistPicurl || item.dataPic) || urlFilter" :height="330"></u-lazy-load>
					<view class="recom-content">
						<view class="recom-title">
						<vop-label :goodsType='item.goodsType||item.contlistCon'></vop-label>
						{{item.contlistName || item.goodsName}}
						</view>
						<view class="recom-allPrice">
							<view class="recom-price" :style="{color:baseColor}" v-html="money(item.contlistPrice || item.pricesetNprice)"></view>
							<view class="recom-delPrice" v-if="item.contlistConNow==1&&item.contlistPicurl1Now>0" v-html="money(item.contlistPicurl1Now)"></view>
							<view class="recom-delPrice" v-show="item.pricesetMakeprice > 0&&item.pricesetMakeshow!='0'&&item.goodsType!=40" v-html="money(item.pricesetMakeprice)"></view>
						</view>
						<!-- <view class="recom-store-name"><view>阳光采销自营</view></view> -->
					</view>
				</view>
			</view>
			<view class="recommend">
				<view class="recommend-item" v-for="(item, index) in right" :key="index" @click="jumoToDetail(item)">
					<u-lazy-load class="recom-image" :image="checkImgUrl(item.contlistPicurl || item.dataPic) || urlFilter" :height="330"></u-lazy-load>
					<view class="recom-content">
						<view class="recom-title">
						<vop-label :goodsType='item.goodsType'></vop-label>
						{{item.contlistName || item.goodsName}}
						</view>
						<view class="recom-allPrice">
							<view class="recom-price" :style="{color:baseColor}" v-html="money(item.contlistPrice || item.pricesetNprice)"></view>
							<view class="recom-delPrice" v-if="item.contlistConNow==1&&item.contlistPicurl1Now>0" v-html="money(item.contlistPicurl1Now)"></view>
							<view class="recom-delPrice" v-show="item.pricesetMakeprice > 0&&item.pricesetMakeshow!='0'&&item.goodsType!=40" v-html="money(item.pricesetMakeprice)"></view>
						</view>
						<!-- <view class="recom-store-name"><view>阳光采销自营</view></view> -->
					</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" style="margin: 0 auto;" />
	</view>
</template>

<script>
import url from '@/api/configCheck.js'
import { checkImgUrl } from '@/utils/checkImg.js';
import vopLabel from './vop-label.vue'
export default {
	components:{
		vopLabel
	},
	props:{
		recomList:Array,
		status:String,
	},
	data() {
		return {
			checkImgUrl,
			left:[],
			right:[],
			middle:0
		};
	},
	methods:{
		jumoToDetail(e){
			if(e.contlistPicurl3){
				this.$routers.push('detail', {skuNo: e.contlistPicurl3})
			}else{
				this.$routers.push('detail', {skuNo: e.skuCode})
			}
		}
	},
	mounted(){
		this.left = this.recomList.filter((item,index)=>{
			return index%2 == 0
		})
		this.right = this.recomList.filter((item,index)=>{
			return index%2 != 0
		})
	},
	watch:{
		recomList:{
			deep:true,
			handler(val){
				this.left = val.filter((item,index)=>{
					return index%2 == 0
				})
				this.right = val.filter((item,index)=>{
					return index%2 != 0
				})
			}
		},
		// #ifdef H5
		status(n,o){
			if (n === 'nomore') {
				let dom = document.querySelectorAll('.u-loadmore-icon-wrap');
				for (var i = 0; i < dom.length; i++) {
					dom[i].style.display = 'none';
				}
			}
		}
		// #endif
	},
	filters: {
		money(val) {
			return '¥' + val; 
		},
		urlFilter(val) {
			return url.domain + val;
		}
	}
};
</script>

<style lang="scss" scoped>
// 底部商品推荐
v-deep .recom-image{
	image{
		height: 340rpx !important;
	}
}

.bigBox{
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 20rpx 30rpx;
	box-sizing: border-box;
}
.recommend {
	width: 330rpx;
	box-sizing: border-box;
	.recommend-item {
		width: 330rpx;
		margin-bottom: 30rpx;
		border-radius: 8rpx;
		overflow: hidden;
		.recom-content {
			width: 100%;
			box-sizing: border-box;
			background: white;
			padding: 15rpx;
			.recom-title {
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				font-size: 28rpx;
				height:77rpx;
			}
			.recom-tag {
				padding: 10rpx 0rpx;
				box-sizing: border-box;
				view {
					background: #f6f6f6;
					display: inline-block;
					height: 30rpx;
					line-height: 30rpx;
					padding: 0px 10px;
					border-radius: 15rpx;
					font-size: 18rpx;
					margin-right: 15rpx;
				}
			}
			.recom-allPrice{
				display: flex;
				align-items: flex-end;
			}
			.recom-price {
				font-size: 28rpx;
				margin-right: 10rpx;
				margin-bottom: -4rpx;
			}
			.recom-delPrice{
				color: #999;
				font-size: 18rpx;
				text-decoration: line-through;
			}
			.recom-store-name {
				view {
					display: inline-block;
					border-radius: 4rpx;
					font-size: 18rpx;
					color: white;
					background-color: $theme;
					padding: 4rpx;
				}
			}
		}
	}
}
</style>

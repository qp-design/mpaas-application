<template>
	<view class="user">
		<view class="header_top">
			<view class="user_top">
				<view class="user_left">
					<view class="user_logo" v-if="islogin"  @click="goAboutMe()"><image :src="userInfo.avatarUrl||'../../static/img/mine/default_header.png'"></image></view>
					<view class="user_logo" v-else @click="goLogin()"><image src="../../static/img/mine/default_header.png"></image></view>
					<view class="user_message " v-if="islogin">
						<view class="user_name ">{{ userInfo.nickName||loginInfor.userName }}</view>
						<!-- <view class="user_change ">修改个人信息></view> -->
					</view>
					<view class="user_message" v-else><view class="user_name" @click="goLogin()">请登录</view></view>
				</view>
				<!-- <view class="user_right" @click="jump('/pages/webMail/main')"><image src="../../static/index/mail.png"></image></view> -->
			</view>
			<view class="user_bottom">
				<view class="bottom_item" @click="jump('/pages/collection_modules/shop/main?isindex=0')">
					<view class="item_icon "><u-icon name="heart"></u-icon></view>
					<view class="item_name ">商品收藏</view>
					<view class="item_num ">{{ goodsNum || '0' }}</view>
				</view>
				<!-- <view class="bottom_item" @click="jump('/pages/collection_modules/shop/main?isindex=1')">
					<view class="item_name ">店铺收藏</view>
					<view class="item_num ">{{ storeNum || '0' }}</view>
				</view> -->
				<view class="bottom_item" @click="jump('/pages/collection_modules/history/main')">
					<view class="item_icon1 "><u-icon name="eye"></u-icon></view>
					<view class="item_name">浏览足迹</view>
					<view class="item_num ">{{ footerTotal || '0' }}</view>
				</view>
			</view>
		</view>
		<view class="assets_list">
			<view class="assets_item" v-for="(item, index) in assetsList" :key="index" @click="jump(item.url)">
				<view :class="item.icon" class="iconfont "></view>
				<view class="item_name ">{{ item.name }}</view>
			</view>
		</view>
		<view class="member" v-if="mamberlist&&mamberlist.showState === 0&&mamberlist.mobileImage">
			<image class="member--image" :src="mamberlist.mobileImage | urlFilter" mode="" @tap="goMember"></image>
		</view>
		<view class="order_area">
			<view class="order_top" @click="jump('/pages/order/index/main?dataState=0')">
				<view class="order_title ">我的订单</view>
				<view class="more_title ">查看全部 ></view>
			</view>
			<view class="order_list">
				<view class="order_item" v-for="(item, index) in orderList" :key="index" @click="jump(item.url)">
					<view class="Tips" v-if="item.key&&item.value">{{ item.value }}</view>
					<view :class="item.icon" class="iconfont "></view>
					<view class="item_name ">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="order_area">
			<view class="order_top" @click="jump('/pages/group/list/main?dataState=0')">
				<view class="order_title ">我的拼团</view>
				<view class="more_title ">查看全部></view>
			</view>
			<view class="order_list">
				<view class="order_item" v-for="(item, index) in groupList" :key="index" @click="jump(item.url)">
					<view class="Tips" v-if="item.key&&item.value">{{ item.value }}</view>
					<view :class="item.icon" class="iconfont "></view>
					<view class="item_name ">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="order_area">
			<view class="order_top"><view class="order_title">我的工具</view></view>
			<view class="order_list toolList">
				<view class="order_item" v-for="(item, index) in toolList" :key="index" @click="jump(item.url)">
					<image :src="item.icon" class=""></image>
					<view class="item_name " style="margin-top: 16rpx;">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view class="layout_btn">
			<u-button shape="circle" class="btn" @click="layout" >{{islogin?'退出登录':'立即登录'}}</u-button>
		</view>
		<view class="recomend_area">
			<view class="first_style"></view>
			<view class="second_style"></view>
			<view class="title">为您推荐</view>
			<view class="second_style"></view>
			<view class="first_style"></view>
		</view>
		<!-- 商品推荐列表 -->
		<commidityList :recomList="recomList" :status="status"></commidityList>
	</view>
</template>

<script>
import commidityList from '@/components/commidityList.vue';
import http from '@/api/http.js';
import { checkImgUrl } from '@/utils/checkImg.js';
import { history, collection, myOrder, layout } from '@/api/interface.js';
import { index, mamber } from '@/api/newApi.js';
export default {
	components: {
		commidityList
	},
	data() {
		return {
			mamberlist: {},
			checkImgUrl,
			loading: true,
			//用户信息
			userInfo: {},
			loginInfor: {},
			assetsList: [
				{
					name: '我的红包',
					icon: 'icon-wode-hongbaokaquan2x',
					url: '/pages/couponList/main'
				},
				{
					name: '优点兑换',
					icon: 'icon-wode-hongbaokaquan2x',
					url: '/pages/cardColl/index'
				},
				{
					name: '我的礼包',
					icon: 'icon-youhuiquan8',
					url: '/pages/welfare/main'
				},
				// {
				// 	name: '我的积分',
				// 	icon: 'icon-wode-wodejifen2x',
				// 	url: '/pages/integral/main'
				// },
				{
					name: '钱包余额',
					icon: 'icon-wode-hongbaokaquan2x',
          url: '/pages/mine/points'
				}
			],
			orderList: [
				{
					key: 1,
					value: 0,
					name: '待付款',
					icon: 'icon-wode-daifukuan2x',
					url: '/pages/order/index/main?dataState=1'
				},
				{
					key: 2,
					value: 0,
					name: '待发货',
					icon: 'icon-wode-daifahuo2x',
					url: '/pages/order/index/main?dataState=2'
				},
				{
					key: 3,
					value: 0,
					name: '待收货',
					icon: 'icon-wode-daishouhuo2x',
					url: '/pages/order/index/main?dataState=3'
				},
				{
					key: 4,
					value: 0,
					name: '已收货',
					icon: 'icon-wode-daipingjia2x',
					url: '/pages/order/index/main?dataState=4'
				},
				{
					name: '售后服务',
					icon: 'icon-wode-shouhou2x',
					url: '/pages/afterSales/index/main?delta=0'
				}
			],
			groupList:[
				{
					key: 1,
					value: 0,
					name: '待付款',
					icon: 'icon-wode-daifukuan2x',
					url: '/pages/group/list/main?dataState=1'
				},
				{
					key: 2,
					value: 0,
					name: '待成团',
					icon: 'icon-wode-daifahuo2x',
					url: '/pages/group/list/main?dataState=2'
				},
				{
					key: 3,
					value: 0,
					name: '已成团',
					icon: 'icon-wode-daishouhuo2x',
					url: '/pages/group/list/main?dataState=3'
				},
				{
					key: 4,
					value: 0,
					name: '已失败',
					icon: 'icon-wode-daipingjia2x',
					url: '/pages/group/list/main?dataState=4'
				}
			],
			toolList: [
				{
					name: '我的地址',
					icon: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/ad.png',
					url: '/pages/address/list/index'
				},
				{
					name: '我的评价',
					icon: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/ev.png',
					url: '/pages/evaluate_modules/evaluate/main'
				},
				{
					name: '我的发票',
					icon: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/in.png',
					url: '/pages/invoice_modules/myInvo/main'
				},
				{
					name: '我的消息',
					icon: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/ne.png',
					url: '/pages/webMail/main'
				},
				{
					name: '支付密码',
					icon: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/img/pay.png',
					url: '/pages/mine/paySet'
				},
				{
					name: '商家入驻',
					icon: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/BBC/shangjiaruzhu.png',
					url: '/pages/merchantOnboarding/main'
				},
				// {
				// 	name: '分享推广',
				// 	icon: 'https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/tuiguang%402x.png',
				// 	url: '/pages/share/main'
				// }
				
			],
			// 商品推荐
			status: 'loadmore',
			recomList: [],
			islogin: false, //是否登录
			footerTotal: 0,
			goodsNum: 0,
			storeNum: 0,
		};
	},
	onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
		this.userInfo = uni.getStorageSync('userInfo');
		this.loginInfor = uni.getStorageSync('loginInfor');
		this.islogin = uni.getStorageSync('sessionid');
		if (this.islogin) {
			this.getFooterList();
			this.getCollectGoodsData();
			this.getCollectStoreData();
			this.cornerMark();
			this.cornerMark1();
			this.getUlLevelByTenantCode();
		}
	},
	// #ifdef H5
	onTabItemTap: function(e) {
		this.$routers.refresh()
		this.$storage.remove("newUrl")
	},
	// #endif
	methods: {
		async getUlLevelByTenantCode(){
			const res = await http.get(mamber.getUlLevelByTenantCode);
			this.mamberlist = JSON.parse(res.levelRemark)
		},
		goMember() {
			if (!this.islogin) {
				this.showLogin();
				return;
			}
			this.$routers.push('/pages/member/memberLv')
		},
		goAboutMe() {
			if (!this.islogin) {
				this.showLogin();
				return;
			}
			this.$routers.push('/pages/mine/aboutMe')
		},
		// 角标提示
		async cornerMark(){
				let i = 1
				let j = 0
				while(i<=4){
					await http.post(myOrder.queryContractPage,
					{
						page: 1,
						rows: 1,
						childFlag: true,
						packFlag:true,
						dataState: i,
						contractType: '00,40,26,08'
					}).then(res => {
						j++;
						this.orderList.forEach(item => {
							if(item.key === j){
								if(res.pageTools.recordCount < 100){
									item.value = res.pageTools.recordCount
								}else{
									item.value = '99+'
								}
								return;
							}
						})
					});
					i++;
				}
		},
		async cornerMark1(){
				let i = 1
				let j = 0
				while(i<=4){
					
					await http.post(myOrder.getgoodsinfo,
					{
						page: 1,
						rows: 1,
						childFlag: true,
						dataState: i===2?30:i===3?2:i===4?-1:i
					}).then(res => {
						j++;
						this.groupList.forEach(item => {
							if(item.key === j){
								if(res.pageTools.recordCount < 100){
									item.value = res.pageTools.recordCount
								}else{
									item.value = '99+'
								}
								return;
							}
						})
					});
					i++;
				}
		},
	    layout(){
			if(this.islogin){
			    http.post(layout).then(res => {
					if(res.success){
						// #ifndef H5
						uni.clearStorageSync();
						// #endif
						// #ifdef H5
						this.$storage.remove('userId')
						this.$storage.remove('sessionid')
						this.$storage.remove('addressValue')
						this.$storage.remove('loginInfor')
						// #endif
						this.$message.alert('退出成功！')
						// #ifndef H5
						 uni.switchTab({
							url: '/pages/index/main',
								success:()=> {
							        let page = getCurrentPages().pop();
							        page.onShow({Refresh: true});
								}
						})
						// #endif
						// #ifdef H5
						this.$storage.remove('newUrl')
						this.$storage.remove('olUrl')
						window.location.hash='#/pages/index/main'
						// #endif
					}
				})
			}else{
				this.goLogin()
			}
			
		},
		getCollectGoodsData() {
			http.post(collection.queryCollectPage, {
				page: this.page,
				rows: this.rows,
				collectType: 0
			}).then(res => {
				if (res) {
					this.goodsNum = res.total;
				}
			});
		},
		getCollectStoreData() {
			http.post(collection.queryCollectPage, {
				page: this.page,
				rows: this.rows,
				collectType: 1
			}).then(res => {
				if (res) {
					this.storeNum = res.total;
				}
			});
		},
		getFooterList() {
			http.post(history.queryFootprintPagePlat, { page: 1, rows: 10, channnelCode: 'channnelCode' }).then(res => {
				if (res) {
					this.footerTotal = res.total;
				}
			});
		},
		//登录弹框
		showLogin() {
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '请先登录',
				confirmColor: this.baseColor,
				success(res) {
					let pages = getCurrentPages();
					if (res.confirm) {
						// #ifndef H5
						_this.$routers.push('login')
						// #endif
						// #ifdef H5
						_this.$routers.push('/pages/login/main-h5')
						// #endif
					} else if (res.cancel) {
					}
				}
			});
		},
		goLogin() {
			// #ifndef H5
			this.$routers.push('login')
			// #endif
			// #ifdef H5
			this.$routers.push('/pages/login/main-h5')
			// #endif
		},
		jump(url) {
			console.log('11111111');
			if (!this.islogin) {
				this.showLogin();
				return;
			}
			this.$routers.push(url)
		}
	},

	mounted() {
		this.status = 'loading';
		http.get(index.floors, { tginfoMenuCode: 'recommendation' }).then(res => {
			res.list.map((item, index) => {
				if (item.htmltagCode == 'userrec') {
					this.recomList = [...this.recomList,...item.cmsContlistReDomainList];
				}
				
			});
			this.status = 'nomore';
		});
	}
};
</script>

<style lang="scss" scoped>
.user {
	background: #f7f7f7;
	width: 100%;
	.header_top {
		padding: 36rpx 24rpx 108rpx;
		background: $theme;
		.user_top {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.user_left {
				display: flex;
				align-items: center;
				.user_logo {
					width: 134rpx;
					height: 134rpx;
					border-radius: 50%;
					image {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
				.user_message {
					margin-left: 24rpx;
					.user_name {
						color: #ffffff;
						font-weight: 40rpx;
						font-weight: bold;
						line-height: 40rpx;
					}
					.user_change {
						margin-top: 30rpx;
						color: #fff;
						line-height: 18rpx;
						font-size: 18rpx;
					}
				}
			}
			.user_right {
				width: 41rpx;
				height: 40rpx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		.user_bottom {
			padding: 0 50rpx;
			margin-top: 24rpx;
			display: flex;
			justify-content: space-around;
			.bottom_item {
				display: flex;
				justify-content: center;
				align-items: center;
				.item_icon{
					font-size: 26rpx;
					color: #fff;
					padding-top: 2rpx;
				}
				.item_icon1{
					font-size: 30rpx;
					color: #fff;
				}
				.item_name {
					font-size: 24rpx;
					margin-left: 16rpx;
					color: #fff;
				}
				.item_num {
					font-size: 28rpx;
					color: #fff;
					font-weight: bold;
					margin-left: 16rpx;
				}
			}
		}
	}
	.assets_list {
		background: #fff;
		display: flex;
		align-items: center;
		margin: -84rpx 24rpx 0;
		height: 160rpx;
		border-radius: 24rpx;
		justify-content: space-around;
		// padding: 0 68rpx;
		.assets_item {
			display: flex;
			flex-direction: column;
			align-items: center;
			view:first-child {
				font-size: 50rpx;
			}
			.item_name {
				color: #1e1e1e;
				font-size: 24rpx;
			}
		}
	}
	.member {
		& {
			margin: 14rpx 32rpx 14rpx 32rpx;
			border-radius: 24rpx;
			height: 96rpx;
		}
		&--image {
			width: 100%;
			height: 100%;
		}
	}
	.order_area {
		margin: 24rpx;
		padding: 28rpx 24rpx 24rpx;
		background: #fff;
		border-radius: 24rpx;
		.order_top {
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid rgba(0, 0, 0, 0.1);
			padding-bottom: 22rpx;
			.order_title {
				color: #1e1e1e;
				font-size: 28rpx;
				font-weight: bold;
			}
			.more_title {
				color: #999999;
				font-size: 24rpx;
			}
		}
		.order_list {
			padding-top: 24rpx;
			background: #fff;
			display: flex;
			align-items: center;

			justify-content: space-between;

			.order_item {
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				.iconfont {
					font-size: 50rpx;
				}
				image {
					width: 72rpx;
					height: 72rpx;
				}
				.item_name {
					color: #1e1e1e;
					font-size: 24rpx;
				}
				.Tips {
					top: -18rpx;
					left: 42rpx;
					z-index: 1000;
					position: absolute;
					min-width: 36rpx;
					height: 36rpx;
					border-radius: 100rpx;
					border: 1rpx solid #fff;
					padding: 8rpx;
					color: #fff;
					font-size: 24rpx;
					background-color: #ED4444;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
		.toolList{
			flex-wrap: wrap;
			justify-content: flex-start;
			.order_item{
				width: 20%;
				margin-bottom: 24rpx;
			}
		}
		
	}
	.layout_btn {
		margin: 60rpx;
		.btn {
			v-deep .u-btn {
				height: 80rpx;
				font-size: 32rpx;
			}
			v-deep .u-btn::after {
				border: none;
			}
		}
	}
	.recomend_area {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 40rpx;
		.first_style {
			width: 6rpx;
			height: 16rpx;
			background: #cd1c0e;
			margin-right: 6rpx;
		}
		.second_style {
			width: 6rpx;
			height: 28rpx;
			background: #cd1c0e;
			margin-right: 6rpx;
		}
		.title {
			color: #000;
			font-size: 32rpx;
			font-weight: bold;
			margin: 0 14rpx;
		}
	}
}
</style>

<template>
	<view class="content">
		<!-- #ifdef H5 -->
		<view class="car-top-bar" v-show="!['empty','nologin'].includes(carStatus)">
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="car-top-bar" v-if="!['empty','nologin'].includes(carStatus)">
		<!-- #endif -->
			<view class="top-bar-left" @click="addressClick">
				<!-- <image src="../../static/car/location.png" v-show="checkStatus"></image> -->
				<view class="iconfont icon-dianpu---1"></view>
				<view class="address_name">{{ addressValue || '选择地址' }}</view>
			</view>
			<view class="top-bar-right" v-show="checkStatus" @click="checkStatusChange">编辑</view>
			<view class="top-bar-right" v-show="!checkStatus" @click="checkStatusChange">完成</view>
		</view>
		<!-- 未登录 -->
		<!-- #ifndef H5 -->
		<view v-if="carStatus == 'nologin'" style="display: flex;align-items: center;justify-content: center; height:100vh">
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view v-show="carStatus == 'nologin'" style="display: flex;align-items: center;justify-content: center; height:100vh">
		<!-- #endif -->
			<view class="nologin-car">
				<image src="../../static/car/logo.png"></image>
				<view class="login-message">登录后可查看购物车中的商品</view>
				<view class="login-button" @click="gologin">登录</view>
			</view>
		</view>

		<!-- 空状态 -->
		<!-- #ifndef H5 -->
		<view v-else-if="carStatus == 'empty'" style="display: flex;align-items: center;justify-content: center; height:100vh;">
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view v-show="carStatus == 'empty'&&carStatus != 'nologin'" style="display: flex;align-items: center;justify-content: center; height:100vh;">
		<!-- #endif -->
			<view class="empty-car">
				<image src="../../static/car/logo.png"></image>
				<view class="empty-message">购物车里空空荡荡，去逛逛吧 ~</view>
				<view class="empty-button" @click="goIndex">去首页逛逛</view>
			</view>
		</view>

		<!-- 有商品状态 -->
		<!-- #ifndef H5 -->
		<view class="detail-car" v-else>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="detail-car"  v-show="!['empty','nologin'].includes(carStatus)">
		<!-- #endif -->
			<view class="car-store" v-for="(listItem, listIndex) in listItems" :key="listIndex">
				<!-- 店铺头部 -->
				<view class="car-store-top">
					<view class="car-store-top-left">
						<!-- 店铺选框 -->
						<u-checkbox
							@change="storeCheckboxChange(listItem.rowsCheck, listIndex)"
							v-model="listItems[listIndex].rowsCheck == 0"
							:shape="'circle'"
							active-color="#CD1C0E"
							label-size="24"
						>
							<!-- 店铺名称 -->
							<view>
								{{ listItem.memberCname }}
								<text class="iconfont arrow">&#xe61d;</text>
							</view>
						</u-checkbox>
					</view>
					<view class="car-store-top-right" @click="ticketClick"><!-- <image src="../../static/car/ticket.png" class="ticket"></image> --></view>
				</view>

				<view class="car-store-activity" v-for="(listItem2, listIndex2) in listItem.shoppingpackageList" :key="listIndex2">
					<view class="car-store-activity-top" v-if="listItem2.promotionCode">
						<view class="car-store-activity-top-left">
							<view :class="listItem2.pbName == '满减' ? 'activityIcon1' : 'activityIcon2'">{{ listItem2.pbName }}</view>
							{{ listItem2.promotionName ? listItem2.promotionName : '' }}{{ listItem2.disMsg ? listItem2.disMsg : ''
							}}{{ listItem2.disNextMsg ? listItem2.disNextMsg : '' }}
						</view>
						<view class="car-store-activity-top-right" @click="jumpToStore(listItem2)">
							去凑单
							<text class="iconfont arrow">&#xe61d;</text>
						</view>
					</view>
					<view class="car-store-sales">
						<block v-for="(salesItem, salesIndex) in listItem2.shoppingGoodsList" :key="salesIndex">
							<view class="store-sales-item" :style="{'marginBottom':listItem2.promotionCode?'50rpx':'0'}">
								<view class="content-top">
								<view class="sales-item-check">
									<!-- 购物车选框 -->
									<u-checkbox
										@change="salesCheckboxChange(salesItem)"
										v-model="listItems[listIndex].shoppingpackageList[listIndex2].shoppingGoodsList[salesIndex].shoppingGoodsCheck == 0"
										:shape="'circle'"
										active-color="#CD1C0E"
										label-size="24"
									></u-checkbox>
								</view>
								<view class="sales-item-content">
									
									<image class="sales-item-image" :src="salesItem.dataPic | urlFilter" @click="jumoToDetail(salesItem)"></image>
									<view class="sales-item-desc">
										<!-- 名称 -->
										<view class="sales-item-title" @click="jumoToDetail(salesItem)">{{ salesItem.goodsName }}</view>
										<!-- 商品规格 -->
										<view class="sales-item-tag">
											<view>{{ salesItem.skuName.split(' ')[0] }}*{{ salesItem.goodsCamount }}</view>
											<!-- <view @click="discountClick(salesItem, listItem2.promotionCode)" v-if="listItem2.promotionCode">
												<view>{{ listItem2.promotionName }}</view>
												<view class="iconfont icon-jiantou12"></view>
											</view> -->
										</view>
										<!-- 商品重要信息 -->
										<view class="sales-item-important">
											<!-- 商品价格 -->
											<view class="sales-item-price" v-html="money(salesItem.pricesetNprice)"></view>
											<!-- 商品数量 -->
											<view class="sales-item-number">
												<!-- 商品数量控制组件 -->
												<number-box :msg="JSON.stringify(salesItem)" @add="goodsAdd" @reduce="goodsReduce" @inputChange="goodsInput"></number-box>
											</view>
										</view>
									</view>
								</view>
								</view>
								<view class="promotionItem" @click="discountClick(salesItem, listItem2.promotionCode)" v-if="listItem2.promotionCode">
									<view class="promotion-left">
										<view class="pbName">
											{{listItem2.pbName}}
										</view>
										<view>{{ listItem2.promotionName }}</view>
									</view>
									
									<view class="promotion-right">修改</view>
								</view>
								
								<view :class="[salesItem.dataState != 0 ? 'sales-badStatus' : '']">
									<view class="textBox" v-if="salesItem.dataState == 2">已下架</view>
									<view class="textBox" v-if="salesItem.dataState == 3">已失效</view>
									<view class="textBox" v-if="salesItem.dataState == 1">库存不足</view>
								</view>
							</view>
						</block>
					</view>
					<view class="store-sales-line"><view></view></view>
				</view>
			</view>
		</view>

		<!-- 结算在状态底部 -->
		<!-- #ifdef H5 -->
		<view class="car-bottom-bar" v-show="!['empty','nologin'].includes(carStatus) && checkStatus == true">
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="car-bottom-bar" v-if="!['empty','nologin'].includes(carStatus) && checkStatus == true">
		<!-- #endif -->
			<view class="bottom-bar-check">
				<u-checkbox @change="buyCheckboxChange" v-model="countChecked" :shape="'circle'" active-color="#CD1C0E" label-size="24">全选</u-checkbox>
			</view>
			<view class="bottom-bar-right">
				<view class="bottom-bar-totalPrice">
					<view>合计:</view>
					<view v-html="totalPointPrice.toFixed(2)"></view>
					<!-- <view v-html="money(totalPointPrice)"></view> -->
				</view>
				<view class="finalButton" @click="goAccounts">去结算</view>
			</view>
		</view>

		<!-- 编辑状态底部 -->
		<!-- #ifdef H5 -->
		<view class="car-bottom-bar" v-show="!['empty','nologin'].includes(carStatus) && checkStatus == false">
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="car-bottom-bar" v-if="!['empty','nologin'].includes(carStatus) && checkStatus == false">
		<!-- #endif -->
			<view class="bottom-bar-check">
				<u-checkbox @change="buyCheckboxChange" v-model="countChecked" :shape="'circle'" active-color="#CD1C0E" label-size="24">全选</u-checkbox>
			</view>
			<view class="bottom-bar-right">
				<view class="collectButton" @click="moveFavorite">移至收藏夹</view>
				<view class="delButton" @click="deleteSales">删除</view>
			</view>
		</view>

		<!-- 商品推送 -->
		<!-- #ifdef H5 -->
		<view class="sales-push" v-show="carStatus != 'nologin'">
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<view class="sales-push" v-if="carStatus != 'nologin'">
		<!-- #endif -->
			<view class="sales-push-title">
				<view class="push-left-icon">
					<view></view>
					<view></view>
				</view>
				<view class="sales-push-content">为您推荐</view>
				<view class="push-right-icon">
					<view></view>
					<view></view>
				</view>
			</view>
			<commidityList :recomList="recomList" :status="status"></commidityList>
		</view>

		<!-- 优惠券弹窗 -->
		<u-popup v-model="tickShow" mode="bottom" border-radius="24" length="60%">
			<view class="ticketBox">
				<view class="ticketTitle">
					优惠券
					<image src="../../static/car/close.png" @click="ticketClick"></image>
				</view>
				<view class="ticketCan ticketDetail">
					<view class="ticketCanTitle ticketDetailTitle">
						<view>可领取优惠券</view>
						<view>领取后可用</view>
					</view>
					<view class="tickets">
						<view class="ticketItem">
							<image src="../../static/car/ticketBox.png" mode="widthFix"></image>
							<view>
								<view class="ticketLeft">
									<view>
										<text>￥</text>
										10
									</view>
									<view>每满100可用</view>
								</view>
								<view class="ticketRight">
									<view>仅可购买阳光采销直营店部分商品</view>
									<view>2020.12.10-2021.01.09</view>
									<view class="ticketControl">
										<view>有效期30天</view>
										<image src="../../static/car/ticketButton.png" mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="ticketNot ticketDetail">
					<view class="ticketNotTitle ticketDetailTitle">
						<view>已领取优惠券</view>
						<view>以下是您账户中已领取的优惠券</view>
					</view>
					<view class="tickets">
						<view class="ticketItem">
							<image src="../../static/car/ticketBox.png" mode="widthFix"></image>
							<view>
								<view class="ticketLeft">
									<view>
										<text>￥</text>
										10
									</view>
									<view>每满100可用</view>
								</view>
								<view class="ticketRight">
									<view>仅可购买阳光采销直营店部分商品</view>
									<view>2020.12.10-2021.01.09</view>
									<view class="ticketControl">
										<view>有效期30天</view>
										<image src="../../static/car/hadTicket.png" mode="widthFix"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>

		<!-- 地址弹出框 -->
		<view class="detail--addressPopup">
			<u-popup v-model="addressShow" mode="bottom" width="100%" height="966rpx" border-radius="24" :closeable="true">
				<view class="detail--addressPopup--position">配送至</view>
				<scroll-view scroll-y class="detail--addressPopup--main">
					<u-radio-group wrap="true" active-color="red" v-model="addressValue">
						<u-radio @change="radioGroupChange(item)" label-size="28" v-for="(item, index) in addressList" :key="index" :name="item.name">
							<view>{{ item.name }}</view>
							<view>{{ item.addressMember }} {{ item.addressPhone }}</view>
						</u-radio>
					</u-radio-group>
				</scroll-view>
				<view class="detail--addressPopup--shop"><view class="detail--addressPopup--shop--aside" @click="jumpToAddress">新增其他地址</view></view>
			</u-popup>
		</view>

		<!-- 优惠活动弹出框 -->
		<u-popup v-model="discountShow" mode="bottom" border-radius="24" width="100%" :height="discountPoupHeight">
			<view class="discountPoup">
				<view class="discountPoup-title">选择优惠活动</view>
				<view class="discountPoup-main">
					<view class="discountPoup-main-text">若同一商品满足不同的优惠方式或促销活动条件，您可以在下列方式中自主选择其一。不同优惠方式或促销活动不可叠加，不同供应商商品不累计计算。</view>
					<view class="discountPoup-main-radios">
						<u-radio-group v-model="discountValue" wrap="true" active-color="red" @change="discountChange">
							<u-radio label-szie="28" v-for="(item, index) in discountList" :key="index" :name="item.promotionCode">
								<view style="display: flex;justify-content: flex-start;align-items: center;font-size: 20rpx;color:#999999">
									<view :class="item.pbName == '满减' ? 'activityIcon1' : 'activityIcon2'" style="margin-right: 10rpx;">
										{{ item.pbName }}
									</view>
									{{ item.promotionName }}
								</view>
							</u-radio>
						</u-radio-group>
					</view>
				</view>
				<!-- <view :class="['discountPoup-select', 'iconfont', discountSelectDisplay ? 'discountPoup-select-display' : '']" @click="discountSelect">&#xe632;</view> -->
			</view>
		</u-popup>
	</view>
</template>

<script>
import commidityList from '@/components/commidityList.vue';
import numberBox from './numberBox.vue';
import http from '@/api/http.js';
import { index, car, coupon, detail, bigdata, buryspot } from '@/api/newApi.js';
import { addressList, updateAddress, getProappinfo } from '@/api/interface.js';

export default {
	components: {
		commidityList,
		numberBox
	},
	data() {
		return {
			selectArr:[],
			// 购物车状态
			carStatus: '',
			// 购物车选中状态
			checkStatus: true, //true购买状态   false删除状态
			checkList: [], //选中的商品id
			wantList: [], //可下单的商品id
			skuList: [], //选中商品的sku
			// -------------------------------------------

			// 购物车主要数据列表
			listItems: [],
			// 购物车code
			shoppingCode: '',
			// 全选
			countChecked: false,
			// --------------------

			// 各种价格
			productPresentPriceAll: 0,
			totalPointPrice: 0,
			totalPrice: 0,
			// --------------------------

			tickShow: false, //优惠券弹出框
			addressShow: false, //地址弹出框
			discountShow: false, //优惠活动切换
			discountPoupHeight: '440', //优惠券弹框高度
			discountSelectDisplay: false, //优惠券弹框展开按钮
			discountList: [], //优惠活动列表
			discountValue: '', //优惠活动
			discountSale: '', //操作的商品
			ticketBox: [],
			addressList: [],
			addressValue: '',
			// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中,

			// 商品推荐
			status: 'loadmore',
			recomList: []
		};
	},
	onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
		this.commonMounted();
		this.getAddressList();
	},
	// #ifdef H5
	onTabItemTap: function(e) {
		this.$routers.refresh()
		this.$storage.remove("newUrl")
	},
	// #endif
	methods: {
		// 商品增加
		goodsAdd(e) {
			var item = JSON.parse(e);
			var params = {
				shoppingGoodsId: item.shoppingGoodsId,
				amount: item.goodsCamount + 1,
				goodWeight: 0
			};
			if (item.goodsCamount == item.goodsSupplynum) {
				this.$message.alert('库存不足')
				return;
			}
			http.post(car.updateShoppingGoodsNum, params).then(res => {
				if (res && res.success) {
					this.commonMounted();
				} else {
				}
			});
		},
		// 商品减少
		goodsReduce(e) {
			var item = JSON.parse(e);
			var params = {
				shoppingGoodsId: item.shoppingGoodsId,
				amount: item.goodsCamount - 1,
				goodWeight: 0
			};
			if (item.goodsCamount == 1) {
				return;
			}
			if (item.goodsMinnum && item.goodsCamount == item.goodsMinnum) {
				this.$message.alert('起拍不可少于' + item.goodsMinnum + '件')
				return;
			}
			http.post(car.updateShoppingGoodsNum, params).then(res => {
				if (res && res.success) {
					this.commonMounted();
				} else {
				}
			});
		},
		// 购物车输入框
		goodsInput(e) {
			var item = JSON.parse(e);
			var params = {
				shoppingGoodsId: item.shoppingGoodsId,
				amount: item.goodsCamount,
				goodWeight: 0
			};
			http.post(car.updateShoppingGoodsNum, params).then(res => {
				if (res && res.success) {
					this.commonMounted();
				} else {
				}
			});
		},
		// 全选
		buyCheckboxChange() {
			console.log(this.countChecked, 'quanxuan++=');
			let params = {};
			var list = [];
			this.listItems.forEach((storeItem, storeIndex) => {
				var shoppingCode = storeItem.shoppingCode;
				storeItem.shoppingpackageList.forEach((ite, ind) => {
					ite.shoppingGoodsList.forEach((salesItem, salesIndex) => {
						if (this.countChecked) {
							if (salesItem.shoppingGoodsCheck == 0) {
								list.push(salesItem.shoppingGoodsId);
							}
						} else {
							if (salesItem.shoppingGoodsCheck == 1) {
								list.push(salesItem.shoppingGoodsId);
							}
						}
					});
				});
			});
			list = list.join(',');
			params = {
				shoppingGoodsIdStr: list,
				checkState: this.countChecked ? 1 : 0,
				channelCode: 'channelCode'
			};
			http.post(car.checkChange, params).then(res => {
				if (res.success) {
					this.commonMounted();
				} else {
					this.$message.alert(res.msg)
				}
			});
		},
		// 店铺选中改变
		storeCheckboxChange(status, index) {
			var list = [];
			var shoppingCode = this.listItems[index].shoppingCode;
			this.listItems[index].shoppingpackageList.forEach((ite, ind) => {
				ite.shoppingGoodsList.forEach((salesItem, salesIndex) => {
					list.push(salesItem.shoppingGoodsId);
				});
			});
			list = list.join(',');
			let params = {
				shoppingGoodsIdStr: list,
				shoppingCode: shoppingCode,
				checkState: status == 0 ? 1 : 0,
				channelCode: 'channelCode'
			};
			http.post(car.checkChange, params).then(res => {
				if (res && res.success) {
					this.commonMounted();
				}
			});
		},
		// 商品选中状态改变
		salesCheckboxChange(e) {
			let params = {
				shoppingGoodsIdStr: e.shoppingGoodsId,
				shoppingCode: e.shoppingCode,
				checkState: e.shoppingGoodsCheck == 0 ? 1 : 0,
				channelCode: 'channelCode'
			};
			http.post(car.checkChange, params).then(res => {
				if (res && res.success) {
					this.commonMounted();
				}
			});
		},
		// 切换优惠活动
		discountChange(e) {
			http.post(car.updateShoppingGoodsPmInfo, {
				shoppingGoodsId: this.discountSale,
				promotionCode: this.discountValue
			}).then(res => {
				this.discountShow = false;
				this.commonMounted();
			});
		},
		// 状态切换
		checkStatusChange(e) {
			this.checkStatus = !this.checkStatus;
		},
		// 删除商品
		deleteSales(e) {
			http.post(car.deleteSales, {
				shoppingGoodsId: this.checkList.join(',')
			}).then(res => {
				this.commonMounted();
				// #ifdef H5
				this.$routers.refresh();
				// #endif
			});
		},
		// 购物车数据请求与处理
		commonMounted() {
			http.post(car.carDetail).then(res => {
				if (res.hasOwnProperty('list')) {
					this.carStatus = 'islogin';
					this.listItems = res.rows;
					this.shoppingCode = res.rows[0].shoppingCode;
					if (this.listItems.length != 0) {
						this.carStatus = 'full';
					} else {
						this.carStatus = 'empty';
					}
					// shoppingGoodsList---->shoppingGoodsCheck == 0 商品选中
					// shoppingpackageList---->titChecked == 0 店铺下某种优惠全选
					// listItems-----> rowsCheck == 0 店铺全选
					// countChecked == true 全选
					this.listItems.map(v => {
						if (v.shoppingpackageList) {
							v.shoppingpackageList.map(val => {
								//
								val.titChecked = 1;
								if (val.shoppingGoodsList.filter(vm => vm.shoppingGoodsCheck === 0).length === val.shoppingGoodsList.length) {
									val.titChecked = 0;
								}
							});
						}
					});
					this.listItems.map(v => {
						if (v.shoppingpackageList) {
							v.rowsCheck = 1;
							if (v.shoppingpackageList.filter(vm => vm.titChecked === 0).length === v.shoppingpackageList.length) {
								v.rowsCheck = 0;
							}
						}
					});
					if (this.listItems.filter(val => val.rowsCheck === 0).length === this.listItems.length) {
						this.countChecked = true;
					} else {
						this.countChecked = false;
					}

					let totalPrice = 0;
					let totalPointPrice = 0;
					let productPresentPriceAll = 0;
					this.checkList = [];
					this.wantList = [];
					this.selectArr = [];
					this.listItems.map(v => {
						if (v.shoppingpackageList) {
							v.shoppingpackageList.map(val => {
								productPresentPriceAll += Number(val.disMoney);
								this.productPresentPriceAll = productPresentPriceAll;

								totalPointPrice += Number(val.sumMoney);
								totalPrice += Number(val.pricesetRefrice);
								this.totalPointPrice = totalPointPrice - productPresentPriceAll;
								this.totalPrice = totalPrice;
								val.shoppingGoodsList.map(vk => {
									if (vk.shoppingGoodsCheck == 0) {
										this.checkList.push(vk.shoppingGoodsId);
									}
								});
								val.shoppingGoodsList.map(vk => {
									if (vk.shoppingGoodsCheck == 0 && vk.dataState == 0) {
										this.wantList.push(vk.shoppingGoodsId);
										this.selectArr.push(vk);
									}
								});
								val.shoppingGoodsList.map(vk => {
									if (vk.shoppingGoodsCheck == 0 && vk.dataState == 0) {
										this.skuList.push(vk);
									}
								});
							});
						}
					});
				} else if (res.errorCode == 'nologin') {
					this.listItems = [];
					this.carStatus = 'nologin';
				} else {
					this.carStatus = 'empty';
				}
			});
		},
		gologin() {
			// #ifndef H5
			this.$routers.push('/pages/login/main')
			// #endif
			// #ifdef H5
			this.$routers.push('/pages/login/main-h5')
			// #endif
		},
		goIndex() {
			this.$routers.switchTab('index')
		},
		jumpToAddress() {
			this.addressShow = false;
			this.$routers.push('/pages/address/list/index',{from:'car'})
		},
		goAccounts() {
			let arr = []
			let goodsType = []
			console.log('this.selectArr',this.selectArr)
			this.selectArr.forEach(item => {
				
				goodsType.push(item.goodsType)
				if(item.shoppingGoodsPm) {
					arr.push(item.shoppingGoodsPm)
				}	
				
			})
			console.log('arr',arr)
			console.log('goodsType',goodsType)
			let arrSet = new Set(arr);
			let arrSet1 = new Set(goodsType);
			console.log('arrSet',arrSet)
			console.log('arrSet1',arrSet1)
			if(arrSet.size > 1) {
				// ,{stay:5000}
				this.$message.alert('结算不可选多个营销活动!');
				return
			}
			if (this.wantList.length != 0) {
				this.$routers.push('/pages/settleAccounts/settleAccounts',{shoppingGoodsIdStr:JSON.stringify(this.wantList),pageState:1})
			} else { 
				this.$message.alert('请选择商品')
				return;
			}
		},
		// 优惠活动切换
		discountClick(e, value) {
			this.discountPoupHeight = 440;
			this.discountSelectDisplay = false;
			this.discountValue = value;
			this.discountList = e.pmPromotionList;
			this.discountSale = e.shoppingGoodsId;
			this.discountShow = !this.discountShow;
		},
		// 点击优惠券
		ticketClick() {
			this.tickShow = !this.tickShow;
		},
		// 切换地址
		addressClick() {
			this.addressShow = !this.addressShow;
		},
		// 优惠券弹框展开
		discountSelect() {
			this.discountPoupHeight = '';
			this.discountSelectDisplay = true;
		},
		// 移至收藏夹
		moveFavorite() {
			this.skuList.forEach((item, index) => {
				http.post(detail.goodsCollection, {
					collectType: 0,
					collectOpcode: item.skuCode,
					collectOppic: item.dataPic,
					collectOpcont: item.goodsName,
					collectOpmark: '',
					collectOpnum: item.pricesetNprice,
					collectOpnum1: item.pricesetMakeprice,
					goodsOrigin: item.goodsOrigin,
					collectOpurl: ''
				}).then(res => {
					this.$message.alert(res.msg)
				});
			});
			this.deleteSales();
		},
		// 跳转至营销
		jumpToStore(e) {
			console.log(e, '商品营销');
			if (e.promotionCode) {
				this.$routers.push('promotion',{promotionCode:e.promotionCode})
			} else {
				this.$message.alert('未获取到营销活动')
			}
		},
		jumoToDetail(e) {
			this.$routers.push('detail',{skuNo:e.skuCode})
		},
		getAddressList() {
			http.get(addressList).then(res => {
				this.addressList = res.map(item => {
					if (item.roadName) {
						return {
							name: item.provinceName + ' ' + item.cityName + ' ' + item.areaName + ' ' + item.roadName + ' ' + item.addressDetail,
							...item
						};
					} else {
						return {
							name: item.provinceName + ' ' + item.cityName + ' ' + item.areaName + ' ' + item.addressDetail,
							...item
						};
					}
				});
				this.addressValue = this.addressList[0].name;
			});
		},
		// 地址选框改变
		radioGroupChange(e) {
			console.log(e, 'dizhi ');
			var str = e;
			if (str.addressDefault == '1') {
				return;
			}
			let params = {
				addressMember: str.addressMember,
				addressPhone: str.addressPhone,
				provinceCode: str.provinceCode,
				provinceName: str.provinceName,
				cityCode: str.cityCode,
				cityName: str.cityName,
				areaCode: str.areaCode,
				areaName: str.areaName,
				roadName: str.roadName,
				roadCode: str.roadCode,
				addressDefault: 1,
				addressDetail: str.addressDetail,
				addressId: str.addressId,
				addressCode: str.addressCode,
				dataState: 0
			};
			http.get(updateAddress, params).then(res => {
				if (res && res.success) {
					// this.getAddressList();
				}
			});
		}
	},
	mounted() {
		// this.status = 'loading';
		http.get(index.floors, { tginfoMenuCode: 'recommendation' }).then(res => {
			res.list.map((item, index) => {
				if (item.htmltagCode == 'carrec') {
					this.recomList = [...this.recomList, ...item.cmsContlistReDomainList];
				}
			});
		});
	}
};
</script>

<style lang="scss" scoped>
.address_name {
	width: 480rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

v-deep .u-icon-plus.u-icon-plus,
v-deep .u-icon-minus.u-icon-minus {
	background: none !important;
}

v-deep .u-number-input.u-number-input {
	width: 80rpx;
	height: 40rpx;
	background: #f6f6f6;
	border-radius: 10rpx;
}

v-deep .u-radio {
	padding: 20rpx 0;
	line-height: 108rpx;
	border-bottom: 1rpx solid #f1f1f1;

	.u-radio__label.u-radio__label {
		color: #333;
	}
}

.etail--addressPopup--check:last-child {
	border-bottom: none;
}

.arrow {
	position: relative;
	top: -2rpx;
	font-size: 20rpx;
	margin-left: 5rpx;
	font-weight: bold;
}

.ticket {
	width: 72rpx;
	height: 30rpx;
}

.activityIcon1 {
	font-size: 18rpx;
	color: white;
	height: 26rpx;
	line-height: 24rpx;
	border-radius: 12rpx;
	text-align: center;
	width: 60rpx;
	margin-right: 10rpx;
	background-color: $theme;
}

.activityIcon2 {
	font-size: 18rpx;
	color: white;
	height: 26rpx;
	border-radius: 12rpx;
	line-height: 24rpx;
	text-align: center;
	margin-right: 10rpx;
	width: 60rpx;
	background-color: #f8a810;
}

.content {
	width: 100%;
	height: 100%;
	.car-header {
		position: fixed;
		top: 0rpx;
		width: 100%;
		z-index: 999;
		background: white;

		view {
			width: 100%;
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
		}
	}

	.nologin-car {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 88rpx;

		image {
			width: 360rpx;
			height: 270rpx;
			margin-top: 88rpx;
		}

		.login-message {
			margin-top: 38rpx;
			text-align: center;
			font-size: 24rpx;
			color: #333333;
		}

		.login-button {
			width: 210rpx;
			height: 72rpx;
			margin-top: 52rpx;
			border-radius: 40rpx;
			border: 2rpx solid $theme;
			text-align: center;
			line-height: 68rpx;
			font-size: 28rpx;
			color: $theme;
		}
	}

	.empty-car {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 88rpx;
		background: #ffffff;

		image {
			width: 360rpx;
			height: 270rpx;
			margin-top: 88rpx;
		}

		.empty-message {
			margin-top: 38rpx;
			text-align: center;
			font-size: 24rpx;
			color: #999999;
		}

		.empty-button {
			width: 210rpx;
			height: 72rpx;
			margin-top: 52rpx;
			border-radius: 40rpx;
			text-align: center;
			line-height: 68rpx;
			font-size: 28rpx;
			color: #ffffff;
			background-color: $theme;
		}
	}

	.car-top-bar {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 0rpx 24rpx;
		font-size: 28rpx;
		border-radius: 0rpx 0rpx 24rpx 24rpx;
		align-items: center;
		background: white;

		.top-bar-left {
			display: flex;
			align-items: center;

			.iconfont {
				font-size: 40rpx;

				margin-right: 10rpx;
			}
		}

		.top-bar-right {
		}
	}

	.car-bottom-bar {
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom:  var(--window-bottom);
		background: white;
		box-shadow: 0px -2px 8px 1px rgba(0, 0, 0, 0.05);
		z-index: 999;
		box-sizing: border-box;
		padding: 0rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.bottom-bar-check {
		}

		.bottom-bar-right {
			display: flex;

			.bottom-bar-totalPrice {
				display: flex;
				align-items: center;

				& > view:first-child {
					font-size: 30rpx;
				}

				& > view:last-child {
					font-size: 30rpx;
					font-weight: bold;
					color: $theme;
				}
			}

			.finalButton {
				width: 216rpx;
				height: 76rpx;
				background: $theme;
				border-radius: 38rpx;
				color: #ffffff;
				text-align: center;
				font-size: 32rpx;
				line-height: 76rpx;
				margin-left: 24rpx;
			}

			.collectButton {
				width: 216rpx;
				height: 76rpx;
				border-radius: 38rpx;
				border: 2rpx solid #979797;
				color: #333333;
				text-align: center;
				box-sizing: border-box;
				line-height: 72rpx;
			}

			.delButton {
				width: 216rpx;
				height: 76rpx;
				border-radius: 38rpx;
				border: 2rpx solid #979797;
				line-height: 72rpx;
				color: $theme;
				text-align: center;
				box-sizing: border-box;
				margin-left: 24rpx;
			}
		}
	}

	.detail-car {
		width: 100%;
		background: #f7f7f7;
		overflow: hidden;

		.car-store {
			width: 100%;
			background: #ffffff;
			border-radius: 24rpx;
			box-sizing: border-box;
			padding: 30rpx;
			padding-bottom: 0rpx;
			overflow: hidden;
			margin-top: 30rpx;

			.car-store-top {
				width: 100%;
				display: flex;
				justify-content: space-between;
				padding-bottom: 10rpx;
			}

			.car-store-activity {
				padding-top: 20rpx;
				.car-store-activity-top {
					width: 100%;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;
					font-size: 24rpx;
					color: #333333;
					padding-bottom: 15rpx;
					padding-left: 50rpx;

					.car-store-activity-top-left {
						display: flex;

						align-items: center;
					}
					.car-store-activity-top-right {
						width: 152rpx;
						margin-left: 10rpx;
						text-align: right;
					}
				}

				.car-store-sales {
					width: 100%;

					.store-sales-item {
						position: relative;
						height: 220rpx;
						.content-top{
						width: 100%;
						display: flex;
						justify-content: space-between;
						position: relative;
						margin-bottom: 20rpx;
						.sales-item-check {
							width: 36rpx;
							display: flex;
							align-items: center;
						}

						.sales-item-content {
							
							flex: 1;
							// height: 200rpx;
							display: flex;
							justify-content: space-between;
							padding-left: 20rpx;
							// margin: 50rpx 0rpx;

							.sales-item-image {
								width: 200rpx;
								height: 200rpx;
								border-radius: 10rpx;
								background: #f5f5f5;
							}

							.sales-item-desc {
								flex: 1;
								height: 200rpx;
								display: flex;
								justify-content: space-between;
								flex-direction: column;
								box-sizing: border-box;
								padding-left: 20rpx;

								.sales-item-tag {
									& > view {
										width: 170rpx;
										height: 32rpx;
										font-size: 20rpx;
										line-height: 32rpx;
										text-align: center;
										color: #999999;
										background: #f7f7f7;
										border-radius: 16rpx;
										margin-bottom: 10rpx;
										display: -webkit-box;
										-webkit-box-orient: vertical;
										-webkit-line-clamp: 1; //自定义行数
										overflow: hidden;

										// &:last-child {
										//   display: flex;
										//   justify-content: center;
										//   margin: 0rpx 5rpx;
										//   align-items: center;
										// }
									}
								}

								.sales-item-important {
									display: flex;
									justify-content: space-between;

									.sales-item-price {
										color: $theme;
									}
								}
							}
						}

						.sales-badStatus {
							position: absolute;
							width: 100%;
							height: 100%;
							top: 50rpx;
							left: 0rpx;
							z-index: 998;
							background-color: rgba(255, 255, 255, 0.3);

							.textBox {
								width: 200rpx;
								height: 200rpx;
								background: rgba(0, 0, 0, 0.5);
								margin-left: 56rpx;
								text-align: center;
								line-height: 200rpx;
								font-size: 32rpx;
								color: #fff;
								border-radius: 12rpx;
							}
						}
						}
					}
					.promotionItem {
						width: 100%;
						display: flex;
						// height: 80rpx;
						padding-left: 50rpx;
						// margin-top: -50rpx;
						align-items: center;
						font-size: 22rpx;
						justify-content: space-between;
						.promotion-left{
							display: flex;
							align-items: center;
							.pbName{
								    color: white;
								    height: 26rpx;
								    display: flex;
									justify-content: center;
									align-items: center;
								    border-radius: 12rpx;
								    width: 60rpx;
								    margin-right: 10rpx;
								    background-color: #EB2B27;
							}
						}
					}
					.store-sales-item {
						.sales-item-content {
							margin-top: 0rpx;
						}
						.sales-item-check {
							height: 200rpx;
						}
						.sales-badStatus {
							position: absolute;
							top: 0rpx;
							left: 0rpx;
							z-index: 998;
							background-color: rgba(255, 255, 255, 0.3);

							.textBox {
								width: 200rpx;
								height: 200rpx;
								background: rgba(0, 0, 0, 0.5);
								margin-left: 56rpx;
								text-align: center;
								line-height: 200rpx;
								font-size: 32rpx;
								color: #fff;
								border-radius: 12rpx;
							}
						}
					}
				}

				.store-sales-line {
					display: flex;
					justify-content: flex-end;
					box-sizing: border-box;
					padding-left: 50rpx;

					view {
						width: 100%;
						height: 2rpx;
						background: #f1f1f1;
						border-radius: 1rpx;
					}
				}

				.store-sales-line:last-child {
					view {
						height: 3rpx;
					}
				}
			}
		}
	}

	// 商品推送
	.sales-push {
		.sales-push-title {
			display: flex;
			justify-content: center;
			padding: 40rpx 0rpx 20rpx;

			.push-left-icon {
				display: flex;
				align-items: center;

				& > view:first-child {
					width: 6rpx;
					height: 16rpx;
					background: #cd1c0e;
					border-radius: 4rpx;
					margin-right: 6rpx;
				}

				& > view:last-child {
					width: 6rpx;
					height: 28rpx;
					background: #cd1c0e;
					border-radius: 4rpx;
				}
			}

			.sales-push-content {
				font-size: 32rpx;
				padding: 0rpx 12rpx;
				font-weight: bold;
			}

			.push-right-icon {
				display: flex;
				align-items: center;

				& > view:first-child {
					width: 6rpx;
					height: 28rpx;
					background: #cd1c0e;
					border-radius: 4rpx;
					margin-right: 6rpx;
				}

				& > view:last-child {
					width: 6rpx;
					height: 16rpx;
					background: #cd1c0e;
					border-radius: 4rpx;
				}
			}
		}

		background: #f7f7f7;
	}
}

// 优惠券弹出框
.ticketBox {
	.ticketTitle {
		position: relative;
		text-align: center;
		font-size: 32rpx;
		font-weight: 500;
		color: #1e1e1e;
		line-height: 85rpx;

		image {
			position: absolute;
			right: 24rpx;
			top: 24rpx;
			width: 32rpx;
			height: 32rpx;
		}
	}

	.ticketDetail {
		width: 100%;
		box-sizing: border-box;

		.ticketDetailTitle {
			padding: 8rpx 24rpx 0rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #333333;
			display: flex;
			justify-content: flex-start;

			view:last-child {
				margin-left: 16rpx;
				font-size: 20rpx;
				color: #999999;
				display: flex;
				line-height: 50rpx;
			}
		}

		.tickets {
			width: 100%;

			.ticketItem {
				width: 100%;
				position: relative;

				& > image {
					width: 100%;
				}

				& > view {
					position: absolute;
					top: 0rpx;
					width: 100%;
					height: 100%;
					display: flex;
					justify-content: space-between;
					box-sizing: border-box;
					padding: 12rpx 0rpx 24rpx;

					.ticketLeft {
						width: 34%;
						display: flex;
						flex-wrap: wrap;
						align-content: center;
						justify-content: center;

						view {
							width: 100%;
							text-align: center;

							&:first-child {
								font-size: 72rpx;
								font-family: DIN-Black, DIN;
								font-weight: 900;
								color: #333333;
								background: linear-gradient(315deg, #d20000 0%, #ea4a4a 49%, #ff8d8d 100%);
								-webkit-background-clip: text;
								-webkit-text-fill-color: transparent;

								text {
									font-size: 0.5em;
								}
							}

							&:last-child {
								font-size: 24rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								color: #999999;
							}
						}
					}

					.ticketRight {
						width: 64%;
						display: flex;
						flex-wrap: wrap;
						align-content: center;
						justify-content: flex-start;
						box-sizing: border-box;
						padding-top: 10rpx;

						& > view {
							&:first-child {
								font-size: 28rpx;
								font-weight: 600;
								color: #333333;
							}

							&:nth-child(2) {
								font-size: 24rpx;
								color: #999999;
								line-height: 30rpx;
							}
						}

						.ticketControl {
							width: 100%;
							margin-top: 15rpx;
							display: flex;
							justify-content: space-between;
							font-size: 18rpx;
							color: #999999;
							box-sizing: border-box;
							padding-right: 50rpx;

							image {
								width: 120rpx;
								height: 40rpx;
							}

							view {
								line-height: 40rpx;
							}
						}
					}
				}
			}
		}
	}
}

// 地址弹框
.detail--addressPopup {
	&--position {
		padding: 12rpx 0;
		font-size: 32rpx;
		color: #000;
		text-align: center;
	}

	&--main {
		width: 100%;
		height: 734rpx;
		padding: 0 24rpx;
		border-bottom: 1rpx solid #f1f1f1;
		// overflow-y: scroll;
	}

	&--shop {
		width: 100%;
		height: 166rpx;
		background-color: #fff;
		padding: 8rpx 24rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		&--aside {
			width: 100%;
			height: 80rpx;
			border-radius: 40rpx;
			font-size: 24rpx;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: $theme;
		}
	}
}

.discountPoup {
	width: 100%;
	position: relative;

	.discountPoup-title {
		font-size: 32rpx;
		font-weight: bold;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-bottom: 2rpx solid #f1f1f1;
	}

	.discountPoup-main {
		width: 100%;
		box-sizing: border-box;
		padding: 18rpx 32rpx;

		.discountPoup-main-text {
		}
	}

	.discountPoup-select {
		position: absolute;
		top: 395rpx;
		right: 20rpx;
		width: 30rpx;
		height: 30rpx;
		display: block;
		border-radius: 50%;
		color: gray;
	}

	.discountPoup-select-display {
		display: none;
	}
}
</style>

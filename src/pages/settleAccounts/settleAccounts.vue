<template>
	<view class="settle-account">
		<!-- 结算页面 -->
		<!-- 地址页面 -->
		<view class="address" @click="addressClick">
			<view class="address-detail" v-if="isHaveAddress">
				<!-- {{JSON.stringify(this.address)}} -->
				<view class="address-tel">
					<text>{{ address.addressMember }}</text>
					<text>{{ address.addressPhone }}</text>
				</view>
				<text class="area">{{ addressName }}</text>
			</view>
			<view class="address-detail" v-else>
				<!-- {{JSON.stringify(this.address)}} -->
				<text>请先选择收货地址</text>
			</view>
			<i class="iconfont">&#xe61d;</i>
		</view>

		<!-- 商品列表 -->
		<view class="goods-list">
			<view class="shop" v-for="(shoppingItem, index) in shoppingItems" :key="index" v-if="shoppingItems && shoppingItems.length > 0">
				<view class="shop-name">{{ shoppingItem.shoppingpackageList[0].shoppingGoodsList[0].memberCname }}</view>
				<view class="shop-goods" v-for="(list, listIndex) in shoppingItem.shoppingpackageList" :key="listIndex">
					<view class="shop-goods-item" v-for="(goods, goodsIndex) in list.shoppingGoodsList" :key="goodsIndex">
						<image :src="checkImgUrl(goods.dataPic)" mode=""></image>
						<view class="info">
							<view class="name">{{ goods.goodsName }}</view>
							<view class="name1">{{ goods.goodsProperty ? goods.goodsProperty : '' }}</view>
							<view class="model">
								<text>{{ goods.skuName }}</text>
								<text style="padding-left: 32rpx;">{{ goods.skuNo }}</text>
							</view>
							<view class="other">
								<text class="price" :style="{ color: baseColor }">¥ {{ goods.pricesetNprice }}</text>
								<text class="num">×{{ goods.goodsCamount }}</text>
							</view>
							<!-- <view class="returnGoods">支持7天无理由退货</view> -->
						</view>
					</view>
					<view class="shop-goods-item" v-for="(gift, giftIndex) in list.giftList" :key="giftIndex">
						<view class="gift">
							<image :src="checkImgUrl(gift.dataPic)" mode=""></image>
							<view class="gift-item">赠品</view>
						</view>

						<view class="info">
							<view class="name">{{ gift.goodsName }}</view>
							<view class="name1">{{ gift.goodsProperty ||''}}</view>
							<view class="model">{{ gift.skuName }}</view>
							<view class="returnGoods">赠品数量有限，发完即止。</view>
						</view>
					</view>

					<!-- 配送 -->
					<view class="distribution">
						<view class="item">
							<view class="left">
								<view class="method">配送方式</view>
								<view class="postage" v-if="totalFreight == 0">邮费</view>
							</view>
							<view class="middle">
								<view class="method">普通快递</view>
								<view class="postage end" v-if="totalFreight == 0">包邮</view>
							</view>
							<i class="iconfont">&#xe61d;</i>
						</view>
						<view class="item">
							<view class="method">留言</view>
							<input class="postage end other" type="text" v-model="list.packageRemark" placeholder="选填，给商家留言" />
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 商品金额 -->
		<view class="allPrice currency">
			<view class="item">
				<view class="title">商品总额</view>
				<text class="price" :style="{ color: baseColor }">¥{{ shoppingCountPrice.toFixed(2) }}</text>
			</view>
			<view class="item">
				<view class="title">运费</view>
				<text class="price" :style="{ color: baseColor }">¥{{ totalFreight }}</text>
			</view>
			<view class="item" v-show="nlvtotalDiscountPrice">
				<view class="title">会员权益折扣</view>
				<text class="price" :style="{ color: baseColor }">-¥{{ nlvtotalDiscountPrice }}</text>
			</view>
			<view class="item">
				<view class="title">促销满减</view>
				<text class="price" :style="{ color: baseColor }">-¥{{ totalDiscountPrice }}</text>
			</view>
			<view class="item" @click="isShowPreferential">
				<view class="title" :style="{ color: baseColor }">优惠券</view>
				<view class="right">
					<text class="price">-¥{{ comDisMoney }}</text>
					<i class="iconfont">&#xe61d;</i>
				</view>
			</view>
			<view class="total">
				<text>合计：</text>
				<text class="price" :style="{ color: baseColor }">¥{{ accountsSumPrice }}</text>
			</view>
		</view>

		<!-- 选择支付方式 -->
		<view class="invoice currency" @click="isShowPayMethod">
			<view class="item">
				<view class="title">支付方式</view>
				<view class="right">
					<text>{{ scontractPmode == '0' ? '线上支付' : '线下支付' }}</text>
					<i class="iconfont">&#xe61d;</i>
				</view>
			</view>
		</view>

		<!-- 发票 -->
		<!-- <view class="invoice currency">
			<view class="item">
				<view class="title">发票</view>
				<view class="right">
					<text>商品明细-个人</text>
					<i class="iconfont">&#xe61d;</i>
				</view>
			</view>
		</view> -->

		<!-- 底部  立即购买 -->
		<view class="footer">
			<text class="copyWith">应付：</text>
			<text class="price" :style="{ color: baseColor }">¥ {{ shoppingType == '08' ? 0 : accountsSumPrice }}</text>
			<view class="buyNow" @click="savePayPrice" :style="{ background: baseColor }">提交订单</view>
		</view>

		<!-- 地址弹出框 -->
		<view class="detail--addressPopup">
			<u-popup v-model="addressShow" mode="bottom" width="100%" height="966rpx" border-radius="24" :closeable="true">
				<view class="detail--addressPopup--position">配送至</view>
				<scroll-view scroll-y class="detail--addressPopup--main">
					<u-radio-group v-model="addressValue" :wrap="true" active-color="red">
						<u-radio label-size="28" v-for="(item, index) in addressList" :key="index" :name="item.name" @change="radioGroupChange(item)">
							<view class="detail--addressPopup--main--address">{{ item.name }}</view>
							<view class="detail--addressPopup--main--name">{{ item.addressMember }} {{ item.addressPhone }}</view>
						</u-radio>
					</u-radio-group>
				</scroll-view>

				<view class="detail--addressPopup--shop"><view class="detail--addressPopup--shop--aside" @click="jumpToAddress">新增其他地址</view></view>
			</u-popup>
		</view>

		<!-- 优惠弹出框 -->
		<view class="detail--welfarePopup">
			<u-popup v-model="welfareShow" mode="bottom" width="100%" height="966rpx" border-radius="24" :closeable="true">
				<view class="detail--welfarePopup--main">
					<view class="detail--welfarePopup--main--title">优惠券</view>

					<view class="detail--welfarePopup--main--receive">
						<u-checkbox-group max="1">
							<view
								class="detail--welfarePopup--main--receive--item"
								:class="item.isDisabled ? 'coupon-checked' : ''"
								v-for="(item, index) in couponList"
								:key="index"
							>
								<view class="tickets">
									<view class="ticketItem">
										<image src="../../static/car/ticketBox.png" mode="widthFix"></image>
										<view>
											<view class="ticketLeft">
												<view>{{ item.pbName }}</view>
												<view>{{ item.discName }}</view>
											</view>
											<view class="ticketRight">
												<view>{{ item.promotionName }}</view>
												<!-- <view>2020.12.10-2021.01.09</view> -->
												<view class="ticketControl">
													<view>{{ item.couponStart | timeFilter }}至{{ item.couponEnd | timeFilter }}</view>
												</view>
											</view>
											<view class="ticketRightEnd">
												<u-checkbox
													shape="circle"
													v-model="couponList[index].checkModel"
													@change="checkCoupon(item, index)"
													:name="item.usercouponId"
													:disabled="item.isDisabled"
												></u-checkbox>
											</view>
										</view>
									</view>
								</view>
							</view>
						</u-checkbox-group>
					</view>
				</view>
			</u-popup>
		</view>

		<!-- 支付方式弹框 -->
		<view class="detail--payMethodPopup">
			<u-popup v-model="payMethodShow" mode="bottom" width="100%" height="40%" border-radius="24" :closeable="true">
				<view class="detail--payMethodPopup--main">
					<view class="detail--payMethodPopup--main--position">支付方式</view>
					<u-radio-group active-color="red" v-model="scontractPmode">
						<view class="method">
							<text class="iconfont icon-wallet_icon"></text>
							<text class="name">线上支付</text>
							<u-radio label-size="28" name="0"></u-radio>
						</view>
						<!-- <view class="method">
							<text class="iconfont icon-wallet_icon"></text>
							<text class="name">线下支付</text>
							<u-radio label-size="28" name="1"></u-radio>
						</view> -->
					</u-radio-group>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
import moment from 'moment';
import http from '@/api/http.js';
import { checkImgUrl } from '@/utils/checkImg.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import {
	addressList,
	queryToContract,
	calculateFreightFare,
	queryShoppingToContract,
	saveContract,
	coupon,
	detail,
	updateAddress,
	getVopCarriageNew, // 获取京东运费
	queryToContractCodeList,
	syncContractPayState,
	syncContractBatchState,
	getTotalDiscountPrice
} from '@/api/interface.js';
import { formatTimes } from '@/utils/prototype/date.js';
export default {
	data() {
		return {
			goodsTypes:'',
			checkImgUrl,
			usercouponId: '', //优惠券名字
			paymentList: [
				{
					name: '微信支付',
					ischecked: false
				},
				{
					name: '货到付款',
					ischecked: false
				}
			],
			// 地址弹出层
			addressShow: false,
			isHaveAddress: false, //判断是否存在地址
			address: {}, // 选择的地址
			addressList: [], // 所有的地址列表
			addressValue: '', // 显示的地址信息

			shoppingItems: [],
			totalDiscountPrice: 0.0, //权益差价
			lvtotalDiscountPrice: 0, //权益差价
			nlvtotalDiscountPrice: 0,
			shoppingCountPrice: 0, //商品总金额

			discount: 0.0, //优惠劵
			freight: 0.0, // 普通商品运费
			jdFreight: 0.0, // 京东商品运费
			comDisMoney: 0.0, //优惠
			copyComDisMoney: 0.0, // 复制一份优惠值
			contractGoodsList: [], //结算时候需要将所有的商品信息传过去
			scontractBlance: '', // 结算方式 0 全款 1 订金 2 分次 3 分期    多个用,分割
			scontractPmode: 0, // 付款方式 0 线上、 1 线下  2 不付款  多个用,分割
			orderDomainStr: [],
			norderDomainStr: [],
			newOrderDomainStr: [],
			contractSubCode: '',
			query: {},
			baseColor: '',
			couponList: [], //优惠劵列表
			currentIndex: -1,
			currentCoupon: [],
			pmContractGoodsDomainListStr: [], // 获取优惠劵列表需要传所有商品的参数
			selectPromotionName: '', // 选中的优惠劵名字
			pageState: 1,
			disCoupon: false,
			welfareShow: false, //优惠弹出框
			//商品可使用的优惠券
			discountList: [],
			skuId: '',
			goodsNum: '',
			contractBlance: '',
			payMethodShow: false, // 支付方式弹出框
			addressParams: {}, //  jd地址获取运费传参数据
			skuInfo: [],
			goodsBeanStr: '',
			shoppingGoodsIdStr: '',
			promotionCodes: '',
			isTeam: false,
			shoppingType: '',
			addressName: '',
			isok:false,
			isok1:false,
		};
	},
	onLoad(options) {
		this.goodsBeanStr = options.goodsBeanStr;
		console.log(options, 'options');
		this.shoppingGoodsIdStr = options.shoppingGoodsIdStr;
		this.pageState = options.pageState;
		this.disCoupon = options.disCoupon;
		this.skuId = options.skuId;
		this.goodsNum = options.goodsNum;
		if (this.goodsBeanStr) {
			this.shoppingType = JSON.parse(this.goodsBeanStr)[0].shoppingType;
		}
		this.goodsTypes = options.goodsType
		this.promotionCodes = options.promotionCode;
		
		// #ifdef H5	
		
		// 初始化金额信息
		this.shoppingCountPrice = 0.0;
		
		// 初始化地址信息
		this.getAddressList();
		
		//地址接口
		let shoppingGoodsIdStr = this.shoppingGoodsIdStr;
		//商品总价+ 商品列表
		// let params = this.pageState == 0 ? { skuId: this.skuId, goodsNum: this.goodsNum } : { shoppingGoodsIdStr: shoppingGoodsIdStr };
		// let url = this.pageState == 0 ? queryToContract : queryShoppingToContract;
		
		//-----------
		let params = '';
		let url = '';
		if (this.pageState == 0) {
			console.log('pageState为0-this.promotionCodes',this.promotionCodes)
			params = { skuId: this.skuId, goodsNum: this.goodsNum };
			if(this.goodsTypes == '26' || this.goodsTypes == '24') {
				params['shoppingGoodsPm'] = this.promotionCodes
			}
			url = queryToContract;
			console.log('颠三倒四多所多所多所多所 ',params)
		}
		if (this.pageState == 1) {
			params = { shoppingGoodsIdStr: this.shoppingGoodsIdStr };
			url = queryShoppingToContract;
		}
		if (this.pageState == 2) {
			params = { goodsBeanStr: this.goodsBeanStr };
			url = queryToContractCodeList;
		}
		//-----------
		http.post(url, params).then(res => {
			// 如果返回nologin，则return，避免请求并行造成的弹出多个授权框
			if (res.errorCode == 'nologin') {
				return;
			}
		
		/* 	if (!res.success) {
				$message.alert(res.msg);
				// wx.navigateBack({
				//   delta: 1
				// })
				return;
			} */
			if (res.success||res.length) {
				this.shoppingItems = res;
				this.shoppingItems.map(v => {
					v.shoppingpackageList.map(vk => {
						if (vk.pbCode == '0006' || vk.pbCode == '0002') {
							this.totalDiscountPrice += vk.disMoney;
						} else {
							this.comDisMoney += vk.disMoney;
							this.copyComDisMoney += vk.disMoney;
						}
						console.log(this.totalDiscountPrice, 222);
		
						// 每个商家  京东商家
						if (v.shoppingType == '40') {
							this.addressParams = {
								memberCode: v.memberCode,
								tenantCode: v.tenantCode,
								channelCode: 'jdvop'
							};
						}
		
						vk.shoppingGoodsList.map(val => {
							if (v.shoppingType == '40') {
								this.skuInfo.push({
									skuEocode: val.goodsShowno,
									goodsNum: val.goodsCamount
								});
							}
		
							val.dataPic = val.dataPic;
							this.contractGoodsList.push(val);
							this.pmContractGoodsDomainListStr.push(val);
						});
						if (vk.giftList) {
							vk.giftList.map(val => {
								val.dataPic = val.dataPic;
								this.contractGoodsList.push(val);
							});
						}
					});
				});
				console.log(this.shoppingItems, 78787878);
		
				//运费接口
				this.calculateFreight();
				// 有京东商品才调用这个接口
				if (JSON.stringify(this.addressParams) != '{}') {
					this.calculateJdFreight();
				}
			} else {
				setTimeout(()=>{
					$message.alert(res.msg);
				},800)
			}
		});
		// #endif
	},
	onShow() {
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
		// #ifndef H5
		
		// 初始化金额信息
		this.shoppingCountPrice = 0.0;
		
		// 初始化地址信息
		this.getAddressList();
		
		//地址接口
		let shoppingGoodsIdStr = this.shoppingGoodsIdStr;
		//商品总价+ 商品列表
		// let params = this.pageState == 0 ? { skuId: this.skuId, goodsNum: this.goodsNum } : { shoppingGoodsIdStr: shoppingGoodsIdStr };
		// let url = this.pageState == 0 ? queryToContract : queryShoppingToContract;
		
		//-----------
		let params = '';
		let url = '';
		if (this.pageState == 0) {
			console.log('pageState为0-this.promotionCodes',this.promotionCodes)
			params = { skuId: this.skuId, goodsNum: this.goodsNum };
			if(this.goodsTypes == '26' || this.goodsTypes == '24') {
				params['shoppingGoodsPm'] = this.promotionCodes
			}
			url = queryToContract;
			console.log('颠三倒四多所多所多所多所 ',params)
		}
		if (this.pageState == 1) {
			params = { shoppingGoodsIdStr: this.shoppingGoodsIdStr };
			url = queryShoppingToContract;
		}
		if (this.pageState == 2) {
			params = { goodsBeanStr: this.goodsBeanStr };
			url = queryToContractCodeList;
		}
		//-----------
		http.post(url, params).then(res => {
			// 如果返回nologin，则return，避免请求并行造成的弹出多个授权框
			if (res.errorCode == 'nologin') {
				return;
			}
		
		/* 	if (!res.success) {
				$message.alert(res.msg);
				// wx.navigateBack({
				//   delta: 1
				// })
				return;
			} */
			if (res.success||res.length) {
				this.shoppingItems = res;
				this.shoppingItems.map(v => {
					v.shoppingpackageList.map(vk => {
						if (vk.pbCode == '0006' || vk.pbCode == '0002') {
							this.totalDiscountPrice += vk.disMoney;
						} else {
							this.comDisMoney += vk.disMoney;
							this.copyComDisMoney += vk.disMoney;
						}
						console.log(this.totalDiscountPrice, 222);
		
						// 每个商家  京东商家
						if (v.shoppingType == '40') {
							this.addressParams = {
								memberCode: v.memberCode,
								tenantCode: v.tenantCode,
								channelCode: 'jdvop'
							};
						}
		
						vk.shoppingGoodsList.map(val => {
							if (v.shoppingType == '40') {
								this.skuInfo.push({
									skuEocode: val.goodsShowno,
									goodsNum: val.goodsCamount
								});
							}
		
							val.dataPic = val.dataPic;
							this.contractGoodsList.push(val);
							this.pmContractGoodsDomainListStr.push(val);
						});
						if (vk.giftList) {
							vk.giftList.map(val => {
								val.dataPic = val.dataPic;
								this.contractGoodsList.push(val);
							});
						}
					});
				});
				console.log(this.shoppingItems, 78787878);
		
				//运费接口
				this.calculateFreight();
				// 有京东商品才调用这个接口
				if (JSON.stringify(this.addressParams) != '{}') {
					this.calculateJdFreight();
				}
			} else {
				setTimeout(()=>{
					$message.alert(res.msg);
				},800)
			}
		});
		// #endif
	},
	filters: {
		timeFilter(val, str = 'YYYY-MM-DD') {
			return moment(val).format(str);
		}
	},
	mounted() {
		this.discount = 0;
		this.currentIndex = -1;
		this.freight = 0;
		this.baseColor = '#' + this.$state.baseColor;
		// this.shoppingCountPrice = 0;

		if (this.$root.$mp.query.addressMember) {
			this.isHaveAddress = true;
			this.address = this.$root.$mp.query;
		}
	},
	watch:{
			// #ifdef H5
			payMethodShow(n,o){
				if (!n) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			},
			welfareShow(n,o){
				if (!n) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			},
			addressShow(n,o){
				if (!n) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			},
			// #endif
			address(n, o){
				if(JSON.stringify(n)!=='{}'){
					this.isok1 = true
					if(this.isok&&this.isok1) {
						this.handerorderDomainStr()
					}
				}
			},
			isok(n){
				if(n&&this.isok1) {
					this.handerorderDomainStr()
				}
			},
			lvtotalDiscountPrice(n){
				this.nlvtotalDiscountPrice = n
			}
	},
	computed: {
		accountsSumPrice() {
			// 优惠券金额大于 商品金额  应付运费
			if (this.comDisMoney > this.shoppingCountPrice) {
				return this.freight.toFixed(2);
			} else {
				return parseFloat((this.shoppingCountPrice - this.totalDiscountPrice - this.comDisMoney + this.totalFreight - this.lvtotalDiscountPrice).toFixed(2));
			}
		},
		// 总运费
		totalFreight() {
			return this.freight + this.jdFreight;
		}
	},
	methods: {
		// 跳到地址页面
		jumpToAddress() {
			this.addressShow = false;
			this.$routers.push('/pages/address/list/index')
		},
		// 跳到支付方式页面
		jumpToPayMethods(contractBillcode, contractBbillcode, isTeam) {
			if (contractBbillcode) {
				this.$routers.push('/pages/payMethods/payMethods', {contractBbillcode, isTeam})
			} else {
				this.$routers.push('/pages/payMethods/payMethods', {contractBillcode, isTeam})
			}
		},

		// 计算运费
		calculateFreight() {
			//运费接口
			this.shoppingCountPrice = 0;
			let freightFare = '';
			if (this.pageState == 0) {
				freightFare = {
					areaCode: this.address.provinceCode,
					skuIdStr: JSON.stringify([{ skuId: this.skuId, goodsNum: this.goodsNum }])
				};
			}

			if (this.pageState == 1) {
				freightFare = {
					areaCode: this.address.provinceCode,
					shoppingGoodsIdStr: this.shoppingGoodsIdStr
				};
			}

			if (this.pageState == 2) {
				freightFare = {
					areaCode: this.address.provinceCode,
					skuIdStr: this.goodsBeanStr
				};
			}

			http.post(calculateFreightFare, freightFare)
				.then(res => {
					if (res && res.success) {
						this.freight = res.dataObj;
					} else {
						if ((res.errorCode = '-1')) {
							$message.alert(res.msg);
						}
					}
				})
				.then(() => {
					this.shoppingItems.map((v, k) => {
						v.shoppingpackageList.map(vk => {
							vk.shoppingGoodsList.map((val, index) => {
								this.shoppingCountPrice += val.pricesetNprice * val.goodsCamount;
								if (val.goodsType == 24) {
									this.isTeam = true;
								}
								console.log(val.pricesetNprice, val.goodsCamount, this.shoppingCountPrice, '测测测测');
							});
						});
					});
					this.isok = true
				});
		},
		// 计算京东商品运费
		calculateJdFreight() {
			this.addressParams.skuInfos = JSON.stringify(this.skuInfo);
			this.addressParams.areaStr = this.address.provinceName + this.address.cityName + this.address.areaName + this.address.addressDetail;

			// 获取京东运费
			http.post(getVopCarriageNew, this.addressParams).then(res => {
				if (res.success) {
					this.jdFreight = JSON.parse(res.dataObj).totalFreight;
				}
			});
		},

		// 选择地址
		// 地址选框改变
		radioGroupChange(e) {
			var str = e;
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

					// 成功的话替换地址
					this.address = this.addressList.find(val => val.addressId == str.addressId);
					this.addressName = this.address.provinceName + this.address.cityName + this.address.areaName + this.address.roadName + this.address.addressDetail;
					// 计算运费
					this.calculateFreight();
					// 有京东商品才调用这个接口
					if (JSON.stringify(this.addressParams) != '{}') {
						this.calculateJdFreight();
					}
				}
			});
		},

		// 获取地址列表
		getAddressList() {
			http.get(addressList).then(res => {
				if (res && res.length > 0) {
					if($storage.get('address')){
						let address = $storage.get('address');
						this.address = address;
						this.addressName = address.provinceName + address.cityName + address.areaName + address.roadName + address.addressDetail;
					}else{
						const arr = res.filter(item => {
							return item.addressDefault == 1;
						});
						if (arr.length > 0) {
							this.address = arr[0];
							this.addressName = arr[0].provinceName + arr[0].cityName + arr[0].areaName + arr[0].roadName + arr[0].addressDetail;
						} else {
							this.address = res[0];
							this.addressName = res[0].provinceName + res[0].cityName + res[0].areaName + res[0].roadName + res[0].addressDetail;
						}
					}
					this.isHaveAddress = true;
				} else {
					this.isHaveAddress = false;
				}

				this.addressList = res.map(item => {
					if (item.roadName) {
						return { name: item.provinceName + ' ' + item.cityName + ' ' + item.areaName + ' ' + item.roadName + item.addressDetail + ' ', ...item };
					} else {
						return { name: item.provinceName + ' ' + item.cityName + ' ' + item.areaName + ' ' + item.addressDetail, ...item };
					}
				});
				this.addressValue = this.addressList[0].name;
			});
		},
		// 取消选择地址
		cancelAddress() {
			this.addressShow = false;
		},
		// 去选择地址
		addressClick() {
			this.addressShow = true;
		},
		goBack() {
			$routers.back(1, { stay: 500 });
		},
		addClass() {
			$routers.push('user_modules/address/manage', { json: 1 });
		},
		isShowPreferential() {
			if (this.couponList.length > 0) {
				this.welfareShow = true;
				return;
			}
			http.post(coupon.queryUserConByGoods, {
				pmContractGoodsDomainListStr: JSON.stringify(this.pmContractGoodsDomainListStr)
				// skuCode:this.pmContractGoodsDomainListStr[0].skuCode,
				// skuNo:this.pmContractGoodsDomainListStr[0].skuNo,
				// classtreeCode:this.pmContractGoodsDomainListStr[0].classtreeCode,
				// brandCode:this.pmContractGoodsDomainListStr[0].brandCode,
				// pntreeCode:this.pmContractGoodsDomainListStr[0].pntreeCode,
				// memberCode:this.pmContractGoodsDomainListStr[0].memberCode,
			}).then(res => {
				// console.log(res,666)
				if (res.length > 0) {
					this.couponList = res.map(item => {
						return {
							...item,
							checkModel: false
						};
					});
					this.couponList.map(v => {
						v.couponStart = formatTimes(v.couponStart);
						v.couponEnd = formatTimes(v.couponEnd);
						if (v.discStart > this.shoppingCountPrice) {
							v.isDisabled = true;
						} else {
							v.isDisabled = false;
						}
					});
					this.welfareShow = true;
				} else {
					// this.welfareShow = false;
					$message.alert('暂无优惠券!');
				}
			});
		},
		// 支付方式弹窗框
		isShowPayMethod() {
			this.payMethodShow = true;
		},
		checkCoupon(item, index) {
			this.couponList[index].checkModel = !this.couponList[index].checkModel;
			if (this.couponList[index].checkModel) {
				this.currentCoupon = this.couponList[index];
				this.couponOK();
			} else {
				this.currentCoupon = [];
				this.discount = 0;
				this.comDisMoney = 0;
				this.selectPromotionName = ``;
			}
		},
		couponOK() {
			this.selectPromotionName = this.currentCoupon.promotionName;
			if (Object.keys(this.currentCoupon).length > 0) {
				if (this.currentCoupon.pbCode === '0003' || this.currentCoupon.pbCode === '0004') {
					this.discount = this.currentCoupon.discAmount;
					this.comDisMoney = (this.copyComDisMoney + this.discount).toFixed(2);
				}
				if (this.currentCoupon.pbCode === '0005') {
					this.discount = this.shoppingCountPrice * parseFloat(1 - this.currentCoupon.discAmount / 100).toFixed(2);
					this.comDisMoney = (this.copyComDisMoney + this.discount).toFixed(2);
				}
			}
		},
		async handerorderDomainStr(){
			let shoppingGoodsIdStr = this.shoppingGoodsIdStr;
			this.orderDomainStr = [];
			let _htmlMessage = [];
			let pares = $storage.get('contractTypepro');
			let code;
			let typepro;
			
			if (pares && pares == '01') {
				code = $storage.get('goodsPmbillno');
				typepro = '01';
			} else {
				code = $storage.get('promotionCode');
				typepro = '0';
			}
			let dateTimes = new Date();
			let minTimes = dateTimes.getMinutes();
			dateTimes.setMinutes(minTimes + $storage.get('payTime'));
			let htmlDomainStr = [
				{
					contractPaytime: new Date().getTime(),
					// contractPaydate: null,
					goodsPbillno: $storage.get('PeopleNum') || 0, // 成团人数
					goodsPmbillno: this.promotionCodes, // 团购 平团  描述营销单号
					contractProperty: '0', //订单性质
					contractTypepro: typepro, //订单类型属性(引合同、发货/中转)
					contractBlance: this.scontractBlance || 0, //结算方式:全款、订金、融资
					contractPmode: this.scontractPmode || 0, //付款方式：场内、场外，即线上、线下
					contractPumode: '0', //提货方式
					goodsSupplierName: '', //配送商
					goodsSupplierCode: '', //配送商Code
					packageList: [],
					packageMode: '', //配送方式
					contractType: this.shoppingItems[0].shoppingType,
					ocContractSettlList:
						Object.keys(this.currentCoupon).length > 0
							? [
									{
										contractSettlBlance: 'COP',
										contractPmode: '0',
										contractSettlGmoney: Number(this.currentCoupon.couponAmount),
										contractSettlPmoney: Number(this.discount.toFixed(2)),
										contractSettlOpno: this.currentCoupon.usercouponCode,
										contractSettlOpemo: this.currentCoupon.promotionCode
									}
							  ]
							: [],
					contractInmoney: (Number(this.shoppingCountPrice) - this.copyComDisMoney + Number(this.totalFreight.toFixed(2))).toFixed(2), //  销售含税金额 (优惠前)
					contractMoney: (Number(this.shoppingCountPrice) - this.copyComDisMoney - Number(this.discount.toFixed(2))).toFixed(2), // 最终销售含税金额 (优惠后)
					goodsReceiptMem: this.address.addressMember, //收货人
					goodsReceiptPhone: this.address.addressPhone, //收货联系方式
					goodsReceiptArrdess: this.address.provinceName + this.address.cityName + this.address.areaName + this.address.roadName + this.address.addressDetail,
					areaCode: this.address.provinceCode, //从地址上面带过来`
					contractNbillcode: this.shoppingItems[0].contractNbillcode,
					skuIdList: this.shoppingGoodsIdStr,
					giftSkuIdList: []
				}
			];
			
			this.shoppingItems.map((v, index) => {
				this.orderDomainStr.push({
					contractPaytime: new Date().getTime(),
					// contractPaydate: null,
					goodsPbillno: $storage.get('PeopleNum') || 0, // 成团人数
					goodsPmbillno: this.promotionCodes, // 团购 平团  描述营销单号
					contractProperty: '0', //订单性质
					contractTypepro: typepro, //订单类型属性(引合同、发货/中转)
					contractBlance: this.scontractBlance || 0, //结算方式:全款、订金、融资
					contractPmode: this.scontractPmode || 0, //付款方式：场内、场外，即线上、线下
					contractPumode: '0', //提货方式
					goodsSupplierName: '', //配送商
					goodsSupplierCode: '', //配送商Code
					packageMode: '', //配送方式
					contractType: v.shoppingType,
					packageList: [],
					//contractType: this.$state.shoppingType[index].shoppingType,
					ocContractSettlList:
						Object.keys(this.currentCoupon).length > 0
							? [
									{
										contractSettlBlance: 'COP',
										contractPmode: '0',
										contractSettlGmoney: Number(this.currentCoupon.couponAmount),
										contractSettlPmoney: Number(this.discount.toFixed(2)),
										contractSettlOpno: this.currentCoupon.usercouponCode,
										contractSettlOpemo: this.currentCoupon.promotionCode
									}
							  ]
							: [],
					// shoppingGoodsIdList:this.$state.shoppingGoodsIdStr,
					contractInmoney: (Number(this.shoppingCountPrice) - this.copyComDisMoney + Number(this.totalFreight.toFixed(2))).toFixed(2), //  销售含税金额 (优惠前)
					contractMoney: (Number(this.shoppingCountPrice) - this.copyComDisMoney - Number(this.discount.toFixed(2))).toFixed(2), // 最终销售含税金额 (优惠后)
					goodsReceiptMem: this.address.addressMember, //收货人
					goodsReceiptArrdess: this.address.provinceName + this.address.cityName + this.address.areaName + this.address.addressDetail, //收货地址
					goodsReceiptPhone: this.address.addressPhone, //收货联系方式
					areaCode: this.address.provinceCode //从地址上面带过来`
				});
				v.shoppingpackageList.map(val => {
					let list = [];
					if (val.giftList) {
						list = [...val.shoppingGoodsList, ...val.giftList];
					} else {
						list = val.shoppingGoodsList;
					}
					let shoppingGoodsIdList = [];
					val.shoppingGoodsList.map(vk => {
						vk.shoppingGoodsId?shoppingGoodsIdList.push(vk.shoppingGoodsId):shoppingGoodsIdList;
					});
					if (val.disMoney && val.disMoney > 0) {
						console.log(this.orderDomainStr[0].ocContractSettlList, '提交订单1');
						if (val.pmCalcBeanList && val.pmCalcBeanList.length > 0) {
							val.pmCalcBeanList.map(els => {
								this.orderDomainStr[index].ocContractSettlList.push({
									contractSettlBlance: els.promotionInType == 0 ? 'PM' : 'COP',
									contractPmode: '0',
									contractSettlGmoney: Number(els.disMoney.toFixed(2)),
									contractSettlPmoney: Number(els.disMoney.toFixed(2)),
									contractSettlOpno: els.promotionCode,
									contractSettlOpemo: els.promotionName
								});
							});
						}
						htmlDomainStr[0].ocContractSettlList = this.orderDomainStr[0].ocContractSettlList;
						console.log(val.disMoney, this.currentCoupon, this.orderDomainStr[0].ocContractSettlList, '提交订单1');
					}
					if (val.pbCode && val.pbCode == '0001' && val.disMsg && val.disMoney == 0) {
						this.orderDomainStr[0].ocContractSettlList.push({
							contractSettlBlance: 'PM',
							contractPmode: '0',
							contractSettlGmoney: 0,
							contractSettlPmoney: 0,
							contractSettlOpno: val.promotionCode,
							contractSettlOpemo: val.pbCode
						});
					}
					this.orderDomainStr[index].packageList.push({
						contractGoodsList: list,
						shoppingGoodsIdList: shoppingGoodsIdList,
						promotionCode: val.promotionCode,
						packageRemark: val.packageRemark
					});
					htmlDomainStr[0].packageList.push({
						contractGoodsList: list,
						shoppingGoodsIdList: shoppingGoodsIdList,
						promotionCode: val.promotionCode,
						packageRemark: val.packageRemark
					});
				});
			});
			if (htmlDomainStr[0].ocContractSettlList.length) {
				if (htmlDomainStr[0].ocContractSettlList[0].contractSettlPmoney > htmlDomainStr[0].contractInmoney) {
					htmlDomainStr[0].ocContractSettlList[0].contractSettlPmoney = Number(htmlDomainStr[0].contractInmoney) - Number(this.totalFreight);
					htmlDomainStr[0].contractMoney = 0;
				}
			}
			
			// let orderDomainStr = this.pageState == '0' ? JSON.stringify(htmlDomainStr) : JSON.stringify(this.orderDomainStr);
			
			//----
			console.log(this.pageState + '1234567890')
			if (this.pageState == 0) {
				// orderDomainStr = JSON.stringify(htmlDomainStr);
				this.norderDomainStr = JSON.stringify(this.orderDomainStr);
			} 
			
			if (this.pageState == 1) {
				this.norderDomainStr = JSON.stringify(this.orderDomainStr);
				// console.log(orderDomainStr,this.pageState,"提交订单2")
			}
			
			if (this.pageState == 2&&!this.disCoupon) {
				this.norderDomainStr = JSON.stringify(htmlDomainStr);
			}
			if (this.pageState == 2&&this.disCoupon) {
				this.norderDomainStr = JSON.stringify(this.orderDomainStr);
			}
			const ress = await http.post(getTotalDiscountPrice, {rsSkuListStr:this.norderDomainStr});
			if(ress.success){
				this.lvtotalDiscountPrice = ress.dataObj.totalDiscountPrice
				this.newOrderDomainStr = JSON.parse(this.norderDomainStr)
				// this.newOrderDomainStr[0].ocContractSettlList[0] = {
				// 	contractSettlBlance: "UR", //写死
				// 	contractSettlPmoney: this.lvtotalDiscountPrice //权益金额
				// }
			}
		},
		// 保存订单
		async savePayPrice() {
			if (JSON.stringify(this.address) === '{}') {
				$message.alert('请选择地址!');
			} else {
				let params = { orderDomainStr: JSON.stringify(this.newOrderDomainStr) };
				const res = await http.post(saveContract, params);
					if (res.errorCode == 'nologin') {
						return;
					}
					if (res.success) {
						if ((this.pageState == 2&&!this.disCoupon)||(this.pageState == 2&&this.disCoupon&&JSON.parse(this.norderDomainStr).length===1)) {
							http.post(syncContractPayState, { contractBillcode: res.dataObj.contractBillcode }).then(res1 => {
								if (res1.success == true) {
									// #ifndef H5
									this.$routers.replace('/pages/paySuccess/paySuccess', {pageState: 1, contractBillcode: res1.dataObj.contractBillcode,isTeam: this.isTeam})
									// #endif
									// #ifdef H5
									this.$routers.push('/pages/paySuccess/paySuccess', {pageState: 1, contractBillcode: res1.dataObj.contractBillcode,isTeam: this.isTeam})
									// #endif
								} else {
									if (this.isTeam) {
										$message.alert('团购人数已达到上限!');
									}
								}
							});
						}else if(this.pageState == 2&&this.disCoupon&&JSON.parse(this.norderDomainStr).length>1&&this.scontractPmode == '0'){
							http.post(syncContractBatchState, { contractBbillcode: res.dataObj.contractBbillcode }).then(res2 => {
								// #ifndef H5
								this.$routers.replace('/pages/paySuccess/paySuccess', {pageState: 1, contractBillcode: res2.dataObj.contractBillcode,isTeam: this.isTeam})
								// #endif
								// #ifdef H5
								this.$routers.push('/pages/paySuccess/paySuccess', {pageState: 1, contractBillcode: res2.dataObj.contractBillcode,isTeam: this.isTeam})
								// #endif
							})
							
						} else if (this.scontractPmode == '0') {
							// 成功之后  跳到订单页面
							this.jumpToPayMethods(res.dataObj.contractBillcode, res.dataObj.contractBbillcode, this.isTeam);
						} else {
							if (this.isTeam) {
								$message.alert('团购人数已达到上限!');
							}
						}
					} else {
						$message.alert(res.msg);
					}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
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

.detail--addressPopup--check:last-child {
	border-bottom: none;
}

.settle-account {
	// min-height: 100%;
	padding-bottom: 120rpx;
	background-color: #f4f4f4;
}
.address {
	margin-top: 24rpx;
	padding: 0 24rpx;
	width: 100%;
	height: 154rpx;
	background-color: #ffffff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 0px 0px 24rpx 24rpx;
	&-detail {
		font-size: 28rpx;
		.address-tel {
			font-weight: 700;
			color: #000000;
			margin-bottom: 24rpx;
			text {
				margin-right: 48rpx;
			}
		}
		.area {
			color: #333333;
		}
	}
	i {
		font-size: 16rpx;
		font-weight: 400;
		color: #a5a5a5;
		-webkit-text-stroke: 1px #1d1d1d;
		text-stroke: 1px #1d1d1d;
	}
}

.goods-list {
	.shop {
		padding: 40rpx 24rpx;
		background: #ffffff;
		border-radius: 26rpx;
		margin-top: 24rpx;
		&-name {
			font-size: 28rpx;
			font-weight: 500;
			color: #000000;
		}
	}
	.distribution {
		padding-top: 24rpx;
		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 40rpx;
			&:last-child {
				margin-bottom: 0;
			}
			.method {
				font-size: 28rpx;
				color: #333333;
			}
			.middle {
				margin-left: auto;
				margin-right: 36rpx;
			}
			.postage {
				font-size: 24rpx;
				color: #999999;
			}
			.end {
				text-align: right;
			}
			i {
				font-size: 18rpx;
				font-weight: 700;
			}
		}
	}
}
.shop-goods-item {
	display: flex;
	padding: 40rpx 0;
	border-bottom: 2rpx solid #f1f1f1;
	image {
		flex-shrink: 0;
		width: 160rpx;
		height: 160rpx;
		border-radius: 10rpx;
		margin-right: 24rpx;
	}
	.gift {
		position: relative;
		&-item {
			position: absolute;
			left: 0;
			bottom: 0;
			text-align: center;
			width: 160rpx;
			height: 40rpx;
			background: rgba(0, 0, 0, 0.3);
			line-height: 40rpx;
			font-size: 30rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #ffffff;
		}
	}
	.info {
		display: flex;
		// width: 518rpx;
		// height: 160rpx;
		flex-direction: column;
		justify-content: space-between;
		.name {
			min-height: 40rpx;
			font-size: 28rpx;
			color: #1e1e1e;
			line-height: 40rpx;
			margin-bottom: 8rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.name1 {
			min-height: 40rpx;
			font-size: 24rpx;
			color: #999999;
			line-height: 40rpx;
			margin-bottom: 8rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
		}
		.model {
			font-size: 22rpx;
			color: #C3C6CD;
			margin-bottom: 20rpx;
		}
		.other {
			display: flex;
			align-items: center;
			justify-content: space-between;
			// margin: auto 0;
			.price {
				font-size: 28rpx;
				font-weight: 500;
				color: $theme;
			}
			.num {
				font-size: 24rpx;
				color: #a5a5a5;
			}
		}
		.returnGoods {
			font-size: 20rpx;
			color: #999999;
		}
	}
	&:last-child {
		border-bottom: 0;
	}
}

.currency {
	background-color: #ffffff;
	margin-top: 24rpx;
	border-radius: 26rpx;
	padding: 0 24rpx;
	.item {
		display: flex;
		align-items: center;
		height: 90rpx;
	}
	.title {
		font-size: 24rpx;
		font-weight: 500;
		color: #1e1e1e;
	}
	.middle {
		font-size: 24rpx;
		color: #1e1e1e;
		margin-left: 42rpx;
	}
	.right {
		display: flex;
		color: #000000;
		align-items: center;
		margin-left: auto;
		text {
			font-size: 24rpx;
			margin-right: 36rpx;
		}
		i {
			font-size: 18rpx;
			font-weight: bold;
		}
	}
	.price {
		font-size: 24rpx;
		font-weight: 600;
		color: $theme;
		margin-left: auto;
		margin-right: 53rpx;
	}
	.kong {
		color: #999999;
	}
	.total {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		height: 100rpx;
		border-top: 2rpx solid #f1f1f1;
		font-size: 24rpx;
		font-weight: 600;
		color: #1e1e1e;
		.price {
			color: $theme;
			margin-left: 10rpx;
		}
	}
}

.pay-method {
	padding: 10rpx 24rpx;
	background-color: #ffffff;
	font-size: 28rpx;
	color: #333333;
	margin-top: 24rpx;

	border-radius: 24rpx;
	.method {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 78rpx;
	}
}
.footer {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	z-index: 10;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	color: $theme;
	font-weight: bold;
	.copyWith {
		color: #1e1e1e;
		font-size: 28rpx;
		margin: 0 10rpx 0 30rpx;
	}
	.buyNow {
		width: 208rpx;
		height: 74rpx;
		background: $theme;
		border-radius: 37rpx;
		font-size: 26rpx;
		font-weight: 500;
		color: #ffffff;
		text-align: center;
		line-height: 74rpx;
		margin: 0 19rpx 0 auto;
	}
}

// 地址弹出框
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
		/* #ifdef H5 */
		&--address {
			line-height: 50rpx;
		}
		&--name {
			line-height: 50rpx;
		}
		/* #endif */
	}

	&--shop {
		width: 100%;
		height: 166rpx;
		background-color: #fff;
		padding: 8rpx 24rpx 0;
		display: flex;
		justify-content: space-between;

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

//优惠弹出框
.detail--welfarePopup {
	&--main {
		width: 100%;
		height: 966rpx;
		background-color: #fff;
		padding: 24rpx 0 0;

		&--title {
			font-size: 32rpx;
			color: #000;
			text-align: center;
			margin-bottom: 20rpx;
		}

		&--receive {
			&--title {
				display: flex;
				padding: 0 24rpx;
				align-items: flex-end;

				&--left {
					font-size: 28rpx;
					color: #333;
					margin-right: 8rpx;
				}

				&--right {
					font-size: 20rpx;
					color: #999;
				}
			}

			&--item {
				/* #ifndef H5 */
				width: 100%;
				/* #endif */
				/* #ifdef H5 */
				width: 100vw;
				/* #endif */
				padding: 6rpx 0;
				background: url('../../static/teaImg/youhuibg.png') no-repeat;
				background-size: 738rpx 196rpx;

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
							align-items: center;
							box-sizing: border-box;
							padding: 12rpx 0rpx 24rpx;
							.ticketLeft {
								width: 34%;
								display: flex;
								flex-wrap: wrap;
								align-content: center;
								justify-content: center;
								margin-left: 20rpx;
								view {
									width: 100%;
									text-align: center;
									&:first-child {
										font-size: 40rpx;
										font-family: DIN-Black, DIN;
										font-weight: 900;
										color: #333333;
										background: linear-gradient(315deg, #d20000 0%, #ea4a4a 49%, #ff8d8d 100%);
										-webkit-background-clip: text;
										-webkit-text-fill-color: transparent;
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
								margin-left: 40rpx;
								& > view {
									&:first-child {
										font-size: 28rpx;
										font-weight: 600;
										color: #333333;
									}
									// &:nth-child(2){
									// 	font-size: 24rpx;
									// 	color: #999999;
									// 	line-height: 30rpx;
									// }
								}
								.ticketControl {
									width: 100%;
									margin-top: 15rpx;
									display: flex;
									justify-content: space-between;
									font-size: 24rpx;
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
							.ticketRightEnd {
								margin-right: 10rpx;
							}
						}
					}
				}
			}
			.coupon-checked {
				opacity: 0.6;
			}
		}
	}
}

// 支付方式弹框
.detail--payMethodPopup {
	&--main {
		width: 100%;
		padding: 24rpx 24rpx 0;
		&--position {
			font-size: 32rpx;
			color: #000;
			text-align: center;
		}
		.method {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1rpx solid #f1f1f1;
			.name {
				margin-left: 24rpx;
				/* #ifndef H5 */
				margin-right: auto;
				/* #endif */
				/* #ifdef H5 */
				margin-right: 450rpx;
				/* #endif */
			}
		}
	}
}
</style>

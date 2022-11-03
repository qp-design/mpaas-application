<template>
	<view class="detail">
		<!-- 头部搜索栏 -->
		<navBar inputPlaceholder="搜索商品" @getNavBarHeight="GetNavBarHeight"></navBar>

		<!-- 锚点导航 -->
		<view class="detail--nav" v-if="navShow" :style="{ top: topHeight }">
			<view class="detail--nav--item" @click="jumpGoods">
				<view class="detail--nav--item--name">商品</view>
				<view :class="{ 'detail--nav--item--active': viewBox == 'box1' || goodsShow == true }"></view>
			</view>
			<view class="detail--nav--item" @click="jumpEvaluate">
				<view class="detail--nav--item--name">评价</view>
				<view :class="{ 'detail--nav--item--active': viewBox == 'box2' || evaluateShow == true }"></view>
			</view>
			<view class="detail--nav--item" @click="jumpDetails">
				<view class="detail--nav--item--name">详情</view>
				<view :class="{ 'detail--nav--item--active': viewBox == 'box3' || detailsShow == true }"></view>
			</view>
			<view class="detail--nav--item" @click="jumpRecommend">
				<view class="detail--nav--item--name">推荐</view>
				<view :class="{ 'detail--nav--item--active': viewBox == 'box4' || recommendShow == true }"></view>
			</view>
		</view>

		<!-- 滚动的大盒子 -->
		<scroll-view class="detail--warp" scroll-y @scroll="scrollChange" :scroll-into-view="viewBox" scroll-with-animation>
			<!-- 商品展示 -->
			<view class="detail--warp--goods" id="box1">
				<view class="detail--warp--goods--swiper">
					<view class="indicator">{{ swiperIndex + 1 }}/{{ goodsShowList.length }}</view>
					<swiper :autoplay="false" :interval="3000" :duration="1000" :circular="true" @change="changeSwiper">
						<block v-for="(item, index) in goodsShowList" :key="index">
							<swiper-item>
								<video :src="item.goodsFileUrl | urlFilter" controls v-if="item.goodsFileSort == 'video'"></video>
								<image :src="item.goodsFileUrl | urlFilter" v-else></image>
							</swiper-item>
						</block>
					</swiper>
				</view>

				<view class="detail--warp--goods--explain">

					<!-- 秒杀商品 -->
					<!-- <view class="goodsSeckill">
						<view class="simg"></view>
						<view class="sprice">
							<view class="left">
								<view class="ntop">¥8.88</view>
								<view class="obottom">¥9.99</view>
							</view>
							<view class="right">
								88人已买
							</view>
						</view>
						<view class="stime">
							<view class="ttop">距结束仅剩：</view>
							<view class="tbottom">
								<u-count-down :timestamp="96399" color="#fff" separator-color="#EB2B27" font-size="20" bg-color="#EB2B27"></u-count-down>
							</view>
						</view>
					</view> -->

					<!-- 常规商品 -->
					<view class="detail--warp--goods--explain--top">
						<view class="detail--warp--goods--explain--top--left">
							<view class="detail--warp--goods--explain--top--left--one">
								<span style="font-size: 48rpx;margin-right: -10rpx;">￥</span>
								{{ toFix(goodsParams.pricesetNprice, 2, 1) || 0 }}
								<span>{{ toFix(goodsParams.pricesetNprice, 2, 2) || 0 }}</span>
							</view>
							<view class="detail--warp--goods--explain--top--left--three" v-show="goodsParams.pricesetMakeprice != 0">
								<span style="font-size: 26rpx;">￥</span>
								{{ toFix(goodsParams.pricesetMakeprice, 2, 1) || 0 }}
								<span>{{ toFix(goodsParams.pricesetMakeprice, 2, 2) || 0 }}</span>
							</view>
						</view>
						<view class="detail--warp--goods--explain--top--right">{{ goodsVol.memNum || 0 }}人已买</view>
					</view>
					<!-- 收藏弃用 -->
					<view class="detail--warp--goods--explain--bottom" v-if="false">
						<view class="gname">
						<vop-label :goodsType="goodsParams.goodsType"></vop-label>
						{{ goodsParams.goodsName || '' }}
						</view>
						<view class="gxing">
							<text class="iconfont icon-xing1" v-if="collection.dataObj && collection.success == true" @click="cancelCollection"></text>
							<text class="iconfont icon-chakantiezigengduoshoucang" v-else @click="addCollection"></text>
						</view>
					</view>
					<view class="detail--warp--goods--explain--bottomFu">{{ goodsParams.goodsProperty || '' }}</view>
				</view>

				<view class="detail--warp--goods--param">
					<view class="detail--warp--goods--param--discount" v-if="activityList.length > 0" @click="discountShow1">
						<view class="detail--warp--goods--param--discount--left">活动</view>
						<view class="detail--warp--goods--param--discount--center">
							<view class="detail--warp--goods--param--discount--center--top">
								<view class="detail--warp--goods--param--discount--center--top--one">{{ activityList[0].pbName }}</view>
								<view class="detail--warp--goods--param--discount--center--top--two">{{ activityList[0].promotionName }}</view>
							</view>
							<view class="detail--warp--goods--param--discount--center--bottom">
								<view class="detail--warp--goods--param--discount--center--bottom--one">{{ activityList[1].pbName }}</view>
								<view class="detail--warp--goods--param--discount--center--bottom--two">{{ activityList[1].promotionName }}</view>
							</view>
						</view>
						<view class="detail--warp--goods--param--discount--right">
							<view class="detail--warp--goods--param--discount--right--more">
								<view class="detail--warp--goods--param--discount--right--more--left"></view>
								<view class="detail--warp--goods--param--discount--right--more--center"></view>
								<view class="detail--warp--goods--param--discount--right--more--right"></view>
							</view>
						</view>
					</view>

					<view class="detail--warp--goods--param--welfare" @click="welfareShow1">
						<view class="detail--warp--goods--param--welfare--left">优惠</view>
						<view class="detail--warp--goods--param--welfare--center">领取优惠券</view>
						<view class="detail--warp--goods--param--welfare--right">
							<view class="detail--warp--goods--param--welfare--right--more">
								<view class="detail--warp--goods--param--welfare--right--more--left"></view>
								<view class="detail--warp--goods--param--welfare--right--more--center"></view>
								<view class="detail--warp--goods--param--welfare--right--more--right"></view>
							</view>
						</view>
					</view>

					<view class="detail--warp--goods--param--norms" @click="normsShow1">
						<view class="detail--warp--goods--param--norms--left">已选</view>
						<view class="detail--warp--goods--param--norms--center">
							{{ goodsData.rsSkuDomainList[specIndex||0].skuName || '未选择' }}，{{ startNum || 0 }} {{ goodsParams.partsnameNumunit || '个' }}
						</view>
						<view class="detail--warp--goods--param--norms--right">
							<view class="detail--warp--goods--param--norms--right--more">
								<view class="detail--warp--goods--param--norms--right--more--left"></view>
								<view class="detail--warp--goods--param--norms--right--more--center"></view>
								<view class="detail--warp--goods--param--norms--right--more--right"></view>
							</view>
						</view>
					</view>

					<view class="detail--warp--goods--param--address" @click="addressShow1">
						<view class="detail--warp--goods--param--address--left">送至</view>
						<view class="detail--warp--goods--param--address--center">
							<view class="detail--warp--goods--param--address--center--top">{{ addressValue }}</view>
							<!-- <view class="detail--warp--goods--param--address--center--bottom" v-if="isHave">现货</view>
							<view class="detail--warp--goods--param--address--center--bottom" v-else>无货</view> -->
						</view>
						<view class="detail--warp--goods--param--address--right">
							<view class="detail--warp--goods--param--address--right--more">
								<view class="detail--warp--goods--param--address--right--more--left"></view>
								<view class="detail--warp--goods--param--address--right--more--center"></view>
								<view class="detail--warp--goods--param--address--right--more--right"></view>
							</view>
						</view>
					</view>
				</view>


			</view>
			<!-- 商品评价 -->
			<view class="detail--warp--evaluate" id="box2">
				<view class="detail--warp--evaluate--content">
					<view class="detail--warp--evaluate--content--all">
						<view class="detail--warp--evaluate--content--all--left">评价</view>
						<view class="detail--warp--evaluate--content--all--right">
							<view class="detail--warp--evaluate--content--all--right--one" @click="goEvalueList">全部</view>
							<view><text class="iconfont icon-xiangyou"></text></view>
						</view>
					</view>
					<view v-for="(item, index) in userEvaluate" :key="index">
						<view class="detail--warp--evaluate--content--detailed" v-if="item.evaluateGoodsShow">
							<view class="detail--warp--evaluate--content--detailed--nickname">
								<view class="detail--warp--evaluate--content--detailed--nickname--portrait">
									<image :src="checkImgUrl(item.userImgurl)" mode="" style="width: 100%;height: 100%;"></image>
								</view>
								<view class="detail--warp--evaluate--content--detailed--nickname--name">
									<view class="detail--warp--evaluate--content--detailed--nickname--name--top">{{ item.memberBname }}</view>
									<view class="p_list" v-if="item.evaluateAddImg1 == 0">
										<view class="active_item">好评</view>
									</view>
									<view class="p_list" v-if="item.evaluateAddImg1 == 1">
										<view class="active_item">中评</view>
									</view>
									<view class="p_list" v-if="item.evaluateAddImg1 == 2">
										<view class="active_item">差评</view>
									</view>
								</view>
								<view class="detail--warp--evaluate--content--detailed--nickname--time">{{ handleTime(item.gmtCreate, 'YYYY-MM-DD') }}</view>
							</view>
							<view class="detail--warp--evaluate--content--detailed--comment">{{ item.evaluateGoodsContent }}</view>
							<view class="detail--warp--evaluate--content--detailed--picture" v-if="item.evaluateGoodsImgsList[0] != ''">
								<view class="detail--warp--evaluate--content--detailed--picture--item" v-for="(item1, index1) in item.evaluateGoodsImgsList"
								 :key="index1">
									<image :src="checkImgUrl(item1)" @click="preview(item)"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="detail--warp--evaluate--content--more" @click="goEvalueList">查看更多评价</view>
				</view>
			</view>
			<!-- 商品详情 -->
			<view class="detail--warp--details" id="box3">
				<view class="detail--warp--details--explain">
					<view class="detail--warp--details--explain--left">
						<image src="../../static/teaImg/zhuangshileft.png"></image>
					</view>
					<view class="detail--warp--details--explain--center">商品详情</view>
					<view class="detail--warp--details--explain--right">
						<image src="../../static/teaImg/zhuangshiright.png"></image>
					</view>
				</view>
				<rich-text :nodes="goodsRemark"></rich-text>

				<!-- <u-parse :content="goodsData.goodsRemark"></u-parse> -->
			</view>
			<!-- 商品为你推荐 -->
			<view class="detail--warp--recommend" id="box4">
				<view class="detail--warp--recommend--explain">
					<view class="detail--warp--recommend--explain--left">
						<image src="../../static/teaImg/zhuangshileft.png"></image>
					</view>
					<view class="detail--warp--recommend--explain--center">为你推荐</view>
					<view class="detail--warp--recommend--explain--right">
						<image src="../../static/teaImg/zhuangshiright.png"></image>
					</view>
				</view>

				<commidityList :recomList="recomList" :status="status"></commidityList>
			</view>
		</scroll-view>

		<!-- 底部导航 -->
		<view class="detail--purchase">
			<view class="detail--purchase--warp">
				<!-- <view class="detail--purchase--warp--shop" @click="goShop">
					<text class="iconfont icon-dianpu"></text>
					<view>店铺</view>
				</view> -->
				<view class="detail--purchase--warp--service" @click='kefu'>
					<text class="iconfont icon-kefu"></text>
					<view>客服</view>
				</view>
				<!-- 购物车停用 -->
				<view class="detail--purchase--warp--car" @click="goCar" v-if="false">
					<text class="iconfont icon-gouwuche"></text>
					<view>购物车</view>
				</view>
				<view class="detail--purchase--warp--btn1" v-if="goodsData.goodsType!='24'">
					<view class="detail--purchase--warp--btn1--car" @click="normsShow1">加入购物车</view>
				</view>
				<view class="detail--purchase--warp--btn2">
					<view class="detail--purchase--warp--btn1--shopping" @click="normsShow1" :style="{width:(goodsData.goodsType=='24'?'100%':'208rpx')}">立即购买</view>
				</view>
				<button open-type="contact" class="detail--purchase--warp--kfBtn" v-if='isHaveKf'></button>
			</view>
		</view>

		<!-- 客服kefuShow -->
		<view class="detail--kefuShow">
			<view>
				<!--  -->
				<u-modal v-model="kefuShow" :content="Number(content)!=NaN?'客服热线：'+content:content" title='联系客服'
				 :show-cancel-button='true' :show-confirm-button="Number(content)!=NaN?true:false" confirm-text='呼叫' confirm-color='#ED4444'
				 :cancel-color="Number(content)!=NaN?'#888E9B':'#ED4444'" :title-style="{fontWeight: 'bold'}" @confirm='openkefu'>
				</u-modal>
			</view>
			<button open-type="contact" class="kefuShows" ref='kefuShow'></button>
		</view>

		<!-- 活动弹出框 -->
		<view class="detail--discountPopup">
			<u-popup v-model="discountShow" mode="bottom" width="100%" height="966rpx" border-radius="24" closeable>
				<view class="detail--discountPopup--main">
					<view class="detail--discountPopup--main--title">活动</view>

					<view class="detail--discountPopup--main--item" v-for="(item, index) in activityList" :key="index">
						<view class="detail--discountPopup--main--item--top">{{ item.pbName }}</view>
						<view class="detail--discountPopup--main--item--bottom">
							<view class="detail--discountPopup--main--item--bottom--left">{{ item.pbName }}</view>
							<view class="detail--discountPopup--main--item--bottom--right">{{ item.promotionName }}</view>
						</view>
					</view>
				</view>
			</u-popup>
		</view>

		<!-- 优惠弹出框 -->
		<view class="detail--welfarePopup">
			<u-popup v-model="welfareShow" mode="bottom" width="100%" height="966rpx" border-radius="24" closeable>
				<view class="detail--welfarePopup--main">
					<view class="detail--welfarePopup--main--title">优惠券</view>

					<view class="detail--welfarePopup--main--receive" v-if="discountList.length > 0">
						<view class="detail--welfarePopup--main--receive--title">
							<view class="detail--welfarePopup--main--receive--title--left">可领取的优惠券</view>
							<view class="detail--welfarePopup--main--receive--title--right">领取后可用</view>
						</view>

						<view class="detail--welfarePopup--main--receive--item" v-for="(item, index) in discountList" :key="index" v-show="item.availabledate == 0">
							<view class="tickets" @click="getWelfare(index, item.availabledate == 0)">
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
												<view>{{ timesSeconds(item.promotionBegintime) }}至{{ timesSeconds(item.promotionEndtime) }}</view>
												<image src="../../static/car/ticketButton.png" mode="widthFix"></image>
												<!-- <image src="../../static/car/hadTicket.png" mode="widthFix" v-else></image> -->
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="detail--welfarePopup--main--error" v-else>
						<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/shenheshibai.png"></image>
					</view>

					<!-- 领取优惠券消息提示框 -->
					<view class="detail--welfarePopup--main--toast">
						<u-toast ref="welfareToast" />
					</view>
				</view>
			</u-popup>
		</view>

		<!-- 规格弹出框 -->
		<view class="detail--normsPopup">
			<u-popup v-model="normsShow" mode="bottom" width="100%" height="966rpx" border-radius="24" closeable>
				<view class="detail--normsPopup--main">
					<view class="detail--normsPopup--main--param">
						<view class="detail--normsPopup--main--param--left">
							<image :src="goodsParams.dataPic | urlFilter"></image>
						</view>
						<view class="detail--normsPopup--main--param--right">
							<view class="detail--normsPopup--main--param--right--one" v-if="goodsData.rsSkuDomainList">
								<view class="detail--normsPopup--main--param--right--one--left">
									<span style="font-size: 48rpx;margin-right: -10rpx;">￥</span>
									{{ toFix(goodsData.rsSkuDomainList[specIndex].pricesetNprice,2,1) ||0}}
									<span>{{ toFix(goodsData.rsSkuDomainList[specIndex].pricesetNprice, 2, 2)||0 }}</span>
								</view>
								<view class="detail--normsPopup--main--param--right--one--right" v-show="goodsData.rsSkuDomainList[specIndex||0].pricesetMakeprice != 0">
									<span style="font-size: 26rpx;">￥</span>
									{{ toFix(goodsData.rsSkuDomainList[specIndex].pricesetMakeprice, 2, 1) ||0}}
									<span>{{ toFix(goodsData.rsSkuDomainList[specIndex].pricesetMakeprice, 2, 2)||0 }}</span>
								</view>
							</view>
							<!-- <view class="detail--normsPopup--main--param--right--two">库存:{{ goodsParams.goodsSupplynum }}{{ goodsParams.partsnameNumunit || '个' }}</view> -->
							<view class="detail--normsPopup--main--param--right--three">
								已选：{{ goodsData.rsSkuDomainList[specIndex||0].skuName }}，{{ startNum }} {{ goodsParams.partsnameNumunit || '个' }}
							</view>
							<view class="detail--normsPopup--main--param--right--four">编号：{{ goodsData.rsSkuDomainList[specIndex||0].skuNo }}</view>
						</view>
					</view>

					<view v-if="goodsData.goodsType!='24'">
						<view class="detail--normsPopup--main--model" v-for="(item, index) in specValueList" :key="index">
							<view class="detail--normsPopup--main--model--top">{{ item.specName }}</view>
							<view class="detail--normsPopup--main--model--bottom">
								<view v-for="(items, indexs) in item.list" :key="indexs" :class="['detail--normsPopup--main--model--bottom--item', items.isshow == true ? 'active' : '']"
								 @click="optSpec(items, indexs, item)">
									{{ items.specValueValue }}
								</view>
							</view>
						</view>
					</view>
					<view class="" v-else>
						<view class="detail--normsPopup--main--model" >
							<!-- <view class="detail--normsPopup--main--model--top">{{ item.specName }}</view> -->
							<view class="detail--normsPopup--main--model--bottom">
								<view
									
									:class="['detail--normsPopup--main--model--bottom--item', 'active']"
									
								>
									{{ goodsData.rsSkuDomainList[specIndex].skuName }}
								</view>
							</view>
						</view>
					</view>
					<view class="detail--normsPopup--main--num">
						<view class="detail--normsPopup--main--num--top">数量</view>
						<view class="detail--normsPopup--main--num--bottom">
							<view class="detail--normsPopup--main--num--bottom--edit">
								<view class="detail--normsPopup--main--num--bottom--edit--left" @click="reduce" style="color: #333;">-</view>
								<view class="detail--normsPopup--main--num--bottom--edit--center">{{ startNum }}</view>
								<view class="detail--normsPopup--main--num--bottom--edit--right" @click="plus">+</view>
							</view>
							<view class="detail--normsPopup--main--num--bottom--start">起订量:{{ goodsData.goodsMinnum || 1 }}/{{ goodsParams.partsnameNumunit || '个' }}</view>
						</view>
					</view>
				</view>

				<view class="detail--normsPopup--shop">
					<view v-if="isHave" style="display: flex;justify-content: space-between;">
						<view class="detail--normsPopup--shop--car" @click="addCart" v-if="goodsData.goodsType!='24'">加入购物车</view>
						<view class="detail--normsPopup--shop--shopping" @click="shopping" :style="{width:(goodsData.goodsType=='24'?'100%':'335rpx')}">立即购买</view>
					</view>
					<view v-else class="no_goods">暂时无货</view>
				</view>
			</u-popup>
		</view>

		<!-- 加入购物车消息提示框 -->
		<view>
			<u-toast ref="shopCarToast" />
		</view>

		<!-- 地址弹出框 -->
		<view class="detail--addressPopup">
			<u-popup v-model="addressShow" mode="bottom" width="100%" height="966rpx" border-radius="24" closeable>
				<view class="detail--addressPopup--position">配送至</view>
				<scroll-view scroll-y class="detail--addressPopup--main">
					<u-radio-group v-model="addressValue" wrap="true" active-color="red" @change="radioGroupChange">
						<u-radio label-size="28" v-for="(item, index) in addressList" :key="index" :name="item.name">{{ item.name }}</u-radio>
					</u-radio-group>
				</scroll-view>

				<view class="detail--addressPopup--shop">
					<view class="detail--addressPopup--shop--aside" @click="jumpToAddress">新增其他地址</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import moment from 'moment';
	import {
		checkImgUrl
	} from '@/utils/checkImg.js';
	import commidityList from '@/components/commidityList.vue';
	import _ from 'lodash';
	import http from '@/api/http.js';
	import {
		detail,
		buryspot,
		bigdata,
		index,
		shareResourceGoods
	} from '@/api/newApi.js';
	import {
		addressList,
		search,
		querySkuPage,
		getSkuBySpecNew,
		myOrder
	} from '@/api/interface.js';
	// import url from '../../config.json';
	import {
		timesSeconds
	} from '@/utils/formate.js';
	import navBar from '@/components/navBarD.vue';
	import vopLabel from '@/components/vop-label.vue'
	
	export default {
		components: {
			commidityList,
			navBar,
			vopLabel
		},
		watch: {
			// #ifdef H5
			discountShow(newValue, oldValue) {
				if (!newValue) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			},
			welfareShow(newValue, oldValue) {
				if (!newValue) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			},
			normsShow(newValue, oldValue) {
				if (!newValue) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			},
			addressShow(newValue, oldValue) {
				if (!newValue) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			},
			kefuShow(newValue, oldValue) {
				if (!newValue) {
					let dom = document.querySelectorAll('.u-mask');
					let dom1 = document.querySelectorAll('.u-drawer-content');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
					for (var i = 0; i < dom1.length; i++) {
						dom1[i].style.display = 'none';
					}
					let dom2 = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom2.length; i++) {
						dom2[i].style.display = 'none';
					}
				}
			},
			// #endif
		},
		data() {
			return {
				isHaveKf: false, //是否有客服
				kefuShow: false,
				content: '抱歉，该商家暂未提供联系方式',
				promotionCode: '',
				goodsType: '',
				specValueList: [],
				topHeight: '',
				goodsRemark: '',
				timesSeconds,
				checkImgUrl,
				isHave: false, //是否有货
				navShow: false, //导航条显示隐藏
				//导航条高亮效果
				goodsShow: false,
				evaluateShow: false,
				detailsShow: false,
				recommendShow: false,
				evaluateList: ['好评', '中评', '差评'],
				//滚动到某个盒子   各个模块的高度
				viewBox: 'box1',
				box1Height: '0',
				box2Height: '0',
				box3Height: '0',
				box4Height: '0',
				specification: [],

				discountShow: false, //活动弹出框

				welfareShow: false, //优惠弹出框

				addressShow: false, //地址弹出框

				normsShow: false, //规格弹出框

				//地址弹框的地址列表
				addressList: [],
				//默认展示地址
				addressValue: '',

				//起始数量
				startNum: 1,

				//详情页参数
				skuCode: '',

				//商品参数
				goodsParams: {},

				//轮播图视频 图片展示
				goodsShowList: [],

				//店铺名称
				shopName: {},

				//店铺展示
				storeShow: [],

				//用户评价
				userEvaluate: [],

				//商品可参与的营销活动
				activityList: [],

				//商品可使用的优惠券
				discountList: [],

				//商品详情接口返回的所有数据
				goodsData: {},

				//规格名称(型号)
				specList: [],

				//是否收藏
				collection: {},

				//规格下标
				specIndex: 0,

				//轮播图下标
				swiperIndex: 0,

				// 商品推荐
				status: 'loadmore',
				recomList: [],
				goodsStockNum: 0,
				skulist: [],
				promotionFrequency:'',
				//商品销量
				goodsVol: {}
			};
		},

		// 首页跳转  获取skuNo
		onLoad(e) {
			console.log(e, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
			this.skuCode = e.skuCode;
			if(e.promotionFrequency){
				this.promotionFrequency = e.promotionFrequency
			}
			this.promotionCode = e.promotionCode
			// #ifdef MP-WEIXIN
			this.isHaveKf = true
			// #endif
		},
		// #ifdef H5
		onBackPress(options) {
			window.history.back()
			return true
		},
		// #endif
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
			//获取地址
			this.getAddressList();
		},

		//created的优先级高于onload
		created() {
			this.scrollChange = _.throttle(this.scrollChange, 300);
		},

		mounted() {
			//商品详情
			http.get(detail.goodsDetail, {
				skuCode: this.skuCode
			}).then(res => {
				console.log(res);
				this.goodsData = res;
				this.promotionCode = res.ginfoCode
				this.goodsShowList = res.rsGoodsFileDomainList;
				this.goodsParams = res.rsSkuDomainList[0];
				this.goodsStockNum = this.goodsParams.goodsSupplynum;
				this.startNum = res.goodsMinnum || 1;
				this.goodsModel = res.rsSpecValueDomainList;
				this.goodsType = res.goodsType
				// 获取客服电话  , { memberCcode: this.goodsData.memberCcode }
				http.get(detail.queryOcserviceConfPageByMember).then(res => {
					// console.log(res,'000000000000')
					if (res.list.length > 0) {
						this.content = res.list[0].ocserviceConfValue || '';
					}
				})
				//商品规格处理
				this.getSpecValue(res);

				//富文本处理
				this.getGoodsRemark();

				//店铺归属
				// this.getGoodsOfStore(res);

				//商品展示
				// this.getStoreGoodsOfShow(res)

				//商品可参与的优惠券
				this.getGoodsOfDiscount(res);

				//商品可参与的营销活动
				this.getGoodsOfActivity(res);

				//商品评价
				this.getGoodsOfEvaluate(res);

				//推荐商品
				this.getRecGoods();

				//获取商品销量
				this.getGoodsVolume(res);

				let loader = wx.getStorageSync('sessionid');
				if (loader) {
					//足迹收藏弃用
					//检查用户是否收藏
					// this.checkCollect();
					//保存足迹
					// this.saveFooter(res);
				}
				//京东商品查看有无商品
				if (res.goodsType == 40) {
					this.getStock(); //获取库存
				} else if (res.goodsType != 40 && res.goodsSupplynum > 0) {
					this.isHave = true;
				}
			});

			let box1 = uni
				.createSelectorQuery()
				.in(this)
				.select('#box1');
			box1.fields({
					size: true,
					scrollOffset: true,
					properties: ['value'],
					context: true,
					dataset: true
				},
				data => {
					this.box1Height = data.height;
				}
			).exec();
			let box2 = uni
				.createSelectorQuery()
				.in(this)
				.select('#box2');
			box2.fields({
					size: true,
					scrollOffset: true,
					properties: ['value'],
					context: true,
					dataset: true
				},
				data => {
					this.box2Height = data.height;
				}
			).exec();
			let box3 = uni
				.createSelectorQuery()
				.in(this)
				.select('#box3');
			box3.fields({
					size: true,
					scrollOffset: true,
					properties: ['value'],
					context: true,
					dataset: true
				},
				data => {
					this.box3Height = data.height;
				}
			).exec();
			let box4 = uni
				.createSelectorQuery()
				.in(this)
				.select('#box4');
			box4.fields({
					size: true,
					scrollOffset: true,
					properties: ['value'],
					context: true,
					dataset: true
				},
				data => {
					this.box4Height = data.height;
				}
			).exec();
		},

		//详情页分享
		onShareAppMessage: function() {
			http.post(shareResourceGoods,{goodsCode: this.goodsData.goodsCode}).then(res => {
				console.log(res)
			})
			return {
				title: '千匠星云'
			};
		},

		methods: {
			openkefu() {
				uni.makePhoneCall({
					phoneNumber: this.content,
					success: function() {
						console.log('成功')
					},
					fail: function() {
						console.log('失败')
					}
				})
			},
			kefu() {
				this.kefuShow = true
			},
			//点击图片放大
			preview(item) {
				uni.previewImage({
					// current: item, // 当前显示图片的http链接
					urls: item.evaluateGoodsImgsList // 需要预览的图片http链接列表
				});
			},
			GetNavBarHeight(h) {
				console.log(h, '+------------------------------++++');
				// this.topHeight = h * 2 + 'rpx';
				this.topHeight = h * 2;
				console.log(this.topHeight, '-99999999999999999----');
			},
			//为你推荐商品
			getRecGoods() {
				http.get(index.floors, {
					tginfoMenuCode: 'recommendation'
				}).then(res => {
					res.list.map((item, index) => {
						if (item.htmltagCode == 'goodsrec') {
							this.recomList = [...this.recomList, ...item.cmsContlistReDomainList];
						}
					});
				});
			},

			//商品详情富文本处理
			getGoodsRemark() {
				let _this = this;
				console.log(this.goodsData.goodsRemark.length, 666);

				this.goodsRemark = this.goodsData.goodsRemark;
				if (this.goodsData.goodsType == 40) {
					let matchData = this.goodsRemark.match(/url\((.+?)\)/g); //通过正则匹配出带有url的变量并存储
					let imgsList = ''; //定义变量接收img标签数组
					if (matchData) {
						for (let i in matchData) {
							// 去掉‘url(’,转换后的格式是--->  xxx.jpg)
							let oneSubstr = matchData[i].substr(4);
							// 去掉最后的)括号 转换后的格式是---> xxx.jpg
							let twoSubstr = oneSubstr.substr(0, oneSubstr.length - 1);
							// 然后把图片url拼接到img标签上 转换后的格式是--->   <img style="width:100%;" src="xxx.jpg">
							imgsList += `<img style="width:100%;" src="${twoSubstr}">`;
						}
						this.goodsRemark = imgsList;
					} else {
						this.goodsRemark =
							this.goodsRemark &&
							this.goodsRemark.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
								return '<img style="width:100%"  src="' + capture + '"/>';
							});
						this.goodsRemark =
							this.goodsRemark &&
							this.goodsRemark.replace(/width="750"/, function(match, capture) {
								return '<width="375"';
							});
					}
				} else {
					this.goodsRemark =
						this.goodsRemark &&
						this.goodsRemark.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
							if (capture.indexOf('http') > -1) {
								return '<img style="width:100%"  src="' + capture + '"/>';
							} else {
								return '<img style="width:100%"  src="' + (_this.$domain + capture) + '"/>';
							}
						});
				}
			},
			unique(arr, val) {
				const res = new Map();
				return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1));
			},
			//商品规格处理
			getSpecValue(res) {
				var arr = res.rsSpecValueDomainList;
				var list = JSON.parse(JSON.stringify(arr));
				this.specValueList = this.unique(arr, 'specName');
				this.specValueList.map(item => {
					item['list'] = [];
					list.forEach((sku, index) => {
						if (item.specName == sku.specName) {
							sku.isshow = false;
							item.list.push(sku);
						}
					});
				});
				this.specValueList.map(item => {
					let AA = item.list.every(k => k.isshow == false);
					if (AA) item.list[0].isshow = true;
				});
				// this.skulist = list.filter(item=>  this.specValueList[0].specName == item.specName)
				console.log(this.specValueList, this.skulist, 666);

				// var arr1 = Array.from(
				// 	new Set(
				// 		arr.map(item => {
				// 			return item.specName;
				// 		})
				// 	)
				// );
				// arr1.forEach(item1 => {
				// 	var haha = arr.filter(item2 => {
				// 		return item1 == item2.specName;
				// 	});
				// 	this.specValueList.push(haha);
				// 	console.log(this.specValueList, '23232323232');
				// });
			},

			//商品销量
			getGoodsVolume(res) {
				http.get(myOrder.getStockBypromotionCode, {
					promotionCode: res.ginfoCode
				}).then(res => {
					console.log(res, 'xiaooxxioxoioxio');
					this.goodsVol = res.dataObj;
				});
			},

			//店铺归属
			/* getGoodsOfStore(res) {
				http.get(detail.goodsOfStore, {
					memberCode: res.memberCode
				}).then(res => {
					// console.log(res);
					this.shopName = res.list[0];
				});
			}, */

			//店铺商品展示
			getStoreGoodsOfShow(res) {
				http.post(detail.storeShow, {
					memberCode: res.memberCode
				}).then(res => {
					// console.log(res);
					this.storeShow = res.list.slice(0, 3);
				});
			},

			//商品可参与的优惠券
			getGoodsOfDiscount(res) {
				const discountParams = {
					skuCode: this.skuCode,
					skuNo: res.rsSkuDomainList[this.specIndex].skuNo,
					classtreeCode: res.classtreeCode,
					brandCode: res.brandCode,
					pntreeCode: res.pntreeCode,
					memberCode: res.memberCode
				};
				http.get(detail.goodsOfDiscount, discountParams).then(res => {
					// console.log(res);
					this.discountList = res;
				});
			},

			//商品可参与的营销活动
			getGoodsOfActivity(res) {
				const activityParams = {
					skuCode: this.skuCode,
					skuNo: res.skuNo,
					classtreeCode: res.classtreeCode,
					brandCode: res.brandCode,
					pntreeCode: res.pntreeCode,
					memberCode: res.memberCode
				};
				http.get(detail.goodsOfActivity, activityParams).then(res => {
					// console.log(res);
					this.activityList = res;
				});
			},

			//商品评价
			getGoodsOfEvaluate(res) {
				http.get(detail.evaluateDetail, {
					goodsName: res.goodsName
				}).then(res => {
					console.log(res);
					res.list.map(v => {
						v.memberBname = v.memberBname.substring(0, 1) + '***' + v.memberBname.substring(v.memberBname.length - 1);
					});
					// this.userEvaluate = res.list.slice(0,3);
					let arr = [];
					res.list.map(k => {
						if (k.evaluateGoodsShow) {
							arr.push(k);
						}
					});
					this.userEvaluate = arr.slice(0, 3);
				});
			},

			//检查用户是否收藏
			checkCollect() {
				http.get(detail.checkCollection, {
					collectType: 0,
					collectOpcode: this.skuCode
				}).then(res => {
					this.collection = res;
				});
			},

			//保存足迹
			saveFooter(res) {
				http.get(detail.saveFootprints, {
					footprintType: 0,
					footprintOpcode: this.skuCode,
					footprintOppic: res.dataPic,
					footprintOpcont: res.goodsName,
					footprintOpnum: res.pricesetNprice,
					footprintOpurl: 'pages/detail/main'
				}).then(res => {});
			},

			//查询京东vop商品 库存
			getStock() {
				let params = {
					skuInfos: JSON.stringify([{
						skuEocode: this.goodsData.goodsShowno,
						goodsNum: this.startNum
					}]),
					memberCode: this.goodsParams.memberCode,
					areaStr: this.addressValue,
					tenantCode: this.goodsData.tenantCode,
					channelCode: 'jdvop'
				};
				this.isHave = true; //有货

				http.post(detail.jdStock, params).then(res => {
					if (res.success && res.dataObj != null) {
						let num = JSON.parse(res.dataObj)[0];

						this.goodsStockNum = num.goodsStockNum;
						if (num.goodsStockNum > 0 || num.fee == 33) {
							this.isHave = true; //有货
						} else {
							this.isHave = false;
						}
					} else {
						this.isHave = false;
						// uni.showToast({
						// 	title: '暂无库存！',
						// 	icon: 'none'
						// });
					}
				});
			},
			//更换地址
			radioGroupChange(e) {
				this.getStock();
				console.log(this.addressValue, 'this.addressvalue');
			},
			//跳转到地址编辑页
			jumpToAddress() {
				this.$routers.push('/pages/address/list/index')
			},
			//监听滚动的距离
			scrollChange(e) {
				// console.log(e)
				if (e.detail.scrollTop != 0) {
					this.navShow = true;
				} else {
					this.navShow = false;
				}

				if (e.detail.scrollTop < this.box1Height) {
					console.log('商品高亮');
					this.viewBox = '';
					this.goodsShow = true;
					this.evaluateShow = false;
					this.detailsShow = false;
					this.recommendShow = false;
				}

				if (e.detail.scrollTop > this.box1Height && e.detail.scrollTop < this.box1Height + this.box2Height) {
					console.log('评价高亮');
					this.viewBox = '';
					this.goodsShow = false;
					this.evaluateShow = true;
					this.detailsShow = false;
					this.recommendShow = false;
				}

				if (e.detail.scrollTop > this.box1Height + this.box2Height && e.detail.scrollTop < this.box1Height + this.box2Height +
					this.box3Height) {
					console.log('详情高亮');
					this.viewBox = '';
					this.goodsShow = false;
					this.evaluateShow = false;
					this.detailsShow = true;
					this.recommendShow = false;
				}

				if (
					e.detail.scrollTop > this.box1Height + this.box2Height + this.box3Height &&
					e.detail.scrollTop < this.box1Height + this.box2Height + this.box3Height + this.box4Height
				) {
					console.log('为你推荐高亮');
					this.viewBox = '';
					this.goodsShow = false;
					this.evaluateShow = false;
					this.detailsShow = false;
					this.recommendShow = true;
				}
			},

			//点击调到商品
			jumpGoods() {
				this.goodsShow = false;
				this.evaluateShow = false;
				this.detailsShow = false;
				this.recommendShow = false;
				this.viewBox = 'box1';
			},

			//点击跳到评价
			jumpEvaluate() {
				this.goodsShow = false;
				this.evaluateShow = false;
				this.detailsShow = false;
				this.recommendShow = false;
				this.viewBox = 'box2';
			},

			//点击跳到详情
			jumpDetails() {
				this.goodsShow = false;
				this.evaluateShow = false;
				this.detailsShow = false;
				this.recommendShow = false;
				this.viewBox = 'box3';
			},

			//点击调到为你推荐
			jumpRecommend() {
				this.goodsShow = false;
				this.evaluateShow = false;
				this.detailsShow = false;
				this.recommendShow = false;
				this.viewBox = 'box4';
			},

			//点击数量减少
			reduce() {
				console.log('减');

				if (this.startNum < this.goodsData.goodsMinnum || this.startNum == this.goodsData.goodsMinnum) {
					this.$message.alert('不能小于起订量')
					return;
				} else {
					this.startNum = this.startNum - 1;
				}
			},

			//点击数量增加
			plus() {
				
				if (this.startNum >= this.goodsParams.goodsNum || this.startNum == this.goodsParams.goodsSupplynum || this.startNum >= this.goodsStockNum) {
					this.$message.alert('库存不足')
					return;
				}
				let num = this.startNum + 1
				if((this.goodsData.goodsType=='26'||this.goodsData.goodsType=='24')&&(this.promotionFrequency>0)){
					if(num>this.promotionFrequency){
						this.$message.alert('每人限购'+this.promotionFrequency+"件")
						return;
					}else{
						this.startNum =num;
					}
					
				}else{
					this.startNum =num;
				}
				
			},

			//活动弹框
			discountShow1() {
				this.discountShow = true;
			},

			//优惠弹窗
			welfareShow1() {
				this.welfareShow = true;
			},

			//规格弹窗
			normsShow1() {
				this.normsShow = true;
			},

			//地址弹框
			addressShow1() {
				this.addressShow = true;
			},

			//点击加入购物车
			async addCart() {
				var pages = getCurrentPages();
				var beforePage = pages[pages.length - 2];
				if (beforePage.route == 'pages/index/main') {
					var res = await http.get(search, {
						skuNo: this.goodsData.rsSkuDomainList[this.specIndex].skuNo
					});
					let skuId = '';
					if (res && res.list.length > 0) {
						skuId = res.list[0].skuId;
					} else {
						let list = await http.get(querySkuPage, {
							skuNo: this.goodsData.rsSkuDomainList[this.specIndex].skuNo
						});
						skuId = list.list[0].skuId;
					}
					await http
						.post(detail.addCart, {
							skuId: skuId,
							goodsNum: this.startNum
						})
						.then(res => {
							console.log(res);
							this.normsShow = false;

							setTimeout(() => {
								if (res.success == true) {
									this.$refs.shopCarToast.show({
										title: res.msg,
										type: 'default'
									});
								}
							}, 500);
						});
				} else {
					http.post(detail.addCart, {
						skuId: this.goodsData.rsSkuDomainList[this.specIndex].skuId,
						goodsNum: this.startNum
					}).then(res => {
						console.log(res);
						this.normsShow = false;

						setTimeout(() => {
							if (res.success == true) {
								this.$refs.shopCarToast.show({
									title: res.msg,
									type: 'default'
								});
							}
						}, 500);
					});
				}

				// var res = await http.get(search, { skuNo: '100009196910' })

				//加购的数据收集
				let time = Date.parse(new Date());
				let operationTime = this.handleTime(time);
				let timeId = new Date().getTime();
				let loaderId = wx.getStorageSync('userId');

				let params = {
					createTime: operationTime,
					event: 'goodsCart',
					goodsTypeId: this.goodsData.classtreeCode,
					id: timeId,
					op: 1,
					skuId: this.goodsData.rsSkuDomainList[this.specIndex].skuNo,
					spuId: this.goodsData.goodsNo,
					tenantId: this.goodsData.tenantCode,
					userId: loaderId
				};
				http.get(buryspot.collectData, {
					token: JSON.stringify(params)
				}).then(res => {
					console.log(res);
				});
			},

			//商品详情页直接购买
			shopping() {
				// if (this.goodsData.goodsType == 'jd' || this.goodsData.rsSkuDomainList[this.specIndex].dataOpbillstate == 0) {
				// 	this.$message.alert('该商品已下架')
				// 	return
				// }
				let query = {
					skuId: this.goodsData.rsSkuDomainList[this.specIndex].skuId,
					goodsNum: this.startNum,
					pageState: 0,
					goodsType: this.goodsData.goodsType
				}
				if(this.goodsData.goodsType == '24' || this.goodsData.goodsType == '26') {
					this.promotionCode ? query.promotionCode=this.promotionCode : ''
				}
				// {skuId: this.goodsData.rsSkuDomainList[this.specIndex].skuId, goodsNum: this.startNum, pageState: 0, promotionCode: this.promotionCode}
				this.$routers.push('/pages/settleAccounts/settleAccounts', query)  
			},

			//点击领取优惠券
			getWelfare(index, bol) {
				if (!bol) {
					return;
				}
				http.post(detail.getCoupons, {
					couponAmount: 1,
					promotionCode: this.discountList[index].promotionCode
				}).then(res => {
					console.log(res);
					this.$refs.welfareToast.show({
						title: res.msg,
						type: 'success'
					});
				});
			},

			//点击添加收藏
			addCollection() {
				http.post(detail.goodsCollection, {
					collectType: 0,
					collectOpcode: this.skuCode,
					collectOppic: this.goodsData.dataPic,
					collectOpcont: this.goodsData.goodsName,
					collectOpmark: '',
					collectOpnum: this.goodsData.pricesetNprice,
					collectOpnum1: this.goodsData.pricesetMakeprice,
					goodsOrigin: this.goodsData.goodsOrigin,
					collectOpurl: ''
				}).then(res => {
					console.log(res);
					this.collection = res;
				});
				//点击收藏的数据收集
				let time = Date.parse(new Date());
				let operationTime = this.handleTime(time);
				let timeId = new Date().getTime();
				let loaderId = wx.getStorageSync('userId');

				let params = {
					createTime: operationTime,
					event: 'goodsFavorite',
					goodsTypeId: this.goodsData.classtreeCode,
					id: timeId,
					op: 1,
					skuId: this.goodsData.rsSkuDomainList[this.specIndex].skuNo,
					spuId: this.goodsData.goodsNo,
					tenantId: this.goodsData.tenantCode,
					userId: loaderId
				};
				http.get(buryspot.collectData, {
					token: JSON.stringify(params)
				}).then(res => {
					console.log(res);
				});
			},

			//点击取消商品收藏
			cancelCollection() {
				http.post(detail.cancelCollection, {
					collectType: 0,
					collectOpcode: this.skuCode
				}).then(res => {
					console.log(res);
					this.collection = res;
				});
				//取消收藏的数据收集
				let time = Date.parse(new Date());
				let operationTime = this.handleTime(time);
				let timeId = new Date().getTime();
				let loaderId = wx.getStorageSync('userId');
				// console.log(collectionTime,timeId)

				let params = {
					createTime: operationTime,
					event: 'goodsFavorite',
					goodsTypeId: this.goodsData.classtreeCode,
					id: timeId,
					op: 0,
					skuId: this.goodsData.rsSkuDomainList[this.specIndex].skuNo,
					spuId: this.goodsData.goodsNo,
					tenantId: this.goodsData.tenantCode,
					userId: loaderId
				};
				http.get(buryspot.collectData, {
					token: JSON.stringify(params)
				}).then(res => {
					console.log(res);
				});
			},

			//点击去店铺
			goShop() {
				this.$routers.push('myStore/index', {memberCode: this.goodsData.memberCode})
			},

			//点击去购物车
			goCar() {
				this.$routers.switchTab('car')
			},

			//选择商品规格 高亮
			optSpec(sku, index, item) {
				item.list.forEach(k => {
					k.isshow = false;
				});
				sku.isshow = true;
				item.list.splice(index, 1, sku);
				this.$forceUpdate();
				this.changeSku();
			},
			//商品规格改变
			changeSku() {
				let skuList = [];
				this.specValueList.forEach(item => {
					item.list.forEach(sku => {
						if (sku.isshow == true) {
							skuList.push(sku.specValueValue);
						}
					});
				});
				// console.log(skuList,6666)
				// console.log(this.permute(skuList),6666)

				const arr = this.permute(skuList);
				const obj = [];
				arr.forEach(k => {
					k = k.join('/');
					obj.push(k);
				});
				let isTrue = false;
				for (var i = 0; i < this.goodsData.rsSkuDomainList.length; i++) {
					for (var j = 0; j < obj.length; j++) {
						if (this.goodsData.rsSkuDomainList[i].skuName == obj[j]) {
							this.specIndex = i;
							isTrue = true;
							console.log(i, 333333333);
							return;
						}
					}
				}
				if (!isTrue) {
					let params = {
						specStr: JSON.stringify(skuList),
						goodsCode: this.goodsData.goodsCode
					};
					http.get(getSkuBySpecNew, params).then(res => {
						if (res) {
							for (var i = 0; i < this.goodsData.rsSkuDomainList.length; i++) {
								if (this.goodsData.rsSkuDomainList[i].skuName == res.skuName) {
									this.specIndex = i;

									console.log(i, 333333333);
									return;
								}
							}
						}
					});
				}
			},
			//数组全排列
			permute(arr) {
				var rst = [],
					cur = [];

				function fn(arr) {
					var ch;
					for (var i = 0; i < arr.length; i++) {
						ch = arr.splice(i, 1)[0];
						cur.push(ch);
						if (arr.length == 0) {
							rst.push(cur.slice());
						}
						fn(arr);
						arr.splice(i, 0, ch);
						cur.pop();
					}
					return rst;
				}
				return fn(arr);
			},

			//改变轮播图
			changeSwiper(e) {
				this.swiperIndex = e.detail.current;
			},

			//点击店铺展示商品
			goToDetail(item) {
				this.$routers.push('detail', {skuNo: item.skuCode})
			},
			toFix(num1, num2, num3) {
				if (num1 == undefined || num1 == null) {
					return num1;
				} else {
					if (num3 == 1) {
						return this.toSub(num1.toFixed(num2), 1);
					} else if (num3 == 2) {
						return this.toSub(num1.toFixed(num2), 2);
					} else {
						return num1.toFixed(num2);
					}
				}
			},
			toSub(str, num) {
				let res = (str + '').split('.');
				if (num == 1) {
					return res[0];
				}
				if (num == 2) {
					return '.' + res[1];
				}
			},

			//获取地址列表
			getAddressList() {
				let loader = wx.getStorageSync('sessionid');
				// debugger
				if (loader) {
					http.get(addressList).then(res => {
						if (res.length > 0) {
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
						} else {
							this.addressList = [{
								name: '北京朝阳区八里庄街道'
							}];
							this.addressValue = '北京朝阳区八里庄街道';
						}
					});
				} else {
					this.addressList = [{
						name: '北京朝阳区八里庄街道'
					}];
					this.addressValue = '北京朝阳区八里庄街道';
				}
			},

			//跳转到评价页面
			goEvalueList() {
				this.$routers.push('evaluate_modules/goodsEvaluates', {goodsCode: this.goodsData.goodsCode})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.p_list {
		display: flex;
		align-items: center;

		view {
			width: 66rpx;
			height: 30rpx;
			font-size: 18rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 20rpx;
			margin-right: 26rpx;
		}

		.active_item {
			line-height: 38rpx;
			color: #fff;
			background: #ffa043;
			box-shadow: 1px 1px 10px 0px rgba(51, 51, 51, 0.15);
		}

		.tab_item {
			line-height: 36rpx;
			background: #ffffff;
			border: 1px solid #ffa043;
			color: #ffa043;
		}
	}

	.no_goods {
		width: 702rpx;
		height: 80rpx;
		background: #f8a732;
		border-radius: 40rpx;
		text-align: center;
		line-height: 80rpx;
		color: #fff;
		font-size: 24rpx;
		font-weight: bold;
		margin: 0 auto;
	}

	* {
		margin: 0;
		padding: 0;
	}

	v-deep .u-radio {
		// height: 108rpx;
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

	.detail {
		padding-top: 0rpx;
		padding-bottom: 166rpx;

		//锚点导航
		&--nav {
			width: 100%;
			height: 76rpx;
			background-color: #fff;
			position: fixed;
			z-index: 1;
			display: flex;

			&--item {
				flex: 1;
				height: 76rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-around;

				view:last-child {
					width: 24rpx;
					height: 5rpx;
				}

				&--name {
					font-size: 28rpx;
					color: #000;
				}

				&--active {
					width: 24rpx;
					height: 5rpx;
					border-radius: 2.5rpx;
					background-color: $theme;
				}
			}
		}

		//商品详情
		&--warp {
			width: 100%;
			height: 100vh;
			// overflow: scroll;

			//商品展示
			&--goods {
				width: 100%;
				background: #eee;
				padding-bottom: 24rpx;

				&--swiper {
					width: 100%;
					height: 750rpx;
					position: relative;

					.indicator {
						width: 100rpx;
						height: 40rpx;
						position: absolute;
						top: 670rpx;
						left: 620rpx;
						border-radius: 20rpx;
						background-color: #bbb;
						opacity: 0.7;
						color: #fff;
						font-size: 28rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						z-index: 1;
					}

					swiper {
						height: 750rpx;

						image {
							width: 100%;
							height: 750rpx;
						}

						video {
							width: 100%;
							height: 750rpx;
						}
					}
				}

				&--explain {
					width: 100%;
					background-color: #fff;
					border-radius: 0 0 24rpx 24rpx;
					margin-bottom: 23rpx;

					.goodsSeckill {
						width: 100%;
						height: 100rpx;
						background-color: #FFF0EF;
						display: flex;
						align-items: center;

						.simg {
							width: 110rpx;
							height: 100rpx;
							background-color: rgba(0, 0, 0, .3);
						}

						.sprice {
							width: 380rpx;
							height: 64rpx;
							border-right: 2rpx dashed #EB2B27;
							padding: 0 24rpx;
							display: flex;
							align-items: center;
							justify-content: space-between;

							.left {
								.ntop {
									font-size: 36rpx;
									font-family: PingFangSC-Semibold, PingFang SC;
									font-weight: 600;
									color: #EB2B27;
								}

								.obottom {
									font-size: 20rpx;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #EB2B27;
									text-decoration: line-through;
								}
							}

							.right {
								font-size: 24rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #EB2B27;
							}


						}

						.stime {
							flex: 1;
							text-align: center;

							.ttop {
								font-size: 22rpx;
								font-family: PingFangSC-Regular, PingFang SC;
								font-weight: 400;
								color: #EB2B27;
							}

						}
					}

					&--top {
						width: 100%;
						height: 124rpx;
						display: flex;
						align-items: flex-end;
						justify-content: space-between;
						padding: 0 0 36rpx 24rpx;

						&--left {
							display: flex;
							align-items: flex-end;

							&--one {
								font-size: 48rpx;
								color: $theme;
								margin-bottom: -8rpx;
								font-weight: bold;

								span {
									font-size: 28rpx;
								}
							}

							&--three {
								font-size: 26rpx;
								color: #999;
								text-decoration: line-through;
								margin-left: 10rpx;
								font-weight: bold;
							}
						}

						&--right {
							width: 176rpx;
							height: 48rpx;
							background: #fff0ef;
							border-radius: 24rpx 0px 0px 24rpx;
							font-size: 24rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #eb2b27;
							line-height: 48rpx;
							text-align: center;
						}
					}

					&--bottom {
						width: 100%;
						padding: 0 24rpx;
						display: flex;
						align-items: center;

						.gname {
							width: 600rpx;
							font-size: 32rpx;
							color: #000;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							/* 自定义的行数 */
							overflow: hidden;
						}

						.gxing {
							padding-left: 36rpx;

							text {
								font-size: 48rpx;
							}

							.icon-xing1 {
								color: red;
							}
						}
					}

					&--bottomFu {
						font-size: 28rpx;
						color: #999;
						width: 100%;
						padding: 20rpx 24rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}

				&--param {
					width: 100%;
					background-color: #fff;
					border-radius: 26rpx;
					margin-bottom: 24rpx;

					&--discount {
						width: 100%;
						display: flex;
						padding: 40rpx 0;
						border-bottom: 2rpx solid #f1f1f1;

						&--left {
							font-size: 24rpx;
							color: #000;
							width: 127rpx;
							text-align: center;
						}

						&--center {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							&--top,
							&--bottom {
								display: flex;
								align-items: center;

								&--one {
									width: 56rpx;
									height: 28rpx;
									text-align: center;
									line-height: 28rpx;
									border-radius: 14rpx;
									background-color: #ffdbe2;
									font-size: 20rpx;
									color: $theme;
									margin-right: 15rpx;
								}

								&--two {
									font-size: 24rpx;
									color: #1e1e1e;
								}
							}

							&--top {
								margin-bottom: 32rpx;
							}
						}

						&--right {
							width: 66rpx;

							&--more {
								width: 28rpx;
								height: 8rpx;
								display: flex;
								align-items: center;
								justify-content: space-between;

								&--left,
								&--right {
									width: 4rpx;
									height: 4rpx;
									border-radius: 2rpx;
									background-color: #d8d8d8;
								}

								&--center {
									width: 8rpx;
									height: 8rpx;
									border-radius: 4rpx;
									background-color: #333333;
								}
							}
						}
					}

					&--welfare {
						width: 100%;
						display: flex;
						padding: 40rpx 0;
						border-bottom: 2rpx solid #f1f1f1;

						&--left {
							font-size: 24rpx;
							color: #000;
							width: 127rpx;
							text-align: center;
						}

						&--center {
							flex: 1;
							display: flex;
							font-size: 24rpx;
							color: #333;
							align-items: center;
						}

						&--right {
							width: 66rpx;
							display: flex;
							align-items: center;

							&--more {
								width: 28rpx;
								height: 8rpx;
								display: flex;
								align-items: center;
								justify-content: space-between;

								&--left,
								&--right {
									width: 4rpx;
									height: 4rpx;
									border-radius: 2rpx;
									background-color: #d8d8d8;
								}

								&--center {
									width: 8rpx;
									height: 8rpx;
									border-radius: 4rpx;
									background-color: #333333;
								}
							}
						}
					}

					&--norms {
						width: 100%;
						padding: 40rpx 0;
						display: flex;
						align-items: center;
						border-bottom: 2rpx solid #f1f1f1;

						&--left {
							font-size: 24rpx;
							color: #000;
							width: 127rpx;
							text-align: center;
						}

						&--center {
							flex: 1;
							font-size: 24rpx;
							color: #1e1e1e;
						}

						&--right {
							width: 66rpx;
							display: flex;
							align-items: center;

							&--more {
								width: 28rpx;
								height: 8rpx;
								display: flex;
								align-items: center;
								justify-content: space-between;

								&--left,
								&--right {
									width: 4rpx;
									height: 4rpx;
									border-radius: 2rpx;
									background-color: #d8d8d8;
								}

								&--center {
									width: 8rpx;
									height: 8rpx;
									border-radius: 4rpx;
									background-color: #333333;
								}
							}
						}
					}

					&--address {
						width: 100%;
						display: flex;
						padding: 40rpx 0;

						&--left {
							font-size: 24rpx;
							color: #000;
							width: 127rpx;
							text-align: center;
						}

						&--center {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;

							&--top {
								font-size: 24rpx;
								color: #333;
							}

							&--bottom {
								font-size: 20rpx;
								color: $theme;
							}
						}

						&--right {
							width: 66rpx;
							padding-top: 12rpx;

							&--more {
								width: 28rpx;
								height: 8rpx;
								display: flex;
								align-items: center;
								justify-content: space-between;

								&--left,
								&--right {
									width: 4rpx;
									height: 4rpx;
									border-radius: 2rpx;
									background-color: #d8d8d8;
								}

								&--center {
									width: 8rpx;
									height: 8rpx;
									border-radius: 4rpx;
									background-color: #333333;
								}
							}
						}
					}
				}

				&--shop {
					width: 100%;
					border-radius: 26rpx;
					background-color: #fff;
					padding: 40rpx;

					&--introduce {
						width: 100%;
						height: 100rpx;
						display: flex;

						&--left {
							width: 100rpx;
							height: 100rpx;

							image {
								width: 100rpx;
								height: 100rpx;
							}
						}

						&--center {
							display: flex;
							flex: 1;
							align-items: center;
							padding-left: 27rpx;

							&--one {
								font-size: 28rpx;
								color: #1e1e1e;
							}

							&--two {
								margin-left: 10rpx;
								width: 56rpx;
								height: 28rpx;
								border-radius: 14rpx;
								background-color: $theme;
								font-size: 20rpx;
								color: #fff;
								display: flex;
								align-items: center;
								justify-content: center;
							}
						}

						&--right {
							width: 16rpx;
							display: flex;
							align-items: center;
						}
					}

					&--exhibition {
						width: 100%;
						padding-top: 24rpx;
						display: flex;
						justify-content: space-between;

						&--left,
						&--center,
						&--right {
							width: 218rpx;

							&--top {
								width: 218rpx;
								height: 218rpx;
								// background-color: rgba(0,0,0,.5);

								image {
									width: 218rpx;
									height: 218rpx;
								}
							}

							&--bottom {
								width: 218rpx;
								font-size: 24rpx;
								color: #1e1e1e;
								padding: 24rpx 12rpx 0;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp: 2;
								/* 自定义的行数 */
								overflow: hidden;
							}
						}
					}
				}
			}

			//商品评价
			&--evaluate {
				width: 100%;
				background: #eee;

				&--content {
					width: 100%;
					background-color: #fff;
					border-radius: 26rpx;
					padding: 30rpx 24rpx;

					&--all {
						width: 100%;
						height: 68rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						&--left {
							font-size: 24rpx;
							color: #000;
							padding-bottom: 20rpx;
						}

						&--center {
							font-size: 18rpx;
							color: #7a7a7a;
							margin-left: 8rpx;
						}

						&--right {
							display: flex;
							align-items: flex-end;

							&--one {
								font-size: 24rpx;
								color: #000;
								margin-right: 10rpx;
							}
						}

						text {
							font-size: 20rpx;
						}
					}

					&--label {
						width: 100%;
						height: 110rpx;
						display: flex;
						align-items: center;

						&--one,
						&--two,
						&--three {
							width: 150rpx;
							height: 50rpx;
							border-radius: 25rpx;
							background-color: #ffeff2;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 24rpx;
							color: #1e1e1e;
							margin-right: 23rpx;
						}
					}

					&--detailed {
						width: 100%;
						padding-bottom: 20rpx;
						margin-bottom: 20rpx;
						border-bottom: 1rpx solid #f1f1f1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;

						&--nickname {
							width: 100%;
							height: 60rpx;
							display: flex;
							align-items: center;
							padding-bottom: 30rpx;

							&--portrait {
								width: 60rpx;
								height: 60rpx;
								border-radius: 100%;
								background-color: rgba(0, 0, 0, 0.5);
								margin-right: 15rpx;

								image {
									width: 60rpx;
									height: 60rpx;
									border-radius: 100%;
								}
							}

							&--name {
								flex: 1;
								height: 60rpx;
								display: flex;
								flex-direction: column;
								justify-content: space-between;

								&--top {
									font-size: 24rpx;
									color: #000;
								}

								image {
									display: block;
									width: 88rpx;
									height: 16rpx;
								}
							}

							&--time {
								width: 100rpx;
								font-size: 18rpx;
								color: #999;
							}
						}

						&--comment {
							width: 100%;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							/* 自定义的行数 */
							overflow: hidden;
							font-size: 26rpx;
							color: #1e1e1e;
							padding-bottom: 30rpx;
						}

						&--picture::-webkit-scrollbar {
							display: none;
						}

						&--picture {
							width: 100%;
							display: flex;
							overflow: scroll;

							&--item {
								width: 218rpx;
								flex-shrink: 0;
								margin-right: 24rpx;

								image {
									width: 218rpx;
									height: 218rpx;
								}
							}
						}
					}

					&--more {
						width: 296rpx;
						height: 56rpx;
						border-radius: 40rpx;
						border: 2rpx solid #333;
						background-color: #fff;
						font-size: 28rpx;
						color: #333;
						display: flex;
						justify-content: center;
						align-items: center;
						margin: 20rpx auto 0;
					}
				}
			}

			//商品详情
			&--details {
				width: 100%;
				background: #eee;

				&--explain {
					width: 100%;
					height: 112rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					&--left,
					&--right {
						width: 18rpx;
						height: 28rpx;
					}

					&--center {
						font-size: 32rpx;
						color: #000;
						padding: 0 4rpx;
					}

					image {
						width: 18rpx;
						height: 28rpx;
					}
				}
			}

			//为你推荐
			&--recommend {
				width: 100%;
				background: #eee;

				&--explain {
					width: 100%;
					height: 112rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					&--left,
					&--right {
						width: 18rpx;
						height: 28rpx;
					}

					&--center {
						font-size: 32rpx;
						color: #000;
						padding: 0 4rpx;
					}

					image {
						width: 18rpx;
						height: 28rpx;
					}
				}
			}
		}

		//底部导航
		&--purchase {
			width: 100%;
			height: 166rpx;
			background-color: #fff;
			position: fixed;
			bottom: 0;
			padding-top: 30rpx;
			// display: flex;
			// align-items: center;

			&--warp {
				width: 100%;
				height: 80rpx;
				display: flex;
				position: relative;

				&--shop,
				&--service,
				&--car {
					width: 98rpx;
					height: 80rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;

					text {
						font-size: 40rpx;
					}

					view {
						font-size: 18rpx;
						color: #000;
					}
				}

				&--btn1,
				&--btn2 {
					flex: 1;
					height: 80rpx;

					view {
						width: 208rpx;
						height: 80rpx;
						border-radius: 40rpx;
						color: #fff;
						font-size: 24rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}

					&--car {
						background-color: $theme;
					}

					&--shopping {
						background-color: #f8a732;
					}
				}

				&--kfBtn {
					position: absolute;
					top: 0;
					left: 10rpx;
					width: 80rpx;
					height: 80rpx;
					opacity: 0;
				}
			}
		}

		//活动弹出框
		&--discountPopup {
			&--main {
				width: 100%;
				height: 966rpx;
				background-color: #fff;
				padding: 24rpx 24rpx 0;
				overflow: scroll;

				&--title {
					font-size: 32rpx;
					color: #000;
					text-align: center;
					margin-bottom: 40rpx;
				}

				&--item {
					display: flex;
					flex-direction: column;
					margin-bottom: 40rpx;

					&--top {
						font-size: 24rpx;
						color: #333;
						margin-bottom: 16rpx;
					}

					&--bottom {
						display: flex;
						align-items: center;

						&--left {
							width: 56rpx;
							height: 24rpx;
							background-color: $theme;
							margin-right: 8rpx;
							border-radius: 24rpx;
							font-size: 16rpx;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
						}

						&--right {
							font-size: 24rpx;
							color: #333;
						}
					}
				}
			}
		}

		//优惠弹出框
		&--welfarePopup {
			&--main {
				width: 100%;
				height: 966rpx;
				background-color: #fff;
				padding: 24rpx 0 0;
				overflow: scroll;

				&--title {
					font-size: 32rpx;
					color: #000;
					text-align: center;
					margin-bottom: 20rpx;
				}

				&--error {
					image {
						margin: 100rpx 55rpx;
					}
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
							margin-top: 26rpx;
						}
					}

					&--item {
						width: 100%;
						padding: 6rpx 0;
						background: url('../../static/teaImg/youhuibg.png') no-repeat;
						background-size: 738rpx 196rpx;

						.tickets {
							width: 100%;

							.ticketItem {
								width: 100%;
								position: relative;

								&>image {
									width: 100%;
								}

								&>view {
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

										&>view {
											&:first-child {
												font-size: 28rpx;
												font-weight: 600;
												color: #333333;
											}
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
								}
							}
						}
					}
				}
			}
		}

		//规格弹出框
		&--normsPopup {
			&--main {
				width: 100%;
				height: 800rpx;
				padding: 24rpx 24rpx 0;
				background-color: #fff;
				border-bottom: 1rpx solid #f1f1f1;
				overflow: scroll;

				&--param {
					width: 100%;
					display: flex;
					margin-bottom: 40rpx;

					&--left {
						width: 200rpx;
						height: 200rpx;
						// background-color: rgba(0,0,0,.5);
						margin-right: 20rpx;

						image {
							width: 200rpx;
							height: 200rpx;
						}
					}

					&--right {
						padding-top: 52rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-around;

						&--one {
							display: flex;
							align-items: flex-end;

							&--left {
								font-size: 48rpx;
								color: $theme;
								margin-bottom: -8rpx;
								line-height: 48rpx;
								font-weight: bold;
							}

							&--center {
								font-size: 36rpx;
								color: $theme;
							}

							&--right {
								font-size: 26rpx;
								color: #999;
								text-decoration: line-through;
								margin-left: 10rpx;
								line-height: 28rpx;
							}
						}

						&--two,
						&--three,
						&--four {
							font-size: 20rpx;
							color: #999;
							margin-top: 8rpx;
							line-height: 22rpx;
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
							width: 480rpx;
						}
					}
				}

				&--model {
					width: 100%;
					margin-bottom: 40rpx;

					&--top {
						font-size: 24rpx;
						color: #000;
						margin-bottom: 24rpx;
					}

					&--bottom {
						display: flex;
						flex-wrap: wrap;

						&--item {
							margin-bottom: 16rpx;
							height: 56rpx;
							border-radius: 58rpx;
							background-color: #f7f7f7;
							margin-right: 24rpx;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 20rpx;
							color: #333;
							padding: 0 18rpx;
						}

						.active {
							background-color: rgba(255, 0, 18, 0.05);
							color: $theme;
							border: 2rpx solid #ff0012;
						}
					}
				}

				&--num {
					width: 100%;

					&--top {
						font-size: 24rpx;
						color: #000;
						margin-bottom: 24rpx;
					}

					&--bottom {
						display: flex;
						align-items: center;

						&--edit {
							display: flex;
							width: 180rpx;
							height: 56rpx;
							border-radius: 28rpx;
							background-color: #f7f7f7;
							display: flex;
							align-items: center;
							justify-content: space-around;
							// padding: 0 42rpx;
							margin-right: 16rpx;

							&--left,
							&--center,
							&--right {
								font-size: 24rpx;
								color: #000;
								font-weight: bold;
							}

							&--left {
								color: #cacaca;
								width: 60rpx;
								height: 56rpx;
								text-align: center;
								line-height: 56rpx;
							}

							&--right {
								color: #333;
								width: 60rpx;
								height: 56rpx;
								text-align: center;
								line-height: 56rpx;
							}
						}

						&--start {
							font-size: 22rpx;
							color: #999;
						}
					}
				}
			}

			&--shop {
				width: 100%;
				height: 166rpx;
				background-color: #fff;
				padding: 8rpx 24rpx 0;

				&--car,
				&--shopping {
					width: 335rpx;
					height: 80rpx;
					border-radius: 40rpx;
					font-size: 24rpx;
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: $theme;
				}

				&--shopping {
					background-color: #f8a732;
				}
			}
		}

		//地址弹出框
		&--addressPopup {
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
	}
</style>

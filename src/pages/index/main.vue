<template>
	<view class="app" v-if="Refresh">
		<!-- 顶部区域 -->
		<uni-nav-bar fixed="true" status-bar="true" :background-color="color" color="#FFF"
			@clickLeft="this.$routers.push('newIndex/setCity')">
			<!-- #ifdef LPHTEST -->
			<view class="title-l" slot="left">
				<view class="title-t">链配优选·爆款在线</view>
			</view>
			<!-- #endif -->
		</uni-nav-bar>

		<view class="Box">
			<view class="boxBg">
				<view class="one" :style="{ 'background-color': color }"></view>
				<view class="two" :style="{ 'background-color': color }"></view>
			</view>
			<!-- 搜索栏 -->
			<view class="search">
				<view class="search--input" @click="ToSearch">
					<view class="search--input--box">搜索您喜欢的商品</view>
					<view class="search--input--icon" :style="{ 'background-color': color }"><text
							class="iconfont icon-sousuo"></text></view>
				</view>
			</view>
			<!-- 标签 -->
			<view class="tag">
				<!-- #ifndef TEST -->
				<view class="tag--item">
					<view class="header-box" style="width: 32rpx; height: 32rpx; margin-right: 8rpx">
						<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/11511618371220_.pic_hd.jpg"
							mode="" style="width: 100%; height: 100%"></image>
					</view>
					<view class="" style="color: #fff; font-size: 24rpx">帮你轻松塑造幸福职场</view>
				</view>
				<view class="" v-if="false">
					<view class="tag--item">
						<view class="header-box" style="width: 32rpx; height: 32rpx; margin-right: 8rpx">
							<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/11521618371220_.pic_hd.jpg"
								mode="" style="width: 100%; height: 100%"></image>
						</view>
						<view class="" style="color: #fff; font-size: 24rpx">品质安心</view>
					</view>
					<view class="tag--item">
						<view class="header-box" style="width: 32rpx; height: 32rpx; margin-right: 8rpx">
							<image src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/11531618371221_.pic_hd.jpg"
								mode="" style="width: 100%; height: 100%"></image>
						</view>
						<view class="" style="color: #fff; font-size: 24rpx">购物放心</view>
					</view>
				</view>
				<!-- #endif -->
			</view>

			<!-- 轮播图 -->
			<view class="swiperBox" v-if="floor1List.length">
				<view class="swiper">
					<swiper interval="4000" class="swiper-content" circular="true" autoplay="true" duration="1500"
						@change="setimg">
						<block v-for="(item0, index0) in floor1List" :key="index0">
							<swiper-item class="img-item" v-if="item0.contlistTypeNow == 0">
								<image :src="item0.contlistPicurl | urlFilter" @click="swiperDetail(item0.contlistUrl)">
								</image>
							</swiper-item>
							<swiper-item class="img-item" v-else>
								<video :src="item0.contlistPicurl | urlFilter" :poster="item0.contlistUrl" controls
									style="width: 100%; height: 100%"></video>
							</swiper-item>
						</block>
					</swiper>
				</view>
			</view>
			<canvas id="canvasID" canvas-id="mycanvas" style="position: fixed; left: -500px"></canvas>
			<!-- 公告区域 -->
			<view class="noticeBox">
				<view class="notice-logo">公告信息</view>
				<view class="notice-content">
					<swiper class="notice-list" circular="true" autoplay="true" :vertical="true" interval="5000"
						duration="1000">
						<swiper-item style="height:30rpx" v-for="(item1, index1) in notice" :key="index1">
							<view class="swiper-item" @click="noticeBarjump(item1)">{{ item1.noticeTitle }}</view>
						</swiper-item>
					</swiper>
				</view>
				<text class="iconfont icon-xiangyou"></text>
			</view>

			<!-- 金刚位 -->
			<view class="gold-area" v-if="floor2List.length > 0">
				<view class="golds">
					<view class="golds-item" v-for="(item, index) in floor2List" :key="index" @click="goldsClick(item)">
						<image :src="item.contlistPicurl | urlFilter"></image>
						<view>{{ item.contlistName }}</view>
					</view>
				</view>
			</view>

			<!-- 大图 -->
			<view class="bigImg" v-if="floor3.conttitlePicurl">
				<image :src="floor3.conttitlePicurl | urlFilter" @click="handleJumpFloor(floor3)"></image>
			</view>

			<!-- 秒杀商品 -->
			<view class="secKill" v-if="floor4.dataState == 2">
				<view class="secKill--tit">
					<view class="title">
						<image :src="floor4.conttitlePicurlNow ? checkImgUrl(floor4.conttitlePicurlNow) : ''"
							mode="aspectFill" style="width: 130rpx; height: 28rpx"></image>
						<view style="
                font-size: 22rpx;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #8c8c8c;
                font-weight: 400;
                margin-left: 10rpx;
              ">
							{{ floor4.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="more">
						<view class="" @click="goSecList">更多</view>
						<view class="img">
							<image src="../../static/car/arrow.png" mode="" style="width: 100%; height: 100%"></image>
						</view>
					</view>
				</view>
				<view class="secKill--center" v-for="(item, index) in secGoodList" :key="index">
					<view v-if="!item.gmtCreate && item.inventory != 0" style="
              width: 84rpx;
              height: 40rpx;
              background: #eb2b27;
              border-radius: 2rpx;
              font-size: 24rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              text-align: center;
              line-height: 40rpx;
              margin: 24rpx 0 11rpx 15rpx;
            ">
						抢购中
					</view>

					<view v-else-if="item.gmtCreate" style="display: flex; margin: 24rpx 0 11rpx 15rpx">
						<view style="
                width: 84rpx;
                height: 40rpx;
                background: #ff9d0d;
                border-radius: 2rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #ffffff;
                text-align: center;
                line-height: 40rpx;
              ">
							距开抢
						</view>
						<view style="
                height: 40rpx;
                border: 2rpx solid #ff9d0d;
                text-align: center;
                padding: 0 10rpx;
                line-height: 34rpx;
              ">
							<u-count-down :timestamp="item.gmtCreate" color="#FF9D0D" separator-color="#FF9D0D"
								font-size="24" bg-color="#ffffff" @end="showGoods"></u-count-down>
						</view>
					</view>

					<view v-if="!item.gmtCreate && item.inventory == 0" style="
              margin: 24rpx 0 11rpx 15rpx;
              width: 84rpx;
              height: 40rpx;
              background: #b0b0b0;
              border-radius: 2rpx;
              font-size: 24rpx;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              text-align: center;
              line-height: 40rpx;
            ">
						已抢空
					</view>

					<view class="goodsDetail" v-for="(good, indexG) in item.rsSkuReDomainList" :key="indexG"
						@click="gosecGoodsDetail(good, item.gmtModified, item.promotionCode, item.promotionFrequency, item.inventory)">
						<view class="bigimg">
							<image :src="good.dataPic | urlFilter" mode="" style="width: 100%; height: 100%"></image>
						</view>

						<view class="params">
							<view class="goodsName">
								<vop-label :goodsType='good.goodsType'></vop-label>
								{{ good.goodsName }}
							</view>
							<view class="stock">
								<u-line-progress active-color="#EB2B27" inactive-color="#FCE7E8" :percent="item.diff"
									height="10" :show-percent="false"></u-line-progress>
								<view style="display: flex; min-width: 150rpx; justify-content: flex-end;">
									<view style="width: 20rpx; height: 22rpx">
										<image
											src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/11561618390393_.pic_hd.jpg"
											mode="" style="width: 100%; height: 100%"></image>
									</view>
									<view style="font-size: 22rpx; color: #595959; margin-left: 8rpx">
										剩{{ item.inventory || 0 }}件</view>
								</view>
							</view>
							<view class="price">
								<view style="display: flex">
									<view style="
                      font-size: 28rpx;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 800;
                      color: #eb2b27;
                      margin-right: 10rpx;
                    ">
										¥{{ good.pricesetNprice.toFixed(2) || 0 }}
									</view>
									<view style="
                      font-size: 22rpx;
                      font-family: PingFangSC-Regular, PingFang SC;
                      font-weight: 400;
                      color: #8c8c8c;
                      text-decoration: line-through;
                      line-height: 40rpx;
                    ">
										¥{{ good.pricesetMakeprice.toFixed(2) || 0 }}
									</view>
								</view>

								<view v-if="!item.gmtCreate && item.inventory != 0" style="
                    width: 128rpx;
                    height: 48rpx;
                    background: #eb2b27;
                    border-radius: 24rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    text-align: center;
                    line-height: 48rpx;
                  ">
									立即抢购
								</view>

								<view class="soon" v-if="item.gmtCreate">即将开抢</view>

								<view v-if="!item.gmtCreate && item.inventory == 0" style="
                    width: 128rpx;
                    height: 48rpx;
                    background: rgba(235, 43, 39, 0.35);
                    border-radius: 24rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    text-align: center;
                    line-height: 48rpx;
                  ">
									立即抢购
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="secKill--bottom">
					<view class="left" v-for="(item, index) in secGoodListB" :key="index">
						<view v-if="!item.gmtCreate && item.inventory != 0" style="
                width: 84rpx;
                height: 40rpx;
                background: #eb2b27;
                border-radius: 2rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #ffffff;
                text-align: center;
                line-height: 40rpx;
                margin: 24rpx 0 0rpx 0rpx;
              ">
							抢购中
						</view>

						<view v-else-if="item.gmtCreate" style="display: flex; margin: 24rpx 0 0rpx 0rpx">
							<view style="
                  width: 84rpx;
                  height: 40rpx;
                  background: #ff9d0d;
                  border-radius: 2rpx;
                  font-size: 24rpx;
                  font-family: PingFangSC-Medium, PingFang SC;
                  font-weight: 500;
                  color: #ffffff;
                  text-align: center;
                  line-height: 40rpx;
                ">
								距开抢
							</view>
							<view style="
                  height: 40rpx;
                  border: 2rpx solid #ff9d0d;
                  text-align: center;
                  padding: 0 10rpx;
                  line-height: 34rpx;
                ">
								<u-count-down :timestamp="item.gmtCreate" color="#FF9D0D" separator-color="#FF9D0D"
									font-size="24" bg-color="#ffffff" @end="showGoods" style=""></u-count-down>
							</view>
						</view>

						<view v-if="!item.gmtCreate && item.inventory == 0" style="
                margin: 24rpx 0 0rpx 0rpx;
                width: 84rpx;
                height: 40rpx;
                background: #b0b0b0;
                border-radius: 2rpx;
                font-size: 24rpx;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #ffffff;
                text-align: center;
                line-height: 40rpx;
              ">
							已抢空
						</view>
						<view v-for="(good, indexl) in item.rsSkuReDomainList" :key="indexl" style="margin-top: 24rpx"
							@click="gosecGoodsDetail(good, item.gmtModified, item.promotionCode, item.promotionFrequency, item.inventory)">
							<view class="bigimgs">
								<image :src="good.dataPic | urlFilter" mode="" style="width: 100%; height: 100%">
								</image>
							</view>
							<view class="goodsName">
								<vop-label :goodsType='good.goodsType'></vop-label>
								{{ good.goodsName }}
							</view>
							<view class="stock">
								<u-line-progress active-color="#EB2B27" inactive-color="#FCE7E8" :percent="item.diff"
									height="10" :show-percent="false"></u-line-progress>
								<view style="display: flex; min-width: 150rpx; justify-content: flex-end;">
									<view style="width: 20rpx; height: 22rpx">
										<image
											src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/11561618390393_.pic_hd.jpg"
											mode="" style="width: 100%; height: 100%"></image>
									</view>
									<view style="font-size: 22rpx; color: #595959; margin-left: 8rpx">
										剩{{ item.inventory || 0 }}件</view>
								</view>
							</view>
							<view class="price">
								<view style="display: flex">
									<view style="
                      font-size: 28rpx;
                      font-weight: 800;
                      color: #eb2b27;
                      margin-right: 10rpx;
                    ">
										¥{{ good.pricesetNprice.toFixed(2) || 0 }}
									</view>
									<view style="
                      font-size: 22rpx;
                      font-weight: 400;
                      color: #8c8c8c;
                      text-decoration: line-through;
                      line-height: 40rpx;
                    ">
										¥{{ good.pricesetMakeprice || 0 }}
									</view>
								</view>
								<view v-if="!item.gmtCreate && item.inventory != 0" style="
                    width: 128rpx;
                    height: 48rpx;
                    background: #eb2b27;
                    border-radius: 24rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    text-align: center;
                    line-height: 48rpx;
                  ">
									立即抢购
								</view>
								<view class="soon" v-else-if="item.gmtCreate">即将开抢</view>
								<view v-if="!item.gmtCreate && item.inventory == 0" style="
                    width: 128rpx;
                    height: 48rpx;
                    background: rgba(235, 43, 39, 0.35);
                    border-radius: 24rpx;
                    font-size: 24rpx;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    text-align: center;
                    line-height: 48rpx;
                  ">
									立即抢购
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 四大学院 -->
			<view class="classify-list">
				<view class="classify-item" @click="handleJump(floor5.cmsContlistReDomainList)"
					v-if="JSON.stringify(floor5) != '{}'">
					<view>{{ floor5.conttitleNameNow }}</view>
					<image :src="floor5.conttitlePicurlNow | urlFilter" style="border-radius: 16rpx"></image>
				</view>
				<view class="classify-item" @click="handleJump(floor6.cmsContlistReDomainList)"
					v-if="JSON.stringify(floor6) != '{}'">
					<view>{{ floor6.conttitleNameNow }}</view>
					<image :src="floor6.conttitlePicurlNow | urlFilter" style="border-radius: 16rpx"></image>
				</view>
				<view class="classify-item " @click="handleJump(floor7.cmsContlistReDomainList)"
					v-if="JSON.stringify(floor7) != '{}'">
					<view>{{ floor7.conttitleNameNow }}</view>
					<image :src="floor7.conttitlePicurlNow | urlFilter" style="border-radius: 16rpx"></image>
				</view>
				<view class="classify-item " @click="handleJump(floor8.cmsContlistReDomainList)"
					v-if="JSON.stringify(floor8) != '{}'">
					<view>{{ floor8.conttitleNameNow }}</view>
					<image :src="floor8.conttitlePicurlNow | urlFilter" style="border-radius: 16rpx"></image>
				</view>
			</view>

			<!-- 热销爆款 -->
			<view class="hot-list" v-if="floor9List.length">
				<view class="hot-top" @click="jumpToSearch(floor9.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor9.conttitlePicurlNow">
						<image :src="floor9.conttitlePicurlNow ? checkImgUrl(floor9.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor9.conttitleUrlNow">{{ floor9.conttitleUrlNow || '' }}</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor9.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor9.conttitleUrlNow">{{ floor9.conttitleUrlNow || '' }}</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="hot-content">
					<view class="hot-item right-dis" v-for="(item, index) in floor9List" :key="index"
						v-if="index < 6 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							lazy-load="true" mode="aspectFill"></image>
						<view class="good-name">
							<vop-label :goodsType='item.contlistCon'></vop-label>
							{{ item.contlistNameNow }}
						</view>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 专家推荐 -->
			<view class="hot-list" v-if="floor10List.length">
				<view class="hot-top" @click="jumpToSearch(floor10.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor10.conttitlePicurlNow">
						<image :src="floor10.conttitlePicurlNow ? checkImgUrl(floor10.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor10.conttitleUrlNow">{{ floor10.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor10.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor10.conttitleUrlNow">{{ floor10.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="hot-content">
					<view class="hot-item right-dis" v-for="(item, index) in floor10List" :key="index"
						v-if="index < 6 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							lazy-load="true" mode="aspectFill"></image>
						<view class="good-name"><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistNameNow }}</view>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 一带一路 -->
			<view class="hot-list other" v-if="floor11TopList.contlistPicurl3">
				<view class="hot-top" @click="jumpToSearch(floor11.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor11.conttitlePicurlNow">
						<image :src="floor11.conttitlePicurlNow ? checkImgUrl(floor11.conttitlePicurlNow) : ''"
							mode="aspectFill" style="width: 260rpx"></image>
						<view class="hot-title" v-if="floor11.conttitleUrlNow">{{ floor11.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor11.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor11.conttitleUrlNow">{{ floor11.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="special">
					<view class="special-top" @click="toDetail(floor11TopList.contlistPicurl3)"
						v-if="floor11TopList.dataState == 2">
						<image :src="floor11TopList.contlistPicurl | urlFilter" mode="aspectFill" lazy-load="true">
						</image>
						<view class="good-message">
							<view class="good-top">
								<view class="name"><vop-label :goodsType='item.contlistCon'></vop-label>{{ floor11TopList.contlistNameNow }}</view>
								<view class="desc">{{ floor11TopList.contlistRemark }}</view>
							</view>
							<view class="good-price">
								￥
								<text>{{ $toFix(floor11TopList.contlistPriceNow, 2, 2) || 0 }}</text>
							</view>
						</view>
					</view>
					<view class="special-list" v-if="floor11BottomList.length">
						<view class="special-item" v-for="(item, index) in floor11BottomList" :key="index"
							@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
							<view class="special-item-img">
								<image :src="item.contlistPicurl | urlFilter" mode="aspectFill"></image>
							</view>
							<view class="now-price"><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistNameNow }}</view>
							<p>¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</p>
						</view>
					</view>
				</view>
			</view>

			<!-- 茶叶 -->
			<view class="hot-list tea-content" v-if="floor12List.length">
				<view class="hot-top" @click="jumpToSearch(floor12.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor12.conttitlePicurlNow">
						<image :src="floor12.conttitlePicurlNow ? checkImgUrl(floor12.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor12.conttitleUrlNow">{{ floor12.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor12.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor12.conttitleUrlNow">{{ floor12.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor12List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 名酒品鉴 -->
			<view class="hot-list tea-content" v-if="floor13List.length">
				<view class="hot-top" @click="jumpToSearch(floor13.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor13.conttitlePicurlNow">
						<image :src="floor13.conttitlePicurlNow ? checkImgUrl(floor13.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor13.conttitleUrlNow">{{ floor13.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor13.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor13.conttitleUrlNow">{{ floor13.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor13List" :key="index"
						v-if="index < 6 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 保利优选 -->
			<view class="hot-list tea-content" v-if="floor14TopList.length">
				<view class="hot-top" @click="jumpToSearch(floor14.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor14.conttitlePicurlNow">
						<image :src="floor14.conttitlePicurlNow ? checkImgUrl(floor14.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor14.conttitleUrlNow">{{ floor14.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor14.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor14.conttitleUrlNow">{{ floor14.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor14TopList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list scroll-top"
					v-if="floor14BottomList.length">
					<view class="scroll-item" v-for="(item, index) in floor14BottomList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 中轻精选 -->
			<view class="hot-list tea-content" v-if="floor15List.length">
				<view class="hot-top" @click="jumpToSearch(floor15.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor15.conttitlePicurlNow">
						<image :src="floor15.conttitlePicurlNow ? checkImgUrl(floor15.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor15.conttitleUrlNow">{{ floor15.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor15.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor15.conttitleUrlNow">{{ floor15.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor15List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 循环 -->

			<view class="hot-list tea-content" v-if="floor16List.length">
				<view class="hot-top" @click="jumpToSearch(floor16.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor16.conttitlePicurlNow">
						<image :src="floor16.conttitlePicurlNow ? checkImgUrl(floor16.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor16.conttitleUrlNow">{{ floor16.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor16.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor16.conttitleUrlNow">{{ floor16.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor16List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ item.contlistPrice }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 名酒品鉴 -->
			<view class="hot-list tea-content" v-if="floor17List.length">
				<view class="hot-top" @click="jumpToSearch(floor17.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor17.conttitlePicurlNow">
						<image :src="floor17.conttitlePicurlNow ? checkImgUrl(floor17.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor17.conttitleUrlNow">{{ floor17.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor17.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor17.conttitleUrlNow">{{ floor17.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor17List" :key="index"
						v-if="index < 6 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 保利优选 -->
			<view class="hot-list tea-content" v-if="floor18TopList.length">
				<view class="hot-top" @click="jumpToSearch(floor18.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor18.conttitlePicurlNow">
						<image :src="floor18.conttitlePicurlNow ? checkImgUrl(floor18.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor18.conttitleUrlNow">{{ floor18.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor18.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor18.conttitleUrlNow">{{ floor18.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor18TopList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list scroll-top"
					v-if="floor18BottomList.length">
					<view class="scroll-item" v-for="(item, index) in floor18BottomList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 中轻精选 -->
			<view class="hot-list tea-content" v-if="floor19List.length">
				<view class="hot-top" @click="jumpToSearch(floor19.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor19.conttitlePicurlNow">
						<image :src="floor19.conttitlePicurlNow ? checkImgUrl(floor19.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor19.conttitleUrlNow">{{ floor19.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor19.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor19.conttitleUrlNow">{{ floor19.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor19List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 再循环 -->
			<view class="hot-list tea-content" v-if="floor20List.length">
				<view class="hot-top" @click="jumpToSearch(floor20.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor20.conttitlePicurlNow">
						<image :src="floor20.conttitlePicurlNow ? checkImgUrl(floor20.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor20.conttitleUrlNow">{{ floor20.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor20.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor20.conttitleUrlNow">{{ floor20.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor20List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ item.contlistPrice }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 名酒品鉴 -->
			<view class="hot-list tea-content" v-if="floor21List.length">
				<view class="hot-top" @click="jumpToSearch(floor21.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor21.conttitlePicurlNow">
						<image :src="floor21.conttitlePicurlNow ? checkImgUrl(floor21.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor21.conttitleUrlNow">{{ floor21.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor21.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor21.conttitleUrlNow">{{ floor21.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor21List" :key="index"
						v-if="index < 6 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 保利优选 -->
			<view class="hot-list tea-content" v-if="floor22TopList.length">
				<view class="hot-top" @click="jumpToSearch(floor22.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor22.conttitlePicurlNow">
						<image :src="floor22.conttitlePicurlNow ? checkImgUrl(floor22.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor22.conttitleUrlNow">{{ floor22.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor22.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor22.conttitleUrlNow">{{ floor22.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor22TopList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list scroll-top"
					v-if="floor22BottomList.length">
					<view class="scroll-item" v-for="(item, index) in floor22BottomList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 中轻精选 -->
			<view class="hot-list tea-content" v-if="floor23List.length">
				<view class="hot-top" @click="jumpToSearch(floor23.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor23.conttitlePicurlNow">
						<image :src="floor23.conttitlePicurlNow ? checkImgUrl(floor23.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor23.conttitleUrlNow">{{ floor23.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor23.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor23.conttitleUrlNow">{{ floor23.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor23List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 三次循环 -->
			<view class="hot-list tea-content" v-if="floor24List.length">
				<view class="hot-top" @click="jumpToSearch(floor24.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor24.conttitlePicurlNow">
						<image :src="floor24.conttitlePicurlNow ? checkImgUrl(floor24.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor24.conttitleUrlNow">{{ floor24.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor24.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor24.conttitleUrlNow">{{ floor24.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor24List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ item.contlistPrice }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 名酒品鉴 -->
			<view class="hot-list tea-content" v-if="floor25List.length">
				<view class="hot-top" @click="jumpToSearch(floor25.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor25.conttitlePicurlNow">
						<image :src="floor25.conttitlePicurlNow ? checkImgUrl(floor25.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor25.conttitleUrlNow">{{ floor25.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor25.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor25.conttitleUrlNow">{{ floor25.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor25List" :key="index"
						v-if="index < 6 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 保利优选 -->
			<view class="hot-list tea-content" v-if="floor26TopList.length">
				<view class="hot-top" @click="jumpToSearch(floor26.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor26.conttitlePicurlNow">
						<image :src="floor26.conttitlePicurlNow ? checkImgUrl(floor26.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor26.conttitleUrlNow">{{ floor26.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor26.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor26.conttitleUrlNow">{{ floor26.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor26TopList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list scroll-top"
					v-if="floor26BottomList.length">
					<view class="scroll-item" v-for="(item, index) in floor26BottomList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 中轻精选 -->
			<view class="hot-list tea-content" v-if="floor27List.length">
				<view class="hot-top" @click="jumpToSearch(floor27.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor27.conttitlePicurlNow">
						<image :src="floor27.conttitlePicurlNow ? checkImgUrl(floor27.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor27.conttitleUrlNow">{{ floor27.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor27.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor27.conttitleUrlNow">{{ floor27.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor27List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 四次循环 -->
			<view class="hot-list tea-content" v-if="floor28List.length">
				<view class="hot-top" @click="jumpToSearch(floor28.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor28.conttitlePicurlNow">
						<image :src="floor28.conttitlePicurlNow ? checkImgUrl(floor28.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor28.conttitleUrlNow">{{ floor28.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor28.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor28.conttitleUrlNow">{{ floor28.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor28List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 名酒品鉴 -->
			<view class="hot-list tea-content" v-if="floor29List.length">
				<view class="hot-top" @click="jumpToSearch(floor29.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor29.conttitlePicurlNow">
						<image :src="floor29.conttitlePicurlNow ? checkImgUrl(floor29.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor29.conttitleUrlNow">{{ floor29.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor29.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor29.conttitleUrlNow">{{ floor29.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor29List" :key="index"
						v-if="index < 6 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 保利优选 -->
			<view class="hot-list tea-content" v-if="floor30TopList.length">
				<view class="hot-top" @click="jumpToSearch(floor30.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor30.conttitlePicurlNow">
						<image :src="floor30.conttitlePicurlNow ? checkImgUrl(floor30.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor30.conttitleUrlNow">{{ floor30.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor30.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor30.conttitleUrlNow">{{ floor30.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor30TopList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list scroll-top"
					v-if="floor30BottomList.length">
					<view class="scroll-item" v-for="(item, index) in floor30BottomList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 中轻精选 -->
			<view class="hot-list tea-content" v-if="floor31List.length">
				<view class="hot-top" @click="jumpToSearch(floor31.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor31.conttitlePicurlNow">
						<image :src="floor31.conttitlePicurlNow ? checkImgUrl(floor31.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor31.conttitleUrlNow">{{ floor31.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor31.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor31.conttitleUrlNow">{{ floor31.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor31List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 最后一次循环 -->
			<view class="hot-list tea-content" v-if="floor32List.length">
				<view class="hot-top" @click="jumpToSearch(floor32.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor32.conttitlePicurlNow">
						<image :src="floor32.conttitlePicurlNow ? checkImgUrl(floor32.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor32.conttitleUrlNow">{{ floor32.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor32.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor32.conttitleUrlNow">{{ floor32.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor32List" :key="index"
						v-if="index < 4 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 名酒品鉴 -->
			<view class="hot-list tea-content" v-if="floor33List.length">
				<view class="hot-top" @click="jumpToSearch(floor33.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor33.conttitlePicurlNow">
						<image :src="floor33.conttitlePicurlNow ? checkImgUrl(floor33.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor33.conttitleUrlNow">{{ floor33.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor33.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor33.conttitleUrlNow">{{ floor33.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor33List" :key="index"
						v-if="index < 6 && item.dataState == 2" @click="toDetail(item.contlistPicurl3)">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 保利优选 -->
			<view class="hot-list tea-content" v-if="floor34TopList.length">
				<view class="hot-top" @click="jumpToSearch(floor34.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor34.conttitlePicurlNow">
						<image :src="floor34.conttitlePicurlNow ? checkImgUrl(floor34.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor34.conttitleUrlNow">{{ floor34.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor34.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor34.conttitleUrlNow">{{ floor34.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list">
					<view class="scroll-item" v-for="(item, index) in floor34TopList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view scroll-x="true" scroll-with-animation="true" class="scroll-list scroll-top"
					v-if="floor34BottomList.length">
					<view class="scroll-item" v-for="(item, index) in floor34BottomList" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 中轻精选 -->
			<view class="hot-list tea-content" v-if="floor35List.length">
				<view class="hot-top" @click="jumpToSearch(floor35.cmsContlistReDomainList)">
					<view class="top-left" v-if="floor35.conttitlePicurlNow">
						<image :src="floor35.conttitlePicurlNow ? checkImgUrl(floor35.conttitlePicurlNow) : ''"
							mode="aspectFill"></image>
						<view class="hot-title" v-if="floor35.conttitleUrlNow">{{ floor35.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-left" v-else>
						<view class="floor_name">{{ floor35.conttitleNameNow }}</view>
						<view class="hot-title" v-if="floor35.conttitleUrlNow">{{ floor35.conttitleUrlNow || '' }}
						</view>
					</view>
					<view class="top-right">
						<view>更多</view>
						<image src="../../static/car/arrow.png"></image>
					</view>
				</view>
				<view class="tea-list">
					<view class="tea-item" v-for="(item, index) in floor35List" :key="index"
						@click="toDetail(item.contlistPicurl3)" v-if="item.dataState == 2">
						<image :src="checkImgUrl( item.contlistPicurl)"
							mode="aspectFill" lazy-load="true"></image>
						<p><vop-label :goodsType='item.contlistCon'></vop-label>{{ item.contlistName }}</p>
						<view class="price-box">
							<view class="now-price">¥{{ $toFix(item.contlistPrice, 2, 2) || 0 }}</view>
							<view class="origin-price" v-if="item.contlistConNow==1">
								¥{{ $toFix(item.contlistPicurl1, 2, 2) || 0 }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 领取优惠券图标 -->
		<view class="coupon" v-show="couponList.htmltagCode == 'coupon'" @click="goCoupon">
			<image :src="checkImgUrl(couponImg)" mode=""></image>
		</view>
		<!-- 卡券登录 start -->
		<view class="coupon_login" v-show="CardList.htmltagCode == 'card'">
			<button class="coupon_login_btn" @click="handleCouponLogin" size="mini">卡号登录</button>
		</view>
		<!-- 提示框 -->
		<u-modal v-model="isloginshow" :content="content" show-cancel-button @confirm="couponloginconfirm" @cancel="couponlogincancel"></u-modal>
		
		<u-popup class="coupon_login_popup" v-model="couponLoginPopup" mode="center" height="412rpx" width="530rpx" border-radius="10" closeable>
			<view class="coupon_login_popup_form">
				<view class="coupon_login_popup_form_item">
					<u-icon class="coupon_login_popup_form_item_icon" size="20" name="https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/%E8%B4%A6%E5%8F%B7%403x.png"></u-icon>
					<u-input class="coupon_login_popup_form_item_input" v-model="couponLoginForm.cardNumber" placeholder="请输入卡号" />
				</view>
				<view class="coupon_login_popup_form_item">
					<u-icon class="coupon_login_popup_form_item_icon" size="20" name="https://qjstatic.oss-cn-shanghai.aliyuncs.com/SZRC/%E5%AF%86%E7%A0%81%403x.png"></u-icon>
					<u-input class="coupon_login_popup_form_item_input" type="password" v-model="couponLoginForm.cardPassword" password-icon  placeholder="请输入卡密"/>
				</view>
				<view class="coupon_login_popup_form_submit">
					<button class="coupon_login_popup_form_submit_btn" @click="couponLoginSubmit">登录</button>
				</view>
			</view>
		</u-popup>
		<!-- 卡券登录 end -->
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import vopLabel from '@/components/vop-label.vue'
	import http from '@/api/http.js';
	import {
		mmcq
	} from '@/utils/prototype/image-main-color.js';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		index,
		recom,
		bigdata
	} from '@/api/newApi.js';
	import { couponLogin, layout } from '@/api/interface.js'
	import url from '@/api/configCheck.js'
	import {
		checkImgUrl
	} from '@/utils/checkImg.js';
	export default {
		components: {
			uniNavBar,
			vopLabel
		},
		data() {
			return {
				couponLoginPopup: false,
				couponLoginForm:{
					cardNumber:'',
					cardPassword:''
				},
				isloginshow:false,
				content: '当前已有登录用户，是否切换为卡号登录',
				Refresh: true,
				// 秒杀商品 标签状态
				secGoods1show1: true,
				secGoods1show2: false,
				secGoods1show3: false,
				secGoods2show1: false,
				secGoods2show2: true,
				secGoods2show3: false,
				secGoods3show1: false,
				secGoods3show2: false,
				secGoods3show3: true,
				secGoodList: [],
				secGoodListB: [],
				//--------------
				checkImgUrl,
				canvasID: '',
				color: '#FD1738',
				arr: [1, 2, 3, 4],
				yj: [],
				// 轮播图
				swiper: [],
				logoImage: '',
				// 轮播图下方新闻
				notice: [],
				noticeCode: [],
				// 金刚位
				golds: [],
				goldsGoods: [],
				yjy1: '',
				yjy2: '',
				yjy3: '',
				yjy4: '',
				yjy5: '',
				sellsContentShow: true,

				goodList: [],

				// 精选上新
				salesNews: {},
				// 精选上新首推商品
				salesNewsFirst: {},
				// 特别推荐1
				salesNewsList: [],

				// 特别推荐12
				storeArea: [],
				storeSales: [],
				noticeList: [],
				bottomActive: 0,
				bottomTabs: [],
				bottomContent: [],
				timer: null,
				// 商品推荐
				status: 'loadmore',
				recomList: [],

				salesArea: {},
				timestamp: 86400,

				// 节流
				scrollTimer: null,
				scrollTop: 0,

				//总楼层数据
				floorList: [],

				//楼层数据
				floor1: {},
				floor1List: [],

				floor2: {},
				floor2List: [],

				floor3: {},
				floor3TopList: [],
				floor3BottomList: [],

				floor4: {},
				floor4List: [],

				floor5: {},
				floor5List: [],

				floor6: {},
				floor6List: [],

				floor7: {},
				floor7TopList: [],
				floor7BottomList: [],

				floor8: {},
				floor8List: [],

				floor9: {},
				floor9List: [],

				floor10: {},
				floor10List: [],

				floor11: {},
				floor11TopList: [],
				floor11BottomList: [],

				floor12: {},
				floor12List: [],

				floor13: {},
				floor13List: [],

				floor14: {},
				floor14TopList: [],
				floor14BottomList: [],

				floor15: {},
				floor15List: [],

				floor16: {},
				floor16List: [],

				floor17: {},
				floor17List: [],

				floor18: {},
				floor18TopList: [],
				floor18BottomList: [],

				floor19: {},
				floor19List: [],

				floor20: {},
				floor20List: [],

				floor21: {},
				floor21List: [],

				floor22: {},
				floor22TopList: [],
				floor22BottomList: [],

				floor23: {},
				floor23List: [],

				floor24: {},
				floor24List: [],

				floor25: {},
				floor25List: [],

				floor26: {},
				floor26TopList: [],
				floor26BottomList: [],

				floor27: {},
				floor27List: [],

				floor28: {},
				floor28List: [],

				floor29: {},
				floor29List: [],

				floor30: {},
				floor30TopList: [],
				floor30BottomList: [],

				floor31: {},
				floor31List: [],

				floor32: {},
				floor32List: [],

				floor33: {},
				floor33List: [],

				floor34: {},
				floor34TopList: [],
				floor34BottomList: [],

				floor35: {},
				floor35List: [],
				//优惠券图片
				couponImg: '',
				couponList: {},
				CardList: {},
				page: 1,
				rows: 20,
				RefreshShow: 0
			};
		},
		// #ifdef H5
		onTabItemTap: function(e) {
			this.$routers.refresh()
			$storage.remove("newUrl")
		},
		// #endif
		onShow(e) {
			if($storage.get("Refresh")||(e&&e.Refresh)){
				e?$storage.remove("Refresh"):'';
				this.qingkong();
				this.getSecGoodList();
				this.getNotice()
				this.getDataList()
				this.couponList = {};
				this.CardList = {};
				this.getCardOrCoupon();
				console.log(11)
			}else{
				this.getNotice();
				this.getCardOrCoupon();
				this.getDataList()
				console.log(22)
			}
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		onLoad(e) {
			if (JSON.stringify(e) != '{}' && JSON.stringify(e) != 'null' && JSON.stringify(e) != 'undefined') {
				if (e.memberDiscode || e.scene) {
					if (e.memberDiscode) {
						$storage.set('memberDiscode', e.memberDiscode);
					} else {
						$storage.set('memberDiscode', e.scene);
					}
				}
			} else {
				let params = getCurrentPages()[0].options;
				if (params.memberDiscode || params.scene) {
					if (params.memberDiscode) {
						$storage.set('memberDiscode', params.memberDiscode);
					} else {
						$storage.set('memberDiscode', params.scene);
					}
				}
			}
			this.getSecGoodList();
		},
		methods: {
			async getCardOrCoupon() {
				await http.get(index.floors, {
					menuOpcode: 'recommendation'
				}).then(res => {
					if (res) {
						res.list.map(item => {
							if (item.dataState == 2 && item.htmltagCode == 'coupon') {
								this.couponList = item;
							}
							if (item.dataState == 2 && item.htmltagCode == 'card') {
								this.CardList = item
							}
						});
						this.couponImg = this.couponList.conttitlePicurl;
					}
				});
			},
			//卡券登录弹窗
			handleCouponLogin(){
				let islogin = uni.getStorageSync('sessionid');
				if(islogin){
					this.isloginshow = true
				}else{
					this.couponLoginForm.cardNumber = ''
					this.couponLoginForm.cardPassword = ''
					this.couponLoginPopup = true
				}
			},
			couponloginconfirm(){
				http.post(layout).then(res => {
					if(res.success){
						uni.clearStorageSync();
						// #ifndef H5
						let page = getCurrentPages().pop();
						page.onShow({Refresh: true});
						// #endif
					}
				})
				this.couponLoginForm.cardNumber = ''
				this.couponLoginForm.cardPassword = ''
				this.couponLoginPopup = true
			},
			couponLoginSubmit(){
				if(!this.couponLoginForm.cardNumber){
					this.$message.alert('卡号不能为空')
					return;
				}
				if(!this.couponLoginForm.cardPassword){
					this.$message.alert('卡密不能为空')
					return;
				}
				http.post(couponLogin, this.couponLoginForm).then(res =>{
					if(res.success){
						if(res.dataObj.register == "false"){
							/* this.couponLoginForm.cardNumber='';
							this.couponLoginForm.cardPassword=''; */
							this.couponLoginPopup = false;
							let loginInfor = JSON.parse(res.dataObj.userInfo);
							$storage.set('loginInfor', loginInfor);
							$storage.set('userId', loginInfor.userId);
							$storage.set('sessionid', loginInfor.ticketTokenid);
							$storage.set('Refresh', true);
							let miniToken = $storage.get('miniToken');
							let cookie = loginInfor.ticketTokenid;
							let miniCookie = miniToken + '=' + cookie + '; Domain=' + this.$domain.substring(8) + '; Path=/';
							$storage.set('miniUserName', miniCookie);
							this.$message.success('登录成功！');
							this.$nextTick(function(){
								this.$routers.push('welfare')
							})
						}
					}else{
						this.$message.alert(res.msg)
					}
				})
			},
			// 数据清空
			qingkong(){
				this.floor1={}
				this.floor1List=[]
				
				this.floor2={}
				this.floor2List=[]
				
				this.floor3={}
				this.floor3TopList=[]
				this.floor3BottomList=[]
				
				this.floor4={}
				this.floor4List=[]
				
				this.floor5={}
				this.floor5List=[]
				
				this.floor6={}
				this.floor6List=[]
				
				this.floor7={}
				this.floor7TopList=[]
				this.floor7BottomList=[]
				
				this.floor8={}
				this.floor8List=[]
				
				this.floor9={}
				this.floor9List=[]
				
				this.floor10={}
				this.floor10List=[]
				
				this.floor11={}
				this.floor11TopList=[]
				this.floor11BottomList=[]
				
				this.floor12={}
				this.floor12List=[]
				
				this.floor13={}
				this.floor13List=[]
				
				this.floor14={}
				this.floor14TopList=[]
				this.floor14BottomList=[]
				
				this.floor15={}
				this.floor15List=[]
				
				this.floor16={}
				this.floor16List=[]
				
				this.floor17={}
				this.floor17List=[]
				
				this.floor18={}
				this.floor18TopList=[]
				this.floor18BottomList=[]
				
				this.floor19={}
				this.floor19List=[]
				
				this.floor20={}
				this.floor20List=[]
				
				this.floor21={}
				this.floor21List=[]
				
				this.floor22={}
				this.floor22TopList=[]
				this.floor22BottomList=[]
				
				this.floor23={}
				this.floor23List=[]
				
				this.floor24={}
				this.floor24List=[]
				
				this.floor25={}
				this.floor25List=[]
				
				this.floor26={}
				this.floor26TopList=[]
				this.floor26BottomList=[]
				
				this.floor27={}
				this.floor27List=[]
				
				this.floor28={}
				this.floor28List=[]
				
				this.floor29={}
				this.floor29List=[]
				
				this.floor30={}
				this.floor30TopList=[]
				this.floor30BottomList=[]
				
				this.floor31={}
				this.floor31List=[]
				
				this.floor32={}
				this.floor32List=[]
				
				this.floor33={}
				this.floor33List=[]
				
				this.floor34={}
				this.floor34TopList=[]
				this.floor34BottomList=[]
				
				this.floor35={}
				this.floor35List=[]
			},
			//跳转到优惠券页面
			goCoupon() {
				$routers.push('/pages/index/coupon')
			},
			goSecList() {
				$routers.push('seckillList')
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
			showGoods() {
				this.getSecGoodList();
			},
			async gosecGoodsDetail(item, time, promotionCode, promotionFrequency, inventory) {
				console.log('点击秒杀了',item, time, promotionCode, promotionFrequency, inventory)
				if(!inventory)return;
				$routers.push('detail',{skuNo:item.skuCode,time,promotionCode,promotionFrequency})
				// const goods = await this.searchGoods(promotionCode);
				// if (goods && goods.length) {
				// 	$routers.push('detail',{skuNo:goods[0].rsSkuDomainList[0].skuCode,time,promotionCode,promotionFrequency})
				// }
			},
			getSecGoodList() {
				this.secGoodList = [];
				this.secGoodListB = [];
				http.post(index.queryPromotionPageForC, {
					pbCode: '0007',
					dataStateStr: '1,4'
				}).then(res => {
					if (res.list.length) {
						res.list.slice(0, 3).forEach(item => {
							let time = (item.promotionBegintime - Date.parse(new Date())) / 1000;
							let endtime = (item.promotionEndtime - Date.parse(new Date())) / 1000;
							console.log('time',time)
							console.log('endtime',endtime)
							if (time > 0) {
								item.gmtCreate = time;
							} else {
								item.gmtCreate = 0;
							}
							if (endtime > 0) {
								item.gmtModified = endtime;
							} else {
								item.gmtModified = 0;
							}
							item.rsSkuReDomainList && item.rsSkuReDomainList.forEach(item1 => {
								item1["skuCodeNew"] = item1.skuCode
								this.$set(item, 'inventory', item1.goodsSupplynum)
								const cha = ((item1.goodsAhnum - item1.goodsSupplynum)/item1.goodsAhnum) *100
								console.log('chachacha',cha)
								this.$set(item, 'diff', cha > 0 ? cha : 0)
							})
							// item.rsSkuReDomainList.forEach(async good => {
							// 	let a = await this.searchGoods(item.promotionCode);
							// 	if (a && a.length) {
							// 		a.slice(0, 1).forEach(async sku => {
							// 			let skucode = sku.rsSkuDomainList[0]
							// 				.skuCode;
							// 			good['skuCodeNew'] = skucode;
							// 			/* await http
							// 				.get(index.getSkuInfoByCode, {
							// 					skuCode: skucode
							// 				})
							// 				.then(async rex => { */
							// 					this.$set(item, 'inventory', good.goodsSupplynum);
							// 					const cha = ((good.goodsAhnum - item.inventory ) / good.goodsAhnum) * 100;
							// 					this.$set(item, 'diff', cha);
							// 				// });
							// 		});
							// 	} else {
							// 		this.$set(item, 'inventory', good.goodsSupplynum);
							// 		// const cha= ((good.goodsAhnum-item.inventory)/good.goodsAhnum)*100

							// 		this.$set(item, 'diff', 0);
							// 	}
							// });
						});
						console.log(res.list, 222222222222);
						if (res.list.length == 1) {
							this.secGoodList = res.list;
							this.secGoodListB = res.list
						} else if (res.list.length == 2) {
							this.secGoodList = res.list;
							this.secGoodListB = res.list
						} else if (res.list.length >= 3) {
							this.secGoodList = res.list.slice(0, 1);
							this.secGoodListB = res.list.slice(1, 3);
						}

						console.log(this.secGoodList, this.secGoodListB, 555555555);
					}
				});
			},
			async searchGoods(code) {
				console.log(code, 66666666);
				let data = {
					goodsType: 26,
					ginfoCode: code,
					vendibilityFlag: true,
					childFlag:true,
					bizType: 'goods',
					hjFlag: true,
					area: $storage.get('addressValue') ? $storage.get('addressValue') : '北京朝阳区八里庄街道'
				};
				let list = [];
				list = await http.post(index.seckillGood, data).then(res => {
					return res;
				});

				if (list.list.length) {
					return list.list;
				}
			},
			setimg(e) {
				let index = e.detail.current;
				this.color = this.floor1List[index].color;
			},
			toDetail(item) {
				this.$routers.push('detail', {skuNo: item})
			},
			getDataList() {
				http.get(index.floors, {
					menuOpcode: 'index1',
					page: this.page,
					rows: this.rows
				}).then(res => {
					if (res) {
						// if(this.RefreshShow == 1){
						// 	this.Refresh = false
						// }
						res.rows.map(item => {
							if (item.htmltagCode == 'floor1' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor1List = item.cmsContlistReDomainList.filter(item => item.dataState == 2 && item.conttitleType == 'jpg');
								let img = url.domain + this.floor1List[0].contlistPicurl;
								this.getColor(img, 0);
							} else if (item.htmltagCode == 'floor2' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor2List = item.cmsContlistReDomainList.filter(item => item.dataState == 2 && item.conttitleType == 'jpg');
								console.log('floor2Listfloor2List',this.floor2List.length)
							} else if (item.htmltagCode == 'floor3' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor3 = item;
							} else if (item.htmltagCode == 'floor4' && item.dataState == 2) {
								this.floor4 = item; // && item.cmsContlistReDomainList 秒杀专区
							} else if (item.htmltagCode == 'floor5' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor5 = item;
							} else if (item.htmltagCode == 'floor6' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor6 = item;
							} else if (item.htmltagCode == 'floor7' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor7 = item;
							} else if (item.htmltagCode == 'floor8' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor8 = item;
							} else if (item.htmltagCode == 'floor9' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor9 = item;
								this.floor9List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor10' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor10 = item;
								this.floor10List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
								// console.log(this.floor10List,6666666)
							} else if (item.htmltagCode == 'floor11' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor11 = item;
								this.floor11TopList = item.cmsContlistReDomainList[0];
								console.log(this.floor11TopList, '2222+++++');
								this.floor11BottomList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(1, 5) : [];
							} else if (item.htmltagCode == 'floor12' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor12 = item;
								this.floor12List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor13' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor13 = item;
								this.floor13List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor14' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor14 = item;
								this.floor14TopList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(0, 6) : [];
								this.floor14BottomList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(6, 12) : [];
							} else if (item.htmltagCode == 'floor15' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor15 = item;
								this.floor15List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor16' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor16 = item;
								this.floor16List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor17' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor17 = item;
								this.floor17List = item.cmsContlistReDomainList;
							} else if (item.htmltagCode == 'floor18' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor18 = item;
								this.floor18TopList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(0, 6) : [];
								this.floor18BottomList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(6, 12) : [];
							} else if (item.htmltagCode == 'floor19' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor19 = item;
								this.floor19List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor20' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor20 = item;
								this.floor20List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor21' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor21 = item;
								this.floor21List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor22' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor22 = item;
								this.floor22TopList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(0, 6) : [];
								this.floor22BottomList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(6, 12) : [];
							} else if (item.htmltagCode == 'floor23' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor23 = item;
								this.floor23List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor24' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor24 = item;
								this.floor24List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor25' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor25 = item;
								this.floor25List = item.cmsContlistReDomainList;
							} else if (item.htmltagCode == 'floor26' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor26 = item;
								this.floor26TopList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(0, 6) : [];
								this.floor26BottomList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(6, 12) : [];
							} else if (item.htmltagCode == 'floor27' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor27 = item;
								this.floor27List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor28' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor28 = item;
								this.floor28List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor29' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor29 = item;
								this.floor29List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor30' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor30 = item;
								this.floor30TopList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(0, 6) : [];
								this.floor30BottomList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(6, 12) : [];
							} else if (item.htmltagCode == 'floor31' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor31 = item;
								this.floor31List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor32' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor32 = item;
								this.floor32List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor33' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor33 = item;
								this.floor33List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							} else if (item.htmltagCode == 'floor34' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor34 = item;
								this.floor34TopList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(0, 6) : [];
								this.floor34BottomList = item.cmsContlistReDomainList ? item.cmsContlistReDomainList.slice(6, 12) : [];
							} else if (item.htmltagCode == 'floor35' && item.dataState == 2 && item.cmsContlistReDomainList) {
								this.floor35 = item;
								this.floor35List = item.cmsContlistReDomainList.filter(i => i.dataState == 2);
							}
						});
						// if(this.RefreshShow == 1){
						// 	this.Refresh = true
						// 	this.RefreshShow = 0
						// }
						console.log(this.floor10List,"777777777777777777777777777777")
					}
				});
			},
			getColor(img, index) {
				// console.log(img);
				const that = this;
				// 获取图片信息
				uni.getImageInfo({
					src: img,
					success: imgInfo => {
						let {
							width,
							height,
							path
						} = imgInfo;
			
						// const query = wx.createSelectorQuery().in(this)
						// let canvas = query.select('#canvas')
						// 创建canvas对象
						let ctx = uni.createCanvasContext('mycanvas');
						// console.log(path, 555)
						// 把图片放到canvas上
						ctx.drawImage(path, 0, 0, width, height);
						ctx.draw(false, () => {
							// console.log('执行了');
							// 获取 canvas 区域隐含的像素数据
							uni.canvasGetImageData({
								canvasId: 'mycanvas',
								x: 0,
								y: 0,
								width: width,
								height: height,
								success(res) {
									// console.log(res, 66666);
									var pixels = res.data;
									var pixelCount = width * height;
									var pixelArray = [];
									// 对像素数据进行预处理
									for (var i = 0, offset, r, g, b, a; i < pixelCount; i = i +
										10) {
										offset = i * 4;
										r = pixels[offset + 0];
										g = pixels[offset + 1];
										b = pixels[offset + 2];
										a = pixels[offset + 3];
										if (a >= 125) {
											if (!(r > 250 && g > 250 && b > 250)) {
												pixelArray.push([r, g, b]);
											}
										}
									}
									var cmap = mmcq(pixelArray, 5); //聚类，MMCQ是个用于图像分析的库
									var palette = cmap ? cmap.palette() : null;
									let color = '';
									if (palette && palette.length > 0) {
										color = 'rgba' + '(' + String(palette[0]) + ')';
										// that.color = color;
										that.floor1List[index].color = color;
										console.log('配色为：', color);
										if (index == 0) {
											let a = {
												detail: {
													current: 0
												}
											};
											that.setimg(a);
										}
			
										index++;
										if (that.floor1List.length > index && !that
											.floor1List[index].color && that
											.floor1List[index].contlistTypeNow == 0) {
											let img = url.domain + that.floor1List[
												index].contlistPicurl;
											that.getColor(img, index);
										}
									}
									return color;
								}
							});
						});
					},
					complete: res => {
						console.log(res,'异常')
					}
				});
			},
			swiperDetail(url) {
				console.log(url,'url====')
				if (url.length>1) {
					if(url === 'Newcomer/welfare') {
						this.handleJumpFloor(this.floor3)
						return
					}else if(url.indexOf('http')!==-1){
						$routers.push('/pages/webView/webView',{url})
					}else if(url.indexOf('/pages/')!==-1){
						$routers.push(url)
					}else{
						$routers.push('/'+url)
					}
				}
			},
			getNotice() {
				this.notice = []
				http.get(index.news, {}).then(res => {
					this.noticeList = res.list;
					res.list.filter((item, index) => {
						if (item.dataState == 1) {
							this.notice.push(item);
						}
					});
				});
			},
			handleJumpFloor(floor3) {
				if (floor3.conttitleUrl) {
					$routers.push('/' + floor3.conttitleUrl)
				} else {
					this.jumpToSearch(floor3.cmsContlistReDomainList,3);
				}
			},
			handleJump(arr) {
				const goods = arr.filter(i => {
					if (i.dataState == 2) {
						return i.conttitleType == 'goods';
					}
				});
				const doc = arr.filter(i => {
					if (i.dataState == 2) {
						return i.conttitleType == 'doc';
					}
				});
					if (doc.length > 0) {
						$routers.push('find/articleDetail', { doclistId: doc[0].contlistPicurl3Now });
					} else {
						if (goods.length > 1) {
							 $storage.set('goodsList', goods);
							 $routers.push('goodsList');
						} else if (goods.length == 1) {
							$routers.push('detail', { skuNo: goods[0].contlistPicurl3 });
						}
					}
					
			},
			noticeBarjump(item) {
				// $routers.push('noticeDedail',{id: this.noticeList[i].noticeId});
				$routers.push('noticeDedail',{id: item.noticeId});
			},
			jumpToSearch(e,i) {
				console.log('e,i',e,i)
				const goods = e.filter(item => item.dataState == 2);
				console.log('goods',goods)
				$storage.set('goodsList', goods);
				if(i===1){
					$routers.push('goodsList');
				}else if(i===2){
					$routers.push('/pages/goodsList/main1');
				}else{
					$routers.push('/pages/goodsList/main2');
				}
			},
			ToSearch() {
				$routers.push('search');
			},
			goldsClick(e) {
				if(e.contlistUrl.indexOf('http')!==-1){
					$routers.push('/pages/webView/webView',{url:e.contlistUrl})
				} else if(e.contlistUrl === 'Newcomer/welfare') {
					this.handleJumpFloor(this.floor3)
					return
				} else if(e.contlistRemarkNow == '1') {
					$routers.push('/' + e.contlistUrl);
				} else if (e.contlistId == this.floor2List[0].contlistId && e.contlistRemarkNow == '2') {
					$routers.push('/pages/nav/optimized', { title: e.contlistNameNow, code: e.contlistUrl});
				} else if (e.contlistId == this.floor2List[1].contlistId && e.contlistRemarkNow == '2') {
					$routers.push('expert/main', { title: e.contlistNameNow, code: e.contlistUrl });
				} else if (e.contlistId == this.floor2List[2].contlistId && e.contlistRemarkNow == '2') {
					this.goGoodsList(e.contlistUrl,1);
				} else if (e.contlistId == this.floor2List[3].contlistId && e.contlistRemarkNow == '2') {
					$routers.push('/pages/nav/choice', { title: e.contlistNameNow, code: e.contlistUrl });
				} else if (e.contlistId == this.floor2List[4].contlistId && e.contlistRemarkNow == '2') {
					$routers.push('/pages/nav/optimize', { title: e.contlistNameNow, code: e.contlistUrl });
				} else if (e.contlistId == this.floor2List[5].contlistId && e.contlistRemarkNow == '2') {
					$routers.push('/pages/nav/optimized1', { title: e.contlistNameNow, code: e.contlistUrl });
				} else if (e.contlistId == this.floor2List[6].contlistId && e.contlistRemarkNow == '2') {
					$routers.push('/pages/expert/main/main1', { title: e.contlistNameNow, code: e.contlistUrl });
				} else if (e.contlistId ==  this.floor2List[7].contlistId&& e.contlistRemarkNow == '2') {		
					this.goGoodsList(e.contlistUrl,2);
				} else if (e.contlistId == this.floor2List[8].contlistId && e.contlistRemarkNow == '2') {
					$routers.push('/pages/nav/choice1', { title: e.contlistNameNow, code: e.contlistUrl });
				} else if (e.contlistId == this.floor2List[9].contlistId && e.contlistRemarkNow == '2') {
					$routers.push('/pages/nav/optimize1', { title: e.contlistNameNow, code: e.contlistUrl });
				}
			},
			goGoodsList(e,i) {
				http.get(index.floors, {
					tginfoMenuCode: e
				}).then(res => {
					if (res.list.length > 0) {
						let goods = [];
						res.list.forEach(item => {
							if (item.cmsContlistReDomainList) {
								goods = [...item.cmsContlistReDomainList];
							}
						});
						this.jumpToSearch(goods,i);
					}
				});
			}
		},
		filters: {
			money(val) {
				return '¥' + val;
			}
		},
		//首页分享
		onShareAppMessage() {
			let memberDiscode = $storage.get("loginInfor").userInfoCode || "";
			return {
				title: '千匠星云',
				url: "/pages/index/main?memberDiscode=" + memberDiscode
			};
		},

		// onReachBottom() {
		// 	this.page++;
		// 	if (this.page < 3) {
		// 		this.getDataList();
		// 	} else return;
		// }
	};
</script>

<style lang="less" scoped>
	.app {
		.title-l {
			.title-t {
				font-size: 36rpx;
				padding-left: 44rpx;
			}
		}

		.Box {
			width: 100%;
			// background: url(https://qjstatic.oss-cn-shanghai.aliyuncs.com/zhongqing/11861618391042_.pic_hd.jpg) no-repeat;
			// background-size: 750rpx;
			position: relative;
		}

		.boxBg {
			width: 100%;
			height: 402rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;

			.one {
				width: 100%;
				height: 300rpx;
			}

			.two {
				width: 100%;
				height: 190rpx;
				border-radius: 50%;
				position: relative;
				top: -102rpx;
			}
		}

		.search {
			&--input {
				margin: 0 auto;
				width: 700rpx;
				height: 64rpx;
				background: rgba(255, 255, 255, 0.3);
				box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
				border-radius: 35rpx;
				text-align: center;
				position: relative;

				&--box {
					font-size: 24rpx;
					color: #fff;
					line-height: 64rpx;
				}

				&--icon {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
					width: 55rpx;
					height: 44rpx;
					// background: linear-gradient(90deg, #fd1738 0%, #fb1d40 100%);
					border-radius: 35rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					.icon-sousuo {
						color: #fff;
					}
				}
			}
		}

		.tag {
			display: flex;
			padding: 14rpx 0;

			&--item {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.swiperBox {
			// margin: 0 auto;
			width: 750rpx;
			height: 300rpx;
			// background: #FCD1C9;
			// box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
			border-radius: 20rpx;

			.swiper {
				width: 750rpx;
				height: 300rpx;

				.swiper-content {
					height: 300rpx;
					width: 100%;

					.img-item {
						padding: 0 25rpx;
						box-sizing: border-box;
					}
				}

				image {
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
				}
			}
			/* #ifdef H5 */
			.notice-content,.icon-xiangyou {
				display: none;
			}
			/* #endif */
		}

		.noticeBox {
			margin: 20rpx auto;
			width: 700rpx;
			height: 70rpx;
			padding: 0rpx 25rpx;
			box-sizing: border-box;
			z-index: 100;
			background: #fff8f3;
			border-radius: 25rpx;
			box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.08);
			display: flex;
			align-items: center;

			.notice-logo {
				width: 120rpx;
				height: 44rpx;
				background: linear-gradient(141deg, #fe8d42 0%, #ff5111 100%);
				border-radius: 4rpx 4rpx 25rpx 2rpx;
				border: 1rpx solid rgba(255, 255, 255, 0.75);
				font-size: 24rpx;
				color: #fff;
				text-align: center;
				line-height: 44rpx;
			}

			.notice-content {
				flex: 1;
				overflow: hidden;
				height: 35rpx;

				.notice-list {
					margin-left: 40rpx;
					height: 50rpx;
					display: flex;
					align-items: center;
					width: 500rpx;
				}
			}

			.icon-xiangyou {
				width: 36rpx;
			}
		}

		.gold-area {
			box-sizing: border-box;
			width: 100%;
			padding: 20rpx 0rpx;

			.golds {
				background: white;
				border-radius: 8rpx;
				display: flex;
				flex-wrap:wrap;
				.golds-item {
					margin: 20rpx 0;
					width: 150rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					flex-wrap: wrap;
					box-sizing: border-box;
					image {
						width: 96rpx;
						height: 96rpx;
						border-radius: 50%;
					}

					view {
						width: 160rpx;
						font-size: 22rpx;
						font-family: PingFangSC-Medium, PingFang SC;
						color: #595959;
						line-height: 30rpx;
						text-align: center;
					/* 	overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap; */
					}
				}
			}
		}

		.bigImg {
			margin: 0 auto;
			width: 728rpx;
			height: 181rpx;
			margin-bottom: 20rpx;
			display: block;

			image {
				width: 100%;
				height: 181rpx;
			}
		}

		.secKill {
			margin: 0 auto;
			width: 700rpx;
			// height: 906rpx;
			background: #ffffff;
			box-shadow: 0rpx 10rpx 20rpx 0rpx rgba(0, 0, 0, 0.1);
			border-radius: 14rpx;
			border: 4rpx solid #f6f6f6;
			padding: 27rpx 20rpx 0;

			.soon {
				width: 128rpx;
				height: 48rpx;
				background: linear-gradient(90deg, #ff9d0d 0%, #eb2b27 100%);
				border-radius: 24rpx;
				font-size: 24rpx;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: #ffffff;
				text-align: center;
				line-height: 48rpx;
			}

			.secKill--tit {
				width: 100%;
				// height: 76rpx;
				border-bottom: 1rpx solid #f6f6f6;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding-bottom: 20rpx;

				.title {
					display: flex;
					align-items: center;
					// padding: 15rpx 0;
				}

				.more {
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #595959;
					display: flex;

					.img {
						margin-left: 6rpx;
						width: 11rpx;
						height: 18rpx;
					}
				}
			}

			.secKill--center {
				width: 100%;
				height: 300rpx;
				border-bottom: 4rpx solid #f6f6f6;

				.goodsDetail {
					width: 100%;
					height: 200rpx;
					display: flex;
					padding-left: 15rpx;

					.bigimg {
						width: 200rpx;
						height: 200rpx;
						// background-color: rgba(0, 0, 0, 0.3);
					}

					.params {
						padding-left: 30rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-around;

						.goodsName {
							width: 400rpx;
							font-size: 26rpx;
							font-family: PingFangSC-Semibold, PingFang SC;
							font-weight: 600;
							color: #262626;
							
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}

						.stock {
							display: flex;
							justify-content: space-between;
							align-items: center;

							v-deepu-line-progress {
								/* #ifndef H5 */
								width: 218rpx;
								/* #endif */
								display: flex;
								align-items: center;
							}
						}

						.price {
							display: flex;
							justify-content: space-between;
							align-items: center;
						}
					}
				}
			}

			.secKill--bottom {
				display: flex;

				.left {
					width: 328rpx;
					height: 510rpx;
					border-right: 4rpx solid #f6f6f6;
					padding: 0 15rpx;

					.bigimgs {
						width: 200rpx;
						height: 200rpx;
						margin: 0 auto;
						// padding: 27rpx 0 15rpx;
						// background-color: rgba(0, 0, 0, 0.3);
					}

					.goodsName {
						width: 306rpx;
						font-size: 26rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #262626;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						margin-bottom: 16rpx;
						height: 75rpx;
						margin-top: 15rpx;
					}

					.stock {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 20rpx;

						v-deepu-line-progress {
							/* #ifndef H5 */
							width: 120rpx;
							/* #endif */
							display: flex;
							align-items: center;
						}
					}

					.price {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
				}

				.left:nth-child(2) {
					border: none;
				}

				.right {
					width: 328rpx;
					height: 510rpx;
					padding-left: 15rpx;

					.bigimg {
						width: 306rpx;
						height: 236rpx;
						background-color: rgba(0, 0, 0, 0.3);
					}

					.goodsName {
						width: 306rpx;
						font-size: 26rpx;
						font-family: PingFangSC-Semibold, PingFang SC;
						font-weight: 600;
						color: #262626;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						margin-bottom: 20rpx;
					}

					.stock {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-bottom: 20rpx;

						v-deepu-line-progress {
							/* #ifndef H5 */
							width: 120rpx;
							/* #endif */
						}
					}

					.price {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}
				}
			}
		}
	}

	//分割线
	.right-dis {
		margin-right: 12rpx;
	}

	.right-dis:nth-child(3n + 3) {
		margin-right: 0;
	}

	.classify-list {
		margin: 30rpx 25rpx 0;
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;

		.classify-item {
			width: 340rpx;
			padding: 16rpx 10rpx 0.5rpx;
			box-sizing: border-box;
			box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
			border-radius: 14px;
			background: #fff;

			view {
				color: #2c322c;
				font-size: 24rpx;
				font-weight: bold;
			}

			image {
				width: 320rpx;
				height: 180rpx;
				margin-top: 15rpx;
			}
		}

		.classify-item:nth-child(3) {
			margin-top: 20px;
		}

		.classify-item:nth-child(4) {
			margin-top: 20px;
		}
	}

	.hot-list {
		margin: 30rpx 25rpx;
		box-shadow: 0px 10rpx 20rpx 0px rgba(0, 0, 0, 0.1);
		border-radius: 14rpx;
		border: 4rpx solid #f6f6f6;
		background: #fff;
		padding: 27rpx 20rpx 0rpx;

		.hot-top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid#F6F6F6;
			padding-bottom: 20rpx;

			p {
				color: #262626;
				font-weight: bold;
				font-size: 28rpx;
			}
		}

		.top-left {
			display: flex;
			align-items: center;

			image {
				width: 130rpx;
				height: 28rpx;
				margin-right: 10rpx;
			}

			view {
				color: #8c8c8c;
				font-size: 22rpx;
			}

			.floor_name {
				color: #262626;
				font-weight: bold;
				font-size: 28rpx;
				margin-right: 10rpx;
			}
		}

		.top-right {
			display: flex;
			align-items: center;

			view {
				color: #595959;
				font-size: 24rpx;
			}

			image {
				width: 12rpx;
				height: 18rpx;
				margin-left: 6rpx;
			}
		}

		.hot-content {
			display: flex;
			// justify-content: space-between;
			align-items: center;
			flex-wrap: wrap;
			margin-top: 24rpx;

			.hot-item {
				width: 210rpx;
				margin-bottom: 22rpx;

				image {
					width: 210rpx;
					height: 210rpx;
					border-radius: 14rpx;
				}

				.good-name {
					width: 200rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					margin-top: 13rpx;
					color: #262626;
					font-size: 24rpx;
				}

				.price-box {
					display: flex;
					align-items: center;

					.now-price {
						color: #eb2b27;
						font-weight: bold;
						font-size: 24rpx;
					}

					.origin-price {
						color: #8c8c8c;
						font-size: 20rpx;
						text-decoration: line-through;
						margin-left: 8rpx;
						padding-top: 3rpx;
					}
				}
			}
		}
	}

	.other {
		padding-bottom: 24rpx;
	}

	.special {
		margin-top: 30rpx;

		.special-top {
			background: #fafafa;
			border-radius: 8rpx;
			padding: 15rpx;
			display: flex;
			align-items: center;

			// justify-content: space-between;
			image {
				width: 200rpx;
				height: 200rpx;
			}

			.good-message {
				// padding: 25rpx 0;
				display: flex;
				justify-content: space-around;
				flex-direction: column;
				// margin-left: 20rpx;
				padding-left: 34rpx;
				// padding-right: 55rpx;
				width: 371rpx;

				.name {
					color: #262626;
					font-size: 26rpx;
					// width: 400rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				.desc {
					color: #595959;
					font-size: 24rpx;
					// width: 400rpx;
					word-break: keep-all;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}

				.good-price {
					color: #eb2b27;
					font-size: 22rpx;
					margin-top: 25rpx;

					text {
						font-size: 32rpx;
						margin-left: 4rpx;
					}
				}
			}
		}

		.special-list {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 20rpx;

			.special-item {
				width: 144rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				.special-item-img {
					width: 144rpx;
					height: 144rpx;
					background-color: #fafafa;

					// padding: 16rpx 21rpx 0 18rpx;
					image {
						width: 100%;
						height: 100%;
					}
				}

				.now-price {
					padding-top: 16rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}

				view {
					color: #262626;
					font-size: 24rpx;
					text-align: center;
					width: 144rpx;
					// word-break: keep-all;
					// white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}

				p {
					color: #eb2b27;
					font-size: 24rpx;
					text-align: center;
				}
			}
		}
	}

	.tea-content {
		border: none;
		box-shadow: none;
		padding: 0;
		margin-top: 44rpx;
	}

	.tea-list {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;

		.tea-item {
			width: 340rpx;
			margin-bottom: 30rpx;

			image {
				width: 340rpx;
				height: 340rpx;
				border-radius: 10rpx;
			}

			p {
				width: 340rpx;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				height: 72rpx;
				margin-top: 12rpx;
			}

			.price-box {
				margin-top: 5rpx;
				display: flex;
				align-items: center;

				.now-price {
					color: #eb2b27;
					font-weight: bold;
					font-size: 26rpx;
				}

				.origin-price {
					color: #8c8c8c;
					font-size: 22rpx;
					text-decoration: line-through;
					margin-left: 8rpx;
				}
			}
		}
	}

	.scroll-list {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		padding: 0 32rpx;
		/* display: flex;
		justify-content: space-between; */
		box-sizing: border-box;
		margin-top: 20rpx;

		.scroll-item {
			display: inline-block;
			margin-right: 20rpx;

			image {
				width: 190rpx;
				height: 190rpx;
				border-radius: 10rpx;
			}

			p {
				width: 190rpx;
				white-space:normal;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.price-box {
				margin-top: 5rpx;
				display: flex;
				align-items: center;

				.now-price {
					color: #eb2b27;
					font-weight: bold;
					font-size: 24rpx;
				}

				.origin-price {
					color: #8c8c8c;
					font-size: 22rpx;
					text-decoration: line-through;
					margin-left: 8rpx;
				}
			}
		}
	}

	.scroll-top {
		margin-top: 30rpx;
	}

	.coupon {
		width: 120rpx;
		height: 120rpx;
		position: fixed;
		right: 3vw;
		bottom: calc(8vh + var(--window-bottom));

		image {
			width: 110rpx;
			height: 110rpx;
		}
	}
	.coupon_login{
		position: fixed;
		height: 70rpx;
		right: 3vw;
		bottom: calc(2vh + var(--window-bottom));
		&_btn{
			height: 100%;
			line-height: 70rpx;
			background-color: #ff7c7c;
			border-radius: 90rpx;
			border: none;
			color: white;
		}
		&_popup{
			&_form{
				overflow: hidden;
				width: 90%;
				margin: 0 auto;
				&_item{
					margin-top: 20rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					&_icon{
						margin-right: 10rpx;
					}
					&_input{
						width: 350rpx;
						border-bottom: 1rpx solid #ECECEC;
					}
				}
				&_item:first-child{
					margin-top: 60rpx;
				}
				&_submit{
					margin-top: 60rpx;
					display: flex;
					justify-content: center;
					&_btn{
						width: 80%;
						height: 80rpx;
						border: none;
						border-radius: 90rpx;
						font-size: 32rpx;
						background-color: #ff0000;
						color: white;
					}
				}
				
			}
		}
	}
</style>

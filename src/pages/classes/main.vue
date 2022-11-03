<template>
	<view class="u-wrap">
		<navBar :isBack="false"></navBar>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in tabbar" :key="index" class="u-tab-item" :class="[current==index ? 'u-tab-item-active' : '']"
				 :data-current="index" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.goodsClassName}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in tabbar" :key="index">
				<scroll-view scroll-y :class="'right-box right-box-'+index" v-if="current==index">
					<view class="top-area-bannner" v-if="item.goodsClassLogo"><image :src="item.goodsClassLogo | urlFilter"></image></view>
					<view class="page-view">
						<view class="class-item" v-for="(item1,index1) in item.childList" :key="index1" >
							<view class="item-title">
								<text>{{item1.goodsClassName}}</text>
							</view>
							<view class="item-container">
								<view class="thumb-box" v-for="(item2, index2) in item1.childList" :key="index2" @click="jumpToGoddsList(item2)">
									<u-lazy-load class="item-menu-image" :image="item2.goodsClassLogo | urlFilter" mode="" border-radius="10"></u-lazy-load>
									<view class="item-menu-name">{{item2.goodsClassName}}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {classes} from "@/api/newApi.js"
	import navBar from "@/components/navBar"
	export default {
		components: {
			navBar: navBar
		},
		data() {
			return {
				tabbar: {},
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				styleBtn:{},  // 搜索框的高度
			}
		},
		// #ifdef H5
			onTabItemTap: function(e) {
				this.$routers.refresh()
				this.$storage.remove("newUrl")
			},
		// #endif
		watch: {
			// #ifdef H5
			current(n, o) {
				let dom = document.querySelectorAll(`.right-box-${o}`);
				let ndom = document.querySelectorAll(`.right-box-${n}`);
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				if(ndom.length!==0){
					ndom[0].remove();
				}
				
			}
			// #endif
		},
		created() {
			// #ifndef H5
			// 获取胶囊按钮的信息
			var data = wx.getMenuButtonBoundingClientRect();
			this.styleBtn.paddingTop = data.top + 4 + 'px'; //上边界
			this.styleBtn.width = data.left-25 + 'px'; // 搜索宽度
			this.styleBtn.height = data.height + 'px'; // 搜索高度
			this.styleBtn.padding = (data.top + data.height) * 2 + 212 + 'rpx';
			// #endif
		},
		methods: {
			// 点击左边的栏目切换
			async swichMenu(index) {
				if(index == this.current) return ;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if(this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({size: true},res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if(!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return ;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},
			jumpToGoddsList(e){
				this.$routers.push('goodsList',{classtreeCode:e.classtreeCode})
			}
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
			http.get(classes.queryClasstreeByJd).then(res=>{
				console.log(res)
				this.tabbar = res;
				if(this.tabbar.length!=0){
					this.tabbar.sort((a,b)=>a.goodsClassOrder-b.goodsClassOrder).forEach((t)=>{
						if(t.childList&&t.childList.length>0){
							t.childList.sort((k,v)=>k.goodsClassOrder-v.goodsClassOrder)
						}
					});
					this.tabbar.forEach((j)=>{
						if(j.childList&&j.childList.length>0){
							j.childList.map((l)=>{
								if(l.childList!=null&&l.childList.length>1){
									l.childList.sort((m,n)=>m.goodsClassOrder-n.goodsClassOrder)
								}
							})
						}
					})
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 120rpx);
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
		padding-top: 160rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
		background: #F5F5F5;
		box-sizing: border-box;
		padding-top: 13rpx;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 14rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 232rpx;
		height: 100%;
		text-align: center;
	}

	.u-tab-item {
		height: 100rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}
	
	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 32rpx;
		font-weight: 600;
		background: #fff;
		border-radius: 24rpx 0rpx 0rpx 24rpx;
		
		.u-line-1{
			font-size: 32rpx;
			
			font-family: PingFang SC;
		}
	}
	
	// .u-tab-item-active::before {
	// 	content: "";
	// 	position: absolute;
	// 	border-left: 4px solid $u-type-primary;
	// 	height: 32rpx;
	// 	left: 0;
	// 	top: 39rpx;
	// }

	.u-tab-view {
		height: 100%;
	}
	
	.right-box {
		background-color: white;
		border-radius: 0rpx 32rpx 0rpx 0rpx;
		overflow: hidden;
	}
	
	.page-view {
		// padding: 16rpx;
	}
	
	.class-item {
		// margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		// border-radius: 8rpx;
	}
	
	.item-title {
		font-size: 28rpx;
		color: #000000;
		font-weight: bold;
		margin-left: 20rpx;
	}
	
	.item-menu-name {
		text-align: center;
		width: 130rpx;
		font-weight: normal;
		font-size: 24rpx;
		color: #6E6E6E;
		margin-top: 10rpx;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	
	.item-container {
		display: flex;
		flex-wrap: wrap;
	}
	
	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}
	
	.item-menu-image {
		width: 130rpx;
		height: 130rpx;
	}
	
	.u-line-1{
		font-size: 28rpx;
	}
	
	.top-area-bannner{
		width: 100%;
		box-sizing: border-box;
		padding: 20rpx;
		height: 200rpx;
		image{
			width: 100%;
			height: 100%;
			border-radius: 14rpx;
		}
	}
</style>

<template>
	<section class="tabBar-wrap">
		<article class="tabBar-box">
			<ul class="tabBar-nav" v-if="footerMenu.length > 0">
				<li class="item" v-for="(item, index) in footerMenu" @click="selectNavItem(index, item)" :key="index">
					<p class="item-images">
						<i
							class="iconfont"
							:class="item.menuSelectClass ? item.menuSelectClass : 'icon-wodedingdan'"
							:style="{ color: selectNavIndex === index ? baseColor : '#ccc' }"
						></i>
					</p>
					<p class="item-text" :style="{ color: selectNavIndex === index ? baseColor : '#ccc' }">{{ item.menuName }}</p>
				</li>
			</ul>
		</article>
	</section>
</template>
<script>
import { $storage } from '@/utils/prototype/vue.js';
export default {
	props: ['selectNavIndex', 'baseColor', 'footerMenu'],
	data() {
		return {};
	},
	methods: {
		/**
		 * 点击导航栏
		 * @param index
		 */
		selectNavItem(index, pagePath) {
			let that = this;
			//console.log(index,'index')
			//console.log(pagePath,"pagePath.menuCode")
			this.$emit('fetch-index', index);
			switch (pagePath.menuCode) {
				case '00000042':
					this.$routers.replace('web', {
						defaultUrl: this.$businessDomain + '/paas/shop/' + this.$state.homeUrl
					});
					break;
				case '00000043':
					this.$routers.replace('web', {
						defaultUrl: this.$businessDomain + '/paas/shop/' + this.$state.classifyUrl
					});
					break;
				case 'GMP00004':
					this.$routers.replace(pagePath.menuJspath);
					break;
				case '00000184':
					this.$routers.replace(pagePath.menuJspath);
					break;
				case '00000227':
					this.$routers.replace(pagePath.menuJspath);
					break;
				case 'MP000011':
					// this.$routers.replace(pagePath.menuJspath);
					if (pagePath.menuJspath == 'o2o_mine') {
						wx.getSetting({
							success: function(res) {
								console.log(res, 'success');
								if (!res.authSetting['scope.userInfo']) {
									that.$routers.replace('authorization');
								} else {
									that.$routers.replace(pagePath.menuJspath);
								}
							},
							fail: function(res) {
								console.log(res, 'error');
							}
						});
					} else {
						that.$routers.replace(pagePath.menuJspath);
					}
					break;
				case 'MP000007':
					console.log('MP000007', pagePath.menuJspath, '---');
					this.$routers.replace('o2o/pages/classify_modules/o2o_classify'); //o2o分类页
					break;
				case 'MP000010':
					this.$routers.replace('o2o/pages/o2o_ShoppingCart');
					break;
				case 'MP000200':
					this.$routers.replace('web', {
						defaultUrl: this.$businessDomain + '/paas/shop/' + pagePath.menuAction
					});
					break;
				default:
					if (pagePath.menuJspath == 'o2o_mine') {
						wx.getSetting({
							success: function(res) {
								console.log(res, 'success');
								if (!res.authSetting['scope.userInfo']) {
									that.$routers.replace('authorization');
								} else {
									that.$routers.replace(pagePath.menuJspath);
								}
							},
							fail: function(res) {
								console.log(res, 'error');
							}
						});
					} else {
						that.$routers.replace(pagePath.menuJspath);
					}
			}
			if (index === this.selectNavIndex) {
				return false;
			}

			if (index == 0 && this.selectNavIndex == -1) {
				this.$emit('fetch-index');
			}
			//this.bindViewTap(pagePath);
		},

		/**
		 * 路由跳转
		 */
		// bindNavigateTo(url) {
		//   this.$routers.replace(
		//     url
		//   )
		// },

		/**
		 * tabBar路由跳转
		 */
		bindViewTap(url) {
			// 回到顶部
			// if (url === '../index/main') {
			//   store.commit('setGroupsID', '');
			// }
			// this.$routers.replace(
			//   url
			// )
		}
	}
};
</script>

<style lang="less" scoped>
.tabBar-box {
	position: fixed;
	bottom: 0;
	width: 100%;
	// height: 82rpx;
	padding: 10rpx 0;
	border-top: 1rpx solid #f5f5f5;
	background-color: #fff;
	z-index: 9999;
}

.tabBar-nav {
	width: 100%;
	display: flex;
	.item {
		flex: 1;
		text-align: center;
	}
	.item-text {
		color: #969696;
		font-size: 22rpx;
		padding-top: 12rpx;
		transition: 0.2s linear;
	}
	.item-text-active {
		color: #b79f77;
	}
	.item-images {
		width: 34rpx;
		height: 34rpx;
		margin: 8rpx auto 0;
		text-align: center;
		transition: 0.2s linear;
		i {
			font-size: 34rpx;
		}
		& img {
			display: inline;
			width: 100%;
			height: 100%;
		}
	}
}
</style>

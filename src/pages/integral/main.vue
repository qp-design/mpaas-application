<template>
	<div class="integral">
		<!-- <commonHeader :title="title" :leftIcon="leftIcon" :rightIcon="rightIcon" /> -->
		<div
			class="integral-save"
			@click="jumpToRules"
		>
			积分规则
		</div>
		<div class="integral-tit">
			<h2>可用积分</h2>
			<p :style="{ color: baseColor }">{{ upointsNum }}</p>
		</div>
		<div class="integral-con" v-if="items && items.length > 0">
			<ul>
				<li v-for="(item, index) in items" :key="index">
					<div>
						<h3>{{ item.pointsRuleName }}</h3>
						<p>{{ item.gmtCreate }}</p>
					</div>
					<div :style="{ color: baseColor }" v-if="item.upointsListNum > 0">{{ item.upointsListNum }}</div>
					<div v-else :style="{ color: '#69be25' }">{{ item.upointsListNum }}</div>
				</li>
			</ul>
		</div>
		<div class="integral-con" v-else style="text-align:center;padding:20rpx 0;">暂无积分!!</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers } from '@/utils/prototype/vue.js';
import { integral } from '@/api/interface.js';
import commonHeader from '@/components/communal/commonHeader';
import vueTabBar from '@/components/communal/vueTabBar';
import { formatDate } from '@/utils/prototype/date.js';
export default {
	data() {
		return {
			title: '我的积分',
			leftIcon: true,
			rightIcon: false,
			total: 0,
			page: 1,
			rows: 10,
			upointsNum: 0,
			items: []
		};
	},
	components: {
		commonHeader
	},
	mounted() {
		this.commonMounted();
	},
	onLoad(options) {
		wx.setNavigationBarTitle({
			title: this.title
		});
		// wx.setNavigationBarColor({
		// 	frontColor: '#ffffff', // 必写项
		// 	backgroundColor: '#' + this.baseColor
		// });
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	methods: {
		commonMounted() {
			http.post(integral.getUpmupointsPageByPC).then(res => {
				if (res && res.upointsNum) {
					this.upointsNum = res.upointsNum;
					http.post(integral.getMemberIntegralInfo, { page: 1, rows: 10 }).then(res => {
						if (res && res.rows.length > 0) {
							this.items = res.rows;
							this.items.map(v => {
								v.gmtCreate = formatDate(v.gmtCreate);
							});
						}
					});
				}
			});
		},
		jumpToRules(){
			this.$routers.push('integral/integralRule')
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';
.integral {
	width: 100%;
	background: @white-color;
	&-save {
		position: fixed;
		z-index: 9999;
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
		right: 30rpx;
		top: 0;
		font-size: @big-title;
	}
	&-tit {
		padding: 34rpx 33rpx 0;
		margin-top: 90rpx;
		border-bottom: 20rpx solid #fafafa;
		h2 {
			color: @color-666;
			font-size: @middle-title;
		}
		p {
			height: 162rpx;
			line-height: 162rpx;
			font-size: 73rpx;
			text-align: center;
			color: #d66377;
		}
	}
	&-con {
		ul {
			li {
				border-bottom: 1rpx solid #f5f5f5;
				padding: 0 33rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 118rpx;
				h3 {
					color: @color-666;
					font-size: @middle-title;
					margin-bottom: 19rpx;
				}
				p {
					color: @color-999;
					font-size: 20rpx;
				}
				div:nth-child(2) {
					font-size: 36rpx;
					color: #d66377;
				}
			}
		}
	}
}
</style>

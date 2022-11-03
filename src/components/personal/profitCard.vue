<template>
	<div class="trade-box">
		<div class="more-cell" @click="goWallet">
			<span class="title">可提现金额</span>
			<span class="right" v-bind:style="{ color: baseColor }">
				{{ totalCash }}元
				<i class="iconfont icon-xiangyou"></i>
			</span>
		</div>
		<div class="profit-box">
			<div class="earnings-box today-box">
				<div class="box-item">
					<p class="f-bold">{{ todayEarnings }}</p>
					<p class="c-999">今日收益</p>
				</div>
				<div class="box-item">
					<p class="f-bold">{{ getShsettlObjByToday.orderNum || 0 }}</p>
					<p class="c-999">今日订单</p>
				</div>
				<div class="box-item">
					<p class="f-bold">{{ getShsettlObjByToday.clientNum || 0 }}</p>
					<p class="c-999">今日新增客户</p>
				</div>
			</div>
			<div class="earnings-box total-box">
				<div class="box-item">
					<p class="f-bold">{{ totalEarnings }}</p>
					<p class="c-999">累计收益</p>
				</div>
				<div class="box-item">
					<p class="f-bold">{{ getShsettlObj.orderNum || 0 }}</p>
					<p class="c-999">累计订单</p>
				</div>
				<div class="box-item">
					<p class="f-bold">{{ getShsettlObj.clientNum || 0 }}</p>
					<p class="c-999">累计客户</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { getShsettlUserByUser, getUserAccount } from '@/api/interface.js';
import { formatTimes } from '@/utils/prototype/date.js';
export default {
	name: 'profit-card',
	props: ['baseColor'],
	data() {
		return {
			getShsettlObj: {},
			getShsettlObjByToday: {},
			getUserAccount: {}
		};
	},
	computed:{
		totalCash: function(){
			return new Number(this.getUserAccount.faccountAmount || 0).toFixed(2)
		},
		todayEarnings: function(){
			return new Number(this.getShsettlObjByToday.incomeAmount || 0).toFixed(2)
		},
		totalEarnings: function(){
			return new Number(this.getShsettlObj.incomeAmount || 0).toFixed(2)
		}

	},
	mounted() {
		// this.getShsettl();
		// this.getShsettl({
		// 	startDate: formatTimes(new Date()),
		// 	endDate: formatTimes(new Date())
		// });
		// this.getUserAccountInfo();
		this.request();
	},
	methods: {

		async request(){
			let userAccount = await this.getUserAccountInfo();
			if(userAccount.dataObj.faccountAmount){
				this.getUserAccount = userAccount.dataObj;
				this.getShsettl();
				this.getShsettl({
					startDate: formatTimes(new Date()),
					endDate: formatTimes(new Date())
				});
			}
		},

		getShsettl(params) {
			http.get(getShsettlUserByUser, params).then(res => {
				if (params) {
					this.getShsettlObjByToday = res.shsettlUserStatistics || {};
				} else {
					this.getShsettlObj = res.shsettlUserStatistics || {};
				}
				console.log(this.getShsettlObj, 'this.getShsettlObj');
			});
		},
		getUserAccountInfo() {
			return http.get(getUserAccount);
		},

		goWallet(){
			this.$routers.push("Wallet_modules/wallet/cash")
		}
	}
};
</script>

<style lang="less" scoped>
@import '~@/common/css/common.less';
.trade-box {
	margin: 20rpx;
	background: @white-color;
	border-radius: 10rpx;
	.more-cell {
		height: 96rpx;
		width: 100%;
		line-height: 96rpx;

		.title {
			font-size: 26rpx;
			float: left;
			padding-left: 20rpx;
		}
		.right {
			display: flex;
			align-items: center;
			float: right;
			padding-right: 20rpx;
			font-size: 26rpx;
			.iconfont {
				font-size: 16px;
				color: #333333;
			}
		}
	}
	.profit-box {
		padding: @padding-tb;
		border-top: 1rpx solid #f5f5f5;
		.earnings-box {
			display: flex;
			text-align: center;
			padding: @padding-tb;
			.box-item {
				padding: @padding-lr;
				flex: 1;
				.f-bold {
					font-size: 26rpx;
					color: #333333;
					font-weight: bold;
				}
				.c-999 {
					font-size: 26rpx;
					color: #999999;
				}
			}
		}
	}
}
</style>

<template>
	<div class="addInvoice">
		<div class="addInvoice-info">
			<ul>
				<li>
					<div>
						发票抬头
						<p>
							<view @click="classifyClick('')">
								<i class="iconfont" v-if="classify == ''" :style="{ color: baseColor }">&#xe671;</i>
								<i class="iconfont" v-else>&#xe672;</i>
								个人
							</view>
							<view @click="classifyClick('company')">
								<i class="iconfont" v-if="classify == 'company'" :style="{ color: baseColor }">&#xe671;</i>
								<i class="iconfont" v-else>&#xe672;</i>
								单位
							</view>
						</p>
					</div>
				</li>
				<li v-show="classify == ''">
					<div>
						<view class="">
							<span style="color:red;position: relative;top: 2px;">*</span>开票名称
						</view>
						<view class="">
							<input placeholder="请输入开票名称" v-model="userinvMember" />
						</view>


					</div>
				</li>
				<li v-show="classify == 'company'">
					<div>
						<view class="">
							<span style="color:red;position: relative;top: 2px;">*</span>单位名称
						</view>
						<view class="">
							<input placeholder="请输入单位名称" v-model="userinvMember" />
						</view>


					</div>
				</li>
				<li class="borderBt" v-show="classify == 'company'">
					<div>
						<view class="">
							<span style="color:red;position: relative;top: 2px;">*</span>纳税人识别号
						</view>
						<view class="">
							<input placeholder="请输入纳税人识别号" v-model="userinvNo" />
						</view>


					</div>
				</li>
				<li>
					<div>
						<view class="">
							<span style="color:red;position: relative;top: 2px;">*</span>收票人姓名
						</view>
						<view class="">
							<input placeholder="请输入收票人姓名" v-model="userinvUname" />
						</view>


					</div>
				</li>
				<li>
					<div>
						<view class="">
							<span style="color:red;position: relative;top: 2px;">*</span>收票人手机
						</view>
						<view class="">
							<input placeholder="请输入收票人手机" v-model="userinvUphone" />
						</view>

					</div>
				</li>
				<li>
					<div>
						<view class="">
							<span style="color:red;position: relative;top: 2px;">*</span>收票人邮箱
						</view>
						<view class="">
							<input placeholder="请输入收票人邮箱" v-model="userinvUeamil" />
						</view>


					</div>
				</li>
				<li>
					<!-- #ifdef MP-WEIXIN -->
					<div>
						<view class="">
							<span style="color:red;position: relative;top: 2px;">*</span>收票人地址
						</view>

						<picker mode="region" @change="changeRegin" :value="region">
							<view v-if="region.length == 0" class="placeholderStyle">请选择地址</view>
							<view class="tui-picker-detail" v-else>{{ provinceName + '-' + cityName + '-' + areaName }}</view>
						</picker>
					</div>
					<!-- #endif -->
					<!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
					<!-- #endif -->
				</li>
				<li>
					<div>
						<span></span>
						<input placeholder="请输入详细地址" v-model="userinvUadd" />
					</div>
				</li>
			</ul>
		</div>
		<div class="addInvoice-btn" :style="{ background: baseColor }" @click="saveInfo">确认</div>

		<u-picker mode="selector" v-model="pickerShow" :range="multiSelector" @confirm="confirmClick" :range-key="rangeKey"
		 :confirm-color="baseColor"></u-picker>

		<!-- #ifdef MP-ALIPAY || MP-TOUTIAO -->
		<!-- <u-picker mode="region" v-model="alipayRegionShow" :area-code="['11', '1101', '110101']" @confirm="uRegionPicker"></u-picker> -->
		<!-- #endif -->
	</div>
</template>

<script>
	import http from '@/api/http.js';
	import {
		$storage,
		$routers,
		$message
	} from '@/utils/prototype/vue.js';
	import {
		invoice
	} from '@/api/interface.js';
	import {
		area
	} from '@/api/newApi.js';
	import commonHeader from '@/components/communal/commonHeader';
	export default {
		data() {
			return {
				title: '新增发票信息',
				classify: '',
				userinvMember: '',
				userinvUname: '',
				userinvUphone: '',
				userinvUeamil: '',
				userinvUadd: '',
				userinvNo: '',
				userinvType: '1',
				userinvSort: '2',
				addInfo: '', //菜单路径
				alipayRegionShow: false,
				pickerShow: false,
				multiSelector: [],
				rangeKey: '',
				check: '',
				provinceName: '',
				provinceCode: '',
				areaName: '',
				areaCode: '',
				cityName: '',
				cityCode: '',
				roadName: '',
				roadCode: '',
				roadShow: true,
				region: [],
				regionCode: ''
			};
		},
		components: {
			commonHeader
		},
		onLoad() {},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		mounted() {
			this.$state.moreToolList.map(v => {
				if (v.menuAction == 'myInvoice') {
					v.children.map(val => {
						if (val.menuAction == 'addInfo') {
							this.addInfo = val.menuJspath;
						}
					});
				}
			});
		},
		methods: {
			changeRegin(e) {
				this.region = e.detail.value;
				this.regionCode = e.detail.code;
				this.provinceName = this.region[0];
				this.provinceCode = this.regionCode[0];
				this.cityName = this.region[1];
				this.cityCode = this.regionCode[1];
				this.areaName = this.region[2];
				this.areaCode = this.regionCode[2];
			},
			classifyClick(classify) {
				if (classify == 'company') {
					this.classify = 'company';
					this.userinvSort = '1';
				} else {
					this.classify = '';
					this.userinvSort = '2';
				}
			},
			saveInfo() {
				let userinvUeamil = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
				let userinvNo = /^[A-Za-z0-9]+$/;
				let params = {
					userinvType: this.userinvType,
					userinvSort: this.userinvSort,
					userinvMember: this.userinvMember,
					userinvUname: this.userinvUname,
					userinvUphone: this.userinvUphone,
					userinvUeamil: this.userinvUeamil,
					userinvUadd: this.userinvUadd,
					provinceCode: this.provinceCode,
					provinceName: this.provinceName,
					areaCode: this.areaCode,
					areaName: this.areaName,
					cityCode: this.cityCode,
					cityName: this.cityName,
					roadName: this.roadName,
					roadCode: this.roadCode
				};
				params.userinvNo = this.userinvNo;
				if (this.classify == 'company') {
					if (this.userinvMember == '') {
						$message.alert('请填写单位名称！');
						return
					}
					if (this.userinvNo == '') {
						$message.alert('请填写纳税人识别号！');
						return
					}
					if (!userinvNo.test(this.userinvNo)) {
						$message.alert('请输入正确纳税人识别号');
						return
					} 
					if (this.userinvUname == '') {
						$message.alert('请填写收票人姓名！');
						return
					}
					if (this.userinvUphone == '') {
						$message.alert('请填写收票人手机！');
						return
					}
					if (this.userinvUphone) {
						if (!/^1[34578]\d{9}$/.test(this.userinvUphone)) {
							$message.alert('手机号格式不正确');
						}
					}
					if (this.userinvUeamil == '') {
						$message.alert('请填写收票人邮箱！');
						return
					}
					if (!userinvUeamil.test(this.userinvUeamil)) {
						$message.alert('请输入正确邮箱号');
					}
					if (this.userinvUadd == '') {
						$message.alert('请填写收票人详细地址！');
						return
					}
					http.get(invoice.increasedinvoice, params).then(res => {
							if (res && res.success) {
								$message.alert(res.msg);
								// $routers.replace(this.addInfo)
								// $routers.back(1, {
								// 	success: '',
								// 	fail: '',
								// 	complete: '',
								// 	stay: 1500
								// });
								$routers.back(1, {
									success: '',
									fail: '',
									complete: '',

								});
							}
						});
				} else {
					if (this.userinvMember == '') {
						$message.alert('请填写开票名称！');
						return
					}
					if (this.userinvUname == '') {
						$message.alert('请填写收票人姓名！');
						return
					}
					if (this.userinvUphone == '') {
						$message.alert('请填写收票人手机！');
						return
					}
					if (!/^1[34578]\d{9}$/.test(this.userinvUphone)) {
						$message.alert('手机号格式不正确');
						return
					} 
					if (this.userinvUeamil == '') {
						$message.alert('请填写收票人邮箱！');
						return
					}
					if (!userinvUeamil.test(this.userinvUeamil)) {
						$message.alert('请输入正确邮箱号');
						return
					} 
					if (this.userinvUadd == '') {
						$message.alert('请填写收票人详细地址！');
						return
					}
					http.get(invoice.increasedinvoice, params).then(res => {
							if (res && res.success) {
								$message.alert(res.msg);
								// $routers.replace(this.addInfo)
								$routers.back(1, {
									success: '',
									fail: '',
									complete: '',

								});
							}
						});
				}
			},
			confirmClick(e) {
				var msg = this.multiSelector[e[0]];
				if (this.check == 1) {
					this.provinceName = msg.provincName;
					this.provinceCode = msg.provinceCode;
					this.cityName = '';
					this.cityCode = '';
					this.areaName = '';
					this.areaCode = '';
					this.roadName = '';
					this.roadCode = '';
				} else if (this.check == 2) {
					this.cityName = msg.areaName;
					this.cityCode = msg.areaCode;
					this.areaName = '';
					this.areaCode = '';
					this.roadName = '';
					this.roadCode = '';
				} else if (this.check == 3) {
					this.areaName = msg.areaName;
					this.areaCode = msg.areaCode;
					this.roadName = '';
					this.roadCode = '';
					http.post(area.road, {
						areaCode: this.areaCode
					}).then(res => {
						if (res.list.length == 0) {
							this.roadShow = false;
						} else {
							this.roadShow = true;
						}
					});
				} else {
					this.roadName = msg.roadName;
					this.roadCode = msg.roadCode;
				}
				console.log(this.provinceCode + '------' + this.areaCode);
				console.log(this.cityCode + '------' + this.roadCode);
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '../../../common/css/common.less';

	.addInvoice {
		width: 100%;
		height: 100%;
		background: #fafafa;

		&-info {
			background: @white-color;

			ul {
				li {
					border-bottom: 1rpx solid #f6f6f8;
					height: 104rpx;
					font-size: @big-title;
					color: #333;
					padding: @padding-30;

					div {
						height: 104rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;

						p {
							display: flex;
							align-items: center;

							view {
								display: flex;
								align-items: center;

								i {
									margin-right: 10rpx;
									color: #8d8d8d;
								}

								&:first-child {
									margin-right: 38rpx;
								}
							}
						}

						input {
							width: 450rpx;
							text-align: right;
						}

						input::-webkit-input-placeholder {
							color: #ccc;
						}

						input::-moz-placeholder {
							/* Mozilla Firefox 19+ */
							color: #ccc;
						}

						input:-moz-placeholder {
							/* Mozilla Firefox 4 to 18 */
							color: #ccc;
						}

						input:-ms-input-placeholder {
							/* Internet Explorer 10-11 */
							color: #ccc;
						}
					}
				}

				.borderBt {
					border-bottom: 20rpx solid #fafafa;
				}
			}
		}

		&-btn {
			font-size: 32rpx;
			height: 96rpx;
			width: 100%;
			color: #fff;
			line-height: 96rpx;
			text-align: center;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 100;
			background: #b79f77;
		}
	}
</style>

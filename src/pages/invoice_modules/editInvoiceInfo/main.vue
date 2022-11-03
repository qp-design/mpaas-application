<template>
	<div class="editInvoice">
		<div class="editInvoice-info">
			<ul>
				<li>
					<div>
						发票抬头
						<p>
							<span>
								<i class="iconfont" v-if="editParams.userinvSort == '2'" :style="{ color: baseColor }">&#xe671;</i>
								<i class="iconfont" v-else>&#xe672;</i>
								个人
							</span>
							<span>
								<i class="iconfont" v-if="editParams.userinvSort == '1'" :style="{ color: baseColor }">&#xe671;</i>
								<i class="iconfont" v-else>&#xe672;</i>
								单位
							</span>
						</p>
					</div>
				</li>
				<li v-show="editParams.userinvSort == '2'">
					<div>
						<view class="">
							<span
								style="color:red;position: relative;
						top: 2px;"
							>
								*
							</span>
							开票名称
						</view>
						<view class=""><input placeholder="请输入开票名称" v-model="userinvMember" /></view>
					</div>
				</li>
				<li v-show="editParams.userinvSort == '1'">
					<div>
					<view class="">
						<span
							style="color:red;position: relative;
					top: 2px;"
						>
							*
						</span>
						单位名称
					</view>
					<view class=""><input placeholder="请输入单位名称" v-model="userinvMember" /></view>
					</div>
				</li>
				<li class="borderBt" v-show="editParams.userinvSort == '1'">
					<div>
						<view class="">
							<span
								style="color:red;position: relative;
						top: 2px;"
							>
								*
							</span>
							纳税人识别号
						</view>
						<view class=""><input placeholder="请输入纳税人识别号" v-model="userinvNo" /></view>
					</div>
				</li>
				<li>
					<div>
						<view class="">
							<span
								style="color:red;position: relative;
						top: 2px;"
							>
								*
							</span>
							收票人姓名
						</view>
						<view class=""><input placeholder="请输入收票人姓名" v-model="userinvUname" /></view>
					</div>
				</li>
				<li>
					<div>
						<view class="">
							收票人手机
						</view>
						<view class=""><input placeholder="请输入收票人手机" v-model="userinvUphone" /></view>
					</div>
				</li>
				<li>
					<div>
						<view class="">
							<span
								style="color:red;position: relative;
						top: 2px;"
							>
								*
							</span>
							收票人邮箱
						</view>
						<view class=""><input placeholder="请输入收票人邮箱" v-model="userinvUeamil" /></view>
					</div>
				</li>
				<li>
					<!-- #ifdef MP-WEIXIN -->
					<div>
						<view class="">
							收票人地址
						</view>

						<picker mode="region" @change="changeRegin" :value="region">
							<view class="tui-picker-detail">{{ provinceName + '-' + cityName + '-' + areaName }}</view>
						</picker>
					</div>
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
		<div class="editInvoice-btn" :style="{ background: baseColor }" @click="saveInfo">确认</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { invoice } from '@/api/interface.js';
import { area } from '@/api/newApi.js';
export default {
	data() {
		return {
			leftIcon: true,
			rightIcon: false,
			region: [],
			code: [],
			userinvMember: '',
			userinvUname: '',
			userinvUphone: '',
			userinvUeamil: '',
			userinvUadd: '',
			userinvNo: '',
			userinvType: '1',
			userinvSort: '2',
			query: {},
			editParams: {},
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
			regionCode: ''
		};
	},
	onLoad(e) {
		console.log(e);
		this.$state.moreToolList.map(v => {
			if (v.menuAction == 'myInvoice') {
				v.children.map(val => {
					if (val.menuAction == 'addInfo') {
						this.addInfo = val.menuJspath;
					}
				});
			}
		});
		this.query = this.$root.$mp.query;
		http.get(invoice.getInfo, this.query).then(res => {
			this.editParams = res;
			// this.code = [res.provinceCode, res.cityCode, res.areaCode];
			this.region = [res.provinceName, res.cityName, res.areaName];
			this.provinceCode = res.provinceCode;
			this.provinceName = res.provinceName;
			this.cityCode = res.cityCode;
			this.cityName = res.cityName;
			this.areaCode = res.areaCode;
			this.areaName = res.areaName;
			this.roadCode = res.roadCode;
			this.roadName = res.roadName;
			this.userinvMember = res.userinvMember;
			this.userinvUname = res.userinvUname;
			this.userinvUphone = res.userinvUphone;
			this.userinvUeamil = res.userinvUeamil;
			this.userinvUadd = res.userinvUadd;
			this.userinvNo = res.userinvNo;
			this.userinvType = res.userinvType;
			this.userinvSort = res.userinvSort;
		});
		console.log(this.region, 'region');
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted() {},
	methods: {
		// #ifdef MP-ALIPAY || MP-TOUTIAO
		selectRegion() {
			this.alipayRegionShow = true;
		},
		// #endif
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
		saveInfo() {
			let userinvUeamil = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			let userinvNo = /^[A-Za-z0-9]+$/;
			let params = {
				userinvId: this.editParams.userinvId,
				userinvCode: this.editParams.userinvCode,
				userCode: this.editParams.userCode,
				userName: this.editParams.userName,
				memberCode: this.editParams.userinvCmemberCodeode,
				memberName: this.editParams.memberName,
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
				roadCode: this.roadCode,
				roadName: this.roadName,
				tenantCode: this.editParams.tenantCode,
				gmtCreate: this.editParams.gmtCreate,
				gmtModified: this.editParams.gmtModified,
				dataState: this.editParams.dataState
			};

			params.userinvNo = this.userinvNo;
			if (this.editParams.userinvSort == '1') {
				if (this.userinvMember == '') {
					$message.alert('请填写开票名称！');
					return;
				}
				if (this.userinvUname == '') {
					$message.alert('请填写收票人姓名！');
					return;
				}
				if (this.userinvUeamil == '') {
					$message.alert('请填写收票人邮箱！');
					return;
				}
				
				if (this.userinvNo == '') {
					$message.alert('请填写纳税人识别号！');
					return;
				}
				if(this.userinvUphone){
					if (!/^1[34578]\d{9}$/.test(this.userinvUphone)) {
						$message.alert('手机号格式不正确');
					} 
				}
				if (!userinvUeamil.test(this.userinvUeamil)) {
					$message.alert('请输入正确邮箱号');
				} else if (!userinvNo.test(this.userinvNo)) {
					$message.alert('请输入正确纳税人识别号');
				} else {
					http.get(invoice.editInfo, params).then(res => {
						if (res && res.success) {
							$message.alert(res.msg);
							$routers.back(1, {
								success: '',
								fail: '',
								complete: '',
								stay: 1500
							});
						}
					});
				}
			} else {
				if (this.userinvMember == '') {
					$message.alert('请填写开票名称！');
					return;
				}
				if (this.userinvUname == '') {
					$message.alert('请填写收票人姓名！');
					return;
				}
				if (this.userinvUphone == '') {
					$message.alert('请填写收票人手机！');
					return;
				}
				if (this.userinvUeamil == '') {
					$message.alert('请填写收票人邮箱！');
					return;
				}
				if (this.userinvUadd == '') {
					$message.alert('请填写收票人地址！');
					return;
				}

				if (!/^1[34578]\d{9}$/.test(this.userinvUphone)) {
					$message.alert('手机号格式不正确');
				} else if (!userinvUeamil.test(this.userinvUeamil)) {
					$message.alert('请输入正确邮箱号');
				} else {
					http.get(invoice.editInfo, params).then(res => {
						if (res && res.success) {
							$message.alert(res.msg);
							$routers.back(1, {
								success: '',
								fail: '',
								complete: '',
								stay: 1500
							});
						}
					});
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';
.editInvoice {
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
						span {
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

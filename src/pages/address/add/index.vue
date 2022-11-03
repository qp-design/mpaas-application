<template>
	<div class="address">
		<div class="address-dlBox">
			<dl>
				<!-- 2222 -->
				<dt>收货人</dt>
				<dd><input type="text" placeholder="请输入收货人姓名" v-model="addressMember" /></dd>
			</dl>
			<dl>
				<dt>手机号</dt>
				<dd><input type="text" placeholder="请输入手机号码" v-model="addressPhone" /></dd>
			</dl>
			<dl>
				<dt>选择省</dt>
				<dd><text @click="provinceClick">{{provinceName || "选择省"}}</text></dd>
			</dl>
			<dl>
				<dt>选择市</dt>
				<dd><text @click="areaClick">{{cityName || "选择市"}}</text></dd>
			</dl>
			<dl>
				<dt>选择区</dt>
				<dd><text @click="areaParentClick">{{areaName || "选择区"}}</text></dd>
			</dl>
			<dl>
				<dt>选择街道</dt>
				<dd><text @click="roadClick" v-if="roadShow">{{roadName || "选择街道"}}</text></dd>
			</dl>

			<dl>
				<dt>详细地址</dt>
				<dd><textarea type="text" name="addressDetail" id="addressDetail" placeholder="请输入详细地址" v-model="addressDetail"
					 style="line-height: 20rpx;padding-top: 28rpx;"></textarea></dd>
			</dl>
		</div>
		<div class="address-isdefault">
			<dl class="check_item">
				<dd>默认地址</dd>
				<div @click="isDefault">
					<i class="iconfont" v-if="defaultIcon" :style="{ color: baseColor }">&#xe671;</i>
					<i class="iconfont" v-else>&#xe672;</i>
				</div>
			</dl>
		</div>
		<div class="address-save" :style="{ backgroundColor: baseColor }" @click="saveAddress">保存</div>


		<u-picker mode="selector" v-model="pickerShow" :range="multiSelector" @confirm="confirmClick" :range-key="rangeKey"
		 :confirm-color="baseColor"></u-picker>
	</div>
</template>

<script>
	import {
		addAddress
	} from '@/api/interface.js';
	import {
		area
	} from "@/api/newApi.js"
	import http from '@/api/http.js';
	export default {
		data() {
			return {
				items: [],
				defaultIcon: false,
				// region: ['北京市', '北京市', '东城区'],
				// code: ['110000', '110100', '110101'],
				addressMember: '', //用户名
				addressPhone: '', //手机号
				// provinceCode: '11000', //省code
				// provinceName: '北京市', //省名称
				// cityCode: '110100', //市code
				// cityName: '北京市', //市名称
				// areaCode: '110101', //区code
				// areaName: '东城区', //区名称
				addressDefault: 0,
				addressDetail: '',
				userCode: '00000017',
				alipayRegionShow: false,
				pickerShow: false,
				multiSelector: [],
				rangeKey: "",
				check: "",
				provinceName: "",
				provinceCode: "",
				areaName: "",
				areaCode: "",
				cityName: "",
				cityCode: "",
				roadName: "",
				roadCode: "",
				roadShow: true
			};
		},
		onShow(){
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		mounted() {
			this.positionCalc()
		},
		watch:{
			// #ifdef H5
			pickerShow(n,o){
				if (!n) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			}
			// #endif
		},
		methods: {
			lifeOnLoad() {
				Object.assign(this.$data, this.$options.data()); //初始化数据
				let pages = getCurrentPages();
				let prevpage = pages[pages.length - 2];
			},
			changeRegin(e) {
				// console.log('picker发送选择改变，携带值为', e.mp.detail)
				this.region = e.mp.detail.value;
				this.code = e.mp.detail.code;
				this.provinceCode = e.mp.detail.code[0];
				this.provinceName = e.mp.detail.value[0];
				this.cityCode = e.mp.detail.code[1];
				this.cityName = e.mp.detail.value[1];
				this.areaCode = e.mp.detail.code[2];
				this.areaName = e.mp.detail.value[2];
				console.log(e.detail.code)
			},
			isDefault() {
				if (this.defaultIcon) {
					this.addressDefault = 0;
					this.defaultIcon = false;
				} else {
					this.addressDefault = 1;
					this.defaultIcon = true;
				}
			},
			saveAddress() {
				let params = {
					addressMember: this.addressMember,
					addressPhone: this.addressPhone,
					provinceCode: this.provinceCode,
					provinceName: this.provinceName,
					cityCode: this.cityCode,
					cityName: this.cityName,
					areaCode: this.areaCode,
					areaName: this.areaName,
					roadName: this.roadName,
					roadCode: this.roadCode,
					addressDefault: this.addressDefault,
					addressDetail: this.addressDetail,
					userCode: this.userCode
				};
				if (this.addressMember == '') {
					this.$message.alert('收货人不能为空');
				} else if (this.addressPhone == '') {
					this.$message.alert('手机号不能为空');
				} else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.addressPhone)) {
					this.$message.alert('手机号格式不正确');
				} else if (this.addressDetail == '') {
					this.$message.alert('详细地址不能为空');
				} else {
					http.get(addAddress, params).then(res => {
						if (res && res.success) {
							this.$routers.back()
						}
					})
				}
			},
			provinceClick(e) {
				// check == 1
				this.pickerShow = true;
				this.check = 1;
				if (this.check == 1) {
					this.rangeKey = "provincName"
					http.post(area.province).then(res => {
						this.multiSelector = res.list
						console.log(this.multiSelector)
					})
				}
			},
			areaClick(e) {
				// check == 2
				this.pickerShow = true;
				this.check = 2;
				if (this.check == 2) {
					this.rangeKey = "areaName"
					if (this.provinceCode == "1") {
						this.multiSelector = [{
							areaName: "北京市",
							provinceCode: 1
						}]
					} else if (this.provinceCode == "2") {
						this.multiSelector = [{
							areaName: "上海市",
							provinceCode: 2
						}]
					} else if (this.provinceCode == "3") {
						this.multiSelector = [{
							areaName: "天津",
							provinceCode: 3
						}]
					} else if (this.provinceCode == "4") {
						this.multiSelector = [{
							areaName: "重庆市",
							provinceCode: 4
						}]
					} else {
						http.post(area.area, {
							provinceCode: this.provinceCode
						}).then(res => {
							console.log(res)
							this.multiSelector = res.list
						})
					}
					console.log(this.provinceCode)

				}
			},
			areaParentClick(e) {
				// check == 3
				this.pickerShow = true;
				this.check = 3;
				if (this.check == 3) {
					this.rangeKey = "areaName"
					if (this.provinceCode == "1" || this.provinceCode == "2" || this.provinceCode == "3" || this.provinceCode == "4") {
						http.post(area.area, {
							provinceCode: this.provinceCode
						}).then(res => {
							console.log(res)
							this.multiSelector = res.list
						})
					} else {
						http.post(area.area, {
							areaParentCode: this.cityCode
						}).then(res => {
							this.multiSelector = res.list
						})
					}

				}
			},
			roadClick(e) {
				// check == 4
				this.check = 4;
				if (this.check == 4) {
					
					if(this.provinceCode == "1" || this.provinceCode == "2" || this.provinceCode == "3" || this.provinceCode == "4"){
						this.rangeKey = "areaName"
						http.post(area.area, {
							areaParentCode: this.areaCode
						}).then(res => {
							this.multiSelector = res.list
							if (!this.multiSelector.length) {
								this.$message.alert('没有更多了')
							} else {
								this.pickerShow = true;
							}
						})
					}else{
						this.rangeKey = "roadName"
						http.post(area.road, {
							areaCode: this.areaCode
						}).then(res => {
							this.multiSelector = res.list
							if (!this.multiSelector.length) {
								this.$message.alert('没有更多了')
							} else {
								this.pickerShow = true;
							}
						})
					}
					

				}
			},
			confirmClick(e) {
				var msg = this.multiSelector[e[0]];
				if (this.check == 1) {
					this.provinceName = msg.provincName;
					this.provinceCode = msg.provinceCode;
					this.cityName = "";
					this.cityCode = "";
					this.areaName = "";
					this.areaCode = "";
					this.roadName = "";
					this.roadCode = "";
				} else if (this.check == 2) {
					this.cityName = msg.areaName;
					this.cityCode = msg.areaCode;
					this.areaName = "";
					this.areaCode = "";
					this.roadName = "";
					this.roadCode = "";
				} else if (this.check == 3) {
					
					this.areaName = msg.areaName;
					this.areaCode = msg.areaCode;
					this.roadName = "";
					this.roadCode = "";
					// http.post(area.road, {
					// 	areaCode: this.areaCode
					// }).then(res => {
					// 	if (res.list.length == 0) {
					// 		this.roadShow = false;
					// 	} else {
					// 		this.roadShow = true;
					// 	}
					// })
				} else {
					if(this.provinceCode == "1" || this.provinceCode == "2" || this.provinceCode == "3" || this.provinceCode == "4"){
						this.roadName = msg.areaName;
						this.roadCode = msg.areaCode;
					}else{
						this.roadName = msg.roadName;
						this.roadCode = msg.roadCode;
					}
					
				}
				console.log(this.multiSelector,666668888)
				console.log(this.provinceCode + "------" + this.areaCode)
				console.log(this.cityCode + "------" + this.roadCode)
			}
		}
	};
</script>

<style lang="less" scoped>
	@import '../../../common/css/common.less';

	.car-header {
		position: fixed;
		top: 0rpx;
		width: 100%;
		z-index: 999;
		background: white;

		.backButton {
			position: absolute;
			left: 20rpx;
			bottom: 40rpx;
			font-size: 32rpx;
			font-weight: bold;
		}

		.centerText {
			width: 100%;
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
		}
	}

	.address {
		position: relative;

		&-save {
			position: fixed;
			bottom: 25rpx;
			left: 25rpx;
			z-index: 1;
			line-height: 90rpx;
			text-align: center;
			width: 700rpx;
			font-size: @big-title;
			color: #fff;
		}

		&-dlBox {
			padding: 15rpx 30rpx 0;
			background: @white-color;

			dl {
				overflow: hidden;
				border-bottom: 1rpx solid #f6f6f8;
				display: flex;
				align-items: center;
				line-height: 88rpx;

				.tui-picker-detail {
					font-size: @big-title;
				}

				&:last-child {
					border-bottom: none;
					align-items: flex-start;
				}

				&:nth-child(3) {
					display: flex;
					justify-content: space-between;
					align-items: center;

					dt {
						width: 220rpx;
					}
				}

				dt {
					float: left;
					font-size: @big-title;
					width: 160rpx;
				}

				dd {
					float: left;
					font-size: @big-title;
					width: calc(100% - 160rpx);

					input {
						border: 0;
						color: @color-333;

						&::-webkit-input-placeholder {
							color: #999;
						}

						&:-moz-placeholder {
							color: #999;
						}

						&::-moz-placeholder {
							color: #999;
						}

						&:-ms-input-placeholder {
							color: #999;
						}
					}

					textarea {
						border: 0;
						height: 150rpx;
						// margin: 30rpx 0;
						font-size: @big-title;
						width: 100%;
					}

					text {
						float: right;
					}
				}
			}
		}

		&-isdefault {
			// margin-top: 30rpx;
			padding: 0 30rpx;
			background: #fff;
			line-height: 88rpx;

			dl {
				overflow: hidden;
				display: flex;
				justify-content: space-between;
				align-items: center;

				div {
					float: right;

					i {
						color: #8d8d8d;
					}
				}

				dd {
					float: left;
					font-size: @top-title;
				}
			}
		}
	}

	.address-save {
		text-align: center;
		font-size: 24rpx;
		color: white;
		border-radius: 40rpx;
		line-height: 80rpx;
	}
</style>

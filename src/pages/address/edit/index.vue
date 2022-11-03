<template>
	<div class="address" >
		<!-- 头部 -->
		<!-- <view class="car-header" :style="{ 'padding-top': paddingTop, 'padding-bottom': '30rpx' }">
			<view class="backButton iconfont icon-fanhui" @click="goBack"></view>
			<view class="centerText" :style="{ height: logoHeight, 'line-height': logoHeight }">编辑地址</view>
		</view> -->
		<div class="address-dlBox">
			<dl>
				<dt>收货人</dt>
				<dd><input type="text" placeholder="请输入收货人姓名" v-model="addressMember" /></dd>
			</dl>
			<dl>
				<dt>手机号</dt>
				<dd><input type="text" placeholder="请输入手机号码" v-model="addressPhone" /></dd>
			</dl>
			<!-- <dl>
				<dt>选择省、市、区</dt>
				<a></a>
				<picker @change="changeRegin" mode="region" :value="region">
					<view class="tui-picker-detail">{{ region[0] }} - {{ region[1] }} - {{ region[2] }}</view>
				</picker>
			</dl> -->
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
				<dd><textarea type="text" name="addressDetail" id="addressDetail" placeholder="请输入详细地址" v-model="addressDetail" style="line-height: 20rpx;padding-top: 28rpx;"></textarea></dd>
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
		
		
		
		
		<u-picker mode="selector" v-model="pickerShow" :range="multiSelector" @confirm="confirmClick" :range-key="rangeKey" :confirm-color="baseColor"></u-picker>
	</div>
</template>

<script>
import { getAddress, updateAddress } from '@/api/interface.js';
import {area} from "@/api/newApi.js"
import http from '@/api/http.js';
export default {
	data() {
		return {
			items: [],
			region: [],
			code: [],
			addressMember: '', //用户名
			addressPhone: '', //手机号
			// provinceCode: '', //省code
			// provinceName: '', //省名称
			// cityCode: '', //市code
			// cityName: '', //市名称
			// areaCode: '', //区code
			// areaName: '', //区名称
			addressDefault: 0,
			defaultIcon: false,
			addressDetail: '',
			addressId: 0,
			addressCode: '',
			alipayRegionShow: false,
			
			
			
			
			pickerShow:false,
			multiSelector: [],
			rangeKey:"",
			check:"",
			provinceName:"",
			provinceCode:"",
			areaName:"",
			areaCode:"",
			cityName:"",
			cityCode:"",
			roadName:"",
			roadCode:"",
			roadShow:true
			
			
			
			
			
			
			
			
		};
	},
	onLoad(e){
		http.get(getAddress,e).then(res=>{
			this.addressMember = res.addressMember;
			this.addressPhone = res.addressPhone;
			this.addressDefault = res.addressDefault;
			this.addressDetail = res.addressDetail;
			this.code = [res.provinceCode, res.cityCode, res.areaCode];
			this.region = [res.provinceName, res.cityName, res.areaName];
			this.defaultIcon = this.addressDefault == '1' ? true : false;
			this.provinceCode = res.provinceCode;
			this.provinceName = res.provinceName;
			this.cityCode = res.cityCode;
			this.cityName = res.cityName;
			this.areaCode = res.areaCode;
			this.areaName = res.areaName;
			this.roadName = res.roadName,
			this.roadCode = res.roadCode,
			this.addressCode = res.addressCode;
			this.addressId = res.addressId
		})
		wx.setNavigationBarTitle({
			title: "编辑收货地址",
		});
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
		changeRegin(e) {
			this.region = e.mp.detail.value;
			this.code = e.mp.detail.code;
			this.provinceCode = e.mp.detail.code[0];
			this.provinceName = e.mp.detail.value[0];
			this.cityCode = e.mp.detail.code[1];
			this.cityName = e.mp.detail.value[1];
			this.areaCode = e.mp.detail.code[2];
			this.areaName = e.mp.detail.value[2];
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
				roadName:this.roadName,
				roadCode:this.roadCode,
				addressDefault: this.addressDefault,
				addressDetail: this.addressDetail,
				addressId: this.addressId,
				addressCode: this.addressCode,
				dataState: 0
			};
			if (this.addressMember == '') {
				this.$qj.message.alert('收货人不能为空');
			} else if (this.addressPhone == '') {
				this.$qj.message.alert('手机号不能为空');
			} else if (!/^1[34578]\d{9}$/.test(this.addressPhone)) {
				this.$qj.message.alert('手机号格式不正确');
			} else if (this.addressDetail == '') {
				this.$qj.message.alert('详细地址不能为空');
			} else {
				http.get(updateAddress,params).then(res=>{
					if (res && res.success) {
						this.$routers.back()
					}
				})
			}
		},
		
		
		
		
		
		provinceClick(e){
			// check == 1
			this.pickerShow = true;
			this.check = 1;
			if(this.check == 1){
				this.rangeKey = "provincName"
				http.post(area.province).then(res=>{
					this.multiSelector = res.list
					console.log(this.multiSelector)
				})
			}
		},
		areaClick(e){
			// check == 2
			this.pickerShow = true;
			this.check = 2;
			if(this.check == 2){
				this.rangeKey = "areaName"
				console.log(this.provinceCode)
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
				} else{
					http.post(area.area,{provinceCode:this.provinceCode}).then(res=>{
						
						this.multiSelector = res.list
					})
				}
				
			}
		},
		areaParentClick(e){
			// check == 3
			this.pickerShow = true;
			this.check = 3;
			if(this.check == 3){
				this.rangeKey = "areaName"
				if (this.provinceCode == "1" || this.provinceCode == "2" || this.provinceCode == "3" || this.provinceCode == "4") {
					http.post(area.area, {
						provinceCode: this.provinceCode
					}).then(res => {
						
						this.multiSelector = res.list
					})
				} else {
				http.post(area.area,{areaParentCode:this.cityCode}).then(res=>{
					this.multiSelector = res.list
				})
				}
			}
		},
		roadClick(e){
			// check == 4
			this.check = 4;
			if(this.check == 4){
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
				http.post(area.road,{areaCode:this.areaCode}).then(res=>{
					this.multiSelector = res.list
					if(!this.multiSelector.length){
						this.$message.alert('没有更多了')
					}else{
						this.pickerShow = true;
					}
				})
				}
			}
		},
		confirmClick(e){
			var msg = this.multiSelector[e[0]];
			if(this.check == 1){
				this.provinceName = msg.provincName;
				this.provinceCode = msg.provinceCode;
				this.cityName = "";
				this.cityCode = "";
				this.areaName = "";
				this.areaCode = "";
				this.roadName = "";
				this.roadCode = "";
			}else if(this.check == 2){
				this.cityName = msg.areaName;
				this.cityCode = msg.areaCode;
				this.areaName = "";
				this.areaCode = "";
				this.roadName = "";
				this.roadCode = "";
			}else if(this.check == 3){
				this.areaName = msg.areaName;
				this.areaCode = msg.areaCode;
				this.roadName = "";
				this.roadCode = "";
				// http.post(area.road,{areaCode:this.areaCode}).then(res=>{
				// 	if(res.list.length==0){
				// 		this.roadShow = false;
				// 	}else{
				// 		this.roadShow = true;
				// 	}
				// })
			}else {
				if(this.provinceCode == "1" || this.provinceCode == "2" || this.provinceCode == "3" || this.provinceCode == "4"){
					this.roadName = msg.areaName;
					this.roadCode = msg.areaCode;
				}else{
				this.roadName = msg.roadName;
				this.roadCode = msg.roadCode;
				}
			}
			console.log(this.provinceCode+"------"+this.areaCode)
			console.log(this.cityCode+"------"+this.roadCode)
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
	.backButton{
		position: absolute;
		left: 20rpx;
		bottom: 40rpx;
		font-size: 32rpx;
		font-weight: bold;
	}
	.centerText{
		width: 100%;
		text-align: center;
		font-size: 34rpx;
		font-weight: 500;
	}
}
.address {
	position: relative;
	width: 100%;
	height: 100%;
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
				width: 520rpx;
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
					height: 200rpx;
					// padding: 30rpx 0;
					font-size: @big-title;
				}
				text{
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
			i {
				float: right;
				color: #8d8d8d;
			}
			dd {
				float: left;
				font-size: @top-title;
			}
		}
	}
}
.address-save{
	text-align: center;
	font-size: 24rpx;
	color: white;
	border-radius: 40rpx;
	line-height: 80rpx;
	border: none;
	left: 25rpx;
	bottom: 25rpx;
}
</style>

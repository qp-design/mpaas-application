<template>
	<div class="invoiceTitle">
		<div class="invoiceTitle-save" @click="selectShowModel" v-show="userinvType != '2'">选择已有</div>
		<div class="invoiceTitle-tit">
			发票类型
			<span :style="{ color: baseColor }" @click="info">发票须知</span>
		</div>
		<div class="invoiceTitle-con">
			<div
				v-for="(item, index) in items"
				:key="index"
				@click="selectInvoice(index)"
				:style="{ background: userinvType == '' + index ? baseColor : '', color: userinvType == '' + index ? '#fff' : '#999' }"
			>
				{{ item }}
			</div>
		</div>
		<div class="invoiceTitle-msg">*电子普通发票与普通发票具备同等法律效力，可支持报销入账</div>
		<div class="invoiceTitle-ul">
			<ul>
				<li v-if="invoiceIndex != 2">
					<div>
						发票抬头
						<h1>
							<div>
								<span v-show="userinvType != '2'" @click="classifyClick('2')" class="personSpan">
									<i class="iconfont" v-if="userinvSort == '2'" :style="{ color: baseColor }">&#xe671;</i>
									<i class="iconfont" v-else>&#xe672;</i>
									个人
								</span>
							</div>
							<div>
								<span @click="classifyClick('1')">
									<i class="iconfont" v-if="userinvSort == '1'" :style="{ color: baseColor }">&#xe671;</i>
									<i class="iconfont" v-else>&#xe672;</i>
									单位
								</span>
							</div>
						</h1>
					</div>
				</li>
				<li v-show="userinvSort == '2' && userinvType != '2'">
					<div>
						开票名称
						<input placeholder="请输入开票名称" v-model="userinvMember" />
					</div>
				</li>
				<li v-show="userinvSort == '1'">
					<div>
						单位名称
						<input placeholder="请输入单位名称" v-model="userinvMember" :disabled="inputDisabled ? true : false" />
					</div>
				</li>
				<li v-show="userinvSort == '1'">
					<div>
						纳税人识别码
						<input placeholder="请输入纳税人识别码" v-model="newParams.userinvNo" :disabled="inputDisabled ? true : false" />
					</div>
				</li>
				<li v-show="userinvType == '2'">
					<div>
						开票地址
						<input placeholder="请输入开票地址" v-model="newParams.userinvAdd" :disabled="inputDisabled ? true : false" />
					</div>
				</li>
				<li v-show="userinvType == '2'">
					<div>
						开票电话
						<input placeholder="请输入开票电话" v-model="newParams.userinvPhone" :disabled="inputDisabled ? true : false" />
					</div>
				</li>
				<li v-show="userinvType == '2'">
					<div>
						开户行
						<input placeholder="请输入开户行" v-model="newParams.userinvBankname" />
					</div>
				</li>
				<li v-show="userinvType == '2'">
					<div>
						账号
						<input placeholder="请输入账号" v-model="newParams.userinvBankno" />
					</div>
				</li>
				<li class="addImg" v-show="userinvType == '2'">
					<div class="dd-img" v-if="newParams.userinvImgurl">
						<i class="iconfont" @click="delImg">&#xe600;</i>
						<img :src="newParams.userinvImgurl" />
					</div>
					<div class="addInvoice-text-img" v-else>
						<!-- <h4>上传凭证</h4> -->
						<div class="addInvoice-text-img-box">
							<dl class="show-apply-img">
								<dd>
									<form action class="apply-up-img">
										<div class="weui-uploader__input-box">
											<div class="weui-uploader__input" @click="chooseImage">
												<i class="iconfont">&#xe620;</i>
												<p>添加图片</p>
											</div>
										</div>
									</form>
								</dd>
							</dl>
						</div>
					</div>
				</li>
				<li v-show="userinvType != '0'">
					<div>
						收票人姓名
						<input placeholder="请输入收票人姓名" v-model="newParams.userinvUname" :disabled="inputDisabled ? true : false" />
					</div>
				</li>
				<li v-show="userinvType != '0'">
					<div>
						收票人手机
						<input placeholder="请输入收票人手机" v-model="newParams.userinvUphone" :disabled="inputDisabled ? true : false" />
					</div>
				</li>
				<!-- <li v-show="userinvType != '0'">
					<div>
						收票人地址
						<picker @change="changeRegin" mode="region" :value="region" :disabled="inputDisabled ? true : false">
							<view class="tui-picker-detail">{{ region[0] }} - {{ region[1] }} - {{ region[2] }}</view>
						</picker>
					</div>
				</li> -->
				<li v-show="userinvType != '0'">
					<!-- #ifndef H5 -->
					<div>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<div @click="pickerShow=true">
					<!-- #endif -->
						收票人地址
						<!-- #ifndef H5 -->
						<picker mode="region" @change="changeRegin" :value="region">
						<!-- #endif -->
							<view v-if="region.length == 0" class="placeholderStyle">请选择地址</view>
							<view class="tui-picker-detail" v-else>{{ provinceName + '-' + cityName + '-' + areaName }}</view>
						<!-- #ifndef H5 -->
						</picker>
						<!-- #endif -->
					</div>
				</li>
				<li v-show="userinvType == '1'">
					<div>
						<span></span>
						<input placeholder="请输入详细地址" v-model="newParams.userinvUadd" :disabled="inputDisabled ? true : false" />
					</div>
				</li>
			</ul>
		</div>
		<div class="invoiceTitle-btn" :style="{ background: baseColor }" @click="saveInvoiceTitle">确认</div>
		<div
			class="invoiceTitle-screenLeft"
			v-show="isShow"
			@click="
				() => {
					isShow = false;
				}
			"
		></div>
		<div class="invoiceTitle-preferential" v-show="isShow">
			<div class="invoiceTitle-preferential-con">
				<p>
					选择已有
					<i
						class="iconfont"
						@click="
							() => {
								isShow = false;
							}
						"
					>
						&#xe609;
					</i>
				</p>
				<ul>
					<li v-for="(getinvoices, getinvoicesIndex) in getinvoicesList" :key="getinvoicesIndex" @click="selectGetInvoices(getinvoices)">
						<h3 v-if="userinvSort == '1'">
							<h4>
								{{ getinvoices.userinvMember }}
								
							</h4>单位
							
						</h3>
						<h3 v-else>
							<h4>{{ getinvoices.userinvMember }}</h4>
							个人
						</h3>
					</li>
				</ul>
				<div
					class="pre-btn"
					:style="{ background: baseColor }"
					@click="
						() => {
							isShow = false;
							$routers.replace('my/addInvoiceInfo');
						}
					"
				>
					新增
				</div>
			</div>
		</div>
		<u-picker mode="region" v-model="pickerShow" @confirm="changeRegin" :confirm-color="baseColor"></u-picker>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { invoice, uploadGoodsFile } from '@/api/interface.js';
import { area } from '@/api/newApi.js';
export default {
	data() {
		return {
			invoiceIndex:0,
			title: '新增发票信息',
			leftIcon: true,
			rightIcon: false,
			isShow: false,
			getinvoicesList: [],
			items: ['电子普通发票', '增值税纸质普通发票', '增值税专用发票'],
			query: {},
			newParams: {},
			userinvMember: '',
			userinvType: '0',
			userinvSort: '2',
			userParams: {
				userinvPhone: '',
				userinvAdd: '',
				userinvBank: '',
				userinvBankname: '',
				userinvBankno: '',
				userinvUphone: '',
				userinvUadd: '', //收票人地址
				userinvUname: '',
				userinvNo: '',
				userinvUeamil: '',
				userinvCode: '',
				userinvImgurl: ''
			},
			invlistOpamt: '',
			invlistOpcode: '',
			isDisabled: false,
			checkData: {}, // 获取增值税专用发票信息
			inputDisabled: false, // input禁用状态
			myInvoice: '', //我的发票路径
			pickerShow: false,
			multiSelector: [],
			rangeKey: '',
			check: '',
			provinceName: '',
			provinceCode: '',
			userinvCode:"",
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
	onLoad(e) {
		this.query = JSON.parse(e.params);
		console.log(this.query, 'this.query');
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	created() {
		this.userinvMember = '';
	},
	mounted() {
		this.clearData();
		this.getCheck();
		this.$state.application.map(v => {
			if (v.menuAction == 'myInvoice') {
				this.myInvoice = v.menuJspath;
			}
		});
	},
	watch:{
		// #ifdef H5
		pickerShow(newValue, oldValue) {
			if (!newValue) {
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
			// #ifndef H5
			this.region = e.detail.value;
			this.regionCode = e.detail.code;
			this.provinceName = this.region[0];
			this.provinceCode = this.regionCode[0];
			this.cityName = this.region[1];
			this.cityCode = this.regionCode[1];
			this.areaName = this.region[2];
			this.areaCode = this.regionCode[2];
			// #endif
			// #ifdef H5
			this.region = [e.province.label, e.city.label, e.area.label]
			this.regionCode = [e.province.value, e.city.value, e.area.value];
			this.provinceName = this.region[0];
			this.provinceCode = this.regionCode[0];
			this.cityName = this.region[1];
			this.cityCode = this.regionCode[1];
			this.areaName = this.region[2];
			this.areaCode = this.regionCode[2];
			// #endif
		},
		clearData() {
			// this.region = ['北京市', '北京市', '东城区'];
			// this.code = ['110000', '110100', '110101'];
			this.provinceCode = ''; //省code
			this.provinceName = ''; //省名称
			this.cityCode = ''; //市code
			this.cityName = ''; //市名称
			this.areaCode = ''; //区code
			this.areaName = ''; //区名称
			this.userinvMember = '';
			this.userinvType = '0';
			this.userinvSort = '2';
			this.newParams = JSON.parse(JSON.stringify(this.userParams));
		},
		getCheck() {
			http.get(invoice.checkAuditing).then(res => {
				this.checkData = res;
				if (res.dataState == '1') {
					this.isDisabled = false;
				} else {
					this.isDisabled = true;
				}
			});
		},
		delImg() {
			this.newParams.userinvImgurl = '';
		},
		chooseImage() {
			let i = 0; // 多图上传时使用到的index
			let that = this;
			let max = 1; //最大选择数
			let upLength; //图片数组长度
			let imgFilePaths; //图片的本地临时文件路径列表

			uni.chooseImage({
				count: max, //一次最多可以选择的图片张数
				sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					imgFilePaths = res.tempFilePaths;
					upLength = imgFilePaths.length;

					/**
					 * 上传完成后把文件上传到服务器
					 */
					wx.showLoading({
						title: '上传中...'
					});
					that.upLoad(imgFilePaths, i, upLength); //上传操作
				},
				fail: function() {
					console.log('fail');
				},
				complete: function() {
					console.log('commplete');
				}
			});
		},
		upLoad(imgPath, i, upLength) {
			console.log(imgPath[i]);
			let that = this;
			//上传文件
			uni.uploadFile({
				url: this.$domain + uploadGoodsFile,
				filePath: imgPath[i],
				name: 'file',
				formData: {
					imgIndex: i
				},
				// #ifndef H5
				header: {
					'Content-Type': 'multipart/form-data',
					cookie: wx.getStorageSync('miniToken') + '=' + wx.getStorageSync('sessionid'),
					'saas-Agent': 'qj-wemini'
				},
				// #endif
				success: function(res) {
					console.log(JSON.parse(res.data).fileUrl, 'fileUrl');
					that.$set(that.newParams, 'userinvImgurl', that.$domain + JSON.parse(res.data).fileUrl);
					//that.invoice.userinvImgurl = that.$domain+JSON.parse(res.data).fileUrl;
				},
				fail: function(res) {
					wx.hideLoading();
					wx.showModal({
						//title: '提示',
						content: '上传图片失败',
						showCancel: false,
						success: function(res) {}
					});
				},
				complete: function() {
					i++;
					if (i == upLength) {
						wx.hideLoading();
					} else {
						that.upLoad(imgPath, i, upLength);
					}
				}
			});
		},
		selectShowModel() {
			this.isShow = true;
			let params = {
				notDataState: -1,
				userinvSort: this.userinvSort
			};
			http.get(invoice.getinvoicesList, params).then(res => {
				this.getinvoicesList = res.rows;
			});
		},
		selectInvoice(index) {
			this.invoiceIndex = index
			if (index === 2 && this.isDisabled == true) {
				$message.alert('请先去申请增票资质');
			} else if (index === 2 && this.isDisabled == false) {
				this.newParams = this.checkData;
				// this.region = this.checkData.provinceName ? [this.checkData.provinceName, this.checkData.cityName, this.checkData.areaName] : ['北京市', '北京市', '东城区'];
				// this.code = this.checkData.provinceCode ? [this.checkData.provinceCode, this.checkData.cityCode, this.checkData.areaCode] : ['110000', '110100', '110101'];
				this.provinceCode = this.checkData.provinceCode ? this.checkData.provinceCode : '110000';
				this.provinceName = this.checkData.provinceName ? this.checkData.provinceName : '北京市';
				this.cityCode = this.checkData.cityCode ? this.checkData.cityCode : '110100';
				this.cityName = this.checkData.cityName ? this.checkData.cityName : '北京市';
				this.areaCode = this.checkData.areaCode ? this.checkData.areaCode : '110101';
				this.areaName = this.checkData.areaName ? this.checkData.areaName : '东城区';

				this.userinvSort = '1';
				this.userinvMember = this.checkData.userinvMember;
				this.userinvType = this.checkData.userinvType;
				this.inputDisabled = true;
			} else {
				this.clearData();
				this.userinvMember = '';
				this.userinvType = '' + index;
			}
			console.log(index,3333333)
		},
		selectGetInvoices(getinvoices) {
			
			console.log(getinvoices,this.userinvSort)
			this.newParams = getinvoices;
			if(this.userinvSort =='2'){
				this.provinceCode = getinvoices.provinceCode;
				this.provinceName = getinvoices.provinceName;
				this.cityCode = getinvoices.cityCode;
				this.cityName = getinvoices.cityName;
				this.areaCode = getinvoices.areaCode;
				this.areaName = getinvoices.areaName;
				this.roadCode = getinvoices.roadCode;
				this.roadName = getinvoices.roadName;
				this.userinvMember = getinvoices.userinvMember;
				this.isShow = false;
				this.userinvCode = getinvoices.userinvCode
			}else{
				this.provinceCode = getinvoices.provinceCode;
				this.provinceName = getinvoices.provinceName;
				this.cityCode = getinvoices.cityCode;
				this.cityName = getinvoices.cityName;
				this.areaCode = getinvoices.areaCode;
				this.areaName = getinvoices.areaName;
				this.roadCode = getinvoices.roadCode;
				this.roadName = getinvoices.roadName;
				this.userinvMember = getinvoices.userinvMember;
				this.userinvCode = getinvoices.userinvCode
				this.isShow = false;
			}
			this.region = [getinvoices.provinceName, getinvoices.cityName, getinvoices.areaName];
			this.code = [getinvoices.provinceCode, getinvoices.cityCode, getinvoices.areaCode];
			
		},
		info() {
			wx.showModal({
				content: '发票须知',
				showCancel: false, //是否显示取消按钮
				success(res) {
					if (res.confirm) {
						// console.log('用户点击确定')
					}
				}
			});
		},
		classifyClick(index) {
			this.userinvSort = index;
			this.userinvMember = '';
		},
		saveInvoiceTitle() {
			let reg = /^[0-9a-zA-Z]+$/;
			let params = {
				userinvCode: this.userinvCode,
				invlistOpcode: this.query.code,
				invlistOpamt: this.query.money,
				userinvSort: this.userinvSort,
				userinvMember: this.userinvMember,
				userinvUeamil: '',
				invlistOptype: this.query.invlistOptype,
				provinceCode: '',
				provinceName: '',
				areaCode: '',
				areaName: '',
				cityCode: '',
				cityName: '',
				roadCode: '',
				roadName: '',
				invUserinvDomain: {
					userinvSort: this.userinvSort,
					userinvType: 1,
					userinvUphone: '',
					userinvMember: this.userinvMember,
					userinvUname: '',
					userinvCode: this.userinvCode,
				}
			};
			switch (this.userinvType) {
				case '0':
					params.userinvType = '1';
					break;
				case '1':
					params.userinvType = '3';
					break;
				case '2':
					params.userinvType = '2';
					break;
				default:
					params.userinvType = '1';
			}

			if (this.userinvMember == '' || this.userinvMember.indexOf(' ') >= 0) {
				$message.alert('请填写必填项');
				return;
			} else if (this.userinvMember.length < 2 || this.userinvMember.length > 18) {
				if (this.userinvSort == '2') {
					$message.alert('开票名称请输入2-18个字符');
				} else {
					$message.alert('单位名称请输入2-18个字符');
				}
			} else {
				if (params.userinvType == '1') {
					if (this.userinvSort == '2') {
						delete params.userinvNo;
					
						http.post(invoice.writeReceipt, { paramStr: JSON.stringify(params) }).then(res => {
							if (res && res.success) {
								$message.alert('提交成功！');
								// #ifndef H5
								uni.redirectTo({
									url: '/pages/invoice_modules/myInvo/main'
								});
								// #endif
								// #ifdef H5
								this.$routers.push('invoice_modules/myInvo')
								// #endif
							}
						});
					} else {
						params.userinvNo = this.newParams.userinvNo;
						
						if (params.userinvNo.length < 15 || params.userinvNo.length > 20) {
							$message.alert('纳税人识别码请输入15-20个字符');
						} else if (!reg.test(params.userinvNo)) {
							$message.alert('纳税人识别码只能为数字和字母');
						} else {
						
							http.get(invoice.writeReceipt, { paramStr: JSON.stringify(params) }).then(res => {
								if (res && res.success) {
									$message.alert('提交成功！');
									// #ifndef H5
									uni.redirectTo({
										url: '/pages/invoice_modules/myInvo/main'
									});
									// #endif
									// #ifdef H5
									this.$routers.push('invoice_modules/myInvo')
									// #endif
								}
							});
						}
					}
				} else if (this.userinvType == '3') {
					let doParams = {
						userinvCode: this.userinvCode,
						invlistOpcode: this.query.code,
						invlistOpamt: this.query.money,
						userinvType: this.userinvType,
						userinvSort: this.userinvSort,
						userinvMember: this.userinvMember,
						// userinvUeamil: '',
						invlistOptype: this.query.invlistOptype,
						provinceCode: this.provinceCode,
						provinceName: this.provinceName,
						areaCode: this.areaCode,
						areaName: this.areaName,
						cityCode: this.cityCode,
						cityName: this.cityName,
						addressDetail: this.newParams.userinvUadd,
						// roadCode: this.roadCode,
						// roadName: this.roadName,
						invUserinvDomain: {
							userinvType: this.userinvType,
							userinvSort: this.userinvSort,
							userinvUphone: this.newParams.userinvUphone,
							// userinvUadd: this.newParams.userinvUadd,
							userinvMember: this.userinvMember,
							userinvUname: this.newParams.userinvUname,
							userinvCode: this.userinvCode
						}
					};
					
					if (this.userinvSort == '2') {
						delete doParams.invUserinvDomain.userinvNo;
					
						http.post(invoice.writeReceipt, { paramStr: JSON.stringify(doParams) }).then(res => {
							if (res && res.success) {
								$message.alert('提交成功！');
								// #ifndef H5
								uni.redirectTo({
									url: '/pages/invoice_modules/myInvo/main'
								});
								// #endif
								// #ifdef H5
								this.$routers.push('invoice_modules/myInvo')
								// #endif
							}
						});
					} else {
						doParams.invUserinvDomain.userinvNo = this.newParams.userinvNo;
						if (this.newParams.userinvNo.length < 15 || this.newParams.userinvNo.length > 20) {
							$message.alert('纳税人识别号请输入15-20个字符');
						} else if (!reg.test(this.newParams.userinvNo)) {
							$message.alert('纳税人识别号只能为数字和字母');
						} else {
						
							http.post(invoice.writeReceipt, { paramStr: JSON.stringify(doParams) }).then(res => {
								if (res && res.success) {
									$message.alert('提交成功！');
									// #ifndef H5
									uni.redirectTo({
										url: '/pages/invoice_modules/myInvo/main'
									});
									// #endif
									// #ifdef H5
									this.$routers.push('invoice_modules/myInvo')
									// #endif
								}
							});
						}
					}
				} else {
					let params = {
						userinvCode: this.userinvCode,
						invlistOpcode: this.query.code,
						invlistOpamt: this.query.money,
						userinvType: 3,
						userinvSort: this.userinvSort,
						userinvMember: this.userinvMember,
						// userinvUeamil: '',
						invlistOptype: 'OcContract',
						provinceCode: this.provinceCode,
						provinceName: this.provinceName,
						areaCode: this.areaCode,
						areaName: this.areaName,
						cityCode: this.cityCode,
						cityName: this.cityName,
						// roadCode: this.roadCode,
						// roadName: this.roadName,
						addressDetail: this.newParams.userinvUadd,
						invUserinvDomain: {
							userinvType: 3,
							userinvSort: this.userinvSort,
							userinvUphone: this.newParams.userinvUphone,
							userinvMember: this.userinvMember,

							// userinvAdd: this.newParams.userinvAdd,
							// userinvUadd: this.newParams.userinvUadd,
							// userinvImgurl: this.newParams.userinvImgurl,
							// userinvPhone: this.newParams.userinvPhone,
							// userinvBankname: this.newParams.userinvBankname,
							// userinvBankno: this.newParams.userinvBankno,
							userinvNo: this.newParams.userinvNo,
							userinvUname: this.newParams.userinvUname,
							userinvCode: this.userinvCode
						}
					};
					if (this.userinvSort == '1') {
						if (this.newParams.userinvNo.length < 15 || this.newParams.userinvNo.length > 20) {
							$message.alert('纳税人识别码请输入15-20个字符');
						} else if (!reg.test(this.newParams.userinvNo)) {
							$message.alert('纳税人识别码只能为数字和字母');
						}
					}
					
					http.post(invoice.writeReceipt, { paramStr: JSON.stringify(params) }).then(res => {
						if (res && res.success) {
							$message.alert('提交成功！');
							// #ifndef H5
							uni.redirectTo({
								url: '/pages/invoice_modules/myInvo/main'
							});
							// #endif
							// #ifdef H5
							this.$routers.push('invoice_modules/myInvo')
							// #endif
						}
					});
					// }
				}
			}
			
		}

		// provinceClick(e) {
		// 	// check == 1
		// 	this.pickerShow = true;
		// 	this.check = 1;
		// 	if (this.check == 1) {
		// 		this.rangeKey = 'provincName';
		// 		http.post(area.province).then(res => {
		// 			this.multiSelector = res.list;
		// 			console.log(this.multiSelector);
		// 		});
		// 	}
		// },
		// areaClick(e) {
		// 	// check == 2
		// 	this.pickerShow = true;
		// 	this.check = 2;
		// 	if (this.check == 2) {
		// 		this.rangeKey = 'areaName';
		// 		console.log(this.provinceCode);
		// 		http.post(area.area, { provinceCode: this.provinceCode }).then(res => {
		// 			console.log(res);
		// 			this.multiSelector = res.list;
		// 		});
		// 	}
		// },
		// areaParentClick(e) {
		// 	// check == 3
		// 	this.pickerShow = true;
		// 	this.check = 3;
		// 	if (this.check == 3) {
		// 		this.rangeKey = 'areaName';
		// 		http.post(area.area, { areaParentCode: this.cityCode }).then(res => {
		// 			this.multiSelector = res.list;
		// 		});
		// 	}
		// },
		// roadClick(e) {
		// 	// check == 4
		// 	this.check = 4;
		// 	if (this.check == 4) {
		// 		this.rangeKey = 'roadName';
		// 		http.post(area.road, { areaCode: this.areaCode }).then(res => {
		// 			this.multiSelector = res.list;
		// 			console.log(this.multiSelector);
		// 			if (!this.multiSelector.length) {
		// 				uni.showToast({
		// 					title: '没有更多了'
		// 				});
		// 			} else {
		// 				this.pickerShow = true;
		// 			}
		// 		});
		// 	}
		// },

		// confirmClick(e){
		// 	var msg = this.multiSelector[e[0]];
		// 	if(this.check == 1){
		// 		this.provinceName = msg.provincName;
		// 		this.provinceCode = msg.provinceCode;
		// 		this.cityName = "";
		// 		this.cityCode = "";
		// 		this.areaName = "";
		// 		this.areaCode = "";
		// 		this.roadName = "";
		// 		this.roadCode = "";
		// 	}else if(this.check == 2){
		// 		this.cityName = msg.areaName;
		// 		this.cityCode = msg.areaCode;
		// 		this.areaName = "";
		// 		this.areaCode = "";
		// 		this.roadName = "";
		// 		this.roadCode = "";
		// 	}else if(this.check == 3){
		// 		this.areaName = msg.areaName;
		// 		this.areaCode = msg.areaCode;
		// 		this.roadName = "";
		// 		this.roadCode = "";
		// 		http.post(area.road,{areaCode:this.areaCode}).then(res=>{
		// 			if(res.list.length==0){
		// 				this.roadShow = false;
		// 			}else{
		// 				this.roadShow = true;
		// 			}
		// 		})
		// 	}else {
		// 		this.roadName = msg.roadName;
		// 		this.roadCode = msg.roadCode;
		// 	}
		// 	console.log(this.provinceCode+"------"+this.areaCode)
		// 	console.log(this.cityCode+"------"+this.roadCode)
		// }
	}
};
</script>

<style lang="less" scoped>
@import '@/common/css/common.less';
.invoiceTitle {
	width: 100%;
	padding-bottom: 100rpx;
	&-save {
		position: fixed;
		z-index: 99999;
		height: 90rpx;
		line-height: 90rpx;
		text-align: right;
		right: 150rpx;
		top: 14rpx;
		font-size: @big-title;
	}
	&-tit {
		height: 77rpx;
		font-size: @big-title;
		padding: @padding-30;
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
	}
	&-con {
		height: 85rpx;
		margin: 0 30rpx;
		/* #ifdef H5 */
		margin-top: 50rpx;
		/* #endif */
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		div {
			font-size: 22rpx;
			color: @color-999;
			padding: 16rpx 30rpx;
			background: #f6f6f8;
			border-radius: 2rpx;
		}
	}
	&-msg {
		font-size: 22rpx;
		color: @color-999;
		padding: @padding-30;
		height: 84rpx;
		display: flex;
		align-items: center;
		border-bottom: 20rpx solid #fafafa;
	}
	&-ul {
		ul {
			padding: @padding-30;
			li {
				border-bottom: 1rpx solid #f6f6f8;
				height: 90rpx;
				font-size: @big-title;
				color: #333;

				> div {
					height: 90rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					h1 {
						display: flex;
						align-items: center;
						div {
							display: flex;
							align-items: center;
							span {
								display: flex;
								align-items: center;
								i {
									margin-right: 10rpx;
									color: #8d8d8d;
									
								}
							}
							.personSpan {
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
				.dd-img {
					width: 176rpx;
					height: 176rpx;
					overflow: hidden;
					position: relative;
					margin: 10rpx 0;
					i {
						position: absolute;
						right: 0;
						top: 0;
						z-index: 2;
					}
					img {
						width: 140rpx;
						height: 140rpx;
						margin: 18rpx 0 0 18rpx;
					}
				}
				.addInvoice-text-img {
					height: 180rpx;
					.addInvoice-text-img-box {
						.show-apply-img {
							overflow: hidden;
							zoom: 1;
							dd {
								position: relative;
								width: 140rpx;
								height: 140rpx;
								float: left;
							}
							form {
								width: 136rpx;
								height: 136rpx;
								background: #fff;
								border: 1px dashed #d2d2d2;
								display: flex;
								justify-content: center;
								align-items: center;
								text-align: center;
								i {
									font-size: 57rpx;
									color: #d2d2d2;
								}
								p {
									color: #d2d2d2;
									font-size: 18rpx;
								}
								input[type='file'] {
									width: 136rpx;
									height: 136rpx;
									position: absolute;
									opacity: 0;
									top: 0;
									left: 0;
									z-index: 2;
								}
							}
						}
					}
				}
				.text-img {
					height: 180rpx;
				}
			}
			li.addImg {
				height: 180rpx;
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
	&-screenLeft {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		left: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 99999;
	}
	&-preferential {
		width: 100%;
		height: 488rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100000;
		&-con {
			background-color: #fff;
			height: 488rpx;
			position: absolute;
			width: 100%;
			bottom: 0;
			p {
				height: 92rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #f5f5f5;
				padding: @padding-lr;
			}
			ul {
				height: 300rpx;
				overflow: scroll;
				padding: @padding-30;
				li {
					border-bottom: 1rpx solid #f6f6f8;
					height: 106rpx;
					h3 {
						height: 106rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: @big-title;
						color: @color-333;
						h4 {
							display: flex;
							align-items: center;
							span {
								background: #b79f77;
								font-size: 22rpx;
								color: #fff;
								padding: 4rpx 10rpx;
								border-radius: 20rpx;
								margin-left: 10rpx;
							}
						}
					}
				}
			}
			.pre-btn {
				height: 96rpx;
				position: absolute;
				bottom: 0;
				width: 100%;
				text-align: center;
				line-height: 96rpx;
				color: @white-color;
				font-size: @top-title;
				background: #b79f77;
			}
		}
	}
}
</style>

<style lang="less" scoped>
	.Box {
		height: 100%;
		width: 100%;
		background: #F7F7F7;
	}
	.formBox {
		& {
			margin-top: 16rpx;
			padding: 0 35rpx;
			height: calc(100% - 16rpx);
			width: 100%;
			background: #ffffff;
		}

		&--from {
			.upload {
				& {
					width: 240rpx;
					height: 136rpx;
					background: #FAFAFA;
					border-radius: 4px;
					border: 1px solid #EBEDF0;

					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}

				&--img {
					width: 36rpx;
					height: 36rpx;
					color: #969899;
				}

				&--text {
					font-size: 28rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #C8C9CC;

					padding-top: 12rpx;
				}
			}

			.tips {
				font-size: 18rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #C8C9CC;
			}
		}

		&--agreement {
			& {
				padding-top: 72rpx;
				padding-bottom: 48rpx;

				font-size: 24rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #646566;
			}

			&--text {
				color: #D7000F;
			}
		}

		&--btn {}
		&--type {
			& {
				height: 100%;
				width: 100%;
				
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}
			&--img {
				width: 176rpx;
				height: 176rpx;
			}
			&--text {
				margin-top: 48rpx;
				
				font-size: 28rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #333333;
				
				&--error{
					
					& {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
					}
					
					&--ttext {
						margin-top: 32rpx;
						font-size: 24rpx;
						color: #999999;
						
						padding: 0 110rpx;
						text-align: center;
						line-height: 18px;
					}
				}
				
				
			}
			&--btn {
				
				& {
					width: 100%;
					position: fixed;
					bottom: 0;
					padding: 0 24rpx;
					
				}
				
				&--error {
					& {
						display: flex;
						justify-content: space-around;
					}
					
					&--btn1 {
						width: 45%;
					}
					&--btn2 {
						width: 45%;
					}
				}
			}
		}
	}
</style>

<template>
	<view class="Box">
		<view class="formBox" v-if="typeRows">
			<u-form class="formBox--from" :model="form" ref="uForm" :label-style="labelStyle" :label-width='260'>
				<u-form-item label="用户类型" prop="nameType" :required="true">
					<u-input v-model="form.nameType" placeholder='请选择用户类型' type="select" :select-open="show"
						@click="show = true" placeholder-style="#C8C9CC" />
					<u-action-sheet :list="actionSheetList" v-model="show" @click="actionSheetCallback">
					</u-action-sheet>
				</u-form-item>
				<u-form-item label="公司名称" prop="companyName" :required="true">
					<u-input v-model="form.companyName" placeholder='请填写公司名称' placeholder-style="#C8C9CC" />
				</u-form-item>
				<u-form-item label="公司法人" prop="companyLegalPerson" :required="true">
					<u-input v-model="form.companyLegalPerson" placeholder='请填写公司法人' placeholder-style="#C8C9CC" />
				</u-form-item>
				<u-form-item label="法人身份证号" prop="LegalPersonNumber">
					<u-input v-model="form.LegalPersonNumber" placeholder='请填写法人身份证号' placeholder-style="#C8C9CC" />
				</u-form-item>
				<u-form-item label="联系人" prop="contactPerson">
					<u-input v-model="form.contactPerson" placeholder='请填写联系人' placeholder-style="#C8C9CC" />
				</u-form-item>
				<u-form-item label="联系人手机号" prop="contactMobileNumber">
					<u-input v-model="form.contactMobileNumber" placeholder='请填写联系人手机号' placeholder-style="#C8C9CC" />
				</u-form-item>
				<u-form-item label="公司网站" prop="companyWeb">
					<u-input v-model="form.companyWeb" placeholder='请填写公司网站' placeholder-style="#C8C9CC" />
				</u-form-item>
				<u-form-item label="公司详细地址" prop="companyDetails">
					<u-input v-model="form.companyDetails" placeholder='请填写公司详细地址' placeholder-style="#C8C9CC" />
				</u-form-item>
				<u-form-item label="营业执照照片" prop="businessLicense">
					<view class="upload" v-if="form.businessLicense" @click="delImg">
						<image :style="{width: '100%',height: '100%'}" :src="form.businessLicense" mode=""></image>
					</view>
					<view class="upload" @click="chooseImage" v-else>
						<i class="iconfont upload--img">&#xe620;</i>
						<text class="upload--text">上传营业执照</text>
					</view>
					<view class="tips">注：支持JPG、PNG、GIF、JPEG格式、大小5M以内</view>
				</u-form-item>
				<u-form-item label="店铺名称" prop="storeName" :required="true">
					<u-input v-model="form.storeName" placeholder='请填写店铺名称' placeholder-style="#C8C9CC" />
				</u-form-item>
				<!-- 密码废弃!!!! -->
				<u-form-item v-if="false" label="密码" prop="password" :required="true" :border-bottom='true'>
					<u-input type="password" v-model="form.password" placeholder='请填写商家端密码'
						placeholder-style="#C8C9CC" />
				</u-form-item>
			</u-form>
			<view class="formBox--agreement">
				<u-checkbox @change="checkboxChange" shape="circle" v-model="isAgreement">{{item.name}}</u-checkbox>
				我已阅读并同意 <text class="formBox--agreement--text" @tap="goAgreement">《入驻协议》</text>
			</view>
			<u-button v-if="isAgreement" shape="circle" :custom-style="btnStyle" class="formBox--btn" @click="submit">
				立即认证</u-button>
			<u-button v-else shape="circle" :custom-style="btnStyle1" class="formBox--btn" disabled>立即认证</u-button>
		</view>
		<view class="formBox" v-else>
			<view class="formBox--type">
				<view class="formBox--type--img">
					<!-- 审核成功 -->
					<image v-if="dataState === 1" :style="{width: '100%',height: '100%'}"
						src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/BBC/shenhchenggong.png" mode=""></image>
					<!-- 待审核 -->
					<image v-else-if="dataState === 0" :style="{width: '100%',height: '100%'}"
						src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/BBC/daishenhe.png" mode=""></image>
					<!-- 审核失败 -->
					<image v-else :style="{width: '100%',height: '100%'}"
						src="https://qjstatic.oss-cn-shanghai.aliyuncs.com/BBC/shenheshibai.png" mode=""></image>
				</view>
				
				<view class="formBox--type--text">
					<view v-if="dataState === 1">您已是商家，无需重新注册</view>
					<view v-else-if="dataState === 0">您的申请已提交，请耐心等待审核</view>
					<view v-else class="formBox--type--text--error">
						<text>审核失败，请您重新填写信息</text>
						<text class="formBox--type--text--error--ttext">很抱歉，因您提交的营业执照已过期导致审核失败 请重新上传符合要求的信息。</text>
					</view>
				</view>
				<view class="formBox--type--btn">
					<u-button v-if="[0, 1].includes(dataState)" shape="circle" :custom-style="btnStyle" @click="goIndex">返回首页</u-button>
					<view class="formBox--type--btn--error" v-else>
						<view class="formBox--type--btn--error--btn1">
							<u-button shape="circle" :custom-style="btnStyle2" @click="goIndex">返回首页</u-button>
						</view>
						<view class="formBox--type--btn--error--btn2">
							<u-button shape="circle" :custom-style="btnStyle" @click="resetEdit">重新编辑</u-button>
						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {
		uploadGoodsFile,
		merchantOnboarding
	} from '@/api/interface.js';
	export default {
		data() {
			return {
				dataState: 2, //0 待审核，1 审核通过，2审核失败
				typeRows: true,
				isAgreement: false,
				btnStyle: {
					background: '#D7000F',
					color: '#ffffff',
					marginBottom: '84rpx'
				},
				btnStyle1: {
					background: '#FFE8E6',
					color: '#ffffff',
					marginBottom: '84rpx'
				},
				btnStyle2: {
					background: '#ffffff',
					color: '#D7000F',
					marginBottom: '84rpx'
				},
				labelStyle: {
					fontSize: '32rpx',
					fontFamily: 'PingFangSC-Medium, PingFang SC',
					fontWeight: '500',
					color: '#333333'
				},
				actionSheetList: [{
						text: '公司'
					},
					{
						text: '个人'
					}
				],
				show: false,
				form: {
					nameType: '',
					companyName: '',
					companyLegalPerson: '',
					LegalPersonNumber: '',
					contactPerson: '',
					contactMobileNumber: '',
					companyWeb: '',
					companyDetails: '',
					businessLicense: '',
					storeName: '',
					password: ''
				},
				rules: {
					nameType: [{
						required: true,
						message: '请选择用户类型',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					companyName: [{
						required: true,
						message: '请填写姓名',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					companyLegalPerson: [{
						required: true,
						message: '请填写公司法人',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					LegalPersonNumber: [{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// this.$u.test.mobile()就是返回true或者false的
							return this.$u.test.idCard(value);
						},
						message: '身份证号码不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}],
					contactMobileNumber: [{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// this.$u.test.mobile()就是返回true或者false的
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}],
					storeName: [{
						required: true,
						message: '请填写店铺名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					password: [{
							required: true,
							message: '请填写商家端密码',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						{
							min: 6,
							message: '密码长度最少6位'
						},
					],
				}
			}
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		methods: {
			goIndex() {
				this.$routers.switchTab('index')
			},
			resetEdit() {
				this.typeRows = true
				// this.delAll();
			},
			delAll() {
				this.form = {
					nameType: '',
					companyName: '',
					companyLegalPerson: '',
					LegalPersonNumber: '',
					contactPerson: '',
					contactMobileNumber: '',
					companyWeb: '',
					companyDetails: '',
					businessLicense: '',
					storeName: '',
					password: ''
				}
			},
			goAgreement() {
				console.log('去协议页面~~');
			},
			async queryType() {
				const res = await http.get(merchantOnboarding.queryUserinfoapplyPageByUser);
				console.log(res, '99');
				if (res.rows.length) {
					this.dataState = res.rows[0].dataState
					this.typeRows = false
				}
			},
			submit() {
				this.$refs.uForm.validate( async valid => {
					if (valid) {
						console.log('验证通过');
						const params = {
							userinfoType : this.form.nameType === '公司'? 2 : 1, //2 公司 1个人
							
							userinfoCompname : this.form.companyName, //公司名称
							
							userinfoCorp : this.form.companyLegalPerson, //公司法人
							
							userinfoCoid : this.form.LegalPersonNumber, //法人身份证号
							
							userinfoCon : this.form.contactPerson, //联系人
							
							userinfoConPhone : this.form.contactMobileNumber, //联系人手机号
							
							webSiteUrl : this.form.companyWeb, //公司网站
							
							companyAddress : this.form.companyDetails, //公司详细地址
							
							userinfoCertUrl : this.form.businessLicense, //营业执照
							
							shopdeName : this.form.storeName //店铺名称
						}
						console.log(params, '验证通过params');
						const res = await http.post(merchantOnboarding.saveUmUserinfoapplytoMerchant,params)
						console.log(res, '已提交res');
						if(res.success) {
							this.delAll();
							this.queryType()
						}else{
							this.$message.alert(res.msg)
						}
					} else {
						console.log('验证失败');
					}
				});
			},
			actionSheetCallback(index) {
				this.form.nameType = this.actionSheetList[index].text;
			},
			checkboxChange(e) {
				//console.log(e);
			},
			delImg() {
				this.form.businessLicense = '';
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
						uni.showLoading({
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
						cookie: uni.getStorageSync('miniToken') + '=' + uni.getStorageSync('sessionid'),
						'saas-Agent': 'qj-wemini'
					},
					// #endif
					success: function(res) {
						console.log(JSON.parse(res.data).fileUrl, 'fileUrl');
						that.$set(that.form, 'businessLicense', that.$domain + JSON.parse(res.data).fileUrl);
						//that.invoice.userinvImgurl = that.$domain+JSON.parse(res.data).fileUrl;
					},
					fail: function(res) {
						uni.hideLoading();
						uni.showModal({
							//title: '提示',
							content: '上传图片失败',
							showCancel: false,
							success: function(res) {}
						});
					},
					complete: function() {
						i++;
						if (i == upLength) {
							uni.hideLoading();
						} else {
							that.upLoad(imgPath, i, upLength);
						}
					}
				});
			},
		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
			this.queryType()
		}
	}
</script>

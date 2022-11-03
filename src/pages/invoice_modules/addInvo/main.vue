<template>
	<div class="addInvoice">
		<div
			class="addInvoice-save"
			@click="
				() => {
					isEdit = true;
				}
			"
			v-show="show"
		>
			编辑
		</div>
		<div class="addInvoice-info">
			<ul>
				<li>
					单位名称
					<input placeholder="请输入单位名称" v-model="invoice.userinvMember" :disabled="isEdit || !show ? false : true" />
				</li>
				<li>
					纳税人识别码
					<input placeholder="请输入纳税人识别码" v-model="invoice.userinvNo" :disabled="isEdit || !show ? false : true" />
				</li>
				<li>
					开票地址
					<input placeholder="请输入开票地址" v-model="invoice.userinvAdd" :disabled="isEdit || !show ? false : true" />
				</li>
				<li>
					开票电话
					<input type="text" placeholder="请输入开票电话" v-model="invoice.userinvPhone" :disabled="isEdit || !show ? false : true" />
				</li>
				<li>
					开户行
					<input placeholder="请输入开户行" v-model="invoice.userinvBankname" :disabled="isEdit || !show ? false : true" />
				</li>
				<li>
					账号
					<input placeholder="请输入账号" v-model="invoice.userinvBankno" :disabled="isEdit || !show ? false : true" />
				</li>
				<li>
					<div class="dd-img" v-if="invoice.userinvImgurl">
						<i class="iconfont" @click="delImg">&#xe600;</i>
						<img :src="invoice.userinvImgurl" />
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
				<li>
					收票人姓名
					<input placeholder="请输入收票人姓名" v-model="invoice.userinvUname" :disabled="isEdit || !show ? false : true" />
				</li>
				<li>
					收票人手机
					<input type="number" placeholder="请输入收票人手机" v-model="invoice.userinvUphone" :disabled="isEdit || !show ? false : true" />
				</li>
				<li>
					收票人地址
					<input placeholder="请输入收票人地址" v-model="invoice.userinvUadd" :disabled="isEdit || !show ? false : true" />
				</li>
			</ul>
		</div>
		<p :style="{ color: baseColor }">*我们会在一个工作日内完成审核工作。</p>
		<p :style="{ color: baseColor, marginBottom: '108rpx' }">*注意有效增值税发票开票资质仅为一个。</p>
		<div class="addInvoice-btn" :style="{ background: baseColor }" @click="saveInfo" v-show="isEdit || !show">提交审核</div>
	</div>
</template>

<script>
import http from '@/api/http.js';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';
import { invoice, uploadGoodsFile } from '@/api/interface.js';
export default {
	data() {
		return {
			leftIcon: true,
			rightIcon: false,
			isEdit: false,
			srcImg: '',
			invoice: {},
			show: false,
			beforeInvoice: {},
			myInvoice: '' //我的发票菜单
		};
	},
	onShow(){
		// #ifdef H5
		this.$routers.refreshH5();
		// #endif
	},
	mounted() {
		console.log(this.$state.moreToolList, 'this.$state.moreToolList');
		this.$state.moreToolList.map(v => {
			if (v.menuAction == 'myInvoice') {
				this.myInvoice = v.menuJspath;
			}
		});
		http.get(invoice.checkAuditing).then(res => {
			this.beforeInvoice = res;
			if (!res.userinvId) {
				this.show = false;
			} else {
				this.show = true;
			}
			if (res && res.userinvId) {
				http.get(invoice.getInfo, { userinvId: res.userinvId }).then(res => {
					if (res) {
						this.invoice = res;
					}
				});
			}
		});
	},
	methods: {
		delImg() {
			this.invoice.userinvImgurl = '';
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
					that.$set(that.invoice, 'userinvImgurl', that.$domain + JSON.parse(res.data).fileUrl);
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
		saveInfo() {
			this.invoice.userinvType = '2';
			if (!this.invoice.userinvMember) {
				$message.alert('请填写单位名称');
			} else if (!this.invoice.userinvNo) {
				$message.alert('请填写纳税人识别码');
			} else if (!this.invoice.userinvAdd) {
				$message.alert('请填写开票地址');
			} else if (!this.invoice.userinvPhone) {
				$message.alert('请填写开票电话');
			} else if (!this.invoice.userinvBankname) {
				$message.alert('请填写开户行');
			} else if (!this.invoice.userinvBankno) {
				$message.alert('请填写账号');
			} else {
				if (this.show) {
					this.invoice.dataState = '0';
					http.get(invoice.editInfo, this.invoice).then(res => {
						if (res && res.success) {
							// $message.alert('编辑增票资质成功！');
							$message.alert('提交成功！');
							$routers.back(1, {
								success: '',
								fail: '',
								complete: '',
								stay: 1500
							});
							// $routers.replace(this.myInvoice);
						} else {
							$message.alert(res.msg);
						}
					});
				} else {
					http.get(invoice.increasedinvoice, this.invoice).then(res => {
						if (res && res.success) {
							// $message.alert('新增增票资质成功！');
							$message.alert('提交成功！');
							$routers.back(1, {
								success: '',
								fail: '',
								complete: '',
								stay: 1500
							});
							// $routers.replace(this.myInvoice);
						} else {
							$message.alert(res.msg);
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
.addInvoice {
	width: 100%;
	padding-top: 90rpx;
	&-save {
		position: fixed;
		color: red;
		z-index: 99999;
		height: 90rpx;
		width: 70rpx;
		line-height: 90rpx;
		text-align: right;
		right: 30rpx;
		top: 0;
		font-size: @big-title;
	}
	&-info {
		ul {
			padding: @padding-30;
			li {
				border-bottom: 1rpx solid #f6f6f8;
				height: 90rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: @big-title;
				color: #333;
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
				&:nth-child(7) {
					height: 180rpx;
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
					h4 {
						margin: 30rpx 0;
						font-size: 28rpx;
						padding-left: 30rpx;
					}
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
			}
		}
	}
	p {
		font-size: @middle-title;
		color: #b79f77;
		padding: @padding-30;
		margin-top: 10rpx;
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

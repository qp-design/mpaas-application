<template>
	<view>
		<u-cell-group class="cell-group">
			<u-cell-item title="用户名称" :value="formData.nickName" :arrow="false" :title-style="{'font-size':'32rpx'}"
				:value-style="{'color':'#888E9B','font-size':'32rpx'}"></u-cell-item>
			<u-cell-item title="性别" :value="formData.gender | genderFormat" :title-style="{'font-size':'32rpx'}"
				:value-style="{'color':'#1C253A','font-size':'32rpx'}" @click="()=>{isSelectShow = true}"></u-cell-item>
			<u-cell-item title="生日" :value="formData.birthday | formatTimes" :title-style="{'font-size':'32rpx'}"
				:value-style="{'color':'#1C253A','font-size':'32rpx'}" @click="()=>{isTimeShow = true}"></u-cell-item>
		</u-cell-group>
		<!-- 时间选择 -->
		<u-select v-model="isSelectShow" :list="genderList" @confirm="confirmEvent($event, 'gender')"></u-select>
		<u-picker mode="time" v-model="isTimeShow" @confirm="confirmEvent($event, 'birthday')"></u-picker>
		<u-toast ref="uToast" />
		<div class="submit-btn" @click="submit">保存</div>
	</view>
</template>

<script>
	import http from '@/api/http.js';
	import {
		mine
	} from '@/api/newApi.js';
	import {
		formatTimes
	} from '@/utils/prototype/date.js'
	export default {
		data() {
			return {
				userinfo: {},
				isSelectShow: false,
				isTimeShow: false,
				genderList: [{
						value: '0',
						label: '保密'
					},
					{
						value: '1',
						label: '男'
					},
					{
						value: '2',
						label: '女'
					}
				],
				formData: {
					nickName: '',
					gender: '0',
					birthday: ''
				}
			}
		},
		filters: {
			formatTimes(val) {
				if (!val) {
					return '请选择'
				}
				return formatTimes(val)
			},
			genderFormat(val) {
				if (!val) {
					return '请选择'
				}
				let str = ''
				val == 0 && (str = '保密')
				val == 1 && (str = '男')
				val == 2 && (str = '女')
				return str
			}
		},
		watch: {
			// #ifdef H5
			isSelectShow(n, o) {
				if (!n) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			},
			// #endif
			// #ifdef H5
			isTimeShow(n, o) {
				if (!n) {
					let dom = document.querySelectorAll('.u-drawer');
					for (var i = 0; i < dom.length; i++) {
						dom[i].style.display = 'none';
					}
				}
			}
			// #endif
		},
		onShow() {
			// #ifdef H5
			this.$routers.refreshH5();
			// #endif
		},
		onLoad() {
			this.init()
		},
		methods: {
			init() {
				// #ifdef MP-WEIXIN
				let obj = this.$storage.get('userInfo')
				this.formData.nickName = obj.nickName
				// #endif
				http.get(mine.getUserinfoDearler).then((res) => {
					if (res) {
						// #ifdef H5

						let obj = this.$storage.get('loginInfor')
						this.formData.nickName = obj.userName
						// #endif
						this.userinfo = res
						if(this.userinfo.umUserReDomainBean) {
							this.formData.gender = this.userinfo.umUserReDomainBean.userSex
							this.formData.birthday = this.userinfo.umUserReDomainBean.userBirthday
						}
						// res.umUserinfoQuaDomainList &&
						// 	Array.isArray(res.umUserinfoQuaDomainList) &&
						// 	res.umUserinfoQuaDomainList.forEach((item) => {
						// 		this.formData[item.userinfoQuaKey] = item.userinfoQuaVaule
						// 	})
					}
				})
			},
			confirmEvent(e, key) {
				let val = null
				if (key == 'gender') {
					val = e[0].value
				} else if (key == 'birthday') {
					val = e.year + '-' + e.month + '-' + e.day
				}
				this.formData[key] = val
			},
			async submit() {
				let params = {
					userinfoId: this.userinfo.userinfoId,
					userinfoCode: this.userinfo.userinfoCode,
					umUserReDomainBean: {
						userSex:this.formData.gender,
						userBirthday: this.formData.birthday,
						userId:this.userinfo.umUserReDomainBean && this.userinfo.umUserReDomainBean.userId
				    },
				}
				console.log('paramsparams',params)
				const res = await http.post(mine.updateUserinfoForUser, {
					userinfoserviceDomainBean: JSON.stringify(params)
				})
				if (res.success) {
					this.$refs.uToast.show({
						title: '保存成功',
						type: 'success'
					})
					this.init()
					this.$routers.back()
				}
			}
		}

	}
</script>

<style>
	.submit-btn {
		background-color: #EB2B27;
		width: 700rpx;
		position: fixed;
		z-index: 1;
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

/* eslint-disable no-console */

import {
	$storage,
	$message,
	$routers
} from '@/utils/prototype/vue.js'

import qs from 'qs'

const Fly = require('flyio/dist/npm/wx')
import { domain } from '@/api/configCheck.js'
class HTTP {
	constructor() {
		this.xhr = new Fly()
		this.xhr.config = {
			// baseURL: wx.getExtConfigSync().attr.domain,
			baseURL: domain,
			parseJson: false,
			timeout: 60000,
			withCredentials: true
		}

		// 添加请求拦截器
		this.xhr.interceptors.request.use(
			opts => {
				uni.showLoading({
					title:"加载中",
					mask:true
				})
				return opts
			},
			function(error) {
				return Promise.reject(error)
			}
		)

		// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
		this.xhr.interceptors.response.use(
			response => {

				if (response.headers['saas-cookiekey']) {
					$storage.set('miniToken', response.headers['saas-cookiekey'])

				}
				if (response.headers['saas-proappenv']) {
					$storage.set('proappenv', response.headers['saas-proappenv']);
				}
				if (response.data.errorCode == 'nologin') {
					// #ifdef H5
					$storage.remove('userId')
					$storage.remove('sessionid')
					$storage.remove('addressValue')
					$storage.remove('loginInfor')
					// #endif
					// 这里展示一个可操作的提示框，以防造成用户取消登录返回到上一个界面的循环问题
					// zhuxiaoyong 
					// uni.clearStorageSync()
					if (!getApp().globalData.isShowingLoginModal) {
						getApp().globalData.isShowingLoginModal = true
						uni.showModal({
							title: '提示',
							content: '请先登录',
							confirmColor: '#' + $storage.get('baseColor'),
							success(res) {
								let pages = getCurrentPages()
								if (res.confirm) {
									let currentPage = pages[pages.length - 1]
									let redirectUrl = currentPage.route.replace('pages/', '').replace('/main', '')
									// #ifndef H5
									$routers.push('login')
									// #endif
									// #ifdef H5
									$routers.push('/pages/login/main-h5')
									// #endif
								} else if (res.cancel) {
									// if (pages.length > 1) {
									// 	$routers.back()
									// }
								}
								getApp().globalData.isShowingLoginModal = false 
							}
						})
					}

				}
				return response
			},
			error => {
				return Promise.resolve(error.response)
			}
		)
	}
	request(opts) {
		let saasAgent = getApp().globalData.saasAgent;
		opts.headers = opts.headers || {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
			// #ifndef H5
			'saas-Agent': saasAgent
			// #endif
		}
		// #ifndef H5
		let cookie = uni.getStorageSync('sessionid')
		if (cookie) {
			opts.headers.cookie = uni.getStorageSync('miniToken') + '=' + cookie
		}
		// #endif
		if (uni.getStorageSync('saas-proappcode')) {
			opts.headers['saas-proappcode'] = uni.getStorageSync('pcode')
		}
		if (uni.getStorageSync('saas-tenantcode')) {
			opts.headers['saas-tenantcode'] = uni.getStorageSync('tcode')
		}
		return this.xhr
			.request(opts)
			.then(resp => this.log(resp, opts.url))
			.then(this.checkStatus)
	}
	get(url, data, opts) {
		// $message.loading()
		opts = opts || {}
		opts.method = 'get'
		opts.url = url
		opts.body = data
		return this.request(opts)
	}
	post(url, data, opts) {
		if (!RegExp(/queryShoppingToContract/).test(url) ||
			!RegExp(/calculateFreightFare/).test(url) ||
			!RegExp(/getTotalDiscountPrice/).test(url) ||
			!RegExp(/saveOrderToPay/).test(url) ||
			!RegExp(/paymentCommit/).test(url) ||
			!RegExp(/getUpmupointsPageByPC/).test(url) ||
			!RegExp(/queryUsercouponNember/).test(url) ||
			!RegExp(/checkVATowap/).test(url) ||
			!RegExp(/queryShopdeByMerchant/).test(url)

		) {
			//   $message.loading()
		}
		opts = opts || {}
		opts.method = 'post'
		opts.url = url
		opts.body = qs.stringify(data)
		return this.request(opts)
	}

	// 如果网络请求错误，给返回错误码
	checkStatus(response) {
		if (response && response.status === 200) {
			$message.hide()
			return response.data
		}else if(response&&response.status!=200){
			$message.alert('网络问题...')
		}else{
			$message.alert('请求超时')
		}
		
		
	}
	// 打印日志
	log(response, url) {
		if (global.isDebugger) {
			console.info('==================================================================================================')
			console.info('请求接口：' + url)
			console.info('请求参数：' + JSON.stringify(response.request.body))
			console.info('接口返回：')
			console.info(response.data)
		}
		return response
	}
}

export default new HTTP()

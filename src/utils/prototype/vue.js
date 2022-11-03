/**
 * 拼接小程序路径
 * @param {*} url
 * @param {*} query
 */
function debounce(func, wait) {
	let timeout;
	return function() {
		const context = this;
		const args = [...arguments];
		if (timeout) clearTimeout(timeout);
		const callNow = !timeout;
		timeout = setTimeout(() => {
			timeout = null;
		}, wait);
		if (callNow) func.apply(context, args);
	};
}

function $$placeholder(val, loading, count) {
	let Str = ' '
	if (typeof val === 'object') {
		if (!val.length && loading) {
			let ary = new Array(count)
			return ary
		} else {
			return val
		}
	} else {
		if (!val && loading) {
			let pl = new Array(count);
			pl.fill(Str);
			let str = pl.join('');
			pl = null;
			return str;
		} else {
			return val
		}
	}


}

function setUrl(url, query) {
	if (!(url.indexOf('pages') !== -1)) {
		url = '/pages/' + url + '/main'
	}
	// #ifdef H5
	let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
	let fatherRoute = routes[routes.length - 1].route //获取当前页面路由
	// let fatherParam = routes[routes.length - 1].options; //获取路由参数
	if ($storage.get('olUrl')) {
		let ourls = $storage.get('olUrl')
		ourls[ourls.length] = {
			olUrl: fatherRoute
		}
		$storage.set('olUrl', ourls)
	} else {
		$storage.set('olUrl', [{
			olUrl: fatherRoute
		}])
	}
	// #endif

	if (query) {
		let q = []
		Object.keys(query).map(key => {
			q.push(`${key}=${query[key]}`)
		})
		url += '?' + q.join('&')
	}
	return url
}

function toFix(num1, num2, num3) {
	num1 = Number(num1)
	if (num1 == undefined || num1 == null) {
		return num1;
	} else {
		if (num3 == 1) {
			return toSub(num1.toFixed(num2), 1);
		} else if (num3 == 2) {
			return toSub(num1.toFixed(num2), 2);
		} else {
			return num1.toFixed(num2);
		}
	}
}

function toSub(str, num) {
	let res = (str + '').split('.');
	if (num == 1) {
		return res[0];
	}
	if (num == 2) {
		return res[0] + '.' + res[1];
	}
}

function percent2percent25(URI) {
	undefined
	if (URI.indexOf('%') > -1) {
		undefined
		return URI.replace(/%/g, '%25')
	} else {
		undefined
		return URI;
	}
}

/**
 * 模拟路由，包括
 * 添加、替换、回退、重新打开
 */
const $routers = {
	// 打开另一个页面
	push: (url, query, {
		success,
		fail,
		complete,
		stay
	} = {}) => {
		const timer = setTimeout(() => {
			clearTimeout(timer)
			url = setUrl(url, query)
			console.log(url, 'push')
			uni.navigateTo({
				url,
				success,
				fail,
				complete
			})
		}, stay || 0)
	},
	push1: (url, query, {
		success,
		fail,
		complete,
		stay
	} = {}) => {
		const timer = setTimeout(() => {
			clearTimeout(timer)
			url = setUrl(url, query)
			window.location.hash = '#' + url
		}, stay || 0)
	},
	switchTab: (url, query, {
		success,
		fail,
		complete,
		stay
	} = {}) => {
		const timer = setTimeout(() => {
			clearTimeout(timer)
			url = setUrl(url, query)
			console.log(url, 'switchTab')
			// #ifndef H5
			uni.switchTab({
				url,
				success,
				fail,
				complete
			})
			// #endif
			// #ifdef H5
			window.location.hash = '#' + url
			// #endif
		}, stay || 0)
	},
	// 跳转到另一个页面
	replace: (url, query, {
		success,
		fail,
		complete,
		stay
	} = {}) => {
		const timer = setTimeout(() => {
			clearTimeout(timer)
			url = setUrl(url, query)
			uni.redirectTo({
				url,
				success,
				fail,
				complete
			})
		}, stay || 0)
	},
	// 页面回退
	back: (delta = 1, {
		success,
		fail,
		complete,
		stay = 0
	} = {}) => {
		console.log(stay)
		const timer = setTimeout(() => {
			clearTimeout(timer)
			// #ifndef H5
			uni.navigateBack({
				delta,
				success,
				fail,
				complete
			})
			// #endif
			// #ifdef H5
			window.history.back()
			// #endif
		}, stay)
	},
	// 关闭所有页面，重新打开一个页面
	reOpen: (url, query, {
			success,
			fail,
			complete,
			stay
		} = {}) => {
			console.log(url)
			const timer = setTimeout(() => {
				clearTimeout(timer)
				url = setUrl(url, query)
				uni.reLaunch({
					url,
					success,
					fail,
					complete
				})
			}, stay || 0)
		}
		// #ifdef H5
		,
	refresh: () => {
		location.reload();
	},
	refreshH5: () => {
		let ourls = $storage.get('olUrl')
		let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
		let nurl = routes[routes.length - 1].route //获取当前页面路由
		if (ourls.length > 0) {
			if (ourls[ourls.length - 1].olUrl === nurl) {
				$routers.refresh()
				ourls.pop()
				$storage.set('olUrl', ourls)
				$storage.set('newUrl', '')
			} else {
				let newUrl = $storage.get('newUrl')
				if (newUrl == '' || ourls[ourls.length - 1].olUrl === newUrl) {
					$routers.refresh()
					$storage.set('newUrl', nurl)
				}
			}
		}
		let dom = document.querySelectorAll('.uni-system-preview-image');
		if (dom.length) {
			$routers.refresh()
		}
	},
	// #endif
}

/**
 * 缓存操作
 */
const $storage = {
	get: key => {
		return uni.getStorageSync(key)
	},
	set: (key, value) => {
		uni.setStorageSync(key, value)
	},
	remove: key => {
		uni.removeStorageSync(key)
	},
	// #ifdef H5
	sessionGet: key => {
		return window.sessionStorage.getItem(key)
	},
	sessionSet: (key, value) => {
		return window.sessionStorage.setItem(key, value)
	}
	// #endif
}

/**
 * 消息弹出，模拟vue的消息弹窗
 */
const $message = {
	alert: (title, {
		stay = 1500,
		success = () => {},
		mask = false,
		icon = 'none'
	} = {}) => {
		// #ifdef H5
		$message.show()
		// #endif
		uni.showToast({
			title,
			icon,
			duration: stay,
			success,
			mask
		})
		// #ifdef H5
		setTimeout(() => {
			$message.hide()
		}, stay)
		// #endif
	},
	success: (title = '未设置内容', {
		stay = 1500,
		success = () => {},
		mask = false
	} = {}) => {
		$message.alert(title, {
			stay,
			success,
			mask,
			icon: 'success'
		})
	},
	loading: (title = '加载中', mask = false) => {
		uni.showLoading({
			title,
			mask
		})
	},
	hide: () => {
		// #ifdef H5
		let dom = document.querySelectorAll('.uni-toast');
		for (var i = 0; i < dom.length; i++) {
			dom[i].style.display = 'none';
		}
		let dom1 = document.querySelectorAll('.uni-mask');
		for (var i = 0; i < dom1.length; i++) {
			dom1[i].style.display = 'none';
		}
		let dom2 = document.querySelectorAll('.uni-sample-toast');
		for (var i = 0; i < dom2.length; i++) {
			dom2[i].style.display = 'none';
		}
		// #endif
		// #ifndef H5
		uni.hideLoading()
		// #endif
	},
	show: () => {
		// #ifdef H5
		let dom = document.querySelectorAll('.uni-toast');
		for (var i = 0; i < dom.length; i++) {
			dom[i].style.display = '';
		}
		let dom1 = document.querySelectorAll('.uni-mask');
		for (var i = 0; i < dom1.length; i++) {
			dom1[i].style.display = '';
		}
		// #endif
	}
}
// 设置标题
function setTitle(title) {
	uni.setNavigationBarTitle({
		title
	})
}

export {
	$routers,
	$storage,
	$message,
	setTitle,
	toFix,
	debounce,
	percent2percent25,
	$$placeholder
}

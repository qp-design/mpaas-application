import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import {
	$routers,
	$storage,
	$message,
	setTitle,
	toFix,
	debounce,
	percent2percent25,
	$$placeholder
} from './utils/prototype/vue'
import $store from './store'
import '@/assets/font/iconfont.css';
import '@/assets/font/newfont.css';
import {
	domain,
	imgDomain,
	businessDomain
} from '@/api/configCheck.js'
//在 main.js中引入使用
import mixin from "@/global.js"
Vue.use(mixin)


Vue.use(uView);
Vue.config._mpTrace = true
$store.state.get = key => {
	return $store.getters[key]
}
$store.state.set = (key, value, isSave) => {
	$store.commit('set', {
		key,
		value,
		isSave
	})
}

$store.state.set('$domain', domain)
$store.state.set('$imgDomain', imgDomain)
$store.state.set('$businessDomain', businessDomain)
Vue.prototype.$store = $store
Object.defineProperties(Vue.prototype, {
	$domain: {
		value: domain
	},
	$imgDomain: {
		value: imgDomain
	},
	$businessDomain: {
		value: businessDomain
	},
	$routers: {
		value: $routers
	},
	$storage: {
		value: $storage
	},
	$message: {
		value: $message
	},
	$setTitle: {
		value: setTitle
	},
	$toFix: {
		value: toFix
	},
	$debounce: {
		value: debounce
	},
	$state: {
		value: $store.state
	},
	$percent2percent25: {
		value: percent2percent25
	},
	$$placeholder: {
		value: $$placeholder
	}
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

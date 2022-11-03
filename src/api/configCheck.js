// #ifdef MP-WEIXIN
const {
	domain,
	imgDomain,
	businessDomain
} = require('@/config-lphtest.json')
// #endif

// #ifdef TEST
const {
	domain,
	imgDomain,
	businessDomain
} = require('@/config.json')
// #endif

// #ifdef H5
let origins = window.location.origin
const {
	domain,
	imgDomain,
	businessDomain,
}=origins.indexOf('localhost')!==-1?require('@/config-H5.json'):{domain: origins, imgDomain: origins, businessDomain: origins}
// #endif

// #ifdef MP-ALIPAY
const {
	domain,
	imgDomain,
	businessDomain
} = require('@/config-ali.json')
// #endif

// #ifdef MP-TOUTIAO
const {
	domain,
	imgDomain,
	businessDomain
} = require('@/config-bytedance.json')
// #endif
export {
	domain,
	imgDomain,
	businessDomain
}
export default {
	domain,
	imgDomain,
	businessDomain
}

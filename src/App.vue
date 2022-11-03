<script>
import addDatePrototypes from './utils/prototype/date';
import addObjectPrototype from './utils/prototype/object';
import addStringPrototype from './utils/prototype/string';
import { $storage, $routers, $message } from '@/utils/prototype/vue.js';

export default {
	globalData: {
		// 控制登录弹窗，为true的时候不能再弹出第二个弹窗
		isShowingLoginModal: false,

		// 条件编译不同终端的请求头saas-Agent
		// #ifdef MP-TOUTIAO
		saasAgent: 'qj-bytedance',
		// #endif

		// #ifdef MP-WEIXIN
		saasAgent: 'qj-wemini',
		// #endif

		// #ifdef MP-ALIPAY
		saasAgent: 'qj-alistore'
		// #endif
	},
	onLaunch() {
		global.isDebugger = false;
		wx.getSystemInfo({
			success: res => {
				this.$set({
					key: 'isIphoneX',
					value: res.model.indexOf('iPhone X') > -1
				});
			}
		});
		// 添加日期的prototype
		addDatePrototypes();
		// 添加object的prototype
		addObjectPrototype();
		// 添加string的prototype
		addStringPrototype();
	},
	onShow() {},
	onHide() {}
};
</script>

<style lang="scss">
	
@import 'uview-ui/index.scss';
@import './common/css/common.css';
@import './assets/font/icon.css';

img {
	content: normal !important;
}

*:not(input) {
	//iphone 上显示不出来的问题
	-webkit-user-select: none;
}

input {
	overflow: hidden;
}

html {
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
}

body {
	position: relative;
	overflow-x: hidden;
	min-height: 100%;
	display: flex;
	flex-direction: column;
}

html,
body,
#app {
	width: 100%;
	height: 100%;
}

/* #ifdef MP-ALIPAY */
html,
body,
#app {
	width: 100%;
	height: 100vh;
}
/* #endif */

* {
	padding: 0;
	margin: 0;
	-webkit-overflow-scrolling: touch;
	-webkit-tap-highlight-color: transparent;
	-webkit-user-select: none;
}

body,
dd,
dl,
dt,
fieldset,
form,
h1,
h2,
h3,
h4,
h5,
h6,
html,
img,
legend,
li,
ol,
p,
ul {
	margin: 0;
	padding: 0;
	-moz-user-select: none;
	-webkit-user-select: none;
	-webkit-tap-highlight-color: transparent;
}

button,
fieldset,
img,
input {
	border: none;
	padding: 0;
	margin: 0;
	outline-style: none;
}

ol,
ul {
	list-style: none;
}

input {
	padding-top: 0;
	padding-bottom: 0;
	// font-family: "SimSun", "宋体";
}

input,
select {
	vertical-align: middle;
}

textarea {
	resize: none;
}

input,
textarea {
	-webkit-touch-callout: text;
	-webkit-user-select: text;
}
li{
	list-style-type: none;
}
/*防止拖动*/
img {
	border: 0;
	vertical-align: middle;
}

/*  去掉图片低测默认的3像素空白缝隙*/
table {
	border-collapse: collapse;
}

//去斜体
i {
	font-style: normal;
}

body {
	font-size: 26rpx;
	background: #fff;
	color: #333;
}

a {
	text-decoration: none;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	text-decoration: none;
	font-weight: normal;
	font-size: 100%;
}

.nav {
	width: 100%;
	overflow: hidden;
	position: relative;
	top: 0;
	left: 0;
	z-index: 999999;
}

.nav-title {
	width: 100%;
	height: 45px;
	line-height: 45px;
	text-align: center;
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 999999;
	font-family: PingFang-SC-Medium;
	font-size: 36rpx;
	letter-spacing: 2px;
}

.nav .back {
	width: 22px;
	height: 22px;
	position: absolute;
	bottom: 0;
	left: 0;
	padding: 10px 15px;
}

.bg-white {
	background-color: #ffffff;
}

.bg-gray {
	background-color: #f7f7f7;
}

.overflow {
	overflow: auto;
}

.hidden {
	overflow: hidden;
}
</style>

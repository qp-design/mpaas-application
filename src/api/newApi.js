export const index = {
	// floors: "/web/cms/conttitleBusiness/queryConttitlePageSc.json", // 首页查询楼层列表
	floors: "/web/cms/conttitleBusiness/queryConttitleForSc.json", // 首页查询楼层列表11
	news: "/web/cms/notice/queryNoticePageForAt.json",// 轮播图下方新闻
	newsDetail: "/web/cms/notice/getNoticeForAt.json",// 新闻详情
	stores: "/web/cms/conttitleBusiness/queryShopdesContlistPageForSc.json", //首页店铺接口
	storesSales: "/web/rs/sku/querySkuFromSc.json",	//查询店铺下商品
	seckillGood:"/web/es/searchengine/find.json"  ,//查询秒杀商品
	 queryPromotionPageForC : '/web/pm/promotionplat/queryPromotionPageForC.json' ,// 首页秒杀商品
	 getSkuInfoByCode : '/web/rs/sku/getSkuInfoByCode.json' ,// 首页秒杀商品
}
export const mamber = {
	getUlLevelUpointsByUser: '/web/ul/ulLevelUllist/getUlLevelUpointsByUser.json', //查询用户会员等级接口
	queryUlLevelUllistPageByUser: '/web/ul/ulLevelUllist/queryUlLevelUllistPageByUser.json', //查询用户成长值流水
	queryNoticePageRule: '/web/cms/notice/queryNoticePageRule.json', //查询等级规则接口
	queryUserrightsPage: '/web/ur/userrights/queryUserrightsPage.json', //查询启用的权益配置
	getUlLevelByTenantCode: '/web/ul/ulLevel/getUlLevelByTenantCode.json', //查询查询用户会员等级页入口
}
export const shareResourceGoods = '/web/rs/resourceGoods/shareResourceGoods.json' //分享增加成长值
export const classes = {
	goodsClass: "/web/rs/rsGoodsClass/queryGoodsClassListChannelCode.json", //商品分类
	queryClasstreeByJd: "/web/rs/rsGoodsClass/queryGoodsClassListChannelCode.json", //商品分类
}
export const getProappEnvForPlate = 'web/tm/Tmcm/getProappEnvForPlate.json'
export const getProappinfo = '/web/ml/mlogin/getProappinfo.json'
//商品详情页
export const detail = {
	goodsDetail:"/web/rs/resourceGoods/getResourceGoodsInfoBySkuCode.json" ,//详情页面 G
	goodsOfStore:"/web/sc/shopde/queryShopdeByMerchant.json"  ,//查询商品归属店铺  G
	storeShow:"/web/rs/sku/querySkuFromSc.json" ,//店铺展示商品 P
	evaluateDetail:"/web/res/evaluate/queryEvaluateGoodsPageNew.json"  ,//商品评价 G
	// goodsOfActivity:"/web/pm/promotion/queryPromotionListByGoodsCode.json"  ,//商品可参与活动  G
	goodsOfActivity:"/web/pm/promotion/queryPromotionListBatchByGoodsCode.json"  ,//商品可参与活动  G
	goodsOfDiscount:"web/pm/promotion/queryCouponListBySkuCode.json"  ,//商品可参与优惠券  G
    getCoupons:"/web/pm/usercoupon/saveUsercoupon.json"   ,//领取优惠券  P
	saveFootprints:"/web/um/footprint/saveFootprint.json"  ,//保存足迹 P
	checkCollection:"/web/um/collect/checkCollectExit.json"  ,//检查用户是否收藏  G
	goodsCollection:"/web/um/collect/saveCollect.json"  , //商品收藏    P
	cancelCollection:"/web/um/collect/deleteCollectByCode.json"  ,//取消收藏  ?
	addCart:"/web/oc/shopping/addShoppingGoods.json"  ,//点击加入购物车    P
	shopping:"/web/oc/shopping/queryToContract.json"  ,//商品详情直接购买   G
	jdStock:"/web/oc/contract/getNewStockByIdToVop.json", //京东商品库存 P
	goodsVolume:"/web/oc/contract/queryContractGoodsSum.json",  //获取商品销量
	queryOcserviceConfPageByMember: "/web/ocs/ocservice/queryOcserviceConfPageByMember.json" ,//获取商品销量
}

//搜索页
export const search = {
	hotSearch:"/web/cms/tginfo/queryTginfoPage.json"   //热门搜索  G
}

//大数据埋点
export const buryspot = {
	collectData:"/web/es/searchengine/getToken.json"  //大数据 数据收集  G
}

export const mine = {
	mineDetail: "/web/mi/mindex/getTopPerMenuList.json",//个人中心
	getUserinfoDearler: "web/um/userserviceinfo/getUserinfoDearler.json", // 用户信息
	updateUserinfoForUser: "/web/um/userserviceinfo/updateUserinfoForUser.json" // 修改用户信息
}

export const car = {
	carDetail: "/web/oc/shopping/queryShoppingPage.json",//购物车
	carNum: "/web/oc/shopping/shoppingList.json",	//查询购物车商品数量
	addCar: "/web/oc/shopping/addShoppingGoods.json",	//添加到购物车
	checkChange: "/web/oc/shopping/updateShoppingGoodsCheckState.json",	//选中状态更新
	updateShoppingGoodsNum : "/web/oc/shopping/updateShoppingGoodsNum.json", // 修改购物车数量
	deleteSales: "/web/oc/shopping/deleteShoppingGoods.json", //删除购物车商品
	updateShoppingGoodsPmInfo:"/web/oc/shopping/updateShoppingGoodsPmInfo.json" // 更新购物车商品的营销信息
}

export const user = {	
	login: "/web/ml/mlogin/warrantyLogin.json",	//登录
	bindPhone: "/web/ml/mlogin/savephone.json"	//绑定手机号
}

export const coupon = {
	list: "/web/pm/usercoupon/queryUsercouponPageForC.json",
	queryCouponListBySkuCode:'/web/pm/promotion/queryCouponListBySkuCode.json?checkSku=1',
	saveUsercoupon:'/web/pm/usercoupon/saveUsercoupon.json'
}

export const bigdata = {
	index: "/web/es/searchengine/homePage.json",
	detail: "/web/es/searchengine/goodsDetails.json",
	car: "/web/es/searchengine/shopping.json",
	buy: "/web/es/searchengine/buyShopping.json",
	hobby: "/web/es/searchengine/interestStandby.json",
	seckill:'web/pm/promotionplat/queryPromotionPageForC.json?dataStateStr=4,1'

}

export const area = {
	road: "/web/bs/road/queryRoadPage.json",
	area: "/web/bs/area/queryAreaPage.json",
	province: "/web/bs/province/queryProvincePage.json"
}

//售后列表 or 详情
export const afterService = {
	serviceList:"/web/oc/refund/queryRefundPageBuy.json"   ,//售后商品列表  P
	serviceDetail:"/web/oc/refund/getRefundByCode.json",  //售后商品详情 P
	queryLogistics:"web/wl/express/queryExpressPageForProp.json"  ,//查询物流  P
	saveLogistics:"/web/oc/refund/sendGoods.json"    ,//保存物流 P
	revokeApply:"/web/oc/refund/res.json"  , //撤销申请  P
	queryVopRefundAtt:'/web/oc/refund/queryVopRefundAtt.json',
	salesType:"/web/oc/refund/queryVopRefundAtt.json" ,//京东商品售后类型  p
}

export const webMail = {
	getImsgPushmsgs: "/web/imsg/imsgPushmsg/getImsgPushmsgInformation.json"
}
export const noticeDetail = {
	noticeDetail: "/web/cms/notice/getNoticeForAt.json"
}
export const imageUpload = "/web/rs/goodsFile/uploadGoodsFile.json"
//忘记密码
export const getUserservice = "/web/um/userservice/getUserservice.json"
//获取验证码
export const sendPhone = "/web/ml/muser/sendPhone.json"
//校验验证码
export const checkVerificationMa = "/web/um/userservice/checkVerificationMa.json"
//修改密码
export const updateUserPaywd = "/web/um/userservice/updateUserPaywd.json"
export const getPromotionByCode = "/web/pm/promotion/getPromotionByCode.json"
export const findByGinfoCode = "/web/es/searchengine/findByGinfoCode.json"
export const checkSecondKillNum = "/web/pm/promotion/checkSecondKillNum.json"; //校验商品是否可以下单


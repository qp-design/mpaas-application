export const loginIn = "/web/ml/mlogin/loginIn.json"; // 登陆
export const layout = "/web/ml/mlogin/loginOut.json"; // 退出
export const updateUmuserPw = "/web/ml/muser/updateUmuserPw.json"; // 修改密码
export const changePwd = "/web/um/userservice/updateUserPaywd.json"; // 修改支付密码
export const CheckPaywd = "/web/um/userservice/checkPaywd.json"; // 是否有旧密码
export const couponLogin = "/web/ml/mlogin/warrantyLoginByCard.json"; // 是否有旧密码
export const getJdRefundComponent = " /web/oc/refund/getJdRefundComponent.json"; // vop售后
export const getTginfoPic = "/web/cms/tginfo/getTginfoPic.json"; // h5pc logo
export const getUlLevelUpointsByUserQuality = '/web/ul/ulLevelUllist/getUlLevelUpointsByUserQuality.json' //查询用户会员成长值
export const merchantOnboarding = {
	queryUserinfoapplyPageByUser : "/web/um/userservice/queryUserinfoapplyPageByUser.json", // 查询当前用户入驻申请记录
	saveUmUserinfoapplytoMerchant : "/web/um/userservice/saveUmUserinfoapplytoMerchant.json" // 申请商家入驻
}
export const getMonthRules = '/web/ul/ulLevel/accordingMonthQueryUlLevelListPageStrX.json' //获取月销售量

export const getMyPointsDetail = "/web/vd/vdfaccountouter/queryOuterFaccountDtByUserCode.json"; //福点余额详情
export const getMyPoints = "/web/vd/vdfaccountouter/queryAccountOuterByUser.json"; //我的福点
export const thirdLogin = "/web/ml/mlogin/thirdLoginInfo.json"; // 第三方登录 loginMicroMessenger.json
export const loginMicroMessenger = "/web/ml/mlogin/loginMicroMessenger.json"; // 微信授权
export const getProappinfo = "/web/ml/mlogin/getProappinfo.json"; // 获取tenantCode
// export const search = "/web/es/searchengine/find.json?vendibilityFlag=true&channelCode=busBBC"; // 搜索
export const search = "/web/es/searchengine/find.json?vendibilityFlag=true&childFlag=true"; // 搜索
export const queryShopdePage = "/web/sc/shopde/queryShopdePage.json"; // 搜索店铺
export const addressList = "/web/um/address/queryAddressBymerberCode.json"; // 获取地址列表
export const addAddress = "/web/um/address/saveAddress.json"; // 新增地址
export const getAddress = "/web/um/address/getAddress.json"; // 获取地址信息
export const updateAddress = "/web/um/address/updateAddress.json"; // 编辑地址
export const deleteAddress = "/web/um/address/deleteAddress.json"; // 删除地址
export const querySkuPage = "/web/rs/sku/querySkuFromJm.json?channelCode=busBBC "; // 

export const getGiftBag = "/web/gt/gift/queryGiftPageToC2.json"; //我的礼包
export const queryGiftRelPage = "/web/gt/giftRel/queryGiftRelPage.json"; //分页礼包列表
export const getMyCoupon = "/web/gt/gift/queryRelToC.json" //领取礼包
export const getMyCouponDetail = "/web/gt/gift/queryGiftUserRelToC.json" //福点查看详情
export const queryToContractCodeList = "/web/oc/shopping/queryToContractCodeList.json" //礼包详情

export const queryToContract = "/web/oc/shopping/queryToContract.json"; // 商品详情页直接下单

export const queryShoppingPage = "/web/oc/shopping/queryShoppingPage.json"; // 获取购物车列表
export const updateShoppingGoodsCheckState =
	"/web/oc/shopping/updateShoppingGoodsCheckState.json"; // 购物车商品是否勾选
export const updateShoppingGoodsNum =
	"/web/oc/shopping/updateShoppingGoodsNum.json"; // 修改购物车数量
export const queryShoppingToContract =
	"/web/oc/shopping/queryShoppingToContract.json"; // 购物车结算页面
export const deleteShoppingGoodsBatch =
	"/web/oc/shopping/deleteShoppingGoodsBatch.json"; // 购物车商品删除

export const calculateFreightFare =
	"/web/oc/contract/calculateFreightFare.json"; // 物流费用计算
export const getTotalDiscountPrice =
	"/web/ur/userrights/getTotalDiscountPrice.json"; // 用户权益差价计算

export const saveContract = "/web/oc/contract/saveContract.json"; // 增加订单服务
export const syncContractState = "/web/oc/contract/syncContractState.json"; // 查询订单是否创建成功（单条）
export const syncContractBatchState = "/web/oc/contract/syncContractBatchState.json"; // 查询订单是否创建成功（单条）

export const addContractSub = "/web/oc/contractSub/addContractSub.json"; // 新增付款金额
export const saveOrderSubToPay = "/web/pte/pay/saveOrderSubToPay.json"; // 分次支付下单
export const paymentCommit = "web/pte/pay/paymentCommit.json"; // 开始支付
export const syncContractPayState = "/web/oc/contract/syncContractPayState.json"; // 查看商品是否支付成功
export const syncContractBatchPayState = "/web/oc/contract/syncContractBatchPayState.json";
export const saveOrderToPay = "web/pte/pay/saveOrderToPay.json"; // 获取支付方式
export const saveOrderToBatchPay = "web/pte/pay/saveOrderToBatchPay.json"; // 获取支付方式

export const loginOut = "/web/ml/mlogin/loginOut.json"; // 获取支付方式

export const myOrder = {
	getStockBypromotionCode: "/web/pm/promotion/getStockBypromotionCode.json",
	queryContractPageBuiMat: "/web/oc/contract/queryContractPageBuiMat.json",
	queryPeopleNum: "/web/oc/contract/queryContractPageForPm.json", // 查看拼團人數
	getgoodsinfo: "/web/oc/contract/queryContractPageByABulk.json", // 查看拼團全部
	queryContractPage: "/web/oc/contract/queryContractPageC.json", // 查看全部订单
	delContractPage: "/web/oc/contract/deleteContract.json", // 删除订单接口
	cancelContractC: "/web/oc/contract/cancelContractC.json", // 取消订单
	confirmReceive: "/web/oc/contract/confirmReceive.json", // 确认收货
	queryContractGoodsPage: "/web/oc/contract/queryContractGoodsPage.json", // 搜索订单
	queryContractPageBySecKill: "/web/oc/contract/queryContractPageBySecKill.json", // 订单秒杀列表
	updateContractDelcode: "/web/oc/contract/updateContractDelcode.json" // 服务商核销提货吗
};

export const gift = {
	getCompGiftList: '/web/gt/gift/queryGiftPageToB2.json', // 查询企业我的的礼包列表
	getcompGiftRecordInfo: '/web/gt/gift/queryGiftUserByGiftUserCodeToB.json', //企业礼包发放记录查看详情
	getcompGiftRecord: '/web/gt/gift/queryGiftPageToBNotState2.json', //查询企业礼包发放记录
	getcompGiftInfo: '/web/gt/gift/queryGiftSendlistPageByGiftSendCodeToB.json', //企业礼包查询员工领取详情
	memberGiftall: '/web/gt/gift/queryGiftPageToC2.json', //查询员工礼包列表
	memberGiftdetail: '/web/gt/gift/queryRelToC.json', //员工领取礼包
	queryToContractCodeList: '/web/oc/shopping/queryToContractCodeList.json', //领取礼包
	getmemberGiftInfo: '/web/gt/gift/queryGiftUserRelToC.json', //查询员工礼包领取详情
	updateTransferaStateintegral: '/web/ta/Transfera/updateTransferaStateintegral.json', //过期兑换积分
	addShoppingGoodsCode: '/web/oc/shopping/addShoppingGoodsCode.json', //过期兑换商品
	updateGiftUserState: '/web/gt/giftUser/updateGiftUserState.json', //领取过期权益后更新状态
	receiveCard: '/web/cd/cardplist/receiveCard.json', //领取卡券
	cardreCharge: '/web/cd/cardplist/cardreCharge.json', //卡卷验证
	countEmployeeNotGetGift: '/web/gt/giftUser/countEmployeeNotGetGift.json', //(我的礼包)
	countCompanyNotSendGift: '/web/gt/giftUser/countCompanyNotSendGift.json' //礼包管理
}

// 退款退货
export const refund = {
	queryRefCause: "/web/oc/refund/queryRefCause.json", // 获取退款理由
	jDsaveRefund: "/web/oc/refund/jDsaveRefund.json", // 京东退款退货
	jDgetRefundByCode: "/web/oc/refund/jDgetRefundByCode.json", // 京东查看售后详情
	uploadRefFile: "/web/oc/refund/uploadRefFile.json", // 上传退货文件
	saveRefund: "/web/oc/refund/saveRefund.json", // 提交退款服务
	getRefundByCode: "/web/oc/refund/getRefundByCode.json", // 查看退货详情
	sendGoods: "/web/oc/refund/sendGoods.json", // 填写退货物流申请
	queryRefundPage: "/web/oc/refund/queryRefundPageBuy.json", // 查询所有的退货订单
	queryExpressPageForProp: "/web/wl/express/queryExpressPageForProp.json", // 获取物流
	getExpressPageForProp: "/web/wl/exporg/queryExpressInfo.json", // 获取物流详情
	getJDExpressPageForProp: "/web/oc/contract/getVopFreight.json", //获取京东物流详情
	revokeApply: "/web/oc/refund/res.json" // 申请撤销
};

export const addShoppingGoodsBySpec =
	"/web/oc/shopping/addShoppingGoodsBySpec.json"; // 再次购买
export const addShoppingGoods = "/web/oc/shopping/addShoppingGoods.json"; // 再次购买--加入购物车
export const getContractByCode = "/web/oc/contract/getContractByCode.json"; // 查看商品详情
export const queryUseTemplate = "web/res/template/queryUseTemplate.json"; // 获取模版
export const saveEvaluateGoods = "/web/res/evaluate/saveEvaluateGoods.json"; // 保存商品评价
export const saveEvaluateShop = "/web/res/evaluate/saveEvaluateShop.json"; // 保存店铺评价

export const queryBrandPageForC = "/web/rs/brand/queryBrandName.json"; // 品牌
export const evaluate = "/web/res/evaluate/queryEvaluateGoodsPage.json"; // 查看评论

export const collection = {
	queryCollectPage: "/web/um/collect/queryCollectPage.json", // 用户查询用户收藏信息分页列表
	deleteCollectByCode: "/web/um/collect/deleteCollectByCode.json", // 取消收藏
	deleteCollectByCodeStr: "/web/um/collect/deleteCollectByCodeStr.json"
};

export const history = {
	queryFootprintPagePlat: "/web/um/footprint/queryFootprintPagePlat.json", // 足迹列表
	deleteFootprintByCode: "/web/um/footprint/deleteFootprintByCode.json", // 取消足迹
	deleteAllFootprintByCode: "/web/um/footprint/deleteFootprintByCodeStr.json"
};
export const integral = {
	getMemberIntegralInfo: "/web/upm/upmupoints/getMemberIntegralInfo.json", // 我的积分
	getUpmupointsPageByPC: "/web/upm/upmupoints/getUpmupointsPageByPC.json", // 积分总额
	getRulePreview: "/web/upm/upmpoints/getRulePreview.json" // 积分规则
};

export const getAllComment =
	"/web/res/evaluate/queryEvaluateGoodsPageByUser.json"; // 查询用户评论

// 优惠券列表
export const coupon = {
	queryUsercouponNember: "/web/pm/usercoupon/queryUsercouponNemberNew.json", // 查询优惠券张数
	couponList: "/web/pm/usercoupon/queryUsercouponByUser.json", // 查询优惠券列表
	queryUserConByGoods: "/web/oc/contract/queryUserConByGoods.json", // 查询优惠券列表
	couponListcar: "/web/oc/contract/queryUserConByGoods.json", // 查询优惠券列表
	queryCouponList: "/web/pm/promotionIn/queryPromotionInPage.json", // 查询所有优惠券
	saveUsercoupon: "/web/pm/usercoupon/saveUsercoupon.json" // 领取优惠券
};
export const updateUCode = "/web/um/userservice/updateUCode.json"; // 生成二维码需要ucode
export const getImsgPushmsg = "/web/imsg/imsgPushmsg/queryImsgPushmsgPage.json"; // 站内信消息

// 发票
export const invoice = {
	increasedinvoice: "/web/inv/userinv/saveUserinv.json", // 新增发票信息
	getInfo: "/web/inv/userinv/getUserinv.json", // 获取发票信息
	deleteInfo: "/web/inv/userinv/deleteUserinv.json", // 删除发票信息
	editInfo: "/web/inv/userinv/updateUserinv.json", // 编辑保存信息
	writeReceipt: "/web/inv/invlist/saveInvlist.json", // 开发票
	getInfolist: "/web/inv/invlist/queryInvlistPageTowap.json", // 获取发票信息列表
	checkAuditing: "/web/inv/userinv/checkVATowap.json", // 校验增值税专用发票审核状态
	invoicelist: "/web/oc/contract/queryContractPageByUser.json", // 获取开具发票列表
	getinvoicesList: "/web/inv/userinv/queryUserinvPage.json", // 获取已有发票列表
	fcSaveOrder: "/web/inv/invlist/fcSaveOrder.json", // 新增发票提交申请接口
	ueryInvsetPage: "/web/inv/invset/ueryInvsetPage.json" // 新增费用接口
};

export const changePhone = {
	sendPhone: "/web/ml/muser/sendPhone.json", // 获取验证码
	loginVerificationCode: '/web/ml/mlogin/loginVerificationCode.json', //验证码登录
	checkVerificationMa: "/web/um/userservice/checkVerificationMa.json", // 验证验证码
	phone: "/web/ml/muser/checkUserPhone.json", // 校验手机号是否注册
	wechatLogin: "/web/ml/muser/saveUmuserPhoneByWX.json", // 微信登录并注册
	updatePhone: "/web/um/userservice/updateUserPhoneByUserPhone.json"
};
export const indexMem = "/web/mi/mindex/indexMem.json";
export const getPersonal = "/web/um/userservice/getUserservice.json"; // 获取个人信息
export const changePersonal =
	"/web/um/userservice/updateUserserviceByPcode.json"; // 修改个人信息
export const uploadGoodsFile = "/web/rs/goodsFile/uploadGoodsFile.json"; // 图片上传

export const querySkuFromSc = "/web/rs/sku/querySkuFromSc.json"; // 商品SKU-店铺
export const queryShopdeByMerchant =
	"/web/sc/shopde/queryShopdeByMerchant.json"; // 根据memberCode查询店铺信息-店铺
export const updateShoppingGoodsPmInfo =
	"/web/oc/shopping/updateShoppingGoodsPmInfo.json"; // 更新购物车商品的营销信息



export const checkCollectExit = "/web/um/collect/checkCollectExit.json"; // 是否关注
export const deleteCollectByCode = "/web/um/collect/deleteCollectByCode.json"; // 取消关注
export const saveCollect = "/web/um/collect/saveCollect.json"; // 关注

export const shopList = "/web/sc/shopde/queryShopdeOrderLevel.json"; // 优选商家

export const queryStoreBySimpleObjPage =
	"/web/um/userStore/queryStoreBySimpleObjPage.json"; // 优选商

export const queryGoodsClassTree =
	"/web/rs/rsGoodsClass/queryGoodsClassTree.json"; // 分类

export const queryShopRsGoodsClassPageByMemberCode =
	"/web/rs/rsGoodsClass/queryShopRsGoodsClassPageByMemberCode.json"; // 查询商铺前台分类

export const queryClasstreeByJd = "/web/rs/classtree/queryClasstreeByJd.json"
export const article = {
	articleList: "/web/cms/doclist/queryDoclistPage.json", // 文章列表
	articleDetail: "/web/cms/doclist/getDoclistForAt.json" // 文章详情
};

export const getStoreInfo = "/web/um/userStore/getStoreBySimpleObjPage.json"; // 获取营业时间等信息
export const getTginfoForTOCom = "/web/cms/tginfo/getTginfoForTOCom.json"; // 获取店铺信息

export const getSkuInfo = "/web/rs/sku/getSkuInfo.json"; // 获取商品详情信息  skuId
export const getSkuInfoByCode = "/web/rs/sku/getSkuInfoByCode.json"; // 获取商品详情信息  skuCode
export const getResourceGoodsInfoBySkuCode =
	"/web/rs/resourceGoods/getResourceGoodsInfoBySkuCode.json"; // 获取商品详情信息 SkuCode
export const fetchSpeOptByPntCodeNomRel =
	"/web/rs/specOption/fetchSpeOptByPntCodeNomRel.json"; // 获取商品详情的规格
export const queryPromotionListByGoodsCode =
	"/web/pm/promotion/queryPromotionListByGoodsCode.json"; // 促销接口
export const queryCouponListBySkuCode =
	"/web/pm/promotion/queryCouponListBySkuCode.json"; // 获取优惠券
export const saveUsercoupon = "/web/pm/usercoupon/saveUsercoupon.json"; // 获取优惠券

export const queryOcsconfigList = "/web/ocs/ocsconfig/queryOcsconfigList.json"; // 获取客服电话
export const getFoodsInfo = "/web/cms/doclist/queryDoclistPage.json"; // 食谱详情
export const saveFootprint = "/web/um/footprint/saveFootprint.json"; //  添加足迹

export const queryPromotionGoods = "/web/pm/promotion/getPromotionGoods.json"; // 活动专区
export const getPromotionByCode = "/web/pm/promotion/getPromotionByCode.json"; // 活动专区已选数量
export const getSecretKeyCodeByconfigType =
	"/web/ml/mlogin/getSecretKeyCodeByconfigType.json"; // 获取地图密钥

export const queryAccountOuterByUser =
	"/web/vd/vdfaccountouter/queryAccountOuterByUser.json"; // 我的钱包
export const myQueryShsettlListPage =
	"/web/sh/shsettlOplist/myQueryShsettlListPage.json"; // 分佣流水
export const queryWithdrawPageByMem =
	"/web/cp/withdraw/queryWithdrawPageByMem.json"; // 提现流水
export const queryContractPageBuiMatsBymem =
	"/web/oc/contract/queryContractPageBuiMatsBymem.json";
export const saveWithdrawByAgDt = "/web/cp/withdraw/saveWithdrawByAgDt.json"; // 提现
export const queryContractPageByABulk =
	"/web/oc/contract/queryContractPageByABulk.json"; // 团购列表
export const getPmPromotionInfo = "/web/pm/promotion/getPmPromotionInfo.json"; // 商品团购信息
export const queryPromotionPageAssembleForPc =
	"/web/pm/promotion/queryPromotionPageAssembleForPc.json"; // 获取快速成团信息
export const queryContractPageBySpellGroup =
	"/web/oc/contract/queryContractPageBySpellGroup.json"; // 订单拼团列表

export const saveUserinfoapplyByUser =
	"/web/um/userservice/saveUserinfoapplyByUser.json"; // 申请团长
export const getUserinfoserviceByLogin =
	"/web/um/userserviceinfo/getUserinfoserviceByLogin.json"; // 获取用户信息

export const queryContForGroup =
	"/web/oc/contract/queryContractNumPageForGroup.json"; // 查询我的业绩
export const queryContractPageForService =
	"/web/oc/contract/queryContractPageForService.json"; // 订单核销列表
export const queryContractPageForGroup =
	"/web/oc/contract/queryContractPageForGroup.json"; // 团长订单列表
export const queryZtaddressList = "/web/um/userSer/queryUserServicePage.json"; // 自提点列表

export const getUserinfoInvite = '/web/um/userserviceinfo/getUserinfoInvite.json'; //获取用户邀请码
export const getShsettlByUser = '/web/sh/shsettl/getShsettlByUser.json'; // 获取分销设置信息
export const getShsettlByCode = "/web/sh/shsettl/getShsettlByCode.json"; // 获取分销设置信息
export const saveUserinfoApplyDis = '/web/um/userservice/saveUserinfoApplyDis.json'; //普通用户申请分销商
export const getShsettlRateconGoods = '/web/sh/shsettlRatecon/getShsettlRateconGoods.json'; //获取参与分销的商品列表
export const invitationRegister = '/web/ml/muser/saveUmUserPhoneByInvitation.json'; //邀请注册
export const getShsettlUserByUser = '/web/sh/shsettlUser/getShsettlUserByUser.json'; // 获取营销信息
export const getUserAccount = '/web/vd/vdfaccountouter/queryAccountOuterByUser.json'; // 平台当前登录用户账户(我的福点,账户余额查询)
export const getShsettlUserByStatistics = '/web/sh/shsettlUser/getShsettlUserByStatistics.json';


export const getWxMiniQRCode = '/web/ml/mlogin/loginMiniCode.json'; // 获取小程序码 无限制
export const getShsettlByType = "/web/sh/shsettl/getShsettlByType.json"; // 获取分销规则（通用）
export const getImsgPushmsgs = '/web/imsg/imsgPushmsg/getImsgPushmsg.json' // 获取站内信管理信息



export const getTopPerMenuList = "web/mi/mindex/getTopPerMenuList.json";
export const loginMiniProgram = "/web/ml/mlogin/loginMiniProgram.json"; // 小程序授权登陆
export const getTopPerMenuListFPc = "/web/mi/mindex/getTopPerMenuListFPc.json"; // 路由-菜单
export const aliLogin = "/web/ml/mgeneration/getALiToken.json";























export const queryClasstreePageFromUser = '/web/rs/classtree/queryClasstreePageFromUser.json' // 获取店铺分类信息
export const queryBusinessClasstreeNew = '/web/rs/classtree/queryBusinessClasstreeNew.json'
export const queryRtagPage = '/web/rs/rtag/queryRtagPage.json' // 查询标签
export const getVopCarriageNew = '/web/oc/contract/getVopCarriageNew.json' // 获取京东运费
export const getIndexDetail = '/web/cms/conttitleBusiness/queryContlistPageForSc.json' // 获取京东运费
export const getSkuBySpecNew = '/web/rs/sku/getSkuBySpecNew.json' // 规格选择

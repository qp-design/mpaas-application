const state = {
    // 接口域名
    $domain: '',
    // 图片域名
    $imgDomain: '',
    // 跳H5域名
    $businessDomain: '',
    // 页面间传值的临时数据
    tempValue: {},
    // 分页
    pageSize: 20,
    // 用户登陆信息
    userInfo: {},
    // 是否iphoneX
    isIphoneX: false,
    count: 0,
    addressId: 0,
    // 换肤颜色
    baseColor: '',
    // 购物车提交需要的商品shoppingGoodsId  queryShoppingToContract需要的参数
    shoppingGoodsIdStr: [],
    // 确认订单的时候接口 getTotalDiscountPrice 需要的参数
    rsSkuListStr: [],
    // saveContract 接口需要
    shoppingType: [],
    // 订单列表所需的参数
    orderParams: {},
    // 订单列表点评价时传商品数据
    order: [],
    // 订单号
    contractBillcode: '',
    // 登陆信息
    userMessage: {},
    // 首页链接
    homeUrl: '',
    // 分类链接
    classifyUrl: '',
    // 发现链接
    FindUrl: '',
    // 单位
    proappEnvOpenconf: {},
    // 查新店铺信息
    menberCode: '',
    // 订单搜索路径
    orderSearch: '',
    // 订单搜索结果路径
    orderSearchResult: '',
    // 订单列表菜单路径
    orderMenu: [],
    // 应用菜单 menushow=1
    columnList: [],
    // 应用菜单 menushow=0
    application: [],
    // 底部菜单
    footerMenu: [],
    // 头部 菜单
    nav: [],
    // 订单列表路径
    orderIndex: [],
    // 订单菜单路径
    myOrder: [],
    //更多工具
    moreToolList: [],
    //我的订单
    myorderList: [],
    //我的钱包
    myWalletList: [],
    //商品信息
    goodsinfor: ''
}

export default state

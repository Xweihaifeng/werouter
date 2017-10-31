/**
 * Created by Hongguang on 2017/8/1.
 */

//接口配置
const apiUrl = 'http://apitest.wezchina.com/';
//const apiUrl = 'http://api.wezchina.loc/';

const CMS_ADVS = apiUrl + 'cms/advs'; //主页信息
const CMS_INDEX_GRID = apiUrl + 'cms/index/grid'; //主页新闻
const LOGIN = apiUrl + 'login'; //登陆
const CODES = apiUrl + 'codes'; //获取验证码
const ARTICLES_CATES = apiUrl + 'articles/cates'; //文章分类列表
const ARTICLES_CATEGORY = apiUrl + 'articlesByCateAndUser'; //文章分类获取列表
const CMS_QRCODE = apiUrl + 'cms/qrcode'; //二维码
const ARTICLE = apiUrl + 'article'; //请求文章内容GET；上传文章POST
const ARTICLE_PRAISES = apiUrl + 'articles/praises'; //文章点赞
const ARTICLES = apiUrl + 'articles'; //文章列表
const ARTICLE_UPLOAD = apiUrl + 'articles'; //上传文章
const ARTICLES_VIEW = apiUrl + 'articles/view'; //文章浏览数
const USERDETAIL = apiUrl +'users';    // 获取用户详情
const USERINFO = apiUrl +'users/updated'; //修改用户详情
// const QINIU_UPTOKEN_URL = apiUrl +'file/qiniu_token';
const ARTICLES_DESTORY = apiUrl + 'articles/destory';
const ARTICLE_EDIT = apiUrl + 'article'; //修改文章
const FOUNDER = apiUrl + 'users/founder';
const PAGESTORE = apiUrl + 'pages/page/store';
const PAGEDETAIL = apiUrl + 'pages/page/detail';
const WXlOGINQR = apiUrl + 'wx/wxloginqr';
const OPENID = apiUrl + 'wx/wxloginOpenid/';
const QRCODE = apiUrl + 'file/qrcode';
const DETAILBYUSER = apiUrl + 'getDetailByUser/';
const USER_AVATAR = apiUrl + 'users/avatar';
const UPDATESECRET = apiUrl + '/users/update/Secret'//重置密令
const BRAND_DETAIL_USER = apiUrl +'pages/brand/detailbyuser';//品牌详情
const PAGES_DETAIL_DOMAIN=apiUrl +'pages/page/getDetailByDomain';//主页详情域名
const ARTICLES_LISTCOUNT =apiUrl + 'articles/listCount';//文章用户列表数

const ADDRESS_LIST=apiUrl + 'users/address/list';//地址列表个人
const ADDRESS_ISRANGETRUE=apiUrl+'users/address/israngetrue';//配送地址判断可用
const ADDRESS_STORE=apiUrl+'users/address/store';//地址保存

/**
 * Created by weifeng on 2017/9/9.
 */

// cms 模块调用接口
const CMS_CHANNELS 					= apiUrl + 'cms/channels';    /* 查询所有频道 */
const CMS_CATEGORIES 				= apiUrl + 'cms/categories/';    /* 查询类目详情 */
const CMS_CONTENTS_HOT 				= apiUrl + 'cms/contents?channel_id=';    /* 查询热点新闻 */
const CMS_CHANNEL_CATEGORIES 		= apiUrl + 'cms/channel_categories?channel=';
const CMS_CONTENTS 					= apiUrl + 'cms/contents?channel_id=';
const CMS_DETAIL_CONTENTS_CATE_ID 	= apiUrl + 'cms/contents?cate_id=';
const CMS_CONTENTS_PRAISE 			= apiUrl + 'cms/contents/praise';
const CMS_CONTENTS_PRAISE_USER 		= apiUrl + 'cms/contents/';
const CMS_DETAIL 					= apiUrl + 'cms/detail/';
const CMS_DETAIL_QRCODE 			= apiUrl + 'cms/qrcode?size=150&text=';
const CMS_CHANNELS_DOMAIN_QUERY 	= apiUrl + 'cms/channels/domain_query/';
const CMS_CATEGORIES_DOMAIN_QUERY 	= apiUrl + 'cms/categories/domain_query/';

// 七牛图片上传插件接口调用
const QINIU_UPTOKEN_URL 			= apiUrl + 'file/qiniu_token';
const ApiMaterPlatQiniuDomain 		= 'http://images.new.wezchina.com/';
const qiniu_upload_domain 			= 'http://upload.qiniu.com';
// const ApiMaterPlatQiniuDomain 		= 'http://oty3r3tmi.bkt.clouddn.com/';

// 微主页个性域名接口调用
const PAGES_PAGE_ISOPENPAGE 		= apiUrl + 'pages/page/isopenpage';        // 是否开通微主页
const PAGES_PAGE_GETDETAILBYUSER 	= apiUrl + 'pages/page/getDetailByUser/';

// 认证模块接口调用
const CERT_REALNAME_DETAIL 			= apiUrl + 'cert/realName/detail';  // 人工、在线认证详情显示
const CERT_REALNAME 				= apiUrl + 'cert/realName';         // 人工认证信息提交
const CERT_REALNAME_UPDATE 			= apiUrl + 'cert/realName/update';  // 人工认证信息修改
const CERT_REALNAME_SETTING 		= apiUrl + 'cert/realName/setting'; // 在线认证开通专状态判断
const CERT_ONLINEREALNAME 			= apiUrl + 'cert/onlineRealName';   // 在线认证信息提交
const CERT_OFCCERTS 				= apiUrl + 'cert/ofccerts';			// 人工认证详情显示

// 获取图片验证码
const USER_IMAGECODEID  			= apiUrl + 'users/imagecodeid'		// 获取图片codeweid
const USER_IMAGECODE 				= apiUrl + 'users/imagecode/'		// 获取图片验证码

//商城分类
const GOODS_CATES_STORE                      = apiUrl + 'goods/cates/store';  //保存商品分类
const GOODS_CATES_UPDATE                     = apiUrl + 'goods/cates/update';  //修改商品分类
const GOODS_CATES_LIST                       = apiUrl + 'goods/cates/list';  //分类列表
const GOODS_CATES_LIST_USERID                = apiUrl + 'goods/cates/listsbyuser';  //发布商品分类列表(根据用户)
const GOODS_CATES_DESTORY                    = apiUrl + 'goods/cates/destroy';  //删除商品分类
const GOODS_CATES_CREATE                     = apiUrl + 'goods/cates/create';  //创建商品分类
const GOODS_CATES_DETAIL                     = apiUrl + 'goods/cates/detail';  //商品分类详情
//商品
const GOODS_STORE                            = apiUrl + 'goods/store';  //商品保存
const GOODS_UPDATE                           = apiUrl + 'goods/update';  //商品修改
const GOODS_LISTS_CATE                       = apiUrl + 'goods/lists/cate';  //分类商品列表
const GOODS_LIST                             = apiUrl + 'goods/list';  //商品列表
const GOODS_USER_COUNT                       = apiUrl + 'goods/user/count';  //商品发布数量
const GOODS_COLLECTIONDECREMENT              = apiUrl + 'goods/collectiondecrement';  //取消收藏
const GOODS_DOMAINGOODSISTRUE                = apiUrl + 'goods/domaingoodsistrue';  //商品合法性
const GOODS_COLLECT                          = apiUrl + 'goods/collectionincrement';  //收藏
const GOODS_CREATE                           = apiUrl + 'goods/create';  //添加商品
const GOODS_VIEWSINCREMENT                   = apiUrl + 'goods/viewsincrement';  //商品浏览量
const GOODS_LISTS_USERANDCATE                = apiUrl + 'goods/lists/userandcate';  //商品 - 用户&分类商品列表
const GOODS_LISTS_USERANDCATERETCATE         = apiUrl + 'goods/lists/userandcateretcate';  //商品 - 用户&分类商品列表安分类返回
const GOODS_LISTS_USER                       = apiUrl + 'goods/lists/user';  //用户商品列表
const GOODS_DETAIL                           = apiUrl + 'goods/detail';  //商品详情
const MALL_USERDETAIL                        = apiUrl + 'mall/userdetail';  //用户信息
const MALL_STORE                             = apiUrl + 'mall/store';  //商城保存
const MALL_UPDATE                            = apiUrl + 'mall/update';  //商城修改
const MALL_CREATE                            = apiUrl + 'mall/create';  //开通商城
const GOODS_DESTROY                          = apiUrl + 'goods/destroy';  //删除商品
const MALL_DESTROY                           = apiUrl + 'mall/destroy';  //注销商城
const ORDER_DESTROY                          = apiUrl + 'order/destroy';  //删除订单
const CART_DESTROY                           = apiUrl + 'cart/destroy';  //删除购物车
const MALL_DETAIL                            = apiUrl + 'mall/detail';  //商城详情
//商品收藏
const GOODS_COLLECTION_ISCOLLECTION          = apiUrl + 'goods/collection/iscollection';  //是否收藏
const GOODS_COLLECTION_STORE                 = apiUrl + 'goods/collection/store';  //收藏保存
const GOODS_COLLECTION_LIST                  = apiUrl + 'goods/collection/list';  //收藏列表
const GOODS_COLLECTION_DESTORY               = apiUrl + 'goods/collection/destroy';  //收藏删除
const GOODS_COLLECTION_CREATE                = apiUrl + 'goods/collection/create';  //收藏 - 数据模型
const GOODS_COLLECTION_DETAIL                = apiUrl + 'goods/collection/detail';  //收藏详情
//商品订单
const ORDER_STORE                            = apiUrl + 'order/store';  //保存订单
const ORDER_UPDATE                           = apiUrl + 'order/update';  //修改订单
const ORDER_LIST                             = apiUrl + 'order/list';  //订单列表
const ORDER_CREATE                           = apiUrl + 'order/create';  //添加订单
const ORDER_DETAIL                           = apiUrl + 'order/detail';  //添加详情
//商品评价
const GOODS_COMMENT_STORE                    = apiUrl + 'goods/comment/store';  //商品评论
const GOODS_COMMENT_UPDATE                   = apiUrl + 'goods/comment/update';  //修改评论
const GOODS_COMMENT_LIST                     = apiUrl + 'goods/comment/list';  //评论列表
const GOODS_COMMENT_DESTORY                  = apiUrl + 'goods/comment/destroy';  //删除商品评论
const GOODS_COMMENT_CREATE                   = apiUrl + 'goods/comment/create';  //添加商品评论
const GOODS_COMMENT_DETAIL                   = apiUrl + 'goods/comment/detail';  //商品评论详情
//商品配送
const GOODS_RANGE_STORE                      = apiUrl + 'goods/range/store';  //保存配送范围
const GOODS_RANGE_UPDATED                    = apiUrl + 'goods/range/updated';  //修改配送范围
const GOODS_RANGE_LISTS                      = apiUrl + 'goods/range/lists';  //配送范围列表
const GOODS_RANGE_DESTORY                    = apiUrl + 'goods/range/destroy';  //删除配送范围
const GOODS_RANGE_DREALISTS                  = apiUrl + 'goods/range/arealists';  //配送范围--市区列表
const GOODS_RANGE_PROVICELISTS               = apiUrl + 'goods/range/provincelists';  //配送范围--省列表
const GOODS_RANGE_DETAIL                     = apiUrl + 'goods/range/detail';  //配送范围详情
const PROVINCE_DETAIL						 =apiUrl +'province/detail';//省详情
const AREA_DETAIL						 	 =apiUrl +'area/detail';//市详情
const WECHATPAY_NATIVEPAY=apiUrl+'wechatpay/nativepay';//微信支付 - 订单支付（二维码链接）
const PROVINCE_LIST=apiUrl+'province/list';//省列表
const AREA_LIST=apiUrl+'area/list';//省下市
const PAGES_MODULERUN_LIST=apiUrl+'pages/modulerun/list';//用户模块列表个人


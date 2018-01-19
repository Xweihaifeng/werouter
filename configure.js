/**
 * Created by Hongguang on 2017/8/1.
 */

//接口配置
const httpType = window.location.protocol;

const apiUrl = httpType + '//{{url}}/api/';


const mApiUrl = httpType + '//m.{{url}}/api/';

const siteUrl = httpType + '//{{url}}';

const domainHost = window.location.host;

const controlUrl = 'https://mp.wezchina.com/api/menu_config?mark=';

const ApiMaterPlatQiniuDomain = httpType + '//' + plats_qiniu.domain_custom + '/';

//七牛图片配置
var imgSet = function(path, width, height, mode) {
    if (mode != undefined) {
        return ApiMaterPlatQiniuDomain + path + '?imageView2/' + mode + '/w/' + width + '/h/' + height;
    } else {
        return ApiMaterPlatQiniuDomain + path + '?imageView2/3/w/' + width + '/h/' + height;
    }
}

var docCookies = {
    getItem: function(sKey) {
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function(sKey, sPath, sDomain) {
        if (!sKey || !this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function(sKey) {
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function() {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};

/*$.ajaxSetup({
    headers: { // Ĭ���������ͷ
        "Token": plats_token,
        "apiAuth": auth_code
    },
    error: function(xhr) {
        console.log(xhr);
    }
})*/

const CMS_ADVS = apiUrl + 'cms/advs'; //主页信息
const CMS_INDEX_GRID = apiUrl + 'cms/index/grid'; //主页新闻
const LOGIN = apiUrl + 'login'; //登陆
const CODES = apiUrl + 'codes'; //获取验证�?
const ARTICLES_CATES = apiUrl + 'articles/cates'; //文章分类列表
const ARTICLES_CATEGORY = apiUrl + 'articlesByCateAndUser'; //文章分类获取列表
const CMS_QRCODE = apiUrl + 'cms/qrcode'; //二维�?
const ARTICLE = apiUrl + 'article'; //请求文章内容GET；上传文章POST
const ARTICLE_PRAISES = apiUrl + 'articles/praises'; //文章点赞
const ARTICLES = apiUrl + 'articles'; //文章列表ew
const ARTICLE_UPLOAD = apiUrl + 'articles'; //上传文章
const ARTICLES_VIEW = apiUrl + 'articles/view'; //文章浏览�?
const USERDETAIL = apiUrl + 'users'; // 获取用户详情
const USERINFO = apiUrl + 'users/updated'; //修改用户详情
const ARTICLES_DESTORY = apiUrl + 'articles/destory';
const ARTICLE_EDIT = apiUrl + 'article'; //修改文章
const FOUNDER = apiUrl + 'users/founder';
const PAGESTORE = apiUrl + 'pages/page/store';
const PAGEDETAIL = apiUrl + 'pages/page/detail';
const WXlOGINQR = apiUrl + 'wx/wxloginqr';
const WXlOGIN = apiUrl + 'wxlogin'; //用户 - 微信登录
const OPENID = apiUrl + 'wx/wxloginOpenid/';
const QRCODE = apiUrl + 'file/qrcode';
const DETAILBYUSER = apiUrl + 'getDetailByUser/';
const USER_AVATAR = apiUrl + 'users/avatar';
const UPDATESECRET = apiUrl + 'users/update/Secret' //重置密令
const BRAND_DETAIL_USER = apiUrl + 'pages/brand/detailbyuser'; //品牌详情
const PAGES_DETAIL_DOMAIN = apiUrl + 'pages/page/getDetailByDomain'; //主页详情域名
const ARTICLES_LISTCOUNT = apiUrl + 'articles/listCount'; //文章用户列表�?
const ADDRESS_LIST = apiUrl + 'users/address/list'; //地址列表个人
const ADDRESS_ISRANGETRUE = apiUrl + 'users/address/israngetrue'; //配�?�地�?判断可用
const ADDRESS_STORE = apiUrl + 'users/address/store'; //地址保存
const ARTICLE_LIST = apiUrl + "articles/list";
const ARTICLE_EXITS = apiUrl + "articles/articleExits";

/**
 * Created by weifeng on 2017/9/9.
 */

// cms 模块调用接口
const CMS_CHANNELS = apiUrl + 'cms/channels'; /* 查询�?有频�? */
const CMS_CATEGORIES = apiUrl + 'cms/categories/'; /* 查询类目详情 */
const CMS_CONTENTS_HOT = apiUrl + 'cms/contents?channel_id='; /* 查询热点新闻 */
const CMS_CHANNEL_CATEGORIES = apiUrl + 'cms/channel_categories?channel=';
const CMS_CONTENTS = apiUrl + 'cms/contents?channel_id=';
const CMS_DETAIL_CONTENTS_CATE_ID = apiUrl + 'cms/contents?cate_id=';
const CMS_CONTENTS_PRAISE = apiUrl + 'cms/contents/praise';
const CMS_CONTENTS_PRAISE_USER = apiUrl + 'cms/contents/';
const CMS_DETAIL = apiUrl + 'cms/detail/';
const CMS_DETAIL_QRCODE = apiUrl + 'cms/qrcode?size=150&text=';
const CMS_CHANNELS_DOMAIN_QUERY = apiUrl + 'cms/channels/domain_query/';
const CMS_CATEGORIES_DOMAIN_QUERY = apiUrl + 'cms/categories/domain_query/';

// 七牛图片上传插件接口调用
const QINIU_UPTOKEN_URL = apiUrl + 'file/qiniu_token';
// const ApiMaterPlatQiniuDomain 		= 'http://images.new.wezchina.com/';
const qiniu_upload_domain = httpType + '//upload.qiniu.com';
// const ApiMaterPlatQiniuDomain 		= 'http://oty3r3tmi.bkt.clouddn.com/';

// 微主页个性域名接口调�?
const PAGES_PAGE_CHECK_DOMAIN = apiUrl + 'pages/page/check_domain'; // 个性别名合法性检测
const PAGES_PAGE_ISOPENPAGE = apiUrl + 'pages/page/isopenpage'; // 是否�?通微主页
const PAGES_PAGE_INFO = apiUrl + 'pages/page/info'; // 查看微主页开通情况
const PAGES_PAGE_GETDETAILBYUSER = apiUrl + 'pages/page/getDetailByUser/';

// 认证模块接口调用
const CERT_REALNAME_DETAIL = apiUrl + 'cert/realName/detail'; // 人工、在线认证详情显�?
const CERT_REALNAME = apiUrl + 'cert/realName'; // 人工认证信息提交
const CERT_REALNAME_UPDATE = apiUrl + 'cert/realName/update'; // 人工认证信息修改
const CERT_REALNAME_SETTING = apiUrl + 'cert/realName/setting'; // 在线认证�?通专状�?�判�?
const CERT_ONLINEREALNAME = apiUrl + 'cert/onlineRealName'; // 在线认证信息提交
const CERT_OFCCERTS = apiUrl + 'cert/ofccerts'; // 人工认证详情显示

// 获取图片验证�?
const USER_IMAGECODEID = apiUrl + 'users/imagecodeid' // 获取图片codeweid
const USER_IMAGECODE = apiUrl + 'users/imagecode/' // 获取图片验证�?
const USER_GETIMAGECODE = apiUrl + 'users/getimagecode/' // 获取图片验证码�??
const USER_COULD_WITHDRAWS = apiUrl + 'users/Withdraws/couldWithdraws'; //用户是否可以提现

// 成员模块调用接口
const MEMBER_CERT = apiUrl + 'member/' // Member - 会员证书
const MEMBER_PROFILE = apiUrl + 'member/profile' // Member - 会员详情
const MEMBER_APPLY = apiUrl + 'member/apply' // Member - 会员提交
const MEMBER_SETTING = apiUrl + 'member/setting' // Member - 会员设置信息
const MEMBER_LEVELS = apiUrl + 'member/levels' // Member - 会员种类列表/member/mien/
const MEMBER_MIEN = apiUrl + 'member/mien' // Member - 会员风采
const MEMBER_WECHATPAY_APPLY_PAY = apiUrl + 'wechatpay/member_apply_pay/' // Member - 微信支付二维码url
const MEMBER_APPLY_ORDER_DETECT = apiUrl + 'member/apply_order_detect' // Member - 订单状�?�轮�?



//商城分类
const GOODS_CATES_STORE = apiUrl + 'goods/cates/store'; //保存商品分类
const GOODS_CATES_UPDATE = apiUrl + 'goods/cates/update'; //修改商品分类
const GOODS_CATES_LIST = apiUrl + 'goods/cates/list'; //分类列表
const GOODS_CATES_LIST_USERID = apiUrl + 'goods/cates/listsbyuser'; //发布商品分类列表(根据用户)
const GOODS_CATES_DESTORY = apiUrl + 'goods/cates/destroy'; //删除商品分类
const GOODS_CATES_CREATE = apiUrl + 'goods/cates/create'; //创建商品分类
const GOODS_CATES_DETAIL = apiUrl + 'goods/cates/detail'; //商品分类详情
//商品
const GOODS_STORE = apiUrl + 'goods/store'; //商品保存
const GOODS_UPDATE = apiUrl + 'goods/update'; //商品修改
const GOODS_LISTS_CATE = apiUrl + 'goods/lists/cate'; //分类商品列表
const GOODS_LIST = apiUrl + 'goods/list'; //商品列表
const GOODS_USER_COUNT = apiUrl + 'goods/user/count'; //商品发布数量
const GOODS_COLLECTIONDECREMENT = apiUrl + 'goods/collectiondecrement'; //取消收藏
const GOODS_DOMAINGOODSISTRUE = apiUrl + 'goods/domaingoodsistrue'; //商品合法�?
const GOODS_COLLECT = apiUrl + 'goods/collectionincrement'; //收藏
const GOODS_CREATE = apiUrl + 'goods/create'; //添加商品
const GOODS_VIEWSINCREMENT = apiUrl + 'goods/viewsincrement'; //商品浏览�?
const GOODS_LISTS_USERANDCATE = apiUrl + 'goods/lists/userandcate'; //商品 - 用户&分类商品列表
const GOODS_LISTS_USERANDCATERETCATE = apiUrl + 'goods/lists/userandcateretcate'; //商品 - 用户&分类商品列表安分类返�?
const GOODS_LISTS_USER = apiUrl + 'goods/lists/user'; //用户商品列表
const GOODS_DETAIL = apiUrl + 'goods/detail'; //商品详情
const MALL_USERDETAIL = apiUrl + 'mall/userdetail'; //用户信息
const MALL_STORE = apiUrl + 'mall/store'; //商城保存
const MALL_UPDATE = apiUrl + 'mall/update'; //商城修改
const MALL_CREATE = apiUrl + 'mall/create'; //�?通商�?
const GOODS_DESTROY = apiUrl + 'goods/destroy'; //删除商品
const MALL_DESTROY = apiUrl + 'mall/destroy'; //注销商城
const ORDER_DESTROY = apiUrl + 'order/destroy'; //删除订单
const CART_DESTROY = apiUrl + 'cart/destroy'; //删除购物�?
const MALL_DETAIL = apiUrl + 'mall/detail'; //商城详情
//商品收藏
const GOODS_COLLECTION_ISCOLLECTION = apiUrl + 'goods/collection/iscollection'; //是否收藏
const GOODS_COLLECTION_STORE = apiUrl + 'goods/collection/store'; //收藏保存
const GOODS_COLLECTION_LIST = apiUrl + 'goods/collection/list'; //收藏列表
const GOODS_COLLECTION_DESTORY = apiUrl + 'goods/collection/destroy'; //收藏删除
const GOODS_COLLECTION_CREATE = apiUrl + 'goods/collection/create'; //收藏 - 数据模型
const GOODS_COLLECTION_DETAIL = apiUrl + 'goods/collection/detail'; //收藏详情
//商品订单
const ORDER_STORE = apiUrl + 'order/store'; //保存订单
const ORDER_UPDATE = apiUrl + 'order/update'; //修改订单
const ORDER_LIST = apiUrl + 'order/list'; //订单列表
const ORDER_CREATE = apiUrl + 'order/create'; //添加订单
const ORDER_DETAIL = apiUrl + 'order/detail'; //添加详情
//商品评价
const GOODS_COMMENT_STORE = apiUrl + 'goods/comment/store'; //商品评论
const GOODS_COMMENT_UPDATE = apiUrl + 'goods/comment/update'; //修改评论
const GOODS_COMMENT_LIST = apiUrl + 'goods/comment/list'; //评论列表
const GOODS_COMMENT_DESTORY = apiUrl + 'goods/comment/destroy'; //删除商品评论
const GOODS_COMMENT_CREATE = apiUrl + 'goods/comment/create'; //添加商品评论
const GOODS_COMMENT_DETAIL = apiUrl + 'goods/comment/detail'; //商品评论详情
//商品配�??
const GOODS_RANGE_STORE = apiUrl + 'goods/range/store'; //保存配�?�范�?
const GOODS_RANGE_UPDATED = apiUrl + 'goods/range/updated'; //修改配�?�范�?
const GOODS_RANGE_LISTS = apiUrl + 'goods/range/lists'; //配�?�范围列�?
const GOODS_RANGE_DESTORY = apiUrl + 'goods/range/destroy'; //删除配�?�范�?
const GOODS_RANGE_DREALISTS = apiUrl + 'goods/range/arealists'; //配�?�范�?--市区列表
const GOODS_RANGE_PROVICELISTS = apiUrl + 'goods/range/provincelists'; //配�?�范�?--省列�?
const GOODS_RANGE_DETAIL = apiUrl + 'goods/range/detail'; //配�?�范围详�?
const PROVINCE_DETAIL = apiUrl + 'province/detail'; //省详�?
const AREA_DETAIL = apiUrl + 'area/detail'; //市详�?
const WECHATPAY_NATIVEPAY = apiUrl + 'wechatpay/nativepay'; //微信支付 - 订单支付（二维码链接�?
const PROVINCE_LIST = apiUrl + 'province/list'; //省列�?
const AREA_LIST = apiUrl + 'area/list'; //省下�?
const PAGES_MODULERUN_LIST = apiUrl + 'pages/modulerun/list'; //用户模块列表个人

//管理中心
const MODULE_DETAIL = apiUrl + 'pages/module/detail/'; //模块
const MODULERUN_GETDETAILBYUSER = apiUrl + 'pages/modulerun/getDetailByUser/';
const PAGES_UPDATE = apiUrl + 'pages/page/update';
const BRAND_STORE = apiUrl + 'pages/brand/store';
const BRAND_UPDATE = apiUrl + 'pages/brand/update';
const TRADEMARK_DETAILBYUSER = apiUrl + 'pages/trademark/detailbyuser/';
const TRADEMARK_STORE = apiUrl + 'pages/trademark/store';
const TRADEMARK_UPDATE = apiUrl + 'pages/trademark/update';
const ARTICLES_UPDATED = apiUrl + 'articles/updated/';
const SMS_PACKAGE_LIST = apiUrl + 'sms/package/list';
const SMS_PACKAGE_STORE = apiUrl + 'sms/package/store';
const SMS_PACKAGE_UPDATE = apiUrl + 'sms/package/update';
const SMS_USERSMS_STORE = apiUrl + 'sms/usersms/store';
const SMS_USERSMS_UPDATE = apiUrl + 'sms/usersms/update';
const SMS_USERSMS_DETAIBYUSERID = apiUrl + 'sms/usersms/detaibyuserid/';
const WECHATPAY_SMSPAY = apiUrl + 'wechatpay/smspay';
const SMS_ORDER_DETAIL = apiUrl + 'sms/order/detail/';
const SMS_USERSMS_TOGGLE = apiUrl + 'sms/usersms/toggle';



// 活动管理
const ACTIVITY_LIST = apiUrl + 'activity/listbyuser'; //活动 - 列表（根据用户id�?
const ACTIVITY_ACTIVITYINFO = apiUrl + 'activity/activityinfo'; //活动 -  个人活动统计详情
const ACTIVITY_DESTROY = apiUrl + 'activity/destroy'; //活动 - 删除
const ACTIVITY_STORE = apiUrl + 'activity/store'; //活动-保存
const ACTIVITY_GUEST_STORE = apiUrl + 'activity/guest/store'; //嘉宾保存
const ACTIVITY_TICKET_STORE = apiUrl + 'activity/ticket/store'; //门票保存
const ACTIVITY_USERINFO = apiUrl + 'activity/userinfo'; // 活动 - 用户活动详情
const ACTIVITY_DETAIL = apiUrl + 'activity/detail'; // 活动 - 详情
const ACTIVITY_UPDATE = apiUrl + 'activity/update'; // 活动 - 修改
const ACTIVITY_GUEST_LISTS = apiUrl + 'activity/guest/lists'; // 嘉宾 - 列表
const ACTIVITY_GUEST_UPDATE = apiUrl + 'activity/guest/update'; // 嘉宾 - 修改
const ACTIVITY_TICKET_UPDATE = apiUrl + 'activity/ticket/update'; // 门票 - 修改
const ACTIVITY_TICKET_LISTS = apiUrl + 'activity/ticket/lists'; // 门票 - 列表
const ACTIVITY_ADDVIEW = apiUrl + 'activity/addview'; // 活动 - 增加用户浏览�?
const ACTIVITY_COLLECTION_STORE = apiUrl + 'activity/collection/store'; // 活动 - 收藏 - 保存
const ACTIVITY_COLLECTION_ISCOLLECTION = apiUrl + 'activity/collection/iscollection'; // 活动 - 收藏 - 用户是否收藏

const ACTIVITY_ENROLL_STORE = apiUrl + 'activity/enroll/store'; // 活动 -报名 - 保存
const ACTIVITY_ENROLL_DETAIL = apiUrl + 'activity/enroll/detail'; // 活动 -报名 - 详情
const ACTIVITY_ENROLL_LISTS = apiUrl + 'activity/enroll/lists'; // 活动 -报名 - 列表
const ACTIVITY_ENROLL_DESTROY = apiUrl + 'activity/enroll/destroy'; // 活动 - 报名 - 删除
const ACTIVITY_ENROLL_COUNT = apiUrl + 'activity/enroll/count'; // 活动 - 报名 - 人数
const ACTIVITY_ENROLL_TICKETS = apiUrl + 'activity/enroll/tickets'; // 活动 - 报名 - 售票状况
const ACTIVITY_ENROLL_STATISTICS = apiUrl + 'activity/enroll/statistics'; // 活动 - 报名 - 图标统计
const ACTIVITY_ENROLL_SMS_NOTIFY = apiUrl + 'activity/enroll/sms_notify'; // 活动 - 报名 - 短信通知
const ACTIVITY_ENROLL_ALL_SMS_NOTIFY = apiUrl + 'activity/enroll/all_sms_notify'; // 活动 - 报名 - 群发短信通知 - 全部发送
const ACTIVITY_ENROLL_MULTI_SMS_NOTIFY = apiUrl + 'activity/enroll/multi_sms_notify'; // 活动 - 报名 - 群发短信通知 - 选择性多发

const ACTIVITY_ENROLL_ATTENDCOUNT = apiUrl + 'activity/enroll/attend_count'; // 活动 - 签到 - 人数


const ACTIVITY_COLLECTION_LISTBYUSER = apiUrl + 'activity/collection/listbyuser'; // 活动 - 收藏 - 列表（根据用户id�?
const ACTIVITY_COLLECTION_LISTS = apiUrl + 'activity/collection/lists'; // 活动 - 收藏 - 列表
const ACTIVITY_ENROLL_ISENROLL = apiUrl + 'activity/enroll/isEnroll'; // 活动 - 收藏 - 列表
const ACTIVITY_COLLECTION_DESTROY = apiUrl + 'activity/collection/destroy'; // 活动 - 收藏 - 删除
const PAGES_PAGE_COUNTAGEINFO = apiUrl + 'pages/page/countpageinfo'; // 用户 - 系统统计
const ACTIVITY_DOMAINISTRUE = apiUrl + 'activity/domainistrue'; //  活动 - 判断域名合法

const ACTIVITY_WX_ORDER = apiUrl + 'pages/wechatpay/enroll_order_pc_pay'; //  微信扫码下单
const ACTIVITY_ENROLL_ORDER_DETECT = apiUrl + 'activity/enroll_order_detect'; //  订单轮询
const ACTIVITY_ENROLL_MYORDER = apiUrl + 'activity/enroll_my_order'; // 指定活动订单查询
//const ACTIVITY_ENROLL_CHECK = apiUrl + 'activity/enroll/check_number'; // 票号核验
const ACTIVITY_ENROLL_CHECK = apiUrl + 'activity/enroll/check_ticket_number'; // 票号核验
const ACTIVITY_ENROLL_GET_TICKET_USER = apiUrl + 'activity/enroll/get_ticket_user'; // 票号核验
const ACTIVITY_USER_ORDER_LIST = apiUrl + 'activity/user_order_list'; // 活动订单
const ACTIVITY_MANAGE_ORDER_LIST = apiUrl + 'activity/manage_order_list?'; // 管理中心活动订单

const ACTIVITY_SMS_TEMPLATE = apiUrl + 'activity/sms/template'; // 活动短信模板获取
const ACTIVITY_SMS_TEMPLATE_UPDATE = apiUrl + 'activity/sms/update'; // 活动短信模板更新
const ACTIVITY_SMS_TOGGLE = apiUrl + 'activity/sms/toggle'; // 自动自定义短信开关

//项目接口
const PROJECT_CATE_LIST = apiUrl + 'project/cate/list'; //项目 -分类列表（根据用户ID�?
const PROJECT_STORE = apiUrl + 'project/store'; //项目 -项目 - 保存
const PROJECT_UPDATE = apiUrl + 'project/update'; //项目 -项目 - 修改
const PROJECT_LIST = apiUrl + 'project/list'; //项目 -项目 - 列表
const PROJECT_DESTROY = apiUrl + 'project/destroy'; //项目 - 删除
const PROJECT_DETAIL = apiUrl + 'project/detail';
const PROJECT_NEWS_STORE = apiUrl + 'project/news/store';
const PROJECT_NEWS_LIST = apiUrl + 'project/news/list';
const PROJECT_REPAY_LIST = apiUrl + 'project/repay/list';
const PROJECT_SUPORT_LIST = apiUrl + 'project/suport/list';
const PROJECT_INFO = apiUrl + 'project/info'; //项目 - 项目详情统计
const PROJECT_CATE_DETAIL = apiUrl + 'project/cate/detail'; //项目 - 分类详情
const PROJECT_IS_COLLECTION = apiUrl + 'project/collection/iscollection';
const PROJECT_COLLECTION_STORE = apiUrl + 'project/collection/store';
const PROJECT_COLLECTION_DESTROY = apiUrl + 'project/collection/destroy';
const PROJECT_SUPORT_STORE = apiUrl + 'project/suport/store';
const PROJECT_SUPORT_DETAIL = apiUrl + 'project/suport/detail';
const PROJECT_SUPORT_COULD_PAY = apiUrl + 'project/suport/couldsuportpay';
const PROJECT_SUPORT_BALANCE_PAY = apiUrl + 'project/suport/balancepay';
const PROJECT_SUPORT_COUNT = apiUrl + 'project/suport/count';
const PROJECT_REPAY_STORE = apiUrl + 'project/repay/store'; //项目回报保存
const PROJECT_REPAY_UPDATE = apiUrl + 'project/repay/update'; //项目回报修改
const PROJECT_REPAY_DESTORY = apiUrl + 'project/repay/destroy'; //项目回报删除
const PROJECT_REPAY_DETAIL = apiUrl + 'project/repay/detail';
const PROJECT_SUPORT_LIST_LUCK = apiUrl + 'project/suport/listluck';
const PROJECT_SUPORT_LUCKY = apiUrl + 'project/suport/lucky';
const PROJECT_SUPORT_UPDATE = apiUrl + 'project/suport/update'; //项目 - 支持修改
const PROJECT_COMPLETE = apiUrl + 'project/complete'; //项目 -申请提款-项目结束
const PROJECT_COLLECTION_LIST = apiUrl + 'project/collection/list'; //项目收藏 - 列表
const PROJECT_SUPORT_MYLIST = apiUrl + 'project/suport/mylist'; //我的项目 支持 - 列表
const PROJECT_DOMAINISTRUE = apiUrl + 'project/domainistrue'; //我的项目 项目id合法�?
const WECHATPAY_PROJECTSUPORT = apiUrl + 'wechatpay/projectsuport'; //微信支付-项目支持支付

//会员管理
const MEMBERLEVEL_SAVED = apiUrl + 'pages/member/level/saved'; //保存会员等级
const MEMBERLEVEL_LISTS = apiUrl + 'pages/member/level/lists'; //微主页会员等级列�?
const MEMBER_LISTS = apiUrl + 'pages/member/lists'; //微主页会员列�?
const MEMBER_USER_DETAIL = apiUrl + 'pages/member/user/detail'; //会员折扣信息AX\В

//杂志
const MAGAZINE_INDEX = apiUrl + 'magazine/index' //杂志列表
const MAGEZINE_IMAGES = apiUrl + 'magazine/images' //杂志图片
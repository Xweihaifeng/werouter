
//const apiUrl = 'http://api.wezchina.loc/';
const apiUrl = 'http://apitest.wezchina.com/';

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

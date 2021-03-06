/**
 * Created by Hongguang on 2017/8/1.
 */

//接口配置
const apiUrl = 'http://apitest.wezchina.com/';

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
const ARTICLES_VIEW = apiUrl + 'articles/view' //文章浏览数
const USERDETAIL = apiUrl +'users'    // 获取用户详情
const USERINFO = apiUrl +'users/updated' //修改用户详情
const QINIU_UPTOKEN_URL = apiUrl +'file/qiniu_token'
const ARTICLES_DESTORY = apiUrl + 'articles/destory'
const ARTICLE_EDIT = apiUrl + 'article' //修改文章
const FOUNDER = apiUrl + 'user/founder'

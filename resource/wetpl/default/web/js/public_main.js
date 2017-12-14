/**
 * Created by Hongguang on 2017/7/27.
 */

const home = `
                <div id="home-head">
                    <div id="carousel">
                        <div class="swiper-container" id="my-swiper">
                            <div class="swiper-wrapper carousel"></div>
                            <div class="swiper-pagination"></div>
                            <div class="swiper-button-prev"></div>
                            <div class="swiper-button-next"></div>
                        </div>
                    </div>
                    <div id="blue"></div>
                    <div id="news"></div>
                    <div class="main-news"></div>
                    <div class="news-center">
                        <ul class="nav nav-tabs">
                            <li role="presentation" class="center active"><a href="news">新闻中心</a></li>
                            <li role="presentation" class="sirase"><a href="org">公示公告</a></li>
                            <li role="presentation" class="release"><a>官方发布</a></li>
                        </ul>
                    </div>
                    <script>
                        $(".center a").css("color", "black!important");
                    </script>
                    <div class="news-link">
                        <div id="center"></div>
                        <div id="sirase" style="display: none;"></div>
                        <div id="release"></div>
                    </div>
                    <div id="recommend"></div>
                    <div class="rcd-bt">
                        <div class="tb">特别推荐<div class="triangle-right"></div></div>
                        <div class="hy">会员推荐<div class="triangle-right-1"></div></div>
                        <div class="circle-tb"><div class="sm-circle-tb"></div></div>
                        <div class="circle-hy"><div class="sm-circle-hy"></div></div>
                    </div>
                    <div class="rcd-news">
                        <div class="rcd-tb"></div>
                        <div class="rcd-hy" style="display: none;"></div>
                    </div>
                    <div id="adv"></div>
                    <div class="adv-left">
                        <div class="adv-left-0" style="background: rgb(8, 128, 218)"></div>
                        <div class="adv-left-1" style="background: rgb(8, 128, 218)"></div>
                        <div class="adv-left-2" style="background: rgb(8, 128, 218)"></div>
                        <div class="adv-left-3" style="background: rgb(8, 128, 218)"></div>
                    </div>
                    <div class="adv-right">
                        <div class="swiper-container" id="my-swiper2"><div class="swiper-wrapper adv-right-0"></div></div>
                        <div class="swiper-container" id="my-swiper3"><div class="swiper-wrapper adv-right-1"></div></div>
                        <!--<div class="swiper-container" id="my-swiper4"><div class="swiper-wrapper adv-right-2"></div></div>-->
                    </div>
                </div>
                <div id="home-body">
                    <div class="qsfc">
                        <p class="imgs-title">秦商风采</p>
                        <p class="imgs-more">更多&gt;&gt;</p>
                    </div>
                    <div id="imgs">
                        <div class="imgs-style">
                            <div class="imgs-chairman"></div>
                            <div class="img-title">
                                <div class="imgs-name"></div>
                                <div class="imgs-occupation-leader"></div>
                            </div>
                        </div>
                        <div class="imgs-active">
                            <div id="my-swiper1">
                                <div class="swiper_rolling clearfix"></div>
                            </div>
                        </div>
                    </div>
                    <div id="bg"></div>
                    <div class="hbbg">
                        <div id="bar"></div>
                    </div>
                    <div class="hbc">
                        <div id="hb-center">
                            <div id="hbl">
                                <div>
                                    <p></p>
                                    <p>更多>></p>
                                </div>
                                <div>
                                    
                                </div>
                                <p class="hb1"></p>
                                <p class="hb2"></p>                                
                            </div>
                            <div id="hbm">
                                <div>
                                    <p></p>
                                    <p>更多>></p>
                                </div>
                                <ul></ul>
                            </div>
                            <div id="hbr">
                                <div>
                                    <p>专题报告</p>
                                    <p>更多>></p>
                                </div>
                                <ul></ul>
                            </div>
                        </div>
                    </div>
                    <div id="link">
                        <ul id="link-title"></ul>

                        <div id="link-page">
                            <ul></ul>
                        </div>
                    </div>
                </div>

            `
const organization = `

                <dd  class="organize" id="organize">
                    <div class="zuzhi-top">
                        <div class="shanghuijieshao"></div>
                    </div>
                    <div class="zuzhi-bottom">
                        <div class="fazhanbaogao">
                            <div class="diyi">
                                <p class="title">发展报告</p>
                                <div class="report"></div>
                            </div>
                            <div class="dier"></div>
                            <div class="disan">
                                <p class="title">商会项目</p>
                                <div class="lunbo"> </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <img alt="" id="org_bottom_big_img" style="">
                    </div>
                </dd>

            `
const huzhu = `
                <div class="huzhu-top-img">
                    <div class="huzhu-top-img-title">
                        <!--<p class="t1">互助平台</p>-->
                        <!--<p class="t2">共筑众筹梦想朋友圈</p>-->
                    </div>
                    <img src="/common/img/012.png" alt="" style="height: 235px;width: 960px">
                </div>
                <div class="huzhu-top">
                    <div class="big-title">
                        <span id="xiangmu-btn" style="background: rgb(213, 213, 213); color: rgb(85, 85, 85);">互助项目</span>
                        <span id="huodong-btn" style="background: rgb(0, 124, 211); color: rgb(255, 255, 255);">线下活动</span>
                    </div>
                    <div class="clearfix"></div>
                    <div class="little-title" id="xiamgmu-title" style="display: none;">
                        <a href="#"><span class="title-active" style="margin-left: 10px">互助众筹</span></a>
                        <a href="#"><span>回报众筹</span></a>
                        <a href="#"><span>产品众筹</span></a>
                        <a href="#"><span>一元众筹</span></a>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="line"></div>
                <div class="person-article-lists" id="xiangmu" style="display: none;">
                    <div class="article-item">
                        <div class="row m0 huzhubox"></div>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="weizhuye-activity" id="huodong" style="display: block;">
                    <div class="person-article-lists row m0"></div>
                </div>
            `
const goodsBox = `
                <div id="goodsBox">
                <div style="width: 100%;height:235px; background:url(/common/img/0158.png) no-repeat center;">
                    <img src="/common/img/0158.png" alt="" style="height: 235px">
                </div>
                <p class="huiyuantegong">会<span>/</span>员<span>/</span>特<span>/</span>供</p>
                <div class="person-goods-lists">
                    <div class="row p-t-3" style="background: white;"></div>
                </div>
                </div>
            `

const channel = window.location.pathname.split('/').pop();
const seqlist = ['nav-news', 'nav-org', 'nav-help', 'nav-share'];
const district = ['home', 'organization', 'huzhu', 'goodsBox'];
const content = [
    {pos: 1, name: '新闻', ename: 'xw', cont: ['视频新闻', '图片新闻', '专题', '本会新闻'], val: 'home'},
    {pos: 2, name: '组织', ename: 'zz', cont: ['商会介绍', '联席会议', '组委会', '总会党委'], val: 'organization'},
    {pos: 3, name: '互助', ename: 'hz', cont: ['互助项目', '线下活动', '其他'], val: 'huzhu'},
    {pos: 4, name: '共享', ename: 'gx', cont: ['秦商特供', '秦商项目', '秦商课堂', '秦商直播'], val: 'goodsBox'}
];
const _init = [1,2,3,4];

const genSideBar = (ns) => {
    return ns.map((x, i) => {
        $("." + seqlist[i] + '-title').text(x.name);
        $("." + seqlist[i] + '-content ul').append(
            x.cont.map(x => `<li>${x}</li>`).join('')
        )
        $("." + district[i]).append(eval(x.val));
        if (x.ename == 'hz' || x.ename == 'gx') {
            $("." + district[i]).css('padding-bottom', '45px');
        }
    })
}

const findId = (pos, c) => c.filter(x => x.pos == pos)
const newSeq = (seq) => {
    return seq.map(x => findId(x, content)[0])
}

let seq = [], remb = [], hd = [];

const fill = (seq) => _init.map(x => {
    if (seq.indexOf(x) == -1) {
        seq.push(x);
        hd.push(x);
    }
})

const req = () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: apiUrl + "cms/setting/show",
            dataType: 'json',
            success: function(data){
                resolve(JSON.parse(data.data.blocks));
            }
        })
    })
}

req().then((data) => {
    // console.log(data)
    for (key in data) {
        if (data[key].show == 1) {
            seq[data[key].sort -1] = content.filter(c => key == c.ename)[0].pos;
        }
    }
    if (channel != '') {
        // seq = [...[content.filter(c => channel == c.ename)[0].pos], ...seq].reduce((r, e) => r.indexOf(e) != -1 ? r : [...r, e], []);
        seq = [content.filter(c => channel == c.ename)[0].pos]
        fill(seq); //填充seq;
        let len = hd.length; //背景图填充宽度
        genSideBar(newSeq(seq)); //生成栏目
        $("#beijing").css("left", 1365 - (105 * len) + 'px');
        if (channel == 'gx' || channel == 'hz') {
            $(".main").css({
                'height': '100%',
                'overflow': 'auto'
            })
        }
    } else {
        let lid = new Array(seq.length).fill(0); //生成显示栏目对应序列的数组
        fill(seq); //填充seq;
        let len = hd.length; //背景图填充宽度
        genSideBar(newSeq(seq)); //生成栏目
        if (len > 3) {
            $("#beijing").css("left", 1365 - (105 * 3) + 'px');
        } else {
            $("#beijing").css("left", 1365 - (105 * len) + 'px');
        }
        lid.map((x, i) => i).map((x, i) => i).map(x => $("#" + seqlist[x]).show());
    }
    $("#nav-news").hide();
    // $(document).ready(function(){

    //resize
    var setHeight = function(ch){
        $(".left-nav").css("height", ch);
        //$("#right-nav, #nav-news, #nav-org, #nav-news, #nav-help, #nav-share").css("height", ch);
    }

    var showLogin = false; //调整窗口大小时登陆框是否存在
    var width = $(window).width() / 2 - 180;
    var height = $(window).height() / 2 - 165;
    var currWidth = $(window).width();
    var currHeight = $(window).height();
    setHeight(currHeight + 10);
    if (currHeight > 768 && currHeight < 992){
        $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.75 + "px");
    } else if (currHeight >= 992){
        $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.72 + "px");
    } else {
        $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.67 + "px");
    }
    $(window).resize(function(){
        currWidth = $(window).width();
        currHeight = $(window).height();
        width = $(window).width() / 2 - 180;
        height = $(window).height() / 2 - 165;
        setHeight(currHeight);
        //console.log(currHeight)
        if (currHeight > 768 && currHeight < 992){
            $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.75 + "px");
        } else if (currHeight >= 992 && currHeight < 1265){
            $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.72 + "px");
        } else if (currHeight < 768) {
            $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.67 + "px");
        }

        //console.log(currPage)
        if (showLogin){
            router('login');
        }
    })

    //login's back button
    $(".back").click(function(){
        $(".left-nav").show();
        $(".article").hide();
        $(".login").hide();
        $(".read").hide();
        if (currPage == "read"){
            showLogin = false;
            $("#" + currPage).show();
        } else {
            showLogin = false;
            $("." + currPage).show();
        }
    })

    //搜索
    /*$("#hs span:eq(1) img").click(function(){
        window.location.href = 'http://new.wezchina.com/' + 'search?title=' + $("#search").val() + '&channel=news';
    })*/

    //首页新闻中心
    $("#center").click(function(e){
        var newsId = $(e.target).attr("class");
        if (newsId == 'news-title') {
            //prevPage = currPage;
            //currPage = 'read';
            $(".home").hide();
            $("#right-nav").hide();
            // mySwiper.stopAutoplay();
            // mySwiper1.stopAutoplay();
            //loadArticle('', '', '新闻中心');
            //$(".read").show();
            var currHeight = $(".read").height();
            setHeight(currHeight);
        }
    })

    //首页接口
    //轮播图模板
    var swiperTemplete = function(data){
        var imgUrl = data.image;
        if (imgUrl.indexOf('http') === -1){
            // imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
            imgUrl = imgSet(imgUrl, 470, 250, 3);
        }

        var templete =
            '<div class="swiper-slide" id=' + data.weid + '>' +
                '<div style="width: 470px; height: 250px; background: url(' + imgUrl + ') no-repeat center; background-size: 100% 100%">' +
                    '<div class="sw-bg"></div>' +
                    '<div class="sw-wd">' + data.title + '</div>' +
                '</div>' +
            '</div>';

        return templete;
    }

    //头条新闻模板
    var mainNews = function(data){
        var href = data.channel_domain + "/" + data.weid;
        var summary = data.summary;
        if (summary.length > 140) {
            summary = summary.substring(0, 140) + '... ';
        }    

        var templete =
        '<div class="main-news-title"><img src="/common/img/topline.png" /><a href=' + href + ' target="_blank">' + data.title.substring(0,20) + '</div>' +
        '<div class="main-news-content"><a href=' + href + ' target="_blank">' + summary + ' <span>[查看全文]</span></div>';

        return templete;
    }

    //新闻中心模板和公示公告模板
    var centerNews = function(data, type){
        var href = type + "/" + data.weid;
        var title = data.title.substring(0, 18);
        var dt = new Date(data.created_at * 1000);
        var month = (dt.getMonth() + 1).toString().length == 1 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        var day = dt.getDate().toString().length == 1 ? '0' + dt.getDate() : dt.getDate(); 

        var templete =
            '<div class="news-line">' +  //通过id获取文章内容
            '<div class="news-type" id=' + data.cate_id + '>[' + data.cate_title + ']</div>' +
            '<div class="news-title" id=' + data.weid + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="news-date">' + dt.getFullYear() + '-' + month + '-' + day + '</div>' +
            '</div>'

        return templete;
    }

    //
    /*var centerNotice = function(data){
        var href = "org/" + data.weid;
        var title = data.title.substring(0, 18);
        var dt = new Date(data.created_at * 1000);
        var month = (dt.getMonth() + 1).toString().length == 1 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        var day = dt.getDate().toString().length == 1 ? '0' + dt.getDate() : dt.getDate();

        var templete =
            '<div class="news-line">' +  //通过id获取文章内容
            '<div class="news-type" id=' + data.cate_id + '>[' + data.cate_title + ']</div>' +
            '<div class="news-title" id=' + data.weid + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="news-date">' + dt.getFullYear() + '-' + month + '-' + day + '</div>' +
            '</div>'

        return templete;
    }*/

    //特别推荐模板
    var specialRecommend = function(data, url){
        var href = data.channel_domain + "/" + data.weid;
        var title = data.title.substring(0, 14);
        var dt = new Date(data.created_at * 1000);
        var month = (dt.getMonth() + 1).toString().length == 1 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        var day = dt.getDate().toString().length == 1 ? '0' + dt.getDate() : dt.getDate(); 

        var templete =
            '<div class="rcd-news-line" id=' + data.weid + '>' +
            '<div class="rcd-news-title" id=' + data.cate_id + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="rcd-news-date">[' + dt.getFullYear() + '-' + month + '-' + day + ']</div>' +
            '</div>'

        return templete;
    }
    
    //会员推荐模板
    var memberRecommend = function(data, url){
        var href = "/" + data.domain + "/article/" + data.weid; //需要动态验证domain
        var title = data.title.substring(0, 14);

        var templete =
            '<div class="rcd-news-line" id=' + data.weid + '>' +
            '<div class="rcd-news-title" id=' + data.cate_id + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="rcd-news-date">[' + data.created_at.substring(0, 10) + ']</div>' +
            '</div>'

        return templete;
    }

    //会员轮播图模板
    var memberCnt = 0;
    var memberTemplete = function(data, flag){        
        var memberId = 'member_' + memberCnt;    
        var imgUrl = data.avatar;
        if (imgUrl != null && imgUrl.indexOf('http') === -1 && imgUrl.indexOf('common') === -1){
            imgUrl = imgSet(imgUrl, 80, 100);
        } else if (imgUrl == null) {
            imgUrl = '/common/img/avatar.png';
        }

        if (flag) {
            var templete =
            '<div class="rolling_img">' +
                '<a href="/u/' + data.weid + '">' + 
                    '<div class="imgs-style">' +
                        '<div class="imgs-member">' +
                            '<img src=' + imgUrl + ' width="80"/>' +
                        '</div><div class="img-title1">' +
            '<div id=' + memberId + ' style="width: 100%; height: 35px; text-align: center; line-height: 35px; margin-top: 5px; font-size: 15px; font-weight: 600;" class="imgs-name1">' + data.real_name + '</div>' +
            '<div style="width: 100%; height: 63px; text-align: center; line-height: 2em;" class="imgs-occupation">' + data.real_name + '</div>' +
                    '</div></div>' +
                '</a>' + 
            '</div>'
        } else {
            var templete =
            '<div class="rolling_img">' +
                '<a href="/u/' + data.weid + '">' + 
                    '<div class="imgs-style">' +
                        '<div class="imgs-member">' +
                            '<img src=' + imgUrl + ' width="80"/>' +
                        '</div>' +
                        '<div id=' + memberId + ' style="width: 100%; height: 33px; text-align: center; line-height: 33px;">' + data.real_name + '</div>' +
                        '<div style="width: 100%; height: 63px; text-align: center; line-height: 2em;" class="imgs-occupation">' + data.real_name + '</div>' +
                    '</div>' +
                '</a>' + 
            '</div>'
        }

        memberCnt++;

        return templete;
    }

    //右侧滚动广告模板
    var advTemplete = function(data){
        var imgUrl = data.image;
        if (imgUrl.indexOf('http') === -1){
            imgUrl = imgSet(imgUrl, 136, 47);
        }
        var templete = '<div class="swiper-slide" id=' + data.weid + '>' +
                '<a href=' + data.url + '>' +
                    '<img src=' + imgUrl + ' alt=""/>' +
                '</a>' +
            '</div>'

        return templete;
    }

    // 设置keyframes属性
    function addKeyFrames(y){
        var style = document.createElement('style');
        style.type = 'text/css';
        var keyFrames = `
        @-webkit-keyframes rowup {
            0% {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }
            100% {
                -webkit-transform: translate3d(A_DYNAMIC_VALUE, 0, 0);
                transform: translate3d(A_DYNAMIC_VALUE, 0, 0);
            }
        }
        @keyframes rowup {
            0% {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }
            100% {
                -webkit-transform: translate3d(A_DYNAMIC_VALUE, 0, 0);
                transform: translate3d(A_DYNAMIC_VALUE, 0, 0);
            }
        }`;
        style.innerHTML = keyFrames.replace(/A_DYNAMIC_VALUE/g, y);
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    //首页轮播，广告，秦商风采接口
    var loadHome = function(){
        $.ajax({
            url: CMS_ADVS,
            dataType: 'json',
            success: function(data){
                console.log(data.data);
                //var url = data.data.http_url
                //固定初始化数据
                var mainData = {
                    "code": 200,
                    "message": "Success",
                    "data": {
                        "setting": {
                            "weid": "40b22ea0-7d80-11e7-ad28-4597a657c8fc",
                            "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                            "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                            "title": "全球秦商联合会",
                            "description": "全球秦商联合会",
                            "key_word": "秦商,三秦,企业家",
                            "icp": "陕备00001",
                            "favicon": "plats/resource/1505225663330.ico",
                            "logo": "plats/resource/1505818319879.png",
                            "background": "plats/resource/1505224124768.png",
                            "weibo_show": "<iframe width=\"100%\" height=\"550\" class=\"share_self\"  frameborder=\"0\" scrolling=\"no\" src=\"http://widget.weibo.com/weiboshow/index.php?language=&width>=0&height=550&fansRow=2&ptype=1&speed=100&skin=5&isTitle=0&noborder=1&isWeibo=1&isFans=0&uid=5893762449&verifier=72fb1d4f&dpc=1\"></iframe>",
                            "status": 1,
                            "created_at": "2017-08-07 15:26:02",
                            "updated_at": "2017-09-23 00:40:53",
                            "background_up": "plats/resource/1505224112025.png",
                            "bar1": "plats/resource/1505282747776.png",
                            "bar2": "plats/resource/1505282752506.png",
                            "bar3": "plats/resource/1505282760313.png",
                            "background_right": "plats/resource/1506098910195.jpg",
                            "bar4": "plats/resource/1505282766718.png"
                        },
                        "banners": {
                            "list": [
                                {
                                    "weid": "ac9a7d80-88a0-11e7-b014-f379980097f5",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "8668f180-765b-11e7-b0b8-8fa37bb824de",
                                    "title": "不畏艰险，坚韧不懈",
                                    "image": "plats/resource/1505116141767.png",
                                    "url": "#",
                                    "created_at": "2017-08-24 15:48:53",
                                    "updated_at": "2017-09-11 15:43:21",
                                    "plat_admin_id": "d3f06a11-6c47-11e7-a12a-00e04c8cace4"
                                },
                                {
                                    "weid": "a9b0b560-783c-11e7-95e2-8f6967ff6bc3",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "8668f180-765b-11e7-b0b8-8fa37bb824de",
                                    "title": "风采",
                                    "image": "/common/img/init/1501758711620.png",
                                    "url": "http://www.qqxqs.com",
                                    "created_at": "2017-08-03 19:12:39",
                                    "updated_at": "2017-08-15 09:40:05",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "83677f40-783c-11e7-bfe3-6b01e79883a5",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "8668f180-765b-11e7-b0b8-8fa37bb824de",
                                    "title": "秦人共携手，谱写新篇章",
                                    "image": "/common/img/init/1501758672924.jpg",
                                    "url": "#",
                                    "created_at": "2017-08-03 19:11:35",
                                    "updated_at": "2017-08-03 19:11:35",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "c2dcb990-783b-11e7-b3a9-636acfa1a3d3",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "8668f180-765b-11e7-b0b8-8fa37bb824de",
                                    "title": "梦想起航",
                                    "image": "/common/img/init/1501750575778.png",
                                    "url": "#",
                                    "created_at": "2017-08-03 19:06:12",
                                    "updated_at": "2017-08-03 19:06:12",
                                    "plat_admin_id": null
                                }
                            ],
                            "total": 4
                        },
                        "blocks": {
                            "list": [
                                {
                                    "weid": "7a6b6240-78f2-11e7-b63a-c94ccd7e1ba2",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "05d48da0-782b-11e7-8a40-2906333090db",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "/common/img/init/1501761945347.png",
                                    "url": "#",
                                    "created_at": "2017-08-04 16:54:08",
                                    "updated_at": "2017-08-07 22:14:55",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "6dc6bc10-78f2-11e7-bb75-631eed60fede",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "05d48da0-782b-11e7-8a40-2906333090db",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "/common/img/init/1502194735999.jpg",
                                    "url": "#",
                                    "created_at": "2017-08-04 16:53:47",
                                    "updated_at": "2017-08-04 16:53:47",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "5403a120-7844-11e7-8d41-3bfd004b4150",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "/common/img/init/1502194432997.jpg",
                                    "url": "#",
                                    "created_at": "2017-08-03 20:07:32",
                                    "updated_at": "2017-08-03 20:07:32",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "4c4100e0-7844-11e7-a4d8-1f3fc791114f",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "/common/img/init/1501762029987.png",
                                    "url": "#",
                                    "created_at": "2017-08-03 20:07:19",
                                    "updated_at": "2017-08-03 20:07:19",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "42a03f60-7844-11e7-ab6a-6154caa20645",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "/common/img/init/1501762014177.png",
                                    "url": "#",
                                    "created_at": "2017-08-03 20:07:02",
                                    "updated_at": "2017-08-03 20:07:02",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "35c99600-7844-11e7-b07e-77b9b10a9a5c",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "/common/img/init/1501761945347.png",
                                    "url": "#",
                                    "created_at": "2017-08-03 20:06:41",
                                    "updated_at": "2017-08-03 20:06:41",
                                    "plat_admin_id": null
                                }
                            ],
                            "total": 6
                        },
                        "block": {
                            "list": [
                                {
                                    "weid": "1fb86860-9853-11e7-aa48-61c3bee41533",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "988a7980-765b-11e7-ac51-05d65085c74e",
                                    "title": "建设频道",
                                    "image": "/common/img/init/1505287295640.jpeg",
                                    "url": "",
                                    "created_at": "2017-09-13 15:14:04",
                                    "updated_at": "2017-09-13 15:14:04",
                                    "plat_admin_id": "d3f06a11-6c47-11e7-a12a-00e04c8cace4"
                                },
                                {
                                    "weid": "5403v130-7844-11e7-8d41-3bfd004c4350",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "988a7980-765b-11e7-ac51-05d65085c74e",
                                    "title": "推荐栏目3",
                                    "image": "#",
                                    "url": "",
                                    "created_at": "2017-08-03 20:07:32",
                                    "updated_at": "2017-09-18 23:02:31",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "5403a120-7844-11e7-8d41-3bfd004c4350",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "988a7980-765b-11e7-ac51-05d65085c74e",
                                    "title": "推荐栏目2",
                                    "image": "#",
                                    "url": "",
                                    "created_at": "2017-08-03 20:07:32",
                                    "updated_at": "2017-09-18 23:03:30",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "5403a120-7844-11e7-8d41-3bfd004c4250",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "988a7980-765b-11e7-ac51-05d65085c74e",
                                    "title": "推荐栏目1",
                                    "image": "#",
                                    "url": "",
                                    "created_at": "2017-08-03 20:07:32",
                                    "updated_at": "2017-09-18 23:04:38",
                                    "plat_admin_id": null
                                }
                            ],
                            "total": 5
                        },
                        "center": {
                            "weid": "caf4ba80-7842-11e7-a96a-0f4ed8ddf1ee",
                            "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                            "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                            "type_id": "94a9fc80-765b-11e7-b7cf-bdb6f064db85",
                            "title": "中间横幅",
                            "image": "/common/img/init/1501761278964.png",
                            "url": "http://new.wezchina.com/dw",
                            "created_at": "2017-08-03 19:56:32",
                            "updated_at": "2017-09-13 15:30:47",
                            "plat_admin_id": null
                        },
                        "peoples_title": {
                            "weid": "8143fd60-8182-11e7-9aa6-1d7f42474f32",
                            "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                            "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                            "type_id": "a56119c0-765b-11e7-a42e-770589f0cdd7",
                            "title": "风采",
                            "image": "#",
                            "url": "#",
                            "created_at": "2017-08-15 14:25:17",
                            "updated_at": "2017-08-19 13:53:35",
                            "plat_admin_id": "d3f06a11-6c47-11e7-a12a-00e04c8cace7"
                        },
                        "leader": {
                            "weid": "687148a0-7842-11e7-beeb-1d983f6bd8a4",
                            "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                            "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                            "type_id": "a139f5b0-765b-11e7-9a47-a55169e15a6d",
                            "title": "商会会长",
                            "image": "/common/img/init/1501747945200.jpg",
                            "url": "#",
                            "created_at": "2017-08-03 19:53:47",
                            "updated_at": "2017-08-03 19:53:47",
                            "plat_admin_id": null
                        },
                        "users": [
                            {
                                "weid": "77e41d20-72ad-11e7-8825-933924ec5963",
                                "avatar": "/common/img/init/1501747962172.jpg",
                                "real_name": "孙国栋",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "f6ee5110-75a0-11e7-a8b2-7179f2349d50",
                                "avatar": "/common/img/init/1501747874443.jpg",
                                "real_name": "张荣林",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "f4e7c590-7686-11e7-bdd1-bd45557ed232",
                                "avatar": "/common/img/init/1501747932796.jpg",
                                "real_name": "李国华",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "983ad200-7698-11e7-87c1-41f823b6258c",
                                "avatar": "/common/img/init/1501747945200.jpg",
                                "real_name": "康宁",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "1acc8080-769f-11e7-afe9-a1e618177dd9",
                                "avatar": "/common/img/init/1501747979135.jpg",
                                "real_name": "森朝",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "6ffe16d0-7737-11e7-aa93-d54026432560",
                                "avatar": "/common/img/init/1501747999786.jpg",
                                "real_name": "李雄",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "349e6fa0-7837-11e7-b217-671a38e00778",
                                "avatar": "/common/img/init/1501747999786.jpg",
                                "real_name": "康宁",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "934c7b10-78dd-11e7-94c8-015cbd20044d",
                                "avatar": "/common/img/init/1501837469772.jpg",
                                "real_name": "吕家劲",
                                "nickname": "黄易"
                            }
                        ]
                    },
                    "token": null
                }

                //显示header
                var addBg = (url, id, w, h) => {
                    $(id).css({
                        'background': 'url(' + imgSet(url, w, h) + ') no-repeat center',
                        'background-size': '100%'
                    })
                }

                addBg(data.data.header1.image, '#hl', 196, 45);
                addBg(data.data.header2.image, '#big', 960, 235);

                var time = setTimeout(() => {
                        $(".header").fadeOut(500);
                    }, 60000);

                $(".main").mouseenter(() => {
                    clearTimeout(time);
                    $(".header").fadeIn(500);
                })

                $(".main").mouseleave(() => {
                    time = setTimeout(() => {
                        $(".header").fadeOut(500);
                    }, 1000)
                })

                //生成轮播图，通过weid查找图片对应的url
                var swiper = data.data.banners.list;
                var block = data.data.block.list;
                var blocks = data.data.blocks.list;
                var users = data.data.users;
                var link = data.data.link;
                var link_list = [];
                var link_tpl = '';
                var link_cont = '';
                var init_key = '';
                for (var key in link) {
                    link_tpl += `<li id="${key}">${link[key].title}</li>`;
                    link_list.push(key);
                }
                //默认显示
                var init_list = (key) => {
                    $("#" + key).css({
                        "color": "#fff",
                        "background": "#4fb7ff"
                    })
                    link_cont = '';
                    link[key].list.map(x => {
                        link_cont += `<a href="${x.url}" target="_blank"><li>${x.title.length > 8 ? x.title.substr(0, 8) : x.title}</li></a>`
                    });
                    $("#link-page ul").html('');
                    $("#link-page ul").append(link_cont);
                }

                init_key = link_list[0];
                setTimeout(function(){
                    init_list(init_key);
                }, 500);

                $("#link-title").append(link_tpl);
                $("#link-title").click(function(e) {
                    var key = $(e.target).attr('id');
                    if (link_list.indexOf(key) != -1) {
                        link_list.filter(x => x != key).map(x => {
                            $("#" + x).css({
                                "color": "#000",
                                "background": "#fff"
                            });
                        })
                        init_list(key)
                    }
                })


                var swiperUrl = [];
                if (swiper != '') {
                    swiper.map(x => {
                        swiperUrl.push({id: x.weid, url: x.url});
                        $(".carousel").append(swiperTemplete(x));
                    });
                } else {
                    mainData.data.banners.list.map(x => {
                        swiperUrl.push({id: x.weid, url: x.url});
                        $(".carousel").append(swiperTemplete(x));
                    });
                }

                var mySwiper = new Swiper ('#my-swiper', {
                    direction: 'horizontal',
                    loop: true,
                    speed: 1000,
                    autoplay : 3000,
                    autoplayDisableOnInteraction : false,
                    //pagination: '.swiper-pagination',
                    //paginationClickable :true,
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    grabCursor : true,
                    longSwipesRatio: 0.3,
                    touchRatio:1,
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:true,//修改swiper的父元素时，自动初始化swiper
                })

                $("#my-swiper").hover(function(){
                    $(".swiper-button-prev, .swiper-button-next").css("opacity", "0.6");
                }, function(){
                    $(".swiper-button-prev, .swiper-button-next").css("opacity", "0");
                });

                $("#carousel").click(function(e){
                    var id = $(e.target).parents(".swiper-slide").attr("id");
                    var res = swiperUrl.filter(x => id === x.id)
                    if (res != ""){
                        //window.location.href = res[0].url;
                        window.open(res[0].url);
                    }
                })

                //推荐链接
                var showBlock = setTimeout(function(){
                    if (block != '') {
                        var len = block.length;
                        for (var i = 0; i < len; i++) {
                            if (i < 4) {
                                $(".adv-left-" + i).html('<a href="' + block[len - i - 1].url + '" target="_blank">' + block[len - i - 1].title + '</a>');
                            }
                        }
                    } else {
                        var len = mainData.data.block.list.length;
                        for (var i = 0; i < len; i++) {
                            if (i < 4) {
                                $(".adv-left-" + i).html('<a href="' + mainData.data.block.list[len - i - 1].url + '" target="_blank">' + mainData.data.block.list[len - i - 1].title + '</a>');
                            }
                        }
                    }
                }, 0);

                //peoples title
                if (data.data.peoples_title != null) {
                    $(".imgs-title").text(data.data.peoples_title.title);
                } else {
                    $(".imgs-title").text('风采');
                }

                //会长
                var chairman = setTimeout(function() {
                    if (data.data.leader != null) {
                        if (data.data.leader.image.indexOf('http') == -1) {
                            data.data.leader.image = ApiMaterPlatQiniuDomain + data.data.leader.image;
                        }
                        $(".imgs-chairman").html('<a href=' + data.data.leader.url + '><img src=' + data.data.leader.image + ' width="158" height="154" /></a>');
                        $(".imgs-name").html(data.data.leader.title);
                        $(".imgs-occupation-leader").text(data.data.leader.title)
                    } else {
                        $(".imgs-chairman").html('<a href=' + mainData.data.leader.url + '><img src=' + mainData.data.leader.image + ' width="158" height="154" /></a>');
                        $(".imgs-name").html(mainData.data.leader.title);
                    }
                }, 0);

                var getUserInfo = function(){
                    $.ajax({
                        url: FOUNDER,
                        type: 'get',
                        success: function(data){
                            console.log(data);
                            if (data.code == 200){
                                var info = data.data;
                                var weid = info.weid;
                                /*//$(".imgs-chairman").html('<a href=' + '/article/list' + weid + '><img src=' + info.avatar + ' width="80"/></a>');
                                $(".imgs-chairman").html('<a href="/article/list"><img src=' + info.avatar + ' width="80"/></a>');
                                $(".imgs-name").html(info.nickname);*/
                                 if(info.nickname==null){
                                    var nickname=info.real_name;
                                }else{
                                    var nickname=info.nickname;
                                }
                                localStorage.setItem("indexweid",weid);
                                localStorage.setItem("nickname",nickname);
                                localStorage.setItem("avatar",data.data.avatar);
                            }
                        },
                        error: function(xhr){
                            console.log(xhr);
                        }
                    })
                }

                getUserInfo();

                var kayFrame = function(result) {
                    var loopObj_list = "";
                    result.map(x => loopObj_list += memberTemplete(x, false));
                    var loopObj_list_html = "<div class='rolling_html'>"+ loopObj_list +"</div>"
                    $("#my-swiper1 .swiper_rolling").html(loopObj_list_html + loopObj_list_html);
                    var width = document.querySelector('.rolling_html').offsetWidth;
                    $("#my-swiper1").width(width);
                    document.querySelector('.swiper_rolling').className += ' rowup';
                }

                var kayFrames = function(result) {
                    var loopObj_list = "";
                    result.map(x => loopObj_list += memberTemplete(x, true));
                    var loopObj_list_html = "<div class='rolling_html'>"+ loopObj_list +"</div>"
                    $("#my-swiper1 .swiper_rolling").html(loopObj_list_html + loopObj_list_html);
                    var width = document.querySelector('.rolling_html').offsetWidth;
                    $("#my-swiper1").width(width);
                    document.querySelector('.swiper_rolling').className += ' rowup';

                    addKeyFrames( '-' + width + 'px' );
                }

                var init = function(){
                    if (users != '') {
                        if (users.length < 8) {
                            kayFrame(users);
                        } else {
                            kayFrames(users);
                        }                    
                    } else {
                        if(mainData.data.users.length < 8) {
                            kayFrame(mainData.data.users);
                        } else {
                            kayFrames(mainData.data.users);
                        }
                    }
                }
                init();

                $(".imgs-active").hover(function() {
                    $(".swiper_rolling").addClass("rowups");
                }, function() {
                    $(".swiper_rolling").removeClass("rowups")
                });

                //中间广告
                var centerAdv = data.data.center;
                if(centerAdv != null) {
                    var centerImg = centerAdv.image;
                    if (centerImg.indexOf('http') === -1) {
                        centerImg = imgSet(centerImg, 960, 83);
                    }
                    $("#bar").css({
                        "background": "url(" + centerImg + ") no-repeat center",
                        "background-size": "100% 100%"
                    })
                    $("#bar").click(function () {
                        window.location.href = centerAdv.url;
                    })
                } else {
                    $("#bar").css({
                        "background": "url(/common/img/middle_bg.png) no-repeat center",
                        "background-size": "100% 100%"
                    })
                    $("#bar").click(function () {
                        window.location.href = centerAdv.url;
                    })
                }

                //右侧滚动广告
                var cnt = 0;
                if (blocks != '') {
                    blocks.map(x => {
                        swiperUrl.push({id: x.weid, url: x.url});
                        if (cnt < 2) {
                            $(".adv-right-0").append(advTemplete(x));
                            cnt++;
                        } else if (cnt < 4) {
                            $(".adv-right-1").append(advTemplete(x));
                            cnt++;
                        } else if (cnt < 6) {
                            $(".adv-right-2").append(advTemplete(x));
                            cnt++;
                        }
                    })
                } else {
                    mainData.data.blocks.list.map(x => {
                        swiperUrl.push({id: x.weid, url: x.url});
                        if (cnt < 2) {
                            $(".adv-right-0").append(advTemplete(x));
                            cnt++;
                        } else if (cnt < 4) {
                            $(".adv-right-1").append(advTemplete(x));
                            cnt++;
                        } else if (cnt < 6) {
                            $(".adv-right-2").append(advTemplete(x));
                            cnt++;
                        }
                    })
                }

                var mySwiper2 = new Swiper ('#my-swiper2', {
                    direction: 'vertical',
                    loop: true,
                    slidesPerView : 1,
                    slidesPerGroup : 1,
                    speed: 1000,
                    autoplay : 2000,
                    autoplayDisableOnInteraction : false,
                    onlyExternal : true,
                    longSwipesRatio: 0.3,
                    touchRatio:1,
                    observer:true,
                    observeParents:true,
                })

                var mySwiper3 = new Swiper ('#my-swiper3', {
                    direction: 'vertical',
                    loop: true,
                    slidesPerView : 1,
                    slidesPerGroup : 1,
                    speed: 1000,
                    autoplay : 2000,
                    autoplayDisableOnInteraction : false,
                    onlyExternal : true,
                    longSwipesRatio: 0.3,
                    touchRatio:1,
                    observer:true,
                    observeParents:true,
                })

                var mySwiper4 = new Swiper ('#my-swiper4', {
                    direction: 'vertical',
                    loop: true,
                    slidesPerView : 1,
                    slidesPerGroup : 1,
                    speed: 1000,
                    autoplay : 2000,
                    autoplayDisableOnInteraction : false,
                    onlyExternal : true,
                    longSwipesRatio: 0.3,
                    touchRatio:1,
                    observer:true,
                    observeParents:true,
                })

                $(".adv-right").click(function(e){
                    var id = $(e.target).parents(".swiper-slide").attr("id");
                    var res = swiperUrl.filter(x => id === x.id);
                    if (res != ""){
                        //window.location.href = res[0].url;
                        window.open(res[0].url);
                    }
                })

                //其他设置
                var setting = data.data.setting;
                var bgImg = setting.background;
                var bar1 = setting.bar1;
                var bar2 = setting.bar2;
                var bar3 = setting.bar3;
                var bar4 = setting.bar4;
                var bgRight = setting.background_right;

                if(!bgImg) {
                    bgImg = "/common/img/news_top_img.png";
                } else if (bgImg.indexOf('http') != 0 && bgImg != "") {
                    bgImg = imgSet(bgImg, 960, 560, 3);
                }

                if(!bgRight) {
                    bgRight = "/common/img/news_top_img.png";
                } else if (bgRight.indexOf('http') != 0 && bgRight != "") {
                    bgRight = imgSet(bgRight, 960, 960, 3);
                }

                if(!bar1) {
                    bar1 = "/common/img/news_top_img.png";
                } else if (bar1.indexOf('http') != 0 && bar1 != "") {
                    bar1 = imgSet(bar1, 105, 960, 3);
                }

                if(!bar2) {
                    bar2 = "/common/img/news_top_img.png";
                } else if (bar2.indexOf('http') != 0 && bar2 != "") {
                    bar2 = imgSet(bar2, 105, 960, 3);
                }

                if(!bar3) {
                    bar3 = "/common/img/news_top_img.png";
                } else if (bar3.indexOf('http') != 0 && bar3 != "") {
                    bar3 = imgSet(bar3, 105, 960, 3);
                }

                if(!bar4) {
                    bar4 = "/common/img/news_top_img.png";
                } else if (bar4.indexOf('http') != 0 && bar4 != "") {
                    bar4 = imgSet(bar4, 105, 960, 3);
                }

                $("#home-body").css({ "background": "url(" + bgImg + ") no-repeat center", "background-size": "100% 100%", "opacity": "1"})
                //$("#beijing")  .css({ "background-image": "url(" + bgRight + ")",  "background-size": "50%"})
                $("#beijing")  .css({ "background-image": "url(" + bgRight + ")"})
                $("#nav-news") .css({ "background-image": "url(" + bar1 + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-org")  .css({ "background-image": "url(" + bar2 + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-help") .css({ "background-image": "url(" + bar3 + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-share").css({ "background-image": "url(" + bar4 + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" })

                //官方发布
                $("#release").html(setting.weibo_show);
                var script_status = false;
                var org = () => {
                    if(!script_status) {
                        $.getScript("/common/js/organized.js");
                        script_status = true;
                    }
                }

                var help = () => {
                    activitylist(localStorage.getItem("indexweid"),localStorage.getItem("nickname"),localStorage.getItem("avatar"),1,8);
                    projectcate(localStorage.getItem("indexweid"),localStorage.getItem("nickname"),localStorage.getItem("avatar"));
                    projectlist(localStorage.getItem("indexweid"),localStorage.getItem("nickname"),localStorage.getItem("avatar"),"",1);
                }

                var share = () => {
                    shoppinglist(localStorage.getItem("indexweid"),1);
                }
                //right side control
                var genEvt = () => {
                    // 首页新闻模块
                    $("#nav-news").click(function(){
                        $("#nav-news, .huzhu, .organization, .goodsBox").hide();
                        $(".home, #nav-help, #nav-share, #nav-org").show();
                        $("#nav-help,#nav-share").css("margin-left", "0");
                        $("#nav-org,#nav-help,#nav-share").css({ "position":"static", "left":"0" });
                        init();
                        // org();
                        mySwiper.startAutoplay();
                    })

                    // 首页组织模块
                    $("#nav-org").click(function(){
                        $(".home, #nav-org, .huzhu, .goodsBox").hide();
                        $("#nav-news, #nav-help, #nav-share, .organization").show();
                        $("#nav-org,#nav-share").css({ "margin-left": "0", "position":"static" });
                        $("#nav-help").css({ "position":"static", "left":"0", "margin-left":"105px" });
                        init();
                        org();
                        mySwiper.startAutoplay();
                        //mySwiper.stopAutoplay();
                    })

                    // 首页互助模块
                    $("#nav-help").click(function(){
                        homeState = "help";
                        $(".home, #nav-help, .organization, .goodsBox").hide();
                        $("#nav-news, #nav-org, #nav-share, .huzhu").show();
                        $("#nav-org").css({ "position":"absolute", "left":"-855px" });
                        $("#nav-help").css({ "margin-left": "0", "position":"static" });
                        $("#nav-share").css({ "position":"static", "left":"0", "margin-left":"210px" });
                        init();
                        // org();
                        mySwiper.startAutoplay();
                        //mySwiper.stopAutoplay();
                    })

                    // 首页共享模块
                    $("#nav-share").click(function(){
                        homeState = "share";
                        $(".home, .huzhu, #nav-share, .organization").hide();
                        $("#nav-news, #nav-org, #nav-help, .goodsBox").show();
                        $("#nav-share,#nav-help").css("margin-left", "0");
                        $("#nav-org").css({ "position":"absolute", "left":"-855px" });
                        $("#nav-help").css({ "position":"absolute", "left":"-750px" });
                        init();
                        // org();
                        mySwiper.startAutoplay();
                        //mySwiper.stopAutoplay();
                    })
                }

                genEvt();
                org();
                help();
                share();

                var title = setting.title;
                var favicon = setting.favicon;
                var keyWord = setting.key_word;
                var description = setting.description;
                var backgroundUp = setting.background_up;
                var logo = setting.logo;

                localStorage.setItem('fav', favicon);
                localStorage.setItem('logo', logo);
                localStorage.setItem('title', title);

                $('title').text(title);
                $('meta[name="keywords"]').attr('content', keyWord);
                $('meta[name="description"]').attr('content', description);

                if(favicon.indexOf('http') === -1){
                    favicon = ApiMaterPlatQiniuDomain + favicon;
                }
                $('#favicon').attr('href',favicon);

                if(backgroundUp.indexOf('http') === -1){
                    backgroundUp = imgSet(backgroundUp, 960, 424);
                }
                $('#home-head').css({
                    'background': "url(" + backgroundUp + ") no-repeat center",
                    'background-size': '100%'
                })
            }
        })
    }

    //读取首页新闻
    var loadNews = function(){
        $.ajax({
            url: CMS_INDEX_GRID,
            dataType: 'json',
            success: function(data){
                console.log(data.data);
                var vdinfo = data.data.spzx;
                var magazine = data.data.mag;
                var report = data.data.ztbd;
                $("#hbl div:eq(0) p:eq(0)").text(vdinfo.title);
                $("#hbl div:eq(0) p:eq(1)").html(`<a href="${'/' + vdinfo.domain}">更多>></a>`);
                $("#hbm div:eq(0) p:eq(0)").text(magazine.title);
                $("#hbm div:eq(0) p:eq(1)").html(`<a href="${'/magazine/' + magazine.domain}">更多>></a>`);
                $("#hbr div:eq(0) p:eq(0)").text(report.title);
                $("#hbr div:eq(0) p:eq(1)").html(`<a href="${'/' + report.domain}">更多>></a>`);
                var mgztpl = magazine.list.reduce((tpl, e, i) =>
                    i < 6 ? 
                    tpl += `<a href="${'/magazine/' + magazine.domain + '/' + e.weid}" target="_blank"><li><img src="${imgSet(e.cover, 94, 128)}" /></li></a>`
                    : tpl, '');

                var rptpl = report.list.reduce((tpl, e, i) => 
                    i < 4 ? tpl += `<a href="${'/' + report.domain + '/' + e.domain}" target="_blank"><li><img src="${imgSet(e.thumb_image, 240, 60)}" height="60" /></li></a>` : tpl, '');

                var vdtpl = vdinfo.list.reduce((tpl, e, i) =>
                    i >= 1 && i < 3 ?
                    tpl += `<div class="hbs"><p><a href="${vdinfo.domain + '/' + e.weid}">> ${e.title.substr(0, 16)}</p>
                    <p>${new Date(e.publish_time * 1000).getFullYear()}-${(new Date(e.publish_time * 1000).getMonth() + 1).toString().length == 1 ? '0' + (new Date(e.publish_time * 1000).getMonth() + 1) : new Date(e.publish_time * 1000).getMonth() + 1}-${new Date(e.publish_time * 1000).getDate().toString().length == 1 ? '0' + new Date(e.publish_time * 1000).getDate() : new Date(e.publish_time * 1000).getDate()}</p></div>`
                    : tpl, '')

                $("#hbm ul").append(mgztpl);
                $("#hbr ul").append(rptpl);
                $("#hbl").append(vdtpl);
                $(".hb1").html(`<a href="${vdinfo.domain + '/' + vdinfo.list[0].weid}">${vdinfo.list[0].title}</a>`);
                $(".hb2").html(vdinfo.list[0].summary);

                $("#hbl div:eq(1)").click(() => {
                    layer.open({
                      type: 2,
                      title: false,
                      area: ['800px', '480px'],
                      shade: 0.8,
                      closeBtn: 0,
                      shadeClose: true,
                      content: `http://image.qqxqs.com/qqxqs_video.mp4`
                    });
                })

                var newsCnt = 0;
                var noticeCnt = 0;
                var esNewsCnt = 0;
                data.data.hot.map(x => $(".main-news").append(mainNews(x))); //头条新闻
                data.data.news.map(x => {
                    if (newsCnt < 8) {
                        $("#center").append(centerNews(x, "news"));
                        newsCnt++;
                    }
                });//新闻中心
                data.data.nitoce.map(x => {
                    if (noticeCnt < 8) {
                        $("#sirase").append(centerNews(x, "org"));
                        noticeCnt++;
                    }
                });//公示公告
                data.data.especial_news.map(x => {
                    if (esNewsCnt < 4) {
                        $(".rcd-tb").append(specialRecommend(x, "read.html"));
                        esNewsCnt++;
                    }
                }); //特别推荐
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //读取会员推荐新闻
    var loadMemberNews = function(){
        $.ajax({
            url: ARTICLES,
            dataType: 'json',
            success: function(data){
                console.log(data.data);
                var esNewsCnt = 0;
                data.data.list.map(x => {
                    if (esNewsCnt < 4) {
                        $(".rcd-hy").append(memberRecommend(x, "readArticle.html"));
                        esNewsCnt++;
                    }
                }); //特别推荐
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    loadHome()
    loadNews();
    loadMemberNews();

    var newsItems = ['center', 'sirase', 'release'];
    var remove = function(arr, item){
        return arr.filter(x => x != item);
    }
    var rem = 'center';
    $(".center").css("border-bottom", "3px solid #4fb7ff");
    $(".center, .sirase, .release").hover(function(){
        $("." + rem).css("border-bottom", "none");
        $(this).css("border-bottom", "3px solid #4fb7ff");
        var item = $(this).attr('class').split(' ')[0];
        rem = item;
    }, function(){
        $("." + rem).css("border-bottom", "3px solid #4fb7ff");
        var res = remove(newsItems, rem);
        res.map(x => $("." + x).css("border-bottom", "none"));
    })

    //推荐新闻
    var tb = true;
    var hy = true;
    $(".sm-circle-tb").css({"background": "#01a7ff", "border": "none"});
    $(".tb").hover(function(){
        if (hy) {
            $(".hy").css({"background": "none", "color": "black"});
            $(".hy").find(".triangle-right-1").hide();
            $(".circle-hy").css("border", "1px solid #afafaf");
            $(".sm-circle-hy").css({"background": "", "border": "1px solid #afafaf"});
        }
        $(this).css({"background": "#01a7ff", "color": "white"});
        $(this).find(".triangle-right").show();
        $(".circle-tb").css("border", "1px solid #01a7ff");
        $(".sm-circle-tb").css({"background": "#01a7ff", "border": "none"});
        $(".rcd-tb").show();
        $(".rcd-hy").hide();
    }, function(){
    })

    $(".hy").hover(function(){
        if (tb) {
            $(".tb").css({"background": "none", "color": "black"});
            $(".tb").find(".triangle-right").hide();
            $(".circle-tb").css("border", "1px solid #afafaf");
            $(".sm-circle-tb").css({"background": "", "border": "1px solid #afafaf"});
        }
        $(this).css({"background": "#01a7ff", "color": "white"});
        $(this).find(".triangle-right-1").show();
        $(".circle-hy").css("border", "1px solid #01a7ff");
        $(".sm-circle-hy").css({"background": "#01a7ff", "border": "none"});
        $(".rcd-tb").hide();
        $(".rcd-hy").show();
    }, function(){
    })

    //friends
    var type = "fans";
    $("#friends").hide();
    $(".fans, .friends").click(function(){
        $("." + type).removeClass("active");
        $("#" + type).hide();
        type = $(this).attr("class");
        $(this).addClass("active");
        $("#" + type).show();
    })

    //news center
    var curr = "center";
    $("#sirase, #release").hide();
    $(".center, .sirase, .release").hover(function(){
        $("." + curr).removeClass("active");
        $("#" + curr).hide();
        curr = $(this).attr("class");
        $(this).addClass("active");
        $("#" + curr).show();
    }, function(){

    })

    //活动 start
     var listtemplate = function(data,nickname,avatar){
        var typetext="";
       if(data.type==1){
            typetext="免费";
       }else{
            typetext="收费";
       }

        //你设定的时间
        var aa=new Date(data.begain_time);
        var y=aa.getFullYear();
        var m=aa.getMonth()+1;
        var d=aa.getDate(); 
        //现在的时间
        var nn=new Date();
        var yn=nn.getFullYear();
        var mn=nn.getMonth()+1;
        var dn=nn.getDate();
        var timetext="";
        // alert((yn-y)+'年'+(mn-m)+'个月'+(dn-d)+'天之前')
        if((yn-y)>=1){
            timetext= (yn-y)+'年前';
        }else if((mn-m)>=1){
            timetext= (mn-m)+'月前';
        }else{
            if((dn-d)>0){
                timetext= (dn-d)+'天前';
            }else if((dn-d)==0){ 
                timetext= '今天';
            }else{
                timetext= Math.abs(dn-d)+'天后';
            }
        }

        if (avatar.indexOf('http') == -1) {
            avatar = ApiMaterPlatQiniuDomain + avatar;
        }

        var templete=
        '<div class="col-sm-3 p-r-0" style="margin-top: 15px;margin-bottom: 5px">'+
            '<div class="project-lists-one">'+
                '<div class="project-section">'+
                    '<div class="biaoti">热门活动</div>'+
                    '<div class="shijian"> '+timetext+'</div>'+
                    '<a href="'+data.domain+'/activity/'+data.weid+'" target="_blank" class="hover-img-box">'+
                        '<div class="posi-div"><img src="'+ApiMaterPlatQiniuDomain+data.cover+'" class="person-left-img"></div>'+
                    '</a>'+
                    '<img class="logo" src="'+avatar+'" alt="">'+
                    '<div class="project-username">'+nickname+'</div>'+
                '</div>'+

                '<div class="content">'+
                    '<div class="title ">'+
                        '<a class="font-weight" target="_blank" href="'+data.domain+'/activity/'+data.weid+'">'+data.title+'</a>'+
                    '</div>'+

                    '<div class="jutishijian">'+
                        '<span class="z"><i class="fa fa-clock-o"></i></span>'+data.begain_time+' ~ '+data.end_time+
                    '</div>'+
                    '<!--<div class="biaoqian">'+
                        '<span>人工智能</span> <span>智能软件</span>'+
                    '</div>-->'+
                    '<div class="didian">'+
                        '<i class="fa fa-map-marker"></i>'+
                        '<span class="address">'+data.area_name+'</span>'+
                        '<span class="y">'+typetext+'</span></div>'+
                '</div>'+
            '</div>'+
        '</div>';
        return templete;
    }

    // 1.获取活动列表
    var activitylist=function(weid,nickname,avatar,page,limit){
         var sendData={
            user_id:weid, 
            limit:limit,
            page:page,
            status:2,
            is_private:1
        }
        console.log(sendData);
        $.ajax({
            url:ACTIVITY_LIST,
            type:'post',
            data:sendData,
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                console.log(data);
                if(data.code == 200){
                    if(data.data.total>0){
                        if(page<=1){
                            $("#huodong .person-article-lists").children().remove();

                        }else{
                            $(".more").remove();
                        }
                        data.data.list.map(x =>{
                            $("#huodong .person-article-lists ").append(listtemplate(x,nickname,avatar));

                        }) 
                        var pagenum=Math.ceil(data.data.total/limit);//总页码
                        if(page<pagenum){
                            $("#huodong .person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>查看更多</div>");

                        }else{
                        $("#huodong .person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>这是我的底线啦~~~</div>");

                        }
                        page++;

                        $(".more").click(function(){
                            activitylist(weid,nickname,avatar,page,8);
                        })
                    }else{
                         $("#huodong .person-article-lists ").children().remove();
                        $("#huodong .person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>这是我的底线啦~~~</div>");

                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //活动 end
    //项目 start
    var projectlisttemplate = function(data,nickname,avatar){
        var typetext="";
        if(data.type==1){
            typetext="免费";
        }else{
            typetext="收费";
       }

       //你设定的时间
        var aa=new Date(data.date_start);
        var y=aa.getFullYear();
        var m=aa.getMonth()+1;
        var d=aa.getDate();
        //现在的时间
        var nn=new Date();
        var yn=nn.getFullYear();
        var mn=nn.getMonth()+1;
        var dn=nn.getDate();
        var timetext="";
        // alert((yn-y)+'年'+(mn-m)+'个月'+(dn-d)+'天之前')
        if((yn-y)>=1){
            timetext= (yn-y)+'年前';
        }else if((mn-m)>=1){
            timetext= (mn-m)+'月前';
        }else{
            if((dn-d)>0){
                timetext= (dn-d)+'天前';
            }else if((dn-d)==0){
                timetext= '今天';
            }else{
                timetext= Math.abs(dn-d)+'天后';
            }
        }

        var templete=`
        <div class="col-sm-3 " style="padding-left: 15px;padding-right: 0">
            <div class="project-lists-one">
                <div class="project-section">
                    <div class="shijian"> `+timetext+`</div>
                    <div class="yishou"><span class="span_left"></span><span class="span_status">`+data.onStatus+`</span><span class="span_right"></span></div>
                    <div class="zhonglei y xiang-mu-baio-zhi"><span> `+data.cate_name+` </span></div>
                    <a href="/`+data.domain+`/project/projectdetail/`+data.weid+`" target="_blank">
                        <div class="posi-div"><img src=`+ApiMaterPlatQiniuDomain+data.cover+` class="p100 person-left-img"></div>
                    </a>
                    <img class="logo" src=`+ApiMaterPlatQiniuDomain+avatar+` alt="">
                    <div class="project-username">`+nickname+`</div>
                </div>
                <div class="content">
                    <div class="title ">
                        <a class="font-weight" target="_blank" href="/`+data.domain+`/project/projectdetail/`+data.weid+`">`+data.title+`</a>
                    </div>                            
                    <div class="project-money">
                        <div class="shengluehao p0">
                           <span class="article-color ">目标金额<i class="y">`+data.amount+` 元</i></span>
                        </div>
                        <div class="shengluehao p0">
                         <span class="article-color"><span>已筹金额</span><i class="y">`+data.raise_amount+` 元</i></span>
                        </div>
                    </div>
                    <div class="article-item-user-image">
                       <p class="y m0">已有 <i>`+data.suport_num+` </i>人支持</p>
                    </div>
                </div>
            </div>
        </div>`;
        return templete;
    }


    // 1.获取项目列表
    var projectlist=function(weid,nickname,avatar,cateid,page){
        console.log(weid);
        var limit=8;
        var sendData={
            user_id:weid,
            cate_id:cateid,
            limit:limit,
            page:page,
            is_private:1            
        }
        console.log(sendData);
        $.ajax({
            url:PROJECT_LIST,
            type:'post',
            data:sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            //console.log(token)
            success:function(data){
                // console.log(data);
                if(data.code == 200){
                  if(cateid!=""){
                     if(page<=1){
                        $("#xiangmu .huzhubox").children().remove();                        

                    }

                  }
                    if(data.data.total>0){
                        if(page<=1){
                            $("#xiangmu .huzhubox").children().remove();

                        }else{
                            $(".more").remove();
                        }
                        data.data.list.map(x =>{
                            $("#xiangmu .huzhubox ").append(projectlisttemplate(x,nickname,avatar));

                        })
                         var pagenum=Math.ceil(data.data.total/limit);//总页码
                        if(page<pagenum){
                            $("#xiangmu .huzhubox ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>查看更多</div>");

                        }else{
                          $("#xiangmu .huzhubox").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')

                        }
                        page++;

                        $(".more").click(function(){
                            projectlist(weid,nickname,avatar,cateid,page);
                        })
                    }else{
                        $("#xiangmu .huzhubox").children().remove();
                        $("#xiangmu .huzhubox").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')
                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //2.1分类模板
    var catetemplate=function(data){
      var catehtml=` <a href="javascript:void(0);" data-id="`+data.weid+`"><span>`+data.name+`</span></a>`;
      return catehtml;
    }
    //2.获取项目分类
    var projectcate=function(userid,nickname,avatar){
       $.ajax({
            url:PROJECT_CATE_LIST,
            type:'post',
            data:{user_id:userid},
            headers: {
                'Token': localStorage.getItem('token')
            },
            success:function(data){
                if(data.code == 200){
                    $(".little-title").children().remove();
                    data.data.list.map(x => {
                      $(".little-title").append(catetemplate(x));
                    });
                    $(".little-title a").click(function(){
                      projectlist(userid,nickname,avatar,$(this).data("id"),1);
                    })
                }else{
                  mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //项目 end
    //商品列表
    var coverPicpath = '/common/img/products_load.jpg';
    var shopListTemplete = function(data){
        if(data.cover!=''){
            coverPicpath=ApiMaterPlatQiniuDomain+data.cover;
        }
        var templete=`
            <div class="col-sm-3  page-goods-index-p-r-2" data-id="`+ data.weid +`" id="product">
                <div class="project-lists-one" id="projectListOne">
                    <a href="/index/wemall/goods/`+data.weid+`" target="_blank">
                        <img src="` + coverPicpath +`" class="goods-height">
                    </a>
                    <div class="product-massage">

                        <p class="goods-name">
                            <a href="/index/wemall/goods/`+data.weid+`" target="_blank">`+ data.title +`</a>
                        </p>

                        <p class="goods-main">
                            `+ data.summary+`
                        </p>
                        <p class="product-price">
                            <i>￥</i>`+ data.price + `
                            <span class="y">市场价￥`+ data.marketprice +`</span>
                        </p>
                        <div class="yishouandshoucang">
                            <div class="z">已售<span class="time"> `+data.sales_num+` </span> </div>
                            <div class="y">收藏<span class="time"> `+ data.collections +` </span></div>
                        </div>

                        <a href="/index/wemall/goods/`+data.weid+`" class="white">
                            <div class=" buy-now">
                                立即购买
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        `;
    
        return templete;
    }
    var shoppinglist=function(weid,page){
        var limit=8;
        var keywords='';
         var sendData = {
            userId: weid,
            limit: limit,
            page: page,
            keywords: keywords
        }
        console.log(sendData);
        $.ajax({
            url:GOODS_LISTS_USER,
            type:'post',
            data: sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var shop = data.data.list;
                    /* if(shop.length==0){
                        ulnone($("."+tid));
                    }*/
                    if(data.data.total>0){
                      // $("#goodsBox .person-goods-lists .row").children().remove();
                       if(page<=1){
                            $("#goodsBox .person-goods-lists .row").children().remove();

                        }else{
                            $(".more").remove();
                        }
                        shop.map(x => {
                           
                            if(x.status==1){
                               $("#goodsBox .person-goods-lists .row").append(shopListTemplete(x));
                            }
                            else{
                                // $("."+tid).append('<p style="width:100%;height:100px;text-align:center;line-height:100px;">这家伙很懒，什么东西都没留下~~~</p>')
                            }
                          
                        })  
                          var pagenum=Math.ceil(data.data.total/limit);//总页码
                        if(page<pagenum){
                            $("#goodsBox .person-goods-lists .row").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>查看更多</div>");

                        }else{
                          $("#goodsBox .person-goods-lists .row").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')

                        }
                        page++;

                        $(".more").click(function(){
                            shoppinglist(weid,page);
                        })
                    }else{
                         $("#goodsBox .person-goods-lists .row").children().remove();
                        $("#goodsBox .person-goods-lists .row").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')
                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    $("#xiangmu-btn").on("click",function(){
        $("#xiangmu").show();
        $("#huodong").hide();
        $("#xiamgmu-title").show();
        $("#huodong-title").hide();
        $(this).css({"background":"#007cd3","color":"#fff"});
        $("#huodong-btn").css({"background":"#d5d5d5","color":"#555"})
    });
    $("#huodong-btn").on("click",function(){
        $("#huodong").show();
        $("#xiangmu").hide();
        $("#xiamgmu-title").hide();
        $("#huodong-title").show();
        $(this).css({"background":"#007cd3","color":"#fff"});
        $("#xiangmu-btn").css({"background":"#d5d5d5","color":"#555"})
    });
    // /!*导航*!/
    $('.index-nav-esse').find('a').hover(function () {
        $(this).css('background', 'rgb(217,217,217)');
        $(this).find('span').css('top', '40%');
        $(this).find('strong').css('display', 'block');
    }, function () {
        $(this).css('background', '');
        $(this).find('span').css('top', '50%');
        $(this).find('strong').css('display', 'none');
    });

    // /!*推荐新闻切换*!/
    {
        $('#zsyw').find('li').mouseover(function () {
            $(this).addClass('at').siblings('li').removeClass('at');
            $('.zsyw_nr').find('.pose_content').eq($(this).index()).show().siblings('.pose_content').hide();
        })
    }

    // /!*列表tab切换*!/
    $('#xwzx').find('li').mouseover(function () {
        // /!*热点新闻*!/
        //$('.syzx_rg').find('.syzx_rtj').eq($(this).index()).show().siblings('.syzx_rtj').hide();

        // /!*显示菜单*!/
        $(this).removeClass('not').addClass('at').siblings().removeClass('at').addClass('not');

        // /!*显示列表*!/
        $('.rnew_nr').find('.xwzx_c_0').eq($(this).index()).show().siblings('.xwzx_c_0').hide();
    });

    // /!*中部fadein图片自适应*!/
    $('.slideBox').find('img').css({'width': '960px', 'height': $('.slideBox').height()});

    // /!*中部fadein*!/
    // $(".slideBox").slide({mainCell: ".bd ul", effect: "fade", autoPlay: true});

    // /!*底部滚动*!/
    // $(".picScroll-left").slide({mainCell:".bd ul",autoPlay:true,effect:"leftMarquee",vis:8,interTime:50,trigger:"click"});

    // /!*整屏标签切换*!/
    $(document).ready(function() { 
        gongshanglian();
       $(window).bind("resize", function () {
            gongshanglian();
        });
        play_number(0);
    });

    function play_number(index) {
        if (index >= $("#stat span").length) return;
        var n = parseInt($("#stat span").eq(index).text(), 10);
        n++;
        if (n > $("#stat span").eq(index).attr("data-number")) {
            play_number(index + 1);
            return;
        }
        $("#stat span").eq(index).text(n);
        setTimeout(function () {
            play_number(index);
        }, 50);
    }

    function gongshanglian() {
        $(".huzhu").css("height", $("#main").height());
    }
// })
})



/**
 * Created by Hongguang on 2017/7/27.
 */

$(document).ready(function(){

    //resize
    var setHeight = function(ch){
        $(".left-nav").css("height", ch);
        $("#right-nav, #nav-news, #nav-org, #nav-news, #nav-help, #nav-share").css("height", ch);
    }

    var showLogin = false; //调整窗口大小时登陆框是否存在
    var width = $(window).width() / 2 - 180;
    var height = $(window).height() / 2 - 165;
    var currWidth = $(window).width();
    var currHeight = $(window).height();
    setHeight(currHeight + 10);
    if (currHeight > 768){
        $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.75 + "px");
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
        if (currHeight > 768){
            $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.75 + "px");
        } else {
            $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.67 + "px");
        }

        //console.log(currPage)
        if (showLogin){
            router('login');
        }
    })

    //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article', 'shopping'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal").show();
                $(".show-login").css({
                    "margin-left": width,
                    "margin-top": height
                });
                $(".show-login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href = "/index/article";
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = "/index/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })

    //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css("line-height", "50px");
            $("#" + id + " .word").css("margin-top", "-20px");
        } else {
            if (!isLogin) {
                $(this).find(".word").show();
                $(this).css("line-height", "50px");
                $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })

    //获取用户信息
    var getUserInfo = function(id){
        $.ajax({
            url: USERDETAIL + "/" + id,
            type: 'get',
            success: function(data){
                console.log(data);
                if (data.data != null){
                    var info = data.data;
                    var weid = info.weid;
                    var imgUrl = info.avatar;
                    //console.log(weid)
                    if (imgUrl.indexOf('http') === -1){
                        imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
                        console.log(imgUrl)
                        localStorage.setItem('avatar', imgUrl);
                        showLogin = false;
                        isLogin = true;
                        //加载用户头像
                        $("#login div img").hide();
                        $(".log-head").css({
                            'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
                            'background-size': '100% 100%'
                        })
                        $(".log-head").show();
                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //主页初始化
    var init = function(token){
        getUserInfo(localStorage.getItem('weid'));
    }

    var token = localStorage.getItem('token');
    if (token != null) {
        init(token);
    }

    //关闭登录模态框
    $(".close").click(function(){
        showLogin = false;
        $("#modal").hide();
        $(".show-login").hide();
        $("body").css("overflow", "auto");
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

    //首页新闻中心
    $("#center").click(function(e){
        var newsId = $(e.target).attr("class");
        if (newsId == 'news-title') {
            //prevPage = currPage;
            //currPage = 'read';
            $(".home").hide();
            $("#right-nav").hide();
            mySwiper.stopAutoplay();
            mySwiper1.stopAutoplay();
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
            imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
        }

        var templete =
            '<div class="swiper-slide" id=' + data.weid + '>' +
            '<div style="width: 470px; height: 250px; background: url(' + imgUrl + ') no-repeat center; background-size: 100% 100%">' +
                //'<a href=' + data.url + '>' +
                '<div class="sw-bg"></div>' +
                '<div class="sw-wd">' + data.title + '</div>' +
                //'</a>' +
            '</div>' +
            '</div>';

        return templete;
    }

    //头条新闻模板
    var mainNews = function(data){
        var href = "news/" + data.weid;
        var summary = data.summary.substring(0, 86);

        var templete =
        '<div class="main-news-title"><a href=' + href + ' target="_blank">' + data.title.substring(0,20) + '</div>' +
        '<div class="main-news-content"><a href=' + href + ' target="_blank">' + summary + '... [查看全文]</div>';

        return templete;
    }

    //新闻中心模板
    var centerNews = function(data){
        var href = "news/" + data.weid;
        var title = data.title.substring(0, 18);
        var dt = new Date(data.created_at * 1000);
        var month = dt.getMonth() + 1;

        var templete =
            '<div class="news-line">' +  //通过id获取文章内容
            '<div class="news-type" id=' + data.cate_id + '>[' + data.cate_title + ']</div>' +
            '<div class="news-title" id=' + data.weid + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="news-date">' + dt.getFullYear() + '-' + month + '-' + dt.getDate() + '</div>' +
            '</div>'

        return templete;
    }

    //公示公告模板
    var centerNotice = function(data){
        var href = "notice/" + data.weid;
        var title = data.title.substring(0, 18);
        var dt = new Date(data.created_at * 1000);
        var month = dt.getMonth() + 1;

        var templete =
            '<div class="news-line">' +  //通过id获取文章内容
            '<div class="news-type" id=' + data.cate_id + '>[' + data.cate_title + ']</div>' +
            '<div class="news-title" id=' + data.weid + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="news-date">' + dt.getFullYear() + '-' + month + '-' + dt.getDate() + '</div>' +
            '</div>'

        return templete;
    }

    //特别推荐模板
    var specialRecommend = function(data, url){
        var href = "news/" + data.weid;
        var title = data.title.substring(0, 18);

        var templete =
            '<div class="rcd-news-line" id=' + data.weid + '>' +
            '<div class="rcd-news-title" id=' + data.cate_id + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="rcd-news-date">[' + data.created_at.substring(0, 10) + ']</div>' +
            '</div>'

        return templete;
    }
    
    //会员推荐模板
    var memberRecommend = function(data, url){
        var href = "/" + data.domain + "/article/" + data.weid; //需要动态验证domain
        var title = data.title.substring(0, 18);

        var templete =
            '<div class="rcd-news-line" id=' + data.weid + '>' +
            '<div class="rcd-news-title" id=' + data.cate_id + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="rcd-news-date">[' + data.created_at.substring(0, 10) + ']</div>' +
            '</div>'

        return templete;
    }

    //会员轮播图模板
    var memberTemplete = function(data){
        var templete =
            '<div class="swiper-slide">' +
            //'<a href=' + "member/" + data.weid + '>' +
            '<div class="imgs-style">' +
            '<div class="imgs-member">' +
            '<img src=' + data.avatar + ' width="80"/>' +
            '</div>' +
            '<div class="imgs-name">' + data.real_name + '</div>' +
            '</div>' +
            //'</a>' +
            '</div>'

        return templete;
    }

    //右侧滚动广告模板
    var advTemplete = function(data){
        var imgUrl = data.image;
        if (imgUrl.indexOf('http') === -1){
            imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
        }
        var templete = '<div class="swiper-slide" id=' + data.weid + '>' +
            '<a href=' + data.url + '>' +
            '<img src=' + imgUrl + ' alt=""/>' +
            '</a>' +
            '</div>'

        return templete;
    }

    //首页轮播，广告，秦商风采接口
    var loadHome = function(){
        $.ajax({
            url: CMS_ADVS,
            dataType: 'json',
            success: function(data){
                console.log(data.data);
                //var url = data.data.http_url

                //生成轮播图，通过weid查找图片对应的url
                var swiper = data.data.banners.list;
                var block = data.data.block.list;
                var blocks = data.data.blocks.list;
                var users = data.data.users;
                var swiperUrl = [];
                swiper.map(x => {
                    swiperUrl.push({id: x.weid, url: x.url});
                    $(".carousel").append(swiperTemplete(x));
                });

                var mySwiper = new Swiper ('#my-swiper', {
                    direction: 'horizontal',
                    loop: true,
                    speed: 1000,
                    autoplay : 3000,
                    autoplayDisableOnInteraction : false,
                    pagination: '.swiper-pagination',
                    paginationClickable :true,
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    grabCursor : true
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
                    var len = block.length;
                    for (var i = 0; i < block.length; i++) {
                        if (i < 4) {
                            $(".adv-left-" + i).html('<a href=' + block[len - i - 1].url + ' target="_blank">' + block[len - i - 1].title + '</a>');
                        }
                    }
                }, 0);

                //peoples title
                if (data.data.peoples_title != undefined) {
                    $(".imgs-title").text(data.data.peoples_title.title);
                }

                //会长
                var chairman = setTimeout(function(){
                    $(".imgs-chairman").html('<a href=' + data.data.leader.url + '><img src=' + data.data.leader.image + ' width="80"/></a>');
                    $(".imgs-name").html(data.data.leader.title);
                }, 0);

                var getUserInfo = function(){
                    $.ajax({
                        url: 'http://apitest.wezchina.com/users/founder',
                        type: 'get',
                        success: function(data){
                            console.log(data);
                            if (data.code == 200){
                                var info = data.data;
                                var weid = info.weid;
                                //$(".imgs-chairman").html('<a href=' + '/article/list' + weid + '><img src=' + info.avatar + ' width="80"/></a>');
                                $(".imgs-chairman").html('<a href="/article/list"><img src=' + info.avatar + ' width="80"/></a>');
                                $(".imgs-name").html(info.nickname);
                            }
                        },
                        error: function(xhr){
                            console.log(xhr);
                        }
                    })
                }

                //getUserInfo();

                //会员
                users.map(x => $("#my-swiper1 .swiper-wrapper").append(memberTemplete(x)))

                var mySwiper1 = new Swiper ('#my-swiper1', {
                    direction: 'horizontal',
                    loop: true,
                    slidesPerView : 8,
                    slidesPerGroup : 1,
                    speed: 3000,
                    autoplay : 1,
                    autoplayDisableOnInteraction : false,
                    grabCursor : true,
                    freeMode:true
                })

                //中间广告
                var centerAdv = data.data.center;
                if(!centerAdv) {
                    return false;
                }
                var centerImg = centerAdv.image;
                if (centerImg.indexOf('http') === -1){
                    centerImg = ApiMaterPlatQiniuDomain + centerImg;
                }
                $("#bar").css({
                    "background": "url(" + centerImg + ") no-repeat center",
                    "background-size": "100% 100%"
                })
                $("#bar").click(function(){
                    window.location.href = centerAdv.url;
                })

                //右侧滚动广告
                var cnt = 0;
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

                var mySwiper2 = new Swiper ('#my-swiper2', {
                    direction: 'vertical',
                    loop: true,
                    slidesPerView : 1,
                    slidesPerGroup : 1,
                    speed: 1000,
                    autoplay : 2000,
                    autoplayDisableOnInteraction : false,
                    onlyExternal : true,
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
                if (bgImg.indexOf('http') === -1){
                    bgImg = ApiMaterPlatQiniuDomain + bgImg;
                }
                if (bar1.indexOf('http') === -1){
                    bar1 = ApiMaterPlatQiniuDomain + bar1;
                }
                if (bar2.indexOf('http') === -1){
                    bar2 = ApiMaterPlatQiniuDomain + bar2;
                }
                if (bar3.indexOf('http') === -1){
                    bar3 = ApiMaterPlatQiniuDomain + bar3;
                }
                if (bar4.indexOf('http') === -1){
                    bar4 = ApiMaterPlatQiniuDomain + bar4;
                }
                if (bgRight.indexOf('http') === -1){
                    bgRight = ApiMaterPlatQiniuDomain + bgRight;
                }
                $("#home-body").css({ "background": "url(" + bgImg + ") no-repeat center", "background-size": "100%", "opacity": "1", })                
                $("body").css({ "background-image": "url(" + bgRight + ")" })
                $("#nav-news").css({ "background-image": "url(" + bar1 + ")","background-size": "cover","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-org").css({ "background-image": "url(" + bar2 + ")","background-size": "cover","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-help").css({ "background-image": "url(" + bar3 + ")","background-size": "cover","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-share").css({ "background-image": "url(" + bar4 + ")","background-size": "cover","background-repeat": "no-repeat","background-position": "center" })

                //官方发布
                $("#release").html(setting.weibo_show);

                //right side control
                var script_status = false;
                $("#nav-org").click(function(){
                    if(!script_status) {
                        $.getScript("common/js/organized.js");
                        script_status = true;
                    }
                    homeState = "org";
                    $(".home").hide();
                    $("#nav-news").show();
                    mySwiper.stopAutoplay();
                    mySwiper1.stopAutoplay();
                    $("#nav-org").hide();
                    $("#nav-help").css("margin-left", "105px");
                    $(".organization").show();
                })

                $("#nav-news").click(function(){
                    homeState = "news";
                    $(".home").show();
                    $("#nav-news").hide();
                    $("#nav-help").css("margin-left", "0");
                    $("#nav-org").show();
                    var temp = mySwiper.width;
                    mySwiper.startAutoplay();
                    mySwiper1.startAutoplay();
                    $(".organization").hide();
                })

                var title = setting.title;
                var favicon = setting.favicon;
                var keyWord = setting.key_word;
                var description = setting.description;
                var backgroundUp = setting.background_up;
                var logo = setting.logo;

                localStorage.setItem('fav', favicon);
                localStorage.setItem('logo', logo);

                //console.log(favicon);
                //console.log('logo:',logo);

                $('title').text(title);
                $('meta[name="keywords"]').attr('content', keyWord);
                $('meta[name="description"]').attr('content', description);

                if(favicon.indexOf('http') === -1){
                    favicon = ApiMaterPlatQiniuDomain + favicon;
                }
                //console.log('favicon：',favicon);
                $('#favicon').attr('href',favicon);

                if(backgroundUp.indexOf('http') === -1){
                    backgroundUp = ApiMaterPlatQiniuDomain + backgroundUp;
                }
                $('#home-head').css({
                    'background': "url(" + backgroundUp + ") no-repeat center",
                    'background-size': '100%'
                })

                var logoImg = ApiMaterPlatQiniuDomain + logo;
                console.log('logoImg:',logoImg);
                $('#home').append('<img src="' + logoImg + '"width= "90" alt="HOME" />');

            }
        })
    }

    loadHome()

    //读取首页新闻
    var loadNews = function(){
        $.ajax({
            url: CMS_INDEX_GRID,
            dataType: 'json',
            success: function(data){
                console.log(data.data);
                var newsCnt = 0;
                var noticeCnt = 0;
                var esNewsCnt = 0;
                data.data.hot.map(x => $(".main-news").append(mainNews(x))); //头条新闻
                data.data.news.map(x => {
                    if (newsCnt < 8) {
                        $("#center").append(centerNews(x));
                        newsCnt++;
                    }
                });//新闻中心
                data.data.nitoce.map(x => {
                    if (noticeCnt < 8) {
                        $("#sirase").append(centerNotice(x));
                        noticeCnt++;
                    }
                });//公示公告
                data.data.especial_news.list.map(x => {
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
    loadNews();

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
    loadMemberNews();

    var saveUserInfo = function(token, weid, imgUrl) {
        localStorage.setItem('token', token);
        localStorage.setItem('weid', weid);
        if(!imgUrl) {

            imgUrl = "http://oty3r3tmi.bkt.clouddn.com/common/1502085164249.jpg";
            $("#login a").css({"background": "url("+ imgUrl +") center center / 100% no-repeat"});

        } else if (imgUrl.indexOf('http') != 0 && imgUrl != "") {

            imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
            $("#login a").css({"background": "url(" + window.localStorage.getItem('avatar') + ") center center / 100% no-repeat"});
            $("#login a").addClass("i-header").html("");
            showLogin = false;
            isLogin = true;

        } else if(imgUrl.indexOf('http') == 0 && imgUrl != "") {

            $("#login a").css({"background": "url(" + imgUrl + ") center center / 100% no-repeat"});
        }
        window.localStorage.setItem("avatar", imgUrl);
    }

    //login input check
    var isChecked = true; //默认选中
    $("#check").change(function(){
        if (!isChecked){
            console.log("checked");
            isChecked = true;
        } else {
            console.log("uncheck");
            isChecked = false;
        }
    })

    //获取验证码
    var lock = false;
    var isCheckNum = false; //默认false
    var count = false; //验证码倒计时
    var getCheck = function(phoneNum){
        var timeout = false;
        var seconds = 60;

        lock = true;
        count = setInterval(function(){
            if (seconds > 0){
                seconds -= 1;
                $(".get-check").text(seconds + "秒");
            } else {
                $(".get-check").text("重新获取验证码");
                timeout = false;
                seconds = 60;
                lock = false;
                clearInterval(count);
            }
        }, 1000);

        $.ajax({
            url: CODES,
            dataType: 'json',
            type: 'post',
            data: { 'phone': phoneNum},
            success: function(data){
                isCheckNum = true;
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        })
    }

    var phoneNum = 0;
    var checkNum = 0;
    $(".get-check").click(function(){
        if (!lock) {
            phoneNum = $(".phone-num").val();
            var regexp = /^(13|14|17|15|18)/;
            var reg =  new RegExp(regexp);
            if (reg.test(phoneNum) && phoneNum.length == 11){
                getCheck(phoneNum);
            } else {
                layer.msg("手机号码错误", { time: 2500 });
            }
        }
    })

    //用户登录
    var login = function(phoneNum, checkNum){
        $.ajax({
            url: LOGIN,
            type: 'post',
            data: {'phone': phoneNum, 'code': checkNum },
            success: function(data){
                console.log(data);
                if (data.code != -200) {
                    saveUserInfo(data.token, data.data.weid, data.data.avatar);
                    showLogin = false;
                    isLogin = true;
                    isCheckNum = false;
                    window.location.href = '/user'; //成功返回个人微主页
                } else {
                    lock = false;
                    clearInterval(count);
                    layer.msg("登陆失败，请重新获取验证码", { time: 2500 });
                    $(".get-check").text("重新获取验证码");
                }
            },
            error: function(err){
                console.log(err);
            }
        })
    }

    //点击登录按钮
    var logBt = function(){
        phoneNum = $(".phone-num").val();
        checkNum = $(".check-num").val();
        var regexp = /^(13|14|17|15|18)/;
        var reg =  new RegExp(regexp);
        if (reg.test(phoneNum) && phoneNum.length == 11 && checkNum.length == 5 && isCheckNum && isChecked) {
            login(phoneNum, checkNum);
        } else {
            if (!(phoneNum.length == 11) || !reg.test(phoneNum)){
                layer.msg("手机号码错误", { time: 2500 });
                return;
            }
            if (!(checkNum.length == 5) || !isCheckNum) {
                layer.msg("手机验证码错误", { time: 2500 });
                return;
            }
            if (!isChecked) {
                layer.msg("请确认服务条款", { time: 2500 });
                return;
            }
        }
    }

    $(".login-bt").click(function(){
        logBt();
    })

    $(".phone-num").keydown(function(evt){
        switch (evt.keyCode){
            case 13: $(".check-num").select();
        }
    });

    $(".check-num").keydown(function(evt){
        switch (evt.keyCode){
            case 13: logBt();
        }
    });

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
})
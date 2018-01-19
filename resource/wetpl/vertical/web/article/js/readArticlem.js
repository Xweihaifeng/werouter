/**
 * Created by Hongguang on 2017/8/3.
 */

$(document).ready(function(){
    if(localStorage.getItem("wobj")!=null){
        var wxobj=$.parseJSON(localStorage.getItem("wobj"));
        wxobj.ref_type=2;
        localStorage.setItem("wobj",JSON.stringify(wxobj));
    }
    var showLogin = false; //调整窗口大小时登陆框是否存在
    var currWidth = $(window).width();
    var currHeight = $(window).height();
    var width = $(window).width() / 2 - 180;
    var height = $(window).height() / 2 - 165;
    var readHeight = $(".read").height();

    if (readHeight == 768){
        $(".left-nav").css("min-height", currHeight);
        $(".read").css("min-height", currHeight);
        $(window).resize(function(){
            currWidth = $(window).width();
            currHeight = $(window).height();
            width = $(window).width() / 2 - 180;
            height = $(window).height() / 2 - 165;
            var top = $(window).scrollTop();
            $(".left-nav").css("min-height", currHeight);
            $(".read").css("min-height", currHeight);
        })
    }

    var tusitemp="";
    function mess_tusi(strs){
        clearTimeout(tusitemp);
        $("#mess_tusi").remove();
        //创建吐丝层并写入内容
        if(!$("#mess_tusi").attr("id")){ //吐丝层不存在创建
            $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>"+strs+"</span></div>"); //写入内容
        }else{
            $("#mess_tusi").html(strs);  //写入内容
        }
        //定义吐丝层位置
        var left=(1200 - $("#mess_tusi").width())/2;//居中
        var top=$(window).height()*0.5;
        $("#mess_tusi").css({"left":left+"px","top":top+"px"});

        //显示吐丝层rou't
        $("#mess_tusi").css("display",'');

        //2秒后关闭
        tusitemp =  setTimeout(function (){
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        },2000);
        return false;
    }

    var url = window.location.href.split('/');
    var domain = url.slice(3, 4)[0];
    console.log(domain)

    //个性域名用户weid
    var userId;
    var init = function(domain) {
        $.ajax({
            url: PAGES_DETAIL_DOMAIN + '/' + domain,
            type: 'GET',
            success: function(data){
                if (data.code == 200){
                    //var domain = data.data.domain;
                    console.log(data);
                    if (data.data != null) {
                        userId = data.data.weid;
                        console.log('router correct')
                    } else {
                        console.log('router error')
                    }
                } else {
                    window.location.href = "/404";
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //init(domain);

    //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route, domain){
        var routerList = ['home', 'login', 'article', 'shopping'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var top = $(window).scrollTop();

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal_login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user/";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href = "/" + domain + "/article";
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = "/" + domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id, domain);
    })

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();
        }
    }

    init(docCookies.getItem("token"));

    var id = window.location.href.split('/').pop();
    var headId = 0;
    var headIconId = '';
    var artTemplete = function(data){
        headIconId = "head-" + headId;
        var templete =
            '<div id="qrCode"></div>' +
            //'<div id="toTop"></div>' +
            '<div id="read-title" class=' + data.weid + '>' + data.title.substring(0,60) + '</div>' +
            '<div id="auth-info">' +
            '<div class="auth-head" id=' + headIconId + '></div>' +
            '<div class="auth-name">' + data.auth + '</div>' +
            '<div class="auth-org">来源：<a href=' + data.href + '>' + data.source + '</a></div>' +
            '<div class="auth-date">时间：' + data.created_at + '</div>' +
            '</div>' +
            '<div id="read-intro">' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.summary + '</div>' +
            '<div id="read-art">' + data.content + '</div>' +
            '<div id="read-other">' +
            '<span class="read-count">阅读 ' + data.views +'</span>' +
            '<span class="read-like"><img src="/common/img/good.png" width="21" alt=""/><span class="like-count"> ' + data.praise_num +' </span></span>' +
            '</div>' +
            '</div>'

        return templete;
    }

    var loadArticle = function(reqUrl, id, type, data){
        if (data.thumb_image != undefined){
            var headIconCss = {
                'background': 'url(' + data.thumb_image + ') no-repeat center',
                'background-size': '100% 100%'
            };
        } else {
            var headIconCss = {
                'background': 'url(/common/img/my.png) no-repeat center',
                'background-size': '100% 100%'
            };
        }

        var res = artTemplete(data, type);
        $(".read").append(res);
        $("#" + headIconId).css(headIconCss);
        headId += 1;

        //like count
        var likeState = false;
        $(".read-like").click(function(){
            if (isLogin) {
                if (!likeState) {
                    var weid = $("#read-title").attr("class");
                    like(weid); //点赞，取消点赞
                }
            } else {
                router('login');
            }
        })
    }

    //点赞
    var like = function(weid){
        $.ajax({
            url: ARTICLE_PRAISES,
            type: 'post',
            dataType: 'json',
            headers: {
                'Token': docCookies.getItem("token")
            },
            data: {'articleId': weid},
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    console.log(data.data[0].praise_num);
                    $(".like-count").text(data.data[0].praise_num);
                    $(".read-like img").attr("src", "/common/img/good+.png");
                    likeState = true;
                } else {
                    mess_tusi("您已点过赞啦");
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var setHeight = function(ch){
        $(".left-nav").css("height", ch);
    }

    var view = function(id){
        $.ajax({
            url: ARTICLES_VIEW,
            type: 'post',
            data: {"articleId": id},
            success: function(data){
                console.log(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var init = function(id){
        $.ajax({
            url: ARTICLE + '/' + id,
            dataType: 'json',
            success: function(data){
                //console.log(data);
                if (data.code == 200) {
                    var art = data.data;

                    loadArticle('', art.weid, art.cate_id, art);

                    var next = setInterval(() => {
                        var imgWidth = $("#read-art img").width();
                        if (imgWidth != 0) {
                            var currWidth = (700 - imgWidth) / 2;
                            $("#read-art img").css("margin-left", currWidth);
                            clearInterval(next);
                        }
                    }, 50);
                }
            }
        })

        $.ajax({
            url: CMS_QRCODE + '?size=150&text=' + window.location.href,
            success: function(data){
                $("#qrCode").append('<img src=' + CMS_QRCODE + '?size=165&text=' + window.location.href + '>' +
                '<li>微信扫一扫</li>' +
                '<li>查看或分享给好友</li>');
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    init(id);

    //back to top
    $("#toTop").hide();
    $(".read").scroll(function(){
        if ($(".read").scrollTop() > $(window).height() / 2) {
            $("#toTop").fadeIn(500);
            $("#toTop").hover(function(){
                $(this).css("background-color", "#eeeeee");
            }, function(){
                $(this).css("background-color", "white");
            });
        } else {
            $("#toTop").fadeOut(500);
        }
    })

    $("#toTop").click(function(){
        $('.read').animate({scrollTop:0}, 300);
    })
})
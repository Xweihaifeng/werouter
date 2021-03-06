/**
 * Created by Hongguang on 2017/8/3.
 */

$(document).ready(function(){

    function getQueryParam(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)
            return  unescape(r[2]);
        return null;
    }

    //var id = getQueryParam('id');
    //var type = getQueryParam('type');
    var id = window.location.href.split('/').pop();
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
            $(".left-nav").css("min-height", currHeight);
            $(".read").css("min-height", currHeight);
            $(".show-login").css({
                "top": height
            });
        })
    }

    //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '../index';
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
                window.location.href = "../user/";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href = "article";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article").click(function(){
        var id = $(this).attr("id");
        router(id);
    })

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div").css({
                'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100% 100%'
            })
        }
    }

    init(docCookies.getItem("token"));

    var headId = 0;
    var headIconId = '';
    var artTemplete = function(data, prevPage){ //prevPage: 上一页
        headIconId = "head-" + headId;
        var templete =
            '<div id="qrCode"></div>' +
            '<div id="toTop"></div>' +
            '<div id="read-title">' + data.title.substring(0, 35) + '</div>' +
            '<div id="auth-info">' +
            '<div class="auth-head" id=' + headIconId + '></div>' +
            '<div class="auth-name">' + data.auth + '</div>' +
            '<div class="auth-org">来源：<a href=' + data.source_url + '>' + data.source_url.substring(0, 35) + '</a></div>' +
            '<div class="auth-date">时间：' + data.created_at + '</div>' +
            '</div>' +
            '<div id="read-intro">' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.summary + '</div>' +
            '<div id="read-art">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.content + '</div>' +
            '<div id="read-other">' +
            '<span class="read-count">阅读 ' + data.views +'</span>' +
            '<span class="read-like"><img src="../common/img/good.png" width="21" alt=""/><span class="like-count"> ' + data.status +' </span></span>' +
            '</div>' +
            '</div>'

        return templete;
    }

    var artTempleteOfArt = function(data, prevPage){ //prevPage: 上一页
        headIconId = "head-" + headId;
        var templete =
            '<div id="qrCode"></div>' +
            '<div id="toTop"></div>' +
            '<div id="read-title">' + data.title.substring(0, 35) + '</div>' +
            '<div id="auth-info">' +
            '<div class="auth-head" id=' + headIconId + '></div>' +
            '<div class="auth-name" id=' + data.weid + '>' + data.auth + '</div>' +
            '<div class="auth-org">来源：<a href=' + data.source_url + '>' + data.source_url.substring(0, 35) + '</a></div>' +
            '<div class="auth-date">时间：' + data.created_at + '</div>' +
            '</div>' +
            '<div id="read-intro">' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.summary + '</div>' +
            '<div id="read-art">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.content + '</div>' +
            '<div id="read-other">' +
            '<span class="read-count">阅读 ' + data.views +'</span>' +
            '<span class="read-like"><img src="../common/img/good.png" width="21" alt=""/><span class="like-count"> ' + data.status +' </span></span>' +
            '</div>' +
            '</div>'

        return templete;
    }

    var loadArticle = function(reqUrl, id, type, data){
        var headIconCss = {
            'background': 'url(' + data.thumb_image + ') no-repeat center',
            'background-size': '100% 100%'
        };
        $(".read").append(artTemplete(data, type));
        $("#" + headIconId).css(headIconCss);
        headId += 1;
        //like count
        var likeState = false;
        $(".read-like").click(function(){
            console.log($(".auth-name").attr('id'));
            if (!likeState){
                var cnt = parseInt($(".like-count").text()) + 1;
                $(".read-like img").attr("src", "../common/img/good+.png");
                $(".like-count").text(" " + cnt);
                likeState = true;
            } else {
                var cnt = parseInt($(".like-count").text()) - 1;
                $(".read-like img").attr("src", "../common/img/good.png");
                $(".like-count").text(" " + cnt);
                likeState = false;
            }
        })
    }

    var setHeight = function(ch){
        $(".left-nav").css("height", ch);
    }

    var init = function(id){
        $.ajax({
            url: apiUrl + 'cms/detail/' + id,
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var art = data.data;
                    loadArticle('', art.weid, art.cate_id, art);
                    //back to top
                    $("#toTop").hide();
                    $(window).scroll(function(){
                        if ($(document).scrollTop() > $(window).height() / 2) {
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
                        $('html,body').animate({scrollTop:0}, 300);
                    })

                    var currHeight = $(".read").height();
                    setHeight(currHeight);
                }
            }
        })

        $.ajax({
            url: CMS_QRCODE + '?size=150&text=' + window.location.href,
            success: function(data){
                $("#qrCode").append('<img src=' + CMS_QRCODE + '?size=150&text=' + window.location.href + '/>' +
                '<li>微信扫一扫</li>' +
                '<li>查看或分享给好友</li>');
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    init(id);
})
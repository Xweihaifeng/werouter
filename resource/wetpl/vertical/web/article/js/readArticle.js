/**
 * Created by Hongguang on 2017/8/3.
 */

$(document).ready(function(){

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

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);

    // var typeList = ['newArticle', 'log', 'notice'];
    var url = window.location.href.split('/');
    var id = window.location.href.split('/').pop();
    var domain = url.slice(3, 4)[0];

    var checkAuth = function(domain, id){
        $.ajax({
            url: ARTICLE_EXITS + '?domain=' + domain + '&weId=' + id,
            success: function(data){
                if (data.data != true) {
                    window.location.href = '/404';
                }
            }
        })
    }

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $("#avatar .avatar-icon").css({
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();
            $("#home img").attr("src", ApiMaterPlatQiniuDomain + localStorage.getItem('logo'))
        }
    }

    init(docCookies.getItem("token"));

    var headId = 0, headIconId = '', original = '';
    var artTemplete = function(data, title) {
        headIconId = "head-" + headId;        
        if(data.is_original == 2) {
            original = "原创";
        }        
        var name = '';
        var publisher = data.publisher;
        if (data.brand != undefined) {
            name = data.brand.title;
        } else {
            if (data.nickname != '' && data.nickname != null) {
                name = data.nickname;
            } else if (data.real_name != '' && data.real_name != null) {
                name = data.real_name;
            }
        }
        
        var templete =
            '<div id="qrCode"></div>' +
            //'<div id="toTop"></div>' +
            '<div id="read-title"  class=' + data.weid + ' style="text-align: left!important">' + data.title.substring(0, 55) + '</div>' +
            '<div id="auth-info">' +
            '<a href="' + '/' + domain + '"><div class="auth-head" id=' + headIconId + '></div></a>' +
            '<a href="' + '/' + domain + '"><div class="auth-title">' + name + '</div></a>' +
            '<div class="auth-name">' + data.auth + '</div>' +
            // '<div class="auth-org">来源：<a href=' + data.href + '>' + data.source + '</a></div>' +
            '<div class="auth-org" style="display: none;">' + publisher.substr(0, 19) + '</div>' +
            '<div class="auth-date">' + data.created_at.substr(0, 10) + '</div>' +
            '<div class="auth-original">' + original + '</div>' +
            '</div>' +
            '<div id="read-intro">' + data.summary + '</div>' +
            '<div id="read-art">' + data.content + '</div>' +
            '<div id="read-other">' +
            '<span class="read-org" style="padding-right: 20px; display: none;"><a href=' + data.href + '>阅读原文</a></span>' + 
            '<span class="read-count">阅读 ' + data.views +'</span>' +
            '<span class="read-like"><img src="/common/img/good.png" width="21" alt=""/><span class="like-count"> ' + data.praise_num +' </span></span>' +
            '</div>' +
            '</div>'
        return templete;
    }

    var loadArticle = function(reqUrl, id, type, data){
        if (data.avatar != "" && data.avatar != null){
            if (data.brand != undefined && data.brand.logo != null && data.brand.log != "") {
                var headIconCss = {
                    'background': 'url(' + imgSet(data.brand.logo, 40, 40) + ') no-repeat center',
                    'background-size': '100% 100%'
                };
            } else {
                var headIconCss = {
                    'background': 'url(' + imgSet(data.avatar, 40, 40) + ') no-repeat center',
                    'background-size': '100% 100%'
                };
            }            
        } else {
            var headIconCss = {
                'background': 'url(/common/img/my.png) no-repeat center',
                'background-size': '100% 100%'
            };
        }

        $("title").text(data.title);

        $.ajax({
            url: apiUrl + "cms/setting/show",
            dataType: 'json',
            success: function(ls){
                // console.log(ls)
                var title = ls.data.title;
                var res = artTemplete(data, title);
                $(".read").append(res);
                $("#" + headIconId).css(headIconCss);
                headId += 1;
                if (data.href != '') {
                    $(".read-org").show();
                }
                if(data.is_original == 2) {
                    $(".auth-original").show();
                }
                var publisher = data.publisher;
                if (publisher != '') {
                    $(".auth-org").show();
                }
                //like count
                var likeState = false;
                $(".read-like").click(function(){
                    if (isLogin) {
                        if (!likeState) {
                            var weid = $("#read-title").attr("class");
                            like(weid); //点赞，取消点赞 weid是文章id
                        }
                    } else {
                        router('login');
                    }
                })

                $("#read-art img").css({"width": "100%", "height": "auto"});

                /*var next = setInterval(() => {
                        var imgWidth = $("#read-art img").width();
                        if (imgWidth != 0) {
                            var currWidth = (700 - imgWidth) / 2;
                            $("#read-art img").css("margin-left", currWidth);
                            clearInterval(next);
                        }
                    }, 50);*/

                /*$.ajax({
                    url: CMS_QRCODE + '?size=150&text=' + window.location.href,
                    success: function(data){
                        $("#qrCode").append('<img src=' + CMS_QRCODE + '?size=165&text=' + window.location.href + '>' +
                        '<li>微信扫一扫</li>' +
                        '<li>查看或分享给好友</li>');                            
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })*/

                 // 二维码的生成
                var qurl = apiUrl + '/file/qrcode?margin=3&url=' + window.location.href;
                $("#qrCode").prepend(`<img src="` + qurl + `" width="156" style="margin-top: 5px;" />` +
                        '<li>微信扫一扫</li>' +
                        '<li>查看或分享给好友</li>');
                        }
                    })
                }

    //点赞
    var like = function(weid){
        $.ajax({
            url: ARTICLE_PRAISES,
            type: 'POST',
            //dataType: 'json',
            headers: {
                'Token': docCookies.getItem("token")
            },
            data: {'articleId': weid},
            success: function(data){
                // console.log(data);
                if (data.code == 200){
                    // console.log(data.data[0].praise_num);
                    $(".like-count").text(data.data[0].praise_num);
                    $(".read-like img").attr("src", "/common/img/good+.png");
                    likeState = true;
                } else {
                    layer.msg("您已点过赞啦", {time: 1500});
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
            async: false,
            data: {"articleId": id},
            success: function(data){
                 //console.log(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //保存用户访问记录
    var saveInfo = function(domain, pathname, plat_userid){
        //console.log(domain, pathname, plat_userid);
        localStorage.setItem('domain', domain);
        localStorage.setItem('ref_url', pathname);
        localStorage.setItem('ref_id', plat_userid);
    }

    var __init = function(id){
        $.ajax({
            url: ARTICLE + '/' + id,
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var art = data.data;
                    var plat_userid = art.plat_user_id;
                    saveInfo(domain.substr(1), window.location.pathname, plat_userid);
                    view(id);
                    loadArticle('', art.weid, art.cate_id, art);
                }
            }
        })
    }

    __init(id);

    //back to top
    $("#toTop").hide();
    /*$(window).scroll(function(){
        if ($(window).scrollTop() > $(window).height() / 2) {
            $("#toTop").fadeIn(500);
            $("#toTop").hover(function(){
                $(this).css("background-color", "#eeeeee");
            }, function(){
                $(this).css("background-color", "white");
            });
        } else {
            $("#toTop").fadeOut(500);
        }
    })*/

    $("#toTop").click(function(){
        // $("body").animate({scrollTop:0}, 300);
    })

})
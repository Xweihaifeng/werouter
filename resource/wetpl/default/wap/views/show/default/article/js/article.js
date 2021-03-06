/**
 * Created by yaoer on 2017/10/22.
 */

var width = $(window).width();
$("#content img").css({"width": width - 30 + "px", "margin-top": "10px", "margin-bottom": "10px"});
var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
$('#favicon').attr('href', favicon);
var url = window.location.href.split('/');
var id = window.location.href.split('/').pop();
var domain = url.slice(3, 4)[0];
var headId = 0, headIconId = '', original = '';
var artTemplete = function(data, pt, pid){
    var templete =
        '<div class="read-title" class=' + data.weid + '><p class="title">' + data.title.substring(0, 28) + '</p></div>' +
        '<div class="auth-info">' +
        '<div class="auth-original" style="display:none;">原创</div>' +
        '<div class="auth-date">' + data.created_at.substr(0, 10) + '</div>' +
        '<div class="auth-name">' + data.auth.substr(0, 10) + '</div>' +
        '<div class="auth-publisher" style="display:none; margin-right: 0.08rem;">' + data.publisher.substr(0, 10) + '</div>' +
        '<div class="auth-main"><a href="/wecard/' + pid + '" style="color: #607fa6; text-decoration: none;">' + pt + '</a></div>' +
        '</div>' +
        '<div id="read-art">' + data.content + '</div>' +
        '<div id="footer">' +
        '<div class="read-org" style="display: none;"><a href=' + data.href + '>阅读原文</a></div>' +
        '<div class="read-count">阅读 <span>' + data.views +'</span></div>' +
        '<div class="read-like"><img src="/common/img/like.png" alt=""/><span class="like-count"> ' + data.praise_num +' </span></div>' +
        '<div class="read-complain">投诉</div>'
        '</div>' +
        '</div>'
    return templete;
}

let pid;
const getPlatUserId = (domain) => {
    $.ajax({
        url: apiUrl + 'pages/page/getDetailByDomain/' + domain,
        type: 'GET',
        async: false,
        success: function(data) {
            pid = data.data.plat_user_id;
        }
    })
}

var loadArticle = function(reqUrl, id, type, data, pt){
    $("title").text(data.title);
    getPlatUserId(domain);
    var res = artTemplete(data, pt, pid);
    $("#read").append(res);
    if (data.href != '') {
        $(".read-org").show();
    }
    if (data.is_original == 2) {
        $(".auth-original").show();
    }
    var publisher = data.publisher;
    if (publisher != '') {
        $(".auth-publisher").show();
    }
    if (data.auth == null || data.auth == '') {
        $(".auth-name").hide();
    }

    $("#read-art img").css({"width": "100%", "height": "auto"});
    //like count
    var likeState = false;
    $(".read-like").click(function(){
        // if (isLogin) {
            if (!likeState) {
                var weid = $("#read-title").attr("class");
                //alert(window.location.pathname.split('/').pop())
                like(weid); //点赞，取消点赞 weid是文章id
            }
        // } else {
            // router('login');
        // }
    })
}

//点赞
var like = function(weid){
    $.ajax({
        url: ARTICLE_PRAISES,
        type: 'POST',
        //dataType: 'json',
        headers: {
            'Token': localStorage.getItem('token')
        },
        data: {'articleId': weid},
        success: function(data){
            console.log(data);
            if (data.code == 200){
                console.log(data.data[0].praise_num);
                $(".like-count").text(data.data[0].praise_num);
                //$(".read-like img").attr("src", "/common/img/good+.png");
                layer.msg('您已成功点赞', {
                    time: 1500
                })
                likeState = true;
            } else {
                layer.msg('您已点过赞啦', {
                    time: 1500
                })
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}

var view = function(id){
    $.ajax({
        url: ARTICLES_VIEW,
        type: 'post',
        async: false,
        data: {"articleId": id},
        success: function(data){
            console.log(data);
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}

//获取参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

//判断为空
function isNull(data) {
    return (data == "" || data == undefined || data == null || data == 'null') ? true: false;
}

//判断是否在微信中打开
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

//检查openid是否过期(有效期1天)
var isExpire = (oldTime) => {
    var day = 86400000;
    var now = new Date().getTime();
    if (oldTime != null) {
        if (now - oldTime < 86400000) {
            return false;
        } else {
            localStorage.removeItem('setopenid-date')
            localStorage.removeItem('token')
            return true;
        }
    } else {
        return true;
    }
}

var __init = function(id){
    $.ajax({
        url: ARTICLE + '/' + id,
        dataType: 'json',
        success: function(data){
            //console.log(data);
            if (data.code == 200) {
                var art = data.data;
                var plat_userid = art.plat_user_id;
                var atitle, summary, cover;
                atitle = art.title;
                summary = art.summary;
                cover = art.cover;
                // var pt = data.data.title;
                if (art.brand != undefined) {
                    name = art.brand.title;
                } else {
                    if (art.nickname != '' && art.nickname != null) {
                        name = art.nickname;
                    } else {
                        name = art.real_name;
                    }
                }

                view(id);

                $.ajax({
                    url: apiUrl + "cms/setting/show",
                    dataType: 'json',
                    success: function(data){
                        $("#favicon").attr('href', ApiMaterPlatQiniuDomain + data.data.favicon);
                    }
                })

                loadArticle('', art.weid, art.cate_id, art, name);

                if (is_weixn()) {
                    var oldTime = localStorage.getItem('setopenid-date');

                    if (!isExpire(oldTime)) { //没过期
                        //var usertoken = localStorage.getItem('token');
                        var usertoken = localStorage.getItem('setopenid');
                        if (usertoken == 'true') {
                            openid = getUrlParam("openid");
                            //alert('openid: ' + openid)
                            //微信登录
                            $.ajax({
                                url: apiUrl + 'wxlogin',
                                type: 'POST',
                                data: {
                                    openid: openid,
                                    ref_url: window.location.pathname,
                                    ref_type: 2,
                                    ref_id: plat_userid,
                                    domain: domain
                                },
                                success: function (data) {
                                    //alert(JSON.stringify(data))
                                    if (data.code == 200) {
                                        if (isNull(data.token) == false) { //非空
                                            localStorage.setItem('token-date', new Date().getTime())
                                            localStorage.setItem('token', data.token);
                                        }
                                    }
                                }
                            })
                        }
                    } else {
                        //微信未跳转时
                        localStorage.setItem('setopenid', true);
                        localStorage.setItem('setopenid-date', new Date().getTime())
                        window.location.href = encodeURI(apiUrl + '/openid?url=' + window.location.href);
                    }
                }

                $.ajax({
                    url: apiUrl + 'wxjssdk',
                    type: 'POST',
                    data: {
                        currenturl: window.location.href
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            console.log(data)
                            wx.config({
                                debug: false,
                                appId: data.data.appId,
                                timestamp: data.data.timestamp,
                                nonceStr: data.data.nonceStr,
                                signature: data.data.signature,
                                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
                            });

                            wx.ready(function() {
                                var link = window.location.href;
                                wx.onMenuShareTimeline({
                                    title: atitle,
                                    // 分享标题
                                    link: link,
                                    // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                    desc: summary,
                                    //分享描述
                                    imgUrl: cover,
                                    // 分享图标
                                    success: function() {
                                        // 用户确认分享后执行的回调函数
                                    },
                                    cancel: function() {
                                        // 用户取消分享后执行的回调函数
                                    }
                                });
                                wx.onMenuShareAppMessage({
                                    title: atitle,
                                    // 分享标题
                                    // desc: data.summary,
                                    // imgUrl: data.detail.cover,
                                    desc: summary,
                                    // 分享描述
                                    link: link,
                                    // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                    // imgUrl: ApiMaterPlatQiniuDomain + data.cover,

                                    imgUrl: cover,
                                    // 分享图标
                                    type: '',
                                    // 分享类型,music、video或link，不填默认为link
                                    dataUrl: '',
                                    // 如果type是music或video，则要提供数据链接，默认为空
                                    success: function() {
                                        // 用户确认分享后执行的回调函数
                                    },
                                    cancel: function() {
                                        // 用户取消分享后执行的回调函数
                                    }
                                });
                            })
                        }
                    }
                })
        }
    }
})

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
}

__init(id);

//back to top
/*$("#toTop").hide();
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
})*/





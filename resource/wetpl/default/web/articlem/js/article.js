/**
 * Created by yaoer on 2017/10/22.
 */

var width = $(window).width();
$("#content img").css({"width": width - 30 + "px", "margin-top": "10px", "margin-bottom": "10px"})
var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
$('#favicon').attr('href', favicon);
var url = window.location.href.split('/');
var id = window.location.href.split('/').pop();
var domain = url.slice(3, 4)[0];
var headId = 0, headIconId = '', original = '';
var artTemplete = function(data, pt){
    var templete =
        '<div class="read-title" class=' + data.weid + '><p class="title">' + data.title.substring(0, 28) + '</p></div>' +
        '<div class="auth-info">' +
        '<div class="auth-original" style="display:none;">原创</div>' +
        '<div class="auth-date">' + data.created_at.substr(0, 10) + '</div>' +
        '<div class="auth-name">' + data.auth.substr(0, 10) + '</div>' +                
        '<div class="auth-publisher" style="display:none; margin-right: 0.08rem;">' + data.publisher.substr(0, 10) + '</div>' +
        '<div class="auth-main">' + pt + '</div>' +
        '</div>' +
        '<div id="read-art">' + data.content + '</div>' +
        '<div id="footer">' +
        '<div class="read-org" style="display: none;"><a href=' + data.href + '>阅读原文</a></div>' +
        '<div class="read-count">阅读 ' + data.views +'</div>' +
        // '<div class="read-like"><img src="/common/img/good.png" alt=""/><span class="like-count"> ' + data.praise_num +' </span></div>' +
        '</div>' +
        '</div>'
    return templete;
}

var loadArticle = function(reqUrl, id, type, data, pt){
    $("title").text(data.title);
    var res = artTemplete(data, pt);
    $("#read").append(res);
    if (data.href != '') {
        $(".read-org").show();
    }
    if(data.is_original == 2) {
        $(".auth-original").show();
    }
    var publisher = data.publisher;
    if (publisher != '') {
        $(".auth-publisher").show();
    }

    $("#read-art img").css({"width": "100%", "height": "auto"});
    //like count
    var likeState = false;
    /*$(".read-like").click(function(){
        // if (isLogin) {
            if (!likeState) {
                var weid = $("#read-title").attr("class");
                like(weid); //点赞，取消点赞 weid是文章id
            }
        // } else {
            // router('login');
        // }
    })*/
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
            console.log(data);
            if (data.code == 200){
                console.log(data.data[0].praise_num);
                $(".like-count").text(data.data[0].praise_num);
                $(".read-like img").attr("src", "/common/img/good+.png");
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
        data: {"articleId": id},
        success: function(data){
            console.log(data);
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}

var __init = function(id){
    $.ajax({
        url: ARTICLE + '/' + id,
        dataType: 'json',
        success: function(data){
            console.log(data);
            if (data.code == 200) {
                var art = data.data;
                $.ajax({
                    url: apiUrl + "cms/setting/show",
                    dataType: 'json',
                    success: function(data){
                        $("#favicon").attr('href', ApiMaterPlatQiniuDomain + data.data.favicon);
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
                        loadArticle('', art.weid, art.cate_id, art, name);
                    }
                })
                /*var next = setInterval(() => {
                        var imgWidth = $("#read-art img").width();
                if (imgWidth != 0) {
                    var currWidth = (375 - imgWidth) / 2;
                    $("#read-art img").css("margin-left", currWidth);
                    clearInterval(next);
                }
                }, 50);*/
        }
    }
})

view(id);

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

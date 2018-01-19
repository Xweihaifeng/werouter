/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/

 var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);
    $(".linkto").attr('href', '/' + domain)
    $(document).ready(function(){
    var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;

    // token 加载值请求头（Headers）
    var token = window.localStorage.getItem('token'), isLogin = false;
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login a").css({
                'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100%'
            });
            $("#login a").addClass("i-header").html("");
        }
    }

    init(token);

    var router = function(route){
        if (!isLogin) {
            showLogin = true;
            $("#modal_login").fadeIn(300);
        } else {
            window.location.href = "/";
        }
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
            $(".show-login").css({
                "margin-top": top + height,
                "margin-left": width
            });
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

/*    var options0 = $.get(CMS_ADVS);
    options0.done(function(data) {
        console.log(data);
        if(data.code == 200) {
            if(!data.data) {
                return false;
            }

            var setting = data.data.setting;
            window.localStorage.setItem("logo", setting.logo);
            window.localStorage.setItem("fav", setting.favicon);

            if(!setting.favicon == false) {
                var favicon = ApiMaterPlatQiniuDomain + setting.favicon;
                $("#public_icon").attr("href", favicon);
            }

            if(!setting.logo == false) {
                var logo = ApiMaterPlatQiniuDomain + setting.logo;
                // $("#home .logoImg").css({"background-image": "url(" + logo + ")"});
                $("#home img").attr("src",logo );
            }
        }
    });*/

    var weid = localStorage.getItem('weid');

    var activityid = window.location.href.split('/').pop();   
    var url = window.location.href.split('/');
    var domain = url.slice(3, 4)[0];
    console.log(url);
    console.log(domain);
    
    //获取当前网址，如： http://localhost:8083/proj/meun.jsp  
    var curWwwPath = window.document.location.href;  
    //获取主机地址之后的目录，如： proj/meun.jsp  
    var pathName = window.document.location.pathname;  
    var pos = curWwwPath.indexOf(pathName);  
    //获取主机地址，如： http://localhost:8083  
    var localhostPath = curWwwPath.substring(0, pos);  
    console.log(localhostPath);
    localStorage.setItem("localhostPath",localhostPath);

    // 1获取活动详情
var activitydetail=function(id,nickname,imgUrl,applyid=0){
        $.ajax({
            url: ACTIVITY_DETAIL+"/"+id,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                        
                        $(".act_title").text(data.data.title);     
                        var linkurl=localhostPath+domain+"/activity/"+id;
                        $(".activity_link").text(linkurl);
                        $(".activity_link").attr("href",linkurl);
                        var canvas = document.createElement('canvas'),
                            options = {
                                width: $('#qrcode').width(),
                                height: $('#qrcode').height(),
                                text: linkurl,
                            };
                        if (!canvas.getContext) {
                            options.render = 'table';
                        }
                        $('#qrcode').qrcode(options);
                        common.init();
                        common.copy();
                      
                              
                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
   
var startactivitydetail=function(id,nickname,imgUrl){
    if(id!=null && id!='' && id.length==36){ activitydetail(id,nickname,imgUrl);}
    /*$(".support").bind("click",function(){
        Support(id,nickname,imgUrl,$(this).data('id'));
    })*/
}
    

 

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


  //获取通用用户信息
    var host = 'http://oty3r3tmi.bkt.clouddn.com/';
    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            /*headers: {
                'Token': localStorage.getItem('token')
            },*/
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    console.log(weid)
                    var imgUrl = info.avatar;
                    if (imgUrl.indexOf('http') === -1){
                        imgUrl = host + imgUrl;
                    }
                    if (info.avatar != "") {
                        // $("#head-icon, .user-head").css({
                        //     "background": "url(" + imgUrl + ") no-repeat center",
                        //     "background-size": "100%"
                        // });
                        $(".top_avatar>img").attr("src",imgUrl);


                    } else {
                        // $("#head-icon, .user-head").css({
                        //     "background": "url(/common/img/avatar.png) no-repeat center",
                        //     "background-size": "110%"
                        // });
                        $(".top_avatar>img").attr("src","/common/img/avatar.png");

                    }
                    if(info.nickname==null){
                        var nickname=info.real_name;
                    }else{
                        var nickname=info.nickname;
                    }
                    $(".line-0,.linkto").html(
                        nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".oline-2").find("span").eq(1).text(info.motto);
                    $(".user-cnt").text(info.real_name);
                    artCount(weid);
                    //artTypeList(weid);
                    // catesfun(weid);
                     startactivitydetail(activityid,nickname,imgUrl);
                    
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data);
                    if (data.data == null) {

                    } else {
                        //微主页banner图
                        var bgLogo = data.data.background;
                        if (bgLogo != null) {
                            $("#art-head").css({
                                "background": "url(" + bgLogo + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                        //微名片背景
                        var bgUser = data.data.background_user;
                        if (bgUser != null){
                            $(".user-info").css({
                                "background": "url(" + bgUser + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                        if (data.data.is_brand == 1) {
                            hasBrand(userId);
                        }
                    }
                } else {
                    /*layer.msg(data.message, {
                        time: 1500
                    });*/
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var hasBrand = function(weid){
        $.ajax({
            url:BRAND_DETAIL_USER+'/' + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data);
                    if (data.data == null) {

                    } else {
                        $(".line-0").html(
                            data.data.title + '<img src="/user/img/vrenzheng.png" alt="">'
                        );
                        $(".line-1").text("品牌介绍");
                        var logo = data.data.logo;
                        if (logo != null){
                            $("#head-icon").css({
                                "background": "url(" + logo + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                    }

                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //个性域名用户weid
    var userId;
    var __init = function(domain) {
        $.ajax({
            url: PAGES_DETAIL_DOMAIN + domain,
            type: 'GET',
            success: function(data){
                if (data.code == 200){
                    //var domain = data.data.domain;
                    console.log(data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        console.log('userId:', userId);
                        console.log('userDetail')
                        getUserInfo(USERDETAIL, "/" + userId);
                        hasDomain(weid);
                    } else {
                        domain = '';
                        getUserInfo(FOUNDER, '');
                        console.log('router error')
                    }
                } else {
                    // window.location.href = "/*";
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
   
    if (domain == 'wemall') {
        domain = '';
    } else {
        domain = "/" + domain;
    }   

    if (domain != '') {
        __init(domain);
    }

    var artCount = function(weid){
        $.ajax({
            url: ARTICLES_LISTCOUNT+"?userId=" + weid,
            type: 'get',
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    $(".user-art").children('div:eq(0)').text(data.data);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }


})
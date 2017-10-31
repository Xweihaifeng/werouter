/**
 * Created by Hongguang on 2017/7/27.
 */

$(document).ready(function(){

    //resize
    var setHeight = function(ch){
        $(".left-nav").css("height", ch);
    }

    var showLogin = false; //调整窗口大小时登陆是否存在
    var width = $(window).width() / 2 - 180;
    var height = $(window).height() / 2 - 165;
    var currHeight = $(".home").height();
    setHeight(currHeight);
    var currPage = "home"; //当前页

    $(window).resize(function(){
        width = $(window).width() / 2 - 180;
        height = $(window).height() / 2 - 165;
        if (showLogin){
            router('login');
        }

        if (currPage == 'home'){
            var currHeight = $(".home").height();
            setHeight(currHeight);
        }

        if (currPage == 'article'){
            var currHeight = $("#art-head").height() + $("#art-body").height();
            setHeight(currHeight);
        }

        if (currPage == 'read'){
            var currHeight = $("#read").height();
            setHeight(currHeight);
        }

        //$("#left, #middle, #right").css("height", $(window).height());
    })

    //微主页
    /*var navList = [
        ['个人设置', ['img/edit.png', '个人资料'], ['img/address.png', '收货地址'], ['img/rz.png', '实名认证'], ['img/phone.png', '修改手机'], ['img/vip.png', 'V认证']],
        ['我的文章', ['img/article.png', '发布文章'], ['img/money.png', '打赏文章'], ['img/skip.png', '转发文章'], ['img/find.png', '发现文章']]
    ]

    //基于navList结构生成DOM
    var generator = function(id){
        var templete = '';
        navList[id].forEach( x => {
            if (typeof x != "string") {
            templete += '<div id="we-list">' +
            '<div class="we-cont">' +
            '<img src=' + x[0] + ' width="20" alt=""/>' +
            '<span>' + x[1] + '</span>' +
            '</div>'
            }
        });
        return templete;
    }

    //个人设置
    $("#we-login").click(function(){
        $("#middle").html('');
        $("#middle").append('<div id="we-title">' + navList[0][0] + '</div></div>');
        $("#middle").append(generator(0));
    })

    //我的文章
    $("#we-article").click(function(){
        $("#middle").html('');
        $("#middle").append('<div id="we-title">' + navList[1][0] + '</div></div>');
        $("#middle").append(generator(1));
    })*/

    //route
    $(".login").hide();
    $(".article").hide();
    var isLogin = true; //判断用户登陆与否
    var router = function(route){
        var routerList = ['header', 'login', 'article'];

        var isMember = function(routerList, route){
             return routerList.filter(x => x === route);
        }

        var header = function(){
            //window.location.href = "modules/news/content1.html";
            currPage = "home";
            $(".left-nav").show();
            //$("#right-nav").show();
            $(".home").show();
            $(".article").hide();
            $(".login").hide();
            $("#read").hide();
            var currHeight = $(".main").height();
            setHeight(currHeight);
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
                isLogin = true; //已登陆
                showLogin = true;
                $("#right-nav").hide();
                $(".home").hide();
                $(".article").hide();
                $("#read").hide();
                $(".left-nav").show();
                $(".login").show();
                var currHeight = $(window).height();
                $("#middle, #right").css("height", currHeight);
                setHeight(currHeight + 90);
                /*$("#middle").html('');
                $("#middle").append('<div id="we-title">' + navList[0][0] + '</div></div>');
                $("#middle").append(generator(0));*/
            }
        }

        var article = function(){
            currPage = "article";
            $("#right-nav").hide();
            $(".home").hide();
            $(".login").hide();
            $(".article").show();
            var currHeight = $("#art-head").height() + $("#art-body").height();
            setHeight(currHeight);
            $("#read").hide();
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#header, #login, #article").click(function(){
        var id = $(this).attr("id");
        router(id);
    })

    //关闭登录模态框
    $(".close").click(function(){
        showLogin = false;
        $("#modal").hide();
        $(".show-login").hide();
        $("body").css("overflow", "auto");
    })

    //点击登录按钮
    //有问题
    $("#log-in").click(function(){
        showLogin = false;
        isLogin = true;
        $("#modal").hide();
        $(".show-login").hide();
        $("body").css("overflow", "auto");
        router('login');
    })

    //login's back button
    //后退逻辑需要仔细考虑
    $(".back").click(function(){
        $(".left-nav").show();
        //$("#right-nav").show();
        $(".article").hide();
        $(".login").hide();
        $("#read").hide();
        if (currPage == "read"){
            $("#" + currPage).show();
        } else {
            $("." + currPage).show();
        }
    })

    //left-navbar show words
    $("#article, #project, #active, #shopping, #zone").hover(function(){
        $(this).find(".word").show()
    }, function(){
        $(this).find(".word").hide();
    })

    //文章页
    $(".art-cont").click(function(){
        $(".article").hide();
        $("#read").show();
        currPage = 'read';
        var currHeight = $("#read").height();
        setHeight(currHeight);
    })

    //article
    var act = "last";
    $("#daily, #type").hide();
    $(".last, .daily, .type").click(function(){
        $("." + act).removeClass("active");
        $("#" + act).hide();
        act = $(this).attr("class");
        $(this).addClass("active");
        $("#" + act).show();
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

    //breadcrumb
    $(".homepage").click(function(){
        router('header');
    })

    $(".back-art").click(function(){
        router('article');
    })

    //like count
    var likeState = false;
    $(".read-like").click(function(){
        if (!likeState){
            var cnt = parseInt($(".like-count").text()) + 1;
            $(".read-like img").attr("src", "img/good+.png");
            $(".like-count").text(" " + cnt);
            likeState = true;
        } else {
            var cnt = parseInt($(".like-count").text()) - 1;
            $(".read-like img").attr("src", "img/good.png");
            $(".like-count").text(" " + cnt);
            likeState = false;
        }
    })

    //回到顶部
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

    //微主页
    $("#we-release").click(function(){
        $("#show-art").hide();
        $(".we-release").show();
    })




})
/**
 * Created by Yaoer on 2017/8/6.
 */

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
            window.location.href = "../user/discovery";
        }
    }

    var article = function(){
        showLogin = false;
        window.location.href = "../article/";
    }

    if (isMember(routerList, route) != ""){
        eval(route)();
    }
}

$("#home, #login, #article").click(function(){
    var id = $(this).attr("id");
    router(id);
})

var login = function(){
    window.location.href = "/login";
}

//left-navbar show words
$("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
    var id = $(this).attr("id");
    if (id != 'login') {
        $(this).find(".word").show();
        $(this).css("line-height", "60px");
        $("#" + id + " .word").css("margin-top", "-30px");
    } else {
        if (!isLogin) {
            $(this).find(".word").show();
            $(this).css("line-height", "60px");
            $("#" + id + " .word").css("margin-top", "-30px");
        }
    }
}, function(){
    var id = $(this).attr("id");
    $(this).find(".word").hide();
    $(this).css("line-height", "80px");
    $("#" + id + " .word").css("margin-top", "-55px");
})

//主页初始化
var init = function(token){
    if (token != 'null' && token != undefined) {
        showLogin = false;
        isLogin = true;
        //加载用户头像
        $("#login div img").hide();
        $(".log-head").css({
            'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
            'background-size': '100% 100%'
        })
        $(".log-head").show();

        $("#avatar .avatar-icon").css({
            'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
            'background-size': '100% 100%'
        })
    }
}

init(localStorage.getItem('token'));
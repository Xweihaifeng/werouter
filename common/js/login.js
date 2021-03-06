/**
 * Created by Hongguang on 2017/8/4.
 */

$(document).ready(function(){
    var currWidth = $(window).width();
    var currHeight = $(window).height();
    var width = $(window).width() / 2 - 180;
    var height = $(window).height() / 2 - 165;

    $("#bg").css("height", currHeight);
    $(".show-login").css("top", height);
    $(window).resize(function(){
        currWidth = $(window).width();
        currHeight = $(window).height();
        width = $(window).width() / 2 - 180;
        height = $(window).height() / 2 - 165;
        $("#bg").css("height", currHeight);
        $(".show-login").css({
            "top": height
        });
    })

    var saveUserInfo = function(token, weid) {
        localStorage.setItem('token', token);
        localStorage.setItem('weid', weid);
    }

    var tusitemp="";
    function mess_tusi(strs){
        //清除事件
        clearTimeout(tusitemp);
        $("#mess_tusi").remove();
        //创建吐丝层并写入内容
        if(!$("#mess_tusi").attr("id")){ //吐丝层不存在创建
            $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>"+strs+"</span></div>"); //写入内容
        }else{
            $("#mess_tusi").html(strs);  //写入内容
        }

        //定义吐丝层位置
        var left=(1200-$("#mess_tusi").width())/2 + 70;//居中
        var top=$(window).height()*0.25;
        $("#mess_tusi").css({"left":left+"px","top":top+"px"});

        //显示吐丝层
        $("#mess_tusi").css("display",'');

        //2秒后关闭
        tusitemp =  setTimeout(function (){
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        },2000);
        return false;
    }

    //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = 'index';
        }

        var login = function(){
            if (!isLogin) {
                showLogin = true;
            } else {
                window.location.href = "user";
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
                mess_tusi("手机号码错误");
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
                    saveUserInfo(data.token, data.data.weid);
                    isCheckNum = false;
                    window.location.href = 'user';
                } else {
                    lock = false;
                    clearInterval(count);
                    mess_tusi("登陆失败，请重新获取验证码");
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
                mess_tusi("手机号码错误");
                return;
            }
            if (!(checkNum.length == 5) || !isCheckNum) {
                mess_tusi("手机验证码错误");
                return;
            }
            if (!isChecked) {
                mess_tusi("请确认服务条款");
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

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            window.location.href = 'user';
        }
    }

    init(localStorage.getItem('token'));

    $("#qrcode").click(function(){
        $(".login-body").hide();
        $(".wexin").show();
    })

    $(".to-login").click(function(){
        $(".login-body").show();
        $(".wexin").hide();
    })

})
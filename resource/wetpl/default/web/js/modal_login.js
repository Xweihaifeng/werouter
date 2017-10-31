$(function() {

    // localStorage.removeItem('token');
    // localStorage.removeItem('weid');
    
    var token = window.localStorage.getItem('token'), get_weid;
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });

        get_weid = window.localStorage.getItem("weid");
        var pathname = window.location.pathname.split('/').slice(1,3);
        if(pathname[0] == 'login') {
            // window.location.href = "/";
            console.log('token error')
        }
    }

    const template_login = `
    <div id="modal"></div>
    <div class="show-login">
        <div class="close"><span class="close-btn"> &times; </span></div>
        <div class="login-cont">
            <div class="login-heading"> 快速登录 </div>
            <div class="login-body">
                <div class="input-group flex">
                    <div class="input-group-btn">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> +86 中国 </button>
                        <ul class="dropdown-menu">
                            <li><a class="active"> +86 中国 </a></li>
                            <li><a > 美国 </a></li>
                        </ul>
                    </div>
                    <input type="text" class="form-control phone-num" maxlength="11" placeholder="请输入手机号码">
                </div>

                <div class="input-group flex">
                    <input type="text" class="form-control image_code" maxlength="5" placeholder="请输入图片验证码">
                    <span class="input-group-btn">
                        <img src="" class="btn btn-default" id="image_code_id_url" alt="图片验证码" style="height:40px" title="图片验证码">
                    </span>
                </div>

                <div class="input-group flex">
                    <input type="text" class="form-control check-num" maxlength="6" placeholder="请输入短信验证码">
                    <span class="input-group-btn">
                        <button class="btn btn-default get-check" type="button"> 获取验证码 </button>
                    </span>
                </div>
                <div class="check">
                    <input type="checkbox" id="check" checked>
                    <span><a id="consent_clause"> 已阅读并同意《<span id="corporation"></span>服务条款》</a></span>
                </div>
                <div id="log-in">
                    <a class="button button-lowercase button-primary login-bt"> 登录 </a>
                </div>
            </div>
        </div>
    </div>`

    $("#modal_login").append(template_login);

    const template = `
    <li id="home" style="height: 90px"><a class="logoImg"></a></li>
    <li id="login" class="my-header"><a style="height: 90px"><i class="iconfont">&#xe618;</i><div class="menu-title"> 登录 </div></a></li>
    <li id="article"><a><i class="iconfont">&#xe608;</i><div class="menu-title"> 文章 </div></a></li>
    <li id="project"><a><i class="iconfont">&#xe61f;</i><div class="menu-title"> 项目 </div></a></li>
    <li id="active"><a><i class="iconfont">&#xe637;</i><div class="menu-title"> 活动 </div></a></li>
    <li id="shopping"><a><i class="iconfont">&#xe603;</i><div class="menu-title"> 商城 </div></a></li>
    <li id="zone"><a><i class="iconfont">&#xe639;</i><div class="menu-title"> 圈子 </div></a></li>`;

    $("#public_main_news_menu").append(template);

    var options1 = $.get(USERDETAIL + "/" + get_weid);
    options1.done(function(data) {
        if(data.code == 200) {
            if(!data.data) {
                return false;
            }

            var imgUrl = data.data.avatar;
            if(!imgUrl) {                
                imgUrl = "/common/img/my.png";
                console.log(imgUrl);
                $("#login a").css({"background": "url("+ imgUrl +") center center / cover no-repeat"});
                $("#login a").addClass("i-header").html("");

            } else if (imgUrl.indexOf('http') != 0 && imgUrl != "") {                
                imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
                console.log(imgUrl);
                $("#login a").css({"background": "url(" + imgUrl + ") center center / cover no-repeat"});
                $("#login a").addClass("i-header").html("");
                showLogin = false;
                isLogin = true;

            }
            
            window.localStorage.setItem("avatar", imgUrl);
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });

    var options0 = $.get(apiUrl + "cms/setting/show");
    options0.done(function(data) {
        if(data.code == 200) {
            if(!data.data) {
                return false;
            }

            var setting = data.data;
            window.localStorage.setItem("logo", setting.logo);
            window.localStorage.setItem("fav", setting.favicon);

            $("#corporation").text(setting.title);

            if(!setting.favicon == false) {
                var favicon = ApiMaterPlatQiniuDomain + setting.favicon;
                $("#public_icon").attr("href", favicon);
            }

            if(!setting.logo == false) {
                var logo = ApiMaterPlatQiniuDomain + setting.logo;
                $("#home .logoImg").css({"background-image": "url(" + logo + ")"});
            }
        }
    });
    options0.fail(function(error) {
        console.error(error);
    });

    var showLogin = false; //调整窗口大小时登陆框是否存在
    $(window).resize(function(){
        if (showLogin){
            router('login');
        }
    })

    //route
    var isLogin; //判断用户登陆与否
    var router = function(route){
        if(!window.localStorage.getItem("token")) {
            isLogin = false;
        } else {
            isLogin = true;
        }
        var routerList = ['home', 'login', 'article','active','project', 'shopping','zone', 'zan'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal_login").fadeIn(300);
            } else {
                window.location.href = "/user";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href = "/index/article";
        }

        var active = function(){
            showLogin = false;
            window.location.href = "/index/activity";
        }
        var project = function(){
            showLogin = false;
            // window.location.href = "/index/project";
        }


        var shopping = function(){
            showLogin = false;
            // window.location.href = "/index/wemall";
        }

        var zone = function(){
            showLogin = false;
            // window.location.href = "/index/quan";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article,#active,#project, #shopping,#zone, #zan").click(function(){
        var id = $(this).attr("id");
        router(id);
    })

    //关闭登录模态框
    $(".close").click(function(){
        showLogin = false;
        $("#modal_login").fadeOut(300);
        $("body").css("overflow", "auto");
    })

    function setCookie(token, expiredays)
    {
        var Days = expiredays;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = "token="+ escape (token) + ";expires=" + exp.toGMTString() +";path=/";
    }

    var saveUserInfo = function(token, weid, imgUrl) {
        localStorage.setItem('token', token);
        localStorage.setItem('weid', weid);
        setCookie(token, 7);
        if(!imgUrl) {

            imgUrl = "/common/img/my.png";
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
    var lock = false, isCheckNum = false, /*默认false*/ count = false; /*验证码倒计时*/
    var getCheck = function(phoneNum){
        var timeout = false;
        var seconds = 60;

        lock = true;
        count = setInterval(function(){
            if (seconds > 0){
                seconds -= 1;
                $(".get-check").text("剩余"+ seconds + "秒");
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

    var phoneNum = 0, checkNum = 0, imageCode = '', imageCodeID = '', flag = false;

    $('#image_code_id_url').bind("click", image_code_id);
    function image_code_id() {
        $.ajax({
            url: USER_IMAGECODEID,
            async: false,
            success: function(data) {
                if(data.code == 200) {
                    imageCodeID = data.data;
                    var image_code = USER_IMAGECODE + data.data;
                    $("#image_code_id_url").attr("src", image_code);
                }
            },
            error: function(error) {
                console.error(error);
            }
        })
    }
    image_code_id();

    $(".get-check").click(function(){
        if (!lock) {
            phoneNum = $(".phone-num").val();
            imageCode = $(".image_code").val();
            var regexp = /^(13|14|17|15|18)/;
            var reg =  new RegExp(regexp);
            if (reg.test(phoneNum) && phoneNum.length == 11){
                $.ajax({
                    url: USER_GETIMAGECODE + imageCodeID,
                    async: false,
                    success: function(data) {
                        console.log(data.data);
                        console.log($(".image_code").val());
                        if(data.code == 200) {
                            if(data.data != $(".image_code").val()) {
                                layer.msg("请输入正确的图片验证码", { time: 2500 });
                                image_code_id();
                                return false;
                            } else {
                                getCheck(phoneNum);
                            }
                        }
                    },
                    error: function(error) {
                        console.error(error);
                    }
                })
            } else {
                layer.msg("手机号码错误", { time: 2500 });
                return false;
            }
        }
    })

    //用户登录
    var login = function(phoneNum, checkNum, imageCode, imageCodeID){
        $.ajax({
            url: LOGIN,
            type: 'post',
            data: {'phone': phoneNum, 'code': checkNum , 'imagecode': imageCode, 'imagecode_id': imageCodeID },
            success: function(data){
                console.log(data);
                if (data.code != -200) {
                    saveUserInfo(data.token, data.data.weid, data.data.avatar);
                    showLogin = false;
                    isLogin = true;
                    isCheckNum = false;
                    window.location.href = '/user/';
                } else {
                    lock = false;
                    clearInterval(count);
                    layer.msg(data.message, { time: 2500 });
                    image_code_id();
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
        imageCode = $(".image_code").val();
        var regexp = /^(13|14|17|15|18)/;
        var reg =  new RegExp(regexp);
        if (reg.test(phoneNum) && phoneNum.length == 11 && checkNum.length == 6 && isCheckNum && isChecked && imageCode && imageCodeID) {
            login(phoneNum, checkNum, imageCode, imageCodeID);
        } else {
            if (!(phoneNum.length == 11) || !reg.test(phoneNum)){
                layer.msg("手机号码错误", { time: 2500 });
                return;
            }
            if(!imageCode || !imageCodeID) {
                layer.msg("图片验证码错误", { time: 2500 });
                return;
            }
            if (!(checkNum.length == 6) || !isCheckNum) {
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
    $(".center").css("border-bottom", "3px solid #2596e8");
    $(".center, .sirase, .release").hover(function(){
        $("." + rem).css("border-bottom", "none");
        $(this).css("border-bottom", "3px solid #2596e8");
        var item = $(this).attr('class').split(' ')[0];
        rem = item;
    }, function(){
        $("." + rem).css("border-bottom", "3px solid #2596e8");
        var res = remove(newsItems, rem);
        res.map(x => $("." + x).css("border-bottom", "none"));
    })

    $("#add").hover(function () {
        $(".add").show();
    }, function () {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function () {
        $(".avatar").show();
    }, function () {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    $("#avatar-admin").click(function(){
        window.location.href = "/user/admin"
    })

    $("#qrcode").click(function(){
        $(".login-body").hide();
        $(".wexin").show();
    })

    $(".to-login").click(function(){
        $(".login-body").show();
        $(".wexin").hide();
    })
    $("#more").click(function(){
        $(this).text("没有更多");
    })


    
   
})

var luo_response = '';
function getResponse(resp)
{
    luo_response = resp;
}

$(function() {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    var token = docCookies.getItem('token'), get_weid;
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
        get_weid = docCookies.getItem("weid");
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

                <div class="input-group" style="margin-top: 15px;width: 330px;">
                    <div class="l-captcha"  data-site-key="f33ae969d27848afdaa3ff2c79c58476" data-width="328" data-callback="getResponse"></div>
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
                    <div id="qrcode"></div>
                </div>
            </div>
            <div class="wexin" style="display: none;">
                <div id="qrcode-block" style="margin-left:25px;"></div>
                <div class="to-login"></div>
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

    if (get_weid != undefined) {
        var imgUrl = plats_user_info.avatar;
        if(!imgUrl) {
            imgUrl = "/common/img/my.png";
            $("#login a").css({"background": "url("+ imgUrl +") center center / cover no-repeat"});
            $("#login a").addClass("i-header").html("");
        } else if (imgUrl.indexOf('http') != 0 && imgUrl != "") {
            imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
            $("#login a").css({"background": "url(" + imgUrl + ") center center / cover no-repeat"});
            $("#login a").addClass("i-header").html("");
            showLogin = false;
            isLogin = true;
        }

    var setting = plats_info;
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

    var showLogin = false; //调整窗口大小时登陆框是否存在
    $(window).resize(function(){
        if (showLogin){
            router('login');
        }
    })

    //route
    var domain = '/' + pages_index;

    //route
    var isLogin; //判断用户登陆与否
    var router = function(route, domain){
        if(!docCookies.getItem("token")) {
            isLogin = false;
        } else {
            isLogin = true;
        }
        var routerList = ['home', 'login', 'article', 'active', 'project', 'shopping', 'zone', 'zan'];

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
            window.location.href = domain + "/article";
        }

        var active = function(){
            showLogin = false;
            window.location.href = domain + "/activity";
        }
        var project = function(){
            showLogin = false;
            window.location.href = domain + "/project";
        }


        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

        var zone = function(){
            showLogin = false;
            window.location.href = domain + "/quan";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function(){
        var id = $(this).attr("id");
        router(id, '/' + pages_index);
    })

    //关闭登录模态框
    $(".close").click(function(){
        showLogin = false;
        $("#modal_login").fadeOut(300);
        $("body").css("overflow", "auto");
    })

    function setCookie(token, weid, expiredays)
    {
        var Days = expiredays;
        var exp = new Date();
        var domain = '.'+root_domain;
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = "token="+ escape (token) + ";weid=" + escape (weid) + ";expires=" + exp.toGMTString() +";path=/;domain="+domain;
    }

    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }

    var saveUserInfo = function(token, weid, imgUrl, identity) {
        //localStorage.setItem('token', token);
        //localStorage.setItem('weid', weid);
        localStorage.setItem('identity', identity);
        //setCookie(token, weid, 7);
        docCookies.setItem("token", token, new Date().getTime() + 7 * 24*60*60*1000, "/", '.' + root_domain);
        docCookies.setItem("weid", weid, new Date().getTime() + 7 * 24*60*60*1000, "/", '.' + root_domain);
        if(!imgUrl) {
            imgUrl = "/common/img/my.png";
            $("#login a").css({"background": "url("+ imgUrl +") center center / 100% no-repeat"});

        } else if (imgUrl.indexOf('http') != 0 && imgUrl != "") {
            imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
            $("#login a").css({"background": "url(" + localStorage.getItem('avatar') + ") center center / 100% no-repeat"});
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

    var phoneNum = 0, checkNum = 0, flag = false/*, imageCode = '', imageCodeID = ''*/;

/*    $('#image_code_id_url').bind("click", image_code_id);
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
    image_code_id();*/

    $(".get-check").click(function(){
        if (!lock) {
            phoneNum = $(".phone-num").val();
            // imageCode = $(".image_code").val();
            var regexp = /^(13|14|17|15|18)/;
            var reg =  new RegExp(regexp);
            if(!luo_response){
                layer.msg("请先通过验证!", { time: 2500 });
                return false;
            }
            if (reg.test(phoneNum) && phoneNum.length == 11){
                $(".get-check").html(`<img src="/common/img/loading.gif" alt="" />`);
              /*$.ajax({
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
                })*/
                getCheck(phoneNum);
            } else {
                layer.msg("手机号码错误", { time: 2500 });
                return false;
            }
        }
    })
    
    // 扫码登录
    /*function setCookie(token, expiredays) {
        var Days = expiredays;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "token=" + escape(token) + ";expires=" + exp.toGMTString() + ";path=/";
    }*/

    var code = GetQueryString('code');
    var state = GetQueryString('state');
    var ref_id = localStorage.getItem('ref_id');
    var ref_url = localStorage.getItem('ref_url');
    var domain = localStorage.getItem('domain');

    if (code !== null && code !== undefined && code !== '') {
        console.log(ref_id);
        console.log(domain);
        $.ajax({
            url: apiUrl + "wx/scan_callback",
            data: {
                'code': code,
                'state': state,
                'ref_id': ref_id,
                'ref_url': ref_url,
                'domain': domain
            },
            success: function(data) {
                //localStorage.setItem('token', data.token);
                //localStorage.setItem('weid', data.data.weid);
                localStorage.setItem('phone', data.data.phone);
                //setCookie(data.token, data.weid, 7);
                docCookies.setItem("token", data.token, new Date().getTime() + 7 * 24*60*60*1000, "/", '.' + root_domain);
                docCookies.setItem("weid", data.weid, new Date().getTime() + 7 * 24*60*60*1000, "/", '.' + root_domain);
                if (data.data.phone === null || data.data.phone === undefined || data.data.phone === '') {
                    location.href = siteUrl + "/bind";
                } else {
                    location.href = siteUrl + "/user";
                }

            }
        });
    }

    var qrlogin = function(){
        $.getScript("https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js", function(){
            $.ajax({
                url: apiUrl + 'setting/alias/weChatOpenConfig',
                type: 'get',
                dataType: 'json',
                success: function(result) {
                    if (result.code === 200) {
                        var obj = new WxLogin({
                            id: "qrcode-block",
                            appid: result.data.appid,
                            scope: "snsapi_login",
                            redirect_uri: window.location.href,
                            href: 'https://wezchina.com/common/css/wechat.css',
                            state: ""
                        });
                    } else {
                        parent.layer.msg(result.message);

                        return false;
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            });
        })
    }

    var only = true;
    $("#qrcode").click(function(){
        if (only) {
            only = false;
            qrlogin();
        }        
    })

    //用户登录
    var login = function(phoneNum, checkNum, ref_id, ref_url, domain/*, imageCode, imageCodeID*/){
        $.ajax({
            url: LOGIN,
            type: 'post',
            data: {'phone': phoneNum, 'code': checkNum,
                'ref_id': ref_id,
                'ref_url': ref_url,
                'domain': domain
            /* , 'imagecode': imageCode, 'imagecode_id': imageCodeID*/ },
            success: function(data){
                if (data.code != -200) {
                    saveUserInfo(data.token, data.data.weid, data.data.avatar, data.data.identity);
                    showLogin = false;
                    isLogin = true;
                    isCheckNum = false;
                    window.location.href = window.location.href;
                } else {
                    lock = false;
                    clearInterval(count);
                    layer.msg(data.message, { time: 2500 });
                    // image_code_id();
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
        var ref_id = localStorage.getItem('ref_id');
        var ref_url = localStorage.getItem('ref_url');
        var domain = localStorage.getItem('domain');
        //console.log(ref_id, ref_url, domain);
        phoneNum = $(".phone-num").val();
        checkNum = $(".check-num").val();
        // imageCode = $(".image_code").val();
        var regexp = /^(13|14|17|15|18)/;
        var reg =  new RegExp(regexp);
        if (reg.test(phoneNum) && phoneNum.length == 11 && checkNum.length == 6 && isCheckNum && isChecked/* && imageCode && imageCodeID*/) {
            login(phoneNum, checkNum, ref_id, ref_url, domain/*, imageCode, imageCodeID*/);
        } else {
            if (!(phoneNum.length == 11) || !reg.test(phoneNum)){
                layer.msg("手机号码错误", { time: 2500 });
                return;
            }
/*            if(!imageCode || !imageCodeID) {
                layer.msg("图片验证码错误", { time: 2500 });
                return;
            }*/
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
        //setCookie('', '', 0);
        docCookies.removeItem('token');
        docCookies.removeItem('weid');
        clearCookie();
    })

    $("#avatar-admin").click(function(){
        window.location.href = "/user/admin"
    })

    $("#qrcode").click(function() {
        $(".login-body").hide();
        $(".wexin").show();
    })

    $(".to-login").click(function() {
        $(".login-body").show();
        $(".wexin").hide();
    })
}
})
var luo_response = '';

function getResponse(resp) {
    luo_response = resp;
}

// 临时放到这里
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function empty(params) {
    if (params !== null && params !== undefined && params !== '') {
        return true;
    }
    return false;
}

function public_logon_link() {
    var url_parama = GetQueryString('url');
    if (url_parama !== null && url_parama !== undefined && url_parama !== '') {
        window.location.href = url_parama;
    } else {
        window.location.href = '/user/';
        // public_logon_link();
    }
}

$(function() {

    localStorage.removeItem('token');
    localStorage.removeItem('weid');
    setCookie('', -1);
    clearCookie();

    var token = docCookies.getItem("token"),
        get_weid
    const template = `
        <li id="home" style="height: 90px"><a class="logoImg"></a></li>
        <li id="login" class="my-header"><a style="height: 90px"><i class="iconfont">&#xe618;</i><div class="menu-title"> 登录 </div></a></li>
        <li id="article"><a><i class="iconfont">&#xe608;</i><div class="menu-title"> 文章 </div></a></li>
        <li><a href="#"><i class="iconfont">&#xe61f;</i><div class="menu-title"> 项目 </div></a></li>
        <li><a href="#"><i class="iconfont">&#xe637;</i><div class="menu-title"> 活动 </div></a></li>
        <li id="shopping"><a><i class="iconfont">&#xe603;</i><div class="menu-title"> 商城 </div></a></li>
        <li><a href="#"><i class="iconfont">&#xe639;</i><div class="menu-title"> 圈子 </div></a></li>
    `;

    $("#public_main_news_menu").append(template);

    $.ajax({
        url: apiUrl + "cms/setting/show",
        success: function(data) {
            var title = data.data.title;
            $("#corporation").text(title);
        }
    });

    if (token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });

        get_weid = docCookies.getItem("weid");
        var pathname = window.location.pathname.split('/').slice(1, 3);
        if (pathname[0] == 'login') {
            // window.location.href = "/";
            console.log('token error')
        }

        var options1 = $.get(USERDETAIL + "/" + get_weid);
        options1.done(function(data) {
            if (data.code == 200) {
                if (!data.data) {
                    return false;
                }

                var imgUrl = data.data.avatar;
                if (!imgUrl) {

                    imgUrl = "/common/img/my.png";
                    $("#login a").css({ "background": "url(" + imgUrl + ") center center / 100% no-repeat" });

                } else if (imgUrl.indexOf('http') != 0 && imgUrl != "") {

                    imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
                    $("#login a").css({ "background": "url(" + localStorage.getItem('avatar') + ") center center / 100% no-repeat" });
                    $("#login a").addClass("i-header").html("");
                    showLogin = false;
                    isLogin = true;

                } else if (imgUrl.indexOf('http') == 0 && imgUrl != "") {

                    $("#login a").css({ "background": "url(" + imgUrl + ") center center / 100% no-repeat" });
                }
                window.localStorage.setItem("avatar", imgUrl);
            }
        });
        options1.fail(function(error) {
            console.error(error);
        });

    }


    var options0 = $.get(CMS_ADVS);
    options0.done(function(data) {
        if (data.code == 200) {
            if (!data.data) {
                return false;
            }

            var setting = data.data.setting;
            window.localStorage.setItem("logo", setting.logo);
            window.localStorage.setItem("fav", setting.favicon);

            if (!setting.favicon == false) {
                var favicon = ApiMaterPlatQiniuDomain + setting.favicon;
                $("#public_icon").attr("href", favicon);
            }

            if (!setting.logo == false) {
                var logo = ApiMaterPlatQiniuDomain + setting.logo;
                $("#home .logoImg").css({ "background-image": "url(" + logo + ")" });
            }
        }
    });
    options0.fail(function(error) {
        console.error(error);
    });

    var showLogin = false; //调整窗口大小时登陆框是否存在
    $(window).resize(function() {
        if (showLogin) {
            router('login');
        }
    })

    //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route) {
        var routerList = ['home', 'login', 'article', 'shopping'];

        var isMember = function(routerList, route) {
            return routerList.filter(x => x === route);
        }

        var home = function() {
            window.location.href = '/';
        }

        var login = function() {
            if (!isLogin) {
                showLogin = true;
                $("#modal").show();
                $(".show-login").fadeIn(300);
            } else {
                window.location.href = "/user";
            }
        }

        var article = function() {
            showLogin = false;
            window.location.href = "/index/article";
        }

        var shopping = function() {
            showLogin = false;
            // window.location.href = "/index/wemall";
        }

        if (isMember(routerList, route) != "") {
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping, #zan").click(function() {
        var id = $(this).attr("id");
        router(id);
    })

    //关闭登录模态框
    $(".close").click(function() {
        showLogin = false;
        $("#modal").hide();
        $(".show-login").hide();
        $("body").css("overflow", "auto");
    })

    function setCookie(token, expiredays)
    {
        var Days = expiredays;
        var exp = new Date();
        var domain = '.'+root_domain;
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = "token="+ escape (token) + ";expires=" + exp.toGMTString() +";path=/;domain="+domain;
    }

    function clearCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }
    var saveUserInfo = function(token, weid, imgUrl, data, identity) {
        localStorage.setItem('token', token);
        localStorage.setItem('weid', weid);
        localStorage.setItem('phone', data.phone);
        localStorage.setItem('identity', identity);
        setCookie(token, 7);
        if (!imgUrl) {

            imgUrl = "/common/img/my.png";
            $("#login a").css({ "background": "url(" + imgUrl + ") center center / 100% no-repeat" });

        } else if (imgUrl.indexOf('http') != 0 && imgUrl != "") {

            imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
            $("#login a").css({ "background": "url(" + localStorage.getItem('avatar') + ") center center / 100% no-repeat" });
            showLogin = false;
            isLogin = true;

        } else if (imgUrl.indexOf('http') == 0 && imgUrl != "") {

            $("#login a").css({ "background": "url(" + imgUrl + ") center center / 100% no-repeat" });
        }
        $("#login a").addClass("i-header").html("");
        window.localStorage.setItem("avatar", imgUrl);
    }

    //login input check
    var isChecked = true; //默认选中
    $("#check").change(function() {
        if (!isChecked) {
            console.log("checked");
            isChecked = true;
        } else {
            console.log("uncheck");
            isChecked = false;
        }
    })

    //获取验证码
    var lock = false,
        isCheckNum = false,
        /*默认false*/
        count = false; /*验证码倒计时*/
    var getCheck = function(phoneNum) {

        $.ajax({
            url: CODES,
            dataType: 'json',
            type: 'post',
            data: { 'phone': phoneNum, luo_response: luo_response },
            success: function(data) {
                if (data.code == 200) {
                    isCheckNum = true;
                    var timeout = false;
                    var seconds = 60;

                    lock = true;
                    count = setInterval(function() {
                        if (seconds > 0) {
                            seconds -= 1;
                            $(".get-check").text("剩余" + seconds + "秒");
                        } else {
                            $(".get-check").text("重新获取验证码");
                            timeout = false;
                            seconds = 60;
                            lock = false;
                            clearInterval(count);
                        }
                    }, 1000);
                } else {
                    layer.msg("获取验证码失败", { time: 2500 });
                }
            },
            error: function(err) {
                layer.msg("获取验证码失败", { time: 2500 });
            }
        })
    }

    var phoneNum = 0,
        checkNum = 0,
        imageCode = '',
        imageCodeID = '',
        flag = false;

    $('#image_code_id_url').bind("click", image_code_id);

    function image_code_id() {
        $.ajax({
            url: USER_IMAGECODEID,
            async: false,
            success: function(data) {
                if (data.code == 200) {
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

    $(".get-check").click(function() {
        if (!lock) {
            phoneNum = $(".phone-num").val();
            imageCode = $(".image_code").val();
            var regexp = /^(13|14|17|15|18)/;
            var reg = new RegExp(regexp);
            if (!luo_response) {
                layer.msg("请先通过验证!", { time: 2500 });
                return false;
            }
            if (reg.test(phoneNum) && phoneNum.length == 11) {
                $(".get-check").html(`<img src="/common/img/loading.gif" alt="" />`);
                getCheck(phoneNum);
            } else {
                layer.msg("手机号码错误", { time: 2500 });
                return false;
            }
        }
    })

    //用户登录
    var login = function(phoneNum, checkNum, imageCode, imageCodeID) {
        $.ajax({
            url: LOGIN,
            type: 'post',
            data: { 'phone': phoneNum, 'code': checkNum, 'luo_response': luo_response },
            success: function(data) {
                console.log(data);
                if (data.code != -200) {
                    saveUserInfo(data.token, data.data.weid, data.data.avatar, data.data, data.data.identity);
                    docCookies.setItem("token", data.token, new Date().getTime() + 7 * 24*60*60*1000, "/", '.' + root_domain);
                    docCookies.setItem("weid", data.data.weid, new Date().getTime() + 7 * 24*60*60*1000, "/", '.' + root_domain);
                    showLogin = false;
                    isLogin = true;
                    isCheckNum = false;

                    public_logon_link();
                    // var url_parama = GetQueryString('url');
                    // if( url_parama !== null && url_parama !== undefined && url_parama !== '' ) {
                    //      window.location.href = url_parama;
                    // }else{
                    //      window.location.href = '/user/';
                    // }

                } else {
                    lock = false;
                    clearInterval(count);
                    layer.msg(data.message, { time: 2500 });
                }
            },
            error: function(err) {
                console.log(err);
            }
        })
    }

    //点击登录按钮
    var logBt = function() {
        phoneNum = $(".phone-num").val();
        checkNum = $(".check-num").val();
        imageCode = $(".image_code").val();
        var regexp = /^(13|14|17|15|18)/;
        var reg = new RegExp(regexp);
        if (reg.test(phoneNum) && phoneNum.length == 11 && checkNum.length == 6 && isCheckNum && isChecked) {
            login(phoneNum, checkNum, imageCode, imageCodeID);
        } else {
            if (!(phoneNum.length == 11) || !reg.test(phoneNum)) {
                layer.msg("手机号码错误", { time: 2500 });
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

    $(".login-bt").click(function() {
        logBt();
    })

    $(".phone-num").keydown(function(evt) {
        switch (evt.keyCode) {
            case 13:
                $(".check-num").select();
        }
    });

    $(".check-num").keydown(function(evt) {
        switch (evt.keyCode) {
            case 13:
                logBt();
        }
    });

    var newsItems = ['center', 'sirase', 'release'];
    var remove = function(arr, item) {
        return arr.filter(x => x != item);
    }

    var rem = 'center';
    $(".center").css("border-bottom", "3px solid #2596e8");
    $(".center, .sirase, .release").hover(function() {
        $("." + rem).css("border-bottom", "none");
        $(this).css("border-bottom", "3px solid #2596e8");
        var item = $(this).attr('class').split(' ')[0];
        rem = item;
    }, function() {
        $("." + rem).css("border-bottom", "3px solid #2596e8");
        var res = remove(newsItems, rem);
        res.map(x => $("." + x).css("border-bottom", "none"));
    })

    $("#add").hover(function() {
        $(".add").show();
    }, function() {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function() {
        $(".avatar").show();
    }, function() {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function() {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    $("#avatar-admin").click(function() {
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
})
/**
 * Created by Hongguang on 2017/9/5.
 */

// 主左




let mainLeft = `
        <div id="home">
            <img src="/common/img/home.png" width='90' alt="HOME" />
        </div>
        <div id="login">
            <div class="log-head"></div>
            <div><img src="/common/img/bbd.png" width='29' alt="login" /></div>
            <div class="word">登录</div>
        </div>
        <div id="article">
            <div><img src="/common/img/wz.png" width='29' alt="article" /></div>
            <div class="word">文章</div>
        </div>
        <!--<div id="project">
            <div><img src="/common/img/pj.png" width='29' alt="project" /></div>
            <div class="word">项目</div>
        </div>-->
        <div id="active">
            <div><img src="/common/img/at.png" width='29' alt="active" /></div>
            <div class="word">活动</div>
        </div>
        <div id="shopping">
            <div><img src="/common/img/sp.png" width='29' alt="shopping" /></div>
            <div class="word">商城</div>
        </div>
        <div id="zone">
            <div><img src="/common/img/qz.png" width='29' alt="zone" /></div>
            <div class="word">圈子</div>
        </div>`

$(".left-nav").append(mainLeft);

//主左二

let mainLeft_p = `
        <div id="dropdown"><div></div></div>
        <div id="avatar">
            <div class="avatar-icon"></div>
            <div class="avatar">
                <div id="avatar-admin" style="display: none;">
                    <a href="/user/admin" style="width:100%;">管理中心</a>
                </div>
                <div id="member-admin">
                    <a href="/apply" style="width:100%;" target= "_blank">会员申请</a>
                </div>
                <div id="avatar-logout">
                    <a onclick="logout();" style="width:100%;display: block;">安全退出</a>
                </div>
            </div>
        </div>
        <div id="alert">
            <div class="alert-icon"></div>
            <div class="alert-num"> 5 </div>
        </div>`

// <div id="member-admin" style="display: none;"><div></div>
//     <a href="/apply" style="width:100%;"> 会员申请 </a>
// </div>
$("#top").append(mainLeft_p);

//generate mainHeader
var mark = 'user';
var host = window.location.host;
var currPage = window.location.pathname.split('/').pop();
var parentPage = window.location.pathname.split('/').slice(2, 3)[0];

var genMenu = function(mark, host) {
    var genCont = function(data) {
        var template = `
            <a href="/user/` + data.url + `">
                <div id=` + data.mark + `>` + data.name + `</div>
            </a>`;
        return template;
    }

    var genTitle = function(data) {
        var template = `
            <div class="we-title" id=` + data.id + `>
                <img src=` + data.mark + ` width="18" alt="" />
                <span>` + data.name + `</span>
                <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
                <div class="we-cont" style="display: none;">` +
            data.children.map(x => genCont(x)).join('') +
            `</div>
            </div>`;
        return template;
    };

    var template = '';

    $.ajax({
        url: controlUrl + mark + '&domain=' + host,
        type: 'GET',
        async: false,
        success: function(data) {
            console.log(data);
            if (data.code == 200) {
                template = data.data.list.map(x => genTitle(x)).join('');
            }
        },
        error: function(xhr) {
            console.log(xhr)
        }
    })
    return template;
}

const message = `
            <div class="we-title" id="136">
                <img src="/common/img/information.png" width="18" alt="">
                <span>我的消息</span>
                <span><img src="/common/img/more1.png" width="18" class="title-img" style="transform: rotate(0deg);"></span>
                <div class="we-cont" style="height: 44px; padding-top: 0px; margin-top: 0px; padding-bottom: 0px; margin-bottom: 0px; display: none;">
                    <!--<a href="/user/myarticle/discover">
                        <div id="myarticle_discover">发现文章</div>
                    </a>-->
                </div>
            </div>
            `

$("#middle").append(genMenu(mark, domainHost)) // domain
console.log(currPage)
if (currPage != '' && currPage != 'user') {
    $("#" + parentPage + "_" + currPage).parent().parent(".we-cont").show();
    $("#" + parentPage + "_" + currPage).css({ "color": "red", "background": "#f7f7f7" })
} else {
    $("#settings_profile").parent().parent(".we-cont").show();
    $("#settings_profile").css({ "color": "red", "background": "#f7f7f7" })
}

var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
// console.log('logo:',logo);
$('#home img').attr('src', logo);
$("#av_online").bind("click", avatar_admin);

//上滑下拉
var flag = false;
$(".we-title").on("click", function(event) {
    event.stopPropagation();
    //本地储存
    sessionStorage.lastname = $(this).attr("id");
    //下拉上滑旋转
    $(".we-cont").stop().slideUp();
    if (!flag) {
        $(this).find(".we-cont").stop().slideToggle();
        flag = true;
    } else {
        $(this).find(".we-cont").stop().slideToggle();
        flag = false;
    }
    $(".title-img").css("transform", "rotate(0deg)");
    if ($(this).find(".title-img").css("transform") == "matrix(1, 0, 0, 1, 0, 0)") {
        $(this).find(".title-img").css("transform", "rotate(90deg)");
    } else {
        $(this).find(".title-img").css("transform", "rotate(0deg)");
    }
})

$(".we-cont").click(function(event) {
    event.stopPropagation();
})

//  登录token参数
var token = docCookies.getItem("token");
if (token) {
    $.ajaxSetup({
        global: true,
        headers: {
            'Token': token,
        }
    });
}

$("#avatar, #dropdown").hover(function() {
    $(".avatar").show();
}, function() {
    $(".avatar").hide();
})

// 在线认证开通状态判断
function online_cert() {
    var options3 = $.get(CERT_REALNAME_SETTING);
    options3.done(function(data) {
        if (data.code === 200) {
            var result = data.data;

            if (!result) {
                layer.msg("尚未开通此功能", { time: 2500 });
                return false;
            }
            if (result.status == 1 && result.auth_num > 0) {
                layer.msg("页面加载中...", { time: 2500 });
                setTimeout(function() {
                    window.location.href = "verified";
                }, 1000);
            } else {
                layer.msg("此功能暂时无法使用", { time: 2500 });
                return false;
            }
        }
    });
    options3.fail(function(error) {
        console.error(error);
    });
}

var cert_realname_setting = $.get(CERT_REALNAME_SETTING);
cert_realname_setting.done(function(data) {
    if (data.code == 200) {
        var result = data.data;
        if (!result) {
            console.log("在线认证未开通！");
            return false;
        }

        //  在线（status） : 1为开启，2为关闭
        //  人工（auth_open） : 1为开启，2为关闭
        if (result.status === 1 && result.auth_open === 1) {
            $(".on_line_cert").html('<a id="online">在线认证</a>');
            $("#online").bind("click", online_cert);
        }

        else if(result.status === 1 && result.auth_open === 2) {
            $("#settings_realname").parent("a").attr("href", '/user/settings/verified');
            if(window.location.pathname == '/user/settings/realname') {
                window.location.pathname = '/user/settings/verified';
            }
        }

        else if (result.status === 2 && result.auth_open === 1) {
            $("#settings_realname").parent("a").attr("href", '/user/settings/realname');
            if(window.location.pathname == '/user/settings/verified') {
                window.location.pathname = '/user/settings/realname';
            }
        }

        else if (result.status === 2 && result.auth_open === 2) {
            $("#settings_realname").parent("a").remove();
            if((window.location.pathname == '/user/settings/verified') || (window.location.pathname == '/user/settings/realname')) {
                window.location.pathname = '/user';
            }
        }
    }
});
cert_realname_setting.fail(function(error) {
    console.error(error);
});

function member_options() {
    // 是否为会员
    var member_options = $.get(MEMBER_PROFILE);
    member_options.done(function(data) {
        if (data.code == 200) {
            var result = data.data;

            if (result && result.is_info == 1 && result.final_audit == 1 && result.is_issued == 1) {
                // 证书已经颁发
                $("#v_v_member").attr("href", "/applicationsuccess");
                $("#member-admin a").attr("href", "/applicationsuccess");
                $("#member-admin a").text("会员详情");
                $("#v_v_member #my-member").text("会员详情");
                $("#v_v_member").show();
            }
        }
    });
    member_options.fail(function(error) {
        console.error(error);
    });
}
var pageInfo = function(callback) {
    $.ajax({
        url: PAGES_PAGE_INFO,
        type: 'GET',
        success: function(data) {
            if (data.code == 200) {
                callback(data.data);
            } else {
                layer.msg(data.message);
            }
        },
        error: function(error) {
            console.log(error);
        }
    })
}
pageInfo(function(data) {
    if (data.hasPages) {
        $("#avatar-admin").show();
    } else {
        $("#avatar-admin").hide();
    }
});
// 官方认证详情功能显示(是否开通官方认证)
var options1 = $.get(CERT_OFCCERTS);
options1.done(function(data) {
    if (data.code == 200) {

        var result = data.data;
        if (!result) {
            $("#v_form_list").show();
            $("#settings_personal").parent("a").attr("href", "/user/settings/personal");
            $(".personal").attr({ "disabled": false, "href": "personal" });
            $(".institutional").attr({ "disabled": false, "href": "institutional" });
            return false;
        }

        if (result.type == 1) {
            $("#settings_personal").parent("a").attr("href", "/user/settings/personal");
        } else if (result.type == 2) {
            $("#settings_personal").parent("a").attr("href", "institutional");
        }

        if (result.type == 1 || result.type == 2) {
            if(result.is_authenticated == 1) {
                $(".v-cert-success-info").show();
            } else {
                $(".v-cert-success-info").show();
            }

            // if (result.is_done == 1) {

            //     $(".whether-to-pass").show();

            // } else if (result.is_done == 2 && result.is_authenticated == 1) {
            //     if (result.operation_status == 2) {
            //         $("#v_v_member").show();
            //         member_options();
            //     }

                // var options = $
                    // 判断微主页是否开通
                    // var options3 = $.get(PAGES_PAGE_ISOPENPAGE);
                    // options3.done(function(data) {
                    //     if (data.code == 200) {
                    //         var result_status = data.data.result;
                    //         if (result_status) {
                    //             //$(".av-on-line").hide();
                    //             $("#avatar-admin").show();
                    //         } else {
                    //             //$(".av-on-line").show();
                    //             $("#avatar-admin").hide();
                    //         }
                    //     }
                    // });
                    // options3.fail(function(error) {
                    //     consolr.error(error);
                    // });
                    // $(".av-on-line").show();
            //     $(".v-cert-success-info").show();

            // } else if (result.is_done == 2 && result.is_authenticated == 2) {

            //     $(".whether-to-pass").show();
            //     $("#v_form_list").show();
            // }

        } else {
            $(".personal").attr({ "disabled": false, "href": "personal" });
            $(".institutional").attr({ "disabled": false, "href": "institutional" });
        }

    }
});
options1.fail(function(error) {
    console.error(error);
});

// 判断是否开通微主页
function avatar_admin() {
    layer.open({
        type: 1,
        title: '开通微主页',
        offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
            ,
        area: ['900px', '369px'],
        id: 'layerDemo' + type //防止重复弹出
            ,
        content: `
              <div class="cont-hd" style="overflow: hidden;width: 100%;box-sizing: border-box;margin: 0">
                 <div class="cont-L" style=" width: 165px;height:141px;float: left;margin-top:50px;margin-left: 30px">
                     <img src="/resource/wetpl/default/web/user/img/domain_res.png" alt="">
                 </div>
                <div class="cont-R" style="width: 670px;height: auto;float: right;margin-right: 30px;font-weight: normal;">
                    <div class="form-group" style="margin-top: 60px;margin-right: 30px;margin-bottom: 16px;overflow: hidden">
                        <button class="btn btn-success check-domain" style="width: 98px;height: 42px;line-height: 31px;text-align: center;background: #ffcc5f;color: #fff;margin-left: 20px;border-radius: 3px;margin-right: 18px;border: none;outline:none;float: right;" >检测</button>
                        <input id="user-domain" type="text" class="form-control" name="domain" value="" style="width:200px;display: inline-block;float: right;outline: none;height:42px" placeholder="请输入5~16位英文字符">
                        <label id="host" style="margin-left: 10px; padding-top: 8px; padding-right: 5px;display: inline-block;font-weight: normal;float: right;height:42px"></label>       
                    </div>
                    <div class="form-group" style="margin-top:15px;margin-right: 30px;overflow: hidden">
                        <button class="btn btn-default send-code" style="width: 98px;height: 42px;line-height: 31px;text-align: center;background: #ffcc5f;color: #fff;margin-left: 20px;border-radius: 3px;margin-right: 18px;border: none;outline:none;float: right" >发送验证码</button>
                        <input type="text" class="form-control" name="verifycode" value="" style="width:200px;display: inline-block;float: right;outline: none;height:42px" placeholder="请输入验证码">
                        <label style=" display: inline-block;font-size:14px;color:#333333;float: right;line-height: 37px;margin-right: 10px">验证码</label>           
                    </div>
               
                        <div class="save" style="float: right;width: 60px; height: 36px;text-align: center;line-height: 36px; border-radius: 3px;color: #fff;cursor: pointer;margin-top: 10px;font-size: 14px;margin-right:47px;background: #ffbf33;display: none;">保存</div>
                 
                </div>

            </div>`
            //,btn: '关闭全部'
            ,
        btnAlign: 'c' //按钮居中
            ,
        shade: 0 //不显示遮罩
            ,
        yes: function() {
            layer.closeAll();
        },
        success: function(layero) {
            var host = 'http://' + window.location.host;
            $("#host").text(host + "/");
            var weid = docCookies.getItem("weid");
            var store = function(sendData) {
                $.ajax({
                    url: PAGESTORE,
                    type: 'POST',
                    data: sendData,
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            layer.msg('微主页开通成功！', {
                                time: 1500
                            });
                            setTimeout(function() {
                                window.location.reload();
                            }, 2000);

                        } else {
                            layer.msg(data.message, {
                                time: 1500
                            });
                        }
                    },
                    error: function(xhr) {
                        console.log(xhr);
                    }
                })
            }
            var checkDomain = function(domain, callback) {
                layer.load(1);
                $.ajax({
                    url: PAGES_PAGE_CHECK_DOMAIN,
                    type: 'POST',
                    data: { domain: domain },
                    success: function(data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            callback(data.data);
                        } else {
                            layer.msg(data.message);
                        }
                    },
                    error: function(error) {
                        layer.closeAll('loading');
                        console.log(error);
                    }
                })
            }

            $(".save").click(function() {
                var domain = $("#user-domain").val();
                var code = $('input[name=verifycode]').val();
                var sendData = { weid: weid, domain: domain, code: code };
                if (domain != "") {
                    store(sendData);
                } else {
                    layer.msg('请输入个性域名', {
                        time: 1500
                    });
                }
            });

            function codeTimer($codeTimer) {
                var obj = $(".send-code");
                if (parseInt(obj.find('span').text()) <= 0) {
                    clearInterval($codeTimer);
                    obj.removeAttr('disabled');
                    obj.html('发送验证码');
                } else {
                    obj.find('span').text(parseInt(obj.text()) - 1);
                }
            }
            $(".check-domain").click(function() {
                var domain = $("#user-domain").val();
                if (domain.length === 0) {
                    layer.msg('请输入个性域名');
                    return;
                }
                $('.save').hide();
                checkDomain(domain, function(data) {
                    layer.msg('该个性别名可以使用');
                    $('.save').show();
                });
            });
            var $codeTimer;
            $(".send-code").click(function() {
                $.ajax({
                    url: CODES,
                    type: 'POST',
                    data: {
                        phone: plats_user_info.phone
                    },
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            layer.msg('发送成功！');
                            $(".send-code").html('<span>60</span>后重发');
                            $(".send-code").attr('disabled', true);
                            $codeTimer = setInterval(function() {
                                codeTimer($codeTimer);
                            }, 1000);
                        } else {
                            layer.msg(data.message);
                        }
                    },
                    error: function(xhr) {
                        console.log(xhr);
                    }
                })
            });

        }
    });
}

// 实名认证详情功能显示(是否开通实名认证)
var options = $.get(CERT_REALNAME_DETAIL);
options.done(function(data) {
    if (data.code == 200) {
        var result = data.data;
        if (!result) {
            $("#form_list").show();
            $("#avatar-admin").hide();
            $("#settings_personal").slideUp();
            return false;
        }
        if (result.is_authenticated == 2) {
            $("#settings_personal").slideUp();
            if (result.operation_status == 3) {
                $(".cert-to-pass, #form_list").show();
            }
        } else if (result.is_authenticated == 1 && result.operation_status == 2) {
            $(".cert-success-info").show();
            $("#settings_personal").slideDown();
        }
    }
});
options.fail(function(error) {
    console.error(error);
});

function setCookie(token, expiredays) {
    var Days = expiredays;
    var exp = new Date();
    var domain = '.' + root_domain;
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = "token=" + escape(token) + ";expires=" + exp.toGMTString() + ";path=/;domain=" + domain;
}

function clearCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
}

//主页初始化
var init = function(token) {
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
    }
}

init(docCookies.getItem("token"));

var domain;
var hasDomain = function(weid) {
    $.ajax({
        url: PAGES_PAGE_GETDETAILBYUSER + weid,
        type: 'GET',
        headers: {
            'Token': docCookies.getItem("token")
        },
        success: function(data) {
            // if (data.code == 401) {
            // domain = '/index';
            // localStorage.removeItem('token')
            // window.location.href = '/login'
            // }
            if (data.code == 200) {
                console.log(data);
                if (data.data != null) {
                    if (data.data.domain == null) {
                        //没有个性域名
                        domain = '/index';
                    } else {
                        //存在个性域名
                        domain = "/" + data.data.domain;
                    }
                } else {
                    domain = '/index';
                }
            }
            /*else {
             layer.msg(data.message, {
             time: 1500
             });
             }*/
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

var weid = docCookies.getItem("weid");
hasDomain(weid);

//route
var isLogin; //判断用户登陆与否
var router = function(route) {
    if (!docCookies.getItem("token")) {
        isLogin = false;
    } else {
        isLogin = true;
    }
    var routerList = ['home', 'login', 'article', 'active', 'project', 'shopping', 'zone', 'zan'];
    //var routerList = ['home', 'login', 'article', 'active', 'zan'];

    var isMember = function(routerList, route) {
        return routerList.filter(x => x === route);
    }

    var home = function() {
        window.location.href = '/';
    }

    var login = function() {
        if (!isLogin) {
            showLogin = true;
            $("#modal_login").fadeIn(300);
        } else {
            window.location.href = "/user";
        }
    }

    var article = function() {
        showLogin = false;
        window.location.href = domain + "/article";
    }

    var active = function() {
        showLogin = false;
        window.location.href = domain + "/activity";
    }
    var project = function() {
        showLogin = false;
        window.location.href = domain + "/project";
    }


    var shopping = function() {
        showLogin = false;
        window.location.href = domain + "/wemall";
    }

    var zone = function() {
        showLogin = false;
        window.location.href = domain + "/quan";
    }

    if (isMember(routerList, route) != "") {
        eval(route)();
    }
}

$("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function() {
    //$("#home, #login, #article, #active, #zan").click(function(){
    var id = $(this).attr("id");
    router(id);
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

//退出登陆
function logout() {
    $.ajax({
        url: apiUrl + 'logout',
        type: 'GET',
        headers: {
            'Token': plats_token
        },
        success: function(data) {
            if (data.code == 200) {
                // localStorage.clear();
                localStorage.removeItem('token');
                localStorage.removeItem('weid');
                setCookie('', -1);
                clearCookie();
                window.location.href = "/";
            }
        }
    });

}


//监听加载状态改变
document.onreadystatechange = completeLoading;

function completeLoading() {
    if (document.readyState == "complete") {
        if ($("#loadingDiv").length > 0) {
            $("#loadingDiv").animate({
                opacity: "hide"
            }, 300);
            if ($("#right").length > 0) {
                $("#right").css("display", "block");
            } else {
                $("#right_load_div").css("display", "block");
            }
        }
    }
}
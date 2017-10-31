/**
 * Created by Hongguang on 2017/9/5.
 */

// 主左

let mainLeft = `
        <div id="home">
            <img src="http://next.wezchina.com/storage/images/906f4f7c227f67a96a859bdf64cbd5c0.png" width='90' alt="HOME" />
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
        <div id="project">
            <div><img src="/common/img/pj.png" width='29' alt="project" /></div>
            <div class="word">项目</div>
        </div>
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
                    <a href="/login" style="width:100%;display: block;">安全退出</a>
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
var domain = window.location.host;
var currPage = window.location.pathname.split('/').pop();
var parentPage = window.location.pathname.split('/').slice(2,3)[0];

var genMenu = function(mark, domain) {
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
                <div class="we-cont" style="display: none;">`
                    + data.children.map(x => genCont(x)).join('') + 
                `</div>
            </div>`;
        return template;
    };

    var template = '';
    
    $.ajax({
        url: 'http://api.mp.wezchina.com/menu_config?mark=' + mark + '&domain=' + domain,
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

$("#middle").append(genMenu(mark, "qqxqs.com")) // domain
console.log(currPage)
if (currPage != '' && currPage != 'user') {
    $("#" + parentPage + "_" + currPage).parent().parent(".we-cont").show();
    $("#" + parentPage + "_" + currPage).css({"color": "red", "background": "#f7f7f7"})
} else {
    $("#settings_profile").parent().parent(".we-cont").show();
    $("#settings_profile").css({"color": "red", "background": "#f7f7f7"})
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
    if(!flag) {
        $(this).find(".we-cont").stop().slideToggle();
        flag = true;
    } else {
        $(this).find(".we-cont").stop().slideToggle();
        flag = false;
    }
    $(".title-img").css("transform", "rotate(0deg)");
    if($(this).find(".title-img").css("transform") == "matrix(1, 0, 0, 1, 0, 0)") {
        $(this).find(".title-img").css("transform", "rotate(90deg)");
    } else {
        $(this).find(".title-img").css("transform", "rotate(0deg)");
    }
})

$(".we-cont").click(function(event) {
    event.stopPropagation();
})

//  登录token参数
var token = window.localStorage.getItem('token');
if(token) {
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
        if(data.code === 200) {
            var result = data.data;

            if(!result) {
                layer.msg("尚未开通此功能", { time: 2500 });
                return false;
            }
            if(result.status == 1 && result.auth_num > 0) {
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
    if(data.code == 200) {
        var result = data.data;
        if(!result) {
            console.log("在线认证未开通！");
        } else if(result.status == 1) {
            $(".on_line_cert").html('<a id="online">在线认证</a>');
            $("#online").bind("click", online_cert);
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
        if(data.code == 200) {
            var result = data.data;

            if(result && result.is_info == 1 && result.final_audit == 1 && result.is_issued == 1) {
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

// 官方认证详情功能显示(是否开通官方认证)
var options1 = $.get(CERT_OFCCERTS);
options1.done(function(data) {
    if(data.code == 200) {

        var result = data.data;
        if(!result) {
            $("#v_form_list").show();
            $("#v_v_cert").attr("href", "/user/settings/personal");
            $(".personal").attr({"disabled": false, "href": "personal"});
            $(".institutional").attr({"disabled": false, "href": "institutional"});
            return false;
        }

        if(result.type == 1) {
            $("#v_v_cert").attr("href", "/user/settings/personal");
        } else if(result.type == 2) {
            $("#v_v_cert").attr("href", "institutional");
        }

        if(result.type == 1 || result.type == 2) {
            if(result.is_done == 1){

                $(".whether-to-pass").show();

            } else if(result.is_done == 2 && result.is_authenticated == 1) {
                if(result.operation_status == 2) {
                    $("#v_v_member").show();
                    member_options();
                }

                var options = $
                // 判断微主页是否开通
                var options3 = $.get(PAGES_PAGE_ISOPENPAGE);
                options3.done(function(data) {
                    if(data.code == 200) {
                        var result_status = data.data.result;
                        if(result_status) {
                            $(".av-on-line").hide();
                            $("#avatar-admin").show();
                        }
                        else {
                            $(".av-on-line").show();
                            $("#avatar-admin").hide();
                        }
                    }
                });
                options3.fail(function(error) {
                    consolr.error(error);
                });
                // $(".av-on-line").show();
                $(".v-cert-success-info").show();

            } else if(result.is_done == 2 && result.is_authenticated == 2) {

                $(".whether-to-pass").show();
                $("#v_form_list")    .show();
            }

        } else {
            $(".personal").attr({"disabled": false, "href": "personal"});
            $(".institutional").attr({"disabled": false, "href": "institutional"});
        }

    }
});
options1.fail(function(error) {
    console.error(error);
});

// 判断是否开通微主页
function avatar_admin() {

    var options2 = $.post(PAGESTORE);
    options2.done(function(data) {
        if(data.code == -200) {
            layer.msg(data.message, { time: 2500 });
            $(".av-on-line, #avatar-admin").show();
            return false;
        }
        if(data.code == 200) {
            if(!data.data) {
                $("#avatar-admin").hide();
                return false;
            }
            layer.msg("个人微主页开通成功", { time: 2500 });
            $("#avatar-admin").show();
            $(".av-on-line").hide();
        }
    });
    options2.fail(function(error) {
        $("#avatar-admin").hide();
        cosole.error(error);
    });
}

// 实名认证详情功能显示(是否开通实名认证)
var options = $.get(CERT_REALNAME_DETAIL);
options.done(function(data) {
    if(data.code == 200) {
        var result = data.data;
        if(!result) {
            $("#form_list").show();
            $("#avatar-admin").hide();
            $("#v_v_cert").slideUp();
            return false;
        }
        if(result.is_authenticated == 2) {
            $("#v_v_cert").slideUp();
            if(result.operation_status == 3) {
                $(".cert-to-pass, #form_list").show();
            }
        } else if(result.is_authenticated == 1 && result.operation_status==2) {
            $(".cert-success-info").show();
            $("#v_v_cert").slideDown();
        }
    }
});
options.fail(function(error) {
    console.error(error);
});

function setCookie(token, expiredays)
{
    var Days = expiredays;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = "token="+ escape (token) + ";expires=" + exp.toGMTString();
}

function clearCookie(){ 
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g); 
    if (keys) { 
        for (var i = keys.length; i--;) 
            document.cookie = keys[i]+'=0;expires=' + new Date(0).toUTCString()
        } 
}

$("#avatar-logout").click(function(){
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('weid');
    setCookie('', -1);
    clearCookie();
})

//主页初始化
var init = function(token){
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

init(localStorage.getItem('token'));

var domain;
var hasDomain = function(weid){
    $.ajax({
        url: PAGES_PAGE_GETDETAILBYUSER + weid,
        type: 'GET',
        headers: {
            'Token': localStorage.getItem('token')
        },
        success: function(data){
            console.log(data)
            if (data.data != null && data.code == 200){
                // console.log(data);
                if (data.data.domain == null) {
                    //没有个性域名
                    domain = '/index';
                } else {
                    //存在个性域名
                    domain = "/" + data.data.domain;
                }

            } else {
                // layer.msg(data.message, {
                //     time: 1500
                // });
                console.info(data.message);
                // window.localStorage.removeItem('token')
                // window.location.href = '/login'
            }
        },
        error: function(xhr){
            console.error(xhr);
        }
    })
}

var weid = localStorage.getItem('weid');
hasDomain(weid);

var isLogin = false; //判断用户登陆与否
function router(route){
        // console.log(route);
    
    // var routerList = ['home', 'login', 'article','active','project', 'shopping'];
    var routerList = ['home', 'login', 'article','active'];
        // console.log(route);

    var isMember = function(routerList, route){
        return routerList.filter(x => x === route);
    }

    var home = function(){
        window.location.href = '/';
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

            window.location.href = "/user";
        }
    }

    var article = function(){

        showLogin = false;
        window.location.href = domain + "/article";
//          window.history.go(0);
    }
    var active = function(){
        // console.log(domain);
        showLogin = false;
        window.location.href = domain + "/activity";
//          window.history.go(0);
    }
     var project = function(){
        // console.log(domain);
        showLogin = false;
        window.location.href = domain + "/project";
//          window.history.go(0);
    }

    var shopping = function(){
        showLogin = false;
        window.location.href = domain + "/wemall";
    }

    if (isMember(routerList, route) != ""){
        eval(route)();
    }
}

// $("#home, #login, #article,#active,#project, #shopping").click(function(){
$("#home, #login, #article,#active").click(function(){
    var id = $(this).attr("id");
    // console.log(id);
    router(id);
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
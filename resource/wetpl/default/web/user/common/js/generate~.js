/**
 * Created by Hongguang on 2017/9/5.
 */

// 主左

var genChild = function(data) {
    var template = '';
    data.map(x => {
        template +=
        '<a href="/user/' + x.url + '">' +
            '<div id="' + x.mark + '">' + x.name + '</div>' +
        '</a>'
    })    
    return template;
}

var genParent = function(data) {
    var icon = data.mark;
    var name = data.name;
    var id = data.id
    var child = data.children;
    var template = 
        '<div class="we-title" id="we_title_' + id + '">' +
            '<img src=' + icon + ' width="18" alt="" />' +
            '<span>' + name + '</span>' +
            '<span><img src="/common/img/more1.png" width="18" class="title-img"/></span>' +
            '<div class="we-cont" style="display:block;">' +                
                genChild(child);
            '</div>' +
        '</div>'
    return template;
}

$.ajax({
    url: 'http://api.mptest.wezchina.com/menu_config?type_id=5&solution_id=2',
    type: 'GET',
    async: false,
    success: function(data) {
        console.log(data.data)
        var curr_version = data.data.version;
        if (data.code == 200) {
            var storage_version = localStorage.getItem('user_version');
            if (storage_version != null) {
                if (storage_version != curr_version) {
                    localStorage.setItem('user_version', curr_version); 
                    localStorage.setItem('user_menulist', JSON.stringify(data.data.list)); //获取新的菜单列表
                }
            } else {
                localStorage.setItem('user_version', curr_version);
                localStorage.setItem('user_menulist', JSON.stringify(data.data.list));
            }
        }

        JSON.parse(localStorage.getItem('user_menulist')).map(x => {
            $("#middle").append(genParent(x));
        })

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
                            <a href="/user/admin" style="width:100%;">管理</a>
                        </div>
                        <div id="avatar-logout">
                            <a href="/login" style="width:100%;display: block;">注销</a>
                        </div>
                    </div>
                </div>
                <div id="alert">
                    <div class="alert-icon"></div>
                    <div class="alert-num"> 5 </div>
                </div>`

        $("#top").append(mainLeft_p);

        //mainheader
        /*let mainheader = `
                <div class="we-title" id="we_title_1">
                    <img src="/common/img/set.png" width="18" alt="" />
                    <span>个人设置</span>
                    <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
                    <div class="we-cont" style="display:block;">
                        <a href="/user/settings/profile">
                            <div id="personaldata">个人资料</div>
                        </a>
                        <a href="/user/settings/consignee">
                            <div id="address">收货地址</div>
                        </a>
                        <a href="/user/settings/realname">
                            <div id="auth">实名认证</div>
                        </a>
                        <a href="/user/settings/personal" id="v_v_cert">
                            <div id="v-auth">官方认证</div>
                        </a>
                        <a href="/user/settings/changemobile">
                            <div id="change-phone">修改手机</div>
                        </a>
                    </div>
                </div>

                <div class="we-title" id="we_title_3">
                     <img src="/common/img/form.png" width="18" alt=""/>
                     <span>我的文章</span>
                     <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
                    <div class="we-cont">
                      <a href="/user/myarticle/discover"><div id="discovery">发现文章</div></a>
                    </div>
                </div>

                <div class="we-title" id="we_title_5">
                    <img src="/common/img/active.png" width="18" alt="" />
                    <span>我的活动</span>
                    <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
                    <div class="we-cont">
                       <!-- <a href="/user/myactivity/discover">
                            <div id="myactivity">发现活动</div>
                        </a>-->
                        <a href="/user/myactivity/support">
                            <div id="supactivity">支持活动</div>
                        </a>
                        <a href="/user/myactivity/focus">
                            <div id="focactivity">关注活动</div>
                        </a>
                    </div>
                </div>
                <div class="we-title" id="we_title_4">
                     <img src="/common/img/pj.png" width="18" alt=""/>
                     <span>我的项目</span>
                     <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
                    <div class="we-cont">
                      <a href="/user/myproject/discover"><div id="discovery">发现项目</div></a>
                      <a href="/user/myproject/support"><div id="support">支持项目</div></a>
                      <a href="/user/myproject/focus"><div id="focus">关注项目</div></a>
                    </div>
                </div>

                <div class="we-title" id="we_title_6">
                    <img src="/common/img/zone.png" width="18" alt="" />
                    <span>我的圈子</span>
                    <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
                    <div class="we-cont">
                        <a href="/user/myquan/weyou">
                            <div id="weyou_myquan">我的微友</div>

                        </a>
                      <!--  <a href="/user/myquan/focus">
                            <div id="focus_myquan">我的关注</div>
                        </a>
                        <a href="/user/myquan/fans">
                            <div id="fans_myquan">我的粉丝</div>
                        </a>
                        <a href="/user/myquan/wecard">
                            <div id="wecard_myquan">我的名片</div>
                        </a>
                        <a href="/user/myquan/wecardfriends">
                            <div id="wecardfriends_myquan">名片好友</div>
                        </a>-->
                        <a href="/user/myquan/benefactor">
                            <div id="benefactor_myquan">我的恩人</div>
                        </a>
                        <a href="/user/myquan/benefits">
                            <div id="benefits_myquan">我的恩金</div>
                        </a>
                    </div>
                </div>

                <div class="we-title" id="we_title_2">
                    <img src="/common/img/account.png" width="18" alt="" />
                    <span>我的账户</span>
                    <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
                    <div class="we-cont">
                    <a href="/user/myaccount/packet">
                        <div id="my-bag">我的钱包</div>
                    </a>
                    <a href="/user/myaccount/paypassword">
                        <div id="my-operate">操作密令</div>
                    </a>
                    <a href="/user/myaccount/order">
                        <div id="my-order">我的订单</div>
                    </a>
                </div>
                </div>

                <div class="we-title" id="we_title_4">
                    <img src="/common/img/info.png" width="18" alt="" />
                    <span>我的消息</span>
                    <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
                </div>`

        $("#middle").append(mainheader);*/

        // $.getScript("../../layer-v3.0.3/layer-v3.0.3/layer/layer.js");

        var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
        // console.log('logo:',logo);
        $('#home img').attr('src', logo);
        $("#av_online").bind("click", avatar_admin);

        //上滑下拉
        var flag = false;
        $(".we-title").on("click", function() {

            event.stopPropagation();
            //本地储存
            sessionStorage.lastname = $(this).attr("id");
            console.log(sessionStorage.lastname);
            // if( sessionStorage.lastname=="we_title_6"){
            //      //sessionStorage.lastname=="we_title_5" || layer.msg("暂未开通", { time: 2500 });
            //      mess_tusi("暂未开通");
            // }

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
                    $(".av-on-line").hide();
                    $("#avatar-admin").show();
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
                    $("#v_v_cert").hide();
                    return false;
                }
                if(result.is_authenticated == 2) {
                    $("#v_v_cert").hide();
                    if(result.operation_status == 3) {
                        $(".cert-to-pass").show();
                        $("#form_list").show();
                    }
                } else if(result.is_authenticated == 1 && result.operation_status==2) {
                    $(".cert-success-info").show();
                    $("#v_v_cert").show();
                }
            }
        });
        options.fail(function(error) {
            console.error(error);
        });

        $("#avatar-logout").click(function(){
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('weid');
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
                    if (data.code == 200){
                        console.log(data);
                        if (data.data.domain == null) {
                            //没有个性域名
                            domain = '/index';
                        } else {
                            //存在个性域名
                            domain = "/" + data.data.domain;
                        }

                    } else {
                        layer.msg(data.message, {
                            time: 1500
                        });
                        // window.localStorage.removeItem('token')
                        // window.location.href = '/login'
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        }

        var weid = localStorage.getItem('weid');
        hasDomain(weid);

        var isLogin = false; //判断用户登陆与否
        function router(route){
                console.log(route);
            
            var routerList = ['home', 'login', 'article','active','project', 'shopping'];
                console.log(route);

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
                console.log(domain);
                showLogin = false;
                window.location.href = domain + "/activity";
        //          window.history.go(0);
            }
             var project = function(){
                console.log(domain);
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

        $("#home, #login, #article,#active,#project, #shopping").click(function(){
            var id = $(this).attr("id");
            console.log(id);
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

    },
    error: function(xhr) {
        console.log(xhr)
    }
})


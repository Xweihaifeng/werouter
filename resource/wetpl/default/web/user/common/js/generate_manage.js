 //列表折叠
// sessionStorage.listname='we-shop';
var listchange=function(curr){
    var curr = curr;
    var status = true;
    var list = ['we-set','we-art','we-mall','we-active','we-project','we-app','we-crm','we-log'];

    var remove = function(id, list) {
        return list.filter(x => x != id);
    }

    $("#155").css("border-bottom", "1px solid #eeeeee");
    $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
    $("." + curr + " span img").css("transform", "rotate(90deg)");
    remove(curr, list).map(x => $("." + x + ":eq(1)").stop().hide());

    var showList = function(state, id) {
        var id = "." + id;
        if (state) {
            $(id + ":eq(1)").stop().hide(300);
            if (id != ".we-app") {
                $(id + ":eq(0)").css("border-bottom", "0");
            }
            $(id + " span img").css("transform", "rotate(0deg)")
            status = false;
        } else {
            $(id + ":eq(1)").stop().show(300);
            $(id + " span img").css("transform", "rotate(90deg)")
            $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
            status = true;
        }
    }

    list.map(x => {
        $("." + x).click(function() {
            var isCont = $(this).attr('class').search('we-cont');
            if (isCont == 0) {
                return;
            }
            if (curr == x) {
                showList(status, x);
            } else {
                status = false;
                remove(x, list).map(x => {
                    $("." + x + ":eq(1)").stop().hide(300)
                    $("." + x + " span img").css("transform", "rotate(0deg)")
                });
                if (curr != "we-app") {
                    $("." + curr + ":eq(0)").css("border-bottom", "0");
                }
                curr = x;
                showList(status, x);
            }
        })
    })
}

//generate mainHeader
var mark = 'user/admin';
var domain = window.location.host;
var currPage = window.location.pathname.split('/').pop();
var parentPage = window.location.pathname.split('/').slice(3,4)[0];

var genMenu = function(mark, domain) {
    var genCont = function(data) {
        var template = `
            <a href="/user/` + data.url + `">
                <div id="` + data.mark + `">` + data.name + `</div>
            </a>`;
        return template;
    }

    var genTitle = function(data) {
        var template = `
            <div class="we-title ` + data.url + `" id="` + data.id + `">
                <img src="` + data.mark + `" width="18" alt="" />
                <span>` + data.name + `</span>
                <span><img src="/common/img/more1.png" width="18" class="title-img"/></span>
            </div>
            <div class="we-cont ` + data.url + `" style="display: none;">`
                + data.children.map(x => genCont(x)).join('') + 
            `</div>`;
        return template;
    };

    var template = '';
    
    $.ajax({
        url: 'https://mp.wezchina.com/api/menu_config?mark=' + mark + '&domain=' + domain,
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

// console.log(genMenu(mark, "qqxqs.com"))
$(document).ready(function(){
    $("#middle").append(genMenu(mark, "qqxqs.com"))

    console.log('currpage:', currPage)

    console.log(parentPage + "_" + currPage)

    var getType = function(parentPage){
        switch(parentPage) {
            case 'settings' : return 'we-set'; break;
            case 'article' : return 'we-art'; break;
            case 'activity' : return 'we-active'; break;
            case 'apps': return 'we-app'; break;
            default: break;
        }
    }

    if (currPage != '' && currPage != 'admin') {
        $("#" + parentPage + "_" + currPage).parent().parent(".we-cont").show();
        $("#" + parentPage + "_" + currPage).css({"color": "red", "background": "#f7f7f7"})
        listchange(getType(parentPage));
    } else {
        $("#settings_base").parent().parent(".we-cont").show();
        $("#settings_base").css({"color": "red", "background": "#f7f7f7"})
        listchange('we-set');
    }

})


$(function(){
    /**
 * Created by Hongguang on 2017/9/5.
 */

// 主左

/*$.ajax({
    url: 'http://api.mptest.wezchina.com/menu_config?type_id=5&solution_id=2',
    type: 'GET',
    success: function(data) {
        console.log(data);

    },
    error: function(xhr) {
        console.log(xhr)
    }
})*/

let mainLeft = `
        <div id="home">
            <img src="http://next.wezchina.com/storage/images/906f4f7c227f67a96a859bdf64cbd5c0.png" width='90' alt="HOME" />
        </div>
        <div id="login">
            <div class="log-head"></div>
            <div class="art-img"><img src="/common/img/bbd.png" width='29' alt="login" /></div>
            <div class="word">登录</div>
        </div>
        <div id="article">
            <div class="art-img"><img src="/common/img/wz.png" width='29' alt="article" /></div>
            <div class="word">文章</div>
        </div>
        <div id="project">
            <div class="art-img"><img src="/common/img/pj.png" width='29' alt="project" /></div>
            <div class="word">项目</div>
        </div>
        <div id="active">
            <div class="art-img"><img src="/common/img/at.png" width='29' alt="active" /></div>
            <div class="word">活动</div>
        </div>
        <div id="shopping">
            <div class="art-img"><img src="/common/img/sp.png" width='29' alt="shopping" /></div>
            <div class="word">商城</div>
        </div>
        <div id="zone">
            <div class="art-img"><img src="/common/img/qz.png" width='29' alt="zone" /></div>
            <div class="word">圈子</div>
        </div>`

$(".left-nav").append(mainLeft);

//主左二

let mainLeft_p = `
        <div id="dropdown"><div></div></div>
        <div id="avatar">
            <div class="avatar-icon"></div>
            <div class="avatar" style="text-align: left;">
               <style type="text/css" media="screen">
                   #avatar-user:hover {
                       background: #eeeeee;
                   }
                   #avatar-user {
                       line-height: 35px;
                       padding-left: 5px;
                   }
               </style>
                <a href="/user/">
                    <div id="avatar-user">
                        <!-- <span><img src="/common/img/set.png" alt="" width="20" /></span> -->
                        <span>用户中心</span>
                    </div>
                </a>
                <div id="avatar-logout" style="padding-left: 5px;">
                    <!-- <span><img src="/common/img/skip.png" alt="" width="20" /></span> -->
                    <span><a href="/login">安全退出</a></span>
                </div>
            </div>
        </div>
        <div id="alert"><div class="alert-icon"></div>
            <div class="alert-num"> 5 </div></div>
`

$("#top").append(mainLeft_p);

//mainheader
/*let mainheader = `
        <div class="we-title we-set">
            <img src="/common/img/set.png" width="18" alt=""/>
            <span>系统设置</span>
            <span><img src="/common/img/more1.png" width="18"/></span>
        </div>
        <div class="we-cont we-set">
            <a href="/user/admin/settings/base"><div id="base">基本设置</div></a>
            <a href="/user/admin/settings/brand"><div id="brand">品牌设置</div></a>
            <a href="/user/admin/settings/domain"><div id="domain">个性域名</div></a>
        </div>`;
var mainheader_part1=`

        <div class="we-title we-app">
            <img src="/common/img/box.png" width="18" alt=""/>
            <span>应用管理</span>
            <span><img src="/common/img/more1.png" width="18"/></span>
        </div>
        <div class="we-cont we-app" style="">
            <a href="/user/admin/apps/base"><div id="my-bag">基础应用</div></a>
            <a href="/user/admin/apps/store"><div id="my-order">主页应用</div></a>
        </div>

        <div class="we-title we-log"  style="border-bottom: 1px solid #eeeeee;">
            <img src="/common/img/information.png" width="18" alt=""/>
            <span>系统日志</span>
            <span><img src="/common/img/more1.png" width="18"/></span>
        </div>
        <div class="we-cont we-log" style="">
            <a href="/user/admin/logs/operation"><div id="my-logo">系统日志</div></a>
        </div>`;*/

// $("#middle").append(mainheader);
/*var moduletemplate=function(x,modulearr){
    var modulehtml="";
    if($.inArray(x.module_id, modulearr)>-1 && x.status == 1){
        if($.inArray(x.module_id, modulearr)==0){
            // $('#toggle-button-4').prop("checked", true);
            modulehtml=`
                <div class="we-title we-shop">
                    <img src="/common/img/store.png" width="18" alt=""/>
                    <span>商城管理</span>
                    <span><img src="/common/img/more1.png" width="18"/></span>
                </div>
                <div class="we-cont we-shop" >
                    <a href="/user/admin/wemall/goods/add"><div id="pub-shopping">发布商品</div></a>
                    <a href="/user/admin/wemall/goods/list"> 
                        <div id="pub-shopping-manage">商品管理</div>
                    </a>
                    <a href="/user/admin/wemall/cate">
                        <div id="pub-shopping-cate">商品分类</div>
                    </a>
                    <a href="/user/admin/wemall/order"><div id="order-manage">订单管理</div></a>
                    <a href="/user/admin/wemall/district"><div id="distributions">区域管理</div></a>
                </div>
            `;
            // $(".we-shop").show();
        }else if($.inArray(x.module_id, modulearr)==1){
            modulehtml=`
                <div class="we-title we-art">
                    <img src="/common/img/form.png" width="18" alt=""/>
                    <span>文章管理</span>
                    <span><img src="/common/img/more1.png" width="18"/></span>
                </div>
                <div class="we-cont we-art" >
                    <a href="/user/admin/article/add"><div id="we-release">发布文章</div></a>
                    <a href="/user/admin/article/list"><div id="art-manage">管理文章</div></a>
                </div>
            `;
            // $(".we-art").show();
            // $('#toggle-button').prop("checked", true);
        }else if($.inArray(x.module_id, modulearr)==2){
            modulehtml=`
                <div class="we-title we-active" >
                    <img src="/common/img/active.png" width="18" alt=""/>
                    <span>活动管理</span>
                    <span><img src="/common/img/more1.png" width="18"/></span>
                </div>
                <div class="we-cont we-active" >
                    <a href="/user/admin/activity/add"><div id="activity-add">发布活动</div></a>
                    <a href="/user/admin/activity/list"><div id="activity-list">活动管理</div></a>
                </div>
            `;
            // $(".we-active").show();
            // $('#toggle-button-2').prop("checked", true);
        }else if($.inArray(x.module_id, modulearr)==3){
            modulehtml=`
                <div class="we-title we-project" >
                    <img src="/common/img/pj.png" width="18" alt=""/>
                    <span>项目管理</span>
                    <span><img src="/common/img/more1.png" width="18"/></span>
                </div>
                <div class="we-cont we-project" >
                     <a href="/user/admin/project/add"><div id="project-add">发布项目</div></a>
                    <a href="/user/admin/project/list"><div id="prject-list">管理项目</div></a>
                </div>
            `;
            // $(".we-project").show();
            // $('#toggle-button-1').prop("checked", true);
        }else if($.inArray(x.module_id, modulearr)==4){
            modulehtml=`
                 <div class="we-title we-crm">
                    <img src="/common/img/zone.png" width="18" alt=""/>
                    <span>圈子管理</span>
                    <span><img src="/common/img/more1.png" width="18"/></span>
                </div>
                <div class="we-cont we-crm" >
                   <a href="/user/admin/quan/crm"><div id="zone-crm">CRM管理</div></a>
                    <a href="/user/admin/quan/crm/list"><div id="zone-associator-list">会员列表</div></a>
                </div>
            `;
            // $(".we-crm").show();
            // $('#toggle-button-3').prop("checked", true);
        }
    }*/

   /* var modulehtml=`
        <div class="we-title we-art" style="display: none;">
            <img src="/common/img/form.png" width="18" alt=""/>
            <span>文章管理</span>
            <span><img src="/common/img/more1.png" width="18"/></span>
        </div>
        <div class="we-cont we-art" style="display: none;">
            <a href="/user/admin/article/add"><div id="we-release">发布文章</div></a>
            <a href="/user/admin/article/list"><div id="art-manage">管理文章</div></a>
        </div>
       <div class="we-title we-project" style="display: none;">
            <img src="/common/img/pj.png" width="18" alt=""/>
            <span>项目管理</span>
            <span><img src="/common/img/more1.png" width="18"/></span>
        </div>
        <div class="we-cont we-project" style="display: none;">
             <a href="/user/admin/project/add"><div id="project-add">发布项目</div></a>
            <a href="/user/admin/project/list"><div id="prject-list">管理项目</div></a>
        </div>

        <div class="we-title we-active" style="display: none;">
            <img src="/common/img/active.png" width="18" alt=""/>
            <span>活动管理</span>
            <span><img src="/common/img/more1.png" width="18"/></span>
        </div>
        <div class="we-cont we-active" style="display: none;">
            <a href="/user/admin/activity/add"><div id="activity-add">发布活动</div></a>
            <a href="/user/admin/activity/list"><div id="activity-list">活动管理</div></a>
        </div>
        <div class="we-title we-shop" style="display: none;">
            <img src="/common/img/store.png" width="18" alt=""/>
            <span>商城管理</span>
            <span><img src="/common/img/more1.png" width="18"/></span>
        </div>
        <div class="we-cont we-shop" style="display: none;">
            <a href="/user/admin/wemall/goods/add"><div id="pub-shopping">发布商品</div></a>
            <a href="/user/admin/wemall/goods/list">
                <div id="pub-shopping-manage">商品管理</div>
            </a>
            <a href="/user/admin/wemall/cate">
                <div id="pub-shopping-cate">商品分类</div>
            </a>
            <a href="/user/admin/wemall/order"><div id="order-manage">订单管理</div></a>
            <a href="/user/admin/wemall/district"><div id="distributions">区域管理</div></a>
        </div>

        <div class="we-title we-crm" style="display: none;">
            <img src="/common/img/zone.png" width="18" alt=""/>
            <span>圈子管理</span>
            <span><img src="/common/img/more1.png" width="18"/></span>
        </div>
        <div class="we-cont we-crm" style="display: none;">
           <a href="/user/admin/quan/crm"><div id="zone-crm">CRM管理</div></a>
            <a href="/user/admin/quan/crm/list"><div id="zone-associator-list">会员列表</div></a>
        </div>
    `;*/
//     return modulehtml;
// }
// 模块列表
/*var modulearr=[];
var modulelist=function(){
     $.ajax({
        url: apiUrl+"pages/module/platlist",
        type: 'GET',
        headers: {
            'Token': localStorage.getItem('token')
        },
        success: function(data){
            console.log(data);
            if (data.code == 200){
                data.data.map(x => {
                    modulearr.push(x.weid);

                });
                sessionStorage.moduledata=modulearr.join(",");
                moduleState();
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
if(sessionStorage.statedata!=null && sessionStorage.statedata!="" && sessionStorage.statedata!=undefined && sessionStorage.statedata!="null"){
   var state=$.parseJSON(sessionStorage.statedata).data.list;
   console.log($.parseJSON(sessionStorage.statedata));
    $("#middle").append(mainheader);
    state.map(x => {
        $(".we-cont.we-set").after(moduletemplate(x,sessionStorage.moduledata.split(",")));
    })
  
    $("#middle").append(mainheader_part1);
    listchange();
}else{
    // 第一次进入加载
    modulelist();
}*/

//判断左侧边栏二显示
   /*var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log('module:', data.data.list);
                    var state = data.data.list;
                    // $(".we-cont.we-set").after(moduletemplate());
                    sessionStorage.statedata=JSON.stringify(data);
                    $("#middle").append(mainheader);
                    state.map(x => {
                        $(".we-cont.we-set").after(moduletemplate(x,modulearr));
                    })*/
                    /*state.map(x => {
                        if($.inArray(x.module_id, modulearr)>-1 && x.status == 1){
                            if($.inArray(x.module_id, modulearr)==0){
                                $(".we-shop").show();
                                // $('#toggle-button-4').prop("checked", true);
                            }else if($.inArray(x.module_id, modulearr)==1){
                                $(".we-art").show();
                                // $('#toggle-button').prop("checked", true);
                            }else if($.inArray(x.module_id, modulearr)==2){
                                $(".we-active").show();
                                // $('#toggle-button-2').prop("checked", true);
                            }else if($.inArray(x.module_id, modulearr)==3){
                                $(".we-project").show();
                                // $('#toggle-button-1').prop("checked", true);
                            }else if($.inArray(x.module_id, modulearr)==4){

                                $(".we-crm").show();
                                // $('#toggle-button-3').prop("checked", true);
                            }
                        }
                        modeleName.push(x.module_id);



                    })*/
                    /*$("#middle").append(mainheader_part1);

                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

               listchange();
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }*/
// moduleState();
// $.getScript("../../layer-v3.0.3/layer-v3.0.3/layer/layer.js");

var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
// console.log('logo:',logo);
$('#home img').attr('src', logo);
// $("#av_online").bind("click", avatar_admin);

/*//上滑下拉
var flag = false;
$(".we-title").on("click", function() {

    event.stopPropagation();
    //本地储存
    sessionStorage.lastname = $(this).attr("id");
    console.log(sessionStorage.lastname);

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
})*/

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

/*// 官方认证详情功能显示(是否开通官方认证)
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
*/
/*// 判断是否开通微主页
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
}*/

/*// 实名认证详情功能显示(是否开通实名认证)
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
});*/

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
            'background': 'url(' +localStorage.getItem('avatar') + ') no-repeat center',
            'background-size': '100% 100%'
        })
        $("#avatar .avatar-icon").css({
            'background': 'url(' +localStorage.getItem('avatar') + ') no-repeat center',
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

    //route
    var isLogin; //判断用户登陆与否
    var router = function(route){
        if(!window.localStorage.getItem("token")) {
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
        router(id);
    })
 $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css({
                "line-height": "65px",
                "padding-top": "15px"
            });
            $("#" + id + " .word").css("margin-top", "-20px");
        } else {
            if (!isLogin) {
                $(this).css({
                    "line-height": "65px",
                });
                $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
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
})
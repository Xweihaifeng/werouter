
   //列表折叠
sessionStorage.listname='we-project';

$(document).ready(function(){
 
    // const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';
    var qiniu_bucket_domain=ApiMaterPlatQiniuDomain
    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    console.log('logo:',favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:',logo);
    $('#home img').attr('src', logo);

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
        var left=($(window).width()-$("#mess_tusi").width())/2 -180;//居中
        var top=$(window).height()*0.5;
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


    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 401) {
                  // domain = '/index';
                  localStorage.removeItem('token')
                  // window.location.href = '/login'
                }
                if (data.code == 200){
                    console.log(data);
                    if (data.data == null) {
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
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var weid = docCookies.getItem("weid");
    hasDomain(weid);

   /* var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article','project', 'shopping','active'];

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
        }
        var project = function(){

            showLogin = false;
            window.location.href = domain + "/project";
        }
        var active = function(){

            showLogin = false;
            window.location.href = domain + "/activity";
        }


        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article,#project, #shopping,#active").click(function(){
        var id = $(this).attr("id");
        router(id);
    })

*/




     // 项目分类模版
        var projectCateTemplate=function(data){
            var list='<div class="item_box"  style="cursor: pointer;" data_id="'+data.weid+'" data_style="'+data.style+'">'+
                        '<div class="img_box">'+
                            '<img src="'+qiniu_bucket_domain+data.cover+'" style="left:84px;">'+
                        '</div>'+
                        '<span class="ui_button ui-center-button btn_project_type" type_url="/index.php?ctl=project&amp;act=add_presell">'+data.name+'</span>'+
                    '</div>';
            return list;
        }
        var InitList = function(weid){
        $.ajax({
            url: PROJECT_CATE_LIST,
            type: 'post',
            headers: {
              'Token': docCookies.getItem("token")
            },
            success:function(data){
                console.log(data);
                if (data.code == 200){
                    var list = data.data.list;

                    list.map(x => {
                        $(".choose_type").append(projectCateTemplate(x));
                    })
                    $(".item_box:first-child").addClass("active");
                    $(".item_box:first-child").attr("activate","true");
                    ITEMBOXCLICK();
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

            }

        });
        }
        var weid = docCookies.getItem("weid");
        InitList(weid);
        var ITEMBOXCLICK=function(){
            $(".item_box").click(function(){
                $(this).addClass('active').siblings().removeClass('active')
                $(this).attr("activate","true");
                $(this).siblings().attr("activate","false");
                $("[data-id='"+$(this).attr("data_style")+"']").css("display","block").siblings().css("display","none");
            });
        }
        $(".choose_btn").click(function(){
            var clickflag=true;
            $(".item_box").each(function(index,element){
                var activate=$(this).attr("activate");
                if(activate=='true'){
                    clickflag=false;
                    //设置跳转

                    localStorage.setItem('project_cate_style',$(this).attr("data_style"));

                    localStorage.setItem('project_cate_weid',$(this).attr("data_id"));
                    var project_cate_style=localStorage.getItem('project_cate_style');
                    var project_cate_weid=localStorage.getItem('project_cate_weid');
                    console.log(project_cate_style)
                    window.location.href="/user/admin/project/add/form";
                }
            })
            if(clickflag){
                layer.msg('还未选择类型', {
                        time: 2000
                });
            }
        })








    //获取通用用户信息
    var getUserInfo = function(){
        $.ajax({
            url: FOUNDER,
            type: 'get',
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    if (info.avatar != "") {
                        $("#head-icon, .user-head").css({
                            "background": "url(" + info.avatar + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        $("#head-icon, .user-head").css({
                            "background": "url(/common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

                    $(".line-0").html(
                        info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".line-1").text(info.motto);
                    $(".user-cnt").text(info.nickname);
                    // artCount(weid);
                    // artTypeList(weid);

                    // catesfun(weid);


                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //getUserInfo();

    var artCount = function(weid){
        $.ajax({
            url: ARTICLES_LISTCOUNT+"?userId=" + weid,
            type: 'get',
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    $(".user-art").children('div:eq(0)').text(data.data);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }



    // 鼠标滑动到列表时加hover
    var lihover=function(){
         $(".ws_item li").mouseenter(function(){
            $(this).addClass("hover")
        }).mouseleave(function(){
            $(this).removeClass("hover")
        })
    }


   //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css({
                "line-height": "65px",
                "padding-top": "10px"
            });
            $("#" + id + " .word").css("margin-top", "-35px");
        } else {
            if (!isLogin) {
                $(this).css({
                    "line-height": "65px",
                });
                // $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })

  /*  var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200){
                    console.log('module:', data.data.list);
                    var state = data.data.list;
                    state.map(x => {
                        modeleName.push(x.module_id);
                        if (x.module_id === '4009ea20-8ede-11e7-83a8-156d1da77933') {
                            if (x.status == 1) {
                                //$(".we-art").slideDown(500)
                                $(".we-art").show();
                                $('#toggle-button').prop("checked", true);
                            }
                        }
                        if (x.module_id === '44fd5620-8d7f-11e7-9e08-e356d0b019f1') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-shop").show();
                                $('#toggle-button-4').prop("checked", true);
                            }
                        }
                        if (x.module_id === 'b3c00b00-a4e2-11e7-b542-2d038cc12c12') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-active").show();
                                $('#toggle-button-2').prop("checked", true);

                            }
                        }
                         if (x.module_id === 'c30c2160-a4e2-11e7-a2ad-35371a8cf051') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-project").show();
                                $('#toggle-button-1').prop("checked", true);

                            }
                        }
                        if (x.module_id === 'a9d16bc0-ada0-11e7-8c59-993d3b1d7e06') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-crm").show();
                                $('#toggle-button-3').prop("checked", true);

                            }
                        }
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-project';
                var status = true;
                var list = ['we-set', 'we-art','we-active', 'we-shop','we-project', 'we-app','we-crm', 'we-log'];

                var remove = function(id, list) {
                    return list.filter(x => x != id);
                }

                $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                remove(curr, list).map(x => $("." + x + ":eq(1)").hide());

                var showList = function(state, id) {
                    var id = "." + id;
                    if (state) {
                        $(id + ":eq(1)").hide(500);
                        if (id != ".we-log") {
                            $(id + ":eq(0)").css("border-bottom", "0");
                        }
                        $(id + " span img").attr('src', '/common/img/more1.png');
                        status = false;
                    } else {
                        $(id + ":eq(1)").show(500);
                        $(id + " span img").attr('src', '/common/img/more_unfold.png');
                        $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                        status = true;
                    }
                }

                list.map(x => {
                    $("." + x).click(function() {
                        if (curr == x) {
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '/common/img/more1.png');
                            });
                            showList(status, x);
                        } else {
                            status = false;
                            $("." + curr + ":eq(0)").css("border-bottom", "0");
                            curr = x;
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '/common/img/more1.png');
                            });
                            showList(status, x);
                        }
                    })
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }*/

   /* //主页初始化
    var init__ = function(token){
        moduleState();
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

    init__(docCookies.getItem("token"));
*/
})
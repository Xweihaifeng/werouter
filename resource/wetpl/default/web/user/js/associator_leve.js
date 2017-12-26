/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
 //列表折叠
sessionStorage.listname='we-crm';
$(document).ready(function(){
    //const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';
        $("#avatar, #dropdown").hover(function () {
        $(".avatar").show();
        }, function () {
        $(".avatar").hide();
        })

        $("#avatar-logout span").click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
        })

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
    var weid=docCookies.getItem("weid");
   console.log(docCookies.getItem("weid"));

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

    /*var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article', 'shopping'];

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

        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/
    var weid=docCookies.getItem("weid");
      // 会员等级列表
    var associatorlist=function(){
         $.ajax({
            url:MEMBERLEVEL_LISTS,
            type:'get',
            headers: {
                    'Token': docCookies.getItem("token")
                },
            success:function(data){
                console.log(data);
                if(data.code == 200){
                    var index=0;
                    data.data.map(item =>{

                    var _dom = $('ul.vip-config')[index];
                    $(_dom).find("input[name=name]").val(item.level);
                    $(_dom).find("input[name=money]").val(item.condition);
                    $(_dom).find("input[name=discount]").val(item.discount);
                    index++;
                })

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
associatorlist();

    $(document).on("click",".default-config-btn",function(){
        var params = {type:$(this).data("type"),ajax:1};
        params=`[{"level": "VIP10", "condition": 30000, "discount": 0.8},
                {"level": "VIP9", "condition": 27000, "discount": 0.82},
                 {"level": "VIP8", "condition": 24000, "discount": 0.84},
                {"level": "VIP7", "condition": 21000, "discount": 0.86},
                {"level": "VIP6", "condition": 18000, "discount": 0.88},
                {"level": "VIP5", "condition": 15000, "discount": 0.9},
                {"level": "VIP4", "condition": 12000, "discount": 0.92},
                {"level": "VIP3", "condition": 9000, "discount": 0.94},
                {"level": "VIP2", "condition": 6000, "discount": 0.96},
                {"level": "VIP1", "condition": 3000, "discount": 0.98}     
            ]
        `;
        
            console.log($.parseJSON(params));
            var index=0;
                $.parseJSON(params).map(item =>{

                    var _dom = $('ul.vip-config')[index];
                    $(_dom).find("input[name=name]").val(item.level);
                    $(_dom).find("input[name=money]").val(item.condition);
                    $(_dom).find("input[name=discount]").val(item.discount);
                    index++;
                })
            });

     $(document).on("click",".save-config",function(){
        var configs = new Array;
        $("ul.vip-config").each(function(index,item){
            var config = {};
            // config.plat_user_id = weid;
            // config.sort = index+1;
            config.level = $(this).find("input[name=name]").val();
            config.condition = $(this).find("input[name=money]").val();
            config.discount = $(this).find("input[name=discount]").val();
            if($(this).find(".is_effect").hasClass('level_title_checked')){
                if(!config.level || !config.condition || !config.discount){
                    $.showErr("请完善启用项的配置信息");
                    return false;
                }
                // config.is_effect = 1;
            }else{
                // config.is_effect = 0;
            }
            configs.push(config);
        })
        if(configs.length != 10){
            return;
        }
        // var params = {lists:configs};
        var params = {lists:JSON.stringify(configs)};
        // var params =JSON.stringify(configs) ;
        console.log(params);
        console.log(configs);
        // return false;
        // return false;
        $.ajax({
            url: MEMBERLEVEL_SAVED,
            type: 'post',
            data:params,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                    console.log(data);

                if (data.code == 200){
                    layer.msg("保存设置成功", {
                        time: 1000
                    });
                    setTimeout(function(){
                        location.reload();

                    },1000);

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
          
    })



    
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

   /* var modeleName = [];
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
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-crm';
                var status = true;
				var list = ['we-set', 'we-art', 'we-shop','we-active','we-project','we-crm', 'we-app', 'we-log'];

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
    }
*/
   //主页初始化
   /* var init__ = function(token){
        // moduleState();
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

    init__(docCookies.getItem("token"));*/

})
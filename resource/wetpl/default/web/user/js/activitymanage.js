 //列表折叠
 sessionStorage.listname = 'we-active';


 // 3.删除
 var activitydel = function(obj) {

         layer.confirm('确认要删除该活动？', {
             title: '删除活动',
             btn: ['确认删除', '取消']
         }, function() {
             console.log($(obj).closest('li').data('id'));
             $.ajax({
                 url: ACTIVITY_DESTROY + '/' + $(obj).closest('li').data('id'),
                 type: 'get',
                 headers: {
                     'Token': localStorage.getItem('token')
                 },
                 success: function(data) {
                     console.log(data);
                     if (data.code == 200) {
                         mess_tusi("删除成功");
                         location.reload();

                     } else {
                         mess_tusi(data.message);
                     }
                 },
                 error: function(xhr) {
                     console.log(xhr);
                 }
             })
         }, function() {

         });
     }
     // 4.编辑
 var activityedit = function(obj) {
         window.location = "/user/admin/activity/detail/" + $(obj).closest("li").data("id");
     }
     // 5.取消发布
 var activitycancel = function(obj) {
         console.log($(obj));
         var actiid = $(obj).closest("li").data("id");
         $.ajax({
             url: ACTIVITY_UPDATE,
             type: 'post',
             data: { weid: actiid, status: 1 },
             headers: {
                 'Token': localStorage.getItem('token')
             },
             success: function(data) {
                 console.log(data);
                 if (data.code == 200) {
                     mess_tusi("取消发布成功！");
                     location.reload();

                 } else {
                     mess_tusi(data.message);
                 }
             },
             error: function(xhr) {
                 console.log(xhr);
             }
         })
     }
     // 设为发布
 var activitypublish = function(obj) {
     var actiid = $(obj).closest("li").data("id");
     $.ajax({
         url: ACTIVITY_UPDATE,
         type: 'post',
         data: { weid: actiid, status: 2 },
         headers: {
             'Token': localStorage.getItem('token')
         },
         success: function(data) {
             console.log(data);
             if (data.code == 200) {
                 mess_tusi("发布成功！");
                 location.reload();

             } else {
                 mess_tusi(data.message);
             }
         },
         error: function(xhr) {
             console.log(xhr);
         }
     })
 }

 $(document).ready(function() {
     // const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';

     var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
     console.log('logo:', favicon);
     $('#favicon').attr('href', favicon);

     var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
     console.log('logo:', logo);
     $('#home img').attr('src', logo);

     var tusitemp = "";

     function mess_tusi(strs) {
         //清除事件
         clearTimeout(tusitemp);
         $("#mess_tusi").remove();
         //创建吐丝层并写入内容
         if (!$("#mess_tusi").attr("id")) { //吐丝层不存在创建
             $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>" + strs + "</span></div>"); //写入内容
         } else {
             $("#mess_tusi").html(strs); //写入内容
         }

         //定义吐丝层位置
         var left = ($(window).width() - $("#mess_tusi").width()) / 2 - 180; //居中
         var top = $(window).height() * 0.5;
         $("#mess_tusi").css({ "left": left + "px", "top": top + "px" });

         //显示吐丝层
         $("#mess_tusi").css("display", '');

         //2秒后关闭
         tusitemp = setTimeout(function() {
             $("#mess_tusi").remove();
             $("#mess_tusi").html("");
         }, 2000);
         return false;
     }

     /*var currHeight = $("#art-head").height() + $("#art-body").height();
     setHeight(currHeight);*/
     // var token="eyJpdiI6IlN0Y0o4T3lRVjRSMTJrU1pSVG16NVE9PSIsInZhbHVlIjoiNlpRXC9qMlV0cUtObkorcnQxcDczVTM3VXVPaXdHVGNqWTJmM0h5dktkcTVKbWYrU09jXC91eTY4eFRjRTFPdUNIUlc4eVZ4T0tvc3dZWTlqV0p1U2drejhBN0JNamltTWZhenVvaWp1SmFIWT0iLCJtYWMiOiJiNzFmNzBjNmE2ZjE2NWU1OGJmOThiYWU1MDNjNWU2MmY4MGFjZTZkOGY2NzRiYjg0NjM2NGQxNDNkMDU4NTBlIn0=";

     var saveUserInfo = function(token) {
             localStorage.setItem('token', token);
         }
         // saveUserInfo(token);

     /*    //route
         var isLogin = false; //判断用户登陆与否
         var router = function(route){
             var routerList = ['home', 'login', 'article'];

             var isMember = function(routerList, route){
                 return routerList.filter(x => x === route);
             }

             var home = function(){
                 window.location.href = '../index';
             }

             var top = $(window).scrollTop();

             var login = function(){
                 if (!isLogin) {
                     showLogin = true;
                     $("#modal").show();
                     $(".show-login").css({
                         "margin-left": width,
                         "margin-top": top + height
                     });
                     $(".show-login").fadeIn(300);
                     $("body").css("overflow", "hidden");
                 } else {
                     window.location.href = "../user/";
                 }
             }

             var article = function(){
                 showLogin = false;
                 window.location.href = "/article/";
             }

             if (isMember(routerList, route) != ""){
                 eval(route)();
             }
         }

         $("#home, #login, #article").click(function(){
             var id = $(this).attr("id");
             router(id);
         })
     */
     var domain;
     var hasDomain = function(weid) {
         $.ajax({
             url: PAGES_PAGE_GETDETAILBYUSER + weid,
             type: 'GET',
             headers: {
                 'Token': localStorage.getItem('token')
             },
             success: function(data) {
                 if (data.code == 401) {
                     // domain = '/index';
                     localStorage.removeItem('token')
                         // window.location.href = '/login'
                 }
                 if (data.code == 200) {
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
             error: function(xhr) {
                 console.log(xhr);
             }
         })
     }

     var weid = localStorage.getItem('weid');
     hasDomain(weid);

     /*   var isLogin = false; //判断用户登陆与否
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
        })*/



     // 列表模板
     var listtemplate = function(data, type = 0) {
         var disabled = btn_cancle_pub = "";
         var btn_active = 'btn-active';
         var ing = '进行中';
         type = data.status;
         if (type == 0) {
             // 全部
             btn_cancle_pub = '<button type="button"  ' + disabled + ' class="btn ' + btn_active + '  J_CancelPublishActivity"  onclick="activitycancel(this)">取消发布</button> ';

         } else if (type == 1) {
             // 未发布
             //disabled = 'disabled="disabled"';
             btn_cancle_pub = '<button type="button"  ' + disabled + ' class="btn ' + btn_active + '  J_CancelPublishActivity" onclick="activitypublish(this)">立即发布</button> ';
             ing = "未发布";
         } else if (type == 2) {
             // 进行中
             // btn_active='';
             btn_active = 'btn-default acv-btn';
             btn_cancle_pub = '<button type="button"  ' + disabled + ' class="btn ' + btn_active + ' J_CancelPublishActivity"  onclick="activitycancel(this)" >取消发布</button> ';

         } else if (type == 3) {
             // 已结束
             btn_cancle_pub = "";
         }
         if (data.onStatus == "已结束") {
             btn_cancle_pub = "";

         }
         var listhtml = '<li class="activity" data-id="' + data.weid + '">' +
             '<div class="status status-process">' +
             '<div class="up">' + data.onStatus + '</div>' +
             '<div class="down"></div>' +
             '</div>' +
             '<div class="poster">' +
             '<img src="' + ApiMaterPlatQiniuDomain + data.cover + '" class="pic">' +
             '</div>' +
             '<div class="detail">' +
             '<h3 class="title">' +
             '<a href="/' + data.domain + '/activity/' + data.weid + '" target="_blank">' + data.title + '</a>' +
             '</h3>' +
             '<div class="property">' +
             '<div class="time">' +
             '<label>时间：</label><span>' + data.begain_time + '</span> <span> ( ' + data.begain_week + ' ) </span> <span>' + data.end_time + '</span><span> ( ' + data.end_week + ' ) </span> ' +
             '</div>' +
             '<div class="addr">' +
             '<label>地点：</label>' + data.area_name + ' ' + data.address + '' +
             '</div>' +
             '<div class="display-ib coll">' +
             '<label>收藏：</label>' + data.collection_num + '人' +
             '</div>' +
             '<div class="display-ib sign">' +
             '<label>报名：</label>' + data.enroll_num + '人' +
             '</div>' +

             '<div class="clearfix"></div>' +
             '</div>' +
             '<div class="flow">' +
             '<!--发布【只有草稿才行】-->' +
             ' <!--取消发布-->' +
             '<!--进行中且免费活动才能取消-->' +
             btn_cancle_pub +
             '<!--进行中或已结束活动都可查看报名签到管理-->' +
             '<a href="/user/admin/activity/apply/' + data.weid + '" class="btn btn-active">报名管理</a>' +
             '</div>' +
             '</div>' +
             '<div class="operation">' +
             ' <ul>' +
             ' <li data-id="' + data.weid + '">' +
             '<a href="javascript:void(0)" onclick="activitydel(this)" class="disabled">' +
             '<span class="fa fa-trash-o"></span>删除' +
             '</a>' +
             '</li>' +
             '<li data-id="' + data.weid + '">' +
             '<a href="javascript:void(0)" onclick="activityedit(this)" >' +
             '<span class="fa fa-edit"></span>编辑' +
             '</a>' +
             '</li>' +
             '<li>' +
             '<a href="/' + data.domain + '/activity/share/success/' + data.weid + '" >' +
             '<span class="fa fa-share-alt"></span>分享' +
             '</a>' +
             ' </li>' +
             '</ul>' +
             '</div>' +
             '</li>';
         return listhtml;
     }
     var weid = localStorage.getItem('weid');
     // 1.获取活动列表
     var flagpage = true;
     var activitylist = function(weid, type = 0, page = 1) {
         console.log(localStorage.getItem('weid'));
         var limit = 5;
         var status = is_on = "";
         console.log("type:", type);
         if (type == 1) {
             // 未发布活动查询
             status = type;
         } else if (type == 2) {
             // 进行中活动查询
             is_on = 1;
             status = 2;
         } else if (type == 3) {
             is_on = 2;
             status = 2;
         }
         var sendData = {
             user_id: weid,
             limit: limit,
             page: page,
             status: status,
             is_on: is_on
         }
         console.log(sendData);
         $.ajax({
             url: ACTIVITY_LIST,
             type: 'post',
             data: sendData,
             headers: {
                 'Token': localStorage.getItem('token')
             },
             success: function(data) {
                 console.log(data);
                 if (data.code == 200) {
                     $("#J_ActivityList").children().remove();
                     data.data.list.map(x => {
                         $("#J_ActivityList").append(listtemplate(x));

                     })

                     // 页码start
                     var pagenum = Math.ceil(data.data.total / limit);
                     pagefun(pagenum, weid, type);

                 }
             },
             error: function(xhr) {
                 console.log(xhr);
             }
         })
     }
     activitylist(weid);

     // 页码
     var pagefun = function(pagenum, weid, type = 0) {
             // console.log(pagenum+":pagenum");
             var pagestr = "";
             console.log(flagpage);
             if (flagpage) {
                 $('.pagination').children().remove();
                 $('.pagination').append('<li id="prev"><a href="javascript:void(0);">«</a></li><li class="active"><span>1</span></li>');

                 for (i = 1; i < pagenum; i++) {
                     // $('.pagination').append(pagelisthtml(i));
                     pagestr += '<li><a href="javascript:void(0)" id="' + (i + 1) + '">' + (i + 1) + '</a></li>';

                 }
                 $('.pagination').append(pagestr);
                 $(".pagination").append('<li id="next"><a href="javascript:void(0)" class="next" rel="next">&raquo;</a></li>');
                 // 点击页码事件
                 $(".pagination li").bind("click", function() {
                     flagpage = false;
                     // console.log($(this).attr("id"));
                     if ($(this).attr('class') != "active") {
                         var prevactive = parseInt($(this).parent().find('.active span').text());
                         var curr = $(this).find('a').text();
                         if ($(this).attr("id") == "prev") {
                             if (prevactive > 1) {
                                 $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                                 $(this).parent().find('.active').prev().append('<span>' + (prevactive - 1) + '</span>').find('a').remove();
                                 $(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
                                 // orderlist(mall_id,prevactive-1);
                                 activitylist(weid, type, prevactive - 1);
                             }
                         } else if ($(this).attr("id") == "next") {
                             if (prevactive < pagenum) {
                                 $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                                 $(this).parent().find('.active').next().append('<span>' + (prevactive + 1) + '</span>').find('a').remove();
                                 $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                                 // orderlist(mall_id,prevactive+1);
                                 activitylist(weid, type, prevactive + 1);

                             }

                         } else {

                             activitylist(weid, type, $(this).find("a").text());

                             $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                             $(this).addClass("active").siblings().removeClass('active');
                             $(this).append('<span>' + curr + '</span>').find('a').remove();
                         }

                     }


                 })
             }
         }
         // 1.1数据统计
     var numfan = function(weid) {
         $.ajax({
             url: ACTIVITY_USERINFO + '/' + weid,
             type: 'get',
             headers: {
                 'Token': localStorage.getItem('token')
             },
             success: function(data) {
                 console.log(data);
                 if (data.code == 200) {

                     $(".all_total").text(data.data.count);
                     $(".no_total").text(data.data.nocount);
                     $(".ing_total").text(data.data.oncount);
                     $(".end_total").text(data.data.offcount);
                 }
             },
             error: function(xhr) {
                 console.log(xhr);
             }
         })
     }
     numfan(weid);
     // 5.未发布/进行中/已结束
     $("#J_Filter li").bind("click", function() {
         flagpage = true;

         $(this).addClass("selected").siblings().removeClass("selected");
         var type = $(this).data("id");
         activitylist(weid, type, 1);
     })








     //获取通用用户信息
     var getUserInfo = function() {
         $.ajax({
             url: FOUNDER,
             type: 'get',
             success: function(data) {
                 //console.log(data);
                 if (data.code == 200) {
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
             error: function(xhr) {
                 console.log(xhr);
             }
         })
     }

     //getUserInfo();

     var artCount = function(weid) {
         $.ajax({
             url: ARTICLES_LISTCOUNT + "?userId=" + weid,
             type: 'get',
             success: function(data) {
                 //console.log(data);
                 if (data.code == 200) {
                     $(".user-art").children('div:eq(0)').text(data.data);
                 }
             },
             error: function(xhr) {
                 console.log(xhr);
             }
         })
     }



     // 鼠标滑动到列表时加hover
     var lihover = function() {
         $(".ws_item li").mouseenter(function() {
             $(this).addClass("hover")
         }).mouseleave(function() {
             $(this).removeClass("hover")
         })
     }


     //left-navbar show words
     // $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
     //     var id = $(this).attr("id");
     //     if (id != 'login') {
     //         $(this).find(".word").show();
     //         $(this).css({
     //             "line-height": "65px"
     //         });
     //         $("#" + id + " .word").css("margin-top", "-30px");
     //     } else {
     //         if (!isLogin) {
     //             $(this).css({
     //                 "line-height": "65px",
     //             });
     //             $("#" + id + " .word").css("margin-top", "-30px");
     //         }
     //     }
     // }, function(){
     //     var id = $(this).attr("id");
     //     $(this).find(".word").hide();
     //     $(this).css("line-height", "65px");
     //     $("#" + id + " .word").css("margin-top", "-55px");
     // })

     var modeleName = [];
     var moduleState = function() {
         $.ajax({
             url: PAGES_MODULERUN_LIST,
             type: 'GET',
             headers: {
                 'Token': localStorage.getItem('token')
             },
             success: function(data) {
                 if (data.code == 200) {
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
                 var curr = 'we-active';
                 var status = true;
                 var list = ['we-set', 'we-art', 'we-active', 'we-shop', 'we-project', 'we-app', 'we-crm', 'we-log'];

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
             error: function(xhr) {
                 console.log(xhr);
             }
         })
     }

     //主页初始化
     var init__ = function(token) {
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

     init__(localStorage.getItem('token'));

 })
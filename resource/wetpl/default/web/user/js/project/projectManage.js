   //列表折叠
sessionStorage.listname='we-project';
  localStorage.setItem('project_cate_style','');
  localStorage.setItem('project_cate_weid','');
 ///////////////////////吐丝层start/////////////////////////////////////
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
        var left=(1200-$("#mess_tusi").width())/2 + 70;//居中
        var top=$(window).height()*0.25;
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

// 吐丝层end////////////////////////////////////

    // 3.删除
    var projectdel=function(obj){
        // console.log($(obj).closest('li').data('id'));
         $.ajax({
            url:PROJECT_DESTROY+'/'+$(obj).closest('li').data('id'),
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                // console.log(data);
                if(data.code == 200){
                    mess_tusi("删除成功");
                    location.reload();

                }else{
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    // 4.编辑
    var projectedit=function(obj){
        window.location="/user/admin/project/detail/"+$(obj).closest("li").data("id");
    }
    //申请提款
    var setfinance=function(){
        // $('.set_finance').click(function(){
        //PROJECT_COMPLETE
            $.ajax({
                url:PROJECT_COMPLETE+'/'+$(this).closest("li").data("id"),
                type:'get',
                headers: {
                        'Token': localStorage.getItem('token')
                    },
                success:function(data){
                    if(data.code == 200){
                        mess_tusi('提现成功');

                    }else{
                        mess_tusi(data.message);
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        // })
    }
    var setfinance=function(){
        // $('.set_finance').click(function(){
        //PROJECT_COMPLETE
            $.ajax({
                url:PROJECT_COMPLETE+'/'+$(this).closest("li").data("id"),
                type:'get',
                headers: {
                        'Token': localStorage.getItem('token')
                    },
                success:function(data){
                    if(data.code == 200){
                        mess_tusi('提现成功');

                    }else{
                        mess_tusi(data.message);
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        // })
    }

  $(document).ready(function(){
     $("#prject-list").css({
        "color": "red",
        "background": "#f7f7f7"
    });
    var  ApiMaterPlatQiniuDomain = ApiMaterPlatQiniuDomain

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    // console.log('logo:',favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    // console.log('logo:',logo);
    // $('#home img').attr('src', logo);

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

    /*var currHeight = $("#art-head").height() + $("#art-body").height();
    setHeight(currHeight);*/
    // var token="eyJpdiI6IlN0Y0o4T3lRVjRSMTJrU1pSVG16NVE9PSIsInZhbHVlIjoiNlpRXC9qMlV0cUtObkorcnQxcDczVTM3VXVPaXdHVGNqWTJmM0h5dktkcTVKbWYrU09jXC91eTY4eFRjRTFPdUNIUlc4eVZ4T0tvc3dZWTlqV0p1U2drejhBN0JNamltTWZhenVvaWp1SmFIWT0iLCJtYWMiOiJiNzFmNzBjNmE2ZjE2NWU1OGJmOThiYWU1MDNjNWU2MmY4MGFjZTZkOGY2NzRiYjg0NjM2NGQxNDNkMDU4NTBlIn0=";

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }
    // saveUserInfo(token);

   /* //router
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article','active','project','zone', 'shopping'];

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
        var active = function(){
            showLogin = false;
            window.location.href = domain + "/activity";
        }
        var project = function(){
            showLogin = false;
            window.location.href = domain + "/project";
        }
        var zone = function(){
            showLogin = false;
            window.location.href = domain + "/quan";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article,#active,#project,#zone, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/
    var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 401) {
                  // domain = '/index';
                  localStorage.removeItem('token')
                  // window.location.href = '/login'
                }
                if (data.code == 200){
                    // console.log(data);
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

    var weid = localStorage.getItem('weid');
    hasDomain(weid);


    //日期 转换为 Unix时间戳
   var dateToUnix= function(string) {
        var f = string.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
                parseInt(d[0], 10) || null,
                (parseInt(d[1], 10) || 1) - 1,
                parseInt(d[2], 10) || null,
                parseInt(t[0], 10) || null,
                parseInt(t[1], 10) || null,
                parseInt(t[2], 10) || null
                )).getTime() / 1000;
    }
    //时间戳转换日期
    var unixToDate=function(unixTime, isFull, timeZone) {
        if (typeof (timeZone) == 'number')
        {
            unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
        }
        var time = new Date(unixTime * 1000);
        var ymdhis = "";
        ymdhis += time.getUTCFullYear() + "-";
        ymdhis += (time.getUTCMonth()+1) + "-";
        ymdhis += time.getUTCDate();
        if (isFull === true)
        {
            ymdhis += " " + time.getUTCHours() + ":";
            ymdhis += time.getUTCMinutes() + ":";
            ymdhis += time.getUTCSeconds();
        }
        return ymdhis;
    }


    // 列表模板
    var listtemplate=function(data,type=0){
         //现在的时间
        var nn=new Date();
        var yn=nn.getFullYear();
        var mn=nn.getMonth()+1;
        var dn=nn.getDate();
        var timetext=yn+'-'+mn+'-'+dn;

        var disabled=btn_cancle_pub="";
        var btn_active='btn-active';
        var ing='进行中';
        type=data.status;
        // if(type==0){
            // 全部
            btn_cancle_pub='<a href="/user/admin/project/init/'+data.weid+'" >'+
            '<button  id="update_p" type="button"  "+disabled+" class="btn  btn-active "  >更新动态</button>'+
            '</a> ';

            btn_raffle_pub=''
            if(data.is_suceed==1&&data.is_luckydraw==1){
                btn_cancle_pub='';
               btn_raffle_pub='<a href="/user/admin/myproject/resupportDetail/'+data.repay_id+'" projectid="'+data.weid+'" class="btn btn-active">抽奖管理</a>'
               btn_over_pub='<a href="#"  onclick="setfinance(this)" class="btn btn-active set_finance" projectid="'+data.weid+'">申请提款</a> ';
               }
            if(data.is_suceed==2){
                btn_cancle_pub='';

            }

            btn_over_pub='';
            if(data.is_suceed==1 && (dateToUnix(timetext)>dateToUnix(data.date_end))){
                btn_cancle_pub='';
                btn_over_pub='<a href="#"  onclick="setfinance(this)" class="btn btn-active set_finance" projectid="'+data.weid+'">申请提款</a> ';

            }


        var listhtml='<li class="activity" data-id="'+data.weid+'">'+
                        '<div class="status status-process">'+
                            '<div class="up">'+data.onStatus+'</div>'+
                            '<div class="down"></div>'+
                        '</div>'+
                        '<div class="poster">'+
                            '<img src="'+ApiMaterPlatQiniuDomain+data.cover+'" class="pic">'+
                        '</div>'+
                        '<div class="detail">'+
                            '<h3 class="title">'+
                                '<a href="/'+data.domain+'/project/'+data.weid+'" target="_blank">'+data.title+'</a>'+
                            '</h3>'+
                                '<div class="property">'+
                                    '<div class="time">'+
                                        '<label>时间：</label><span>'+data.date_start+'</span> <span> ( '+data.start_week+' ) </span> <span>'+data.date_end+'</span><span> ( '+data.end_week+' ) </span> '+
                                    '</div>'+
                                    '<div class="addr">'+
                                        '<label>目标：</label>'+data.amount+''+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+
                                        '<label>已筹：</label>'+data.raise_amount+''+
                                    '</div>'+

                                    '<div class="display-ib coll">'+
                                        '<label>关注：</label>'+data.collection_num+'人'+
                                    '</div>'+
                                                                    '<div class="display-ib sign">'+
                                        '<label>支持：</label>'+data.suport_num+'人'+
                                    '</div>'+
                                   //  '<div class="display-ib mark">'+
                                   //      '<label>签到：</label>0人'+
                                   // ' </div>'+
                                    '<div class="clearfix"></div>'+
                                '</div>'+


                                '<div class="flow">'+
                                  btn_over_pub+
                                  btn_raffle_pub+
                                    '<!--发布【只有草稿才行】-->'+
                                     ' <!--取消发布-->'+
                                    '<!--进行中且免费活动才能取消-->'+
                                    btn_cancle_pub+
                                                                    '<!--进行中或已结束活动都可查看报名签到管理-->'+
                                    '<a href="/user/admin/project/Order/'+data.weid+'" class="btn btn-active">订单管理</a>'+
                                '</div>'+

                        '</div>'+
                        '<div class="operation">'+
                           ' <ul>'+
                               ' <li data-id="'+data.weid+'">'+
                                    '<a href="javascript:void(0)" onclick="projectdel(this)" class="disabled">'+
                                        '<span class="fa fa-trash-o"></span>删除'+
                                    '</a>'+
                                '</li>'+
                                '<li data-id="'+data.weid+'">'+
                                    '<a href="javascript:void(0)"  onclick="projectedit(this)"  >'+
                                        '<span class="fa fa-edit"></span>编辑'+
                                    '</a>'+
                                '</li>'+
                               //  '<li>'+
                                    // '<a href="/user/admin/project/init" >'+
                                    //     '<span class="fa fa-share-alt"></span>更新'+
                                    // '</a>'+
                               // ' </li>'+
                            '</ul>'+
                        '</div>'+
                    '</li>';
        return listhtml;
    }

    var weid=localStorage.getItem('weid');
     // 1.获取活动列表
    var flagpage=true;
    var activitylist=function(weid,type=0,page=1){
        var limit=5;
        var is_on='';
        var is_suceed='';

        if(type==1){
            is_on=1;
        }
        if(type==2){
            is_on=2;
        }
        if(type==3){
            is_suceed=2;
        }
        if(type==4){
            is_suceed=1;
            $('.flow').append('<a href="#" class="btn btn-active">申请提款</a> ')
        }
        var sendData={
            user_id:weid,
            limit:limit,
            page:page,
            is_suceed:is_suceed,
            is_on:is_on
        }
        $.ajax({
            url:PROJECT_LIST,
            type:'post',
            data:sendData,
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                // console.log(data);
                if(data.code == 200){
                    $("#J_ActivityList").children().remove();

                    data.data.list.map(x =>{
                        $("#J_ActivityList").append(listtemplate(x));
                    })
                    // 页码start
                    var pagenum=Math.ceil(data.data.total/limit);
                    pagefun(pagenum,weid,type);
                }

            },
            error: function(xhr){
                console.log(xhr);
            }
        })

    }
    //第一次初始化
    activitylist(weid);

    // 页码
    var pagefun=function(pagenum,weid,type=0){
     // console.log(pagenum+":pagenum");
        var pagestr="";
        // console.log(flagpage);
        if(flagpage){
            $('.pagination').children().remove();
            $('.pagination').append('<li id="prev"><a href="javascript:void(0);">«</a></li><li class="active"><span>1</span></li>');

            for(i=1;i<pagenum;i++){
                // $('.pagination').append(pagelisthtml(i));
                pagestr+='<li><a href="javascript:void(0)" id="'+(i+1)+'">'+(i+1)+'</a></li>';

            }
            $('.pagination').append(pagestr);
            $(".pagination").append('<li id="next"><a href="javascript:void(0)" class="next" rel="next">&raquo;</a></li>');
            // 点击页码事件
            $(".pagination li").bind("click",function(){
                flagpage=false;
                // console.log($(this).attr("id"));
                if($(this).attr('class')!="active"){
                    var prevactive=parseInt($(this).parent().find('.active span').text());
                    var curr=$(this).find('a').text();
                    if($(this).attr("id")=="prev"){
                         if(prevactive>1){
                             $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                            $(this).parent().find('.active').prev().append('<span>'+(prevactive-1)+'</span>').find('a').remove();
                            $(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive-1);
                            activitylist(weid,type,prevactive-1);
                        }
                    }else if($(this).attr("id")=="next"){
                        if(prevactive<pagenum){
                            $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                            $(this).parent().find('.active').next().append('<span>'+(prevactive+1)+'</span>').find('a').remove();
                            $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive+1);
                            activitylist(weid,type,prevactive+1);

                        }

                    }else{

                        activitylist(weid,type,$(this).find("a").text());

                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                        $(this).addClass("active").siblings().removeClass('active');
                        $(this).append('<span>'+curr+'</span>').find('a').remove();
                    }

                }


            })
        }
    }
    // 1.1数据统计
    var numfan=function(weid){
         $.ajax({
            url:PROJECT_INFO+'/'+weid,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                if(data.code == 200){
                    $("#J_Filter li").each(function(){
                        var data_id=$(this).attr("data-id");
                        if(data_id==0){
                            $(this).find(".total").text(data.data.count);
                        }
                        if(data_id==1){
                            $(this).find(".total").text(data.data.oncount);
                        }
                        if(data_id==2){
                            $(this).find(".total").text(data.data.nocount);
                        }
                        if(data_id==3){
                            $(this).find(".total").text(data.data.failcount);
                        }
                        if(data_id==4){
                            $(this).find(".total").text(data.data.successcount);
                        }
                    });
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    numfan(weid);
    // 5.未发布/进行中/已结束

    $("#J_Filter li").bind("click",function(){
        flagpage=true;
        $(this).addClass("selected").siblings().removeClass("selected");
        var type=$(this).data("id");
        activitylist(weid,type,1);
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

  /*  var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    // console.log('module:', data.data.list);
                    var state = data.data.list;
                    //console.log(state)
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
				var list = ['we-set', 'we-art', 'we-shop','we-active','we-project', 'we-app','we-crm', 'we-log'];

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

    /*//主页初始化
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

    init__(localStorage.getItem('token'));*/

})
$(function(){
    $('#update_p').click(function(){
    window.location.href='/user/admin/project/init'
})
})
/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
 //列表折叠
sessionStorage.listname='we-shop';
//var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
//const ApiMaterPlatQiniuDomain  = 'http://images.new.wezchina.com/';


$(document).ready(function(){
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
   /* var req;
    var id;
    var init = function(weid) {
        $.ajax({
            url: 'http://apitest.wezchina.com/pages/page/getDetailByUser/' + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data);

                    var bg = data.data.background;
                    var bgUser = data.data.background_user;
                    $("#img").attr("src", bg);
                    $("#img-1").attr("src", bgUser);

                    if (data.data == null) {
                        id = weid;
                        console.log('store')
                        req = store;
                    } else {
                        id = data.data.weid;
                        console.log('update')
                        req = update;
                    }

                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var weid = localStorage.getItem('weid');
    //console.log(weid)
    init(weid);*/

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

    var weid = localStorage.getItem('weid');
    hasDomain(weid);

   /* var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article','project','active','zone', 'shopping'];

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

    /* //主页初始化
    var isLogin = false;
    var init = function(token){
        if (token != 'null' && token != undefined) {
            isLogin = true;
            $(".left-nav, .login, #middle, #right").show();

            //加载用户头像

            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(../../common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();
        } else {
            login();
        }

    }

    init(localStorage.getItem('token'));*/

    // 获取个人商城信息
    var mall_id="";
    var usermall=function(){
        $.ajax({
            url:MALL_USERDETAIL,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                        if(data.data!=null && data.data!=""){
                            mall_id=data.data.weid;
                            orderlist(mall_id,1);

                            // 筛选订单列表
                            $(".btn-filter").bind("click",function(){
                                var starttime=$("input[name='start_time']").val();
                                var endtime=$("input[name='end_time']").val();
                                var no=$("input[name='no']").val();
                            })
                        }


                }
            }
        })
    }
    usermall();
    console.log(mall_id);

    //获取订单列表
    var flag=true;
    var  orderlist=function(mall_id,page,type=0,dataobj=""){
         var limit="5";
        var keywords=time_start=time_end="";
        var status=order_num="";
        if(type==1 ){
            // 未支付
            status=type;
        }else if(type==2){
            //待发货
            status=type;
        }else if(type==3){
            // 已发货
            status="";
        }else if(type==4){
            // 已完成
            status="";
        }else{
            /*// 订单号筛选
            time_start=type.time_start;
            time_end=type.time_end;
            order_num=type.order_num;*/

        }
        if(dataobj!=""){
            // 订单号筛选
            time_start=dataobj.time_start;
            time_end=dataobj.time_end;
            order_num=dataobj.order_num;
        }
        var sendData={
            limit:limit,
            plat_user_id:localStorage.getItem('weid'),
            page:page,
            order_status:status,
            time_start:time_start,
            time_end:time_end,
            order_num:order_num,
            keywords:keywords
        }
        $.ajax({
            url:ORDER_LIST,
            type:'post',
            data:sendData,
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log("订单列表：",data);
                if (data.code == 200) {
                    var listdata=data.data.list;
                    $(".ordertable").children().remove();
                    listdata.map(x => {
                        $(".ordertable").append(orderlisthtml(x));
                    })
                    var pagenum=Math.ceil(data.data.total/limit);
                    // console.log(page+":page");
                    var pagestr="";
                    if(flag){
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
                            flag=false;
                            // console.log($(this).attr("id"));
                            if($(this).attr('class')!="active"){
                                var prevactive=parseInt($(this).parent().find('.active span').text());
                                var curr=$(this).find('a').text();
                                if($(this).attr("id")=="prev"){
                                     if(prevactive>1){
                                         $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                        $(this).parent().find('.active').prev().append('<span>'+(prevactive-1)+'</span>').find('a').remove();
                                        $(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
                                        orderlist(mall_id,prevactive-1,type);
                                    }
                                }else if($(this).attr("id")=="next"){
                                    if(prevactive<pagenum){
                                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                        $(this).parent().find('.active').next().append('<span>'+(prevactive+1)+'</span>').find('a').remove();
                                        $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                                        orderlist(mall_id,prevactive+1,type);

                                    }

                                }else{
                                    orderlist(mall_id,$(this).find("a").text(),type);
                                    $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                    $(this).addClass("active").siblings().removeClass('active');
                                    $(this).append('<span>'+curr+'</span>').find('a').remove();
                                }

                            }


                        })
                    }

                    sendshop();
                     // 1acc8080-769f-11e7-afe9-a1e618177dd9
                    __init(localStorage.getItem("weid"));
                    // __init("1acc8080-769f-11e7-afe9-a1e618177dd9");

                }
            }
        })
    }
    // 页码列表模板
    var pagelisthtml=function(num){
        var pagehtml='<li>'+
                        '<a href="javascript:void(0)" id="'+num+'">'+num+'</a>'+
                    '</li>';
        return pagelisthtml;
    }
    //订单列表模板
    var status_pay=sendgoods=log_company=log_num="";
    var orderlisthtml=function(data){
        if(data.status>1){
            if(data.logistics_status==1){
                status_pay="发货";
                // sendgoods='<button type="button" class="btn btn-info btn-primary id btn-send" data-toggle="modal" data-id="486" data-target=".bs-example-modal-sm" >发货</button>';
               sendgoods= '<div class="list_details_btn btn-send" type="" id="'+data.status+'" data-toggle="modal"  data-target=".bs-example-modal-sm" data-no="'+data.order_num+'">'+status_pay+' </div>';

            } else if(data.logistics_status==2){
                status_pay="已发货";
                sendgoods=status_pay;
 // '<div class="list_details_btn" type="" id="'+data.status+'" data-no="'+data.order_num+'">'+status_pay+sendgoods+' </div>'+


            }else if(data.logistics_status==3){
                status_pay="已完成";
                sendgoods=status_pay;

            }
        }else{
            status_pay="未支付";
            sendgoods=status_pay;
        }

        if(data.logistics_company==null || data.logistics_company==""){
            log_company="";
        }else{
            log_company=data.logistics_company;
        }
        if(data.logistics_NO==null || data.logistics_NO==""){
            log_num="";
        }else{
            log_num=data.logistics_NO;
        }
        /*var listhtml='<tr id="'+data.weid+'">'+
                '<td>'+data.order_num+'</td>'+
                '<td>'+data.username+'</td>'+
                '<td>'+data.goods_title+'</td>'+
                '<td>'+data.goods_num+'</td>'+
                '<td>'+data.order_price+'</td>'+
                '<td>'+data.address_detail+'</td>'+
                '<td class="log_company">'+log_company+'</td>'+
                '<td class="log_num">'+log_num+'</td>'+
                '<td class="status_pay" id="'+data.status+'"">'+status_pay+' </td>'+
                '<td class="btn-sendgoods">'+sendgoods+'</td>'+
            '</tr>';
*/

        var listhtml='<table class="orders_list_title">'+
                        '<tbody>'+
                        '<tr class="orders_list_msg">'+
                            '<td class="list_left" colspan="3">'+
                                '<span class="list_left_date">'+data.created_at+'</span>'+
                                '<span class="list_left_num">订单号:<em>'+data.order_num+'</em></span>'+
                            '</td>'+
                            '<td class="list_right" colspan="2" align="right">'+
                                '<div class="contact_seller" data-mobile="18966700695" onmouseover="$(this).find(\'span\').show();" onmouseout="$(this).find(\'span\').hide();">'+
                                    '<i></i>联系买家'+
                                    '<span style="display: none;">联系电话：'+data.phone+'</span>'+
                                '</div>'+
                            '</td>'+
                        '</tr>'+
                    '</tbody>'+
                    '</table>';
        if(data.goods.length){
            for(var i=0; i<data.goods.length; i++){
                var goodItem =
                    '<tr class="orders_list_content" id="'+data.weid+'">'+
                        ' <td width="40%">'+
                            '<div class="orders_list_pic">'+
                                '<a href="wemall/goods/'+data.goods[i].goods_id+'" target="_blank">'+
                                    '<img class="img" src="'+qiniu_bucket_domain+data.goods[i].goods_cover+'" alt="">'+
                                    '<p class="txt">'+data.goods[i].goods_title+'</p>'+
                                '</a>'+
                            '</div>'+
                        '</td>'+
                        '<td width="10%">'+
                            '<div class="orders_list_buy">'+
                                '<span>x'+data.goods[i].goods_num+'</span>'+
                            '</div>'+
                        '</td>'+
                        '<td width="15%">'+
                            '<div class="orders_list_buy">'+
                                '<span class="list_right_gj"><p>￥'+data.order_price+'</p><p>(含运费:0.00)</p></span>'+
                            '</div>'+
                        '</td>'+
                        '<td width="25%">'+
                            '<div class="orders_list_addr">'+
                                '<p>'+data.username+'<em>'+data.phone+'</em></p>'+
                                '<p>'+data.address_detail+'</p>'+
                                '<p>备注:<span>'+data.note+'</span></p>'+
                            '</div>'+
                        '</td>'+
                        '<td width="10%" class="status_pay" id="'+data.status+'"">'+
                            ' <div class="orders_list_details">'+
                                '<a href="/user/order/detail/'+data.weid+'" target="_blank">订单详情</a>'+
                                '<div class="orderstatus">'+ sendgoods+'</div>'+
                            '</div>'+
                        '</td>'+
                    '</tr>'
            }


        }



        return listhtml;
    }
  // var selectorder=function(){
    $(".btn-select").bind("click",function(){
        flag=true;
        // $(this).addClass("btn_active").siblings().removeClass("btn_active");
        $(this).closest("li").addClass("current").siblings().removeClass("current");
        var statusid=$(this).data("id");
        if(statusid==0){
            $("input[name='start_time']").val("");
            $("input[name='end_time']").val("");
            $("input[name='no']").val("");
        }
        var time_start=$("input[name='start_time']").val();
        var time_end=$("input[name='end_time']").val();
        var order_num=$("input[name='no']").val();

        orderlist(mall_id,1,statusid,{time_start:time_start,time_end:time_end,order_num:order_num});
    })
// }
    $(".btn-num").bind("click",function(){
        flag=true;
        var time_start=$("input[name='start_time']").val();
        var time_end=$("input[name='end_time']").val();
        var order_num=$("input[name='no']").val();
        // var statusid=$(".btn-select.btn_active").data("id");
        var statusid=$(".current .btn-select").data("id");
        console.log(statusid);

        orderlist(mall_id,1,statusid,{time_start:time_start,time_end:time_end,order_num:order_num});


    })


    //back to top
    $("#toTop").hide();
    $(".read").scroll(function(){
        if ($(".read").scrollTop() > $(window).height() / 2) {
            $("#toTop").fadeIn(500);
            $("#toTop").hover(function(){
                $(this).css("background-color", "#eeeeee");
            }, function(){
                $(this).css("background-color", "white");
            });
        } else {
            $("#toTop").fadeOut(500);
        }
    })

    $("#toTop").click(function(){
        $('.read').animate({scrollTop:0}, 300);
    })

    var sendshop=function(){
        var orderid="";
        $(".btn-send").bind("click",function(){
            console.log($(this));
            // orderid=$(this).parent().parent().attr("id");
            orderid=$(this).closest('tr').attr("id");
            $("#myModal_input").val(orderid);
            // var status_pay=$(this).parent().parent().find(".status_pay").attr("id");
            var status_pay=$(this).closest('tr').attr("id");
                console.log(orderid);

                $.ajax({
                    url : apiUrl + 'pages/logistics/lists',
                    type : 'post',
                    data : {
                        'user_id' : localStorage.getItem('weid'),
                        'status' : 1
                    },
                    headers : {
                        "Token" : localStorage.getItem('token')
                    },
                    dataType : 'json',
                    success : function (res) {
                        console.log(res)
                        if(res.data && res.code===200){
                            var optionList = res.data.list;
                            for(var i=0; i<optionList.length; i++){
                                var optionDom =
                                    '<option value='+ optionList[i].logistics_id +'>'+optionList[i].logistics_company+'</option>';
                                $('#exampleInputEmail1').append(optionDom)
                            }
                        }
                    }
                })
        })
      company(orderid,status_pay);

    }
    // 填写物流公司
    var company=function(orderid,status_pay){
        $('.save').bind('click', function() {
            var l_company = $("select[name=wuliu_company]").val();
            var l_card = $("input[name=wuliu_card]").val();
            var id = $("#myModal_input").val();
            // var l_status=2;
            // var a = csrf.csrfToken;
            var sendData={
                order_id:id,
                logistics_id:l_company,
                logistics_no:l_card
                // status:
                // pay_way:
            }
                         // $('#myModal').modal('hide');

            //console.log(sendData);
            $.ajax({
                url: apiUrl + 'order/send',
                type:'post',
                data:sendData,
                headers: {
                        'Token': localStorage.getItem('token')
                    },
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    if (data.code == 200) {
                        layer.msg("发货成功");

                         $('#myModal').modal('hide');
                        // $("#"+id).find(".log_company").text(l_company);
                        // $("#"+id).find(".log_num").text(l_card);
                        console.log($("#"+id).find(".status_pay .orders_list_details .btn-send"));

                        $("#"+id).find(".orderstatus").children().remove();
                        console.log($("#"+id).find(".orderstatus"));
                         $("#"+id).find(".orderstatus").append("<div>已发货</div>");
                        // $("#"+id).find(".status_pay").attr("id",l_status);
                        // $("#"+id).find(".btn-sendgoods").text('');

                        $("input[name=wuliu_company]").val('');
                        $("input[name=wuliu_card]").val('');
                        // var l_company = $("input[name=wuliu_company]").val('');
                        // var l_card = $("input[name=wuliu_card]").val('');

                        // layer.alert('订单填写成功', function() {
                        //     location.reload();
                        // });


                    }else {
                        layer.msg(data.message);
                    }
                }
            })

        });
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

        //获取通用用户信息
    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    console.log(weid)
                    if (info.avatar != "") {
                        $("#head-icon, .user-head").css({
                            "background": "url(" +qiniu_bucket_domain+ info.avatar + ") no-repeat center",
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
                    artCount(weid);
                    //artTypeList(weid);
                    catesfun(weid);

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

     //个性域名用户weid
    var userId;
    var __init = function(weid) {
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    //var domain = data.data.domain;
                    console.log(data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        console.log('userId:', userId);
                        console.log('userDetail');
                        console.log($(".orders_list_pic a").attr("href"));
                        $(".orders_list_pic a").each(function(){
                            $(this).attr("href","/"+data.data.domain+"/"+$(this).attr("href"));
                        })
                        $(".orders_list_details a").each(function(){
                            // $(this).attr("href","/"+data.data.domain+"/"+$(this).attr("href"));

                        })
                        // getUserInfo(USERDETAIL, "/" + userId);
                    } else {
                        $(".orders_list_pic a").each(function(){
                            $(this).attr("href","/index/"+$(this).attr("href"));
                        })
                        /*$(".orders_list_details a").each(function(){
                            $(this).attr("href","/index/"+$(this).attr("href"));

                        })*/
                    }
                } else {
                    window.location.href = "/*";
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

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
                var curr = 'we-shop';
                var status = true;
				var list = ['we-set', 'we-art', 'we-shop','we-active','we-project', 'we-app', 'we-log'];

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

    init__(localStorage.getItem('token'));*/

})
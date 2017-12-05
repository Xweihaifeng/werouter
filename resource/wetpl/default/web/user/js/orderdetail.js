/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_2"){
    $("#we_title_2").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_2").find(".title-img").css("transform","rotate(90deg)");
}
$(document).ready(function(){
var qiniu_bucket_domain =ApiMaterPlatQiniuDomain;

    var showLogin = false; //调整窗口大小时登陆框是否存在
    var currWidth = $(window).width();
    var currHeight = $(window).height();
    var width = $(window).width() / 2 - 180;
    var height = $(window).height() / 2 - 165;
    var readHeight = $(".read").height();

    if (readHeight == 768){
        $(".left-nav").css("min-height", currHeight);
        $(".read").css("min-height", currHeight);
        $(window).resize(function(){
            currWidth = $(window).width();
            currHeight = $(window).height();
            width = $(window).width() / 2 - 180;
            height = $(window).height() / 2 - 165;
            var top = $(window).scrollTop();
            $(".left-nav").css("min-height", currHeight);
            $(".read").css("min-height", currHeight);
            $(".show-login").css({
                "margin-top": top + height,
                "margin-left": width
            });
        })
    }

    var tusitemp="";
    function mess_tusi(strs){
        clearTimeout(tusitemp);
        $("#mess_tusi").remove();
        //创建吐丝层并写入内容
        if(!$("#mess_tusi").attr("id")){ //吐丝层不存在创建
            $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>"+strs+"</span></div>"); //写入内容
        }else{
            $("#mess_tusi").html(strs);  //写入内容
        }
        //定义吐丝层位置
        var left=(1200 - $("#mess_tusi").width())/2;//居中
        var top=$(window).height()*0.5;
        $("#mess_tusi").css({"left":left+"px","top":top+"px"});

        //显示吐丝层rou't
        $("#mess_tusi").css("display",'');

        //2秒后关闭
        tusitemp =  setTimeout(function (){
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        },2000);
        return false;
    }
    var id = window.location.href.split('/').pop();

    var url = window.location.href.split('/');
    var domain = url.slice(3, 4)[0];


    var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: apiUrl+'pages/page/getDetailByUser/' + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
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
    
    //route
    var isLogin; //判断用户登陆与否
    var router = function(route){
        if(!window.localStorage.getItem("token")) {
            isLogin = false;
        } else {
            isLogin = true;
        }
        // var routerList = ['home', 'login', 'article', 'active', 'project', 'shopping', 'zone', 'zan'];
        var routerList = ['home', 'login', 'article', 'active', 'zan'];

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
            window.location.href = domain +"/article";
        }

        var active = function(){
            showLogin = false;
            window.location.href = domain +"/activity";
        }
        var project = function(){
            showLogin = false;
            window.location.href = domain +"/project";
        }


        var shopping = function(){
            showLogin = false;
            window.location.href = domain +"/wemall";
        }

        var zone = function(){
            showLogin = false;
            window.location.href = domain +"/quan";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    // $("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function(){
    $("#home, #login, #article, #active, #zan").click(function(){
        var id = $(this).attr("id");
        router(id);
    })
     //主页初始化
    var isLogin = false;
    var init = function(token){
        if (token != 'null' && token != undefined) {
            isLogin = true;
            $(".left-nav, .login, #middle, #right").show();

            //加载用户头像

            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();
        } else {
            login();
        }

    }

    init(localStorage.getItem('token'));
    
    var id = window.location.href.split('/').pop();


     // 产生订单模板
    var dizhiacitve='';
         var colorred='';
    var addrdiv=function(data){
        var payway="";
         if(data.pay_way==1){
                payway="微信支付";

             }else{
                payway="支付宝支付";
             }
        if(data.note==null||data.note==''||data.note=="undefined"){
            data.note='还未留言';        
        }
        var logistics_flag=false;
        var refund_flag=false;
        var pay_flag=false;
        switch(data.order_status)
        {
        case 1:
          data.order_status_str='订单已下单';
          break;
        case 2:
          data.order_status_str='订单已经支付';
          pay_flag=true;
          break;
        case 3:
          data.order_status_str='订单已经发货';
          //订单物流信息
          pay_flag=true;
          logistics_flag=true;
           
          break;
        case 4:
          pay_flag=true;  
          data.order_status_str='订单已经确认收货';
          logistics_flag=true;
          break;
        case 5:
          pay_flag=true;  
          data.order_status_str='订单商品已经评论';
          logistics_flag=true;
          break;
        case 6:
          data.order_status_str='订单已经取消';
          break;
        case 7:
          pay_flag=true;
          data.order_status_str='订单已经确认交易完成';
          logistics_flag=true;
          break;
        case 8:
          pay_flag=true;
          data.order_status_str='订单已经申请退款';
          logistics_flag=true;
          break;
        case 9:
          pay_flag=true;
          data.order_status_str='订单已经申请退款通过';
          logistics_flag=true;
          refund_flag=true;
          break;
        case 10:
          data.order_status_str='订单已经删除';
          break;    
        default:
          break;
        }
        var addrdivhtml='<table class="orders_list_title">'+
                '<tbody>'+
                '<tr class="orders_list_msg">'+
                    '<td class="list_left" colspan="4">'+
                        '<span class="list_left_date">订单信息</span>'+
                    '</td>'+
                '</tr>'+
                '<tr class="orders_list_content" id="'+data.weid+'" data-id="'+data.goods_id+'">'+
                   ' <td width="50%">'+
                        '<div class="od_about_order_left">'+
                          '<p><span class="t">收货地址:</span><span class="txt">'+data.address_detail+'</span></p>'+
                          '<p><span class="t">买家留言:</span><span class="txt">'+data.note+'</span></p>'+
                        '</div>'+
                    '</td>'+
                    '<td width="50%">'+
                        '<div class="od_about_order_left">'+
                         '<p><span class="t">订单编号:</span><span class="txt">'+data.order_num+'</span></p>'+
                         '<p><span class="t">支付方式:</span><span class="txt">'+payway+' </span></p>'+
                         '<p><span class="t">订单状态:</span><span class="txt">'+data.order_status_str+' </span></p>';
                         if(pay_flag){
                            addrdivhtml+='<p><span class="t">交易单号:</span><span class="txt">'+data.pay_num+'</span></p>';
                         }  
                         if(logistics_flag){
                            //addrdivhtml+='<p><span class="t">物流单号:</span><span class="txt">'+data.send.logistics_no+'</span></p><p><span class="t">物流公司:</span><span class="txt">'+data.send.logistics_company+'</span></p>';
                         }
                         if(refund_flag){
                            addrdivhtml+='<p><span class="t">退款单号:</span><span class="txt">'+data.refund[0].order_refund_num+'</span></p>';
                            addrdivhtml+='<p><span class="t">退款金额:</span><span class="txt">'+data.refund[0].order_refund_money+'</span></p>';
                            addrdivhtml+='<p><span class="t">退款日期:</span><span class="txt">'+data.refund[0].created_at+'</span></p>';
                         }   
                        addrdivhtml+='</div>'+
                    '</td>'+
                '</tr>'+
            '</tbody>'+
            '</table>';
            $(".orderdetail").append(addrdivhtml);
            if(logistics_flag){
                if (data.send) {
                    //已经发货
                    InitLogisticsTable(data);
                }
            }
            
    }
    //初始物流列表
    var InitLogisticsTable=function(data){
        /*
        data.send.logistics_no
        data.send.logistics_company
        data.send.logistics_company_code*/
        var goods=data.goods;
        var obj=data.send;
        obj.map(x=>{
            $.ajax({
                url: apiUrl+'pages/logistics/getLogisticsInfo',  
                type:'post',
                data:{logistics_NO:x.logistics_no,company_code:x.logistics_company_code},
                headers: {
                        'Token': localStorage.getItem('token')
                    },
                dataType: 'json',
                success: function(data){
                    if (data.code == 200) {
                     var html='<table class="orders_list_title"><tbody>'+
                        '<tr class="orders_list_msg">'+
                        '<td class="list_left" colspan="4">'+
                            '<span class="list_left_date">物流信息</span>'+
                        '</td>'+
                        '</tr><tr class="orders_list_content" id="914087f0-d0e1-11e7-ae66-c11b9b4ee3b1" data-id="undefined"> <td width="40%" colspan="4"><div class="od_about_order_left  od_bgwrite">';
                        data.data.data.map(x=>{
                            html+='<p><span>日期:'+x.ftime+'</span>&nbsp&nbsp&nbsp&nbsp<span class="txt">'+x.context+'</span></p>';
                        });
                        html+='<span>商品信息<span>';
                        //分割字符串        
                        var order_goods_list=x.order_goods_id.split(",");
                        order_goods_list.map(y=>{
                            goods.map(z=>{
                                if(z.weid==y){
                                    html+='<div><div ><a href="'+domain_order+'wemall/goods/'+z.goods_id+'" target="_blank"><img  src="'+qiniu_bucket_domain+z.goods_cover+'" style="width: 80px;" alt=""><span>'+z.goods_title+'</span></a></div></div>';        
                                }        
                            });
                        });
                        html+='</div></td></tbody></table>';
                        $(".orderdetail").append(html);
                    }
                }
            })
            
        })
    }

    // 产生商家信息模板
    var mallusertemplate=function(data){
        var nickname="";
        if(data.nickname==null){
            nickname="没有昵称";
        }else{
            nickname=data.nickname;
        }
        var phone=data.phone
        var addr='';
        if(data.province!=''||data.province!='undefined'||data.province!=null){
            addr+=data.province;
        }
        if(data.city!=''||data.city!='undefined'||data.city!=null){
            addr+=data.city;
        }
        var malluserdivhtml='<table class="orders_list_title">'+
                '<tbody>'+
                '<tr class="orders_list_msg">'+
                    '<td class="list_left" colspan="4">'+
                        '<span class="list_left_date">商家信息</span>'+

                    '</td>'+

                '</tr>'+
                '<tr class="orders_list_content" id="'+data.weid+'" data-id="'+data.goods_id+'">'+
                   ' <td width="40%" colspan="4">'+
                        '<div class="od_about_order_left  od_bgwrite">'+
                        '<p><span class="t">商家昵称:</span><span class="txt">'+nickname+'</span></p>'+
                        '<p><span class="t">所在地址:</span><span class="txt">'+addr+'</span></p>'+
                        '<p><span class="t">联系电话:</span><span class="txt">'+phone+'</span></p>'+
                         '</div>'+
                    '</td>'+

                '</tr>'+
            '</tbody>'+
            '</table>';
            return malluserdivhtml;
    }
    //买家信息模块
    var usertemplate=function(data){
        var nickname="";
        if(data.nickname==null){
            nickname="没有昵称";
        }else{
            nickname=data.nickname;
        }
        var phone=data.phone
        var addr='';
        if(data.province!=''||data.province!='undefined'||data.province!=null){
            addr+=data.province;
        }
        if(data.city!=''||data.city!='undefined'||data.city!=null){
            addr+=data.city;
        }
        var userdivhtml='<table class="orders_list_title">'+
                '<tbody>'+
                '<tr class="orders_list_msg">'+
                    '<td class="list_left" colspan="4">'+
                        '<span class="list_left_date">买家信息</span>'+

                    '</td>'+

                '</tr>'+
                '<tr class="orders_list_content" id="'+data.weid+'" data-id="'+data.goods_id+'">'+
                   ' <td width="40%" colspan="4">'+
                        '<div class="od_about_order_left  od_bgwrite">'+
                        '<p><span class="t">商家昵称:</span><span class="txt">'+nickname+'</span></p>'+
                        '<p><span class="t">所在地址:</span><span class="txt">'+addr+'</span></p>'+
                        '<p><span class="t">联系电话:</span><span class="txt">'+phone+'</span></p>'+
                        '<p><span class="t">收货地址:</span><span class="txt">'+data.address+'</span></p>'+
                         '</div>'+
                    '</td>'+

                '</tr>'+
            '</tbody>'+
            '</table>';
            return userdivhtml;
    }

    // 购买的商品模板
    var mallshoptemplate=function(data){
         var mallshopdivhtml='<table class="orders_list_title">'+
                '<tbody>'+
                '<tr class="orders_list_msg">'+
                    '<td class="list_left" colspan="4">'+
                        '<span class="list_left_date">购买的商品</span>'+

                    '</td>'+
                    '<!--<td class="list_right" colspan="2" align="right">'+
                        '<div class="contact_seller" data-mobile="18966700695" onmouseover="$(this).find(\'span\').show();" onmouseout="$(this).find(\'span\').hide();">'+
                            '<i></i>联系买家'+
                            '<span style="display: none;">联系电话：'+data.phone+'</span>'+
                        '</div>'+
                    '</td>-->'+
                '</tr>';


                data.map(x=>{
                    //运费计算    
                    var postage=0;
                    if(x.postage_status==2){
                        if(parseFloat(x.postage_max_money)>=(parseFloat(x.goods_price)*parseInt(x.goods_num))&&parseInt(x.postage_max_money)!=0){
                            postage=0;        
                        }else{
                            postage=parseFloat(x.postage)*parseInt(x.goods_num); 
                        }
                    }else{
                        postage=0;
                    }
                    var goods_price=parseInt(x.goods_num)*parseFloat(x.goods_price); 
                    mallshopdivhtml+='<tr class="orders_list_content" style="height:100px;" id="'+x.weid+'" data-id="'+x.goods_id+'">'+
                       ' <td width="40%">'+
                            '<div class="orders_list_pic">'+
                                '<a href="'+domain_order+'wemall/goods/'+x.goods_id+'" target="_blank">'+
                                    '<img class="img" src="'+qiniu_bucket_domain+x.goods_cover+'" alt="">'+
                                    '<p class="txt">'+x.goods_title+'</p>'+
                                '</a>'+
                            '</div>'+
                        '</td>'+
                        '<td width="10%">'+
                            '<div class="orders_list_buy">'+
                                '<span>￥'+x.goods_price+'</span>'+
                            '</div>'+
                        '</td>'+
                        '<td width="10%">'+
                            '<div class="orders_list_buy">'+
                                '<span>x'+x.goods_num+'</span>'+
                            '</div>'+
                        '</td>'+
                        '<td width="15%">'+
                           '<div class="orders_list_buy">'+
                                '<span class="list_right_gj"><p>￥'+goods_price+'</p><p>(运费:'+postage+')</p></span>'+
                            '</div>'+
                        '</td>'+
                    '</tr>';
                })
            mallshopdivhtml+='</tbody>'+
            '</table>';
            return mallshopdivhtml;
    }


    // 获取订单详情
    var init = function(id){
        $.ajax({
            url: ORDER_DETAIL+'/' + id,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                if (data.code == 200) {
                    var orders = data.data;
                    addrdiv(orders);
                    $(".goodsdetail").append(mallshoptemplate(orders.goods));
                    malldetail(orders.mall_id);
                    userdetail(orders.plat_user_id,orders.address_detail);
                    //$(".totalgoodsprice").text(orders.order_price);
                    $(".totalorderprice").text(orders.order_price);
                    $(".totalprice").text(orders.order_price);
                }
            }
        })
    }
    // 获取商城详情
    var malldetail=function(mall_id){
        $.ajax({
            url: MALL_DETAIL+'/' + mall_id,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var orders = data.data;
                    
                   //商品链接产生     
                   __init(orders.plat_user_id);
                   malluserdetail(orders.plat_user_id);


                }
            }
        })
    }
     // 获取商家详情
    var malluserdetail=function(userid){
        $.ajax({
            url: USERDETAIL+'/' + userid,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var orders = data.data;
                    if(orders.province_id!=''){
                         $.ajax({
                            url: apiUrl+'province/detail/' + orders.province_id,
                            type:'get',
                            dataType: 'json',
                            success: function(data){
                                if (data.code == 200) {
                                    orders.province=data.data.name;
                                    if(orders.area_id){
                                        $.ajax({
                                            url: apiUrl+'area/detail/' + orders.area_id,
                                            type:'get',
                                            dataType: 'json',
                                            success: function(data){
                                                if (data.code == 200) {
                                                    orders.city=data.data.name;
                                                    $(".malldetail").append(mallusertemplate(orders));
                                                }
                                            }
                                        })
                                    }else{
                                        $(".malldetail").append(mallusertemplate(orders));
                                    }
                                }
                            }
                        })   
                    }
                }
            }
        })
    }
    //卖家信息
    var userdetail=function(userid,address){
        $.ajax({
            url: USERDETAIL+'/' + userid,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var orders = data.data;
                    orders.address=address;
                    if(orders.province_id!=''){
                         $.ajax({
                            url: apiUrl+'province/detail/' + orders.province_id,
                            type:'get',
                            dataType: 'json',
                            success: function(data){
                                if (data.code == 200) {
                                    orders.province=data.data.name;
                                    if(orders.area_id){
                                        $.ajax({
                                            url: apiUrl+'area/detail/' + orders.area_id,
                                            type:'get',
                                            dataType: 'json',
                                            success: function(data){
                                                if (data.code == 200) {
                                                    orders.city=data.data.name;
                                                    $(".userdetail").append(usertemplate(orders));
                                                }
                                            }
                                        })
                                    }else{
                                        $(".userdetail").append(usertemplate(orders));
                                    }
                                }
                            }
                        })   
                    }
                }
            }
        })
    }
    // 获取商品详情
    var goodsdetail=function(goods_id){
        $.ajax({
            url: GOODS_DETAIL+'/' + goods_id,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var orders = data.data;
                    $(".goodsdetail").append(mallshoptemplate(orders));
                    /*malldetail(orders.mall_id);
                    goodsdetail(orders.goods_id);*/



                }
            }
        })
    }
     //个性域名用户weid
    var domain_order="";
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
                        console.log(data.data.domain);
                        domain_order="/"+data.data.domain+"/";
                    } else {
                        domain_order="/index/";
                    }
                   $(".orders_list_pic a").attr("href",domain_order+$(".orders_list_pic a").attr("href"));


                } else {
                    window.location.href = "/*";
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    init(id);
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
})
$(function(){
    var currWidth = $(window).height() - 90;
  var currHeight = $(window).height() - 90;
  setHeight(currHeight + 90);
  $("#middle, #right").height(currHeight);

  $(window).resize(function() {
    currWidth = $(window).height() - 90;
    currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle, #right").height(currHeight);
  })
})
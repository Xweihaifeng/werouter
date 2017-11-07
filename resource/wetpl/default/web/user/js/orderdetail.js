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
            window.location.href = "/index/article";
        }

        var active = function(){
            showLogin = false;
            window.location.href = "/index/activity";
        }
        var project = function(){
            showLogin = false;
            window.location.href = "/index/project";
        }


        var shopping = function(){
            showLogin = false;
            window.location.href = "/index/wemall";
        }

        var zone = function(){
            showLogin = false;
            window.location.href = "/index/quan";
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

        // var addrdivhtml='<div class="od_about_order_left od_w50 ">'+
        //                 '<p><span class="t">收货地址:</span><span class="txt">'+data.address_detail+'</span></p>'+
        //                 '<p><span class="t">买家留言:</span><span class="txt">'+data.note+'</span></p>'+
        //             '</div>'+
        //             '<div class="od_about_order_left od_w50 ">'+
        //                 '<p><span class="t">订单编号:</span><span class="txt">'+data.order_num+'</span></p>'+
        //                 ' <p><span class="t">支付方式:</span><span class="txt">'+payway+' </span></p>'+
        //                  '<!--<p><span class="t">支付交易号:</span><span class="txt">'+weid+'</span></p>-->'+

        //             '</div>';


         var addrdivhtml='<table class="orders_list_title">'+
                '<tbody>'+
                '<tr class="orders_list_msg">'+
                    '<td class="list_left" colspan="4">'+
                        '<span class="list_left_date">订单信息</span>'+

                    '</td>'+

                '</tr>'+
                '<tr class="orders_list_content" id="'+data.weid+'" data-id="'+data.goods_id+'">'+
                   ' <td width="50%">'+
                        '<div class="od_about_order_left od_w50 order_x">'+
                          '<p><span class="t">收货地址:</span><span class="txt">'+data.address_detail+'</span></p>'+
                          '<p><span class="t">买家留言:</span><span class="txt">'+data.note+'</span></p>'+
                        '</div>'+
                    '</td>'+
                    '<td width="50%">'+
                        '<div class="od_about_order_left od_w50 ">'+
                         '<p><span class="t">订单编号:</span><span class="txt">'+data.order_num+'</span></p>'+
                         ' <p><span class="t">支付方式:</span><span class="txt">'+payway+' </span></p>'+
                          '<!--<p><span class="t">支付交易号:</span><span class="txt">'+weid+'</span></p>-->'+
                       '</div>'+
                    '</td>'+

                    // '<td width="10%">'+
                    //    ' <div class="orders_list_details" id="'+data.status+'">'+
                    //         '<a href="/user/order/detail/'+data.weid+'" target="_blank">订单详情</a>'+sendgoods+
                    //          '</div>'+
                    // '</td>'+
                '</tr>'+
            '</tbody>'+
            '</table>';





                return addrdivhtml;
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
        phone="没有电话";
        var addr="没有地址";
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

        // var malluserdivhtml='<div class="od_about_order_left  od_bgwrite">'+
        //                 '<p><span class="t">商家昵称:</span><span class="txt">'+nickname+'</span></p>'+
        //                 '<p><span class="t">所在地址:</span><span class="txt">'+addr+'</span></p>'+
        //                 '<p><span class="t">联系电话:</span><span class="txt">'+phone+'</span></p>'+
        //             '</div>';

                return malluserdivhtml;
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
                '</tr>'+
                '<tr class="orders_list_content" id="'+data.weid+'" data-id="'+data.goods_id+'">'+
                   ' <td width="40%">'+
                        '<div class="orders_list_pic">'+
                            '<a href="'+data.domain_order+'wemall/goods/'+data.goods_id+'" target="_blank">'+
                                '<img class="img" src="'+qiniu_bucket_domain+data.goods_cover+'" alt="">'+
                                '<p class="txt">'+data.goods_title+'</p>'+
                            '</a>'+
                        '</div>'+
                    '</td>'+
                    '<td width="10%">'+
                        '<div class="orders_list_buy">'+
                            '<span>x'+data.goods_num+'</span>'+
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
                    // '<td width="10%">'+
                    //    ' <div class="orders_list_details" id="'+data.status+'">'+
                    //         '<a href="/user/order/detail/'+data.weid+'" target="_blank">订单详情</a>'+sendgoods+
                    //          '</div>'+
                    // '</td>'+
                '</tr>'+
            '</tbody>'+
            '</table>';

        // var mallshopdivhtml='<tr class="orders_list_content">'+
        //                         '<td width="40%">'+
        //                             '<div class="orders_list_pic">'+
        //                                 '<a href="wemall/goods/'+data.goods_id+'" target="_blank">'+
        //                                     '<img class="img" src="'+qiniu_bucket_domain+data.goods_cover+'" alt="">'+
        //                                     '<p class="txt">'+data.goods_title+'</p>'+
        //                                 '</a>'+
        //                             '</div>'+
        //                         '</td>'+
        //                         '<td width="10%">'+
        //                             '<div class="orders_list_buy">'+
        //                                 '<span>x'+data.goods_num+'</span>'+
        //                             '</div>'+
        //                         '</td>'+
        //                         '<td width="15%">'+
        //                            ' <div class="orders_list_buy">'+
        //                                ' <span class="list_right_gj"><p>￥'+data.order_price+'</p><p>(含运费:0.00)</p></span>'+
        //                             '</div>'+
        //                         '</td>'+
        //                         '<td width="25%">'+
        //                             '<div class="orders_list_addr">'+
        //                                 '<p>'+data.username+'<em>18966700695</em></p>'+
        //                                 '<p>'+data.address_detail+'</p>'+
        //                                 '<p>备注:<span>'+data.note+'</span></p>'+
        //                             '</div>'+
        //                         '</td>'+
        //                     '</tr>';

                return mallshopdivhtml;
    }


    // 获取订单详情
    var init = function(id){
    // useraddr();
    console.log(id);
        $.ajax({
            url: ORDER_DETAIL+'/' + id,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var orders = data.data;
                    $(".orderdetail").append(addrdiv(orders));
                    $(".goodsdetail").append(mallshoptemplate(orders));
                    malluserdetail(orders.plat_user_id);
                    $(".totalgoodsprice").text(orders.order_price);
                    $(".totalorderprice").text(orders.order_price);
                    $(".totalprice").text(orders.order_price);
                    malldetail(orders.mall_id);
                    // goodsdetail(orders.goods_id);



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
                    // $(".malldetail").append(malluserdivhtml(orders));
                    /*malldetail(orders.mall_id);
                    goodsdetail(orders.goods_id);*/

                   __init(orders.plat_user_id);
                   // __init("1acc8080-769f-11e7-afe9-a1e618177dd9");


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
                    $(".malldetail").append(mallusertemplate(orders));
                    /*malldetail(orders.mall_id);
                    goodsdetail(orders.goods_id);*/



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

                        // getUserInfo(USERDETAIL, "/" + userId);
                    } else {
                        /*$(".orders_list_pic a").each(function(){
                            $(this).attr("href","/index/"+$(this).attr("href"));
                        })*/
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



    // 提交订单
    var submitorder=function(sendData){
        if (domain == '') {
            var url = '';
        } else {
            var url = domain
        }
         $.ajax({
            url:ORDER_STORE,
            type:'post',
            data:sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                   // window.location='/shopbuy/'+data.data;//提交成功后跳转到支付页面
                    window.location.href ="/"+ url+"/wemall/pay/" +data.data;


                }else{
                    console.log('SHOPORDER  ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }


    // 获取省下市
    var getprovince=function(){
        $.ajax({
            url:PROVINCE_LIST,
            type:'get',
            success: function(data){
                if (data.code == 200) {
                    var provincedata = data.data.list;
                    provincedata.map(x => {
                            $("#province").append("<option value='"+x.id+"'>"+x.name+"</option>");
                            $("#province").bind("change",function(){
                            $("#city").children().remove();
                            getcity($(this).val());
                        })

                    })

                }else{
                    console.log('PROVINCE LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    var getcity=function(pid){
        $.ajax({
            url:AREA_LIST+'/'+pid,
            type:'get',
            success: function(data){
                if (data.code == 200) {
                    var citydata = data.data.list;
                    citydata.map(x => {
                        $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");


                    })

                }else{
                    console.log('CITYS  LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    // 获取省详情
    var provincename="";
    var getprovincedetail=function(id,status=0){
        $.ajax({
            url:PROVINCE_DETAIL+'/'+id,
            type:'get',
            success: function(data){
                if (data.code == 200) {
                     provincename=data.data.name;
                     $(".provname"+id).text(provincename);
                     if(status){
                        $(".provname-defalt").text(provincename);

                     }

                }else{
                    console.log('PROVINCE LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    // 获取市详情
    var getcitydetail=function(pid,status=0){
        $.ajax({
            url:AREA_DETAIL+'/'+pid,
            type:'get',
            success: function(data){
                if (data.code == 200) {
                    cityname=data.data.name;
                     $(".cityname"+pid).text(cityname);
                     if(status){
                        $(".cityname-defalt").text(cityname);

                     }


                }else{
                    console.log('CITYS  LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }


    // id="e3d88210-8e37-11e7-a380-9dd18b8ffa23";//默认值
    // id="f8d013e0-8e37-11e7-bb7c-21bfeaac3ae2";
    init(id);

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





    /* //获取通用用户信息
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
                            "background": "url(../common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

                    $(".line-0").html(
                        info.nickname + '<img src="http://next.wezchina.com/images/vrenzheng.png" alt="">'
                    );
                    $(".line-1").text(info.motto);
                    $(".user-cnt").text(info.nickname);
                    // artCount(weid);
                    // artTypeList(weid);



                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    getUserInfo();*/


    // 购买数量
    var buynumfun=function(one_price){
        // 购买数量
         // 购买数量
        var buy_num = parseInt($('#numm').val());
        // 商品单价
        // var one_price = parseInt($('#one_price').html());

        $("#sum_price").html("￥" + buy_num * one_price)
        $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));

        // 商品数量加减
        $(".amount-num-jia").on('click',function(){
            buy_num++;

            $("#numm").val(buy_num);
              $("#sum_price").html("￥" + buy_num * one_price);
              $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));

        });
        $(".amount-num-jian").on('click',function(){
            buy_num--;
            if(buy_num < 1 ){
                buy_num = 1;
            }
            $("#numm").val(buy_num);
              $("#sum_price").html("￥" + buy_num * one_price);
              $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));
        })
        //根据用户的输入改变价格
        $("#numm").change(function(){
            buy_num = parseInt($('#numm').val());
          if(buy_num>0){
            $("#sum_price").html("￥" + buy_num * one_price);
            $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));
        }else{
            buy_num = 1;
            $("#numm").val(buy_num)
        }


        })
    }


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
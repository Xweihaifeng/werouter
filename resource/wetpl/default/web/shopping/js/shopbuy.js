/**
 * Created by Hongguang on 2017/8/3.
 */
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

        //5秒后关闭
        tusitemp =  setTimeout(function (){
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        },5000);
        return false;
    }

// 吐丝层end////////////////////////////////////
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
$(document).ready(function(){
var qiniu_bucket_domain =ApiMaterPlatQiniuDomain;

  // token 加载值请求头（Headers）
    var token = window.localStorage.getItem('token'), isLogin = false;
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login a").css({
                'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100%'
            });
            $("#login a").addClass("i-header").html("");
        }
    }

    init(token);

    var router = function(route){
        if (!isLogin) {
            showLogin = true;
            $("#modal_login").fadeIn(300);
        } else {
            window.location.href = "/";
        }
    }

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

    var url = window.location.href.split('/');
    var domain = url.slice(3, 4)[0];
    console.log(domain)



    var options0 = $.get(CMS_ADVS);
    options0.done(function(data) {
        console.log(data);
        if(data.code == 200) {
            if(!data.data) {
                return false;
            }

            var setting = data.data.setting;
            window.localStorage.setItem("logo", setting.logo);
            window.localStorage.setItem("fav", setting.favicon);

            if(!setting.favicon == false) {
                var favicon = ApiMaterPlatQiniuDomain + setting.favicon;
                $("#public_icon").attr("href", favicon);
            }

            if(!setting.logo == false) {
                var logo = ApiMaterPlatQiniuDomain + setting.logo;
                // $("#home .logoImg").css({"background-image": "url(" + logo + ")"});
                $("#home img").attr("src",logo );
            }
        }
    });

    var id = window.location.href.split('/').pop();
    console.log(id);

    //id="0deb64e0-9118-11e7-8f7e-977d2bbf664b";//订单id
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
                console.log(data);
                if (data.code == 200) {
                    var order = data.data;
                    $(".order-title1 span").text(order.order_num);
                    $('.cope-with span').text(order.order_price);

                    if(data.data.order_status==2){
                        clearInterval(t);
                        // console.log("status:"+data.data.status);
                        // 修改商品库存量
                            
                        mess_tusi("支付成功");
                        // window.location="/shopping";
                        if (domain == '') {
                            var url = '';
                        } else {
                            var url = domain
                        }
                        window.location.href ="/"+ url+"/wemall";

                        //shopstock(data.data.goods_id,order.goods_num);
                        //shopstock(data.data.goods);    
                          

                    }
                }
            }
        })
    }
    // 商品详情
    /*
    var shopstock=function(weid,num){

        $.ajax({
            url: GOODS_DETAIL+'/'+weid,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var newstock=data.data.stock-num;
                    var newsales_num=data.data.sales_num+num;
                    console.log(newstock+":"+newsales_num);
                    var sendData={
                        weid:data.data.weid,
                        stock:newstock,
                        sales_num:newsales_num
                    }
                    shopstockupdate(sendData);

                }
            },
            error:function(){
                console.log("SHOP DETAIL ERROR");
            }
        })
    }
    */
    // 修改商品库存量
    var shopstockupdate=function(sendData){
        if (domain == '') {
            var url = '';
        } else {
            var url = domain
        }
         $.ajax({
            url: GOODS_UPDATE,
            type:'post',
            data:sendData,
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {

                         mess_tusi("支付成功");
                        // window.location="/shopping";
                    window.location.href ="/"+ url+"/wemall";

                }
            },
            error:function(){
                console.log("SHOP UPDATE ERROR");
            }
        })
    }
    // 支付二维码链接
    var t="";
    var shoppay=function(id){
        $.ajax({
            url:apiUrl+'pages/wechatPay/mallOrderPcPay',
            type:'post',
            data:{"order_id":id},
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200) {

                    // $(".payimg").append("<img src='' />");//支付二维码图片
                    // paycode(data.data.url);
                    $(".payimg").children().remove();
                     $(".payimg").append("<img src='"+QRCODE+"?url="+data.data.url+"' />");//支付二维码图片
                    // 循环判断是否支付
                    t=setInterval(function(){
                        init(id);
                    },1000);


                }else{
                    // console.log('PAY  ERROR');
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    shoppay(id);




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


var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);

    if(localStorage.getItem('title')=="" || localStorage.getItem('title')==null ||localStorage.getItem('title')==undefined || localStorage.getItem('title')=="null"){
         $.ajax({
            url: apiUrl+"cms/advs",
            type: 'get',
            success: function(data){
                if (data.code == 200){
                    $('title').text('支付-' + data.data.setting.title + '官方微主页');
                    localStorage.setItem('title',data.data.setting.title);

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }else{
        $('title').text('支付-' + localStorage.getItem('title') + '官方微主页');

    }


})
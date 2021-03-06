/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
$(document).ready(function(){
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
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
    
     
    var id=JSON.parse(localStorage.getItem(window.location.href.split('/').pop()));
     id=id.goods_list[0].goods_id;


    var url = window.location.href.split('/');
    var domain = url.slice(3, 4)[0];
  
    console.log(domain);
    var checkdomain=function(domain,id){
        // if(domain!="index" && domain!="wemall"){
        if(domain!="wemall"){
           
            $.ajax({
                url:GOODS_DOMAINGOODSISTRUE,
                type: 'post',
                data:{domain:domain,goodsid:id},
                dataType:'json',
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data){
                    console.log(data);
                    if (data.code == 200){
                       
                    } else {
                    window.location='/index/wemall';
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }

            })
        }else if(domain=="wemall"){
            window.location="/index/wemall/goods/"+id;
        }
        console.log(domain);
    }
checkdomain(domain,id);

    //route
    var isLogin; //判断用户登陆与否
    var router = function(route){
        if(!docCookies.getItem("token")) {
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
     //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css("line-height", "50px");
            $("#" + id + " .word").css("margin-top", "-20px");
        } else {
            if (!isLogin) {
                $(this).find(".word").show();
                $(this).css("line-height", "50px");
                $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
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
            $(".log-head").show();
        }
    }

    init(docCookies.getItem("token"));

    //var id = window.location.href.split('/').pop();    
    
    //获取json数组
    
    var id = jQuery.parseJSON(localStorage.getItem(window.location.href.split('/').pop()));




     // 产生地址模板
    var dizhiacitve='';
         var colorred='';
    var addrdiv=function(data){         
        dizhiacitve='';
        colorred='';
        if(data.status==1){
            var addrdivhtml='<div class="list-item" data="'+data.weid+'">'+
                   '<p class="m0">'+
                       '<div class="xinming dizhi-active" >'+data.name+'&nbsp;&nbsp;<span class="provname provname'+data.province_id+'" data-id=""></span></div>'+

                       '<div class="dizhi" style="color: rgb(255, 0, 0);">&nbsp;&nbsp;<span class="provname provname'+data.province_id+'"></span>&nbsp;&nbsp;<span class="cityname cityname'+data.area_id+'"></span>&nbsp;&nbsp;<span class="detailname">'+data.detail+'</span>&nbsp;&nbsp;<span class="buyname">'+data.name+'</span>&nbsp;&nbsp;<span class="telname">'+data.telophone+'</span></div>'+
                        '<div class="default-tip">默认地址</div>'+
                   '</p>'+
                '</div>'; 

        }else{
            var addrdivhtml='<div class="list-item" data="'+data.weid+'" >'+
                   '<p class="m0">'+
                       '<div class="xinming '+dizhiacitve+'" >'+data.name+'&nbsp;&nbsp;<span class="provname provname'+data.province_id+'" data-id=""></span></div>'+

                       '<div class="dizhi" style="'+colorred+'">&nbsp;&nbsp;<span class="provname provname'+data.province_id+'"></span>&nbsp;&nbsp;<span class="cityname cityname'+data.area_id+'"></span>&nbsp;&nbsp;<span class="detailname">'+data.detail+'</span>&nbsp;&nbsp;<span class="buyname">'+data.name+'</span>&nbsp;&nbsp;<span class="telname">'+data.telophone+'</span></div>'+
                   '</p>'+
                '</div>'; 
        }     
        return addrdivhtml;
    }
    //获取默认收货地址
    var defaultaddr=function(){
        $.ajax({
            url:ADDRESS_LIST,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                if (data.code == 200){
                    useraddrdata=data.data;
                   if(useraddrdata.total==0){
                    $("#address-lists").append("<div class='text-center'>暂无地址</div>");        
                }else{
                       $("#address-lists").find(".add-address").siblings('div').remove();
                       $(".shouhuodizhi-default").children().remove();
                    // 循环展示地址
                    useraddrdata.list.map(x=>{
                        $("#address-lists").append(addrdiv(x));
                        getprovincedetail(x.province_id);
                        getcitydetail(x.area_id);

                        if(x.status==1){
                            $(".shouhuodizhi-default").append('<div>寄送至：<span class="provname-defalt"></span>&nbsp;&nbsp;&nbsp;<span class="cityname-defalt"></span>&nbsp;&nbsp;&nbsp;<span class="address-defalt">'+x.detail+'</span>&nbsp;&nbsp;&nbsp;收货人：<span class="buyname-defalt">'+x.name+'</span>&nbsp;&nbsp;&nbsp;<span class="phone-defalt">'+x.telophone+'</span></div>');
                            getprovincedetail(x.province_id,x.status);
                            getcitydetail(x.area_id,x.status);


                        }
                    })
                    var i = 1;
                      $('.list-item .dizhi').click(function(){
                            i = 0;
                            setdefaultaddr($(this));        
                       });        
                }    
            }   
        },
        error: function(xhr){
                console.log(xhr);
            }
        })    
    }
    // 获取用户个人名下所有地址
    var useraddr=function(range_id){
        $.ajax({
            url:ADDRESS_LIST,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                   useraddrdata=data.data;
                   if(useraddrdata.total==0){
                    $("#address-lists").append("<div class='text-center'>暂无地址</div>");
                   }else{
                        // 循环展示地址
                        useraddrdata.list.map(x=>{
                            $("#address-lists").append(addrdiv(x));
                            getprovincedetail(x.province_id);
                            getcitydetail(x.area_id);
                            if(x.status==1){
                                $(".shouhuodizhi-default").append('<div>寄送至：<span class="provname-defalt"></span>&nbsp;&nbsp;&nbsp;<span class="cityname-defalt"></span>&nbsp;&nbsp;&nbsp;<span class="address-defalt">'+x.detail+'</span>&nbsp;&nbsp;&nbsp;收货人：<span class="buyname-defalt">'+x.name+'</span>&nbsp;&nbsp;&nbsp;<span class="phone-defalt">'+x.telophone+'</span></div>');
                                getprovincedetail(x.province_id,x.status);
                                getcitydetail(x.area_id,x.status);
                            }

                        })
                        var i = 1;
                          $('.list-item').click(function(){
                                i = 0;
                                // 判断收货地址是否在配送范围之内
                                console.log($(this).attr('data'));
                                
                                israngetrue(range_id,$(this).attr('data'),$(this));
                                  
                          });
                   }
                }
                
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    // useraddr();
    //设置默认地址高量
    var setdefaultaddr=function(obj){
        var tip =
            '<div class="default-tip">默认地址</div>';
        $(".xinming").removeClass("dizhi-active");
        $(obj).parent().siblings().find(".dizhi").css({'color':'#585858'});
        $(obj).parent().siblings().find(".default-tip").remove();
        $(obj).parent().find(".xinming").addClass("dizhi-active");
        $(obj).css({'color':'#ff0000'});
        if(!$(obj).parent().find(".default-tip").length){
            $(obj).parent().append(tip)
        }
        // $('#address_id').val($(this).attr('data'));
        $(".provname-defalt").text($(obj).find('.provname').text());
        $(".cityname-defalt").text($(obj).find('.cityname').text());
        $(".address-defalt").text($(obj).find('.detailname').text());
        $(".buyname-defalt").text($(obj).find('.buyname').text());
        $(".phone-defalt").text($(obj).find('.telname').text());
    }
    // 判断收货地址是否在配送范围之内
    var israngetrue=function(range_weid,address_weid,obj){
        $.ajax({
            url:ADDRESS_ISRANGETRUE,
            type: 'post',
            data:{range_weid:range_weid,address_weid:address_weid},
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    $(".xinming").removeClass("dizhi-active");
                    $(obj).css({'color':'#4299D8'}).siblings().find(".dizhi").css({'color':'#000'});
                    $(obj).find(".xinming").addClass("dizhi-active");
                    $(obj).find(".dizhi").css({'color':'#ff0000'});
                    // $('#address_id').val($(this).attr('data'));
                    $(".provname-defalt").text($(obj).find('.dizhi-active .provname').text());
                    $(".cityname-defalt").text($(obj).find('.cityname').text());
                    $(".address-defalt").text($(obj).find('.detailname').text());
                    $(".buyname-defalt").text($(obj).find('.buyname').text());
                    $(".phone-defalt").text($(obj).find('.telname').text());
                }else{
                    mess_tusi("收货地址不在可配送范围内，请添加收货地址");
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    // 添加收货地址
     $(".save_btn").click(function(){
             var consignee = $('.product_buy_input input[name = consignee]').val(),
                province = $('#province').find("option:selected").val(),
                city = $('#city').find("option:selected").val(),
                county = $('#county').find("option:selected").val(),
                address = $('input[name = address]').val(),
                zip = $('input[name = zip]').val(),
                mobile = $('input[name = mobile]').val();
                var defaultaddr=$('input[name = defaultaddr]:checked').val();
                if (consignee == '' || province == '请选择省份' || city == '请选择城市' || county == '请选择区县' ||address == '' || mobile == '' || zip == '') {
                    layer.msg('请输入完整的收货人信息');
                }else if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
                    layer.msg('请输入正确的手机号');
                }else if(! /^[0-9][0-9]{5}$/.test(zip)){
                    layer.msg('请输入正确的邮政编码');

                }else {
                    $.ajax({
                        url:ADDRESS_STORE,
                        dataType:'json',
                        type:'post',
                        headers: {
                            'Token': docCookies.getItem("token")
                        },
                        data:{name:consignee,province_id:province,area_id:city,county_id:county,detail:address,zipcode:zip,telophone:mobile,status:defaultaddr},
                        success:function(data){
                            if(data.code == 200){
                                $('#productBuySite').css("display","none");
                                $('#save-consignee-form')[0].reset();
                                init(id);
                            }else{
                                mess_tusi(data.message);
                            }
                        }
                    })

                }

              });
     // 添加收货人按钮
     var buyaddr=function(){
         // 添加收货人
        $('#addRess').on('click',function(){
            
            $('#productBuySite').css("display","block");
        });
        $('.products_buy_exit').on('click',function(){
            $('#productBuySite').css("display","none")
        })
     }


    // 确认订单信息模板
     
    var orderstorehtml=function(data,num,postMoney,goodPrice){
        var orderhtml='<div class="goods_list" weid="'+data.weid+'" postage="'+data.postage+'" postage_max_money="'+data.postage_max_money+'" postage_status="'+data.postage_status+'"><li class="col-sm-2">'+
                '<p class=""></p>'+
                '<img src="'+qiniu_bucket_domain +data.cover+'" alt=""> </li>'+
            '<li class="col-sm-4">'+
            '<span class="fenglei"> 1</span>'+
                '<p>'+data.title+'</p>'+
                '<p><img src="/common/img/qitian.png" alt="">该商品不支持7天无理由退货</p>'+
            '</li>'+
            '<li class="col-sm-3">' +
                '<p id="one_price"> 单价：<span>'+parseFloat(goodPrice).toFixed(2)+'</span></p>' +
                '<p id="postage_price">邮费：￥<span>'+postMoney+'</span></p>' +
            '</li>'+
            '<li class="col-sm-3">'+
                '<span class="amount-num">'+
                    '<span class="amount-num-jian">-</span>'+
                    '<input type="text" value="'+num+'" id="numm" name="nums">'+
                    '<span class="amount-num-jia">+</span>'+
                    '<input type="hidden" value="'+data.stock+'" id="num_kc" class="num_kc" name="num_kc" >'+
                '</span>'+
            '</li></div>';
            return orderhtml;
    }

  
    // 获取商品详情
    var init = function(id){
    // useraddr();
        //生成默认收货地址
        defaultaddr();
        console.log(id.goods_list);
        $(".product-buy-list").children().remove();
        $(id.goods_list).each(function(index,goodsdata){
            $.ajax({
                url: GOODS_DETAIL+'/' + goodsdata.goods_id,
                type:'get',
                headers: {
                        'Token': docCookies.getItem("token")
                    },
                dataType: 'json', 
                success: function(data){
                    if (data.code == 200) {
                        var goods = data.data;
                        console.log("商品详情：",goods)
                        //判断是否会员价
                        var goodPrice = goods.price;
                        if(goods.discount_picture){
                            goodPrice = goods.discount_picture
                        }
                        //判断商品邮费
                        var postMoney = "0.00";
                        if(goods.postage_status == 2){
                            if(goods.postage_max_money && parseInt(goods.postage_max_money) > 0){
                                if(parseFloat(goodPrice * goodsdata.goods_num) < parseFloat(goods.postage_max_money)){
                                    postMoney = parseFloat(goods.postage * goodsdata.goods_num).toFixed(2)
                                }
                            }else{
                                postMoney = parseFloat(goods.postage * goodsdata.goods_num).toFixed(2)
                            }

                        }
                        //useraddr(goods.range_id);
                        $(".product-buy-list").append(orderstorehtml(goods,goodsdata.goods_num,postMoney,goodPrice));

                        associatorNotDiscount();
                    }
                }               
            })        
            
        });
        getprovincenotRange();
        buyaddr();
    }
    //不计入折扣提交
    var associatorNotDiscount=function(){
        numjian();
        numjia();
        numchange();
        buynumfunNotDiscount();
    }

    $("#submit").bind("click",function(){
        var goods_list=[];
        var obj=$(".product-buy-list").find(".goods_list");
        obj.each(function(index,element){
            var obj={"goods_id":$(element).attr("weid"),"goods_num":$(element).find("input[name='nums']").val()};
            goods_list.push(obj);
        });
        var sendData = {
            "goods_list":goods_list,
            "address_id": $(".dizhi-active").parent().attr('data'),
            "username": $(".dizhi-active").parent().find(".dizhi .buyname").text(),
            "phone": $(".dizhi-active").parent().find(".dizhi .telname").text(),
            "note": $("textarea[name='remark']").val()
        }
        submitorder(sendData);
    });




    // 提交订单
    var submitorder=function(sendData){
        if (domain == '') {
            var url = '';
        } else {
            var url = domain
        }
        console.log(sendData);
         $.ajax({
            url:ORDER_STORE,
            type:'post',
            data:sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                   // window.location='/shopbuy/'+data.data;//提交成功后跳转到支付页面
                    window.location.href ="/"+ url+"/wemall/pay/" +data.data;

                    
                }else{
                    // console.log('SHOPORDER  ERROR');
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //获取省列表（不包括配送范围）
    var getprovincenotRange = function() {
        $.ajax({
            url: PROVINCE_LIST,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                if (data.code == 200) {
                    var provincedata = data.data.list;
                        provincedata.map(x => {
                                $("#province").append("<option value='"+x.id+"'>"+x.name+"</option>");                           

                        })
                        $("#province").unbind();
                        $("#province").bind("change",function(){
                                $("#city").children().remove(); 
                                $("#city").append("<option value=''>请选择城市</option>");
                                $("#city").unbind();
                                getcitynotRange($(this).val());
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
    //获取省下市列表（不包括配送范围）
    var getcitynotRange=function(pid){
        $.ajax({
            // url:apiUrl+'/area/list/'+pid,
            url:AREA_LIST+'/'+pid,
            type:'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200) {
                    var citydata = data.data.list;
                    citydata.map(x => {
                        $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");
                    })
                    $("#city").bind("change",function(){
                        $("#county").children().remove(); 
                        $("#county").append("<option value=''>请选择区县</option>");
                        $("#county").unbind();
                        getcountynotRange($(this).val());
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

    var getcountynotRange=function(pid){
        $.ajax({
            // url:apiUrl+'/area/list/'+pid,
            url:apiUrl+'county/list'+'/'+pid,
            type:'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200) {
                    var countydata = data.data.list;
                    countydata.map(x => {
                        $("#county").append("<option value='"+x.id+"'>"+x.name+"</option>");
                    })
                }else{
                    console.log('COUNTY LIST ERROR');
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





    //计算金额
    var buynumfunNotDiscount=function(){
        var obj=$(".product-buy-list").find(".goods_list");
        var price=0;
        var postPrice = 0;
        obj.each(function(index,element){
            var singlePrice = 0;
           price=price+parseFloat($(element).find("#one_price").find("span").text())*parseFloat($(element).find("#numm").val());
           if($(element).attr('postage_status') == 2){
               if($(element).attr('postage_max_money') && parseInt($(element).attr('postage_max_money')) > 0 ){
                   if(parseFloat($(element).find("#one_price").find("span").text() * $(element).find("#numm").val()) < parseFloat($(element).attr('postage_max_money'))){
                       singlePrice = parseFloat($(element).attr('postage') * $(element).find("#numm").val())
                   }
               }else{
                   singlePrice = parseFloat($(element).attr('postage') * $(element).find("#numm").val())
               }
           }
            postPrice += singlePrice;
            $(element).find("#postage_price").find("span").text(parseFloat(singlePrice).toFixed(2))


        });
        $("#sum_price").html("￥" + parseFloat(price).toFixed(2));
        $('#pay_price').html(parseFloat(price + postPrice).toFixed(2));
        $('#freight').html(parseFloat(postPrice).toFixed(2));
    }
    //数量减
    var numjian=function(){
        $(".amount-num-jian").on('click',function(){
            var obj=$(this).parent('.amount-num');
            if(parseFloat($(obj).find("#numm").val())>=2){
                $(obj).find("#numm").val(parseFloat($(obj).find("#numm").val())-1);
                numchange(obj);    
            }else{
                mess_tusi("数量小于1");    
            }
            buynumfunNotDiscount();
        });    
    }
    //数量加
    var numjia=function(){
        $(".amount-num-jia").on('click',function(){
            var obj=$(this).parent('.amount-num');
            if(parseFloat($(obj).find("#numm").val())<parseFloat($(obj).find('.num_kc').val())){
                $(obj).find("#numm").val(parseFloat($(obj).find("#numm").val())+1);
                numchange(obj);    
            }else{
                mess_tusi("数量大于库存");    
            }
            buynumfunNotDiscount();
        });
    }
    //输入数量
    var numchange=function(){
        $("input[name='nums']").change(function(){
            var obj=$(this).parent('.amount-num');
            var re = /^[1-9]\d*$/;
            if(!re.test(parseFloat($(obj).find("#numm").val()))){
                mess_tusi("数量格式有误"); 
                $(obj).find("#numm").val(1)         
                return false;
            } 
            if(parseFloat($(obj).find("#numm").val())<1){
                $(obj).find("#numm").val(1)
                mess_tusi("数量小于0");   
            } 
            if(parseFloat($(obj).find("#numm").val())>parseFloat($(obj).find('.num_kc').val())){
                $(obj).find("#numm").val(parseFloat($(obj).find('.num_kc').val()))
                mess_tusi("数量大于库存");         
            }
            buynumfunNotDiscount();   
        })
    }
   
    
var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);
	if(localStorage.getItem('title')=="" || localStorage.getItem('title')==null ||localStorage.getItem('title')==undefined || localStorage.getItem('title')=="null"){
         $.ajax({
            url: apiUrl+"cms/advs",
            type: 'get',
            success: function(data){
                if (data.code == 200){
                    $('title').text('订单-' + data.data.setting.title + '官方微主页');
                   localStorage.setItem('title',data.data.setting.title);
                   
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }else{
        $('title').text('订单-' + localStorage.getItem('title') + '官方微主页');

    }
   
})
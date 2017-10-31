function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
}

var url = window.location.pathname.split('/');
var projectid = url.pop();
//路由处理逻辑
    if(window.location.pathname=="/wemall"){
        window.location="/index/wemall";
    }
    var weid = localStorage.getItem('weid');

    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);
    console.log(window.location.pathname);
$(document).ready(function(){


   /*   var checkdomain=function(domain,id){
        if(domain!="index" && domain!="wemall"){
           console.log("a");

        }else if(domain=="wemall" || domain=="undefined" || domain==""){
            window.location="/index/wemall";
        }

    }
checkdomain(domain);*/
/*if (domain == 'wemall') {
        domain = '';
    } else {
        domain = "/" + domain;
    }*/
    //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article','active','project', 'shopping'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/index';
        }

        var top = $(window).scrollTop();

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal").show();

                $(".show-login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user/";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href ="/"+ domain + "/article";
        }

         var active = function(){
            showLogin = false;
            window.location.href = "/"+domain + "/activity";
        }

         var project = function(){
            showLogin = false;
            window.location.href ="/"+ domain + "/project";
        }

        var shopping = function(){
            showLogin = false;
            window.location.href ="/"+ domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article,#active,#project, #shopping").click(function(){
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
                // 'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',

                'background-size': '100% 100%'
            })
            $(".log-head").show();
            var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
            $('#favicon').attr('href', favicon);
        }
    }

    init(localStorage.getItem('token'));

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
    options0.fail(function(error) {
        console.error(error);
    });
})
 $('.tjdd_submitBtn').click(function(){
            console.log('s')
     //window.location.href='/project/project-sup'
})
         // 购买数量
 /*   var buynumfun=function(){
        // 购买数量
        $(".mui-amount-increase").click(function(){
            var num = $('.mui-amount-input').val();
            if(num > 1){
                num--;
                $('.mui-amount-input').val(num);
            }
        });
        $(".mui-amount-decrease").click(function(){
            var num = $('.mui-amount-input').val();
            // var kc = parseInt($('.num_kc').text()) ;
            // if(num < kc ){
                    num++;
            $('.mui-amount-input').val(num);
            // }
        });
        $('.mui-amount-input').blur(function(){
            var num_input = $(".tb-text").val();
            // var kc = parseInt($('.num_kc').text()) ;
            // if(num_input < kc){
                $('.mui-amount-input').val(num_input);
            // }else{
                // $('.mui-amount-input').val(kc);
            // }
        });
    }*/


    var buynumfun=function(one_price=20){
        // 购买数量
         // 购买数量
        var buy_num = parseInt($('.mui-amount-input').val());
        // 商品单价
        // var one_price = parseInt($('#one_price').html());

        $("#sum_price").html( buy_num * one_price)
        $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));

        // 商品数量加减
        $(".mui-amount-decrease").on('click',function(){
            console.log($(this));
            numchange();
            var buy_num = parseInt($('.mui-amount-input').val());

            // var kc = parseInt($('.num_kc').val()) ;
            // console.log($('.num_kc').val());
            // if(buy_num < kc ){
                    buy_num++;
            // $('.mui-amount-input').val(num);
            // }
            // buy_num++;

            $(".mui-amount-input").val(buy_num);
              $("#sum_price").html( buy_num * one_price);
              $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));

        });
        $(".mui-amount-increase").on('click',function(){
            console.log($(this));

        var buy_num = parseInt($('.mui-amount-input').val());
            numchange();
            buy_num--;
            if(buy_num < 1 ){
                buy_num = 1;
            }
            $(".mui-amount-input").val(buy_num);
              $("#sum_price").html(buy_num * one_price);
              $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));
        })
        //根据用户的输入改变价格
        var numchange=function(){
            // $(".mui-amount-input").change(function(){
            buy_num = parseInt($('.mui-amount-input').val());

            // var kc = parseInt($('.num_kc').val()) ;
            // if(buy_num < kc){
                $('.mui-amount-input').val($('.mui-amount-input').val());
                 if(buy_num>0){
                    $("#sum_price").html( buy_num * one_price);
                    $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));
                // }else{
                    // buy_num = 1;
                    // $(".mui-amount-input").val(buy_num)
                // }
            }else{
                $('.mui-amount-input').val(kc);
            }


        // })
        }
        $(".mui-amount-input").change(function(){

             buy_num = parseInt($('.mui-amount-input').val());

            // var kc = parseInt($('.num_kc').val()) ;
                $('.mui-amount-input').val($('.mui-amount-input').val());
                 if(buy_num>0){
                    $("#sum_price").html(buy_num * one_price);
                    $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));
                }else{
                    buy_num = 1;
                    $(".mui-amount-input").val(buy_num);
                    $("#sum_price").html( buy_num * one_price);
                    $('#pay_price').html(buy_num * one_price + parseInt($('#freight').html()));
                }
        })

    }

$(function () {

//李生 start
var url = window.location.pathname.split('/');
var projectid = url.pop();
//初始化项目
var project_detail=function(projectid){
    $.ajax({
        url: PROJECT_DETAIL+'/' + projectid,
        type: 'get',
        success: function(data){
            if(data.code==200){
                $(".main-h3").text(data.data.title);
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}
//初始化项目列表
var project_suport_list=function(projectid){
    var sendData={
        project_id:projectid,
        limit:100,
        page:1,
    }
    $.ajax({
        url: PROJECT_REPAY_LIST,
        type: 'post',
        data:sendData,
        success: function(data){
            console.log(data);
            if(data.code==200){
                var datalist=data.data.list;
                $(".tjdd_list").empty();
                //默认html
                var html='<div class="tjdd_item animate-reward " data_style="ws" >'+
                    '<!-- 无私支持 -->'+
                    '<div ng-if="reward.itemType == 2" class="ng-scope">'+
                        '<div class="wyzz_h3">感谢您的支持</div>'+
                        '<p class="support_inforP">感谢您的支持，您将收到我们寄出的信件或贺卡，这份支持将助我们的梦想飞的更高更远。</p>'+
                        '<div class="wyzz_Cont" ng-show="reward.itemType == 2">'+
                            '<a href="javascript:;" class="wyzz_ItemA btn_ALink cur">¥ <span>1</span></a>'+
                            '<a href="javascript:;" class="wyzz_ItemA btn_ALink ">¥ <span>5</span></a>'+
                            '<a href="javascript:;" class="wyzz_ItemA btn_ALink ">¥ <span>10</span></a>'+

                            '<div class="wyzz_inputBox sitePHBox" id="selfless-v-target">'+
                                '<label>其他&nbsp;¥</label>'+
                                '<input type="text" class="wyzz_input sitePHInput ng-pristine ng-valid" num-input1="" maxlength="8" target="selfless-v-target" place-holder="">'+
                            '<span class="placeholder" style="line-height: 20px; padding-top: 6px; left: 55px; top: 1px;"></span></div>'+
                            '<a href="javascript:;" class="supportVal_A btn_ALink animate-fade" data-rel="ws" style="display: block;">立即支持</a><!-- end ngIf: !pay.selectedItem -->'+
                        '</div>'+
                    '</div><!-- end ngIf: reward.itemType == 2 -->'+

                    '<!-- 普通支持项目 -->'+
                    '<!--<div ng-show="reward.itemType != 2" class="ng-hide">'+


                        '<div class="support_title ng-binding" ng-bind="reward.title"></div>'+

                        '<div class="supportFooter">'+
                            '<div class="supportFLeft">'+
                                '<p>'+
                                    '配送费用：'+

                                '</p>'+

                                '<p style="display: none">预计回报发送时间：<b class="ng-binding"></b></p>'+
                            '</div>'+
                            '<div class="supportFRight" images="reward.imageUrls">'+

                            '</div>'+
                        '</div>'+
                    '</div>'+

                '</div>-->';
                $(".tjdd_list").append(html);
                $('.wyzz_ItemA').click(function(){
                    $(this).addClass('cur');
                    $(this).siblings().removeClass("cur");
                    $(".paymoneynum").text($(this).find("span").text());
                })
                $(".wyzz_input").click(function(){
                    $('.wyzz_ItemA').removeClass("cur");
                    $(this).closest(".wyzz_inputBox").addClass("cur");
                    $(".paymoneynum").text($(this).val());
                })
                $(".wyzz_input").bind("input",function(){
                    $(".paymoneynum").text($(this).val());

                })
                datalist.map(x =>{
                    $(".tjdd_list").append(project_suport_listtemplate(x));
                })

                suportclick();
                if(localStorage.getItem("data_style")=="ws"){

                    $("[data-rel='ws']").click();
                    $(".tjdd_h3").unbind("click");
                    $(".tjdd_h3").css('color','#666');
                }else{
                    $("[data-id='"+localStorage.getItem("repayid")+"'] .supportVal_A").click();
                }
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}

var project_suport_listtemplate=function(data){
    var html='<div class="tjdd_item animate-reward" data_style="norm" data-id="'+data.weid+'">'+
                '<!-- 无私支持 -->'+
                '<!-- ngIf: reward.itemType == 2 -->'+

                '<!-- 普通支持项目 -->'+
                '<div ng-show="reward.itemType != 2" class="">'+
                    '<!-- ngIf: !pay.selectedItem --><div class="supportABox ng-scope" ng-if="!pay.selectedItem">'+
                        '<a href="javascript:;" class="supportVal_A btn_ALink animate-fade" freightnum="'+data.freight+'" repayweid="'+data.weid+'">支持￥<span>'+data.amount+'</span></a>'+
                    '</div><!-- end ngIf: !pay.selectedItem -->'+
                    '<h3 class="support_h3 ng-binding">¥'+data.amount+'<b><span class="ng-binding">'+data.repay_num+'</span>人支持<!-- ngIf: reward.limit --></b></h3>'+

                    '<div class="support_title ng-binding">'+data.title+'</div>'+
                    '<p class="support_inforP ng-binding">'+data.content+'</p>'+
                    '<div class="supportFooter">'+
                        '<div class="supportFLeft">'+
                            '<p>'+
                                '配送费用：<!-- ngIf: reward.deliveryFee>0 -->'+
                                '<!-- ngIf: reward.deliveryFee==0 --><b ng-if="reward.deliveryFee==0" class="ng-scope freight">'+data.freight+'</b><!-- end ngIf: reward.deliveryFee==0 -->'+
                            '</p>'+

                            '<p style="display: none">预计回报发送时间：<b class="ng-binding">项目成功结束后30天内</b></p>'+
                        '</div>'+
                        '<div class="supportFRight" images="reward.imageUrls">'+
                            '<!-- ngRepeat: imgSrc in reward.imageUrls track by $index -->'+
                        '</div>'+
                    '</div>'+
                '</div>'+

            '</div>';
    return html;
}

var suportsubmit=function(sendData){

    $.ajax({
        url: PROJECT_SUPORT_STORE,
        type: 'post',
        data:sendData,
        success: function(data){
            console.log(data);
            if(data.code==200){
                console.log(data.data)
                 window.location.href='/'+domain+'/project/pay/'+data.data;
            }else{
                layer.msg(data.message);
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })

}


//李生 end
/*$('.wyzz_ItemA').click(function(){
    $(this).addClass('cur')
    $(this).siblings().removeClass("cur")
})*/

// 获取省市列表
// 获取省市
var getprovince=function(){
    $.ajax({
        // url:apiUrl+'/province/list',
        url:PROVINCE_LIST,
        type:'get',
        headers: {
            'Token': localStorage.getItem('token')
        },
        success: function(data){
            console.log(data);
            if (data.code == 200) {
                var provincedata = data.data.list;
                provincedata.map(x => {
                        $("#province_selector").append("<option  value='"+x.id+"'>"+x.name+"</option>");


                })
                $("#province_selector").bind("change",function(){
                        $("#city_selector").children().remove();
                        $("#city_selector").append("<option value=''>请选择城市</option>");
                        getcity($(this).val());
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
    console.log(pid);
    $.ajax({
        // url:apiUrl+'/area/list/'+pid,
        url:AREA_LIST+'/'+pid,
        type:'get',
        data:{province_id:pid},
        headers: {
            'Token': localStorage.getItem('token')
        },
        success: function(data){
            console.log(data);
            if (data.code == 200) {
                var citydata = data.data.list;

                citydata.map(x => {
                    $("#city_selector").append("<option value='"+x.name+"'>"+x.name+"</option>");


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
$('.animate-reward').slideDown()
var suportclick=function(){
    $('.supportVal_A').click(function(){
    $(this).parent().parent().parent().siblings().slideUp()
    $('.tjdd_item').css('border','4px solid #50abf2')
    //判断添加addr
    if($(this).text()=='立即支持'){
        $(this).parent().parent().parent().siblings(".sub_btn_div").remove();

        $(this).parent().parent().parent().after(addr1);

    }else{
        $(this).parent().parent().parent().siblings(".sub_btn_div").remove();
        $(this).parent().parent().parent().after(addr);
        $(".tjdd_submitBtn").data("id",$(this).attr("repayweid"));
        //获取省市列表
        getprovince();
    }
    var moneynum=$(this).find("span").text();
    $(".tjdd_submitBtn").data("fre",$(this).attr("freightnum"));
    buynumfun(moneynum);
    $('.tjdd_h3').text('选择其他支持项').css({
        'color':'#50abf2',
        'cursor':'pointer'
    })
    //点击跳转支付页面
    $('.tjdd_submitBtn').click(function(){
        console.log($(this).closest(".sub_btn_div").prev().attr("data_style"));
        var datastyle=$(this).closest(".sub_btn_div").prev().attr("data_style");
        if(datastyle=="ws"){
            //无私支持数据
            var money=$(".paymoneynum").text();
            var mobile=$(".ws-mobile").val();
            var name=$(".ws-name").val();
            if(name==""){
                layer.msg("支持者姓名不能为空",{time:1000});
                return false;
            }
            if(mobile==""){
                layer.msg("支持者手机号不能为空",{time:1000});
                return false;
            }
            if (!mobile.match(/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
                layer.msg("手机号码格式不正确！",{time:1000});                
                $(".ws-mobile").focus();
                return false;
            } 
            var sendData={
                project_id:projectid,
                amount:money,
                suport_realname:name,
                suport_phone:mobile

            }
        }else{
            // 有回报的数据
            var money=$("#sum_price").text();
            var mobile=$(".address-user-tel").val();
            var name=$(".address-user-name").val();
            var note=$(".paynote").val();
            var freight=$(this).data("fre");
            var repayweid=$(this).data("id");
            var repay_copies=$(".mui-amount-input").val();
            console.log($("#city_selector").val());
            var addressdetail=$("#province_selector option:selected").text()+$("#city_selector").val()+$(".address-add").val();
            var sendData={
                project_id:projectid,
                amount:money,
                note:note,
                freight:freight,
                repay_id:repayweid,
                repay_copies:repay_copies,
                suport_realname:name,
                address_detail:addressdetail,
                suport_phone:mobile
            }
        }
        console.log(sendData);
        //记录提交数据
        suportsubmit(sendData);
        //window.location.href='/project/project-pay'
    })
   $('.animate-fade').css('display','none')
   $('.tjdd_h3').click(function(){
      $(this).text('请选择支持选项').css('color','#666')
         //$('.supportVal_A').parent().parent().parent().after()remove()
            $('.tjdd_QHCont').slideUp();
            $('.animate-reward').slideDown()
            $('.animate-fade').css('display','block')
            $('.tjdd_item').css({
                'border':'4px solid #f1f1f1',
                'border-top':'none'
            })
            $('.tjdd_item').hover(function(){
                $(this).css({
                    'border-color':'#50abf2',
                    'border-top':'4px solid #50abf2'

                });
                //$('.tjdd_item:first-child').css('border-top','4px solid #50abf2')
            },function(){


                 //$('.tjdd_item:first-child').css('border-top','4px solid #f1f1f1')
                 $(this).css('border-color','#f1f1f1')
            })
            $('.tjdd_item:first-child').hover(function(){
               $(this).css('border-top','4px solid #50abf2')
            },function(){
             $(this).css('border-top','4px solid #f1f1f1')
            })
            $('.tjdd_item:first-child').css('border-top','4px solid #f1f1f1')


        })
    })
}
project_detail(projectid);
project_suport_list(projectid);

//if($('.tjdd_h3').text()=='选择其他支持项'){

    //}





var addr1=`
    <div class="tjddCont  ng-scope sub_btn_div" ng-if="step==1&amp;&amp;!loading">
        <!-- 切换后排版 begin -->
        <div class="tjdd_QHCont">
            <!-- 请验证手机号，使用账号登录 begin -->
            <!-- ngIf: pay.selectedItem.itemType!=2 &&(!pay.logined) -->
            <!-- 请验证手机号，使用账号登录 end -->
            <!-- 无私支持 begin -->
            <!-- ngIf: pay.selectedItem.itemType==2 --><div class="wszc_QHBox ng-scope" ng-if="pay.selectedItem.itemType==2">
                <div class="tjdd_formItem clearfix">
                    <div class="tjddQHFGBox sitePHBox">
                                        <span>
                                            <input type="text" class="tjdd_QHInput sitePHInput w440 ws-name ng-pristine ng-valid" ng-model="pay.mobile" placeholder="姓名（选填，发起人可通过此信息联系你）">
                                            <input type="text" style="margin-top:10px;" class="tjdd_QHInput sitePHInput w440 ng-pristine ng-valid ws-mobile" ng-model="pay.mobile" placeholder="手机号（选填，发起人可通过此信息联系你）">

                                        <!--<span class="placeholder" style="line-height: 20px; padding-top: 5px; left: 12px; top: 1px;">手机号（选填，发起人可通过此信息联系你）</span></span>-->
                    </div>
                    <!--<p class="wszc_tipP" ng-if="pay.logined ==0">您还未<a href="javascript:;" class="colorA03Link"
                                                                       ng-click="login()">登录</a>，支持完成后将无法找回您的订单。</p>-->
                </div>
            </div><!-- end ngIf: pay.selectedItem.itemType==2 -->
            <!-- 无私支持 end -->
            <!-- 实物回报 begin -->
            <div>
                <!-- ngIf: pay.selectedItem.itemType != 2 -->
                <!-- END 收货信息 -->


                <div class="shdzForm_xnBox">

                    <!-- 虚拟回报 -->
                    <!-- ngIf: pay.selectedItem.return_type==2 && pay.logined -->
                    <!-- END 虚拟回报 -->
                    <!-- ngIf: pay.selectedItem.itemType != 2 && pay.logined -->
                    <!-- ngIf: pay.logined || pay.selectedItem.itemType == 2 --><p class="zj_valP ng-scope" ng-if="pay.logined || pay.selectedItem.itemType == 2">支付<span><b>¥</b><span class="ng-binding paymoneynum">1</span></span>
                    </p><!-- end ngIf: pay.logined || pay.selectedItem.itemType == 2 -->

                    <!-- ngIf: (pay.logined || pay.selectedItem.itemType == 2) --><input type="button" value="提交订单" class="tjdd_submitBtn"><!-- end ngIf: (pay.logined || pay.selectedItem.itemType == 2) -->
                </div>
            </div>
            <!-- 实物回报 end -->
        </div>
        <!-- 切换后排版 end -->
    </div>
`
 //添加收货地址
var addr=`
    <div class="tjddCont  ng-scope sub_btn_div" ng-if="step==1&amp;&amp;!loading">
        <!-- 切换后排版 begin -->
        <div class="tjdd_QHCont">
            <!-- 请验证手机号，使用账号登录 begin -->
            <!-- ngIf: pay.selectedItem.itemType!=2 &&(!pay.logined) -->
            <!-- 请验证手机号，使用账号登录 end -->
            <!-- 无私支持 begin -->
            <!-- ngIf: pay.selectedItem.itemType==2 -->
            <!-- 无私支持 end -->
            <!-- 实物回报 begin -->
            <div>
                <!-- ngIf: pay.selectedItem.itemType != 2 --><div ng-if="pay.selectedItem.itemType != 2" class="ng-scope">
                    <!-- ngIf: pay.logined --><div class="NumBox ng-scope" ng-if="pay.logined">
                        <span>份数</span>

                        <div class="NumInner" id="num-input">
                            <a  href="javascript:;" class="btn_ALink mui-amount-increase"></a>
                            <input type="text" value="1" max="100" target="num-input" validate="num_valid" class="mui-amount-input tb-text ng-isolate-scope ng-pristine ng-valid">
                            <a href="javascript:;" class="next btn_ALink mui-amount-decrease"></a>
                        </div>

                        <label class="error ng-binding" id="num-error" ng-bind="pay.numError"></label>
                    </div>

                   <div ng-if="pay.logined" class="ng-scope">
                        <!-- ngIf: ((pay.selectedItem.return_type == 1 || pay.selectedItem.return_type == 0 || pay.selectedItem.return_type == 4) || (pay.selectedItem.return_type == 2 && (pay.selectedItem.extra_need.user_name || pay.selectedItem.extra_need.mobile || pay.selectedItem.extra_need.email))) --><div class="shxx_h3 ng-scope" ng-if="((pay.selectedItem.return_type == 1 || pay.selectedItem.return_type == 0 || pay.selectedItem.return_type == 4) || (pay.selectedItem.return_type == 2 &amp;&amp; (pay.selectedItem.extra_need.user_name || pay.selectedItem.extra_need.mobile || pay.selectedItem.extra_need.email)))">
                            收货信息
                        </div>
                        <div class="shdzListBox ng-scope" id="shdzListBox" ng-if=" (pay.selectedItem.return_type == 1 || pay.selectedItem.return_type == 0 || pay.selectedItem.return_type == 4) ">
                     <div ng-if="address_show || addressList.length <= 1" ng-click="addAddr()" class="shdzListItem checked">
                                <i class="flag_i"></i>
                                使用新地址
                            </div>

                        </div>
                        <div class="shdzForm_swBox animate-reward ng-scope" ng-if="(pay.selectedItem.return_type == 1 || pay.selectedItem.return_type == 0 || pay.selectedItem.return_type == 4) &amp;&amp; (address.show || addressList.length == 0)">
                            <div class="tjdd_formItem clearfix">
                                <div class="tjddQHFGBox left sitePHBox" holder="">
                                    <span>
                                        <input type="text" ng-model="address.person" class="address-user-name tjdd_QHInput sitePHInput w200 ng-pristine ng-valid" placeholder="姓名">
                                    <!--<span class="placeholder" style="line-height: 20px; padding-top: 5px; left: 12px; top: 1px;">姓名</span>--></span>
                                </div>
                                <div class="tjddQHFGBox right sitePHBox" holder="">
                                    <span>
                                        <input type="text" ng-model="address.telephone" class="address-user-tel tjdd_QHInput sitePHInput w200 ng-pristine ng-valid" placeholder="手机号">
                                    <!--<span class="placeholder" style="line-height: 20px; padding-top: 5px; left: 12px; top: 1px;">手机号</span>--></span>
                                </div>
                            </div>
                            <div class="tjdd_formItem clearfix ng-isolate-scope" address="" province="address.province" city="address.city" province-selector="province_selector" city-selector="city_selector">
                                <div class="tjddSelectBox left">
                                    <select id="province_selector">
                                    <option value="">请选择</option>
                                    <!--<option value="110000">北京</option><option value="120000">天津</option><option value="130000">河北</option><option value="140000">山西</option><option value="150000">内蒙古</option><option value="210000">辽宁</option><option value="220000">吉林</option><option value="230000">黑龙江</option><option value="310000">上海</option><option value="320000">江苏</option><option value="330000">浙江</option><option value="340000">安徽</option><option value="350000">福建</option><option value="360000">江西</option><option value="370000">山东</option><option value="410000">河南</option><option value="420000">湖北</option><option value="430000">湖南</option><option value="440000">广东</option><option value="450000">广西</option><option value="460000">海南</option><option value="500000">重庆</option><option value="510000">四川</option><option value="520000">贵州</option><option value="530000">云南</option><option value="540000">西藏</option><option value="610000">陕西</option><option value="620000">甘肃</option><option value="630000">青海</option><option value="640000">宁夏</option><option value="650000">新疆</option><option value="710000">台湾</option><option value="810000">香港</option><option value="820000">澳门</option>-->
                                    </select>
                                </div>
                                <div class="tjddSelectBox right">
                                    <select id="city_selector"><option value="">请选择</option></select>
                                </div>
                            </div>
                            <div class="tjdd_formItem" holder="">
                                <div class="tjddQHFGBox sitePHBox">
                                    <span>
                                        <input type="text" ng-model="address.address" class="address-add tjdd_QHInput sitePHInput w440 ng-pristine ng-valid" placeholder="详细地址">
                                    <!--<span class="placeholder" style="line-height: 20px; padding-top: 5px; left: 12px; top: 1px;">详细地址</span>--></span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>



                <div class="shdzForm_xnBox">

                   <div class="tjdd_formItem ng-scope" ng-if="pay.selectedItem.itemType != 2 &amp;&amp; pay.logined" style="margin-top:20px;">
                        <div class="tjddQHFGBox sitePHBox" holder="">
                            <span>
                                <input ng-model="pay.memo" type="text" class="paynote tjdd_QHInput sitePHInput w440 ng-pristine ng-valid" placeholder="备注（选填，写几句鼓励的话等）">
                            <!--<span class="placeholder" style="line-height: 20px; padding-top: 5px; left: 12px; top: 1px;">备注（选填，写几句鼓励的话等）</span>--></span>
                        </div>
                    </div>
                    <p class="zj_valP ng-scope" ng-if="pay.logined || pay.selectedItem.itemType == 2">支付<span><b>¥</b><span id="sum_price" class="ng-binding">0</span></span>
                    </p>

                    <input type="button" value="提交订单" class="tjdd_submitBtn">
                </div>
            </div>

        </div>

    </div>
`





































    $.ajax({
        url: '/sso-getLibJsPms',
        type: 'get',
        dataType: 'json',
        success: function(res){

            var Cookie = {

                /**
                 * 定义一个函数，用来读取特定的cookie值。
                 * @param cookie_name
                 */
                getCookie: function (cookie_name) {
                    var allCookies = document.cookie;
                    var cookie_pos = allCookies.indexOf(cookie_name);   //索引的长度
                    if (cookie_pos != -1) {
                        cookie_pos += cookie_name.length + 1;
                        var cookie_end = allCookies.indexOf(";", cookie_pos);
                        if (cookie_end == -1) {
                            cookie_end = allCookies.length;
                        }
                        var value = unescape(allCookies.substring(cookie_pos, cookie_end));
                    }

                    return value;
                },

                setCookie: function (name, value) {
                    document.cookie = name + '=' + value;
                }

            };

            var Sso = {

                ticket: '',

                config: {

                    get_ticket: {
                        url: res.get_ticket.url,
                        params: res.get_ticket.params
                    },

                    authenticate: {
                        url: res.authenticate.url,
                        params: res.authenticate.params
                    },

                    get_authenticate_params: {
                        url: res.get_authenticate_params.url,
                        params: res.get_authenticate_params.params
                    },

                    auto_login: {
                        url: res.auto_login.url,
                        params: res.auto_login.params
                    },

                    set_ticket: {
                        url: res.set_ticket.url,
                        params: res.set_ticket.params
                    },
                    ajax_login: {
                        url: res.ajax_login.url
                    }
                }
                ,

                /**
                 *
                 */
                getTicket: function () {
                    var _this = this;
                    $.ajax({
                        type: "GET",
                        url: _this.config.get_ticket.url,
                        data: _this.config.get_ticket.params,
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function (json) {
                            if (json.ret == 0) {
                                _this.ticket = json.dat._ticket;
                                _this.setTicket(json.dat._ticket);
                            }
                            else {
                                _this.ticket = '';
//                            _this.authenticate();
                            }
                        },
                        error: function () {

                        }
                    });
                },

                /**
                 *
                 */
                setTicket: function (ticket) {
                    var _this = this;

                    $.ajax({
                        type: "POST",
                        url: _this.config.set_ticket.url,
                        data: "_ticket=" + escape(ticket),
                        dataType: "json",
                        success: function (json) {
                            if (json.ret == 0) {
                                $.ajax({
                                    type: "get",
                                    url: _this.config.ajax_login.url,
                                    dataType: 'json',
                                    success: function (json) {

                                        _this.jumpUrl(json.jump);

                                    }
                                });
                            }
                            else {
                                _this.ticket = '';
                                alert(json.msg);
                            }
                        },
                        error: function () {

                        }
                    });
                },

                /**
                 *
                 */
                authenticate: function () {

                    var _this = this;

                    $.ajax({
                        type: "GET",
                        url: _this.config.authenticate.url,
                        data: _this.config.authenticate.params,
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function (json) {
                            if (json.ret == 0) {
                                _this.ticket = json.dat._ticket;
                                _this.setTicket(json.dat._ticket);
                            }
                            else {
                                _this.ticket = '';
                                alert(json.msg);
                                _this.opts.error();
                            }
                        },
                        error: function () {

                        }
                    });

                },


                jumpUrl: function (url) {

                    if (url.length != 0)
                        window.location.href = url;
                    else
                        return false;
                },

                login: function (opts) {


                    var _this = this;
                    _this.opts = opts;

                    var username = $("[name=username]").val();
                    var password = $("[name=user_pwd]").val();

                    if($.trim(username) == ''){
                        alert('请输入用户名');
                        return;
                    };

                    if($.trim(password) == ''){
                        alert('请输入密码');
                        return;
                    }


                    //用户名 和 密码加密
                    $.ajax({
                        type: "POST",
                        url: _this.config.get_authenticate_params.url,
                        data: {username: username, password: password},
                        dataType: "json",
                        success: function (json) {

                            if (json.ret == 0) {
                                _this.config.authenticate.params = json.dat;
                                _this.authenticate();
                            }
                            else {
                                console.log("获取authenticate.params失败")
                            }

                        },
                        error: function () {

                        }
                    });


                },

                /**
                 *
                 */
                init: function () {

                    var _this = this;


                      if (!Cookie.getCookie( res.ticket_config.cookie_key )) {
                        _this.getTicket();
                      }


                    // setInterval(function () {
                    //     if (!Cookie.getCookie(res.ticket_config.cookie_key)) {
                    //         _this.getTicket();
                    //     }
                    // }, 15000);

                    $("#login-btn").bind('click', this.login);
                }
            };

            window.Sso = Sso;

            Sso.init();
        }
    });



});
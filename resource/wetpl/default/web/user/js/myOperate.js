/**
 * Created by Hongguang on 2017/8/29.
 */
// 、、、、、、、、/////////////////////////////吐丝层start/////////////////////

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

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
   function modpaypaw(){
        $("#setting-pass-box").removeClass("grayscale");
        $(".layerbg").hide();
    }
// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_2"){
	$("#we_title_2").find(".we-cont").show();
	$("#we_title_2").find(".title-img").css("transform","rotate(90deg)");
}

// 加载完获取手机号码
 $(document).ready(function() {
   var weid = localStorage.getItem("weid");
    var token = localStorage.getItem("token");
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    //更新用户信息
    var openId;
    function userInfo(data) {
        var userInfo = data.data;
        //console.log(userInfo)
        openId = userInfo.openid;
        if(!userInfo) {
            return false;
        }
        if(openId != undefined && openId != "") {
            $(".contact span").text("已绑定");
        } else {
            $(".contact span").text("未绑定");
            wxBind();
        }
        $("#img").attr('src', ApiMaterPlatQiniuDomain + userInfo.avatar);
        $(".name input").val(userInfo.real_name);
        $("#con-txt input").val(userInfo.phone);
        localStorage.setItem('phoneNum',userInfo.phone)
         $("#con-txt input").val($("#con-txt input").val().substring(0, 3) + "****" + $("#con-txt input").val().substring(7, 11));
        $(".information textarea").val(userInfo.motto);
    }
    $.ajax({
        url: USERDETAIL + '/' + localStorage.getItem('weid'),
        //url: USERDETAIL,
        success: function(data) {
            if(data.code === 200) {
                userInfo(data);
            } else {
                mess_tusi(data.message);
               // console.error(data.message);
            }
        }
    })
var wxBind = function() {
        $.ajax({
            url: WXlOGINQR,
            type: 'GET',
            success: function(data) {
                console.log(data);
                var qrUrl = data.data.loginQRUrl;
                var rand = data.data.random;
                checkOpenId(rand, qrUrl);
            },
            error: function(error) {
                console.log(error);
            }
        })
    }

 })
    var checkOpenId = function(rand, qrUrl) {
        $.ajax({
            url: OPENID + rand,
            type: 'GET',
            success: function(data) {
                console.log(data);
                var openid = data.data.openid;
                if (openid != null) {
                    $(".contact span").text("已绑定");

                } else {
                }
            },
            error: function(error) {
                console.log(error);
            }
        })
    }
////////////获取验证码、、、///////////////////////////////////////////////////

    //获取验证码
var lock = false;
var isCheckNum = false; //默认false
var count = false; //验证码倒计时

var getCheck = function(phoneNum){
    console.log('a')
    var timeout = false;
    var seconds = 60;
    lock = true;
    count = setInterval(function(){
        if (seconds > 0){
            seconds -= 1;
            $(".small_send_sms_verify").val(seconds + "秒");
        } else {
            $(".small_send_sms_verify").val("重新获取验证码");
            timeout = false;
            seconds = 60;
            lock = false;
            clearInterval(count);
        }
    }, 1000);

var phoneNum=localStorage.getItem('phoneNum')
console.log(phoneNum)
    $.ajax({
        url: CODES,
        dataType: 'json',
        type: 'post',
        data: { 'phone': phoneNum},
        success: function(data){
            isCheckNum = true;
            //console.log(data.phone);
        },
        error: function(err){
            console.log(err);
        }
    })
}



var checkNum = 0;
$(".small_send_sms_verify").click(function(){
    getCheck()
    if (!lock) {
        phoneNum = $("#con-txt input").val();
        var regexp = /^(13|14|17|15|18)/;
        var reg =  new RegExp(regexp);
        if (reg.test(phoneNum) && phoneNum.length == 11){
            getCheck();
        } else {
            mess_tusi("手机号码错误");
        }
    }
})

///////////////////////////重置密令///////////////////////
    var logBt = function(){
        var phoneNum=localStorage.getItem('phoneNum')
        checkNum = $("#con-txt1 input").val();
        newSecret = $("#con-txt2 input").val();
        reSecret = $("#con-txt3 input").val();
        if (newSecret==reSecret&&checkNum.length == 6) {
            $.ajax({
                url: UPDATESECRET,
                type: 'post',
                data: {'phone': phoneNum,'secret':newSecret,'reSecret':reSecret,'code': checkNum},
                dataType: "json",
                headers: {
                        'Token': localStorage.getItem('token')
                    },
                success: function(data){
                    console.log(data);
                    if (data.code == 200){
                            mess_tusi("密令设置成功");
                            window.location.reload();
                        } else {
                            mess_tusi(data.message);
                        }
                },
                error: function(err){
                    console.log(err);
                }
            })
        } else {
            if (!(checkNum.length == 6) || !isCheckNum) {
                mess_tusi("手机验证码错误");
                return;
            }
        }
    }

    $(".ui-button").click(function(){
        logBt();
    })
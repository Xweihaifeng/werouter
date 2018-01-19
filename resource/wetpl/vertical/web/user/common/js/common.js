function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

//判断为空
function isNull(data) {
    return (data == "" || data == undefined || data == null|| data == 'null') ? true: false;
}
var ApiMaterPlatQiniuDomain = 'http://oty3r3tmi.bkt.clouddn.com/';

//保存投票参数
var globalWeid=sessionStorage.getItem('vote_weid');
if(isNull(globalWeid)){
    //var vote_weid=getUrlParam('id');
    var vote_weid = window.location.href.split('/').pop();
    sessionStorage.setItem('vote_weid', vote_weid);
    globalWeid=sessionStorage.getItem('vote_weid');
}


var globalHost="http://apitest.wezchina.com";
//var globalHost="http://www.wezchina.org";


//判断登录投票
function taopiao(obj) {
    var item_id=$(obj).attr("value");
    var token=sessionStorage.getItem('user-token');
    //是否只在微信中投票
    var hidden_wechat = $('.hidden_wechat').attr('value');

    if(is_weixn()){
        if(isNull(token)){
            //获取来源
            var comeweid=getUrlParam("detailid");
            if(isNull(comeweid)==false){
                comeweid='voteitme/'+getUrlParam('id');
            }else{
                comeweid='vote/'+comeweid;
            }
            var openid=sessionStorage.getItem('openid');
            $.ajax({
                    url: globalHost+'/wxlogin',
                    type:'POST',
                    data:{ openid:openid,ref_url:comeweid},
                    success:function(data){
                        if(data.code==200){
                            if(isNull(data.token)==false){
                                sessionStorage.setItem('user-token', data.token);
                                $.ajax({
                                    url: globalHost+'/vote/voted',
                                    type:'POST',
                                    data:{ item_id:item_id},
                                    headers: {
                                            'Token': data.token
                                        },
                                    success:function(data){
                                       if(data.code==200){
                                            if(isNull(data.data)==false){
                                                // alert("投票成功");
                                                $('.notify').text('投票成功');
                                                $('.notify').show();
                                                setTimeout(function(){$('.notify').hide()},1500);
                                                return false;
                                            }
                                        }else{
                                            // alert(data.message);
                                           $('.notify').text(data.message);
                                           $('.notify').show();
                                           setTimeout(function(){$('.notify').hide()},1500);
                                           return false;
                                        }
                                    }
                                })
                            }
                        }
                    }
                })    
        }else{
            //微信登录成功直接投票
            $.ajaxSetup({
                    global: true,
                    dataType: 'json',
                    headers: {
                        'Token': token
                    }
                });
                $.ajax({
                url: globalHost+'/vote/voted',
                type:'POST',
                data:{ item_id:item_id},
                success:function(data){
                   if(data.code==200){
                        if(isNull(data.data)==false){
                            $('.notify').text('投票成功');
                            $('.notify').show();
                            setTimeout(function(){$('.notify').hide()},1500);
                            return false;
                        }
                    }else{
                       $('.notify').text(data.message);
                       $('.notify').show();
                       setTimeout(function(){$('.notify').hide()},1500);
                       return false;
                    }
                  }
                })
        }
    }else{
        if(hidden_wechat==1){
            $('.way').show();
            setTimeout(function(){$('.way').hide()},1500)
            return false;
        }else{
            $('.way').hide();
        }
        if(isNull(token)){
                //显示弹框
               $("#myModal2").show();
               $("#myModal2").attr("value",item_id);
        }else{
            $.ajaxSetup({
                global: true,
                dataType: 'json',
                headers: {
                    'Token': token
                }
            });
            $.ajax({
            url: globalHost+'/vote/voted',
            type:'POST',
            data:{ item_id:item_id},
            success:function(data){
               if(data.code==200){
                    if(isNull(data.data)==false){
                        // alert("投票成功");
                        $('.notify').text('投票成功');
                        $('.notify').show();
                        setTimeout(function(){$('.notify').hide()},1500);
                        return false;
                    }
                }else{
                   $('.notify').text(data.message);
                   $('.notify').show();
                   setTimeout(function(){$('.notify').hide()},1500);
                   return false;
                }
            }
            })
        }
    }
}

//是否在微信页打开跳转
function isopeninwechat(wechat) {
    var hidden_wechat = wechat;
    var pc=getUrlParam('pc');
    if(hidden_wechat==1){
        if(is_weixn()==false){
            if(isNull(pc)){
                window.location.href = "warn.html"; 
            }
        }
    }
    if(is_weixn()){
        var openidflag=sessionStorage.getItem('setopenid');
                //setopenid不为空时
                if(isNull(openidflag)==false){
                    var openid=sessionStorage.getItem('openid');
                    if(isNull(openid)){
                        openid=getUrlParam("openid");
                        sessionStorage.setItem('openid',openid);    
                    }
                }else{
                    //微信未跳转时
                     sessionStorage.setItem('setopenid', true);
                     window.location.href =encodeURI(globalHost+'/openid?url='+window.location.href);
                }
    }
}
//判断是否在微信中打开
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}


//登录发送验证码
function sendcode() {
   var phone=$("#myModal2").find("#mobile").val();
   //正则验证
    var myreg =/^1[0-9]{10}$/;
    if(myreg.test(phone))
    {
        $.ajax({
            url: globalHost+'/codes',
            type:'POST',
            data:{ phone:phone},
            success:function(data){
                if(data.code==200){
                    // alert("发送验证码成功");
                    $('.notify').text('发送验证码成功');
                    $('.notify').show();
                    setTimeout(function(){$('.notify').hide()},1500)
                }else{
                    // alert("发送验证码失败");
                    $('.notify').text('发送验证码失败');
                    $('.notify').show();
                    setTimeout(function(){$('.notify').hide()},1500)
                }
            }
        })

    }else{
        $('.notify').text('请输入正确的手机号');
        $('.notify').show();
        setTimeout(function(){$('.notify').hide()},1500)
    }
}

//登录
function logintoupiao() {
    var phone=$("#myModal2").find("#mobile").val();
    var code=$("#myModal2").find("input[ name='old_auth_code' ]").val();
    //获取来源
    var comeweid=getUrlParam("detailid");
    if(isNull(comeweid)==false){
        comeweid='voteitme/'+getUrlParam('id');
    }else{
        comeweid='vote/'+comeweid;
    }

    $.ajax({
        url: globalHost+'/login',
        type:'POST',
        data:{ phone:phone,code:code,ref_url:comeweid},
        success:function(data){
           if(data.code==200){
                if(isNull(data.token)==false){
                    //登录的toke
                    sessionStorage.setItem('user-token', data.token);
                    var item_id=$("#myModal2").attr("value");
                    $.ajax({
                    url: globalHost+'/vote/voted',
                    type:'POST',
                    data:{ item_id:item_id},
                    headers: {
                            'Token': data.token
                        },
                    success:function(data){
                       if(data.code==200){
                            if(isNull(data.data)==false){
                                // alert("投票成功");
                                $('.notify').text('投票成功');
                                $('.notify').show();
                                setTimeout(function(){$('.notify').hide()},1500)
                            }
                        }else{
                            // alert(data.message);
                           $('.notify').text(data.message);
                           $('.notify').show();
                           setTimeout(function(){$('.notify').hide()},1500)
                        }
                    }
                    })

                }
            }else{
               $('.notify').text(data.message);
               $('.notify').show();
               setTimeout(function(){$('.notify').hide()},1500)
           }

        }
    })

}

$(function() {
    $('.modal-header button').click(function(){
        $('.modal').css('display','none')
    })

	$("form").submit(function(e){
		var text = $("form").find('input[type=text]').val();
		var text = $("form").find('input[type=text]').val();
        window.location.href = "view.html?id="+globalWeid+"&keywords=" + escape(text);
        //window.location.href = "view/globalWeid/escape(text)";
        return false;
	});
	//增加浏览量
    $.ajax({
        url: globalHost+'/vote/view/'+globalWeid,
        type:'GET',
        success:function(data){

        }
    })
})





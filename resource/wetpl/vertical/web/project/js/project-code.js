/*
* @Author: Marte
* @Date:   2017-10-16 11:19:36
* @Last Modified by:   Marte
* @Last Modified time: 2017-10-17 10:41:58
*/

'use strict';
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
        },2000);
        return false;
    }

// 吐丝层end////////////////////////////////////

$(function(){
var url = window.location.pathname.split('/');
var suportid= url.pop();
console.log(suportid);
var project_suport_detail=function(suportid){
    $.ajax({
        url: PROJECT_SUPORT_DETAIL+'/' + suportid,
        type: 'get',
        success: function(data){

            if(data.code==200){
                // $(".main-h3").text(data.data.title);
             console.log(data.data)

             $('.amount').text(data.data.sum);
             $('.dcar').text(data.data.order_no);
             $('.ngdate').text(data.data.created_at);
             if(data.data.status==2){
                mess_tusi('支付成功');
                clearInterval(timer)
                window.location="/user/myproject/support";
             }else{
                wechatpay_projectsuport(suportid);
             }
            project_detail(data.data.project_id);

            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}
project_suport_detail(suportid);
var projectid=localStorage.getItem('projectid')
var project_detail=function(projectid){
    $.ajax({
        url: PROJECT_DETAIL+'/' + projectid,
        type: 'get',
        success: function(data){
            console.log(data)
            if(data.code==200){
                $(".main-h3").text(data.data.title);
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}
//微信支付接口
var timer="";
var wechatpay_projectsuport=function(suportid){
    $.ajax({
        url: WECHATPAY_PROJECTSUPORT+'/' + suportid,
        type: 'get',
        success: function(data){
            if(data.code==200){
             console.log(data.data)
               $(".dateurl").children().remove();
               $(".dateurl").append("<img src='"+QRCODE+"?url="+data.data.url+"' />")

                   timer=setInterval(function(){
                        project_suport_detail(suportid)
                    },1000);

            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}


})

/**
 * Created by Yaoer on 2017/8/6.
 */
// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_4"){
    $("#we_title_4").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_4").find(".title-img").css("transform","rotate(90deg)");
}

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

var manage_a=function(obj){
  $('#myModal').modal('show');
  $(obj).text('已确定');
  $(obj).removeClass('manage_a');
}
$('#manage_a').bind('click',function(){
    $('#myModal').modal('hide');
})
var manage_a1=function(obj){
     $('#myModal1').modal('show');
     $(obj).text('已投诉');
     $(obj).removeClass('manage_a');
}
$('#manage_a1').bind('click',function(){
    $('#myModal1').modal('hide');
})
    // var tu_sp=function(obj){

    //     $('#manage_a').removeClass('manage_a');
    //     $('#manage_a').text('已确认');
    // }
    // var en_tw=function(obj){

    //     $('#manage_a1').removeClass('manage_a');
    //     $('#manage_a1').text('已投诉');
    // }



var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

$(document).ready(function(){
    var tu_sp='';
    var index=0;
   var resupport= function (data) {
    console.log(data)
    if(data.logistics_status==2){
         tu_sp='<div class="manage_a d2"   onclick="manage_a(this)">确认收货</div>'
         en_tw='<div class="manage_a d2"  data-toggle="modal" data-target="#myModal1" onclick="manage_a1(this)">投诉</div>'
    }else if(data.repay_id==null){
        tu_sp='<div class=" d2"  >---</div>'
         en_tw='<div class="d2"  >---</div>'
    }else{
         tu_sp='<div class=" d2"  >未发货</div>'
         en_tw='<div class="d2"  >不能投诉</div>'
    }
    index++;
    var granttext="未中奖";
    if(data.is_award_grant==2){
        granttext="已中奖";
         // tu_sp='<div class="manage_a d2"   onclick="manage_a(this)">确认收货</div>'
         // en_tw='<div class="manage_a d2"  data-toggle="modal" data-target="#myModal1" onclick="manage_a1(this)">投诉</div>'
    }else{
         // tu_sp='<div class="d1"  >无收货</div>'
         // en_tw='<div class="d2">无投诉</div>'
    }
    var styletext="";
    if(data.status==1){
        styletext="未支付";

    }else if(data.status==2){
         if(data.pay_style==1){
            styletext="微信支付";
                if(data.is_award_grant==2){
                    granttext="已中奖";
                     // tu_sp='<div class="manage_a d2"   onclick="manage_a(this)">确认收货</div>'
                     // en_tw='<div class="manage_a d2"  data-toggle="modal" data-target="#myModal1" onclick="manage_a1(this)">投诉</div>'
                }else{
                     // tu_sp='<div class="d1" >无收货</div>'
                     // en_tw='<div class="d2">无投诉</div>'
                }

        }else if(data.pay_style==2){
            styletext="账户余额";
        }
    }
    console.log(data.is_takegoods)
    console.log(data.is_complaint);


    // if(data.is_takegoods==1){



    // }else if(data.is_takegoods==2){
    //     tu_sp='<a class="" href="#">已确认</a>'
    // }else{
    //     tu_sp='<a class="" href="#">无私支持</a>'
    // }
    //  var en_tw='';
    //     if(data.is_complaint==1){

    // }else if(data.is_complaint==2){
    //     en_tw='<a class="manage_a" href="#">已投诉</a>'
    // }else{
    //     en_tw='<a class="" href="#">无投诉</a>'
    // }
    var template =`
                        <tr class="bg-tr">
                           <input type="hidden" class="tu_input" value=`+JSON.stringify(data)+`/>
                           <input type="hidden" class="en_input"/>
                            <td  width="10%">`+index+`</td>
                            <td >`+data.amount+`</td>
                            <td >`+styletext+`</td>
                            <td  class=>`+tu_sp+`</td>
                            <td > `+en_tw+`</td>
                            <td >
                            <a class="manage_a" href="/user/myproject/resupportUd/`+data.weid+`">查看详情</a>
                            </td>
                        </tr>
            `
        return template;
    }

        // $(".wrap").append(template);
        // $(".backstage-wrap").after(model);

    var url = window.location.pathname.split('/');
    var projectid = url.pop();
    // projectid="f9c69ca0-ae55-11e7-b61d-05eeffdc2e38";//测试值
         // 回报列表
    var supportproject=function(projectid){
        var limit="";
        var page=1;
        var sendData={
            project_id:projectid,
            status:2,
            limit:limit,
            page:page
        }
        console.log(sendData);
        $.ajax({
            url: PROJECT_SUPORT_LIST,
            // url: PROJECT_REPAY_LIST,
            type: 'post',
            data:sendData,
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var focuslist = data.data.list;
                    $(".wrap tbody").children().remove();
                    focuslist.map(x =>{
                        $(".wrap tbody").append(resupport(x));
                    })




                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

supportproject(projectid);

 })
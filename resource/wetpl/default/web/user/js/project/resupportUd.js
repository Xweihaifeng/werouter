/**
 * Created by Yaoer on 2017/8/6.
 */


// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_4"){
    $("#we_title_4").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_4").find(".title-img").css("transform","rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

$(document).ready(function(){

   // var articleTemplate = function (data) {


        //可删除
        var template =`

       <div class="backstage-wrap wrap1120 clearfix">
    <div class="personal-center-right">
        <div class="m-ulitem">

            <div class="m-location">


                <table class="loca-table">
                    <thead>
                    <tr class="bg-tr">
                       <td class="wp10">项目详情</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="bg-tr">
                        <td class="wp10">
                           <div>
                               <p>项目分类：互助众筹</p>
                               <p>已筹金额：500</p>
                               <p>截止日期：2017.10.1</p>
                               <p>支付方式：余额支付</p>
                               <p></p>
                           </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="loca-table">
                    <thead>
                    <tr class="bg-tr">
                       <td class="wp10">回报详情</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="bg-tr">
                        <td class="wp10">
                            <p>支持类型：无私奉献</p>
                            <p>支持金额：500</p>
                            <p>支持数量：5</p>
                            <p>配送地址：美丽的院子美丽的院子美丽的院子美丽的院子</p>
                            <p>回报时间：1月</p>
                            <p>回报内容：奖励一套房子</p>
                            <p>发货时间：2017.10.1</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
                                <table class="loca-table">
                    <thead>
                    <tr class="bg-tr">
                       <td class="wp10">抽奖详情</td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="bg-tr">
                        <td class="wp10">
                            <p>是否中奖：是</p>
                        </td>
                    </tr>
                    </tbody>
                </table>



                <div class="pager">
                                    </div>

            </div>
        </div>
    </div>
</div>
        `


        //$(".wrap").append(template);
        // $(".backstage-wrap").after(model);
    var url = window.location.pathname.split('/');
    var suportid = url.pop();
    // suportid="de23fd40-af00-11e7-b2df-7b6d822bd08e";//测试值
        //初始化页面数据
    var intSuportInfo=function(){
        $.ajax({
            url: PROJECT_SUPORT_DETAIL+'/'+suportid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    var detail=data.data;
                    projecttemplate(detail);
                    if(detail.repay_id!=''){
                        repaytemplate(detail);
                    }else{
                        //清除页面元素
                        $("#repay_table").empty();
                    }

                    if(detail.is_award_join==2){
                        //参与抽奖
                        suporttemplate(detail);    
                    }else{
                        //清除页面元素
                        $("#suport_table").empty();
                    }

                    if(detail.is_complaint==2){
                        //是否有投诉
                        complainttemplate(detail);    
                    }else{
                        //清除页面元素
                        $("#complaint_table").empty();
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
    //投诉模版
    var complainttemplate=function(data){
        $("#complaint_table").children().remove();   
       
        var html='<thead>'+
                    '<tr class="bg-tr">'+
                       '<td class="wp10">投诉详情</td>'+
                    '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '<tr class="bg-tr">'+
                        '<td class="wp10">'+
                           '<div>'+
                               '<p>'+data.complaint_content+'</p>'+
                               
                           '</div>'+
                        '</td>'+
                    '</tr>'+
                    '</tbody>';
                

        $("#complaint_table").append(html);
    }
    //项目模版
    var projecttemplate=function(data){
        $("#project_table").children().remove();   
        var styletext="";
        if(data.pay_style==1){
            styletext="微信支付";
        }else if(data.pay_style==2){
            styletext="余额支付";
        }
        var html='<thead>'+
                    '<tr class="bg-tr">'+
                       '<td class="wp10">项目详情</td>'+
                    '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '<tr class="bg-tr">'+
                        '<td class="wp10">'+
                           '<div>'+
                               '<p>项目分类：'+data.cate.name+'</p>'+
                               '<p>已筹金额：'+data.project.raise_amount+'</p>'+
                               '<p>截止日期：'+data.project.date_end+'</p>'+
                               '<p>支付方式：'+styletext+'</p>'+
                               '<p></p>'+
                           '</div>'+
                        '</td>'+
                    '</tr>'+
                    '</tbody>';
                

        $("#project_table").append(html);
    }
    //回报模版
    var repaytemplate=function(data){
        
        $("#repay_table").children().remove();
            var html='<thead>'+
                '<tr class="bg-tr">'+
                   '<td class="wp10">回报详情</td>'+
                '</tr>'+
                '</thead>'+
                '<tbody>'+
                '<tr class="bg-tr">'+
                    '<td class="wp10">'+
                        '<p>支持类型：'+data.repay.title+'</p>'+
                        '<p>支持金额：'+data.sum+'</p>'+
                        '<p>支持数量：'+data.repay_copies+'</p>'+
                        '<p>配送地址：'+data.address_detail+'</p>'+
                        '<p>回报时间：'+data.repay.repay_date+'天</p>'+
                        '<p>回报内容：'+data.repay.content+'</p>'+
                        '<p>发货时间：'+data.logistics_date+'</p>'+
                    '</td>'+
                '</tr>'+
                '</tbody>';
        $("#repay_table").append(html);
        
    }
    //支持模版    
    var suporttemplate=function(data){
        var is_Winning='';
        if(data.is_award_join==2){
            if(data.is_award_grant==2){
                is_Winning='是';
            }else{
                is_Winning='否';
            }
        }
        $("#suport_table").children().remove();
            var html='<thead>'+
                    '<tr class="bg-tr">'+
                       '<td class="wp10">抽奖详情</td>'+
                    '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '<tr class="bg-tr">'+
                        '<td class="wp10">'+
                            '<p>是否中奖：'+is_Winning+'</p>'+
                        '</td>'+
                    '</tr>'+
                    '</tbody>';
        $("#suport_table").append(html);

    }

    intSuportInfo();
 })
/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
 //列表折叠
sessionStorage.listname='we-shop';
//var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
//const ApiMaterPlatQiniuDomain  = 'http://images.new.wezchina.com/';

$(document).ready(function(){
    var domNum = 0;
    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    console.log('logo:',favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:',logo);
    $('#home img').attr('src', logo);

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }
   /* var req;
    var id;
    var init = function(weid) {
        $.ajax({
            url: 'http://apitest.wezchina.com/pages/page/getDetailByUser/' + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data);

                    var bg = data.data.background;
                    var bgUser = data.data.background_user;
                    $("#img").attr("src", bg);
                    $("#img-1").attr("src", bgUser);

                    if (data.data == null) {
                        id = weid;
                        console.log('store')
                        req = store;
                    } else {
                        id = data.data.weid;
                        console.log('update')
                        req = update;
                    }

                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var weid = localStorage.getItem('weid');
    //console.log(weid)
    init(weid);*/

    var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 401) {
                    // domain = '/index';
                    localStorage.removeItem('token')
                    // window.location.href = '/login'
                }
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

    // 获取个人商城信息
    var mall_id="";
    var usermall=function(){
        $.ajax({
            url:MALL_USERDETAIL,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                        if(data.data!=null && data.data!=""){
                            mall_id=data.data.weid;
                            orderlist(mall_id,1);

                            // 筛选订单列表
                            $(".btn-filter").bind("click",function(){
                                var starttime=$("input[name='start_time']").val();
                                var endtime=$("input[name='end_time']").val();
                                var no=$("input[name='no']").val();
                            })
                        }


                }
            }
        })
    }
    usermall();
    console.log(mall_id);

    //获取订单列表
    var flag=true;
    var  orderlist=function(mall_id,page,type,dataobj){
        if(!type){
            type = 0;
        }
        if(!dataobj){
            dataobj = ''
        }
        var limit="5";
        var keywords=time_start=time_end="";
        var status=order_num="";
        if(dataobj!=""){
            // 订单号筛选
            time_start=dataobj.time_start;
            time_end=dataobj.time_end;
            order_num=dataobj.order_num;
        }
        var sendData={
            limit:limit,
            mall_id:mall_id,
            page:page,
            order_status:type,
            time_start:time_start,
            time_end:time_end,
            order_num:order_num,
            keywords:keywords
        };
        $.ajax({
            url:ORDER_LIST,
            type:'post',
            data:sendData,
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log("订单列表：",data);
                if (data.code == 200) {
                    var listdata=data.data.list;
                    $(".ordertable").children().remove();
                    listdata.map(x => {
                        $(".ordertable").append(orderlisthtml(x));
                        if(x.order_status == 8){
                            var refundDom = '';
                            var reasonTip = '无退款原因';
                            if(x.refund && x.refund.length>0 && x.refund[0].order_refund_reason){
                                reasonTip = x.refund[0].order_refund_reason;
                            }
                            refundDom =
                                '<p class="refund">' +
                                '<span></span>'+
                                '<span class="reason">'+ reasonTip +'</span>'+
                                '</p>';
                            $('#h'+x.weid+' .order').append(refundDom);
                        }
                        $('#'+x.weid).children().remove();
                        if(x.goods.length){
                            for(var i=0; i<x.goods.length; i++){
                                var freight=0;
                                if(x.goods[i].postage_status==1){
                                    freight=0;
                                }else{
                                    if(x.goods[i].postage_max_money && parseInt(x.goods[i].postage_max_money) > 0 ){
                                        if(parseFloat(x.goods[i].goods_price * x.goods[i].goods_num) < parseFloat(x.goods[i].postage_max_money)){
                                            freight = parseFloat(x.goods[i].postage * x.goods[i].goods_num);
                                        }
                                    }else{
                                        freight = parseFloat(x.goods[i].postage * x.goods[i].goods_num);
                                    }
                                }
                                var goodItem =
                                    '<tr id="'+x.weid+'">'+
                                        '<td style="width: 106px;padding-top: 8px;"><img src="'+qiniu_bucket_domain+x.goods[i].goods_cover+'" alt=""></td>'+
                                        '<td style="width: 460px;"><a href="/'+x.domain +'/wemall/goods/'+x.goods[i].goods_id+'" target="_blank">'+x.goods[i].goods_title+'</a></td>'+
                                        '<td>￥'+x.goods[i].goods_price+'<br>(运费￥'+freight+')</td>'+
                                        '<td>'+x.goods[i].goods_num+'</td>'+
                                        '<td rowspan="'+x.goods.length+'" class="price">￥'+x.order_price+'</td>'+
                                        '<td rowspan="'+x.goods.length+'" class="oper" style="width: 92px;" id="'+x.status+'">'+
                                            ' <div class="orders_list_details">'+
                                                '<a href="/user/order/detail/'+x.weid+'" target="_blank">订单详情</a>'+
                                                '<div class="status-oper"></div>'+
                                            '</div>'+
                                        '</td>'+
                                    '</tr>';
                                $('#'+x.weid).append(goodItem);
                            }
                        }
                        $('#'+x.weid+' .status-oper').children().remove();
                            var operList = [];
                            if(x.send!=''){
                                operList.push({
                                    name : '查看物流',
                                    oper : 'distribute'
                                });
                            }
                            switch (x.order_status){
                                case 2:
                                    operList.push({
                                        name : '发货',
                                        oper : 'deliver'
                                    });
                                    break;
                                case 3:
                                    break;
                                case 4:
                                    break;
                                case 5:

                                    break;
                                case 7:

                                    break;
                                case 8:
                                    operList.push({
                                        name : '确认退款',
                                        oper : 'confirmRefund'
                                    });
                                    break;
                                case 9:
                                    break;
                            }
                            if(operList.length){
                                for(var i=0;i<operList.length;i++){
                                    var operDom =
                                        '<a class="'+ operList[i].oper +'">'+operList[i].name+'</a>';
                                    $('#'+x.weid+' .status-oper').append(operDom);
                                }
                            }
                    })
                    var pagenum=Math.ceil(data.data.total/limit);
                    // console.log(page+":page");
                    var pagestr="";
                    if(flag){
                        $('.pagination').children().remove();
                        $('.pagination').append('<li id="prev"><a href="javascript:void(0);">«</a></li><li class="active"><span>1</span></li>');

                        for(i=1;i<pagenum;i++){
                            // $('.pagination').append(pagelisthtml(i));
                            pagestr+='<li><a href="javascript:void(0)" id="'+(i+1)+'">'+(i+1)+'</a></li>';

                        }
                        $('.pagination').append(pagestr);
                        $(".pagination").append('<li id="next"><a href="javascript:void(0)" class="next" rel="next">&raquo;</a></li>');
                        // 点击页码事件
                        $(".pagination li").bind("click",function(){
                            flag=false;
                            // console.log($(this).attr("id"));
                            if($(this).attr('class')!="active"){
                                var prevactive=parseInt($(this).parent().find('.active span').text());
                                var curr=$(this).find('a').text();
                                if($(this).attr("id")=="prev"){
                                     if(prevactive>1){
                                         $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                        $(this).parent().find('.active').prev().append('<span>'+(prevactive-1)+'</span>').find('a').remove();
                                        $(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
                                        orderlist(mall_id,prevactive-1,type);
                                    }
                                }else if($(this).attr("id")=="next"){
                                    if(prevactive<pagenum){
                                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                        $(this).parent().find('.active').next().append('<span>'+(prevactive+1)+'</span>').find('a').remove();
                                        $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                                        orderlist(mall_id,prevactive+1,type);

                                    }

                                }else{
                                    orderlist(mall_id,$(this).find("a").text(),type);
                                    $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                    $(this).addClass("active").siblings().removeClass('active');
                                    $(this).append('<span>'+curr+'</span>').find('a').remove();
                                }

                            }


                        })
                    }
                     // 1acc8080-769f-11e7-afe9-a1e618177dd9
                    __init(localStorage.getItem("weid"));
                    // __init("1acc8080-769f-11e7-afe9-a1e618177dd9");
                    sendshop();
                }
            }
        })
    }
    // 页码列表模板
    var pagelisthtml=function(num){
        var pagehtml='<li>'+
                        '<a href="javascript:void(0)" id="'+num+'">'+num+'</a>'+
                    '</li>';
        return pagelisthtml;
    }
    //订单列表模板
    var status_pay="";
    var orderlisthtml=function(data){
        switch (data.order_status){
            case 1:
                status_pay = '已下单';
                break;
            case 2:
                status_pay = '已付款';
                break;
            case 3:
                status_pay = '已发货';
                break;
            case 4:
                status_pay = '已收货';
                break;
            case 5:
                status_pay = '已评价';
                break;
            case 6:
                status_pay = '已取消';
                break;
            case 7:
                status_pay = '已完成';
                break;
            case 8:
                status_pay = '已申请退款';
                break;
            case 9:
                status_pay = '已确认退款';
                break;
        }
        /*var listhtml='<tr id="'+data.weid+'">'+
                '<td>'+data.order_num+'</td>'+
                '<td>'+data.username+'</td>'+
                '<td>'+data.goods_title+'</td>'+
                '<td>'+data.goods_num+'</td>'+
                '<td>'+data.order_price+'</td>'+
                '<td>'+data.address_detail+'</td>'+
                '<td class="log_company">'+log_company+'</td>'+
                '<td class="log_num">'+log_num+'</td>'+
                '<td class="status_pay" id="'+data.status+'"">'+status_pay+' </td>'+
                '<td class="btn-sendgoods">'+sendgoods+'</td>'+
            '</tr>';
*/
        var listhtml=
            '<table>'+
                '<thead>'+
                    '<tr id="h'+data.weid+'">'+
                        '<th>'+data.created_at.substring(0,data.created_at.indexOf(" "))+'</th>'+
                        '<th class="order" colspan="3">' +
                            '订单号:'+data.order_num+'<a style="margin-left:10px">'+ status_pay+'</a>' +
                        '</th>'+
                        '<th style="text-align: right" colspan="2">'+
                            '<div class="contact_seller" data-mobile="18966700695" onmouseover="$(this).find(\'span\').show();" onmouseout="$(this).find(\'span\').hide();">'+
                                '<i></i>联系买家'+
                                '<span style="display: none;">联系电话：'+data.phone+'</span>'+
                            '</div>'+
                        '</th>'+
                    '</tr>'+
                '</thead>'+
                '<tbody class="list-dom" id="'+data.weid+'">'+
                '</tbody>'+
            '</table>';
        // var listhtml='<table class="orders_list_title">'+
        //                 '<tbody>'+
        //                 '<tr class="orders_list_msg">'+
        //                     '<td class="list_left" colspan="3">'+
        //                         '<span class="list_left_date">'+data.created_at+'</span>'+
        //                         '<span class="list_left_num">订单号:<em>'+data.order_num+'</em></span>'+
        //                     '</td>'+
        //                     '<td class="list_right" colspan="2" align="right">'+
        //                         '<div class="contact_seller" data-mobile="18966700695" onmouseover="$(this).find(\'span\').show();" onmouseout="$(this).find(\'span\').hide();">'+
        //                             '<i></i>联系买家'+
        //                             '<span style="display: none;">联系电话：'+data.phone+'</span>'+
        //                         '</div>'+
        //                     '</td>'+
        //                 '</tr>'+
        //             '</tbody>'+
        //             '</table>';
        // if(data.goods.length){
        //     for(var i=0; i<data.goods.length; i++){
        //         var goodItem =
        //             '<tr class="orders_list_content" id="'+data.weid+'">'+
        //                 ' <td width="40%">'+
        //                     '<div class="orders_list_pic">'+
        //                         '<a href="wemall/goods/'+data.goods[i].goods_id+'" target="_blank">'+
        //                             '<img class="img" src="'+qiniu_bucket_domain+data.goods[i].goods_cover+'" alt="">'+
        //                             '<p class="txt">'+data.goods[i].goods_title+'</p>'+
        //                         '</a>'+
        //                     '</div>'+
        //                 '</td>'+
        //                 '<td width="10%">'+
        //                     '<div class="orders_list_buy">'+
        //                         '<span>x'+data.goods[i].goods_num+'</span>'+
        //                     '</div>'+
        //                 '</td>'+
        //                 '<td width="15%">'+
        //                     '<div class="orders_list_buy">'+
        //                         '<span class="list_right_gj"><p>￥'+data.order_price+'</p><p>(含运费:0.00)</p></span>'+
        //                     '</div>'+
        //                 '</td>'+
        //                 '<td width="25%">'+
        //                     '<div class="orders_list_addr">'+
        //                         '<p>'+data.username+'<em>'+data.phone+'</em></p>'+
        //                         '<p>'+data.address_detail+'</p>'+
        //                         '<p>备注:<span>'+data.note+'</span></p>'+
        //                     '</div>'+
        //                 '</td>'+
        //                 '<td width="10%" class="status_pay" id="'+data.status+'"">'+
        //                     ' <div class="orders_list_details">'+
        //                         '<a href="/user/order/detail/'+data.weid+'" target="_blank">订单详情</a>'+
        //                         '<div class="orderstatus">'+ sendgoods+'</div>'+
        //                     '</div>'+
        //                 '</td>'+
        //             '</tr>'
        //     }
        //
        //
        // }
        return listhtml;
    }
  // var selectorder=function(){
    $(".btn-select").bind("click",function(){
        flag=true;
        $(this).closest("li").addClass("current").siblings().removeClass("current");
        var statusid=$(this).data("id");
        if(statusid==0){
            $("input[name='start_time']").val("");
            $("input[name='end_time']").val("");
            $("input[name='no']").val("");
        }
        var time_start=$("input[name='start_time']").val();
        var time_end=$("input[name='end_time']").val();
        var order_num=$("input[name='no']").val();

        orderlist(mall_id,1,statusid,{time_start:time_start,time_end:time_end,order_num:order_num});
    })
// }
    $(".btn-num").bind("click",function(){
        flag=true;
        var time_start=$("input[name='start_time']").val();
        var time_end=$("input[name='end_time']").val();
        var order_num=$("input[name='no']").val();
        var statusid=$(".current .btn-select").data("id");
        console.log(statusid);

        orderlist(mall_id,1,statusid,{time_start:time_start,time_end:time_end,order_num:order_num});


    })


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
    var sendshop=function(){
        var orderid="";
        $(".deliver").bind("click",function(){
            console.log($(this));
            $(".deliver").attr('data-toggle','modal');
            $(".deliver").attr('data-target','#myModal');
            orderid=$(this).closest('tr').attr("id");
            $("#myModal_input").val(orderid);
            var status_pay=$(this).closest('tr').attr("id");
                console.log(orderid);
            $(".imgContainer").children().remove();
            $.ajax({
                url : apiUrl + 'order/detail/' + orderid,
                type : 'get',
                headers : {
                    'Token' : localStorage.getItem('token')
                },
                dataType : 'json',
                success : function (res) {
                    console.log("订单详情：",res);
                    if(res.code == 200){
                        var goods = res.data.goods;
                        for(var i=0; i<goods.length; i++){
                            var imgDom =
                                '<div style="display: inline-block;"><img weid="'+goods[i].weid+'" src="'+qiniu_bucket_domain + goods[i].goods_cover+'"><span style="display:block;margin-right: 10px;text-align: center;">'+goods[i].goods_title+'</span></div>';
                            $(".imgContainer").append(imgDom)
                        }
                        $(".dynamic-dom").attr("id",domNum);
                        operFormDom();

                    }
                }
            })
                $.ajax({
                    url : apiUrl + 'pages/logistics/lists',
                    type : 'post',
                    data : {
                        'user_id' : localStorage.getItem('weid'),
                        'status' : 1
                    },
                    headers : {
                        "Token" : localStorage.getItem('token')
                    },
                    dataType : 'json',
                    success : function (res) {
                        console.log("物流列表：",res)
                        if(res.data && res.code===200){
                            var optionList = res.data.list;
                            $('#exampleInputEmail1').children().remove();
                            for(var i=0; i<optionList.length; i++){
                                var optionDom =
                                    '<option value='+ optionList[i].logistics_id +'>'+optionList[i].logistics_company+'</option>';
                                $('#exampleInputEmail1').append(optionDom)
                            }
                            company(orderid,status_pay);
                        }
                    }
                })
        closeSendModel()
        })

        $(".confirmRefund").bind("click",function () {
            var orderId = $(this).closest('tr').attr("id");
            console.log(orderId)
            $.ajax({
                url : apiUrl + '/pages/wechatPay/orderPayRefund',
                type : 'post',
                data : {
                    order_id : orderId
                },
                headers: {
                    'Token': localStorage.getItem('token')
                },
                dataType: 'json',
                success : function (data) {
                    console.log(data);
                    if(data.code===200){
                        layer.msg(data.data);
                        setTimeout(function() {window.location.reload();},1500);
                    }else{
                        layer.msg('退款失败  ' + data.message);
                    }
                }
            })
        })

        $(".distribute").bind('click',function () {
            $('.comment_mongolia_layer, .comment_bomb_box').fadeIn("slow");
            $('.comment_bomb_box_content').text('正在加载...')
            $('.comment_bomb_box_content .goodImg').children().remove();
            $('.comment_bomb_box_content .detail').children().remove();
            var orderId = $(this).closest('tr').attr("id");
            $.ajax({
                url : apiUrl + 'order/detail/'+orderId,
                type : 'get',
                headers : {
                    "Token": localStorage.getItem('token')
                },
                dataType : 'json',
                success : function (data) {
                    console.log("订单详情：",data);
                    $('.comment_bomb_box_content').text('');
                    $('.comment_bomb_box_content').children().remove();
                    if(data.data.send && data.data.send.length > 0){
                        var sendList = data.data.send;
                        var goodsList = data.data.goods;
                        for(var i=0; i<sendList.length; i++){

                            var domGroup =
                                '<div class="send-group" id="group'+i+'" no="'+sendList[i].logistics_no+'" code="'+sendList[i].logistics_company_code+'">' +
                                    '<div class="goodImg"></div>' +
                                    '<div class="detail"></div>' +
                                '</div>';


                            $('.comment_bomb_box_content').append(domGroup);
                            if(sendList[i].order_goods_id){
                                var goodsSendGroup = sendList[i].order_goods_id.split(',');
                                for(var a=0; a<goodsList.length; a++){
                                    for(var good = 0; good<goodsSendGroup.length; good++){
                                        if(goodsList[a].weid == goodsSendGroup[good]){
                                            var imgDom =
                                                '<div style="text-align: center;">' +
                                                    '<img src="'+qiniu_bucket_domain+goodsList[a].goods_cover+'">'+
                                                    '<span>'+goodsList[a].goods_title+'</span>'+
                                                '</div>';

                                            $('#group'+i+' .goodImg').append(imgDom);
                                        }
                                    }
                                }
                            }

                            $('#group'+i+' .detail').text('正在加载，请稍候...');
                            if(sendList[i].logistics_info){
                                //字符串转json
                                var logistics_info=$.parseJSON(sendList[i].logistics_info);
                                for(var j=0; j<logistics_info.data.length;j++){
                                    var dom =
                                        '<p>' +
                                        '<i></i>'+
                                        '<span class="time">'+logistics_info.data[j].time+'</span>' +
                                        '<span class="content">'+logistics_info.data[j].context+'</span>'+
                                        '</p>';
                                    $('#group'+i+' .detail').append(dom);
                                }
                            }
                        }
                        if(sendList[0].logistics_info){
                            getDistributionInfo();
                        }
                    }


                }
            })

        closeModel();
        })
    }
    var getDistributionInfo = function () {

        $('.send-group').each(function (ind, ele) {
            var no = $(ele).attr('no');
            var code = $(ele).attr('code');

            $.ajax({
                url : apiUrl + 'pages/logistics/getLogisticsInfo',
                type : 'post',
                data : {
                    logistics_NO : no,
                    company_code : code
                },
                headers : {
                    "Token": localStorage.getItem('token')
                },
                dataType : 'json',
                success : function (res) {
                    console.log("根据订单详情查看物流信息",res);
                    $('#group'+ind+' .detail').text('')
                    if(res.code === 200){
                        var logistList = res.data.data;
                        for(var i=0; i<logistList.length;i++){
                            var dom =
                                '<p>' +
                                '<i></i>'+
                                '<span class="time">'+logistList[i].time+'</span>' +
                                '<span class="content">'+logistList[i].context+'</span>'+
                                '</p>';
                            $('#group'+ind+' .detail').append(dom)
                        }
                    }else{
                        $('#group'+ind+' .detail').text('加载失败')
                    }

                }
            })

        })

    }
    var closeSendModel = function () {
        $('.sendModal .close').click(function(){
            window.location.reload()
        })
    }
    var operFormDom = function () {
        var oper =
            '<span id="addDom"> 添加+ </span>' +
            '<span id="removeDom"> 删除- </span>';
        var imgInfo = [];
        var noSelectImgInfo = [];
        $(".imgContainer img").click(function () {
            if($(this).hasClass('has-border')){
                $(this).removeClass('has-border');
            }else{
                $(this).addClass('has-border');
            }
            $(".dynamic-dom").eq(domNum).find($(".imgContainer img")).each(function (ind,item) {
                var obj = {};
                if($(item).hasClass('has-border')){
                    var isHas = imgInfo.filter(function(i){return i == $(item).attr('weid')})
                    if(!isHas.length){
                        imgInfo.push($(item).attr('weid'))
                    }
                    for(var i=0; i<noSelectImgInfo.length; i++){
                        if(noSelectImgInfo[i].weid == $(item).attr('weid') && noSelectImgInfo[i].src == $(item).attr('src')){
                            noSelectImgInfo.splice(i,1)
                        }
                    }

                }else{
                    var equal = false;
                    for(var i=0; i<noSelectImgInfo.length; i++){
                        if(noSelectImgInfo[i].weid == $(item).attr('weid') && noSelectImgInfo[i].src == $(item).attr('src')){
                            equal = true;
                        }
                    }
                    if(!equal){
                        obj.weid = $(item).attr('weid');
                        obj.src = $(item).attr('src');
                        noSelectImgInfo.push(obj);
                    }

                    for(var i=0; i<imgInfo.length; i++){
                        if(imgInfo[i] == $(item).attr('weid')){
                            imgInfo.splice(i,1)
                        }
                    }

                }
            });
            console.log(imgInfo,noSelectImgInfo)
            $(".dynamic-dom").eq(domNum).attr('weid',imgInfo.join(','));
        });

        $("#addDom").click(function () {
            var hasCheck = false;
            $(".dynamic-dom").eq(domNum).find($(".imgContainer img")).each(function (ind, item) {
                if($(item).hasClass('has-border')){
                    hasCheck = true
                }
            })
            if(!hasCheck){
                layer.msg('请先选择要发货的商品');
                return
            }
            if(!$(".dynamic-dom").eq(domNum).find($("input[name=wuliu_card]")).val()){
                layer.msg('请填写物流编号');
                return
            }
            if(!noSelectImgInfo.length){
                layer.msg('没有可选择的商品');
                return;
            }
            $(".dynamic-dom").eq(domNum).find($('#addDom')).remove();
            $(".dynamic-dom").eq(domNum).find($('#removeDom')).remove();
            $(".dynamic-dom").eq(domNum).after($(".dynamic-dom").eq(domNum).clone(true).attr("id",domNum+1).append(oper));
            $(".dynamic-dom").eq(domNum).find($(".imgContainer img")).each(function (ind, item) {
                if(!$(item).hasClass('has-border')){
                    $(item).remove()
                }
            });
            domNum +=1;
            $(".dynamic-dom").eq(domNum).find($("input[name=wuliu_card]")).val('');
            $(".dynamic-dom").eq(domNum).find($(".imgContainer")).children().remove();
            for(var i = 0; i < noSelectImgInfo.length; i++){
                var imgDom =
                    '<img weid="'+noSelectImgInfo[i].weid+'" src="'+noSelectImgInfo[i].src+'">';
                $(".dynamic-dom").eq(domNum).find($(".imgContainer")).append(imgDom)
            }
            operFormDom()
        });
        $("#removeDom").click(function () {
            var reduceImg = $(".dynamic-dom").eq(domNum).find($(".imgContainer")).children()
            domNum -=1;
            $(this).parent().remove();
            if(domNum === 0){
                $(".dynamic-dom").eq(0).append('<span id="addDom"> 添加+ </span>');
            }else{
                $(".dynamic-dom").eq(domNum).append(oper);
            }
            $(".dynamic-dom").eq(domNum).find($(".imgContainer")).append(reduceImg);
            $(".dynamic-dom").eq(domNum).removeAttr('weid')
            $(".dynamic-dom").eq(domNum).find($(".imgContainer img")).each(function (ind, item) {
                $(item).removeClass('has-border')
            })
            operFormDom()
        })

    }
    var closeModel = function () {
        $('.comment_bomb_box_close').click(function () {
            $('.comment_mongolia_layer, .comment_bomb_box').fadeOut("slow");
        });
        $(".comment_mongolia_layer").click(function () {
            $('.comment_mongolia_layer, .comment_bomb_box').fadeOut("slow");
        })
    }
    // 填写物流公司
    var company=function(orderid,status_pay){
        $('.save').bind('click', function() {
            var checkNoSelect = false;
            var checkEmpty = false;
            $('.dynamic-dom').each(function (ind, item) {
                if(!$(item).find($("input[name=wuliu_card]")).val()){
                    checkEmpty = true;
                }
                $(item).find($(".imgContainer img")).each(function (ind, img) {
                    if(!$(img).hasClass('has-border')){
                        checkNoSelect = true
                    }
                })
            })

            if(checkNoSelect){
                layer.msg('请选择发货商品');
                return
            }

            if(checkEmpty){
                layer.msg('请完善物流单号信息')
                return
            }

            var sendList = [];
            $(".dynamic-dom").each(function (ind, elem) {
                var obj = {}
                obj.logistics_id = $(elem).find($("select[name=wuliu_company]")).val();
                obj.logistics_no = $(elem).find($("input[name=wuliu_card]")).val();
                obj.order_goods_id = $(elem).attr('weid');
                sendList.push(obj)
            })
            var id = $("#myModal_input").val();
            // var l_status=2;
            // var a = csrf.csrfToken;
            var sendData={
                order_id:id,
                logistics_list : sendList
            }
            $.ajax({
                url: apiUrl + 'order/send',
                type:'post',
                data:sendData,
                headers: {
                        'Token': localStorage.getItem('token')
                    },
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    if (data.code == 200) {
                        layer.msg("发货成功");
                        $('#myModal').modal('hide');
                        window.location.reload();
                    }else {
                        layer.msg(data.message);
                    }
                }
            })

        });
    }


   //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css({
                "line-height": "65px",
                "padding-top": "10px"
            });
            $("#" + id + " .word").css("margin-top", "-35px");
        } else {
            if (!isLogin) {
                $(this).css({
                    "line-height": "65px",
                });
                // $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })

        //获取通用用户信息
    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    console.log(weid)
                    if (info.avatar != "") {
                        $("#head-icon, .user-head").css({
                            "background": "url(" +qiniu_bucket_domain+ info.avatar + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        $("#head-icon, .user-head").css({
                            "background": "url(/common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

                    $(".line-0").html(
                        info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".line-1").text(info.motto);
                    $(".user-cnt").text(info.nickname);
                    artCount(weid);
                    //artTypeList(weid);
                    catesfun(weid);

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

     //个性域名用户weid
    var userId;
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
                        console.log('userDetail');
                        console.log($(".orders_list_pic a").attr("href"));
                        $(".orders_list_pic a").each(function(){
                            $(this).attr("href","/"+data.data.domain+"/"+$(this).attr("href"));
                        })
                        $(".orders_list_details a").each(function(){
                            // $(this).attr("href","/"+data.data.domain+"/"+$(this).attr("href"));

                        })
                        // getUserInfo(USERDETAIL, "/" + userId);
                    } else {
                        $(".orders_list_pic a").each(function(){
                            $(this).attr("href","/index/"+$(this).attr("href"));
                        })
                        /*$(".orders_list_details a").each(function(){
                            $(this).attr("href","/index/"+$(this).attr("href"));

                        })*/
                    }
                } else {
                    window.location.href = "/*";
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

})
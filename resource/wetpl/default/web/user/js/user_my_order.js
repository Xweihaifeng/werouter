/**
 * Created by weifeng on 2017/8/29.
 */


var domain,
    weid = window.localStorage.getItem('weid'),
    token = window.localStorage.getItem("token");

//  登录token参数
if(token) {
    $.ajaxSetup({
        global: true,
        async:  false,
        headers: {
            'Token': token,
        }
    });
}



var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;

$(function () {
    var domNum = 0;
    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);
    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    $('#home img').attr('src', logo);

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

    var flag=true;
    var  orderlist=function (userid,page,type,dataobj) {
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
            plat_user_id:userid,
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
                if (data.code == 200) {
                    var listdata = data.data.list;
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
                                    '<tr id="'+x.weid+'" domain="'+x.domain+'">'+
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
                    if(!isNull(x.send)){
                        operList.push({
                            name : '查看物流',
                            oper : 'distribute'
                        })
                    }
                    switch (x.order_status){
                        case 1:
                            operList.push({
                                name : '付款',
                                oper : 'pay_order_operation',
                            });
                            operList.push({
                                name : '取消订单',
                                oper : 'cancel_order_operation',
                            });
                            break;
                        case 2:
                            break;
                        case 3:
                            operList.push({
                                name : '确认收货',
                                oper : 'take_delivery_operation',
                            });
                            break;
                        case 4:
                            operList.push({
                                name : '评论',
                                oper : 'goods_comment',
                            });
                            operList.push({
                                name : '确定交易',
                                oper : 'transaction_completion_operation',
                            });
                            operList.push({
                                name : '申请退款',
                                oper : 'apply_refund_operation',
                            });
                            break;
                        case 5:
                            break;
                        case 6:
                            operList.push({
                                name : '删除订单',
                                oper : 'delete_order_operation',
                            });
                            break;
                        case 7:
                            operList.push({
                                name : '删除订单',
                                oper : 'delete_order_operation',
                            });
                            break;
                        case 8:
                            break;
                        case 9:
                            operList.push({
                                name : '删除订单',
                                oper : 'delete_order_operation',
                            });
                            break;
                    }
                    if(operList.length){
                        for(var i=0;i<operList.length;i++){
                            var operDom =
                                '<a class="'+ operList[i].oper +'">'+operList[i].name+'</a>';
                            $('#'+x.weid+' .status-oper').append(operDom);

                        }
                    }

                    });
                    var pagenum=Math.ceil(data.data.total/limit);
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
                            if($(this).attr('class')!="active"){
                                var prevactive=parseInt($(this).parent().find('.active span').text());
                                var curr=$(this).find('a').text();
                                if($(this).attr("id")=="prev"){
                                    if(prevactive>1){
                                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                        $(this).parent().find('.active').prev().append('<span>'+(prevactive-1)+'</span>').find('a').remove();
                                        $(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
                                        var time_start=$("input[name='start_time']").val();
                                        var time_end=$("input[name='end_time']").val();
                                        var order_num=$("input[name='no']").val();
                                        orderlist(userId,prevactive-1,type,{time_start:time_start,time_end:time_end,order_num:order_num});
                                    }
                                }else if($(this).attr("id")=="next"){
                                    if(prevactive<pagenum){
                                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                        $(this).parent().find('.active').next().append('<span>'+(prevactive+1)+'</span>').find('a').remove();
                                        $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');

                                        var time_start=$("input[name='start_time']").val();
                                        var time_end=$("input[name='end_time']").val();
                                        var order_num=$("input[name='no']").val();
                                        orderlist(userId,prevactive+1,type,{time_start:time_start,time_end:time_end,order_num:order_num});

                                    }

                                }else{
                                    var time_start=$("input[name='start_time']").val();
                                    var time_end=$("input[name='end_time']").val();
                                    var order_num=$("input[name='no']").val();
                                    orderlist(userId,$(this).find("a").text(),type,{time_start:time_start,time_end:time_end,order_num:order_num});
                                    $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                    $(this).addClass("active").siblings().removeClass('active');
                                    $(this).append('<span>'+curr+'</span>').find('a').remove();
                                }

                            }


                        })

                    }
                    InitOperation();
                }

            }
        });


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
            '<i></i>联系卖家'+
            '<span style="display: none;">联系电话：'+data.mallPhone+'</span>'+
            '</div>'+
            '</th>'+
            '</tr>'+
            '</thead>'+
            '<tbody class="list-dom" id="'+data.weid+'">'+
            '</tbody>'+
            '</table>';
        return listhtml;
    }
    //安分类搜索
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
        orderlist(userId,1,statusid,{time_start:time_start,time_end:time_end,order_num:order_num});
    });
    //点击按钮搜索
    $(".btn-num").bind("click",function(){
        flag=true;
        var time_start=$("input[name='start_time']").val();
        var time_end=$("input[name='end_time']").val();
        var order_num=$("input[name='no']").val();
        var statusid=$(".current .btn-select").data("id");
        orderlist(userId,1,statusid,{time_start:time_start,time_end:time_end,order_num:order_num});
    });

    //查看物流
    var InitOperation=function () {
        //物流信息
        if ($(".distribute")){
            $(".distribute").bind('click',function () {
                $('.comment_mongolia_layer, .comment_bomb_box').fadeIn("slow");
                $('.comment_bomb_box_title').text("物流信息");
                $('.comment_bomb_box_content').text('正在加载...')
                $('.comment_bomb_box_content .goodImg').children().remove();
                $('.comment_bomb_box_content .detail').children().remove();
                $('.comment_bomb_box_footer').empty();
                var orderId = $(this).closest('tr').attr("id");
                $.ajax({
                    url : apiUrl + 'order/detail/'+orderId,
                    type : 'get',
                    headers : {
                        "Token": localStorage.getItem('token')
                    },
                    dataType : 'json',
                    success : function (data) {
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

                                //$('#group'+i+' .detail').text('正在加载，请稍候...');
                                if(!isNull(sendList[i].logistics_info)){
                                    $('#group'+i+' .detail').text('');
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
                            getDistributionInfo();

                        }


                    }
                })
                closeModel();
            });
        }

        //去支付
        if ($(".pay_order_operation")) {
            $(".pay_order_operation").unbind();
            $(".pay_order_operation").bind('click', function () {
                var orderId = $(this).closest('tr').attr("id");
                var order_domain = $(this).closest('tr').attr("domain");
                $.ajax({
                    url: apiUrl + 'pages/wechatPay/mallOrderPcPay',
                    type: 'post',
                    data: {"order_id": orderId},
                    headers: {
                        'Token': localStorage.getItem('token')
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.code == 200) {
                            //去支付
                            window.open("/" + order_domain + "/wemall/pay/" + orderId + "");
                        } else {
                            if(data.message=='201 商户订单号重复'){
                                layer.msg("此订订单通过手机端下单请去手机端支付", {
                                    time: 2500
                                });
                            }else{
                                layer.msg(data.message, {
                                    time: 1500
                                });
                            }
                        }
                    },
                    error: function (xhr) {
                        console.log(xhr);
                    }
                })
            })
        }

        //确收货
        if ($(".take_delivery_operation")){
            $(".take_delivery_operation").bind('click',function () {
                var orderId = $(this).closest('tr').attr("id");
                $('.comment_mongolia_layer, .comment_bomb_box').fadeIn("slow");
                $('.comment_bomb_box_title').text("确收货");
                $('.comment_bomb_box_content').text('请务必保证所有商品都收到货后确认收货否则订单数据将不全！')
                $('.comment_bomb_box_content .goodImg').children().remove();
                $('.comment_bomb_box_content .detail').children().remove();
                $('.comment_bomb_box_footer').empty();
                $('.comment_bomb_box_footer').append('<button class="comment_save" id="take_'+orderId+'"> 确认 </button>');
                $("#take_"+orderId).unbind();
                $("#take_"+orderId).bind('click',function () {
                    $("#take_"+orderId).attr("disabled","true");
                    $.ajax({
                        url : apiUrl + 'order/take',
                        type : 'post',
                        data:{order_id:orderId},
                        headers : {
                            "Token": localStorage.getItem('token')
                        },
                        dataType : 'json',
                        success : function (data) {
                            if(data.code === 200){
                                reloadOperation(orderId,"确收货成功");
                                $("#take_"+orderId).attr("disabled","false");
                                $('.comment_mongolia_layer, .comment_bomb_box').fadeOut("slow");
                            }else{
                                $("#take_"+orderId).attr("disabled","false");
                                layer.msg(data.message, {
                                    time: 1500
                                });
                            }
                        }
                    });
                });
                closeModel();

            });
        }

        //申请退款
        if ($(".apply_refund_operation")){
            $(".apply_refund_operation").bind('click',function () {

                var orderId = $(this).closest('tr').attr("id");
                $('.comment_mongolia_layer, .comment_bomb_box').fadeIn("slow");
                $('.comment_bomb_box_title').text("申请退款");
                $('.comment_bomb_box_content').empty();
                $('.comment_bomb_box_content').append('<div class="comment_bomb_box_group"><div class="comment_bomb_box_name"> 退款原因： </div><div class="comment_bomb_box_input"><textarea class="bomb_box_textarea" cols="52" maxlength="52" rows="3" name="textarea"></textarea></div></div>');
                $('.comment_bomb_box_footer').empty();
                $('.comment_bomb_box_footer').append('<button class="comment_save" id="refund_'+orderId+'"> 确认 </button>');
                $("#refund_"+orderId).unbind();
                $("#refund_"+orderId).bind('click',function () {
                    $("#refund_"+orderId).attr("disabled","true");
                    var reason=$("textarea[name=textarea]").val();
                    $.ajax({
                        url : apiUrl + 'order/refund',
                        type : 'post',
                        data:{order_id:orderId,reason:reason},
                        headers : {
                            "Token": localStorage.getItem('token')
                        },
                        dataType : 'json',
                        success : function (data) {
                            if(data.code === 200){
                                reloadOperation(orderId,"申请退款成功");
                                $("#refund_"+orderId).attr("disabled","false");
                                $('.comment_mongolia_layer, .comment_bomb_box').fadeOut("slow");
                            }else{
                                $("#refund_"+orderId).attr("disabled","false");
                                layer.msg(data.message, {
                                    time: 1500
                                });
                            }
                        }
                    });
                });
                closeModel();
            });
        }

        //评论商品
        if ($(".goods_comment")) {
            $(".goods_comment").bind('click', function () {
                var orderId = $(this).closest('tr').attr("id");
                $('.comment_mongolia_layer, .comment_bomb_box').fadeIn("slow");
                $('.comment_bomb_box_title').text("商品评论");
                $('.comment_bomb_box_content').empty();
                //循环商品评论列表
                createCommentHtml(orderId);
                $('.comment_bomb_box_footer').empty();
                $('.comment_bomb_box_footer').append('<button class="comment_save" id="comment_' + orderId + '"> 确认 </button>');
                $("#comment_" + orderId).unbind();
                $("#comment_" + orderId).bind('click', function () {
                    //$("#comment_" + orderId).attr("disabled", "true");
                    //组织数组
                    var data = new Array();
                    $(".goods_comment_list").each(function (ind, ele) {
                        var goods_id = $(ele).find(".goodImg").find("img").attr("goodsweid");
                        var pictures = new Array();
                        $(ele).find(".progressContainer").each(function (PicInd, PicEle) {
                            var value = $(PicEle).find(".filesname").attr("value");
                            pictures.push(value);
                        });
                        var content = $(ele).find(".comment_bomb_box_group").find(".bomb_box_textarea").val();
                        data.push({
                            'goods_id': goods_id,
                            'pictures': pictures,
                            'order_id': orderId,
                            'content': content
                        })
                    })
                    if(!isNull(data)){
                        for (var a = 0; a < data.length; a++){
                            if(isNull(data[a].content)){
                                layer.msg("评论内容不能为空", {
                                    time: 1500
                                });
                                return false;
                            }
                        }
                    }
                    $.ajax({
                        url: apiUrl + 'goods/comment/store',
                        type: 'post',
                        data: {
                            order_id: orderId,
                            data: JSON.parse(JSON.stringify(data))
                        },
                        headers: {
                            "Token": localStorage.getItem('token')
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.code === 200) {
                                reloadOperation(orderId, "评论商品成功");
                                $("#comment_" + orderId).attr("disabled", "false");
                                $('.comment_mongolia_layer, .comment_bomb_box').fadeOut("slow");
                            } else {
                                $("#comment_" + orderId).attr("disabled", "false");
                                layer.msg(data.message, {
                                    time: 1500
                                });
                            }
                        }
                    });

                });
                closeModel();
            });
        }

        //交易完成
        if ($(".transaction_completion_operation")){
            $(".transaction_completion_operation").bind('click',function () {
                var orderId = $(this).closest('tr').attr("id");
                $.ajax({
                    url : apiUrl + 'order/ok',
                    type : 'post',
                    data:{order_id:orderId},
                    headers : {
                        "Token": localStorage.getItem('token')
                    },
                    dataType : 'json',
                    success : function (data) {
                        if(data.code === 200){
                            reloadOperation(orderId,"交易完成");
                        }else{
                            layer.msg(data.message, {
                                time: 1500
                            });
                        }
                    }
                });
            });
        }
        //删除订单
        if ($(".delete_order_operation")){
            $(".delete_order_operation").bind('click',function () {
                var orderId = $(this).closest('tr').attr("id");
                $.ajax({
                    url : apiUrl + 'order/delete',
                    type : 'post',
                    data:{order_id:orderId},
                    headers : {
                        "Token": localStorage.getItem('token')
                    },
                    dataType : 'json',
                    success : function (data) {
                        if(data.code === 200){
                            reloadOperation(orderId,"删除订单成功");
                        }else{
                            layer.msg(data.message, {
                                time: 1500
                            });
                        }
                    }
                });

            });
        }

        //取消订单
        if ($(".cancel_order_operation")){
            $(".cancel_order_operation").bind('click',function () {
                var orderId = $(this).closest('tr').attr("id");
                $.ajax({
                    url : apiUrl + 'order/cancel',
                    type : 'post',
                    data:{order_id:orderId},
                    headers : {
                        "Token": localStorage.getItem('token')
                    },
                    dataType : 'json',
                    success : function (data) {
                        if(data.code === 200){
                            reloadOperation(orderId,"取消订单成功");
                        }else{
                            layer.msg(data.message, {
                                time: 1500
                            });
                        }
                    }
                });
            });
        }
    }
    //商品评论列表模版
    var createCommentHtml = function (orderid) {
        $.ajax({
            url: apiUrl + 'order/detail/' + orderid,
            type: 'get',
            headers: {
                "Token": localStorage.getItem('token')
            },
            dataType: 'json',
            success: function (data) {
                var html = "";
                if (data.code === 200) {
                    if (!isNull(data.data.goods)) {
                        var goodsList = data.data.goods;
                        var i = 0;
                        goodsList.map(x => {
                            html += '<div class="goods_comment_list"><div class="goodImg"><div style="text-align: center;"><img src="' + qiniu_bucket_domain + x.goods_cover + '" goodsweid="' + x.goods_id + '"><span>' + x.goods_title + '</span></div></div>' +
                            '<div class="col-sm-10 form-group addimgmore">' +
                            '<div class="imglabel">' +
                            '<div id="container">' +
                            '<a class="btn btn-default btn-lg btn-file" id="pickfiles-more' + i + '" href="#" >' +
                            '<span>上传图片</span>' +
                            '</a>' +
                            '</div>' +
                            '</div>' +
                            '<div style="display:none" id="success" class="col-md-12">' +
                            '<div class="alert-success">' +
                            '队列全部文件处理完毕' +
                            '</div>' +
                            '</div>' +
                            '<div class="imgmore">' +
                            '<div class="imgsdiv">' +
                            '<div id="fsUploadProgress"></div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="comment_bomb_box_group" style="display: inline-flex;"><div class="comment_bomb_box_name"> 评论： </div><div class="comment_bomb_box_input"><textarea class="bomb_box_textarea" cols="52" maxlength="52" rows="3" name="textarea"></textarea></div></div></div>';
                        i++;
                    })
                        ;
                        $(".comment_bomb_box_content").append(html);

                        //绑定七牛多图上传
                        for (var a = 0; a < goodsList.length; a++) {
                            var uploader = Qiniu.uploader({
                                disable_statistics_report: false,
                                runtimes: 'html5,flash,html4',
                                browse_button: 'pickfiles-more' + a,
                                container: 'container',
                                drop_element: 'container',
                                max_file_size: '100mb',
                                flash_swf_url: '../../common/js/plupload/Moxie.swf',
                                dragdrop: true,
                                chunk_size: '4mb',
                                multi_selection: !(moxie.core.utils.Env.OS.toLowerCase() === "ios"),
                                uptoken_url: QINIU_UPTOKEN_URL,
                                domain: qiniu_bucket_domain,
                                get_new_uptoken: false,
                                auto_start: true,
                                log_level: 5,
                                init: {
                                    'BeforeChunkUpload': function (up, file) {
                                    },
                                    'FilesAdded': function (up, files) {
                                        $('table').show();
                                        $('#success').hide();
                                        plupload.each(files, function (file) {
                                            var progress = new FileProgress(file,
                                                'fsUploadProgress');
                                            progress.setStatus("等待...");
                                            progress.bindUploadCancel(up);
                                        });
                                    },
                                    'BeforeUpload': function (up, file) {
                                        var progress = new FileProgress(file, 'fsUploadProgress');
                                        var chunk_size = plupload.parseSize(this.getOption(
                                            'chunk_size'));
                                        if (up.runtime === 'html5' && chunk_size) {
                                            progress.setChunkProgess(chunk_size);
                                        }
                                    },
                                    'UploadProgress': function (up, file) {
                                        var progress = new FileProgress(file, 'fsUploadProgress');
                                        var chunk_size = plupload.parseSize(this.getOption(
                                            'chunk_size'));
                                        progress.setProgress(file.percent + "%", file.speed,
                                            chunk_size);
                                    },
                                    'UploadComplete': function () {

                                    },
                                    'FileUploaded': function (up, file, info) {
                                        var domain = up.getOption('domain');
                                        var progress = new FileProgress(file, 'fsUploadProgress');
                                        progress.setComplete(up, info.response);
                                        $(".progressCancel").bind("click", function () {
                                            $(this).closest(".progressContainer").remove();
                                        })
                                    },
                                    'Error': function (up, err, errTip) {
                                        $('table').show();
                                        var progress = new FileProgress(err.file, 'fsUploadProgress');
                                        progress.setError();
                                        progress.setStatus(errTip);
                                    },
                                    'Key': function (up, file) {
                                        var key = "pages/goods/";
                                        key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                                        return key;
                                    }

                                }
                            });
                        }
                    }
                } else {
                    $(".comment_bomb_box_content").append("加载失败");
                }
            }

        });

    }
    //重新加载操作按钮
    var reloadOperation=function (orderid,message) {
        $.ajax({
            url : apiUrl + 'order/detail/'+orderid,
            type : 'get',
            headers : {
                "Token": localStorage.getItem('token')
            },
            dataType : 'json',
            success : function (data) {
                if(data.code===200){
                    var operList = [];
                    if(!isNull(data.data.send)){
                        operList.push({
                            name : '查看物流',
                            oper : 'distribute'
                        })
                    }
                    switch (data.data.order_status){
                        case 1:
                            operList.push({
                                name : '付款',
                                oper : 'pay_order_operation',
                            });
                            operList.push({
                                name : '取消订单',
                                oper : 'cancel_order_operation',
                            });
                            break;
                        case 2:
                            operList.push({
                                name : '取消订单',
                                oper : 'cancel_order_operation',
                            });
                            break;
                        case 3:
                            operList.push({
                                name : '确认收货',
                                oper : 'take_delivery_operation',
                            });
                            break;
                        case 4:
                            operList.push({
                                name : '评论',
                                oper : 'goods_comment',
                            });
                            operList.push({
                                name : '确定交易',
                                oper : 'transaction_completion_operation',
                            });
                            operList.push({
                                name : '申请退款',
                                oper : 'apply_refund_operation',
                            });
                            break;
                        case 5:
                            break;
                        case 6:
                            operList.push({
                                name : '删除订单',
                                oper : 'delete_order_operation',
                            });
                            break;
                        case 7:
                            operList.push({
                                name : '删除订单',
                                oper : 'delete_order_operation',
                            });
                            break;
                        case 8:
                            break;
                        case 9:
                            operList.push({
                                name : '删除订单',
                                oper : 'delete_order_operation',
                            });
                            break;
                    }
                    if(operList.length){
                        var operDom='';
                        for(var i=0;i<operList.length;i++){
                            operDom +=
                                '<a class="'+ operList[i].oper +'">'+operList[i].name+'</a>';
                        }
                        var obj=$("#"+orderid).find(".status-oper");
                        obj.empty();
                        obj.append(operDom);
                        layer.msg(message, {
                            time: 1500
                        });
                        //重新加载页面
                        var time_start=$("input[name='start_time']").val();
                        var time_end=$("input[name='end_time']").val();
                        var order_num=$("input[name='no']").val();
                        var statusid=$(".current .btn-select").data("id");
                        var page=$("pagination").find("active").find("span").text();
                        orderlist(userId,page,statusid,{time_start:time_start,time_end:time_end,order_num:order_num});
                    }
                }
            }
        })
    }
    var getDistributionInfo=function () {
        $('.send-group').each(function (ind, ele) {
            var no = $(ele).attr('no');
            var code = $(ele).attr('code');
            if(isNull($('#group'+ind+' .detail').text())){
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
                            $('#group'+ind+' .detail').text(res.message.message);
                        }

                    }
                })
            }
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



    var userId;
    var __init = function(weid) {
        userId=weid;
        orderlist(userId,1);

    }
    __init(weid);

})




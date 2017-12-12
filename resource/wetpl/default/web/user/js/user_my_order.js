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
                                var goodItem =
                                    '<tr id="'+x.weid+'">'+
                                    '<td style="width: 106px;padding-top: 8px;"><img src="'+qiniu_bucket_domain+x.goods[i].goods_cover+'" alt=""></td>'+
                                    '<td style="width: 460px;"><a href="/'+x.domain +'/wemall/goods/'+x.goods[i].goods_id+'" target="_blank">'+x.goods[i].goods_summary+'</a></td>'+
                                    '<td>￥'+x.goods[i].goods_price+'</td>'+
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
                    switch (x.order_status){
                        case 2:
                            break;
                        case 3:
                            operList.push({
                                name : '查看物流',
                                oper : 'distribute'
                            });
                            operList.push({
                                name : '确认收货',
                                oper : 'take_delivery',
                            });
                            break;
                        case 4:
                            operList.push({
                                name : '查看物流',
                                oper : 'distribute',
                            });
                            operList.push({
                                name : '评论',
                                oper : 'goods_comment',
                            });
                            operList.push({
                                name : '确定交易',
                                oper : 'transaction_completion',
                            });
                            operList.push({
                                name : '申请退款',
                                oper : 'apply_refund',
                            });
                            break;
                        case 5:
                            operList.push({
                                name : '查看物流',
                                oper : 'distribute',
                            });
                            break;
                        case 7:
                            operList.push({
                                name : '查看物流',
                                oper : 'distribute'
                            },{
                                name : '删除订单',
                                oper : 'delete_order',
                            });
                            break;
                        case 8:
                            operList.push({
                                name : '确认退款',
                                oper : 'confirmRefund'
                            },{
                                name : '查看物流',
                                oper : 'distribute'
                            });
                            break;
                        case 9:
                            operList.push({
                                name : '查看物流',
                                oper : 'distribute'
                            });
                            break;
                    }
                    if(operList.length){
                        for(var i=0;i<operList.length;i++){
                            var operDom =
                                '<a class="'+ operList[i].oper +'">'+operList[i].name+'</a>';
                            $('#'+x.weid+' .status-oper').append(operDom);
                            InitOperation();
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
                                        orderlist(userId,prevactive-1,type);
                                    }
                                }else if($(this).attr("id")=="next"){
                                    if(prevactive<pagenum){
                                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                        $(this).parent().find('.active').next().append('<span>'+(prevactive+1)+'</span>').find('a').remove();
                                        $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                                        orderlist(userId,prevactive+1,type);
                                    }

                                }else{
                                    orderlist(userId,$(this).find("a").text(),type);
                                    $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                                    $(this).addClass("active").siblings().removeClass('active');
                                    $(this).append('<span>'+curr+'</span>').find('a').remove();
                                }

                            }


                        })

                    }
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
            '<span style="display: none;">联系电话：'+data.phone+'</span>'+
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
                                                    '<div>' +
                                                    '<img src="'+qiniu_bucket_domain+goodsList[a].goods_cover+'">'+
                                                    '<span>'+goodsList[a].goods_title+'</span>'+
                                                    '</div>';

                                                $('#group'+i+' .goodImg').append(imgDom);
                                            }
                                        }
                                    }
                                }

                                $('#group'+i+' .detail').text('正在加载，请稍候...')

                            }
                            getDistributionInfo();

                        }


                    }
                })
                closeModel();
            });
        }



        //确收货
        if ($(".take_delivery")){
            $(".take_delivery").bind('click',function () {
                var orderId = $(this).closest('tr').attr("id");
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
                            layer.msg("确收货成功", {
                                time: 1500
                            });
                            //重新获取状
                            reloadOperation(orderId);
                        }else{
                            layer.msg(data.message, {
                                time: 1500
                            });
                        }
                    }
                });
            });
        }

        //申请退款
        if ($(".apply_refund")){
            $(".apply_refund").bind('click',function () {
                var orderId = $(this).closest('tr').attr("id");
                $.ajax({
                    url : apiUrl + 'order/refund',
                    type : 'post',
                    data:{order_id:orderId},
                    headers : {
                        "Token": localStorage.getItem('token')
                    },
                    dataType : 'json',
                    success : function (data) {
                        if(data.code === 200){
                            layer.msg("申请退款成功", {
                                time: 1500
                            });
                            //重新获取状
                            reloadOperation(orderId);
                        }else{
                            layer.msg(data.message, {
                                time: 1500
                            });
                        }
                    }
                });
            });
        }

        //评论商品
        if ($(".goods_comment")){
            $(".goods_comment").bind('click',function () {

            });
        }

        //交易完成
        if ($(".transaction_completion")){
            $(".transaction_completion").bind('click',function () {
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
                            layer.msg("交易完成", {
                                time: 1500
                            });
                            //重新获取状
                            reloadOperation(orderId);
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
        if ($(".delete_order")){
            $(".delete_order").bind('click',function () {
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
                            //重新获取状
                            reloadOperation(orderId);
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
        if ($(".cancel_order")){
            $(".cancel_order").bind('click',function () {
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
                            layer.msg("取消订单成功", {
                                time: 1500
                            });
                            //重新获取状
                            window.location.reload();
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
    //重新加载操作按钮
    var reloadOperation=function (orderid) {
        $.ajax({
            url : apiUrl + 'order/detail/'+orderid,
            type : 'get',
            headers : {
                "Token": localStorage.getItem('token')
            },
            dataType : 'json',
            success : function (data) {
                var operList = [];
                switch (data.data.order_status){
                    case 2:
                        break;
                    case 3:
                        operList.push({
                            name : '查看物流',
                            oper : 'distribute'
                        });
                        operList.push({
                            name : '确认收货',
                            oper : 'take_delivery',
                        });
                        break;
                    case 4:
                        operList.push({
                            name : '查看物流',
                            oper : 'distribute',
                        });
                        operList.push({
                            name : '评论',
                            oper : 'goods_comment',
                        });
                        operList.push({
                            name : '确定交易',
                            oper : 'transaction_completion',
                        });
                        operList.push({
                            name : '申请退款',
                            oper : 'apply_refund',
                        });
                        break;
                    case 5:
                        operList.push({
                            name : '查看物流',
                            oper : 'distribute',
                        });
                        break;
                    case 7:
                        operList.push({
                            name : '查看物流',
                            oper : 'distribute'
                        },{
                            name : '删除订单',
                            oper : 'delete_order',
                        });
                        break;
                    case 8:
                        operList.push({
                            name : '确认退款',
                            oper : 'confirmRefund'
                        },{
                            name : '查看物流',
                            oper : 'distribute'
                        });
                        break;
                    case 9:
                        operList.push({
                            name : '查看物流',
                            oper : 'distribute'
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

                }
            }
        })
    }
    var getDistributionInfo=function () {
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
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        orderlist(userId,1);
                        /*
                        $(".orders_list_pic a").each(function(){
                            $(this).attr("href","/"+data.data.domain+"/"+$(this).attr("href"));
                        })
                        */
                        /*
                        $(".orders_list_details a").each(function(){
                            // $(this).attr("href","/"+data.data.domain+"/"+$(this).attr("href"));

                        })
                        */
                        // getUserInfo(USERDETAIL, "/" + userId);
                    } else {
                        /*
                        $(".orders_list_pic a").each(function(){
                            $(this).attr("href","/index/"+$(this).attr("href"));
                        })
                        */
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
    __init(weid);

})




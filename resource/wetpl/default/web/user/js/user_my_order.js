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

var all_price = 0, order_goods = function(key, value, index) {
    var thumb_image = value.goods_cover;
    all_price += value.goods_price * value.goods_num;
    if(!thumb_image) {
        thumb_image = "/common/img/news_default.jpg";
    } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
        thumb_image = imgSet(thumb_image, 80, 80, 3);
    }

    var template = `
    <div class="my_order_goods">
        <div class="my_order_goods_cover"><a href="/`+ key.domain +`/wemall/goods/`+ value.goods_id +`" target="_blank"><img src="`+ thumb_image +`" alt=""></a></div>
        <div class="my_order_goods_title">`+ value.goods_title +`</div>
        <div class="my_order_order_price">￥`+ value.goods_price +`</div>
        <div class="my_order_goods_num">`+ value.goods_num +`</div>
    </div>`
    return template;
}

var orderlist = function(key, index) {    
    var order_status = new Object();

    switch(key.order_status) {
        case 1:
            order_status.title   = `已下单`;
            order_status.state_1 = order_status.state_3 = order_status.state_4 = order_status.state_5 = order_status.state_7 = order_status.state_8 = order_status.state_9 = order_status.state_10 = '';
            order_status.state_2 = ``;
            order_status.state_6 = ``;
            break;
        case 2:
            order_status.title   = `已付款`;
            order_status.state_1 = order_status.state_3 = order_status.state_4 = order_status.state_5 = order_status.state_6 = order_status.state_7 = order_status.state_8 = order_status.state_9 = order_status.state_10 = '';
            order_status.state_3 = ``;
            break;
        case 3:
            order_status.title   = `已发货`;
            order_status.state_1 = order_status.state_2 = order_status.state_3 = order_status.state_5 = order_status.state_6 = order_status.state_7 = order_status.state_8 = order_status.state_9 = order_status.state_10 = '';
            order_status.state_4 = ``;
            break;
        case 4:
            order_status.title   = `确认收货`;
            order_status.state_1 = order_status.state_2 = order_status.state_3 = order_status.state_4 = order_status.state_6 = order_status.state_9 = order_status.state_10 = '';
            order_status.state_5 = ``;
            order_status.state_7 = ``;
            order_status.state_8 = ``;
            break;
        case 5:
            order_status.title   = `待评价`;
            order_status.state_1 = order_status.state_2 = order_status.state_3 = order_status.state_4 = order_status.state_5 = order_status.state_6 = order_status.state_9 = order_status.state_10 = '';
            order_status.state_7 = ``;
            order_status.state_8 = ``;
            break;
        case 6:
            order_status.title   = `取消订单`;
            order_status.state_1 = order_status.state_2 = order_status.state_3 = order_status.state_4 = order_status.state_5 = order_status.state_6 = order_status.state_7 = order_status.state_8 = order_status.state_9 = '';
            order_status.state_10= `<div class="my_order_store_clear" id="`+ key.weid +`">删除</div>`;
            break;
        case 7:
            order_status.title   = `确定交易`;
            order_status.state_1 = order_status.state_2 = order_status.state_3 = order_status.state_4 = order_status.state_5 = order_status.state_6 = order_status.state_7 = order_status.state_8 = order_status.state_9 = '';
            order_status.state_10= `<div class="my_order_store_clear" id="`+ key.weid +`">删除</div>`;
            break;
        case 8:
            order_status.title   = `退款申请`;
            order_status.state_1 = order_status.state_2 = order_status.state_3 = order_status.state_4 = order_status.state_5 = order_status.state_6 = order_status.state_7 = order_status.state_8 = order_status.state_10 = '';
            order_status.state_9 = ``;
            break;
        case 9:
            order_status.title   = `确认退款`;
            order_status.state_1 = order_status.state_2 = order_status.state_3 = order_status.state_4 = order_status.state_5 = order_status.state_6 = order_status.state_7 = order_status.state_8 = order_status.state_9 = '';
            order_status.state_10= `<div class="my_order_store_clear" id="`+ key.weid +`">删除</div>`;
            break;
        case 10:
            order_status.title   = `已删除`;
            order_status.state_1 = order_status.state_2 = order_status.state_3 = order_status.state_4 = order_status.state_5 = order_status.state_6 = order_status.state_7 = order_status.state_8 = order_status.state_9 = order_status.state_10 = '';
            break;
    }

    var template = `
    <div class="my_order_store">
        <div class="my_order_store_title">
            <div class="my_order_store_title_time">`+ key.updated_at.substr(0, 10) +`</div>订单号：
            <div class="my_order_store_number">`+ key.order_num +`</div>
            <div class="my_order_store_status">`+ order_status.title +`</div>`+ order_status.state_10 +`
        </div>
        <ul class="my_order_store_list">
            <li class="my_order_img_info">`

                $.map(key.goods, function(value, i) {
                    template += order_goods(key, value, i);
                })

                template +=`

            </li>
            <li class="my_order_price">
                <div class="my_order_order_price">￥`+ all_price.toFixed(2) +`<div> (含运费：0.00) </div></div>
            </li>
            <li class="my_order_operation">
                <div class="my_order_order_operation">
                    <a href="/user/order/detail/`+ key.weid +`" target="_blank">订单详情</a>
                    <a href="javascript:void(0)">待发货</a>
                </div>
            </li>
        </ul>
    </div>`
    return template;
}

var no_goods = function() {
    layer.msg("暂无商家商铺，请前往添加", { time: 2500 });
}

var orderlisthtml = function(plat_user_id, order_num, status, order_status, logistics_status, time_start, time_end, page, keywords) {
    var body2 = new Object();
        body2.plat_user_id     = plat_user_id;
        body2.order_num        = order_num;
        body2.status           = status;
        body2.order_status     = order_status;
        body2.logistics_status = logistics_status;
        body2.time_start       = time_start;
        body2.time_end         = time_end;
        body2.page             = page;
        body2.keywords         = keywords;

    var options2 = $.post(apiUrl + "order/list", body2);
    options2.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            if(!result) {
                no_goods();
                return false;
            }

            $.map(result.list, function(key, index) {
                console.log("商家店铺：", key);
                all_price = 0;
                $(".my_order_content").append(orderlist(key, index));
            });

            $(".my_order_store_clear").click(function() {
                var shop_id = $(this).attr("id"),
                    body3 = new Object();
                    body3.order_id = shop_id;
                console.log($(this).attr("id"));
                var options3 = $.post(apiUrl + "order/delete", body3);
                options3.done(function(body) {
                    if(body.code == 200 && body.data > 0) {
                        console.log(body.data);
                        layer.msg("删除成功！", { time: 2500 });
                    } else {
                        layer.msg(body.message, { time: 1500 });
                    }
                });
                options3.fail(function(error) {
                    console.error(error);
                })
            })
        }
    });
    options2.fail(function(error) {
        console.error(error);
    });
}

var hasDomain = function(weid) {
    // Pages - 主页 - 详情(用户ID)
    var options1 = $.get(apiUrl + "pages/page/getDetailByUser/" + weid);
    options1.done(function(data) {
        if(data.code == 200) {
            // console.log("主页详情", data.data);
            if(!data.data) {
                weid = data.data.plat_user_id;
                domain = "/" + data.data.domain + "/";

            } else {
                domain = "/index/";
            }

            // mall_userdetail(data.data.plat_user_id);
            orderlisthtml(data.data.plat_user_id)
            // $(".my_order_content").append();

        } else {
            window.location.href = "/";
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });
}
hasDomain(weid);
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

var order_goods = function(key, index) {
	var thumb_image = key.goods_cover;
    if(!thumb_image) {
        thumb_image = "/common/img/news_default.jpg";
    } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
        thumb_image = imgSet(thumb_image, 80, 80, 3);
    }

	var template = `
	<div class="my_order_goods">
		<div class="my_order_goods_cover"><img src="`+ thumb_image +`" alt=""></div>
		<div class="my_order_goods_title">`+ key.goods_title +`</div>
		<div class="my_order_order_price">￥`+ key.goods_price +`</div>
		<div class="my_order_goods_num">`+ key.goods_num +`</div>
	</div>`
	return template;
}

var orderlist = function(key, index) {
	// 	<div class="my_order_store_name"><span>`+ key.username +`</span><span>`+ key.phone +`</span></div>
	// <div class="my_order_store_address">`+ key.address_detail +`</div>
	
	var order_status;

	switch(key.order_status) {
	    case 1:
	        order_status = "已下单";
	        break;
	    case 2:
	        order_status = "已付款";
	        break;
	    case 3:
	        order_status = "已发货";
	        break;
	    case 4:
	        order_status = "确认收货";
	        break;
	    case 5:
	        order_status = "待评价";
	        break;
	    case 6:
	        order_status = "取消订单";
	        break;
	    case 7:
	        order_status = "确定交易";
	        break;
	    case 8:
	        order_status = "退款申请 ";
	        break;
	    case 9:
	        order_status = "确认退款";
	        break;
	    case 10:
	        order_status = "已删除";
	        break;
	}

	var template = `
	<div class="my_order_store">
		<div class="my_order_store_title">
			<div class="my_order_store_title_time">`+ key.updated_at.substr(0, 10) +`</div>订单号：
			<div class="my_order_store_number">`+ key.order_num +`</div>
			<div class="my_order_store_status">`+ order_status +`</div>
			<div class="my_order_store_clear" id="`+ key.weid +`">删除</div>
		</div>
		<ul class="my_order_store_list">
			<li class="my_order_img_info">`

				$.map(key.goods, function(value, i) {
					template += order_goods(value, i);
				})

				template +=`

			</li>
			<li class="my_order_price">
				<div class="my_order_order_price">￥1564<div> (含运费：0.00) </div></div>
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

var orderlisthtml = function(plat_user_id) {
    var body2 = new Object();
    body2.plat_user_id     = plat_user_id;

    var options2 = $.post(apiUrl + "order/list", body2);
    options2.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            if(!result) {
            	no_goods();
            	return false;
            }

            // 
            $.map(result.list, function(key, index) {
            	console.log("商家店铺：", key);
            	$(".my_order_content").append(orderlist(key, index));
            });
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


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
        headers: {
            'Token': token,
        }
    });
}

var orderlist = function(key, index) {
	var template = `
	<div class="my_order_store">
		<div class="my_order_store_title">
			<div class="my_order_store_title_time"> 2017-11-28 </div>订单号：
			<div class="my_order_store_number"> 20171128156161685 </div>
			<div class="my_order_store_name"><span>好奇害死猫</span><span>15804564654</span></div>
			<div class="my_order_store_address">北京市朝阳区三里屯永茂大厦华语间</div>
			<div class="my_order_store_clear">删除</div>
		</div>
		<ul class="my_order_store_list">
			<li class="my_order_img_info">
				<div class="my_order_goods">
					<div class="my_order_goods_cover"><img src="/common/img/avatar6.png" alt=""></div>
					<div class="my_order_goods_title">【天猫超市】黑人牙膏超白竹炭倍健190g*4口腔清洁家庭套装清新 </div>
					<div class="my_order_order_price">￥1564</div>
					<div class="my_order_goods_num">1561346</div>
				</div>
				<div class="my_order_goods">
					<div class="my_order_goods_cover"><img src="/common/img/avatar6.png" alt=""></div>
					<div class="my_order_goods_title">【天猫超市】黑人牙膏超白竹炭倍健190g*4口腔清洁家庭套装清新 </div>
					<div class="my_order_order_price">￥1564</div>
					<div class="my_order_goods_num">1561346</div>
				</div>
			</li>
			<li class="my_order_price">
				<div class="my_order_order_price">￥1564<div> (含运费：0.00) </div></div>
			</li>
			<li class="my_order_operation">
				<div class="my_order_order_operation">
					<a href="">订单详情</a>
					<a href="">待发货</a>
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

function mall_userdetail() {
    var options2 = $.get(apiUrl + "mall/userdetail");
    options2.done(function(data) {
        if(data.code == 200) {
            console.log(data);
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
            console.log("主页详情", data.data);
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


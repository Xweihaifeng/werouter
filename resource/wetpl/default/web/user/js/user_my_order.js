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

var orderlisthtml = function(plat_user_id) {
	var options2 = $.post(apiUrl + "order/list", body2);
	options2.done(function(data) {
		if(data.code == 200) {
			console.log(data);
		}
	});
	options2.fail(function(error) {
		console.error(error);
	});
}

function() {
	var options2 = $.post(apiUrl + "mall/userdetail", body2);
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

			order_info(data.data.plat_user_id);
			$(".my_order_content").append(orderlisthtml(data.data.plat_user_id));

		} else {
			window.location.href = "/";
		}
	});
	options1.fail(function(error) {
		console.error(error);
	});
}
hasDomain(weid);


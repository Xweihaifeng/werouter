/**
 * Created by Hongguang on 2017/8/29.
 */
// var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:', favicon);
$('#favicon').attr('href', favicon);

// 判断 sessionStorage
if(sessionStorage.lastname == "we_title_2") {
	$("#we_title_2").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_2").find(".title-img").css("transform", "rotate(90deg)");
}

$(".comment_bomb_box_close").click(function() {
	$(".comment_mongolia_layer").hide();
});

var domain;
var hasDomain = function(weid) {
	$.ajax({
		url: PAGES_PAGE_GETDETAILBYUSER + weid,
		type: 'GET',
		headers: {
			'Token': localStorage.getItem('token')
		},
		success: function(data) {
			if(data.code == 200) {
				console.log(data);
				if(data.data == null) {
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
		error: function(xhr) {
			console.log(xhr);
		}
	})
}

var weid = localStorage.getItem('weid');
hasDomain(weid);

//route
var isLogin; //判断用户登陆与否
var router = function(route) {
	if(!window.localStorage.getItem("token")) {
		isLogin = false;
	} else {
		isLogin = true;
	}
	// var routerList = ['home', 'login', 'article', 'active', 'project', 'shopping', 'zone', 'zan'];
	var routerList = ['home', 'login', 'article', 'active', 'zan'];

	var isMember = function(routerList, route) {
		return routerList.filter(x => x === route);
	}

	var home = function() {
		window.location.href = '/';
	}

	var login = function() {
		if(!isLogin) {
			showLogin = true;
			$("#modal_login").fadeIn(300);
		} else {
			window.location.href = "/user";
		}
	}

	var article = function() {
		showLogin = false;
		window.location.href = "/index/article";
	}

	var active = function() {
		showLogin = false;
		window.location.href = "/index/activity";
	}
	var project = function() {
		showLogin = false;
		window.location.href = "/index/project";
	}

	var shopping = function() {
		showLogin = false;
		window.location.href = "/index/wemall";
	}

	var zone = function() {
		showLogin = false;
		window.location.href = "/index/quan";
	}

	if(isMember(routerList, route) != "") {
		eval(route)();
	}
}

// $("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function(){
$("#home, #login, #article, #active, #zan").click(function() {
	var id = $(this).attr("id");
	router(id);
})

$(document).ready(function() {
	var currWidth = $(window).height() - 90;
	var currHeight = $(window).height() - 90;
	setHeight(currHeight + 90);
	$("#middle, #right").height(currHeight);

	$(window).resize(function() {
		currWidth = $(window).height() - 90;
		currHeight = $(window).height() - 90;
		setHeight(currHeight + 90);
		$("#middle, #right").height(currHeight);
	})
	console.log(currHeight);
	$("#add").hover(function() {
		$(".add").show();
	}, function() {
		$(".add").hide();
	})

	$("#avatar, #dropdown").hover(function() {
		$(".avatar").show();
	}, function() {
		$(".avatar").hide();
	})

	$("#avatar-logout span").click(function() {
		localStorage.removeItem('token');
		localStorage.removeItem('weid');
	})

	var weid = localStorage.getItem('weid');

})

var weid = localStorage.getItem('weid');

//获取订单列表
var flag = true;
var orderlist = function(weid, page, type = 0, dataobj = "") {
	var limit = "5";
	var keywords = time_start = time_end = "";
	var status = order_num = "";
	var logistics_status = "";
	if(type == 1) {
		// 未支付/待发货
		status = type;
		logistics_status = "";
	} else if(type == 2) {
		//待发货
		status = type;
		logistics_status = 1;
	} else if(type == 3) {
		// 已发货
		status = "";
		logistics_status = 2;
	} else if(type == 4) {
		// 已完成
		status = "";
		logistics_status = 3;
	} else {
		// 订单号筛选
	}
	if(dataobj != "") {
		// 订单号筛选
		time_start = dataobj.time_start;
		time_end = dataobj.time_end;
		order_num = dataobj.order_num;
	}
	console.log(type);

	var sendData = {
		limit: limit,
		plat_user_id: weid,
		page: page,
		status: status,
		logistics_status: logistics_status,
		time_start: time_start,
		time_end: time_end,
		order_num: order_num,
		keywords: keywords
	}

	console.log(sendData);
	$.ajax({
		url: ORDER_LIST,
		type: 'post',
		data: sendData,
		headers: {
			'Token': localStorage.getItem('token')
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				var listdata = data.data.list;
				$(".ordertable").children().remove();
				listdata.map(x => {
					malldetail(x, x.mall_id);

					// 查找商城详情
					// console.log("商城id：" + x.mall_id);
				})
				var pagenum = Math.ceil(data.data.total / limit);
				var pagestr = "";
				console.log(flag);
				if(flag) {
					$('.pagination').children().remove();
					$('.pagination').append('<li id="prev"><a href="javascript:void(0);">«</a></li><li class="active"><span>1</span></li>');

					for(i = 1; i < pagenum; i++) {
						// $('.pagination').append(pagelisthtml(i));
						pagestr += '<li><a href="javascript:void(0)" id="' + (i + 1) + '">' + (i + 1) + '</a></li>';

					}
					$('.pagination').append(pagestr);
					$(".pagination").append('<li id="next"><a href="javascript:void(0)" class="next" rel="next">&raquo;</a></li>');
					// 点击页码事件
					$(".pagination li").bind("click", function() {
						flag = false;
						// console.log($(this).attr("id"));
						if($(this).attr('class') != "active") {
							var prevactive = parseInt($(this).parent().find('.active span').text());
							var curr = $(this).find('a').text();
							if($(this).attr("id") == "prev") {
								if(prevactive > 1) {
									$(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
									$(this).parent().find('.active').prev().append('<span>' + (prevactive - 1) + '</span>').find('a').remove();
									$(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
									orderlist(weid, prevactive - 1, type);
								}
							} else if($(this).attr("id") == "next") {
								if(prevactive < pagenum) {
									$(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
									$(this).parent().find('.active').next().append('<span>' + (prevactive + 1) + '</span>').find('a').remove();
									$(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
									orderlist(weid, prevactive + 1, type);

								}

							} else {
								orderlist(weid, $(this).find("a").text(), type);
								$(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
								$(this).addClass("active").siblings().removeClass('active');
								$(this).append('<span>' + curr + '</span>').find('a').remove();
							}
						}
					})
				}
			}
		}
	})
}
console.log(weid);
orderlist(weid, 1);
var messagetemplete = function() {
	var messagehtml = '<form class="sendmess_form">' +
		'<input type="hidden" value="" id="myModal_input">' +
		'<div class="form-group">' +
		'<label for="exampleInputEmail1">评论标题</label>' +
		'<input type="text" name="mess_title" class="form-control" id="exampleInputEmail1">' +
		'</div>' +
		'<div class="form-group">' +
		'<label for="exampleInputPassword1">评论内容</label>' +
		'<textarea type="text" rows="10" name="mess_content" class="form-control" id="exampleInputPassword1"></textarea>' +
		'</div>' +
		'<div class="modal-footer">' +
		'<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
		'<button type="button" class="btn btn-primary save">确定</button>' +
		'</div>' +
		'</form> ';
	return messagehtml;
}
var sendmessage = function(obj) {
	console.log($(obj).closest("tr"));
	var goods_id = "";
	// $(".btn-message").bind("click",function(){
	// goods_id=$(obj).parent().attr("data-id");
	goods_id = $(obj).closest("tr").data("id");
	console.log(goods_id + ":g");
	$(".modal-title").text("发表评论");
	$(".sendmess").children().remove();
	$(".sendmess").append(messagetemplete());
	// $("#myModal_input").val(orderid);
	// var status_pay=$(obj).parent().parent().find(".status_pay").attr("id");
	var status_pay = $(obj).closest("td").attr("id");
	savemess(goods_id, obj);
	// })

}

var savemess = function(goods_id, obj) {
	$(".save").bind("click", function() {
		var order_id = $(obj).closest("tr").attr("id");
		var title = $("input[name=mess_title]").val();
		var content = $("textarea[name=mess_content]").val();
		// var id = $("#myModal_input").val();
		// var status=2;
		var sendData = {
			goods_id: goods_id,
			order_id: order_id,
			title: title,
			content: content
		}
		console.log(sendData);

		$.ajax({
			url: GOODS_COMMENT_STORE,
			type: 'post',
			data: sendData,
			headers: {
				'Token': localStorage.getItem('token')
			},
			dataType: 'json',
			success: function(data) {
				console.log(data);
				if(data.code == 200) {
					mess_tusi("评论成功");
					$(obj).parent().append("<div></div>");
					$(obj).remove();
					$('#myModal').modal('hide');
					$("input[name=mess_title]").val('');
					$("textarea[name=mess_content]").val('');

				}
			}
		})

	})
}

$(".btn-select").bind("click", function() {
	flag = true;
	$(this).closest("li").addClass("current").siblings().removeClass("current");
	var statusid = $(this).data("id");

	if(statusid == 0) {
		$("input[name='start_time']").val("");
		$("input[name='end_time']").val("");
		$("input[name='no']").val("");
	}

	var time_start = $("input[name='start_time']").val();
	var time_end = $("input[name='end_time']").val();
	var order_num = $("input[name='order-num']").val();
	console.log(statusid, time_start, time_end, order_num);

	orderlist(weid, 1, statusid, {
		time_start: time_start,
		time_end: time_end,
		order_num: order_num
	});
})

$(".btn-num").bind("click", function() {
	flag = true;

	var time_start = $("input[name='start_time']").val();
	var time_end = $("input[name='end_time']").val();
	var order_num = $("input[name='order-num']").val();
	var statusid = $(".current .btn-select").data("id");
	console.log(statusid, time_start, time_end, order_num);

	orderlist(weid, 1, statusid, {
		time_start: time_start,
		time_end: time_end,
		order_num: order_num
	});

})

// 页码列表模板
var pagelisthtml = function(num) {
	var pagehtml = '<li>' +
		'<a href="javascript:void(0)" id="' + num + '">' + num + '</a>' +
		'</li>';
	return pagelisthtml;
}

//订单列表模板
var status_pay = sendgoods = log_company = log_num = "";
var orderlisthtml = function(data) {
	if(data.status > 1) {
		if(data.logistics_status == 1) {
			status_pay = "待发货";
			sendgoods = status_pay;

		} else if(data.logistics_status == 2) {
			status_pay = "已发货";

			if(data.is_comment == 2) {
				sendgoods = '<div class="list_details_btn btn-message" onclick="sendmessage(this)" type="" id="' + data.status + '"  data-toggle="modal" data-target=".bs-example-modal-sm" data-no="' + data.order_num + '">评论 </div>';

			} else {
				status_pay = "已评论";
				sendgoods = status_pay;
			}

		} else if(data.logistics_status == 3) {
			status_pay = "已完成";
			sendgoods = '';
		}
	} else {
		status_pay = "未支付";
		sendgoods = '<div class="list_details_btn btn-pay" onclick="sendpay(this)"  data-toggle="modal" data-id="486" data-target=".bs-example-modal-sm" >付款</div>' +
			'<div onclick="delorder(this)"  class="list_details_btn btn-order-del">删除</button>';
	}

	if(data.logistics_company == null || data.logistics_company == "") {
		log_company = "";
	} else {
		log_company = data.logistics_company;
	}
	if(data.logistics_NO == null || data.logistics_NO == "") {
		log_num = "";
	} else {
		log_num = data.logistics_NO;
	}

    console.log("goods_id:", data);

	var listhtml = '<table class="orders_list_title">' +
		'<tbody>' +
		'<tr class="orders_list_msg">' +
		'<td class="list_left" colspan="5">' +
		'<span class="list_left_date">' + data.created_at + '</span>' +
		'<span class="list_left_num">订单号:<em>' + data.order_num + '</em></span>' +
		'</td>' +
		'<!--<td class="list_right" colspan="2" align="right">' +
		'<div class="contact_seller" data-mobile="18966700695" onmouseover="$(this).find(\'span\').show();" onmouseout="$(this).find(\'span\').hide();">' +
		'<i></i>联系买家' +
		'<span style="display: none;">联系电话：' + data.phone + '</span>' +
		'</div>' +
		'</td>-->' +
		'</tr>' +
		'<tr class="orders_list_content" id="' + data.weid + '" data-id="' + data.goods_id + '">' +
		' <td width="40%">' +
		'<div class="orders_list_pic">' +
		'<a href="' + data.domain_order + 'wemall/goods/' + data.goods_id + '" target="_blank">' +
		'<img class="img" src="' + qiniu_bucket_domain + data.goods_cover + '" alt="">' +
		'<p class="txt">' + data.goods_title + '</p>' +
		'</a>' +
		'</div>' +
		'</td>' +
		'<td width="10%">' +
		'<div class="orders_list_buy">' +
		'<span>x' + data.goods_num + '</span>' +
		'</div>' +
		'</td>' +
		'<td width="15%">' +
		'<div class="orders_list_buy">' +
		'<span class="list_right_gj"><p>￥' + data.order_price + '</p><p>(含运费:0.00)</p></span>' +
		'</div>' +
		'</td>' +
		'<td width="25%">' +
		'<div class="orders_list_addr">' +
		'<p>' + data.username + '<em>' + data.phone + '</em></p>' +
		'<p>' + data.address_detail + '</p>' +
		'<p>备注:<span>' + data.note + '</span></p>' +
		'</div>' +
		'</td>' +
		'<td width="10%">' +
		' <div class="orders_list_details" id="' + data.status + '">' +
		'<a href="/user/order/detail/' + data.weid + '" target="_blank">订单详情</a>' + sendgoods +
		'</div>' +
		'</td>' +
		'</tr>' +
		'</tbody>' +
		'</table>';
	return listhtml;
}

var malldetail = function(x, mall_id) {
	$.ajax({
		url: MALL_DETAIL + '/' + mall_id,
		type: 'get',
		headers: {
			'Token': localStorage.getItem('token')
		},
		dataType: 'json',
		success: function(data) {
			// console.log(data);
			if(data.code == 200) {
				var order = data.data;
				if(order != null) {
					__init(x, data.data.plat_user_id);

				}
			}
		}
	})
}

//back to top
$("#toTop").hide();
$(".read").scroll(function() {
	if($(".read").scrollTop() > $(window).height() / 2) {
		$("#toTop").fadeIn(500);
		$("#toTop").hover(function() {
			$(this).css("background-color", "#eeeeee");
		}, function() {
			$(this).css("background-color", "white");
		});
	} else {
		$("#toTop").fadeOut(500);
	}
})

$("#toTop").click(function() {
	$('.read').animate({
		scrollTop: 0
	}, 300);
})

// 获取订单详情
var init = function(id) {

	$.ajax({
		url: ORDER_DETAIL + '/' + id,
		type: 'get',
		headers: {
			'Token': localStorage.getItem('token')
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				var order = data.data;

				if(data.data.status == 2) {
					clearInterval(t);
					// 修改商品库存量
					shopstock(data.data.goods_id, order.goods_num);

				}
			}
		}
	})
}
// 商品详情
var shopstock = function(weid, num) {

	$.ajax({
		url: GOODS_DETAIL + '/' + weid,
		type: 'get',
		headers: {
			'Token': localStorage.getItem('token')
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				var newstock = data.data.stock - num;
				var newsales_num = data.data.sales_num + num;
				console.log(newstock + ":" + newsales_num);
				var sendData = {
					weid: data.data.weid,
					stock: newstock,
					sales_num: newsales_num
				}
				shopstockupdate(sendData);
			}
		},
		error: function() {
			console.log("SHOP DETAIL ERROR");
		}
	})
}
// 修改商品库存量
var shopstockupdate = function(sendData) {

	$.ajax({
		url: GOODS_UPDATE,
		type: 'post',
		data: sendData,
		headers: {
			'Token': localStorage.getItem('token')
		},
		dataType: 'json',
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				mess_tusi("支付成功");
				location.reload();
			}
		},
		error: function() {
			console.log("SHOP UPDATE ERROR");
		}
	})
}

//去付款
var sendpay = function(obj) {
	console.log($(".btn-pay"));
	$(".modal-title").text("扫描支付");
	$(".payimg").children().remove();

	var orderid = $(obj).closest("tr").attr("id");
	console.log(orderid);
	init(orderid);

	var status_pay = $(obj).parent().parent().find(".status_pay").attr("id");
	shoppay(orderid);

}

// 支付二维码链接
var t = "";
var shoppay = function(id) {
	console.log("订单id支付二维码:", id);

	$.ajax({
		url: WECHATPAY_NATIVEPAY + '/' + id,
		type: 'get',
		headers: {
			'Token': localStorage.getItem('token')
		},
		success: function(data) {
			console.log(data);
			if(data.code == 200) {

				$(".payimg").append("<img src='" + QRCODE + "?url=" + data.data.url + "' />"); //支付二维码图片
				// 循环判断是否支付
				t = setInterval(function() {
					init(id);
				}, 1000);

			} else {
				console.log('PAY  ERROR');
			}
		},
		error: function(xhr) {
			console.log(xhr);
		}
	})
}
// 删除订单
var delorder = function(obj) {
	var orderid = $(obj).closest("tr").attr("id");
	console.log(orderid);

	$.ajax({
		url: ORDER_DESTROY + '/' + orderid,
		type: 'get',
		headers: {
			'Token': localStorage.getItem('token')
		},
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				location.reload();

			} else {
				console.log('ORDER DEL  ERROR');
			}
		},
		error: function(xhr) {
			console.log(xhr);
		}
	})
	// })
}

//获取通用用户信息
var getUserInfo = function(url, id) {
	$.ajax({
		url: url + id,
		type: 'get',
		headers: {
			'Token': localStorage.getItem('token')
		},
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				var info = data.data;
				var weid = info.weid;
				console.log(weid)
				if(info.avatar != "") {
					$("#head-icon, .user-head").css({
						"background": "url(" + qiniu_bucket_domain + info.avatar + ") no-repeat center",
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
		error: function(xhr) {
			console.log(xhr);
		}
	})
}

//个性域名用户weid
var userId;
var domain_order = "";
var __init = function(x, weid) {
	$.ajax({
		url: PAGES_PAGE_GETDETAILBYUSER + weid,
		type: 'GET',
		headers: {
			'Token': localStorage.getItem('token')
		},
		success: function(data) {
			if(data.code == 200) {
				// console.log(data);
				if(data.data != null) {
					userId = data.data.plat_user_id;
					// console.log('userId:', userId);
					// console.log(data.data.domain);
					domain_order = "/" + data.data.domain + "/";

				} else {
					domain_order = "/index/";
				}

				// console.log(x);
				x.domain_order = domain_order;
				$(".ordertable").append(orderlisthtml(x));

			} else {
				window.location.href = "/*";
			}
		},
		error: function(xhr) {
			console.log(xhr);
		}
	})
}
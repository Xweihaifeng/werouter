/**
 * Created by Hongguang on 2017/8/29.
 */
// 判断 sessionStorage
if(sessionStorage.lastname == "we_title_2") {
	$("#we_title_2").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_2").find(".title-img").css("transform", "rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

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
})

//钱包

//创建用户账户
var create = function(amount, status) {
	$.ajax({
		url: apiUrl + "users/account/store",
		headers: {
			'Token': localStorage.getItem('token')
		},
		data: {
			amount: amount,
			status: status //账户状态 1正常 2 关闭',
		},
		type: "POST",
		dataType: "json",
		success: function (data) {
			console.log(data);
		},
		error: function (err) {
			console.log(err)
		}
	})
}

var userId = localStorage.getItem('user_id');
var init = function(id) {
	create(100, 1);
	$.ajax({
		url: apiUrl + "users/account/getDetailByUser/" + id,
		type: "GET",
		headers: {
			'Token': localStorage.getItem('token')
		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			if(data.data.status == 1) {
				$("#balance b").text(data.data.amount); //金额
				$("#EarnestMoney").text(); //诚意金预留
				localStorage.money = data.data.amount;//保留金额
				localStorage.user_id = data.data.weid;//保留weid
				$("#Recharge").attr("href", "/user/myaccount/packet/recharge");
				$("#Withdrawals").attr("href", "/user/myaccount/packet/withdraw");
			} else {
				// 置灰
				$("#Recharge").addClass("disabled");
				$("#Withdrawals").addClass("disabled");
			}
		}
	})
}

init(weid);

// 判断 sessionStorage
if(sessionStorage.lastname == "we_title_2") {
	$("#we_title_2").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_2").find(".title-img").css("transform", "rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
$('#favicon').attr('href', favicon);

var weid = docCookies.getItem("weid");
var amount = 0;
var init = function(id) {
	$.ajax({
		url: apiUrl + "users/account/getDetailByUser/" + id,
		type: "GET",
		headers: {
			'Token': docCookies.getItem("token")
		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			if(data.data.status == 1) {
				amount = data.data.amount;
				$("#money").attr('placeholder', data.data.amount); //金额
			}
		}
	})
}

//init(weid);

//可用金额判断
var useable = function() {
	$.ajax({
		url: apiUrl + "users/Withdraws/couldWithdraws",
		type: "GET",
		headers: {
			'Token': docCookies.getItem("token")
		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			if (data.data != null) {
				amount = data.data;
				$("#money").attr('placeholder', "最大提现金额：" + data.data);
				$("#useable").html("&yen" + data.data);
			}
		}
	})
}

useable();

//判断是否存在openid
var openid;
var userInfo = function(weid){
	$.ajax({
		url: apiUrl + 'users/' + weid,
		type: 'GET',
		success: function(data){
			console.log(data);
			openid = data.data.openid;
		},
		error: function(error){
			console.log(error)
		}
	})

	$.ajax({
		url: apiUrl + "users/account/userAccountInfo/" + weid,
		type: "GET",
		headers: {
			'Token': docCookies.getItem("token")
		},
		dataType: "json",
		success: function(data) {
			console.log(data);
			$("#amount").html("&yen" + data.data.amount);
			$("#approve").html("&yen" + data.data.amount_approve);
		}
	})
}

userInfo(weid);

//提现结果通知
var detail = function(id) {
	$.ajax({
		url: apiUrl + "users/Withdraws/detail/" + id,
		type: "GET",
		headers: {
			'Token': docCookies.getItem("token")
		},
		dataType: "json",
		success: function(data) {
			console.log(data)
			if (data.data != null) {
				if (data.data.status == 2) {
					layer.msg("您已成功提现", {
						time: 1500
					})
				} else {
					layer.msg("您的提现审批尚未完成", {
						time: 1500
					})
				}
			}
		},
		error: function(error) {
			console.log(error)
		}

	})
}

//detail(weid);

var withdraw = function(money, secret) {
	$.ajax({
		url: apiUrl + "users/Withdraws/store",
		type: "POST",
		headers: {
			'Token': docCookies.getItem("token")
		},
		data: {
			amount: money,
			secret: secret
		},
		dataType: "json",
		success: function(data) {
			console.log(data)
			if (data.code == 200) {
				layer.msg("您已成功申请提现", {
					time: 1500
				})
				window.location.reload();
			} else {
				layer.msg(data.message, {
					time: 1500
				})
			}
		},
		error: function(error) {
			console.log(error)
		}

	})
}

//提现
$("#accept").click(function() {
	var money = $("#money").val();
	var secret = $("#secret").val();
	if (openid != undefined) {
		if (money >= 1 && money <= 20000 && money <= amount) {			
			withdraw(money, secret);
		} else {
			layer.msg("提现金额有误", {
				time: 1500
			});
		}
	} else {
		layer.msg("请绑定微信后申请提现", {
			time: 1500
		});
	}
})

//获取提现列表
var listTemplate = function(data) {
	var status;
	if (data.status == 1) {
		status = '未处理'
	} else {
		status = '已处理'
	}

	var template = `
	 <tr>
	     <td>&yen` + data.amount + `</td>
	     <td>&yen` + (amount * 0.005).toFixed(2) + `</td>
		 <td>&yen` + amount + `</td>
		 <td>` + data.updated_at + `</td>
		 <td>` + status + `</td>
	 </tr>
	`
	return template
}

var isBind =  false;
var showList = function(status, limit, page) {
	$.ajax({
		url: apiUrl + "users/Withdraws/list",
		type: "POST",
		headers: {
			'Token': docCookies.getItem("token")
		},
		data: {
			status: status,
			limit: limit,
			page: page
		},
		dataType: "json",
		success: function(data) {
			console.log(data)
			if (data.data != null) {
				data.data.list.map(x => {
					$("#money_tab").append(listTemplate(x))
				})

				if (!isBind) {
					$('#example').DataTable({
						'paging'      : true,
						'lengthChange': false,
						'searching'   : false,
						'ordering'    : true,
						'info'        : true,
						'autoWidth'   : false
					})	
					isBind = true;
				}				
			}
		},
		error: function(error) {
			console.log(error)
		}

	})
}

$(".charge").click(function() {
	$(".log").removeClass("active");
	$("#log").hide();
	$(this).addClass("active");
	$("#charge").show();
})

$(".log").click(function() {
	$(".charge").removeClass("active");
	$("#charge").hide();
	$(this).addClass("active");
	$("#log").show();
	$("#money_tab").text('');
	showList('', 10, 1); //生成历史列表
})


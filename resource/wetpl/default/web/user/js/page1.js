// 判断 sessionStorage
if(sessionStorage.lastname == "we_title_2") {
	$("#we_title_2").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_2").find(".title-img").css("transform", "rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
$('#favicon').attr('href', favicon);

//微信接口
var qrWindow = function(id, qrUrl, amount) {
	$.ajax({
		url: apiUrl + 'file/qrcode' + '?size=150&url=' + qrUrl,
		type: 'GET',
		success: function(data){
			// console.log(data);
			//需处理关闭或者重新开启二维码扫描产生的问题提

			layer.open({
				type: 1
				,title: '请扫描二维码'
				,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
				,area: ['400px', '300px']
				,id: 'layerDemo'+type //防止重复弹出
				,content: '<div style="padding: 20px 100px;"><img width="100%" src=' + apiUrl + 'file/qrcode' + '?size=150&url=' + qrUrl + '></div>'
				//,btn: '关闭全部'
				,btnAlign: 'c' //按钮居中
				,shade: 0 //不显示遮罩
				,yes: function(){
					layer.closeAll();
				}
			});

			var check = setInterval(function(){
				$.ajax({
					url: apiUrl + 'users/account/detail/detail/' + id,
					type: 'GET',
					success: function(data) {
						// console.log(data);
						// console.log('count:', amount)
						if (data.code == 200) {
							var status = data.data.status;
							if (status == 1) {
								//支付成功
								layer.closeAll();
								//弹出支付成功窗口
								layer.msg("您已成功支付" + amount + "元");
								$("#money").val(0);
								/*layer.open({
									type: 1
									,title: '支付成功'
									,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
									,area: ['400px', '300px']
									,id: 'layerDemo'+2 //防止重复弹出
									,content: '成功购买' + count + '条短信！'
									//,btn: '关闭全部'
									,btnAlign: 'c' //按钮居中
									,shade: 0 //不显示遮罩
									,yes: function(){
										layer.closeAll();
									}
								});*/
								clearInterval(check);
							} else {
								console.log('go on')
							}							
						} else {
							layer.msg('服务器正忙，请稍后再试', {
								time: 1500
							});
							window.location.reload();
						}
					},
					error: function(error) {
						console.log(error);
					}
				})
			}, 1000)

		},
		error: function(error){
			console.log(error);
		}
	})
}

//充值
var recharge = function(amount){
	$.ajax({
		url: apiUrl + 'wechatpay/rechargepay/' + amount,
		headers: {
			'Token': localStorage.getItem('token')
		},
		type: "GET",
		success: function(data) {
			// console.log(data)
			if (data.data != null) {
				var id = data.data.weid;
				var url = data.data.url;
				qrWindow(id, url, amount);
			}
		},
		error: function(error) {
			console.log(error)
		}

	})
}

$("#accept").click(function(){
	var money = $("#money").val();
	if (money > 0) {
		recharge(money)
	} else {
		layer.msg("请输入正确金额", {
			time: 1500
		});
	}
})

//获取充值列表
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
		 <td>` + data.updated_at + `</td>
		 <td>` + '成功' + `</td>
	 </tr>
	`
	return template
}

var isInit = false;
var showList = function(limit, page, type) {
	$.ajax({
		url: apiUrl + "users/account/detail/list",
		type: "POST",
		headers: {
			'Token': localStorage.getItem('token')
		},
		data: {
			limit: limit,
			page: page,
			type: type
		},
		dataType: "json",
		success: function(data) {
			console.log(data)
			if (data.data != null) {
				data.data.list.map(x => {
					$("#money_tab").append(listTemplate(x))
				})
				if (!isInit) {
					isInit = true;
					$('#example').DataTable({
						'paging'      : true,
						'lengthChange': false,
						'searching'   : false,
						'ordering'    : true,
						'info'        : true,
						'autoWidth'   : false
					})
				}
			}
		},
		error: function(error) {
			console.log(error)
		}

	})
}

$(".log").click(function() {
	$("#money_tab").html('');
	showList(10, 1, 1);
})


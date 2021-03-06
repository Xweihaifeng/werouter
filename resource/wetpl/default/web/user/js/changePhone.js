/**
 * Created by Hongguang on 2017/8/29.
 */

// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_1"){
	$("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_1").find(".title-img").css("transform","rotate(90deg)");
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

//验证手机iiph2
var a = 0; //定义点击次数
//发送验证码
var shouji = "";
var Code_o = "";
var iiph2 = "";
var timer_a = null; // 定时器
//定义可复用的代码块
var error1 = function() {
	layer.msg('手机号错误', {
		area: ['255px', '55px'],
		time: 2000
	});
}
var error2 = function() {
	layer.msg('手机号码不能为空', {
		area: ['255px', '55px'],
		time: 2000
	});
}
var error3 = function() {
	layer.msg('验证码不能为空', {
		area: ['255px', '55px'],
		time: 2000
	});
}
var error4 = function() {
	layer.msg('验证码错误', {
		area: ['255px', '55px'],
		time: 2000
	});
}
$("#btn_1").on("click", function() {
	var $that = $(this);
	var btn_num = 60;
	if(!(/^1[34578]\d{9}$/.test(sessionStorage.phoneNum_pay))) {
		error1();
		return false;
	} else {
		shouji = sessionStorage.phoneNum_pay;
		timer_a = setInterval(function() {
			btn_num--;
			if(btn_num <= 0) {
				btn_num = 60;
				$that.removeClass("disabled");
				$that.text("发送验证码");
				clearInterval(timer_a);
				return;
			}
			$that.text("重新发送剩余" + btn_num);
			$that.addClass("disabled");
		}, 1000)

		//请求验证码
		$.ajax({
			type: "GET",
			headers: {
				'Token': docCookies.getItem("token")
			},
			url: apiUrl+"/common/code",
			data: {
				phone: shouji,
			},
			dataType: "json",
			success: function(data) {
				console.log(data);
			},
			error: function() {
				console.log("出错了");
			}
		});
	}
});
var btgn_s = function() {

	if(sessionStorage.phoneNum_pay == "") {
		error2();
		return;
	} else if(!(/^1[34578]\d{9}$/.test(sessionStorage.phoneNum_pay))) { //判断手机号
		error1();
		return;
	} else if($("#code_as").val() == "") {
		error3();
		return;
	} else {
		if(a == 0) {

			Code_o = $("#code_as").val();
			$.ajax({
				type: "GET",
				headers: {
					'Token': docCookies.getItem("token")
				},
				url: apiUrl+"/common/verfycode",
				data: {
					phone: shouji,
					code: Code_o,
				},
				dataType: "json",
				success: function(data) {
					console.log(data.code);
					if(data.code == 200) {
						console.log("发送成功");
						$(".fom-axx").hide();
						$(".fom-axx1").show();
						//中途
						$(".btn-xinxi").css({
							background: "#EEE",
							color: "#FFF",
							border: "none"
						});
						$(".btn-xinxi p").css("border-left", "5px solid #FFF");
						$(".btn-xinxi1").css({
							background: "#12ADFF",
							color: "#FFF"
						});
						$(".btn-xinxi1 p").css({
							borderLeft: "5px solid #12ADFF",
						});
						a++; //必须+1

					} else if(data.code == -200) {
						error4();
					}
				},
				error: function() {
					console.log("出错了");
				}
			});

		} else if(a == 1) {
			if($("#iiph2").val() == "") {
				error2();
				return;
			} else if(!(/^1[34578]\d{9}$/.test($("#iiph2").val()))) {
				error1();
				return;
			} else if($("#inputPassword3").val() == "") {
				error3();
				return;
			} else {
				$.ajax({
					type: "GET",
					headers: {
						'Token': docCookies.getItem("token")
					},
					url: apiUrl+"/common/verfycode",
					data: {
						phone: $("#iiph2").val(),
						code: $("#inputPassword3").val(),
					},
					dataType: "json",
					success: function(data) {
						console.log(data.code);
						if(data.code == 200) {
							console.log("发送成功");
							//显示第三列
							$(".btn-xinxi2").css({
								background: "#12ADFF",
								color: "#FFF"
							})
							$(".btn-xinxi1").css({
								background: "#EEE",
								color: "#FFF"
							});
							$(".btn-xinxi1 p").css({
								borderLeft: "5px solid #EEE",
								//						border:"none"''
							});
							$(".fom-axx1").hide();
							$(".fom-axx3").show();
							$("#btn").hide();

						} else if(data.code == -200) {
							error4();
						}
					},
					error: function() {
						console.log("出错了");
					}
				});
			}
		}
	}

}
//   下一步
$("#btn").on("click", btgn_s);

//发送验证码

$("#btn_fs").on("click", function() {
	iiph2 = $("#iiph2").val()
	var $that = $(this);
	var btn_num = 60;
	clearInterval(timer_a);
	timer_a = setInterval(function() {
		btn_num--;
		if(btn_num <= 0) {
			btn_num = 60;
			$that.removeClass("disabled");
			$that.text("发送验证码");
			clearInterval(timer_a);
			return;
		}
		$that.text("重新发送剩余" + btn_num);
		$that.addClass("disabled");
	}, 1000)
	$.ajax({
		type: "GET",
		headers: {
			'Token': docCookies.getItem("token")
		},
		url: apiUrl+"/common/code",
		data: {
			phone: iiph2,
		},
		dataType: "json",
		success: function(data) {
			console.log(data); //成功
		},
		error: function() {
			console.log("出错了");
		}
	});
})

//回车触发

$(document).keydown(function(event) {

	if(event.keyCode === 13) {
		btgn_s();
	}
});

    //获取通用用户信息
    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                   $("#iiph1").val(info.phone);
        			sessionStorage.phoneNum_pay=info.phone;
         			$("#iiph1").val($("#iiph1").val().substring(0, 3) + "****" + $("#iiph1").val().substring(7, 11));

                   $("#iiph1").attr("disabled","disabled");

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    getUserInfo(USERDETAIL, "/" + docCookies.getItem("weid"));

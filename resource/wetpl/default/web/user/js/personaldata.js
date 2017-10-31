/**
 * Created by yangzi on 2017/8/9.
 */
// 判断 sessionStorage
if(sessionStorage.lastname == "we_title_1") {
	$("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_1").find(".title-img").css("transform", "rotate(90deg)");
}

	// var Days = 7;//此 cookie 将被保存 30 天
 //    var exp = new Date();//new Date("December 31, 9998");
 //    exp.setTime(exp.getTime() + Days*24*60*60*1000);
 //    document.cookie = "token="+ localStorage.getItem('token') + ";expires=" + exp.toGMTString();

	 var domain;
	 var hasDomain = function(weid){
		 $.ajax({
			 url: PAGES_PAGE_GETDETAILBYUSER + weid,
			 type: 'GET',
			 headers: {
				 'Token': localStorage.getItem('token')
			 },
			 success: function(data){
			 	 // if (data.code == 401) {			 	 	
			 	 	// domain = '/index';
			 	 	// localStorage.removeItem('token')
			 	 	// window.location.href = '/login'
			 	 // }
				 if (data.code == 200){
					 // console.log(data);
					 if (data.data == null) {
						 //没有个性域名
						 domain = '/index';
					 } else {
						 //存在个性域名
						 domain = "/" + data.data.domain;
					 }
				 }
				 /*else {
					 layer.msg(data.message, {
						 time: 1500
					 });
				 }*/
			 },
			 error: function(xhr){
				 console.log(xhr);
			 }
		 })
	 }

	 var weid = localStorage.getItem('weid');
	 hasDomain(weid);

     var isLogin = false; //判断用户登陆与否
     var router = function(route){
        // var routerList = ['home', 'login', 'article','active', 'shopping'];
        var routerList = ['home', 'login', 'article','active'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal").show();
                $(".show-login").css({
                    "margin-left": width,
                    "margin-top": height
                });
                $(".show-login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user";
            }
        }

        var article = function(){
        	
            showLogin = false;
            window.location.href = domain + "/article";
//          window.history.go(0);
        }
         var active = function(){
        	
            showLogin = false;
            window.location.href = domain + "/activity";
//          window.history.go(0);
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    // $("#home, #login, #article,#active, #shopping").click(function(){
    $("#home, #login, #article,#active").click(function(){
        var id = $(this).attr("id");
        router(id);
    })
    
    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
	// console.log('logo:',favicon);
	$('#favicon').attr('href', favicon);

//left-navbar show words
$("#login, #article, #project, #active, #shopping, #zone").hover(function(e) {
	var id = $(this).attr("id");
	if(id != 'login') {
		$(this).find(".word").show();
		$(this).css("line-height", "50px");
		$("#" + id + " .word").css("margin-top", "-20px");
	} else {
		if(!isLogin) {
			$(this).find(".word").show();
			$(this).css("line-height", "50px");
			$("#" + id + " .word").css("margin-top", "-20px");
		}
	}
}, function() {
	var id = $(this).attr("id");
	$(this).find(".word").hide();
	$(this).css("line-height", "65px");
	$("#" + id + " .word").css("margin-top", "-55px");
})

init(localStorage.getItem('token'));
var qiniu_uptoken = '';
var saveto = 'qiniu';
var __init = function() {
	$.ajax({
		url: QINIU_UPTOKEN_URL,
		type: 'get',
		dataType: 'json',
		success: function(data) {
			qiniu_uptoken = data.uptoken;
		},
		error: function(xhr) {
			console.log(xhr);
		}
	});
}

$(document).ready(function() {
	var currWidth = $(window).height() - 90;
	var currHeight = $(window).height() - 90;
	setHeight(currHeight + 90);
	var tusitemp = "";
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

	$('.upload').click(function() {
		$('.form-horizontal').css("display", "block")
	})

	$('.top .y i').click(function() {
		$('.form-horizontal').css("display", "none")
	})

	$('.phone input').change(function() {
		var phone = $('.phone input').val();
		//正则验证
		var myreg = /^1[0-9]{10}$/;
		var result = myreg.test(phone);
		if(!result) {
			$('.phone span').css("display", "block")
		} else {
			$('.phone span').css("display", "none")
		}
	});

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                });
            },
            'BeforeUpload': function(up, file) {
            },
            'UploadProgress': function(up, file) {
            },
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);

                var path = res.key;

                var sourceLink = domain + res.key;
                $("#img").attr('src', sourceLink);
                $("input[name=thumb_image]").val(res.key);

				$.ajax({
					url: USER_AVATAR,
					type: 'POST',
					data: {
						avatar: path
					},
					success: function(data) {
						// console.log(data);
						if(data.code === 200) {
							layer.msg("头像设置成功", { time: 2500 });
						} else {
							console.info(data.message);
						}
					},
					error: function(error) {
						console.error(error);
					}
				})
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "pages/article/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

	var weid = localStorage.getItem("weid");
	var token = localStorage.getItem("token");
	if(token) {
		$.ajaxSetup({
			global: true,
			headers: {
				'Token': token,
			}
		});
	}

	//更新用户信息
	var openId;
	var province;
	var area;
	function userInfo(data) {
		var userInfo = data.data;
		console.log('userInfo:', userInfo)
		if(!userInfo) {
			return false;
		}
		openId = userInfo.openid;
		if(openId != undefined && openId != "") {
			$(".contact span").text("已绑定");
		} else {
			$(".contact span").text("未绑定");
			wxBind();
		}

		//用户头像
		var avatar = userInfo.avatar;
		if (avatar) {
			if (avatar.indexOf('http') === -1){
				avatar = ApiMaterPlatQiniuDomain + avatar;			
			}
		} else {
			avatar = "/common/img/my.png"
		}

		$("input[name='thumb_image']").val(avatar);
		$("#img").attr("src", avatar);

		localStorage.setItem('avatar', avatar);

		init(localStorage.getItem('token'));

		$(".username input").val(userInfo.real_name);
		$(".nickname input").val(userInfo.nickname);
		$(".phone input").val(userInfo.phone);
		switch(userInfo.sex) {
			case 1:
				$(".unknown").attr("checked", true);
				break;
			case 2:
				$(".female").attr("checked", true);
				break;
			case 3:
				$(".male").attr("checked", true);
				break;
		}
		$(".information textarea").val(userInfo.motto);
		// console.log("userInfo.province_id", userInfo.province_id)
		// console.log("userInfo.area_id", userInfo.area_id)
		
		var city = function(province, area){
			$.ajax({
				url: apiUrl+"area/list/" + province,
				dataType: "json",
				type: "GET",
				headers: {
					'Token': localStorage.getItem('token')
				},
				success: function(data) {
					console.log(data);
					if(data.code === 200) {
						var we_city11 = "";
						data.data.list.forEach(function(value, index) {
							we_city11 += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
						})
						$("#we_city3").append(we_city11);
						$("#we_province2").val($("#we_province2 #" + province).val());
						// console.log('area:', $("#" + area).val())
						if (area == null || area == "") {
							$("#we_city3").val($("#294").val()); //默认值
						} else {
							$("#we_city3").val($("#we_city3 #" + area).val());
						}									
					}
				}
			})
		} 
		 
		province = userInfo.province_id;
		area = userInfo.area_id;
		var item_id;
		$.ajax({
			type: "GET",
			headers: {
				'Token': localStorage.getItem('token')
			},
			url: apiUrl+"province/list",
			dataType: "json",
			success: function(data) {
				// console.log(data);
				if(data.code === 200) {
					//拿到省的id  
					Province = data.data.list;
					Province.map(function(item) {
						item_id = item.id
						// console.warn(item_id);
					});
					var we_province11 = "";
					data.data.list.forEach(function(value, index) {
						we_province11 += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>"
					})
					$("#we_province2").append(we_province11);

					if (province == null || province == "") {
						province = 27;
						city(province, area);
					} else {
						city(province, area);
					}
				}
			}
		})

		//触发省级变更市级
		$("#we_province2").on("change", function(e) {
			$("#we_area5").find("option").remove();
			$.ajax({
				type: "GET",
				headers: {
					'Token': localStorage.getItem('token')
				},
				url: apiUrl+"area/list/" + $('#we_province2 option:selected').attr('id'),
				dataType: "json",
				success: function(data) {
					//				console.log(data);
					if(data.code === 200) {
						var we_city_oo = "";
						data.data.list.forEach(function(value, index) {
							// console.warn(data.data.list[index])
							we_city_oo += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
						})
						$("#we_city3").html(we_city_oo);						
					}
				},
				error: function() {
					console.log("出错了");
				}
			});
		});
	}

	$.ajax({
		url: USERDETAIL + '/' + localStorage.getItem('weid'),
		//url: USERDETAIL,
		success: function(data) {
			if(data.code === 200) {
				// console.log(data);
				userInfo(data);
			} else {
				console.error(data.message);
			}
		}
	})

	var gend = 1;
	$(".unknown").click(function() {
		gend = 1;
	})
	$(".female").click(function() {
		gend = 2;
	})
	$(".male").click(function() {
		gend = 3;
	})

	//更新用户资料
	var update = function() {
		var avatar = $("input[name=thumb_image]").val();
		var name = $('.username input').val();
		var nickname = $('.nickname input').val();
		var phone = $('.phone  input').val();
		var gender = gend;
		var province_id = $("#we_province2 option:selected").attr("id");
		var area_id = $("#we_city3 option:selected").attr("id");
		var wx = false;
		var summary = $('.information textarea').val().substring(0,90);

		if (avatar) {
			if (avatar.indexOf('http') === -1){
				avatar = ApiMaterPlatQiniuDomain + avatar;
			}
		} else {
			avatar = "/common/img/my.png"
		}

		var send = {
			'avatar': avatar,
			'real_name': name,
			'nickname':nickname,
			'phone': phone,
			'sex': gender,
			'motto': summary,
			'province_id': province_id,
			'area_id': area_id
		}

		$.ajax({
			url: USERINFO + '/' + localStorage.getItem('weid'),
			type: 'POST',
			data: send,
			success: function(data) {
				// console.log(data);
				if(data.code === 200) {
					// console.log("000000000", data);
					layer.msg("保存设置成功", { time: 2500 });
					localStorage.setItem('avatar', avatar);
					window.location.href = '/user';
				} else {
					layer.msg(data.message, { time: 2500 });
				}
			},
			error: function(error) {
				console.error(error);
			}
		})
	}

	$(".update").click(function() {
		update();
	})

	//微信绑定
	var checkOpenId = function(rand, qrUrl) {
		$.ajax({
			url: OPENID + rand,
			type: 'GET',
			success: function(data) {
				// console.log(data);
				var openid = data.data.openid;
				if (openid != null) {					
					//已绑定微信
					$(".contact span").text("已绑定");
				} else {
					qrWindow(rand, qrUrl)
				}
			},
			error: function(error) {
				console.log(error);
			}
		})
	}

	var qrWindow = function(rand, qrUrl) {
		$.ajax({
			url: QRCODE + '?size=150&url=' + qrUrl,
			type: 'GET',
			success: function(data){
				//console.log(data);
				//$(".contact span").text("未绑定");
				$(".right .contact i").click(function(){
					layer.open({
						type: 1
						,title: '扫描二维码'
						,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
						,area: ['400px', '300px']
						,id: 'layerDemo'+type //防止重复弹出
						,content: '<div style="padding: 20px 100px;"><img width="100%" src=' + QRCODE + '?size=150&url=' + qrUrl + '></div>'
						//,btn: '关闭全部'
						,btnAlign: 'c' //按钮居中
						,shade: 0 //不显示遮罩
						,yes: function(){
							layer.closeAll();
						}
					});

					var check = setInterval(function(){
						$.ajax({
							url: OPENID + rand,
							type: 'GET',
							success: function(data) {
								// console.log(data);
								var openid = data.data.openid;
								if (openid != null) {
									layer.closeAll();
									//更新数据
									// $.ajax({
									// 	url: USERINFO + '/' + localStorage.getItem('weid'),
									// 	type: 'POST',
									// 	data: {openid: openid},
									// 	success: function(data) {
									// 		console.log(data);
									// 		if(data.code === 200) {
									// 			console.log(data);
									// 			layer.msg('保存设置成功', { time: 2500 });
									// 			window.location.href = '/user';
									// 		} else {
									// 			layer.msg(data.message, { time: 2500 });
									// 		}
									// 	},
									// 	error: function(error) {
									// 		console.error(error);
									// 	}
									// })
									 $.ajax({
										url: apiUrl + '/userAct',
										type: 'POST',
										data: {from_type:1,weid:localStorage.getItem('weid'),phone: openid,type:2},
										success: function(data) {
											if(data.code === 200) {
												//已绑定微信
												$(".contact span").text("已绑定");
												layer.msg('保存设置成功', { time: 2500 });
												window.location.href = '/user';
											} else {
												layer.msg(data.message, { time: 2500 });
											}
										},
										error: function(error) {
											console.error(error);
										}
									})
									clearInterval(check);
								} else {
									// console.log('go on')
								}
							},
							error: function(error) {
								console.log(error);
							}
						})
					}, 1000)
				})
			},
			error: function(error){
				console.log(error);
			}
		})
	}
	var wxBind = function() {
		$.ajax({
			url: WXlOGINQR,
			type: 'GET',
			success: function(data) {
				// console.log(data);
				var qrUrl = data.data.loginQRUrl;
				var rand = data.data.random;
				checkOpenId(rand, qrUrl);
			},
			error: function(error) {
				console.log(error);
			}
		})
	}
})




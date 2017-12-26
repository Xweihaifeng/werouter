$(document).ready(function() {
	start();
	var adminWeId = getParam('weid');
	var init = function() {
		$.ajax({
			url: ApiUrl + "roles",
			type: 'get',
			dataType: 'JSON',
			success: function(result) {
				if(result.code === 200) {
					var opt = '';
					$.each(result.data.list, function(key, val) {
						opt += '<option name="options" value=' + val.weid + '>' + val.display_name + '</option>';
					});
					$("#role_id").html(opt);
					$.ajax({
						url: ApiUrl + "admins/detail/" + adminWeId,
						type: 'get',
						dataType: 'JSON',
						success: function(result) {
							if(result.code === 200) {
								$("#role_id").find("option[value=" + result.data.role_id + "]").attr("selected", true);
								$('#userName').val(result.data.username);
								$('#phone').val(result.data.phone);
								$('#real_name').val(result.data.real_name);
								$('input:radio[name="list"]').get(result.data.sex-1).checked = true;
								$('#memox').val(result.data.memo);
							} else {
								parent.layer.msg(result.message);
								return false;
							}
						}
					});
				} else {
					parent.layer.msg(result.message);
					return false;
				}
			}
		});		
	};

	function getParam(paramName) {
		var paramValue = "",
			isFound = !1;
		if(this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
			arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
			while(i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
		}
		return paramValue == "" && (paramValue = null), paramValue
	};

	$('#updateSet').click(function() {
		$('#form').data('bootstrapValidator').validate();  
		if(!$('#form').data('bootstrapValidator').isValid()){  
			return ;  
		} 
		var formList = {
			'role_id': $("#role_id").find("option:selected").val(),
			'username': $('#userName').val(),
			'password': $('#password').val(),
			'rePassword': $('#rePassword').val(),
			'phone': $('#phone').val(),
			'real_name': $('#real_name').val(),
			'sex': $('input:radio[name="list"]:checked').val(),
			'memo': $('#memox').val()
		};
		// alert(adminWeId);
		// console.log(formList);
		$.ajax({
			url: ApiUrl + 'admins/updated/'+adminWeId,
			type: 'post',
			dataType: 'json',
			data: formList,
			success: function(data) {
				if(data.code === 200) {
					showTips('修改成功!',2,'alert-info');
					location.href = 'admins.html';
					console.log('ok');
				} else {
					showTips(data.message,2,'alert-danger');
					console.log('error: -200');
				}
			},
			error: function(xhr) {
				console.log(xhr);
			}
		})
	});
	$('#form').bootstrapValidator({
         message: 'This value is not valid',
         feedbackIcons: {
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
         },
         fields: {
            password :{  
                    message:'密码无效',  
                    validators:{
                        stringLength:{  
                            min:6,  
                            max:32,  
                            message:'密码长度为1-32位'  
                        }
                    }  
            },
        phone :{  
		                    message:'手机号码无效',  
		                    validators:{  
		                        notEmpty:{  
		                            message:'手机号码不能为空'  
		                        }, 
		                        regexp: {
		                         regexp: /^1[34578]\d{9}$/,
		                         message: '手机号码错误'
		                     }
		                    }  
		            }, 
		rePassword :{  
		                    message:'重复密码无效',  
		                    validators:{
		                        stringLength:{  
		                            min:6,  
		                            max:32,  
		                            message:'重复密码长度为1-32位'  
		                        }
		                    }  
		            },   
         }
     });
	function showTips(tips, time, el) {
        var windowWidth = document.documentElement.clientWidth;
        var tipsDiv = '<div class="alert ' + el + '" role="alert">' + tips + '</div>';

        $('body').append(tipsDiv);
        $('div.alert').css({
            'top': '220px',
            'left': (windowWidth / 2) - (tips.length * 10 / 2) + 'px',
            'position': 'absolute',
            'padding': '3px 5px',
            'background': '#ffffff',
            'width': '200px',
            'font-size': 14 + 'px',
            'margin': '0 auto',
            'text-align': 'center',
            'z-index': '5000',
            'line-height': '230%',
            'opacity': '0.8'
        }).show();
        setTimeout(function () {
            $('div.alert').fadeOut();
            $('.alert').remove();
        }, (time * 1000)
        );
    }
	init();
    $(".wenhao").hover(function(){
        $(".wenhao-tishi").show();
    },function(){
        $(".wenhao-tishi").hide();
    });
    $(".wenhao1").hover(function(){
        $(".wenhao-tishi1").show();
    },function(){
        $(".wenhao-tishi1").hide();
    });
    $(".wenhao2").hover(function(){
        $(".wenhao-tishi2").show();
    },function(){
        $(".wenhao-tishi2").hide();
    });
    $(".wenhao3").hover(function(){
        $(".wenhao-tishi3").show();
    },function(){
        $(".wenhao-tishi3").hide();
    });
});
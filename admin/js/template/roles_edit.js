$(document).ready(function() {
	start();
	var rolesWeId = getParam('weid');
	var init = function() {
		$.ajax({
			url: ApiUrl + "roles/" + rolesWeId,
			type: 'get',
			dataType: 'JSON',
			success: function(result) {
				if(result.code === 200) {
                    $('#name').val(result.data.name);
					if (result.data.name == 'superManager') {
                        $('#name').val(result.data.name).attr('readonly', true);
					}
					$('#display_name').val(result.data.display_name);
                    $("input[name=status][value=" + result.data.status + "]").attr('checked', true);
					$('#describe').val(result.data.description);
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
		var formList = {
			'name': $('#name').val(),
			'display_name': $('#display_name').val(),
			'status': $("input[name='status']:checked").val(),
			'description': $("#describe").val()
		}
		$.ajax({
			url: ApiUrl + 'roles/'+rolesWeId,
			type: 'post',
			dataType: 'json',
			data: {
				name: formList.name,
				display_name: formList.display_name,
                status: formList.status,
				description: formList.description
			},
			success: function(data) {
				console.log(data);
				if(data.code === 200) {
					showTips('修改成功!',2,'alert-info', 1);
					console.log('ok');
				} else {
					showTips(data.message,2,'alert-danger', 2);
					console.log('error: -200');
				}
			},
			error: function(xhr) {
				console.log(xhr);
			}
		})
	});

	function showTips(tips, time, el, res) {
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
            if (res === 1) {
                location.href = 'roles.html';
            }
        }, (time * 1000)
        );
    }
	init();
});
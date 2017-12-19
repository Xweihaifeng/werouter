$(document).ready(function () {
	start();
	var menusWeId = "";
    var html = '';
	var init = function () {
		$.ajax({
			url: ApiUrl + "admins/get_config",
			type: 'get',
			dataType: 'JSON',
			success: function (result) {
				if (result.code === 200) {
					html += result.data.html;
                    $("#menu_role").html(html).css('font-size','14px');
				} else {
					parent.layer.msg(result.message);

					return false;
				}
			}
		});
	};

    $('#updateSet').click(function () {
        var formList = {
            'name': $('#name').val(),
            'display_name': $('#display_name').val(),
            'activation': $("#activation").find("option:selected").val(),
            'description': $("#describe").val()
        }
        $.ajax({
            url: ApiUrl + 'admins/set_config',
            type: 'post',
            dataType: 'json',
            data: {
                name: formList.name,
                display_name: formList.display_name,
                activation: formList.activation,
                description: formList.description
            },
            success: function (data) {
                if (data.code === 200) {
                    showTips('操作成功!', 2, 'alert-info', 1);
                } else {
                    showTips(data.message, 2, 'alert-danger', 2);
                }
            },
            error: function (xhr) {
                showTips('操作失败! ', 2, 'alert-danger', 2);
            }
        });
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
$(document).ready(function () {
	start();
	var adminWeId = getParam('weid');
	var init = function () {
		$.ajax({
			url: ApiUrl + "menus/" + adminWeId,
			type: 'get',
			dataType: 'JSON',
			success: function (result) {
				if (result.code === 200) {
					if (result.data.parent_id) {
						$('#parent_id').val(result.data.parent_id).attr('disabled', true);
					} else {
						$('#parent_id').val('已是父级').attr('disabled', true);
					}
					$('#name').val(result.data.name);
					$('#menus_url').val(result.data.url);
					$('#menus_icon').val(result.data.icon);
					$('#menus_sort').val(result.data.sort);
					$('#menus_leves').val(result.data.leves);
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
		if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
			arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;
			while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
		}
		return paramValue == "" && (paramValue = null), paramValue
	};

	$('#updateSet').click(function () {
		var params = {
			'name': $('#name').val(),
			'url': $('#menus_url').val(),
			'ico': $('#menus_icon').val(),
			'parent_id': $('#parent_id').val(),
			'sort': $('#menus_sort').val(),
			'levels': $('#menus_leves').val()
		};
		if (params.parent_id == '已是父级') {
			params.parent_id = '';
		}
		$.ajax({
			url: ApiUrl + 'menus',
			type: 'post',
			dataType: 'json',
			data: {
				name: params.name,
				url: params.url,
				icon: params.ico,
				parent_id: params.parent_id,
				sort: params.sort,
				levels: params.levels
			},
			success: function (data) {
				if (data.code === 200) {
					showTips('修改成功!', 2, 'alert-info');
				} else {
					showTips('修改失败! ' + data.message, 2, 'alert-danger');
					console.log('error: -200');
				}
			},
			error: function (xhr) {
				console.log(xhr);
			}
		})
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
});
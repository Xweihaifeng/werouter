$(document).ready(function () {
	start();
	$('#updateSet').click(function () {
		var params = {
			'name': $('#menus_name').val(),
			'url': $('#menus_url').val(),
			'ico': $('#ico').val(),
			'parent_id': $('#parent_id').val(),
			'sort': $('#sort').val(),
			'levels': $('#leves').val()
		};
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
					showTips('添加成功!',2,'alert-info');
				} else {
					showTips('添加失败!'+data.message,2,'alert-danger');
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
});
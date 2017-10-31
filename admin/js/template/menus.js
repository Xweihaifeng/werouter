$(document).ready(function () {
	start();
	var menusWeId = "";
	var init = function () {
		$.ajax({
			url: ApiUrl + "menus",
			type: 'get',
			dataType: 'JSON',
			success: function (result) {
				if (result.code === 200) {
					var html = '',
						menusSon = '',
						grandson = '';
					$.each(result.data, function (key, val) {
						if (val.name) {
							if (val.son.length > 0) {
								$.each(val.son, function (k, v) {
									if (v.name) {
										if (v.grandson.length > 0) {
											$.each(v.grandson, function (m, n) {
												if (n.name) {
													grandson += '<ul><li><span><i class="icon-minus-sign"></i>' + n.name + '</span><p class="btn-group pull-right" style="margin:0"><a class="pull-right btn btn-danger btn-xs" data-toggle="modal" data-target="#myModal" data-title="'+n.name+'" data-id="'+n.weid+'" style="margin-left:10px" href="#">删除</a></p><div class="pull-right btn-group" data-name="'+val.weid+'" data-status="'+val.status+'"><a href="#" class="btn btn-success btn-xs" data-status="1">开启</a><a href="#" class="btn btn-default btn-xs" data-status="2">关闭</a></div><a class="pull-right btn btn-primary btn-xs" style="margin-right:10px" href="menus_edit.html?weid=' + n.weid + '">编辑</a></li></ul>';
												} else {
													grandson = "";
												}
											});
											menusSon += '<ul><li><span><i class="glyphicon glyphicon-minus-sign"></i>' + v.name + '</span><p class="btn-group pull-right" style="margin:0"><a class="pull-right btn btn-danger btn-xs" data-toggle="modal" data-target="#myModal" data-title="'+v.name+'" data-id="'+v.weid+'" style="margin-left:10px" href="#">删除</a></p><div class="pull-right btn-group" data-name="'+val.weid+'" data-status="'+val.status+'"><a href="#" class="btn btn-success btn-xs" data-status="1">开启</a><a href="#" class="btn btn-default btn-xs" data-status="2">关闭</a></div><a class="pull-right btn btn-primary btn-xs" style="margin-right:10px" href="menus_edit.html?weid=' + val.weid + '">编辑</a>' + grandson + '</li></ul>';
											grandson = "";
										} else {
											grandson = "";
										}
									} else {
										menusSon = "";
									}
								});
							} else {
								menusSon = "";
							}
							html += '<li>' +
								'<span><i class="glyphicon glyphicon-minus-sign"></i>' + val.name + '</span><p class="btn-group pull-right" style="margin:0"><a class="pull-right btn btn-danger btn-xs" data-toggle="modal" data-target="#myModal" data-title="'+val.name+'" data-id="'+val.weid+'" style="margin-left:10px" href="#">删除</a></p><div class="pull-right btn-group" data-name="'+val.weid+'" data-status="'+val.status+'"><a href="#" class="btn btn-success btn-xs" data-status="1">开启</a><a href="#" class="btn btn-default btn-xs" data-status="2">关闭</a></div><a class="pull-right btn btn-primary btn-xs" style="margin-right:10px" href="menus_edit.html?weid=' + val.weid + '">编辑</a>' +
								menusSon +
								'</li>';
							menusSon = "";	
						} else {
							html = "";
						}
					});
					
					$("#menus_tree").html(html).css('font-size','14px').find('.btn').css('font-size','14px');
					$('.admin_tree li:has(ul)').addClass('parent_li');
					$('.admin_tree li.parent_li > span').on('click', function (e) {
						var children = $(this).parent('li.parent_li').find(' > ul > li');
						if (children.is(":visible")) {
							children.hide('fast');
							$(this).find(' > i').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
						} else {
							children.show('fast');
							$(this).find(' > i').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
						}
						e.stopPropagation();
					});
					$('.admin_tree li>div,.parent_li > div').each(function(){
						var status = $(this).attr('data-status');
						$(this).children('a[data-status="'+status+'"]').show().siblings('a').hide();
						$(this).click(function(){
							if($(this).children('a[data-status="1"]').is(':hidden')){
								$(this).children('a[data-status="1"]').show();
								$(this).children('a[data-status="2"]').hide();
							}else{
								$(this).children('a[data-status="1"]').hide();
								$(this).children('a[data-status="2"]').show();
							}
						})
					});
					$('.admin_tree li>p,.parent_li >p').each(function(){
						$(this).click(function(){
							$('#menus_fix').html($(this).children('a').attr('data-title'));
							menusWeId = $(this).children('a').attr('data-id');
							$('#confirm').attr('data-id',menusWeId);
						});
					});
				} else {
					parent.layer.msg(result.message);

					return false;
				}
			}
		});
	};
	$('#confirm').click(function(){
		var weid = $(this).attr('data-id');
		$.ajax({
			url: ApiUrl + "menus/"+weid,
			type: 'DELETE',
			dataType: 'JSON',
			success: function (result) {
				if (result.code === 200) {
					showTips('删除成功!',2,'alert-info');
					location.reload();
					console.log('ok');
				} else {
					parent.layer.msg(result.message);

					return false;
				}
			}
		});
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
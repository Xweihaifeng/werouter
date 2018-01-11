$(document).ready(function() {
	start();
	//七牛保存
	$('#updateSet').click(function() {
		var formList = {
			'bucket': $('#bucket').val(),
			'domain_custom': $('#domain_custom').val(),
			'domain_default': $('#domain_default').val(),
			'domain_https': $('#domain_https').val(),
			'notify_url': $('#notify_url').val(),
			'secret_key': $('#secret_key').val(),
			'access_key': $('#access_key').val()
		};
		$.ajax({
			url: ApiUrl + 'setting/alias/qiNiuConfig',
			type: 'post',
			dataType: 'json',
			data: {
				config: formList
			},
			success: function(data) {
				console.log(data);
				if(data.code === 200) {
					swal('提示', '保存成功', 'success');
				} else {
					console.log('error: -200');
				}
			},
			error: function(xhr) {
				console.log(xhr);
			}
		});
	});

	//微信保存
	$('#weChatSet').click(function() {
		var wechatList = {
			'wechat_appid': $('#wechat_appid').val(),
			'wechat_secretkey': $('#wechat_secretkey').val(),
			'wechat_merchant_id': $('#wechat_merchant_id').val(),
			'wechat_payment_key': $('#wechat_payment_key').val(),
			'wechat_verify_txt': $('#wechat_verify_txt').val(),
		};
		$.ajax({
			url: ApiUrl + 'setting/alias/weChatConfig',
			type: 'post',
			dataType: 'json',
			data: {
				config: wechatList
			},
			success: function(data) {
				console.log(data);
				if(data.code === 200) {
					swal('提示', '保存成功', 'success');
				} else {
					console.log('error: -200');
				}
			},
			error: function(xhr) {
				console.log(xhr);
			}
		});
	});

	//默认七牛数据
	$.ajax({
		url: ApiUrl + 'setting/alias/qiNiuConfig',
		type: 'get',
		dataType: 'json',
		success: function(result) {
			if(result.code === 200) {
				$('#bucket').val(result.data.bucket);	
				$('#access_key').val(result.data.access_key);
				$('#secret_key').val(result.data.secret_key);
				$('#domain_custom').val(result.data.domain_custom);
				$('#domain_default').val(result.data.domain_default);
				$('#domain_https').val(result.data.domain_https);
				$('#notify_url').val(result.data.notify_url);
				$('#secret_key').val(result.data.secret_key);
			} else {
				parent.layer.msg(result.message);

				return false;
			}
		},
		error: function(xhr) {
			console.log(xhr);
		}
	});

	//点击调用事件index=0为七牛,index=1为微信,index=2平台数据
	$('.box-body').eq(0).css('display', 'block').siblings('.box-body').css('display', 'none');
	$('.tab-content').children().each(function() {
		$(this).click(function() {
			var index = $(this).index();
			$(this).addClass('active').siblings().removeClass('active');
			//index==0为调用七牛数据
			switch(index) {
				case 0:
					$.ajax({
						url: ApiUrl + 'setting/alias/qiNiuConfig',
						type: 'get',
						dataType: 'json',
						success: function(result) {
							if(result.code === 200) {
								$('#bucket').val(result.data.bucket);
								$('#access_key').val(result.data.access_key);
								$('#secret_key').val(result.data.secret_key);
								$('#domain_custom').val(result.data.domain_custom);
								$('#domain_default').val(result.data.domain_default);
								$('#domain_https').val(result.data.domain_https);
								$('#notify_url').val(result.data.notify_url);
								$('#secret_key').val(result.data.secret_key);
							} else {
								parent.layer.msg(result.message);
				
								return false;
							}
						},
						error: function(xhr) {
							console.log(xhr);
						}
					});
					break;
				case 1:
					$.ajax({
						url: ApiUrl + 'setting/alias/weChatConfig',
						type: 'get',
						dataType: 'json',
						success: function(result) {
							if(result.code === 200) {
								$('#wechat_appid').val(result.data.wechat_appid);
								$('#wechat_secretkey').val(result.data.wechat_secretkey);
								$('#wechat_merchant_id').val(result.data.wechat_merchant_id);
								$('#wechat_payment_key').val(result.data.wechat_payment_key);
								$('#wechat_verify_txt').val(result.data.wechat_verify_txt);
							} else {
								parent.layer.msg(result.message);
				
								return false;
							}
						},
						error: function(xhr) {
							console.log(xhr);
						}
					});
					break;
			};
			$('.box-body').eq(index).css('display', 'block').siblings('.box-body').css('display', 'none');
		});
	});
});
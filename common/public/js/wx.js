// 微众微信公共方法调用
(function(window) {
	var wx = {};
	wx.get_openid = function(name){
		if(is_wx == 'no') return false;

		var openid = $app.get_query_string('openid');
		var get_storage_openid = $app.get_cookie('openid');
		// console.log(get_storage_openid);
		if(get_storage_openid != false){
			return true;
		}
		// console.log(get_storage_openid);
		if(openid != false)
		{
			$app.set_cookie('openid' , openid );
			//顺便微信登陆下 
			wx.wx_login(openid);
		}
		else
		{
			$app.open_page(encodeURI(api_domain + 'openid?url=' + window.location.href));
		}
	}
	// ref_type 1.微信登陆 2.手机号码传  3PC扫码 
	//微信登陆依赖VUE AXIOS
	wx.wx_login = function(openid){
		if(is_wx == 'no') return false;
		var data_post = {
			'openid': openid,
			'ref_url' : window.location.pathname,
			'ref_type' : pages_type,
			'ref_id' : '',
			'domain' : pages_index
		};
		// 发送微信登陆请求.
		ajax.post('wxlogin' , data_post).then((res)=>{
			if(res.code == 200){
				$app.set_login_data(res);
				location.reload();
			}
		});
	}

	window.$wx = wx;
})(window);
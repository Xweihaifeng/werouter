// 微众微信公共方法调用
(function(window) {
	var wx = {};
	wx.get_openid = function(name){
		alert(is_wx);
		if(is_wx == 'no') return false;
		var openid = $app.get_query_string('openid');
		var get_storage_openid = $app.get_storage('openid');

		if($app.empty(openid) == true && $app.empty(get_storage_openid) == false)
		{
			$app.set_cookie('openid' , openid , 7);
			$app.set_storage('openid' , openid);
			alert(openid);
			//顺便微信登陆下
			wx.wx_login(openid);
		}
		else
		{
			window.location.href = encodeURI(api_domain + 'openid?url=' + window.location.href)
		}
	}

	//微信登陆依赖VUE AXIOS
	wx.wx_login = function(openid){
		if(is_wx == 'no') return false;
		var data_post = {
			'openid': openid,
			'ref_url' : window.location.pathname,
			'ref_type' : 2,
			'ref_id' : '',
			'domain' : pages_index
		};
		// 发送微信登陆请求.
		ajax.post('wxlogin' , data_post).then((res)=>{
			if(res.code == 200){
				$app.set_login_data(res);
			}
		});
	}

	window.$wx = wx;
})(window);
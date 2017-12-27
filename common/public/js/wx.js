// 微众微信公共方法调用
(function(window) {
	var wx_init = {};
	// 初始化微信SDK
	wx_init.share = function(data_share)
	{
		if(is_wx == 'no') return false;
		var pop = $app.get_router('pop');
		
		ajax.post('wxjssdk' , {currenturl: window.location.href}).then((res)=>{
			if($app.empty(res.data) == false) return false;
			wx.config({
				debug: false,
				appId: res.data.appId,
				timestamp: res.data.timestamp,
				nonceStr: res.data.nonceStr,
				signature: res.data.signature,
				jsApiList: ['onMenuShareTimeline' , 'onMenuShareAppMessage']
			});
			wx.ready(function() {
		        wx.onMenuShareTimeline({
		            title: data_share.title,
		            // 分享标题
		            link: data_share.link,
		            // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		            desc: data_share.desc,
		            //分享描述
		            imgUrl: data_share.imgUrl,
		            //imgUrl: 'http://images.wezchina.com/pages/article/1512179569854.png',
		            // 分享图标
		            success: function() {
		                mb_message('分享成功');
		            },
		            cancel: function() {
		                mb_message('分享失败');
		            }
		        });
		        wx.onMenuShareAppMessage({
		            title: data_share.title,
		            // 分享标题
		            link: data_share.link,
		            // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
		            desc: data_share.desc,
		            //分享描述
		            imgUrl: data_share.imgUrl,
		            // 分享图标
		            type: '',
		            // 分享类型,music、video或link，不填默认为link
		            dataUrl: '',
		            // 如果type是music或video，则要提供数据链接，默认为空
		            success: function() {
		                mb_message('分享成功');
		            },
		            cancel: function() {
		                mb_message('分享失败');
		            }
		        });
	    	});
		});
	}
	wx_init.get_openid = function(name){
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
			wx_init.wx_login(openid);
		}
		else
		{
			$app.open_page(encodeURI(api_domain + 'openid?url=' + window.location.href));
		}
	}
	// ref_type 1.微信登陆 2.手机号码传  3PC扫码 
	//微信登陆依赖VUE AXIOS
	wx_init.wx_login = function(openid){
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

	window.$wx = wx_init;
})(window);
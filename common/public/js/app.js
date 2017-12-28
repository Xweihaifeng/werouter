// 微众公共方法调用.
(function(window) {
	var app = {};
	//获取GET参数
	app.get_query_string = function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  decodeURIComponent(r[2]); return false;
	}

	// 七牛图片
	app.qiniu = function(value , width , height , mode){
		if (!value) return '';

		if(value.indexOf('http') !== -1){
		    return value;
		}
		
		var settings = http_type + plats_qiniu.domain_custom + '/';

		if($app.empty(width) == false || $app.empty(height) == false )
	    {
	        return settings + value;
	    }
	    else
	    {
	        if (mode != undefined) {
	            return settings + value + '?imageView2/' + mode + '/w/' + width + '/h/' + height;
	        } else {
	            return settings + value + '?imageView2/3/w/' + width + '/h/' + height;
	        }
	    }
	}
	
	//验证是否是空
	app.empty = function(params){
		if(typeof(params) == 'object')
		{
			if(Object.keys(params).length == 0 )
			{
				return false;
			}
		}
		if(params !== null && params !== undefined && params !== '' && typeof(params) !== "undefined")
		{
			return true;
		}
		return false;
	}
	// 写入COOKIE
	app.set_cookie = function(key  , val ,expiredays){
		var Days = expiredays;
		Days = 365;
		var exp = new Date();
		var domain = '.'+root_domain;
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = key+"="+ escape (val) + ";expires=" + exp.toGMTString() +";path=/;domain="+domain;
	}
	app.del_cookie = function(name)
	{
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        console.log(keys);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
	}
	// 获取COOKIE
	app.get_cookie = function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
	    if(arr = document.cookie.match(reg)){
	        return unescape(arr[2]); 
	    }
	    else {
	        return false; 
	    }
	}
	// 写入本地容器
	app.set_storage = function(val , params){
		var dataJson = params;
		if(typeof params == 'object')
		{
			var dataJson = JSON.stringify(params);
		}
		
        localStorage.setItem(val , dataJson);
	}
	// 获取本地容器
	app.get_storage = function(val){
		var dataString = localStorage.getItem(val);
        if (dataString == null || dataString == 'undefined')
        {
            return false;
        }
        // var dataJson = JSON.parse(dataString);
        return dataString;
	}
	// 登陆成功后需要添加的数据
	app.set_login_data = function(data)
	{

		// localStorage.setItem('weid', data.data.weid);
		// localStorage.setItem('token', data.token);
		// if(app.empty(data.data.activation_status) == true)
		// {
		// 	localStorage.setItem('activation', data.data.activation_status);
		// }
		// localStorage.setItem('phone', data.data.phone);
		app.set_cookie('weid' , data.data.weid );
		app.set_cookie('token' , data.token );
	}
	// 页面跳转
	app.open_page = function(href){
		window.location.href = href;
	}
	// 修改页面标题
	app.set_title = function(title){
		document.title = title;
	}

	//获取第一段路由
	app.get_router = function(params){

		var pathname = window.location.pathname;

		if($app.empty(params) == false)
		{
			params = 1;
		}
		else
		{
			if(params == 'pop')
			{
				return pathname.substr(1).split('/').pop();
			}
		}		
		//var pathname_obj = pathname.substr(1).split('/');
		var pathname_string = pathname.substr(1).split('/').shift();
		if(pathname_string == 'm')
		{
			if($app.empty(pathname.substr(1).split('/')[params]))
			{
				return pathname.substr(1).split('/')[params];
			}
			return '';
		}
		if($app.empty(pathname.substr(1).split('/')[params-1]))
		{
			return pathname.substr(1).split('/')[params-1]; 
		}
		return '';
	}

	window.$app = app;
})(window);
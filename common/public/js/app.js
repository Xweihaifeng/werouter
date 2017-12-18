// 微众公共方法调用.
(function(window) {
	var app = {};
	
	app.get_query_string = function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)return  unescape(r[2]); return null;
	}
	
	app.empty = function(params){
		if(params !== null && params !== undefined && params !== '')
		{
			return true;
		}
		return false;
	}
	
	app.set_cookie = function(key  , val ,expiredays){
		var Days = expiredays;
		var exp = new Date();
		var domain = '.'+root_domain;
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = key+"="+ escape (val) + ";expires=" + exp.toGMTString() +";path=/;domain="+domain;
	}
	
	app.set_title = function(title){
		
		$('title').html(title);
		
	}
	
	window.$app = app;
})(window);
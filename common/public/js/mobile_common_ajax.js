// 手机版公共接口请求
(function(window) {
	var mob_ajax = {};

	//判断是否关注
	mob_ajax.if_follow  = function(domain , call){
		ajax.post('/circel/if_follow' , {domain: domain}).then((res)=>{
			call(res);
		});
	}

	//关注
	mob_ajax.relationship  = function(type, domain , call){
		ajax.post('/circel/relationship' , {type : type , domain: domain}).then((res)=>{
			call(res);
		});
	}
	
	//取消关注
	mob_ajax.quxiao  = function(domain , call){
		ajax.post('/circel/quxiao' , {domain: domain}).then((res)=>{
			call(res);
		});
	}

	//获取动态数据  type = 1 是我的动态  2是我关注人的动态
	// dynamic_type 1文章2项目3活动4商城
	mob_ajax.dynamic  = function(type , dynamic_type , call){
		ajax.get('/circel/dynamic' , {params :{type: type ,  dynamic_type : dynamic_type}}).then((res)=>{
			call(res);
		});
	}

	window.$mob_ajax = mob_ajax;
})(window);
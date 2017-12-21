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
	// dynamic_type 0全部  1文章2项目3活动4商城
	mob_ajax.dynamic  = function(type , dynamic_type , call){
		if(type == 2 && is_login == 'no')
		{
			return false;
		}
		var params = {};
		params.type = type;
		if(dynamic_type > 0)
		{
			params.dynamic_type = dynamic_type;
		}
		ajax.get('/circel/dynamic' , {params :params} ).then((res)=>{
			if(res.code == 200 && res.data.list.length > 0)
			{
				call(res);
			}
			else
			{
				return false;
			}
			
		});
	}

	window.$mob_ajax = mob_ajax;
})(window);
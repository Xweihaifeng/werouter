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

	window.$mob_ajax = mob_ajax;
})(window);
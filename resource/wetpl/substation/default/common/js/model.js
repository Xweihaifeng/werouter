// 子站接口
(function(window) {
	var sub_ajax = {};
	
	//判断是否关注
	sub_ajax.cms_content  = function(params , call){
		ajax.post('cms/contents' , {params: params}).then((res)=>{
			call(res);
		});
	}
	window.$sub_ajax = sub_ajax;
})(window);
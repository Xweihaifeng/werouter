// 子站接口
(function(window) {
	var sub_ajax = {};
	
	//CMS 新闻查询
	sub_ajax.cms_content  = function(params , call){
		ajax.get('cms/contents' , {params: params}).then((res)=>{
			call(res);
		});
	}
	
	// 广告查询
	sub_ajax.ads = function( call){
		ajax.get('cms/advs').then((res)=>{
			call(res);
		});
	}
	
	// 首页接口
	sub_ajax.index = function(call){
		ajax.get('cms/index/grid').then((res)=>{
			call(res);
		});
	}

	//查询组织分类接口
    sub_ajax.org = function(call){
        ajax.get('cms/channels/domain_query/org').then((res)=>{
            call(res);
        });
    }

	// 分站侧导航接口
    sub_ajax.aside = function(param,call){
        ajax.get('cms/channel_categories',{params:param}).then((res)=>{
            call(res);
        });
    }

	//
	sub_ajax.rcon = function(call){
		ajax.get('cms/channels/domain_query/news').then((res)=>{
			call(res);
		});
	}

	window.$sub_ajax = sub_ajax;
})(window);
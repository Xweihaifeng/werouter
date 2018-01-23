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
	
	//查询频道分类详情
    sub_ajax.cate = function(params , call){
        ajax.get('cms/channels/domain_query/'+params).then((res)=>{
            call(res);
        });
    }
    //查询频道分类
    sub_ajax.cate_tree = function(params , call){
        ajax.get('cms/cate_tree_by_channel' , {params : params}).then((res)=>{
            call(res);
        });
    }


	window.$sub_ajax = sub_ajax;
})(window);
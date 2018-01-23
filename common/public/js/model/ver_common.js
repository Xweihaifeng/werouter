// 手机版公共接口请求
(function(window) {
	var mob_ajax = {};
	
	//通用单个页面 分页方法
	mob_ajax.common_page = function(_this , params ){
		$(_this.dom).dropload({
			scrollArea : window,
			loadDownFn : (dropload)=>{
				_this.data(params , (res)=>{

                    _this.params.page++;

                    if(res == false)
                    {
                        // 锁定
                        dropload.lock();
                        // 无数据
                        dropload.noData();

                        dropload.resetload();
                        return false;
                    }

                    if(res.data.params.pageCount == res.data.params.currPage)
                    {
                        dropload.lock();

                        dropload.noData();

                    }
                    setTimeout(()=>{
                        _this.list_data = _this.list_data.concat(res.data.list);
                        dropload.resetload();
                    },500);


				});
			}
		});
	}
	
	//CMS 新闻调用
	mob_ajax.cms_lists  = function(params , call){
		ajax.get('/cms/contents' , {params : params}).then((res)=>{
			if(res.code == 200){
				if(res.data.total == 0)
				{
					call(false);
                	return true;
				}
                var pageCount = Math.ceil(res.data.total / params.limit);
                var post = {
                    data : {
                        code : 200,
                        list: res.data.list,
                        params : {
                            pageCount : pageCount,
                            currPage : params.page,
                        }
                    },
                };
                call(post);
                return true;
            }
			return false;
		});
	}
	
	//CMS 分类调用
	mob_ajax.cms_channel  = function(params , call){
		ajax.get('/cms/cate_tree_by_channel' , params).then((res)=>{
			call(res);
		});
	}

	window.$mob_ajax = mob_ajax;
})(window);
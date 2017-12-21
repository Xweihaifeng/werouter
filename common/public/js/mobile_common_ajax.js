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
	mob_ajax.dynamic  = function(params, call){
		if( params.type == 2 && is_login == 'no')
		{
			call(false);
		}
		ajax.get('/circel/dynamic' , {params :params} ).then((res)=>{

			if(res.code == 200 && res.data.list.length > 0)
			{
				if($app.empty(call) == false){
                    return false;
				}
				call(res);
			}
			else
			{
                call(false);
			}
			
		});
	}

	//通用单个页面 分页方法
	mob_ajax.common_page = function(_this , params ){
		$(_this.dom).dropload({
			scrollArea : window,
			loadDownFn : (dropload)=>{
				_this.data(params , (res)=>{
                    if(res == false)
                    {
                        dropload.resetload();
                        // 锁定
                        dropload.lock();
                        // 无数据
                        dropload.noData();
                        return false;
                    }

					setTimeout(()=>{
        			 	_this.list_data = _this.list_data.concat(res.data.list);
        			 	//if($app.empty(dropload) == false) return false;
                        // 插入数据到页面，放到最后面
                        dropload.resetload();
                        
                    },500);


        			
					if(res.data.params.pageCount == res.data.params.currPage)
        			{
                        dropload.resetload();

        				dropload.lock();

        				dropload.noData();
        				return false;
        			}
        			_this.params.page++;
				});
			}
		});
	}

	//CMS 新闻调用
	mob_ajax.cms_lists  = function(params , call){
		ajax.get('/cms/contents' , params).then((res)=>{
			call(res);
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
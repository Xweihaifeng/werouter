$(function(){
                        console.log("aaaa");
	
	//添加商品页面---添加修改配送范围
		//添加配送范围
		$(".set_adr").click(function(){
			floadbox(".roadiomode",{
				width:500,
				height:340
			})
		})
		//设置配送范围模板
		$(".add_mode").click(function(){
			modesetInt();
			floadbox(".modeset",{
				width:500,
				height:390,
				type:1
			})
		});
		//选择模版
		$(document).on("change",".roadiomode input[type = radio][name = distribution ]",function(){
			if ($(this).prop("checked")){
				var str = $.trim($(this).next().next().text());
				if ($("#pro_ship_address").find("p").length>0){
					$("#pro_ship_address").find("p").html(str);
				}else{
					$("#pro_ship_address").prepend("<p>"+str+"</p>");
				}
				if ($("#pro_ship_address").find("input[name='distribution_id']").length>0){
					$("#pro_ship_address").find("input[name='distribution_id']").val($(this).data("val"));
				}else{
					$("#pro_ship_address").find("p").after('<input type="hidden" name="distribution_id" value="'+$(this).data("val")+'"/>');
				}
				$(this).parents(".roadiomode").find("a.close").trigger("click");
			}
		})
		//区域管理页面
		//删除
		$(document).on("click",".sa_list a.del",function(){
			var id = $(this).parents("dl").data("id");
			var params = {id:id};
			$.showConfirm("确认删除模板吗？",function(){
				var cmd_index = $.showLoading("处理中");
				var callback = function(msg){
					$.hideLoading(cmd_index);
					if(msg.result == 0){
						$.showSuccess("删除成功",function(){
							window.location.reload();
						});
					}else{
						$.showErr(msg.description,function(){
							if(msg.data){
								window.location.href = msg.data;
							}
						});
					}
				}
				requestAjax(params, 'post',del_distributionURL, callback, true);
			})		
		})
		//划过
		$(document).on("mouseover",".sa_list dl",function(){
			$(this).find("dd").show();
		}).mouseout(function(){
			$(this).find("dd").hide();
		});
		//编辑
		$(document).on("click",".sa_list a.eidt",function(){
			var id = $(this).parents("dl").data("id");
			$(".setmode_btn").data("id",id);
			var params = {id:id};
			var c_ar = [];
			var get_distributionCallback = function(msg){
				if(msg.result == 0){
					var area = "";
					modesetInt();
					floadbox(".modeset",{
						width:500,
						height:390
					})
					$("#modeName").val(msg.data.name)
					address = {};
					for (var x in msg.data.area_ids ){
						var c_ar = new Array;
						var pid = x;
						var evalStr="regionConf.r"+pid+".c";
						var regionConfs=eval(evalStr);
						evalStr+=".";
						for(var key in regionConfs){
							var name = eval(evalStr+key+".n");
							var id = eval(evalStr+key+".i");
							var chkids = msg.data.area_ids[x];
							if($.inArray(""+id,chkids) != -1){
								var $li = '<li><span>'+name+'</span><input type="checkbox" data-text="'+name+'" checked = true data-pid="'+pid+'" data-id="'+id+'" /></li>';
								$(".cityul").append($li)
								c_ar.push(id);
							}else{
								var $li = '<li><span>'+name+'</span><input type="checkbox" data-text="'+name+'" data-pid="'+pid+'" data-id="'+id+'" /></li>';
								$(".cityul").append($li)
							}
						}	
						allset();
						address[pid] = c_ar;

						$(".province input[type=checkbox]").each(function(){
							if ($(this).data('id') == pid){
								$(this).attr("checked",true)
							}
						})
					}
				}else{
					$.showErr(msg.description,function(){
						if(msg.data){
							window.location.href = msg.data;
						}
					});
				}
			}
			requestAjax(params,'get', get_distributionURL,get_distributionCallback, true);
		})
		//新建模版
		$(".add_mode_btn").click(function(){
			modesetInt();
			floadbox(".modeset",{
				width:500,
				height:390
			})
		});
		//配送范围方法
		//初始
		function modesetInt(){
			$("#modeName").val("");
			$(".province input").attr("checked",false)
			$(".city input[type=checkbox]").attr("checked",false)
			$(".cityul").html("")
		}
		//全选
		function allset(){
			var b = false;
			var allch = $(".cityul").find("input[type=checkbox]");
			allch.each(function(){
				if (!$(this).prop("checked")){
					b = true;
					return false;
				}
			})
			if (b){
				$(".ci_check").prop("checked",false)
			}else{
				$(".ci_check").prop("checked",true)
			}
		}
		$(".ci_check").change(function(){
			$(".cityul").find("input[type=checkbox]").prop("checked",true)
		});
		//配送范围地址选择
		var address = {};
		var provinceidstr=[];
		$(".province").on("change","input[type=checkbox]",function(){
			var parentId = $(this).attr("data-id");
			console.log("parentId:"+parentId);
			var c_ar = [];//市id集合
			var c_ar_text = [];
			if ($(this).prop("checked")){
				//加载市区
				var pid = $(this).data("id");
				provinceidstr.push(pid);//省id集合
				// city start
				// provcity(pid);
				$.ajax({
		            url:apiUrl+'area/list/'+pid,
		            type:'get',
		            success: function(data){
		                console.log(data);
		                if (data.code == 200) {
		                    var citydata = data.data.list;
		                    citydata.map(x => {
		                        // $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");
								$(".cityul").append('<li><span>'+x.name+'</span><input type="checkbox" data-text="'+x.name+'" checked = true data-pid="'+x.province_id+'" data-id="'+x.id+'" /></li>')
								c_ar.push(x.id);
								c_ar_text.push(x.name);
		                    })
		                    
		                }else{
		                    console.log('CITYS  LIST ERROR');
		                }
		            },
		            error: function(xhr){
		                console.log(xhr);
		            }
		        })
				// city end


				/*var evalStr="regionConf.r"+pid+".c";
				var regionConfs=eval(evalStr);
				evalStr+=".";
				for(var key in regionConfs){
					var name = eval(evalStr+key+".n");
					var id = eval(evalStr+key+".i");
					var $li = '<li><span>'+name+'</span><input type="checkbox" checked = true data-pid="'+pid+'" data-id="'+id+'" /></li>';
					$(".cityul").append($li)
					c_ar.push(id);
				}
				allset();*/
				address[parentId] = c_ar;
				console.log(address);
			}else{
				deleteData(address,parentId);
				$(".cityul").find("li input[data-pid = "+parentId+"]").parents("li").remove();
			}
		})
		$(".cityul").on("change","input[type=checkbox]",function(){
			var _This = $(this);
			if ($(this).prop("checked")){
				for (var x in address ){
					if (x == $(this).attr("data-pid")){		
						address[x].push($(this).data("id"));
					}
				}
			}else{
				for (var x in address ){
					if (x == $(this).attr("data-pid")){
						for (var i=0;i<address[x].length ;i++ ){
							if (address[x][i] == $(this).data("id")){
								address[x].splice(i,1)
							}
						}
					}
				}
			}
			allset();
		})
		//保存配送范围模版
		$(".setmode_btn").click(function(){
			var areanamestr=[];

			var page = $(this).data("page")
			var id = $(this).data("id")
			var _this = $(this);
			var modeName = $("#modeName").val()
			if ($.trim(modeName) == ""){
                mess_tusi('请填写模板名称');
				// $.showErr("请填写模板名称");
				return false;
			}
			if (jQuery.isEmptyObject(address)){
				// $.showErr("请选择区域");
                mess_tusi('请选择区域');

				return false;
			}
			var area = "";
			var areaarr=[];
			var areastr=[];
			// var areanamestr="";
			$('.cityul input[type=checkbox]:checked').each(function(){
				console.log($(this).data("text"));
				areanamestr.push($(this).data("text"));
			})
			console.log(address);
			
			
			for (var x in address ){
				var pid = x;
				var pname = $(".province_check[data-id='"+pid+"']").data("text");
				var snames = [];
				// var evalStr="regionConf.r"+pid+".c";
				// var regionConfs=eval(evalStr);
				// evalStr+=".";
				console.log(pname);
				$(address[x]).each(function(index,item){
					console.log(address[x]);
					areastr.push(item);
					areanamestr=$(".cityul input[data-id='"+item+"']").data("text");

				// $(address[x]).map(x=>{
					console.log(index,item);
					// var name =eval(evalStr+"r"+item+".n");
					snames.push(areanamestr);
				

				})
				console.log(snames);
				// areanamestr=snames.join(",");
				// area += pname+"("+areanamestr.join(",")+")";
				// area += pname+"("+snames.join(",")+")";
				areaarr.push( pname+"("+snames.join(",")+")");
			}
			// console.log(area);//省城市names
			console.log(areaarr);//省城市names
			console.log(areastr.join(","));//城市id集合
			// 省id集合
			console.log(provinceidstr.join(","));
			// console.log(areanamestr.join(","));//城市names
			/*var joinsname=function(snames){
				console.log(snames);
			}*/
			//提交服务器
			var params = {area_names:areaarr.join(","),areas_ids:areastr.join(","),province_ids:provinceidstr.join(",")};
			console.log(params);
			$.ajax({
		            url:apiUrl+'goods/range/store',
		            type:'post',
		            data:params,
		            headers: {
		                'Token': localStorage.getItem('token')
		            },
		            success: function(data){
		                console.log(data);
		                if (data.code == 200) {
							address = {};
		                   	
		                    $(".setmode_btn").data("id","");
							_this.prev().trigger("click");
							mess_tusi("保存成功");
							// $.showSuccess("保存成功",function(){
								if(page){
									window.location.reload();
								}else{

									// 配送列表添加
									console.log("tianjia");
									rangelist();
									/*var modeDiv ='<div class="sa_cum">'+
											'<input type="radio" data-val="'+msg.data+'" name="distribution"/>'+
											'<h4>'+modeName+'</h4>'+
											'<div class="address">'+area
											+'</div></div>'; 
									$(".roadiomode .adressall").prepend(modeDiv);*/
								}
							// });
		                }else{
		                    console.log('RANGE  LIST ERROR');
		                }
		            },
		            error: function(xhr){
		                console.log(xhr);
		            }
		        })
			/*var save_distributionCallback = function(msg){
				address = {};
				if(msg.result == 0){
					$(".setmode_btn").data("id","");
					_this.prev().trigger("click");
					$.showSuccess("保存成功",function(){
						if(page){
							window.location.reload();
						}else{
							var modeDiv ='<div class="sa_cum">'+
									'<input type="radio" data-val="'+msg.data+'" name="distribution"/>'+
									'<h4>'+modeName+'</h4>'+
									'<div class="address">'+area
									+'</div></div>'; 
							$(".roadiomode .adressall").prepend(modeDiv);
						}
					});
				}else{
					$.showErr(msg.description,function(){
						if(msg.data){
							window.location.href = msg.data;
						}
					});
				}
			}*/
			//requestAjax(params, 'post', save_distributionURL, save_distributionCallback, true);
		});

		
		//配送范围弹层
		function floadbox(id,set){
			var box = $(id);
			var Dw = $(window).width();
			var Dh = $(window).height();
			if ($(".floadbg").length<=0){
				var bg = $("<div class='floadbg'></div>");
				$("body").append(bg);
				bg.css({"width":Dw + "px","height":Dh + "px"});
			}else{
				$(".floadbg").show();
			}
			box.show();
			box.css({"width":set.width+"px","height":set.height + "px","top":(Dh-set.height)/2 + "px","left":(Dw - set.width)/2 + "px"});
			box.find("a.close").on("click",function(){
				address = {};
				box.hide();
				$(".setmode_btn").data("id","");
				if (set.type != 1){
					$(".floadbg").hide();
				}
			})
		};
		
		//删除json对像
		function deleteData(json,name) {
			for (var x in json ){
				if (x == name){
					delete json[x];
				}
			}					
		}

});
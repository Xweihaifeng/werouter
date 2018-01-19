$(function(){
    $('.opa-pay').hide()
    $('.zfPlat_ul li').click(function(){
    $(this).addClass('cur')
    $(this).siblings().removeClass('cur')

    var _this1=null;
    _this1=$(this);
    _this1.find('.zfPlatCont').show();
  	_this1.siblings().find('.zfPlatCont').hide();

	})



	//李生 start
	var url = window.location.pathname.split('/');
	var suportid = url.pop();
	//初始化项目
	var suport_detail=function(suportid){
	    $.ajax({
	        url: PROJECT_SUPORT_DETAIL+'/' + suportid,
	        type: 'get',
	        success: function(data){
	        	console.log(data);
	            if(data.code==200){
	            	$(".ng-binding").text(data.data.sum);
	            	project_detail(data.data.project_id);
	            	projectpay(data.data);
	            }
	        },
	        error: function(xhr){
	            console.log(xhr);
	        }
	    })
	}
	suport_detail(suportid);
	var project_detail=function(projectid){
	    $.ajax({
	        url: PROJECT_DETAIL+'/' + projectid,
	        type: 'get',
	        success: function(data){
	            if(data.code==200){
					$(".main-h3").text(data.data.title);
	            }
	        },
	        error: function(xhr){
	            console.log(xhr);
	        }
	    })
	}

	//支持
	var projectpay=function(data){
		$('.tjdd_submitBtn').click(function(){
			if(data.status==2){
				layer.msg("订单已经支付！");
				return false;
			}
			//判断订单是否合法
			if($("#wechatpay").hasClass("cur")){
				console.log(data);
				couldsuportpay(data.weid);
				if(couldsuportpay(data.weid)){
					// window.location.href='/project/projectCode/'+data.weid;
				}
			}
			if($("#balancepay").hasClass("cur")){
				var suport_data=data;
				$.ajax({
			        url: USER_COULD_WITHDRAWS,
			        type: 'get',
			        success: function(data){
			            if(data.code==200){
			            	if(suport_data.sum>data.data){
			            		layer.msg("可用余额不足！");
			            	}else{
			            		//余额支付
			            		if($('input[type=number]').val()==''){
			            			layer.msg("密令为空！");
			            		}else{
			            			// balancepay(suport_data.weid);
			            			couldsuportpay(suport_data.weid);
			            		}
			            	}
						}else{
			            	layer.msg(data.message);
			            }
			        },
			        error: function(xhr){
			            console.log(xhr);
			        }
			    })
			}

		})
	}
	var flag=false;
	//余额支付
	var balancepay=function(id){
		console.log("去",id);
		//判断是否可以支付
		// if(couldsuportpay(id)){
		 // couldsuportpay(id)
		// if(flag){
			//可以支付
			var sendData={
		        suport_id:id,
		        secret:$(".secret").val(),
		    }
		    console.log(sendData);
			$.ajax({
		        url: PROJECT_SUPORT_BALANCE_PAY,
		        type: 'post',
		       	data:sendData,
		        success: function(data){
		            if(data.code==200){
		            	layer.msg("支付成功");
		            	window.location="/user/myproject/support";
					}else{
		            	layer.msg(data.message);
		            }
		        },
		        error: function(xhr){
		            console.log(xhr);
		        }
		    })
		// }
	}

	//判断是否可以支持
	var couldsuportpay=function(id){
		$.ajax({
	        url: PROJECT_SUPORT_COULD_PAY+'/' + id,
	        type: 'get',
	        success: function(data){
	            if(data.code==200){
	            	flag=true;
	            	// return true;
	            	if($("#wechatpay").hasClass("cur")){
						window.location.href='/project/projectCode/'+id;
					}else{
	            		balancepay(id);

					}
	            }else{
	            	layer.msg(data.message);
	            	flag=false;
	            	// return false;
	            }
	        }
	    })
	}

	//李生 end
})











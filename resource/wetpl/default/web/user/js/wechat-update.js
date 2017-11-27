/**
 * Created by weifeng on 2017/11/24.
 */

$(document).ready(function(){
    //  登录token参数
    var token = window.localStorage.getItem('token'), get_weid = '';
    if(token) {
        $.ajaxSetup({
            global: true,
            async:  false,
            headers: {
                'Token': token,
            }
        });
    }

    function pages_wechat_detail() {
    	var options106 = $.post(apiUrl + "pages/wechat/detail");
    	options106.done(function(data) {
	    	if(data.code == 200 && data.data) {
	    		var result105 = data.data;
	    		get_weid = result105.weid;
	    		$("#app_id")		 .val(result105.app_id);
	    		$("#app_cert")	     .val(result105.app_cert);
	    		$("#merchant_id")	 .val(result105.merchant_id);
	    		$("#merchant_key")	 .val(result105.merchant_key);
	    		$("#apiclient_cert") .val(result105.apiclient_cert);
	    		$("#apiclient_key")	 .val(result105.apiclient_key);
	    	}
	    });
	    options106.fail(function(fail) {
	    	console.error(error);
	    });
    }

    var options105 = $.post(apiUrl + "pages/wechat/initWechat");
    options105.done(function(data) {
    	if(data.code == 200 && data.data) {
    		pages_wechat_detail();
    	}
    });
    options105.fail(function(fail) {
    	console.error(error);
    });
    
    function clear() {
    	$("#myModal").hide();
		$("body").removeClass("modal-open");
		$("#myModal").removeClass("in").hide();
		$(".modal-backdrop.fade.in").remove();
	}
    
    $("#save_setup").click(function() {
    	$("#myModal").show();
    	var body107 = new Object();
    		body107.weid            = get_weid;
	    	body107.app_id 			= $("#app_id")		 	.val();
	    	body107.app_cert 		= $("#app_cert")	    .val();
	    	body107.merchant_id 	= $("#merchant_id")	 	.val();
	    	body107.merchant_key 	= $("#merchant_key")	.val();
	    	body107.apiclient_cert 	= $("#apiclient_cert") 	.val();
	    	body107.apiclient_key 	= $("#apiclient_key")	.val();

	    if(!get_weid
    	|| !body107.app_id
    	|| !body107.app_cert
    	|| !body107.merchant_id
    	|| !body107.merchant_key
    	|| !body107.apiclient_cert
    	|| !body107.apiclient_key) {
    		$("#wechat_save").hide();
    		$(".modal_info").html("信息都是必填项，请完善信息后重新提交").css("color", "#f00");
	    	return false;
		}
    	$("#wechat_save").show();    	
    	$(".modal_info").html("本次提交为重要信息，请确认后谨慎操作！").css("color", "");    	
	    $("#wechat_save").click(function() {
	    	var options107 = $.post(apiUrl + "pages/wechat/update", body107);
		    options107.done(function(data) {
		    	if(data.code == 200 && data.data) {
		    		console.info(data.data);
	                clear();
		    		layer.msg("修改成功！", { time: 1500 });
		    	}
		    });
		    options107.fail(function(fail) {
		    	console.error(error);
		    });
	    });
	    
    });

	$(".close_modal").click(function() {
    	clear();
    });
})
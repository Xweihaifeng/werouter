/**
 * Created by weifeng on 2017/11/24.
 */

$(document).ready(function(){
    //  登录token参数
    var token = window.localStorage.getItem('token'), get_weid = '', mall_user_id = '';
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
                get_weid=result105.weid;
                mall_user_id=result105.plat_user_id;
                $("input[name=weid]").val(result105.weid);
                $("#app_id")		 .val(result105.app_id);
	    		$("#app_cert")	     .val(result105.app_cert);
	    		$("#merchant_id")	 .val(result105.merchant_id);
	    		$("#merchant_key")	 .val(result105.merchant_key);
	    		$("#apiclient_cert") .val(result105.apiclient_cert);
	    		$("#apiclient_key")	 .val(result105.apiclient_key);
                $("#filename").html(result105.verify_file_name);
                $("input[name=verify_file_name]").val(result105.verify_file_name);

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
    /*
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
            body107.verify_file_name 	= $("input[name=verify_file_name]")	.val();
        if (!get_weid
            || !body107.app_id
            || !body107.app_cert
            || !body107.merchant_id
            || !body107.merchant_key
            || !body107.apiclient_cert
            || !body107.apiclient_key
            || !body107.verify_file_name) {
            $("#wechat_save").hide();
            $(".modal_info").html("信息都是必填项，请完善信息后重新提交").css("color", "#f00");
            return false;
        }
    	$("#wechat_save").show();    	
    	$(".modal_info").html("本次提交为重要信息,请仔细检查确无误后再提交（如果有误平台支付模块将报错此信息必须和微信公众平台，商户平台信息保存一致并且是可用状态）请确认后谨慎操作！").css("color", "#f00");
        $("#wechat_save").click(function() {
            $('#uploadForm').submit();
        });
	    
    });
    */
	$(".close_modal").click(function() {
    	clear();
    });

    //检验文件
    $("input[name=verify_file]").change(function () {
        var file = $("input[name=verify_file]").get(0).files[0];
        if (file.type.indexOf("text") > -1) {
            //允许上传的类型
        } else {
            $('input[name=verify_file]').val('');
            layer.msg("类型有误必须为微信公众平台授权回调域名验证文件！", {time: 5000});
            return false;
        }
        $("input[name=verify_file_name]").val(file.name);
        $("#filename").html(file.name);
    });
    $("#wechat_open_save").click(function () {
        var body107 = new Object();
        body107.weid            = get_weid;
        body107.app_id 			= $("#app_id")		 	.val();
        body107.app_cert 		= $("#app_cert")	    .val();
        if(!body107.app_id){
            layer.msg("公众号id为空！", {time: 5000});
            return false;
        }
        if(!body107.app_cert){
            layer.msg("公众号秘钥为空！", {time: 5000});
            return false;
        }
        addWechatPost(new FormData($("#uploadForm")[0]));
    });


    $('#open').click(function(){
        var text = $(this).text();
        if(text === "展开"){
            $('.open_content0').stop().slideDown(400);
            $(this).text("收起");
        }else {

            $('.open_content0').stop().slideUp(400);
            $(this).text("展开");

        }
    });
    $('#open1').click(function(){
        var text = $(this).text();
        if(text === "展开"){
            $('.open_content1').stop().slideDown(400);
            $(this).text("收起");
        }else {
            $('.open_content1').stop().slideUp(400);
            $(this).text("展开");

        }
    });
    $('#open2').click(function(){
        var text = $(this).text();
        if(text === "展开"){
            $('.open_content2').stop().slideDown(400);
            $(this).text("收起");
        }else {
            $('.open_content2').stop().slideUp(400);
            $(this).text("展开");

        }
    });
    $('#open3').click(function(){
        var text = $(this).text();
        if(text === "展开"){
            $('.open_content3').stop().slideDown(400);
            $(this).text("收起");
        }else {
            $('.open_content3').stop().slideUp(400);
            $(this).text("展开");

        }
    });

    $("#wechat_merchant_save").click(function () {
        var body107 = new Object();
        body107.weid            = get_weid;
        body107.merchant_id 	= $("#merchant_id")	 	.val();
        body107.merchant_key 	= $("#merchant_key")	.val();
        body107.apiclient_cert 	= $("#apiclient_cert") 	.val();
        body107.apiclient_key 	= $("#apiclient_key")	.val();
        if(!body107.merchant_id){
            layer.msg("商户号ID为空！", {time: 5000});
            return false;
        }
        if(!body107.merchant_key){
            layer.msg("商户号密钥为空！", {time: 5000});
            return false;
        }
        if(!body107.apiclient_cert){
            layer.msg("api证书为空！", {time: 5000});
            return false;
        }
        if(!body107.apiclient_key){
            layer.msg("api证书密钥为空！", {time: 5000});
            return false;
        }
        addWechatPost(new FormData($("#uploadForm1")[0]));
    });
    $("#wechat_verify_save").click(function () {
        var body107 = new Object();
        body107.weid            = get_weid;
        body107.verify_file_name 	= $("input[name=verify_file_name]")	.val();
        if(!body107.verify_file_name){
            layer.msg("商户号ID为空！", {time: 5000});
            return false;
        }
        addWechatPost(new FormData($("#uploadForm2")[0]));
    });
    //测试
    $("#wechat_test_save").click(function () {
        var body107 = new Object();
        body107.weid            = get_weid;
        if(!body107.weid){
            layer.msg("微信配置信息不存在！", {time: 5000});
            return false;
        }
        addWechatTestPost();
    });
    //测试支付请求
    function addWechatTestPost() {
        $.ajax({
            type: "POST",
            url: apiUrl + "pages/wechatPay/wechatPayTest",
            data:{mall_user_id:mall_user_id},// 要提交表单的ID
            success: function (data) {
                if (data.code == 200) {
                    $('#myModal').find(".modal-title").text('配置成功');
                    $('#myModal').find(".modal-body").css("text-align","center");
                    $('#myModal').find(".modal-body").children().remove();
                    $('#myModal').find(".modal-body").append("<img src='"+QRCODE+"?url="+data.data.url+"' />");
                    $('#myModal').modal('show');
                } else {
                    if(data.message){
                        layer.msg(data.message, {time: 1500});
                    }else{
                        layer.msg("配置有误请仔细检查", {time: 1500});
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                layer.msg("配置有误请仔细检查", {time: 1500});
            },
        });
    }

    //提交数据
    function addWechatPost(data) {
        $.ajax({
            type: "POST",
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            url: apiUrl + "pages/wechat/update",
            data:data,// 要提交表单的ID
            success: function (data) {
                if (data.code == 200) {
                    layer.msg("修改成功！", {time: 1500});
                } else {
                    layer.msg(data.message, {time: 1500});
                }
            }
        });
    }

})
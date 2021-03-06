/**
 * Created by Hongguang on 2017/8/29.
 */
//列表折叠
sessionStorage.listname = 'we-app';

const SMS_COUNT_LIMIT = 1;

$(document).ready(function() {
    //const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';
    //  登录token参数
    var token = docCookies.getItem("token"),
        get_weid = '',
        mall_user_id = '';
    if (token) {
        $.ajaxSetup({
            global: true,
            async: false,
            headers: {
                'Token': token,
            }
        });
    }
    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    // console.log('logo:',favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    // console.log('logo:',logo);
    $('#home img').attr('src', logo);

    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle, #right").height(currHeight);

    $(window).resize(function() {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function() {
        $(".add").show();
    }, function() {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function() {
        $(".avatar").show();
    }, function() {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function() {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })


    var domain;
    var isBrand;
    var btState;
    var chatState;
    var chatState1;
    var chatState2;
    var chatState3;
    var pageId;
    var hasDomain = function(weid) {
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                /*if (data.code == 401) {
                 domain = '/index';
                 localStorage.removeItem('token')
                 window.location.href = '/login'
                }*/
                if (data.code == 200) {
                    // console.log(data);
                    if (data.data.domain == null) {
                        //没有个性域名
                        domain = '/index';
                    } else {
                        //存在个性域名
                        domain = "/" + data.data.domain;
                        isBrand = data.data.is_brand;
                        pageId = data.data.weid;
                        if (isBrand == 1) { //开启
                            btState = true;
                            $("#toggle-button-app").attr("checked", 'checked');
                        } else {
                            btState = false;
                            $("#toggle-button-app").removeAttr("checked");
                        }
                    }

                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    var weid = docCookies.getItem("weid");
    hasDomain(weid);


    // 获取用户独立短信详情
    var getSmsDetail = function(id, callback) {
        layer.load();
        $.ajax({
            url: SMS_USERSMS_DETAIBYUSERID + id,
            type: 'GET',
            success: function(data) {
                layer.closeAll('loading');
                if (data.code == 200) {
                    callback(data.data);
                } else {
                    layer.msg(data.message);
                }
            },
            error: function(error) {
                layer.closeAll('loading');
                console.log(error);
            }
        })
    }


    // 用户独立短信开关
    var toggleUsersms = function(callback) {
        layer.load();
        $.ajax({
            url: SMS_USERSMS_TOGGLE,
            type: 'POST',
            success: function(data) {
                layer.closeAll('loading');
                if (data.code == 200) {
                    callback(data.data);
                } else {
                    layer.msg(data.message);
                }
            },
            error: function(error) {
                layer.closeAll('loading');
                console.log(error);
            }
        })
    }

    /*  var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article', 'shopping'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal").show();
                $(".show-login").css({
                    "margin-left": width,
                    "margin-top": height
                });
                $(".show-login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user";
            }
        }

        var article = function(){

            showLogin = false;
            window.location.href = domain + "/article";
//          window.history.go(0);
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/

    //开启独立品牌
    var openBrand = function(pageId, status) {
        //console.log(pageId + ":" + status)
        layer.load();
        $.ajax({
            url: PAGES_UPDATE,
            type: "POST",
            headers: {
                'Token': docCookies.getItem("token")
            },
            data: {
                weid: pageId,
                is_brand: status
            },
            success: function(data) {
                layer.closeAll('loading');
                // console.log(data)
            },
            error: function(err) {
                layer.closeAll('loading');
                console.log(err)
            }
        })
    }

    var weid = docCookies.getItem("weid");
    var uid = weid;
    $("#toggle-button-app").click(function() {
        if (!btState) {
            if (!chatState2) {
                layer.msg('开启独立品牌前请先开启独立签名');
                return;
            }
            $("#toggle-button-app").attr("checked", 'checked');
            //$(".list").show();
            isBrand = 1;
            btState = true;
            openBrand(pageId, isBrand);
        } else {
            $("#toggle-button-app").removeAttr("checked");
            //$(".list").hide();
            isBrand = 2;
            btState = false;
            openBrand(pageId, isBrand);
        }
    })

    $("#we_toggle-button-app").click(function() {
        if (!chatState) {
            $("#we_toggle-button-app").attr("checked", 'checked');
            chatState = true;
        } else {
            $("#we_toggle-button-app").removeAttr("checked");
            chatState = false;
        }

    })
    $("#we_toggle-button-app2").click(function() {
        if (!chatState2) {
            getSmsDetail(uid, function(data) {
                if (data == null || data == undefined || data == "") {
                    layer.msg("请先填写并保存短信签名");
                }
                if (data.sms_count < SMS_COUNT_LIMIT) {
                    layer.msg("剩余短信数必须大于" + SMS_COUNT_LIMIT + "才能开启独立短信签名");
                    return;
                } else {
                    toggleUsersms(function(data) {
                        if (data.status == 1) {
                            $("#we_toggle-button-app2").attr("checked", true);
                            chatState2 = true;
                        } else {
                            $("#we_toggle-button-app2").removeAttr("checked");
                            chatState2 = false;
                        }
                    });
                }
            });
        } else {
            if (btState) {
                layer.msg("请确认关闭独立品牌后再关闭独立短信签名");
                return;
            }
            confirmer = layer.confirm('关闭签名后相关功能将不能正常使用，是否关闭？', {
                btn: ['确认关闭', '取消']
            }, function() {
                layer.close(confirmer);
                toggleUsersms(function(data) {
                    if (data.status == 1) {
                        $("#we_toggle-button-app2").attr("checked", true);
                        chatState2 = true;
                    } else {
                        $("#we_toggle-button-app2").removeAttr("checked");
                        chatState2 = false;
                    }
                });
            }, function() {});
        }

    })

    $("#we_toggle-button-app1").click(function() {
        var a = checkInput();
        if (a) {
            layer.msg("请先完善微信公众服务号接口配置");
            return;
        }
        if (!chatState1) {
            $("#we_toggle-button-app1").attr("checked", 'checked');
            chatState1 = true;
        } else {
            $("#we_toggle-button-app1").removeAttr("checked");
            chatState1 = false;
        }

    })

    $("#we_toggle-button-app3").click(function() {
        if (!chatState3) {
            $("#we_toggle-button-app3").attr("checked", 'checked');
            chatState3 = true;
        } else {
            $("#we_toggle-button-app3").removeAttr("checked");
            chatState3 = false;
        }

    })


    function pages_wechat_detail() {
        var options106 = $.post(apiUrl + "pages/wechat/detail");
        options106.done(function(data) {
            if (data.code == 200 && data.data) {
                var result105 = data.data;
                get_weid = result105.weid;
                mall_user_id = result105.plat_user_id;
                $("input[name=weid]").val(result105.weid);
                $("#app_id").val(result105.app_id);
                $("#app_cert").val(result105.app_cert);
                $("#merchant_id").val(result105.merchant_id);
                $("#merchant_key").val(result105.merchant_key);
                $("#apiclient_cert").val(result105.apiclient_cert);
                $("#apiclient_key").val(result105.apiclient_key);
                $("#filename").val(result105.verify_file_name);
                $("input[name=verify_file_name]").val(result105.verify_file_name);
                //判断滑块是否选中
                if(result105.app_id&&result105.app_cert&&result105.verify_file_name){
                    $("#we_toggle-button-app").attr("checked", 'checked');
                }
                if(result105.merchant_id&&result105.merchant_key&&result105.apiclient_cert&&result105.apiclient_key){
                    $("#we_toggle-button-app1").attr("checked", 'checked');
                }
            }
        });
        options106.fail(function(fail) {
            console.error(error);
        });
    }

    var options105 = $.post(apiUrl + "pages/wechat/initWechat");
    options105.done(function(data) {
        if (data.code == 200 && data.data) {
            pages_wechat_detail();
        }
    });
    options105.fail(function(fail) {
        console.error(error);
    });

    //获取微信小程序配置
    function page_mini_wechat_detail(){
        var options107 = $.post(apiUrl + "pages/wechatMini/detail");
        options107.done(function(data) {
            if (data.code == 200 && data.data) {
                //给微信小程序配置赋值
                var result = data.data;
                $("#uploadForm3").find("input[name=weid]").val(result.weid);
                $("#mini_app_id").val(result.app_id);
                $("#mini_app_cert").val(result.app_cert);
                //设置滑块是否先中
                if(result.app_id&&result.app_cert){
                    //选中
                    $("#we_toggle-button-app3").attr("checked", 'checked');
                }
            }
        });
        options107.fail(function(fail) {
            console.error(error);
        });
    }
    //初始化微信小程序配置
    var options108 = $.post(apiUrl + "pages/wechatMini/initWechatMini");
    options108.done(function(data) {
        if (data.code == 200 && data.data) {
            //判读是否购买小程
            $.ajax({
                type: "POST",
                url: apiUrl + "pages/miniOrder/isMiniOrderPay",
                data: {user_id: mall_user_id}, // 要提交表单的ID
                success: function(data) {
                    if (data.code == 200) {
                        if(data.data==true){
                            $("#wechat_mini_buy_form").css("display","none");
                            $("#uploadForm3").css("display","block");
                            page_mini_wechat_detail();
                        }else{
                            $("#wechat_mini_buy_form").css("display","block");
                            $("#uploadForm3").css("display","none");
                        }
                    }
                }
            });
        }
    });
    options108.fail(function(fail) {
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
    $("input[name=verify_file]").change(function() {
        var file = $("input[name=verify_file]").get(0).files[0];
        if (file.type.indexOf("text") > -1) {
            //允许上传的类型
        } else {
            $('input[name=verify_file]').val('');
            layer.msg("类型有误必须为微信公众平台授权回调域名验证文件！", { time: 5000 });
            return false;
        }
        $("input[name=verify_file_name]").val(file.name);
        $("#filename").val(file.name);
    });
    $("#wechat_open_save").click(function() {
        var body107 = new Object();
        body107.weid = get_weid;
        body107.app_id = $("#app_id").val();
        body107.app_cert = $("#app_cert").val();
        if (!body107.app_id) {
            layer.msg("公众号id为空！", { time: 5000 });
            return false;
        }
        if (!body107.app_cert) {
            layer.msg("公众号秘钥为空！", { time: 5000 });
            return false;
        }
        addWechatPost(new FormData($("#uploadForm")[0]));
    });

    $('#we_open').click(function() {
        var text = $(this).text();
        if (text === "展开") {
            $('.open_content0').stop().slideDown(400);
            $(this).text("收起");
        } else {

            $('.open_content0').stop().slideUp(400);
            $(this).text("展开");

        }
    });
    $('#open1').click(function() {
        var a = checkInput();
        if (a) {
            layer.msg("请先完善微信公众服务号接口配置");
            return
        }
        var text = $(this).text();
        if (text === "展开") {
            $('.open_content1').stop().slideDown(400);
            $(this).text("收起");
        } else {
            $('.open_content1').stop().slideUp(400);
            $(this).text("展开");

        }
    });
    $('#open2').click(function() {
        var text = $(this).text();
        if (text === "展开") {
            $('.open_content2').stop().slideDown(400);
            $(this).text("收起");
        } else {
            $('.open_content2').stop().slideUp(400);
            $(this).text("展开");

        }
    });
    $('#open3').click(function() {
        var text = $(this).text();
        if (text === "展开") {
            $('.open_content3').stop().slideDown(400);
            $(this).text("收起");
        } else {
            $('.open_content3').stop().slideUp(400);
            $(this).text("展开");

        }
    });

    $("#wechat_merchant_save").click(function() {
        var body107 = new Object();
        body107.weid = get_weid;
        body107.merchant_id = $("#merchant_id").val();
        body107.merchant_key = $("#merchant_key").val();
        body107.apiclient_cert = $("#apiclient_cert").val();
        body107.apiclient_key = $("#apiclient_key").val();
        if (!body107.merchant_id) {
            layer.msg("商户号ID为空！", { time: 5000 });
            return false;
        }
        if (!body107.merchant_key) {
            layer.msg("商户号密钥为空！", { time: 5000 });
            return false;
        }
        if (!body107.apiclient_cert) {
            layer.msg("api证书为空！", { time: 5000 });
            return false;
        }
        if (!body107.apiclient_key) {
            layer.msg("api证书密钥为空！", { time: 5000 });
            return false;
        }
        addWechatPost(new FormData($("#uploadForm1")[0]));
    });
    $("#wechat_verify_save").click(function() {
        var body107 = new Object();
        body107.weid = get_weid;
        body107.verify_file_name = $("input[name=verify_file_name]").val();
        if (!body107.verify_file_name) {
            layer.msg("商户号ID为空！", { time: 5000 });
            return false;
        }
        addWechatPost(new FormData($("#uploadForm2")[0]));
    });
    //测试
    $("#wechat_test_save").click(function() {
        var body107 = new Object();
        body107.weid = get_weid;
        if (!body107.weid) {
            layer.msg("微信配置信息不存在！", { time: 5000 });
            return false;
        }
        addWechatTestPost();
    });
    $("#service_test").click(function() {
        serviceTest()
    });
    //校验上一步信息
    function checkInput() {
        var isEmpty = false;
        $('.open_content0 input[type="text"]').each(function(ind, el) {
            if (!$(el).val()) {
                isEmpty = true;
            }
        })
        return isEmpty;
    }
    //服务号测试
    function serviceTest() {
        $('#myModal').find(".modal-title").text('服务号测试');
        $('#myModal').find(".modal-body").css("text-align", "center");
        $('#myModal').find(".modal-body").children().remove();
        $('#myModal').find(".modal-body").append("<img src='" + QRCODE + "?url="+mob_domian+"api/pages/wechat/wechatConfigureTest?userid=" + weid + "'/>");
        $('#myModal').modal('show');

    }
    //测试支付请求
    function addWechatTestPost() {
        $.ajax({
            type: "POST",
            url: apiUrl + "pages/wechatPay/wechatPayTest",
            data: { mall_user_id: mall_user_id }, // 要提交表单的ID
            success: function(data) {
                if (data.code == 200) {
                    $('#myModal').find(".modal-title").text('配置成功');
                    $('#myModal').find(".modal-body").css("text-align", "center");
                    $('#myModal').find(".modal-body").children().remove();
                    $('#myModal').find(".modal-body").append("<img src='" + QRCODE + "?url=" + data.data.url + "' />");
                    $('#myModal').modal('show');
                } else {
                    if (data.message) {
                        layer.msg(data.message, { time: 1500 });
                    } else {
                        layer.msg("配置有误请仔细检查", { time: 1500 });
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                layer.msg("配置有误请仔细检查", { time: 1500 });
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
            data: data, // 要提交表单的ID
            success: function(data) {
                if (data.code == 200) {
                    layer.msg("修改成功！", { time: 1500 });
                } else {
                    layer.msg(data.message, { time: 1500 });
                }
            }
        });
    }

    //微信小程序数据提交
    $("#wechat_mini_save").click(function() {
        //判断微信公众号支付是否已经配置
        $.ajax({
            url:apiUrl + "pages/wechat/wechatIsOk",
            type: 'POST',
            headers: {
                'Token': docCookies.getItem("token")
            },
            data: {userid:mall_user_id},
            success: function(data) {
                if (data.code == 200) {
                    var data = new Object();
                    data.weid = $("#uploadForm3").find("input[name=weid]").val();
                    data.mini_app_id = $("#mini_app_id").val();
                    data.mini_app_cert = $("#mini_app_cert").val();
                    if (!data.mini_app_id) {
                        layer.msg("小程序app_id为空！", { time: 5000 });
                        return false;
                    }
                    if (!data.mini_app_cert) {
                        layer.msg("小程序密钥app_cert为空！", { time: 5000 });
                        return false;
                    }
                    layer.confirm('小程序配置必须和公众号支付为同一账户？', {
                        btn: ['是','否']
                    }, function(){
                        addWechatMiniPost(new FormData($("#uploadForm3")[0]));
                    }, function(){
                        layer.msg("必须为同一账户！", { time: 5000 });
                    });
                } else {
                    layer.msg("还未配置微信支付！", { time: 5000 });
                }
            }

        });
    });
    //提交微信小程序配置数据
    function addWechatMiniPost(data) {
        $.ajax({
            type: "POST",
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            url: apiUrl + "pages/wechatMini/update",
            data: data, // 要提交表单的ID
            success: function(data) {
                if (data.code == 200) {
                    layer.msg("修改成功！", { time: 1500 });
                } else {
                    layer.msg(data.message, { time: 1500 });
                }
            }
        });
    }
    //微信小程序测试
    $("#wechat_mini_test").click(function() {
        //判断小程序是否配置完整
        $.ajax({
            url: apiUrl + "pages/wechatMini/wechatMiniIsOk",
            type: 'POST',
            headers: {
                'Token': docCookies.getItem("token")
            },
            data: {userid: mall_user_id},
            success: function(data) {
                if (data.code == 200) {
                    var obj = new Object();
                    obj.weid = $("#uploadForm3").find("input[name=weid]").val();
                    if (!obj.weid) {
                        layer.msg("微信小程序配置信息不存在！", { time: 5000 });
                        return false;
                    }
                    addWechatMiniTestPost();
                }else{
                    layer.msg("微信小程序配置信息不存在或未配完！", { time: 5000 });
                }
            }
        });
    });
    //微信小程序测试支付数据提交
    function addWechatMiniTestPost () {
        $.ajax({
            type: "POST",
            url: apiUrl + "pages/wechatPay/wechatMiniPayTest",
            data: { mall_user_id: mall_user_id }, // 要提交表单的ID
            success: function(data) {
                if (data.code == 200) {
                    $('#myModal').find(".modal-title").text('小程序配置成功');
                    $('#myModal').find(".modal-body").css("text-align", "center");
                    $('#myModal').find(".modal-body").children().remove();
                    $('#myModal').find(".modal-body").append("<img src='" + QRCODE + "?url=" + data.data.url + "' />");
                    $('#myModal').modal('show');
                } else {
                    if (data.message) {
                        layer.msg(data.message, { time: 1500 });
                    } else {
                        layer.msg("小程序配置有误请仔细检查", { time: 1500 });
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                layer.msg("小程序配置有误请仔细检查", { time: 1500 });
            },
        });
    }

    //购买微信小程序
    $("#wechat_mini_buy_save").click(function() {
        //判断用户是否已经支付过
        $.ajax({
            type: "POST",
            url: apiUrl + "pages/miniOrder/detailByUser",
            data: { user_id: mall_user_id }, // 要提交表单的ID
            success: function(data) {
                if (data.code == 200) {
                    //判断是否支付过
                    //未支付过生成订单
                    if($.isEmptyObject(data.data)){
                        $.ajax({
                            type: "POST",
                            url: apiUrl + "pages/miniOrder/store",
                            success: function(data) {
                                if (data.code == 200){
                                    //弹出支付框
                                    PayWechatMiniPost(data.data);
                                }
                            }
                        });
                    }else{
                        if(data.data.status==1){
                            //弹出支付框
                            PayWechatMiniPost(data.data.weid);
                        }
                    }
                }
            }
        });
    });

    function PayWechatMiniPost(weid) {
        $.ajax({
            type: "POST",
            url: apiUrl + "pages/wechatPay/WechatMiniOrderPcPay",
            data: { order_id: weid }, // 要提交表单的ID
            success: function(data) {
                if (data.code == 200) {
                    $('#myModal').find(".modal-title").text('小程序购买支付');
                    $('#myModal').find(".modal-body").css("text-align", "center");
                    $('#myModal').find(".modal-body").children().remove();
                    $('#myModal').find(".modal-body").append("<img src='" + QRCODE + "?url=" + data.data.url + "' />");
                    $('#myModal').modal('show');
                    //循环监控状态
                    var listenStatus=setInterval(function(){
                        $.ajax({
                            type: "POST",
                            url: apiUrl + "pages/miniOrder/detailByUser",
                            data: { user_id: mall_user_id },
                            success: function(data) {
                                var status = data.data.status;
                                if(status==2){
                                    clearInterval(listenStatus);
                                    page_mini_wechat_detail();
                                    $('#myModal').modal('hide');
                                    //隐藏购买
                                    $("#wechat_mini_buy_form").css("display","none");
                                    $("#uploadForm3").css("display","block");
                                }
                            },
                        });
                    },1500)
                } else {
                    if (data.message) {
                        layer.msg(data.message, { time: 1500 });
                    } else {
                        layer.msg("未知错误", { time: 1500 });
                    }
                }
            }
        });
    }

    /*    var modeleName = [];
        var moduleState = function() {
            $.ajax({
                url: PAGES_MODULERUN_LIST,
                type: 'GET',
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data){
                    if (data.code == 200){
                        // console.log('module:', data.data.list);
                        var state = data.data.list;
                        state.map(x => {
                            modeleName.push(x.module_id);
                            if (x.module_id === '4009ea20-8ede-11e7-83a8-156d1da77933') {
                                if (x.status == 1) {
                                    //$(".we-art").slideDown(500)
                                    $(".we-art").show();
                                    $('#toggle-button').prop("checked", true);
                                }
                            }
                            if (x.module_id === '44fd5620-8d7f-11e7-9e08-e356d0b019f1') {
                                if (x.status == 1) {
                                    //$(".we-shop").slideDown(500)
                                    $(".we-shop").show();
                                    $('#toggle-button-4').prop("checked", true);
                                }
                            }
    						if (x.module_id === 'b3c00b00-a4e2-11e7-b542-2d038cc12c12') {
                                if (x.status == 1) {
                                    //$(".we-shop").slideDown(500)
                                    $(".we-active").show();
                                    $('#toggle-button-2').prop("checked", true);

                                }
                            }
                            if (x.module_id === 'c30c2160-a4e2-11e7-a2ad-35371a8cf051') {
                                if (x.status == 1) {
                                    //$(".we-shop").slideDown(500)
                                    $(".we-project").show();
                                    $('#toggle-button-1').prop("checked", true);

                                }
                            }
    						if (x.module_id === 'a9d16bc0-ada0-11e7-8c59-993d3b1d7e06') {
                                if (x.status == 1) {
                                    //$(".we-shop").slideDown(500)
                                    $(".we-crm").show();
                                    $('#toggle-button-3').prop("checked", true);

                                }
                            }
                        })
                    } else {
                        layer.msg(data.message, {
                            time: 1500
                        });
                    }

                    //列表折叠
                    var curr = 'we-app';
                    var status = true;
                    var list = ['we-set','we-art','we-shop','we-active','we-project','we-app','we-crm','we-log'];

                    var remove = function(id, list) {
                        return list.filter(x => x != id);
                    }

                    $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                    $("." + curr + " span img").css("transform", "rotate(90deg)");
                    remove(curr, list).map(x => $("." + x + ":eq(1)").stop().hide());

                    var showList = function(state, id) {
                        var id = "." + id;
                        if (state) {
                            $(id + ":eq(1)").stop().hide(300);
                            if (id != ".we-log") {
                                $(id + ":eq(0)").css("border-bottom", "0");
                            }
                            $(id + " span img").css("transform", "rotate(0deg)")
                            status = false;
                        } else {
                            $(id + ":eq(1)").stop().show(300);
                            $(id + " span img").css("transform", "rotate(90deg)")
                            $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                            status = true;
                        }
                    }

                    list.map(x => {
                        $("." + x).click(function() {
                            var isCont = $(this).attr('class').search('we-cont');
                            if (isCont == 0) {
                                return;
                            }
                            if (curr == x) {
                                showList(status, x);
                            } else {
                                status = false;
                                remove(x, list).map(x => {
                                    $("." + x + ":eq(1)").stop().hide(300)
                                    $("." + x + " span img").css("transform", "rotate(0deg)")
                                });
                                if (curr != "we-log") {
                                    $("." + curr + ":eq(0)").css("border-bottom", "0");
                                }
                                curr = x;
                                showList(status, x);
                            }
                        })
                    })
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        }
    */
    //登录token参数
    var token = docCookies.getItem("token");
    if (token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token
            }
        });
    }

    //userinfo
    var platId = '';
    var userInfo = function(weid) {
        $.ajax({
            url: USERDETAIL + '/' + weid,
            type: 'GET',
            success: function(data) {
                // console.log(data);
                platId = data.data.plat_id;
            },
            error: function(error) {
                console.log(error)
            }
        })
    }

    userInfo(weid);

    var smsTemplate = function(data) {
        var template = `<button type="button" id=` + data.weid + ` class="btn btn-default dropdown-toggle price " aria-haspopup="true" aria-expanded="false">` + data.count + "条/&yen" + data.price + `</button>`
        return template;
    }

    var reqBuy;
    var smsId;
    var smsInfo = [];
    var count;
    var smsBuy = function(platId) {
        $.ajax({
            url: SMS_PACKAGE_LIST,
            type: 'POST',
            data: {
                plat_id: platId
            },
            success: function(data) {
                // console.log(data)
                if (data.data != null) {
                    data.data.list.map(x => {
                        smsInfo.push({ id: x.weid, count: x.count })
                        $(".prices").append(smsTemplate(x))
                    })

                    $(".price").click(function() {
                        smsId = $(this).attr("id");
                        //通过id反查列表获取购买短信条数
                        count = smsInfo.filter(x => x.id == smsId)[0].count;
                        $(this).css({
                            'border-color': '#faaa00',
                            'color': '#fbba2f',
                            'background': 'url(/common/img/current.png) 0 8px no-repeat #fff8e9'
                        }).animate({
                            backgroundPositionX: '122px'
                        }).siblings().css({
                            'border-color': '#ccc',
                            'background': 'none',
                            'color': '#333',
                        })
                    })

                    $("#buyNow").click(function() {
                        //console.log('smsId:', smsId);
                        if (smsId == undefined) {
                            layer.msg("请选择套餐", {
                                time: 1500
                            });
                            return;
                        }
                        // var password = $("#operate-1").val();
                        var password = '';
                        //生成二维码url
                        // console.log('count:', count)
                        if ($("#sign").val() != '') {
                            qrcodeBuy(smsId, password, count);
                        } else {
                            layer.msg("请先设置短信签名", {
                                time: 1500
                            });
                        }
                    })

                    //套餐主键ID
                    //smsId = data.data.list[0].weid;
                    reqBuy = updateBuy;
                } else {
                    reqBuy = storeBuy;
                }
            },
            error: function(error) {
                console.log(error)
            }
        })
    }

    var storeBuy = function(id, count, price, note) {
        $.ajax({
            url: SMS_PACKAGE_STORE,
            type: 'POST',
            data: {
                count: count,
                price: price,
                note: note
            },
            success: function(data) {
                // console.log('store buy')
                // console.log(data);
                layer.msg(data.message, {
                    time: 1500
                });
            }
        })
    }

    var updateBuy = function(id, count, price, note) {
        $.ajax({
            url: SMS_PACKAGE_UPDATE,
            type: 'POST',
            data: {
                weid: id,
                count: count,
                price: price,
                note: note
            },
            success: function(data) {
                // console.log('store update')
                // console.log(data);
                layer.msg(data.message, {
                    time: 1500
                });
            }
        })
    }

    var store = function(id, sign, count) {
        $.ajax({
            url: SMS_USERSMS_STORE,
            type: 'POST',
            data: {
                sms_sign: sign,
                //sms_count: count
            },
            success: function(data) {
                // console.log(data);
                // console.log('store')
                weid = data.data;
                layer.msg('短信签名设置成功', {
                    time: 1500
                });
            }
        })
    }

    var update = function(weid, sign, count, flag) {
        $.ajax({
            url: SMS_USERSMS_UPDATE,
            type: 'POST',
            data: {
                weid: weid,
                sms_sign: sign,
                sms_count: count
            },
            success: function(data) {
                // console.log(data);
                // console.log('update')
                if (flag || flag == undefined) {
                    layer.msg('短信签名设置成功', {
                        time: 1500
                    });
                }
            }
        })
    }

    var req;
    var init = function(id) {
        $.ajax({
            url: SMS_USERSMS_DETAIBYUSERID + id,
            type: 'GET',
            success: function(data) {
                // console.log(data);
                // moduleState();
                if (data.data != null) {
                    weid = data.data.weid;
                    $("#sign").val(data.data.sms_sign);
                    $("#surplus").val(data.data.sms_count);
                    if (data.data.status == 1) {
                        $("#we_toggle-button-app2").attr("checked", true);
                        chatState2 = true;
                    } else {
                        $("#we_toggle-button-app2").attr("checked", false);
                        chatState2 = false;
                    }
                    req = update;
                } else {
                    req = store;
                }
            },
            error: function(error) {
                console.log(error);
            }
        })
    }
    init(weid);

    //购买短信套餐二维码
    var qrcodeBuy = function(id, password, count) {
        $.ajax({
            // url: WECHATPAY_SMSPAY + '?id=' + id + '&secret=' + password,
            url: WECHATPAY_SMSPAY + '?id=' + id,
            type: 'GET',
            success: function(data) {
                // console.log(data);
                //轮询订单接口的weid
                if (data.code == 200) {
                    var id = data.data.weid;
                    var url = data.data.url;
                    qrWindow(id, url, count, data.data.total_fee);
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    })
                }
            },
            error: function(error) {
                console.log(error);
            }
        })
    }

    var qrWindow = function(id, qrUrl, count, total_fee) {
        $.ajax({
            url: QRCODE + '?size=150&url=' + qrUrl,
            type: 'GET',
            success: function(data) {
                //console.log(data);
                layer.open({
                    type: 1,
                    title: '请扫描二维码购买短信',
                    offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                        ,
                    area: ['300px', '350px'],
                    id: 'layerDemo' + type //防止重复弹出
                        ,
                    content: `<div class="qr-window" style="padding: 10px 40px;"><img width="100%" src=` + apiUrl + `file/qrcode` + `?size=150&url=` + qrUrl + `>
                                <table>
                                    <tr><td class="td-title">数量：</td><td>` + count + `条</td><tr>
                                    <tr><td class="td-title">金额：</td><td>` + total_fee + `元</td><tr>
                                    <tr><td class="td-title">收款方：</td><td><a href="//www.wezchina.com/" target="_blank">微众中国</a></td><tr>
                                </table>
                            </div>`
                        //,btn: '关闭全部'
                        ,
                    btnAlign: 'c' //按钮居中
                        ,
                    shade: 0 //不显示遮罩
                        ,
                    yes: function() {
                        layer.closeAll();
                    }
                });

                var check = setInterval(function() {
                    $.ajax({
                        url: SMS_ORDER_DETAIL + id,
                        type: 'GET',
                        success: function(data) {
                            // console.log(data);
                            var status = data.data.status;
                            if (status == 2) {
                                //支付成功
                                layer.closeAll();
                                //更新数据

                                var historyCount = parseInt($("#surplus").val());
                                if (historyCount == NaN) {
                                    historyCount = 0;
                                }
                                var newCount = count + historyCount;
                                // console.log('org:', historyCount)
                                // console.log('res:', newCount)
                                var newSign = $("#sign").val();
                                $("#surplus").val(newCount);
                                //update(weid, newSign, newCount, false);
                                //弹出支付成功窗口
                                layer.msg("您已成功购买" + count + "条短信");
                                // $("#operate-1").val('');
                                /*layer.open({
                                    type: 1
                                    ,title: '支付成功'
                                    ,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                                    ,area: ['400px', '300px']
                                    ,id: 'layerDemo'+type //防止重复弹出
                                    ,content: '成功购买' + count + '条短信！'
                                    //,btn: '关闭全部'
                                    ,btnAlign: 'c' //按钮居中
                                    ,shade: 0 //不显示遮罩
                                    ,yes: function(){
                                        layer.closeAll();
                                    }
                                });*/
                                clearInterval(check);
                            } else {
                                // console.log('go on')
                            }
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    })
                }, 1000)

            },
            error: function(error) {
                console.log(error);
            }
        })
    }

    $(".buy").click(function() {
        $(".prices").html("");
        //创建套餐列表，写入套餐主键id
        smsBuy(platId);
        //更新套餐列表数据
        //reqBuy(weid, 1000, 100, '')
        //storeBuy('', 1000, 100, '');
    })

    $(".save").click(function() {
        var sign = $("#sign").val()
        var count = $("#surplus").val()

        if (count == '') {
            count = 0;
        }

        if (sign != '' && /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(sign) && sign.length <= 6) {
            req(weid, sign, count);
            req = update;
        } else {
            layer.msg("请输入6个汉字以内的短信签名", {
                time: 1500
            });
        }

    })

    //支付方式
    var wxState = true;
    var zfbState = false;
    $("#wx").click(function() {
        if (!wxState) {
            wxState = true;
            zfbState = false;
            $(this).attr('src', '/common/img/wxzf1.png');
            $("#zfb").attr('src', '/common/img/zfb2.png');
        }
    })

    $("#zfb").click(function() {
        layer.msg('暂不支持支付宝支付', {
                time: 1500
            })
            /*if (!zfbState) {
                zfbState = true;
                wxState = false;
                $(this).attr('src', '/common/img/zfb1.png');
                $("#wx").attr('src', '/common/img/wxzf2.png');
            }*/
    })

    /*//主页初始化
    var init__ = function(token){
      if (token != 'null' && token != undefined) {
        showLogin = false;
        isLogin = true;
        //加载用户头像
        $("#login div img").hide();
        $(".log-head").css({
          'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
          'background-size': '100% 100%'
        })
        $("#avatar .avatar-icon").css({
          'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
          'background-size': '100% 100%'
        })
        $(".log-head").show();
      }
    }

    init__(docCookies.getItem("token"));*/

    if (localStorage.getItem('title') == "" || localStorage.getItem('title') == null || localStorage.getItem('title') == undefined || localStorage.getItem('title') == "null") {
        $.ajax({
            url: apiUrl + "cms/advs",
            type: 'get',
            success: function(data) {
                if (data.code == 200) {

                    $(".title_data").html(data.data.setting.title);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    } else {
        $(".title_data").html(localStorage.getItem('title'));

    }

})
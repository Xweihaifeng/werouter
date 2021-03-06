/**
 * apps control center
 * Author: zhushuha<zhushuha@gmail.com>
 * Date: 2017-8-29
 */


/**
 * ---------------------------------------------------
 * common script
 * ---------------------------------------------------
 */

$(function() {
    __init();
});

// initialize func

var __init = function() {

    // initialize a app of online certificate

    __init_onlione_cert();

    // initialize a app of qiniu configuration

    __init_qiniu_config();

    // initialize a app of weixin configuration

    __init_weixin_config();

    // initialize another app

    __init_another();
}


$(document).on('click', '.message_box .per_bottom_tit .edit_domain', function() {
    var that = this;
    $(that).closest('.message_box').find('.edit_domain_area').slideToggle('normal', function() {
        $(that).text($(this).closest('.message_box').find('.edit_domain_area').css('display') === 'none' ? '展开' : '收起');
    });
});


/**
 * ------------------------------------------------
 * apps script
 * ------------------------------------------------
 */

// 在线实名认证 - online_cert

var __init_onlione_cert = function() {
    $.ajax({
        url: ApiUrl + 'cert/realname/setting',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            if (data.data.status == 1)
                $('.online_cert .switch').removeClass('switch-close').addClass('switch-open');
            else
                $('.online_cert .switch').removeClass('switch-open').addClass('switch-close');
            $('.online_cert input[name=rest_count]').val(data.data.auth_num);
            $(".online_cert input[name='pay_type'][value=" + data.data.pay_type + "]").attr("checked", true);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
    $.ajax({
        url: ApiUrl + 'cert/realname/package_list',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            var html = '';
            $.each(data.data, function(k, v) {
                html += `<li>
				<a data-weid="` + v.weid + `" data-num="` + v.auth_num + `" class="pid" href="javascript:;">` + v.auth_num + `次 / ` + v.auth_price + `元</a>
			</li>`;
            });
            $('.online_cert .message_package_con').html(html);
            $('.online_cert .message_package_con').find('li:first-child').find('a').addClass('current');
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

$(document).on('click', '.online_cert .switch', function() {
    var that = this;
    var status = $(that).hasClass('switch-open') ? 2 : 1;
    $.ajax({
        url: ApiUrl + 'cert/realname/toggle',
        type: 'post',
        dataType: 'json',
        data: { status: status },
        success: function(data) {
            if ($(that).hasClass('switch-open')) {
                $(that).removeClass('switch-open').addClass('switch-close');
            } else {
                $(that).removeClass('switch-close').addClass('switch-open');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });

});

$(document).on('click', '.online_cert input[name=pay_type]', function() {
    var that = this;
    var pay_type = $("input[name='pay_type']:checked").val();
    $.ajax({
        url: ApiUrl + 'cert/realname/set_pay_type',
        type: 'post',
        dataType: 'json',
        data: { pay_type: pay_type },
        success: function(data) {},
        error: function(xhr) {
            console.log(xhr);
        }
    });

});

$(document).on('click', '.online_cert  .btn-cancel-buy', function() {
    var that = this;
    $(that).closest('.message_box').find('.message_buy_box').slideToggle('normal', function() {
        $(that).text($(that).closest('.message_box').find('.message_buy_box').css('display') === 'none' ? '购买' : '取消');
    });

});

$(document).on('click', '.online_cert .message_package_con>li>a', function() {
    $(this).addClass('current').closest('li').siblings('li').find('a').removeClass('current');
});

$(document).on('click', '.buy-instance', function() {
    if ($('.online_cert .message_package_con a.pid.current').length === 0) {
        swal('提示', '请选择套餐', 'error');
        return;
    }
    var that = this;
    var package = $('.online_cert .message_package_con a.pid.current').data('weid');
    $.ajax({
        url: ApiUrl + 'wxpay/package_uniorder',
        type: 'post',
        dataType: 'json',
        data: {
            package: package
        },
        success: function(data) {
            swal({
                title: '微信支付',
                text: '请用微信扫描二维码完成支付',
                imageUrl: hosts + 'file/qrcode?size=8&margin=2&url=' + data.data.qr_url,
                imageWidth: 200,
                imageHeight: 200,
                animation: false
            }).then(
                function() {
                    clearInterval(tmr);
                },
                // handling the promise rejection
                function(dismiss) {
                    if (dismiss === 'timer') {
                        console.log(dismiss);
                    }
                }
            );
            $('.online_cert input[name=order_id]').val(data.data.order_id);
            tmr = setInterval(function() {
                var order = data.data.order_id;
                $.ajax({
                    url: ApiUrl + 'wxpay/order_detect',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        order: order
                    },
                    success: function(rep) {
                        if (rep.data.status == 1) {
                            swal(
                                '支付成功!',
                                '平台已获取' + $('.online_cert .message_package_con a.pid.current').data('num') + '次在线认证能力',
                                'success'
                            );
                            clearInterval(tmr);
                            $('.online_cert input[name=rest_count]').val(parseInt($('.online_cert input[name=rest_count]').val()) + parseInt($('.online_cert .message_package_con a.pid.current').data('num')));
                        }
                    },
                    error: function(xhr) {
                        console.log(xhr);
                    }
                });
            }, 1000)
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
});



/**
 * ------------------------------------------------
 * apps script
 * ------------------------------------------------
 */

// 七牛配置 - qiniu_config

var __init_qiniu_config = function() {
    $.ajax({
        url: ApiUrl + 'setting/alias/qiNiuConfig',
        type: 'get',
        dataType: 'json',
        success: function(result) {
            if (result.code === 200) {
                $('#bucket').val(result.data.bucket);
                $('#access_key').val(result.data.access_key);
                $('#secret_key').val(result.data.secret_key);
                $('#domain_custom').val(result.data.domain_custom);
                $('#domain_default').val(result.data.domain_default);
                $('#domain_https').val(result.data.domain_https);
                $('#notify_url').val(result.data.notify_url);
                $('#secret_key').val(result.data.secret_key);
            } else {
                parent.layer.msg(result.message);

                return false;
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}
$('#updateSet').click(function() {
    var formList = {
        'bucket': $('#bucket').val(),
        'domain_custom': $('#domain_custom').val(),
        'domain_default': $('#domain_default').val(),
        'domain_https': $('#domain_https').val(),
        'notify_url': $('#notify_url').val(),
        'secret_key': $('#secret_key').val(),
        'access_key': $('#access_key').val()
    };
    $.ajax({
        url: ApiUrl + 'setting/alias/qiNiuConfig',
        type: 'post',
        dataType: 'json',
        data: {
            config: formList
        },
        success: function(data) {
            console.log(data);
            if (data.code === 200) {
                swal('提示', '保存成功', 'success');
            } else {
                console.log('error: -200');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
});


/**
 * ------------------------------------------------
 * apps script
 * ------------------------------------------------
 */

// 微信配置 - weixin_config

var __init_weixin_config = function() {
        $.ajax({
            url: ApiUrl + 'setting/alias/weChatConfig',
            type: 'get',
            dataType: 'json',
            success: function(result) {
                if (result.code === 200) {
                    $('#wechat_appid').val(result.data.wechat_appid);
                    $('#wechat_secretkey').val(result.data.wechat_secretkey);
                    $('#wechat_verify_txt').val(result.data.wechat_verify_txt);
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        });
        $.ajax({
            url: ApiUrl + 'setting/alias/weChatPayConfig',
            type: 'get',
            dataType: 'json',
            success: function(result) {
                if (result.code === 200) {
                    $('#wechat_merchant_id').val(result.data.wechat_merchant_id);
                    $('#wechat_payment_key').val(result.data.wechat_payment_key);
                    $('#apiclient_cert').val(result.data.apiclient_cert);
                    $('#apiclient_key').val(result.data.apiclient_key);
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        });
        $.ajax({
            url: ApiUrl + 'setting/alias/weChatOpenConfig',
            type: 'get',
            dataType: 'json',
            success: function(result) {
                if (result.code === 200) {
                    $('#wechat_open_appid').val(result.data.appid);
                    $('#wechat_open_secret').val(result.data.appsecret);
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        });
        // 客户端证书
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles',
            uptoken_url: ApiUrl + 'file/qiniu_token',
            get_new_uptoken: false,
            domain: ApiMaterPlatQiniuDomain,
            max_file_size: '100mb',
            flash_swf_url: 'http://cdn.staticfile.org/plupload/2.1.8/Moxie.swf',
            max_retries: 3,
            chunk_size: '4mb',
            auto_start: true,
            filters: {
                max_file_size: '5mb',
                prevent_duplicates: true,
                // Specify what files to browse for
                mime_types: [
                    { title: "Cert File", extensions: "pem" },
                ]
            },
            init: {
                'FileUploaded': function(up, file, info) {
                    var domain = up.getOption('domain');
                    res = JSON.parse(info.response);
                    $("#apiclient_cert").val(res.key);
                    var sourceLink = domain + res.key;
                },
                'Key': function(up, file) {
                    var key = "resource/cert/";
                    key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                    return key;
                }
            }
        });

        // 客户端证书key
        var uploader2 = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'pickfiles2',
            uptoken_url: ApiUrl + 'file/qiniu_token',
            get_new_uptoken: false,
            domain: ApiMaterPlatQiniuDomain,
            max_file_size: '100mb',
            flash_swf_url: 'http://cdn.staticfile.org/plupload/2.1.8/Moxie.swf',
            max_retries: 3,
            chunk_size: '4mb',
            auto_start: true,
            filters: {
                max_file_size: '5mb',
                prevent_duplicates: true,
                // Specify what files to browse for
                mime_types: [
                    { title: "Cert File", extensions: "pem" },
                ]
            },
            init: {
                'FileUploaded': function(up, file, info) {
                    var domain = up.getOption('domain');
                    res = JSON.parse(info.response);
                    $("#apiclient_key").val(res.key);
                    var sourceLink = domain + res.key;
                },
                'Key': function(up, file) {
                    var key = "resource/cert/";
                    key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                    return key;
                }
            }
        });
    }
    // 微信公众平台保存
$('.weChatSet').click(function() {
    var wechatList = {
        'wechat_appid': $('#wechat_appid').val(),
        'wechat_secretkey': $('#wechat_secretkey').val(),
        'wechat_verify_txt': $('#wechat_verify_txt').val(),
    };
    $.ajax({
        url: ApiUrl + 'setting/alias/weChatConfig',
        type: 'post',
        dataType: 'json',
        data: {
            config: wechatList
        },
        success: function(data) {
            console.log(data);
            if (data.code === 200) {
                swal('提示', '保存成功', 'success');
            } else {
                console.log('error: -200');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
});
// 微信支付保存
$('.weChatPaySet').click(function() {
    var wechatList = {
        'wechat_merchant_id': $('#wechat_merchant_id').val(),
        'wechat_payment_key': $('#wechat_payment_key').val(),
        'apiclient_cert': $('#apiclient_cert').val(),
        'apiclient_key': $('#apiclient_key').val(),
    };
    $.ajax({
        url: ApiUrl + 'setting/alias/weChatPayConfig',
        type: 'post',
        dataType: 'json',
        data: {
            config: wechatList
        },
        success: function(data) {
            console.log(data);
            if (data.code === 200) {
                swal('提示', '保存成功', 'success');
            } else {
                console.log('error: -200');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
});
// 微信开放平台保存
$('.weChatOpenSet').click(function() {
    var wechatList = {
        'appid': $('#wechat_open_appid').val(),
        'appsecret': $('#wechat_open_secret').val(),
    };
    $.ajax({
        url: ApiUrl + 'setting/alias/weChatOpenConfig',
        type: 'post',
        dataType: 'json',
        data: {
            config: wechatList
        },
        success: function(data) {
            console.log(data);
            if (data.code === 200) {
                swal('提示', '保存成功', 'success');
            } else {
                console.log('error: -200');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
});

$('.tab-content').children().each(function() {
    $(this).click(function() {
        var index = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.tab-body').eq(index).css('display', 'block').siblings('.tab-body').css('display', 'none');
    });
});

// 另一个app - another

var __init_another = function() {
    console.log('Hello world!');
}
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

    // initialize a app of plat sms

    __init_sms_pakage();

    // initialize a app of qiniu configuration

    __init_qiniu_config();

    // initialize a app of weixin configuration

    __init_weixin_config();

    // initialize a app of wepages configuration

    __init_wepages_config();

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
             $('input[name=cert_name]').val(data.data.cert_name);
             $('input[name=auth_money]').val(data.data.auth_money);
             if(data.data.pay_type>1){
                $('#rzjf').show();
             }
            if (data.data.status == 1)
                $('.online_cert .switch').removeClass('switch-close').addClass('switch-open');
            else
                $('.online_cert .switch').removeClass('switch-open').addClass('switch-close');
            $('.online_cert input[name=rest_count]').val(data.data.auth_num);
            $(".online_cert input[name='pay_type'][value=" + data.data.pay_type + "]").attr("checked", true);

             if (data.data.auth_open == 1)
                $('.auth_cert .switch').removeClass('switch-close').addClass('switch-open');
            else
                $('.auth_cert .switch').removeClass('switch-open').addClass('switch-close');
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
$(document).on('click', '.auth_cert .switch', function() {
    var that = this;
    var auth_open = $(that).hasClass('switch-open') ? 2 : 1;
    $.ajax({
        url: ApiUrl + 'cert/realname/auth_open',
        type: 'post',
        dataType: 'json',
        data: { auth_open: auth_open },
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
    if(pay_type>1){
        $('#rzjf').show();
     }else{
       $('#rzjf').hide();
     }
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

$(document).on('click', '.online_cert .buy-instance', function() {
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

// 短信 - sms_pakage
var is_created_chart = false;
var __init_sms_pakage = function() {
    $.ajax({
        url: ApiUrl + 'sms/plat/setting',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            if (data.data.status == 1)
                $('.sms_package .switch').removeClass('switch-close').addClass('switch-open');
            else
                $('.sms_package .switch').removeClass('switch-open').addClass('switch-close');
            $('.sms_package input[name=rest_count]').val(data.data.num);
            $('.sms_package input[name=sign]').val(data.data.sign);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
    $.ajax({
        url: ApiUrl + 'sms/plat/package_list',
        type: 'get',
        dataType: 'json',
        success: function(data) {
            var html = '';
            $.each(data.data.list, function(k, v) {
                html += `<li>
				<a data-weid="` + v.weid + `" data-num="` + v.num + `" class="pid" href="javascript:;">` + v.num + `条 / ` + v.price + `元</a>
			</li>`;
            });
            $('.sms_package .message_package_con').html(html);
            $('.sms_package .message_package_con').find('li:first-child').find('a').addClass('current');
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}
var chart = {
    init: function(weid) {
        var _self = this;
        this.getData(weid, function(data) {
            _self.createChartCity(data.city);
            _self.createChartTimeLine(data.timeline);
        });
    },
    getData: function(weid, callback) {
        var _self = this;
        var url = ApiUrl + 'sms/plat/statistics';
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: {
                timestamp: weid
            },
            success: function(res) {
                if (res.code == 200) {
                    var data = _self.formatData(res.data);
                    callback && callback(data);
                } else {
                    $('.data').hide();
                }
            },
            error: function(xhr, code, error) {
                notice.alert(error);
            },
            complete: function() {}
        });
    },
    formatData: function(data) {
        var colors = ['#24aa98', '#65abd0', '#d9c26c', '#db7560', '#af6dd5', '#898e93', '#32b9e6', '#8cbe52', '#ffab27', '#c88b76'];
        var tmp = {
            city: [],
            timeline: {
                labels: [],
                datasets: [{
                    label: "发送流量",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                }]
            }
        };
        for (var i = 0; i < data['type'].length; i++) {
            var city = data['type'][i];
            tmp.city.push({
                value: city.value,
                color: colors[i],
                highlight: colors[i],
                label: city.name
            });
        };
        for (var i = 0; i < data['timeline'].length; i++) {
            var time = data['timeline'][i];
            tmp.timeline.labels.push(time.name);
            tmp.timeline.datasets[0].data.push(time.value);
        }
        return tmp;
    },
    createChartCity: function(data) {
        this.createDoughnut('chartPie', data);
        this.createList('listPie', data);
    },
    createChartTimeLine: function(data) {
        var chart = this.getChart('chartLine');
        chart.Line(data);
    },
    createDoughnut: function(id, data, options) {
        if (!options) options = {};
        var chart = this.getChart(id);
        chart.Pie(data, options);
    },
    getChart: function(id) {
        var ctx = document.getElementById(id).getContext('2d');
        var chart = new Chart(ctx);
        return chart;
    },
    createList: function(id, list) {
        var html = '';
        var total = 0;
        for (var i = 0; i < list.length; i++) {
            total += parseInt(list[i].value);
        }
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var percent = item.value / total * 100;
            html += '<li><span class="mark" style="background-color:' + item.color + '"></span>' + item.label + ' <label>' + percent.toFixed(1) + '%</label></li>';
        };
        $('#' + id).append(html);
    }
}
$(document).on('click', '.sms_package .switch', function() {
    var that = this;
    var status = $(that).hasClass('switch-open') ? 2 : 1;
    $.ajax({
        url: ApiUrl + 'sms/plat/toggle',
        type: 'post',
        dataType: 'json',
        data: { status: status },
        success: function(data) {
            if (data.code == 200) {
                if (data.data.status == 1) {
                    $(that).removeClass('switch-close').addClass('switch-open');
                } else {
                    $(that).removeClass('switch-open').addClass('switch-close');
                }
            } else {
                swal('提示', data.message, 'error');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });

});
$(document).on('click', '.sms_package .edit_domain', function() {
    if (!is_created_chart) {
        chart.init(Math.random());
        is_created_chart = true;
    }
});
$('#signSet').click(function() {
    var sign = $('input[name=sign]').val();
    var formList = {
        'sign': sign
    };
    $.ajax({
        url: ApiUrl + 'sms/plat/setting',
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
                swal('提示', data.message, 'error');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
});


$(document).on('click', '.sms_package  .btn-cancel-buy', function() {
    var that = this;
    $(that).closest('.message_box').find('.message_buy_box').slideToggle('normal', function() {
        $(that).text($(that).closest('.message_box').find('.message_buy_box').css('display') === 'none' ? '购买' : '取消');
    });

});

$(document).on('click', '.sms_package .message_package_con>li>a', function() {
    $(this).addClass('current').closest('li').siblings('li').find('a').removeClass('current');
});

$(document).on('click', '.sms_package .buy-instance', function() {
    if ($('.sms_package .message_package_con a.pid.current').length === 0) {
        swal('提示', '请选择套餐', 'error');
        return;
    }
    var that = this;
    var package = $('.sms_package .message_package_con a.pid.current').data('weid');
    $.ajax({
        url: ApiUrl + 'wxpay/sms_package',
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
            $('.sms_package input[name=order_id]').val(data.data.order_id);
            tmr = setInterval(function() {
                var order = data.data.order_id;
                $.ajax({
                    url: ApiUrl + 'sms/plat/order/order_detect',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        number: order
                    },
                    success: function(rep) {
                        if (rep.data.status == 1) {
                            swal(
                                '支付成功!',
                                '平台已获取' + $('.sms_package .message_package_con a.pid.current').data('num') + '次发送短信能力',
                                'success'
                            );
                            clearInterval(tmr);
                            $('.sms_package input[name=rest_count]').val(parseInt($('.sms_package input[name=rest_count]').val()) + parseInt($('.sms_package .message_package_con a.pid.current').data('num')));
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
                swal({text: '保存成功',type: 'success', timer: 20000});
                //swal('提示', '保存成功', 'success');
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
                swal({text: '保存成功',type: 'success', timer: 20000});
                //swal('提示', '保存成功', 'success');
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
                swal({text: '保存成功',type: 'success', timer: 20000});
                //swal('提示', '保存成功', 'success');
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
                swal({text: '保存成功',type: 'success', timer: 20000});
                //swal('提示', '保存成功', 'success');
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


/**
 * ------------------------------------------------
 * apps script
 * ------------------------------------------------
 */

// 微主页配置 - wepages_config
var allowTpl = ['UA', 'UG', 'UM'];
var __init_wepages_config = function() {
    $.ajax({
        url: ApiUrl + 'setting/alias/wepagesConfig',
        type: 'get',
        dataType: 'json',
        success: function(result) {
            if (result.code === 200) {
                var open_allow_source = result.data.open_allow_source;
                var modifyLimit = result.data.modifyLimit;
                if (open_allow_source.length > 0) {
                    $(open_allow_source).each(function(k, v) {
                        $('input[name=open_allow_source][value=' + v + ']').attr('checked', true);
                    });
                }
                $('input[name=modifyLimit]').val(modifyLimit);

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
$('#wepagesSet').click(function() {
    var open_allow_source = [];
    $("input[name=open_allow_source]:checked").each(function(k, v) {
        open_allow_source.push($(v).val());
    });
    var modifyLimit = $('input[name=modifyLimit]').val();
    var formList = {
        'open_allow_source': open_allow_source,
        'modifyLimit': modifyLimit
    };
    $.ajax({
        url: ApiUrl + 'setting/alias/wepagesConfig',
        type: 'post',
        dataType: 'json',
        data: {
            config: formList
        },
        success: function(data) {
            console.log(data);
            if (data.code === 200) {
                swal({text: '保存成功',type: 'success', timer: 20000});
                //swal('提示', '保存成功', 'success');
            } else {
                console.log('error: -200');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
});
$('#certnameSet').click(function() {
    var cert_name =  $.trim($('input[name=cert_name]').val());
    if(cert_name==''){
        return false;
    }
    var formList = {
        'cert_name': cert_name,
    };
    $.ajax({
        url: ApiUrl + 'cert/realname/setting_update',
        type: 'post',
        dataType: 'json',
        data:formList,
        success: function(data) {
            if (data.code === 200) {
                swal({text: '保存成功',type: 'success', timer: 20000});
            } else {
                console.log('error: -200');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
});
$('#update_auth_money').click(function() {
    var auth_money =  $.trim($('input[name=auth_money]').val());
    if(auth_money==''){
        return false;
    }
    var formList = {
        'auth_money': auth_money,
    };
    $.ajax({
        url: ApiUrl + 'cert/realname/setting_update',
        type: 'post',
        dataType: 'json',
        data:formList,
        success: function(data) {
            if (data.code === 200) {
                swal({text: '保存成功',type: 'success', timer: 20000});
            } else {
                console.log('error: -200');
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
});





// 另一个app - another

var __init_another = function() {
    console.log('Hello world!');
}
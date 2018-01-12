/**
 * Created by weifeng on 2017/8/29.
 */

// 判断 sessionStorage
if (sessionStorage.lastname == "we_title_1") {
    $("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_1").find(".title-img").css("transform", "rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
// console.log('logo:',favicon);
$('#favicon').attr('href', favicon);
var qiniu_uptoken = '';
var saveto = 'qiniu';
var __init = function() {
    $.ajax({
        url: QINIU_UPTOKEN_URL,
        type: 'get',
        dataType: 'json',
        success: function(data) {
            qiniu_uptoken = data.uptoken;
        },
        error: function(xhr) {
            console.error(xhr);
        }
    });
}

// 查看微主页开通情况
var pageInfo = function(callback) {
    $.ajax({
        url: PAGES_PAGE_INFO,
        type: 'GET',
        success: function(data) {
            if (data.code == 200) {
                callback(data.data);
            } else {
                layer.msg(data.message);
            }
        },
        error: function(error) {
            console.log(error);
        }
    })
}

// 判断是否开通微主页
function avatar_admin() {
    layer.open({
        type: 1,
        title: '请设置您的个性域名',
        offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
            ,
        area: ['670px', '400px'],
        id: 'layerDemo' + type //防止重复弹出
            ,
        content: `
            <div class="cont-hd">
                <div class="panel panel-default panel-title">
                    <div class="panel-body">
                        请输入您专属的个性域名
                    </div>
                </div>
                <div class="form-group" style="margin-top: 60px;">
                    <label id="host" style="margin-left: 10px; padding-top: 8px; padding-right: 5px; float: left;"></label>
                    <input id="user-domain" type="text" class="form-control" name="domain" value="" style="width: 50%; float: left;">
                </div>
                <button id="submit_domain" type="submit" class="btn btn-default" style="margin-left: 10px; border-color: #ccc;">立即申请</button>
            </div>`
            //,btn: '关闭全部'
            ,
        btnAlign: 'c' //按钮居中
            ,
        shade: 0 //不显示遮罩
            ,
        yes: function() {
            layer.closeAll();
        },
        success: function(layero) {
            var host = 'http://' + window.location.host;
            $("#host").text(host + "/");
            var weid = docCookies.getItem("weid");
            var store = function(sendData) {
                $.ajax({
                    url: PAGESTORE,
                    type: 'POST',
                    data: sendData,
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            layer.msg('微主页开通成功！', {
                                time: 1500
                            });
                            setTimeout(function() {
                                window.location.reload();
                            }, 2000);

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

            $("#submit_domain").click(function() {
                var domain = $("#user-domain").val();
                var sendData = { weid: weid, domain: domain };
                if (domain != "") {
                    store(sendData);
                } else {
                    layer.msg('请输入个性域名', {
                        time: 1500
                    });
                }
            })

        }
    });
}
$(document).ready(function() {
    $(".correct-name").hide();
    $(".correct-id").hide();

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

    // 身份证正面图片上传
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'card_front_file',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look_front',
        max_file_size: '100mb',
        flash_swf_url: '../../common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look_front',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {});
            },
            'BeforeUpload': function(up, file) {},
            'UploadProgress': function(up, file) {},
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);

                var sourceLink = domain + res.key;
                $("#card_front_img").attr('src', sourceLink);
                $("input[name=card_front]").val(res.key);

            },
            'Error': function(up, err, errTip) {},
            'UploadComplete': function() {},
            'Key': function(up, file) {
                var key = "plat/cert/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    // 身份证反面图片上传
    var uploader1 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'card_back_file',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look_back',
        max_file_size: '100mb',
        flash_swf_url: '../../common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look_back',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {});
            },
            'BeforeUpload': function(up, file) {},
            'UploadProgress': function(up, file) {},
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);

                var sourceLink = domain + res.key;
                $("#card_back_img").attr('src', sourceLink);
                $("input[name=card_back]").val(res.key);

            },
            'Error': function(up, err, errTip) {},
            'UploadComplete': function() {},
            'Key': function(up, file) {
                var key = "plat/cert/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    //  登录token参数
    var token = docCookies.getItem("token");
    if (token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    var weid = '';

    function plusXing(str, frontLen, endLen) {
        var len = str.length - frontLen - endLen;
        var xing = '';
        for (var i = 0; i < len; i++) {
            xing += '*';
        }
        return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
    }

    var auth_info = function(data) {
        var operation_status;
        if (data.operation_status == 2) {
            operation_status = "已通过"
        } else {
            operation_status = "未通过"
        }
        var template = `
        <ul class="jumu">
            <li class="jumu-list"><label>身份证姓名：</label><span>` + data.name + `</span></li>
            <li class="jumu-list"><label>身份证号码：</label><span>` + plusXing(data.card_id, 3, 4) + `</span></li>
            <li class="jumu-list"><label>认 证 时 间 ：</label><span>` + data.updated_at + `</span><label>&emsp;认证状态：</label><span class="success-status">` + operation_status + `</span></li>
        </ul>`
        return template;
    }

    // 实名认证信息显示
    var options = $.get(CERT_REALNAME_DETAIL);
    options.done(function(data) {

        if (data.code == -200) {
            return false;
        }
        if (data.code === 200) {
            var result = data.data;
            if (result == null) {
                return false;
            }
            if (result.is_authenticated == 2) {
                $("#id-name").val(result.name);
                $("#id-card").val(result.card_id);
                return false;
            }
            $(".cert-success-info").show();
        }
    });
    options.fail(function(error) {
        console.error(error)
    });

    // 人工认证详情显示
    var options0 = $.get(CERT_REALNAME_DETAIL);
    options0.done(function(data) {

        if (data.code == -200) {
            return false;
        }
        if (data.code === 200) {
            var result = data.data;

            if (!result) {
                return false;
            }
            if (result.is_authenticated == 2 && result.operation_status == 3) {
                weid = result.weid;

                $(".submit2").show().siblings(".submit1, on-line").hide();
                $(".media-heading").text("认证被拒绝，请重新提交...").css("color", "#ec2d2d");
                $(".warn-img").attr("src", "/common/img/refuse.png");
                $("#id-name").val(result.name);
                $("#id-number").val(result.card_id);
                $("#card_front").val(result.card_front);
                $("#card_back").val(result.card_back);

                if (!result.card_front) {
                    console.info("身份证正面图片：" + result.card_front);
                } else if (result.card_front.indexOf('http') != 0 && result.card_front != "") {
                    result.card_front = ApiMaterPlatQiniuDomain + result.card_front;
                    $("#card_front_img").attr("src", result.card_front);
                } else if (result.card_front.indexOf('http') == 0 && result.card_front != "") {
                    $("#card_front_img").attr("src", result.card_front);
                }

                if (!result.card_back) {
                    console.info("身份证正面图片：" + result.card_back);
                } else if (result.card_back.indexOf('http') != 0 && result.card_back != "") {
                    result.card_back = ApiMaterPlatQiniuDomain + result.card_back;
                    $("#card_back_img").attr("src", result.card_back);
                } else if (result.card_back.indexOf('http') == 0 && result.card_back != "") {
                    $("#card_back_img").attr("src", result.card_back);
                }

            } else if (result.is_authenticated == 2 && result.operation_status == 1) {
                $(".cert-to-pass").show();
                $(".media-heading").text("实名认证中...").css("color", "#ffcc00");
                $(".warn-img").attr("src", "/common/img/carry.png");
            } else if (result.is_authenticated == 1 && result.operation_status == 2) {
                $(".cert-success-info").show().after(auth_info(result));
            }
        }
    });
    options0.fail(function(error) {
        console.error(error)
    });

    // 输入状态提示
    var name, id_card_number;
    $("#id-name").blur(function() {
        name = $("#id-name").val();
        if (name != '') {
            $(".correct-name").show();
            $(".correct-name img").attr('src', '/common/img/selected.png');
        } else {
            $(".correct-name").show();
            layer.msg("请输入合法字符", { time: 2500 });
            $(".correct-name img").attr('src', '/common/img/close.png');
        }
    })

    $("#id-name").focus(function() {
        $(".correct-name").hide();
    })

    $("#id-number").blur(function() {
        id_card_number = $("#id-number").val();
        if (id_card_number != '' && isCardNo(id_card_number)) {
            $(".correct-id img").attr('src', '/common/img/selected.png');
            $(".correct-id").show();
        } else {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            $(".correct-id img").attr('src', '/common/img/close.png');
            $(".correct-id").show();
        }
    })

    $("#id-number").focus(function() {
        $(".correct-id").hide();
    })

    // 身份证号码验证信息
    function isCardNo(card) {
        var objCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return objCard.test(card);
    }

    // 人工认证信息提交
    $("#submit").click(function() {
        var body = {};
        body.name = $("#id-name").val();
        body.card_id = $("#id-number").val();
        body.card_front = $("input[name=card_front]").val();
        body.card_back = $("input[name=card_back]").val();

        if (!body.name ||
            !body.card_id ||
            !body.card_front ||
            !body.card_back) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if (!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            return false;
        }

        var options1 = $.post(CERT_REALNAME, body);
        options1.done(function(data) {

            if (data.code == -200) {
                return false;
            }
            if (data.code == 200) {
                $("#form_list").hide();
                $(".cert-to-pass").show();
                $(".media-heading").text("实名认证中...").css("color", "#ffcc00");
                $(".warn-img").attr("src", "/common/img/carry.png");
            }
        })
        options1.fail(function(error) {
            console.error(error);
        });

        return false;
    })

    // 人工认证信息修改
    $("#modify").click(function() {
        var body = {};
        body.weid = weid;
        body.name = $("#id-name").val();
        body.card_id = $("#id-number").val();
        body.card_front = $("input[name=card_front]").val();
        body.card_back = $("input[name=card_back]").val();

        if (!body.name ||
            !body.card_id ||
            !body.card_front ||
            !body.card_back) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if (!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            return false;
        }

        var options2 = $.post(CERT_REALNAME_UPDATE, body);
        options2.done(function(data) {

            if (data.code == -200) {
                return false;
            }
            if (data.code === 200) {
                $("#form_list").hide();
                $(".cert-to-pass").show();
                $(".media-heading").text("实名认证中……").css("color", "#ffcc00");
                $(".warn-img").attr("src", "/common/img/carry.png");
            }
        })
        options2.fail(function(error) {
            console.error(error);
        });

        return false;
    });
    pageInfo(function(data) {
        if (!data.hasPages && data.isUA && $.inArray('UA', data.openAllowSource) != -1) {
            $(".open-wepage").show();
            $(".btn-open-wepage").bind("click", avatar_admin);
        } else {
            $(".open-wepage").hide();
        }
    });
});
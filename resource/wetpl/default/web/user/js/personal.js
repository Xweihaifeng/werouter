/**
 * Created by weifeng on 2017/8/30.
 */

// 判断 sessionStorage
if (sessionStorage.lastname == "we_title_1") {
    $("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_1").find(".title-img").css("transform", "rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:', favicon);
$('#favicon').attr('href', favicon);
var id_card_number = ''

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
                console.log(xhr);
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

$(document).ready(function() {

    $('[data-toggle="tooltip"]').tooltip();

    // 个人认证 > 证明材料图片上传
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look',
        max_file_size: '100mb',
        flash_swf_url: '../../common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look',
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
                $("#img").attr('src', sourceLink);
                $("input[name=per_cert_imgs]").val(res.key);
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

    // 隐藏身份证号码
    function plusXing(str, frontLen, endLen) {
        var len = str.length - frontLen - endLen;
        var xing = '';
        for (var i = 0; i < len; i++) {
            xing += '*';
        }
        return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
    }

    // 实名认证详情显示
    var options0 = $.get(CERT_REALNAME_DETAIL);
    options0.done(function(data) {
        if (data.code == -200) {
            return false;
        }
        if (data.code === 200) {
            var result = data.data;
            if (result == null) {
                return false;
            }
            if (result.is_authenticated == 1) {
                $("#personal").show();
                $("#id-name").val(result.name);
                id_card_number = result.card_id;
                $("#id-card").val(plusXing(result.card_id, 3, 4));
            }
        }
    });
    options0.fail(function(error) {
        console.error(error);
    });

    // 个人认证详情显示
    var options1 = $.get(CERT_OFCCERTS);
    options1.done(function(data) {
        if (data.code == 200) {
            var result = data.data;
            if (!result) {
                $(".institutional").attr({ "disabled": false, "href": "institutional" });
                return false;
            }
            if (result.type == 2) {
                window.location.href = "institutional"
            } else if (result.type == 1) {
                $(".institutional").attr("disabled", true);
                $(".institutional").click(function() {
                    layer.msg("您已经有个人认证记录，请勿重复认证！", { time: 2500 });
                    return false;
                });

                if (result.is_done == 1) {
                    $("#v_form_list").hide();
                    $(".media-heading").text("个人认证中...").css("color", "#ffcc00");
                    $(".warn-img").attr("src", "/common/img/carry.png");
                } else if (result.is_done == 2) {
                    if (result.is_authenticated == 2) {
                        $(".submit2").show().siblings(".submit1").hide();
                        $("#cert_info").val(result.cert_info);
                        $("#per_cert_imgs").val(result.per_cert_imgs);

                        if (!result.per_cert_imgs) {
                            console.info("证明资料：" + result.per_cert_imgs);
                        } else if (result.per_cert_imgs.indexOf('http') != 0 && result.per_cert_imgs != "") {
                            result.per_cert_imgs = ApiMaterPlatQiniuDomain + result.per_cert_imgs;
                            $("#img").attr("src", result.per_cert_imgs);
                        } else if (result.per_cert_imgs.indexOf('http') == 0 && result.per_cert_imgs != "") {
                            $("#img").attr("src", result.per_cert_imgs);
                        }

                        if (result.operation_status == 3) {
                            $(".media-heading").text("个人认证已被拒绝，重新提交...").css("color", "#ec2d2d");
                            $(".warn-img").attr("src", "/common/img/refuse.png");
                        }
                    } else if (result.is_authenticated == 1) {
                        $("#v_form_list").hide();
                        $(".media-heading").text("恭喜，您已经通过个人认证！").css("color", "#05a957");
                        $(".warn-img").attr("src", "/common/img/pass.png");
                    }
                }
            }
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });

    // 身份证号码验证信息
    function isCardNo(card) {
        var objCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return objCard.test(card);
    }

    // 提交填写个人认证信息
    $("#submit").click(function() {
        var body = {};
        body.type = 1;
        body.card_id = id_card_number;
        body.name = $("#id-name").val();
        body.cert_info = $("#cert_info").val();
        body.per_cert_imgs = $("#per_cert_imgs").val();

        if (!body.name ||
            !body.card_id ||
            !body.cert_info ||
            !body.per_cert_imgs) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if (!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            return false;
        }

        var options = $.post(CERT_OFCCERTS, body);
        options.done(function(data) {
            if (data.code == -200) {
                return false;
            }
            if (data.code === 200) {
                $("#v_form_list").hide();
                $(".whether-to-pass").show();
                $(".media-heading").text("机构认证中...").css("color", "#ffcc00");
                $(".warn-img").attr("src", "/common/img/carry.png");
                return false;
            }
        })
        options.fail(function(error) {
            console.error(error);
        });

        return false;
    })

    // 修改填写个人认证信息
    $("#modify").click(function() {
        var body = {};
        var certUrl = CERT_OFCCERTS;
        body._method = "put",
            body.card_id = id_card_number;
        body.name = $("#id-name").val();
        body.cert_info = $("#cert_info").val();
        body.per_cert_imgs = $("#per_cert_imgs").val();

        if (!body.name ||
            !body.card_id ||
            !body.cert_info ||
            !body.per_cert_imgs) {
            layer.msg("请完善信息后重新提交", { time: 2500 });
            return false;
        }

        if (!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            return false;
        }

        $.ajax({
            url: certUrl,
            type: "post",
            dataType: "json",
            data: body,
            timeout: 20000,
            success: function(msg) {
                $("#v_form_list").hide();
                $(".whether-to-pass").show();
                $(".media-heading").text("机构认证中...").css("color", "#ffcc00");
                $(".warn-img").attr("src", "/common/img/carry.png");
                return false;
            },
            error: function(xhr, textstatus, thrown) {
                console.error(xhr, textstatus, thrown);
            }
        });

        return false;
    });

    pageInfo(function(data) {
        if (!data.hasPages && data.isUG && $.inArray('UG', data.openAllowSource) != -1) {
            $("#on_line").show();
        } else {
            $("#on_line").hide();
        }
    });

})
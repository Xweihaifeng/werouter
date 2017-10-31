/**
 * Created by weifeng on 2017/8/30.
 */

// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_1"){
    $("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_1").find(".title-img").css("transform","rotate(90deg)");
}

var qiniu_uptoken = '';
var saveto ='qiniu';
var __init = function(){
    $.ajax({
        url:  QINIU_UPTOKEN_URL,
        type: 'get',
        dataType: 'json',
        success: function(data){
            qiniu_uptoken = data.uptoken;
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
}

$(document).ready(function(){

    // 机构认证 > 营业执照图片上传
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles_license',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look_license',
        max_file_size: '100mb',
        flash_swf_url: '../../common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look_license',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                });
            },
            'BeforeUpload': function(up, file) {
            },
            'UploadProgress': function(up, file) {
            },
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);

                var sourceLink = domain + res.key;
                $("#img_license").attr('src', sourceLink);
                $("input[name=org_license_image]").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/cert/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    // 机构认证 > 授权资料图片上传
    var uploader1 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles_auth',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look_auth',
        max_file_size: '100mb',
        flash_swf_url: '../../common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look_auth',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                });
            },
            'BeforeUpload': function(up, file) {
            },
            'UploadProgress': function(up, file) {
            },
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);

                var sourceLink = domain + res.key;
                $("#img_auth").attr('src', sourceLink);
                $("input[name=org_auth_imgs]").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/cert/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    // 机构认证 > 证明资料图片上传
    var uploader2 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles_cert',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look_cert',
        max_file_size: '100mb',
        flash_swf_url: '../../common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look_cert',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {
                });
            },
            'BeforeUpload': function(up, file) {
            },
            'UploadProgress': function(up, file) {
            },
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);

                var sourceLink = domain + res.key;
                $("#img_cert").attr('src', sourceLink);
                $("input[name=org_cert_imgs]").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/cert/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    //  登录token参数
    var token = window.localStorage.getItem('token');
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    // 机构认证详情显示
    var options1 = $.get(CERT_OFCCERTS);
    options1.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            if(!result) {
                $(".personal").attr({"disabled": false, "href": "personal"});
                return false;
            }

            if(result.type == 1) {
                window.location.href = "personal"
            } else if(result.type == 2) {
                $(".personal").attr("disabled", true);
                $(".personal").click(function() {
                    layer.msg("您已经有机构认证记录， 请勿重复认证！", { time: 2500 });
                    return false;
                });

                if(result.is_done == 1) {
                    $(".form-horizontal").hide();
                    $(".whether-to-pass").show();
                    $(".media-heading")  .text("机构认证中...").css("color", "#ffcc00");
                    $(".warn-img")       .attr("src", "/common/img/carry.png");
                } else if(result.is_done == 2) {
                    if(result.is_authenticated == 2) {

                        $(".submit2")           .show().siblings(".submit1").hide();
                        $("#org_name")          .val(result.org_name);
                        $("#org_license_image") .val(result.org_license_image);
                        $("#org_cert_number")   .val(result.org_cert_number);
                        $("#org_scope_common")  .val(result.org_scope_common);
                        $("#org_scope_front")   .val(result.org_scope_front);
                        $("#org_type")          .val(result.org_type);
                        $("#org_setup_date")    .val(result.org_setup_date);
                        $("#org_auth_imgs")     .val(result.org_auth_imgs);
                        $("#org_contact_people").val(result.org_contact_people);
                        $("#org_contact_phone") .val(result.org_contact_phone);
                        $("#org_address")       .val(result.org_address);
                        $("#cert_info")         .val(result.cert_info);
                        $("#org_cert_imgs")     .val(result.org_cert_imgs);

                        if(!result.org_license_image) {
                            console.info("营业执照图片：" + result.org_license_image);
                        } else if (result.org_license_image.indexOf('http') != 0 && result.org_license_image != "") {
                            result.org_license_image = ApiMaterPlatQiniuDomain + result.org_license_image;
                            $("#img_license").attr("src", result.org_license_image);
                        } else if(result.org_license_image.indexOf('http') == 0 && result.org_license_image != "") {
                            $("#img_license").attr("src", result.org_license_image);
                        }

                        if(!result.org_auth_imgs) {
                            console.info("授权资料图片：" + result.org_auth_imgs);
                        } else if (result.org_auth_imgs.indexOf('http') != 0 && result.org_auth_imgs != "") {
                            result.org_auth_imgs = ApiMaterPlatQiniuDomain + result.org_auth_imgs;
                            $("#img_auth").attr("src", result.org_auth_imgs);
                        } else if(result.org_auth_imgs.indexOf('http') == 0 && result.org_auth_imgs != "") {
                            $("#img_auth").attr("src", result.org_auth_imgs);
                        }

                        if(!result.org_cert_imgs) {
                            console.info("证明资料图片：" + result.org_cert_imgs);
                        } else if (result.org_cert_imgs.indexOf('http') != 0 && result.org_cert_imgs != "") {
                            result.org_cert_imgs = ApiMaterPlatQiniuDomain + result.org_cert_imgs;
                            $("#img_cert").attr("src", result.org_cert_imgs);
                        } else if(result.org_cert_imgs.indexOf('http') == 0 && result.org_cert_imgs != "") {
                            $("#img_cert").attr("src", result.org_cert_imgs);
                        }

                        if(result.operation_status == 3) {
                            $(".media-heading")  .text("机构认证已被拒绝，重新提交").css("color", "#ec2d2d");
                            $(".warn-img")       .attr("src", "/common/img/refuse.png");
                        }
                    } else if (result.is_authenticated == 1) {
                        $(".form-horizontal").hide();
                        $(".media-heading")  .text("恭喜，您已经通过机构认证！").css("color", "#05a957");
                        $(".warn-img")       .attr("src", "/common/img/pass.png");
                    }
                }
            }
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });

    // 手机号码验证信息
    var regExp = "^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\\d{8}$";
    var objExp = new RegExp(regExp);

    // 提交机构认证填写信息
    $("#submit").click(function(){
        var body = {};
        body.type               = 2;
        body.org_name           = $("#org_name").val();
        body.org_license_image  = $("#org_license_image").val();
        body.org_cert_number    = $("#org_cert_number").val();
        body.org_scope_common   = $("#org_scope_common").val();
        body.org_scope_front    = $("#org_scope_front").val();
        body.org_type           = $("#org_type").val();
        body.org_setup_date     = $("#org_setup_date").val();
        body.org_auth_imgs      = $("#org_auth_imgs").val();
        body.org_contact_people = $("#org_contact_people").val();
        body.org_contact_phone  = $("#org_contact_phone").val();
        body.org_address        = $("#org_address").val();
        body.cert_info          = $("#cert_info").val();
        body.org_cert_imgs      = $("#org_cert_imgs").val();

        if(    !body.org_name
            || !body.org_license_image
            || !body.org_cert_number
            || !body.org_scope_common
            || !body.org_scope_front
            || !body.org_type
            || !body.org_setup_date
            || !body.org_auth_imgs
            || !body.org_contact_people
            || !body.org_contact_phone
            || !body.org_address
            || !body.cert_info
            || !body.org_cert_imgs) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!objExp.test(body.org_contact_phone)) {
            layer.msg("请输入正确的手机号码后重新提交！", { time: 2500 });
            return false;
        }

        var options = $.post(CERT_OFCCERTS, body);
        options.done(function(data) {
            if(data.code == -200) {
                return false;
            }
            if(data.code === 200) {
                $(".form-horizontal").hide();
                $(".whether-to-pass").show();
                $(".media-heading")  .text("机构认证中...").css("color", "#ffcc00");
                $(".warn-img")       .attr("src", "/common/img/carry.png");
                console.info("提交成功 ", data);
            }
        })
        options.fail(function(error) {
            console.error(error);
        });

        return false;
    })

    // 修改机构认证填写信息
    $("#modify").click(function(){
        var body = {};
        body._method            = "put",
        body.org_name           = $("#org_name").val();
        body.org_license_image  = $("#org_license_image").val();
        body.org_cert_number    = $("#org_cert_number").val();
        body.org_scope_common   = $("#org_scope_common").val();
        body.org_scope_front    = $("#org_scope_front").val();
        body.org_type           = $("#org_type").val();
        body.org_setup_date     = $("#org_setup_date").val();
        body.org_auth_imgs      = $("#org_auth_imgs").val();
        body.org_contact_people = $("#org_contact_people").val();
        body.org_contact_phone  = $("#org_contact_phone").val();
        body.org_address        = $("#org_address").val();
        body.cert_info          = $("#cert_info").val();
        body.org_cert_imgs      = $("#org_cert_imgs").val();

        if(    !body.org_name
            || !body.org_license_image
            || !body.org_cert_number
            || !body.org_scope_common
            || !body.org_scope_front
            || !body.org_type
            || !body.org_setup_date
            || !body.org_auth_imgs
            || !body.org_contact_people
            || !body.org_contact_phone
            || !body.org_address
            || !body.cert_info
            || !body.org_cert_imgs) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!objExp.test(body.org_contact_phone)) {
            layer.msg("请输入正确的手机号码后重新提交！", { time: 2500 });
            return false;
        }

        var options3 = $.post(CERT_OFCCERTS, body);
        options3.done(function(data) {
            if(data.code == -200) {
                return false;
            }
            if(data.code === 200) {
                $(".form-horizontal").hide();
                $(".whether-to-pass").show();
                $(".media-heading")  .text("机构认证中...").css("color", "#ffcc00");
                $(".warn-img")       .attr("src", "/common/img/carry.png");
                console.info("修改成功 ", data);
            }
        })
        options3.fail(function(error) {
            console.error(error);
        });

        return false;
    })
})
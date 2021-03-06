$(document).ready(function () {
    start();
    var weid = '';
    var init = function () {
        var type_id = '';
        // 获取版本列表
        $.ajax({
            url: ApiUrl + "cms/site/get_edition",
            type: 'get',
            dataType: 'JSON',
            success: function (result) {
                if (result.code === 200) {
                    var html = '';
                    $.each(result.data, function (key, val) {
                        html += '<option name="options" value=' + val.id + '>' + val.name + '</option>';
                    });
                    $("#editionId").html(html);
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            }
        });
        // 获取模板列表
        $.ajax({
            url: ApiUrl + "cms/site/get_template",
            type: 'get',
            dataType: 'JSON',
            success: function (result) {
                if (result.code === 200) {
                    var html = '';
                    $.each(result.data, function (key, val) {
                        html += '<option name="options" value=' + val.id + '>' + val.title + '</option>';
                    });
                    $("#templateId").html(html);
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            }
        });

        //数据初始化
        $.getJSON(ApiUrl + "cms/site/show?weid=" + getUrlParam('weid'), function (result) {
            if (result.code === 200) {
                //console.log(result);
                $("#editionId").find("option[value=" + result.data.edition_id + "]").attr("selected", true);
                $("#templateId").find("option[value=" + result.data.template_id + "]").attr("selected", true);
                $('input[name=site_name]').val(result.data.site_name);
                $('input[name=domain]').val(result.data.domain);
                $('input[name=real_name]').val(result.data.real_name);
                $('input[name=phone]').val(result.data.phone);
                $('input[name=logo]').val(result.data.logo);
                $('textarea[name=description]').val(result.data.description);
                $('textarea[name=key_word]').val(result.data.key_word);
                $('input[name=email]').val(result.data.email);
                $('input[name=tel]').val(result.data.tel);
                $('input[name=fax]').val(result.data.fax);
                $('input[name=addre]').val(result.data.addre);

                if (result.data.logo != '' && result.data.logo != null) {
                    $('#img_logo').attr('src', ApiMaterPlatQiniuDomain + result.data.logo);
                }
                weid = result.data.weid;
            } else {
                alert(data.message);
                //console.log(data);
            }
        });
    };
    init();
    //非空验证
    $('#form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            site_name: {
                message: '分站名称无效',
                validators: {
                    notEmpty: {
                        message: '分站名称不能为空'
                    },
                    StringLength: {
                        min: 2,
                        max: 50,
                        message: '分站名称长度大于2位并且小于50位'
                    }
                }
            },
            domain: {
                message: '别名无效',
                validators: {
                    notEmpty: {
                        message: '别名不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 10,
                        message: '别名长度为1到10位'
                    },
                    regexp: {
                        regexp: /^[a-z0-9]+$/,
                        message: '别名只能由小写字母或数字组成'
                    }
                }
            },
            real_name: {
                message: '用户昵称无效',
                validators: {
                    notEmpty: {
                        message: '用户昵称不能为空'
                    },
                }
            },
            phone: {
                message: '手机号码无效',
                validators: {
                    notEmpty: {
                        message: '手机号码不能为空'
                    },
                    // stringLength: {
                    //     min: 11,
                    //     max: 11,
                    //     message: '手机号码长度为11位'
                    // },
                    regexp: {
                        regexp: /^1[3|4|5|8][0-9]\d{4,8}$/,
                        message: '请输入有效手机号码'
                    }
                }
            },
            password: {
                message: '密码无效',
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 10,
                        message: '密码长度为6到10位'
                    },
                    regexp: {
                        regexp: /^[a-z0-9]+$/,
                        message: '密码只能由小写字母或数字组成'
                    }
                }
            },
        }
    });
    $("#editSite").click(function () {
        $('#form').data('bootstrapValidator').validate();
        if (!$('#form').data('bootstrapValidator').isValid()) {
            return;
        }
        var data = {
            weid: weid,
            edition_id: $("#editionId").find("option:selected").val(),
            template_id: $("#templateId").find("option:selected").val(),
            site_name: $('input[name=site_name]').val(),
            domain: $('input[name=domain]').val(),
            real_name: $('input[name=real_name]').val(),
            phone: $('input[name=phone]').val(),
            password: $('input[name=password]').val(),
            logo: $('input[name=logo]').val(),
            description: $('textarea[name=description]').val(),
            key_word: $('textarea[name=key_word]').val(),
            email: $('input[name=email]').val(),
            tel: $('input[name=tel]').val(),
            fax: $('input[name=fax]').val(),
            addre: $('input[name=addre]').val()
        };
        console.log(data);
        $.ajax({
            type: "POST",
            dataType: "json",
            data: data,
            url: ApiUrl + 'cms/site/update',
            success: function (data) {
                if (data.code === 200) {
                    window.location.replace('sites.html');
                } else {
                    swal({text: data.message, type: 'error', timer: 20000});
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'logofile',
        uptoken_url: ApiUrl + 'file/qiniu_token',
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look',
        max_file_size: '100mb',
        flash_swf_url: 'http://cdn.staticfile.org/plupload/2.1.8/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function (up, files) {
                plupload.each(files, function (file) {
                });
            },
            'BeforeUpload': function (up, file) {
            },
            'UploadProgress': function (up, file) {
            },
            'FileUploaded': function (up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);
                console.log(res);
                $("input[name=logo]").val(res.key);
                var sourceLink = domain + res.key;
                $("#img_logo").attr('src', sourceLink);
            },
            'Error': function (up, err, errTip) {
            },
            'UploadComplete': function () {
            },
            'Key': function (up, file) {
                var key = "plats/resource/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: ApiUrl + 'file/qiniu_token',
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look',
        max_file_size: '100mb',
        flash_swf_url: 'http://cdn.staticfile.org/plupload/2.1.8/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function (up, files) {
                plupload.each(files, function (file) {
                });
            },
            'BeforeUpload': function (up, file) {
            },
            'UploadProgress': function (up, file) {
            },
            'FileUploaded': function (up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);
                $("input[name=image]").val(res.key);
                var sourceLink = domain + res.key;
                $("#img").attr('src', sourceLink);
            },
            'Error': function (up, err, errTip) {
            },
            'UploadComplete': function () {
            },
            'Key': function (up, file) {
                var key = "plats/resource/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });
})
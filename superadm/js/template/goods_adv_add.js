$(document).ready(function () {
    start();
    //分类select初始化
    var initSelect = function () {
        var advTypes = '';
        $.getJSON(ApiUrl + "plats/goods/adv_type_list", function (result) {
            $.each(result.data, function (i, item) {
                advTypes = advTypes + '<option value="' + item.weid + '">' + item.title + '</option>';
            });
            $("#type-select").append(advTypes);
        });
    };
    initSelect();
    //非空验证
    $('#form').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            title: {
                message: '标题无效',
                validators: {
                    notEmpty: {
                        message: '标题不能为空'
                    },
                    StringLength: {
                        min: 2,
                        max: 50,
                        message: '标题长度大于2位并且小于50位'
                    }
                }
            },
        }
    });
    $("#addAdv").click(function () {
        $('#form').data('bootstrapValidator').validate();
        if (!$('#form').data('bootstrapValidator').isValid()) {
            return;
        }
        var image = $('input[name=image]').val();
        if (image == '') {
            image = '#';
        }
        var url = $('input[name=url]').val();
        if (url == '') {
            url = '#';
        }
        var data = {
            title: $('input[name=title]').val(),
            description: $('input[name=description]').val(),
            url: url,
            type_id: $("#type-select").val(),
            image: image,
        };
        $.ajax({
            type: "POST",
            dataType: "json",
            data: data,
            url: ApiUrl + 'plats/goods/adv_add',
            success: function (data) {
                if (data.code === 200) {
                    window.location.replace('goods_adv.html');
                } else {
                    alert(data.message);
                    console.log(data);
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
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
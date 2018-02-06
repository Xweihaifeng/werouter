$(document).ready(function () {
    start();
    var weid = getUrlParam('weid');
    if (isNull(weid) == false) {
        //编辑
        $.ajax({
            url: ApiUrl + 'plats/goods/adv_type_detail',
            type: 'POST',
            data: {
                weid: weid
            },
            success: function (data) {
                if (data.code == 200) {
                    console.log(data.data);
                    $("input[name=weid]").val(data.data.weid);
                    $("input[name=title]").val(data.data.title);
                    $("input[name=description]").val(data.data.description);
                }
            }
        });
    }

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
    $("#updateAdv").click(function () {
        $('#form').data('bootstrapValidator').validate();
        if (!$('#form').data('bootstrapValidator').isValid()) {
            return;
        }
        var weid = $("input[name=weid]").val();
        var title = $("input[name=title]").val();
        var description = $("input[name=description]").val();
        if (isNull(weid)) {
            //保存提交
            $.ajax({
                url: ApiUrl + 'plats/goods/adv_type_add',
                type: 'POST',
                data: {
                    title: title,
                    description: description
                },
                success: function (data) {
                    if (data.code == 200) {
                        location.href = 'goods_adv_types.html';
                    } else {
                        swal(data.message, 'error');
                    }
                }
            });
        } else {
            //修改提交
            $.ajax({
                url: ApiUrl + 'plats/goods/adv_type_edit',
                type: 'POST',
                data: {
                    weid: weid,
                    title: title,
                    description: description
                },
                success: function (data) {
                    if (data.code == 200) {
                        location.href = 'goods_adv_types.html';
                    } else {
                        swal(data.message, 'error');
                    }
                }
            });
        }
    });
})
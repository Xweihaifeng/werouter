$(document).ready(function () {
    start();
    var weid = getUrlParam('weid');
    if (isNull(weid) == false) {
        //编辑
        $.ajax({
            url: ApiUrl + 'plats/articles/category_detail',
            type: 'POST',
            data: {
                weid: weid
            },
            success: function (data) {
                if (data.code == 200) {
                    console.log(data.data);
                    $("input[name=weid]").val(data.data.weid);
                    $("input[name=name]").val(data.data.name);
                    $("input[name=ename]").val(data.data.ename);
                    $("input[name=sort]").val(data.data.sort);
                }
            }
        });
    }
    //form表单验证
    $('#formcate').bootstrapValidator({
        excluded: [":disabled"],
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: '分类名称不能为空'
                    }
                }
            },
        }
    });

    //提交
    $('.submit').click(function () {
        $('#formcate').data('bootstrapValidator').validate();
        if (!$('#formcate').data('bootstrapValidator').isValid()) {
            return;
        }
        var weid = $("input[name=weid]").val();
        var name = $("input[name=name]").val();
        var ename = $("input[name=ename]").val();
        var sort = $("input[name=sort]").val();
        if (isNull(weid)) {
            //保存提交
            $.ajax({
                url: ApiUrl + 'plats/articles/category_add',
                type: 'POST',
                data: {
                    name: name,
                    ename: ename,
                    sort: sort
                },
                success: function (data) {
                    if (data.code == 200) {
                        location.href = 'article_category.html';
                    } else {
                        swal(data.message, 'error');
                    }
                }
            });
        } else {
            //修改提交
            $.ajax({
                url: ApiUrl + 'plats/articles/category_edit',
                type: 'POST',
                data: {
                    weid: weid,
                    name: name,
                    ename: ename,
                    sort: sort
                },
                success: function (data) {
                    if (data.code == 200) {
                        location.href = 'article_category.html';
                    } else {
                        swal(data.message, 'error');
                    }
                }
            });
        }
    });
});
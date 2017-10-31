$(document).ready(function() {
    start();

    var weid = getUrlParam('weid');

    if (isNull(weid) == false) {
        //编辑
        $.ajax({
            url: ApiUrl + 'vote/cate_edit/' + weid,
            type: 'GET',
            success: function(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    $("input[name=weid]").val(data.data.weid);
                    $("input[name=title]").val(data.data.title);
                    $("textarea[name=remark]").val(data.data.remark);
                }
            }
        })
    } else {
        //添加
        $.ajax({
            url: ApiUrl + 'vote/cate_create',
            type: 'GET',
            success: function(data) {
                if (data.code == 200) {

                }
            }
        })
    }
    //form表单验证
    $('#formcate').bootstrapValidator({
        excluded: [":disabled"],
        　　　　　　message: 'This value is not valid',
        feedbackIcons: {　　　　　　　　 valid: 'glyphicon glyphicon-ok', 　　　　　　　　invalid: 'glyphicon glyphicon-remove', 　　　　　　　　validating: 'glyphicon glyphicon-refresh'　　　　　　　　 },
        fields: {
            title: {
                validators: {
                    notEmpty: {
                        message: '投票名称不能为空'
                    }
                }
            },
        }
    });

    //提交
    $('.submit').click(function() {
        $('#formcate').data('bootstrapValidator').validate();
        if (!$('#formcate').data('bootstrapValidator').isValid()) {
            return;
        }
        var weid = $("input[name=weid]").val();
        if (isNull(weid)) {
            //保存提交
            $.ajax({
                url: ApiUrl + 'vote/cate_store',
                type: 'POST',
                data: $("form").serialize(),
                success: function(data) {
                    if (data.code == 200) {
                        location.href = 'voteCategory.html';
                    } else {
                        swal('提示', data.message, 'error');
                    }
                }
            })
        } else {
            //修改提交
            $.ajax({
                url: ApiUrl + 'vote/cate_update',
                type: 'POST',
                data: $("form").serialize(),
                success: function(data) {
                    if (data.code == 200) {
                        location.href = 'voteCategory.html';
                    } else {
                        swal('提示', data.message, 'error');
                    }
                }
            })
        }
    });
})
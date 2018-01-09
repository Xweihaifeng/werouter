$(document).ready(function () {
    start();
    var init = function () {
        $.ajax({
            url: ApiUrl + "plat_template",
            type: 'get',
            dataType: 'JSON',
            success: function(result) {
                if(result.code === 200) {
                    var defaults = customs = '';
                    $.each(result.data, function(key, val) {
                        if (val.isCustom == 1) {
                            customs += '<div style="width: 200px; float: left; text-align: center; margin-right: 20px; line-height: 40px;">' +
                                '<img width="200" src="/resource/wetpl/' + val.mark + '/' + val.cover + '"></br>' +
                                '<input type="radio" name="templateId" value=' + val.id + '>' + val.title +
                                '<span style="padding-left: 15px;">预览</span></div>';
                        } else {
                            defaults += '<div style="width: 200px; float: left; text-align: center; margin-right: 20px; line-height: 40px;">' +
                                '<img width="200" src="/resource/wetpl/' + val.mark + '/' + val.cover + '"></br>' +
                                '<input type="radio" name="templateId" value=' + val.id + '>' + val.title +
                                '<span style="padding-left: 15px;">预览</span></div>';
                        }
                    });
                    $("#default").html(defaults);
                    $("#custom").html(customs);

                } else {
                    parent.layer.msg(result.message);
                    return false;
                }
            }
        });
    };
    init();

    // Save
    $("#updateSet").click(function () {
        var templateId = $("input[name='templateId']:checked").val();
        $.ajax({
            url: ApiUrl + 'plat_set_template',
            type: 'post',
            dataType: 'json',
            data: {template_id: templateId},
            success: function (data) {
                if (data.code === 200) {
                    swal('', '保存成功', 'success');
                } else {
                    swal('', data.message, 'error');
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });
});
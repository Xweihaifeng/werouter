$(document).ready(function () {
    start();
    $.ajax({
        url: ApiUrl + 'plat_setting',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if (data.code === 200) {
                if (data.data.is_custom != 1) {
                    $(".but").animate({left: -40},0);
                    $(".hidde").slideDown();
                    $(".module").removeClass("block");
                    $(".module_li").addClass("block");
                }else {
                    $(".module").removeClass("block");
                    $(".module_li").addClass("block");
                    $("#diy").addClass("shown").siblings().removeClass("shown");
                    $(".form-child > li:nth-of-type(2)").addClass("block").siblings().removeClass("block");
                }
            } else {
                console.log('error: -200');
            }

        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
    var init = function () {
        $.ajax({
            url: ApiUrl + "plat_template",
            type: 'get',
            dataType: 'JSON',
            success: function(result) {
                if(result.code === 200) {
                    var defaults = template = '';
                    $.each(result.data, function(key, val) {
                        defaults += '<div style="width: 200px; float: left; text-align: center; margin-right: 20px; line-height: 40px;">' +
                            '<img width="200" src="/resource/wetpl/' + val.mark + '/' + val.cover + '"></br>' +
                            '<input type="radio" name="templateId" value=' + val.id + '>' + val.title +
                            '<span style="padding-left: 15px;">预览</span></div>';
                        template += '<option name="options" value=' + val.id + '>' + val.title + '</option>';
                    });
                    $("#default").html(defaults);
                    $("#module_list").html(template);
                    $("#custom_file").val(window.location.host);
                    $("#custom_name").val('自定义模板');
                    $.ajax({
                        url: ApiUrl + 'plat_setting',
                        type: 'get',
                        dataType: 'json',
                        success: function (data) {
                            if (data.code === 200) {
                                if (data.data.is_custom != 1) {
                                    $("#templateId").find("input[name=templateId][value=" + data.data.template_id + "]").attr("checked", true);
                                }
                                if (data.data.is_custom == null) {
                                    $(".but").animate({left: -40},0);
                                    $(".hidde").slideDown();
                                    $(".module").removeClass("block");
                                    $(".module_li").addClass("block");
                                }
                            } else {
                                console.log('error: -200');
                            }

                        },
                        error: function (xhr) {
                            console.log(xhr);
                        }
                    });
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
            data: {template_id: templateId, is_custom: 2},
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
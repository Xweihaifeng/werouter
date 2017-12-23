$(document).ready(function () {
    start();
    var init = function () {
        $.ajax({
            url: ApiUrl + "plat_template",
            type: 'get',
            dataType: 'JSON',
            success: function(result) {
                if(result.code === 200) {
                    var opt = '';
                    $.each(result.data, function(key, val) {
                        opt += '<option name="options" value=' + val.id + '>' + val.title + '</option>';
                    });

                    $("#templateId").html(opt);
                    $.ajax({
                        url: ApiUrl + 'plat_setting',
                        type: 'get',
                        dataType: 'json',
                        success: function (data) {
                            if (data.code === 200) {
                                $('#domain').val(data.data.domain);
                                $('#plat_name').val(data.data.plat_name);
                                $("input[name=http_type][value=" + data.data.http_type +  "]").attr('checked', true);
                                $("input[name=wap_domain][value=" + data.data.wap_domain +  "]").attr('checked', true);
                                $("#templateId").find("option[value=" + data.data.template_id + "]").attr("selected", true);
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
        var plat_name = $('#plat_name').val();
        var http_type = $("input[name='http_type']:checked").val();
        var wap_domain = $("input[name='wap_domain']:checked").val();
        var templateId = $("#templateId").find("option:selected").val();
        $.ajax({
            url: ApiUrl + 'plat_setting',
            type: 'post',
            dataType: 'json',
            data: {plat_name: plat_name, http_type: http_type, wap_domain:wap_domain, template_id: templateId},
            success: function (data) {
                if (data.code === 200) {
                    swal('提示', '保存成功', 'success');
                } else {
                    swal('提示', data.message, 'error');
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });
});
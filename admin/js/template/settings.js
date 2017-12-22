$(document).ready(function () {
    start();
    var init = function () {
        $.ajax({
            url: ApiUrl + 'plat_setting',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (data.code === 200) {
                    $('#platId').val(data.data.weid);
                    $('#domain').val(data.data.domain);
                    $('#plat_name').val(data.data.plat_name);
                    $("input[name=http_type][value=" + data.data.http_type +  "]").attr('checked', true);
                    $("input[name=wap_domain][value=" + data.data.wap_domain +  "]").attr('checked', true);
                } else {
                    console.log('error: -200');
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    };
    init();

    // Save
    $("#updateSet").click(function () {
        var plat_name = $('#plat_name').val();
        var http_type = $("input[name='http_type']:checked").val();
        var wap_domain = $("input[name='wap_domain']:checked").val();
        $.ajax({
            url: ApiUrl + 'plat_setting',
            type: 'post',
            dataType: 'json',
            data: {plat_name: plat_name, http_type: http_type, wap_domain:wap_domain},
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
$(document).ready(function() {
    start();
    var init = function() {
        $.ajax({
            url: ApiUrl + 'plat_setting',
            type: 'get',
            dataType: 'json',
            success: function(data) {
                if (data.code === 200) {
                    $('#platId').val(data.data.weid);
                    $('#domain').val(data.data.domain);
                    $('#plat_name').val(data.data.plat_name);
                } else {
                    console.log('error: -200');
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        });
    };
    init();

    // Save
    $("#updateSet").click(function() {
        var plat_name = $('#plat_name').val();
        $.ajax({
            url: ApiUrl + 'plat_setting',
            type: 'post',
            dataType: 'json',
            data: { plat_name: plat_name },
            success: function(data) {
                if (data.code === 200) {
                    swal('提示', '保存成功', 'success');
                } else {
                    swal('提示', data.message, 'error');
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        });
    });
});
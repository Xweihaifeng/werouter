$(document).ready(function () {
    $(document).on('click', '.set-status', function () {
        var title = $(this).data('title');
        var status = $(this).data('status');
        $.ajax({
            url: ApiUrl + 'plats/pages/setting_status',
            type: 'post',
            data: {title: title, status: status},
            dataType: 'json',
            success: function (data) {
                if (data.code === 200){
                    swal({text: '操作成功',type: 'success', timer: 20000});
                    location.reload();
                }
            }
        });
    });
});
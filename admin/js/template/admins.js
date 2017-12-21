$(document).ready(function() {
    start();
    var init = function() {
        $('#adminsTable').DataTable({
            "ajax": {
                url: ApiUrl + "admins",
                type: "get",
                data: {},
                "dataSrc": function(json) {
                    for (var i = 0, ien = json.data.list.length; i < ien; i++) {
                        var _init = json.data.list[i].init;
                        switch (json.data.list[i].status) {
                            case 1:
                                status = '正常';
                                break;
                            case 2:
                                status = '锁定';
                                break;
                            case 3:
                                status = '禁用';
                                break;
                        }
                        json.data.list[i].id = i + 1;
                        json.data.list[i].status = status;
                        json.data.list[i].operation = '<a href="admin_edit.html?weid=' + json.data.list[i].weid + '" class="btn btn-info" style="margin-right:10px;">编辑</a><a title = "删除" class="btn btn-danger" data-toggle="modal" data-target="#myModal" data-id="' + json.data.list[i].weid + '" data-name="' + json.data.list[i].name + '"  href="#">删除</a>'
                    }
                    return json.data.list;

                }
            },
            "columns": [
                { "data": "id" },
                { "data": "username" },
                { "data": "real_name" },
                { "data": "phone" },
                { "data": "created_at" },
                { "data": "status" },
                { "data": "memo" },
                { "data": "operation" },
            ],
            "aoColumnDefs": [
                { "bSortable": false, "aTargets": [1, 2, 3, 5, 6, 7] }, //can't be sorted
                { "bSearchable": false, "aTargets": [2, 6, 7] }, //can't be searched
            ],
            "aaSorting": [
                [0, "ASC"]
            ],
            "oLanguage": {
                "sLengthMenu": "显示 _MENU_ 记录",
                                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sLoadingRecords": "正在加载数据-请等待...",
                                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
                "sSearch": "搜索:",
                "oPaginate": {                        "sFirst": "首页",                         "sPrevious": " 上一页 ",                         "sNext": " 下一页 ",                         "sLast": " 尾页 "                    }
            },
            initComplete: function() {
                $('[data-toggle="popover"]').popover();
            }
        });
    };

    init();

    $('#confirm').click(function() {
        var dataId = $(this).attr('data-id');
        $.ajax({
            url: ApiUrl + "admins/" + dataId,
            type: 'DELETE',
            dataType: 'JSON',
            success: function(result) {
                if (result.code === 200) {
                    showTips('删除成功！', 2, 'alert-info');
                    location.reload();
                    console.log('ok');
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            }
        });
    });
});
$(document).ready(function() {
    start();
    var init = function() {
        // $.ajax({
        //     url: ApiUrl + "admins",
        //     type: 'get',
        //     dataType: 'JSON',
        //     success: function(result) {
        //         if (result.code === 200) {
        //             var html = '',
        //                 num = '',
        //                 status = '';
        //             $.each(result.data.list, function(key, val) {
        //                 num++;
        //                 switch (val.status) {
        //                     case 1:
        //                         status = '正常';
        //                         break;
        //                     case 2:
        //                         status = '锁定';
        //                     case 3:
        //                         status = '禁用';
        //                 };
        //                 html += '<tr>' +
        //                     '<td>' + num + '</td>' +
        //                     '<td><a title="" data-toggle="modal" data-target="#myModal" data-id="' + val.weid + '" data-name="' + val.username + '" href="#">' + val.username + '</a></td>' +
        //                     '<td>' + val.real_name + '</td>' +
        //                     '<td>' + val.phone + '</td>' +
        //                     '<td>' + val.created_at + '</td>' +
        //                     '<td>' + status + '</td>' +
        //                     '<td>' + val.memo + '</td>' +
        //                     '<td class="text-center"><a title = "编辑" class="btn btn-info" href="admin_edit.html?weid=' + val.weid + '">编辑</a></td></tr>';
        //             });
        //             $("#adminsTable").html(html);
        //         } else {
        //             parent.layer.msg(result.message);

        //             return false;
        //         }
        //     }
        // });
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
                        json.data.list[i].operation = '<a href="admin_edit.html?weid=' + json.data.list[i].weid + '" class="btn btn-info">编辑</a>'
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
});
$(document).ready(function () {
    start();
    $("#vote_cate_add_url").attr("href", "vote_cate_edit.html");
    $('#voteListTable').DataTable({
        "ordering": false,
        "ajax": {
            url: ApiUrl + "plats/article/category",
            type: "GET",
            "dataSrc": function (json) {
                for (var i = 0, ien = json.data.list.length; i < ien; i++) {
                    json.data.list[i].id = i + 1;
                    //操作   
                    json.data.list[i].operation = '<a href="goods_category_add.html?weid=' + json.data.list[i].weid + '" class="btn btn-info pull-left">编辑</a>' +
                        '<button class="btn btn-danger btn-delete" style="float: left;margin-left:3px;" data-id="' + json.data.list[i].weid + '" ' +
                        'data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="确定要删除？" ' +
                        'data-content="<button class=' + "'btn btn-danger btn-delete-confirm'" + '  data-id=' + "'" + json.data.list[i].weid + "'" + '>确认</button>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class=' + "'btn btn-default'" + '>取消</button>" >删除</button>';
                }

                return json.data.list;
            }
        },
        "columns": [
            {"data": "id"},
            {"data": "name"},
            {"data": "sort"},
            {"data": "operation"}
        ],
        "oLanguage": {
            "sLengthMenu": "显示 _MENU_ 记录",
            "sZeroRecords": "对不起，查询不到任何相关数据",
            "sLoadingRecords": "正在加载数据-请等待...",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
            "sSearch": "搜索:",
            "oPaginate": {"sFirst": "首页", "sPrevious": " 上一页 ", "sNext": " 下一页 ", "sLast": " 尾页 "}
        },
        initComplete: function () {
            $('[data-toggle="popover"]').popover();
            $('#voteListTable_length').remove();

        }
    })

    $(document).on('click', '.btn-delete-confirm', function () {
        var weid = $(this).data('id');
        if (isNull(weid) == false) {
            $.ajax({
                url: ApiUrl + 'plats/article/category_detail',
                type: 'POST',
                data: {
                    weid: weid
                },
                success: function (data) {
                    if (data.code == 200) {
                        location.href = 'article_category.html';
                    } else {
                        swal('提示', data.message, 'error');
                    }
                }
            })
        } else {
            swal({
                title: "参数为空!",
                timer: 2000,
                showConfirmButton: false
            });
        }
    });
})
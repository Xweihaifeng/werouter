$(document).ready(function() {
    start();
    $("#vote_cate_add_url").attr("href", "vote_cate_edit.html");
    $('#voteListTable').DataTable({
        "ordering": false,
        "ajax": {
            url: ApiUrl + "vote/cate_list",
            type: "GET",
            "dataSrc": function(json) {
                console.log(json.data);
                for (var i = 0, ien = json.data.length; i < ien; i++) {
                    json.data[i].id = i + 1;
                    //操作   
                    json.data[i].operation = '<a href="vote_cate_edit.html?weid=' + json.data[i].weid + '" class="btn btn-info pull-left">编辑</a><button class="btn btn-danger btn-delete" style="float: left;margin-left:3px;"   data-id="' + json.data[i].weid + '" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="确定要删除？" data-content="<button class=' + "'btn btn-danger btn-delete-confirm'" + '  data-id=' + "'" + json.data[i].weid + "'" + '>确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class=' + "'btn btn-default'" + '>取消</button>" >删除</button>';
                }
                return json.data;
            }
        },
        "columns": [
            { "data": "id" },
            { "data": "title" },
            { "data": "created_at" },
            { "data": "operation" },
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
            $('#voteListTable_length').remove();

        }
    })

    $(document).on('click', '.btn-delete-confirm', function() {
        var weid = $(this).data('id');
        if (isNull(weid) == false) {
            $.ajax({
                url: ApiUrl + 'vote/cate_destroy/' + weid,
                type: 'GET',
                success: function(data) {
                    if (data.code == 200) {
                        location.href = 'voteCategory.html';
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
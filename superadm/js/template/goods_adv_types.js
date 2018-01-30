var initAdvList = function (data) {
    var params = null;
    $('#advListTable').DataTable({
        "ajax": {
            url: ApiUrl + "plats/goods/adv_type",
            type: "GET",
            data: data,
            "dataSrc": function (json) {
                for (var i = 0, ien = json.data.list.length; i < ien; i++) {
                    json.data.list[i].id = i + 1;
                    json.data.list[i].type = json.data.list[i].type == 1 ? '<span class="label label-success">系统</span>' : '<span class="label label-success">分类</span>';
                    json.data.list[i].operation = "<a href=goods_adv_type_add.html?weid=" + json.data.list[i].weid + " class=\"btn btn-info\">编辑</a>";
                }
                params = json.data.params;
                return json.data.list;

            }
        },
        "columns": [
            {"data": "id"},
            {"data": "title"},
            {"data": "type"},
            {"data": "description"},
            {"data": "operation"},
        ],
        "destroy": true,//允许表格重新加载
        //"paging": false,
        "oLanguage": {
            "sLengthMenu": "显示 _MENU_ 记录",
            "sZeroRecords": "对不起，查询不到任何相关数据",
            "sLoadingRecords": "正在加载数据-请等待...",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
            "sSearch": "搜索:",
            '_TOTAL_': 100,
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": " 上一页 ",
                "sNext": " 下一页 ",
                "sLast": " 尾页 "
            }
        },
        initComplete: function () {
            //分页初始化
            $('.pagination').children("li").remove();
            myPagination(params);
            $('[data-toggle="popover"]').popover();
        }
    })
    //隐藏显示记录
    $('.dataTables_length').hide();
};
//分页重写total总条数 pageNumber每页条数 pageCount总页数 currPage当前页数
var myPagination = function (params) {
    var pageHtml = '';
    //首页
    if (parseInt(params.currPage) == 1) {
        pageHtml = pageHtml + '<li class=\"paginate_button previous disabled\" id=\"advListTable_previous\"><a href=\"#\"  data-dt-idx="' + (parseInt(params.currPage) - 1) + '" tabindex=\"0\"> 上一页 </a></li>';
    } else {
        pageHtml = pageHtml + '<li class=\"paginate_button previous\" id=\"advListTable_previous\"><a href=\"#\"  data-dt-idx="' + (parseInt(params.currPage) - 1) + '" tabindex=\"0\"> 上一页 </a></li>';
    }

    for (var i = 0, ien = parseInt(params.pageCount); i < ien; i++) {
        //当前页
        if (parseInt(params.currPage) == (i + 1)) {
            pageHtml = pageHtml + '<li class=\"paginate_button active\"><a href=\"#\"  data-dt-idx="' + (i + 1) + '" tabindex=\"0\">' + (i + 1) + '</a></li>';
        } else {
            pageHtml = pageHtml + '<li class=\"paginate_button\"><a href=\"#\"  data-dt-idx="' + (i + 1) + '" tabindex=\"0\">' + (i + 1) + '</a></li>';
        }
    }

    //尾页
    if (parseInt(params.currPage) == parseInt(params.pageCount)) {
        pageHtml = pageHtml + '<li class=\"paginate_button next disabled\" id=\"advListTable_next\"><a href=\"#\"  data-dt-idx="' + (parseInt(params.currPage) + 1) + '" tabindex=\"0\"> 下一页 </a></li>';
    } else {
        pageHtml = pageHtml + '<li class=\"paginate_button next\" id=\"advListTable_next\"><a href=\"#\"  data-dt-idx="' + (parseInt(params.currPage) + 1) + '" tabindex=\"0\"> 下一页 </a></li>';
    }
    $('.dataTables_info').html("当前显示 1 到 " + ($('table tr').length - 1) + " 条，共 " + params.total + " 条记录。");
    $('.pagination').append(pageHtml);
    //分页点击事件
    $('.pagination a').each(function (i) {
        $(this).click(function () {
            var page = $(this).attr('data-dt-idx');
            var data = {
                page: page,
                limit: 10,
            };
            initAdvList(data);
        })
    });
}
$(document).ready(function () {
    start();
    initAdvList(null);
    $(document).on('click', '.btn-delete-confirm', function () {
        $.ajax({
            url: ApiUrl + 'plats/goods/adv_type_del',
            type: 'post',
            data: {weid: $(this).data('id')},
            dataType: 'json',
            success: function (data) {
                if (data.code === 200) {
                    var type_id = $("#type-select").val();
                    var data = {
                        type_id: type_id,
                    };
                    initAdvList(data);
                } else {
                    console.log('error: -200');
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });
})
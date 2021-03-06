var cloneObj = function (obj) {
    var newObj = {};
    if (obj instanceof Array) {
        newObj = [];
    }
    for (var key in obj) {
        var val = obj[key];
        newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
    }
    return newObj;
};
var getLocalTime = function (nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
//获取参数
var getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
var keywords = '';
var systemId = '';
$.ajax({
    url: ApiUrl + "plats/goods/category",
    type: 'get',
    dataType: 'JSON',
    success: function (result) {
        if (result.code === 200) {
            var html = '<option name="options" value="" selected>--请选择--</option>';
            $.each(result.data.list, function (key, val) {
                html += '<option name="options" value=' + val.weid + '>' + val.name + '</option>';
            });
            $("#systemId").html(html);
        } else {
            parent.layer.msg(result.message);

            return false;
        }
    }
});

var initAdvList = function (data) {
    var params = null;
    $('#listTable').DataTable({
        "ajax": {
            url: ApiUrl + "plats/goods/goods_list",
            type: "GET",
            data:data,
            "dataSrc": function (json) {
                var list = cloneObj(json.data.list);
                for (var i = 0, ien = json.data.list.length; i < ien; i++) {
                    list[i].id = i + 1;
                    list[i].title = `<a title="` + json.data.list[i].title + `" href="/` + json.data.list[i].domain + `/wemall/goods/` + json.data.list[i].weid + `" target="_blank">` + shorten_str(json.data.list[i].title, 15) + `</a>`;
                    list[i].cover = json.data.list[i].cover ? json.data.list[i].cover.indexOf('http') !== 0 ? '<img class="thumb-image" data-action="zoom" src="' + ApiMaterPlatQiniuDomain + json.data.list[i].cover + '" width="40">' : '<img class="thumb-image" data-action="zoom" src="' + json.data.list[i].cover + '" width="40">' : '';
                    list[i].recommend = json.data.list[i].status == 3 ? '<span class="label label-default">删除</span>' : (json.data.list[i].recommend == 1 ? '<span class="label label-success">推荐</span>' : '常规');
                    list[i].created_at = getLocalTime(json.data.list[i].created_at);
                    list[i].system_name = json.data.list[i].system_name ? json.data.list[i].system_name : '无系统分类';
                    list[i].operation = `<div class="btn-group" role="group"><div class="btn-group">
                    <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> 设置 <span class="caret"></span></button>
                    <ul class="dropdown-menu">`
                        + (json.data.list[i].recommend != 1 ? `<li><a href="#" class="set-status" data-type="1" data-id="` + json.data.list[i].weid + `" >推荐</a></li>` : ``)
                        + (json.data.list[i].recommend != 2 ? `<li><a href="#" class="set-status" data-type="2" data-id="` + json.data.list[i].weid + `" >取消推荐</a></li>` : ``)
                        + `</ul></div></div>`;
                    if (json.data.list[i].status != 3) {
                        list[i].operation += '<button class="btn btn-danger pull-right btn-delete"  data-id="' + json.data.list[i].weid + '" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="确定要删除？" data-content="<button class=' + "'btn btn-danger btn-delete-confirm set-del'" + '  data-id=' + "'" + json.data.list[i].weid + "'" + '>确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class=' + "'btn btn-default'" + '>取消</button>" >删除</button>';
                    }
                }
                params = json.data.params;

                return list;
            }
        },
        "columns": [
            {"data": "id"},
            {"data": "title"},
            {"data": "cover"},
            {"data": "cate_name"},
            {"data": "system_name"},
            {"data": "stock"},
            {"data": "views"},
            {"data": "created_at"},
            {"data": "recommend"},
            {"data": "operation"}
        ],
        "destroy": true,
        "searching": false,
        "oLanguage": {
            "sLengthMenu": "显示 _MENU_ 记录",
            "sZeroRecords": "对不起，查询不到任何相关数据",
            "sLoadingRecords": "正在加载数据-请等待...",
            "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
            "sSearch": "搜索:",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": " 上一页 ",
                "sNext": " 下一页 ",
                "sLast": " 尾页 "
            }
        },
        initComplete: function () {
            $('.pagination').children("li").remove();
            myPagination(params);
            $('[data-toggle="popover"]').popover();
        }
    });
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
                keywords: $('#keywords').val(),
                systemId: $('#systemId').val(),
                page: page,
                limit: 10,
            };
            initAdvList(data);
        })
    });
}

$(document).ready(function () {
    // 选择
    $('#systemId').change(function () {
        var systemId = $(this).children('option:selected').val();
        var data = {
            keywords: keywords,
            systemId: systemId
        };
        initAdvList(data);
    });
    // 默认
    var data = {
        keywords: keywords,
        systemId: systemId
    };
    initAdvList(data);
    // 推荐
    $(document).on('click', '.set-status', function () {
        var id = $(this).data('id');
        var type = $(this).data('type');
        $.ajax({
            url: ApiUrl + 'plats/goods/goods_recommend',
            type: 'post',
            data: {weid: id, recommend: type},
            dataType: 'json',
            success: function (result) {
                if (result.code === 200) {
                    swal({
                        text: '设置成功！',
                        type: 'success'
                    });
                } else {
                    swal({
                        text: result.message,
                        type: 'error'
                    });

                    return false;
                }
            }
        });
    });
    // 删除
    $(document).on('click', '.set-del', function () {
        var id = $(this).data('id');
        $.ajax({
            url: ApiUrl + 'plats/goods/goods_del',
            type: 'post',
            data: {weid: id},
            dataType: 'json',
            success: function (data) {
                swal({
                    text: '删除成功！',
                    type: 'success'
                });
                location.reload();
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });
    // 搜索
    $(document).on('click', '.search', function () {
        var data = {
            keywords: $('#keywords').val(),
            systemId: $('#systemId').val()
        };

        initAdvList(data);
    });
})

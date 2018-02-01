 var cloneObj = function (obj) {
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            newObj[key] = typeof val === 'object' ? cloneObj(val): val;
        }
        return newObj;
    };
    Date.prototype.format = function(format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }

    var initAdvList = function(data){
        var params=null;
        $('#listTable').DataTable({
            "ajax": {
                url:ApiUrl+"users",
                type:"GET",
                data:data,
                "dataSrc": function ( json ) {
                    var list = cloneObj(json.data.list);
                    for ( var i=0, ien=json.data.list.length ; i<ien ; i++ ) {
                        list[i].id = i + 1;
                         if(json.data.list[i].avatar!=null && json.data.list[i].avatar!=''){
                           json.data.list[i].avatar=json.data.list[i].avatar.indexOf('http') === 0 ? json.data.list[i].avatar : ApiMaterPlatQiniuDomain + json.data.list[i].avatar;
                            list[i].avatar = `<img src="` + json.data.list[i].avatar + `" data-action="zoom" width="60">`;
                        }else{
                            list[i].avatar ='';
                        }
                        if(json.data.list[i].real_name==null || json.data.list[i].real_name==''){
                            list[i].real_name ='';
                        }
                        list[i].status= json.data.list[i].status == 1 ? '<span class="label label-success">正常</span>' : '<span class="label label-danger">拉黑</span>';
                        list[i].created_at = new Date(json.data.list[i].created_at).format('yyyy-MM-dd h:m:s');
                        //  list[i].operation=`<div class="btn-group" role="group"><a href="content_edit.html?id=`+json.data.list[i].weid + `" class="btn btn-primary">编辑</a>` + `<div class="btn-group">
                        // <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        //     设置 <span class="caret"></span>
                        //     </button>
                        //     <ul class="dropdown-menu">`
                        //     + (json.data.list[i].status != 1 ? `<li><a href="#" class="set-status" data-type="1" data-id="` + json.data.list[i].weid + `" >启用</a></li>` : ``)
                        //     + (json.data.list[i].status != 2 ? `<li><a href="#" class="set-status" data-type="2" data-id="` + json.data.list[i].weid + `" >拉黑</a></li>` : ``)
                        // + `</ul>
                        // </div></div>`;
                        list[i].operation=`<div class="btn-group" role="group"><div class="btn-group">
                        <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            设置 <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">`
                            + (json.data.list[i].status != 1 ? `<li><a href="#" class="set-status" data-type="1" data-id="` + json.data.list[i].weid + `" >启用</a></li>` : ``)
                            + (json.data.list[i].status != 2 ? `<li><a href="#" class="set-status" data-type="2" data-id="` + json.data.list[i].weid + `" >拉黑</a></li>` : ``)
                        + `</ul>
                        </div></div>`;
                    }
                    params=json.data.params;
                    return list;
                }
            },
            "columns": [
                {"data": "id"},
                {"data": "avatar"},
                {"data": "real_name"},
                {"data": "phone"},
                {"data": "status"},
                {"data": "created_at"},
                {"data": "operation"},
            ],
            // "aoColumnDefs": [
            //     {"bSortable": false, "aTargets": [1,2,3,4,5,8]},    //can't be sorted
            //     {"bSearchable": false, "aTargets": [8]}, //can't be searched
            // ],
            "aaSorting": [[0, "asc"]],
            "destroy":true,
            "oLanguage":{
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
            initComplete:function(){
                //分页初始化
                $('.pagination').children("li").remove();
                myPagination(params);
                $('[data-toggle="popover"]').popover();
            }
        });
        $('.dataTables_length').hide();
    };
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
        $('.dataTables_info').html("当前显示 1 到 " + ($('#listTable tr').length - 1) + " 条，共 " + params.total + " 条记录。");
        $('.pagination').append(pageHtml);
        //分页点击事件
        $('.pagination a').each(function (i) {
            $(this).click(function () {
                if($(this).attr('data-dt-idx')>0 && $(this).attr('data-dt-idx')<=params.pageCount){
                var page        = $(this).attr('data-dt-idx');
                var real_name   = $('input[name=real_name]').val();
                var phone       = $('input[name=phone]').val();

                var data = {
                    real_name   : real_name,
                    phone       : phone,
                    page        : page,
                    limit       : 10,
                };
                initAdvList(data);
             }
            })
        });
    }


    var __init = function () {
        var real_name = $('input[name=real_name]').val();
        var phone = $('input[name=phone]').val();

        var data = {
            real_name   : real_name,
            phone       : phone
        };
        initAdvList(data);
    }

    $(document).ready(function(){
        __init();
    });
    $(document).on('change', 'input[name=real_name],input[name=phone]', function(){
        var real_name       = $("input[name=real_name]").val();
        var phone           = $("input[name=phone]").val();
        var data = {
            real_name   : real_name,
            phone       : phone
        };
        initAdvList(data);
    });

    $(document).on('click', '.set-status', function(){
        var id = $(this).data('id');
        var type = $(this).data('type');
        $.ajax({
            url: ApiUrl + 'users/updateStatus/' + id,
            type: 'post',
            data:{status : type},
            dataType: 'json',
            success: function(data){
                swal({
                    text: '设置成功！',
                    type: 'success',
                    timer:20000
                }).then(
                    function () {
                        location.reload();
                    },
                    // handling the promise rejection
                    function (dismiss) {
                        if (dismiss === 'timer') {
                            location.reload();
                        }
                    }
                )
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    });

    $('#bootstrapModal').on('hidden.bs.modal', function (e) {

    });
    $('#bootstrapModal').on('show.bs.modal', function (e) {

    });
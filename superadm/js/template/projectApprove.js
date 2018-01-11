    var initAdvList = function(data){
        var params=null;
        $('#listTable').DataTable({
            "ajax": {
                url:ApiUrl+"project/finance/list",
                type:"POST",
                data:data,
                "dataSrc": function ( json ) {
                    console.log(json.data.list);
                    for ( var i=0, ien=json.data.list.length ; i<ien ; i++ ){
                        //标题
                        json.data.list[i].id='1';
                        if(isNull(json.data.list[i].plat_user_id)==false){
                            var avatar=ApiMaterPlatQiniuDomain+json.data.list[i].avatar;        
                            var name=json.data.list[i].nickname;        
                            json.data.list[i].user='<div style="text-align: center;"><img src="'+avatar+'" data-action="zoom" width="50" height="50"><span style="display: block;">'+name+'</span><div>';
                        
                        }
                        //判断是否分期
                        if(json.data.list[i].is_stages==2){
                            //分期
                            json.data.list[i].is_stages='是';
                            //判断俩个审核是否通过    
                            if(json.data.list[i].is_one_grant==1){
                                //一期未审核
                                json.data.list[i].one_grant='<button class="btn btn-danger center-block"  data-id="' + json.data.list[i].weid + '" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="点击通过？" data-content="<button class='  + "'btn btn-danger btn-delete-confirm'" + '  data-id='  + "'" + json.data.list[i].weid + "' data-num='1'" + '>确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='  + "'btn btn-default'" + '>取消</button>" >未通过</button>'; 
                                //json.data.list[i].one_grant="点击通过";
                            }else{
                                //一期已经审核    
                                json.data.list[i].one_grant=`<button class="btn btn-primary" data-toggle="modal" data-approve_contact="`+json.data.list[i].one_admin.phone+`" data-approve_people_id="`+json.data.list[i].one_admin.weid+`" data-approve_date="`+json.data.list[i].one_review_date+`" data-approve_people_username="`+json.data.list[i].one_admin.username+`" data-approve_people_avatar="`+ApiMaterPlatQiniuDomain+json.data.list[i].one_admin.avatar+`" onclick="ApproveInfo(this)"  >详情</button>`;
                            }
                            if(json.data.list[i].is_two_grant==1){
                                //二期未审核
                                json.data.list[i].two_grant='<button class="btn btn-danger center-block"  data-id="' + json.data.list[i].weid + '" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="点击通过？" data-content="<button class='  + "'btn btn-danger btn-delete-confirm'" + '  data-id='  + "'" + json.data.list[i].weid + "' data-num='2'" + '>确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='  + "'btn btn-default'" + '>取消</button>" >未通过</button>'; 
                                //json.data.list[i].two_grant="点击通过";
                            }else{
                                //二期已经审核    
                                json.data.list[i].two_grant=`<button class="btn btn-primary" data-toggle="modal" data-approve_contact="`+json.data.list[i].two_admin.phone+`" data-approve_people_id="`+json.data.list[i].two_admin.weid+`" data-approve_date="`+json.data.list[i].two_review_date+`" data-approve_people_username="`+json.data.list[i].two_admin.username+`" data-approve_people_avatar="`+ApiMaterPlatQiniuDomain+json.data.list[i].two_admin.avatar+`" onclick="ApproveInfo(this)"  >详情</button>`;    
                            }    
                        }else{
                            json.data.list[i].is_stages='否';
                            //判断一个 
                            if(json.data.list[i].is_one_grant==1){
                                //一期未审核
                                json.data.list[i].one_grant='<button class="btn btn-danger center-block"  data-id="' + json.data.list[i].weid + '" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="点击通过？" data-content="<button class='  + "'btn btn-danger btn-delete-confirm'" + '  data-id='  + "'" + json.data.list[i].weid + "' data-num='1'" + '>确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='  + "'btn btn-default'" + '>取消</button>" >未通过</button>'; 
                                //json.data.list[i].one_grant="点击通过";
                            }else{
                                //一期已经审核    
                                json.data.list[i].one_grant=`<button class="btn btn-primary" data-toggle="modal" data-approve_contact="`+json.data.list[i].one_admin.phone+`" data-approve_people_id="`+json.data.list[i].one_admin.weid+`" data-approve_date="`+json.data.list[i].one_review_date+`" data-approve_people_username="`+json.data.list[i].one_admin.username+`" data-approve_people_avatar="`+ApiMaterPlatQiniuDomain+json.data.list[i].one_admin.avatar+`" onclick="ApproveInfo(this)"  >详情</button>`;
                            }
                        }
                    }
                    params=json.data.params;
                    return json.data.list;     
                }
            },
            "columns": [
                {"data": "id"},
                {"data": "user"},
                {"data": "title"},
                {"data": "amount"},
                {"data": "raise_amount"},
                {"data": "is_stages"},
                {"data": "one_finance"},
                {"data": "one_grant"},
                {"data": "two_finance"},
                {"data": "two_grant"},
                {"data": "created_at"},
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
                $("#example").popover();
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
                var page        = $(this).attr('data-dt-idx');
                var name       = $("input[name=name]").val();
                var stages           = $("select[name=stages]").val();
                var one_grant       = $("select[name=one_grant]").val();
                var two_grant           = $("select[name=two_grant]").val();
                var data = {
                    name : name,
                    stages: stages,
                    one_grant:one_grant,
                    two_grant:two_grant,
                    page:page,
                    limit:10,
                };
                initAdvList(data);
            })
        });
    }
        

    var __init = function () {
        var data = {
            page:1,
            limit:10
        };
        initAdvList(data);
    }

    $(document).ready(function(){
        start();
        __init();
        //清除数据    
        $('#myModal').on('hide.bs.modal', function () {
            $("#approve_people").empty();
            $("#approve_date").empty();
            $("#approve_people_id").empty();
            $("#approve_contact").empty();        
        })

    });

    
    $(document).on('change', 'input[name=name],select[name=stages],select[name=one_grant],select[name=two_grant]', function(){
        var name       = $("input[name=name]").val();
        var stages           = $("select[name=stages]").val();
        var one_grant       = $("select[name=one_grant]").val();
        var two_grant           = $("select[name=two_grant]").val();
        var data = {
            name : name,
            stages: stages,
            one_grant:one_grant,
            two_grant:two_grant,
            page:1,
            limit:10,
        };
        initAdvList(data);
        
    });
    


    
    $('#bootstrapModal').on('hidden.bs.modal', function (e) {

    });
    $('#bootstrapModal').on('show.bs.modal', function (e) {

    });

$(document).on('click', '.btn-delete-confirm', function(){
    var weid=$(this).data('id');
    var num=$(this).data('num');
    if(isNull(weid)==false&&isNull(num)==false){
        var data={finance_id:weid,stages_num:num};
        $.ajax({
            url: ApiUrl+'project/finance/pass',
            type:'POST',
            data:data,    
            success:function (data){
                if(data.code==200){
                    swal({
                        title: "审核成功!",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    var name       = $("input[name=name]").val();
                    var stages           = $("select[name=stages]").val();
                    var one_grant       = $("select[name=one_grant]").val();
                    var two_grant           = $("select[name=two_grant]").val();
                    var paramsdata = {
                        name : name,
                        stages: stages,
                        one_grant:one_grant,
                        two_grant:two_grant,
                        page:1,
                        limit:10,
                    };

                    initAdvList(paramsdata);
                }else{
                    swal({
                        title: data.message,
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            }  
        })
    }else{
        swal({
            title: "参数有误!",
            timer: 2000,
            showConfirmButton: false
        });    
    }
});

function ApproveInfo(obj){
    $('#myModal').modal('show');
    $("#approve_people").append(`<img src="`+$(obj).attr("data-approve_people_avatar")+`" data-action="zoom" width="50" height="50"><span style="display: block;">`+$(obj).attr("data-approve_people_username")+`</span>`);
    $("#approve_date").append($(obj).attr("data-approve_date"));
    $("#approve_people_id").append($(obj).attr("data-approve_people_id"));
    $("#approve_contact").append($(obj).attr("data-approve_contact"));  
}



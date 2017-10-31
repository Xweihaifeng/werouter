$(document).ready(function(){
    start();
        var vote_id=getUrlParam('vote_id');
        if(isNull(vote_id)==false){
            //添加按钮设置
            $("#vote_item_add_url").attr("href","vote_item_edit.html?vote_id="+vote_id+"");
        }
        var data={vote_id:vote_id};
        var datatable=$('#voteListTable').DataTable({
            "ordering": false,
            "ajax": {
                url:ApiUrl+"vote/item_list",
                type:"POST",
                data:data,
                "dataSrc": function ( json ) {
                    // console.log(json.data.list);
                    for ( var i=0, ien=json.data.list.length ; i<ien ; i++ ){
                        json.data.list[i].sort = i + 1;
                        json.data.list[i].title=json.data.list[i].title + '<span  class="pull-right">&nbsp;&nbsp;&nbsp;<a title="访问PC端" href="http://'+ window.location.host + `/vote/show/` + json.data.list[i].weid+'" target="_blank"><i class="fa fa-desktop"></i></a> &nbsp;<a title="访问微信端"><i class="fa fa-weixin wechat-qrcode" data-id="' + json.data.list[i].weid + '"></i></span>';
                        //状态
                        if(json.data.list[i].status==1){
                            json.data.list[i].status='<i class="iconfont icon-dui" onclick="changeItemStatu(this)" value="'+json.data.list[i].weid+'" ></i>';
                            
                        }
                        if(json.data.list[i].status==2){
                            json.data.list[i].status='<i class="iconfont icon-gang" onclick="changeItemStatu(this)" value="'+json.data.list[i].weid+'"></i>';
                        }
                        //操作   
                        json.data.list[i].operation='<a href="vote_item_edit.html?weid='+json.data.list[i].weid+'" class="btn btn-info pull-left">编辑</a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button class="btn btn-danger btn-delete" style="float: left;margin-left:3px;"  data-id="' + json.data.list[i].weid + '" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="确定要删除？" data-content="<button class='  + "'btn btn-danger btn-delete-confirm'" + '  data-id='  + "'" + json.data.list[i].weid + "'" + '>确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='  + "'btn btn-default'" + '>取消</button>" >删除</button>';
                    }    
                    params=json.data.params;
                    return json.data.list;

                    }
                },
            "columns": [
                {"data": "sort"},
                {"data": "title"},
                {"data": "status"},
                {"data": "nums"},
                {"data": "views"},
                {"data": "operation"},
            ],
            "oLanguage":{
                "sLengthMenu": "显示 _MENU_ 记录",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sLoadingRecords": "正在加载数据-请等待...",
                "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。",
                "sSearch": "搜索:",
                '_TOTAL_':100,
                "oPaginate": {
                       "sFirst": "首页",
                       "sPrevious": " 上一页 ",
                       "sNext": " 下一页 ",
                       "sLast": " 尾页 "
                   }
            },
            initComplete:function(settings, json){
                $('[data-toggle="popover"]').popover();
                $('#voteListTable_length').remove();
            }
        })  
    $(document).on('click', '.btn-delete-confirm', function(){
        var weid=$(this).data('id');
        if(isNull(weid)==false){
                $.ajax({
                    url: ApiUrl+'vote/item_destroy/'+weid,  
                    type:'GET',
                    success:function (data){
                        if(data.code==200){
                            swal({
                                title: "删除成功!",
                                timer: 2000,
                                showConfirmButton: false
                            });
                            document.location.reload();
                        }else{
                            swal({
                                title: "删除失败!",
                                timer: 2000,
                                showConfirmButton: false
                            });
                        }
                    }
                })
            }else{
                swal({
                  title: "参数为空!",
                  timer: 2000,
                  showConfirmButton: false
                });
            }
    });

})

function changeItemStatu(obj){
    var weid=$(obj).attr("value");
    if(isNull(weid)==false){
        $.ajax({
                url: ApiUrl+'vote/item_status',  
                type:'POST',
                data:{'weid':weid},
                success:function (data){
                    if(data.code==200){
                        var varcalss=$(obj).attr("class");
                        if(varcalss=="iconfont icon-dui"){
                            $(obj).attr("class","iconfont icon-gang");
                        }else{
                            $(obj).attr("class","iconfont icon-dui");
                        }  
                    }
                }
        })
    }
}
$(document).on('click', '.wechat-qrcode', function(){
    swal({
        text: '请用微信扫描二维码进入',
        imageUrl: hosts + 'file/qrcode?size=8&margin=2&url=' + 'http://m.'+ window.location.host + '/vote/show/' + $(this).data('id'),
        imageWidth: 200,
        imageHeight: 200,
        animation: false
      }).then(
        function () {0.
        },
        // handling the promise rejection
        function (dismiss) {
            if (dismiss === 'timer') {
                console.log(dismiss);
            }
        }
    );
});


     var initAdvList = function(data){
        var params=null;
        $('#voteListTable').DataTable({
            "ordering": false,
            "ajax": {
                url:ApiUrl+"vote/vote_list",
                type:"POST",
                data:data,
                "dataSrc": function ( json ) {
                    // console.log(json.data.list);
                    for ( var i=0, ien=json.data.list.length ; i<ien ; i++ ) {

                        
                        json.data.list[i].id=(json.data.params.currPage-1)*json.data.params.pageNumber+(i+1);
                        var operationhtml='';
                        if(isNull(json.data.list[i].statusOperation)==false){
                            operationhtml='<ul class="dropdown-menu" style="min-width:78px;" id="state"><li><a onclick="changeVoteStatu(this)" style="background: #f4f4f4;" class="btn btn-info" id="info" value="'+json.data.list[i].weid+'">'+json.data.list[i].statusOperation+'</a></li></ul>';
                        }
                        //状态   
                        json.data.list[i].status='<div class="btn-group"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+json.data.list[i].statusName+'<span class="caret"></span></button>'+operationhtml+'</div>';

                        //投票页
                        json.data.list[i].title='<a title="' + json.data.list[i].title + '" href="http://'+ window.location.host + `/vote/` + json.data.list[i].weid+'" target="_blank">'+shorten_str(json.data.list[i].title, 15)+'</a> <span class="pull-right">&nbsp;&nbsp;&nbsp;<a title="访问PC端" href="http://'+ window.location.host + `/vote/` + json.data.list[i].weid+'" target="_blank"><i class="fa fa-desktop"></i></a> &nbsp;<a title="访问微信端"><i class="fa fa-weixin wechat-qrcode" data-id="' + json.data.list[i].weid + '"></i></span>';
                        //投票周期
                        json.data.list[i].begin_time=json.data.list[i].begin_time+'--'+json.data.list[i].end_time;
                        //操作   
                        json.data.list[i].operation='<a href="vote_edit.html?vote_id='+json.data.list[i].weid+'" class="btn btn-info" style="margin-left:3px;">编辑</a><a href="vote_item_list.html?vote_id='+json.data.list[i].weid+'" class="btn btn-info" style="margin-left:3px;">投票项</a><a href="vote_adv.html?vote_id='+json.data.list[i].weid+'" class="btn btn-info" style="margin-left:3px;">广告项</a><a href="vote_chart.html?vote_id='+json.data.list[i].weid+'" class="btn btn-info" style="margin-left:3px;">报表</a>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<button class="btn btn-danger pull-right btn-delete"  data-id="' + json.data.list[i].weid + '" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="确定要删除？" data-content="<button class='  + "'btn btn-danger btn-delete-confirm'" + '  data-id='  + "'" + json.data.list[i].weid + "'" + '>确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='  + "'btn btn-default'" + '>取消</button>" >删除</button>'; 


                    }    
                    params=json.data.params;
                    return json.data.list;
                    }
                },
            "columns": [
                {"data": "id"},
                {"data": "title"},
                {"data": "status"},
                {"data": "begin_time"},
                {"data": "num"},
                {"data": "views"},
                {"data": "operation"},
            ],
            "destroy":true,//允许表格重新加载
            //"paging": false,
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
            initComplete:function(){
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
 var myPagination=function(params){
       var pageHtml='';
          //首页
          if(parseInt(params.currPage)==1){
                 pageHtml=pageHtml+'<li class=\"paginate_button previous disabled\" id=\"advListTable_previous\"><a href=\"#\"  data-dt-idx="'+(parseInt(params.currPage)-1)+'" tabindex=\"0\"> 上一页 </a></li>';
          }else{
                  pageHtml=pageHtml+'<li class=\"paginate_button previous\" id=\"advListTable_previous\"><a href=\"#\"  data-dt-idx="'+(parseInt(params.currPage)-1)+'" tabindex=\"0\"> 上一页 </a></li>';
          }

           for ( var i=0, ien=parseInt(params.pageCount); i<ien ; i++ ) {
              //当前页
              if(parseInt(params.currPage)==(i+1)){
                     pageHtml=pageHtml+'<li class=\"paginate_button active\"><a href=\"#\"  data-dt-idx="'+(i+1)+'" tabindex=\"0\">'+(i+1)+'</a></li>';
              }else{
                      pageHtml=pageHtml+'<li class=\"paginate_button\"><a href=\"#\"  data-dt-idx="'+(i+1)+'" tabindex=\"0\">'+(i+1)+'</a></li>';
              }
           }

           //尾页
          if(parseInt(params.currPage)==parseInt(params.pageCount)){
                 pageHtml=pageHtml+'<li class=\"paginate_button next disabled\" id=\"advListTable_next\"><a href=\"#\"  data-dt-idx="'+(parseInt(params.currPage)+1)+'" tabindex=\"0\"> 下一页 </a></li>';
          }else{
                  pageHtml=pageHtml+'<li class=\"paginate_button next\" id=\"advListTable_next\"><a href=\"#\"  data-dt-idx="'+(parseInt(params.currPage)+1)+'" tabindex=\"0\"> 下一页 </a></li>';
          }
          $('.dataTables_info').html("当前显示 1 到 "+($('table tr').length-1)+" 条，共 "+params.total+" 条记录。");
          $('.pagination').append(pageHtml);
          //分页点击事件
          $('.pagination a').each(function(i){
                $(this).click(function(){
                    var page=$(this).attr('data-dt-idx');
                    var data = {
                        page:page,
                        limit:10,
                    };
                    initAdvList(data);
                             })
            });
 }


$(document).ready(function(){
  start();
	$("#vote_add_url").attr("href","vote_edit.html");
	initAdvList(null);
  $(document).on('click', '.btn-delete-confirm', function(){
    var weid=$(this).data('id');
    if(isNull(weid)==false){
            $.ajax({
                url: ApiUrl+'vote/vote_destroy/'+weid,  
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

function changeVoteStatu(obj){
    var weid=$(obj).attr("value");
    if(isNull(weid)==false){
        $.ajax({
                url: ApiUrl+'vote/vote_status',  
                type:'POST',
                data:{'weid':weid},
                success:function (data){
                    if(data.code==200){
                        var text=$(obj).text();
                        if(text=="中止"){
                            $(obj).text('开放');
                            $(obj).parent().parent().prev().text('中止');
                        }else{
                            $(obj).text('中止');
                            $(obj).parent().parent().prev().text('进行中')
                        }  
                    }
                }
        })
    }
    
}

$(document).on('click', '.wechat-qrcode', function(){
    swal({
        text: '请用微信扫描二维码进入',
        imageUrl: hosts + 'file/qrcode?size=8&margin=2&url=' + 'http://m.'+ window.location.host + '/vote/' + $(this).data('id'),
        imageWidth: 200,
        imageHeight: 200,
        animation: false
      }).then(
        function () {
        },
        // handling the promise rejection
        function (dismiss) {
            if (dismiss === 'timer') {
                console.log(dismiss);
            }
        }
    );
});
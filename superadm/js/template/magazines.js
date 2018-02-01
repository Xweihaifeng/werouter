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
var getLocalTime=function(nS) {    
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');     
}
 //获取参数
var getUrlParam=function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}
var ename = getUrlParam('ename') ? getUrlParam('ename') : '';
  var initAdvList = function(data){
        var params=null;
     $('#listTable').DataTable({
      "ajax": {
        url:ApiUrl+"magazine/lists",
        type:"GET",
        data:data,
        "dataSrc": function ( json ) {
          var list = cloneObj(json.data.list);
          for ( var i=0, ien=json.data.list.length ; i<ien ; i++ ) {
                        list[i].id = i + 1;
            list[i].title = `<a title="` + json.data.list[i].title + `" href="` + window.location.protocol + `//` + window.location.host + `/magazine/` + json.data.list[i].ename + `/` + json.data.list[i].weid + `" target="_blank">` + shorten_str(json.data.list[i].title, 15) + `</a>`;
            list[i].cover = json.data.list[i].cover ?   json.data.list[i].cover.indexOf('http') !== 0 ? '<img class="thumb-image" data-action="zoom" src="' + ApiMaterPlatQiniuDomain + json.data.list[i].cover + '" width="40" height="40">' : '<img class="thumb-image" data-action="zoom" src="' + json.data.list[i].cover + '" width="40" height="40">'  : '';
            list[i].background_image = json.data.list[i].background_image ?   json.data.list[i].background_image.indexOf('http') !== 0 ? '<img class="thumb-image" data-action="zoom" src="' + ApiMaterPlatQiniuDomain + json.data.list[i].background_image + '" width="60" height="60">' : '<img class="thumb-image" data-action="zoom" src="' + json.data.list[i].background_image + '" width="40" height="40">'  : '';
            
            list[i].status= json.data.list[i].status == 1 ? '<span class="label label-success">开启</span>' :  json.data.list[i].status == 2 ? '<span class="label label-default">关闭</span>' : '<span class="label label-danger">删除</span>';
            list[i].created_at = getLocalTime(json.data.list[i].created_at);
            //content_edit.html?id=`+json.data.list[i].weid + `
            list[i].operation=`<div class="btn-group" role="group"><a href=magazine_edit.html?weid=`+json.data.list[i].weid+`&index_id=`+json.data.list[i].plat_magazine_index_id+` class="btn btn-primary">编辑</a>` + `<div class="btn-group">
            <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              设置 <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">`
                            + (json.data.list[i].status != 1 ? `<li><a href="#" class="set-status" data-type="1" data-id="` + json.data.list[i].weid + `" >开启</a></li>` : ``)
                            + (json.data.list[i].status != 2 ? `<li><a href="#" class="set-status" data-type="2" data-id="` + json.data.list[i].weid + `" >关闭</a></li>` : ``)
            + `</ul>
            </div></div>` + '   <a href="magazineImages.html?magazine_id='+json.data.list[i].weid+'" class="btn btn-success">内容管理</a><button class="btn btn-danger pull-right btn-delete"  data-id="' + json.data.list[i].weid + '" data-toggle="popover" data-placement="left" data-trigger="focus" data-html="true" title="确定要删除？" data-content="<button class='  + "'btn btn-danger btn-delete-confirm'" + '  data-id='  + "'" + json.data.list[i].weid + "'" + '>确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='  + "'btn btn-default'" + '>取消</button>" >删除</button>';
          }

          params=json.data.params;
          ename=json.data.params.ename;
          initSelect();
          return list;
          }
        },
      "columns": [
        {"data": "id"},
        {"data": "title"},
        {"data": "cover"},
        {"data": "background_image"},
        {"data": "summary"},
        {"data": "content"},
        {"data": "magazine_num"},
                {"data": "num"},
                {"data": "views"},
                {"data": "created_at"},
        {"data": "status"},
        {"data": "operation"},
      ],
       "aoColumnDefs": [
         //{"bSortable": false, "aTargets": [1,2,3,4,7]}, //can't be sorted
         {"bSearchable": false, "aTargets": [2,7]}, //can't be searched
       ],
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
        $('.dataTables_info').html("本页显示" + ($('table tr').length - 1) + " 条，共 " + params.total + " 条记录。");
        $('.pagination').append(pageHtml);
        //分页点击事件
        $('.pagination a').each(function (i) {
            $(this).click(function () {
               if($(this).attr('data-dt-idx')>0 && $(this).attr('data-dt-idx')<=params.pageCount){
                var page    = $(this).attr('data-dt-idx');
                var data = {
                   ename:params.ename,
                    page    : page,
                    limit   : 10,
                };
                initAdvList(data);
              }
            })
        });
    }
    //分类select初始化
     var initSelect = function(){
        var types='';
         $.getJSON(ApiUrl+"magazine/index/lists",function(result){
            $.each(result.data.list, function(i,item){
              if(ename==item.ename){
                  types=types+'  <a href="javascript:void;" data="'+item.ename+'"><button class="btn btn-success">'+item.name+'</button></a>';
              }else{
                 types=types+'  <a href="javascript:void;" data="'+item.ename+'"><button class="btn btn-default">'+item.name+'</button></a>';
              }
            });
             $(".type-select").empty();
             $(".type-select").append(types);
        });
    };
$(document).ready(function(){
    var data = {
                     ename:ename,
                  };
    initAdvList(data);
    $('#type-select').change(function(){ 
        var ename=$(this).children('option:selected').val(); 
        var data = {
            ename:ename,
        };
        initAdvList(data);
    })
  $(document).on('click', '.type-select a', function(){
        var data = {
                     ename:$(this).attr('data'),
                  };
       initAdvList(data);
  });
  $(document).on('click', '.btn-delete-confirm', function(){
    $.ajax({
      url: ApiUrl + 'magazine/updateStatus/' + $(this).data('id'),
      type: 'post',
      data:{status:3},
      dataType: 'json',
      success: function(data){
        location.reload();
      },
      error: function(xhr){
        console.log(xhr);
      }
    });
  });
  $(document).on('click', '.set-status', function(){
    var id = $(this).data('id');
    var type = $(this).data('type');
    $.ajax({
      url: ApiUrl + 'magazine/updateStatus/' + id,
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
})

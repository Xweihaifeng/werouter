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
        var avatar=null;
     $('#listTable').DataTable({
      "ajax": {
        url:ApiUrl+"cert/realname/lists",
        type:"GET",
        data:data,
        "dataSrc": function ( json ) {
          var list = cloneObj(json.data.list);
                    var candle='更改';
          for ( var i=0, ien=json.data.list.length ; i<ien ; i++ ) {
                        list[i].id = i + 1;
                        avatar=json.data.list[i].avatar;
                  if(avatar!=null && avatar!=''){
                        avatar=avatar.indexOf('http') === 0 ? avatar : ApiMaterPlatQiniuDomain + avatar;
                        list[i].avatar = `<img src="` + avatar + `" data-action="zoom" width="60">`;
                    }else{
                        list[i].avatar ='';
                    }
            if(json.data.list[i].phone==null){
                 list[i].phone='';
             }
            list[i].ctype = json.data.list[i].type == 1 ? '在线认证' : '人工认证';
            list[i].is_authenticated = json.data.list[i].is_authenticated == 1 ? '<span class="label label-success">已认证</span>' : '<span class="label label-primary">未认证</span>';
            if (json.data.list[i].operation_status == 1)
            {
              list[i].operation_status = '<span class="label label-primary">未操作</span>';
            } else if (json.data.list[i].operation_status == 2) {
              list[i].operation_status = '<span class="label label-success">已通过</span>';
                        } else if (json.data.list[i].operation_status == 3) {
              list[i].operation_status = '<span class="label label-danger">已拒绝</span>';
                        }
            list[i].created_at = new Date(json.data.list[i].created_at * 1000).format('yyyy-MM-dd');
             if(json.data.list[i].operation_time!='' && json.data.list[i].operation_time!=0){
                           list[i].operation_time = new Date(json.data.list[i].operation_time * 1000).format('yyyy-MM-dd');
                }else{list[i].operation_time = '';}
                        candle=json.data.list[i].type == 1?'详情':'更改';
                        if(json.data.list[i].operation_status == 1 && json.data.list[i].type == 2){
                             candle='审批';
                        }
            list[i].operation=`<div class="btn-group" role="group"><button class="btn btn-primary pop-modal" data-type="` + json.data.list[i].type +  `" data-id="` + json.data.list[i].weid + `">`+candle+`</button>`;
          }
          params=json.data.params;
          return list;
          }
        },
      "columns": [
        {"data": "id"},
        {"data": "avatar"},
        {"data": "name"},
        {"data": "phone"},
        {"data": "ctype"},
        {"data": "is_authenticated"},
        {"data": "operation_status"},
        {"data": "refuse_words"},
        {"data": "created_at"},
        {"data": "operation_time"},
        {"data": "operation"},
      ],
       "aoColumnDefs": [
         {"bSortable": false, "aTargets": [1,2,3,4,5,6,7,10]},  //can't be sorted
         {"bSearchable": false, "aTargets": [1,10]}, //can't be searched
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
        $('.dataTables_info').html("当前显示 1 到 " + ($('#listTable  tr').length - 1) + " 条，共 " + params.total + " 条记录。");
        $('.pagination').append(pageHtml);
        //分页点击事件
        $('.pagination a').each(function (i) {
            $(this).click(function () {
               if($(this).attr('data-dt-idx')>0 && $(this).attr('data-dt-idx')<=params.pageCount){
                var page            = $(this).attr('data-dt-idx');
                var real_name           = $('input[name=real_name]').val();
                var phone               = $('input[name=phone]').val();
                var is_authenticated    = $('select[name=is_authenticated]').val();
  
                var data = {
                  real_name       : real_name,
                  phone           : phone,
                  is_authenticated:is_authenticated,
                    page        : page,
                    limit       : 15,
                };
                initAdvList(data);
                }
            })
        });
    }


    var __init = function () {
      var real_name           = $('input[name=real_name]').val();
      var phone               = $('input[name=phone]').val();
      var is_authenticated    = $('select[name=is_authenticated]').val();

      var data = {
            real_name           : real_name,
            phone               : phone,
        is_authenticated    :is_authenticated
      };
      initAdvList(data);
    }

    $(document).ready(function(){
        __init();
    });
  $(document).on('change', 'input[name=real_name],input[name=phone],select[name=is_authenticated]', function(){
    var real_name       = $("input[name=real_name]").val();
    var phone           = $("input[name=phone]").val();
    var is_authenticated    = $('select[name=is_authenticated]').val();
    var data = {
      real_name       : real_name,
            phone           : phone,
      is_authenticated:is_authenticated
    };
    initAdvList(data);
  });

  $(document).on('click', '.pop-modal', function(){
    if ($(this).data('type') == 2) {
      $('#bootstrapModal').modal('show');
      $.ajax({
        url: ApiUrl + 'cert/realname/show/' + $(this).data('id'),
        type: 'get',
        dataType: 'json',
        success: function(data){
          $('#bootstrapModal input[name=weid]').val(data.data.weid);
         if(data.data.avatar!=null && data.data.avatar!=''){
           $('#bootstrapModal .avatar').show();
          $('#bootstrapModal .avatar').attr('src', data.data.avatar.indexOf('http') === 0 ? data.data.avatar : ApiMaterPlatQiniuDomain + data.data.avatar);
          }else{
           $('#bootstrapModal .avatar').hide(); 
          }
          $('#bootstrapModal .real_name').text(data.data.name);
          $('#bootstrapModal .phone').text(data.data.phone);
          $('#card_id').text(data.data.card_id);
          $('#card_front').attr('src', data.data.card_front.indexOf('http') === 0 ? data.data.card_front : ApiMaterPlatQiniuDomain + data.data.card_front);
          $('#card_back').attr('src', data.data.card_back.indexOf('http') === 0 ? data.data.card_back : ApiMaterPlatQiniuDomain + data.data.card_back);
          $('#bootstrapModal .is_authenticated_control').data('original', data.data.is_authenticated);
          $("#bootstrapModal input[name='is_authenticated'][value=" + data.data.is_authenticated +  "]").attr("checked",true);
          if (data.data.operation_status == 3) {
            $('#bootstrapModal .refuse_view').show();
            $('#bootstrapModal .refuse_words').text(data.data.refuse_words);
          }
          $('#bootstrapModal .created_at').text(new Date(data.data.created_at * 1000).format('yyyy-MM-dd hh:mm:ss'));
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
        } else if ($(this).data('type') == 1) {
      $('#bootstrapModalX').modal('show');
      $('.order').hide();
      $.ajax({
        url: ApiUrl + 'cert/realname/show/' + $(this).data('id'),
        type: 'get',
        dataType: 'json',
        success: function(data){
          $('#bootstrapModalX input[name=weid]').val(data.data.weid);
                  if(data.data.avatar!=null && data.data.avatar!=''){
                      $('#bootstrapModal .avatar').show();
                    $('#bootstrapModalX .avatar').attr('src', data.data.avatar.indexOf('http') === 0 ? data.data.avatar : ApiMaterPlatQiniuDomain + data.data.avatar);
                    }else{
                     $('#bootstrapModal .avatar').hide(); 
                    }
                    $('#bootstrapModalX .real_name').text(data.data.name);
                    $('#bootstrapModalX .phone').text(data.data.phone);
                    $('#bootstrapModalX .card_id').text(data.data.card_id);
                    $('#bootstrapModalX .is_authenticated_control').data('original', data.data.is_authenticated);
                    //$("#bootstrapModalX input[name='is_authenticated'][value=" + data.data.is_authenticated +  "]").attr("checked",true);
                    if(data.data.is_authenticated==2){
                       $("#rzzt").text("未认证");
                    }
                    if (data.data.operation_status == 3) {
                        $('#bootstrapModalX .refuse_view').show();
                        $('#bootstrapModalX .refuse_words').text(data.data.refuse_words);
                    }
                    $('#bootstrapModalX .created_at').text(new Date(data.data.created_at * 1000).format('yyyy-MM-dd hh:mm:ss'));
                    //付费方式
                     var pay_type='平台代付'
                     if(data.data.authLog!=null){
                         if(data.data.authLog.pay_type==2){
                            pay_type='自费';
                         }else if(data.data.authLog.pay_type==3){
                            pay_type='首次代付';
                         }
                     }
                     $('#bootstrapModalX .pay_type').text(pay_type);
                    //支付信息
                    if(data.data.order!=null){
                        $('.order').show();
                        $('#bootstrapModalX .total_fee').text(data.data.order.total_fee+'￥');
                        $('#bootstrapModalX .out_trade_no').text(data.data.order.out_trade_no);
                        $('#bootstrapModalX .pay_at').text(new Date(data.data.order.pay_at * 1000).format('yyyy-MM-dd hh:mm:ss')); 
                    }else{
                      $('.order').hide();
                      $('#bootstrapModalX .total_fee').text('0￥');
                    }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
        }
  });

  $(document).on('click', '.sub-btn', function(){
    var weid = $('#bootstrapModal input[name=weid]').val();
    var result = $('#bootstrapModal input[name="is_authenticated"]:checked').val();
        var refuse_words = $('#bootstrapModal .refuse_words').val();
        //设置为已认证时制空拒绝原因
        if(result==1){refuse_words='';}
    var data = {
      result    : result,
      refuse_words    : refuse_words
        };
    $.ajax({
      url: ApiUrl + 'cert/artificial/' + weid,
      type: 'post',
            data: data,
      dataType: 'json',
      success: function(data){
                if (data.code == 200) {
                  swal({
                    text: '操作成功！',
                    type: 'success',
                    timer:20000
                  }).then(
                    function () {
                      location.reload();
                    },
                    function (dismiss) {
                      if (dismiss === 'timer') {
                        location.reload();
                      }
                    }
                  )
                }
      },
      error: function(xhr){
        console.log(xhr);
      }
    });
  });
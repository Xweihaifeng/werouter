/*     var initAdvList = function(data){
        var params=null;
        $('#advListTable').DataTable({
            "ajax": {
                url:ApiUrl+"cms/advs/lists",
                type:"GET",
                data:data,
                "dataSrc": function ( json ) {
                    // console.log(json.data.list);
                    for ( var i=0, ien=json.data.list.length ; i<ien ; i++ ) {
                        json.data.list[i].id=i+1;
                        if(json.data.list[i].image!='#'){
                            if(json.data.list[i].image.indexOf('http://')!=-1){
                                 json.data.list[i].image='<img src="'+json.data.list[i].image+'" height="80px" width="200px" alt="" data-action="zoom">';
                            }else{
                             json.data.list[i].image='<img src="'+ApiMaterPlatQiniuDomain+json.data.list[i].image+'" height="80px" width="200px" alt="" data-action="zoom">';
                             }
                        } 
                         json.data.list[i].operation="<a href=cmsadv_edit.html?weid="+json.data.list[i].weid+" class=\"btn btn-info\">编辑</a>&nbsp;&nbsp;<button class=\"btn btn-danger btn-delete\"  data-id="+json.data.list[i].weid+" data-toggle=\"popover\" data-placement=\"left\" data-trigger=\"focus\" data-html=\"true\" title=\"确定要删除？\" data-content=\"<button class='btn btn-danger btn-delete-confirm'  data-id="+json.data.list[i].weid+">确认</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button class='btn btn-default'>取消</button>\" >删除</button>";
                    }
                     params=json.data.params;
                    return json.data.list;

                    }
                },
            "columns": [
                {"data": "id"},
                {"data": "title"},
                {"data": "image"},
                {"data": "url"},
                {"data": "type_title"},
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
                    var type_id= $("#type-select").children('option:selected').val(); 
                    var data = {
                        type_id:type_id,
                        page:page,
                        limit:10,
                    };
                    initAdvList(data);
                             })
            });
 }*/
 var tusitemp="";
 function mess_tusi(strs){
    //清除事件
    clearTimeout(tusitemp);
    $("#mess_tusi").remove();
    //创建吐丝层并写入内容
    if(!$("#mess_tusi").attr("id")){ //吐丝层不存在创建
        $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>"+strs+"</span></div>"); //写入内容
    }else{
        $("#mess_tusi").html(strs);  //写入内容
    }

    //定义吐丝层位置
    var left=($(window).width()-$("#mess_tusi").width())/2;//居中
    //var top=($(window).height()-$("#mess_tusi").height())/2;//居中
    var top=$(window).height()*0.25;
    $("#mess_tusi").css({"left":left+"px","top":top+"px"});

    //显示吐丝层rou't
    $("#mess_tusi").css("display",'');

    //2秒后关闭
    tusitemp =  setTimeout(function (){
        $("#mess_tusi").remove();
        $("#mess_tusi").html("");
    },2000);
    return false;
}
$(document).ready(function(){
    start();
    var listtemplate=function(data,type=0,pname="",fname="",ppid=""){
         i++;
         var typename="";
         var areaid="";
         var btnhtml='<button class="btn btn-primary btn-select">查看</button> ';
         if(type==0){
          typename='省';
         }else if(type==1){
          // var typename='市';

         }else if(type==2){
          // var typename='区县';
          btnhtml="";
          areaid=data.area_id;
         }

      var listhtml='<tr align="center" ref="'+ppid+'" id="'+areaid+'" data-id="'+data.id+'">'+
        '<td>'+i+'</td>'+
        '<td class="name">'+data.name+'</td>'+
        '<td>'+data.code+'</td>'+
        '<td>'+pname+fname+typename+'</td>'+
        '<td>'+btnhtml+
        '<button class="btn btn-primary btn-edit "  data-toggle="modal" data-id="'+data.id+'" data-target="#myModal">编辑</button> '+
          '<button class="btn btn-danger btn-del">删除</button></td>'+
        '</tr>';
      return listhtml;
    }
   



    // 省份模板
    var provitemplate=function(){
      var provihtml='<div class="form-group">'+
                        '<label for="province">省份：</label>'+
                        '<input type="text" name="province"  class="form-control" id="province">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="code">行政区划代码：</label>'+
                        '<input type="text" name="code"  class="form-control" id="code">'+
                    '</div>';
      return provihtml;
    }
    var citymplate=function(){
      var cityhtml='<div class="form-group">'+
                        '<label for="province">省份：</label>'+
                        '<select name="province" id="province" class="form-control">'+
                          '<option value="" rel="0">请选择省份</option>'+
                        '</select>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="city">城市：</label>'+
                        '<input type="text" name="city"  class="form-control" id="city">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="code">行政区划代码：</label>'+
                        '<input type="text" name="code"  class="form-control" id="code">'+
                    '</div>';
      return cityhtml;
    }
    var countymplate=function(){
      var countyhtml='<div class="form-group">'+
                        '<label for="province">省份：</label>'+
                        '<select name="province" id="province" class="form-control">'+
                          '<option value="" rel="0">请选择省份</option>'+
                        '</select>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="city-s">城市：</label>'+
                        '<select name="city-s" id="city-s" class="form-control">'+
                          '<option value="" rel="0">请选择城市</option>'+
                        '</select>'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="county">区县：</label>'+
                        '<input type="text" name="county"  class="form-control" id="county">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="code">行政区划代码：</label>'+
                        '<input type="text" name="code"  class="form-control" id="code">'+
                    '</div>';
      return countyhtml;
    }
    // 请求所有的省份
    var i=0;
    var provinceall=function(type=0,edit=0,ppid="",fid=""){
      console.log(ppid);
       $.ajax({
        url: ApiUrl + 'province/list',
        type: 'get',
        dataType: 'json',
        success: function(data){
          console.log(data);
          if (data.code === 200){
            if(edit==1){
             $("#provincialListTable tbody").children().remove();              
            }
             $("#myTab li").each(function(){
              if($(this).attr("class")!="active"){
                $(this).remove();
              }
             })
              data.data.list.map(x =>{
                if(type==1){
                  $("#provincialListTable tbody").append(listtemplate(x,0,"",""));
                }else if(type==0){
                  $("#province").append('<option  value="'+x.id+'" rel="'+x.code+'">'+x.name+'</option>')

                }
                

              })
              $("#provincialListTable .btn-select").bind("click",function(){
                // 请求省下市
                var pid=$(this).closest('tr').data("id");
                /*var pname=$(this).closest('tr').find(".name").text();
                console.log("省id："+pid);
                proid=pid;
                provincecity(pid,type,pname);*/
                window.location='area.html';
                localStorage.setItem("pid",pid);
              });
              $("#province").bind("change",function(){
                var pid=$(this).val();
                provincecity(pid);
              });
              if(edit==1){
                  console.log($("#province option"));
                  $("#province option").each(function(){
                    if($(this).val()==ppid){
                      $(this).attr("selected","selected");
                    }
                  })
                   // $("#province").change();
                   console.log($("#province").val());
                    provincecity($("#province").val(),0,"",0,fid);

                }
                delprov();
              editall();
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }
    // 请求省下市
    var proid="";
    var provincecity=function(pid,type=0,pname="",ptype=0,fid=""){
      console.log(pid,fid);
      $.ajax({
        url: ApiUrl + 'area/list/'+pid,
        type: 'get',
        dataType: 'json',
        success: function(data){
          console.log(data);
          if (data.code === 200){

            $("#city-s").children().remove();
            $('#city-s').append('<option value="" rel="0">请选择城市</option>');
              if(type==1){
                if(ptype==0){
                  $("#myTab").append('<li id="1"><a href="#citylist" data-toggle="tab">城市列表</a></li>')
                  $("#myTab").find("#1").addClass("active").siblings().removeClass("active");
                }else{
                  $("#myTab li").each(function(){
                    if($(this).attr("class")!="active"){
                      $(this).next().remove();
                    }
                   })
                }
                

                $("#provincialListTable tbody").children().remove();
              }
              data.data.list.map(x =>{
                if(type==1){
                  $("#provincialListTable tbody").append(listtemplate(x,type,pname,"",pid));

                }else if(type==0){
                  $("#city-s").append('<option value="'+x.id+'" rel="'+x.code+'">'+x.name+'</option>')

                }

              })
              $("#city-s option").each(function(){
                if($(this).val()==fid){
                  $(this).attr("selected","selected");
                }
              })
              $("#provincialListTable .btn-select").bind("click",function(){
                // 请求市下区县
                console.log(pid);
                // var ppid=pid;
                var ppid=$(this).closest('tr').data("id");
                var fname=$(this).closest('tr').find(".name").text();
                console.log(ppid,pid);
                citycountry(ppid,pid,pname,fname,pid);
              });
              // editall();
              // delprov();
              
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }
    // 请求市下区县
    var citycountry=function(pid,type,pname,fname,ppid=""){
      $.ajax({
        url: ApiUrl + 'county/list/'+pid,
        type: 'get',
        dataType: 'json',
        success: function(data){
          console.log(data);
          if (data.code === 200){            
                $("#myTab").append('<li id="2"><a href="#countylist" data-toggle="tab">区县列表</a></li>')
                $("#myTab").find("#2").addClass("active").siblings().removeClass("active");
                $("#provincialListTable tbody").children().remove();
              
              data.data.list.map(x =>{
               
                  $("#provincialListTable tbody").append(listtemplate(x,2,pname,fname,ppid));

               

              })
              $("#myTab li").bind("click",function(){
                console.log($(this).attr("id"),type);
                if($(this).attr("id")==1){
                  provincecity(type,1,pname,1);
                }
              })
              // editall();
             // delprov();
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }

     // 请求省详情
    var provincedetail=function(pid){
      console.log(pid);
      $.ajax({
        url: ApiUrl + 'province/detail/'+pid,
        type: 'get',
        dataType: 'json',
        success: function(data){
          console.log(data);
          if (data.code === 200){     
            $("#province").val(data.data.name);
            $("#code").val(data.data.code);       
               // $("#province").append('<option value="'+data.data.id+'" rel="'+data.data.code+'">'+data.data.name+'</option>')
              
                 
             
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }
    //请求城市详情
    var citydetail=function(pid){
      console.log(pid);
      $.ajax({
        url: ApiUrl + 'area/detail/'+pid,
        type: 'get',
        dataType: 'json',
        success: function(data){
          console.log(data);
          if (data.code === 200){     
            /*$("#province").val(data.data.name);*/
            $("#city").val(data.data.name);
            $("#code").val(data.data.code);       
               // $("#province").append('<option value="'+data.data.id+'" rel="'+data.data.code+'">'+data.data.name+'</option>')
              $("#city-s option").each(function(){
                if($(this).val()==data.data.province_id){
                  $(this).attr("selected","selected");
                }
              })
                 
             
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }
    // 请求区县详情
    var countrydetail=function(pid){
       console.log(pid);
      $.ajax({
        url: ApiUrl + 'county/detail/'+pid,
        type: 'get',
        dataType: 'json',
        success: function(data){
          console.log(data);
          if (data.code === 200){     
            /*$("#province").val(data.data.name);*/
            $("#county").val(data.data.name);
            $("#code").val(data.data.code);       
               // $("#province").append('<option value="'+data.data.id+'" rel="'+data.data.code+'">'+data.data.name+'</option>')
              /*$("#province option").each(function(){
                if($(this).val()==data.data.province_id){
                  $(this).attr("selected","selected");
                }
              })*/

              
                 
             
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }

    $("#myTab li").bind("click",function(){
      console.log($(this).attr("id"));
      if($(this).attr("id")==0){
        provinceall(1);
      }
    })


    

    // 添加省市县的判断
    $(".btn-addpro").bind("click",function(){
      var val=$("#type-select").val();
      $("#myModal_input").val(val);

      if(val==1 || val==0){
        // 添加省
        $(".modal-title").text("添加省份");
        $(".modal-body form").children().remove();
        $(".modal-body form").append(provitemplate());
      }else if(val==2){
        // 添加市
        $(".modal-title").text("添加城市");
        $(".modal-body form").children().remove();
        $(".modal-body form").append(citymplate());

        // 请求所有的省份
       provinceall();
      

      }else if(val==3){
        // 添加县
        $(".modal-title").text("添加区县");
        $(".modal-body form").children().remove();
        $(".modal-body form").append(countymplate());
        // 请求所有的省份
        provinceall();

      }

     
    })
    //编辑省市的判断
    var editall=function(){
      $(".btn-edit").bind("click",function(){
        $(".save").attr("data-id",1);
        var pid=$(this).closest('tr').data("id");
        var ppid=$(this).closest('tr').attr('ref');
        var fid=$(this).closest('tr').attr("id");
        var val=$(this).data("id");
        console.log(val,fid,ppid,pid);
        // $("#myModal_input").val(val);
        $(".save").attr("id",pid);
          $(".modal-title").text("编辑省份");
          $(".modal-body form").children().remove();
         

          $(".modal-body form").append(provitemplate());
           // 获取省详情
          provincedetail(pid);
      
      })
    }
    $(".save").bind("click",function(){
      if($(this).attr("data-id")==1){
          var province=$("#province").val();
          var code=$("#code").val();
          if (province == '') {
              mess_tusi('请输入省份');
              return;
          }
          if (code == '') {
              mess_tusi('请输入行政区划代码');
              return;
          }
          var sendData={
            id:$(this).attr("id"),
            code:code,
            name:province
          }
          console.log(sendData);
            $.ajax({
            // url: ApiUrl + 'province/destroy/'+$(this).attr("id"),
            url: ApiUrl + 'province/update',
            type: 'post',
            data:sendData,
            dataType: 'json',
            success: function(data){
              console.log(data);
              if (data.code === 200){
                   mess_tusi("修改成功");
                   
                    $('#myModal').modal('hide');

                   window.location.reload();

                }else {
                   mess_tusi(data.message);
              }
            },
            error: function(xhr){
              console.log(xhr);
            }
          });
        }else{


      console.log($("#myModal_input").val());
      var typeid=$("#myModal_input").val();
      if(typeid==0 || typeid==1){
        var province=$("#province").val();
        var code=$("#code").val();
        if (province == '') {
            mess_tusi('请输入省份');
            return;
        }
        if (code == '') {
            mess_tusi('请输入行政区划代码');
            return;
        }
        var sendData={
          code:code,
          name:province
        }
        console.log(sendData);
       
          $.ajax({
            url: ApiUrl + 'province/store',
            type: 'post',
            data:sendData,
            dataType: 'json',
            success: function(data){
              console.log(data);
              if (data.code === 200){
                   mess_tusi("添加成功");
                   
                    $('#myModal').modal('hide');
                    $(".provincial").children().remove();

                   window.location.reload();

                }else {
                   mess_tusi(data.message);
              }
            },
            error: function(xhr){
              console.log(xhr);
            }
          });
        
      }else if(typeid==2){
        var province_id=$("#province").val();
        var city=$("#city").val();
        var code=$("#code").val();
        if (province_id == '') {
            mess_tusi('请选择省份');
            return;
        }
        if (city == '') {
            mess_tusi('请输入城市');
            return;
        }
        if (code == '') {
            mess_tusi('请输入行政区划代码');
            return;
        }
         var sendData={
          code:code,
          name:city,
          province_id:province_id
        }
        console.log(sendData);
        $.ajax({
          url: ApiUrl + 'area/store',
          type: 'post',
          data:sendData,
          dataType: 'json',
          success: function(data){
            console.log(data);
            if (data.code === 200){
                 mess_tusi("添加成功");
                 
                  $('#myModal').modal('hide');
                  $(".provincial").children().remove();

                 window.location.reload();

              }else {
                 mess_tusi(data.message);
            }
          },
          error: function(xhr){
            console.log(xhr);
          }
        });
      }else if(typeid==3){
        var province_id=$("#province_id").val();
        var area_id=$("#city-s").val();
        var county=$("#county").val();
        var code=$("#code").val();
        if (province_id == '') {
            mess_tusi('请选择省份');
            return;
        }
        if (area_id == '') {
            mess_tusi('请选择城市');
            return;
        }
        if (county == '') {
            mess_tusi('请输入区县');
            return;
        }
        if (code == '') {
            mess_tusi('请输入行政区划代码');
            return;
        }
         var sendData={
          code:code,
          name:county,
          area_id:area_id
        }
        console.log(sendData);
        $.ajax({
          url: ApiUrl + 'county/store',
          type: 'post',
          data:sendData,
          dataType: 'json',
          success: function(data){
            console.log(data);
            if (data.code === 200){
                 mess_tusi("添加成功");
                 
                  $('#myModal').modal('hide');
                  $(".provincial").children().remove();

                 window.location.reload();

              }else {
                 mess_tusi(data.message);
            }
          },
          error: function(xhr){
            console.log(xhr);
          }
        });
      }
    }
    })

      // 删除
    var delprov=function(){
      $(".btn-del").bind("click",function(){
      var pid=$(this).closest('tr').data("id");
           console.log(pid);
         $.ajax({
          url: ApiUrl + 'province/destroy/'+pid,
          type: 'get',
          dataType: 'json',
          success: function(data){
            console.log(data);
            if (data.code === 200){  
                mess_tusi("删除成功")   
              window.location.reload();             
                   
               
              }else {
                mess_tusi(data.message);   
            }
          },
          error: function(xhr){
            console.log(xhr);
          }
        });
    
      
    })
    }


    // 请求所有的城市列表
     var cityall=function(type=0){
       $.ajax({
        url: ApiUrl + 'province/list',
        type: 'get',
        dataType: 'json',
        success: function(data){
          console.log(data);
          if (data.code === 200){
              data.data.list.map(x =>{
                if(type==1){
                  $("#provincialListTable tbody").append(listtemplate(x));
                }else if(type==0){
                  $("#province").append('<option value="'+x.id+'" rel="'+x.code+'">'+x.name+'</option>')

                }

              })
              $("#province").bind("change",function(){
                var pid=$(this).val();
                provincecity(pid);
              })
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }

 // 省市区列表
    var provincialList=function(){
      provinceall(1);
      
    }

provincialList();


    
})
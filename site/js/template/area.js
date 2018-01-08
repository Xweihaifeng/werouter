
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
    // var listtemplate=function(data,type=0,pname="",fname="",ppid=""){
      var i=0;
    var listtemplate=function(data){
         i++;
         var typename="";
         var areaid="";
         var btnhtml='<button class="btn btn-primary btn-select" id="'+data.id+'">查看</button> ';
         

      var listhtml='<tr align="center" ref="'+data.province_id+'" id="'+data.id+'" >'+
        '<td>'+i+'</td>'+
        '<td class="name">'+data.name+'</td>'+
        '<td>'+data.code+'</td>'+
        '<td>'+data.province_name+'</td>'+
        '<td>'+btnhtml+
        '<button class="btn btn-primary btn-edit "  data-toggle="modal" data-id="'+data.id+'" data-target="#myModal">编辑</button> '+
          '<button class="btn btn-danger btn-del">删除</button></td>'+
        '</tr>';
      return listhtml;


    }
    var citymplate=function(data){
      var cityhtml='<div class="form-group">'+
                        '<label for="province">省份：</label>'+
                        '<input type="text" name="province" disabled="disbled" data-id="'+data.province_id+'" value="'+data.province_name+'"  class="form-control" id="province">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="city">城市：</label>'+
                        '<input type="text" name="city" value="'+data.name+'"  class="form-control" id="city">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="code">行政区划代码：</label>'+
                        '<input type="text" name="code" value="'+data.code+'"  class="form-control" id="code">'+
                    '</div>';
      return cityhtml;
    }
    // 省下市
    var provicity=function(pid){
        $.ajax({
          url: ApiUrl + 'area/list/'+pid,
          type: 'get',
          dataType: 'json',
          success: function(data){
            console.log(data);
            if (data.code === 200){
              data.data.list.map(x =>{
                  $("#provincialListTable tbody").append(listtemplate(x));

              })

              $("#provincialListTable .btn-select").bind("click",function(){
                // 请求市下区
                var pid=$(this).closest('tr').data("id");
                var pname=$(this).closest('tr').find(".name").text();
                console.log("省id："+pid);
                proid=pid;
                // provincecity(pid,type,pname);
                window.location='country.html';
                localStorage.setItem("cid",$(this).closest("tr").attr("id"));
              });
              editall();
            }
          }
      })
    }
var pid = localStorage.getItem("pid");

provicity(pid);

  //编辑省市的判断
    var editall=function(){
      $(".btn-edit").bind("click",function(){
        // var pid=$(this).closest('tr').data("id");
        var pid=$(this).closest('tr').attr('ref');
        var areaid=$(this).closest('tr').attr("id");
        // var val=$(this).data("id");
        // console.log(val,fid,ppid,pid);
        $("#myModal_input").val(areaid);

           // 编辑市
          $(".modal-title").text("编辑城市");
          $(".modal-body form").children().remove();
          // $(".modal-body form").append(citymplate());

          // 请求城市详情
         
          citydetail(areaid);

      })
      $(".save").bind("click",function(){
        var areaid=$("#myModal_input").val();
        var provinceid=$("#province").data("id");
        var code=$("#code").val();
        var name=$("#city").val();
        console.log(provinceid,areaid,code,name);
         $.ajax({
            url: ApiUrl + 'area/update',
            type: 'post',
            data:{id:areaid,province_id:provinceid,code:code,name:name},
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
      })
      // 删除
    // var delprov=function(){
      $(".btn-del").bind("click",function(){
      var areaid=$(this).closest('tr').attr("id");
      var pid=$(this).closest('tr').attr("ref");
        // var val=$(this).data("id");

        console.log(pid,areaid);
        $.ajax({
          url: ApiUrl + 'area/destroy/'+areaid,
          type: 'get',
          dataType: 'json',
          success: function(data){
            console.log(data);
            if (data.code === 200){   
              mess_tusi("删除成功");  
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
              $(".modal-body form").append(citymplate(data.data));
            
                 
             
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }



    
})
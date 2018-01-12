
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
         // var btnhtml='<button class="btn btn-primary btn-select" id="'+data.id+'">查看</button> ';
         

      var listhtml='<tr align="center" ref="'+data.area_id+'" id="'+data.id+'" >'+
        '<td>'+i+'</td>'+
        '<td class="name">'+data.name+'</td>'+
        '<td>'+data.code+'</td>'+
        '<td class="procity">'+data.city_name+'</td>'+
        // '<td><a href="javascript:void(0);" class="btn btn-primary btn-edit " data-id="'+data.id+'">编辑</a> '+
        '<td><button class="btn btn-primary btn-edit " data-toggle="modal"  data-id="'+data.id+'" data-target="#myModal">编辑</button> '+
          '<button class="btn btn-danger btn-del">删除</button></td>'+
        '</tr>';
      return listhtml;
    }

     var countymplate=function(data){
      var countyhtml='<div class="form-group">'+
                        '<label for="city-s">城市：</label>'+
                        '<input type="text" name="city-s" disabled="disbled" data-id="'+data.area_id+'" value="'+data.city_name+'"  class="form-control" id="city-s">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="county">区县：</label>'+
                        '<input type="text" name="county" value="'+data.name+'"  class="form-control" id="county">'+
                    '</div>'+
                    '<div class="form-group">'+
                        '<label for="code">行政区划代码：</label>'+
                        '<input type="text" name="code" value="'+data.code+'"  class="form-control" id="code">'+
                    '</div>';
      return countyhtml;
    }
    // 市下区县
    var citycount=function(cid){ 
      console.log(cid);
        $.ajax({
          url: ApiUrl + 'county/list/'+cid,
          type: 'get',
          dataType: 'json',
          success: function(data){
            console.log(data);
            if (data.code === 200){        
              if(data.data.total>0){
                data.data.list.map(x =>{                 
                    $("#provincialListTable tbody").append(listtemplate(x));                

                })
                provincedetail(localStorage.getItem("pid"));

                editall();

              }else{
                $("#provincialListTable tbody").append("<tr><td colspan='5'>暂无区县</td></tr>");
              }
                
                


              }else {
                 console.log('error: -200');
            }
          },
          error: function(xhr){
            console.log(xhr);
          }
        });
      
    }
var cid = localStorage.getItem("cid");

citycount(cid);

  // 省详情
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
                  
              $(".procity").each(function(){
                  $(this).text(data.data.name+" "+$(this).text());
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
          $(".modal-body form").append(countymplate(data.data));

               
             
            }else {
               console.log('error: -200');
          }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });
    }

  //编辑省市的判断
    var editall=function(){
      $(".btn-edit").bind("click",function(){
        // var pid=$(this).closest('tr').data("id");
        var areaid=$(this).closest('tr').attr('ref');
        var countyid=$(this).closest('tr').attr("id");
        // var val=$(this).data("id");
        // console.log(val,fid,ppid,pid);
        $("#myModal_input").val(countyid);

     
          $(".modal-title").text("编辑区县");
          $(".modal-body form").children().remove();
          

          // 请求区县详情
          countrydetail(countyid);

      })
      $(".save").bind("click",function(){
        var countyid=$("#myModal_input").val();
        var areaid=$("#city-s").data("id");
        var code=$("#code").val();
        var name=$("#county").val();
        console.log(countyid,areaid,code,name);
         $.ajax({
            url: ApiUrl + 'county/update',
            type: 'post',
            data:{id:countyid,area_id:areaid,code:code,name:name},
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
      var countryid=$(this).closest('tr').attr("id");
      var areaid=$(this).closest('tr').attr("ref");
        // var val=$(this).data("id");

        console.log(countryid,areaid);
        $.ajax({
          url: ApiUrl + 'county/destroy/'+countryid,
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


    
})
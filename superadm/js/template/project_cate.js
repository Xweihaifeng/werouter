$(document).ready(function(){
	start();
	var i=0;
	$.ajax({
        url: ApiUrl + 'project/cate/list',
        type: 'post',
        dataType: 'json',
        success: function(data){
          console.log(data);
          if (data.code === 200){
           	  data.data.list.map(x =>{
              	 $("#provincialListTable tbody").append(listtemplate(x));
              })
           }else {
               console.log('error: -200');
           }
        },
        error: function(xhr){
          console.log(xhr);
        }
      });

	var listtemplate=function(data){
		i++;
        
       var listhtml='<tr align="center" data-id="'+data.weid+'">'+
        '<td>'+i+'</td>'+
        '<td class="name">'+data.name+'</td>'+
        '<td><div style="text-align: center;"><img src="'+ApiMaterPlatQiniuDomain+data.cover+'" data-action="zoom" width="50" height="50"><div></td>'+
        '<td>'+data.ratio+'</td>'+
        '<td>'+  
        '<a class="btn btn-primary btn-edit " href="projectCate_edit.html?weid='+data.weid+'" data-id="'+data.weid+'" >编辑</a> '+
          '<button class="btn btn-danger btn-del" data-id="'+data.weid+'">删除</button></td>'+
        '</tr>';
      return listhtml;
    }

    $(document).on('click', '.btn-del', function(){
            var weid=$(this).data('id');
            if(isNull(weid)==false){
           		$.ajax({
                        url: ApiUrl+'project/cate/destroy/'+weid,
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
                                    title: data.message,
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
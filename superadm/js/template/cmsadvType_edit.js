$(document).ready(function(){
    start();
     var weid='';
     var init = function(){
         var type_id='';
        //数据初始化
        $.getJSON(ApiUrl+"cms/advTypes/show?weid="+getUrlParam('weid'),function(result){
            if (result.code === 200){
                       //console.log(result);
                        $('input[name=title]').val(result.data.title);
                        $('input[name=description]').val(result.data.description);
                        weid=result.data.weid;
                }else {
                     alert(data.message);
                     //console.log(data);
                }
        });
    };
     init();
    //非空验证
    $('#form').bootstrapValidator({
     message: 'This value is not valid',
     feedbackIcons: {
         valid: 'glyphicon glyphicon-ok',
         invalid: 'glyphicon glyphicon-remove',
         validating: 'glyphicon glyphicon-refresh'
     },
     fields: {
        title :{  
                message:'标题无效',  
                validators:{  
                    notEmpty:{  
                        message:'标题不能为空'  
                    },  
                    StringLength:{  
                        min:2,  
                        max:50,
                        message:'标题长度大于2位并且小于50位'
                    }
                }  
        }, 
     }
     });
     $("#updateAdv").click(function () {
          $('#form').data('bootstrapValidator').validate();  
            if(!$('#form').data('bootstrapValidator').isValid()){  
                return ;  
            } 
          var data = {
                weid:weid,
                title:$('input[name=title]').val(),
                description:$('input[name=description]').val()
            }; 
            //console.log(data);
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    data:data,
                    url: ApiUrl + 'cms/advTypes/update',
                    success: function (data) {
                        if (data.code === 200){
                            window.location.replace('advTypes.html');
                        }else {
                           alert(data.message);
                           console.log(data);
                      }
                    },
                    error: function(xhr) {
                         console.log(xhr);
                     }
                });
     });
})
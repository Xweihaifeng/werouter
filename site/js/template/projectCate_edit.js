$(document).ready(function(){
    start();
    var weid=getUrlParam('weid');
    if(isNull(weid)==false){
            //编辑
            $.ajax({
                url: ApiUrl+'project/cate/detail/'+weid,
                type:'GET',
                success:function (data){
                    if(data.code==200){
                        console.log(data.data);
                        $("input[name=weid]").val(data.data.weid);
                        $("input[name=name]").val(data.data.name);
                        $("#img").attr("src",ApiMaterPlatQiniuDomain+data.data.cover);
                        $("select[name=style]").find("option[value='"+data.data.style+"']").attr("selected",true);
                        $("input[name=cover]").val(data.data.cover);
                        $("input[name=ratio]").val(data.data.ratio);
                        $("input[name=sort]").val(data.data.sort);
                    }
                }
            })
    }
    //form表单验证
    $('#formadv').bootstrapValidator({
            excluded:[":disabled"],
　　　　　　message: 'This value is not valid',
            feedbackIcons: {
                　　　　　　　　valid: 'glyphicon glyphicon-ok',
                　　　　　　　　invalid: 'glyphicon glyphicon-remove',
                　　　　　　　　validating: 'glyphicon glyphicon-refresh'
            　　　　　　　　   },
            fields: {
                name: {
                    validators: {
                        notEmpty: {
                            message: '项目分类名称不为空！'
                        }
                    }
                },
                cover:{
                    trigger:"change", //关键配置  
                    validators: {
                        notEmpty: {
                            message: '分类项目封面不能为空！'
                        }
                    }
                },
                style:{
                    validators: {
                        notEmpty: {
                            message: '项目分类类型不能为空！'
                        }
                    }
                },
                ratio:{
                    validators: {
                        regexp:{
                            regexp: /^(100|[1-9]?\d(\.\d\d)?)$|0$/,  
                            message: '必须为100内的数字！'
                        }
                    }
                },
                sort:{
                    validators: {
                        regexp:{
                            regexp: /^[1-9]\d*$/,  
                            message: '必须为100内的数字！'
                        }
                    }
                }
            }
    });
    //提交
    $('.submit').click(function(){
        $('#formadv').data('bootstrapValidator').validate();  
        if(!$('#formadv').data('bootstrapValidator').isValid()){  
            return ;  
        }
        var weid=$("input[name=weid]").val();
            if(isNull(weid)){
                //保存提交
                $.ajax({
                    url: ApiUrl+'project/cate/store',
                    type:'POST',
                    data:$("#formadv").serialize(),
                    success:function (data){
                        if(data.code==200){
                              swal({
                                title: "添加成功!",
                                timer: 2000,
                                showConfirmButton: false
                              });
                              window.location.reload();     
                          }else{
                              swal({
                                title: "添加失败!",
                                timer: 2000,
                                showConfirmButton: false
                              });
                          }
                    }
                })
            }else{
                //修改提交
                $.ajax({
                    url: ApiUrl+'project/cate/update',
                    type:'POST',
                    data:$("#formadv").serialize(),
                    success:function (data){
                        if(data.code==200){
                            swal({
                              title: "修改成功!",
                              timer: 2000,
                              showConfirmButton: false
                            });
                            window.location.reload();
                          }else{
                            swal({
                              title: "修改失败!",
                              timer: 2000,
                              showConfirmButton: false
                            });
                          }
                    }
                })
            }
    });
    var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'thumb', 
          uptoken_url: ApiUrl + 'file/qiniu_token',
          get_new_uptoken: false, 
          domain: ApiMaterPlatQiniuDomain,     
          container: 'look',        
          max_file_size: '100mb',           
          flash_swf_url: 'http://cdn.staticfile.org/plupload/2.1.8/Moxie.swf',  
          max_retries: 3,  
          dragdrop: true,  
          drop_element: 'look',
          chunk_size: '4mb', 
          auto_start: true,
          init: {
             'FilesAdded': function(up, files) {
                  plupload.each(files, function(file) {
                  });
              },
              'BeforeUpload': function(up, file) {
              },
              'UploadProgress': function(up, file) {
              },
              'FileUploaded': function(up, file, info) {
                     var domain = up.getOption('domain');
                     res = JSON.parse(info.response);
                     $("input[name=cover]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img").attr('src', sourceLink);
               },
              'Error': function(up, err, errTip) {
              },
              'UploadComplete': function() {
                    $("input[name=cover]").change();  
                 
              },
              'Key': function(up, file) {
                  var key = "plats/resource/";
                  key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1); 
                  return key;
              }
          }
          
     });
    $(".wenhao").hover(function(){
        $(".wenhao-tishi").show();
    },function(){
        $(".wenhao-tishi").hide();
    });
})


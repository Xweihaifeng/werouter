$(document).ready(function(){
    start();
    
    var weid=getUrlParam('weid');

    if(isNull(weid)==false){
            //编辑
            $.ajax({
                url: ApiUrl+'vote/adv_edit/'+weid,
                type:'GET',
                success:function (data){
                    if(data.code==200){
                        console.log(data.data);
                        $("input[name=weid]").val(data.data.weid);
                        $("input[name=title]").val(data.data.title);
                        $("input[name=vote_id]").val(data.data.vote_id);
                        $("#img").attr("src",ApiMaterPlatQiniuDomain+data.data.image);
                        $("input[name=thumbold]").val(data.data.image);
                        $("input[name=url]").val(data.data.url); 
                        $("input[name=sort]").val(data.data.sort);
                        $("#vote_title").text(data.data.vote_title);
                        $("#vote_title").attr("href",data.data.vote_url); 
                        
                    }
                }
            })
    }
    var vote_id=getUrlParam('vote_id');
    if(isNull(vote_id)==false){
        //添加
        $.ajax({
                url: ApiUrl+'vote/adv_create/'+vote_id,
                type:'GET',
                success:function (data){
                    if(data.code==200){
                        console.log(data);
                        $("input[name=vote_id]").val(data.data.vote_id);
                        $("#vote_title").text(data.data.vote_title);
                        $("#vote_title").attr("href",data.data.vote_url); 
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
                title: {
                    validators: {
                        notEmpty: {
                            message: '广告名称不能为空'
                        }
                    }
                },
                url: {
                    validators: {
                        notEmpty: {
                            message: '广告地址不能为空'
                        },
                        regexp: {
                            regexp: /^(http|https):\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
                            message: '必须是URL形式'
                        }

                    }
                },
                thumbold:{
                    trigger:"change", //关键配置  
                    validators: {
                        notEmpty: {
                            message: '广告图片不能为空'
                        }
                    }
                },
                sort:{
                    regexp: {
                            regexp: /^[0-9]*$/,
                            message: '必须数字类型'
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
                    url: ApiUrl+'vote/adv_store',
                    type:'POST',
                    data:$("#formadv").serialize(),
                    success:function (data){
                        if(data.code==200){
                              swal({
                                title: "添加成功!",
                                timer: 2000,
                                showConfirmButton: false
                              });
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
                    url: ApiUrl+'vote/adv_update',
                    type:'POST',
                    data:$("#formadv").serialize(),
                    success:function (data){
                        if(data.code==200){
                            swal({
                              title: "修改成功!",
                              timer: 2000,
                              showConfirmButton: false
                            });
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
                     $("input[name=thumbold]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img").attr('src', sourceLink);
               },
              'Error': function(up, err, errTip) {
              },
              'UploadComplete': function() {
                    $("input[name=thumbold]").change();  
                 
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


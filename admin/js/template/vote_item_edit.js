var qiniu_uptoken = '';
var saveto ='qiniu';  
var qiniu_upload_domain = 'http://upload.qiniu.com';  
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain; 
CKEDITOR.replace('edit_container',{"extraPlugins":"filebrowser,image,imagepaste,filetools"});
$.ajax({
    url: ApiUrl + 'file/qiniu_token?t=' + Math.random(),
    type: 'get',
    dataType: 'json',
    success: function(data) {
        qiniu_uptoken = data.uptoken;
    },
    error: function(xhr) {
        console.log(xhr);
    }
});
$(document).ready(function(){
    start();
    var weid=getUrlParam('weid');

    if(isNull(weid)==false){
            //编辑
            $.ajax({
                url: ApiUrl+'vote/item_edit/'+weid,  
                type:'GET',
                success:function (data){
                    if(data.code==200){
                        console.log(data.data);
                        $("input[name=weid]").val(data.data.weid);
                        $("input[name=title]").val(data.data.title);
                        $("input[name=vote_id]").val(data.data.vote_id);   
                        $("input[name=thumbold]").val(data.data.cover);
                        $("#img").attr("src", data.data.cover.indexOf('//')!=-1 ?data.data.cover: ApiMaterPlatQiniuDomain+data.data.cover);
                        $("#vote_title").text(data.data.vote_title);
                        $("#vote_title").attr("href",data.data.url);
                        if(isNull(data.data.big_cover)==false){
                            $("input[name=big_old]").val(data.data.big_cover);
                            $("#img1").attr("src",data.data.big_cover.indexOf('//')!=-1 ?data.data.big_cover: ApiMaterPlatQiniuDomain+data.data.big_cover);
                        }
                        $("textarea[name=summary]").val(data.data.summary);
                        $("input[name=sort]").val(data.data.sort);     
                        $("textarea[name=content]").val(data.data.content); 

                    }
                }
            })
    }
    
    var vote_id=getUrlParam('vote_id');
    if(isNull(vote_id)==false){
        //添加
        $.ajax({
                url: ApiUrl+'vote/item_create/'+vote_id,
                type:'GET',
                success:function (data){
                    if(data.code==200){
                        $("input[name=vote_id]").val(data.data.vote_id);   
                        $("#vote_title").text(data.data.vote_title);
                        $("#vote_title").attr("href",data.data.url);
                    }
                }
        })
    }



    //form表单验证
    $('#formitem').bootstrapValidator({
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
                            message: '投票项名称不能为空'
                        }
                    }
                },
                thumbold:{
                    trigger:"change", //关键配置  
                    validators: {
                        notEmpty: {
                            message: '首页封面图不能为空'
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
        $('#formitem').data('bootstrapValidator').validate();  
        if(!$('#formitem').data('bootstrapValidator').isValid()){  
            return ;  
        }
        var weid=$("input[name=weid]").val();
        var data=$("#formitem").serialize();
        var content=CKEDITOR.instances.edit_container.getData();
        var replaceStr = '&';
        data =data +"&"+"content="+content.replace(new RegExp(replaceStr,'gm'),'%26');
        if(isNull(weid)){
            //保存提交
            $.ajax({
                url: ApiUrl+'vote/item_store',
                type:'POST',
                data:data,
                success:function (data){
                    if(data.code==200){
                        swal({
                          title: "添加成功!",
                          timer: 2000,
                          showConfirmButton: false
                        }).then(
                            function () {
                                location.href='vote_item_list.html?vote_id=' + $("input[name=vote_id]").val();
                            },
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    location.href='vote_item_list.html?vote_id=' + $("input[name=vote_id]").val();
                                }
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
                url: ApiUrl+'vote/item_update',
                type:'POST',
                data:data,
                success:function (data){
                    if(data.code==200){
                      swal({
                        title: "修改成功!",
                        timer: 2000,
                        showConfirmButton: false
                      }).then(
                        function () {
                            location.href='vote_item_list.html?vote_id=' + $("input[name=vote_id]").val();
                        },
                        // handling the promise rejection
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                location.href='vote_item_list.html?vote_id=' + $("input[name=vote_id]").val();
                            }
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

    var uploader = Qiniu.uploader({
          
          runtimes: 'html5,flash,html4', 
          browse_button: 'thumb_lazy', 
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
                     $("input[name=big_old]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img1").attr('src', sourceLink);
              },
              'Error': function(up, err, errTip) {
              },
              'UploadComplete': function() {
              },
              'Key': function(up, file) {
                  var key = "plats/resource/";
                  key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1); 
                  return key;
              }
          }
          
     });

    
    
})


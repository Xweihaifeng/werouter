function mhide(){
    $('#message').hide();
    $('#message_fbys').hide();
 }
$(document).ready(function(){
    start();
    var weid='';
    //网站详情获取
    var init = function(){
        $.ajax({
            url: ApiUrl + 'cms/setting/show',
            type: 'get',
            dataType: 'json',
            success: function(data){
                //console.log(data);
                if (data.code === 200){
                    var info = data.data;
                    weid=info.weid;
                    $('input[name=title]').val(info.title);
                    $('textarea[name=description]').val(info.description);
                    $('textarea[name=key_word]').val(info.key_word);
                    $('textarea[name=weibo_show]').val(info.weibo_show);
                    $('input[name=icp]').val(info.icp);
                    $('input[name=favicon]').val(info.favicon);
                    $('input[name=logo]').val(info.logo);
                    $('input[name=background_up]').val(info.background_up);
                    $('input[name=background]').val(info.background);
                  
                    if(info.favicon!=''){$('#img_favicon').attr('src',ApiMaterPlatQiniuDomain+info.favicon);}
                    if(info.logo!=''){$('#img_logo').attr('src',ApiMaterPlatQiniuDomain+info.logo);}
                    if(info.background!=''){$('#img_background').attr('src',ApiMaterPlatQiniuDomain+info.background);}
                    if(info.background_up!=''){$('#img_background_up').attr('src',ApiMaterPlatQiniuDomain+info.background_up);}

                    //发布样式
                    $('input[name=bar1]').val(info.bar1);
                    $('input[name=bar2]').val(info.bar2);
                    $('input[name=bar3]').val(info.bar3);
                    $('input[name=bar4]').val(info.bar4);
                    $('input[name=background_right]').val(info.background_right);
                  
                    if(info.bar1!=''){$('#img_bar1').attr('src',ApiMaterPlatQiniuDomain+info.bar1);}
                    if(info.bar2!=''){$('#img_bar2').attr('src',ApiMaterPlatQiniuDomain+info.bar2);}
                    if(info.bar3!=''){$('#img_bar3').attr('src',ApiMaterPlatQiniuDomain+info.bar3);}
                    if(info.bar4!=''){$('#img_bar4').attr('src',ApiMaterPlatQiniuDomain+info.bar4);}
                    if(info.background_right!=''){$('#img_background_right').attr('src',ApiMaterPlatQiniuDomain+info.background_right);}
                } else {
                    console.log('error: -200');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
};
init();
//基本信息  发布样式
    $('#jbxx').show();
    $('#fbys').hide();
    $('.box-header a').each(function(i){
    $(this).click(function(){
        if($(this).attr('data')==1){
          $('#jbxx').show();
          $('#fbys').hide();
        }else{
          $('#jbxx').hide();
          $('#fbys').show();
        }

     })
});

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
                message:'网站名称标题无效',  
                validators:{  
                    notEmpty:{  
                        message:'网站名称不能为空'  
                    },  
                    StringLength:{  
                        min:2,  
                        max:32,  
                        message:'网站名称长度大于2位并且小于32位'  
                    }
                }  
        }, 
          description :{  
                message:'网站描述无效',  
                validators:{  
                    notEmpty:{  
                        message:'网站描述不能为空'  
                    },  
                    StringLength:{  
                        min:2,  
                        max:32,  
                        message:'网站描述长度大于2位并且小于32位'  
                    }
                }  
        }, 
          key_word :{  
                message:'关键词无效',  
                validators:{  
                    notEmpty:{  
                        message:'关键词不能为空'  
                    },  
                    StringLength:{  
                        min:2,  
                        max:32,  
                        message:'关键词长度大于2位并且小于32位'  
                    }
                }  
        }, 
     }
     });
        //ajax提交form
       $("#updateSet").click(function () {
       	    $('#form').data('bootstrapValidator').validate();  
            if(!$('#form').data('bootstrapValidator').isValid()){  
                return ;  
            }
            var data = {
	            title:$('input[name=title]').val(),
	            description:$('textarea[name=description]').val(),
	            key_word:$('textarea[name=key_word]').val(),
	            icp:$('input[name=icp]').val(),
	            weibo_show:$('textarea[name=weibo_show]').val(),
	            favicon:$('input[name=favicon]').val(),
	            logo:$('input[name=logo]').val(),
              background_up:$('input[name=background_up]').val(),
	            background:$('input[name=background]').val(),
            };  
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    data:data,
                    url: ApiUrl + 'cms/setting/'+weid,
                    success: function (data) {
                    	if (data.code === 200){
                          $('#message').show();
                          setTimeout("mhide()",3000);
                    	}else {
                    		//alert(data.message); 
                           console.log('error: -200');
                      }
                    },
                    error: function(xhr) {
                         console.log(xhr);
                     }
                });
        });
       //发布样式
            $("#updateFbys").click(function () {
            var data = {
              bar1:$('input[name=bar1]').val(),
              bar2:$('input[name=bar2]').val(),
              bar3:$('input[name=bar3]').val(),
              bar4:$('input[name=bar4]').val(),
              background_right:$('input[name=background_right]').val(),
            };  
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    data:data,
                    url: ApiUrl + 'cms/setting/'+weid,
                    success: function (data) {
                      if (data.code === 200){
                          $('#message_fbys').show();
                          setTimeout("mhide()",3000);
                      }else {
                        //alert(data.message); 
                           console.log('error: -200');
                      }
                    },
                    error: function(xhr) {
                         console.log(xhr);
                     }
                });
        });
  var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'faviconfile', 
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
                     $("input[name=favicon]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_favicon").attr('src', sourceLink);
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

         var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'logofile', 
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
                     console.log(res);
                     $("input[name=logo]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_logo").attr('src', sourceLink);
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
     var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'background_upfile', 
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
                     console.log(res);
                     $("input[name=background_up]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_background_up").attr('src', sourceLink);
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

     var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'backgroundfile', 
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
                     console.log(res);
                     $("input[name=background]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_background").attr('src', sourceLink);
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
     //发布样式
          var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'bar1file', 
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
                     $("input[name=bar1]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_bar1").attr('src', sourceLink);
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
    var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'bar2file', 
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
                     $("input[name=bar2]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_bar2").attr('src', sourceLink);
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
    var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'bar3file', 
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
                     $("input[name=bar3]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_bar3").attr('src', sourceLink);
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
        var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'bar4file', 
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
                     $("input[name=bar4]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_bar4").attr('src', sourceLink);
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
         var uploader = Qiniu.uploader({
          runtimes: 'html5,flash,html4', 
          browse_button: 'background_rightfile', 
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
                     $("input[name=background_right]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_background_right").attr('src', sourceLink);
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
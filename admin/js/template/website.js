function mhide(){
    $('#message').hide();
    $('#message_fbys').hide();
    $('#message_bksz').hide();
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
                    $('textarea[name=copyright]').val(info.copyright);
                    $('input[name=icp]').val(info.icp);
                    $('input[name=favicon]').val(info.favicon);
                    $('input[name=logo]').val(info.logo);
                    $('input[name=wap_logo]').val(info.logo);
                    $('input[name=background_up]').val(info.background_up);
                    $('input[name=background]').val(info.background);
                  
                    if(info.favicon!='' && info.favicon!=null){$('#img_favicon').attr('src',ApiMaterPlatQiniuDomain+info.favicon);}
                    if(info.logo!='' && info.logo!=null){$('#img_logo').attr('src',ApiMaterPlatQiniuDomain+info.logo);}
                    if(info.wap_logo!='' && info.wap_logo!=null){$('#img_wap_logo').attr('src',ApiMaterPlatQiniuDomain+info.wap_logo);}
                    if(info.background!='' && info.background!=null){$('#img_background').attr('src',ApiMaterPlatQiniuDomain+info.background);}
                    if(info.background_up!='' && info.background_up!=null){$('#img_background_up').attr('src',ApiMaterPlatQiniuDomain+info.background_up);}

                    //发布样式
                    $('input[name=bar1]').val(info.bar1);
                    $('input[name=bar2]').val(info.bar2);
                    $('input[name=bar3]').val(info.bar3);
                    $('input[name=bar4]').val(info.bar4);
                    $('input[name=background_right]').val(info.background_right);
                  
                    if(info.bar1!='' && info.bar1!=null){$('#img_bar1').attr('src',ApiMaterPlatQiniuDomain+info.bar1);}
                    if(info.bar2!='' && info.bar2!=null){$('#img_bar2').attr('src',ApiMaterPlatQiniuDomain+info.bar2);}
                    if(info.bar3!='' && info.bar3!=null){$('#img_bar3').attr('src',ApiMaterPlatQiniuDomain+info.bar3);}
                    if(info.bar4!='' && info.bar4!=null){$('#img_bar4').attr('src',ApiMaterPlatQiniuDomain+info.bar4);}
                    if(info.background_right!='' && info.background_right!=null){$('#img_background_right').attr('src',ApiMaterPlatQiniuDomain+info.background_right);}

                    var jsond=$.parseJSON(info.block);
                    $("input[name=xw_radio][value=" + jsond.xw.show +  "]").attr('checked', true);
                    $("select[name=xw_select] option[value='"+jsond.xw.sort+"']").attr("selected", "selected"); 

                    $("input[name=zz_radio][value=" + jsond.zz.show +  "]").attr('checked', true);
                    $("select[name=zz_select] option[value='"+jsond.zz.sort+"']").attr("selected", "selected"); 

                    $("input[name=hz_radio][value=" + jsond.hz.show +  "]").attr('checked', true);
                     $("select[name=hz_select] option[value='"+jsond.hz.sort+"']").attr("selected", "selected"); 

                    $("input[name=gx_radio][value=" + jsond.gx.show +  "]").attr('checked', true);
                     $("select[name=gx_select] option[value='"+jsond.gx.sort+"']").attr("selected", "selected"); 
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
    $('#bksz').hide();
    $('.box-header a').each(function(i){
    $(this).click(function(){
        if($(this).attr('data')==1){
          $('#jbxx').show();
          $('#fbys').hide();
          $('#bksz').hide();
        }else if($(this).attr('data')==2){
          $('#jbxx').hide();
          $('#fbys').show();
          $('#bksz').hide();
        }else{
          $('#bksz').show();
          $('#jbxx').hide();
          $('#fbys').hide();
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
              copyright:CKEDITOR.instances.editor1.getData(),
	            favicon:$('input[name=favicon]').val(),
	            logo:$('input[name=logo]').val(),
              wap_logo:$('input[name=wap_logo]').val(),
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
                           swal({text: '保存成功',type: 'success', timer: 20000});
                          // $('#message').show();
                          // setTimeout("mhide()",3000);
                    	}else {
                    		//alert(data.message); 
                           swal({text: '保存失败',type: 'error', timer: 20000});
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
                         swal({text: '保存成功',type: 'success', timer: 20000});
                          // $('#message_fbys').show();
                          // setTimeout("mhide()",3000);
                      }else {
                        //alert(data.message); 
                        swal({text: '保存失败',type: 'error', timer: 20000});
                        console.log('error: -200');
                      }
                    },
                    error: function(xhr) {
                         console.log(xhr);
                     }
                });
        });
       //板块设置
       $("#updateBksz").click(function () {
            var xw='"xw":{"show":'+$("input[name='xw_radio']:checked").val()+',"sort":'+$("select[name=xw_select]").val()+'},';
            var zz='"zz":{"show":'+$("input[name='zz_radio']:checked").val()+',"sort":'+$("select[name=zz_select]").val()+'},';
            var hz='"hz":{"show":'+$("input[name='hz_radio']:checked").val()+',"sort":'+$("select[name=hz_select]").val()+'},';
            var gx='"gx":{"show":'+$("input[name='gx_radio']:checked").val()+',"sort":'+$("select[name=gx_select]").val()+'}';
            var jsonData='{'+xw+zz+hz+gx+'}';
            //alert(jsonData);
            var data = {
              block:jsonData,
            };  
                $.ajax({
                    type: "POST",

                    dataType: "json",
                    data:data,
                    url: ApiUrl + 'cms/setting/'+weid,
                    success: function (data) {
                      if (data.code === 200){
                           swal({text: '保存成功',type: 'success', timer: 20000});
                          // $('#message_bksz').show();
                          // setTimeout("mhide()",3000);
                      }else {
                        //alert(data.message); 
                           swal({text: '保存失败',type: 'error', timer: 20000});
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
          browse_button: 'wap_logofile', 
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
                     $("input[name=wap_logo]").val(res.key);
                     var sourceLink = domain + res.key;
                     $("#img_wap_logo").attr('src', sourceLink);
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
     function updateBar(data){
                    $.ajax({
                    type: "POST",
                    dataType: "json",
                    data:data,
                    url: ApiUrl + 'cms/setting/'+weid,
                    success: function (data) {
                      if (data.code === 200){
                           swal({text: '保存成功',type: 'success', timer: 20000});
                      }else {
                           swal({text: '保存失败',type: 'error', timer: 20000});
                           console.log('error: -200');
                      }
                    },
                    error: function(xhr) {
                         console.log(xhr);
                     }
                });
    }
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
                     var data = {
                      bar1:res.key,
                     };  
                     updateBar(data);
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

                      var data = {
                       bar2:res.key,
                      };  
                     updateBar(data);
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

                     var data = {
                       bar3:res.key,
                      };  
                     updateBar(data);
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

                     var data = {
                       bar4:res.key,
                      };  
                     updateBar(data);
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

                     var data = {
                       background_right:res.key,
                      };  
                     updateBar(data);
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
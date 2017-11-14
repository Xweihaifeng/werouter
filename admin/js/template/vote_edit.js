var qiniu_uptoken = '';
var saveto ='qiniu';  
var qiniu_upload_domain = 'http://upload.qiniu.com';  
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain; 
CKEDITOR.replace('edit_container',{"extraPlugins":"filebrowser,image,imagepaste,filetools"});
CKEDITOR.replace('rule_editor');

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
    var weid=getUrlParam('vote_id');
    if(isNull(weid)==false){
            //编辑
            $.ajax({
                url: ApiUrl+'vote/vote_edit/'+weid,
                type:'GET',
                success:function (data){
                    if(data.code==200){
                        console.log(data.data);
                        $("input[name=weid]").val(data.data.weid);
                        $("input[name=title]").val(data.data.title);
                        $("textarea[name=summary]").val(data.data.summary);
                        $("input[name=end_time]").val(data.data.end_time);     
                        $("input[name=begin_time]").val(data.data.begin_time);
                        $("select[name=only_wechat]").val(data.data.only_wechat);    
                        $("select[name=time_limit]").val(data.data.time_limit);
                        $("input[name=num_limit]").val(data.data.num_limit);
                        $("textarea[name=remark]").val(data.data.remark);     
                        $("textarea[name=statistic]").val(data.data.statistic);
                        $("textarea[name=content]").val(data.data.content);
                        $("input[name=measure]").val(data.data.measure);
                        $("input[name=appellation]").val(data.data.appellation);
                        $("input[name=support_view_type][value=" + data.data.support_view_type +  "]").attr('checked', true);
                        $("textarea[name=share_title_index]").val(data.data.share_title_index);
                        $("textarea[name=share_title_detail]").val(data.data.share_title_detail);
                        if(isNull(data.data.cover)==false){
                            $("input[name=thumbold]").val(data.data.cover);   
                            $("#img").attr('src',ApiMaterPlatQiniuDomain+data.data.cover);
                        }
                        if(isNull(data.data.cover_default)==false){
                            $("input[name=thumbold_big]").val(data.data.cover_default);
                            $("#img1").attr('src',ApiMaterPlatQiniuDomain+data.data.cover_default);
                        }
                        for (var i=0, ien=data.data.cate_list.length ; i<ien ; i++ ) {
                            if(data.data.cate_list[i].weid==data.data.cate_id){
                                //选中
                                $("select[name=cate_id]").append("<option value='"+data.data.cate_list[i].weid+"' selected>"+data.data.cate_list[i].title+"</option>"); 
                            }else{
                                $("select[name=cate_id]").append("<option value='"+data.data.cate_list[i].weid+"'>"+data.data.cate_list[i].title+"</option>");  
                            }
                        }
                        if (data.data.support_enabled == 1) {
                            $('.support-control').show();
                        }
                    }
                }
            })
    }else{
        //添加
        $.ajax({
                url: ApiUrl+'vote/vote_create',
                type:'GET',
                success:function (data){
                    if(data.code==200){
                        console.log(data);
                        $("input[name=end_time]").val(data.data.end_time);     
                        $("input[name=begin_time]").val(data.data.begin_time);     
                        $("select[name=only_wechat]").val(data.data.only_wechat);    
                        $("select[name=time_limit]").val(data.data.time_limit);
                        $("input[name=num_limit]").val(data.data.num_limit);
                        $("textarea[name=share_title_index]").val('我投了{{number}}号"{{name}}"{{showname}}一票，"{{votename}}"投票火热进行中，快来围观，参与投票吧！');
                        $("textarea[name=share_title_detail]").val('我为{{number}}号"{{name}}"{{showname}}带盐，欢迎各位朋友前来围观，请支持TA，投上您宝贵的一票！');
                        for (var i=0, ien=data.data.cate_list.length ; i<ien ; i++ ) {
                            $("select[name=cate_id]").append("<option value='"+data.data.cate_list[i].weid+"'>"+data.data.cate_list[i].title+"</option>");  
                        } 
                    }
                }
        })
    }
    
    //form表单验证
    $('#formvote').bootstrapValidator({
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
                            message: '投票名称不能为空'
                        }
                    }
                },
              measure :{  
                validators:{  
                    notEmpty:{  
                        message:'量词不能为空'  
                    },  
                    stringLength:{  
                        max:1,  
                        message:'量词最多1个字'  
                    }
                }  
            },
             appellation :{  
                validators:{  
                    notEmpty:{  
                        message:'称谓不能为空'  
                    },  
                    stringLength:{  
                        max:3,  
                        message:'称谓最多3个字'  
                    }
                }  
            },
                thumbold:{
                    trigger:"change", //关键配置  
                    validators: {
                        notEmpty: {
                            message: '投票封面图不能为空'
                        }
                    }
                }
            }
    });

    

    //提交
    $('.submit').click(function(){
        $('#formvote').data('bootstrapValidator').validate();  
        if(!$('#formvote').data('bootstrapValidator').isValid()){  
            return ;  
        }
        var weid=$("input[name=weid]").val();
        var data=$("#formvote").serialize();
        var content=CKEDITOR.instances.edit_container.getData();
        var remark=CKEDITOR.instances.rule_editor.getData();
        var replaceStr = '&';
        data =data +"&"+"content="+ content.replace(new RegExp(replaceStr,'gm'),'%26');
        data =data +"&"+"remark="+ remark.replace(new RegExp(replaceStr,'gm'),'%26');
        if(isNull(weid)){
            //保存提交
           $.ajax({
                url: ApiUrl+'vote/vote_store',
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
                                location.href='/admin/votes.html';
                            },
                            // handling the promise rejection
                            function (dismiss) {
                                if (dismiss === 'timer') {
                                    location.href='/admin/votes.html';
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
                url: ApiUrl+'vote/vote_update',
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
                            location.href='/admin/votes.html';
                        },
                        // handling the promise rejection
                        function (dismiss) {
                            if (dismiss === 'timer') {
                                location.href='/admin/votes.html';
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
                     $("input[name=thumbold_big]").val(res.key);
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

    // $('.datepicker').datetimepicker({
    //         autoclose: true,
    //         format: 'yyyy-mm-dd hh:ii:ss',
    //         showMeridian:true
    // });

    

    $(".wenhao").hover(function(){
        $(".wenhao-tishi").show();
    },function(){
        $(".wenhao-tishi").hide();
    });
    $(".wenhao1").hover(function(){
        $(".wenhao-tishi1").show();
    },function(){
        $(".wenhao-tishi1").hide();
    });
    $(".wenhao2").hover(function(){
        $(".wenhao-tishi2").show();
    },function(){
        $(".wenhao-tishi2").hide();
    });

})


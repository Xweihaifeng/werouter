



//                 var send_span = 2000;
//                 var __HASH_KEY__ = "kYhzwZyFsaZpuqAjhSVneizmpTtmfeRrsnjLINyoaEJGKAEPYE";
//                 /////////////////
//             (function(){
//             if(!($(".zc_phone_drop").children().length)){
//                 $(".zc_phone").remove();
//             }
//             var iWinWidth = $(window).width();  // 获取当前屏幕分辨率
//             if(iWinWidth <= 1280){               // 小于等于1280更改css样式路径
//                 $("#screenCss").attr("href","https://tanli.wezchina.com/app/Tpl/wezchina/css/common_css/less1280.css");
//             }
//         })();


//     function get_file_more_fun(name){
//             $("#"+name).ui_upload({multi:false,
//             FileUploaded:function(ajaxobj){
//                 if($("#image_box .image_item").length>=8) {
//                     $.showErr("最多只能上传8张图片");
//                 }
//                 else if(ajaxobj.error==1) {
//                     $.showErr(ajaxobj.info);
//                 }
//                 else {
//                     $("#image_box").append(
//                         '<div class="image_item f_l">'+
//                             '<div class="remove_image bg_red"><i class="icon iconfont">&#xe61f;</i></div>'+
//                             '<img src="'+ajaxobj.url+'" width=80 height=80 class="b_radius6" />'+
//                             '<input type="hidden" name="image_more[]" value="'+ajaxobj.public_url+'"  />'+
//                         '</div>'
//                     );
//                     bind_del_image(); // 删除已上传的图片
//                     hide_imgupload(); // 上传4张图片后，隐藏上传图片按钮
//                 }
//             },Error:function(error) {
//                 $.showErr(error.message);
//             }
//         });
//     }


//     $(function(){
//         // get_file_fun("image_file");
//         // get_file_fun("update_log_icon_bj",1);
//         // show_tip();
//         bind_del_image();
//         // get_file_more_fun("deal_images_file");
//     });

//     // 删除已上传的图片
//     function bind_del_image() {
//         $(".image_item").find(".remove_image").on("click",function() {
//             del_image($(this));
//             hide_imgupload();
//         });
//     }
//     // 上传8张图片后，隐藏上传图片按钮
//     function hide_imgupload() {
//         var pic_box_num = $("#image_box").find(".image_item").length;
//         var $imgupload_box = $(".imgupload_box");
//         pic_box_num == 8 ? $imgupload_box.hide() : $imgupload_box.show();
//     }
//     function del_image(o) {
//         $(o).parent().remove();
//     }

//     $("#is_private_btn").on("click", function(){
//         if($("#is_private_btn").hasClass("clcky-check")){
//             $("input[name='is_private']").val(0);
//             $("#is_private_btn").removeClass("clcky-check");
//         }else{
//             $("input[name='is_private']").val(1);
//             $("#is_private_btn").addClass("clcky-check");
//         }
//     });

// //发布活动
// //var dataName=localStorage.getItem('data.name');

// //console.log(dataName)

//         // $.ajax({
//         //     url: PROJECT_CATE_DETAIL,
//         //     type: 'post',
//         //     headers: {
//         //       'Token': docCookies.getItem("token")
//         //     },
//         //     success:function(data){
//         //         if (data.code == 200){
//         //             var list = data.data.list;

//         //             list.map(x => {
//         //                 $(".choose_type").append(projectCateTemplate(x));
//         //             })
//         //             //
//         //             ITEMBOXCLICK();
//         //         } else {
//         //             layer.msg(data.message, {
//         //                 time: 1500
//         //             });
//         //         }

//         //     }

//         // });


// // $('#pub_project').bind("click",function(){

// //       var cate_id=localStorage.getItem('project_cate_weid');
// //       console.log(cate_id);
// //       var title=$('#pj_title').val();
// //       var summary=$('#intro').val();
// //       var content = CKEDITOR.instances.editor1.getData();
// //       var date_end=$('#end_time').val();
// //       var amount=$('#chou_pub').val();
// //       var cover=$('#pj_cover').val();


// //      var sendData = {
// //                 // cate_id：cate_id,
// //                 title: title,
// //                 summary: summary,
// //                 content:content,
// //                 date_end:date_end,
// //                 amount:amount,
// //                 cover:cover,
// //                 images:images,
// //                 ratio:ratio
// //             }

// // })


// })
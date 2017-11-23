 /**
  * Created by Hongguang on 2017/8/6.
  *
  *
  *
  *
  */

 //列表折叠
 sessionStorage.listname = 'we-active';
 ///////////////////////吐丝层start/////////////////////////////////////
 var tusitemp = "";

 function mess_tusi(strs) {
     //清除事件
     clearTimeout(tusitemp);
     $("#mess_tusi").remove();
     //创建吐丝层并写入内容
     if (!$("#mess_tusi").attr("id")) { //吐丝层不存在创建
         $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>" + strs + "</span></div>"); //写入内容
     } else {
         $("#mess_tusi").html(strs); //写入内容
     }

     //定义吐丝层位置
     var left = (1200 - $("#mess_tusi").width()) / 2 + 70; //居中
     var top = $(window).height() * 0.25;
     $("#mess_tusi").css({ "left": left + "px", "top": top + "px" });

     //显示吐丝层
     $("#mess_tusi").css("display", '');

     //2秒后关闭
     tusitemp = setTimeout(function() {
         $("#mess_tusi").remove();
         $("#mess_tusi").html("");
     }, 2000);
     return false;
 }

 // 吐丝层end////////////////////////////////////


 // 删除嘉宾
 var guestdel = function(obj) {
         console.log($(obj).closest(".J_ActivityGuest"));
         $(obj).closest(".J_ActivityGuest").remove();
     }
     //编辑嘉宾
 var guestedit = function(obj) {
         $(".add_guest").click();
         var name = $(obj).closest(".J_ActivityGuest").find(".name").text();
         var company = $(obj).closest(".J_ActivityGuest").find(".company").text();
         var position = $(obj).closest(".J_ActivityGuest").find(".position").text();
         var cover = $(obj).closest(".J_ActivityGuest").find(".avatar1 img").attr('src');
         var thumb_avatar1 = $(obj).closest(".J_ActivityGuest").find(".thumb_avatar1").val();
         $("#J_GuestName").val(name);
         $("#J_GuestCompany").val(company);
         $("#J_GuestPosition").val(position);
         $("#img1").attr('src', cover);

         var gusestid = $(obj).closest(".J_ActivityGuest").data("result");
         $("#J_GuestId").val(gusestid);
         $("#J_GuestAvatar").val(thumb_avatar1)
         $("#J_BtnSaveGuest").data("id", 2);
     }
     //删除主办方-编辑活动时
 var sponordel = function(obj) {
     $(obj).closest(".tag").remove();
 }



 $(function() {
     //编辑器设置
     CKEDITOR.replace('editor1', { "extraPlugins": "filebrowser,image,imagepaste,filetools" });

 })
 var qiniu_uptoken = '';
 var saveto = 'qiniu';
 //var qiniu_upload_domain = 'http://upload.qiniu.com';
 var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
 var __init = function() {
     $.ajax({
         url: QINIU_UPTOKEN_URL,
         type: 'get',
         dataType: 'json',
         success: function(data) {
             qiniu_uptoken = data.uptoken;
         },
         error: function(xhr) {
             console.log(xhr);
         }
     });
 }

 //const ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';

 var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
 console.log('logo:', favicon);
 $('#favicon').attr('href', favicon);



 var uploader = Qiniu.uploader({
     runtimes: 'html5,flash,html4',
     browse_button: 'pickfiles',
     uptoken_url: QINIU_UPTOKEN_URL,
     get_new_uptoken: false,
     domain: ApiMaterPlatQiniuDomain,
     container: 'look',
     max_file_size: '100mb',
     flash_swf_url: '../../common/js/plupload/Moxie.swf',
     max_retries: 3,
     dragdrop: true,
     drop_element: 'look',
     chunk_size: '4mb',
     auto_start: true,
     init: {
         'FilesAdded': function(up, files) {
             /*plupload.each(files, function(file) {
             });*/
         },
         'BeforeUpload': function(up, file) {},
         'UploadProgress': function(up, file) {},
         'FileUploaded': function(up, file, info) {
             var domain = up.getOption('domain');
             res = JSON.parse(info.response);

             var path = res.key;

             var sourceLink = domain + res.key;
             $("#img").attr('src', sourceLink);
             $("input[name=thumb_image]").val(res.key);
         },
         'Error': function(up, err, errTip) {},
         'UploadComplete': function() {},
         'Key': function(up, file) {
             var key = "pages/activity/";
             key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
             return key;
         }
     }
 });


 $(function() {

     __init();


     /* //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
	    var routerList = ['home', 'login', 'article','project','shopping','active'];

	    var isMember = function(routerList, route){
	        return routerList.filter(x => x === route);
	    }

	    var home = function(){
	        window.location.href = '/';
	    }

	    var login = function(){
	        if (!isLogin) {
	            showLogin = true;
	            $("#modal").show();
	            $(".show-login").css({
	                "margin-left": width,
	                "margin-top": height
	            });
	            $(".show-login").fadeIn(300);
	            $("body").css("overflow", "hidden");
	        } else {
	            window.location.href = "/user";
	        }
	    }

	    var article = function(){
	        showLogin = false;
	        window.location.href = domain +"/article";
	    }
        var project = function(){
            showLogin = false;
            window.location.href = domain +"/project";
        }
        var active = function(){
            showLogin = false;
            window.location.href =  domain +"/activity";
        }
        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

	    if (isMember(routerList, route) != ""){
	        eval(route)();
	    }
	}

    $("#home, #login, #article,#project,#active").click(function(){
        var id = $(this).attr("id");
        router(id);
    })
*/
     var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
     console.log('logo:', logo);
     $('#home img').attr('src', logo);

     var login = function() {
         window.location.href = "/login";
     }


     var domain;
     var hasDomain = function(weid) {
         $.ajax({
             url: PAGES_PAGE_GETDETAILBYUSER + weid,
             type: 'GET',
             headers: {
                 'Token': localStorage.getItem('token')
             },
             success: function(data) {
                 if (data.code == 401) {
                     // domain = '/index';
                     localStorage.removeItem('token')
                         // window.location.href = '/login'
                 }
                 if (data.code == 200) {
                     console.log(data);
                     if (data.data == null) {
                         //没有个性域名
                         domain = '/index';
                     } else {
                         //存在个性域名
                         domain = "/" + data.data.domain;
                     }

                 } else {
                     layer.msg(data.message, {
                         time: 1500
                     });
                 }
             },
             error: function(xhr) {
                 console.log(xhr);
             }
         })
     }

     var weid = localStorage.getItem('weid');
     hasDomain(weid);



     var uploader1 = Qiniu.uploader({
         runtimes: 'html5,flash,html4',
         browse_button: 'pickfiles1',
         uptoken_url: QINIU_UPTOKEN_URL,
         get_new_uptoken: false,
         domain: qiniu_bucket_domain,
         container: 'look1',
         max_file_size: '100mb',
         flash_swf_url: '../../common/js/plupload/Moxie.swf',
         max_retries: 3,
         dragdrop: true,
         drop_element: 'look1',
         chunk_size: '4mb',
         auto_start: true,
         init: {
             'FilesAdded': function(up, files) {
                 /*  plupload.each(files, function(file) {
                   });*/

             },
             'BeforeUpload': function(up, file) {

             },
             'UploadProgress': function(up, file) {

             },
             'FileUploaded': function(up, file, info) {


                 var domain = up.getOption('domain');
                 res = JSON.parse(info.response);
                 $("input[name=thumb_image1]").val(res.key);
                 var sourceLink = domain + res.key;
                 $("#img1").attr('src', sourceLink);
             },
             'Error': function(up, err, errTip) {},
             'UploadComplete': function() {},
             'Key': function(up, file) {
                 var key = "pages/activity/";
                 key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                 return key;
             }
         }
     });

     // 是否为隐私活动
     $("#J_ActivityProperty").bind("click", function() {
         // $(this).attr("checked","checked");
         console.log($('#J_ActivityProperty').get(0).checked);
     })

     $(".select-control-time").bind("change", function() {
         var selectitem = $(this).attr("id");
         var beginTime = $("#J_ActivityStartTime").val();
         var endTime = $("#J_ActivityOverTime").val();
         var entryTime = $("#J_ActivityEntryOverTime").val();

         var idname = "#" + $(this).attr("id");
         $(idname + ' option').removeAttr("selected");

         if ($(this).attr("id") == "J_ActivityOverTime") {
             // $(idname+' option').removeAttr("selected");
             if (beginTime >= endTime) {
                 mess_tusi("结束时间不能小于开始时间");
                 $(idname + ' [value="' + beginTime + '"]').attr("selected", "selected");

             }
         } else if ($(this).attr("id") == "J_ActivityEntryOverTime") {
             // $('#J_ActivityEntryOverTime option').removeAttr("selected");
             if (entryTime >= beginTime) {
                 mess_tusi("截止时间不能大于开始时间");
                 $('#J_ActivityEntryOverTime [value="' + beginTime + '"]').attr("selected", "selected");


             }
         } else if ($(this).attr("id") == "J_ActivityStartTime") {
             // $(idname+' option').removeAttr("selected");
             if (beginTime >= endTime) {
                 mess_tusi("结束时间不能小于开始时间");
                 $(idname + ' [value="' + endTime + '"]').attr("selected", "selected");

             }
             if (entryTime >= beginTime) {
                 mess_tusi("截止时间不能大于开始时间");
                 $('#J_ActivityEntryOverTime [value="' + entryTime + '"]').attr("selected", "selected");


             }
         }

     })

     // 1.发布活动保存/草稿
     $(".btn-activity").bind("click", function() {

         var cover = $("#J_ActivityPoster").val();
         var title = $("#J_ActivityTitle").val();
         var area_id = $("#J_ActivityCityId").val();
         var area_name = $("#J_ActivityCity").val();
         var address = $("#J_ActivityAddr").val();
         var begain_time = $("#J_ActivityStartDate").val() + ' ' + $("#J_ActivityStartTime").val();
         var end_time = $("#J_ActivityOverDate").val() + ' ' + $("#J_ActivityOverTime").val();
         var enroll_deadline = $("#J_ActivityEntryOverDate").val() + ' ' + $("#J_ActivityEntryOverTime").val();
         var enroll_limit = $("#J_ActivityLimit").val();
         var Sponsor = [];
         $(".form-group-sponors .tag").each(function(index) {
             Sponsor[index] = $(this).text();
         })
         Sponsor = Sponsor.join(",");
         var content = CKEDITOR.instances.editor1.getData();

         var type = $("input[name=type]:checked").val();
         var price = $("#J_ActivityPrice").val();
         var is_private = $('#J_ActivityProperty').get(0).checked ? 2 : 1;
         if (!$("#J_ActivityProtocal").get(0).checked) {
             mess_tusi("请选择阅读并同意");
             return;
         }
         if (cover == '') {
             mess_tusi('请选择封面');
             return;
         }

         if (title == '') {
             mess_tusi('请输入标题');
             return;
         } else if (title.length < 5) {
             mess_tusi('标题字数不可小于5个');
             return;
         }

         if (!content) {
             mess_tusi('请输入详情');
             return;
         }

         if (area_id == '') {
             mess_tusi('请选择城市');
             return;
         }
         if (address == '') {
             mess_tusi('请输入地址');
             return;
         }
         if ($("#J_ActivityStartDate").val() == '') {
             mess_tusi('请选择开始时间');
             return;
         }
         if ($("#J_ActivityOverDate").val() == '') {
             mess_tusi('请选择结束时间');
             return;
         }
         if ($("#J_ActivityEntryOverDate").val() == '') {
             mess_tusi('请选择截至时间');
             return;
         }
         if (Sponsor.length < 1) {
             mess_tusi('请输入主办方');
             return;
         }
         var btnstatus = $(this).data('status');
         var status = "";
         if (btnstatus == 0) {
             // 发布
             status = 2;
         } else if (btnstatus == 2) {
             // 存为草稿
             status = 1;
         }
         var sendData = {
             title: title,
             cover: cover,
             area_id: area_id,
             area_name: area_name,
             address: address,
             begain_time: begain_time,
             end_time: end_time,
             enroll_deadline: enroll_deadline,
             enroll_limit: enroll_limit,
             Sponsor: Sponsor,
             content: content,
             type: type,
             price: price
             status: status,
             is_private: is_private
         }
         console.log(sendData);
         console.log($(this).data("id"));
         // return;
         // 判断是编辑还是发布
         if ($(this).data("id") == 1) {
             sendData.weid = id;
             // 编辑
             $.ajax({
                 url: ACTIVITY_UPDATE,
                 type: 'post',
                 data: sendData,
                 headers: {
                     'Token': localStorage.getItem('token')
                 },
                 success: function(data) {
                     console.log(data);
                     if (data.code == 200) {
                         if ($(".J_ActivityGuest").length > 0) {
                             // 修改嘉宾
                             saveGuest(id, btnstatus);

                         } else {
                             mess_tusi("活动编辑成功");
                             window.location = "/user/admin/activity/list";
                         }


                     } else {
                         mess_tusi(data.message);
                     }
                 },
                 error: function(xhr) {
                     console.log(xhr);
                 }
             })
         } else {
             // 发布
             $.ajax({
                 url: ACTIVITY_STORE,
                 type: 'post',
                 data: sendData,
                 headers: {
                     'Token': localStorage.getItem('token')
                 },
                 success: function(data) {
                     console.log(data);
                     if (data.code == 200) {
                         // if(btnstatus==2){
                         // mess_tusi("活动保存成功");
                         // 保存嘉宾
                         console.log($(".J_ActivityGuest").length);
                         if ($(".J_ActivityGuest").length > 0) {
                             saveGuest(data.data, btnstatus);

                         } else {
                             mess_tusi("活动发布成功");
                             // location.reload();
                             window.location = "/user/admin/activity/list";

                         }

                         // }else{
                         // mess_tusi("活动发布成功");
                         //
                         // }
                         // window.location.href = "/user/admin/wemall/goods/add";
                         // location.reload();
                     } else {
                         mess_tusi(data.message);
                     }
                 },
                 error: function(xhr) {
                     console.log(xhr);
                 }
             })
         }




     })

     //保存嘉宾
     var flag = 0;
     var saveGuest = function(activityid, btnstatus) {
         $(".J_ActivityGuest").each(function(index) {
             var name = $(this).find(".name").text();
             var avatar = $(this).find(".thumb_avatar1").val();
             var position = $(this).find(".position").text();
             var company = $(this).find(".company").text();
             var guid = $(this).data("id");
             console.log(guid, name, avatar, position, company);

             if (guid != 0) {
                 // 修改嘉宾
                 $.ajax({
                     url: ACTIVITY_GUEST_UPDATE,
                     type: 'post',
                     data: { weid: guid, name: name, avatar: avatar, position: position, company: company },
                     headers: {
                         'Token': localStorage.getItem('token')
                     },
                     success: function(data) {
                         console.log(data);
                         if (data.code == 200) {
                             flag++;
                             console.log("flag:", flag);
                             console.log("index:", index);
                             if (flag >= index) {
                                 if (btnstatus == 2) {
                                     mess_tusi("活动保存成功");


                                 } else {
                                     mess_tusi("活动修改成功");

                                 }
                                 //location.reload();

                                 window.location = "/user/admin/activity/list";
                             }

                         } else {
                             mess_tusi(data.message);
                         }
                     },
                     error: function(xhr) {
                         console.log(xhr);
                     }
                 })
             } else {
                 // 保存嘉宾
                 $.ajax({
                     url: ACTIVITY_GUEST_STORE,
                     type: 'post',
                     data: { activity_id: activityid, name: name, avatar: avatar, position: position, company: company },
                     headers: {
                         'Token': localStorage.getItem('token')
                     },
                     success: function(data) {
                         console.log(data);
                         if (data.code == 200) {
                             flag++;
                             console.log("flag:", flag);
                             console.log("index:", index);
                             if (flag >= index) {
                                 if (btnstatus == 2) {
                                     mess_tusi("活动保存成功");


                                 } else {
                                     mess_tusi("活动发布成功");

                                 }
                                 // location.reload();
                                 window.location = "/user/admin/activity/list";


                             }

                         } else {
                             mess_tusi(data.message);
                         }
                     },
                     error: function(xhr) {
                         console.log(xhr);
                     }
                 })
             }

         })
     }


     // 2.添加/修改嘉宾
     var dataarr = [];
     var i = 0;
     $("#J_BtnSaveGuest").bind("click", function() {
         if ($(this).data("id") == 1) {
             i++;
         }

         var name = $("#J_GuestName").val();
         var avatar = $("#J_GuestAvatar").val();
         var position = $("#J_GuestPosition").val();
         var company = $("#J_GuestCompany").val();

         var guestid = $("#J_GuestId").val();
         if (name == '') {
             mess_tusi('请输入姓名');
             return;
         }
         if (avatar == '') {
             mess_tusi('请选择头像');
             return;
         }
         if (position == '') {
             mess_tusi('请输入职务');
             return;
         }
         if (company == '') {
             mess_tusi('请输入公司');
             return;
         }
         var sendData = {
             name: name,
             avatar: avatar,
             position: position,
             company: company,
             i: i
         }
         if ($(this).data("id") == 1) {
             dataarr.push(sendData);
         } else {
             dataarr[guestid - 1] = sendData;
         }
         console.log(guestid);
         console.log(sendData);
         console.log(dataarr);
         console.log($(this).data("id"));
         dialog.close($('#J_DialogGuest'));
         $("#img1").attr('src', '/common/img/add-person.png');
         if ($(this).data("id") == 1) {
             // 添加嘉宾
             $(".J_GuestList").append(guestlist(sendData));

         } else if ($(this).data("id") == 2) {
             // 编辑嘉宾
             console.log($("div[data-result='" + guestid + "']"));
             $("div[data-result='" + guestid + "']").find(".avatar1 img").attr("src", qiniu_bucket_domain + avatar);
             $("div[data-result='" + guestid + "']").find(".avatar1 .thumb_avatar1").val(avatar);
             $("div[data-result='" + guestid + "']").find(".name").text(name);
             $("div[data-result='" + guestid + "']").find(".company").text(company);
             $("div[data-result='" + guestid + "']").find(".position").text(position);
         }
     })


     // 嘉宾模板
     var guestlist = function(data, type = 0) {
         var dataweid = "0";
         if (type > 0) {
             data.i = type;
             i = type;
             dataweid = data.weid;
         }
         var guesthtml = '<div class="row J_ActivityGuest" data-result="' + data.i + '" data-id="' + dataweid + '">' +
             '<div class="cell drag"><span></span></div>' +
             '<div class="cell avatar1">' +
             '<input type="hidden" name="thumb_avatar1" class="thumb_avatar1" value="' + data.avatar + '" >' +
             '<img src="' + qiniu_bucket_domain + data.avatar + '"></div>' +
             '<div class="cell name">' + data.name + '</div>' +
             '<div class="cell company">' + data.company + '</div>' +
             '<div class="cell position">' + data.position + '</div>' +
             '<div class="cell operate">' +
             '<i class="fa fa-pencil-square-o J_GuestEdit" onclick="guestedit(this)"></i>' +
             '<i class="fa fa-close J_GuestDelete" onclick="guestdel(this)"></i>' +
             '</div>' +
             '</div>';
         return guesthtml;
     }

     $(".add_guest").bind("click", function() {
         $("#J_BtnSaveGuest").data("id", '1');
     })

     // 4.活动详情
     var activitydetail = function(id) {
             $.ajax({
                 url: ACTIVITY_DETAIL + "/" + id,
                 type: 'get',
                 headers: {
                     'Token': localStorage.getItem('token')
                 },
                 success: function(data) {
                     console.log(data);
                     if (data.code == 200) {
                         $("#img").attr("src", qiniu_bucket_domain + data.data.cover);
                         $("#J_ActivityPoster").val(data.data.cover);
                         $("#J_ActivityTitle").val(data.data.title);
                         $("#J_ActivityCity").val(data.data.area_name);
                         $("#J_ActivityCityId").val(data.data.area_id);
                         $("#J_ActivityAddr").val(data.data.address);
                         $("#J_ActivityStartDate").val(data.data.begain_time.split(" ")[0]);
                         $("#J_ActivityOverDate").val(data.data.end_time.split(" ")[0]);
                         $("#J_ActivityEntryOverDate").val(data.data.enroll_deadline.split(" ")[0]);
                         $("#J_ActivityStartTime option").each(function() {
                             if ($(this).val() == data.data.begain_time.split(" ")[1]) {
                                 $(this).attr("selected", "selected").siblings().removeAttr("selected");
                             }
                         })
                         $("#J_ActivityOverTime option").each(function() {
                             if ($(this).val() == data.data.end_time.split(" ")[1]) {
                                 $(this).attr("selected", "selected").siblings().removeAttr("selected");
                             }
                         })
                         $("#J_ActivityEntryOverTime option").each(function() {
                             if ($(this).val() == data.data.enroll_deadline.split(" ")[1]) {
                                 $(this).attr("selected", "selected").siblings().removeAttr("selected");
                             }
                         })
                         data.data.Sponsor.split(",").map(x => {
                             $(".J_TagAddSponor").before('<span class="tag" data-type="sponor" data-time="" data-id="0">' + x + '<i class="fa fa-times-circle" onclick="sponordel(this)"></i></span>');
                         })

                         CKEDITOR.instances.editor1.setData(data.data.content);
                         $("#J_ActivityLimit").val(data.data.enroll_limit);
                         if (data.data.is_private == 2) {
                             $('#J_ActivityProperty').get(0).checked = true;
                         } else {
                             $('#J_ActivityProperty').get(0).checked = false;
                         }
                         if (data.data.status == 2) {
                             $(".btn-save").remove();
                         }
                         $(".btn-pub").text("修改");
                         $(".btn-pub").data("id", 1);
                         // 查找嘉宾
                         guestlistdetail(data.data.weid);

                     } else {
                         mess_tusi(data.message);
                     }
                 },
                 error: function(xhr) {
                     console.log(xhr);
                 }
             })
         }
         // 0.1编辑活动
     var id = window.location.href.split('/').pop();
     console.log(id);
     if (id != null && id != '' && id.length == 36) { activitydetail(id); }

     //查找嘉宾列表根据活动id
     var guestlistdetail = function(id) {
             //ACTIVITY_GUEST_LISTS
             var limit = "";
             var page = "";
             var sendData = {
                 activity_id: id,
                 limit: limit,
                 page: page
             }
             $.ajax({
                 url: ACTIVITY_GUEST_LISTS,
                 type: 'post',
                 data: sendData,
                 headers: {
                     'Token': localStorage.getItem('token')
                 },
                 success: function(data) {
                     console.log(data);
                     if (data.code == 200) {
                         if (data.data.total > 0) {
                             var index = 0;
                             data.data.list.map(x => {
                                 index++;
                                 $(".J_GuestList").append(guestlist(x, index));

                             })
                         }

                     } else {
                         mess_tusi(data.message);
                     }
                 },
                 error: function(xhr) {
                     console.log(xhr);
                 }
             })
         }
         // }
         //left-navbar show words
         // $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
         //     var id = $(this).attr("id");
         //     if (id != 'login') {
         //         $(this).find(".word").show();
         //         $(this).css({
         //             "line-height": "65px"
         //         });
         //         $("#" + id + " .word").css("margin-top", "-30px");
         //     } else {
         //         if (!isLogin) {
         //             $(this).css({
         //                 "line-height": "65px",
         //             });
         //             $("#" + id + " .word").css("margin-top", "-30px");
         //         }
         //     }
         // }, function(){
         //     var id = $(this).attr("id");
         //     $(this).find(".word").hide();
         //     $(this).css("line-height", "65px");
         //     $("#" + id + " .word").css("margin-top", "-55px");
         // })

     /* var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log('module:', data.data.list);
                    var state = data.data.list;
                    state.map(x => {
                        modeleName.push(x.module_id);
                        if (x.module_id === '4009ea20-8ede-11e7-83a8-156d1da77933') {
                            if (x.status == 1) {
                                //$(".we-art").slideDown(500)
                                $(".we-art").show();
                                $('#toggle-button').prop("checked", true);
                            }
                        }
                        if (x.module_id === '44fd5620-8d7f-11e7-9e08-e356d0b019f1') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-shop").show();
                                $('#toggle-button-4').prop("checked", true);
                            }
                        }
                        if (x.module_id === 'b3c00b00-a4e2-11e7-b542-2d038cc12c12') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-active").show();
                                $('#toggle-button-2').prop("checked", true);

                            }
                        }
                        if (x.module_id === 'c30c2160-a4e2-11e7-a2ad-35371a8cf051') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-project").show();
                                $('#toggle-button-1').prop("checked", true);

                            }
                        }
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-active';
                var status = true;
                var list = ['we-set', 'we-art', 'we-shop','we-active','we-project', 'we-app', 'we-log'];

                var remove = function(id, list) {
                    return list.filter(x => x != id);
                }

                $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                remove(curr, list).map(x => $("." + x + ":eq(1)").hide());

                var showList = function(state, id) {
                    var id = "." + id;
                    if (state) {
                        $(id + ":eq(1)").hide(500);
                        if (id != ".we-log") {
                            $(id + ":eq(0)").css("border-bottom", "0");
                        }
                        $(id + " span img").attr('src', '/common/img/more1.png');
                        status = false;
                    } else {
                        $(id + ":eq(1)").show(500);
                        $(id + " span img").attr('src', '/common/img/more_unfold.png');
                        $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                        status = true;
                    }
                }

                list.map(x => {
                    $("." + x).click(function() {
                        if (curr == x) {
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '/common/img/more1.png');
                            });
                            showList(status, x);
                        } else {
                            status = false;
                            $("." + curr + ":eq(0)").css("border-bottom", "0");
                            curr = x;
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '/common/img/more1.png');
                            });
                            showList(status, x);
                        }
                    })
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
*/

     /*  //主页初始化
       var init__ = function(token){
           moduleState();
         if (token != 'null' && token != undefined) {
           showLogin = false;
           isLogin = true;
           //加载用户头像
           $("#login div img").hide();
           $(".log-head").css({
             'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
             'background-size': '100% 100%'
           })
           $("#avatar .avatar-icon").css({
             'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
             'background-size': '100% 100%'
           })
           $(".log-head").show();
         }
       }

       init__(localStorage.getItem('token'));*/
 })
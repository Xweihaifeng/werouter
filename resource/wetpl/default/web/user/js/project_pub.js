 /**
 * Created by Hongguang on 2017/8/6.
 *
 *
 *
 *
 */
   //列表折叠
sessionStorage.listname='we-project';
///////////////////////吐丝层start/////////////////////////////////////
  var tusitemp="";
    function mess_tusi(strs){
        //清除事件
        clearTimeout(tusitemp);
        $("#mess_tusi").remove();
        //创建吐丝层并写入内容
        if(!$("#mess_tusi").attr("id")){ //吐丝层不存在创建
            $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>"+strs+"</span></div>"); //写入内容
        }else{
            $("#mess_tusi").html(strs);  //写入内容
        }

        //定义吐丝层位置
        var left=(1200-$("#mess_tusi").width())/2 + 70;//居中
        var top=$(window).height()*0.25;
        $("#mess_tusi").css({"left":left+"px","top":top+"px"});

        //显示吐丝层
        $("#mess_tusi").css("display",'');

        //5秒后关闭
        tusitemp =  setTimeout(function (){
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        },2000);
        return false;
    }

// 吐丝层end////////////////////////////////////

// 删除回报
    var repaydel=function(obj){
            // console.log($(obj).closest('.reset-t').data('id'));
            $.ajax({
            url:PROJECT_REPAY_DESTORY+'/'+$(obj).closest('.reset-t').data('id'),
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                // console.log(data);
                if(data.code == 200){
                    mess_tusi("删除成功");
                    //location.reload();

                }else{
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
        $(obj).closest(".reset-t").remove();
        //repay_data.val('')
    }
    //编辑回报
    var repaydit=function(obj){

        var repay_i=$(obj).closest('.reset-t').attr('data-result');
       var repay_data=$(obj).closest('.reset-t').find('.repay_hidden').val();
        var data=JSON.parse(repay_data);
        $('.repay_List').val(repay_data)
        var weid=data.weid;
            $("#myModal").modal("show");
            $('#crs').text('保存');
            var amount=data.amount//支持金额
            var content=data.content;//回报内容
            var title=data.title//回报标题

            var limit=data.limit;//支持次数/人
            var repay_date=data.repay_date//回报时间
            var images=data.images;//图片
            // var is_distribution=data.is_distribution
            //是否配送 1 是 2 否
            var freight=data.freight;//运费
            var is_luckydraw=data.is_luckydraw//是否设为抽奖 1 是 2 否
            var luckydraw_number=data.luckydraw_number;//抽奖数量

             ////////////////////////////////////////////////////////
             console.log(data.is_distribution);
              $('#is_delivery option[value='+data.is_distribution+']').attr('selected','selected').siblings().removeAttr('selected');
            if(data.is_distribution==1){
                $('#delivery_fee_l_box').css('display','block')
            }else{
               $('#delivery_fee_l_box').remove()
            }

      // console.log($("#is_delivery").val())

    if(localStorage.getItem('project_cate_style')==2){
        $('#lucky').remove()
      console.log(data.is_distribution);

    }else{
         if(is_luckydraw==1){
             $('#num-c1,#num-c,#is_limit_user').css('display','block')
        }
        $('#is_limit_user option[value='+is_luckydraw+']').attr('selected','selected');
    }

    $("[name='price']").val(amount);
    var content=$("[name='description']").val(content);
    var title=$("[name='title']").val(title);
    //var number='';//限购人数
     $("[name='maxbuy']").val(limit);
     $("[name='repaid_day']").val(repay_date);
     //$('#J_ActivityPoster').val(images);
     //console.log(images);
     $('.img_1').attr('src',qiniu_bucket_domain+images);
     $("[name='thumb_image_1']").val(images);
     $("[name='title']").get(0).checked?2:1;
     $("[name='delivery_fee']").val(freight);
        if ($('#is_limit_user').get(0)) {
        var is_luckydraw = $('#is_limit_user').get(0).checked ? 2 : 1; //是否设为抽奖 1 是 2 否
    };
     //$('#is_limit_user').get(0).checked?2:1;
     $("[name='lottery_measure']").val(luckydraw_number);
     $('.repay_i').val(repay_i)
    }

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
// console.log('logo:',favicon);
$('#favicon').attr('href', favicon);


 $(function(){
//编辑器设置
    CKEDITOR.replace('editor1',{"extraPlugins":"filebrowser,image,imagepaste,filetools"});

})
var qiniu_uptoken = '';
var saveto ='qiniu';
//var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
var __init = function(){
    $.ajax({
        url:  QINIU_UPTOKEN_URL,
        type: 'get',
        dataType: 'json',
        success: function(data){
            qiniu_uptoken = data.uptoken;
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
}

//const ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
// console.log('logo:',favicon);
$('#favicon').attr('href', favicon);


$(function(){

    __init();


   var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 401) {
                  // domain = '/index';
                  localStorage.removeItem('token')
                  // window.location.href = '/login'
                }
                if (data.code == 200){
                    // console.log(data);
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
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var weid = localStorage.getItem('weid');
    hasDomain(weid);

    /*var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article','active','project', 'shopping'];

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
            window.location.href = domain + "/article";
        }
         var active = function(){

            showLogin = false;
            window.location.href = domain + "/active";
        }
         var project = function(){

            showLogin = false;
            window.location.href = domain + "/project";
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article,#active,#project, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/

//cover上传
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
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
                $("input[name=thumb_image]").val(res.key);
                var sourceLink = domain + res.key;
                $("#img").attr('src', sourceLink);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "pages/project/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });
    //项目回报cover
    var uploader1 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles_1',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        container: 'look_1',
        max_file_size: '100mb',
        flash_swf_url: '../../common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look_1',
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
                $("input[name=thumb_image_1]").val(res.key);
                var sourceLink = domain + res.key;
                $("#img_1").attr('src', sourceLink);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "pages/activity/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });



// 项目发布ajax start
var pj_cate_detail=function(weid){
     $.ajax({
            url: PROJECT_CATE_DETAIL+'/'+weid,
            type: 'get',
            headers: {
              'Token': localStorage.getItem('token')
            },
            success:function(data){
                // console.log(data)
                if (data.code == 200){
                      $('.tc').text(data.data.name);
                      localStorage.setItem('project_cate_style',data.data.style);
                      localStorage.setItem('project_cate_weid',data.data.weid);
                      init_detail();

                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

            }

        });

}
//判断是否从分类页面进来
if(localStorage.getItem('project_cate_weid')!=''){
  pj_cate_detail(localStorage.getItem('project_cate_weid'));
}

// var cate_style=localStorage.getItem('project_cate_style');


//初始数据
var repay_detail=function(){
     $('.btn-modal').click(function(){
        //alert("ehheh");
        $('#lucky').remove()
    })
}
var mon_detail=function(){
        $('.btn-modal').click(function(){
          $("[name='price']").val(1.00).attr('readonly','true');
    })
}
//一元众筹设置筹款金额

var init_detail=function(){
    // console.log(localStorage.getItem('project_cate_style'));
    if(localStorage.getItem('project_cate_style')==1){
        $('.huibao').empty();
    }else if(localStorage.getItem('project_cate_style')==2){
       repay_detail();
    }else if(localStorage.getItem('project_cate_style')==4){
       mon_detail();
    }
}





//回报设置
    //日期 转换为 Unix时间戳
   var dateToUnix= function(string) {
        var f = string.split(' ', 2);
        var d = (f[0] ? f[0] : '').split('-', 3);
        var t = (f[1] ? f[1] : '').split(':', 3);
        return (new Date(
                parseInt(d[0], 10) || null,
                (parseInt(d[1], 10) || 1) - 1,
                parseInt(d[2], 10) || null,
                parseInt(t[0], 10) || null,
                parseInt(t[1], 10) || null,
                parseInt(t[2], 10) || null
                )).getTime() / 1000;
    }
    //时间戳转换日期
    var unixToDate=function(unixTime, isFull, timeZone) {
        if (typeof (timeZone) == 'number')
        {
            unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
        }
        var time = new Date(unixTime * 1000);
        var ymdhis = "";
        ymdhis += time.getUTCFullYear() + "-";
        ymdhis += (time.getUTCMonth()+1) + "-";
        ymdhis += time.getUTCDate();
        if (isFull === true)
        {
            ymdhis += " " + time.getUTCHours() + ":";
            ymdhis += time.getUTCMinutes() + ":";
            ymdhis += time.getUTCSeconds();
        }
        return ymdhis;
    }

// 项目发布/编辑

        $(".agree-sub").click(function(){
            // console.log($(this).data("id"));
             //console.log(id);

            var cate_id= localStorage.getItem("project_cate_weid");//在保存成功后要销毁
            // console.log(cate_id)

            var title= $("[name='name']").val();
            var summary=$("#intro").val();
            var start_time=$("[name='start_time']").val();
            var content = CKEDITOR.instances.editor1.getData();
            var date_end= $("[name='end_time']").val();
            var amount= $("[name='limit_price']").val();
            var cover = $("input[name=thumb_image]").val();
            //var ratio= $("[name='cate_id']").val();项目分成比例
            var filesnamestr=[];
            $(".progressContainer").each(function(index){
                // console.log($(this).find(".filesname").val());
                filesnamestr[index]=$(this).find(".filesname").val();

            });
            var images= filesnamestr;
            var is_private=$("[name='privacy_re']").get(0).checked?2:1;
            // if(!$("[name='privacy_re']").get(0).checked){
            //     mess_tusi("是否");
            //     return;
            // }
            //  是否隐私发布
            var start_time_stamp=dateToUnix(start_time)
            var date_end_stamp=dateToUnix(date_end)
            //现在时间
            var nn=new Date();
            var yn=nn.getFullYear();
            var mn=nn.getMonth()+1;
            var dn=nn.getDate();
            var timetext=yn+'-'+mn+'-'+dn;
            var nowTime_stamp=dateToUnix(timetext);
            if(start_time_stamp>date_end_stamp){
                mess_tusi('结束时间不能小于开始时间');
                return;
            }
            if(start_time_stamp<nowTime_stamp){
                mess_tusi('开始时间不能小于当前时间');
                return;
            }

            if (cover == '') {
                mess_tusi('请选择封面图');
                return;
            }
            if(amount ==''){
                mess_tusi('请输入筹款金额');
                return
            }else if(isNaN(amount)){
                mess_tusi('请输入数字');
                return
            }

            if (title == '') {
                mess_tusi('请输入标题');
                return;
            }

            if (!content) {
                mess_tusi('请输入项目内容');
                return;
            }

            if (summary == '') {
                mess_tusi('请输入描述');
                return;
            }
            if (start_time == '') {
                mess_tusi('请输入开始时间');
                return;
            }
            if(date_end==''){
                mess_tusi('请输入结束时间');
                return
            }
            if (images == '') {
                mess_tusi('请上传图片');
                return;
            }

            // console.log($('.agr_re').find('.reset-t').length==0)
            // if(cate_style!=1){
            //   if($('.agr_re').find('.reset-t').length==0){
            //      mess_tusi('请添加回报')
            //   }
            // }


       var btnstatus=$(this).data('status');
       // var add='';
       // if ($(this).data("id") == 1){
       //   add=1
       // }else{
       //  add=''
       // }
       var status="";
        if(btnstatus==0){
            // 发布
            status=2;
        }else if(btnstatus==2){
            // 存为草稿
            status=1;
        }
            var sendData = {
                title: title,
                cate_id: cate_id,
                summary: summary,
                content: content,
                date_end: date_end,
                date_start: start_time,
                cover: cover,
                amount:amount,
                status:status,
                is_private:is_private,//是否隐私发布
                images:images
            }
            // console.log(sendData);
            // return;
            if ($(this).data("id") == 1) {
                // 发布项目
                if(localStorage.getItem('project_cate_style')!=1&&localStorage.getItem('project_cate_style')!=''){
                    if($(".reset-t").length<=0){
                        mess_tusi("请添加回报");
                        return false;
                    }
                }
                $.ajax({
                    url: PROJECT_STORE,
                    type: 'post',
                    data: sendData,
                    headers: {
                        'Token': localStorage.getItem('token')
                    },
                    success: function(data){
                        // console.log(data);
                        if (data.code == 200){
                            // console.log($(".reset-t"));

                            //根据cate_style判断是否需要回报设置
                            // console.log(localStorage.getItem('project_cate_style'))
                       // if(cate_style==1){
                        if(localStorage.getItem('project_cate_style')==1){
                            mess_tusi("项目发布成功");
                            localStorage.setItem('project_cate_style','');
                            localStorage.setItem('project_cate_weid','');
                            window.location="/user/admin/project/list";

                        }else{
                            saverepay(data.data,btnstatus,1);

                        }



                        }else{
                        // alert(data.massag)
                        layer.msg(data.message);
                    }

                     }
                    ,
                    error: function(xhr){
                        console.log(xhr);
                    }
                })

            } else {
                // 编辑
                sendData.weid=id;
                // console.log(sendData);
                $.ajax({
                    url: PROJECT_UPDATE,
                    type: 'post',
                    data: sendData,
                     headers: {
                    'Token': localStorage.getItem('token')
                },
                success: function(data){
                    // console.log(data);
                    if (data.code == 200){
                        if($(".reset-t").length>0){
                            // 修改回报
                            saverepay(id,btnstatus,'');

                       }else{
                            mess_tusi("项目编辑成功");
                            window.location="/user/admin/project/list";
                       }


                    } else {
                        mess_tusi(data.message);
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
                })
            }
        });
// 保存||修改回报设置
 var flag=0;
 //var index=0
var saverepay=function(projectid,btnstatus,add){
    // console.log($(".reset-t"))
    $(".reset-t").each(function(index){
    var dataInput=JSON.parse($(this).find('.repay_hidden').val());
    var amount='';
    console.log(localStorage.getItem('project_cate_style'));
    if(localStorage.getItem('project_cate_style')==4){
     amount=1.00;
    }else{
     amount=dataInput.amount;//支持金额
    }

    var content=dataInput.content;//回报内容
    var title=dataInput.title;//回报标题
    //var number='';//限购人数
    var limit=dataInput.limit;//支持次数/人
    var repay_date=dataInput.repay_date;//回报时间
    var images=dataInput.images;//图片
    var is_distribution=dataInput.is_distribution//是否配送 1 是 2 否
    var freight=dataInput.freight;//运费
    var is_luckydraw=dataInput.is_luckydraw//是否设为抽奖 1 是 2 否
    var luckydraw_number=dataInput.luckydraw_number;//抽奖数量
    //var weid=data.weid;
    var sendData={
                        project_id:projectid,
                        amount:amount,
                        content:content,
                        title:title,
                        limit:limit,
                        images:images,
                        repay_date:repay_date,
                        is_distribution:is_distribution,
                         freight:freight,
                        is_luckydraw:is_luckydraw,
                        luckydraw_number:luckydraw_number
    }

        if(add!=''){
           sendData.add=1;
        }

    //var data_w=dataInput);
    var weid=dataInput.weid;
    // console.log(weid);
    sendData.weid=weid;
    //console.log(sendData)
    if(weid!=undefined){
            // 修改回报
            //sendData.weid=weid
            $.ajax({
                url: PROJECT_REPAY_UPDATE,
                type: 'post',
                data:sendData,
                headers: {
                    'Token': localStorage.getItem('token')
                },
                success: function(data){
                    console.log(data);
                    if (data.code == 200){
                         flag++;
                            // console.log("flag:",flag);
                            // console.log("index:",index);
                            if(flag>=index){
                                if(btnstatus==2){
                                    mess_tusi("回报保存成功");

                                }else{
                                    mess_tusi("回报修改成功");

                                }
                            //location.reload();
                             localStorage.setItem('project_cate_style','');
                             localStorage.setItem('project_cate_weid','');
                            window.location="/user/admin/project/list";
                            }

                    } else {
                        mess_tusi(data.message);
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        }else{
            // 保存回报
            console.log(sendData)
            $.ajax({
                url: PROJECT_REPAY_STORE,
                type: 'post',
                data:sendData,
                headers: {
                    'Token': localStorage.getItem('token')
                },
                success: function(data){
                     console.log(data);
                    if (data.code == 200){
                        $('#repay_hidden').val(sendData)
                           // console.log('a')
                             flag++;
                            // console.log("flag:",flag);
                            // console.log("index:",index);
                            if(flag>=index){
                                if(btnstatus==2){
                                    mess_tusi("回报保存成功");

                                }else{
                                    // mess_tusi("回报发布成功");
                                    mess_tusi("项目发布成功");


                                }
                            localStorage.setItem('project_cate_style','');
                            window.location="/user/admin/project/list";

                            //window.location="/user/admin/project/list";


                            }

                    } else {
                        mess_tusi(data.message);
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        }
   })
}



//添加修改回报
var dataarr = [];
var i = 0;
$("#crs").bind('click',function() {
    var amount = $("[name='price']").val(); //支持金额
    var content = $("[name='description']").val(); //回报内容
    var title = $("[name='title']").val(); //回报标题
    //var number='';//限购人数
    var limit = $("[name='maxbuy']").val(); //支持次数/人
    var repay_date = $("[name='repaid_day']").val(); //回报时间
    var images = $("[name='thumb_image_1']").val(); //图片
    if($("[name='is_delivery']").get(0)){
       var is_distribution =$("[name='is_delivery']").val(); //是否配送 1 是 2 否
       // console.log()
       var freight = $("[name='delivery_fee']").val(); //运费
    }
    if ($('#is_limit_user').get(0)) {
        var is_luckydraw = $('#is_limit_user').val(); //是否设为抽奖 1 是 2 否
        var luckydraw_number = $("[name='lottery_measure']").val(); //抽奖数量
        var repay_num = $("[name='maxbuy']").val(); //回报支持数

    };
 console.log($('#is_delivery').val())
 console.log($('#is_limit_user').val())

    //var reid = $(this).data("id");
    var repay_i=$('.repay_i').val();
    // console.log(repay_i);
    if(images==''){
         mess_tusi('请上传图片');
         return
    }
    if(amount==''){
        mess_tusi('请输入支持金额');
        return
    }else if(isNaN(amount)){
        mess_tusi('支持金额请输入数字');
        return
    }
    if(title==''){
         mess_tusi('请输入回报标题');
         return
    }
    if(content==''){
         mess_tusi('请输入回报内容');
         return
    }
      if(localStorage.getItem('project_cate_style')!=2){
            if($('#is_delivery').val()!=2){
                    if(freight==''){
                         alert('请输入运费');
                         return;
                    }else if(isNaN(freight)){
                        mess_tusi('运费请输入正确数字');
                        return;
                    }

         }


        if ($('#is_limit_user').val()!=2) {
              if(repay_num==''){
                mess_tusi('请输入回报支持数');
                return;
              }else if(isNaN(repay_num)){
                mess_tusi('回报支持数请输入数字');
                return;
              }
                if(luckydraw_number==''){
                mess_tusi('抽奖数量不能为空');
                return;
              }else if(isNaN(luckydraw_number)){
                mess_tusi('抽奖数量请输入数字');
                return;
              }


                if(limit==''){
                   mess_tusi('请输入支持人数');
                 return;
                }else if(isNaN(limit)){
                   mess_tusi('请输入正确支持人数');
                return;
               }

            }
    }else{
         if($('#is_delivery').val()!=2){
                    if(freight==''){
                         mess_tusi('请输入运费');
                         return;
                    }else if(isNaN(freight)){
                        mess_tusi('运费请输入正确数字');
                        return;
                    }

         }

    }
    //console.log(data_a.weid);
    var sendData = {
        //project_id:project_id,
        amount: amount,
        content: content,
        title: title,
        limit: limit,
        images: images,
        repay_date: repay_date,
        repay_num:repay_num,
        is_distribution: is_distribution,
        freight: freight,
        is_luckydraw: is_luckydraw,
        luckydraw_number: luckydraw_number,
        i: ++i
    }
$('#myModal').modal('hide');//模态框关闭事件
 if($("#unbtn").attr("addflag")=='true'){
    //添加
    $(".agr_re").append(repay_list(sendData,''));
    $('#crs').text('保存');
    $('.reset-t').each(function(){
        $(this).attr('data-result',repay_i++);
        console.log($(this).attr('data-result'));
    })
    $("#unbtn").attr("addflag","false");
}else{
    //编辑
    //判断隐藏域有没有weid
    var data_a=JSON.parse($('.repay_List').val());
    var weid=data_a.weid;
    if(data_a.hasOwnProperty('weid')){
        if(weid!=''){
            sendData.weid=weid;
        }
    }
    var new_html = repay_edit_list(sendData,'');

    $("[data-result='"+repay_i+"']").html(new_html);
    $("#unbtn").attr("addflag","false");
    $('#crs').text('保存');

 }

 //清空模态框内容
     $(".control-text input").val('');
    $("[name='description']").val('');
    //$('#J_ActivityPoster').val('')
    $('.img_1').attr('src','/common/img/select_p.jpg');
    $('#is_delivery option[value=2]').attr('selected','selected');

})

//编辑回报模板

var repay_edit_list=function(data){
    var repay_a_content=`
                 <input type="hidden" class="repay_hidden" value=`+JSON.stringify(data)+`>
                       <img src="`+qiniu_bucket_domain+data.images+`" alt="" class="pull-left repay_img" />
                       <div class="pull-left"   data-toggle="modal" data-target="#myModal">
                           <div class="pull-p" id="repay_title" >`+data.title+`</div>
                           <p class="pull-p" >支持<span class="pull-span" id="repay_m">`+data.amount+`</span>元</p>
                           <p class="sib-f" id="repay_content">`+data.content+`</p>
                       </div>
                       <div class="gt pull-right" id="gt" onclick="repaydel(this)">
                       <i class="fas fa-close J_GuestDelete"></i>
                       </div>
                       <div class="gl pull-right" id="gl" onclick="repaydit(this)">
                       <i class="fas fa-pencil-square-o"></i>
                       </div>
                       <hr class="repay_hr">
    `
    return repay_a_content;
}

//添加回报模板
var repay_list=function(data,index=''){
     var dindex=''
    if(index!=''){
       dindex=index;
    }else{
       dindex=data.i+1
    }
    var repayhtml=`

                <div class="reset-t clearfix"  data-result=`+dindex+` data-id=`+data.weid+` >
                    <input type="hidden" class="repay_hidden" value=`+JSON.stringify(data)+`>
                       <img src="`+qiniu_bucket_domain+data.images+`" alt="" class="pull-left repay_img" />
                       <div class="pull-left"   data-toggle="modal" data-target="#myModal">
                           <div class="pull-p" id="repay_title" >`+data.title+`</div>
                           <p class="pull-p" >支持<span class="pull-span" id="repay_m">`+data.amount+`</span>元</p>
                           <p class="sib-f" id="repay_content">`+data.content+`</p>
                       </div>
                       <div class="gt pull-right" id="gt" onclick="repaydel(this)">
                       <i class="fas fa-close J_GuestDelete"></i>
                       </div>
                       <div class="gl pull-right" id="gl" onclick="repaydit(this)">
                       <i class="fas fa-pencil-square-o"></i>
                       </div>
                        <hr  class="repay_hr">
                    </div>

`
  return repayhtml;
}

  // 4.项目详情
    var projectdetail=function(id){
        $.ajax({
            url: PROJECT_DETAIL+"/"+id,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                // console.log(data);
                if (data.code == 200){
                    // console.log('项目分类id'+data.data.cate_id);
                      pj_cate_detail(data.data.cate_id);
                      $("#intro").val(data.data.summary);
                       $("#img").attr("src",qiniu_bucket_domain+data.data.cover);
                       $("[name='thumb_image']").val(data.data.cover);
                       $("#J_ActivityPoster").val(data.data.cover);
                       $("[name='name']").val(data.data.title);
                       $("[name='start_time']").val(data.data.date_start);
                       $("[name='end_time']").val(data.data.date_end,);
                       var images=data.data.images;
                            if(images!=null){
                               var picturearr=images.split(",");
                                picturearr.map(x => {
                                    $("#fsUploadProgress").append(images_e(x,i));
                                    i++;
                                })
                           }else{
                           var picturearr="";
                          }
                        CKEDITOR.instances.editor1.setData(data.data.content);
                        $("[name='limit_price']").val(data.data.amount);
                        $('.tc').text(data.data.cate_name);
                        $('.agree-sub').text('修改项目');
                        $(".agree-sub").data("id",2);
                        repaylistdetail(data.data.weid);
                       // console.log($(".agree-sub").data("id"));
                       var ratio= $("[name='cate_id']").val();

                       $("#J_ActivityStartTime option").each(function(){
                            if($(this).val()==data.data.begain_time.split(" ")[1]){
                                $(this).attr("selected","selected").siblings().removeAttr("selected");
                            }
                       })
                       $("#J_ActivityOverTime option").each(function(){
                            if($(this).val()==data.data.end_time.split(" ")[1]){
                                $(this).attr("selected","selected").siblings().removeAttr("selected");
                            }
                       })
                       $("#J_ActivityEntryOverDate option").each(function(){
                            if($(this).val()==data.data.enroll_deadline.split(" ")[1]){
                                $(this).attr("selected","selected").siblings().removeAttr("selected");
                            }
                       })

                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }



    //查找回报列表根据项目id
    var repaylistdetail=function(id){
        //PROJECT_REPAY_LIST
        var limit="";
        var page="";
        var sendData={
            project_id:id,
            limit:limit,
            page:page
        }
        $.ajax({
            url: PROJECT_REPAY_LIST,
            type: 'post',
            data: sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                // console.log(data);
                if (data.code == 200){
                    if(data.data.total>0){
                        var index=0;
                        data.data.list.map(x => {
                            index++;
                             delete x.created_at;
                             delete x.updated_at;
                            $(".agr_re").append(repay_list(x,index))
                            //$('.reset-t').attr('data-result',index)
                            // console.log(x)


                        })
                    }

                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //发布详情图片模板
    var images_e=function(data,i,type=0){
          if(type==1){
            /*var imgsrc="../common/img/img-shop.png";
            createimgelem(i-1);*/
        }else{
            var imgsrc=qiniu_bucket_domain +data;
            var imageshtml='<div class="progressContainer" id="" style="opacity: 1;">'+
                        '<div class="progressName">'+
                        '<input type="hidden" class="filesname" name="thumb_image[]" value="'+data+'">'+
                        '<div class="Wrapper"><div class="imgWrapper col-md-3">'+
                        '<a class="linkWrapper" target="_blank" href="'+imgsrc+'" title="">'+
                        '<img src="'+imgsrc+'"></a></div><div class="infoWrapper col-md-6"><a class="fopLink" data-key="'+data+'">查看处理效果</a><div><div>格式：<span class="origin-format">png</span></div><div>宽度：<span class="orgin-width">200px</span></div><div>高度：<span class="origin-height">200px</span></div></div></div></div></div><div class="progressFileSize">4 KB</div><div><div class="info"><div class="progress progress-striped"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuemax="100" aria-valuenow="0" aria-valuein="0" style="width: 0%;"><span class="sr-only">4 KB</span></div></div><a href="javascript:;" class="progressCancel">×</a><div class="status text-left">已上传: 4 KB 上传速度： 28 KB/s</div></div></div></div>'
         }
        return imageshtml;
    }
    // 0.1编辑项目
    var id = window.location.href.split('/').pop();
    // console.log(id);
    if(id!=null && id!='' && id.length==36){projectdetail(id);}


//继续添加点击事件
$("#unbtn,.close1").bind("click",function() {

    $(this).attr("addflag","true");
    $(".control-text input").val('');
    $("[name='description']").val('');
    $('#J_ActivityPoster').val('');
    $('.img_1').attr('src','/common/img/select_p.jpg');
     $('#is_delivery option[value=2]').attr('selected','selected');
     // $('#is_delivery').val(2);
    $('#delivery_fee_l_box').css('display','none');
    if(localStorage.getItem('project_cate_style')!=2){
        $('#is_limit_user').val(2);
        $('#num-c1,#num-c').css('display','none');
    }


})
// 项目发布ajax end




 //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css({
                "line-height": "65px"
            });
            $("#" + id + " .word").css("margin-top", "-30px");
        } else {
            if (!isLogin) {
                $(this).css({
                    "line-height": "65px",
                });
                $("#" + id + " .word").css("margin-top", "-30px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })
/*
    var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    // console.log('module:', data.data.list);
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
						if (x.module_id === 'a9d16bc0-ada0-11e7-8c59-993d3b1d7e06') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-crm").show();
                                $('#toggle-button-3').prop("checked", true);

                            }
                        }
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-project';
                var status = true;
				var list = ['we-set', 'we-art', 'we-shop','we-active','we-project', 'we-app','we-crm', 'we-log'];

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
    }*/


    /*//主页初始化
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






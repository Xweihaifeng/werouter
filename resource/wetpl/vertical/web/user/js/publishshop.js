 /**
 * Created by Hongguang on 2017/8/6.
 *
 *
 *
 *
 */

//列表折叠
sessionStorage.listname='we-shop';
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
        },5000);
        return false;
    }

// 吐丝层end////////////////////////////////////




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

    var memberDom = function(data){
        var isPrice = data.price ? data.price : "";
        var dom =
            '<div class="form-group member" weid="'+data.weid+'">'+
            '<label class="col-sm-2 control-label">'+data.name+'</label>'+
            '<div class="col-sm-3">'+
            '<input type="text" class="form-control" name="member-price" value="'+isPrice+'">'+
                '</div>'+
                '</div>';
        return dom;
    };

     $("input[name='price'],input[name='market_price'],input[name='reserve'],input[name='floor']").keyup(function(){
             var c=$(this);
             // console.log(c.val());
             console.log(/^\d*(?:.\d{0,2})?$/.test(c.val()));
             if(/[^\d.]/.test(c.val())){//替换非数字字符
             // if(/^\d*(?:.\d{0,2})?$/.test(c.val())){//替换非数字字符/^d*(?:.d{0,2})?$/
              var temp_amount=c.val().replace(/[^\d.]/g,'');
              // var temp_amount=c.val().replace(/^\d*(?:.\d{0,2})?$/,'');
              $(this).val(temp_amount);
             }

        })
    $("input[name='discount_status']").click(function () {
        $('.insert-member').children().remove();
        if($("input[name='discount_status']:checked").val() == 1){
            $.ajax({
                url : apiUrl + 'plat/member_level',
                type : 'get',
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success : function (res) {
                    console.log('dfsdfs',res);
                    if(res.code == 200 && res.data.length){
                        for(var i=0; i<res.data.length; i++){
                            $('.insert-member').append(memberDom(res.data[i]))
                        }
                    }
                },
                error : function (xhr) {
                    console.log(xhr)
                }
            })
        }
    })

    //添加服务
    $(".add_service").click(function () {


        var html=initServiceHtml('');

        $(".insert-service").append(html);
        delServiceDelete();

    });
     var initServiceHtml=function (data) {
         if (isNull(data)) {
             var html='<div class="service_list"><div class="operate" style="font-size: 20px;position: absolute;right: 50px;"><i class="fa fa-close J_Service_Delete" style="top: 2px;color: #adadad;cursor: pointer;font-size: 24px;"></i></div>'+
                 '<div class="form-group"><label class="col-sm-2 control-label">服务标题:</label><div class="col-sm-3"><input type="text" class="form-control" name="service_title" value=""></div></div>'+
                 '<div class="form-group">'+
                 '<label for="" class="col-sm-2 control-label">服务内容:</label>'+
                 '<div class="col-sm-6">'+
                 '<textarea class="form-control" name="service_content" rows="5"></textarea>'+
                 '</div>'+
                 '</div>'+
                 '</div>';
             return html;
         } else {
             //编辑使用（循环data）
             var html='';
             for (var i=0;i<data.length;i++){
                 html+='<div class="service_list"><div class="operate" style="font-size: 20px;position: absolute;right: 50px;"><i class="fa fa-close J_Service_Delete" style="top: 2px;color: #adadad;cursor: pointer;font-size: 24px;"></i></div>'+
                     '<div class="form-group"><label class="col-sm-2 control-label">服务标题:</label><div class="col-sm-3"><input type="text" class="form-control" name="service_title" value="'+data[i].service_title+'"></div></div>'+
                     '<div class="form-group">'+
                     '<label for="" class="col-sm-2 control-label">服务内容:</label>'+
                     '<div class="col-sm-6">'+
                    '<textarea class="form-control" name="service_content" rows="5">'+data[i].service_content+'</textarea>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
             }
             return html;
         }
     }
     //删除服务
    var delServiceDelete=function () {
        $(".J_Service_Delete").click(function () {
            $(this).closest(".service_list").remove();
        });
    }

     
   /* //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
    var routerList = ['home', 'login', 'article'];

    var isMember = function(routerList, route){
        return routerList.filter(x => x === route);
    }

    var home = function(){
        window.location.href = '../../index';
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
            window.location.href = "../../user/discovery";
        }
    }

    var article = function(){
        showLogin = false;
        window.location.href = "../../article/";
    }

    if (isMember(routerList, route) != ""){
        eval(route)();
    }
}

    $("#home, #login, #article").click(function(){
        var id = $(this).attr("id");
        router(id);
    })
*/
    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    // console.log('logo:',logo);
    $('#home img').attr('src', logo);

    var login = function(){
        window.location.href = "/login";
    }

   var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 401) {
                  localStorage.removeItem('token')
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

    var weid = docCookies.getItem("weid");
    hasDomain(weid);

    var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article', 'shopping'];

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
//          window.history.go(0);
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })


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
                var key = "pages/goods/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    /*var num=1;
    var uploader1 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles-1',
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

                var sourceLink = domain + res.key;
                $("#img-1").attr('src', sourceLink);
                $("input[name=thumb_image_1]").val(res.key);
                $("#img-"+num).attr('onclick',"");
                num++;
                createimgelem(num);

            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "pages/goods/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });*/

      function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
     // 获取商品分类
    var weid = getUrlParam('id');
    var cateType = [];
    var userid=docCookies.getItem("weid");
    var catesfun = function(userid){
        $.ajax({
            // url: "http://apitest.wezchina.com/goods/cates/list",
            url: apiUrl + 'goods/cates/listsAllByUser/'+userid,
            type: 'get',
            headers: {
                    'Token': docCookies.getItem("token")
                },
            success: function(data){
                // console.log(data);
                if (data.code == 200){
                    var cate = data.data;
                    if(cate.length>0){
                        cate.map(x => {
                            $(".shopcates select").append(
                                '<option id=' + x.weid + '>' + x.name + '</option>'
                            )
                            cateType.push({id: x.weid, name: x.name});
                        })
                    }else{
                        mess_tusi("请先添加分类");
                       //window.location="/user/admin/pubcate";
                        setTimeout(function(){window.location="/user/admin/wemall/cate"},1000)
                    }

                    if(id!=null && id!='' && id.length==36){goodsdetail(id);}
                    // shopsaveedit();

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
//catesfun()

    // 获取商城详情
    var page_id=mall_id='';
    var malldetail=function(){
        $.ajax({
            url:MALL_USERDETAIL,
            type:'get',
            headers: {
                    'Token': docCookies.getItem("token")
                },
            success:function(data){
                // console.log(data);
                if(data.code == 200){
                    var malldata=data.data;
                    if(malldata==null){
                        mess_tusi("没有商城，请先开通商城");
                       // window.location.href='/user';
                         setTimeout(function(){window.location.href='/user'},1000)
                    }else{
                         page_id=malldata.page_id;
                        mall_id=malldata.weid;

                        catesfun(malldata.plat_user_id);
                    }



                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
malldetail();

// catesfun();
/*// 配送列表
        var rangelist=function(){
            $.ajax({
                    url:apiUrl+'goods/range/lists',
                    type:'post',
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data){
                        console.log(data);

                        if (data.code == 200) {
                            $(".adressall").children().remove();
                            data.data.map(x => {
                                $(".adressall").prepend('<div class="sa_cum">'+
                                        '<input type="radio" data-val="'+x.weid+'" name="distribution"/>'+
                                        '<h4>'+x.province_ids+'</h4>'+
                                        '<div class="address">'+x.area_names+'</div></div>');

                            })
                        }else{
                            console.log('RANGE  LIST ERROR');
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
        }
        rangelist();*/

    // 通过地址id获得配送范围详情
    var rangedetail=function(weid){
        // console.log(weid);
        $.ajax({
            url: GOODS_RANGE_DETAIL+'/' + weid,
            type:'get',
            headers: {
                    'Token': docCookies.getItem("token")
                },
            dataType: 'json',
            success: function(data){
                // console.log(data);
                if (data.code == 200) {
                    if(data.data==null){
                        var area_names="";
                        var rangeid="";
                    }else{
                        var area_names=data.data.area_names;
                        var rangeid=weid;
                    }
                   $(".set_adr").before('<p>'+area_names+'</p><input type="hidden" name="distribution_id" value="'+rangeid+'">')

                   $(".adressall .sa_cum input[name='distribution']").each(function(){
                        if($(this).data("val")==weid){
                            $(this).attr("checked",true);
                        }
                   })
                }
            },
            error:function(xhr){
                console.log(xhr);
            }
    })
    }

    // 通过商品id获得商品详情
    var id = window.location.href.split('/').pop();


    var goodsdetail = function(id){
        $.ajax({
            url: GOODS_DETAIL+'/' + id,
            type:'get',
            headers: {
                    'Token': docCookies.getItem("token")
                },
            dataType: 'json',
            success: function(data){
                // console.log(data);
                if (data.code == 200) {
                    var goods = data.data;
                    $("input[name='title']").val(goods.title);
                    $("#look img").attr("src",ApiMaterPlatQiniuDomain+goods.cover);
                    $("input[name='thumb_image']").val(goods.cover);
                    $("textarea[name='summary']").val(goods.summary);
                    $("input[name='price']").val(goods.price);
                    $("input[name='market_price']").val(goods.marketprice);
                    $("[name='reserve']").val(goods.stock);
                    $("[name='floor']").val(goods.sort);
                    $("[name='note']").val(goods.note);
                    $("[name='note']").val(goods.note);
                    $("input[name='postage']").val(goods.postage);
                    $("input[name='postage_max_money']").val(goods.postage_max_money);
                    if(goods.postage_status==2){
                        $(".postage").show();
                        $(".postage_max_money").show();
                    }
                    if(goods.discount_status == 1){
                        $("input[value='1']").removeAttr('checked').attr("checked","checked");
                    }
                    $('.insert-member').children().remove();
                    if(goods.discount_status == 1 && goods.discount.length){
                        for(var i=0; i<goods.discount.length; i++){
                             $('.insert-member').append(memberDom(goods.discount[i]))
                        }
                    }
                    //加入服务列表
                    if(!isNull(goods.service)){
                        var html=initServiceHtml(JSON.parse(goods.service));
                        $(".insert-service").append(html);
                        delServiceDelete();
                    }

                    //解决部分情况加载不出来的情况 add by lisheng 2017-12-15 22:03
                    setTimeout(function () { CKEDITOR.instances.editor1.setData(goods.content); }, 200);
                    $("select[name='cate_id']").find("#"+goods.cate_id).attr("selected","selected");
                    if(goods.picture!=null){
                        var picturearr=goods.picture.split(',');
                             picturearr.map(x => {

                            $("#fsUploadProgress").append(picturetemplate(x,i));
                            i++;
                        })
                    }else{
                        var picturearr="";
                    }
                    if(goods.postage_status==1){
                        $(":radio[name='postage_status'][value='1']").attr("checked","checked");
                    }else{
                        $(":radio[name='postage_status'][value='2']").attr("checked","checked");
                    }
                    goods.voucher_status==1?$(":radio[name='voucher_status'][value='1']").attr("checked","checked"):$(":radio[name='voucher_status'][value='2']").attr("checked","checked");
                    goods.benefit_status==1?$(":radio[name='benefit_status'][value='1']").attr("checked","checked"):$(":radio[name='benefit_status'][value='2']").attr("checked","checked");
                    var i=1;
                    //var picbtn=$(".addimgmore").html();
                    //$(".addimgmore").children().remove();

                    // $(".addimgmore").append(picturetemplate("",i+1,1));
                    getprovincedetail(goods.range_id);

                    // 获取配送范围详情
                    rangedetail(goods.range_id);


                    $("#shopsubmit").text("确认修改");
                    $("#shopsubmit").attr("data-id","1");
                    $(".progressCancel").bind("click",function(){
                      $(this).closest(".progressContainer").remove();
                    })

                }
            }
    })

    }

    var picturetemplate=function(data,i,type=0){
        if(type==1){
            /*var imgsrc="../common/img/img-shop.png";
            createimgelem(i-1);*/
        }else{
            var imgsrc=qiniu_bucket_domain +data;

        /*var pichtml='<div class="addimg">'+
                        '<input name="thumb_image_'+i+'" type="hidden" value="'+data+'" class="form-control">'+
                        '<input id="pickfiles-'+i+'" name="back" type="file" class="form-control hide" style="position: relative; z-index: 1;">'+
                        '<div id="look-'+i+'">'+
                            '<img onclick="$(\'#pickfiles-'+i+'\').click()" id="img-'+i+'" width="100px;" src="'+imgsrc+'" alt="暂无预览图片" class="thumbnail">'+
                        '</div>'+
                    '</div>';*/
	var pichtml='<div class="progressContainer" id="" style="opacity: 1;">'+
                '<div class="progressName">'+
                '<input type="hidden" class="filesname" name="thumb_image[]" value="'+data+'">'+
                '<div class="Wrapper"><div class="imgWrapper col-md-3">'+
                '<a class="linkWrapper" target="_blank" href="'+imgsrc+'" title="">'+
                '<img src="'+imgsrc+'"></a></div><div class="infoWrapper col-md-6"><a class="fopLink" data-key="'+data+'">查看处理效果</a><div><div>格式：<span class="origin-format">png</span></div><div>宽度：<span class="orgin-width">200px</span></div><div>高度：<span class="origin-height">200px</span></div></div></div></div></div><div class="progressFileSize">4 KB</div><div><div class="info"><div class="progress progress-striped"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuemax="100" aria-valuenow="0" aria-valuein="0" style="width: 0%;"><span class="sr-only">4 KB</span></div></div><a href="javascript:;" class="progressCancel">×</a><div class="status text-left">已上传: 4 KB 上传速度： 28 KB/s</div></div></div></div>'
        }
        return pichtml;
    }




    // if(id!=null && id!='' && id.length==36){goodsdetail(id);}
    // 商品发布/编辑
    // var shopsaveedit=function(){
        $("#shopsubmit").click(function(){
            var filesnamestr=[];
            $(".progressContainer").each(function(index){
                filesnamestr[index]=$(this).find(".filesname").val();

            })

            var option = $("[name='cate_id']").val();
            var  cate_id = cateType.filter(x => x.name == option)[0].id;

            var title = $("[name='title']").val();
            var price = $("[name='price']").val();
            var market_price = $("[name='market_price']").val();

            var cover = $("input[name=thumb_image]").val();

            var summary = $("[name='summary']").val();
            var content = CKEDITOR.instances.editor1.getData();
            var stock=$("[name='reserve']").val();
            var sort=$("[name='floor']").val();
            var note=$("[name='note']").val();
            var range_id=$("[name='distribution_id']").val();
            var picture=filesnamestr;
            var addimglength=$(".addimg").length;
            var voucher_status=$("input[name='voucher_status']:checked").val();
            var benefit_status=$("input[name='benefit_status']:checked").val();
            var postage_status=$("input[name='postage_status']:checked").val();
            var postage=$("[name='postage']").val();
            var postage_max_money=$("[name='postage_max_money']").val();
            var discount_status = $("input[name='discount_status']:checked").val();
            $(".addimg").each(function(index){
                if(index+1<addimglength){

                    picture[index]=$(this).find("input[name='thumb_image_"+(index+1)+"']").val();
                }
            });
            var formatMoney = true;
            $("input[name='member-price']").each(function(ind,el){
                if($(el).val()){
                    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                    if(!reg.test($(el).val())){
                        formatMoney = false;
                    }
                }
            })
            if(!formatMoney){
                mess_tusi('输入金额格式有误');
                return;
            }
            if (title == '') {
                mess_tusi('请输入标题');
                return;
            }

            if (!content) {
                mess_tusi('请输入正文');
                return;
            }

            if (summary == '') {
                mess_tusi('请输入概要');
                return;
            }
            if (stock == '') {
                mess_tusi('请输入库存');
                return;
            }
            /* 配送地址先注释
            if (range_id == ''|| range_id==null) {
                mess_tusi('请选择配送范围');
                return;
            }
            */
            if(postage_status==2){
                if(postage == ''|| postage==null){
                    mess_tusi('请输入邮费');
                    return;    
                }   
            }
            if(discount_status == 1){
                var discount = []
                $('.member').each(function (ind,item) {
                    var obj = {};
                    if($(item).find("input[name='member-price']").val()){
                        obj.weid = $(item).attr('weid');
                        obj.name = $(item).find("label")[0].innerText;
                        obj.price = $(item).find("input[name='member-price']").val();
                        discount.push(obj)
                    }
                })
            }
            var service=[];
            $('.service_list').each(function (ind,item) {
                var obj = {};
                obj.service_title = $(item).find("input[name='service_title']").val();
                obj.service_content = $(item).find("[name='service_content']").val();
                service.push(obj);

            });
            var sendData = {
                title: title,
                price: price,
                marketprice: market_price,
                cover: cover,
                content: content,
                summary: summary,
                picture: picture,
                stock:stock,
                sort:sort,
                note:note,
                cate_id: cate_id,
                page_id:page_id,
                mall_id:mall_id,
                range_id:range_id,
                postage_status:postage_status,
                postage:postage,
                postage_max_money:postage_max_money,
                discount_status:discount_status,
                discount:discount,
                service:service,
                benefit_status:benefit_status,
                voucher_status:voucher_status,
            }
            // console.log(sendData);

            if ($(this).data("id") !== 1) {
                //sendData.weId = weid;
                // console.log(JSON.stringify(sendData));
                $.ajax({
                    //url: ARTICLE_EDIT,
                    url: GOODS_STORE,
                    type: 'post',
                    data: sendData,
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data){
                        // console.log(data);
                        if (data.code == 200){
                            mess_tusi("商品发布成功");
                            window.location.href = "/user/admin/wemall/goods/list";
                            //window.location.reload();
                        } else {
                            mess_tusi(data.message);
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
            } else {
                sendData.weid=id;
                // console.log(sendData);
                $.ajax({
                    url: GOODS_UPDATE,
                    type: 'post',
                    data: sendData,
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data){
                        // console.log(data);
                        if (data.code == 200){
                            mess_tusi("更新商品成功");
                            window.location.href = "/user/admin/wemall/goods/list";
                            //window.location.reload();
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

// 获取省列表
    var provincename="";
    var getprovincedetail=function(range_id=0){
        $.ajax({
            url:PROVINCE_LIST,
            type:'get',
            headers: {
                        'Token': docCookies.getItem("token")
                    },
            success: function(data){
                // console.log(data);
                if (data.code == 200) {
                     provincename=data.data.name;
                     data.data.list.map(x => {
                     $(".provlist").append('<li><span>'+x.name+'</span><input class="province_check" data-id="'+x.id+'" data-text="'+x.name+'" type="checkbox"></li>')

                     })

                     // 加载js
                     // $("body").append("");

                   /* $.getScript("/user/js/ship_addressmode.js",function(){
                        rangedetail(range_id);
                    })*/


                }else{
                    console.log('PROVINCE LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
//获取省下市
var provcity=function(id){
    $.ajax({
            url:AREA_LIST+'/'+pid,
            type:'get',
            success: function(data){
                // console.log(data);
                if (data.code == 200) {
                    var citydata = data.data.list;
                    citydata.map(x => {
                        // $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");


                    })

                }else{
                    console.log('CITYS  LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
}
getprovincedetail();
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
                'Token': docCookies.getItem("token")
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
                var curr = 'we-shop';
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
    }
*/

   /* //主页初始化
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

    init__(docCookies.getItem("token"));*/
})

// 配送列表
        var rangelist=function(){
            $.ajax({
                    url:GOODS_RANGE_LISTS,
                    type:'post',
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data){
                        // console.log(data);

                        if (data.code == 200) {
                            $(".adressall").children().remove();
                            data.data.map(x => {
                                $(".adressall").prepend('<div class="sa_cum">'+
                                        '<input type="radio" data-val="'+x.weid+'" name="distribution"/>'+
                                        '<h4>'+x.name+'</h4>'+
                                        '<div class="address">'+x.area_names+'</div></div>');

                            })
                        }else{
                            console.log('RANGE  LIST ERROR');
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
        }
        rangelist();






// 外部js文件
$(function(){
    //邮费事件不包邮是弹出需要填写的邮费信息
    $('input[name="postage_status"]').click(function(){
        if($('input[name="postage_status"]:checked').val()==2){

            $(".postage").show();
            $(".postage_max_money").show();       
        }else{
            $(".postage").hide();
            $(".postage_max_money").hide();    
        }
    });
    //添加商品页面---添加修改配送范围
        //添加配送范围
        $(".set_adr").click(function(){
            floadbox(".roadiomode",{
                width:500,
                height:340
            })
        })
        //设置配送范围模板
        $(".add_mode").click(function(){
            modesetInt();
            floadbox(".modeset",{
                width:500,
                height:390,
                type:1
            })
        });
        //选择模版
        $(document).on("change",".roadiomode input[type = radio][name = distribution ]",function(){
            if ($(this).prop("checked")){
                var str = $.trim($(this).next().next().text());
                if ($("#pro_ship_address").find("p").length>0){
                    $("#pro_ship_address").find("p").html(str);
                }else{
                    $("#pro_ship_address").prepend("<p>"+str+"</p>");
                }
                if ($("#pro_ship_address").find("input[name='distribution_id']").length>0){
                    $("#pro_ship_address").find("input[name='distribution_id']").val($(this).data("val"));
                }else{
                    $("#pro_ship_address").find("p").after('<input type="hidden" name="distribution_id" value="'+$(this).data("val")+'"/>');
                }
                $(this).parents(".roadiomode").find("a.close").trigger("click");
            }
        })
        //区域管理页面
        //删除
        $(document).on("click",".sa_list a.del",function(){
            var id = $(this).parents("dl").data("id");
            var params = {id:id};
            $.showConfirm("确认删除模板吗？",function(){
                var cmd_index = $.showLoading("处理中");
                var callback = function(msg){
                    $.hideLoading(cmd_index);
                    if(msg.result == 0){
                        $.showSuccess("删除成功",function(){
                            window.location.reload();
                        });
                    }else{
                        $.showErr(msg.description,function(){
                            if(msg.data){
                                window.location.href = msg.data;
                            }
                        });
                    }
                }
                // requestAjax(params, 'post',del_distributionURL, callback, true);
            })
        })
        //划过
        $(document).on("mouseover",".sa_list dl",function(){
            $(this).find("dd").show();
        }).mouseout(function(){
            $(this).find("dd").hide();
        });
        //编辑
        $(document).on("click",".sa_list a.eidt",function(){
            var id = $(this).parents("dl").data("id");
            $(".setmode_btn").data("id",id);
            var params = {id:id};
            var c_ar = [];
            var get_distributionCallback = function(msg){
                if(msg.result == 0){
                    var area = "";
                    modesetInt();
                    floadbox(".modeset",{
                        width:500,
                        height:390
                    })
                    $("#modeName").val(msg.data.name)
                    address = {};
                    for (var x in msg.data.area_ids ){
                        var c_ar = new Array;
                        var pid = x;
                        var evalStr="regionConf.r"+pid+".c";
                        var regionConfs=eval(evalStr);
                        evalStr+=".";
                        for(var key in regionConfs){
                            var name = eval(evalStr+key+".n");
                            var id = eval(evalStr+key+".i");
                            var chkids = msg.data.area_ids[x];
                            if($.inArray(""+id,chkids) != -1){
                                var $li = '<li><span>'+name+'</span><input type="checkbox" data-text="'+name+'" checked = true data-pid="'+pid+'" data-id="'+id+'" /></li>';
                                $(".cityul").append($li)
                                c_ar.push(id);
                            }else{
                                var $li = '<li><span>'+name+'</span><input type="checkbox" data-text="'+name+'" data-pid="'+pid+'" data-id="'+id+'" /></li>';
                                $(".cityul").append($li)
                            }
                        }
                        allset();
                        address[pid] = c_ar;

                        $(".province input[type=checkbox]").each(function(){
                            if ($(this).data('id') == pid){
                                $(this).attr("checked",true)
                            }
                        })
                    }
                }else{
                    $.showErr(msg.description,function(){
                        if(msg.data){
                            window.location.href = msg.data;
                        }
                    });
                }
            }
            requestAjax(params,'get', get_distributionURL,get_distributionCallback, true);
        })
        //新建模版
        $(".add_mode_btn").click(function(){
            modesetInt();
            floadbox(".modeset",{
                width:500,
                height:390
            })
        });
        //配送范围方法
        //初始
        function modesetInt(){
            $("#modeName").val("");
            $(".province input").attr("checked",false)
            $(".city input[type=checkbox]").attr("checked",false)
            $(".cityul").html("")
        }
        //全选
        function allset(){
            var b = false;
            var allch = $(".cityul").find("input[type=checkbox]");
            allch.each(function(){
                if (!$(this).prop("checked")){
                    b = true;
                    return false;
                }
            })
            if (b){
                $(".ci_check").prop("checked",false)
            }else{
                $(".ci_check").prop("checked",true)
            }
        }
        $(".ci_check").change(function(){
            $(".cityul").find("input[type=checkbox]").prop("checked",true)
        });
        //配送范围地址选择
        var address = {};
        var provinceidstr=[];
        $(".province").on("change","input[type=checkbox]",function(){
            var parentId = $(this).attr("data-id");
            // console.log("parentId:"+parentId);
            var c_ar = [];//市id集合
            var c_ar_text = [];
            if ($(this).prop("checked")){
                //加载市区
                var pid = $(this).data("id");
                provinceidstr.push(pid);//省id集合
                // city start
                // provcity(pid);
                $.ajax({
                    url:AREA_LIST+'/'+pid,
                    type:'get',
                    success: function(data){
                        // console.log(data);
                        if (data.code == 200) {
                            var citydata = data.data.list;
                            citydata.map(x => {
                                // $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");
                                $(".cityul").append('<li><span>'+x.name+'</span><input type="checkbox" data-text="'+x.name+'" checked = true data-pid="'+x.province_id+'" data-id="'+x.id+'" /></li>')
                                c_ar.push(x.id);
                                c_ar_text.push(x.name);
                            })

                        }else{
                            console.log('CITYS  LIST ERROR');
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
                // city end


                /*var evalStr="regionConf.r"+pid+".c";
                var regionConfs=eval(evalStr);
                evalStr+=".";
                for(var key in regionConfs){
                    var name = eval(evalStr+key+".n");
                    var id = eval(evalStr+key+".i");
                    var $li = '<li><span>'+name+'</span><input type="checkbox" checked = true data-pid="'+pid+'" data-id="'+id+'" /></li>';
                    $(".cityul").append($li)
                    c_ar.push(id);
                }
                allset();*/
                address[parentId] = c_ar;
                // console.log(address);
            }else{
                deleteData(address,parentId);
                $(".cityul").find("li input[data-pid = "+parentId+"]").parents("li").remove();
            }
        })
        $(".cityul").on("change","input[type=checkbox]",function(){
            var _This = $(this);
            if ($(this).prop("checked")){
                for (var x in address ){
                    if (x == $(this).attr("data-pid")){
                        address[x].push($(this).data("id"));
                    }
                }
            }else{
                for (var x in address ){
                    if (x == $(this).attr("data-pid")){
                        for (var i=0;i<address[x].length ;i++ ){
                            if (address[x][i] == $(this).data("id")){
                                address[x].splice(i,1)
                            }
                        }
                    }
                }
            }
            allset();
        })
        //保存配送范围模版
        $(".setmode_btn").click(function(){
            var areanamestr=[];

            var page = $(this).data("page")
            var id = $(this).data("id")
            var _this = $(this);
            var modeName = $("#modeName").val()
            if ($.trim(modeName) == ""){
                mess_tusi('请填写模板名称');
                // $.showErr("请填写模板名称");
                return false;
            }
            if (jQuery.isEmptyObject(address)){
                // $.showErr("请选择区域");
                mess_tusi('请选择区域');

                return false;
            }
            var area = "";
            var areaarr=[];
            var areastr=[];
            // var areanamestr="";
            $('.cityul input[type=checkbox]:checked').each(function(){
                // console.log($(this).data("text"));
                areanamestr.push($(this).data("text"));
            })
            // console.log(address);


            for (var x in address ){
                var pid = x;
                var pname = $(".province_check[data-id='"+pid+"']").data("text");
                var snames = [];
                // var evalStr="regionConf.r"+pid+".c";
                // var regionConfs=eval(evalStr);
                // evalStr+=".";
                // console.log(pname);
                $(address[x]).each(function(index,item){
                    // console.log(address[x]);
                    areastr.push(item);
                    areanamestr=$(".cityul input[data-id='"+item+"']").data("text");

                // $(address[x]).map(x=>{
                    // console.log(index,item);
                    // var name =eval(evalStr+"r"+item+".n");
                    snames.push(areanamestr);


                })
                // console.log(snames);
                // areanamestr=snames.join(",");
                // area += pname+"("+areanamestr.join(",")+")";
                // area += pname+"("+snames.join(",")+")";
                areaarr.push( pname+"("+snames.join(",")+")");
            }
            // console.log(area);//省城市names
            // console.log(areaarr);//省城市names
            // console.log(areastr.join(","));//城市id集合
            // 省id集合
            // console.log(provinceidstr.join(","));
            // console.log(areanamestr.join(","));//城市names

            //提交服务器
            var params = {area_names:areaarr.join(","),areas_ids:areastr.join(","),province_ids:provinceidstr.join(","),name:modeName};
            // console.log(params);
            $.ajax({
                    url:GOODS_RANGE_STORE,
                    type:'post',
                    data:params,
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data){
                        // console.log(data);
                        if (data.code == 200) {
                            address = {};

                            $(".setmode_btn").data("id","");
                            _this.prev().trigger("click");
                            mess_tusi("保存成功");
                            // $.showSuccess("保存成功",function(){
                                if(page){
                                    // window.location.reload();
                                }else{

                                    // 配送列表添加
                                    // console.log("tianjia");
                                    rangelist();
                                    /*var modeDiv ='<div class="sa_cum">'+
                                            '<input type="radio" data-val="'+msg.data+'" name="distribution"/>'+
                                            '<h4>'+modeName+'</h4>'+
                                            '<div class="address">'+area
                                            +'</div></div>';
                                    $(".roadiomode .adressall").prepend(modeDiv);*/
                                }
                            // });
                        }else{
                            console.log('RANGE  LIST ERROR');
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
            /*var save_distributionCallback = function(msg){
                address = {};
                if(msg.result == 0){
                    $(".setmode_btn").data("id","");
                    _this.prev().trigger("click");
                    $.showSuccess("保存成功",function(){
                        if(page){
                            window.location.reload();
                        }else{
                            var modeDiv ='<div class="sa_cum">'+
                                    '<input type="radio" data-val="'+msg.data+'" name="distribution"/>'+
                                    '<h4>'+modeName+'</h4>'+
                                    '<div class="address">'+area
                                    +'</div></div>';
                            $(".roadiomode .adressall").prepend(modeDiv);
                        }
                    });
                }else{
                    $.showErr(msg.description,function(){
                        if(msg.data){
                            window.location.href = msg.data;
                        }
                    });
                }
            }*/
            //requestAjax(params, 'post', save_distributionURL, save_distributionCallback, true);
        });


        //配送范围弹层
        function floadbox(id,set){
            var box = $(id);
            var Dw = $(window).width();
            var Dh = $(window).height();
            if ($(".floadbg").length<=0){
                var bg = $("<div class='floadbg'></div>");
                $("body").append(bg);
                bg.css({"width":Dw + "px","height":Dh + "px"});
            }else{
                $(".floadbg").show();
            }
            box.show();
            box.css({"width":set.width+"px","height":set.height + "px","top":(Dh-set.height)/2 + "px","left":(Dw - set.width)/2 + "px"});
            box.find("a.close").on("click",function(){
                address = {};
                box.hide();
                $(".setmode_btn").data("id","");
                if (set.type != 1){
                    $(".floadbg").hide();
                }
            })
        };

        //删除json对像
        function deleteData(json,name) {
            for (var x in json ){
                if (x == name){
                    delete json[x];
                }
            }
        }


});
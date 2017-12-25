/**
 * Created by lisheng on 2017/12/21.
 */

var qiniu_uptoken = '';
var saveto ='qiniu';

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
$('#favicon').attr('href', favicon);

var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
$('#home img').attr('src', logo);


//定义下拉数组

var selectList = [{
    'value': 1,
    'text': '首页'
},{
    'value': 2,
    'text': '文章'
},{
    'value': 3,
    'text': '商城'
},{
    'value': 4,
    'text': '活动'
},{
    'value': 5,
    'text': '圈子'
},{
    'value': 6,
    'text': '项目'
}];

//幻灯列表长度
var slideListLenth=4;
//横幅列表长度
var bannerListLenth=2;

$(document).ready(function(){
    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }


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
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
                if (data.code == 200){
                    console.log(data);
                    if (data.data.domain == null) {
                        //没有个性域名
                        domain = '/index';
                    } else {
                        //存在个性域名
                        domain = "/" + data.data.domain;
                    }
                } else {

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var weid = localStorage.getItem('weid');
    hasDomain(weid);

    //下拉列表初始化
    var initSelect=function (weid) {
        selectList.map(x => {
            $("select[name=style]").append('<option value ="'+x.value+'">'+x.text+'</option>');
        });
    }
    //初始化页面元素
    var createHtml = function (style) {
        $.ajax({
            url: apiUrl + 'pages/banner/detail',
            type: 'post',
            data: {
                user_id: weid,
                style: style
            },
            headers: {
                "Token": localStorage.getItem('token')
            },
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    if(!isNull(data.data)){
                        //修改
                        $("input[name=bannerweid]").val(data.data.weid);
                    }else{
                        //添加
                        $("input[name=bannerweid]").val('');
                    }
                    initSlideHtml(data.data);
                    //初始化横幅列表
                    initBannerHtml(data.data);
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        })
    }
    //幻灯列表初始化
    var initSlideHtml=function (data) {
        $("#slideList").empty();
        $("#slideList").append('<span style="position: absolute;">幻灯管理：</span>');
        if(isNull(data)){
            for(var i=1;i<=slideListLenth;i++){
                var html='<div class="form-group">' +
                    '<input name="thumb_image_slide'+i+'" type="hidden" value="" class="form-control">' +
                    '<input id="slidefiles_'+i+'" name="front" type="file" class="form-control hide">' +
                    '<div id="look">' +
                    '<img style=" margin-top:0px;" onclick="$(\'#slidefiles_'+i+'\').click()" id="img'+i+'" src="http://image.qqxqs.com/common/1502085164249.jpg" alt="" class="thumbnail">' +
                    '</div>' +
                    '</div>' +
                    '<span style="margin-left: 120px;position: relative;display: block;top: -20px;">*支持JPG、JPEG、PNG、BMP的图片，图片尺寸 建议为：1920*489， 图片小于4M</span>'+
                    '<input type="text" class="form-control" name="slide_href'+i+'" value="" placeholder="跳转链接地址" style="' +
                    '    width: 400px;margin-bottom: 15px;margin-left: 120px;' +
                    '">';
                $("#slideList").append(html);
            }
        }else{
            //获取图片链接
            var imgArr=[];
            if(!isNull(data.slide)){
                imgArr=JSON.parse(data.slide)
            }
            var newImgArr=[];
            for(var i=1;i<=imgArr.length;i++){
                newImgArr[i]=imgArr[i-1];
            }
            for(var i=1;i<=slideListLenth;i++){
                var hiddenUrl='';
                var thumbnailUrl='http://image.qqxqs.com/common/1502085164249.jpg';
                var href='';
                if(!isNull(newImgArr[i])){
                    hiddenUrl=newImgArr[i].src;
                    if(!isNull(newImgArr[i].src)){
                        thumbnailUrl=ApiMaterPlatQiniuDomain+newImgArr[i].src;
                    }
                    href=newImgArr[i].href;
                }
                var html='<div class="form-group">' +
                    '<input name="thumb_image_slide'+i+'" type="hidden" value="'+hiddenUrl+'" class="form-control">' +
                    '<input id="slidefiles_'+i+'" name="front" type="file" class="form-control hide">' +
                    '<div id="look">' +
                    '<img style=" margin-top:0px;" onclick="$(\'#slidefiles_'+i+'\').click()" id="img'+i+'" src="'+thumbnailUrl+'" alt="" class="thumbnail">' +
                    '</div>' +
                    '</div>' +
                    '<span style="margin-left: 120px;position: relative;display: block;top: -20px;">*支持JPG、JPEG、PNG、BMP的图片，图片尺寸 建议为：1920*489， 图片小于4M</span>'+
                    '<input type="text" class="form-control" name="slide_href'+i+'" value="'+href+'" placeholder="跳转链接地址" style="' +
                    '    width: 400px;margin-bottom: 15px;margin-left: 120px;' +
                    '">';
                $("#slideList").append(html);
            }
        }
        for(var i=1;i<=slideListLenth;i++){
            //实例上传
            uploaderSlide(i);
        }

    }
    //绑定上传
    var uploaderSlide=function (i) {
        var up = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'slidefiles_'+i,
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
                    var sourceLink = res.key;
                    $("#img"+i).attr('src', domain + sourceLink);
                    $("input[name=thumb_image_slide"+i+"]").val(sourceLink);

                },
                'Error': function(up, err, errTip) {
                },
                'UploadComplete': function() {
                },
                'Key': function(up, file) {
                    var key = "pages/banner/";
                    key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                    return key;
                }
            }
        });
        return up;
    }
    var initBannerHtml=function (data) {
        $("#bannerList").empty();
        $("#bannerList").append('<span style="position: absolute;">小横幅管理：</span>');
        if(isNull(data)){
            for(var i=1;i<=bannerListLenth;i++){
                var html='<div class="form-group">'+
                    '<input name="thumb_image_banner'+i+'" type="hidden" value="" class="form-control">'+
                    '<input id="bannerfiles_'+i+'" name="back" type="file" class="form-control hide">'+
                    '<div id="look-1">'+
                    '<img style=" margin-top:0px;" onclick="$(\'#bannerfiles_'+i+'\').click()" id="img-'+i+'" src="http://image.qqxqs.com/common/1502085164249.jpg" alt="" class="thumbnail">'+
                    '</div>'+
                    '</div>'+
                    '<span style="margin-left: 120px;position: relative;top: -20px;">* 图片尺寸建议为：380*133，图片小于2M</span>'+
                    '<input type="text" class="form-control" name="banner_href'+i+'" value="" placeholder="跳转链接地址" style="' +
                    '    width: 400px;margin-bottom: 15px;margin-left: 120px;' +
                    '">';
                $("#bannerList").append(html);
            }
        }else{
            var imgArr=[];
            if(!isNull(data.banner)){
                imgArr=JSON.parse(data.banner)
            }
            var newImgArr=[];
            for(var i=1;i<=imgArr.length;i++){
                newImgArr[i]=imgArr[i-1];
            }
            for(var i=1;i<=bannerListLenth;i++){
                var hiddenUrl='';
                var thumbnailUrl='http://image.qqxqs.com/common/1502085164249.jpg';
                var href='';
                if(!isNull(newImgArr[i])){
                    hiddenUrl=newImgArr[i].src;
                    if(!isNull(newImgArr[i].src)){
                        thumbnailUrl=ApiMaterPlatQiniuDomain+newImgArr[i].src;
                    }
                    href=newImgArr[i].href;
                }
                var html='<div class="form-group">'+
                    '<input name="thumb_image_banner'+i+'" type="hidden" value="'+hiddenUrl+'" class="form-control">'+
                    '<input id="bannerfiles_'+i+'" name="back" type="file" class="form-control hide">'+
                    '<div id="look-1">'+
                    '<img style=" margin-top:0px;" onclick="$(\'#bannerfiles_'+i+'\').click()" id="img-'+i+'" src="'+thumbnailUrl+'" alt="" class="thumbnail">'+
                    '</div>'+
                    '</div>'+
                    '<span style="margin-left: 120px;position: relative;top: -20px;">* 图片尺寸建议为：380*133，图片小于2M</span>'+
                    '<input type="text" class="form-control" name="banner_href'+i+'" value="'+href+'" placeholder="跳转链接地址" style="' +
                    '    width: 400px;margin-bottom: 15px;margin-left: 120px;' +
                    '">';
                $("#bannerList").append(html);
            }

        }
        for(var i=1;i<=bannerListLenth;i++){
            //实例上传
            uploaderBanner(i);
        }

    }
    //绑定上传
    var uploaderBanner=function (i) {
        var up = Qiniu.uploader({
            runtimes: 'html5,flash,html4',
            browse_button: 'bannerfiles_'+i,
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
                    var sourceLink = res.key;
                    $("#img-"+i).attr('src', domain + sourceLink);
                    $("input[name=thumb_image_banner"+i+"]").val(sourceLink);

                },
                'Error': function(up, err, errTip) {
                },
                'UploadComplete': function() {
                },
                'Key': function(up, file) {
                    var key = "pages/banner/";
                    key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                    return key;
                }
            }
        });
        return up;
    }

    $("select[name=style]").change(function () {
        createHtml($(this).val());
    });


    var init = function(weid) {
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    initSelect(weid);
                    //初始化幻灯列表
                    createHtml($("select[name=style]").val());
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

    init(weid);

    //保存
    $("#save").click(function() {

        $flag=$("input[name=bannerweid]").val();
        //组织数据
        var slide=[];
        var slideObj=$("#slideList").find(".form-group");
        var regex =/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/i;
        for(var i=0;i<slideObj.length;i++){
            if(!regex.test($("input[name=slide_href"+(i+1)+"]").val())&&!isNull($("input[name=slide_href"+(i+1)+"]").val())){
                layer.msg("链接地址不合法必须是http://或者https://开头", {
                    time: 1500
                });

                return false;
            }
            //判断是否为空
            /*
            if(isNull($("input[name=thumb_image_slide"+(i+1)+"]").val())){
                layer.msg("广告幻灯图片为空", {
                    time: 1500
                });
                return false;
            }
            */
            slide.push({'src':$("input[name=thumb_image_slide"+(i+1)+"]").val(),'href':$("input[name=slide_href"+(i+1)+"]").val()});
        }

        var banner=[];
        var bannerObj=$("#bannerList").find(".form-group");
        for(var i=0;i<bannerObj.length;i++){
            //正则判断链接地址是否合法
            if(!regex.test($("input[name=banner_href"+(i+1)+"]").val())&&!isNull($("input[name=banner_href"+(i+1)+"]").val())){
                layer.msg("链接地址不合法必须是http://或者https://开头", {
                    time: 1500
                });
                return false;
            }
            //判断是否为空
            /*
            if(isNull($("input[name=thumb_image_banner"+(i+1)+"]").val())){
                layer.msg("广告横幅图片为空", {
                    time: 1500
                });
                return false;
            }
            */
            banner.push({'src':$("input[name=thumb_image_banner"+(i+1)+"]").val(),'href':$("input[name=banner_href"+(i+1)+"]").val()});
        }
        if(!isNull($flag)){
            //修改
            var sendData={
                weid:$("input[name=bannerweid]").val(),
                style:$("select[name=style]").val(),
                slide:slide,
                banner:banner
            };
            $.ajax({
                url: apiUrl + 'pages/banner/update',
                type: 'post',
                data: sendData,
                headers: {
                    "Token": localStorage.getItem('token')
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 200) {
                        layer.msg("修改成功", {
                            time: 1500
                        });
                    } else {
                        layer.msg(data.message, {
                            time: 1500
                        });
                    }
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
        }else{
            //添加
            var sendData={
                style:$("select[name=style]").val(),
                slide:slide,
                banner:banner
            };
            $.ajax({
                url: apiUrl + 'pages/banner/store',
                type: 'post',
                data: sendData,
                headers: {
                    "Token": localStorage.getItem('token')
                },
                dataType: 'json',
                success: function (data) {
                    if (data.code == 200) {
                        $("input[name=bannerweid]").val(data.data);
                        layer.msg("保存成功", {
                            time: 1500
                        });
                    } else {
                        layer.msg(data.message, {
                            time: 1500
                        });
                    }
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
        }

    })
})
/**
 * Created by yangzi on 2017/8/9.
 */

var qiniu_uptoken = '';
var saveto ='qiniu';
var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = 'http://oty3r3tmi.bkt.clouddn.com/';
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

$(document).ready(function() {
    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    var tusitemp="";
    $("#middle, #right").height(currHeight);

    $(window).resize(function () {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function () {
        $(".add").show();
    }, function () {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function () {
        $(".avatar").show();
    }, function () {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    $('.upload').click(function () {
        $('.form-horizontal').css("display", "block")
    })

    $('.top .y i').click(function () {
        $('.form-horizontal').css("display", "none")
    })

    $('.phone input').change(function (){
        var phone = $('.phone input').val();
        //正则验证
        var myreg =/^1[0-9]{10}$/;
        var result = myreg.test(phone);
        if(!result){
            $('.phone span').css("display","block")
        }else{
            $('.phone span').css("display","none")
        }
    });

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

                var sourceLink = domain + res.key;
                $("#img").attr('src', sourceLink);
                $("input[name=thumb_image]").val(sourceLink);
                // console.log($("input[name=thumb_image]").val());

            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "pages/article/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var weid = docCookies.getItem("weid");
    var token = docCookies.getItem("token");
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    function userInfo(data) {
        var userInfo = data.data;
        $("#img").attr('src', userInfo.avatar);
        $(".name input").val(userInfo.real_name);
        $(".phone input").val(userInfo.phone);
        switch(userInfo.sex){
            case 1: $(".unknown").attr("checked", true);break;
            case 2: $(".female").attr("checked", true);break;
            case 3: $(".male").attr("checked", true);break;
        }
        $(".information textarea").val(userInfo.motto);
    }

    $.ajax({
        url: USERDETAIL + '/' + docCookies.getItem("weid"),
        //url: USERDETAIL,
        success: function (data) {
            console.log(data);
            if (data.code === 200) {
                userInfo(data);
            } else {
                console.error(data.message);
            }
        }
    })

    var gend = 1;
    $(".unknown").click(function(){
        gend = 1;
    })
    $(".female").click(function(){
        gend = 2;
    })
    $(".male").click(function(){
        gend = 3;
    })



    //更新用户资料
    var update = function(){
        var avatar = $("input[name=thumb_image]").val();
        var name = $('.name input').val();
        var phone = $('.phone  input').val();
        var gender = gend;
        //var province = $('#province').val();
        var city = $('#city').val();
        var wx = false;
        var summary = $('.information textarea').val();

        var send = {
            'avatar': avatar,
            'real_name': name,
            'phone': phone,
            'sex': gender,
            'motto': summary
        }

        //console.log(send);

        $.ajax({
            url: USERINFO + '/' + docCookies.getItem("weid"),
            type: 'POST',
            data: send,
            success:function (data) {
                console.log(data);
                if(data.code === 200) {
                    console.log(data);
                    mess_tusi('保存设置成功');
                    window.location.href = '/center/';
                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(error) {
                console.error(error);
            }
        })
    }

    $(".update").click(function(){
        update();
    })
})

alert('hi')
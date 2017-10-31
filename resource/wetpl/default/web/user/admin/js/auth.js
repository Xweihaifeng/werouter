/**
 * Created by Hongguang on 2017/8/29.
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

$(document).ready(function(){
    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
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
                $("input[name=thumb_image_1]").val(sourceLink);

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

    var name;
    var id;
    $("#id-name").blur(function(){
        name = $("#id-name").val();
        console.log(name)
        if (name != '') {
            $(".correct-name").show();
            $(".correct-name img").attr('src', 'img/selected.png');
        } else {
            $(".correct-name").show();
            $(".correct-name img").attr('src', 'img/close.png');
        }
    })

    $("#id-name").focus(function(){
        $(".correct-name").hide();
    })

    $("#id-number").blur(function(){
        name = $("#id-number").val();
        console.log(name)
        if (name != '' && name.length == 15 || name.length == 18) {
            $(".correct-id").show();
            $(".correct-id img").attr('src', 'img/selected.png');
        } else {
            $(".correct-id").show();
            $(".correct-id img").attr('src', 'img/close.png');
        }
    })

    $("#id-number").focus(function(){
        $(".correct-id").hide();
    })

    $("#submit").click(function(){
        var name = $("#id-name").val();
        var id = $("#id-number").val();
        var front = $("input[name=thumb_image]").val();
        var back = $("input[name=thumb_image_1]").val();
    })
})
    
var qiniu_uptoken = '';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;

$(document).ready(function(){

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'member_pickfiles_1',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        // container: 'member_exhibition_1',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        // drop_element: 'member_exhibition_1',
        chunk_size: '4mb',
        auto_start: true,
        filters: {
            mime_types : [
                {title : "doc file submit", extensions: "doc,docx"}
            ]
        },
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
                $("#member_pic_1").attr('src', "/common/img/doxc.png");
                $("#member_upload_1").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/member/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var uploader2 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'member_pickfiles_2',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        container: 'member_exhibition_2',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'member_exhibition_2',
        chunk_size: '4mb',
        auto_start: true,
        filters: {
            mime_types : [
                {title : "doc file submit", extensions: "doc,docx"}
            ]
        },
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
                $("#member_pic_2").attr('src', "/common/img/doxc.png");
                $("#member_upload_2").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/member/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var uploader3 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'member_pickfiles_3',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        container: 'member_exhibition_3',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'member_exhibition_3',
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
                $("#member_pic_3").attr('src', sourceLink);
                $("#member_upload_3").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/member/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var uploader4 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'member_pickfiles_4',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        container: 'member_exhibition_4',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'member_exhibition_4',
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
                $("#member_pic_4").attr('src', sourceLink);
                $("#member_upload_4").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/member/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var uploader5 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'member_pickfiles_5',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        container: 'member_exhibition_5',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'member_exhibition_5',
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
                $("#member_pic_5").attr('src', sourceLink);
                $("#member_upload_5").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/member/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var uploader6 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'member_pickfiles_6',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        container: 'member_exhibition_6',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'member_exhibition_6',
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
                $("#member_pic_6").attr('src', sourceLink);
                $("#member_upload_6").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/member/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var uploader7 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'member_pickfiles_7',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        container: 'member_exhibition_7',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'member_exhibition_7',
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
                $("#member_pic_7").attr('src', sourceLink);
                $("#member_upload_7").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/member/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var uploader8 = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'member_pickfiles_8',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: qiniu_bucket_domain,
        container: 'member_exhibition_8',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'member_exhibition_8',
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
                $("#member_pic_8").attr('src', sourceLink);
                $("#member_upload_8").val(res.key);
            },
            'Error': function(up, err, errTip) {
            },
            'UploadComplete': function() {
            },
            'Key': function(up, file) {
                var key = "plat/member/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var column_list = function(data) {
        if(data.title == '入会申请') {
            var template = `<a class="chan_li cate-active-on" id="`+ data.domain +`" href="/member/apply"> `+ data.title +` </a>`
        } else {
            var template = `<a class="chan_li" id="`+ data.domain +`" href="/org/`+ data.domain +`"> `+ data.title +` </a>`;
        }
        return template;
    }

    // 查询组织栏目分类
    $.ajax({
        // url: CMS_CHANNEL_CATEGORIES + "9fa0bea0-7d7f-11e7-92a8-6585efb9cefe",
        url: apiUrl + "/cms/channel_categories?channel=org",
        dataType: 'json',
        success: function(data){
            console.log(data.data);
            $.map(data.data, function(item, index) {
                $(".member_top_disperse").append(column_list(item));
            });
        },
        error: function(xhr){
            console.log(xhr);
        }
    });

    var options1 = $.get(CMS_CHANNELS_DOMAIN_QUERY + "org");
    options1.done(function(data) {
        if(data.code == -200) {
            console.info(data.message);
            return false;
        }
        if(data.code === 200) {
            var thumb_image = data.data.big_image;

            if(!thumb_image) {
                thumb_image = "/common/img/org_banner01.jpg";

            } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                thumb_image = imgSet(thumb_image, 1100, 320, 3);
            }
            $(".member_top_nav").css("background-image", `url(`+ thumb_image + `)`);
        } else {
            console.error(data.message);
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });

});
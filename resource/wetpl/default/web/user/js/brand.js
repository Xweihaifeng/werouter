 //列表折叠
sessionStorage.listname='we-set';
var qiniu_uptoken = '';
var saveto ='qiniu';

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
console.log('logo:',logo);
$('#home img').attr('src', logo);


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
    var tusitemp="";

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
              /*if (data.code == 401) {            
                domain = '/index';
                localStorage.removeItem('token')
                window.location.href = '/login'
              }*/
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
/*
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
    })*/

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

                //var sourceLink = domain + res.key;
                var sourceLink = res.key;
                $("#img").attr('src', domain + sourceLink);
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

                //var sourceLink = domain + res.key;
                var sourceLink = res.key;
                $("#img_1").attr('src', domain + sourceLink);
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
                var curr = 'we-set';
                var status = true;
                var list = ['we-set','we-art','we-shop','we-active','we-project','we-app','we-crm','we-log'];

                var remove = function(id, list) {
                    return list.filter(x => x != id);
                }

                $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                $("." + curr + " span img").css("transform", "rotate(90deg)");
                remove(curr, list).map(x => $("." + x + ":eq(1)").stop().hide());

                var showList = function(state, id) {
                    var id = "." + id;
                    if (state) {
                        $(id + ":eq(1)").stop().hide(300);
                        if (id != ".we-log") {
                            $(id + ":eq(0)").css("border-bottom", "0");
                        }
                        $(id + " span img").css("transform", "rotate(0deg)")
                        status = false;
                    } else {
                        $(id + ":eq(1)").stop().show(300);
                        $(id + " span img").css("transform", "rotate(90deg)")
                        $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                        status = true;
                    }
                }

                list.map(x => {
                    $("." + x).click(function() {
                        var isCont = $(this).attr('class').search('we-cont');
                        if (isCont == 0) {
                            return;
                        }
                        if (curr == x) {                            
                            showList(status, x);
                        } else {
                            status = false;
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").stop().hide(300)
                                $("." + x + " span img").css("transform", "rotate(0deg)")
                            });
                            if (curr != "we-log") {
                                $("." + curr + ":eq(0)").css("border-bottom", "0");
                            }
                            curr = x;                            
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

    var req;
    var id;
    var init = function(weid) {
        // moduleState();
        $.ajax({
            url: BRAND_DETAIL_USER + '/' + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data);

                    if (data.data == null) {
                        id = weid;
                        console.log('store')
                        req = store;
                    } else {
                        id = data.data.weid;
                        var brandLogo = data.data.logo;
                        var loginLogo = data.data.logo_login;
                        $("#brand-name").val(data.data.title);
                        if (data.data.business != null) {
                            $('#business').val(data.data.business);
                        }

                        if (brandLogo != null) {
                            $("#img").attr("src", ApiMaterPlatQiniuDomain + brandLogo);
                        }

                        if (loginLogo != null) {
                            $("#img_1").attr("src", ApiMaterPlatQiniuDomain + loginLogo);
                        }

                        $('#customerLink').val(data.data.customer_link);
                        $('#customerTel').val(data.data.customer_tel);
                        if (data.data.slogan != null) {
                            $('#slogan').val(data.data.slogan);
                            $("#count").text('剩余字数：' + data.data.slogan.length + '/68');
                        }
                        console.log('update')
                        req = update;
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

    var weid = localStorage.getItem('weid');
    //console.log(weid)
    init(weid);

    var store = function(sendData){
        $.ajax({
            url: BRAND_STORE,
            type: 'POST',
            data: sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data)
                    // mess_tusi("保存设置成功");
                    //window.location.reload();
                    layer.msg("保存设置成功", {
                        time: 1500
                    });
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                    // mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var update = function(sendData){
        $.ajax({
            url: BRAND_UPDATE,
            type: 'POST',
            data: sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data)
                    layer.msg("保存设置成功", {
                        time: 1500
                    });
                    // mess_tusi("保存设置成功");
                    //window.location.reload();
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                    // mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var words = 0;
    $("#slogan").keyup(function() {
        words = $('#slogan').val();
        $("#count").text('剩余字数：' + words.length + '/60');
    });

    $("#save").click(function() {
        var brandName = $("#brand-name").val();
        var brandLogo = $("input[name=thumb_image]").val();
        var loginLogo = $("input[name=thumb_image_1]").val();
        var business = $('#business').val();
        var customerLink = $("#customerLink").val();
        var customerTel = $("#customerTel").val();
        var sendData = {weid: id};
        var slogan = $('#slogan').val();
        sendData['title'] = brandName;
        sendData['logo'] = brandLogo;
        sendData['logo_login'] = loginLogo;
        sendData['business'] = business;
        sendData['customer_link'] = customerLink;
        sendData['customer_tel'] = customerTel;
        sendData['slogan'] = slogan;

        var res = {}

        for(var key in sendData){
            //console.log(key)
            //console.log(sendData[key])
            if (sendData[key] != "") {
                console.log(key)
                res[key] = sendData[key];
            }
        }

        if (req == undefined) {
            req = store;
            req(res);
            // console.log(sendData);
        } else {
            req(res);
            console.log(res)
        }
    })
})
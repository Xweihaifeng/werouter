/**
 * Created by Hongguang on 2017/8/29.
 */
 //列表折叠
sessionStorage.listname='we-set';

var qiniu_uptoken = '';
var saveto ='qiniu';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;

var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
$('#home img').attr('src', logo);

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
$('#favicon').attr('href', favicon);

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

     var domain;
     var hasDomain = function(weid){
        $.ajax({
           url: PAGES_PAGE_GETDETAILBYUSER + weid,
           type: 'GET',
           headers: {
             'Token': docCookies.getItem("token")
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

    var weid = docCookies.getItem("weid");
    hasDomain(weid);

 /*   var isLogin = false; //判断用户登陆与否
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

    var login = function(){
        window.location.href = "/login";
    }*/

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    //编辑器设置
    CKEDITOR.replace('editor1',{"extraPlugins":"filebrowser,image,imagepaste,filetools"});
    CKEDITOR.replace('editor2',{"extraPlugins":"filebrowser,image,imagepaste,filetools"});
    __init();

    var isOrg = 1;
    $("#original").click(function(){
        if (isOrg == 1){
            isOrg = 2;
        } else {
            isOrg = 1;
        }
    })

    var priv = 1;
    $("#yes").click(function(){
        priv = 2;
        $(this).prop("checked", true);
        $("#no").prop("checked", false);
    })

    $("#no").click(function(){
        priv = 1;
        $(this).prop("checked", true);
        $("#yes").prop("checked", false);
    })

    var height = $(window).height()
    $(".left-nav, #middle").css('height', height)

    $("#add").hover(function(){
        $(".add").show();
    }, function(){
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function(){
        $(".avatar").show();
    }, function(){
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function(){
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

 /*   //模块
    var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
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
        moduleState();
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
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
                        var aboutUs = data.data.about_us;
                        var linkUs = data.data.link_us;
                        var shareImg = data.data.share_image;
                        CKEDITOR.instances.editor1.setData(aboutUs);
                        CKEDITOR.instances.editor2.setData(linkUs);
                        if (shareImg != null && shareImg != "") {
                            $("#img").attr("src", shareImg);
                        }
                        console.log('update')
                        req = update;
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
    //console.log(weid)
    init(weid);

    var store = function(sendData){
        $.ajax({
            url: PAGESTORE,
            type: 'POST',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data)
                    layer.msg("保存设置成功", {
                        time: 1500
                    });
                    //window.location.reload();
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

    var update = function(sendData){
        $.ajax({
            url: PAGES_UPDATE,
            type: 'POST',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data)
                    layer.msg("保存设置成功", {
                        time: 1500
                    });
                    //window.location.reload();
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

    var hasData = function(content) {
        if (content != '') {
            return true;
        } else {
            return false;
        }
    }

    //提交
    $("#save").click(function(){
        var cover = $("input[name=thumb_image]").val();
        var content1 = CKEDITOR.instances.editor1.getData();
        var content2 = CKEDITOR.instances.editor2.getData();
        var isCover = false;
        var isContent1 = false;
        var isContent2 = false;
        var sendData = {weid: id};

        isCover = hasData(cover);
        isContent1 = hasData(content1);
        isContent2 = hasData(content2);

        if (isCover) {
            sendData['share_image'] = cover
        }

        if (isContent1) {
            sendData['about_us'] = content1
        }

        if (isContent2) {
            sendData['link_us'] = content2
        }

        if (req == undefined) {
            req = store;
            req(sendData);
            console.log(sendData);
        } else {
            req(sendData);
        }

        //window.location.reload();

        console.log(sendData)
    })

    //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css({
                "line-height": "65px",
                "padding-top": "15px"
            });
            $("#" + id + " .word").css("margin-top", "-20px");
        } else {
            if (!isLogin) {
                //$(this).find(".word").show();
                $(this).css({
                    "line-height": "65px",
                    "padding-top": "15px"
                });
                $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })

    //主页初始化
   /* var init__ = function(token){
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

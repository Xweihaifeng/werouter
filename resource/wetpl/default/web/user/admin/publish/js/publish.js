/**
 * Created by Hongguang on 2017/8/6.
 */
var qiniu_uptoken = '';
var saveto ='qiniu';
var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = 'http://oty3r3tmi.bkt.clouddn.com/';
// const ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('favicon:',favicon);
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

    var domain;
     var hasDomain = function(weid){
         $.ajax({
            url: 'http://apitest.wezchina.com/pages/page/getDetailByUser/' + weid,
            type: 'GET',
            headers: {
              'Token': docCookies.getItem("token")
            },
            success: function(data){            
               if (data.code == 401) {            
                 // domain = '/index';                 
                 localStorage.removeItem('token')
                 // window.location.href = '/login'
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

    //router
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

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:',logo);
    $('#home img').attr('src', logo);

    var login = function(){
        window.location.href = "/login";
    }

    //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css("line-height", "65px");
            $("#" + id + " .word").css("margin-top", "-30px");
        } else {
            if (!isLogin) {
                $(this).find(".word").show();
                $(this).css("line-height", "65px");
                $("#" + id + " .word").css("margin-top", "-30px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })

    /*//主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();

            $("#avatar .avatar-icon").css({
                'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100% 100%'
            })
        }
    }

    init(docCookies.getItem("token"));*/

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    $("#article, #project, #active, #shopping, #zone").hover(function(){
        $(this).find(".word").show()
    }, function(){
        $(this).find(".word").hide();
    })

    $("#login, #article, #project, #active, #shopping, #zone").hover(function(){
        $(this).css("line-height", "60px");
        var id = $(this).attr("id");
        $("#" + id + " .word").css("margin-top", "-30px");
    }, function(){
        $(this).css("line-height", "80px");
        var id = $(this).attr("id");
        $("#" + id + " .word").css("margin-top", "-55px");
    })

    var artType = [];
    var type = function(callback){
        $.ajax({
            url: ARTICLES_CATES,
            type: 'get',
            success: function(data){
                if (data.code == 200) {
                    var type = data.data;
                    type.map(x => {
                        $(".art-type select").append(
                            '<option id=' + x.weid + '>' + x.name + '</option>'
                        )
                        artType.push({id: x.weid, name: x.name});
                    })
                    console.log(artType);
                if (callback != undefined){
                    callback();
                }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    type();
    //编辑器设置
    CKEDITOR.replace('editor1',{"extraPlugins":"filebrowser,image,imagepaste,filetools"});
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

    var edit = function(){
        if (weid != null) {
            $.ajax({
                url: ARTICLE + '/' + weid,
                type: 'get',
                success: function(data){
                     console.log(data);
                    if (data.code == 200){
                        var art = data.data
                        $("#head").val(art.title);
                        $("#author").val(art.auth);
                        $("#issuer").val(art.publisher);
                        $("#source").val(art.source);
                        option = artType.filter(x => x.id == art.cate_id)[0].name;
                        $(".art-type select").val(option);
                        if (art.is_original == 1) {
                            $("#original").prop("checked", false);
                        } else {
                            $("#original").prop("checked", true);
                        }
                        CKEDITOR.instances.editor1.setData(art.content);
                        if (art.cover != "") {
                            $(".image-upload").css({
                                "background": "url(" + art.cover + ") no-repeat center",
                                "background-size": "100%"
                            })
                        }
                        $("#summary").val(art.summary);
                        if (art.is_private == 1){
                            $("#yes").prop("checked", false);
                            $("#no").prop("checked", true);
                        } else {
                            $("#yes").prop("checked", true);
                            $("#no").prop("checked", false);
                        }
                        $("#art-link").val(art.href);
                        console.log(art.cover);
                        //$("#img").val(art.cover);
                        $("#img").attr('src',art.cover);
                        $("input[name=thumb_image]").val(art.cover);

                       // $("#pickfiles").val(art.cover);
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        } else {
            function onSave(){
                if(CKEDITOR.instances.editor1.getData()==""){
                    //console.log("内容不能为空！");
                    return false;
                }else {
                    return CKEDITOR.instances.editor1.getData();
                }
            }

        }
    }

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

    //提交
    $(".art-submit").click(function(){
        var title = $("#head").val();
        var author = $("#author").val();
        var issuer = $("#issuer").val();
        var source = $("#source").val();
        var option = $(".art-type select").val();
        option = artType.filter(x => x.name == option)[0].id;
        //var article = onSave();
        var summary = $("#summary").val();
        var cover = $("input[name=thumb_image]").val();
        var link = $("#art-link").val();
       // var isOrg = $("#original").val();
        var content = CKEDITOR.instances.editor1.getData();

       // console.log(cover);

        if (title == '') {
            mess_tusi('请输入标题');
            return;
        }

        if(author != ''){
            author = author.substring(0, 8);
        }

        if (!content) {
            mess_tusi('请输入正文');
            return;
        }

        if (summary == '' && (content.substring(0, 54).indexOf('<img') == -1)) {
            // mess_tusi('请输入概要');
            summary = content.substring(0, 54);
            // return;
        } else if (summary != ''){
            summary = summary;            
        } else if (content.substring(0, 54).indexOf('<img') != -1) {
            mess_tusi('请输入摘要，且不能含有图片');
            return;
        }

        var sendData = {
            title: title,
            auth: author,
            source: source,
            is_original: isOrg,
            content: content,
            href: link,
            cover: cover,
            summary: summary,
            cate_id: option,
            is_private: priv,
            publisher: issuer
        }

        if (weid.length === 36) {
            //sendData.weId = weid;
            console.log(JSON.stringify(sendData));
            $.ajax({
                //url: ARTICLE_EDIT,
                url: 'http://apitest.wezchina.com/articles/updated/' + weid,
                type: 'post',
                data: sendData,
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data){
                    if (data.code == 200){
                        mess_tusi("修改文章成功");
                        window.location.href = "/user/admin/center";
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
            $.ajax({
                url: ARTICLE_UPLOAD,
                type: 'post',
                data: sendData,
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data){
                    if (data.code == 200){
                        mess_tusi("发表文章成功");
                        window.location.href = "/user/admin/center";
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

    var weid = window.location.href.split("/").pop();
    if (weid.length === 36) {
        console.log(weid);
        type(edit);
    }

 var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: 'http://apitest.wezchina.com/pages/modulerun/list',
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
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-art';
                var status = true;
                var list = ['we-set', 'we-art', 'we-shop', 'we-app', 'we-log'];

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
                        $(id + " span img").attr('src', '../common/img/more1.png');
                        status = false;
                    } else {
                        $(id + ":eq(1)").show(500);
                        $(id + " span img").attr('src', '../common/img/more_unfold.png');
                        $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                        status = true;
                    }
                }

                list.map(x => {
                    $("." + x).click(function() {
                        if (curr == x) {
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '../common/img/more1.png');
                            });
                            showList(status, x);
                        } else {
                            status = false;
                            $("." + curr + ":eq(0)").css("border-bottom", "0");
                            curr = x;
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '../common/img/more1.png');
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

    //主页初始化
    var init__ = function(token){
      moduleState()
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

    init__(docCookies.getItem("token"));
})
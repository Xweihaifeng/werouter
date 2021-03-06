/**
 * Created by Hongguang on 2017/8/6.
 */
var qiniu_uptoken = '';
var saveto ='qiniu';
var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = 'http://oty3r3tmi.bkt.clouddn.com/';
// const ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';

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
    //route
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

    var login = function(){
        window.location.href = "/login";
    }

    //主页初始化
    var isLogin = false;
    var init = function(token){
        if (token != 'null' && token != undefined) {
            isLogin = true;
            $(".left-nav, .login, #middle, #right").show();

            //加载用户头像
            $("#login div").css({
                'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100% 100%'
            })

            $("#avatar .avatar-icon").css({
                'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100% 100%'
            })
        } else {
            login();
        }
    }

    init(docCookies.getItem("token"));

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }

    var weid = getUrlParam('id');
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
                        $("#img").val(art.cover);
                        $("#pickfiles").attr('src',art.cover);

                        //点击提交

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

    type(edit);

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
                $("input[name=thumb_image]").val(res.key);
                var sourceLink = domain + res.key;
                $("#img").attr('src', sourceLink);
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
        var cover = $("#pickfiles").val();
        var link = $("#art-link").val();
       // var isOrg = $("#original").val();
        var content = CKEDITOR.instances.editor1.getData();

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
            publisher: issuer,

        }

        //console.log(sendData)

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
                    window.location.reload();
                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    })
})
/**
 * Created by Yaoer on 2017/8/6.
 */

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
                window.location.href = "../../center/discovery";
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

    //var weid = getUrlParam('id');
    var weid = window.location.href.split('/').pop();
    if (weid.length != 36) {
        weid = null;
    }
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
                    callback();
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

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
                        eval("CKEDITOR.replace('editor1')");
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

                        //点击提交

                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        } else {
            eval("CKEDITOR.replace('editor1')");
            function onSave(){
                if(CKEDITOR.instances.editor1.getData()==""){
                    //console.log("内容不能为空！");
                    return false;
                }else {
                    return CKEDITOR.instances.editor1.getData();
                }
            }
            function ckeditorUpload(file){
                $('#cke_76_textInput').val(file);
                $('#cke_134_label').click();
            }
        }
    }

    type(edit);

    var height = $(window).height()
    $(".left-nav, #middle").css('height', height)

    //$('.editor').wysiwyg();

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

    var successUpload;
    var url = "http://localhost:8100/upload";
    var upload = function(formdata, method){
        var prog = function(n){
            $(".progress").show();
            $(".active-pro").show();
            $(".text").show();
            $(".active-pro").css("width", n * 3 + "px");
            $(".text").text(n + "%");
        };

        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", url);
        xhr.send(formdata);

        function uploadProgress(evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                console.log(percentComplete);
                prog(percentComplete);
            }
            else {
            }
        }

        function uploadComplete(evt) {
            var data = JSON.parse(evt.target.responseText);
            console.log(data);
            successUpload = data;

            if (method === "image"){
                mess_tusi("图片上传成功");
            } else if (method === "video"){
                mess_tusi("视频上传成功");
            }

            $(".progress").hide();
            $(".active-pro").hide();
            $(".text").hide();
        }
        function uploadFailed(evt) {
            console.log("There was an error attempting to upload the file.");
        }
        function uploadCanceled(evt) {
            console.log("The upload has been canceled by the user or the browser dropped the connection.");
        }
    };

    //base64->binary
    function dataURItoBlob(base64Data) {
        var byteString;
        if (base64Data.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(base64Data.split(',')[1]);
        else
            byteString = unescape(base64Data.split(',')[1]);
        var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], {type:mimeString});
    }

    var compPic;
    var compress = function(){
        $(".image-upload").imageCompress({
            'quality': 50,
            'onloadStart': function(result){
            },
            'onloadEnd': function(result){
            },
            'oncompressStart': function(result){
            },
            'oncompressEnd': function(result){
                $('#preview').append(result);
            },
            'callback': function(){
                var len = $('#preview').find('img').length;
                console.log(len);
                for (var i = 0; i < len; i++){
                    var res = $('#preview').children()[0]; //会自动移除preview中的img，所以第一个永远是最新的图片
                    $('#result').append(res);
                    compPic = $('#result').find('img').attr("src");
                    $('#result').find('img').remove();
                    check(compPic, len);
                }
            }
        });
    }

    setTimeout(function(){
        compress()}, 0);

    var count = 0;
    var check = function(compPic, len){
        var blob = dataURItoBlob(compPic);
        count += 1;
        send(blob, len, count); //blob数据，name文件名，len多张总长，count当前长度
        $('.image-upload').css({
            'background': 'url(' + compPic + ') no-repeat center',
            'background-size': '100%'
        })
    }

    //图片上传
    $(".image-upload").change(function () {
        var fileList = document.getElementById("files").files;
        var len = fileList.length; //确定有几张图片
    });

    var fd = new FormData();
    var send = function(data, len, cnt){
        fd.append('files', data);
        if (cnt == len){
            upload(fd, "image");
            count = 0; //置0，以便重复上传
            fd = new FormData(); //上传成功后将当前fd对象销毁
            $("#file").val('');
        }
    };

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

    //提交
    $(".art-submit").click(function(){
        var title = $("#head").val();
        var author = $("#author").val();
        var issuer = $("#issuer").val();
        var source = $("#source").val();
        var option = $(".art-type select").val();
        option = artType.filter(x => x.name == option)[0].id;
        var article = onSave();
        var summary = $("#summary").val();
        var cover = successUpload;
        var link = $("#art-link").val();

        if (title == '') {
            mess_tusi('请输入标题');
            return;
        }

        if (!article) {
            mess_tusi('请输入正文');
            return;
        }

        if (summary == '') {
            mess_tusi('请输入概要');
            return;
        }

        if (cover != undefined){
            cover = successUpload.path[0];
        }

        var sendData = {
            title: title,
            auth: author,
            source: source,
            is_original: isOrg,
            content: article,
            href: link,
            cover: cover,
            summary: summary,
            cate_id: option,
            is_private: priv,
            publisher: issuer
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
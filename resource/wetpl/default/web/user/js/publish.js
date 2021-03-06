/**
 * Created by Hongguang on 2017/8/6.
 */
 //列表折叠
sessionStorage.listname='we-art';
$(function() {
    CKEDITOR.replace('editor1',{"extraPlugins":"filebrowser,image,imagepaste,filetools,autoembed,embedsemantic,uploadfile"});
})
var qiniu_uptoken = '';
var saveto ='qiniu';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
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
                 // domain = '/index';                 
                 localStorage.removeItem('token')
                 // window.location.href = '/login'
               }
              if (data.code == 200){                
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

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
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
            url: apiUrl + 'articles/cates',
            type: 'get',
            data:{domain:pages_index},
            success: function(data){
                if (data.code == 200) {
                    var type = data.data;
                    type.map(x => {
                        // console.log(x.name,111)
                        if(x.weid != -1 ){
                            $(".articless select").append(
                                '<option id=' + x.weid + '>' + x.name + '</option>'
                            )
                        }
                        artType.push({id: x.weid, name: x.name});
                    })

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

    // 获取商品分类
    var systemType = [];
    var system = function(systemid){
        $.ajax({
            // url: "http://apitest.wezchina.com/goods/cates/list",
            url: apiUrl + 'plats/articles/category',
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200){
                    let cates = data.data.list;
                    if(cates.length>0){
                        cates.map(x => {
                            $(".systemtypes select").append(
                                '<option id=' + x.weid + '>' + x.name + '</option>'
                            )
                            systemType.push({id: x.weid, name: x.name});
                            // $("select option:nth-child(4)").attr("selected", true);
                        })
                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    system();

    //编辑器设置    
    __init();

    var isOrg = 1;
    $("#original").click(function(){
        if (isOrg == 1){
            isOrg = 2;
        } else {
            isOrg = 1;
        }
    })

    var priv;
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

    var cover = '';
    var edit = function(){
        if (weid != null) {
            $.ajax({
                url: ARTICLE + '/' + weid,
                type: 'get',
                success: function(data){
                    if (data.code == 200){
                        var art = data.data
                        $("#head").val(art.title);
                        $("#author").val(art.auth);
                        $("#issuer").val(art.publisher);
                        $("#source").val(art.source);
                        $("#date").val(art.publish_time);
                        $(".art-type select").find("option[id=" + art.cate_id + "]").attr("selected",true);

                        if (art.is_original == 1) {
                            isOrg = 1;
                            $("#original").prop("checked", false);
                        } else {
                            isOrg = 2;
                            $("#original").prop("checked", true);
                        }
                        CKEDITOR.instances.editor1.setData(art.content);
                        if (art.cover != "") {
                            cover = art.cover;
                            $("#img").attr('src',ApiMaterPlatQiniuDomain + art.cover);
                            $("input[name=thumb_image]").val(ApiMaterPlatQiniuDomain + art.cover);
                        } 
                        $("#summary").val(art.summary);
                        if (art.is_private == 1){
                            priv = 1;
                            $("#yes").prop("checked", false);
                            $("#no").prop("checked", true);
                        } else {
                            priv = 2;
                            $("#yes").prop("checked", true);
                            $("#no").prop("checked", false);
                        }
                        if (art.href != "") {
                            $("#link-box").prop("checked", true);
                            $("#art-link").val(art.href);
                            $("#art-link").show();
                        }
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

    var weid = window.location.href.split("/").pop();
    if (weid.length === 36) {
        type(edit);
    } else {
        type();
    }

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
        // domain: ApiMaterPlatQiniuDomain,
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
                cover = res.key;

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
        var option = $("[name='article']").val();
        option = artType.filter(x => x.name == option)[0].id;
        var summary = $("#summary").val();
        var link = $("#art-link").val();
        var content = CKEDITOR.instances.editor1.getData();
        var publish_time = $("#date").val() || new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toString().split(' ')[4];

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

        if (summary == '' && (content.substring(0, 140).indexOf('<img') == -1)) {
            // mess_tusi('请输入概要');
            // summary = content.substring(0, 140);
            summary = content.split('。')[0];
            // return;
        } else if (summary != ''){
            summary = summary.substring(0, 140);
        } else if (content.substring(0, 140).indexOf('<img') != -1) {
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
            publisher: issuer,
            publish_time: publish_time
            // system_cate_id:system_cate_id
        }

        if (weid.length === 36) {
            //sendData.weId = weid;
            // console.log(JSON.stringify(sendData));
            $.ajax({
                //url: ARTICLE_EDIT,
                url: ARTICLES_UPDATED + weid,
                type: 'post',
                data: sendData,
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data){
                    if (data.code == 200){
                        mess_tusi("修改文章成功");
                        window.location.href = "/user/admin/article/list";
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
                        window.location.href = "/user/admin/article/list";
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
})
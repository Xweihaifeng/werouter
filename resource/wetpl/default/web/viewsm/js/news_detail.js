    /*
 * * 新闻中心新闻列表子页面，呈现新闻详情
 * * 扫二维码可以分享该篇文章
 */
$(function() {
    /* 获取新闻中心页面返回该条新闻的weid
     * 正则匹配查找参数值
     */
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) return unescape(r[2]);
        return null;
    }

    // 全剧共用变量
    var get_param = window.location.pathname.split('/').pop();
    // var ApiMaterPlatQiniuDomain = 'http://oty3r3tmi.bkt.clouddn.com/';
    var praise_if, original;

    $(".prompt-info").hide();

    // token 加载值请求头（Headers）
    var token = window.localStorage.getItem('token'), isLogin = false;
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login a").css({
                'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100%'
            });
            $("#login a").addClass("i-header").html("");

            // 判断该篇新闻是否点赞
            var options2 = $.get(CMS_CONTENTS_PRAISE_USER + get_param + "/praise_if");
            options2.done(function(data) {
                if(data.code === 200) {
                    praise_if = data.data.praise;
                } else {
                    console.error(data.message);
                }
            });
            options2.fail(function(error) {
                console.error(error);
            });
        }
    }

    init(token);

    var router = function(route){
        if (!isLogin) {
            showLogin = true;
            $("#modal_login").fadeIn(300);
        } else {
            window.location.href = "/user/";
        }
    }

    // 新问内容部分显示
    var news_detail = function(result) {
        document.title = result.title;
        var thumb_image = result.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
        }
        if(result.is_original == 1) {
            result.is_original = "原创";
        }
        var template = `
            <p class="rich_media_title" id="activity-name">` + result.title + `</p>
            <div class="clearfix bts">
                <span class="publisher">` + result.publisher.substr(0, 5) + `</span>
                <span class="author">` + result.auth.substr(0, 5) + `</span>
                <span class="source_url">`+ result.source_url +`</span>
                <span class=updated_at">` + result.updated_at.substr(0, 10) + `</span>
                <span class="original">` + result.is_original + `</span>
            </div>
            <div class="page-info"><div class="page-details"><p>` + result.content + `</p></div></div>
            <div class="evaluate"><p class="readings"><a class="read_original" href="`+ result.source_url +`" target="_blank"> 阅读原文 </a><span>阅读 ` + result.views + `</span><span class="zan" id="zan"><i class="gesture"></i><span class="zanCount">` + result.praise_num + `<span></span></p></div>`

        return template;
    }

    // 点赞 or 取消赞
    function content_praise() {
        var praiseUrl = CMS_CONTENTS_PRAISE;
        var data = {};
        data.content_id = get_param;
        var options0 = $.post(praiseUrl, data);
        options0.done(function(body) {
            if(body.code === 200) {
                var praise = body.data.praise, info;

                if(!praise) {
                    $(".gesture").addClass("already");
                    $(".zanCount").text(Number($(".zanCount").text()) - 1);
                    info = "已取消赞！";
                    layer.msg(info, { time: 1500 });
                    return false;
                }
                $(".gesture").removeClass("already");
                $(".zanCount").text(Number($(".zanCount").text()) + 1);
                info = "已成功点赞！";
                layer.msg(info, { time: 1500 });
            } else {
                console.error(body.message);
            }
        });
        options0.fail(function(error) {
            console.error(error);
        });
    }

    // 新闻详情数据获取
    function detail_data() {
        var options = $.get(CMS_DETAIL + get_param);
        options.done(function(data) {
            if(data.code === 200) {
                if(!data.data) {
                    document.title = "404";
                    $(".qr_code_pc_outer").hide();
                    $("#default404").show().addClass("default404");
                    return false;
                }
                $(".page-left").append(news_detail(data.data));

                if(!data.data.source_url) {
                    $(".read_original").hide();
                }

                var Array = [data.data.publisher, data.data.auth, data.data.source_url, data.data.updated_at, data.data.is_original]
                $.each(Array, function(i, value) {
                    console.log(i , value);
                    if(!value) {
                        $(".bts > span:nth-child("+ (i + 1)+")").hide();
                    }
                });

                $(".source_url").hide();
                if(data.data.is_original == "原创" || data.data.is_original == 1) {
                    $(".original").show();
                } else {
                    $(".original").hide();
                }

                if(!praise_if) {
                    $(".gesture").addClass("already");
                } else {
                    $(".gesture").removeClass("already");
                }

                $(".zan").click(function() {
                    if(praise_if === undefined) {
                        router('login');
                    } else {
                        content_praise();
                        return false;
                    }
                });
            } else {
                console.warn(data.message)
            }
        });
        options.fail(function(error) {
            console.error(error);
        });
    }
    detail_data();

});
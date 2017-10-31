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
//    var get_param = getQueryString('weid');
    var get_param = window.location.pathname.split('/').pop();
    var ApiMaterPlatQiniuDomain = 'http://oty3r3tmi.bkt.clouddn.com/';

    $(".prompt-info").hide();
    var praise_if;

    var token = window.localStorage.getItem('token');

    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

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

    // 新问内容部分显示
    var news_detail = function(result) {
        document.title = result.title;
        var thumb_image = result.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
        }
        var template = `
            <p class="rich_media_title" id="activity-name">` + result.title + `</p>
            <div class="clearfix bts">
                <span class="z user-img">`;
                if(thumb_image != ""){
                    template = template + `<img src="` + thumb_image + `" alt="">`;
                }
                template = template + `</span>
                <span class="time z author">` + result.auth + `</span>
                <span class="time z">来源</span>
                <span class="time z">` + result.publisher + `</span>
                <span id="post-date" class="time z">` + result.updated_at + `</span>
            </div>
            <hr class="hr" />
            <p class="page-title">
                <img src="http://next.wezchina.com/images/daoyu.png" alt="">
                <span>` + result.summary + `</span>
            </p>
            <div class="page-info">
                <div class="page-details">
                    <p>` + result.content + `</p>
                </div>
            </div>
            <div class="evaluate">
                <p class="readings"><span>阅读: ` + result.views + `</span><span class="zan" id="zan"><i class="gesture"></i><span class="zanCount">` + result.praise_num + `<span></span></p>
            </div>`

        return template;
    }

    // 超出显示条数时提示
    function prompt(warm) {
        $(".prompt-info").text(warm);
        $(".prompt-info").slideToggle(function() {
            $(this).show();

        }, function() {
            $(this).fadeOut(3000);
        });
    }

    function content_praise() {
        $.ajax({
            url: CMS_CONTENTS_PRAISE,
            data: {
                content_id: get_param
            },
            type: 'post',
            dataType: 'JSON',
            success: function(body) {
                if(body.code === 200) {
                    var praise = body.data.praise,
                        info;
                    if(!praise) {
                        info = "已取消赞！";
                        $(".gesture").addClass("already");
                        prompt(info);
                        $(".zanCount").text(Number($(".zanCount").text()) - 1);
                        return false;
                    }
                    info = "已成功点赞！";
                    $(".gesture").removeClass("already");
                    prompt(info);
                    $(".zanCount").text(Number($(".zanCount").text()) + 1);
                } else {
                    console.error(body.message);
                }
            },
            error: function(error) {
                console.error(error)
            }
        });
    }

    var options = $.get(CMS_DETAIL + get_param); // 新闻详情数据获取
    // 请求成功调用该函数呈现页面
    options.done(function(data) {
        if(data.code === 200) {
            $(".page-left").append(news_detail(data.data));
            $(".zan").click(function() {
                if(praise_if) {
                    content_praise();
                    return false;
                }
                content_praise();
            });
            if(!praise_if) {
                $(".gesture").addClass("already");
            } else {
                $(".gesture").removeClass("already");
            }
        } else {
            alert(data.message)
        }
    });
    // 请求失败函数
    options.fail(function(error) {
        console.error(error);
    });

    var options1 = $.get(CMS_DETAIL_QRCODE + window.location.href); // 二维码的生成
    // 请求成功执行函数渲染二维码
    options1.done(function(data) {
        $(".qr_code_pc_outer").prepend(`<img src="` + CMS_DETAIL_QRCODE + window.location.href + `" />`);
    });
    // 二维码请求失败调用函数
    options1.fail(function(error) {
        console.error(error)
    });

});
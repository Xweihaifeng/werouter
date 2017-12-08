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
                <span class="updated_at">` + result.publish_time.substr(0, 10) + `</span>
                <span class="original">` + result.is_original + `</span>
            </div>
            <div class="page-info"><div class="page-details"><p>` + result.content + `</p></div></div>
            <div class="evaluate"><p class="readings"><a class="read_original" href="`+ result.source_url +`" target="_blank">阅读原文</a><span>阅读 ` + result.views + `</span><span class="zan" id="zan"><i class="gesture"></i><span class="zanCount">` + result.praise_num + `<span></span></p><div class="read-complain">投诉</div></div>`

            if(result.is_original == 0) {
                $(".original").hide();
            }
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

    //获取参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    //判断为空
    function isNull(data) {
        return (data == "" || data == undefined || data == null || data == 'null') ? true: false;
    }

    //判断是否在微信中打开
    function is_weixn() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    //检查openid是否过期(有效期1天)
    var isExpire = (oldTime) => {
        var day = 86400000;
        var now = new Date().getTime();
        if (oldTime != null) {
            if (now - oldTime < 86400000) {
                return false;
            } else {
                localStorage.removeItem('setopenid-date')
                localStorage.removeItem('token')
                return true;
            }
        } else {
            return true;
        }
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

                console.log(data.data);
                var cover = ApiMaterPlatQiniuDomain + data.data.thumb_image;
                var summary = data.data.summary;
                var atitle = data.data.title;

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

                if (is_weixn()) {
                    var oldTime = localStorage.getItem('setopenid-date');

                    if (!isExpire(oldTime)) { //没过期
                        //var usertoken = localStorage.getItem('token');
                        var usertoken = localStorage.getItem('setopenid');
                        if (usertoken == 'true') {
                            openid = getUrlParam("openid");
                            //alert('openid: ' + openid)
                            //微信登录
                            $.ajax({
                                url: apiUrl + 'wxlogin',
                                type: 'POST',
                                data: {
                                    openid: openid,
                                    ref_url: window.location.pathname,
                                    // ref_type: 2,
                                    // ref_id: plat_userid,
                                    // domain: domain
                                },
                                success: function (data) {
                                    //alert(JSON.stringify(data))
                                    if (data.code == 200) {
                                        if (isNull(data.token) == false) { //非空
                                            localStorage.setItem('token-date', new Date().getTime())
                                            localStorage.setItem('token', data.token);
                                        }
                                    }
                                }
                            })
                        }
                    } else {
                        //微信未跳转时
                        localStorage.setItem('setopenid', true);
                        localStorage.setItem('setopenid-date', new Date().getTime())
                        window.location.href = encodeURI(apiUrl + '/openid?url=' + window.location.href);
                    }
                }

                $.ajax({
                    url: apiUrl + 'wxjssdk',
                    type: 'POST',
                    data: {
                        currenturl: window.location.href
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            console.log(data)
                            wx.config({
                                debug: false,
                                appId: data.data.appId,
                                timestamp: data.data.timestamp,
                                nonceStr: data.data.nonceStr,
                                signature: data.data.signature,
                                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
                            });

                            wx.ready(function() {
                                var link = window.location.href;
                                wx.onMenuShareTimeline({
                                    title: atitle,
                                    // 分享标题
                                    link: link,
                                    // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                    desc: summary,
                                    //分享描述
                                    imgUrl: cover,
                                    // 分享图标
                                    success: function() {
                                        // 用户确认分享后执行的回调函数
                                    },
                                    cancel: function() {
                                        // 用户取消分享后执行的回调函数
                                    }
                                });
                                wx.onMenuShareAppMessage({
                                    title: atitle,
                                    // 分享标题
                                    // desc: data.summary,
                                    // imgUrl: data.detail.cover,
                                    desc: summary,
                                    // 分享描述
                                    link: link,
                                    // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                                    // imgUrl: ApiMaterPlatQiniuDomain + data.cover,

                                    imgUrl: cover,
                                    // 分享图标
                                    type: '',
                                    // 分享类型,music、video或link，不填默认为link
                                    dataUrl: '',
                                    // 如果type是music或video，则要提供数据链接，默认为空
                                    success: function() {
                                        // 用户确认分享后执行的回调函数
                                    },
                                    cancel: function() {
                                        // 用户取消分享后执行的回调函数
                                    }
                                });
                            })
                        }
                    }
                })
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
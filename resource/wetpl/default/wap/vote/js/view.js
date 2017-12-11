    $(function() {
        // 计算操作显示框的位置
        var window_height = $(window).height();
        var window_width = $(window).width();
        var alert_top = (window_height - $('.alert').height()) / 2;
        var alert_left = (window_width - $('.alert').width()) / 2;
        $('.alert').css('top', alert_top + 'px');
        $('.alert').css('left', alert_left + 'px');

        $(function() {
            $(".animsition").animsition({
                inClass               :   'fade-in',
                outClass              :   'fade-out',
                inDuration            :    1500,
                outDuration           :    800,
                linkElement           :   '.animsition-link',
                // e.g. linkElement   :   'a:not([target="_blank"]):not([href^=#])'
                loading               :    true,
                loadingParentElement  :   'body', //animsition wrapper element
                loadingClass          :   'animsition-loading',
                unSupportCss          : [ 'animation-duration',
                    '-webkit-animation-duration',
                    '-o-animation-duration'
                ],
                //"unSupportCss" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
                //The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
                overlay               :   false,
                overlayClass          :   'animsition-overlay-slide',
                overlayParentElement  :   'body'
            });
            setTimeout(function() {
                    $('.alert').hide();
                },
                2000);
            $('.btn-close').click(function() {
                $('.alert').hide();
            });
        });
    });
    //禁止用户右键点击
    /*jQuery(document).ready(function(){
        jQuery(document).bind("contextmenu",function(e){
            return false;
        });
    });*/

    // 分享模板关键字替换
    var STMP = {
        TMP : {
            index : '我投了{{number}}号"{{name}}"{{showname}}一票，"{{votename}}"投票火热进行中，快来围观，参与投票吧！',
            detail : '我为{{number}}号"{{name}}"{{showname}}带盐，欢迎各位朋友前来围观，请支持TA，投上您宝贵的一票！',
        },
        tmp_variant : {
            votename : '我的投票',
            number : '1',
            name : '投票',
            showname : '项目'
        }
    };
    function templaten(string, MX){
        for (prop in MX) {
            string = string.replace(new RegExp('{{' + prop + '}}','gm'),MX[prop]);
        }
        return string;
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
    
    var globalHost = "http://api.new.wezchina.com";
    // var ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';
    var pages_total = 1;
    var lazy_cover;
    var now_time = Math.round(new Date().getTime() / 1000);

    var globalWeid;
    var href = window.location.href;
    var path = window.location.pathname.split('/');
    var len = path.length;
    if (href.indexOf('from') != -1) {
        globalWeid = href.split('?')[0].split('/').pop()
    } else {
        globalWeid = path.pop();
        // localStorage.setItem('vote-id', globalWeid);
        if (globalWeid == '') {
            globalWeid = path[len - 2];
            localStorage.setItem('vote-id', globalWeid);
        }
    }

    $.ajax({
        url: globalHost + '/vote/view/' + globalWeid,
        type: 'GET',
        success: function(obj) {
            console.log(obj);
        }
    });
    var vm = new Vue({
        el: '.indexapp',
        data: {
            title: '',
            summary: '',
            cover: '',
            num: '',
            views: '',
            begin_time: '',
            end_time: '',
            only_wechat: '',
            status: '',
            remark: '',
            statistic: '',
            countitem: '',
            rule: '',
            adv: '',
            list: [],
            total: '',
            page: 1,
            checkurl: '',
            rankurl: '',
            indexurl:'',
            appellation:'',
            support_text: '',
            support_link: ''
        },
        created: function() {
            var _self = this;
            var voteid = globalWeid;

            $.ajax({
                url: globalHost + '/cms/setting/show',
                type: 'GET',
                success: function(data){
                    var imgHost = ApiMaterPlatQiniuDomain;
                    var fav = data.data.favicon;
                    if (fav.indexOf('http') === -1) {
                        fav = imgHost + fav;
                    }
                    $("#fav").attr("href", fav);
                },
                error: function(xhr){
                    console.log(xhr)
                }
            })

            $.ajax({
                url: globalHost + '/vote/detail/' + globalWeid,
                type: 'GET',
                success: function(data) {
                    if (data.code == 200) {
                        // 投票分享标题
                        STMP.TMP.index = data.data.share_title_index,
                        STMP.TMP.detail = data.data.share_title_detail,
                        STMP.tmp_variant.votename = data.data.title,
                        STMP.tmp_variant.showname = data.data.appellation,
                        _self.title = data.data.title;
                        _self.countitem = data.data.countitem;
                        _self.num = data.data.num;
                        _self.views = data.data.views;
                        _self.cover = data.data.cover.indexOf('//') != -1 ? data.data.cover : ApiMaterPlatQiniuDomain + data.data.cover;
                        _self.summary = data.data.summary;
                        _self.begin_time = data.data.begin_time;
                        _self.end_time = data.data.end_time;
                        _self.rule = data.data.rule;
                        _self.adv = data.data.adv;
                        _self.appellation = data.data.appellation;
                        _self.support_text = data.data.support_text;
                        _self.support_link = data.data.support_link;
                        var $add = '';
                        for (var i = 0, ien = data.data.adv.length; i < ien; i++) {
                            $add = $add + '<div class="mui-col-sm-12 mui-col-xs-12 ad-img">' + '<a href="' + data.data.adv[i].url + '"><img src="' + ApiMaterPlatQiniuDomain + data.data.adv[i].image + '" ></a>' + '</div>';
                        }
                        // lazy_cover = ApiMaterPlatQiniuDomain + 'plats/resource/1504876949544.png';
                        lazy_cover = ApiMaterPlatQiniuDomain + data.data.cover_default
                        console.log(lazy_cover)
                        setTimeout(function() {
                                jQuery('.ad-box').html($add);
                            },
                            10000);

                        //打开方式
                        _self.only_wechat = data.data.only_wechat;
                        _self.checkurl = "/vote/rule/" + globalWeid;
                        _self.rankurl = "/vote/report/" + globalWeid;
                        _self.indexurl= "/vote/" + globalWeid;

                        sessionStorage.setItem('title', _self.title);
                        $("title").text(_self.title);
                        isopeninwechat(_self.only_wechat);
                        jQuery(".lazy-cover").lazyload({
                          // 图片淡入效果
                          effect: "fadeIn",
                          // 加载前的默认图片
                          placeholder: lazy_cover,
                        });
                    }
                }
            })
        }
    })
    //判断是否在微信中打开
    function is_weixn() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
    //判断是否在微信中打开
    function isopeninwechat(flag) {
        var hidden_wechat = flag;
        var pc = getUrlParam('pc');
        if (!is_weixn()) {
            if (hidden_wechat == 1) {
                if (isNull(pc)) {
                    // window.location.href = "warn.html";
                    window.location.href = "/vote/warn";
                }
            }
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
                localStorage.removeItem('user-token')
                return true;
            }
        } else {
            return true;
        }
    }

    $(function() {
        //判断在微信中打开直接登录
        if (is_weixn()) {
            // alert('is_weixin')
            var oldTime = localStorage.getItem('setopenid-date');
            // var openidflag = localStorage.getItem('setopenid');

            //setopenid不为空时
            // if (isNull(openidflag) == false) {
            if(!isExpire(oldTime)) {
                var usertoken = localStorage.getItem('user-token');
                if (isNull(usertoken)) {
                    openid = getUrlParam("openid");
                    //获取来源首页进入
                    var comeweid = '';
                    comeweid = 'vote/' + globalWeid;
                    //微信登录
                    $.ajax({
                        url: globalHost + '/wxlogin',
                        type: 'POST',
                        data: {
                            openid: openid,
                            ref_url: comeweid
                        },
                        success: function(data) {
                            if (data.code == 200) {
                                if (isNull(data.token) == false) {
                                    localStorage.setItem('token-date', new Date().getTime())
                                    localStorage.setItem('user-token', data.token);
                                }
                            }
                        }
                    })
                }
            } else {
                //微信未跳转时
                // localStorage.setItem('setopenid', true);
                localStorage.setItem('setopenid-date', new Date().getTime())
                window.location.href = encodeURI(globalHost + '/openid?url=' + window.location.href);
            }
        }
        //初始化layerui
        layui.use(['layer', 'laypage', 'element'],
            function() {
                var layer = layui.layer
            });
        //下拉折叠
        jQuery(document).on('click', '.icon-downarrow',
            function() {
                jQuery('.condition-3').css('display', 'block');
                jQuery(this).removeClass('icon-downarrow').addClass('icon-toparrow');
            });
        jQuery(document).on('click', '.icon-toparrow',
            function() {
                jQuery('.condition-3').css('display', 'none');
                jQuery(this).removeClass('icon-toparrow').addClass('icon-downarrow');
            });
        // 异步加载投票列表数据
        var limit = 6;
        var i = 1;      

        layui.use('flow',
            function() {
                var flow = layui.flow;                
                // 信息流               
                flow.load({
                    elem: '#vote_list' // 指定列表容器
                    ,isAuto: false
                    ,isLazyimg: true
                    ,
                    done: function(page, next) { // 到达临界点（默认滚动触发），触发下一页
                      // setTimeout(function(){
                        var lis = [];
                        // 以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
                        var voteid = globalWeid;
                        var key = localStorage.getItem('key');
                        if (key == null) {
                            key = '';
                        }

                        if (i > 1) {limit = 4;page=page+0.5;};
                        i++;

                        $.ajax({
                            url: globalHost + '/vote/list',
                            type: 'POST',
                            data: {
                                vote_id: voteid,
                                limit: limit,
                                page: page,
                                keywords: key
                            },
                            success: function(data) {
                                if (data.code == 200) {
                                    localStorage.removeItem('key');
                                    pages_total = Math.ceil(data.data.total / limit);
                                    layui.each(data.data.list,
                                        function(index, item) {
                                            var item_cover = item.cover.indexOf('//') != -1 ? item.cover : ApiMaterPlatQiniuDomain + item.cover
                                            lis.push('<div class="mui-col-xs-6 mui-col-sm-6 vote-list">' + '<div class="vote-list-bgc">' + '<a href="/vote/show/' + item.weid + '">' + '<img class="lazy-' + i + '" data-original="' + item_cover + '" alt="" />' + '</a>' + '<div class="vote-list-title">' + item.sort + '.' + item.title + '</div>' + '<div class="vote-list-btn">' + '<button id=' + item.sort + '.' + item.title + ' data-original=" ' + item_cover + '" data-sort="' + item.sort + '" data-title="' + item.title + '" data-id="' + item.weid + '">' + '<i class="iconfont icon-zan"></i>投票' + '</button>' + '</div>' + '<div class="vote-list-num"><font>' + item.nums + '</font>票</div>' + '</div>' + '</div>');
                                        });
                                    next(lis.join(''), page < pages_total);
                                    // 图片懒加载
                                    jQuery(".lazy-" + i).lazyload({
                                        // 图片淡入效果
                                        effect: "fadeIn",
                                        // 加载前的默认图片
                                        placeholder: lazy_cover
                                    });
                                }
                            }
                        })
                      // }, 500)                        
                    }
                });
                // 图片懒加载
                flow.lazyimg();
            });

        //投票
        jQuery(document).on('click', '.vote-list-btn button',
            function() {
                //显示登录弹框
                // alert(vm.only_wechat)
                if (!is_weixn() && vm.only_wechat == 1) {
                    layer.msg("请扫描二维码在微信中投票", {
                        time: 1500,
                        offset: '350px'
                    });
                    return false;
                }
                if (vm.status == 2) {
                    layer.msg("投票项目关闭", {
                        time: 1500,
                        offset: '350px'
                    });
                    return false;
                }
                var begin_time = Date.parse(new Date(vm.begin_time));
                begin_time = begin_time / 1000;
                if (now_time < begin_time) {
                    layer.msg("本投票活动未开放投票", {
                        time: 1500,
                        offset: '350px'
                    });
                    return false;
                }
                var end_time = Date.parse(new Date(vm.end_time));
                end_time = end_time / 1000;
                if (now_time > vm.end_time) {
                    layer.msg("本投票活动未开放投票", {
                        time: 1500,
                        offset: '350px'
                    });
                    return false;
                }
                var user = localStorage.getItem('user-token');

                var vote_id = jQuery(this).data('id');
                if (isNull(user) || user == undefined || user == '') {
                    // $('#myModal2').modal();
                    layer.msg("请扫描二维码在微信中投票", {
                        time: 1500,
                        offset: '350px'
                    });
                    jQuery('.openid').attr('value', vote_id);
                } else {
                    //投票
                    var now_obj = jQuery(this);
                    var now_num = jQuery(this).parent().next().find('font').text(); // 列表中的投票数量
                    var now_num1 = jQuery('.after-num').text(); // 标题栏中的投票数量
                    var after_num = parseInt(now_num) + 1;
                    var after_num1 = parseInt(now_num1) + 1;
                    $.ajaxSetup({
                        global: true,
                        dataType: 'json',
                        headers: {
                            'Token': user
                        }
                    });
                    $.ajax({
                        url: globalHost + '/vote/voted',
                        type: 'POST',
                        data: {
                            item_id: vote_id
                        },
                        success: function(data) {
                            if (data.code == 200) {
                                if (isNull(data.data) == false) {
                                    now_obj.parent().next().find('font').text(after_num); // 列表中的投票数量
                                    jQuery('.after-num').text(after_num1); // 标题栏中的投票数量
                                    layer.msg("投票成功", {
                                        time: 1500,
                                        offset: '350px'
                                    });

                                    vm.title = sessionStorage.getItem('title');
                                    var obj = vm;
                                    // 分享标题
                                    STMP.tmp_variant.name = now_obj.data('title');
                                    STMP.tmp_variant.number = now_obj.data('sort');
                                    obj.title = templaten(STMP.TMP.index, STMP.tmp_variant);
                                    $("title").text(obj.title);
                                    // alert(now_obj.data('original'));
                                    // alert(obj.cover);
                                    var img = now_obj.data('original');
                                    // alert(img);
                                    initWx(obj, img, 0);
                                }
                            } else {
                                layer.msg(data.message, {
                                    time: 1500,
                                    offset: '350px'
                                });
                            }
                        }
                    })
                }
            });
    });
    var InterValObj; //timer变量，控制时间
    var count = 60; //间隔函数，1秒执行
    var curCount; //当前剩余秒数
    //发送验证码
    $('#btnSendCode').click(function(data) {
        sendMessage();
    });
    function sendMessage() {
        var mobile = $('#mobile').val();
        if (mobile != "" && /^1[34578]{1}\d{9}$/.test(mobile)) {
            curCount = count;
            //设置button效果，开始计时
            $("#btnSendCode").attr("disabled", "true");
            $("#btnSendCode").val("重新发送(" + curCount + ')');
            InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
            //向后台发送处理数据
            $.ajax({
                url: globalHost + '/codes',
                type: 'POST',
                data: {
                    phone: mobile
                },
                success: function(data) {
                    if (data.code == 200) {
                        layer.msg("发送验证码成功", {
                            time: 1500,
                            offset: '350px'
                        });
                    } else {
                        layer.msg("发送验证码失败", {
                            time: 1500,
                            offset: '350px'
                        });
                    }
                }
            })
        } else {
            layer.msg("手机号为空或者格式不正确", {
                time: 1500,
                offset: '350px'
            });
        }
    }
    //timer处理函数
    function SetRemainTime() {
        if (curCount == 0) {
            window.clearInterval(InterValObj); //停止计时器
            $("#btnSendCode").removeAttr("disabled"); //启用按钮
            $("#btnSendCode").val("重新发送");
        } else {
            curCount--;
            $("#btnSendCode").val("重新发送(" + curCount + ')');
        }
    }
    //登录
    $('.save-code').click(function() {
        //获取来源首页进入
        var comeweid = '';
        comeweid = 'vote/' + globalWeid;
        var mobile = $('#mobile').val();
        var code = $('.input2').val();
        if (mobile == null || mobile == '' || code == null || code == '') {
            layer.msg("手机号和验证码不能为空", {
                time: 1500,
                offset: '350px'
            });
        } else {
            $.ajax({
                url: globalHost + '/login',
                type: 'POST',
                data: {
                    phone: mobile,
                    code: code,
                    ref_url: ''
                },
                success: function(data) {
                    if (data.code == 200) {
                        if (isNull(data.token) == false) {
                            //登录的toke
                            sessionStorage.setItem('user-token', data.token);
                            var item_id = jQuery('.openid').val();
                            $.ajax({
                                url: globalHost + '/vote/voted',
                                type: 'POST',
                                data: {
                                    item_id: item_id
                                },
                                headers: {
                                    'Token': data.token
                                },
                                success: function(data) {
                                    if (data.code == 200) {
                                        if (isNull(data.data) == false) {
                                            layer.msg("投票成功", {
                                                time: 1500,
                                                offset: '350px'
                                            });
                                        }
                                    } else {
                                        layer.msg(data.message, {
                                            time: 1500,
                                            offset: '350px'
                                        });
                                    }
                                }
                            })
                        }
                    } else {
                        layer.msg(data.message, {
                            time: 1500,
                            offset: '350px'
                        });
                    }
                }
            })
        }
    });

    //第三方统计
    setTimeout(function() {
        var statistic = vm.statistic;
        if (statistic) {
            eval(statistic);
        }
    },
    10000);
    
    $.ajax({
        url: globalHost + '/wxjssdk',
        type: 'POST',
        data: {
            currenturl: window.location.href
        },
        success: function(data) {
            if (data.code == 200) {
                wx.config({
                    debug: false,
                    appId: data.data.appId,
                    timestamp: data.data.timestamp,
                    nonceStr: data.data.nonceStr,
                    signature: data.data.signature,
                    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
                });

                wx.ready(function() {
                    setTimeout(function() {
                        var img = vm.cover;
                        console.log(img);
                        initWx(vm, img);
                    },200);
                })
            }
        }
    })
    //微信分享
    function initWx(data, img, id) {
        var link = 'http://m.new.wezchina.com/' + "vote/" + globalWeid;
        wx.onMenuShareTimeline({
            title: data.title,
            // 分享标题
            link: link,
            // imgUrl: data.detail.cover,
            // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            // imgUrl: ApiMaterPlatQiniuDomain + data.cover,
            desc: data.summary,
            //分享描述

            imgUrl: data.cover,
            // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
        wx.onMenuShareAppMessage({
            title: data.title,
            // 分享标题
            // desc: data.summary,
            // imgUrl: data.detail.cover,
            desc: data.summary,
            // 分享描述
            link: link,
            // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            // imgUrl: ApiMaterPlatQiniuDomain + data.cover,

            imgUrl: data.cover,
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
    }

    var search = function() {
        $("#vote_list").html('');
        // var text = '';
        // var name = window.location.href.match(/=\W.*/);
        // console.log('name:', name);
        // if (name != null) {
        //   text = decodeURIComponent(name[0].substring(1));
        // } else {
        //   //      $("#search_key").val(text); //后退时会显示
        // }

        var voteid = globalWeid;
        var key = $("#search_key").val();
        // sessionStorage.setItem('weid', globalWeid);
        // sessionStorage.setItem('key', key);
        // var key = sessionStorage.getItem('key')
        // console.log(sessionStorage.getItem('key'))
        // window.location.href = '/m/vote/28dc16c0-7d6a-11e7-a7bc-97c8c9681905/1?key=' + text
        // window.history.pushState({}, 0, '/vote/' + globalWeid + '/1?key=' + text)
        // 异步加载投票列表数据
        var limit = 6;
        // var i = 1;

        layui.use('flow',
            function() {
                var flow = layui.flow;
                // 信息流
                flow.load({
                    elem: '#vote_list' // 指定列表容器
                    ,isAuto: false
                    ,isLazyimg: true
                    ,
                    done: function(page, next) { // 到达临界点（默认滚动触发），触发下一页
                        var lis = [];
                        // 以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
                        // if (i > 1) limit = 4;
                        // i++;
                        $.ajax({
                            url: globalHost + '/vote/list',
                            type: 'POST',
                            data: {
                                vote_id: voteid,
                                limit: limit,
                                page: page,
                                keywords: key
                            },
                            success: function(data) {
                                console.log(data);
                                if (data.code == 200) {
                                    pages_total = Math.ceil(data.data.total / limit);
                                    layui.each(data.data.list,
                                        function(index, item) {
                                            var item_cover = item.cover.indexOf('//') != -1 ? item.cover : ApiMaterPlatQiniuDomain + item.cover
                                            lis.push('<div class="mui-col-xs-6 mui-col-sm-6 vote-list">' + '<div class="vote-list-bgc">' + '<a href="/vote/show/' + item.weid + '">' + '<img class="lazy-' + page + '" data-original="' + item_cover + '" alt="" />' + '</a>' + '<div class="vote-list-title">' + item.sort + '.' + item.title + '</div>' + '<div class="vote-list-btn">' + '<button id=' + item.sort + '.' + item.title + ' data-sort="' + item.sort + '" data-title="' + item.title + '" data-id="' + item.weid + '">' + '<i class="iconfont icon-zan"></i>投票' + '</button>' + '</div>' + '<div class="vote-list-num"><font>' + item.nums + '</font>票</div>' + '</div>' + '</div>');
                                        });
                                    next(lis.join(''), page < pages_total);
                                    // 图片懒加
                                    jQuery(".lazy-" + page).lazyload({
                                        // 图片淡入效果
                                        effect: "fadeIn",
                                        // 加载前的默认图片
                                        placeholder: lazy_cover
                                    });
                                    // sessionStorage.removeItem('key');
                                }
                            }
                        })
                    }
                });
                // 图片懒加载
                flow.lazyimg();
            });
    }

    $(".search-3").click(function(){
        search();
    })

    $("#search_key").keydown(function(evt){
        switch (evt.keyCode){
            case 13: search();
        }
    });
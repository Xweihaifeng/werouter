/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
//判断为空
function isNull(data) {
    return (data == "" || data == undefined || data == null || data == 'null') ? true : false;
}
var urlall = window.location.href.split('#');
var urlpath = urlall.pop();

var url = window.location.pathname.split('/');
var active = url.pop();
var domain = url.slice(1, 2)[0];
console.log('domain', domain);
$(".linkto").attr('href', '/' + domain)
$(document).ready(function() {
            var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
            //获取当前网址，如： http://localhost:8083/proj/meun.jsp
            var curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： proj/meun.jsp
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8083
            var localhostPath = curWwwPath.substring(0, pos);
            // token 加载值请求头（Headers）
            var token = docCookies.getItem("token"),
                isLogin = false;
            if (token) {
                $.ajaxSetup({
                    global: true,
                    headers: {
                        'Token': token,
                    }
                });
            }

            //主页初始化
            var init = function(token) {
                if (token != 'null' && token != undefined) {
                    showLogin = false;
                    isLogin = true;
                    //加载用户头像

                    $("#login div img").hide();
                    $(".log-head").css({
                        // 'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
                        'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',

                        'background-size': '100% 100%'
                    })
                    $(".log-head").show();
                    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
                    $('#favicon').attr('href', favicon);
                }
            }

            init(token);

            var router = function(route) {
                if (!isLogin) {
                    showLogin = true;
                    $("#modal_login").fadeIn(300);
                } else {
                    window.location.href = "/";
                }
            }

            var showLogin = false; //调整窗口大小时登陆框是否存在
            var currWidth = $(window).width();
            var currHeight = $(window).height();
            var width = $(window).width() / 2 - 180;
            var height = $(window).height() / 2 - 165;
            var readHeight = $(".read").height();

            if (readHeight == 768) {
                $(".left-nav").css("min-height", currHeight);
                $(".read").css("min-height", currHeight);
                $(window).resize(function() {
                    currWidth = $(window).width();
                    currHeight = $(window).height();
                    width = $(window).width() / 2 - 180;
                    height = $(window).height() / 2 - 165;
                    var top = $(window).scrollTop();
                    $(".left-nav").css("min-height", currHeight);
                    $(".read").css("min-height", currHeight);
                    $(".show-login").css({
                        "margin-top": top + height,
                        "margin-left": width
                    });
                })
            }

            var tusitemp = "";

            function mess_tusi(strs) {
                clearTimeout(tusitemp);
                $("#mess_tusi").remove();
                //创建吐丝层并写入内容
                if (!$("#mess_tusi").attr("id")) { //吐丝层不存在创建
                    $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>" + strs + "</span></div>"); //写入内容
                } else {
                    $("#mess_tusi").html(strs); //写入内容
                }
                //定义吐丝层位置
                var left = (1200 - $("#mess_tusi").width()) / 2; //居中
                var top = $(window).height() * 0.5;
                $("#mess_tusi").css({ "left": left + "px", "top": top + "px" });

                //显示吐丝层rou't
                $("#mess_tusi").css("display", '');

                //2秒后关闭
                tusitemp = setTimeout(function() {
                    $("#mess_tusi").remove();
                    $("#mess_tusi").html("");
                }, 2000);
                return false;
            }

            var options0 = $.get(CMS_ADVS);
            options0.done(function(data) {
                console.log(data);
                if (data.code == 200) {
                    if (!data.data) {
                        return false;
                    }

                    var setting = data.data.setting;
                    window.localStorage.setItem("logo", setting.logo);
                    window.localStorage.setItem("fav", setting.favicon);

                    if (!setting.favicon == false) {
                        var favicon = ApiMaterPlatQiniuDomain + setting.favicon;
                        $("#public_icon").attr("href", favicon);
                    }

                    if (!setting.logo == false) {
                        var logo = ApiMaterPlatQiniuDomain + setting.logo;
                        // $("#home .logoImg").css({"background-image": "url(" + logo + ")"});
                        $("#home img").attr("src", logo);
                    }
                }
            });

            var weid = docCookies.getItem("weid");
            console.log(weid)
            var activityid = window.location.href.split('/').pop();
            var activityid_all = activityid.split('#');
            console.log(activityid_all[0])
            console.log(activityid)
            var url = window.location.href.split('/');
            var urlall = window.location.href.split('#');
            console.log(urlall);
            var urlpath = urlall.pop();
            console.log(urlpath)
            var domain = url.slice(3, 4)[0];
            console.log(url);
            console.log(domain);
            // console.log(userToken);
            var checkdomain = function(domain, id) {
                // if(domain!="index" && domain!="activity"){
                if (domain != "activity") {

                    $.ajax({
                        url: ACTIVITY_DOMAINISTRUE,
                        type: 'post',
                        data: { domain: domain, activityid: id },
                        dataType: 'json',
                        headers: {
                            'Token': docCookies.getItem("token")
                        },
                        success: function(data) {
                            console.log(data);
                            if (data.code == 200) {
                                init(id);

                            } else {
                                if (urlpath == 'acitivty-detail' || urlpath == 'acitivty-honored' || urlpath == 'acitivty-guests') {
                                    window.location = urlall[0]

                                } else {
                                    window.location = '/404';
                                }

                            }
                        },
                        error: function(xhr) {
                            console.log(xhr);
                        }

                    })
                } else if (domain == "activity") {
                    window.location = "/index/activity/detail/" + id;
                }
                console.log(domain);
            }

            // 设置token cookie
            function setCookie(token, expiredays) {
                var Days = expiredays;
                var exp = new Date();
                exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
                document.cookie = "token=" + escape(token) + ";expires=" + exp.toGMTString() + ";path=/";
            }
            // avatar animation
            $(".top_avatar img").trigger("mouseover");
            var AvatarInterval = 0;
            var AvatarFlag = 0;
            var AvatarTimer = setInterval(function() {
                if (AvatarInterval % 5 == 0) {
                    if (AvatarFlag == 0) {
                        AvatarFlag = 1;
                        $(".top_avatar img").trigger("mouseover");
                    } else {
                        AvatarFlag = 0;
                        $(".top_avatar img").trigger("mouseout");
                    }
                }
                AvatarInterval++;
            }, 5000);


            checkdomain(domain, activityid)

            //报名成功弹出票据模态框
            var activity_ebroll_detail = function(id) {
                $.ajax({
                    url: ACTIVITY_ENROLL_DETAIL + "/" + id, //活动报名详情
                    type: 'get',
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            console.log(urlall[0])
                            Ticket(data.data);
                            qrcodefun1(data.data.ticket_num);
                        }

                    },
                    error: function(xhr) {
                        console.log(xhr);
                    }
                })
            }

            //微信扫码支付下单
            var wechat_scan_pay = function(number) {
                $.ajax({
                    url: ACTIVITY_WX_ORDER,
                    type: 'post',
                    data: {
                        number: number
                    },
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data) {
                        if (data.code == 200) {
                            PaymentQR(data.data.qrcode_url, data.data.number);
                        } else {
                            console.log(number);
                        }

                    },
                    error: function(xhr) {
                        console.log(xhr);
                    }
                })
            }

            //判断是否报名
            var isEnroll = function() {
                var sendData = { 'user_id': docCookies.getItem("weid"), 'activity_id': activityid_all[0] };
                $.ajax({
                    url: ACTIVITY_ENROLL_ISENROLL,
                    dataType: 'json',
                    type: 'post',
                    data: sendData,
                    success: function(data) {
                        console.log(data)
                        if (data.code == 200) {
                            suported();
                        } else {
                            // layer.msg(data.message)
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            }
            isEnroll();
            //报名之后的状态
            var suported = function() {
                $('.bbbao').empty();
                $('.bbbao').append('<span> <a href="javascript:" data-id="1" class="support1" disabled="disabled" style="background: #ccc">已经报名</a></span>')
            }
            var Ticket = function(data) {
                    layer.config({
                        skin: 'winning-class' //自定义样式demo-class
                    })
                    var closeticket = layer.open({
                        skin: 'winning-class',
                        type: 1,
                        area: ['500px', '650px'],
                        title: 0,
                        closeBtn: 0,
                        shadeClose: true,
                        scrollbar: false,
                        content: '<div class="ticket-box">' +
                            '<div class="ticket-box-top">' +
                            '<div class="t_blank"></div>' +
                            '<div class="ticket-qr"></div>' +

                            '<div style="width:92%;text-align:center;padding:10px 0;margin:0 auto;">票号：' + data.ticket_num + '</div>' +
                            '<div style="width:92%;text-align:center;padding:10px 0;margin:0 auto;">活动时请向发起人展示，该码可在个人中心查看</div>' +
                            '</div>' +
                            '<div class="ticket-box-bottom">' +
                            '<div class="ticket-title">' + data.title + '</div>' +
                            '<div class="ticket-time">' + data.begain_time + '&nbsp;' + data.begain_week + '&nbsp;' + data.begain_hour + '~~' + data.end_time + '&nbsp;' + data.end_week + '&nbsp;' + data.end_hour + '</div>' +
                            '<div class="ticket-addr"><span><i class="fa fa-map-marker"></i></span>&nbsp;：' + data.area_name + data.address + '</div>' +
                            '<div class="ticket-detail">' +
                            '<div class="ticket-name">' +
                            '<span class="sign_ticname"></span>：' + data.name +
                            '</div>' +
                            '<div class="ticket-phone">' +
                            '<span class="sign_telphone"></span>：' + data.telphone +
                            '</div>' +
                            '<div class="ticket-position">' +
                            '<span class="sign-ticzw"></span>：' + data.poistion +
                            '</div>' +
                            '<div class="ticket-company">' +
                            '<span class="sign-ticcom"></span>：' + data.company +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>',
                        end: function() {
                            location.reload();
                        },
                        shade: 0.7
                    });
                }
                // 调起支付
            var PaymentQR = function(qr_url, number) {
                    paymentLayer = layer.open({
                        skin: 'layui-layer-rim',
                        type: 1,
                        area: ['400px', '430px'],
                        title: '微信扫码支付',
                        closeBtn: 2,
                        shadeClose: false,
                        scrollbar: false,
                        //content: '<img src="' + QRCODE + '?url=' + qr_url + '" width="300">',
                        content: `<div class="payment-block">
                            <div class="payment-qrcode"><img src="` + QRCODE + `?url=` + qr_url + `" width="300"></div>
                            <div class="payment-desc">
                                <p>付款金额：<b>￥` + CurrentActivity.price + `</b></p>
                            </div>
                            <div class="payment-mark"><img src="/common/img/wepay-logo.png" width="100"></div>
                        </div>`,
                        end: function() {
                            clearInterval(tmr);
                            //location.reload();
                        },
                        shade: 0.7
                    });
                    tmr = setInterval(function() {
                        $.ajax({
                            url: ACTIVITY_ENROLL_ORDER_DETECT,
                            type: 'post',
                            dataType: 'json',
                            data: {
                                number: number
                            },
                            success: function(rep) {
                                if (rep.data.state == 2) {
                                    clearInterval(tmr);
                                    layer.close(paymentLayer);
                                    activity_ebroll_detail(rep.data.enroll_id);
                                }
                            },
                            error: function(xhr) {
                                console.log(xhr);
                            }
                        });
                    }, 1000)
                }
                // 获取我的订单<针对本活动>
            var GetOrder = function(activity_id, callback) {
                $.ajax({
                    url: ACTIVITY_ENROLL_MYORDER,
                    type: 'post',
                    dataType: 'json',
                    data: {
                        activity_id: activity_id
                    },
                    success: function(rep) {
                        callback(rep);
                    },
                    error: function(xhr) {
                        console.log(xhr);
                    }
                });
            }


            var Support = function(id, nickname, imgUrl, applyid) {
                    var datauser = '';
                    var realname = '';
                    var disa = '';
                    if (docCookies.getItem("weid") != null && docCookies.getItem("token") != null) {
                        datauser = localStorage.getItem('dataPhone');
                        realname = localStorage.getItem('realName');
                        disa = 'disabled="disabled"';
                    } else {
                        datauser = '请输入手机号码';
                        realname = '请输入姓名';
                        disa = '';
                    }

                    GetActivity(id, function(rep) {
                                closeindex = layer.open({
                                            type: 1,
                                            area: ['600px', '740px'],
                                            title: 0,
                                            closeBtn: 0,
                                            shadeClose: true,
                                            scrollbar: false,
                                            content: '<div id="signBg">' +
                                                '<div class="signBox">' +
                                                '<div class="sign_head">' +
                                                '<div class="sign_head_title">' +
                                                '确认报名' +
                                                '</div>' +
                                                '<div class="clon1"></div>' +
                                                '<div class="sign_head_contain">' +
                                                '<p class="act_title activity_title_apply"></p>' +
                                                '<p class="act_ttt">' +
                                                '<span class="act_time">' +
                                                '时间： <span class=" act_time_all" >' + rep.data.begain_time + ' ~ ' + rep.data.end_time + '</span>' +
                                                '</span>' +
                                                '<span class="act_time">' +
                                                '<span class="act_time_deadline">' + rep.data.enroll_deadline + '</span> 报名截止' +
                                                '</span>' +
                                                '</p>' +
                                                '<p class="act_dress">地点：' + rep.data.area_name + rep.data.address + '</p>' +
                                                '</div>' +
                                                '</div>' +


                                                '<div class="sign_head">' +
                                                '<div class="sign_head_title">门票信息</div>' +
                                                '<div class="clon1"></div>' +
                                                '<div class="sign_head_contain">' +
                                                '<div class="act_title">' +
                                                '<div class="mp">' +

                                                '<ul></ul>' +
                                                '<div id="tickets"><span>购买数量： </span>' +
                                                '<span id="mins">-</span>' +
                                                '<span><input type="text" class="form-control" id="num" pattern="[0-9]*" maxlength="3" value="1"></span>' +
                                                '<span id="adds">+</span>' +
                                                '</div>' +
                                                '</div>' +

                                                '</div></div>' +
                                                '</div>' +



                                                '<div class="sign_section">' +
                                                '<div class="">' +
                                                '<div class="sign_section_title">' +
                                                '确认信息' +
                                                '</div>' +
                                                '<div class="clon2"></div>' +
                                                '<div class="sign_section_contain">' +
                                                '<div class="sign_name sign_input">' +
                                                '<div class="text">' +
                                                '<input id="username" type="text" ' + disa + ' placeholder="' + realname + '">' +
                                                '</div>' +
                                                '</div>' +

                                                '<div class="sign_phone sign_input" style="width: 540px;height: 38px;">' +
                                                '<div class="text">' +
                                                '<input id="phone" type="text"  ' + disa + '  placeholder="' + datauser + '">' +
                                                '</div>' +
                                                '<button class="sign_code" style="display: none" ">获取验证码</button>' +
                                                '</div>' +
                                                '<div class="sign_yz sign_input" style="display: none;">' +
                                                '<div class="text">' +
                                                '<input type="text" class="check-num-apply" placeholder="请输入验证码">' +
                                                '</div>' +
                                                '<button class="sign_yz_on">在线验证</button>' +
                                                '</div>' +
                                                '<div class="sign_zw sign_input" >' +
                                                '<div class="text">' +
                                                '<input id="zhiw" type="text" placeholder="请填写您的所在职位">' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="sign_com sign_input">' +
                                                '<div class="text">' +
                                                '<input id="gongsi" type="text" placeholder="请填写您的所在公司">' +
                                                '</div>' +
                                                '</div>' +
                                                '</div>' +
                                                '</div>' +
                                                '</div>' +

                                                '<div class="sign_foot">' +
                                                '<div class="sign_foot_contn">' +
                                                '<span class="apply_submit" ">确认</span>' +
                                                '</div>' +
                                                '</div>' +
                                                '</div>' +
                                                '</div>',
                                            success: function() {
                                                    CurrentActivity = rep.data;
                                                    $.ajax({
                                                                url: apiUrl + 'activity/tickets?activity_id=' + window.location.pathname.split('/').pop(),
                                                                type: 'GET',
                                                                success: function(data) {
                                                                        console.log(data);
                                                                        var ids = [];
                                                                        $(".mp ul").append(
                                                                                data.data.reduce((res, e, i) =>
                                                                                    (ids.push([e.weid, e.type, e.total_num - e.sold_num]),
                                                                                        res += `<li id="${e.weid}">
                                            ${e.type == 1 ?
                                                `<div id="p1"><p class="free">免费</p></div>`
                                                :
                                                `<div id="p1"><img src="/common/img/rmb.png">
                                                <p class="price">${e.price}</p></div>`
                                            }
                                            <div id="p2">
                                            <p class="tkname">${e.name}</p>
                                            <p class="tkdscp">${e.description}</p>
                                            </div>
                                            </li>`)
                                , '')
                            );
                            var add = (id, type) => {
                                tid = id;
                                if (type == 1) {
                                    $("#" + id).css('border', '2px solid #ffb03f');
                                    $("#" + id + ' #p2').css({'background': '#ffb03f'});
                                } else {
                                    $("#" + id).css('border', '2px solid #007cd3');
                                    $("#" + id + ' #p2').css({'background': '#007cd3'});
                                    $("#" + id + ' .price').css('color', '#007cd3');
                                    $("#" + id + ' img').attr('src', '/common/img/rmbo.png');
                                }
                                $("#" + id + ' #p2 p').css({'color': 'white'});
                            }
                            var remove = (id) => {
                                ids.filter(x => x[0] != id).map(x => $('#' + x[0]).css('border', '2px solid #dddddd'));
                                ids.filter(x => x[0] != id).map(x => $('#' + x[0] + ' div').css({'background': 'white'}));
                                ids.filter(x => x[0] != id).map(x => $('#' + x[0] + ' div p').css({'color': '#555'}));
                                ids.filter(x => x[0] != id).map(x => $('#' + x[0] + ' .price').css('color', '#555'));
                                ids.filter(x => x[0] != id).map(x => $('#' + x[0] + ' img').attr('src', '/common/img/rmb.png'));
                            }
                            add(ids[0][0], ids[0][1]);
                            $("#num").val(ids[0][2] != 0 ? 1 : 0);
                            var id = ids[0][0];
                            $(".mp ul li").click(function(e) {
                                id = $(e.target).parents('li').attr('id');
                                remove(id);
                                add(id, ids.filter(x => x[0] == id)[0][1]);
                                $("#num").val(ids.filter(x => x[0] == id)[0][2] != 0 ? 1 : 0);
                            })
                            $("#num").keyup(function(){
                                var curr = parseInt($("#num").val());
                                var total = ids.filter(x => x[0] == id)[0][2];
                                if (curr > total) {
                                    $("#num").val(total);
                                    layer.msg('已超出最大购票数', {
                                        time: 1000
                                    })
                                }
                            })

                            $("#mins").click(function(){
                                var curr = parseInt($("#num").val()) - 1;
                                if (curr >= 1) {
                                    $("#num").val(curr);
                                } else {
                                    layer.msg('票数不可少于1张', {
                                        time: 1000
                                    })
                                }
                            })
                            $("#adds").click(function(){
                                var curr = parseInt($("#num").val()) + 1;
                                var total = ids.filter(x => x[0] == id)[0][2];
                                if (curr <= total) {
                                    $("#num").val(curr);
                                } else {
                                    layer.msg('已无余票', {
                                        time: 1000
                                    })
                                }
                            })
                        }
                    })
                },
                end: function() {
                    //location.reload();
                },
                shade: 0.7
            });
            $('#phone').val(localStorage.getItem('dataPhone'));
            $('#username').val(localStorage.getItem('realName'));
        });

        activitydetail(id, nickname, imgUrl, applyid);

        //获取验证码
        var lock = false;
        var isCheckNum = false; //默认false
        var count = false; //验证码倒计时
        var getCheck = function(phoneNum) {
            var timeout = false;
            var seconds = 60;

            lock = true;
            count = setInterval(function() {
                if (seconds > 0) {
                    seconds -= 1;
                    $(".sign_code").text(seconds + "秒");
                } else {
                    $(".sign_code").text("重新获取验证码");
                    timeout = false;
                    seconds = 60;
                    lock = false;
                    clearInterval(count);
                }
            }, 1000);

            $.ajax({
                url: CODES,
                dataType: 'json',
                type: 'post',
                data: { 'phone': phoneNum },
                success: function(data) {
                    isCheckNum = true;
                    console.log(data);
                },
                error: function(err) {
                    console.log(err);
                }
            })
        }

        var phoneNum = 0;
        var checkNum = 0;
        setTimeout(function() {
            $(".sign_code").bind("click", function() {

                console.log(!lock);
                if (!lock) {
                    phoneNum = $("#phone").val();

                    var regexp = /^(13|14|17|15|18)/;
                    var reg = new RegExp(regexp);
                    console.log(phoneNum, reg.test(phoneNum));

                    if (reg.test(phoneNum) && phoneNum.length == 11) {
                        getCheck(phoneNum);
                    } else {
                        layer.msg("手机号码错误", {
                            time: 1000
                        });
                    }
                }

            })
        }, 1000);
        //在线验证
        var login = function(phoneNum, checkNum) {
            $.ajax({
                url: LOGIN,
                type: 'post',
                data: { 'phone': phoneNum, 'code': checkNum },
                success: function(data) {
                    if (data.code != -200) {

                        localStorage.setItem('token', data.token);
                        localStorage.setItem('weid', data.data.weid);
                        localStorage.setItem('phone', data.data.phone);
                        setCookie(data.token, 7);
                        $.ajaxSetup({
                            global: true,
                            dataType: 'json',
                            headers: {
                                'Token': data.token
                            },
                            error: function() {
                                layer.msg("系统错误，请稍后再试", {
                                    time: 1000
                                });
                            }
                        });
                        $(".sign_code,.sign_yz").css("display", "none");
                        isCheckNum = false;
                    } else {
                        lock = false;
                        clearInterval(count);
                        layer.msg("验证失败，请重新获取验证码", {
                            time: 1000
                        });
                        $(".sign_code").text("重新获取验证码");
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            })
        }

        //点击在线验证按钮
        var logBt = function() {
            phoneNum = $("#phone").val();
            checkNum = $(".check-num-apply").val();
            console.log(checkNum, phoneNum);
            var regexp = /^(13|14|17|15|18)/;
            var reg = new RegExp(regexp);
            if (reg.test(phoneNum) && phoneNum.length == 11 && checkNum.length == 6) {
                login(phoneNum, checkNum);
            } else {
                if (!(phoneNum.length == 11) || !reg.test(phoneNum)) {

                    layer.msg("手机号码错误", {
                        time: 1000
                    });
                    return;
                }
                if (!(checkNum.length == 6) || !isCheckNum) {
                    layer.msg("手机验证码错误", {
                        time: 1000
                    });
                    return;
                }
                /*if (!isChecked) {
                    mess_tusi("请确认服务条款");
                    return;
                }*/
            }
        }
        setTimeout(function() {
            $(".sign_yz_on").click(function() {

                logBt();
            })
        }, 1000);

        $("#phone").keydown(function(evt) {
            switch (evt.keyCode) {
                case 13:
                    $(".check-num-apply").select();
            }
        });

        $(".check-num-apply").keydown(function(evt) {
            switch (evt.keyCode) {
                case 13:
                    logBt();
            }
        });
        var tid; //购票id
        var number; //购票数
        setTimeout(function() {
            $(".apply_submit").bind("click", function() {
                var name = $('#username').val();
                var telphone = $('#phone').val();
                var poistion = $("#zhiw").val();
                var company = $("#gongsi").val();
                if (tid == undefined) {
                    layer.msg('请选择门票', {
                        time: 1000
                    })
                }
                if (name == "") {
                    layer.msg("请输入名字", {
                        time: 1000
                    });
                    return;
                }
                if (telphone == "") {
                    layer.msg("请输入电话号码", {
                        time: 1000
                    });
                    return;
                }



                if (isNull(docCookies.getItem("weid")) || isNull(docCookies.getItem("token"))) {
                    layer.msg("请验证您的手机号", {
                        time: 1000
                    });
                    return;
                }

                if (poistion == "") {
                    layer.msg("请输入职位", {
                        time: 1000
                    });
                    return;
                }
                if (company == "") {
                    layer.msg("请输入公司", {
                        time: 1000
                    });
                    return;
                }

                number = parseInt($("#num").val());
                if (number == 0) {
                    layer.msg('请购买门票', {
                        time: 1000
                    })
                    return;
                }
                var sendData = {
                    activity_id: activityid,
                    name: name,
                    telphone: telphone,
                    poistion: poistion,
                    company: company,
                    ticket_id: tid,
                    num: number
                }
                $.ajax({
                    url: ACTIVITY_ENROLL_STORE,
                    type: 'post',
                    data: sendData,
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    success: function(data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            localStorage.setItem("phone", "");
                            localStorage.setItem('dataPhone', "");
                            localStorage.setItem('realName', "");
                            //location.reload();
                            layer.close(closeindex);
                            if (data.data.status == 2)
                                activity_ebroll_detail(data.data.enroll_id);
                            else if (data.data.status == 1)
                                wechat_scan_pay(data.data.number);
                        } else if (data.code == 401) {
                            layer.msg("请先登录在进行操作", {
                                time: 1000
                            });
                        } else {
                            layer.msg(data.message);
                            //location.reload();
                            // Ticket(localStorage.getItem(weid));
                        }
                    },
                    error: function(xhr) {
                        layer.closeAll('loading');
                        console.log(xhr);
                    }
                });
                layer.load();
            })
        }, 1000);
    }



    // 1.1浏览数
    var view_num = function(id) {
        $.ajax({
            url: ACTIVITY_ADDVIEW + "/" + id,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {

            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }
    view_num(activityid);
    // 1.2判断是否收藏
    var iscollection = function(userid, act_id) {
        $.ajax({
            url: ACTIVITY_COLLECTION_ISCOLLECTION,
            type: 'post',
            data: { user_id: userid, activity_id: act_id },
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    $(".collect-btn-click").css({
                        "background": '#d4d4d4',
                        "cursor": 'default'
                    });
                    $(".collect-btn-click").text("已收藏");
                    $(".collect-btn-click").data("id", 2);
                    $(".collect-btn-click").attr("id", data.data);

                    // $(".collect-btn-click").unbind("click");
                    //
                    //
                    //
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }
    iscollection(docCookies.getItem("weid"), activityid);
    // 1获取活动详情
    var activitydetail = function(id, nickname, imgUrl, applyid = 0) {
            $.ajax({
                url: ACTIVITY_DETAIL + "/" + id,
                type: 'get',
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data) {
                    if (data.code == 200) {
                        console.log(applyid);
                        CurrentActivity = data.data;
                        $('title').text(data.data.title);

                        if (applyid == 1) {
                            $(".activity_title_apply").text(data.data.title);
                            $(".act_time_all").text(data.data.begain_time.substr(5) + " ~~ " + data.data.end_time.substr(5));
                            $(".act_time_deadline").text(data.data.enroll_deadline);
                            $(".act_dress").text(data.data.area_name + data.data.address);
                        } else {
                            $(".activity_title").text(data.data.title);
                            $(".activity_title_x").attr('title', data.data.title)
                            $(".activity_title_x").text(data.data.title);

                            $(".cover img").attr("src", qiniu_bucket_domain + data.data.cover);
                            $(".username").text(nickname);

                            $(".end_time").text(data.data.end_time);
                            $(".activity_time").text(data.data.begain_time.split(" ")[0] + " -- " + data.data.end_time.split(" ")[0]);
                            $(".deadline").text(data.data.enroll_deadline);
                            $(".view_num").text(data.data.view_num);
                            $(".city").text(data.data.area_name);
                            $(".apply_num").text(data.data.enroll_num);
                            if (data.data.type == 1) {
                                $(".pay-type span").text('免费');
                            } else {
                                //$(".pay-type span").html('￥<b>' + data.data.price + '</b>');
                                $(".pay-type span").html('收费');
                            }
                            if (data.data.enroll_limit > 0) {
                                $(".enroll_limit").text(data.data.enroll_limit);

                            } else {
                                $(".enroll_limit").text("多");
                            }
                            $("#acitivty-detail").html(data.data.content);

                            $("#acitivty-detail img").css({
                                "max-width": $(".project-box").width() - 30
                            });
                            $(".enroll_num").text(data.data.enroll_num);

                            if (data.data.onStatus == "已结束") {
                                $(".support").css("background", "#ccc");

                            }
                            qrcodefun(id);
                            $(".support").unbind().bind("click", function() {


                                if (data.data.onStatus == "已结束") {
                                    mess_tusi("来晚啦，该活动报名时间已过");

                                } else {
                                    GetOrder(id, function(rep) {
                                        layer.closeAll('loading');
                                        if (rep.code == 401 || rep.data.status == 1) {
                                            if (data.data.enroll_num < data.data.enroll_limit || data.data.enroll_limit == 0) {
                                                Support(id, nickname, imgUrl, $(this).data('id'));
                                                $('#phone').val(localStorage.getItem('dataPhone'));
                                                $('#username').val(localStorage.getItem('realName'));
                                            } else {
                                                mess_tusi("来晚啦，该活动报名人数已满");
                                            }
                                        } else if (rep.data.status == 2) {
                                            wechat_scan_pay(rep.data.number);
                                        } else if (rep.data.status == 3) {
                                            mess_tusi(rep.data.msg);
                                        }
                                    });
                                    layer.load();

                                }

                            })

                        }

                    } else {
                        mess_tusi(data.message);
                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        }
        // 根据id查询活动
    var GetActivity = function(id, callback) {
        $.ajax({
            url: ACTIVITY_DETAIL + "/" + id,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                callback(data);
            },
            error: function(xhr) {
                console.log(xhr);
            }
        });
    }

    var startactivitydetail = function(id, nickname, imgUrl) {
            if (id != null && id != '' && id.length == 36) {
                activitydetail(id, nickname, imgUrl);
                guestlistdetail(id);
                applylistdetail(id);
            }
            /*$(".support").bind("click",function(){
                Support(id,nickname,imgUrl,$(this).data('id'));
            })*/
        }
        // 二维码插件
    var qrcodefun = function(id) {
        var qrcode_val = localhostPath + domain + "/activity/" + id;
        // if ($.browser.msie && $.browser.version <= 8){
        if ($.support.msie && $.support.version <= 8) {

            $("#activity_code").qrcode({
                render: "table",
                width: 110,
                height: 110,
                text: qrcode_val
            });
        } else {
            jQuery("#activity_code").qrcode({
                width: 110,
                height: 110,
                text: qrcode_val
            });
        }

    }
    var qrcodefun1 = function(ticket_num) {
        var qrcode_val = ACTIVITY_ENROLL_CHECK + "?e_number=" + ticket_num;
        // if ($.browser.msie && $.browser.version <= 8){
        if ($.support.msie && $.support.version <= 8) {

            $(".ticket-qr").qrcode({
                render: "table",
                width: 110,
                height: 110,
                text: qrcode_val
            });
        } else {
            jQuery(".ticket-qr").qrcode({
                width: 110,
                height: 110,
                text: qrcode_val
            });
        }

    }


    // 2.1嘉宾模板
    var guestlist = function(data) {
            var guesthtml = '<div class="actvity-supporter col-sm-12">' +
                '<div class="supporter_img col-xs-6">' +
                '<img class="img-circle " src="' + qiniu_bucket_domain + data.avatar + '">' +
                '</div>' +
                '<div class="supporter_user">' +
                '<span class="supporter_user_log">' + data.name + '</span>' +
                '<div class="supporter_user_color">' + data.position + '</div>' +
                '<div class="supporter_user_color">' + data.company + '</div>' +
                '</div>' +
                '</div>';
            return guesthtml;
        }
        // 2.活动嘉宾   //查找嘉宾列表根据活动id
    var guestlistdetail = function(id) {
        //ACTIVITY_GUEST_LISTS
        var limit = "";
        var page = "";
        var sendData = {
            activity_id: id,
            limit: limit,
            page: page
        }
        $.ajax({
            url: ACTIVITY_GUEST_LISTS,
            type: 'post',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    $(".guest_num").text(data.data.total);
                    console.log(data.data.total);
                    if (data.data.total > 0) {
                        $("#acitivty-honored").children().remove();
                        data.data.list.map(x => {
                            $("#acitivty-honored").append(guestlist(x));

                        })
                    }

                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    $(".collect-btn-click").bind("click", function() {
        console.log($(this).data("id"));
        if ($(this).data("id") == 1) {
            $(this).data("id", 2);
            like(activityid);
        } else if ($(this).data("id") == 2) {
            canclecollect($(this).attr("id"));
            $(this).data("id", 1);

        }

    })
    $(".see-more").bind("click", function() {
            applylistdetail(activityid, "");
        })
        //3.1活动成员模板
    var applylist = function(data) {
            var avatarsrc = "";
            if (data.avatar == null || data.avatar == "") {
                avatarsrc = "/common/img/avatar.png";
            } else {
                avatarsrc = qiniu_bucket_domain + data.avatar;
            }
            var applyhtml = '<div class="z">' +
                '<p class="">' +
                '<img class="" src="' + avatarsrc + '">' +
                '</p>' +
                '<p class="">' +
                '<span class="" style="width: 57px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: block;">' + data.name + '</span>' +
                '</p>' +
                '</div>';
            return applyhtml;
        }
        //3.活动成员
    var applylistdetail = function(id, limit = 10) {
        var limit = limit;
        var page = "";
        var sendData = {
            activity_id: id,
            limit: limit,
            page: page
        }
        console.log(sendData);
        $.ajax({
            url: ACTIVITY_ENROLL_LISTS,
            type: 'post',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    if (data.data.total > 0) {
                        $("#acitivty-guests").children().remove();
                        data.data.list.map(x => {
                            $("#acitivty-guests").append(applylist(x));

                        })
                    }
                    if (limit == "" || data.data.total <= 10) {
                        $(".see-more").text("没有更多");
                    }

                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    //收藏
    var like = function(weid) {
        console.log(weid);
        $.ajax({
            url: ACTIVITY_COLLECTION_STORE,
            type: 'post',
            data: { activity_id: weid },
            dataType: 'json',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    /*console.log(data.data[0].praise_num);
                    $(".like-count").text(data.data[0].praise_num);
                    $(".read-like img").attr("src", "../common/img/good+.png");*/
                    $(".collect-btn-click").css({
                        "background": '#d4d4d4',
                        "cursor": 'default'
                    });
                    $(".collect-btn-click").text("已收藏");
                    $(".collect-btn-click").attr("id", data.data);
                    // $(".collect-btn-click").unbind("click");
                    /* data.data.map(x => {
                         $("#collectnum").text(x.collections);

                     })*/
                    likeState = true;
                } else {
                    mess_tusi("请登录");
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }
    var canclecollect = function(id) {
        $.ajax({
            // url: ACTIVITY_LIST,
            url: ACTIVITY_COLLECTION_DESTROY + "/" + id,
            type: 'get',
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    $(".collect-btn-click").css({
                        "background": '#80ccf4',
                        "cursor": 'pointer'
                    });
                    $(".collect-btn-click").text("+收藏");
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }


    /* var iscollect=function(id){
         $.ajax({
             url: GOODS_COLLECTION_ISCOLLECTION+'/' + id,
             type:'get',
             headers: {
                     'Token': docCookies.getItem("token")
                 },
             success:function(data){
                 console.log(data);
                 if(data.code!=401){
                     if(data.code!=200 ){
                     $(".collect-btn-click").css({
                         "background":'#d4d4d4',
                         "cursor":'default'
                     });
                     // $(".collect-btn-click").unbind("click");
                     $(".collect-btn-click").data("id",2);
                 }
                 }

             }
         })
     }*/
    var activityinfo = function(weid) {
        $.ajax({
            url: ACTIVITY_ACTIVITYINFO + '/' + weid,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    $(".act_num").text(data.data.count);
                    $(".act_per_num").text(data.data.countmember);
                }

            }
        })
    }


    //back to top
    $("#toTop").hide();
    $(".read").scroll(function() {
        if ($(".read").scrollTop() > $(window).height() / 2) {
            $("#toTop").fadeIn(500);
            $("#toTop").hover(function() {
                $(this).css("background-color", "#eeeeee");
            }, function() {
                $(this).css("background-color", "white");
            });
        } else {
            $("#toTop").fadeOut(500);
        }
    })

    $("#toTop").click(function() {
        $('.read').animate({ scrollTop: 0 }, 300);
    })


    //获取通用用户信息
    var host = ApiMaterPlatQiniuDomain;
    console.log(docCookies.getItem("weid"))
    var getUserDomain = function(id) {
        $.ajax({
            url: USERDETAIL + '/' + id,
            type: 'get',
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    if (data.data != null) {
                        localStorage.setItem('dataPhone', data.data.phone);
                        localStorage.setItem('realName', data.data.real_name);

                    } else {
                        localStorage.setItem('dataPhone', '');
                        localStorage.setItem('realName', '');
                    }
                    // console.log(data.data.phone)
                } else {
                    layer.mag(massage);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }
    getUserDomain(docCookies.getItem("weid"));
    var getUserInfo = function(url, id) {
        $.ajax({
            url: url + id,
            type: 'get',
            /*headers: {
                'Token': docCookies.getItem("token")
            },*/
            success: function(data) {

                console.log(data);
                if (data.code == 200) {
                    var info = data.data;

                    var weid = info.weid;
                    console.log(weid)
                    var imgUrl = info.avatar;
                    if (imgUrl.indexOf('http') === -1) {
                        imgUrl = host + imgUrl;
                    }
                    if (info.avatar != "") {
                        // $("#head-icon, .user-head").css({
                        //     "background": "url(" + imgUrl + ") no-repeat center",
                        //     "background-size": "100%"
                        // });
                        $(".top_avatar>img").attr("src", imgUrl);



                    } else {
                        // $("#head-icon, .user-head").css({
                        //     "background": "url(/common/img/avatar.png) no-repeat center",
                        //     "background-size": "110%"
                        // });
                        $(".top_avatar>img").attr("src", "/common/img/avatar.png");

                    }
                    if (info.nickname == null) {
                        var nickname = info.real_name;
                    } else {
                        var nickname = info.nickname;
                    }
                    $(".line-0,.linkto").html(
                        nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".oline-2").find("span").eq(1).text(info.motto);
                    $(".user-cnt").text(info.real_name);
                    artCount(weid);
                    //artTypeList(weid);
                    // catesfun(weid);
                    startactivitydetail(activityid, nickname, imgUrl);
                    activityinfo(weid);

                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    var hasDomain = function(weid) {
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                if (data.code == 200) {
                    console.log(data);
                    if (data.data == null) {

                    } else {
                        //微主页banner图
                        var bgLogo = data.data.background;
                        if (bgLogo != null) {
                            $("#art-head").css({
                                "background": "url(" + imgSet(bgLogo, 1100, 235, 3) + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                        //微名片背景
                        var bgUser = data.data.background_user;
                        if (bgUser != null) {
                            $(".user-info").css({
                                "background": "url(" + imgSet(bgUser, 328, 130, 3) + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                        if (data.data.is_brand == 1) {
                            hasBrand(userId);
                        }
                    }
                } else {
                    /*layer.msg(data.message, {
                        time: 1500
                    });*/
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    var hasBrand = function(weid) {
        $.ajax({
            url: BRAND_DETAIL_USER + '/' + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    console.log(data);
                    if (data.data == null) {

                    } else {
                        $(".line-0").html(
                            data.data.title + '<img src="/user/img/vrenzheng.png" alt="">'
                        );
                        $(".line-1").text("品牌介绍");
                        var logo = data.data.logo;
                        if (logo != null) {
                            $("#head-icon").css({
                                "background": "url(" + logo + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                    }

                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    //个性域名用户weid
    var userId;
    var __init = function(domain) {
        $.ajax({
            url: PAGES_DETAIL_DOMAIN + domain,
            type: 'GET',
            success: function(data) {
                if (data.code == 200) {
                    //var domain = data.data.domain;
                    console.log(data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        console.log('userId:', userId);
                        console.log('userDetail')
                        getUserInfo(USERDETAIL, "/" + userId);
                        hasDomain(userId);
                    } else {
                        domain = '';
                        getUserInfo(FOUNDER, '');
                        console.log('router error')
                    }
                } else {
                    // window.location.href = "/*";
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    if (domain == 'wemall') {
        domain = '';
    } else {
        domain = "/" + domain;
    }

    if (domain != '') {
        __init(domain);
    }

    var artCount = function(weid) {
        $.ajax({
            url: ARTICLES_LISTCOUNT + "?userId=" + weid,
            type: 'get',
            success: function(data) {
                //console.log(data);
                if (data.code == 200) {
                    $(".user-art").children('div:eq(0)').text(data.data);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);

})
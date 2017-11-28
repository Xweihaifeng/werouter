var token = window.localStorage.getItem('token');
if (token) {
    $.ajaxSetup({
        global: true,
        headers: {
            'Token': token,
        }
    });
}
var init = function() {
    $(document).on("click", ".support", function() {
        var id = $(this.data('activity_id'));
        GetOrder(id, function(rep) {
            layer.closeAll('loading');
            if (rep.code == 401 || rep.data.status == 1) {
                if (data.data.enroll_num < data.data.enroll_limit || data.data.enroll_limit == 0) {
                    Support(id);
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
    })
    qrcodefun(id);

}

init();



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
//报名成功弹出票据模态框
var activity_ebroll_detail = function(id) {
    $.ajax({
        url: ACTIVITY_ENROLL_DETAIL + "/" + id, //活动报名详情
        type: 'get',
        headers: {
            'Token': localStorage.getItem('token')
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
            'Token': localStorage.getItem('token')
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
    var sendData = { 'user_id': localStorage.getItem('weid'), 'activity_id': activityid_all[0] };
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


var Support = function(id) {
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
                '<p class="act_dress">地点：' + rep.data.address + '</p>' +
                '</div>' +
                '</div>' +


                '<div class="sign_head">' +
                '<div class="sign_head_title">门票信息</div>' +
                '<div class="clon1"></div>' +
                '<div class="sign_head_contain">' +
                '<div class="act_title">' +
                (rep.data.type == 1 ? '<img src="\/common\/img\/ticket-jia.png" >' : '<p>￥<b>' +
                    rep.data.price + `</b> / 每人</p>`) +
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
            },
            end: function() {
                //location.reload();
            },
            shade: 0.7
        });
        $('#phone').val(localStorage.getItem('dataPhone'));
        $('#username').val(localStorage.getItem('realName'));
    });


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
    setTimeout(function() {
        $(".apply_submit").bind("click", function() {
            var name = $('#username').val();
            var telphone = $('#phone').val();
            var poistion = $("#zhiw").val();
            var company = $("#gongsi").val();
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



            if (isNull(localStorage.getItem('weid')) || isNull(localStorage.getItem('token'))) {
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
            var sendData = {
                activity_id: activityid,
                name: name,
                telphone: telphone,
                poistion: poistion,
                company: company
            }
            $.ajax({
                url: ACTIVITY_ENROLL_STORE,
                type: 'post',
                data: sendData,
                headers: {
                    'Token': localStorage.getItem('token')
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


// 根据id查询活动
var GetActivity = function(id, callback) {
    $.ajax({
        url: ACTIVITY_DETAIL + "/" + id,
        type: 'get',
        headers: {
            'Token': localStorage.getItem('token')
        },
        success: function(data) {
            callback(data);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
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
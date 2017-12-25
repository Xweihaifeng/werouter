/**
 * Created by Hongguang on 2017/8/29.
 */

// 判断 sessionStorage
if (sessionStorage.lastname == "we_title_1") {
    $("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_1").find(".title-img").css("transform", "rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:', favicon);
$('#favicon').attr('href', favicon);

$(document).ready(function() {
    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle, #right").height(currHeight);

    $(window).resize(function() {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function() {
        $(".add").show();
    }, function() {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function() {
        $(".avatar").show();
    }, function() {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function() {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })
})

//验证手机iiph2
var a = 0; //定义点击次数
//发送验证码
var shouji = "";
var Code_o = "";
var iiph2 = "";
var timer_a = null; // 定时器
//定义可复用的代码块
var error1 = function() {
    layer.msg('手机号错误', {
        area: ['255px', '55px'],
        time: 2000
    });
}
var error2 = function() {
    layer.msg('手机号码不能为空', {
        area: ['255px', '55px'],
        time: 2000
    });
}
var error3 = function() {
    layer.msg('验证码不能为空', {
        area: ['255px', '55px'],
        time: 2000
    });
}
var error4 = function() {
    layer.msg('验证码错误', {
        area: ['255px', '55px'],
        time: 2000
    });
}
$("#btn_1").on("click", function() {
    var $that = $(this);
    var tel_phone = $("#iiph1").val();
    var btn_num = 60;
    if (!(/^1[34578]\d{9}$/.test(tel_phone))) {
        error1();
        return false;
    } else {
        shouji = tel_phone;
        timer_a = setInterval(function() {
            btn_num--;
            if (btn_num <= 0) {
                btn_num = 60;
                $that.removeClass("disabled");
                $that.text("发送验证码");
                clearInterval(timer_a);
                return;
            }
            $that.text("重新发送剩余" + btn_num);
            $that.addClass("disabled");
        }, 1000)

        //请求验证码
        $.ajax({
            type: "GET",
            headers: {
                'Token': docCookies.getItem("token")
            },
            url: apiUrl + "/common/code",
            data: {
                phone: shouji,
            },
            dataType: "json",
            success: function(data) {
                console.log(data);
            },
            error: function() {
                console.log("出错了");
            }
        });
    }
});
var btgn_s = function() {
        var tel_phone = $("#iiph1").val();
        if (tel_phone == "") {
            error2();
            return;
        } else if (!(/^1[34578]\d{9}$/.test(tel_phone))) { //判断手机号
            error1();
            return;
        } else if ($("#code_as").val() == "") {
            error3();
            return;
        } else {
            if (a == 0) {

                Code_o = $("#code_as").val();
                $.ajax({
                    type: "POST",
                    headers: {
                        'Token': docCookies.getItem("token")
                    },
                    url: apiUrl + "userAct",
                    data: {
                        phone: shouji,
                        code: Code_o,
                        weid: docCookies.getItem("weid"),
                        from_type: 3,
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data.code == 200) {
                            localStorage.setItem('token', data.data.user.token);
                            localStorage.setItem('weid', data.data.user.weid);
                            localStorage.setItem('phone', data.data.user.phone);
                            localStorage.setItem('avatar', data.data.user.avatar);
                            localStorage.setItem('user', data.data.user);
                            setCookie(data.token, 7);
                            setTimeout(function() {
                                location.href = "/user";
                            }, 500);
                            $(".fom-axx").hide();
                            $(".fom-axx1").show();
                            //中途
                            $(".btn-xinxi").css({
                                background: "#EEE",
                                color: "#FFF",
                                border: "none"
                            });
                            $(".btn-xinxi p").css("border-left", "5px solid #FFF");
                            $(".btn-xinxi1").css({
                                background: "#12ADFF",
                                color: "#FFF"
                            });
                            $(".btn-xinxi1 p").css({
                                borderLeft: "5px solid #12ADFF",
                            });
                            a++; //必须+1

                        } else if (data.code == -200) {
                            error4();
                        }
                    },
                    error: function() {
                        console.log("出错了");
                    }
                });

            } else if (a == 1) {
                if ($("#iiph2").val() == "") {
                    error2();
                    return;
                } else if (!(/^1[34578]\d{9}$/.test($("#iiph2").val()))) {
                    error1();
                    return;
                } else if ($("#inputPassword3").val() == "") {
                    error3();
                    return;
                } else {
                    $.ajax({
                        type: "POST",
                        headers: {
                            'Token': docCookies.getItem("token")
                        },
                        url: apiUrl + "userAct",
                        data: {
                            phone: $("#iiph2").val(),
                            code: $("#inputPassword3").val(),
                        },
                        dataType: "json",
                        success: function(data) {
                            if (data.code == 200) {
                                localStorage.setItem('token', data.data.user.token);
                                localStorage.setItem('weid', data.data.user.weid);
                                localStorage.setItem('phone', data.data.user.phone);
                                localStorage.setItem('avatar', data.data.user.avatar);
                                localStorage.setItem('user', data.data.user);
                                setCookie(data.token, 7);
                                setTimeout(function() {
                                    location.href = "/user";
                                }, 500);
                                $(".btn-xinxi2").css({
                                    background: "#12ADFF",
                                    color: "#FFF"
                                })
                                $(".btn-xinxi1").css({
                                    background: "#EEE",
                                    color: "#FFF"
                                });
                                $(".btn-xinxi1 p").css({
                                    borderLeft: "5px solid #EEE",
                                    //						border:"none"''
                                });
                                $(".fom-axx1").hide();
                                $(".fom-axx3").show();
                                $("#btn").hide();

                            } else if (data.code == -200) {
                                error4();
                            }
                        },
                        error: function() {
                            console.log("出错了");
                        }
                    });
                }
            }
        }

    }
    //   下一步
$("#btn").on("click", btgn_s);

//发送验证码

$("#btn_fs").on("click", function() {
    iiph2 = $("#iiph2").val()
    var $that = $(this);
    var btn_num = 60;
    clearInterval(timer_a);
    timer_a = setInterval(function() {
        btn_num--;
        if (btn_num <= 0) {
            btn_num = 60;
            $that.removeClass("disabled");
            $that.text("发送验证码");
            clearInterval(timer_a);
            return;
        }
        $that.text("重新发送剩余" + btn_num);
        $that.addClass("disabled");
    }, 1000)
    $.ajax({
        type: "GET",
        headers: {
            'Token': docCookies.getItem("token")
        },
        url: apiUrl + "/common/code",
        data: {
            phone: iiph2,
        },
        dataType: "json",
        success: function(data) {
            console.log(data); //成功
        },
        error: function() {
            console.log("出错了");
        }
    });
})

//回车触发

$(document).keydown(function(event) {

    if (event.keyCode === 13) {
        btgn_s();
    }
});
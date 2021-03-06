/**
 * Created by weifeng on 2017/8/29.
 */

// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_1"){
    $("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_1").find(".title-img").css("transform","rotate(90deg)");
}

$(document).ready(function(){
    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle, #right").height(currHeight);

    $(window).resize(function () {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function () {
        $(".add").show();
    }, function () {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function () {
        $(".avatar").show();
    }, function () {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    //  登录token参数
    var token = docCookies.getItem("token");
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    // 实名认证 > 在线认证信息显示
    var options1 = $.get(CERT_REALNAME_DETAIL);
    options1.done(function(data) {

        if(data.code == -200) {
            return false;
        }
        if(data.code === 200) {
            var result = data.data;
            if(result == null) {
                return false;
            }
            if(result.is_authenticated == 2) {
                $(".media-heading")  .text("在线认证失败，重新提交...").css("color", "#ec2d2d");
                $(".warn-img")       .attr("src", "/common/img/refuse.png");
                $(".cert-to-pass")   .show();
                $("#id-name").val(result.name);
                $("#id-card").val(result.card_id);
                return false;
            }
            $(".cert-success-info").show();
            $(".form-horizontal").hide();
        }
    });
    options1.fail(function(error) {
        console.error(error)
    });

    // 输入状态提示
    var name, id_card_number;
    $("#id-name").blur(function(){
        name = $("#id-name").val();
        if (name != '') {
            $(".correct-name").show();
            $(".correct-name img").attr('src', '/common/img/selected.png');
        } else {
            $(".correct-name").show();
            $(".correct-name img").attr('src', '/common/img/close.png');
        }
    })

    $("#id-name").focus(function(){
        $(".correct-name").hide();
    })

    $("#id-number").blur(function(){
        id_card_number = $("#id-number").val();
        if (id_card_number != '' && isCardNo(id_card_number)) {
            $(".correct-id").show();
            $(".correct-id img").attr('src', '/common/img/selected.png');
        } else {
            $(".correct-id").show();
            $(".correct-id img").attr('src', '/common/img/close.png');
        }
    })

    $("#id-number").focus(function(){
        $(".correct-id").hide();
    })

    // 身份证号码验证信息
    function isCardNo(card) {
        var objCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return objCard.test(card);
    }

    $(".pay_qr_clear").click(function() {
        $(".pay_qr").hide();
    })

    function online_auth_pay(e) {
        $.get(apiUrl + 'wechatpay/online_auth_pay/' + e.weid).done(function(res) {
            if(res.code === 200) {
                $("#price").text(res.data.auth_money);
                $(".pay_qr_img").attr("src", CMS_DETAIL_QRCODE + res.data.qr_url);
                $(".pay_qr").show();

                var timer = setInterval(function() {
                    var options24 = $.post(apiUrl +"cert/realName/apply_order_detect", { order: res.data.order_id });
                    options24.done(function(body) {
                        if(body.code == 200) {
                            if(body.data.state == 1) {

                                $(".pay_qr").hide();
                                clearInterval(timer);
                                layer.msg("付款成功！", { time: 2500 });
                                
                                if(body.data.code != 0) {
                                    $(".cert-to-pass")   .show();
                                    $(".media-heading")  .text("在线认证失败，重新提交...").css("color", "#ec2d2d");
                                    $(".warn-img")       .attr("src", "/common/img/refuse.png");
                                    $("#submit").attr("disabled", false);
                                    return false;
                                }

                                $(".cert-to-pass, .form-horizontal") .slideUp();
                                $(".cert-success-info, #v_v_cert")   .slideDown();
                                return false;
                            }
                        }
                    });
                    options24.fail(function(error) {
                        console.error(error);
                    });
                }, 1000);

                $(".pay_qr_clear").click(function() {
                    clearInterval(timer);
                    $("#submit").attr("disabled", false);
                    $(".pay_qr").hide();
                });
            }
        })
    }

    // 实名认证 > 在线认证信息提交
    $("#submit").click(function(){
        var body = {};
        body.name = $("#id_name").val();
        body.card_id = $("#id_card").val();

        if(!body.name || !body.card_id) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入", { time: 2500 });
            return false;
        }

        $(this).attr("disabled", true);
        var options = $.post(CERT_ONLINEREALNAME, body);
        options.done(function(data) {
            if(data.code == -200) {
                $(this).attr("disabled", false);
                return false;
            }

            if(data.code === 200) {

                if(data.data.type === 1) {
                    if(data.data.code != 0) {
                        $(".cert-to-pass")   .show();
                        $(".media-heading")  .text("在线认证失败，重新提交...").css("color", "#ec2d2d");
                        $(".warn-img")       .attr("src", "/common/img/refuse.png");
                        $("#submit").attr("disabled", false);
                        return false;
                    }

                    $(".cert-to-pass, .form-horizontal") .slideUp();
                    $(".cert-success-info, #v_v_cert")   .slideDown();
                } else if(data.data.type === 2) {
                    online_auth_pay(data.data);
                }
            }
        })
        options.fail(function(error) {
            console.error(error);
        });
        
        return false;
    })

})
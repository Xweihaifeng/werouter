
function apply_state1(result1) {
    if(result1.apply_type == 1) {
        $(".member_off_personal").show();
        $(`#`+result1.plat_member_level_id+``).addClass("member_active1");
        $("#member_price").text($("#"+ result1.plat_member_level_id +"").attr("price"));
        $("#display_name").text($("#"+ result1.plat_member_level_id +"").attr("title"));
        $("#member_price")        .text(result1.plat_member_price);
        $("#member_first_name")   .val(result1.name);
        $("#member_first_tel")    .val(result1.phone);
        $("#member_first_address").val(result1.plat_member_address);

        if(!result1.paper_img) {
            console.info("申请资料：" + result1.paper_img);

        } else if (result1.paper_img.indexOf('http') != 0 && result1.paper_img != "") {

            result1.paper_img = imgSet(result1.paper_img, 100, 100, 3);
            $("#member_info_img").attr("src", result1.paper_img);

        } else if(result1.paper_img.indexOf('http') == 0 && result1.paper_img != "") {
            $("#member_info_img").attr("src", result1.paper_img);
        }
    } else if(result1.apply_type == 2) {
        $(".member_off_institutional").show();
        $(`#`+result1.plat_member_level_id+``).addClass("member_active1");
        $("#member_price").text($("#"+ result1.plat_member_level_id +"").attr("price"));
        $("#display_name").text($("#"+ result1.plat_member_level_id +"").attr("title"));
        $("#member_price")         .text(result1.plat_member_price);
        $("#member_second_company").val(result1.plat_member_organization);
        $("#member_second_name")   .val(result1.name);
        $("#member_second_tel")    .val(result1.phone);
        $("#member_second_address").val(result1.plat_member_address);

        if(!result1.paper_img) {
            console.info("申请资料：" + result1.paper_img);

        } else if (result1.paper_img.indexOf('http') != 0 && result1.paper_img != "") {

            result1.paper_img = imgSet(result1.paper_img, 100, 100, 3);
            $("#member_second_img").attr("src", result1.paper_img);

        } else if(result1.paper_img.indexOf('http') == 0 && result1.paper_img != "") {
            $("#member_second_img").attr("src", result1.paper_img);
        }
    }
}

if(token != null || token != undefined) {
    // 会员
    var member_options = $.get(MEMBER_PROFILE);
    member_options.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            if(!result) {
                return false;
            } else {
                window.location.href = '/applicationsuccess';
            }
        }
    });
    member_options.fail(function(error) {
        console.error(error);
    });

    var options1 = $.get(MEMBER_LEVELS);
    options1.done(function(data) {
        if(data.code == 200) {
            var result = data.data, item_weid;
            if(!result) {
                return false;
            }
            console.info("会员种类列表:", result);
            $.map(result.list, function(item, index) {
                item_weid = item.weid;
                $(".member_sel_type_name").append(`<li id="`+ item.weid +`" type="`+ item.member_type +`" price="`+ item.member_price +`" title="`+ item.name +`"> + `+ item.display_name +` </li>`);
            });
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });

    var pay_weid, options0 = $.get(MEMBER_APPLY);
    options0.done(function(body) {
        if(body.code == 200) {
            result1 = body.data;
            if (!result1) {
                window.location.href = '/apply';
                return false;
            }

            pay_weid = result1.weid;
            if(result1.state == 1) {
                if(result1.first_audit_is_done == 1) {
                    apply_state1(result1);
                } else if(result1.first_audit_is_done == 2) {
                    window.location.href = '/apply';
                }            
            } else if(result1.state == 2) {
                $(".member_application .member_app_list").show();
                $(".member_application").children("div:not(.member_app_list, #member_time_axis)").hide();
            } else if(result1.state == 3) {
                if(result1.sec_audit == 2 && result1.sec_audit_operation == 1) {
                    window.location.href = '/firsttrial';
                } else if(result1.sec_audit == 2 && result1.sec_audit_operation == 3) {
                    window.location.href = '/apply';
                }
            } else if(result1.state == 4) {
                window.location.href = '/applicationsuccess';
            }
        }
    });
    options0.fail(function(error) {
        console.error(error);
    });

    $(".member_go_pay").click(function() {
        console.log("开始交费！", pay_weid);
        var options22 = $.get(MEMBER_WECHATPAY_APPLY_PAY + pay_weid);
        options22.done(function(data) {
            if(data.code == 200) {
                console.info(data.data);
                var qr_url = data.data.qr_url, order_id = data.data.order_id, sub_body = { order: order_id };
                var options23 = $.get(CMS_DETAIL_QRCODE + qr_url);
                options23.done(function(body) {
                    $(".qr_code_pc_outer").html(`<h2>微信支付</h2><span class="pay_close"> x </span><img src="` + CMS_DETAIL_QRCODE + data.data.qr_url + `" />`).show();
                });
                options23.fail(function(error) {
                    console.error(error);
                });
                var timer = setInterval(function() {
                    var options24 = $.post(MEMBER_APPLY_ORDER_DETECT, sub_body);
                    options24.done(function(body) {
                        if(body.code == 200) {
                            if(body.data.state == 1) {
                                console.log(body.data);
                                $(".qr_code_pc_outer").html("").hide();
                                clearInterval(timer);
                                layer.msg("付款成功！", { time: 2500 });
                                setTimeout(function() {
                                    window.location.reload();
                                }, 500);
                                return false;
                            }
                        }
                    });
                    options24.fail(function(error) {
                        console.error(error);
                    });
                }, 1000);

                $(".pay_close").click(function() {
                    clearInterval(timer);
                    $(".qr_code_pc_outer").html("").hide();
                    console.info("关闭付费！");
                });
            }
        });
        options22.fail(function(error) {
            console.error(error);
        });
    });
} else {
    window.location.href = "/apply";
}
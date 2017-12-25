function token_data() {
    var token = docCookies.getItem("token");
    if(token) {
        $.ajaxSetup({
            global: true,
            async: false,
            headers: {
                'Token': token,
            }
        });
    }
}

// 身份证号码验证信息
function isCardNo(card) {
    var objCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return objCard.test(card);
}

// 认证逻辑判断显示信息
const success_media = function(number) {
    var array = [
        {
            object: "/common/img/carry.png", 
            heading: "人工认证中...", color: "rgb(255, 204, 0)", bg_color: "#dff0d8",
            content: "通过实名认证的用户能更快速申请成为正式会员，正式会员才能根据平台设置享有更多特权！"
        },
        {
            object: "/common/img/refuse.png", 
            heading: "人工认证已被拒绝，重新提交", color: "rgb(236, 45, 45)", bg_color: "#ffe6e6",
            content: "通过实名认证的用户能更快速申请成为正式会员，正式会员才能根据平台设置享有更多特权！"
        },
        {
            object: "/common/img/refuse.png", 
            heading: "在线认证失败，重新提交", color: "rgb(236, 45, 45)", bg_color: "#ffe6e6",
            content: "通过实名认证的用户能更快速申请成为正式会员，正式会员才能根据平台设置享有更多特权！"
        },
        {
            object: "/common/img/carry.png", 
            heading: "个人认证中...", color: "rgb(255, 204, 0)", bg_color: "#dff0d8",
            content: "通过官方认证的用户能更快速申请会员及开通微主页，开通微主页后根据平台设置享有发布文章，众筹项目，活动，商品等特权！"
        },
        {
            object: "/common/img/refuse.png", 
            heading: "个人认证已被拒绝，重新提交", color: "rgb(236, 45, 45)", bg_color: "#ffe6e6",
            content: "通过官方认证的用户能更快速申请会员及开通微主页，开通微主页后根据平台设置享有发布文章，众筹项目，活动，商品等特权！"
        },
        {
            object: "/common/img/carry.png", 
            heading: "机构认证中...", color: "rgb(255, 204, 0)", bg_color: "#dff0d8",
            content: "通过官方认证的用户能更快速申请会员及开通微主页，开通微主页后根据平台设置享有发布文章，众筹项目，活动，商品等特权！"
        },
        {
            object: "/common/img/refuse.png", 
            heading: "机构认证已被拒绝，重新提交", color: "rgb(236, 45, 45)", bg_color: "#ffe6e6",
            content: "通过官方认证的用户能更快速申请会员及开通微主页，开通微主页后根据平台设置享有发布文章，众筹项目，活动，商品等特权！"
        },
        {
            object: "", heading: "", color: "", bg_color: "", content: ""
        }
    ]
    $(".member_success_media").show().css("background-color", array[number].bg_color);
    $(".member_media_object") .attr("src", array[number].object);
    $(".member_media_heading").text(array[number].heading).css("color", array[number].color);
    $(".member_media_content").text(array[number].content);
}

$(".member_official_button").click(function() {
    var btn_id = $(this).attr("id");
    if(btn_id == "member_personal_button") {
        submit_btn(4);
    } if(btn_id == "member_institutional_button") {
        submit_btn(6);
    }
    var index = $(this).index();
    $(this).addClass("bottom_selected").siblings().removeClass("bottom_selected");
    $(".member_official_module").eq(index - 1).addClass("display_block").siblings().removeClass("display_block");
})

const submit_btn = function(number) {
    var array = [
        { content: '<button class="member_auth_submit">          提交申请 </button>' },
        { content: '<button class="member_auth_modify">          修改申请 </button>' },
        { content: '<button class="member_auth_online">          在线认证 </button>' },
        { content: '<button class="member_verified_submit">      申    请 </button>' },
        { content: '<button class="member_personal_submit">      提交申请 </button>' },
        { content: '<button class="member_personal_modify">      修改申请 </button>' },
        { content: '<button class="member_institutional_submit"> 提交申请 </button>' },
        { content: '<button class="member_institutional_modify"> 修改申请 </button>' },
        { content: '<button class="member_modal_box">            取    消 </button>' },
    ]
    if(number == 0 || number == 1) {
        $(".member_certification_footer").html(array[number].content + array[2].content);
    } else {
        $(".member_certification_footer").html(array[number].content);        
    }

    submit_modify_btn();
}

function submit_modify_btn() {

    $(".member_certification_close, .member_modal_box").click(function() {
        // auth_certification();
        $(".member_certification_mask").hide();
    });

    // 人工认证信息提交
    $(".member_auth_submit").click(function(){
        var body = {};
        body.name       = $("#id_auth_name")   .val();
        body.card_id    = $("#id_auth_card")   .val();
        body.card_front = $("#member_upload_3").val();
        body.card_back  = $("#member_upload_4").val();

        if(    !body.name
            || !body.card_id
            || !body.card_front
            || !body.card_back) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            return false;
        }

        var options1 = $.post(CERT_REALNAME, body);
        options1.done(function(data) {

            if(data.code == -200) {
                return false;
            }
            if(data.code == 200) {
                $(".member_auth").hide();
                success_media(0);
                submit_btn(8);
            }
        })
        options1.fail(function(error) {
            console.error(error);
        });

        return false;
    })

    // 人工认证信息修改
    $(".member_auth_modify").click(function(){
        var body = {};
        body.weid       = weid;
        body.name       = $("#id_auth_name").val();
        body.card_id    = $("#id_auth_card").val();
        body.card_front = $("#member_upload_3").val();
        body.card_back  = $("#member_upload_4").val();

        if(    !body.name
            || !body.card_id
            || !body.card_front
            || !body.card_back) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            return false;
        }

        var options2 = $.post(CERT_REALNAME_UPDATE, body);
        options2.done(function(data) {

            if(data.code == -200) {
                return false;
            }
            if(data.code === 200) {
                $(".member_auth").hide();
                success_media(0);
                submit_btn(8);
            }
        })
        options2.fail(function(error) {
            console.error(error);
        });

        return false;
    })

    // 在线认证开通状态判断
    $(".member_auth_online").click(function() {
        var options3 = $.get(CERT_REALNAME_SETTING);
        options3.done(function(data) {
            if(data.code === 200) {
                var result = data.data;

                if(!result) {
                    layer.msg("尚未开通此功能", { time: 2500 });
                    return false;
                }
                if(result.status == 1 && result.auth_num > 0) {
                    layer.msg("页面加载中...", { time: 2500 });
                    setTimeout(function() {
                        // window.location.href = "verified";
                        $(".member_verified").show().siblings(".member_auth").hide();
                        submit_btn(3);
                    }, 1000);
                } else {
                    layer.msg("此功能暂时无法使用", { time: 2500 });
                    return false;
                }
            }
        });
        options3.fail(function(error) {
            console.error(error);
        });
    });

    // 实名认证 > 在线认证信息提交
    $(".member_verified_submit").click(function(){
        var body = {};
        body.name    = $("#member_verify_name").val();
        body.card_id = $("#member_verify_card").val();

        if(!body.name || !body.card_id) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入", { time: 2500 });
            return false;
        }

        var options = $.post(CERT_ONLINEREALNAME, body);
        options.done(function(data) {

            if(data.code == -200) {
                return false;
            }
            if(data.code === 200) {
                if(data.data.code != 0) {
                    success_media(2);
                    $(".member_media_heading").append("<span class='back_auth'>返回个人认证</span>")
                    $(".back_auth").bind("click", back_auth);
                    
                    return false;
                }
                $(".member_official").show().siblings().hide();

                submit_btn(4);
                var options1 = $.get(CERT_REALNAME_DETAIL);
                options1.done(function(data) {
                    if(data.code == 200) {
                        var result = data.data;
                        $("#id_per_name").val(result.name);
                        $("#id_per_card").val(result.card_id);
                    }
                });
                options1.fail(function(error) {
                    console.error(error);
                });
            }
        })
        options.fail(function(error) {
            console.error(error);
        });
        
        return false;
    })

    // 个人认证信息填写提交
    $(".member_personal_submit").click(function(){
        var body = {};
        body.type           = 1;
        body.name           = $("#id_per_name").val();
        body.card_id        = $("#id_per_card").val();
        body.cert_info      = $("#per_info").val();
        body.per_cert_imgs  = $("#member_upload_5").val();

        if( !body.name
            || !body.card_id
            || !body.cert_info
            || !body.per_cert_imgs){
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            return false;
        }

        var options = $.post(CERT_OFCCERTS, body);
        options.done(function(data) {
            if(data.code == -200) {
                return false;
            }
            if(data.code === 200) {
                $(".member_official").hide();
                success_media(3);
                submit_btn(8);
                return false;
            }
        })
        options.fail(function(error) {
            console.error(error);
        });

        return false;
    })

    // 个人认证信息填写修改
    $(".member_personal_modify").click(function(){
        var body = {};
        var certUrl = CERT_OFCCERTS;
        body._method       = "put",
        body.name          = $("#id_per_name").val();
        body.card_id       = $("#id_per_card").val();
        body.cert_info     = $("#per_info").val();
        body.per_cert_imgs = $("#member_upload_5").val();

        if( !body.name
            || !body.card_id
            || !body.cert_info
            || !body.per_cert_imgs) {
            layer.msg("请完善信息后重新提交", { time: 2500 });
            return false;
        }

        if(!isCardNo(body.card_id)) {
            layer.msg("身份证号码不合法，请重新输入...", { time: 2500 });
            return false;
        }

        $.ajax({
            url: certUrl,
            type: "post",
            dataType: "json",
            data: body,
            timeout: 20000,
            success: function(msg) {
                $(".member_official").hide();
                success_media(3);
                submit_btn(8);
                return false;
            },
            error: function(xhr,textstatus,thrown) {
                console.error(xhr, textstatus, thrown);
            }
        });

        return false;
    })

    // 提交机构认证填写信息
    $(".member_institutional_submit").click(function(){
        var body = {};
        body.type               = 2;
        body.org_name           = $("#org_name").val();
        body.org_license_image  = $("#member_upload_6").val();
        body.org_cert_number    = $("#org_cert_number").val();
        body.org_scope_common   = $("#org_scope_common").val();
        body.org_scope_front    = $("#org_scope_front").val();
        body.org_type           = $("#org_type").val();
        body.org_setup_date     = $("#org_setup_date").val();
        body.org_auth_imgs      = $("#member_upload_7").val();
        body.org_contact_people = $("#org_contact_people").val();
        body.org_contact_phone  = $("#org_contact_phone").val();
        body.org_address        = $("#org_address").val();
        body.cert_info          = $("#cert_info").val();
        body.org_cert_imgs      = $("#member_upload_8").val();

        if(    !body.org_name
            || !body.org_license_image
            || !body.org_cert_number
            || !body.org_scope_common
            || !body.org_scope_front
            || !body.org_type
            || !body.org_setup_date
            || !body.org_auth_imgs
            || !body.org_contact_people
            || !body.org_contact_phone
            || !body.org_address
            || !body.cert_info
            || !body.org_cert_imgs) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!objExp.test(body.org_contact_phone)) {
            layer.msg("请输入正确的手机号码后重新提交！", { time: 2500 });
            return false;
        }

        var options = $.post(CERT_OFCCERTS, body);
        options.done(function(data) {
            if(data.code == -200) {
                return false;
            }
            if(data.code === 200) {
                console.info("提交成功 ", data);
                $(".member_official").hide();
                success_media(5);
                submit_btn(8);
            }
        })
        options.fail(function(error) {
            console.error(error);
        });

        return false;
    })

    // 修改机构认证填写信息
    $(".member_institutional_modify").click(function(){
        var body = {};
        body._method            = "put",
        body.org_name           = $("#org_name").val();
        body.org_license_image  = $("#member_upload_6").val();
        body.org_cert_number    = $("#org_cert_number").val();
        body.org_scope_common   = $("#org_scope_common").val();
        body.org_scope_front    = $("#org_scope_front").val();
        body.org_type           = $("#org_type").val();
        body.org_setup_date     = $("#org_setup_date").val();
        body.org_auth_imgs      = $("#member_upload_7").val();
        body.org_contact_people = $("#org_contact_people").val();
        body.org_contact_phone  = $("#org_contact_phone").val();
        body.org_address        = $("#org_address").val();
        body.cert_info          = $("#cert_info").val();
        body.org_cert_imgs      = $("#member_upload_8").val();

        if(    !body.org_name
            || !body.org_license_image
            || !body.org_cert_number
            || !body.org_scope_common
            || !body.org_scope_front
            || !body.org_type
            || !body.org_setup_date
            || !body.org_auth_imgs
            || !body.org_contact_people
            || !body.org_contact_phone
            || !body.org_address
            || !body.cert_info
            || !body.org_cert_imgs) {
            layer.msg("请完善信息后重新提交！", { time: 2500 });
            return false;
        }

        if(!objExp.test(body.org_contact_phone)) {
            layer.msg("请输入正确的手机号码后重新提交！", { time: 2500 });
            return false;
        }

        var options3 = $.post(CERT_OFCCERTS, body);
        options3.done(function(data) {
            if(data.code == -200) {
                return false;
            }
            if(data.code === 200) {
                console.info("修改成功 ", data);
                $(".member_official").hide();
                success_media(5);
                submit_btn(8);
            }
        })
        options3.fail(function(error) {
            console.error(error);
        });

        return false;
    })
}

function member_sel_type_name(item, index, total) {
    var template;
    if(index == total - 1) {
        item_weid = item.weid;
        template = `<li class="member_active1" id="`+ item.weid +`" type="`+ item.member_type +`" price="`+ item.member_price +`" title="`+ item.name +`"> + `+ item.display_name +` </li>`;
    } else {
        template = `<li id="`+ item.weid +`" type="`+ item.member_type +`" price="`+ item.member_price +`" title="`+ item.name +`"> + `+ item.display_name +` </li>`;
    }
    return template;
}

// 会员类型选择、默认显示
function member_apply() {
    var options1 = $.get(MEMBER_LEVELS);
    options1.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            if(!result) {
                return false;
            }
            console.info("会员种类列表:", result);
            $.map(result.list, function(item, index) {
                $(".member_sel_type_name").prepend(member_sel_type_name(item, index, result.total));
            });

            $("#member_price").text($("#"+ item_weid +"").attr("price"));
            $("#display_name").text($("#"+ item_weid +"").attr("title"));
            $(".member_sel_type_name li").click(function() {
                item_weid = $(this).attr("id");
                if($(this).attr("type") == 2) {
                    return false;
                }
                $(this).addClass("member_active1").siblings().removeClass("member_active1");
                $("#member_price").text($(this).attr("price"));
                $("#display_name").text($(this).attr("title"));
            });
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });
}

if(!token) {
    member_apply();
} else {
    member_apply();
}

function back_auth() {
    $(".back_auth").remove();
    $(".member_auth").show().siblings(".member_verified").hide();
    submit_btn(1);
}

function auth_certification() {
    // 实名认证详情功能显示(是否开通实名认证)

    $.ajax({
        url: CERT_REALNAME_DETAIL,
        type: 'get',
        async: false,
        headers: {
            'Token': docCookies.getItem("token")
        },
        success: function(data) {
            if(data.code == 200) {
                var result = data.data;
                if(!result) {
                    $(".member_certification_title").text("实名认证");
                    $(".member_certification_mask").show();
                    $(".member_auth").show().siblings(".member_verified").hide();
                    submit_btn(0);
                    return false;
                }
                if(result.type == 1) {
                    $(".member_certification_title").text("实名认证");

                    if(result.operation_status == 3) {
                        $(".member_auth").hide().siblings(".member_verified").show();
                        $(".member_certification_mask").show();
                        success_media(2);
                        submit_btn(3);
                        // $(".member_media_heading").append("<span class='back_auth'>返回个人认证</span>")
                        // $(".back_auth").bind("click", back_auth);
                    }
                }
                if(result.type == 2 && result.is_authenticated == 2) {
                    $(".member_certification_title").text("实名认证");

                    if(result.operation_status == 3) {
                        weid = result.weid;
                        $(".member_certification_mask").show();
                        success_media(1);
                        submit_btn(1);
                        $(".member_auth").show();
                        $(".member_auth_submit").hide().siblings(".member_auth_modify").show();

                        $("#id_auth_name")   .val(result.name);
                        $("#id_auth_card")   .val(result.card_id);
                        $("#member_upload_3").val(result.card_front);
                        $("#member_upload_4").val(result.card_back);

                        if(!result.card_front) {
                            console.info("身份证正面图片：" + result.card_front);

                        } else if (result.card_front.indexOf('http') != 0 && result.card_front != "") {
                            // result.card_front = ApiMaterPlatQiniuDomain + result.card_front;
                            result.card_front = imgSet(result.card_front, 120, 80, 3);
                            $("#member_pic_3").attr("src", result.card_front);

                        } else if(result.card_front.indexOf('http') == 0 && result.card_front != "") {
                            $("#member_pic_3").attr("src", result.card_front);
                        }

                        if(!result.card_back) {
                            console.info("身份证正面图片：" + result.card_back);

                        } else if (result.card_back.indexOf('http') != 0 && result.card_back != "") {
                            // result.card_back = ApiMaterPlatQiniuDomain + result.card_back;
                            result.card_back = imgSet(result.card_back, 120, 80, 3);
                            $("#member_pic_4").attr("src", result.card_back);

                        } else if(result.card_back.indexOf('http') == 0 && result.card_back != "") {
                            $("#member_pic_4").attr("src", result.card_back);
                        }
                    } else if(result.operation_status == 1){

                        $(".member_certification_mask").show();
                        success_media(0);
                        submit_btn(8);
                        $(".member_media_heading").addClass("member_orange");
                    }
                } else if(result.is_authenticated == 1 && result.operation_status == 2) {
                    // 官方认证详情功能显示(是否开通官方认证)
                    $.ajax({
                        url: CERT_OFCCERTS,
                        type: 'get',
                        async: false,
                        headers: {
                            'Token': docCookies.getItem("token")
                        },
                        success: function(body) {
                            if(body.code == 200) {
                                var results = body.data;
                                $("#id_per_name")    .val(result.name);
                                $("#id_per_card")    .val(result.card_id);

                                if(!results) {
                                    $(".member_certification_mask").show();
                                    $(".member_official").show();
                                    success_media(7);
                                    $(".member_success_media").hide();
                                    submit_btn(4);
                                    return false;
                                }
                                if(results.type == 1) {
                                    $(".member_official_button").attr("disabled", true);
                                    $(".member_institutional_button").click(function() {
                                        layer.msg("您已经有个人认证记录，请勿重复认证！", { time: 2500 });
                                        return false;
                                    });
                                    if(results.is_done == 1){
                                        $(".member_certification_mask").show();
                                        success_media(3);
                                        submit_btn(8);

                                    } else if(results.is_done == 2) {
                                        if(results.is_authenticated == 1 && results.operation_status == 2) {
                                            $("#member_per_applicant").val(result.name);
                                            return;
                                        } else if(results.is_authenticated == 2){
                                            if(results.operation_status == 3) {
                                                $(".member_certification_mask").show();
                                                success_media(4);
                                                submit_btn(5);
                                                $(".member_official").show();
                                                $(".member_personal").show();
                                                $(".member_personal_submit").hide().siblings().show();

                                                $("#per_info")       .val(results.cert_info);
                                                $("#member_upload_5").val(results.per_cert_imgs);

                                                if(!results.per_cert_imgs) {
                                                    console.info("身份证正面图片：" + results.per_cert_imgs);

                                                } else if (results.per_cert_imgs.indexOf('http') != 0 && results.per_cert_imgs != "") {
                                                    // results.per_cert_imgs = ApiMaterPlatQiniuDomain + results.per_cert_imgs;
                                                    results.per_cert_imgs = imgSet(results.per_cert_imgs, 100, 100, 3);
                                                    $("#member_pic_5").attr("src", results.per_cert_imgs);

                                                } else if(results.per_cert_imgs.indexOf('http') == 0 && results.per_cert_imgs != "") {
                                                    $("#member_pic_5").attr("src", results.per_cert_imgs);
                                                }
                                            } else if(results.operation_status == 1){

                                                $(".member_certification_mask").show();
                                                success_media(3);
                                                submit_btn(8);
                                            }
                                        }
                                    }
                                } else if(results.type == 2) {
                                    $(".member_official_button").attr("disabled", true);
                                    $(".member_personal_button").click(function() {
                                        layer.msg("您已经有个人认证记录，请勿重复认证！", { time: 2500 });
                                        return false;
                                    });
                                    if(results.is_done == 1){
                                        $(".member_certification_mask").show();
                                        success_media(5);
                                        submit_btn(8);
                                        $(".member_media_heading").addClass("member_orange");

                                    } else if(results.is_done == 2) {
                                        if(results.is_authenticated == 1 && results.operation_status == 2) {
                                            $("#member_per_applicant").val(result.name);
                                            $("#member_per_tel")      .val(results.org_contact_phone);
                                            $("#member_per_address")  .val(results.org_address);
                                            $("#member_int_name")     .val(results.org_name);
                                            $("#member_int_applicant").val(results.org_contact_people);
                                            $("#member_int_tel")      .val(results.org_contact_phone);
                                            $("#member_int_address")  .val(results.org_address);

                                            return;
                                        } else if(results.is_authenticated == 2){
                                            if(results.operation_status == 3) {
                                                $(".member_certification_mask").show();
                                                success_media(6);
                                                submit_btn(7);
                                                $(".member_official").show();
                                                $(".member_personal").removeClass("display_block").hide();
                                                $(".member_personal_button").removeClass("bottom_selected").siblings(".member_institutional_button").addClass("bottom_selected");
                                                $(".member_institutional").show().addClass("bottom_selected");
                                                $(".member_institutional_submit").hide().siblings().show();

                                                $("#org_name")          .val(results.org_name);
                                                $("#member_upload_6")   .val(results.org_license_image);
                                                $("#org_cert_number")   .val(results.org_cert_number);
                                                $("#org_scope_common")  .val(results.org_scope_common);
                                                $("#org_scope_front")   .val(results.org_scope_front);
                                                $("#org_type")          .val(results.org_type);
                                                $("#org_setup_date")    .val(results.org_setup_date);
                                                $("#member_upload_7")   .val(results.org_auth_imgs);
                                                $("#org_contact_people").val(results.org_contact_people);
                                                $("#org_contact_phone") .val(results.org_contact_phone);
                                                $("#org_address")       .val(results.org_address);
                                                $("#cert_info")         .val(results.cert_info);
                                                $("#member_upload_8")   .val(results.org_cert_imgs);

                                                if(!results.org_license_image) {
                                                    console.info("营业执照图片：" + results.org_license_image);
                                                } else if (results.org_license_image.indexOf('http') != 0 && results.org_license_image != "") {
                                                    // results.org_license_image = ApiMaterPlatQiniuDomain + results.org_license_image;
                                                    results.org_license_image = imgSet(results.org_license_image, 100, 100, 3);
                                                    $("#member_pic_6").attr("src", results.org_license_image);
                                                } else if(results.org_license_image.indexOf('http') == 0 && results.org_license_image != "") {
                                                    $("#member_pic_6").attr("src", results.org_license_image);
                                                }

                                                if(!results.org_auth_imgs) {
                                                    console.info("授权资料图片：" + results.org_auth_imgs);
                                                } else if (results.org_auth_imgs.indexOf('http') != 0 && results.org_auth_imgs != "") {
                                                    // results.org_auth_imgs = ApiMaterPlatQiniuDomain + results.org_auth_imgs;
                                                    results.org_auth_imgs = imgSet(results.org_auth_imgs, 100, 100, 3);
                                                    $("#member_pic_7").attr("src", results.org_auth_imgs);
                                                } else if(results.org_auth_imgs.indexOf('http') == 0 && results.org_auth_imgs != "") {
                                                    $("#member_pic_7").attr("src", results.org_auth_imgs);
                                                }

                                                if(!results.org_cert_imgs) {
                                                    console.info("证明资料图片：" + results.org_cert_imgs);
                                                } else if (results.org_cert_imgs.indexOf('http') != 0 && results.org_cert_imgs != "") {
                                                    // results.org_cert_imgs = ApiMaterPlatQiniuDomain + results.org_cert_imgs;
                                                    results.org_cert_imgs = imgSet(results.org_cert_imgs, 100, 100, 3);
                                                    $("#member_pic_8").attr("src", results.org_cert_imgs);
                                                } else if(results.org_cert_imgs.indexOf('http') == 0 && results.org_cert_imgs != "") {
                                                    $("#member_pic_8").attr("src", results.org_cert_imgs);
                                                }

                                            } else if(results.operation_status == 1){

                                                $(".member_certification_mask").show();
                                                success_media(5);
                                                submit_btn(8);
                                            }
                                        }
                                    }
                                } else {
                                    $(".member_personal_button").attr("disabled", false);
                                    $(".member_institutional_button").attr("disabled", false);
                                }
                            } else {
                                return false;
                            }
                        },
                        error: function(error) {
                            console.error(error);
                        }
                    })
                }
            } else {
                return false;
            }
        },
        error: function(error) {
            console.error(error);
        }
    });
}

function pro_login_member() {
    var template = `
    <input type="text" name="" class="member_app_input" id="member_per_tel_card" size="6" maxlength="6" wrap="hard" cols="100" placeholder="请输入手机验证码">
    <button class="member_app_input member_onlink_card"> 在线验证 </button>
    <button class="member_app_input member_get_card"> 获取验证码 </button>`
    return template;
}

// 保存本地缓存token、weid、用户头像
function saveUserInfo(token, weid, imgUrl) {
    localStorage.setItem('token', token);
    localStorage.setItem('weid', weid);
    if(!imgUrl) {

        imgUrl = "/common/img/my.png";
        $("#login a").css({"background": "url("+ imgUrl +") center center / 100% 100% no-repeat"});
        $("#login a").addClass("i-header").html("");

    } else if (imgUrl.indexOf('http') != 0 && imgUrl != "") {
        imgUrl = imgSet(imgUrl, 50, 50, 3);
        $("#login a").css({"background": "url(" + imgUrl + ") center center / 100% 100% no-repeat"});
        $("#login a").addClass("i-header").html("");
        showLogin = false;
        isLogin = true;

    } else if(imgUrl.indexOf('http') == 0 && imgUrl != "") {

        $("#login a").css({"background": "url(" + imgUrl + ") center center / 100% 100% no-repeat"});
    }
    window.localStorage.setItem("avatar", imgUrl);
}

//用户登录接口调用
function login(phoneNum, checkNum){
    $.ajax({
        url: LOGIN,
        type: 'post',
        headers: {
            'Token': docCookies.getItem("token")
        },
        data: {'phone': phoneNum, 'code': checkNum},
        success: function(data){
            if (data.code != -200) {
                saveUserInfo(data.token, data.data.weid, data.data.avatar);
                showLogin = false;
                isLogin = true;
                isCheckNum = false;
                $(".member_link_login").slideUp(60);
                token_data();
                auth_certification();
                member_levels();
            } else {
                lock = false;
                clearInterval(count);
                layer.msg(data.message, { time: 2500 });
                $(".member_get_card").text("重新获取验证码");
            }
        },
        error: function(err){
            console.info(err);
        }
    })
}

//点击登录按钮
function logBt(){
    phoneNum = ($("#member_per_tel").val() || $("#member_int_tel").val());
    checkNum = $("#member_per_tel_card").val();

    if (objExp.test(phoneNum) && phoneNum.length == 11 && checkNum.length == 6) {
        login(phoneNum, checkNum);
    } else {
        if (!(phoneNum.length == 11 || !objExp.test(phoneNum))){
            layer.msg("手机号码错误", { time: 2500 });
            return;
        }
        if (!(checkNum.length == 6) || !isCheckNum) {
            layer.msg("手机验证码错误", { time: 2500 });
            return;
        }
    }
}

//获取验证码
var lock = false,
    isCheckNum = false, /*默认false*/
    count = false, /*验证码倒计时*/
    phoneNum = 0,
    checkNum = 0;
var getCheck = function(phoneNum){
    var timeout = false;
    var seconds = 60;

    lock = true;
    count = setInterval(function(){
        if (seconds > 0){
            seconds -= 1;
            $(".member_get_card").text("剩余"+ seconds + "秒");
        } else {
            $(".member_get_card").text("重新获取验证码");
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
        data: { 'phone': phoneNum},
        success: function(data){
            isCheckNum = true;
        },
        error: function(err){
            console.info(err);
        }
    })
}

function member_get_card(){
    if (!lock) {
        phoneNum = ($("#member_per_tel").val() || $("#member_int_tel").val());
        var regexp = /^(13|14|17|15|18)/;
        var reg =  new RegExp(regexp);
        if (reg.test(phoneNum) && phoneNum.length == 11){
            getCheck(phoneNum);
        } else {
            layer.msg("手机号码错误", { time: 2500 });
            return false;
        }
    }
}

$(".member_type_tab").click(function() {
    var index = $(this).index();
    $(this).addClass("member_type_tab_selected").siblings().removeClass("member_type_tab_selected");
    $(this).children("img").removeClass("already").parent().siblings().find("img").addClass("already")
    $(".member_type_tab_content").eq(index - 1).addClass("display_block").siblings().removeClass("display_block");
    $(".member_link_login").html("").slideUp(60);
});

// 触发电话号码input框，实名认证、官方认证判断，自动补全信息
$("#member_per_tel").focus(function() {
    if(!docCookies.getItem("token")) {
        if($("#personal_apply.member_type_tab_selected").length == 1) {
            $("#personal_apply_content .member_link_login").html(pro_login_member()).slideDown(60);
        } else {
            $(".member_link_login").html("").slideUp(60);
        }
        $(".member_get_card").bind("click", member_get_card);
        $(".member_onlink_card").bind("click", logBt);
        return false;
    }
    auth_certification();
});

$("#member_int_tel").focus(function() {
    if(!docCookies.getItem("token")) {

        if($("#institution_apply.member_type_tab_selected").length == 1) {
            $("#institution_apply_content .member_link_login").html(pro_login_member()).slideDown(60);
        } else {
            $(".member_link_login").html("").slideUp(60);
        }
        $(".member_get_card").bind("click", member_get_card);
        $(".member_onlink_card").bind("click", logBt);
        return false;
    }
    auth_certification();
});

$("input:not(#member_per_tel, #member_int_tel, #member_per_tel_card, .member_get_card, .member_onlink_card)").click(function() {
    $(".member_link_login").html("").slideUp(60);
});
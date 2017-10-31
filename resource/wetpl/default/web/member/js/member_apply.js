
// 会员申请级证书颁发机制

var item_weid;

function member_levels() {
    var options0 = $.get(MEMBER_APPLY);
    options0.done(function(data) {
        if(data.code == 200) {
            result1 = data.data;

            if (!result1) {
                return false;
            }
            if(result1.state == 1) {
                if(result1.first_audit_is_done == 1) {
                    window.location.href = '/application';
                } else if(result1.first_audit_is_done == 2) {
                    $("#member_individual_application_modify").show().siblings().hide();
                    $("#member_agency_application_modify").show().siblings().hide();
                }
            } else if(result1.state == 2) {
                window.location.href = '/application';
                $(".member_application .member_app_list").show();
                $(".member_application").children("div:not(.member_app_list)").hide();
            } else if(result1.state == 3) {
                if(result1.sec_audit == 1) {
                    window.location.href = '/applicationsuccess';
                } else if(result1.sec_audit == 2 && result1.sec_audit_operation == 1) {
                    window.location.href = '/firsttrial';
                    console.info("复审中");
                } else if(result1.sec_audit == 2 && result1.sec_audit_operation == 3) {
                    window.location.href = '/firsttrial';
                    console.info("复审被拒绝");
                }
            } else if(result1.state == 4) {
                window.location.href = '/applicationsuccess';
            }
        }
    });
}

// 文件下载
var options12 = $.get(MEMBER_SETTING);
options12.done(function(data) {
    if(data.code == 200) {
        var result = data.data, apply_wait_days = data.data.apply_wait_days;
        console.log("文档下载：", result);
        if(result.apply_template.indexOf('http')     != 0 && result.apply_template != '' ) {
            result.apply_template      = ApiMaterPlatQiniuDomain + result.apply_template;
        }

        if(result.constitution.indexOf('http')       != 0 && result.apply_template != '') {
            result.constitution        = ApiMaterPlatQiniuDomain + result.constitution;
        }

        if(result.term_servcice_rule.indexOf('http') != 0 && result.apply_template != '') {
            result.term_servcice_rule  = ApiMaterPlatQiniuDomain + result.term_servcice_rule;
        }

        $(".apply_template")    .attr({"download": result.apply_template, "href": result.apply_template});
        // $(".constitution")      .attr({"download": result.constitution, "href": result.constitution});
        // $(".term_servcice_rule").attr({"download": result.term_servcice_rule, "href": result.term_servcice_rule});

        if(!result.apply_template) {
            $(".apply_template").removeAttr("download a");
        }

        if(!result.constitution) {
            $(".constitution").removeAttr("download a");
        }

        if(!result.term_servcice_rule) {
            $(".term_servcice_rule").removeAttr("download a");
        }

        if(!apply_wait_days) {
            window.localStorage.setItem("apply_wait_days", 1);
        } else {
            window.localStorage.setItem("apply_wait_days", apply_wait_days);
        }

        if(result.member_open_type == 2) {
            $("#institution_apply").hide().siblings("#personal_apply").show();
            $("#institution_apply_content").remove();
        } else if(result.member_open_type == 3) {
            $("#personal_apply").hide().siblings("#institution_apply").addClass("member_type_tab_selected").show().children("img").removeClass("already");
            $("#institution_apply_content").show().siblings("#personal_apply_content").hide();
            $("#personal_apply_content").remove();
        } else if(result.member_open_type == 1) {
            $("#personal_apply, #institution_apply").show();
        }
    }
});
options12.fail(function(error) {
    console.error(error);
});

if(token != null || token != undefined) {

    // 是否为会员
    // var member_options = $.get(MEMBER_PROFILE);
    // member_options.done(function(data) {
    //     if(data.code == 200) {
    //         var result = data.data;
    //         if(!result) {
    //             // 非会员
    //             return false;
    //         } else {
    //             window.location.href = '/applicationsuccess';
    //         }
    //     }
    // });
    // member_options.fail(function(error) {
    //     console.error(error);
    // });

    // 会员申请判断

    member_levels();
}

$("#member_individual_application_submit").click(function() {
    var body = {}, is_agree_terms1;
    if($("#is_agree_terms1").is(':checked')) {
        is_agree_terms1 = 1;
    } else {
        is_agree_terms1 = 2;
        layer.msg("请先阅读规范、章程条款", { time: 2500 });
        return false;
    }
    body.apply_type              = 1;
    body.plat_member_level_id    = item_weid;
    body.plat_member_contacts    = $("#member_per_applicant").val();
    body.plat_member_tel         = $("#member_per_tel").val();
    body.plat_member_address     = $("#member_per_address").val();
    body.plat_member_application = $("#member_upload_1").val();
    body.is_agree_terms          = is_agree_terms1;

    if( !body.apply_type
        || !body.plat_member_level_id
        || !body.plat_member_contacts
        || !body.plat_member_tel
        || !body.plat_member_address
        || !body.plat_member_application
        || (!body.is_agree_terms || body.is_agree_terms == 2)
    ) {
        layer.msg("请完善信息后重新提交", { time: 2500 });
        return false;
    }

    if(!objExp.test(body.plat_member_tel)) {
        layer.msg("请输入正确的手机号码后重新提交", { time: 2500 });
        return false;
    }

    $.ajax({
        url: MEMBER_APPLY,
        type: 'post',
        async: false,
        headers: {
            'Token': window.localStorage.getItem("token")
        },
        data: body,
        success: function(data) {
            if(data.code == -200) {
                layer.msg(data.message, { time: 2500 });
                member_levels();
            }
            if(data.code == 200) {
                window.location.href = '/application';
            }
        },
        error: function(error) {
            console.error(error);
        }
    });
});

$("#member_individual_application_modify").click(function() {
    var body = {}, is_agree_terms1;
    if($("#is_agree_terms1").is(':checked')) {
        is_agree_terms1 = 1;
    } else {
        is_agree_terms1 = 2;
    }
    body._method                 = "put";
    body.apply_type              = 1;
    body.plat_member_level_id    = item_weid;
    body.plat_member_contacts    = $("#member_per_applicant").val();
    body.plat_member_tel         = $("#member_per_tel").val();
    body.plat_member_address     = $("#member_per_address").val();
    body.plat_member_application = $("#member_upload_1").val();
    body.is_agree_terms          = is_agree_terms1;

    if( !body.apply_type
        || !body.plat_member_level_id
        || !body.plat_member_contacts
        || !body.plat_member_tel
        || !body.plat_member_address
        || !body.plat_member_application
        || (!body.is_agree_terms || body.is_agree_terms == 2)
    ) {
        layer.msg("请完善信息后重新提交", { time: 2500 });
        return false;
    }

    if(!objExp.test(body.plat_member_tel)) {
        layer.msg("请输入正确的手机号码后重新提交", { time: 2500 });
        return false;
    }
    var options2 = $.post(MEMBER_APPLY, body);
    options2.done(function(data) {
        if(data.code == -200) {
            layer.msg(data.message, { time: 2500 });
            member_levels();
        }
        if(data.code == 200) {
            window.location.href = '/application';
        }
    });
    options2.fail(function(error) {
        console.error(error);
    });
});

$("#member_agency_application_submit").click(function() {
    var body = {}, is_agree_terms2;
    if($("#is_agree_terms2").is(':checked')) {
        is_agree_terms2 = 1;
    } else {
        is_agree_terms2 = 2;
    }
    body.apply_type              = 2;
    body.plat_member_level_id    = item_weid;
    body.plat_member_organization= $("#member_int_name").val();
    body.plat_member_contacts    = $("#member_int_applicant").val();
    body.plat_member_tel         = $("#member_int_tel").val();
    body.plat_member_address     = $("#member_int_address").val();
    body.plat_member_application = $("#member_upload_2").val();
    body.is_agree_terms          = is_agree_terms2;

    if( !body.apply_type
        || !body.plat_member_level_id
        || !body.plat_member_organization
        || !body.plat_member_contacts
        || !body.plat_member_tel
        || !body.plat_member_address
        || !body.plat_member_application
        || (!body.is_agree_terms || body.is_agree_terms == 2)
    ) {
        layer.msg("请完善信息后重新提交", { time: 2500 });
        return false;
    }

    if(!objExp.test(body.plat_member_tel)) {
        layer.msg("请输入正确的手机号码后重新提交", { time: 2500 });
        return false;
    }
    var options3 = $.post(MEMBER_APPLY, body);
    options3.done(function(data) {
        if(data.code == -200) {
            console.info(data.message);
            member_levels();
        }
        if(data.code == 200) {
            window.location.href = '/application';
        }
    });
    options3.fail(function(error) {
        console.error(error);
    });
});

$("#member_agency_application_modify").click(function() {
    var body = {}, is_agree_terms2;
    if($("#is_agree_terms2").is(':checked')) {
        is_agree_terms2 = 1;
    } else {
        is_agree_terms2 = 2;
    }
    body._method                 = "put";
    body.apply_type              = 2;
    body.plat_member_level_id    = item_weid;
    body.plat_member_organization= $("#member_int_name").val();
    body.plat_member_contacts    = $("#member_int_applicant").val();
    body.plat_member_tel         = $("#member_int_tel").val();
    body.plat_member_address     = $("#member_int_address").val();
    body.plat_member_application = $("#member_upload_2").val();
    body.is_agree_terms          = is_agree_terms2;

    if( !body.apply_type
        || !body.plat_member_level_id
        || !body.plat_member_organization
        || !body.plat_member_contacts
        || !body.plat_member_tel
        || !body.plat_member_address
        || !body.plat_member_application
        || (!body.is_agree_terms || body.is_agree_terms == 2)
    ) {
        layer.msg("请完善信息后重新提交", { time: 2500 });
        return false;
    }

    if(!objExp.test(body.plat_member_tel)) {
        layer.msg("请输入正确的手机号码后重新提交", { time: 2500 });
        return false;
    }
    var options3 = $.post(MEMBER_APPLY, body);
    options3.done(function(data) {
        if(data.code == -200) {
            console.info(data.message);
            member_levels();
        }
        if(data.code == 200) {
            window.location.href = '/application';
        }
    });
    options3.fail(function(error) {
        console.error(error);
    });
});
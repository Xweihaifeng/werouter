
// 会员时间进度轴
const token = docCookies.getItem("token");
if(token) {
    $.ajaxSetup({
        global: true,
        async: false,
        headers: {
            'Token': token,
        }
    });
}
var member_time_axis_result = '', member_apply_op_time = '';

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

const member_success_info = function(number) {
    var array = [
        {
            heading: "会员状态：待初审...",
            header_style: "active22"
        },
        {
            heading: "会员状态：待缴费...",
            header_style: "active22"
        },
        {
            heading: "会员状态：待复审...",
            header_style: "active22"
        },
        {
            heading: "会员状态：待完善信息...",
            header_style: "active22"
        },
        {
            heading: "会员状态：待终审...",
            header_style: "active22"
        },
        {
            heading: "会员状态：待颁发证书...",
            header_style: "active22"
        }
    ]

    $(".member_prompt_info").text(array[number].heading);
    $(".member_prompt_info").addClass(array[number].header_style);
}

// 提交申请
function time_axis_sub(result1) {
    var template = "", template1 = "";
    if(result1.apply_type == 1) {
        template = `<li><span> 申请单位： </span><span>`+result1.plat_member_organization+`</span></li>`;
    }

    if(result1.first_audit_is_done == 2) {
        template1 = `
        <p class="time_axis_menu">
            <span class="time_axis">`+result1.op_time+`</span>
            <span class="title_axis submit_detail">`+result1.name+`在`+result1.ap_time+` 提交的申请已经被退回，操作人`+result1.nickname+`，退回理由为：`+result1.first_audit_words+`</span>
        </p>`;
    }

    var member_time_axis = `
    <div class="time_axis_list">
        <h2> 会员申请提交 </h2>
        <p class="time_axis_menu">
            <span class="time_axis">`+ new Date(result1.created_at * 1000).format('yyyy-MM-dd hh:mm:ss') +`</span>
            <span class="title_axis submit_detail">`+result1.name+` 提交了入会申请，点击查看详情</span>
        </p>
        <ul class="form_axis">
            <li><span> 申请类型： </span><span>`+result1.apply_type+`</span></li>
            <li><span> 选择类型： </span><span>`+result1.level_name+`</span></li>
            <li><span> 申请金额： </span><span>`+result1.plat_member_price+`</span></li>
            <li><span> 申请书地址： </span><span><a href="`+result1.plat_member_application+`" target="_blank"> 点击下载 </a></span></li>
            `+ template +`
            <li><span> 申请人： </span><span>`+result1.plat_member_contacts+`</span></li>
            <li><span> 申请人电话： </span><span>`+result1.plat_member_tel+`</span></li>
            <li><span> 申请地址： </span><span>`+result1.plat_member_address+`</span></li>
        </ul>
        `+ template1 +`
    </div>`
    return member_time_axis;
}

// 初审
function time_axis_app(result1) {
    var apply_wait_days = localStorage.getItem("apply_wait_days");
    if(!apply_wait_days) {
        apply_wait_days = 1;
    }
    var member_time_axis = `
    <div class="time_axis_list">
        <h2> 会员初审 </h2>
        <p class="time_axis_menu">
            <span class="time_axis">`+result1.first_audit_time+`</span>
            <span class="title_axis submit_detail">会员申请表单正式受理，预计`+ apply_wait_days +`天时间</span>
        </p>
        <ul class="form_axis">
            <li><span> 受理时间： </span><span>`+result1.first_audit_time+`</span></li>
        </ul>
    </div>`
    return member_time_axis;
}

// 缴费
function time_axis_pay(result1) {
    var member_time_axis = `
    <div class="time_axis_list">
        <h2> 会员缴费 </h2>
        <p class="time_axis_menu">
            <span class="time_axis">`+ new Date(result1.pay_at * 1000).format('yyyy-MM-dd hh:mm:ss') +`</span>
            <span class="title_axis submit_detail">`+result1.name+` 完成在线缴费，缴纳金额为`+result1.plat_member_price+`</span>
        </p>
        <ul class="form_axis">
            <li><span> 选择类型： </span><span>`+result1.level_name+`</span></li>
            <li><span> 申请金额： </span><span>`+result1.plat_member_price+`</span></li>
        </ul>
    </div>`
    return member_time_axis;
}

// 复审
function time_axis_review(result1) {
    var member_time_axis = `
    <div class="time_axis_list">
        <h2> 会员复审 </h2>
        <p class="time_axis_menu">
            <span class="time_axis">`+result1.sec_audit_time+`</span>
            <span class="title_axis submit_detail">`+result1.name+` 缴费已被确定</span>
        </p>
        <ul class="form_axis">
            <li><span> 缴费时间： </span><span>`+ new Date(result1.pay_at * 1000).format('yyyy-MM-dd hh:mm:ss') +`</span></li>
            <li><span> 缴费金额： </span><span>`+result1.plat_member_price+`</span></li>
        </ul>
    </div>`
    return member_time_axis;
}

// 显示证书
function member_issue(result2) {
    var member_time_axis = `
    <div class="plat_logo"></div>
    <div class="member_level">`+ result2.member_level +`</div>
    <div class="cert_words">`+ result2.cert_words +`</div>
    <div class="end_number">证书编号：`+ result2.cert_number +`</div>
    <div class="begin_time">发证日期：`+ result2.begin_time +`</div>
    <div class="end_time">截止日期：`+ result2.end_time +`</div>
    <div class="cert_seal"></div>`
    return member_time_axis;
}

function setBg(url, init) {
    if (url) {
        var filename = url;  
        var index1 = filename.lastIndexOf(".");
        var index2 = filename.length;
        var suffix = filename.substring(index1 + 1, index2);
        if(['doc','docx','pdf', 'txt'].indexOf(suffix) >= 0) {
            return result1.plat_member_application = ApiMaterPlatQiniuDomain + url;
        } else if(url.indexOf('http') != 0) {
            return result1.plat_member_application = imgSet(url, 120, 120, 3);
        }
    } else {
        return init;
    }
}

// 是否申请
function time_axis_member_apply() {
    var options0 = $.get(MEMBER_APPLY);
    options0.done(function(data) {
        if(data.code == 200) {  

            result1 = data.data;
            // console.log("会员申请：", result1);
            member_apply_op_time = result1.sec_audit_time;
            if (!result1) {
                return false;
            }

            if(result1.apply_type == 1) {
                result1.apply_type = "个人申请";
            } else if(result1.apply_type == 2) {
                result1.apply_type = "机构申请";
            }

            if(!result1.paper_img) {
                result1.paper_img = "/common/img/default_img.png";
            } else if (result1.paper_img.indexOf('http') != 0 && result1.paper_img != "") {
                result1.paper_img = imgSet(result1.paper_img, 120, 120, 3);
            }

            setBg(result1.plat_member_application, '#');

            if(result1.state == 1) {

                if(result1.first_audit_is_done == 1) {
                    $(".member_app_sub").addClass("process_active");
                } else if(result1.first_audit_is_done == 2) {

                }
                member_time_axis_result = time_axis_sub(result1);
                member_success_info(0);
            } else if(result1.state == 2) {
                member_time_axis_result = time_axis_sub(result1) + time_axis_app(result1);
                member_success_info(1);
                $(".member_app_sub, .member_first_trial").addClass("process_active");
            } else if(result1.state == 3) {
                member_time_axis_result = time_axis_sub(result1) + time_axis_app(result1) + time_axis_pay(result1);
                member_success_info(2);
                if(result1.sec_audit == 1) {
                    $(".member_app_sub, .member_first_trial, .member_pay, .member_sec").addClass("process_active");
                } else if(result1.sec_audit == 2 && result1.sec_audit_operation == 3) {
                    $(".member_app_sub, .member_first_trial, .member_pay").addClass("process_active");
                } else if(result1.sec_audit == 2 && result1.sec_audit_operation == 1) {
                    $(".member_app_sub, .member_first_trial, .member_pay").addClass("process_active");
                }
            } else {
                member_time_axis_result = time_axis_sub(result1) + time_axis_app(result1) + time_axis_pay(result1) + time_axis_review(result1);
            }
        }
    });
    options0.fail(function(error) {
        console.error(error);
    });
}

// 会员信息完善
function time_axis_perfect(result1) {
    var member_time_axis = `
    <div class="time_axis_list">
        <h2> 会员信息完善 </h2>
        <p class="time_axis_menu">
            <span class="time_axis">`+result1.info_at+`</span>
            <span class="title_axis submit_detail">`+result1.name+` 会员信息已经完成更新。会员展示页预览链接地址：<a href="/u/`+ result1.weid +`" target="_blank"> 个人风采 </a></span>
        </p>
        <p class="time_axis_menu">
            <span class="time_axis">`+result1.info_at+`</span>
            <span class="title_axis submit_detail"> 会员服务期限已经确定，时间为：`+ result1.begin_time +` -- `+ result1.end_time +`</span>
        </p>
    </div>`
    return member_time_axis;
}


// 终审
function time_axis_last_instance(result1) {
    var date1 = new Date(member_apply_op_time);
    var date2 = new Date(result1.op_time);
    var date3 = date2.getTime() - date1.getTime();

    var days = Math.floor(date3/(24*3600*1000));

    var leave1 = date3%(24*3600*1000);
    var hours = Math.floor(leave1/(3600*1000));

    var leave2 = leave1%(3600*1000);
    var minutes = Math.floor(leave2/(60*1000));

    var leave3 = leave2%(60*1000);
    var seconds = Math.round(leave3/1000);

    var last_instance_time = days +" 天 "+ hours +" 小时 "+ minutes +" 分钟 "+ seconds +" 秒";

    var member_time_axis = `
    <div class="time_axis_list">
        <h2> 会员终审 </h2>
        <p class="time_axis_menu">
            <span class="time_axis">`+result1.final_audit_time+`</span>
            <span class="title_axis submit_detail">`+result1.name+` 的入会申请，终审通过，终审意见（`+ result1.final_audit_words +`）</span>
        </p>
        <p class="time_axis_menu">
            <span class="time_axis">`+result1.final_audit_time+`</span>
            <span class="title_axis submit_detail"> 会员终审合计用了 `+ last_instance_time +` </span>
        </p>
    </div>`
    return member_time_axis;
}

// 证书颁发
function time_axis_issue(result1, weid) {
    var member_time_axis = `
    <div class="time_axis_list">
        <h2> 颁发证书 </h2>
        <p class="time_axis_menu">
            <span class="time_axis">`+result1.issue_at+`</span>
            <span class="title_axis submit_detail">`+result1.name+` 的会员证书已经颁发</span>
        </p>
    </div>`
    return member_time_axis;
    // 证书链接地址为：`+ window.location.host + `/u/cert/` + weid +`
    // <a href="/u/cert/`+ weid +`">`+ window.location.host + `/u/cert/` + weid +`</a>
}

// 查看微主页开通情况
var pageInfo = function(callback) {
    $.ajax({
        url: PAGES_PAGE_INFO,
        type: 'GET',
        success: function(data) {
            if (data.code == 200) {
                callback(data.data);
            } else {
                layer.msg(data.message);
            }
        },
        error: function(error) {
            console.log(error);
        }
    })
}

// 登录状态下显示操作
if(token != null || token != undefined) {

    // 是否为会员
    var member_options = $.get(MEMBER_PROFILE);
    member_options.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            // console.log("准会员：", result);

            if(!result) {
                // * 非会员 -> 准会员
                /*
                 * 0、申请提交
                 * 1、会员初审
                 * 2、会员缴费
                 * 3、会员复审
                */
                time_axis_member_apply();
            } else {
                // * 准会员 -> 正式会员
                /*
                 * 1、信息完善与否
                 * 2、终审通过与否
                 * 3、证书颁发与否
                 */
                time_axis_member_apply();

                if(result.is_info == 2) {
                    member_success_info(3);
                } else if(result.is_info == 1) {
                    member_time_axis_result += time_axis_perfect(result);
                    // 信息已经完善
                    if(result.final_audit == 2) {
                        member_success_info(4);
                    } else if(result.final_audit == 1) {
                        member_time_axis_result += time_axis_last_instance(result);
                        if(result.is_issued == 1) {

                            pageInfo(function(rep) {
                                if (!rep.hasPages && rep.isUM && $.inArray('UM', rep.openAllowSource) != -1) {
                                    $("#btn-open-wepage").show();
                                    $("#btn-open-wepage").bind("click", avatar_admin);
                                } else {
                                    $("#btn-open-wepage").remove();
                                }
                            });
                            // 证书已经颁发
                            $(".type_list, .member_cost, .member_off_cert").remove();
                            $(".member_certificate_block").show();
                            $("#memner_end_time").text(result.end_time);
                            $("#coping_link").val("http://" + window.location.host +"/cert/"+ result.weid);

                            $(".member_view_cert").attr("href","http://" + window.location.host +"/cert/"+ result.weid);
                            member_time_axis_result += time_axis_issue(result, result.weid);

                            var options20 = $.get(MEMBER_CERT + result.weid +"/cert");
                            options20.done(function(body) {
                                if(body.code == 200) {
                                    var result2 = body.data;
                                    if(result2.cert_template.indexOf('http') != 0 && result.cert_template != "") {
                                        result2.cert_template = imgSet(result2.cert_template, 750, 520, 3);
                                    }
                                    if(result2.plat_logo.indexOf('http') != 0 && result.plat_logo != "") {
                                        result2.plat_logo = imgSet(result2.plat_logo, 224, 224, 3);
                                    }
                                    if(result2.cert_seal.indexOf('http') != 0 && result.cert_seal != "") {
                                        result2.cert_seal = imgSet(result2.cert_seal, 960, 804, 3);
                                    }
                                    $(".member_certificate_big_image").html(member_issue(result2));
                                    $(".member_certificate_big_image").css("background-image", "url("+ result2.cert_template +")");
                                    $(".plat_logo").css("background-image", "url("+ result2.plat_logo +")");
                                    $(".cert_seal").css("background-image", "url("+ result2.cert_seal +")");

                                    //证书生成图片
                                    html2canvas($(".member_certificate_big_image"), {
                                         useCORS:true, 
                                        onrendered: function(canvas) {
                                            //生成base64图片数据 
                                            canvas.setAttribute('id','thecanvas'); 
                                            // var dataUrl = canvas.toDataURL();  
                                            // var newImg = document.createElement("img");
                                            // newImg.src =  dataUrl;  
                                            $(".member_certificate_big_image").parent().append(canvas); 
                                            $(".member_certificate_big_image").hide(); 
                                        }   
                                    });
                                    // html2canvas(document.getElementById('id')).then(function(canvas) {document.body.appendChild(canvas);});
                                }
                            });
                            options20.fail(function(error) {
                                console.error(error);
                            });

                        } else if(result.is_issued == 2) {
                            // 证书未颁发
                            member_success_info(5);
                        }
                    }
                }
                $(".member_process > li").addClass("process_active");
                // window.location.href = '/applicationsuccess';
            }

            $("#member_time_axis").append(member_time_axis_result);
            $(".time_axis_menu").click(function() {
                $(this).next(".form_axis").slideToggle();
            });
        }
    });
    member_options.fail(function(error) {
        console.error(error);
    });
}

function copyLink() {
    if (!$("#coping_link").val()) {
        return false;
    }
    var Url2 = document.getElementById("coping_link").select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    console.info("复制成功");
    layer.msg("复制成功", { time: 1500 });
}

//证书图片下载
$(document).on('click', '#dw', function(){
    var oCanvas = document.getElementById("thecanvas");

    /*自动保存为png*/
    // 获取图片资源
    var img_data1 = Canvas2Image.saveAsPNG(oCanvas, true).getAttribute('src');
    saveFile(img_data1, 'cert.png');


    /*下面的为原生的保存，不带格式名*/
    // 这将会提示用户保存PNG图片
    // Canvas2Image.saveAsPNG(oCanvas);
});
// 保存文件函数
var saveFile = function(data, filename){
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;
   
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};
//证书图片下载
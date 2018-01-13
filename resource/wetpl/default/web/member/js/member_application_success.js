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

    // 判断是否开通微主页
    function avatar_admin() {
        var type = Math.random();
        layer.open({
            type: 1,
            title: '开通微主页',
            offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                ,
            area: ['600px', '350px'],
            id: 'layerDemo' + type //防止重复弹出
                ,
            content: `
            <div class="cont-hd">
                <div class="panel panel-default panel-title">
                    <div class="panel-body">
                        请输入您专属的个性域名
                    </div>
                </div>
                <div class="form-group" style="margin-top: 15px;margin-right: 30px;">
                    <button class="btn btn-default send-code" style="margin-left: 10px; border-color: #ccc;float: right;width:100px;" >发送验证码</button>
                    <input type="text" class="form-control" name="verifycode" value="" style="width: 200px; float: right;" placeholder="请输入验证码">
                    <label style="margin-left: 10px; padding-top: 8px; padding-right: 5px; float: right;">验证码</label>
                    
                    
                </div>
                <div class="form-group" style="margin-top: 60px;margin-right: 30px;">
                    <button class="btn btn-success check-domain" style="margin-left: 10px; border-color: #ccc; float: right;width:100px;" >检测</button>
                    <button id="submit_domain" type="submit" class="btn btn-danger" style="margin-left: 10px; border-color: #ccc; float: right;width:100px; display:none" >立即申请</button>
                    <input id="user-domain" type="text" class="form-control" name="domain" value="" style="width:  200px; float: right;" placeholder="请输入5~16位英文字符">
                    <label id="host" style="margin-left: 10px; padding-top: 8px; padding-right: 5px; float: right;"></label>
                    
                </div>

            </div>`
                //,btn: '关闭全部'
                ,
            btnAlign: 'c' //按钮居中
                ,
            shade: 0 //不显示遮罩
                ,
            yes: function() {
                layer.closeAll();
            },
            success: function(layero) {
                var host = 'http://' + window.location.host;
                $("#host").text(host + "/");
                var weid = docCookies.getItem("weid");
                var store = function(sendData) {
                    $.ajax({
                        url: PAGESTORE,
                        type: 'POST',
                        data: sendData,
                        headers: {
                            'Token': docCookies.getItem("token")
                        },
                        success: function(data) {
                            if (data.code == 200) {
                                layer.msg('微主页开通成功！', {
                                    time: 1500
                                });
                                setTimeout(function() {
                                    window.location.reload();
                                }, 2000);

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
                var checkDomain = function(domain, callback) {
                    $.ajax({
                        url: PAGES_PAGE_CHECK_DOMAIN,
                        type: 'POST',
                        data: { domain: domain },
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

                $("#submit_domain").click(function() {
                    var domain = $("#user-domain").val();
                    var code = $('input[name=verifycode]').val();
                    var sendData = { weid: weid, domain: domain, code: code };
                    if (domain != "") {
                        store(sendData);
                    } else {
                        layer.msg('请输入个性域名', {
                            time: 1500
                        });
                    }
                });

                function codeTimer($codeTimer) {
                    var obj = $(".send-code");
                    if (parseInt(obj.find('span').text()) <= 0) {
                        clearInterval($codeTimer);
                        obj.removeAttr('disabled');
                        obj.html('发送验证码');
                    } else {
                        obj.find('span').text(parseInt(obj.text()) - 1);
                    }
                }
                $(".check-domain").click(function() {
                    var domain = $("#user-domain").val();
                    if (domain.length === 0) {
                        layer.msg('请输入个性域名');
                        return;
                    }
                    checkDomain(domain, function(data) {
                        layer.msg('该个性别名可以使用');
                        $('.check-domain').hide();
                        $('#submit_domain').show();
                    });
                });
                var $codeTimer;
                $(".send-code").click(function() {
                    $.ajax({
                        url: CODES,
                        type: 'POST',
                        data: {
                            phone: localStorage.getItem('phone')
                        },
                        headers: {
                            'Token': docCookies.getItem("token")
                        },
                        success: function(data) {
                            if (data.code == 200) {
                                layer.msg('发送成功！');
                                $(".send-code").html('<span>60</span>后重发');
                                $(".send-code").attr('disabled', true);
                                $codeTimer = setInterval(function() {
                                    codeTimer($codeTimer);
                                }, 1000);
                            } else {
                                layer.msg(data.message);
                            }
                        },
                        error: function(xhr) {
                            console.log(xhr);
                        }
                    })
                });

            }
        });
    }

    if (token != null || token != undefined) {
        // 会员
        var member_options = $.get(MEMBER_PROFILE);
        member_options.done(function(data) {
            if (data.code == 200) {
                var result = data.data;
                if (!result) {
                    // 非会员
                    console.log("非会员！");
                    window.location.href = "/apply"
                    return false;
                } else {
                    // 会员
                    if (result.is_info == 2) {
                        // 信息未完善
                        console.log("信息未完善!");

                    } else if (result.is_info == 1) {
                        // 信息已经完善
                        if (result.is_issued == 1) {
                            // 开通微主页
                            pageInfo(function(rep) {
                                if (!rep.hasPages && rep.isUM && $.inArray('UM', rep.openAllowSource) != -1) {
                                    $("#btn-open-wepage").css('display', 'inline-block');
                                    $("#btn-open-wepage").bind("click", avatar_admin);
                                } else {
                                    $("#btn-open-wepage").css('display', 'none');
                                }
                            });
                            // 证书已经颁发
                            if (!result.certificate) {
                                $(".member_certificate_big_image").attr("src", "/common/img/certbgImg.png");

                            } else if (result.certificate.indexOf('http') != 0 && result.certificate != "") {
                                result.certificate = ApiMaterPlatQiniuDomain + result.certificate;
                                $(".member_certificate_big_image").attr("src", result.certificate);

                            } else if (result.certificate.indexOf('http') == 0 && result.certificate != "") {
                                $(".member_certificate_big_image").attr("src", result.certificate);
                            }

                            $("#memner_end_time").text(result.end_time);

                        } else if (result.is_issued == 2) {
                            // 证书未颁发
                            console.log("证书未颁发!");

                        }
                    }
                }
            }
        });
        member_options.fail(function(error) {
            console.error(error);
        });
    } else {
        window.location.href = "/apply";
    }
    $(".member_domain_edit").click(function() {
        $(".member_domain_content").slideToggle();
    });

    function copyLink() {
        if (!$("#coping_link").val()) {
            return false;
        }
        var Url2 = document.getElementById("coping_link").select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        console.info("复制成功");
        layer.msg("复制成功", { time: 1500 });
    }
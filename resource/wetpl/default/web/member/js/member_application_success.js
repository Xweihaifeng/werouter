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
        type = Math.random();
        layer.open({
            type: 1,
            title: '请设置您的个性域名',
            offset: type,
            area: ['670px', '400px'],
            id: 'layerDemo' + type,
            content: `
            <div class="cont-hd">
                <div class="panel panel-default panel-title">
                    <div class="panel-body">
                        请输入您专属的个性域名
                    </div>
                </div>
                <div class="form-group" style="margin-top: 60px;">
                    <label id="host" style="margin-left: 10px; padding-top: 8px; padding-right: 5px; float: left;"></label>
                    <input id="user-domain" type="text" class="form-control" name="domain" value="" style="width: 50%; float: left;">
                </div>
                <button id="submit_domain" type="submit" class="btn btn-default" style="margin-left: 10px; border-color: #ccc;">立即申请</button>
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
                                console.log(data)
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

                $("#submit_domain").click(function() {
                    var domain = $("#user-domain").val();
                    var sendData = { weid: weid, domain: domain };
                    if (domain != "") {
                        store(sendData);
                    } else {
                        layer.msg('请输入个性域名', {
                            time: 1500
                        });
                    }
                })

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
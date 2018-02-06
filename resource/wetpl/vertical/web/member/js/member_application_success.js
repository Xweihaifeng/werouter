// 判断是否开通微主页
function avatar_admin() {
    var type = Math.random();
    layer.open({
        type: 1,
        title: '开通微主页',
        offset: type, //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        area: ['900px', '369px'],
        id: 'layerDemo' + type, //防止重复弹出
        content: `
        <div class="cont-hd" style="overflow: hidden;width: 100%;box-sizing: border-box;margin: 0">
             <div class="cont-L" style=" width: 165px;height:141px;float: left;margin-top:50px;margin-left: 30px">
                 <img src="/resource/wetpl/default/web/user/img/domain_res.png" alt="">
             </div>
            <div class="cont-R" style="width: 670px;height: auto;float: right;margin-right: 30px;font-weight: normal;">
                <div class="form-group" style="margin-top: 60px;margin-right: 30px;margin-bottom: 16px;overflow: hidden">
                    <button class="btn btn-success check-domain" style="width: 98px;height: 42px;line-height: 31px;text-align: center;background: #ffcc5f;color: #fff;margin-left: 20px;border-radius: 3px;margin-right: 18px;border: none;outline:none;float: right;" >检测</button>
                    <input id="user-domain" type="text" class="form-control" name="domain" value="" style="width:200px;display: inline-block;float: right;outline: none;height:42px" placeholder="请输入5~16位英文字符">
                    <label id="host" style="margin-left: 10px; padding-top: 8px; padding-right: 5px;display: inline-block;font-weight: normal;float: right;height:42px"></label>
                </div>
                <div class="form-group" style="margin-top:15px;margin-right: 30px;overflow: hidden">
                    <button class="btn btn-default send-code" style="width: 98px;height: 42px;line-height: 31px;text-align: center;background: #ffcc5f;color: #fff;margin-left: 20px;border-radius: 3px;margin-right: 18px;border: none;outline:none;float: right" >发送验证码</button>
                    <input type="text" class="form-control" name="verifycode" value="" style="width:200px;display: inline-block;float: right;outline: none;height:42px" placeholder="请输入验证码">
                    <label style=" display: inline-block;font-size:14px;color:#333333;float: right;line-height: 37px;margin-right: 10px">验证码</label>
                </div>
                <div class="save" style="float: right;width: 60px; height: 36px;text-align: center;line-height: 36px; border-radius: 3px;color: #fff;cursor: pointer;margin-top: 10px;font-size: 14px;margin-right: 47px;background: #ffbf33;display: none;">保存</div>
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
            console.log(layero);
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
                layer.load(1);
                $.ajax({
                    url: PAGES_PAGE_CHECK_DOMAIN,
                    type: 'POST',
                    data: { domain: domain },
                    success: function(data) {
                        layer.closeAll('loading');
                        if (data.code == 200) {
                            callback(data.data);
                        } else {
                            layer.msg(data.message);
                        }
                    },
                    error: function(error) {
                        layer.closeAll('loading');
                        console.log(error);
                    }
                })
            }

            $(".save").click(function() {
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
                $('.save').hide();
                checkDomain(domain, function(data) {
                    layer.msg('该个性别名可以使用');
                    $('.save').show();
                });
            });
            var $codeTimer;
            $(".send-code").click(function() {
                $.ajax({
                    url: CODES,
                    type: 'POST',
                    data: {
                        phone: plats_user_info.phone
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

$(".member_domain_edit").click(function() {
    $(".member_domain_content").slideToggle();
});

// function copyLink() {
//     if (!$("#coping_link").val()) {
//         return false;
//     }
//     var Url2 = document.getElementById("coping_link").select(); // 选择对象
//     document.execCommand("Copy"); // 执行浏览器复制命令
//     console.info("复制成功");
//     layer.msg("复制成功", { time: 1500 });
// }

if(token != null || token != undefined) {
    // 会员
    var member_options = $.get(MEMBER_PROFILE);
    member_options.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            if(!result) {
                // 非会员
                console.log("非会员！");
                window.location.href = "/apply"
                return false;
            } else {
                // 会员
                if(result.is_info == 2) {
                    // 信息未完善
                    console.log("信息未完善!");

                } else if(result.is_info == 1) {
                    // 信息已经完善
                    if(result.is_issued == 1) {
                        // 证书已经颁发
                        if(!result.certificate) {
                            $(".member_certificate_big_image").attr("src", "/common/img/certbgImg.png");

                        } else if (result.certificate.indexOf('http') != 0 && result.certificate != "") {
                            result.certificate = ApiMaterPlatQiniuDomain + result.certificate;
                            $(".member_certificate_big_image").attr("src", result.certificate);

                        } else if(result.certificate.indexOf('http') == 0 && result.certificate != "") {
                            $(".member_certificate_big_image").attr("src", result.certificate);
                        }

                        $("#memner_end_time").text(result.end_time);

                    } else if(result.is_issued == 2) {
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
    if(!$("#coping_link").val()) {
        return false;
    }
    var Url2=document.getElementById("coping_link").select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    console.info("复制成功");
    layer.msg("复制成功", { time: 1500 });
}
$(function () {
    if (!show) {
        var show = 2;
    }
    $(".but").click(() => {
        if (show == 1) {
            $(".but").animate({left: -40}, 600);
            $(".hidde").slideDown();
            show = 2;
        } else {
            $(".but").animate({left: 0}, 600);
            $(".hidde").slideUp();
            $(".module").addClass("block");
            $(".module_li").removeClass("block");
            show = 1;
        }
    })

    $(".form-top > li").each((i, v) => {
        $(v).click(() => {
            if (i == 1) {
                $.ajax({
                    url: ApiUrl + 'plat_setting',
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        if (data.code === 200) {
                            $("#templateId").find("input[name=templateId][value=" + data.data.template_id + "]").attr("checked", true);
                            if (data.data.is_custom == null) {
                                $(".but").animate({left: -40},0);
                                $(".hidde").slideDown();
                                $(".module").removeClass("block");
                                $(".module_li").addClass("block");
                            }
                        } else {
                            console.log('error: -200');
                        }

                    },
                    error: function (xhr) {
                        console.log(xhr);
                    }
                });
                // javascript:introJs().start();
            }
            $(v).addClass("shown").siblings().removeClass("shown");
            $(".form-child > li").eq(i).addClass("block").siblings().removeClass("block");
        })
    })
    $("#updateSet2").click(() => {
        $(".module").removeClass("block");
        $(".module_li").addClass("block");
    })


})
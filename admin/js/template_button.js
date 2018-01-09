$(function () {
    if (!show) {
        var show = 1;
    }
    $(".but").click(() => {
        if (show == 2) {
            $(".but").animate({left: -40}, 600);
            $(".hidde").slideDown();
            $(".but").attr("data-toggle","modal");
            $(".but").attr("data-target","#myModal");
            show = 1;
        } else {
            $(".but").animate({left: 0}, 600);
            $(".hidde").slideUp();
            $(".module").addClass("block");
            $(".module_li").removeClass("block");
            $(".but").attr("data-toggle","");
            $(".but").attr("data-target","");
            show = 2;
        }
    })

    $(".form-top > li").each((i, v) => {
        $(v).click(() => {
            $(v).addClass("shown").siblings().removeClass("shown");
            $(".form-child > li").eq(i).addClass("block").siblings().removeClass("block");
        })
    })


    $("#updateSet2").click(function () {
        var is_custom = show;
        var custom_file = $('#custom_file').val();
        var custom_name = $('#custom_name').val();
        var template_id = $("#module_list").find("option:selected").val();
        $.ajax({
            url: ApiUrl + 'plat_set_template',
            type: 'post',
            dataType: 'json',
            data: {template_id: template_id,custom_name: custom_name, custom_file: custom_file, is_custom: is_custom},
            success: function (data) {
                if (data.code === 200) {
                    swal('', '保存成功', 'success');
                    $(".module").removeClass("block");
                    $(".module_li").addClass("block");
                } else {
                    swal('', data.message, 'error');
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });
})
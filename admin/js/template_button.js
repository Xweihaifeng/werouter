$(function () {
    $(".but").click(() => {
        let is_custom = $("#show_val").val();
        if(is_custom){
            var show = is_custom;
        }
        if (show == 2) {
            $(".but").attr("data-toggle","");
            $(".but").attr("data-target","");
            show = 1;
            $("#show_val").val(show)
            let is_custom = show;
            $.ajax({
                url: ApiUrl + 'plat_set_custom',
                type: 'post',
                dataType: 'json',
                data: {is_custom: is_custom},
                success: function (data) {
                    if (data.code === 200) {
                        swal('', '保存成功', 'success');
                        $(".but").animate({left: -40}, 600);
                        $(".module_li").addClass("block");
                    } else {
                        swal('', data.message, 'error');
                    }
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            });
        } else {
            $(".but").animate({left: 0}, 600);
            $(".but").attr("data-toggle","modal");
            $(".but").attr("data-target","#myModal");
            show = 2;
            $("#show_val").val(show)
        }

    })

    $(".form-top > li").each((i, v) => {
        $(v).click(() => {
            $(v).addClass("shown").siblings().removeClass("shown");
            $(".form-child > li").eq(i).addClass("block").siblings().removeClass("block");
        })
    })

    $("#Close_modul").click(function () {
        let show = 2;
        $("#show_val").val(show)
        let is_custom = show;
        $.ajax({
            url: ApiUrl + 'plat_set_custom',
            type: 'post',
            dataType: 'json',
            data: {is_custom: is_custom},
            success: function (data) {
                if (data.code === 200) {
                    swal('', '保存成功', 'success');
                    $(".module_li").removeClass("block");
                } else {
                    swal('', data.message, 'error');
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });

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
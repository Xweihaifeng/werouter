$(function () {
    $(".but").click(() => {
        let is_custom = $("#show_val").val();
        if(!is_custom){
            $(".module").slideDown();
            $("#show_val").val(1);
            // $(".module").addClass("block");
        }else {
            if(!is_custom){
                var show = 2;
            }else {
                var show = is_custom;
            }
            if (show == 2) {
                let is_custom = 1;
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
                            $("#show_val").val(1);

                        } else {
                            swal('', data.message, 'error');
                        }
                    },
                    error: function (xhr) {
                        console.log(xhr);
                    }
                });
            } else if( show == 1) {
                // $(".but").animate({left: 0}, 600);
                $(".but").attr("data-toggle","modal");
                $(".but").attr("data-target","#myModal");
                // // show = 2;
                // $("#show_val").val(show)
            }

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
                    $(".but").animate({left: 0}, 600);
                    $(".but").attr("data-toggle","");
                    $(".but").attr("data-target","");
                    // show = 2;
                    $("#show_val").val(show)
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
        var is_custom = $("#show_val").val();
        var custom_file = $('#custom_file').val();
        var custom_name = $('#custom_name').val();
        var template_id = $("#module_list").find("option:selected").val();
        var template_mark = $("#module_list").find("option:selected").attr('data-name');
        $.ajax({
            url: ApiUrl + 'plat_set_template',
            type: 'post',
            dataType: 'json',
            data: {template_id: template_id,custom_name: custom_name, custom_file: custom_file, is_custom: is_custom},
            success: function (data) {
                if (data.code === 200) {
                    $.ajax({
                        url: document.location.protocol+'//'+document.domain+'/admin/template.php',
                        type: 'post',
                        data:{operation : 'creatTemplate', from:template_mark, to:custom_file},
                        dataType: 'json',
                        success: function (data) {
                            if (data.code === 200) {
                                swal('', '保存成功', 'success');

                                $(".module_li").addClass("block");
                                $(".module").slideUp();
                                $(".but").animate({left: -40}, 600);
                            }
                        }
                    });
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
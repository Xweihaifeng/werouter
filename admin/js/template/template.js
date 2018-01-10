$(document).ready(function () {
    start();
    $.ajax({
        url: ApiUrl + 'plat_setting',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            if (data.code === 200) {
                if (data.data.is_custom != 1) {
                    $(".but").animate({left: -40},0);
                    $(".hidde").slideDown();
                    $(".module").removeClass("block");
                    $(".module_li").addClass("block");
                }else {
                    $(".module").removeClass("block");
                    $(".module_li").addClass("block");
                    $("#diy").addClass("shown").siblings().removeClass("shown");
                    $(".form-child > li:nth-of-type(2)").addClass("block").siblings().removeClass("block");
                    //模版列表渲染
                    var fileurl=localStorage.getItem('template_listfileurl');
                    if(fileurl==''||fileurl==null||fileurl=="undefined"){
                        fileurl=data.data.custom_file;
                    }
                    $.ajax({
                        url: document.location.protocol+'//'+document.domain+'/admin/template.php',
                        type: 'post',
                        data:{operation : 'templateList',url:fileurl},
                        dataType: 'json',
                        success: function(data){
                            //获取数据成功
                            if(data.code==200){
                                $('tbody').empty();
                                for(var i=0;i<data.data.length;i++){
                                    var html='';
                                    if(data.data[i].style=='file'){
                                        html+=`<tr class="odd gradeX" id="dr_row_`+i+`">
                                                        <td class="myselect">
                                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                                <input type="checkbox" class="checkboxes" name="ids[]" value="flink_list.html">
                                                                <span></span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <a href="javascript:void(0)" class="editfile" diyurl="`+data.data[i].url+`" >
                                                                <img src="image/html.png" style="width:30px;margin-right:10px"> `+data.data[i].name+`</a>
                                                        </td>
                                                        <td style="text-align:center">`+data.data[i].size+` KB</td>
                                                        <td><font color="red">`+data.data[i].updated+`</font></td>
                                                        <td>
                                                            <label><a href="javascript:void(0)" diyurl="`+data.data[i].url+`" class="btn btn-xs green editfile"> <i class="fa fa-edit"></i> 修改</a></label>
                                                        </td>
                                                    </tr>`;
                                    }
                                    if(data.data[i].style=='folder'||data.data[i].style=='back'){
                                        if(data.data[i].url!=''){
                                            html+=`<tr class="odd gradeX" id="dr_row_0">
                                                        <td class="myselect">
                                                            <label class="mt-table mt-checkbox mt-checkbox-single mt-checkbox-outline">
                                                                <input type="checkbox" class="checkboxes" name="ids[]" value="">
                                                                <span></span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <a href="javascript:void(0)" class="listfile" diyurl="`+data.data[i].url+`">
                                                                <img src="image/folder.png" style="width:30px;margin-right:10px"> `+data.data[i].name+`</a>
                                                        </td>
                                                        <td style="text-align:center"> -</td>
                                                        <td></td>
                                                        <td>
                                                        </td>
                                                    </tr>`;
                                        }
                                    }
                                    $('tbody').append(html);
                                }
                                listfileclick();
                                editfileclick();
                            }
                        },
                        error: function(xhr){
                            console.log(xhr);
                        }
                    });
                    var listfileclick=function () {
                        $(".listfile").click(function () {
                            var url=$(this).attr('diyurl');
                            if(url){
                                //跳转本页记录url
                                localStorage.setItem('template_listfileurl', url);
                                document.location.reload();
                            }else{
                                document.location.reload();
                            }
                        })
                    }
                    var editfileclick=function () {
                        $(".editfile").click(function () {
                            var url=$(this).attr('diyurl');
                            if(url){
                                //跳转编辑页记录URL
                                localStorage.setItem('template_editfileurl', url);
                                window.location.href="/admin/template_detail.html";
                            }
                        })
                    }
                }
            } else {
                console.log('error: -200');
            }

        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
    var init = function () {
        $.ajax({
            url: ApiUrl + "plat_template",
            type: 'get',
            dataType: 'JSON',
            success: function(result) {
                if(result.code === 200) {
                    var defaults = template = '';
                    $.each(result.data, function(key, val) {
                        defaults += '<div style="width: 200px; float: left; text-align: center; margin-right: 20px; line-height: 40px;">' +
                            '<img width="200" src="/resource/wetpl/' + val.mark + '/' + val.cover + '"></br>' +
                            '<input type="radio" name="templateId" value=' + val.id + '>' + val.title +
                            '<span style="padding-left: 15px;">预览</span></div>';
                        template += '<option name="options" value=' + val.id + '>' + val.title + '</option>';
                    });
                    $("#default").html(defaults);
                    $("#module_list").html(template);
                    $("#custom_file").val(window.location.host);
                    $("#custom_name").val('自定义模板');
                    $.ajax({
                        url: ApiUrl + 'plat_setting',
                        type: 'get',
                        dataType: 'json',
                        success: function (data) {
                            if (data.code === 200) {
                                if (data.data.is_custom != 1) {
                                    $("#templateId").find("input[name=templateId][value=" + data.data.template_id + "]").attr("checked", true);
                                }
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
                } else {
                    parent.layer.msg(result.message);
                    return false;
                }
            }
        });
    };
    init();

    // Save
    $("#updateSet").click(function () {
        var templateId = $("input[name='templateId']:checked").val();
        $.ajax({
            url: ApiUrl + 'plat_set_template',
            type: 'post',
            dataType: 'json',
            data: {template_id: templateId},
            success: function (data) {
                if (data.code === 200) {
                    swal('', '保存成功', 'success');
                } else {
                    swal('', data.message, 'error');
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        });
    });


});
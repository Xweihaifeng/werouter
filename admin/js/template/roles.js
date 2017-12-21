$(document).ready(function() {
    start();
    var init = function() {
        $.ajax({
            url: ApiUrl + "roles",
            type: 'get',
            dataType: 'JSON',
            success: function(result) {
                if (result.code === 200) {
                    var html = '',
                        num = 0,
                        status = '';
                    $.each(result.data.list, function(key, val) {
                        num++;
                        switch (val.status) {
                            case 1:
                                status = '激活';
                                break;
                            case 2:
                                status = '未激活';
                                break;
                        }
                        html += '<tr>' +
                            '<td>' + num + '</td>' +
                            '<td>' + val.name + '</td>' +
                            '<td>' + val.display_name + '</td>' +
                            '<td>' + val.description + '</td>' +
                            '<td>' + status + '</td>' +
                            '<td>' + val.created_at + '</td>' +
                            '<td class="text-center">' +
                            '<a title = "菜单权限" class="btn btn-info" style="margin-right:10px;"  href="roles_config.html?weid=' + val.weid + '">菜单权限</a>' +
                            '<a title = "频道权限" class="btn btn-info" style="margin-right:10px;"  href="roles_channel.html?weid=' + val.weid + '">频道权限</a>' +
                            '<a title = "编辑" class="btn btn-info" style="margin-right:10px;"  href="roles_edit.html?weid=' + val.weid + '">编辑</a>' +
                            '<a title = "删除" class="btn btn-danger" data-toggle="modal" data-target="#myModal" data-id="' + val.weid + '" data-name="' + val.name + '"  href="#">删除</a>' +
                            '</td></tr>';
                    });
                    $("#rolesTable").html(html);
                    $("#rolesTable").children().children().each(function() {
                        $(this).children('a[title="删除"]').click(function() {
                            var dataId = $(this).attr('data-id'),
                                dataName = $(this).attr('data-name');
                            $('#confirm').attr('data-id', dataId);
                            $('#menus_fix').html(dataName);
                        })
                    })
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            }
        });
    };
    $('#confirm').click(function() {
        var dataId = $(this).attr('data-id');
        $.ajax({
            url: ApiUrl + "roles/" + dataId,
            type: 'DELETE',
            dataType: 'JSON',
            success: function(result) {
                if (result.code === 200) {
                    showTips('删除成功！', 2, 'alert-info');
                    location.reload();
                    console.log('ok');
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            }
        });
    });

    function showTips(tips, time, el) {
        var windowWidth = document.documentElement.clientWidth;
        var tipsDiv = '<div class="alert ' + el + '" role="alert">' + tips + '</div>';

        $('body').append(tipsDiv);
        $('div.alert').css({
            'top': '220px',
            'left': (windowWidth / 2) - (tips.length * 10 / 2) + 'px',
            'position': 'absolute',
            'padding': '3px 5px',
            'background': '#ffffff',
            'width': '200px',
            'font-size': 14 + 'px',
            'margin': '0 auto',
            'text-align': 'center',
            'z-index': '5000',
            'line-height': '230%',
            'opacity': '0.8'
        }).show();
        setTimeout(function() {
            $('div.alert').fadeOut();
            $('.alert').remove();
        }, (time * 1000));
    }

    init();
});
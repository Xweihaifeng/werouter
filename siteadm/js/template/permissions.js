$(document).ready(function () {
    start();
    var init = function () {
        $.ajax({
            url: ApiUrl + "permission",
            type: 'get',
            dataType: 'JSON',
            success: function (result) {
                if (result.code === 200) {
                    var html = '';
                    console.log(result);
                    $.each(result.data, function (key, val) {
                    	console.log(val)
//                      html += '<tr>'
//                          + '<td>' + val.id + '</td>'
//                          + '<td>' + val.status + '</td>'
//                          + '<td>' + val.message + '</td>'
//                          + '<td><a title = "编辑"  href="admin_edit.html?id=' + val.id + '">编辑</a></td></tr>';
                    });
                    $("#permissionsTable").html(html);
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            }
        });
    };

    init();
});
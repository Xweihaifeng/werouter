/**
 * Created by weifeng on 2018/01/09.
 */

$(function() {
    var tpl = "", icp = '';
    // 平台商标
    $.ajax({
        url: apiUrl + "cms/setting/show",
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.code === 200) {
                tpl = data.data.title;
                icp = data.data.icp;
                $(".copyright").html(data.data.copyright);
            } else {
                console.error(data.message);
            }
        }
    });
});
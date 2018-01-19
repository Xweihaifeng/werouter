/*
* 通过地址栏的输入，判断是频道还是栏目.
* 如果有一级，判定为频道，可以根据别名、weid跟进.
* 如果有两级，判定频道下面的分类、也可以判定为分类下面的文章列表，可以根据别名、weid跟进.
*/

$(function() {
    //  根据返回 url 取 pathname 的最后一位的值.
    var get_param = window.location.pathname.split('/').pop();
    const result_weid = "";

    if(!get_param) {
        var options = $.get(CMS_CHANNELS_DOMAIN_QUERY + get_param);
        options.done(function(data) {
            console.log(data);
            if(data.code === 200) {
                result_weid = data.data.weid;
                console.log(result_weid);
                return result_weid;
            } else {
                console.error(data.message);
            }

        });

        options.fail(function(error) {
            console.error(error);
        });
    }

});
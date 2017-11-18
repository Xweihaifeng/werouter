/**
 * Created by weifeng on 2017/11/12.
 */

$(function() {

    // 公用部分变量声明
    var token = window.localStorage.getItem('token');
    var user_weid = window.localStorage.getItem("weid");
    var shop_weid = window.localStorage.getItem("shopping_weid");

    // 用户token验证部分
    if(token) {
        $.ajaxSetup({
            global: true,
            async:  false,
            headers: {
                'Token': token,
            }
        });
        $("#token").slideUp();
    }
})
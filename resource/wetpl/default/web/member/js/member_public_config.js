
//  登录token参数
var weid, item_weid;
const token = window.localStorage.getItem('token');
if(token) {
    $.ajaxSetup({
        global: true,
        async: false,
        headers: {
            'Token': token,
        }
    });
}

// 手机号码验证信息
const regExp = "^((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\\d{8}$";
const objExp = new RegExp(regExp);

var fav = window.localStorage.getItem("fav");
if(fav) {
    if(fav.indexOf('http') != 0) {
        $('#favicon').attr('href', ApiMaterPlatQiniuDomain + fav)
    }
}
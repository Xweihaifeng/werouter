function addCookie(name, value, expireHours) {
    var cookieString = name + "=" + escape(value) + "; path=/";
    if (expireHours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expireHours * 3600 * 1000);
        cookieString = cookieString + ";expires=" + date.toGMTString();
    }
    document.cookie = cookieString;
}

function getCookie(name) {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr[0] === name)return unescape(arr[1]);
    }
    return null;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cVal = getCookie(name);
    if (cVal !== null) document.cookie = name + "=" + cVal + "; path=/;expires=" + exp.toGMTString();
}

var token = getCookie("token");
$.ajaxSetup({
    global: true,
    dataType: 'json',
    headers: {
        'Token': token
    }
});


//获取url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function getQueryParam(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)
            return  unescape(r[2]);
        return null;
}
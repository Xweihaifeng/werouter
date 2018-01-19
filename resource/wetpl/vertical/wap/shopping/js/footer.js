$(function () {
    if (getQueryString('key') != '') {
        var key = getQueryString('key');
        var username = getQueryString('username');
        addCookie('key', key);
        addCookie('username', username);
    } else {
        var key = getCookie('key');
    }

    var html = '<footer id="public-ft">' +
        '<nav>' +
        '<ul>' +
        '<li><a class="maq-index"><div class="iconfont icon-zhuye"></div><p><span>首页</span></p></a></li>' +
        '<li><a class="maq-cat"><div class="iconfont icon-gouwuche"></div><p><span>购物车</span></p></a></li>' +
        ' <li><a class="maq-mine" ><div class="iconfont icon-geren"></div><p><span>我的</span></p></a></li>' +
        '</ul>' +
        '</nav>' +
        ' </footer>';
    if (typeof copyright == 'undefined') {
        copyright = '';
    }
    $("#footer").html(html);
    var key = getCookie('key');
    $("#regbtn").click(function () {
        callback = WapSiteUrl + '/tmpl/member/member.html';
        login_url = UCenterApiUrl + '?ctl=Login&met=regist&typ=e';
        callback = ApiUrl + '?ctl=Login&met=check&typ=e&redirect=' + encodeURIComponent(callback);
        login_url = login_url + '&from=wap&callback=' + encodeURIComponent(callback);
        window.location.href = login_url;
    });

    $(".logbtn").click(function () {
        checkLogin(2);
    });
//按钮埋点
    $('.maq-index').on('click',function(){
        try {
            _maq.trigger(['_trackEvent','首页按钮点击']);
        } catch(e) {
        }
        
        window.location.href = '/shop_wap/html/didao/index.html';
    });
    $('.maq-cat').on('click',function(){
        try {
            _maq.trigger(['_trackEvent','购物车按钮点击']);
        } catch(e) {
        }
        
        window.location.href = WapSiteUrl + "tmpl/cart_list.html?icon=1";
    });
    $('.maq-mine').on('click',function(){
        try {
            _maq.trigger(['_trackEvent','我的按钮点击']);
        } catch(e) {
        }
        
        window.location.href = WapSiteUrl + "tmpl/member/member.html?icon=1";
    });

});
$(document).ready(function(){
    //目前问题是tid会出现undefined
    var winH=$(document.body).height();
    console.log(winH)
    $('.all-info').css('height',winH)
    var currHeight = $("#art-head").height() + $("#art-body").height();
    setHeight(currHeight);

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    var weid = localStorage.getItem('weid');

    //路由处理逻辑
    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    //console.log('domain', domain);

    $(".linkto").attr('href', '/' + domain)

    //$(".oline-3 div:first-child").html('<img src="http://yewu.4g9.cn/qrcode.php?url=https://wezchina.com/kezunping&logo=https://image.wezchina.com/pages/article/1512481062602.png&domain=kezunping&size=430" />')
    //var genQrcode = function(req, url, logo, domain, size) {
    //    //$(".oline-3 div:first-child").html('<img src="' + req + 'url=' + url + '&logo=' + logo + '&domain=' + domain + '&size=' + size + '" width="175" height="175"/>')
    //}
    //genQrcode('http://yewu.4g9.cn/qrcode.php?', 'https://wezchina.com/kezunping', 'https://image.wezchina.com/pages/article/1512481062602.png', 'kezunping', 175)
    //route
    //var isLogin; //判断用户登陆与否
    /*if(localStorage.getItem('title')=="" || localStorage.getItem('title')==null ||localStorage.getItem('title')==undefined || localStorage.getItem('title')=="null"){
         $.ajax({
            url: apiUrl+"cms/advs",
            type: 'get',
            success: function(data){
                if (data.code == 200){
                    $('title').text('圈子-' + data.data.setting.title + '官方微主页');
                   
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }else{
        $('title').text('圈子-' + localStorage.getItem('title') + '官方微主页');

    }*/
})
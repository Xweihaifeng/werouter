/**
* 页面度量单位rem初始化
**/
define(['zepto'],function($){
    return function(){
        function c(){
            var all_width=$(window).width();
            var all_height=$(window).height();
            fz = (all_width/750)*100;
            $('html').css({"fontSize":fz});
        }
        window.addEventListener('resize',c,!1);
        c();
        ucenterLogin();//神奇的登录机制
    }
});
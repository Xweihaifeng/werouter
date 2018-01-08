$(function(){
    // 导航开始
    $(".big-nav>li").mouseenter(function(){
        $(this).children(".nav-list").slideDown(300);
    })
    $(".big-nav>li").mouseleave(function(){
        $(this).children(".nav-list").slideUp(300);
    })
    // 导航结束
})
$(function(){
    // 分类列表点击
    $(".wemall-cat>li").click(function(){
        $(this).addClass("check_cur").siblings().removeClass("check_cur");
    })
})
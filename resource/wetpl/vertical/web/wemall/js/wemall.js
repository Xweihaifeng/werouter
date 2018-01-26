$(function(){
    // 分类列表点击
    $(".cat-nav>li").click(function(){
        $(this).addClass("check_cur").siblings().removeClass("check_cur");
    })
    // 滚动事件
    var Height=$(".wemall-cat").offset().top;
    $(window).scroll(function(){
        if($(document).scrollTop()>=Height){
            $(".wemall-cat").css({position:"fixed",top:0,left:0,zIndex:99,background:"#fff",borderBottom:"1px solid #dadada"});
            $(".cat-nav").css({border:"none"})
        }else{
            $(".wemall-cat").css({position:"relative",zIndex:1,background:"#F5F5F5",borderBottom:"none"});
            $(".cat-nav").css({border:"1px solid #D9D9D9"})
        }
    })
})
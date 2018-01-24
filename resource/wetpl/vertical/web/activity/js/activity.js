$(function(){
    // 分类列表点击
    $(".cate-list>li").click(function(){
        $(this).addClass("list").siblings().removeClass("list");
    })
    // 时间列表点击
    $(".time-list>li").click(function(){
        $(this).addClass("list").siblings().removeClass("list");
    })
    // 热门点击
    $(".hot-list>li").click(function(){
        $(this).addClass("hot").siblings().removeClass("hot");
    })

})
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

    // 光标离开事件
    $(document).on('focus', '#phone', function() {
        console.log($('.layui-layer').height());
        $('.sign_code').css('display', 'block');
        $('.sign_yz').css('display', 'block');
        $('.signBox .sign_section').css('height', '354px');
    });
    $(document).on('focus', '#username', function() {
        $('.sign_code').css('display', 'none');
        $('.sign_yz').css('display', 'none');
        $('.signBox .sign_section').css('height', '306px');
    });
    $(document).on('focus', '#zhiw', function() {
        $('.sign_code').css('display', 'none');
        $('.sign_yz').css('display', 'none');
        $('.signBox .sign_section').css('height', '306px');
    });
    $(document).on('focus', '#gongsi', function() {
        $('.sign_code').css('display', 'none');
        $('.sign_yz').css('display', 'none');
        $('.signBox .sign_section').css('height', '306px');
    });
    $(document).on('focus', '#gongsi', function() {
        $('.sign_code').css('display', 'none');
        $('.sign_yz').css('display', 'none');
        $('.signBox .sign_section').css('height', '306px');
    });

})
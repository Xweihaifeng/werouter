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
        if(docCookies.getItem("weid") != null && docCookies.getItem("token") != null){
            return;
        }else{
            console.log($('.layui-layer').height());
            $('.sign_code').css('display', 'block');
            $('.sign_yz').css('display', 'block');
            $('.signBox .sign_section').css('height', '354px');
        }

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

    // 滚动事件
    var Height=$(".project_t").offset().top;
    $(window).scroll(function(){
        // $("#acitivty-detail").css({paddingTop:0})
        if($(document).scrollTop()>=Height - 10){

            $(".pro-title").css({position:"fixed",top:0,left:"50%",zIndex:99,marginTop:0,marginLeft:"-580px",width:785,borderRight:"1px solid #C9C9C9",borderLeft:"1px solid #C9C9C9"});

        } else{

            $(".pro-title").css({position:"absolute",top:0,left:0,zIndex:1,marginTop:0,marginLeft:0,borderLeft:"none",borderRight:"none",width:783});


        }
    })

})
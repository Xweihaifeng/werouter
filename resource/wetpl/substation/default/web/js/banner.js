$(function(){
    // 商会新闻轮播开始
    var now=0;
    var t=setInterval(aa,6000);
    function aa(){
        now++;
        console.log(now)
        if(now==$(".banner li").length){
            now=0;
        }
        $(".banner li").animate({opacity:0.1,zIndex:1},0,function(){
            $(".yson").css({background:"#d9d9d9"})
        });
        $(".banner li").eq(now).animate({opacity:1,zIndex:2},200,function(){
            $(".yson").eq(now).css({background:"#fc114a"})
        });
    }
    //右按钮
    $(".btn-bR").click(function(){
        aa()
    })
    // 左按钮
    $(".btn-bL").click(function(){
        now--;
        if(now==-1){
            now=$(".banner li").length-1;
        }
        $(".banner li").animate({opacity:0.1,zIndex:1},0,function(){
            $(".yson").css({background:"#d9d9d9"})
        });
        $(".banner li").eq(now).animate({opacity:1,zIndex:2},200,function(){
            $(".yson").eq(now).css({background:"#fc114a"})
        });
    })
    $(".s1-lbleft").mouseenter(function(){
        clearInterval(t)
    })
    $(".s1-lbleft").mouseleave(function(){
        t=setInterval(aa,4000);
    })

    // 商会新闻轮播结束
})
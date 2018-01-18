$(function(){
    // 图片轮播开始
    var now=0;
    function aa(){
        $(".btnL").attr("title","上一张")
        now++;
        if(now==$(".img-big li").length){
            now=$(".img-big li").length-1;
            $(".btnR").attr("title","已经是最后一张了")
        }else{
            $(".btnR").attr("title","下一张")
        }
        $(".img-big li").animate({opacity:0.1,zIndex:1},0);
        $(".img-big li").eq(now).animate({opacity:1,zIndex:2},200);
    }
    //右按钮
    $(".btnR span").click(function(){
        aa()
    })
    // 左按钮
    $(".btnL span").click(function(){
        $(".btnR").attr("title","下一张")
        now--;
        if(now==-1){
            now=0;
            $(".btnL").attr("title","已经是第一张了，没有了")
        }else{
            $(".btnL").attr("title","上一张")
        }
        $(".img-big li").animate({opacity:0.1,zIndex:1},0);
        $(".img-big li").eq(now).animate({opacity:1,zIndex:2},200);
    })
    // 图片轮播结束
    $(".hd").html($(".img-big").html())
})
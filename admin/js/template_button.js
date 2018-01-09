$(function () {
    if (!show) {
        var show = 1;
    }
    $(".but").click(() => {
        if (show == 1) {
            $(".but").animate({left: -40}, 600);
            $(".hidde").slideDown();
            show = 2;
        } else {
            $(".but").animate({left: 0}, 600);
            $(".hidde").slideUp();
            show = 1;
        }
    })

    $(".form-top > li").each((i, v) => {
        $(v).click(() => {
            if(i==1){
                    javascript:introJs().start();
            }
            $(v).addClass("shown").siblings().removeClass("shown");
            $(".form-child > li").eq(i).addClass("block").siblings().removeClass("block");
        })
    })
    $("#updateSet2").click(()=>{
        $(".module").removeClass("block");
        $(".module_li").addClass("block");
    })


})
$(function () {
    //导航
    var arr = [];
    $(".nav_list > li").click(function () {
        let index = $(".nav_list > li").index(this)
        let fool1 = $(".program").offset().top;
        let fool2 = $(".basis").offset().top;
        let fool3 = $(".application").offset().top;
        let fool4 = $(".object").offset().top;
        let fool5 = $(".saas").offset().top;
        let fool6 = $(".case").offset().top;
        arr.push(fool1);
        arr.push(fool2);
        arr.push(fool3);
        arr.push(fool4);
        arr.push(fool5);
        arr.push(fool6);
        $("html,body").stop().animate({scrollTop: (arr[index]-40)}, 300)
    })
    $(document).scroll(function () {
        let top = $(document).scrollTop();
        if (440 <= top) {
            $("#header").css({"display":"none"});
            $(".nav3").addClass("fixed");
            $(".main").css({"background": "#fff","box-shadow": "0px 1px 5px #e0e0e0"});
            $(".nav_list li span").css({"color": "#333"});
            $(".nav_title").css({"opacity": 1})
            if( top <arr[0]){
                $(".nav_list > li:nth-of-type(1)").children("span").addClass("spans").end().siblings().children("span").removeClass("spans");
                $(".nav_list > li:nth-of-type(1)").addClass("span").siblings().removeClass("span");
            }else if( top < arr[1] ){
                $(".nav_list > li:nth-of-type(2)").children("span").addClass("spans").end().siblings().children("span").removeClass("spans");
                $(".nav_list > li:nth-of-type(2)").addClass("span").siblings().removeClass("span");
            }else if( top < arr[2]){
                $(".nav_list > li:nth-of-type(3)").children("span").addClass("spans").end().siblings().children("span").removeClass("spans");
                $(".nav_list > li:nth-of-type(3)").addClass("span").siblings().removeClass("span");
            }else if(top < arr[3]){
                $(".nav_list > li:nth-of-type(4)").children("span").addClass("spans").end().siblings().children("span").removeClass("spans");
                $(".nav_list > li:nth-of-type(4)").addClass("span").siblings().removeClass("span");
            }else if(top <arr[4]){
                $(".nav_list > li:nth-of-type(5)").children("span").addClass("spans").end().siblings().children("span").removeClass("spans");
                $(".nav_list > li:nth-of-type(5)").addClass("span").siblings().removeClass("span");
            }else if((arr[5]-40) <= top){
                $(".nav_list > li:nth-of-type(6)").children("span").addClass("spans").end().siblings().children("span").removeClass("spans");
                $(".nav_list > li:nth-of-type(6)").addClass("span").siblings().removeClass("span");
            }
            $(".nav_list > li >span").hover(
                function () {
                    $(this).addClass("hot");
                },function () {
                    $(this).removeClass("hot")
                })
        } else{
            $("#header").css({"display":"block"});
            $(".nav3").removeClass("fixed");
            $(".main").css({"background": "rgba(104,123,126,0.5)","box-shadow": "0px 0px 0px #e0e0e0"});
            $(".nav_list li span").css({"color": "#fff"}).removeClass("spans")   ;
            $(".nav_list li").removeClass("span");
            $(".nav_title").css({"opacity": 0})
            $(".nav_list > li > span").hover(
                function () {
                $(this).addClass("hote");
                $(this).removeClass("hot")

                },function () {
                $(this).removeClass("hote")
            })
        }

    })

//    应用场景 nav
    $(".application_nav > li ").click(function () {
        let index = $(".application_nav > li ").index(this);
        $(this).siblings().removeClass("active")
        $(this).addClass("active")
    })

    // object
    $(".object_coc > li").hover(
        function () {
            $(this).css({"border": "1PX solid #D32720"})
        }, function () {
            $(this).css({"border": "1PX solid #D9D9D9"})
        }
    )


})
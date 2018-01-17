$(function () {
    $(document).scroll(function () {
        var tops = $(document).scrollTop();
        if(tops >= 338){
            $(".toptop").addClass("fixeds")
            $(".diss").css({"display":"none"})
        }else {
            $(".toptop").removeClass("fixeds")
            $(".diss").css({"display":"block"})
        }
    })

})
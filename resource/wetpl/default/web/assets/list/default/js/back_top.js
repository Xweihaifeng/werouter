/*
 *     回到顶部1
 */
$(function() {
    $("#plat-two-back-top").fadeOut();
    $(window).scroll(function() {

        if($(window).scrollTop() > 400) {
            $("#plat-two-back-top").fadeIn();
        } else {
            $("#plat-two-back-top").fadeOut();
        }
    });
    $("#plat-two-back-top").click(function() {
        $('body').animate({
            scrollTop: 0
        }, 200); 
    });
});

//回到顶部
$(function() {
    $(".details-content").scroll(function() {
        if($(".details-content").scrollTop() >= 100) {
            $("#plat-two-back-top").fadeIn();
        } else {
            $("#plat-two-back-top").fadeOut();
        }
    });
    $("#plat-two-back-top").click(function() {
        $('.details-content').animate({
            scrollTop: 0
        }, 200);
    })
})
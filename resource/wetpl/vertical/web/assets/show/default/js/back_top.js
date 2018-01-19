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

    $('.page-content').height($(window).height() + 'px');
    
    $(window).resize(function() {
        $('.page-content').height($(window).height() + 'px');

    });
});

//回到顶部
$(function() {
    $(".page-content").scroll(function() {
        if($(".page-content").scrollTop() >= 100) {
            $("#plat-two-back-top").fadeIn();
        } else {
            $("#plat-two-back-top").fadeOut();
        }
    });
    $("#plat-two-back-top").click(function() {
        $('.page-content').animate({
            scrollTop: 0
        }, 200);
    })
})
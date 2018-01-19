/*
 *     回到顶部1
 */
$(function() {
    $("#plat-two-back-top").hide();
    $(window).scroll(function() {

        if($(window).scrollTop() > 400) {
            $("#plat-two-back-top").show();
        } else {
            $("#plat-two-back-top").hide();
        }
    });
    $("#plat-two-back-top").click(function() {
        $('body').animate({
            scrollTop: 0
        }, 200); 
    });

    $('.details-content').height($(window).height() + 'px');
    
    $(window).resize(function() {
        $('.details-content').height($(window).height() + 'px');

    });
});

//回到顶部
$(function() {
    $(".details-content").scroll(function() {
        if($(".details-content").scrollTop() >= 100) {
            $("#plat-two-back-top").show();
        } else {
            $("#plat-two-back-top").hide();
        }
    });
    $("#plat-two-back-top").click(function() {
        $('.details-content').animate({
            scrollTop: 0
        }, 200);
    })
})
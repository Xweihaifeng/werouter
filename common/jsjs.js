$(function () {
    $(".content_left > li").click(function () {
        $(this).children("a").addClass('about').end().siblings().children("a").removeClass('about')
    })
})
$(function(){
    // 放大镜插件
    // var zoomfun = function() {
    //     $(".jqzoom").jqueryzoom({
    //         xzoom: 200, //放大图的宽度(默认是 200)
    //         yzoom: 200, //放大图的高度(默认是 200)
    //         offset: 10, //离原图的距离(默认是 10)
    //         position: "right", //放大图的定位(默认是 "right")
    //         preload: 1,
    //         magnify: 0.5
    //     });
    // }
    // zoomfun();

    // 滚动事件
    var Height=$(".pro_deta_tab").offset().top;
    $(window).scroll(function(){
        if($(document).scrollTop()>=Height-50){
            $(".pro_deta_tab").css({position:"fixed",top:0,left:"50%",zIndex:99,marginTop:0,marginLeft:"-585px"});
        }else{
            $(".pro_deta_tab").css({position:"relative",top:0,left:0,zIndex:1,marginTop:"30px",marginLeft:0});
        }
    })

})
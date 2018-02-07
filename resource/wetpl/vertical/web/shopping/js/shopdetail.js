$(function(){
    // 滚动事件
    var Height=$(".pro_deta_tab").offset().top;
    $(window).scroll(function(){

        if($(document).scrollTop()>=Height-20){
            console.log(111111)
            $(".pro_deta_tab").css({width:820,position:"fixed",top:0,left:"50%",zIndex:99,marginTop:0,marginLeft:"-585px"});
            $(".pro_det").css({marginTop:68})
        }else{
            // $("#menu").css({position:"relative"})
            $(".pro_det").css({marginTop:0})
            $(".pro_deta_tab").css({position:"relative",top:0,left:0,zIndex:1,marginTop:"30px",marginLeft:0,width:"100%"});
        }
    })

})
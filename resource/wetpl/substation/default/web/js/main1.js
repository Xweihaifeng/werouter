$("#content_app").ready(function(){
    setTimeout(function(){
        // 浙商风采开始
        var b=setInterval(bb,20);
        function bb(){
            var speed=1;
            var Lefts=$(".fc1").position().left-speed;
            var Lefts2=$(".fc2").position().left-speed;
            if(Lefts2==0 || Lefts<-1230){
                $(".fc1").css({left:1230,zIndex:1})
            }else{
                $(".fc1").css({left:Lefts,zIndex:4})
            }
            if(Lefts==0 || Lefts2<-1230){
                $(".fc2").css({left:1230,zIndex:1})
                console.log("fc2")
            }else{
                $(".fc2").css({left:Lefts2,zIndex:4})
            }
        }
        $(".fc-right").mouseenter(function(){
            clearInterval(b)
        })
        $(".fc-right").mouseleave(function(){
            b=setInterval(bb,20)
        })
        // 浙商风采结束
    },2000);


})

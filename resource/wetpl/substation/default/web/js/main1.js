$("#content_app").ready(function() {
    setTimeout(function(){
        var len = $(".fc1").children("li").length;
        $(".fc2").css({ left: len + 'px' });
        // 浙商风采开始
        var b;
        if($(".fc1").position()) {
            b = setInterval(bb, 20);
        }

        function bb() {
            var speed = 1;
            var Lefts = $(".fc1").position().left - speed;
            var Lefts2 = $(".fc2").position().left - speed;

            if(Lefts2 == 0 || Lefts <- 195 * len) {
                $(".fc1").css({ left: 195 * len, zIndex: 1 })
            } else {
                $(".fc1").css({ left:Lefts, zIndex:4 })
            }

            if(Lefts == 0 || Lefts2 <- 195 * len) {
                $(".fc2").css({ left: 195 * len, zIndex: 1 })
            } else {
                $(".fc2").css({ left: Lefts2, zIndex: 4 })
            }
        }

        $(".fc-right").mouseenter(function() {
            clearInterval(b)
        })

        $(".fc-right").mouseleave(function() {
            b = setInterval(bb, 20);
        })

    }, 1500);
})

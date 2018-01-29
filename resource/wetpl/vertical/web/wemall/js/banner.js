$.carousel = {
    now : 0,
    hasStarted : false,
    interval : null,
    liItems : null,
    len : 0,
    bBox : null,

    startPlay : function(bannnerBox,btnBox) {
         console.log(bannnerBox)
        //初始化对象参数
        var that = this;
        this.liItems = $(bannnerBox).find('.adv-list').find('li');
        this.len = this.liItems.length;
        this.bBox = $(bannnerBox).find(btnBox);
        //让第一张图片显示，根据轮播图数量动态创建指示器，并让第一个指示器处于激活状态，隐藏前后按钮
        this.liItems.first('li').css({'left': 0, 'z-index': 2}).siblings('a').css({'left':"100%", 'z-index': 0});
        //鼠标移入banner图时，停止轮播并显示前后按钮，移出时开始轮播并隐藏前后按钮
        $(bannnerBox).hover(function (){
            that.stop();
            that.bBox.fadeIn(200);
        }, function (){
            that.start();
            that.bBox.fadeOut(200);
        });

        //点击左右按钮时显示上一张或下一张
        $(btnBox).find('.btnL').click(function(){that.next()});
        $(btnBox).find('.btnR').click(function(){that.prev()});
        //开始轮播
        this.start()
    },
    //前一张函数
    prev : function (){
        var out = this.now;
        this.now = (--this.now + this.len) % this.len;
        this.play(out, this.now);
    },
    //后一张函数
    next : function (){
        var out = this.now;
        this.now = ++this.now % this.len;
        this.play(out, this.now);
    },
    play : function (out, now){
        this.liItems.css({left:"100%",'z-index':0});
        this.liItems.eq(out).stop().animate({left:"-100%",'z-index':1},500).end().eq(now).stop().animate({left:0,'z-index':1},500);
    },
    //开始函数
    start : function(){
        if(!this.hasStarted) {
            this.hasStarted = true;
            var that = this;
            this.interval = setInterval(function(){
                that.next();
            },5000);
        }
    },
    //停止函数
    stop : function (){
        clearInterval(this.interval);
        this.hasStarted = false;
    }
};

$(function(){
    $(".wemall-son").each((index,value) => {
        var banner='#wemall-clist' + index;
        var btn="#btn" + index
        $.extend(true,{},$.carousel).startPlay(banner,btn);
        })
})
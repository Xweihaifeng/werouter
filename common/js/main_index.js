/*! index.js2016-12-08 */

$(function(){
	var page2B = true;
	var P3B = true;
	var $ww=0;
	var $hh= 0;	
    function autoScrolling(){
    	if(header_scroll == 'no')
    	{
    		return false;
    	}
        $ww = $(window).width();
        $hh = $(window).height();
		if ($hh<500){
			$hh = 500
		}else if ($hh>992){
			$hh = 992
		}
		$(".slide .info").each(function(){
			$(this).css("margin-top",($hh - $(this).outerHeight())/2 - 105 + "px")
		});
		$(".page1").css({"height":$hh+"px","overflow":"hidden"})
		$(".banner").css({"width":$(".slide").length*$ww + "px","height":$hh + "px"})
		$(".slide").css({"width":$ww + "px","height":$hh + "px","float":"left"})
		if($(document).scrollTop()>100){
			$(".head").removeClass("headt");
			$(".sing_in .dis").addClass("none");
			$(".sing_in .sing_out").removeClass("none");
		}else{
			$(".head").addClass("headt");
			$(".sing_in .dis").removeClass("none");
			$(".sing_in .sing_out").addClass("none")
		}
		if($(document).scrollTop()>950){
			$(".head").addClass("box_shadow");
		}else{
			$(".head").removeClass("box_shadow");
		}
    }
    autoScrolling();
	$(window).scroll(autoScrolling);	
    $(window).resize(autoScrolling);	
    
	/*page1*/
	var p1Num = 0;
	var p1Timer = null;
	var p1Len = $(".slide").length;
	var p1Html = "<p class='p1_btn'></p>";
	$(".page1").append("<a>")
	$(".page1").append(p1Html)
	for (var i=0;i<p1Len ;i++ )
	{
		$(".page1 .p1_btn").append("<span></span>")
	}

	function p1Fn(n){
		$(".banner").animate({"left":-n * $ww + "px"});
		$(".page1 .p1_btn span").eq(n).animate({"opacity":0.8}).siblings().animate({"opacity":0.3});
	}
	p1Fn(0)
	p1Timer = setInterval(function(){
		p1Num++;
		if (p1Num>=$(".slide").length)
		{
			p1Num = 0;
		}
		p1Fn(p1Num);
	},6000);
	
	$(".page1").on("mouseenter",".p1_btn span",function(){
		clearInterval(p1Timer)
	}).on("mouseleven",function(){
		p1Timer = setInterval(function(){
			p1Num++;
			if (p1Num>=$(".slide").length)p1Num = 0;
			p1Fn(p1Num);
		},6000);
	})
	$(".page1").on("click",".p1_btn span",function(){
		p1Num = $(this).index();		
		p1Fn(p1Num);
	})
	$(".page1 .arrow_btn.l").click(function(){
		p1Num--;
		if (p1Num<0)p1Num = $(".slide").length-1;
		p1Fn(p1Num);
	})
	$(".page1 .arrow_btn.r").click(function(){
		p1Num++;
		if (p1Num>=$(".slide").length)p1Num = 0;
		p1Fn(p1Num);
	})
	/*page2*/
    var page2Num = 0;
    var page2Timer = setInterval(page2Fn,2000);
    var pro_sc_pcs = $(".pro_sc .psc");
    var pro_sc_length = pro_sc_pcs.length;
    var flag_amni = false;
    var amni_stop = null;
    function page2Fn(){
        pro_sc_pcs.removeClass("hover").find("em").removeClass("animated  fadeInDown");
        pro_sc_pcs.eq(page2Num).addClass("hover").find("em").addClass("animated  fadeInDown");
        page2Num = page2Num >= pro_sc_length - 1 ? 0 : ++page2Num;
    }
    pro_sc_pcs.on("mouseover",function(){
        var This = $(this)
        clearInterval(page2Timer)
        page2Num = This.index();
        pro_sc_pcs.removeClass("hover").find("em").removeClass("animated  fadeInDown");
        This.addClass("hover").find("em").addClass("animated  fadeInDown");
        if(!flag_amni){
            flag_amni = true;
            amni_stop = This.find(".info")
            amni_stop.fadeIn(500,function(){
                flag_amni = false;
            });
        }

    }).mouseleave(function(){
        var This = $(this)
        amni_stop.stop();
        This.find(".info").hide();
        flag_amni = false;
        This.removeClass("hover").find("em").removeClass("animated  fadeInDown");
        clearInterval(page2Timer)
        page2Timer = setInterval(page2Fn,2000);
    })
	/**/
	var s= true;
	var p3num = 0;
	var p3Timer = setInterval(function(){
		p3num ++;
		if (p3num>$(".page3 .right a").length-1)p3num=0;
		P3Play(p3num)
	},4000)
	function P3Play(n,fn){		
		if (n <=$(".page3 .right a").length-1 )
		{
			$(".phone li.active").animate({"left":"-169px"})
			$(".pc li.active").animate({"left":"-652px"})
		}
		$(".page3 .right a").removeClass("active").eq(n).addClass("active")
		$(".phone li").css("z-index",1).removeClass("active").eq(n).css("z-index",2).animate({"left":0},function(){
			$(".phone li").eq(n).addClass("active");
			$(".phone li.active").siblings().css("left","169px");
		})
		$(".pc li").css("z-index",1).removeClass("active").eq(n).css("z-index",2).animate({"left":0},function(){
			$(".pc li").eq(n).addClass("active");
			$(".pc li.active").siblings().css("left","652px");
			fn && fn();
		})
	}
	$(".page3 .right a").on("click",function(){	
		var _index  = $(this).index();
		if (s)
		{
			if(_index != p3num){
				s=false;
				P3Play(_index,function(){
					s=true;
					p3num = _index;
				})
			}
		}
	});
	$(".page3 .right a").on("mouseenter",function(){
		clearInterval(p3Timer)
	}).mouseleave(function(){
		p3Timer = setInterval(function(){
			p3num ++;
			if (p3num>$(".page3 .right a").length-1)p3num=0;
			P3Play(p3num)
		},4000)
	})
	
	/*最新动态*/
	$(".ct_warp li").on("mouseenter",function(){
		$(this).addClass("hover")
	}).mouseleave(function(){
		$(this).removeClass("hover")
	});
	var ct_Len = $(".ct_warp li").length;

	var ct_Num = 0;
	var ct_row = Math.ceil(ct_Len/3);
	var stHtml = '<a href="javascript:;" class="p4_arrow l"></a><a href="javascript:;" class="p4_arrow r"></a><p class="arrow_point"></p>'
	$(".consultaion").append(stHtml);
	$(".ct_warp ul").css("width",ct_Len * ($(".ct_warp li").eq(0).outerWidth()+50)+"px")
	for (var i=0;i<ct_row ;i++ )
	{
		$(".consultaion .arrow_point").append("<span></span>")
	}
	$(".consultaion .arrow_point span").eq(0).addClass("active")
	function ct_Fn(n){
		$(".ct_warp ul").animate({"left":12-n*3*($(".ct_warp li").eq(0).outerWidth()+42)+"px"});
		$(".consultaion .arrow_point span").removeClass("active").eq(n).addClass("active")
	}
	// var ct_Timer = setInterval(function(){
	// 	ct_Num++;
	// 	if(ct_Num>=ct_row)ct_Num=0;
	// 	ct_Fn(ct_Num)
	// },1000)
	$(".consultaion .arrow_point").on("click","span",function(){
		ct_Num = $(this).index();
		ct_Fn(ct_Num)
	})
	// $(".consultaion").mouseenter(function(){
	// 	clearInterval(ct_Timer)
	// }).mouseleave(function(){
	// 	ct_Timer = setInterval(function(){
	// 		ct_Num++;
	// 		if(ct_Num>=ct_row)ct_Num=0;
	// 		ct_Fn(ct_Num)
	// 	},8000)
	// })
	$(document).on("click",".consultaion .p4_arrow.l",function(){
		ct_Num--;
		if(ct_Num<0)ct_Num=ct_row-1;
		ct_Fn(ct_Num)
	})
	$(document).on("click",".consultaion .p4_arrow.r",function(){
		ct_Num++;
		if(ct_Num>=ct_row)ct_Num=0;
		ct_Fn(ct_Num)
	})

	/*//文字超出隐藏*/
	$.fn.extend({ 
		displayPart:function (n) { 
			var displayLength = n; 
			displayLength = this.attr("displayLength") || displayLength; 
			var text = this.text(); 
			if (!text) return ""; 

			var result = ""; 
			var count = 0; 
			for (var i = 0; i < displayLength; i++) { 
			var _char = text.charAt(i); 
			if (count >= displayLength) break; 
			if (/[^x00-xff]/.test(_char)) count++; //双字节字符，//[u4e00-u9fa5]中文 

			result += _char; 
			count++; 
			} 
			if (result.length < text.length) { 
			result += "..."; 
			} 
			this.text(result); 
		} 
	}); 
	$(".displayPart").each(function(index,item){
		$(this).displayPart(87); 
	})
});	
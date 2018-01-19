$.fn.tab=function(options){
	var defaults={
		trigger: ".control a",
		response: ".image a",
		action: "mouseover",
		onstart: true
	};
	var opts=$.extend(defaults,options);
	var _this=this;
	$(opts.trigger,_this).each(function(i){
		$(this).bind(opts.action,function(){
			$(this).addClass("active").siblings().removeClass("active");
			$(opts.response,_this).eq(i).show().siblings().hide();
		});
	});
	if(opts.onstart) $(opts.trigger+":first",this).trigger(opts.action);
};
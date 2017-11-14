/**
 * Created by weifeng on 2017/11/12.
 */

$(function() {

    var token = window.localStorage.getItem('token');
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

	// 商城详情内容轮播
	var mySwiper = new Swiper('#detail_swiper_img', {
		direction: 'horizontal',
		loop: true,
		speed: 1000,
		autoplay: 5000,
		autoplayDisableOnInteraction: false,
		pagination: '.detail_pagination',
		paginationClickable: true,
		grabCursor: true
	})

	$(".detail_selected_switch").click(function() {
		$(".detail_address_mask").fadeIn("slow");
		$(".detail_rddress_mask_content").animate({
		    height: "70%",
		}, "slow", function() {
			$(".detail_rddress_mask_content").show();
		});
	});

	$(".detail_mask_close").click(function() {
		$(".detail_address_mask").fadeOut("slow");				
		$(".detail_rddress_mask_content").animate({
		    height: "0",
		}, "slow", function() {
			$(".detail_rddress_mask_content").hide();
		});
	});

	var options1 = $.get("http://new.wezchina.com/api/goods/detail/80ecd160-b306-11e7-9ae5-5be3accfa823");
	options1.done(function(data) {
		console.log(data)
	});
});
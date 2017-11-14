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

	var detail_title = function(result) {
		var template = `
		<slide class="detail_title_h1">
			<span class="detail_title_text">`+ result.title +`</span>
		</slide>
		<slide class="detail_price">
			<div class="detail_price_count">￥<span>`+ result.price +`</span></div>
			<div class="detail_price_cut"><button>降价通知</button></div>
		</slide>
		<slide class="detail_art">
			<div>`+ result.note +`<a href="#"> 点击查看详情 </a></div>
		</slide>`
		return template;
	}

	var detail_swiper = function(result) {
		var price = result.picture.split(","), temp_img = '';
		$.each(price, function(index, value) {

			if(!value) {
                value = "/common/img/news_top_img.png";

            } else if (value.indexOf('http') != 0 && value != "") {
                value = imgSet(value, 414, 408, 3);
            }

			temp_img += `
				<div class="swiper-slide">
					<img src="`+ value +`" alt="" />
				</div>`;
		});
		var template = `
		<div class="swiper-container" id="detail_swiper_img">
			<div class="swiper-wrapper carousel">`+ temp_img +`</div>
			<div class="swiper-pagination detail_pagination"></div>
		</div>`
		return template;
	}

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

	var options1 = $.get(GOODS_DETAIL + "/21aea730-abec-11e7-a919-9b1d4a41c921");
	options1.done(function(data) {
		console.log(data)
		if(data.code != 200) {
			return false;
		}

		var result = data.data;
		$(".detail_title").html(detail_title(result));

		$(".detail_swiper").html(detail_swiper(result));
		
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

	});
	options1.fail(function(error) {
		console.error(error);
	});
});
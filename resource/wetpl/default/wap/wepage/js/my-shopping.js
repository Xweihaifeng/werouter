/**
 * Created by weifeng on 2017/11/2.
 */

var shop = [], number = 1, domain, plat_user_id;
var token = window.localStorage.getItem('token');
var user_weid = window.localStorage.getItem("user_weid");

if(token) {
    $.ajaxSetup({
        global: true,
        async:  false,
        headers: {
            'Token': token,
        }
    });
}

var options_0 = $.get(apiUrl + "pages/page/getDetailByUser/" + window.localStorage.getItem("user_weid"));
options_0.done(function(data) {
	if(data.code == 200) {
		var result = data.data;
		domain = result.domain;
		console.log(result);
	} else {
		console.warn(data.message);
	}
});
options_0.fail(function(error) {
	console.error(error);
})

var options_1 = $.get(apiUrl + "pages/page/getDetailByDomain/" + domain);
options_1.done(function(data) {
	if(data.code == 200) {
		var result = data.data;
		plat_user_id = result.plat_user_id;
		console.log(result);
	} else {
		console.warn(data.message);
	}
});
options_1.fail(function(error) {
	console.error(error);
})

var mySwiper = new Swiper ('#my-swiper', {
	direction: 'horizontal',
	loop: true,
	speed: 1000,
	autoplay : 3000,
	autoplayDisableOnInteraction : false,
	pagination: '.swiper-pagination',
	paginationClickable :true,
	nextButton: '.swiper-button-next',
	prevButton: '.swiper-button-prev',
	grabCursor : true
})

$("#my-swiper").hover(function(){
	$(".swiper-button-prev, .swiper-button-next").css("opacity", "0.6");
}, function(){
	$(".swiper-button-prev, .swiper-button-next").css("opacity", "0");
});

function shopping_classify() {
	var option_one = $.get(apiUrl + "goods/cates/list");
	option_one.done(function(data) {
	    if(data.code == 200) {
	        var result = data.data;
	        $.each(result, function(index, value) {
	            $("#shop_type").append(`<li id="`+ value.weid +`">`+ value.name +`</li>`);
	        });
	    } else {
	        console.warn(data.message);
	    }
	})	
}
shopping_classify();

function shopping_list() {
	var first_weid = $("#shop_type li").first().attr("id");
	var body = {};

	body.userId = plat_user_id;

	var options_two = $.post(apiUrl + "goods/lists/user", body);
	options_two.done(function(data) {
		if(data.code == 200) {
			var result = data.data.list;
			$.each(result, function(index, value) {
				shop.push(value);
			});
		} else {
			console.warn(data.message);
		}
	});
	options_two.fail(function(error) {
		console.error(error);
	});
}
shopping_list();

const my_shopping = {shop: shop};
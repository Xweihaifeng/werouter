/**
 * Created by weifeng on 2017/11/2.
 */

// 公用部分变量声明
var shop = [], number = 1, domain, plat_user_id;
var token = window.localStorage.getItem('token');
var user_weid = window.localStorage.getItem("user_weid");

// 用户token验证部分
if(token) {
    $.ajaxSetup({
        global: true,
        async:  false,
        headers: {
            'Token': token,
        }
    });
}

// Pages - 主页 - 详情(用户ID)
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

// Pages - 主页 - 详情(域名)
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

// 商城首页置顶轮播
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

// 置顶轮播移入显示左右切换按钮
$("#my-swiper").hover(function(){
	$(".swiper-button-prev, .swiper-button-next").css("opacity", "0.6");
}, function(){
	$(".swiper-button-prev, .swiper-button-next").css("opacity", "0");
});

// Mall - 分类 - 列表(根据用户)
function shopping_classify() {
	var option_one = $.get(apiUrl + "goods/cates/listsbyuser/" + user_weid);
	option_one.done(function(data) {
	    if(data.code == 200) {
	        var result = data.data;
	        console.info("商品分类：", result);
	        $.each(result, function(index, value) {
	            $("#shop_type").append(`<li id="`+ value.weid +`">`+ value.name +`</li>`);
	        });
	    } else {
	        console.warn(data.message);
	    }
	})	
}
shopping_classify();

// Mall - 商品 - 用户商品列表
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

// 申明全局函数调用常量
const my_shopping = {shop: shop};
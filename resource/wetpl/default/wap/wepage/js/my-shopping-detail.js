/**
 * Created by weifeng on 2017/11/12.
 */

$(function() {

    var token = window.localStorage.getItem('token');
    var user_weid = window.localStorage.getItem("user_weid");
    var weid = "21aea730-abec-11e7-a919-9b1d4a41c921";

    if(token) {
        $.ajaxSetup({
            global: true,
            async:  false,
            headers: {
                'Token': token,
            }
        });
        $("#token").slideUp();
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

	var options1 = $.get(GOODS_DETAIL + "/" + weid);
	options1.done(function(data) {
		console.log("商品详情：", data)
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

	$(".detail_footer_join").click(function() {
		var body = {
			goods_id : weid,
			goods_num: 1
		}
		var options2 =  $.post(apiUrl + "cart/store", body);
		options2.done(function(data) {
			console.log(data);
			if(data.code != 200) {
				layer.msg(data.message, { time: 1500 });
				return false;
			}
			layer.msg("成功加入购物车", { time: 1500 });
		});
		options2.fail(function(error) {
			console.error(error);
		});
	})





	// 商品保存开始
	$(".detail_icon_img_menu").click(function() {
		$(".save_shopping").slideToggle("slow");
	})

	$(".detail_preservate_switch").click(function() {
		$(".detail_shop_classify").slideToggle("slow");
	});

	$(".detail_save_token").click(function() {
		window.localStorage.setItem("token", $(".detail_token").val());
		layer.msg("token已经保存", { time: 1500 });
		token = window.localStorage.getItem('token');

        $.ajaxSetup({
            global: true,
            async:  false,
            headers: {
                'Token': token,
            }
        });

        $("#token").slideUp();
	})

	$(".detail_save_weid").click(function() {
		window.localStorage.setItem("user_weid", $(".detail_weid").val());
		layer.msg("user_weid保存成功", { time: 1500 });
		$("#user_weid").slideUp();
	})

	$("#detail_mySelect").change(function() { SelectChange(); });

    function SelectChange() {
        var selectText = $("#detail_mySelect").find("option:selected").text();
        get_weid = $("#detail_mySelect").val();
    }

	function classify() {
		$("#detail_mySelect option:gt(0):not()").remove();
		var optionss = $.get(apiUrl + "goods/cates/listsbyuser/" + user_weid);
		optionss.done(function(data0) {
			if(data0.code != 200) {
				layer.msg(data0.message, { time: 1500 });
				return false;
			}

			$.each(data0.data, function(index, value) {
				$("#detail_mySelect").append("<option value="+ value.weid +" sort="+ value.sort +">"+ value.name +"</options>");
			});

			SelectChange();
		});
		optionss.fail(function(error) {
			console.log(error);
		});
	}
	if(user_weid) {
		$("#user_weid").slideUp();
		classify();
	}

	$(".detail_sort_button").click(function() {
		var body1 = {}, get_weid;
		body1.name = $(".detail_save_s").val();
		body1.sort = $(".detail_save_0").val();

		var options = $.post(apiUrl + "goods/cates/store", body1);
		options.done(function(data) {
			console.log("分类：", data);
			if(data.code == 200) {
				if(data.data >= 0) {
					layer.msg("商品分类保存成功", { time: 1500 });
				} else {
					layer.msg("商品分类保存失败", { time: 1500 });
				}				
				classify();
			} else {
				layer.msg(data.message, { time: 1500 });
				return false;				
			}
		});
		options.fail(function(error) {
			console.error(error);
		});		
	})

	$(".detail_save_button").click(function() {
		var body = {}

		body.cate_id 		= get_weid;
		body.title 			= $(".detail_save_2").val();
		body.price 			= $(".detail_save_3").val();
		body.marketprice 	= $(".detail_save_4").val();
		body.views 			= $(".detail_save_5").val();
		body.collections 	= $(".detail_save_6").val();
		body.cover 			= $(".detail_save_7").val();
		body.picture 		= $(".detail_save_8").val().split(",");
		body.summary 		= $(".detail_save_9").val();
		body.note 			= $(".detail_save_10").val();
		body.content 		= $(".detail_save_11").val();
		body.sort 			= $(".detail_save_12").val();
		body.stock 			= $(".detail_save_13").val();

		if(!body.cate_id) {
			layer.msg("选择商品分类", { time: 1500 });
			return false;
		}
		var options0 = $.post(apiUrl + "goods/store", body);
		options0.done(function(data) {
			if(data.code != 200) {
				layer.msg(data.message, { time: 1500 });
				return false;
			}

			layer.msg("商品保存成功", { time: 1500 });
			$(".save_shopping").slideToggle("slow");
		});
	})
	// 商品保存结束
});
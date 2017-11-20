/**
 * Created by weifeng on 2017/11/12.
 */

$(function() {

    // 公用部分变量声明
    var token = window.localStorage.getItem('token');
    var user_weid = window.localStorage.getItem("weid");
    var shop_weid = window.location.pathname.split('/').pop();
    // var shop_weid = window.localStorage.getItem("shopping_weid");

    // 用户token验证部分
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

    // 商品评价跳转
    $(".detail_nav_title").html(`
        <a href="javascript:void(0)"> 商品 </a>
        <a href="javascript:void(0)"> 详情 </a>
        <a href="/shopping/store/`+ shop_weid +`"> 评价 </a>`);
    $(".detail_evaluate_switch").attr("href", `/shopping/store/`+ shop_weid +``);

    // 商品描述开始
    var detail_title = function(result) {
        var template = `
        <slide class="detail_title_h1">
            <span class="detail_title_text">`+ result.title +`</span>
        </slide>
        <slide class="detail_price">
            <div class="detail_price_count">￥<span>`+ result.price +`</span></div>
            <div class="detail_price_cut" style="display: none"><button>降价通知</button></div>
        </slide>
        <slide class="detail_art">
            <div>`+ result.note +`<a href="#"> 点击查看详情 </a></div>
        </slide>`
        return template;
    }

    // 商品详情页置顶轮播
    var detail_swiper = function(result) {
        var price = result.picture.split(","), temp_img = '';
        $.each(price, function(index, value) {

            if(!value) {
                value = "/common/img/img9.jpg";

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

    // 商品评论开始
    var detail_evaluate = function(result) {
        var price = result.picture.split(","), temp_img = '';
        $.each(price, function(index, value) {

            if(!value) {
                value = "/common/img/img6.png";

            } else if (value.indexOf('http') != 0 && value != "") {
                value = imgSet(value, 88, 88, 3);
            }

            temp_img += `
                <div><img src="`+ value +`" alt="" /></div>`;
        });
        var template = temp_img;
        return template;
    }

    var detail_set_meal = function(result) {
        var temp_img = result.cover;
        if(!temp_img) {
            temp_img = "/common/img/img6.png";

        } else if (temp_img.indexOf('http') != 0 && temp_img != "") {
            temp_img = imgSet(temp_img, 88, 88, 3);
        }

        var template = `<img src="`+ temp_img +`" alt="">`
        return template;
    }

    var shop_eval_all = function(result) {
        var template = `
        <div class="detail_evaluate_list">
            <div class="detail_evaluate_star ">
                <div class="detail_btn31"><span class="detail_btn32"></span></div>
                <span> 好奇害死猫 </span>
            </div>
            <div class="detail_evaluate_cont"> 宝贝质量很好，是我喜欢的款式，大爱，要入手的亲们可以下手了，真的质量非常好，很值这个价钱。 </div>
            <div class="detail_evaluate_imgs clearfix"></div>
            <div class="detail_evaluate_time"> 2017-11-11 </div>
        </div>`
        return template;
    }

    // 套餐选择蒙层显示与否开始
    $(".detail_selected_switch").click(function() {
        return false;
        $(".detail_rddress_mask_content").animate({
            height: "70%",
        }, 300, function() {
            $(".detail_rddress_mask_content").slideDown(300);
        });
        $(".detail_address_mask").fadeIn("slow");
    });

    $(".detail_mask_close, .detail_address_mask").click(function() {
        $(".detail_address_mask").fadeOut("slow");
        city_none();
        $(".detail_rddress_mask_content").animate({
            height: "0",
        }, 300, function() {
            $(".detail_rddress_mask_content").slideUp(300);
        });
    });
    // 套餐选择蒙层显示与否结束

    // 商品评价
    var options3_body = {};
    options3_body.goods_id = shop_weid;
    options3_body.limit = 3;
    options3_body.page = 1;

    var options3 = $.post(apiUrl + "goods/comment/list", options3_body);
    options3.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            console.info("评论列表：", result);
            $(".detail_eval_list").html(shop_eval_all(result));
        } else {
            console.warn(data.message);
        }
    });
    options3.fail(function(error) {
        console.error(error);
    });

    // 商品详情内容显示
    var options1 = $.get(GOODS_DETAIL + "/" + shop_weid);
    options1.done(function(data) {
        console.log("商品详情：", data)
        if(data.code != 200) {
            return false;
        }

        var result = data.data;
        $(".detail_title").html(detail_title(result));
        $(".detail_swiper").html(detail_swiper(result));
        $(".detail_evaluate_imgs").html(detail_evaluate(result));
        $(".detail_mask_pic").html(detail_set_meal(result));
        
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

    $(".detail_footer_follow").click(function() {
        var options4 = $.get(apiUrl + "goods/collectionincrement/" + shop_weid);
        options4.done(function(data) {
            if(data.code == 200) {
                if(!data.data) {
                    layer.msg(data.message, { time: 1500 });
                    return false;
                }
                layer.msg("收藏成功", { time: 1500 });
            } else {
                console.error(data.message);
            }
        });
        options4.fail(function(error) {
            console.error(error);
        });
    });

    // Mall - 购物车 - 添加购物车
    $(".detail_footer_join").click(function() {
        var body = {
            goods_id : shop_weid,
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

    $(".detail_promotion_switch").click(function() {
        $(".detail_promotion_sub li").toggle(300);
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

    $(".mask_color span, .mask_size span").click(function() {
        $(this).addClass("selected_red").siblings().removeClass("selected_red");
    });

    $(".detail_save_weid").click(function() {
        window.localStorage.setItem("weid", $(".detail_weid").val());
        layer.msg("user_weid保存成功", { time: 1500 });
        $("#user_weid").slideUp();
    })

    $("#detail_mySelect").change(function() { SelectChange(); });

    function SelectChange() {
        var selectText = $("#detail_mySelect").find("option:selected").text();
        get_weid = $("#detail_mySelect").val();
    }

    // Mall - 分类 - 列表(根据用户)
    function classify() {
        $("#detail_mySelect option:gt(0):not()").remove();
        var optionss = $.get(apiUrl + "goods/cates/listsbyuser/" + user_weid);
        optionss.done(function(data0) {
            if(data0.code != 200) {
                layer.msg(data0.message, { time: 1500 });
                return false;
            }

            console.info("商品分类:", data0);
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

    // Mall - 分类 - 保存
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

    // Mall - 分类 - 提交
    $(".detail_save_button").click(function() {
        var body = {}

        body.cate_id     = get_weid;
        body.title       = $(".detail_save_2").val();
        body.price       = $(".detail_save_3").val();
        body.marketprice = $(".detail_save_4").val();
        body.views       = $(".detail_save_5").val();
        body.collections = $(".detail_save_6").val();
        body.cover       = $(".detail_save_7").val();
        body.picture     = $(".detail_save_8").val().split(",");
        body.summary     = $(".detail_save_9").val();
        body.note        = $(".detail_save_10").val();
        body.content     = $(".detail_save_11").val();
        body.sort        = $(".detail_save_12").val();
        body.stock       = $(".detail_save_13").val();

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
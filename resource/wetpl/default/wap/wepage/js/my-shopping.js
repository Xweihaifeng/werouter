/**
 * Created by weifeng on 2017/11/2.
 */

// 公用部分变量声明
// var user_weid = window.localStorage.getItem("weid");
// var token = window.localStorage.getItem('token');

var user_weid = "e432d880-c9c6-11e7-9416-ff2a866c0676";
var token = "eyJpdiI6IlwvWEFXRG5XR2IwTExYNDNyV2RmRnRRPT0iLCJ2YWx1ZSI6IlBHa2pPcWR5cndXV0lnMnIwYXJacHZ1WU9QWnB0VTFqUVwvSnRWbTMxajdWQ3lJTEQrdnRwYXREZzhZQUMwSW5UUit1RzZ1c2lSV3dHQktuVlMrR0JuY2NGQ0d2RER4MVpraFdBTm4rYzUzWT0iLCJtYWMiOiIxN2E3NWRiMTkyN2NhMzFkYWFlMmZjMTc3ZDZkNTJkMmQyYWU0NGY3NzUzNWU2ZmYwMDM2OTJkNDAxMDg2NDYxIn0=";

window.localStorage.setItem("weid", user_weid);
window.localStorage.setItem('token', token);

var number = 1, domain, plat_user_id;
var shop = new Array();
var my_shopping = {shop: shop};

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

var shops = function(key, value) {
    var imgUrl = value.cover;
    if (imgUrl.indexOf('http') === -1){
        imgUrl = imgSet(imgUrl, 100, 100, 3);
    }

    var template = `
    <li id="`+ value.weid +`">
        <div>
            <slide class="li_img_wap">
                <img src="`+ imgUrl +`">
            </slide>
            <slide class="li_info">
                <h3>`+ value.title +`</h3>
                <div class="lii_price">`+ value.price +`</div>
                <p class="lii_sold"><span>已售：`+ value.sales_num +`</span><span>收藏：`+ value.collections +`</span></p>
            </slide>
        </div>
    </li>`

    return template;
}

var genShop = function(shopping) {
    var result = shopping.shop;
    $.each(result, function (key, value) {
        $(".shop ul").append(shops(key, value));            
        $(".shop > ul > li").click(function() {
            var li_id = $(this).attr("id");
            window.localStorage.setItem("shopping_weid", li_id);
            window.location.pathname = "/shopping/detail";
        });
    });
}

// Pages - 主页 - 详情(用户ID)
if(user_weid) {
    var options_0 = $.get(apiUrl + "pages/page/getDetailByUser/" + user_weid);
    options_0.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            domain = result.domain;
        } else {
            console.warn(data.message);
        }
    });
    options_0.fail(function(error) {
        console.error(error);
    })
}

// Pages - 主页 - 详情(域名)
if(domain) {
    var options_1 = $.get(apiUrl + "pages/page/getDetailByDomain/" + domain);
    options_1.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            plat_user_id = result.plat_user_id;
        } else {
            console.warn(data.message);
        }
    });
    options_1.fail(function(error) {
        console.error(error);
    })
}

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
function shopping_list(shop_classify_weid) {
    var body = {};
    body.userId = plat_user_id;
    body.cate_id = shop_classify_weid;

    var options_two = $.post(apiUrl + "goods/lists/user", body);
    options_two.done(function(data) {
        if(data.code == 200) {
            var result = data.data.list;
            $.each(result, function(index, value) {
                shop.push(value);
            });

            my_shopping.shop = shop;
        } else {
            console.warn(data.message);
        }
    });
    options_two.fail(function(error) {
        console.error(error);
    });
}

var first_weid = $("#shop_type li").first().attr("id");
shopping_list(first_weid);

$("#shop_type li").click(function() {
    $(".shop ul").children().remove();
    shop = [];
    first_weid = $(this).attr("id");
    shopping_list(first_weid);
    genShop(my_shopping)
});
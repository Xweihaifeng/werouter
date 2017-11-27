/**
 * Created by weifeng on 2017/11/2.
 */

// 公用部分变量声明
var token = window.localStorage.getItem('token');

var number = 1, userid;
var shop = new Array();
const my_wemall = {shop: shop};

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
	var domain = window.location.pathname.split("/")[1];
    var imgUrl = value.cover;
    if (imgUrl.indexOf('http') === -1){
        imgUrl = imgSet(imgUrl, 100, 100, 3);
    }

    var template = `
    <a id="`+ value.weid +`" href="/`+ domain +`/wemall/goods/`+ value.weid +`">
        <div>
            <slide class="li_img_wap">
                <img src="`+ imgUrl +`">
            </slide>
            <slide class="li_info">
                <h3>`+ value.title +`</h3>
                <div class="lii_price">￥`+ value.price +`</div>
                <p class="lii_sold"><span>已售：`+ value.sales_num +`</span><span>收藏：`+ value.collections +`</span></p>
            </slide>
        </div>
    </a>`

    return template;
}

var genShop = function(shopping) {
    var result = shopping.shop;
    $.each(result, function (key, value) {
        $(".shop ul").append(shops(key, value));            
        $(".shop > ul > a").click(function() {
            var li_id = $(this).attr("id");
            window.localStorage.setItem("shopping_weid", li_id);
            // window.location.pathname = "/shopping/detail";
        });
    });
}

// Mall - 商品 - 用户商品列表
function shopping_list(shop_classify_weid) {
    var body = {};
    body.userId = userid;
    body.cate_id = shop_classify_weid;

    var options_two = $.post(apiUrl + "goods/lists/user", body);
    options_two.done(function(data) {
        if(data.code == 200) {
            var result = data.data.list;
            $.each(result, function(index, value) {
                shop.push(value);
            });

            my_wemall.shop = shop;
            genShop(my_wemall);

        } else {
            console.warn(data.message);
        }
    });
    options_two.fail(function(error) {
        console.error(error);
    });
}

// Mall - 分类 - 列表(根据用户)
const shopping_classify = function(user_weid) {
    var option_one = $.get(apiUrl + "goods/cates/listsbyuser/" + user_weid);
    option_one.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            $.each(result, function(index, value) {
                $("#shop_type").append(`<li id="`+ value.weid +`">`+ value.name +`</li>`);
            });

            var first_weid = $("#shop_type li").first().attr("id");
            shopping_list(first_weid);
        } else {
            console.warn(data.message);
        }
    })
}

const reqUserId = (url, domain) => {
    $.ajax({
        url: url + domain,
        type: 'GET',
        async: false,
        success: function(data) {
            if (data.code == 200) {
                userid = data.data.plat_user_id;
                let info = {
                    user_id: userid
                }
                shopping_classify(userid);
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
}

let domain = window.location.pathname.split('/')[1];
reqUserId(apiUrl + 'pages/page/getDetailByDomain/', domain);

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

$("#shop_type li").click(function() {
    $(".shop ul").children().remove();
    shop = [];
    first_weid = $(this).attr("id");
    shopping_list(first_weid);
    genShop(my_wemall)
});
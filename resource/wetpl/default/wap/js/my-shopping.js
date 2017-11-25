/**
 * Created by weifeng on 2017/11/2.
 */

// 公用部分变量声明
// var user_weid = window.localStorage.getItem("weid");
// var token = window.localStorage.getItem('token');

// var user_weid = "e432d880-c9c6-11e7-9416-ff2a866c0676";
var token = "eyJpdiI6IlZxMUNlSTVKc3BkVkk0ejdoM25nV0E9PSIsInZhbHVlIjoiT0drWmdTSHJmbVBMdVhFUmRkSU1rbVVpS0dQQXZleWdCM1BpeFgxQ3NNYkMrdXZFcGJweU1vbW5KNnJKSms2QTd3RjlaRmlTSEJIOHk4U0JRa1lPN0FsbUJ4S29ad2N1UFZ5c0JaRWVtcHc9IiwibWFjIjoiODQyYmVlYzhhMjRjOWFkNjNkYmZjYThjNDEwMTY0Y2JkMzg3MWVmMGMwMjMwZjQ1OTI5ZGFiYTdmMDA4MTZiNiJ9";

// window.localStorage.setItem("weid", user_weid);
// window.localStorage.setItem('token', token);
// alert("weid:" + window.localStorage.getItem("weid"));
// alert("token:" + window.localStorage.getItem('token'));


var number = 1, userid/*, plat_user_id*/;
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
    <a id="`+ value.weid +`" href="/shopping/`+ value.weid +`">
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
            window.location.pathname = "/shopping/detail";
        });
    });
}

// Pages - 主页 - 详情(用户ID)
/*if(user_weid) {
    var options_0 = $.get(apiUrl + "pages/page/getDetailByUser/" + user_weid);
    options_0.done(function(data) {
        if(data.code == 200) {
            alert('data:' + data)
            var result = data.data;
            domain = result.domain;
            alert("个性域名:" + domain);
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
            alert("plat_user_id:"+ plat_user_id);
        } else {
            console.warn(data.message);
        }
    });
    options_1.fail(function(error) {
        console.error(error);
    })
}*/










let resp;
const reqArtList = (url, user_weid) => {
    $.ajax({
        url: url + user_weid,
        type: 'GET',
        async: false,
        success: function(data){
            if (data.code == 200) {
                //console.log(data)
                resp = data;
            }
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })
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
            alert("商品列表:"+ result);
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


// Mall - 分类 - 列表(根据用户)
const shopping_classify = function(user_weid) {
    var option_one = $.get(apiUrl + "goods/cates/listsbyuser/" + user_weid);
    option_one.done(function(data) {
        if(data.code == 200) {
            var result = data.data;
            alert("商品分类："+ result);
            $.each(result, function(index, value) {
                $("#shop_type").append(`<li id="`+ value.weid +`">`+ value.name +`</li>`);
            });

            var first_weid = $("#shop_type li").first().attr("id");
            alert("first_weid:"+ first_weid);
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
                //console.log(data)
                userid = data.data.plat_user_id;
                let info = {
                    user_id: userid
                }
                // reqArtList(ARTICLE_LIST + '?userId=', user_weid);
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

const my_wemall = resp;





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
    genShop(my_shopping)
});
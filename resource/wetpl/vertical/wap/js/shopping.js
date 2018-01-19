/**
 * Created by weifeng on 2017/11/12.
 */

// 公用部分变量声明
var token = window.localStorage.getItem('token');
var user_weid = window.localStorage.getItem("weid");
var shop_weid = window.localStorage.getItem("shopping_weid");
var mock_shop = new Array();

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

var goods_list_dom = function(result) {

	var thum_img = result.cover;
	if(!thum_img) {
        thum_img = "/common/img/img9.jpg";
    } else if (thum_img.indexOf('http') != 0 && thum_img != "") {
        thum_img = imgSet(thum_img, 35, 35, 3);
    }

    var picture = result.picture.split(","), lii_img = '';
    $.each(picture, function(idnex, value) {
		if(!value) {
	        value = "/common/img/img9.jpg";
	    } else if (value.indexOf('http') != 0 && value != "") {
	        value = imgSet(value, 92, 88, 3);
	    }
    	lii_img += `<img src="`+ value +`">`

    });

    var template = `
        <slide>
            <slide class="li_img_wap">
                <img src="`+ thum_img +`">
            </slide>
            <slide class="li_info">
                <h2>`+ result.catename +`</h2>
                <h3>`+ result.title +`</h3>
                <div class="lii_img">`+ lii_img +`</div>
                <div class="lii_sold">
                    <a href="/shopping/`+ result.weid +`">
                        <slide class="li_img_wap">
                            <img src="`+ thum_img +`">
                        </slide>
                        <slide class="li_info">
                            <h3>`+ result.title +`</h3>
                            <p class="lii_sold1"><span>已售：`+ result.sales_num +`</span><span>收藏：`+ result.collections +`</span></p>
                            <div class="lii_price">￥：<span>`+ result.price +`</span></div>
                        </slide>
                    </a>
                </div>
                <div class="lii_eval">
                    <span class="lii_time"> 24分钟前 </span>
                    <img src="/common/img/review.svg" alt="" style="width: 0.16rem;height: 0.16rem;">
                    <!-- <span class="lii_assess"> 💬 </span> --> <!-- 👍 -->
                </div>
            </slide>
        </slide>
    `

    return template;
}

var goods_list = $.post(apiUrl + "goods/list");
goods_list.done(function(data) {
    if(data.code == 200) {
        console.log(data);
        var result = data.data;
        if(!result) {
            console.log("Mall - 商品 - 列表 请求数据不合法");
            return false;
        }

        $.each(result.list, function(index, value) {
        	$("#container").append(goods_list_dom(value));
        });

    } else {
        console.warn(data.message);
    }
});
goods_list.fail(function(error) {
    console.error(error);
});

$("#container").scroll(function(){
    var $this =$(this),
    viewH =$(this).height(),
    contentH =$(this).get(0).scrollHeight,
    scrollTop =$(this).scrollTop();
    if(scrollTop / (contentH - viewH) >= 0.95){
        console.log("到底了");
    }
});
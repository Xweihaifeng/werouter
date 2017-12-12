/**
 * Created by weifeng on 2017/8/29.
 */

$(function() {
	var pathname = window.location.pathname.split('/').slice(1,4);

    $.ajax({
        url: CMS_CHANNELS_DOMAIN_QUERY + pathname[0],
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.code === 200) {
                domain_weid = data.data.weid;
                var thumb_image = data.data.thumb_image;
                var big_image = data.data.big_image;

                if(!thumb_image) {
                    thumb_image = "/common/img/news_top_img.png";
                } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                    thumb_image = imgSet(thumb_image, 1100, 235, 3);
                }

				if(!big_image) {
                    big_image = "/common/img/news_top_img.png";
                } else if (big_image.indexOf('http') != 0 && big_image != "") {
                    big_image = imgSet(big_image, 1100, 235, 3);
                }
                
                $(".special-box-left").css("background", "url("+ big_image +") no-repeat");
                $(".special-content").css("background", "url("+ thumb_image +") no-repeat");
            } else {
                console.error(data.message);
            }
        }
    });

    // 热点新闻显示区
    var news_hots_imgs = function(result) {
        var jumpUrl = result.weid;
        var thumb_image = result.thumb_image;

        if(!thumb_image) {
            thumb_image = "/common/img/news_default.jpg";
        } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 700, 400, 3);
        }

        var template = `
            <div>
                <a href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_blank" >
                    <img src="`+ thumb_image +`" alt="">
                </a>
            </div>`
        return template;
    }

    var news_hots_info = function(result) {
        var template = `
            <div>`+ result.title +`</div>`
        return template;
    }

    // 热门推荐
    var options3 = $.get(CMS_CONTENTS_HOT + "news&is_hot=1&limit=3");
    options3.done(function (data) {
        if (data.code === 200 ) {
            $.map(data.data.list, function(item) {
                $(".special-content-info").append(news_hots_imgs(item));
                $(".special-nav-info").append(news_hots_info(item));
                $(".special-nav-info > div").eq(0).addClass("on");
            });

			$(".special-nav-info > div").mouseover(function () {
				var $this = $(this);
				var index = $this.index();
			}).mouseout(function () {
				var $this = $(this);
				var index = $this.index();
			}).hover(function () {
				var $this = $(this);
				var index = $this.index();
				var l = -(index * 400);
				$(".special-nav-info > div").removeClass("on");
				$(".special-nav-info > div").eq(index).addClass("on");
				$(".special-content-info > div:eq(0)").stop().animate({ "margin-top": l }, 500);
			});
        } else {
            console.warn(data.message);
        }
    });
    options3.fail(function (error) {
        console.info(error);
    });

    // 推荐新闻
    var options4 = $.get(CMS_CONTENTS_HOT + "news");
    options4.done(function (data) {
        if (data.code === 200 ) {
        	console.log(data);
            $.map(data.data.list, function(item) {
                console.log(item);
            });
        } else {
            console.warn(data.message);
        }
    });
    options4.fail(function (error) {
        console.info(error);
    });
})
/**
 * Created by weifeng on 2017/8/29.
 */

$(function() {
    var pathname = window.location.pathname.split('/').slice(1,4);
    var logo = window.localStorage.getItem("logo");
    var tpl = "";
    if(!logo) {
	    logo = "/common/img/main_logo.png";
	} else if (logo.indexOf('http') != 0 && logo != "") {
	    logo = imgSet(logo, 60, 60, 3);
	}
	$(".header-logo").css("background", "#33a0e1 url("+ logo +") no-repeat center");
	$(".header-logo").html(`<a href="/`+ pathname[0] +`"></a>`);

    // 平台商标
    $.ajax({
        url: apiUrl + "cms/setting/show",
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.code === 200) {
                tpl = data.data.title;
            } else {
                console.error(data.message);
            }
        }
    });

    // 专题背景图
    $.ajax({
        url: CMS_CHANNELS_DOMAIN_QUERY + pathname[0],
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.code === 200) {
                domain_weid = data.data.weid;
                var big_image = data.data.big_image;

                if(!big_image) {
                    big_image = "/common/img/news_top_img.png";
                } else if (big_image.indexOf('http') != 0 && big_image != "") {
                    big_image = ApiMaterPlatQiniuDomain + big_image;
                }

                $(".special-content").css("background", "#f7f0e0 url("+ big_image +")  no-repeat 50% 0");
            } else {
                console.error(data.message);
            }
        }
    });

    // 热点新闻图片显示
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
            <div class="hot-info">
                <div class="hot-title">`+ result.title +`</div>
                <div class="hot-summary">`+ result.summary +`</div>
            </div>
        </div>`
        return template;
    }

    // 热点专题标题
    var news_hots_info = function(result) {
        var template = `<div><a href="/`+ pathname[0] +"/"+ result.weid +`">`+ result.title +`</a></div>`
        return template;
    }

    var recommend = function(result) {
        var template = `
        <h1 class="title">`+ result.title +`</h1>
        <div class="info"><span>发布单位：</span>`+ result.source +`<span>创建时间：</span>`+ result.created_at +`</div>
        <div class="sp_content">`+ result.content +`</div>`
        return template;
    }

    // 分类显示专题新闻
    function opt5(channel_class) {
        var options5 = $.get(CMS_DETAIL + pathname[1]);
        options5.done(function (data) {
            if (data.code === 200 && data.data) {
                console.log(data.data);
                var result = data.data;
                $(".special-title-list").append(`<li><a href="/`+ pathname[0] +"/"+ result.category.domain +`">`+ result.category.title +`</a></li>`);
                document.title = result.category.title +"—"+ tpl;
                $(".special-box-right").html(recommend(result));
            } else {
                console.warn(data.message);
            }
        });
        options5.fail(function (error) {
            console.info(error);
        });
    }

    // 热门推荐
    var options3 = $.get(CMS_CONTENTS_HOT + pathname[0] + "&index_show=1&limit=3");
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

    // 默认加载专题新闻
    if(!pathname[1] || pathname[1] == '') {
        // 推荐专题新闻
        window.location.href = "/404"
    } else if(pathname[1] != undefined || pathname[0] != null || pathname[1] != '') {
    	// 排序新闻
        opt5(pathname[1]);
    }

    // 搜索新闻
    $(".soso-submit").click(function() {
        var input_val = $(".soso-input").val();
        window.location.href = `/search` +`?title=`+ input_val +`&channel=`+ pathname[0];
    });
})
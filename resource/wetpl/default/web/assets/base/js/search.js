/**
 * Created by weifeng on 2017/8/29.
 */

$(function() {

    var tpl = "";
    function getQueryString(name) {  
        var re = new RegExp (name + "=([^\&]*)" , "i" );
        var a = re . exec (document . location . search );
        if (a == null )
            return null ;
        return a [ 1 ];  
    }
    var channel = getQueryString("channel");
    var title = getQueryString("title");

    var logo = window.localStorage.getItem("logo");
    if(!logo) {
        logo = "/common/img/main_logo.png";
    } else if (logo.indexOf('http') != 0 && logo != "") {
        logo = imgSet(logo, 60, 60, 3);
    }
    $(".header-logo").css("background", "#33a0e1 url("+ logo +") no-repeat center");
    $(".header-logo").html(`<a href="/"></a>`);

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


    $.ajax({
        url: CMS_CHANNELS_DOMAIN_QUERY + channel,
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.code === 200) {
                domain_weid = data.data.weid;
                var back_image = data.data.back_image;
                var big_image = data.data.big_image;

                if(!back_image) {
                    back_image = "/common/img/news_top_img.png";
                } else if (back_image.indexOf('http') != 0 && back_image != "") {
                    back_image = ApiMaterPlatQiniuDomain + back_image;
                }

                if(!big_image) {
                    big_image = "/common/img/news_top_img.png";
                } else if (big_image.indexOf('http') != 0 && big_image != "") {
                    big_image = ApiMaterPlatQiniuDomain + big_image;
                }
                
                $(".special-box-left").css("background", "url("+ back_image +") no-repeat");
                $(".special-content").css("background", "#f7f0e0 url("+ big_image +")  no-repeat 50% 0");
            } else {
                console.error(data.message);
            }
        }
    });

    var options1 = $.get(apiUrl + "cms/channel_categories?channel=" + channel);
    options1.done(function(data) {
        if(data.code == 200 && data.data) {
            var result = data.data;
            result.forEach(function(value, index) {
                if(index < 4) {
                    $(".special-title-list").append(`<li><a href="/`+ channel +"/"+ value.domain +`">`+ value.title +`</a></li>`);
                }
            });
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });

    function page_tab(page) {
        var options2 = $.get(CMS_CONTENTS_HOT + channel +"&title="+ title +"&page="+ page);
        options2.done(function (data) {
            if(!data.data.list.length) {
                return false;
            }

            $(".special-scrollable > ul").html("");
            if (data.code === 200 ) {
                $.map(data.data.list, function(item, index) {
                    $(".special-scrollable > ul").append(new_recom(item, index));
                });
            } else {
                console.warn(data.message);
            }
        });
        options2.fail(function (error) {
            console.info(error);
        });
    }

    // 分页显示
    var paging = function(total, limit) {
        var setTotalCount = total;
        $('#box').paging({
            initPageNo: 1,                                 // 初始页码
            totalPages: Math.ceil(setTotalCount/limit),    //总页数
            // totalCount: '合计' + setTotalCount + '条数据', // 条目总数
            slideSpeed: 600,                               // 缓动速度。单位毫秒
            jump: true,                                    //是否支持跳转
            callback: function(page) {                     // 回调函数
                page_tab(page);
            }
        })
    }

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
            <a href="/`+ channel +"/"+ jumpUrl +`" target="_blank" >
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
        var template = `<div><a href="/`+ channel +"/"+ result.weid +`">`+ result.title +`</a></div>`
        return template;
    }

    // 推荐专题新闻
    var recommend = function(result, idnex) {
        var template = `
        <h1>`+ result.title +`</h1>
        <div class="desc">`+ result.title.substr(1, 100) +`
            <a href="/`+ channel +"/"+ result.weid +`" target="_blank">[查看详情]</a>
        </div>`
        return template;
    }

    // 专题排序新闻
    var new_recom = function(result, index) {
        var template = `
        <li>
            <i>`+ (index + 1) +`</i>
            <h3 class="t">
                <a href="/`+ channel +"/"+ result.weid +`">`+ result.title +`</a>
            </h3>
            <div class="desc">`+ result.summary +`</div>
        </li>`
        return template;
    }

    // 分类显示专题新闻
    function opt5(channel, title) {
        var options5 = $.get(CMS_CONTENTS_HOT + channel + "&title=" + title);
        options5.done(function (data) {
            if (data.code === 200 ) {
                paging(data.data.total, 10);
            } else {
                console.warn(data.message);
            }
        });
        options5.fail(function (error) {
            console.info(error);
        });
    }

    // 热门推荐
    var options3 = $.get(CMS_CONTENTS_HOT + channel + "&index_show=1&limit=3");
    options3.done(function (data) {
        if (data.code === 200 ) {
            $.map(data.data.list, function(item) {
                $(".special-content-info").append(news_hots_imgs(item));
                $(".special-nav-info").append(news_hots_info(item));
                $(".special-nav-info > div").eq(0).addClass("on");
            });

            $(".special-nav-info > div").hover(function () {
                var $this = $(this);
                var index = $this.index();
                var l = -(index * 400);
                $(".special-nav-info > div").removeClass("on");
                $(".special-nav-info > div").eq(index).addClass("on");
                $(".special-content-info").stop().animate({ "margin-top": l }, 500);
            });
        } else {
            console.warn(data.message);
        }
    });
    options3.fail(function (error) {
        console.info(error);
    });

    // 热门
    var options4 = $.get(CMS_CONTENTS_HOT + channel + "&hot=1&limit=1");
    options4.done(function (data) {
        if (data.code === 200 ) {
            $.map(data.data.list, function(item, index) {
                $(".special-headline").html(recommend(item, index));
            });
        } else {
            console.warn(data.message);
        }
    });
    options4.fail(function (error) {
        console.info(error);
    });

    // 默认加载专题新闻
    if(!channel || channel == '') {
        // 推荐专题新闻
        window.location.href = "/404";
        return false;
    } else if((channel != undefined 
            || channel != null
            || channel != '')
            && window.location.search.indexOf("?title=") == 0) {
    	// 搜索新闻
        opt5(channel, title);
    }

    // 搜索新闻
    // $(".soso-submit").click(function() {
    //     var input_val = $(".soso-input").val();
    //     window.location.href = `/search` +`?title=`+ input_val +`&channel=`+ channel;
    // });

    document.title = "最新新闻—" + tpl;
})
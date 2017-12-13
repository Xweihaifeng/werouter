/**
 * Created by weifeng on 2017/8/29.
 */

$(function() {
    var pathname = window.location.pathname.split('/').slice(1,4);
    var logo = window.localStorage.getItem("logo");
    if(!logo) {
	    logo = "/common/img/main_logo.png";
	} else if (logo.indexOf('http') != 0 && logo != "") {
	    logo = imgSet(logo, 60, 60, 3);
	}
	$(".header-logo").css("background", "#33a0e1 url("+ logo +") no-repeat center");
	$(".header-logo").html(`<a href="/`+ pathname[0] +`"></a>`);

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
                    thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
                }

                if(!big_image) {
                    big_image = "/common/img/news_top_img.png";
                } else if (big_image.indexOf('http') != 0 && big_image != "") {
                    big_image = ApiMaterPlatQiniuDomain + big_image;
                }
                
                $(".special-box-left").css("background", "url("+ thumb_image +") no-repeat");
                $(".special-content").css("background", "#f7f0e0 url("+ big_image +")  no-repeat 50% 0");
            } else {
                console.error(data.message);
            }
        }
    });

    var options1 = $.get(apiUrl + "cms/channel_categories?channel=" + pathname[0]);
    options1.done(function(data) {
    	if(data.code == 200 && data.data) {
    		var result = data.data;
    		result.forEach(function(value, index) {
    			$(".special-title-list").append(`<li><a href="/`+ pathname[0] +"/"+ value.domain +`">`+ value.title +`</a></li>`);
    		});
    	}
    });
    options1.fail(function(error) {
    	console.error(error);
    });

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
            <a href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_blank" >
                <img src="`+ thumb_image +`" alt="">
            </a>
        </div>`
        return template;
    }

    // 热点专题标题
    var news_hots_info = function(result) {
        var template = `<div>`+ result.title +`</div>`
        return template;
    }

    // 推荐专题新闻
    var recommend = function(result, idnex) {
        var template = `
        <h1>`+ result.title +`</h1>
        <div class="desc">`+ result.title.substr(1, 100) +`
            <a href="/`+ pathname[0] +"/"+ result.weid +`" target="_blank">[查看详情]</a>
        </div>`
        return template;
    }

    // 专题排序新闻
    var new_recom = function(result, index) {
        var template = `
        <li>
            <i>`+ index +`</i>
            <h3 class="t">
                <a href="/`+ pathname[0] +"/"+ result.weid +`">`+ result.title +`</a>
            </h3>
            <div class="desc">`+ result.summary +`</div>
        </li>`
        return template;
    }

    var page_tab = function(pageNum) {
        if((pathname.length == 2 && pathname[1] == "") || pathname.length == 1) {
            $(".special-headline").html("");
            $(".special-scrollable > ul").html("");
            $.ajax({
                url: CMS_CONTENTS + pathname[0] + "&page=" + pageNum,
                dataType: 'JSON',
                type: 'get',
                success: function(data) {
                    if (data.code === 200 ) {
                        $.map(data.data.list, function(item, index) {
                            if(index == 0) {
                                $(".special-headline").html(recommend(item, index));
                            } else {
                                $(".special-scrollable > ul").append(new_recom(item, index));
                            }
                        });
                    } else {
                        console.warn(data.message);
                    }
                },
                error: function(error) {
                    console.error(error);
                }
            })
        } else {
            var option4 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + pathname[1] + "&page=" + pageNum);
            option4.done(function(body4) {
                if(!body4.data.list.length) {
                    return false;
                }

	            $(".special-headline").html("");
	            $(".special-scrollable > ul").html("");
                // 更多页的执行函数！
                if (body4.code === 200 ) {
                    $.map(body4.data.list, function(item, index) {
                        if(index == 0) {
                            $(".special-headline").html(recommend(item, index));
                        } else {
                            $(".special-scrollable > ul").append(new_recom(item, index));
                        }
                    });
                } else {
                    console.warn(body4.message);
                }
            });
            option4.fail(function(error) {
                console.error(error)
            });
        }
    }

    // 频道显示所有专题新闻
    function opt4(channel_class) {
        var options4 = $.get(CMS_CONTENTS_HOT + channel_class);
        options4.done(function (data) {
            if (data.code === 200 ) {
                $.map(data.data.list, function(item, index) {
                    if(index == 0) {
                        $(".special-headline").html(recommend(item, index));
                    } else {
                        $(".special-scrollable > ul").append(new_recom(item, index));
                    }
                });
                paging(data.data.total, 10);
            } else {
                console.warn(data.message);
            }
        });
        options4.fail(function (error) {
            console.info(error);
        });        
    }

    // 分类显示专题新闻
    function opt5(channel_class) {
        var options5 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + channel_class);
        options5.done(function (data) {
            if (data.code === 200 ) {
                $.map(data.data.list, function(item, index) {
                    if(index == 0) {
                        $(".special-headline").html(recommend(item, index));
                    } else {
                        $(".special-scrollable > ul").append(new_recom(item, index));
                    }
                });
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
    var options3 = $.get(CMS_CONTENTS_HOT + pathname[0] + "&hot=1&limit=3");
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
        opt4(pathname[0]);
    } else if(pathname[1] != undefined || pathname[0] != null || pathname[1] != '') {
    	// 排序新闻
        opt5(pathname[1]);
    }
})
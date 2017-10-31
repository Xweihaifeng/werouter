/*
 * * 新闻中心频道栏目、新闻列表
 */
$(function() {
    var pathname = window.location.pathname.split('/').slice(1,3);
    var get_weid = pathname[0], get_parse, total, limit, pageNum = 1;

    var options1 = $.get(CMS_CHANNELS_DOMAIN_QUERY + pathname[0]);
    options1.done(function(data) {
        if(data.code === 200) {
            get_weid = data.data.weid;
            var thumb_image = data.data.thumb_image;

            if(!thumb_image) {
                thumb_image = "/common/img/news_top_img.png";

            } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                thumb_image = imgSet(thumb_image, 1100, 235, 3);
            }

            $(".new-top-images").css("backgroundImage", "url("+ thumb_image +")");
        } else {
            console.error(data.message);
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });

    if(pathname.length == 2 && pathname[1] != '') {
        get_parse = pathname[1];
        var options2 = $.get(CMS_CATEGORIES_DOMAIN_QUERY + get_parse);

        options2.done(function(data) {
            if(data.code === 200) {
                get_parse = data.data.weid;

            } else {
                console.warn(data.message);
            }
        })
        options2.fail(function(error) {
            console.error(error);
        })
    }

    $("#newN").attr("href", "/" + pathname[0]);

    // 热点新闻显示区
    var news_hots = function(result) {
        var jumpUrl = result.weid;
        var thumb_image = result.thumb_image;

        if(!thumb_image) {
            thumb_image = "/common/img/news_default.jpg";

        } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 320, 200, 3);
        }

        var template = `
            <div class="hotsinfo">
                <a href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_blank" >
                    <img src="`+ thumb_image +`" alt="">
                    <p>`+ result.title +`</p>
                </a>
            </div>`

        return template;
    }

    // 栏目显示区
    var news_channel_categories = function(result) {
        // if(pathname.length == 2 && pathname[1] != '') {}
        var template = `<a class="chan_li" id="` + result.domain + `"  name="`+ result.weid +`" href="/`+ pathname[0] +"/"+ result.domain + `">`+ result.title +`</a>`

        return template;
    }

    // 新闻详情显示区
    var news_contents = function(result) {

        var jumpUrl = result.weid;
        var thumb_image = result.thumb_image;
        var new_title = result.title;

        if(!thumb_image) {
            thumb_image = "/common/img/news_default.jpg";

        } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 140, 131, 3);
        }

        var template = `
        <li class="article-item new-list-box flex">
            <div class="details-header"><a href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_top" class="list-img">`;

                if(thumb_image != ""){
                    template= template +`<img src="`+ thumb_image +`" class="new-list-img" id="list_img">`;
                }

                if(new_title.length > 40) {
                    new_title = result.title.substr(0, 40) + "...";
                }

                template= template+`</a></div> <div class="details-title">
                <h3 class="list-title"><a class="title_a" href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_top" >`+ new_title +`</a></h3>
                <div class="zhu-yao-nei-rong">`+ result.content +`</div>
                <div class="a-none"><a class="a-none" style="color: #007cd3;" href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_top" >查看全文</a></div>
                <div class="pageviews center-disperse">
                    <div class="new-issuser "><span>`+ result.auth +` <b> · </b></span><span>`+ result.created_at +`</span><span>浏览量：<span style="color: #007cd3;">`+ result.views +`</span></span></div>
                    <div><a href="#"><span class="article-cate new-title">`+ result.cate_name +`</span></a></div>
                </div>
            </div>
        </li>`

        return template;
    }

    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();

        if(scrollTop + windowHeight == scrollHeight){
            console.log("已经到最底部了！");
        }
    });

    //  点击加载更多后显示出第二页的数据
    $('#news_loadingsImg').click(function() {
        if(limit * pageNum > total) {
            $(this).attr("disabled", true).siblings().attr("disabled", false);
            var my_is_last_page = '我是最后一页了！'
            layer.msg(my_is_last_page, { time: 1500 });
            $(".news-loadingsImg").slideUp();
            return false;
        }

        pageNum++;
        var li_name = $('.csdf').attr('id');
        column(li_name, pageNum);
    })

    function column(li_name, pageNum) {
        // 新闻列表
        var options6 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&limit=10&page=" + pageNum );
        options6.done(function(data) {
            if(data.code === 200) {
                total = data.data.total;
                limit = data.data.params.limit;
                pageNum = data.data.params.page // 显示初始页面

                if(total <= 10) {
                    $(".news-loadingsImg").slideUp();
                }
            }

            $(data.data.list).each(function(index, value) {
                $(".news-center-main").append(news_contents(value));
                $(".zhu-yao-nei-rong img").hide();
            })
        });
        options6.fail(function(error) {
            console.warn(error)
        });
    }

    $('#news_loadingsImg1').click(function() {
        if(limit * pageNum >= total) {
            $(this).attr("disabled", true).siblings().attr("disabled", false);
            var my_is_last_page = '我是最后一页了！！'
            layer.msg(my_is_last_page, { time: 1500 });
            $(".news-loadingsImg1").slideUp();
            return false;
        }

        pageNum++;
        column1(pageNum);
    });

    function column1(pageNum) {
        // append新闻列表
        var options5 = $.get(CMS_CONTENTS + pathname[0]+ "&limit=10&page=" + pageNum );
        options5.done(function(data) {
            if(data.code === 200) {
                total = data.data.total;
                limit = data.data.params.limit;
                pageNum = data.data.params.page // 显示初始页面

                if(total <= 10) {
                    $(".news-loadingsImg1").slideUp();
                }
            }

            $(data.data.list).each(function(index, value) {
                $(".news-center-main").append(news_contents(value));
                $(".zhu-yao-nei-rong img").hide();
            })
        });
        options5.fail(function(error) {
            console.warn(error)
        });
    }

    //  显示热点新闻
    var options3 = $.get(CMS_CONTENTS_HOT + get_weid + "&is_hot=1&limit=3");
    options3.done(function (data) {
        if (data.code === 200 ) {
            $.map(data.data.list, function(item) {
                $(".news-center-top").append(news_hots(item));
            });
        } else {
            console.warn(data.message);
        }
    });
    options3.fail(function (error) {
        console.info(error);
    });

    //  显示栏目列表
    var options4 = $.get(CMS_CHANNEL_CATEGORIES + get_weid);   
    options4.done(function (data) {
        if (data.code === 200 ) {            
            $.map(data.data, function(item, index) {
                if(index < 10) {
                    $(".news-center-main-title").append(news_channel_categories(item));
                }
            });

            var li_name = $(".chan_li").first().attr("id");
            if(pathname.length == 2 && pathname[1] != ''){
                li_name = pathname[1];
            }
            $("#" + li_name).addClass("csdf").siblings().removeClass("csdf");
            document.title = $("#" + li_name).text();
            if($("#newN").attr("class").indexOf("csdf") != -1) {
                $('#news_loadingsImg1').show().siblings("#news_loadingsImg").hide();
                column1(pageNum);
            } else {
                column(li_name, pageNum);
            }
        } else {
            console.warn(data.message);
        }

    });
    options4.fail(function (error) {
        console.info(error);
    })

})
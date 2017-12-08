/*
 * * 新闻中心频道栏目、新闻列表
 */
$(function() {
    var pathname = window.location.pathname.split('/').slice(1,3);
    var get_weid = pathname[0], get_parse, total, limit, pageNum = 1;
    var domain_weid = '';

    $.ajax({
        url: CMS_CHANNELS_DOMAIN_QUERY + get_weid,
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.code === 200) {
                domain_weid = data.data.weid;
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
        }
    });

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
        var template2 = function(children) {
            var template21 = '';
            if(children.length != 0) {
                template21 += '<div class="sub_tab">';
                $.map(children, function(value, key) {
                    template21 += `<a href="/`+ pathname[0] +"/"+ value.domain + `">`+ value.title +` </a>`
                });
                template21 += '</div>';
            }
            return template21;
        }

        var template = `<span class="chan_li" id="` + result.domain + `"><a name="`+ result.weid +`" href="/`+ pathname[0] +"/"+ result.domain + `">
            `+ result.title +`</a>`+ template2(result.children) +`</span>`

        return template;
    }

    // 新闻详情显示区
    var news_contents = function(result) {

        var jumpUrl = result.weid;
        var thumb_image = result.thumb_image;
        var new_title = result.title;

        if(!thumb_image) {
            // thumb_image = "/common/img/news_default.jpg";

        } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 240, 145, 3);
        }

        var template = `
        <li class="article-item new-list-box flex">`
                if(thumb_image != ""){
                    template = template + `
                    <div class="details-header">
                        <a href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_top" class="list-img">
                        <img src="`+ thumb_image +`" class="new-list-img" id="list_img"></a>
                     </div> `;
                }
                if(new_title.length > 40) {
                    new_title = result.title.substr(0, 40) + "...";
                }

                template= template+`<div class="details-title">
                <h3 class="list-title"><a class="title_a" href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_top" >`+ new_title +`</a></h3>
                <div class="zhu-yao-nei-rong">`+ result.summary +`</div>
                <div class="a-none"><a class="a-none" style="color: #007cd3;" href="/`+ pathname[0] +"/"+ jumpUrl +`" target="_top" >查看全文</a></div>
                <div class="pageviews center-disperse">
                    <div class="new-issuser "><span>`+ result.auth +` <b> · </b></span><span>`+ result.publish_time +`</span><span>浏览量：<span style="color: #007cd3;">`+ result.views +`</span></span></div>
                    <div><a href="javascript:void(0)"><span class="article-cate new-title">`+ result.cate_name +`</span></a></div>
                </div>
            </div>
        </li>`

        return template;
    }

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

    function column3(li_name, pageNum) {
        // 新闻列表
        var options6 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&limit=10&page=" + pageNum );
        options6.done(function(data) {
            if(data.code === 200) {
                total = data.data.total;
                limit = data.data.params.limit;
                pageNum = data.data.params.page // 显示初始页面

                if(total <= 10) {
                    $(".news-loadingsImg").slideUp();
                } else {

                    $(".news-loadingsImg").slideDown();
                    $('.csdf').attr('id', li_name);
                }

                $(data.data.list).each(function(index, value) {
                    $(".news-center-main").append(news_contents(value));
                    $(".zhu-yao-nei-rong img").hide();
                })

            }
        });
        options6.fail(function(error) {
            console.warn(error)
        });
    }

    function column(li_name, pageNum, result) {
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

                if(data.data.list.length == 0) {
                    result.forEach(function(value, index) {
                        if(value.domain == li_name) {
                            column3(value.children[0].domain, pageNum);
                        }
                    });
                } else {
                    $(data.data.list).each(function(index, value) {
                        $(".news-center-main").append(news_contents(value));
                        $(".zhu-yao-nei-rong img").hide();
                    })
                }
            }

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

    var options18 = $.get(apiUrl + "cms/cate_tree_by_channel?channel=" + domain_weid);
    options18.done(function (data) {
        if (data.code === 200 ) {
            console.log(data.data);
            $.map(data.data, function(item, index) {
                if(index < 10) {
                    $(".news-center-main-title").append(news_channel_categories(item));
                }
            });

            $(".chan_li").hover(function() {
                $(this).find(".sub_tab").slideDown();
            }, function() {
                $(this).find(".sub_tab").hide();
            })

            var li_name = pathname[1];
            $('.csdf').attr('id', li_name);
            if(pathname.length == 2 && pathname[1] != ''){
                li_name = pathname[1];
            }
            $("#" + li_name).addClass("csdf").siblings().removeClass("csdf");
            $("#" + li_name + " a").addClass("fgvg");

            document.title = $("#" + li_name).text();
            if($("#newN").attr("class").indexOf("csdf") != -1) {
                $('#news_loadingsImg1').show().siblings("#news_loadingsImg").hide();
                column1(pageNum);
            } else {
                column(li_name, pageNum, data.data);
            }
        } else {
            console.warn(data.message);
        }

    });
    options18.fail(function (error) {
        console.info(error);
    })
})
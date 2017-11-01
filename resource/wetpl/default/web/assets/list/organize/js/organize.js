/*
 *     组织部分数据覆盖
 */

$(function() {
    window.localStorage.setItem("pageNum", 1);
    var li_name, total, limit, pageNum = 1, get_param;
    var pathname = window.location.pathname.split('/').slice(1,3);

    get_param = pathname[0];
    var options = $.get(CMS_CHANNELS_DOMAIN_QUERY + get_param);
    options.done(function(data) {
        if(data.code === 200) {
            var thumb_image = data.data.thumb_image;
            if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                thumb_image = imgSet(thumb_image, 1100, 320, 3);
            }
            if(thumb_image != ""){
                $("#thumb_image").attr("src", thumb_image);
            }
            get_param = data.data.weid;
        } else {
            console.error(data.message);
        }
    });
    options.fail(function(error) {
        console.error(error);
    });

    if(pathname.length == 2 && get_param != '') {
        var options1 = $.get(CMS_CATEGORIES_DOMAIN_QUERY + get_param);
        options.done(function(data) {
            if(data.code === 200) {
                var thumb_image = data.data.thumb_image;
                if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                    thumb_image = imgSet(thumb_image, 1100, 320, 3);
                }
                if(thumb_image != ""){
                    $("#thumb_image").attr("src", thumb_image);
                }
            } else {
                console.error(data.message);
            }
        });
        options.fail(function(error) {
            console.error(error);
        });
    }

    // 页面绑定分类栏目列表数据
    var options2 = $.get(CMS_CHANNEL_CATEGORIES + get_param);
    options2.done(function(data) {
        if(data.code === 200) {

            $.map(data.data, function(item, index) {
                if(index < 13) {
                    $("#menuX").append(news_channel_categories(item));
                }
            });

            li_name = $(".chan_li").first().attr("id");

            // URL部分 pathname 显示 数组长度
            if(pathname.length == 2 && pathname[1] != ''){
                li_name = pathname[1];
                column(li_name, pageNum);
            } else if((pathname.length == 2 && pathname[1] == '') || pathname.length == 1) {
                li_name = '';
                cms_content(pageNum);
            } else {
                column(li_name, pageNum);
            }

            // 最新发布样式呈现
            if(li_name == "oooo" || li_name == "") {
                $('#oooo').addClass("cate-active-on").siblings().removeClass("cate-active-on");
                document.title = $("#oooo").text();
                $("#menuY").html($("#oooo").text());
            } else {
                $('#' + li_name).addClass("cate-active-on").siblings().removeClass("cate-active-on");
                document.title = $("#" + li_name).text();
                $("#menuY").html($('#' + li_name).text());
            }

            prev_next_page();
        } else {
            console.error(data.message);
        }
    });
    options2.fail(function(error) {
        console.info(error);
    })

    // 最新发布及默认执行
    function cms_content(pageNum) {
        $.ajax({
            url: CMS_CONTENTS + pathname[0] + "&page=" + pageNum,
            dataType: 'JSON',
            type: 'get',
            success: function(data) {
                if(data.code == 200) {
                    total = data.data.total;
                    limit = data.data.params.limit;
                    pageNum = data.data.params.page // 显示初始页面

                    if(total > 10) {
                        $(".paging").css("display", "flex");
                    } else {
                        $(".paging").hide();
                    }
                    channel_detail(data, pathname);
                }
            },
            error: function(error) {
                console.error(error);
            }
        })
    }

    // 栏目显示区
    var news_channel_categories = function(result) {
        var template = `
            <a class="chan_li" id="` + result.domain + `" name="` + result.weid + `" href="/`+ pathname[0] +"/"+ result.domain + `" type="`+ result.type +`">` + result.title.substr(0, 4) + `</a>`

        return template;
    }

    // 新闻详情显示区
    var news_contents = function(result) {
        var jumpUrl = result.weid;
        var template = `<li name="` + jumpUrl + `">
            <a href="/`+ pathname[0]+"/"+ jumpUrl +`" target="_blank">` + result.title + `</a>
            <small>` + result.updated_at + `</small>
        </li>`

        return template;
    }

    // 栏目列表内容
    function column(li_name, page) {
        var options3 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&page=" + page);
        options3.done(function(body) {
            total = body.data.total;
            limit = body.data.params.limit;
            pageNum = body.data.params.page // 显示初始页面

            if(total > 10) {
                $(".paging").css("display", "flex");
            } else {
                $(".paging").hide();
            }

            if($("#"+ pathname[1]).attr("type") == 1) {
                // 页面绑定单页数据
                var options2 = $.get(CMS_CHANNEL_CATEGORIES + get_param);
                options2.done(function(data) {
                    if(data.code === 200) {
                        $.map(data.data, function(item, index) {
                            if(item.domain == pathname[1]) {
                                $(".paging").slideUp();
                                $(".article_list").text(item.title);
                                $(".list-article-ul").html("<div class='org_content'><div>"+ item.content +"</div></div>");
                            }
                        });
                    }
                })
            }
            $(body.data.list).each(function(index, value) {
                $(".list-article-ul").append(news_contents(value));
            });
        });
        options3.fail(function(error) {
            console.error(error)
        });
    }

    function channel_detail(body, get_param) {
        $(body.data.list).each(function(index, value) {
            $(".list-article-ul").append(news_contents(value));
        });
    }

    // 上下翻页
    function prev_next_page() {

        //  点击加载更多后显示出上一页的数据
        $('.prev-page').click(function() {
            pageNum--; //  页码+1
            if(pageNum <= 0) {
                pageNum = 1;
                $(this).attr("disabled", true).siblings().attr("disabled", false);
                layer.msg("我已经是第一页了！", { time: 2500 });
                return false;
            }
            window.localStorage.setItem("pageNum", pageNum)
            $(this).attr("disabled", false).siblings().attr("disabled", false);
            page_tab(pageNum);
        });

        //  点击加载更多后显示出下一页的数据
        $('.next-page').click(function() {
            if(limit * pageNum > total) {
                $(this).attr("disabled", true).siblings().attr("disabled", false);
                layer.msg("我是最后一页了！", { time: 2500 });
                return false;
            }
            $(this).attr("disabled", false).siblings().attr("disabled", false);
            pageNum++; //  页码+1
            window.localStorage.setItem("pageNum", pageNum)
            page_tab(pageNum);
        });
    }

    var page_tab = function(pageNum) {
        if((pathname.length == 2 && pathname[1] == "") || pathname.length == 1) {
            $(".list-article-ul").html("");
            cms_content(pageNum);
        } else {
            var option4 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&page=" + pageNum);
            option4.done(function(body) {
                if(!body.data.list.length) {
                    return false;
                }
                // 更多页的执行函数！
                $(".list-article-ul").html("");
                $.each(body.data.list, function(key, value) {
                    $(".list-article-ul").append(news_contents(value));
                });
            });
            // 请求失败函数
            option4.fail(function(error) {
                console.error(error)
            });
        }
    }

    $("#oooo").attr("href", "/" + pathname[0]);
});
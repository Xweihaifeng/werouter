/*
 *     组织部分数据覆盖
 */

$(function() {

    // console.warm(result_weid)
    var li_name, total, limit, pageNum = 1, cate_id;
    var get_param = window.location.pathname.split('/').pop();

    //  根据返回 url 取 pathname 的最后一位的值.
    if(get_param != "") {
        var options = $.get(CMS_CHANNELS_DOMAIN_QUERY + get_param);
        options.done(function(data) {
            console.log(data);
            if(data.code === 200) {
                get_param = data.data.weid;
                console.log(get_param);
            } else {
                console.error(data.message);
            }
        });
        options.fail(function(error) {
            console.error(error);
        });
    }

    var options1 = $.get("http://apitest.wezchina.com/cms/channel_categories?channel=" + get_param); // 栏目数据
    //  请求成功执行函数显示栏目列表
    options1.done(function(data) {
        if(data.code === 200) {
            $.map(data.data, function(item) {
                $("#menuX").append(news_channel_categories(item));
            });

            //  点击当前栏目筛选该栏目下所有的新闻列表
            $("#menuY").html(data.data[0].title);
            $(".chan_li").first().addClass("cate-active-on");
            li_name = $(".chan_li").first().attr("name");
            if(!get_param) {
                column(li_name, pageNum);
            }
            prev_next_page();
        } else {
            console.error(data.message);
        }

    });
    //  请求失败显示失败状态
    options1.fail(function(error) {
        console.info(error);
    })

    // 栏目显示区
    var news_channel_categories = function(result) {
        var template = `
            <a class="chan_li" name="` + result.weid + `" href="` + result.weid + `">` + result.title + `</a>`

        return template;
    }

    // 新闻详情显示区
    var news_contents = function(result) {
        var jumpUrl = result.weid;
        var template = `<li name="` + jumpUrl + `">
            <a href="`+ jumpUrl +`" target="_blank">` + result.title + `</a>
            <small>` + result.updated_at + `</small>
        </li>`

        return template;
    }

    // 栏目内容
    function column(li_name, page) {
        var options3 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&page=" + page);

        //  请求成功显示列表
        options3.done(function(body) {
            $(body.data.list).each(function(index, value) {
                $(".list-article-ul").append(news_contents(value));
            });
        });

        // 请求失败报错
        options3.fail(function(error) {
            console.error(error)
        });
    }

    $.ajax({
        url: CMS_DETAIL_CONTENTS_CATE_ID + get_param,
        type: 'get',
        dataType: 'JSON',
        success: function(body) {
            if(body.code === 200) {
                total = body.data.total;
                limit = body.data.params.limit;
                pageNum = body.data.params.page // 显示初始页面
                console.log(body.data);
                $(".paging").show();
                $(".chan_li").each(function() {
                    if($(this).attr("name") === get_param) {
                        $(this).addClass("cate-active-on").siblings().removeClass("cate-active-on");
                        $("#menuY").html($(this).text());
                        $("#menuY").attr("href", get_param);
                        // column(get_param, 1);
                        $(body.data.list).each(function(index, value) {
                            $(".list-article-ul").append(news_contents(value));
                        });
                    }
                });
            } else {
                console.error(body.message);
            }
        },
        error: function(error) {
            console.error(error)
        }
    });

    $.ajax({
        url: CMS_DETAIL + get_param,
        dataType: 'json',
        success: function(body){
            if(body.code === 200) {
                if(body.data != null) {
                    $(".paging").hide();
                    var result = body.data;
                    $(".list-article-ul").html(`<div class="org_content"><h3>` + result.summary + `</h3><div>` + result.content + `</div></div>`);
                    get_param = body.data.cate_id;
                    $.ajax({
                        url: CMS_DETAIL_CONTENTS_CATE_ID + get_param,
                        type: 'get',
                        dataType: 'JSON',
                        success: function(body) {
                            if(body.code === 200) {
                                $(".paging").hide();
                                $(".chan_li").each(function() {
                                    if($(this).attr("name") === get_param) {
                                        $(this).addClass("cate-active-on").siblings().removeClass("cate-active-on");
                                        $("#menuY").html($(this).text());
                                        $("#menuY").attr("href", get_param);
                                    }
                                });
                            } else {
                                console.error(body.message);
                            }
                        },
                        error: function(error) {
                            console.error(error)
                        }
                    });

                }
            } else {
                console.error(body.message);
            }
        },
        error: function(error){
            console.log(error);
        }
    });

    // 超出显示条数时提示
    function prompt(warm) {
        $(".prompt-info").html(warm);
        $(".prompt-info").slideToggle(function() {
            $(this).show();
        }, function() {
            $(this).fadeOut(1500);
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
                var my_is_first_page = '我已经是第一页了！'
                prompt(my_is_first_page);
                return false;
            }
            $(this).attr("disabled", false).siblings().attr("disabled", false);
            page_tab(pageNum);
        });

        //  点击加载更多后显示出下一页的数据
        $('.next-page').click(function() {
            if(limit * pageNum > total) {
                $(this).attr("disabled", true).siblings().attr("disabled", false);
                var my_is_last_page = '我是最后一页了！！'
                prompt(my_is_last_page);
                return false;
            }
            $(this).attr("disabled", false).siblings().attr("disabled", false);
            pageNum++; //  页码+1
            page_tab(pageNum);
        });
    }

    var page_tab = function(pageNum) {
        var option4 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&page=" + pageNum);
        option4.done(function(body) {
            if(!body.data.list.length) {
                prompt();
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
});
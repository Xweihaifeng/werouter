/*
 *     组织部分数据覆盖
 */

$(function() {

    var token = window.localStorage.getItem('token');
    $.ajaxSetup({
        global: true,
        async:  false,
        headers: {
            'Token': token,
        }
    });

    window.localStorage.setItem("pageNum", 1);
    var li_name, total, limit, pageNum = 1, get_param;
    var pathname = window.location.pathname.split('/').slice(1,4);

    get_param = pathname[0];
    var options = $.get(CMS_CHANNELS_DOMAIN_QUERY + get_param);
    options.done(function(data) {
        if(data.code === 200) {
            var thumb_image = data.data.thumb_image;

            if(!thumb_image) {
                thumb_image = "/common/img/org_banner01.jpg";

            } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                thumb_image = imgSet(thumb_image, 1100, 320, 3);
            }
            $("#thumb_image").css("background-image", `url(`+ thumb_image + `)`);

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

                if(!thumb_image) {
                    thumb_image = "/common/img/org_banner01.jpg";

                } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                    thumb_image = imgSet(thumb_image, 1100, 320, 3);
                }
                $("#thumb_image").css("background-image", `url(`+ thumb_image + `)`);

            } else {
                console.error(data.message);
            }
        });
        options.fail(function(error) {
            console.error(error);
        });
    }

    // 栏目显示区
    // href="/`+ pathname[0] +"/"+ result.domain + `"
    var news_channel_categories = function(result) {
        var template = `
            <a class="chan_li" id="` + result.domain + `" name="` + result.weid + `" href="/`+ pathname[0] +"/"+ result.domain + `" type="`+ result.type +`">` + result.title.substr(0, 4) + `</a>`

        return template;
    }

    // 页面绑定单页数据
    function single_page(get_param) {
        var options2 = $.get(CMS_CHANNEL_CATEGORIES + get_param);
        options2.done(function(data) {
            if(data.code === 200) {
                $.map(data.data, function(item, index) {
                    if(item.domain == pathname[1]) {
                        $(".article_list").addClass("z").html(item.title);
                        li_name = item.domain;
                        $(".list-article-ul").html("<div class='org_content'><div>"+ item.content +"</div></div>");
                    }
                });
            }
        })
    }

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

                    paging(total, limit);
                }
            },
            error: function(error) {
                console.error(error);
            }
        })
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

    // 分页显示
    var paging = function(total, limit) {
        var setTotalCount = total;
        $('#box').paging({
            initPageNo: 1,                                 // 初始页码
            totalPages: Math.ceil(setTotalCount/limit),    //总页数
            totalCount: '合计' + setTotalCount + '条数据', // 条目总数
            slideSpeed: 600,                               // 缓动速度。单位毫秒
            jump: true,                                    //是否支持跳转
            callback: function(page) {                     // 回调函数
                page_tab(page);
            }
        })
    }

    // 栏目列表内容
    function column(li_name, page) {
        var options3 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&page=" + page);
        options3.done(function(body) {
            total = body.data.total;
            limit = body.data.params.limit;
            pageNum = body.data.params.page // 显示初始页面

            $(body.data.list).each(function(index, value) {
                $(".list-article-ul").append(news_contents(value));
            });

            paging(total, limit);
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

    var page_tab = function(pageNum) {
        if((pathname.length == 2 && pathname[1] == "") || pathname.length == 1) {
            $(".list-article-ul").html("");
            $.ajax({
                url: CMS_CONTENTS + pathname[0] + "&page=" + pageNum,
                dataType: 'JSON',
                type: 'get',
                success: function(data) {
                    if(data.code == 200) {
                        // $(".list-article-ul").html("");
                        $(data.data.list).each(function(index, value) {
                            $(".list-article-ul").append(news_contents(value));
                        });
                    }
                },
                error: function(error) {
                    console.error(error);
                }
            })
        } else {
            li_name = $(".single_active").attr("id");
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

    function screen() {
        // URL部分 pathname 显示 数组长度
        if(pathname.length == 2 && pathname[1] != ''){
            li_name = pathname[1];
            column(li_name, pageNum);
        } else if((pathname.length == 2 && pathname[1] == '') || pathname.length == 1) {
            li_name = '';
            cms_content(pageNum);
        }
    }

    function menuTwo(result) {
        var template = `
            <a class="chan_li" id="`+ result.domain +`" name="`+ result.weid +`" href="/`+ pathname[0] +"/"+ result.domain +`" type="`+ result.type +`">`+ result.title +`</a>`

        return template;
    }


    // 上下翻页
    function prev_next_page() {

        //  点击加载更多后显示出上一页的数据
        $('#prev_btn').click(function() {
            pages--; //  页码-1

            if(pages <= 0) {
                pages = 1;
                $(this).attr("disabled", true).siblings().attr("disabled", false);
                layer.msg("我已经是第一页了！", { time: 2500 });
                return false;
            }
            window.localStorage.setItem("pageNum", pages)
            $(this).attr("disabled", false).siblings().attr("disabled", false);
            detail_content_cate(get_param, pages);
        });

        //  点击加载更多后显示出下一页的数据
        $('#next_btn').click(function() {
            if(limit * pages > total) {
                $(this).attr("disabled", true).siblings().attr("disabled", false);
                layer.msg("我是最后一页了！", { time: 2500 });
                return false;
            }
            $(this).attr("disabled", false).siblings().attr("disabled", false);
            pages++; //  页码+1
            window.localStorage.setItem("pageNum", pages)
            detail_content_cate(get_param, pages);
        });
    }

    // 页面绑定分类栏目列表数据
    var options2 = $.get(CMS_CHANNEL_CATEGORIES + get_param);
    options2.done(function(data) {
        if(data.code === 200) {
            console.info(data.data);
            $.map(data.data, function(item, index) {
                if(index < 13) {
                    $("#menuX").append(news_channel_categories(item));
                }
            });

            li_name = $(".chan_li").first().attr("id");
            if($("#"+ pathname[1]).attr("type") == 1) {
                single_page(get_param);
            } else {
                var menu_two = $("#"+ pathname[1]).attr("name");
                var options4 = $.get(apiUrl + "cms/cate_categories?cate=" + menu_two);
                options4.done(function(body4) {
                    if(body4.code == 200) {
                        if(body4.data.length > 0) {
                            $("#menuTwo").html("");
                            var result = body4.data;
                            console.log(result);
                            $.map(result, function(value, key) {
                                if(key < 10) {
                                    $("#menuTwo").append(menuTwo(value));
                                }
                            });

                            li_name = $("#menuTwo").children().first().attr("id");
                            // var li_name = window.location.pathname.split('/').slice(1,4)[1];
                            $('#' + li_name).addClass("single_active").siblings().removeClass("single_active");
                            column(li_name, pageNum);
                        } else {
                            screen();
                        }
                    }
                });
                options4.fail(function(error) {
                    console.error(error);
                });                    
            }

            // 最新发布样式呈现
            if(li_name == "oooo" || li_name == "") {
                $('#oooo').addClass("cate-active-on").siblings().removeClass("cate-active-on");
                $("#menuY").html($("#oooo").text());
                document.title = $("#oooo").text();
            } else {
                li_name = window.location.pathname.split('/').slice(1,4)[1];
                $('#' + li_name).addClass("cate-active-on").siblings().removeClass("cate-active-on");
                $("#menuY").html($('#' + li_name).text());
                document.title = $("#" + li_name).text();
            }
        } else {
            console.error(data.message);
        }
    });
    options2.fail(function(error) {
        console.info(error);
    })

    $("#oooo").attr("href", "/" + pathname[0]);
});
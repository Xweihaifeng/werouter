/*
 *     组织部分数据覆盖
 */

$(function() {

    var pages = window.localStorage.getItem("pageNum");
    if(!pages) {
        window.localStorage.setItem("pageNum", 1);
    }
    var get_weid, get_parse, get_param, li_name, total, limit = 10, pageNum = 1;
    var pathname = window.location.pathname.split('/').slice(1,3);

    get_weid = pathname[0];
    var options1 = $.get(CMS_CHANNELS_DOMAIN_QUERY + get_weid);
    options1.done(function(data) {
        if(data.code == -200) {
            console.info(data.message);
            return false;
        }
        if(data.code === 200) {
            var thumb_image = data.data.thumb_image;

            if(!thumb_image) {
                thumb_image = "/common/img/org_banner01.jpg";

            } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                thumb_image = imgSet(thumb_image, 1100, 320, 3);
            }
            $("#thumb_image").css("background-image", `url(`+ thumb_image + `)`);

            get_weid = data.data.weid;
            categories(get_weid);
        } else {
            console.error(data.message);
        }
    });
    options1.fail(function(error) {
        console.error(error);
    });

    if(pathname.length == 2 && pathname[1] != '') {
        get_parse = pathname[1];
        var options2 = $.get(CMS_DETAIL + get_parse);
        options2.done(function(body) {

            document.title = body.data.title;
            if(body.code === 200) {
                get_param = body.data.cate_id;
                if(body.data != null) {
                    $(".paging").hide();
                    $(".list-article-ul").html(`<div class="org_content"><h3>` + body.data.summary + `</h3><div>` + body.data.content + `</div></div>`);
                }

                var options3 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + get_param + "&page=" + pages);
                options3.done(function(data) {
                    if(data.code === 200) {
                        total = data.data.total;

                        $.map(data.data.list, function(item) {
                            $(".org_art_title").append(news_art_title(item));
                        });

                        $(".org_art_title .z").each(function() {
                            if($(this).attr('id') == get_parse) {
                                li_name = $(this).attr('id');
                                $(this).addClass("csdf").siblings().removeClass("csdf");
                            }
                        });

                        $("#menuY").next().attr("href", get_parse);
                        $("#menuY").next().text($('#' + li_name).text());
                        prev_next_page();
                    } else {
                        console.warn(data.message);
                    }
                })
                options3.fail(function(error) {
                    console.error(error);
                })

            } else {
                console.warn(body.message);
            }
        })
        options2.fail(function(error) {
            console.error(error);
        })
    }

    // 一级导航栏目逻辑函数
    function detail_content_cate(get_param, pages) {
        $(".org_art_title a").remove();
        var options3 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + get_param + "&page=" + pages);
        options3.done(function(data) {
            if(data.code === 200) {
                total = data.data.total;

                $.map(data.data.list, function(item) {
                    $(".org_art_title").append(news_art_title(item));
                });

                $(".org_art_title .z").each(function() {
                    if($(this).attr('id') == get_parse) {
                        li_name = $(this).attr('id');
                        $(this).addClass("csdf").siblings().removeClass("csdf");
                    }
                });
            } else {
                console.warn(data.message);
            }
        })
        options3.fail(function(error) {
            console.error(error);
        })       
    }

    // 栏目数据逻辑
    function categories(weid) {
        var options1 = $.get(CMS_CHANNEL_CATEGORIES + weid);
        options1.done(function(data) {
            if(data.code === 200) {
                $.map(data.data, function(item, index) {
                    if(index < 13) {
                        $("#menuX").append(news_channel_categories(item));
                    }
                });

                li_name = $(".chan_li").first().attr("id");
                if(pathname.length == 2 && pathname[1] != ''){
                    $(".chan_li").each(function() {
                        if($(this).attr("name") == get_param) {
                            li_name = $(this).attr('id');
                            $(this).addClass("cate-active-on").siblings().removeClass("cate-active-on");
                            $("#menuY").html($(this).text());
                            $("#menuY").attr("href", li_name);
                        }
                    });
                } else if((pathname.length == 2 && pathname[1] == '')
                        || pathname.length == 1) {
                    li_name = '';
                }

                if(li_name == "oooo" || li_name == "") {
                    $('#oooo').addClass("cate-active-on").siblings().removeClass("cate-active-on");
                }

                $('#' + li_name).addClass("cate-active-on").siblings().removeClass("cate-active-on");
                // document.title = $("#" + li_name).text();
                $("#menuY").html($('#' + li_name).text());

            } else {
                console.error(data.message);
            }
        });
        options1.fail(function(error) {
            console.info(error);
        })        
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

    // 默认加载项
    $("#oooo").attr("href", "/" + pathname[0]);
    $(".org_art_title").prepend("<input type='button' id='prev_btn'>");
    $(".org_art_title").append("<input type='button' id='next_btn'>");

    // 一级分类栏目呈现
    var news_channel_categories = function(result) {
        var template = `
            <a class="chan_li" id="` + result.domain + `" name="` + result.weid + `" href="/`+ pathname[0] +"/"+ result.domain + `">` + result.title.substr(0, 4) + `</a>`;
        return template;
    }

    // 二级目录栏目显示
    var news_art_title = function(result) {
        var template = `
            <a class="z" href="` + result.weid + `" id="` + result.weid + `">` + result.title.substr(0, 4) + `</a>`;
        return template;
    }
});
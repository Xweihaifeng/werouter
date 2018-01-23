$(function() {

    window.localStorage.setItem("pageNum", 1);
    var token = docCookies.getItem("token");
    var pathname = window.location.pathname.split('/').slice(1,4);
    var li_name, total, limit, pageNum = 1;
    var get_param = pathname[0];
    var domain_weid = '';

    $.ajax({
        url: CMS_CHANNELS_DOMAIN_QUERY + pathname[0],
        dataType: 'JSON',
        async:  false,
        type: 'get',
        success: function(data) {
            if(data.code === 200) {
                domain_weid = data.data.weid;
                var thumb_image = data.data.big_image;

                if(!thumb_image) {
                    thumb_image = "/common/img/org_banner01.jpg";

                } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                    thumb_image = imgSet(thumb_image, 1100, 320, 3);
                }
                $("#thumb_image").css("background-image", `url(`+ thumb_image + `)`);

            } else {
                console.error(data.message);
            }
        },
        error: function(error) {
            console.error(error);
        }
    })

    if(pathname.length == 2 && pathname[0] != '') {
        $.ajax({
            url: CMS_CHANNELS_DOMAIN_QUERY + pathname[0],
            dataType: 'JSON',
            async:  false,
            type: 'get',
            success: function(data) {
                if(data.code === 200) {
                    var thumb_image = data.data.big_image;

                    if(!thumb_image) {
                        thumb_image = "/common/img/org_banner01.jpg";

                    } else if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                        thumb_image = imgSet(thumb_image, 1100, 320, 3);
                    }
                    $("#thumb_image").css("background-image", `url(`+ thumb_image + `)`);

                } else {
                    console.error(data.message);
                }
            },
            error: function(error) {
                console.error(error);
            }
        })

    }

    // 栏目显示区
    var news_channel_categories = function(result) {
        var template = `<li><a class="chan_li" id="` + result.domain + `" name="` + result.weid + `" href="/`+ pathname[0] +"/"+ result.domain + `" type="`+ result.type +`">` + result.title.substr(0, 4) + `</a>`+`</li> `
        return template;
    }

    // 页面绑定单页数据
    function single_page(domain_weid) {
        var options2 = $.get(CMS_CHANNEL_CATEGORIES + domain_weid);
        options2.done(function(data) {
            if(data.code === 200) {
                $.map(data.data, function(item, index) {
                    if(item.domain == pathname[1]) {
                        $(".article_list").addClass("z").html(item.title);
                        console.log(item.domain)
                        li_name = item.domain;
                        $(".newsert").html("<div class='org_content'><div>"+ item.content +"</div></div>");
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
        var template;
        if(result.thumb_image){
            template = `<li name="` + jumpUrl + `">
            <a href="">
                <img src="`+result.thumb_image+`" alt="">
            </a>
             <div class="new2-left">
                <h2>
                   <a href="/`+ pathname[0]+"/"+ jumpUrl +`" target="_blank">` + result.title + `</a>
                </h2>
                <p>
                    <a href="/`+ pathname[0]+"/"+ jumpUrl +`" target="_blank">`+result.summary+`</a>
                </p>
                <div class="all">
                    <span>时间：`+ result.publish_time +`</span>
                    <a href="/`+ pathname[0]+"/"+ jumpUrl +`" target="_blank">查看更多 +</a>
                </div>
            </div>
        </li>`
        }else{
            template = `<li name="` + jumpUrl + `">
             <div class="new2-left" style="width: 100%;float: left">
                <h2>
                   <a href="/`+ pathname[0]+"/"+ jumpUrl +`" target="_blank">` + result.title + `</a>
                </h2>
                <p>
                    <a href="/`+ pathname[0]+"/"+ jumpUrl +`" target="_blank">`+result.summary+`</a>
                </p>
                <div class="all">
                    <span>时间：`+ result.publish_time +`</span>
                    <a href="/`+ pathname[0]+"/"+ jumpUrl +`" target="_blank">查看更多 +</a>
                </div>
            </div>
        </li>`
        }


        return template;
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
                if(this.totalPages==1){
                    $('.paging').html("")
                }
            }
        })

    }
    var page_tab = function(pageNum) {
        if((pathname.length == 2 && pathname[1] == "") || pathname.length == 1) {
            $(".new2").html("");
            $.ajax({
                url: CMS_CONTENTS + pathname[0] + "&page=" + pageNum,
                dataType: 'JSON',
                type: 'get',
                success: function(data) {
                    if(data.code == 200) {
                        $(data.data.list).each(function(index, value) {
                            $(".new2").append(news_contents(value));
                        });
                    }
                },
                error: function(error) {
                    console.error(error);
                }
            })
        } else {
            li_name = $(".cenav_cur").attr("id");
            var option4 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&page=" + pageNum);
            option4.done(function(body) {
                if(!body.data.list.length) {
                    return false;
                }
                // 更多页的执行函数！
                $(".new2").html("");
                $.each(body.data.list, function(key, value) {
                    $(".new2").append(news_contents(value));
                });
            });
            option4.fail(function(error) {
                console.error(error)
            });
        }
    }

    // 栏目列表内容
    function column(li_name, page) {
        var options3 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name + "&page=" + page);
        options3.done(function(body) {
            total = body.data.total;
            limit = body.data.params.limit;
            pageNum = body.data.params.page // 显示初始页面

            var two_type = $("#" + pathname[1]).attr("type");
            if(two_type == 0 && body.data.list.length == 0) {
                $(".new2").html("<li>暂无内容</li>");

                paging(total, limit);
            } else {
                $(body.data.list).each(function(index, value) {
                    $(".new2").append(news_contents(value));
                });

                paging(total, limit);                
            }
        });
        options3.fail(function(error) {
            console.error(error)
        });
    }

    // pathname长度
    function screen() {
        if(pathname.length == 2 && pathname[1] != ''){
            li_name = pathname[1];
            column(li_name, pageNum);
        } else if((pathname.length == 2 && pathname[1] == '') || pathname.length == 1) {
            li_name = '';
            cms_content(pageNum);
        }
    }

    // 组织二级分类
    function menuTwo(result) {
        var template = `<a class="chan_li" id="`+ result.domain +`" name="`+ result.weid +`" href="/`+ pathname[0] +"/"+ result.domain +`" type="`+ result.type +`">`+ result.title +`</a>`
        return template;
    }

    // 二级判断点击加载
    function default_two(menu_two, show_two) {
        $.ajax({
            url: apiUrl + "cms/cate_categories?cate=" + menu_two,
            dataType: 'json',
            async:  false,
            success: function(body4){
                if(body4.code == 200) {

                    if(body4.data.length > 0) {

                        $("#menuTwo").html("");
                        var result = body4.data;

                        result.forEach(function(value, key) {
                            if(key < 10 && value.index_show == 1) {
                                $("#menuTwo").append(menuTwo(value));
                            }
                        });

                        column(show_two, pageNum);
                        document.title = $('#' + pathname[1]).text() + " — " + localStorage.getItem("title");

                    } else {

                        // 没有二级分类
                        screen();
                    }
                }
            }
        })
    }

    // 二级判断默认加载
    function default_two2(menu_two, show_two) {
        $.ajax({
            url: apiUrl + "cms/cate_categories?cate=" + menu_two,
            dataType: 'json',
            async:  false,
            success: function(body4){
                if(body4.code == 200) {

                    if(body4.data.length > 0) {

                        $("#menuTwo").html("");
                        var result = body4.data;

                        result.forEach(function(value, key) {
                            if(key < 10 && value.index_show == 1) {
                                $("#menuTwo").append(menuTwo(value));
                            }
                        });
                        show_two = $("#menuTwo").children().first().attr("id");
                        $("#menuTwo").children().first().addClass("er-cur").siblings().removeClass("er-cur");
                        $('#' + show_two).parent("li").addClass("cenav_cur").siblings().removeClass("cenav_cur");
                        document.title = $('#' + show_two).text() + " — " + localStorage.getItem("title");
                        
                        $.ajax({
                            url: apiUrl + "cms/categories/domain_query/" + show_two,
                            dataType: 'JSON',
                            async:  false,
                            success: function(data) {
                                if(data.code === 200) {
                                    if(data.data.type == 1) {
                                        two_ul(data.data);
                                        $(".paging").hide();
                                    } else {
                                        column(data.data.domain, pageNum);
                                    }
                                } else {
                                    console.error(data.message);
                                }
                            },
                            error: function(error) {
                                console.error(error);
                            }
                        }) 

                    } else {

                        // 没有二级分类
                        screen();
                    }
                }
            }
        })
    }

    function two_ul(result) {
        $(".newsert").html("");
        $(".newsert").html(`<div class="org_content"><h3>` + result.title + `</h3><div>` + result.content + `</div></div>`);
    }

    // Cms - 获取类目(根据频道weid)
    $.ajax({
        url: CMS_CHANNEL_CATEGORIES + domain_weid,
        dataType: 'json',
        success: function(data){
            if(data.code === 200) {

                // 一级分类
                data.data.forEach(function(item, index) {
                    if(index < 13) {
                        $("#menuX").append(news_channel_categories(item));
                    }
                });

                li_name = $("#menuX .chan_li").first().attr("id");
                if($("#"+ pathname[1]).attr("type") == 1) {

                    // 单页执行
                    single_page(domain_weid);
                    $('#' + pathname[1]).parent("li").addClass("cenav_cur").siblings().removeClass("cenav_cur");
                    $(".wz").text('>'+  $('#' + pathname[1]).text());
                    $(".title>span").text($('#' + pathname[1]).text());
                } else {

                    // 非单页执行
                    // 二级分类
                    if(pathname[1] == '' || pathname[1] == undefined || pathname[1] == null) {
                        default_two("org");
                    } else {
                        $.ajax({
                            url: apiUrl + "cms/categories/domain_query/" + pathname[1],
                            dataType: 'json',
                            success: function(body5){
                                if(body5.code === 200) {
                                    var parend_id = body5.data.parent_id;
                                    if(parend_id != null && parend_id != undefined && parend_id != '') {

                                        // 一级分类着色
                                        $.ajax({
                                            url: apiUrl + "cms/categories/" + parend_id,
                                            dataType: 'json',
                                            async:  false,
                                            success: function(data){
                                                if(data.code === 200) {
                                                    document.title = $('#' + pathname[1]).text() + " — " + localStorage.getItem("title");
                                                    $('#' + data.data.domain).parent("li").addClass("cenav_cur").siblings().removeClass("cenav_cur");
                                                    $("#menuY").text(data.data.title);
                                                    document.title = $('#' + pathname[1]).text() + " — " + localStorage.getItem("title");
                                                }
                                            }
                                        });

                                        default_two(parend_id, pathname[1]);
                                        $('#' + pathname[1]).addClass("er-cur").siblings().removeClass("er-cur");

                                        if($("#"+ pathname[1]).attr("type") == 1) {
                                            $.ajax({
                                                url: apiUrl + "cms/categories/domain_query/" + pathname[1],
                                                dataType: 'JSON',
                                                async:  false,
                                                success: function(data) {
                                                    if(data.code === 200) {
                                                        $(".wz").text('>'+  data.data.title);
                                                        $(".title>span").text(data.data.title);
                                                        two_ul(data.data);
                                                        $(".paging").hide();
                                                        return false;
                                                    } else {
                                                        console.error(data.message);
                                                    }
                                                },
                                                error: function(error) {
                                                    console.error(error);
                                                }
                                            })
                                        }
                                    } else {
                                        var menu_two = $("#"+ pathname[1]).attr("name");
                                        default_two2(menu_two, pathname[1]);
                                        $('#' + pathname[1]).parent("li").addClass("cenav_cur").siblings().removeClass("cenav_cur");
                                        $(".wz").text('>'+  $('#' + pathname[1]).text());
                                        $(".title>span").text($('#' + pathname[1]).text());
                                        document.title = $('#' + pathname[1]).text() + " — " + localStorage.getItem("title");
                                    }
                                }
                            }
                        })
                    }
                }

            } else {
                console.error(data.message);
            }
        }
    });

    $("#oooo").attr("href", "/zz");
    if(pathname[1] == null || pathname[1] == undefined) {
        document.title = "最新发布 — " + localStorage.getItem("title");
        $("#oooo").parent("li").addClass("cenav_cur");
    }
});
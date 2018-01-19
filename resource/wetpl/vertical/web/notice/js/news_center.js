/*
 * * 新闻中心频道栏目、新闻列表
 */
$(function() {
    var options = $.get(CMS_CONTENTS_HOT);             // 热点新闻数据
    var options1 = $.get(CMS_CHANNEL_CATEGORIES);      // 栏目数据
    var options2 = $.get(CMS_CONTENTS);                // 新闻详情数据
    var ApiMaterPlatQiniuDomain = 'http://oty3r3tmi.bkt.clouddn.com/';
    $('.prompt-info').hide();

    // 热点新闻显示区
    var news_hots = function(result) {
        var jumpUrl = result.weid;
        var thumb_image = result.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
        }
        var template = `
            <div class="hotsinfo">
                <a href="`+ jumpUrl +`" target="_top" >
                    <img src="`+ thumb_image +`" alt="">
                    <p>`+ result.title +`</p>
                </a>
            </div>`

        return template;
    }

    // 栏目显示区
    var news_channel_categories = function(result) {
        var template = `
            <li class="chan_li" name="`+ result.weid +`">
                <a href="#"> `+ result.title +` </a>
            </li>`

        return template;
    }

    // 新闻详情显示区
    var news_contents = function(result) {
        var jumpUrl = result.weid;
        var thumb_image = result.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
        }

        var template = `
            <li class="article-item new-list-box flex">
                <div class="details-header"><a href="`+ jumpUrl +`" target="_top" class="list-img">`;

                    if(thumb_image != ""){
                        template= template +`<img src="`+ thumb_image +`" class="new-list-img" id="list_img">`;
                    }            
                    template= template+`</a></div> <div class="details-title">
                    <h3 class="list-title"><a class="title_a" href="`+ jumpUrl +`" target="_top" >`+ result.title +`</a></h3>
                    <div class="zhu-yao-nei-rong">`+ result.content +`</div>
                    <div class="a-none"><a class="a-none" style="color: #007cd3;" href="`+ jumpUrl +`" target="_top" >查看全文</a></div>
                    <div class="pageviews center-disperse">
                        <div class="new-issuser "><span>`+ result.auth +` <b> · </b></span><span>`+ result.created_at +`</span><span>浏览量：<span style="color: #007cd3;">`+ result.views +`</span></span></div>
                        <div><a href="#"><span class="article-cate new-title">`+ result.cate_name +`</span></a></div>
                    </div>
                </div>
            </li>`

        return template;
    }

    //  请求成功执行函数显示热点新闻
    options.done(function (data) {
        if (data.code === 200 ) {
            $.map(data.data.list, function(item) {
                $(".news-center-top").append(news_hots(item));
            });
        } else {
            alert(data.message);
        }
    });

    //  请求失败显示失败状态
    options.fail(function (error) {
        console.info(error);
    });

    //  请求成功执行函数显示栏目列表
    options1.done(function (data) {
        if (data.code === 200 ) {
            $.map(data.data, function(item) {
                $(".news-center-main-title").append(news_channel_categories(item));
            });

            //  点击当前栏目筛选该栏目下所有的新闻列表
            $(".chan_li").click(function(){
                document.title = $(this).text();
                $(".news-center-main").html("");    // 初始化内容显示区

                $(this).addClass("csdf").siblings().removeClass("csdf");
                var li_name = this.getAttribute("name");

                var options3 = $.get(CMS_DETAIL_CONTENTS_CATE_ID + li_name );

                //  请求成功显示列表
                options3.done(function(body) {
                    $(body.data.list).each(function(index, value) {
                        $(".news-center-main").append(news_contents(value));
                        $(".zhu-yao-nei-rong img").hide();
                    })
                });

                // 请求失败报错
                options3.fail(function(error) {
                    alert(error)
                });
            })
        } else {
            alert(data.message);
        }

    });

    //  请求失败显示失败状态
    options1.fail(function (error) {
        console.info(error);
    })

    options2.done(function (data) {
        if (data.code === 200 ) {
            $.each(data.data.list, function(index, item) {
                $(".news-center-main").append(news_contents(item));
                $(".zhu-yao-nei-rong img").hide();
            });

            var pageNum = data.data.params.page    // 显示初始页面

            //  点击加载更多后显示出第二页的数据
            $('#news_loadingsImg').click(function() {

                pageNum += 1;        //  页码+1

                var option4 = $.get(CMS_CONTENTS + pageNum);
                option4.done(function(body) {
                    
                    if(!body.data.list.length) {
                        $('.prompt-info').html('我是最后一页了！');
                        $(".prompt-info").slideToggle(function() {
                            $(this).show();
                        },function(){
                            $(this).fadeOut(2000);
                        });
                        return false;
                    }
                    // 更多页的执行函数！
                    $.each(body.data.list, function(key, value) {
                        $(".news-center-main").append(news_contents(value));
                        $(".zhu-yao-nei-rong img").hide();
                    });
                });

                // 请求失败函数
                option4.fail(function(error) {
                    console.error(error)
                });
            });
        } else {
            alert(data.message);
        }
    });

    //  请求失败显示失败状态
    options2.fail(function (error) {
        console.info(error);
    })

})
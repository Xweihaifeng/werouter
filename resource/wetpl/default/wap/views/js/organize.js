/*
 *     组织部分数据覆盖
 */

$(function() {

    var pages = window.localStorage.getItem("pageNum");
    if(!pages) {
        window.localStorage.setItem("pageNum", 1);
    }
    var get_weid, get_parse;
    var pathname = window.location.pathname.split('/').slice(1,3);

    get_weid = pathname[0];

    // 组织内容部分显示
    var news_detail = function(result) {
        document.title = result.title;
        var thumb_image = result.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
        }
        if(result.is_original == 1) {
            result.is_original = "原创";
        }
            /*<div class="clearfix bts">
                <span class="publisher">` + result.publisher.substr(0, 5) + `</span>
                <span class="author">` + result.auth.substr(0, 5) + `</span>
                <span class="source_url">`+ result.source_url +`</span>
                <span class=updated_at">` + result.publish_time.substr(0, 10) + `</span>
                <span class="original">` + result.is_original + `</span>
            </div>*/
        var template = `
            <p class="rich_media_title" id="activity-name">` + result.title + `</p>
            <div class="page-info"><div class="page-details"><p>` + result.content + `</p></div></div>
            `
            // <div class="evaluate"><p class="readings"><a class="read_original" href="`+ result.source_url +`" target="_blank"> 阅读原文 </a><span>阅读 ` + result.views + `</span><span class="zan" id="zan"><i class="gesture"></i><span class="zanCount">` + result.praise_num + `<span></span></p></div>
        return template;
    }

    if(pathname.length == 2 && pathname[1] != '') {
        get_parse = pathname[1];
        var options2 = $.get(CMS_DETAIL + get_parse);
        options2.done(function(body) {

            document.title = body.data.title;
            if(body.code === 200) {
                var result = body.data;
                if(!result) {
                    window.location.href = "/404";
                } else {
                    $(".list-article-ul").html(news_detail(result));
                }

            } else {
                console.warn(body.message);
            }
        })
        options2.fail(function(error) {
            console.error(error);
        })
    } else {
        window.location.href = "/404";
    }
});
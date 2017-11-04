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
    // var ApiMaterPlatQiniuDomain = 'http://oty3r3tmi.bkt.clouddn.com/';

    get_weid = pathname[0];
    var options1 = $.get(CMS_CHANNELS_DOMAIN_QUERY + get_weid);
    options1.done(function(data) {
        if(data.code == -200) {
            console.info(data.message);
            return false;
        }
        if(data.code === 200) {
            var thumb_image = data.data.thumb_image;
            if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                thumb_image = ApiMaterPlatQiniuDomain + thumb_image;
                // thumb_image = imgSet(thumb_image, 1100, 235, 3);
            }
            if(thumb_image != ""){
                $("#thumb_image").attr("src", thumb_image);
            }
            console.log(data);
            get_weid = data.data.weid;
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

            } else {
                console.warn(body.message);
            }
        })
        options2.fail(function(error) {
            console.error(error);
        })
    }
});
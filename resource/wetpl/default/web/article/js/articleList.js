/**
 * Created by Yaoer on 2017/8/13.
 */

$(document).ready(function(){

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    var weid = docCookies.getItem("weid");

    //个性域名获取
    var domain = window.location.href.split('/');
    var len = domain.length;
    if (domain[len - 1] != '') {
        domain = domain[len - 1];
    } else {
        domain = domain[len - 2];
    }
    console.log('domain:', domain)

    $(".linkto").attr('href', '/' + domain)

    var readAmount = function(id){
        console.log(id);
        $.ajax({
            url: ARTICLES_VIEW,
            type: 'post',
            data: {"articleId": id},
            success: function(data){
                console.log(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var type = [];
    var artTypeList = function(weid, cb){
        $.ajax({
            url: ARTICLES_CATES,
            dataType: 'json',
            success: function(data){
                console.log(data)
                if (data.code == 200) {
                    var list = data.data;
                    list.map(x => type.push({id: x.weid, name: x.name}));
                    cb(weid);
                } else {
                    console.log('ARTICLES_CATES ERROR')
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var dayCount = 0;
    var dayId;
    var dayTemplate = function(data){
        var template = `
        <div class="day" id=` + dayId + `>
            <div class="circle"></div>
            <div class="date">` + data.created_at.substring(0, 10) + `</div>
        </div>
        `
        return template;
    }

    var coverId = 0;
    var coverPicId = '';
    var artTemplate = function(data){
        var tp = type.filter(x => data.cate_id === x.id)[0].name;
        var template = `
        <div class="day-art" id=` + data.weid + `>
            <div class="day-cover"><div class="day-type">` + tp + `</div><img id=` + coverPicId + ` class="lazy" data-original=` + data.cover + ` width="240px" height="145px" style="margin-top: -30px;"/></div>
            <div class="day-title">` + data.title.substring(0, 24) + `</div>
            <div class="day-summary">` + data.summary.substring(0, 90) + `...</div>
            <div class="day-info">
                <img src="/common/img/icon_see_normal.png" alt="" width="20"/>
                <span>浏览量：` + data.views + `</span>
            </div>
        </div>
        `
        return template;
    }

    var memDate;
    var genDayArts = function(data, domain){
        coverPicId = "cover-pic-" + coverId;
        if (data.created_at.substring(0, 10) === memDate){
            $("#" + dayId).append(artTemplate(data));
        } else {
            memDate = data.created_at.substring(0, 10);
            dayId = "day-" + dayCount;
            dayCount++;
            $("#art-main").append(dayTemplate(data));
            $("#" + dayId).append(artTemplate(data));
        }

        if (data.cover != "") {
            var coverPicCss = {
                'background': 'url(' + data.cover + ') no-repeat center',
                'background-size': '100%'
            }
        } else {
            var coverPicCss = {
                'background': 'url(/common/img/vote_front_cover.png) no-repeat center',
                'background-size': '100%'
            }
        }

        // $("#" + coverPicId).hide();
        // $("#" + coverPicId).css(coverPicCss);
        // $("#" + coverPicId).fadeIn(500);
        $("#" + data.weid).click(function(e){
            var artId = $(e.target).parents(".day-art").attr("id");
            readAmount(artId);
            window.location.href = "/" + domain + "/article/" + artId;
        })

        coverId++;

    }

    var lazyLoad = function(){
        $(".lazy").lazyload({
            effect: "fadeIn",        
            placeholder: '/common/img/vote_front_cover.png'
        })
    }

    var getArtList = function(weid){
        $.ajax({
            url: ARTICLE_LIST + '?userId=' + weid,
            type: 'get',
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    console.log(data.data.list)
                    var art = data.data.list;
                    art.map(x => genDayArts(x, domain))
                    lazyLoad();
                } else {
                    console.log("error");
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var artCount = function(weid){
        $.ajax({
            url: ARTICLES_LISTCOUNT + "?userId=" + weid,
            type: 'get',
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    $(".user-art").children('div:eq(0)').text(data.data);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    var countinfo=function(weid){
          $.ajax({
            // url: apiUrl+"/articles/listCount?userId=" + weid,
            url: PAGES_PAGE_COUNTAGEINFO+"/" + weid,
            type: 'get',
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    $(".user-proj").children('div:eq(0)').text(data.data.project_count);
                    $(".user-type").children('div:eq(0)').text(data.data.activity_count);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    artTypeList(pages_info.plats_domian.plat_user_id, getArtList);
    artCount(pages_info.plats_domian.plat_user_id);
    countinfo(pages_info.plats_domian.plat_user_id);
})
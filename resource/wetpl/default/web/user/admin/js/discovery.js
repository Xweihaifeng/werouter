/**
 * Created by Yaoer on 2017/8/6.
 */

$(document).ready(function(){
    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle, #right").height(currHeight);
    $(window).resize(function(){
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function(){
        $(".add").show();
    }, function(){
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function(){
        $(".avatar").show();
    }, function(){
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function(){
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    var articleTemplate = function (data) {
        var template =
            `<div class="show-art" id=` + data.weid + `>
            <div class="show-title">
                <div class="at">` + data.title.substring(0, 17) + `</div>
                <div class="ad">` + data.created_at.substring(0, 10) + `</div>
            </div>
            <div class="show-pic"></div>
            <div class="show-cont">` + data.summary.substring(0, 80) + `...</div>
            <div class="show-bottom">
                <div class="show-read">
                    <img src="../common/img/icon_see_normal.png" width="20" alt="" />&nbsp;&nbsp;查看
                </div>
            </div>
        </div>`

        return template;
    }

    var coverId = 0;
    var artsList = [];
    var genArticles = function (arts) {
        arts.map(x => {
            if (x.cover != "") {
                var coverPicCss = {
                    'background': 'url(' + x.cover + ') no-repeat center',
                    'background-size': '100%'
                }
            }
            else {
                var coverPicCss = {
                    'background': 'url(../common/img/p2240256385.jpg) no-repeat center',
                    'background-size': '100%'
                }
            }

            $("#right").append(articleTemplate(x));
            $("#" + x.weid + " .show-pic").css(coverPicCss);
            $("#" + x.weid).click(function (e) {
                var cid = $(e.target).attr('class');
                window.location.href = '../article/' + x.weid;
            });
            $("#" + x.weid).hide();
            artsList.push(x.weid);
            coverId++;
        })
    }

    var returnPart = function(data, start, end){
        return data.slice(start, start + end);
    }

    var start = 0;
    var perLoad = 8; //默认一次加载条数
    var loadMore = function(data) {
        var res = returnPart(data, start, perLoad);
        console.log(res);
        start += perLoad;
        genArticles(res);
        artsList.map(x => {
            $("#" + x).fadeIn(700);
        });
        $(".more").remove();
        if (res == "") {
            $("#right").append('<div class="more">-- 已经没有了 --</div>');
        } else {
            $("#right").append('<div class="more">-- 点击加载更多 --</div>');
        }
        $(".more").click(function(){
            loadMore(data);
        })
    }

    var artList = function(){
        $.ajax({
            url: ARTICLES,
            type: 'get',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var arts = data.data.list;
                    var res = returnPart(arts, start, perLoad);
                    start += perLoad;
                    genArticles(res);
                    artsList.map(x => {
                        $("#" + x).fadeIn(700);
                    });
                    if (res == "") {
                        $("#right").append('<div class="none">-- 已经没有了 --</div>');
                    } else {
                        $("#right").append('<div class="more">-- 点击加载更多 --</div>');
                    }

                    $(".more").click(function(){
                        loadMore(arts);
                    })
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    artList();

})
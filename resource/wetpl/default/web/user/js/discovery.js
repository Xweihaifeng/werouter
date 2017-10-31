/**
 * Created by Yaoer on 2017/8/6.
 */


// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_3"){
	$("#we_title_3").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_3").find(".title-img").css("transform","rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
// console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

$(document).ready(function(){

    var articleTemplate = function (data) {
        var template =
           `<a href="/` + data.domain + `/article/` + data.weid + `" target="_blank"><div class="show-art" id=` + data.weid + `>
            <div class="show-title" id=` + data.domain + `>
                <div class="at">` + data.title.substring(0, 17) + `</div>
                <div class="ad">` + data.created_at.substring(0, 10) + `</div>
            </div>
            <div class="show-pic"></div>
            <div class="show-cont">` + data.summary.substring(0, 60) + `...</div>
            <div class="show-bottom">
                <div class="show-read">
                    <img src="/common/img/icon_see_normal.png" width="20" alt="" />
                </div>
            </div>
            <div class="show-shade" style="display: none;"><p>预览文章</p></div>
            </div></a>`

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
                    'background': 'url(/common/img/vote_front_cover.png) no-repeat center',
                    'background-size': '100%'
                }
            }

            $("#right").append(articleTemplate(x));
            $("#" + x.weid + " .show-pic").css(coverPicCss);
            $("#" + x.weid).click(function (e) {
                var cid = $(e.target).attr('class');
                var dm = $(this).find(".show-title").attr("id")
                // window.location.href = '/' + dm + '/article/' + x.weid;
            });
            $("#" + x.weid).hide();
            artsList.push(x.weid);
            coverId++;

            var lock = false;
            $("#" + x.weid).hover(function () {
                if (!lock) {
                   $(this).find('.show-shade').show();            
                   lock = true;
                   $(this).find('.show-shade').click(function(){
                      // window.location.href = domain + '/article/' + x.weid;
                   });
                }
            },function () {            
                   $(this).find('.show-shade').hide();
                   lock = false;            
            });
        })
    }

    var returnPart = function(data, start, end){
        return data.slice(start, start + end);
    }

    var start = 0;
    var perLoad = 9; //默认一次加载条数
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
            $("#right").append('<div class="more">——已经没有了——</div>');
        } else {
            $("#right").append('<div class="more">——点击加载更多——</div>');
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
                        // $("#right").append('<div class="none" style="text-align: center; line-height: 500px;">-- 已经没有了 --</div>');
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
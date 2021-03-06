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
           `<a href="/` + data.domain + `/article/` + data.weid + `" target="_blank" style="border-top:1px solid #e6e6e6;display:block;width: 479px;height: 330px;border-right:0px solid #fff;border-left:0px solid #fff;">
            <div class="show-art" style="width: 100%;height: 100%;margin: 0;border: 0px solid #fff;" id=` + data.weid + `>
            <div class="myself" style="width: 100%;height: 24px;margin-top: 24px;">
                <div class="my_con" style="width: 70%;height: 24px;float: left;">
                     <div class="whoimg" style="width: 24px;height: 24px;border-radius: 50%;background: blue;float: left;"><img src="" alt=""></div>
                     <span style="font-size: 14px;color: #666;float: left;line-height: 24px;margin-left: 6px;">` + data.auth + `</span>
                </div>
                <div class="my_join" style="width: 19%;height: 24px;line-height: 24px;font-size: 13px;float: right;color: #666">
                    <span>` + data.created_at.substring(0, 10) + `</span>
                </div>
            </div>      
            <div class="show-pic" style="width: 460px;height: 160px;margin: 15px 0 0 0;"></div>
            <div style="height: 33px;line-height: 33px!important;padding: 0;" class="show-title"  id=` + data.domain + `>
                <div class="at" style="height: 100%!important;font-size: 16px;color: #333;">` + data.title.substring(0, 17) + `</div>
            </div>
            <div class="show-cont" style="width:100%;padding-left:0;height: 37px;overflow: hidden;"><p class="text2" >` + data.summary.substring(0, 100) + `</p></div>         
            </div></a>`
        return template;
    // <div class="ad" style="">` + data.created_at.substring(0, 10) + `</div>
    // <div class="show-bottom" style="height: 30px;bo">
    //         <div class="show-read">
    //         <img src="/common/img/icon_see_normal.png" width="20" alt="" />
    //         </div>
    //         </div>
    // <div class="show-shade" style="display: none;"><p>预览文章</p></div>

    }

    var coverId = 0;
    var artsList = [];
    var genArticles = function (arts) {
        arts.map(x => {
            console.log(x.cover)
            if (x.cover != "") {
                var coverPicCss = {
                    'background': 'url(' + ApiMaterPlatQiniuDomain + x.cover + ') no-repeat center',
                    'background-size': '100%'
                }
            }
            else {
                var coverPicCss = {
                    'background': 'url(/common/img/vote_front_cover.png) no-repeat center',
                    'background-size': 'cover'
                }
            }

            $(".cons").append(articleTemplate(x));
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
    var perLoad = 100; //默认一次加载条数
    var loadMore = function(data) {
        var res = returnPart(data, start, perLoad);
        console.log(res);
        start += perLoad;
        genArticles(res);
        artsList.map(x => {
            $("#" + x).fadeIn(700);
        });
        $(".more").remove();
        /*if (res == "") {
            $("#right").append('<div class="more">——已经没有了——</div>');
        } else {
            $("#right").append('<div class="more">——点击加载更多——</div>');
        }*/
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
                    /*if (res == "") {
                        // $("#right").append('<div class="none" style="text-align: center; line-height: 500px;">-- 已经没有了 --</div>');
                        $("#right").append('<div class="none">-- 已经没有了 --</div>');
                    } else {
                        $("#right").append('<div class="more">-- 点击加载更多 --</div>');
                    }*/

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
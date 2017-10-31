/**
 * Created by Yaoer on 2017/8/6.
 */

// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_5"){
	$("#we_title_5").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
	$("#we_title_5").find(".title-img").css("transform","rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

$(document).ready(function(){

    var articleTemplate = function (data) {
         var act_title="";
        if(data.title!="" && data.title!=null && data.title!=undefined){

            if(data.title.length>17){
               act_title= data.title.substring(0, 17);
            }else{
                act_title=data.title;
            }
        }

        var template =
           `<div class="show-art" id=` + data.activity_id + `>
            <div class="show-title" id=` + data.domain + `>
                <div class="at">` + act_title + `</div>
                <div class="ad">` +  data.begain_time+` ~ `+data.end_time  + `</div>
            </div>
            <div class="show-pic"></div>
            <div class="show-cont">` + data.summary.substring(0, 60) + `...</div>
            <div class="show-bottom text-center">
                <div class="show-read">
                    <img  class="show-read-img" src="/common/img/icon_see_normal.png" width="20" alt="" />
                </div>
                <div class="show-collect">
                    取消收藏
                </div>
            </div>
            <div class="show-shade" style="display: none;"><p>预览活动</p></div>
            </div>`

        return template;
    }

    var coverId = 0;
    var artsList = [];
    var genArticles = function (arts) {
        arts.map(x => {
            if (x.cover != "") {
                var coverPicCss = {
                    'background': 'url(' +ApiMaterPlatQiniuDomain+ x.cover + ') no-repeat center',
                    'background-size': '100%'
                }
            }
            else {
                var coverPicCss = {
                    'background': 'url(/common/img/p2240256385.jpg) no-repeat center',
                    'background-size': '100%'
                }
            }

            $("#right").append(articleTemplate(x));
            $("#" + x.activity_id + " .show-pic").css(coverPicCss);
            $("#" + x.activity_id).click(function (e) {

                var cid = $(e.target).attr('class');
                var dm = $(this).find(".show-title").attr("id");
                /*window.location.href = '/' + dm + '/activity/' + x.weid;*/

                // var cid = $(e.target).attr('class');
                console.log(cid);
                switch (cid) {
                    case 'show-read':
                    case 'show-read-img':
                        window.location.href = '/' + dm + '/activity/' + x.activity_id;
                        break;

                    case 'show-collect':
                        canclecollect(x.weid);
                    break;
                }
            });
            $("#" + x.activity_id).hide();
            artsList.push(x.activity_id);
            coverId++;

            var lock = false;
            $("#" + x.activity_id).hover(function () {
                var dm = $(this).find(".show-title").attr("id");

                if (!lock) {
                   $(this).find('.show-shade').show();
                   lock = true;
                   $(this).find('.show-shade').click(function(){
                      window.location.href = '/' + dm  + '/activity/' + x.activity_id;
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

    var artList = function(user_id){
        var limit="";
        var page=1;
        var sendData={
            // user_id:user_id,
            limit:limit,
            page:page
        }
        $.ajax({
            // url: ACTIVITY_LIST,
            url: ACTIVITY_COLLECTION_LISTS,
            type: 'post',
            data:sendData,
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

    artList(localStorage.getItem("weid"));
    var canclecollect=function(id){
        $.ajax({
            // url: ACTIVITY_LIST,
            url: ACTIVITY_COLLECTION_DESTROY+"/"+id,
            type: 'get',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                   mess_tusi("取消收藏成功");
                   location.reload();
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

})
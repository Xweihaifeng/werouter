/**
 * Created by Yaoer on 2017/8/13.
 */

$(document).ready(function(){

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    var weid = localStorage.getItem('weid');

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

    //route
    var isLogin = false; //判断用户登陆与否
    /*var router = function(route, domain){
        var routerList = ['home', 'login', 'article','active','project', 'shopping'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var top = $(window).scrollTop();

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal_login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user/";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href = "/" + domain + "/article";
        }

         var active = function(){
            showLogin = false;
            window.location.href = domain + "/activity";
        }

         var project = function(){
            showLogin = false;
            window.location.href = domain + "/project";
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = "/" + domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

     $("#home, #login, #article,#active,#project, #shopping").click(function(){
         var id = $(this).attr("id");
         router(id, domain);
     })*/

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $("#avatar .avatar-icon").css({
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();
            $("#home img").attr("src", ApiMaterPlatQiniuDomain + localStorage.getItem('logo'))
        }
    }

    init(localStorage.getItem('token'));

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

    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            /*headers: {
                'Token': localStorage.getItem('token')
            },*/
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    var imgUrl = info.avatar;
                    if (imgUrl != null && imgUrl.indexOf('http') === -1){
                        imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
                        $("#head-icon, .user-head").css({
                            "background": "url(" + imgUrl + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        if (imgUrl != null && imgUrl != "") {
                            $("#head-icon, .user-head").css({
                                "background": "url(" + imgUrl + ") no-repeat center",
                                "background-size": "110%"
                            });
                        } else {
                            $("#head-icon, .user-head").css({
                                "background": "url(/common/img/avatar.png) no-repeat center",
                                "background-size": "110%"
                            });
                        }
                    }

                    if (info.nickname != null) {
                        $(".line-0").html(
                            info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                        );
                        $('title').text(info.nickname + '的官方微主页');
                    } else {
                        if (info.real_name != null) {
                            $(".line-0").html(
                                info.real_name + '<img src="/common/img/vrenzheng.png" alt="">'
                            );
                            $('title').text(info.real_name + '的官方微主页');
                        } else {
                            $(".line-0").html(
                                localStorage.getItem('title') + '官方微主页' + '<img src="/common/img/vrenzheng.png" alt="">'
                            );
                            $('title').text(localStorage.getItem('title') + '官方微主页');
                        }
                    }
                    
                    $(".line-1").text(info.motto);
                    $(".oline-2").find("span").eq(1).text(info.motto);
                    //$(".user-cnt").text(info.nickname);
                    $(".user-cnt").text(info.real_name);
                    artTypeList(weid, getArtList);
                    artCount(weid);
                    countinfo(weid);

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data);
                    if (data.data == null) {

                    } else {
                        //微主页banner图
                        var bgLogo = data.data.background;
                        if (bgLogo != null) {
                            $("#art-head").css({
                                "background": "url(" + bgLogo + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                        //微名片背景
                        var bgUser = data.data.background_user;
                        if (bgUser != null){
                            $(".user-info").css({
                                "background": "url(" + bgUser + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                        if (data.data.is_brand == 1) {
                            hasBrand(userId);
                        }
                    }
                } else {
                    //layer.msg(data.message, {
                    //    time: 1500
                    //});
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var hasBrand = function(weid){
        $.ajax({
            url: BRAND_DETAIL_USER + '/' + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data);
                    if (data.data == null) {

                    } else {
                        $(".line-0").html(
                            data.data.title + '<img src="http://next.wezchina.com/images/vrenzheng.png" alt="">'
                        );
                        $(".line-1").text("品牌介绍");
                        var logo = data.data.logo;
                        if (logo != null){
                            $("#head-icon").css({
                                "background": "url(" + logo + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                    }

                } else {
                    //layer.msg(data.message, {
                    //    time: 1500
                    //});
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //个性域名用户weid
    var userId;
    var __init = function(domain) {
        $.ajax({
            url: PAGES_DETAIL_DOMAIN + "/" + domain,
            type: 'GET',
            success: function(data){
                if (data.code == 200){
                    //var domain = data.data.domain;
                    console.log(data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        console.log('userId:', userId);
                        console.log('userDetail')
                        getUserInfo(USERDETAIL, "/" + userId);
                        hasDomain(userId);
                        var favicon = localStorage.getItem('fav');
                        if(favicon.indexOf('http') === -1){
                            favicon = ApiMaterPlatQiniuDomain + favicon;
                        }
                        $('#favicon').attr('href',favicon);

                    } else {
                        domain = '';
                        getUserInfo(FOUNDER, '');
                        console.log('router error')
                    }
                } else {
                    //window.location.href = "/*";
                    console.log("error", data.code)
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    if (domain != '') {
        __init(domain);
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
            <div class="day-summary">` + data.summary.substring(0, 130) + `...</div>
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

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);
    //$('title').text(localStorage.getItem('title') + '官方微主页');

})
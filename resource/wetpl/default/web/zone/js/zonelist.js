$(document).ready(function(){
    //目前问题是tid会出现undefined
    var winH=$(document.body).height();
    console.log(winH)
    $('.all-info').css('height',winH)
    var currHeight = $("#art-head").height() + $("#art-body").height();
    setHeight(currHeight);

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    var weid = localStorage.getItem('weid');

    //路由处理逻辑
    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    //console.log('domain', domain);

    $(".linkto").attr('href', '/' + domain)

    //route
    var isLogin; //判断用户登陆与否
    var router = function(route){
        if(!window.localStorage.getItem("token")) {
            isLogin = false;
        } else {
            isLogin = true;
        }
        var routerList = ['home', 'login', 'article', 'active', 'project', 'shopping', 'zone', 'zan'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal_login").fadeIn(300);
            } else {
                window.location.href = "/user";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href = "/index/article";
        }

        var active = function(){
            showLogin = false;
            window.location.href = "/index/activity";
        }
        var project = function(){
            showLogin = false;
            window.location.href = "/index/project";
        }


        var shopping = function(){
            showLogin = false;
            window.location.href = "/index/wemall";
        }

        var zone = function(){
            showLogin = false;
            window.location.href = "/index/quan";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function(){
        var id = $(this).attr("id");
        router(id);
    })

    //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css("line-height", "50px");
            $("#" + id + " .word").css("margin-top", "-20px");
        } else {
            if (!isLogin) {
                $(this).find(".word").show();
                $(this).css("line-height", "50px");
                $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })


    //获取通用用户信息
    var host = ApiMaterPlatQiniuDomain;
    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            /*headers: {
                'Token': localStorage.getItem('token')
            },*/
            success: function(data){
                console.log(data);
                if (data.data != null){
                    var info = data.data;
                    var weid = info.weid;
                    // console.log(weid)
                    var imgUrl = info.avatar;
                    if ((imgUrl != null && imgUrl != "") && imgUrl.indexOf('http') === -1){
                        imgUrl = host + imgUrl;
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
                            info.nickname + '<img class="rz" src="/common/img/vrenzheng.png" alt="">' +
                            '<div class="collection"><img class="ct" src="/common/img/collect.svg" alt=""/><span class="wd">关注</span></div>'
                        );
                        $('title').text('圈子-' + info.nickname + '的官方微主页');
                    } else {
                        if (info.real_name != null) {
                            $(".line-0").html(
                                info.real_name + '<img src="/common/img/vrenzheng.png" alt="">'
                            );
                            $('title').text('圈子-' + info.real_name + '的官方微主页');
                        } else {
                            $(".line-0").html(
                                localStorage.getItem('title') + '官方微主页' + '<img src="/common/img/vrenzheng.png" alt="">'
                            );
                            $('title').text('圈子-' + localStorage.getItem('title') + '官方微主页');
                        }
                    }

                    if(info.motto!=null && info.motto!=""){
                        $(".oline-2").find("span").eq(1).text(info.motto);

                    }else{
                         $(".oline-2").find("span").eq(1).text("暂无介绍");
                    }
                    $(".line-1").text(info.motto);
                    // $(".oline-2").find("span").eq(1).text(info.motto);
                    $(".user-cnt").text(info.real_name);

                    genListTpl(apiUrl + 'circel/index?domain=' + domain.substr(1))
                    //artCount(weid);
                    //countinfo(weid);
                    // artTypeList(weid);
                } else {
                    layer.msg("请登录后浏览", {
                        time: 3500
                    })
                    window.location.href = '/login';
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
                /*if (data.code == 401) {
                    localStorage.removeItem('token');
                }*/
                if (data.code == 200){
                    //console.log(data);
                    if (data.data != null) {
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
                    // layer.msg(data.message, {
                    //     time: 1500
                    // });
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var hasBrand = function(weid){
        $.ajax({
            url: BRAND_DETAIL_USER + "/"+ weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                /*if (data.code == 401) {
                    localStorage.removeItem('token');
                }*/
                if (data.code == 200){
                    //console.log(data);
                    if (data.data != null) {
                        $(".line-0").html(
                            data.data.title + '<img src="/common/img/vrenzheng.png" alt="" style="display: inline-block; margin-left: 10px;">' +
                            '<div class="collection"><img class="ct" src="/common/img/collect.svg" alt=""/><span class="wd">关注</span></div>'
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
                    // layer.msg(data.message, {
                    //     time: 1500
                    // });
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
            url: PAGES_DETAIL_DOMAIN + domain,
            type: 'GET',
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    //var domain = data.data.domain;
                    console.log(data.data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        //console.log('userId:', userId);
                        //console.log('userDetail')
                        getUserInfo(USERDETAIL, "/" + userId);
                        hasDomain(userId);
                    } else {
                        domain = '';
                        getUserInfo(FOUNDER, '');
                        //console.log('router error')
                    }
                } else {
                    //window.location.href = "/*";
                    console.log("error:", data.code);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    if (domain == 'article') {
        domain = '';
        getUserInfo(FOUNDER, '');
    } else {
        domain = "/" + domain;
    }

    if (domain != '') {
        __init(domain);
    }

    /*var artCount = function(weid){
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
    }*/

    //主页初始化
    /*var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();
        }
    }
    init(localStorage.getItem('token'));*/

    //需要解决直接进入文章页的问题
    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);
    if(localStorage.getItem('title')=="" || localStorage.getItem('title')==null ||localStorage.getItem('title')==undefined || localStorage.getItem('title')=="null"){
         $.ajax({
            url: apiUrl+"cms/advs",
            type: 'get',
            success: function(data){
                if (data.code == 200){
                    $('title').text('圈子-' + data.data.setting.title + '官方微主页');
                   
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }else{
        $('title').text('圈子-' + localStorage.getItem('title') + '官方微主页');

    }

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

    //TA的粉丝/TA他的关注
    var listTpl = function(cid, data) {
        //let avatar = apiUrl + data.avatar;
        let avatar = '';
        let nickname = ''
        if (data.nickname != null) {
            nickname = data.nickname;
        }
        if (data.avatar != null) {
            avatar = 'http://images.new.wezchina.com/' + data.avatar;
        } else {
            avatar = '/common/img/page.png';
        }
        let tpl = `
            <div class="${cid}" title="${nickname}">
                <img id="${data.domain}" style="border: 1px solid #ccc; border-radius: 50%; height: 100%;  width: 100%; " src="${avatar}" width="54" />
            </div>
        `
        return tpl;
    }

    var genFans = function(url) {
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function (data) {
                $(".fans").html(`<a>Ta的粉丝(${data.data.fnums})</a>`);
                $(".friends").html(`<a>Ta的关注(${data.data.gnums})</a>`);
                $("#fans").html('');
                $("#friends").html('');
                data.data.flist.map(x => $("#fans").append(listTpl('fans-head', x)));
                data.data.glist.map(x => $("#friends").append(listTpl('friends-head', x)));
            }
        })
    }

    //关注
    var follow = function(url) {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                'domain': domain.substr(1),
                'type': 2
            },
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function(data) {
                console.log(data)
                if (data.code == 200) {
                    $(".ct").attr('src', '/common/img/collected.svg');
                    $(".wd").text('已关注');
                    layer.msg("关注成功", {
                        time: 1500
                    });
                    genFans(apiUrl + 'circel/index?domain=' + domain.substr(1))
                }
            },
            error: function(xhr) {
                console.log(xhr)
            }
        })
    }

    //取消关注
    var cancelFollow = function(url) {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                'domain': domain.substr(1),
                'type': 2
            },
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function(data) {
                console.log(data)
                if (data.code == 200) {
                    $(".ct").attr('src', '/common/img/collect.svg');
                    $(".wd").text('关注');
                    layer.msg("取消关注成功", {
                        time: 1500
                    })
                    genFans(apiUrl + 'circel/index?domain=' + domain.substr(1))
                }
            },
            error: function(xhr) {
                console.log(xhr)
            }
        })
    }

    //写入圈子页面数据
    var genListTpl = function(url) {
        $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function(data) {
                console.log(data)
                if (data.code == 200) {
                    var isLike;
                    var isFollow = data.data.if_follow;
                    if (isFollow == 0) {
                        isLike = false;
                    } else if (isFollow == 1) {
                        isLike = true;
                        $(".ct").attr('src', '/common/img/collected.svg');
                        $(".wd").text('已关注');
                    }
                    $(".user-art").children('div:eq(0)').text(data.data.article_count);
                    $(".user-proj").children('div:eq(0)').text(data.data.project_count);
                    $(".user-type").children('div:eq(0)').text(data.data.activity_count);
                    if (data.data.userPageInfo.province != null) {
                        $(".oline-1 p").text(data.data.userPageInfo.province + ' ' + data.data.userPageInfo.city);
                    }

                    let m = 1; //倍率
                    let n = 10; //时间
                    let i = 0;
                    let nums = data.data.wnums;
                    var computeTime = function(sum, time) {
                        if (sum > (time * 1000 / n)) {
                            m = parseInt(sum / (time * 1000 / n));
                        }
                    }

                    var numbers = setInterval(function(){
                        if (i < nums) {
                            if ((nums - i) < parseInt(nums / 20)) {
                                wefriends(i, []);
                                i += parseInt(m / 20);
                            } else {
                                wefriends(i, []);
                                i += m;
                            }
                        } else {
                            wefriends(nums, []);
                            clearInterval(numbers);
                        }
                    }, n);

                    computeTime(nums, 4);
                    $(".fans").html(`<a>Ta的粉丝(${data.data.fnums})</a>`);
                    $(".friends").html(`<a>Ta的关注(${data.data.gnums})</a>`);
                    data.data.flist.map(x => $("#fans").append(listTpl('fans-head', x)));
                    data.data.glist.map(x => $("#friends").append(listTpl('friends-head', x)));

                    $(".fans-head, .friends-head").click(function(e){
                        let domain = $(e.target).attr('id');
                        window.location.href = '/' + domain;
                        //console.log(domain);
                    });

                    //关注
                    $(".line-0").click(function(e){
                        var ls = ['ct', 'wd', 'collection'];
                        var cid = $(e.target).attr('class');
                        if (ls.indexOf(cid) != -1) {
                            if(isFollow == -1) {
                                $("#modal_login").fadeIn(300);
                            } else {
                                if (!isLike) {
                                    isLike = true;
                                    follow(apiUrl + 'circel/relationship');
                                } else {
                                    isLike = false;
                                    cancelFollow(apiUrl + 'circel/quxiao');
                                }
                            }
                        }
                    })
                }
            },
            error: function(xhr) {
                console.log(xhr)
            }
        })
    }

    //微友
    var wefriends = function(nums, res) {
        let n = parseInt(nums);
        nums = nums + '';
        let len = nums.length;
        if (len == 0) {
            $(".red").html(res.reverse().join(''));
        } else {
            res.push(`<li>${n % 10}</li>`);
            wefriends(nums.substr(0, len - 1), res);
        }
    }



    //用户认证 user_cert != null

})
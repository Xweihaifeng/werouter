//$(document).ready(function(){
    //目前问题是tid会出现undefined
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
    var isLogin = false; //判断用户登陆与否

    //文章分类模板
    var artType = []; //文章栏目分类名称
    var typeId = []; //与artType一一对应的分类id
    var artTypeTemplete = function(data){
        artType.push(data.ename);
        typeId.push(data.weid);
        if (domain == '') {
            var url = "/article/" + data.ename;
        } else {
            var url = domain + "/article/" + data.ename;
        }
        var templete = '<li role="presentation" class=' + data.ename + ' id=' + data.weid + '><a href=' + url + '>' + data.name + '</a></li>'
        return templete;
    }

    //文章分类内容模板
    var artContTemplete = function(id){
        return '<div id=' + id + '></div>';
    }

    //生成文章列表
    var coverId = 0;
    var coverPicId = '';
    var artListTemplete = function(data){
        coverPicId = "cover-pic-" + coverId;
        var templete =
            '<div class="panel panel-default art" id=' + data.weid + '>' +
            '<div class="panel-body">' +
            '<div class="art-pic"><img id=' + coverPicId + ' class="lazy" data-original=' + data.cover + ' width="240px" height="145px" /></div>' +
            '<div class="art-name">' + data.title.substring(0, 22) + '</div>' +
            '<div class="art-intro">' + data.summary.substring(0, 100) + ' </div>' +
            '<div class="art-info">' +
            '<span><img src="/common/img/icon_see_normal.png" width="20" alt="" />&nbsp;&nbsp;浏览量:&nbsp;&nbsp;<span style="color: dodgerblue">' + data.views + '</span></span>' +
            '<span><img src="/common/img/time_fill.png" width="23" alt="" />&nbsp;&nbsp;' + data.created_at.substring(0, 10) + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
        return templete;
    }

    //文章浏览数
    var readAmount = function(id){
        //console.log(id);
        $.ajax({
            url: ARTICLES_VIEW,
            type: 'post',
            data: {"articleId": id},
            success: function(data){
                //console.log(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //tid: 文章类型id, tname: 分类名
    var loadArticleList = function(tid, tname, weid){
        // console.log('tid:', tid)
        // console.log('tname:', tname)
        // console.log('weid:', weid)
        if (domain == '') {
            var url = '';
        } else {
            var url = domain
        }

        $.ajax({
            url: ARTICLES_CATEGORY + '?cateId=' + tid + '&userId=' + weid,
            dataType: 'json',
            success: function(data){
                 //console.log(data);
                if (data.code == 200) {
                    var art = data.data.list;
                    if (art != '') {
                        art.map(x => {
                            /*if (x.cover != "") {
                                var coverPicCss = {
                                    'background': 'url(' + x.cover + ') no-repeat center',
                                    'background-size': '100%'
                                }
                            } else {
                                var coverPicCss = {
                                    'background': 'url(/common/img/vote_front_cover.png) no-repeat center',
                                    'background-size': '100%'
                                }
                            }*/

                            for (var i = 0; i < artType.length; i++) {
                                if (typeId[i] == x.cate_id) {
                                    $("#" + artType[i]).append(artListTemplete(x));
                                    // $("#" + coverPicId).hide();
                                    // $("#" + coverPicId).css(coverPicCss);
                                    // $("#" + coverPicId).fadeIn(500);
                                    $("#" + x.weid).click(function(e){
                                        var artId = $(e.target).parents(".art").attr("id");
                                        readAmount(artId);
                                        window.location.href = url + "/article/" + artId;
                                    })
                                }
                            }                            
                            coverId += 1;
                        })
                        $(".art-cont").append('<div style="text-align: center; margin-top: 15px;">—————————— 这是我的底线啦 —————————</div>')
                    } else {
                        for (var i = 0, j = 0; j < 1; i++, j++) {
                            $("#" + artType[i]).append('<p style="margin-top: 50px; text-align: center;">这家伙很懒，什么也没留下...</p>');
                        }
                    }

                    lazyLoad();

                    //lazyLoad(art, 0, 3);
                    //var step = 100;
                    //$(".article").scroll(function(){
                    //    if ($(".article").scrollTop() >= step) {
                    //        lazyLoad(art, start, 1);
                    //    }
                    //})
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var lazyLoad = function(){
        $(".lazy").lazyload({
            effect: "fadeIn",        
            placeholder: '/common/img/vote_front_cover.png'
        })
    }

    //生成类型控制
    var genType = function(artType, weid){
        if (active != '' && active != 'article') {
            var act = active;
        } else {
            var act = artType[0];
        }
        $("." + act).addClass("active");
        // console.log(act)
        // console.log(artType)
        artType.map(x => $("#" + x).hide());
        /*artType.map(x => $("." + x).click(function(){
            $("." + act).removeClass("active");
            $("#" + act).hide();
            $("#" + act).html('');
            act = $(this).attr("class");
            $(this).addClass("active");
            $("#" + act).show();
            var tid = $(this).attr("id");
            loadArticleList(tid, act, weid);
            //console.log(tid + ":" + act);
        }));*/
        artType.map(x => $(".art-cont").append(artContTemplete(x)));
         //console.log('act-tid', $("." + act).attr("id"))
        loadArticleList($("." + act).attr("id"), act, weid);
    }

    //获取文章分类列表
    const artTypeList = function(weid){
        $.ajax({
            url: ARTICLES_CATES,
            dataType: 'json',
            success: function(data){
                // console.log(data)
                if (data.code == 200) {
                    var list = data.data;
                    list.map(x => $(".art-type").append(artTypeTemplete(x)));
                    genType(artType, weid);
                } else {
                    console.log('ARTICLES_CATES ERROR')
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }


    const artCount = function(weid){
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
    const countinfo=function(weid){
          $.ajax({
            // url: apiUrl+"/articles/listCount?userId=" + weid,
            url: PAGES_PAGE_COUNTAGEINFO+"/" + weid,
            type: 'get',
            success: function(data){
                // console.log(data);
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

    artCount(wezchina_plats.plats_domian.plat_user_id);
    countinfo(wezchina_plats.plats_domian.plat_user_id);
    artTypeList(wezchina_plats.plats_domian.plat_user_id);

    //主页初始化
    /*var init = function(token){
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

    init(localStorage.getItem('token'));*/
//})

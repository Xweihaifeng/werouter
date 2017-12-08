$(document).ready(function(){
var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
    var currHeight = $("#art-head").height() + $("#art-body").height();
    setHeight(currHeight);

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    //路由处理逻辑
    if(window.location.pathname=="/wemall"){
        window.location="/index/wemall";
    }
    var weid = localStorage.getItem('weid');

    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);
    console.log(window.location.pathname);

   /*   var checkdomain=function(domain,id){
        if(domain!="index" && domain!="wemall"){
           console.log("a");

        }else if(domain=="wemall" || domain=="undefined" || domain==""){
            window.location="/index/wemall";
        }

    }
checkdomain(domain);*/
/*if (domain == 'wemall') {
        domain = '';
    } else {
        domain = "/" + domain;
    }*/
    //route
    var isLogin; //判断用户登陆与否
    /*var router = function(route){
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
            window.location.href = domain + "/article";
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
            window.location.href = domain + "/wemall";
        }

        var zone = function(){
            showLogin = false;
            window.location.href = domain + "/quan";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

     $("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function(){
    //$("#home, #login, #article, #active, #zan").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/

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

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div img").hide();
            $(".log-head").css({
                // 'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',

                'background-size': '100% 100%'
            })
            $(".log-head").show();
            var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
            $('#favicon').attr('href', favicon);
        }
    }

    init(localStorage.getItem('token'));

   var options0 = $.get(CMS_ADVS);
    options0.done(function(data) {
        console.log(data);
        if(data.code == 200) {
            if(!data.data) {
                return false;
            }

            var setting = data.data.setting;
            window.localStorage.setItem("logo", setting.logo);
            window.localStorage.setItem("fav", setting.favicon);

            if(!setting.favicon == false) {
                var favicon = ApiMaterPlatQiniuDomain + setting.favicon;
                $("#public_icon").attr("href", favicon);
            }

            if(!setting.logo == false) {
                var logo = ApiMaterPlatQiniuDomain + setting.logo;
                // $("#home .logoImg").css({"background-image": "url(" + logo + ")"});
                $("#home img").attr("src",logo );
            }
        }
    });
    options0.fail(function(error) {
        console.error(error);
    });
    //商品分类模板
    var cateType = [];
    var floor=0;
    var shopTypeTemplete = function(data){
        cateType.push(data.name);
        var templete = '<div class="ws_item" ><h2 class="ws_tit" id=' + data.weid + '><i>'+floor+'F</i><span>' + data.name + '</span></h2><ul class="'+data.weid+'"></ul></div>';
        return templete;
    }
     // 获取商品分类
    // var cateType = [];
    var catesfun = function(weid){
        console.log(weid);
        $.ajax({
            // url: "http://apitest.wezchina.com/goods/cates/list",
            url: GOODS_CATES_LIST_USERID+"/"+weid,
            type: 'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var cate = data.data;
                    if(cate.length>0){
                        cate.map(x => {
                        floor++;
                        /*$(".ws_box").append(
                            '<div class="ws_item" ><h2 class="ws_tit" id=' + x.weid + '><i>1F</i><span>' + x.name + '</span></h2></div>'
                        )*/
                        $(".ws_box").append(shopTypeTemplete(x));
                        // cateType.push({id: x.weid, name: x.name});
                        // genType(cateType, weid);
                        shoplist(x.weid, x.name, weid);


                    })
                  }else{
                      $(".ws_box").append('<p style="margin-top: 50px; text-align: center;">这家伙很懒，什么也没留下...</p>')
                  }


                }else{
                    console.log('GOODS CATES LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }


     // 获取商城详情
    var page_id=mall_id=plat_id='';
    var malldetail=function(){
        $.ajax({
            url:MALL_USERDETAIL,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                // console.log(data);
                if(data.code == 200){
                    var malldata=data.data;
                    page_id=malldata.page_id;
                    mall_id=malldata.weid;
                    plat_id=malldata.plat_id;
                    /*shoplist();
                    malldata.map(x => {

                    })*/
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
// malldetail();


    var coverId = 0;
    var coverPicId = '';
    var coverPicpath = '../common/img/products_load.jpg';
    var shopListTemplete = function(data){
        coverPicId = "cover-pic-" + coverId;
        if(data.cover!=''){
            coverPicpath=qiniu_bucket_domain+data.cover;
        }
        var templete =
            '<li data-id="' + data.weid + '"    class="shopli">'+
                '<div class="ws_pro_box">'+
                    '<div class="img">'+
                        '<a href=\'javascript:void(0)\' target="_blank">'+
                            '<img class="pro_load"  src="' + coverPicpath + '"/></a>'+
                    '</div>'+
                    '<h3 class="tit">'+
                        '<a href=\'javascript:void(0)\' target="_blank">' + data.title + '</a>'+
                    '</h3>'+
                    '<p class="brief">'+
                        '<a href=\'javascript:void(0)\' target="_blank">' + data.summary+ '</a>'+
                    '</p>'+
                    '<div class="price">'+
                        '<span><em>￥</em>' + data.price + '</span>'+
                        '<b>市场价 ￥<i>' + data.marketprice + '</i></b>'+
                    '</div>'+
                    '<div class="state">'+
                        '<span class="l"><i>已售 </i><em>'+data.sales_num+'</em></span>'+
                        '<span class="r"><i>收藏 </i><em>' + data.collections + '</em></span>'+
                        '<p>'+
                            '<a href="javascript:void(0)" class="buy_btn" target="_blank">立即购买</a>'+
                        '</p>'+
                    '</div>'+
                '</div>'+
            '</li>';
        return templete;
    }

    //tid: 商品分类id, tname: 分类名
    // 通过用户id和分类获取商品列表
    var shoplist = function(tid, tname, weid){
        var limit='';
        var page='';
        var keywords='';
         var sendData = {
            userId: weid,
            cateId: tid,
            limit: limit,
            page: page,
            keywords: keywords
        }
        if (domain == '') {
            var url = '';
        } else {
            var url = domain
        }
        console.log('url:', url);
        $.ajax({
            url:GOODS_LISTS_USERANDCATE,
            type:'post',
            data: sendData,
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var shop = data.data.list;
                    if(shop.length==0){
                        ulnone($("."+tid));
                    }

                    shop.map(x => {
                        if (x.cover != "") {
                            var coverPicCss = {
                                'background': 'url(' + x.cover + ') no-repeat center',
                                'background-size': '100%'
                            }
                        } else {
                            var coverPicCss = {
                                'background': 'url(/common/img/products_load.jpg) no-repeat center',
                                'background-size': '100%'
                            }
                        }
                        if(x.status==1){
                           $("."+tid).append(shopListTemplete(x));
                        }
                        else{
                            //$("."+tid).append('<p style="width:100%;height:100px;text-align:center;line-height:100px;">这家伙很懒，什么东西都没留下~~~</p>')
                        }

                        lihover();

                        $("[data-id='"+ x.weid+"']" ).click(function(e){
                            var goodsId = $(e.target).parents(".shopli").attr("data-id");
                            readAmount(goodsId);
                            console.log("/shopping/" + goodsId);

                            window.location.href = url+"/wemall/goods/" + goodsId;
                        })
                        /*if (x.cate_id == '28d09ce0-7776-11e7-9b53-4fd9cbd5b96e') {
                            $("#newArticle").append(artListTemplete(x));
                            $("#" + coverPicId).hide();
                            $("#" + coverPicId).css(coverPicCss);
                            $("#" + coverPicId).fadeIn(500);
                            $("#" + x.weid).click(function(e){
                                var artId = $(e.target).parents(".art").attr("id");
                                readAmount(artId);
                                window.location.href = "/article/" + artId;
                            })
                        }
                        if (x.cate_id == '7e7b7e60-7776-11e7-8bd9-4b4b0330d116') {
                            $("#log").append(artListTemplete(x));
                            $("#" + coverPicId).hide();
                            $("#" + coverPicId).css(coverPicCss);
                            $("#" + coverPicId).fadeIn(500);
                            $("#" + x.weid).click(function(e){
                                var artId = $(e.target).parents(".art").attr("id");
                                readAmount(artId);
                                window.location.href = "/article/" + artId;
                            })
                        }
                        if (x.cate_id == 'bd037d40-7776-11e7-9626-2762df262f6c') {
                            $("#notice").append(artListTemplete(x));
                            $("#" + coverPicId).hide();
                            $("#" + coverPicId).css(coverPicCss);
                            $("#" + coverPicId).fadeIn(500);
                            $("#" + x.weid).click(function(e){
                                var artId = $(e.target).parents(".art").attr("id");
                                readAmount(artId);
                                window.location.href = "/article/" + artId;
                            })
                        }*/
                        coverId += 1;
                    })

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





    //商品浏览数暂未写
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

   /* var start = 0;
    var lazyLoad = function(data, init, step){
        var end = init + step;
        var art = data.slice(init, end);
        art.map(x => {
            if (x.cover != "") {
                var coverPicCss = {
                    'background': 'url(' + x.cover + ') no-repeat center',
                    'background-size': '100%'
                }
            } else {
                var coverPicCss = {
                    'background': 'url(../common/img/p2240256385.jpg) no-repeat center',
                    'background-size': '100%'
                }
            }
            if (x.cate_id == '28d09ce0-7776-11e7-9b53-4fd9cbd5b96e') {
                $("#newArticle").append(artListTemplete(x));
                $("#" + coverPicId).hide();
                $("#" + coverPicId).css(coverPicCss);
                $("#" + coverPicId).fadeIn(500);
                $("#" + x.weid).click(function(e){
                    var artId = $(e.target).parents(".art").attr("id");
                    readAmount(artId);
                    window.location.href = "/article/" + artId;
                })
            }
            if (x.cate_id == '7e7b7e60-7776-11e7-8bd9-4b4b0330d116') {
                $("#log").append(artListTemplete(x));
                $("#" + coverPicId).hide();
                $("#" + coverPicId).css(coverPicCss);
                $("#" + coverPicId).fadeIn(500);
                $("#" + x.weid).click(function(e){
                    var artId = $(e.target).parents(".art").attr("id");
                    readAmount(artId);
                    window.location.href = "/article/" + artId;
                })
            }
            if (x.cate_id == 'bd037d40-7776-11e7-9626-2762df262f6c') {
                $("#notice").append(artListTemplete(x));
                $("#" + coverPicId).hide();
                $("#" + coverPicId).css(coverPicCss);
                $("#" + coverPicId).fadeIn(500);
                $("#" + x.weid).click(function(e){
                    var artId = $(e.target).parents(".art").attr("id");
                    readAmount(artId);
                    window.location.href = "/article/" + artId;
                })
            }
            coverId += 1;
        })
        start = end;
    }*/

    /*//tid: 文章类型id, tname: 分类名
    var loadArticleList = function(tid, tname, weid){
        $.ajax({
            url: ARTICLES_CATEGORY + '?cateId=' + tid + '&userId=' + weid,
            dataType: 'json',
            success: function(data){
                // console.log(data);
                if (data.code == 200) {
                    var art = data.data.list;
                    art.map(x => {
                        if (x.cover != "") {
                            var coverPicCss = {
                                'background': 'url(' + x.cover + ') no-repeat center',
                                'background-size': '100%'
                            }
                        } else {
                            var coverPicCss = {
                                'background': 'url(../common/img/p2240256385.jpg) no-repeat center',
                                'background-size': '100%'
                            }
                        }
                        if (x.cate_id == '28d09ce0-7776-11e7-9b53-4fd9cbd5b96e') {
                            $("#newArticle").append(artListTemplete(x));
                            $("#" + coverPicId).hide();
                            $("#" + coverPicId).css(coverPicCss);
                            $("#" + coverPicId).fadeIn(500);
                            $("#" + x.weid).click(function(e){
                                var artId = $(e.target).parents(".art").attr("id");
                                readAmount(artId);
                                window.location.href = "/article/" + artId;
                            })
                        }
                        if (x.cate_id == '7e7b7e60-7776-11e7-8bd9-4b4b0330d116') {
                            $("#log").append(artListTemplete(x));
                            $("#" + coverPicId).hide();
                            $("#" + coverPicId).css(coverPicCss);
                            $("#" + coverPicId).fadeIn(500);
                            $("#" + x.weid).click(function(e){
                                var artId = $(e.target).parents(".art").attr("id");
                                readAmount(artId);
                                window.location.href = "/article/" + artId;
                            })
                        }
                        if (x.cate_id == 'bd037d40-7776-11e7-9626-2762df262f6c') {
                            $("#notice").append(artListTemplete(x));
                            $("#" + coverPicId).hide();
                            $("#" + coverPicId).css(coverPicCss);
                            $("#" + coverPicId).fadeIn(500);
                            $("#" + x.weid).click(function(e){
                                var artId = $(e.target).parents(".art").attr("id");
                                readAmount(artId);
                                window.location.href = "/article/" + artId;
                            })
                        }
                        coverId += 1;
                    })

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
    }*/

    //生成类型控制
  /*  var genType = function(cateType, weid){
        var act = cateType[0];
        $("." + act).addClass("active");
        cateType.map(x => $("#" + x).hide());
        cateType.map(x => $("." + x).click(function(){
            $("." + act).removeClass("active");
            $("#" + act).hide();
            $("#" + act).html('');
            act = $(this).attr("class");
            $(this).addClass("active");
            $("#" + act).show();
            var tid = $(this).attr("id");
            // loadArticleList(tid, act, weid);
            shopllist(tid, act, weid);
            //console.log(tid + ":" + act);
        }));
        cateType.map(x => $(".ws_item").append(shopListTemplete(x)));
        // loadArticleList($("." + act).attr("id"), act, weid);
        // shoplist($("." + act).attr("id"), act, weid);
        // shoplist($(".ws_tit").attr("id"), act, weid);
    }*/


/*
    //获取通用用户信息
    var getUserInfo = function(){
        $.ajax({
            url: FOUNDER,
            type: 'get',
            success: function(data){
                //console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    if (info.avatar != "") {
                        $("#head-icon, .user-head").css({
                            "background": "url(" + info.avatar + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        $("#head-icon, .user-head").css({
                            "background": "url(../common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

                    $(".line-0").html(
                        info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".line-1").text(info.motto);
                    $(".user-cnt").text(info.nickname);
                    artCount(weid);
                    // artTypeList(weid);

                    catesfun(weid);


                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    getUserInfo();*/
  /*  //获取通用用户信息
    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    console.log(weid)
                    if (info.avatar != "") {
                        $("#head-icon, .user-head").css({
                            "background": "url(" +qiniu_bucket_domain+ info.avatar + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        $("#head-icon, .user-head").css({
                            "background": "url(../../common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

                    $(".line-0").html(
                        info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".line-1").text(info.motto);
                    $(".user-cnt").text(info.nickname);
                    artCount(weid);
                    //artTypeList(weid);
                    catesfun(weid);

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
            url: 'http://apitest.wezchina.com/pages/page/getDetailByDomain' + domain,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    //var domain = data.data.domain;
                    console.log(data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        console.log('userId:', userId);
                        console.log('userDetail')
                        getUserInfo(USERDETAIL, "/" + userId);
                    } else {
                        console.log('router error')
                    }
                } else {
                    window.location.href = "/*";
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    if (domain != '') {
        __init(domain);
    } else {
        getUserInfo(FOUNDER, '');
    }

    var artCount = function(weid){
        $.ajax({
            url: "http://apitest.wezchina.com/articles/listCount?userId=" + weid,
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
    }*/
 var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);

    $(".linkto").attr('href', '/' + domain)

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
                    if (imgUrl != null && imgUrl.indexOf('http') === -1 && imgUrl!=""){
                        imgUrl = host + imgUrl;
                        $("#head-icon, .user-head").css({
                            "background": "url(" + imgUrl + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        $("#head-icon, .user-head").css({
                            "background": "url(/common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

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
                    } else {
                        if (info.real_name != null) {
                            $(".line-0").html(
                                info.nickname + '<img class="rz" src="/common/img/vrenzheng.png" alt="">' +
                                '<div class="collection"><img class="ct" src="/common/img/collect.svg" alt=""/><span class="wd">关注</span></div>'
                            );
                        } else {
                            $(".line-0").html(
                                localStorage.getItem('title') + '官方微主页' + '<img src="/common/img/vrenzheng.png" alt="">'
                            );
                        }
                    }

                    $(".line-1").text(info.motto);
                    // $(".oline-2").find("span").eq(1).text(info.motto);
                    if(info.motto!=null && info.motto!=""){
                        $(".oline-2").find("span").eq(1).text(info.motto);

                    }else{
                         $(".oline-2").find("span").eq(1).text("暂无介绍");
                    }
                    $(".user-cnt").text(info.real_name);
                    genListTpl(apiUrl + 'circel/index?domain=' + domain.substr(1))
                    artCount(weid);
                    // artTypeList(weid);
                    catesfun(weid);
                    countinfo(weid);

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
            url: PAGES_PAGE_GETDETAILBYUSER+ weid,
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
                    /*layer.msg(data.message, {
                        time: 1500
                    });*/
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var hasBrand = function(weid){
        $.ajax({
            url: BRAND_DETAIL_USER+'/' + weid,
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
                            data.data.title + '<img src="/common/img/vrenzheng.png" alt="">'
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
                    layer.msg(data.message, {
                        time: 1500
                    });
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
                if (data.code == 200){
                    //var domain = data.data.domain;
                    console.log(data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        console.log('userId:', userId);
                        console.log('userDetail')
                        getUserInfo(USERDETAIL, "/" + userId);
                        hasDomain(userId);
                    } else {
                        domain = '';
                        getUserInfo(FOUNDER, '');
                        console.log('router error')
                    }
                } else {
                    // window.location.href = "/*";
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
   /*   var checkdomain=function(domain,id){
        if(domain!="index" && domain!="wemall"){
           console.log("a");

        }else if(domain=="wemall" || domain=="undefined" || domain==""){
            window.location="/index/wemall";
        }

    }
checkdomain(domain);*/
if (domain == 'wemall') {
        domain = '';
    } else {
        domain = "/" + domain;
    }
    //
  /*  if (domain == 'article') {
        domain = '';
        getUserInfo(FOUNDER, '');
    } else {
        domain = "/" + domain;
    }*/

    if (domain != '') {
        __init(domain);
    }

    var artCount = function(weid){
        $.ajax({
            // url: apiUrl+"/articles/listCount?userId=" + weid,
            url: ARTICLES_LISTCOUNT+"?userId=" + weid,
            type: 'get',
            success: function(data){
                console.log(data);
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


    // 鼠标滑动到列表时加hover
    var lihover=function(){
         $(".ws_item li").mouseenter(function(){
            $(this).addClass("hover")
        }).mouseleave(function(){
            $(this).removeClass("hover")
        })
    }
    // 没有商品时显示
   var ulnone=function(obj){
    obj.each(function(){
            var liLen=$(this).children("li").length;
            var licum = Math.ceil(liLen/3);
            $(this).attr('licum',licum)
            if (licum > 1){
                $(this).siblings(".ws_item_more").css("visibility",'visible');
            }else if (licum == 0)
            {
                $(this).css("height","50px").append("<li class='nonepro'>您要的货正在路上~~~</li>")
            }
        })
   }

   var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);
    if(localStorage.getItem('title')=="" || localStorage.getItem('title')==null ||localStorage.getItem('title')==undefined || localStorage.getItem('title')=="null"){
         $.ajax({
            url: apiUrl+"cms/advs",
            type: 'get',
            success: function(data){
                if (data.code == 200){
                    $('title').text('商城-' + data.data.setting.title + '官方微主页');
                   localStorage.setItem('title',data.data.setting.title);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }else{
        $('title').text('商城-' + localStorage.getItem('title') + '官方微主页');

    }

    //TA的粉丝/TA他的关注
    var listTpl = function(cid, data) {
        //let avatar = apiUrl + data.avatar;
        let domain = data.domain;
        let member = data.member_weid;
        if (domain == null || domain == '') {
            if (member == null || member == '') {
                domain = '';
            } else {
                domain = '/u/' + member;
            }
        }
        let avatar = '';
        let nickname = ''
        if (data.nickname != null) {
            nickname = data.nickname;
        }
        if (data.avatar != null) {
            avatar = ApiMaterPlatQiniuDomain + data.avatar;
        } else {
            avatar = '/common/img/page.png';
        }
        let tpl = `
            <div class="${cid}" title="${nickname}">
                <img id="${domain}" style="border: 1px solid #ccc; border-radius: 50%; height: 100%;  width: 100%; " src="${avatar}" width="54" />
            </div>
        `
        return tpl;
    }

    var genFans = function(url, domain, page, limit, type) {
        $.ajax({
            url: url + '?domain=' + domain + '&page=' + page + '&limit=' + limit + '&type=' + type,
            type: 'GET',
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function (data) {
                console.log(data)
                $(".fans").html(`<a>Ta的粉丝(${data.data.list.length})</a>`);
                //$(".friends").html(`<a>Ta的关注(${data.data.gnums})</a>`);
                $("#fans").html('');
                //$("#friends").html('');
                data.data.list.map(x => $("#fans").append(listTpl('fans-head', x)));
                //data.data.glist.map(x => $("#friends").append(listTpl('friends-head', x)));
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
                    genFans(apiUrl + 'circel/flist', domain.substr(1), 1, 12, 1);
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    })
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
                    genFans(apiUrl + 'circel/flist', domain.substr(1), 1, 12, 1);
                } else {
                    console.log(data.message)
                }
            },
            error: function(xhr) {
                console.log(xhr)
            }
        })
    }

    //数据分页
    var reqUrl = apiUrl + 'circel/flist';
    var pages = function(url, domain, type, page, limit) {
        $.ajax({
            url: url + '?domain=' + domain + '&page=' + page + '&type=' + type + '&limit=' + limit,
            type: 'GET',
            headers: {
                'Token': window.localStorage.getItem("token")
            },
            success: function (data) {
                let totalPage = data.data.params.pageCount;
                if (page <= totalPage) {
                    if (type == 1) {
                        sessionStorage.setItem('fansPages', page + 1);
                        data.data.list.map(x => $("#fans").append(listTpl('fans-head', x)));
                    } else {
                        sessionStorage.setItem('friendsPages', page + 1);
                        data.data.list.map(x => $("#friends").append(listTpl('friends-head', x)));
                    }
                } else {
                    $("#more").text("没有更多");
                }
            }
        })
    }

    $("#more").click(function(){
        let state = $(".fans").attr("class").indexOf('active');
        let domain = window.location.pathname.split('/').slice(1, 2)[0];
        if (state != -1) {
            //'fans' 请求fans分页
            let page = sessionStorage.getItem('fansPages')
            pages(reqUrl, domain, 1, page, 12);
        } else {
            //'friends'
            let page = sessionStorage.getItem('friendsPages')
            pages(reqUrl, domain, 2, page, 12);
        }
    })

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
                            if ((nums - i) < parseInt(nums / 30)) {
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
                    sessionStorage.setItem('fansPages', 2);
                    sessionStorage.setItem('friendsPages', 2);

                    $(".fans-head, .friends-head").click(function(e){
                        let domain = $(e.target).attr('id');
                        if (domain != '') {
                            window.location.href = '/' + domain;
                        }
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
})

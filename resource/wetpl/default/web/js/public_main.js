/**
 * Created by Hongguang on 2017/7/27.
 */

$(document).ready(function(){

    //resize
    var setHeight = function(ch){
        $(".left-nav").css("height", ch);
        $("#right-nav, #nav-news, #nav-org, #nav-news, #nav-help, #nav-share").css("height", ch);
    }

    var showLogin = false; //调整窗口大小时登陆框是否存在
    var width = $(window).width() / 2 - 180;
    var height = $(window).height() / 2 - 165;
    var currWidth = $(window).width();
    var currHeight = $(window).height();
    setHeight(currHeight + 10);
    if (currHeight > 768){
        $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.75 + "px");
    } else {
        $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.67 + "px");
    }
    $(window).resize(function(){
        currWidth = $(window).width();
        currHeight = $(window).height();
        width = $(window).width() / 2 - 180;
        height = $(window).height() / 2 - 165;
        setHeight(currHeight);
        //console.log(currHeight)
        if (currHeight > 768){
            $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.75 + "px");
        } else {
            $(".nav-news-title, .nav-org-title, .nav-help-title, .nav-share-title").css("margin-top", currHeight * 0.67 + "px");
        }

        //console.log(currPage)
        if (showLogin){
            router('login');
        }
    })

    //login's back button
    $(".back").click(function(){
        $(".left-nav").show();
        $(".article").hide();
        $(".login").hide();
        $(".read").hide();
        if (currPage == "read"){
            showLogin = false;
            $("#" + currPage).show();
        } else {
            showLogin = false;
            $("." + currPage).show();
        }
    })

    //首页新闻中心
    $("#center").click(function(e){
        var newsId = $(e.target).attr("class");
        if (newsId == 'news-title') {
            //prevPage = currPage;
            //currPage = 'read';
            $(".home").hide();
            $("#right-nav").hide();
            mySwiper.stopAutoplay();
            // mySwiper1.stopAutoplay();
            //loadArticle('', '', '新闻中心');
            //$(".read").show();
            var currHeight = $(".read").height();
            setHeight(currHeight);
        }
    })

    //首页接口
    //轮播图模板
    var swiperTemplete = function(data){
        var imgUrl = data.image;
        if (imgUrl.indexOf('http') === -1){
            // imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
            imgUrl = imgSet(imgUrl, 470, 250, 3);
        }

        var templete =
            '<div class="swiper-slide" id=' + data.weid + '>' +
            '<div style="width: 470px; height: 250px; background: url(' + imgUrl + ') no-repeat center; background-size: 100% 100%">' +
                //'<a href=' + data.url + '>' +
                '<div class="sw-bg"></div>' +
                '<div class="sw-wd">' + data.title + '</div>' +
                //'</a>' +
            '</div>' +
            '</div>';

        return templete;
    }

    //头条新闻模板
    var mainNews = function(data){
        var href = data.channel_domain + "/" + data.weid;
        var summary = data.summary.substring(0, 86);

        var templete =
        '<div class="main-news-title"><a href=' + href + ' target="_blank">' + data.title.substring(0,20) + '</div>' +
        '<div class="main-news-content"><a href=' + href + ' target="_blank">' + summary + '... [查看全文]</div>';

        return templete;
    }

    //新闻中心模板
    var centerNews = function(data){
        var href = "news/" + data.weid;
        var title = data.title.substring(0, 18);
        var dt = new Date(data.created_at * 1000);
        var month = dt.getMonth() + 1;

        var templete =
            '<div class="news-line">' +  //通过id获取文章内容
            '<div class="news-type" id=' + data.cate_id + '>[' + data.cate_title + ']</div>' +
            '<div class="news-title" id=' + data.weid + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="news-date">' + dt.getFullYear() + '-' + month + '-' + dt.getDate() + '</div>' +
            '</div>'

        return templete;
    }

    //公示公告模板
    var centerNotice = function(data){
        var href = "org/" + data.weid;
        var title = data.title.substring(0, 18);
        var dt = new Date(data.created_at * 1000);
        var month = dt.getMonth() + 1;

        var templete =
            '<div class="news-line">' +  //通过id获取文章内容
            '<div class="news-type" id=' + data.cate_id + '>[' + data.cate_title + ']</div>' +
            '<div class="news-title" id=' + data.weid + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="news-date">' + dt.getFullYear() + '-' + month + '-' + dt.getDate() + '</div>' +
            '</div>'

        return templete;
    }

    //特别推荐模板
    var specialRecommend = function(data, url){
        var href = data.channel_domain + "/" + data.weid;
        var title = data.title.substring(0, 18);
        var dt = new Date(data.created_at * 1000);
        var month = dt.getMonth() + 1;

        var templete =
            '<div class="rcd-news-line" id=' + data.weid + '>' +
            '<div class="rcd-news-title" id=' + data.cate_id + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="rcd-news-date">[' + dt.getFullYear() + '-' + month + '-' + dt.getDate() + ']</div>' +
            '</div>'

        return templete;
    }
    
    //会员推荐模板
    var memberRecommend = function(data, url){
        var href = "/" + data.domain + "/article/" + data.weid; //需要动态验证domain
        var title = data.title.substring(0, 18);

        var templete =
            '<div class="rcd-news-line" id=' + data.weid + '>' +
            '<div class="rcd-news-title" id=' + data.cate_id + '><a href=' + href + ' target="_blank">' + title + '</div>' +
            '<div class="rcd-news-date">[' + data.created_at.substring(0, 10) + ']</div>' +
            '</div>'

        return templete;
    }

    //会员轮播图模板
    var memberCnt = 0;
    var memberTemplete = function(data, flag){        
        var memberId = 'member_' + memberCnt;    
        var imgUrl = data.avatar;
        if (imgUrl != null && imgUrl.indexOf('http') === -1){            
            // imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
            imgUrl = imgSet(imgUrl, 80, 100);
        } else if (imgUrl == null) {
            imgUrl = '/common/img/avatar.png';
        }

        if (flag) {
            var templete =
            '<div class="swiper-slide">' +
            //'<a href=' + "member/" + data.weid + '>' +
            '<a href="/u/' + data.weid + '">' + 
            '<div class="imgs-style">' +
            '<div class="imgs-member">' +
            '<img src=' + imgUrl + ' width="80"/>' +
            '</div>' +
            '</a>' + 
            '<div id=' + memberId + ' style="width: 100px; height: 50px; text-align: center; line-height: 30px;">' + data.real_name + '</div>' +
            '</div>' +
            //'</a>' +
            '</div>'
        } else {
            var templete =
            '<a href="/u/' + data.weid + '">' + 
            '<div class="imgs-style">' +
            '<div class="imgs-member">' +
            '<img src=' + imgUrl + ' width="80"/>' +
            '</div>' +
            '</a>' + 
            '<div id=' + memberId + ' style="width: 100px; height: 50px; text-align: center; line-height: 30px;">' + data.real_name + '</div>' +
            '</div>'
        }

        memberCnt++;

        return templete;
    }

    //右侧滚动广告模板
    var advTemplete = function(data){
        var imgUrl = data.image;
        if (imgUrl.indexOf('http') === -1){
            // imgUrl = ApiMaterPlatQiniuDomain + imgUrl;
            imgUrl = imgSet(imgUrl, 136, 47);
        }
        var templete = '<div class="swiper-slide" id=' + data.weid + '>' +
            '<a href=' + data.url + '>' +
            '<img src=' + imgUrl + ' alt=""/>' +
            '</a>' +
            '</div>'

        return templete;
    }

    //首页轮播，广告，秦商风采接口
    var loadHome = function(){
        $.ajax({
            url: CMS_ADVS,
            dataType: 'json',
            success: function(data){
                console.log(data.data);
                //var url = data.data.http_url
                //固定初始化数据
                var mainData = {
                    "code": 200,
                    "message": "Success",
                    "data": {
                        "setting": {
                            "weid": "40b22ea0-7d80-11e7-ad28-4597a657c8fc",
                            "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                            "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                            "title": "全球秦商联合会",
                            "description": "全球秦商联合会",
                            "key_word": "秦商,三秦,企业家",
                            "icp": "陕备00001",
                            "favicon": "plats/resource/1505225663330.ico",
                            "logo": "plats/resource/1505818319879.png",
                            "background": "plats/resource/1505224124768.png",
                            "weibo_show": "<iframe width=\"100%\" height=\"550\" class=\"share_self\"  frameborder=\"0\" scrolling=\"no\" src=\"http://widget.weibo.com/weiboshow/index.php?language=&width>=0&height=550&fansRow=2&ptype=1&speed=100&skin=5&isTitle=0&noborder=1&isWeibo=1&isFans=0&uid=5893762449&verifier=72fb1d4f&dpc=1\"></iframe>",
                            "status": 1,
                            "created_at": "2017-08-07 15:26:02",
                            "updated_at": "2017-09-23 00:40:53",
                            "background_up": "plats/resource/1505224112025.png",
                            "bar1": "plats/resource/1505282747776.png",
                            "bar2": "plats/resource/1505282752506.png",
                            "bar3": "plats/resource/1505282760313.png",
                            "background_right": "plats/resource/1506098910195.jpg",
                            "bar4": "plats/resource/1505282766718.png"
                        },
                        "banners": {
                            "list": [
                                {
                                    "weid": "ac9a7d80-88a0-11e7-b014-f379980097f5",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "8668f180-765b-11e7-b0b8-8fa37bb824de",
                                    "title": "不畏艰险，坚韧不懈",
                                    "image": "plats/resource/1505116141767.png",
                                    "url": "#",
                                    "created_at": "2017-08-24 15:48:53",
                                    "updated_at": "2017-09-11 15:43:21",
                                    "plat_admin_id": "d3f06a11-6c47-11e7-a12a-00e04c8cace4"
                                },
                                {
                                    "weid": "a9b0b560-783c-11e7-95e2-8f6967ff6bc3",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "8668f180-765b-11e7-b0b8-8fa37bb824de",
                                    "title": "风采",
                                    "image": "http://images.new.wezchina.com/resource/adv/1501758711620.png",
                                    "url": "http://www.qqxqs.com",
                                    "created_at": "2017-08-03 19:12:39",
                                    "updated_at": "2017-08-15 09:40:05",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "83677f40-783c-11e7-bfe3-6b01e79883a5",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "8668f180-765b-11e7-b0b8-8fa37bb824de",
                                    "title": "秦人共携手，谱写新篇章",
                                    "image": "http://images.new.wezchina.com/resource/adv/1501758672924.jpg",
                                    "url": "#",
                                    "created_at": "2017-08-03 19:11:35",
                                    "updated_at": "2017-08-03 19:11:35",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "c2dcb990-783b-11e7-b3a9-636acfa1a3d3",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "8668f180-765b-11e7-b0b8-8fa37bb824de",
                                    "title": "梦想起航",
                                    "image": "http://images.new.wezchina.com/common/1501750575778.png",
                                    "url": "#",
                                    "created_at": "2017-08-03 19:06:12",
                                    "updated_at": "2017-08-03 19:06:12",
                                    "plat_admin_id": null
                                }
                            ],
                            "total": 4
                        },
                        "blocks": {
                            "list": [
                                {
                                    "weid": "7a6b6240-78f2-11e7-b63a-c94ccd7e1ba2",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "05d48da0-782b-11e7-8a40-2906333090db",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "http://images.new.wezchina.com/resource/adv/1501761945347.png",
                                    "url": "#",
                                    "created_at": "2017-08-04 16:54:08",
                                    "updated_at": "2017-08-07 22:14:55",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "6dc6bc10-78f2-11e7-bb75-631eed60fede",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "05d48da0-782b-11e7-8a40-2906333090db",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "http://images.new.wezchina.com/resource/adv/1502194735999.jpg",
                                    "url": "#",
                                    "created_at": "2017-08-04 16:53:47",
                                    "updated_at": "2017-08-04 16:53:47",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "5403a120-7844-11e7-8d41-3bfd004b4150",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "http://images.new.wezchina.com/resource/adv/1502194432997.jpg",
                                    "url": "#",
                                    "created_at": "2017-08-03 20:07:32",
                                    "updated_at": "2017-08-03 20:07:32",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "4c4100e0-7844-11e7-a4d8-1f3fc791114f",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "http://images.new.wezchina.com/resource/adv/1501762029987.png",
                                    "url": "#",
                                    "created_at": "2017-08-03 20:07:19",
                                    "updated_at": "2017-08-03 20:07:19",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "42a03f60-7844-11e7-ab6a-6154caa20645",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "http://images.new.wezchina.com/resource/adv/1501762014177.png",
                                    "url": "#",
                                    "created_at": "2017-08-03 20:07:02",
                                    "updated_at": "2017-08-03 20:07:02",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "35c99600-7844-11e7-b07e-77b9b10a9a5c",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "9d8a2660-765b-11e7-98ed-4d002791c6ea",
                                    "title": "首页滚动碎片",
                                    "image": "http://images.new.wezchina.com/resource/adv/1501761945347.png",
                                    "url": "#",
                                    "created_at": "2017-08-03 20:06:41",
                                    "updated_at": "2017-08-03 20:06:41",
                                    "plat_admin_id": null
                                }
                            ],
                            "total": 6
                        },
                        "block": {
                            "list": [
                                {
                                    "weid": "1fb86860-9853-11e7-aa48-61c3bee41533",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "988a7980-765b-11e7-ac51-05d65085c74e",
                                    "title": "建设频道",
                                    "image": "http://images.new.wezchina.com/plats/resource/1505287295640.jpeg",
                                    "url": "",
                                    "created_at": "2017-09-13 15:14:04",
                                    "updated_at": "2017-09-13 15:14:04",
                                    "plat_admin_id": "d3f06a11-6c47-11e7-a12a-00e04c8cace4"
                                },
                                {
                                    "weid": "5403v130-7844-11e7-8d41-3bfd004c4350",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "988a7980-765b-11e7-ac51-05d65085c74e",
                                    "title": "推荐栏目3",
                                    "image": "#",
                                    "url": "",
                                    "created_at": "2017-08-03 20:07:32",
                                    "updated_at": "2017-09-18 23:02:31",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "5403a120-7844-11e7-8d41-3bfd004c4350",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "988a7980-765b-11e7-ac51-05d65085c74e",
                                    "title": "推荐栏目2",
                                    "image": "#",
                                    "url": "",
                                    "created_at": "2017-08-03 20:07:32",
                                    "updated_at": "2017-09-18 23:03:30",
                                    "plat_admin_id": null
                                },
                                {
                                    "weid": "5403a120-7844-11e7-8d41-3bfd004c4250",
                                    "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                                    "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                                    "type_id": "988a7980-765b-11e7-ac51-05d65085c74e",
                                    "title": "推荐栏目1",
                                    "image": "#",
                                    "url": "",
                                    "created_at": "2017-08-03 20:07:32",
                                    "updated_at": "2017-09-18 23:04:38",
                                    "plat_admin_id": null
                                }
                            ],
                            "total": 5
                        },
                        "center": {
                            "weid": "caf4ba80-7842-11e7-a96a-0f4ed8ddf1ee",
                            "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                            "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                            "type_id": "94a9fc80-765b-11e7-b7cf-bdb6f064db85",
                            "title": "中间横幅",
                            "image": "http://images.new.wezchina.com/resource/adv/1501761278964.png",
                            "url": "http://new.wezchina.com/dw",
                            "created_at": "2017-08-03 19:56:32",
                            "updated_at": "2017-09-13 15:30:47",
                            "plat_admin_id": null
                        },
                        "peoples_title": {
                            "weid": "8143fd60-8182-11e7-9aa6-1d7f42474f32",
                            "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                            "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                            "type_id": "a56119c0-765b-11e7-a42e-770589f0cdd7",
                            "title": "风采",
                            "image": "#",
                            "url": "#",
                            "created_at": "2017-08-15 14:25:17",
                            "updated_at": "2017-08-19 13:53:35",
                            "plat_admin_id": "d3f06a11-6c47-11e7-a12a-00e04c8cace7"
                        },
                        "leader": {
                            "weid": "687148a0-7842-11e7-beeb-1d983f6bd8a4",
                            "plat_id": "88e41d20-72ad-11e7-8825-933924ec5999",
                            "plat_user_id": "11e41d20-72ad-11e7-8825-933924ec5999",
                            "type_id": "a139f5b0-765b-11e7-9a47-a55169e15a6d",
                            "title": "商会会长",
                            "image": "http://images.new.wezchina.com/user/avatar/1501747945200.jpg",
                            "url": "#",
                            "created_at": "2017-08-03 19:53:47",
                            "updated_at": "2017-08-03 19:53:47",
                            "plat_admin_id": null
                        },
                        "users": [
                            {
                                "weid": "77e41d20-72ad-11e7-8825-933924ec5963",
                                "avatar": "http://images.new.wezchina.com//user/avatar/1501747962172.jpg",
                                "real_name": "孙国栋",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "f6ee5110-75a0-11e7-a8b2-7179f2349d50",
                                "avatar": "http://images.new.wezchina.com//user/avatar/1501747874443.jpg",
                                "real_name": "张荣林",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "f4e7c590-7686-11e7-bdd1-bd45557ed232",
                                "avatar": "http://images.new.wezchina.com//user/avatar/1501747932796.jpg",
                                "real_name": "李国华",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "983ad200-7698-11e7-87c1-41f823b6258c",
                                "avatar": "http://images.new.wezchina.com//user/avatar/1501747945200.jpg",
                                "real_name": "康宁",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "1acc8080-769f-11e7-afe9-a1e618177dd9",
                                "avatar": "http://images.new.wezchina.com//user/avatar/1501747979135.jpg",
                                "real_name": "森朝",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "6ffe16d0-7737-11e7-aa93-d54026432560",
                                "avatar": "http://images.new.wezchina.com//user/avatar/1501747999786.jpg",
                                "real_name": "李雄",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "349e6fa0-7837-11e7-b217-671a38e00778",
                                "avatar": "http://images.new.wezchina.com//user/avatar/1501747999786.jpg",
                                "real_name": "康宁",
                                "nickname": "黄易"
                            },
                            {
                                "weid": "934c7b10-78dd-11e7-94c8-015cbd20044d",
                                "avatar": "http://images.new.wezchina.com//user/avatar/1501837469772.jpg",
                                "real_name": "吕家劲",
                                "nickname": "黄易"
                            }
                        ]
                    },
                    "token": null
                }

                //生成轮播图，通过weid查找图片对应的url
                var swiper = data.data.banners.list;
                var block = data.data.block.list;
                var blocks = data.data.blocks.list;
                var users = data.data.users;
                var swiperUrl = [];
                if (swiper != '') {
                    swiper.map(x => {
                        swiperUrl.push({id: x.weid, url: x.url});
                        $(".carousel").append(swiperTemplete(x));
                    });
                } else {
                    mainData.data.banners.list.map(x => {
                        swiperUrl.push({id: x.weid, url: x.url});
                        $(".carousel").append(swiperTemplete(x));
                    });
                }

                var mySwiper = new Swiper ('#my-swiper', {
                    direction: 'horizontal',
                    loop: true,
                    speed: 1000,
                    autoplay : 3000,
                    autoplayDisableOnInteraction : false,
                    pagination: '.swiper-pagination',
                    paginationClickable :true,
                    nextButton: '.swiper-button-next',
                    prevButton: '.swiper-button-prev',
                    grabCursor : true
                })

                $("#my-swiper").hover(function(){
                    $(".swiper-button-prev, .swiper-button-next").css("opacity", "0.6");
                }, function(){
                    $(".swiper-button-prev, .swiper-button-next").css("opacity", "0");
                });

                $("#carousel").click(function(e){
                    var id = $(e.target).parents(".swiper-slide").attr("id");
                    var res = swiperUrl.filter(x => id === x.id)
                    if (res != ""){
                        //window.location.href = res[0].url;
                        window.open(res[0].url);
                    }
                })

                //推荐链接
                var showBlock = setTimeout(function(){
                    if (block != '') {
                        var len = block.length;
                        for (var i = 0; i < len; i++) {
                            if (i < 4) {
                                $(".adv-left-" + i).html('<a href="' + block[len - i - 1].url + '" target="_blank">' + block[len - i - 1].title + '</a>');
                            }
                        }
                    } else {
                        var len = mainData.data.block.list.length;
                        for (var i = 0; i < len; i++) {
                            if (i < 4) {
                                $(".adv-left-" + i).html('<a href="' + mainData.data.block.list[len - i - 1].url + '" target="_blank">' + mainData.data.block.list[len - i - 1].title + '</a>');
                            }
                        }
                    }
                }, 0);

                //peoples title
                if (data.data.peoples_title != null) {
                    $(".imgs-title").text(data.data.peoples_title.title);
                } else {
                    $(".imgs-title").text('风采');
                }

                //会长
                var chairman = setTimeout(function() {
                    if (data.data.leader != null) {
                        $(".imgs-chairman").html('<a href=' + data.data.leader.url + '><img src=' + data.data.leader.image + ' width="80"/></a>');
                        $(".imgs-name").html(data.data.leader.title);
                    } else {
                        $(".imgs-chairman").html('<a href=' + mainData.data.leader.url + '><img src=' + mainData.data.leader.image + ' width="80"/></a>');
                        $(".imgs-name").html(mainData.data.leader.title);
                    }
                }, 0);

                var getUserInfo = function(){
                    $.ajax({
                        url: FOUNDER,
                        type: 'get',
                        success: function(data){
                            console.log(data);
                            if (data.code == 200){
                                var info = data.data;
                                var weid = info.weid;
                                /*//$(".imgs-chairman").html('<a href=' + '/article/list' + weid + '><img src=' + info.avatar + ' width="80"/></a>');
                                $(".imgs-chairman").html('<a href="/article/list"><img src=' + info.avatar + ' width="80"/></a>');
                                $(".imgs-name").html(info.nickname);*/
                                 if(info.nickname==null){
                                    var nickname=info.real_name;
                                }else{
                                    var nickname=info.nickname;
                                }
                                localStorage.setItem("indexweid",weid);
                                localStorage.setItem("nickname",nickname);
                                localStorage.setItem("avatar",data.data.avatar);
                            }
                        },
                        error: function(xhr){
                            console.log(xhr);
                        }
                    })
                }

                getUserInfo();

                //会员
                if (users != '') {
                    if (users.length < 8) {
                        users.map(x => $(".imgs-active").append(memberTemplete(x, false)))
                    } else {
                        users.map(x => $("#my-swiper1 .swiper-wrapper").append(memberTemplete(x, true)))
                        var mySwiper1 = new Swiper ('#my-swiper1', {
                            direction: 'horizontal',
                            loop: true,
                            slidesPerView : 8,
                            slidesPerGroup : 1,
                            speed: 3000,
                            autoplay : 1,
                            autoplayDisableOnInteraction : false,
                            grabCursor : true,
                            freeMode:true
                        })
                        $("#my-swiper1").mouseenter(function () {
                            mySwiper1.stopAutoplay();
                        }).mouseleave(function(){
                            mySwiper1.startAutoplay();
                        });
                    }                    
                } else {
                    mainData.data.users.map(x => $("#my-swiper1 .swiper-wrapper").append(memberTemplete(x, true)))
                    var mySwiper1 = new Swiper ('#my-swiper1', {
                        direction: 'horizontal',
                        loop: true,
                        slidesPerView : 8,
                        slidesPerGroup : 1,
                        speed: 3000,
                        autoplay : 1,
                        autoplayDisableOnInteraction : false,
                        grabCursor : true,
                        freeMode:true
                    })
                    $("#my-swiper1").mouseenter(function () {
                        mySwiper1.stopAutoplay();
                    }).mouseleave(function(){
                        mySwiper1.startAutoplay();
                    });
                }

                //中间广告
                var centerAdv = data.data.center;
                if(centerAdv != null) {
                    var centerImg = centerAdv.image;
                    if (centerImg.indexOf('http') === -1) {
                        centerImg = imgSet(centerImg, 960, 83);
                    }
                    $("#bar").css({
                        "background": "url(" + centerImg + ") no-repeat center",
                        "background-size": "100% 100%"
                    })
                    $("#bar").click(function () {
                        window.location.href = centerAdv.url;
                    })
                } else {
                    $("#bar").css({
                        "background": "url(/common/img/u_home_bg.png) no-repeat center",
                        "background-size": "100% 100%"
                    })
                    $("#bar").click(function () {
                        window.location.href = centerAdv.url;
                    })
                }

                //右侧滚动广告
                var cnt = 0;
                if (blocks != '') {
                    blocks.map(x => {
                        swiperUrl.push({id: x.weid, url: x.url});
                        if (cnt < 2) {
                            $(".adv-right-0").append(advTemplete(x));
                            cnt++;
                        } else if (cnt < 4) {
                            $(".adv-right-1").append(advTemplete(x));
                            cnt++;
                        } else if (cnt < 6) {
                            $(".adv-right-2").append(advTemplete(x));
                            cnt++;
                        }
                    })
                } else {
                    mainData.data.blocks.list.map(x => {
                        swiperUrl.push({id: x.weid, url: x.url});
                        if (cnt < 2) {
                            $(".adv-right-0").append(advTemplete(x));
                            cnt++;
                        } else if (cnt < 4) {
                            $(".adv-right-1").append(advTemplete(x));
                            cnt++;
                        } else if (cnt < 6) {
                            $(".adv-right-2").append(advTemplete(x));
                            cnt++;
                        }
                    })
                }

                var mySwiper2 = new Swiper ('#my-swiper2', {
                    direction: 'vertical',
                    loop: true,
                    slidesPerView : 1,
                    slidesPerGroup : 1,
                    speed: 1000,
                    autoplay : 2000,
                    autoplayDisableOnInteraction : false,
                    onlyExternal : true,
                })

                var mySwiper3 = new Swiper ('#my-swiper3', {
                    direction: 'vertical',
                    loop: true,
                    slidesPerView : 1,
                    slidesPerGroup : 1,
                    speed: 1000,
                    autoplay : 2000,
                    autoplayDisableOnInteraction : false,
                    onlyExternal : true,
                })

                var mySwiper4 = new Swiper ('#my-swiper4', {
                    direction: 'vertical',
                    loop: true,
                    slidesPerView : 1,
                    slidesPerGroup : 1,
                    speed: 1000,
                    autoplay : 2000,
                    autoplayDisableOnInteraction : false,
                    onlyExternal : true,
                })

                $(".adv-right").click(function(e){
                    var id = $(e.target).parents(".swiper-slide").attr("id");
                    var res = swiperUrl.filter(x => id === x.id);
                    if (res != ""){
                        //window.location.href = res[0].url;
                        window.open(res[0].url);
                    }
                })

                //其他设置
                var setting = data.data.setting;
                var bgImg = setting.background;
                var bar1 = setting.bar1;
                var bar2 = setting.bar2;
                var bar3 = setting.bar3;
                var bar4 = setting.bar4;
                var bgRight = setting.background_right;
                if (bgImg.indexOf('http') === -1){
                    bgImg = ApiMaterPlatQiniuDomain + bgImg;
                }
                if (bar1.indexOf('http') === -1){
                    bar1 = ApiMaterPlatQiniuDomain + bar1;
                }
                if (bar2.indexOf('http') === -1){
                    bar2 = ApiMaterPlatQiniuDomain + bar2;
                }
                if (bar3.indexOf('http') === -1){
                    bar3 = ApiMaterPlatQiniuDomain + bar3;
                }
                if (bar4.indexOf('http') === -1){
                    bar4 = ApiMaterPlatQiniuDomain + bar4;
                }
                if (bgRight.indexOf('http') === -1){
                    bgRight = ApiMaterPlatQiniuDomain + bgRight;
                }
                $("#home-body").css({ "background": "url(" + bgImg + ") no-repeat center", "background-size": "100%", "opacity": "1", })                
                $("#beijing")  .css({ "background-image": "url(" + bgRight + ")"})
                $("#nav-news") .css({ "background-image": "url(" + bar1 + ")","background-size": "cover","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-org")  .css({ "background-image": "url(" + bar2 + ")","background-size": "cover","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-help") .css({ "background-image": "url(" + bar3 + ")","background-size": "cover","background-repeat": "no-repeat","background-position": "center" })
                $("#nav-share").css({ "background-image": "url(" + bar4 + ")","background-size": "cover","background-repeat": "no-repeat","background-position": "center" })

                //官方发布
                $("#release").html(setting.weibo_show);

                //right side control
                var script_status = false;

                // 首页新闻模块
                $("#nav-news").click(function(){
                    homeState = "news";
                    $("#nav-news, .huzhu, .organization, .goodsBox").hide();
                    $(".home, #nav-help, #nav-share, #nav-org").show();
                    $("#nav-help,#nav-share").css("margin-left", "0");
                    $("#nav-org,#nav-help,#nav-share").css({ "position":"static", "left":"0" });
                    var temp = mySwiper.width;
                    mySwiper.startAutoplay();
                })

                // 首页组织模块
                $("#nav-org").click(function(){
                    if(!script_status) {
                        $.getScript("/common/js/organized.js");
                        script_status = true;
                    }
                    homeState = "org";
                    $(".home, #nav-org, .huzhu, .goodsBox").hide();
                    $("#nav-news, #nav-help, #nav-share, .organization").show();
                    $("#nav-org,#nav-share").css({ "margin-left": "0", "position":"static" });
                    $("#nav-help").css({ "position":"static", "left":"0", "margin-left":"105px" });
                    mySwiper.stopAutoplay();
                })

                // 首页互助模块
                $("#nav-help").click(function(){
                    homeState = "help";
                    $(".home, #nav-help, .organization, .goodsBox").hide();
                    $("#nav-news, #nav-org, #nav-share, .huzhu").show();
                    $("#nav-org").css({ "position":"absolute", "left":"-855px" });
                    $("#nav-help").css({ "margin-left": "0", "position":"static" });
                    $("#nav-share").css({ "position":"static", "left":"0", "margin-left":"210px" });
                    mySwiper.stopAutoplay();
                    activitylist(localStorage.getItem("indexweid"),localStorage.getItem("nickname"),localStorage.getItem("avatar"),1,8);
                    projectcate(localStorage.getItem("indexweid"),localStorage.getItem("nickname"),localStorage.getItem("avatar"));
                    projectlist(localStorage.getItem("indexweid"),localStorage.getItem("nickname"),localStorage.getItem("avatar"),"",1);

                })

                // 首页共享模块
                $("#nav-share").click(function(){
                    homeState = "share";
                    $(".home, .huzhu, #nav-share, .organization").hide();
                    $("#nav-news, #nav-org, #nav-help, .goodsBox").show();
                    $("#nav-share,#nav-help").css("margin-left", "0");
                    $("#nav-org").css({ "position":"absolute", "left":"-855px" });
                    $("#nav-help").css({ "position":"absolute", "left":"-750px" });
                    mySwiper.stopAutoplay();
                    shoppinglist(localStorage.getItem("indexweid"),1);
                })

                var title = setting.title;
                var favicon = setting.favicon;
                var keyWord = setting.key_word;
                var description = setting.description;
                var backgroundUp = setting.background_up;
                var logo = setting.logo;

                localStorage.setItem('fav', favicon);
                localStorage.setItem('logo', logo);
                localStorage.setItem('title', title);

                $('title').text(title);
                $('meta[name="keywords"]').attr('content', keyWord);
                $('meta[name="description"]').attr('content', description);

                if(favicon.indexOf('http') === -1){
                    favicon = ApiMaterPlatQiniuDomain + favicon;
                }
                $('#favicon').attr('href',favicon);

                if(backgroundUp.indexOf('http') === -1){
                    backgroundUp = imgSet(backgroundUp, 960, 424);
                }
                $('#home-head').css({
                    'background': "url(" + backgroundUp + ") no-repeat center",
                    'background-size': '100%'
                })
            }
        })
    }

    loadHome()

    //读取首页新闻
    var loadNews = function(){
        $.ajax({
            url: CMS_INDEX_GRID,
            dataType: 'json',
            success: function(data){
                console.log(data.data);
                var newsCnt = 0;
                var noticeCnt = 0;
                var esNewsCnt = 0;
                data.data.hot.map(x => $(".main-news").append(mainNews(x))); //头条新闻
                data.data.news.map(x => {
                    if (newsCnt < 8) {
                        $("#center").append(centerNews(x));
                        newsCnt++;
                    }
                });//新闻中心
                data.data.nitoce.map(x => {
                    if (noticeCnt < 8) {
                        $("#sirase").append(centerNotice(x));
                        noticeCnt++;
                    }
                });//公示公告
                data.data.especial_news.map(x => {
                    if (esNewsCnt < 4) {
                        $(".rcd-tb").append(specialRecommend(x, "read.html"));
                        esNewsCnt++;
                    }
                }); //特别推荐
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    loadNews();

    //读取会员推荐新闻
    var loadMemberNews = function(){
        $.ajax({
            url: ARTICLES,
            dataType: 'json',
            success: function(data){
                console.log(data.data);
                var esNewsCnt = 0;
                data.data.list.map(x => {
                    if (esNewsCnt < 4) {
                        $(".rcd-hy").append(memberRecommend(x, "readArticle.html"));
                        esNewsCnt++;
                    }
                }); //特别推荐
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    loadMemberNews();

    var newsItems = ['center', 'sirase', 'release'];
    var remove = function(arr, item){
        return arr.filter(x => x != item);
    }
    var rem = 'center';
    $(".center").css("border-bottom", "3px solid #4fb7ff");
    $(".center, .sirase, .release").hover(function(){
        $("." + rem).css("border-bottom", "none");
        $(this).css("border-bottom", "3px solid #4fb7ff");
        var item = $(this).attr('class').split(' ')[0];
        rem = item;
    }, function(){
        $("." + rem).css("border-bottom", "3px solid #4fb7ff");
        var res = remove(newsItems, rem);
        res.map(x => $("." + x).css("border-bottom", "none"));
    })

    //活动 start
     var listtemplate = function(data,nickname,avatar){
        var typetext="";
       if(data.type==1){
            typetext="免费";
       }else{
            typetext="收费";
       }

        //你设定的时间
        var aa=new Date(data.begain_time);
        var y=aa.getFullYear();
        var m=aa.getMonth()+1;
        var d=aa.getDate(); 
        //现在的时间
        var nn=new Date();
        var yn=nn.getFullYear();
        var mn=nn.getMonth()+1;
        var dn=nn.getDate();
        var timetext="";
        // alert((yn-y)+'年'+(mn-m)+'个月'+(dn-d)+'天之前')
        if((yn-y)>=1){
            timetext= (yn-y)+'年前';
        }else if((mn-m)>=1){
            timetext= (mn-m)+'月前';
        }else{
            if((dn-d)>0){
                timetext= (dn-d)+'天前';
            }else if((dn-d)==0){ 
                timetext= '今天';
            }else{
                timetext= Math.abs(dn-d)+'天后';
            }
        }

        var templete=
        '<div class="col-sm-3 p-r-0" style="margin-top: 15px;margin-bottom: 5px">'+
            '<div class="project-lists-one">'+
                '<div class="project-section">'+
                    '<div class="biaoti">热门活动</div>'+
                    '<div class="shijian"> '+timetext+'</div>'+
                    '<a href="'+data.domain+'/activity/'+data.weid+'" target="_blank" class="hover-img-box">'+
                        '<div class="posi-div"><img src="'+ApiMaterPlatQiniuDomain+data.cover+'" class="person-left-img"></div>'+
                    '</a>'+
                    '<img class="logo" src="'+ApiMaterPlatQiniuDomain+avatar+'" alt="">'+
                    '<div class="project-username">'+nickname+'</div>'+
                '</div>'+

                '<div class="content">'+
                    '<div class="title ">'+
                        '<a class="font-weight" target="_blank" href="'+data.domain+'/activity/'+data.weid+'">'+data.title+'</a>'+
                    '</div>'+

                    '<div class="jutishijian">'+
                        '<span class="z"><i class="fa fa-clock-o"></i></span>'+data.begain_time+' ~ '+data.end_time+
                    '</div>'+
                    '<!--<div class="biaoqian">'+
                        '<span>人工智能</span> <span>智能软件</span>'+
                    '</div>-->'+
                    '<div class="didian">'+
                        '<i class="fa fa-map-marker"></i>'+
                        '<span class="address">'+data.area_name+'</span>'+
                        '<span class="y">'+typetext+'</span></div>'+
                '</div>'+
            '</div>'+
        '</div>';
        return templete;
    }

    // 1.获取活动列表
    var activitylist=function(weid,nickname,avatar,page,limit){
         var sendData={
            user_id:weid, 
            limit:limit,
            page:page,          
            status:2,
            is_private:1           
        }
        console.log(sendData);
        $.ajax({
            url:ACTIVITY_LIST,
            type:'post',
            data:sendData,
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                console.log(data);
                if(data.code == 200){
                    if(data.data.total>0){
                        if(page<=1){
                            $("#huodong .person-article-lists").children().remove();

                        }else{
                            $(".more").remove();
                        }
                        data.data.list.map(x =>{
                            $("#huodong .person-article-lists ").append(listtemplate(x,nickname,avatar));

                        }) 
                        var pagenum=Math.ceil(data.data.total/limit);//总页码
                        if(page<pagenum){
                            $("#huodong .person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>查看更多</div>");

                        }else{
                        $("#huodong .person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>这是我的底线啦~~~</div>");

                        }
                        page++;

                        $(".more").click(function(){
                            activitylist(weid,nickname,avatar,page,8);
                        })
                    }else{
                         $("#huodong .person-article-lists ").children().remove();
                        $("#huodong .person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>这是我的底线啦~~~</div>");

                    }
                    


                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //活动 end
    //项目 start
    var projectlisttemplate = function(data,nickname,avatar){
        var typetext="";
        if(data.type==1){
            typetext="免费";
        }else{
            typetext="收费";
       }

       //你设定的时间
        var aa=new Date(data.date_start);
        var y=aa.getFullYear();
        var m=aa.getMonth()+1;
        var d=aa.getDate();
        //现在的时间
        var nn=new Date();
        var yn=nn.getFullYear();
        var mn=nn.getMonth()+1;
        var dn=nn.getDate();
        var timetext="";
        // alert((yn-y)+'年'+(mn-m)+'个月'+(dn-d)+'天之前')
        if((yn-y)>=1){
            timetext= (yn-y)+'年前';
        }else if((mn-m)>=1){
            timetext= (mn-m)+'月前';
        }else{
            if((dn-d)>0){
                timetext= (dn-d)+'天前';
            }else if((dn-d)==0){
                timetext= '今天';
            }else{
                timetext= Math.abs(dn-d)+'天后';
            }
        }

        var templete=`
        <div class="col-sm-3 " style="padding-left: 15px;padding-right: 0">
            <div class="project-lists-one">
                <div class="project-section">
                    <div class="shijian"> `+timetext+`</div>
                    <div class="yishou"><span class="span_left"></span><span class="span_status">`+data.onStatus+`</span><span class="span_right"></span></div>
                    <div class="zhonglei y xiang-mu-baio-zhi"><span> `+data.cate_name+` </span></div>
                    <a href="/`+data.domain+`/project/projectdetail/`+data.weid+`" target="_blank">
                        <div class="posi-div"><img src=`+ApiMaterPlatQiniuDomain+data.cover+` class="p100 person-left-img"></div>
                    </a>
                    <img class="logo" src=`+ApiMaterPlatQiniuDomain+avatar+` alt="">
                    <div class="project-username">`+nickname+`</div>
                </div>
                <div class="content">
                    <div class="title ">
                        <a class="font-weight" target="_blank" href="/`+data.domain+`/project/projectdetail/`+data.weid+`">`+data.title+`</a>
                    </div>                            
                    <div class="project-money">
                        <div class="shengluehao p0">
                           <span class="article-color ">目标金额<i class="y">`+data.amount+` 元</i></span>
                        </div>
                        <div class="shengluehao p0">
                         <span class="article-color"><span>已筹金额</span><i class="y">`+data.raise_amount+` 元</i></span>
                        </div>
                    </div>
                    <div class="article-item-user-image">
                       <p class="y m0">已有 <i>`+data.suport_num+` </i>人支持</p>
                    </div>
                </div>
            </div>
        </div>`;
        return templete;
    }


    // 1.获取项目列表
    var projectlist=function(weid,nickname,avatar,cateid,page){
        console.log(weid);
        var limit=8;
        var sendData={
            user_id:weid,
            cate_id:cateid,
            limit:limit,
            page:page,
            is_private:1            
        }
        console.log(sendData);
        $.ajax({
            url:PROJECT_LIST,
            type:'post',
            data:sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            //console.log(token)
            success:function(data){
                // console.log(data);
                if(data.code == 200){
                  if(cateid!=""){
                     if(page<=1){
                        $("#xiangmu .huzhubox").children().remove();                        

                    }

                  }
                    if(data.data.total>0){
                        if(page<=1){
                            $("#xiangmu .huzhubox").children().remove();

                        }else{
                            $(".more").remove();
                        }
                        data.data.list.map(x =>{
                            $("#xiangmu .huzhubox ").append(projectlisttemplate(x,nickname,avatar));

                        })
                         var pagenum=Math.ceil(data.data.total/limit);//总页码
                        if(page<pagenum){
                            $("#xiangmu .huzhubox ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>查看更多</div>");

                        }else{
                          $("#xiangmu .huzhubox").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')

                        }
                        page++;

                        $(".more").click(function(){
                            projectlist(weid,nickname,avatar,cateid,page);
                        })
                    }else{
                        $("#xiangmu .huzhubox").children().remove();
                        $("#xiangmu .huzhubox").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')
                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //2.1分类模板
    var catetemplate=function(data){
      var catehtml=` <a href="javascript:void(0);" data-id="`+data.weid+`"><span>`+data.name+`</span></a>`;
      return catehtml;
    }
    //2.获取项目分类
    var projectcate=function(userid,nickname,avatar){
       $.ajax({
            url:PROJECT_CATE_LIST,
            type:'post',
            data:{user_id:userid},
            headers: {
                'Token': localStorage.getItem('token')
            },
            success:function(data){
                if(data.code == 200){
                    $(".little-title").children().remove();
                    data.data.list.map(x => {
                      $(".little-title").append(catetemplate(x));
                    });
                    $(".little-title a").click(function(){
                      projectlist(userid,nickname,avatar,$(this).data("id"),1);
                    })
                }else{
                  mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //项目 end
    //商品列表
    var coverPicpath = '/common/img/products_load.jpg';
    var shopListTemplete = function(data){
        if(data.cover!=''){
            coverPicpath=ApiMaterPlatQiniuDomain+data.cover;
        }
        var templete=`
            <div class="col-sm-3  page-goods-index-p-r-2" data-id="`+ data.weid +`" id="product">
                <div class="project-lists-one" id="projectListOne">
                    <a href="/index/wemall/goods/`+data.weid+`" target="_blank">
                        <img src="` + coverPicpath +`" class="goods-height">
                    </a>
                    <div class="product-massage">

                        <p class="goods-name">
                            <a href="/index/wemall/goods/`+data.weid+`" target="_blank">`+ data.title +`</a>
                        </p>

                        <p class="goods-main">
                            `+ data.summary+`
                        </p>
                        <p class="product-price">
                            <i>￥</i>`+ data.price + `
                            <span class="y">市场价￥`+ data.marketprice +`</span>
                        </p>
                        <div class="yishouandshoucang">
                            <div class="z">已售<span class="time"> `+data.sales_num+` </span> </div>
                            <div class="y">收藏<span class="time"> `+ data.collections +` </span></div>
                        </div>

                        <a href="/index/wemall/goods/`+data.weid+`" class="white">
                            <div class=" buy-now">
                                立即购买
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        `;
    
        return templete;
    }
    var shoppinglist=function(weid,page){
        var limit=8;
        var keywords='';
         var sendData = {
            userId: weid,
            limit: limit,
            page: page,
            keywords: keywords
        }
        console.log(sendData);
        $.ajax({
            url:GOODS_LISTS_USER,
            type:'post',
            data: sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var shop = data.data.list;
                    /* if(shop.length==0){
                        ulnone($("."+tid));
                    }*/
                    if(data.data.total>0){
                      // $("#goodsBox .person-goods-lists .row").children().remove();
                       if(page<=1){
                            $("#goodsBox .person-goods-lists .row").children().remove();

                        }else{
                            $(".more").remove();
                        }
                        shop.map(x => {
                           
                            if(x.status==1){
                               $("#goodsBox .person-goods-lists .row").append(shopListTemplete(x));
                            }
                            else{
                                // $("."+tid).append('<p style="width:100%;height:100px;text-align:center;line-height:100px;">这家伙很懒，什么东西都没留下~~~</p>')
                            }
                          
                        })  
                          var pagenum=Math.ceil(data.data.total/limit);//总页码
                        if(page<pagenum){
                            $("#goodsBox .person-goods-lists .row").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>查看更多</div>");

                        }else{
                          $("#goodsBox .person-goods-lists .row").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')

                        }
                        page++;

                        $(".more").click(function(){
                            shoppinglist(weid,page);
                        })
                    }else{
                         $("#goodsBox .person-goods-lists .row").children().remove();
                        $("#goodsBox .person-goods-lists .row").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')
                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
})
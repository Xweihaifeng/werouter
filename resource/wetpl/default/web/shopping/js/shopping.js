$(document).ready(function () {
    var qiniu_upload_domain = 'http://upload.qiniu.com';
    var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
    var currHeight = $("#art-head").height() + $("#art-body").height();
    setHeight(currHeight);

    var saveUserInfo = function (token) {
        localStorage.setItem('token', token);
    }

    //路由处理逻辑
    if (window.location.pathname == "/wemall") {
        window.location = "/index/wemall";
    }
    var weid = localStorage.getItem('weid');

    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);
    console.log(window.location.pathname);
    //route
    var isLogin; //判断用户登陆与否

    //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function (e) {
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
    }, function () {
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })

    //主页初始化
    var init = function (token) {
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
    options0.done(function (data) {
        console.log(data);
        if (data.code == 200) {
            if (!data.data) {
                return false;
            }

            var setting = data.data.setting;
            window.localStorage.setItem("logo", setting.logo);
            window.localStorage.setItem("fav", setting.favicon);

            if (!setting.favicon == false) {
                var favicon = ApiMaterPlatQiniuDomain + setting.favicon;
                $("#public_icon").attr("href", favicon);
            }

            if (!setting.logo == false) {
                var logo = ApiMaterPlatQiniuDomain + setting.logo;
                // $("#home .logoImg").css({"background-image": "url(" + logo + ")"});
                $("#home img").attr("src", logo);
            }
        }
    });
    options0.fail(function (error) {
        console.error(error);
    });
    //商品分类模板
    var cateType = [];
    var floor = 0;
    var shopTypeTemplete = function (data) {
        cateType.push(data.name);
        var templete = '<div class="ws_item" ><h2 class="ws_tit" id=' + data.weid + '><i>' + floor + 'F</i><span>' + data.name + '</span></h2><ul class="' + data.weid + '"></ul></div>';
        return templete;
    }
    // 获取商品分类
    // var cateType = [];
    var catesfun = function (weid) {
        console.log(weid);
        $.ajax({
            // url: "http://apitest.wezchina.com/goods/cates/list",
            url: GOODS_CATES_LIST_USERID + "/" + weid,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function (data) {
                console.log(data);
                if (data.code == 200) {
                    var cate = data.data;
                    if (cate.length > 0) {
                        cate.map(x => {
                            floor++;
                            $(".ws_box").append(shopTypeTemplete(x));
                            shoplist(x.weid, x.name, weid)

                        })
                    } else {
                        $(".ws_box").append('<p style="margin-top: 50px; text-align: center;">这家伙很懒，什么也没留下...</p>')
                    }


                } else {
                    console.log('GOODS CATES LIST ERROR');
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        })
    }


    // 获取商城详情
    var page_id = mall_id = plat_id = '';
    var malldetail = function () {
        $.ajax({
            url: MALL_USERDETAIL,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function (data) {
                // console.log(data);
                if (data.code == 200) {
                    var malldata = data.data;
                    page_id = malldata.page_id;
                    mall_id = malldata.weid;
                    plat_id = malldata.plat_id;
                    /*shoplist();
                    malldata.map(x => {

                    })*/
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        })
    }
// malldetail();


    var coverId = 0;
    var coverPicId = '';
    var coverPicpath = '../common/img/products_load.jpg';
    var shopListTemplete = function (data) {
        coverPicId = "cover-pic-" + coverId;
        if (data.cover != '') {
            coverPicpath = qiniu_bucket_domain + data.cover;
        }
        var templete =
            '<li data-id="' + data.weid + '"    class="shopli">' +
            '<div class="ws_pro_box">' +
            '<div class="img">' +
            '<a href=\'javascript:void(0)\' target="_blank">' +
            '<img class="pro_load"  src="' + coverPicpath + '"/></a>' +
            '</div>' +
            '<h3 class="tit">' +
            '<a href=\'javascript:void(0)\' target="_blank">' + data.title + '</a>' +
            '</h3>' +
            '<p class="brief">' +
            '<a href=\'javascript:void(0)\' target="_blank">' + data.summary + '</a>' +
            '</p>' +
            '<div class="price">' +
            '<span><em>￥</em>' + data.price + '</span>' +
            '<b>市场价 ￥<i>' + data.marketprice + '</i></b>' +
            '</div>' +
            '<div class="state">' +
            '<span class="l"><i>已售 </i><em>' + data.sales_num + '</em></span>' +
            '<span class="r"><i>收藏 </i><em>' + data.collections + '</em></span>' +
            '<p>' +
            '<a href="javascript:void(0)" class="buy_btn" target="_blank">立即购买</a>' +
            '</p>' +
            '</div>' +
            '</div>' +
            '</li>';
        return templete;
    }

    //tid: 商品分类id, tname: 分类名
    // 通过用户id和分类获取商品列表
    var shoplist = function (tid, tname, weid) {
        var limit = '';
        var page = '';
        var keywords = '';
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
            url: GOODS_LISTS_USERANDCATE,
            type: 'post',
            data: sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function (data) {
                console.log(data);
                if (data.code == 200) {
                    var shop = data.data.list;
                    if (shop.length == 0) {
                        ulnone($("." + tid));
                    }

                    shop.map(x => {
                        if(x.cover != ""){
                            var coverPicCss = {
                                'background': 'url(' + x.cover + ') no-repeat center',
                                'background-size': '100%'
                            }
                        }else{
                            var coverPicCss = {
                                    'background': 'url(/common/img/products_load.jpg) no-repeat center',
                                    'background-size': '100%'
                                }
                        }
                        if(x.status == 1) {
                            $("." + tid).append(shopListTemplete(x));
                        }

                        lihover();

                        $("[data-id='" + x.weid + "']").click(function (e) {
                        var goodsId = $(e.target).parents(".shopli").attr("data-id");
                        readAmount(goodsId);
                        console.log("/shopping/" + goodsId);

                        window.location.href = url + "/wemall/goods/" + goodsId;
                    })
                        coverId += 1;
                    })
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        })
    }


    //商品浏览数暂未写
    var readAmount = function (id) {
        //console.log(id);
        $.ajax({
            url: ARTICLES_VIEW,
            type: 'post',
            data: {"articleId": id},
            success: function (data) {
                //console.log(data);
            },
            error: function (xhr) {
                console.log(xhr);
            }
        })
    }
    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);

    $(".linkto").attr('href', '/' + domain)

    var host = ApiMaterPlatQiniuDomain;
    var userId;

    if (domain == 'wemall') {
        domain = '';
    } else {
        domain = "/" + domain;
    }

    // 鼠标滑动到列表时加hover
    var lihover = function () {
        $(".ws_item li").mouseenter(function () {
            $(this).addClass("hover")
        }).mouseleave(function () {
            $(this).removeClass("hover")
        })
    }
    // 没有商品时显示
    var ulnone = function (obj) {
        obj.each(function () {
            var liLen = $(this).children("li").length;
            var licum = Math.ceil(liLen / 3);
            $(this).attr('licum', licum)
            if (licum > 1) {
                $(this).siblings(".ws_item_more").css("visibility", 'visible');
            } else if (licum == 0) {
                $(this).css("height", "50px").append("<li class='nonepro'>您要的货正在路上~~~</li>")
            }
        })
    }
    catesfun(weid);
    if (localStorage.getItem('title') == "" || localStorage.getItem('title') == null || localStorage.getItem('title') == undefined || localStorage.getItem('title') == "null") {
        $.ajax({
            url: apiUrl + "cms/advs",
            type: 'get',
            success: function (data) {
                if (data.code == 200) {
                    $('title').text('商城-' + data.data.setting.title + '官方微主页');
                    localStorage.setItem('title', data.data.setting.title);
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        })
    } else {
        $('title').text('商城-' + localStorage.getItem('title') + '官方微主页');

    }

    //数据分页
    var reqUrl = apiUrl + 'circel/flist';
    var pages = function (url, domain, type, page, limit) {
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

    $("#more").click(function () {
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
})

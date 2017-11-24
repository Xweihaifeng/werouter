/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
 var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    // console.log('domain', domain);
    $(".linkto").attr('href', '/' + domain)
    $(document).ready(function(){
    var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;

    // token 加载值请求头（Headers）
    var token = window.localStorage.getItem('token'), isLogin = false;
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login a").css({
                'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
                'background-size': '100%'
            });
            $("#login a").addClass("i-header").html("");
        }
    }

    init(token);

    var router = function(route){
        if (!isLogin) {
            showLogin = true;
            $("#modal_login").fadeIn(300);
        } else {
            window.location.href = "/";
        }
    }

    var showLogin = false; //调整窗口大小时登陆框是否存在
    var currWidth = $(window).width();
    var currHeight = $(window).height();
    var width = $(window).width() / 2 - 180;
    var height = $(window).height() / 2 - 165;
    var readHeight = $(".read").height();

    if (readHeight == 768){
        $(".left-nav").css("min-height", currHeight);
        $(".read").css("min-height", currHeight);
        $(window).resize(function(){
            currWidth = $(window).width();
            currHeight = $(window).height();
            width = $(window).width() / 2 - 180;
            height = $(window).height() / 2 - 165;
            var top = $(window).scrollTop();
            $(".left-nav").css("min-height", currHeight);
            $(".read").css("min-height", currHeight);
            $(".show-login").css({
                "margin-top": top + height,
                "margin-left": width
            });
        })
    }

    var tusitemp="";
    function mess_tusi(strs){
        clearTimeout(tusitemp);
        $("#mess_tusi").remove();
        //创建吐丝层并写入内容
        if(!$("#mess_tusi").attr("id")){ //吐丝层不存在创建
            $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>"+strs+"</span></div>"); //写入内容
        }else{
            $("#mess_tusi").html(strs);  //写入内容
        }
        //定义吐丝层位置
        var left=(1200 - $("#mess_tusi").width())/2;//居中
        var top=$(window).height()*0.5;
        $("#mess_tusi").css({"left":left+"px","top":top+"px"});

        //显示吐丝层rou't
        $("#mess_tusi").css("display",'');

        //2秒后关闭
        tusitemp =  setTimeout(function (){
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        },2000);
        return false;
    }

    var options0 = $.get(CMS_ADVS);
    options0.done(function(data) {
        // console.log(data);
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

    var weid = localStorage.getItem('weid');

    var id = window.location.href.split('/').pop();
    var url = window.location.href.split('/');
    var urlall=window.location.href.split('#');
    var urlpath=urlall.pop();
    var domain = url.slice(3, 4)[0];

    var checkdomain=function(domain,id){
        // if(domain!="index" && domain!="wemall"){
        if(domain!="wemall"){

            $.ajax({
                url:GOODS_DOMAINGOODSISTRUE,
                type: 'post',
                data:{domain:domain,goodsid:id},
                dataType:'json',
                headers: {
                    'Token': localStorage.getItem('token')
                },
                success: function(data){
                    // console.log(data);
                    if (data.code == 200){
                    init(id);

                    } else {
                        if(urlpath=='goods_rule'||urlpath=='goods_detail'){
                          window.location=urlall[0]

                        }else{
                           window.location='/404';
                        }
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }

            })
        }else if(domain=="wemall"){
            window.location="/index/wemall/goods/"+id;
        }
        console.log(domain);
    }
    checkdomain(domain,id);
 /*   //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route,domain){
        var routerList = ['home', 'login', 'article', 'shopping'];

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
                $("#modal").show();
                $(".show-login").css({
                    "margin-left": width,
                    "margin-top": top + height
                });
                $(".show-login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user/";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href = domain + "/article";

        }
        var shopping = function(){
            showLogin = false;
            window.location.href =  domain + "/wemall";

        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id,domain);
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
        }
    }
*/
    // init(localStorage.getItem('token'));

    // console.log(window.location.href.split('/'));
     //获取当前网址，如： http://localhost:8083/proj/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： proj/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPath = curWwwPath.substring(0, pos);
    // console.log(localhostPath);
    localStorage.setItem("localhostPath",localhostPath);
    var headId = 0;
    var headIconId = '';
    var artTemplete = function(data){
        headIconId = "head-" + headId;


        var templete=
                '<div class="user_info_left">'+
                    '<span></span>'+
                    '<div class = "qr_code_icon">'+
                        '<!--<em><img src="picture/wez_erweima_1.jpg" /></em>-->'+
                        '<div class="boxcode">'+
                            '<div class="price_icon tc" id="product_qrcode" rel="'+localhostPath+domain+'/wemall/goods/'+data.weid+'"></div>'+
                        '</div>'+
                    '</div>'+
                    '<div class="westoreWarp">'+
                        '<div class="pro_deta_top clearfix">'+
                            '<div class="pro_deta_imgs">'+
                                '<div id="preview" class="spec-preview">'+
                                    '<span class="jqzoom">'+
                                        '<img jqimg="'+qiniu_bucket_domain+data.cover+'" src="'+qiniu_bucket_domain+data.cover+'" />'+
                                    '</span>'+
                                '</div>'+
                                '<!--缩图开始-->'+
                                '<div class="spec-scroll"> <a class="prev">&lt;</a> <a class="next">&gt;</a>'+
                                     '<div class="items">'+
                                        '<ul>'+
                                            '<li>'+
                                                '<img alt="" bimg="'+qiniu_bucket_domain+data.cover+'" src="'+qiniu_bucket_domain+data.cover+'" onmousemove="preview(this);" >'+
                                            '</li>'+
                                        '</ul>'+
                                    '</div>'+
                                '</div>'+
                                '<!--缩图结束-->'+
                            '</div>'+
                            '<div class="pro_deta_info">'+
                                '<form  method="get">'+
                                    '<h2 class="tit" title="'+data.title+'">'+data.title.substr(0,60)+'</h2>'+
                                    '<p class="brief" title="'+data.summary+'">' + data.summary.substr(0,120) + '</p>'+
                                    '<div class="price">'+
                                        '<b>价格</b>'+
                                        '<span><em>￥</em>' + data.price + '</span>'+
                                        '<b>市场价 ￥<i>' + data.marketprice + '</i></b>'+
                                    '</div>'+
                                    '<div class="state">'+
                                        '<span class="l"><i>已售 </i><em>'+data.sales_num+'</em></span>'+
                                        '<span class="r"><i>收藏 </i><em id="collectnum">' + data.collections + '</em></span>'+
                                    '</div>'+
                                    '<div class="control-group small-control-group clearfix" style="margin-top:10px">'+
                                        '<label class="control-label" style="text-align: left;font-size: 14px;width: 38px;color: #999;    overflow: hidden;">配送至：</label>'+
                                        '<div class="control-text">'+
                                            '<select name="province" id="province" class="ui-select field_select small">'+
                                                '<option value="" rel="0">请选择省份</option>'+
                                            '</select>'+
                                            '<select name="city" id="city" class="ui-select field_select small">'+
                                                '<option value="" rel="0">请选择城市</option>'+
                                            '</select>'+
                                        '</div>'+
                                        '<div class="blank0"></div>'+
                                    '</div>'+
                                    '<div class="key">'+
                                        '<div class="amount">'+
                                            '<span class="tb-l">数量</span>'+
                                            '<span class="tb-amount-widget">'+
                                                '<span class="mui-amount-increase">-</span>'+
                                                '<input type="text" class="tb-text mui-amount-input" value="1" maxlength="100" title="请输入购买量" name="num">'+
                                                '<span class="mui-amount-decrease">+</span>'+
                                             '</span>'+
                                             '<em class="tb-hidden" style="display: inline;">库存<span class = "num_kc">'+data.stock+'</span>件</em>'+
                                        '</div>'+
                                        '<p>'+
                                            '<button class="buy_btn" type="button" id='+data.weid+'>立即购买</button>'+
                                            '<a href="javascript:;" class="collect_btn collect-btn-click" data-tag="on" >立即收藏</a>'+
                                        '</p>'+
                                    '</div>'+

                                '</form>'+
                            '</div>'+

                        '</div>'+
                        '<div class="pro_deta_com" id = "goods_detail">'+
                            '<div class="pro_deta_tab" >'+
                                '<a href="#goods_detail" class="active pro_date_tit2">商品详情</a>'+
                                '<a class="pro_date_tit" href="#goods_rule">购买须知</a>'+
                            '</div>'+
                            '<div class="pro_det">'+
                                '<p>'+
                                    '<p>'+
                                        '<span style="color:#666666;font-family:Arial, &quot;font-size:16px;font-weight:bold;background-color:#FFFFFF;">'+data.content+'</span>'+
                                    '</p>'+
                                '</p>'+
                            '</div>'+

                            '<div class="pro_need_kown">'+
                                '<h2 class="pro_det_tit" id="goods_rule">购买须知</h2>'+
                                '<div class="info">'+
                                    '<p>'+
                                        '<span style="color:#666666;font-family:Arial, &quot;font-size:16px;font-weight:bold;background-color:#FFFFFF;">'+data.note+'</span>                             </p>'+
                                '</div>'+
                            '</div>'+

                            '<div class="shangpingpingjia">'+
                                '<h2 class="pro_det_tit" id="pro_mess">精选评价</h2>'+

                                '<ul class="pingjianeirong">'+

                                '</ul>'+
                            '</div>'+

                        '</div>'+
                    '</div>'+
                '</div>';
        return templete;
    }
    var messtemplete=function(data){
        if(data.avatar==null || data.avatar==""){
            var imgsrc="/common/img/default_head.png";
        }else{
            var imgsrc=data.avatar;
        }
        if(data.nickname==null){
            var nickname="";
        }else{
            var nickname=data.nickname;
        }
        var messhtml='<li class="supporter">'+
                        '<div class="supporter_img ">'+
                            '<img class="img-circle" src="'+qiniu_bucket_domain+imgsrc+'">'+
                        '</div>'+
                        '<div class="supporter_user">'+
                            '<span class="supporter_user_log"></span>'+
                            '<p class="supporter_user_mid m0">'+nickname+' </p>'+
                            '<span class="supporter_user_sm"></span>'+
                            '<div class="supporter_user_color">'+data.created_at+'</div>'+
                           ' <div class="supporter_user_liuyan" style="width: 632px"> '+data.content+'</div>'+
                        '</div>'+
                    '</li>';
        return messhtml;
    }
    //商品评论列表
    var goodsmess=function(id){
        $.ajax({
            url:GOODS_COMMENT_LIST,
            type: 'post',
            data:{goods_id:id},
            dataType:'json',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                // console.log(data);
                if (data.code == 200){
                    data.data.list.map(x => {
                        $(".pingjianeirong").append(messtemplete(x));

                    })
                } else {
                    mess_tusi("MESSAGE IS ERROR");
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }



    var loadGoods = function(reqUrl, id, type, data){
        /*if (data.thumb_image != undefined){
            var headIconCss = {
                'background': 'url(' + data.thumb_image + ') no-repeat center',
                'background-size': '100% 100%'
            };
        } else {
            var headIconCss = {
                'background': 'url(../../common/img/my.png) no-repeat center',
                'background-size': '100% 100%'
            };
        }*/

        var res = artTemplete(data, type);
        $("#art-main").append(res);

        var ptop=$(".pro_deta_tab").offset().top;
         $('.article').scroll(function() {

          //$('.article').scrollTop() >=
            if ($('.article').scrollTop()>=ptop) {
                $(".pro_deta_tab").eq(0).css({
                    "position": "fixed",
                    "top": 0,
                    "left":"100px",
                    "width":"735px",
                    "border-right":"1px solid #eeeeee",
                    "margin-top":0
                })
            }
            else {
                $(".pro_deta_tab").css({
                    "position": "static",
                    "margin-top":0,
                    "border-right":"none",
                    "width":"685px"


                });
                $(".main").css("margin-top", 0);
            }
        });
         $(".pro_deta_tab a").click(function(){
            $(this).addClass("active").siblings().removeClass("active");
         })

        zoomfun();
        qrcodefun();
        buynumfun();


        //like count
        var likeState = false;
        $(".collect-btn-click").click(function(){
            // console.log(likeState);
            if (isLogin) {
                if (!likeState) {
                    // var weid = $("#read-title").attr("class");
                    var weid = $(".buy_btn").attr("id");
                    like(weid); //收藏，取消收藏
                }
            } else {
                router('login');
            }
        })
    }

    //收藏
    var like = function(weid){
        $.ajax({
            url:GOODS_COLLECT+'/'+weid,
            type: 'get',
            dataType:'json',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                // console.log(data);
                if (data.code == 200){

                    $(".collect-btn-click").css({
                        "background":'#d4d4d4',
                        "cursor":'default'
                    });
                    $(".collect-btn-click").unbind("click");
                    data.data.map(x => {
                        $("#collectnum").text(x.collections);

                    })
                    likeState = true;
                } else {
                    mess_tusi("您已收藏过了");
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var setHeight = function(ch){
        $(".left-nav").css("height", ch);
    }

    var view = function(id){
        $.ajax({
            url: ARTICLES_VIEW,
            type: 'post',
            data: {"articleId": id},
            success: function(data){
                // console.log(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }


    // 获取商品详情
    var init = function(id){
        if (domain == '') {
            var url = '';
        } else {
            var url = domain
        }
        $.ajax({
            url: GOODS_DETAIL+'/' + id,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var goods = data.data;
                    $('title').text(goods.title);

                    loadGoods('', goods.weid, goods.cate_id, goods);
                    // 判断商品是否收藏
                    iscollect(id);
                    // 获取商品图片

                    if(goods.picture!="" && goods.picture!=null){
                        goods.picture.split(',').map(x => {
                            $(".spec-scroll .items ul").append('<li><img alt="" bimg="'+qiniu_bucket_domain+x+'" src="'+qiniu_bucket_domain+x+'" onmousemove="preview(this);" ></li>')
                        })

                    }

                    focusimgfun();

                    getprovince(goods.range_id);

                    goodsmess(id);
                    // console.log(url+"/wemall/order/" + id);
                    // 立即购买
                    $(".buy_btn").bind("click",function(){
                        // console.log(isLogin);

                        if (isLogin) {
                            localStorage.setItem("num",$("input[name='num']").val());
                            // window.location.href = "/shoporder/" + id;
                           window.location.href =url+"/wemall/order/" + id;
                        } else {
                            router('login');
                        }

                    })
                }
            }
        })
    }
    var iscollect=function(id){
        $.ajax({
            url: GOODS_COLLECTION_ISCOLLECTION+'/' + id,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                // console.log(data);
                if(data.code!=401){
                    if(data.code!=200 ){
                    $(".collect-btn-click").css({
                        "background":'#d4d4d4',
                        "cursor":'default'
                    });
                    $(".collect-btn-click").unbind("click");
                }
                }

            }
        })
    }

    // 获取省市
    var getprovince=function(weid){
        $.ajax({
            // url:apiUrl+'/province/list',
            url:GOODS_RANGE_PROVICELISTS+'/'+weid,
            type:'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var provincedata = data.data;
                    provincedata.map(x => {
                            $("#province").append("<option value='"+x.id+"'>"+x.name+"</option>");


                    })
                    $("#province").bind("change",function(){
                            $("#city").children().remove();
                            $("#city").append("<option value=''>请选择城市</option>");
                            getcity($(this).val(),weid);
                        })

                }else{
                    console.log('PROVINCE LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    var getcity=function(pid,weid){
        $.ajax({
            // url:apiUrl+'/area/list/'+pid,
            url:GOODS_RANGE_DREALISTS,
            type:'post',
            data:{weid:weid,province_id:pid},
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                // console.log(data);
                if (data.code == 200) {
                    var citydata = data.data;

                    citydata.map(x => {
                        $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");


                    })

                }else{
                    console.log('CITYS  LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }



    //back to top
    $("#toTop").hide();
    $(".read").scroll(function(){
        if ($(".read").scrollTop() > $(window).height() / 2) {
            $("#toTop").fadeIn(500);
            $("#toTop").hover(function(){
                $(this).css("background-color", "#eeeeee");
            }, function(){
                $(this).css("background-color", "white");
            });
        } else {
            $("#toTop").fadeOut(500);
        }
    })

    $("#toTop").click(function(){
        $('.read').animate({scrollTop:0}, 300);
    })


  //获取通用用户信息
    var host =ApiMaterPlatQiniuDomain;
    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            /*headers: {
                'Token': localStorage.getItem('token')
            },*/
            success: function(data){
                // console.log(data);
                if (data.code == 200){
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
                            info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                        );
                    } else {
                        if (info.real_name != null) {
                            $(".line-0").html(
                                info.real_name + '<img src="/common/img/vrenzheng.png" alt="">'
                            );
                        } else {
                            $(".line-0").html(
                                localStorage.getItem('title') + '官方微主页' + '<img src="/common/img/vrenzheng.png" alt="">'
                            );
                        }
                    }
                    if(info.motto!=null && info.motto!=""){
                        $(".oline-2").find("span").eq(1).text(info.motto);

                    }else{
                         $(".oline-2").find("span").eq(1).text("暂无介绍");
                    }
                    $(".user-cnt").text(info.real_name);
                    artCount(weid);
                    //artTypeList(weid);
                    // catesfun(weid);
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
                    // console.log(data);
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
            url:BRAND_DETAIL_USER+'/' + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    // console.log(data);
                    if (data.data == null) {

                    } else {
                        $(".line-0").html(
                            data.data.title + '<img src="/user/img/vrenzheng.png" alt="">'
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
                    // console.log(data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        // console.log('userId:', userId);
                        // console.log('userDetail')
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

    if (domain == 'wemall') {
        domain = '';
    } else {
        domain = "/" + domain;
    }

    if (domain != '') {
        __init(domain);
    }

    var artCount = function(weid){
        $.ajax({
            url: ARTICLES_LISTCOUNT+"?userId=" + weid,
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

    // 放大镜插件
    var zoomfun=function(){
        $(".jqzoom").jqueryzoom({
        xzoom: 300, //放大图的宽度(默认是 200)
        yzoom: 300, //放大图的高度(默认是 200)
        offset: 10, //离原图的距离(默认是 10)
        position: "right", //放大图的定位(默认是 "right")
        preload: 1,
        magnify: 0.5
        });
    }
    // 二维码插件
    var qrcodefun=function(){
        var qrcode_val=$("#product_qrcode").attr("rel");
        // if ($.browser.msie && $.browser.version <= 8){
        if ($.support.msie && $.support.version <= 8){

            $("#product_qrcode").qrcode({
                render  : "table",
                width   : 120,
                height  : 120,
                text    : qrcode_val
            });
        }else{
            jQuery("#product_qrcode").qrcode({
                width   : 120,
                height  : 120,
                text    : qrcode_val
            });
        }

        $(".qr_code_icon").on("mouseenter",function(event){
                $(".boxcode").addClass('big');
        }).on("mouseleave", function(event){
            $(".boxcode").removeClass('big');
        });
    }
    // 购买数量
    var buynumfun=function(){
        // 购买数量
        $(".mui-amount-increase").click(function(){
            var num = $('.mui-amount-input').val();
            if(num > 1){
                num--;
                $('.mui-amount-input').val(num);
            }
        });
        $(".mui-amount-decrease").click(function(){
            var num = $('.mui-amount-input').val();
            var kc = parseInt($('.num_kc').text()) ;
            if(num < kc ){
                    num++;
            $('.mui-amount-input').val(num);
            }
        });
        $('.mui-amount-input').blur(function(){
            var num_input = $(".tb-text").val();
            var kc = parseInt($('.num_kc').text()) ;
            if(num_input < kc){
                $('.mui-amount-input').val(num_input);
            }else{
                $('.mui-amount-input').val(kc);
            }
        });
    }

    // 创建focusimg.js元素
    var focusimgfun=function(){
        var scriptEle=$("<script></script>");
        scriptEle.attr("src","/common/js/focusimg.js");
        $("head").append(scriptEle);
        // switch_city("province","city");

    }
    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);

	 if(localStorage.getItem('title')=="" || localStorage.getItem('title')==null ||localStorage.getItem('title')==undefined || localStorage.getItem('title')=="null"){
         $.ajax({
            url: apiUrl+"cms/advs",
            type: 'get',
            success: function(data){
                if (data.code == 200){
                   localStorage.setItem('title',data.data.setting.title);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
})
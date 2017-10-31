/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
/* $(window).unload(function(){
      alert("Goodbye!");
    });*/
    // $(window).bind('beforeunload',function(){return '您输入的内容尚未保存，确定离开此页面吗？';});
  /*  //获取当前网址，如： http://localhost:8083/proj/meun.jsp
    var curWwwPath = window.document.location.href;
    var opendidcururl=window.document.location.href.split("?")[0];
    var opendidurl=window.document.location.href.split("?").pop().split("=");*/

    // console.log(curWwwPath);


   /* var options0 = $.get(CMS_ADVS);
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
    });*/


$(function(){
    if(localStorage.getItem("wobj")!=null){
        var wxobj=$.parseJSON(localStorage.getItem("wobj"));
        wxobj.ref_type=3;
        localStorage.setItem("wobj",JSON.stringify(wxobj));
    }
   
     var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);
    $(".linkto").attr('href', '/' + domain)
    $(document).ready(function(){
    var qiniu_bucket_domain =ApiMaterPlatQiniuDomain;

    // token 加载值请求头（Headers）
    // var token = window.sessionStorage.token, isLogin = false;
    // if(token) {
    //     $.ajaxSetup({
    //         global: true,
    //         headers: {
    //             'Token': token,
    //         }
    //     });
    // }

    var isLogin; //判断用户登陆与否   
    if(!sessionStorage.token) {
        isLogin = false;      
    } else {
        isLogin = true;
    }

    var router = function(route){
        if (!isLogin) {
            showLogin = true;          
            $("#modal_login").fadeIn(300);
        } else {
            window.location.href = "/";
        }
    }
    var weid = localStorage.getItem('weid');

    var id = window.location.href.split('/').pop().split("?")[0];   
    var url = window.location.href.split('/');
    var domain = url.slice(3, 4)[0];
    console.log(url);
    console.log(domain);
    // console.log(userToken);
    var checkdomain=function(domain,id){
        if(domain!="wemall"){
           
            $.ajax({
                url:GOODS_DOMAINGOODSISTRUE,
                type: 'post',
                data:{domain:domain,goodsid:id},
                dataType:'json',
                headers: {
                    'Token': sessionStorage.token
                },
                success: function(data){
                    console.log(data);
                    if (data.code == 200){
                    init(id);
                       
                    } else {
                    window.location='/404';
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }

            })
        }else if(domain=="wemall"){
            window.location="/404";
        }
        console.log(domain);
    }
    // alert(id);
    checkdomain(domain,id);


    var messtemplete=function(data){
        if(data.avatar==null || data.avatar==""){
            var imgsrc="/common/img/bbd.png";
        }else{
            var imgsrc=data.avatar;
        }
        if(data.nickname==null){
            var nickname="";
        }else{
            var nickname=data.nickname;
        }
        var messhtml=`
            <li>
            <div class="renwu">
                <img src="`+qiniu_bucket_domain+imgsrc+`" alt="">
            </div>
            <div class="nrong">
                <p style="">`+nickname+` <!-- <i style=";"><img src="/common/img/dianzan.png" alt="" style=""> <span>39</span></i> --></p>
                <h5 style="">`+data.content+`</h5>
                <h6 style="">`+data.created_at+`</h6>
            </div>
        </li>
        `;
     
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
                'Token': sessionStorage.token
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                     $(".sift ul").children().remove();
                    data.data.list.map(x => {
                        $(".sift ul").append(messtemplete(x));

                    })
                } else {
                    layer.msg("MESSAGE IS ERROR");
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

        
        buynumfun();
        
    }

    //收藏
    var like = function(weid){
        console.log(likeState);
        $.ajax({
            url:GOODS_COLLECT+'/'+weid,
            type: 'get',
            dataType:'json',
            headers: {
                'Token': sessionStorage.token
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    $(".collect-btn-click img").attr("src","/common/img/sq-sc-c.png");
                    
                    likeState = true;
                } else {
                    layer.msg("您已收藏过了",{time:1000});
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //取消收藏
    var canclelike = function(weid){
        console.log(weid);
        $.ajax({
            url:GOODS_COLLECTION_DESTORY+'/'+weid,
            type: 'get',
            dataType:'json',
            headers: {
                'Token': sessionStorage.token
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    $(".collect-btn-click img").attr("src","/common/img/sq-sc.png");
                    
                    likeState = false;
                } else {
                    layer.msg(data.message,{time:1000});
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var likeState = false;
    $(".collect-btn-click").click(function(){
        console.log(likeState);
        if (isLogin) {
        var weid = $(".buy_btn").attr("id");
            if (!likeState) {
                // var weid = $("#read-title").attr("class");
                
                like(weid); //收藏，取消收藏
            }else{
                //取消收藏
                canclelike($(".collect-btn-click").attr("id"));
            }
        } else {
            router('login');
        }
    })
    // 浏览数
     // 1.1浏览数
    var view=function(id){
        $.ajax({
            url: GOODS_VIEWSINCREMENT+"/"+id,
            type: 'get',
            headers: {
                'Token': sessionStorage.token
            },
            success: function(data){
                console.log(data);
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var swiperlist=function(data){
        console.log(data);
        var swiperhtml=`       
            <div class="swiper-slide">
                <img src="`+qiniu_bucket_domain+data+`" alt="" style="width: 100%">
            </div>
        `;
        return swiperhtml;
    }
    // 获取商品详情
    var init = function(id){
        if (domain == '') {
            var url = '';
        } else {
            var url = domain
        }
        // console.log('url:', url);
        $.ajax({
            url: GOODS_DETAIL+'/' + id,
            type:'get',
            headers: {
                    'Token': sessionStorage.token
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var goods = data.data;

                   // loadGoods('', goods.weid, goods.cate_id, goods);
                    // 判断商品是否收藏
                    iscollect(id);
                    // 获取商品图片
                    localStorage.setItem("ref_id",goods.plat_user_id);
                    
                    if(goods.picture!="" && goods.picture!=null){
                        goods.picture.split(',').map(x => {
                            // $("swiper-wrapper").append('<li><img alt="" bimg="'+qiniu_bucket_domain+x+'" src="'+qiniu_bucket_domain+x+'" onmousemove="preview(this);" ></li>')
                            $(".swiper-wrapper").append(swiperlist(x));
                        })

                    }
                     var swiper = new Swiper('.swiper-container', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        spaceBetween: 0,
                        centeredSlides: true,
                        autoplay: 2000,
                        autoplayDisableOnInteraction: false,
                        loop:true
                    });
                     //title
                    $(".content-shopping").html(goods.title);
                    //描述
                    $(".content-sum").html(goods.summary);
                    $(".content-price").html(goods.price);
                    $(".content-marprice").html(goods.marketprice);
                    $(".div-div").html(goods.content);
                    $(".div-div img").css({
                        "max-width":"100%",
                        "height":"auto"
                    })
                    $(".view").html(goods.views);
                    $(".collect").html(goods.collections)
                    $(".buy_btn").attr("id",goods.weid);

                    getprovince(goods.range_id);


                    goodsmess(id);
                    // console.log(url+"/wemall/order/" + id);
                    // 立即购买
                    $(".buy_btn").bind("click",function(){
                        if (isLogin) {
                            console.log($("input[name='num']").val());
                            localStorage.setItem("num",$("input[name='num']").val());                        
                            // window.location.href = "/shoporder/" + id;/m/wemall/order/c940b090-9e7c-11e7-9a92-8171f7b18ef5
                           window.location.href =domain+"/wemall/order/" + id;
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
                    'Token': sessionStorage.token
                },
            success:function(data){
                console.log(data);
                if(data.code!=401){
                    if(data.code!=200 ){
                        likeState=true;
                    $(".collect-btn-click img").attr("src",'/common/img/sq-sc-c.png');
                    // $(".collect-btn-click").unbind("click");
                    $(".collect-btn-click").attr("id",data.message);
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
                'Token': sessionStorage.token
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
                'Token': sessionStorage.token
            },
            success: function(data){
                console.log(data);
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

    // init(id);
    view(id);
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
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    console.log(weid);
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
                    // artCount(weid);
                    //artTypeList(weid);
                    // catesfun(weid);
                    // countinfo(weid);
                    
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
                'Token': sessionStorage.token
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
            url:BRAND_DETAIL_USER+'/' + weid,
            type: 'GET',
            headers: {
                'Token': sessionStorage.token
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data);
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
                    window.location.href = "/*";
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


    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);
    // $('title').text('商城-' + localStorage.getItem('title') + '官方微主页');
    $('title').text('商城-全球秦商联合会官方微主页');
})
})
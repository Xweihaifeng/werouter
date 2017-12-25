/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/

 var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);
    $(".linkto").attr('href', '/' + domain)
    $(document).ready(function(){
    var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;

     if(localStorage.getItem("wobj")!=null){
        var wxobj=$.parseJSON(localStorage.getItem("wobj"));
        wxobj.ref_type=5;
        localStorage.setItem("wobj",JSON.stringify(wxobj));
    }
   // alert("进入页面");
   var token=sessionStorage.token;
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
   /* // token 加载值请求头（Headers）
    var token = docCookies.getItem("token"), isLogin = false;
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }*/

    //主页初始化
    var init = function(token){
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login a").css({
                'background': 'url(../common/img/p2240276035.jpg) no-repeat center',
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

    var weid = docCookies.getItem("weid");

    var activityid = window.location.href.split('/').pop();   
    var url = window.location.href.split('/');
    var domain = url.slice(3, 4)[0];
    console.log(url);
    console.log(domain);

    // console.log(userToken);
    /*var checkdomain=function(domain,id){
        // if(domain!="index" && domain!="activity"){
        if(domain!="activity"){
           
            $.ajax({
                url:GOODS_DOMAINGOODSISTRUE,
                type: 'post',
                data:{domain:domain,goodsid:id},
                dataType:'json',
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data){
                    console.log(data);
                    if (data.code == 200){
                    init(id);
                       
                    } else {
                    window.location='/index/wemall';
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }

            })
        }else if(domain=="activity"){
            window.location="/index/activity/detail/"+id;
        }
        console.log(domain);
    }
    checkdomain(domain,id);*/
    
    //1.判断是否报名
    var isapply=function(id,userid){
        var sendData={
            activity_id:id.split("?")[0],
            user_id:userid
        }
        console.log(sendData);
        console.log(sessionStorage.token);
        // alert(JSON.stringify(sendData));
        $.ajax({
            url:ACTIVITY_ENROLL_ISENROLL,
            type: 'post',
            data: sendData,
            headers: {
                'Token': sessionStorage.token
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                   layer.msg("已经报名啦！",{time:1000});
                                      
                } else if(data.code==-200){
                    window.location=domain+'/activity/apply/'+id;

                    // layer.msg(data.message);
                }else{
                    isLogin=false;
                    router("login");

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    // 1获取活动详情
var activitydetail=function(id,nickname,imgUrl,applyid=0){
        $.ajax({
            url: ACTIVITY_DETAIL+"/"+id,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                        
                        $(".wl-poster-title").text(data.data.title);                        
                        $(".wl-poster img").attr("src",qiniu_bucket_domain+data.data.cover);
                        $(".activity_time").text(data.data.begain_time+" "+data.data.begain_week+" ~ "+data.data.end_time +" "+data.data.end_week);
                        $(".city").text(data.data.area_name+data.data.address);
                        data.data.Sponsor.split(",").map(x => {
                            $(".sponsor_p").append('<a href="javascript:void(0);" class="sponor">'+x+'</a>')
                        })
                        $(".word-blue").text(data.data.enroll_num);
                        if(data.data.enroll_limit>0){
                            $(".enroll_limit").text(data.data.enroll_limit);

                        }else{
                             $(".enroll_limit").text("多");
                        }
                        $(".js-detail").html(data.data.content);
                        if(data.data.onStatus=="已结束"){
                             $(".J_BtnSureBuyTicket").text("截止报名");
                            $(".qrcode img").attr("src",QRCODE+'?url=已截止');
                        }else{
                            if(data.data.enroll_num<data.data.enroll_limit || data.data.enroll_limit==0){
                                $(".J_BtnSureBuyTicket").on("click",function(){
                                    if(isLogin){
                                        isapply(activityid,weid);

                                        // window.location='/m/activity/apply/'+id;

                                  }else{
                                        router("login");
                                  }
                                });
                                // 生成报名二维码
                                $(".qrcode img").attr("src",QRCODE+'?url='+localStorage.getItem("localhostPath")+'/m/activity/apply/'+id+'&margin=5&size=200');
                                console.log(localStorage.getItem("localhostPath"));
                                // creatcode(localStorage.getItem("localhostPath")+'/activity/apply/'+id);
                            }
                        }
                        

                              
                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

   
var startactivitydetail=function(id,nickname,imgUrl){  
        id=id.split("?")[0];       
    if(id!=null && id!='' && id.length==36){ activitydetail(id,nickname,imgUrl);guestlistdetail(id);applylistdetail(id);}
    /*$(".support").bind("click",function(){
        Support(id,nickname,imgUrl,$(this).data('id'));
    })*/
}
    

    // 2.1嘉宾模板
    var guestlist=function(data){
       
        var guesthtml=`<li class="wl-user">
                      <figure><img src="`+qiniu_bucket_domain+data.avatar+`" onerror="javascript:this.src='/common/img/avatar.png';" class="wl-user-avatar"></figure>
                      <div class="wl-user-name">`+data.name+`</div>
                      <div class="wl-user-company">
                        <span>`+data.position+`</span><span>`+data.company+`</span>
                      </div>
                    </li>`;
        return guesthtml;
    }
    // 2.活动嘉宾   //查找嘉宾列表根据活动id
    var guestlistdetail=function(id){
        //ACTIVITY_GUEST_LISTS
        var limit="";
        var page="";
        var sendData={
            activity_id:id,
            limit:limit,
            page:page
        }
        $.ajax({
            url: ACTIVITY_GUEST_LISTS,
            type: 'post',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    if(data.data.total>0){
                        $(".guest ul").children().remove();
                        data.data.list.map(x => {
                            $(".guest ul").append(guestlist(x));

                        })
                    }
                                      
                } else {
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    /*$(".collect-btn-click").bind("click",function(){
        like(activityid);
    })*/
    //3.1活动成员模板
    var applylist=function(data){
        var applyhtml='<div class="z">'+
                        '<p class="">'+
                            '<img class="" src="'+qiniu_bucket_domain+data.avatar+'">'+
                        '</p>'+
                        '<p class="">'+
                            '<span class="" style="width: 57px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: block;">'+data.name+'</span>'+
                        '</p>'+
                    '</div>';
        var applyhtml=`<li><img src="`+qiniu_bucket_domain+data.avatar+`" onerror="javascript:this.src='/common/img/avatar.png';" width="25" height="25"></li>`;
        return applyhtml;
    }
   //3.活动成员
   var applylistdetail=function(id){
        var limit="";
        var page="";
        var sendData={
            activity_id:id,
            limit:limit,
            page:page
        }
        $.ajax({
            url: ACTIVITY_ENROLL_LISTS,
            type: 'post',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    if(data.data.total>0){
                        $(".record-list ul").children().remove();
                        data.data.list.map(x => {
                            $(".record-list ul").append(applylist(x));

                        })
                    }
                                      
                } else {
                    mess_tusi(data.message);
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
    var host = ApiMaterPlatQiniuDomain;
    var getUserInfo = function(url, id){
        $.ajax({
            url: url + id,
            type: 'get',
            /*headers: {
                'Token': docCookies.getItem("token")
            },*/
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    console.log(weid)
                    var imgUrl = info.avatar;
                    if (imgUrl.indexOf('http') === -1){
                        imgUrl = host + imgUrl;
                    }
                    if (info.avatar != "") {
                        // $("#head-icon, .user-head").css({
                        //     "background": "url(" + imgUrl + ") no-repeat center",
                        //     "background-size": "100%"
                        // });
                        $(".top_avatar>img").attr("src",imgUrl);


                    } else {
                        // $("#head-icon, .user-head").css({
                        //     "background": "url(/common/img/avatar.png) no-repeat center",
                        //     "background-size": "110%"
                        // });
                        $(".top_avatar>img").attr("src","/common/img/avatar.png");

                    }
                    if(info.nickname==null){
                        var nickname=info.real_name;
                    }else{
                        var nickname=info.nickname;
                    }
                    $(".line-0,.linkto").html(
                        nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".oline-2").find("span").eq(1).text(info.motto);
                    $(".user-cnt").text(info.real_name);
                    artCount(weid);
                    //artTypeList(weid);
                    // catesfun(weid);
                     startactivitydetail(activityid,nickname,imgUrl);
                    
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
                'Token': docCookies.getItem("token")
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
                'Token': docCookies.getItem("token")
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


})
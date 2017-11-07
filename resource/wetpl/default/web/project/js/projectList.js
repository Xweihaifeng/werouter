$(document).ready(function(){
var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
    var currHeight = $("#art-head").height() + $("#art-body").height();
    setHeight(currHeight);

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    //路由处理逻辑
    if(window.location.pathname=="/project"){
        window.location="/index/project";
    }
    var weid = localStorage.getItem('weid');

    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);
    console.log(window.location.pathname);


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
    options0.fail(function(error) {
        console.error(error);
    });



    var listtemplate = function(data,nickname,avatar){
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
                 <div class="col-sm-4 " style="padding-left: 0">
                    <div class="project-lists-one">
                        <div class="project-section">
                            <div class="shijian"> `+timetext+`</div>
                            <!--<div class="yishou"><img src=" http://next.wezchina.com/images/defeat.png&#10 " alt=""></div>-->
                            <div class="yishou"><span class="span_left"></span><span class="span_status">`+data.onStatus+`</span><span class="span_right"></span></div>
                            <div class="zhonglei"><span> `+data.cate_name+` </span></div>
                            <a href="/`+data.domain+`/project/`+data.weid+`">
                                <img src=`+qiniu_bucket_domain+data.cover+` class="p100 person-left-img">
                            </a>
                            <!-- <div class="time project-time">2017/05/16</div> -->
                            <img class="logo" src=`+qiniu_bucket_domain+avatar+` alt="">
                            <div class="project-username">`+nickname+`</div>
                        </div>
                        <div class="content">
                            <div class="title ">
                                <a class="font-weight" href="/`+data.domain+`/project/`+data.weid+`">`+data.title+`</a>
                            </div>

                            <!--<div class="project-discuss">
                                <span class="article-cate">热门</span>
                            </div>-->
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
                    </div>
   `

        return templete;
    }


    // 1.获取项目列表
    var projectlist=function(weid,nickname,avatar,cateid="",page=1){
        var limit=9;
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
                //console.log("hehhe");
                console.log(data);
                if(data.code == 200){
                  if(cateid!=""){
                    if(page<=1){
                        $(".person-article-lists").children().remove();

                    }

                  }
                    if(data.data.total>0){
                        if(page<=1){
                            $(".person-article-lists").children().remove();

                        }else{
                            $(".more").remove();
                        }
                        data.data.list.map(x =>{
                            $(".person-article-lists ").append(listtemplate(x,nickname,avatar));

                        })
                         var pagenum=Math.ceil(data.data.total/limit);//总页码
                        if(page<pagenum){
                            $(".person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>查看更多</div>");

                        }else{
                          $(".person-article-lists").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">——————————&nbsp;这是我的底线啦&nbsp;—————————</div></div>')

                        }
                        page++;

                        $(".more").click(function(){
                            projectlist(weid,nickname,avatar,cateid,page);
                        })
                    }else{
                        $(".person-article-lists").append('<div align="center" id="crowd_uloadingsImg" style="display: block; height: 40px; margin-top: 40px; color: rgb(146, 146, 146);" class="col-sm-12 more"><div style="color: #858585;">这家伙很懒，什么也没留下...</div></div>')

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
                console.log(data);
                if(data.code == 200){
                    $(".little-title").children().remove();
                    data.data.list.map(x => {
                      $(".little-title").append(catetemplate(x));
                    });
                    $(".little-title a").click(function(){
                      projectlist(userid,nickname,avatar,$(this).data("id"));
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
                // console.log(data);
                if (data.code == 200){
                    var info = data.data;
                    var weid = info.weid;
                    // console.log(weid);

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
                    var user_name="";

					if (info.nickname != null) {
                        $(".line-0").html(
                            info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                        );    
                        user_name=info.nickname;                    
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
                        user_name=info.real_name;                    

                    }
                    if(info.motto!=null && info.motto!=""){
                        $(".oline-2").find("span").eq(1).text(info.motto);

                    }else{
                         $(".oline-2").find("span").eq(1).text("暂无介绍");
                    }
                    $(".user-cnt").text(info.real_name);
                    artCount(weid);
                    countinfo(weid);
                    //artTypeList(weid);
                    projectcate(weid,user_name,data.data.avatar);
                    projectlist(weid,user_name,data.data.avatar);

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
            url: BRAND_DETAIL_USER+'/' + weid,
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


    if (domain != '') {
        __init(domain);
    }

    var artCount = function(weid){
        $.ajax({
            // url: apiUrl+"/articles/listCount?userId=" + weid,
            url: ARTICLES_LISTCOUNT+"?userId=" + weid,
            type: 'get',
            success: function(data){
                // console.log(data);
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



    // 鼠标滑动到列表时加hover
    var lihover=function(){
         $(".ws_item li").mouseenter(function(){
            $(this).addClass("hover")
        }).mouseleave(function(){
            $(this).removeClass("hover")
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
                    $('title').text('项目-' + data.data.setting.title + '官方微主页');
                   localStorage.setItem('title',data.data.setting.title);
                   
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }else{
        $('title').text('项目-' + localStorage.getItem('title') + '官方微主页');

    }
})
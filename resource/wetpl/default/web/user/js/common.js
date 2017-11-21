/**
 * Created by Yaoer on 2017/8/6.
 */

/*var domain;
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
                    //没有个性域名
                    domain = '/index';
                } else {
                    //存在个性域名
                    domain = "/" + data.data.domain;
                }

            } 
            // else {
            //     layer.msg(data.message, {
            //         time: 1500
            //     });
            // }
        },
        error: function(xhr){
            console.log(xhr);
        }
    })
}*/

//判断为空
function isNull(data) {
    return (data == "" || data == undefined || data == null|| data == 'null') ? true: false;
}

/*var weid = localStorage.getItem('weid');
hasDomain(weid);*/

    //route
    var isLogin; //判断用户登陆与否
    /*var router = function(route){
        if(!window.localStorage.getItem("token")) {
            isLogin = false;
        } else {
            isLogin = true;
        }
        // var routerList = ['home', 'login', 'article', 'active', 'project', 'shopping', 'zone', 'zan'];
        var routerList = ['home', 'login', 'article', 'active', 'zan'];

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
    }*/

    // $("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function(){
   /* $("#home, #login, #article, #active, #zan").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/

/*var login = function(){
    window.location.href = "/login";
}

 var domain;
 var hasDomain = function(weid){
      $.ajax({
       url: PAGES_PAGE_GETDETAILBYUSER + weid,
       type: 'GET',
       headers: {
         'Token': localStorage.getItem('token')
       },
       success: function(data){
          if (data.code == 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
          }
         if (data.data != null && data.code == 200){            
           console.log(data);
           if (data.data.domain == null) {
             //没有个性域名
             domain = '/index';
           } else {
             //存在个性域名
             domain = "/" + data.data.domain;
           }
         } else {
           /!*layer.msg(data.message, {
             time: 1500
           });*!/
         }
       },
       error: function(xhr){
         console.log(xhr);
       }
     })
 }

var weid = localStorage.getItem('weid');
hasDomain(weid);*/



/*var isLogin = false;
var init = function(token){
    if (token != 'null' && token != undefined) {
        isLogin = true;
        $(".left-nav, .login, #middle, #right").show();

        $("#login div").css({
            'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
            'background-size': '100% 100%'
        })

        $("#avatar .avatar-icon").css({
            'background': 'url(/common/img/p2240276035.jpg) no-repeat center',
            'background-size': '100% 100%'
        })
    } else {
        login();
    }
}*/

    //主页初始化
    /*var isLogin = false;
    var init = function(token){
        if (token != 'null' && token != undefined) {        
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(' + ApiMaterPlatQiniuDomain + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $("#avatar .avatar-icon").css({
                'background': 'url(' + ApiMaterPlatQiniuDomain + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();
        }
    }*/

//init(localStorage.getItem('token'));
$(document).ready(function(){
    

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    var weid = docCookies.getItem("weid");

    //路由处理逻辑
    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    // console.log('domain', domain);



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
                if (data.data != null){
                    var info = data.data;                    
                    var weid = info.weid;
                    // console.log(weid)
                    var imgUrl = info.avatar;
                    if ((imgUrl != null && imgUrl != "") && imgUrl.indexOf('http') === -1){
                        imgUrl = host + imgUrl;
                       
                        $(".header-img img").attr("src",imgUrl);
                    } else {
                        if (imgUrl != null && imgUrl != "") {
                            
                            $(".header-img img").attr("src",imgUrl);

                        } else {
                          
                            $(".header-img img").attr("src","/common/img/avatar.png");

                        }
                    }

                    if (info.nickname != null) {
                         
                        $(".header .media-heading").html(info.nickname);                     
                    } else {
                        if (info.real_name != null) {
                            
                        $(".header .media-heading").html(info.real_name);                     

                        } else {
                           
                            $(".header .media-heading").html("微众中国");                     

                        }
                    }                    
                    if(info.phone!=null && info.phone!=""){
                        $(".header .intro").html(info.phone);
                        $(".header .intro").html( $(".header .intro").html().substring(0, 3) + "****" +  $(".header .intro").html().substring(7, 11));

                    }else{
                        $(".header .intro").html("暂无联系方式");

                    }
                
                } else {
                    
                   
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
                // console.log(data);
                if (data.code == 200){
                    //var domain = data.data.domain;
                    // console.log(data.data);
                    if (data.data != null) {
                        userId = data.data.plat_user_id;
                        // console.log('userId:', userId);
                        // console.log('userDetail')
                        getUserInfo(USERDETAIL, "/" + userId);
                        // hasDomain(weid);
                    } else {
                        domain = '';
                        getUserInfo(FOUNDER, '');
                        console.log('router error')
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


    //需要解决直接进入文章页的问题
    // var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    // $('#favicon').attr('href', favicon);
    // $('title').text('微名片-' + localStorage.getItem('title') + '官方微主页');


})
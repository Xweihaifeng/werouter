var url = window.location.pathname.split('/');
    var domain = url.slice(1, 2)[0];
    console.log(domain); 
       //获取当前网址，如： http://localhost:8083/proj/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： proj/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPath = curWwwPath.substring(0, pos);

     //个性域名用户weid
    var userId;
    var __init = function(domain) {
        $.ajax({
            url: PAGES_DETAIL_DOMAIN +"/"+ domain,
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
   if (domain != '') {
        __init(domain);
    }
    //获取通用用户信息
    var host = 'http://oty3r3tmi.bkt.clouddn.com/';
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
                    // console.log(weid)
                    var imgUrl = info.avatar;
                    var logoimg="/common/img/avatar.png";
                    if ((imgUrl != null && imgUrl != "") && imgUrl.indexOf('http') === -1){
                        imgUrl = host + imgUrl;
                       logoimg=imgUrl;
                    } else {
                        if (imgUrl != null && imgUrl != "") {
                            logoimg=imgUrl;
                            
                        } else {
                            logoimg="/common/img/avatar.png";
                           
                        }
                    }
                
                    
                    
                    qrcodefun(domain, logoimg, id);

                    
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

       // 二维码插件
    var qrcodefun=function(domain,logoimg,platuserid){
        $(".oline-3 div:first-child").children().remove();
        //var qrcode_val=localhostPath+"/"+domain+"/wecard";
        console.log(localhostPath)
        var qrcode_val=localhostPath + "/wecard" + platuserid;
        $(".oline-3 div:first-child").attr("ref",qrcode_val);
        // if ($.browser.msie && $.browser.version <= 8){
        if ($.support.msie && $.support.version <= 8){

            $(".oline-3 div:first-child").qrcode({
                render  : "table",
                width   : 160,
                height  : 160,
                text    : qrcode_val,
                src: logoimg  
            });
        }else{
            jQuery(".oline-3 div:first-child").qrcode({
                width   : 160,
                height  : 160,
                text    : qrcode_val,
                src: logoimg  
            });
        }

    
    }  
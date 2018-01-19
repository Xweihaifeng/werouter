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
    var weid = docCookies.getItem("weid");

    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    //console.log('domain', domain);
    //console.log(window.location.pathname);

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

    init(docCookies.getItem("token"));

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

       var templete='<div class="col-sm-4 p-r-0" style="margin-top: 15px;margin-bottom: 5px">'+
                    '<div class="project-lists-one">'+
                        '<div class="project-section">'+
                            '<div class="biaoti">热门活动</div>'+
                            '<div class="shijian"> '+timetext+'</div>'+
                            '<a href="/'+domain+'/activity/'+data.weid+'" class="hover-img-box">'+
                                '<img src="'+qiniu_bucket_domain+data.cover+'" class="person-left-img">'+
                            '</a>'+
                            '<img class="logo" src="'+qiniu_bucket_domain+avatar+'" alt="">'+
                            '<div class="project-username">'+nickname+'</div>'+
                        '</div>'+

                        '<div class="content">'+
                            '<div class="title ">'+
                                '<a class="font-weight" href="/'+domain+'/activity/'+data.weid+'">'+data.title+'</a>'+
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
    var activitylist=function(weid,nickname,avatar,page=1,limit=9){

        var sendData={
            user_id:weid,
            limit:limit,
            page,page,
            status:2,
            is_private:1
        }
        console.log(sendData);
        $.ajax({
            url:ACTIVITY_LIST,
            type:'post',
            data:sendData,
            headers: {
                    'Token': docCookies.getItem("token")
                },
            success:function(data){
                console.log(data);
                console.log(data.data.total);
                if(data.code == 200){
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
                        $(".person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>—————————— 这是我的底线啦 —————————</div>");

                        }
                        page++;

                        $(".more").click(function(){
                            activitylist(weid,nickname,avatar,page);
                        })
                    }else{
                       $(".person-article-lists ").append("<div class='more text-center col-sm-12' style='margin-top:20px;'>这家伙很懒，什么也没留下...</div>");
                    }


                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    activitylist(pages_info.plats_domian.plat_user_id,pages_info.plats_user.real_name,pages_info.plats_user.avatar);

    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);

    $(".linkto").attr('href', '/' + domain)


    // 鼠标滑动到列表时加hover
    var lihover=function(){
         $(".ws_item li").mouseenter(function(){
            $(this).addClass("hover")
        }).mouseleave(function(){
            $(this).removeClass("hover")
        })
    }


})
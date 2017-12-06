function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
}

var url = window.location.pathname.split('/');
var projectid = url.pop();
//路由处理逻辑
    if(window.location.pathname=="/wemall"){
        window.location="/index/wemall";
    }
    var weid = localStorage.getItem('weid');
    localStorage.setItem("data_style","");
    localStorage.setItem("repayid","");
    var url = window.location.pathname.split('/');
    var active = url.pop();
    var domain = url.slice(1, 2)[0];
    console.log('domain', domain);
    console.log(window.location.pathname);
$(document).ready(function(){
    //判断是否在域名下
 var checkdomain=function(domain,id){
        // if(domain!="index" && domain!="wemall"){
        if( domain!="project"){

            $.ajax({
                url:PROJECT_DOMAINISTRUE,
                type: 'post',
                data:{domain:domain,project_id:id},
                dataType:'json',
                headers: {
                    'Token': localStorage.getItem('token')
                },
                success: function(data){
                    console.log(data);
                    if (data.code == 200){
                    // init(id);

                    } else {
                    window.location='/404';
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }

            })
        }else if(domain=="project"){
            window.location="/index/project/projectdetail/"+id;
        }
        console.log(domain);
    }
    checkdomain(domain,projectid);

    //route
    var isLogin; //判断用户登陆与否
    var router = function(route){
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
    }

    // $("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function(){
    $("#home, #login, #article, #active, #zan").click(function(){
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
})


var timer ;
        // 点击开关
        var _off = true;
        var wechat_login = {"debug":false,"app_id":"wx9f067ceaa70375b2","secret":"d87679629b24e48e64d2b01f6a1ec47b","url":"#","oauth":{"only_wechat_browser":false,"scopes":["snsapi_login"],"callback":"\/wechat\/opencallback"}};
        // 定时器开关
        var onOff = true;
        $(function(){
            var btn = $('#get_sms_code');
            var phone_input = $('#mobile');

            btn.bind('click',function(){

                if(!onOff){
                    return false;
                }

                var phone_num = phone_input.val();
                // console.log(phone_num);
                // 判断是否为手机号
                if($("#mobile").val()!=""&&/^1[34578]{1}\d{9}$/.test(phone_num)){
                    clearTimeout(timer);
                    countdown=60;
                    settime();
                    layer.msg("短信发送成功")
                }else{
                    layer.msg("请填写正确的手机号");
                }



                $.ajax({
                    url:"#" +  '/' + phone_num,
                    type:'get',
                    success:function(json){
                        if(json.status == 200)
                        {
//                            $.toast("发送成功");
                        } else {
//                            $.toast(json.msg);
                        }

                    }
                })

            });
            //给小图标注册点击事件
            $('#qrcode_login').on("click",function(){
                if(_off){
                    $("#loding").css("display","none");
                    $(".wx_login").css("display","block");
                    $('#qrcode_login').css("background-position","0 -32px");
                    _off = false;
                }else{
                    $("#loding").css("display","block");
                    $(".wx_login").css("display","none");
                    $('#qrcode_login').css("background-position","0 0");
                    _off = true;
                }
            })

            // 点击之后 60秒之后重新获取验证码
            function settime() {
                if (countdown == 0) {
                    $('#get_sms_code').css("opacity",'1').removeAttr("disabled")
                            .html("免费获取验证码").attr('href',"javascript:;");
                    onOff = true;
                }
                else {
                    onOff = false;
                    $('#get_sms_code').css("opacity",'0.5').html("重新发送(" + countdown + ")").attr("href","javascript:return false")
                    countdown--;
                }
                timer =  setTimeout(settime,1000)
            }
        });

        /*弹窗*/
        function loginLayer()
        {
            /*组件登录*/
            layer.open({
                type:1,
                area:['365px','336px'],
                title:['快速登陆','text-align: center;padding-left:65px;font-size: 20px;height: 50px;'],
                closeBtn:1,
                shadeClose:true,
                scrollbar: false,
                content:$('.pc-login-box-layer'),
                success:function () {
                    $('#pcLoginBox').show();
                    $('iframe').height('260px');
                },
                end:function () {
                    $('#pcLoginBox').hide();
                }
            });
        }

        /**
         * 登录
         */
        function login()
        {
            var formData = new FormData($('#loginForm')[0]),
                xhr = new XMLHttpRequest(),
                response,
                loginLayer;
                xhr.open('POST',"#");
                xhr.setRequestHeader('X-CSRF-TOKEN','j01L3XvNZSuqsqegFdAi9MVTgGdAUa4DCZzJJ81x');
                xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        response = JSON.parse(xhr.responseText);
                        if (response.status == 1) {
                            loginLayer = layer.msg(response.msg,function () {
                                location.reload();
                            });

                            layer.msg(response.msg, {
                                time : 1000, //2秒关闭（如果不配置，默认是3秒）
                                anim : 0,
                                closeBtn: 0
                            }, function(){
                                location.reload();
                            });


                        } else {
                            layer.msg(response.msg);
                        }
                    }
                }
        }
$('#dist_add').on("click",function(){
            var msg = $("#priMsg1").val();
            var type = $("#com").val();
            var email = $(".em").val();
            $.get('/ajax/plat/complain',{message:msg,type:type,email:email},function(data){
                if(data.status == 200){
                     $('#myModal1').modal('hide');

                    var msg = $("#priMsg").val('');
                    var msg = $("#email").val('');
                    alert('投诉成功');
                }else{
                    $('#myModal1').modal('hide');
                    var msg = $("#email").val('');
                    alert('投诉失败');
                }
            },'json');
            })
              $('#userdist_add').on("click",function(){

            var msg = $("#priMsg").val();
            var type = $("input[name=type]").val();
            var email = $("input[name=email]").val();
            $.get('/ajax/plat/message',{message:msg,type:type,email:email},function(data){
                if(data.status == 200){
                     $('#myModal').modal('hide');

                    var msg = $("#priMsg").val('');
                    var msg = $("#email").val('');
                    alert('回复成功');
                }else{
                    $('#myModal').modal('hide');
                    var msg = $("#email").val('');
                    alert('发送私信失败');
                }
            },'json');
        });


//李生 start
$(function(){
    var project_detail=function(projectid){
        $.ajax({
            url: PROJECT_DETAIL+'/' + projectid,
            type: 'get',
            success: function(data){
                console.log(data);
                if(data.code==200){
                    $('title').text(data.data.title +'-'+ localStorage.getItem('title') + '官方微主页');
                    $("#projectMsg").html(data.data.content);
                    $(".title").html(data.data.title);
                    $(".project-rightinfo-right-box").find(".top").empty();
                    $(".project-rightinfo-right-box").find(".top").append(amounttemplate(data.data));
                    $(".project-show-right").find(".prject-right-user").empty();
                    $(".project-show-right").find(".prject-right-user").append(usertemplate(data.data));
                     $(".project-show-project-box-top").find(".project_p").empty();
                    if(data.data.images!=null && data.data.images!=""){
                     $(".project-show-project-box-top").find(".project_p").append(imagelisttemplate(data.data));
                     $(".fancybox").fancybox({
                        'width': '500px',
                         'height': 'auto',

                        'zoomSpeedIn': 300,
                        'zoomSpeedOut': 300,
                        'overlayShow': true
                    });

                    }
                    var nopaytemplate=`
                        <div class="right-box wusihuibao">
                            <p class="right-box-title-style">无私支持</p>
                            <div class="m0 row">
                                  <div class="col-sm-3"></div>
                                    <div class="col-sm-5 ">

                                    </div>
                                    <div class="col-sm-4 ">
                                       <div class="lijizhichi">立即支持</div>
                                    </div>
                            </div>
                        </div>
                    `;
                    var project_style=data.data.project_style;
                    // var project_style=2;
                    if(project_style!=1){
                        $(".prject-right-user").after(nopaytemplate);
                        $(".wusihuibao .lijizhichi").click(function(){
                            localStorage.setItem("data_style","ws");
                            window.location="/"+data.data.domain+"/project/support/"+data.data.weid;
                        })

                    }
                    //$(".project-rightinfo-right-box").find(".top").append(detailtemplate(detail_data));
                    //绑定关注点击事件
                    collectionClick();

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //关注事件
    var collectionClick=function(){
        //判断是否已经关注
        var weid = localStorage.getItem('weid');
        if(weid!=''){
            //已经登录
            var sendData={
                user_id:weid,
                project_id:projectid,
            }
            $.ajax({
                url: PROJECT_IS_COLLECTION,
                type: 'post',
                data:sendData,
                success: function(data){
                    if(data.code==200){
                        //已经关注
                        $(".collection").text("已关注");
                        $(".collection").attr("collection_id",data.data);
                        $(".collection").attr("flag",true);
                    }
                    if(data.code==-200){
                        //未关注
                        $(".collection").text("立即关注");
                        $(".collection").attr("flag",true);
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })
        }
        $(".collection").click(function(){
            if(weid==null||weid==''){
                layer.msg("还未登录！");
                return false;
            }
            var flag=$(this).attr("flag");
            var text=$(this).text();
            if(text=='已关注'){
                //取消关注
                destroyCollection($(this).attr("collection_id"));
            }
            if(text=='立即关注'){
                //添加关注
                addCollection(projectid);
            }
        });
    }

    //取消关注
    var destroyCollection=function(id){
        $.ajax({
            url: PROJECT_COLLECTION_DESTROY+'/'+id,
            type: 'get',
            success: function(data){
                if(data.code==200){
                    //已经关注
                    $(".collection").text("立即关注");
                    $(".collection").attr("collection_id",'');
                    layer.msg('取消关注成功！');
                }else{
                    layer.msg(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //添加关注
    var addCollection=function(projectid){
        var sendData={
            project_id:projectid,
        }
        $.ajax({
            url: PROJECT_COLLECTION_STORE,
            type: 'post',
            data:sendData,
            success: function(data){
                if(data.code==200){
                    //已经关注
                    $(".collection").text("已关注");
                    $(".collection").attr("collection_id",data.data);
                    layer.msg('关注成功！');
                }else{
                    layer.msg(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }


    var usertemplate=function(data){
        //日期处理
        var date=data.created_at.substring(0, 10);
        date = date.replace(/-/g,'/');
        var html='<p class="right-box-title-style">项目发起人</p>'+
            '<div class="m0 row">'+
                  '<div class="col-sm-3"><img class="img-circle" src="'+ApiMaterPlatQiniuDomain+data.avatar+'"></div>'+
                    '<div class="col-sm-5 ">'+
                        '<p style="font-size: 16px;margin-bottom: 5px;margin-top: 5px">'+data.nickname+'</p>'+
                        '<p class="time">'+date+'</p>'+
                    '</div>'+
                    '<div class="col-sm-4 ">'+
                       '<div class="collection" style="cursor:pointer;" >立即关注</div>'+
                    '</div>'+
            '</div>';
        return html;
    }




    var imagelisttemplate=function(data){
        var imagelist='';
        var imagesArr= new Array(); //定义一数组
        imagesArr=data.images.split(","); //字符分割
        for (i=0;i<imagesArr.length ;i++ )
        {
            imagelist+=`
                <a class="col-sm-3 fancybox" href=`+ApiMaterPlatQiniuDomain+imagesArr[i]+` data-fancybox-group="gallery">
                     <img src=`+ApiMaterPlatQiniuDomain+imagesArr[i]+` alt=" ">
                  </a>
            `





        }
        return imagelist;
    }
    var amounttemplate=function(data){

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
                //判断结束时间

            }else if((dn-d)==0){
                timetext= '今天';

            }else{
                // timetext= Math.abs(dn-d)+'天后';
                timetext= '未开始';

            }


        }
        var html='<div class="row m0">'+
                '<div class="col-sm-6">'+
                    '<div class="project-num">'+data.amount_string+'</div>'+
                    '<p class="project-mubiao">目标金额</p>'+
                '</div>'+
                '<div class="col-sm-6">'+
                    '<div class="project-num">'+data.raise_amount_string+'</div>'+
                    '<p class="project-mubiao">已筹金额</p>'+
                '</div>'+
                '<div class="col-sm-6">'+
                    '<div class="project-num">'+data.suport_num+'人</div>'+
                    '<p class="project-mubiao">支持人数</p>'+
                '</div>'+
                '<div class="col-sm-6">'+
                    '<div class="project-num">'+data.offtime+'</div>'+
                    '<p class="project-mubiao">剩余时间</p>'+
                '</div>'+
            '</div>';
        return html;
    }
    project_detail(projectid);
    var project_new_list=function(projectid){
        var sendData={
            project_id:projectid,
            limit:1000,
            page:1,
        }
        $.ajax({
            url: PROJECT_NEWS_LIST,
            type: 'post',
            data:sendData,
            success: function(data){
                console.log(data);
                if(data.code==200){
                    var datalist=data.data.list;
                    $(".project-show-panel-color").empty();
                    datalist.map(x =>{
                        $(".project-show-panel-color").append(new_listtemplate(x));

                    })
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    project_new_list(projectid);
    var repay_list=function(projectid){
        var sendData={
            project_id:projectid,
            limit:5,
            page:1,
        }
        $.ajax({
            url: PROJECT_REPAY_LIST,
            type: 'post',
            data:sendData,
            success: function(data){
                console.log(data);
                if(data.code==200){
                    var datalist=data.data.list;
                    $(".project-right-item-lists").find(".chan-ping-hui-bao-box").empty();
                    $(".project-right-item-lists").find(".chan-ping-hui-bao-box").append('<p style="padding-left: 0;padding-top: 0 ;margin-bottom: 20px" class="right-box-title-style">项目回报</p>');
                    datalist.map(x =>{
                        $(".project-right-item-lists").find(".chan-ping-hui-bao-box").append(repay_listtemplate(x));
                    })
                    $(".chanpinghuibao .lijizhichi").click(function(){
                        console.log($(this).closest("a").data("ref"));
                        localStorage.setItem("repayid",$(this).closest("a").data("id"));
                        window.location=$(this).closest("a").data("ref");
                    })
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    repay_list(projectid);
    var project_suport_list=function(projectid){
        var sendData={
            project_id:projectid,
            limit:1000,
            page:1,
        }
        $.ajax({
            url: PROJECT_SUPORT_LIST,
            type: 'post',
            data:sendData,
            success: function(data){
                console.log(data);
                if(data.code==200){
                    var datalist=data.data.list;
                    $(".project-show-panel-color-2").empty();
                    $(".project-show-panel-color-2").append('<div class="trends_title_h" id="project-supporter">Ta的支持者</div>');
                    if(data.data.total>0){
                        datalist.map(x =>{
                            $(".project-show-panel-color-2").append(project_suport_listtemplate(x));
                        })
                    }else{
                            $(".project-show-panel-color-2").append("<div>暂无支持者</div>");

                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    project_suport_list(projectid);
    var project_suport_listtemplate=function(data){
        var projectnote='';
        if(data.note==''||data.note==null){
            projectnote='支持'
        }else{
            projectnote=data.note
        }
        // var date=data.created_at.substring(0, 10);
        var aa=new Date(data.created_at);
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
        timetext1= (yn-y)+'年前';
    }else if((mn-m)>=1){
        timetext1= (mn-m)+'月前';

    }else{
        if((dn-d)>0){
            timetext1= (dn-d)+'天前';
        }else if((dn-d)==0){
            timetext1= '今天';

        }else{
            timetext1= Math.abs(dn-d)+'天后';

        }


    }

        // date = date.replace(/-/g,'/');
        var html='<div class="supporter">'+
                         '<div class="supporter_img ">'+

                             '<img class="img-circle" src="'+ApiMaterPlatQiniuDomain+data.avatar+'">'+
                         '</div>'+
                    '<div class="supporter_user">'+
                        '<span class="supporter_user_log">'+data.nickname+'</span>'+
                        '<span class="supporter_user_mid">支持了</span>'+
                        '<span class="supporter_user_sm">'+data.amount+'</span>'+
                        '<div class="supporter_user_color">'+timetext1+'</div>'+
                        '<div class="supporter_user_liuyan">'+
                        '<i></i>'+
                        '<span class="user-su">'+data.nickname+'</span>: '+projectnote+' </div>'+
                    '</div>'+
                '</div>';
        return html;
    }
    var new_listtemplate=function(data){
        // var date=data.created_at.substring(0, 10);

           var aa=new Date(data.created_at);
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

        }


    }
        var imagelist='';
        var imagesArr= new Array(); //定义一数组
        imagesArr=data.images.split(","); //字符分割
        for (i=0;i<imagesArr.length ;i++ )
        {
            imagelist+='<img class="" src="'+ApiMaterPlatQiniuDomain+imagesArr[i]+'">';
        }
        var html='<div class="trends_title_h" id="project-detail">项目动态</div>'+
                '<div class="trends">'+
                     '<div class="trends1">'+
                        '<div class="trends_img">'+
                            '<img class="img-circle" src="'+ApiMaterPlatQiniuDomain+data.avatar+'">'+
                        '</div>'+
                        '<div class="trends_title">'+
                            '<div class="trends_title_top">'+
                                '<span class="trends_title_text">'+data.nickname+' </span>'+
                                '<small class="trends_title_color">项目发起</small>'+
                                '<div class="trends_title_size">'+timetext+'</div>'+
                            '</div>'+
                            '<div class="trends_title_bottom">'+
                                '<span class="trends_title_text">目标金额:</span>'+
                                '<small class="trends_title_color">￥'+data.amount+'</small>'+
                            '</div>'+
                            '<div class="trends_title_bottom">'+
                                '<small class="trends_title_color">'+data.summary+'</small>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                        '<div class="project-img">'+imagelist+'</div>'+
                '</div>';
        return html;
    }
    var repay_listtemplate=function(data){
        // var html='<a href="/'+domain+'/project/support/'+data.project_id+'" data-id="'+data.weid+'" class="a-none">'+
        var html='<a data-ref="/'+domain+'/project/support/'+data.project_id+'" href="javascript:void(0)" data-id="'+data.weid+'" class="a-none">'+
            '<div class="chanpinghuibao row m0">'+
                '<div class="col-sm-6 p0">支持<span> '+data.amount+'</span> 元 </div>'+
                '<div class="xiamg-mu-hui-bao m0 row col-sm-12 p0">'+
                    '<div class="col-sm-2 p0"><img src="'+ApiMaterPlatQiniuDomain+data.images+'"></div>'+
                    '<div class="col-sm-10">'+data.title+'</div>'+
                    '<div class="lijizhichi">立即支持</div>'+
                '</div>'+
            '</div>'+
        '</a>';
        return html;

    }

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);
    // $('title').text('项目-' + localStorage.getItem('title') + '官方微主页');




      //获取当前网址，如： http://localhost:8083/proj/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： proj/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPath = curWwwPath.substring(0, pos);

    // 二维码插件
    var qrcodefun=function(){
        // var qrcode_val=$("#product_qrcode").attr("rel");
        var qrcode_val= localhostPath+'/user/wap/'+projectid;
        // if ($.browser.msie && $.browser.version <= 8){
        if ($.support.msie && $.support.version <= 8){

            $("#project_qr").qrcode({
                render  : "table",
                width   : 100,
                height  : 100,
                text    : qrcode_val
            });
        }else{
            $("#project_qr").qrcode({
                width   : 100,
                height  : 100,
                text    : qrcode_val
            });
        }

    }
    qrcodefun();

})
//李生 end
/*
 $.ajax({
            url: PROJECT_DETAIL +'/' + getUrlParam('projectid'),
            type: 'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success: function(data){
                if (data.code == 200) {
                    var detail_data = data.data;
                    $(".update-right").empty();
                    $(".update-right").append(detailtemplate(detail_data));
                    $(".avatar1").attr("src",localStorage.getItem('avatar'));
                    $(".content").find(".tc").html('<a href="/project/projectdetail?projectid='+detail_data.weid+'" target="_blank">'+detail_data.title+'</a>');
                    //设置头像

                    $.ajax({
                        url: USERDETAIL +'/' + localStorage.getItem('weid'),
                        type: 'get',
                        headers: {
                                'Token': localStorage.getItem('token')
                            },
                        success:function(data){
                            if(data.code == 200){
                                $(".update-tit").find("span").text("Hi, "+data.data.nickname+"！更新一下项目吧~");

                            }
                        }

                    })
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
*/
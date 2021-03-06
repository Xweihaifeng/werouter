 //列表折叠
sessionStorage.listname='we-art';
$(document).ready(function() {
    //const ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    console.log('logo:',favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:',logo);
    $('#home img').attr('src', logo);

    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle, #right").height(currHeight);

    $(window).resize(function () {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function () {
        $(".add").show();
    }, function () {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function () {
        $(".avatar").show();
    }, function () {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    var domain;
     var hasDomain = function(weid){
         $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
              'Token': docCookies.getItem("token")
            },
            success: function(data){
               /*if (data.code == 401) {
                 domain = '/index';
                 localStorage.removeItem('token')
                 window.location.href = '/login'
               }*/
              if (data.code == 200){
                console.log(data);
                if (data.data.domain == null) {
                  //没有个性域名
                  domain = '/index';
                } else {
                  //存在个性域名
                  domain = "/" + data.data.domain;
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

    var weid = docCookies.getItem("weid");
    hasDomain(weid);

   /* var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article', 'shopping'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal").show();
                $(".show-login").css({
                    "margin-left": width,
                    "margin-top": height
                });
                $(".show-login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user";
            }
        }

        var article = function(){

            showLogin = false;
            window.location.href = domain + "/article";
//          window.history.go(0);
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/

                    // <img src="../common/img/icon_see_normal.png" width="20" alt="" />&nbsp;&nbsp;查看
    var articleTemplate = function (data, url) {
        var template =
            `<div class="show-art" id=` + data.weid + `>
               <div class="show-title">
                   <div class="at">` + data.title.substring(0, 17) + `</div>
                   <div class="ad">` + data.created_at.substring(0, 10) + `</div>
               </div>
               <div class="show-pic"></div>
               <div class="show-cont">` + data.summary.substring(0, 60) + `...</div>
               <div class="show-bottom">
                   <div class="show-edit">
                       <img src="/common/img/icon_edit_normal.png" class="show-edit" style="width: 15px!important; height: 15px!important;" alt="" />
                   </div>
                   <div class="show-del">
                       <img src="/common/img/icon_delete_normal.png" class="show-del" style="width: 15px!important; height: 15px!important;" alt="" />
                   </div>
               </div>
               <a href="${url}" target="_blank"><div class="show-read" style="display: none;"><p>预览文章</p></div></a>
           </div>`

        return template;
    }

    var delArt = function(id){
        $.ajax({
            url: ARTICLES_DESTORY + '/' + id,
            type: 'get',
            success: function(data){
                if (data.code == 200) {
                    console.log('success');
                    window.location.reload();
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    var coverId = 0;
    var genArticles = function (arts) {
        arts.map(x => {
            if (x.cover != ""){
               var coverPicCss = {
                   'background': 'url(' + ApiMaterPlatQiniuDomain + x.cover + ') no-repeat center',
                   'background-size': '100%'
               }
           } else {
               var coverPicCss = {
                   'background': 'url(/common/img/vote_front_cover.png) no-repeat center',
                   'background-size': '100%'
               }
           }

        $("#right").append(articleTemplate(x, '/' + pages_index + '/article/' + x.weid));
        $("#" + x.weid + " .show-pic").css(coverPicCss);
        $("#" + x.weid).click(function (e) {
            var cid = $(e.target).attr('class');
            switch (cid) {
                /*case 'show-read':
                    window.location.href = domain + '/article/' + x.weid;
                    break;*/
                case 'show-edit':
                    window.location.href = '/user/admin/publish/' + x.weid;
                    break;
                case 'show-del':
                    layer.confirm('确定要删除吗？', {
                      title: false,
                      btn: ['确定','取消'] //按钮
                    }, function(){
                      layer.msg('已删除', {icon: 1});
                      delArt(x.weid);
                    }, function(){
                      
                    });
                    break;
            }
        })

        var lock = false;
        $("#" + x.weid).hover(function () {
            if (!lock) {
               $(this).find('.show-read').show();
               lock = true;
               /*$(this).find('.show-read').click(function(){
                  window.location.href = domain + '/article/' + x.weid;
               });*/
            }
        },function () {
               $(this).find('.show-read').hide();
               lock = false;
        });


        coverId++;
    })
    }

    //请求用户文章列表
    var articles = function (weid) {
        $.ajax({
            url: ARTICLES + '/list?userId=' + weid,
            type: 'get',
            success: function (data) {
                if (data.code == 200) {
                    var arts = data.data.list;
                    console.log(arts);
                    if (arts != '') {
                        genArticles(arts);    
                    } else {
                        $("#info").html('还没有文章，赶快去<span style="text-decoration: underline;"><a href="/user/admin/article/add">发布</a></span>吧！')
                        $("#info").show();
                    }
                    
                }
            },
            error: function (xhr) {
                console.log(xhr);
            }
        })
    }

    articles(docCookies.getItem("weid"));

 /*   var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200){
                    console.log('module:', data.data.list);
                    var state = data.data.list;
                    state.map(x => {
                        modeleName.push(x.module_id);
                        if (x.module_id === '4009ea20-8ede-11e7-83a8-156d1da77933') {
                            if (x.status == 1) {
                                //$(".we-art").slideDown(500)
                                $(".we-art").show();
                                $('#toggle-button').prop("checked", true);
                            }
                        }
                        if (x.module_id === '44fd5620-8d7f-11e7-9e08-e356d0b019f1') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-shop").show();
                                $('#toggle-button-4').prop("checked", true);
                            }
                        }
						if (x.module_id === 'b3c00b00-a4e2-11e7-b542-2d038cc12c12') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-active").show();
                                $('#toggle-button-2').prop("checked", true);

                            }
                        }
                        if (x.module_id === 'c30c2160-a4e2-11e7-a2ad-35371a8cf051') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-project").show();
                                $('#toggle-button-1').prop("checked", true);

                            }
                        }
						if (x.module_id === 'a9d16bc0-ada0-11e7-8c59-993d3b1d7e06') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-crm").show();
                                $('#toggle-button-3').prop("checked", true);

                            }
                        }
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-art';
                var status = true;
				var list = ['we-set', 'we-art', 'we-shop','we-active','we-project', 'we-app','we-crm', 'we-log'];

                var remove = function(id, list) {
                    return list.filter(x => x != id);
                }

                $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                remove(curr, list).map(x => $("." + x + ":eq(1)").hide());

                var showList = function(state, id) {
                    var id = "." + id;
                    if (state) {
                        $(id + ":eq(1)").hide(500);
                        if (id != ".we-log") {
                            $(id + ":eq(0)").css("border-bottom", "0");
                        }
                        $(id + " span img").attr('src', '/common/img/more1.png');
                        status = false;
                    } else {
                        $(id + ":eq(1)").show(500);
                        $(id + " span img").attr('src', '/common/img/more_unfold.png');
                        $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                        status = true;
                    }
                }

                list.map(x => {
                    $("." + x).click(function() {
                        if (curr == x) {
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '/common/img/more1.png');
                            });
                            showList(status, x);
                        } else {
                            status = false;
                            $("." + curr + ":eq(0)").css("border-bottom", "0");
                            curr = x;
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '/common/img/more1.png');
                            });
                            showList(status, x);
                        }
                    })
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }*/

/*    //主页初始化
    var init__ = function(token){
      // moduleState()
      if (token != 'null' && token != undefined) {
        showLogin = false;
        isLogin = true;
        //加载用户头像
        $("#login div img").hide();
        $(".log-head").css({
          'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
          'background-size': '100% 100%'
        })
        $("#avatar .avatar-icon").css({
          'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
          'background-size': '100% 100%'
        })
        $(".log-head").show();
      }
    }

    init__(docCookies.getItem("token"));*/

//
//     $('.upload').click(function () {
//         $('.form-horizontal').css("display", "block")
//     })
//
//     $('.top .y i').click(function () {
//         $('.form-horizontal').css("display", "none")
//     })
//
//     $('.phone input').change(function(){
//         setTimeout(function(){
//             var phone = $('.phone input').val();
//             //正则验证
//             var myreg =/^1[0-9]{10}$/;
//             if(!myreg.test(phone)){
//                 $('.phone span').css("display","block")
//             }else{
//                 $('.phone span').css("display","none")
//             }
//         },5000)
//     })
//
// // 获取用户资料
//     $('.update').click(function(){
//         var name = $('.name input').val();
//         var phone = $('.phone  input').val();
//         var inputs = $('.gender input');
//         for(var i= 0;i<inputs.length;i++){
//             if(inputs[i].checked == true){
//                // console.log(inputs[i].value);
//                var sex = inputs[i].value;
//                 console.log(sex);
//             }
//         }
//         var getpro = $('#province').value;
//         var getcity = $('#city').value;
//         console.log(getpro);
//         console.log(getcity);
//
//
//         var word = $('.information textarea').val();
//         console.log(word);
//
//         // $.ajax({
//         //     url:'http://ysl.co/users/info',
//         //     data:{},
//         // })
//     })
})
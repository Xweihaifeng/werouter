/**
 * Created by Hongguang on 2017/8/29.
 */
//列表折叠
sessionStorage.listname = 'we-set';
$(document).ready(function() {
    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle").height(currHeight);

    $(window).resize(function() {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle").height(currHeight);
    })

    $("#add").hover(function() {
        $(".add").show();
    }, function() {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function() {
        $(".avatar").show();
    }, function() {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function() {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    // const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    console.log('logo:', favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:', logo);
    $('#home img').attr('src', logo);

    var host = 'http://' + window.location.host;
    $("#host").text(host + "/");

    /*var modeleName = [];
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
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-set';
                var status = true;
                var list = ['we-set','we-art','we-shop','we-active','we-project','we-app','we-crm','we-log'];

                var remove = function(id, list) {
                    return list.filter(x => x != id);
                }

                $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                $("." + curr + " span img").css("transform", "rotate(90deg)");
                remove(curr, list).map(x => $("." + x + ":eq(1)").stop().hide());

                var showList = function(state, id) {
                    var id = "." + id;
                    if (state) {
                        $(id + ":eq(1)").stop().hide(300);
                        if (id != ".we-log") {
                            $(id + ":eq(0)").css("border-bottom", "0");
                        }
                        $(id + " span img").css("transform", "rotate(0deg)")
                        status = false;
                    } else {
                        $(id + ":eq(1)").stop().show(300);
                        $(id + " span img").css("transform", "rotate(90deg)")
                        $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                        status = true;
                    }
                }

                list.map(x => {
                    $("." + x).click(function() {
                        var isCont = $(this).attr('class').search('we-cont');
                        if (isCont == 0) {
                            return;
                        }
                        if (curr == x) {
                            showList(status, x);
                        } else {
                            status = false;
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").stop().hide(300)
                                $("." + x + " span img").css("transform", "rotate(0deg)")
                            });
                            if (curr != "we-log") {
                                $("." + curr + ":eq(0)").css("border-bottom", "0");
                            }
                            curr = x;
                            showList(status, x);
                        }
                    })
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    */
    var req;
    var id;
    var yuming;
    var Eurl = '';
    var init = function(weid) {
        // moduleState();
        $('.modify-count').text(wepageSetting.modifyLimit);
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log("数据",data)
                if (data.code == 200) {
                    id = data.data.weid;
                    var domains = data.data.domain;
                    $("#user-domain").val(domains)
                    yuming=domains;
                    console.log(data);
                    if (data == null) {
                        console.log('store')
                        $(".cont-update").css({display:"block"});
                        $(".cont-update>h3").html("请设置您的个性域名")
                        $("#user-domain").val("domain");
                        $(".cont-sel").css({display:"none"});
                        $(".ewm").css({display:"none"})
                        req = store;
                    } else {
                        console.log('update')
                        $(".cont-update").css({display:"none"});
                        $(".cont-sel").css({display:"block"});
                        $(".ewm").css({display:"block"});
                        Eurl="http://"+domain+'/'+domains;
                        $("#user-doma").val("http://"+domain+'/'+domains)
                        $(".domainA").attr("href","http://"+domain+'/'+domains)
                        req = update;
                    }

                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    var weid = docCookies.getItem("weid");
    //console.log(weid)
    init(weid);

    /*var domain;
     var hasDomain = function(weid){
          $.ajax({
           url: PAGES_PAGE_GETDETAILBYUSER + weid,
           type: 'GET',
           headers: {
             'Token': docCookies.getItem("token")
           },
           success: function(data){
              /!*if (data.code == 401) {
                domain = '/index';
                localStorage.removeItem('token')
                window.location.href = '/login'
              }*!/
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
    hasDomain(weid);*/

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

    // 编辑点击开始
    $(".cont-bj").click(function(){
        $(".cont-update").css({display:"block"});
        $(".cont-update>h3").html("请重新输入您的个性域名");
        $("#user-domain").val(yuming)
        $("#phone").val("");
        $(".ewm").css({display:"none"});
        $(".cont-sel").css({display:"none"});
    })
    // 编辑点击结束
    var store = function(sendData) {
        $.ajax({
            url: PAGESTORE,
            type: 'POST',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                if (data.code == 200) {
                    layer.msg('设置成功', {
                        time: 1500
                    });
                    window.location.reload();
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    var update = function(sendData) {
        $.ajax({
            url: PAGES_UPDATE,
            type: 'POST',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                if (data.code == 200) {
                    console.log(data)
                    layer.msg('设置成功', {
                        time: 1500
                    });
                    window.location.reload();
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    $(".save").click(function() {
        var domain = $("#user-domain").val();
        var code = $('input[name=verifycode]').val();
        var sendData = { weid: id, domain: domain, code: code };
        console.log("数据1",sendData)
        if (domain != "") {
            console.log("请求")
            req(sendData);
        } else {
            layer.msg('请输入个性域名', {
                time: 1500
            });
        }
    })

    var checkDomain = function(domain, callback) {
        layer.load(1);
        $.ajax({
            url: PAGES_PAGE_CHECK_DOMAIN,
            type: 'POST',
            data: { domain: domain },
            success: function(data) {
                layer.closeAll('loading');
                if (data.code == 200) {
                    callback(data.data);
                } else {
                    layer.msg(data.message);
                }
            },
            error: function(error) {
                layer.closeAll('loading');
                console.log(error);
            }
        })
    }

    // 复制链接开始
    function copyLink() {
        if (!$("#user-doma").val()) {
            return false;
        }
        var Url2 = document.getElementById("user-doma").select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        console.info("复制成功");
        layer.msg("复制成功", { time: 1500 });
    }
    $(".submit").click(function(){
        copyLink()
    })
    //复制链接结束

    // 取消点击开始
      $(".del").click(function(){
              $(".cont-update").css({display:"none"});
              $(".cont-sel").css({display:"block"});
              $(".ewm").css({display:"block"})
      })
    // 取消点击结束

    function codeTimer($codeTimer) {
        var obj = $(".send-code");
        if (parseInt(obj.find('span').text()) <= 0) {
            clearInterval($codeTimer);
            obj.removeAttr('disabled');
            obj.html('发送验证码');
        } else {
            obj.find('span').text(parseInt(obj.text()) - 1);
        }
    }
    var $codeTimer;
    $(".phone-btn").click(function() {
        $.ajax({
            url: CODES,
            type: 'POST',
            data: {
                phone: localStorage.getItem('phone')
            },
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                if (data.code == 200) {
                    layer.msg('发送成功！');
                    $(".send-code").html('<span>60</span>后重发');
                    $(".send-code").attr('disabled', true);
                    $codeTimer = setInterval(function() {
                        codeTimer($codeTimer);
                    }, 1000);
                } else {
                    layer.msg(data.message);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    });
    $(".jiance").click(function() {
        var domain = $("#user-domain").val();
        if (domain.length === 0) {
            layer.msg('请输入个性域名');
            return;
        }
        checkDomain(domain, function(data) {
            layer.msg('该个性别名可以使用');
            $(".save").css({display:"block"});
            $(".del").css({display:"block"});
        });
    });

    // const pages_info={"plats_domian":{"domain":"xiyue","weid":"09dc0ab0-f1f7-11e7-b9aa-19d6a702db87","plat_id":"88e41d20-72ad-11e7-8825-933924ec5999","plat_user_id":"295a6e90-f1eb-11e7-be1e-e309726074b6","is_brand":"2","summary":null,"background":null,"share_image":null,"qrcode_img":"qrcode\/1515143546\/1515138107972.jpg","background_user":null},"plats_user":{"weid":"295a6e90-f1eb-11e7-be1e-e309726074b6","avatar":"pages\/article\/1515138107972.jpg","sex":"2","real_name":"\u96f7\u5a9b","nickname":"\u5915\u6708","motto":"\u505a\u4e86\u81ea\u5df1\u8be5\u505a\u7684\u4e8b\uff0c\u624d\u80fd\u505a\u81ea\u5df1\u60f3\u505a\u7684\u4e8b\u3002","province_id":"27","area_id":"294","phone":"18710560497","company":"\u5fae\u4f17\u4e2d\u56fd","position":"\u524d\u7aef","province":{"name":"\u9655\u897f\u7701"},"area":{"name":"\u897f\u5b89\u5e02"}},"plats_brand":false,"plats_user_auth":{"is_authenticated":"1","origo":"\u9655\u897f\u7701\u6e2d\u5357\u5e02\u5408\u9633\u53bf","residential":"","name":"\u96f7\u5a9b","type":"1"},"plats_user_cert":{"is_authenticated":"1","name":"\u96f7\u5a9b","cert_info":"\u5fae\u4f17\u4e2d\u56fd","type":"1"},"plats_user_qrcode":"qrcode\/1515143546\/1515138107972.jpg","plats_show":{"head_title":"\u5915\u6708\u7684\u5fae\u4e3b\u9875  \u2014 \u4e92\u52a9\u5171\u4eab\u5e73\u53f0","head_logo":"pages\/article\/1515138107972.jpg","head_describe":"\u505a\u4e86\u81ea\u5df1\u8be5\u505a\u7684\u4e8b\uff0c\u624d\u80fd\u505a\u81ea\u5df1\u60f3\u505a\u7684\u4e8b\u3002","main_title":"\u5915\u6708\u7684\u5fae\u4e3b\u9875","main_logo":"","main_describe":"","main_auth":""}};

    // 二维码移入
    $(".ewm").mouseenter(function(){
        // $(this).children("img").stop(false, true).slideToggle("slow")
        $(this).children("img").attr("src",window.location.origin+"/api/file/qrcode?margin=2&url="+Eurl)
        $(this).children("img").stop(false, true).animate({height:90},"slow")
    })
    $(".ewm").mouseleave(function(){
        // $(this).children("img").stop(false, true).slideToggle("slow")
        $(this).children("img").stop(false, true).animate({height:0},"slow")
    })
    /*//主页初始化
    var init__ = function(token){
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
})
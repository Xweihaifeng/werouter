/**
 * Created by Hongguang on 2017/9/15.
 */

/**
 * Created by Hongguang on 2017/8/29.
 */

$(document).ready(function(){
    // const ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
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
    var isBrand;
    var btState;
    var pageId;
    var hasDomain = function(weid){
        $.ajax({
            url: 'http://apitest.wezchina.com/pages/page/getDetailByUser/' + weid,
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
                        isBrand = data.data.is_brand;
                        pageId = data.data.weid;
                        if (isBrand == 1) { //开启
                            btState = true;
                            $("#toggle-button").prop("checked", true);
                        } else {
                            btState = false;
                            $("#toggle-button").prop("checked", false);
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

    var weid = docCookies.getItem("weid");
    hasDomain(weid);

    var isLogin = false; //判断用户登陆与否
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
    })

    //开启独立品牌
    var openBrand = function(pageId, status) {
        //console.log(pageId + ":" + status)
        $.ajax({
            url: 'http://apitest.wezchina.com/pages/page/update',
            type: "POST",
            headers: {
                'Token': docCookies.getItem("token")
            },
            data: {
                weid: pageId,
                is_brand: status
            },
            success: function(data) {
                console.log(data)
            },
            error: function(err) {
                console.log(err)
            }
        })
    }

    var weid = docCookies.getItem("weid");
    $("#toggle-button").click(function(){
        if (!btState){
            $("#toggle-button").prop("checked", true);
            //$(".list").show();
            isBrand = 1;
            btState = true;
            openBrand(pageId, isBrand);
        } else {
            $("#toggle-button").prop("checked", false);
            //$(".list").hide();
            isBrand = 2;
            btState = false;
            openBrand(pageId, isBrand);
        }
    })

    var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: 'http://apitest.wezchina.com/pages/modulerun/list',
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
                var curr = 'we-log';
                var status = true;
                var list = ['we-set', 'we-art', 'we-shop', 'we-app', 'we-log'];

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
                        $(id + " span img").attr('src', '../common/img/more1.png');
                        status = false;
                    } else {
                        $(id + ":eq(1)").show(500);
                        $(id + " span img").attr('src', '../common/img/more_unfold.png');
                        $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                        status = true;
                    }
                }

                list.map(x => {
                    $("." + x).click(function() {
                        if (curr == x) {
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '../common/img/more1.png');
                            });
                            showList(status, x);
                        } else {
                            status = false;
                            $("." + curr + ":eq(0)").css("border-bottom", "0");
                            curr = x;
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '../common/img/more1.png');
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
    }

    //登录token参数
    var token = docCookies.getItem("token");
    if(token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token
            }
        });
    }

    //userinfo
    var platId = '';
    var userInfo = function(weid){
        $.ajax({
            url: 'http://apitest.wezchina.com/users/' + weid,
            type: 'GET',
            success: function(data){
                console.log(data);
                platId = data.data.plat_id;
            },
            error: function(error){
                console.log(error)
            }
        })
    }

    userInfo(weid);

    var smsTemplate = function(data) {
        var template = `<button type="button" id=` + data.weid + ` class="btn btn-default dropdown-toggle price " aria-haspopup="true" aria-expanded="false">` + data.count + "条/&yen" + data.price + `</button>`
        return template;
    }

    var reqBuy;
    var smsId;
    var smsInfo = [];
    var count;
    var smsBuy = function(platId){
        $.ajax({
            url: 'http://apitest.wezchina.com/sms/package/list',
            type: 'POST',
            data: {
                plat_id: platId
            },
            success: function(data){
                console.log(data)
                if (data.data != null) {
                    data.data.list.map(x => {
                        smsInfo.push({id: x.weid, count: x.count})
                        $(".prices").append(smsTemplate(x))
                    })

                    $(".price").click(function(){
                        smsId = $(this).attr("id");
                        //通过id反查列表获取购买短信条数
                        count = smsInfo.filter(x => x.id == smsId)[0].count;
                        $(this).css({
                            'border-color': '#faaa00',
                            'color': '#fbba2f',
                            'background': 'url(../img/current.png) 0 8px no-repeat #fff8e9'
                        }).animate({
                            backgroundPositionX: '122px'
                        }).siblings().css({
                            'border-color': '#ccc',
                            'background': 'none',
                            'color': '#333',
                        })
                    })

                    $("#buyNow").click(function(){
                        //console.log('smsId:', smsId);
                        if (smsId == undefined) {
                            layer.msg("请选择套餐", {
                                time: 1500
                            });
                            return ;
                        }
                        var password = $("#operate-1").val();
                        //生成二维码url
                        qrcodeBuy(smsId, password, count);
                        //qrWindow(weid, 'http://apitest.wezchina.com/user/admin/app/' + weid);
                    })

                    //套餐主键ID
                    //smsId = data.data.list[0].weid;
                    reqBuy = updateBuy;
                } else {
                    reqBuy = storeBuy;
                }
            },
            error: function(error){
                console.log(error)
            }
        })
    }

    var storeBuy = function(id, count, price, note){
        $.ajax({
            url: 'http://apitest.wezchina.com/sms/package/store',
            type: 'POST',
            data: {
                count: count,
                price: price,
                note: note
            },
            success: function(data){
                console.log('store buy')
                console.log(data);
                layer.msg(data.message, {
                    time: 1500
                });
            }
        })
    }

    var updateBuy = function(id, count, price, note){
        $.ajax({
            url: 'http://apitest.wezchina.com/sms/package/update',
            type: 'POST',
            data: {
                weid: id,
                count: count,
                price: price,
                note: note
            },
            success: function(data){
                console.log('store update')
                console.log(data);
                layer.msg(data.message, {
                    time: 1500
                });
            }
        })
    }

    var store = function(sign, count){
        $.ajax({
            url: 'http://apitest.wezchina.com/sms/usersms/store',
            type: 'POST',
            data: {
                sms_sign: sign,
                //sms_count: count
            },
            success: function(data){
                console.log(data);
                layer.msg(data.message, {
                    time: 1500
                });
            }
        })
    }

    var update = function(weid, sign, count){
        $.ajax({
            url: 'http://apitest.wezchina.com/sms/usersms/update',
            type: 'POST',
            data: {
                weid: weid,
                sms_sign: sign,
                sms_count: count
            },
            success: function(data){
                console.log('update')
                console.log(data);
                layer.msg(data.message, {
                    time: 1500
                });
            }
        })
    }

    var req;
    var init = function(id){
        $.ajax({
            url: 'http://apitest.wezchina.com/sms/usersms/detaibyuserid/' + id,
            type: 'GET',
            success: function(data){
                console.log(data);
                moduleState();
                if (data.data != null) {
                    weid = data.data.weid;
                    $("#sign").val(data.data.sms_sign);
                    $("#surplus").val(data.data.sms_count);
                    req = update;
                } else {
                    req = store;
                }
            },
            error: function(error){
                console.log(error);
            }
        })
    }

    init(weid);

    //购买短信套餐二维码
    var qrcodeBuy = function(id, password, count){
        $.ajax({
            url: 'http://apitest.wezchina.com/wechatpay/smspay?id=' + id + '&secret=' + password,
            type: 'GET',
            success: function(data){
                console.log(data);
                //轮询订单接口的weid
                if (data.code == 200) {
                    var id = data.data.weid;
                    var url = data.data.url;
                    qrWindow(id, url, count);
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    })
                }
            },
            error: function(error){
                console.log(error);
            }
        })
    }

    var qrWindow = function(id, qrUrl, count) {
        $.ajax({
            url: 'http://apitest.wezchina.com/file/qrcode' + '?size=150&url=' + qrUrl,
            type: 'GET',
            success: function(data){
                //console.log(data);
                layer.open({
                    type: 1
                    ,title: '请扫描二维码'
                    ,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    ,area: ['400px', '300px']
                    ,id: 'layerDemo'+type //防止重复弹出
                    ,content: '<div style="padding: 20px 100px;"><img width="100%" src=' + 'http://apitest.wezchina.com/file/qrcode' + '?size=150&url=' + qrUrl + '></div>'
                    //,btn: '关闭全部'
                    ,btnAlign: 'c' //按钮居中
                    ,shade: 0 //不显示遮罩
                    ,yes: function(){
                        layer.closeAll();
                    }
                });

                var check = setInterval(function(){
                    $.ajax({
                        url: 'http://apitest.wezchina.com/sms/order/detail/' + id,
                        type: 'GET',
                        success: function(data) {
                            console.log(data);
                            var status = data.data.status;
                            if (status == 2) {
                                //支付成功
                                layer.closeAll();
                                //更新数据
                                $("#surplus").val(count);
                                update(weid, '', count);
                                //弹出支付成功窗口
                                layer.msg("您已成功购买" + count + "条短信");
                                /*layer.open({
                                 type: 1
                                 ,title: '支付成功'
                                 ,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                                 ,area: ['400px', '300px']
                                 ,id: 'layerDemo'+type //防止重复弹出
                                 ,content: '成功购买' + count + '条短信！'
                                 //,btn: '关闭全部'
                                 ,btnAlign: 'c' //按钮居中
                                 ,shade: 0 //不显示遮罩
                                 ,yes: function(){
                                 layer.closeAll();
                                 }
                                 });*/
                                clearInterval(check);
                            } else {
                                console.log('go on')
                            }
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    })
                }, 1000)

            },
            error: function(error){
                console.log(error);
            }
        })
    }

    $(".buy").click(function(){
        $(".prices").html("");
        //创建套餐列表，写入套餐主键id
        smsBuy(platId);
        //更新套餐列表数据
        //reqBuy(weid, 1000, 100, '')
        //storeBuy('', 1000, 100, '');
    })

    $(".save").click(function(){
        var sign = $("#sign").val()
        var count = $("#surplus").val()

        if (sign != '' && count != '') {
            req(weid, sign, count);
        } else {
            layer.msg("请输入短信签名", {
                time: 1500
            });
        }

    })

    //主页初始化
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

    init__(docCookies.getItem("token"));
})
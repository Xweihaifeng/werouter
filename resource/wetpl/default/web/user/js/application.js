/**
 * Created by Hongguang on 2017/8/29.
 */
 //列表折叠
sessionStorage.listname='we-app';

$(document).ready(function(){
    //const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    // console.log('logo:',favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    // console.log('logo:',logo);
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

    $("#title").text('【' + localStorage.getItem('title') + '】');

    var domain;
    var isBrand;
    var btState;
    var pageId;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                /*if (data.code == 401) {
                 domain = '/index';
                 localStorage.removeItem('token')
                 window.location.href = '/login'
                }*/
                if (data.code == 200){
                    // console.log(data);
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
                            $("#toggle-button-app").prop("checked", true);
                        } else {
                            btState = false;
                            $("#toggle-button-app").prop("checked", false);
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

    var weid = localStorage.getItem('weid');
    hasDomain(weid);

  /*  var isLogin = false; //判断用户登陆与否
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

    //开启独立品牌
    var openBrand = function(pageId, status) {
        //console.log(pageId + ":" + status)
        $.ajax({
            url: PAGES_UPDATE,
            type: "POST",
            headers: {
                'Token': localStorage.getItem('token')
            },
            data: {
                weid: pageId,
                is_brand: status
            },
            success: function(data) {
                // console.log(data)
            },
            error: function(err) {
                console.log(err)
            }
        })
    }

    var weid = localStorage.getItem('weid');
    $("#toggle-button-app").click(function(){
        if (!btState){
            $("#toggle-button-app").prop("checked", true);
            //$(".list").show();
            isBrand = 1;
            btState = true;
            openBrand(pageId, isBrand);
        } else {
            $("#toggle-button-app").prop("checked", false);
            //$(".list").hide();
            isBrand = 2;
            btState = false;
            openBrand(pageId, isBrand);
        }
    })

/*    var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                if (data.code == 200){
                    // console.log('module:', data.data.list);
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
                var curr = 'we-app';
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
    //登录token参数
    var token = window.localStorage.getItem('token');
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
            url: USERDETAIL + '/' + weid,
            type: 'GET',
            success: function(data){
                // console.log(data);
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
            url: SMS_PACKAGE_LIST,
            type: 'POST',
            data: {
                plat_id: platId
            },
            success: function(data){
                // console.log(data)
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
                            'background': 'url(/common/img/current.png) 0 8px no-repeat #fff8e9'
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
                        // var password = $("#operate-1").val();
                        var password = '';
                        //生成二维码url
                        // console.log('count:', count)
                        if ($("#sign").val() != '') {
                            qrcodeBuy(smsId, password, count);
                        } else {
                            layer.msg("请先设置短信签名", {
                                time: 1500
                            });
                        }
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
            url: SMS_PACKAGE_STORE,
            type: 'POST',
            data: {
                count: count,
                price: price,
                note: note
            },
            success: function(data){
                // console.log('store buy')
                // console.log(data);
                layer.msg(data.message, {
                    time: 1500
                });
            }
        })
    }

    var updateBuy = function(id, count, price, note){
        $.ajax({
            url: SMS_PACKAGE_UPDATE,
            type: 'POST',
            data: {
                weid: id,
                count: count,
                price: price,
                note: note
            },
            success: function(data){
                // console.log('store update')
                // console.log(data);
                layer.msg(data.message, {
                    time: 1500
                });
            }
        })
    }

    var store = function(id, sign, count){
        $.ajax({
            url: SMS_USERSMS_STORE,
            type: 'POST',
            data: {
                sms_sign: sign,
                //sms_count: count
            },
            success: function(data){
                // console.log(data);
                // console.log('store')
                weid = data.data;
                layer.msg('短信签名设置成功', {
                    time: 1500
                });
            }
        })
    }

    var update = function(weid, sign, count, flag){
        $.ajax({
            url: SMS_USERSMS_UPDATE,
            type: 'POST',
            data: {
                weid: weid,
                sms_sign: sign,
                sms_count: count
            },
            success: function(data){
                // console.log(data);
                // console.log('update')
                if (flag || flag == undefined) {
                    layer.msg('短信签名设置成功', {
                        time: 1500
                    });
                }
            }
        })
    }

    var req;
    var init = function(id){
        $.ajax({
            url: SMS_USERSMS_DETAIBYUSERID + id,
            type: 'GET',
            success: function(data){
                // console.log(data);
                // moduleState();
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
            // url: WECHATPAY_SMSPAY + '?id=' + id + '&secret=' + password,
            url: WECHATPAY_SMSPAY + '?id=' + id,
            type: 'GET',
            success: function(data){
                // console.log(data);
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
            url: QRCODE + '?size=150&url=' + qrUrl,
            type: 'GET',
            success: function(data){
                //console.log(data);
                layer.open({
                    type: 1
                    ,title: '请扫描二维码购买短信'
                    ,offset: type //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    ,area: ['400px', '300px']
                    ,id: 'layerDemo'+type //防止重复弹出
                    ,content: '<div style="padding: 20px 100px;"><img width="100%" src=' + apiUrl + 'file/qrcode' + '?size=150&url=' + qrUrl + '></div>'
                    //,btn: '关闭全部'
                    ,btnAlign: 'c' //按钮居中
                    ,shade: 0 //不显示遮罩
                    ,yes: function(){
                        layer.closeAll();
                    }
                });

                var check = setInterval(function(){
                    $.ajax({
                        url: SMS_ORDER_DETAIL + id,
                        type: 'GET',
                        success: function(data) {
                            // console.log(data);
                            var status = data.data.status;
                            if (status == 2) {
                                //支付成功
                                layer.closeAll();
                                //更新数据

                                var historyCount = parseInt($("#surplus").val());
                                if (historyCount == NaN) {
                                    historyCount = 0;
                                }
                                var newCount = count + historyCount;
                                // console.log('org:', historyCount)
                                // console.log('res:', newCount)
                                var newSign = $("#sign").val();
                                $("#surplus").val(newCount);
                                update(weid, newSign, newCount, false);
                                //弹出支付成功窗口
                                layer.msg("您已成功购买" + count + "条短信");
                                // $("#operate-1").val('');
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
                                // console.log('go on')
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

        if (count == '') {
            count = 0;
        }

        if (sign != '' && /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi.exec(sign) && sign.length <= 6) {
            req(weid, sign, count);
            req = update;
        } else {
            layer.msg("请输入6个汉字以内的短信签名", {
                time: 1500
            });
        }

    })

    //支付方式
    var wxState = true;
    var zfbState = false;
    $("#wx").click(function(){
        if (!wxState) {
            wxState = true;
            zfbState = false;
            $(this).attr('src', '/common/img/wxzf1.png');
            $("#zfb").attr('src', '/common/img/zfb2.png');
        }
    })

    $("#zfb").click(function(){
        layer.msg('暂不支持支付宝支付', {
            time: 1500
        })
        /*if (!zfbState) {
            zfbState = true;
            wxState = false;
            $(this).attr('src', '/common/img/zfb1.png');
            $("#wx").attr('src', '/common/img/wxzf2.png');
        }*/
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

    init__(localStorage.getItem('token'));*/

    if(localStorage.getItem('title')=="" || localStorage.getItem('title')==null ||localStorage.getItem('title')==undefined || localStorage.getItem('title')=="null"){
         $.ajax({
            url: apiUrl+"cms/advs",
            type: 'get',
            success: function(data){
                if (data.code == 200){

                   $(".title_data").html( data.data.setting.title);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }else{
       $(".title_data").html(localStorage.getItem('title'));

    }

})

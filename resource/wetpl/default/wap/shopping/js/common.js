//引入埋点组件
var _maq = _maq || [];
(function() {
    var ma = document.createElement('script');
    ma.type = 'text/javascript';
    ma.async = true;
    ma.src = "https://logapi.dtstack.com/dta.js?t=cxKLOpJSs8OajOTXOs%2BROCOQ1G8InxjrSmOQGL4lV0BeiXrgRVzb8C%2Bq4jCNX1VI8sB1Q2hUYBBKr72hajrzHhG8tG9pegfb0MH1k2gSB3qyQCGxjoBhIRKCRCj2ziEmOm14ewVmGs2Zn4IMl2l3nXVxZ/tBznRY4FWtvkcAwfEdUG7SqSYQdol9ijNZeGvC";
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ma, s);
})();
//引入美洽美洽在线客服系统
(function(m, ei, q, i, a, j, s) {
    m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments)
    };
    j = ei.createElement(q),
        s = ei.getElementsByTagName(q)[0];
    j.async = true;
    j.charset = 'UTF-8';
    j.src = '//static.meiqia.com/dist/meiqia.js';
    s.parentNode.insertBefore(j, s);
})(window, document, 'script', '_MEIQIA');
_MEIQIA('entId', 53404);
_MEIQIA('withoutBtn');
// loaclstorage方法 @mingliang @轻松筹
/*
    window.store.getAll/get/clear/set/remove
*/
/* Copyright (c) 2010-2013 Marcus Westin */
(function(e) {
    function s() {
        try {
            return r in e && e[r]
        } catch (t) {
            return !1
        }
    }
    var t = {},
        n = e.document,
        r = "localStorage",
        i;
    t.disabled = !1, t.set = function(e, t) {}, t.get = function(e) {}, t.remove = function(e) {}, t.clear = function() {}, t.transact = function(e, n, r) {
        var i = t.get(e);
        r == null && (r = n, n = null), typeof i == "undefined" && (i = n || {}), r(i), t.set(e, i)
    }, t.getAll = function() {}, t.forEach = function() {}, t.serialize = function(e) {
        return JSON.stringify(e)
    }, t.deserialize = function(e) {
        if (typeof e != "string") return undefined;
        try {
            return JSON.parse(e)
        } catch (t) {
            return e || undefined
        }
    };
    if (s()) i = e[r], t.set = function(e, n) {
        return n === undefined ? t.remove(e) : (i.setItem(e, t.serialize(n)), n)
    }, t.get = function(e) {
        return t.deserialize(i.getItem(e))
    }, t.remove = function(e) {
        i.removeItem(e)
    }, t.clear = function() {
        i.clear()
    }, t.getAll = function() {
        var e = {};
        return t.forEach(function(t, n) {
            e[t] = n
        }), e
    }, t.forEach = function(e) {
        for (var n = 0; n < i.length; n++) {
            var r = i.key(n);
            e(r, t.get(r))
        }
    };
    else if (n.documentElement.addBehavior) {
        var o, u;
        try {
            u = new ActiveXObject("htmlfile"), u.open(), u.write('<script>document.w=window</script><iframe src="/favicon.ico"></iframe>'), u.close(), o = u.w.frames[0].document, i = o.createElement("div")
        } catch (a) {
            i = n.createElement("div"), o = n.body
        }

        function f(e) {
            return function() {
                var n = Array.prototype.slice.call(arguments, 0);
                n.unshift(i), o.appendChild(i), i.addBehavior("#default#userData"), i.load(r);
                var s = e.apply(t, n);
                return o.removeChild(i), s
            }
        }
        var l = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");

        function c(e) {
            return e.replace(l, "___")
        }
        t.set = f(function(e, n, i) {
            return n = c(n), i === undefined ? t.remove(n) : (e.setAttribute(n, t.serialize(i)), e.save(r), i)
        }), t.get = f(function(e, n) {
            return n = c(n), t.deserialize(e.getAttribute(n))
        }), t.remove = f(function(e, t) {
            t = c(t), e.removeAttribute(t), e.save(r)
        }), t.clear = f(function(e) {
            var t = e.XMLDocument.documentElement.attributes;
            e.load(r);
            for (var n = 0, i; i = t[n]; n++) e.removeAttribute(i.name);
            e.save(r)
        }), t.getAll = function(e) {
            var n = {};
            return t.forEach(function(e, t) {
                n[e] = t
            }), n
        }, t.forEach = f(function(e, n) {
            var r = e.XMLDocument.documentElement.attributes;
            for (var i = 0, s; s = r[i]; ++i) n(s.name, t.deserialize(e.getAttribute(s.name)))
        })
    }
    try {
        var h = "__storejs__";
        t.set(h, h), t.get(h) != h && (t.disabled = !0), t.remove(h)
    } catch (a) {
        t.disabled = !0
    }
    t.enabled = !t.disabled;
    e.store = t
})(window);

// D.ajax 封装自己的ajax
(function(e, $) {
    var _g = {};
    //解析qsctoken并存储
    var str = getQueryString('qsctoken');
    if (str) {
        var base = new Base64();
        var obj = JSON.parse(base.decode(decodeURIComponent(str)));
        for(p in obj){
            store.set(p,obj[p]);
        }
    }
    e.token = obj||{};

    _g.ajax = function(options) {
        var successCallback = $.extend({},options).success;
        var errorCallback = $.extend({},options).error;
        var defaults ={
            data:$.extend({},options.data,{
                access_token:store.get('access_token')||"",
                cli_create_time:parseInt(e.store.get('cli_create_time'))||"",
                expires_in:parseInt(e.store.get('cli_create_time'))||"",
                weapp:'h5didaozx'
            }),
            success:function(res){
                if(res.status == 101){
                // 需要手机号码登陆
                    window.location.href = PassPortUrl+"/signin.html?isguest=1&notneedphone=0&newbindtpl=0&redirect_uri=" + encodeURIComponent(window.location.href);
                    return false;
                }else if(res.status == 201){
                    // 需要登陆（授权）
                    window.location.href = PassPortUrl+"/signin.html?notneedphone=1&newbindtpl=0&redirect_uri=" + encodeURIComponent(window.location.href);
                    return false;
                }
                if(typeof successCallback == 'function'){
                    successCallback(res);
                }
            },
            error:function(res){
                if(typeof errorCallback == 'function'){
                    errorCallback(res);
                }
            },
        }
        var data = $.extend({},options,defaults);
        // 创建ajax对象
        $.ajax(data);
    }
    return e.g = _g;
})(window, $);


function Base64() {
    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                    _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                    _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    };

    // private method for UTF-8 encoding
    var _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    };

    // private method for UTF-8 decoding
    var _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };
}
var Public = Public || {};

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return r[2];
    return '';
}

function addCookie(name, value, expireHours) {
    var cookieString = name + "=" + escape(value) + "; path=/";
    //判断是否设置过期时间
    if (expireHours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expireHours * 3600 * 1000);
        cookieString = cookieString + ";expires=" + date.toGMTString();
    }
    document.cookie = cookieString;
}

function getCookie(name) {
    var strcookie = document.cookie;
    var arrcookie = strcookie.split("; ");
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) return unescape(arr[1]);
    }
    return null;
}

function delCookie(name) { //删除cookie
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
}

function checkLogin(state) {

    var accessToken = store.get('access_token')||"";
    var create_time = parseInt(store.get('cli_create_time')||0);
    var nowTime = parseInt(Date.parse(new Date())/1000);
    // alert(accessToken)
    if (!(accessToken)) {
        if(state && state == 2){
            //登陆去
            window.location.href = PassPortUrl+"/signin.html?notneedphone=1&newbindtpl=0&redirect_uri=" + encodeURIComponent(window.location.href);
        }
        return false;
    }else {
        return true;
    }
}

function contains(arr, str) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === str) {
            return true;
        }
    }
    return false;
}

function buildUrl(type, data) {
    switch (type) {
        case 'keyword':
            return WapSiteUrl + 'tmpl/product_list.html?keyword=' + encodeURIComponent(data);
        case 'special':
            return WapSiteUrl + 'special.html?special_id=' + data;
        case 'goods':
            return WapSiteUrl + 'tmpl/product_detail.html?goods_id=' + data;
        case 'url':
            return data;
    }
    return WapSiteUrl;
}

function errorTipsShow(html) {
    $(".error-tips").html(html).show();
    setTimeout(function() {
        errorTipsHide();
    }, 3000);
}

function errorTipsHide() {
    $(".error-tips").html("").hide();
}

function writeClear(o) {
    if (o.val().length > 0) {
        o.parent().addClass('write');
    } else {
        o.parent().removeClass('write');
    }
    btnCheck(o.parents('form'));
}

function btnCheck(form) {
    var btn = true;
    form.find('input').each(function() {
        if ($(this).hasClass('no-follow')) {
            return;
        }
        if ($(this).val().length == 0) {
            btn = false;
        }
    });
    if (btn) {
        form.find('.btn').parent().addClass('ok');
    } else {
        form.find('.btn').parent().removeClass('ok');
    }
}

/**
 * 取得默认系统搜索关键词
 * @param cmd
 */
function getSearchName() {
    var keyword = decodeURIComponent(getQueryString('keyword'));
    if (keyword == '') {
        if (getCookie('deft_key_value') == null) {
            $.getJSON(ApiUrl + '/index.php?ctl=Index&met=getSearchWords&typ=json', function(result) {
                var data = result.data.hot_info;
                if (typeof data.name != 'undefined') {
                    //	            	$('#keyword').attr('placeholder',data.name);
                    $('#keyword').val(data.name);
                    addCookie('deft_key_name', data.name, 1);
                    addCookie('deft_key_value', data.value, 1);
                } else {
                    addCookie('deft_key_name', '', 1);
                    addCookie('deft_key_value', '', 1);
                }
            })
        } else {
            //	    	$('#keyword').attr('placeholder',getCookie('deft_key_name'));
            //	    	$('#keyword').val(getCookie('deft_key_name'));
        }
    }
}
// 免费领代金券
function getFreeVoucher(tid) {
    var key = getCookie('key');
    checkLogin(1)
    g.ajax({
        type: 'post',
        url: ApiUrl + "/index.php?ctl=Voucher&met=receiveVoucher&typ=json",
        data: {
            vid: tid,
            k: key,
            u: getCookie('id')
        },
        dataType: 'json',
        success: function(result) {
            checkLogin(result.login);
            var msg = '领取成功';
            var skin = 'green';
            if (result.data.error) {
                msg = '领取失败：' + result.data.error;
                skin = 'red';
            }
            $.sDialog({
                skin: skin,
                content: msg,
                okBtn: false,
                cancelBtn: false
            });
        }
    });
}

// 登陆后更新购物车
function updateCookieCart(key) {
    var cartlist = decodeURIComponent(getCookie('goods_cart'));
    if (cartlist && cartlist !== 'null') {
        g.ajax({
            type: 'post',
            url: ApiUrl + 'index.php?ctl=Buyer_Cart&met=addCartRow',
            data: {
                // k: key,
                u: getCookie('id'),
                cartlist: cartlist
            },
            dataType: 'json',
            async: false
        });
        delCookie('goods_cart');
    }
}
/**
 * 查询购物车中商品数量
 * @param key
 * @param expireHours
 */
function getCartCount(key, expireHours) {
    var cart_count = 0;
    if (checkLogin() && getCookie('cart_count') === null) {
        var key = getCookie('key');
        g.ajax({
            type: 'post',
            url: ApiUrl + '/index.php?ctl=Buyer_Cart&met=getCartGoodsNum&typ=json',
            data: {
                k: key,
                u: getCookie('id')
            },
            dataType: 'json',
            async: false,
            success: function(result) {
                if (typeof(result.data.cart_count) != 'undefined') {
                    addCookie('cart_count', result.data.cart_count, expireHours);
                    cart_count = result.data.cart_count;
                }
            }
        });
    } else {
        cart_count = getCookie('cart_count');
    }
    if (cart_count > 0 && $('.nctouch-nav-menu').has('.cart').length > 0) {
        $('.nctouch-nav-menu').has('.cart').find('.cart').parents('li').find('sup').show();
        $('#header-nav').find('sup').show();
    }
}
/**
 * 查询是否有新消息
 */
function getChatCount() {
    if ($('#header').find('.message').length > 0) {
        var key = getCookie('key');
        if (key !== null) {
            $.getJSON(ApiUrl + '/index.php?ctl=Buyer_Message&met=getNewMessageNum&typ=json', {
                k: key,
                u: getCookie('id')
            }, function(result) {
                if (result.data.count > 0) {
                    $('#header').find('.message').parent().find('sup').show();
                    $('#header-nav').find('sup').show();
                }
            });
        }
        $('#header').find('.message').parent().click(function() {
            window.location.href = WapSiteUrl + '/tmpl/member/chat_list.html';
        });
    }
}

$(function() {

    $('.input-del').click(function() {
        $(this).parent().removeClass('write').find('input').val('');
        btnCheck($(this).parents('form'));
    });

    // radio样式
    $('body').on('click', 'label', function() {
        if ($(this).has('input[type="radio"]').length > 0) {
            $(this).addClass('checked').siblings().removeAttr('class').find('input[type="radio"]').removeAttr('checked');
        } else if ($(this).has('[type="checkbox"]')) {
            if ($(this).find('input[type="checkbox"]').prop('checked')) {
                $(this).addClass('checked');
            } else {
                $(this).removeClass('checked');
            }
        }
    });
    // 滚动条通用js
    if ($('body').hasClass('scroller-body')) {
        new IScroll('.scroller-body', {
            mouseWheel: true,
            click: true
        });
    }

    // 右上侧小导航控件
    $('#header').on('click', '#header-nav', function() {
        if ($('.nctouch-nav-layout').hasClass('show')) {
            $('.nctouch-nav-layout').removeClass('show');
        } else {
            $('.nctouch-nav-layout').addClass('show');
        }
    });
    $('#header').on('click', '.nctouch-nav-layout', function() {
        $('.nctouch-nav-layout').removeClass('show');
    });
    $(document).scroll(function() {
        $('.nctouch-nav-layout').removeClass('show');
    });
    // getSearchName();
    // getCartCount();
    // getChatCount(); // 导航右侧消息


    //回到顶部
    $(document).scroll(function() {
        set();
    });
    $('.fix-block-r,footer').on('click', ".gotop", function() {
        btn = $(this)[0];
        this.timer = setInterval(function() {
            $(window).scrollTop(Math.floor($(window).scrollTop() * 0.8));
            if ($(window).scrollTop() == 0) clearInterval(btn.timer, set);
        }, 10);
    });

    function set() {
        $(window).scrollTop() == 0 ? $('#goTopBtn').addClass('hide') : $('#goTopBtn').removeClass('hide');
    }
});
(function($) {
    $.extend($, {
        /**
         * 滚动header固定到顶部
         */
        scrollTransparent: function(options) {
            var defaults = {
                valve: '#header', // 动作触发
                scrollHeight: 50
            }
            var options = $.extend({}, defaults, options);

            function _init() {
                $(window).scroll(function() {
                    if ($(window).scrollTop() <= options.scrollHeight) {
                        $(options.valve).addClass('transparent').removeClass('posf');
                    } else {
                        $(options.valve).addClass('posf').removeClass('transparent');
                    }
                });

            }

            return this.each(function() {
                _init();
            })();
        },

        /**
         * 选择地区
         *
         * @param $
         */
        areaSelected: function(options) {
            var defaults = {
                success: function(data) {}
            }
            var options = $.extend({}, defaults, options);
            var ASID = 0;
            var ASID_1 = 0;
            var ASID_2 = 0;
            var ASID_3 = 0;
            var ASNAME = '';
            var ASINFO = '';
            var ASDEEP = 1;
            var ASINIT = true;

            function _init() {
                if ($('#areaSelected').length > 0) {
                    $('#areaSelected').remove();
                }
                var html = '<div id="areaSelected" style="z-index: 666">' + '<div class="nctouch-full-mask left" style="z-index: 555">' + '<div class="nctouch-full-mask-bg"></div>' + '<div class="nctouch-full-mask-block">' + '<div class="header">' + '<div class="header-wrap">' + '<div class="header-l"><a href="javascript:void(0);"><i class="back"></i></a></div>' + '<div class="header-title">' + '<h1>选择地区</h1>' + '</div>' + '<div class="header-r"><a href="javascript:void(0);"><i class="close"></i></a></div>' + '</div>' + '</div>' + '<div class="nctouch-main-layout">' + '<div class="nctouch-single-nav">' + '<ul id="filtrate_ul" class="area">' + '<li class="selected"><a href="javascript:void(0);">一级地区</a></li>' + '<li><a href="javascript:void(0);" >二级地区</a></li>' + '<li><a href="javascript:void(0);" >三级地区</a></li>' + '</ul>' + '</div>' + '<div class="nctouch-main-layout-a"><ul class="nctouch-default-list"></ul></div>' + '</div>' + '</div>' + '</div>' + '</div>';
                $('body').append(html);
                _getAreaList();
                _bindEvent();
                _close();
            }

            function _getAreaList() {
                $.ajax({ //获取区域列表
                    type: 'get',
                    url: ApiUrl + '/index.php?ctl=Base_District&met=district&typ=json',
                    data: {
                        pid: ASID
                    },
                    dataType: 'json',
                    async: false,
                    success: function(result) {
                        if (result.data.items.length == 0) {
                            _finish();
                            return false;
                        }
                        if (ASINIT) {
                            ASINIT = false
                        } else {
                            ASDEEP++;
                        }
                        $('#areaSelected').find('#filtrate_ul').find('li').eq(ASDEEP - 1).addClass('selected').siblings().removeClass('selected');
                        checkLogin(result.login);
                        var data = result.data;
                        var area_li = '';
                        for (var i = 0; i < data.items.length; i++) {
                            area_li += '<li><a href="javascript:void(0);" data-id="' + data.items[i].district_id + '" data-name="' + data.items[i].district_name + '"><h4>' + data.items[i].district_name + '</h4><span class="arrow-r"></span> </a></li>';
                        }
                        $('#areaSelected').find(".nctouch-default-list").html(area_li);
                        if (typeof(myScrollArea) == 'undefined') {
                            if (typeof(IScroll) == 'undefined') {
                                $.ajax({
                                    url: WapSiteUrl + '/js/iscroll.js',
                                    dataType: "script",
                                    async: false
                                });
                            }
                            myScrollArea = new IScroll('#areaSelected .nctouch-main-layout-a', {
                                mouseWheel: true,
                                click: true
                            });
                        } else {
                            myScrollArea.destroy();
                            myScrollArea = new IScroll('#areaSelected .nctouch-main-layout-a', {
                                mouseWheel: true,
                                click: true
                            });
                        }
                    }
                });
                return false;
            }

            function _bindEvent() {
                $('#areaSelected').find('.nctouch-default-list').off('click', 'li > a');
                $('#areaSelected').find('.nctouch-default-list').on('click', 'li > a', function() {
                    ASID = $(this).attr('data-id');
                    eval("ASID_" + ASDEEP + "=$(this).attr('data-id')");
                    ASNAME = $(this).attr('data-name');
                    ASINFO += ASNAME + ' ';
                    var _li = $('#areaSelected').find('#filtrate_ul').find('li').eq(ASDEEP);
                    _li.prev().find('a').attr({
                        'data-id': ASID,
                        'data-name': ASNAME
                    }).html(ASNAME);
                    if (ASDEEP == 3) {
                        _finish();
                        return false;
                    }
                    _getAreaList();
                });
                $('#areaSelected').find('#filtrate_ul').off('click', 'li > a');
                $('#areaSelected').find('#filtrate_ul').on('click', 'li > a', function() {
                    if ($(this).parent().index() >= $('#areaSelected').find('#filtrate_ul').find('.selected').index()) {
                        return false;
                    }
                    ASID = $(this).parent().prev().find('a').attr('data-id');
                    ASNAME = $(this).parent().prev().find('a').attr('data-name');
                    ASDEEP = $(this).parent().index();
                    ASINFO = '';
                    for (var i = 0; i < $('#areaSelected').find('#filtrate_ul').find('a').length; i++) {
                        if (i < ASDEEP) {
                            ASINFO += $('#areaSelected').find('#filtrate_ul').find('a').eq(i).attr('data-name') + ' ';
                        } else {
                            var text = '';
                            switch (i) {
                                case 0:
                                    text = '一级地区'
                                    break;
                                case 1:
                                    text = '二级地区'
                                    break;
                                case 2:
                                    text = '三级地区';
                                    break;
                            }
                            $('#areaSelected').find('#filtrate_ul').find('a').eq(i).html(text);
                        }
                    }
                    _getAreaList();
                });
            }

            function _finish() {
                var data = {
                    area_id: ASID,
                    area_id_1: ASID_1,
                    area_id_2: ASID_2,
                    area_id_3: ASID_3,
                    area_name: ASNAME,
                    area_info: ASINFO
                };
                options.success.call('success', data);
                if (!ASINIT) {
                    $('#areaSelected').find('.nctouch-full-mask').addClass('right').removeClass('left');
                }
                return false;
            }

            function _close() {
                $('#areaSelected').find('.header-l').off('click', 'a');
                $('#areaSelected').find('.header-l').on('click', 'a', function() {
                    $('#areaSelected').find('.nctouch-full-mask').addClass('right').removeClass('left');
                });
                return false;
            }

            return this.each(function() {
                return _init();
            })();
        },


        /**
         * 从右到左动态显示隐藏内容
         *
         */
        animationLeft: function(options) {
            var defaults = {
                valve: '.animation-left', // 动作触发
                wrapper: '.nctouch-full-mask', // 动作块
                scroll: '' // 滚动块，为空不触发滚动
            }
            var options = $.extend({}, defaults, options);

            function _init() {
                $(options.valve).click(function() {
                    $(options.wrapper).removeClass('hide').removeClass('right').addClass('left');

                    if (options.scroll != '') {
                        if (typeof(myScrollAnimationLeft) == 'undefined') {
                            if (typeof(IScroll) == 'undefined') {
                                $.ajax({
                                    url: WapSiteUrl + '/js/iscroll.js',
                                    dataType: "script",
                                    async: false
                                });
                            }
                            myScrollAnimationLeft = new IScroll(options.scroll, {
                                mouseWheel: true,
                                click: true
                            });
                        } else {
                            myScrollAnimationLeft.refresh();
                        }
                    }
                });
                $(options.wrapper).on('click', '.header-l > a', function() {
                    $(options.wrapper).addClass('right').removeClass('left');
                });

            }

            return this.each(function() {
                _init();
            })();
        },

        /**
         * 从下到上动态显示隐藏内容
         *
         */
        animationUp: function(options) {
            var defaults = {
                valve: '.animation-up', // 动作触发，为空直接触发
                wrapper: '.nctouch-bottom-mask', // 动作块
                scroll: '.nctouch-bottom-mask-rolling', // 滚动块，为空不触发滚动
                start: function() {}, // 开始动作触发事件
                close: function() {} // 关闭动作触发事件
            }
            var options = $.extend({}, defaults, options);

            function _animationUpRun() {
                options.start.call('start');
                $(options.wrapper).removeClass('down').addClass('up');

                if (options.valve == '.animation-up-buy') {
                    /* $(".goods-option-foot .buy-handle a").removeClass("add-cart").addClass("buy-now");
                     $(".goods-option-foot .buy-handle a").attr("id","buy-now");
                     $(".goods-option-foot .buy-handle #add-cart").css('display','none'); */
                }

                if (options.valve == '.animation-up-cart') {
                    /* $(".goods-option-foot .buy-handle a").removeClass("buy-now").addClass("add-cart");
                     $(".goods-option-foot .buy-handle a").attr("id","add-cart");
                     $(".goods-option-foot .buy-handle #buy-now").css('display','none'); */
                }

                if (options.scroll != '') {
                    /* if (typeof(myScrollAnimationUp) == 'undefined') {
                     if (typeof(IScroll) == 'undefined') {
                     $.ajax({
                     url: WapSiteUrl+'/js/iscroll.js',
                     dataType: "script",
                     async: false
                     });
                     }
                     myScrollAnimationUp = new IScroll(options.scroll, { mouseWheel: true,click: true });
                     } else {
                     myScrollAnimationUp.refresh();
                     } */
                }
            }

            return this.each(function() {
                if (options.valve != '') {
                    $(options.valve).on('click', function() {
                        _animationUpRun();
                    });
                } else {
                    _animationUpRun();
                }
                $(options.wrapper).on('click', '.nctouch-bottom-mask-bg,.nctouch-bottom-mask-close,.myDown', function() {
                    $(options.wrapper).addClass('down').removeClass('up');
                    options.close.call('close');
                });
                $(".myDown").on('click', function() {
                    $("#product_detail_spec_html").addClass('down').removeClass('up');
                    options.close.call('close');
                });
                $(".sure").on('click', function() {
                    $("#red_packet_html").addClass('down').removeClass('up');
                    options.close.call('close');
                });
            })();
        }
    });
})(Zepto);

/**
 * 异步上传图片
 */
$.fn.ajaxUploadImage = function(options) {
    var defaults = {
        url: '',
        data: {},
        start: function() {}, // 开始上传触发事件
        success: function() {}
    }
    var options = $.extend({}, defaults, options);
    var _uploadFile;

    function _checkFile() {
        //文件为空判断
        if (_uploadFile === null || _uploadFile === undefined) {
            alert("请选择您要上传的文件！");
            return false;
        }
        //           
        //          //检测文件类型
        //          if(_uploadFile.type.indexOf('image') === -1) {
        //              alert("请选择图片文件！");
        //              return false;
        //          }
        //           
        //          //计算文件大小
        //          var size = Math.floor(_uploadFile.size/1024);
        //          if (size > 5000) {
        //              alert("上传文件不得超过5M!");
        //              return false;
        //          };
        return true;
    };
    return this.each(function() {
        $(this).on('change', function() {
            var _element = $(this);
            options.start.call('start', _element);
            _uploadFile = _element.prop('files')[0];
            if (!_checkFile) return false;
            try {
                //执行上传操作
                var xhr = new XMLHttpRequest();
                xhr.open("post", options.url + '&typ=json', true);
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4) {
                        returnDate = $.parseJSON(xhr.responseText);
                        options.success.call('success', _element, returnDate);
                    };
                };
                //表单数据
                var fd = new FormData();
                for (k in options.data) {
                    fd.append(k, options.data[k]);
                }
                fd.append(_element.attr('name'), _uploadFile);
                //执行发送
                result = xhr.send(fd);
            } catch (e) {
                alert(e);
            }
        });
    });
}

function loadSeccode() {
    /*
     $("#codekey").val('');
     //加载验证码
     $.ajax({
     type:'get',
     url:ApiUrl+"/index.php?act=seccode&op=makecodekey",
     async : false,
     dataType: 'json',
     success:function(result){
     $("#codekey").val(result.data.codekey);
     }
     });
     $("#codeimage").attr('src',ApiUrl+'/index.php?act=seccode&op=makecode&k='+$("#codekey").val()+'&t=' + Math.random());
     */
}
/**
 * 收藏店铺
 */
function favoriteStore(shop_id) {
    var key = getCookie('key');
    checkLogin(1)
    if (shop_id <= 0) {
        $.sDialog({
            skin: "green",
            content: '参数错误',
            okBtn: false,
            cancelBtn: false
        });
        return false;
    }
    var return_val = false;
    g.ajax({
        type: 'post',
        url: ApiUrl + '/index.php?ctl=Shop&met=addCollectShop&typ=json',
        data: {
            k: key,
            u: getCookie('id'),
            shop_id: shop_id
        },
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.status == 200) {
                $.sDialog({
                    skin: "green",
                    content: "收藏成功！",
                    okBtn: false,
                    cancelBtn: false
                });
                return_val = true;
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.data.msg,
                    okBtn: false,
                    cancelBtn: false
                });
            }
        }
    });
    return return_val;
}
/**
 * 取消收藏店铺
 */
function dropFavoriteStore(shop_id) {
    var key = getCookie('key');
    checkLogin(1)
    if (shop_id <= 0) {
        $.sDialog({
            skin: "green",
            content: '参数错误',
            okBtn: false,
            cancelBtn: false
        });
        return false;
    }
    var return_val = false;
    g.ajax({
        type: 'post',
        url: ApiUrl + '/index.php?ctl=Buyer_Favorites&met=delFavoritesShop&typ=json',
        data: {
            k: key,
            u: getCookie('id'),
            id: shop_id
        },
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.status == 200) {
                // $.sDialog({skin: "green", content: "已取消收藏！", okBtn: false, cancelBtn: false});
                return_val = true;
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.data.error,
                    okBtn: false,
                    cancelBtn: false
                });
            }
        }
    });
    return return_val;
}
/**
 * 收藏商品
 */
function favoriteGoods(goods_id) {
    var key = getCookie('key');
    checkLogin(1)
    if (goods_id <= 0) {
        $.sDialog({
            skin: "green",
            content: '参数错误',
            okBtn: false,
            cancelBtn: false
        });
        return false;
    }
    var return_val = false;
    g.ajax({
        type: 'post',
        url: ApiUrl + '/index.php?ctl=Goods_Goods&met=collectGoods&typ=json',
        data: {
            k: key,
            u: getCookie('id'),
            goods_id: goods_id
        },
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.status == 200) {
                $.sDialog({
                    skin: "green",
                    content: "收藏成功！",
                    okBtn: false,
                    cancelBtn: false
                });
                return_val = true;
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.data.msg,
                    okBtn: false,
                    cancelBtn: false
                });
            }
        }
    });
    return return_val;
}
/**
 * 取消收藏商品
 */
function dropFavoriteGoods(goods_id) {
    var key = getCookie('key');
    checkLogin(1)
    if (goods_id <= 0) {
        $.sDialog({
            skin: "green",
            content: '参数错误',
            okBtn: false,
            cancelBtn: false
        });
        return false;
    }
    var return_val = false;
    g.ajax({
        type: 'post',
        url: ApiUrl + '/index.php?ctl=Buyer_Favorites&met=delFavoritesGoods&typ=json',
        data: {
            k: key,
            u: getCookie('id'),
            id: goods_id
        },
        dataType: 'json',
        async: false,
        success: function(result) {
            if (result.status == 200) {
                $.sDialog({
                    skin: "green",
                    content: "已取消收藏！",
                    okBtn: false,
                    cancelBtn: false
                });
                return_val = true;
            } else {
                $.sDialog({
                    skin: "red",
                    content: result.data.msg,
                    okBtn: false,
                    cancelBtn: false
                });
            }
        }
    });
    return return_val;
}
/**
 * 动态加载css文件
 * @param css_filename css文件路径
 */
function loadCss(css_filename) {
    var link = document.createElement('link');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', css_filename);
    link.setAttribute('href', css_filename);
    link.setAttribute('rel', 'stylesheet');
    css_id = document.getElementById('auto_css_id');
    if (css_id) {
        document.getElementsByTagName('head')[0].removeChild(css_id);
    }
    document.getElementsByTagName('head')[0].appendChild(link);
}
/**
 * 动态加载js文件
 * @param script_filename js文件路径
 */
function loadJs(script_filename) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', script_filename);
    script.setAttribute('id', 'auto_script_id');
    script_id = document.getElementById('auto_script_id');
    if (script_id) {
        document.getElementsByTagName('head')[0].removeChild(script_id);
    }
    document.getElementsByTagName('head')[0].appendChild(script);
}


function ucenterRegist() {
    callback = WapSiteUrl + '/tmpl/member/login.html';

    login_url = UCenterApiUrl + '?ctl=Login&met=regist&typ=e';

    callback = ApiUrl + '?ctl=Login&met=check&typ=e&redirect=' + encodeURIComponent(callback);

    login_url = login_url + '&from=wap&callback=' + encodeURIComponent(callback);

    window.location.href = login_url;
}

function ucenterLogin() {
    
    // $.ajax({
    //     type: "get",
    //     url: UCenterApiUrl + "?ctl=Login&met=checkStatus&typ=json",
    //     dataType: "jsonp",
    //     jsonp: "jsonp_callback",
    //     success: function(data) {
    //         if (typeof(data.data.redirectUrl) != 'undefined') {
    //             window.location = data.data.redirectUrl;
    //             return;
    //         }
    //         //已经登录
    //         if (200 == data.status) {
    //             var key = getCookie('key');
    //             var u = getCookie('id');
    //             if (u && key && u == data.data.us) {
    //                 addCookie('u_id', data.data.user_id, 2);
    //                 addCookie('u_k', data.data.ks, 2);
    //             } else {
    //                 //退出
    //                 delCookie('username');
    //                 delCookie('user_account');
    //                 delCookie('id');
    //                 delCookie('key');
    //                 addCookie('u_id');
    //                 addCookie('u_k');
    //                 var k = data.data.ks;
    //                 var u = data.data.id;
    //                 //本系统登录
    //                 $.ajax({
    //                     type: "get",
    //                     url: ApiUrl + "/index.php?ctl=Login&met=check&typ=json",
    //                     data: {
    //                         ks: data.data.ks,
    //                         us: data.data.id
    //                     },
    //                     dataType: "json",
    //                     success: function(result) {
    //                         if (200 == result.status) {
    //                             //本系统登录API
    //                             var expireHours = 0;
    //                             if ($('#checkbox').prop('checked')) {
    //                                 expireHours = 188;
    //                             }
    //                             addCookie('id', result.data.user_id, expireHours);
    //                             addCookie('user_account', result.data.user_account, expireHours);
    //                             addCookie('key', result.data.key, expireHours);
    //                             // 更新cookie购物车
    //                             updateCookieCart(result.data.key);
    //                             location.reload();
    //                             //window.location.href = WapSiteUrl+'/tmpl/member/member.html';
    //                         }
    //                     },
    //                     error: function() {
    //                         errorTipsShow('<p>' + result.msg + '</p>');
    //                     }
    //                 });
    //             }
    //         } else //未登录
    //         {
    //             // 去passport刷新token
    //             // window.location = 'http://ucenter.didaozx.com/?ctl=Login&met=refreshTokenByPassport';
    //             var key = getCookie('key');
    //             var u = getCookie('id');
    //             if (u && key) {
    //                 delCookie('username');
    //                 delCookie('user_account');
    //                 delCookie('id');
    //                 delCookie('key');
    //                 location.reload();
    //             }
    //         }
    //     },
    //     error: function() {
    //         //          alert('error!');
    //     }
    // });
}
/**
 * 返回顶部方法，调用返回顶部
 */
function smoothscroll() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 5));
    }
}
// 页面滚动到一定高度时给某些元素添加class
/**@yifan 滚动控制页面效果功能
＊参数
＊dom 需要参照的页面dom
＊body 用来计算页面滚动距离的对象，一般设置为body／document／window；
＊animationDom 需要做动画的dom节点
＊addClassName 内含动画过度效果的classname
＊*/
function scrollTodo(dom, body, animationDom, addClassName) {
    var D_top = dom.offset().top;
    var S_top = body.scrollTop();
    var _Top = S_top - D_top;
    if (_Top > 0) {
        animationDom.addClass(addClassName);
    } else {
        animationDom.removeClass(addClassName);
    }
}
/**
 *   获取随机数
 *   min - 传入需要做的随机数的区间(包含) int类型 
 *   max - 传入需要做的随机数的区间(包含) int类型
 **/
function randomNumber(min, max) {
    var range = max - min;
    var rand = Math.random();
    return (min + Math.round(rand * range));
}
/**
 *   @yifan
 *   微信分享功能
 *   opt : object
 *   opt.shareTitle - 分享标题
 *   opt.shareContent - 分享文案
 *   opt.shareImg - 分享图片
 *   opt.shareUrl - 分享链接
 *   ps 依赖微信jssdk请先在页面顶部加载微信jssdk
 **/
function WXshare(opt, callback ,callbackopt) {
    if(!opt.shareImg){
        var str = "<div style='position:fixed;top:1000%;left:1000%;'>" + "<img src='/shop_wap/html/activity/images/hulunbuir/logo.jpeg'/>" +
        "</div>"
        document.getElementsByTagName('body')[0].children[0].innerHTML = str;
    }
    var infoContant = ["我看到了一个好东西，你快一起看看", "听说只有好看的人才能看到這个分享", "亲爱的，我看這个不错，你也来看看吧~"];
    var opation = {
        title: opt.shareTitle || "尖货不用淘－地道甄选",
        desc: opt.shareContent || infoContant[randomNumber(0, 2)],
        imgUrl: opt.shareImg || document.getElementsByTagName('body')[0].getElementsByTagName('img')[0].src,
        link: opt.shareUrl||window.location.href,
        success:function(){
            console.log(opt)
            if(typeof callback === 'function') callback(callbackopt);
        },
        cancel:function(){
            console.log('用户取消分享')
        } 
    };
    
    $.ajax({
        url: 'http://api.didao-zx.com/shop/data/wechat',
        type: 'POST',
        dataType: 'json',
        cache:false,
        data: {
            share_url: window.location.href
        },
        success: function(data) {
            if (data.appId) {
                var share = opation;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见附录1
                    jsApiList: data.jsApiList||[
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'onMenuShareQZone',
                    'startRecord',
                    'stopRecord',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'onVoicePlayEnd',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'translateVoice',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard',
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function() {
                    wx.onMenuShareTimeline(share);
                    wx.onMenuShareAppMessage(share);
                    wx.onMenuShareQQ(share);
                    wx.onMenuShareWeibo(share);
                });
            }
        }
    });
};
// 商城头部公告系统
// var shop_announcement = function(){};
/*
 *   商城顶部通告组件
 *   content 商城公告内容 string
 *   link    跳转链接 string
 */
var announcement = (function() {
    function _init(content, link, options) {
        var c = content || "商城公告：";
        c = link?"<a href="+link+" style='display:inline; color:#fd7708;'>"+c+"<span class='iconfont icon-more-copy' style='margin-left:0.06rem;'></span></a>":c;
        var domStr = "<div id='' style='position:fixed; z-index:99; top:0; left:0; width:100%; height:0.5rem; font-size:0.24rem; line-height:0.5rem; text-align:center; background:#f7efcf; color:#fd7708;'>" +
            c +" <span id='closeAnnouncement' class='iconfont icon-delete' style='float:right;font-size:0.48rem;line-height:0.5rem;color:#000;'></span></div>";
        var dom = document.createElement("div");
        dom.setAttribute('id', 'announcement');
        dom.innerHTML = domStr;
        document.getElementsByTagName('body')[0].appendChild(dom);
        document.getElementById('closeAnnouncement').onclick = function() {
            _hide();
        }

    };

    function _show(massage, link, opt) {
        _init(massage, link, opt);
        if (opt && opt.outTime) {
            var outtime = setTimeout(function() {
                _hide();
                clearInterval(outtime);
            }, opt.time || 5000);
        }

    };

    function _hide() {
        document.getElementById('announcement').style.display = 'none';
    };
    return {
        show: _show,
        hide: _hide,
    }
})();

    //修正title
$(function() {
    //百度统计
    var _hmt = _hmt || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?0cd69c5286cdf2c64656f1b21f731f16";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?fa9529cfb3973d91f27d45cf36f5269a";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
});
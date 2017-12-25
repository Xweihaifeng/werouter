var pagesize = pagesize;
var curpage = 1;
var hasMore = true;
var firstRow = 0;
var footer = false;
var reset = true;
var orderKey = "";
var currentBar = "all";
var isClear = false;
var timeArr = [];
//alert(56);
$(function () {
    var e = getCookie("key");
    //checkLogin(2)
    if (getQueryString("data-state") != "") {
        var text = $('a[data-state="' + getQueryString("data-state") + '"]')[0].innerText;//页面进入时选中的tab
        $("#filtrate_ul").find("li").has('a[data-state="' + getQueryString("data-state") + '"]').addClass("selected").siblings().removeClass("selected");

    }
    $("#search_btn").click(function () {
        reset = true;
        t()
    });
    $("#fixed_nav").waypoint(function () {
        $("#fixed_nav").toggleClass("fixed")
    }, {offset: "50"});
    $(window).scroll(function ()
    {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 1)
        {
            t()
        }
    });
    function t() {
        if (reset) {
            curpage = 1;
            hasMore = true
        }
        $(".loading").remove();
        if (!hasMore) {
            return false
        }
        hasMore = false;
        var t = $("#filtrate_ul").find(".selected").find("a").attr("data-state");
        currentBar = t;
        var r = $("#order_key").val();
        /*g.ajax({
            type: "post",
            url: ApiUrl + "index.php?ctl=Buyer_Order&met=physical&typ=json&pagesize=" + pagesize + "&curpage=" + curpage,
            data: {k: e, u: getCookie('id'), status: t, key: r},
            dataType: "json",
            success: function (e) {
                for(var i=0;i<e.data.items.length;i++){
                    var ordertime = e.data.items[i].order_create_time;
                    if(Date.parse(new Date(ordertime))){   
                        var timestamp = Date.parse(new Date(ordertime))/ 1000; //2017-11-03 14:43:50,
                    }else{                      
                        var timestamp=Date.parse(ordertime.replace(/-/g,'/'))/1000;//转换成2017/11/03 14:43:50再解析
                    }
                    var nowtime = (Date.parse(new Date()))/1000;
                    var differtime = nowtime - timestamp;
                    e.data.items[i].differtime= differtime;
                }
                curpage++;
                if (e.data.page < e.data.total) {
                    hasMore = true;
                }
                else {
                    hasMore = false;
                }
                if (!hasMore) {
                    get_footer()
                }
                if (e.data.items.length <= 0) {
                    $("#footer").addClass("posa")
                } else {
                    $("#footer").removeClass("posa")
                }
                var t = e;
                t.WapSiteUrl = WapSiteUrl;
                t.ApiUrl = ApiUrl;
                t.key = getCookie("key");
                template.helper("$getLocalTime", function (e) {
                    var t = new Date(parseInt(e) * 1e3);
                    var r = "";
                    r += t.getFullYear() + "年";
                    r += t.getMonth() + 1 + "月";
                    r += t.getDate() + "日 ";
                    r += t.getHours() + ":";
                    r += t.getMinutes();
                    return r
                });
                template.helper("p2f", function (e) {
                    return (parseFloat(e) || 0).toFixed(2)
                });
                template.helper("parseInt", function (e) {
                    return parseInt(e)
                });
                if (t.data.items.length) {
                }
                var r = template.render("order-list-tmpl", t);
                if (reset) {
                    reset = false;
                    $("#order-list").html(r)
                } else {
                    $("#order-list").append(r)
                }
                for (k in timeArr) {
                    clearInterval(timeArr[k]);
                }
                if ($(".待付款").length > 0) {
                    $(".待付款").each(function () {
                        var orderCt = $(this).attr("data-orderCt");
                        var orderId = $(this).attr("orderId");
                        console.log(orderId);
                        Timer(orderCt, $(this), orderId);
                    });
                }
            }
        })*/
    }
    function Timer(e, pr, orderId) {
        var oldTime = e.replace(/-/g, "/");
        var data = new Date().getTime();
        var date2 = new Date(oldTime).getTime();
        var intDiff = parseInt(3600 - (data - date2) / (1000));    //倒计时总秒数量
        // var intDiff = parseInt(5);
        function mytimer(intDiff) {
            var timer1 = window.setInterval(function () {
                var day = 0,
                    hour = 0,
                    minute = 0,
                    second = 0;//时间默认值
                if (intDiff > 0) {
                    //计算相关的天，小时，还有分钟，以及秒
                    day = Math.floor(intDiff / (60 * 60 * 24));
                    hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
                    minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                }
                if (minute <= 9) hour = '0' + hour;
                if (minute <= 9) minute = '0' + minute;
                if (second <= 9) second = '0' + second;
                //$('#day_show').html(day );
                //pr.find('.hour_show').html('<s></s>' + hour);
                pr.find('.minute_show').html('<s></s>' + minute);
                pr.find('.second_show').html('<s></s>' + second);
                intDiff--;
                if (pr.find('.minute_show').text() == '00' && pr.find('.second_show').text() == '00') {
                    clearInterval(timer1);
                    reset = true;
                    t();
                }
            }, 1000);
            timeArr.push(timer1);
        }
        mytimer(intDiff);
    }

    $("#order-list").on("click", ".cancel-order", r);
    $("#order-list").on("click", ".delete-order", o);
    $("#order-list").on("click", ".sure-order", n);
    $("#order-list").on("click", ".evaluation-order", l);
    $("#order-list").on("click", ".evaluation-again-order", d);
    $("#order-list").on("click", ".viewdelivery-order", c);
    $("#order-list").on("click", ".refund-order", re);
    $("#order-list").on("click", ".check-payment", function () {
        try {
            _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '付款点击']);
        } catch (e) {
        }
        var e = $(this).attr("data-paySn");
        toPay(e, "member_buy", "pay");
        return false
    });
    function r() {
        var e = $(this).attr("order_id");
        try {
            _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '取消订单点击']);
        } catch (e) {
        }
        $.sDialog({
            content: "确定取消订单？",
            okFn: function () {
                a(e);
                try {
                    _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '取消订单点击', '确认']);
                } catch (e) {
                }
            },
            cancelFn: function () {
                try {
                    _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '取消订单点击', '取消']);
                } catch (e) {
                }
            }
        })
    }

    function a(r) {
        g.ajax({
            type: "post",
            url: ApiUrl + "index.php?ctl=Buyer_Order&met=orderCancel&typ=json",
            data: {order_id: r, k: e, u: getCookie('id'), user: 'buyer'},
            dataType: "json",
            success: function (e) {
                if (e.status == 200) {
                    reset = true;

                    //t();
                    console.log(currentBar);
                    if (currentBar == "all") {
                        $("[orderid='" + r + "']").prev().text("交易关闭");
                        $("[orderid='" + r + "']").parents("li").find(".handle").html("");
                        $("[orderid='" + r + "']").remove();
                    } else {
                        $("[orderid='" + r + "']").parents("li").remove();
                        if ($(".待付款").length == 0) {
                            $("#otherGo").css("display", "block");
                        }
                    }
                    try {
                        _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '取消订单点击', '确认', '操作成功']);
                    } catch (e) {
                    }
                } else {


                    try {
                        _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '取消订单点击', '确认', '操作失败']);
                    } catch (e) {
                    }
                }
            }
        })
    }

    function o() {
        var e = $(this).attr("order_id");
        $.sDialog({
            content: "确定要删除订单吗", okFn: function () {
                i(e)
            }
        })
    }

    function i(r) {
        g.ajax({
            type: "post",
            url: ApiUrl + "index.php?ctl=Buyer_Order&met=hideOrder&typ=json",
            data: {order_id: r, k: e, u: getCookie('id'), user: 'buyer'},
            dataType: "json",
            success: function (e) {
                if (e.status == 200) {
                    reset = true;
                    t()
                } else {
                    $.sDialog({skin: "red", content: "操作失败！", okBtn: false, cancelBtn: false})
                }
            }
        })
    }

    function n() {
        var e = $(this).attr("order_id");
        try {
            _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '确认收货点击']);
        } catch (e) {
        }
        $.sDialog({
            content: "确定收到了货物吗？",
            okFn: function () {
                s(e)
            },
            cancelFn: function () {
                try {
                    _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '确认收货', '取消']);
                } catch (e) {
                }
            }
        })
    }
    function s(r) {
        g.ajax({
            type: "post",
            url: ApiUrl + "/index.php?ctl=Buyer_Order&met=confirmOrder&typ=json",
            data: {order_id: r, k: e, u: getCookie('id')},
            dataType: "json",
            success: function (e) {
                if (e.status == 200) {
                    try {
                        _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '确认收货', '确认']);
                    } catch (e) {
                    }
                    reset = true;
                    t()
                    location.href = WapSiteUrl + "/tmpl/member/order_success.html?order_id=" + r;
                } else {
                    $.sDialog({skin: "red", content: "操作失败！", okBtn: false, cancelBtn: false})
                }
            }
        })
    }

    function re() {
        var e = $(this).attr("order_id");
        location.href = WapSiteUrl + "/tmpl/member/refund_all.html?order_id=" + e
    }

    function l() {
        try {
            _maq.trigger(['_trackEvent', "马上评价"]);
        } catch (e) {
        }

        var e = $(this).attr("order_id");
        location.href = WapSiteUrl + "/tmpl/member/member_evaluation.html?order_id=" + e
    }

    function d() {
        var e = $(this).attr("order_id");
        location.href = WapSiteUrl + "/tmpl/member/member_evaluation_again.html?order_id=" + e
    }

    function c() {
        try {
            _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '查看物流']);
        } catch (e) {
        }
        var e = $(this).attr("order_id");
        var express_id = $(this).attr("express_id");
        var express_name = $(this).attr("express_name");
        var shipping_code = $(this).attr("shipping_code");
        var nowtime= $(this).attr("nowtimes");
        var order_time = $(this).attr("order_time");
        location.href = WapSiteUrl + "tmpl/member/order_delivery.v201712061234.html?order_id=" + e + '&express_id=' + express_id + '&express_name=' + express_name + '&shipping_code=' + shipping_code;
    }

    $("#filtrate_ul").find("a").click(function () {
        $("#filtrate_ul").find("li").removeClass("selected");
        $(this).parent().addClass("selected").siblings().removeClass("selected");
        reset = true;
        window.scrollTo(0, 0);
        t();
        try {
            _maq.trigger(['_trackEvent', $('.selected').text()]);//切换tab埋点
        } catch (e) {
        }
    });
    t();
    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 1) {
            //t()
        }
    })
});
$('.nctouch-order-list').on('click', '.nctouch-norecord .btn', function () {
    try {
        _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '随便逛逛点击']);
    } catch (e) {
    }
});
$('.nctouch-order-list').on('click', '.kefu', function () {
    try {
        _maq.trigger(['_trackEvent', $('.selected')[0].innerText, '联系客服']);
    } catch (e) {
    }
    window.location.href = 'http://m.didao-zx.com/shop_wap/tmpl/order/service.html';
});

function get_footer() {
    if (!footer) {
        footer = true;
        $.ajax({url: "js/footer.js", dataType: "script"})
    }
}
window.payOrder = function (uo, o) {
    //判断有没有支付单号，如果没有支付单号就去支付中心生成支付单号，如果有直接支付
    if (uo) {
        location.href = WapSiteUrl + "tmpl/order/pay.html?uorder=" + uo;
    }
    else {
        g.ajax({
            url: ApiUrl + '?ctl=Buyer_Order&met=addUorder&typ=json',
            data: {order_id: o, k: key, u: getCookie('id')},
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            async: false,
            success: function (a) {
                // console.info(a);
                if (a.status == 200) {
                    location.href = PayCenterWapUrl + "?ctl=Info&met=pay&uorder=" + a.data.uorder;
                }
                else {
                    if (a.msg != 'failure') {
                        $.sDialog({skin: "red", content: a.msg, okBtn: false, cancelBtn: false})
                    } else {
                        $.sDialog({skin: "red", content: '订单支付失败！', okBtn: false, cancelBtn: false})
                    }
                }
            },
            failure: function (a) {
                $.sDialog({skin: "red", content: '操作失败！', okBtn: false, cancelBtn: false})
            }
        });
    }
}
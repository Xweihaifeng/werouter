var key = getCookie('key');
// buy_stop2使用变量
var ifcart = getQueryString('ifcart');
if (ifcart == 1) {
    var cart_id = getQueryString('cart_id');
    cart_id = cart_id.split(',');
} else {
    var cart_id = getQueryString("goods_id") + '|' + getQueryString("buynum");
}
var pay_name = 'online';
var invoice_id = 0;
var address_id, vat_hash, offpay_hash, offpay_hash_batch, voucher, pd_pay, password, fcode = '', rcb_pay, rpt, payment_code;
var message = {};
// change_address 使用变量
var freight_hash, city_id, area_id, province_id
// 其他变量
var area_info;
var goods_id;
var buy_able;

var clickOnce = true;

function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
$(function () {
        /**
         * @author lanxuanang
         * 详情页点击领取红包弹出框
         */
        var page = pagesize;
        var curpage = 1;
        var firstRow = 0;
        var hasmore = true;
        var grade = getQueryString("level");
        var require_once = false;

        var myolderTt = 0;
        var myoldTt = 0;
        var myTt = 0;
        var myLmit = 0;
        var myRp = 0;
        var myTitle = "";
        var currentTag = "num0";
        var currentTag2 = "num0";

        var rpid = "";

        var clickFlg = true;

        template.helper('manjian', function (par1, par2) {
            var endPri = "满" + parseInt(par1) + "减" + parseInt(par1);
            return endPri;
        });


        template.helper('spshu', function (par1, par2) {
            var endPri = par1 + parseInt(par2);
            return endPri;
        });

        /**
         * @author lanxuanang
         * @param myRp 优惠金额
         * @param myLmit 最低优惠限制
         */
        function sT(myRp, myLmit) {
            //if (myRp != 0 && myoldTt >= myLmit) {
            myoldTt = myoldTt - myRp;
            //}

            if (myoldTt <= 0) {
                myoldTt = 0
            }

            if (!isIntegral) {
                $('#totalPayPrice').html(myoldTt.toFixed(2));
            }
            myoldTt = myolderTt;
        }

        var isIntegral = getQueryString("isIntegral");

        // 地址列表
        $('#list-address-valve').click(function () {
            var address_id = $(this).find("#address_id").val();
            g.ajax({
                type: 'post',
                url: ApiUrl + "index.php?ctl=Buyer_Cart&met=confirm&typ=json",
                data: {k: key, u: getCookie('id'), product_id: cart_id},
                dataType: 'json',
                async: false,
                success: function (result) {
                    if (result.data.address == null) {
                        return false;
                    }
                    //console.info(result);
                    var data = result.data;
                    data.address_id = address_id;
                    var html = template.render('list-address-add-list-script', data);
                    $("#list-address-add-list-ul").html(html);
                }
            });
        });
        $.animationLeft({
            valve: '#list-address-valve',
            wrapper: '#list-address-wrapper',
            scroll: '#list-address-scroll'
        });

        // 地区选择
        $('#list-address-add-list-ul').on('click', 'li', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            eval('address_info = ' + $(this).attr('data-param'));
            _init(address_info.user_address_id);
            //console.info(address_info);
            $('#true_name').html(address_info.user_address_contact);
            $('#mob_phone').html(address_info.user_address_phone);
            $('#address').html(address_info.user_address_area + address_info.user_address_address);
            $("#address_id").val(address_info.user_address_id);
            $('#list-address-wrapper').find('.header-l > a').click();
        });

        // 地址新增
        $.animationLeft({
            valve: '#new-address-valve',
            wrapper: '#new-address-wrapper',
            scroll: ''
        });
        // 支付方式
        $.animationLeft({
            valve: '#select-payment-valve',
            wrapper: '#select-payment-wrapper',
            scroll: ''
        });

        // 地区选择
        $('#new-address-wrapper').on('click', '#varea_info', function () {
            //var data = JSON.parse('{"items":[{"district_id":"1","district_name":"北京","district_parent_id":"0","district_displayorder":"0","district_region":"华北","district_is_level":"1","district_is_leaf":"0","id":"1","parent_id":"0","name":"北京","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"20","district_name":"广西","district_parent_id":"0","district_displayorder":"0","district_region":"华南","district_is_level":"1","district_is_leaf":"0","id":"20","parent_id":"0","name":"广西","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"21","district_name":"海南","district_parent_id":"0","district_displayorder":"0","district_region":"华南","district_is_level":"1","district_is_leaf":"0","id":"21","parent_id":"0","name":"海南","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"22","district_name":"重庆","district_parent_id":"0","district_displayorder":"0","district_region":"西南","district_is_level":"1","district_is_leaf":"0","id":"22","parent_id":"0","name":"重庆","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"23","district_name":"四川","district_parent_id":"0","district_displayorder":"0","district_region":"西南","district_is_level":"1","district_is_leaf":"0","id":"23","parent_id":"0","name":"四川","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"24","district_name":"贵州","district_parent_id":"0","district_displayorder":"0","district_region":"西南","district_is_level":"1","district_is_leaf":"0","id":"24","parent_id":"0","name":"贵州","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"25","district_name":"云南","district_parent_id":"0","district_displayorder":"0","district_region":"西南","district_is_level":"1","district_is_leaf":"0","id":"25","parent_id":"0","name":"云南","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"26","district_name":"西藏","district_parent_id":"0","district_displayorder":"0","district_region":"西南","district_is_level":"1","district_is_leaf":"0","id":"26","parent_id":"0","name":"西藏","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"27","district_name":"陕西","district_parent_id":"0","district_displayorder":"0","district_region":"西北","district_is_level":"1","district_is_leaf":"0","id":"27","parent_id":"0","name":"陕西","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"28","district_name":"甘肃","district_parent_id":"0","district_displayorder":"0","district_region":"西北","district_is_level":"1","district_is_leaf":"0","id":"28","parent_id":"0","name":"甘肃","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"29","district_name":"青海","district_parent_id":"0","district_displayorder":"0","district_region":"西北","district_is_level":"1","district_is_leaf":"0","id":"29","parent_id":"0","name":"青海","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"30","district_name":"宁夏","district_parent_id":"0","district_displayorder":"0","district_region":"西北","district_is_level":"1","district_is_leaf":"0","id":"30","parent_id":"0","name":"宁夏","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"31","district_name":"新疆","district_parent_id":"0","district_displayorder":"0","district_region":"西北","district_is_level":"1","district_is_leaf":"0","id":"31","parent_id":"0","name":"新疆","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"32","district_name":"台湾","district_parent_id":"0","district_displayorder":"0","district_region":"港澳台","district_is_level":"1","district_is_leaf":"0","id":"32","parent_id":"0","name":"台湾","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"33","district_name":"香港","district_parent_id":"0","district_displayorder":"0","district_region":"港澳台","district_is_level":"1","district_is_leaf":"0","id":"33","parent_id":"0","name":"香港","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"34","district_name":"澳门","district_parent_id":"0","district_displayorder":"0","district_region":"港澳台","district_is_level":"1","district_is_leaf":"0","id":"34","parent_id":"0","name":"澳门","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"35","district_name":"海外","district_parent_id":"0","district_displayorder":"0","district_region":"海外","district_is_level":"1","district_is_leaf":"0","id":"35","parent_id":"0","name":"海外","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"19","district_name":"广东","district_parent_id":"0","district_displayorder":"0","district_region":"华南","district_is_level":"1","district_is_leaf":"0","id":"19","parent_id":"0","name":"广东","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"18","district_name":"湖南","district_parent_id":"0","district_displayorder":"0","district_region":"华中","district_is_level":"1","district_is_leaf":"0","id":"18","parent_id":"0","name":"湖南","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"2","district_name":"天津","district_parent_id":"0","district_displayorder":"0","district_region":"华北","district_is_level":"1","district_is_leaf":"0","id":"2","parent_id":"0","name":"天津","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"3","district_name":"河北","district_parent_id":"0","district_displayorder":"0","district_region":"华北","district_is_level":"1","district_is_leaf":"0","id":"3","parent_id":"0","name":"河北","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"4","district_name":"山西","district_parent_id":"0","district_displayorder":"0","district_region":"华北","district_is_level":"1","district_is_leaf":"0","id":"4","parent_id":"0","name":"山西","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"5","district_name":"内蒙古","district_parent_id":"0","district_displayorder":"0","district_region":"华北","district_is_level":"1","district_is_leaf":"0","id":"5","parent_id":"0","name":"内蒙古","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"6","district_name":"辽宁","district_parent_id":"0","district_displayorder":"0","district_region":"东北","district_is_level":"1","district_is_leaf":"0","id":"6","parent_id":"0","name":"辽宁","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"7","district_name":"吉林","district_parent_id":"0","district_displayorder":"0","district_region":"东北","district_is_level":"1","district_is_leaf":"0","id":"7","parent_id":"0","name":"吉林","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"8","district_name":"黑龙江","district_parent_id":"0","district_displayorder":"0","district_region":"东北","district_is_level":"1","district_is_leaf":"0","id":"8","parent_id":"0","name":"黑龙江","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"9","district_name":"上海","district_parent_id":"0","district_displayorder":"0","district_region":"华东","district_is_level":"1","district_is_leaf":"0","id":"9","parent_id":"0","name":"上海","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"10","district_name":"江苏","district_parent_id":"0","district_displayorder":"0","district_region":"华东","district_is_level":"1","district_is_leaf":"0","id":"10","parent_id":"0","name":"江苏","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"11","district_name":"浙江","district_parent_id":"0","district_displayorder":"0","district_region":"华东","district_is_level":"1","district_is_leaf":"0","id":"11","parent_id":"0","name":"浙江","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"12","district_name":"安徽","district_parent_id":"0","district_displayorder":"0","district_region":"华东","district_is_level":"1","district_is_leaf":"0","id":"12","parent_id":"0","name":"安徽","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"13","district_name":"福建","district_parent_id":"0","district_displayorder":"0","district_region":"华南","district_is_level":"1","district_is_leaf":"0","id":"13","parent_id":"0","name":"福建","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"14","district_name":"江西","district_parent_id":"0","district_displayorder":"0","district_region":"华东","district_is_level":"1","district_is_leaf":"0","id":"14","parent_id":"0","name":"江西","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"15","district_name":"山东","district_parent_id":"0","district_displayorder":"0","district_region":"华东","district_is_level":"1","district_is_leaf":"0","id":"15","parent_id":"0","name":"山东","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"16","district_name":"河南","district_parent_id":"0","district_displayorder":"0","district_region":"华中","district_is_level":"1","district_is_leaf":"0","id":"16","parent_id":"0","name":"河南","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"17","district_name":"湖北","district_parent_id":"0","district_displayorder":"0","district_region":"华中","district_is_level":"1","district_is_leaf":"0","id":"17","parent_id":"0","name":"湖北","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":false},{"district_id":"45056","district_name":"","district_parent_id":"0","district_displayorder":"0","district_region":"","district_is_level":"1","district_is_leaf":"0","id":"45056","parent_id":"0","name":"","level":1,"district_level":1,"district_icon":"ui-icon-star","expanded":false,"loaded":false,"is_leaf":true}]}')
            $.areaSelected({
                success: function (data) {
                    //console.info(data);
                    province_id = data.area_id_1;
                    city_id = data.area_id_2;
                    area_id = data.area_id_3;
                    area_info = data.area_info;
                    $('#varea_info').val(data.area_info);
                }
            });
        });

        //增值税发票中的地区选择
        $('#invoice-list').on('click', '#invoice_area_info', function () {
            $.areaSelected({
                success: function (a) {
                    $("#invoice_area_info").val(a.area_info).attr({
                        "data-areaid1": a.area_id_1,
                        "data-areaid2": a.area_id_2,
                        "data-areaid3": a.area_id_3,
                        "data-areaid": a.area_id,
                        "data-areaid2": a.area_id_2 == 0 ? a.area_id_1 : a.area_id_2
                    })
                }
            });
        });

        // 发票
        $.animationLeft({
            valve: '#invoice-valve',
            wrapper: '#invoice-wrapper',
            scroll: ''
        });

        //购买数量，减
        $(".minus").click(minusBuyNum);
        //购买数量加
        $(".add").click(addBuyNum);
        //购买数量减
        function minusBuyNum() {
            var self = this;
            editQuantity(self, "minus");
        }

        //购买数量加
        function addBuyNum() {
            var self = this;
            editQuantity(self, "add");
        }

        //购买数量增或减，请求获取新的价格
        function editQuantity(self, type) {
            var sPrents = $(self).parents(".cart-litemw-cnt");
            var cart_id = sPrents.attr("cart_id");
            var numInput = sPrents.find(".buy-num");
            var goodsPrice = sPrents.find(".goods-price");
            var buynum = Math.abs(parseInt(numInput.val()));
            var quantity = 1;
            if (type == "add") {
                quantity = parseInt(buynum + 1);
            } else {
                if (buynum > 1) {
                    quantity = parseInt(buynum - 1);
                } else {
                    return false;
                }
            }
            $('.pre-loading').removeClass('hide');
            g.ajax({
                url: ApiUrl + "/index.php?ctl=Buyer_Cart&met=editCartNum&typ=json",
                type: "post",
                data: {k: key, u: getCookie('id'), cart_id: cart_id, num: quantity},
                dataType: "json",
                success: function (res) {
                    console.info(res);
                    if (res.status == 200) {
                        numInput.val(quantity);
                        /*goodsPrice.html('￥<em>' + res.data.price + '</em>');*/
                        calculateTotalPrice();
                    } else {
                        $.sDialog({
                            skin: "red",
                            content: res.msg,
                            okBtn: false,
                            cancelBtn: false
                        });
                    }
                    $('.pre-loading').addClass('hide');
                }
            });
        }

        template.helper('isEmpty', function (o) {
            var b = true;
            $.each(o, function (k, v) {
                b = false;
                return false;
            });
            return b;
        });

        template.helper('pf', function (o) {
            return parseFloat(o) || 0;
        });

        template.helper('p2f', function (o) {
            return (parseFloat(o) || 0).toFixed(2);
        });


        var _init = function (address_id) {


            var totals = 0;
            var gptotl = 0;
            var cptotal = 0;
            var vototal = 0;
            // 购买第一步 提交

            g.ajax({//提交订单信息
                type: 'post',
                url: ApiUrl + 'index.php?ctl=Buyer_Cart&met=confirm&typ=json',
                dataType: 'json',
                data: {k: key, u: getCookie('id'), product_id: cart_id, ifcart: ifcart, address_id: address_id},
                success: function (result) {
                    if (result.data.cost.length < 1) {
                        location.href = WapSiteUrl + "tmpl/member/order_list.html";
                    }
                    if (result.status == 250) {
                        $.sDialog({
                            skin: "red",
                            content: result.data.msg,
                            okBtn: false,
                            cancelBtn: false
                        });
                        return false;
                    }

                    if (result.data.user_rate == 0) {
                        result.data.user_rate = 100;
                    }
                    result.data.user_rate = 100;
                    // 商品数据
                    result.data.address_id = address_id;
                    result.data.WapSiteUrl = WapSiteUrl;
                    delete result.data.glist.count;
                    /**
                     * @author lanxuanang
                     */
                    template.helper('dingP', function (o, o2) {
                        if (o2.indexOf(o) != -1) {
                            return true;
                        } else {
                            return false;
                        }

                    });
                    template.helper('dingS', function (o, o2) {

                        if (o2.indexOf(o) != -1) {
                            return true;
                        } else {
                            return false;
                        }

                    });

                    // result.data.spc = {
                    //     "cmd_id": -140,
                    //     "status": 200,
                    //     "msg": "success",
                    //     "data": {
                    //         "category": ["1", "6"],
                    //         "goods": ["1655", "1656", "1657", "1658", "1659", "1655", "1540", "1632", "1658", "1659", "294","23"]
                    //     }
                    // };

                    $.getJSON(ApiUrl + "index.php?ctl=RedPacket&met=getSpecialRedpacketList&typ=json", function (result2) {
                        console.log(result);
                        result.data.spc = result2;
                        // result.data.spc = {
                        //     "cmd_id": -140,
                        //     "status": 200,
                        //     "msg": "success",
                        //     "data": {
                        //         "category": ["1", "6"],
                        //         "goods": ["1655", "1656", "1657", "1658", "1659", "1655", "1540", "1632", "1658", "1659", "294","23"]
                        //     }
                        // };


                        var html = template.render('goods_list', result.data);
                        $("#deposit").html(html);


                        buy_able = result.data.buy_able;


                        for (var i = 0; i < result.data.glist.length; i++) {
                            $.animationUp({
                                valve: '.animation-up' + i,          // 动作触发，为空直接触发
                                wrapper: '.nctouch-bottom-mask' + i,    // 动作块
                                scroll: '.nctouch-bottom-mask-rolling' + i    // 滚动块，为空不触发滚动
                            });
                        }


                        // 默认地区相关
                        if ($.isEmptyObject(result.data.address)) {
                            $.sDialog({
                                skin: "block",
                                content: '请添加地址',
                                okFn: function () {
                                    $('#new-address-valve').click();
                                },
                                cancelFn: function () {
                                    history.go(-1);
                                }
                            });
                            return false;
                        }


                        insertHtmlAddress(result.data.address, address_id);

                        // 代金券
                        voucher = '';
                        voucher_temp = [];
                        for (var k in result.data.glist.voucher_base) {
                            voucher_temp.push([result.data.glist.voucher_base[k].voucher_t_id + '|' + k + '|' + result.data.glist.voucher_base[k].voucher_price]);
                        }
                        voucher = voucher_temp.join(',');
                        // console.info(voucher);
                        for (var k in result.data.glist) {
                            var voucher_price = 0;
                            var voucher_id = 0;
                            allprice = parseFloat(result.data.glist[k].sprice) + parseFloat(result.data.cost[k].cost);
                            if (allprice < 0) {
                                allprice = 0
                            }
                            $('#storeTotal' + k).html(allprice.toFixed(2));
                            $('#storeFreight' + k).html(result.data.cost[k].cost);
                            totals += parseFloat(result.data.glist[k].sprice + result.data.cost[k].cost);
                            gptotl += parseFloat(result.data.glist[k].sprice);
                            cptotal += parseFloat(result.data.cost[k].cost);
                            vototal += voucher_price;
                            // 留言
                            message[k] = '';
                            $('#storeMessage' + k).on('change', function () {
                                message[k] = $(this).val();
                            });
                        }
                        // 红包
                        rcb_pay = 0;
                        rpt = '';
                        var rptPrice = 0;
                        password = '';
                        if (result.data.rpt_info) {
                            rpt = result.data.rpt_info.redpacket_id + '|' + parseFloat(result.data.rpt_info.redpacket_price);
                        }
                        // 计算总价
                        var total_price = totals;
                        if (total_price <= 0) {
                            total_price = 0;
                        }
                        if (cptotal <= 0) {
                            cptotal = 0;
                        }
                        if (gptotl <= 0) {
                            gptotl = 0;
                        }
                        $('#totalPrice,#onlineTotal').html(total_price.toFixed(2));
                        var total_rate_price = cptotal + ((gptotl * result.data.user_rate) / 100) - vototal;
                        /**
                         * @author lanxuanang 给myTt赋值
                         * @type {number}
                         */
                        myolderTt = total_rate_price;
                        myoldTt = total_rate_price;
                        myTt = total_rate_price;
                        /**
                         *  20170418  无红包异常处理
                         *
                         * **/
                        if (!result.data.rpt_info) {
                            $('#totalPayPrice').html(total_rate_price.toFixed(2));
                        }
                        /**
                         * @author lanxuanang
                         */
                        if (result.data.rpt_list.length > 0) {
                            var html = template.render("red_packet_html2", result.data);
                            $("body").after(html);
                            addRedList();
                            $('#rptInfo').css('color', '#f6887c');
                            $("#rptVessel").find("span").html(result.data.rpt_list[0].redpacket_title);
                            $("#rptInfo").html("优惠:-" + result.data.rpt_list[0].redpacket_price + "元");
                            myYouHui = 0;
                            myLmit = Number(result.data.rpt_list[0].redpacket_t_orderlimit);
                            myRp = Number(result.data.rpt_list[0].redpacket_price);
                            myTitle = result.data.rpt_list[0].redpacket_title;
                            rpid = result.data.rpt_list[0].redpacket_id;
                            myTt = myTt - myRp;
                            if (!isIntegral) {
                                $('#totalPayPrice').html(myTt.toFixed(2));
                            }
                        } else {
                            $('#totalPayPrice').html(myTt.toFixed(2));
                            $("#rptVessel").find("span").html("平台红包");
                            $("#rptInfo").html("无可用红包");
                        }
                        var rate_price = gptotl * (100 - result.data.user_rate) / 100;
                        $("#ratePrice").html(rate_price.toFixed(2));
                        $(".rate-money").show();
                    })
                }
            });
        }
        rcb_pay = 0;
        pd_pay = 0;
        // 初始化
        _init();
        /**
         * lanxuanang
         * 给红包列表添加点击事件
         */
        function addRedList() {
            $.animationUp({
                valve: '.getRed',          // 动作触发
                wrapper: '#red_packet_html',    // 动作块
                scroll: '#voucher_roll',  // 滚动块，为空不触发滚动
                start: function () {
                    $("body").css("overflow", "hidden");
                },
                close: function () {
                    $("body").css("overflow", "auto");

                }
            });
            $(".receive").on("click", "li", function () {
                myRp = Number($(this).data("rp"));
                myLmit = Number($(this).data("limit"));
                myTitle = $(this).data("title");
                rpid = $(this).data("rpid");
                currentTag = $(this).data("num");

                var len = $(this).siblings().find("span").length;
                for (var k = 0; k < len; k++) {
                    $(this).siblings().eq(k).find("span").last().removeClass("other")
                }
                $(this).children("span").last().addClass("other");
            });
            $(".sure").on("click", function () {
                currentTag2 = currentTag;
                $('#rptInfo').css('color', '#f6887c');
                $("#rptVessel").find("label").html('<input type="checkbox" class="checkbox" id="useRPT"><span>' + myTitle + '</span>');
                $("#rptInfo").html("优惠:-" + myRp + "元");
                sT(myRp, myLmit);
                if (rpid != 'undefined') {
                    rpt = rpid + '|' + parseFloat(myRp);
                } else {
                    rpt = "";
                }
                console.log(rpt);
                $('#red_packet_html').removeClass("up").addClass("down");
            });
            $(".nctouch-bottom-mask-close,.nctouch-bottom-mask-bg").on("click", function () {
                // currentTag = "num0";
                //currentTag=currentTag2;
                $('#red_packet_html').removeClass("up").addClass("down");
            });

            $(".getRed").on("click", function () {
                var now = "";
                now = currentTag2;
                var len = $(".receive li").length;
                for (var k = 0; k < len; k++) {
                    $(".receive li").eq(k).find("span").last().removeClass("other");
                }
                $("[data-num=" + now + "]").find("span").last().addClass("other");
                $('#red_packet_html').removeClass("down").addClass("up");
            })

        }

        // 插入地址数据到html
        var insertHtmlAddress = function (address, address_id) {
            // console.info(address);
            var address_info = {};
            for (var i = 0; i < address.length; i++) {
                if (address_id != undefined) {
                    if (address[i].user_address_id == address_id) {
                        //address_info.address_id = address[i].user_address_area_id;
                        address_info.address_id = address[i].user_address_id;
                        address_info.user_address_contact = address[i].user_address_contact;
                        address_info.provice_id = address[i].user_address_provice_id;
                        address_info.city_id = address[i].user_address_city_id;
                        address_info.area_id = address[i].user_address_area_id;
                        address_info.user_address_phone = address[i].user_address_phone;
                        address_info.user_address_area = address[i].user_address_area;
                        address_info.user_address_address = address[i].user_address_address;
                    }
                }
                else {
                    if (parseInt(address[i].user_address_default)) {
                        //address_info.address_id = address[i].user_address_area_id;
                        address_info.address_id = address[i].user_address_id;
                        address_info.user_address_contact = address[i].user_address_contact;
                        address_info.provice_id = address[i].user_address_provice_id;
                        address_info.city_id = address[i].user_address_city_id;
                        address_info.area_id = address[i].user_address_area_id;
                        address_info.user_address_phone = address[i].user_address_phone;
                        address_info.user_address_area = address[i].user_address_area;
                        address_info.user_address_address = address[i].user_address_address;
                    }
                }
            }

            if (!isEmptyObject(address_info)) {
                address_id = address_info.address_id;
                $('#true_name').html(address_info.user_address_contact);
                $('#mob_phone').html(address_info.user_address_phone);
                $('#address').html(address_info.user_address_area + address_info.user_address_address);
            }
            else {
                $('#address').html('未选择收货地址');
            }

            $("#address_id").val(address_id);
            area_id = address_info.area_id;
            city_id = address_info.city_id;
            province_id = address_info.provice_id;
            $('#ToBuyStep2').parent().addClass('ok');
        }

        // 支付方式选择
        // 在线支付
        $('#payment-online').click(function () {
            pay_name = 'online';
            $('#select-payment-wrapper').find('.header-l > a').click();
            $('#select-payment-valve').find('.current-con').html('在线支付');
            $("#pay-selected").val('1');
            $(this).addClass('sel').siblings().removeClass('sel');
        })
        // 货到付款
        $('#payment-offline').click(function () {
            pay_name = 'offline';
            $('#select-payment-wrapper').find('.header-l > a').click();
            $('#select-payment-valve').find('.current-con').html('货到付款');
            $("#pay-selected").val('2');
            $(this).addClass('sel').siblings().removeClass('sel');
        })

        // 地址保存
        $.sValid.init({
            rules: {
                vtrue_name: "required",
                vmob_phone: "required",
                varea_info: "required",
                vaddress: "required"
            },
            messages: {
                vtrue_name: "姓名必填！",
                vmob_phone: "手机号必填！",
                varea_info: "地区必填！",
                vaddress: "街道必填！"
            },
            callback: function (eId, eMsg, eRules) {
                if (eId.length > 0) {
                    var errorHtml = "";
                    $.map(eMsg, function (idx, item) {
                        errorHtml += "<p>" + idx + "</p>";
                    });
                    errorTipsShow(errorHtml);
                } else {
                    errorTipsHide();
                }
            }
        });
        $('#add_address_form').find('.btn').click(function () {
            if ($.sValid()) {
                var param = {};
                param.k = key;
                param.user_address_contact = $('#vtrue_name').val();
                if (!(/^1[34578]\d{9}$/.test($('#vmob_phone').val()))) {
                    $.sDialog({
                        skin: "red",
                        content: " 手机号码填写有误",
                        okBtn: false,
                        cancelBtn: false
                    });
                    return false;
                }
                param.user_address_phone = $('#vmob_phone').val();
                param.user_address_address = $('#vaddress').val();
                param.address_area = $('#varea_info').val();
                param.user_address_default = $('#is_default').val();
                param.province_id = province_id;
                param.city_id = city_id;
                param.area_id = area_id;
                if ($('#add_address_form').find('label').hasClass("checked")) {
                    param.user_address_default = 1;
                } else {
                    param.user_address_default = 0;
                }


                param.u = getCookie('id');

                g.ajax({
                    type: 'post',
                    url: ApiUrl + "/index.php?ctl=Buyer_User&met=addAddressInfo&typ=json",
                    data: param,
                    dataType: 'json',
                    success: function (result) {
                        //console.info(result);
                        if (result.status == 200) {
                            //param.address_id = result.data.address_id;
                            _init(result.data.user_address_id);
                            $('#true_name').html(result.data.user_address_contact);
                            $('#mob_phone').html(result.data.user_address_phone);
                            $('#address').html(result.data.user_address_area + result.data.user_address_address);
                            $("#address_id").val(result.data.user_address_id);
                            $('#new-address-wrapper,#list-address-wrapper').find('.header-l > a').click();
                        }
                    }
                });
            }
        });
        // 发票选择
        $('#invoice-noneed').click(function () {
            $(this).addClass('sel').siblings().removeClass('sel');
            $('#invoice_add,#invoice-list').hide();
            invoice_id = 0;
        });
        $('#invoice-need').click(function () {
            $(this).addClass('sel').siblings().removeClass('sel');
            $('#invoice_add').show();
            html = '<option value="明细">明细</option><option value="办公用品">办公用品</option><option value="电脑配件">电脑配件</option><option value="耗材">耗材</option>';
            $('#inc_content').append(html);
            //获取发票列表
            g.ajax({
                type: 'post',
                url: ApiUrl + '/index.php?ctl=Buyer_Cart&met=piao&typ=json',
                data: {k: key, u: getCookie('id')},
                dataType: 'json',
                success: function (result) {
                    checkLogin(1);
                    //console.info(result);
                    //console.info(result.data);
                    var html = template.render('invoice-list-script', result.data);
                    $('#invoice-list').html(html)
                    if (result.data.normal.length > 0) {
                        invoice_id = result.data.normal[0].invoice_id;
                    }
                }
            });
        })
        // 发票类型选择
        $('input[name="inv_title_select"]').click(function () {
            //增值税发票
            if ($(this).val() == 'increment') {
                $('#invoice-list>#addtax').show();
                $('#invoice-list>#electron').hide();
                $('#invoice-list>#normal').hide();

            } //电子发票
            else if ($(this).val() == 'electronics') {
                $('#invoice-list>#electron').show();
                $('#invoice-list>#normal').hide();
                $('#invoice-list>#addtax').hide();
            }//普通发票
            else {
                $('#invoice-list>#normal').show();
                $('#invoice-list>#electron').hide();
                $('#invoice-list>#addtax').hide();
            }
        });
        $('#invoice-div').on('click', '#invoiceNew', function () {
            invoice_id = 0;
            $('#invoice_normal_add').show();
        });
        $('#invoice-list').on('click', 'label', function () {
            invoice_id = $(this).find('input').val();
        });

        var add_invoice = function (e) {
            var result = "";
            g.ajax({
                type: 'post',
                url: ApiUrl + "?ctl=Buyer_Invoice&met=addInvoice&typ=json",
                data: e,
                dataType: "json",
                async: false,
                success: function (a) {
                    result = a;
                }
            });
            return result;
        }
        // 发票添加
        $('#invoice-div').find('.btn-l').click(function () {
            //选择需要发表按钮
            if ($('#invoice-need').hasClass('sel')) {
                //判断选择的发票类型
                invoice_type = $('#invoice_type').find(".checked").find("input[name='inv_title_select']").attr('id');
                //普通发票
                if (invoice_type == 'norm') {
                    //判断有没有新增的发票抬头
                    invoice_state = 1;
                    type = "普通发票";
                    if ($('#invoiceNew').hasClass('checked')) {
                        title = $("#invoice_normal_add").find("input[name='inv_normal_add_title']").val();
                        cont = $("#invoice_normal_add").find("#inv_normal_add_content").val();

                        var data = {
                            invoice_state: invoice_state,
                            invoice_title: title,
                            k: key, u: getCookie('id')
                        };

                        flag = add_invoice(data);
                    }
                    else {
                        title = $("#normal").find("#inc_normal_title").val();
                        cont = $("#normal").find("#inc_normal_content").val();
                        flag = {status: 200, data: {invoice_id: ''}}
                    }
                }

                //电子发票
                if (invoice_type == 'electronics') {
                    //将电子发票保存到数据库
                    type = '电子发票';
                    title = $("#electron").find('.checked').find("input[name='inv_ele_title']").val();
                    phone = $("#electron").find("input[name='inv_ele_phone']").val();
                    email = $("#electron").find("input[name='inv_ele_email']").val();
                    cont = $("#electron").find("#inc_content").val();
                    var data = {
                        invoice_state: '2',
                        invoice_title: title,
                        invoice_rec_phone: phone,
                        invoice_rec_email: email,
                        k: key, u: getCookie('id')
                    };

                    flag = add_invoice(data);
                }

                //增值税发票
                if (invoice_type == 'increment') {
                    //将增值税发票保存到数库中
                    type = '增值税发票';
                    title = $("#addtax").find("input[name='inv_tax_title']").val();
                    company = $("#addtax").find("input[name='inv_tax_title']").val();
                    code = $("#addtax").find("input[name='inv_tax_code']").val();
                    addr = $("#addtax").find("input[name='inv_tax_address']").val();
                    phone = $("#addtax").find("input[name='inv_tax_phone']").val();
                    ;
                    bname = $("#addtax").find("input[name='inv_tax_bank']").val();
                    bcount = $("#addtax").find("input[name='inv_tax_bankaccount']").val();
                    cname = $("#addtax").find("input[name='inv_tax_recname']").val();
                    cphone = $("#addtax").find("input[name='inv_tax_recphone']").val();
                    province = $("#addtax").find("input[name='invoice_tax_rec_province']").val();
                    caddr = $("#addtax").find("input[name='inv_tax_rec_addr']").val();

                    province_id = $("#addtax").find("input[name='invoice_tax_rec_province']").attr('data-areaid1');
                    city_id = $("#addtax").find("input[name='invoice_tax_rec_province']").attr('data-areaid2');
                    area_id = $("#addtax").find("input[name='invoice_tax_rec_province']").attr('data-areaid3');


                    cont = $("#addtax").find("#inc_tax_content").val();
                    var data = {
                        invoice_state: '3',
                        invoice_title: title,
                        invoice_company: company,
                        invoice_code: code,
                        invoice_reg_addr: addr,
                        invoice_reg_phone: phone,
                        invoice_reg_bname: bname,
                        invoice_reg_baccount: bcount,
                        invoice_rec_name: cname,
                        invoice_rec_phone: cphone,
                        invoice_rec_province: province,
                        invoice_province_id: province_id,
                        invoice_city_id: city_id,
                        invoice_area_id: area_id,
                        invoice_goto_addr: caddr,
                        k: key, u: getCookie('id')
                    };
                    flag = add_invoice(data);
                }

                if (flag.status == 200) {
                    $('#invContent').html(type + ' ' + title + ' ' + cont);
                    $("input[name='invoice_id']").val(flag.data.invoice_id);
                }
                else {
                    $.sDialog({
                        content: '操作失败',
                        okBtn: false,
                        cancelBtnText: '返回',
                        cancelFn: function () {
                        }
                    });
                }
            } else {
                $('#invContent').html('不需要发票');
            }
            $('#invoice-wrapper').find('.header-l > a').click();
        });


        // 支付
        $('#ToBuyStep2').click(function () {

            if (clickOnce) {
                clickOnce = false;
            } else {
                return false;
            }
            if (!buy_able) {
                $.sDialog({
                    content: '有部分商品配送范围无法覆盖您选择的地址，请更换其它商品！',
                    okBtn: false,
                    cancelBtnText: '返回',
                    cancelFn: function () {
                        history.back();
                    }
                });
            }

            if ($("#totalPayPrice").html() >= 99999999.99) {
                $.sDialog({
                    content: '订单金额过大，请分批购买！',
                    okBtn: false,
                    cancelBtnText: '返回',
                    cancelFn: function () {
                        history.back();
                    }
                });
                try {
                    _maq.trigger(['_trackEvent', "提交订单点击，提交失败：订单金额过大，请分批购买！"]);
                } catch (e) {
                }

            }

            //1.获取收货地址
            address_contact = $("#true_name").html();
            address_address = $("#address").html();
            address_phone = $("#mob_phone").html();
            address_id = $("#address_id").val();

            if (address_id == 'undefined') {
                $.sDialog({
                    skin: "red",
                    content: '请选择收货地址！',
                    okBtn: false,
                    cancelBtn: false
                });
                try {
                    _maq.trigger(['_trackEvent', "提交订单点击，提交失败：请选择收货地址！"]);
                } catch (e) {
                }
                clickOnce = true;
                return false;
            }


            //2.获取发票信息
            invoice = $("#invContent").html();
            invoice_id = $("input[name='invoice_id']").val();

            //3.获取商品信息（商品id，商品备注）
            var cart_id = [];//定义一个数组
            $("input[name='cart_id']").each(function () {
                cart_id.push($(this).val());//将值添加到数组中
            });

            var remark = [];
            var shop_id = [];
            $("input[name='remarks']").each(function () {
                shop_id.push($(this).attr("rel"));
                remark.push($(this).val());//将值添加到数组中
            });

            //加价购的商品
            var increase_goods_id = [];
            $(".increase_list").each(function () {
                if ($(this).is('.checked')) {
                    increase_goods_id.push($(this).find("#redemp_goods_id").val());
                }
            })

            //代金券信息
            var voucher_id = [];
            $(".voucher_list").each(function () {
                if ($(this).val() > 0) {
                    voucher_id.push($(this).val());
                }
            })
            //获取支付方式
            pay_way_id = $("#pay-selected").val();

            g.ajax({
                type: 'post',
                url: ApiUrl + '?ctl=Buyer_Order&met=addOrder&typ=json',
                data: {
                    receiver_name: address_contact,
                    receiver_address: address_address,
                    receiver_phone: address_phone,
                    invoice: invoice,
                    invoice_id: invoice_id,
                    cart_id: cart_id,
                    shop_id: shop_id,
                    remark: remark,
                    increase_goods_id: increase_goods_id,
                    voucher_id: voucher_id,
                    pay_way_id: pay_way_id,
                    address_id: address_id,
                    k: key,
                    u: getCookie('id'),
                    rpt: rpt
                },
                dataType: "json",
                success: function (a) {
                    clickOnce = true;
                    console.info(a.data.uorder);
                    if (a.status == 200) {
                        delCookie('cart_count');
                        //重新计算购物车的数量
                        getCartCount();
                        //alert(PayCenterWapUrl + "?ctl=Info&met=pay&uorder=" + a.data.uorder);
                        try {
                            _maq.trigger(['_trackEvent', "提交订单点击，提交成功"]);
                        } catch (e) {
                        }
                        if (pay_way_id == 1) {
                            window.location.href = WapSiteUrl + 'tmpl/order/pay.html?uorder=' + a.data.uorder;
                            return false;
                        }
                        else {
                            window.location.href = WapSiteUrl + '/tmpl/member/order_list.html';
                            return false;
                        }

                    }
                    else {
                        if (a.msg != 'failure') {
                            /* Public.tips.error(a.msg);*/
                            $.sDialog({
                                content: a.msg,
                                okBtn: false,
                                cancelBtnText: '返回',
                                cancelFn: function () { /*history.back();*/
                                }
                            });
                            try {
                                _maq.trigger(['_trackEvent', "提交订单点击，提交失败：" + a.msg]);
                            } catch (e) {
                            }

                        } else {
                            /*Public.tips.error('订单提交失败！');*/
                            $.sDialog({
                                content: '订单提交失败！',
                                okBtn: false,
                                cancelBtnText: '返回',
                                cancelFn: function () { /*history.back();*/
                                }
                            });
                            try {
                                _maq.trigger(['_trackEvent', "提交订单点击，提交失败：订单提交失败！"]);
                            } catch (e) {
                            }
                        }
                    }
                },
                error: function (a) {
                    clickOnce = true;
                    Public.tips.error('操作失败！');
                    try {
                        _maq.trigger(['_trackEvent', "提交订单点击，提交失败：操作失败！"]);
                    } catch (e) {
                    }
                    //$.dialog.alert("操作失败！");
                }
            });
        });
    }
);
$(document).ready(function () {
    /*
     *上弹下弹动画应用
     *@yifan
     *选择规格，红包等内容从下往上弹出（回落）的浮层动画
     *domClassName : 内容那一层的classname
     */
    function move_up(domClassName){
        $('.fix-up').removeClass('animate-hide').addClass('animate-show');
        $('.fixed-bg').addClass('fade-in').removeClass('fade-out');
        $('.'+domClassName).addClass('move-up').removeClass('move-down').siblings('.goods-fixed').removeClass('move-up').addClass('move-down');
        $('html').css({'overflow':'hidden','height':'100%'});
    }
    function move_down(domClassName){
        var domClassName=domClassName||"move-up";
        $('.fix-up').addClass('animate-hide').removeClass('animate-show');
        $('.fixed-bg').addClass('fade-out').removeClass('fade-in');
        $('.'+domClassName).addClass('move-down').removeClass('move-up');
        $('html').css({'overflow':'auto','height':'auto'});
        _userClickbtn=0;
    }
    /*
     *加入购物车动画原版动画逻辑
     *@yifan
     *直接调用，详情页使用
     *
     */
    function show_tip(goods_image,hideDom) {
        var flyer = $('.goods_image > img').clone().css({'z-index': '999', 'height': '3rem', 'width': '3rem'});
        flyer.fly({
            start: {
                left: $('.goods_image > img').offset().left,
                top: $('.goods_image > img').offset().top - $(window).scrollTop()
            },
            end: {
                left: $(".car-num").offset().left + 40,
                top: $(".car-num").offset().top - $(window).scrollTop(),
                width: 0,
                height: 0
            },
            onEnd: function () {
                flyer.remove();
                move_down();
            }
        });
    }

    var detailData;//详情数据
    var bigimgswiper;
    var _goodsId = [];//所有规格的商品id数组
    var _userClick = 0,_userClickbtn = 0;//用户主动出发选择规格
    var addcar=0,choose=0;//判断唤起的弹层是加入购物车还是可加购可购买

    $('.main').on('tap','.goodsCheck',function(e){
        // 打开浮层－规格选择/红包选择/促销选择/服务查看
        if($(e.currentTarget).hasClass('goods-specifications')){
            $('.choosebtn').removeClass('hide');
            $('.addcarbtn').addClass('hide');
            addcar=0,
                choose=1
        }
        var domClassNmae = e.currentTarget.className.split(" ")[1]+'-fixed';
        move_up(domClassNmae);
    })
    $('.fix-up').on('tap','.fixed-bg,.close',function(){
        // 关闭浮层－规格选择/红包选择/促销选择/服务查看
        move_down('move-up');
    })

    $('.fix-up').on('tap','.fixed-bg,.close',function(){
        // 关闭浮层－规格选择/红包选择/促销选择/服务查看
        move_down('move-up');
    })
    // 加入购物车
    $('.bottomNav').on("tap",".add-car",addcars);
    $('.fix-up').on("tap",".enter,.addcar",addcars);
    function addcars(e){
        if ($('.goods-specifications-fixed').hasClass('move-down')) {
            // statement
            $('.addcarbtn').removeClass('hide');
            $('.choosebtn').addClass('hide');
            addcar=1,
            choose=0
            move_up('goods-specifications-fixed');
            return false;
        }
        if(_userClickbtn == 1){
            return false;
        }

        show_tip();
        _userClickbtn=1;
        var key = getCookie('key');//登录标记
        var quantity = parseInt($(".buy-num").val());
        if($(e.currentTarget).hasClass('addcar')){
            //maqfn('加入购物车2');
        }else{
            //maqfn('加入购物车1');
        }
        if (!checkLogin()) {
            var goods_info = decodeURIComponent(getCookie('goods_cart'));
            if (goods_info == null) {
                goods_info = '';
            }
            if (goods_id < 1) {
                show_tip();
                return false;
            }
            var cart_count = 0;
            if (!goods_info) {
                goods_info = goods_id + ',' + quantity;
                cart_count = 1;
            } else {
                var goodsarr = goods_info.split('|');
                for (var i = 0; i < goodsarr.length; i++) {
                    var arr = goodsarr[i].split(',');
                    if (contains(arr, goods_id)) {
                        show_tip();
                    }
                }
                goods_info += '|' + goods_id + ',' + quantity;
                cart_count = goodsarr.length;
            }
            // 加入cookie
            addCookie('goods_cart', goods_info);
            // 更新cookie中商品数量
            addCookie('cart_count', cart_count);
            show_tip();
            getCartCount();
            $('#cart_count,#cart_count1').html('<sup>' + cart_count + '</sup>');
            return false;
        } else {
            if (Goodsdetaildata.shop_owner) {
                $.sDialog({
                    skin: "red",
                    content: '不能购买自己商店的商品！',
                    okBtn: false,
                    cancelBtn: false
                });
                return;
            }
            if (Goodsdetaildata.isBuyHave) {
                $.sDialog({
                    skin: "red",
                    content: '您已达购买上限！',
                    okBtn: false,
                    cancelBtn: false
                });
                return;
            }
            g.ajax({
                url: ApiUrl + "/index.php?ctl=Buyer_Cart&met=addCart&typ=json",
                data: {k: key, u: getCookie('id'), goods_id: goods_id, goods_num: quantity},
                type: "post",
                success: function (result) {
                    /*var rData = $.parseJSON(result);*/
                    if (checkLogin(1)) {
                        if (result.status == 200) {
                            show_tip();
                            // 更新购物车中商品数量
                            delCookie('cart_count');
                            getCartCount();
                            $('.car-num').html(getCookie('cart_count'));
                            try {
                                //_maq.trigger(['_trackEvent', "加入购物车成功"]);
                            } catch(e) {
                            }
                        } else {
                            $.sDialog({
                                skin: "red",
                                content: result.msg,
                                okBtn: false,
                                cancelBtn: false
                            });
                            try {
                                //_maq.trigger(['_trackEvent', "加入购物车失败：" + result.msg]);
                            } catch(e) {
                            }
                        }
                    }
                }
            })
        }
    }
})
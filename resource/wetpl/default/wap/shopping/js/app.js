require.config({
    // baseUrl: "/shop_wap/js",//改变根目录
    paths: {
        "baseurl":"/shop_wap",
        "init": "lib/init-h5",
        "zepto":"/shop_wap/js/zepto",
        "swipe":"/shop_wap/js/swiper.min",
        "config":"/shop_wap/js/config",
        "common":"/shop_wap/js/common",
        "doT":"/shop_wap/js/doT.min",
        "touch":"/shop_wap/js/touch_v1.2.0",
        "sDialog":"/shop_wap/js/simple-plugin",
        "requestAnimationFrame":"/shop_wap/js/fly/requestAnimationFrame",
        "fly":"/shop_wap/js/fly/zepto.fly.min",
　　},
    shim:{
        "zepto":{
            exports:"$"
        },
        "swipe":{
            exports:"swipe"
        },
        "config":{
            exports:"config"
        },
        "common":{
            deps:['zepto','config'],
            exports:"common"
        },
        "touch":{
            deps:['zepto'],
            exports:"touch"
        },
        "sDialog":{
            deps:['zepto'],
            exports:"sDialog"
        },
        "requestAnimationFrame":{
            deps:['zepto'],
            exports:"requestAnimationFrame"
        },
        "fly":{
            deps:['zepto','requestAnimationFrame'],
            exports:"fly"
        }
    }
});
require(
    ['zepto','init', 'swipe','config','common', "doT", "touch","sDialog","requestAnimationFrame", "fly"], 
    function ($, appInit, swiper, config, common, doT){
        appInit();//页面初始化
        console.log("链接是否带goodsid："+!!getQueryString("goods_id"));
        var goods_id = getQueryString("goods_id");//goodsid 商品id
        var cid = getQueryString("cid");//cid也不知道是个什么鬼
        var key = getCookie('key');//获取用户登陆
        var checked = 0;//处理重复请求使用
        var Goodsdetaildata;
        var detailData;//详情数据
        var bigimgswiper;
        var _goodsId = [];//所有规格的商品id数组
        var _userClick = 0,_userClickbtn = 0;//用户主动出发选择规格
        var addcar=0,choose=0;//判断唤起的弹层是加入购物车还是可加购可购买
        //如果没有goods_id，则根据cid获取goods_id
        if (!goods_id && cid) {
            g.ajax({
                url: ApiUrl + "index.php?ctl=Goods_Goods&met=getGoodsidByCid&typ=json",
                type: "POST",
                data: {k: getCookie('key'), u: getCookie('id'), cid: cid},
                dataType: "json",
                async: false,
                success: function (result) {
                    if (result.status == 200) {
                        goods_id = result.data.goods_id;
                        get_detail(goods_id);
                    }
                }
            });
        }else {
            get_detail(goods_id);
        }
        
        function get_detail(goods_id){
            g.ajax({
                url: ApiUrl + "index.php?ctl=Goods_Goods&met=good&typ=json",
                type: "get",
                data: {goods_id: goods_id, k: key, u: getCookie('id'), cid: cid},
                dataType: "json",
                async:'false',
                success: function (result) {
                    if (result.status === 200) {
                        console.log(result.data);
                        var data = Goodsdetaildata = result.data;
                        //商品图片格式化
                        if (data.goods_image) {
                            var goods_image = data.goods_image.split(",");
                            data.goods_image = goods_image;
                        } else {
                            data.goods_image = [];
                        }
                        // 商品规格初始化
                        if (data.goods_info.common_spec_name) {
                            var goods_map_spec = $.map(data.goods_info.common_spec_name, function (v, i) {
                                var goods_specs = {};
                                goods_specs["goods_spec_id"] = i;
                                goods_specs['goods_spec_name'] = v;
                                if (data.goods_info.common_spec_value_c) {
                                    $.map(data.goods_info.common_spec_value_c, function (vv, vi) {
                                        if (i == vi) {
                                            goods_specs['goods_spec_value'] = $.map(vv, function (vvv, vvi) {
                                                var specs_value = {};
                                                specs_value["specs_value_id"] = vvi;
                                                specs_value["specs_value_name"] = vvv;
                                                return specs_value;
                                            });
                                        }
                                    });
                                    return goods_specs;
                                } else {
                                    data.goods_info.common_spec_value = [];
                                }
                            });
                            data.goods_map_spec = goods_map_spec;
                        } else {
                            data.goods_map_spec = [];
                        }

                        if(data.goods_info.common_state=='0'|| data.goods_info.common_state=='10'){
                            //下架 
                        }else {
                            //售罄
                            /**
                            *   @yifan
                            *   判断商品是否售罄,售罄的话默认选中下一个规格
                            */
                            if(data.goods_info.goods_stock == 0){
                                if(_userClick){
                                    //用户点击已售罄规格时的提示
                                    $.sDialog({ content: "抱歉!该规格已售罄!", okBtn: false, cancelBtn: false,autoTime:1500})
                                    //_userClick = 0;
                                }
                                if(_goodsId.length == 0) {
                                    $.map(data.spec_list,function(item,index){
                                        if(item != goods_id){
                                            _goodsId.push(item);
                                        }
                                    })
                                }else{
                                    if(!_userClick){
                                        var index = _goodsId.indexOf(_goodsId[0]);
                                        if (index > -1) {
                                            _goodsId.splice(index, 1);
                                        }
                                    }
                                }
                                _userClick = 0;
                                if(_goodsId.length>=1){
                                    get_detail(_goodsId[0]);
                                    return false;
                                }else{
                                    //下架
                                    $('.goodsOver').removeClass('hide');
                                }
                            }
                        }
                        var text = data.goods_evaluate_info.length>0?data.goods_evaluate_info[0].content:"";//用户评价字数
                        var show_evaluate_index=0;
                        var imgArray = [];
                        var noimgArray = [];
                        if (data.goods_evaluate_info&&data.goods_evaluate_info.length>0) {
                            var lengths = data.goods_evaluate_info.length>20?20:data.goods_evaluate_info.length;
                            for(var i=0; i<lengths;i++){
                                //手机号加密处理
                                if (data.goods_evaluate_info[i].member_name) {
                                    var rexPhone = data.goods_evaluate_info[i].member_name;
                                    data.goods_evaluate_info[i].member_name = rexPhone.toString().replace(/\d{7}(\d{4})/, '*******$1');
                                }
                                if(data.goods_evaluate_info[i].scores && data.goods_evaluate_info[i].scores==5){
                                    if(data.goods_evaluate_info[i].image){//有图
                                        data.goods_evaluate_info[i].image =data.goods_evaluate_info[i].image.split(',');
                                        if (data.goods_evaluate_info[i].result=="good") {
                                            imgArray.push(i);
                                        }
                                    }else{
                                        if (data.goods_evaluate_info[i].result=="good") {
                                            noimgArray.push(i);
                                        }
                                    }
                                }else{
                                    data['goods_evaluate']=data.goods_evaluate_info[0];
                                }
                            }
                        } else {
                            data.goods_evaluate_info = [];
                            data['goods_evaluate']={};
                        }
                        if (imgArray.length>0) {
                            text =data.goods_evaluate_info[imgArray[0]].content;
                            show_evaluate_index = imgArray[0]; 
                            for(x in imgArray){
                                if(data.goods_evaluate_info[imgArray[x]].content.length > text.length ){
                                    text =data.goods_evaluate_info[imgArray[x]].content;
                                    show_evaluate_index=imgArray[x];
                                }
                            }
                            data['goods_evaluate']=data.goods_evaluate_info[show_evaluate_index];
                        } else if(noimgArray.length >0) {
                            text =data.goods_evaluate_info[noimgArray[0]].content;
                            show_evaluate_index = noimgArray[0];
                            for(x in noimgArray){
                                if(data.goods_evaluate_info[noimgArray[x]].content.length > text.length ){
                                    text =data.goods_evaluate_info[noimgArray[x]].content;
                                    show_evaluate_index=noimgArray[x];
                                }
                            }
                            data['goods_evaluate']=data.goods_evaluate_info[show_evaluate_index];
                        }
                        for(p in data.spec_list){
                            if(data.goods_evaluate.goods_id == data.spec_list[p]){
                                data.goods_evaluate["spec"] = data.goods_info.common_spec_value_c[1][p]
                            }
                        }
                        $.ajax({
                            url:ApiUrl+"index.php?ctl=Activity_LuckyPackage&met=getListDtail&typ=json",
                            success:function(res){
                                if(res.data[goods_id] && res.data[goods_id].detail.length>0){
                                    data.goods_tag = res.data[goods_id].detail[0]=="感恩用券"?"感恩用券":"买一送一"
                                }
                                data.addcar=addcar;
                                data.choose=choose;
                                var boxHtml = doT.template(document.getElementById('main').innerHTML);
                                $(".main").html(boxHtml(data));
                                // 底部导航
                                var bottomNavHtml = doT.template(document.getElementById("temp-bottomNav").innerHTML);
                                $(".bottomNav").html(bottomNavHtml(data));
                                //规格数量选择模版与数据 
                                var specificationsHtml = doT.template(document.getElementById("fixed-temp-specifications").innerHTML);
                                $(".goods-specifications-fixed").html(specificationsHtml(data));
                                // 红包选择模版与数据
                                var redpacketHtml = doT.template(document.getElementById("fixed-temp-redpacket").innerHTML);
                                $(".goods-red-packet-fixed").html(redpacketHtml(data));
                                // 促销提示模版与数据
                                var promotionHtml = doT.template(document.getElementById("fixed-temp-promotion").innerHTML);
                                $(".goods-promotion-fixed").html(promotionHtml(data));
                                // 服务模版与数据
                                var serviceHtml = doT.template(document.getElementById("fixed-temp-service").innerHTML);
                                $(".goods-service-fixed").html(serviceHtml(data));
                                // 大图查看模版与数据
                                var bigimghtml = doT.template(document.getElementById("big-img-temp").innerHTML);
                                $(".bigImg ul").html(bigimghtml(data));
                                shareData = {
                                    shareTitle: data.goods_info.goods_name,
                                    shareImg: data.goods_image[0],
                                }
                                WXshare(shareData);
                                
                                var mySwiper = new swiper('.goods-img',{
                                    loop:true,
                                    autoplay:5000,
                                    pagination:'.goods-img-pagination',
                                    paginationType : 'fraction',
                                    autoplayDisableOnInteraction:false,
                                });
                                bigimgswiper = new swiper('.bigImg',{
                                    loop:false,
                                    pagination:'.bigimg-pagination',
                                });
                                mySwiper.update();
                                $('.loading').addClass('hide');
                                //页面初始化的时候
                                scrollTodo($('.goods-details'),$('body'),$('.toTop'),"toTopanimate");
                                getCookie('cart_count') && getCookie('cart_count') > 0?$('.car-num').html(getCookie('cart_count')):$('.car-num').hide();
                                checked = 0;
                                detailData = data;
                            }
                        })
                        
                    } else {
                        // statement
                        $('.loading').text(result.msg);
                    }   
                }
            })
        }
        // var domClassNmae = '';
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

    var checkedSpecifications,checkedNum;
    //规格数量选择
    $('.fix-up').on('tap','.goods-specifications-fixed li',function(){
        $(this).addClass('check-specifications').siblings().removeClass('check-specifications');
        var checkedSpecifications = $('.check-specifications').text()||"",
        checkedNum = parseInt($('.buy-num').val())||1;
        $('.goods-specifications .tabarText').text("已选：“"+checkedSpecifications+","+checkedNum+"件”");
        _userClick = 1;
        get_detail($(this).attr("id"));
        goods_id = $(this).attr("id");//切换商品后的商品id替换
    })
    $('.fix-up').on('input','#buynum',function(e){
        var checkedSpecifications = $('.check-specifications').text()||"",
        checkedNum = parseInt($('.buy-num').val())||1;
        var topNum = parseInt($('.goods_stock').attr('topnum'));
        if( parseInt(checkedNum) > parseInt(topNum)){
            //选择数量时是否超过库存；
            checkedNum = topNum;
            $('.tips').show().html('输入值达库存上限了！');
            $('.add').addClass('gray');
            $('.buy-num').val(topNum);
        }else{
            if(checkedNum<=1){
                $('.buy-num').val(1);
            }
            $('.add').removeClass('gray');
            $('.tips').hide();
        }
        if(checkedNum>1){
            $('.minus').removeClass('gray');
        }else{
            $('.minus').addClass('gray');
        }
        $('.goods-specifications .tabarText').text("已选：“"+checkedSpecifications+","+checkedNum+"件”");
        
    })
    $('.fix-up').on('tap','.minus',function(e){
        var checkedSpecifications = $('.check-specifications').text()||"";
        var topNum = parseInt($('.goods_stock').attr('topnum'));
        var buyNum = parseInt($('.buy-num').val())||1;
        $('.tips').hide();
        if(parseInt(buyNum) <=1){
            $('.minus').addClass('gray');
            return false;
        }
        $('.buy-num').val(parseInt(buyNum)-1);
        $('.add').removeClass('gray');
        $('.goods-specifications .tabarText').text("已选：“"+checkedSpecifications+","+$('.buy-num').val()+"件”");
        if( parseInt(buyNum)-1 == 1){
            $('.minus').addClass('gray');
        }
    })
    $('.fix-up').on('tap','.add',function(e){
        var checkedSpecifications = $('.check-specifications').text()||"";
        var topNum = parseInt($('.goods_stock').attr('topnum'));
        var buyNum = parseInt($('.buy-num').val())||1;
        if(parseInt(buyNum) >= parseInt(topNum)){
            $('.tips').show().html('已达库存上限了！');
            $('.add').addClass('gray');
            return false
        }
        $('.buy-num').val(parseInt(buyNum)+1)
        $('.minus').removeClass('gray');
        $('.goods-specifications .tabarText').text("已选：“"+checkedSpecifications+","+$('.buy-num').val()+"件”");
        if( parseInt(buyNum)+1 == parseInt(topNum)){
            $('.add').addClass('gray');
        }
    })
    //规格数量选择 end
    // 抢光了弹层关闭
    $('.closeOver .iconfont').on('tap' , function(){
        $('.goodsOver').addClass('hide');
    });
    // 我喜欢的
    $('.bottomNav').on("tap",".like",function(e){
        var checked_goods_id = $('.check-specifications').attr('id');
        if ($(this).hasClass('favorate')) {
            if (dropFavoriteGoods(checked_goods_id)){
                $(this).removeClass('favorate icon-xihuan-ed').addClass('icon-xihuan');
            }
        } else {
            if (favoriteGoods(checked_goods_id)){
                $(this).addClass('favorate icon-xihuan-ed').removeClass('icon-xihuan');
            } 
        }
        try {
            _maq.trigger(['_trackEvent', '收藏']);
        } catch(e) {
        }
    });
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
        _userClickbtn=1;
        var key = getCookie('key');//登录标记
        var quantity = parseInt($(".buy-num").val());
        if($(e.currentTarget).hasClass('addcar')){
            maqfn('加入购物车2');
        }else{
            maqfn('加入购物车1');
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
                                _maq.trigger(['_trackEvent', "加入购物车成功"]);
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
                                _maq.trigger(['_trackEvent', "加入购物车失败：" + result.msg]);
                            } catch(e) {
                            }  
                        }
                    }
                }
            })
        }
    }
    // 立即购买
    $('.bottomNav').on("tap",".buy-now",buynow);
    $('.fix-up').on("tap",".buynow",buynow);
    function buynow(e){
        var key = getCookie('key');//登录标记
        var buynum = parseInt($('.buy-num').val()) || 0;
        if (detailData.shop_owner) {
            $.sDialog({
                skin: "red",
                content: '不能购买自己商店的商品！',
                okBtn: false,
                cancelBtn: false
            });
            try {
                _maq.trigger(['_trackEvent', '立即购买按钮点击', '不能购买自己商店的商品！']);
            } catch(e) {
            }
            return;
        }
        if (detailData.isBuyHave) {
            $.sDialog({
                skin: "red",
                content: '您已达购买上限！',
                okBtn: false,
                cancelBtn: false
            });
            try {
                _maq.trigger(['_trackEvent', '立即购买按钮点击', '您已达购买上限！']);
            } catch(e) {
            }
            return;
        }
        if (detailData.goods_info.goods_stock == 0) {
            $.sDialog({
                skin: "red",
                content: '该规格已售罄',
                okBtn: false,
                cancelBtn: false
            });
            return false;
        }
        g.ajax({
            url: ApiUrl + "index.php?ctl=Buyer_Cart&met=addCart&typ=json",
            data: {k: key, u: getCookie('id'), goods_id: goods_id, goods_num: buynum, buy_type:1},
            type: "post",
            success: function (result) {
                if (result.status == 200) {
                    // show_tip();
                    // 更新购物车中商品数量
                    delCookie('cart_count');
                    getCartCount();
                    try {
                        _maq.trigger(['_trackEvent', '立即购买按钮点击', '跳转到确认订单页']);
                    } catch (e) {
                    }
                    location.href = WapSiteUrl + "tmpl/order/buy_step1.html?ifcart=1&cart_id=" + result.data.cart_id;
                    //location.href = WapSiteUrl+'/tmpl/order/buy_step1.html?goods_id='+goods_id+'&buynum='+buynum;
                } else {
                    $.sDialog({
                        skin: "red",
                        content: result.msg,
                        okBtn: false,
                        cancelBtn: false
                    });
                    try {
                        _maq.trigger(['_trackEvent', '立即购买按钮点击', result.msg]);
                    } catch(e) {
                    }
                } 
            }
        });                     
    };

    $('.main').on('tap','.imglist',function(e){
        $('.bigImg').show();
        bigimgswiper.update();
    });
    $('.bigImg').on("tap",function(e){
        if($(e.target).hasClass('bigImg')){
            $(this).hide();
        }
    });
    $('.close-bigimg').on('tap',function(){
        $('.bigImg').hide();
    });
    // 返回顶部
    $('.toTop').on('tap',function(){
        smoothscroll();
    })
    $(document).on('scroll',function(e){
        // 控制返回顶部按钮的显示
        scrollTodo($('.goods-details'),$('body'),$('.toTop'),'toTopanimate');
    },false);
    // 页面埋点
    $('.bottomNav').on('tap','.toindex',function(){
        maqfn("商城")
    });
    $('.bottomNav').on('tap','.tocenter',function(){
        maqfn("个人中心")
    });
    $('.bottomNav').on('tap','.tocart',function(){
        maqfn("购物车")
    });



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
    /*
    *袋鼠云埋点方法处理
    */
    function maqfn(str1,str2,str3){
        try {
            _maq.trigger(['_trackEvent', str1, str2, str3]);
        } catch(e) {
        }
    }

}); 

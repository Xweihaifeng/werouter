(function (ng) {

    function ie7ConfigProvider() {
        this._hash = {};
        this.init();
    }

    ie7ConfigProvider.prototype.init = function () {
        var rootElement = document.getElementById('ng-app');
        this.set('enabled', !!ng.element(rootElement).length);
    };

    ie7ConfigProvider.prototype.set = function (prop, val) {
        this._hash[prop] = val;
    };

    ie7ConfigProvider.prototype.get = function (prop) {
        return this._hash[prop];
    };

    ie7ConfigProvider.prototype.$get = function () {
        return this._hash;
    };

    function switchSce(ie7ConfigProvider, $sceProvider) {
        var enable = $sceProvider.enabled();
        if (ie7ConfigProvider.get('enabled')) {
            enable = false;
        }
        $sceProvider.enabled(enable);
    }

    function $animatePatch(ie7Config, $$asyncCallback, $animate) {
        function async(fn) {
            fn && $$asyncCallback(fn);
        }

        function addClass(element, className, done) {
            ng.element(element).addClass(className);
            async(done);
        }

        function removeClass(element, className, done) {
            ng.element(element).removeClass(className);
            async(done);
        }

        if (ie7Config.enabled) {
            $animate.addClass = addClass;
            $animate.removeClass = removeClass;
        }
    }

    ng
        .module('ie7-support', [])
        .provider('ie7Config', ie7ConfigProvider)
        .config(['ie7ConfigProvider', '$sceProvider', switchSce])
        .run(['ie7Config', '$$asyncCallback', '$animate', $animatePatch]);

}(angular));

/**
 * Created by YL Huang on 2015/7/7.
 */
(function(window, angular) {
    'use strict';
    window.onload=function(){
        var elem = document.getElementById('ng-app');
        angular.bootstrap(elem, ['payApp']);
    };

    function moduleDefine($locationProvider,$stateProvider,$urlRouterProvider) {
        $stateProvider
            .state("submit", {
                url: "/submit",
                controller: 'submitCtrl',
                templateUrl: uc.siteTmplUrl("../views/submit.html")
            })
            .state("confirm", {
                url: "/confirm",
                controller: 'confirmCtrl',
                templateUrl: uc.siteTmplUrl("../views/confirm.html")
            })
            .state("wpay", {
                url : "/wpay",
                controller : "wpayCtrl",
                templateUrl: uc.siteTmplUrl("../views/wpay.html")
            })
            .state("reserve", {
                url : "/reserve",
                controller : 'reserveCtrl',
                templateUrl : uc.siteTmplUrl("../views/reserve.html")
            })
            .state("payreserve", {
                url : "/payreserve",
                controller : "payreserveCtrl",
                templateUrl : uc.siteTmplUrl("../views/payreserve.html")
            })
            .state("subscribe", {
                url : "/subscribe",
                controller : 'subscribeCtrl',
                templateUrl : uc.siteTmplUrl("../views/subscribe.html")
            })
            .state("paysubscription", {
                url : "/paysubscription",
                controller : "paysubscribeCtrl",
                templateUrl : uc.siteTmplUrl('../views/paysubscribe.html')
            });

    }
    if($.browser.msie && parseInt($.browser.version, 10) == 7){
        angular.module('payApp', ['ui.router','ngFileUpload', 'ngCookies', 'ie7-support'])
            .config(['$locationProvider','$stateProvider','$urlRouterProvider', moduleDefine]);
    }else{
        angular.module('payApp', ['ui.router','ngFileUpload', 'ngAnimate', 'ngCookies'])
            .config(['$locationProvider','$stateProvider','$urlRouterProvider', moduleDefine]);
    }


})(window, window.angular);
/**
 * Created by YL Huang on 2015/7/22.
 */
(function(window) {
    'use strict';
    window.uc= {
        siteTmplUrl : function(url){
            url = url.split("views/").pop();
            return "/tmpl?file=" + url + "&app=payapp";
        },
        static : {
            JS_PATH :'/static/v4/uc/js/',
            UPLOAD_SWF_PATH : '/static/v4/uc/js/uploadify.swf',
            COPY_SWF_PATH : '/static/v4/uc/js/ZeroClipboard.swf',
            isBeforeIE9 : function(){
                var agent = navigator.userAgent.toLowerCase() ;
                /*ie9以下ie浏览器使用*/
                return agent.indexOf("msie") > 0 && !(-[1,]);
            }
        },
        serviceUrl : function(url){
            var r = '/rpc-' + url.replace(/\//g, ',');
            return r;
        },
        eqParams : function(controller, action, method ,params){

            var obj = {
                a : controller,
                f : action,
                t : method == 'GET' ? "0" : "1"
            };

            var p_arr = [];
            for(var key in params){
                p_arr.push(key + "|" + params[key]);
            }
            obj.p = p_arr.join("|");
            return obj;
        },
        parse_url : function(url){
            var pattern = RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
            var matches =  url.match(pattern);

            var dats= {
                scheme: matches[2],
                authority: matches[4],
                path: matches[5],
                query: matches[7],
                fragment: matches[9]
            };
            return dats;

        },
        imageProcess : function(url, type, width, height){
            var rpos = url.lastIndexOf("/");
            var left = url.substr(0, rpos + 1);
            var right = url.substr(rpos + 1, url.length - rpos);

            var prts = right.split(".");
            var new_file_name = prts[0] + "_" + type + "_" + width + "x" + height + "." + prts[1];
            return left + new_file_name;

        },
        staticUpldImg : function(url){
            if(!url){return "";}
            if(url.match(/^\.?\//)){
                url = '/' + url.replace(/^\.?\//g, "") ;
            }

            var obj = uc.parse_url(url);
            if(/\.web/.test(window.location.href)){
                var m = location.href.match(/([^/]*)\.web.*(com|cn)/);
                if(url.match('avatar')){

                    return "http://" + m[1] + ".web.zhongchou." + m[2]  + obj.path;
                }else{

                    return "http://" + m[1] + ".api.zhongchou." + m[2]  + obj.path;
                }
            }else{
                url = obj.path;
                var rnd = Math.floor(Math.random() * 9) + 1;
                var n_href = "http://zcr" + rnd + ".ncfstatic.com" + url;
                return n_href + "?v=" + STATIC_VERSION;
            }

        },
        psvc_url : function(){
            var baseUrl = "/prpc/";
            var urlPrts = [];
            for(var i = 0; i < arguments.length; i++){
                var url = arguments[i].url.replace(/\//g, "-");
                var query = uc.build_query(arguments[i].data);
                if(url.indexOf('&') === -1 && query){
                    url += "&";
                }
                url += query;
                url = url.replace(/[&?=]/g, "-");
                if(arguments[i].name){
                    url = arguments[i].name + "," + url;
                }
                urlPrts.push(url);
            }
            return baseUrl + urlPrts.join("/");
        },

        build_query : function(params){
            var p = [];
            for(var key in params){
                p.push(key + "=" + (params[key] ? params[key] : ""));
            }
            return p.join('&');
        },
        currency : function(val){
            val = parseFloat(val);
            if(isNaN(val)){
                return 0;
            }
            if(val % 1 < 0.001){
                return parseInt(val);
            }
            return val.toFixed(2);


        },
        modal :{
            pay : function(title, content, callback, cancelCallback){
                var modal = $('<div class="modal pay fade">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title">' + title + '</h4>\
                            </div>\
                            <div class="modal-body">' + content + '</div>\
                            <div class="modal-footer">\
                                <button type="button" class="modal-ok">我已经完成支付</button>\
                                <button type="button" class="modal-cancel">更换支付方式</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>');
                if ($('.modal').length > 0) {
                    $('.modal').remove();
                }
                $(document.body).append(modal);
                modal.fadeIn().addClass('in');
                function close() {
                    if(cancelCallback)
                        cancelCallback();
                    if(uc.static.isBeforeIE9()){
                        $('.modal').remove();
                        return;
                    }
                    modal.removeClass('in');
                    setTimeout(function () {
                        $('.modal').remove();
                    }, 500);
                }

                $('.modal-header').find('.close').click(close);
                $('.modal-footer .modal-cancel').click(close);
                if (!callback) {
                    $('.modal-footer .modal-ok').click(close);
                } else {
                    $('.modal-footer .modal-ok').click(function () {
                        $(this).attr('disabled','disabled');
                        $(this).text('处理中...');
                        callback();
                    });
                }
            },
            confirm: function (title, content, callback) {
                var modal = $('<div class="modal fade">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title">' + title + '</h4>\
                            </div>\
                            <div class="modal-body">' + content + '</div>\
                            <div class="modal-footer">\
                                <button type="button" class="modal-cancel">取消</button>\
                                <button type="button" class="modal-ok">确认</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>');
                if ($('.modal').length > 0) {
                    $('.modal').remove();
                }
                $(document.body).append(modal);
                modal.fadeIn().addClass('in');
                function close() {
                    if(uc.static.isBeforeIE9()){
                        $('.modal').remove();
                        return;
                    }
                    modal.removeClass('in');
                    setTimeout(function () {
                        $('.modal').remove();
                    }, 500);
                }

                $('.modal-header').find('.close').click(close);
                $('.modal-footer .modal-cancel').click(close);
                if (!callback) {
                    $('.modal-footer .modal-ok').click(close);
                } else {
                    $('.modal-footer .modal-ok').click(function () {
                        $(this).attr('disabled','disabled');
                        $(this).text('处理中...');
                        callback();
                    });
                }
            },
            alert: function (title, content, callback) {
                var modal = $('<div class="modal fade">\
                    <div class="modal-dialog">\
                        <div class="modal-content">\
                            <div class="modal-header">\
                                <button type="button" class="close"><span aria-hidden="true">&times;</span></button>\
                                <h4 class="modal-title">' + title + '</h4>\
                            </div>\
                            <div class="modal-body">' + content + '</div>\
                            <div class="modal-footer">\
                                <button type="button" class="modal-ok">确定</button>\
                            </div>\
                        </div>\
                    </div>\
                </div>');
                if ($('.modal').length > 0) {
                    $('.modal').remove();
                }
                $(document.body).append(modal);
                modal.fadeIn().addClass('in');
                function close() {
                    if(uc.static.isBeforeIE9()){
                        $('.modal').remove();
                        return;
                    }
                    modal.removeClass('in');
                    setTimeout(function () {
                        $('.modal').remove();
                    }, 1000);
                }

                $('.modal-header').find('.close').click(close);
                $('.modal-footer button').click(function () {
                    if(callback) {
                        $(this).attr('disabled','disabled');
                        $(this).text('处理中...');
                        callback();
                    }
                    close();
                });
            },
            close:function() {
                if(uc.static.isBeforeIE9()){
                    $('.modal').remove();
                    return;
                }
                $('.modal').removeClass('in');
                setTimeout(function () {
                    $('.modal').remove();
                }, 500);
            }
        }
    };
})(window);
(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("confirmCtrl", ['$scope', 'httpMock', 'PayService',  '$location', '$cookieStore','$rootScope', function ($scope, httpMock, PayService,$location, $cookeStore, $rootScope) {
        var payService = new PayService();
        var query = $location.search();

        var selectedBank = null;

        $scope.pay = payService;


        setTimeout(function(){

            $rootScope.dir = 'right';
        }, 1500);
        document.body.scrollTop = 85;
        $rootScope.stepStr = 'two';
        payService.getPaymentInfo(query.order_id, query.anonymous);
        $scope.$on(PayService.Events.PAY_ORDER_INFO_LOADED, function(event, data){

            _.each($scope.pay.payview.payway_list, function(item) {
                var hint = __getHint(payService.money, item.limit, payService.num, item.payment_id);
                item.hint = hint;
                item.checked = false;
            });
            _.each($scope.pay.banklist, function(item) {
                var hint = __getHint(payService.money, item.limit, payService.num, item.payment_id);
                item.hint = hint;
                item.checked = false;
            });

            //$scope.selectedPlatform = payService.selectedPaymentMethod;
            if($scope.pay.selectedPaymentMethod)
                $scope.pay.selectedPaymentMethod.checked = true;

            $rootScope.deal_name = payService.payview.deal_name;
            $rootScope.deal_id = payService.payview.order_info.deal_id;

        });

        $scope.$on("LOGINED", function(){
            payService.getPaymentInfo(query.order_id, query.anonymous);
        });

        $scope.selectCoupon = function(){
            console.log(payService.coupon);
            var coupon = _.first(_.filter(payService.couponList, function(item){return item.coupon_id == payService.coupon.coupon_id;}));

            payService.setCoupon(coupon);
            setTimeout(function(){

            }, 100);
            $scope.$apply();
        };

        $("#coupon-select").change(function(){

        });

        $scope.$on(PayService.Events.PAY_JUMP, function(event, data){
            console.log(data);
        });

        $scope.toggleBalance = function(){
            payService.toggleUseBalance();
        };

        function __getHint(money, limit, n, payment_id){
            var is_bank = false;
            /*
            if (limit && limit < (money / n)){
                return {
                    is_available : false,
                    slogan : "已超出限额,请使用其他支付方式"
                };
            } else if(limit && limit < money && n > 1 && limit > (money / n)) {
                return {
                    is_available : false,
                    slogan : "支付金额较大,建议分次购买"
                };
            }
            else{
            */
            var slogan = '';
            var _bank = payService.bank;
            var is_available = true;
            switch(payment_id){
                case 29:
                    //slogan = '推荐支付宝用户使用';
                    break;
                case 50:

                    break;
                case 43:
                    //is_bank = !!_bank;
                    //slogan = (_bank ? '使用' + _bank.bank_name + '储蓄卡支付' : "开通储蓄银行卡用户可用");
                    break;
                case 45:
                    //slogan = "开通信用卡用户可用";
                    break;

            }
            return {is_available : is_available, slogan : slogan, is_bank : is_bank};
            //}

        }

        $scope.checkPlatform = function(platform, changeInTab){

            if(!$scope.pay.payview){return;}

            if(platform === 'union'){

                platform = $scope.pay.unionPlatform;
            }
            if($scope.pay.selectedPaymentMethod && $scope.pay.samePlatform(platform, $scope.pay.selectedPaymentMethod)){
                return;
            }

            if(platform.bank_code && !changeInTab){
                $scope.pay.isPlatformSelected = true;
            }else{

                $scope.pay.isPlatformSelected = false;
            }
            $scope.pay.selectedPaymentMethod = platform;
            if(platform.bank_code){
                selectedBank = platform;
            }
            _.each($scope.pay.payview.payway_list, function(item) {
                var hint = __getHint(payService.money, item.limit, payService.num, item.payment_id);
                item.hint = hint;
                item.checked = false;
            });
            _.each($scope.pay.banklist, function(item) {
                var hint = __getHint(payService.money, item.limit, payService.num, item.payment_id);
                item.hint = hint;
                item.checked = false;
            });
            platform.checked = true;
        };


        $scope.pay_jump = function(){

            if($rootScope.payJumpLock){
                return;
            }
            $rootScope.payJumpLock = true;
            var form = {};
            form.payment_id = ($scope.pay.selectedPaymentMethod? $scope.pay.selectedPaymentMethod.payment_id : 0);
            if($scope.pay.selectedPaymentMethod.bankID){
                form.bankID = $scope.pay.selectedPaymentMethod.bankID;
            }
            //去付款
            gaTrack("pay", "payment");
            payService.pay(form);
        };


        var I = null;
        $scope.$on(PayService.Events.PAY_JUMP,function(event, data){
            //save_user_ops();
            function pay_and_query(){

                var n_sn = data.notice_sn;
                clearInterval(I);
                function query(){

                    var url1 = "/pay2-weixin_query/notice_sn-" + n_sn;
                    $.ajax({
                        url : url1,
                        type:"POST",
                        success : function(data){
                            var d = $.parseJSON(data);
                            if(d.success) {
                                window.location.href = '/callback-pay_success/n-' + n_sn;
                            }

                        },
                        error : function(){
                        }

                    });
                }
                I = setInterval(function(){
                    query();
                }, 5000);

            }

            if(data.type === 'url'){
                $rootScope.payJumpLock = false;
                window.location.href = data.data;
            }else if(data.type == 'weixin'){

                $rootScope.payJumpLock = false;
                $location.path("/wpay")
                    .search("url", data.data)
                    .search("deal_name", data.deal_name)
                    .search("notice_sn", data.notice_sn)
                    .search("create_time", data.create_time)
                    .search("money", data.money);



                $scope.$apply();
            }
            else if(data.type == 'form'){
                var $form = $(data.data);
                var $fc = $("#form-container");

               // $form.attr("target", "_blank");
                $rootScope.payJumpLock = false;
                $fc.empty();
                $fc.append($form);
                //pay_and_query();
            }else if(data.type == 'success'){

                $rootScope.payJumpLock = false;
                window.location.href = "/callback-pay_success/n-" + data.data;
            }else if(data.type == 'union'){
                var $form = $(data.data);

                var $fc = $("#form-container");
                $fc.empty();
                _.each($form, function(node){
                    if(node.nodeName == 'FORM'){
                        $fc.append(node);
                        setTimeout(function(){

                            $(node).submit();
                        }, 0);
                    }

                });
            }
            pay_and_query();

        });
        $scope.canPayJump = function(){
            return !!$scope.pay.selectedPaymentMethod && !$rootScope.payJumpLock;
        };
        $scope.changeTab = function(tab){
            if(tab == $scope.pay.tab){return;}
            //$scope.pay.selectedPaymentMethod = true;
            $scope.pay.tab = tab;

            if($scope.pay.tab == 1){

                $scope.checkPlatform($scope.pay.payview.payway_list[0]);
            }else{
                if(selectedBank){
                    $scope.checkPlatform(selectedBank, true);
                }else{
                    $scope.checkPlatform($scope.pay.banklist[0], true);
                }
            }
        };

        function save_user_ops(){
            //$cookeStore.put("PAY_USERS_OPS", {tab : $scope.tab, payment_id : $scope.selectedPlatform.payment_id, bankID : $scope.selectedPlatform.bankID});

        };

        //默认选中微信
        setTimeout(function(){
            $('.zfPlatItemBank.weixin').click();
        },1000);



    }])
})(window, window.angular, angular.module("payApp"));

/**
 *
 * Created by weimeng on 15/7/26.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("loginCtrl",['$scope', 'Check', '$location', 'User', '$rootScope', function($scope, Check, $location, User, $rootScope){
        var I;
        $scope.submit = function(){
                if($scope.canLogin()){
                gaTrack("pay","login"); //登陆
                User.fast_login($scope.$$childTail.mobile, $scope.$$childTail.vcode).then(function(){
                    $rootScope.$broadcast("USER_LOGINED");
                });
            }
        };
        $scope.sText = "获取验证码";

        var __lock = false;
        $scope.getVCode = function(){
            if(!(Check.required($scope.$$childTail.mobile) && Check.mobile($scope.$$childTail.mobile))){

                return;
            }
            if(__lock) {return;}
            __lock = true;
            var c = 60;
            if(validateMobile()){
                gaTrack("pay", "verification"); //获取验证码
                User.getVCode($scope.$$childTail.mobile).then(function(){

                });
                I = setInterval(function(){

                    c--;
                    $scope.sText = c;
                    if(c == 0){
                        clearInterval(I);
                        __lock = false;
                        $scope.sText = '获取验证码';
                    }

                    $scope.$apply();
                }, 1000);
            }else{
                __lock = false;
            }
        };

        $scope.popLogin = function(){
            zc.show_login(function(){

                $rootScope.$broadcast("USER_LOGINED");
            }) ;
        };

        function validateMobile(){
            var mobile = $scope.$$childTail.mobile;
            if(!(Check.required(mobile) && Check.mobile(mobile))){
                uc.modal.alert('错误提示','请输入正确的手机号或邮箱');
                return false;
            }
            return true;
        }

        function validateVCode(){
            if(!(Check.required($scope.$$childTail.vcode))){
                uc.modal.alert('错误提示','请输入短信验证码');
                return false;
            }
            return true;
        }

        $scope.canLogin = function(){
            return Check.required($scope.$$childTail.mobile) && Check.mobile($scope.$$childTail.mobile) && Check.required($scope.$$childTail.vcode);
        };

        $scope.canGetVCode = function(){
            return Check.required($scope.$$childTail.mobile) && Check.mobile($scope.$$childTail.mobile);
        };
    }]);
})(window, window.angular,angular.module('payApp'));

/**
 *
 * Created by weimeng on 15/7/26.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("mainCtrl",['$scope',  '$rootScope', '$location', function($scope, $rootScope, $location){
        $scope.slide = '';
        $rootScope.loading = true;
        $scope.step_percent = 0;
        $rootScope.dir = '';

        var path = $location.path();
        if(/reserve/.test(path) || /subscr/.test(path)){
            if(window.location.href.match("zhongchou")){
                var nUrl = window.location.href.replace("zhongchou", "yuanshihui");
                window.location.href = nUrl;
            }
            $rootScope.app = 1;
        }else{
            if(window.location.href.match("yuanshihui")){

                var nUrl = window.location.href.replace("yuanshihui", "zhongchou");
                window.location.href = nUrl;
            }

            $rootScope.app = 2;
        }
        $rootScope.stock = true;

        $rootScope.$on('$stateChangeStart', function(){
            //$scope.slide = $scope.slide || 'slide-left'
        });

        $rootScope.back = function(){
        }

        $rootScope.forward = function(){
            $rootScope.dir = 'left';
        }


    }]);
})(window, window.angular,angular.module('payApp'));

/**
 *
 * Created by weimeng on 15/7/26.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("payreserveCtrl",['$scope', 'Reserve', 'EqPay', '$location', 'User', '$rootScope', function($scope, Reserve, EqPay, $location, User, $rootScope){

        $scope.$parent.step = 2;
        $scope.loading = true;
        $scope.$parent.step_percent = '66%';

        setTimeout(function(){
            $rootScope.dir = 'right';
        }, 1500);
        var query = $location.search();
        var order_id = query.order_id;

        var reserve = new Reserve(query.dealId);
        $scope.pay = reserve;
        reserve.confirm(order_id, 1);


        $scope.$on(EqPay.Events.OrderLoaded, function(){
            $scope.loading = false;
            $rootScope.deal_name = reserve.orderInfo.name;
            $rootScope.deal_id = reserve.dealId;
        });

        var I = null;
        $scope.$on(EqPay.Events.GoPay, function(event, data){

            var n_sn = data.data.notice_sn;
            var clickClose = false;

            function query(){
                reserve.queryResult(n_sn).then(function(data){
                    if(data.errno){
                        if(clickClose){
                            //clearInterval(I);
                            uc.modal.close();
                        }
                    }
                    else{
                        window.location.href = '/callback-pay_success_stock/n-' + n_sn;
                    }
                }, function(){
                   if(clickClose){
                       //clearInterval(I);
                       uc.modal.close();
                   }
                });
            }
            if(!I){
                I = setInterval(function(){
                    query();
                }, 5000);
            }

            setTimeout(function(){
                uc.modal.pay("支付提示", "付款成功才算确定投资意向，请尽快完成付款。", function(){
                    clickClose = true;
                    query();
                }, function(){
                    //clearInterval(I);
                });
            }, 3000);

            setTimeout(function(){
                var $form = $(data.data.data);
                var $fc = $("#form-container");
                $fc.empty();
                $fc.append($form);

            }, 1000);

        });

        $scope.submit = function(){
            if($rootScope.payLock){
                return;
            }

            $rootScope.payLock = true;
            reserve.pay();
        };

    }]);
})(window, window.angular,angular.module('payApp'));

/**
 *
 * Created by weimeng on 15/7/26.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("paysubscribeCtrl",['$scope', 'Subscription', 'EqPay', '$location', 'User', '$rootScope', function($scope, Subscription, EqPay, $location, User, $rootScope){

        $scope.$parent.step = 2;
        $scope.loading = true;
        $scope.$parent.step_percent = '66%';
        setTimeout(function(){
            $rootScope.dir = 'right';
        }, 1500);

        var query = $location.search();
        var order_id = query.order_id;

        var subscription = new Subscription(query.dealId);
        $scope.pay = subscription;
        subscription.confirm(order_id, 0);


        $scope.$on(EqPay.Events.OrderLoaded, function(){
            $scope.loading = false;
            $rootScope.deal_name = subscription.orderInfo.name;
            $rootScope.deal_id = subscription.orderInfo.deal_id;
        });

        var I = null;
        $scope.$on(EqPay.Events.GoPay, function(event, data){
            var n_sn = data.data.notice_sn;
            var clickClose = false;

            function query(){
                subscription.queryResult(n_sn).then(function(data){
                    if(data.errno){
                        if(clickClose){
                            clearInterval(I);
                            uc.modal.close();
                        }
                    }
                    else{
                        window.location.href = '/callback-pay_success_stock/n-' + n_sn;
                    }
                }, function(){
                    if(clickClose){
                        //clearInterval(I);
                        uc.modal.close();
                    }
                });
            }
            if(!I) {
                I = setInterval(function () {
                    query();
                }, 5000);
            }
            setTimeout(function(){
                uc.modal.pay("支付提示", "付款成功才算确定投资意向，请尽快完成付款。", function(){
                    clickClose = true;
                    query();
                }, function(){
                    //clearInterval(I);
                });
            }, 3000);

            setTimeout(function(){
                var $form = $(data.data.data);
                var $fc = $("#form-container");
                $fc.empty();
                $fc.append($form);
            }, 1000);
        });


        $scope.$on(EqPay.Events.GoPayOffline, function(){
        });

        $scope.submit = function(){
            if($rootScope.payLock){
                return;
            }
            $rootScope.payLock = true;
            gaTrack('subscribe', 'onlinePay');
            subscription.pay();
        };
        $scope.setOb = function(){
            $scope.ob = 1;
            gaTrack('subscribe', 'offlinePay');
            subscription.payOffline();
        };



    }]);
})(window, window.angular,angular.module('payApp'));

/**
 *
 * Created by weimeng on 15/7/26.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("reserveCtrl",['$scope', 'Check', '$location', 'Reserve','EqPay', '$rootScope', 'User', function($scope, Check, $location, Reserve, EqPay, $rootScope, User){
        $scope.$parent.step = 1;
        $scope.$parent.step_percent = '33%';
        var query = $location.search();
        var reserve = new Reserve(query.dealId, query.isLeader);
        reserve.reserve();
        $scope.pay = reserve;
        $scope.$on(EqPay.Events.ReverseInfoLoad, function(){

            setTimeout(function(){
                $rootScope.loading = false;
                $rootScope.$apply();
            }, 200);
            $rootScope.deal_name = reserve.dealInfo.name;
            $rootScope.deal_id = reserve.dealId;
        });

        $scope.submit = function(){
            reserve.reserve_add();
        };

        $scope.$on(EqPay.Events.Reserved, function(){
            var order_id = reserve.order_id;
            setTimeout(function(){
                if(order_id){
                    $location.path("/payreserve")
                        .search("order_id", order_id)
                        .search("dealId", reserve.dealId);
                    $scope.$parent.forward();
                }else{
                    window.location.href = '/callback-pay_success_stock/deal_id-' + reserve.dealId;
                }

                $scope.$apply();
            });

        });
        $scope.$on("LOGINED", function(){
            User.getInfo().then(function(data){
                $(".siteHLoginBox").empty().append("<a class='pay_link' href='/zc/#/user-center/reward-order'>" + data.name + "</a>")
            });
            $rootScope.loading = true;
            reserve.reserve();
        });

    }]);
})(window, window.angular,angular.module('payApp'));

/**
 *
 * Created by weimeng on 15/7/26.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("submitCtrl",['$scope', 'httpMock','PayService','Address', '$location','$rootScope', 'User', function($scope, httpMock, PayService, Address, $location, $rootScope, User){
        var query = $location.search();
        var payService = new PayService(query.projectID, query.itemID, query);
        //payService.load_order_state();
        $scope.loading = 1;
        $scope.step = 0;
        $scope.selfless_opt = 0;
        $scope.pay = payService;
        $scope.addressList = [];
        $scope.address = {};
        $scope.defaultAddr = {};
        $scope.username = '';
        $scope.vcode = '';
        document.body.scrollTop = 85;
        $rootScope.stepStr = 'one';

        payService.getOrderInfo();

        function resetItemDisplay(){
            if($scope.rewards){
                _.each($scope.rewards, function(reward){
                    if($scope.step == 0){
                        reward.display = 1;
                    }else{
                        document.body.scrollTop = 85;
                        if(reward.itemID === payService.selectedItem.itemID) {
                            reward.display = 1;
                        }else{
                            reward.display = 0;
                        }
                    }
                });
            }
            console.log($scope.pay);
        }
        $scope.$on(PayService.Events.PAY_INFO_LOADED, function(event, data){
            $scope.project = data.project;
            $scope.title = data.title;
            $scope.rewards = data.items;
            $scope.loading = 0;
            $rootScope.deal_name = $scope.project.name;
            $rootScope.deal_id = $scope.project.project_id;

            if(payService.selectedItem){
                $scope.step = 1;
            }

            if(payService.logined){
                Address.load();
            }

            resetItemDisplay();
        });

        $scope.iWantPay = function(item){
            if(item.can_be_support) {
                $location.search("itemID", item.itemID);
                payService.setSelectedItem(item);
                $scope.address = {province: "", city : "", isNew : $scope.address.isNew};
                if (item.itemType === 2) {
                    gaTrack("pay", "generousSupport"); //无私支持
                } else {
                    gaTrack("pay", "notenerousSupport"); //非无私支持
                }
                $scope.step = 1;
                resetItemDisplay();
            }
        };

        $scope.chooseOthers = function(item){
            payService.selectedItem = null;
            $scope.step = 0;
            resetItemDisplay();
        };

        $scope.addNum = function(){
            payService.num = payService.num || 0;
            payService.setNum(parseInt(payService.num) + 1);
        };

        $scope.subNum = function(){

            payService.num = payService.num || 0;
            payService.setNum(parseInt(payService.num) - 1);
        };


        $scope.$on(PayService.Events.PAY_NUM_CHANGED, function(event){
        });


        $scope.num_valid = function(val){
            payService.setNum(val);
            $scope.$apply();
        };

        /*
         * 地址相关
         */
        $scope.$on("ADDR_CITY_CHANGED", function(event, data){
            $scope.address.city = data.city;
            $scope.address.province = data.province;
            console.log(data);
        });


        $scope.$on(Address.Events.ADDR_LOAD, function(event, data){
            $scope.addressList = data;
            $scope.defaultAddr = _.first(_.filter(data, function(item){return item['default'] == 1;}));
            if(!$scope.addressList || $scope.addressList.length == 0){
                $scope.address.isNew = 1;
            }
            $scope.$apply();
        });

        $scope.selectAddr = function(addr){

            $scope.address.isNew = 0;
            $scope.address.show = 0;
            Address.setDefault(addr.addressID);
        };

        $scope.$on(Address.Events.ADDR_DEF_CHANGED, function(event, data){
            $scope.addressList = data.list;
            $scope.defaultAddr = data.item;
            $scope.$apply();
        });
        $scope.$on(Address.Events.ADDR_DEF_CHANGED + "1", function(event, data){
            $scope.addressList = data.list;
            $scope.$apply();
        });

        $scope.$on(Address.Events.ADDR_DELETED, function(event, data){
            $scope.addressList = data.list;
            if($scope.addressList.length > 0){
                Address.setDefault($scope.addressList[0].addressID);
            }else{
                if($scope.addressList.length == 0){
                    $scope.defaultAddr = null;
                }
                $scope.address.isNew = 1;
                $scope.$apply();
            }
        });

        $scope.deleteAddr = function(addr){

            uc.modal.confirm("删除收货地址", "确认删除吗?", function(){

                Address.deleteItem(addr.addressID);
                uc.modal.close();
            });
        };

        $scope.modifyAddr = function(addr){

            $scope.address.show = 1;
            $scope.address.isNew = 0;
            $scope.address.city = addr.address.city;
            $scope.address.province = addr.address.province;
            $scope.address.address = addr.address.address;

            $scope.address.person = addr.person;
            $scope.address.telephone = addr.telephone;
            $scope.address.addressID = addr.addressID;

            Address.setDefault(addr.addressID, true).then(function(){

            });

            //$scope.addr['default'] = 1;
            $scope.defaultAddr = null;
            //$scope.$apply();
        };

        $scope.addAddr = function(addr){
            if($scope.address.isNew){
                return;
            }
            $scope.address = {isNew : 1, show : 1, province : "", city : ""};
            $scope.defaultAddr = null;
        };


        $scope.$on(Address.Events.ADDR_MODIFIED, function(event, list){
            $scope.addressList = list;
            $scope.address = {};
            $scope.$apply();
        });
        $scope.$on(Address.Events.ADDR_CREATED, function(event, list){
            $scope.addressList = list;
            $scope.address = {province : "", city : ""};
            if(list.length == 1){
                $scope.defaultAddr = list[0];
            }
            $scope.$apply();
        });

        $scope.newAddress = function(){
            Address.save($scope.address);
        };

        $scope.moreAddr = function(){
            $scope.address_show = 1;
        };

        $scope.makeOrder = function(){
            if($rootScope.makeOrderLock){
                return;
            }
            $rootScope.makeOrderLock = true;
            gaTrack("pay", "submitOrder"); //提交订单
            if(payService.selectedItem.return_type == 0 || payService.selectedItem.return_type == 1 || payService.selectedItem.return_type == 4){
                if($scope.defaultAddr){
                    payService.makeOrder($scope.defaultAddr);
                }else{
                    var promise = Address.save($scope.address)
                    if(promise) {
                        promise.then(function (list) {
                            $scope.addressList = list;
                            $scope.address = {province: "", city: ""};
                            $scope.defaultAddr = _.first(_.filter(list, function (item) {
                                return item['default'] == 1;
                            }));

                            payService.makeOrder($scope.defaultAddr);

                            //$scope.$apply();

                        }, function () {

                            $rootScope.makeOrderLock = false;
                        });
                    }else{

                        $rootScope.makeOrderLock = false;
                    }
                }
            }else{

                payService.makeOrder();
            }
        };

        $scope.$on(PayService.Events.PAY_ORDER_CREATED, function(event, data){

            document.body.scrollTop = 85;
            setTimeout(function(){
                var order_id =  data.order_id;


                if(payService.logined){

                    $location.path("/confirm")
                        .search("order_id", data.order_id);
                }else{
                    $location.path("/confirm")
                        .search("order_id", data.order_id)
                        .search("anonymous", 1);
                }
                $rootScope.forward();
                $scope.$apply();
            },10);

        });



        $scope.canMakeOrder = function(){
            return !payService.makeOrderError($scope.defaultAddr) && !$rootScope.makeOrderLock;
        };

        $scope.selfless_change = function(){
            if($scope.step == 0){
                payService.setSelectedItemDonate();
                $location.search("itemID", payService.selectedItem.itemID);
                $scope.step = 1;
                resetItemDisplay();
            }
            payService.__recalcMoney_submitOrder();
        };

        /*
         * 登录的逻辑
         */
        $scope.login = function(){
            zc.show_login(function(data){
                User.getInfo().then(function(data){
                    $(".siteHLoginBox").empty().append("<a class='pay_link' href='/zc/#/user-center/reward-order'>" + data.name + "</a>")
                });
                payService.logined = 1;
            });
        };

        $scope.$on("USER_LOGINED", function(){

            User.getInfo().then(function(data){
                $(".siteHLoginBox").empty().append("<a class='pay_link' href='/zc/#/user-center/reward-order'>" + data.name + "</a>")
            });
            payService.logined = 1;
            Address.load();
        });



        $scope.setSelflessOpt = function(i){
            payService.selfless_opt = i;

            if(i != 4){
                payService.selfless_price = '';
            }
            payService.__recalcMoney_submitOrder();
        };
    }]);
})(window, window.angular,angular.module('payApp'));
/**
 *
 * Created by weimeng on 15/7/26.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("subscribeCtrl",['$scope', 'Check', '$location', 'Subscription','EqPay', '$rootScope', 'User', function($scope, Check, $location, Subscription, EqPay, $rootScope, User){

        $scope.$parent.step_percent = '33%';
        $scope.$parent.step = 1;
        $scope.agree = 0;
        var query = $location.search();
        var subscription = new Subscription(query.dealId);
        $scope.pay = subscription;
        subscription.getSubscribeInfo();

        $scope.$on(EqPay.Events.SubscribeInfoLoad, function(){
            $rootScope.loading = 0;
            $rootScope.deal_name = subscription.dealInfo.dealInfo.name;
            $rootScope.deal_id = subscription.dealId;
            $scope.pay.insure_string = uc.currency($scope.pay.insure * 10000);
        });



        $scope.submit = function(){
            if(!$scope.agree){
                uc.modal.alert('错误提醒',"请阅读并同意以上协议");
                return;
            }
            gaTrack('subscribe', 'submitSubscribe');
            subscription.subscribe();
        };

        $scope.$on(EqPay.Events.Subscribed, function(){
            setTimeout(function(){

                $location.path("/paysubscription")
                    .search("order_id", subscription.order_id)
                    .search("dealId", subscription.dealId);
                $scope.$parent.forward();
                $scope.$apply();

            });
        });

        $scope.$on("LOGINED", function(){
            User.getInfo().then(function(data){
                $(".siteHLoginBox").empty().append("<a class='pay_link' href='/zc/#/user-center/reward-order'>" + data.name + "</a>")
            });
            subscription.getSubscribeInfo();
        });

        $scope.agreeContract = function(){
            $scope.agree = 1;
        };

    }]);
})(window, window.angular,angular.module('payApp'));

/**
 *
 * Created by weimeng on 15/7/26.
 */

(function(window, angular,ucApp) {
    'use strict';
    ucApp.controller("wpayCtrl",['$scope', 'Check', '$location', 'User', '$rootScope', function($scope, Check, $location, User, $rootScope){
        var query = $location.search();
        $scope.qrcode_url = query.url;
        $rootScope.deal_name = query.deal_name;
        $scope.money = query.money;
        $scope.notice_sn = query.notice_sn;
        $scope.create_time =query.create_time ;


        var I = setInterval(function(){
            var url1 = "/pay2-weixin_query/notice_sn-" + $scope.notice_sn;
            $.post(url1, function(data){
                var d = $.parseJSON(data);

                if(d.msg){

                    clearInterval(I);
                    uc.modal.alert("支付消息", d.msg, function(){
                        window.location.href = '/zc/#/user-center/reward-order';
                    });

                }else if(d.success){
                    window.location.href = '/callback-pay_success/n-' + $scope.notice_sn;
                }
            });
        }, 5000);
    }]);
})(window, window.angular,angular.module('payApp'));

/**
 * 地址选择控件
 * @author weimeng
 */

(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('address',['Address', function (Address) {
        return {
            restrict: 'A',
            replace: false,
            scope : {
                province : '=',
                city : '='
            },
            link: function (scope, elem, attrs) {
                var $province = $("#" + attrs['provinceSelector']);
                var $city = $("#" + attrs['citySelector']);
                var provinceList = [];
                var cityList = [];





                scope.$watch('province', function(){
                    if(!scope.province){
                        Address.emptySelection();
                    }
                    Address.loadProvinces(scope.province, scope.city);
                });
                scope.$watch("city", function(){

                    Address.loadProvinces(scope.province, scope.city);
                });
                scope.$on(Address.Events.ADDR_PROVINCES_LOAD, function(event, data){
                    provinceList = data;
                    render();
                });


                scope.$on(Address.Events.ADDR_PROVINCE_CHANGED, function(event, data){
                    cityList = data.cityList;
                });

                scope.$on(Address.Events.ADDR_CITY_CHANGED, function(event, data){
                    render();
                    scope.province = data.province;
                    scope.city = data.city;
                    scope.$apply();
                });

                $province.change(function(){
                    var provinceId = $province.val();
                    Address.changeProvince(provinceId);
                });
                $city.change(function(){
                    var cityId = $city.val();
                    Address.changeCity(cityId);
                });

                function render(){
                    $province.empty();
                    $city.empty();
                    $province.append("<option value=''>请选择</option>");
                    $city.append("<option value=''>请选择</option>");
                    _.each(provinceList, function(p){
                        var option = $("<option></option>");
                        option.text(p.name);
                        option.val(p.zone_id);
                        $province.append(option);
                    });

                    _.each(cityList, function(c){
                        var option = $("<option></option>");
                        option.text(c.name);
                        option.val(c.zone_id);
                        $city.append(option);
                    });

                    $province.val(Address.getSelectedProvinceId());
                    $city.val(Address.getSelectedCityId());
                    if($.browser.msie && parseInt($.browser.version, 10) <= 9){
                        $province.width(0).width("100%");
                        $city.width(0).width("100%");
                    }

                }
            }
        };
    }]);
})(window, window.angular,$,angular.module('payApp'));


/**
 * @author weimeng
 */

(function(window, angular,$,payApp) {
    'use strict';
    payApp.animation('.animate-slide', ['$rootScope',function ($rootScope) {
        return {
            enter : function(element, df){
                var $element = $(element);
                var dir = $rootScope.dir;

                $element.css("position", 'absolute');
                if(dir == 'left'){

                    $element.css("left", '100%');
                    $element.animate({
                        left : "0%"
                    }, 1000, function(){
                        $element.css("position", 'relative');
                        df();
                    });

                }else if(dir == 'right'){
                    $element.css("left", '-100%');
                    $element.animate({
                        left : "0%"
                    }, 1000, function(){
                        $element.css("position", 'relative');
                        df();
                    });
                }else{


                    df();

                    $(".animate-slide").css("position", 'relative');
                }


            },
            move : function(element){
            },
            leave: function(element, df){
                var $element = $(element);
                var dir = $rootScope.dir;

                $element.css("position", 'absolute');
                if(dir == 'left'){
                    $element.css("left", 0);
                    setTimeout(function(){
                        $element.animate({
                            left : "-100%"
                        }, 1000, function(){
                            df();
                        });
                    }, 10);
                }else if(dir == 'right'){
                    $element.css("left", 0);
                    setTimeout(function(){
                        $element.animate({
                            left : "100%"
                        }, 1000, function(){
                            df();
                        });
                    }, 10);
                }else{

                    $(".animate-slide").css("position", 'relative');
                    df();
                }


            }
        };
    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * @author weimeng
 */

(function(window, angular,$,payApp) {
    'use strict';
    payApp.animation('.animate-fade', [function () {
        return {
            enter : function(element, df){
                $(element).hide();
                $(element).fadeIn(500, function(){

                    df();
                });
            },
            move : function(element){
                $(element).slideDown(500, function(){

                    df();
                });
            },
            leave: function(element, df){

                $(element).fadeOut(500, function(){

                    df();
                });

            }
        };
    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('fancybox', function () {
        return {
            restrict: 'A',
            replace: false,
            scope  : {
                'images' : "="
            },
            link: function (scope, elem, attrs) {

                $(elem).click(function(){

                    var src = $(elem).find("img").attr("src");
                    sitePop.oriPic(src);
                });
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * @author weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('login', function () {

        return {
            restrict: 'AE',
            replace: true,
            scope : {
                mobile : "="
            },

            templateUrl:uc.siteTmplUrl('views/login.html'),
            link: function (scope, elem, attrs) {

            },
            controller : 'loginCtrl'
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('navigation', function () {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl:uc.siteTmplUrl('views/navigation.html'),
            link: function (scope, elem, attrs) {
                $(elem).children('span').click(function(){
                    $(elem).children('span').removeClass('active');
                    $(this).addClass('active');
                });
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('ngFocus', ['$parse', function($parse) {
        return function(scope, element, attr) {
            var fn = $parse(attr['ngFocus']);
            element.bind('focus', function(event) {
                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });
        }
    }]);

    payApp.directive('ngBlur', ['$parse', function($parse) {
        return function(scope, element, attr) {
            var fn = $parse(attr['ngBlur']);
            element.bind('blur', function(event) {
                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });
        }
    }]);
})(window, angular, $, angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */
(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('ngElementReady', function () {
        return {
            restrict: 'AE',
            replace: false,
            link: function (scope, elem, attrs) {
                $(elem).show();
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('numInput', function () {
        return {
            restrict: 'A',
            replace: false,
            scope : {
                'validate' : "&",
                'errorStr' : "=errorStr"
            },
            link: function (scope, elem, attrs) {

                var $elem = $(elem);
                var $target = $("#" + attrs['target']);
                var validate = scope.validate();
                var max = attrs['max'];
                $elem.keydown(function(e){

                    setTimeout(function(){

                        var val = $elem.val();
                        if(val > 100){
                            $elem.val(100);
                            val = 100;
                        }
                        var errStr= validate(val);
                        if(errStr){
                            $target.addClass("error-border");
                        }else{
                            $target.removeClass("error-border");
                        }

                    }, 0);


                }) ;
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('numInput1', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                var $elem = $(elem);
                var $target = $("#" + attrs['target']);

                function validate(){
                    var val = $elem.val();
                    if(val.length > 8){
                        val = val.substr(0, 8);
                    }
                    if(val == ''){

                        $target.removeClass("error-border");
                        return;
                    }
                    if(/^[0-9]+$/.test(val)){
                        $target.removeClass("error-border");
                    }else{
                        $target.addClass("error-border");
                    }
                }
                /*
                $elem.keydown(function(e){
                    setTimeout(function(){
                        validate();
                    }, 0);
                }) ;
                */
                scope.$watch(attrs.ngModel, function(){
                    validate();
                });
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('numInput3', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                var $elem = $(elem);
                var $target = $("#" + attrs['target']);
                $elem.keydown(function(e){

                    setTimeout(function(){

                        var val = $elem.val();
                        if(val.length > 8){
                            val = val.substr(0, 8);
                        }
                        if(val == ''){

                            $target.removeClass("error-border");
                            return;
                        }
                        if(/^[0-9]+$/.test(val)){
                            $target.removeClass("error-border");
                        }else{
                            $target.addClass("error-border");
                        }

                    }, 0);


                }) ;
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/16.
 */

(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('pagination', function () {
        return {
            restrict: 'AE',
            scope: {
                pages: '=pages',
                currentPage:'=currentPage'
            },
            replace: true,
            link: function (scope, elem, attrs) {
                function create(page){
                    var str_prv='<a class="prev">上一页</a>',
                        str_next='<a class="next">下一页</a>',
                        str_begin ='<div class="pager">',
                        str_end ='<div style="clear: both;"></div></div>',
                        str = '';
                    var init = function(){
                        $(elem).html('');
                        if(scope.currentPage != page){
                            scope.currentPage = page;
                            scope.$apply();
                        }else{
                            scope.currentPage = page;
                        }
                        if(scope.currentPage == 1){
                            str_prv = '';
                        }
                        if(scope.currentPage == scope.pages){
                            str_next = '';
                        }
                    };
                    var loop = function(begin,end){
                        for(var i=begin;i<=end;i++){
                            if(scope.currentPage == i){
                                str += '<a class="selected">'+i+'</a>';
                            }else{
                                str += '<a>'+i+'</a>';
                            }
                        }
                    };
                    var addEndPage = function(){
                        str += '<a>'+(scope.pages-1)+'</a>';
                        str += '<a>'+(scope.pages)+'</a>';
                    };
                    var buildOther = function(){
                        str += '<a>1</a>';
                        str += '<a>2</a>';
                        if(scope.currentPage>5){
                            str += '<a page="'+(scope.currentPage-3)+'">...</a>';
                        }
                        var begin = scope.currentPage - 2;
                        var end = scope.currentPage + 2;
                        if(end > scope.pages){
                            end = scope.pages;
                            begin = end - 4;
                            if(scope.currentPage - begin < 2){
                                begin = begin-1;
                            }
                        }else if(end + 1 == scope.pages){
                            end = scope.pages-2;
                        }
                        loop(begin,end);
                        if(end != scope.pages && scope.pages-scope.currentPage>3){
                            str += '<a page="'+(scope.currentPage+3)+'">...</a>';
                        }
                        if(scope.currentPage<scope.pages-2){
                            addEndPage();
                        }
                    };
                    var doPage = function(){
                        if(scope.pages <= 8){
                            loop(1,scope.pages);
                        }else{
                            if(scope.currentPage <= 4){
                                loop(1,5);
                                str += '<a page="6">...</a>';
                                addEndPage();
                            }else{
                                buildOther();
                            }
                        }
                    };
                    var createElement = function(){
                        $(elem).html(str_begin + str_prv + str + str_next +str_end);
                        $(elem).find('a').click(function(){
                            if($(this).attr('class') == 'prev'){
                                create(page-1);
                                return;
                            }
                            if($(this).attr('class') == 'next'){
                                create(page+1);
                                return;
                            }
                            if($(this).attr('page')){
                                create(parseInt($(this).attr('page'),10));
                                return;
                            }
                            var val = parseInt($(this).text(),10);
                            create(val);
                        });
                    }
                    init();
                    doPage();
                    createElement();
                };
                create(scope.currentPage);
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));



/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('placeHolder', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                var text = attrs['placeHolder'];
                /*
                if(supDetectObj.placeH){
                    elem.attr("placeholder", text);
                }
                else{
                */
                var position = elem.position();
                var hd = $("<span class='placeholder'></span>");
                function pxVal(str){
                    var m = str.match(/(\d+)px/);
                    return parseInt(m[1]);
                }
                var paddingLeft = pxVal($(elem).css("padding-left"));
                var lineHeight = $(elem).css("line-height");
                var paddingTop = pxVal($(elem).css("padding-top"));

                hd.css("line-height", lineHeight);

                hd.css("padding-top", paddingTop - 1 + 'px');
                hd.text(text);
                hd.css("left", position.left + paddingLeft +  2 + "px");

                hd.css("top", position.top + 1 + "px");


                function showHide(){
                    if(!$(elem).val()){
                        hd.show();
                    }else{
                        hd.hide();
                    }
                }

                $(elem[0].parentNode).append(hd);

                hd.click(function(){
                    $(elem).focus();
                });

                $(elem).bind("input propertychange", function(){
                    showHide();
                });

                scope.$watch(attrs.ngModel, function(){
                    showHide();
                });


                $(elem).focus(function(){
                   showHide();
                }).blur(function(){
                   showHide();
                });


            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */
(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('qrcode', function () {
        return {
            restrict: 'AE',
            replace: false,
            link: function (scope, elem, attrs) {
                var qr = qrcode(10, 'M');
                qr.addData(attrs['url']);
                qr.make();
                $(elem).html(qr.createImgTag(5));
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * @author weimeng
 */

(function(window, angular,$,payApp) {
    'use strict';
    payApp.animation('.animate-reward', [function () {
        return {
            enter : function(element, df){
                var $elem = $(element);
                $elem.hide();

                var index = $elem.attr("data-index");
                var all = $elem.attr("data-all");
                var delay = 0;

                if(all){
                    delay = 50 * (all - index);
                }
                setTimeout(function(){
                    $elem.slideDown(500, function(){
                        $elem.show();
                        df();
                    });
                }, delay);

            },
            move : function(element){
                $(element).slideDown(500, function(){

                    df();
                });
            },
            leave: function(element, df){
                var $elem = $(element);

                var index = $elem.attr("data-index");
                var all = $elem.attr("data-all");
                var delay = 0;
                var selected = $elem.attr("data-selected");

                if(all){
                    delay = 50 * index;
                }

                if(selected){
                    $elem.slideUp(all * 50 + 500, function(){
                        df();
                    });
                }else{
                    setTimeout(function(){
                        $elem.slideUp(300, function(){
                            df();
                        });
                    }, delay);
                }



            }
        };
    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('selector', function () {
        return {
            restrict: 'A',
            replace: true,
            scope : {
                list : "=",
                value : "=",
                ngModel : "=",
                changeHandler : "&"
            },
            link: function (scope, elem, attrs) {

                var tPath = attrs.textPath;
                var vPath = attrs.valuePath;
                var $elem = $(elem);
                scope.$watch("list", function(){
                    render();
                });

                $elem.change(function(){
                    var newValue = $elem.val();
                    var obj = _.first(_.filter(scope.list, function(item){return item[vPath] == newValue;}));
                    if(obj){

                        scope.value = obj;

                        scope.$apply(function(){

                            setTimeout(function(){
                                changeHandler();
                            }, 0);
                        });

                    }

                });

                var changeHandler = scope.changeHandler();
                function render(){
                    $elem.empty();
                    _.each(scope.list, function(item){
                        var $option = $("<option></option>");

                        $option.text(item[tPath]);
                        $option.attr("value", item[vPath]);
                        $elem.append($option);
                    });
                    if(scope.value){
                        $elem.val(scope.value[vPath]);
                    }
                    $elem.width(0).width("");
                }

            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('textInput', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {


                var max = attrs['max'];
                var cls =  attrs['hintClass'] || 'text-length-hint' ;
                var $count = $("<span class='" + cls + "'></span>");
                $count.text("0/" + max);
                $(elem[0].parentNode).append($count);
                $(elem).bind("input propertychange", function(){

                    if($(this).val().length > max){
                        $(this).val($(this).val().substring(0, max));
                    }
                    $count.text($(this).val().length + "/" + max);
                });


                if(attrs['elastic']){
                    $(elem).elastic();
                }
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/20.
 */

(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.directive('tooltip', function () {
        /**
         * attrs
         *      title|content 必选 多行使用||分割
         *      direction top bottom lef right
         *      trigger click hover focus， 默认hover focus鼠标滑倒元素或焦点掉元素上显示
         *      two-dimensional-code false 二维码/红包，该属性为true时，content或title中的内容必须为二维码的图片url
         */
        return {
            scope : {
                showText : '=showText'
            },
            restrict: 'A',
            replace: false,
            link: function (scope, elem, attrs) {
                var direction = attrs.direction || 'bottom',
                    trigger = attrs.trigger || 'hover focus';
                var customer_content = attrs.title || attrs.content;
                var text_arr = customer_content.split('||');

                if(text_arr.length>1){
                    customer_content = '';
                    for(var i=0 ;i<text_arr.length;i++){
                        customer_content += text_arr[i]+'<br />';
                    }
                }
                if(attrs.twoDimensionalCode){
                    customer_content ='<div><img src="'+customer_content+'" width="300" height="300"></div><div style="text-align: center;font-size: 14px; line-height: 20px;">微信扫上方二维码发红包给朋友</div>';
                };
                if(scope.showText){
                    customer_content = scope.showText;
                }
                scope.$watch('showText',function(newValue,oldValue){
                    $(elem).tooltip({
                        content:newValue,
                        animation: true,
                        html : true,
                        trigger : trigger,
                        placement : direction
                    });
                });
                $(elem).hover(function(){
                    setTimeout(function(){
                        $(elem).parent().find(".tooltip").css("filter", "none");
                    }, 10);
                }, function(){

                    $(elem).parent().find(".tooltip").css("filter", "alpha(opacity=0)");
                });

                $(elem).tooltip({
                    content:customer_content,
                    animation: true,
                    html : true,
                    trigger : trigger,
                    placement : direction
                });
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/22.
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('upload', ['Upload',function (Upload) {
        return {
            restrict: 'EA',
            replace: true,
            template:'<img ng-model="files" ngf-select>',
            link: function (scope, elem, attrs) {
                scope.files =[];
                scope.$watch('files', function (files) {
                    if (files && files.length) {
                        for (var i = 0; i < files.length; i++) {
                            var file = files[i];
                            Upload.upload({
                                url:attrs.uploadUrl,
                                //fields: {'username': scope.username},
                                file: file
                            }).progress(function (evt) {
                                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                            }).success(function (data, status, headers, config) {
                                console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                            }).error(function (data, status, headers, config) {
                                console.log('error status: ' + status);
                            })
                        }
                    }
                });
            }
        };
    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/16.
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('validation', function () {
        /**
         * scope
         *      maxLength 最大长度
         *      minLength 最小长度
         *      rangeLength 长度区间，数组形式传入[最小值,最大值]
         *      maxValue 最大值
         *      minValue 最小值
         *      rangeValue 值区间，数组形式传入[最小值,最大值]
         *      remoteMethod 远程验证函数，必须是可执行函数，返回promise
         *      remoteMethodParam 远程验证函数的参数，数组形式传入
         *           [
         *               { isInputTarget : true, '#username' },
         *               { isInputTarget : true, '.active' },
         *               { isInputTarget : false, 13922311345 }
         *               ...
         *           ]
         * attrs
         *      label 必选
         *      required
         *      valid_type 验证类型，如email，telephone，详细请参见methods中的定义，如需自定义，请适当向methods中添加函数
         *      error_to 必选，显示错误信息内容的区域element的id或者class，选择器必须只得到一个element
         *      equal_to 比较值是否相等，传入比较对象的element的id或者class，选择器必须只得到一个element
         *      invalid_data 验证未通过会在标签上绑定该属性，提交之前验证表单中是否存在有该属性的元素
         *      custom_error 自定义错误信息，定义远程验证未通过或者使用equalTo未通过时显示的信息
         */
        return {
            scope : {
                maxLength:'=maxLength',
                minLength:'=minLength',
                rangeLength:'=rangeLength',
                maxValue:'=maxValue',
                minValue:'=minValue',
                rangeValue:'=rangeValue',
                remoteMethod:'=remoteMethod',
                remoteMethodParam:'=remoteMethodParam'
            },
            restrict: 'A',
            replace: true,
            link: function (scope, elem, attrs) {
                var errorMsg ={
                    required : '请输入'+attrs.label,
                    error:attrs.label+'格式不正确',
                    waiting:'正在向服务器验证...'
                };
                var methods = {
                    required: function() {
                        return $.trim($(elem).val()).length>0;
                    },
                    telephone:function(){
                        return /^0\d{2,3}-?\d{7,8}$/.test($(elem).val());
                    },
                    mobilePhone:function(){
                        return /^1[3|4|5|7|8][0-9]\d{8}$/.test($(elem).val());
                    },
                    postCode:function(){
                        return /^[1-9][0-9]{5}$/.test($(elem).val());
                    },
                    money:function(){
                        return /^\d+(\.\d{1,2})?$/.test($(elem).val());
                    },
                    number: function () {
                        return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test($(elem).val());
                    },
                    digits: function () {
                        return /^\d+$/.test($(elem).val());
                    },
                    email: function () {
                        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test($(elem).val());
                    },
                    url: function () {
                        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test($(elem).val());
                    },
                    date: function () {
                        return !/Invalid|NaN/.test(new Date($(elem).val()).toString());
                    },
                    dateISO: function () {
                        return /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test($(elem).val());
                    },
                    minLength: function () {
                        return scope.minLength <= $.trim($(elem).val()).length;
                    },
                    maxLength: function () {
                        return scope.maxLength >= $.trim($(elem).val()).length;
                    },
                    rangeLength: function () {
                        var length = $.trim($(elem).val()).length;
                        return ( length >= scope.rangeLength[0] && length <= scope.rangeLength[1] );
                    },
                    min: function () {
                        return  $.trim($(elem).val()) >= scope.minValue;
                    },
                    max: function () {
                        return  $.trim($(elem).val()) <= scope.maxValue;
                    },
                    range: function () {
                        var value = $.trim($(elem).val());
                        return ( value >= scope.rangeValue[0] && value <= scope.rangeValue[1] );
                    },
                    equalTo: function () {
                        var sourceValue =  $.trim($(elem).val());
                        var targetValue = $.trim($(attrs.equalTo).val());
                        return sourceValue == targetValue;
                    }
                };

                $(elem).on('blur', function(){
                    if(attrs.required){
                        if(!methods.required()){
                            $(attrs.errorTo).show().text(errorMsg.required);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
                    if(attrs.validType){
                        if(!methods[attrs.validType]()){
                            var error = attrs.customError || errorMsg.error;
                            $(attrs.errorTo).show().text(error);
                            $(elem).attr('invalid_data','true');
                            return;
                        }
                    }
                    if(scope.remoteMethod){
                        var arg=[];
                        for(var item in scope.remoteMethodParam){
                            if(item.isInputTarget){
                                arg.push($.trim($(item.value)));
                            }else{
                                arg.push(item.value);
                            }
                        };
                        $(elem).attr('invalid_data','true');
                        $(attrs.errorTo).show().text(errorMsg.waiting);
                        scope.remoteMethod.apply(null,arg).then(function(data){
                            if(data.success){
                                $(attrs.errorTo).hide();
                                $(elem).removeAttr('invalid_data');
                            }else{
                                $(attrs.errorTo).show().text(attrs.custom_error);
                            }
                        });

                        return;
                    }
                    $(elem).removeAttr('invalid_data');
                    $(attrs.errorTo).hide();
                });
            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));

/**
 * Created by weimeng
 */
(function(window, angular,$,payApp) {
    'use strict';
    payApp.directive('vcode', function () {
        return {
            restrict: 'A',
            replace: false,
            scope : {
            },
            link: function (scope, elem, attrs) {
                var $elem = $(elem);

            }
        };
    });
})(window, window.angular,$,angular.module('payApp'));

/**
 * Created by YL Huang on 2015/7/21.
 */
(function(window, angular,payApp) {
    'use strict';
    payApp.filter('partialHide', function () {

        var filterfun = function(name,type){
            function isNumStr(str){
                return /^[0-9]*$/.test(str);
            };
            if(!name) return '';
            var strs = name.toString().split('');
            if(strs.length==0) return '';
            if(type==='realName'){
                if(strs.length==0) return;
                if(strs.length==1) return strs[0]+'*';
                if(strs.length>2) return strs[0]+'*'+strs[strs.length-1];
                else return strs[0]+'*';
            }
            if(type==='mobilePhone' && strs.length===11 && isNumStr(name)){
                var str = '';
                for(var i=0;i<3;i++){
                    str+=strs[i];
                }
                for(var i=3;i<strs.length-4;i++){
                    str+='*';
                }
                for(var i=strs.length-4;i<strs.length;i++){
                    str+=strs[i];
                }
                return str;
            }
            if(type==='idCard'&& (strs.length===15|| strs.length===18)&& isNumStr(name)){
                var str = '';
                for(var i=0;i<3;i++){
                    str+=strs[i];
                }
                for(i=3;i<strs.length-4;i++){
                    str+='*';
                }
                for(i=strs.length-4;i<strs.length;i++){
                    str+=strs[i];
                }
                return str;
            }
        };
        return filterfun;
    });

    payApp.filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
})(window, window.angular,angular.module('payApp'));
/**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,ucApp) {
    'use strict';
    ucApp.factory('Common', ['$rootScope','$http', '$q','$state', function ($rootScope,$http, $q,$state) {
        return {
            redirect : function(router){
                $state.go(router);
            },
            noInvitationCode : function(){
                $rootScope.invitationCode =  {
                    index  : 0,
                    showCodeImage : false
                }
            },
            getPageCount : function(total,pageSize){
                if (total % pageSize > 0) {
                    return parseInt(total / pageSize,10) + 1;
                }
                return parseInt(total / pageSize,10);
            },
            buildNumArray : function(start,end,desc){
                var arr=[];
                if(desc){
                    for(var i=end;i>=start;i--){
                        arr.push(i);
                    }
                }else{
                    for(var i=start;i<=end;i++){
                        arr.push(i);
                    }
                }
                return arr;
            },
            httpGet:function(url,parma){
                var defer = $q.defer();
                $http({method: 'GET',url: url,params: parma}).success(function (data) {
                    if (data && data.errno != 0 && data.errno!=6000) {
                        uc.modal.alert('信息提示',data.error);
                        defer.resolve(null);
                    }else{
                        defer.resolve(data.data);
                    }
                }).error(function () {
                    uc.modal.alert('信息提示','网络异常，请稍后再试！');
                    defer.reject();
                });
                return defer.promise;
            },
            httpGet1:function(url,parma){
                var defer = $q.defer();
                $http({method: 'GET',url: url,params: parma}).success(function (data) {
                    defer.resolve(data);
                }).error(function () {
                    uc.modal.alert('信息提示','网络异常，请稍后再试！');
                    defer.reject();
                });
                return defer.promise;
            },
            httpPost1:function(url,parma){
                var defer = $q.defer();
                $http({
                    method: 'post',url: url,data: parma,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).success(function (data) {
                    defer.resolve(data);
                }).error(function () {
                    uc.modal.alert('信息提示', '网络异常，请稍后再试！');
                    defer.reject();
                });
                return defer.promise;
            },
            httpPost: function (url, parma) {
                var defer = $q.defer();
                $http({
                    method: 'post',url: url,data: parma,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var p in obj) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                        return str.join("&");
                    }
                }).success(function (data) {
                    if (data.errno) {
                        setTimeout(function () {
                            uc.modal.alert('信息提示', data.error);
                        }, 1000);
                        //defer.resolve({error: 1});
                    } else {
                        defer.resolve(data.data);
                    }
                }).error(function () {
                    uc.modal.alert('信息提示', '网络异常，请稍后再试！');
                    defer.reject();
                });
                return defer.promise;
            }
        };
    }]);

})(window, window.angular,$,angular.module('payApp'));
/**
 * 地址相关类
 * @author weimeng
 */

(function(window, angular,$,payApp) {
    payApp.factory('Address', ['$http', '$q', '$rootScope', 'Check', function ($http, $q, $rootScope, Check) {
        var list = [];
        var provinceList = [];
        var cityList = [];
        var selectedProvinceId;
        var selectedCityId;

       /**
         * 获取当前数据
         */
        function getData(){
            return list;
        }

        function _ajax(options){
            var _s = this;
            return $.ajax({
                url : options.url,
                type : options.method,
                cache : options.cache || false,
                dataType : 'json',
                data : options.data,
                success : function(data){

                    if(data.errno){
                        if(data.errno == '1004'){
                            $rootScope.$broadcast("LOGIN_ERROR", data.error);
                        }else{
                            $rootScope.$broadcast("LOGIC_ERROR", data.error);
                        }
                    }else{
                        options.success.call(_s, data.data);
                    }
                },
                error : function(){
                    uc.modal.alert("网络错误", "无法连接到服务器，请确认网络环境然后重试");
                }
            });
        };

        var Events = {
            ADDR_CREATED : "ADDR_CREATED",
            ADDR_DELETED : "ADDR_DELETED",
            ADDR_DEF_CHANGED : "ADDR_DEF_CHANGED",
            LOGIC_ERROR : "LOGIC_ERROR" ,
            ADDR_CITY_CHANGED : "ADDR_CITY_CHANGED",
            ADDR_PROVINCE_CHANGED : "ADDR_PROVINCE_CHANGED",
            ADDR_PROVINCES_LOAD : "ADDR_PROVINCES_LOAD",
            ADDR_MODIFIED : "ADDR_MODIFIED",
            ADDR_LOAD : "ADDR_LOAD"
        };


        /**
         * 删除
         */
        function deleteItem(addressID){
            _ajax({
                url : uc.serviceUrl("user/deladdress?v=1"),
                method : "POST",
                cache : false,
                data : {addressID : addressID},
                success : function(data){
                    item = _.first(_.filter(list, function(o){return o.addressID === addressID; }));
                    list = _.filter(list, function(o){return o.addressID != addressID; });
                    $rootScope.$broadcast(Events.ADDR_DELETED, {list : list, item : item});
                }
            });
        }


        /**
         * 设置默认地址
         */
        function setDefault(addressID, noBroadcast){
            return _ajax({
                url : uc.serviceUrl("user/setdefaultaddr?v=1"),
                data : {addressID : addressID},
                cache : false,
                method : "POST",
                success : function(data){
                    var item = _.first(_.filter(list, function(o){return o.addressID === addressID; }));
                    _.each(list, function(o){
                        o['default'] = 0;
                    });
                    item['default'] = 1;
                    if(!noBroadcast)
                        $rootScope.$broadcast(Events.ADDR_DEF_CHANGED, {list : list, item : item});
                    else
                        $rootScope.$broadcast(Events.ADDR_DEF_CHANGED + "1", {list : list, item : item});
                }
            });
        }


        /**
         * 保存收货地址
         */
        function saveItem(item){
            var defer = $q.defer();
            var errors = Check.checkAll([
                {
                    value : item.person,
                    rules : ['required'],
                    hint  : "请填写收货人"
                },
                {
                    value : item.telephone,
                    rules : ['required', 'mobile'],
                    hint  : "请输入正确的手机号"
                },
                {
                    value : item.province,
                    rules : ['required', 'minLength-2'],
                    hint  : ['请选择省份']
                },
                {
                    value : item.city,
                    rules : ['required', 'minLength-2'],
                    hint  : '请选择城市'
                },
                {
                    value : item.address,
                    rules : ['required', 'minLength-6'],
                    hint  : '收货地址的长度不可少于6个字符'
                }]);
            if(errors.length > 0){
                uc.modal.alert("输入提示", errors[0]);
                return false;
            }
            if(item.addressID){
                var _s = this;
                $.ajax({
                    url : uc.serviceUrl("user/modaddress?v=1"),
                    dataType : 'json',
                    data : item,
                    type: 'POST',
                    cache : false,
                    success : function(data){
                        if(data.errno){
                            uc.modal.alert("填写错误", data.error);
                            defer.reject();
                        }else{
                            var lItem = _.first(_.filter(list, function(i){
                                return i.addressID = item.addressID;
                            })) ;

                            lItem.address.address = item.address;
                            lItem.telephone = item.telephone;
                            lItem.person = item.person;
                            lItem.address.province = item.province;
                            lItem.address.city = item.city;

                            defer.resolve(list);
                            //$rootScope.$broadcast(Events.ADDR_MODIFIED,list);
                        }
                    },
                    error :function(xhr, state, err){
                        defer.reject();
                    }
                });

            }else{
                $.ajax({
                    url : uc.serviceUrl("user/addaddress?v=1"),
                    dataType : 'json',
                    data : item,
                    type : 'POST',
                    cache : false,
                    success : function(data){

                        if(data.errno){
                            uc.modal.alert("填写错误", data.error);
                            defer.reject();
                            //$rootScope.$broadcast(Events.LOGIC_ERROR, data.error);
                        }else{
                            var newItem = {
                                address : {
                                    address : item.address,
                                    city : item.city,
                                    province : item.province
                                },
                                addressID : data.data.addressID,
                                person : item.person,
                                telephone : item.telephone
                            };

                            setDefault(data.data.addressID);
                            list.push(newItem);
                            _.each(list, function(_addr){
                                _addr['default'] = 0;
                            });


                            newItem['default'] = 1;
                            defer.resolve(list);
                            //$rootScope.$broadcast(Events.ADDR_CREATED, list);
                        }
                    },
                    error :function(xhr, state, err){
                        defer.reject();
                    }
                });
            }
            return defer.promise;
        }

        /**
         * 加载所有的地址
         */
        function loadAll(){
            var url = uc.serviceUrl("user/getaddresslist?v=1");
            $.ajax({
                url : url,
                dataType : 'json',
                cache : false,
                success : function(data){
                    list = data.data;
                    list = _.sortBy(list, function(addr, i){return addr['default'] ? -100 : i; });
                    $rootScope.$broadcast(Events.ADDR_LOAD, list);
                }
            });
        }

        /**
         * 加载所有的省份
         */
        function loadProvinces(province, city){
            _ajax({
                url : uc.serviceUrl('address/provincelist?v=3'),
                cache : true,
                dataType : 'json',
                success : function(data){
                    var p = {};
                    provinceList = data;
                    if(province){
                        p = getProvinceByName(province);
                        changeProvince(p.zone_id, city);
                    }
                    $rootScope.$broadcast(Events.ADDR_PROVINCES_LOAD, data);
                },
                error : function(){}
            });
        }

        /**
         * 改变省份
         */
        function changeProvince(provinceId, city){
            selectedProvinceId = provinceId;
            selectedCityId = undefined;
            _ajax({
                url : uc.serviceUrl("address/citylist?v=3"),
                cache : true,
                data : {provinceId : provinceId},
                success : function(data){
                    cityList = data;
                    var province = getProvince();
                    var c = {};
                    if(city){
                        c = getCityByName(city);
                        if(c)
                            selectedCityId = c.zone_id;
                    }
                    $rootScope.$broadcast(Events.ADDR_PROVINCE_CHANGED, {cityList : cityList, province: province.name, provinceId : province.zone_id});
                    $rootScope.$broadcast(Events.ADDR_CITY_CHANGED, {cityId: selectedCityId, provinceId : provinceId, cityList : cityList, city : c.name, cityId : c.zone_id , province : province.name});
                }
            });
        }

        function getProvince(){
            var provinceItem = _.first(_.filter(provinceList, function(item){return selectedProvinceId === item.zone_id; }));
            return provinceItem;
        }

        function getCity(){
            return _.first(_.filter(cityList, function(item){return selectedCityId === item.zone_id; }));
        }

        function getProvinceByName(name){
            return _.first(_.filter(provinceList, function(item){return name === item.name; }));
        }

        function getCityByName(name){
            return _.first(_.filter(cityList, function(item){return name === item.name; }));
        }


        /**
         * 改变城市
         */
        function changeCity(cityId){
            selectedCityId = cityId;
            var cityItem = getCity();
            var provinceItem = getProvince();
            $rootScope.$broadcast(Events.ADDR_CITY_CHANGED, {cityId: cityId, provinceId : provinceItem.zone_id, city : cityItem.name, province : provinceItem.name});
        }


        return {
            load : loadAll,
            deleteItem : deleteItem,
            loadProvinces : loadProvinces,
            changeProvince : changeProvince,
            changeCity : changeCity,
            save : saveItem,
            setDefault : setDefault,
            Events : Events,
            getSelectedProvinceId : function(){return selectedProvinceId;},

            getSelectedCityId : function(){return selectedCityId;},
            emptySelection : function(){selectedProvinceId = ''; selectedCityId = '';}
        };

    }]);
})(window, window.angular, $, angular.module('payApp'));

/**
 * Created by weimeng on 15/7/26.
 */
/**
 * (function(window, angular,$,payApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,payApp) {
    payApp.factory('Check', ['$http', '$q', '$rootScope', function ($http, $q, $rootScope) {
        var Check = {
            required: function(value) {
                return value && value.length > 0;
            },
            email: function(value) {
                return !value  || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },
            mobile: function(value) {
                return !value || /^1[3|4|5|7|8][0-9]\d{8}$/.test(value);
            },
            telphone: function(value) {
                return !value || /^(\d{3}-\d{8}|\d{4,5}-\d{7,8})$/.test(value);
            },
            range: function(value, param) {
                param = param.split("-");
                return !value || (value >= parseFloat(param[0]) && value <= parseFloat(param[1]));
            },
            min: function(value, param) {
                return !value || (value >= parseFloat(param));
            },
            max: function(value, param) {
                return value.length === 0 || value <= parseFloat(param);
            },
            rangeEqual: function(value, param) {
                return value.length === 0 || value.length === parseInt(param, 10);
            },
            rangelength: function(value, param) {
                param = param.split("-");
                return value.length === 0 || (value.length >= parseInt(param[0], 10) && value.length <= parseInt(param[1], 10));
            },
            minLength: function(value, param) {
                return value && (value.length === 0 || value.length >= parseInt(param, 10));
            },
            maxLength: function(value, param) {
                return value && (value.length === 0 || value.length <= parseInt(param, 10));
            },
            length : function (value, param){
                return value && value.length == param;
            },
            byteRangeLength: function(value, param) {
                param = param.split("-");
                return value.length === 0 || (value.getBytes() >= parseInt(param[0], 10) && value.getBytes() <= parseInt(param[1], 10));
            },
            byteMinLength: function(value, param) {
                return value.length === 0 || value.getBytes() >= parseInt(param, 10);
            },
            byteMaxLength: function(value, param) {
                return value.length === 0 || value.getBytes() <= parseInt(param, 10);
            },
            byteRangeEqual: function(value, param) {
                return value.length === 0 || value.getBytes() === parseInt(param, 10);
            },
            equalTo: function(value, equalToElement) {
                return value.length === 0 || value.length > 0 && value === $("input[name='" + equalToElement + "']").val();
            },
            digits: function(value) {
                return value.length === 0 || /^\d+$/.test(value);
            },
            post: function(value) {
                return value.length === 0 || /^[0-9]{6}$/.test(value);
            },
            cardId: function(value) {
                return value.length === 0 || /^(\d{18,18}|\d{15,15}|\d{17,17}[xX])$/.test(value);
            },
            passport: function(value) {
                return value.length === 0 || /^1[45][0-9]{7}$|^G[0-9]{8}$|^P[0-9]{7}$|^S[0-9]{7,8}$|^D[0-9]+$/.test(value);
            },
            noSymbol: function(value) {
                return value.length === 0 || /^[\w|\u4e00-\u9fa5]*$/.test(value);
            },
            url: function(value) {
                return value.length === 0 || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },
            username: function(value) {
                return Check.required(value) && (Check.email(value) || Check.mobile(value));
            },
            password: function(value) {
                return Check.required(value) && Check.rangelength(value, "6-14") && /[A-Za-z_0-9]+/.test(value);
            },
            check: function(options, value) {
                var hasError = false;
                _.each(options, function(opt){
                    var i = opt.indexOf("-");
                    var fn_name, fn_para;
                    if(i === -1){
                        fn_name = opt;
                    }
                    else{
                        fn_name = opt.substr(0, i);
                        fn_para = opt.substr(i+1);
                    }


                    var fn = Check[fn_name];
                    if(!fn(value, fn_para)){
                        hasError = true;
                    }
                });
                return !hasError;
            },
            checkAll : function(options) {
                var errors = [];
                _.each(options, function(option){
                    if(!Check.check(option.rules, option.value)){
                        errors.push(option.hint);
                    }
                });
                return errors;
            }
        };
        return Check;

    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by weimeng on 15/7/26.
 * 股权订单的基类
 */
(function(window, angular,$,payApp) {
    payApp.factory('EqPay', ['Common', 'User', '$q', '$rootScope', function (Common, User, $q, $rootScope) {



        /**
         * 构造一个支付对象
         * @constructor
         */
        function EqPay(dealId){

            this.dealId = dealId;
            /**
             * 是否已经实名认证
             * @type {boolean}
             */
            this.authenticated = false;

            /**
             * 项目相关信息
             * @type {null}
             */
            this.dealInfo = null;

            /**
             * 订单号
             * @type {null}
             */
            this.order_id = null;

            /**
             * 订单类型
             * @type {number}
             */
            this.order_type = 1;


            /**
             * 订单相关信息
             * @type {null}
             */
            this.orderInfo = null;

            /**
             * 银行列表
             * @type {null}
             */
            this.banklist = null;


            this.selectedBank = null;
        }


        EqPay.Events = {
            Payed: "Eq_Paid",
            ReverseInfoLoad : "Eq_ReserveInfoLoad",
            Reserved : "Eq_Reserved",
            SubscribeInfoLoad : "Eq_SubscribeInfoLoad",
            OrderLoaded : "Eq_OrderLoaded",
            Subscribed : "Eq_Subscribed",
            GoPay : "Eq_GoPay",
            GoPayOffline : "Eq_GoPayOffline"
        };

        EqPay.prototype.selectBank = function(bank){
            this.selectedBank = bank;
            _.each(this.banklist, function(item){
                if(item.bankID == bank.bankID) {
                    item.selected = true;
                }else{
                    item.selected = false;
                }

            });
        };

        /**
         * 提交订单
         */
        EqPay.prototype.pay = function(){


            if(!this.selectedBank){
                uc.modal.alert("错误提示", "请选择银行");
                $rootScope.payLock = false;
                return;
            }

            var isLeader = window.location.href.match(/isLeader=\d/);
            if (!isLeader ) {
                gaTrack('reserve', 'payReserve');
            } else if (isLeader) {
                gaTrack('reserve', 'payLead');
            }

            var params = {
                payment_id : this.selectedBank.payment_id,
                orderID : this.order_id,
                bankID : this.selectedBank.bankID,
                is_stockpay : 1
            };
            var url = uc.serviceUrl("/order/pay?v=3")
            var promise = Common.httpPost1(url, params);
            var _s = this;
            promise.then(function(data){
                $rootScope.payLock = false;
                EqPay.errorCheck(data, false, function(){
                    $rootScope.$broadcast(EqPay.Events.GoPay, data);
                });

            }, function(){
                $rootScope.payLock = false;
            });
        };



        /**
         * 线下支付订单
         */
        EqPay.prototype.payOffline = function(){
            var url = uc.serviceUrl("/corp/api?v=3");
            var params = uc.eqParams('pay', 'payoffline', 'GET', {orderId: this.order_id});
            var promise = Common.httpGet1(url, params);
            var _s = this;
            promise.then(function(data){
                EqPay.errorCheck(data, false, function(){
                    $rootScope.$broadcast(EqPay.Events.GoPayOffline, data);
                });

            }, function(){
            });
        };

        /**
         * 确认订单页面接口
         */
        EqPay.prototype.confirm = function(order_id, type){

            this.order_id = order_id;
            var svcUrl = uc.psvc_url(
                {url : "corp/api?v=3", name : 'orderInfo', data : uc.eqParams('pay', 'confirm', 'GET', {orderId : this.order_id, type : type})},
                {url : "order/banklist?v=3", name:'banklist', data: {type : 1, is_stockpay : 1}}
            );
            var _s = this;

            var promise = Common.httpGet1(svcUrl);
            promise.then(function(data){
                if(data.errors){
                    for(var key in data.errors){
                        var errObj = data.errors[key];
                        if(errObj.errno){
                            uc.modal.alert("错误提示",  errObj.error, function(){
                                window.location.href = '/zc/#/user-center/equity-order';
                                return;
                            });
                        }
                    }
                }
                _s.orderInfo = data.orderInfo.data;
                _s.orderInfo.security_amount_str = uc.currency(_s.orderInfo.security_amount * 10000);
                _s.banklist = data.banklist.bank_list;
                _s.selectedBank = _s.banklist[0];
                _s.selectedBank.selected =true;
                $rootScope.$broadcast(EqPay.Events.OrderLoaded);

            });
        };


        EqPay.prototype.queryResult = function(payment_sn){

            var url = uc.serviceUrl("/corp/api?v=3");
            var params = uc.eqParams('pay', 'checkorder', 'GET', {payment_sn: payment_sn});
            var _s = this;
            return Common.httpGet1(url, params);

        };


        EqPay.errorCheck = function(data, jump, success){
            var errno = data.errno - 0;
            switch(errno){
                case 1004:
                    zc.show_login(function(){
                        $rootScope.$broadcast('LOGINED');
                    });
                    break;
                case 1:
                case 4:
                    User.authentication();
                    break;
                case 0:
                    success(data);
                    break;
                default :
                    uc.modal.alert("错误提示", data.error, function(){
                        if(jump){
                            window.location.href = '/deal-stock/id-' + this.dealId;
                        }
                    });
                    break;

            }

        };



        return EqPay;


    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * (function(window, angular,$,payApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,payApp) {
   payApp.factory('httpMock', ['$http', '$q', function ($http, $q) {
      var httpMock = function() {
         if(!window.mockDict){
            window.mockDict = {};
         }
         this.mockDict = window.mockDict;

         function build_query(url, data) {

            var params = [];
            for (var key in data) {
               params.push(key + "=" + data[key]);
            }
            if (params.length > 0) {
               return url + "?" + params.join("&");
            }
            return url;
         }

         this.addMock = function (options) {
            url = build_query(options.url, options.data);
            this.mockDict[url] = options.success;
         }

         this.request = function (options) {
            url = build_query(options.url, options.data);
            var succ = this.mockDict[url];

            var deferred = $q.defer();
            if (succ) {
               setTimeout(function () {
                  deferred.resolve({data: succ(), errno: 0});
               }, 50);
            } else {
               if (options.fail) {
                  deferred.reject({errno: 6000, error: "网络错误"});
               }
            }

            return deferred.promise;

         };
      };
      return httpMock;
   }]);



})(window, window.angular, $, angular.module('payApp'));

/**
 * Created by weimeng on 15/7/26.
 */
/**
 * (function(window, angular,$,payApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,payApp) {
    payApp.factory('PayService', ['$http', '$q', '$rootScope', 'Check', '$cookieStore', function ($http, $q, $rootScope, Check, $cookieStore) {
        function _ajax(options){
            var _s = this;
            $.ajax({
                url : options.url,
                type : options.method,
                cache : options.cache || false,
                dataType : 'json',
                data : options.data,
                success : function(data){

                    if(data.errno){

                        uc.modal.alert("错误提示", data.error);
                    }else{
                        options.success.call(_s, data.data);
                    }
                    if(options.always)
                        options.always();
                },
                error : function(){
                    uc.modal.alert("网络错误", "无法连接到服务器，请确认网络环境然后重试");
                    if(options.always)
                        options.always();
                }
            });
        };

        function pjax(options, ignoreLogin){
            var req = {
                method : options.method ,
                url : options.url
            };

            $http(req).success(function(data){
                var error = false;

                data.logined = true;
                if(data.errors){
                    for(var key in data.errors){
                        var item = data.errors[key];
                        if(item.errno == '1004'){
                            if(options.ignoreLogin){
                                data.logined = false;
                            }else{
                                zc.show_login(function(){
                                    $rootScope.$broadcast("LOGINED");
                                });
                            }
                        }
                        else{
                            uc.modal.alert('错误提示', item.error) ;
                            return false;
                        }
                    }
                }
                options.success(data);
            }).error(function(){
                uc.modal.alert("网络错误", "无法连接到服务器，请确认网络环境然后重试");
            });
        }

        function PayService(projectID, itemID, query){

            var _s = this;
            // 选中的支付项
            this.selectedItem = null;
            this.selectedIndex = null;
            this.isPlatformSelected = false;
            // 是否使用余额支付
            this.useBalance = false;
            this.balance = 0;
            // 选中的抵用券
            this.coupon = null;
            this.couponList = null;
            // 支付个数
            this.num = 1;
            this.numError = "";
            // 选择的支付方式
            this.selectedPaymentMethod = null;
            // 选择银行
            this.bank = null;

            // 支付总额
            this.total = 0;
            this.tab = 1;

            // 运费
            this.deliveryFee = 0;

            // 确认订单页请求结果
            this.payview = null;

            // 选中的地址
            this.address = {};

            this.logined = true;
            // 支付总额
            this.money = 0;


            // 获取创建好的订单ID
            this.order_id = null;

            // 银行列表
            this.banklist = [];

            // 订单预览
            this.orderPreview = null;

            // 初始的用户信息
            this.uinfo = null;

            this.memo = "";

            this.selfless_price = '';
            this.selfless_price1 = 1;
            this.selfless_opt = 1;
            if(query && query.money){
                if(query.money == 1){
                    this.selfless_opt = 1;

                    this.selfless_price1 = 1;
                }else if(query.money == 5){

                    this.selfless_opt = 2;

                    this.selfless_price1 = 5;
                }else if(query.money == 10){


                    this.selfless_opt = 3;

                    this.selfless_price1 = 10;
                }else{

                    this.selfless_opt = 4;

                    this.selfless_price = query.money;
                }



            }
            this.items = [];
            this.anonymous = 0;


            this.extras = {};


            /// 监听事件
            $rootScope.$on(PayService.Events.PAY_COUPON_SELECTED, function(event, data){
                setCoupon(data);
            });
            $rootScope.$on(PayService.Events.ADDR_SELECT, function(event, data){
                address = data.item;
            });
            $rootScope.$on(PayService.Events.PAY_ORDER_CONFIRMED, function(event, data){
                var form = data;
                var method = getPaymentMethod();
                var bank = getBank();
                form.payment_id = (method ? method.payment_id : 0);
                if(bank && method && method.payment_id == 43){
                    form.payment_id = bank.payment_id;
                    form.bankID = bank.bankID;
                }
                pay(form);
            });
            /// END
            /**
             * 设置选中的回报项
             */
            this.setSelectedItem = function(item){
                _s.num = 1;
                _s.selectedItem = item;
                _s.numError = "";
                _s.__recalcMoney_submitOrder();
                this.save_order_state();
                $rootScope.$broadcast(PayService.Events.PAY_SELECTED_ITEM_CHANGED, item);
            }

            this.setSelectedItemDonate = function(item){
                var item = _.first(_.filter(this.items, function(reward){
                    return reward.itemType == 2;
                }));
                this.setSelectedItem(item);
            };


            /**
             * 获得选中的抵用券
             */
            function getSelectedCoupon(){
                return coupon;
            }

            /**
             * 获取选中的回报项
             */
            function getSelectedItem(item){
                return selectedItem;
            }



            function getPaymentMethod(){
                return selectedPaymentMethod;
            }

            function setPaymentMethod(opt){
                selectedPaymentMethod = opt;
                $rootScope.$broadcast(PayService.Events.PAY_METHOD_CHANGED, opt);
            }


            function setBank(_bank){
                bank = _bank;
                $rootScope.$broadcast(PayService.Events.PAY_BANK_CHANGED, _bank);
            }


            var paymentInfoDataCache = null;
            /**
             * 获取支付数据
             */
            this.getPaymentInfo = function(order_id, anonymous){
                this.order_id = order_id;
                this.anonymous = anonymous;
                var _s = this;
                var svcUrl;
                if(!anonymous){
                    svcUrl = uc.psvc_url(
                        {url : 'order/payview?v=3',name : 'orderInfo', data : {orderID : order_id}},
                        {url : 'order/couponlist?v=3', name : "couponList", data:{orderID : order_id}},
                        {url : 'order/banklist?v=3', name : "banklist", data:{type: 1}}
                    );
                }else{
                    svcUrl = uc.psvc_url(
                    {url : 'order/payview?v=3',name : 'orderInfo', data : {orderID : order_id, anonymous : 1}},
                    {url : 'order/banklist?v=3', name : "banklist", data:{type: 1, anonymous : 1}}
                );
                }

                pjax({
                    url : svcUrl,
                    method : 'GET',
                    success : function(data){

                        _.each(data.orderInfo.payway_list, function(item){
                            item.hide= true;
                            if(item.pay_name.match(/支付宝/)){
                                item['class']='zhifubao';
                                item.hide = false;
                            }
                            if(item.pay_name.match(/微信/)){
                                item['class']='weixin';
                                item.hide= false;
                            }
                            if(item.payment_id == 62){
                                item['class'] = 'union';
                                _s.unionPlatform = item;

                            }
                            if(item.pay_name.match(/储蓄/)){
                            }
                            if(item.pay_name.match(/信用/)){
                            }

                            if(data.orderInfo.l_payway){
                                if(data.orderInfo.l_payway.payment_id == 29 || data.orderInfo.l_payway.payment_id == 50){
                                   _s.tab = 1;
                                }else if(data.orderInfo.l_payway.bank_code){
                                    _s.tab = 2;
                                }else if(data.orderInfo.l_payway.payment_id == 62){
                                   _s.tab = 4;
                                }
                                if(item.payment_id == data.orderInfo.l_payway.payment_id){
                                    if(data.orderInfo.l_payway.bank_code){
                                        _.each(data.banklist.bank_list, function(bank){
                                            if(bank.bank_code == data.orderInfo.l_payway.bank_code){
                                                _s.selectedPaymentMethod = bank;
                                            }
                                        });
                                    }else{
                                        _s.selectedPaymentMethod = item;
                                    }
                                }

                            }
                        });



                        //_s.selectedPaymentMethod = _.first(_.filter(data.orderInfo.payway_list, function(opt){
                        //    return opt.is_available === 1;
                        //}));
                        paymentInfoDataCache = data;
                        if(!anonymous){

                            if(data.orderInfo.is_coupon){
                                /** 计算选中的抵用券逻辑 **/
                                // 获得所有的可用列表
                                var candidates = _.filter(data.couponList, function(coupon){
                                    return !coupon.invaild;
                                });
                                // 获取最大的一张可用抵用券
                                var max = _.max(candidates, function(coupon){

                                    return coupon.amount;
                                });
                                max = (max === -Infinity) ? undefined : max;
                                _s.coupon = max ;

                                _s.couponList = candidates;
                                _.each(_s.couponList, function(coupon){
                                    var c = Math.ceil(coupon.amount);
                                    if(coupon.invalid){

                                        coupon.text = "（不可用） " + coupon.amount + "元" + "（满" + c + "元抵用）";
                                    }else{

                                        coupon.text = coupon.amount + "元" + "（满" + c + "元抵用）";
                                    }

                                });


                                if(_s.couponList.length > 0){
                                    _s.couponList.unshift({amount : 0, coupon_id : 0, text : "不使用抵用券"});
                                }else{
                                    _s.couponList.unshift({coupon_id : 0, text : "暂无可用抵用券", amount : 0});
                                    _s.coupon = _s.couponList[0];
                                }
                            }


                        }
                        /** end **/
                        _s.payview = data.orderInfo;
                        _s.banklist = data.banklist.bank_list;
                        _.each(_s.banklist, function(bank){
                            bank['class'] = bank.bank_code;

                        });

                        if(_s.selectedPaymentMethod){
                            _s.isPlatformSelected = true;
                        }
                        _s.__recalcMoney_confirmOrder();
                        $rootScope.$broadcast(PayService.Events.PAY_ORDER_INFO_LOADED, data);
                    }
                });
            }


            /**
             * 设置选中的抵用券
             */
            this.setCoupon = function(_c){
                if(_c && _c.invaild == 0){
                    this.coupon = _c;
                }else{
                    this.coupon = _s.couponList[0];
                }

                this.__recalcMoney_confirmOrder();
            };




            /**
             * 获取当前总金额
             */
            function getTotal(){
                total = parseFloat(total);
                return total ? total.toFixed(2) : 0;
            }

            function getDeliveryFee(){
                return deliveryFee;
            }

            /**
             * 获取支付金额
             */
            function getMoney(useBalance){
                return money;
            }


            /**
             * 设置数量
             */
            this.setNum =function(d){
                if(d < 0){
                    return;
                }
                this.numError = this.numValidError(d);
                //if(!this.numError) {



                _s.num = d;

                this.__recalcMoney_submitOrder();
                //}
                $rootScope.$broadcast(PayService.Events.PAY_NUM_CHANGED);
            };

            this.numValidError = function(num){
                if(!/^[0-9]+$/.test(num)){
                    return "请输入数字";
                }
                if(num > 100){
                    return "最多只能支持100份";
                }
                var limit = _s.selectedItem.limit || 65535;
                var left = limit - _s.selectedItem.supportCount;
                if(left <= 0){
                    return "该支持项已经售完!";
                }
                if(left < num){
                    return "只剩" + (_s.selectedItem.limit - _s.selectedItem.supportCount) + "份了哦～";
                }

                if(num <= 0){
                    return "至少支持一份";
                }

                return "";
            };

            /**
             * 是否可以增加数量
             */
            this.canAdd = function(){
                var limit = _s.selectedItem.limit === 0 ? 65535 : _s.selectedItem.limit;
                limit = limit - _s.selectedItem.supportCount;
                return _s.num < limit && _s.num < 100;
            };

            /**
             * 是否可以减少数量
             */
            this.canSub = function(){
                return _s.num > 1;
            };


            /**
             * 设置是否需要余额支付
             */
            this.toggleUseBalance = function(){
                this.useBalance = !this.useBalance;
                this.__recalcMoney_confirmOrder();
            };
            this.isUseBalance = function(){
                return this.useBalance;
            };

            /**
             * 获取余额
             */
            this.getBalance = function(){
                return this.payview.residue;
            };
            /**
             * 确认订单页重新计算各种金额
             */
            this.__recalcMoney_confirmOrder = function(){
                if(_s.payview){
                    if(!_s.payview.is_coupon){
                        _s.coupon = null;
                        _s.couponList = [];
                    }
                    var balance = _s.getBalance();
                    var couponAmount = (_s.coupon ? _s.coupon.amount : "0");

                    var balanceAmount = _s.useBalance ? balance : 0;


                    _s.total = uc.currency(_s.payview.total_price);
                    var diff_coupont = _s.total - couponAmount;
                    if(diff_coupont > 0){
                        this.balance = uc.currency(_s.useBalance ? Math.min(diff_coupont ,balanceAmount) : 0);
                    }

                    _s.money = uc.currency(Math.max(_s.total - couponAmount - balanceAmount, 0));


                }
            }

            this.getSelflessPrice = function(){
                if(this.selfless_opt == 1 || this.selfless_opt == 2 || this.selfless_opt == 3){
                    return this.selfless_price1;
                }else{
                    return this.selfless_price;
                }
            };

            /**
             * 提交订单页重新计算一些值
             */
            this.__recalcMoney_submitOrder = function(){
                if(_s.selectedItem){
                    if(_s.selectedItem.itemType == 2){
                        _s.total = this.getSelflessPrice();

                    }else{
                        _s.total = _s.selectedItem.money * _s.num;
                        if(_s.selectedItem.deliveryFee > 0){
                            _s.deliveryFee = _s.selectedItem.deliveryFee * _s.num;
                        }else{
                            _s.deliveryFee = 0;
                        }
                        _s.total += _s.deliveryFee;
                        _s.total = uc.currency(_s.total);
                    }

                }
            }


            function getCreatedOrderId(){
                return order_id;
            }
            function changeOrder(_id){
                order_id = _id;
                getPaymentInfo();
            }

            this.makeOrderError = function(address){
                var extras = this.extras;

                if(!extras){extras = {};}

                if(_s.selectedItem.extra_need.user_name){
                    if(!(Check.minLength(extras.user_name, 2))){
                        return "请填写正确的姓名!";
                    }
                }
                if(_s.selectedItem.extra_need.mobile){
                    if(!( Check.required(extras.mobile) && Check.mobile(extras.mobile) )){
                        return "请填写正确的手机号码!";
                    }
                }

                if(_s.selectedItem.extra_need.email){
                    if(!( Check.required(extras.email) && Check.email(extras.email) )){
                        return "请填写正确的邮箱!";
                    }
                }

                if(_s.selectedItem.itemType == 2){
                    var s_price =_s.getSelflessPrice();
                    if(!s_price){
                        return "请填写您要支持的金额";
                    }
                    if(!/^[0-9]*$/.test(s_price)){
                        return "请填写整数金额";
                    }
                    if(!Check.mobile(_s.mobile)){
                        return "请输入正确的手机号";
                    }
                }


                if(_s.numError){
                    return _s.numError;
                }


            };
            /**
             * 下单
             */
            this.makeOrder = function(address, extras){
                var err = this.makeOrderError(address);
                if(err){
                    uc.modal.alert('错误提示', err)
                    $rootScope.makeOrderLock = false;
                    return;
                }

                var error = '';
                var extras = this.extras;
                if(!extras){extras = {};}

                if(this.selectedItem.return_type != 2){
                   extras = {};
                }
                if(!_s.selectedItem.extra_need.user_name) {
                    extras.user_name = undefined;
                }
                if(!_s.selectedItem.extra_need.mobile) {
                    extras.mobile = undefined;
                }
                if(!_s.selectedItem.extra_need.email){
                    extras.email = undefined;
                }
                var data = {
                    itemID : this.selectedItem.itemID,
                    dealID : projectID,
                    num : this.num,
                    memo : this.memo,
                    isAdd : false
                };
                if(this.selectedItem.return_type == 2){
                    data.mobile = extras.mobile;
                    data.name = extras.user_name;
                    data.email = extras.email;
                }
                if(this.selectedItem.itemType == 2 && !this.logined){
                    data.anonymous = 1;
                }
                if (address && address.addressID) {
                    data.addressID = address.addressID;
                }

                if(_s.selectedItem.itemType === 2){
                    delete data.telephone;
                    data.selfless_price = _s.getSelflessPrice();
                }
                _ajax({
                    url : uc.serviceUrl("order/makeorder?v=3"),
                    method : 'POST',
                    data : data,
                    success : function(data){
                        _s.save_order_state();
                        $rootScope.$broadcast(PayService.Events.PAY_ORDER_CREATED, data);
                    },
                    always : function(){
                       $rootScope.makeOrderLock = false;
                    }
                });
            }


            /**
             * 下单页获取数据
             */
            this.getOrderInfo = function(){
                var svcUrl = uc.psvc_url(
                    {url : "deal/getdetail?v=2", name : "detail", data : {projectID : projectID}},
                    {url : "deal/getallitems?v=2", name : "items", data : {projectID : projectID}},
                    /*{url : "order/makeorderview?v=3", name : "view", data : {dealID : projectID, itemID : itemID}},*/
                    /*{url : 'order/banklist?v=3', name : "banklist", data:{type: 1}},*/
                    {url : 'user/contactinfo?v=3', name : 'uinfo'}
                    /*{url : "user/getaddresslist?v=1", name : "addressList"}*/
                    );
                pjax({
                    url : svcUrl,
                    method : "GET",
                    ignoreLogin : true,
                    success : function(data){
                        var title = data.detail.name;
                        var items = data.items;

                        if(!data.logined){
                           _s.logined = false;
                        }
                        _.each(items, function(item){
                            var exNeed;
                            try{
                                exNeed = $.parseJSON(item.extra_need);
                            }catch(ex){}
                            if(!exNeed){exNeed = {};}
                            item.extra_need = exNeed;
                        });


                        _s.orderPreview = data.view;
                        _s.uinfo = data.uinfo;
                        _s.extras.user_name = data.uinfo.ex_real_name;
                        _s.extras.mobile = data.uinfo.mobile;
                        _s.extras.email = data.uinfo.email;

                        /** 要求无私支持出现在第1个 */
                        // 找到虚拟回报项的id
                        var selflessItem = _.first(_.filter(items, function(item){return item.itemType == 2; }));
                        var others = _.filter(items, function(item){return item.itemType !== 2;});
                        others.unshift(selflessItem);
                        items = others;

                        /** END **/
                        if(itemID){
                            _s.selectedItem = _.first(_.filter(items, function(item, i){ return item.itemID == itemID;}));
                        }
                        if(_s.selectedItem){
                            _.each(items, function(item, i){
                                if(_s.selectedItem.itemID == item.itemID){
                                    _s.selectedIndex = i;
                                    return false;
                                }
                            });
                        }
                        if(_s.selectedItem && !_s.selectedItem.can_be_support){
                            _s.selectedItem = null;
                        }

                        // 重新赋值订单
                        /*
                        if(data.view.order){
                            _s.num = data.view.order.num;
                        }
                        */

                        _s.__recalcMoney_submitOrder();
                        _s.address = _.first(_.filter(data.addressList, function(item){return item['default'] === 1; }));


                        // 替换图片链接
                        _s.items = _.each(items, function(item){
                            item.money = parseFloat(item.money);
                            if(item.imageUrls){
                                for(var i = 0; i < item.imageUrls.length; i++){
                                    item.imageUrls[i] = item.imageUrls[i];
                                }
                            }

                        });
                        //_s.banklist = data.banklist.bank_list;


                        // 当前选择的支付方式id

                        $rootScope.$broadcast(PayService.Events.PAY_INFO_LOADED, {
                            title : title,
                            project : data.detail,
                            items : _s.items,
                            selectedItem : _s.selectedItem,
                            address : _s.address
                        });
                    }
                });
            }

            // 去支付
            this.pay = function(data){
                data.orderID = this.order_id;
                data.is_remained = this.useBalance ? 1 : 0;
                if(this.coupon && this.coupon.coupon_id)
                    data.coupon_id = this.coupon.coupon_id;

                if(this.money == 0){
                    data.payment_id = 0;
                    delete data.bankID;
                }
                if(this.anonymous){
                    data.anonymous = 1;
                }

                _ajax({
                    url : uc.serviceUrl("order/pay?v=3"),
                    method : "POST",
                    data : data,
                    success : function(data){
                        $rootScope.$broadcast(PayService.Events.PAY_JUMP, data);
                    },
                    always : function(){
                       $rootScope.payJumpLock = false;
                    }
                });
            };


            /**
             * 获取payview
             */
            function getPayView(){
                return payview;
            }


            this.save_order_state = function(){
                if(!_s.selectedItem){return;}
                var obj = {
                    num : _s.num,
                    itemID : _s.selectedItem.itemID,
                    projectID : projectID,
                    selfless_price : _s.selfless_price,
                    selfless_price1 : _s.selfless_price1,
                    selfless_opt : _s.selfless_opt,
                    time : new Date()
                };

                $cookieStore.put(get_save_key(), obj);


            };
            function get_save_key(){
                if(query.itemID){
                    return "PAY_"+ query.projectID + "-" + query.itemID;
                }else{
                    return "PAY_" + query.projectID;
                }
            }

            this.load_order_state = function(){
                var obj = $cookieStore.get(get_save_key());

                if(!obj){return;}
                var t = moment(new Date()).unix();
                var t1 = moment(obj.time).unix();
                if(t - t1 > 180){
                   return;
                }
                itemID = obj.itemID;
                _s.num = obj.num;
                _s.selfless_price = obj.selfless_price;
                _s.selfless_price1 = obj.selfless_price1;
                _s.selfless_opt = obj.selfless_opt;
            };


            this.samePlatform = function(platA, platB){
                if(!platA || !platB){
                    return false;
                }
                if(platA.bank_code && platB.bank_code){
                    return platA.bank_code == platB.bank_code;
                }else{
                    return platA.payment_id == platB.payment_id;
                }
            };
        }
        PayService.Events = {
            PAY_ORDER_CREATED: "pay_order_created",
            PAY_SELECTED_ITEM_CHANGED: 'pay_selected_item_changed',
            PAY_INFO_LOADED: "PAY_INFO_LOADED",
            PAY_ORDER_INFO_LOADED: "PAY_ORDER_INFO_LOADED",
            PAY_ORDER_CONFIRMED: "PAY_ORDER_CONFIRMED",
            PAY_METHOD_CHANGED: "PAY_METHOD_CHANGED",
            PAY_BANK_LIST_LOADED: "PAY_BANK_LIST_LOADED",
            PAY_BANK_CHANGED: "PAY_BANK_CHANGED",
            PAY_NUM_CHANGED: "PAY_NUM_CHANGED",
            PAY_SELECT_COUPON: "PAY_SELECT_COUPON",
            PAY_COUPON_SELECTED: "PAY_COUPON_SELECTED",
            PAY_JUMP: "PAY_JUMP"
        };


        return PayService;
    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by weimeng on 15/7/26.
 */
/**
 * (function(window, angular,$,payApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,payApp) {
    payApp.factory('Reserve', ['Common','EqPay', 'User', '$q', '$rootScope', function (Common, EqPay, User, $q, $rootScope) {



        /**
         * 预约
         * @constructor
         */
        function Reserve(dealId, isLeader){
            EqPay.call(this, dealId);

            this.isLeader = (isLeader == 1) ? 1 : 0;

            this.percent = 0;
            this.money = '';
            this.insure = 0;
            this.mark = '';
            this.error_msg = '';
            this.acture_minimun_invest = 0;
        }

        Reserve.prototype = EqPay.prototype;

        Reserve.prototype.calc = function(){

            var money;
            if(this.money.length > 5){
                this.money = this.money.substr(0, 5);
            }
            if(this.validMoney()) {
                money = parseFloat(this.money);
            }else {
                money = 0;
            }

            var project_value = this.dealInfo.target_fund * 100 / this.dealInfo.stakes;
            this.percent =  uc.currency(100 * money / project_value);

            if(this.dealInfo.ysh_vip && !this.isLeader){
                this.insure = 0;
            }else{
                this.insure = uc.currency(Math.min(money * 100, 100000));
            }

        };


        Reserve.prototype.validMoney = function(){
            if(!this.money){
                this.error_msg = "请填写意向投资金额";
                return false;
            }
            if(!/^[1-9][0-9]*$/.test(this.money)){
                this.error_msg = "意向投资金额只支持整数";
                return false;
            }


            if(this.money > this.dealInfo.target_fund){
                this.error_msg = '意向投资金额不能大于目标金额' + this.dealInfo.target_fund + "万";
                return false;
            }
            if(this.isLeader){
                if(this.money < this.dealInfo.target_fund * 0.2){
                   this.error_msg = "意向投资金额不能小于起投金额" + this.acture_minimun_invest + "万";
                    return false;
                }
            }else{
                if(this.money < this.dealInfo.limit_price){
                    this.error_msg = "意向投资金额不能小于最低投资额" + this.acture_minimun_invest + "万";
                    return false;
                }
            }

            this.error_msg = '';
            return true;
        };

        /**
         * 预约
         */
        Reserve.prototype.reserve = function(){
            var url = uc.serviceUrl("/corp/api?v=3");
            var params = uc.eqParams('reserve', 'toreserve', 'GET', {dealId : this.dealId , isLeader : this.isLeader});
            var _s = this;
            var promise = Common.httpGet1(url, params);
            promise.then(function(data){
                EqPay.errorCheck(data, true, function(){
                    _s.dealInfo = data.data.data;
                    if(_s.isLeader){
                        _s.acture_minimun_invest = uc.currency(Math.max(_s.dealInfo.target_fund * 0.2, _s.dealInfo.limit_price));
                    }else{
                        _s.acture_minimun_invest = uc.currency(_s.dealInfo.limit_price);
                    }
                    $rootScope.$broadcast(EqPay.Events.ReverseInfoLoad);
                });
            });
        };


        Reserve.prototype.reserve_add = function(){
            this.dirty = true;
            this.validMoney();

            if(this.error_msg){
                return;
            }
            var isLeader = +window.location.href.match(/isLeader=\d/)[0].split('=')[1];
            if (isLeader === 0 ) {
                gaTrack('reserve', 'submitReserve');
            } else if (isLeader === 1) {
                gaTrack('reserve', 'submitLead');
            }
            var money = this.money || 0;

            var url = uc.serviceUrl("/corp/api?v=3");
            var params = uc.eqParams('reserve', 'add', 'GET', {dealId : this.dealId, is_leader : this.isLeader, mark : this.mark, money : money});

            var promise = Common.httpGet1(url, params);
            var _s = this;
            promise.then(function(data){
                EqPay.errorCheck(data, false, function(){
                    _s.order_id = data.data.data;
                    $rootScope.$broadcast(EqPay.Events.Reserved);
                });
            });
        };

        return Reserve;

    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * Created by weimeng on 15/7/26.
 */
/**
 * (function(window, angular,$,payApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,payApp) {
    payApp.factory('Subscription', ['Common', 'EqPay', 'User', '$q', '$rootScope', function (Common, EqPay, User, $q, $rootScope) {

        /**
         * 认购
         * @constructor
         */
        function Subscription(dealId){
            EqPay.call(this, dealId);

            /**
             * 认购金额
             * @type {string}
             */
            this.money = '';


            /**
             * 是否在优先认购期
             * @type {number}
             */
            this.priority_term = 1;


            /**
             * 占股比例
             * @type {number}
             */
            this.rate = 0;


            /**
             * 服务费用
             * @type {number}
             */
            this.service_charge = 0;
            this.service_rate = 0;


            /**
             * 需支付保证金
             * @type {number}
             */
            this.insure = 0;


            /**
             * 实际支付
             * @type {number}
             */
            this.total = 0;


            /**
             * 邀请码
             * @type {string}
             */
            this.invite_code = '';


            /**
             * 剩余可以预约的金额
             * @type {string}
             */
            this.left = '';


            /**
             * 项目估值
             * @type {string}
             */
            this.project_value = '';


            /**
             * 最小投资金额
             * @type {string}
             */
            this.min = '';
            this.act_min = '';

            this.dirty = false;

            /**
             * 是否3天打款阶段
             * @type {boolean}
             */
            this.isThreeDay = false;
        }

        Subscription.prototype = EqPay.prototype;

        Subscription.prototype.calc = function(calcOnly){
            this.error_msg = '';
            var money = this.money;
            if(!calcOnly){

                if(this.money.length > 7){
                    this.money = this.money.substr(0, 7);
                }
                if(this.validMoneyNum()) {
                    money = parseFloat(this.money);
                    this.validMoney();
                }else {
                    money = 0;
                }

            }



            this.rate =  100 * money / this.project_value;
            this.service_charge = 10000 * money * this.service_rate;

            this.total = money - this.insure + (this.service_charge / 10000);
            this.total = uc.currency(this.total);
        };

        Subscription.prototype.validMoneyNum = function(){
            if(!this.money){
                this.error_msg = "请填写投资金额";
                return false;
            }
            if(!/^[1-9][0-9]*$/.test(this.money + "")){
                this.error_msg = "投资金额只支持整数";
                this.dirty = true;
                return false;
            }
            return true;
        };

        Subscription.prototype.validMoney = function(){


            var is_add = this.dealInfo.is_add;
            if(this.dealInfo.day7){
                if(this.money > this.dealInfo.reserveTotalW){
                    this.error_msg = "首单认购金额不能大于预约的投资意向金额";
                    return false;
                }
            }
            if(this.isThreeDay){
                if(!this.isLeader){
                    this.error_msg = "用户您好,本项目正处在三天“领投人”打款期，请您稍后再来投资";
                    return false;
                }


            }

            if(this.isLeader && !is_add){
                if(this.money < this.dealInfo.publishData.target_fund * 0.2){
                    this.error_msg = "投资金额不能小于起投金额" + this.dealInfo.publishData.target_fund * 0.2 + "万";
                    return false;
                }
            }
            if(this.money < this.min && !is_add){
                this.error_msg = "投资金额不能小于最低投资额" + this.min + "万";
                return false;
            }

            if(this.is_add){
                if(this.money < 1){
                    this.error_msg = "投资金额不能小于1万元";
                    return false;
                }
            }

            if(this.left < this.money){
                if(this.left < this.min){
                    this.error_msg = "用户您好，此项目已经成功发行";
                    return false;
                }else{
                    if(this.money > this.left){
                        this.error_msg = '用户您好,项目只剩下' + this.left + "万元没有认购，您最多认购" +this.left + "万元";
                        return false;
                    }
                }
            }
            if(this.money > this.dealInfo.publishData.target_fund){
                this.error_msg = '投资金额不能大于目标金额' + this.dealInfo.publishData.target_fund + "万";
                return false;
            }
            return true;
        };
        /**
         * 获取认购需要用到的数据
         */
        Subscription.prototype.getSubscribeInfo = function(){
            var url = uc.serviceUrl("/corp/api?v=3");
            var params = uc.eqParams('pay', 'topay', 'GET', {dealId : this.dealId });

            var promise = Common.httpGet1(url, params);
            var _s = this;
            promise.then(function(data){
                EqPay.errorCheck(data, true,function(data){
                    _s.dealInfo = data.data.data;

                    var publishData = _s.dealInfo.publishData;
                    $rootScope.deal_name = _s.dealInfo.dealInfo.name;

                    $rootScope.deal_id = _s.dealInfo.dealInfo.id;
                    _s.left = publishData.target_fund + (publishData.is_exceed ? publishData.exceed_price : 0) - publishData.subscribe_amount;
                    _s.insure = uc.currency(_s.dealInfo.sec_amount);
                    _s.project_value = publishData.target_fund * 100 / publishData.stakes;
                    _s.min = publishData.limit_price;
                    var act_min = 0;
                    if(_s.dealInfo.is_leader && !_s.dealInfo.is_add){
                        act_min = publishData.target_fund * 0.2;
                    }
                    if(_s.dealInfo.is_add){
                        _s.act_min = 1;
                    }else{
                        _s.act_min = Math.max(act_min, _s.min);
                    }
                    _s.money = _s.dealInfo.reserveTotalW || '';
                    _s.calc(true);
                    _s.isThreeDay = (publishData.status == 0);
                    _s.isLeader = _s.dealInfo.is_leader;
                    _s.service_rate = uc.currency(_s.dealInfo.publishData.leader_price);
                    _s.service_charge = uc.currency(_s.service_rate * _s.money * 10000);


                    _s.calc();
                    if(!_s.money) _s.money = '';
                    $rootScope.$broadcast(EqPay.Events.SubscribeInfoLoad);
                });
            });
        };


        Subscription.prototype.subscribe = function(){
            this.dirty = true;
            this.calc();
            if(this.error_msg){
                return;
            }
            var url = uc.serviceUrl("/corp/api?v=3");
            var params = uc.eqParams('pay', 'add', 'GET', {dealId : this.dealId, sub_amount : this.money, invite_code : this.invite_code});

            var promise = Common.httpGet1(url, params);
            var _s = this;
            promise.then(function(data){
                EqPay.errorCheck(data, false, function(data){
                    _s.order_id = data.data.data;
                    $rootScope.$broadcast(EqPay.Events.Subscribed);
                });
            }, function(){
            });
        };

        return Subscription;

    }]);
})(window, window.angular,$,angular.module('payApp'));
/**
 * (function(window, angular,$,payApp) /**
 * Created by YL Huang on 2015/7/15.
 */

(function(window, angular,$,payApp) {
    payApp.factory('User', ['$http', '$q', 'Common', function ($http, $q, Common) {

        var User = function(){};
        User.getVCode = function(mobile){
            return Common.httpPost(uc.serviceUrl('user/invitecode?v=3'), {mobile : mobile});
        } ;
        User.fast_login = function(mobile, vcode){
            return Common.httpPost(uc.serviceUrl('user/login?v=3'), {identity : mobile, code : vcode});
        }

        User.getInfo = function(){
            return Common.httpGet(uc.serviceUrl("user/info?v=1"));
        };

        User.authentication = function(){
                uc.modal.alert("错误提示", "您还没有实名认证,请先进行实名认证。", function(){

                    window.location.href = '/zc/#/auth';
                });
            };
        return User;

    }]);



})(window, window.angular, $, angular.module('payApp'));

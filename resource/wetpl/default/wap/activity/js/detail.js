define(function(require, exports, module) {
    var c = require('common');

    /**
     * 节点事件绑定
     * @return {[type]} [description]
     */
    function bindEvent() {
        //背景
        $('.backdrop').on('click', backdropEvent);
        //购票按钮
        $('.J_BtnBuyTicket').on('click', function() {
            c.backdrop.show(function() {
                $('html').addClass('no-scroll');
                $('body').addClass('no-scroll');
                $('.J_LayoutTicket').addClass('active');
            });
        });
        //查看我的门票按钮
        $('.J_BtnViewMyTicket').on('click', function() {
            c.backdrop.show(function() {
                $('.J_LayoutMyTicket').addClass('active');
            });
        });
        //取消按钮
        $('.J_BtnCancel').on('click', backdropEvent);

        //确认购票
        $('.J_BtnSureBuyTicket').on('click', buyTicket);

        bindSelectTicketEvent();

        pageEvent();

        occupyImg();
    }

    // 处理图片尺寸
    function occupyImg() {
        var max_width = $('.js-detail').width();
        $(".js-detail img").each(function() {
            if ($(this).attr("data-original")) {
                // 获取img对象src
                var src_ = $(this).attr('data-original');
                $(this).addClass('lazy');
                if (src_.indexOf('image.welian.com') === -1 && src_.indexOf('imgtest.welian.com') === -1) {
                    $(this).css("height", "auto");
                } else {
                    var name_arr = src_.split("_");
                    var width_ = name_arr[1],
                        height_ = name_arr[2];
                    var scale = width_ / height_;
                    var width = (width_ > 2*max_width) ? 2*max_width : width_;
                    var width_css = (width_ > max_width) ? max_width : width_;
                    var height_css = (width_ > max_width) ? max_width / scale : height_;
                    if (src_.indexOf('@') === -1) {
                        $(this).attr('data-original', src_ + '@' + width + 'w').css({"width": width_css, "height": height_css});
                    }
                }
            }
        });
        $("img.lazy").lazyload({
            effect : "fadeIn",
            threshold : 200
        });
    }

    function backdropEvent() {
        c.backdrop.hide(function() {
            $('html').removeClass('no-scroll');
            $('body').removeClass('no-scroll');
            $('.wl-layout').removeClass('active');
        });
    }

    function bindSelectTicketEvent() {
        //添加票数
        $('.J_NumPlus').on('click', function() {
            calcNum(this, '+');
        });
        //减少票数
        $('.J_NumMinus').on('click', function() {
            calcNum(this, '-');
        });
    }
    /**
     * 计算票
     * @param  {[type]} node [description]
     * @param  {[type]} type [description]
     */
    function calcNum(node, type) {
        var $num = $(node).siblings('.J_Num');
        var num = parseInt($num.text(), 10);
        if (type == '+') {
            var limit = parseInt($(node).parent().data('remind'), 10);
            if (num < limit) {
                num++;
            } else {
                alert('没有更多票了');
            }
        } else {
            if (num > 0) {
                num--;
            }
        }
        $num.text(num);
    }
    /**
     * 购票
     * @return {[type]} [description]
     */
    function buyTicket() {
        var url = $('#J_AjaxBuyTicket').val();
        var isFree = true;
        var formData = {};
        var total = 0;
        var txt = "我要报名";
        var msg = "报名中...";
        $('input[type="hidden"]').each(function() {
            if (this.name) {
                formData[this.name] = this.value;
            }
        });
        if ($('.ticket').length > 0) {
            isFree = false;
        }
        if (!isFree) {
            txt = "我要购票";
            msg = "购票中...";
            formData['ticket'] = [];
            $('.ticket').each(function() {
                var id = $(this).data('id');
                var num = parseInt($(this).find('.J_Num').text(), 10);
                var price = parseFloat($(this).find('.tk-price').text().replace('¥', ''), 10);
                var name = $(this).find('.tk-name').text();
                var intro = $(this).find('.tk-intro').text();
                if (num > 0) {
                    formData['ticket'].push({
                        tid: id,
                        num: num,
                        name: name,
                        intro: intro,
                        price: price
                    });
                    total += num;
                }
            });
            if (total == 0) {
                alert('请选择门票');
                return;
            }
            $('.J_NumMinus').unbind('click');
            $('.J_NumPlus').unbind('click');
        }
        $('.J_BtnSureBuyTicket').unbind('click');
        $('.J_BtnSureBuyTicket').text(msg);
        var json = JSON.stringify(formData);
        $('#J_FormData').val(json);
        document.forms['entry'].submit();
    }

    function pageEvent() {
        // for ios browser
        if (c.browser.versions.ios) {
            $(window).on("pagehide", function() {
                var $body = $(document.body);
                $body.children().remove(); // wait for this callback to finish executing and then...
                setTimeout(function() {
                    $body.append("<script type='text/javascript'>window.location.reload(true);<\/script>");
                });
            });
        }
        //for android qq browser
        $(window).on('pageshow', function(evt) {
            setTimeout(function() {
                if (evt.persisted) {
                    location.reload(true);
                }
            });
        });
    }

    /**
     * 初始化
     */
    exports.init = function() {
        c.init();
        bindEvent();
    };
});

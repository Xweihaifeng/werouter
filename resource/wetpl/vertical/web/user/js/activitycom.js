$(function() {
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(elt) {
            var len = this.length >>> 0;
            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0)
                from += len;
            for (; from < len; from++) {
                if (from in this &&
                    this[from] === elt)
                    return from;
            }
            return -1;
        };
    }
    //// 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function(fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    Number.prototype.fill = function() {
        return this < 10 ? '0' + this : this;
    }

    var common = {
        //初始化
        init: function() {
            $('#J_NavUser').on('click', function() {
                $('.nav-user .dropdown').fadeToggle(300);
            });
            $(document).click(function(e) {
                var $target = $(e.target);
                if (!($target.hasClass('dropdown') || $target.hasClass('avatar') || $target.hasClass('triangle') || $target.hasClass('info') || $target.hasClass('guidance'))) {
                    $('.dropdown').fadeOut(200);
                }
            });
            $('*[class*="disabled"]').click(false);
        },
        //复制
        copy: function() {
            $('.J_Copy').zclip({
                path: 'js/ZeroClipboard.swf',
                copy: function() {
                    return $(this).data('text');
                },
                afterCopy: function() {
                    notice.alert('复制成功');
                }
            });
        },
        //图片加载
        imagesloaded: function() {
            $('img[data-src]').each(function(i, img) {
                img.src = $(img).data('src');
            });
        },
        loading: function(tips, callback) {
            if ($('.backdrop').length <= 0) {
                $('body').append('<div class="backdrop"></div>')
            }
            if ($('#J_Loading').length <= 0) {
                $('body').append('<div class="loading" id="J_Loading"><img src="http://fed.welian.com/loading.gif"><p>' + tips + '</p></div>');
            }
            $('.backdrop').show();
            $('#J_Loading').children('p').text(tips);
            $('#J_Loading').fadeIn(300, function() {
                callback && callback(function(callFunc) {
                    $('#J_Loading').fadeOut(300, function() {
                        $('.backdrop').hide();
                        callFunc && callFunc();
                    });
                });
            });
        },
        parseUrl: function(url) {
            var a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function() {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length,
                        i = 0,
                        s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^\/])/, '/$1'),
                relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        }
    };

    //弹窗
    window.dialog = {
        events: [],
        colseCallback: null,
        init: function() {
            var _self = this;
            $('[data-toggle="dialog"]').on('click', function() {
                var target = $(this).data('target');
                _self.show(target);
                return false;
            });
            $('.dialog-close').on('click', function() {
                var node = $(this).parents('.dialog');
                _self.close(node);
            });
        },
        //关闭弹窗
        close: function(node) {
            if (typeof node == 'string') {
                node = $(node);
            }
            var _self = this;
            var flag = _self.execEvent(node, 'close');
            if (flag !== false) {
                node.removeClass('dialog-show');
                $('.backdrop').fadeOut(100);
                $('body').css('overflow', 'visible');
            }
        },
        //显示弹窗
        show: function(target) {
            if (typeof target == 'string') {
                target = $(target);
            }
            if ($('.backdrop').length < 1) {
                $('body').append('<div class="backdrop"></div>');
            }
            this.execEvent(target, 'show');
            $('body').css('overflow', 'hidden');
            $('.backdrop').show();
            $(target).addClass('dialog-show');
        },
        execEvent: function(node, type) {
            for (var i = 0; i < this.events.length; i++) {
                var e = this.events[i];
                if (e.node.get(0) == node.get(0) && e.type == type && e.func) {
                    return e.func();
                }
            };
        },
        on: function(node, type, callback) {
            if (typeof node == 'string') {
                node = $(node);
            }
            var eventObj = {
                node: node,
                type: type,
                func: callback
            };
            this.events.push(eventObj);
        }
    };

    window.notice = {
        alert: function(text, callback, delay) {
            var time = delay ? delay : 2000;
            noty({
                text: text,
                timeout: time,
                type: 'warning',
                layout: 'center',
                maxVisible: 1,
                callback: {
                    afterClose: callback
                }
            });
        },
        confirm: function(text, callback, cancelCallback) {
            noty({
                text: text,
                type: 'information',
                layout: 'center',
                modal: true,
                animation: {
                    open: {
                        height: 'toggle'
                    },
                    close: {
                        height: 'toggle'
                    },
                    easing: 'swing',
                    speed: 10
                },
                buttons: [/*{
                    addClass: 'btn btn-active btn-sm',
                    text: '确定',
                    onClick: function($noty) {
                        $noty.close();
                        callback && callback();
                    }
                },*/ {
                    addClass: 'btn btn-cancel btn-sm',
                    text: '取消',
                    onClick: function($noty) {
                        cancelCallback && cancelCallback();
                        $noty.close();
                    }
                }]
            });
        }
    }
    dialog.init();
    window.common = common;
});

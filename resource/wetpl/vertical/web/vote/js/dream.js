if (function () {
        var e = function () {
            var t = [].slice.call(arguments);
            return t.push(e.options), t[0].match(/^\s*#([\w:\-\.]+)\s*$/gim) && t[0].replace(/^\s*#([\w:\-\.]+)\s*$/gim, function (e, i) {
                var a = document, n = a && a.getElementById(i);
                t[0] = n ? n.value || n.innerHTML : e
            }), 1 == arguments.length ? e.compile.apply(e, t) : arguments.length >= 2 ? e.to_html.apply(e, t) : void 0
        }, t = {
            escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
            escapereplace: function (e) {
                return t.escapehash[e]
            },
            escaping: function (e) {
                return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
            },
            detection: function (e) {
                return "undefined" == typeof e ? "" : e
            }
        }, i = function (e) {
            if ("undefined" != typeof console) {
                if (console.warn)return void console.warn(e);
                if (console.log)return void console.log(e)
            }
            throw e
        }, a = function (e, t) {
            if (e = e !== Object(e) ? {} : e, e.__proto__)return e.__proto__ = t, e;
            var i = function () {
            }, a = Object.create ? Object.create(t) : new (i.prototype = t, i);
            for (var n in e)e.hasOwnProperty(n) && (a[n] = e[n]);
            return a
        };
        e.__cache = {}, e.version = "0.6.5-stable", e.settings = {}, e.tags = {
            operationOpen: "{@",
            operationClose: "}",
            interpolateOpen: "\\${",
            interpolateClose: "}",
            noneencodeOpen: "\\$\\${",
            noneencodeClose: "}",
            commentOpen: "\\{#",
            commentClose: "\\}"
        }, e.options = {
            cache: !0,
            strip: !0,
            errorhandling: !0,
            detection: !0,
            _method: a({__escapehtml: t, __throw: i, __juicer: e}, {})
        }, e.tagInit = function () {
            var t = e.tags.operationOpen + "each\\s*([^}]*?)\\s*as\\s*(\\w*?)\\s*(,\\s*\\w*?)?" + e.tags.operationClose, i = e.tags.operationOpen + "\\/each" + e.tags.operationClose, a = e.tags.operationOpen + "if\\s*([^}]*?)" + e.tags.operationClose, n = e.tags.operationOpen + "\\/if" + e.tags.operationClose, o = e.tags.operationOpen + "else" + e.tags.operationClose, r = e.tags.operationOpen + "else if\\s*([^}]*?)" + e.tags.operationClose, s = e.tags.interpolateOpen + "([\\s\\S]+?)" + e.tags.interpolateClose, l = e.tags.noneencodeOpen + "([\\s\\S]+?)" + e.tags.noneencodeClose, c = e.tags.commentOpen + "[^}]*?" + e.tags.commentClose, d = e.tags.operationOpen + "each\\s*(\\w*?)\\s*in\\s*range\\(([^}]+?)\\s*,\\s*([^}]+?)\\)" + e.tags.operationClose, p = e.tags.operationOpen + "include\\s*([^}]*?)\\s*,\\s*([^}]*?)" + e.tags.operationClose;
            e.settings.forstart = new RegExp(t, "igm"), e.settings.forend = new RegExp(i, "igm"), e.settings.ifstart = new RegExp(a, "igm"), e.settings.ifend = new RegExp(n, "igm"), e.settings.elsestart = new RegExp(o, "igm"), e.settings.elseifstart = new RegExp(r, "igm"), e.settings.interpolate = new RegExp(s, "igm"), e.settings.noneencode = new RegExp(l, "igm"), e.settings.inlinecomment = new RegExp(c, "igm"), e.settings.rangestart = new RegExp(d, "igm"), e.settings.include = new RegExp(p, "igm")
        }, e.tagInit(), e.set = function (e, t) {
            var i = this, a = function (e) {
                return e.replace(/[\$\(\)\[\]\+\^\{\}\?\*\|\.]/gim, function (e) {
                    return "\\" + e
                })
            }, n = function (e, t) {
                var n = e.match(/^tag::(.*)$/i);
                return n ? (i.tags[n[1]] = a(t), void i.tagInit()) : void(i.options[e] = t)
            };
            if (2 === arguments.length)return void n(e, t);
            if (e === Object(e))for (var o in e)e.hasOwnProperty(o) && n(o, e[o])
        }, e.register = function (e, t) {
            var i = this.options._method;
            return !i.hasOwnProperty(e) && (i[e] = t)
        }, e.unregister = function (e) {
            var t = this.options._method;
            if (t.hasOwnProperty(e))return delete t[e]
        }, e.template = function (t) {
            var i = this;
            this.options = t, this.__interpolate = function (e, t, i) {
                var a, n = e.split("|"), o = n[0] || "";
                return n.length > 1 && (e = n.shift(), a = n.shift().split(","), o = "_method." + a.shift() + ".call({}, " + [e].concat(a) + ")"), "<%= " + (t ? "_method.__escapehtml.escaping" : "") + "(" + (i && i.detection === !1 ? "" : "_method.__escapehtml.detection") + "(" + o + ")) %>"
            }, this.__removeShell = function (t, a) {
                var n = 0;
                return t = t.replace(e.settings.forstart, function (e, t, i, a) {
                    var i = i || "value", a = a && a.substr(1), o = "i" + n++;
                    return "<% ~function() {for(var " + o + " in " + t + ") {if(" + t + ".hasOwnProperty(" + o + ")) {var " + i + "=" + t + "[" + o + "];" + (a ? "var " + a + "=" + o + ";" : "") + " %>"
                }).replace(e.settings.forend, "<% }}}(); %>").replace(e.settings.ifstart, function (e, t) {
                    return "<% if(" + t + ") { %>"
                }).replace(e.settings.ifend, "<% } %>").replace(e.settings.elsestart, function (e) {
                    return "<% } else { %>"
                }).replace(e.settings.elseifstart, function (e, t) {
                    return "<% } else if(" + t + ") { %>"
                }).replace(e.settings.noneencode, function (e, t) {
                    return i.__interpolate(t, !1, a)
                }).replace(e.settings.interpolate, function (e, t) {
                    return i.__interpolate(t, !0, a)
                }).replace(e.settings.inlinecomment, "").replace(e.settings.rangestart, function (e, t, i, a) {
                    var o = "j" + n++;
                    return "<% ~function() {for(var " + o + "=" + i + ";" + o + "<" + a + ";" + o + "++) {{var " + t + "=" + o + "; %>"
                }).replace(e.settings.include, function (e, t, i) {
                    return "<%= _method.__juicer(" + t + ", " + i + "); %>"
                }), a && a.errorhandling === !1 || (t = "<% try { %>" + t, t += '<% } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} %>'), t
            }, this.__toNative = function (e, t) {
                return this.__convert(e, !t || t.strip)
            }, this.__lexicalAnalyze = function (t) {
                var i = [], a = [], n = "", o = ["if", "each", "_", "_method", "console", "break", "case", "catch", "continue", "debugger", "default", "delete", "do", "finally", "for", "function", "in", "instanceof", "new", "return", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "null", "typeof", "class", "enum", "export", "extends", "import", "super", "implements", "interface", "let", "package", "private", "protected", "public", "static", "yield", "const", "arguments", "true", "false", "undefined", "NaN"], r = function (e, t) {
                    if (Array.prototype.indexOf && e.indexOf === Array.prototype.indexOf)return e.indexOf(t);
                    for (var i = 0; i < e.length; i++)if (e[i] === t)return i;
                    return -1
                }, s = function (t, n) {
                    if (n = n.match(/\w+/gim)[0], r(i, n) === -1 && r(o, n) === -1 && r(a, n) === -1) {
                        if ("undefined" != typeof window && "function" == typeof window[n] && window[n].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i))return t;
                        if ("undefined" != typeof global && "function" == typeof global[n] && global[n].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i))return t;
                        if ("function" == typeof e.options._method[n] || e.options._method.hasOwnProperty(n))return a.push(n), t;
                        i.push(n)
                    }
                    return t
                };
                t.replace(e.settings.forstart, s).replace(e.settings.interpolate, s).replace(e.settings.ifstart, s).replace(e.settings.elseifstart, s).replace(e.settings.include, s).replace(/[\+\-\*\/%!\?\|\^&~<>=,\(\)\[\]]\s*([A-Za-z_]+)/gim, s);
                for (var l = 0; l < i.length; l++)n += "var " + i[l] + "=_." + i[l] + ";";
                for (var l = 0; l < a.length; l++)n += "var " + a[l] + "=_method." + a[l] + ";";
                return "<% " + n + " %>"
            }, this.__convert = function (e, t) {
                var i = [].join("");
                return i += "'use strict';", i += "var _=_||{};", i += "var _out='';_out+='", i += t !== !1 ? e.replace(/\\/g, "\\\\").replace(/[\r\t\n]/g, " ").replace(/'(?=[^%]*%>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='").split("<%").join("';").split("%>").join("_out+='") + "';return _out;" : e.replace(/\\/g, "\\\\").replace(/[\r]/g, "\\r").replace(/[\t]/g, "\\t").replace(/[\n]/g, "\\n").replace(/'(?=[^%]*%>)/g, "\t").split("'").join("\\'").split("\t").join("'").replace(/<%=(.+?)%>/g, "';_out+=$1;_out+='").split("<%").join("';").split("%>").join("_out+='") + "';return _out.replace(/[\\r\\n]\\s+[\\r\\n]/g, '\\r\\n');"
            }, this.parse = function (e, t) {
                var n = this;
                return t && t.loose === !1 || (e = this.__lexicalAnalyze(e) + e), e = this.__removeShell(e, t), e = this.__toNative(e, t), this._render = new Function("_, _method", e), this.render = function (e, t) {
                    return t && t === i.options._method || (t = a(t, i.options._method)), n._render.call(this, e, t)
                }, this
            }
        }, e.compile = function (e, t) {
            t && t === this.options || (t = a(t, this.options));
            try {
                var n = this.__cache[e] ? this.__cache[e] : new this.template(this.options).parse(e, t);
                return t && t.cache === !1 || (this.__cache[e] = n), n
            } catch (o) {
                return i("Juicer Compile Exception: " + o.message), {
                    render: function () {
                    }
                }
            }
        }, e.to_html = function (e, t, i) {
            return i && i === this.options || (i = a(i, this.options)), this.compile(e, i).render(t, i._method)
        }, "undefined" != typeof module && module.exports ? module.exports = e : this.juicer = e
    }(), define("juicer", [], function () {
    }), function (e, t, i, a) {
        "use strict";
        var n = i("html"), o = i(e), r = i(t), s = i.fancybox = function () {
            s.open.apply(this, arguments)
        }, l = navigator.userAgent.match(/msie/i), c = null, d = t.createTouch !== a, p = function (e) {
            return e && e.hasOwnProperty && e instanceof i
        }, u = function (e) {
            return e && "string" === i.type(e)
        }, m = function (e) {
            return u(e) && e.indexOf("%") > 0
        }, h = function (e) {
            return e && !(e.style.overflow && "hidden" === e.style.overflow) && (e.clientWidth && e.scrollWidth > e.clientWidth || e.clientHeight && e.scrollHeight > e.clientHeight)
        }, f = function (e, t) {
            var i = parseInt(e, 10) || 0;
            return t && m(e) && (i = s.getViewport()[t] / 100 * i), Math.ceil(i)
        }, g = function (e, t) {
            return f(e, t) + "px"
        };
        i.extend(s, {
            version: "2.1.5",
            defaults: {
                padding: 15,
                margin: 20,
                width: 800,
                height: 600,
                minWidth: 100,
                minHeight: 100,
                maxWidth: 9999,
                maxHeight: 9999,
                pixelRatio: 1,
                autoSize: !0,
                autoHeight: !1,
                autoWidth: !1,
                autoResize: !0,
                autoCenter: !d,
                fitToView: !0,
                aspectRatio: !1,
                topRatio: .5,
                leftRatio: .5,
                scrolling: "auto",
                wrapCSS: "",
                arrows: !0,
                closeBtn: !0,
                closeClick: !1,
                nextClick: !1,
                mouseWheel: !0,
                autoPlay: !1,
                playSpeed: 3e3,
                preload: 3,
                modal: !1,
                loop: !0,
                ajax: {dataType: "html", headers: {"X-fancyBox": !0}},
                iframe: {scrolling: "auto", preload: !0},
                swf: {wmode: "transparent", allowfullscreen: "true", allowscriptaccess: "always"},
                keys: {
                    next: {13: "left", 34: "up", 39: "left", 40: "up"},
                    prev: {8: "right", 33: "down", 37: "right", 38: "down"},
                    close: [27],
                    play: [32],
                    toggle: [70]
                },
                direction: {next: "left", prev: "right"},
                scrollOutside: !0,
                index: 0,
                type: null,
                href: null,
                content: null,
                title: null,
                tpl: {
                    wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',
                    image: '<img class="fancybox-image" src="{href}" alt="" />',
                    iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' + (l ? ' allowtransparency="true"' : "") + "></iframe>",
                    error: '<p class="fancybox-error">图片加载出错了😢</p>',
                    closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                    next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                    prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
                },
                openEffect: "fade",
                openSpeed: 250,
                openEasing: "swing",
                openOpacity: !0,
                openMethod: "zoomIn",
                closeEffect: "fade",
                closeSpeed: 250,
                closeEasing: "swing",
                closeOpacity: !0,
                closeMethod: "zoomOut",
                nextEffect: "elastic",
                nextSpeed: 250,
                nextEasing: "swing",
                nextMethod: "changeIn",
                prevEffect: "elastic",
                prevSpeed: 250,
                prevEasing: "swing",
                prevMethod: "changeOut",
                helpers: {overlay: !0, title: !0},
                onCancel: i.noop,
                beforeLoad: i.noop,
                afterLoad: i.noop,
                beforeShow: i.noop,
                afterShow: i.noop,
                beforeChange: i.noop,
                beforeClose: i.noop,
                afterClose: i.noop
            },
            group: {},
            opts: {},
            previous: null,
            coming: null,
            current: null,
            isActive: !1,
            isOpen: !1,
            isOpened: !1,
            wrap: null,
            skin: null,
            outer: null,
            inner: null,
            player: {timer: null, isActive: !1},
            ajaxLoad: null,
            imgPreload: null,
            transitions: {},
            helpers: {},
            open: function (e, t) {
                if (e && (i.isPlainObject(t) || (t = {}), !1 !== s.close(!0)))return i.isArray(e) || (e = p(e) ? i(e).get() : [e]), i.each(e, function (n, o) {
                    var r, l, c, d, m, h, f, g = {};
                    "object" === i.type(o) && (o.nodeType && (o = i(o)), p(o) ? (g = {
                        href: o.data("fancybox-href") || o.attr("href"),
                        title: o.data("fancybox-title") || o.attr("title"),
                        isDom: !0,
                        element: o
                    }, i.metadata && i.extend(!0, g, o.metadata())) : g = o), r = t.href || g.href || (u(o) ? o : null), l = t.title !== a ? t.title : g.title || "", c = t.content || g.content, d = c ? "html" : t.type || g.type, !d && g.isDom && (d = o.data("fancybox-type"), d || (m = o.prop("class").match(/fancybox\.(\w+)/), d = m ? m[1] : null)), u(r) && (d || (s.isImage(r) ? d = "image" : s.isSWF(r) ? d = "swf" : "#" === r.charAt(0) ? d = "inline" : u(o) && (d = "html", c = o)), "ajax" === d && (h = r.split(/\s+/, 2), r = h.shift(), f = h.shift())), c || ("inline" === d ? r ? c = i(u(r) ? r.replace(/.*(?=#[^\s]+$)/, "") : r) : g.isDom && (c = o) : "html" === d ? c = r : d || r || !g.isDom || (d = "inline", c = o)), i.extend(g, {
                        href: r,
                        type: d,
                        content: c,
                        title: l,
                        selector: f
                    }), e[n] = g
                }), s.opts = i.extend(!0, {}, s.defaults, t), t.keys !== a && (s.opts.keys = !!t.keys && i.extend({}, s.defaults.keys, t.keys)), s.group = e, s._start(s.opts.index)
            },
            cancel: function () {
                var e = s.coming;
                e && !1 !== s.trigger("onCancel") && (s.hideLoading(), s.ajaxLoad && s.ajaxLoad.abort(), s.ajaxLoad = null, s.imgPreload && (s.imgPreload.onload = s.imgPreload.onerror = null), e.wrap && e.wrap.stop(!0, !0).trigger("onReset").remove(), s.coming = null, s.current || s._afterZoomOut(e))
            },
            close: function (e) {
                s.cancel(), !1 !== s.trigger("beforeClose") && (s.unbindEvents(), s.isActive && (s.isOpen && e !== !0 ? (s.isOpen = s.isOpened = !1, s.isClosing = !0, i(".fancybox-item, .fancybox-nav").remove(), s.wrap.stop(!0, !0).removeClass("fancybox-opened"), s.transitions[s.current.closeMethod]()) : (i(".fancybox-wrap").stop(!0).trigger("onReset").remove(), s._afterZoomOut())))
            },
            play: function (e) {
                var t = function () {
                    clearTimeout(s.player.timer)
                }, i = function () {
                    t(), s.current && s.player.isActive && (s.player.timer = setTimeout(s.next, s.current.playSpeed))
                }, a = function () {
                    t(), r.unbind(".player"), s.player.isActive = !1, s.trigger("onPlayEnd")
                }, n = function () {
                    s.current && (s.current.loop || s.current.index < s.group.length - 1) && (s.player.isActive = !0, r.bind({
                        "onCancel.player beforeClose.player": a,
                        "onUpdate.player": i,
                        "beforeLoad.player": t
                    }), i(), s.trigger("onPlayStart"))
                };
                e === !0 || !s.player.isActive && e !== !1 ? n() : a()
            },
            next: function (e) {
                var t = s.current;
                t && (u(e) || (e = t.direction.next), s.jumpto(t.index + 1, e, "next"))
            },
            prev: function (e) {
                var t = s.current;
                t && (u(e) || (e = t.direction.prev), s.jumpto(t.index - 1, e, "prev"))
            },
            jumpto: function (e, t, i) {
                var n = s.current;
                n && (e = f(e), s.direction = t || n.direction[e >= n.index ? "next" : "prev"], s.router = i || "jumpto", n.loop && (e < 0 && (e = n.group.length + e % n.group.length), e %= n.group.length), n.group[e] !== a && (s.cancel(), s._start(e)))
            },
            reposition: function (e, t) {
                var a, n = s.current, o = n ? n.wrap : null;
                o && (a = s._getPosition(t), e && "scroll" === e.type ? (delete a.position, o.stop(!0, !0).animate(a, 200)) : (o.css(a), n.pos = i.extend({}, n.dim, a)))
            },
            update: function (e) {
                var t = e && e.type, i = !t || "orientationchange" === t;
                i && (clearTimeout(c), c = null), s.isOpen && !c && (c = setTimeout(function () {
                    var a = s.current;
                    a && !s.isClosing && (s.wrap.removeClass("fancybox-tmp"), (i || "load" === t || "resize" === t && a.autoResize) && s._setDimension(), "scroll" === t && a.canShrink || s.reposition(e), s.trigger("onUpdate"), c = null)
                }, i && !d ? 0 : 300))
            },
            toggle: function (e) {
                s.isOpen && (s.current.fitToView = "boolean" === i.type(e) ? e : !s.current.fitToView, d && (s.wrap.removeAttr("style").addClass("fancybox-tmp"), s.trigger("onUpdate")), s.update())
            },
            hideLoading: function () {
                r.unbind(".loading"), i("#fancybox-loading").remove()
            },
            showLoading: function () {
                var e, t;
                s.hideLoading(), e = i('<div id="fancybox-loading"><div></div></div>').click(s.cancel).appendTo("body"), r.bind("keydown.loading", function (e) {
                    27 === (e.which || e.keyCode) && (e.preventDefault(), s.cancel())
                }), s.defaults.fixed || (t = s.getViewport(), e.css({
                    position: "absolute",
                    top: .5 * t.h + t.y,
                    left: .5 * t.w + t.x
                }))
            },
            getViewport: function () {
                var t = s.current && s.current.locked || !1, i = {x: o.scrollLeft(), y: o.scrollTop()};
                return t ? (i.w = t[0].clientWidth, i.h = t[0].clientHeight) : (i.w = d && e.innerWidth ? e.innerWidth : o.width(), i.h = d && e.innerHeight ? e.innerHeight : o.height()), i
            },
            unbindEvents: function () {
                s.wrap && p(s.wrap) && s.wrap.unbind(".fb"), r.unbind(".fb"), o.unbind(".fb")
            },
            bindEvents: function () {
                var e, t = s.current;
                t && (o.bind("orientationchange.fb" + (d ? "" : " resize.fb") + (t.autoCenter && !t.locked ? " scroll.fb" : ""), s.update), e = t.keys, e && r.bind("keydown.fb", function (n) {
                    var o = n.which || n.keyCode, r = n.target || n.srcElement;
                    return (27 !== o || !s.coming) && void(n.ctrlKey || n.altKey || n.shiftKey || n.metaKey || r && (r.type || i(r).is("[contenteditable]")) || i.each(e, function (e, r) {
                            return t.group.length > 1 && r[o] !== a ? (s[e](r[o]), n.preventDefault(), !1) : i.inArray(o, r) > -1 ? (s[e](), n.preventDefault(), !1) : void 0
                        }))
                }), i.fn.mousewheel && t.mouseWheel && s.wrap.bind("mousewheel.fb", function (e, a, n, o) {
                    for (var r = e.target || null, l = i(r), c = !1; l.length && !(c || l.is(".fancybox-skin") || l.is(".fancybox-wrap"));)c = h(l[0]), l = i(l).parent();
                    0 === a || c || s.group.length > 1 && !t.canShrink && (o > 0 || n > 0 ? s.prev(o > 0 ? "down" : "left") : (o < 0 || n < 0) && s.next(o < 0 ? "up" : "right"), e.preventDefault())
                }))
            },
            trigger: function (e, t) {
                var a, n = t || s.coming || s.current;
                if (n) {
                    if (i.isFunction(n[e]) && (a = n[e].apply(n, Array.prototype.slice.call(arguments, 1))), a === !1)return !1;
                    n.helpers && i.each(n.helpers, function (t, a) {
                        a && s.helpers[t] && i.isFunction(s.helpers[t][e]) && s.helpers[t][e](i.extend(!0, {}, s.helpers[t].defaults, a), n)
                    }), r.trigger(e)
                }
            },
            isImage: function (e) {
                return u(e) && e.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)
            },
            isSWF: function (e) {
                return u(e) && e.match(/\.(swf)((\?|#).*)?$/i)
            },
            _start: function (e) {
                var t, a, n, o, r, l = {};
                if (e = f(e), t = s.group[e] || null, !t)return !1;
                if (l = i.extend(!0, {}, s.opts, t), o = l.margin, r = l.padding, "number" === i.type(o) && (l.margin = [o, o, o, o]), "number" === i.type(r) && (l.padding = [r, r, r, r]), l.modal && i.extend(!0, l, {
                        closeBtn: !1,
                        closeClick: !1,
                        nextClick: !1,
                        arrows: !1,
                        mouseWheel: !1,
                        keys: null,
                        helpers: {overlay: {closeClick: !1}}
                    }), l.autoSize && (l.autoWidth = l.autoHeight = !0), "auto" === l.width && (l.autoWidth = !0), "auto" === l.height && (l.autoHeight = !0), l.group = s.group, l.index = e, s.coming = l, !1 === s.trigger("beforeLoad"))return void(s.coming = null);
                if (n = l.type, a = l.href, !n)return s.coming = null, !(!s.current || !s.router || "jumpto" === s.router) && (s.current.index = e, s[s.router](s.direction));
                if (s.isActive = !0, "image" !== n && "swf" !== n || (l.autoHeight = l.autoWidth = !1, l.scrolling = "visible"), "image" === n && (l.aspectRatio = !0), "iframe" === n && d && (l.scrolling = "scroll"), l.wrap = i(l.tpl.wrap).addClass("fancybox-" + (d ? "mobile" : "desktop") + " fancybox-type-" + n + " fancybox-tmp " + l.wrapCSS).appendTo(l.parent || "body"), i.extend(l, {
                        skin: i(".fancybox-skin", l.wrap),
                        outer: i(".fancybox-outer", l.wrap),
                        inner: i(".fancybox-inner", l.wrap)
                    }), i.each(["Top", "Right", "Bottom", "Left"], function (e, t) {
                        l.skin.css("padding" + t, g(l.padding[e]))
                    }), s.trigger("onReady"), "inline" === n || "html" === n) {
                    if (!l.content || !l.content.length)return s._error("content")
                } else if (!a)return s._error("href");
                "image" === n ? s._loadImage() : "ajax" === n ? s._loadAjax() : "iframe" === n ? s._loadIframe() : s._afterLoad()
            },
            _error: function (e) {
                i.extend(s.coming, {
                    type: "html",
                    autoWidth: !0,
                    autoHeight: !0,
                    minWidth: 0,
                    minHeight: 0,
                    scrolling: "no",
                    hasError: e,
                    content: s.coming.tpl.error
                }), s._afterLoad()
            },
            _loadImage: function () {
                var e = s.imgPreload = new Image;
                e.onload = function () {
                    this.onload = this.onerror = null, s.coming.width = this.width / s.opts.pixelRatio, s.coming.height = this.height / s.opts.pixelRatio, s._afterLoad()
                }, e.onerror = function () {
                    this.onload = this.onerror = null, s._error("image")
                }, e.src = s.coming.href, e.complete !== !0 && s.showLoading()
            },
            _loadAjax: function () {
                var e = s.coming;
                s.showLoading(), s.ajaxLoad = i.ajax(i.extend({}, e.ajax, {
                    url: e.href, error: function (e, t) {
                        s.coming && "abort" !== t ? s._error("ajax", e) : s.hideLoading()
                    }, success: function (t, i) {
                        "success" === i && (e.content = t, s._afterLoad())
                    }
                }))
            },
            _loadIframe: function () {
                var e = s.coming, t = i(e.tpl.iframe.replace(/\{rnd\}/g, (new Date).getTime())).attr("scrolling", d ? "auto" : e.iframe.scrolling).attr("src", e.href);
                i(e.wrap).bind("onReset", function () {
                    try {
                        i(this).find("iframe").hide().attr("src", "//about:blank").end().empty()
                    } catch (e) {
                    }
                }), e.iframe.preload && (s.showLoading(), t.one("load", function () {
                    i(this).data("ready", 1), d || i(this).bind("load.fb", s.update), i(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(), s._afterLoad()
                })), e.content = t.appendTo(e.inner), e.iframe.preload || s._afterLoad()
            },
            _preloadImages: function () {
                var e, t, i = s.group, a = s.current, n = i.length, o = a.preload ? Math.min(a.preload, n - 1) : 0;
                for (t = 1; t <= o; t += 1)e = i[(a.index + t) % n], "image" === e.type && e.href && ((new Image).src = e.href)
            },
            _afterLoad: function () {
                var e, t, a, n, o, r, l = s.coming, c = s.current, d = "fancybox-placeholder";
                if (s.hideLoading(), l && s.isActive !== !1) {
                    if (!1 === s.trigger("afterLoad", l, c))return l.wrap.stop(!0).trigger("onReset").remove(), void(s.coming = null);
                    switch (c && (s.trigger("beforeChange", c), c.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()), s.unbindEvents(), e = l, t = l.content, a = l.type, n = l.scrolling, i.extend(s, {
                        wrap: e.wrap,
                        skin: e.skin,
                        outer: e.outer,
                        inner: e.inner,
                        current: e,
                        previous: c
                    }), o = e.href, a) {
                        case"inline":
                        case"ajax":
                        case"html":
                            e.selector ? t = i("<div>").html(t).find(e.selector) : p(t) && (t.data(d) || t.data(d, i('<div class="' + d + '"></div>').insertAfter(t).hide()), t = t.show().detach(), e.wrap.bind("onReset", function () {
                                i(this).find(t).length && t.hide().replaceAll(t.data(d)).data(d, !1)
                            }));
                            break;
                        case"image":
                            t = e.tpl.image.replace("{href}", o);
                            break;
                        case"swf":
                            t = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + o + '"></param>', r = "", i.each(e.swf, function (e, i) {
                                t += '<param name="' + e + '" value="' + i + '"></param>', r += " " + e + '="' + i + '"'
                            }), t += '<embed src="' + o + '" type="application/x-shockwave-flash" width="100%" height="100%"' + r + "></embed></object>"
                    }
                    p(t) && t.parent().is(e.inner) || e.inner.append(t), s.trigger("beforeShow"), e.inner.css("overflow", "yes" === n ? "scroll" : "no" === n ? "hidden" : n), s._setDimension(), s.reposition(), s.isOpen = !1, s.coming = null, s.bindEvents(), s.isOpened ? c.prevMethod && s.transitions[c.prevMethod]() : i(".fancybox-wrap").not(e.wrap).stop(!0).trigger("onReset").remove(), s.transitions[s.isOpened ? e.nextMethod : e.openMethod](), s._preloadImages()
                }
            },
            _setDimension: function () {
                var e, t, a, n, o, r, l, c, d, p, u, h, v, y, w, b = s.getViewport(), _ = 0, x = !1, T = !1, S = s.wrap, C = s.skin, j = s.inner, k = s.current, E = k.width, $ = k.height, M = k.minWidth, I = k.minHeight, P = k.maxWidth, A = k.maxHeight, O = k.scrolling, D = k.scrollOutside ? k.scrollbarWidth : 0, z = k.margin, N = f(z[1] + z[3]), L = f(z[0] + z[2]);
                if (S.add(C).add(j).width("auto").height("auto").removeClass("fancybox-tmp"), e = f(C.outerWidth(!0) - C.width()), t = f(C.outerHeight(!0) - C.height()), a = N + e, n = L + t, o = m(E) ? (b.w - a) * f(E) / 100 : E, r = m($) ? (b.h - n) * f($) / 100 : $, "iframe" === k.type) {
                    if (y = k.content, k.autoHeight && 1 === y.data("ready"))try {
                        y[0].contentWindow.document.location && (j.width(o).height(9999), w = y.contents().find("body"), D && w.css("overflow-x", "hidden"), r = w.outerHeight(!0))
                    } catch (F) {
                    }
                } else(k.autoWidth || k.autoHeight) && (j.addClass("fancybox-tmp"), k.autoWidth || j.width(o), k.autoHeight || j.height(r), k.autoWidth && (o = j.width()), k.autoHeight && (r = j.height()), j.removeClass("fancybox-tmp"));
                if (E = f(o), $ = f(r), d = o / r, M = f(m(M) ? f(M, "w") - a : M), P = f(m(P) ? f(P, "w") - a : P), I = f(m(I) ? f(I, "h") - n : I), A = f(m(A) ? f(A, "h") - n : A), l = P, c = A, k.fitToView && (P = Math.min(b.w - a, P), A = Math.min(b.h - n, A)), h = b.w - N, v = b.h - L, k.aspectRatio ? (E > P && (E = P, $ = f(E / d)), $ > A && ($ = A, E = f($ * d)), E < M && (E = M, $ = f(E / d)), $ < I && ($ = I, E = f($ * d))) : (E = Math.max(M, Math.min(E, P)), k.autoHeight && "iframe" !== k.type && (j.width(E), $ = j.height()), $ = Math.max(I, Math.min($, A))), k.fitToView)if (j.width(E).height($), S.width(E + e), p = S.width(), u = S.height(), k.aspectRatio)for (; (p > h || u > v) && E > M && $ > I && !(_++ > 19);)$ = Math.max(I, Math.min(A, $ - 10)), E = f($ * d), E < M && (E = M, $ = f(E / d)), E > P && (E = P, $ = f(E / d)), j.width(E).height($), S.width(E + e), p = S.width(), u = S.height(); else E = Math.max(M, Math.min(E, E - (p - h))), $ = Math.max(I, Math.min($, $ - (u - v)));
                D && "auto" === O && $ < r && E + e + D < h && (E += D), j.width(E).height($), S.width(E + e), p = S.width(), u = S.height(), x = (p > h || u > v) && E > M && $ > I, T = k.aspectRatio ? E < l && $ < c && E < o && $ < r : (E < l || $ < c) && (E < o || $ < r), i.extend(k, {
                    dim: {
                        width: g(p),
                        height: g(u)
                    },
                    origWidth: o,
                    origHeight: r,
                    canShrink: x,
                    canExpand: T,
                    wPadding: e,
                    hPadding: t,
                    wrapSpace: u - C.outerHeight(!0),
                    skinSpace: C.height() - $
                }), !y && k.autoHeight && $ > I && $ < A && !T && j.height("auto")
            },
            _getPosition: function (e) {
                var t = s.current, i = s.getViewport(), a = t.margin, n = s.wrap.width() + a[1] + a[3], o = s.wrap.height() + a[0] + a[2], r = {
                    position: "absolute",
                    top: a[0],
                    left: a[3]
                };
                return t.autoCenter && t.fixed && !e && o <= i.h && n <= i.w ? r.position = "fixed" : t.locked || (r.top += i.y, r.left += i.x), r.top = g(Math.max(r.top, r.top + (i.h - o) * t.topRatio)), r.left = g(Math.max(r.left, r.left + (i.w - n) * t.leftRatio)), r
            },
            _afterZoomIn: function () {
                var e = s.current;
                e && (s.isOpen = s.isOpened = !0, s.wrap.css("overflow", "visible").addClass("fancybox-opened"), s.update(), (e.closeClick || e.nextClick && s.group.length > 1) && s.inner.css("cursor", "pointer").bind("click.fb", function (t) {
                    i(t.target).is("a") || i(t.target).parent().is("a") || (t.preventDefault(), s[e.closeClick ? "close" : "next"]())
                }), e.closeBtn && i(e.tpl.closeBtn).appendTo(s.skin).bind("click.fb", function (e) {
                    e.preventDefault(), s.close()
                }), e.arrows && s.group.length > 1 && ((e.loop || e.index > 0) && i(e.tpl.prev).appendTo(s.outer).bind("click.fb", s.prev), (e.loop || e.index < s.group.length - 1) && i(e.tpl.next).appendTo(s.outer).bind("click.fb", s.next)), s.trigger("afterShow"), e.loop || e.index !== e.group.length - 1 ? s.opts.autoPlay && !s.player.isActive && (s.opts.autoPlay = !1, s.play()) : s.play(!1))
            },
            _afterZoomOut: function (e) {
                e = e || s.current, i(".fancybox-wrap").trigger("onReset").remove(), i.extend(s, {
                    group: {},
                    opts: {},
                    router: !1,
                    current: null,
                    isActive: !1,
                    isOpened: !1,
                    isOpen: !1,
                    isClosing: !1,
                    wrap: null,
                    skin: null,
                    outer: null,
                    inner: null
                }), s.trigger("afterClose", e)
            }
        }), s.transitions = {
            getOrigPosition: function () {
                var e = s.current, t = e.element, i = e.orig, a = {}, n = 50, o = 50, r = e.hPadding, l = e.wPadding, c = s.getViewport();
                return !i && e.isDom && t.is(":visible") && (i = t.find("img:first"), i.length || (i = t)), p(i) ? (a = i.offset(), i.is("img") && (n = i.outerWidth(), o = i.outerHeight())) : (a.top = c.y + (c.h - o) * e.topRatio, a.left = c.x + (c.w - n) * e.leftRatio), ("fixed" === s.wrap.css("position") || e.locked) && (a.top -= c.y, a.left -= c.x), a = {
                    top: g(a.top - r * e.topRatio),
                    left: g(a.left - l * e.leftRatio),
                    width: g(n + l),
                    height: g(o + r)
                }
            }, step: function (e, t) {
                var i, a, n, o = t.prop, r = s.current, l = r.wrapSpace, c = r.skinSpace;
                "width" !== o && "height" !== o || (i = t.end === t.start ? 1 : (e - t.start) / (t.end - t.start), s.isClosing && (i = 1 - i), a = "width" === o ? r.wPadding : r.hPadding, n = e - a, s.skin[o](f("width" === o ? n : n - l * i)), s.inner[o](f("width" === o ? n : n - l * i - c * i)))
            }, zoomIn: function () {
                var e = s.current, t = e.pos, a = e.openEffect, n = "elastic" === a, o = i.extend({opacity: 1}, t);
                delete o.position, n ? (t = this.getOrigPosition(), e.openOpacity && (t.opacity = .1)) : "fade" === a && (t.opacity = .1), s.wrap.css(t).animate(o, {
                    duration: "none" === a ? 0 : e.openSpeed,
                    easing: e.openEasing,
                    step: n ? this.step : null,
                    complete: s._afterZoomIn
                })
            }, zoomOut: function () {
                var e = s.current, t = e.closeEffect, i = "elastic" === t, a = {opacity: .1};
                i && (a = this.getOrigPosition(), e.closeOpacity && (a.opacity = .1)), s.wrap.animate(a, {
                    duration: "none" === t ? 0 : e.closeSpeed,
                    easing: e.closeEasing,
                    step: i ? this.step : null,
                    complete: s._afterZoomOut
                })
            }, changeIn: function () {
                var e, t = s.current, i = t.nextEffect, a = t.pos, n = {opacity: 1}, o = s.direction, r = 200;
                a.opacity = .1, "elastic" === i && (e = "down" === o || "up" === o ? "top" : "left", "down" === o || "right" === o ? (a[e] = g(f(a[e]) - r), n[e] = "+=" + r + "px") : (a[e] = g(f(a[e]) + r), n[e] = "-=" + r + "px")), "none" === i ? s._afterZoomIn() : s.wrap.css(a).animate(n, {
                    duration: t.nextSpeed,
                    easing: t.nextEasing,
                    complete: s._afterZoomIn
                })
            }, changeOut: function () {
                var e = s.previous, t = e.prevEffect, a = {opacity: .1}, n = s.direction, o = 200;
                "elastic" === t && (a["down" === n || "up" === n ? "top" : "left"] = ("up" === n || "left" === n ? "-" : "+") + "=" + o + "px"), e.wrap.animate(a, {
                    duration: "none" === t ? 0 : e.prevSpeed,
                    easing: e.prevEasing,
                    complete: function () {
                        i(this).trigger("onReset").remove()
                    }
                })
            }
        }, s.helpers.overlay = {
            defaults: {
                closeClick: !0,
                speedOut: 200,
                showEarly: !0,
                css: {},
                locked: !d,
                fixed: !0
            }, overlay: null, fixed: !1, el: i("html"), create: function (e) {
                e = i.extend({}, this.defaults, e), this.overlay && this.close(), this.overlay = i('<div class="fancybox-overlay"></div>').appendTo(s.coming ? s.coming.parent : e.parent), this.fixed = !1, e.fixed && s.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
            }, open: function (e) {
                var t = this;
                e = i.extend({}, this.defaults, e), this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(e), this.fixed || (o.bind("resize.overlay", i.proxy(this.update, this)), this.update()), e.closeClick && this.overlay.bind("click.overlay", function (e) {
                    if (i(e.target).hasClass("fancybox-overlay"))return s.isActive ? s.close() : t.close(), !1
                }), this.overlay.css(e.css).show()
            }, close: function () {
                var e, t;
                o.unbind("resize.overlay"), this.el.hasClass("fancybox-lock") && (i(".fancybox-margin").removeClass("fancybox-margin"), e = o.scrollTop(), t = o.scrollLeft(), this.el.removeClass("fancybox-lock"), o.scrollTop(e).scrollLeft(t)), i(".fancybox-overlay").remove().hide(), i.extend(this, {
                    overlay: null,
                    fixed: !1
                })
            }, update: function () {
                var e, i = "100%";
                this.overlay.width(i).height("100%"), l ? (e = Math.max(t.documentElement.offsetWidth, t.body.offsetWidth), r.width() > e && (i = r.width())) : r.width() > o.width() && (i = r.width()), this.overlay.width(i).height(r.height())
            }, onReady: function (e, t) {
                var a = this.overlay;
                i(".fancybox-overlay").stop(!0, !0), a || this.create(e), e.locked && this.fixed && t.fixed && (a || (this.margin = r.height() > o.height() && i("html").css("margin-right").replace("px", "")), t.locked = this.overlay.append(t.wrap), t.fixed = !1), e.showEarly === !0 && this.beforeShow.apply(this, arguments)
            }, beforeShow: function (e, t) {
                var a, n;
                t.locked && (this.margin !== !1 && (i("*").filter(function () {
                    return "fixed" === i(this).css("position") && !i(this).hasClass("fancybox-overlay") && !i(this).hasClass("fancybox-wrap")
                }).addClass("fancybox-margin"), this.el.addClass("fancybox-margin")), a = o.scrollTop(), n = o.scrollLeft(), this.el.addClass("fancybox-lock"), o.scrollTop(a).scrollLeft(n)), this.open(e)
            }, onUpdate: function () {
                this.fixed || this.update()
            }, afterClose: function (e) {
                this.overlay && !s.coming && this.overlay.fadeOut(e.speedOut, i.proxy(this.close, this))
            }
        }, s.helpers.title = {
            defaults: {type: "float", position: "bottom"}, beforeShow: function (e) {
                var t, a, n = s.current, o = n.title, r = e.type;
                if (i.isFunction(o) && (o = o.call(n.element, n)), u(o) && "" !== i.trim(o)) {
                    switch (t = i('<div class="fancybox-title fancybox-title-' + r + '-wrap">' + o + "</div>"), r) {
                        case"inside":
                            a = s.skin;
                            break;
                        case"outside":
                            a = s.wrap;
                            break;
                        case"over":
                            a = s.inner;
                            break;
                        default:
                            a = s.skin, t.appendTo("body"), l && t.width(t.width()), t.wrapInner('<span class="child"></span>'), s.current.margin[2] += Math.abs(f(t.css("margin-bottom")))
                    }
                    t["top" === e.position ? "prependTo" : "appendTo"](a)
                }
            }
        }, i.fn.fancybox = function (e) {
            var t, a = i(this), n = this.selector || "", o = function (o) {
                var r, l, c = i(this).blur(), d = t;
                o.ctrlKey || o.altKey || o.shiftKey || o.metaKey || c.is(".fancybox-wrap") || (r = e.groupAttr || "data-fancybox-group", l = c.attr(r), l || (r = "rel", l = c.get(0)[r]), l && "" !== l && "nofollow" !== l && (c = n.length ? i(n) : a, c = c.filter("[" + r + '="' + l + '"]'), d = c.index(this)), e.index = d, s.open(c, e) !== !1 && o.preventDefault())
            };
            return e = e || {}, t = e.index || 0, n && e.live !== !1 ? r.undelegate(n, "click.fb-start").delegate(n + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", o) : a.unbind("click.fb-start").bind("click.fb-start", o), this.filter("[data-fancybox-start=1]").trigger("click"), this
        }, r.ready(function () {
            var t, o;
            i.scrollbarWidth === a && (i.scrollbarWidth = function () {
                var e = i('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"), t = e.children(), a = t.innerWidth() - t.height(99).innerWidth();
                return e.remove(), a
            }), i.support.fixedPosition === a && (i.support.fixedPosition = function () {
                var e = i('<div style="position:fixed;top:20px;"></div>').appendTo("body"), t = 20 === e[0].offsetTop || 15 === e[0].offsetTop;
                return e.remove(), t
            }()), i.extend(s.defaults, {
                scrollbarWidth: i.scrollbarWidth(),
                parent: i("body")
            }), t = i(e).width(), n.addClass("fancybox-lock-test"), o = i(e).width(), n.removeClass("fancybox-lock-test"), i("<style type='text/css'>.fancybox-margin{margin-right:" + (o - t) + "px;}</style>").appendTo("head")
        })
    }(window, document, jQuery), define("fancybox", [], function () {
    }), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["base.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.project, r = (e.pic, e.user);
                e.item, e.div, e.container, e.banner, e.wrapper, e.slide, e.a, e.group_id, e.image, e.http, e.img, e.v6, e.close_backdrop, e.pagination, e.mod, e.pro, e.promulgator, e.store, e.index, e.load, e.grey, e.original, e.dl, e.dt, e.detail, e.tag, e.i, e.span, e.start, e.info, e.pi, e.tit, e.h1, e.jump, e.body, e.content, e.uuid, e.align, e.size, e.bot, e.zy, e.big, e.close_red, e.schedule, e.green, e.statistics, e.ul, e.li, e.h3, e.p, e.right, e.sline, e.end;
                n += '<div class="swiper-container home-banner">     <div class="swiper-wrapper">         ', ~function () {
                    for (var e in o.cover)if (o.cover.hasOwnProperty(e)) {
                        var i = o.cover[e];
                        n += '            <div class="swiper-slide">                 <a href="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.image)), n += '" class="fancybox" rel="fancybox" data-group_id="jdt">                 ',
                            1 == o.active ? (n += '                     <div class="imgDiv" style="background-image:url(', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.image)), n += ')"></div>                 ') : n += '                     <div class="imgDiv" style="background-image:url(http://static.qschou.com/img/v6/project/project-close_backdrop.png)"></div>                 ', n += "                 </a>            </div>        "
                    }
                }(), n += '      </div>     <div class="swiper-pagination"></div> </div> <div class="gyl-mod gyl-pro-promulgator">     <a href="/store/index/', n += t.__escapehtml.escaping(t.__escapehtml.detection(r.uuid)), n += '">         <img class="lazy-load" src="http://static.qschou.com/img/v6/grey.png" data-original="', n += t.__escapehtml.escaping(t.__escapehtml.detection(r.avatar)), n += '">         <dl>             <dt>', n += t.__escapehtml.escaping(t.__escapehtml.detection(r.nickname)), n += "</dt>              ", o.attr_tags && (n += '                 <dt class="project-detail-tag">                     ', ~function () {
                    for (var e in o.attr_tags)if (o.attr_tags.hasOwnProperty(e)) {
                        var i = o.attr_tags[e];
                        n += '                     <span style="color: ', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.color)), n += "; background: ", n += t.__escapehtml.escaping(t.__escapehtml.detection(i.bg_color)), n += '">', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.text)), n += "</span>                     "
                    }
                }(), n += "                 </dt>             "), n += '          </dl>      </a> </div>   <!-- start [项目信息] --> <div class="gyl-mod gyl-pro-info">          <div class="gyl-pi-tit">         <h1>', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.name)), n += '</h1>     </div>     <div class="gyl-pi-jump">         ', 1 == o.active ? (n += '                  <div class="view-body">', n += t.__escapehtml.detection(o.introduction), n += '</div>                  <a href="/project/content.html?uuid=', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" style="text-align: center;color:#43AC43;font-size: 16px;"><span class="gyl-bot-zy-big">查看全文</span></a>         ') : n += '             <a href="javascript:void(0);" style="text-align:center;"><i class="icon-close_red"></i><span style="color:#f25b4b;">该项目项目已关闭，无法预览项目内容。</span></a>         ', n += '     </div>     <div class="gyl-pi-tit">         <span>', n += t.__escapehtml.detection(o.tips.status), n += '</span>     </div>     <div class="gyl-pi-schedule">         <div class="gyl-pi-green" style="width:', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.process)), n += '%"></div>     </div>     <div class="gyl-pi-statistics hairline bottom">         <ul>             <li>                 <h3>目标金额</h3>                 <p>', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.target_amount)), n += '<span>元</span></p>                 <i class="gyl-right-sline hairline right"></i>             </li>             <li>                 <h3>已筹金额</h3>                 <p>', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.raised_amount)), n += '<span>元</span></p>                 <i class="gyl-right-sline hairline right"></i>             </li>             <li>                 <h3>支持次数</h3>                 <p><span>', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.support_number)), n += "次</span></p>             </li>         </ul>     </div>      </div> <!-- end [项目信息] --> "
            } catch (s) {
                t.__throw("Juicer Render Exception: " + s.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["dreamMain.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                e.div, e.fixed, e.project, e.start, e.end, e.logo, e.mark, e.a, e.mp, e.s, e.__biz, e.MzA3NTA1NDE2Ng, e.mid, e.idx, e.sn, e.modal, e.comment, e.unreply, e.hidden, e.dialog, e.content, e.header, e.body, e.text, e.textarea, e.input, e.count, e.span, e.footer, e.dismiss, e.button, e.strong, e.reply;
                n += '<div id="headerReplaceDiv"></div>  <div class="content-fixed top bottom mod-project">      <!-- start [项目详情内容] -->     <div id="baseReplaceDiv"></div>     <!-- end [项目详情内容] -->      <!-- start [帮TA实现] -->          <div id="huibaoReplaceDiv"></div>         <!-- end [帮TA实现] -->              <div id="tabReplaceDiv"></div>       <div class="qsc-logo-mark">         <a href="http://mp.weixin.qq.com/s?__biz=MzA3NTA1NDE2Ng==&mid=201655378&idx=1&sn=806cd4636c2c29efd8c059ab7c8aa37a#rd"></a>     </div> </div>  <div id="footerReplaceDiv"></div> <div id="shareReplaceDiv"></div> <div id="manageReplaceDiv"></div>   <div class="qsc-modal dialog" id="modal-comment-unreply" aria-hidden="true" >     <div class="modal-dialog middle">         <div class="modal-content">                        <div class="modal-header">                     发表评论                 </div>                 <div class="modal-body modal-text">                     <textarea class="control-input content" name="content" rows="3" placeholder="填写评论内容" maxlength="80"></textarea>                     <div class="modal-count"><span class="c-s-1">0</span>/<span class="c-s-2">80</span></div>                 </div>                 <div class="modal-footer clearfix" role="group">                     <a href="javascript:void(0);" class="btn btn-default" data-dismiss="modal">取消</a>                     <button type="submit" name="submit" class="btn active" id="unreply_submit"><strong>写好了</strong></button>                                     </div>                    </div>     </div> </div>  <div class="qsc-modal dialog" id="modal-comment-reply" aria-hidden="true">     <div class="modal-dialog middle">         <div class="modal-content">             <div class="modal-header">                 回复留言             </div>             <div class="modal-body modal-text">                 <textarea class="control-input content"  name="content" rows="3" placeholder=""></textarea>                 <div class="modal-count"><span class="c-s-1">0</span>/<span class="c-s-2">80</span></div>             </div>             <div class="modal-footer clearfix">                 <a href="javascript:void(0);"  class="btn btn-default" data-dismiss="modal">取消</a>                 <input type="submit" class="btn active" value="回复" id="reply_submit">             </div>         </div>     </div> </div>   <div class="qsc-modal dialog" id="modal-comment-delete" aria-hidden="true">     <div class="modal-dialog middle">         <div class="modal-content">             <div class="modal-header">                 删除评论             </div>             <div class="modal-body">             </div>             <div class="modal-footer clearfix">                 <a href="javascript:void(0);"  class="btn btn-default" data-dismiss="modal">取消</a>                                  <input type="submit" class="btn active" value="删除" id="feed_delete_submit">             </div>         </div>     </div> </div> '
            } catch (o) {
                t.__throw("Juicer Render Exception: " + o.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["feed.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.data, r = (e.item, e.contentValues, e.titleValue, e.contentValue, e.image, e.index), s = (e.comment, e.avatar), l = e.nickname;
                e.i, e.div, e.project, e.card, e.timeline, e.start, e.topicid, e.item_user, e.img, e.load, e.v6, e.grey, e.original, e.progress, e.progress_create, e.item_content, e.h6, e.item_content_user, e.span, e.small, e.p, e.item_content_talk, e.br, e.card_content__img, e.a, e.group_id, e.card_content_player, e.poster, e.url, e.m, e.detail, e.qscvideo, e.player, e.uuid, e.ind, e.item_content_time, e.item_content_comment, e.item_content_talk__comment, e.triangle, e.reciver, e.name, e.commentid, e.strong, e.more, e.align, e.end, e.modal, e.bg, e.show, e.head, e.video, e.close;
                n += ' <div class="mod-project-card">           <div class="project-timeline clearfix">         ', ~function () {
                    for (var e in o)if (o.hasOwnProperty(e)) {
                        var i = o[e];
                        n += '         <!-- start [提前结束项目] -->         <div class="timeline-item" data-topicid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.id)), n += '">             <div class="time">                 <div class="timeline-item_user">                     <img class="lazy-load" src="http://static.qschou.com/img/v6/grey.png" data-original="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.user.avatar)), n += '" width="100%" alt="">                     <!--<i class="icon-progress icon-progress_create"></i>-->                 </div>             </div>             <div class="timeline-item_content">                 <h6 class="timeline-item_content_user">                     <span class="user_name">', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.user.nickname)), n += "</span>                     <!--", ~function () {
                            for (var e in i.title)if (i.title.hasOwnProperty(e)) {
                                var a = i.title[e];
                                n += '-->                         <!--<small style="color:', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.color)), n += '">', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.text)), n += "</small>-->                     <!--"
                            }
                        }(), n += '-->                 </h6>                  <p class="timeline-item_content_talk">                     ', i.content.length && (n += "                          ", ~function () {
                            for (var e in i.content)if (i.content.hasOwnProperty(e)) {
                                var a = i.content[e];
                                n += "                             ", ~function () {
                                    for (var e in a)if (a.hasOwnProperty(e)) {
                                        var i = a[e];
                                        n += '                              <span style="', i.color ? (n += "color:", n += t.__escapehtml.escaping(t.__escapehtml.detection(i.color)), n += "") : n += "color:#999999", n += '">', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.text)), n += "</span>                             "
                                    }
                                }(), n += "<br>                         "
                            }
                        }(), n += "                      "), n += "                 </p>                  ", i.images.length && (n += '                 <div class="mod-project-card_content__img clearfix">                      ', ~function () {
                            for (var e in i.images)if (i.images.hasOwnProperty(e)) {
                                var a = i.images[e];
                                n += '                         <a href="', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.image)), n += '" class="fancybox" rel="fancybox" data-group_id="feed', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.id)), n += '">                         <img class="lazy-load" src="http://static.qschou.com/img/v6/grey.png" data-original="', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.thumb)), n += '" width="25%" alt="">                     </a>                     '
                            }
                        }(), n += "                 </div>                 "), n += "                  ", i.video && (n += '                 <div class="mod-project-card_content_player clearfix" data-poster="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.video.image)), n += '" data-url="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.video.url)), n += '">                    <!-- <a href="http://m.qschou.com/project/detail/qscvideo/player.html?uuid=', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.prjuuid)), n += "&ind=", n += t.__escapehtml.escaping(t.__escapehtml.detection(r)), n += '"> -->                         <img class="lazy-load" src="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.video.image)), n += '" style="width:160px;height: 120px;" alt="">                         <i class="icon-player-start"></i>                    <!-- </a> -->                 </div>                  '), n += '                  <p class="timeline-item_content_time">', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.created)), n += '                     <a class="timeline-item_content_comment" href="javascript:void(0)"><i class="icon-comment"  data-topicid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.id)), n += '" style="cursor: pointer;"></i></a>                     ', ~function () {
                            for (var e in i.title)if (i.title.hasOwnProperty(e)) {
                                var a = i.title[e];
                                n += '                     <span style="color:', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.color)), n += '">', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.text)), n += "</span>                     "
                            }
                        }(), n += '                 </p>                  <div class="timeline-item_content_talk__comment" style="', 0 == i.comments.length && (n += " display: none "), n += '">                     <i class="icon-triangle"></i>                      ', ~function () {
                            for (var e in i.comments)if (i.comments.hasOwnProperty(e)) {
                                var a = i.comments[e], o = e;
                                n += '                         <a class="feed_comment ', o > 4 && (n += "hidden"), n += '"                                 data-reciver="', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.reciver.uuid)), n += '" data-uuid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.sender.uuid)), n += '"                                           data-name="', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.sender.nickname)), n += '" data-commentid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.comment_id)), n += '" style="cursor: pointer;">                              <strong>', n += t.__escapehtml.escaping(t.__escapehtml.detection(a.sender.nickname)), n += "</strong>", 1 == a.refer && (n += "回复<strong>", n += t.__escapehtml.escaping(t.__escapehtml.detection(a.reciver.nickname)), n += "</strong>"), n += " : ", n += t.__escapehtml.escaping(t.__escapehtml.detection(a.content)), n += "                          </a>                     "
                            }
                        }(), n += "                     ", 5 == i.comments.length && (n += '                         <a  class="btn-comment-more" href="javascript:void(0)" data-topicid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.id)), n += '" style="text-align: center">                             <strong>查看更多评论</strong>                         </a>                     '), n += "                 </div>             </div>         </div>         <!-- end [提前结束项目] -->         "
                    }
                }(), n += '     </div>  </div>  <div class="playerWrapper-modal" id="modal-player">     <div class="modal-bg"></div>     <div class="modal-show">         <div class="user-head">              ', s ? (n += '                 <img src="', n += t.__escapehtml.escaping(t.__escapehtml.detection(s)), n += '" >             ') : n += '                 <img src="http://static.qschou.com/img/v6/grey.png" >             ', n += "             <span>", n += t.__escapehtml.escaping(t.__escapehtml.detection(l)), n += '</span>         </div>                  </div>     <div class="icon-video-close"></div> </div> '
            } catch (c) {
                t.__throw("Juicer Render Exception: " + c.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["footer.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.project, r = e.platform, s = e.shareto;
                e.footer, e.bar, e.fixed, e.support, e.span, e.item, e.follow, e.i, e.star, e.o, e.small, e.a, e.back, e.from, e.projectindex, e.share, e.pro, e.btn, e.icon;
                n += '<!-- <footer id="footerMC" class="qsc-bar bar-fixed bar-support">     <span class="bar-item" id="btn-follow">         <i class="icon icon-star-o"></i>关注         <small>             ', o.follow_number > 0 && (n += "                 ", n += t.__escapehtml.escaping(t.__escapehtml.detection(o.follow_number)), n += "             "), n += '         </small>     </span>     <a href="/project/back/', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '?from=projectindex" class="bar-item btn-support">         <span>我要支持</span>     </a>     <span id="btn-share" class="bar-item">         <i class="icon icon-share"></i>分享         <small>             ', o.share_number > 0 && (n += "                 ", n += t.__escapehtml.escaping(t.__escapehtml.detection(o.share_number)), n += "             "), n += '         </small>     </span> </footer> -->   <footer id="footerMC" class="gyl-pro-btn hairline top">     <span id="btn-follow" class="bar-item" >          <i class="gyl-icon-follow"></i>         <small>             ', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.follow_number)), n += '         </small>              </span>         <span id="btn-share" class="bar-item">         <i class="gyl-icon-share"></i>         <small>             ', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.share_number)), n += "         </small>     </span>       ", r ? (n += '     <a href="/project/back/', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += "?platform=", n += t.__escapehtml.escaping(t.__escapehtml.detection(r)), n += "", s && (n += "&shareto=", n += t.__escapehtml.escaping(t.__escapehtml.detection(s)), n += ""), n += '" class="gyl-btn-support">         <span>我要支持</span>     </a>     ') : (n += '     <a href="/project/back/', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" class="gyl-btn-support">         <span>我要支持</span>     </a>     '), n += "      </footer>  "
            } catch (l) {
                t.__throw("Juicer Render Exception: " + l.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["header.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.project_uuid, r = e.manager, s = e.verify_state;
                e.header, e.bar, e.green, e.fixed, e.detail, e.index, e.a, e.item, e.left, e.i, e.arrow, e.span, e.right, e.red, e.project, e.manage, e.report, e.uuid, e.btn, e.h1, e.title, e.logo_white, e.m, e.img, e.v5, e.qsc;
                n += '<header class="qsc-bar bar-green bar-fixed project-detail-bar" style="z-index: 100;">     <a href="/" class="bar-item pull-left">         <i class="icon bar-arrow-left"></i>         <span>首页</span>     </a>     ', r ? (n += '          <a href="javascript:void(0);" class="bar-item pull-right header_project_manage">项目管理             ', s != -1 && 2 != s && 3 != s || (n += '             <span class="badge-red"></span>             '), n += "         </a>     ") : (n += '         <a href="/project/manage/report.html?uuid=', n += t.__escapehtml.escaping(t.__escapehtml.detection(o)), n += '" class="bar-item pull-right report" id="qsc-btn-report">举报</a>     '), n += '          <h1 class="bar-title qsc-logo_white">         <a href="http://m.qschou.com/">             <img src="http://static.qschou.com/img/v5/qsc-logo_white.png" width="80" alt="轻松筹">         </a>     </h1> </header>'
            } catch (l) {
                t.__throw("Juicer Render Exception: " + l.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["huibao.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.auth, r = (e.verify, e.data);
                e.huibao, e.icon, e.amount, e.index, e.div, e.project, e.card, e.card_content__list, e.yongtu, e.thumb, e.md, e.span, e.title, e.desc, e.start, e.detail_title, e.p, e.i, e.sm, e.end, e.list, e.group, e.item, e.strong, e.em;
                n += "", r.purpose && (n += ' <div class="mod-project-card mod-project-card_content__list">    <div class="project-yongtu list-thumb-md">      <span class="yongtu-title">资金用途：</span>      <span class="yongtu-desc">', n += t.__escapehtml.escaping(t.__escapehtml.detection(r.purpose)), n += "</span>    </div> </div> "), n += "  ", 1 == o.verify_state && o.verify_item && (n += ' <!-- start [已提交资料] --> <div class="mod-project-verify">     <div class="project-detail_title">资料证明     </div>        ', ~function () {
                    for (var e in o.verify_item)if (o.verify_item.hasOwnProperty(e)) {
                        var i = o.verify_item[e];
                        n += '     <div class="item">         ', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.title)), n += "         <p>             ", ~function () {
                            for (var e in i.icons)if (i.icons.hasOwnProperty(e)) {
                                var a = i.icons[e];
                                n += '             <i class="icon-verify-sm"></i><span>', n += t.__escapehtml.escaping(t.__escapehtml.detection(a)), n += "</span>             "
                            }
                        }(), n += "         </p>     </div>     "
                    }
                }(), n += " </div> <!-- end [已提交资料] --> "), n += "  ", r.data.length > 0 && (n += ' <div class="mod-project-card mod-project-card_content__list">  <div class="project-detail_title list-thumb-md">', n += 1 == r.is_before ? "帮Ta实现" : "回馈内容", n += '</div>    <div class="qsc-list-group noicon">      ', ~function () {
                    for (var e in r.data)if (r.data.hasOwnProperty(e)) {
                        var i = r.data[e];
                        n += '      <div class="list-item list-thumb list-thumb-md">          <strong>           <em>             ', ~function () {
                            for (var e in i.amount)if (i.amount.hasOwnProperty(e)) {
                                var a = i.amount[e], o = e;
                                n += "               ", 0 == o && (n += "              ", n += t.__escapehtml.escaping(t.__escapehtml.detection(a)), n += "              "), n += "               ", 1 == o && (n += "              ~", n += t.__escapehtml.escaping(t.__escapehtml.detection(a)), n += "              "), n += "             "
                            }
                        }(), n += "           </em>          元</strong>          <p>", n += t.__escapehtml.escaping(t.__escapehtml.detection(i.support_content)), n += "</p>             </div>      "
                    }
                }(), n += "  </div>   </div> "), n += " "
            } catch (s) {
                t.__throw("Juicer Render Exception: " + s.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["manage.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.project;
                e.start, e.div, e.manage, e.modal, e.share, e.admin, e.hidden, e.dialog, e.content, e.header, e.center, e.body, e.row, e.a, e.order, e.i, e.support, e.page, e.aid, e.list, e.help, e.publish, e.edit, e.dream, e.uuid, e.updateDynamic, e.update, e.dreamMoney, e.modify, e.amount, e.cutShort, e.end, e.review, e.type, e.verify, e.span, e.red, e.close, e.footer, e.lg, e.block, e.dismiss, e.p, e.button, e.danger;
                n += '<!-- start [项目管理] --> <div class="project-manage-modal">     <div class="qsc-modal modal-share project-manage-modal in" id="project-admin" tabindex="-1" aria-hidden="false">         <div class="modal-dialog bottom">             <div class="modal-content clearfix">                 <div class="modal-header text-center">项目管理</div>                 <div class="modal-body">                     <div class="share-row clearfix">                         ', o.support_number > 0 && o.active == -1 ? (n += '                             <a href="/project/manage/order?', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" class="item"><i class="icon icon-support"></i>支持记录</a>                             <a href="/page/aid/list/3356" class="item"><i class="icon icon-help"></i>使用帮助</a>                         ') : (n += '                             <a href="/project/manage/order?', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" class="item"><i class="icon icon-support"></i>支持记录</a>                             ', 8192 == o.state && (n += '                             <a id="anchor_edit" href="/project/publish/edit/dream.html?uuid=', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" class="item"><i class="icon icon-edit"></i>编辑项目</a>                             '), n += '                             <a href="/project/manage/updateDynamic.html?uuid=', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" class="item"><i class="icon icon-update"></i>更新动态</a>                              ', o.support_number > 0 && (n += "                                  ", 8192 == o.state && (n += '                                     <a href="/project/publish/edit/dreamMoney.html?uuid=', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" class="item"><i class="icon icon-modify-amount"></i>修改金额</a>                                  '), n += "                             "), n += "                              ", 8192 == o.state && (n += '                             <a href="/project/manage/cutShort.html?uuid=', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" class="item"><i class="icon icon-end"></i>提前结束</a>                             '), n += '                              <a href="/review/type/dream/', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" class="item">                                 <i class="icon icon-verify">                                     ', o.verify_state != -1 && 2 != o.verify_state && 3 != o.verify_state || (n += '                                     <span class="badge-red"></span>                                     '), n += '                                 </i>                             项目验证</a>                                                       <a class="item" id="btn-project-close"><i class="icon icon-delete"></i>删除项目</a>                             <a href="/page/aid/list/3356" class="item"><i class="icon icon-help"></i>使用帮助</a>                         '), n += '                     </div>                     <div class="modal-footer">                         <a href="javascript:void(0);" class="btn btn-default btn-lg btn-block" data-dismiss="modal">取消</a>                     </div>                 </div>             </div>         </div>     </div> </div> <!-- end [项目管理] -->  <!-- start [项目删除] --> <div class="qsc-modal modal-share" id="project-close" tabindex="-1" aria-hidden="true">     <div class="modal-dialog bottom">         <div class="modal-content clearfix">             <div class="modal-header text-center">                 项目删除确认                 <p class="text-center">项目删除后将无法恢复,已筹金额会全部退还支持者,您确定要删除吗?</p >             </div>             <div class="modal-body">                 <button class="btn btn-default btn-lg btn-block text-danger" data-uuid="">确定删除</button>             </div>             <div class="modal-footer">                 <a href=" " class="btn btn-default btn-lg btn-block" data-dismiss="modal">取消</a >             </div>         </div>     </div> </div> <!-- delete [项目删除] -->'
            } catch (r) {
                t.__throw("Juicer Render Exception: " + r.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["share.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                e.start, e.div, e.modal, e.share, e.min, e.hidden, e.dialog, e.content, e.header, e.center, e.body, e.row, e.a, e.qrcode, e.i, e.weibo, e.id, e.qzone, e.qqzone, e.QQ, e.qqweibo, e.qq, e.footer, e.lg, e.block, e.dismiss, e.end;
                n += '<!-- start [分享button] --> <div class="qsc-modal modal-share share-min in" id="project-share" tabindex="-1" aria-hidden="false">     <div class="modal-dialog bottom">         <div class="modal-content clearfix">             <div class="modal-header text-center">                 分享给好友             </div>             <div class="modal-body">                 <div class="share-row clearfix">                     <a href="javascript:void(0);" id="qrcode" class="item h5-share-qrcode"><i class="icon icon-qrcode"></i>二维码</a>                     <a href="javascript:void(0);" class="item h5-share-weibo" data-id="0"><i class="icon icon-weibo"></i>新浪微博</a>                     <a href="javascript:void(0);" class="item h5-share-qzone" data-id="4"><i class="icon icon-qqzone"></i>QQ空间</a>                     <a href="javascript:void(0);" class="item h5-share-qqweibo" data-id="6"><i class="icon icon-qqweibo"></i>腾讯微博</a>                     <a href="javascript:void(0);" class="item h5-share-qq" data-id="5"><i class="icon icon-qq"></i>QQ好友</a>                 </div>             </div>             <div class="modal-footer">                 <a href="javascript:void(0);" class="btn btn-default btn-lg btn-block" data-dismiss="modal">取消</a>             </div>         </div>     </div> </div> <!-- end [分享button] -->'
            } catch (o) {
                t.__throw("Juicer Render Exception: " + o.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["singleCmtMC.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.reciver, r = e.sender, s = e.comment_id, l = e.content, c = e.refer;
                e.a, e.uuid, e.name, e.commentid, e.strong;
                n += '<a class="feed_comment"              data-reciver="', n += t.__escapehtml.escaping(t.__escapehtml.detection(o.uuid)), n += '" data-uuid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(r.uuid)), n += '"                       data-name="', n += t.__escapehtml.escaping(t.__escapehtml.detection(r.nickname)), n += '" data-commentid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(s)), n += '" style="cursor: pointer;">     <strong>', n += t.__escapehtml.escaping(t.__escapehtml.detection(r.nickname)), n += "</strong>", 1 == c && (n += "回复<strong>", n += t.__escapehtml.escaping(t.__escapehtml.detection(o.nickname)), n += "</strong>"), n += " : ", n += t.__escapehtml.escaping(t.__escapehtml.detection(l)), n += " </a>"
            } catch (d) {
                t.__throw("Juicer Render Exception: " + d.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["support.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                e.div, e.project, e.card, e.supporter, e.support, e.list, e.nodata, e.align, e.i, e.cat, e.p, e.a, e.remote;
                n += '     <div class="mod-project-card mod-project-supporter">          <div class="mod-project-support-list">          <div class="list-nodata" style="text-align: center">              <i class="icon-nodata-cat"></i>              <p>暂无支持</p>          </div>             <div class="loading" style="display: none">                 <a href="javascript:;" data-remote="true"><i></i> 正在加载</a>             </div>         </div>     </div>   '
            } catch (o) {
                t.__throw("Juicer Render Exception: " + o.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["support_san.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.title, r = e.comments, s = e.id, l = e.user, c = (e.titleValue, e.created), d = (e.comment, e.myself);
                e.i, e.div, e.project, e.support_item, e.orderid, e.support_item__user, e.img, e.load, e.v5, e.grey, e.original, e.support_item__detail, e.support_item__detail__user, e.small, e.support_item__detail__time, e.a, e.support_item__detail_comment, e.support_item__detail__comment, e.triangle, e.reciver, e.uuid, e.name, e.commentid, e.strong, e.more, e.align;
                n += '<div class="mod-project-support_item ', d && (n += " myself "), n += ' clearfix"  data-orderid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(s)), n += '">     <div class="mod-project-support_item__user">         <img class="lazy-load" src="http://static.qschou.com/img/v5/grey.png" data-original="', n += t.__escapehtml.escaping(t.__escapehtml.detection(l.avatar)), n += '" width="100%" alt="" />     </div>     <div class="mod-project-support_item__detail">         <div class="project-support_item__detail__user">             ', n += t.__escapehtml.escaping(t.__escapehtml.detection(l.nickname)), n += "             ", ~function () {
                    for (var e in o)if (o.hasOwnProperty(e)) {
                        var i = o[e];
                        n += '                 <small style="color:', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.color)), n += '">', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.text)), n += "</small>             "
                    }
                }(), n += '         </div>         <div class="project-support_item__detail__time">             ', n += t.__escapehtml.escaping(t.__escapehtml.detection(c)), n += '             <a class="project-support_item__detail_comment" href="javascript:void(0)">                 <i class="icon-comment" data-orderid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(s)), n += '" style="cursor: pointer;"></i>             </a>         </div>         <div class="mod-project-support_item__detail__comment" style="', 0 == r.length && (n += " display: none "), n += '" >             <i class="icon-triangle"></i>             ', ~function () {
                    for (var e in r)if (r.hasOwnProperty(e)) {
                        var i = r[e], a = e;
                        n += '                 <a class="feed_comment ', a > 9 && (n += "hidden"), n += '"                          data-reciver="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.reciver.uuid)), n += '" data-uuid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.sender.uuid)), n += '"                                   data-name="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.sender.nickname)), n += '" data-commentid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.comment_id)), n += '" style="cursor: pointer;">                      <strong>', n += t.__escapehtml.escaping(t.__escapehtml.detection(i.sender.nickname)), n += "</strong>", 1 == i.refer && (n += "回复<strong>", n += t.__escapehtml.escaping(t.__escapehtml.detection(i.reciver.nickname)), n += "</strong>"), n += " : ", n += t.__escapehtml.escaping(t.__escapehtml.detection(i.content)), n += "                  </a>             "
                    }
                }(), n += "             ", r.length > 9 && (n += '                 <a  class="btn-comment-more" href="javascript:void(0)" data-orderid="', n += t.__escapehtml.escaping(t.__escapehtml.detection(s)), n += '" style="text-align: center">                     <strong>查看更多评论</strong>                 </a>             '), n += "         </div>     </div> </div>"
            } catch (p) {
                t.__throw("Juicer Render Exception: " + p.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["tabMC.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                var o = e.feed_count, r = e.supporter_count;
                e.div, e.project, e.card, e.tab, e.control, e.line, e.ul, e.item, e.li, e.a, e.timeline, e.span, e.supporter, e.TA, e.content, e.pane, e.remote, e.i, e.nodata, e.align, e.cat, e.p;
                n += '<div class="mod-project-card mod-project-tab-control">     <div class="qsc-tab tab-line">         <ul class="tab-item">             <li>                 <a href="#project-timeline" >筹款动态 <span class="badge">', n += t.__escapehtml.escaping(t.__escapehtml.detection(o)), n += '</span></a>             </li>                           <li class="active">                 <a href="#project-supporter">TA的支持<span class="badge">', n += t.__escapehtml.escaping(t.__escapehtml.detection(r)), n += '</span></a>             </li>         </ul>     </div>      <div class="tab-content">         <div class="tab-pane " id="project-timeline">             <div id="feedReplaceDiv">                 <div class="loading" style="display: none">                     <a href="javascript:;" data-remote="true"><i></i> 正在加载</a>                 </div>                 <div class="supporter-nodata" style="text-align: center">                     <i class="icon-nodata-cat"></i>                     <p>暂无动态</p>                 </div>             </div>         </div>                <div class="tab-pane active" id="project-supporter">             <div id="supportReplaceDiv"></div>         </div>     </div> </div>'
            } catch (s) {
                t.__throw("Juicer Render Exception: " + s.message)
            }
            return n += ""
        }
    }(), function () {
        var e = (juicer.template, juicer.templates = juicer.templates || {});
        e["video_spr.juicer"] = function (e, t) {
            var i = {
                escapehash: {"<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "/": "&#x2f;"},
                escapereplace: function (e) {
                    return i.escapehash[e]
                },
                escaping: function (e) {
                    return "string" != typeof e ? e : e.replace(/[&<>"]/gim, this.escapereplace)
                },
                detection: function (e) {
                    return "undefined" == typeof e ? "" : e
                }
            }, a = function (e) {
                if ("undefined" != typeof console) {
                    if (console.warn)return void console.warn(e);
                    if (console.log)return void console.log(e)
                }
                throw e
            };
            t = t || juicer.options._method, t.__escapehtml = i, t.__throw = a;
            var e = e || {}, n = "";
            n += "";
            try {
                n += "";
                e.video, e.mp4;
                n += '<video width="320" height="240" id="me_player" src="" type="video/mp4" controls="controls"></video>'
            } catch (o) {
                t.__throw("Juicer Render Exception: " + o.message)
            }
            return n += ""
        }
    }(), define("dreamTpl", [], function () {
    }), "undefined" == typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");
+function (e) {
    var t = e.fn.jquery.split(" ")[0].split(".");
    if (t[0] < 2 && t[1] < 9 || 1 == t[0] && 9 == t[1] && t[2] < 1)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher")
}(jQuery), +function (e) {
    "use strict";
    function t() {
        var e = document.createElement("bootstrap"), t = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var i in t)if (void 0 !== e.style[i])return {end: t[i]};
        return !1
    }

    e.fn.emulateTransitionEnd = function (t) {
        var i = !1, a = this;
        e(this).one("bsTransitionEnd", function () {
            i = !0
        });
        var n = function () {
            i || e(a).trigger(e.support.transition.end)
        };
        return setTimeout(n, t), this
    }, e(function () {
        e.support.transition = t(), e.support.transition && (e.event.special.bsTransitionEnd = {
            bindType: e.support.transition.end,
            delegateType: e.support.transition.end,
            handle: function (t) {
                return e(t.target).is(this) ? t.handleObj.handler.apply(this, arguments) : void 0
            }
        })
    })
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        return this.each(function () {
            var i = e(this), n = i.data("bs.alert");
            n || i.data("bs.alert", n = new a(this)), "string" == typeof t && n[t].call(i)
        })
    }

    var i = '[data-dismiss="alert"]', a = function (t) {
        e(t).on("click", i, this.close)
    };
    a.VERSION = "3.3.1", a.TRANSITION_DURATION = 150, a.prototype.close = function (t) {
        function i() {
            r.detach().trigger("closed.bs.alert").remove()
        }

        var n = e(this), o = n.attr("data-target");
        o || (o = n.attr("href"), o = o && o.replace(/.*(?=#[^\s]*$)/, ""));
        var r = e(o);
        t && t.preventDefault(), r.length || (r = n.closest(".alert")), r.trigger(t = e.Event("close.bs.alert")), t.isDefaultPrevented() || (r.removeClass("in"), e.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", i).emulateTransitionEnd(a.TRANSITION_DURATION) : i())
    };
    var n = e.fn.alert;
    e.fn.alert = t, e.fn.alert.Constructor = a, e.fn.alert.noConflict = function () {
        return e.fn.alert = n, this
    }, e(document).on("click.bs.alert.data-api", i, a.prototype.close)
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        return this.each(function () {
            var a = e(this), n = a.data("bs.button"), o = "object" == typeof t && t;
            n || a.data("bs.button", n = new i(this, o)), "toggle" == t ? n.toggle() : t && n.setState(t)
        })
    }

    var i = function (t, a) {
        this.$element = e(t), this.options = e.extend({}, i.DEFAULTS, a), this.isLoading = !1
    };
    i.VERSION = "3.3.1", i.DEFAULTS = {loadingText: "loading..."}, i.prototype.setState = function (t) {
        var i = "disabled", a = this.$element, n = a.is("input") ? "val" : "html", o = a.data();
        t += "Text", null == o.resetText && a.data("resetText", a[n]()), setTimeout(e.proxy(function () {
            a[n](null == o[t] ? this.options[t] : o[t]), "loadingText" == t ? (this.isLoading = !0, a.addClass(i).attr(i, i)) : this.isLoading && (this.isLoading = !1, a.removeClass(i).removeAttr(i))
        }, this), 0)
    }, i.prototype.toggle = function () {
        var e = !0, t = this.$element.closest('[data-toggle="buttons"]');
        if (t.length) {
            var i = this.$element.find("input");
            "radio" == i.prop("type") && (i.prop("checked") && this.$element.hasClass("active") ? e = !1 : t.find(".active").removeClass("active")), e && i.prop("checked", !this.$element.hasClass("active")).trigger("change")
        } else this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
        e && this.$element.toggleClass("active")
    };
    var a = e.fn.button;
    e.fn.button = t, e.fn.button.Constructor = i, e.fn.button.noConflict = function () {
        return e.fn.button = a, this
    }, e(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (i) {
        var a = e(i.target);
        a.hasClass("btn") || (a = a.closest(".btn")), t.call(a, "toggle"), i.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (t) {
        e(t.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(t.type))
    })
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        return this.each(function () {
            var a = e(this), n = a.data("bs.carousel"), o = e.extend({}, i.DEFAULTS, a.data(), "object" == typeof t && t), r = "string" == typeof t ? t : o.slide;
            n || a.data("bs.carousel", n = new i(this, o)), "number" == typeof t ? n.to(t) : r ? n[r]() : o.interval && n.pause().cycle()
        })
    }

    var i = function (t, i) {
        this.$element = e(t), this.$indicators = this.$element.find(".carousel-indicators"), this.options = i, this.paused = this.sliding = this.interval = this.$active = this.$items = null, this.options.keyboard && this.$element.on("keydown.bs.carousel", e.proxy(this.keydown, this)), "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", e.proxy(this.pause, this)).on("mouseleave.bs.carousel", e.proxy(this.cycle, this))
    };
    i.VERSION = "3.3.1", i.TRANSITION_DURATION = 600, i.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: !0,
        keyboard: !0
    }, i.prototype.keydown = function (e) {
        if (!/input|textarea/i.test(e.target.tagName)) {
            switch (e.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            e.preventDefault()
        }
    }, i.prototype.cycle = function (t) {
        return t || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(e.proxy(this.next, this), this.options.interval)), this
    }, i.prototype.getItemIndex = function (e) {
        return this.$items = e.parent().children(".item"), this.$items.index(e || this.$active)
    }, i.prototype.getItemForDirection = function (e, t) {
        var i = "prev" == e ? -1 : 1, a = this.getItemIndex(t), n = (a + i) % this.$items.length;
        return this.$items.eq(n)
    }, i.prototype.to = function (e) {
        var t = this, i = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        return e > this.$items.length - 1 || 0 > e ? void 0 : this.sliding ? this.$element.one("slid.bs.carousel", function () {
            t.to(e)
        }) : i == e ? this.pause().cycle() : this.slide(e > i ? "next" : "prev", this.$items.eq(e))
    }, i.prototype.pause = function (t) {
        return t || (this.paused = !0), this.$element.find(".next, .prev").length && e.support.transition && (this.$element.trigger(e.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    }, i.prototype.next = function () {
        return this.sliding ? void 0 : this.slide("next")
    }, i.prototype.prev = function () {
        return this.sliding ? void 0 : this.slide("prev")
    }, i.prototype.slide = function (t, a) {
        var n = this.$element.find(".item.active"), o = a || this.getItemForDirection(t, n), r = this.interval, s = "next" == t ? "left" : "right", l = "next" == t ? "first" : "last", c = this;
        if (!o.length) {
            if (!this.options.wrap)return;
            o = this.$element.find(".item")[l]()
        }
        if (o.hasClass("active"))return this.sliding = !1;
        var d = o[0], p = e.Event("slide.bs.carousel", {relatedTarget: d, direction: s});
        if (this.$element.trigger(p), !p.isDefaultPrevented()) {
            if (this.sliding = !0, r && this.pause(), this.$indicators.length) {
                this.$indicators.find(".active").removeClass("active");
                var u = e(this.$indicators.children()[this.getItemIndex(o)]);
                u && u.addClass("active")
            }
            var m = e.Event("slid.bs.carousel", {relatedTarget: d, direction: s});
            return e.support.transition && this.$element.hasClass("slide") ? (o.addClass(t), o[0].offsetWidth, n.addClass(s), o.addClass(s), n.one("bsTransitionEnd", function () {
                o.removeClass([t, s].join(" ")).addClass("active"), n.removeClass(["active", s].join(" ")), c.sliding = !1, setTimeout(function () {
                    c.$element.trigger(m)
                }, 0)
            }).emulateTransitionEnd(i.TRANSITION_DURATION)) : (n.removeClass("active"), o.addClass("active"), this.sliding = !1, this.$element.trigger(m)), r && this.cycle(), this
        }
    };
    var a = e.fn.carousel;
    e.fn.carousel = t, e.fn.carousel.Constructor = i, e.fn.carousel.noConflict = function () {
        return e.fn.carousel = a, this
    };
    var n = function (i) {
        var a, n = e(this), o = e(n.attr("data-target") || (a = n.attr("href")) && a.replace(/.*(?=#[^\s]+$)/, ""));
        if (o.hasClass("carousel")) {
            var r = e.extend({}, o.data(), n.data()), s = n.attr("data-slide-to");
            s && (r.interval = !1), t.call(o, r), s && o.data("bs.carousel").to(s), i.preventDefault()
        }
    };
    e(document).on("click.bs.carousel.data-api", "[data-slide]", n).on("click.bs.carousel.data-api", "[data-slide-to]", n), e(window).on("load", function () {
        e('[data-ride="carousel"]').each(function () {
            var i = e(this);
            t.call(i, i.data())
        })
    })
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        var i, a = t.attr("data-target") || (i = t.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "");
        return e(a)
    }

    function i(t) {
        return this.each(function () {
            var i = e(this), n = i.data("bs.collapse"), o = e.extend({}, a.DEFAULTS, i.data(), "object" == typeof t && t);
            !n && o.toggle && "show" == t && (o.toggle = !1), n || i.data("bs.collapse", n = new a(this, o)), "string" == typeof t && n[t]()
        })
    }

    var a = function (t, i) {
        this.$element = e(t), this.options = e.extend({}, a.DEFAULTS, i), this.$trigger = e(this.options.trigger).filter('[href="#' + t.id + '"], [data-target="#' + t.id + '"]'), this.transitioning = null, this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger), this.options.toggle && this.toggle()
    };
    a.VERSION = "3.3.1", a.TRANSITION_DURATION = 350, a.DEFAULTS = {
        toggle: !0,
        trigger: '[data-toggle="collapse"]'
    }, a.prototype.dimension = function () {
        var e = this.$element.hasClass("width");
        return e ? "width" : "height"
    }, a.prototype.show = function () {
        if (!this.transitioning && !this.$element.hasClass("in")) {
            var t, n = this.$parent && this.$parent.find("> .panel").children(".in, .collapsing");
            if (!(n && n.length && (t = n.data("bs.collapse"), t && t.transitioning))) {
                var o = e.Event("show.bs.collapse");
                if (this.$element.trigger(o), !o.isDefaultPrevented()) {
                    n && n.length && (i.call(n, "hide"), t || n.data("bs.collapse", null));
                    var r = this.dimension();
                    this.$element.removeClass("collapse").addClass("collapsing")[r](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1;
                    var s = function () {
                        this.$element.removeClass("collapsing").addClass("collapse in")[r](""), this.transitioning = 0, this.$element.trigger("shown.bs.collapse")
                    };
                    if (!e.support.transition)return s.call(this);
                    var l = e.camelCase(["scroll", r].join("-"));
                    this.$element.one("bsTransitionEnd", e.proxy(s, this)).emulateTransitionEnd(a.TRANSITION_DURATION)[r](this.$element[0][l])
                }
            }
        }
    }, a.prototype.hide = function () {
        if (!this.transitioning && this.$element.hasClass("in")) {
            var t = e.Event("hide.bs.collapse");
            if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                var i = this.dimension();
                this.$element[i](this.$element[i]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1;
                var n = function () {
                    this.transitioning = 0, this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                };
                return e.support.transition ? void this.$element[i](0).one("bsTransitionEnd", e.proxy(n, this)).emulateTransitionEnd(a.TRANSITION_DURATION) : n.call(this)
            }
        }
    }, a.prototype.toggle = function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    }, a.prototype.getParent = function () {
        return e(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(e.proxy(function (i, a) {
            var n = e(a);
            this.addAriaAndCollapsedClass(t(n), n)
        }, this)).end()
    }, a.prototype.addAriaAndCollapsedClass = function (e, t) {
        var i = e.hasClass("in");
        e.attr("aria-expanded", i), t.toggleClass("collapsed", !i).attr("aria-expanded", i)
    };
    var n = e.fn.collapse;
    e.fn.collapse = i, e.fn.collapse.Constructor = a, e.fn.collapse.noConflict = function () {
        return e.fn.collapse = n, this
    }, e(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (a) {
        var n = e(this);
        n.attr("data-target") || a.preventDefault();
        var o = t(n), r = o.data("bs.collapse"), s = r ? "toggle" : e.extend({}, n.data(), {trigger: this});
        i.call(o, s)
    })
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        t && 3 === t.which || (e(n).remove(), e(o).each(function () {
            var a = e(this), n = i(a), o = {relatedTarget: this};
            n.hasClass("open") && (n.trigger(t = e.Event("hide.bs.dropdown", o)), t.isDefaultPrevented() || (a.attr("aria-expanded", "false"), n.removeClass("open").trigger("hidden.bs.dropdown", o)))
        }))
    }

    function i(t) {
        var i = t.attr("data-target");
        i || (i = t.attr("href"), i = i && /#[A-Za-z]/.test(i) && i.replace(/.*(?=#[^\s]*$)/, ""));
        var a = i && e(i);
        return a && a.length ? a : t.parent()
    }

    function a(t) {
        return this.each(function () {
            var i = e(this), a = i.data("bs.dropdown");
            a || i.data("bs.dropdown", a = new r(this)), "string" == typeof t && a[t].call(i)
        })
    }

    var n = ".dropdown-backdrop", o = '[data-toggle="dropdown"]', r = function (t) {
        e(t).on("click.bs.dropdown", this.toggle)
    };
    r.VERSION = "3.3.1", r.prototype.toggle = function (a) {
        var n = e(this);
        if (!n.is(".disabled, :disabled")) {
            var o = i(n), r = o.hasClass("open");
            if (t(), !r) {
                "ontouchstart" in document.documentElement && !o.closest(".navbar-nav").length && e('<div class="dropdown-backdrop"/>').insertAfter(e(this)).on("click", t);
                var s = {relatedTarget: this};
                if (o.trigger(a = e.Event("show.bs.dropdown", s)), a.isDefaultPrevented())return;
                n.trigger("focus").attr("aria-expanded", "true"), o.toggleClass("open").trigger("shown.bs.dropdown", s)
            }
            return !1
        }
    }, r.prototype.keydown = function (t) {
        if (/(38|40|27|32)/.test(t.which) && !/input|textarea/i.test(t.target.tagName)) {
            var a = e(this);
            if (t.preventDefault(), t.stopPropagation(), !a.is(".disabled, :disabled")) {
                var n = i(a), r = n.hasClass("open");
                if (!r && 27 != t.which || r && 27 == t.which)return 27 == t.which && n.find(o).trigger("focus"), a.trigger("click");
                var s = " li:not(.divider):visible a", l = n.find('[role="menu"]' + s + ', [role="listbox"]' + s);
                if (l.length) {
                    var c = l.index(t.target);
                    38 == t.which && c > 0 && c--, 40 == t.which && c < l.length - 1 && c++, ~c || (c = 0), l.eq(c).trigger("focus")
                }
            }
        }
    };
    var s = e.fn.dropdown;
    e.fn.dropdown = a, e.fn.dropdown.Constructor = r, e.fn.dropdown.noConflict = function () {
        return e.fn.dropdown = s, this
    }, e(document).on("click.bs.dropdown.data-api", t).on("click.bs.dropdown.data-api", ".dropdown form", function (e) {
        e.stopPropagation()
    }).on("click.bs.dropdown.data-api", o, r.prototype.toggle).on("keydown.bs.dropdown.data-api", o, r.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="menu"]', r.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="listbox"]', r.prototype.keydown)
}(jQuery), +function (e) {
    "use strict";
    function t(t, a) {
        return this.each(function () {
            var n = e(this), o = n.data("bs.modal"), r = e.extend({}, i.DEFAULTS, n.data(), "object" == typeof t && t);
            o || n.data("bs.modal", o = new i(this, r)), "string" == typeof t ? o[t](a) : r.show && o.show(a)
        })
    }

    var i = function (t, i) {
        this.options = i, this.$body = e(document.body), this.$element = e(t), this.$backdrop = this.isShown = null, this.scrollbarWidth = 0, this.options.remote && this.$element.find(".modal-content").load(this.options.remote, e.proxy(function () {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    };
    i.VERSION = "3.3.1", i.TRANSITION_DURATION = 300, i.BACKDROP_TRANSITION_DURATION = 150, i.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    }, i.prototype.toggle = function (e) {
        return this.isShown ? this.hide() : this.show(e)
    }, i.prototype.show = function (t) {
        var a = this, n = e.Event("show.bs.modal", {relatedTarget: t});
        this.$element.trigger(n), this.isShown || n.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', e.proxy(this.hide, this)), this.backdrop(function () {
            var n = e.support.transition && a.$element.hasClass("fade");
            a.$element.parent().length || a.$element.appendTo(a.$body), a.$element.show().scrollTop(0), a.options.backdrop && a.adjustBackdrop(), a.adjustDialog(), n && a.$element[0].offsetWidth, a.$element.addClass("in").attr("aria-hidden", !1), a.enforceFocus();
            var o = e.Event("shown.bs.modal", {relatedTarget: t});
            n ? a.$element.find(".modal-dialog").one("bsTransitionEnd", function () {
                a.$element.trigger("focus").trigger(o)
            }).emulateTransitionEnd(i.TRANSITION_DURATION) : a.$element.trigger("focus").trigger(o)
        }))
    }, i.prototype.hide = function (t) {
        t && t.preventDefault(), t = e.Event("hide.bs.modal"), this.$element.trigger(t), this.isShown && !t.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), e(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), e.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", e.proxy(this.hideModal, this)).emulateTransitionEnd(i.TRANSITION_DURATION) : this.hideModal())
    }, i.prototype.enforceFocus = function () {
        e(document).off("focusin.bs.modal").on("focusin.bs.modal", e.proxy(function (e) {
            this.$element[0] === e.target || this.$element.has(e.target).length || this.$element.trigger("focus")
        }, this))
    }, i.prototype.escape = function () {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", e.proxy(function (e) {
            27 == e.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    }, i.prototype.resize = function () {
        this.isShown ? e(window).on("resize.bs.modal", e.proxy(this.handleUpdate, this)) : e(window).off("resize.bs.modal")
    }, i.prototype.hideModal = function () {
        var e = this;
        this.$element.hide(), this.backdrop(function () {
            e.$body.removeClass("modal-open"), e.resetAdjustments(), e.resetScrollbar(), e.$element.trigger("hidden.bs.modal")
        })
    }, i.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove(), this.$backdrop = null
    }, i.prototype.backdrop = function (t) {
        var a = this, n = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var o = e.support.transition && n;
            if (this.$backdrop = e('<div class="modal-backdrop ' + n + '" />').prependTo(this.$element).on("click.dismiss.bs.modal", e.proxy(function (e) {
                    e.target === e.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
                }, this)), o && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !t)return;
            o ? this.$backdrop.one("bsTransitionEnd", t).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : t()
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var r = function () {
                a.removeBackdrop(), t && t()
            };
            e.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", r).emulateTransitionEnd(i.BACKDROP_TRANSITION_DURATION) : r()
        } else t && t()
    }, i.prototype.handleUpdate = function () {
        this.options.backdrop && this.adjustBackdrop(), this.adjustDialog()
    }, i.prototype.adjustBackdrop = function () {
        this.$backdrop.css("height", 0).css("height", this.$element[0].scrollHeight)
    }, i.prototype.adjustDialog = function () {
        var e = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && e ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !e ? this.scrollbarWidth : ""
        })
    }, i.prototype.resetAdjustments = function () {
        this.$element.css({paddingLeft: "", paddingRight: ""})
    }, i.prototype.checkScrollbar = function () {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight, this.scrollbarWidth = this.measureScrollbar()
    }, i.prototype.setScrollbar = function () {
        var e = parseInt(this.$body.css("padding-right") || 0, 10);
        this.bodyIsOverflowing && this.$body.css("padding-right", e + this.scrollbarWidth)
    }, i.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", "")
    }, i.prototype.measureScrollbar = function () {
        var e = document.createElement("div");
        e.className = "modal-scrollbar-measure", this.$body.append(e);
        var t = e.offsetWidth - e.clientWidth;
        return this.$body[0].removeChild(e), t
    };
    var a = e.fn.modal;
    e.fn.modal = t, e.fn.modal.Constructor = i, e.fn.modal.noConflict = function () {
        return e.fn.modal = a, this
    }, e(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (i) {
        var a = e(this), n = a.attr("href"), o = e(a.attr("data-target") || n && n.replace(/.*(?=#[^\s]+$)/, "")), r = o.data("bs.modal") ? "toggle" : e.extend({remote: !/#/.test(n) && n}, o.data(), a.data());
        a.is("a") && i.preventDefault(), o.one("show.bs.modal", function (e) {
            e.isDefaultPrevented() || o.one("hidden.bs.modal", function () {
                a.is(":visible") && a.trigger("focus")
            })
        }), t.call(o, r, this)
    })
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        return this.each(function () {
            var a = e(this), n = a.data("bs.tooltip"), o = "object" == typeof t && t, r = o && o.selector;
            (n || "destroy" != t) && (r ? (n || a.data("bs.tooltip", n = {}), n[r] || (n[r] = new i(this, o))) : n || a.data("bs.tooltip", n = new i(this, o)), "string" == typeof t && n[t]())
        })
    }

    var i = function (e, t) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null, this.init("tooltip", e, t)
    };
    i.VERSION = "3.3.1", i.TRANSITION_DURATION = 150, i.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: {selector: "body", padding: 0}
    }, i.prototype.init = function (t, i, a) {
        this.enabled = !0, this.type = t, this.$element = e(i), this.options = this.getOptions(a), this.$viewport = this.options.viewport && e(this.options.viewport.selector || this.options.viewport);
        for (var n = this.options.trigger.split(" "), o = n.length; o--;) {
            var r = n[o];
            if ("click" == r)this.$element.on("click." + this.type, this.options.selector, e.proxy(this.toggle, this)); else if ("manual" != r) {
                var s = "hover" == r ? "mouseenter" : "focusin", l = "hover" == r ? "mouseleave" : "focusout";
                this.$element.on(s + "." + this.type, this.options.selector, e.proxy(this.enter, this)), this.$element.on(l + "." + this.type, this.options.selector, e.proxy(this.leave, this))
            }
        }
        this.options.selector ? this._options = e.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    }, i.prototype.getDefaults = function () {
        return i.DEFAULTS
    }, i.prototype.getOptions = function (t) {
        return t = e.extend({}, this.getDefaults(), this.$element.data(), t), t.delay && "number" == typeof t.delay && (t.delay = {
            show: t.delay,
            hide: t.delay
        }), t
    }, i.prototype.getDelegateOptions = function () {
        var t = {}, i = this.getDefaults();
        return this._options && e.each(this._options, function (e, a) {
            i[e] != a && (t[e] = a)
        }), t
    }, i.prototype.enter = function (t) {
        var i = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
        return i && i.$tip && i.$tip.is(":visible") ? void(i.hoverState = "in") : (i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, i)), clearTimeout(i.timeout), i.hoverState = "in", i.options.delay && i.options.delay.show ? void(i.timeout = setTimeout(function () {
            "in" == i.hoverState && i.show()
        }, i.options.delay.show)) : i.show())
    }, i.prototype.leave = function (t) {
        var i = t instanceof this.constructor ? t : e(t.currentTarget).data("bs." + this.type);
        return i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, i)), clearTimeout(i.timeout), i.hoverState = "out", i.options.delay && i.options.delay.hide ? void(i.timeout = setTimeout(function () {
            "out" == i.hoverState && i.hide()
        }, i.options.delay.hide)) : i.hide()
    }, i.prototype.show = function () {
        var t = e.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(t);
            var a = e.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
            if (t.isDefaultPrevented() || !a)return;
            var n = this, o = this.tip(), r = this.getUID(this.type);
            this.setContent(), o.attr("id", r), this.$element.attr("aria-describedby", r), this.options.animation && o.addClass("fade");
            var s = "function" == typeof this.options.placement ? this.options.placement.call(this, o[0], this.$element[0]) : this.options.placement, l = /\s?auto?\s?/i, c = l.test(s);
            c && (s = s.replace(l, "") || "top"), o.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(s).data("bs." + this.type, this), this.options.container ? o.appendTo(this.options.container) : o.insertAfter(this.$element);
            var d = this.getPosition(), p = o[0].offsetWidth, u = o[0].offsetHeight;
            if (c) {
                var m = s, h = this.options.container ? e(this.options.container) : this.$element.parent(), f = this.getPosition(h);
                s = "bottom" == s && d.bottom + u > f.bottom ? "top" : "top" == s && d.top - u < f.top ? "bottom" : "right" == s && d.right + p > f.width ? "left" : "left" == s && d.left - p < f.left ? "right" : s, o.removeClass(m).addClass(s)
            }
            var g = this.getCalculatedOffset(s, d, p, u);
            this.applyPlacement(g, s);
            var v = function () {
                var e = n.hoverState;
                n.$element.trigger("shown.bs." + n.type), n.hoverState = null, "out" == e && n.leave(n)
            };
            e.support.transition && this.$tip.hasClass("fade") ? o.one("bsTransitionEnd", v).emulateTransitionEnd(i.TRANSITION_DURATION) : v()
        }
    }, i.prototype.applyPlacement = function (t, i) {
        var a = this.tip(), n = a[0].offsetWidth, o = a[0].offsetHeight, r = parseInt(a.css("margin-top"), 10), s = parseInt(a.css("margin-left"), 10);
        isNaN(r) && (r = 0), isNaN(s) && (s = 0), t.top = t.top + r, t.left = t.left + s, e.offset.setOffset(a[0], e.extend({
            using: function (e) {
                a.css({top: Math.round(e.top), left: Math.round(e.left)})
            }
        }, t), 0), a.addClass("in");
        var l = a[0].offsetWidth, c = a[0].offsetHeight;
        "top" == i && c != o && (t.top = t.top + o - c);
        var d = this.getViewportAdjustedDelta(i, t, l, c);
        d.left ? t.left += d.left : t.top += d.top;
        var p = /top|bottom/.test(i), u = p ? 2 * d.left - n + l : 2 * d.top - o + c, m = p ? "offsetWidth" : "offsetHeight";
        a.offset(t), this.replaceArrow(u, a[0][m], p)
    }, i.prototype.replaceArrow = function (e, t, i) {
        this.arrow().css(i ? "left" : "top", 50 * (1 - e / t) + "%").css(i ? "top" : "left", "")
    }, i.prototype.setContent = function () {
        var e = this.tip(), t = this.getTitle();
        e.find(".tooltip-inner")[this.options.html ? "html" : "text"](t), e.removeClass("fade in top bottom left right")
    }, i.prototype.hide = function (t) {
        function a() {
            "in" != n.hoverState && o.detach(), n.$element.removeAttr("aria-describedby").trigger("hidden.bs." + n.type), t && t()
        }

        var n = this, o = this.tip(), r = e.Event("hide.bs." + this.type);
        return this.$element.trigger(r), r.isDefaultPrevented() ? void 0 : (o.removeClass("in"), e.support.transition && this.$tip.hasClass("fade") ? o.one("bsTransitionEnd", a).emulateTransitionEnd(i.TRANSITION_DURATION) : a(),
            this.hoverState = null, this)
    }, i.prototype.fixTitle = function () {
        var e = this.$element;
        (e.attr("title") || "string" != typeof e.attr("data-original-title")) && e.attr("data-original-title", e.attr("title") || "").attr("title", "")
    }, i.prototype.hasContent = function () {
        return this.getTitle()
    }, i.prototype.getPosition = function (t) {
        t = t || this.$element;
        var i = t[0], a = "BODY" == i.tagName, n = i.getBoundingClientRect();
        null == n.width && (n = e.extend({}, n, {width: n.right - n.left, height: n.bottom - n.top}));
        var o = a ? {
            top: 0,
            left: 0
        } : t.offset(), r = {scroll: a ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop()}, s = a ? {
            width: e(window).width(),
            height: e(window).height()
        } : null;
        return e.extend({}, n, r, s, o)
    }, i.prototype.getCalculatedOffset = function (e, t, i, a) {
        return "bottom" == e ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - i / 2
        } : "top" == e ? {
            top: t.top - a,
            left: t.left + t.width / 2 - i / 2
        } : "left" == e ? {top: t.top + t.height / 2 - a / 2, left: t.left - i} : {
            top: t.top + t.height / 2 - a / 2,
            left: t.left + t.width
        }
    }, i.prototype.getViewportAdjustedDelta = function (e, t, i, a) {
        var n = {top: 0, left: 0};
        if (!this.$viewport)return n;
        var o = this.options.viewport && this.options.viewport.padding || 0, r = this.getPosition(this.$viewport);
        if (/right|left/.test(e)) {
            var s = t.top - o - r.scroll, l = t.top + o - r.scroll + a;
            s < r.top ? n.top = r.top - s : l > r.top + r.height && (n.top = r.top + r.height - l)
        } else {
            var c = t.left - o, d = t.left + o + i;
            c < r.left ? n.left = r.left - c : d > r.width && (n.left = r.left + r.width - d)
        }
        return n
    }, i.prototype.getTitle = function () {
        var e, t = this.$element, i = this.options;
        return e = t.attr("data-original-title") || ("function" == typeof i.title ? i.title.call(t[0]) : i.title)
    }, i.prototype.getUID = function (e) {
        do e += ~~(1e6 * Math.random()); while (document.getElementById(e));
        return e
    }, i.prototype.tip = function () {
        return this.$tip = this.$tip || e(this.options.template)
    }, i.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    }, i.prototype.enable = function () {
        this.enabled = !0
    }, i.prototype.disable = function () {
        this.enabled = !1
    }, i.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }, i.prototype.toggle = function (t) {
        var i = this;
        t && (i = e(t.currentTarget).data("bs." + this.type), i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), e(t.currentTarget).data("bs." + this.type, i))), i.tip().hasClass("in") ? i.leave(i) : i.enter(i)
    }, i.prototype.destroy = function () {
        var e = this;
        clearTimeout(this.timeout), this.hide(function () {
            e.$element.off("." + e.type).removeData("bs." + e.type)
        })
    };
    var a = e.fn.tooltip;
    e.fn.tooltip = t, e.fn.tooltip.Constructor = i, e.fn.tooltip.noConflict = function () {
        return e.fn.tooltip = a, this
    }
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        return this.each(function () {
            var a = e(this), n = a.data("bs.popover"), o = "object" == typeof t && t, r = o && o.selector;
            (n || "destroy" != t) && (r ? (n || a.data("bs.popover", n = {}), n[r] || (n[r] = new i(this, o))) : n || a.data("bs.popover", n = new i(this, o)), "string" == typeof t && n[t]())
        })
    }

    var i = function (e, t) {
        this.init("popover", e, t)
    };
    if (!e.fn.tooltip)throw new Error("Popover requires tooltip.js");
    i.VERSION = "3.3.1", i.DEFAULTS = e.extend({}, e.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    }), i.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype), i.prototype.constructor = i, i.prototype.getDefaults = function () {
        return i.DEFAULTS
    }, i.prototype.setContent = function () {
        var e = this.tip(), t = this.getTitle(), i = this.getContent();
        e.find(".popover-title")[this.options.html ? "html" : "text"](t), e.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof i ? "html" : "append" : "text"](i), e.removeClass("fade top bottom left right in"), e.find(".popover-title").html() || e.find(".popover-title").hide()
    }, i.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    }, i.prototype.getContent = function () {
        var e = this.$element, t = this.options;
        return e.attr("data-content") || ("function" == typeof t.content ? t.content.call(e[0]) : t.content)
    }, i.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    }, i.prototype.tip = function () {
        return this.$tip || (this.$tip = e(this.options.template)), this.$tip
    };
    var a = e.fn.popover;
    e.fn.popover = t, e.fn.popover.Constructor = i, e.fn.popover.noConflict = function () {
        return e.fn.popover = a, this
    }
}(jQuery), +function (e) {
    "use strict";
    function t(i, a) {
        var n = e.proxy(this.process, this);
        this.$body = e("body"), this.$scrollElement = e(e(i).is("body") ? window : i), this.options = e.extend({}, t.DEFAULTS, a), this.selector = (this.options.target || "") + " .nav li > a", this.offsets = [], this.targets = [], this.activeTarget = null, this.scrollHeight = 0, this.$scrollElement.on("scroll.bs.scrollspy", n), this.refresh(), this.process()
    }

    function i(i) {
        return this.each(function () {
            var a = e(this), n = a.data("bs.scrollspy"), o = "object" == typeof i && i;
            n || a.data("bs.scrollspy", n = new t(this, o)), "string" == typeof i && n[i]()
        })
    }

    t.VERSION = "3.3.1", t.DEFAULTS = {offset: 10}, t.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }, t.prototype.refresh = function () {
        var t = "offset", i = 0;
        e.isWindow(this.$scrollElement[0]) || (t = "position", i = this.$scrollElement.scrollTop()), this.offsets = [], this.targets = [], this.scrollHeight = this.getScrollHeight();
        var a = this;
        this.$body.find(this.selector).map(function () {
            var a = e(this), n = a.data("target") || a.attr("href"), o = /^#./.test(n) && e(n);
            return o && o.length && o.is(":visible") && [[o[t]().top + i, n]] || null
        }).sort(function (e, t) {
            return e[0] - t[0]
        }).each(function () {
            a.offsets.push(this[0]), a.targets.push(this[1])
        })
    }, t.prototype.process = function () {
        var e, t = this.$scrollElement.scrollTop() + this.options.offset, i = this.getScrollHeight(), a = this.options.offset + i - this.$scrollElement.height(), n = this.offsets, o = this.targets, r = this.activeTarget;
        if (this.scrollHeight != i && this.refresh(), t >= a)return r != (e = o[o.length - 1]) && this.activate(e);
        if (r && t < n[0])return this.activeTarget = null, this.clear();
        for (e = n.length; e--;)r != o[e] && t >= n[e] && (!n[e + 1] || t <= n[e + 1]) && this.activate(o[e])
    }, t.prototype.activate = function (t) {
        this.activeTarget = t, this.clear();
        var i = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]', a = e(i).parents("li").addClass("active");
        a.parent(".dropdown-menu").length && (a = a.closest("li.dropdown").addClass("active")), a.trigger("activate.bs.scrollspy")
    }, t.prototype.clear = function () {
        e(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var a = e.fn.scrollspy;
    e.fn.scrollspy = i, e.fn.scrollspy.Constructor = t, e.fn.scrollspy.noConflict = function () {
        return e.fn.scrollspy = a, this
    }, e(window).on("load.bs.scrollspy.data-api", function () {
        e('[data-spy="scroll"]').each(function () {
            var t = e(this);
            i.call(t, t.data())
        })
    })
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        return this.each(function () {
            var a = e(this), n = a.data("bs.tab");
            n || a.data("bs.tab", n = new i(this)), "string" == typeof t && n[t]()
        })
    }

    var i = function (t) {
        this.element = e(t)
    };
    i.VERSION = "3.3.1", i.TRANSITION_DURATION = 150, i.prototype.show = function () {
        var t = this.element, i = t.closest("ul:not(.dropdown-menu)"), a = t.data("target");
        if (a || (a = t.attr("href"), a = a && a.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li").hasClass("active")) {
            var n = i.find(".active:last a"), o = e.Event("hide.bs.tab", {relatedTarget: t[0]}), r = e.Event("show.bs.tab", {relatedTarget: n[0]});
            if (n.trigger(o), t.trigger(r), !r.isDefaultPrevented() && !o.isDefaultPrevented()) {
                var s = e(a);
                this.activate(t.closest("li"), i), this.activate(s, s.parent(), function () {
                    n.trigger({type: "hidden.bs.tab", relatedTarget: t[0]}), t.trigger({
                        type: "shown.bs.tab",
                        relatedTarget: n[0]
                    })
                })
            }
        }
    }, i.prototype.activate = function (t, a, n) {
        function o() {
            r.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1), t.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0), s ? (t[0].offsetWidth, t.addClass("in")) : t.removeClass("fade"), t.parent(".dropdown-menu") && t.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0), n && n()
        }

        var r = a.find("> .active"), s = n && e.support.transition && (r.length && r.hasClass("fade") || !!a.find("> .fade").length);
        r.length && s ? r.one("bsTransitionEnd", o).emulateTransitionEnd(i.TRANSITION_DURATION) : o(), r.removeClass("in")
    };
    var a = e.fn.tab;
    e.fn.tab = t, e.fn.tab.Constructor = i, e.fn.tab.noConflict = function () {
        return e.fn.tab = a, this
    };
    var n = function (i) {
        i.preventDefault(), t.call(e(this), "show")
    };
    e(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', n).on("click.bs.tab.data-api", '[data-toggle="pill"]', n)
}(jQuery), +function (e) {
    "use strict";
    function t(t) {
        return this.each(function () {
            var a = e(this), n = a.data("bs.affix"), o = "object" == typeof t && t;
            n || a.data("bs.affix", n = new i(this, o)), "string" == typeof t && n[t]()
        })
    }

    var i = function (t, a) {
        this.options = e.extend({}, i.DEFAULTS, a), this.$target = e(this.options.target).on("scroll.bs.affix.data-api", e.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", e.proxy(this.checkPositionWithEventLoop, this)), this.$element = e(t), this.affixed = this.unpin = this.pinnedOffset = null, this.checkPosition()
    };
    i.VERSION = "3.3.1", i.RESET = "affix affix-top affix-bottom", i.DEFAULTS = {
        offset: 0,
        target: window
    }, i.prototype.getState = function (e, t, i, a) {
        var n = this.$target.scrollTop(), o = this.$element.offset(), r = this.$target.height();
        if (null != i && "top" == this.affixed)return i > n && "top";
        if ("bottom" == this.affixed)return null != i ? !(n + this.unpin <= o.top) && "bottom" : !(e - a >= n + r) && "bottom";
        var s = null == this.affixed, l = s ? n : o.top, c = s ? r : t;
        return null != i && i >= l ? "top" : null != a && l + c >= e - a && "bottom"
    }, i.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset)return this.pinnedOffset;
        this.$element.removeClass(i.RESET).addClass("affix");
        var e = this.$target.scrollTop(), t = this.$element.offset();
        return this.pinnedOffset = t.top - e
    }, i.prototype.checkPositionWithEventLoop = function () {
        setTimeout(e.proxy(this.checkPosition, this), 1)
    }, i.prototype.checkPosition = function () {
        if (this.$element.is(":visible")) {
            var t = this.$element.height(), a = this.options.offset, n = a.top, o = a.bottom, r = e("body").height();
            "object" != typeof a && (o = n = a), "function" == typeof n && (n = a.top(this.$element)), "function" == typeof o && (o = a.bottom(this.$element));
            var s = this.getState(r, t, n, o);
            if (this.affixed != s) {
                null != this.unpin && this.$element.css("top", "");
                var l = "affix" + (s ? "-" + s : ""), c = e.Event(l + ".bs.affix");
                if (this.$element.trigger(c), c.isDefaultPrevented())return;
                this.affixed = s, this.unpin = "bottom" == s ? this.getPinnedOffset() : null, this.$element.removeClass(i.RESET).addClass(l).trigger(l.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == s && this.$element.offset({top: r - t - o})
        }
    };
    var a = e.fn.affix;
    e.fn.affix = t, e.fn.affix.Constructor = i, e.fn.affix.noConflict = function () {
        return e.fn.affix = a, this
    }, e(window).on("load", function () {
        e('[data-spy="affix"]').each(function () {
            var i = e(this), a = i.data();
            a.offset = a.offset || {}, null != a.offsetBottom && (a.offset.bottom = a.offsetBottom), null != a.offsetTop && (a.offset.top = a.offsetTop), t.call(i, a)
        })
    })
}(jQuery), define("bootstrap", [], function () {
}), function () {
    "use strict";
    function e(e) {
        e.fn.swiper = function (t) {
            var a;
            return e(this).each(function () {
                var e = new i(this, t);
                a || (a = e)
            }), a
        }
    }

    var t, i = function (e, a) {
        function n(e) {
            return Math.floor(e)
        }

        function o() {
            w.autoplayTimeoutId = setTimeout(function () {
                w.params.loop ? (w.fixLoop(), w._slideNext(), w.emit("onAutoplay", w)) : w.isEnd ? a.autoplayStopOnLast ? w.stopAutoplay() : (w._slideTo(0), w.emit("onAutoplay", w)) : (w._slideNext(), w.emit("onAutoplay", w))
            }, w.params.autoplay)
        }

        function r(e, i) {
            var a = t(e.target);
            if (!a.is(i))if ("string" == typeof i)a = a.parents(i); else if (i.nodeType) {
                var n;
                return a.parents().each(function (e, t) {
                    t === i && (n = i)
                }), n ? i : void 0
            }
            if (0 !== a.length)return a[0]
        }

        function s(e, t) {
            t = t || {};
            var i = window.MutationObserver || window.WebkitMutationObserver, a = new i(function (e) {
                e.forEach(function (e) {
                    w.onResize(!0), w.emit("onObserverUpdate", w, e)
                })
            });
            a.observe(e, {
                attributes: "undefined" == typeof t.attributes || t.attributes,
                childList: "undefined" == typeof t.childList || t.childList,
                characterData: "undefined" == typeof t.characterData || t.characterData
            }), w.observers.push(a)
        }

        function l(e) {
            e.originalEvent && (e = e.originalEvent);
            var t = e.keyCode || e.charCode;
            if (!w.params.allowSwipeToNext && (w.isHorizontal() && 39 === t || !w.isHorizontal() && 40 === t))return !1;
            if (!w.params.allowSwipeToPrev && (w.isHorizontal() && 37 === t || !w.isHorizontal() && 38 === t))return !1;
            if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || document.activeElement && document.activeElement.nodeName && ("input" === document.activeElement.nodeName.toLowerCase() || "textarea" === document.activeElement.nodeName.toLowerCase()))) {
                if (37 === t || 39 === t || 38 === t || 40 === t) {
                    var i = !1;
                    if (w.container.parents(".swiper-slide").length > 0 && 0 === w.container.parents(".swiper-slide-active").length)return;
                    var a = {
                        left: window.pageXOffset,
                        top: window.pageYOffset
                    }, n = window.innerWidth, o = window.innerHeight, r = w.container.offset();
                    w.rtl && (r.left = r.left - w.container[0].scrollLeft);
                    for (var s = [[r.left, r.top], [r.left + w.width, r.top], [r.left, r.top + w.height], [r.left + w.width, r.top + w.height]], l = 0; l < s.length; l++) {
                        var c = s[l];
                        c[0] >= a.left && c[0] <= a.left + n && c[1] >= a.top && c[1] <= a.top + o && (i = !0)
                    }
                    if (!i)return
                }
                w.isHorizontal() ? (37 !== t && 39 !== t || (e.preventDefault ? e.preventDefault() : e.returnValue = !1), (39 === t && !w.rtl || 37 === t && w.rtl) && w.slideNext(), (37 === t && !w.rtl || 39 === t && w.rtl) && w.slidePrev()) : (38 !== t && 40 !== t || (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 40 === t && w.slideNext(), 38 === t && w.slidePrev())
            }
        }

        function c(e) {
            e.originalEvent && (e = e.originalEvent);
            var t = w.mousewheel.event, i = 0, a = w.rtl ? -1 : 1;
            if (e.detail)i = -e.detail; else if ("mousewheel" === t)if (w.params.mousewheelForceToAxis)if (w.isHorizontal()) {
                if (!(Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)))return;
                i = e.wheelDeltaX * a
            } else {
                if (!(Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)))return;
                i = e.wheelDeltaY
            } else i = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? -e.wheelDeltaX * a : -e.wheelDeltaY; else if ("DOMMouseScroll" === t)i = -e.detail; else if ("wheel" === t)if (w.params.mousewheelForceToAxis)if (w.isHorizontal()) {
                if (!(Math.abs(e.deltaX) > Math.abs(e.deltaY)))return;
                i = -e.deltaX * a
            } else {
                if (!(Math.abs(e.deltaY) > Math.abs(e.deltaX)))return;
                i = -e.deltaY
            } else i = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX * a : -e.deltaY;
            if (0 !== i) {
                if (w.params.mousewheelInvert && (i = -i), w.params.freeMode) {
                    var n = w.getWrapperTranslate() + i * w.params.mousewheelSensitivity, o = w.isBeginning, r = w.isEnd;
                    if (n >= w.minTranslate() && (n = w.minTranslate()), n <= w.maxTranslate() && (n = w.maxTranslate()), w.setWrapperTransition(0), w.setWrapperTranslate(n), w.updateProgress(), w.updateActiveIndex(), (!o && w.isBeginning || !r && w.isEnd) && w.updateClasses(), w.params.freeModeSticky ? (clearTimeout(w.mousewheel.timeout), w.mousewheel.timeout = setTimeout(function () {
                            w.slideReset()
                        }, 300)) : w.params.lazyLoading && w.lazy && w.lazy.load(), 0 === n || n === w.maxTranslate())return
                } else {
                    if ((new window.Date).getTime() - w.mousewheel.lastScrollTime > 60)if (i < 0)if (w.isEnd && !w.params.loop || w.animating) {
                        if (w.params.mousewheelReleaseOnEdges)return !0
                    } else w.slideNext(); else if (w.isBeginning && !w.params.loop || w.animating) {
                        if (w.params.mousewheelReleaseOnEdges)return !0
                    } else w.slidePrev();
                    w.mousewheel.lastScrollTime = (new window.Date).getTime()
                }
                return w.params.autoplay && w.stopAutoplay(), e.preventDefault ? e.preventDefault() : e.returnValue = !1, !1
            }
        }

        function d(e, i) {
            e = t(e);
            var a, n, o, r = w.rtl ? -1 : 1;
            a = e.attr("data-swiper-parallax") || "0", n = e.attr("data-swiper-parallax-x"), o = e.attr("data-swiper-parallax-y"), n || o ? (n = n || "0", o = o || "0") : w.isHorizontal() ? (n = a, o = "0") : (o = a, n = "0"), n = n.indexOf("%") >= 0 ? parseInt(n, 10) * i * r + "%" : n * i * r + "px", o = o.indexOf("%") >= 0 ? parseInt(o, 10) * i + "%" : o * i + "px", e.transform("translate3d(" + n + ", " + o + ",0px)")
        }

        function p(e) {
            return 0 !== e.indexOf("on") && (e = e[0] !== e[0].toUpperCase() ? "on" + e[0].toUpperCase() + e.substring(1) : "on" + e), e
        }

        if (!(this instanceof i))return new i(e, a);
        var u = {
            direction: "horizontal",
            touchEventsTarget: "container",
            initialSlide: 0,
            speed: 300,
            autoplay: !1,
            autoplayDisableOnInteraction: !0,
            autoplayStopOnLast: !1,
            iOSEdgeSwipeDetection: !1,
            iOSEdgeSwipeThreshold: 20,
            freeMode: !1,
            freeModeMomentum: !0,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: !0,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: !1,
            freeModeMinimumVelocity: .02,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            coverflow: {rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: !0},
            flip: {slideShadows: !0, limitRotation: !0},
            cube: {slideShadows: !0, shadow: !0, shadowOffset: 20, shadowScale: .94},
            fade: {crossFade: !1},
            parallax: !1,
            scrollbar: null,
            scrollbarHide: !0,
            scrollbarDraggable: !1,
            scrollbarSnapOnRelease: !1,
            keyboardControl: !1,
            mousewheelControl: !1,
            mousewheelReleaseOnEdges: !1,
            mousewheelInvert: !1,
            mousewheelForceToAxis: !1,
            mousewheelSensitivity: 1,
            hashnav: !1,
            breakpoints: void 0,
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: "column",
            slidesPerGroup: 1,
            centeredSlides: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            onlyExternal: !1,
            threshold: 0,
            touchMoveStopPropagation: !0,
            pagination: null,
            paginationElement: "span",
            paginationClickable: !1,
            paginationHide: !1,
            paginationBulletRender: null,
            paginationProgressRender: null,
            paginationFractionRender: null,
            paginationCustomRender: null,
            paginationType: "bullets",
            resistance: !0,
            resistanceRatio: .85,
            nextButton: null,
            prevButton: null,
            watchSlidesProgress: !1,
            watchSlidesVisibility: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            lazyLoading: !1,
            lazyLoadingInPrevNext: !1,
            lazyLoadingInPrevNextAmount: 1,
            lazyLoadingOnTransitionStart: !1,
            preloadImages: !0,
            updateOnImagesReady: !0,
            loop: !1,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            control: void 0,
            controlInverse: !1,
            controlBy: "slide",
            allowSwipeToPrev: !0,
            allowSwipeToNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            slideClass: "swiper-slide",
            slideActiveClass: "swiper-slide-active",
            slideVisibleClass: "swiper-slide-visible",
            slideDuplicateClass: "swiper-slide-duplicate",
            slideNextClass: "swiper-slide-next",
            slidePrevClass: "swiper-slide-prev",
            wrapperClass: "swiper-wrapper",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            buttonDisabledClass: "swiper-button-disabled",
            paginationCurrentClass: "swiper-pagination-current",
            paginationTotalClass: "swiper-pagination-total",
            paginationHiddenClass: "swiper-pagination-hidden",
            paginationProgressbarClass: "swiper-pagination-progressbar",
            observer: !1,
            observeParents: !1,
            a11y: !1,
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
            firstSlideMessage: "This is the first slide",
            lastSlideMessage: "This is the last slide",
            paginationBulletMessage: "Go to slide {{index}}",
            runCallbacksOnInit: !0
        }, m = a && a.virtualTranslate;
        a = a || {};
        var h = {};
        for (var f in a)if ("object" != typeof a[f] || null === a[f] || (a[f].nodeType || a[f] === window || a[f] === document || "undefined" != typeof Dom7 && a[f] instanceof Dom7 || "undefined" != typeof jQuery && a[f] instanceof jQuery))h[f] = a[f]; else {
            h[f] = {};
            for (var g in a[f])h[f][g] = a[f][g]
        }
        for (var v in u)if ("undefined" == typeof a[v])a[v] = u[v]; else if ("object" == typeof a[v])for (var y in u[v])"undefined" == typeof a[v][y] && (a[v][y] = u[v][y]);
        var w = this;
        if (w.params = a, w.originalParams = h, w.classNames = [], "undefined" != typeof t && "undefined" != typeof Dom7 && (t = Dom7), ("undefined" != typeof t || (t = "undefined" == typeof Dom7 ? window.Dom7 || window.Zepto || window.jQuery : Dom7)) && (w.$ = t, w.currentBreakpoint = void 0, w.getActiveBreakpoint = function () {
                if (!w.params.breakpoints)return !1;
                var e, t = !1, i = [];
                for (e in w.params.breakpoints)w.params.breakpoints.hasOwnProperty(e) && i.push(e);
                i.sort(function (e, t) {
                    return parseInt(e, 10) > parseInt(t, 10)
                });
                for (var a = 0; a < i.length; a++)e = i[a], e >= window.innerWidth && !t && (t = e);
                return t || "max"
            }, w.setBreakpoint = function () {
                var e = w.getActiveBreakpoint();
                if (e && w.currentBreakpoint !== e) {
                    var t = e in w.params.breakpoints ? w.params.breakpoints[e] : w.originalParams;
                    for (var i in t)w.params[i] = t[i];
                    w.currentBreakpoint = e
                }
            }, w.params.breakpoints && w.setBreakpoint(), w.container = t(e), 0 !== w.container.length)) {
            if (w.container.length > 1)return void w.container.each(function () {
                new i(this, a)
            });
            w.container[0].swiper = w, w.container.data("swiper", w), w.classNames.push("swiper-container-" + w.params.direction), w.params.freeMode && w.classNames.push("swiper-container-free-mode"), w.support.flexbox || (w.classNames.push("swiper-container-no-flexbox"), w.params.slidesPerColumn = 1), w.params.autoHeight && w.classNames.push("swiper-container-autoheight"), (w.params.parallax || w.params.watchSlidesVisibility) && (w.params.watchSlidesProgress = !0), ["cube", "coverflow", "flip"].indexOf(w.params.effect) >= 0 && (w.support.transforms3d ? (w.params.watchSlidesProgress = !0, w.classNames.push("swiper-container-3d")) : w.params.effect = "slide"), "slide" !== w.params.effect && w.classNames.push("swiper-container-" + w.params.effect), "cube" === w.params.effect && (w.params.resistanceRatio = 0, w.params.slidesPerView = 1, w.params.slidesPerColumn = 1, w.params.slidesPerGroup = 1, w.params.centeredSlides = !1, w.params.spaceBetween = 0, w.params.virtualTranslate = !0, w.params.setWrapperSize = !1), "fade" !== w.params.effect && "flip" !== w.params.effect || (w.params.slidesPerView = 1, w.params.slidesPerColumn = 1, w.params.slidesPerGroup = 1, w.params.watchSlidesProgress = !0, w.params.spaceBetween = 0, w.params.setWrapperSize = !1, "undefined" == typeof m && (w.params.virtualTranslate = !0)), w.params.grabCursor && w.support.touch && (w.params.grabCursor = !1), w.wrapper = w.container.children("." + w.params.wrapperClass), w.params.pagination && (w.paginationContainer = t(w.params.pagination), "bullets" === w.params.paginationType && w.params.paginationClickable ? w.paginationContainer.addClass("swiper-pagination-clickable") : w.params.paginationClickable = !1, w.paginationContainer.addClass("swiper-pagination-" + w.params.paginationType)), w.isHorizontal = function () {
                return "horizontal" === w.params.direction
            }, w.rtl = w.isHorizontal() && ("rtl" === w.container[0].dir.toLowerCase() || "rtl" === w.container.css("direction")), w.rtl && w.classNames.push("swiper-container-rtl"), w.rtl && (w.wrongRTL = "-webkit-box" === w.wrapper.css("display")), w.params.slidesPerColumn > 1 && w.classNames.push("swiper-container-multirow"), w.device.android && w.classNames.push("swiper-container-android"), w.container.addClass(w.classNames.join(" ")), w.translate = 0, w.progress = 0, w.velocity = 0, w.lockSwipeToNext = function () {
                w.params.allowSwipeToNext = !1
            }, w.lockSwipeToPrev = function () {
                w.params.allowSwipeToPrev = !1
            }, w.lockSwipes = function () {
                w.params.allowSwipeToNext = w.params.allowSwipeToPrev = !1
            }, w.unlockSwipeToNext = function () {
                w.params.allowSwipeToNext = !0
            }, w.unlockSwipeToPrev = function () {
                w.params.allowSwipeToPrev = !0
            }, w.unlockSwipes = function () {
                w.params.allowSwipeToNext = w.params.allowSwipeToPrev = !0
            }, w.params.grabCursor && (w.container[0].style.cursor = "move", w.container[0].style.cursor = "-webkit-grab", w.container[0].style.cursor = "-moz-grab", w.container[0].style.cursor = "grab"), w.imagesToLoad = [], w.imagesLoaded = 0, w.loadImage = function (e, t, i, a, n) {
                function o() {
                    n && n()
                }

                var r;
                e.complete && a ? o() : t ? (r = new window.Image, r.onload = o, r.onerror = o, i && (r.srcset = i), t && (r.src = t)) : o()
            }, w.preloadImages = function () {
                function e() {
                    "undefined" != typeof w && null !== w && (void 0 !== w.imagesLoaded && w.imagesLoaded++, w.imagesLoaded === w.imagesToLoad.length && (w.params.updateOnImagesReady && w.update(), w.emit("onImagesReady", w)))
                }

                w.imagesToLoad = w.container.find("img");
                for (var t = 0; t < w.imagesToLoad.length; t++)w.loadImage(w.imagesToLoad[t], w.imagesToLoad[t].currentSrc || w.imagesToLoad[t].getAttribute("src"), w.imagesToLoad[t].srcset || w.imagesToLoad[t].getAttribute("srcset"), !0, e)
            }, w.autoplayTimeoutId = void 0, w.autoplaying = !1, w.autoplayPaused = !1, w.startAutoplay = function () {
                return "undefined" == typeof w.autoplayTimeoutId && (!!w.params.autoplay && (!w.autoplaying && (w.autoplaying = !0, w.emit("onAutoplayStart", w), void o())))
            }, w.stopAutoplay = function (e) {
                w.autoplayTimeoutId && (w.autoplayTimeoutId && clearTimeout(w.autoplayTimeoutId), w.autoplaying = !1, w.autoplayTimeoutId = void 0, w.emit("onAutoplayStop", w))
            }, w.pauseAutoplay = function (e) {
                w.autoplayPaused || (w.autoplayTimeoutId && clearTimeout(w.autoplayTimeoutId), w.autoplayPaused = !0, 0 === e ? (w.autoplayPaused = !1, o()) : w.wrapper.transitionEnd(function () {
                    w && (w.autoplayPaused = !1, w.autoplaying ? o() : w.stopAutoplay())
                }))
            }, w.minTranslate = function () {
                return -w.snapGrid[0]
            }, w.maxTranslate = function () {
                return -w.snapGrid[w.snapGrid.length - 1]
            }, w.updateAutoHeight = function () {
                var e = w.slides.eq(w.activeIndex)[0];
                if ("undefined" != typeof e) {
                    var t = e.offsetHeight;
                    t && w.wrapper.css("height", t + "px")
                }
            }, w.updateContainerSize = function () {
                var e, t;
                e = "undefined" != typeof w.params.width ? w.params.width : w.container[0].clientWidth, t = "undefined" != typeof w.params.height ? w.params.height : w.container[0].clientHeight, 0 === e && w.isHorizontal() || 0 === t && !w.isHorizontal() || (e = e - parseInt(w.container.css("padding-left"), 10) - parseInt(w.container.css("padding-right"), 10), t = t - parseInt(w.container.css("padding-top"), 10) - parseInt(w.container.css("padding-bottom"), 10), w.width = e, w.height = t, w.size = w.isHorizontal() ? w.width : w.height)
            }, w.updateSlidesSize = function () {
                w.slides = w.wrapper.children("." + w.params.slideClass), w.snapGrid = [], w.slidesGrid = [], w.slidesSizesGrid = [];
                var e, t = w.params.spaceBetween, i = -w.params.slidesOffsetBefore, a = 0, o = 0;
                "string" == typeof t && t.indexOf("%") >= 0 && (t = parseFloat(t.replace("%", "")) / 100 * w.size), w.virtualSize = -t, w.rtl ? w.slides.css({
                    marginLeft: "",
                    marginTop: ""
                }) : w.slides.css({marginRight: "", marginBottom: ""});
                var r;
                w.params.slidesPerColumn > 1 && (r = Math.floor(w.slides.length / w.params.slidesPerColumn) === w.slides.length / w.params.slidesPerColumn ? w.slides.length : Math.ceil(w.slides.length / w.params.slidesPerColumn) * w.params.slidesPerColumn, "auto" !== w.params.slidesPerView && "row" === w.params.slidesPerColumnFill && (r = Math.max(r, w.params.slidesPerView * w.params.slidesPerColumn)));
                var s, l = w.params.slidesPerColumn, c = r / l, d = c - (w.params.slidesPerColumn * c - w.slides.length);
                for (e = 0; e < w.slides.length; e++) {
                    s = 0;
                    var p = w.slides.eq(e);
                    if (w.params.slidesPerColumn > 1) {
                        var u, m, h;
                        "column" === w.params.slidesPerColumnFill ? (m = Math.floor(e / l), h = e - m * l, (m > d || m === d && h === l - 1) && ++h >= l && (h = 0, m++), u = m + h * r / l, p.css({
                            "-webkit-box-ordinal-group": u,
                            "-moz-box-ordinal-group": u,
                            "-ms-flex-order": u,
                            "-webkit-order": u,
                            order: u
                        })) : (h = Math.floor(e / c), m = e - h * c), p.css({"margin-top": 0 !== h && w.params.spaceBetween && w.params.spaceBetween + "px"}).attr("data-swiper-column", m).attr("data-swiper-row", h)
                    }
                    "none" !== p.css("display") && ("auto" === w.params.slidesPerView ? (s = w.isHorizontal() ? p.outerWidth(!0) : p.outerHeight(!0), w.params.roundLengths && (s = n(s))) : (s = (w.size - (w.params.slidesPerView - 1) * t) / w.params.slidesPerView, w.params.roundLengths && (s = n(s)), w.isHorizontal() ? w.slides[e].style.width = s + "px" : w.slides[e].style.height = s + "px"), w.slides[e].swiperSlideSize = s, w.slidesSizesGrid.push(s), w.params.centeredSlides ? (i = i + s / 2 + a / 2 + t, 0 === e && (i = i - w.size / 2 - t), Math.abs(i) < .001 && (i = 0), o % w.params.slidesPerGroup === 0 && w.snapGrid.push(i), w.slidesGrid.push(i)) : (o % w.params.slidesPerGroup === 0 && w.snapGrid.push(i), w.slidesGrid.push(i), i = i + s + t), w.virtualSize += s + t, a = s, o++)
                }
                w.virtualSize = Math.max(w.virtualSize, w.size) + w.params.slidesOffsetAfter;
                var f;
                if (w.rtl && w.wrongRTL && ("slide" === w.params.effect || "coverflow" === w.params.effect) && w.wrapper.css({width: w.virtualSize + w.params.spaceBetween + "px"}), w.support.flexbox && !w.params.setWrapperSize || (w.isHorizontal() ? w.wrapper.css({width: w.virtualSize + w.params.spaceBetween + "px"}) : w.wrapper.css({height: w.virtualSize + w.params.spaceBetween + "px"})), w.params.slidesPerColumn > 1 && (w.virtualSize = (s + w.params.spaceBetween) * r, w.virtualSize = Math.ceil(w.virtualSize / w.params.slidesPerColumn) - w.params.spaceBetween, w.wrapper.css({width: w.virtualSize + w.params.spaceBetween + "px"}), w.params.centeredSlides)) {
                    for (f = [], e = 0; e < w.snapGrid.length; e++)w.snapGrid[e] < w.virtualSize + w.snapGrid[0] && f.push(w.snapGrid[e]);
                    w.snapGrid = f
                }
                if (!w.params.centeredSlides) {
                    for (f = [], e = 0; e < w.snapGrid.length; e++)w.snapGrid[e] <= w.virtualSize - w.size && f.push(w.snapGrid[e]);
                    w.snapGrid = f, Math.floor(w.virtualSize - w.size) > Math.floor(w.snapGrid[w.snapGrid.length - 1]) && w.snapGrid.push(w.virtualSize - w.size)
                }
                0 === w.snapGrid.length && (w.snapGrid = [0]), 0 !== w.params.spaceBetween && (w.isHorizontal() ? w.rtl ? w.slides.css({marginLeft: t + "px"}) : w.slides.css({marginRight: t + "px"}) : w.slides.css({marginBottom: t + "px"})), w.params.watchSlidesProgress && w.updateSlidesOffset()
            }, w.updateSlidesOffset = function () {
                for (var e = 0; e < w.slides.length; e++)w.slides[e].swiperSlideOffset = w.isHorizontal() ? w.slides[e].offsetLeft : w.slides[e].offsetTop
            }, w.updateSlidesProgress = function (e) {
                if ("undefined" == typeof e && (e = w.translate || 0), 0 !== w.slides.length) {
                    "undefined" == typeof w.slides[0].swiperSlideOffset && w.updateSlidesOffset();
                    var t = -e;
                    w.rtl && (t = e), w.slides.removeClass(w.params.slideVisibleClass);
                    for (var i = 0; i < w.slides.length; i++) {
                        var a = w.slides[i], n = (t - a.swiperSlideOffset) / (a.swiperSlideSize + w.params.spaceBetween);
                        if (w.params.watchSlidesVisibility) {
                            var o = -(t - a.swiperSlideOffset), r = o + w.slidesSizesGrid[i], s = o >= 0 && o < w.size || r > 0 && r <= w.size || o <= 0 && r >= w.size;
                            s && w.slides.eq(i).addClass(w.params.slideVisibleClass)
                        }
                        a.progress = w.rtl ? -n : n
                    }
                }
            }, w.updateProgress = function (e) {
                "undefined" == typeof e && (e = w.translate || 0);
                var t = w.maxTranslate() - w.minTranslate(), i = w.isBeginning, a = w.isEnd;
                0 === t ? (w.progress = 0, w.isBeginning = w.isEnd = !0) : (w.progress = (e - w.minTranslate()) / t, w.isBeginning = w.progress <= 0, w.isEnd = w.progress >= 1), w.isBeginning && !i && w.emit("onReachBeginning", w), w.isEnd && !a && w.emit("onReachEnd", w), w.params.watchSlidesProgress && w.updateSlidesProgress(e), w.emit("onProgress", w, w.progress)
            }, w.updateActiveIndex = function () {
                var e, t, i, a = w.rtl ? w.translate : -w.translate;
                for (t = 0; t < w.slidesGrid.length; t++)"undefined" != typeof w.slidesGrid[t + 1] ? a >= w.slidesGrid[t] && a < w.slidesGrid[t + 1] - (w.slidesGrid[t + 1] - w.slidesGrid[t]) / 2 ? e = t : a >= w.slidesGrid[t] && a < w.slidesGrid[t + 1] && (e = t + 1) : a >= w.slidesGrid[t] && (e = t);
                (e < 0 || "undefined" == typeof e) && (e = 0), i = Math.floor(e / w.params.slidesPerGroup), i >= w.snapGrid.length && (i = w.snapGrid.length - 1), e !== w.activeIndex && (w.snapIndex = i, w.previousIndex = w.activeIndex, w.activeIndex = e, w.updateClasses())
            }, w.updateClasses = function () {
                w.slides.removeClass(w.params.slideActiveClass + " " + w.params.slideNextClass + " " + w.params.slidePrevClass);
                var e = w.slides.eq(w.activeIndex);
                if (e.addClass(w.params.slideActiveClass), e.next("." + w.params.slideClass).addClass(w.params.slideNextClass), e.prev("." + w.params.slideClass).addClass(w.params.slidePrevClass), w.paginationContainer && w.paginationContainer.length > 0) {
                    var i, a = w.params.loop ? Math.ceil((w.slides.length - 2 * w.loopedSlides) / w.params.slidesPerGroup) : w.snapGrid.length;
                    if (w.params.loop ? (i = Math.ceil(w.activeIndex - w.loopedSlides) / w.params.slidesPerGroup, i > w.slides.length - 1 - 2 * w.loopedSlides && (i -= w.slides.length - 2 * w.loopedSlides), i > a - 1 && (i -= a), i < 0 && "bullets" !== w.params.paginationType && (i = a + i)) : i = "undefined" != typeof w.snapIndex ? w.snapIndex : w.activeIndex || 0, "bullets" === w.params.paginationType && w.bullets && w.bullets.length > 0 && (w.bullets.removeClass(w.params.bulletActiveClass), w.paginationContainer.length > 1 ? w.bullets.each(function () {
                            t(this).index() === i && t(this).addClass(w.params.bulletActiveClass)
                        }) : w.bullets.eq(i).addClass(w.params.bulletActiveClass)), "fraction" === w.params.paginationType && (w.paginationContainer.find("." + w.params.paginationCurrentClass).text(i + 1), w.paginationContainer.find("." + w.params.paginationTotalClass).text(a)), "progress" === w.params.paginationType) {
                        var n = (i + 1) / a, o = n, r = 1;
                        w.isHorizontal() || (r = n, o = 1), w.paginationContainer.find("." + w.params.paginationProgressbarClass).transform("translate3d(0,0,0) scaleX(" + o + ") scaleY(" + r + ")").transition(w.params.speed)
                    }
                    "custom" === w.params.paginationType && w.params.paginationCustomRender && w.paginationContainer.html(w.params.paginationCustomRender(w, i + 1, a))
                }
                w.params.loop || (w.params.prevButton && (w.isBeginning ? (t(w.params.prevButton).addClass(w.params.buttonDisabledClass), w.params.a11y && w.a11y && w.a11y.disable(t(w.params.prevButton))) : (t(w.params.prevButton).removeClass(w.params.buttonDisabledClass), w.params.a11y && w.a11y && w.a11y.enable(t(w.params.prevButton)))), w.params.nextButton && (w.isEnd ? (t(w.params.nextButton).addClass(w.params.buttonDisabledClass), w.params.a11y && w.a11y && w.a11y.disable(t(w.params.nextButton))) : (t(w.params.nextButton).removeClass(w.params.buttonDisabledClass), w.params.a11y && w.a11y && w.a11y.enable(t(w.params.nextButton)))))
            }, w.updatePagination = function () {
                if (w.params.pagination && w.paginationContainer && w.paginationContainer.length > 0) {
                    var e = "";
                    if ("bullets" === w.params.paginationType) {
                        for (var t = w.params.loop ? Math.ceil((w.slides.length - 2 * w.loopedSlides) / w.params.slidesPerGroup) : w.snapGrid.length, i = 0; i < t; i++)e += w.params.paginationBulletRender ? w.params.paginationBulletRender(i, w.params.bulletClass) : "<" + w.params.paginationElement + ' class="' + w.params.bulletClass + '"></' + w.params.paginationElement + ">";
                        w.paginationContainer.html(e), w.bullets = w.paginationContainer.find("." + w.params.bulletClass), w.params.paginationClickable && w.params.a11y && w.a11y && w.a11y.initPagination()
                    }
                    "fraction" === w.params.paginationType && (e = w.params.paginationFractionRender ? w.params.paginationFractionRender(w, w.params.paginationCurrentClass, w.params.paginationTotalClass) : '<span class="' + w.params.paginationCurrentClass + '"></span> / <span class="' + w.params.paginationTotalClass + '"></span>', w.paginationContainer.html(e)), "progress" === w.params.paginationType && (e = w.params.paginationProgressRender ? w.params.paginationProgressRender(w, w.params.paginationProgressbarClass) : '<span class="' + w.params.paginationProgressbarClass + '"></span>', w.paginationContainer.html(e))
                }
            }, w.update = function (e) {
                function t() {
                    a = Math.min(Math.max(w.translate, w.maxTranslate()), w.minTranslate()), w.setWrapperTranslate(a), w.updateActiveIndex(), w.updateClasses()
                }

                if (w.updateContainerSize(), w.updateSlidesSize(), w.updateProgress(), w.updatePagination(), w.updateClasses(), w.params.scrollbar && w.scrollbar && w.scrollbar.set(), e) {
                    var i, a;
                    w.controller && w.controller.spline && (w.controller.spline = void 0), w.params.freeMode ? (t(), w.params.autoHeight && w.updateAutoHeight()) : (i = ("auto" === w.params.slidesPerView || w.params.slidesPerView > 1) && w.isEnd && !w.params.centeredSlides ? w.slideTo(w.slides.length - 1, 0, !1, !0) : w.slideTo(w.activeIndex, 0, !1, !0), i || t())
                } else w.params.autoHeight && w.updateAutoHeight()
            }, w.onResize = function (e) {
                w.params.breakpoints && w.setBreakpoint();
                var t = w.params.allowSwipeToPrev, i = w.params.allowSwipeToNext;
                if (w.params.allowSwipeToPrev = w.params.allowSwipeToNext = !0, w.updateContainerSize(), w.updateSlidesSize(), ("auto" === w.params.slidesPerView || w.params.freeMode || e) && w.updatePagination(), w.params.scrollbar && w.scrollbar && w.scrollbar.set(), w.controller && w.controller.spline && (w.controller.spline = void 0), w.params.freeMode) {
                    var a = Math.min(Math.max(w.translate, w.maxTranslate()), w.minTranslate());
                    w.setWrapperTranslate(a), w.updateActiveIndex(), w.updateClasses(), w.params.autoHeight && w.updateAutoHeight()
                } else w.updateClasses(), ("auto" === w.params.slidesPerView || w.params.slidesPerView > 1) && w.isEnd && !w.params.centeredSlides ? w.slideTo(w.slides.length - 1, 0, !1, !0) : w.slideTo(w.activeIndex, 0, !1, !0);
                w.params.allowSwipeToPrev = t, w.params.allowSwipeToNext = i
            };
            var b = ["mousedown", "mousemove", "mouseup"];
            window.navigator.pointerEnabled ? b = ["pointerdown", "pointermove", "pointerup"] : window.navigator.msPointerEnabled && (b = ["MSPointerDown", "MSPointerMove", "MSPointerUp"]), w.touchEvents = {
                start: w.support.touch || !w.params.simulateTouch ? "touchstart" : b[0],
                move: w.support.touch || !w.params.simulateTouch ? "touchmove" : b[1],
                end: w.support.touch || !w.params.simulateTouch ? "touchend" : b[2]
            }, (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && ("container" === w.params.touchEventsTarget ? w.container : w.wrapper).addClass("swiper-wp8-" + w.params.direction), w.initEvents = function (e) {
                var i = e ? "off" : "on", n = e ? "removeEventListener" : "addEventListener", o = "container" === w.params.touchEventsTarget ? w.container[0] : w.wrapper[0], r = w.support.touch ? o : document, s = !!w.params.nested;
                w.browser.ie ? (o[n](w.touchEvents.start, w.onTouchStart, !1), r[n](w.touchEvents.move, w.onTouchMove, s), r[n](w.touchEvents.end, w.onTouchEnd, !1)) : (w.support.touch && (o[n](w.touchEvents.start, w.onTouchStart, !1), o[n](w.touchEvents.move, w.onTouchMove, s), o[n](w.touchEvents.end, w.onTouchEnd, !1)), !a.simulateTouch || w.device.ios || w.device.android || (o[n]("mousedown", w.onTouchStart, !1), document[n]("mousemove", w.onTouchMove, s), document[n]("mouseup", w.onTouchEnd, !1))), window[n]("resize", w.onResize), w.params.nextButton && (t(w.params.nextButton)[i]("click", w.onClickNext), w.params.a11y && w.a11y && t(w.params.nextButton)[i]("keydown", w.a11y.onEnterKey)), w.params.prevButton && (t(w.params.prevButton)[i]("click", w.onClickPrev), w.params.a11y && w.a11y && t(w.params.prevButton)[i]("keydown", w.a11y.onEnterKey)), w.params.pagination && w.params.paginationClickable && (t(w.paginationContainer)[i]("click", "." + w.params.bulletClass, w.onClickIndex), w.params.a11y && w.a11y && t(w.paginationContainer)[i]("keydown", "." + w.params.bulletClass, w.a11y.onEnterKey)), (w.params.preventClicks || w.params.preventClicksPropagation) && o[n]("click", w.preventClicks, !0)
            }, w.attachEvents = function (e) {
                w.initEvents()
            }, w.detachEvents = function () {
                w.initEvents(!0)
            }, w.allowClick = !0, w.preventClicks = function (e) {
                w.allowClick || (w.params.preventClicks && e.preventDefault(), w.params.preventClicksPropagation && w.animating && (e.stopPropagation(), e.stopImmediatePropagation()))
            }, w.onClickNext = function (e) {
                e.preventDefault(), w.isEnd && !w.params.loop || w.slideNext()
            }, w.onClickPrev = function (e) {
                e.preventDefault(), w.isBeginning && !w.params.loop || w.slidePrev()
            }, w.onClickIndex = function (e) {
                e.preventDefault();
                var i = t(this).index() * w.params.slidesPerGroup;
                w.params.loop && (i += w.loopedSlides), w.slideTo(i)
            }, w.updateClickedSlide = function (e) {
                var i = r(e, "." + w.params.slideClass), a = !1;
                if (i)for (var n = 0; n < w.slides.length; n++)w.slides[n] === i && (a = !0);
                if (!i || !a)return w.clickedSlide = void 0, void(w.clickedIndex = void 0);
                if (w.clickedSlide = i, w.clickedIndex = t(i).index(), w.params.slideToClickedSlide && void 0 !== w.clickedIndex && w.clickedIndex !== w.activeIndex) {
                    var o, s = w.clickedIndex;
                    if (w.params.loop) {
                        if (w.animating)return;
                        o = t(w.clickedSlide).attr("data-swiper-slide-index"), w.params.centeredSlides ? s < w.loopedSlides - w.params.slidesPerView / 2 || s > w.slides.length - w.loopedSlides + w.params.slidesPerView / 2 ? (w.fixLoop(), s = w.wrapper.children("." + w.params.slideClass + '[data-swiper-slide-index="' + o + '"]:not(.swiper-slide-duplicate)').eq(0).index(), setTimeout(function () {
                            w.slideTo(s)
                        }, 0)) : w.slideTo(s) : s > w.slides.length - w.params.slidesPerView ? (w.fixLoop(), s = w.wrapper.children("." + w.params.slideClass + '[data-swiper-slide-index="' + o + '"]:not(.swiper-slide-duplicate)').eq(0).index(), setTimeout(function () {
                            w.slideTo(s)
                        }, 0)) : w.slideTo(s)
                    } else w.slideTo(s)
                }
            };
            var _, x, T, S, C, j, k, E, $, M, I = "input, select, textarea, button", P = Date.now(), A = [];
            w.animating = !1, w.touches = {startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0};
            var O, D;
            if (w.onTouchStart = function (e) {
                    if (e.originalEvent && (e = e.originalEvent), O = "touchstart" === e.type, O || !("which" in e) || 3 !== e.which) {
                        if (w.params.noSwiping && r(e, "." + w.params.noSwipingClass))return void(w.allowClick = !0);
                        if (!w.params.swipeHandler || r(e, w.params.swipeHandler)) {
                            var i = w.touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, a = w.touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
                            if (!(w.device.ios && w.params.iOSEdgeSwipeDetection && i <= w.params.iOSEdgeSwipeThreshold)) {
                                if (_ = !0, x = !1, T = !0, C = void 0, D = void 0, w.touches.startX = i, w.touches.startY = a, S = Date.now(), w.allowClick = !0, w.updateContainerSize(), w.swipeDirection = void 0, w.params.threshold > 0 && (E = !1), "touchstart" !== e.type) {
                                    var n = !0;
                                    t(e.target).is(I) && (n = !1), document.activeElement && t(document.activeElement).is(I) && document.activeElement.blur(), n && e.preventDefault()
                                }
                                w.emit("onTouchStart", w, e)
                            }
                        }
                    }
                }, w.onTouchMove = function (e) {
                    if (e.originalEvent && (e = e.originalEvent), !(O && "mousemove" === e.type || e.preventedByNestedSwiper)) {
                        if (w.params.onlyExternal)return w.allowClick = !1, void(_ && (w.touches.startX = w.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, w.touches.startY = w.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, S = Date.now()));
                        if (O && document.activeElement && e.target === document.activeElement && t(e.target).is(I))return x = !0, void(w.allowClick = !1);
                        if (T && w.emit("onTouchMove", w, e), !(e.targetTouches && e.targetTouches.length > 1)) {
                            if (w.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, w.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, "undefined" == typeof C) {
                                var i = 180 * Math.atan2(Math.abs(w.touches.currentY - w.touches.startY), Math.abs(w.touches.currentX - w.touches.startX)) / Math.PI;
                                C = w.isHorizontal() ? i > w.params.touchAngle : 90 - i > w.params.touchAngle
                            }
                            if (C && w.emit("onTouchMoveOpposite", w, e), "undefined" == typeof D && w.browser.ieTouch && (w.touches.currentX === w.touches.startX && w.touches.currentY === w.touches.startY || (D = !0)), _) {
                                if (C)return void(_ = !1);
                                if (D || !w.browser.ieTouch) {
                                    w.allowClick = !1, w.emit("onSliderMove", w, e), e.preventDefault(), w.params.touchMoveStopPropagation && !w.params.nested && e.stopPropagation(), x || (a.loop && w.fixLoop(), k = w.getWrapperTranslate(), w.setWrapperTransition(0), w.animating && w.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"), w.params.autoplay && w.autoplaying && (w.params.autoplayDisableOnInteraction ? w.stopAutoplay() : w.pauseAutoplay()), M = !1, w.params.grabCursor && (w.container[0].style.cursor = "move", w.container[0].style.cursor = "-webkit-grabbing", w.container[0].style.cursor = "-moz-grabbin", w.container[0].style.cursor = "grabbing")), x = !0;
                                    var n = w.touches.diff = w.isHorizontal() ? w.touches.currentX - w.touches.startX : w.touches.currentY - w.touches.startY;
                                    n *= w.params.touchRatio, w.rtl && (n = -n), w.swipeDirection = n > 0 ? "prev" : "next", j = n + k;
                                    var o = !0;
                                    if (n > 0 && j > w.minTranslate() ? (o = !1, w.params.resistance && (j = w.minTranslate() - 1 + Math.pow(-w.minTranslate() + k + n, w.params.resistanceRatio))) : n < 0 && j < w.maxTranslate() && (o = !1, w.params.resistance && (j = w.maxTranslate() + 1 - Math.pow(w.maxTranslate() - k - n, w.params.resistanceRatio))), o && (e.preventedByNestedSwiper = !0), !w.params.allowSwipeToNext && "next" === w.swipeDirection && j < k && (j = k), !w.params.allowSwipeToPrev && "prev" === w.swipeDirection && j > k && (j = k), w.params.followFinger) {
                                        if (w.params.threshold > 0) {
                                            if (!(Math.abs(n) > w.params.threshold || E))return void(j = k);
                                            if (!E)return E = !0, w.touches.startX = w.touches.currentX, w.touches.startY = w.touches.currentY, j = k, void(w.touches.diff = w.isHorizontal() ? w.touches.currentX - w.touches.startX : w.touches.currentY - w.touches.startY)
                                        }
                                        (w.params.freeMode || w.params.watchSlidesProgress) && w.updateActiveIndex(), w.params.freeMode && (0 === A.length && A.push({
                                            position: w.touches[w.isHorizontal() ? "startX" : "startY"],
                                            time: S
                                        }), A.push({
                                            position: w.touches[w.isHorizontal() ? "currentX" : "currentY"],
                                            time: (new window.Date).getTime()
                                        })), w.updateProgress(j), w.setWrapperTranslate(j)
                                    }
                                }
                            }
                        }
                    }
                }, w.onTouchEnd = function (e) {
                    if (e.originalEvent && (e = e.originalEvent), T && w.emit("onTouchEnd", w, e), T = !1, _) {
                        w.params.grabCursor && x && _ && (w.container[0].style.cursor = "move", w.container[0].style.cursor = "-webkit-grab", w.container[0].style.cursor = "-moz-grab", w.container[0].style.cursor = "grab");
                        var i = Date.now(), a = i - S;
                        if (w.allowClick && (w.updateClickedSlide(e), w.emit("onTap", w, e), a < 300 && i - P > 300 && ($ && clearTimeout($), $ = setTimeout(function () {
                                w && (w.params.paginationHide && w.paginationContainer.length > 0 && !t(e.target).hasClass(w.params.bulletClass) && w.paginationContainer.toggleClass(w.params.paginationHiddenClass), w.emit("onClick", w, e))
                            }, 300)), a < 300 && i - P < 300 && ($ && clearTimeout($), w.emit("onDoubleTap", w, e))), P = Date.now(), setTimeout(function () {
                                w && (w.allowClick = !0)
                            }, 0), !_ || !x || !w.swipeDirection || 0 === w.touches.diff || j === k)return void(_ = x = !1);
                        _ = x = !1;
                        var n;
                        if (n = w.params.followFinger ? w.rtl ? w.translate : -w.translate : -j, w.params.freeMode) {
                            if (n < -w.minTranslate())return void w.slideTo(w.activeIndex);
                            if (n > -w.maxTranslate())return void(w.slides.length < w.snapGrid.length ? w.slideTo(w.snapGrid.length - 1) : w.slideTo(w.slides.length - 1));
                            if (w.params.freeModeMomentum) {
                                if (A.length > 1) {
                                    var o = A.pop(), r = A.pop(), s = o.position - r.position, l = o.time - r.time;
                                    w.velocity = s / l, w.velocity = w.velocity / 2, Math.abs(w.velocity) < w.params.freeModeMinimumVelocity && (w.velocity = 0), (l > 150 || (new window.Date).getTime() - o.time > 300) && (w.velocity = 0)
                                } else w.velocity = 0;
                                A.length = 0;
                                var c = 1e3 * w.params.freeModeMomentumRatio, d = w.velocity * c, p = w.translate + d;
                                w.rtl && (p = -p);
                                var u, m = !1, h = 20 * Math.abs(w.velocity) * w.params.freeModeMomentumBounceRatio;
                                if (p < w.maxTranslate())w.params.freeModeMomentumBounce ? (p + w.maxTranslate() < -h && (p = w.maxTranslate() - h), u = w.maxTranslate(), m = !0, M = !0) : p = w.maxTranslate(); else if (p > w.minTranslate())w.params.freeModeMomentumBounce ? (p - w.minTranslate() > h && (p = w.minTranslate() + h), u = w.minTranslate(), m = !0, M = !0) : p = w.minTranslate(); else if (w.params.freeModeSticky) {
                                    var f, g = 0;
                                    for (g = 0; g < w.snapGrid.length; g += 1)if (w.snapGrid[g] > -p) {
                                        f = g;
                                        break
                                    }
                                    p = Math.abs(w.snapGrid[f] - p) < Math.abs(w.snapGrid[f - 1] - p) || "next" === w.swipeDirection ? w.snapGrid[f] : w.snapGrid[f - 1], w.rtl || (p = -p)
                                }
                                if (0 !== w.velocity)c = w.rtl ? Math.abs((-p - w.translate) / w.velocity) : Math.abs((p - w.translate) / w.velocity); else if (w.params.freeModeSticky)return void w.slideReset();
                                w.params.freeModeMomentumBounce && m ? (w.updateProgress(u), w.setWrapperTransition(c), w.setWrapperTranslate(p), w.onTransitionStart(), w.animating = !0, w.wrapper.transitionEnd(function () {
                                    w && M && (w.emit("onMomentumBounce", w), w.setWrapperTransition(w.params.speed), w.setWrapperTranslate(u), w.wrapper.transitionEnd(function () {
                                        w && w.onTransitionEnd()
                                    }))
                                })) : w.velocity ? (w.updateProgress(p), w.setWrapperTransition(c), w.setWrapperTranslate(p), w.onTransitionStart(), w.animating || (w.animating = !0, w.wrapper.transitionEnd(function () {
                                    w && w.onTransitionEnd()
                                }))) : w.updateProgress(p), w.updateActiveIndex()
                            }
                            return void((!w.params.freeModeMomentum || a >= w.params.longSwipesMs) && (w.updateProgress(), w.updateActiveIndex()))
                        }
                        var v, y = 0, b = w.slidesSizesGrid[0];
                        for (v = 0; v < w.slidesGrid.length; v += w.params.slidesPerGroup)"undefined" != typeof w.slidesGrid[v + w.params.slidesPerGroup] ? n >= w.slidesGrid[v] && n < w.slidesGrid[v + w.params.slidesPerGroup] && (y = v, b = w.slidesGrid[v + w.params.slidesPerGroup] - w.slidesGrid[v]) : n >= w.slidesGrid[v] && (y = v, b = w.slidesGrid[w.slidesGrid.length - 1] - w.slidesGrid[w.slidesGrid.length - 2]);
                        var C = (n - w.slidesGrid[y]) / b;
                        if (a > w.params.longSwipesMs) {
                            if (!w.params.longSwipes)return void w.slideTo(w.activeIndex);
                            "next" === w.swipeDirection && (C >= w.params.longSwipesRatio ? w.slideTo(y + w.params.slidesPerGroup) : w.slideTo(y)), "prev" === w.swipeDirection && (C > 1 - w.params.longSwipesRatio ? w.slideTo(y + w.params.slidesPerGroup) : w.slideTo(y))
                        } else {
                            if (!w.params.shortSwipes)return void w.slideTo(w.activeIndex);
                            "next" === w.swipeDirection && w.slideTo(y + w.params.slidesPerGroup), "prev" === w.swipeDirection && w.slideTo(y)
                        }
                    }
                }, w._slideTo = function (e, t) {
                    return w.slideTo(e, t, !0, !0)
                }, w.slideTo = function (e, t, i, a) {
                    "undefined" == typeof i && (i = !0), "undefined" == typeof e && (e = 0), e < 0 && (e = 0), w.snapIndex = Math.floor(e / w.params.slidesPerGroup), w.snapIndex >= w.snapGrid.length && (w.snapIndex = w.snapGrid.length - 1);
                    var n = -w.snapGrid[w.snapIndex];
                    w.params.autoplay && w.autoplaying && (a || !w.params.autoplayDisableOnInteraction ? w.pauseAutoplay(t) : w.stopAutoplay()), w.updateProgress(n);
                    for (var o = 0; o < w.slidesGrid.length; o++)-Math.floor(100 * n) >= Math.floor(100 * w.slidesGrid[o]) && (e = o);
                    return !(!w.params.allowSwipeToNext && n < w.translate && n < w.minTranslate()) && (!(!w.params.allowSwipeToPrev && n > w.translate && n > w.maxTranslate() && (w.activeIndex || 0) !== e) && ("undefined" == typeof t && (t = w.params.speed), w.previousIndex = w.activeIndex || 0, w.activeIndex = e, w.rtl && -n === w.translate || !w.rtl && n === w.translate ? (w.params.autoHeight && w.updateAutoHeight(), w.updateClasses(), "slide" !== w.params.effect && w.setWrapperTranslate(n), !1) : (w.updateClasses(), w.onTransitionStart(i), 0 === t ? (w.setWrapperTranslate(n), w.setWrapperTransition(0), w.onTransitionEnd(i)) : (w.setWrapperTranslate(n), w.setWrapperTransition(t), w.animating || (w.animating = !0, w.wrapper.transitionEnd(function () {
                            w && w.onTransitionEnd(i)
                        }))), !0)))
                }, w.onTransitionStart = function (e) {
                    "undefined" == typeof e && (e = !0), w.params.autoHeight && w.updateAutoHeight(), w.lazy && w.lazy.onTransitionStart(), e && (w.emit("onTransitionStart", w), w.activeIndex !== w.previousIndex && (w.emit("onSlideChangeStart", w), w.activeIndex > w.previousIndex ? w.emit("onSlideNextStart", w) : w.emit("onSlidePrevStart", w)))
                }, w.onTransitionEnd = function (e) {
                    w.animating = !1, w.setWrapperTransition(0), "undefined" == typeof e && (e = !0), w.lazy && w.lazy.onTransitionEnd(), e && (w.emit("onTransitionEnd", w), w.activeIndex !== w.previousIndex && (w.emit("onSlideChangeEnd", w), w.activeIndex > w.previousIndex ? w.emit("onSlideNextEnd", w) : w.emit("onSlidePrevEnd", w))), w.params.hashnav && w.hashnav && w.hashnav.setHash()
                }, w.slideNext = function (e, t, i) {
                    if (w.params.loop) {
                        if (w.animating)return !1;
                        w.fixLoop();
                        w.container[0].clientLeft;
                        return w.slideTo(w.activeIndex + w.params.slidesPerGroup, t, e, i)
                    }
                    return w.slideTo(w.activeIndex + w.params.slidesPerGroup, t, e, i)
                }, w._slideNext = function (e) {
                    return w.slideNext(!0, e, !0)
                }, w.slidePrev = function (e, t, i) {
                    if (w.params.loop) {
                        if (w.animating)return !1;
                        w.fixLoop();
                        w.container[0].clientLeft;
                        return w.slideTo(w.activeIndex - 1, t, e, i)
                    }
                    return w.slideTo(w.activeIndex - 1, t, e, i)
                }, w._slidePrev = function (e) {
                    return w.slidePrev(!0, e, !0)
                }, w.slideReset = function (e, t, i) {
                    return w.slideTo(w.activeIndex, t, e)
                }, w.setWrapperTransition = function (e, t) {
                    w.wrapper.transition(e), "slide" !== w.params.effect && w.effects[w.params.effect] && w.effects[w.params.effect].setTransition(e), w.params.parallax && w.parallax && w.parallax.setTransition(e), w.params.scrollbar && w.scrollbar && w.scrollbar.setTransition(e), w.params.control && w.controller && w.controller.setTransition(e, t), w.emit("onSetTransition", w, e)
                }, w.setWrapperTranslate = function (e, t, i) {
                    var a = 0, o = 0, r = 0;
                    w.isHorizontal() ? a = w.rtl ? -e : e : o = e, w.params.roundLengths && (a = n(a), o = n(o)), w.params.virtualTranslate || (w.support.transforms3d ? w.wrapper.transform("translate3d(" + a + "px, " + o + "px, " + r + "px)") : w.wrapper.transform("translate(" + a + "px, " + o + "px)")), w.translate = w.isHorizontal() ? a : o;
                    var s, l = w.maxTranslate() - w.minTranslate();
                    s = 0 === l ? 0 : (e - w.minTranslate()) / l, s !== w.progress && w.updateProgress(e), t && w.updateActiveIndex(), "slide" !== w.params.effect && w.effects[w.params.effect] && w.effects[w.params.effect].setTranslate(w.translate), w.params.parallax && w.parallax && w.parallax.setTranslate(w.translate), w.params.scrollbar && w.scrollbar && w.scrollbar.setTranslate(w.translate), w.params.control && w.controller && w.controller.setTranslate(w.translate, i), w.emit("onSetTranslate", w, w.translate)
                }, w.getTranslate = function (e, t) {
                    var i, a, n, o;
                    return "undefined" == typeof t && (t = "x"), w.params.virtualTranslate ? w.rtl ? -w.translate : w.translate : (n = window.getComputedStyle(e, null), window.WebKitCSSMatrix ? (a = n.transform || n.webkitTransform, a.split(",").length > 6 && (a = a.split(", ").map(function (e) {
                        return e.replace(",", ".")
                    }).join(", ")), o = new window.WebKitCSSMatrix("none" === a ? "" : a)) : (o = n.MozTransform || n.OTransform || n.MsTransform || n.msTransform || n.transform || n.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), i = o.toString().split(",")), "x" === t && (a = window.WebKitCSSMatrix ? o.m41 : 16 === i.length ? parseFloat(i[12]) : parseFloat(i[4])), "y" === t && (a = window.WebKitCSSMatrix ? o.m42 : 16 === i.length ? parseFloat(i[13]) : parseFloat(i[5])), w.rtl && a && (a = -a), a || 0)
                }, w.getWrapperTranslate = function (e) {
                    return "undefined" == typeof e && (e = w.isHorizontal() ? "x" : "y"), w.getTranslate(w.wrapper[0], e)
                }, w.observers = [], w.initObservers = function () {
                    if (w.params.observeParents)for (var e = w.container.parents(), t = 0; t < e.length; t++)s(e[t]);
                    s(w.container[0], {childList: !1}), s(w.wrapper[0], {attributes: !1})
                }, w.disconnectObservers = function () {
                    for (var e = 0; e < w.observers.length; e++)w.observers[e].disconnect();
                    w.observers = []
                }, w.createLoop = function () {
                    w.wrapper.children("." + w.params.slideClass + "." + w.params.slideDuplicateClass).remove();
                    var e = w.wrapper.children("." + w.params.slideClass);
                    "auto" !== w.params.slidesPerView || w.params.loopedSlides || (w.params.loopedSlides = e.length), w.loopedSlides = parseInt(w.params.loopedSlides || w.params.slidesPerView, 10), w.loopedSlides = w.loopedSlides + w.params.loopAdditionalSlides, w.loopedSlides > e.length && (w.loopedSlides = e.length);
                    var i, a = [], n = [];
                    for (e.each(function (i, o) {
                        var r = t(this);
                        i < w.loopedSlides && n.push(o), i < e.length && i >= e.length - w.loopedSlides && a.push(o), r.attr("data-swiper-slide-index", i)
                    }), i = 0; i < n.length; i++)w.wrapper.append(t(n[i].cloneNode(!0)).addClass(w.params.slideDuplicateClass));
                    for (i = a.length - 1; i >= 0; i--)w.wrapper.prepend(t(a[i].cloneNode(!0)).addClass(w.params.slideDuplicateClass))
                }, w.destroyLoop = function () {
                    w.wrapper.children("." + w.params.slideClass + "." + w.params.slideDuplicateClass).remove(), w.slides.removeAttr("data-swiper-slide-index")
                }, w.fixLoop = function () {
                    var e;
                    w.activeIndex < w.loopedSlides ? (e = w.slides.length - 3 * w.loopedSlides + w.activeIndex, e += w.loopedSlides, w.slideTo(e, 0, !1, !0)) : ("auto" === w.params.slidesPerView && w.activeIndex >= 2 * w.loopedSlides || w.activeIndex > w.slides.length - 2 * w.params.slidesPerView) && (e = -w.slides.length + w.activeIndex + w.loopedSlides, e += w.loopedSlides, w.slideTo(e, 0, !1, !0))
                }, w.appendSlide = function (e) {
                    if (w.params.loop && w.destroyLoop(), "object" == typeof e && e.length)for (var t = 0; t < e.length; t++)e[t] && w.wrapper.append(e[t]); else w.wrapper.append(e);
                    w.params.loop && w.createLoop(), w.params.observer && w.support.observer || w.update(!0)
                }, w.prependSlide = function (e) {
                    w.params.loop && w.destroyLoop();
                    var t = w.activeIndex + 1;
                    if ("object" == typeof e && e.length) {
                        for (var i = 0; i < e.length; i++)e[i] && w.wrapper.prepend(e[i]);
                        t = w.activeIndex + e.length
                    } else w.wrapper.prepend(e);
                    w.params.loop && w.createLoop(), w.params.observer && w.support.observer || w.update(!0), w.slideTo(t, 0, !1)
                }, w.removeSlide = function (e) {
                    w.params.loop && (w.destroyLoop(), w.slides = w.wrapper.children("." + w.params.slideClass));
                    var t, i = w.activeIndex;
                    if ("object" == typeof e && e.length) {
                        for (var a = 0; a < e.length; a++)t = e[a], w.slides[t] && w.slides.eq(t).remove(), t < i && i--;
                        i = Math.max(i, 0)
                    } else t = e, w.slides[t] && w.slides.eq(t).remove(), t < i && i--, i = Math.max(i, 0);
                    w.params.loop && w.createLoop(), w.params.observer && w.support.observer || w.update(!0), w.params.loop ? w.slideTo(i + w.loopedSlides, 0, !1) : w.slideTo(i, 0, !1)
                }, w.removeAllSlides = function () {
                    for (var e = [], t = 0; t < w.slides.length; t++)e.push(t);
                    w.removeSlide(e)
                }, w.effects = {
                    fade: {
                        setTranslate: function () {
                            for (var e = 0; e < w.slides.length; e++) {
                                var t = w.slides.eq(e), i = t[0].swiperSlideOffset, a = -i;
                                w.params.virtualTranslate || (a -= w.translate);
                                var n = 0;
                                w.isHorizontal() || (n = a, a = 0);
                                var o = w.params.fade.crossFade ? Math.max(1 - Math.abs(t[0].progress), 0) : 1 + Math.min(Math.max(t[0].progress, -1), 0);
                                t.css({opacity: o}).transform("translate3d(" + a + "px, " + n + "px, 0px)")
                            }
                        }, setTransition: function (e) {
                            if (w.slides.transition(e), w.params.virtualTranslate && 0 !== e) {
                                var t = !1;
                                w.slides.transitionEnd(function () {
                                    if (!t && w) {
                                        t = !0, w.animating = !1;
                                        for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], i = 0; i < e.length; i++)w.wrapper.trigger(e[i])
                                    }
                                })
                            }
                        }
                    }, flip: {
                        setTranslate: function () {
                            for (var e = 0; e < w.slides.length; e++) {
                                var i = w.slides.eq(e), a = i[0].progress;
                                w.params.flip.limitRotation && (a = Math.max(Math.min(i[0].progress, 1), -1));
                                var n = i[0].swiperSlideOffset, o = -180 * a, r = o, s = 0, l = -n, c = 0;
                                if (w.isHorizontal() ? w.rtl && (r = -r) : (c = l, l = 0, s = -r, r = 0), i[0].style.zIndex = -Math.abs(Math.round(a)) + w.slides.length, w.params.flip.slideShadows) {
                                    var d = w.isHorizontal() ? i.find(".swiper-slide-shadow-left") : i.find(".swiper-slide-shadow-top"), p = w.isHorizontal() ? i.find(".swiper-slide-shadow-right") : i.find(".swiper-slide-shadow-bottom");
                                    0 === d.length && (d = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "left" : "top") + '"></div>'), i.append(d)), 0 === p.length && (p = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "right" : "bottom") + '"></div>'), i.append(p)), d.length && (d[0].style.opacity = Math.max(-a, 0)), p.length && (p[0].style.opacity = Math.max(a, 0))
                                }
                                i.transform("translate3d(" + l + "px, " + c + "px, 0px) rotateX(" + s + "deg) rotateY(" + r + "deg)")
                            }
                        }, setTransition: function (e) {
                            if (w.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), w.params.virtualTranslate && 0 !== e) {
                                var i = !1;
                                w.slides.eq(w.activeIndex).transitionEnd(function () {
                                    if (!i && w && t(this).hasClass(w.params.slideActiveClass)) {
                                        i = !0, w.animating = !1;
                                        for (var e = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], a = 0; a < e.length; a++)w.wrapper.trigger(e[a])
                                    }
                                })
                            }
                        }
                    }, cube: {
                        setTranslate: function () {
                            var e, i = 0;
                            w.params.cube.shadow && (w.isHorizontal() ? (e = w.wrapper.find(".swiper-cube-shadow"), 0 === e.length && (e = t('<div class="swiper-cube-shadow"></div>'), w.wrapper.append(e)), e.css({height: w.width + "px"})) : (e = w.container.find(".swiper-cube-shadow"), 0 === e.length && (e = t('<div class="swiper-cube-shadow"></div>'), w.container.append(e))));
                            for (var a = 0; a < w.slides.length; a++) {
                                var n = w.slides.eq(a), o = 90 * a, r = Math.floor(o / 360);
                                w.rtl && (o = -o, r = Math.floor(-o / 360));
                                var s = Math.max(Math.min(n[0].progress, 1), -1), l = 0, c = 0, d = 0;
                                a % 4 === 0 ? (l = 4 * -r * w.size, d = 0) : (a - 1) % 4 === 0 ? (l = 0, d = 4 * -r * w.size) : (a - 2) % 4 === 0 ? (l = w.size + 4 * r * w.size, d = w.size) : (a - 3) % 4 === 0 && (l = -w.size, d = 3 * w.size + 4 * w.size * r), w.rtl && (l = -l), w.isHorizontal() || (c = l, l = 0);
                                var p = "rotateX(" + (w.isHorizontal() ? 0 : -o) + "deg) rotateY(" + (w.isHorizontal() ? o : 0) + "deg) translate3d(" + l + "px, " + c + "px, " + d + "px)";
                                if (s <= 1 && s > -1 && (i = 90 * a + 90 * s, w.rtl && (i = 90 * -a - 90 * s)), n.transform(p), w.params.cube.slideShadows) {
                                    var u = w.isHorizontal() ? n.find(".swiper-slide-shadow-left") : n.find(".swiper-slide-shadow-top"), m = w.isHorizontal() ? n.find(".swiper-slide-shadow-right") : n.find(".swiper-slide-shadow-bottom");
                                    0 === u.length && (u = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "left" : "top") + '"></div>'), n.append(u)), 0 === m.length && (m = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "right" : "bottom") + '"></div>'), n.append(m)), u.length && (u[0].style.opacity = Math.max(-s, 0)), m.length && (m[0].style.opacity = Math.max(s, 0))
                                }
                            }
                            if (w.wrapper.css({
                                    "-webkit-transform-origin": "50% 50% -" + w.size / 2 + "px",
                                    "-moz-transform-origin": "50% 50% -" + w.size / 2 + "px",
                                    "-ms-transform-origin": "50% 50% -" + w.size / 2 + "px",
                                    "transform-origin": "50% 50% -" + w.size / 2 + "px"
                                }), w.params.cube.shadow)if (w.isHorizontal())e.transform("translate3d(0px, " + (w.width / 2 + w.params.cube.shadowOffset) + "px, " + -w.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + w.params.cube.shadowScale + ")"); else {
                                var h = Math.abs(i) - 90 * Math.floor(Math.abs(i) / 90), f = 1.5 - (Math.sin(2 * h * Math.PI / 360) / 2 + Math.cos(2 * h * Math.PI / 360) / 2), g = w.params.cube.shadowScale, v = w.params.cube.shadowScale / f, y = w.params.cube.shadowOffset;
                                e.transform("scale3d(" + g + ", 1, " + v + ") translate3d(0px, " + (w.height / 2 + y) + "px, " + -w.height / 2 / v + "px) rotateX(-90deg)")
                            }
                            var b = w.isSafari || w.isUiWebView ? -w.size / 2 : 0;
                            w.wrapper.transform("translate3d(0px,0," + b + "px) rotateX(" + (w.isHorizontal() ? 0 : i) + "deg) rotateY(" + (w.isHorizontal() ? -i : 0) + "deg)")
                        }, setTransition: function (e) {
                            w.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e), w.params.cube.shadow && !w.isHorizontal() && w.container.find(".swiper-cube-shadow").transition(e)
                        }
                    }, coverflow: {
                        setTranslate: function () {
                            for (var e = w.translate, i = w.isHorizontal() ? -e + w.width / 2 : -e + w.height / 2, a = w.isHorizontal() ? w.params.coverflow.rotate : -w.params.coverflow.rotate, n = w.params.coverflow.depth, o = 0, r = w.slides.length; o < r; o++) {
                                var s = w.slides.eq(o), l = w.slidesSizesGrid[o], c = s[0].swiperSlideOffset, d = (i - c - l / 2) / l * w.params.coverflow.modifier, p = w.isHorizontal() ? a * d : 0, u = w.isHorizontal() ? 0 : a * d, m = -n * Math.abs(d), h = w.isHorizontal() ? 0 : w.params.coverflow.stretch * d, f = w.isHorizontal() ? w.params.coverflow.stretch * d : 0;
                                Math.abs(f) < .001 && (f = 0), Math.abs(h) < .001 && (h = 0), Math.abs(m) < .001 && (m = 0), Math.abs(p) < .001 && (p = 0), Math.abs(u) < .001 && (u = 0);
                                var g = "translate3d(" + f + "px," + h + "px," + m + "px)  rotateX(" + u + "deg) rotateY(" + p + "deg)";
                                if (s.transform(g), s[0].style.zIndex = -Math.abs(Math.round(d)) + 1, w.params.coverflow.slideShadows) {
                                    var v = w.isHorizontal() ? s.find(".swiper-slide-shadow-left") : s.find(".swiper-slide-shadow-top"), y = w.isHorizontal() ? s.find(".swiper-slide-shadow-right") : s.find(".swiper-slide-shadow-bottom");
                                    0 === v.length && (v = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "left" : "top") + '"></div>'), s.append(v)), 0 === y.length && (y = t('<div class="swiper-slide-shadow-' + (w.isHorizontal() ? "right" : "bottom") + '"></div>'), s.append(y)), v.length && (v[0].style.opacity = d > 0 ? d : 0), y.length && (y[0].style.opacity = -d > 0 ? -d : 0)
                                }
                            }
                            if (w.browser.ie) {
                                var b = w.wrapper[0].style;
                                b.perspectiveOrigin = i + "px 50%"
                            }
                        }, setTransition: function (e) {
                            w.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)
                        }
                    }
                }, w.lazy = {
                    initialImageLoaded: !1, loadImageInSlide: function (e, i) {
                        if ("undefined" != typeof e && ("undefined" == typeof i && (i = !0), 0 !== w.slides.length)) {
                            var a = w.slides.eq(e), n = a.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");
                            !a.hasClass("swiper-lazy") || a.hasClass("swiper-lazy-loaded") || a.hasClass("swiper-lazy-loading") || (n = n.add(a[0])), 0 !== n.length && n.each(function () {
                                var e = t(this);
                                e.addClass("swiper-lazy-loading");
                                var n = e.attr("data-background"), o = e.attr("data-src"), r = e.attr("data-srcset");
                                w.loadImage(e[0], o || n, r, !1, function () {
                                    if (n ? (e.css("background-image", "url(" + n + ")"), e.removeAttr("data-background")) : (r && (e.attr("srcset", r), e.removeAttr("data-srcset")), o && (e.attr("src", o), e.removeAttr("data-src"))), e.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"), a.find(".swiper-lazy-preloader, .preloader").remove(), w.params.loop && i) {
                                        var t = a.attr("data-swiper-slide-index");
                                        if (a.hasClass(w.params.slideDuplicateClass)) {
                                            var s = w.wrapper.children('[data-swiper-slide-index="' + t + '"]:not(.' + w.params.slideDuplicateClass + ")");
                                            w.lazy.loadImageInSlide(s.index(), !1)
                                        } else {
                                            var l = w.wrapper.children("." + w.params.slideDuplicateClass + '[data-swiper-slide-index="' + t + '"]');
                                            w.lazy.loadImageInSlide(l.index(), !1)
                                        }
                                    }
                                    w.emit("onLazyImageReady", w, a[0], e[0])
                                }), w.emit("onLazyImageLoad", w, a[0], e[0])
                            })
                        }
                    }, load: function () {
                        var e;
                        if (w.params.watchSlidesVisibility)w.wrapper.children("." + w.params.slideVisibleClass).each(function () {
                            w.lazy.loadImageInSlide(t(this).index())
                        }); else if (w.params.slidesPerView > 1)for (e = w.activeIndex; e < w.activeIndex + w.params.slidesPerView; e++)w.slides[e] && w.lazy.loadImageInSlide(e); else w.lazy.loadImageInSlide(w.activeIndex);
                        if (w.params.lazyLoadingInPrevNext)if (w.params.slidesPerView > 1 || w.params.lazyLoadingInPrevNextAmount && w.params.lazyLoadingInPrevNextAmount > 1) {
                            var i = w.params.lazyLoadingInPrevNextAmount, a = w.params.slidesPerView, n = Math.min(w.activeIndex + a + Math.max(i, a), w.slides.length), o = Math.max(w.activeIndex - Math.max(a, i), 0);
                            for (e = w.activeIndex + w.params.slidesPerView; e < n; e++)w.slides[e] && w.lazy.loadImageInSlide(e);
                            for (e = o; e < w.activeIndex; e++)w.slides[e] && w.lazy.loadImageInSlide(e)
                        } else {
                            var r = w.wrapper.children("." + w.params.slideNextClass);
                            r.length > 0 && w.lazy.loadImageInSlide(r.index());
                            var s = w.wrapper.children("." + w.params.slidePrevClass);
                            s.length > 0 && w.lazy.loadImageInSlide(s.index())
                        }
                    }, onTransitionStart: function () {
                        w.params.lazyLoading && (w.params.lazyLoadingOnTransitionStart || !w.params.lazyLoadingOnTransitionStart && !w.lazy.initialImageLoaded) && w.lazy.load()
                    }, onTransitionEnd: function () {
                        w.params.lazyLoading && !w.params.lazyLoadingOnTransitionStart && w.lazy.load()
                    }
                }, w.scrollbar = {
                    isTouched: !1, setDragPosition: function (e) {
                        var t = w.scrollbar, i = w.isHorizontal() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX || e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY || e.clientY, a = i - t.track.offset()[w.isHorizontal() ? "left" : "top"] - t.dragSize / 2, n = -w.minTranslate() * t.moveDivider, o = -w.maxTranslate() * t.moveDivider;
                        a < n ? a = n : a > o && (a = o), a = -a / t.moveDivider, w.updateProgress(a), w.setWrapperTranslate(a, !0)
                    }, dragStart: function (e) {
                        var t = w.scrollbar;
                        t.isTouched = !0, e.preventDefault(), e.stopPropagation(), t.setDragPosition(e), clearTimeout(t.dragTimeout), t.track.transition(0), w.params.scrollbarHide && t.track.css("opacity", 1), w.wrapper.transition(100), t.drag.transition(100), w.emit("onScrollbarDragStart", w)
                    }, dragMove: function (e) {
                        var t = w.scrollbar;
                        t.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, t.setDragPosition(e), w.wrapper.transition(0), t.track.transition(0), t.drag.transition(0), w.emit("onScrollbarDragMove", w))
                    }, dragEnd: function (e) {
                        var t = w.scrollbar;
                        t.isTouched && (t.isTouched = !1, w.params.scrollbarHide && (clearTimeout(t.dragTimeout), t.dragTimeout = setTimeout(function () {
                            t.track.css("opacity", 0), t.track.transition(400)
                        }, 1e3)), w.emit("onScrollbarDragEnd", w), w.params.scrollbarSnapOnRelease && w.slideReset())
                    }, enableDraggable: function () {
                        var e = w.scrollbar, i = w.support.touch ? e.track : document;
                        t(e.track).on(w.touchEvents.start, e.dragStart), t(i).on(w.touchEvents.move, e.dragMove), t(i).on(w.touchEvents.end, e.dragEnd);
                    }, disableDraggable: function () {
                        var e = w.scrollbar, i = w.support.touch ? e.track : document;
                        t(e.track).off(w.touchEvents.start, e.dragStart), t(i).off(w.touchEvents.move, e.dragMove), t(i).off(w.touchEvents.end, e.dragEnd)
                    }, set: function () {
                        if (w.params.scrollbar) {
                            var e = w.scrollbar;
                            e.track = t(w.params.scrollbar), e.drag = e.track.find(".swiper-scrollbar-drag"), 0 === e.drag.length && (e.drag = t('<div class="swiper-scrollbar-drag"></div>'), e.track.append(e.drag)), e.drag[0].style.width = "", e.drag[0].style.height = "", e.trackSize = w.isHorizontal() ? e.track[0].offsetWidth : e.track[0].offsetHeight, e.divider = w.size / w.virtualSize, e.moveDivider = e.divider * (e.trackSize / w.size), e.dragSize = e.trackSize * e.divider, w.isHorizontal() ? e.drag[0].style.width = e.dragSize + "px" : e.drag[0].style.height = e.dragSize + "px", e.divider >= 1 ? e.track[0].style.display = "none" : e.track[0].style.display = "", w.params.scrollbarHide && (e.track[0].style.opacity = 0)
                        }
                    }, setTranslate: function () {
                        if (w.params.scrollbar) {
                            var e, t = w.scrollbar, i = (w.translate || 0, t.dragSize);
                            e = (t.trackSize - t.dragSize) * w.progress, w.rtl && w.isHorizontal() ? (e = -e, e > 0 ? (i = t.dragSize - e, e = 0) : -e + t.dragSize > t.trackSize && (i = t.trackSize + e)) : e < 0 ? (i = t.dragSize + e, e = 0) : e + t.dragSize > t.trackSize && (i = t.trackSize - e), w.isHorizontal() ? (w.support.transforms3d ? t.drag.transform("translate3d(" + e + "px, 0, 0)") : t.drag.transform("translateX(" + e + "px)"), t.drag[0].style.width = i + "px") : (w.support.transforms3d ? t.drag.transform("translate3d(0px, " + e + "px, 0)") : t.drag.transform("translateY(" + e + "px)"), t.drag[0].style.height = i + "px"), w.params.scrollbarHide && (clearTimeout(t.timeout), t.track[0].style.opacity = 1, t.timeout = setTimeout(function () {
                                t.track[0].style.opacity = 0, t.track.transition(400)
                            }, 1e3))
                        }
                    }, setTransition: function (e) {
                        w.params.scrollbar && w.scrollbar.drag.transition(e)
                    }
                }, w.controller = {
                    LinearSpline: function (e, t) {
                        this.x = e, this.y = t, this.lastIndex = e.length - 1;
                        var i, a;
                        this.x.length;
                        this.interpolate = function (e) {
                            return e ? (a = n(this.x, e), i = a - 1, (e - this.x[i]) * (this.y[a] - this.y[i]) / (this.x[a] - this.x[i]) + this.y[i]) : 0
                        };
                        var n = function () {
                            var e, t, i;
                            return function (a, n) {
                                for (t = -1, e = a.length; e - t > 1;)a[i = e + t >> 1] <= n ? t = i : e = i;
                                return e
                            }
                        }()
                    }, getInterpolateFunction: function (e) {
                        w.controller.spline || (w.controller.spline = w.params.loop ? new w.controller.LinearSpline(w.slidesGrid, e.slidesGrid) : new w.controller.LinearSpline(w.snapGrid, e.snapGrid))
                    }, setTranslate: function (e, t) {
                        function a(t) {
                            e = t.rtl && "horizontal" === t.params.direction ? -w.translate : w.translate, "slide" === w.params.controlBy && (w.controller.getInterpolateFunction(t), o = -w.controller.spline.interpolate(-e)), o && "container" !== w.params.controlBy || (n = (t.maxTranslate() - t.minTranslate()) / (w.maxTranslate() - w.minTranslate()), o = (e - w.minTranslate()) * n + t.minTranslate()), w.params.controlInverse && (o = t.maxTranslate() - o), t.updateProgress(o), t.setWrapperTranslate(o, !1, w), t.updateActiveIndex()
                        }

                        var n, o, r = w.params.control;
                        if (w.isArray(r))for (var s = 0; s < r.length; s++)r[s] !== t && r[s] instanceof i && a(r[s]); else r instanceof i && t !== r && a(r)
                    }, setTransition: function (e, t) {
                        function a(t) {
                            t.setWrapperTransition(e, w), 0 !== e && (t.onTransitionStart(), t.wrapper.transitionEnd(function () {
                                o && (t.params.loop && "slide" === w.params.controlBy && t.fixLoop(), t.onTransitionEnd())
                            }))
                        }

                        var n, o = w.params.control;
                        if (w.isArray(o))for (n = 0; n < o.length; n++)o[n] !== t && o[n] instanceof i && a(o[n]); else o instanceof i && t !== o && a(o)
                    }
                }, w.hashnav = {
                    init: function () {
                        if (w.params.hashnav) {
                            w.hashnav.initialized = !0;
                            var e = document.location.hash.replace("#", "");
                            if (e)for (var t = 0, i = 0, a = w.slides.length; i < a; i++) {
                                var n = w.slides.eq(i), o = n.attr("data-hash");
                                if (o === e && !n.hasClass(w.params.slideDuplicateClass)) {
                                    var r = n.index();
                                    w.slideTo(r, t, w.params.runCallbacksOnInit, !0)
                                }
                            }
                        }
                    }, setHash: function () {
                        w.hashnav.initialized && w.params.hashnav && (document.location.hash = w.slides.eq(w.activeIndex).attr("data-hash") || "")
                    }
                }, w.disableKeyboardControl = function () {
                    w.params.keyboardControl = !1, t(document).off("keydown", l)
                }, w.enableKeyboardControl = function () {
                    w.params.keyboardControl = !0, t(document).on("keydown", l)
                }, w.mousewheel = {
                    event: !1,
                    lastScrollTime: (new window.Date).getTime()
                }, w.params.mousewheelControl) {
                try {
                    new window.WheelEvent("wheel"), w.mousewheel.event = "wheel"
                } catch (z) {
                }
                w.mousewheel.event || void 0 === document.onmousewheel || (w.mousewheel.event = "mousewheel"), w.mousewheel.event || (w.mousewheel.event = "DOMMouseScroll")
            }
            w.disableMousewheelControl = function () {
                return !!w.mousewheel.event && (w.container.off(w.mousewheel.event, c), !0)
            }, w.enableMousewheelControl = function () {
                return !!w.mousewheel.event && (w.container.on(w.mousewheel.event, c), !0)
            }, w.parallax = {
                setTranslate: function () {
                    w.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
                        d(this, w.progress)
                    }), w.slides.each(function () {
                        var e = t(this);
                        e.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
                            var t = Math.min(Math.max(e[0].progress, -1), 1);
                            d(this, t)
                        })
                    })
                }, setTransition: function (e) {
                    "undefined" == typeof e && (e = w.params.speed), w.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function () {
                        var i = t(this), a = parseInt(i.attr("data-swiper-parallax-duration"), 10) || e;
                        0 === e && (a = 0), i.transition(a)
                    })
                }
            }, w._plugins = [];
            for (var N in w.plugins) {
                var L = w.plugins[N](w, w.params[N]);
                L && w._plugins.push(L)
            }
            return w.callPlugins = function (e) {
                for (var t = 0; t < w._plugins.length; t++)e in w._plugins[t] && w._plugins[t][e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            }, w.emitterEventListeners = {}, w.emit = function (e) {
                w.params[e] && w.params[e](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                var t;
                if (w.emitterEventListeners[e])for (t = 0; t < w.emitterEventListeners[e].length; t++)w.emitterEventListeners[e][t](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                w.callPlugins && w.callPlugins(e, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5])
            }, w.on = function (e, t) {
                return e = p(e), w.emitterEventListeners[e] || (w.emitterEventListeners[e] = []), w.emitterEventListeners[e].push(t), w
            }, w.off = function (e, t) {
                var i;
                if (e = p(e), "undefined" == typeof t)return w.emitterEventListeners[e] = [], w;
                if (w.emitterEventListeners[e] && 0 !== w.emitterEventListeners[e].length) {
                    for (i = 0; i < w.emitterEventListeners[e].length; i++)w.emitterEventListeners[e][i] === t && w.emitterEventListeners[e].splice(i, 1);
                    return w
                }
            }, w.once = function (e, t) {
                e = p(e);
                var i = function () {
                    t(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]), w.off(e, i)
                };
                return w.on(e, i), w
            }, w.a11y = {
                makeFocusable: function (e) {
                    return e.attr("tabIndex", "0"), e
                },
                addRole: function (e, t) {
                    return e.attr("role", t), e
                },
                addLabel: function (e, t) {
                    return e.attr("aria-label", t), e
                },
                disable: function (e) {
                    return e.attr("aria-disabled", !0), e
                },
                enable: function (e) {
                    return e.attr("aria-disabled", !1), e
                },
                onEnterKey: function (e) {
                    13 === e.keyCode && (t(e.target).is(w.params.nextButton) ? (w.onClickNext(e), w.isEnd ? w.a11y.notify(w.params.lastSlideMessage) : w.a11y.notify(w.params.nextSlideMessage)) : t(e.target).is(w.params.prevButton) && (w.onClickPrev(e), w.isBeginning ? w.a11y.notify(w.params.firstSlideMessage) : w.a11y.notify(w.params.prevSlideMessage)), t(e.target).is("." + w.params.bulletClass) && t(e.target)[0].click())
                },
                liveRegion: t('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
                notify: function (e) {
                    var t = w.a11y.liveRegion;
                    0 !== t.length && (t.html(""), t.html(e))
                },
                init: function () {
                    if (w.params.nextButton) {
                        var e = t(w.params.nextButton);
                        w.a11y.makeFocusable(e), w.a11y.addRole(e, "button"), w.a11y.addLabel(e, w.params.nextSlideMessage)
                    }
                    if (w.params.prevButton) {
                        var i = t(w.params.prevButton);
                        w.a11y.makeFocusable(i), w.a11y.addRole(i, "button"), w.a11y.addLabel(i, w.params.prevSlideMessage)
                    }
                    t(w.container).append(w.a11y.liveRegion)
                },
                initPagination: function () {
                    w.params.pagination && w.params.paginationClickable && w.bullets && w.bullets.length && w.bullets.each(function () {
                        var e = t(this);
                        w.a11y.makeFocusable(e), w.a11y.addRole(e, "button"), w.a11y.addLabel(e, w.params.paginationBulletMessage.replace(/{{index}}/, e.index() + 1))
                    })
                },
                destroy: function () {
                    w.a11y.liveRegion && w.a11y.liveRegion.length > 0 && w.a11y.liveRegion.remove()
                }
            }, w.init = function () {
                w.params.loop && w.createLoop(), w.updateContainerSize(), w.updateSlidesSize(), w.updatePagination(), w.params.scrollbar && w.scrollbar && (w.scrollbar.set(), w.params.scrollbarDraggable && w.scrollbar.enableDraggable()), "slide" !== w.params.effect && w.effects[w.params.effect] && (w.params.loop || w.updateProgress(), w.effects[w.params.effect].setTranslate()), w.params.loop ? w.slideTo(w.params.initialSlide + w.loopedSlides, 0, w.params.runCallbacksOnInit) : (w.slideTo(w.params.initialSlide, 0, w.params.runCallbacksOnInit), 0 === w.params.initialSlide && (w.parallax && w.params.parallax && w.parallax.setTranslate(), w.lazy && w.params.lazyLoading && (w.lazy.load(), w.lazy.initialImageLoaded = !0))), w.attachEvents(), w.params.observer && w.support.observer && w.initObservers(), w.params.preloadImages && !w.params.lazyLoading && w.preloadImages(), w.params.autoplay && w.startAutoplay(), w.params.keyboardControl && w.enableKeyboardControl && w.enableKeyboardControl(), w.params.mousewheelControl && w.enableMousewheelControl && w.enableMousewheelControl(), w.params.hashnav && w.hashnav && w.hashnav.init(), w.params.a11y && w.a11y && w.a11y.init(), w.emit("onInit", w)
            }, w.cleanupStyles = function () {
                w.container.removeClass(w.classNames.join(" ")).removeAttr("style"), w.wrapper.removeAttr("style"), w.slides && w.slides.length && w.slides.removeClass([w.params.slideVisibleClass, w.params.slideActiveClass, w.params.slideNextClass, w.params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"), w.paginationContainer && w.paginationContainer.length && w.paginationContainer.removeClass(w.params.paginationHiddenClass), w.bullets && w.bullets.length && w.bullets.removeClass(w.params.bulletActiveClass), w.params.prevButton && t(w.params.prevButton).removeClass(w.params.buttonDisabledClass), w.params.nextButton && t(w.params.nextButton).removeClass(w.params.buttonDisabledClass), w.params.scrollbar && w.scrollbar && (w.scrollbar.track && w.scrollbar.track.length && w.scrollbar.track.removeAttr("style"), w.scrollbar.drag && w.scrollbar.drag.length && w.scrollbar.drag.removeAttr("style"))
            }, w.destroy = function (e, t) {
                w.detachEvents(), w.stopAutoplay(), w.params.scrollbar && w.scrollbar && w.params.scrollbarDraggable && w.scrollbar.disableDraggable(), w.params.loop && w.destroyLoop(), t && w.cleanupStyles(), w.disconnectObservers(), w.params.keyboardControl && w.disableKeyboardControl && w.disableKeyboardControl(), w.params.mousewheelControl && w.disableMousewheelControl && w.disableMousewheelControl(), w.params.a11y && w.a11y && w.a11y.destroy(), w.emit("onDestroy"), e !== !1 && (w = null)
            }, w.init(), w
        }
    };
    i.prototype = {
        isSafari: function () {
            var e = navigator.userAgent.toLowerCase();
            return e.indexOf("safari") >= 0 && e.indexOf("chrome") < 0 && e.indexOf("android") < 0
        }(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function (e) {
            return "[object Array]" === Object.prototype.toString.apply(e)
        },
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1
        },
        device: function () {
            var e = navigator.userAgent, t = e.match(/(Android);?[\s\/]+([\d.]+)?/), i = e.match(/(iPad).*OS\s([\d_]+)/), a = e.match(/(iPod)(.*OS\s([\d_]+))?/), n = !i && e.match(/(iPhone\sOS)\s([\d_]+)/);
            return {ios: i || n || a, android: t}
        }(),
        support: {
            touch: window.Modernizr && Modernizr.touch === !0 || function () {
                return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
            }(), transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function () {
                var e = document.createElement("div").style;
                return "webkitPerspective" in e || "MozPerspective" in e || "OPerspective" in e || "MsPerspective" in e || "perspective" in e
            }(), flexbox: function () {
                for (var e = document.createElement("div").style, t = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), i = 0; i < t.length; i++)if (t[i] in e)return !0
            }(), observer: function () {
                return "MutationObserver" in window || "WebkitMutationObserver" in window
            }()
        },
        plugins: {}
    };
    for (var a = ["jQuery", "Zepto", "Dom7"], n = 0; n < a.length; n++)window[a[n]] && e(window[a[n]]);
    var o;
    o = "undefined" == typeof Dom7 ? window.Dom7 || window.Zepto || window.jQuery : Dom7, o && ("transitionEnd" in o.fn || (o.fn.transitionEnd = function (e) {
        function t(o) {
            if (o.target === this)for (e.call(this, o), i = 0; i < a.length; i++)n.off(a[i], t)
        }

        var i, a = ["webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd"], n = this;
        if (e)for (i = 0; i < a.length; i++)n.on(a[i], t);
        return this
    }), "transform" in o.fn || (o.fn.transform = function (e) {
        for (var t = 0; t < this.length; t++) {
            var i = this[t].style;
            i.webkitTransform = i.MsTransform = i.msTransform = i.MozTransform = i.OTransform = i.transform = e
        }
        return this
    }), "transition" in o.fn || (o.fn.transition = function (e) {
        "string" != typeof e && (e += "ms");
        for (var t = 0; t < this.length; t++) {
            var i = this[t].style;
            i.webkitTransitionDuration = i.MsTransitionDuration = i.msTransitionDuration = i.MozTransitionDuration = i.OTransitionDuration = i.transitionDuration = e
        }
        return this
    })), window.Swiper = i
}(), "undefined" != typeof module ? module.exports = window.Swiper : "function" == typeof define && define.amd && define("swiper", [], function () {
    "use strict";
    return window.Swiper
}), define("utils", [], function () {
    function e(e) {
        for (var t = "", i = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], a = 0; a < e; a++) {
            var n = Math.round(Math.random() * (i.length - 1));
            t += i[n]
        }
        return t
    }

    var t = {};
    return t.jsDateDiff = function (e) {
        var t, i, a, n, o, r, s = parseInt((new Date).getTime() / 1e3);
        t = s - e;
        var l = "";
        return t <= 0 ? "1秒前" : (i = parseInt(t / 60), r = parseInt(t / 3600), a = parseInt(t / 86400), n = parseInt(t / 2592e3), o = parseInt(t / 31536e3), t < 60 ? l + t + "秒前" : i < 60 ? l + i + "分钟前" : r < 24 ? l + r + "小时前" : a < 30 ? l + a + "天前" : n < 12 ? l + n + "月前" : l + o + "年前")
    }, t.loadingMessage = function (e, t) {
        e || (e = "数据加载中");
        var i = '<div class="qsc-toast toast-loading" id="toast-loading" style="display: block;"><div class="toast-backdrop"></div><div class="toast-dialog"><div class="toast-content"><span><div class="loading-icon"><div class="loading-icon-leaf loading-icon-leaf_0"></div><div class="loading-icon-leaf loading-icon-leaf_1"></div><div class="loading-icon-leaf loading-icon-leaf_2"></div><div class="loading-icon-leaf loading-icon-leaf_3"></div><div class="loading-icon-leaf loading-icon-leaf_4"></div><div class="loading-icon-leaf loading-icon-leaf_5"></div><div class="loading-icon-leaf loading-icon-leaf_6"></div><div class="loading-icon-leaf loading-icon-leaf_7"></div><div class="loading-icon-leaf loading-icon-leaf_8"></div><div class="loading-icon-leaf loading-icon-leaf_9"></div><div class="loading-icon-leaf loading-icon-leaf_10"></div><div class="loading-icon-leaf loading-icon-leaf_11"></div></div><span class="loadingMsg">' + e + "</span></span></div></div></div>";
        t ? ($("#toast-loading").remove(), $("body").append(i)) : $("#toast-loading").remove()
    }, t.showLoading = function (e) {
        e || (e = "加载中");
        var t = '<div class="qsc-toast toast-loading" id="toast-loading" style="display: block;z-index:2000"><div class="toast-backdrop"></div><div class="toast-dialog"><div class="toast-content"><span><div class="loading-icon"><div class="loading-icon-leaf loading-icon-leaf_0"></div><div class="loading-icon-leaf loading-icon-leaf_1"></div><div class="loading-icon-leaf loading-icon-leaf_2"></div><div class="loading-icon-leaf loading-icon-leaf_3"></div><div class="loading-icon-leaf loading-icon-leaf_4"></div><div class="loading-icon-leaf loading-icon-leaf_5"></div><div class="loading-icon-leaf loading-icon-leaf_6"></div><div class="loading-icon-leaf loading-icon-leaf_7"></div><div class="loading-icon-leaf loading-icon-leaf_8"></div><div class="loading-icon-leaf loading-icon-leaf_9"></div><div class="loading-icon-leaf loading-icon-leaf_10"></div><div class="loading-icon-leaf loading-icon-leaf_11"></div></div><span class="loadingMsg">' + e + "</span></span></div></div></div>";
        $("#toast-loading").length > 0 ? ($("#toast-loading").find(".loadingMsg").text(e), $("#toast-loading").show()) : $("body").append(t)
    }, t.hideLoading = function () {
        $("#toast-loading").length > 0 && $("#toast-loading").hide()
    }, t.is_weixin = function () {
        var e = navigator.userAgent.toLowerCase();
        return "micromessenger" == e.match(/MicroMessenger/i)
    }, t.alertMessage = function (e, t) {
        t || (t = 2e3), dialog = '<div class="qsc-toast" id="toast-default" style="display:block;"><div class="toast-backdrop"></div><div class="toast-dialog"><div class="toast-content"><span>' + e + "</span></div></div></div>", $(".qsc-toast:visible").length && $(".qsc-toast:visible").remove(), $("body").append(dialog), setTimeout(function () {
            $("#toast-default").remove()
        }, t)
    }, t.updateFancybox = function () {
        $("a.fancybox").fancybox({
            openEffect: "none",
            closeEffect: "none",
            prevEffect: "none",
            nextEffect: "none",
            padding: 0
        })
    }, t.getRequestParams = function () {
        var e = location.search, t = new Object;
        if (e.indexOf("?") != -1)for (var i = e.substr(1), a = i.split("&"), n = 0; n < a.length; n++)t[a[n].split("=")[0]] = a[n].split("=")[1];
        return t
    }, t.getShareTimestamp = function () {
        var t = "", i = new Date;
        t += i.getFullYear();
        var a = i.getMonth() + 1;
        t += a < 10 ? "0" + a : a;
        var n = i.getDate();
        t += n < 10 ? "0" + n : n;
        var o = i.getHours();
        t += o < 10 ? "0" + o : o;
        var r = i.getMinutes();
        t += r < 10 ? "0" + r : r;
        var s = i.getSeconds();
        t += s < 10 ? "0" + s : s;
        var l = i.getMilliseconds();
        return t += l < 100 ? l < 10 ? "00" + l : "0" + l : l, t += e(8)
    }, t
}), function (e, t) {
    $window = e(t), e.fn.lazyload = function (i) {
        function a() {
            var t = 0;
            n.each(function () {
                var i = e(this);
                if ((!o.skip_invisible || i.is(":visible")) && !e.abovethetop(this, o) && !e.leftofbegin(this, o))if (e.belowthefold(this, o) || e.rightoffold(this, o)) {
                    if (++t > o.failure_limit)return !1
                } else i.trigger("appear")
            })
        }

        var n = this, o = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: t,
            data_attribute: "original",
            skip_invisible: !0,
            appear: null,
            load: null
        };
        return i && (void 0 !== i.failurelimit && (i.failure_limit = i.failurelimit, delete i.failurelimit), void 0 !== i.effectspeed && (i.effect_speed = i.effectspeed, delete i.effectspeed), e.extend(o, i)), $container = void 0 === o.container || o.container === t ? $window : e(o.container), 0 === o.event.indexOf("scroll") && $container.bind(o.event, function (e) {
            return a()
        }), this.each(function () {
            var t = this, i = e(t);
            t.loaded = !1, i.one("appear", function () {
                if (!this.loaded) {
                    if (o.appear) {
                        var a = n.length;
                        o.appear.call(t, a, o)
                    }
                    e("<img />").bind("load", function () {
                        i.hide().attr("src", i.data(o.data_attribute))[o.effect](o.effect_speed), t.loaded = !0;
                        var a = e.grep(n, function (e) {
                            return !e.loaded
                        });
                        if (n = e(a), o.load) {
                            var r = n.length;
                            o.load.call(t, r, o)
                        }
                    }).attr("src", i.data(o.data_attribute))
                }
            }), 0 !== o.event.indexOf("scroll") && i.bind(o.event, function (e) {
                t.loaded || i.trigger("appear")
            })
        }), $window.bind("resize", function (e) {
            a()
        }), a(), this
    }, e.belowthefold = function (i, a) {
        var n;
        return n = void 0 === a.container || a.container === t ? $window.height() + $window.scrollTop() : $container.offset().top + $container.height(), n <= e(i).offset().top - a.threshold
    }, e.rightoffold = function (i, a) {
        var n;
        return n = void 0 === a.container || a.container === t ? $window.width() + $window.scrollLeft() : $container.offset().left + $container.width(), n <= e(i).offset().left - a.threshold
    }, e.abovethetop = function (i, a) {
        var n;
        return n = void 0 === a.container || a.container === t ? $window.scrollTop() : $container.offset().top, n >= e(i).offset().top + a.threshold + e(i).height()
    }, e.leftofbegin = function (i, a) {
        var n;
        return n = void 0 === a.container || a.container === t ? $window.scrollLeft() : $container.offset().left, n >= e(i).offset().left + a.threshold + e(i).width()
    }, e.inviewport = function (t, i) {
        return !(e.rightofscreen(t, i) || e.leftofscreen(t, i) || e.belowthefold(t, i) || e.abovethetop(t, i))
    }, e.extend(e.expr[":"], {
        "below-the-fold": function (i) {
            return e.belowthefold(i, {threshold: 0, container: t})
        }, "above-the-top": function (i) {
            return !e.belowthefold(i, {threshold: 0, container: t})
        }, "right-of-screen": function (i) {
            return e.rightoffold(i, {threshold: 0, container: t})
        }, "left-of-screen": function (i) {
            return !e.rightoffold(i, {threshold: 0, container: t})
        }, "in-viewport": function (i) {
            return !e.inviewport(i, {threshold: 0, container: t})
        }, "above-the-fold": function (i) {
            return !e.belowthefold(i, {threshold: 0, container: t})
        }, "right-of-fold": function (i) {
            return e.rightoffold(i, {threshold: 0, container: t})
        }, "left-of-fold": function (i) {
            return !e.rightoffold(i, {threshold: 0, container: t})
        }
    })
}(jQuery, window), define("lazyload", [], function () {
}), define("qscScroll_timestamp", [], function () {
    function e() {
        var e, t, i, a = 0, n = !1;
        this.config = function (i) {
            e = i.wrapper, t = i.onNeedLoad
        }, this.run = function () {
            i = setInterval(function () {
                if (!n && "none" != e.css("display")) {
                    var o = e.scrollTop(), r = e[0].scrollHeight, s = $(window).height(), l = r - o - s;
                    l < 300 && (clearInterval(i), n = !1, t()), 0 == a && (a = 1e3)
                }
            }, a)
        }, this.stop = function () {
            clearInterval(i)
        }
    }

    return e
}), function () {
    "use strict";
    function e(t, a) {
        function n(e, t) {
            return function () {
                return e.apply(t, arguments)
            }
        }

        var o;
        if (a = a || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = a.touchBoundary || 10, this.layer = t, this.tapDelay = a.tapDelay || 200, this.tapTimeout = a.tapTimeout || 700, !e.notNeeded(t)) {
            for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], s = this, l = 0, c = r.length; l < c; l++)s[r[l]] = n(s[r[l]], s);
            i && (t.addEventListener("mouseover", this.onMouse, !0), t.addEventListener("mousedown", this.onMouse, !0), t.addEventListener("mouseup", this.onMouse, !0)), t.addEventListener("click", this.onClick, !0), t.addEventListener("touchstart", this.onTouchStart, !1), t.addEventListener("touchmove", this.onTouchMove, !1), t.addEventListener("touchend", this.onTouchEnd, !1), t.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (t.removeEventListener = function (e, i, a) {
                var n = Node.prototype.removeEventListener;
                "click" === e ? n.call(t, e, i.hijacked || i, a) : n.call(t, e, i, a)
            }, t.addEventListener = function (e, i, a) {
                var n = Node.prototype.addEventListener;
                "click" === e ? n.call(t, e, i.hijacked || (i.hijacked = function (e) {
                        e.propagationStopped || i(e)
                    }), a) : n.call(t, e, i, a)
            }), "function" == typeof t.onclick && (o = t.onclick, t.addEventListener("click", function (e) {
                o(e)
            }, !1), t.onclick = null)
        }
    }

    var t = navigator.userAgent.indexOf("Windows Phone") >= 0, i = navigator.userAgent.indexOf("Android") > 0 && !t, a = /iP(ad|hone|od)/.test(navigator.userAgent) && !t, n = a && /OS 4_\d(_\d)?/.test(navigator.userAgent), o = a && /OS [6-7]_\d/.test(navigator.userAgent), r = navigator.userAgent.indexOf("BB10") > 0;
    e.prototype.needsClick = function (e) {
        switch (e.nodeName.toLowerCase()) {
            case"button":
            case"select":
            case"textarea":
                if (e.disabled)return !0;
                break;
            case"input":
                if (a && "file" === e.type || e.disabled)return !0;
                break;
            case"label":
            case"iframe":
            case"video":
                return !0
        }
        return /\bneedsclick\b/.test(e.className)
    }, e.prototype.needsFocus = function (e) {
        switch (e.nodeName.toLowerCase()) {
            case"textarea":
                return !0;
            case"select":
                return !i;
            case"input":
                switch (e.type) {
                    case"button":
                    case"checkbox":
                    case"file":
                    case"image":
                    case"radio":
                    case"submit":
                        return !1
                }
                return !e.disabled && !e.readOnly;
            default:
                return /\bneedsfocus\b/.test(e.className)
        }
    }, e.prototype.sendClick = function (e, t) {
        var i, a;
        document.activeElement && document.activeElement !== e && document.activeElement.blur(), a = t.changedTouches[0], i = document.createEvent("MouseEvents"), i.initMouseEvent(this.determineEventType(e), !0, !0, window, 1, a.screenX, a.screenY, a.clientX, a.clientY, !1, !1, !1, !1, 0, null), i.forwardedTouchEvent = !0, e.dispatchEvent(i)
    }, e.prototype.determineEventType = function (e) {
        return i && "select" === e.tagName.toLowerCase() ? "mousedown" : "click"
    }, e.prototype.focus = function (e) {
        var t;
        a && e.setSelectionRange && 0 !== e.type.indexOf("date") && "time" !== e.type && "month" !== e.type ? (t = e.value.length, e.setSelectionRange(t, t)) : e.focus()
    }, e.prototype.updateScrollParent = function (e) {
        var t, i;
        if (t = e.fastClickScrollParent, !t || !t.contains(e)) {
            i = e;
            do {
                if (i.scrollHeight > i.offsetHeight) {
                    t = i, e.fastClickScrollParent = i;
                    break
                }
                i = i.parentElement
            } while (i)
        }
        t && (t.fastClickLastScrollTop = t.scrollTop)
    }, e.prototype.getTargetElementFromEventTarget = function (e) {
        return e.nodeType === Node.TEXT_NODE ? e.parentNode : e
    }, e.prototype.onTouchStart = function (e) {
        var t, i, o;
        if (e.targetTouches.length > 1)return !0;
        if (t = this.getTargetElementFromEventTarget(e.target), i = e.targetTouches[0], a) {
            if (o = window.getSelection(), o.rangeCount && !o.isCollapsed)return !0;
            if (!n) {
                if (i.identifier && i.identifier === this.lastTouchIdentifier)return e.preventDefault(), !1;
                this.lastTouchIdentifier = i.identifier, this.updateScrollParent(t)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = e.timeStamp, this.targetElement = t, this.touchStartX = i.pageX, this.touchStartY = i.pageY, e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(), !0
    }, e.prototype.touchHasMoved = function (e) {
        var t = e.changedTouches[0], i = this.touchBoundary;
        return Math.abs(t.pageX - this.touchStartX) > i || Math.abs(t.pageY - this.touchStartY) > i
    }, e.prototype.onTouchMove = function (e) {
        return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(e.target) || this.touchHasMoved(e)) && (this.trackingClick = !1, this.targetElement = null), !0)
    }, e.prototype.findControl = function (e) {
        return void 0 !== e.control ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, e.prototype.onTouchEnd = function (e) {
        var t, r, s, l, c, d = this.targetElement;
        if (!this.trackingClick)return !0;
        if (e.timeStamp - this.lastClickTime < this.tapDelay)return this.cancelNextClick = !0, !0;
        if (e.timeStamp - this.trackingClickStart > this.tapTimeout)return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = e.timeStamp, r = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, o && (c = e.changedTouches[0], d = document.elementFromPoint(c.pageX - window.pageXOffset, c.pageY - window.pageYOffset) || d, d.fastClickScrollParent = this.targetElement.fastClickScrollParent), s = d.tagName.toLowerCase(), "label" === s) {
            if (t = this.findControl(d)) {
                if (this.focus(d), i)return !1;
                d = t
            }
        } else if (this.needsFocus(d))return e.timeStamp - r > 100 || a && window.top !== window && "input" === s ? (this.targetElement = null, !1) : (this.focus(d), this.sendClick(d, e), n && "select" === s || (this.targetElement = null, e.preventDefault()), !1);
        return !(!a || n || (l = d.fastClickScrollParent, !l || l.fastClickLastScrollTop === l.scrollTop)) || (this.needsClick(d) || (e.preventDefault(), this.sendClick(d, e)), !1)
    }, e.prototype.onTouchCancel = function () {
        this.trackingClick = !1, this.targetElement = null
    }, e.prototype.onMouse = function (e) {
        return !this.targetElement || (!!e.forwardedTouchEvent || (!e.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0, e.stopPropagation(), e.preventDefault(), !1))))
    }, e.prototype.onClick = function (e) {
        var t;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === e.target.type && 0 === e.detail || (t = this.onMouse(e), t || (this.targetElement = null), t)
    }, e.prototype.destroy = function () {
        var e = this.layer;
        i && (e.removeEventListener("mouseover", this.onMouse, !0), e.removeEventListener("mousedown", this.onMouse, !0), e.removeEventListener("mouseup", this.onMouse, !0)), e.removeEventListener("click", this.onClick, !0), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1), e.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, e.notNeeded = function (e) {
        var t, a, n, o;
        if ("undefined" == typeof window.ontouchstart)return !0;
        if (a = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!i)return !0;
            if (t = document.querySelector("meta[name=viewport]")) {
                if (t.content.indexOf("user-scalable=no") !== -1)return !0;
                if (a > 31 && document.documentElement.scrollWidth <= window.outerWidth)return !0
            }
        }
        if (r && (n = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), n[1] >= 10 && n[2] >= 3 && (t = document.querySelector("meta[name=viewport]")))) {
            if (t.content.indexOf("user-scalable=no") !== -1)return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)return !0
        }
        return "none" === e.style.msTouchAction || "manipulation" === e.style.touchAction || (o = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], !!(o >= 27 && (t = document.querySelector("meta[name=viewport]"), t && (t.content.indexOf("user-scalable=no") !== -1 || document.documentElement.scrollWidth <= window.outerWidth))) || ("none" === e.style.touchAction || "manipulation" === e.style.touchAction))
    }, e.attach = function (t, i) {
        return new e(t, i)
    }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define("fastclick", [], function () {
        return e
    }) : "undefined" != typeof module && module.exports ? (module.exports = e.attach, module.exports.FastClick = e) : window.FastClick = e
}(), define("shareMC", ["juicer", "utils"], function (e, t) {
    function i(e) {
        var i = window.auth.user_uuid, n = {};
        3360 == window.auth.category_id ? n.title = e.project.name + " - 轻松筹慈善募捐" : n.title = e.project.name + " - 轻松筹", n.imgUrl = e.project.pic, n.desc = e.project.introduction, n.link = e.project.url, wx.config({
            debug: !1,
            appId: window.auth.wechat.appId,
            timestamp: window.auth.wechat.timestamp,
            nonceStr: window.auth.wechat.nonceStr,
            signature: window.auth.wechat.signature,
            jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
        }), wx.ready(function () {
            wx.onMenuShareAppMessage({
                title: n.title,
                desc: n.desc,
                link: n.link + "?uuid=" + i + "&platform=wechat&shareto=2&timestamp=" + t.getShareTimestamp(),
                imgUrl: n.imgUrl,
                type: "link",
                dataUrl: "",
                success: function () {
                    var e = n.link + "?uuid=" + i + "&platform=wechat&shareto=2";
                    e = e.replace("project/index", "project/share"), a(e, {success: !0})
                }
            }), wx.onMenuShareTimeline({
                title: n.title,
                desc: n.desc,
                link: n.link + "?uuid=" + i + "&platform=wechat&shareto=1&timestamp=" + t.getShareTimestamp(),
                imgUrl: n.imgUrl,
                success: function () {
                    var e = n.link + "?uuid=" + i + "&platform=wechat&shareto=1";
                    e = e.replace("project/index", "project/share"), a(e, {success: !0})
                }
            }), wx.onMenuShareQQ({
                title: n.title,
                desc: n.desc,
                link: n.link + "?uuid=" + i + "&platform=wechat&shareto=5&timestamp=" + t.getShareTimestamp(),
                imgUrl: n.imgUrl,
                success: function () {
                    var e = n.link + "?uuid=" + i + "&platform=wechat&shareto=5";
                    e = e.replace("project/index", "project/share"), a(e, {success: !0})
                }
            }), wx.onMenuShareWeibo({
                title: n.title,
                desc: n.desc,
                link: n.link + "?uuid=" + i + "&platform=wechat&shareto=6&timestamp=" + t.getShareTimestamp(),
                imgUrl: n.imgUrl,
                success: function () {
                    var e = n.link + "?uuid=" + i + "&platform=wechat&shareto=6";
                    e = e.replace("project/index", "project/share"), a(e, {success: !0})
                }
            })
        }), wx.error(function (e) {
            WeixinJSBridge.log(e.err_msg)
        })
    }

    function a(e, t) {
        $.ajax({
            type: "POST", url: e, data: t, dataType: "json", success: function (e) {
            }, error: function () {
            }
        })
    }

    function n() {
        $(".h5-share-weibo, .h5-share-qq, .h5-share-qzone, .h5-share-qqweibo").on("click", function (e) {
            $("#project-share").modal("hide");
            var i = window.auth.user_uuid, a = {}, n = Math.round((new Date).getTime());
            a.token = i + "-" + n, a.from = "project_index", a.shareto = $(this).data("id"), a.platform = "mobile", a.prjuuid = window.auth.project_uuid, t.showLoading("跳转中");
            var o = {token: a.token, platform: a.platform, shareto: String(a.shareto), from: a.from};
            $.ajax({
                type: "POST",
                url: "http://project.qschou.com/share/" + window.auth.project_uuid,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(o),
                xhrFields: {withCredentials: !0},
                crossDomain: !0,
                success: function (e) {
                    $("#toast-loading").hide(), e.data ? location.href = e.data.arguments[0] : t.alertMessage("系统繁忙,请稍后重试")
                },
                error: function (e) {
                    $("#toast-loading").hide(), t.alertMessage("系统繁忙,请稍后重试")
                }
            })
        }), $(".h5-share-qrcode").on("click", function (e) {
            e.stopPropagation(), e.preventDefault(), o(), $("#project-share").modal("hide")
        })
    }

    function o() {
        t.showLoading("生成图片中"), $.ajax({
            type: "GET",
            url: "http://project.qschou.com/screenshot/" + window.auth.project_uuid,
            xhrFields: {withCredentials: !0},
            crossDomain: !0,
            success: function (e) {
                if (t.hideLoading(), e.error)return void t.alertMessage("系统繁忙,请稍后重试");
                if (e.data.url) {
                    var i = window.navigator.userAgent.toLowerCase();
                    "micromessenger" == i.match(/MicroMessenger/i) ? wx.previewImage({
                        current: 0,
                        urls: [e.data.url]
                    }) : window.location.href = e.data.url;
                } else {
                    if (s++, 3 == s)return t.hideLoading(), t.alertMessage("系统繁忙,请稍后重试"), s = 0, !1;
                    var a = 5, n = setInterval(function () {
                        a--, t.showLoading("生成图片中 " + a), 0 == a && (clearInterval(n), o())
                    }, 1e3)
                }
            },
            complete: function () {
            },
            error: function () {
                t.hideLoading(), t.alertMessage("系统繁忙,请稍后重试")
            }
        })
    }

    var r = {}, s = 0;
    return r.init = function (e) {
        $("#shareReplaceDiv").replaceWith(juicer.templates["share.juicer"](e.data)), t.is_weixin() && i(e), n(e)
    }, r
}), define("footerMC", ["juicer", "utils"], function (e, t) {
    function i() {
        $("body").on("setFollowRemoteBack", function (e, i) {
            if (1 == i.data) {
                var a = $("#btn-follow").find("small").text();
                a = "" == a ? 0 : a, window.auth.project_follow ? (a--, a <= 0 && (a = 0), $("#btn-follow").find("small").text(a), window.auth.project_follow = !1, $(".gyl-icon-follow").removeClass("active"), t.alertMessage("取消关注成功", 1e3)) : (a++, $("#btn-follow").find("small").text(a), window.auth.project_follow = !0, $(".gyl-icon-follow").addClass("active"), t.alertMessage("关注成功", 1e3))
            } else t.alertMessage("操作失败")
        })
    }

    var a = {};
    return a.init = function (e) {
        $("#footerReplaceDiv").replaceWith(juicer.templates["footer.juicer"](e.data)), window.auth.project_follow && $(".gyl-icon-follow").addClass("active"), e.data.project.stopped > 0 && ($(".gyl-btn-support").addClass("disabled"), $(".gyl-btn-support span").html("筹款结束")), 8192 != e.data.project.state && ($(".gyl-btn-support").addClass("disabled"), $(".gyl-btn-support span").html("筹款结束")), $("#btn-share").click(function () {
            $("#project-share").modal("show")
        }), $("#btn-follow").on("click", function (e) {
            event.stopPropagation(), event.preventDefault(), window.auth.user_uuid ? $("body").trigger("setFollow") : t.alertMessage("请先登录")
        }), i()
    }, a
}), define("manageMC", ["juicer", "utils"], function (e, t) {
    function i() {
        $("body").on("deleteProjectRemoteBack", function (e, i) {
            "" == i.error ? window.location.href = "/project/manage/projectDeleteSuccess.html" : t.alertMessage(i.error)
        })
    }

    var a = {};
    return a.init = function (e) {
        $("#manageReplaceDiv").replaceWith(juicer.templates["manage.juicer"](e.data)), $("#btn-project-close").on("click", function () {
            event.stopPropagation(), event.preventDefault(), $("#project-admin").modal("hide"), $("#project-close").modal("show")
        }), $("#project-close").find("button.btn-block.text-danger").on("click", function () {
            $("#project-close").modal("hide"), $("body").trigger("deleteProject")
        }), i()
    }, a
});
var mejs = mejs || {};
mejs.version = "2.23.4", mejs.meIndex = 0, mejs.plugins = {
    silverlight: [{
        version: [3, 0],
        types: ["video/mp4", "video/m4v", "video/mov", "video/wmv", "audio/wma", "audio/m4a", "audio/mp3", "audio/wav", "audio/mpeg"]
    }],
    flash: [{
        version: [9, 0, 124],
        types: ["video/mp4", "video/m4v", "video/mov", "video/flv", "video/rtmp", "video/x-flv", "audio/flv", "audio/x-flv", "audio/mp3", "audio/m4a", "audio/mp4", "audio/mpeg", "video/dailymotion", "video/x-dailymotion", "application/x-mpegURL", "audio/ogg"]
    }],
    youtube: [{version: null, types: ["video/youtube", "video/x-youtube", "audio/youtube", "audio/x-youtube"]}],
    vimeo: [{version: null, types: ["video/vimeo", "video/x-vimeo"]}]
}, mejs.Utility = {
    encodeUrl: function (e) {
        return encodeURIComponent(e)
    }, escapeHTML: function (e) {
        return e.toString().split("&").join("&amp;").split("<").join("&lt;").split('"').join("&quot;")
    }, absolutizeUrl: function (e) {
        var t = document.createElement("div");
        return t.innerHTML = '<a href="' + this.escapeHTML(e) + '">x</a>', t.firstChild.href
    }, getScriptPath: function (e) {
        for (var t, i, a, n, o, r, s = 0, l = "", c = "", d = document.getElementsByTagName("script"), p = d.length, u = e.length; p > s; s++) {
            for (n = d[s].src, i = n.lastIndexOf("/"), i > -1 ? (r = n.substring(i + 1), o = n.substring(0, i + 1)) : (r = n, o = ""), t = 0; u > t; t++)if (c = e[t], a = r.indexOf(c), a > -1) {
                l = o;
                break
            }
            if ("" !== l)break
        }
        return l
    }, calculateTimeFormat: function (e, t, i) {
        0 > e && (e = 0), "undefined" == typeof i && (i = 25);
        var a = t.timeFormat, n = a[0], o = a[1] == a[0], r = o ? 2 : 1, s = ":", l = Math.floor(e / 3600) % 24, c = Math.floor(e / 60) % 60, d = Math.floor(e % 60), p = Math.floor((e % 1 * i).toFixed(3)), u = [[p, "f"], [d, "s"], [c, "m"], [l, "h"]];
        a.length < r && (s = a[r]);
        for (var m = !1, h = 0, f = u.length; f > h; h++)if (-1 !== a.indexOf(u[h][1]))m = !0; else if (m) {
            for (var g = !1, v = h; f > v; v++)if (u[v][0] > 0) {
                g = !0;
                break
            }
            if (!g)break;
            o || (a = n + a), a = u[h][1] + s + a, o && (a = u[h][1] + a), n = u[h][1]
        }
        t.currentTimeFormat = a
    }, twoDigitsString: function (e) {
        return 10 > e ? "0" + e : String(e)
    }, secondsToTimeCode: function (e, t) {
        if (0 > e && (e = 0), "object" != typeof t) {
            var a = "m:ss";
            a = arguments[1] ? "hh:mm:ss" : a, a = arguments[2] ? a + ":ff" : a, t = {
                currentTimeFormat: a,
                framesPerSecond: arguments[3] || 25
            }
        }
        var n = t.framesPerSecond;
        "undefined" == typeof n && (n = 25);
        var a = t.currentTimeFormat, o = Math.floor(e / 3600) % 24, r = Math.floor(e / 60) % 60, s = Math.floor(e % 60), l = Math.floor((e % 1 * n).toFixed(3));
        lis = [[l, "f"], [s, "s"], [r, "m"], [o, "h"]];
        var c = a;
        for (i = 0, len = lis.length; i < len; i++)c = c.replace(lis[i][1] + lis[i][1], this.twoDigitsString(lis[i][0])), c = c.replace(lis[i][1], lis[i][0]);
        return c
    }, timeCodeToSeconds: function (e, t, i, a) {
        "undefined" == typeof i ? i = !1 : "undefined" == typeof a && (a = 25);
        var n = e.split(":"), o = parseInt(n[0], 10), r = parseInt(n[1], 10), s = parseInt(n[2], 10), l = 0, c = 0;
        return i && (l = parseInt(n[3]) / a), c = 3600 * o + 60 * r + s + l
    }, convertSMPTEtoSeconds: function (e) {
        if ("string" != typeof e)return !1;
        e = e.replace(",", ".");
        var t = 0, i = -1 != e.indexOf(".") ? e.split(".")[1].length : 0, a = 1;
        e = e.split(":").reverse();
        for (var n = 0; n < e.length; n++)a = 1, n > 0 && (a = Math.pow(60, n)), t += Number(e[n]) * a;
        return Number(t.toFixed(i))
    }, removeSwf: function (e) {
        var t = document.getElementById(e);
        t && /object|embed/i.test(t.nodeName) && (mejs.MediaFeatures.isIE ? (t.style.display = "none", function () {
            4 == t.readyState ? mejs.Utility.removeObjectInIE(e) : setTimeout(arguments.callee, 10)
        }()) : t.parentNode.removeChild(t))
    }, removeObjectInIE: function (e) {
        var t = document.getElementById(e);
        if (t) {
            for (var i in t)"function" == typeof t[i] && (t[i] = null);
            t.parentNode.removeChild(t)
        }
    }, determineScheme: function (e) {
        return e && -1 != e.indexOf("://") ? e.substr(0, e.indexOf("://") + 3) : "//"
    }, debounce: function (e, t, i) {
        var a;
        return function () {
            var n = this, o = arguments, r = function () {
                a = null, i || e.apply(n, o)
            }, s = i && !a;
            clearTimeout(a), a = setTimeout(r, t), s && e.apply(n, o)
        }
    }, isNodeAfter: function (e, t) {
        return !!(e && t && "function" == typeof e.compareDocumentPosition && e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING)
    }
}, mejs.PluginDetector = {
    hasPluginVersion: function (e, t) {
        var i = this.plugins[e];
        return t[1] = t[1] || 0, t[2] = t[2] || 0, i[0] > t[0] || i[0] == t[0] && i[1] > t[1] || i[0] == t[0] && i[1] == t[1] && i[2] >= t[2]
    },
    nav: window.navigator,
    ua: window.navigator.userAgent.toLowerCase(),
    plugins: [],
    addPlugin: function (e, t, i, a, n) {
        this.plugins[e] = this.detectPlugin(t, i, a, n)
    },
    detectPlugin: function (e, t, i, a) {
        var n, o, r, s = [0, 0, 0];
        if ("undefined" != typeof this.nav.plugins && "object" == typeof this.nav.plugins[e]) {
            if (n = this.nav.plugins[e].description, n && ("undefined" == typeof this.nav.mimeTypes || !this.nav.mimeTypes[t] || this.nav.mimeTypes[t].enabledPlugin))for (s = n.replace(e, "").replace(/^\s+/, "").replace(/\sr/gi, ".").split("."), o = 0; o < s.length; o++)s[o] = parseInt(s[o].match(/\d+/), 10)
        } else if ("undefined" != typeof window.ActiveXObject)try {
            r = new ActiveXObject(i), r && (s = a(r))
        } catch (l) {
        }
        return s
    }
}, mejs.PluginDetector.addPlugin("flash", "Shockwave Flash", "application/x-shockwave-flash", "ShockwaveFlash.ShockwaveFlash", function (e) {
    var t = [], i = e.GetVariable("$version");
    return i && (i = i.split(" ")[1].split(","), t = [parseInt(i[0], 10), parseInt(i[1], 10), parseInt(i[2], 10)]), t
}), mejs.PluginDetector.addPlugin("silverlight", "Silverlight Plug-In", "application/x-silverlight-2", "AgControl.AgControl", function (e) {
    var t = [0, 0, 0, 0], i = function (e, t, i, a) {
        for (; e.isVersionSupported(t[0] + "." + t[1] + "." + t[2] + "." + t[3]);)t[i] += a;
        t[i] -= a
    };
    return i(e, t, 0, 1), i(e, t, 1, 1), i(e, t, 2, 1e4), i(e, t, 2, 1e3), i(e, t, 2, 100), i(e, t, 2, 10), i(e, t, 2, 1), i(e, t, 3, 1), t
}), mejs.MediaFeatures = {
    init: function () {
        var e, t, i = this, a = document, n = mejs.PluginDetector.nav, o = mejs.PluginDetector.ua.toLowerCase(), r = ["source", "track", "audio", "video"];
        i.isiPad = null !== o.match(/ipad/i), i.isiPhone = null !== o.match(/iphone/i), i.isiOS = i.isiPhone || i.isiPad, i.isAndroid = null !== o.match(/android/i), i.isBustedAndroid = null !== o.match(/android 2\.[12]/), i.isBustedNativeHTTPS = "https:" === location.protocol && (null !== o.match(/android [12]\./) || null !== o.match(/macintosh.* version.* safari/)), i.isIE = -1 != n.appName.toLowerCase().indexOf("microsoft") || null !== n.appName.toLowerCase().match(/trident/gi), i.isChrome = null !== o.match(/chrome/gi), i.isChromium = null !== o.match(/chromium/gi), i.isFirefox = null !== o.match(/firefox/gi), i.isWebkit = null !== o.match(/webkit/gi), i.isGecko = null !== o.match(/gecko/gi) && !i.isWebkit && !i.isIE, i.isOpera = null !== o.match(/opera/gi), i.hasTouch = "ontouchstart" in window, i.svgAsImg = !!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
        for (e = 0; e < r.length; e++)t = document.createElement(r[e]);
        i.supportsMediaTag = "undefined" != typeof t.canPlayType || i.isBustedAndroid;
        try {
            t.canPlayType("video/mp4")
        } catch (s) {
            i.supportsMediaTag = !1
        }
        i.supportsPointerEvents = function () {
            var e, t = document.createElement("x"), i = document.documentElement, a = window.getComputedStyle;
            return "pointerEvents" in t.style && (t.style.pointerEvents = "auto", t.style.pointerEvents = "x", i.appendChild(t), e = a && "auto" === a(t, "").pointerEvents, i.removeChild(t), !!e)
        }(), i.hasFirefoxPluginMovingProblem = !1, i.hasiOSFullScreen = "undefined" != typeof t.webkitEnterFullscreen, i.hasNativeFullscreen = "undefined" != typeof t.requestFullscreen, i.hasWebkitNativeFullScreen = "undefined" != typeof t.webkitRequestFullScreen, i.hasMozNativeFullScreen = "undefined" != typeof t.mozRequestFullScreen, i.hasMsNativeFullScreen = "undefined" != typeof t.msRequestFullscreen, i.hasTrueNativeFullScreen = i.hasWebkitNativeFullScreen || i.hasMozNativeFullScreen || i.hasMsNativeFullScreen, i.nativeFullScreenEnabled = i.hasTrueNativeFullScreen, i.hasMozNativeFullScreen ? i.nativeFullScreenEnabled = document.mozFullScreenEnabled : i.hasMsNativeFullScreen && (i.nativeFullScreenEnabled = document.msFullscreenEnabled), i.isChrome && (i.hasiOSFullScreen = !1), i.hasTrueNativeFullScreen && (i.fullScreenEventName = "", i.hasWebkitNativeFullScreen ? i.fullScreenEventName = "webkitfullscreenchange" : i.hasMozNativeFullScreen ? i.fullScreenEventName = "mozfullscreenchange" : i.hasMsNativeFullScreen && (i.fullScreenEventName = "MSFullscreenChange"), i.isFullScreen = function () {
            return i.hasMozNativeFullScreen ? a.mozFullScreen : i.hasWebkitNativeFullScreen ? a.webkitIsFullScreen : i.hasMsNativeFullScreen ? null !== a.msFullscreenElement : void 0
        }, i.requestFullScreen = function (e) {
            i.hasWebkitNativeFullScreen ? e.webkitRequestFullScreen() : i.hasMozNativeFullScreen ? e.mozRequestFullScreen() : i.hasMsNativeFullScreen && e.msRequestFullscreen()
        }, i.cancelFullScreen = function () {
            i.hasWebkitNativeFullScreen ? document.webkitCancelFullScreen() : i.hasMozNativeFullScreen ? document.mozCancelFullScreen() : i.hasMsNativeFullScreen && document.msExitFullscreen()
        }), i.hasiOSFullScreen && o.match(/mac os x 10_5/i) && (i.hasNativeFullScreen = !1, i.hasiOSFullScreen = !1)
    }
}, mejs.MediaFeatures.init(), mejs.HtmlMediaElement = {
    pluginType: "native",
    isFullScreen: !1,
    setCurrentTime: function (e) {
        this.currentTime = e
    },
    setMuted: function (e) {
        this.muted = e
    },
    setVolume: function (e) {
        this.volume = e
    },
    stop: function () {
        this.pause()
    },
    setSrc: function (e) {
        for (var t = this.getElementsByTagName("source"); t.length > 0;)this.removeChild(t[0]);
        if ("string" == typeof e)this.src = e; else {
            var i, a;
            for (i = 0; i < e.length; i++)if (a = e[i], this.canPlayType(a.type)) {
                this.src = a.src;
                break
            }
        }
    },
    setVideoSize: function (e, t) {
        this.width = e, this.height = t
    }
}, mejs.PluginMediaElement = function (e, t, i) {
    this.id = e, this.pluginType = t, this.src = i, this.events = {}, this.attributes = {}
}, mejs.PluginMediaElement.prototype = {
    pluginElement: null,
    pluginType: "",
    isFullScreen: !1,
    playbackRate: -1,
    defaultPlaybackRate: -1,
    seekable: [],
    played: [],
    paused: !0,
    ended: !1,
    seeking: !1,
    duration: 0,
    error: null,
    tagName: "",
    muted: !1,
    volume: 1,
    currentTime: 0,
    play: function () {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.playVideo() : this.pluginApi.playMedia(), this.paused = !1)
    },
    load: function () {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType || this.pluginApi.loadMedia(), this.paused = !1)
    },
    pause: function () {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? 1 == this.pluginApi.getPlayerState() && this.pluginApi.pauseVideo() : this.pluginApi.pauseMedia(), this.paused = !0)
    },
    stop: function () {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.stopVideo() : this.pluginApi.stopMedia(), this.paused = !0)
    },
    canPlayType: function (e) {
        var t, i, a, n = mejs.plugins[this.pluginType];
        for (t = 0; t < n.length; t++)if (a = n[t], mejs.PluginDetector.hasPluginVersion(this.pluginType, a.version))for (i = 0; i < a.types.length; i++)if (e == a.types[i])return "probably";
        return ""
    },
    positionFullscreenButton: function (e, t, i) {
        null != this.pluginApi && this.pluginApi.positionFullscreenButton && this.pluginApi.positionFullscreenButton(Math.floor(e), Math.floor(t), i)
    },
    hideFullscreenButton: function () {
        null != this.pluginApi && this.pluginApi.hideFullscreenButton && this.pluginApi.hideFullscreenButton()
    },
    setSrc: function (e) {
        if ("string" == typeof e)this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(e)), this.src = mejs.Utility.absolutizeUrl(e); else {
            var t, i;
            for (t = 0; t < e.length; t++)if (i = e[t], this.canPlayType(i.type)) {
                this.pluginApi.setSrc(mejs.Utility.absolutizeUrl(i.src)), this.src = mejs.Utility.absolutizeUrl(i.src);
                break
            }
        }
    },
    setCurrentTime: function (e) {
        null != this.pluginApi && ("youtube" == this.pluginType || "vimeo" == this.pluginType ? this.pluginApi.seekTo(e) : this.pluginApi.setCurrentTime(e), this.currentTime = e)
    },
    setVolume: function (e) {
        null != this.pluginApi && ("youtube" == this.pluginType ? this.pluginApi.setVolume(100 * e) : this.pluginApi.setVolume(e), this.volume = e)
    },
    setMuted: function (e) {
        null != this.pluginApi && ("youtube" == this.pluginType ? (e ? this.pluginApi.mute() : this.pluginApi.unMute(), this.muted = e, this.dispatchEvent({type: "volumechange"})) : this.pluginApi.setMuted(e), this.muted = e)
    },
    setVideoSize: function (e, t) {
        this.pluginElement && this.pluginElement.style && (this.pluginElement.style.width = e + "px", this.pluginElement.style.height = t + "px"), null != this.pluginApi && this.pluginApi.setVideoSize && this.pluginApi.setVideoSize(e, t)
    },
    setFullscreen: function (e) {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.pluginApi.setFullscreen(e)
    },
    enterFullScreen: function () {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!0)
    },
    exitFullScreen: function () {
        null != this.pluginApi && this.pluginApi.setFullscreen && this.setFullscreen(!1)
    },
    addEventListener: function (e, t, i) {
        this.events[e] = this.events[e] || [], this.events[e].push(t)
    },
    removeEventListener: function (e, t) {
        if (!e)return this.events = {}, !0;
        var i = this.events[e];
        if (!i)return !0;
        if (!t)return this.events[e] = [], !0;
        for (var a = 0; a < i.length; a++)if (i[a] === t)return this.events[e].splice(a, 1), !0;
        return !1
    },
    dispatchEvent: function (e) {
        var t, i = this.events[e.type];
        if (i)for (t = 0; t < i.length; t++)i[t].apply(this, [e])
    },
    hasAttribute: function (e) {
        return e in this.attributes
    },
    removeAttribute: function (e) {
        delete this.attributes[e]
    },
    getAttribute: function (e) {
        return this.hasAttribute(e) ? this.attributes[e] : null
    },
    setAttribute: function (e, t) {
        this.attributes[e] = t
    },
    remove: function () {
        mejs.Utility.removeSwf(this.pluginElement.id)
    }
}, mejs.MediaElementDefaults = {
    mode: "auto",
    plugins: ["flash", "silverlight", "youtube", "vimeo"],
    enablePluginDebug: !1,
    httpsBasicAuthSite: !1,
    type: "",
    pluginPath: mejs.Utility.getScriptPath(["mediaelement.js", "mediaelement.min.js", "mediaelement-and-player.js", "mediaelement-and-player.min.js"]),
    flashName: "flashmediaelement.swf",
    flashStreamer: "",
    flashScriptAccess: "sameDomain",
    enablePluginSmoothing: !1,
    enablePseudoStreaming: !1,
    pseudoStreamingStartQueryParam: "start",
    silverlightName: "silverlightmediaelement.xap",
    defaultVideoWidth: 480,
    defaultVideoHeight: 270,
    pluginWidth: -1,
    pluginHeight: -1,
    pluginVars: [],
    timerRate: 250,
    startVolume: .8,
    customError: "",
    success: function () {
    },
    error: function () {
    }
}, mejs.MediaElement = function (e, t) {
    return mejs.HtmlMediaElementShim.create(e, t)
}, mejs.HtmlMediaElementShim = {
    create: function (e, t) {
        var i, a, n = {}, o = "string" == typeof e ? document.getElementById(e) : e, r = o.tagName.toLowerCase(), s = "audio" === r || "video" === r, l = s ? o.getAttribute("src") : o.getAttribute("href"), c = o.getAttribute("poster"), d = o.getAttribute("autoplay"), p = o.getAttribute("preload"), u = o.getAttribute("controls");
        for (a in mejs.MediaElementDefaults)n[a] = mejs.MediaElementDefaults[a];
        for (a in t)n[a] = t[a];
        return l = "undefined" == typeof l || null === l || "" == l ? null : l, c = "undefined" == typeof c || null === c ? "" : c, p = "undefined" == typeof p || null === p || "false" === p ? "none" : p, d = !("undefined" == typeof d || null === d || "false" === d), u = !("undefined" == typeof u || null === u || "false" === u), i = this.determinePlayback(o, n, mejs.MediaFeatures.supportsMediaTag, s, l), i.url = null !== i.url ? mejs.Utility.absolutizeUrl(i.url) : "", i.scheme = mejs.Utility.determineScheme(i.url), "native" == i.method ? (mejs.MediaFeatures.isBustedAndroid && (o.src = i.url, o.addEventListener("click", function () {
            o.play()
        }, !1)), this.updateNative(i, n, d, p)) : "" !== i.method ? this.createPlugin(i, n, c, d, p, u) : (this.createErrorMessage(i, n, c), this)
    }, determinePlayback: function (e, t, i, a, n) {
        var o, r, s, l, c, d, p, u, m, h, f, g = [], v = {
            method: "",
            url: "",
            htmlMediaElement: e,
            isVideo: "audio" !== e.tagName.toLowerCase(),
            scheme: ""
        };
        if ("undefined" != typeof t.type && "" !== t.type)if ("string" == typeof t.type)g.push({
            type: t.type,
            url: n
        }); else for (o = 0; o < t.type.length; o++)g.push({
            type: t.type[o],
            url: n
        }); else if (null !== n)d = this.formatType(n, e.getAttribute("type")), g.push({
            type: d,
            url: n
        }); else for (o = 0; o < e.childNodes.length; o++)c = e.childNodes[o], 1 == c.nodeType && "source" == c.tagName.toLowerCase() && (n = c.getAttribute("src"), d = this.formatType(n, c.getAttribute("type")), f = c.getAttribute("media"), (!f || !window.matchMedia || window.matchMedia && window.matchMedia(f).matches) && g.push({
            type: d,
            url: n
        }));
        if (!a && g.length > 0 && null !== g[0].url && this.getTypeFromFile(g[0].url).indexOf("audio") > -1 && (v.isVideo = !1), v.isVideo && mejs.MediaFeatures.isBustedAndroid && (e.canPlayType = function (e) {
                return null !== e.match(/video\/(mp4|m4v)/gi) ? "maybe" : ""
            }), v.isVideo && mejs.MediaFeatures.isChromium && (e.canPlayType = function (e) {
                return null !== e.match(/video\/(webm|ogv|ogg)/gi) ? "maybe" : ""
            }), i && ("auto" === t.mode || "auto_plugin" === t.mode || "native" === t.mode) && (!mejs.MediaFeatures.isBustedNativeHTTPS || t.httpsBasicAuthSite !== !0)) {
            for (a || (h = document.createElement(v.isVideo ? "video" : "audio"), e.parentNode.insertBefore(h, e), e.style.display = "none", v.htmlMediaElement = e = h), o = 0; o < g.length; o++)if ("video/m3u8" == g[o].type || "" !== e.canPlayType(g[o].type).replace(/no/, "") || "" !== e.canPlayType(g[o].type.replace(/mp3/, "mpeg")).replace(/no/, "") || "" !== e.canPlayType(g[o].type.replace(/m4a/, "mp4")).replace(/no/, "")) {
                v.method = "native", v.url = g[o].url;
                break
            }
            if ("native" === v.method && (null !== v.url && (e.src = v.url), "auto_plugin" !== t.mode))return v
        }
        if ("auto" === t.mode || "auto_plugin" === t.mode || "shim" === t.mode)for (o = 0; o < g.length; o++)for (d = g[o].type, r = 0; r < t.plugins.length; r++)for (p = t.plugins[r], u = mejs.plugins[p], s = 0; s < u.length; s++)if (m = u[s], null == m.version || mejs.PluginDetector.hasPluginVersion(p, m.version))for (l = 0; l < m.types.length; l++)if (d.toLowerCase() == m.types[l].toLowerCase())return v.method = p, v.url = g[o].url, v;
        return "auto_plugin" === t.mode && "native" === v.method ? v : ("" === v.method && g.length > 0 && (v.url = g[0].url), v)
    }, formatType: function (e, t) {
        return e && !t ? this.getTypeFromFile(e) : t && ~t.indexOf(";") ? t.substr(0, t.indexOf(";")) : t
    }, getTypeFromFile: function (e) {
        e = e.split("?")[0];
        var t = e.substring(e.lastIndexOf(".") + 1).toLowerCase(), i = /(mp4|m4v|ogg|ogv|m3u8|webm|webmv|flv|wmv|mpeg|mov)/gi.test(t) ? "video/" : "audio/";
        return this.getTypeFromExtension(t, i)
    }, getTypeFromExtension: function (e, t) {
        switch (t = t || "", e) {
            case"mp4":
            case"m4v":
            case"m4a":
            case"f4v":
            case"f4a":
                return t + "mp4";
            case"flv":
                return t + "x-flv";
            case"webm":
            case"webma":
            case"webmv":
                return t + "webm";
            case"ogg":
            case"oga":
            case"ogv":
                return t + "ogg";
            case"m3u8":
                return "application/x-mpegurl";
            case"ts":
                return t + "mp2t";
            default:
                return t + e
        }
    }, createErrorMessage: function (e, t, i) {
        var a = e.htmlMediaElement, n = document.createElement("div"), o = t.customError;
        n.className = "me-cannotplay";
        try {
            n.style.width = a.width + "px", n.style.height = a.height + "px"
        } catch (r) {
        }
        o || (o = '<a href="' + e.url + '">', "" !== i && (o += '<img src="' + i + '" width="100%" height="100%" alt="" />'), o += "<span>" + mejs.i18n.t("mejs.download-file") + "</span></a>"), n.innerHTML = o, a.parentNode.insertBefore(n, a), a.style.display = "none", t.error(a)
    }, createPlugin: function (e, t, i, a, n, o) {
        var r, s, l, c = e.htmlMediaElement, d = 1, p = 1, u = "me_" + e.method + "_" + mejs.meIndex++, m = new mejs.PluginMediaElement(u, e.method, e.url), h = document.createElement("div");
        m.tagName = c.tagName;
        for (var f = 0; f < c.attributes.length; f++) {
            var g = c.attributes[f];
            g.specified && m.setAttribute(g.name, g.value)
        }
        for (s = c.parentNode; null !== s && null != s.tagName && "body" !== s.tagName.toLowerCase() && null != s.parentNode && null != s.parentNode.tagName && null != s.parentNode.constructor && "ShadowRoot" === s.parentNode.constructor.name;) {
            if ("p" === s.parentNode.tagName.toLowerCase()) {
                s.parentNode.parentNode.insertBefore(s, s.parentNode);
                break
            }
            s = s.parentNode
        }
        if (e.isVideo ? (d = t.pluginWidth > 0 ? t.pluginWidth : t.videoWidth > 0 ? t.videoWidth : null !== c.getAttribute("width") ? c.getAttribute("width") : t.defaultVideoWidth, p = t.pluginHeight > 0 ? t.pluginHeight : t.videoHeight > 0 ? t.videoHeight : null !== c.getAttribute("height") ? c.getAttribute("height") : t.defaultVideoHeight, d = mejs.Utility.encodeUrl(d), p = mejs.Utility.encodeUrl(p)) : t.enablePluginDebug && (d = 320, p = 240), m.success = t.success, h.className = "me-plugin", h.id = u + "_container", e.isVideo ? c.parentNode.insertBefore(h, c) : document.body.insertBefore(h, document.body.childNodes[0]), "flash" === e.method || "silverlight" === e.method) {
            var v = "audio/mp4" === c.getAttribute("type"), y = c.getElementsByTagName("source");
            if (y && !v)for (var f = 0, w = y.length; w > f; f++)"audio/mp4" === y[f].getAttribute("type") && (v = !0);
            l = ["id=" + u, "isvideo=" + (e.isVideo || v ? "true" : "false"), "autoplay=" + (a ? "true" : "false"), "preload=" + n, "width=" + d, "startvolume=" + t.startVolume, "timerrate=" + t.timerRate, "flashstreamer=" + t.flashStreamer, "height=" + p, "pseudostreamstart=" + t.pseudoStreamingStartQueryParam], null !== e.url && ("flash" == e.method ? l.push("file=" + mejs.Utility.encodeUrl(e.url)) : l.push("file=" + e.url)), t.enablePluginDebug && l.push("debug=true"), t.enablePluginSmoothing && l.push("smoothing=true"), t.enablePseudoStreaming && l.push("pseudostreaming=true"), o && l.push("controls=true"), t.pluginVars && (l = l.concat(t.pluginVars)), window[u + "_init"] = function () {
                switch (m.pluginType) {
                    case"flash":
                        m.pluginElement = m.pluginApi = document.getElementById(u);
                        break;
                    case"silverlight":
                        m.pluginElement = document.getElementById(m.id), m.pluginApi = m.pluginElement.Content.MediaElementJS
                }
                null != m.pluginApi && m.success && m.success(m, c)
            }, window[u + "_event"] = function (e, t) {
                var i, a, n;
                i = {type: e, target: m};
                for (a in t)m[a] = t[a], i[a] = t[a];
                n = t.bufferedTime || 0, i.target.buffered = i.buffered = {
                    start: function (e) {
                        return 0
                    }, end: function (e) {
                        return n
                    }, length: 1
                }, m.dispatchEvent(i)
            }
        }
        switch (e.method) {
            case"silverlight":
                h.innerHTML = '<object data="data:application/x-silverlight-2," type="application/x-silverlight-2" id="' + u + '" name="' + u + '" width="' + d + '" height="' + p + '" class="mejs-shim"><param name="initParams" value="' + l.join(",") + '" /><param name="windowless" value="true" /><param name="background" value="black" /><param name="minRuntimeVersion" value="3.0.0.0" /><param name="autoUpgrade" value="true" /><param name="source" value="' + t.pluginPath + t.silverlightName + '" /></object>';
                break;
            case"flash":
                mejs.MediaFeatures.isIE ? (r = document.createElement("div"), h.appendChild(r), r.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + u + '" width="' + d + '" height="' + p + '" class="mejs-shim"><param name="movie" value="' + t.pluginPath + t.flashName + "?" + (new Date).getTime() + '" /><param name="flashvars" value="' + l.join("&amp;") + '" /><param name="quality" value="high" /><param name="bgcolor" value="#000000" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="' + t.flashScriptAccess + '" /><param name="allowFullScreen" value="true" /><param name="scale" value="default" /></object>') : h.innerHTML = '<embed id="' + u + '" name="' + u + '" play="true" loop="false" quality="high" bgcolor="#000000" wmode="transparent" allowScriptAccess="' + t.flashScriptAccess + '" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="//www.macromedia.com/go/getflashplayer" src="' + t.pluginPath + t.flashName + '" flashvars="' + l.join("&") + '" width="' + d + '" height="' + p + '" scale="default"class="mejs-shim"></embed>';
                break;
            case"youtube":
                var b;
                if (-1 != e.url.lastIndexOf("youtu.be"))b = e.url.substr(e.url.lastIndexOf("/") + 1), -1 != b.indexOf("?") && (b = b.substr(0, b.indexOf("?"))); else {
                    var _ = e.url.match(/[?&]v=([^&#]+)|&|#|$/);
                    _ && (b = _[1])
                }
                youtubeSettings = {
                    container: h,
                    containerId: h.id,
                    pluginMediaElement: m,
                    pluginId: u,
                    videoId: b,
                    height: p,
                    width: d,
                    scheme: e.scheme,
                    variables: t.youtubeIframeVars
                }, window.postMessage ? mejs.YouTubeApi.enqueueIframe(youtubeSettings) : mejs.PluginDetector.hasPluginVersion("flash", [10, 0, 0]) && mejs.YouTubeApi.createFlash(youtubeSettings, t);
                break;
            case"vimeo":
                var x = u + "_player";
                if (m.vimeoid = e.url.substr(e.url.lastIndexOf("/") + 1), h.innerHTML = '<iframe src="' + e.scheme + "player.vimeo.com/video/" + m.vimeoid + "?api=1&portrait=0&byline=0&title=0&player_id=" + x + '" width="' + d + '" height="' + p + '" frameborder="0" class="mejs-shim" id="' + x + '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>', "function" == typeof $f) {
                    var T = $f(h.childNodes[0]), S = -1;
                    T.addEvent("ready", function () {
                        function e(e, t, i, a) {
                            var n = {type: i, target: t};
                            "timeupdate" == i && (t.currentTime = n.currentTime = a.seconds, t.duration = n.duration = a.duration), t.dispatchEvent(n)
                        }

                        T.playVideo = function () {
                            T.api("play")
                        }, T.stopVideo = function () {
                            T.api("unload")
                        }, T.pauseVideo = function () {
                            T.api("pause")
                        }, T.seekTo = function (e) {
                            T.api("seekTo", e)
                        }, T.setVolume = function (e) {
                            T.api("setVolume", e)
                        }, T.setMuted = function (e) {
                            e ? (T.lastVolume = T.api("getVolume"), T.api("setVolume", 0)) : (T.api("setVolume", T.lastVolume), delete T.lastVolume)
                        }, T.getPlayerState = function () {
                            return S
                        }, T.addEvent("play", function () {
                            S = 1, e(T, m, "play"), e(T, m, "playing")
                        }), T.addEvent("pause", function () {
                            S = 2, e(T, m, "pause")
                        }), T.addEvent("finish", function () {
                            S = 0, e(T, m, "ended")
                        }), T.addEvent("playProgress", function (t) {
                            e(T, m, "timeupdate", t)
                        }), T.addEvent("seek", function (t) {
                            S = 3, e(T, m, "seeked", t)
                        }), T.addEvent("loadProgress", function (t) {
                            S = 3, e(T, m, "progress", t)
                        }), m.pluginElement = h, m.pluginApi = T, m.success(m, m.pluginElement)
                    })
                } else console.warn("You need to include froogaloop for vimeo to work")
        }
        return c.style.display = "none", c.removeAttribute("autoplay"), m
    }, updateNative: function (e, t, i, a) {
        var n, o = e.htmlMediaElement;
        for (n in mejs.HtmlMediaElement)o[n] = mejs.HtmlMediaElement[n];
        return t.success(o, o), o
    }
}, mejs.YouTubeApi = {
    isIframeStarted: !1, isIframeLoaded: !1, loadIframeApi: function (e) {
        if (!this.isIframeStarted) {
            var t = document.createElement("script");
            t.src = e.scheme + "www.youtube.com/player_api";
            var i = document.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(t, i), this.isIframeStarted = !0
        }
    }, iframeQueue: [], enqueueIframe: function (e) {
        this.isLoaded ? this.createIframe(e) : (this.loadIframeApi(e), this.iframeQueue.push(e))
    }, createIframe: function (e) {
        var t = e.pluginMediaElement, i = {
            controls: 0,
            wmode: "transparent"
        }, a = new YT.Player(e.containerId, {
            height: e.height,
            width: e.width,
            videoId: e.videoId,
            playerVars: mejs.$.extend({}, i, e.variables),
            events: {
                onReady: function (i) {
                    a.setVideoSize = function (e, t) {
                        a.setSize(e, t)
                    }, e.pluginMediaElement.pluginApi = a, e.pluginMediaElement.pluginElement = document.getElementById(e.containerId), t.success(t, t.pluginElement), mejs.YouTubeApi.createEvent(a, t, "canplay"), setInterval(function () {
                        mejs.YouTubeApi.createEvent(a, t, "timeupdate")
                    }, 250), "undefined" != typeof t.attributes.autoplay && a.playVideo()
                }, onStateChange: function (e) {
                    mejs.YouTubeApi.handleStateChange(e.data, a, t)
                }
            }
        })
    }, createEvent: function (e, t, i) {
        var a = {type: i, target: t};
        if (e && e.getDuration) {
            t.currentTime = a.currentTime = e.getCurrentTime(), t.duration = a.duration = e.getDuration(), a.paused = t.paused, a.ended = t.ended, a.muted = e.isMuted(), a.volume = e.getVolume() / 100, a.bytesTotal = e.getVideoBytesTotal(), a.bufferedBytes = e.getVideoBytesLoaded();
            var n = a.bufferedBytes / a.bytesTotal * a.duration;
            a.target.buffered = a.buffered = {
                start: function (e) {
                    return 0
                }, end: function (e) {
                    return n
                }, length: 1
            }
        }
        t.dispatchEvent(a)
    }, iFrameReady: function () {
        for (this.isLoaded = !0, this.isIframeLoaded = !0; this.iframeQueue.length > 0;) {
            var e = this.iframeQueue.pop();
            this.createIframe(e)
        }
    }, flashPlayers: {}, createFlash: function (e) {
        this.flashPlayers[e.pluginId] = e;
        var t, i = e.scheme + "www.youtube.com/apiplayer?enablejsapi=1&amp;playerapiid=" + e.pluginId + "&amp;version=3&amp;autoplay=0&amp;controls=0&amp;modestbranding=1&loop=0";
        mejs.MediaFeatures.isIE ? (t = document.createElement("div"), e.container.appendChild(t), t.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="' + e.scheme + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" id="' + e.pluginId + '" width="' + e.width + '" height="' + e.height + '" class="mejs-shim"><param name="movie" value="' + i + '" /><param name="wmode" value="transparent" /><param name="allowScriptAccess" value="' + options.flashScriptAccess + '" /><param name="allowFullScreen" value="true" /></object>') : e.container.innerHTML = '<object type="application/x-shockwave-flash" id="' + e.pluginId + '" data="' + i + '" width="' + e.width + '" height="' + e.height + '" style="visibility: visible; " class="mejs-shim"><param name="allowScriptAccess" value="' + options.flashScriptAccess + '"><param name="wmode" value="transparent"></object>'
    }, flashReady: function (e) {
        var t = this.flashPlayers[e], i = document.getElementById(e), a = t.pluginMediaElement;
        a.pluginApi = a.pluginElement = i, t.success(a, a.pluginElement), i.cueVideoById(t.videoId);
        var n = t.containerId + "_callback";
        window[n] = function (e) {
            mejs.YouTubeApi.handleStateChange(e, i, a)
        }, i.addEventListener("onStateChange", n), setInterval(function () {
            mejs.YouTubeApi.createEvent(i, a, "timeupdate")
        }, 250), mejs.YouTubeApi.createEvent(i, a, "canplay")
    }, handleStateChange: function (e, t, i) {
        switch (e) {
            case-1:
                i.paused = !0, i.ended = !0, mejs.YouTubeApi.createEvent(t, i, "loadedmetadata");
                break;
            case 0:
                i.paused = !1, i.ended = !0, mejs.YouTubeApi.createEvent(t, i, "ended");
                break;
            case 1:
                i.paused = !1, i.ended = !1, mejs.YouTubeApi.createEvent(t, i, "play"), mejs.YouTubeApi.createEvent(t, i, "playing");
                break;
            case 2:
                i.paused = !0, i.ended = !1, mejs.YouTubeApi.createEvent(t, i, "pause");
                break;
            case 3:
                mejs.YouTubeApi.createEvent(t, i, "progress");
                break;
            case 5:
        }
    }
}, window.onYouTubePlayerAPIReady = function () {
    mejs.YouTubeApi.iFrameReady()
}, window.onYouTubePlayerReady = function (e) {
    mejs.YouTubeApi.flashReady(e)
}, window.mejs = mejs, window.MediaElement = mejs.MediaElement, function (e, t, i, a) {
    var n = {
        "default": "en",
        locale: {language: i.i18n && i.i18n.locale.language || "", strings: i.i18n && i.i18n.locale.strings || {}},
        pluralForms: [function () {
            return arguments[1]
        }, function () {
            var e = arguments;
            return 1 === e[0] ? e[1] : e[2]
        }, function () {
            var e = arguments;
            return [0, 1].indexOf(e[0]) > -1 ? e[1] : e[2]
        }, function () {
            var e = arguments;
            return e[0] % 10 === 1 && e[0] % 100 !== 11 ? e[1] : 0 !== e[0] ? e[2] : e[3]
        }, function () {
            var e = arguments;
            return 1 === e[0] || 11 === e[0] ? e[1] : 2 === e[0] || 12 === e[0] ? e[2] : e[0] > 2 && e[0] < 20 ? e[3] : e[4]
        }, function () {
            return 1 === args[0] ? args[1] : 0 === args[0] || args[0] % 100 > 0 && args[0] % 100 < 20 ? args[2] : args[3]
        }, function () {
            var e = arguments;
            return e[0] % 10 === 1 && e[0] % 100 !== 11 ? e[1] : e[0] % 10 >= 2 && (e[0] % 100 < 10 || e[0] % 100 >= 20) ? e[2] : [3]
        }, function () {
            var e = arguments;
            return e[0] % 10 === 1 && e[0] % 100 !== 11 ? e[1] : e[0] % 10 >= 2 && e[0] % 10 <= 4 && (e[0] % 100 < 10 || e[0] % 100 >= 20) ? e[2] : e[3]
        }, function () {
            var e = arguments;
            return 1 === e[0] ? e[1] : e[0] >= 2 && e[0] <= 4 ? e[2] : e[3]
        }, function () {
            var e = arguments;
            return 1 === e[0] ? e[1] : e[0] % 10 >= 2 && e[0] % 10 <= 4 && (e[0] % 100 < 10 || e[0] % 100 >= 20) ? e[2] : e[3]
        }, function () {
            var e = arguments;
            return e[0] % 100 === 1 ? e[2] : e[0] % 100 === 2 ? e[3] : e[0] % 100 === 3 || e[0] % 100 === 4 ? e[4] : e[1]
        }, function () {
            var e = arguments;
            return 1 === e[0] ? e[1] : 2 === e[0] ? e[2] : e[0] > 2 && e[0] < 7 ? e[3] : e[0] > 6 && e[0] < 11 ? e[4] : e[5]
        }, function () {
            var e = arguments;
            return 0 === e[0] ? e[1] : 1 === e[0] ? e[2] : 2 === e[0] ? e[3] : e[0] % 100 >= 3 && e[0] % 100 <= 10 ? e[4] : e[0] % 100 >= 11 ? e[5] : e[6]
        }, function () {
            var e = arguments;
            return 1 === e[0] ? e[1] : 0 === e[0] || e[0] % 100 > 1 && e[0] % 100 < 11 ? e[2] : e[0] % 100 > 10 && e[0] % 100 < 20 ? e[3] : e[4]
        }, function () {
            var e = arguments;
            return e[0] % 10 === 1 ? e[1] : e[0] % 10 === 2 ? e[2] : e[3]
        }, function () {
            var e = arguments;
            return 11 !== e[0] && e[0] % 10 === 1 ? e[1] : e[2]
        }, function () {
            var e = arguments;
            return 1 === e[0] ? e[1] : e[0] % 10 >= 2 && e[0] % 10 <= 4 && (e[0] % 100 < 10 || e[0] % 100 >= 20) ? e[2] : e[3]
        }, function () {
            var e = arguments;
            return 1 === e[0] ? e[1] : 2 === e[0] ? e[2] : 8 !== e[0] && 11 !== e[0] ? e[3] : e[4]
        }, function () {
            var e = arguments;
            return 0 === e[0] ? e[1] : e[2]
        }, function () {
            var e = arguments;
            return 1 === e[0] ? e[1] : 2 === e[0] ? e[2] : 3 === e[0] ? e[3] : e[4]
        }, function () {
            var e = arguments;
            return 0 === e[0] ? e[1] : 1 === e[0] ? e[2] : e[3]
        }],
        getLanguage: function () {
            var e = n.locale.language || n["default"];
            return /^(x\-)?[a-z]{2,}(\-\w{2,})?(\-\w{2,})?$/.exec(e) ? e : n["default"]
        },
        t: function (e, t) {
            if ("string" == typeof e && e.length) {
                var i, a, o = n.getLanguage(), r = function (e, t, i) {
                    return "object" != typeof e || "number" != typeof t || "number" != typeof i ? e : "string" == typeof e ? e : n.pluralForms[i].apply(null, [t].concat(e))
                }, s = function (e) {
                    var t = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"};
                    return e.replace(/[&<>"]/g, function (e) {
                        return t[e]
                    })
                };
                return n.locale.strings && n.locale.strings[o] && (i = n.locale.strings[o][e], "number" == typeof t && (a = n.locale.strings[o]["mejs.plural-form"], i = r.apply(null, [i, t, a]))), !i && n.locale.strings && n.locale.strings[n["default"]] && (i = n.locale.strings[n["default"]][e], "number" == typeof t && (a = n.locale.strings[n["default"]]["mejs.plural-form"], i = r.apply(null, [i, t, a]))), i = i || e, "number" == typeof t && (i = i.replace("%1", t)), s(i)
            }
            return e
        }
    };
    "undefined" != typeof mejsL10n && (n.locale.language = mejsL10n.language), i.i18n = n
}(document, window, mejs), function (e, t) {
    "use strict";
    "undefined" != typeof mejsL10n && (e[mejsL10n.lang] = mejsL10n.strings)
}(mejs.i18n.locale.strings), function (e) {
    "use strict";
    void 0 === e.en && (e.en = {
        "mejs.plural-form": 1,
        "mejs.download-file": "Download File",
        "mejs.fullscreen-off": "Turn off Fullscreen",
        "mejs.fullscreen-on": "Go Fullscreen",
        "mejs.download-video": "Download Video",
        "mejs.fullscreen": "Fullscreen",
        "mejs.time-jump-forward": ["Jump forward 1 second", "Jump forward %1 seconds"],
        "mejs.play": "Play",
        "mejs.pause": "Pause",
        "mejs.close": "Close",
        "mejs.time-slider": "Time Slider",
        "mejs.time-help-text": "Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.",
        "mejs.time-skip-back": ["Skip back 1 second", "Skip back %1 seconds"],
        "mejs.captions-subtitles": "Captions/Subtitles",
        "mejs.none": "None",
        "mejs.mute-toggle": "Mute Toggle",
        "mejs.volume-help-text": "Use Up/Down Arrow keys to increase or decrease volume.",
        "mejs.unmute": "Unmute",
        "mejs.mute": "Mute",
        "mejs.volume-slider": "Volume Slider",
        "mejs.video-player": "Video Player",
        "mejs.audio-player": "Audio Player",
        "mejs.ad-skip": "Skip ad",
        "mejs.ad-skip-info": ["Skip in 1 second", "Skip in %1 seconds"],
        "mejs.source-chooser": "Source Chooser"
    })
}(mejs.i18n.locale.strings), define("mediaelement", [], function () {
}), define("feedMC", ["juicer", "utils", "mediaelement"], function (e, t, i) {
    function a() {
        $("body").on("addCommentFromFeedRemoteBack", function (e, i) {
            if (i.error)t.alertMessage(i.error); else {
                var a = juicer.templates["singleCmtMC.juicer"](i.data);
                if ("comment" == r.entity && $(".project-timeline .feed_comment[data-commentid=" + r.entity_id + "]").after(a), "topic" == r.entity) {
                    var n = $(".timeline-item[data-topicid=" + r.entity_id + "]");
                    console.log(11, n.length, r.entity_id), 0 == n.find(".btn-comment-more").length ? (n.find(".timeline-item_content_talk__comment").show(), n.find(".timeline-item_content_talk__comment").append(a)) : n.find(".feed_comment").last().after(a)
                }
            }
        }), $("body").on("deleteCommentFromFeedRemoteBack", function (e, i) {
            if (i.error)t.alertMessage(i.error); else {
                var a = $(".project-timeline").find(".feed_comment[data-commentid=" + r.comment_id + "]").parent();
                $(".project-timeline").find(".feed_comment[data-commentid=" + r.comment_id + "]").remove(), 0 == a.find("a").length && a.hide(), t.alertMessage("删除成功!")
            }
        }), $("body").on("getOpenCommentFromFeedRemoteBack", function (e, t) {
            $(".project-timeline .btn-comment-more[data-topicid=" + r.entity_id + "]").hide();
            for (var i = "", a = 0; a < t.data.length; a++)i += juicer.templates["singleCmtMC.juicer"](t.data[a]);
            $(".timeline-item[data-topicid=" + r.entity_id + "] .timeline-item_content_talk__comment").html('<i class="icon-triangle"></i>' + i)
        })
    }

    var n, o = {}, r = {};
    return o.init = function (e) {
        $("#feedReplaceDiv").replaceWith(juicer.templates["feed.juicer"](e)), $("img.lazy-load").lazyload(), t.updateFancybox(), $(".mod-project-card_content_player").on("click", function () {
            $("#modal-player").show();
            var e = $(this).data("poster"), t = $(this).data("url");
            $("#modal-player .modal-show").append(juicer.templates["video_spr.juicer"]()), $("#me_player").attr("poster", e), $("#me_player").attr("src", t);
            var i = $(window).width();
            $("#me_player").attr("width", i), $("#me_player").attr("height", .75 * i), MediaElement("me_player", {
                success: function (e) {
                    n = e
                }
            })
        }), $(".icon-video-close").on("click", function () {
            $("#modal-player").hide(), n.remove()
        }), $("body").on("click", ".project-timeline .icon-comment, .project-timeline .timeline-item_content_talk__comment .feed_comment", function (e) {
            if (e.preventDefault(), !window.auth.user_uuid)return t.alertMessage("请登录后再发布评论"), !1;
            if ($(".modal-text textarea").val(""), $(".modal-count span.c-s-1").text("0"), $(this).hasClass("feed_comment")) {
                r.entity = "comment", r.entity_id = $(this).data("commentid");
                var i = $(this).data("uuid");
                if (window.auth.user_uuid == i) {
                    var a = $(this).data("commentid");
                    r = {comment_id: a}, $("#feed_delete_submit").data("from", "Feed"), $("#feed_delete_submit").data("comment_id", r.comment_id), $("#modal-comment-delete").modal("show"), $("#modal-comment-delete .modal-body").html($(this).html())
                } else {
                    var n = $(this).data("name");
                    $("#modal-comment-reply textarea.content").attr("placeholder", "回复：" + n), $("#reply_submit").data("from", "Feed"), $("#reply_submit").data("entity", r.entity), $("#reply_submit").data("entity_id", r.entity_id), $("#modal-comment-reply").modal("show")
                }
            } else r.entity = "topic", r.entity_id = $(this).data("topicid"), $("#unreply_submit").data("from", "Feed"), $("#unreply_submit").data("entity", r.entity), $("#unreply_submit").data("entity_id", r.entity_id), $("#modal-comment-unreply").modal("show");
            var o = Number($(".modal-backdrop.in").css("zIndex"));
            $(".modal-dialog.middle").css("zIndex", o + 1)
        }), $("body").on("click", ".project-timeline .btn-comment-more", function (e) {
            e.preventDefault();
            var t = $(this).data("topicid"), i = $(".timeline-item[data-topicid=" + t + "]").find(".feed_comment").eq(0).data("commentid");
            r = {comment_id: i, entity_id: t}, $("body").trigger("getOpenCommentFromFeed", [r])
        }), a()
    }, o
}), define("supportMC", ["juicer", "utils"], function (e, t) {
    function i() {
        $("body").on("addCommentFromSupportRemoteBack", function (e, i) {
            if (i.error)t.alertMessage(i.error); else {
                console.log(i, "cmt");
                var a = juicer.templates["singleCmtMC.juicer"](i.data);
                if ("comment" == n.entity && $(".mod-project-supporter .feed_comment[data-commentid=" + n.entity_id + "]").after(a), "order" == n.entity) {
                    var o = $(".mod-project-support_item[data-orderid=" + n.entity_id + "]");
                    console.log(n.entity_id, o.length), 0 == o.find(".btn-comment-more").length ? (console.log(o.find(".mod-project-support_item__detail__comment").length, 444), o.find(".mod-project-support_item__detail__comment").append(a), o.find(".mod-project-support_item__detail__comment").show()) : o.find(".feed_comment").last().after(a)
                }
            }
        }), $("body").on("deleteCommentFromSupportRemoteBack", function (e, i) {
            if (i.error)t.alertMessage(i.error); else {
                var a = $(".mod-project-supporter").find(".feed_comment[data-commentid=" + n.comment_id + "]").parent();
                $(".mod-project-supporter").find(".feed_comment[data-commentid=" + n.comment_id + "]").remove(), 0 == a.find("a").length && a.hide(), t.alertMessage("删除成功!")
            }
        }), $("body").on("getOpenCommentFromSupportRemoteBack", function (e, t) {
            $(".mod-project-supporter .btn-comment-more[data-orderid=" + n.entity_id + "]").hide();
            for (var i = "", a = 0; a < t.data.length; a++)i += juicer.templates["singleCmtMC.juicer"](t.data[a]);
            $(".mod-project-support_item[data-orderid=" + n.entity_id + "] .mod-project-support_item__detail__comment").html('<i class="icon-triangle"></i>' + i)
        })
    }

    var a = {}, n = {};
    return a.setData = function (e) {
        $(".mod-project-supporter .loading").hide();
        for (var t = 0; t < e.data.length; t++) {
            var i = $(juicer.templates["support_san.juicer"](e.data[t]));
            $(".mod-project-supporter .loading").before(i)
        }
        $("img.lazy-load").lazyload()
    }, a.init = function (e) {
        return $("#supportReplaceDiv").replaceWith(juicer.templates["support.juicer"](e.data)), 0 == e.data.project.support_number ? ($(".list-nodata").show(), void $(".mod-project-supporter .loading").hide()) : ($("img.lazy-load").lazyload(), t.updateFancybox(), $("body").on("click", ".mod-project-supporter .icon-comment, .mod-project-supporter .mod-project-support_item__detail__comment .feed_comment", function (e) {
            if (e.preventDefault(), !window.auth.user_uuid)return t.alertMessage("请登录后再发布评论"), !1;
            if ($(".modal-text textarea").val(""), $(".modal-count span.c-s-1").text("0"), $(this).hasClass("feed_comment")) {
                n.entity = "comment", n.entity_id = $(this).data("commentid");
                var i = $(this).data("uuid");
                if (window.auth.user_uuid == i) {
                    var a = $(this).data("commentid");
                    n = {comment_id: a}, $("#feed_delete_submit").data("from", "Support"), $("#feed_delete_submit").data("comment_id", n.comment_id), $("#modal-comment-delete").modal("show"), $("#modal-comment-delete .modal-body").html($(this).html())
                } else {
                    var o = $(this).data("name");
                    $("#modal-comment-reply textarea.content").attr("placeholder", "回复：" + o), $("#reply_submit").data("from", "Support"), $("#reply_submit").data("entity", n.entity), $("#reply_submit").data("entity_id", n.entity_id), $("#modal-comment-reply").modal("show")
                }
            } else n.entity = "order", n.entity_id = $(this).data("orderid"), $("#unreply_submit").data("from", "Support"), $("#unreply_submit").data("entity", n.entity), $("#unreply_submit").data("entity_id", n.entity_id), $("#modal-comment-unreply").modal("show");
            var r = Number($(".modal-backdrop.in").css("zIndex"));
            $(".modal-dialog.middle").css("zIndex", r + 1)
        }), $("body").on("click", ".mod-project-supporter .btn-comment-more", function (e) {
            e.preventDefault();
            var t = $(this).data("orderid"), i = $(".mod-project-support_item[data-orderid=" + t + "]").find(".feed_comment").eq(0).data("commentid");
            n = {
                comment_id: i,
                entity_id: t
            }, console.log(entity_id, n.entity_id, 2223), $("body").trigger("getOpenCommentFromSupport", [n])
        }), void i())
    }, a
}), function (e, t) {
    function i() {
        return e.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : e.XMLHttpRequest ? new XMLHttpRequest : void 0
    }

    function a(e, t, a, n) {
        this.uri_ = "http://" + t + "." + e + "/logstores/" + a + "/track?APIVersion=0.6.0", this.params_ = new Array, this.httpRequest_ = i(), this.sessionName_ = n || "JSESSIONID"
    }

    function n(e) {
        var t, i = "", a = {}, n = navigator.userAgent.toLowerCase();
        (t = n.match(/msie ([\d.]+)/)) ? a.ie = t[1] : (t = n.match(/firefox\/([\d.]+)/)) ? a.firefox = t[1] : (t = n.match(/chrome\/([\d.]+)/)) ? a.chrome = t[1] : (t = n.match(/opera.([\d.]+)/)) ? a.opera = t[1] : (t = n.match(/version\/([\d.]+).*safari/)) ? a.safari = t[1] : 0, a.ie && (i = "IE: " + a.ie), a.firefox && (i = "Firefox: " + a.firefox), a.chrome && (i = "Chrome: " + a.chrome), a.opera && (i = "Opera: " + a.opera), a.safari && (i = "Safari: " + a.safari), e.push("_ua_", i)
    }

    function o(e) {
        var t = navigator.userAgent, i = "";
        i += navigator.platform.indexOf("Win") > -1 ? t.indexOf("Windows NT 5.0") > -1 ? "Win2000" : t.indexOf("Windows NT 5.1") > -1 ? "WinXP" : t.indexOf("Windows NT 5.2") > -1 ? "Win2003" : t.indexOf("Windows NT 6.0") > -1 ? "WindowsVista" : t.indexOf("Windows NT 6.1") > -1 || t.indexOf("Windows 7") > -1 ? "Win7" : t.indexOf("Windows 8") > -1 ? "Win8" : "Other" : navigator.platform.indexOf("Mac") > -1 ? "Mac" : navigator.platform.indexOf("X11") > -1 ? "Unix" : navigator.platform.indexOf("Linux") > -1 ? "Linux" : "Other", e.push("_os_", i)
    }

    function r(t) {
        t.push("_scr_", e.screen.width + "*" + e.screen.height)
    }

    function s(e) {
        if (t.cookie.length > 0 && (c_start = t.cookie.indexOf(e + "="), c_start != -1))return c_start = c_start + e.length + 1, c_end = t.cookie.indexOf(";", c_start), c_end == -1 && (c_end = t.cookie.length), unescape(t.cookie.substring(c_start, c_end))
    }

    function l(i) {
        var a = t.title;
        if (null == a) {
            var n = t.getElementByTagName("title");
            a = n && n.length > 0 ? n[0] : ""
        }
        i.push("_title_", a);
        var o = "";
        t.referrer.length > 0 && (o = t.referrer);
        try {
            0 == o.length && opener.location.href.length > 0 && (o = opener.location.href)
        } catch (r) {
        }
        i.push("_ref_", o), i.push("_url_", e.location.href), i.push("_can_", t.cookie), i.push("_sid_", s(i.sessionName_))
    }

    function c(e) {
        l(e), n(e), o(e), r(e)
    }

    a.prototype = {
        push: function (e, t) {
            e && (this.params_.push(e), this.params_.push(t))
        }, logger: function () {
            for (var t = this.uri_, i = 0; this.params_.length > 0;)t += i % 2 == 0 ? "&" + encodeURIComponent(this.params_.shift()) : "=" + encodeURIComponent(this.params_.shift()), ++i;
            try {
                this.httpRequest_.open("GET", t, !1), this.httpRequest_.send(null)
            } catch (a) {
                e && e.console && "function" == typeof e.console.log && (console.log("Failed to log to ali log service because of this exception:\n" + a), console.log("Failed log data:", t))
            }
        }
    }, e.Tracker = a, e.Agent = c
}(window, document), window.SCache = {
    storage: "", key: "", location: "", init: function () {
        var e = this;
        null !== window.sessionStorage ? e.storage = 1 : e.storage = 0
    }, getKey: function () {
        return this.key
    }, getLocation: function () {
        return this.location
    }, setItem: function (e, t) {
        if (this.storage) {
            var i;
            try {
                window.sessionStorage.setItem(e, JSON.stringify(t))
            } catch (i) {
                alert(i), this.checkSpace()
            }
        }
    }, getItem: function (e) {
        if (!this.storage)return "";
        var t = window.sessionStorage.getItem(e);
        return t ? $.parseJSON(t) : void 0
    }, removeItem: function (e) {
        if (this.storage)return window.sessionStorage.removeItem(e)
    }, space: function () {
        var e = "";
        for (var t in window.sessionStorage)window.sessionStorage.hasOwnProperty(t) && (e += window.sessionStorage[t]);
        return e ? 3 + 16 * e.length / 8192 + " KB" : "Empty (0 KB)"
    }, checkSpace: function () {
        var e = this.space();
        try {
            window.sessionStorage.setItem("test-size", "1")
        } catch (t) {
            alert(e)
        }
        var i = e === this.space();
        return window.sessionStorage.removeItem("test-size"), i
    }, clearSpace: function (e) {
        if (e)for (var t in window.sessionStorage)t != e && this.removeItem(t); else window.sessionStorage.clear()
    }
}, SCache.init();
var statistics = new function () {
    var e = {};
    return this.init = function (t) {
        1 == SCache.getItem("re_btn") ? (e = t, e.position = JSON.parse(SCache.getItem("record")).position, SCache.setItem("record", this.getJsonData()), SCache.setItem("re_btn", 0), this.tracker(SCache.getItem("record"))) : (e = t, e.position = "start", SCache.getItem("record") && (e.position = ""), SCache.setItem("record", this.getJsonData()), SCache.setItem("re_btn", 0), this.tracker(SCache.getItem("record")));
        var i = this;
        $(".record").on("click", function () {
            $(this).hasClass("re-jump") ? (i.setRecord("position", i.getPosition($(this)) + "!$" + window.location.href), SCache.setItem("record", i.getJsonData()), SCache.setItem("re_btn", 1)) : (i.setRecord("position", i.getPosition($(this)) + "!$" + window.location.href), SCache.setItem("record", i.getJsonData()), i.tracker(SCache.getItem("record")))
        })
    }, this.setJsonData = function (t) {
        e = JSON.parse(t)
    }, this.setRecord = function (t, i) {
        for (var a in e)t == a && (e[a] = i)
    }, this.getJsonData = function () {
        return JSON.stringify(e)
    }, this.getPosition = function (e) {
        return e.hasClass("re-info") ? e.text() : e.find(".re-info").text()
    }, this.tracker = function (e) {
        var t = new window.Tracker("cn-hangzhou.log.aliyuncs.com", "qschou-tongji", "web"), i = JSON.parse(e);
        for (var a in i)t.push(a, i[a]);
        window.Agent(t), t.logger()
    }, this
};
define("tracking", [], function () {
});
var _hmt = _hmt || [];
!function () {
    var e = document.createElement("script");
    e.src = "//hm.baidu.com/hm.js?65dfcf8f1948f7203dd3fb620de01083";
    var t = document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(e, t)
}(), define("stats", [], function () {
}), define("dreamView", ["juicer", "fancybox", "dreamTpl", "bootstrap", "swiper", "utils", "lazyload", "qscScroll_timestamp", "fastclick", "shareMC", "footerMC", "manageMC", "feedMC", "supportMC", "tracking", "stats"], function (e, t, i, a, n, o, r, s, l, c, d, p, u, m, h, f) {
    function g() {
        var e = setInterval(function () {
            var t = $(document).scrollTop(), i = $("body")[0].scrollHeight, a = $(window).height(), n = i - t - a;
            n < 300 && (clearInterval(e), w.trigger("loadHuiBao"))
        }, 50)
    }

    function v() {
        var e = setInterval(function () {
            var t = $(document).scrollTop(), i = $("body")[0].scrollHeight, a = $(window).height(), n = i - t - a;
            n < 300 && (clearInterval(e), w.trigger("loadFeed"))
        }, 50)
    }

    var y = {}, w = $("body");
    y.UI = w;
    var b = new s, _ = "", x = {};
    return y.init = function () {
        l.attach(document.body), w.append(juicer.templates["dreamMain.juicer"]()), b.config({
            wrapper: w,
            onNeedLoad: function () {
                $(".mod-project-supporter").length > 0 && ($(".mod-project-supporter .loading").show(), w.trigger("needload", [_]))
            }
        });
        var e = 80;
        $(".modal-text textarea").data("max") && (e = $(".modal-text textarea").data("max")), $(".modal-count span.c-s-2").text(e), $(".modal-text textarea").attr("maxlength", e), $(".modal-text").on("input propertychange", "textarea", function () {
            $(this).val().length > e ? $(this).next().find(".c-s-1").text(e) : $(this).next().find(".c-s-1").text($(this).val().length)
        }), $("#unreply_submit,#reply_submit").on("click", function (e) {
            e.preventDefault();
            var t = "", i = {};
            if ("unreply_submit" == $(this).attr("id")) {
                if (t = $.trim($("#modal-comment-unreply textarea.content").val()).replace(/<(?:.|\n)*?>/gm, ""), t.length < 2)return o.alertMessage("评论最少为2个字"), !1;
                if (t.length > 80)return o.alertMessage("评论最多为80个字"), !1;
                $("#modal-comment-unreply").modal("hide")
            } else {
                if (t = $.trim($("#modal-comment-reply textarea.content").val()).replace(/<(?:.|\n)*?>/gm, ""), t.length < 2)return o.alertMessage("评论最少为2个字"), !1;
                if (t.length > 80)return o.alertMessage("评论最多为80个字"), !1;
                $("#modal-comment-reply").modal("hide")
            }
            i.entity = $(this).data("entity"), i.entity_id = $(this).data("entity_id"), i.content = t;
            var a = $(this).data("from");
            $("body").trigger("addCommentFrom" + a, [i])
        }), $("#feed_delete_submit").on("click", function (e) {
            e.preventDefault(), $("#modal-comment-delete").modal("hide");
            var t = Number($(".modal-backdrop.in").css("zIndex"));
            $(".modal-dialog.middle").css("zIndex", t + 1);
            var i = $(this).data("comment_id"), a = $(this).data("from");
            $("body").trigger("deleteCommentFrom" + a, [{comment_id: i}])
        })
    }, y.initHeader = function () {
        $("#headerReplaceDiv").replaceWith(juicer.templates["header.juicer"](window.auth)), window.auth.manager && $(".header_project_manage").click(function () {
            $("#project-admin").modal("show")
        })
    }, y.initBase = function (e) {
        x = e;
        var t = $("body"), i = e.data.project.name + " - 轻松筹";
        document.title = i;
        var a = $("<iframe style='display:none;' src='/favicon.ico'></iframe>");
        a.on("load", function () {
            setTimeout(function () {
                a.off("load").remove()
            }, 0)
        }).appendTo(t), $("#baseReplaceDiv").replaceWith(juicer.templates["base.juicer"](e.data));
        var n = $(window).height();
        $(".imgDiv").css("height", .36 * n + "px");
        new Swiper(".swiper-container.home-banner", {
            pagination: ".swiper-pagination",
            paginationClickable: !0,
            centeredSlides: !0,
            loop: !1,
            slidesPerView: "auto",
            autoplay: 3e3
        });
        console.log(e, "===res MC=="), c.init(e.data), d.init(e), p.init(e), $("img.lazy-load").lazyload(), o.updateFancybox(), g();
        var r = {
            uuid: window.auth.project_uuid,
            ip: e.data.project.ip,
            position: "start",
            ca: "project/dream",
            user_id: window.auth.user_uuid,
            session_id: e.data.project.session_id,
            extend: JSON.stringify({source: window.auth.platform, type: "dream", shareto: window.auth.shareto})
        };
        statistics.init(r)
    }, y.initHuiBao = function (e) {
        console.log(e, "==initHuiBao==>>>"), e.data && ($("#huibaoReplaceDiv").replaceWith(juicer.templates["huibao.juicer"](e)), $("img.lazy-load").lazyload(), o.updateFancybox()), v()
    }, y.initFeed = function (e) {
        e.supporter_count = x.data.project.support_number, e.data ? e.feed_count = e.data.length : e.feed_count = 0, $("#tabReplaceDiv").replaceWith(juicer.templates["tabMC.juicer"](e)), $(".mod-project-tab-control .tab-content").css("minHeight", 160), 0 == e.feed_count && ($("#project-timeline .supporter-nodata").show(), $("#project-timeline .loading").hide()), b.run(), $(".mod-project-tab-control .tab-item a").click(function (e) {
            e.preventDefault();
            var t = $(this).attr("href"), i = $(document).scrollTop(), a = $(window).height(), n = $(".mod-project-tab-control .tab-content").offset().top, o = a - (n - i);
            o = Math.max(170, o), $(".mod-project-tab-control .tab-content").css("minHeight", o), $(this).tab("show"), "#project-supporter" == t ? b.run() : b.stop(), $("img.lazy-load").lazyload()
        }), e.data && e.data.length > 0 && u.init(e), m.init(x)
    }, y.insertSupportData = function (e) {
        m.setData(e), _ = e.timestamp, e.timestamp && "null" != e.timestamp && b.run()
    }, y
}), define("dreamModel", [], function () {
    var e = {}, t = window.auth.project_uuid;
    return e.getBase = function () {
        var e = "";
        return e = location.host.indexOf("qschou.com") == -1 ? "mock/base" : "http://project.qschou.com/index/text/" + t, $.ajax({
            type: "GET",
            dataType: "json",
            url: e,
            xhrFields: {withCredentials: !0},
            cache: !1,
            crossDomain: !0
        })
    }, e.getHuiBao = function () {
        var e = "";
        return e = location.host.indexOf("qschou.com") == -1 ? "mock/huibao" : "http://project.qschou.com/v2.1.1/index/want/" + t, $.ajax({
            type: "GET",
            dataType: "json",
            url: e,
            xhrFields: {withCredentials: !0},
            cache: !1,
            crossDomain: !0
        })
    }, e.getHtml = function () {
        var e = "";
        return e = location.host.indexOf("qschou.com") == -1 ? "mock/text.html" : "http://text.qschou.com/" + t + ".html", $.ajax({
            type: "get",
            url: e,
            data: {},
            dataType: "text",
            cache: !1
        })
    }, e.getFeed = function () {
        var e = "";
        return location.host.indexOf("qschou.com") == -1 ? (e = "mock/feed", $.ajax({
            type: "GET",
            url: e,
            dataType: "json",
            cache: !1
        })) : (e = "http://feed.qschou.com/project?uuid=" + t, $.ajax({
            type: "get",
            url: e,
            dataType: "jsonp",
            jsonp: "xhr_callback"
        }))
    }, e.getEvaluate = function () {
        var e = "";
        return e = location.host.indexOf("qschou.com") == -1 ? "mock/evaluate" : "http://project.qschou.com/praise/sellertagsout/" + t, $.ajax({
            type: "GET",
            dataType: "json",
            url: e,
            xhrFields: {withCredentials: !0},
            cache: !1,
            crossDomain: !0
        })
    }, e.getSupport = function (e) {
        var i = "";
        return i = location.host.indexOf("qschou.com") == -1 ? "mock/support" + e.timestamp : "http://support.qschou.com/new/support/" + t + "?timestamp=" + e.timestamp, $.ajax({
            type: "GET",
            dataType: "json",
            url: i,
            xhrFields: {withCredentials: !0},
            cache: !1,
            crossDomain: !0
        })
    }, e.setFollow = function () {
        var e = "";
        return e = location.host.indexOf("qschou.com") == -1 ? "mock/submitFollow" : "http://project.qschou.com/index/follow/" + t, $.ajax({
            type: "post",
            dataType: "json",
            url: e,
            xhrFields: {withCredentials: !0},
            cache: !1,
            crossDomain: !0
        })
    }, e.deleteProject = function () {
        var e = "";
        return e = location.host.indexOf("qschou.com") == -1 ? "mock/deleteProject" : "http://project.qschou.com/manage/close/" + t, $.ajax({
            type: "DELETE",
            dataType: "json",
            url: e,
            xhrFields: {withCredentials: !0},
            cache: !1,
            crossDomain: !0
        })
    }, e.addComment = function (e) {
        var i = "";
        return i = location.host.indexOf("qschou.com") == -1 ? "mock/addComment" : "http://comment.qschou.com/v3/comment/add", $.ajax({
            type: "POST",
            url: i,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                entity: e.entity,
                entity_id: parseInt(e.entity_id),
                content: e.content,
                project_uuid: t
            }),
            dataType: "json",
            xhrFields: {withCredentials: !0},
            crossDomain: !0
        })
    }, e.deleteComment = function (e) {
        var i = "";
        return i = location.host.indexOf("qschou.com") == -1 ? "mock/deleteComment" : "http://comment.qschou.com/v3/comment/delete?project_uuid=" + t + "&comment_id=" + e.comment_id, $.ajax({
            type: "DELETE",
            url: i,
            contentType: "text/plain",
            xhrFields: {withCredentials: !0},
            crossDomain: !0
        })
    }, e.getOpenComment = function (e) {
        var i = "";
        return i = location.host.indexOf("qschou.com") == -1 ? "mock/getOpenComment" : "http://comment.qschou.com/v3/comment/list?project_uuid=" + t + "&comment_id=" + e.comment_id, $.ajax({
            url: i,
            type: "GET",
            dataType: "json"
        })
    }, e
}), define("dataFormat", ["utils"], function (e) {
    var t = {}, i = {s1: "审核中", s8: "已失败", s16: "冻结中", s512: "已成功"};
    return t.getTips = function (t) {
        var a = "", n = e.jsDateDiff(t.data.project.created), o = t.data.project.raise_days, r = t.data.project.state, s = t.data.project.stopped;
        if (s > 0)a = n + " | 结算中"; else if (8192 == r) {
            var l = new Date, c = Math.floor(l.getTime() / 1e3), d = Number(t.data.project.created) + 24 * o * 60 * 60, p = d - c;
            a = p < 60 ? n + " | 即将结束" : p < 3600 ? n + " | 剩余<strong>" + Math.floor(p / 60) + "</strong>分钟" : p < 86400 ? n + " | 剩余<strong>" + Math.floor(p / 3600) + "</strong>小时" : n + " | 剩余<strong>" + Math.floor(p / 86400) + "</strong>天"
        } else a = n + " | " + i["s" + r];
        var u = a.split(" | ")[0], m = a.split(" | ")[1];
        return a = {createTime: u, status: m}
    }, t
}), function (e) {
    function t() {
        try {
            return s in e && e[s]
        } catch (t) {
            return !1
        }
    }

    function i(e) {
        return function () {
            var t = Array.prototype.slice.call(arguments, 0);
            t.unshift(n), l.appendChild(n), n.addBehavior("#default#userData"), n.load(s);
            var i = e.apply(o, t);
            return l.removeChild(n), i
        }
    }

    function a(e) {
        return e.replace(p, "___")
    }

    var n, o = {}, r = e.document, s = "localStorage";
    if (o.disabled = !1, o.set = function (e, t) {
        }, o.get = function (e) {
        }, o.remove = function (e) {
        }, o.clear = function () {
        }, o.transact = function (e, t, i) {
            var a = o.get(e);
            null == i && (i = t, t = null), "undefined" == typeof a && (a = t || {}), i(a), o.set(e, a)
        }, o.getAll = function () {
        }, o.forEach = function () {
        }, o.serialize = function (e) {
            return JSON.stringify(e)
        }, o.deserialize = function (e) {
            if ("string" == typeof e)try {
                return JSON.parse(e)
            } catch (t) {
                return e || void 0
            }
        }, t())n = e[s], o.set = function (e, t) {
        return void 0 === t ? o.remove(e) : (n.setItem(e, o.serialize(t)), t)
    }, o.get = function (e) {
        return o.deserialize(n.getItem(e))
    }, o.remove = function (e) {
        n.removeItem(e)
    }, o.clear = function () {
        n.clear()
    }, o.getAll = function () {
        var e = {};
        return o.forEach(function (t, i) {
            e[t] = i
        }), e
    }, o.forEach = function (e) {
        for (var t = 0; t < n.length; t++) {
            var i = n.key(t);
            e(i, o.get(i))
        }
    }; else if (r.documentElement.addBehavior) {
        var l, c;
        try {
            c = new ActiveXObject("htmlfile"), c.open(), c.write('<script>document.w=window</script><iframe src="/favicon.ico"></iframe>'), c.close(), l = c.w.frames[0].document, n = l.createElement("div")
        } catch (d) {
            n = r.createElement("div"), l = r.body
        }
        var p = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
        o.set = i(function (e, t, i) {
            return t = a(t), void 0 === i ? o.remove(t) : (e.setAttribute(t, o.serialize(i)), e.save(s), i)
        }), o.get = i(function (e, t) {
            return t = a(t), o.deserialize(e.getAttribute(t))
        }), o.remove = i(function (e, t) {
            t = a(t), e.removeAttribute(t), e.save(s)
        }), o.clear = i(function (e) {
            var t = e.XMLDocument.documentElement.attributes;
            e.load(s);
            for (var i, a = 0; i = t[a]; a++)e.removeAttribute(i.name);
            e.save(s)
        }), o.getAll = function (e) {
            var t = {};
            return o.forEach(function (e, i) {
                t[e] = i
            }), t
        }, o.forEach = i(function (e, t) {
            for (var i, a = e.XMLDocument.documentElement.attributes, n = 0; i = a[n]; ++n)t(i.name, o.deserialize(e.getAttribute(i.name)))
        })
    }
    try {
        var u = "__storejs__";
        o.set(u, u), o.get(u) != u && (o.disabled = !0), o.remove(u)
    } catch (d) {
        o.disabled = !0
    }
    o.enabled = !o.disabled, "undefined" != typeof module && module.exports ? module.exports = o : "function" == typeof define && define.amd ? define("store", [], o) : e.store = o
}(this.window || global), define("relation", ["store"], function (e) {
    function t(e, t, i) {
        var a, n, o;
        return a = e.indexOf(t) + t.length, n = "" == i ? e.length : e.indexOf(i), o = e.substr(a, n - a)
    }

    var i = {};
    return i.init = function () {
        if (!e.get("project_not_process_relation")) {
            var i = [];
            e.set("project_not_process_relation", i), e.set("project_process_relation", i)
        }
        var a = t(window.location.href, "uuid=", "&platform="), n = window.location.href, o = e.get("project_not_process_relation"), r = e.get("project_process_relation");
        if (a && a != window.auth.user_uuid)if (o.push(n), console.log(o), "" == window.auth.user_uuid || "0" == window.auth.user_uuid)e.set("project_not_process_relation", o); else {
            var s = [];
            for (var l in o)r.toString().indexOf(o[l]) < 0 && s.push(o[l]);
            var c = {urls: s};
            $.ajax({
                type: "POST",
                data: JSON.stringify(c),
                dataType: "json",
                xhrFields: {withCredentials: !0},
                crossDomain: !0,
                url: "http://project.qschou.com/relation",
                success: function (t) {
                    t.error || (o = [], r = r.concat(s), e.set("project_process_relation", r), e.set("project_not_process_relation", o))
                }
            })
        }
    }, i
}), require(["dreamView", "dreamModel", "utils", "dataFormat", "relation"], function (e, t, i, a, n) {
    function o(e) {
        $("#toast-loading").length && $("#toast-loading").hide();
        var t = "系统繁忙,请稍后重试";
        e.responseJSON && e.responseJSON.error && (t = e.responseJSON.error), i.alertMessage(t), t.indexOf("登录") != -1 && setTimeout(function () {
            location.href = "/sign/in"
        }, 2e3)
    }

    var r = {}, s = e.UI, l = {};
    return 0 == window.auth.active ? void(location.href = "/project/error/" + window.auth.project_uuid) : ($("#toast-loading").hide(), i.is_weixin() && wx.ready(function () {
        $("body").on("click", "a.fancybox", function (e) {
            e.preventDefault(), e.stopPropagation();
            var t = $(this).data("group_id"), i = $("a.fancybox[data-group_id=" + t + "]"), a = [];
            i.each(function (e, t) {
                a.push(t.href)
            });
            var n = i.index($(this)), o = a[n];
            console.log(i.length, t, n), wx.previewImage({current: o, urls: a})
        })
    }), e.init(), e.initHeader(), t.getBase().done(function (t) {
        if (0 == t.code) {
            l = t.data;
            var n = Math.min(100, t.data.project.raised_amount / t.data.project.target_amount * 100);
            t.data.project.process = n, t.data.project.tips = a.getTips(t), t.data.project.verify_state = window.auth.verify_state, 0 == t.data.project.cover.length && (t.data.project.cover = [{image: "http://static.qschou.com/img/v6/grey_big.jpeg"}]);
            var o = i.getRequestParams(), r = o.platform;
            r && (t.data.platform = r);
            var s = o.shareto;
            s && (t.data.shareto = s), e.initBase(t)
        } else i.alertMessage(t.msg)
    }).fail(o), s.on("loadHuiBao", function () {
        t.getHuiBao().done(function (t) {
            t.auth = window.auth, e.initHuiBao(t)
        }).fail(o)
    }), s.on("loadFeed", function () {
        1 == window.auth.active && t.getFeed().done(function (t) {
            if (t.data || (t.data = []), t.data) {
                for (var a = 0; a < t.data.length; a++)t.data[a].prjuuid = window.auth.project_uuid, t.data[a].created = i.jsDateDiff(t.data[a].created);
                t.nickname = l.user.nickname, t.avatar = l.user.avatar
            }
            e.initFeed(t)
        }).fail(o)
    }), s.on("needload", function (a, n) {
        t.getSupport({timestamp: n}).done(function (t) {
            if (t.data)for (var a = 0; a < t.data.length; a++)t.data[a].prjuuid = window.auth.project_uuid, t.data[a].created = i.jsDateDiff(t.data[a].created), t.data[a].user.uuid == window.auth.user_uuid && (t.data[a].myself = !0);
            e.insertSupportData(t)
        }).fail(o)
    }), s.on("setFollow", function () {
        $("#toast-loading").show(), t.setFollow().done(function (e) {
            $("#toast-loading").hide(), s.trigger("setFollowRemoteBack", [e])
        }).fail(o)
    }), s.on("deleteProject", function () {
        $("#toast-loading").show(), t.deleteProject().done(function (e) {
            $("#toast-loading").hide(), s.trigger("deleteProjectRemoteBack", [e])
        }).fail(o)
    }), s.on("addCommentFromFeed", function (e, a) {
        i.showLoading("提交中"), t.addComment(a).done(function (e) {
            i.hideLoading(), s.trigger("addCommentFromFeedRemoteBack", [e])
        }).fail(o)
    }), s.on("addCommentFromSupport", function (e, a) {
        i.showLoading("提交中"), t.addComment(a).done(function (e) {
            i.hideLoading(), s.trigger("addCommentFromSupportRemoteBack", [e])
        }).fail(o)
    }), s.on("deleteCommentFromFeed", function (e, a) {
        i.showLoading("提交中"), t.deleteComment(a).done(function (e) {
            i.hideLoading(), s.trigger("deleteCommentFromFeedRemoteBack", [e])
        }).fail(o)
    }), s.on("deleteCommentFromSupport", function (e, a) {
        i.showLoading("提交中"), t.deleteComment(a).done(function (e) {
            i.hideLoading(), s.trigger("deleteCommentFromSupportRemoteBack", [e])
        }).fail(o)
    }), s.on("getOpenCommentFromFeed", function (e, a) {
        i.showLoading("提交中"), t.getOpenComment(a).done(function (e) {
            i.hideLoading(), s.trigger("getOpenCommentFromFeedRemoteBack", [e])
        }).fail(o)
    }), s.on("getOpenCommentFromSupport", function (e, a) {
        i.showLoading("提交中"), t.getOpenComment(a).done(function (e) {
            i.hideLoading(), s.trigger("getOpenCommentFromSupportRemoteBack", [e])
        }).fail(o)
    }), n.init(), r)
}), define("./js/dreamControl", ["dreamView", "dreamModel", "utils", "dataFormat", "relation"], function () {
});
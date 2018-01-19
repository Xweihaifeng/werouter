$(function () {


    $.ajax({
        url: '/sso-getLibJsPms',
        type: 'get',
        dataType: 'json',
        success: function(res){

            var Cookie = {

                /**
                 * 定义一个函数，用来读取特定的cookie值。
                 * @param cookie_name
                 */
                getCookie: function (cookie_name) {
                    var allCookies = document.cookie;
                    var cookie_pos = allCookies.indexOf(cookie_name);   //索引的长度
                    if (cookie_pos != -1) {
                        cookie_pos += cookie_name.length + 1;
                        var cookie_end = allCookies.indexOf(";", cookie_pos);
                        if (cookie_end == -1) {
                            cookie_end = allCookies.length;
                        }
                        var value = unescape(allCookies.substring(cookie_pos, cookie_end));
                    }

                    return value;
                },

                setCookie: function (name, value) {
                    document.cookie = name + '=' + value;
                }

            };

            var Sso = {

                ticket: '',

                config: {

                    get_ticket: {
                        url: res.get_ticket.url,
                        params: res.get_ticket.params
                    },

                    authenticate: {
                        url: res.authenticate.url,
                        params: res.authenticate.params
                    },

                    get_authenticate_params: {
                        url: res.get_authenticate_params.url,
                        params: res.get_authenticate_params.params
                    },

                    auto_login: {
                        url: res.auto_login.url,
                        params: res.auto_login.params
                    },

                    set_ticket: {
                        url: res.set_ticket.url,
                        params: res.set_ticket.params
                    },
                    ajax_login: {
                        url: res.ajax_login.url
                    }
                }
                ,

                /**
                 *
                 */
                getTicket: function () {
                    var _this = this;
                    $.ajax({
                        type: "GET",
                        url: _this.config.get_ticket.url,
                        data: _this.config.get_ticket.params,
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function (json) {
                            if (json.ret == 0) {
                                _this.ticket = json.dat._ticket;
                                _this.setTicket(json.dat._ticket);
                            }
                            else {
                                _this.ticket = '';
//                            _this.authenticate();
                            }
                        },
                        error: function () {

                        }
                    });
                },

                /**
                 *
                 */
                setTicket: function (ticket) {
                    var _this = this;

                    $.ajax({
                        type: "POST",
                        url: _this.config.set_ticket.url,
                        data: "_ticket=" + escape(ticket),
                        dataType: "json",
                        success: function (json) {
                            if (json.ret == 0) {
                                $.ajax({
                                    type: "get",
                                    url: _this.config.ajax_login.url,
                                    dataType: 'json',
                                    success: function (json) {

                                        _this.jumpUrl(json.jump);

                                    }
                                });
                            }
                            else {
                                _this.ticket = '';
                                alert(json.msg);
                            }
                        },
                        error: function () {

                        }
                    });
                },

                /**
                 *
                 */
                authenticate: function () {

                    var _this = this;

                    $.ajax({
                        type: "GET",
                        url: _this.config.authenticate.url,
                        data: _this.config.authenticate.params,
                        dataType: "jsonp",
                        jsonp: "callback",
                        success: function (json) {
                            if (json.ret == 0) {
                                _this.ticket = json.dat._ticket;
                                _this.setTicket(json.dat._ticket);
                            }
                            else {
                                _this.ticket = '';
                                alert(json.msg);
                                _this.opts.error();
                            }
                        },
                        error: function () {

                        }
                    });

                },


                jumpUrl: function (url) {

                    if (url.length != 0)
                        window.location.href = url;
                    else
                        return false;
                },

                login: function (opts) {


                    var _this = this;
                    _this.opts = opts;

                    var username = $("[name=username]").val();
                    var password = $("[name=user_pwd]").val();

                    if($.trim(username) == ''){
                        alert('请输入用户名');
                        return;
                    };

                    if($.trim(password) == ''){
                        alert('请输入密码');
                        return;
                    }


                    //用户名 和 密码加密
                    $.ajax({
                        type: "POST",
                        url: _this.config.get_authenticate_params.url,
                        data: {username: username, password: password},
                        dataType: "json",
                        success: function (json) {

                            if (json.ret == 0) {
                                _this.config.authenticate.params = json.dat;
                                _this.authenticate();
                            }
                            else {
                                console.log("获取authenticate.params失败")
                            }

                        },
                        error: function () {

                        }
                    });


                },

                /**
                 *
                 */
                init: function () {

                    var _this = this;


                      if (!Cookie.getCookie( res.ticket_config.cookie_key )) {
                        _this.getTicket();
                      }


                    // setInterval(function () {
                    //     if (!Cookie.getCookie(res.ticket_config.cookie_key)) {
                    //         _this.getTicket();
                    //     }
                    // }, 15000);

                    $("#login-btn").bind('click', this.login);
                }
            };

            window.Sso = Sso;

            Sso.init();
        }
    });



});
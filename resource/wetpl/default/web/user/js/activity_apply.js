jq164.ajaxSetup({
    headers: {
        'Token': docCookies.getItem("token")
    },
});
var id = window.location.href.split('/').pop();
var goAttend = function() {
    window.location.href = '/user/admin/activity/attend/' + id;
}
var chart = {
    init: function(weid) {
        var _self = this;
        this.getData(weid, function(data) {
            _self.createChartCity(data.city);
            _self.createChartPosition(data.position);
            _self.createChartTimeLine(data.timeline);
        });
    },
    getData: function(weid, callback) {
        var _self = this;
        var url = ACTIVITY_ENROLL_STATISTICS;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: {
                activity_id: weid
            },
            success: function(res) {
                if (res.code == 200) {
                    var data = _self.formatData(res.data);
                    callback && callback(data);
                } else {
                    $('.data').hide();
                }
            },
            error: function(xhr, code, error) {
                notice.alert(error);
            },
            complete: function() {}
        });
    },
    formatData: function(data) {
        var colors = ['#24aa98', '#65abd0', '#d9c26c', '#db7560', '#af6dd5', '#898e93', '#32b9e6', '#8cbe52', '#ffab27', '#c88b76'];
        var tmp = {
            city: [],
            position: [],
            timeline: {
                labels: [],
                datasets: [{
                    label: "报名数据",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                }]
            }
        };
        for (var i = 0; i < data['city'].length; i++) {
            var city = data['city'][i];
            tmp.city.push({
                value: city.value,
                color: colors[i],
                highlight: colors[i],
                label: city.name
            });
        };
        for (var i = 0; i < data['position'].length; i++) {
            var position = data['position'][i];
            tmp.position.push({
                value: position.value,
                color: colors[i],
                highlight: colors[i],
                label: position.name
            });
        };
        for (var i = 0; i < data['timeline'].length; i++) {
            var time = data['timeline'][i];
            tmp.timeline.labels.push(time.name);
            tmp.timeline.datasets[0].data.push(time.value);
        }
        return tmp;
    },
    createChartCity: function(data) {
        this.createDoughnut('J_ChartCity', data);
        this.createList('J_ListCity', data);
    },
    createChartPosition: function(data) {
        this.createDoughnut('J_ChartPosition', data);
        this.createList('J_ListPosition', data);
    },
    createChartTimeLine: function(data) {
        var chart = this.getChart('J_ChartTimeLine');
        chart.Line(data);
    },
    createDoughnut: function(id, data, options) {
        if (!options) options = {};
        var chart = this.getChart(id);
        chart.Pie(data, options);
    },
    getChart: function(id) {
        var ctx = document.getElementById(id).getContext('2d');
        var chart = new Chart(ctx);
        return chart;
    },
    createList: function(id, list) {
        var html = '';
        var total = 0;
        for (var i = 0; i < list.length; i++) {
            total += parseInt(list[i].value);
        }
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            var percent = item.value / total * 100;
            html += '<li><span class="mark" style="background-color:' + item.color + '"></span>' + item.label + ' <label>' + percent.toFixed(1) + '%</label></li>';
        };
        $('#' + id).append(html);
    }
}

// 活动详情
var loadActivity = function(weid, callback) {
    $.ajax({
        url: ACTIVITY_DETAIL + '/' + weid,
        type: 'GET',
        headers: {
            'Token': docCookies.getItem("token")
        },
        success: function(data) {
            if (data.code == 200)
                callback(data.data);
            else
                notice.alert(data.message);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

// 活动报名数
var loadCount = function(weid, callback) {
    $.ajax({
        url: ACTIVITY_ENROLL_COUNT,
        type: 'GET',
        data: {
            activity_id: weid
        },
        headers: {
            'Token': docCookies.getItem("token")
        },
        success: function(data) {
            if (data.code == 200)
                callback(data.data);
            else
                notice.alert(data.message);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

// 活动售票情况
var loadTickets = function(weid, callback) {
    $.ajax({
        url: ACTIVITY_ENROLL_TICKETS,
        type: 'GET',
        data: {
            activity_id: weid
        },
        headers: {
            'Token': docCookies.getItem("token")
        },
        success: function(data) {
            if (data.code == 200)
                callback(data.data);
            else
                notice.alert(data.message);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

// 导出列表
var exportCsv = function(weid) {
    location.href = '/export?type=activity_enroll_list&activity_id=' + weid;
}

// 短信通知
var smsNotify = function(weid, enroll_id, callback) {
        layer.load();
        $.ajax({
            url: ACTIVITY_ENROLL_SMS_NOTIFY,
            type: 'POST',
            data: {
                activity_id: weid,
                enroll_id: enroll_id
            },
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                layer.closeAll('loading');
                if (data.code == 200)
                    callback(data.data);
                else
                    notice.alert(data.message);
            },
            error: function(xhr) {
                layer.closeAll('loading');
                console.log(xhr);
            }
        });
    }
    // 群发短信通知 - 全部发送
var allSmsNotify = function(weid, callback) {
        common.loading('正在发送...', function(hideLoading) {
            $.ajax({
                url: ACTIVITY_ENROLL_ALL_SMS_NOTIFY,
                type: 'POST',
                data: {
                    activity_id: weid
                },
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data) {
                    hideLoading();
                    if (data.code == 200)
                        callback(data.data);
                    else
                        notice.alert(data.message);
                },
                error: function(xhr) {
                    hideLoading();
                    console.log(xhr);
                }
            });
        });
    }
    // 群发短信通知 - 选择性发行
var multiSmsNotify = function(weid, userIds, callback) {
    common.loading('正在发送...', function(hideLoading) {
        $.ajax({
            url: ACTIVITY_ENROLL_MULTI_SMS_NOTIFY,
            type: 'POST',
            data: {
                activity_id: weid,
                user_ids: userIds
            },
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                hideLoading();
                if (data.code == 200)
                    callback(data.data);
                else
                    notice.alert(data.message);
            },
            error: function(xhr) {
                hideLoading();
                console.log(xhr);
            }
        });
    });
}

$(document).on('click', '.all-sms-notify', function() {
    confirmer = layer.confirm('快捷发送方式将通知该活动所有报名者，若要指定接收人，请使用"短信管理"中的高级群发功能。<br>您确认要快捷发送通知吗？', {
        title: '快捷发送通知',
        btn: ['确认发送', '取消']
    }, function() {
        layer.close(confirmer);
        allSmsNotify(id, function(data) {
            layer.msg('已发送!');
        });
    }, function() {});
});
$(document).on('click', '.multi-sms-notify', function() {
    var smsAlert = layer.open({
        skin: 'layui-layer-rim',
        type: 1,
        area: ['530px', '500px'],
        title: 0,
        closeBtn: true,
        shadeClose: true,
        scrollbar: false,
        btn: ['确认发送', '取消'],
        yes: function() {
            var result = selector.getResult();
            if (result.length === 0) {
                layer.msg('请选择接收人');
                return;
            } else {
                multiSmsNotify(id, result, function(data) {
                    layer.msg('已发送!');
                });
            }
        },
        content: `    <div id="ui-fs" class="ui-fs">
        <div class="ui-fs-result clearfix">
        </div>
        <div class="ui-fs-input">
            <input type="text" value="输入报名者手机号码进行筛选" maxlength="30" />
            <a class="ui-fs-icon" href="javascript:void(0)" title="查看所有">查看所有</a>
        </div>
        <div class="ui-fs-list">
            数据加载中....
        </div>
        <div class="ui-fs-all">
            <div class="top">
                <select id="ui-fs-friendtype"><option value="-1">所有报名者</option></select>
                <div class="close" title="关闭">关闭</div>
            </div>
            <div class="ui-fs-allinner">
                <div class="page clearfix">
                    <div class="llight1">还有<b>30</b>人可选</div>
                    <div class="page-link"><span class="prev">上一页</span><span class="next">下一页</span></div>
                </div>
                <div class="list clearfix">
                    数据加载中...
                </div>
            </div>
        </div>
    </div>`,
        end: function() {},
        shade: 0.2
    });


    var selector;
    $.getScript("/common/friendsuggest/ui.friendsuggest.js", function() {
        selector = new giant.ui.friendsuggest({
            ajaxUrl: "/api/activity/enroll/fetcher?activity_id=" + id,
            ajaxLoadAllUrl: "/api/activity/enroll/fetcher?activity_id=" + id,
            ajaxGetCountUrl: "/api/activity/enroll/fetcher_count?activity_id=" + id,
            ajaxGetFriendTypeUrl: "/api/activity/enroll/fetcher_type?activity_id=" + id,
            totalSelectNum: 200,
        });
    });
});



$(document).on('click', '.self-sms', function() {
    location.href = "/user/admin/activity/sms/" + id;
});

$(document).on('click', '.sms-notify', function() {
    var enroll_id = $(this).closest('tr').data('id');
    confirmer = layer.confirm('确认要发送？', {
        title: '短信通知',
        btn: ['确认发送', '取消']
    }, function() {
        layer.close(confirmer);
        smsNotify(id, enroll_id, function(data) {
            layer.msg('已发送!');
        });
    }, function() {});
});

$(document).on('click', '.export-csv', function() {
    exportCsv(id);
});


$(document).ready(function() {
    // const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';


    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    console.log('logo:', favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:', logo);
    $('#home img').attr('src', logo);

    var tusitemp = "";

    function mess_tusi(strs) {
        //清除事件
        clearTimeout(tusitemp);
        $("#mess_tusi").remove();
        //创建吐丝层并写入内容
        if (!$("#mess_tusi").attr("id")) { //吐丝层不存在创建
            $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>" + strs + "</span></div>"); //写入内容
        } else {
            $("#mess_tusi").html(strs); //写入内容
        }

        //定义吐丝层位置
        var left = ($(window).width() - $("#mess_tusi").width()) / 2 - 180; //居中
        var top = $(window).height() * 0.5;
        $("#mess_tusi").css({ "left": left + "px", "top": top + "px" });

        //显示吐丝层
        $("#mess_tusi").css("display", '');

        //2秒后关闭
        tusitemp = setTimeout(function() {
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        }, 2000);
        return false;
    }
    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }

    var domain;
    var hasDomain = function(weid) {
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                if (data.code == 401) {
                    // domain = '/index';
                    localStorage.removeItem('token')
                        // window.location.href = '/login'
                }
                if (data.code == 200) {
                    console.log(data);
                    if (data.data == null) {
                        //没有个性域名
                        domain = '/index';
                    } else {
                        //存在个性域名
                        domain = "/" + data.data.domain;
                    }

                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    var weid = docCookies.getItem("weid");
    hasDomain(weid);


    // 列表模板
    var num = 0;
    var ticketInfo = function(ticketInfo) {
        var html = '';
        for (key in ticketInfo) {
            html += '<p><label>' + ticketInfo[key].name + '</label><span>' + ticketInfo[key].price + '元 x ' + ticketInfo[key].num + '</span></p>';
        }
        return html;
    }
    var listtemplate = function(data) {
        console.log(num);
        num++;
        var listhtml = '<tr data-id="' + data.weid + '">' +
            // '<td class="chk"><input type="checkbox" class="boxsty J_CkbItem" data-id="' + data.weid + '"></td>' +
            '<td class="queue">' + num + '</td>' +
            `<td class="user">
            <div class="user-avatar"><img src="` + ApiMaterPlatQiniuDomain + data.avatar + `" width="45"></div>` +
            `<div class="user-desc">
                <div class="username">` + data.real_name + `</div>` +
            `<div class="company"><span>` + data.company + `</span><span>` + data.position + `</span></div>
            </div>` +
            '</td>' +
            '<td class="mobile">' + data.phone + '</td>' +
            '<td class="ticket">' +

            (data.type == 1 ? ' <img data-toggle="modal" data-target="#myModal" src="/common/img/ticket-apply.png">' : ticketInfo(data.ticketInfo)) +

            '</td>' +

            '<td class="operate">' +


            ' <span style="color:#34b0df;">报名成功</span>' +


            '</td>' +

            '<td class="operate">' +


            ' <span style="color:#34b0df;"><button class="btn btn-primary sms-notify">短信通知</button></span>' +


            '</td>' +

            '</tr>';
        return listhtml;
    }
    var weid = docCookies.getItem("weid");


    // 1.获取活动报名列表
    var applylistdetail = function(weid, type = 0, page = 1, keywords = "") {

        var limit = 5;
        var name = "";
        var telphone = "";
        if (keywords != '') {
            if (keywords.filter == "mobile") {
                telphone = keywords.kewords;

            } else if (keywords.filter == "name") {
                name = keywords.kewords;
            }
        }

        console.log(keywords);
        var sendData = {
            activity_id: weid,
            limit: limit,
            page: page,
            name: name,
            telphone: telphone
        }

        $.ajax({
            url: ACTIVITY_ENROLL_LISTS_WITH_TICKETINFO + '?status=1',
            type: 'GET',
            data: sendData,
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    $(".J_EntryList").children().remove();
                    if (data.data.list.length > 0) {
                        $('.data').show();
                    }
                    data.data.list.map(x => {
                        $(".J_EntryList").append(listtemplate(x));

                    })

                    // 页码start
                    var pagenum = Math.ceil(data.data.total / limit);
                    pagefun(pagenum, weid, type, keywords);


                    $('.J_CkbItem').bind('change', function() {
                        var chk = this.checked;
                        console.log(chk);
                        if (chk) {
                            $('.operation .del').css('color', '#E85349');
                            $('.operation .del').css('border', '2px solid #E85349');
                        } else {
                            $('.operation .del').css('color', '#b4bbc2');
                            $('.operation .del').css('border', '2px solid #b4bbc2');
                        }
                        $('.J_CkbAll').get(0).checked = chk;
                    });

                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    if (id != null && id != '' && id.length == 36) { applylistdetail(id); }
    // applylistdetail(weid);

    // 加载活动详情
    loadActivity(id, function(data) {
        $("#J_ActivityTitle").text(data.title);
    })

    // 加载报名数
    loadCount(id, function(data) {
        $(".entry-num span.ticket-count").text(data.enrollCount);
        $(".entry-num span.peaple-count").text(data.peapleCount);
    });

    // 加载售票情况
    loadTickets(id, function(data) {
        var html = '';
        $.each(data.tickets, function(k, v) {
            html += `<tr>
            <td>` + v.name + `</td>
            <td>` + v.total_num + `</td>
            <td>` + v.sold_num + `</td>
            <td>` + v.price + `</td>
            <td>` + v.sold_fee + `</td>
        </tr>`;
        });
        $(".account table tbody").html(html);
    });

    // 加载统计
    chart.init(id);

    // 页码
    var pagefun = function(pagenum, weid, type = 0, keywords) {
        // console.log(pagenum+":pagenum");
        var pagestr = "";
        console.log(flagpage);
        if (flagpage) {
            $('.pagination').children().remove();
            $('.pagination').append('<li id="prev"><a href="javascript:void(0);">«</a></li><li class="active"><span>1</span></li>');

            for (i = 1; i < pagenum; i++) {
                // $('.pagination').append(pagelisthtml(i));
                pagestr += '<li><a href="javascript:void(0)" id="' + (i + 1) + '">' + (i + 1) + '</a></li>';

            }
            $('.pagination').append(pagestr);
            $(".pagination").append('<li id="next"><a href="javascript:void(0)" class="next" rel="next">&raquo;</a></li>');
            // 点击页码事件
            $(".pagination li").bind("click", function() {
                flagpage = false;
                // console.log($(this).attr("id"));
                if ($(this).attr('class') != "active") {
                    var prevactive = parseInt($(this).parent().find('.active span').text());
                    var curr = $(this).find('a').text();
                    if ($(this).attr("id") == "prev") {
                        if (prevactive > 1) {
                            $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                            $(this).parent().find('.active').prev().append('<span>' + (prevactive - 1) + '</span>').find('a').remove();
                            $(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive-1);
                            applylistdetail(weid, type, prevactive - 1, keywords);
                        }
                    } else if ($(this).attr("id") == "next") {
                        if (prevactive < pagenum) {
                            $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                            $(this).parent().find('.active').next().append('<span>' + (prevactive + 1) + '</span>').find('a').remove();
                            $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive+1);
                            applylistdetail(weid, type, prevactive + 1, keywords);

                        }

                    } else {

                        applylistdetail(weid, type, $(this).find("a").text(), keywords);

                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                        $(this).addClass("active").siblings().removeClass('active');
                        $(this).append('<span>' + curr + '</span>').find('a').remove();
                    }

                }


            })
        }
    }


    // 2.姓名和手机查询
    $('#J_SearchType').on('mouseover', function() {
        $(this).addClass('hover');
    });
    $('#J_SearchType').on('mouseleave', function() {
        $(this).removeClass('hover');
    });
    //搜索类型对象
    var typeObj = {
        name: '姓名',
        mobile: '手机'
    };
    //搜索条件对象
    var searchObj = {
        page: 1,
        filter: 'name'
    };
    $('.J_SearchOtherType').click(function() {
        var other = $('.J_SearchSelectedType').data('type');
        var selected = $(this).data('type');
        //交换选中和未选中的值
        $('.J_SearchSelectedType').data('type', selected);
        $('.J_SearchSelectedType>span').text(typeObj[selected]);
        $(this).data('type', other);
        $(this).text(typeObj[other]);

        if (selected == 'mobile') {
            $('#J_InputSearchCondition').attr('placeholder', '请输入手机号');
            $('#J_InputSearchCondition').val('');
        } else {
            $('#J_InputSearchCondition').attr('placeholder', '请输入用户姓名');
            $('#J_InputSearchCondition').val('');
        }
        //修改筛选条件
        searchObj.filter = selected;
        //隐藏
        $('#J_SearchType').removeClass('hover');


    });
    $("#J_BtnSearchEntry").click(function() {
        // 根据selected不用类型查询
        num = 0;
        var keywords = $("#J_InputSearchCondition").val();
        searchObj.kewords = keywords;
        applylistdetail(id, 0, 1, searchObj);
    })

    $('.J_CkbAll').change(function() {
        var chk = this.checked;
        $('.J_CkbItem').each(function() {
            if ($(this).attr('disabled') == undefined) {
                this.checked = chk;
                if (chk) {
                    $('.operation .del').css('color', '#E85349');
                    $('.operation .del').css('border', '2px solid #E85349');
                } else {
                    $('.operation .del').css('color', '#b4bbc2');
                    $('.operation .del').css('border', '2px solid #b4bbc2');
                }
            }
        })
    });
    //批量删除
    var flagapply = 0;
    $('.J_BtnDelAllRecord').click(function() {
        var activeid = $('#aid').val();
        var ids = [],
            type = parseInt($(this).data('type'), 10);
        $('.J_CkbItem').each(function() {
            if (this.checked) {
                ids[ids.length] = $(this).data('id');
                console.log($(this).data('id'));
            }
        });
        if (ids.length > 0) {
            layer.confirm('确认要批量删除？', {
                title: '删除报名',
                btn: ['确认删除', '取消']
            }, function() {
                ids.map(x => {
                    flagapply++;
                    console.log(x);
                    $.ajax({
                        type: 'get',
                        url: ACTIVITY_ENROLL_DESTROY + "/" + x,
                        headers: {
                            'Token': docCookies.getItem("token")
                        },
                        success: function(data) {
                            console.log(data);
                            if (data.code == 200) {
                                if (flagapply >= ids.length) {
                                    mess_tusi('删除成功');
                                    location.reload();
                                }
                            } else {
                                mess_tusi('删除失败');
                            }
                        }
                    })
                })
            }, function() {

            });
        } else {
            mess_tusi('请至少勾选一个');
        }
    });



    // 1.1数据统计
    var numfan = function(weid) {
        $.ajax({
            url: ACTIVITY_USERINFO + '/' + weid,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {

                    $(".all_total").text(data.data.count);
                    $(".no_total").text(data.data.nocount);
                    $(".ing_total").text(data.data.oncount);
                    $(".end_total").text(data.data.offcount);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }
    numfan(weid);
    // 5.未发布/进行中/已结束
    $("#J_Filter li").bind("click", function() {
        $(this).addClass("selected").siblings().removeClass("selected");
        var type = $(this).data("id");
        activitylist(weid, type);
    })



    //2.用户商品列表
    var flagpage = true;




    // 全选
    $('#choose_all').click(function() {
        if (this.checked) {
            $('.pro_list :checkbox').attr("checked", true)
        } else {
            $('.pro_list :checkbox').attr("checked", false)
        }
    });
    //已下架/出售中/已售完商品
    $(".nav-filter li").click(function() {
        // flagstatus=true;
        flagpage = true;
        $(this).addClass("current").siblings().removeClass("current");
        console.log($(this).data("id"));
        if ($(this).data("id") == 3) {
            console.log("scock:");
            if ($(".filter-category").val() != 0) {
                usershoplist({ cateid: $(".filter-category").val(), statusid: $(this).data("id") }, 4, 1);

            } else {
                usershoplist($(this).data("id"), 3, 1);

            }

        } else {
            if ($(".filter-category").val() != 0) {
                usershoplist({ cateid: $(".filter-category").val(), statusid: $(this).data("id") }, 4, 1);

            } else {
                usershoplist($(this).data("id"), 2, 1);


            }

        }

    })
    var offon = function(_that, statusid) {
            if (statusid == 2) {
                _that.text("上架")
                    // _that.attr("data-id",statusid-1);
                _that.data("id", statusid - 1);

            } else if (statusid == 1) {
                _that.text("下架");
                // _that.attr("data-id",statusid+1);
                _that.data("id", statusid + 1);

            }
        }
        //4.商品分类
    var cateType = [];
    var catesfun = function(weid, id) {
            $.ajax({
                // url: "http://apitest.wezchina.com/goods/cates/list",
                url: GOODS_CATES_LIST_USERID + "/" + weid,
                type: 'get',
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data) {
                    console.log(data);
                    if (data.code == 200) {
                        var cate = data.data;
                        // $(".filter-category").children().remove();

                        cate.map(x => {
                            if (x.weid == id) {
                                var selected = "selected";
                            } else {
                                var selected = "";
                            }
                            $(".filter-category").append(
                                '<option ' + selected + ' value=' + x.weid + '>' + x.name + '</option>'
                            )
                            cateType.push({ id: x.weid, name: x.name });
                        })
                        if (id.length == 36) {
                            usershoplist(id, type = 1);
                        }
                        $(".filter-category").bind("change", function() {
                            flagpage = true;
                            console.log($(".nav-filter .current").data("id"));
                            // 通过分类查找商品列表
                            if ($(".nav-filter .current").data("id") > 0) {
                                usershoplist({ cateid: $(this).val(), statusid: $(".nav-filter .current").data("id") }, type = 4);

                            } else {
                                usershoplist($(this).val(), type = 1);

                            }
                        })

                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        }
        // catesfun(weid);
        // 5.商品下架请求
    var flagstatus = 0;
    var _that = "";
    var offlinefun = function(id, statusid, checklen = 1) {
            console.log(statusid);

            var sendData = {
                weid: id,
                status: statusid
            }
            $.ajax({
                url: GOODS_UPDATE,
                type: 'post',
                data: sendData,
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data) {
                    console.log(data);
                    if (data.code == 200) {
                        var shopdata = data.data;
                        //下架成功后
                        flagstatus++;
                        console.log(checklen + ":checklen");
                        console.log(flagstatus + ":flagstatus");
                        if (checklen > 1) {
                            if (flagstatus == checklen) {
                                location.reload();


                            }
                        } else {
                            mess_tusi("修改成功");
                            offon(_that, statusid);
                        }


                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        }
        // 6.删除商品
    var delshop = function(id) {
        console.log(id);
        $.ajax({
            url: GOODS_DESTROY + '/' + id,
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    var shopdata = data.data;
                    location.reload();
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    // 3.商品列表模板
    var coverId = 0;
    var coverPicId = '';
    var coverPicpath = '/common/img/products_load.jpg';
    var shopListTemplete = function(data) {
        coverPicId = "cover-pic-" + coverId;
        if (data.cover != '') {
            coverPicpath = ApiMaterPlatQiniuDomain + data.cover;
        }
        /*if(data.sort==null){
            var sortnum=0;
        }else{
            var sortnum=data.sort;
        }*/
        if (data.status == 1) {
            var linetext = "下架";
            var lineclass = "offline";
            var lineid = 2;
        } else if (data.status == 2) {
            var linetext = "上架";
            var lineclass = "online";
            var lineid = 1;
        }
        if (data.stock == null || data.stock == "") {
            data.stock = 0;
        }
        var templete = '<li class="clearfloat" data-id="' + data.weid + '">' +
            '<input type="checkbox" name="pro_list" class="product_checkbox">' +
            '<div class="pro_info">' +
            '<img src="' + coverPicpath + '">' +
            '<div>' +
            '<span>' + data.title + '</span>' +
            '</div>' +
            '</div>' +
            '<span class="pro_price">' + data.price + '</span>' +
            '<span class="sell_num">' + data.sales_num + '</span>' +
            '<span class="pro_inventory">' + data.stock + '</span>' +
            '<span class="pro_sort_info">' + data.catename + '</span>' +
            '<span class="pro_order_info">' + data.sort + '</span>' +
            '<div class="pro_operate_box">' +
            '<span>' +
            '<a class="cmd-btn shopedit" href="javascript:;" >编辑</a>' +
            '<a class="cmd-btn offline" data-id=' + lineid + ' data-mutil="0" href="javascript:;" data-key="offline">' + linetext + '</a>' +
            '<a class="cmd-btn del" data-id="' + data.weid + '" data-mutil="0" href="javascript:;" data-key="del">删除</a>' +
            '</span>' +
            '</div>' +
            '</li>'
        return templete;
    }






    //商品浏览数暂未写
    var readAmount = function(id) {
        //console.log(id);
        $.ajax({
            url: ARTICLES_VIEW,
            type: 'post',
            data: { "articleId": id },
            success: function(data) {
                //console.log(data);
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }




    //获取通用用户信息
    var getUserInfo = function() {
        $.ajax({
            url: FOUNDER,
            type: 'get',
            success: function(data) {
                //console.log(data);
                if (data.code == 200) {
                    var info = data.data;
                    var weid = info.weid;
                    if (info.avatar != "") {
                        $("#head-icon, .user-head").css({
                            "background": "url(" + info.avatar + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        $("#head-icon, .user-head").css({
                            "background": "url(/common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

                    $(".line-0").html(
                        info.nickname + '<img src="/common/img/vrenzheng.png" alt="">'
                    );
                    $(".line-1").text(info.motto);
                    $(".user-cnt").text(info.nickname);
                    // artCount(weid);
                    // artTypeList(weid);

                    // catesfun(weid);


                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    //getUserInfo();

    var artCount = function(weid) {
        $.ajax({
            url: ARTICLES_LISTCOUNT + "?userId=" + weid,
            type: 'get',
            success: function(data) {
                //console.log(data);
                if (data.code == 200) {
                    $(".user-art").children('div:eq(0)').text(data.data);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }



    // 鼠标滑动到列表时加hover
    var lihover = function() {
            $(".ws_item li").mouseenter(function() {
                $(this).addClass("hover")
            }).mouseleave(function() {
                $(this).removeClass("hover")
            })
        }
        // 没有商品时显示
    var ulnone = function(obj) {
        obj.each(function() {
            var liLen = $(this).children("li").length;
            var licum = Math.ceil(liLen / 3);
            $(this).attr('licum', licum)
            if (licum > 1) {
                $(this).siblings(".ws_item_more").css("visibility", 'visible');
            } else if (licum == 0) {
                $(this).css("height", "50px").append('<li class="clearfloat" style="text-align: center;line-height: 136px;">暂时没有符合条件的商品</li>');
            }
        })
    }

    //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e) {
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css({
                "line-height": "65px",
                "padding-top": "10px"
            });
            $("#" + id + " .word").css("margin-top", "-35px");
        } else {
            if (!isLogin) {
                $(this).css({
                    "line-height": "65px",
                });
                // $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function() {
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })


})
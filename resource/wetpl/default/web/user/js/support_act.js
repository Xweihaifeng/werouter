/**
 * Created by Yaoer on 2017/8/6.
 */


// 判断 sessionStorage
if (sessionStorage.lastname == "we_title_5") {
    $("#we_title_5").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_5").find(".title-img").css("transform", "rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:', favicon);
$('#favicon').attr('href', favicon);
//获取当前网址，如： http://localhost:8083/proj/meun.jsp
var curWwwPath = window.document.location.href;
//获取主机地址之后的目录，如： proj/meun.jsp
var pathName = window.document.location.pathname;
var pos = curWwwPath.indexOf(pathName);
//获取主机地址，如： http://localhost:8083
var localhostPath = curWwwPath.substring(0, pos);
$(document).ready(function() {

    var tickettemplate = function(data) {
        var tickethtml = '<div class="ticket-box">' +
            '<div class="ticket-box-top">' +
            '<div class="t_blank"></div>' +
            '<div class="ticket-qr"></div>' +
            '<div class="bar-code"><svg></svg></div>' +

            '<div style="width:92%;text-align:center;margin:0 auto;">票号：' + data.ticket_num + '</div>' +
            '<div style="width:92%;text-align:center;margin:0 auto;">活动时请向发起人展示</div>' +
            '</div>' +
            '<div class="ticket-box-bottom">' +
            '<div class="ticket-title">' + data.title + '<span class="qun-chat">[群聊]</span></div>' +
            '<div class="ticket-time">' + data.begain_time + '&nbsp;' + data.begain_week + '&nbsp;' + data.begain_hour + '~~' + data.end_time + '&nbsp;' + data.end_week + '&nbsp;' + data.end_hour + '</div>' +
            '<div class="ticket-addr"><span><i class="fa fa-map-marker"></i></span>&nbsp;：' + data.area_name + data.address + '</div>' +
            '<div class="ticket-detail">' +
            '<div class="ticket-name">' +
            '<span class="sign_ticname"></span>：' + data.name +
            '</div>' +
            '<div class="ticket-phone">' +
            '<span class="sign_telphone"></span>：' + data.telphone +
            '</div>' +
            '<div class="ticket-position">' +
            '<span class="sign-ticzw"></span>：' + data.poistion +
            '</div>' +
            '<div class="ticket-company">' +
            '<span class="sign-ticcom"></span>：' + data.company +
            '</div>' +
            '</div>' +
            '<div class="ticket"></div>' +
            '</div>' +
            '</div>';
        return tickethtml;
    }
    var activity_ebroll_detail = function(id, domainid, activityid) {
        $.ajax({
            url: ACTIVITY_ENROLL_DETAIL + "/" + id, //活动报名详情
            type: 'get',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    // console.log(urlall[0])
                    $(".modal-body .ticket_apply").children().remove();
                    $(".modal-body .ticket_apply").append(tickettemplate(data.data));
                    if (data.data.is_open_qun == 2) {
                        $('.qun-chat').css('display', 'inline-block');
                    }
                    var qrImg = imgSet(data.data.wx_qun_qrcode, 0, 0);
                    $('.qun-chat').click(function() {
                        layer.open({
                            type: 1,
                            area: ['320px', '320px'],
                            title: 0,
                            closeBtn: 0,
                            shadeClose: true,
                            scrollbar: false,
                            content: '<div class="qun-qrcode"><img src="' + qrImg + '" alt=""></div>'
                        });
                    });
                    $('.ticket').children().remove();
                    if (data.data.type == 2) {
                        for (var i = 0; i < data.data.tickets.length; i++) {
                            var dom =
                                '<div class="ticket-item">' +
                                '<p>' + data.data.tickets[i].name + '</p>' +
                                '<div class="tic-price">' +
                                '<span>￥' + data.data.tickets[i].price + '</span>' +
                                '</div>' +
                                '<div class="num">' +
                                '<span>×' + data.data.tickets[i].count + '</span>' +
                                '</div>' +
                                '</div>';
                            $('.ticket').append(dom);
                        }
                    }
                    qrcodefun1(activityid, domainid, data.data.ticket_num);
                    barcode('.bar-code svg', data.data.ticket_num);
                }

            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }
    var qrcodefun1 = function(id, domainid, ticket_num) {
            var qrcode_val = ticket_num;
            $(".ticket-qr").attr("data-ref", qrcode_val);
            // if ($.browser.msie && $.browser.version <= 8){
            if ($.support.msie && $.support.version <= 8) {

                $(".ticket-qr").qrcode({
                    render: "table",
                    width: 110,
                    height: 110,
                    text: qrcode_val
                });
            } else {
                jQuery(".ticket-qr").qrcode({
                    width: 110,
                    height: 110,
                    text: qrcode_val
                });
            }

        }
        // 条形码生成
    var barcode = function(selector, ticket_num) {
        JsBarcode(selector, ticket_num, {
            format: "CODE128",
            width: 2,
            height: 50,
            displayValue: false,
            text: ticket_num,
            background: "#fff",
            lineColor: "#000",
            margin: 5
        });
    }
    var articleTemplate = function(data) {
        var act_title = "";
        if (data.title != "" && data.title != null && data.title != undefined) {

            if (data.title.length > 17) {
                act_title = data.title.substring(0, 17);
            } else {
                act_title = data.title;
            }
        }
        if (data.is_attend == 1)
            var mark = `<div class=""><span style="display: block;height: 23px;line-height: 31px;color: #828282!important;">已参与</span></div>`;
        else {
            if (data.is_expired == 1)
                var mark = `<div class="show-tiket">已过期</div>`;
            else if (data.status == 2)
                var mark = `<div class="show-tiket support" data-activity-id="` + data.activity_id + `">去支付</div>`;
            else
                var mark = `<div class="show-tiket" data-toggle="modal" data-target="#myModal">查看门票</div>`;
        }

        var template =
            `<div class="show-art" style="margin:0;border-top:1px solid #e6e6e6;display:block;width: 479px;height: 330px;border-right:0px solid #fff;border-bottom:0px solid #fff;border-left:0px solid #fff;" id=` + data.activity_id + `>       
            <div class="myself" style="width: 100%;height: 24px;margin-top: 24px;">
                <div class="my_con" style="width: 70%;height: 24px;float: left;">
                     <div class="whoimg" style="width: 24px;height: 24px;border-radius: 50%;background: blue;float: left;"><img src="" alt=""></div>
                     <span style="font-size: 14px;color: #666;float: left;line-height: 24px;margin-left: 6px;">` + data.name + `</span>
                </div>
                <div class="my_join" style="width: 12%;height: 24px;line-height: 24px;font-size: 13px;float: right;color: #666">
                    <span style="float: right">` + mark + `</span>
                </div>
            </div>
            <div class="show-pic" style="width: 460px;height: 160px;margin: 15px 0 0 0;"></div>
            <div style="height: 33px;line-height: 33px!important;padding: 0;" class="show-title"  id=` + data.domain + `>
                <div class="at" style="height: 100%!important;font-size: 16px;color: #333;">` + data.title.substring(0, 17) + `</div>
            </div>
            <div class="show-cont" style="width:100%;padding-left:0;height: 37px;overflow: hidden;"><p class="text2" style="">` + data.summary.substring(0, 110) + `</p></div>
             
            </div>`

        return template;
    }
    // <div class="show-bottom text-center" style="border: none;">
    //     <div class="show-read" style="">
    //     <div class="ad" style="">` + data.end_time + `</div>
    //     </div>
    //     </div>
        // <img class="show-read-img" src="/common/img/icon_see_normal.png" width="20" style="line-height: 20px;display: block;margin: 5px auto 0" alt="" />

    //     <div class="show-title" id=` + data.domain + `>
    //     <div class="at">` + act_title + `</div>
    //     <div class="ad">` + data.begain_time + ` ~ ` + data.end_time + `</div>
    // </div>
    //     <div class="show-shade" style="display: none;"><p>预览活动</p></div>

    var coverId = 0;
    var artsList = [];
    var genArticles = function(arts) {
        arts.map(x => {
            if (x.cover != "") {
                var coverPicCss = {
                    'background': 'url(' + ApiMaterPlatQiniuDomain + x.cover + ') no-repeat center',
                    'background-size': '100%'
                }
            } else {
                var coverPicCss = {
                    'background': 'url(/common/img/p2240256385.jpg) no-repeat center',
                    'background-size': '100%'
                }
            }

            $(".cons").append(articleTemplate(x));
            $("#" + x.activity_id + " .show-pic").css(coverPicCss);
            $("#" + x.activity_id).click(function(e) {

                var cid = $(e.target).attr('class');
                var dm = $(this).find(".show-title").attr("id");

                /*window.location.href = '/' + dm + '/activity/' + x.weid;*/

                // var cid = $(e.target).attr('class');
                console.log(cid);
                switch (cid) {
                    case 'show-read':
                    case 'show-read-img':
                        // console.log(domain);
                        window.location.href = '/' + dm + '/activ   ity/' + x.activity_id;
                        break;

                    case 'show-tiket':
                        // delArt(x.weid);
                        activity_ebroll_detail(x.weid, x.domain, x.activity_id);
                        break;
                }
            });
            $("#" + x.activity_id).hide();
            artsList.push(x.activity_id);
            coverId++;

            var lock = false;
            $("#" + x.activity_id).hover(function() {
                var dm = $(this).find(".show-title").attr("id");

                if (!lock) {
                    $(this).find('.show-shade').show();
                    lock = true;
                    $(this).find('.show-shade').click(function() {
                        window.location.href = '/' + dm + '/activity/' + x.activity_id;
                    });
                }
            }, function() {
                $(this).find('.show-shade').hide();
                lock = false;
            });
        })
    }

    var returnPart = function(data, start, end) {
        return data.slice(start, start + end);
    }

    var start = 0;
    var perLoad = 9; //默认一次加载条数
    var loadMore = function(data) {
        var res = returnPart(data, start, perLoad);
        console.log(res);
        start += perLoad;
        genArticles(res);
        artsList.map(x => {
            $("#" + x).fadeIn(700);
        });
        $(".more").remove();
        if (res == "") {
            $("#right").append('<div class="more">-- 已经没有了 --</div>');
        } else {
            $("#right").append('<div class="more">-- 点击加载更多 --</div>');
        }
        $(".more").click(function() {
            loadMore(data);
        })
    }

    var artList = function(user_id) {
        var limit = "";
        var page = 1;
        var sendData = {
            user_id: user_id,
            limit: limit,
            page: page
        }
        $.ajax({
            // url: ACTIVITY_LIST,
            url: ACTIVITY_ENROLL_LISTS + '?status=1',
            type: 'post',
            data: sendData,
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    var arts = data.data.list;
                    var res = returnPart(arts, start, perLoad);
                    start += perLoad;
                    genArticles(res);
                    artsList.map(x => {
                        $("#" + x).fadeIn(700);
                    });
                    if (res == "") {
                        $("#right").append('<div class="none">-- 暂时没有支持任何活动 --</div>');
                    } else {
                        $("#right").append('<div class="more">-- 点击加载更多 --</div>');
                    }

                    $(".more").click(function() {
                        loadMore(arts);
                    })
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    artList(docCookies.getItem("weid"));

})
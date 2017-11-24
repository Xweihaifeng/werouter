/**
 * Created by weifeng on 2017/11/23.
 */

$(document).ready(function(){
    //  登录token参数
    var token = window.localStorage.getItem('token');
    if(token) {
        $.ajaxSetup({
            global: true,
            async:  false,
            headers: {
                'Token': token,
            }
        });
    }

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    $('#home img').attr('src', logo);

    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    $("#middle, #right").height(currHeight);

    $(window).resize(function () {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function () {
        $(".add").show();
    }, function () {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function () {
        $(".avatar").show();
    }, function () {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function () {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            success: function(data){
                if (data.code == 200){
                    // console.log(data);
                    if (data.data.domain == null) {
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
            error: function(xhr){
                console.error(xhr);
            }
        })
    }

    var weid = localStorage.getItem('weid');
    hasDomain(weid);

    //主页初始化
    var init__ = function(token){
      if (token != 'null' && token != undefined) {
        showLogin = false;
        isLogin = true;
        //加载用户头像
        $("#login div img").hide();
        $(".log-head").css({
          'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
          'background-size': '100% 100%'
        })
        $("#avatar .avatar-icon").css({
          'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
          'background-size': '100% 100%'
        })
        $(".log-head").show();
      }
    }

    init__(token);

    var logistics_address = function(result, index) {

        var template = `
        <li class="">
            <div>
                <p>`+ result.logistics_company +`</p>
                <div class="toggle-button-wrapper">`
                    if(result.status == 1) {
                        template += `<input checked type="checkbox" id="`+ result.weid +`" value="`+result.status+`" class="" name="switch">
                        <label for="`+ result.weid +`" onClick="logistics_run_id('`+ result.weid +`')" class="button-label">
                        <span class="circle"></span>
                            <span class="text on">ON</span>
                            <span class="text off">OFF</span>
                        </label>`
                    } else {
                        template += `<input type="checkbox" id="`+ result.weid +`" value="`+result.status+`" class="" name="switch">
                        <label for="`+ result.weid +`" onClick="logistics_run_id('`+ result.weid +`')" class="button-label">
                        <span class="circle"></span>
                            <span class="text on">ON</span>
                            <span class="text off">OFF</span>
                        </label>`
                    }

                    template += `
                </div>
            </div>
            <span>管理</span>
        </li>`
        return template;
    }

    function pages_logistics_list() {
        var weid = window.localStorage.getItem("weid"),
            body100 = {
                user_id: weid,
                limit  : 200,
                page   : 1
            }

        var options100 = $.post(apiUrl + "pages/logistics/lists", body100);
        options100.done(function(data) {
            if(data.code == 200) {
                console.log(data);
                $.map(data.data.list, function(key, value) {
                    $("#logistics_address").append(logistics_address(key, value))
                })

            }
        });
        options100.fail(function(error) {
            console.error(error);
        });
    }

    // Pages - 物流 - 初始化用户物流信息（如果不存在则创建存在则不做处理）
    var options99 = $.post(apiUrl + "pages/logistics/InitLogisticsRun");
    options99.done(function(data) {
        if(data.code == 200 && data.data) {
            pages_logistics_list();
        }
    });
    options99.fail(function(error) {
        console.error(error);
    });

})



function logistics_run_id(weid) {
    var options101 = $.post(apiUrl + "pages/logistics/setStatus?logistics_run_id=" + weid);
    options101.done(function(data) {
        if(data.code == 200) {
            console.info(data.message);
        } else{
            console.warn(data.message);
        }
    });
}

var modeleName = [];
var moduleState = function() {
    $.ajax({
        url: apiUrl + 'pages/modulerun/list',
        type: 'GET',
        headers: {
            'Token': localStorage.getItem('token')
        },
        success: function(data){
            //列表折叠
            var curr = 'we-shop';
            var status = true;
            var list = ['we-set','we-art','we-shop','we-active','we-project','we-app','we-crm','we-log'];

            var remove = function(id, list) {
                return list.filter(x => x != id);
            }

            $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
            $("." + curr + " span img").css("transform", "rotate(90deg)");
            remove(curr, list).map(x => $("." + x + ":eq(1)").stop().hide());

            var showList = function(state, id) {
                var id = "." + id;
                if (state) {
                    $(id + ":eq(1)").stop().hide(300);
                    if (id != ".we-log") {
                        $(id + ":eq(0)").css("border-bottom", "0");
                    }
                    $(id + " span img").css("transform", "rotate(0deg)")
                    status = false;
                } else {
                    $(id + ":eq(1)").stop().show(300);
                    $(id + " span img").css("transform", "rotate(90deg)")
                    $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                    status = true;
                }
            }

            list.map(x => {
                $("." + x).click(function() {
                    var isCont = $(this).attr('class').search('we-cont');
                    if (isCont == 0) {
                        return;
                    }
                    if (curr == x) {                            
                        showList(status, x);
                    } else {
                        status = false;
                        remove(x, list).map(x => {
                            $("." + x + ":eq(1)").stop().hide(300)
                            $("." + x + " span img").css("transform", "rotate(0deg)")
                        });
                        if (curr != "we-log") {
                            $("." + curr + ":eq(0)").css("border-bottom", "0");
                        }
                        curr = x;                            
                        showList(status, x);
                    }
                })
            })
        },
        error: function(xhr){
            console.error(xhr);
        }
    })
}

moduleState();
// var changeStatus = function(mid) {
//        $.ajax({
//            url: apiUrl+'pages/modulerun/setModuleStatus',
//            type: 'POST',
//            data: {moduleId: mid},
//            headers: {
//                'Token': localStorage.getItem('token')
//            },
//            success: function (data) {
//                if (data.code == 200) {
//                    // console.log('open:', data);
//                    sessionStorage.moduledata="";
//                    sessionStorage.statedata="";
//                } else {
//                    // layer.msg(data.message, {
//                    //     time: 1500
//                    // });
//                }
//            },
//            error: function (xhr) {
//                console.error(xhr);
//            }
//        })
//    }
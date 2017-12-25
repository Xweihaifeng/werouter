/**
 * Created by yangzi on 2017/8/9.
 */

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
// 判断 sessionStorage
if (sessionStorage.lastname == "we_title_1") {
    $("#we_title_1").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_1").find(".title-img").css("transform", "rotate(90deg)");
}

var code = GetQueryString('code');
var state = GetQueryString('state');
if (code !== null && code !== undefined && code !== '') {
    $.ajax({
        url: apiUrl + "wx/scan_revbind_callback",
        data: {
            'code': code,
            'state': state,
            'token': plats_token
        },
        success: function(data) {
            if (data.code == 200) {
                layer.msg('绑定成功');
                setTimeout(function() {
                    location.href = siteUrl + "/user";
                }, 500);
            } else {
                layer.msg(data.message);
            }
        },
        error: function() {
            layer.msg('网络错误');
        }
    });
}

// var Days = 7;//此 cookie 将被保存 30 天
//    var exp = new Date();//new Date("December 31, 9998");
//    exp.setTime(exp.getTime() + Days*24*60*60*1000);
//    document.cookie = "token="+ docCookies.getItem("token") + ";expires=" + exp.toGMTString();

/*var domain;
	 var hasDomain = function(weid){
		 $.ajax({
			 url: PAGES_PAGE_GETDETAILBYUSER + weid,
			 type: 'GET',
			 headers: {
				 'Token': docCookies.getItem("token")
			 },
			 success: function(data){
			 	 // if (data.code == 401) {			 	 	
			 	 	// domain = '/index';
			 	 	// localStorage.removeItem('token')
			 	 	// window.location.href = '/login'
			 	 // }
				 if (data.code == 200){
					 // console.log(data);
					 if (data.data == null) {
						 //没有个性域名
						 domain = '/index';
					 } else {
						 //存在个性域名
						 domain = "/" + data.data.domain;
					 }
				 }
				 /!*else {
					 layer.msg(data.message, {
						 time: 1500
					 });
				 }*!/
			 },
			 error: function(xhr){
				 console.log(xhr);
			 }
		 })
	 }

	 var weid = docCookies.getItem("weid");
	 hasDomain(weid);*/

//route
var isLogin; //判断用户登陆与否
/*var router = function(route){
    if(!docCookies.getItem("token")) {
        isLogin = false;
    } else {
        isLogin = true;
    }
    // var routerList = ['home', 'login', 'article', 'active', 'project', 'shopping', 'zone', 'zan'];
    var routerList = ['home', 'login', 'article', 'active', 'zan'];

    var isMember = function(routerList, route){
        return routerList.filter(x => x === route);
    }

    var home = function(){
        window.location.href = '/';
    }

    var login = function(){
        if (!isLogin) {
            showLogin = true;
            $("#modal_login").fadeIn(300);
        } else {
            window.location.href = "/user";
        }
    }

    var article = function(){
        showLogin = false;
        window.location.href = "/index/article";
    }

    var active = function(){
        showLogin = false;
        window.location.href = "/index/activity";
    }
    var project = function(){
        showLogin = false;
        window.location.href = "/index/project";
    }


    var shopping = function(){
        showLogin = false;
        window.location.href = "/index/wemall";
    }

    var zone = function(){
        showLogin = false;
        window.location.href = "/index/quan";
    }

    if (isMember(routerList, route) != ""){
        eval(route)();
    }
}*/

// $("#home, #login, #article, #active, #project, #shopping, #zone, #zan").click(function(){
/*$("#home, #login, #article, #active, #zan").click(function(){
    var id = $(this).attr("id");
    router(id);
})*/

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
// console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

//left-navbar show words
$("#login, #article, #project, #active, #shopping, #zone").hover(function(e) {
    var id = $(this).attr("id");
    if (id != 'login') {
        $(this).find(".word").show();
        $(this).css("line-height", "50px");
        $("#" + id + " .word").css("margin-top", "-20px");
    } else {
        if (!isLogin) {
            $(this).find(".word").show();
            $(this).css("line-height", "50px");
            $("#" + id + " .word").css("margin-top", "-20px");
        }
    }
}, function() {
    var id = $(this).attr("id");
    $(this).find(".word").hide();
    $(this).css("line-height", "65px");
    $("#" + id + " .word").css("margin-top", "-55px");
})

init(docCookies.getItem("token"));
var qiniu_uptoken = '';
var saveto = 'qiniu';
var __init = function() {
    $.ajax({
        url: QINIU_UPTOKEN_URL,
        type: 'get',
        dataType: 'json',
        success: function(data) {
            qiniu_uptoken = data.uptoken;
        },
        error: function(xhr) {
            console.log(xhr);
        }
    });
}

$(document).ready(function() {
    var currWidth = $(window).height() - 90;
    var currHeight = $(window).height() - 90;
    setHeight(currHeight + 90);
    var tusitemp = "";
    $("#middle, #right").height(currHeight);

    $(window).resize(function() {
        currWidth = $(window).height() - 90;
        currHeight = $(window).height() - 90;
        setHeight(currHeight + 90);
        $("#middle, #right").height(currHeight);
    })

    $("#add").hover(function() {
        $(".add").show();
    }, function() {
        $(".add").hide();
    })

    $("#avatar, #dropdown").hover(function() {
        $(".avatar").show();
    }, function() {
        $(".avatar").hide();
    })

    $("#avatar-logout span").click(function() {
        localStorage.removeItem('token');
        localStorage.removeItem('weid');
    })

    $('.upload').click(function() {
        $('.form-horizontal').css("display", "block")
    })

    $('.top .y i').click(function() {
        $('.form-horizontal').css("display", "none")
    })

    $('.phone input').change(function() {
        var phone = $('.phone input').val();
        //正则验证
        var myreg = /^1[3|4|5|7|8][0-9]{9}$/;
        var result = myreg.test(phone);
        if (!result) {
            $('.phone span').css("display", "block")
        } else {
            $('.phone span').css("display", "none")
        }
    });

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        uptoken_url: QINIU_UPTOKEN_URL,
        get_new_uptoken: false,
        domain: ApiMaterPlatQiniuDomain,
        container: 'look',
        max_file_size: '100mb',
        flash_swf_url: '/common/js/plupload/Moxie.swf',
        max_retries: 3,
        dragdrop: true,
        drop_element: 'look',
        chunk_size: '4mb',
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                plupload.each(files, function(file) {});
            },
            'BeforeUpload': function(up, file) {},
            'UploadProgress': function(up, file) {},
            'FileUploaded': function(up, file, info) {
                var domain = up.getOption('domain');
                res = JSON.parse(info.response);

                var path = res.key;

                var sourceLink = domain + res.key;
                $("#img").attr('src', sourceLink);
                $("input[name=thumb_image]").val(res.key);

                $.ajax({
                    url: USER_AVATAR,
                    type: 'POST',
                    data: {
                        avatar: path
                    },
                    success: function(data) {
                        // console.log(data);
                        if (data.code === 200) {
                            layer.msg("头像设置成功", { time: 2500 });
                        } else {
                            console.info(data.message);
                        }
                    },
                    error: function(error) {
                        console.error(error);
                    }
                })
            },
            'Error': function(up, err, errTip) {},
            'UploadComplete': function() {},
            'Key': function(up, file) {
                var key = "pages/article/";
                key += new Date().valueOf() + '.' + file.name.substring(file.name.indexOf('.') + 1);
                return key;
            }
        }
    });

    var weid = docCookies.getItem("weid");
    var token = docCookies.getItem("token");
    if (token) {
        $.ajaxSetup({
            global: true,
            headers: {
                'Token': token,
            }
        });
    }

    //更新用户信息
    var openId;
    var province;
    var area;

    function userInfo(data) {
        var userInfo = data.data;
        console.log('userInfo:', userInfo)
        if (!userInfo) {
            return false;
        }
        unionid = userInfo.unionid;
        if (unionid != undefined && unionid != "") {
            $(".contact span").html('<em>已绑定</em>');
        } else {
            $(".contact span").html('<em class="bind-wechat">立即绑定</em>');
        }

        //用户头像
        var avatar = userInfo.avatar;
        if (avatar) {
            if (avatar.indexOf('http') === -1) {
                avatar = ApiMaterPlatQiniuDomain + avatar;
            }
        } else {
            avatar = "/common/img/my.png"
        }

        $("input[name='thumb_image']").val(avatar);
        $("#img").attr("src", avatar);

        localStorage.setItem('avatar', avatar);

        init(docCookies.getItem("token"));

        $(".username input").val(userInfo.real_name);
        $(".nickname input").val(userInfo.nickname);
        $(".phone input").val(userInfo.phone);
        switch (userInfo.sex) {
            case 1:
                $(".unknown").attr("checked", true);
                break;
            case 2:
                $(".female").attr("checked", true);
                break;
            case 3:
                $(".male").attr("checked", true);
                break;
        }
        $(".information textarea").val(userInfo.motto);
        // console.log("userInfo.province_id", userInfo.province_id)
        // console.log("userInfo.area_id", userInfo.area_id)

        var city = function(province, area) {
            $.ajax({
                url: apiUrl + "area/list/" + province,
                dataType: "json",
                type: "GET",
                headers: {
                    'Token': docCookies.getItem("token")
                },
                success: function(data) {
                    console.log(data);
                    if (data.code === 200) {
                        var we_city11 = "";
                        data.data.list.forEach(function(value, index) {
                            we_city11 += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
                        })
                        $("#we_city3").append(we_city11);
                        $("#we_province2").val($("#we_province2 #" + province).val());
                        // console.log('area:', $("#" + area).val())
                        if (area == null || area == "") {
                            $("#we_city3").val($("#294").val()); //默认值
                        } else {
                            $("#we_city3").val($("#we_city3 #" + area).val());
                        }
                    }
                }
            })
        }

        province = userInfo.province_id;
        area = userInfo.area_id;
        var item_id;
        $.ajax({
            type: "GET",
            headers: {
                'Token': docCookies.getItem("token")
            },
            url: apiUrl + "province/list",
            dataType: "json",
            success: function(data) {
                // console.log(data);
                if (data.code === 200) {
                    //拿到省的id  
                    Province = data.data.list;
                    Province.map(function(item) {
                        item_id = item.id
                            // console.warn(item_id);
                    });
                    var we_province11 = "";
                    data.data.list.forEach(function(value, index) {
                        we_province11 += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>"
                    })
                    $("#we_province2").append(we_province11);

                    if (province == null || province == "") {
                        province = 27;
                        city(province, area);
                    } else {
                        city(province, area);
                    }
                }
            }
        })

        //触发省级变更市级
        $("#we_province2").on("change", function(e) {
            $("#we_area5").find("option").remove();
            $.ajax({
                type: "GET",
                headers: {
                    'Token': docCookies.getItem("token")
                },
                url: apiUrl + "area/list/" + $('#we_province2 option:selected').attr('id'),
                dataType: "json",
                success: function(data) {
                    //				console.log(data);
                    if (data.code === 200) {
                        var we_city_oo = "";
                        data.data.list.forEach(function(value, index) {
                            // console.warn(data.data.list[index])
                            we_city_oo += "<option id=" + data.data.list[index].id + ">" + data.data.list[index].name + "</option>";
                        })
                        $("#we_city3").html(we_city_oo);
                    }
                },
                error: function() {
                    console.log("出错了");
                }
            });
        });
    }

    $.ajax({
        url: USERDETAIL + '/' + docCookies.getItem("weid"),
        //url: USERDETAIL,
        success: function(data) {
            if (data.code === 200) {
                // console.log(data);
                userInfo(data);
            } else {
                console.error(data.message);
            }
        }
    })

    var gend = 1;
    $(".unknown").click(function() {
        gend = 1;
    })
    $(".female").click(function() {
        gend = 2;
    })
    $(".male").click(function() {
        gend = 3;
    })

    //更新用户资料
    var update = function() {
        var avatar = $("input[name=thumb_image]").val();
        var name = $('.username input').val();
        var nickname = $('.nickname input').val();
        var phone = $('.phone  input').val();
        var gender = gend;
        var province_id = $("#we_province2 option:selected").attr("id");
        var area_id = $("#we_city3 option:selected").attr("id");
        var wx = false;
        var summary = $('.information textarea').val().substring(0, 90);

        if (avatar) {
            if (avatar.indexOf('http') === -1) {
                avatar = ApiMaterPlatQiniuDomain + avatar;
            }
        } else {
            avatar = "/common/img/my.png"
        }

        var send = {
            'avatar': avatar,
            'real_name': name,
            'nickname': nickname,
            'phone': phone,
            'sex': gender,
            'motto': summary,
            'province_id': province_id,
            'area_id': area_id
        }

        $.ajax({
            url: USERINFO + '/' + docCookies.getItem("weid"),
            type: 'POST',
            data: send,
            success: function(data) {
                // console.log(data);
                if (data.code === 200) {
                    // console.log("000000000", data);
                    layer.msg("保存设置成功", { time: 2500 });
                    localStorage.setItem('avatar', avatar);
                    window.location.href = '/user';
                } else {
                    layer.msg(data.message, { time: 2500 });
                }
            },
            error: function(error) {
                console.error(error);
            }
        })
    }

    $(".update").click(function() {
        update();
    })

    $(document).on("click", ".contact span .bind-wechat", function() {
        qrWindow();
    });

    var qrWindow = function() {
        layer.load();
        $.ajax({
            url: apiUrl + 'setting/alias/weChatOpenConfig',
            type: 'get',
            dataType: 'json',
            success: function(result) {
                layer.closeAll('loading');
                if (result.code === 200) {
                    layer.open({
                        type: 1,
                        title: '微信绑定',
                        offset: type,
                        area: ['300px', '350px'],
                        id: 'layerDemo' + type,
                        content: '<div id="qrcode-block" style="height: 300px;overflow: hidden;"></div>',
                        shade: 0,
                        scrollbar: false,
                        yes: function() {
                            layer.closeAll();
                        }
                    });
                    var obj = new WxLogin({
                        id: "qrcode-block",
                        appid: result.data.appid,
                        scope: "snsapi_login",
                        redirect_uri: siteUrl + "/user",
                        href: 'https://wezchina.com/common/css/wechat.css',
                        state: ""
                    });
                } else {
                    parent.layer.msg(result.message);

                    return false;
                }
            },
            error: function(xhr) {
                layer.closeAll('loading');
                console.log(xhr);
            }
        });

    }

    function setCookie(token, expiredays) {
        var Days = expiredays;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = "token=" + escape(token) + ";expires=" + exp.toGMTString() + ";path=/";
    }

})
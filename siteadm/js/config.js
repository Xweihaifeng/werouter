const httpType = window.location.protocol;
// var hosts = httpType + '//' + window.location.host + '/api/';
var hosts = httpType + '//ysl.co/';
var ApiUrl = hosts + 'backend/';
//七牛配置
var ApiMaterPlatQiniuDomain;
$.ajax({
    url: ApiUrl + 'settings',
    type: 'get',
    async: false,
    success: function(data) {
        ApiMaterPlatQiniuDomain = httpType + '//' + data.data.qiniu.domain_custom + '/';
    },
    error: function(xhr) {
        console.log(xhr);
    }
})

var token = sessionStorage.getItem('token');
var domain = sessionStorage.getItem('domain');

var number_per_page = 10;

var hearderTpl = `<header class="main-header">
<!-- Logo -->
<a href="#" class="logo">
    <!-- mini logo for sidebar mini 50x50 pixels -->
    <span class="logo-mini"><b>后台</b></span>
    <!-- logo for regular state and mobile devices -->
    <span class="logo-lg">后台管理</span>
</a>
<!-- Header Navbar: style can be found in header.less -->
<nav class="navbar navbar-static-top">
    <!-- Sidebar toggle button-->
    <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
    </a>
    <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
            <!-- User Account: style can be found in dropdown.less -->
            <li class="dropdown user user-menu">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <img src="dist/img/avatar.jpg" class="user-image" alt="User-Image">
                    <span class="hidden-xs" id="adminUser">admin</span>
                </a>
                <ul class="dropdown-menu">
                    <!-- User image -->
                    <li class="user-header">

                        <img src="dist/img/avatar.jpg" class="img-circle" alt="User-Image">
                        <p>
                            <span id="username">sky hao - Full Stack Developer</span>
                            <small id="memo">Let's Creat!</small>
                        </p>
                    </li>
                    <!-- Menu Body -->
                    <li class="user-body">
                        <div class="row">
                            <div class="col-xs-4 text-center">
                                <a href="contents.html">内容管理</a>
                            </div>
                            <div class="col-xs-4 text-center">
                                <a href="contentCategory.html">栏目管理</a>
                            </div>
                            <div class="col-xs-4 text-center">
                                <a href="channels.html">频道管理</a>
                            </div>
                        </div>
                        <!-- /.row -->
                    </li>
                    <!-- Menu Footer-->
                    <li class="user-footer">
                        <div class="pull-right">
                            <a href="#" id="logout" class="btn btn-default btn-flat">安全退出</a>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</nav>
</header>`;

$.ajaxSetup({
    global: true,
    dataType: 'json',
    headers: {
        'Token': token,
        'channel':domain
    },
    error: function() {
        location.href = 'login.html';
    }
});

var start = function() {
    var username = sessionStorage.getItem('site_username');
    if (!username) {
        window.location.replace('login.html');
    }
    $(".wrapper").prepend(hearderTpl);
    $(".content-wrapper").css("min-height", window.screen.availHeight + 'px');
    var avatar = sessionStorage.getItem('avatar');
    //var memo = sessionStorage.getItem('memo');
    var setting = JSON.parse(sessionStorage.getItem('setting'));
    $("title").text(setting.title + '后台管理');
    var admin_name = sessionStorage.getItem('real_name');
    $("#adminUser").text(admin_name);
    //if (avatar) $(".user-image,.img-circle").attr('src', ApiMaterPlatQiniuDomain + avatar);
    if (avatar == 'avatar.jpg') $(".user-image,.img-circle").attr('src', 'image/' + avatar);
    $("#username").text(username);
    //$("#memo").text(memo ? memo : "");
    // var menu = JSON.parse(sessionStorage.getItem('menu'));
    // var len = menu.length;
    // genSideBarMenu(menu, len - 2);
    //console.log(localStorage.getItem('cms_menulist'));
    var list = JSON.parse(localStorage.getItem('site_cms_menulist'));
    var len = list.length - 1;
    genSideBarMenu(list, len)

    /*$("#root").append(
        `<li class="header" id=` + menu[len - 2].key + `>` + menu[len - 2].parents + `</li>
                         <li class="header" id=` + menu[len - 1].key + `>` + menu[len - 1].parents + `</li>`
    )*/
    console.log('itemId:', itemId)
    itemId.map(id => genClick(id));
    var id = sessionStorage.getItem('id');
    var prevId = sessionStorage.getItem('prevId');
    if (prevId == id) {
        var parentId = $("#" + id).parents('.treeview').attr('id');
        $("#" + parentId).addClass('menu-open');
        $("#" + parentId).addClass('active');
        $("#" + prevId).css("background", "#4b646f");
    }

    if (id != 'null' && id != undefined) {
        var parentId = $("#" + id).parents('.treeview').attr('id');
        $("#" + parentId).addClass('menu-open');
        $("#" + parentId).addClass('active');
        $("#" + id).css("background", "#4b646f");
        sessionStorage.setItem('prevId', id);
        sessionStorage.setItem('id', 'null');
    } else {
        console.log('id is null');
    }

    // $.ajax({
    //     url: ApiUrl + 'admins/check_auth',
    //     type: 'POST',
    //     data: {
    //         role_id: sessionStorage.getItem('role_id'),
    //         url: $("input[name='config-url']").val()
    //     },
    //     success: function(data){
    //         if (data.code != 200) {
    //             setTimeout(function(){
    //                 swal('提示', '权限不足', 'success');
    //             }, 1500);
    //             window.location.href = '/admin';
    //         } else {
    //             // console.log(data);

    //         }
    //     }
    // })

}

var itemId = [];
var itemTemplate = function(sub) {
    var template = '';
    /*sub.subItem.map(item => {
        itemId.push(item.key);
        template += `<li id=` + item.key + `><a href=` + item.key + '.html' + `>` + item.grandson + `</a></li>`
    })*/
    sub.children.map(item => {
        itemId.push(item.mark);
        template += `<li id=` + item.mark + `><a href=` + item.url + `>` + item.name + `</a></li>`
    })
    return template;
}

var subTemplate = function(parent) {
    var template = '';
    /*parent.subItems.map(sub => {
        template +=
            `<li class="treeview" id=` + sub.key + `>
                    <a href=` + sub.key + `>
                    <i class="fa fa-` + sub.icon +  `"></i>
                    <span>` + sub.son + `</span>
                    <span class="pull-right-container">
                    <i class="fa fa-angle-left pull-right"></i>
                    </span>
                    </a>
                    <ul class="treeview-menu dealer">` +
            itemTemplate(sub) +
            `</ul>
        </li>`
    })*/
    parent.children.map(sub => {
        template +=
            `<li class="treeview" id=` + sub.id + `>
                    <a href=` + sub.id + `>
                    <i class="fa fa-` + sub.mark + `"></i>
                    <span>` + sub.name + `</span>
                    <span class="pull-right-container">
                    <i class="fa fa-angle-left pull-right"></i>
                    </span>
                    </a>
                    <ul class="treeview-menu dealer">` +
            itemTemplate(sub) +
            `</ul>
        </li>`
    })
    return template;
}

var genSideBarMenu = function(menu, len) {
    // console.log(menu);
    // console.log(len);
    // var cnt = 0;
    menu.map(parent => {
        // if (cnt < len) {
        $("#root").append(
                // `<li class="header" id=` + parent.key + `>` + parent.parents + `</li>` + subTemplate(parent)
                `<li class="header" id=` + parent.mark + `>` + parent.name + `</li>` + subTemplate(parent)
            )
            // cnt++;
            // }
    })
}

var genClick = function(id) {
    $("#" + id).click(function() {
        sessionStorage.setItem('id', $(this).attr('id'));
        sessionStorage.setItem('prevId', '');
    })
}


$(function() {
    $(document).on("click", "#logout", function() {
        sessionStorage.removeItem('weId');
        sessionStorage.removeItem('site_username');
        sessionStorage.removeItem('real_name');
        sessionStorage.removeItem('avatar');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('menuList');
        window.location.replace('login.html');
        // $.ajax({
        //     url: ApiUrl + "admins/logout",
        //     type: 'GET',
        //     dataType: 'JSON',
        //     success: function(result) {
        //         if (result.code === 200) {
        //             sessionStorage.removeItem('weId');
        //             sessionStorage.removeItem('username');
        //             sessionStorage.removeItem('real_name');
        //             sessionStorage.removeItem('avatar');
        //             sessionStorage.removeItem('token');
        //             sessionStorage.removeItem('menuList');
        //             window.location.replace('login.html');
        //         } else {
        //             parent.layer.msg(result.message);
        //             return false;
        //         }
        //     }
        // });
    })
});
//获取url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

//判断为空
function isNull(data) {
    return (data == "" || data == undefined || data == null) ? true : false;
}

function shorten_str(str, length) {
    if (str.length > length) {
        return str.substr(0, length - 2) + '...';
    } else {
        return str;
    }
}

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
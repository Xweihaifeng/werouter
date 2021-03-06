/**
 * Created by Hongguang on 2017/11/6.
 */

$(function(){

    // 页面中标题展示

    const navtpl = `
        <ul>
        <li id="dynamic">动态</li>
        <li id="article">文章</li>
        <li id="project">项目</li>
        <li id="activity">活动</li>
        <li id="wemall">商品</li>
        <li id="center"><img src="/common/img/adds.png" alt="add"/></li>
        </ul>`

    const mynavtpl = `
        <ul>
        <li id="my-dynamic">推荐</li>
        <li id="my-article">文章</li>
        <li id="my-project">项目</li>
        <li id="my-activity">活动</li>
        <li id="my-wemall">商城</li>
        <li id="my-center"><img src="/common/img/adds.png" alt="add"/></li>
        </ul>`

    const footertpl = `
        <ul>
        <li id="home">
        <img src="/common/img/home.png" alt="home"/>
        <span>首页</span>
        </li>
        <li id="discovery">
        <img src="/common/img/discovery.png" alt="discovery"/>
        <span>发现</span>
        </li>
        <li id="add">
        <div class="up"></div>
        <div class="down"></div>
        <img src="/common/img/add.png" alt="add"/>
        </li>
        <li id="message">
        <img src="/common/img/message.png" alt=""/>
        <span>消息</span>
        </li>
        <li id="user">
        <button data-method="notice" class="layui-btn" style="position: absolute; background: transparent;"></button>
        <img src="/common/img/user.png" alt="my"/>
        <span>我的</span>
        </li>
        </ul>`

    //template
    //discovery
    const activity = (data, domain, avatar, nickname, motto, date, pid) => {
        let dt = new Date(data.updated_at);
        let year = dt.getFullYear();
        let month = (dt.getMonth() + 1).toString().length == 1 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        let day = (dt.getDay() + 1).toString().length == 1 ? '0' + (dt.getDay() + 1) : dt.getDay() + 1;
        let hour = dt.getHours().toString().length == 1 ? '0' + dt.getHours() : dt.getHours();
        let min = dt.getMinutes().toString().length == 1 ? '0' + dt.getMinutes() : dt.getMinutes();
        let template = `
        <div class="act">
            <div class="act-avatar">
                <a href="${'/' + domain + '/wecard'}">
                    <img class="lazy" data-original="${imgSet(avatar, 60, 60)}" width="60" height="60" />
                </a>
            </div>
            <div class="all">
                <div class="act-info">
                    <ul>
                        <li class="act-title">${nickname}</li>
                        <li class="act-intro">${motto}</li>
                    </ul>
                    <div class="act-hot"><span>热门</span></div>
                </div>
                <a href="${'/' + domain + '/activity-detail/' + data.weid}">
                <div class="act-content">
                    <div class="act-cover"><img class="lazy" data-original="${imgSet(data.cover, 110, 69, 1)}" width="110" height="69" /></div>
                    <div class="act-cont">
                        <ul>
                            <li class="act-cont-title">
                            <p>${data.title}</p>
                            <p>免费</p>
                            </li>
                            <li class="act-cont-summary">${data.Sponsor}</li>
                            <li class="act-cont-time">
                                <p>${month}-${day} ${hour}:${min}开讲</p>
                                <p>${data.area_name}</p>
                            </li>
                            <li class="act-cont-info"></li>
                        </ul>
                    </div>
                </div>
                </a>
                <div class="act-other">
                    <p>${date}</p>
                    <img src="/common/img/review.svg" alt=""/>
                </div>
            </div>
        </div>`
        return template;
    }

    //home
    const myactivity = (data, domain) => {
        let date = new Date(data.begain_time);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = (date.getDay() + 1).toString().length == 1 ? '0' + (date.getDay() + 1) : date.getDay() + 1;
        let hour = date.getHours().toString().length == 1 ? '0' + date.getHours() : date.getHours();
        let min = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes() : date.getMinutes();
        /*let avatar = ApiMaterPlatQiniuDomain;
        if (data.cover != "") {
            avatar += data.cover;
        }*/
        let type = data.type;
        if (type == 1) {
            type = '免费';
        } else {
            type = data.price;
        }
        let template = `
        <a href="${'/' + domain + '/activity-detail/' + data.weid}">
        <div class="act-content">
            <div class="act-cover"><img class="lazy" data-original="${imgSet(data.cover, 110, 69, 1)}" width="110" height="69" /></div>
            <div class="act-cont">
                <ul>
                    <li class="act-cont-title">
                    <p>${data.title}</p>
                    <p>${type}</p>
                    </li>
                    <li class="act-cont-summary"><p>${data.Sponsor}</p></li>
                    <li class="act-cont-time">
                        <p>${month}-${day} ${hour}:${min}开讲</p>
                        <p>${data.area_name}</p>
                    </li>
                    <li class="act-cont-info"></li>
                </ul>
            </div>
        </div>
        </a>`
        return template;
    }

    const article = (data, domain, avatar, nickname, motto, date, pid) => {
        let template = `
        <div class="art-temp1">
			<div class="art-left">
				<span>
                    <!--<a href="${'/wecard/' + pid}">-->
                    <a href="${'/' + domain + '/wecard'}">
                        <img class="lazy" data-original="${imgSet(avatar, 36, 36)}" style="width: 0.36rem; height: 0.36rem; border-radius: 0.36rem;" />
                    </a>
				</span>
			</div>
			<div class="art-right">
				<span class="art-title">${nickname}</span>
				<p>${motto}</p>
				<a href="${'/' + domain + '/article/' + data.weid}">
				<div class="art-content">
					<span><img class="lazy" data-original="${data.cover}" width="88" /></span>
					<span class="art-des-text">
					    <strong>${data.title}</strong>
					    <pre>${data.summary}</pre>
                    </span>
				</div>
				</a>
				<div class="art-other">
					<span>${date}</span>
					<span></span>
				</div>
			</div>
		</div>`
        return template;
    }

    const myarticle = (data, domain) => {
        let template =`
        <a href="${'/' + domain + '/article/' + data.weid}">
        <div class="art-content">
            <span><img class="lazy" data-original="${data.cover}" /></span>
            <span class="art-des-text">
                <strong>${data.title}</strong>
                <pre>${data.summary}</pre>              
            </span>
        </div>
        </a>`
        return template;
    }

    const shopping = (data, domain, avatar, nickname, motto, date, pid) => {
        //let show = data.picture.split(',').map(x => ApiMaterPlatQiniuDomain + x);
        let show = [];
        if (data.picture != null) {
             show = data.picture.split(',').map(x => x);
        }
        let template = `
        <slide>
            <slide class="li_img_wap">
                <a href="${'/' + domain + '/wecard'}">
                    <img class="lazy" data-original="${imgSet(avatar, 36, 36)}" width="60" height="60">
                </a>
            </slide>
            <slide class="li_info">
                <h2>${nickname}</h2>
                <h3>${motto}</h3>
                <div class="lii_img">
                    ${show.map(x => `<img class="lazy" data-original="${imgSet(x, 102, 97, 1)}" width="102" height="97" />`).join('')}
                </div>
                <div class="lii_sold">
                    <a href="${'/' + domain + '/wemall/goods/' + data.weid}">
                        <slide class="li_img_wap">
                            <img class="lazy" data-original="${imgSet(data.cover, 55, 55, 1)}" />
                        </slide>
                        <slide class="li_info">
                            <h3>${data.title}</h3>
                            <p class="lii_sold"><span> 已售：${data.sales_num} </span><span> 收藏：${data.collections} </span></p>
                            <div class="lii_price">￥：<span>${data.price}</span></div>
                        </slide>
                    </a>
                </div>
                <div class="lii_eval">
                    <span class="lii_time">${date}</span>
                    <img src="/common/img/review.svg" alt="" style="width: 0.16rem;height: 0.16rem;">
                </div>
            </slide>
        </slide>`
        return template;
    }

    const myshop = (data) => {
        //let cover = ApiMaterPlatQiniuDomain + data.cover;
        let template = `
        <div class="lii_sold">
            <a href="${'/' + domain + '/wemall/goods/' + data.weid}">
                <slide class="li_img_wap">
                    <img class="lazy" data-original="${imgSet(data.cover, 111, 69, 1)}" />
                </slide>
                <slide class="li_info">
                    <h3>${data.title}</h3>
                    <p class="lii_sold1"><span> 已售：${data.sales_num} </span><span> 收藏：${data.collections} </span></p>
                    <div class="lii_price">￥：<span>${data.price}</span></div>
                </slide>
            </a>
        </div>`
        return template;
    }

    //获取参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    //判断为空
    function isNull(data) {
        return (data == "" || data == undefined || data == null || data == 'null') ? true: false;
    }

    //判断是否在微信中打开
    function is_weixn() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    const lazyLoad = function(){
        $(".lazy").lazyload({
            effect: "fadeIn",
            placeholder: '/common/img/vote_front_cover.png'
        })
    }

    //微友关注
    const wxlogin = (openid, domain) => {
        $.ajax({
            url: apiUrl + 'wxlogin',
            type: 'POST',
            data: {
                openid: openid,
                ref_url: window.location.pathname,
                ref_type: 2,
                ref_id: window.location.pathname.split('/')[2],
                domain: domain
            },
            success: function (data) {
                //alert(JSON.stringify(data));
                localStorage.setItem('weid', data.data.weid);
                localStorage.setItem('token', data.token);
                localStorage.setItem('activation', data.data.activation_status);
                localStorage.setItem('phone', data.data.phone);

                hasDomain(data.data.weid);

                setCookie(data.token, 7);
                let activation = data.data.activation_status;
                if (is_login == 'yes') {
                    $(".layui-btn").hide();
                }
                if (data.code == 200) {
                    if (isNull(data.token) == false) { //非空
                        localStorage.setItem('token-date', new Date().getTime())
                        localStorage.setItem('user-token', data.token);
                    }
                }
            }
        })
    }

    const init = function(url) {
        $.ajax({
            url: url,
            type: 'get',
            success: function (data) {
                console.log(data);
                if (data.data.user.avatar != null) {
                    ref.avatar = ApiMaterPlatQiniuDomain + data.data.user.avatar;
                }
                $('title').text(data.data.user.nickname + '的微名片')
                ref.nickname = data.data.user.nickname;
                ref.domain = data.data.user.domain;
                ref.motto = data.data.user.motto;
                ref.wepage = '/' + ref.domain + '/';

                let title = ref.nickname;
                let summary = ref.motto;
                let cover = ref.avatar;

                isFollow('circel/if_follow', ref.domain, ref);
                //确保登录成功后能返回当前页
                sessionStorage.setItem('nextPage', window.location.href);
                sessionStorage.setItem('currentPage', window.location.href);

                if (is_weixn()) {
//					alert(1)
                    var oldTime = localStorage.getItem('setopenid-date');
                    if (!isExpire(oldTime)) { //没过期
                        //var usertoken = localStorage.getItem('user-token');
                        var usertoken = localStorage.getItem('setopenid');
                        if (usertoken == 'true') {
                            openid = getUrlParam("openid");
//							alert('openid:' + openid)
                            if (openid != null) {
                                localStorage.setItem('openid', openid);
                                wxlogin(openid, ref);
                            } else {
                                let openid = localStorage.getItem('openid');
                                wxlogin(openid, ref);
                            }
//							alert('store openid:' + localStorage.getItem('openid'));
                        }
                    } else {
                        //微信未跳转时
//						alert(2)
                        localStorage.setItem('setopenid', true);
                        localStorage.setItem('setopenid-date', new Date().getTime());
                        window.location.href = encodeURI(apiUrl + '/openid?url=' + window.location.href);
                    }
                } else {
                    $(".layui-btn").hide();
                }
            }
        })
    }

    //action
    const generator = (data, fun, domain, avatar, nickname, motto, date, pid) => data.map(x => $("#container").append(fun(x, domain, avatar, nickname, motto, date, pid)));
    const find = (id, list) => list.filter(x => x.id == id)[0].val;
    const genBar = (state) => {
        if (state) {
            $("nav").append(navtpl);
        } else {
            $("nav").append(mynavtpl);
        }
        $("footer").append(footertpl);
        if (is_login == 'yes') {
            $(".layui-btn").hide();
        }
    }
    const genInfo = (x, dync_type) => {
        let pid = x.plat_user_id;
        let fun = dync_type.filter(y => x.dynamic_type == y.id)[0].val;
        //let avatar = ApiMaterPlatQiniuDomain + x.avatar;
        let avatar = x.avatar;
        let hour = new Date(x.updated_at).getHours().toString().length == 1 ? '0' + new Date(x.updated_at).getHours() : new Date(x.updated_at).getHours();
        let min = new Date(x.updated_at).getMinutes().toString().length == 1 ? '0' +  new Date(x.updated_at).getMinutes() : new Date(x.updated_at).getMinutes();
        let date = hour + ':' + min;
        return {fun: fun, avatar: avatar, date: date, pid: pid};
    }

    const userId = (domain) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: PAGES_DETAIL_DOMAIN + "/" + domain,
                type: 'GET',
                success: function (data) {
                    if (data.code == 200) {
                        console.log(data);
                        if (data.data != null) {
                            let uid = data.data.plat_user_id;
                            console.log('userId:', uid);
                            resolve(uid);
                        }
                    } else {
                        //window.location.href = "/*";
                        console.log("error", data.code)
                    }
                },
                error: function (xhr) {
                    console.log(xhr);
                }
            })
        })
    }

    const getUserInfo = function(data){
        let brand = data.plats_brand;
        let info = data.plats_user;
        let list = [{id: 'article', val: '文章'}, {id: 'project', val: '项目'}, {id: 'activity', val: '活动'}, {id: 'wemall', val: '商城'}, {id: 'quan', val: '圈子'}];
        let type = window.location.pathname.split('/').pop();
        let has = list.filter(x => x.id == type);
        if (has != '') {
            name = list.filter(x => x.id == type)[0].val + ' - ';
        } else {
            name = '';
        }
        var show_title = {
            head_title : name + info.nickname + '的微主页' + ' - ' + plats_info.title // 浏览器显示标题
        };
        // 加V 图标
        if(brand)
        {
            show_title.head_title = name + brand.title;
        }
        else
        {
            if(domain == 'index')
            {
                show_title.head_title = plats_info.plat_name;
            }
        }

        $("title").text(show_title.head_title);
    }

    const hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                /*if (data.code == 401) {
                 localStorage.removeItem('token');
                 }*/
                if (data.code == 200){
                    //console.log(data);
                    if (data.data != null) {
                        //微主页banner图
                        var bgLogo = data.data.background;
                        if (bgLogo != null) {
                            $("#art-head").css({
                                "background": "url(" + bgLogo + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                        //微名片背景
                        var bgUser = data.data.background_user;
                        if (bgUser != null){
                            $(".user-info").css({
                                "background": "url(" + bgUser + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                        if (data.data.is_brand == 1) {
                            hasBrand(userId);
                        }
                    }
                } else {
                    // layer.msg(data.message, {
                    //     time: 1500
                    // });
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    const hasBrand = function(weid){
        $.ajax({
            url: BRAND_DETAIL_USER + "/"+ weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                /*if (data.code == 401) {
                 localStorage.removeItem('token');
                 }*/
                if (data.code == 200){
                    //console.log(data);
                    if (data.data != null) {
                        $(".line-0").html(
                            data.data.title + '<img src="/common/img/vrenzheng.png" alt="" style="display: inline-block; margin-left: 10px;">' +
                            '<div class="collection"><img class="ct" src="/common/img/collect.svg" alt=""/><span class="wd">关注</span></div>'
                        );
                        $(".line-1").text("品牌介绍");
                        var logo = data.data.logo;
                        if (logo != null){
                            $("#head-icon").css({
                                "background": "url(" + logo + ") no-repeat center",
                                "background-size": "100%"
                            });
                        }
                    }
                } else {
                    // layer.msg(data.message, {
                    //     time: 1500
                    // });
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    //controller
    const top = function(curr, flag, domain){
        //首页，发现中的子项目路由名称及入口
        let list = [];
        //动态页数据，将改为接口返回
        let dync_type = [{id: 1, val: 'article'}, {id: 3, val: 'activity'}, {id: 4, val: 'shopping'}]; //生成发现动态信息
        let my_dync = ['my-article', 'my-activity', 'my-wemall']; //home dynamic
        //val：HOME各页面模板渲染函数
        let my_mock = [{id: 'my-dynamic', val: 'all'}, {id: 'my-article', val: 'handleResponse'}, {id: 'my-activity', val: 'generator'}, {id: 'my-wemall', val: 'genShop'}]; //home
        //val：发现页数据
        let mock_list = [{id: 'dynamic', val: 'all'}, {id: 'article', val: 'mock_art'}, {id: 'activity', val: 'mock_act'}, {id: 'wemall', val: 'mock_shop'}]; //discovery
        let my_dync_type = [{id: 1, val: 'myarticle'}, {id: 3, val: 'myactivity'}, {id: 4, val: 'myshop'}]; //生成首页动态信息
        let mock_data = '';

        //$("#container").html(''); //页面不跳转
        if (curr.indexOf('my') != -1) { //从路由进入
            //home
            genBar(false);
            list = ['my-dynamic', 'my-article', 'my-project', 'my-activity', 'my-wemall']; //li id
            
            //userId(domain).then(uid => getUserInfo(USERDETAIL, "/" + uid))
            getUserInfo(pages_info);

            if (flag) { //点击home或discovery
                sessionStorage.setItem('isMy', true);
                if (curr.indexOf('my') != -1) {
                    //if (curr == 'my-dynamic') {
                        if (domain != "null" && domain != null) {
                            window.location.href = '/' + domain + '/'; //home dynamic
                        } else {
                            window.location.href = '/index/';
                        }
                    /*} else {
                        if (domain != "null" && domain != null) {
                            window.location.href = '/' + domain + '/' + curr.split('-')[1]; //del my
                        } else {
                            window.location.href = '/index/' + curr.split('-')[1];
                        }
                    }*/
                } /*else {
                    if (domain != "null" && domain != null) {
                        window.location.href = '/' + domain + '/' + curr;
                    } else {
                        window.location.href = '/index/' + curr;
                    }
                }*/
            } else {
                if (find(curr, my_mock) != 'all') {
                    mock_data = 'my_' + curr.substring(3);
                    if (curr == 'my-activity') {
                        generator(my_activity, myactivity, domain);
                    } else {
                        if (curr != 'my-wemall') { //暂不处理商城列表
                            eval(find(curr, my_mock))(eval(mock_data));
                        }
                    }
                } else {
                    if (curr == 'my-dynamic') {
                        my_dynamic.data.list.map(x => {
                            let fun = my_dync_type.filter(y => x.dynamic_type == y.id)[0].val;
                            generator([JSON.parse(x.other)], eval(fun), domain)
                        })
                    } else {
                        my_dync.map(x => eval(find(x, my_mock))(eval('my_' + x.substring(3))));
                    }
                }
                bottom('home');
            }
        } else {
            //discovery
            genBar(true);
            list = ['dynamic', 'article', 'project', 'activity', 'wemall'];
            if (flag) {
                //window.location.href = curr + ".html";
                //window.location.href = '/discovery/' + curr;
                window.location.href = '/discovery/dynamic';
            } else {
                let mock_data = find(curr, mock_list);
                if (mock_data != 'all') {
                    let data = eval(mock_data);
                    data.map(x => {
                        let res = genInfo(x, dync_type);
                        generator([JSON.parse(x.other)], eval(res.fun), x.domain, res.avatar, x.nickname, x.motto, res.date, res.pid);
                    })
                } else {
                    dynamic.data.list.map(x => {
                        let res = genInfo(x, dync_type);
                        generator([JSON.parse(x.other)], eval(res.fun), x.domain, res.avatar, x.nickname, x.motto, res.date, res.pid);
                    })
                }
                bottom('discovery');
            }
        }
        switch(curr) {
            case 'dynamic': $("title").text("动态 - 发现"); break;
            case 'article': $("title").text("文章 - 发现"); break;
            case 'activity': $("title").text("活动 - 发现"); break;
            case 'wemall': $("title").text("商品 - 发现"); break;
            default: break;
        }
        lazyLoad();
        $("#" + curr).css({
            "border-bottom": "2px solid rgb(37, 195, 254)",
            "color": "#333333"
        })
        list.map(x => {
            if (x != curr) {
                $("#" + x).css({"color": "#999999","border-bottom": "none"});
            }
        })
    }

    const skip = (flag) => {
        if (flag == 'home') {
            let curr = sessionStorage.getItem('currHome');
            if (curr != null  && curr != '') {
                //top('my-' + path, true, domain); //跳转到对应的页面
                top('my-' + curr, true, domain); //跳转页面
            } else {
                top('my-', true, domain);
            }
        }
        if (flag == 'discovery') {
            let curr = sessionStorage.getItem('currDscr');
            if (curr != null && curr != '') {
                //top(path, true);
                top(curr, true);
            } else {
                top('dynamic', true);
            }
        }
    }

    const bottom = function(curr, flag, dir){
        let list = ['home', 'discovery', 'message', 'user'];
        let path = window.location.pathname.split('.')[0].split('/').pop();
        if (flag == '') { //process message and user
            $("footer").append(footertpl);
            switch (curr) {
                case 'message':
                    if (token != null) {
                        $(".mes").show();
                        $(".layui-btn").hide();
                    } else {
                        $(".mes").hide();
                    };
                    break;
                case 'user': $(".layui-btn").hide(); break;
                default: break;
            }
        }
        if (list.indexOf(curr) != -1) {
            $("#" + curr + " img").attr('src', '/common/img/' + curr + 'blue' + '.png');
            $("#" + curr + " span").css("color", "#25c3fe");
        }

        if (dir == undefined) { //从my或message
            if (flag == 'home') {
                //alert(1)
                top('my-dynamic', true); //跳转页面
            }
            if (flag == 'discovery') {
                //alert(2)
                top('dynamic', true);
            }
        } else {
            if (domain != 'message' && domain != 'user') {
                sessionStorage.setItem('domain', domain)
            }
            if (flag == 'home') {
                //alert(3)
                if (path.indexOf('my') != -1) {
                    top(path, true);
                } else {
                    domain = sessionStorage.getItem('domain');
                    if (domain != null) {
                        if (path != 'message' && path != 'user') {
                            skip(flag);
                        } else {
                            skip(flag);
                        }
                    } else {
                        top('my-' + path, true, 'index');
                    }
                }
            }
            if (flag == 'discovery') {
                //alert(4)
                if (path.indexOf('my') != -1) {
                    top(path.substring(3), true);
                } else {
                    if (path != '' && pages.indexOf(path) != -1) {
                        skip(flag);
                    } else {
                        skip(flag);
                    }
                }
            }
        }

        if (flag == 'user') {
            if (!is_weixn() && token == null) {
             //let nextPage = window.location.pathname.split('-').pop();
                sessionStorage.setItem('nextPage', '/user');   //记录跳转目标页，目前就是‘my’
             } else {
                window.location.href = '/user';  ///////////////////////////////////
            }
        }

        if (flag == 'message') {
            window.location.href = '/' + flag;  ///////////////////////////////////
        }
    }

    //从路由获取当前页面id
    const pages = ['dynamic', 'article', 'project', 'activity', 'shopping', 'wemall'];
    const curr = window.location.pathname.split('.')[0].split('/').pop();
    const prev = window.location.pathname.split('.')[0].split('/')[1];
    const weid = localStorage.getItem('weid');
    const openid = localStorage.getItem('openid');
    const token = localStorage.getItem('token');
    const actState = localStorage.getItem('activation');
    let domain;
    if (window.location.pathname.split('/')[1] != 'discovery') {
        domain = window.location.pathname.split('/')[1];
    } else {
        domain = sessionStorage.getItem('domain');
    }
    sessionStorage.setItem('currentPage', window.location.pathname);
    //alert('weid:' + localStorage.getItem('weid'));
    //alert('openid:' + localStorage.getItem('openid'))
    //alert('token:' + localStorage.getItem('token'));
    //alert('activation:' + localStorage.getItem('activation'))

    const setCookie = (token, expiredays) => {
        var Days = expiredays;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = "token="+ escape (token) + ";expires=" + exp.toGMTString() +";path=/";
    }

    setCookie(token, 7);

    //微友
    const wefriend = () => {
        if (is_weixn() && is_domain == 'yes' && is_login == 'no') {
            wxlogin(openid, domain);
        } else {
            wxlogin(openid, 'index');
        }
    }

    wefriend();

    if (curr != '' && pages.indexOf(curr) != -1) { //处理/domain/或/domain形式的主页路由
        if (pages.indexOf(curr) != -1) {
            if (prev != 'discovery') {
                top('my-' + curr, false, domain);
            } else {
                top(curr);
            }
        } else {
            $("footer").append(footertpl);
            bottom(curr);
        }
    } else {
        if (curr == 'message' || curr == 'user') { //刷新页面
            bottom(curr, '', '');
        } else {
            top('my-dynamic', false, domain);
        }
    }

    $.ajax({
        url: apiUrl + "cms/setting/show",
        success: function(data){
            localStorage.setItem('fav', ApiMaterPlatQiniuDomain + data.data.favicon);
            $("#favicon").attr('href', ApiMaterPlatQiniuDomain + data.data.favicon);
        }
    })

    $("nav ul li").click(function(e) {
        let id = $(e.target).attr("id");
        if (id != 'project' && id != 'center' && id != 'my-project' && id != 'my-center' && id != undefined ) { //关闭
            if (id.indexOf('my') != -1) { //home
                id = id.split('-')[1];
                if (id == 'dynamic') { //跳转至动态页
                    id = '';
                    //sessionStorage.setItem('currHome', id);
                    window.location.href = '/' + domain + '/' + id;
                } else {
                    //sessionStorage.setItem('currHome', id);
                    window.location.href = '/' + domain + '/' + id;
                }
            } else { //discovery
                //sessionStorage.setItem('currDscr', id);
                window.location.href = id;
            }
        }
    })

    $("footer ul li").click(function(e) {
        let id = $(e.target).attr("id");
        let currId = window.location.pathname.split('.')[0].split('/')[1];
        if (currId != 'discovery' && currId != 'user' && currId != 'message') {
            currId = 'home'
        }
        if (currId != id) { //当前页不重新加载
            if (id != 'add' && id != undefined) {
                //切换当前页面内容
                if (curr != '' && pages.indexOf(curr) != -1) {
                    if (curr != 'user' && curr != 'message') { //from dynamic
                        bottom(id, id, "");
                    } else {
                        bottom(id, id, undefined); //dir决定跳转默认页
                    }
                } else { //动态页底部跳转
                    if (id == 'message' || id == 'user') { //from home
                        bottom(id, id, "");
                    } else {
                        bottom('dynamic', id, "");
                    }
                }
            }
        } else {
            if (id == 'home') {
                bottom(id, id, "");
            }
        }
    })

    //保存上层跳转链接
    $("a").click(function(){
        sessionStorage.setItem('history', window.location.pathname);
    })
})

$(document).ready(function(){

    $(".art-temp1 .art-des-text strong").each(function(){
        var maxLength = 10;
        if($(this).text().length > maxLength){
            $(this).text($(this).text().substring(0,maxLength)+"...")
        }
    })
    $(".art-content .art-des-text strong").each(function () {
        var maxLength = 14;
        if($(this).text().length > maxLength){
            $(this).text($(this).text().substring(0,maxLength)+"...")
        }
    })

    $(".art-content .art-des-text pre").each(function () {
        var maxLength = 40;
        if($(this).text().length > maxLength){
            $(this).text($(this).text().substring(0,maxLength)+"...")
        }
    })

    $(function() {
        $(".animsition").animsition({
            inClass               :   'fade-in',
            outClass              :   'fade-out',
            inDuration            :    300,
            outDuration           :    300,
            linkElement           :   '.animsition-link',
            // e.g. linkElement   :   'a:not([target="_blank"]):not([href^=#])'
            loading               :    true,
            loadingParentElement  :   'body', //animsition wrapper element
            loadingClass          :   'animsition-loading',
            unSupportCss          : [ 'animation-duration',
                '-webkit-animation-duration',
                '-o-animation-duration'
            ],
            //"unSupportCss" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
            //The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
            overlay               :   false,
            overlayClass          :   'animsition-overlay-slide',
            overlayParentElement  :   'body'
        });
    });

    const getChecknum = (phone) => {
        $.ajax({
            url: CODES,
            dataType: 'json',
            type: 'post',
            data: {'phone': phone},
            success: function(data){
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
        })
    }

    const tologin = (url ,phoneNum, checkNum, weid) => {
        $.ajax({
            url: url,
            type: 'POST',
            data: {
                'phone': phoneNum,
                'code': checkNum,
                'weid': weid,
                'type': 1,
                'from_type': 2
            },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    layer.msg('激活成功', {
                        time: 1500
                    })
                    //alert('token:' + data.token);
                    $(".layui-btn").hide();
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('weid', data.data.weid);
                    localStorage.setItem('phone', data.data.phone);
                    localStorage.setItem('activation', 3);
                    let next = sessionStorage.getItem('nextPage');
                    //alert('next:' + next);
                    const setCookie = (token, expiredays) => {
                        var Days = expiredays;
                        var exp = new Date();
                        exp.setTime(exp.getTime() + Days*24*60*60*1000);
                        document.cookie = "token="+ escape (token) + ";expires=" + exp.toGMTString() +";path=/";
                    }
                    setCookie(data.token, 7); //跳转失效
                    setTimeout(function(){
                        //window.location.href = '/' + next;
                        window.location.href = '/user';
                    }, 1500)
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    })
                }
            },
            error: function(err){
                console.log(err);
            }
        })
    }

    layui.use('layer', function(){ //独立版的layer无需执行这一句
        var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
        //触发事件
        var active = {
            setTop: function(){
                var that = this;
            }
            ,notice: function(){
                layer.confirm('仅需一步，即可激活您的账号', {
                    skin:'confirm-class',
                    title: false,
                    closeBtn: false,
                    btn: ['暂不','激活'],
                    shade: 0.5,
                    shadeClose: true,
                    area: ['2.25rem', 'auto']
                }, function(index){
                    layer.close(index)
                }, function (index) {
                    layer.close(index)
                    layer.open({
                        skin:'active-class'
                        ,type: 1
                        ,title: false //不显示标题栏
                        ,closeBtn: false
                        ,shadeClose: true
                        ,area: ['320px', '250px']
                        ,shade: 0.5
                        ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
                        ,btn: ['激活']
                        ,btnAlign: 'c'
                        ,moveType: 1 //拖拽模式，0或者1
                        ,content:
                            `
                        <div id="app">
                        <!--<p style="font-size: 16px; margin-top: 25px; text-align: center;">请激活您的账号</p>-->
                        <div id="login-info">
                            <ul>
                                <li id="phonenum">
                                    <!--<span>+86 <img src="/common/img/downarrow.png" alt=""/></span>-->
                                    <input type="text" placeholder="请输入手机号码" maxlength="11" id="phone" v-model="phone" />
                                </li>
                                <li id="checknum">
                                    <input type="text" placeholder="请输入手机验证码" maxlength="6" id="check" v-model="check" />
                                    <span @click="getCheck">{{ info }}</span>
                                </li>
                            </ul>
                        </div>
                        </div>
                        `
                        ,success: function(layero){
                            $("#layui-layer1").css('overflow', 'hidden');
                            new Vue({
                                el: '#app',
                                data: {
                                    phone: '',
                                    check: '',
                                    info: '获取验证码',
                                    lock: false,
                                    backurl: '',
                                    isCheck: false,
                                    weid: '',
                                    token: ''
                                },
                                created: function() {
                                    let self = this;
                                    self.backurl = sessionStorage.getItem('currentPage');
                                    self.weid = localStorage.getItem('weid');
                                    self.token = localStorage.getItem('token');
                                    $('.layui-layer-btn0').click(function(){
                                        let phonenum = $('#phone').val();
                                        let checknum = $('#check').val();
                                        if (/^1[3|4|5|7|8][0-9]{9}$/.test(phonenum)) {
                                            if (/^[0-9]{6}$/.test(checknum)) { //发送手机和验证码验证成功
                                                function is_weixn() {
                                                    var ua = navigator.userAgent.toLowerCase();
                                                    if (ua.match(/MicroMessenger/i) == "micromessenger") {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }
                                                }
                                                //if (is_weixn()) {
                                                //    tologin(apiUrl + 'userAct', phonenum, checknum, self.weid);
                                                //} else {
                                                    tologin(LOGIN, phonenum, checknum, self.weid);
                                                //}
                                            } else {
                                                layer.msg("手机验证码输入错误", {
                                                    time: 1500
                                                })
                                            }
                                        } else {
                                            layer.msg("请输入正确的手机号码", {
                                                time: 1500
                                            })
                                        }
                                    })
                                },
                                methods: {
                                    getCheck: function() {
                                        let self = this;
                                        let count = 59;
                                        let phonenum = self.phone;
                                        if (/^1[3|4|5|7|8][0-9]{9}$/.test(phonenum)) {
                                            getChecknum(phonenum);
                                            if (!self.lock) {
                                                let evt = setInterval(function () {
                                                    self.lock = true;
                                                    if (count > 0) {
                                                        self.info = count-- + '秒';
                                                    } else {
                                                        self.info = '重新发送验证码';
                                                        self.lock = false;
                                                        clearInterval(evt);
                                                    }
                                                }, 1000)
                                            }
                                        } else {
                                            layer.msg("请输入正确的手机号码", {
                                                time: 1500
                                            })
                                        }
                                    },
                                    login: function() {
                                        let self = this;
                                        let phonenum = self.phone;
                                        let checknum = self.check;
                                    }
                                }
                            })
                        }
                    });

                });

            }
        };
        $('.layui-btn').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
    });
})

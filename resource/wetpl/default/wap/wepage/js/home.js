/**
 * Created by Hongguang on 2017/11/6.
 */

$(function(){
    const navtpl = `
        <ul>
        <li id="dynamic">动态</li>
        <li id="article">文章</li>
        <li id="project">项目</li>
        <li id="activity">活动</li>
        <li id="shopping">商品</li>
        <li id="center"><img src="/common/img/add.png" alt="add"/></li>
        </ul>`

    const mynavtpl = `
        <ul>
        <li id="my-dynamic">动态</li>
        <li id="my-article">文章</li>
        <li id="my-project">项目</li>
        <li id="my-activity">活动</li>
        <li id="my-shopping">商城</li>
        <li id="my-center"><img src="/common/img/add.png" alt="add"/></li>
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
        <li id="my">
        <img src="/common/img/my.png" alt="my"/>
        <span>我的</span>
        </li>
        </ul>`

    //info
    const getPlatUserId = (domain) => {
       $.ajax({
           url: apiUrl + 'pages/page/getDetailByDomain/' + domain,
           type: 'GET',
           async: false,
           success: function(data) {
               getUserInfo(data.data.plat_user_id);
           }
       })
    }

    const getUserInfo = (pid) => {
        $.ajax({
            url: apiUrl + 'users/' + pid,
            type: 'GET',
            async: false,
            success: function(data) {
                console.log(data.data);
            }
        })
    }

    //template
    const activity = (data, domain, avatar, nickname, motto, date) => {
        let dt = new Date(data.updated_at);
        let year = dt.getFullYear();
        let month = (dt.getMonth() + 1).toString().length == 1 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
        let day = (dt.getDay() + 1).toString().length == 1 ? '0' + (dt.getDay() + 1) : dt.getDay() + 1;
        let hour = dt.getHours().toString().length == 1 ? '0' + dt.getHours() : dt.getHours();
        let min = dt.getMinutes().toString().length == 1 ? '0' + dt.getMinutes() : dt.getMinutes();
        let template = `
        <div class="act">
            <div class="act-avatar">
                <img src="${avatar}" alt=""/>
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
                    <div class="act-cover"><img src="${ApiMaterPlatQiniuDomain + data.cover}" alt=""/></div>
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

    const myactivity = (data) => {
        let date = new Date(data.begain_time);
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().length == 1 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = (date.getDay() + 1).toString().length == 1 ? '0' + (date.getDay() + 1) : date.getDay() + 1;
        let hour = date.getHours().toString().length == 1 ? '0' + date.getHours() : date.getHours();
        let min = date.getMinutes().toString().length == 1 ? '0' + date.getMinutes() : date.getMinutes();
        let avatar = ApiMaterPlatQiniuDomain;
        if (data.cover != "") {
            avatar += data.cover;
        }
        let template = `
        <a href="${'activity-detail/' + data.weid}">
        <div class="act-content">
            <div class="act-cover"><img src="${avatar}" alt=""/></div>
            <div class="act-cont">
                <ul>
                    <li class="act-cont-title">
                    <p>${data.title}</p>
                    <p>免费</p>
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

    const article = (data, domain, avatar, nickname, motto, date) => {
        let template = `
        <div class="art-temp1">
			<div class="art-left">
				<span><img src="${avatar}" alt="" style="width: 0.36rem; border-radius: 0.36rem;"/></span>
			</div>
			<div class="art-right">
				<span class="art-title">${nickname}</span>
				<p>${motto}</p>
				<a href="${'/' + domain + '/article/' + data.weid}">
				<div class="art-content">
					<span><img src="${data.cover}" alt=""></span>
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

    const myarticle = (data) => {
        let template =`
        <a href="${'article/' + data.weid}">
        <div class="art-content">
            <span><img src="${data.cover}" alt=""></span>
            <span class="art-des-text">
                <strong>${data.title}</strong>
                <pre>${data.summary}</pre>              
            </span>
        </div>
        </a>`
        return template;
    }

    const shopping = (data, domain, avatar, nickname, motto, date) => {
        let show = data.picture.split(',').map(x => ApiMaterPlatQiniuDomain + x);
        let template = `
        <slide>
            <slide class="li_img_wap">
                <img src="${avatar}">
            </slide>
            <slide class="li_info">
                <h2>${nickname}</h2>
                <h3>${motto}</h3>
                <div class="lii_img">
                    ${show.map(x => `<img src="${x}" />`).join('')}
                </div>
                <div class="lii_sold">
                    <a href="${'/' + domain + '/shopping/' + data.weid}">
                        <slide class="li_img_wap">
                            <img src="${ApiMaterPlatQiniuDomain + data.cover}">
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
        let cover = ApiMaterPlatQiniuDomain + data.cover;
        let template = `
        <div class="lii_sold">
            <a href="${'/shopping/' + data.weid}">
                <slide class="li_img_wap">
                    <img src="${cover}">
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

    //action
    const generator = (data, fun, domain, avatar, nickname, motto, date) => data.map(x => $("#container").append(fun(x, domain, avatar, nickname, motto, date)));
    const find = (id, list) => list.filter(x => x.id == id)[0].val;

    const genBar = (state) => {
        if (state) {
            $("nav").append(navtpl);
        } else {
            $("nav").append(mynavtpl);
        }
        $("footer").append(footertpl);
    }

    //controller
    const top = function(curr, flag){
        //首页，发现中的子项目路由名称及入口
        let list = [];
        //动态页数据，将改为接口返回
        let dync_list = ['article', 'activity', 'shopping']; //discovery dynamic
        let dync_type = [{id: 1, val: 'article'}, {id: 3, val: 'activity'}, {id: 4, val: 'shopping'}]; //生成发现动态信息
        let my_dync = ['my-article', 'my-activity', 'my-shopping']; //home dynamic
        //val：HOME各页面模板渲染函数
        let my_mock = [{id: 'my-dynamic', val: 'all'}, {id: 'my-article', val: 'handleResponse'}, {id: 'my-activity', val: 'generator'}, {id: 'my-shopping', val: 'genShop'}]; //home
        //val：发现页数据
        let mock_list = [{id: 'dynamic', val: 'all'}, {id: 'article', val: 'mock_art'}, {id: 'activity', val: 'mock_act'}, {id: 'shopping', val: 'mock_shop'}]; //discovery
        //val：首页动态模板渲染函数
        let my_dyncfun = [{id: 'my-article', val: 'myarticle'}, {id: 'my-activity', val: 'myactivity'}, {id: 'my-shopping', val: 'myshop'}];
        let my_dync_type = [{id: 1, val: 'myarticle'}, {id: 3, val: 'myactivity'}, {id: 4, val: 'myshop'}]; //生成首页动态信息
        let mock_data = '';

        //$("#container").html(''); //页面不跳转
        if (curr.indexOf('my') != -1) { //从路由进入
            genBar(false);
            list = ['my-dynamic', 'my-article', 'my-project', 'my-activity', 'my-shopping'];
            if (flag) { //点击home或discovery
                sessionStorage.setItem('isMy', true);
                //window.location.href = curr + ".html";
                window.location.href = '/' + domain + '/' + curr;
            } else {
                if (find(curr, my_mock) != 'all') {
                    mock_data = 'my_' + curr.substring(3);
                    if (curr == 'my-activity') {
                        generator(my_activity, myactivity);
                    } else {
                        eval(find(curr, my_mock))(eval(mock_data));
                    }
                } else {
                    if (curr == 'my-dynamic') {
                        //console.log(my_dynamic)
                        my_dynamic.data.list.map(x => {
                            let fun = my_dync_type.filter(y => x.dynamic_type == y.id)[0].val;
                            generator([JSON.parse(x.other)], eval(fun))
                        })
                    } else {
                        my_dync.map(x => eval(find(x, my_mock))(eval('my_' + x.substring(3))));
                    }
                }
                bottom('home');
            }
        } else {
            genBar(true);
            list = ['dynamic', 'article', 'project', 'activity', 'shopping'];
            if (flag) {
                //window.location.href = curr + ".html";
                window.location.href = '/' + curr;
            } else {
                let mock_data = find(curr, mock_list);
                if (mock_data != 'all') {
                    let data = eval(mock_data);
                    data.map(x => {
                        console.log(x)
                        let avatar = ApiMaterPlatQiniuDomain + x.avatar;
                        let hour = new Date(x.updated_at).getHours().toString().length == 1 ? '0' + new Date(x.updated_at).getHours() : new Date(x.updated_at).getHours();
                        let min = new Date(x.updated_at).getMinutes().toString().length == 1 ? '0' +  new Date(x.updated_at).getMinutes() : new Date(x.updated_at).getMinutes();
                        let date = hour + ':' + min;
                        generator([JSON.parse(x.other)], eval(curr), x.domain, avatar, x.nickname, x.motto, date);
                    })
                } else {
                    dynamic.data.list.map(x => {
                        let fun = dync_type.filter(y => x.dynamic_type == y.id)[0].val;
                        let avatar = ApiMaterPlatQiniuDomain + x.avatar;
                        let hour = new Date(x.updated_at).getHours().toString().length == 1 ? '0' + new Date(x.updated_at).getHours() : new Date(x.updated_at).getHours();
                        let min = new Date(x.updated_at).getMinutes().toString().length == 1 ? '0' +  new Date(x.updated_at).getMinutes() : new Date(x.updated_at).getMinutes();
                        let date = hour + ':' + min;
                        generator([JSON.parse(x.other)], eval(fun), x.domain, avatar, x.nickname, x.motto, date)
                    })
                }
                bottom('discovery');
            }
        }
        $("#" + curr).css({
            "border-bottom": "2px solid rgb(51, 51, 51)",
            "color": "#333333"
        })
        list.map(x => {
            if (x != curr) {
                $("#" + x).css({"color": "#999999","border-bottom": "none"});
            }
        })
    }

    const bottom = function(curr, flag, dir){
        let list = ['home', 'discovery', 'message', 'my'];
        let path = window.location.pathname.split('.')[0].split('/').pop();
        if (list.indexOf(curr) != -1) {
            $("#" + curr + " img").attr('src', '/common/img/' + curr + 'blue' + '.png');
            $("#" + curr + " span").css("color", "#67a3f5");
            list.map(x => {
                if (x != curr) {
                    $("#" + x + " img").attr('src', '/common/img/' + x + '.png');
                    $("#" + x + " span").css("color", "#999999");
                }
            })
        }

        if (dir == undefined) {
            if (flag == 'home') {
                //alert(1)
                top('my-dynamic', true); //跳转页面
            }
            if (flag == 'discovery') {
                //alert(2)
                top('dynamic', true);
            }
        } else {
            if (flag == 'home') {
                //alert(3)
                if (path.indexOf('my') != -1) {
                    top(path, true);
                } else {
                    domain = sessionStorage.getItem('domain');
                    top('my-' + path, true, domain); //跳转页面
                }
            }
            if (flag == 'discovery') {
                //alert(4)
                sessionStorage.setItem('domain', domain)
                if (actState == 4 || actState == undefined) {
                    let nextPage = window.location.pathname.split('-').pop();
                    sessionStorage.setItem('nextPage', nextPage);
                    window.location.href = '/m/login';
                } else {
                    if (path.indexOf('my') != -1) {
                        top(path.substring(3), true);
                    } else {
                        top(path, true);
                    }
                }
            }
        }

        if (flag == 'my' || flag == 'message') {
            //window.location.href = flag + '.html';
            window.location.href = '/' + sessionStorage.getItem('domain') + '/' + flag;
        }
    }

    //从路由获取当前页面id
    const pages = ['dynamic', 'article', 'project', 'activity', 'shopping','my-dynamic', 'my-article', 'my-project', 'my-activity', 'my-shopping'];
    const curr = window.location.pathname.split('.')[0].split('/').pop();
    const openid = localStorage.getItem('openid');
    const token = localStorage.getItem('token');
    const actState = localStorage.getItem('activation');
    let domain = window.location.pathname.split('/')[1];
    sessionStorage.setItem('currentPage', window.location.pathname);
    //alert('weid:' + localStorage.getItem('weid'));
    //alert('openid:' + localStorage.getItem('openid'))
    //alert('token:' + localStorage.getItem('token'));
    alert('activation:' + localStorage.getItem('activation'))

    if (pages.indexOf(curr) != -1) {
        top(curr);
    } else {
        $("footer").append(footertpl);
        bottom(curr);
    }

    $("nav ul li").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'project' && id != 'center' && id != 'my-project' && id != 'my-center' && id != undefined ) {
            sessionStorage.setItem('curr', id);
            //window.location.href = id + '.html';
            window.location.href = id;
        }
    })

    $("footer ul li").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'add' && id != undefined) {
            //切换当前页面内容
            if (curr != 'my' && curr != 'message') {
                bottom(id, id, "");
            } else {
                bottom(id, id, undefined); //dir决定跳转默认页
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
})

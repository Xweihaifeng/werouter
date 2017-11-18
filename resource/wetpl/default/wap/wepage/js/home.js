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
        <li id="shopping">商城</li>
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

    //template
    var activity = (data) => {
        let template = `
        <div class="act">
            <div class="act-avatar">
                <img src="${data.avatar}" alt=""/>
            </div>
            <div class="all">
                <div class="act-info">
                    <ul>
                        <li class="act-title">${data.name}</li>
                        <li class="act-intro">${data.summary}</li>
                    </ul>
                    <div class="act-hot"><span>热门</span></div>
                </div>
                <a href="activity-detail">
                <div class="act-content">
                    <div class="act-cover"><img src="${data.avatar}" alt=""/></div>
                    <div class="act-cont">
                        <ul>
                            <li class="act-cont-title">
                            <p>${data.title}</p>
                            <p>免费</p>
                            </li>
                            <li class="act-cont-summary">${data.summary}</li>
                            <li class="act-cont-time">
                                <p>${data.date} 开讲</p>
                                <p>${data.city}</p>
                            </li>
                            <li class="act-cont-info"></li>
                        </ul>
                    </div>
                </div>
                </a>
                <div class="act-other">
                    <p>${data.time}</p>
                    <img src="/common/img/review.svg" alt=""/>
                </div>
            </div>
        </div>`
        return template;
    }

    var myactivity = (data) => {
        let template = `
        <a href="activity-detail">
        <div class="act-content">
            <div class="act-cover"><img src="${data.avatar}" alt=""/></div>
            <div class="act-cont">
                <ul>
                    <li class="act-cont-title">
                    <p>${data.title}</p>
                    <p>免费</p>
                    </li>
                    <li class="act-cont-summary">${data.summary}</li>
                    <li class="act-cont-time">
                        <p>${data.date} 开讲</p>
                        <p>${data.city}</p>
                    </li>
                    <li class="act-cont-info"></li>
                </ul>
            </div>
        </div>
        </a>`
        return template;
    }

    var article = (data) => {
        let template = `
        <div class="art-temp1">
			<div class="art-left">
				<span></span>
			</div>
			<div class="art-right">
				<span class="art-title">${data.name}</span>
				<p>${data.des}</p>
				<div class="art-content">
					<span><img src="${data.cover}" alt=""></span>
					<span class="art-des-text">
					    <strong>${data.title}</strong>
					    <pre>${data.summary}</pre>
                    </span>
				</div>
				<div class="art-other">
					<span>${data.time}</span>
					<span></span>
				</div>
			</div>
		</div>`
        return template;
    }

    var myarticle = (data) => {
        let template =`
        <div class="art-content">
            <span><img src="${data.cover}" alt=""></span>
            <span class="art-des-text">
                <strong>${data.title}</strong>   
                <pre>${data.summary}</pre>              
            </span>
        </div>`
        return template;
    }

    var shopping = (data) => {
        let template = `
        <slide>
            <slide class="li_img_wap">
                <img src="${data.avatar}">
            </slide>
            <slide class="li_info">
                <h2>${data.name}</h2>
                <h3>${data.intro}</h3>
                <div class="lii_img">
                    ${data.show.map(x => `<img src="${x}" />`).join('')}
                </div>
                <div class="lii_sold">
                    <a href="">
                        <slide class="li_img_wap">
                            <img src="${data.cover}">
                        </slide>
                        <slide class="li_info">
                            <h3>${data.title}</h3>
                            <p class="lii_sold"><span> 已售：${data.sold} </span><span> 收藏：${data.like} </span></p>
                            <div class="lii_price">￥：<span>${data.price}</span></div>
                        </slide>
                    </a>
                </div>
                <div class="lii_eval">
                    <span class="lii_time">${data.time}</span>
                    <img src="/common/img/review.svg" alt="" style="width: 0.16rem;height: 0.16rem;">
                </div>
            </slide>
        </slide>`
        return template;
    }

    var myshop = (data) => {
        let template = `
        <div class="lii_sold">
            <a href="">
                <slide class="li_img_wap">
                    <img src="${data.cover}">
                </slide>
                <slide class="li_info">
                    <h3>${data.title}</h3>
                    <p class="lii_sold1"><span> 已售：${data.sold} </span><span> 收藏：${data.like} </span></p>
                    <div class="lii_price">￥：<span>${data.price}</span></div>
                </slide>
            </a>
        </div>`
        return template;
    }

    //action
    var generator = (data, fun) => data.map(x => $("#container").append(fun(x)));
    var find = (id, list) => list.filter(x => x.id == id)[0].val;

    var genBar = (state) => {
        if (state) {
            $("nav").append(navtpl);
        } else {
            $("nav").append(mynavtpl);
        }
        $("footer").append(footertpl);
    }

    //controller
    var top = function(curr, flag){
        //首页，发现中的子项目路由名称及入口
        let list = [];
        //动态页数据，将改为接口返回
        let dync_list = ['article', 'activity', 'shopping']; //discovery dynamic
        let my_dync = ['my-article', 'my-activity', 'my-shopping']; //home dynamic
        //val：HOME各页面模板渲染函数
        let my_mock = [{id: 'my-dynamic', val: 'all'}, {id: 'my-article', val: 'handleResponse'}, {id: 'my-activity', val: 'generator'}, {id: 'my-shopping', val: 'genShop'}]; //home
        //val：发现页数据
        let mock_list = [{id: 'dynamic', val: 'all'}, {id: 'article', val: 'mock_art'}, {id: 'activity', val: 'mock_act'}, {id: 'shopping', val: 'mock_shop'}]; //discovery
        //val：首页动态模板渲染函数
        let my_dyncfun = [{id: 'my-article', val: 'myarticle'}, {id: 'my-activity', val: 'myactivity'}, {id: 'my-shopping', val: 'myshop'}];
        let mock_data = '';

        //$("#container").html(''); //页面不跳转
        if (curr.indexOf('my') != -1) { //从路由进入
            genBar(false);
            list = ['my-dynamic', 'my-article', 'my-project', 'my-activity', 'my-shopping'];
            if (flag) { //点击home或discovery
                sessionStorage.setItem('isMy', true);
                //window.location.href = curr + ".html";
                window.location.href = curr;
            } else {
                if (find(curr, my_mock) != 'all') {
                    mock_data = 'my_' + curr.substring(3);
                    if (curr == 'my-activity') {
                        generator(mock_act, myactivity);
                    } else {
                        eval(find(curr, my_mock))(eval(mock_data));
                    }
                } else {
                    if (curr == 'my-dynamic') {
                        my_dync.map(x => {
                            console.log((find(x.substring(3), mock_list)))
                            generator(eval(find(x.substring(3), mock_list)), eval(find(x, my_dyncfun)))
                        });
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
                window.location.href = curr;
            } else {
                let mock_data = find(curr, mock_list);
                if (mock_data != 'all') {
                    generator(eval(mock_data), eval(curr));
                } else {
                    dync_list.map(x => generator(eval(find(x, mock_list)), eval(x)));
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

    var bottom = function(curr, flag, dir){
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
                top('my-dynamic', true); //跳转页面
            }
            if (flag == 'discovery') {
                top('dynamic', true);
            }
        } else {
            if (flag == 'home') {
                if (path.indexOf('my') != -1) {
                    top(path, true);
                } else {
                    top('my-' + path, true); //跳转页面
                }
            }
            if (flag == 'discovery') {
                if (path.indexOf('my') != -1) {
                    top(path.substring(3), true);
                } else {
                    top(path, true);
                }
            }
        }

        if (flag == 'my' || flag == 'message') {
            //window.location.href = flag + '.html';
            window.location.href = flag;
        }
    }

    //从路由获取当前页面id
    const pages = ['dynamic', 'article', 'project', 'activity', 'shopping','my-dynamic', 'my-article', 'my-project', 'my-activity', 'my-shopping'];
    var curr = window.location.pathname.split('.')[0].split('/').pop()
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

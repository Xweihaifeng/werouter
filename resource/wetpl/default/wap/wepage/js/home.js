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
        <li id="center"><img src="img/add.svg" alt="add"/></li>
        </ul>`

    const footertpl = `
        <ul>
        <li id="home">
        <img src="img/home.svg" alt="home"/>
        <span>首页</span>
        </li>
        <li id="discovery">
        <img src="img/discoveryblue.svg" alt="home"/>
        <span>发现</span>
        </li>
        <li id="add">
        <div class="up"></div>
        <div class="down"></div>
        <img src="img/add.svg" alt="home"/>
        </li>
        <li id="message">
        <img src="img/msg.svg" alt="home"/>
        <span>消息</span>
        </li>
        <li id="my">
        <img src="img/my.svg" alt="home"/>
        <span>我的</span>
        </li>
        </ul>`

    $("nav").append(navtpl);
    $("footer").append(footertpl);

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
                <div class="act-content">
                    <div class="act-cover"></div>
                    <div class="act-cont">
                        <ul>
                            <li class="act-cont-title">${data.title}</li>
                            <li class="act-cont-time">${data.date}开始</li>
                            <li class="act-cont-info">
                                <p>${data.city}</p>
                                <p>免费</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="act-other">
                    <p>${data.time}</p>
                    <img src="img/review.svg" alt=""/>
                </div>
            </div>
        </div>`
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
				<p>${data.title}</p>
				<div class="art-content">
					<span><img src="${data.cover}" alt=""></span>
					<span class="art-des-text">${data.summary}</span>
				</div>
				<div class="art-other">
					<span>${data.time}</span>
					<span></span>
				</div>
			</div>
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
                            <div class="lii_price">￥：<span>${data.price}</span></div>
                            <p class="lii_sold"><span> 已售：${data.sold} </span><span> 收藏：${data.like} </span></p>
                        </slide>
                    </a>
                </div>
                <div class="lii_eval">
                    <span class="lii_time">${data.time}</span>
                    <img src="img/review.svg" alt="" style="width: 0.16rem;height: 0.16rem;">
                </div>
            </slide>
        </slide>`
        return template;
    }

    var generator = (data, fun) => {
        data.map(x => $("#container").append(fun(x)));
    }

    //action
    var find = (id, list) => list.filter(x => x.id == id)[0].val;

    var top = function(curr){
        let list = ['dynamic', 'article', 'project', 'activity', 'shopping'];
        let mock_list = [{id: 'dynamic', val: 'all'}, {id: 'article', val: 'mock_art'}, {id: 'activity', val: 'mock_act'}, {id: 'shopping', val: 'mock_shop'}];
        let dync_list = ['article', 'activity', 'shopping'];
        $("#" + curr).css({
            "border-bottom": "2px solid #00c9ff",
            "color": "#555555"
        })
        list.map(x => {
            if (x != curr) {
                $("#" + x).css({"color": "#9b9b9b","border-bottom": "none"});
            }
        })

        let mock_data = find(curr, mock_list);
        if (mock_data != 'all') {
            generator(eval(mock_data), eval(curr));
        } else {
            dync_list.map(x => generator(eval(find(x, mock_list)), eval(x)));
        }
    }

    var bottom = function(curr){
        let list = ['home', 'discovery'];
        $("#" + curr + " img").attr('src', 'img/' + curr + 'blue' + '.svg');
        $("#" + curr + " span").css("color", "#00c9ff");
        list.map(x => {
            if (x != curr) {
                $("#" + x + " img").attr('src', 'img/' + x + '.svg');
                $("#" + x + " span").css("color", "#555555");
            }
        })
    }

    //从路由获取当前页面id
    var curr = sessionStorage.getItem('curr');
    if (curr != null) {
        top(curr);
    } else {
        curr = window.location.pathname.split('.')[0].split('/').pop()
        top(curr);
    }

    bottom('discovery');

    $("nav ul li").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'project' && id != 'center' && id != undefined) {
            //top(id);
            sessionStorage.setItem('curr', id);
            window.location.href = id + '.html';
        }
    })

    $("footer ul li").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'add' && id != 'message' && id != 'my' && id != undefined) {
            //切换当前页面内容
            bottom(id);
        }
    })

})

$(document).ready(function(){
    $(".art-temp1 .art-des-text").each(function(){
        var maxLength = 24;
        if($(this).text().length > maxLength){
            $(this).text($(this).text().substring(0,maxLength)+"...")
        }
    })
})

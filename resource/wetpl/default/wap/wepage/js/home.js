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
    </ul>
`

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
    </ul>
`

    $("nav").append(navtpl)
    $("footer").append(footertpl)

    var top = function(curr){
        let list = ['dynamic', 'article', 'project', 'activity', 'shopping'];
        $("#" + curr).css({
            "border-bottom": "2px solid #00c9ff",
            "color": "#555555"
        })
        list.map(x => {
            if (x != curr) {
                $("#" + x).css({"color": "#e6e6e6","border-bottom": "none"});
            }
        })
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
    top(sessionStorage.getItem('curr'));
    bottom('home');

    $("nav ul li").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'project' && id != 'center' && id != undefined) {
            top(id);
            sessionStorage.setItem('curr', id);
            window.location.href = id + '.html';
        }
    })

    $("footer ul li img").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'add' && id != 'message' && id != 'my' && id != undefined) {
            bottom(id);
        }
    })
})

$(document).ready(function(){

})

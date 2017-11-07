/**
 * Created by Hongguang on 2017/11/6.
 */

$(function(){
    const navtpl = `
    <ul>
    <li id="home">动态</li>
    <li>文章</li>
    <li>项目</li>
    <li>活动</li>
    <li>商品</li>
    <li><img src="img/add.svg" alt="add"/></li>
    </ul>
`

    const footertpl = `
    <ul>
    <li>
    <img src="img/home.svg" alt="home"/>
    <span>首页</span>
    </li>
    <li>
    <img src="img/discoveryblue.svg" alt="home"/>
    <span>发现</span>
    </li>
    <li id="add">
    <div class="up"></div>
    <div class="down"></div>
    <img src="img/add.svg" alt="home"/>
    </li>
    <li>
    <img src="img/msg.svg" alt="home"/>
    <span>消息</span>
    </li>
    <li>
    <img src="img/my.svg" alt="home"/>
    <span>我的</span>
    </li>
    </ul>
`

    $("nav").append(navtpl)
    $("footer").append(footertpl)
})

$(document).ready(function(){
    $("#home").click(function(){
        alert('hi')
    })
})

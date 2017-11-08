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

    const mynavtpl = `
        <ul>
        <li id="my-dynamic">动态</li>
        <li id="my-article">文章</li>
        <li id="my-project">项目</li>
        <li id="my-activity">活动</li>
        <li id="my-shopping">商品</li>
        <li id="my-center"><img src="img/add.svg" alt="add"/></li>
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

    //myactivity
    var single = function(list){
        var cover = '';
        if (list[0].cover != '') {
            cover = list[0].cover;
        } else {
            cover = 'img/cover.png';
        }
        var template = `
                <div class="part">
                    <div class="date"><span>` + list[0].created_at + `</span></div>
                <div class="article">
                    <div class="art-title">` + list[0].title + `</div>
                <div class="art-date">` + list[0].created_at.substr(0, 10) + `</div>
                <div class="art-cover">
                    <img class="list-cover" src="` + cover + `" style="width: 100%; height: 100%;"/>
                </div>
                    <div class="art-summary">` + list[0].summary.substr(0,50) + `</div>
                    <div class="art-read"><a href="">查看全文</a></div>
                </div>
                </div>`;
        return template;
    }

    var multiBody = function(list){
        var template = `
            <div class="lists">
                <div class="list-title">` + list.title + `</div>
                <img class="list-cover" src="` + list.cover + `" />
            </div>`;
        return template;
    }

    var multiHead = function(list){
        let res = [];
        for (var i = 1; i < list.length; i++) {
            res.push(list[i]);
        }
        var template = `
            <div class="part">
                <div class="date"><span>` + list[0].created_at + `</span></div>
            <div class="art-list">
                <div class="cover">
                    <img class="list-cover" src="` + list[0].cover + `" style="width: 100%; height: 100%;"/>
                </div>
                <div class="title"><span>` + list[0].title + `</span></div>
                ` + res.map(x => multiBody(x)).join('') + `
            </div>
            </div>`;
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


    function columnList(data){
        var temp =

            '<p><label><span>'+data.title+'</span><img src="'+data.cover+'"></label></p>';
        return temp;
    }

    function listsTemp(domId){
        var temp =
            '<div id='+domId+'>'+

            '<div  class="time t_for_lists">'+
            '<span>昨天&nbsp;下午1:30</span>'+
            '</div>'+

            '<div class="lists">'+
            '<div>'+
            '<label>'+
            '<span>为什么在安静的环境下，你会听到不存在的声音？</span>'+
            '</label>'+
            '</div>'+
            '<p>'+
            '<label>'+
            '<span>为什么在安静的环境下，你会听到不存在的声音？</span>'+
            '<img src="img/slice.jpg" alt="">'+
            '</label>'+
            '</p>'+
            '<p>'+
            '<label>'+
            '<span>为什么在安静的环境下，你会听到不存在的声音？</span>'+
            '<img src="img/slice.jpg" alt="">'+
            '</label>'+
            '</p>'+
            '</div>'+


            '</div>'

        return temp;
    }

    function singleList(data,pdate,domId){
        var temp =

            '<div id='+domId+'>'+

            '<div  class="time t_for_single">'+
            '<span>下午1:30</span>'+
            '</div>'+

            '<div class="single"> '+
            '<p class="title">'+data.title+'</p>'+
            '<span class="pt">'+(pdate.getMonth()+1)+'月'+(pdate.getDate())+'号</span>'+
            '<img src="'+data.cover+'" alt="">'+
            '<span class="detail">'+data.summary+'</span>'+
            '<p>查看全文</p>'+
            '</div>'

        '</div>'


        return temp;

    }

    function getMin(arr){
        var min = arr[0];
        if(arr.length == 1){
            min = new Date(min)
        }else{
            for(var t=0;t<arr.length;t++){
                if(arr[t] < min){
                    min = arr[t]
                }
            }
        }
        return min;
    }

    function getTime(timeList,tdom){
        var weeks = ["周日","周一","周二","周三","周四","周五","周六"]

        if(timeList.length){
            var minTime = getMin(timeList);
            var minYear = minTime.getFullYear();
            var minMonth = minTime.getMonth()+1;
            var minDate = minTime.getDate();
            var minHour = minTime.getHours();
            var minSecond = minTime.getSeconds();
            var minDay = minTime.getDay();
            var minMin = minTime.getMinutes() < 10 ? "0"+minTime.getMinutes() : minTime.getMinutes();

            //  gap为0代表当天 为1代表昨天
            var gap = parseInt((new Date() - new Date(minYear+"-"+minMonth+"-"+minDate))/1000/60/60/24)
            // 只计算周内的日期 七天内但是不包括上周
            var beforeSunday = new Date() - (new Date().getDay()*24*60*60*1000)
            if(gap == 1){
                if( 0 <= minHour && minHour <= 12){
                    $(tdom).text("昨天 早上"+minHour+":"+minMin)
                }else{
                    $(tdom).text("昨天 下午"+minHour+":"+minMin)
                }

            }else if( 1 < gap && gap <= 7 && (minTime > beforeSunday)){
                if( 0<= minHour && minHour <= 12){
                    $(tdom).text(weeks[minDay]+" 早上"+minHour+":"+minMin)
                }else{
                    $(tdom).text(weeks[minDay]+" 下午"+minHour+":"+minMin)
                }
            }else if(gap == 0){
                if(0 <= minHour && minHour <=12){
                    $(tdom).text("早上"+minHour+":"+minMin)
                }else{
                    $(tdom).text("下午"+minHour+":"+minMin)
                }
            }else{
                if(0 <= minHour && minHour <=12){
                    $(tdom).text(minMonth+"月"+minDate+"日 早上"+minHour+":"+minMin)
                }else{
                    $(tdom).text(minMonth+"月"+minDate+"日 下午"+minHour+":"+minMin)
                }

            }

        }
    }

    function handleResponse(data){
        if(data.code == 200){

            $('.my_container').children().remove();

            var artList = data.data.list;
            var sort = {};
            var num = 0;
            for(var i=0;i<artList.length;i++){
                var ind = artList[i].created_at.indexOf(" ")
                var format = artList[i].created_at.substring(0,ind)
                if(sort.hasOwnProperty(format)){
                    sort[format].push(artList[i])
                }else{
                    sort[format] = [artList[i]];
                }

            }
            console.log(sort)
            for(var key in sort){

                if(sort[key].length > 1 ){

                    // 应用多个模板
                    var timeList = [];
                    $(".my_container").append(listsTemp(num))
                    $('#'+num+' .lists div').siblings('p').remove();
                    for(var i = 0; i < sort[key].length; i++){
                        if(i == 0){
                            $('#'+num+' .lists div').css('background-image','url('+sort[key][0].cover+')');
                            $('#'+num+' .lists div label span').text(sort[key][0].title)
                        }else{
                            $('#'+num+' .lists').append(columnList(sort[key][i]))
                        }
                        timeList.push(new Date(sort[key][i].created_at))
                    }

                    getTime(timeList,"#"+num+" .t_for_lists span")


                }else if(sort[key].length == 1){
                    // 应用单个模板
                    var timeList = [];
                    var pDate = new Date(sort[key][0].created_at);
                    $(".my_container").append(singleList(sort[key][0], pDate,num))

                    timeList.push(sort[key][0].created_at)
                    getTime(timeList,"#"+num+" .t_for_single span")

                }

                num++;

            }

        }
    }

    //action
    var find = (id, list) => list.filter(x => x.id == id)[0].val;
    var oneDay = (item, list) => list.filter(x => x.created_at.substr(0, 10) == item.created_at.substr(0, 10));
    var remove = (item, list) => list.filter(x => x.created_at.substr(0, 10) != item.created_at.substr(0, 10));

    var genTpl = (list) => {
        var ls = oneDay(list[0], list);
        if (list == '') {
            return ;
        }
        if (ls.length == 1) {
            $("#container").append(single(ls));
        } else {
            $("#container").append(multiHead(ls));
        }
        return genTpl(remove(list[0], list));
    }

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
        let list = [];
        let mock_list = [{id: 'dynamic', val: 'all'}, {id: 'article', val: 'mock_art'}, {id: 'activity', val: 'mock_act'}, {id: 'shopping', val: 'mock_shop'}];
        let dync_list = ['article', 'activity', 'shopping'];
        let my_list = ['my-article', 'my-activity', 'my-shopping'];
        let my_mock = [{id: 'my-article', val: 'handleResponse'}, {id: 'my-activity', val: 'genTpl'}, {id: 'my-shopping', val: ''}];
        let mock_data = '';

        //$("#container").html(''); //页面不跳转
        if (curr.indexOf('my') != -1) { //从路由进入
            genBar(false);
            list = ['my-dynamic', 'my-article', 'my-project', 'my-activity', 'my-shopping'];
            if (flag) { //点击home或discovery
                sessionStorage.setItem('isMy', true);
                window.location.href = curr + ".html";
            } else {
                mock_data = 'my_' + curr.substring(3);
                //genTpl(eval(mock_data));
                eval(find(curr, my_mock))(eval(mock_data));
                bottom('home');
            }
        } else {
            genBar(true);
            list = ['dynamic', 'article', 'project', 'activity', 'shopping'];
            if (flag) {
                window.location.href = curr + ".html";
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
            "border-bottom": "2px solid #00c9ff",
            "color": "#555555"
        })
        list.map(x => {
            if (x != curr) {
                $("#" + x).css({"color": "#9b9b9b","border-bottom": "none"});
            }
        })
    }

    var bottom = function(curr, flag){
        let list = ['home', 'discovery'];
        let path = window.location.pathname.split('.')[0].split('/').pop();
        if (list.indexOf(curr) != -1) {
            $("#" + curr + " img").attr('src', 'img/' + curr + 'blue' + '.svg');
            $("#" + curr + " span").css("color", "#00c9ff");
            list.map(x => {
                if (x != curr) {
                    $("#" + x + " img").attr('src', 'img/' + x + '.svg');
                    $("#" + x + " span").css("color", "#555555");
                }
            })
        }
        if (flag == 'home') {
            top('my-' + path, true); //跳转页面
        }
        if (flag == 'discovery') {
            top(path.substring(3), true);
        }
    }

    //从路由获取当前页面id
    //var curr = sessionStorage.getItem('curr');
    var curr = window.location.pathname.split('.')[0].split('/').pop()
    //if (curr != null) {
    //    top(curr);
    //} else {
    //    curr = window.location.pathname.split('.')[0].split('/').pop()
        top(curr);
        //bottom(curr);
    //}

    $("nav ul li").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'project' && id != 'center' && id != undefined) {
            sessionStorage.setItem('curr', id);
            window.location.href = id + '.html';
        }
    })

    $("footer ul li").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'add' && id != 'message' && id != 'my' && id != undefined) {
            //切换当前页面内容
            bottom(id, id);
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

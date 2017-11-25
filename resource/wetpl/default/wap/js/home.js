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
        <li id="wemall">商品</li>
        <li id="center"><img src="/common/img/adds.png" alt="add"/></li>
        </ul>`

    const mynavtpl = `
        <ul>
        <li id="my-dynamic">主页</li>
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
        <li id="my">
        <button data-method="notice" class="layui-btn" style="position: absolute; background: transparent;"></button>
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

    const myactivity = (data, domain) => {
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
        <a href="${'/' + domain + '/activity-detail/' + data.weid}">
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

    const myarticle = (data, domain) => {
        let template =`
        <a href="${'/' + domain + '/article/' + data.weid}">
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
            genBar(false);
            list = ['my-dynamic', 'my-article', 'my-project', 'my-activity', 'my-wemall']; //li id
            if (flag) { //点击home或discovery
                sessionStorage.setItem('isMy', true);
                //window.location.href = curr + ".html";
                //alert('domain' + domain)
                if (curr.indexOf('my') != -1) {
                    if (curr == 'my-dynamic') {
                        window.location.href = '/' + domain + '/'; //home dynamic
                    } else {
                        window.location.href = '/' + domain + '/' + curr.split('-')[1]; //del my
                    }
                } else {
                    window.location.href = '/' + domain + '/' + curr;
                }
            } else {
                if (find(curr, my_mock) != 'all') {
                    mock_data = 'my_' + curr.substring(3);
                    if (curr == 'my-activity') {
                        generator(my_activity, myactivity, domain);
                    } else {
                        eval(find(curr, my_mock))(eval(mock_data));
                    }
                } else {
                    if (curr == 'my-dynamic') {
                        //console.log(my_dynamic)
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
            genBar(true);
            list = ['dynamic', 'article', 'project', 'activity', 'wemall'];
            if (flag) {
                //window.location.href = curr + ".html";
                window.location.href = '/discovery/' + curr;
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
            $("#" + curr + " span").css("color", "#25c3fe");
            list.map(x => {
                if (x != curr) {
                    $("#" + x + " img").attr('src', '/common/img/' + x + '.png');
                    $("#" + x + " span").css("color", "#999999");
                }
            })
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
                //alert('actState:' + actState)
                sessionStorage.setItem('domain', domain)
                /*if (actState == 4 || actState == undefined) {
                    let nextPage = window.location.pathname.split('-').pop();
                    sessionStorage.setItem('nextPage', nextPage);
                    window.location.href = '/m/login';
                } else {*/
                    if (path.indexOf('my') != -1) {
                        top(path.substring(3), true);
                    } else {
                        if (path != '') {
                            top(path, true);
                        } else {
                            top('dynamic', true);
                        }
                    }
                //}
            }
        }

        if (flag == 'my') {
            if (actState == 4 || actState == undefined || actState == null) {
             let nextPage = window.location.pathname.split('-').pop();
             sessionStorage.setItem('nextPage', nextPage);   //记录跳转目标页，目前就是‘my’
             window.location.href = '/login';
             } else {
                //window.location.href = '/' + sessionStorage.getItem('domain') + '/' + flag;
                window.location.href = '/user/' + flag;  ///////////////////////////////////
            }
        }

        if (flag == 'message') {
            //window.location.href = flag + '.html';
            //window.location.href = '/' + sessionStorage.getItem('domain') + '/' + flag;
            window.location.href = '/user/' + flag;  ///////////////////////////////////
        }
    }

    //从路由获取当前页面id
    const pages = ['dynamic', 'article', 'project', 'activity', 'shopping', 'wemall'];
    const curr = window.location.pathname.split('.')[0].split('/').pop();
    const prev = window.location.pathname.split('.')[0].split('/')[1];
    const openid = localStorage.getItem('openid');
    const token = localStorage.getItem('token');
    const actState = localStorage.getItem('activation');
    let domain = window.location.pathname.split('/')[1];
    sessionStorage.setItem('currentPage', window.location.pathname);
    //alert('weid:' + localStorage.getItem('weid'));
    //alert('openid:' + localStorage.getItem('openid'))
    //alert('token:' + localStorage.getItem('token'));
    //alert('activation:' + localStorage.getItem('activation'))

    if (curr != '' && pages.indexOf(curr) != -1) { //处理/domain/或/domain形式的主页路由
        if (pages.indexOf(curr) != -1) {
            if (prev != 'discovery') {
                top('my-' + curr);
            } else {
                top(curr);
            }

        } else {
            $("footer").append(footertpl);
            bottom(curr);
        }
    } else {
        top('my-dynamic');
    }

    $("nav ul li").click(function(e) {
        let id = $(e.target).attr("id");
        if (id != 'project' && id != 'center' && id != 'my-project' && id != 'my-center' && id != undefined ) {
            if (id.indexOf('my') != -1) { //home
                id = id.split('-')[1];
                if (id == 'dynamic') { //跳转至动态页
                    id = '';
                    sessionStorage.setItem('curr', id);
                    window.location.href = '/' + domain + '/' + id;
                } else {
                    sessionStorage.setItem('curr', id);
                    window.location.href = '/' + domain + '/' + id;
                }
            } else { //discovery
                sessionStorage.setItem('curr', id);
                window.location.href = id;
            }
        }
    })

    $("footer ul li").click(function(e) {
        var id = $(e.target).attr("id");
        if (id != 'add' && id != undefined) {
            //切换当前页面内容
            if (curr != '' && pages.indexOf(curr) != -1) {
                if (curr != 'my' && curr != 'message') {
                    bottom(id, id, ""); //bottom跳转
                } else {
                    bottom(id, id, undefined); //dir决定跳转默认页
                }
            } else { //动态页底部跳转
                bottom('dynamic', id, "");
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

    const tologin = (phoneNum, checkNum, weid) => {
        $.ajax({
            url:  apiUrl + 'userAct',
            type: 'post',
            /*headers: {
             'Token': token
             },*/
            data: {
                'phone': phoneNum,
                'code': checkNum,
                'weid': weid,
                'type': 1,
                'from_type': 2
            },
            success: function(data){
                console.log(data);
//                    alert(2)
                if (data.code == 200) {
                    layer.msg('激活成功', {
                        time: 1500
                    })
//                        alert('token:' + data.token);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('activation', 3);
                    let next = sessionStorage.getItem('nextPage');
//                        alert(next);
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
                layer.open({
                    type: 1
                    ,title: false //不显示标题栏
                    ,closeBtn: false
                    ,area: ['320px', '250px']
                    ,shade: 0.8
                    ,id: 'LAY_layuipro' //设定一个id，防止重复弹出
                    ,btn: ['返回', '激活']
                    ,btnAlign: 'c'
                    ,moveType: 1 //拖拽模式，0或者1
                    ,content:
                        `
                        <div id="app">
                        <p style="font-size: 16px; margin-top: 25px; text-align: center;">请激活您的账号</p>
                        <div id="login-info">
                            <ul>
                                <li id="phonenum">
                                    <span>+86 <img src="/common/img/downarrow.png" alt=""/></span>
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
                        $(".layui-layer-btn1").css({
                            'border-color': '#1E9FFF',
                            'background-color': '#1E9FFF',
                            'color': '#fff'
                        })

                        $(".layui-layer-btn0").css({
                            'border': '1px solid #dedede',
                            'background-color': '#fff',
                            'color': '#333',
                            'margin-right': '30px'
                        })

                        $("#phone").keydown(function(evt){
                            switch (evt.keyCode){
                                case 13: $("#check").select();
                            }
                        });

                        $("#check").keydown(function(evt){
                            switch (evt.keyCode){
                                case 13: tologin(phone, check, weid, token);
                            }
                        });

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
                                //alert(localStorage.getItem('token'))
                                //alert(localStorage.getItem('weid'))

                                $("#phonenum").keydown(function(evt){
                                    switch (evt.keyCode){
                                        case 13: $(".checknum").select();
                                    }
                                });

                                $("#checknum").keydown(function(evt){
                                    switch (evt.keyCode){
                                        case 13: tologin(phone, check, weid, token);
                                    }
                                });

                                $('.layui-layer-btn1').click(function(){
                                    let phonenum = $('#phone').val();
                                    let checknum = $('#check').val();
                                    if (/^1[3|4|5|7|8][0-9]{9}$/.test(phonenum)) {
                                        if (/^[0-9]{6}$/.test(checknum)) { //发送手机和验证码验证成功
                                            tologin(phonenum, checknum, self.weid);
                                            /*var btn = layero.find('.layui-layer-btn');
                                            btn.find('.layui-layer-btn1').attr({
                                                href: '/user'
                                                //,target: '_blank'
                                            });*/
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
            }
        };

        $('.layui-btn').on('click', function(){
            var othis = $(this), method = othis.data('method');
            active[method] ? active[method].call(this, othis) : '';
        });
    });
})

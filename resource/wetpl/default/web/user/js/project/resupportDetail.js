/**
 * Created by Yaoer on 2017/8/6.
 */
 //列表折叠
sessionStorage.listname='we-project';
var url = window.location.pathname.split('/');
var repayid = url.pop();

// 判断 sessionStorage
if(sessionStorage.lastname=="we_title_4"){
    $("#we_title_4").find(".we-cont").show().parents().siblings().find(".we-cont").hide();
    $("#we_title_4").find(".title-img").css("transform","rotate(90deg)");
}

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:',favicon);
$('#favicon').attr('href', favicon);

$(document).ready(function(){
    /*
    $('.progress-top').click(function() {
        $(this).css('cursor', 'pointer');
        setTimeout(function() {
            $('.progress-left').text('中奖名单');
            $('.progress-top').text('抽奖完成').css('background', '#ccc');
            $('.pre-box tbody').show();
            $('.modal,.modal-backdrop,.demo,.modal-content').css('display', 'none');
        },
        3000);
    });
    */
    //李生 start
    //初始化中奖详情
    var InitLuckDetail=function(){
        $.ajax({
            url: PROJECT_REPAY_DETAIL+'/'+repayid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200){
                    console.log(data)
                    if(data.data.is_lucked==1){
                        //抽奖完成
                        LuckComplete(data.data);
                    }else{
                        if(data.data.is_lucked==2||isNull(data.data.is_lucked)){
                            //还未抽奖
                            LuckIncomplete();

                        }
                    }

                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //抽奖完成
    var LuckComplete=function(data){
        $('.progress-left').text('中奖名单');
        $('.progress-top').text('抽奖完成').css('background', '#ccc');
        Lucklist(repayid,1);
    }
    //抽奖完成列表
    var flagpage=true;
    var Lucklist=function(repayid,page=1){
        var limit=10;
        var sendData={
            repay_id:repayid,
            limit:limit,
            page:page,
        }
        $.ajax({
            url:PROJECT_SUPORT_LIST_LUCK,
            type:'post',
            data:sendData,
            headers: {
                    'Token': docCookies.getItem("token")
                },
            success:function(data){
                if(data.code == 200){
                    $("tbody").children().remove();
                    var i=1;
                    data.data.list.map(x =>{
                        $("tbody").append(Lucklisttemplate(x,i++));
                    })
                    // 页码start
                    var pagenum=Math.ceil(data.data.total/limit);
                    pagefun(pagenum,repayid);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    //抽奖完成列表模版
    var Lucklisttemplate=function(data,i){
        var html='<tr class="bg-tr">'+
                        '<td width="10%">'+i+'</td>'+
                        '<td>'+data.suport_realname+'</td>'+
                        '<td>'+data.suport_phone+'</td>'+
                        '<td>已中奖</td>'+
                    '</tr>';
        return html;
    }

    //页码
    var pagefun=function(pagenum,projectid){
        var pagestr="";
        if(flagpage){
            $('.pagination').children().remove();
            $('.pagination').append('<li id="prev"><a href="javascript:void(0);">«</a></li><li class="active"><span>1</span></li>');

            for(i=1;i<pagenum;i++){
                // $('.pagination').append(pagelisthtml(i));
                pagestr+='<li><a href="javascript:void(0)" id="'+(i+1)+'">'+(i+1)+'</a></li>';

            }
            $('.pagination').append(pagestr);
            $(".pagination").append('<li id="next"><a href="javascript:void(0)" class="next" rel="next">&raquo;</a></li>');
            // 点击页码事件
            $(".pagination li").bind("click",function(){
                flagpage=false;
                // console.log($(this).attr("id"));
                if($(this).attr('class')!="active"){
                    var prevactive=parseInt($(this).parent().find('.active span').text());
                    var curr=$(this).find('a').text();
                    if($(this).attr("id")=="prev"){
                         if(prevactive>1){
                             $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                            $(this).parent().find('.active').prev().append('<span>'+(prevactive-1)+'</span>').find('a').remove();
                            $(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive-1);
                            Lucklist(projectid,prevactive-1);
                        }
                    }else if($(this).attr("id")=="next"){
                        if(prevactive<pagenum){
                            $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                            $(this).parent().find('.active').next().append('<span>'+(prevactive+1)+'</span>').find('a').remove();
                            $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive+1);
                            Lucklist(projectid,prevactive+1);

                        }

                    }else{

                        Lucklist(projectid,$(this).find("a").text());

                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                        $(this).addClass("active").siblings().removeClass('active');
                        $(this).append('<span>'+curr+'</span>').find('a').remove();
                    }

                }


            })
        }
    }
    //抽奖还未完成
    var LuckIncomplete=function(){
        $('.progress-left').text('暂无抽奖结果');
        $('.progress-top').text('点击抽奖');
        //绑定抽奖点击事件
        $('.progress-top').click(function() {
            $(this).css('cursor', 'pointer');
            $('.pre-box tbody').show();
            $.ajax({
                url:PROJECT_SUPORT_LUCKY+'/'+repayid,
                type:'get',
                headers: {
                        'Token': docCookies.getItem("token")
                    },
                success:function(data){
                    if(data.code == 200){
                        $('.progress-left').text('中奖名单');
                        $('.progress-top').text('抽奖完成').css('background', '#ccc');
                        setTimeout(function() {
                            $('.modal,.modal-backdrop,.demo,.modal-content').css('display', 'none');
                        },
                        3000);
                        Lucklist(repayid,1);
                    }else{
                        $('.modal,.modal-backdrop,.demo,.modal-content').css('display', 'none');
                        layer.msg(data.message, {
                            time: 1500
                        });
                    }
                },
                error: function(xhr){
                    console.log(xhr);
                }
            })


            /*
            setTimeout(function() {
                $('.progress-left').text('中奖名单');
                $('.progress-top').text('抽奖完成').css('background', '#ccc');



            },
            3000);
            */
        });

    }
   /* //初始化菜单
    var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 200){
                    console.log('module:', data.data.list);
                    var state = data.data.list;
                    //console.log(state)
                    state.map(x => {
                        modeleName.push(x.module_id);
                        if (x.module_id === '4009ea20-8ede-11e7-83a8-156d1da77933') {
                            if (x.status == 1) {
                                //$(".we-art").slideDown(500)
                                $(".we-art").show();
                                $('#toggle-button').prop("checked", true);
                            }
                        }
                        if (x.module_id === '44fd5620-8d7f-11e7-9e08-e356d0b019f1') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-shop").show();
                                $('#toggle-button-4').prop("checked", true);
                            }
                        }
                        if (x.module_id === 'b3c00b00-a4e2-11e7-b542-2d038cc12c12') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-active").show();
                                $('#toggle-button-2').prop("checked", true);

                            }
                        }
                        if (x.module_id === 'c30c2160-a4e2-11e7-a2ad-35371a8cf051') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-project").show();
                                $('#toggle-button-1').prop("checked", true);

                            }
                        }
                        if (x.module_id === 'a9d16bc0-ada0-11e7-8c59-993d3b1d7e06') {
                            if (x.status == 1) {
                                //$(".we-shop").slideDown(500)
                                $(".we-crm").show();
                                $('#toggle-button-3').prop("checked", true);

                            }
                        }
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-project';
                var status = true;
                var list = ['we-set', 'we-art', 'we-shop','we-active','we-project', 'we-app','we-crm', 'we-log'];

                var remove = function(id, list) {
                    return list.filter(x => x != id);
                }

                $("." + curr + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                remove(curr, list).map(x => $("." + x + ":eq(1)").hide());

                var showList = function(state, id) {
                    var id = "." + id;
                    if (state) {
                        $(id + ":eq(1)").hide(500);
                        if (id != ".we-log") {
                            $(id + ":eq(0)").css("border-bottom", "0");
                        }
                        $(id + " span img").attr('src', '/common/img/more1.png');
                        status = false;
                    } else {
                        $(id + ":eq(1)").show(500);
                        $(id + " span img").attr('src', '/common/img/more_unfold.png');
                        $(id + ":eq(0)").css("border-bottom", "1px solid #eeeeee");
                        status = true;
                    }
                }

                list.map(x => {
                    $("." + x).click(function() {
                        if (curr == x) {
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '/common/img/more1.png');
                            });
                            showList(status, x);
                        } else {
                            status = false;
                            $("." + curr + ":eq(0)").css("border-bottom", "0");
                            curr = x;
                            remove(x, list).map(x => {
                                $("." + x + ":eq(1)").hide(500)
                                $("." + x + " span img").attr('src', '/common/img/more1.png');
                            });
                            showList(status, x);
                        }
                    })
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }*/
   /* //主页初始化
    var init__ = function(token){
        moduleState();
        InitLuckDetail();
        if (token != 'null' && token != undefined) {
            showLogin = false;
            isLogin = true;
            //加载用户头像
            $("#login div img").hide();
            $(".log-head").css({
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $("#avatar .avatar-icon").css({
                'background': 'url(' + localStorage.getItem('avatar') + ') no-repeat center',
                'background-size': '100% 100%'
            })
            $(".log-head").show();
        }
    }
    init__(docCookies.getItem("token"));*/
    //李生 end

})
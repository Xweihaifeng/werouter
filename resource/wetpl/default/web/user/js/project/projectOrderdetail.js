   //列表折叠
sessionStorage.listname='we-project';
var url = window.location.pathname.split('/');
var suportid = url.pop();
var weid = localStorage.getItem('weid');
    hasDomain(weid);

   /* var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article','project','active','zone', 'shopping'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal").show();
                $(".show-login").css({
                    "margin-left": width,
                    "margin-top": height
                });
                $(".show-login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user";
            }
        }

        var article = function(){

            showLogin = false;
            window.location.href = domain + "/article";
//          window.history.go(0);
        }

        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }
         var active = function(){
            showLogin = false;
            window.location.href = domain + "/activity";
        }
        var project = function(){
            showLogin = false;
            window.location.href = domain + "/project";
        }
        var zone = function(){
            showLogin = false;
            window.location.href = domain + "/quan";
        }

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article,#active,#project,#zone, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/
$(function(){
     $("#prject-list").css({
        "color": "red",
        "background": "#f7f7f7"
    });
    //初始化页面数据
    var intSuportInfo=function(){
        $.ajax({
            url: PROJECT_SUPORT_DETAIL+'/'+suportid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                console.log(data);
                if (data.code == 200){
                    var detail=data.data;
                    projecttemplate(detail);
                    if(detail.repay_id!=''){
                        repaytemplate(detail);
                    }else{
                        //清除页面元素
                        $("#repay_table").empty();
                    }

                    if(detail.is_award_join==2){
                        //参与抽奖
                        suporttemplate(detail);    
                    }else{
                        //清除页面元素
                        $("#suport_table").empty();
                    }

                    if(detail.is_complaint==2){
                        //是否有投诉
                        complainttemplate(detail);    
                    }else{
                        //清除页面元素
                        $("#complaint_table").empty();
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
    //投诉模版
    var complainttemplate=function(data){
        $("#complaint_table").children().remove();   
       
        var html='<thead>'+
                    '<tr class="bg-tr">'+
                       '<td class="wp10">投诉详情</td>'+
                    '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '<tr class="bg-tr">'+
                        '<td class="wp10">'+
                           '<div>'+
                               '<p>'+data.complaint_content+'</p>'+
                               
                           '</div>'+
                        '</td>'+
                    '</tr>'+
                    '</tbody>';
                

        $("#complaint_table").append(html);
    }
    //项目模版
    var projecttemplate=function(data){
        $("#project_table").children().remove();   
        var styletext="";
        if(data.pay_style==1){
            styletext="微信支付";
        }else if(data.pay_style==2){
            styletext="余额支付";
        }
        var html='<thead>'+
                    '<tr class="bg-tr">'+
                       '<td class="wp10">项目详情</td>'+
                    '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '<tr class="bg-tr">'+
                        '<td class="wp10">'+
                           '<div>'+
                               '<p>项目分类：'+data.cate.name+'</p>'+
                               '<p>已筹金额：'+data.project.raise_amount+'</p>'+
                               '<p>截止日期：'+data.project.date_end+'</p>'+
                               '<p>支付方式：'+styletext+'</p>'+
                               '<p></p>'+
                           '</div>'+
                        '</td>'+
                    '</tr>'+
                    '</tbody>';
                

        $("#project_table").append(html);
    }
    //回报模版
    var repaytemplate=function(data){
        
        $("#repay_table").children().remove();
            var html='<thead>'+
                '<tr class="bg-tr">'+
                   '<td class="wp10">回报详情</td>'+
                '</tr>'+
                '</thead>'+
                '<tbody>'+
                '<tr class="bg-tr">'+
                    '<td class="wp10">'+
                        '<p>支持类型：'+data.repay.title+'</p>'+
                        '<p>支持金额：'+data.sum+'</p>'+
                        '<p>支持数量：'+data.repay_copies+'</p>'+
                        '<p>配送地址：'+data.address_detail+'</p>'+
                        '<p>回报时间：'+data.repay.repay_date+'天</p>'+
                        '<p>回报内容：'+data.repay.content+'</p>'+
                        '<p>发货时间：'+data.logistics_date+'</p>'+
                    '</td>'+
                '</tr>'+
                '</tbody>';
        $("#repay_table").append(html);
        
    }
    //支持模版    
    var suporttemplate=function(data){
        var is_Winning='';
        if(data.is_award_join==2){
            if(data.is_award_grant==2){
                is_Winning='是';
            }else{
                is_Winning='否';
            }
        }
        $("#suport_table").children().remove();
            var html='<thead>'+
                    '<tr class="bg-tr">'+
                       '<td class="wp10">抽奖详情</td>'+
                    '</tr>'+
                    '</thead>'+
                    '<tbody>'+
                    '<tr class="bg-tr">'+
                        '<td class="wp10">'+
                            '<p>是否中奖：'+is_Winning+'</p>'+
                        '</td>'+
                    '</tr>'+
                    '</tbody>';
        $("#suport_table").append(html);

    }
    //初始化菜单
   /* var modeleName = [];
    var moduleState = function() {
        $.ajax({
            url: PAGES_MODULERUN_LIST,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
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
    /*//主页初始化
    var init__ = function(token){
    	moduleState();
        intSuportInfo();
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
	init__(localStorage.getItem('token'));*/		
	//李生 end

})
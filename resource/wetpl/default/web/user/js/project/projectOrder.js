   //列表折叠
sessionStorage.listname='we-project';
var url = window.location.pathname.split('/');
var projectid = url.pop();
var weid = docCookies.getItem("weid");
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


	//李生 start
	//订单菜单列表
	var INIT_SUPORT_MENU=function(){
		$.ajax({
			url: PROJECT_SUPORT_COUNT+'/'+projectid,
			type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
            	if (data.code == 200){
					$(".list-nav").children().remove();
            		$(".list-nav").append(suportmenutemplate(data.data));
            		//第一次加载列表		
               		suportOderlist(projectid);
               		NavListBingClick();
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
	//绑定菜单点击事件
	var NavListBingClick=function(){
		$('.list-nav li').click(function(){
			flagpage=true;
        	$(this).siblings().children('a').removeClass('z-own');
	        $(this).children('a').addClass('z-own');
	        var type= $(this).children('a').attr("data_type");
	        suportOderlist(projectid,type,1);	
		})	
	}
	//支持菜单html模版
	var suportmenutemplate=function(data){
		var html='<li><a class="z-own" href="#" data_type="1">全部订单('+data.count+')</a></li>'+
            '<li><a href="#" class="" data_type="2">待发货（'+data.no_logistics+'）</a></li>'+
            '<li><a href="#" class="" data_type="3">已发货（'+data.is_logistics+'）</a></li>'+
			'<li><a href="#" class="" data_type="4">已收货（'+data.is_takegoods+'）</a></li>';
       	return html;
	}
	//订单列表
	var flagpage=true;
	var suportOderlist=function(projectid,type=1,page=1){
		var limit=10;
        var is_takegoods='';
        var logistics_status='';
		if(type==2){
            logistics_status=1;
        }
        if(type==3){
            logistics_status=2;
        }
        if(type==4){
            is_takegoods=2;
        }
        var sendData={
            project_id:projectid,
            limit:limit,
            page:page,
            is_takegoods:is_takegoods,
            logistics_status:logistics_status
        }
		$.ajax({
            url:PROJECT_SUPORT_LIST,
            type:'post',
            data:sendData,
            headers: {
                    'Token': docCookies.getItem("token")
                },
            success:function(data){

                console.log(data);
                if(data.code == 200){
                	$("tbody").children().remove();	
                    var i=1;
                	data.data.list.map(x =>{
						$("tbody").append(listtemplate(x,i++));
                    })
                    //发货按钮
                	$(".btn-send").bind("click",function(){
                        orderid=$(this).closest('tr').attr("id");
                        $("#myModal_input").val(orderid);
                     /*   // var status_pay=$(this).parent().parent().find(".status_pay").attr("id");
                        var status_pay=$(this).closest('tr').attr("id");
                            console.log(orderid);*/
                    })
                    
                    // 页码start
                    var pagenum=Math.ceil(data.data.total/limit);
                    pagefun(pagenum,projectid,type);
                    
                }

            },
            error: function(xhr){
                console.log(xhr);
            }
        })


	}
	// 页码
    var pagefun=function(pagenum,projectid,type=1){
     // console.log(pagenum+":pagenum");
        var pagestr="";
        console.log(flagpage);
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
                            suportOderlist(projectid,type,prevactive-1);
                        }
                    }else if($(this).attr("id")=="next"){
                        if(prevactive<pagenum){
                            $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                            $(this).parent().find('.active').next().append('<span>'+(prevactive+1)+'</span>').find('a').remove();
                            $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive+1);
                            suportOderlist(projectid,type,prevactive+1);

                        }

                    }else{

                        suportOderlist(projectid,type,$(this).find("a").text());

                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="'+prevactive+'">'+prevactive+'</a>').find("span").remove();
                        $(this).addClass("active").siblings().removeClass('active');
                        $(this).append('<span>'+curr+'</span>').find('a').remove();
                    }

                }


            })
        }
    }
	//列表模版
	var listtemplate=function(data,i){
        var statustext="";
        if(data.status==1){
            statustext="未支付";
        }else if(data.status==2){
            if(data.logistics_status==1){
                // statustext="未发货";
                //发货按钮
               statustext= '<div class="list_details_btn btn-send manage_a" type="" id="'+data.status+'" data-toggle="modal"  data-target=".bs-example-modal-sm" data-no="'+data.weid+'">发货 </div>';
                
            }else if(data.logistics_status==2){
                statustext="已发货";
            }
        }
		var html='<tr class="bg-tr" id="'+data.weid+'">'+
                        '<td class="wp10">'+i+'</td>'+
                        '<td class="wp10">'+data.suport_realname+'</td>'+
                        '<!-- <td class="wp6">500</td> -->'+
                        '<td class="wp6">'+data.repay_copies+'</td>'+
                        '<!-- <td class="wp6">500</td> -->'+
                        '<td class="wp20">'+data.repay_title+'</td>'+
                        '<!-- <td class="wp20">天上人间</td> -->'+
                        '<!-- <td class="wp6">李四</td> -->'+
                        '<td class="wp6">'+data.cate+'</td>'+
                        '<td class="wp6 orderstatus">'+statustext+'</td>'+
                        '<!-- <td class="wp6">否</td> -->'+
                        '<!-- <td class="wp6">余额</td> -->'+
                        '<!-- <td class="wp14">在路上</td> -->'+
                        '<td class="wp10" style="min-width: 100px">'+data.logistics_date+'</td>'+
                        '<td class="wp10" style="min-width: 50px">'+
                          '<a href="/user/admin/project/Orderdetail/'+data.weid+'" class="manage_a">管理订单</a>'+
                        '</td>'+
                    '</tr>';

		return html;	
	}
    // 填写物流公司
    // var company=function(orderid,status_pay){
        $('.save').bind('click', function() {
            var l_company = $("input[name=wuliu_company]").val();
            var l_card = $("input[name=wuliu_card]").val();
            var id = $("#myModal_input").val();
            var l_status=2;
            // var a = csrf.csrfToken;
            var sendData={
                weid:id,
                // logistics_status:l_status,
                logistics_no:l_card,
                logistics_company:l_company
                
            }

            console.log(sendData);
            $.ajax({
                url: PROJECT_SUPORT_UPDATE,
                type:'post',
                data:sendData,
                headers: {
                        'Token': docCookies.getItem("token")
                    },
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    if (data.code == 200) {
                        mess_tusi("修改成功");
                         $('#myModal').modal('hide');                       

                        $("#"+id).find(".orderstatus").children().remove();
                         $("#"+id).find(".orderstatus").append("<div>已发货</div>");
                        

                        $("input[name=wuliu_company]").val('');
                        $("input[name=wuliu_card]").val('');


                    }else {
                        mess_tusi(data.message);
                    }
                }
            })

        });
    // }

	//初始化菜单
    /*var modeleName = [];
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
    //主页初始化
   /* var init__ = function(token){
    	moduleState();
    	INIT_SUPORT_MENU();
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
	init__(docCookies.getItem("token"));	*/
	//李生 end

})
 /**
 * Created by Hongguang on 2017/8/6.
 */
 //列表折叠
sessionStorage.listname='we-shop';
var qiniu_uptoken = '';
var saveto ='qiniu';
//var qiniu_upload_domain = 'http://upload.qiniu.com';
var qiniu_bucket_domain = ApiMaterPlatQiniuDomain;
var __init = function(){
    $.ajax({
        url:  QINIU_UPTOKEN_URL,
        type: 'get',
        dataType: 'json',
        success: function(data){
            qiniu_uptoken = data.uptoken;
        },
        error: function(xhr){
            console.log(xhr);
        }
    });
}

///////////////////////吐丝层start/////////////////////////////////////
  var tusitemp="";
    function mess_tusi(strs){
        //清除事件
        clearTimeout(tusitemp);
        $("#mess_tusi").remove();
        //创建吐丝层并写入内容
        if(!$("#mess_tusi").attr("id")){ //吐丝层不存在创建
            $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>"+strs+"</span></div>"); //写入内容
        }else{
            $("#mess_tusi").html(strs);  //写入内容
        }

        //定义吐丝层位置
        var left=(1200-$("#mess_tusi").width())/2 + 70;//居中
        var top=$(window).height()*0.25;
        $("#mess_tusi").css({"left":left+"px","top":top+"px"});

        //显示吐丝层
        $("#mess_tusi").css("display",'');

        //5秒后关闭
        tusitemp =  setTimeout(function (){
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        },5000);
        return false;
    }

// 吐丝层end////////////////////////////////////

//const ApiMaterPlatQiniuDomain = 'http://images.new.wezchina.com/';

var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
console.log('logo:',favicon);
$('#favicon').attr('href', favicon);


$(function(){

    __init();


   /* //route
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
    var routerList = ['home', 'login', 'article'];

    var isMember = function(routerList, route){
        return routerList.filter(x => x === route);
    }

    var home = function(){
        window.location.href = '../../index';
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
            window.location.href = "../../user/discovery";
        }
    }

    var article = function(){
        showLogin = false;
        window.location.href = "../../article/";
    }

    if (isMember(routerList, route) != ""){
        eval(route)();
    }
}

    $("#home, #login, #article").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:',logo);
    $('#home img').attr('src', logo);

    var login = function(){
        window.location.href = "/login";
    }


   var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data){
                /*if (data.code == 401) {
                 domain = '/index';
                 localStorage.removeItem('token')
                 window.location.href = '/login'
               }*/
                if (data.code == 200){
                    console.log(data);
                    if (data.data == null) {
                        //没有个性域名
                        domain = '/index';
                    } else {
                        //存在个性域名
                        domain = "/" + data.data.domain;
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

    var weid = localStorage.getItem('weid');
    hasDomain(weid);

    var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article', 'shopping'];

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

        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article, #shopping").click(function(){
        var id = $(this).attr("id");
        router(id);
    })


/*    // 通过地址id获得配送范围详情
    var rangedetail=function(weid){
        console.log(weid);
        $.ajax({
            url: apiUrl+'goods/range/detail/' + weid,
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            dataType: 'json',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                   $(".set_adr").before('<p>'+data.data.area_names+'</p><input type="hidden" name="distribution_id" value="'+weid+'">')
                    console.log($(".adressall .sa_cum"));

                   $(".adressall .sa_cum input[name='distribution']").each(function(){
                        if($(this).data("val")==weid){
                            console.log($(this).attr("checked"));
                            $(this).attr("checked",true);
                        }
                   })
                }
            },
            error:function(xhr){
                console.log(xhr);
            }
    })
    }*/


// 获取省列表
    var provincename="";
    var getprovincedetail=function(range_id=0){
        $.ajax({
            url:PROVINCE_LIST,
            type:'get',
            headers: {
                        'Token': localStorage.getItem('token')
                    },
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                     provincename=data.data.name;
                     data.data.list.map(x => {
                     $(".provlist").append('<li><span>'+x.name+'</span><input class="province_check" data-id="'+x.id+'" data-text="'+x.name+'" type="checkbox"></li>')

                     })

                     // 加载js
                     // $("body").append("");

                   /* $.getScript("/user/js/ship_addressmode.js",function(){
                        rangedetail(range_id);
                    })*/


                }else{
                    console.log('PROVINCE LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
/*//获取省下市
var provcity=function(id){
    $.ajax({
            url:apiUrl+'area/list/'+pid,
            type:'get',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var citydata = data.data.list;
                    citydata.map(x => {
                        // $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");


                    })

                }else{
                    console.log('CITYS  LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
}*/
getprovincedetail();
    // }
 //left-navbar show words
    // $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
    //     var id = $(this).attr("id");
    //     if (id != 'login') {
    //         $(this).find(".word").show();
    //         $(this).css({
    //             "line-height": "65px"
    //         });
    //         $("#" + id + " .word").css("margin-top", "-30px");
    //     } else {
    //         if (!isLogin) {
    //             $(this).css({
    //                 "line-height": "65px",
    //             });
    //             $("#" + id + " .word").css("margin-top", "-30px");
    //         }
    //     }
    // }, function(){
    //     var id = $(this).attr("id");
    //     $(this).find(".word").hide();
    //     $(this).css("line-height", "65px");
    //     $("#" + id + " .word").css("margin-top", "-55px");
    // })

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
                var curr = 'we-shop';
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
    }
*/

  /*  //主页初始化
    var init__ = function(token){
        // moduleState();
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
})

// 配送列表模板
var rangetemplate=function(data){
    var rangehtml=' <dl data-id="'+data.weid+'">'+
                '<dt>'+
                    '<h4>'+data.name+'</h4>'+
                    '<p>'+data.area_names+'</p>'+
                '</dt>'+
                '<dd style="display: none;">'+
                    '<a href="javascript:;" class="eidt">编辑</a>'+
                    '<a href="javascript:;" class="del">删除</a>'+
                '</dd>'+
            '</dl>';
    return rangehtml;
}
// 配送列表
        var rangelist=function(){
            $.ajax({
                    url:GOODS_RANGE_LISTS,
                    type:'post',
                    headers: {
                        'Token': localStorage.getItem('token')
                    },
                    success: function(data){
                        console.log(data);

                        if (data.code == 200) {
                            $(".adressall").children().remove();
                            data.data.map(x => {
                                $(".adressall").prepend(rangetemplate(x));

                            })
                        }else{




                            console.log('RANGE  LIST ERROR');
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
        }
        rangelist();

/*//获取省下市
var provcity=function(id){
    $.ajax({
            url:apiUrl+'area/list/'+pid,
            type:'get',
            success: function(data){
                console.log(data);
                if (data.code == 200) {
                    var citydata = data.data.list;
                    citydata.map(x => {
                        // $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");


                    })

                }else{
                    console.log('CITYS  LIST ERROR');
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
}
*/





// 外部js文件
$(function(){
                        console.log("aaaa");

    //添加商品页面---添加修改配送范围
        //添加配送范围
        $(".set_adr").click(function(){
            floadbox(".roadiomode",{
                width:500,
                height:340
            })
        })
        //设置配送范围模板
        $(".add_mode").click(function(){
            modesetInt();
            floadbox(".modeset",{
                width:500,
                height:390,
                type:1
            })
        });
        //选择模版
        $(document).on("change",".roadiomode input[type = radio][name = distribution ]",function(){
            if ($(this).prop("checked")){
                var str = $.trim($(this).next().next().text());
                if ($("#pro_ship_address").find("p").length>0){
                    $("#pro_ship_address").find("p").html(str);
                }else{
                    $("#pro_ship_address").prepend("<p>"+str+"</p>");
                }
                if ($("#pro_ship_address").find("input[name='distribution_id']").length>0){
                    $("#pro_ship_address").find("input[name='distribution_id']").val($(this).data("val"));
                }else{
                    $("#pro_ship_address").find("p").after('<input type="hidden" name="distribution_id" value="'+$(this).data("val")+'"/>');
                }
                $(this).parents(".roadiomode").find("a.close").trigger("click");
            }
        })
        //区域管理页面
        //删除
        $(document).on("click",".sa_list a.del",function(){
            var id = $(this).parents("dl").data("id");
            var params = {id:id};
             $.ajax({
                    url: GOODS_RANGE_DESTORY+'/' + id,
                    type:'get',
                    headers: {
                            'Token': localStorage.getItem('token')
                        },
                    dataType: 'json',
                    success: function(data){
                        console.log(data);
                        if (data.code == 200) {
                           mess_tusi("删除成功");
                           window.location.reload();


                        }else{
                           mess_tusi(data.message);

                        }
                    },
                    error:function(xhr){
                        console.log(xhr);
                    }
                })

        })
        //划过
        $(document).on("mouseover",".sa_list dl",function(){
            $(this).find("dd").show();
        }).mouseout(function(){
            $(this).find("dd").hide();
        });
        //编辑
        $(document).on("click",".sa_list a.eidt",function(){
            var id = $(this).parents("dl").data("id");
            $(".setmode_btn").data("id",id);
            var params = {weid:id};
            var c_ar = [];

            // 通过地址id获得配送范围详情
            // var rangedetail=function(weid){
                console.log(id);
                $.ajax({
                    url: GOODS_RANGE_DETAIL+'/'+id,
                    type:'get',
                    headers: {
                            'Token': localStorage.getItem('token')
                        },
                    dataType: 'json',
                    success: function(data){
                        console.log(data);
                        if (data.code == 200) {
                            get_distributionCallback(data);

                        }
                    },
                    error:function(xhr){
                        console.log(xhr);
                    }
                })
            // }

            var get_distributionCallback = function(msg){
                if(msg.code == 200){
                    var area = "";
                    modesetInt();
                    floadbox(".modeset",{
                        width:500,
                        height:390
                    })
                    console.log(msg);
                    $("#modeName").val(msg.data.name)
                    address = {};
                    msg.data.province_ids.split(",").map(x=>{
                        var c_ar = new Array;
                        var pid = x;
                        console.log(x);
                        $(".province input[type=checkbox]").each(function(){
                            if ($(this).data('id') == pid){
                                $(this).attr("checked",true)
                            }
                        })
                        // 省下市
                        // var provcity=function(id){
                            $.ajax({
                                url:AREA_LIST+'/'+pid,
                                type:'get',
                                success: function(data){
                                    console.log(data);
                                    if (data.code == 200) {
                                        var citydata = data.data.list;
                                        citydata.map(x => {
                                            // $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");
                                            $(".cityul").append('<li><span>'+x.name+'</span><input type="checkbox" data-text="'+x.name+'"  data-pid="'+x.province_id+'" data-id="'+x.id+'" /></li>')
                                            /*c_ar.push(x.id);
                                            c_ar_text.push(x.name);*/
                                            msg.data.areas_ids.split(",").map(x=>{

                                                $(".cityul input[type=checkbox]").each(function(){
                                                    if ($(this).data('id') == x){
                                                        $(this).attr("checked",true)
                                                    }
                                                })

                                            })

                                        })

                                    }else{
                                        console.log('CITYS  LIST ERROR');
                                    }
                                },
                                error: function(xhr){
                                    console.log(xhr);
                                }
                            })
                        // }

                    })

                  /*  for (var x in msg.data.areas_ids.split(",") ){
                        console.log(x);
                        var c_ar = new Array;
                        var pid = x;
                        // var evalStr="regionConf.r"+pid+".c";
                        // var regionConfs=eval(evalStr);
                        // evalStr+=".";
                        // for(var key in regionConfs){
                        //     var name = eval(evalStr+key+".n");
                        //     var id = eval(evalStr+key+".i");
                        //     var chkids = msg.data.areas_ids[x];
                        //     if($.inArray(""+id,chkids) != -1){
                        //         var $li = '<li><span>'+name+'</span><input type="checkbox" data-text="'+name+'" checked = true data-pid="'+pid+'" data-id="'+id+'" /></li>';
                        //         $(".cityul").append($li)
                        //         c_ar.push(id);
                        //     }else{
                        //         var $li = '<li><span>'+name+'</span><input type="checkbox" data-text="'+name+'" data-pid="'+pid+'" data-id="'+id+'" /></li>';
                        //         $(".cityul").append($li)
                        //     }
                        // }
                        allset();
                        address[pid] = c_ar;

                        $(".province input[type=checkbox]").each(function(){
                            if ($(this).data('id') == pid){
                                $(this).attr("checked",true)
                            }
                        })
                    }*/
                }else{
                    $.showErr(msg.description,function(){
                        if(msg.data){
                            window.location.href = msg.data;
                        }
                    });
                }
            }
            // requestAjax(params,'get', get_distributionURL,get_distributionCallback, true);
        })
        //新建模版
        $(".add_mode_btn").click(function(){
            modesetInt();
            floadbox(".modeset",{
                width:500,
                height:390
            })
        });
        //配送范围方法
        //初始
        function modesetInt(){
            $("#modeName").val("");
            $(".province input").attr("checked",false)
            $(".city input[type=checkbox]").attr("checked",false)
            $(".cityul").html("")
        }
        //全选
        function allset(){
            var b = false;
            var allch = $(".cityul").find("input[type=checkbox]");
            allch.each(function(){
                if (!$(this).prop("checked")){
                    b = true;
                    return false;
                }
            })
            if (b){
                $(".ci_check").prop("checked",false)
            }else{
                $(".ci_check").prop("checked",true)
            }
        }
        $(".ci_check").change(function(){
            $(".cityul").find("input[type=checkbox]").prop("checked",true)
        });
        //配送范围地址选择
        var address = {};
        var provinceidstr=[];
        $(".province").on("change","input[type=checkbox]",function(){
            var parentId = $(this).attr("data-id");
            console.log("parentId:"+parentId);
            var c_ar = [];//市id集合
            var c_ar_text = [];
            if ($(this).prop("checked")){
                //加载市区
                var pid = $(this).data("id");
                provinceidstr.push(pid);//省id集合
                // city start
                // provcity(pid);
                $.ajax({
                    url:AREA_LIST+'/'+pid,
                    type:'get',
                    success: function(data){
                        console.log(data);
                        if (data.code == 200) {
                            var citydata = data.data.list;
                            citydata.map(x => {
                                // $("#city").append("<option value='"+x.id+"'>"+x.name+"</option>");
                                $(".cityul").append('<li><span>'+x.name+'</span><input type="checkbox" data-text="'+x.name+'" checked = true data-pid="'+x.province_id+'" data-id="'+x.id+'" /></li>')
                                c_ar.push(x.id);
                                c_ar_text.push(x.name);
                            })

                        }else{
                            console.log('CITYS  LIST ERROR');
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
                // city end


                /*var evalStr="regionConf.r"+pid+".c";
                var regionConfs=eval(evalStr);
                evalStr+=".";
                for(var key in regionConfs){
                    var name = eval(evalStr+key+".n");
                    var id = eval(evalStr+key+".i");
                    var $li = '<li><span>'+name+'</span><input type="checkbox" checked = true data-pid="'+pid+'" data-id="'+id+'" /></li>';
                    $(".cityul").append($li)
                    c_ar.push(id);
                }
                allset();*/
                address[parentId] = c_ar;
                console.log(address);
            }else{
                deleteData(address,parentId);
                $(".cityul").find("li input[data-pid = "+parentId+"]").parents("li").remove();
            }
        })
        $(".cityul").on("change","input[type=checkbox]",function(){
            var _This = $(this);
            if ($(this).prop("checked")){
                for (var x in address ){
                    if (x == $(this).attr("data-pid")){
                        address[x].push($(this).data("id"));
                    }
                }
            }else{
                for (var x in address ){
                    if (x == $(this).attr("data-pid")){
                        for (var i=0;i<address[x].length ;i++ ){
                            if (address[x][i] == $(this).data("id")){
                                address[x].splice(i,1)
                            }
                        }
                    }
                }
            }
            allset();
        })
        //保存配送范围模版
        $(".setmode_btn").click(function(){
            var areanamestr=[];

            var page = $(this).data("page")
            var id = $(this).data("id")
            console.log("确定按钮data-id:"+id);
            console.log("确定按钮data-page:"+page);
            var _this = $(this);
            var modeName = $("#modeName").val()
            if ($.trim(modeName) == ""){
                mess_tusi('请填写模板名称');
                // $.showErr("请填写模板名称");
                return false;
            }
            if(id==0){
                if (jQuery.isEmptyObject(address)){
                    // $.showErr("请选择区域");
                    mess_tusi('请选择区域');

                    return false;
                }
            }

            var area = "";
            var areaarr=[];
            var areastr=[];
            // var areanamestr="";
            $('.cityul input[type=checkbox]:checked').each(function(){
                console.log($(this).data("text"));
                areanamestr.push($(this).data("text"));
            })
            console.log(address);


            for (var x in address ){
                var pid = x;
                var pname = $(".province_check[data-id='"+pid+"']").data("text");
                var snames = [];
                // var evalStr="regionConf.r"+pid+".c";
                // var regionConfs=eval(evalStr);
                // evalStr+=".";
                console.log(pname);
                $(address[x]).each(function(index,item){
                    console.log(address[x]);
                    areastr.push(item);
                    areanamestr=$(".cityul input[data-id='"+item+"']").data("text");

                // $(address[x]).map(x=>{
                    console.log(index,item);
                    // var name =eval(evalStr+"r"+item+".n");
                    snames.push(areanamestr);


                })
                console.log(snames);
                // areanamestr=snames.join(",");
                // area += pname+"("+areanamestr.join(",")+")";
                // area += pname+"("+snames.join(",")+")";
                areaarr.push( pname+"("+snames.join(",")+")");
            }
            // console.log(area);//省城市names
            console.log(areaarr);//省城市names
            console.log(areastr.join(","));//城市id集合
            // 省id集合
            console.log(provinceidstr.join(","));
            // console.log(areanamestr.join(","));//城市names
            /*var joinsname=function(snames){
                console.log(snames);
            }*/
            //提交服务器
            var params = {area_names:areaarr.join(","),areas_ids:areastr.join(","),province_ids:provinceidstr.join(","),name:modeName};
            console.log(params);
            if(id!=0){
                var pnames=[];
                var pids=[];

                // var areanames=[];
                var areaids=[];
                var proareanames=[];
                var areanames=[];
                var proareastr="";
                $(".province_check:checked").each(function(){
                    areanames=[];

                    var _that=$(this);
                    console.log($(this).data("id"));
                    pnames.push($(this).data("text"));
                    pids.push($(this).data("id"));

                    $('.cityul input[type=checkbox]:checked').each(function(index){

                        console.log(_that.data("id"),$(this).data("pid"));
                        areaids.push($(this).data("id"));
                        if(_that.data("id")==$(this).data("pid")){
                            // proareanames[_that.data("id")]=$(this).data("text");
                            areanames.push($(this).data("text"));

                            /*proareastr+=_that.data("text")+"("+$(this).data("text")+")";

                            areanames.push($(this).data("text"));

                        proareanames.push(_that.data("text")+"("+areanames.join(",")+")");*/
                        }
                    })
                        // proareastr+="("+areanames.join(",")+")";
                    proareastr= $(this).data("text")+"("+areanames.join(",")+")";
                    proareanames.push(proareastr);
                })
                // params.weid=id;
                console.log(params);
                console.log(pnames,pids);
                console.log(areanames);
                console.log(proareastr);
                console.log(proareanames);
               params={weid:id,province_ids:pids.join(","),areas_ids:areaids.join(","),area_names:proareanames.join(","),name:modeName};
                console.log(params);
                // 修改配送范围
                 $.ajax({
                    url:GOODS_RANGE_UPDATED,
                    type:'post',
                    data:params,
                    headers: {
                        'Token': localStorage.getItem('token')
                    },
                    success: function(data){
                        console.log(data);
                        if (data.code == 200) {
                            address = {};

                            // $(".setmode_btn").data("id","");
                            // _this.prev().trigger("click");
                            mess_tusi("修改成功");
                            // $.showSuccess("保存成功",function(){
                                if(page){
                                    window.location.reload();
                                }else{

                                    // 配送列表添加
                                    console.log("tianjia");
                                    rangelist();
                                    // var modeDiv ='<div class="sa_cum">'+
                                    //         '<input type="radio" data-val="'+msg.data+'" name="distribution"/>'+
                                    //         '<h4>'+modeName+'</h4>'+
                                    //         '<div class="address">'+area
                                    //         +'</div></div>';
                                    // $(".roadiomode .adressall").prepend(modeDiv);
                                }
                            // });
                        }else{
                            console.log('RANGE  LIST ERROR');
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
            }else{
                // 添加配送范围
                 $.ajax({
                    url:GOODS_RANGE_STORE,
                    type:'post',
                    data:params,
                    headers: {
                        'Token': localStorage.getItem('token')
                    },
                    success: function(data){
                        console.log(data);
                        if (data.code == 200) {
                            address = {};

                            $(".setmode_btn").data("id","");
                            _this.prev().trigger("click");
                            mess_tusi("保存成功");
                            // $.showSuccess("保存成功",function(){
                                if(page){
                                    window.location.reload();
                                }else{

                                    // 配送列表添加
                                    console.log("tianjia");
                                    rangelist();
                                    // var modeDiv ='<div class="sa_cum">'+
                                    //         '<input type="radio" data-val="'+msg.data+'" name="distribution"/>'+
                                    //         '<h4>'+modeName+'</h4>'+
                                    //         '<div class="address">'+area
                                    //         +'</div></div>';
                                    // $(".roadiomode .adressall").prepend(modeDiv);
                                }
                            // });
                        }else{
                            console.log('RANGE  LIST ERROR');
                        }
                    },
                    error: function(xhr){
                        console.log(xhr);
                    }
                })
            }

            /*var save_distributionCallback = function(msg){
                address = {};
                if(msg.result == 0){
                    $(".setmode_btn").data("id","");
                    _this.prev().trigger("click");
                    $.showSuccess("保存成功",function(){
                        if(page){
                            window.location.reload();
                        }else{
                            var modeDiv ='<div class="sa_cum">'+
                                    '<input type="radio" data-val="'+msg.data+'" name="distribution"/>'+
                                    '<h4>'+modeName+'</h4>'+
                                    '<div class="address">'+area
                                    +'</div></div>';
                            $(".roadiomode .adressall").prepend(modeDiv);
                        }
                    });
                }else{
                    $.showErr(msg.description,function(){
                        if(msg.data){
                            window.location.href = msg.data;
                        }
                    });
                }
            }*/
            //requestAjax(params, 'post', save_distributionURL, save_distributionCallback, true);
        });


        //配送范围弹层
        function floadbox(id,set){
            var box = $(id);
            var Dw = $(window).width();
            var Dh = $(window).height();
            if ($(".floadbg").length<=0){
                var bg = $("<div class='floadbg'></div>");
                $("body").append(bg);
                bg.css({"width":Dw + "px","height":Dh + "px"});
            }else{
                $(".floadbg").show();
            }
            box.show();
            box.css({"width":set.width+"px","height":set.height + "px","top":(Dh-set.height)/2 + "px","left":(Dw - set.width)/2 + "px"});
            box.find("a.close").on("click",function(){
                address = {};
                box.hide();
                $(".setmode_btn").data("id","");
                if (set.type != 1){
                    $(".floadbg").hide();
                }
            })
        };

        //删除json对像
        function deleteData(json,name) {
            for (var x in json ){
                if (x == name){
                    delete json[x];
                }
            }
        }

});
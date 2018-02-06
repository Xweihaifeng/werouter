/**
 * Created by Hongguang on 2017/8/3.
 */
/*e3d88210-8e37-11e7-a380-9dd18b8ffa23*/
 //列表折叠
sessionStorage.listname='we-shop';
$(document).ready(function(){

    //const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    console.log('logo:',favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:',logo);
    $('#home img').attr('src', logo);

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
        var left=($(window).width()-$("#mess_tusi").width())/2 -180;//居中
        var top=$(window).height()*0.5;
        $("#mess_tusi").css({"left":left+"px","top":top+"px"});

        //显示吐丝层
        $("#mess_tusi").css("display",'');

        //2秒后关闭
        tusitemp =  setTimeout(function (){
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        },2000);
        return false;
    }

    var saveUserInfo = function(token) {
        localStorage.setItem('token', token);
    }
    var weid=docCookies.getItem("weid");
   console.log(docCookies.getItem("weid"));

   var domain;
    var hasDomain = function(weid){
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': docCookies.getItem("token")
            },
            success: function(data){
                if (data.code == 401) {
                  // domain = '/index';
                  localStorage.removeItem('token')
                  // window.location.href = '/login'
                }
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

    var weid = docCookies.getItem("weid");
    hasDomain(weid);
    //商品分类列表模板
    var catelisthtml=function(data){

        /*var listhtml='<tr id="'+data.weid+'">'+
                '<td>'+data.name+'</td>'+
                '<td><a class="edit" data-toggle="modal"  data-target=".bs-example-modal-sm">编辑</a> <a class="del">删除</a></td>'+

            '</tr>';*/
        if(data.weid == -1){
            return;
        }
        var listhtml='<li class="clearfloat category-item" data-id="'+data.weid+'">'+
                    '<input type="text" style="width: 230px;" class="sort_info category-name" value="'+data.name+'" data-origin="'+data.name+'">'+
                    '<input type="text" style="width: 230px;margin-left: 50px;" class="sort_info category-ename" value="'+data.ename+'" data-origin="'+data.ename+'">'+
                    '<input type="text" class="order_info category-floor" value="'+data.sort+'" data-origin="'+data.sort+'">'+
                    '<div class="operate_info">'+
                        '<a href="javascript:;" class="delete_sort">删除</a>'+
                    '</div>'
        return listhtml;
        // '|'+
        // '<a href="javascript:;" class="showpubmanage">查看</a>'+
    }

     // 获取商品分类
    var catesfun = function(weid){
        $.ajax({
            // url: "http://apitest.wezchina.com/goods/cates/list",
            url: apiUrl + 'articles/cates/',
            type: 'get',
            headers: {
                    'Token': docCookies.getItem("token")
                },
            data:{domain:pages_index},
            success: function(data){
                if (data.code == 200) {
                    var cate = data.data;
                    cate.map(x => {
                        $(".operate_box").append(catelisthtml(x));
                    })
                      $(".order_info").keyup(function(){
                         var c=$(this);
                         console.log(c.val());
                         console.log(/^\d*(?:.\d{0,2})?$/.test(c.val()));
                         if(/[^\d.]/.test(c.val())){//替换非数字字符
                         // if(/^\d*(?:.\d{0,2})?$/.test(c.val())){//替换非数字字符/^d*(?:.d{0,2})?$/
                          var temp_amount=c.val().replace(/[^\d.]/g,'');
                          // var temp_amount=c.val().replace(/^\d*(?:.\d{0,2})?$/,'');
                          $(this).val(temp_amount);
                         }

                    })
                    cateadd();
                    // cateedit();
                    // delcate();
                    $(".showpubmanage").bind("click",function(){
                        console.log($(this).closest('li').data("id"));
                        window.location.href='/user/admin/wemall/goods/list/'+$(this).closest('li').data("id")

                    })

                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    catesfun(weid);
    //back to top
    $("#toTop").hide();
    $(".read").scroll(function(){
        if ($(".read").scrollTop() > $(window).height() / 2) {
            $("#toTop").fadeIn(500);
            $("#toTop").hover(function(){
                $(this).css("background-color", "#eeeeee");
            }, function(){
                $(this).css("background-color", "white");
            });
        } else {
            $("#toTop").fadeOut(500);
        }
    })

    $("#toTop").click(function(){
        $('.read').animate({scrollTop:0}, 300);
    })
    // 添加分类
    var cateadd=function(){
        /*$(".btn-add").bind("click",function(){
            console.log()
            $(".modal-title").text("添加分类");
            $("#myModal_input").val(0);
            $("input[name=catename]").val("");
        }) */
        var categoryItemValue = [];
        var newCIV = [];
        var subB = false;
        $(".category-item").each(function(){
            categoryItemValue.push($(this).find(".category-name").val());
            newCIV.push($(this).find(".category-name").val())
        });
        //添加商品分类
        $('#add_sort').on('click',function(){
            var sortList = "<li class='clearfloat category-item' data-id='0'><input style='width: 230px' type='text' class='sort_info category-name' value=''><input style='width: 230px;margin-left: 50px;' type='text' class='sort_info category-ename'><input type='number' class='order_info category-floor' value=''><div class='operate_info'><a href='javascript:;' class='delete_sort'>删除</a></div></li>";
            $('.operate_box').append(sortList);
            $('.no_sort').remove();
            newCIV.push("")
        });

        $(".operate_box").on("blur",".category-name",function(){
            var _This =  $(this)
            var _index = $(this).parents("li").index();
            for (var i=0;i<newCIV.length ;i++ )
            {

                if (newCIV[i] == $(this).val() )//判断是否重复
                {
                    if (i != _index)
                    {
                        mess_tusi("分类名称不能重复");
                        _This.val('');
                    }
                }else   if(_index>newCIV.length-1){
                    newCIV.push($(this).val())
                }else {
                    newCIV[_index] = $(this).val();
                }
            }

            return false;
        })


        //删除分类
        $('.operate_box').on('click','.delete_sort',function(){
            var _lidom = $(this).closest('li');
            console.log(_lidom[0].dataset.id,"??????????")
            newCIV.splice(_lidom.index(),1);
            categoryItemValue.splice(_lidom.index(),1);
            if(_lidom.data("id")){
                // var params = {id:_lidom.data("id"),ajax:1};
                /*var callback = function(msg){
                    if(msg.result == 0){
                        _lidom.remove();
                    }else{
                        mess_tusi(msg.description);
                    }
                }*/
                console.log(_lidom.data("id"),1111111111111111);
                let id = _lidom.data("id");
                $.ajax({
                    url: apiUrl + 'articles/cates',
                    type:'delete',
                    data:{weid:id},
                    headers: {
                            'Token': docCookies.getItem("token")
                        },
                    dataType: 'json',
                    success: function(data){
                        console.log(data);
                        if (data.code == 200) {
                            // $('#myModal').modal('hide');
                            // location.reload();
                            mess_tusi("分类删除成功");
                            _lidom.remove();

                        }else {
                            // $(".use-right-box").before(alerthtml);
                             mess_tusi(data.message+"不能删除");
                        }
                    }
                })
                // requestAjax(params, 'post', '/index.php?ctl=mywemall&act=del_category', callback, true);
            }else{
                // _lidom.remove();
            }
        })
        //保存分类
        $(document).on("click",".save-btn",function(){
            var categories = new Array();
            var noneVal = {};
            var addcate=updatecate=[];
            $(".category-item").each(function(){
                var item = {};
                item.id = $(this).data("id");
                item.name = $(this).find(".category-name").val();
                item.ename = $(this).find(".category-ename").val();
                item.floor = $(this).find(".category-floor").val();

                if(!item.name){
                    noneVal.nD = item.id;
                    return;
                }
                if(!item.floor){
                    item.floor = 0;
                }
                categories.push(item);
            })
            console.log(newCIV);
            console.log(categoryItemValue);
            console.log(categories);
            if(categories.length == 0){
                return;
            }
            var params = {categories:categories,ajax:1};



            if (categoryItemValue.length == newCIV.length){
                var cn_arr = []
                for(var s in categoryItemValue){
                    for(var x in newCIV){
                        if(categoryItemValue[s] == newCIV[x]){
                            cn_arr.push(categoryItemValue[s]);
                        }
                    }
                }
                if (cn_arr.length != categoryItemValue.length)
                {

                    subB = false;
                }else{
                    subB = true;
                }

            }else{
                subB = false;
            }
            console.log(subB+":sub");
            if (noneVal.nD=='')
            {
                mess_tusi("商品名称不能为空")

            }
            // else if (subB)
            // {
            //     mess_tusi("没有修改分类")
            // }
            else{
                var callback = function(msg){
                    if(msg.result == 0){
                           mess_tusi("保存成功",function(){
                                window.location.reload();
                            });
                    }else{
                        mess_tusi(msg.description,function(){
                            if(msg.data){
                                window.location.href = msg.data;
                            }
                        });
                    }
                }
                console.log(categories);
                categories.map(x => {

                    addeditsave(x,categories.length);

                })
                //window.location.reload();
                // location.reload();
                //requestAjax(params, 'post', '/index.php?ctl=mywemall&act=do_categories', callback, true);
            }
        });


    }
    // 添加/编辑分类
    var flag=1;
    var addeditsave=function(data,len){
        // $('.save').bind('click', function() {
            // var catename = $("input[name=catename]").val();
            // console.log($("#myModal_input").val(),catename);
            // if($("#myModal_input").val()!=0 && $("#myModal_input").val()!=null){
            if(data.id!=0){

                console.log("编辑");
                var sendData={
                    name:data.name,
                    ename:data.ename,
                    sort:data.floor,
                    weid:data.id
                }
                 $.ajax({
                    url:apiUrl + 'articles/cates',
                    type:'put',
                    data:sendData,
                    headers: {
                            'Token': docCookies.getItem("token")
                        },
                    dataType: 'json',
                    success: function(data){
                        // console.log(data);
                        if (data.code == 200) {
                            flag++;
                            // mess_tusi("修改成功");
                            // $('#myModal').modal('hide');
                            // location.reload();
                            if(flag==len){
                                mess_tusi("操作成功");
                                location.reload();
                            }
                        }else {
                            mess_tusi(data.message);
                        }
                    }
                })
            }else{
                console.log("添加");
                var sendData={
                    name:data.name,
                    ename:data.ename,
                    sort:data.floor
                }
                $.ajax({
                    url: apiUrl + 'articles/cates',
                    type:'post',
                    data:sendData,
                    headers: {
                            'Token': docCookies.getItem("token")
                        },
                    dataType: 'json',
                    success: function(data){
                        if (data.code == 200) {
                            flag++;
                            // mess_tusi("添加成功");
                            // $('#myModal').modal('hide');
                            if(flag==len){
                                mess_tusi("添加成功");
                                location.reload();
                            }
                        }else {
                            mess_tusi(data.message);
                        }
                    }
                })
            }
                            //location.reload();

        // });
    }
// addeditsave();
   /* // 编辑分类
    var cateedit=function(){
        $('.edit').bind('click', function() {
            $(".modal-title").text("编辑分类");
            var weid = $(this).parent().parent().attr("id");
            $("#myModal_input").val(weid);



            $.ajax({
                url: 'http://apitest.wezchina.com/goods/cates/detail/'+weid,
                type:'get',
                headers: {
                        'Token': docCookies.getItem("token")
                    },
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    if (data.code == 200) {
                        // $('#myModal').modal('hide');
                        // location.reload();
                        $("input[name='catename']").val(data.data.name);


                    }else {
                        mess_tusi(data.message);
                    }
                }
            })

        });
    }*/
    // 删除分类
    var delcate=function(weid){
        var alerthtml='<div class="alert alert-danger alert-dismissible fade in" role="alert">'+
                    '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'+
                    '<div style="color:red;">'+
                        '<div>该分类下已有商品，无法删除</div>'+
                    '</div>'+
                '</div>';
        // $('.del').bind('click', function() {
            // var weid = $(this).parent().parent().attr("id");
          /*  console.log(weid);
            $.ajax({
                url: 'http://apitest.wezchina.com/goods/cates/destroy/'+weid,
                type:'get',
                headers: {
                        'Token': docCookies.getItem("token")
                    },
                dataType: 'json',
                success: function(data){
                    console.log(data);
                    if (data.code == 200) {
                        // $('#myModal').modal('hide');
                        // location.reload();
                        mess_tusi("分类删除成功");


                    }else {
                        $(".use-right-box").before(alerthtml);
                    }
                }
            })*/

        // });
    }

    //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e){
        var id = $(this).attr("id");
        if (id != 'login') {
            $(this).find(".word").show();
            $(this).css({
                "line-height": "65px",
                "padding-top": "10px"
            });
            $("#" + id + " .word").css("margin-top", "-35px");
        } else {
            if (!isLogin) {
                $(this).css({
                    "line-height": "65px",
                });
                // $("#" + id + " .word").css("margin-top", "-20px");
            }
        }
    }, function(){
        var id = $(this).attr("id");
        $(this).find(".word").hide();
        $(this).css("line-height", "65px");
        $("#" + id + " .word").css("margin-top", "-55px");
    })

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
                    })
                } else {
                    layer.msg(data.message, {
                        time: 1500
                    });
                }

                //列表折叠
                var curr = 'we-shop';
                var status = true;
				var list = ['we-set', 'we-art', 'we-shop','we-active','we-project', 'we-app', 'we-log'];

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
  /* //主页初始化
    var init__ = function(token){
        moduleState();
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

})
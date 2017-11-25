/*

    // 3.删除
    var activitydel=function(obj){
        console.log($(obj).closest('li').data('id'));
         $.ajax({
            url:ACTIVITY_DESTROY+'/'+$(obj).closest('li').data('id'),
            type:'get',
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                console.log(data);
                if(data.code == 200){
                    mess_tusi("删除成功");
                    location.reload();

                }else{
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }
    // 4.编辑
    var activityedit=function(obj){
        window.location="/user/admin/activity/detail/"+$(obj).closest("li").data("id");
    }
    // 5.取消发布
    var activitycancel=function(obj){
        console.log($(obj));
        var actiid=$(obj).closest("li").data("id");
        $.ajax({
            url:ACTIVITY_UPDATE,
            type:'post',
            data:{weid:actiid,status:1},
            headers: {
                    'Token': localStorage.getItem('token')
                },
            success:function(data){
                console.log(data);
                if(data.code == 200){
                    mess_tusi("取消发布成功");
                    location.reload();

                }else{
                    mess_tusi(data.message);
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }*/



$(document).ready(function() {
    // const ApiMaterPlatQiniuDomain       = 'http://images.new.wezchina.com/';

    var favicon = ApiMaterPlatQiniuDomain + localStorage.getItem('fav');
    console.log('logo:', favicon);
    $('#favicon').attr('href', favicon);

    var logo = ApiMaterPlatQiniuDomain + localStorage.getItem('logo');
    console.log('logo:', logo);
    $('#home img').attr('src', logo);

    var tusitemp = "";

    function mess_tusi(strs) {
        //清除事件
        clearTimeout(tusitemp);
        $("#mess_tusi").remove();
        //创建吐丝层并写入内容
        if (!$("#mess_tusi").attr("id")) { //吐丝层不存在创建
            $("body").append("<div id='mess_tusi' style='z-index: 100002;position:fixed;font-size:16px;border-radius:4px !important;background:rgba(0,0,0,.7);color:#fff;display:none;'><span style='display:block;padding:5px 15px;'>" + strs + "</span></div>"); //写入内容
        } else {
            $("#mess_tusi").html(strs); //写入内容
        }

        //定义吐丝层位置
        var left = ($(window).width() - $("#mess_tusi").width()) / 2 - 180; //居中
        var top = $(window).height() * 0.5;
        $("#mess_tusi").css({ "left": left + "px", "top": top + "px" });

        //显示吐丝层
        $("#mess_tusi").css("display", '');

        //2秒后关闭
        tusitemp = setTimeout(function() {
            $("#mess_tusi").remove();
            $("#mess_tusi").html("");
        }, 2000);
        return false;
    }

    /*var currHeight = $("#art-head").height() + $("#art-body").height();
    setHeight(currHeight);*/
    // var token="eyJpdiI6IlN0Y0o4T3lRVjRSMTJrU1pSVG16NVE9PSIsInZhbHVlIjoiNlpRXC9qMlV0cUtObkorcnQxcDczVTM3VXVPaXdHVGNqWTJmM0h5dktkcTVKbWYrU09jXC91eTY4eFRjRTFPdUNIUlc4eVZ4T0tvc3dZWTlqV0p1U2drejhBN0JNamltTWZhenVvaWp1SmFIWT0iLCJtYWMiOiJiNzFmNzBjNmE2ZjE2NWU1OGJmOThiYWU1MDNjNWU2MmY4MGFjZTZkOGY2NzRiYjg0NjM2NGQxNDNkMDU4NTBlIn0=";

    var saveUserInfo = function(token) {
            localStorage.setItem('token', token);
        }
        // saveUserInfo(token);

    /*//route
    var isLogin = false; //判断用户登陆与否
    var router = function(route){
        var routerList = ['home', 'login', 'article','shopping','active'];

        var isMember = function(routerList, route){
            return routerList.filter(x => x === route);
        }

        var home = function(){
            window.location.href = '/';
        }

        var top = $(window).scrollTop();

        var login = function(){
            if (!isLogin) {
                showLogin = true;
                $("#modal").show();
                $(".show-login").css({
                    "margin-left": width,
                    "margin-top": top + height
                });
                $(".show-login").fadeIn(300);
                $("body").css("overflow", "hidden");
            } else {
                window.location.href = "/user";
            }
        }

        var article = function(){
            showLogin = false;
            window.location.href = "/article";
        }
         var active = function(){
            showLogin = false;
            window.location.href =  domain +"/activity";
        }
        var shopping = function(){
            showLogin = false;
            window.location.href = domain + "/wemall";
        }
      
        if (isMember(routerList, route) != ""){
            eval(route)();
        }
    }

    $("#home, #login, #article,#shopping,#active").click(function(){
        var id = $(this).attr("id");
        router(id);
    })*/

    var domain;
    var hasDomain = function(weid) {
        $.ajax({
            url: PAGES_PAGE_GETDETAILBYUSER + weid,
            type: 'GET',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data) {
                if (data.code == 401) {
                    // domain = '/index';
                    localStorage.removeItem('token')
                        // window.location.href = '/login'
                }
                if (data.code == 200) {
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
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    var weid = localStorage.getItem('weid');
    hasDomain(weid);


    // 列表模板
    var num = 0;
    var listtemplate = function(data) {
        console.log(num);
        num++;
        var listhtml = '<tr data-id="' + data.weid + '">' +
            '<td class="chk"><input type="checkbox" class="boxsty J_CkbItem" data-id="' + data.weid + '"></td>' +
            '<td class="queue">' + num + '</td>' +
            `<td class="user">
            <div class="user-avatar"><img src="` + ApiMaterPlatQiniuDomain + data.avatar + `" width="30"></div>` +
            `<div class="user-desc">
                <div class="username">` + data.name + `</div>` +
            `<div class="company"><span>` + data.company + `</span><span>` + data.poistion + `</span></div>
            </div>` +
            '</td>' +
            '<td class="mobile">' + data.telphone + '</td>' +
            '<td class="ticket">' +

            ' <img data-toggle="modal" data-target="#myModal" src="/common/img/ticket-apply.png">' +

            '</td>' +

            '<td class="operate">' +


            ' <span style="color:#34b0df;">已通过</span>' +


            '</td>' +

            '</tr>';
        return listhtml;
    }
    var weid = localStorage.getItem('weid');

    // 1.获取活动报名列表
    var applylistdetail = function(weid, type = 0, page = 1, keywords = "") {

        var limit = 5;
        var name = "";
        var telphone = "";
        if (keywords != '') {
            if (keywords.filter == "mobile") {
                telphone = keywords.kewords;

            } else if (keywords.filter == "name") {
                name = keywords.kewords;
            }
        }

        console.log(keywords);
        var sendData = {
            activity_id: weid,
            limit: limit,
            page: page,
            name: name,
            telphone: telphone
        }
        console.log(sendData);
        $.ajax({
            url: ACTIVITY_ENROLL_LISTS + '?status=1',
            type: 'post',
            data: sendData,
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    $(".J_EntryList").children().remove();
                    data.data.list.map(x => {
                        $(".J_EntryList").append(listtemplate(x));

                    })

                    // 页码start
                    var pagenum = Math.ceil(data.data.total / limit);
                    pagefun(pagenum, weid, type, keywords);


                    $('.J_CkbItem').bind('change', function() {
                        var chk = this.checked;
                        console.log(chk);
                        if (chk) {
                            $('.operation .del').css('color', '#E85349');
                            $('.operation .del').css('border', '2px solid #E85349');
                        } else {
                            $('.operation .del').css('color', '#b4bbc2');
                            $('.operation .del').css('border', '2px solid #b4bbc2');
                        }
                        $('.J_CkbAll').get(0).checked = chk;
                    });

                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }
    var id = window.location.href.split('/').pop();
    console.log(id);
    if (id != null && id != '' && id.length == 36) { applylistdetail(id); }
    // applylistdetail(weid);



    // 页码
    var pagefun = function(pagenum, weid, type = 0, keywords) {
        // console.log(pagenum+":pagenum");
        var pagestr = "";
        console.log(flagpage);
        if (flagpage) {
            $('.pagination').children().remove();
            $('.pagination').append('<li id="prev"><a href="javascript:void(0);">«</a></li><li class="active"><span>1</span></li>');

            for (i = 1; i < pagenum; i++) {
                // $('.pagination').append(pagelisthtml(i));
                pagestr += '<li><a href="javascript:void(0)" id="' + (i + 1) + '">' + (i + 1) + '</a></li>';

            }
            $('.pagination').append(pagestr);
            $(".pagination").append('<li id="next"><a href="javascript:void(0)" class="next" rel="next">&raquo;</a></li>');
            // 点击页码事件
            $(".pagination li").bind("click", function() {
                flagpage = false;
                // console.log($(this).attr("id"));
                if ($(this).attr('class') != "active") {
                    var prevactive = parseInt($(this).parent().find('.active span').text());
                    var curr = $(this).find('a').text();
                    if ($(this).attr("id") == "prev") {
                        if (prevactive > 1) {
                            $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                            $(this).parent().find('.active').prev().append('<span>' + (prevactive - 1) + '</span>').find('a').remove();
                            $(this).parent().find('.active').prev().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive-1);
                            applylistdetail(weid, type, prevactive - 1, keywords);
                        }
                    } else if ($(this).attr("id") == "next") {
                        if (prevactive < pagenum) {
                            $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                            $(this).parent().find('.active').next().append('<span>' + (prevactive + 1) + '</span>').find('a').remove();
                            $(this).parent().find('.active').next().addClass("active").siblings().removeClass('active');
                            // orderlist(mall_id,prevactive+1);
                            applylistdetail(weid, type, prevactive + 1, keywords);

                        }

                    } else {

                        applylistdetail(weid, type, $(this).find("a").text(), keywords);

                        $(this).parent().find('.active').append('<a href="javascript:void(0)" id="' + prevactive + '">' + prevactive + '</a>').find("span").remove();
                        $(this).addClass("active").siblings().removeClass('active');
                        $(this).append('<span>' + curr + '</span>').find('a').remove();
                    }

                }


            })
        }
    }


    // 2.姓名和手机查询
    $('#J_SearchType').on('mouseover', function() {
        $(this).addClass('hover');
    });
    $('#J_SearchType').on('mouseleave', function() {
        $(this).removeClass('hover');
    });
    //搜索类型对象
    var typeObj = {
        name: '姓名',
        mobile: '手机'
    };
    //搜索条件对象
    var searchObj = {
        page: 1,
        filter: 'name'
    };
    $('.J_SearchOtherType').click(function() {
        var other = $('.J_SearchSelectedType').data('type');
        var selected = $(this).data('type');
        //交换选中和未选中的值
        $('.J_SearchSelectedType').data('type', selected);
        $('.J_SearchSelectedType>span').text(typeObj[selected]);
        $(this).data('type', other);
        $(this).text(typeObj[other]);

        if (selected == 'mobile') {
            $('#J_InputSearchCondition').attr('placeholder', '请输入手机号后4位');
            $('#J_InputSearchCondition').val('');
        } else {
            $('#J_InputSearchCondition').attr('placeholder', '请输入用户姓名');
            $('#J_InputSearchCondition').val('');
        }
        //修改筛选条件
        searchObj.filter = selected;
        //隐藏
        $('#J_SearchType').removeClass('hover');


    });
    $("#J_BtnSearchEntry").click(function() {
        // 根据selected不用类型查询
        num = 0;
        var keywords = $("#J_InputSearchCondition").val();
        searchObj.kewords = keywords;
        applylistdetail(id, 0, 1, searchObj);
    })

    $('.J_CkbAll').change(function() {
        var chk = this.checked;
        $('.J_CkbItem').each(function() {
            if ($(this).attr('disabled') == undefined) {
                this.checked = chk;
                if (chk) {
                    $('.operation .del').css('color', '#E85349');
                    $('.operation .del').css('border', '2px solid #E85349');
                } else {
                    $('.operation .del').css('color', '#b4bbc2');
                    $('.operation .del').css('border', '2px solid #b4bbc2');
                }
            }
        })
    });
    //批量删除
    var flagapply = 0;
    $('.J_BtnDelAllRecord').click(function() {

        var activeid = $('#aid').val();
        var ids = [],
            type = parseInt($(this).data('type'), 10);
        $('.J_CkbItem').each(function() {
            if (this.checked) {
                ids[ids.length] = $(this).data('id');
                console.log($(this).data('id'));
            }


        });
        if (ids.length > 0) {
            console.log(ids);
            ids.map(x => {
                flagapply++;
                console.log(x);
                $.ajax({
                    type: 'get',
                    url: ACTIVITY_ENROLL_DESTROY + "/" + x,
                    headers: {
                        'Token': localStorage.getItem('token')
                    },
                    success: function(data) {
                        console.log(data);
                        if (data.code == 200) {
                            if (flagapply >= ids.length) {
                                mess_tusi('删除成功');
                                location.reload();
                            }
                        } else {
                            mess_tusi('删除失败');
                        }
                    }
                })
            })

        } else {
            mess_tusi('请至少勾选一个');
        }
    });



    // 1.1数据统计
    var numfan = function(weid) {
        $.ajax({
            url: ACTIVITY_USERINFO + '/' + weid,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {

                    $(".all_total").text(data.data.count);
                    $(".no_total").text(data.data.nocount);
                    $(".ing_total").text(data.data.oncount);
                    $(".end_total").text(data.data.offcount);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }
    numfan(weid);
    // 5.未发布/进行中/已结束
    $("#J_Filter li").bind("click", function() {
        $(this).addClass("selected").siblings().removeClass("selected");
        var type = $(this).data("id");
        activitylist(weid, type);
    })



    //2.用户商品列表
    var flagpage = true;




    // 全选
    $('#choose_all').click(function() {
        if (this.checked) {
            $('.pro_list :checkbox').attr("checked", true)
        } else {
            $('.pro_list :checkbox').attr("checked", false)
        }
    });
    //已下架/出售中/已售完商品
    $(".nav-filter li").click(function() {
        // flagstatus=true;
        flagpage = true;
        $(this).addClass("current").siblings().removeClass("current");
        console.log($(this).data("id"));
        if ($(this).data("id") == 3) {
            console.log("scock:");
            if ($(".filter-category").val() != 0) {
                usershoplist({ cateid: $(".filter-category").val(), statusid: $(this).data("id") }, 4, 1);

            } else {
                usershoplist($(this).data("id"), 3, 1);

            }

        } else {
            if ($(".filter-category").val() != 0) {
                usershoplist({ cateid: $(".filter-category").val(), statusid: $(this).data("id") }, 4, 1);

            } else {
                usershoplist($(this).data("id"), 2, 1);


            }

        }

    })
    var offon = function(_that, statusid) {
            if (statusid == 2) {
                _that.text("上架")
                    // _that.attr("data-id",statusid-1);
                _that.data("id", statusid - 1);

            } else if (statusid == 1) {
                _that.text("下架");
                // _that.attr("data-id",statusid+1);
                _that.data("id", statusid + 1);

            }
        }
        //4.商品分类
    var cateType = [];
    var catesfun = function(weid, id) {
            $.ajax({
                // url: "http://apitest.wezchina.com/goods/cates/list",
                url: GOODS_CATES_LIST_USERID + "/" + weid,
                type: 'get',
                headers: {
                    'Token': localStorage.getItem('token')
                },
                success: function(data) {
                    console.log(data);
                    if (data.code == 200) {
                        var cate = data.data;
                        // $(".filter-category").children().remove();

                        cate.map(x => {
                            if (x.weid == id) {
                                var selected = "selected";
                            } else {
                                var selected = "";
                            }
                            $(".filter-category").append(
                                '<option ' + selected + ' value=' + x.weid + '>' + x.name + '</option>'
                            )
                            cateType.push({ id: x.weid, name: x.name });
                        })
                        if (id.length == 36) {
                            usershoplist(id, type = 1);
                        }
                        $(".filter-category").bind("change", function() {
                            flagpage = true;
                            console.log($(".nav-filter .current").data("id"));
                            // 通过分类查找商品列表
                            if ($(".nav-filter .current").data("id") > 0) {
                                usershoplist({ cateid: $(this).val(), statusid: $(".nav-filter .current").data("id") }, type = 4);

                            } else {
                                usershoplist($(this).val(), type = 1);

                            }
                        })

                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        }
        // catesfun(weid);
        // 5.商品下架请求
    var flagstatus = 0;
    var _that = "";
    var offlinefun = function(id, statusid, checklen = 1) {
            console.log(statusid);

            var sendData = {
                weid: id,
                status: statusid
            }
            $.ajax({
                url: GOODS_UPDATE,
                type: 'post',
                data: sendData,
                headers: {
                    'Token': localStorage.getItem('token')
                },
                success: function(data) {
                    console.log(data);
                    if (data.code == 200) {
                        var shopdata = data.data;
                        //下架成功后
                        flagstatus++;
                        console.log(checklen + ":checklen");
                        console.log(flagstatus + ":flagstatus");
                        if (checklen > 1) {
                            if (flagstatus == checklen) {
                                location.reload();


                            }
                        } else {
                            mess_tusi("修改成功");
                            offon(_that, statusid);
                        }


                    }
                },
                error: function(xhr) {
                    console.log(xhr);
                }
            })
        }
        // 6.删除商品
    var delshop = function(id) {
        console.log(id);
        $.ajax({
            url: GOODS_DESTROY + '/' + id,
            type: 'get',
            headers: {
                'Token': localStorage.getItem('token')
            },
            success: function(data) {
                console.log(data);
                if (data.code == 200) {
                    var shopdata = data.data;
                    location.reload();
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    // 3.商品列表模板
    var coverId = 0;
    var coverPicId = '';
    var coverPicpath = '/common/img/products_load.jpg';
    var shopListTemplete = function(data) {
        coverPicId = "cover-pic-" + coverId;
        if (data.cover != '') {
            coverPicpath = ApiMaterPlatQiniuDomain + data.cover;
        }
        /*if(data.sort==null){
            var sortnum=0;
        }else{
            var sortnum=data.sort;
        }*/
        if (data.status == 1) {
            var linetext = "下架";
            var lineclass = "offline";
            var lineid = 2;
        } else if (data.status == 2) {
            var linetext = "上架";
            var lineclass = "online";
            var lineid = 1;
        }
        if (data.stock == null || data.stock == "") {
            data.stock = 0;
        }
        var templete = '<li class="clearfloat" data-id="' + data.weid + '">' +
            '<input type="checkbox" name="pro_list" class="product_checkbox">' +
            '<div class="pro_info">' +
            '<img src="' + coverPicpath + '">' +
            '<div>' +
            '<span>' + data.title + '</span>' +
            '</div>' +
            '</div>' +
            '<span class="pro_price">' + data.price + '</span>' +
            '<span class="sell_num">' + data.sales_num + '</span>' +
            '<span class="pro_inventory">' + data.stock + '</span>' +
            '<span class="pro_sort_info">' + data.catename + '</span>' +
            '<span class="pro_order_info">' + data.sort + '</span>' +
            '<div class="pro_operate_box">' +
            '<span>' +
            '<a class="cmd-btn shopedit" href="javascript:;" >编辑</a>' +
            '<a class="cmd-btn offline" data-id=' + lineid + ' data-mutil="0" href="javascript:;" data-key="offline">' + linetext + '</a>' +
            '<a class="cmd-btn del" data-id="' + data.weid + '" data-mutil="0" href="javascript:;" data-key="del">删除</a>' +
            '</span>' +
            '</div>' +
            '</li>'
        return templete;
    }






    //商品浏览数暂未写
    var readAmount = function(id) {
        //console.log(id);
        $.ajax({
            url: ARTICLES_VIEW,
            type: 'post',
            data: { "articleId": id },
            success: function(data) {
                //console.log(data);
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }




    //获取通用用户信息
    var getUserInfo = function() {
        $.ajax({
            url: FOUNDER,
            type: 'get',
            success: function(data) {
                //console.log(data);
                if (data.code == 200) {
                    var info = data.data;
                    var weid = info.weid;
                    if (info.avatar != "") {
                        $("#head-icon, .user-head").css({
                            "background": "url(" + info.avatar + ") no-repeat center",
                            "background-size": "100%"
                        });
                    } else {
                        $("#head-icon, .user-head").css({
                            "background": "url(/common/img/avatar.png) no-repeat center",
                            "background-size": "110%"
                        });
                    }

                    $(".line-0").html(
                        info.nickname + '<img src="http://next.wezchina.com/images/vrenzheng.png" alt="">'
                    );
                    $(".line-1").text(info.motto);
                    $(".user-cnt").text(info.nickname);
                    // artCount(weid);
                    // artTypeList(weid);

                    // catesfun(weid);


                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }

    //getUserInfo();

    var artCount = function(weid) {
        $.ajax({
            url: ARTICLES_LISTCOUNT + "?userId=" + weid,
            type: 'get',
            success: function(data) {
                //console.log(data);
                if (data.code == 200) {
                    $(".user-art").children('div:eq(0)').text(data.data);
                }
            },
            error: function(xhr) {
                console.log(xhr);
            }
        })
    }



    // 鼠标滑动到列表时加hover
    var lihover = function() {
            $(".ws_item li").mouseenter(function() {
                $(this).addClass("hover")
            }).mouseleave(function() {
                $(this).removeClass("hover")
            })
        }
        // 没有商品时显示
    var ulnone = function(obj) {
        obj.each(function() {
            var liLen = $(this).children("li").length;
            var licum = Math.ceil(liLen / 3);
            $(this).attr('licum', licum)
            if (licum > 1) {
                $(this).siblings(".ws_item_more").css("visibility", 'visible');
            } else if (licum == 0) {
                $(this).css("height", "50px").append('<li class="clearfloat" style="text-align: center;line-height: 136px;">暂时没有符合条件的商品</li>');
            }
        })
    }

    //left-navbar show words
    $("#login, #article, #project, #active, #shopping, #zone").hover(function(e) {
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
        }, function() {
            var id = $(this).attr("id");
            $(this).find(".word").hide();
            $(this).css("line-height", "65px");
            $("#" + id + " .word").css("margin-top", "-55px");
        })
        /*
            var modeleName = [];
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
                        var curr = 'we-active';
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
    /*var init__ = function(token){
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
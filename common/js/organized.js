/*
*     组织部分数据覆盖
*/

// $(function() {

    var token = window.localStorage.getItem('token');
    var channels = window.location.pathname.split('/').slice(1,3);
    $.ajaxSetup({
        global: true,
        async:  false,
        headers: {
            'Token': token,
        }
    });

    // 查询频道
    $.ajax({
        url: apiUrl + "cms/channels/domain_query/org",
        dataType: 'json',
        success: function(data){
            if(data.code == 200) {
                var result = data.data;
                if(!result.thumb_image) {
                    $(".zuzhi-top").css({ "background-image": "url('http://images.new.wezchina.com/plat/cert/1505289973450.png')","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });

                } else if (result.thumb_image.indexOf('http') != 0 && result.thumb_image != "") {

                    result.thumb_image = imgSet(result.thumb_image, 960, 481, 3);
                    $(".zuzhi-top").css({ "background-image": "url(" + result.thumb_image + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });

                } else if(result.thumb_image.indexOf('http') == 0 && result.thumb_image != "") {

                    $(".zuzhi-top").css({ "background-image": "url(" + result.thumb_image + ")","background-size": "100% 100%","background-repeat": "no-repeat","background-position": "center" });
                }

                if(!result.back_image) {
                    $("#org_bottom_big_img").css({ "background-image": "url('http://images.new.wezchina.com/plat/cert/1505289973450.png')" });

                } else if (result.back_image.indexOf('http') != 0 && result.back_image != "") {

                    result.back_image = imgSet(result.back_image, 960, 380, 3);
                    $("#org_bottom_big_img").css({ "background-image": "url(" + result.back_image + ")" });

                } else if(result.back_image.indexOf('http') == 0 && result.back_image != "") {

                    $("#org_bottom_big_img").css({ "background-image": "url(" + result.back_image + ")" });
                }
            }
        },
        error: function(xhr){
            console.log(xhr);
        }
    });

    // 入会申请
    function column_rhsq(data, thumb_imgs) {
        $.ajax({
            url: apiUrl + "/cms/contents?cate_id=" + data,
            dataType: 'json',
            success: function(data){
                if((!data.data.list || data.data.list.length == 0) && thumb_imgs) {
                    thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
                    $(".dier #ruhuishenqing").css({"background-image": "url("+ thumb_imgs +")"});
                }

                $.map(data.data.list, function(item, index) {
                    if(index <= 5) {
                        var thumb_image = item.thumb_image;
                        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                            thumb_image = imgSet(thumb_image, 34, 34, 3);
                        }
                        var template = `
                        <li>
                            <a href="/org/`+ item.weid +`">`
                                if(thumb_image != "") {
                                    template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
                                }
                                template = template + `
                                <p>`+ item.title.substr(0, 6) +`</p>
                            </a>
                        </li>`
                        $("#ruhuishenqing").append(template);
                    }
                });
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }

    // 发展报告
    function report(bg_weid, thumb_imgs) {
        $.ajax({
            url: apiUrl + "/cms/contents?cate_id=" + bg_weid,
            dataType: 'json',
            success: function(data){
                if((!data.data.list || data.data.list.length == 0) && thumb_imgs) {
                    thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
                    $(".diyi .report").css({"background-image": "url("+ thumb_imgs +")"});
                }

                $.map(data.data.list, function(item) {
                    var thumb_image = item.thumb_image;
                    if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                        thumb_image = imgSet(thumb_image, 280, 164, 3);
                    }
                    var template = `
                    <div class="swiper-slide">`
                        if(thumb_image != "") {
                            template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
                        }
                        template = template + `
                        <a href="/org/`+ item.weid +`" class="a btn-look">点击查看</a>
                    </div>`;
                    $(".report_swiper").append(template);
                })

                const mySwiper10 = new Swiper (".swiper-report", {
                    pagination: '.pagination-report',
                    direction: 'vertical',
                    autoplay: 3000,
                    speed: 1000,
                    loop : true,
                    paginationClickable: true,
                    autoplayDisableOnInteraction : false
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    // 商会介绍
    function lunbo(gc_weid, thumb_imgs) {
        $.ajax({
            url: apiUrl + "/cms/contents?cate_id=" + gc_weid,
            dataType: 'json',
            success: function(data){
                if((!data.data.list || data.data.list.length == 0) && thumb_imgs) {
                    thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
                    $(".disan .lunbo").css({"background-image": "url("+ thumb_imgs +")"});
                }

                $.map(data.data.list, function(item) {
                    var thumb_image = item.thumb_image;
                    if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
                        thumb_image = imgSet(thumb_image, 280, 164, 3);
                    }
                    var template = `
                    <div class="swiper-slide">`
                        if(thumb_image != "") {
                            template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
                        }
                        template = template + `
                        <a href="/org/`+ item.weid +`" class="a btn-info">点击查看</a>
                    </div>`;
                    $(".lunbo_swiper").append(template);
                })

                const mySwiper9 = new Swiper (".swiper-nested", {
                    pagination: '.pagination-nested',
                    direction: 'horizontal',
                    autoplay: 3000,
                    speed: 1000,
                    loop : true,
                    paginationClickable: true,
                    autoplayDisableOnInteraction : false
                })
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    // 一级分类
    var column_list = function(data) {
        var thumb_image = data.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 45, 40, 3);
        }

        var template2 = function(children) {
            var template21 = '';
            $.map(children, function(value, key) {
                template21 += `<a href="/org/`+ value.domain +`"> <i class="iconfont">&#xe61a;</i>`+ value.title +` </a>`
            });
            return template21;
        }

        var template = `
        <div class="list diyidier" name="`+ data.domain +`">
            <a href="/org/`+ data.domain +`">
                <p>`+ data.title +`</p>`;
                if(thumb_image != "") {
                    template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
                }

                template = template + `
                
            </a>
            <div class="sub" id="`+ data.domain +`">`+ template2(data.children) +`</div>
        </div>`
        return template;
    };

    // 查询组织栏目分类
    $.ajax({
        url: apiUrl + "cms/cate_tree_by_channel?channel=9fa0bea0-7d7f-11e7-92a8-6585efb9cefe",
        dataType: 'json',
        success: function(data){
            console.log(data.data);
            data.data.forEach(function(item, index) {
                if(item.title == '入会申请') {
                    $(".dier").append(`
                        <p class="title">`+ item.title +`</p>
                        <ul id="ruhuishenqing" name="`+ item.weid +`"></ul>`
                    );
                    column_rhsq(item.weid, item.thumb_image);
                } else if(item.title == "发展报告") {
                    $(".diyi .title").text(item.title);
                    report(item.weid, item.thumb_image);
                } else if(item.title == "长青事业") {
                    $(".disan .title").text(item.title);
                    lunbo(item.weid, item.thumb_image);
                } else {
                    if(item.index_show == 1) {
                        var i = 0;
                        if(i <= 8) {
                            $(".shanghuijieshao").append(column_list(item));
                            i++;
                        }
                    }
                }
            });

            // 移入加载栏目分类
            $(".list").hover(function() {
                // $(this).find(".sub").addClass("list_selected").fadeIn(100);
                $(this).find(".sub").addClass("list_selected").show();
            },function() {
                // $(this).find(".sub").removeClass("list_selected").fadeOut(500);
                $(this).find(".sub").removeClass("list_selected").hide();
            });

        },
        error: function(xhr){
            console.log(xhr);
        }
    });

// });
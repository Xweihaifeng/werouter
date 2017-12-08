/*
*     组织部分数据覆盖
*/

    var token = window.localStorage.getItem('token');
    var channels = window.location.pathname.split('/').slice(1,3);
    var domain_weid = '';

    $.ajax({
        url: CMS_CHANNELS_DOMAIN_QUERY + 'org',
        dataType: 'json',
        async: false,
        success: function(data){
            if(data.code === 200) {
                console.log(data.data);
                domain_weid = data.data.weid;
            } else {
                console.error(data.message);
            }
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
        if((!data || data.length == 0) && thumb_imgs) {
            thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
            $(".dier #ruhuishenqing").css({"background-image": "url("+ thumb_imgs +")"});
        }

        var thumb_image = data.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 34, 34, 3);
        }
        var template = `
        <li>
            <a href="/org/`+ data.domain +`">`
                if(thumb_image != "") {
                    template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
                }
                template = template + `
                <p>`+ data.title.substr(0, 6) +`</p>
            </a>
        </li>`
        $("#ruhuishenqing").append(template);
    }

    // 发展报告
    function report(data, thumb_imgs) {

        if((!data || data.length == 0) && thumb_imgs) {
            thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
            $(".diyi .report").css({"background-image": "url("+ thumb_imgs +")"});
        }

        var thumb_image = data.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 280, 164, 3);
        }
        var template = `
        <div class="swiper-slide">`
            if(thumb_image != "") {
                template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
            }
            template = template + `
            <a href="/org/`+ data.domain +`" class="a btn-look">点击查看</a>
        </div>`;
        $(".report_swiper").append(template);
        

        const mySwiper10 = new Swiper (".swiper-report", {
            pagination: '.pagination-report',
            direction: 'vertical',
            autoplay: 3000,
            speed: 1000,
            loop : true,
            paginationClickable: true,
            autoplayDisableOnInteraction : false
        })

    }

    // 商会介绍
    function lunbo(data, thumb_imgs) {

        if((!data || data.length == 0) && thumb_imgs) {
            thumb_imgs = imgSet(thumb_imgs, 45, 40, 3);
            $(".disan .lunbo").css({"background-image": "url("+ thumb_imgs +")"});
        }

        var thumb_image = data.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 280, 164, 3);
        }
        var template = `
        <div class="swiper-slide">`
            if(thumb_image != "") {
                template = template + `<img class="iconfont" src="`+ thumb_image +`" alt="">`;
            }
            template = template + `
            <a href="/org/`+ data.domain +`" class="a btn-info">点击查看</a>
        </div>`;
        $(".lunbo_swiper").append(template);

        const mySwiper9 = new Swiper (".swiper-nested", {
            pagination: '.pagination-nested',
            direction: 'horizontal',
            autoplay: 3000,
            speed: 1000,
            loop : true,
            paginationClickable: true,
            autoplayDisableOnInteraction : false
        })

    }

    // 下方三模块筛选
    function cont_two(this_weid_two, name) {
        $.ajax({
            url: apiUrl + "cms/cate_categories?cate=" + this_weid_two,
            dataType: 'json',
            success: function(data){
                if(data.code == 200) {
                    var result = data.data;
                    if(name == "fzbg") {
                        result.forEach(function(value, index) {
                            report(value, value.thumb_imgs)
                        });
                    } else if(name == "rhsq") {
                        result.forEach(function(value, index) {
                            column_rhsq(value, value.thumb_imgs)
                        });
                    } else if(name == "cqsy") {
                        result.forEach(function(value, index) {
                            lunbo(value, value.thumb_imgs)
                        });
                    }
                }
            },
            error: function(xhr){
                console.log(xhr);
            }
        })
    }

    // 组织一级分类
    var column_list = function(data) {
        var thumb_image = data.thumb_image;
        if (thumb_image.indexOf('http') != 0 && thumb_image != "") {
            thumb_image = imgSet(thumb_image, 45, 40, 3);
        }

        var template2 = function(children) {
            children = children.reverse();
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
        url: apiUrl + "cms/cate_tree_by_channel?channel=" + domain_weid,
        dataType: 'json',
        success: function(data){
            console.log(data.data);
            data.data.forEach(function(item, index) {
                if(item.title == '入会申请') {
                    $(".dier").append(`
                        <p class="title">`+ item.title +`</p>
                        <ul id="ruhuishenqing" name="`+ item.weid +`"></ul>`
                    );
                    cont_two(item.weid, "rhsq");
                } else if(item.title == "发展报告") {
                    $(".diyi .title").text(item.title);
                    cont_two(item.weid, "fzbg");
                } else if(item.title == "长青事业") {
                    $(".disan .title").text(item.title);
                    cont_two(item.weid, "cqsy");
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
                $(this).find(".sub").addClass("list_selected").show();
            },function() {
                $(this).find(".sub").removeClass("list_selected").hide();
            });
        },
        error: function(xhr){
            console.log(xhr);
        }
    });